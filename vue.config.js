module.exports = {
  publicPath:
    process.env.NODE_ENV === "production"
      ? "/brainfuck-online-simulator/"
      : "/",
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.bf$/i,
          type: "asset/source",
        },
      ],
    },
  },
};
