const 
    gulp = require("gulp"),
    concat = require("gulp-concat"),
    cssNano= require("gulp-cssnano"),
    uglify = require("gulp-uglify"),
    sass = require("gulp-sass"),
    babel = require("gulp-babel"),
    gzip = require("gulp-gzip")

sass.compiler = require("node-sass")

gulp.task("sass",()=>{
    return gulp.src("./dev/scss/index.scss")
        .pipe(sass({sourceMap:true}).on("error",sass.logError))
        .pipe(gulp.dest("./src/css/"))
})

gulp.task("minify",async()=>{
    return gulp.src([
        "./src/css/index.css"
    ])
        .pipe(concat("index.css"))
        .pipe(cssNano())
        .pipe(gulp.dest("./src/opt/"))
})

gulp.task("babelify",()=>{
    return gulp.src("./dev/js/index.js")
        .pipe(babel())
        .pipe(gulp.dest("./src/js/"))
})

gulp.task("uglify",()=>{
    return gulp.src("./src/js/index.js")
    .pipe(concat("index.js"))
    .pipe(uglify())
    .pipe(gulp.dest("./src/opt/"))
})

gulp.task("build",async()=>{
    gulp.parallel(gulp.series("sass","minify"),gulp.series("babelify","uglify"),"compress")
    
})

gulp.task("compress",()=>{
    return gulp.src([
        "./src/opt/*",
        "./src/fonts/*"
    ])
    .pipe(gzip())
    .pipe(gulp.dest("./src/comp"))
})

gulp.task("watch",()=>{
    gulp.watch(["./dev/scss/*/*.scss","./dev/scss/*.scss"],
        gulp.series("sass","minify")
    )
    // gulp.watch("./dev/js/*.js",
    //     gulp.series("babelify","uglify")
    // )
})