# SpotBot!
A simple Discord bot for use in general servers with configurable tools for Pokemon GO related servers as well.
[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)

## Installation and Setup
As of right now, SpotBot requires the use of git and Node.js to install as there is no dedicated installer.
1. Clone down this repository
1. Use Node.js to install dependencies and build the project.
1. Connect SpotBot to your server by configuring a .env file.
1. Run the project.
1. SpotBot will then prompt server administrators to configure the bot to your server's needs.

## Commands
- Commands are prefixed with two semicolons (;;) as shown in the examples below. SpotBot looks for this command prefix and executes the accompanying command.

## Example commands
- ;;hello
    - SpotBot will respond with a greeting!
- ;;message *message here*
    - Allows Discord Server Admins to post as SpotBot! SpotBot will repeat the message, attachments and all, and then delete the message with the command.
- ;;contest-winner
    - Spotbot will announce a random winner from a list of participants!
    - **This is a work in progress**
- ;;raid
    - SpotBot will help a server member organize a Pokemon Go raid!
    - **This is a work in progress**

## Roadmap
### Documentation
How to use the bot would be a good thing to know! I plan to refresh my Angular skills by building out a docs site.

### Simplified Installation and Setup
The process for 

### Additional Tools
#### General
- Enhanced user management experience.

#### Pokemon GO
- Calendar-based event reminders
- ;;player-info *arg-discord username*
    - should return PoGo name, team, player ID, alt (if included), alt ID (if included)
    - Should process the username but use the discord user-id to search for the stored player info to prevent mixup.
    - Helpful for coordinating raids, moderation, etc.

### Logging
Right now the bot logs to the console and Discord but persistent, file-based logs would be beneficial for trouble shooting.
