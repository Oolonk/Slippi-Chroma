const { app, BrowserWindow } = require('electron')

function createWindow () {
  // Erstelle das Browser-Fenster.
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // und lade die index.html der App.
  win.loadFile('index.html')
}

app.whenReady().then(createWindow)




  /*
This example script connects to a relay, automatically detects combos,
and generates a Dolphin-compatible `combos.json` file when disconnected
from the relay.
*/

const WebSocket = require("ws");
const fs = require("fs");
const { tap, map, filter } = require("rxjs/operators");
var leftcolor;
var rightcolor;
var start = false;


// eslint-disable-next-line @typescript-eslint/no-var-requires
const { SlpFolderStream, ConnectionStatus, Slpstream, SlpRealTime, ComboFilter, generateDolphinQueuePayload } = require("@vinceau/slp-realtime");

// TODO: Make sure you set this value!
const slpLiveFolderPath = "C:\\Emulation\\Emulatoren\\Slippi Online\\Slippi";
console.log(`Monitoring ${slpLiveFolderPath} for new SLP files`);
// TODO: Make sure you set these values!
// Connect to the relay


const stream = new SlpFolderStream();




const wss = new WebSocket.Server({ port: 8080 });
wss.on("connection", (client) => {
  console.log("Client connected!");
  client.send( JSON.stringify({start: start,
  leftcolor: leftcolor,
  rightcolor: rightcolor}));




});
const sendUpdate = (data) => {
  wss.clients.forEach((client) => {
    // const data = `hello world ${counter}!`;
    if (client !== wss && client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};

// Add the combos to the queue whenever we detect them
const realtime = new SlpRealTime();
realtime.setStream(stream);
realtime.game.start$.subscribe((payload) => {
  isTeams = payload.isTeams;
  players = payload.players;

  if (isTeams == true) {

  if (players[0].teamId == 0)
    leftcolor = [241, 89, 89];
  else if (players[0].teamId == 1)
    leftcolor = [101, 101, 254];
  else
    leftcolor = [76, 228, 76];
var z = 1;
if (players[0].teamId == players[1].teamId) {
  z = 2;
}

      if (players[z].teamId == 0)
        rightcolor = [241, 89, 89];
      else if (players[z].teamId == 1)
        rightcolor = [101, 101, 254];
      else
        rightcolor = [76, 228, 76];

    } else {
      if (players[0].port == 1)
        leftcolor = [241, 89, 89];
      else if (players[0].port == 2)
        leftcolor = [101, 101, 254];
      else if (players[0].port == 3)
        leftcolor = [254, 190, 63];
      else if (players[0].port == 4)
        leftcolor = [76, 228, 76];
      else
        leftcolor = [127, 127, 127];


          if (players[1].port == 1)
            rightcolor = [241, 89, 89];
          else if (players[1].port == 2)
            rightcolor = [101, 101, 254];
          else if (players[1].port == 3)
            rightcolor = [254, 190, 63];
          else if (players[1].port == 4)
            rightcolor = [76, 228, 76];
          else
            rightcolor = [127, 127, 127];
  }
  sendUpdate(
    JSON.stringify({
      event: "start",
      leftcolor: leftcolor,
      rightcolor: rightcolor
    })
  );
  start = true;
  console.log("START");
});
realtime.game.end$.subscribe((payload) => {
    var player;
    console.log("Game!");
    console.log(payload.winnerPlayerIndex);
  if (isTeams == true) {

    if (players[payload.winnerPlayerIndex].teamId == 0)
      player = [241, 89, 89];
    else if (players[payload.winnerPlayerIndex].teamId == 1)
      player = [101, 101, 254];
    else
      player = [76, 228, 76];

      } else {
        if (payload.winnerPlayerIndex == 0)
          player = [241, 89, 89];
        else if (payload.winnerPlayerIndex == 1)
          player = [101, 101, 254];
        else if (payload.winnerPlayerIndex == 2)
          player = [254, 190, 63];
        else if (payload.winnerPlayerIndex == 3)
          player = [76, 228, 76];
        else
          player = [127, 127, 127];
    }

      start = false;
    sendUpdate(
    JSON.stringify({
      event: "winner",
      player: player,
    })
  );
  });

realtime.stock.playerDied$.subscribe((payload) => {
  var player;
  var opponent;
    if (isTeams == true) {
      if (players[payload.playerIndex].teamId == 0)
        player = [241, 89, 89];
      else if (players[payload.playerIndex].teamId == 1)
        player = [101, 101, 254];
      else
        player = [76, 228, 76];

        if (players[payload.opponentIndex].teamId == 0)
          opponent = [241, 89, 89];
        else if (players[payload.opponentIndex].teamId == 1)
          opponent = [101, 101, 254];
        else
          opponent = [76, 228, 76];

    } else {

        if (payload.playerIndex == 0)
          player = [241, 89, 89];
        else if (payload.playerIndex == 1)
          player = [101, 101, 254];
        else if (payload.playerIndex == 2)
          player = [254, 190, 63];
        else
          player = [76, 228, 76];

          if (payload.opponentIndex == 0)
            opponent = [241, 89, 89];
          else if (payload.opponentIndex == 1)
            opponent = [101, 101, 254];
          else if (payload.opponentIndex == 2)
            opponent = [254, 190, 63];
          else
            opponent = [76, 228, 76];

  }
  sendUpdate(
  JSON.stringify({
    event: "died",
    player: player,
    opponent: opponent,
  })
);
});
// You can do the same subscription above without using RxJS.
// Doing so would make the subcription look something like this:

// realtime.combo.end$.subscribe(payload => {
//   if (comboFilter.isCombo(payload.combo, payload.settings)) {
//     console.log("Detected combo!");
//     const filename = stream.getCurrentFilename();
//     if (filename) {
//       comboQueue.push({path: filename, combo: payload.combo});
//     }
//   }
// });
stream.start(slpLiveFolderPath);
