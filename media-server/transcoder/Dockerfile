FROM node:20-alpine

RUN apk add --no-cache ffmpeg curl && \
    curl -sL https://dl.min.io/client/mc/release/linux-amd64/mc -o /usr/local/bin/mc && \
    chmod +x /usr/local/bin/mc

WORKDIR /app

COPY package.json server.js ./

RUN npm install --omit=dev

EXPOSE 3000

CMD ["node", "server.js"]
