import { Interaction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';

export const getData = () => {
    const builder = new SlashCommandBuilder();
    return builder
        .setName('ping')
        .setDescription('Replies with current online status of SpotBot.');
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
