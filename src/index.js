import App from './App';
import './index.css';
import {render} from 'react-dom';

const app = new App({
  renderer: el => {
    render(el, document.querySelector('#app'));
  },
  middlewares: [
    (state) => {
      console.log(state);
      return state;
    }
  ],
  initialState: {
    tempo: {
      beat: 1,
      measure: 4,
      bpm: 120
    },
    game: {
      isOver: true,
      round: 0,
      label: [
        '白',
        'あげ',
        'ず',
        'に'
      ],
      order: {
        red: 'down',
        white: 'down'
      }
    },
    players: [
      {
        id: 'me',
        avator: {
          type: 'bird',
          color: 'blue'
        },
        flag: {
          red: 'down',
          white: 'down'
        }
      }
    ],
    myId: 'me'
  }
});

app.update(_initialState  => _initialState);
