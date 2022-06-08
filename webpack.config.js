const path = require("path");
const webpack = require("webpack");

module.exports = {
  target: "webworker",
  entry: "./src/worker.js",
  output: {
    filename: "worker.js",
    path: path.resolve(__dirname, "./public/static/js"),
  },
  resolve: {
    modules: ["node_modules"],
    extensions: [".js", ".json"],
  },

  plugins: [new webpack.HotModuleReplacementPlugin()],
};
