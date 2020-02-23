import React , {useState} from 'react'
import './App.css'
import Metronome from "./components/Metronome"
import Form from "./components/Form"
import { getBips, play, pause, init } from "./LogicMetro"

function App() {

  //STATE
  const [partition, setPartition] = useState({
    nom:"dfsdf",
    segments:[
      {
        nbMesure:Infinity,
        base:4,
        tempo:60
      }
    ],
    activeMesure:0,
    activeSegment:0,  //index du segment
    playing:false,
    biping: false
  })
  //
  
  const [page, setPage] = useState("#home")
  // init(partition)
  init(partition)
//============================================

const bips = getBips; // point-virgule powaaa

(async function() {
  for await (let bip of bips()) {
  
    let newState = { ...partition,  playing: true, biping: true}
    setPartition(newState)
    newState = { ...newState, biping: false}
    setTimeout(() => {
      setPartition(newState)
    }, 70);
  } 
})()

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
