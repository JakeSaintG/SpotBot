import * as Discord from 'discord.js';

export const helloKeywords =  [
    'hello',
    'hello!',
    'hey',
    'hi',
    'hallo',
    'hola',
    'say-hello'
]

export const adminKeywords =  [
    'message'
]

export const adminCommands = (message: Discord.Message, COMMAND_NAME: string, arg: string[]) => {
    
    if (COMMAND_NAME === "message") {
        let str: string = message.toString(); 
        str = str.substring(str.indexOf(";;message") + 10); 
        message.channel.send(str);

        if (message.attachments.size > 0) {
            message.attachments.forEach(element => {
                message.channel.send(element);
            });
        }
        message.delete(); 
    }
    
    if (helloKeywords.includes(COMMAND_NAME)) {
        if (arg.length === 0) {
            message.channel.send("Hello!")
        } else if (arg.length > 0) {
            let response: string = `Hello, ${arg[0]}`;
            for (let i = 1; i < arg.length; i++) { 
                if (i === arg.length-1) {
                    response += `, and ${arg[i]}`;
                } else if (arg.length > 1) {
                    response += `, ${arg[i]}`;
                } 
            }                                                    
            response += "!";
            message.channel.send(response);
        }  
    }

}