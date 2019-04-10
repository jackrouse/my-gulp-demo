const config = require('./config')
const fs = require('fs');
const path = require('path')
// const merge = require('merge-stream');
const chalk = require('chalk')
const gulp = require('gulp')
const inlinesource = require('gulp-inline-source')
const gulpif = require('gulp-if')
const htmlmin = require('gulp-htmlmin')
const fileinclude = require('gulp-file-include')
const sass = require('gulp-sass')
const postcss = require('gulp-postcss')
const cleanCSS = require('gulp-clean-css')
const plumber = require('gulp-plumber')
const notify = require('gulp-notify')
const cache  = require('gulp-cache')
const imagemin = require('gulp-imagemin')
const pngquant = require('imagemin-pngquant')
const rev = require('gulp-rev')
const revCollector = require('gulp-rev-collector')
const revRewrite = require('gulp-rev-rewrite')
const replace = require('gulp-replace');
const uglify = require('gulp-uglify-es').default
// const uglify = require('gulp-uglify')
const eslint = require('gulp-eslint')
// const stripDebug = require('gulp-strip-debug')
const babel = require('gulp-babel')
const sequence = require('gulp-sequence')
const zip = require('gulp-zip')
const del = require('del')
const spritesmith   = require('gulp.spritesmith'); // 生成雪碧图 https://github.com/twolfson/gulp.spritesmith
// webpack
const webpack = require('webpack')
const webpackStream = require('webpack-stream')
const webpackConfig = require('./webpack.config.js')

// server
const browserSync = require('browser-sync').create()
const reload = browserSync.reload

// NODE_ENV
const env = process.env.NODE_ENV || 'development'
const condition = env === 'production'
const staticPath = condition ? (config.assetsPublicPath + config.assetsSubDirectory) : '/'+config.assetsSubDirectory
const envConfig = condition ? config.build.env : config.dev.env
function respath(dir) {
  return path.join(__dirname, './', dir)
}

function onError(error) {
  const title = error.plugin + ' ' + error.name
  const msg = error.message
  const errContent = msg.replace(/\n/g, '\\A ')

  notify.onError({
    title: title,
    message: errContent,
    sound: true
  })(error)

  this.emit('end')
}

var srcDir = config.dev.sprite
/**
 * 获取获取文件名字和路径
 * @returns
 */
var iconFolder = function() {
    var filesSrc = []; // 文件路径
    var filesName = []; // 文件名字
    // 遍历获取文件名字和路径
    fs.readdirSync(srcDir).forEach(function(file, i){
        var reg = /\.(png|jpg|gif|ico)/g;
        var isImg = file.match(reg);

        // 判读是  file.indexOf('sprite') != -1
        if(!isImg){
            filesName.push(file);
            filesSrc.push(path.resolve(srcDir, file, '*.{png,jpg}'));
        }
    });
    // 返回文件名字和路径
    return {
        'name': filesName,
        'src' : filesSrc
    };;
}

/**
 *
 * 支持多个文件夹编译生成雪碧图
 * 雪碧图制作规定要求
 * 在images文件夹下icon文件夹,新建一个文件夹就可以
 *
 */
// var csssPrites = function() {
//     var folder = iconFolder();
//     var folderName = folder.name;
//     var folderSrc = folder.src;
//     var tasks = folderSrc.map(function (item, i) {
//         var imgName = `images/icon/icon_${folderName[i]}.png`;
//         var cssName = `styles/sprite_css/_icon_${folderName[i]}.scss`;
//         var imgPath = `../images/icon/icon_${folderName[i]}.png`;
//         return gulp.src(item) // 需要合并的图片地址
//             .pipe(spritesmith({
//                 imgName: imgName, // 保存合并后图片的地址
//                 cssName: cssName, // 保存合并后对于css样式的地址
//                 imgPath: imgPath,
//                 padding: 10,  // 合并时两个图片的间距
//                 algorithm: 'binary-tree', // 注释1
//                 cssTemplate: './scss.template.handlebars' // 模板
//                 // cssTemplate: function (data) {
//                 //     var arr=[];
//                 //     data.sprites.forEach(function (sprite) {
//                 //         arr.push(".icon-"+sprite.name+
//                 //         "{" +
//                 //         "background-image: url('"+sprite.escaped_image+"');"+
//                 //         "background-position: "+sprite.px.offset_x+"px "+sprite.px.offset_y+"px;"+
//                 //         "width:"+sprite.px.width+";"+
//                 //         "height:"+sprite.px.height+";"+
//                 //         "}\n");
//                 //     });
//                 //     return arr.join("");
//                 // }
//             }))
//             .pipe(gulp.dest('src/static'));
//     })
//     return merge(tasks);
// }



/* 生成雪碧图 */
// gulp.task('sprites', function () {

//   //console.log(config.dev.images)
//     // 执行任务
//     csssPrites();
// });

// 生成环境变量
gulp.task('injectEnv', () => {
  fs.writeFile(config.dev.envConfig, 'export default ' + JSON.stringify(envConfig))
})

function cbTask(task) {
  return new Promise((resolve, reject) => {
    del(respath('dist'),respath('rev'))
    .then(paths => {
      console.log(chalk.green(`
      -----------------------------
        Clean tasks are completed
      -----------------------------`))
      sequence(task, () => {
        console.log(chalk.green(`
        -----------------------------
          All tasks are completed
        -----------------------------`))
        resolve('completed')
      })
    })
  })
}

gulp.task('html', () => {
  const manifest = gulp.src('rev/**/*.json')
  return gulp.src(config.dev.html)
    .pipe(plumber(onError))
    .pipe(inlinesource())
    .pipe(fileinclude({
      prefix: '@@',
      basepath: respath('src/include/')
    }))
    .pipe(replace('@STATIC',staticPath))
    .pipe(gulpif(condition,revRewrite({ manifest })))
    .pipe(gulpif(condition, htmlmin({
      // removeComments: true,
      // collapseWhitespace: true,
      minifyJS: true,
      minifyCSS: true
    })))
  //   .pipe(cdn({
  //     dir: './dist',
  //     root: {
  //         js: 'http://cdn.example.com/somename',
  //         css: 'http://cdn.example.com/somename'
  //     }
  // }))
    .pipe(gulp.dest(config.build.html))
})


gulp.task('runrev', () => {
  return gulp.src(['rev/**/*.json','dist/**/*.html'])
  .pipe(plumber(onError))
  .pipe(revCollector({
    replaceReved: true,
    dirReplacements: {
        // '@css/': '/dist/static/css',
        // '@js/': '/dist/static/js',
        // '@cdn/': function(manifest_value) {
        //   return '//hot.fdc.com.cn/2018zt/worldcup' + manifest_value;
        // }
      'static/': config.assetsPublicPath
    }
  }))
  .pipe(gulp.dest(config.build.html))
})

gulp.task('styles', () => {
  // var revManifest = JSON.parse(fs.readFileSync('rev/img/rev-manifest.json', {
  //   encoding: 'utf-8'
  // }))
  const manifest = gulp.src('rev/img/rev-manifest.json')

  // console.log(revManifest)
  return gulp.src(config.dev.styles)
    .pipe(plumber(onError))
    .pipe(sass())
    .pipe(gulpif(condition, cleanCSS({debug: true})))
    .pipe(postcss('./.postcssrc.js'))
    // .pipe(gulpif(condition,
    //   replace(new RegExp("url\\((\"|'?)(.+?)(\\1)\\)", 'gm'), function (match, seperator, url) {
    //     // console.log(match, seperator, url)
    //     var result = match
    //     // if (result.indexOf(staticHolder) > -1) {
    //       // result = result.replace(staticHolder, paths.remote.baseUrl + '/static')
    //       Object.keys(revManifest).forEach(key => {
    //         if (result.indexOf(key) > -1) {
    //           result = result.replace(key, revManifest[key])
    //         }
    //       })
    //     // }
    //     return result
    //   })))
    .pipe(gulpif(condition,revRewrite({ manifest })))
    .pipe(gulpif(condition, rev()))
    .pipe(replace('@STATIC',staticPath))
    .pipe(gulp.dest(config.build.styles))
    .pipe(gulpif(condition,rev.manifest()))
    .pipe(gulpif(condition,gulp.dest('rev/css')))
})

gulp.task('images', () => {
  return gulp.src(config.dev.images)
    .pipe(plumber(onError))
    .pipe(cache(imagemin({
      progressive: true, // 无损压缩JPG图片
      svgoPlugins: [{removeViewBox: false}], // 不移除svg的viewbox属性
      use: [pngquant()] // 使用pngquant插件进行深度压缩
    })))
    // .pipe(imagemin({
    //   progressive: true, // 无损压缩JPG图片
    //   svgoPlugins: [{removeViewBox: false}], // 不移除svg的viewbox属性
    //   use: [pngquant()] // 使用pngquant插件进行深度压缩
    // }))
    .pipe(gulpif(condition, rev()))
    .pipe(gulp.dest(config.build.images))
    .pipe(gulpif(condition,rev.manifest()))
    .pipe(gulpif(condition,gulp.dest('rev/img')))
})

gulp.task('eslint', () => {
  return gulp.src(config.dev.script)
   .pipe(plumber(onError))
  //  .pipe(gulpif(condition, stripDebug()))
   .pipe(eslint({ configFle: './.eslintrc' }))
   .pipe(eslint.format())
   .pipe(eslint.failAfterError());
})


const useEslint = config.useEslint ? ['eslint'] : [];
gulp.task('script', useEslint, () => {
  return gulp.src(config.dev.scriptjs)
    .pipe(plumber(onError))
    .pipe(gulpif(condition, babel({
      presets: ['env']
    })))
    .pipe(gulpif(config.useWebpack, webpackStream(webpackConfig, webpack),gulpif(condition, uglify())))
    // .pipe()
    .pipe(gulpif(condition, rev()))
    .pipe(gulp.dest(config.build.script))
    .pipe(gulpif(condition,rev.manifest()))
    .pipe(gulpif(condition,gulp.dest('rev/js' )))
})

gulp.task('static', () => {
  return gulp.src(config.dev.static)
    .pipe(gulp.dest(config.build.static))
})


gulp.task('clean', () => {
  del('./dist').then(paths => {
    console.log('Deleted files and folders:\n', paths.join('\n'));
  });
})

gulp.task('watch', () => {
  gulp.watch(config.dev.allhtml, ['html']).on('change', reload)
  gulp.watch(config.dev.styles, ['styles']).on('change', reload)
  gulp.watch(config.dev.script, ['script']).on('change', reload)
  gulp.watch(config.dev.images, ['images']).on('change', reload)
  gulp.watch(config.dev.static, ['static']).on('change', reload)
  // gulp.watch(config.dev.sprite, ['sprites']).on('change', reload)
})

gulp.task('zip', () => {
  return gulp.src(config.zip.path)
  .pipe(plumber(onError))
  .pipe(zip(config.zip.name))
  .pipe(gulp.dest(config.zip.dest))
})

gulp.task('server', () => {
  const task = ['injectEnv','script', 'images','styles','html','static']
  cbTask(task).then(() => {
    browserSync.init(config.server)
    console.log(chalk.cyan('  Server complete.\n'))
    gulp.start('watch')
  })
})

gulp.task('build', () => {
  const task = ['injectEnv','script', 'images', 'styles','html','static']
  cbTask(task).then(() => {
    console.log(chalk.cyan('  Build complete.\n'))
    // gulp.start('runrev',()=>{
    //   console.log(chalk.cyan('  runrev complete.\n'))
    // })
    if (config.productionZip) {
      gulp.start('zip', () => {
        console.log(chalk.cyan('  Zip complete.\n'))
      })
    }
  })
})

gulp.task('default', () => {
  console.log(chalk.green(
   `
  Build Setup
    开发环境： npm run dev
    生产环境： npm run build
    执行压缩： gulp zip
    编译页面： gulp html
    编译脚本： gulp script
    编译样式： gulp styles
    语法检测： gulp eslint
    压缩图片： gulp images
    `
  ))
})
