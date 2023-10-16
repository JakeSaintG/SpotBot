import * as Discord from 'discord.js'
import { LogService } from '../services/logger'


export const messageCommand = (
    message: Discord.Message,
    messageContent: string,
     logger: LogService
) => {
    const authorId = structuredClone(message.author.id)
    message.delete()
    
    // TODO: There is an issue with sending an "empty" message with an attachment
    if (messageContent.length != 0) message.channel.send(messageContent)

    if (message.attachments.size > 0) {
        message.attachments.forEach((a) => message.channel.send(a));
        return;
    }

    if (message.attachments.size == 0 && messageContent.length == 0) {
        logger.getLogChannelIdFromMessage(message).send(
            `Hey, <@${authorId}>. The ;;message command requires either a message or an attachment.`
        )
    }
}