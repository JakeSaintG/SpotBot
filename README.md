# SpotBot
## A Discord bot, written in _TypeScript_, for use on the PokeSpot server. 
##### The PokeSpot is a server that is centered around Pokemon GO and development of this bot will incorporate aspects of the game into its features.
[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)

## Dev Dependencies
- Node and NPM
- Nodemon

## To Run SpotBot
- Navigate to your terminal of choice (PowerShell, Git Bash, and Visual Studio were all tested)
- Enter the below line:
```sh
npm start
```

## Commands
- Commands are prefixed with two semicolons (;;) as shown in the examples below. SpotBot looks for this command prefix and executes the accompanying command.

## Example commands
- ;;hello
-- SpotBot will respond with a greeting!
- ;;message *message here*
-- Allows Discord Server Admins to post as SpotBot! SpotBot will repeat the message, attachments and all, and then delete the message with the command.
- ;;contest-winner
-- Spotbot will announce a random winner from a list of participants!
-- **This is a work in progress**
- ;;raid
-- SpotBot will help a server member organize a Pokemon Go raid!
-- **This is a work in progress**

## Special Thanks
- My fellow admins of the SpotBot for finding way to break me bot! No seriously. It's helpful!

## Known Issues
- The ;;hello command and args are a little clunky.

## Areas of Improvement
- The ;;message command should be able to post a message to a channel from the #private-admins channel for convenience.

## TODO
- ;;tip
    - should return a random game tip
    - should print "Tip No. 123: tip here"
    - planned: ;;add-tip
        - to add a tip to the random list/object/json
        - admin/mod only
    - ;;remove-tip *arg-number*
        - remove the specified tip
        - admin/mod only
- ;;player-info *arg-discord username*
    - should return PoGo name, team, player ID, alt (if included), alt ID (if included)
    - Should process the username but use the discord user-id to search for the stored player info to prevent mixup.
    - Helpful for coordinating raids, moderation, etc.
- ;;raid - see commands.ts under the "raid" folder for more details.
    - Allow the following commands
        - ;;raid <openslots>
        - ;;raid <openslots> <pokemon>
        - ;;raid <openslots> <pokemon> <minutes left>
        - ;;raid <openslots> <minutes left>
    - Should
        - allow user to specify number of available slots
        - allow user to specify Pokemon being raided 
        - message should be removed after 1hr (setTimeOut(){};)
        - added emoji's should populate slots up until raidSlots.length is reached.
        - a user removing their emoji should remove the removers name from the list
        - SpotBot should NOT Count its own emoji for any work being done
