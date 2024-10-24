import { Interaction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';

export const getData = () => {
    const builder = new SlashCommandBuilder();
    return builder
        .setName('reaction')
        .setDescription('Replies with current online status of SpotBot.')
        .addStringOption(option =>
			option
				.setName('emoji')
				.setDescription('Emoji to react with, separated by spaces.'))
        .addBooleanOption(option =>
            option
                .setName('help')
                .setDescription('For help and tips with this command.'))
        .setDefaultMemberPermissions(0)
        .setDMPermission(false);
};

export default class ReactionCommand {
    protected interaction: Interaction;

    constructor(interaction: Interaction) {
        this.interaction = interaction;
    }

    public execute = async (): Promise<void> => {
        if (!this.interaction.isCommand()) return;

        const reactionData = this.interaction.options.get('emoji');
        const reactions = reactionData.value;

        //TODO: validate emoji
        
        console.log('SpotBot is online!' + reactions);

        await this.interaction.reply({ content: `I will react with [${reactions}] on the next message you react to! \r\nKeep in mind that I only have access to basic emoji and custom ones from this server.\r\nThis will timeout in one minute.`, ephemeral: true });


        //
    };


    private help = (): string => {
        let helpMsg = `Certainly!\r\n` +
        `Work in progress\r\n\r\n` + 
        `Hope this helps!` 
        
        return helpMsg;
    }
}