'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');


var TumblrGenerator = module.exports = function TumblrGenerator(args, options, config) {
    yeoman.generators.Base.apply(this, arguments);

    this.on('end', function () {
        this.installDependencies({ skipInstall: options['skip-install'] });
    });

    this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(TumblrGenerator, yeoman.generators.Base);

TumblrGenerator.prototype.askFor = function askFor() {
    var cb = this.async();

    // have Yeoman greet the user.
    console.log(this.yeoman);

    var prompts = [ /* {
        name: 'blogUrl',
        message: 'What is your test tumblr url?'
    } ,*/{
        type: 'confirm',
        name: 'agree',
        message: 'Would you like to proceed?'
    }];

    this.prompt(prompts, function (props) {
        //this.blogUrl= props.blogUrl;

        cb();
    }.bind(this));

};

TumblrGenerator.prototype.app = function app() {
    this.mkdir('app');
    this.mkdir('app/app');
    this.mkdir('app/app/javascripts');
    this.mkdir('app/app/images');
    this.mkdir('app/themes');
    this.mkdir('app/themes/demo');

    this.copy('_package.json', 'package.json');
    this.copy('_bower.json', 'bower.json');
};

TumblrGenerator.prototype.gruntfile = function gruntfile() {
    this.template('Gruntfile.js');
};
TumblrGenerator.prototype.projectfiles = function projectfiles() {
    this.copy('editorconfig', '.editorconfig');
    this.copy('jshintrc', '.jshintrc');
};

TumblrGenerator.prototype.createThemr = function createthemr() {
    this.copy('index.html', 'app/index.html');
    this.copy('spinner.gif', 'app/images/spinner.gif');
    this.copy('tumblr-themr-1.0.min.js', 'app/app/javascripts/tumblr-themr-1.0.min.js');
};
TumblrGenerator.prototype.demoTheme = function demotheme() {
    this.copy('demo.tumblr', 'app/themes/demo.tumblr');
    this.copy('demo.css', 'app/themes/demo/demo.css');
    this.copy('demo.js', 'app/themes/demo/demo.js');
};
