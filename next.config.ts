import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  /**
   * PGlite ships Postgres as WASM and resolves its assets at runtime. Bundling
   * it breaks that resolution — the loader hands Node a URL where a path is
   * expected — so it has to stay an external require on the server.
   */
  serverExternalPackages: ["@electric-sql/pglite"],
};

export default nextConfig;
