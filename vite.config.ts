import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: [
      {
        find: "@",
        replacement: path.resolve(__dirname, "./src"),
      },
      {
        find: "#",
        replacement: path.resolve(__dirname, "./types"),
      },
    ],
  },
  server: {
    proxy: {
      "/data": {
        target: "http://localhost:8080",
        rewrite: (path) => path.replace(/^\/data/, ""),
        changeOrigin: true,
        ws: true,
      },
    },
  },
});

// module.exports = {
//   devServer: {
//     proxy: {
//       "/data": {
//         target: "http://localhost:8080/",
//         pathRewrite: { "^/data": "" },
//         ws: true,
//         changeOrigin: true,
//       },
//     },
//   },
// };
