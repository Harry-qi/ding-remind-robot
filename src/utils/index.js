// nowDate是当前时间，delay设置nowDate后的天数
const fs = require('fs');
const fetch = require('node-fetch');
const path = require('path');
// 存储的文件
const targetPath = path.resolve(__dirname, '../dataBase/data.json');
const readMePath = path.resolve(__dirname, '../../README.md');

// 获取data.json的数据
function getFileData() {
  try {
    const data = fs.readFileSync(targetPath, 'utf8');
    return data.trim() === '' ? [] : JSON.parse(data);
  } catch (err) {
    console.error(err);
  }
}

// 获取数组中的对象值,并转化为空格隔开的字符串
// 例如：[{name:'测试',startTime:'2021-06-18 12:00',endTime:'2021-06-18 18:00'}]
// 会转化为[ '测试 2021-06-18 12:00 2021-06-18 18:00' ]
function getValueFormArray(arr) {
  return arr.map((item) => Object.values(item).join(' '));
}

// 判断targetArr是否有数据已经经存在于dataBase
function isIncludes(dataBase, targetArr) {
  let res = false;
  for (let index = 0; index < targetArr.length; index++) {
    const item = targetArr[index];
    if (dataBase.includes(item)) {
      res = true;
      break;
    }
  }
  return res;
}
// 写入文件
function writeFile(p, data) {
  fs.writeFileSync(p, JSON.stringify(data, null, 2));
}
module.exports = {
  getValueFormArray,
  getFileData,
  isIncludes,
  targetPath,
  writeFile,
  getReadMe() {
    return fs.readFileSync(readMePath, 'utf8');
  },
  saveData: (data) => {
    try {
      // 已存在的数据返回40001
      const dataBase = getFileData();
      const strData = getValueFormArray(data);
      if (isIncludes(dataBase, strData)) {
        return 4001;
      }
      dataBase.push(strData);
      writeFile(targetPath, dataBase.flat());
      return 2000;
      // 文件写入成功。
    } catch (err) {
      console.error(err);
    }
  },
  // 发送钉钉消息
  sendMsg: (msg, isMarkdown = false) => {
    const url = 'https://oapi.dingtalk.com/robot/send?access_token=e8fea6a1b0a901d6801571a77b1421ebfcf0d9011001aec28bb6ade1b7960887';
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    if (isMarkdown) {
      options.body = JSON.stringify({
        msgtype: 'markdown',
        markdown: { title: '说明', text: msg },
      });
    } else {
      options.body = JSON.stringify({
        msgtype: 'text',
        text: { content: msg },
      });
    }
    fetch(url, options).then((res) => res.json())
      .then((body) => console.log(body));
  },
};
