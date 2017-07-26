const translate = require('./translate.js')

let transText = 'hello world!';
translate(transText,{to: 'zh-CN'}).then(function(result){
  console.log(result.text)
});

