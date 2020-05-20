var http = require("http");
var socketio = require("socket.io");
var path = require('path');
var fs = require("fs");
var mime = {
  ".html": "text/html",
  ".css":  "text/css",
  ".js":  "text/javascript"
};

var server = http.createServer(function(req, res) {
  if (req.url == '/') {
    filePath = '/index.html';
    index_flg = true;
    console.log('index');
  } else {
    filePath = req.url;
    index_flg = false;
    console.log(filePath);
  }

  //res.writeHead(200, {"Content-Type":"text/html"});  
  // var output = fs.readFileSync("./index.html", "utf-8");
  // res.end(output);
  var fullPath = __dirname + filePath;
  res.writeHead(200, {"Content-Type": mime[path.extname(fullPath)] || "text/plain"});
  if (index_flg) {
    var output = fs.readFileSync("./index.html", "utf-8");
    res.end(output);
  } else {
    fs.readFile(fullPath, function(err, data) {
      if (err) {
        var output = fs.readFileSync("./index.html", "utf-8");
        res.end(output);
      } else {
        res.end(data, 'UTF-8');
      }
    });
  }
}).listen(3000);

var io = socketio.listen(server);
var count = 0;

// オセロデータ
var othellodata = [
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0],
  [0,0,0,1,2,0,0,0],
  [0,0,0,2,1,0,0,0],
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0],
];

// オセロフラグ（今、○の番か、●の番か）
var othelloflg = 1;

io.sockets.on("connection", function (socket) {
  console.log( "ConnectToServer start");
  
  // 接続数++
  count++;
  
  
  // 接続処理
  io.sockets.emit("ConnectToServer", count);
  io.sockets.emit("OthelloDataUpdateServerToClient", {data1:othellodata, data2:othelloflg});

  // 切断処理
  socket.on("DisconnectToServer", function () {
    console.log( "DisconnectToServer start");
    count--;
    io.sockets.emit("DisconnectToServer", count);
  });
  
  // オセロデータ更新処理
  socket.on("othelloDataSendClientToServer", function (data) {
    console.log( "othelloDataSendClientToServer start");
    for (var i=0 ; i<8 ; i++){
      for (var j=0 ; j<8 ; j++){
        othellodata[i][j] = data.data1[i][j];
      }
    }
  
    othelloflg = data.data2;
    
    // クライアントに送信
    io.sockets.emit("OthelloDataUpdateServerToClient", {data1:othellodata, data2:othelloflg});
  });
  
  
});