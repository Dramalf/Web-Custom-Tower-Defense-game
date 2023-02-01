import Clock from "./clock"

interface Callback {
    (...params: any): any
}
export default class Trigger {
    callbackMap: {
        [key: string]: Callback[]
    } = {}
    taskListLength = 0
    timer: Clock
    constructor(timer: Clock) {
        this.timer = timer;
    }
    onsec(timestamp: number, callback: Callback) {
        if (!Array.isArray(this.callbackMap[timestamp])) {
            this.callbackMap[timestamp] = []
        }
        this.callbackMap[timestamp].push(callback)
        this.taskListLength++
    }
    check = () => {
        let checkId = -1
        let beginTime=this.timer.getElapsedTime();
        return new Promise((resolve)=>{
            const checkTimeAndExcute = () => {
                const time = this.timer.getElapsedTime()-beginTime;
                Object.entries(this.callbackMap).map(([timestamp, callbacks]) => {
                    if (time > parseFloat(timestamp)) {
                        callbacks.forEach(callback => { callback() })
                        console.log(timestamp,'执行完毕')
                        delete this.callbackMap[timestamp]
                        this.taskListLength--;
                    }
    
                })
                if (!this.taskListLength) {
                    resolve(0)
                    console.log('finish check')
                    cancelAnimationFrame(checkId);
                    return
                }
                checkId = window.requestAnimationFrame(checkTimeAndExcute)
            }
            checkId=window.requestAnimationFrame(checkTimeAndExcute)
    
        })
   
    }
    stop() {

    }
}