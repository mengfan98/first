let str = `export const enum LangId {

    /**我是测试文本，依次在下一行输入文本*/
    A_1 = "A1",
    /**活动暂未开启*/
    A_2 = "A2",
    /**活动表出错：*/
    A_3 = "A3",
    /**客户端取值出错：*/
    A_4 = "A4",
    /**条件未达成*/
    A_5 = "A5",
    /**背包不足{L0}格*/
    A_6 = "A6",
    /**已领取*/
    A_7 = "A7",
    /**制作数量不足，需要*/
    A_8 = "A8",
    /**可领取*/
    A_9 = "A9",
    /**{L0}{L20}*/
    A_10 = "A10",
  TipsManager.ins().showTips(Lang(LangId.A_7)) + needVale)

}`;

const fs = require("fs");
const path = require("path");
const writeFilePath = `outFile.txt`; //写入的文件
const readFilePath = `LangId.ts`; //写入的文件
var fileContent = ``;
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
    }
  });
});

async function traverseDirectorySync(dirPath) {
  try {
    const files = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const dirent of files) {
      const res = path.resolve(dirPath, dirent.name);

      if (dirent.isDirectory()) {
        await traverseDirectorySync(res);
      } else {
        console.log(`文件名 ${res}`);
        // fileContent += `文件名 ${res}\n`;

        await new Promise((resolve, reject) => {
          fs.readFile(res, "utf8", (err, data) => {
            if (err) {
              console.error("读取文件时错误:", err);
            } else {
              const reg = /Lang\(.*?LangId..*?\)/g;
              var temp = data.match(reg) || [];
              //fileContent += temp.join(`;`) + `\n`;
              let findCount = 0;
              for (var i = 0; i < temp.length; i++) {
                let matchArr = [];
                for (var j = 0; j < values.length; j++) {
                  let c = values[j];
                  let findArr = temp[i].match(c);
                  if (findArr && findArr.length) {
                    matchArr.push(j);
                  }
                }
                if (matchArr.length) {
                  let firstEle = matchArr[0];

                  for (let ele of matchArr) {
                    if (values[ele].length > values[firstEle].length) {
                      firstEle = ele;
                    }
                  }
                  let str = `LangId.` + values[firstEle];
                  let replaceStr = keys[firstEle];
                  console.log(str + `---->` + replaceStr);
                  findCount++;
                  fileContent = data.replace(str, replaceStr);
                }
              }
              console.log(`已成功替换${findCount}处`);
              resolve();
            }
          });
        });
      }
    }
  } catch (err) {
    console.error(`在遍历目录时出错: ${err}`);
  }
}
/**写入文件 */
function writeFileData(fileName, data) {
  fs.writeFile(fileName, data, "utf8", (err) => {
    if (err) {
      console.error("写入文件时错误:", err);
    } else {
      console.log(`文件 ${fileName} 已被成功写入`);
    }
  });
}
langPromise.then(() => {
  traverseDirectorySync("./test").then(() => {
    writeFileData(writeFilePath, fileContent);
  });
});

//let reg;
// // //     = /[a-zA-Z]?_[0-9]?/g;
// // // reg = /\/*(.?)*\//g;
// // // reg = /\/\*{2}|(\*\/\n\s{0,}[a-zA-Z]{1,}_[0-9]{1,})/g;
//reg = /\/\*{2}|(\*\/\n\s{0,}.*_[0-9]{1,})/g;
// reg = /\/*\/.*\n.*?_[0-9]+/g;
//console.log(str.replace(reg, ``));

// reg = /Lang\(LangId..*?\)/g;
// console.log(str.match(reg));
// const fs = require("fs");
// let fileName = process.argv[2];
// if (!fileName) {
//   console.log("输入路径有误");
// } else {
//   fs.readFile(fileName, "utf8", (err, data) => {
//     if (err) {
//       console.error("读取文件时错误:", err);
//     } else {
//       let reg = /export class .*?Model/;
//       let reg2 = /public .*\r\n/g;
//       let matchStr = data.match(reg)[0].replace(`export class `, ``);
//       let matchStr2 = (data.match(reg2) || [])
//         .map((e) => {
//           return e.replace(`public `, ``).replace(`{\r\n`, `\r\n`);
//           //.replace(/=[ ]?\w*/g, `?`);
//         })
//         .join(`    `);
//       let testStr =
//         `export interface I` +
//         matchStr +
//         ` extends IBaseModel {\r\n    ` +
//         matchStr2 +
//         `}`;
//       // 定义要写入的文件路径和内容
//       const filePath = `I` + matchStr + ".ts";
//       const fileContent = testStr;
//       // 使用 fs.writeFile 方法创建文件并写入内容
//       // 如果文件已存在，该方法会覆盖原有内容
//       fs.writeFile(filePath, fileContent, "utf8", (err) => {
//         if (err) {
//           console.error("写入文件时错误:", err);
//         } else {
//           console.log(`文件 ${filePath} 已被成功写入`);
//         }
//       });
//     }
//   });
// }
