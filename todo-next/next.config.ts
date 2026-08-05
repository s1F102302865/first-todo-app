import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* SQLiteなどのネイティブモジュールをバンドル対象から除外 */
  serverExternalPackages: ["sqlite3", "better-sqlite3", "sqlite"],
};

export default nextConfig;