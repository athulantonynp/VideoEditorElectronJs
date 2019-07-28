'use strict';

let tmp = require('tmp');
let fs = require('fs');
let shelljs = require('shelljs');
let _ = require('lodash');

module.exports = function (spec) {

	let that = null;
	let clips = [];
	let outputFileName = tmp.tmpNameSync({
		prefix: 'video-output-',
    postfix: '.mp4'
	});

	spec = _.defaults(spec, {
    silent: true,
    overwrite: null
  });

  function handleOverwrite() {
    switch (spec.overwrite) {
      case true:
        return '-y'
      case false:
        return '-n'
      default:
        return ''
    }
  }

	function setClips(_clips) {
		if (Array.isArray(_clips)) {
            clips = _clips;
		} else {
			throw new Error('Expected parameter to be of type `Array`');
		}
		return that;
	}

	function setOutput(fileName) {

		if (fileName) {

			outputFileName = fileName;
		}
    return that;
	}

  function concatClips(args) {
    const overwrite = handleOverwrite();
    return new Promise((resolve, reject) => {
      let child = shelljs.exec(`ffmpeg -f concat -safe 0 -protocol_whitelist file,http,https,tcp,tls,crypto -i ${args.fileList} -c copy ${outputFileName} ${overwrite}`, { async: true, silent: spec.silent });
      child.stderr.on('data', function(data) {
        console.log(data)
      });
      child.on('exit', (code, signal) => {

        if (code === 0) {
          resolve(outputFileName);
        } else {
            //console.log(code)
            console.log(child.stderr)
          reject();
        }
      });
    });
  }

  function escapePathString(pathString) {
    return pathString.toString().replace(/\\/g, '\\\\');
  }

  function getLineForClip(clip) {
    return `file '${escapePathString(clip)}'`;
  }

  function getTextForClips(clips) {
    return clips.map(getLineForClip).join('\n');
  }

  function doConcat() {


    let fileListText = getTextForClips(clips);
    let fileListFilename = tmp.tmpNameSync({
      postfix: '.txt'
    });
    fs.writeFileSync(fileListFilename, fileListText, 'utf8');

    return concatClips({
      fileList: fileListFilename,
    });
  }

	that = Object.create({
		clips: setClips,
		output: setOutput,
		concat: doConcat,
	});

	return that;
}
