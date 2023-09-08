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
            if (collected.first().content.toLocaleLowerCase().includes('yes')) {
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
    let exitWelcomeConfig = false;

    configChannel.send(
        `Would you like to configure a welcome channel?\r\n`+
        `SpotBot can send welcome messages to new server members using this channel.\r\n`+
        `Respond "yes" or "no".`
    );

    await configChannel.awaitMessages(affrimFilter, { max: 1, time: 300000, errors: ['time']})
        .then((collected) => {
            if (collected.first().content.toLowerCase().includes('no')) {
                configChannel.send(`Skipping welcome channel setup.`);
                exitWelcomeConfig = true;
            }
        })
        .catch(() => {
            configChannel.send(`Error in configuration. Stopping.`);
            exitWelcomeConfig = true;
        });

    if (!exitWelcomeConfig) {
        configChannel.send(
            `Does a channel already exist that you would like to use as the welcome channel?\r\n` +
            `Answer "no" to have one created for you.\r\n` +
            `To link an existing channel, answer "yes" and tag the channel after. Ex: "yes #member-welcome"`
        );
        
        await configChannel.awaitMessages(affrimFilter, { max: 1, time: 300000, errors: ['time']})
        .then((collected) => {
            if (collected.first().content.toLowerCase().includes('no')) {
                // Create one
                console.log(`Creating welcome channel...`);
            } else {
                const possibleWelcomeChannelId = collected.first().content.substring(
                    collected.first().content.indexOf("<"), 
                    collected.first().content.lastIndexOf(">") + 1
                )
                // Check that input is valid and that the channel exists before saving it.
                configChannel.send(`Success! Assigned ${possibleWelcomeChannelId} to welcome channel features.`);
            }
        })
        .catch(() => {
            configChannel.send(`Error in configuration. Stopping.`);
            exitWelcomeConfig = true;
        });

        return 'yes welcome';
    }

    /*
    channel.send (configured. 
        Would you like to set up the welcome message now? 
        If not, and you want to set it up after everything else, use "";;configure welcome-message" later to  )
    */
    
    console.log("Returning no");
    return 'no welcome';
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