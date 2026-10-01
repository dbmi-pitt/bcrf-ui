# Base
FROM node:22-bookworm-slim AS base

# Install git for pnpm workspaces
RUN apt-get update && apt-get install -y --no-install-recommends git ca-certificates \
    && rm -rf /var/lib/apt/lists/*

RUN corepack enable
WORKDIR /usr/src/app

# Dependencies
FROM base AS deps

# Copy workspace manifests and lockfile
COPY pnpm-workspace.yaml package.json ./

RUN pnpm install

# Builder
FROM base AS builder

COPY --from=deps /usr/src/app/node_modules ./node_modules

COPY next.config.mjs jsconfig.json package.json pnpm-workspace.yaml ./
COPY .env.production .env.production
COPY public ./public
COPY src ./src

# Copy prebuilt databases
COPY duckdb.db ./duckdb.db

# Compile stylus css
RUN pnpm exec stylus --include-css --compress src/styles/main.styl -o src/app/main.css

ENV NODE_ENV=production
ARG DUCK_DB_PATH
ENV DUCK_DB_PATH=$DUCK_DB_PATH

RUN pnpm build

# Prepare DuckDB runtime dependencies for the standalone image
RUN mkdir -p /duckdb-runtime/node_modules/.pnpm \
    /duckdb-runtime/node_modules/@duckdb \
    && cp -a node_modules/.pnpm/@duckdb+node-api@* \
        /duckdb-runtime/node_modules/.pnpm/ \
    && cp -a node_modules/.pnpm/@duckdb+node-bindings@* \
        /duckdb-runtime/node_modules/.pnpm/ \
    && cp -a node_modules/.pnpm/@duckdb+node-bindings-linux-*@* \
        /duckdb-runtime/node_modules/.pnpm/ \
    && cp -a node_modules/.pnpm/detect-libc@* \
        /duckdb-runtime/node_modules/.pnpm/ \
    && cp -a --no-dereference node_modules/@duckdb/node-api \
        /duckdb-runtime/node_modules/@duckdb/

# Final
FROM node:22-bookworm-slim AS final
WORKDIR /usr/src/app

ENV NODE_ENV=production
ARG PORT_MAPPING
ENV PORT=$PORT_MAPPING
ENV HOSTNAME="0.0.0.0"

# Install curl for healthcheck
RUN apt-get update && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user
ARG HOST_GID=1002
ARG HOST_UID=1002
RUN addgroup --system --gid $HOST_GID codcc \
    && adduser --system --uid $HOST_UID --ingroup codcc codcc

# Standalone output bundles only what is needed at runtime
COPY --from=builder --chown=codcc:codcc /usr/src/app/duckdb.db ./duckdb.db
COPY --from=builder --chown=codcc:codcc /usr/src/app/public ./public
# Next.js standalone output
COPY --from=builder --chown=codcc:codcc /usr/src/app/.next/standalone ./
COPY --from=builder --chown=codcc:codcc /usr/src/app/.next/static ./.next/static

# Copy DuckDB native runtime dependencies
COPY --from=builder --chown=codcc:codcc /duckdb-runtime/node_modules ./node_modules

# Verify DuckDB native module loads successfully
RUN node -e "import('@duckdb/node-api').catch(err => { console.error(err); process.exit(1); })"

# Make app directory owned by codcc
RUN chown -R codcc:codcc /usr/src/app

USER codcc

EXPOSE $PORT

CMD ["node", "server.js"]
