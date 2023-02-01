import Villain from "../../sandbox/Character/villain";

export interface AttackProps{
    target:Villain,
    option:{
        damage:number,
        type:'AP'|'AD'
    }
}