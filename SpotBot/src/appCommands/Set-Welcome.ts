import { Interaction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { ICommandServices } from '../interfaces/ICommandServices';

export const getData = () => {
    const builder = new SlashCommandBuilder();
    builder
        .setName('set_welcome')
        .setDescription('Allows an admin to set server-specific welcome messages.')
        .addBooleanOption(option =>
            option
                .setName('help')
                .setDescription('For help and tips with this command.'))
		.addStringOption(option =>
			option
				.setName('message')
				.setDescription('OPTIONAL! For simple simple message.'))
        .setDefaultMemberPermissions(0)
        .setDMPermission(false);

    return builder;
};

export default class SetWelcomeCommand {
    protected interaction: Interaction;
    private services: ICommandServices;

    constructor(interaction: Interaction, services: ICommandServices) {
        this.interaction = interaction;
        this.services = services;
    }

    public execute = async (): Promise<void> => {
        
        if (!this.interaction.isCommand()) return;

        let response = 'Setting...';

        const simpleMessage = this.interaction.options.get('message');

        if (this.interaction.options.get('help') && this.interaction.options.get('help').value) {
            await this.interaction.reply( this.help() );
            return;
        }

        if (this.interaction.options.get('message') === null) {
            response = `Please supply the message you would like to use when welcoming new members.\r\n`+
            `The next message entered by the command issuer will be saved as the welcome message.`;
        }

        await this.interaction.reply(
            response
        );
        
        let setResponse = await this.services.welcomeService.setWelcomeMessage(this.interaction.channel, this.interaction.user, simpleMessage);

        await this.interaction.channel.send(setResponse);
    };


    private help = (): string => {
        let helpMsg = `Certainly!\r\n` +
        `The \`set_welcome\` command allows admins to set the welcome message that SpotBot uses when when a new member joins the server.\r\n` +
        `Besides \`help\`, the command has an OPTIONAL \`message\` option.\r\n` +
        `- If text is supplied via this option, that text will be used for the welcome message.\r\n` +
        `  - Note! The slash command options don't allow for emoji, line breaks, channel links, etc.\r\n` +
        `  - Only use this option if you want a really simple welcome message.\r\n` + 
        `- To get a little :sparkles:fancier:sparkles: with your welcome message, leave the \`message\` option **BLANK**.\r\n` + 
        `  - SpotBot will then prompt you to supply a welcome message and your next message to the channel will be used.\r\n` + 
        `  - SpotBot will only wait 5min for a response so it may be good to write it out ahead of time!\r\n` + 
        `- Important notes!\r\n` +
        `   - SpotBot can only send messages that are less than 2000 characters.\r\n` +
        `   - If you use server-specific emoji, make sure to update the welcome message.\r\n` +
        `   - If you have Discord Nitro, make sure to use emoji that SpotBot has access too like general ones and server-specific ones.\r\n\r\n` + 
        `Hope this helps!` 
        
        return helpMsg;
    }
}