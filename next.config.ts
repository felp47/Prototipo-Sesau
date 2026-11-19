import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  // Rotas antigas/duplicadas apontam para a rota correspondente da arquitetura
  async redirects() {
    return [
      { source: "/portal", destination: "/", permanent: true },
      { source: "/postos", destination: "/institucional/acesso-funcionamento/mapa-de-postos", permanent: true },
      { source: "/remedios", destination: "/farmacia/acesso-medicamentos/fornecimento-e-estoque", permanent: true },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
