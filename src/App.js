import React , {useState, useEffect} from 'react'
import './App.css'
import Metronome from "./components/Metronome"
import Form from "./components/Form"
import Biper from "./Biper"
import { getBips, play, pause, init } from "./LogicMetro"

function App() {

  //STATE
  const [partition, setPartition] = useState({
    nom:"dfsdf",
    segments:[
      {
        nbMesure:5,
        base:4,
        tempo:160
      },{
        nbMesure:3,
        base:2,
        tempo:90
      }
    ],
    globalMesure:0,
    activeSegment:0,  //index du segment
    activeBeat:0,
    playing:false,
    biping: false
  })
  //
  
  const [page, setPage] = useState("#home")
  // init(partition)
  init(partition)
  
  //Gere l'oscillateur pour créer les sons
  const biper = new Biper()
//============================================

const bips = getBips(); // point-virgule powaaa
const asyncLoop = async () => {
  for await (let bip of bips) {
    let { activeBeat, activeMesure, globalMesure } = bip

    biper.play()
    if(bip.activeBeat === 1){
      biper.changeFrequency(1000) 
    }
    biper.stop(0.2)

    let newState = { ...partition,  playing: true, biping: true, activeBeat, activeMesure, globalMesure}
    setPartition(newState)
    newState = { ...newState, biping: false}
    setTimeout(() => {
      setPartition(newState)
    }, 70);
  } 
}
useEffect(()=>{
  asyncLoop()
})

const clickPlayHandler = async(e) => {
  play()
}

const clickPauseHandler = e => {
  pause(() => setPartition({...partition, playing: false}))
}
//============================================


const currentPage = () => {
  if(page === "#home"){
    return <Metronome 
      clickPlayHandler={clickPlayHandler} 
      clickPauseHandler={clickPauseHandler}
      biping={partition.biping} 
      playing={partition.playing} 
      activeBeat={partition.activeBeat}
      globalMesure={partition.globalMesure}
    />
  }else if (page === "#form"){
    return <Form />
  }
}

const navBTN = e => setPage("#form")
  return (
    <div className="App">
      {currentPage()}
      <button onClick ={ navBTN}>FORM</button>
    </div>

  )
}

export default App
