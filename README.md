# Tumblr Theme generator [![Build Status](https://secure.travis-ci.org/ffffranklin/generator-tumblr-theme.png?branch=master)](https://travis-ci.org/ffffranklin/generator-tumblr-theme)

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

By default generator-tumblr-theme uses http://tumblrthemr.tumblr.com as it's content source.   In order to use your own blog as a source of test content you need to convert an existing tumblr blog to XML.  

Copy and paste the content of this tumblr theme file to your blog's theme editor
https://raw.githubusercontent.com/ffffranklin/tumblrthemr-xml-theme/master/xml.tumblr

When you visit your tumblr blog you should see an rendered XML

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
