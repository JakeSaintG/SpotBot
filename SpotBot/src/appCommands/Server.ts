import { Interaction, SlashCommandBuilder } from 'discord.js';

export const getData = () => {
    const builder = new SlashCommandBuilder();
    builder
        .setName('server')
        .setDescription('Provides information about the server.');

    return builder;
};

export default class ServerCommand {
    protected interaction: Interaction;

    constructor(interaction: Interaction) {
        this.interaction = interaction;
    }

    public execute = async (): Promise<void> => {
        if (!this.interaction.isCommand()) return;

        await this.interaction.reply(
            `This server is ${this.interaction.guild.name} and has ${this.interaction.guild.memberCount} members.`
        );
    };
}
