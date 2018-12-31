/// <binding ProjectOpened='ftp-deploy-watch' />
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var htmlbuild = require('gulp-htmlbuild');
var es = require('event-stream');
var uglify = require('gulp-uglify');
var cleanCss = require('gulp-clean-css');
var rename = require('gulp-rename');
var pkg = require('./package.json');
var livereload = require('gulp-livereload');
var jshint = require('gulp-jshint');
var del = require('del');
var map = require('map-stream');
var ftp = require('vinyl-ftp');
var gutil = require('gulp-util');
var gulpFilter = require('gulp-filter');
var mainBowerFiles = require('main-bower-files');
var server = require('gulp-server-livereload');
var plumber = require('gulp-plumber');
var dirs = pkg['sr2-config'].directories;
var cleanCSS = require('gulp-clean-css');

// pipe a glob stream into this and receive a gulp file stream
var gulpSrc = function (opts) {
    var paths = es.through();
    var files = es.through();

    paths.pipe(es.writeArray(function (err, srcs) {
        gulp.src(srcs, opts).pipe(files);
    }));

    return es.duplex(paths, files);
};

/**** CLEAN UP FOLDER ****/
gulp.task('clean', function () {
    return del([dirs.dev + '/*']);
});

/****** REPORTER *******/
var myReporter = map(function (file, cb) {
    if (!file.jshint.success) {
        console.log('JSHINT fail in ' + file.path);
        file.jshint.results.forEach(function (err) {
            if (err) {
                console.log(' ' + file.path + ': line ' + err.line + ', col ' + err.character + ', code ' + err.code + ', ' + err.reason);
            }
        });
    }
    cb(null, file);
});

// kopiert alle bower componenten in den vendor ordner
// bower install l�dt alle componenten aus der bower.json 
gulp.task('bower', function () {
    return gulp.src([
        'bower_components/flexslider/flexslider.css',
        'bower_components/flexslider/jquery.flexslider-min.js',
        'bower_components/flexslider/fonts/**',
        'bower_components/fancybox/source/jquery.fancybox.css',
        'bower_components/fancybox/source/jquery.fancybox.css',
        'bower_components/bootstrap/dist/css/bootstrap.css',
        '!bower_components/bootstrap/assets/**',
        '!bower_components/eonasdan-bootstrap-datetimepicker/docs/**',
        '!bower_components/jquery/external/**',
        'bower_components/**/*min.css',
        'bower_components/**/*min.js'
    ],
    {
        base: 'bower_components/'
    })
        .pipe(gulp.dest(dirs.localpath + '/vendor/'));
});

// #### COPY FILES #####
gulp.task('copy:img', function () {
    return gulp.src(dirs.src + '/img/**/*')
        .pipe(gulp.dest(dirs.dev + '/img'))
});

gulp.task('copy:fonts', function () {
    return gulp.src(dirs.src + '/fonts/**/*')
        .pipe(gulp.dest(dirs.dev + '/fonts'))
});

gulp.task('copy:js', function () {
    return gulp.src(dirs.src + '/js/**/*')
        .pipe(gulp.dest(dirs.dev + '/js'))
});

gulp.task('copy:css', function () {
    return gulp.src(dirs.src + '/css/**/*.css')
        .pipe(gulp.dest(dirs.dev + '/css'))
});

gulp.task('copy:index.html', function () {
    return gulp.src(dirs.src + '/index.html')
        .pipe(gulp.dest(dirs.dev))
});

gulp.task('copy:sitemap.xml', function () {
    return gulp.src(dirs.src + '/sitemap.xml')
        .pipe(gulp.dest(dirs.dev))
});

gulp.task('copy:formmailer.php', function () {
    return gulp.src(dirs.src + '/formmailer.php')
        .pipe(gulp.dest(dirs.dev))
});

/******** LIVE LOCAL *********/
/* tasks werden nur von livelocal verwendet */
 gulp.task('copy:scripts-livereload', function() {
     return gulp.src(dirs.src + '/js/*.js')
         .pipe(gulp.dest(dirs.dev + '/js'))
           .pipe(livereload());
 });

gulp.task('copy:styles-livereload', function () {
    return gulp.src(dirs.src + '/css/*.css')
        .pipe(gulp.dest(dirs.dev + '/css'))
        .pipe(livereload());
});

gulp.task('copy:index.html-livereload', function () {
    return gulp.src(
        [dirs.src + '/*.html'])
        .pipe(gulp.dest(dirs.dev))
        .pipe(livereload());
});

gulp.task('copy:sitemap-livereload', function () {
    return gulp.src(
        dirs.src + '/*.xml')
        .pipe(gulp.dest(dirs.dev))
        .pipe(livereload());
});

gulp.task('copy:formmailer-livereload', function () {
    return gulp.src(
        dirs.src + '/*.php')
        .pipe(gulp.dest(dirs.dev))
        .pipe(livereload());
});

gulp.task('watch-srcToDev', function () {

    // Create LiveReload server
    livereload.listen();

    gulp.watch(dirs.src + '/css/*.css', ['copy:styles-livereload']);
    gulp.watch(dirs.src + '/*.xml', ['copy:sitemap-livereload']);
    gulp.watch(dirs.src + '/*.php', ['copy:formmailer-livereload']);
    gulp.watch(dirs.src + '/*.html', ['copy:index.html-livereload']);
    gulp.watch(dirs.src + '/js/*.js', ['copy:scripts-livereload']);
    console.log(dirs.src + '/*.php');

    // Watch any files in dist/, reload on change
  //  gulp.watch(['src/**']).on('change', livereload.changed);
});

/******** END LIVE LOCAL *********/

/******* FTP UPLOAD *******/
// l�dt das gesamte Projekt von dist to server dist
var user = 'rigap2@sylt-risgap2.de';
var password = 'X9sylt-risgap2.deX9'
var host = 'ftp.sylt-risgap2.de';

gulp.task('upload', function () {

    var conn = ftp.create({
        host: host,
        user: user,
        password: password,
        parallel: 10,
        log: gutil.log
    });

    var globs = [
        'dist/**', // liest den string mit in den Pfad und kopiert die Dateien in dist/**
    ];

    // using base = '.' will transfer everything to /public_html correctly
    // turn off buffering in gulp.src for best performance

    return gulp.src(globs, { base: '.', buffer: false })
      //  .pipe(conn.newer('/src/')) // only upload newer files
        .pipe(conn.dest('')); // Zielordner auf dem remote Server /dev/**
});

/*** DEFAULT TASK ***/
gulp.task('default', ['clean'], function () {
    gulp.start(
        'clean',
        'copy:index.html',
        'copy:img',
        'copy:fonts',
        'copy:css',
        'copy:js',
        'copy:formmailer.php',
        'copy:sitemap.xml',
        'watch');
});


/****** TEST FTP UPLOAD *****/

/*** FTP Configuration **/
var user = 'rigap2@sylt-risgap2.de';
var password = 'X9sylt-risgap2.deX9'
var host = 'ftp.sylt-risgap2.de';
var port = 21;
var localFilesGlob = ['src/**'];
var remoteFolder = '/dev'


// helper function to build an FTP connection based on our configuration
function getFtpConnection() {
    return ftp.create({
        host: host,
        port: port,
        user: user,
        password: password,
        parallel: 5,
        log: gutil.log
    });
}

//*
// * Deploy task.
// * Copies the new files to the server
// * Von local dev to server dev
// *
// * Usage: `FTP_USER=someuser FTP_PWD=somepwd gulp ftp-deploy`

 gulp.task('ftp-deploy', function() {

    var conn = getFtpConnection();

    return gulp.src(localFilesGlob, { base: '.', buffer: false })
       // .pipe( conn.newer( remoteFolder ) ) // only upload newer files
        .pipe( conn.dest( remoteFolder ) );
});
 

/**
 * Watch deploy task.
 * Watches the local copy for changes and copies the new files to the server whenever an update is detected
 *
 * Usage: `FTP_USER=someuser FTP_PWD=somepwd gulp ftp-deploy-watch`
 */
gulp.task('ftp-deploy-watch', function () {

    var conn = getFtpConnection();

    gulp.watch(localFilesGlob)
        .on('change', function (event) {
            console.log('Changes detected! Uploading file "' + event.path + '", ' + event.type);

            return gulp.src([event.path], { base: '.', buffer: false })
                //.pipe(conn.newer(remoteFolder)) // only upload newer files
                .pipe(conn.dest('././'));
        });
});


/***** Html Build *****/
//Extract content from html und bennent die css, js Referenzen um
// Kopiert die js, css files in einem file und miniert das file

var jsBuild = es.pipeline(
    plugins.concat('concat.js'),
    gulp.dest(dirs.localpath + '/js')
);

var cssBuild = es.pipeline(
    plugins.concat('concat.css'),
    gulp.dest(dirs.localpath + '/css')
);

gulp.task('build-css-js', function () {
    gulp.src(['./index.html'])
        .pipe(htmlbuild({
            // build js with preprocessor
            js: htmlbuild.preprocess.js(function (block) {

                block.pipe(gulpSrc({ root: __dirname }))
                    .pipe(jshint())
                    .pipe(myReporter)
                    .pipe(uglify())
                    .pipe(jsBuild);

                block.end('js/min.all.js');

            }),

            // build css with preprocessor
            css: htmlbuild.preprocess.css(function (block) {

                block.pipe(gulpSrc({ root: __dirname }))
                    .pipe(cleanCSS({ compatibility: 'ie8' })) // minimiert die css files
                    .pipe(cssBuild); // kopiert alle Css files in ein file 

                block.end('css/min.all.css');

            }),

            // remove blocks with this target
            remove: function (block) {
                block.end();
            },

            // add a header with this target
            header: function (block) {
                es.readArray([
                    '<!--',
                    '  processed by htmlbuild',
                    '-->'
                ].map(function (str) {
                    return block.indent + str;
                })).pipe(block);
            }
        }))
        .pipe(gulp.dest(dirs.localpath));
});

/** Dist **/
gulp.task('copy:devToDist', function () {
    return gulp.src(dirs.dev + '/**')
        .pipe(gulp.dest(dirs.dist))
});

