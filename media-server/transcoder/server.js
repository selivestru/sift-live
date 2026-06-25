import { execFile } from "node:child_process";
import { createReadStream } from "node:fs";
import { mkdir, readdir, rm, stat, unlink } from "node:fs/promises";
import { join } from "node:path";
import { promisify } from "node:util";

import express from "express";
import { Client as MinioClient } from "minio";

const execFileAsync = promisify(execFile);

const PORT = 3000;
const TMP_DIR = "/tmp/hls";

const minioClient = new MinioClient({
  endPoint: process.env.MINIO_ENDPOINT.replace(/^https?:\/\//, "").split(
    ":",
  )[0],
  port: parseInt(
    process.env.MINIO_ENDPOINT.match(/:(\d+)$/)?.[1] || "9000",
    10,
  ),
  useSSL: process.env.MINIO_ENDPOINT.startsWith("https"),
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
});

const BUCKET = process.env.MINIO_BUCKET || "vods";
const BACKEND_URL =
  process.env.BACKEND_URL || "http://host.docker.internal:5000";

const CONTENT_TYPES = {
  ".m3u8": "application/vnd.apple.mpegurl",
  ".m4s": "video/iso.segment",
  ".mp4": "video/mp4",
  ".webp": "image/webp",
};

async function getVideoDuration(filePath) {
  try {
    const { stdout } = await execFileAsync("ffprobe", [
      "-v",
      "error",
      "-show_entries",
      "format=duration",
      "-of",
      "default=noprint_wrappers=1:nokey=1",
      filePath,
    ]);
    return Math.round(parseFloat(stdout.trim()) || 0);
  } catch {
    return 0;
  }
}

async function convertToHls(inputPath, outputDir) {
  await mkdir(outputDir, { recursive: true });

  await execFileAsync("ffmpeg", [
    "-i",
    inputPath,
    "-c",
    "copy",
    "-f",
    "hls",
    "-hls_time",
    "6",
    "-hls_playlist_type",
    "vod",
    "-hls_segment_type",
    "fmp4",
    "-hls_fmp4_init_filename",
    "init.mp4",
    "-hls_segment_filename",
    join(outputDir, "segment_%03d.m4s"),
    join(outputDir, "playlist.m3u8"),
  ]);
}

async function extractPoster(inputPath, outputDir, duration) {
  const posterTime = Math.max(10, Math.floor(duration * 0.25));
  const posterPath = join(outputDir, "poster.webp");

  await execFileAsync("ffmpeg", [
    "-i",
    inputPath,
    "-ss",
    String(posterTime),
    "-vframes",
    "1",
    "-c:v",
    "libwebp",
    "-quality",
    "90",
    posterPath,
  ]);

  console.log(`[transcoder] Poster extracted at ${posterTime}s`);
  return posterPath;
}

async function uploadDirectoryToMinio(localDir, objectPrefix) {
  const files = await readdir(localDir);

  for (const file of files) {
    const filePath = join(localDir, file);
    const fileStat = await stat(filePath);

    if (!fileStat.isFile()) continue;

    const ext = file.substring(file.lastIndexOf(".")).toLowerCase();
    const contentType = CONTENT_TYPES[ext] || "application/octet-stream";
    const objectName = `${objectPrefix}/${file}`;

    await minioClient.putObject(
      BUCKET,
      objectName,
      createReadStream(filePath),
      fileStat.size,
      {
        "Content-Type": contentType,
      },
    );
  }
}

async function ensureBucket() {
  const minioUrl = process.env.MINIO_ENDPOINT || "http://minio:9000";
  const accessKey = process.env.MINIO_ACCESS_KEY;
  const secretKey = process.env.MINIO_SECRET_KEY;

  try {
    await execFileAsync("mc", [
      "alias",
      "set",
      "local",
      minioUrl,
      accessKey,
      secretKey,
    ]);
    console.log(`[transcoder] MinIO alias set: local -> ${minioUrl}`);
  } catch (error) {
    console.error(`[transcoder] Failed to set MinIO alias:`, error.message);
    throw error;
  }

  try {
    await execFileAsync("mc", ["mb", "--ignore-existing", `local/${BUCKET}`]);
    console.log(`[transcoder] Bucket '${BUCKET}' ensured`);
  } catch (error) {
    console.error(`[transcoder] Failed to ensure bucket:`, error.message);
    throw error;
  }

  try {
    await execFileAsync("mc", [
      "anonymous",
      "set",
      "public",
      `local/${BUCKET}`,
    ]);
    console.log(`[transcoder] Bucket '${BUCKET}' set to public`);
  } catch (error) {
    console.error(`[transcoder] Failed to set bucket public:`, error.message);
    throw error;
  }
}

const app = express();
app.use(express.json());

app.post("/convert", async (req, res) => {
  const { recordingPath, streamId, channelId } = req.body;

  if (!recordingPath || !streamId || !channelId) {
    return res.status(400).json({
      error: "Missing required fields: recordingPath, streamId, channelId",
    });
  }

  console.log(
    `[transcoder] Converting ${recordingPath} for stream ${streamId}`,
  );

  const outputDir = join(TMP_DIR, streamId);
  const objectPrefix = `${channelId}/${streamId}`;

  res.status(202).json({ status: "processing" });

  try {
    const duration = await getVideoDuration(recordingPath);
    console.log(`[transcoder] Duration: ${duration}s`);

    await convertToHls(recordingPath, outputDir);
    console.log(`[transcoder] HLS conversion complete`);

    let posterExtracted = false;
    try {
      await extractPoster(recordingPath, outputDir, duration);
      posterExtracted = true;
    } catch (posterError) {
      console.error(
        `[transcoder] Poster extraction failed, continuing without poster:`,
        posterError.message,
      );
    }

    await ensureBucket();
    await uploadDirectoryToMinio(outputDir, objectPrefix);
    console.log(`[transcoder] Uploaded to MinIO: ${objectPrefix}/`);

    const posterUrl = posterExtracted ? `${objectPrefix}/poster.webp` : null;

    await fetch(`${BACKEND_URL}/api/stream/webhook/recording-ready`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ streamId, channelId, duration, posterUrl }),
    });
    console.log(`[transcoder] Notified backend`);

    await rm(outputDir, { recursive: true, force: true });
    await unlink(recordingPath).catch(() => {});
    console.log(`[transcoder] Cleanup complete`);
  } catch (error) {
    console.error(
      `[transcoder] Failed to process stream ${streamId}:`,
      error.message,
    );
    await rm(outputDir, { recursive: true, force: true });
  }
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

ensureBucket()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`[transcoder] Listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error(`[transcoder] Startup failed:`, error.message);
    process.exit(1);
  });
