/* eslint-env node */

/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/explicit-function-return-type */

const path = require("path");
const PnpWebpackPlugin = require("pnp-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require(`fork-ts-checker-webpack-plugin`);
const webpack = require("webpack");
const NodemonPlugin = require("nodemon-webpack-plugin");

module.exports = (env, argv) => {
  const modeDependentPlugins =
    argv.mode === "development"
      ? [
          new ForkTsCheckerWebpackPlugin({
            checkSyntacticErrors: true,
          }),
          new NodemonPlugin(),
        ]
      : [];

  return {
    entry: "./src/index.ts",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "main.js",
      publicPath: "/",
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: require.resolve("babel-loader"),
        },

        // Special settings for mjs files inside GraphQL package:
        {
          type: "javascript/auto",
          test: /\.mjs$/,
          use: [],
          include: /node_modules/,
        },
      ],
    },
    plugins: [
      ...modeDependentPlugins,
      new webpack.DefinePlugin({
        SERVER_PORT: process.env.PORT,
      }),
    ],
    target: "node",
    stats: "minimal",
    resolve: {
      extensions: [".ts", ".tsx", ".js", ".jsx"],
      plugins: [PnpWebpackPlugin],
    },
    resolveLoader: {
      plugins: [PnpWebpackPlugin.moduleLoader(module)],
    },
  };
};
