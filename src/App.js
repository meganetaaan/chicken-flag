import * as React from 'react';
import {Flux, Component} from 'flumpt';
import './App.css';

const imgSrc = {
  'up': require('./tori_up.png'),
  'down': require('./tori_down.png'),
  'red' : require('./tori_red.png'),
  'white': require('./tori_white.png')
};

function getPlayer(props) {
  return props.players.filter((p) => {return p.id === props.myId})[0];
}

function randomIn(arr){
  return arr[Math.floor(Math.random() * arr.length)];
}

// TODO: generate orders
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
      'あげ',
      'ない',
      ' '
    ],
    order: {
      red: 'down'
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
      '赤',
      'さげ',
      'ない',
      ' '
    ],
    order: {
      red: 'up'
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
      '白',
      'あげ',
      'ない',
      ' '
    ],
    order: {
      white: 'down'
    }
  },
  {
    label: [
      '白',
      'さげ',
      'て',
      ' '
    ],
    order: {
      white: 'down'
    }
  },
  {
    label: [
      '白',
      'さげ',
      'ない',
      ' '
    ],
    order: {
      white: 'up'
    }
  },
];
const thirdOrders = [
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
      '赤',
      'さげ',
      'ない',
      'で'
    ],
    order: {
      red: 'up',
    }
  },
  {
    label: [
      '白',
      'あげ',
      'ない',
      'で'
    ],
    order: {
      white: 'down',
    }
  },
  {
    label: [
      '白',
      'さげ',
      'ない',
      'で'
    ],
    order: {
      white: 'up',
    }
  },
  {
    label: [
      '赤',
      'あげ',
      'つつ',
      'も'
    ],
    order: {
      red: 'up'
    }
  },
  {
    label: [
      '赤',
      'さげ',
      'つつ',
      'も'
    ],
    order: {
      red: 'down'
    }
  },
  {
    label: [
      '白',
      'あげ',
      'つつ',
      'も'
    ],
    order: {
      white: 'up'
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
  '1': 'one',
  '2': 'two',
  '3': 'three',
  'Go!': 'go',
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
  speak(str, rate, pitch){
    const speechStr = translation[str] || str;
    window.speechSynthesis.cancel();
    const speakThis = new SpeechSynthesisUtterance(speechStr);
    speakThis.lang = 'en-US';
    speakThis.rate = rate || 1.2;
    speakThis.pitch = pitch || 1.0;
    window.speechSynthesis.speak(speakThis);
  }
}

class Bird extends Component {
  render() {
    const isRedUp = this.props.flag.red === 'up';
    const isWhiteUp = this.props.flag.white === 'up';
    const srcUrl = {
      true : {
        true : 'up',
        false : 'red'
      },
      false : {
        true : 'white',
        false : 'down'
      }
    };
    const src = imgSrc[srcUrl[isRedUp][isWhiteUp]];
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
      fontSize: '3em',
      textAlign: 'center',
    }}
    className='order-label'>{str || 'Click 2 Start \u261D'}</div>
  }
}

class Title extends Component {
  render() {
    return <span style={Object.assign(this.props.style, {
      color: '#FAFAFA',
      fontSize: '1.2em',
      width: '100px',
    })}>Chicken Flags</span>;
  }
}
class GameController extends Component {
  render() {
    const round = this.props.round < 0 ? 0 : this.props.round;
    return <div className='game-controller' style={{
      flexGrow: '1',
      display: 'flex',
      alignItems: 'center',
      padding: '5px',
      color: '#FAFAFA',
    }}>
    <button style={{
      fontSize: '1.2em',
      flexGrow: 3
    }}
    disabled={!this.props.isOver}
    type='button'
    onClick={() => this.dispatch('startGame')}>Start Game</button>
    <div style={{
      fontSize: '1.2em',
      textAlign: 'center',
      flexGrow: 7,
    }}>{'score:'}{round}</div>
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
      <div className='root' style={{
        margin: 0,
        padding: 0,
        position: 'absolute',
        height: '100%',
        width: '100%',
        backgroundColor: '#FAFAFA',
      }}>
      <div className='header-area' style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '3em',
        backgroundColor: '#1976D2',
        boxShadow: 'rgba(0, 0, 0, 0.701961) 0px 0px 4px, rgba(0, 0, 0, 0.137255) 0px 2px 4px',
      }}>
      <Title style={{flexGrow: 8}}/>
      <GameController style={{flexGrow: 2}} {...this.props.game}/>
      </div>
      <div className='content-area' style={
        {
          display: 'flex',
          flexDirection: 'column',
          margin: 'auto',
          padding: 5,
          width: '90%',
          maxWidth: '800px',
          userSelect: 'none',
          MozUserSelect:'none',
          WebkitUserSelect:'none',
          msUserSelect:'none',
        }}>
      <hr />
      <Order {...this.props}/>
      <hr />
      <Bird {...me}/>
      <FlagController />
      </div>
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
      state.game.round = -1;
      state.game.label = ['1', '2', '3', 'Go!'];
      getPlayer(state).flag = {red: 'down', white: 'down'};
      state.tempo.beat = 0;
      return state;
    });
    const interval = 60 * 1000 / this.state.tempo.bpm;
    this.interval = setInterval(() => {
      this.nextStep();
    }, interval);
  }
  levelUp() {
    if(this.interval){
      clearInterval(this.interval);
    }
    const interval = 60 * 1000 / (this.state.tempo.bpm + 2 * this.state.game.round)
    this.interval = setInterval(() => {
      this.nextStep();
    }, interval);
  }
  gameOver() {
    this.speaker.speak('game over', 0.9);
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
    const pitch = rate - 0.2;
    this.speaker.speak(str, rate, pitch);
  }
  nextStep() {
    const idx = (this.state.tempo.beat + 1) % this.state.tempo.measure;
    if(idx === 0){
      if(this.state.game.round >= 0 && !this.isFlagCorrect()){
        this.gameOver();
        return;
      }
      // TODO: make method
      // set new order
      const order = this.state.game.round % 4 === 3 ? randomIn(thirdOrders) : randomIn(orders);
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
    if(idx === 0 && this.state.game.round % 10 === 5 ) {
      this.levelUp();
    }
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
