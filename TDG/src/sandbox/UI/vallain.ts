import { TextStyle, Sprite, Text, Container, Graphics, LINE_CAP, LINE_JOIN } from 'pixi.js';
import { SerialPromise } from '../core/utils';
import { Villain as IVillain } from "../../types/character";
import { Path, Point } from "../../types/config/map";
import { nanoid } from 'nanoid'
import { getDistance, getDirection } from '../core/utils'
import coinsAccount from '../core/coins'
export default class VillainCharacter {
    static allVillains: { [key: string]: VillainCharacter }={}
    id = nanoid(3)
    node: Container
    villainModel: Graphics
    instanceInfo: IVillain
    path?: Path
    centerX: number = 0
    centerY: number = 0
    speed: number = 0
    hp: number = 0
    damage: number = 0
    attackType: "AP" | "AD"
    isAlive: boolean = true
    constructor(villainInfo: IVillain) {
        this.instanceInfo = villainInfo;
        const container = new Container();
        this.node = container;
        container.x = 0;
        container.y = 0;
        const villainModel = villainInfo.node!.clone();
        villainModel.scale = { x: 0.5, y: 0.5 }
        this.villainModel = villainModel;
        container.addChild(villainModel);
        this.speed = villainInfo.speed;
        this.hp = villainInfo.max_hp;
        this.damage = villainInfo.damage;
        this.attackType = villainInfo.attackType
        VillainCharacter.allVillains[this.id]=this;
        console.log(this.id,'诞生')
    }

    followPath(path: Path) {
        this.path = path
    }
    move(offset: Point) {
        const _speed = this.speed;
        const _path = this.path!;
        if (!_path) return
        const pointsCouple = getPointsCouple(_path);
        const movingPromise = new SerialPromise();
        pointsCouple.forEach(([starting, destination]) => {
            // this.moveFromPoint2Point(starting,destination,_speed)
            movingPromise.add(this.moveFromPoint2Point, [starting, destination, _speed, offset])
        })
        movingPromise.excute().then(this.passDestination)
    }
    moveFromPoint2Point = (starting: Point, destination: Point, speed: number, offset: Point) => {
        // console.log('running from', starting, ' -to- ', destination)
        const character = this.node;
        const [startingX, startingY] = starting
        const distance = getDistance(starting, destination);
        const [dx, dy] = getDirection(starting, destination);
        const duration = distance / speed;
        const [offsetX, offsetY] = offset
        const originX = startingX - 16 + offsetX//*(0.5+0.5*dx)
        const originY = startingY - 16 + offsetY//*(0.5+0.5*dy)
        character.x = originX;
        character.y = originY;

        let animationId = -1;
        return new Promise((resolve) => {
            let process = 0
            let firstFrame = -1
            const run = (frame: number) => {
                if (firstFrame === -1) {
                    firstFrame = frame;
                }
                process = (frame - firstFrame) / 1000 / duration;
                if (process >= 1) {
                    window.cancelAnimationFrame(animationId)
                    resolve(1)
                    return
                }
                character.x = originX + process * dx * distance;
                character.y = originY + process * dy * distance;
                this.centerX = character.x + 16;
                this.centerY = character.y + 16;
                animationId = window.requestAnimationFrame(run)
            }
            window.requestAnimationFrame(run);
        })

    }

    passDestination = () => {
        this.node.destroy()
        console.log(this.id, '通过终点')
    }

    onHit(damage: number, damageType: "AP" | "AD") {
        if (this.hp <= 0 && this.isAlive) {
            this.die()
        } else {
            this.hp -= damage
        }
    }
    die() {
        console.log(this.id, 'die')
        coinsAccount.reward(this.instanceInfo.reward)
        this.isAlive = false
        this.node.destroy()
        delete VillainCharacter.allVillains[this.id]
    }
}


function getPointsCouple(path: Path) {
    const len = path.length;
    let res = []
    for (let i = 0; i < len - 1; i++) {
        res.push([path[i], path[i + 1]])
    }
    return res
}

