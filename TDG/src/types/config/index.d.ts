import { Tower, Villain, Soldier } from "../character"
import { PlotInfo } from "./plot"
import {MapInfo} from './map'
export interface GameConfig {
    author: string,
    towerInfo: Tower[],
    mapInfo: MapInfo,
    soldierInfo: Soldier[],
    villainInfo: Villain[],
    heroInfo: Hero[],
    plotInfo: PlotInfo
}
export interface EngineConfig {
    dom: HTMLElement,
    gameConfig?: GameConfig | null
}

