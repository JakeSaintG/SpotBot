import {Message} from 'discord.js'
import { LogService } from '../log.service'
import { autoInjectable } from 'tsyringe'

@autoInjectable()
export class PingService {
    logger: LogService;

    pingKeywords =  [
        'hello',
        'hello!',
        'hey',
        'hi',
        'hola',
        'say-hello',
        'ping'
    ]

    constructor(logService: LogService) {
        this.logger = logService;
    }

    public handlePing = (command: string, message: Message, messageContent: string) => {
        if (command == 'ping') {
            this.ping(message);
        } else {
            this.hello(message, messageContent);
        }
    }

    private ping = (message: Message) => {
        console.log("SpotBot was pinged.");
        message.channel.send("Ping to SpotBot received. SpotBot is online.");
    }

    private hello = ( message: Message, messageContent: string ) => {
        let response: string = `Hello`;

        if (messageContent.toString().toLowerCase().includes("spotbot")) {
            let sender = message.author.username
            response += `, ${sender}`
        }  

        response += "!";
        message.channel.send(response);
    }
}