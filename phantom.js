
var page = require('webpage').create();

page.open('http://127.0.0.1:8080/', function() {
  page.onConsoleMessage = function(msg){
    console.log(msg);
    if (msg === 'game-ready') {
      page.render('start.png');
    }      
  };
});