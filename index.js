const translate = require('./translate.js')

const express = require('express')
const bodyParser = require('body-parser')
const PORT = 3001

// test the translate api.
let transText = 'hello world!';
translate(transText, {to: 'zh-CN'}).then(result => {
  if (result.text === '你好，世界！') {
    console.log('Translate "hello world" successfully');
  }
});

// prepare the server.
const app = express()
app.use(bodyParser.json());

/**
 * PATH: /translate
 * METHOD: POST
 * REQUEST:
*      BODY: {text: '...'},
 *     DESC: text的长度不可超过4000字符
 * RESPONSE:
 *     SUCCESS: {error: 0, result: '...'}
 *     ERROR:   {error: 非零整数, message: '....'}
 */
app.post('/translate', (request, response) => {
  let transText = request.body.text;
  if (transText.length > 4000) {
    response.json({
      error: 1,
      message: 'Too large request, the length of text should NOT exceed 4000.' 
    });
  }
  else {
    translate(transText, {to: 'zh-CN'}).then(result => {
      response.json({
        error: 0,
        result: result.text,
      });
    }).catch(e => {
      let message = e.code;
      let statusCode = e.statusCode;
      if (e.statusCode == 1) {
        message = 'Bad network.';
      } else if (e.statusCode == 413) {
        message = 'Your client issued a request that was too large.';
      }
      response.json({
        error: statusCode,
        message: message,
      });
    });
  }
});

// start server.
let port = PORT;
if (process.argv.length > 2) {
  port = process.argv[2];
}

console.log('The server start running at port ' + port + ' ...')
app.listen(port)
