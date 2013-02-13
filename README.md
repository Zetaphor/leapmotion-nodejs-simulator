leapmotion-nodejs-simulator
===========================

A NodeJS simulator for playing back recorded JSON data from a Leap Motion device. The goal of this project is to create a simulation of the devices Websocket for developing Javascript applications without requiring the hardware.

Instructions:
---------------
* Launch the node script: `node nodeServer.js`
* Connect to the web server
* Write a Javascript application that connects to the WebSocket address
* Click a file name on the page hosted at the web server address

JSON Files for playback can be found here:
https://github.com/syntagmatic/leap-play

Requires the following node packages:
* ws
* connect

This software is licensed under the GPLv3 license.
