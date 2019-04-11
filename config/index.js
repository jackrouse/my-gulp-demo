const path = require('path')
const server = require('./server')

function resolveDev(dir) {
  return path.join(__dirname, '../src/', dir)
}

function resolveBuild(dir) {
  return path.join(__dirname, '../dist/', dir)
}

module.exports = {
  assetsSubDirectory:'static',
  assetsPublicPath:'//static.fdc.com.cn/',
  dev: {
    static: './static/**/*',
    html:  [resolveDev('/**/*.html'), '!./src/include/**/*'],
    allhtml: resolveDev('/**/*.html'),
    styles: resolveDev('static/styles/**/*.{scss,css}'),
    script: resolveDev('static/js/**/*.{js,vue}'),
    scriptjs: resolveDev('static/js/**/*.js'),
    images: resolveDev('static/images/**/*.{png,jpg,gif,svg}'),
    // images: [resolveDev('static/images/**/*.{png,jpg,gif,svg}'),!resolveDev('static/images/icon/**')],
    sprite: resolveDev('static/images/sprite'),
    envConfig:resolveDev('static/util/env.config.js'),
    "env": {
      NODE_ENV: 'development',
      upload_url: "http://sandbox.gw.fdc.com.cn",
      sandbox_url: "//gw.fdc.com.cn/router/rest",
      oldhouse_url: "http://oldhouse.new.m.test.fdc.com.cn/house2-",
      uc_url: "http://test.uc.fdc.com.cn/router/rest",
      homeapi_url: "http://test.homeapi.fdc.com.cn/router/rest",
      cms_api_url: "http://cmsapi.test.fdc.com.cn/router/rest",
      oldhouse_upload:"http://oldhouse.new.m.test.fdc.com.cn"
    }
  },

  build: {
    static: resolveBuild('static'),
    html: resolveBuild(''),
    styles: resolveBuild('static/css'),
    script: resolveBuild('static/js'),
    images: resolveBuild('static/images'),
    "env": {
      NODE_ENV: 'product',
      upload_url: "https://gw.fdc.com.cn",
      sandbox_url: "https://gw.fdc.com.cn/router/rest",
      oldhouse_url: "https://oldhouse.m.fdc.com.cn/house2-",
      uc_url: "https://gw.fdc.com.cn/router/rest",
      homeapi_url: "https://gw.fdc.com.cn/router/rest",
      cms_api_url: "https://gw.fdc.com.cn/router/rest",
      oldhouse_upload:"https://oldhouse.m.fdc.com.cn"
    }
  },

  zip: {
    name: 'gulpProject.zip',
    path: resolveBuild('**/*'),
    dest: path.join(__dirname, '../')
  },

  server,
  useEslint: true,
  useWebpack: true,
  useHash:true,
  productionZip: false
}
