"use strict";

var gulp = require("gulp");
var plumber = require("gulp-plumber");
var csso = require("gulp-csso");
var htmlmin = require("gulp-htmlmin");
var del = require("del");
var terser = require("gulp-terser");

gulp.task("html", function () {
  return gulp.src("source/index.html")
  .pipe(htmlmin({ collapseWhitespace: true }))
  .pipe(gulp.dest("build"));
});

gulp.task("manifest", function () {
  return gulp.src("source/manifest.json")
  .pipe(gulp.dest("build"));
});

gulp.task("css", function () {
  return gulp.src("source/css/style.css")
  .pipe(plumber())
  .pipe(csso())
  .pipe(gulp.dest("build/css"))
});

gulp.task("clean", function (){
  return del("build");
});

gulp.task("scripts", function() {
  return gulp.src(["source/js/script.js", "source/service-worker.js"], {
    base: "source"
  })
  .pipe(terser())
  .pipe(gulp.dest("build"));
});

gulp.task("copy", function (){
  return gulp.src([
    "source/img/*.*"
  ], {
    base: "source"
  })
  .pipe(gulp.dest("build"));
});

gulp.task("build", gulp.series("clean", "copy", "css", "scripts", "html", "manifest"));

gulp.task("start", gulp.series("build"));
