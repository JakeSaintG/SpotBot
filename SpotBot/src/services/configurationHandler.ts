const fs = require('fs');

export class ConfigurationHandler {
    public config = {};
    
    public constructor() {};

    public loadConfig = () => {

        fs.readFile('./config_dev.json', 'utf8', (error: any, data: string) => {
            if (error) {
                console.log(error)
                return
            }
            this.config = JSON.parse(data);
        })
    };

    checkForInitialConfig = () => {};
}

module.exports = {ConfigurationHandler};
// initial configuration
    // check if initial config has happened
    // If not, create spotbot-config text channel
        // admin only
        // start asking config questions
            // Is this server for Pokemon GO or General Use?
                // if go, ask go questions in addition to general
            //Do you have a "{{EXAMPLE_SERVER}}" channel? If yes, type "yes" and tag the channel. If no, type either "no" or "no generate" for Spotbot to create a default one.
                // Yes: save channel name and ID to config.json, updates "configured" to true
                // No: updates "configured" to false
                // No generate
            // Roles:
                // if go, ask go questions in addition to general
                // Check for team roles
                    // ex: check roles if contain "valor", save it in config
                    // "No team-specific roles were found. Would you like to create them?
                // create
//update channel details
    // ex: add maid rain channel, main announcements channel, etc.

    
//generate config file if not exist

//be able to migrate config.json
    // use the config-last-modified-dts in config.json to determine if a migration is needed

// be able to update configuration
    // What would you like to configure? Type: "channels", "roles"
        // channel: Which channel would you like to configure? (Show two lists. Already configured channels will be listed under "Update". Not yet configured channels will be under "Add") 
        