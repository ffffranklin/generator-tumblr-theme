'use strict';

var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var mkdirp = require('mkdirp')

var TumblrThemeGenerator = yeoman.generators.Base.extend({

    initializing: function () {
        this.pkg = require('../package.json');
    },

    prompting: function () {
        var done = this.async();

        // Have Yeoman greet the user.
        this.log(yosay(
            'Welcome to the cool Tumblr Theme generator!'
        ));

        var prompts = [{
            type: 'confirm',
            name: 'customContent',
            message: 'Would you like to use custom content? [No]',
            default: false
        },{
            // todo: should test url to make sure it's properly configured
            when: function (answers) {
                return answers && answers.customContent;
            },
            name: 'contentURL',
            message: 'What is the URL of the content source for this theme? http://'
        }];

        this.prompt(prompts, function (props) {
            this.contentURL= props.contentURL;

            done();
        }.bind(this));
    },

    writing: {

        app: function () {
            mkdirp('app/themr/javascripts');
            mkdirp('app/theme/styles');
            mkdirp('app/theme/scripts');
            this.fs.copyTpl(
                this.templatePath('_package.json'),
                this.destinationPath('package.json')
            );
            this.fs.copyTpl(
                this.templatePath('_bower.json'),
                this.destinationPath('bower.json')
            );
        },

        createconfig: function () {

            var url = 'tumblrthemr.tumblr.com';
            var userURL = this.contentURL;

            if (typeof userURL === 'string') {
                url = userURL;
            }

            this.write(
                'app/themr/javascripts/tumblr-themr-1.0.config.js',
                    'var themrConf = { url: \'' + url  + '\', theme: \'theme\' };'
            );
        },

        gruntfile: function () {
            this.template('Gruntfile.js');
        },

        projectfiles: function () {
            this.fs.copyTpl(
                this.templatePath('editorconfig'),
                this.destinationPath('.editorconfig')
            );
            this.fs.copyTpl(
                this.templatePath('jshintrc'),
                this.destinationPath('.jshintrc')
            );
        },

        createthemr: function () {
            this.fs.copyTpl(
                this.templatePath('index.html'),
                this.destinationPath('app/index.html')
            );
            this.fs.copyTpl(
                this.templatePath('spinner.gif'),
                this.destinationPath('app/themr/images/spinner.gif')
            );
            this.fs.copyTpl(
                this.templatePath('tumblr-themr-1.0.js'),
                this.destinationPath('app/themr/javascripts/tumblr-themr-1.0.js')
            );
            this.fs.copyTpl(
                this.templatePath('jquery-1.6.4.min.js'),
                this.destinationPath('app/themr/javascripts/jquery-1.6.4.min.js')
            );
            this.fs.copyTpl(
                this.templatePath('sammy.js'),
                this.destinationPath('app/themr/javascripts/sammy.js')
            );
            this.fs.copyTpl(
                this.templatePath('sammy.handlebars.js'),
                this.destinationPath('app/themr/javascripts/sammy.handlebars.js')
            );
        },

        demotheme: function () {
            this.fs.copyTpl(
                this.templatePath('theme.tumblr'),
                this.destinationPath('app/theme.tumblr')
            );
            this.fs.copyTpl(
                this.templatePath('jquery-1.6.4.min.js'),
                this.destinationPath('app/theme/scripts/jquery-1.6.4.min.js')
            );
            this.fs.copyTpl(
                this.templatePath('theme.scss'),
                this.destinationPath('app/theme/styles/main.scss')
            );
            this.fs.copyTpl(
                this.templatePath('theme.js'),
                this.destinationPath('app/theme/scripts/main.js')
            );
        }
    },

    install: function () {
        this.installDependencies({
            skipInstall: (
                this.options['skip-install'] || this.options.skipInstall
            )
        });
    }

});

module.exports = TumblrThemeGenerator;

