FROM bluenviron/mediamtx:latest AS mediamtx

FROM alpine:latest
RUN apk add --no-cache curl
COPY --from=mediamtx /mediamtx /mediamtx
ENTRYPOINT ["/mediamtx"]