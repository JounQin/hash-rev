const autoprefixer = require('autoprefixer'),
    clean = require('gulp-clean-css'),
    del = require('del'),
    gulp = require('gulp'),
    path = require('path'),
    postcss = require('gulp-postcss'),
    RevAll = require('gulp-rev-all'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    shell = require('gulp-shell'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify');

const sourceRoot = '/HashRev/build',
    scripts = ['build/**/js/*.js', '!build/**/bootstrap/*.js'];

const app = {
    scripts: scripts,
    styles: ['build/**/scss/*.scss'],
    copies: ['build/**/*.html'],
    build: 'build',
    dist: 'dist'
};

gulp.task('scripts', function () {
    return gulp.src(app.scripts)
        .pipe(sourcemaps.init())
        .pipe(uglify({mangle: false}))
        .pipe(sourcemaps.write('.', {
            includeContent: false,
            sourceRoot: sourceRoot
        }))
        .pipe(gulp.dest(app.dist));
});

gulp.task('styles', function () {
    return gulp.src(app.styles)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(postcss([
            autoprefixer({
                browsers: ['> 1% in CN']
            })
        ]))
        .pipe(clean())
        .pipe(rename(function (path) {
            path.dirname = path.dirname.replace('scss', 'css');
        }))
        .pipe(sourcemaps.write('.', {
            includeContent: false,
            sourceRoot: sourceRoot
        }))
        .pipe(gulp.dest(app.dist));
});


gulp.task('bs', function () {

});

gulp.task('copy', function () {
    return gulp.src(app.copies)
        .pipe(gulp.dest(app.dist));
});

gulp.task('del', function () {
    del([app.build, app.dist]);
});

gulp.task('rev', function () {
    var revAll = new RevAll({
        dontRenameFile: [/bootstrap\/.+/gi],
        replacer: function (fragment, replaceRegExp, newReference, referencedFile) {
            fragment.contents = fragment.contents.replace(replaceRegExp, function (matched, $1, $2, $3, $4) {
                return ($1 + newReference + $3 + $4).replace(/(\/|\.)scss(\/)?/g, '$1css$2');
            });
        }
    });
    return gulp.src('src/**')
        .pipe(revAll.revision())
        .pipe(gulp.dest(app.build))
        .pipe(revAll.manifestFile())
        .pipe(gulp.dest(app.build));
});

gulp.task('deploy', ['scripts', 'styles', 'copy']);

gulp.task('default', shell.task([
    'gulp del',
    'gulp rev',
    'gulp deploy'
]));
