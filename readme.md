# socket.io is framework of websocket which is a communication protcol, duplex in nature.

# term socket means individual client and io refers to complete circuit(server)

# Commonly used functions are:- 
1 emit() -> sends event name along with its data.
2 on() -> receives data as per event name used.
3 broadcast() -> to send data to all except itself.
4 to() -> to send data to particular room.
5 join() -> to join a particular room.

# generally we emit from frontend, listen in backend with emit inside listener.