const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.ts",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: { loader: "ts-loader", options: { transpileOnly: true } },
      },
    ],
  },
  resolve: {
    // Informiere Webpack darüber, welche Dateien für den Bundle-Prozess berücksichigt werden sollen.
    extensions: [".ts", ".js", "css"],
  },
  optimization: {
    minimize: true,
  },
  performance: {
    maxEntrypointSize: 700000,
  },
  mode: "production",
  output: {
    path: path.resolve(__dirname).concat("/public"),
    filename: "bundled.js",
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "./index.html",
    }),
  ],
};
