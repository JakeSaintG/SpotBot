import * as Discord from 'discord.js'
import { getLogChannelIdFromMessage } from '../services/logger'

export const messageCommand = (
    message: Discord.Message,
    messageContent: string
) => {
    const authorId = structuredClone(message.author.id)
    message.delete()

    if (messageContent.length != 0) message.channel.send(messageContent)

    if (message.attachments.size > 0)
        message.attachments.forEach((a) => message.channel.send(a))

    if (message.attachments.size == 0 && messageContent.length == 0) {
        getLogChannelIdFromMessage(message).send(
            `Hey, <@${authorId}>. The ;;message command requires either a message or an attachment.`
        )
    }
}