export interface Soldier{
    ui:any
    damage:number,
    APdefence:number,
    ADdefence:number,
    attackType:'AP'|'AD',
    interval:number,
    fightType:'REMOTE'|'MELLEE',
    attackRadius:number
}