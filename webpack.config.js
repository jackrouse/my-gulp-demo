const fs = require('fs')
const path = require('path')
// const webpack = require('webpack')
const srcDir = path.resolve(process.cwd(), './src/static/')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
// const HtmlWebpackPlugin = require('html-webpack-plugin')
// const MiniCssExtractPlugin = require('mini-css-extract-plugin')

function resolve(dir) {
  return path.join(__dirname, './', dir)
}

function getEntry() {
    var jsPath = path.resolve(srcDir, 'js')
    var dirs = fs.readdirSync(jsPath)
    var matchs = []
    var files = {}
    dirs.forEach((item) => {
        matchs = item.match(/(.+)\.js$/);
        if (matchs) {
          files[matchs[1]] = path.resolve(srcDir, 'js', item)
        }
    })
    // console.log(JSON.stringify(files))
    return files
}

// function getPages() {
//   var jsPath = resolve('src/views')
//   var dirs = fs.readdirSync(jsPath)
//   var matchs = []
//   var files = {}
//   dirs.forEach((item) => {
//       matchs = item.match(/(.+)\.html$/);
//       if (matchs) {
//         files[matchs[1]] = path.resolve(jsPath, item)
//       }
//   })
//   // console.log(JSON.stringify(files))
//   return files
// }

// var pages = getPages()
// var htmls = []
// Object.keys(pages).forEach(name => {
//   var templateUrl = pages[name]
//   var templateThunks = ['manifest', 'vendors', 'common', name]
//   htmls.push(new HtmlWebpackPlugin({
//     filename: name + '.html',
//     template: templateUrl, // 模板路径
//     inject: true,
//     chunks: templateThunks,
//     chunksSortMode: function (chunk1, chunk2) {
//       return templateThunks.indexOf(chunk1.names[0]) - templateThunks.indexOf(chunk2.names[0])
//     },
//     minify: {
//       // removeComments: true,
//       // collapseWhitespace: true,
//       // removeAttributeQuotes: true
//       // more options:
//       // https://github.com/kangax/html-minifier#options-quick-reference
//     }
//   }))
// })

const env = process.env.NODE_ENV
// const pluginList = []
// const uglify = new webpack.optimize.UglifyJsPlugin({
//   compress:{
//       warnings:false,
//   },
//   sourceMap: true
// })

// if(env === 'production'){
//   pluginList.push(uglify)
// }

module.exports = {
  mode:env || 'development',
  cache: true,
  entry: getEntry(),
  externals: {
    jquery: 'jQuery',
    Zepto: 'Zepto'
  },
  output: {
    path: __dirname + '/dist/static/',
    filename: '[name].js',
    chunkFilename: '[name].js'
  },

  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      '@': resolve('src')
    }
  },
  optimization: {
    minimize: true,
    runtimeChunk: {
      name: 'manifest'
    },
    splitChunks: {
      // chunks: 'async',
      // minSize: 30000,
      // minChunks: 1,
      // maxAsyncRequests: 5,
      // maxInitialRequests: 3,
      // name: true,
      cacheGroups: {
        common: {
          name: 'common',
          chunks: 'initial',
          minChunks: 2,
          maxInitialRequests: 5,
          minSize: 0
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'initial',
          priority: 10,
          enforce: true
        }
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        // exclude: /node_modules/,
        include: [resolve('src'), resolve('static'), resolve('node_modules/fdc-common')],
        use: [ 'babel-loader' ]
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(scss|css)$/,
        // exclude: /node_modules/,
        use: [
          // MiniCssExtractPlugin.loader,
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          { loader: 'sass-loader'},
          'postcss-loader'
        ]
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name].[ext]?[hash]',
              limit: 10000
            }
          }
        ]
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'fonts/[name].[hash:7].[ext]'
        }
      }
    ]
  },
  plugins:[
    new VueLoaderPlugin(),
    // extract css into its own file
    // new MiniCssExtractPlugin({
    //   // Options similar to the same options in webpackOptions.output
    //   // both options are optional
    //   // filename: utils.assetsPath('css/[name].[contenthash:12].css'),
    //   filename: 'css/[name].css',
    //   // chunkFilename: "[id].css"
    //   allChunks: true
    // }),
    // ...htmls
  ],
  devtool: '#source-map'
}

