// https://github.com/michael-ciniawsky/postcss-load-config
// https://github.com/postcss/postcss/blob/HEAD/README.cn.md

module.exports = {
  "plugins": {
    // 引入内联样式表的方法
    'postcss-import': {},
    'postcss-cssnext': {
      'warnForDuplicates': false
    },
    "postcss-px-to-viewport": {
      unitToConvert: 'px',
      viewportWidth: 10800,
      unitPrecision: 5,
      propList: ['*'],
      viewportUnit: 'rem',
      fontViewportUnit: 'rem',
      selectorBlackList: ['.ignore', '.hairlines','.mobileSelect'],
      minPixelValue: 1,
      mediaQuery: false,
      replace: true,
      exclude: [],
    },
    // 自动添加前缀
    "autoprefixer": {
      "browsers": [
        "> 1%",
        "last 6 versions",
        "not ie <= 8"
      ]
    },
    // 压缩和优化样式表的功能
    // "cssnano": {
    //   'zindex': false
    // },
    // 允许你将多个相同的媒体查询合并到一起
    "css-mqpacker": {}
  }
}
