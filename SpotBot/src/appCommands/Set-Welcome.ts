import { Interaction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { WelcomeService } from '../services/welcome/welcome.service';

export const getData = () => {
    const builder = new SlashCommandBuilder();
    builder
        .setName('set_welcome')
        .setDescription('Allows user to set server-specific welcome messages.')
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
    private welcomeService: WelcomeService;

    constructor(interaction: Interaction, welcomeService: WelcomeService) {
        this.interaction = interaction;
        this.welcomeService = welcomeService;
    }

    public execute = async (): Promise<void> => {
        
        if (!this.interaction.isCommand()) return;

        const simpleMessage = this.interaction.options.get('message');

        if (this.interaction.options.get('help') && this.interaction.options.get('help').value) {
            await this.interaction.reply( this.help() );
            return;
        }

        if (simpleMessage ) {
            await this.welcomeService.setWelcomeMessageV2(this.interaction.channel, this.interaction.user, true);
        }

        await this.interaction.reply(
            `Welcome message set!`
        );
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
        `  - SpotBot will only wait 5min for a response so it may be good to write it out ahead of time!\r\n\r\n` +  
        `Hope this helps!` 
        
        return helpMsg;
    }
}