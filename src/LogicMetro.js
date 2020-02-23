import Biper from "./Biper"

//Gere l'oscillateur pour créer les sons
const biper = new Biper()

//State global du metronome
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
    //Numero de la mesure dans la partition
    activeMesure: 1,
    ////index du segment
    indexActiveSegment: 0, 
    //Numero du temps dans la mesure 
    activeBeat: 1,
    playing: false,
    finished: false,
  }

  //Charge le state depuis l'application
export const init = (state) => {
    state = {...state}
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
export const play = cb => {
    //Le metronome est en train de jouer
    state = { ...state, playing: true }

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
        //BIP
        biper.play()
        //CallBack pour mettre a jour le state de react en function du state du metronome
        cb(state)
        //Son aigue pour le premier temps
        biper.changeFrequency(1000) 
        //Stop le bip 200ms aprés
        biper.stop(0.2)
        //Update la position dans la partition
        state = updateStatePosition(state)
    }
    
    interval = setInterval(() => {
        //Si la partition est finit
        if(state.finished) {
            //Nettoie l'interval
            clearInterval(interval)
            //Reset du state au default
            state = { ...state, playing: false , activeMesure: 1, indexActiveSegment: 0, activeBeat: 1, finished:false }
            return 
        }
        //Bip
        biper.play()
        //Check si c'est le premier temps pour changer la frequence du son
        if (state.activeBeat == 1) biper.changeFrequency(1000) 
        biper.stop(0.2)
        //CallBack pour react
        cb(state)
        //Save le dernier segment en cours
        const lastSegment = state.indexActiveSegment
        //MAJ de la position dans la partition
        state = updateStatePosition(state)
        //Check si le segment est finit
        if (lastSegment != state.indexActiveSegment) {
            //Si oui nettoie l'interval
            clearInterval(interval)
            //Appel le prochain segment
           setTimeout(()=>{  play(cb)}, intervalMS)
        }

    }, intervalMS);
}

export const pause = cb => {
    clearInterval(interval)
    state.playing = false
    cb(state)
}