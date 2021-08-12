import * as Discord from 'discord.js';
import { token } from './token';

const client = new Discord.Client();

client.once('ready', () => {
    console.log('SpotBot is online!')
});

//Has to be at last line of file
client.login(token);