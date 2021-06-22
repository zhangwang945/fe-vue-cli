const IsomorphicTemplateHtmlPlugin = require("@lanyi/isomorphic-template-html-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  // publicPath: "/",
  outputDir: "mdist",
  // pages: {
  //   index: "./src/main.js",
  // },
  chainWebpack: (config) => {
    config
      .plugin("IsomorphicTemplateHtmlPlugin")
      .use(IsomorphicTemplateHtmlPlugin, [
        HtmlWebpackPlugin,
        { serverDir: 'xx' },
      ]);
  },
};
