import React from 'react'
import './metronome.css'

const Metronome = props => {
    return (
        <div>
            <button onClick= {props.clickPlayHandler}>Play</button>
            <button onClick={props.clickPauseHandler}>Pause</button>
            <div className={props.biping ? 'biping' : 'not-biping'}>Largeur</div> 
            <h1>Mesure n°: {props.globalMesure}</h1>        
            <h1>Temps n°: {props.activeBeat}</h1>        
        </div>
    )
}

export default Metronome