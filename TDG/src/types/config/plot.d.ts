interface Plot{
    index:number,
    id:string,
    keyframes:IKeyFrame[]
}

interface IKeyFrame{
    timestamp:number,
    action:"START"|"SEND"|"END",
    path:number
    villain?:{
        name:string,
        account:number
    }
}

export type PlotInfo=Plot[]