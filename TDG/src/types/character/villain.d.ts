import { Graphics} from 'pixi.js';

export interface Villain{
    ui:any,
    name:string,
    damage:number,
    attackType:"AP"|"AD",
    attackTime:number,
    attackRange:number,
    max_hp:number,
    speed:number,
    ADdefence:number,
    APdefence:number,
    reward:number,
    node?:Graphics
}