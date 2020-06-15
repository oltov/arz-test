const path = require(`path`);
const {CleanWebpackPlugin} = require(`clean-webpack-plugin`);

module.exports = {
  context: path.resolve(__dirname, `source`),
  mode: `development`,
  entry: {
    main: `./js/main.js`,
  },
  output: {
    filename: `[name].min.js`,
    path: path.join(__dirname, `build/js`),
  },
  plugins: [
    new CleanWebpackPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/
      },
    ],
  },
};
