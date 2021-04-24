var gulp = require('gulp');
var $    = require('gulp-load-plugins')();
var path = require('path');
var del  = require('del');
const { doesNotMatch } = require('assert');
const shell = require('gulp-shell');

var distPath    = path.resolve('./dist');
var version     = ''; // 版本号
var versionPath = ''; // 版本号路径
var env         = 'prod'; // 运行环境
  // 获取环境配置
// env = process.env.npm_config_qa ? 'qa' : process.env.npm_config_uat ? 'uat' : 'prod'
// 创建版本号(年月日时分)
(function () {
  var d = new Date();
  var yy = d.getFullYear().toString().slice(2);
  var MM = d.getMonth() + 1 >= 10 ? (d.getMonth() + 1) : '0' + (d.getMonth() + 1);
  var DD = d.getDate() >= 10 ? d.getDate() : '0' + d.getDate();
  var h  = d.getHours() >= 10 ? d.getHours() : '0' + d.getHours();
  var mm = d.getMinutes() >= 10 ? d.getMinutes() : '0' + d.getMinutes();
  version = yy + MM + DD + h + mm;
  versionPath = distPath + '/' + version;
})();

// 编译
function build(){
  // return shell.task('node build/build.js')
  return gulp.src('*.js', { read: false }).pipe(shell(['node build/build.js']))
}


// 创建版本号目录 
// 依赖 build
function create_versionCatalog() {
  return gulp.src(`${distPath}/static/**/*`)
    .pipe(gulp.dest(`${versionPath}/static/`))
}




// 替换${versionPath}/static/js/manifest.js window.SITE_CONFIG.cdnUrl占位变量
// 依赖 create_versionCatalog
function replace_cdnUrl() {
  return gulp.src(`${versionPath}/static/js/manifest.js`)
    .pipe($.replace(new RegExp(`"${require('./config').build.assetsPublicPath}"`, 'g'), 'window.SITE_CONFIG.cdnUrl + "/"'))
    .pipe(gulp.dest(`${versionPath}/static/js/`))
}

// 替换${versionPath}/static/config/index-${env}.js window.SITE_CONFIG['version']配置变量
// 依赖 create_versionCatalog
function replace_version() {
  return gulp.src(`${versionPath}/static/config/index-${env}.js`)
    .pipe($.replace(/window.SITE_CONFIG\['version'\] = '.*'/g, `window.SITE_CONFIG['version'] = '${version}'`))
    .pipe(gulp.dest(`${versionPath}/static/config/`))
}

// 合并${versionPath}/static/config/[index-${env}, init].js 至 ${distPath}/config/index.js
// 依赖 replace_version
function concat_config() {
  return gulp.src([`${versionPath}/static/config/index-${env}.js`, `${versionPath}/static/config/init.js`])
    .pipe($.concat('index.js'))
    .pipe(gulp.dest(`${distPath}/config/`))
}

// 清空
function clean() {
  return del([versionPath])
}
// 清空临时文件
function clean_tmp(){
  return del([`${distPath}/static`, `${versionPath}/static/config`])
}
// 依赖 clean
gulp.task('default', gulp.series(clean,build,create_versionCatalog,replace_cdnUrl,replace_version,concat_config,clean_tmp));
