const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  target: "web",
  entry: {
    /**
     * webpack-dev-server überwacht den Code von diesem Einstiegspunkt aus
     * und kompiliert den Code neu, sobald Änderungen gemacht werden.
     * In diesem Fall ist der Haupteinstigespunkt die index.ts Datei unseres Blueprints.
     */
    main: "./src/index.ts",
  },
  devServer: {},
  resolve: {
    // Informiere Webpack darüber, welche Dateien für den Bundle-Prozess berücksichigt werden sollen.
    extensions: [".ts", ".js", "css", "d.ts"],
    modules: ["node_modules"],
  },
  performance: {
    maxEntrypointSize: 700000,
  },
  mode: "development",
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: { loader: "ts-loader", options: { transpileOnly: true } },
      },
    ],
  },
  plugins: [new HtmlWebpackPlugin({ template: "./index.html" })],
};
