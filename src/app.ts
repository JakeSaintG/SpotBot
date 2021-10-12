import * as Discord from 'discord.js';
import * as dotenv from 'dotenv';
import { commandHandler } from './hooks';
dotenv.config();

//Client extends BaseClient extends EventEmitter
const client = new Discord.Client();
//Messages will use ";;" to indicate a command
    //ex: ";;message" or "";;raid"
const COMMAND_PREFIX: string = ";;";

//bot picks up its own login event and logs it to the console.
client.on('ready', () => {
    console.log(`${client.user.username} has logged in.`)
});

//Most commands to SpotBot are done by using a message.
//This listens to all messages and sends it to the hooks if it is a command.
client.on('message', async (message) => {   
    if (!message.content.startsWith(COMMAND_PREFIX) || message.author.bot) return;
    if (message.content.startsWith(COMMAND_PREFIX)) {
        await commandHandler(COMMAND_PREFIX, client, message);
    }
})

client.login(process.env.SPOTBOT_TOKEN);