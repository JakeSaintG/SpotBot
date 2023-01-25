import * as Discord from 'discord.js';
import { IFinalists } from '../interfaces/IContest';

//Keywords for using admin commands
export const adminKeywords: Array<String> =  [
    'message',
    'contest-winner'
]

// In my time as a nascent dev, I made these giant and untestable functions
    // TODO: fix that
export const adminCommands = (message: Discord.Message, COMMAND_NAME: string, arg: string[], client: Discord.Client) => {
    
    if (COMMAND_NAME === "message") { //need to utilize the adminKeywords array
        let str: string = message.toString();
        message.delete();  
        str = str.substring(str.indexOf(`;;${COMMAND_NAME}`) + COMMAND_NAME.length + 3); 
        message.channel.send(str);
        if (message.attachments.size > 0) {
            message.attachments.forEach(element => {
                message.channel.send(element);
            });
        }  
    }
    
    if(COMMAND_NAME === 'contest-winner'){ //need to utilize the adminKeywords array
        message.delete();
        /*
        TODO: Have contestants be pulled from/added to a JSON.
        TODO: Allow admins to have the following commands:
            ;;contest-finalist <username> <number of entries>
                -will add a contestant
                -prohibit a contestant from being added twice
            ;;contest-list
                -will list current contestants
            ;;contest-remove <username>
                -will remove a specific contestant
            ;;contest-remove-all
                -remove all contestants
        */
        try {
            const finalists: IFinalists = {
                contestants: [
                    {name: "", entries: 0},
                    {name: "", entries: 0},
                    {name: "", entries: 0}
                ]  
            };
            var declareWinner = (finalists: IFinalists) => {
                let finalistEntries: string[] = []; 
                finalists.contestants.forEach(e => {
                    for (let i = 0; i < e.entries; i++) {
                        finalistEntries.push(e.name); 
                    } 
                });
                let winner: string = finalistEntries[Math.floor(Math.random()*finalistEntries.length)];
                return winner;
            };
            let winner: string = declareWinner(finalists);
            message.guild.members.fetch(client.users.cache.find(user => user.username == winner).id)
                .then(e => message.channel.send(`<@${e.user.id}> has won the contest!`));
        } catch (error) {
            message.channel.send(`Hmm...Something isn't right. The contestants may not have been added correctly.`)
        }
    }
}

//Setting up long over-due unit tests
export const testFn = (input: string) => {
    return `${input} was received`
};