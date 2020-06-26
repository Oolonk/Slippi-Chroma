/*
This example script connects to a relay, automatically detects combos,
and generates a Dolphin-compatible `combos.json` file when disconnected
from the relay.
*/

const WebSocket = require("ws");
const fs = require("fs");
const { tap, map, filter } = require("rxjs/operators");

var start = false;


// eslint-disable-next-line @typescript-eslint/no-var-requires
const { ConnectionStatus, SlpLiveStream, SlpRealTime, ComboFilter, generateDolphinQueuePayload } = require("@vinceau/slp-realtime");

// TODO: Make sure you set these values!
const ADDRESS = "localhost";  // leave as is if the relay is on the same computer
const PORT = 53742;            // relay port

const outputCombosFile = "combos.json";   // The json file to write combos to
var isTeams;
var players;
const comboQueue = [];  // Tracks the combos to be written


// Connect to the relay
const livestream = new SlpLiveStream({
  outputFiles: false,  // Write out slp files so we can reference them in the dolphin json file
});

// connect to the livestream
livestream.start(ADDRESS, PORT)
  .then(() => {
    console.log("Connected to Slippi Relay");
  })
  .catch(console.error);

// Write out the files when we've been disconnected
livestream.connection.on("statusChange", (status) => {
  if (status === ConnectionStatus.DISCONNECTED) {
    console.log("Disconnected from the relay.");
  }
});



const wss = new WebSocket.Server({ port: 8080 });
wss.on("connection", (client) => {
  console.log("Client connected!");
  client.send( JSON.stringify({start: start,}));




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
realtime.setStream(livestream);

realtime.game.start$.subscribe((payload) => {
  isTeams = payload.isTeams;
  players = payload.players;
  sendUpdate(
    JSON.stringify({
      event: "start",
    })
  );
  start = true;
  console.log("START");
});
realtime.game.end$.subscribe((payload) => {
    var player;
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

    sendUpdate(
    JSON.stringify({
      event: "winner",
      player: player,
    })
  );
    start = false
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
//     const filename = livestream.getCurrentFilename();
//     if (filename) {
//       comboQueue.push({path: filename, combo: payload.combo});
//     }
//   }
// });
