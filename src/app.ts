import * as Discord from 'discord.js';
import * as dotenv from 'dotenv';
dotenv.config();

//Client extends BaseClient extends EventEmitter
const client = new Discord.Client();

//bot picks up its own login event and logs it to the console.
client.on('ready', () => {
    console.log(`${client.user.username} has logged in.`)
});

client.on('message', (message) => {
    //console.log(`[${message.author.tag}]: ${message.content}`)
    if (message.content === "nerd") {
        console.log(`${message.author.username} has hurted mai feewings...`)
    }
})

client.login(process.env.SPOTBOT_TOKEN);