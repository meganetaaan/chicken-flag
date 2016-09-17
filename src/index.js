import App from './App';
import './index.css';
import {render} from 'react-dom';

const app = new App({
  renderer: el => {
    render(el, document.querySelector('#app'));
  },
  initialState: {
    tempo: {
      beat: 1,
      measure: 4,
      bpm: 120
    },
    game: {
      round: 0,
      label: [
        '白',
        'あげ',
        'ず',
        'に'
      ],
      order: {
        red: 'up',
        white: 'up'
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
          red: 'up',
          white: 'down'
        }
      }
    ],
    myId: 'me'
  }
});

app.update(_initialState  => _initialState);
app.start();
