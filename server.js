const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const {createReadStream} = require('fs');
const readline = require('readline');
const process = require('process');

const app = express();
const port = process.env.PORT || 80

app.use(cors());
app.use(helmet());
app.use(express.static('public'));

var words = [];
var currentWord = '';

const readLines = readline.createInterface({
  input: createReadStream('words.txt')
});

readLines.on('line', word => {
  words.push(word);
});

wordOfTheDay = () => {
  const random = Math.floor(Math.random() * words.length);
  return words[random];
}

resolveWord = word => {
  let resolve = [];
  // Split the current word
  const cw_letters = currentWord.split('');
  const w_letter = word.split('');
  for (i=0; i < w_letter.length; i++) {
    if (w_letter[i] == cw_letters[i]) {
      resolve.push({
        'letter'	: w_letter[i],
        'samepos'	: 1
      });
    } else {
      const positions = letterPositions(w_letter[i]);
      if (positions.length > 0) {
        resolve.push({
          'letter'	: w_letter[i],
          'samepos'	: 0
        });
      } else {
        resolve.push({
          'letter'	: w_letter[i],
          'samepos'	: -1
        });
      }
    }
  }
  return resolve;
}

letterPositions = letter => {
  var a=[],i=-1;
  while((i=currentWord.indexOf(letter,i+1)) >= 0) a.push(i);
  return a;
}

app.get('/', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' })
  createReadStream('index.html').pipe(res)
});

app.get('/getwordday', (req, res) => {
  const word = wordOfTheDay();
  currentWord = word
  res.json(word);
});

app.get('/checkword', (req, res) => {
  if (req.query.word) {
    let resolve = resolveWord(req.query.word);
    res.json(resolve);
  } else res.end('No word');
});

app.listen(port, () => {
  console.log(`Running server`)
});
