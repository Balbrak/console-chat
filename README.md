# console-chat
A simple chat in console, cross-plateform, working with node.js

---

# Setup
You will need node.js to be installed to run the server and the client.
## Server
run npm install, then node server.js
## Client
run npm install, then node client.js

# Use
When you start the client, you will first have to choose a free username.You will then enter the 'default' room.
Everyone in the same room can chat together. 

There are some commands you can use :

/name [new name] : change your name with a free new one

/me : work as on IRC (describe an action)

/join [room] : join another room if this room exist. You can only be in one room at a time

/new [room] : create a room if it doesn't already exist

/quit : alias of '/join default'

/list : get the list of existing rooms
