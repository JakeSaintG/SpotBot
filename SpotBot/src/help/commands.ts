import * as Discord from 'discord.js';
import { ITip } from '../interfaces/ITip';

export const helpKeywords: Array<String> =  [
    'help',
    'tip',
    'tips',
    'command',
    'commands'
]

const tips: Array<ITip> = [ // TODO: Move to JSON
    {tipNumber: 1, tip: "Don't waste your 3x incubators, use them for 10km eggs. Use your infinite incubator for those short 2km eggs."},
    {tipNumber: 2, tip: "Turn off AR Mode."},
    {tipNumber: 3, tip: "Go here to look at type effectiveness! https://pbs.twimg.com/media/DxdF1GHXQAE1MXX?format=jpg&name=medium"},
    {tipNumber: 4, tip: "Don't claim your rewards all on the same day, just one a day."},
    {tipNumber: 5, tip: "Don't claim your research breakthrough unless you know what it currently is and you want it."},
    {tipNumber: 6, tip: "Don't forget to check for the glowing green light at the end of doing a route! That's your Zygarde cell."},
    {tipNumber: 7, tip: "Don't forget. Pokemon GO can be enjoyed entirely free-to-play. Don't feel pressured to give Niantic your money!"}
]

// In my time as a nascent dev, I made these giant and untestable functions
    // TODO: fix that
export const helpCommands = (message: Discord.Message, COMMAND_NAME: string, messageContent: string, client: Discord.Client) => { 
    if (COMMAND_NAME.startsWith('tip')) { //need to utilize the adminKeywords array
        // message.channel.send("received");

        var randomTip = tips[Math.floor(Math.random()*tips.length)];

        let str =  `Tip No: ${randomTip.tipNumber}: ${randomTip.tip}.`
        message.channel.send(str);       
    }
}