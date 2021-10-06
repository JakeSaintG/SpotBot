export interface IContestant {
    name: string,
    entries: number
}
export interface IFinalists {
    contestants: [
        contestant: IContestant,
        contestant: IContestant,
        contestant: IContestant
    ]
} 