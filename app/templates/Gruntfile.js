var os = require('os');
var SpottrServer = require('spottr');

module.exports = function(grunt) {

    var appPort = 9000;

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            options:{
                livereload: true
            },
            scripts: {
                files: [
                    'app/theme/scripts/**/*/.js',
                    'app/theme.tumblr'
                ]
            },
            styles: {
                files: ['app/theme/styles/**/*.scss'],
                tasks: ['sass']
            }
        },
        sass: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'app/theme/styles',
                    src: ['*.scss'],
                    dest: 'app/theme/styles',
                    ext: '.css'
                }]
            }
        },
        connect: {
            main: {
                options: {
                    port: appPort,
                    base: 'app'
                }
            }
        },
        open: {
            dev: {
                path: 'http://localhost:9000',
                app: 'Google Chrome'
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-open');
    grunt.registerTask('default', ['serve']);
    grunt.registerTask('serve',['sass', 'connect', 'spottr', 'open', 'watch']);
    grunt.registerTask('serve-remote',['sass', 'connect', 'spottr', 'print-remote', 'watch']);
    grunt.registerTask('spottr', function (err) {
        var server = new SpottrServer();
        server.start();
    });
    grunt.registerTask('print-remote', function (err) {
        var ifaces = os.networkInterfaces();
        console.log('Your remote server is browser-accessible via these URLs:')
        for (var dev in ifaces) {
            var alias=0;
            ifaces[dev].forEach(function(details){
                if (details.family=='IPv4') {
                    console.log('http://'+details.address+':'+appPort, '('+dev+(alias?':'+alias:'')+')');
                    ++alias;
                }
            });
        }
    });
};
