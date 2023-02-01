import { Graphics,LINE_CAP,LINE_JOIN ,Texture,GraphicsGeometry} from "pixi.js";
import { Path } from "../../types/config/map";

export default class RoadPath{
    node:Graphics
    constructor(path:Path){
        const texture = Texture.from('http://127.0.0.1:5173/src/assets/road.png');

        let line = new Graphics();
        line.lineTextureStyle({
            width:64,
            texture,
            cap: LINE_CAP.ROUND, join: LINE_JOIN.ROUND
        })
        path.reduce((pre, cur) => {
            // line.lineStyle({ width: 64, color: 0xFFEE00, alpha: 1, cap: LINE_CAP.ROUND, join: LINE_JOIN.ROUND });
            line.moveTo(pre[0], pre[1]);
            line.lineTo(cur[0], cur[1]);
           
            return cur
        })
        this.node=line;
    }
}