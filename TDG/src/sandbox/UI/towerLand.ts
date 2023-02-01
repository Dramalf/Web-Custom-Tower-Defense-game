import { Application, Sprite, Container, Assets, Graphics, LINE_CAP, LINE_JOIN } from 'pixi.js';
import { Tower, subTower } from '../../types/character';
import TowerSelector from './towerSelector';
import { hitTestTowerAndVillain } from '../core/utils'
import VillainCharacter from './vallain';
import BulletPath from './bulletPath';
import HitTestCore from '../core/hitTest';
import {nanoid} from 'nanoid'
type TowerLandProps = { x: number, y: number, towerInfo: Tower[],stageRef:Container }
interface Callback {
  (...params: any): any
}
export default class TowerLand {
  static instanceList: TowerLand[] = []
  static stageRef?:Container
  id=nanoid(3)
  node: Container
  curTower?: subTower
  emptyLand!: Graphics
  towerInfo!: Tower[]
  key: string
  selector?: TowerSelector
  centerX:number
  centerY:number
  curTarget:VillainCharacter[]=[]
  static attackTestNewVillain(villain: VillainCharacter) {
    TowerLand.instanceList.forEach(tower => {
      HitTestCore.hitTestTowerAndVillain(tower, villain,(t,v)=>{
        const bulletPath= new BulletPath(t,v)
        TowerLand.stageRef!.addChild(bulletPath.bullet);
        bulletPath.fly();
      })
    })

  }
  constructor(props: TowerLandProps) {
    const { x, y, towerInfo } = props;
    const key = x + ':' + y
    this.key = key;
    this.towerInfo = towerInfo;
    const container = new Container();
    this.node = container;
    container.x = x;
    container.y = y;
    this.centerY=y;
    this.centerX=x;
    container.interactive = true
    this.initEmptyLand()
    TowerLand.instanceList.push(this)
  }
  initEmptyLand = async () => {
    const container = this.node;
    const key = this.key;
    const towerInfo = this.towerInfo;
    const emptyLand = await Sprite.from("http://127.0.0.1:5173/src/assets/emptyLand.png")
    emptyLand.anchor.x=0.5;
    emptyLand.anchor.y=0.5;
    container.on('click', async () => {
      const selector = new TowerSelector({ key, towerInfo });
      this.selector = selector;
      selector.onSelect = (data: subTower) => {
        const selectTower = data.node.clone();
        selectTower.scale={x:0.9,y:0.9}
        selectTower.y=-6
        this.curTower = { ...data, node: selectTower };
        // selectTower.x = -32;
        // selectTower.y = -32
        selectTower.anchor.set(0.5);
        container.removeChild( this.selector!.node);
        container.addChild(selectTower);
        this.attackTestLivedVillain()
      }
      container.addChild(selector.node)


    })
    container.addChild(emptyLand)
  }
  attackTestLivedVillain=()=>{
    Object.entries(VillainCharacter.allVillains).forEach(([key,villain])=>{
      HitTestCore.hitTestTowerAndVillain(this, villain,(t,v)=>{
        const bulletPath= new BulletPath(t,v)
        TowerLand.stageRef!.addChild(bulletPath.bullet);
        bulletPath.fly();
      })
    })
  }
}