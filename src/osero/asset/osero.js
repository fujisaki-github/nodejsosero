
var socket = io.connect();
var localcount = 0; 
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

var othelloflg = 1;

socket.on("ConnectToServer", function(data){ connectServer(data);});
socket.on("DisconnectToServer", function(data){ disconnectServer(data);});
socket.on("OthelloDataUpdateServerToClient", function(data){ othelloDataUpdate(data.data1, data.data2);});  
function connectServer(data){
  connectCountUpdate(data);
}

function disconnectServer(data){
  connectCountUpdate(data);
}

function othelloDataUpdate(data1, data2){
  for (var i=0 ; i<8 ; i++){
    for (var j=0 ; j<8 ; j++){
      othellodata[i][j] = data1[i][j];
    }
  }
  othelloflg = data2;
  othelloPrint();
}

function connectCountUpdate(data){
  document.getElementById("count").innerHTML = data;
  localcount = data;
}


function othelloDatasend(){
  socket.emit("othelloDataSendClientToServer", {data1:othellodata, data2:othelloflg});
}

function othelloRestart(){

  for (var i=0 ; i<8 ; i++){
    for (var j=0 ; j<8 ; j++){
      othellodata[i][j] = 0;
      
      othellodata[3][3] = 1;
      othellodata[3][4] = 2;
      othellodata[4][3] = 2;
      othellodata[4][4] = 1;
      var cell;
      cell = i + j*8;
    }
  }
  
    othelloflg = 1;
  
    othelloPrint();
  
    othelloDatasend();

}


function othelloPrint(){

var Prescore = 0; var Secscore = 0; var nullnum = 0; var printStatusText = '';

  for (var i=0 ; i<8 ; i++){
    for (var j=0 ; j<8 ; j++){

      var cell;
      cell = i + j*8;
      
      document.getElementById(cell).innerHTML = changeOthello(othellodata[i][j]);
    }
  }

  for (var i=0 ; i<8 ; i++){
    for (var j=0 ; j<8 ; j++){
      switch (othellodata[i][j]) {
        case "1":
        case 1:
          Prescore = Prescore + 1;
          break;
        case "2":
        case 2:
          Secscore = Secscore + 1;
          break;
        case "0":
        case 0:
        default:
          nullnum = nullnum + 1;
          break;
      }
    }
  }

    if (nullnum == '0' || (nullnum == Prescore || nullnum == Prescore)){
    if (Prescore == Secscore) {
      printStatusText = "終了、同点！「○」: いい戦いでしたね！<br> もう一度戦う場合には最初からを押してください！";
    }　else if (Prescore > Secscore) {
      printStatusText = "終了、○の勝ち！「○」: " + Prescore + "個、「●」: " + Prescore + "個<br> もう一度戦う場合には最初からを押してください！";
    } else { Prescore < Secscore} {
      printStatusText = "終了、●の勝ち！「○」: " + Prescore + "個、「●」: " + Secscore + "個<br> もう一度戦う場合には最初からを押してください！";      
    }

                                
  }else{
    if (othelloflg == '1'){
      printStatusText = "「○」の番";
    }else{
      printStatusText = "「●」の番";
    }
    printStatusText +=  "<br>今現在の状況は…   「○」: " + Prescore + "個、「●」: " + Secscore + "個<br>"
  }
  document.getElementById("othstatus").innerHTML = printStatusText;
}


function changeOthello(othellodata){
  switch (othellodata) {
    case "1":
    case 1:
      return "○";
      break;
    case "2":
    case 2:
      return "●";
      break;
    case "0":
    case 0:
    default:
      return "　";
      break;
  }
}


function changeTurn(){

  if (othelloflg == '1'){
    othelloflg = 2;
  }else{
    othelloflg = 1;
  }

}

function othelloSet(num){

  if (othelloJudge(num) == 0){
    console.log("othSet set false...");
    return;
  }

  othReverse(num);
  
}

function othelloJudge(num){
  var i, j;
  i = num%8;
  j = Math.floor(num/8);

    if (othellodata[i][j] != 0){
    return 0;
  }
  
  return 1;
  
}

function othReverse(num){
  var i, j, reverseflg;
  i = num%8;
  j = Math.floor(num/8);
  reverseflg = 0;
  if ((i-1)>0 && (j-1)>0){
    if (othellodata[i-1][j-1] != 0){
      if (othellodata[i-1][j-1] != othelloflg){
        for (var k=1 ; k<8 ; k++){
          if(i-1-k<0 || j-1-k<0){
            break;
          }
          if(othellodata[i-1-k][j-1-k] == othelloflg){
            for (var m=0 ; m<k ; m++){
              othellodata[i-1-m][j-1-m] = othelloflg;
            }
            reverseflg = 1;
          }
        }
      }
    }
  }

  if ((j-1)>0){
    if (othellodata[i][j-1] != 0){
      if (othellodata[i][j-1] != othelloflg){
        for (var k=1 ; k<8 ; k++){
          if(j-1-k<0){
            break;
          }
          if(othellodata[i][j-1-k] == othelloflg){
            for (var m=0 ; m<k ; m++){
              othellodata[i][j-1-m] = othelloflg;
            }
            reverseflg = 1;
          }
        }
      }
    }
  }
  
  if ((i+1)<8 && (j-1)>0){
    if (othellodata[i+1][j-1] != 0){
      if (othellodata[i+1][j-1] != othelloflg){
        for (var k=1 ; k<8 ; k++){
          if(i+1+k>7 || j-1-k<0){
            break;
          }
          if(othellodata[i+1+k][j-1-k] == othelloflg){
            for (var m=0 ; m<k ; m++){
              othellodata[i+1+m][j-1-m] = othelloflg;
            }
            reverseflg = 1;
          }
        }
      }
    }
  }
  
  if ((i-1)>0){
    if (othellodata[i-1][j] != 0){
      if (othellodata[i-1][j] != othelloflg){
        for (var k=1 ; k<8 ; k++){
          if(i-1-k<0){
            break;
          }
          if(othellodata[i-1-k][j] == othelloflg){
            for (var m=0 ; m<k ; m++){
              othellodata[i-1-m][j] = othelloflg;
            }
            reverseflg = 1;
          }
        }
      }
    }
  }
  
  if ((i+1)<8){
    if (othellodata[i+1][j] != 0){
      if (othellodata[i+1][j] != othelloflg){
        for (var k=1 ; k<8 ; k++){
          if(i+1+k>7){
            break;
          }
          if(othellodata[i+1+k][j] == othelloflg){
            for (var m=0 ; m<k ; m++){
              othellodata[i+1+m][j] = othelloflg;
            }
            reverseflg = 1;
          }
        }
      }
    }
  }
  
  if ((i-1)>0 && (j+1)<8){
    if (othellodata[i-1][j+1] != 0){
      if (othellodata[i-1][j+1] != othelloflg){
        for (var k=1 ; k<8 ; k++){
          if(i-1-k<0 || j+1+k>7){
            break;
          }
          if(othellodata[i-1-k][j+1+k] == othelloflg){
            for (var m=0 ; m<k ; m++){
              othellodata[i-1-m][j+1+m] = othelloflg;
            }
            reverseflg = 1;
          }
        }
      }
    }
  }
  
  if ((j+1)<8){
    if (othellodata[i][j+1] != 0){
      if (othellodata[i][j+1] != othelloflg){
        for (var k=1 ; k<8 ; k++){
          if(j+1+k>7){
            break;
          }
          if(othellodata[i][j+1+k] == othelloflg){
            for (var m=0 ; m<k ; m++){
              othellodata[i][j+1+m] = othelloflg;
            }
            reverseflg = 1;
          }
        }
      }
    }
  }
  
  if ((i+1)<8 && (j+1)<8){
    if (othellodata[i+1][j+1] != 0){
      if (othellodata[i+1][j+1] != othelloflg){
        for (var k=1 ; k<8 ; k++){
          if(i+1+k>7 || j+1+k>7){
            break;
          }
          if(othellodata[i+1+k][j+1+k] == othelloflg){
            for (var m=0 ; m<k ; m++){
              othellodata[i+1+m][j+1+m] = othelloflg;
            }
            reverseflg = 1;
          }
        }
      }
    }
  }
  
  
  if(reverseflg == 1){
    if (othelloflg == 1){
      othellodata[i][j] = 1;
    }else{
      othellodata[i][j] = 2;
    }
    othelloPrint();
    changeTurn();
    othelloDatasend();
  }

}