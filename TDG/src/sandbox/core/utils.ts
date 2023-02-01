import { TowerLand, VillainCharacter } from "../UI";
import { Path, Point } from "../../types/config/map";
interface CallbackReturnPromise {
    (...params: any): Promise<any>
}

export class SerialPromise {
    promiseList: { task: CallbackReturnPromise, params: any[] }[] = []
    undo = 0;
    add(promise: CallbackReturnPromise, params: any[]) {
        this.promiseList.push({ task: promise, params });
        this.undo++;
    }
    async excute() {
        for (const promise of this.promiseList) {
            const { task, params } = promise;
            await task(...params)
        }
        return true
    }
}
export interface Callback {
    (...params: any): any
}
export function hitTestTowerAndVillain(tower: TowerLand, villain: VillainCharacter, callback: Callback) {
    if (!tower.curTower) return

    const { selector: selectedTower } = tower
    const { attackRange, attackTime, attackType, damage } = selectedTower?.curTower;
    let distance;
    let hitTestID = -1;
    const hitTest = () => {
        if (!villain.isAlive) {
            tower.curTarget=tower.curTarget.filter(target=>target.id!==villain.id)
            clearInterval(hitTestID)
        }
        distance = getDistance([tower.centerX, tower.centerY], [villain.centerX, villain.centerY])
        if (distance < attackRange + 16 && tower.curTarget.length <= tower.curTower.soldierAccout) {
            tower.curTarget.push(villain);
            callback(tower, villain)
        }else{
            //不在攻击范围内了，需要从当前锁定目标数组剔除
            tower.curTarget=tower.curTarget.filter(target=>target.id!==villain.id)
        }
    }
    hitTestID = setInterval(hitTest, attackTime)

}
export function getDistance(starting: Point, destination: Point) {
    return Math.sqrt(Math.pow(starting[0] - destination[0], 2) + (Math.pow(starting[1] - destination[1], 2)))
}
export function getDirection(starting: Point, destination: Point) {
    const distance = getDistance(starting, destination)
    return [(destination[0] - starting[0]) / distance, (destination[1] - starting[1]) / distance]
}