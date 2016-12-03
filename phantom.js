
var page = require('webpage').create();

  page.open('localhost:8080', function() {
    page.onLoadFinished = function(){
      console.log(window.test1);      
    };
  });