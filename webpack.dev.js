const path = require("path");

module.exports = {
  mode: "development",
  devtool: "inline-source-map",
  entry: {
    app: "./src/js/index.js"
  },
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "build/js")
  }
};
