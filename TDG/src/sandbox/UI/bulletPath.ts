import TowerLand from "./towerLand";
import VillainCharacter from "./vallain";
import { Graphics, LINE_CAP, LINE_JOIN } from "pixi.js";
import { getDirection, getDistance } from "../core/utils";
export default class BulletPath {
    tower: TowerLand
    villain: VillainCharacter
    bullet = bullet();
    flyAnimationId: number = -1
    constructor(tower: TowerLand, villain: VillainCharacter) {
        this.villain = villain;
        this.tower = tower;

    }
    fly = () => {
        const { tower: _tower, villain: _villain, bullet: _bullet } = this;
        let firstFrame = -1
        let lastFrame = -1;
        const t = 600;
        let flyId = -1
        const { centerX: tx, centerY: ty } = _tower;
        const { centerX: vx, centerY: vy } = _villain;
        _bullet.x = tx;
        _bullet.y = ty;
        let offset = 0;
        const distance = getDistance([tx, ty], [vx, vy]);
        let bs = distance / t * 1000;
        let bsy = 4 * 30 / (t / 1000)
        let g = 2 * bsy / (t / 1000)
        const update = (frame: number) => {
            if (firstFrame === -1) firstFrame = frame;
            const dt = lastFrame === -1 ? 0 : (frame - lastFrame) / 1000;
            lastFrame = frame;
            const elapsedTime = (frame - firstFrame);
            const leftTime = (t - elapsedTime) / 1000;
            if (leftTime < 0) {
                this.onHitTarget();
                this.clearBullet()
                return
            }
            const { centerX: tx, centerY: ty } = _tower;
            const { centerX: vx, centerY: vy } = _villain;
            const { x: bx, y: by } = _bullet;

            const vectorTV = getDirection([tx, ty], [vx, vy]);
            const distanceTV = getDistance([tx, ty], [vx, vy]);
            const distanceBV = getDistance([bx, by], [vx, vy]);
            offset += bs * dt;
            _bullet.x = tx + vectorTV[0] * offset;

            const dy = bsy * elapsedTime / 1000 - 0.5 * g * elapsedTime * elapsedTime / 1000000
            _bullet.y = ty + vectorTV[1] * offset//-dy//
            if (offset > distanceTV) {
                offset = distanceTV
            }
            bs = distanceBV / leftTime;
            this.flyAnimationId = window.requestAnimationFrame(update);
        }
        window.requestAnimationFrame(update);
    }
    clearBullet() {
        this.bullet.destroy()
        window.cancelAnimationFrame(this.flyAnimationId);
    }
    onHitTarget() {
        const { tower: _tower, villain: _villain, bullet: _bullet } = this;
        // const {centerX:tx,centerY:ty}=_tower;
        const { centerX: vx, centerY: vy } = _villain;
        // console.log(_tower, 'towerInfo')
        const { curTower } = _tower;
        const { attackType, damage } = curTower;
        _villain.onHit(damage, attackType)
        if (!_villain.isAlive) {
            this.clearBullet()
        }
    }
}
function bullet() {
    const circle = new Graphics();
    circle.beginFill(0x124B3D, 1);
    circle.drawCircle(0, 0, 4);
    circle.endFill();
    return circle
}

