module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "./" : "/",
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.bf$/i,
          use: "raw-loader",
        },
      ],
    },
  },
};
