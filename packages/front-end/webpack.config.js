/* eslint-env node */

/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/explicit-function-return-type */

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const PnpWebpackPlugin = require("pnp-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require(`fork-ts-checker-webpack-plugin`);
const webpack = require("webpack");

module.exports = (env, argv) => {
  // Only start `fork-ts-checker-webpack-plugin` in development mode. The plugin
  // watches for file changes and performs type checking a separate thread to
  // avoid interfering with code transpilation. In a production build, type
  // checking is performed by calling `tsc --noEmit` once before webpack build
  // begins.
  const modeDependentPlugins =
    argv.mode === "development"
      ? [
          new ForkTsCheckerWebpackPlugin({
            checkSyntacticErrors: true,
          }),
        ]
      : [];

  return {
    entry: "./src/index.tsx",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "[name].[hash].js",
      publicPath: "/",
    },
    module: {
      rules: [
        {
          // Use babel with @babel/preset-typescript to transpile TypeScript
          // instead of ts-loader
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: require.resolve("babel-loader"),
        },
        {
          // `css-loader` converts a static CSS file into a Common JS module and
          // `style-loader` injects the CSS into a `style` tag in the
          // `document`'s `head`:
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
        {
          // Special settings for mjs files inside the `graphql` package:
          type: "javascript/auto",
          test: /\.mjs$/,
          use: [],
          include: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js", ".jsx"],
      plugins: [
        // This is necessary to make webpack work with Yarn PnP:
        PnpWebpackPlugin,
      ],
    },

    // This source map option allows us to see the code before transpilation,
    // just as it was authored. All modules are separated from each other:
    devtool: "source-map",

    // Do not show bundle information except when error happens:
    stats: "minimal",

    plugins: [
      ...modeDependentPlugins,
      new HtmlWebpackPlugin({
        template: "src/template.html",
      }),
      new webpack.DefinePlugin({
        // Pass `API_URL` environment variable, defined in `.env`:
        API_URL: JSON.stringify(process.env.API_URL),
      }),
    ],
    devServer: {
      contentBase: path.join(__dirname, "dist"),
      compress: true,

      // This allows `webpack-dev-server`, which is run from inside a container,
      // to listen to requests coming from the host:
      host: "0.0.0.0",

      port: process.env.PORT,
    },
    resolveLoader: {
      plugins: [
        // This is necessary to make webpack work with Yarn PnP:
        PnpWebpackPlugin.moduleLoader(module),
      ],
    },
  };
};
