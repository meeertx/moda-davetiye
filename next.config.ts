import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Kullanıcı klasöründeki başıboş bir package-lock.json'ın kök olarak
  // seçilmesini engeller.
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
