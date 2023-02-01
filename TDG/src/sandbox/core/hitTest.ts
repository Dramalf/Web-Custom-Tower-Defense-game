import {getDistance,getDirection,Callback} from './utils'
import { TowerLand, VillainCharacter } from "../UI";
class HitTest{
    testMap:{[key:string]:number}={}
    hitTestTowerAndVillain(tower: TowerLand, villain: VillainCharacter, callback: Callback) {
        if (!tower.curTower) return
        
        const { selector: selectedTower,id:tid } = tower
        const {id:vid}=villain
        if(this.testMap[tid+':'+vid]){
            clearInterval(this.testMap[tid+':'+vid])
        }
        const { attackRange, attackTime, attackType, damage } = selectedTower?.curTower;
        let distance;
        let hitTestID = -1;
        const hitTest = () => {
            if (!villain.isAlive) {
                tower.curTarget=tower.curTarget.filter(target=>target.id!==villain.id)
                clearInterval(hitTestID)
                delete this.testMap[tid+':'+vid]
            }
            distance = getDistance([tower.centerX, tower.centerY], [villain.centerX, villain.centerY])
            if (distance < attackRange + 16 && tower.curTarget.length <= tower.curTower.soldierAccout) {
                tower.curTarget.push(villain);
                callback(tower, villain)
            }else{
                //不在攻击范围内了，需要从当前锁定目标数组剔除
                tower.curTarget=tower.curTarget.filter(target=>target.id!==villain.id);

            }
        }
        hitTestID = setInterval(hitTest, attackTime)
        this.testMap[tid+':'+vid]=hitTestID;
    }
}


const HitTestCore=new HitTest();
export default HitTestCore

