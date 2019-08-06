const path = require("path");

module.exports = {
  mode: "production",
  entry: {
    app: "./src/js/index.js"
  },
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "build/js")
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]
          }
        }
      }
    ]
  }
};
