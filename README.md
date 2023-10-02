# Logo-Guessing-Game

This is multiplayer game that allows two users to player.
When the users started the game, both their screens show a logo for 5 seconds.
the player that guess it right first gets point. player to score more points wins.

The game make use of Node js to create the server.
Used websocket to develop the multijoining feature.

To run game:
    node server
    -then enter port number between 1024 - 4915 to listen to.
    Commands for the game
        -LIST: list the connections on the server
        -KILL: to kill a connection of a user
        -QUIT: to disconnect both users in the game
