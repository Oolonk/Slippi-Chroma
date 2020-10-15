
var ipc = require('electron').ipcRenderer;
var fs = require('fs');
const remote = require('electron').remote;
const app = remote.app;
var foldervar;
var relay;
var decision;
var AutoLaunch = require('auto-launch');
var leftcolor = 0;
var rightcolor = 0;
var updating2 = false;
var updating = false;
var chromaSDK = undefined;
var ingame = false;
var updating3 = false;
var key = new Array(22);
var autohide = false;
var razervalue;
var autoLauncher = new AutoLaunch({
    name: 'Slippi Chroma',
});
autoLauncher.isEnabled()
.then(function(isEnabled){
    if(isEnabled){
      console.log("autostart an")
        document.getElementById("autostart").checked = true
    }
})

function autostarting(checked){
    if(checked == true){
        autoLauncher.enable();
    } else {
        autoLauncher.disable();

    }

}
function onPageLoad() {
  chromaSDK = new ChromaSDK();
  var oReq = new XMLHttpRequest();
    oReq.timeout = 2000; // time in milliseconds
    oReq.addEventListener("load", function() {
      console.log('ChromaSDK Version:', this.responseText);
      var jsonVersion = JSON.parse(this.responseText);
      if (jsonVersion != undefined &&
        jsonVersion.version != undefined) {
        var parts = jsonVersion.version.split(".");
        if (parts.length >= 3 &&
          ((parts[0] > 2) ||
          (parts[0] == 2 && parts[1] > 14) ||
          (parts[0] == 2 && parts[1] == 14 && parts[2] >= 0))) {
          } else {
            $("#divUpdateChromaSDK").show();
          }
      }
    });
    oReq.ontimeout = function() {
      console.log('ontimeout');
    };
    oReq.onerror = function() {
      console.log('onerror');
    };
    oReq.addEventListener(
      "readystatechange",
      function() {
        //console.log('readystatechange', this.status);
        if (this.readyState == 4) {
          if (this.status == 200) {
          }
        }
      }
      ,
      false
    );
    oReq.open("GET", "https://chromasdk.io:54236/razer/chromasdk");
    oReq.send();
  }
  function onPageUnload() {
    if (chromaSDK != undefined) {
      chromaSDK.uninit()
    }
  }

function leftcolorfunction(i){
var time = 20 * i;
  setTimeout(function() {
    var x = (i/10);
    var red = (Math.round(x * (piioleftcolor[0] - leftcolorold[0])) + leftcolorold[0]);
    var green = (Math.round(x * (piioleftcolor[1] - leftcolorold[1])) + leftcolorold[1]);
    var blue = (Math.round(x * (piioleftcolor[2] - leftcolorold[2])) + leftcolorold[2]);
    leftcolor = red + green * 256 + blue * 65536;
  }, time);
}
function rightcolorfunction(i){
var time = 20 * i;
  setTimeout(function() {
    var x = (i/10);
    var red = (Math.round(x * (piiorightcolor[0] - rightcolorold[0])) + rightcolorold[0]);
    var green = (Math.round(x * (piiorightcolor[1] - rightcolorold[1])) + rightcolorold[1]);
    var blue = (Math.round(x * (piiorightcolor[2] - rightcolorold[2])) + rightcolorold[2]);
    rightcolor = red + green * 256 + blue * 65536;
  }, time);
}
var middlecolor = [0, 0, 255]
var cyclingto = "red"

setInterval(function(){
if (updating == false) {

if (cyclingto == "red") {
  middlecolor[0] = middlecolor[0] + 1;
  middlecolor[2] = middlecolor[2] - 1;
if (middlecolor[2] == 0) {
  cyclingto = "green";
}
} else if (cyclingto == "green") {
  middlecolor[1] = middlecolor[1] + 1;
  middlecolor[0] = middlecolor[0] - 1;
  if (middlecolor[0] == 0) {
    cyclingto = "blue";
  }
} else if (cyclingto == "blue") {
middlecolor[2] = middlecolor[2] + 1;
middlecolor[1] = middlecolor[1] - 1;
if (middlecolor[1] == 0) {
  cyclingto = "red";
}
}
var color = middlecolor[0] + middlecolor[1] * 256 + middlecolor[2] * 65536;
setTimeout(function(){
if (ingame == true) {
var key = new Array(22);
for (var i = 0; i < 7; i++) {
  key[i] = leftcolor;
}
for (var i = 7; i < 16; i++) {
  key[i] = color;
}
for (var i = 16; i < 22; i++) {
  key[i] = rightcolor;
}
chromaSDK.createChromaLinkEffect("CHROMA_CUSTOM", [color, leftcolor, color, color, rightcolor]);
chromaSDK.createKeyboardEffect("CHROMA_CUSTOM_KEY", [key, key, key, key, key, key]);
chromaSDK.createMouseEffect("CHROMA_STATIC", color);
} else {
var key = new Array(22);
for (var i = 0; i < 22; i++) {
key[i] = color;
}
chromaSDK.createKeyboardEffect("CHROMA_CUSTOM_KEY", [key, key, key, key, key, key]);
chromaSDK.createChromaLinkEffect("CHROMA_CUSTOM", [color, color, color, color, color]);
chromaSDK.createMouseEffect("CHROMA_STATIC", color);

}
}, 2);
}
}, 16);
function playerdead(player){
if (updating3 == false) {
updating2 = true;
setTimeout(function(){
  updating2 = false;

  if (player == 1) {
    var key1 = new Array(22);
    for (var i = 0; i < 7; i++) {
      key1[i] = leftcolor;
    }
    for (var i = 7; i < 16; i++) {
      key1[i] = 0x00;
    }
    for (var i = 16; i < 22; i++) {
      key1[i] = rightcolor;
    }

    var key2 = new Array(22);
    for (var i = 0; i < 7; i++) {
      key2[i] = leftcolor;
    }
    for (var i = 7; i < 16; i++) {
      key2[i] = rightcolor;
    }
    for (var i = 16; i < 22; i++) {
      key2[i] = rightcolor;
    }

    updating = true;
    setTimeout(function(){
    if (updating2 == false && updating3 == false){
      chromaSDK.createChromaLinkEffect("CHROMA_CUSTOM", [rightcolor, leftcolor, rightcolor, rightcolor, rightcolor]);
      chromaSDK.createKeyboardEffect("CHROMA_CUSTOM_KEY", [key2, key2, key2, key2, key2, key2]);
      chromaSDK.createMouseEffect("CHROMA_STATIC", rightcolor);
      setTimeout(function(){
        if (updating2 == false && updating3 == false){
          chromaSDK.createChromaLinkEffect("CHROMA_CUSTOM", [00, leftcolor, 00, 00, rightcolor]);
          chromaSDK.createKeyboardEffect("CHROMA_CUSTOM_KEY", [key1, key1, key1, key1, key1, key1]);
          chromaSDK.createMouseEffect("CHROMA_STATIC", 00);
          setTimeout(function(){
            if (updating2 == false && updating3 == false){
              chromaSDK.createChromaLinkEffect("CHROMA_CUSTOM", [rightcolor, leftcolor, rightcolor, rightcolor, rightcolor]);
              chromaSDK.createKeyboardEffect("CHROMA_CUSTOM_KEY", [key2, key2, key2, key2, key2, key2]);
              chromaSDK.createMouseEffect("CHROMA_STATIC", rightcolor);
              setTimeout(function(){
                if (updating2 == false && updating3 == false){
                  chromaSDK.createChromaLinkEffect("CHROMA_CUSTOM", [00, leftcolor, 00, 00, rightcolor]);
                  chromaSDK.createKeyboardEffect("CHROMA_CUSTOM_KEY", [key1, key1, key1, key1, key1, key1]);
                  chromaSDK.createMouseEffect("CHROMA_STATIC", 00);
                  setTimeout(function(){
                    if (updating2 == false && updating3 == false){
                      chromaSDK.createChromaLinkEffect("CHROMA_CUSTOM", [rightcolor, leftcolor, rightcolor, rightcolor, rightcolor]);
                      chromaSDK.createKeyboardEffect("CHROMA_CUSTOM_KEY", [key2, key2, key2, key2, key2, key2]);
                      chromaSDK.createMouseEffect("CHROMA_STATIC", rightcolor);
                      setTimeout(function(){
                        if (updating2 == false && updating3 == false){
                          chromaSDK.createChromaLinkEffect("CHROMA_CUSTOM", [00, leftcolor, 00, 00, rightcolor]);
                          chromaSDK.createKeyboardEffect("CHROMA_CUSTOM_KEY", [key1, key1, key1, key1, key1, key1]);
                          chromaSDK.createMouseEffect("CHROMA_STATIC", 00);
                          setTimeout(function(){
                            updating = false;

                          }, 200);
                          }
                        }, 200);
                      }
                    }, 200);
                  }
                }, 200);
              }
            }, 200);
          }
        }, 200);
      }
    }, 16);
    } else if (player == 2) {

      var key1 = new Array(22);
      for (var i = 0; i < 7; i++) {
        key1[i] = leftcolor;
      }
      for (var i = 7; i < 16; i++) {
        key1[i] = 0x00;
      }
      for (var i = 16; i < 22; i++) {
        key1[i] = rightcolor;
      }
      var key2 = new Array(22);
      for (var i = 0; i < 7; i++) {
        key2[i] = leftcolor;
      }
        for (var i = 7; i < 16; i++) {
          key2[i] = leftcolor;
        }
        for (var i = 16; i < 22; i++) {
          key2[i] = rightcolor;
        }
        updating = true;
        setTimeout(function(){
        if(updating2 == false && updating3 == false){
          chromaSDK.createChromaLinkEffect("CHROMA_CUSTOM", [leftcolor, leftcolor, leftcolor, leftcolor, rightcolor]);
          chromaSDK.createKeyboardEffect("CHROMA_CUSTOM_KEY", [key2, key2, key2, key2, key2, key2]);
          chromaSDK.createMouseEffect("CHROMA_STATIC", leftcolor);
          setTimeout(function(){
            if(updating2 == false && updating3 == false){
              chromaSDK.createChromaLinkEffect("CHROMA_CUSTOM", [00, leftcolor, 00, 00, rightcolor]);
              chromaSDK.createKeyboardEffect("CHROMA_CUSTOM_KEY", [key1, key1, key1, key1, key1, key1]);
              chromaSDK.createMouseEffect("CHROMA_STATIC", 00);
              setTimeout(function(){
                if(updating2 == false && updating3 == false){
                  chromaSDK.createChromaLinkEffect("CHROMA_CUSTOM", [leftcolor, leftcolor, leftcolor, leftcolor, rightcolor]);
                  chromaSDK.createKeyboardEffect("CHROMA_CUSTOM_KEY", [key2, key2, key2, key2, key2, key2]);
                  chromaSDK.createMouseEffect("CHROMA_STATIC", leftcolor);
                  setTimeout(function(){
                    if(updating2 == false && updating3 == false){
                      chromaSDK.createChromaLinkEffect("CHROMA_CUSTOM", [00, leftcolor, 00, 00, rightcolor]);
                      chromaSDK.createKeyboardEffect("CHROMA_CUSTOM_KEY", [key1, key1, key1, key1, key1, key1]);
                      chromaSDK.createMouseEffect("CHROMA_STATIC", 00);
                      setTimeout(function(){
                        if(updating2 == false && updating3 == false){
                          chromaSDK.createChromaLinkEffect("CHROMA_CUSTOM", [leftcolor, leftcolor, leftcolor, leftcolor, rightcolor]);
                          chromaSDK.createKeyboardEffect("CHROMA_CUSTOM_KEY", [key2, key2, key2, key2, key2, key2]);
                          chromaSDK.createMouseEffect("CHROMA_STATIC", leftcolor);
                          setTimeout(function(){
                            if(updating2 == false && updating3 == false){
                              chromaSDK.createChromaLinkEffect("CHROMA_CUSTOM", [00, leftcolor, 00, 00, rightcolor]);
                              chromaSDK.createKeyboardEffect("CHROMA_CUSTOM_KEY", [key1, key1, key1, key1, key1, key1]);
                              chromaSDK.createMouseEffect("CHROMA_STATIC", 00);
                              setTimeout(function(){
                                updating = false;
                              }, 200);
                            }
                          }, 200);
                        }
                      }, 200);
                    }
                  }, 200);
                }
              }, 200);
            }
          }, 200);
        }
      }, 16);
      }else {

        var key1 = new Array(22);
        for (var i = 0; i < 7; i++) {
          key1[i] = leftcolor;
        }
        for (var i = 7; i < 16; i++) {
          key1[i] = 0x00;
        }
        for (var i = 16; i < 22; i++) {
          key1[i] = rightcolor;
        }

        var key2 = new Array(22);
        for (var i = 0; i < 7; i++) {
          key2[i] = leftcolor;
        }
        for (var i = 7; i < 16; i++) {
          key2[i] = 0xff;
        }
        for (var i = 16; i < 22; i++) {
          key2[i] = rightcolor;
        }

        updating = true;
        setTimeout(function(){
        if(updating2 == false && updating3 == false){
          chromaSDK.createChromaLinkEffect("CHROMA_CUSTOM", [0xff, leftcolor, 8355711, 8355711, rightcolor]);
          chromaSDK.createKeyboardEffect("CHROMA_CUSTOM_KEY", [key2, key2, key2, key2, key2, key2]);
          chromaSDK.createMouseEffect("CHROMA_STATIC", rightcolor);
          chromaSDK.createMouseEffect("CHROMA_STATIC", 8355711);
          setTimeout(function(){
            if(updating2 == false && updating3 == false){
              chromaSDK.createChromaLinkEffect("CHROMA_CUSTOM", [00, leftcolor, 00, 00, rightcolor]);
              chromaSDK.createKeyboardEffect("CHROMA_CUSTOM_KEY", [key1, key1, key1, key1, key1, key1]);
              chromaSDK.createMouseEffect("CHROMA_STATIC", rightcolor);
              chromaSDK.createMouseEffect("CHROMA_STATIC", 00);
              setTimeout(function(){
                if(updating2 == false && updating3 == false){
                  chromaSDK.createChromaLinkEffect("CHROMA_CUSTOM", [0xff, leftcolor, 8355711, 8355711, rightcolor]);
                  chromaSDK.createKeyboardEffect("CHROMA_CUSTOM_KEY", [key2, key2, key2, key2, key2, key2]);
                  chromaSDK.createMouseEffect("CHROMA_STATIC", rightcolor);
                  chromaSDK.createMouseEffect("CHROMA_STATIC", 8355711);
                  setTimeout(function(){
                    if(updating2 == false && updating3 == false){
                      chromaSDK.createChromaLinkEffect("CHROMA_CUSTOM", [00, leftcolor, 00, 00, rightcolor]);
                      chromaSDK.createKeyboardEffect("CHROMA_CUSTOM_KEY", [key1, key1, key1, key1, key1, key1]);
                      chromaSDK.createMouseEffect("CHROMA_STATIC", rightcolor);
                      chromaSDK.createMouseEffect("CHROMA_STATIC", 00);
                      setTimeout(function(){
                        if(updating2 == false && updating3 == false){
                          chromaSDK.createChromaLinkEffect("CHROMA_CUSTOM", [0xff, leftcolor, 8355711, 8355711, rightcolor]);
                          chromaSDK.createKeyboardEffect("CHROMA_CUSTOM_KEY", [key2, key2, key2, key2, key2, key2]);
                          chromaSDK.createMouseEffect("CHROMA_STATIC", rightcolor);
                          chromaSDK.createMouseEffect("CHROMA_STATIC", 8355711);
                          setTimeout(function(){
                            if(updating2 == false && updating3 == false){
                              chromaSDK.createChromaLinkEffect("CHROMA_CUSTOM", [00, leftcolor, 00, 00, rightcolor]);
                              chromaSDK.createKeyboardEffect("CHROMA_CUSTOM_KEY", [key1, key1, key1, key1, key1, key1]);
                              chromaSDK.createMouseEffect("CHROMA_STATIC", rightcolor);
                              chromaSDK.createMouseEffect("CHROMA_STATIC", 00);
                              setTimeout(function(){
                                updating = false;
                              }, 200);
                            }
                          }, 200);
                        }
                      }, 200);
                    }
                  }, 200);
                }
              }, 200);
            }
          }, 200);
        }
      }, 16)
      }
    }, 16);
    }

}

      function playerwon(player){
        updating3 = true;
        setTimeout(function(){
          updating2 = false;

          if (player == 1) {
            var key1 = new Array(22);
            for (var i = 0; i < 7; i++) {
              key1[i] = 0x00;
            }
            for (var i = 7; i < 16; i++) {
              key1[i] = 0x00;
            }
            for (var i = 16; i < 22; i++) {
              key1[i] = 0x00;
            }

            var key2 = new Array(22);
            for (var i = 0; i < 7; i++) {
              key2[i] = leftcolor;
            }
            for (var i = 7; i < 16; i++) {
              key2[i] = leftcolor;
            }
            for (var i = 16; i < 22; i++) {
              key2[i] = leftcolor;
            }

            updating = true;
            if (updating2 == false){
              chromaSDK.createChromaLinkEffect("CHROMA_CUSTOM", [leftcolor, leftcolor, leftcolor, leftcolor, leftcolor]);
              chromaSDK.createKeyboardEffect("CHROMA_CUSTOM_KEY", [key2, key2, key2, key2, key2, key2]);
              chromaSDK.createMouseEffect("CHROMA_STATIC", leftcolor);
              setTimeout(function(){
                if (updating2 == false){
                  chromaSDK.createChromaLinkEffect("CHROMA_CUSTOM", [00, 00, 00, 00, 00]);
                  chromaSDK.createKeyboardEffect("CHROMA_CUSTOM_KEY", [key1, key1, key1, key1, key1, key1]);
                  chromaSDK.createMouseEffect("CHROMA_STATIC", 00);
                  setTimeout(function(){
                    if (updating2 == false){
                      chromaSDK.createChromaLinkEffect("CHROMA_CUSTOM", [leftcolor, leftcolor, leftcolor, leftcolor, leftcolor]);
                      chromaSDK.createKeyboardEffect("CHROMA_CUSTOM_KEY", [key2, key2, key2, key2, key2, key2]);
                      chromaSDK.createMouseEffect("CHROMA_STATIC", leftcolor);
                      setTimeout(function(){
                        if (updating2 == false){
                          chromaSDK.createChromaLinkEffect("CHROMA_CUSTOM", [00, 00, 00, 00, 00]);
                          chromaSDK.createKeyboardEffect("CHROMA_CUSTOM_KEY", [key1, key1, key1, key1, key1, key1]);
                          chromaSDK.createMouseEffect("CHROMA_STATIC", 00);
                          setTimeout(function(){
                            if (updating2 == false){
                              chromaSDK.createChromaLinkEffect("CHROMA_CUSTOM", [leftcolor, leftcolor, leftcolor, leftcolor, leftcolor]);
                              chromaSDK.createKeyboardEffect("CHROMA_CUSTOM_KEY", [key2, key2, key2, key2, key2, key2]);
                              chromaSDK.createMouseEffect("CHROMA_STATIC", leftcolor);
                              setTimeout(function(){
                                if (updating2 == false){
                                  chromaSDK.createChromaLinkEffect("CHROMA_CUSTOM", [00, 00, 00, 00, 00]);
                                  chromaSDK.createKeyboardEffect("CHROMA_CUSTOM_KEY", [key1, key1, key1, key1, key1, key1]);
                                  chromaSDK.createMouseEffect("CHROMA_STATIC", 00);
                                  setTimeout(function(){
                                    updating = false;
                                    updating3 = false;
                                    ingame = false;
                                    if (autohide == true) {
                                      chromaSDK.uninit();
                                    }
                                  }, 200);
                                  }
                                }, 200);
                              }
                            }, 200);
                          }
                        }, 200);
                      }
                    }, 200);
                  }
                }, 200);
              }
            } else if (player == 2) {

              var key1 = new Array(22);
              for (var i = 0; i < 7; i++) {
                key1[i] = 0x00;
              }
              for (var i = 7; i < 16; i++) {
                key1[i] = 0x00;
              }
              for (var i = 16; i < 22; i++) {
                key1[i] = 0x00;
              }
              var key2 = new Array(22);
              for (var i = 0; i < 7; i++) {
                key2[i] = rightcolor;
              }
                for (var i = 7; i < 16; i++) {
                  key2[i] = rightcolor;
                }
                for (var i = 16; i < 22; i++) {
                  key2[i] = rightcolor;
                }
                updating = true;
                if(updating2 == false){
                  chromaSDK.createChromaLinkEffect("CHROMA_CUSTOM", [rightcolor, rightcolor, rightcolor, rightcolor, rightcolor]);
                  chromaSDK.createKeyboardEffect("CHROMA_CUSTOM_KEY", [key2, key2, key2, key2, key2, key2]);
                  chromaSDK.createMouseEffect("CHROMA_STATIC", rightcolor);
                  setTimeout(function(){
                    if(updating2 == false){
                      chromaSDK.createChromaLinkEffect("CHROMA_CUSTOM", [00, 00, 00, 00, 00]);
                      chromaSDK.createKeyboardEffect("CHROMA_CUSTOM_KEY", [key1, key1, key1, key1, key1, key1]);
                      chromaSDK.createMouseEffect("CHROMA_STATIC", 00);
                      setTimeout(function(){
                        if(updating2 == false){
                          chromaSDK.createChromaLinkEffect("CHROMA_CUSTOM", [rightcolor, rightcolor, rightcolor, rightcolor, rightcolor]);
                          chromaSDK.createKeyboardEffect("CHROMA_CUSTOM_KEY", [key2, key2, key2, key2, key2, key2]);
                          chromaSDK.createMouseEffect("CHROMA_STATIC", rightcolor);
                          setTimeout(function(){
                            if(updating2 == false){
                              chromaSDK.createChromaLinkEffect("CHROMA_CUSTOM", [00, 00, 00, 00, 00]);
                              chromaSDK.createKeyboardEffect("CHROMA_CUSTOM_KEY", [key1, key1, key1, key1, key1, key1]);
                              chromaSDK.createMouseEffect("CHROMA_STATIC", 00);
                              setTimeout(function(){
                                if(updating2 == false){
                                  chromaSDK.createChromaLinkEffect("CHROMA_CUSTOM", [rightcolor, rightcolor, rightcolor, rightcolor, rightcolor]);
                                  chromaSDK.createKeyboardEffect("CHROMA_CUSTOM_KEY", [key2, key2, key2, key2, key2, key2]);
                                  chromaSDK.createMouseEffect("CHROMA_STATIC", rightcolor);
                                  setTimeout(function(){
                                    if(updating2 == false){
                                      chromaSDK.createChromaLinkEffect("CHROMA_CUSTOM", [00, 00, 00, 00, 00]);
                                      chromaSDK.createKeyboardEffect("CHROMA_CUSTOM_KEY", [key1, key1, key1, key1, key1, key1]);
                                      chromaSDK.createMouseEffect("CHROMA_STATIC", 00);
                                      setTimeout(function(){
                                        updating = false;
                                        updating3 = false;
                                        ingame = false;
                                      }, 200);
                                    }
                                  }, 200);
                                }
                              }, 200);
                            }
                          }, 200);
                        }
                      }, 200);
                    }
                  }, 200);
                }
              }else {

                var key1 = new Array(22);
                for (var i = 0; i < 7; i++) {
                  key1[i] = 0x00;
                }
                for (var i = 7; i < 16; i++) {
                  key1[i] = 0x00;
                }
                for (var i = 16; i < 22; i++) {
                  key1[i] = 0x00;
                }

                var key2 = new Array(22);
                for (var i = 0; i < 7; i++) {
                  key2[i] = 8355711;
                }
                for (var i = 7; i < 16; i++) {
                  key2[i] = 8355711;
                }
                for (var i = 16; i < 22; i++) {
                  key2[i] = 8355711;
                }

                updating = true;
                if(updating2 == false){
                  chromaSDK.createChromaLinkEffect("CHROMA_CUSTOM", [8355711, 8355711, 8355711, 8355711, 8355711]);
                  chromaSDK.createKeyboardEffect("CHROMA_CUSTOM_KEY", [key2, key2, key2, key2, key2, key2]);
                  chromaSDK.createMouseEffect("CHROMA_STATIC", 8355711);
                  setTimeout(function(){
                    if(updating2 == false){
                      chromaSDK.createChromaLinkEffect("CHROMA_CUSTOM", [00, 00, 00, 00, 00]);
                      chromaSDK.createKeyboardEffect("CHROMA_CUSTOM_KEY", [key1, key1, key1, key1, key1, key1]);
                      chromaSDK.createMouseEffect("CHROMA_STATIC", 00);
                      setTimeout(function(){
                        if(updating2 == false){
                          chromaSDK.createChromaLinkEffect("CHROMA_CUSTOM", [8355711, 8355711, 8355711, 8355711, 8355711]);
                          chromaSDK.createKeyboardEffect("CHROMA_CUSTOM_KEY", [key2, key2, key2, key2, key2, key2]);
                          chromaSDK.createMouseEffect("CHROMA_STATIC", 8355711);
                          setTimeout(function(){
                            if(updating2 == false){
                              chromaSDK.createChromaLinkEffect("CHROMA_CUSTOM", [00, 00, 00, 00, 00]);
                              chromaSDK.createKeyboardEffect("CHROMA_CUSTOM_KEY", [key1, key1, key1, key1, key1, key1]);
                              chromaSDK.createMouseEffect("CHROMA_STATIC", 00);
                              setTimeout(function(){
                                if(updating2 == false){
                                  chromaSDK.createChromaLinkEffect("CHROMA_CUSTOM", [8355711, 8355711, 8355711, 8355711, 8355711]);
                                  chromaSDK.createKeyboardEffect("CHROMA_CUSTOM_KEY", [key2, key2, key2, key2, key2, key2]);
                                  chromaSDK.createMouseEffect("CHROMA_STATIC", 8355711);
                                  setTimeout(function(){
                                    if(updating2 == false){
                                      chromaSDK.createChromaLinkEffect("CHROMA_CUSTOM", [00, 00, 00, 00, 00]);
                                      chromaSDK.createKeyboardEffect("CHROMA_CUSTOM_KEY", [key1, key1, key1, key1, key1, key1]);
                                      chromaSDK.createMouseEffect("CHROMA_STATIC", 00);
                                      setTimeout(function(){
                                        updating = false;
                                        updating3 = false;
                                        ingame = false;
                                      }, 200);
                                    }
                                  }, 200);
                                }
                              }, 200);
                            }
                          }, 200);
                        }
                      }, 200);
                    }
                  }, 200);
                }
              }
            }, 16);
            }












  var ws;
  var data;
  // Reconnection logic from: https://stackoverflow.com/a/23176223
  function connect() {
      ws = new WebSocket('ws://localhost:8080');
      ws.onopen = function () {
          // subscribe to some channels
          // ws.send(JSON.stringify({
          //.... some message the I must send when I connect ....
          // }));
          console.log("connected");
      };

      ws.onmessage = function (e) {
          console.log('Message:', e.data);
              console.log('Message:', e.data.payload);
          data = JSON.parse(e.data);
          if (data.event == "start" || data.start) {
            ingame = true;
            leftcolor = data.leftcolor[0] + data.leftcolor[1] * 256 + data.leftcolor[2] * 65536;
            rightcolor = data.rightcolor[0] + data.rightcolor[1] * 256 + data.rightcolor[2] * 65536;
            piioleftcolor = data.leftcolor;
            piiorightcolor = data.rightcolor;
            if (autohide == true) {
              chromaSDK.init();
            }
            if (data.event == "start") {
              for (var i = 0; i <= 10; i++) {
              changecolor(i);
              }
            }
          } else if (data.start === false) {
            ingame = false;
          }
          if (data.event == "end") {
            if (arraysEqual(data.player, piioleftcolor)) {
              playerwon(1);
            }else if (arraysEqual(data.player, piiorightcolor)) {
                playerwon(2);
              } else {
                playerwon(0);
              }
            }
          if (data.event == "died") {
            if (arraysEqual(data.player, piioleftcolor) || arraysEqual(data.opponent, piiorightcolor)) {
              playerdead(1);
            }else if (arraysEqual(data.player, piiorightcolor) || arraysEqual(data.opponent, piioleftcolor)) {
                playerdead(2);
              } else {
                playerdead(0);
              }

          }
      };

      ws.onclose = function (e) {
          console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
          setTimeout(function () {
              connect();
          }, 2000);
      };

      ws.onerror = function (err) {
          console.error('Socket encountered error: ', err.message, 'Closing socket');
          ws.close();
      };
  }

  connect();
  function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length != b.length) return false;

    // If you don't care about the order of the elements inside
    // the array, you should sort both arrays here.
    // Please note that calling sort on an array will modify that array.
    // you might want to clone your array first.

    for (var i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }
function checkbox(checked){
fs.writeFile( app.getPath('userData') + '\\saves\\razer.txt', checked.toString(), function(err, result) {
 if(err) console.log('error', err);
 razervalue = checked
 console.log('write file folder', err);
});
setTimeout(function(){
if ((checked == true && autohide == false) || (checked == true && ingame == true)) {

   chromaSDK.init();
   console.log("chroma started");
} else if (ingame == false || checked == false){
 chromaSDK.uninit();

}}, 10)
}


function autohider(checked){
fs.writeFile( app.getPath('userData') + '\\saves\\autohide.txt', checked.toString(), function(err, result) {
  if(err) console.log('error', err);
  });
  }
  function autohideing(checked){
  fs.writeFile( app.getPath('userData') + '\\saves\\autohideing.txt', checked.toString(), function(err, result) {
    if(err) console.log('error', err);
    autohide = checked;
    checkbox(razervalue);

      console.log('write file folder', err);
    });
    }



    function changecolor(i){
      var time = 20 * i;
        setTimeout(function() {
          var x = (i/10);
          var red1 = Math.round(x * (piioleftcolor[0] - middlecolor[0])) + middlecolor[0];
          var green1 = (Math.round(x * (piioleftcolor[1] - middlecolor[1])) + middlecolor[1]);
          var blue1 = (Math.round(x * (piioleftcolor[2] - middlecolor[2])) + middlecolor[2]);
          var red2 = Math.round(x * (piiorightcolor[0] - middlecolor[0])) + middlecolor[0];
          var green2 = (Math.round(x * (piiorightcolor[1] - middlecolor[1])) + middlecolor[1]);
          var blue2 = (Math.round(x * (piiorightcolor[2] - middlecolor[2])) + middlecolor[2]);
          rightcolor = red2 + green2 * 256 + blue2 * 65536;
          leftcolor = red1 + green1 * 256 + blue1 * 65536;
        }, time);
    }




     function folder(value){
       if (value.includes('.')) {
       value = value.substr(0, value.lastIndexOf("\\"));
       }
      foldervar = value;
      document.getElementById("folder").value = value;
     fs.writeFile( app.getPath('userData') + '\\saves\\folder.txt', value, function(err, result) {
     if(err) console.log('error', err);
     });
     }

    if (!fs.existsSync(app.getPath('userData') + '\\saves\\')){
        fs.mkdirSync(app.getPath('userData') + '\\saves\\');
        console.log("Directory erstellt");
    }
    function type(type){
      decision = type;
      fs.writeFile( app.getPath('userData') + '\\saves\\type.txt', type, function(err, result) {
        if(err) console.log('error', err);
        if (type == "Relay") {
          document.getElementById("WiiSpan").style.display = "block";
          document.getElementById("DolphinSpan").style.display = "none";


          document.getElementById("WiiIMG").style.borderColor = "rgba(153, 153, 153, 1)";
          document.getElementById("DolphinIMG").style.borderColor = "rgba(70, 212, 255, .25)";

        } else {
            document.getElementById("DolphinSpan").style.display = "block";
            document.getElementById("WiiSpan").style.display = "none";
                      document.getElementById("WiiIMG").style.borderColor = "rgba(153, 153, 153, .25)";
                      document.getElementById("DolphinIMG").style.borderColor = "rgba(70, 212, 255, 1)";
        }
      });
    }

    function relay(value){
      relay = value;
      fs.writeFile( app.getPath('userData') + '\\saves\\relay.txt', value, function(err, result) {
        if(err) console.log('error', err);
      });
    }


    fs.readFile( app.getPath('userData') + '\\saves\\relay.txt', 'utf8', function (err, data) {
      if(err) console.log('error', err);
      relay = parseInt(data);
      document.getElementById("relayPort").value = relay;
    });


    fs.readFile( app.getPath('userData') + '\\saves\\razer.txt', 'utf8', function (err, data) {
      if (data == "true") {
        document.getElementById("lol").checked = true;
        checkbox(true);
        razervalue = true
      } else {
        document.getElementById("lol").checked = false;
        checkbox(false);
        razervalue = false
      }
    });
    fs.readFile( app.getPath('userData') + '\\saves\\autohide.txt', 'utf8', function (err, data) {
      if(err) console.log('error', err);
      if (data == "true") {
        document.getElementById("autohide").checked = true;
      }
    });
    fs.readFile( app.getPath('userData') + '\\saves\\autohideing.txt', 'utf8', function (err, data) {
      if(err) console.log('error', err);
      if (data == "true") {
        document.getElementById("autohideing").checked = true;
        autohide = true;
      }
    });



    fs.readFile( app.getPath('userData') + '\\saves\\folder.txt', 'utf8', function (err, data) {
    foldervar = data;
    document.getElementById("folder").value = foldervar;
    });

    fs.readFile( app.getPath('userData') + '\\saves\\type.txt', 'utf8', function (err, data) {
      if (data == null) {
        decision = 'Folder';
          data = 'Folder';
        fs.writeFile( app.getPath('userData') + '\\saves\\type.txt', 'Folder', function(err, result) {
          if(err) console.log('error', err);
        });
      }
    type(data);

    fs.readFile( app.getPath('userData') + '\\saves\\auto.txt', 'utf8', function (err, data) {
      if (data == "true") {
        start();
        document.getElementById("auto").checked = true;
        if (true) {

        }
      } else {
        document.getElementById('startbutton').style.display = 'block';
          document.getElementById('stopbutton').style.display = 'none';
      }
    type(data);
    });
    });


function start(){
  var value = {
    decision: decision,
    relay: relay,
    folder: foldervar
  };
  ipc.send('start', [decision, relay, foldervar]);
    document.getElementById('startbutton').style.display = 'none';
      document.getElementById('stopbutton').style.display = 'block';
}
function stop(){

  ipc.send('stop', "value")
    document.getElementById('startbutton').style.display = 'block';
      document.getElementById('stopbutton').style.display = 'none';
}
