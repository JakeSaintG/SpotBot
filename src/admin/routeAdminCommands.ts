import * as Discord from 'discord.js'
import { contestWinnerCommand } from './contestCommands'
import { messageCommand } from './messageCommand'

//Keywords for using admin commands
export const adminKeywords: Array<String> = ['message', 'contest-winner']

export const routeAdminCommands = (
    message: Discord.Message,
    COMMAND_NAME: string,
    messageContent: string,
    client: Discord.Client
) => {
    
    if (COMMAND_NAME === 'message') {
        messageCommand(message, messageContent)
    }

    if (COMMAND_NAME === 'contest-winner') {
        contestWinnerCommand(message, client)
    }
}