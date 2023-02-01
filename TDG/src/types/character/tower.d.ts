import { Application, Sprite,DisplayObject, Assets, Graphics, LINE_CAP, LINE_JOIN } from 'pixi.js';

export interface Tower {
    name: string,
    type: "Archer"
    subTowers: [SubTower]
}


export interface SubTower {
    level:number
    coins: number
    ui: any,
    soldierAccout: 1,
    solderName: number,
    damage: number,
    attackType: "AD" | "AP",
    attackTime: number,
    attackRange: number,
    node?:Graphics
}
interface ArcherTower extends SubTower {
    soldierAccount: number,
    soldierName: string,
    damage: number,
    attackType: 'AP' | 'AD',
    interval: number,
    fightType: "FAR",
    attackRadius: number
}