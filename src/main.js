const express = require('express');
const {
  saveData,
  getFileData,
  writeFile,
  sendMsg,
  targetPath,
  getValueFormArray,
  getReadMe,
} = require('./utils/index');
const { tipsObj } = require('./utils/tips');

const app = express();

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// 新增数据
function addData({ data }) {
  const tip = tipsObj[saveData(data)];
  sendMsg(tip);
  return {
    message: '成功',
    code: saveData(data),
  };
}
// 更新数据
function updateData({ data }) {
  const tem = getValueFormArray(data);
  const dataBase = getFileData();
  tem.forEach((item) => {
    if (dataBase.includes(item)) {
      const i = dataBase.indexOf(item);
      dataBase.splice(i, 1, tem);
    }
  });
  writeFile(targetPath, dataBase);
  sendMsg(tipsObj[2002]);
  return 2002;
}
// 删除数据
function deleteData({ data }) {
  const tem = getValueFormArray(data);
  const dataBase = getFileData();
  tem.forEach((item) => {
    if (dataBase.includes(item)) {
      const i = dataBase.indexOf(item);
      dataBase.splice(i, 1);
    }
  });
  writeFile(targetPath, dataBase);
  sendMsg(tipsObj[2001]);
  return 2001;
}
// 处理list和help
function handleText(text) {
  if (text === 'list') {
    sendMsg(getFileData());
    return getFileData();
  }
  if (text === 'help') {
    sendMsg(getReadMe(), true);
  }
}
app.post('/getMessage', (req, res) => {
  let content = {};
  try {
    console.log('req.body', req.body);
    content = JSON.parse(req.body.text.content);
  } catch (error) {
    console.log('error', error);
    content = {
      type: 'text',
      text: req.body.text.content,
    };
  }
  switch (content.type) {
    case 'add':
      res.send(addData(content));
      break;
    case 'update':
      res.send(updateData(content));
      break;
    case 'delete':
      res.send(deleteData(content));
      break;
    default:
      handleText(content.text);
      res.send(200);
  }
});
app.listen(3000);
