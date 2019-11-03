
// https://github.com/gulpjs/gulp
// var gulp = require('gulp');
import gulp from "gulp";

// https://www.npmjs.com/package/gulp-image-resize
// var imageResize = require('gulp-image-resize');
import imageResize from "gulp-image-resize";

// var parallel = require("concurrent-transform");
import parallel from "concurrent-transform";

// var os = require("os");
import os from "os";

import { albums as FOLDER_NAMES } from "./albums.js";

const SIZES = [
  384,
  512,
  768,
  1024,
  1536,
  2048,
  6000
];

function generateImages(size, imagePath) {
  console.log('generateImages: ' + size + ' :: ' + imagePath);

  let options = {
    upscale: false,
    width: size
  }

  gulp.src(imagePath + "/original/*.{jpg,png}")
    .pipe(parallel(
      imageResize(options),
      os.cpus().length
    ))
    .pipe(gulp.dest(imagePath + "/" + size + "-wide"))
    .on('end', generateNext);
}

let nextCursor = 0;
let nextImagePath;
function generateNext() {
  if (nextCursor < SIZES.length) {
    console.log('generateNext: ' + nextCursor + ' :: ' + SIZES[nextCursor] + ' :: ' + nextImagePath);
    generateImages(SIZES[nextCursor], nextImagePath);
    nextCursor++;
  } else {
    generateNextFolder();
  }
}

let nextFolderCursor = 0;
function generateNextFolder() {
  if (nextFolderCursor < FOLDER_NAMES.length) {
    console.log('generateNextFolder: ' + nextFolderCursor + ' :: ' + FOLDER_NAMES[nextFolderCursor]);

    nextCursor = 0;
    nextImagePath = `pictures/${ FOLDER_NAMES[nextFolderCursor] }`;
    generateNext();

    nextFolderCursor++;
  }
}

// Generate images
nextFolderCursor = 0;
generateNextFolder();

