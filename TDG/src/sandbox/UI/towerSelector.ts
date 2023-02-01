import { TextStyle, Sprite, Text, Container, Graphics, LINE_CAP, LINE_JOIN } from 'pixi.js';
import { Tower } from '../../types/character';
import { SubTower } from '../../types/character/tower';
import coinsAccount from '../core/coins'
type SelectorProps = { key:string,towerInfo:Tower[] }
const noop=(...args: any[]): any => {};
export default class TowerSelector {
    static items:TowerSelector[]=[]
    visibility: boolean = false
    key:string
    towerInfo!:Tower[]
    curTower?: any
    node!: Container
    onSelect=noop
    constructor(props: SelectorProps) {
        const { key,towerInfo } = props;
        this.key=key
        let instance;
        TowerSelector.items.forEach(selector=>{
            if(selector.key===key){
                selector.node.alpha=1;
                selector.showUI()
                instance=selector;
            }else{
                selector.node.alpha=0;
            }
        })
        if(!instance){
            const _node = new Container();   
            this.node = _node;
            this.towerInfo=towerInfo
            instance=this;
            TowerSelector.items.push(this)
            this.showUI()
        }
        return instance
    }
    showUI(){
        // this.drawCircle()
        this.drawOption()
    }
    drawCircle(){
        const _node=this.node;
        let circle = new Graphics();
        circle.lineStyle(4, 0xB7FF00);
        circle.interactive = true;
        circle.beginFill(0x000000, 0);
        circle.drawCircle(0, 0, 31);
        circle.endFill();
        circle.scale={x:1,y:0.3}
        circle.y=20
        _node.addChild(circle)
    }
    drawOption(){
        if(this.curTower){

        }else{
            const _towerInfo=this.towerInfo;
            let account=_towerInfo.length;
            const container=this.node;
            _towerInfo.forEach((info,index)=>{
                const division=(index+1)/(account+1)
                const {subTowers}=info;
                const  subTowerNode=renderNapGifNode(subTowers[0],division)
                const priceBtn=renderPriceBtn(subTowers[0],division)
                container.addChild(subTowerNode,priceBtn)
                subTowerNode.on('click',()=>{
                    this.curTower=subTowers[0];
                    coinsAccount.pay(this.curTower.coins)
                    this.onSelect(this.curTower);
                    container.removeChildren()
                })
            })
        }
    }

}

function renderNapGifNode(subTower:SubTower,division:number){
    const {node,coins}=subTower;
    const  subTowerNode=(node as Graphics).clone()
    const angle=Math.PI*division
    subTowerNode.scale={x:0.5,y:0.5}
    subTowerNode.x=-64*Math.cos(angle)-16
    subTowerNode.y=-64*Math.sin(angle)-16;
    subTowerNode.interactive=true
    return subTowerNode
}
function renderPriceBtn(subTower:SubTower,division:number){
    const {coins}=subTower;
    const style = new TextStyle({
        fontFamily: 'Arial',
        fontSize: 12,
        fontWeight: 'bold',
        stroke: '#4a1850',
        strokeThickness: 1,
        wordWrap: true,
        wordWrapWidth: 4,
        lineJoin: 'round',
    });
    const angle=Math.PI*division

    const price=new Text(coins,style)
    price.x=-64*Math.cos(angle)-10;
    price.y=-64*Math.sin(angle)+6
    return price
    
    
}