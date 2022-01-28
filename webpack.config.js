const autoprefixer = require('autoprefixer');
const path = require('path')
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')
const HtmlWebPackPlugin = require("html-webpack-plugin")
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    server: './main.js',
  },
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
    filename: '[name].js'
  },
  target: 'node',
  node: {
    // Need this when working with express, otherwise the build fails
    __dirname: false,   // if you don't put this is, __dirname
    __filename: false,  // and __filename return blank or /
  },
  devServer: {
    https: {
        key: fs.readFileSync('/home/cortese/Sviluppo/CrmCom2/certs/crmcom2.wifinetcom.net.key'),
        cert: fs.readFileSync('/home/cortese/Sviluppo/CrmCom2/certs/crmcom2.wifinetcom.net.crt'),
        ca: fs.readFileSync('/home/cortese/Sviluppo/CrmCom2/certs/wifinetcomDevCA.pem')
    }
  },
  externals: [nodeExternals()], // Need this to avoid error when working with Express
  module: {
    rules: [
      {
        // Transpiles ES6-8 into ES5
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        // Loads the javacript into html template provided.
        // Entry point is set below in HtmlWebPackPlugin in Plugins 
        test: /\.html$/,
        use: [{ loader: "html-loader" }]
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: '/',
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin({patterns: [
      { from: './websrc', to: './websrc' }
    ]}),
    new HtmlWebPackPlugin({
      template: "./websrc/html/adminarea/vueapp/main.html",
      filename: "./websrc/html/adminarea/vueapp/main.html",
      excludeChunks: ['server']
    })
  ]
}

