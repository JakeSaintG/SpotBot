import axios from 'axios';
import { IRaid, IRaidData } from '../interfaces/IEvents';
import { ICalendarItems, ICalendarResponse } from '../interfaces/web_responses/ICalendarResponse';

let testEvent = [
    {
        "id": "941132669310361640",
        "guild_id": "941116114346323999",
        "name": "WEEEEEEEEEE",
        "description": "MEGA NUTZ",
        "scheduled_start_time": "2022-02-10T02:00:00.990000+00:00",
        "scheduled_end_time": "2022-02-10T04:00:00.990000+00:00",
        "privacy_level": 2,
        "status": 1,
        "entity_type": 3,
        "entity_metadata": {
            "location": "Right fuckin here"
        }
    }
]

export const getRaidEvents = () => {
    axios({
        method: 'get',
        url: process.env.RAID_EVENTS_URL
        })
        .then((response) => {
            return assignRaidData(response.data);
        }).then( r => {
            // console.log(r);
            // craftMessage();
        });
}

const assignRaidData = (raidData: ICalendarResponse) => { 
    let raids: IRaidData = {
        details: "string",
        raidsList: [],
        credit: "Brought to you by the hard working folks at pokemoncalendar.com."
    }
    
    let raidCounter = 0;
    raidData.items.forEach((e: ICalendarItems) => {
        raidCounter++;
        let start: string = e.start.dateTime;
        let end: string = e.end.dateTime;
        let detailsFromHTML: string[] = (() => {
            let trimDownToListOnly: string[] = e.description.split('<ul>');
            trimDownToListOnly = trimDownToListOnly[1].split('</ul>');
            let listToArray: string[] = trimDownToListOnly[0].split('</li><li>')
            let finalDetailsList: string[] = [];
            listToArray.forEach(e => {
                e = e.replace('<li>', '');
                e = e.replace('</li>', '');
                e = e.replace('<br>', '');
                finalDetailsList.push(e);
            });
            return finalDetailsList;
        })(); //iife

        let raid: IRaid = {
            name: e.summary,
            details: detailsFromHTML,
            startTime: start,
            endTime: end
        };

        let oldRaid: Date = new Date;
        
        console.log(raid.endTime);
        console.log(oldRaid);

        raids.raidsList.push(raid);
    });
    return raids;
}
// axios({
//     method: 'get',
//     url: 'https://discord.com/api/guilds/941116114346323999/scheduled-events',
//     headers: {"Authorization": `Bot ${process.env.SPOTBOT_TOKEN}`}
//     })
//     .then((response) => {
//         console.log(response.data[0].creator.username)
//     });