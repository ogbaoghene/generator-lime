'use strict';

var yeoman = require('yeoman-generator');

var LimeGenerator = yeoman.generators.NamedBase.extend({
  initializing: function () {
    this.log('You called the lime subgenerator with the argument ' + this.name + '.');
  },

  writing: function () {
    this.directory('dev');
    this.mkdir('dev/templates');
    this.template('_template.html', 'dev/templates/'+ this.name +'.html');
  },

  config: function() {
    this.project = this.config.get('project');
    this.autoprefixer = this.config.get('autoprefixer');
  },

  writeIndex: function(){
    var hook   = '<!-- template hook -->',
        path   = 'dev/index.html',
        file   = this.readFileAsString(path),
        insert = '<a href="templates/'+ this.name +'.html">'+ this.name +'</a>';

    if (file.indexOf(insert) === -1) {
      this.write(path, file.replace(hook, insert+hook));
    }
  }
});

module.exports = LimeGenerator;
