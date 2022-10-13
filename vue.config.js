module.exports = {
  devServer: {
    proxy: {
      "/data": {
        target: "http://localhost:8080/",
        pathRewrite: { "^/data": "" },
        ws: true,
        changeOrigin: true,
      },
    },
  },
};
