const del = require("del");
const browsersync = require("browser-sync").create();
const { src, dest, watch, series, parallel } = require("gulp");
const pug = require("gulp-pug");
const sass = require("gulp-sass");
const svgSprite = require("gulp-svg-sprite");
const postcss = require("gulp-postcss");
const htmlmin = require("gulp-htmlmin");
const objectFitFixes = require("postcss-object-fit-images");
const flexFixes = require("postcss-flexbugs-fixes");
const autoprefixer = require("autoprefixer");
const mqpacker = require("css-mqpacker");
const cssnano = require("cssnano");
const webpack = require("webpack");

const processors = [
  flexFixes,
  objectFitFixes,
  autoprefixer,
  mqpacker({
    sort: sortMediaQueries
  }),
  cssnano
];

function isMax(mq) {
  return /max-width/.test(mq);
}

function isMin(mq) {
  return /min-width/.test(mq);
}

function sortMediaQueries(a, b) {
  A = a.replace(/\D/g, "");
  B = b.replace(/\D/g, "");

  if (isMax(a) && isMax(b)) {
    return B - A;
  } else if (isMin(a) && isMin(b)) {
    return A - B;
  } else if (isMax(a) && isMin(b)) {
    return 1;
  } else if (isMin(a) && isMax(b)) {
    return -1;
  }

  return 1;
}

function browserSyncInit(done) {
  browsersync.init({
    server: {
      baseDir: "./build"
    },
    port: 3005,
    ui: {
      port: 3006
    },
    open: false
  });
  done();
}

function browserSyncReload(done) {
  browsersync.reload();
  done();
}

function cleanTask() {
  return del(["build"]);
}

function copyFontsTask() {
  return src("./src/fonts/*.{ttf,eot,woff,woff2}").pipe(dest("build/fonts"));
}

function copyImagesTask(done) {
  return src("./src/img/**/*.{jpg,png,jpeg,svg,gif}").pipe(dest("build/img"));
  done();
}

function svgSpriteTask() {
  const config = {
    mode: {
      symbol: {
        dest: ".",
        sprite: "sprite.svg",
        prefix: ".icon-%s",
        dimensions: "%s",
        example: false,
        render: {
          scss: {
            dest: "../../src/sass/generated/sprite.scss"
          }
        }
      }
    },
    svg: {
      xmlDeclaration: false,
      doctypeDeclaration: false
    }
  };

  return src("./src/svg-icons/*.svg")
    .pipe(svgSprite(config))
    .pipe(dest("./build/img"));
}

function pugTask() {
  return src("./src/pug/*.pug")
    .pipe(
      pug({
        pretty: "  "
      })
    )
    .pipe(dest("build"));
}

function pugBuildTask() {
  return src("./src/pug/*.pug")
    .pipe(pug())
    .pipe(
      htmlmin({
        collapseWhitespace: true,
        removeComments: true
      })
    )
    .pipe(dest("build"));
}

function sassTask() {
  return src("./src/sass/*.sass")
    .pipe(sass())
    .pipe(dest("build/css"));
}

function sassBuildTask() {
  return src("./src/sass/*.sass")
    .pipe(sass())
    .pipe(postcss(processors))
    .pipe(dest("build/css"));
}

function jsTask(done) {
  webpack(require("./webpack.dev")).run();
  done();
}

function jsBuildTask(done) {
  webpack(require("./webpack.prod")).run();
  done();
}

function pugWatch() {
  return watch("src/pug/**/*.pug", series("pugTask", "browserSyncReload"));
}

function sassWatch() {
  return watch("src/sass/**/*.sass", series("sassTask", "browserSyncReload"));
}

function jsWatch() {
  return watch("src/js/**/*.js", series("jsTask", "browserSyncReload"));
}

function svgIconsWatch() {
  return watch(
    "src/svg-icons/*.svg",
    series("svgSpriteTask", "sassTask", "browserSyncReload")
  );
}
function imagesWatch() {
  return watch("src/img/*", series("copyImagesTask", "browserSyncReload"));
}
function fontsWatch() {
  return watch("src/fonts/*", series("copyFontsTask", "browserSyncReload"));
}

function dev(done) {
  series(
    "cleanTask",
    "svgSpriteTask",
    parallel(
      "copyImagesTask",
      "copyFontsTask",
      "pugTask",
      "sassTask",
      "jsTask",
      "pugWatch",
      "sassWatch",
      "jsWatch",
      "svgIconsWatch",
      "imagesWatch",
      "fontsWatch",
      "browserSyncInit"
    )
  )(done);
}

function build(done) {
  series(
    "cleanTask",
    "svgSpriteTask",
    parallel(
      "pugBuildTask",
      "sassBuildTask",
      "jsBuildTask",
      "copyImagesTask",
      "copyFontsTask"
    )
  )(done);
}

exports.browserSyncInit = browserSyncInit;
exports.browserSyncReload = browserSyncReload;
exports.svgSpriteTask = svgSpriteTask;
exports.pugTask = pugTask;
exports.pugBuildTask = pugBuildTask;
exports.sassTask = sassTask;
exports.sassBuildTask = sassBuildTask;
exports.jsTask = jsTask;
exports.jsBuildTask = jsBuildTask;
exports.pugWatch = pugWatch;
exports.sassWatch = sassWatch;
exports.jsWatch = jsWatch;
exports.svgIconsWatch = svgIconsWatch;
exports.imagesWatch = imagesWatch;
exports.fontsWatch = fontsWatch;
exports.cleanTask = cleanTask;
exports.copyFontsTask = copyFontsTask;
exports.copyImagesTask = copyImagesTask;
exports.dev = dev;
exports.build = build;
