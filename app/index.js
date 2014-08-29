'use strict';

var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');

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
            this.dest.mkdir('app');
            this.dest.mkdir('app/themr');
            this.dest.mkdir('app/themr/javascripts');
            this.dest.mkdir('app/theme');
            this.dest.mkdir('app/theme/styles');
            this.dest.mkdir('app/theme/scripts');
            this.src.copy('_package.json', 'package.json');
            this.src.copy('_bower.json', 'bower.json');
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
            this.src.copy('editorconfig', '.editorconfig');
            this.src.copy('jshintrc', '.jshintrc');
        },

        createthemr: function () {
            this.src.copy('index.html', 'app/index.html');
            this.src.copy('spinner.gif', 'app/themr/images/spinner.gif');
            this.src.copy('tumblr-themr-1.0.js', 'app/themr/javascripts/tumblr-themr-1.0.js');
            this.src.copy('jquery-1.6.4.min.js', 'app/themr/javascripts/jquery-1.6.4.min.js');
            this.src.copy('sammy.js', 'app/themr/javascripts/sammy.js');
            this.src.copy('sammy.handlebars.js', 'app/themr/javascripts/sammy.handlebars.js');
        },

        demotheme: function () {
            this.src.copy('theme.tumblr', 'app/theme.tumblr');
            this.src.copy('jquery-1.6.4.min.js', 'app/theme/scripts/jquery-1.6.4.min.js');
            this.src.copy('theme.scss', 'app/theme/styles/main.scss');
            this.src.copy('theme.js', 'app/theme/scripts/main.js');
        }
    },

    end: function () {
        this.installDependencies();
    }
});

module.exports = TumblrThemeGenerator;

