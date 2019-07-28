'use strict';

let shelljs = require('shelljs');
shelljs.config.execPath = shelljs.which('node')

function getMediaInfo(path){
  let json="";
  return new Promise((resolve, reject) => {
      let command='ffprobe -v quiet -print_format json -show_format -show_streams '+'"'+path+'"';
      let child = shelljs.exec(command,{ async: true, silent: true });

      child.stdout.on('data', function(data) {
        json+=data;
      });
      child.stderr.on('data', function(data) {
        reject(data.toString())
      });

      child.on('exit', (code, signal) => {

        if (code === 0) {
          resolve(json);
        } else {
          reject();
        }
      });

  });
}

module.exports=getMediaInfo;
