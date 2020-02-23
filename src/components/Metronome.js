import React from 'react'
import './metronome.css'

const Metronome = props => {
    return (
        <div>
            <button onClick= {props.clickPlayHandler}>Play</button>
            <button onClick={props.clickPauseHandler}>Pause</button>
            <div className={props.biping ? 'biping' : 'not-biping'}>Largeur</div>         
        </div>
    )
}

export default Metronome