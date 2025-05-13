const fs = require("fs");
const path = require("path");
const errorFilePath = `Error.txt`;
const handleFilePath = process.argv[2];
const readFilePath = process.argv[3]; // 读LangId.ts文件
const isReplaceFile = process.argv[4];
var fileContent = ``;
var errorContent = ``;
var keys = [];
var values = [];
/**处理lang文件，得到key和value */
let langPromise = new Promise((resolve) => {
  fs.readFile(readFilePath, "utf8", (err, data) => {
    if (!err) {
      let reg = /=.*?,\r\n/g;
      data = data.replace(reg, ``);
      let reg2 = /\/\*{2}.*?\*\//g;
      keys = (data.match(reg2) || []).map((e) => {
        return `"` + e.slice(3, e.length - 2) + `"`;
      });
      let pdata = data.replace(reg2, ``);
      values = pdata.match(/[^\s].*_[0-9]+/g) || [];
      if (keys.length != values.length) {
        console.error("keys和values长度不一致");
      } else {
        resolve();
      }
    } else {
      console.error(`LangId.ts文件路径设置错误`);
    }
  });
});
/**写入文件 */
function writeFileData(fileName, data, notip) {
  fs.writeFile(fileName, data, "utf8", (err) => {
    if (err) {
      console.error("写入文件时错误:", err);
    } else {
      if (!notip) console.log(`文件 ${fileName} 已被成功写入`);
    }
  });
}
/**找出LangId的前面不是Lang( 或者一行中Lang(后面不包括LangId*/
function checkLangIdPreData(data, fileName) {
  let filterData = data.replace(/import.*/g, ``); //过滤掉import
  let temp =
    filterData.match(
      /([^(Lang\(](?=LangId)).*|Lang\((?:(?!LangId).)*[\r\n]/g
    ) || [];
  let has = false;
  temp.forEach((e) => {
    let searchIdx = data.indexOf(e);
    let p = data.slice(0, searchIdx);
    let line = (p.match(/\r\n/g) || []).length;
    let str = `第${line + 1}行疑似异常，请检查：` + e;
    console.error(str);
    if (!has) {
      errorContent += fileName + `\n`;
      has = true;
    }
    errorContent += str + `\n`;
    writeFileData(errorFilePath, errorContent, true);
  });
}
/**找到LangId.X并替换 */
function replaceLangId(filedata, fileName) {
  let temp = filedata.match(/LangId\..*?_[0-9]+/g) || [];
  temp = temp.map((e) => {
    return e.slice(7);
  });
  let findCount = 0;
  fileContent = filedata;
  temp.forEach((element) => {
    let idx = values.indexOf(element);
    if (idx != -1) {
      let str = `LangId.` + values[idx];
      let replaceStr = keys[idx];
      console.log(str + `---->` + replaceStr);
      findCount++;
      fileContent = fileContent.replace(str, replaceStr);
    }
  });
  if (isReplaceFile) writeFileData(fileName, fileContent);
  console.log(`找到${findCount}处可替换`);
}

function handleFile(fileName) {
  // await new Promise((resolve, reject) => {
  fs.readFile(fileName, "utf8", (err, data) => {
    if (err) {
      console.error("读取文件时错误:", err);
    } else {
      console.log(`文件名 ${fileName}`);
      checkLangIdPreData(data, fileName);
      replaceLangId(data, fileName);
      //resolve();
    }
  });
  //});
}
/**处理文件夹 */
function traverseDirectorySync(dirPath) {
  try {
    const files = fs.readdirSync(dirPath, { withFileTypes: true });
    for (const dirent of files) {
      const res = path.resolve(dirPath, dirent.name);
      if (dirent.isDirectory()) {
        traverseDirectorySync(res);
      } else {
        handleFile(res);
      }
    }
  } catch (err) {
    console.error(`在遍历目录时出错: ${err}`);
  }
}

if (handleFilePath) {
  langPromise.then(() => {
    //入口先检测是文件还是文件夹
    if (fs.lstatSync(handleFilePath).isFile()) {
      handleFile(handleFilePath);
      //     .then((res) => {
      //     writeFileData(handleFilePath, fileContent);
      //   });
    } else {
      traverseDirectorySync(handleFilePath);
      //         .then(() => {
      //     writeFileData(resolve, fileContent);
      //   });
    }
  });
} else {
  console.log("输入路径有误");
}
