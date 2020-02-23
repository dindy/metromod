import Biper from "./Biper"

const biper = new Biper()

let state = {
    nom: "dfsdf",
    segments: [{
        nbMesure: 2,
        base: 4,
        tempo: 120
    },{
        nbMesure: 2,
        base: 3,
        tempo: 60
    }],
    activeMesure: 1,
    indexActiveSegment: 0,  //index du segment
    activeBeat: 1,
    playing: false,
    finished: false,
  }

export const init = (state) => {
    state = {...state}
}

// Gere la localisation dans la partition
const updateStatePosition = (state) => {
    console.log(state);
    
    let  indexActiveSegment = state.indexActiveSegment
    let {nbMesure, base} = state.segments[indexActiveSegment]
    let newState = updateBeat(state, base, nbMesure, indexActiveSegment)
    // newState = updateMesure(newState, nbMesure, indexActiveSegment)
    // newState = updateSegment(newState, indexActiveSegment, nbMesure)
    
    return newState

}
// const updateSegment = (state, indexActiveSegment, nbMesure) => {

//     // Si on est sur la dernière mesure du segment
//     if (state.activeMesure == nbMesure) {

//         return {...state, indexActiveSegment: indexActiveSegment + 1}
//     } else {
//         return state
//     }
    
// }

const updateMesure = (state, nbMesure, indexActiveSegment) => {
    let newState = {...state}

    if (state.activeMesure + 1 > nbMesure) {
        newState.activeMesure = 1

        if (indexActiveSegment == state.segments.length - 1) {
            return {...newState, finished: true}
        } else {
            return {...newState, indexActiveSegment: indexActiveSegment + 1}
        }        
    } else {
        newState.activeMesure = state.activeMesure + 1
        return newState
    }
}


const updateBeat = (state, base, nbMesure, indexActiveSegment) => { 
    let newState = {...state}
    if (state.activeBeat + 1 > base) {        
        newState.activeBeat = 1
        newState = updateMesure(newState, nbMesure, indexActiveSegment)
    }else{
        newState.activeBeat = newState.activeBeat + 1
    }
    return newState
}

//
let interval
export const play = cb => {
    state = { ...state, playing: true }

    if(state.finished) {
        clearInterval(interval)
        state = { ...state, playing: false }
        return 
    }
    
    let { tempo } = state.segments[state.indexActiveSegment]
    let intervalMS = 60000 / tempo

    biper.play()
    cb(state)
    biper.changeFrequency(1000) 
    biper.stop(0.2)
    state = updateStatePosition(state)

    interval = setInterval(() => {
        
        if(state.finished) {
            clearInterval(interval)
            //Reset du state au default
            state = { ...state, playing: false , activeMesure: 1, indexActiveSegment: 0, activeBeat: 1, finished:false }
            console.log('End of partition', state)
            return 
        }

        biper.play()
        if (state.activeBeat == 1) biper.changeFrequency(1000) 
        
        biper.stop(0.2)
        cb(state)
        const lastSegment = state.indexActiveSegment
        state = updateStatePosition(state)
        if (lastSegment != state.indexActiveSegment) {
            clearInterval(interval)
           setTimeout(()=>{  play(cb)}, intervalMS)
        }

    }, intervalMS);
}