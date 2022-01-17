# Tumblr Theme generator (deprecated)

[![Build Status](https://secure.travis-ci.org/ffffranklin/generator-tumblr-theme.svg?branch=master)](https://travis-ci.org/ffffranklin/generator-tumblr-theme)
[![NPM version](https://badge.fury.io/js/generator-tumblr-theme.svg)](http://badge.fury.io/js/generator-tumblr-theme)
[![Dependency Status](https://david-dm.org/ffffranklin/generator-tumblr-theme.svg)](https://david-dm.org/ffffranklin/generator-tumblr-theme)

A Tumblr Theme generator for [Yeoman](http://yeoman.io) that allows you to create a theme for Tumblr.


## Getting Started

First install [Yeoman](http://yeoman.io) globally  

```
$ npm install -g yo
```

To install generator-tumblr-theme from npm, run:

```
$ npm install -g generator-tumblr-theme
```

Create a theme project folder

```
$ mkdir my-theme && cd my-theme
```

Finally, initiate the generator:

```
$ yo tumblr-theme
```

This will expand the themer scripts and assets into your theme project directory 

## Custom Content

By default generator-tumblr-theme uses http://tumblrthemr.tumblr.com as it's content source. In order to use your own blog as a source of test content, you need to convert an existing tumblr blog to XML.   

### Tumblr XML Template

Copy and paste the content of this tumblr theme file to your blog's theme editor
https://raw.githubusercontent.com/ffffranklin/tumblrthemr-xml-theme/master/xml.tumblr

![](http://i.imgur.com/XvcUpvZ.png)

When you visit your tumblr blog you should see an rendered XML

![](http://i.imgur.com/AhmkkFx.png)

Configure your tumbler themer to use your new source by entering in a content source when you initially run the generator. 

![](http://i.imgur.com/2loXTep.png)

You can always update the config file, post generation, here: 

```
$ cat app/themr/javascripts/tumblr-themr-1.0.config.js
var themrConf = { url: 'myblog.tumblr.com', theme: 'theme' };
```

Now your Tumblr Theme will render in your themer app

## Changelog

Recent changes can be viewed on Github on the [Releases Page](https://github.com/ffffranklin/generator-tumblr-theme/releases)

## License

[BSD license](http://opensource.org/licenses/bsd-license.php)
