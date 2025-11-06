import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { sentryVitePlugin } from '@sentry/vite-plugin';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
  //  sentryVitePlugin({
  //    org: "ucc-bj", // el slug exacto de tu organización (en minúsculas normalmente)
  //    project: "green-frontend", // el slug exacto del proyecto en Sentry
  //    authToken: process.env.SENTRY_AUTH_TOKEN, // definido en Vercel
  //    release: process.env.VERCEL_GIT_COMMIT_SHA, // 🔹 usa el commit actual de Vercel
  //    sourcemaps: {
  //      assets: "./dist/**",
  //      ignore: ["node_modules"],
  //      validate: true,
  //    },
  //    telemetry: false, // opcional, evita logs extra
  //  }),
  ],
  build: {
    sourcemap: true, // 🔹 necesario para que Sentry tenga los source maps
  },
});
