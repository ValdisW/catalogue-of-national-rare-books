module.exports = {
  devServer: {
    proxy: {
      "/data": {
        target: "http://localhost:4000",
        pathRewrite: { "^/data": "" },
        ws: true,
        changeOrigin: true,
      },
    },
  },
};
