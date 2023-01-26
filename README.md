# SpotBot
## A Discord bot, written in _TypeScript_, for use on the PokeSpot server. 
##### The PokeSpot is a server that is centered around Pokemon GO and development of this bot will incorporate aspects of the game into its features. The hope is to create a general-use bot that can features in line with a Pokemon GO focused user base.
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
- My fellow admins of the SpotBot for finding ways to break me bot! No seriously. It's helpful!
- Tim Slaven for feature ideas, QA, and for reminding me to actually work on it.

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
- ;;configure *arg*
    - should allow an argument to configure certain things about the bot.
        - welcome: The welcome message for the server including user and channel tags
            - where the welcome message goes (currently hard coded)
            - should record ids and check against them any time a text channels/user id changes
        - leave-message: the user leaving message 
            - where the message goes (I'm fine with a static, unchangable leave message)
        - admin-role: the name of the admin role
            - should listen for changes to this name and ping the logs channel that @admin tags may not work anymore
            - could also find away to just always grab the highest level permission role and not let it be configured
