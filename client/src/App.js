import React, { Component } from 'react';
import query from 'query-string';
import _ from 'lodash';
import io from 'socket.io-client';
import './App.css';
import slides from './bin/slides';

const colors = ['#5fa55a', '#01b4bc', '#f6d51f', '#fa8925', '#fa5457'];
const parsed = query.parse(window.location.search);
const isPresenter = _.get(parsed, 'present', false);
const initialSlideId = _.get(parsed, 'slide', 0);

const roundRobin = (array, index = 0) => {
  return () => {
    if (index >= array.length) index = 0;
    return array[index++];
  };
};

const nextColor = roundRobin(colors);

const socket = io();

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      slideId: parseInt(initialSlideId, 10),
    }

    this.handleUpdateSlide = this.handleUpdateSlide.bind(this);
    this.handleChangeSlide = this.handleChangeSlide.bind(this);
  }

  componentDidMount() {
    if (isPresenter === false || isPresenter !== 'true') {
      socket.on('goToSlide', this.handleUpdateSlide);
      socket.on('welcome', this.handleWelcome.bind(this))
    } else if (isPresenter === 'true') {
      window.addEventListener('keyup', this.handleChangeSlide);
    }
  }

  handleWelcome({ msg }) {
    console.log(msg)
  }

  componentWillUnmount() {
    if (isPresenter === 'true') {
      window.removeEventListener('keyup', this.handleChangeSlide);
    }
  }

  handleUpdateSlide({ slideId }) {
    this.setState({
      slideId
    });
  }

  handleChangeSlide(event) {
    const { slideId } = this.state;
    let newSlideId = slideId;

    if (event.key === 'ArrowRight') {
      if (slideId === slides.length - 1) {
        newSlideId = 0;
      } else {
        newSlideId = slideId + 1;
      }
    } else if (event.key === 'ArrowLeft') {
      if (slideId === 0) {
        newSlideId = slides.length - 1;
      } else {
        newSlideId = slideId - 1;
      }
    }

    socket.emit('changeSlideForClients', { slideId: newSlideId });
    this.setState({
      slideId: newSlideId
    });
  }

  render() {
    const { slideId } = this.state;
    const backgroundColor = nextColor();
    const { hanzi, pinyin } = slides[slideId];
    return (
      <div className="App">
        <div
          className="App-content"
          style={{ backgroundColor }}
        >
          <p>{hanzi}</p>
          <p>{pinyin}</p>
        </div>
      </div>
    );
  }
}

export default App;
