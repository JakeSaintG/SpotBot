import { CacheType, ChatInputCommandInteraction, Interaction, Message, TextChannel } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';

export const getData = () => {
    const builder = new SlashCommandBuilder();
    return builder
        .setName('reaction')
        .setDescription('Replies with current online status of SpotBot.')
        .addStringOption((option) =>
            option
                .setName('emoji')
                .setDescription('Emoji to react with, separated by spaces.')
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName('message-url')
                .setDescription('Message URL to react to.')
                .setRequired(true)
        )
        .addBooleanOption((option) =>
            option
                .setName('help')
                .setDescription('For help and tips with this command.')
        )
        .setDefaultMemberPermissions(0);
};

export default class ReactionCommand {
    protected interaction: Interaction;

    constructor(interaction: Interaction) {
        this.interaction = interaction;
    }

    public execute = async (): Promise<void> => {
        if (!this.interaction.isCommand()) return;

        // TODO: maybe don't have defaults? Help isn't easy to do...
        if (this.interaction.options.get('help') && this.interaction.options.get('help').value) {
            await this.interaction.reply(this.help());
            return;
        }

        const reactionData = this.interaction.options.get('emoji');

        //TODO: be a little safer with user input
        //TODO: validate emoji
        const reactions = reactionData.value.toString().split(' ');

        try {
            const [channelID, messageID] = this.getIdsFromUrl();
            const message: Message = await this.getMessageFromUrlIds(channelID, messageID)
            
            await this.interaction.reply({
                content: `Reacting with [${reactions}] to ${message.author.username}'s message.`,
                ephemeral: true,
            });

            reactions.forEach(reaction => 
                message.react(reaction.toString())
            );

        } catch (error) {
            let errorMessage = 'Hm...something went wrong.'
            
            if (error instanceof Error) errorMessage = error.message;
            
            await this.interaction.reply({
                content: errorMessage,
                ephemeral: true,
            });
        }
    };

    private getIdsFromUrl = (): string[] | undefined => {
        const interaction = this.interaction as ChatInputCommandInteraction<CacheType>;
        
        const reactionUrl: string = interaction.options
            .get('message-url')
            .value.toString();
        
        if (!reactionUrl.includes('discord.com/channels/')) {
            throw new Error('No valid message URL received.');
        }

        const ids: string[] = reactionUrl
            .split('discord.com/channels/')[1]
            .split('/');

        return [ids[1], ids[2]]
    }

    private getMessageFromUrlIds = async (channelID: string, messageID: string): Promise<Message> => {
        // TODO; This feels fragile...
        const channel = this.interaction.guild.channels.cache.find(
            (channel: TextChannel) => channel.id === channelID
        ) as TextChannel;

        return await channel.messages.fetch(messageID);
    }

    private help = (): string => {
        return `Certainly!\r\n` + `Work in progress\r\n\r\n` + `Hope this helps!`;
    };
}
