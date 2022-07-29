module.exports = {
  devServer: {
    proxy: {
      "/data": {
        target: "http://localhost:4000/",
        // target: "http://47.242.118.110:4000",
        pathRewrite: { "^/data": "" },
        ws: true,
        changeOrigin: true,
      },
    },
  },
};
