import * as Discord from 'discord.js';

//Keywords for using raid commands
export const raidKeywords =  [
    'raid'
]

//The raid command is a work in progress.
export const raidCommands = (message: Discord.Message, COMMAND_NAME: string, arg: string[], client: Discord.Client) => {
    /*
    TODO: Allow the following commands
        ;;raid <openslots>
        ;;raid <openslots> <pokemon>
        ;;raid <openslots> <pokemon> <minutes left>
        ;;raid <openslots> <minutes left>
    */


//    let raiders: string = '';
//    for (let i = 0; i <= arg[0].length; i++) {
//        raiders += 'Raider: \n'
//    }

    
//     let raidMessage: string = 
// `
// ${message.author.username} wants to raid! They have ${arg[0]} open slots. Emote below to be added to the list!
// Open slots:
// ${raiders}
// `
//     message.channel.send(raidMessage);

    message.delete();
    let WIP = `The raid command is a work in progress. Please check in later for updates!`;
    message.channel.send(WIP);
}