var webServerPort = 8080;
var leapServerPort = 8081;

var playback = false;

console.log("Starting web server...");
var connect = require('connect');
connect.createServer(
    connect.static(__dirname)
).listen(webServerPort);

console.log("Starting Leap Motion server...");
var WebSocketServer = require('ws').Server, wss = new WebSocketServer({port: leapServerPort});
wss.on('connection', function(ws) {
    ws.on('message', function(message) {
        if (message === "STOPJSON") {
            playback = false;
        } else {
            fs = require('fs');
            // This needs to be sanitized
            fs.readFile('leap_output/' + message, 'utf8', function(err, data) {
                if (err) {
                    return console.log(err);
                }
                var dataPoints = data.split("|");
                playback = true;
                simulation = new DataSimulation(ws, dataPoints);
                simulation.sendData();
            });            
        }
    });
    
    var fs = require('fs');
    fs.readdir("leap_output", function(err, flist) {
        if (err) {
            console.log('Error reading directory /leap_output');
            console.log(err);
            return;
        }
        else {
            var filesList = "";
            for (var i = 0; i < flist.length; i++) {
              filesList += flist[i] + ((i < flist.length - 1) ? "|" : ""); 
            }
            
            ws.send(filesList);
        }
    });
});

console.log("Control page ready at http://localhost:"+webServerPort+"/");
console.log("Leap Motion WebSocket ready at ws://localhost:"+leapServerPort+"/");

var simulation = null;

function DataSimulation(socketParam, dataParam){
    this.count = 0;
    this.socket = socketParam;
    this.data = dataParam;
}

DataSimulation.prototype = {
    sendData : function(){
            if (playback) {
                this.socket.send(this.data[this.count]);
                if(this.count < this.data.length){
                    this.count++;
                    setTimeout(next, 30);
                }
                else{
                    this.socket.send("EOF");
                }                
            }
}
};

//I'm not happy that I need to assign a global variable just because of the timeout. Hopefully we can find a better way in the future.
function next(){
    simulation.sendData();
}
