// NodeJS modules
const path = require('path');

// Webpack plugins
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');

// Access the fields to configure webpack
const pkgVars = require('./package.json');

// Destructure variables from pkgVars.config
const {entry, sourceDir, buildDir, port} = pkgVars.config;

// Get the script name, how to execute webpack, dev or build
const currentTask = process.env.npm_lifecycle_event;

// Common style configuration
const styleConfig = {
  test: /\.scss$/i,
  use: [
    'css-loader',
    {
      loader: 'postcss-loader',
      options: {
        postcssOptions: {
          plugins: [
            'autoprefixer'
          ]
        }
      }
    },
    "sass-loader"
  ]
}

// Common webpack configuration
const config = {
  entry: `./${sourceDir}/assets/js/${entry}.js`,
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: `./${sourceDir}/index.html`
    })
  ],
  module: {
    rules: [
      styleConfig
    ]
  }
};

// Webpack development configuration
if (currentTask === 'dev') {

  // Output for the bundles
  config.output = {
    // optional
    filename: `${entry}.js`,
    path: path.resolve(__dirname, sourceDir),
    assetModuleFilename: './assets/img/[name][ext]'
  };

  // Dev server
  config.devServer = {
    static: {
      directory: path.join(__dirname, sourceDir)
    },
    port
  };

  // Add the style-loader, to add styles to the DOM
  styleConfig.use.unshift('style-loader');

}

// Webpack production configuration
if (currentTask === 'build') {

  // Output for the bundles
  config.output = {
    path: path.resolve(__dirname, buildDir),
    filename: `./assets/js/${entry}.[chunkhash].js`,
    assetModuleFilename: './assets/img/[name][ext]'
  };

  // Babel configuration
  config.module.rules.push({
    test: /\.js$/i,
    exclude: /(node_modules)/,
    use: {
      loader: 'babel-loader',
      options: {
        presets: [
          '@babel/preset-env'
        ]
      }
    }
  });

  // Add a loader to extract the styles in css file
  styleConfig.use.unshift({
    loader: MiniCssExtractPlugin.loader
  });

  // Code optimization
  config.optimization = {
    minimize: true,
    minimizer: [
      new TerserWebpackPlugin,
      new CssMinimizerWebpackPlugin
    ]
  }

  // Plugins
  config.plugins.push(
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: './assets/css/styles.[chunkhash].css'
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: `./${sourceDir}/assets/img/`,
          to: './assets/img/'
        }
      ]
    })
  );

}

// Export the config object
module.exports = config;

