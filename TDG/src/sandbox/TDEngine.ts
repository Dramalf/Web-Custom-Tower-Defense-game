
import { EngineConfig, GameConfig } from "../types/config";
import { Application, Sprite, Assets, Graphics, LINE_CAP, LINE_JOIN } from 'pixi.js';
import '@pixi/gif';
import Core from "./core";
export default class TDEngine extends Core{
    private config: EngineConfig;

    constructor(config: EngineConfig) {
        super()
        this.config = config;
    
        const { dom } = config;
        dom.innerHTML='';
        const scene = new Application({ width: 400, height: 300, antialias: true, backgroundColor: 0xffffff });
        this.scene = scene;
        dom.appendChild(scene.view as unknown as Node)
        this.initCore()
    }
    public async load(config: GameConfig): Promise<any> {
        const _scene = this.scene
        this.gameConfig=config;
        const { mapInfo,towerInfo,soldierInfo,villainInfo } = config;
        await this.loadAssets(config)
        console.log('load finish')
        this.initUI()

    }

    public begin=(): void =>{
        this.excutePlot()
    }
    public pause(): void {

    }
    public check(): boolean {
        return true
    }
}