const gulp = require("gulp");
const plumber = require("gulp-plumber");
const csso = require("gulp-csso");
const htmlmin = require("gulp-htmlmin");
const del = require("del");
const terser = require("gulp-terser");
const header = require("gulp-header");
const compilationTime = new Date();

const html = () => {
  return gulp.src("source/index.html")
  .pipe(htmlmin({ collapseWhitespace: true }))
  .pipe(gulp.dest("build"));
};

exports.html = html;

const manifest = () => {
  return gulp.src("source/manifest.json")
  .pipe(gulp.dest("build"));
};

exports.manifest = manifest;

const css = () => {
  return gulp.src("source/css/style.css")
  .pipe(plumber())
  .pipe(csso())
  .pipe(gulp.dest("build/css"));
};

exports.css = css;

const clean = () => {
  return del("build");
};

exports.clean = clean;

const script = () => {
  return gulp.src("source/js/script.js", {
    base: "source"
  })
  .pipe(terser())
  .pipe(gulp.dest("build"));
};

exports.script = script;

const worker = () => {
  return gulp.src("source/service-worker.js", {
    base: "source"
  })
  .pipe(header("const uniqueSN='" + compilationTime.getMonth() + compilationTime.getDate() + compilationTime.getHours() + Math.floor(Math.random()*100) + "';"))
  .pipe(terser())
  .pipe(gulp.dest("build"));
};

exports.worker = worker;

const copy = () => {
  return gulp.src([
    "source/img/*.*"
  ], {
    base: "source"
  })
  .pipe(gulp.dest("build"));
};

exports.copy = copy;

exports.default = gulp.series(
  clean,
  gulp.parallel(
    copy,
    html,
    css,
    script,
    worker,
    manifest,
  ),
);
