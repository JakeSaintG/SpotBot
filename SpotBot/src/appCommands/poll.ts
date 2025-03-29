import { Collection, Guild, Message, MessageReaction, TextChannel, User } from "discord.js";
import { LogService } from "../services/log_service";

export class Poll {
    
    private pollChannelId: string;
    private pollContent: string;
    private pollReactions: string[];
    private quit: boolean = false;
    private botMessagesToDelete: Message[] = [];
    private userMessagesToDelete: Collection<string, Message>[] = [];

    private logger: LogService;
    private guild: Guild;

    constructor(logger: LogService, guild: Guild) {
        this.logger = logger;
        this.guild = guild;
    }

    public startPoll = async (message: Message, messageContent: string) => {
        const channel: TextChannel = message.channel as TextChannel;
        
        if(!messageContent.includes('<#') && !messageContent.includes('>')) {
            this.pollChannelId = message.channel.id;
        } else {
            this.pollChannelId = messageContent.replace(/[^0-9]/g,''); 

            if (this.guild.channels.cache.find(c => c.id === this.pollChannelId) === undefined) {
                channel.send("Unable to find a channel that matches. Please try again.");
                return;
            }
        }

        await channel.send(
`On it! I'll use <#${this.pollChannelId}> for the poll.
Enter **'quit-poll'** to abandon this poll at any time.\r\n
**Here is an exmaple of what a SpotBot poll will look like:**`
            )
            .then((m: Message) => {
                this.botMessagesToDelete.push(m);
            });

        const demoPoll = `Pick a version!\r\n:blue_circle: = Blue\r\n:red_circle: = Red`;
        await channel.send(demoPoll)
            .then( async (m: Message) => {
                await m.react('🔵');
                await m.react('🔴'); 

                this.botMessagesToDelete.push(m);
            });

        await channel.send('⁠')
            .then((m: Message) => {
                this.botMessagesToDelete.push(m);
            });

        await this.getPollReactions(message);
        if (this.quit !== true) await this.getPollContent(message);
        if (this.quit !== true) await this.verifyPoll(message);
        if (this.quit !== true) await this.postPoll(message);
        if (this.quit === true) await this.quitPoll(message);
        this.cleanUpPoll(message);
    }

    private getPollReactions = async (message: Message) => {
        //TODO: 30 emoji max

        const channel: TextChannel = message.channel as TextChannel;
        
        const prompt: string = '**What emoji or reactions would you like to use as responses for your poll?**\r\n'+
        `Stick to common or server-specific emoji. If you have Discord Nitro, know that SpotBot will not have access to emoji from other servers.\r\n`+
        `Submit emoji ALL AT ONCE, separated by spaces. Your next message to this channel will be used.`        

        await channel.send(prompt)
            .then((m: Message) => {
                this.botMessagesToDelete.push(m);
            });

        const msgFilter = (m: Message) => m.author.id === message.author.id;

        await channel.awaitMessages({ filter: msgFilter, max: 1, time: 300000, errors: ['time']})
            .then(async (collected) => {
                this.userMessagesToDelete.push(collected);
                
                if (collected.first().content.includes('quit-poll')) {
                    this.quit = true;
                    return;
                };
                
                this.pollReactions = collected.first().content.split(' ');
                let failedReaction = false;

                await channel.send(`Testing submitted emoji by reacting to this message...`)
                    .then(async (m) => {
                        for await (const reaction of this.pollReactions) {
                            if (!failedReaction) {
                                await m.react(reaction).catch(() => {
                                    failedReaction = true
                                });
                            }
                        }

                        this.botMessagesToDelete.push(m);
                    })

                if (failedReaction) {
                    const errorMsgContent: string = `An error occurred... If you tried to use a Discord Nitro feature, `+
                    `remember that bots can't use emoji from servers we don't have access to.`;
                    
                    await channel.send(errorMsgContent)
                        .then((m: Message) => {
                            this.botMessagesToDelete.push(m);
                        });

                    this.quit = true;
                }
            })
            .catch(() => {
                console.log('Emoji collection error occurred.');
            })
            .finally(() => {

            });
    }

    private getPollContent = async (message: Message) => {
        const channel: TextChannel = message.channel as TextChannel;
        
        const pollContentPrompt = `⁠\r\n**What you would like the poll to say? Your next message will be used.**\r\n` +
        `**Don't forget the "reaction" = "reponse" explanation!\r\n**` +
        `Ex: \r\n🟡 = Pikachu`;
        
        await channel.send(pollContentPrompt)
            .then((m: Message) => {
                this.botMessagesToDelete.push(m);
            });

        const msgFilter = (m: Message) => m.author.id === message.author.id;
        await channel.awaitMessages( {filter: msgFilter, max: 1, time: 300000, errors: ['time']})
            .then(async (collected) => {
                this.userMessagesToDelete.push(collected);

                if (collected.first().content.includes('quit-poll')) {
                    this.quit = true;
                    return;
                };
                
                this.pollContent = collected.first().content;
            })
            .catch(() => {
                console.log('Poll content collection error error occurred.');
            })
            .finally(() => {

            });
    }

    private verifyPoll = async (message: Message) => {
        const channel: TextChannel = message.channel as TextChannel;
        
        await channel.send(`Generating poll preview...\r\n⁠`)
            .then((m: Message) => {
                this.botMessagesToDelete.push(m);
            })

        let failedReaction = false;
        await channel.send(this.pollContent)
            .then( async (m) => {
                for await (const reaction of this.pollReactions) {
                    if (!failedReaction) {
                        await m.react(reaction).catch(() => {
                            failedReaction = true
                        });
                    }
                }
                this.botMessagesToDelete.push(m);
            })

        await channel.send('⁠')
            .then((m: Message) => {
                this.botMessagesToDelete.push(m);
            });

        await channel.send('If eveything looks good, add an ✅ to confirm or an ❌ to reject.')
            .then( async (m) => {
                await m.react('✅');
                await m.react('❌');

                this.botMessagesToDelete.push(m);

                const filter = (reaction: MessageReaction, user: User) => user.id == message.author.id && (reaction.emoji.name == '✅' || reaction.emoji.name == '❌');

                await m.awaitReactions(
                    { filter, max: 1, time: 50000, errors: ['time'] }
                )
                    .then(async (collected) => { 
                        if (collected.first().emoji.name === '✅') {
                            await channel.send("Awesome! I'll get that posted right away.")
                                .then((msg: Message) => {
                                    this.botMessagesToDelete.push(msg);
                                });
                        } else {
                            await channel.send("Dang... Sorry about that. Please use `;;poll` and we will try again.")
                                .then((msg: Message) => {
                                    this.botMessagesToDelete.push(msg);
                                });
                            this.quit = true;
                        }
                    })
                    .catch( async (e: unknown) => {
                        await channel.send('Verification timeout...')
                            .then((m: Message) => {
                                this.botMessagesToDelete.push(m);
                            });
                        this.quit = true;
                    })
            })
    }

    private postPoll = async (message: Message) => {
        const channel: TextChannel = message.channel as TextChannel;
        
        await (this.guild.channels.cache.get(this.pollChannelId) as TextChannel)
            .send(this.pollContent)
            .then( async (m) => {
                for await (const reaction of this.pollReactions) {
                    await m.react(reaction)
                        .catch(async (m) => {
                            m.delete();
                            await channel.send('An expected error occured. I deleted the half-made poll. My apologies.');
                        });
                }
            });
    }

    private quitPoll = async (message: Message) => {
        const channel: TextChannel = message.channel as TextChannel;

        channel.send('Quitting poll...')
            .then((m: Message) => {
                this.botMessagesToDelete.push(m);
            });
    }

    private cleanUpPoll = async (message: Message) => {
        const channel: TextChannel = message.channel as TextChannel;
        
        await channel.send("I'll start cleaning up these poll creation messages. This can take a sec...")
            .then((m: Message) => {
                this.botMessagesToDelete.push(m);
            });

        this.botMessagesToDelete.forEach(msg => {
            msg.delete();
        })

        this.userMessagesToDelete.forEach(msg => {
            msg.forEach(m => m.delete());
        })

        if (!this.quit) {
            const logMessage = `Poll created by user: <@${message.author.id}>`;
            this.logger.logToLogsChannel(this.guild, logMessage);
        }
    }
}