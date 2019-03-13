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

// **** Webserver config ****
var user = 'rigap2@sylt-risgap2.de';
var password = 'X9sylt-risgap2.deX9';
var host = 'ftp.sylt-risgap2.de';

/*** FTP Configuration **/
var port = 21;
var localFilesGlob = ['dev/**'];
var remoteFolder = '';

/*###### Introduction #######*/
/* Die Ordner Struktur besteht aus src, dev und dist. Die src ist der Quelle Ordner zum local entwickeln, 
 * Initialisieren der Application, führe alle copy-... src -> dev aus, erstellt die dev Ordner Struktur, kopiert  alle files und Bilder in den dev    
 * Bower, kopiert alle benötigen Files in das vendor Verzeichnis
 * Copy dev -> dist erstellt die dev ordner Strukturen und kopiert alle files aus dem dev -> dist
 * Copy bower components, kopiert alle libraries,fonts etc. ins vendor Verzeichnis
 * Watch-srcToDev starten, wenn eines der Files bearbeitet worden sind, kopiert watch das File von src -> dev 
 */

// pipe a glob stream into this and receive a gulp file stream
var gulpSrc = function (opts) {
    var paths = es.through();
    var files = es.through();

    paths.pipe(es.writeArray(function (err, srcs) {
        gulp.src(srcs, opts).pipe(files);
    }));

    return es.duplex(paths, files);
};

/*** DEFAULT TASK ***/
gulp.task('default', ['clean:local-dev'], function () {
    gulp.start(
        'clean:local-dev',
        'copy:index.html',
        'copy:img',
        'copy:fonts',
        'copy:css',
        'copy:js',
        'copy:php',
        'copy:sitemap.xml',
        'copy:bower_components',
        'copy:bower_components_fonts',
        'copy:bower_components-flexslider-fonts');
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

// #### COPY FILES #####

// clean dev folder
gulp.task('clean:local-dev', function () {
    return del([dirs.dev + '/*']);
});

// TODO: implementieren remote delete
//gulp.task('clean:ftp-dev', function () {

//    var conn = getFtpConnection();
//    conn.delete('/dev/*', function (err) {
//        if (err) {
//            console.log(err);
//        }
//        else {
//        return gulp
//            .src([event.path], { base: '.', buffer: false })
//            .pipe(conn.dest(remoteFolder));
//        }
//    });
//});

// kopiert alle bower componenten in den vendor ordner
// bower install lädt alle componenten aus der bower.json 
gulp.task('copy:bower_components', function () {
    return gulp.src([
        'bower_components/flexslider/flexslider.css',
        'bower_components/flexslider/jquery.flexslider-min.js',
        'bower_components/bootstrap/fonts/bootstrap/**',
        'bower_components/fancybox/source/jquery.fancybox.css',
        'bower_components/fancybox/source/jquery.fancybox.js',
        'bower_components/fancybox/source/fancybox_overlay.png',
        'bower_components/fancybox/source/fancybox_sprite@2x.png',
        'bower_components/fancybox/source/fancybox_loading@2x.gif',
        'bower_components/fancybox/source/blank.gif ',
        '!bower_components/bootstrap/dist/css/bootstrap.css',
        '!bower_components/bootstrap/assets/**',
        '!bower_components/eonasdan-bootstrap-datetimepicker/docs/**',
        '!bower_components/jquery/external/**',
        'bower_components/**/*min.css',
        'bower_components/**/*min.js',
    ],
    {
        base: 'bower_components/'
    })
        .pipe(gulp.dest(dirs.localpath + '/vendor/'));
});

gulp.task('copy:bower_components_fonts', function () {
    return gulp.src([
        'bower_components/bootstrap-sass/assets/fonts/bootstrap/**'])
        .pipe(rename({ dirname: '' }))
        .pipe(gulp.dest(dirs.localpath + '/vendor/fonts'));
});

gulp.task('copy:bower_components-flexslider-fonts', function () {
    return gulp.src([
        'bower_components/flexslider/fonts/**'])
        .pipe(rename({ dirname: '' }))
        .pipe(gulp.dest(dirs.localpath + '/vendor/flexslider/fonts'));
});

gulp.task('copy:img', function () {
    return gulp.src(dirs.src + '/img/**/*')
        .pipe(gulp.dest(dirs.dev + '/img'));
});

gulp.task('copy:php', function () {
    return gulp.src(dirs.src + '/php/**/*')
        .pipe(gulp.dest(dirs.dev + '/php'));
});

gulp.task('copy:fonts', function () {
    return gulp.src(dirs.src + '/fonts/**/*')
        .pipe(gulp.dest(dirs.dev + '/fonts'));
});

gulp.task('copy:js', function () {
    return gulp.src(dirs.src + '/js/**/*')
        .pipe(gulp.dest(dirs.dev + '/js'));
});

gulp.task('copy:css', function () {
    return gulp.src(dirs.src + '/css/**/*.css')
        .pipe(gulp.dest(dirs.dev + '/css'));
});

gulp.task('copy:index.html', function () {
    return gulp.src(dirs.src + '/index.html')
        .pipe(gulp.dest(dirs.dev));
});

gulp.task('copy:sitemap.xml', function () {
    return gulp.src(dirs.src + '/sitemap.xml')
        .pipe(gulp.dest(dirs.dev));
});

/******** LIVE LOCAL *********/

/* tasks werden nur von livelocal verwendet */
gulp.task('livereload:scripts', function() {
     return gulp.src(dirs.src + '/js/*.js')
         .pipe(gulp.dest(dirs.dev + '/js'))
           .pipe(livereload());
 });

gulp.task('livereload:styles', function () {
    return gulp.src(dirs.src + '/css/*.css')
        .pipe(gulp.dest(dirs.dev + '/css'))
        .pipe(livereload());
});

gulp.task('livereload:index.html', function () {
    return gulp.src(
        [dirs.src + '/*.html'])
        .pipe(gulp.dest(dirs.dev))
        .pipe(livereload());
});

gulp.task('livereload:sitemap', function () {
    return gulp.src(
        dirs.src + '/*.xml')
        .pipe(gulp.dest(dirs.dev))
        .pipe(livereload());
});

gulp.task('livereload:php', function () {
    return gulp.src(
        dirs.src + '/php/*')
        .pipe(gulp.dest(dirs.dev + '/php'))
        .pipe(livereload());
});


/******** END LIVE LOCAL *********/

/******** Watch - update dev and ftp dev folders ********/
gulp.task('watch:start-environment-dev', function () {
    gulp.start(
        'watch:srcToDev',
        'watch:ftp-deploy-dev');
});

gulp.task('watch:srcToDev', function () {

    // Create LiveReload server
    livereload.listen();

    gulp.watch(dirs.src + '/css/*.css', ['livereload:styles']);
    gulp.watch(dirs.src + '/*.xml', ['livereload:sitemap']);
    gulp.watch(dirs.src + '/php/*', ['livereload:php']);
    gulp.watch(dirs.src + '/*.html', ['livereload:index.html']);
    gulp.watch(dirs.src + '/js/*.js', ['livereload:scripts']);
    console.log('Watch src -> dev changed detected! copy file from src to dev');


});

/**
 * Watch deploy task.
 * Watches the local copy for changes and copies the new files to the server whenever an update is detected
 *
 * Usage: `FTP_USER=someuser FTP_PWD=somepwd gulp ftp-deploy-watch`
 */
gulp.task('watch:ftp-deploy-dev', function () {

    var conn = getFtpConnection();

    gulp.watch(localFilesGlob)
        .on('change', function (event) {
            console.log('Changes detected! Uploading file "' + event.path + '", ' + event.type);

            return gulp
                .src([event.path], { base: '.', buffer: false })
                .pipe(conn.newer(remoteFolder)) // only upload newer files
                .pipe(conn.dest(remoteFolder));
        });
});

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

/******* FTP UPLOAD *******/
// lädt die dist auf dem Server dist Ordner
gulp.task('upload:dev-to-ftp-dev', function () {

    var conn = getFtpConnection();

    var globs = [
        'dev/**' // liest den string mit in den Pfad und kopiert die Dateien in dist/**
    ];

    // using base = '.' will transfer everything to /public_html correctly
    // turn off buffering in gulp.src for best performance

    return gulp.src(globs, { base: '.', buffer: false })
      //  .pipe(conn.newer('/src/')) // only upload newer files
        .pipe(conn.dest('')); // Zielordner auf dem remote Server /dev/**
});

//*
// * Deploy task.
// * Copies the new files to the server
// * Von local dev to server dev
gulp.task('ftp-deploy', function () {

    var conn = getFtpConnection();

    return gulp.src(localFilesGlob, { base: '.', buffer: false })
         .pipe( conn.newer( remoteFolder ) ) // only upload newer files
        .pipe(conn.dest(remoteFolder));
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

