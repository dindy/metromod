//State global du metronome
let state = {
    //Numero de la mesure dans la partition
    activeMesure: 1,
    globalMesure:1,
    ////index du segment
    indexActiveSegment: 0, 
    //Numero du temps dans la mesure 
    activeBeat: 1,
    playing: false,
    finished: false,
  }

let globalResolve 


const bips = {
    [Symbol.asyncIterator]() {
        return {
            count: 0,
            next() {
                // this.count++
                // if(this.count === 1){
                //     return promise
                // }
                return new Promise((resolve, reject) => {
                    globalResolve = resolve
                })  
            }
        }
    }
}

  //Charge le state depuis l'application
export const init = (initialState) => {
    state.nom = initialState.nom
    state.segments = initialState.segments
}

// Gere la localisation dans la partition
const updateStatePosition = (state) => {
    let  indexActiveSegment = state.indexActiveSegment
    let {nbMesure, base} = state.segments[indexActiveSegment]

    //Met a jour les infos sur la position du metronome dans la partition
    let newState = updateBeat(state, base, nbMesure, indexActiveSegment)

    return newState
}

//Update le state avec le nouveau numero de mesure
const updateMesure = (state, nbMesure, indexActiveSegment) => {
    let newState = {...state}
    //Check si c'est la derniere mesure du segment
    if (state.activeMesure + 1 > nbMesure) {
        //Si oui, reset a la premiere mesure
        newState.activeMesure = 1
        //Check si c'est le dernier segment de la partition
        if (indexActiveSegment == state.segments.length - 1) {
            //Si oui, renvoie que c'est finit
            state.globalMesure = 1
            return {...newState, finished: true}
        } else {
            //Passe au segment suivant dans la partition
            return {...newState, indexActiveSegment: indexActiveSegment + 1}
        }
    //Sinon, le segment n'est pas finit        
    } else {
        //Passe a la mesure suivante
        newState.activeMesure = state.activeMesure + 1
        return newState
    }
}

//Gere la position dans la mesure (numero du temps)
const updateBeat = (state, base, nbMesure, indexActiveSegment) => { 
    let newState = {...state}
    //Si on est a la fin de la mesure
    if (state.activeBeat + 1 > base) {
        //Reset au premier temps        
        newState.activeBeat = 1
        newState.globalMesure = newState.globalMesure + 1
        //Declenche update de la mesure
        newState = updateMesure(newState, nbMesure, indexActiveSegment)
    //Sinon on passe au temps suivant
    }else{
        newState.activeBeat = newState.activeBeat + 1
    }
    return newState
}

//
let interval
export const play = () => {
    //Le metronome est en train de jouer
    state = { ...state, playing: true }
    console.log('play')
    //Si la partition est finit met fin a la recursion et clear l'interval
    if(state.finished) {
        clearInterval(interval)
        //MAJ du state
        state = { ...state, playing: false }
        return 
    }
    //Extrait le tempo depuis le segment en cours
    let { tempo } = state.segments[state.indexActiveSegment]
    //Calcule le tempo en MS
    let intervalMS = 60000 / tempo

    //Si c'est le premier temps de la premiere mesure du segment
    if(state.activeBeat == 1){
        globalResolve({ value: {activeBeat: state.activeBeat, globalMesure: state.globalMesure}, done: false })
        state = updateStatePosition(state)
    }
    
    interval = setInterval(() => {
        //Si la partition est finit
        if(state.finished) {
            //Nettoie l'interval
            clearInterval(interval)
            //Reset du state au default
            state = { ...state, playing: false , globalMesure: 1, indexActiveSegment: 0, activeBeat: 1, finished:false }
            globalResolve({ done: true })   
            return 
        }
        globalResolve({ value: {activeBeat: state.activeBeat, globalMesure: state.globalMesure}, done: false })
        //Save le dernier segment en cours
        const lastSegment = state.indexActiveSegment
        //MAJ de la position dans la partition
        state = updateStatePosition(state)
        //Check si le segment est finit
        if (lastSegment != state.indexActiveSegment) {
            //Si oui nettoie l'interval
            clearInterval(interval)
            //Appel le prochain segment
           setTimeout(()=>{  play()}, intervalMS)
        }

    }, intervalMS)
}

export const pause = cb => {
    clearInterval(interval)
    state.playing = false
    cb(state)
}

export const getBips = () => {
    return bips
}