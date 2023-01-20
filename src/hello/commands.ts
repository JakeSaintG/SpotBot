import * as Discord from 'discord.js';

//Keywords for using hello commands
export const helloKeywords =  [
    'hello',
    'hello!',
    'hey',
    'hi',
    'hallo',
    'hola',
    'say-hello'
]

//SpotBot's first command! A simple Hello.
export const userCommands = (message: Discord.Message, COMMAND_NAME: string, arg: string[]) => {
    if (arg.length === 0) {
        message.channel.send("Hello!")
    } else if (arg.length > 0) {
        let response: string = `Hello`;
        if (arg.toString().toLowerCase().includes("spotbot")) {
            let sender = message.author.username
            response += `, ${sender}`
        }  
        response += "!";
        message.channel.send(response);
    }    
}