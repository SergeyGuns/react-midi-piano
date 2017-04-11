import React from 'react'
import  { findDOMNode } from 'react-dom'

class Sound {
  
  constructor(context) {
    this.context = context;
  }
  
  setup() {
    this.oscillator = this.context.createOscillator();
    this.gainNode = this.context.createGain();

    this.oscillator.connect(this.gainNode);
    this.gainNode.connect(this.context.destination);
    this.oscillator.type = 'sine';
  }

  play(value) {
    this.setup();

    this.oscillator.frequency.value = value;
    this.gainNode.gain.setValueAtTime(0, this.context.currentTime);
    this.gainNode.gain.linearRampToValueAtTime(1, this.context.currentTime + 0.01);
            
    this.oscillator.start(this.context.currentTime);
    this.stop(this.context.currentTime);
  }
  
  stop() {
    this.gainNode.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 1);
    this.oscillator.stop(this.context.currentTime + 1);
  }
 
}

const NOTES = {
  z: 196,
  x: 220,
  c: 246,
  v: 261,
  b: 293,
  n: 329,
  m: 349,
  s: 207,
  d: 233,
  g: 277,
  h: 311
}


export default class Oscillator extends React.Component {
  constructor(){
    super()
    this.state = {
    }
  }
  
  componentDidMount() {
    this.context = new window.AudioContext();
    this.sound = new Sound(this.context);
    console.log(this.sound)
  }

  handleKey(e) {
    console.log(e.type)
    if(e.type === 'keydown') 
      this.addKey(e);
    else if (e.type === 'keyup') 
      this.removeKey(e)
    
    console.log(e.key)
  }

  addKey(e) {
    if(this.state[e.key]) return;
    this.setState({
      [e.key] : e.key
    })

    let value = NOTES[e.key];
    this.sound.play(value);

  }

  removeKey(e) {
    let newState = {...this.state}
    newState[e.key] = null;
    console.log(newState)
    this.setState(newState)
    this.sound.stop();
  }

  render() {
    return (
      <div className='wrapper'>

        <input 
          onKeyDown={this.handleKey.bind(this)} 
          onKeyUp={this.handleKey.bind(this)}
          readOnly={true}
          value={Object.keys(this.state).filter(el=> {
            return  !!this.state[el]
    
          })}
          className='oscillator'>
        </input>

        <p>
          "Keys": "Notes"<br/>
          z:G x:A c:B v:C b:D n:E m:F s:G# d:A# g:C# h:D#
        </p>

      </div>

    )
  }
}