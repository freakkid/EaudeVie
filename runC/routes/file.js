const fs = require("fs"),
  path = require('path'),
  spawn = require('child_process').spawn,
  defaultConfig = require('../config/default');

const isWin = /^win/.test(process.platform);  // check operation system is windows or not

function fileTools() {
  var folderName = defaultConfig.folderName; // default foldername

  function getFolderName() {
    return folderName;
  }
  // set new foldername
  // if new foldername emppty or exist, return false
  //  else set foldername and return true
  function setFolderName(newFolderName) {
    if (newFolderName != '' && !fs.existsSync(newFolderName)) {
      return false;
    }
    folderName = newFolderName;
    return true;
  }

  // create directory for c files if not exists when server starts
  // if exists the same name file, displays error and exit
  // if exists the same name directory, continue
  function createCFolder() {
    if (!fs.existsSync(folderName)) {
      fs.mkdirSync(folderName, 0777);
      console.log('Create folder "' + folderName + '" successfully.');
    } else if (!fs.lstatSync(folderName).isDirectory()) {
      console.log('[ERROR]: Fail to create folder "' + folderName + '".');
      process.exit(1);
    }
    else {
      console.log('Folder "' + folderName + '" has existed.');
    }
  }

  // create and write c file
  // need a error callback
  function writeCFileAsync(filename, userCode) {
    return new Promise(function (resolve, reject) {
      var result = getResult();
      fs.writeFile(folderName + path.sep + filename + '.c', userCode, (err) => {
        if (err) {
          result.success = false;
        } else {
          result.success = true;
        }
        resolve(result);
      });
    });
  }

  // get a filename by a random string with 32 characters
  function getRandomFilename(len = 32) {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
    const max = chars.length;
    let filename = '';
    for (let i = 0; i < len; i += 1) {
      filename += chars.charAt(Math.floor(Math.random() * max));
    }
    return filename;
  }

  // gcc compile: gcc filename.c -o filename
  // if exited with 1 means that fail to compile
  function compileCFileByFilenameAsync(filename) {
    const gcc = spawn('gcc', [folderName + path.sep + filename + '.c', '-o', folderName + path.sep + filename]);
    return new Promise(function (resolve, reject) {
      var result = getResult();
      gcc.stderr.on('data', (data) => {
        result.stderr += data.slice(data.indexOf(':') + 1);
        console.log(data.toString());
        if (result.success) {
          result.success = false;
        }
      });
      gcc.on('close', (code) => {
        result.success = code === 1 ? false : true;
        resolve(result);
      });
    });
  }

  // run code: windows: $ filename   / ubuntu: $ ./filename
  function execCFileByFilenameAsync(filename) {
    return new Promise(function (resolve, reject) {
      const execExe = isWin ? spawn(folderName + path.sep + filename) : spawn('./' + folderName + path.sep + filename);
      var result = getResult();
      execExe.stdout.on('data', (data) => {
        result.output += data;
      });

      execExe.stderr.on('data', (data) => {
        result.stderr += data;
        if (result.success) {
          result.success = false;
        }
      });

      execExe.on('close', (code) => {
        result.stderr += `program exited with code ${code}`;
        resolve(result);
      });
    });
  }

  function getResult(success = true, stderr = '', output = '') {
    return { success: success, stderr: stderr, output: output };
  }

  return {
    getFolderName: getFolderName,
    setFolderName: setFolderName,
    createCFolder: createCFolder,
    getRandomFilename: getRandomFilename,
    writeCFileAsync: writeCFileAsync,
    compileCFileByFilenameAsync: compileCFileByFilenameAsync,
    execCFileByFilenameAsync: execCFileByFilenameAsync,
    getRandomFilename: getRandomFilename,
  }
}



module.exports = fileTools;