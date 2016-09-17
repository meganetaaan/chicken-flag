import * as React from 'react';
import {Flux, Component} from 'flumpt';
import './App.css';

function getPlayer(props) {
  return props.players.filter((p) => {return p.id === props.myId})[0];
}

function randomIn(arr){
  return arr[Math.floor(Math.random() * arr.length)];
}
const orders = [
  {
      label: [
        '赤',
        'さげ',
        'て',
        ' '
      ],
      order: {
        red: 'down'
      }
  },
  {
      label: [
        '白',
        'あげ',
        'て',
        ' '
      ],
      order: {
        white: 'up'
      }
  },
  {
      label: [
        '赤',
        'あげ',
        'ない',
        'で'
      ],
      order: {
        red: 'down',
      }
  },
  {
      label: [
        '白',
        'さげ',
        'つつ',
        'も'
      ],
      order: {
        white: 'down'
      }
  },
];
const translation = {
  '赤': 'acka',
  '白': 'seiro',
  'あげ': 'ah gay',
  'さげ': 'sir gay',
  'て': 'tay',
  'ない': 'night',
  'で': 'day',
  'つつ': 'tutu',
  'も': 'mow',
  ' ': ' ',
  'ず': 'zoo',
  'に': 'knee',
}

class Speaker {
  speak(str, rate){
    const speechStr = translation[str];
    window.speechSynthesis.cancel();
    const speakThis = new SpeechSynthesisUtterance(speechStr);
    speakThis.rate = rate || 1.2;
    window.speechSynthesis.speak(speakThis);
  }
}
class Bird extends Component {
  render() {
    const isRedUp = this.props.flag.red === 'up';
    const isWhiteUp = this.props.flag.white === 'up';
    return (
      <div className='avator'>
      <div>{'red flags ' + (isRedUp ? 'up' : 'down')
        + ' and white flags ' + (isWhiteUp ? 'up' : 'down')} </div>
      </div>
      );
  }
}

class Order extends Component {
  render() {
    const tempo = this.props.tempo;
    const game = this.props.game;
    const str = game.label.slice(0, tempo.beat + 1).join(' ');
    return <div className='order-label'>{str}</div>
  }

}
class App extends Flux {
  start() {
    const interval = 60 * 1000 / this.state.tempo.bpm;
    setInterval(() => {
      this.nextStep();
    }, interval);
  }
  speak(str) {
    const rate = this.state.tempo.bpm / 100.0;
    this.speaker.speak(str, rate);
  }
  nextStep() {
    const idx = (this.state.tempo.beat + 1) % this.state.tempo.measure;
    if(idx === 0){
      const order = randomIn(orders);
      this.update( (state) => {
        state.game = Object.assign(state.game, order);
        console.log(state);
        return state;
      });
    }
    const labelStr = this.state.game.label[idx];
    this.speak(labelStr);
    this.update((state) => {
      state.tempo.beat = idx;
      return state;
    });
  }
  subscribe() {
    this.speaker = new Speaker();
    this.on('toggleWhite', ()=>{
      this.speak('白');
      this.update((state) => {
        const me = getPlayer(state);
        const whiteUp = me.flag.white;
        me.flag.white = whiteUp === 'up' ? 'down' : 'up';
        return state;
      });
    })
    this.on('toggleRed', ()=>{
      this.speak('赤');
      this.update((state) => {
        const me = getPlayer(state);
        const redUp = me.flag.red;
        me.flag.red = redUp === 'up' ? 'down' : 'up';
        return state;
      });
    })
  }
  render(state) {
    return <Root {...state}/>;
  }
}

class Controller extends Component {
  render() {
    return <div className='controller'>
    <input type='button' onClick={() => this.dispatch('toggleRed')} value='red' />
    <input type='button' onClick={() => this.dispatch('toggleWhite')} value='white' />
    </div>
  }
}
class Root extends Component {
  render() {
    const me = getPlayer(this.props);
    return (
    <div className='root'>
    <Bird {...me}/>
    <Order {...this.props}/>
    <Controller />
    </div>
    )
  }
}

export default App;
