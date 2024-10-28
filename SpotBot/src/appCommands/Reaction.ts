import { Guild, GuildMember, Interaction, Message, TextChannel, User } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';

export const getData = () => {
    const builder = new SlashCommandBuilder();
    return builder
        .setName('reaction')
        .setDescription('Replies with current online status of SpotBot.')
        .addStringOption(option =>
			option
				.setName('emoji')
				.setDescription('Emoji to react with, separated by spaces.')
            .setRequired(true))
        .addStringOption(option =>
            option
                .setName('message-url')
                .setDescription('Message URL to react to.')
                .setRequired(true))
        .addBooleanOption(option =>
            option
                .setName('help')
                .setDescription('For help and tips with this command.'))
        .setDefaultMemberPermissions(0);
};

export default class ReactionCommand {
    protected interaction: Interaction;

    constructor(interaction: Interaction) {
        this.interaction = interaction;
    }

    public execute = async (): Promise<void> => {
        if (!this.interaction.isCommand()) return;

        const reactionData = this.interaction.options.get('emoji');
        const reactionUrl: string = this.interaction.options.get('message-url').value.toString();
        const reactions = reactionData.value;

        //TODO: validate emoji

        if (!reactionUrl.includes('https://discord.com/channels/')) {
            this.interaction.reply({ 
                content: `No valid message URL received`, 
                ephemeral: true
            });

            return;
        }

        const ids: string[] = reactionUrl.split('https://discord.com/channels/')[1].split('/');
        const channelID = ids[1];
        const messageID = ids[2];

        // TODO; This feels fragile...
        const channel = this.interaction.guild.channels.cache.find((channel: TextChannel) => channel.id === channelID) as TextChannel;

        const message = await channel.messages.fetch(messageID);
        
        // TODO: loop and react to each in array
        message.react(reactions.toString());

        await this.interaction.reply({ 
            content: `I will react with [${reactions}]`, 
            ephemeral: true
        });



        // this.interaction.user.accentColor

        //
    };


    private help = (): string => {
        let helpMsg = `Certainly!\r\n` +
        `Work in progress\r\n\r\n` + 
        `Hope this helps!` 
        
        return helpMsg;
    }
}