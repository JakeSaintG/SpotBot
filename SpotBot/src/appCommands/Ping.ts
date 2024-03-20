import { Interaction, SlashCommandBuilder } from 'discord.js';

export const getData = () => {
    const builder = new SlashCommandBuilder();
    builder
        .setName('ping')
        .setDescription('Replies with current online status of SpotBot.');

    return builder;
};

export default class PingCommand {
    protected interaction: Interaction;

    constructor(interaction: Interaction) {
        this.interaction = interaction;
    }

    public execute = async (): Promise<void> => {
        if (!this.interaction.isCommand()) return;

        await this.interaction.reply('SpotBot is online!');
    };
}
