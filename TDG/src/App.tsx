import { useState, useEffect } from 'react'
import TDEngine from './sandbox/TDEngine'
import './App.css'
import demo from './assets/mock/demo.json'
function App() {
  useEffect(() => {
    const dom = document.getElementById('sandbox') as HTMLElement;
    const engine = new TDEngine({ dom })
    //@ts-ignore
    engine.load(demo)
    const startBtn = document.getElementById('startBtn')!;
    startBtn.onclick = engine.begin
    const coinsBox = document.querySelector('.coins-box')!;
    coinsBox.innerHTML = engine.coinsAccount.check().toString()
    engine.coinsAccount.onChange = (coins) => {
      coinsBox.innerHTML = coins
    }
  }, [])
  return (
    <div className="App">
      <div className="game-state">
        <div className="live-account"></div>
        <div className='coins-box'></div>
      </div>
      <div id="sandbox"></div>
      <div><button id='startBtn'>Start</button></div>
    </div>
  )
}

export default App
