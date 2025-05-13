// const fs = require("fs");
// const path = require("path");

// // 假设你有一个目录路径
// const directoryPath = "./test";

// // 递归地读取目录中的所有文件
// async function readAllFiles(dirPath) {
//   const entries = await fs.readdir(dirPath, { withFileTypes: true });

//   const promises = entries.map(async (entry) => {
//     const fullPath = path.join(dirPath, entry.name);

//     if (entry.isDirectory()) {
//       // 递归调用以读取子目录中的文件
//       return readAllFiles(fullPath);
//     } else {
//       // 读取文件内容（这里只是一个例子，你可能不需要这样做）
//       const content = await fs.readFile(fullPath, "utf8");
//       console.log(`Read file: ${fullPath}`);
//       // 返回文件内容或其他你需要的信息
//       return content;
//     }
//   });

//   // 使用 Promise.all 等待所有文件读取完成
//   const results = await Promise.all(promises);

//   // results 数组现在包含所有文件的内容（或你返回的其他信息）
//   // 注意：由于我们递归地调用了 readAllFiles，results 可能是嵌套的数组
//   // 你可能需要进一步处理这个数组以获取你想要的格式
//   return results;
// }

// readAllFiles(directoryPath)
//   .then((results) => {
//     console.log("All files have been read");
//     // 处理结果...
//   })
//   .catch((error) => {
//     console.error("Error while reading files:", error);
//   });
const fs = require("fs");

let a = 0;
function readFile() {
  a++;

  return new Promise((res, rej) => {
    fs.readFile(`${a}.txt`, "utf8", (err, data) => {
      if (err) {
        console.error("读取文件时错误:", err);
      } else {
        console.log(data);
        res();
      }
    });
  });
  //   await fs.readFile(`${2}.txt`, "utf8", (err, data) => {
  //     if (err) {
  //       console.error("读取文件时错误:", err);
  //     } else {
  //       console.log(data);
  //     }
  //   });
}
Promise.all([readFile(), readFile()]).then(() => {
  console.log(`执行下一个`);
  fs.readFile(`${3}.txt`, "utf8", (err, data) => {
    if (err) {
      console.error("读取文件时错误:", err);
    } else {
      console.log(data);
    }
  });
});
// readFile().finally(() => {
//   console.log(`执行下一个`);
//   fs.readFile(`${3}.txt`, "utf8", (err, data) => {
//     if (err) {
//       console.error("读取文件时错误:", err);
//     } else {
//       console.log(data);
//     }
//   });
// });
