import * as Discord from 'discord.js';

const affrimFilter = (m: any) => m.content.toLowerCase().startsWith('yes') || m.content.toLowerCase().startsWith('no');
/*
    defaults

    Would you like to configure a {{channel}}? {{elaborate}}
        yes no
    
    Does a channel already exist that you would like to use as the {{channel}}?
        yes no

    Yes: Please tag the channel you would like to use with the #channel format

    No: Creating {{channel}} and saving...

*/

export const configureBotLogsChannel = () => {}

export const configurePkmnGoFeatures = async (configChannel: Discord.TextChannel): Promise<boolean> => {
    let goFeaturesEnabled = false;
    
    configChannel.send("SpotBot is a general-use Discord bot by default but has Pokémon GO-specific functionality.\r\nWould you like to configure it for use with Pokémon GO?")
    await configChannel.awaitMessages(affrimFilter, { max: 1, time: 300000, errors: ['time']})
        .then((collected) => {
            if (collected.first().content.toLocaleLowerCase() == 'yes') {
                configChannel.send("Sounds good! I will show Pokémon GO configurations as well.");
                goFeaturesEnabled = true;
            } else {
                configChannel.send("That's okay! Setting up for general use. You can change this later if you want.");
            }
        })
        .catch(() => {
            console.log("Go features onfiguration timed out...");
            configChannel.send(`Go features timed out...`);
        });
    
    return goFeaturesEnabled;
}

export const configureWelcomeChannel = async (configChannel: Discord.TextChannel): Promise<string> => {
    let existingChannel = false;

    configChannel.send(
        `Would you like to configure a welcome channel?
        SpotBot can send welcome messages to new server members using this channel.
        Respond "yes" or "no".`
    );

    // configChannel.awaitMessages(affrimFilter, { max: 1})
    // .then((collected) => {
    //     if (collected.first().content.toLowerCase() == 'yes') {
    //         configChannel.send("test");
    //     }
    //     configChannel.send(`Skipping welcome channel setup.`);
    //     return;
    // })
    // .catch(() => {
    //     configChannel.send(`Error in configuration. Stopping.`);
    // });

    configChannel.send(`Does a channel already exist that you would like to use as the welcome channel?`);

    /*
    channel.send (configured. 
        Would you like to set up the welcome message now? 
        If not, and you want to set it up after everything else, use "";;configure welcome-message" later to  )
    */

    return 'testsssssss'
}

export const configureWelcomeMessage = async (): Promise<string> => {
    // channel.send (configured. please use "";;configure welcome-message" to )

    return 'testsssssss'
}

export const configureLeaveMessage = async (): Promise<string> => {
    return 'testsssssss'
}


export const checkResponse = (): boolean => {
    
    return true;
}