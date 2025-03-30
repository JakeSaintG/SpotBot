import { TextChannel } from 'discord.js';

const affrimFilter = (m: any) => m.content.toLowerCase().startsWith('yes') || m.content.toLowerCase().startsWith('no');

export const configureBotLogsChannel = () => {}

export const configurePkmnGoFeatures = async (configChannel: TextChannel): Promise<boolean> => {
    let goFeaturesEnabled = false;
    
    configChannel.send("SpotBot is a general-use Discord bot by default but has Pokémon GO-specific functionality.\r\nWould you like to configure it for use with Pokémon GO?")
    await configChannel.awaitMessages({ filter: affrimFilter, max: 1, time: 300000, errors: ['time']})
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

export const configureWelcomeChannel = async (configChannel: TextChannel): Promise<string> => {
    let exitWelcomeConfig: boolean = false;
    let configurationMode: string;

    configChannel.send(
        `Would you like to configure a welcome channel?\r\n`+
        `SpotBot can send welcome messages to new server members using this channel.\r\n`+
        `Note, all welcome messages start with "Hey, @USER!" and then a custom or default message.\r\n`+
        `Respond "yes" or "no" to enable SpotBot welcoming.`
    );

    await configChannel.awaitMessages({ filter: affrimFilter, max: 1, time: 300000, errors: ['time']})
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
        
        await configChannel.awaitMessages({ filter: affrimFilter, max: 1, time: 300000, errors: ['time']})
        .then((collected) => {
            if (collected.first().content.toLowerCase().includes('no')) {
                // Create one
                configurationMode = "create";
            } else {
                const possibleWelcomeChannelId = collected.first().content.substring(
                    collected.first().content.indexOf("<"), 
                    collected.first().content.lastIndexOf(">") + 1
                )
                
                // TODO: Check that input is valid and that the channel exists before saving it, loop back and try again if not.
                configChannel.send(`Understood. Assigning ${possibleWelcomeChannelId} to welcome channel features.`);
                configurationMode = possibleWelcomeChannelId;
            }
        })
        .catch(() => {
            configChannel.send(`Error in configuration. Stopping.`);
            exitWelcomeConfig = true;
            configurationMode = 'none';
        });
    }

    return configurationMode;
}

export const checkResponse = (): boolean => {
    
    return true;
}