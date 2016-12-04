const Promise = require('bluebird');
const phantom = require('phantom');

const TelegramBot = require('node-telegram-bot-api');
const token = '304789974:AAELRQVFZdawKJHFENV_9EZ6zrRgbfF_X9A';
const bot = new TelegramBot(token, { polling: true });

let chatId;

const status = {
  stage: 'mock',
  player: 1
};

// TELEGRAM CHATBOT
bot.onText(/\/start/, function(msg) {
  if (status.stage === 'inactive') {
    botSendMsg('🎮 Welcome to Emoji Wars: Space! 🚀🚀🚀')
      .then(() => botSendMsg('Initial map'))
      .then(startGame)
      .then(onGame)
      .then(endGame);
  }
  if (status.stage === 'mock') {
    launchMock();
  }
});

const botListeners = {};
let botLastListenerId = 0;

function botAddListener(id, msg, callback) {
  botListeners[id] = {
    msg,
    callback
  }
}

function botCheckListener(msg) {
  const keys = Object.keys(botListeners);
  let current;
  let result = false;
  for (var i = 0; i < keys.length; i++) {
    current = botListeners[keys[i]];
    if (status.stage === 'mock') return current.callback;
    console.log(`MSG: ${msg}`);
    console.log(`CRITERIA: ${`/${current.msg}`}`);
    if (msg === `/${current.msg}`) result = current.callback;
  }
  console.log(`RESULT: ${result}`);
  return result;
}

function botRemoveListener(id) {
  if (botListeners[id]) delete botListeners[id];
}

function botNextMsg(msg) {  
  const id = `id${botLastListenerId++}`;
  return new Promise((resolve) => {
    botAddListener(id, msg, (msg) => {
        botRemoveListener(id);
        resolve(msg);
    });
  });
}

bot.on('message', function(msg) {
  console.log(`[DE🐞] ${msg.text}`)
  chatId = chatId || msg.chat.id;
  const listenerCallback = botCheckListener(msg.text);
  if (listenerCallback) listenerCallback(msg);
});

bot.on('callback_query', function(msg) {
  console.log(`[DE🐞 QUERY] ${msg.data}`)
  chatId = chatId || msg.chat.id;
  const listenerCallback = botCheckListener(msg.text);
  if (listenerCallback) listenerCallback(msg);
  let message;
  if (msg.data === '1') message = '3, 2, 1... Launch!'

  bot.answerCallbackQuery(msg.id, message);
});

function botSendMsg(msg) {
  return Promise.resolve(bot.sendMessage(chatId, msg));
}

function botSendOptions(msg, options, msgid) {
  var opt = {
        reply_markup: JSON.stringify({
          inline_keyboard: [
  [{ text: '👍', callback_data: '1' }, { text: 'Help', callback_data: '1' }]
]
        })
    };

  return Promise.resolve(bot.sendMessage(chatId, msg, opt));
}

function botSendArrows(msg) {
  return Promise.resolve(bot.sendMessage(chatId, msg));
}

function botSendPhoto(name) {
  console.log('name');
  console.log('./' + name);
  return Promise.resolve(bot.sendPhoto(chatId, './' + name));
}

function botSendGif(name) {
  name = 'test.gif';
  return Promise.resolve(bot.sendDocument(chatId, './' + name));
}

function botSendStart() {}


let page;
// STAGES
async function startGame() {
  const instance = await phantom.create();
  page = await instance.createPage();
  await page.on("onResourceRequested", function(requestData) {
    // console.info('Requesting', requestData.url)
  });

  return page.open('http://127.0.0.1:8080/')
    .then(() => waitReady())
    .then(() => start())
};

function onGame() {
  return waitTurn()
    .then(executeTurn)
    .then(data => data.finished ? console.log('Game finished') : onGame);
}

const angles = {

}

function executeTurn(data) {
  const angle = angles[data.msg];
  return generateTurn(angle);
}

function generateTurn(angle) {
  return generateImages(angle, status)
    .then(generateGif)
    .then(gif => {
      return {
        gif,
        finished: true,
        endData: {
          winner: 1
        }
      };
    });
  return {
    finished: true,
    gif: 'turn1',
    endData: {
      winner: 1
    }
  }
}

function generateImages(angle, status) {
  frame = 0;
  return prepareTurn(angle, status)
    .then(frames)
    .then()
}

function prepareTurn(angle, status) {
  dispatchEvent('fire', {angle, status})
  return Promise.resolve([]);
}

function dispatchEvent() {

}

function frames(data) {
  const tmpData = {

  };
  return waitForFrame()
    .then(renderFrame)
    .then(name => data.push(name))
}

function waitForFrame() {
  return new Promise((resolve) => {
    page.on('onConsoleMessage', function(msg) {
      if (msg === 'game-frame') {
        resolve();
      }
    });
  });
}

let frame = 0;

function renderFrame() {
  const name = `frame${frame++}.png`;
  page.render(name);
  return Promise.resolve(name);
}

function endGame() {}

// ON GAME
function waitTurn(data) {
  return botSendMsg(`It's your turn, player ${status.player}!\n
    Choose the direction you want to send your emoji to`)
    .then(() => botNextMsg('↗', msg => {
      data.msg = msg;
      resolve(data);
    }));
}

// PHANTOMJS
function waitReady() {
  return new Promise((resolve) => {
    page.on('onConsoleMessage', function(msg) {
      if (msg === 'game-ready') {
        resolve();
      }
    });
  });
}

function start() {
  renderStart()
    .then(waitPromise)
    .then(botSendPhoto);
}

function renderStart() {
  const name = 'start.png';
  page.render(name);
  return Promise.resolve(name);
}

// UTILS

function waitPromise(data, ms = 500) {
  return new Promise(resolve => setTimeout(() => resolve(data), ms));
}

function waitPromise1s(data, ms = 2000) {
  return new Promise(resolve => setTimeout(() => resolve(data), ms));
}

function waitPromise2s(data, ms = 2000) {
  return new Promise(resolve => setTimeout(() => resolve(data), ms));
}

function waitPromise5s(data, ms = 2000) {
  return new Promise(resolve => setTimeout(() => resolve(data), ms));
}

function launchMock() {
  return botSendMsg('🎮 Welcome to Emoji Wars: Space! 🚀🚀🚀\nDo you want to start the game?')
      .then(() => showOptions([ '👍' , '🖕']))
      .then(botNextMsg) // Esperar mensaje
      .then(() => botSendMsg('This is your battlefield')) // Enviar mensaje
      .then(waitPromise1s) // Esperar (waitPromise es medio segundo, waitPromise1s/2s/5s)
      .then(mockSendInitialImage) // Envía la imagen inicial
      .then(waitPromise2s)
      .then(() => botSendMsg("It's your turn, @dani.\nWhere will you aim?"))
      .then(botNextMsg)
      .then(() => botSendMsg("Good choice, this is the result of your turn:"))
      .then(() => botSendGif('mock/turn1.gif'));
}

function showOptions(options) {
  return botSendOptions("Type an option:", options);
}

function mockSendInitialImage() {
  return botSendPhoto('./mock/start.png');
}


/*
var page = require('webpage').create();

page.open('http://127.0.0.1:8080/', function() {
    page.addEventListener('console-message', function(msg) {
        console.log(msg);
        if (msg === 'game-ready') {
            page.render('start.png');
        }
    });
});
*/
