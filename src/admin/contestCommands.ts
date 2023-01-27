import * as Discord from 'discord.js'
import { IFinalists } from '../interfaces/IContest'

/*
TODO: Have contestants be pulled from/added to a JSON.
TODO: Allow admins to have the following commands:
    ;;contest-finalist <username> <number of entries>
        -will add a contestant
        -prohibit a contestant from being added twice
    ;;contest-list
        -will list current contestants
    ;;contest-remove <username>
        -will remove a specific contestant
    ;;contest-remove-all
        -remove all contestants
*/
export const contestWinnerCommand = (
    message: Discord.Message,
    client: Discord.Client
) => {
    message.delete()

    try {
        const finalists: IFinalists = {
            contestants: [
                { name: '', entries: 0 },
                { name: '', entries: 0 },
                { name: '', entries: 0 },
            ],
        }

        let winner: string = declareWinner(finalists);

        message.guild.members
            .fetch(
                client.users.cache.find((user) => user.username == winner).id
            )
            .then((e) =>
                message.channel.send(`<@${e.user.id}> has won the contest!`)
            )
    } catch (error) {
        message.channel.send(
            `Hmm...Something isn't right. The contestants may not have been added correctly.`
        )
    }
}

const declareWinner = (finalists: IFinalists) => {
    let finalistEntries: string[] = []
    finalists.contestants.forEach((e) => {
        for (let i = 0; i < e.entries; i++) {
            finalistEntries.push(e.name)
        }
    })
    return finalistEntries[Math.floor(Math.random() * finalistEntries.length)]
}

//Setting up long over-due unit tests
export const testFn = (input: string) => {
    return `${input} was received`
}
