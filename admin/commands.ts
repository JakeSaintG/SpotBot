import * as Discord from 'discord.js';
import { IFinalists } from '../interfaces/IContest';

export const adminKeywords =  [
    'message',
    'contest-winner'
]

export const adminCommands = (message: Discord.Message, COMMAND_NAME: string, arg: string[], client: Discord.Client) => {
    
    if (COMMAND_NAME === "message") {
        let str: string = message.toString();
        message.delete();  
        str = str.substring(str.indexOf(";;message") + 10); 
        message.channel.send(str);
        if (message.attachments.size > 0) {
            message.attachments.forEach(element => {
                message.channel.send(element);
            });
        }  
    }
    
    if(COMMAND_NAME === 'contest-winner'){
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
                    {name: "JakeSaintG", entries: 1},
                    {name: "Twistedship", entries: 1},
                    {name: "PrincessPizza22", entries: 1}
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
