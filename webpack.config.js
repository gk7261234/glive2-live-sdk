const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin"); 

const UMD = {
  entry: './src/index.ts',
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
            },
          },
        ],
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'glive2-live-sdk', // 以库的形式导出入口文件
    libraryTarget: 'umd' // 以库的形式导出入口文件时，输出的类型,这里是通过umd的方式来暴露library,适用于使用方import的方式导入npm包
  },
  optimization: {
    minimize: true,
    concatenateModules: true,
  },
  plugins: [
    new CleanWebpackPlugin(),
    // new CopyPlugin(
    //   {
    //     patterns: [
    //       {from: "src/types/", to: "types/"},
    //       {from: "src/constants/", to: "constants/"},
    //       {from: "src/index.d.ts", to: "index.d.ts"},
    //       {from: "src/assets/icon/eraser.png", to: "assets/icon/eraser.png"},
    //     ],
    //   }
    // )
  ]
};

const CLIENT = {
    entry: './src/index.ts',
    mode: 'production',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/
        },
        {
          test: /\.(png|jpg|gif)$/i,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 8192,
              },
            },
          ],
        }
      ]
    },
    resolve: {
      extensions: [ '.tsx', '.ts', '.js' ]
    },
    output: {
      filename: 'glive2-live-sdk.js',
      path: path.resolve(__dirname, 'browser'),
      library: 'glive2-live-sdk', // 以库的形式导出入口文件
      libraryTarget: 'window'// 以库的形式导出入口文件时，输出的类型。这里你导出的方法变量会挂载到window.demo上，适用于使用方通过window对象访问
    },
    optimization: {
      minimize: true
    },
    plugins: [
      new CleanWebpackPlugin()
    ]
};
module.exports = [UMD, CLIENT];