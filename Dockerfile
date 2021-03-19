FROM node:15.0.0-alpine AS build
WORKDIR /src
COPY . ./
RUN apk add --no-cache bash && \
    npm ci && \
    npm run build && \
    ./node_modules/.bin/node-prune && \
    npm prune --production && \
    mkdir output && \
    mv package.json output/ && \
    mv package-lock.json output/ && \
    mv bin output/ && \
    mv dist output/ && \
    mv node_modules output/

FROM alpine:3.11
WORKDIR /src
COPY --from=build /src/output .
RUN apk add --no-cache nodejs && \
    ln -s /src/bin/main.js /usr/bin/sitemap2urllist
ENTRYPOINT ["sitemap2urllist"]
CMD []
