import { MapInfo } from "../types/config/map";
import { Application, Sprite, Assets, Graphics, LINE_CAP, LINE_JOIN } from 'pixi.js';
import { Villain, Tower, Soldier } from "../types/character";
import Clock from "./core/clock";
import Trigger from "./core/trigger";
import coinsAccount from "./core/coins";
import { SerialPromise } from "./core/utils";
import {
    BulletPath,
    TowerSelector,
    TowerLand,
    RoadPath,
    VillainCharacter
} from './UI'
import { GameConfig } from "../types/config";
import { Plot } from "../types/config/plot";

interface loadAssetMap {
    mapInfo: any,
    towerInfo: any,
    soldierInfo: any,
    villainInfo: any
}


export default class Core {
    scene?: Application
    assets: any = {}
    liveVillains: VillainCharacter[] = []
    builtTowers: TowerLand[] = []
    gameConfig?: GameConfig
    clock: Clock
    coinsAccount=coinsAccount
    constructor() {
        this.clock = new Clock(false);
    }
    initCore(){
        TowerLand.stageRef=this.scene?.stage
    }
    async loadAssets(config: GameConfig): Promise<any> {
        const loadAssetMap: loadAssetMap = {
            'mapInfo': this.loadMap,
            'towerInfo': this.loadTower,
            'soldierInfo': this.loadSoldier,
            'villainInfo': this.loadVillain
        }
        const loadPromises: Promise<any>[] = []
        Object.entries(config).map(([key, value]) => {
            if (key in loadAssetMap) {
                loadPromises.push(loadAssetMap[key as keyof loadAssetMap](value))
            }
        })
        await Promise.all(loadPromises)

    }
    loadMap = (config: MapInfo) => {
        this.assets.mapInfo = config;
    }
    loadVillain = async (config: Villain[]): Promise<any> => {

        this.assets.villain = await Promise.all(config.map(async villain => {
            const { ui } = villain;
            const { url } = ui;
            const node = await Assets.load(url);
            return {
                ...villain, node
            }
        }))
        console.log('vallain===>', this.assets.villain)
        return true
    }
    loadTower = async (config: Tower[]): Promise<any> => {
        this.assets.tower = await Promise.all(config.map(async tower => {
            const { subTowers } = tower;
            let _subTowers = await Promise.all(subTowers.map(async subTower => {
                const { ui: { url } } = subTower;
                const node = await Assets.load(url);
                return {
                    ...subTower, node
                }
            }))
            return { ...tower, subTowers: _subTowers }

        }
        ))
    }
    loadSoldier = async (config: Soldier[]): Promise<any> => {
        this.assets.soldier = await Promise.all(config.map(async soldier => {
            const { ui } = soldier;
            if (!ui) {
                return soldier
            } else {
                return soldier
            }
        }))

    }
    loadHero = async (config: any): Promise<void> => {
        return new Promise((resolve, reject) => { })
    }
    async initUI() {
        const _scene = this.scene as Application;
        const { mapInfo } = this.assets;
        const { paths, towerPosition } = mapInfo as MapInfo;
        const bgurl='/bg.png'
        const bgpic=await Sprite.from(bgurl);
        console.log(bgpic)
        bgpic.width=400;
        bgpic.height=300
        _scene.stage.addChild(bgpic)
        paths.forEach(path => {
            const road = new RoadPath(path);
            _scene.stage.addChild(road.node)

        });
        towerPosition.forEach(([x, y]) => {
            const towerLand = new TowerLand({ x, y, towerInfo: this.assets.tower,stageRef:this.scene!.stage })

            _scene.stage.addChild(towerLand.node)
        })
    }
    async excutePlot() {
        this.clock.start();
        const { plotInfo } = this.gameConfig!;
        console.log(plotInfo);
        const plotPromise=new SerialPromise();
        plotInfo.forEach(plot=>{
            plotPromise.add(this.playMission,[plot])
        })
        plotPromise.excute()
        
    }
    playMission = async (mission: Plot) => {
        const _clock = this.clock
        const trigger = new Trigger(_clock);
        let endFrame=-1;
        mission.keyframes.forEach(keyframe => {
            const {timestamp,action}=keyframe;
            if(action==='END')endFrame=timestamp;
            trigger.onsec(timestamp, () => {
                const { timestamp, action, path: pathId, villain } = keyframe;
                if (action === 'START') return
                if (action === 'END') return
                const { name: villainName, account } = villain!
                const _path = this.assets.mapInfo.paths[pathId];
                const villainInfo = this.assets.villain.find((v: { name: string }) => v.name === villainName)
                const r=getRandomNumber(Math.PI)
                new Array(account).fill(1).forEach((_,index) => {
                    const villainCharacter = new VillainCharacter(villainInfo);
                    villainCharacter.followPath(_path) 
                    this.liveVillains.push(villainCharacter)
                    this.scene?.stage.addChild(villainCharacter.node);
                    TowerLand.attackTestNewVillain(villainCharacter)
                    const offsetX=24*Math.cos(Math.PI*2/account*index+r)
                    const offsetY=24*Math.sin(Math.PI*2/account*index+r)
                    villainCharacter.move([offsetX,offsetY])
                })

            })
        })
        await trigger.check()
        // await new Promise((resolve)=>{
        //     setTimeout(resolve, endFrame*1000);
        // })
        return 
    }
}
function getRandomNumber(max: number = 5, min: number = 0) {
    const positive = Math.random() > 0.5 ? 1 : -1;
    return positive * (Math.random() * (max-min) + min)
}