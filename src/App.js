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
      'あげ',
      'て',
      ' '
    ],
    order: {
      red: 'up'
    }
  },
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
  '白': 'seero',
  'あげ': 'ah gay',
  'さげ': 'sir gay',
  'て': 'tay',
  'ない': 'night',
  'で': 'day',
  'つつ': 'tuts',
  'も': 'mo',
  ' ': ' ',
  'ず': 'zoo',
  'に': 'knee',
}

class Speaker {
  speak(str, rate){
    const speechStr = translation[str];
    window.speechSynthesis.cancel();
    const speakThis = new SpeechSynthesisUtterance(speechStr);
    //speakThis.lang = 'ja-JP';
    speakThis.rate = rate || 1.2;
    window.speechSynthesis.speak(speakThis);
  }
}

class Bird extends Component {
  render() {
    const isRedUp = this.props.flag.red === 'up';
    const isWhiteUp = this.props.flag.white === 'up';
    const srcUrl = {
      true : {
        true : 'tori_up.png',
        false : 'tori_red.png'
      },
      false : {
        true : 'tori_white.png',
        false : 'tori_down.png'
      }
    };
    const src = require('./' + srcUrl[isRedUp][isWhiteUp]);
    const alt = `red flags ${isRedUp ? 'up' : 'down'} and white flags ${isWhiteUp ? 'up' : 'down'}`;
    return (
      <div className='avator' style={{flexGrow:'4', display: 'flex', alignItems: 'flex-start'}}>
      <img style={{width: '100%', maxWidth: '500px', margin: 'auto'}} src={src} alt={alt}/>
      </div>
    );
  }
}

class Order extends Component {
  render() {
    const tempo = this.props.tempo;
    const game = this.props.game;
    const str = game.label.slice(0, tempo.beat + 1).join(' ');
    return <div style={{
      flexGrow: '1',
      fontSize: '2.5em',
      textAlign: 'center',
    }}
    className='order-label'>{str}</div>
  }
}

class GameController extends Component {
  render() {
    return <div className='game-controller' style={{flexGrow: '1'}}>
    <button style={{
      width: '100%',
      fontSize: '2em',
    }}
    disabled={!this.props.isOver}
    type='button'
    onClick={() => this.dispatch('startGame')}>Start</button>
    </div>
  }

}
class FlagController extends Component {
  render() {
    const style = {
      width: '50%',
      fontSize: '2em',
    };
    return <div className='flag-controller' style={{flexGrow: '2'}}>
    <button style={style} type='button' onClick={() => this.dispatch('toggleRed')}>Red</button>
    <button style={style} type='button' onClick={() => this.dispatch('toggleWhite')}>White</button>
    </div>
  }
}

class Root extends Component {
  render() {
    const me = getPlayer(this.props);
    return (
      <div className='root' style={
        {
          display: 'flex',
          flexDirection: 'column',
          margin: 'auto',
          padding: 5,
          width: '90%',
          maxWidth: '800px',
        }}>
      <GameController {...this.props.game}/>
      <Order {...this.props}/>
      <hr />
      <Bird {...me}/>
      <FlagController />
      </div>
    )
  }
}

class App extends Flux {
  isFlagCorrect() {
    const myFlag = getPlayer(this.state).flag;
    const correctFlag = this.state.game.order;
    return myFlag.red === correctFlag.red &&
      myFlag.white === correctFlag.white;
  }
  start() {
    if(this.interval) {
      clearInterval(this.interval);
    }
    this.update((state) => {
      state.game.isOver = false;
      state.game.order = {red: 'down', white: 'down'};
      state.game.round = 0;
      getPlayer(state).flag = {red: 'down', white: 'down'};
      state.tempo.beat = 0;
      return state;
    });
    const interval = 60 * 1000 / this.state.tempo.bpm;
    this.interval = setInterval(() => {
      this.nextStep();
    }, interval);
  }
  gameover() {
    if(this.interval) {
      clearInterval(this.interval);
    }
    this.update((state) => {
      state.game.isOver = true;
      return state;
    });
  }
  speak(str) {
    const rate = this.state.tempo.bpm / 100.0;
    this.speaker.speak(str, rate);
  }
  nextStep() {
    const idx = (this.state.tempo.beat + 1) % this.state.tempo.measure;
    if(idx === 0){
      if(!this.isFlagCorrect()){
        console.log('gameover!');
        this.gameover();
        return;
      }
      // TODO: make method
      // set new order
      const order = randomIn(orders);
      this.update( (state) => {
        state.game.label = order.label;
        state.game.order = Object.assign(state.game.order, order.order);
        state.game.round++;
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
    this.on('startGame', ()=>{
      this.start();
    });
    this.on('toggleWhite', ()=>{
      this.update((state) => {
        const me = getPlayer(state);
        const whiteUp = me.flag.white;
        me.flag.white = whiteUp === 'up' ? 'down' : 'up';
        return state;
      });
    });
    this.on('toggleRed', ()=>{
      this.update((state) => {
        const me = getPlayer(state);
        const redUp = me.flag.red;
        me.flag.red = redUp === 'up' ? 'down' : 'up';
        return state;
      });
    });
  }
  render(state) {
    return <Root {...state}/>;
  }
}

export default App;
