import * as Discord from 'discord.js'
import { getRandomTipCommand } from './tipCommand'

//Keywords for using admin commands
export const adminKeywords: Array<String> = ['message', 'contest-winner']

export const helpKeywords: Array<String> = [
    'help',
    'tip',
    'tips',
    'command',
    'commands',
]

export const routeHelpCommands = (
    message: Discord.Message,
    COMMAND_NAME: string,
    messageContent: string,
    client: Discord.Client
) => {
    if (COMMAND_NAME === 'tip') {
        getRandomTipCommand(message)
    }
}
