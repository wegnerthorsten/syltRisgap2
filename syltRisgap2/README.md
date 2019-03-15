# syltRisgap2

##Getting Started

##Prerequisites
### npm
npm install
gulp
gulp-load-plugins
gulp-htmlbuild
event-stream
gulp-uglify
gulp-clean-css
gulp-rename
gulp-livereload
gulp-jshint
del
map-stream
vinyl-ftp
gulp-util
gulp-filter
main-bower-files
gulp-server-livereload
gulp-plumber
gulp-clean-css

### Bower
bower install FlexSlider 2.7.0
bower intall jquery  3.3.1
bower install moment 2.22.1
bower install fancybox 2.1
bower install eonsasdan-bootstrap-dateimepicker 5
bower install bootstrap 3
bower install bootstrap 3

##Installing
Run gulp default Task, copies all files from src/* into dev/* folder with all dependies files from bower_components.
Run gulp upload, it copies all files from dev/* into ftp dev/* folder

##Deployment
Run gulp watch:environment-dev, it looks the changes in src/* and dev/* folder. By changes files in src/* copies the newer one into dev and from dev/* into server dev/* folder
