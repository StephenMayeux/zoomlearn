import React, { Component } from 'react';
import _ from 'lodash';
import io from 'socket.io-client';
import './App.css';
import slides from './bin/slides';

const colors = ['#5fa55a', '#01b4bc', '#f6d51f', '#fa8925', '#fa5457'];
const isPresenter = window.location.search.includes('present=true') ? 'true' : false;
const slideId = 0;

const socket = io('http://localhost:3001');

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      maxSlides: slides.length,
      slideId: parseInt(slideId, 10),
      backgroundColor: colors[slideId % slides.length]
    }

    this.handleUpdateSlide = this.handleUpdateSlide.bind(this);
    this.handleChangeSlide = this.handleChangeSlide.bind(this);
  }

  componentDidMount() {

    if (isPresenter === false || isPresenter !== 'true') {
      socket.on('goToSlide', this.handleUpdateSlide);
    }

    if (isPresenter === 'true') {
      window.addEventListener('keyup', this.handleChangeSlide);
    }
  }

  handleUpdateSlide({ slideId }) {
    this.setState({
      slideId,
      backgroundColor: colors[slideId % slides.length]
    });
  }

  handleChangeSlide(event) {
    const { maxSlides, slideId } = this.state;
    let newSlideId;

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
      slideId: newSlideId,
      backgroundColor: colors[newSlideId % slides.length]
    });
  }

  render() {
    const { slideId, backgroundColor } = this.state;
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
