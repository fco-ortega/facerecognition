import './App.css';
/* import Navigation from './components/Navigation/Navigation'; */
import Logo from './components/Logo/Logo';
/* import Rank from './components/Rank/Rank'; */
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
/* import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register'; */
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import { Component } from 'react';

const app = new Clarifai.App({
  apiKey: `${process.env.REACT_APP_CLARIFAI_API_KEY}`
});

const particlesSettings = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageURL: '',
      box: {},
      route: 'signin',
      isSignedIn: false
    }
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({ box: box });
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  }

  onButtonSubmit = () => {
    this.setState({ imageURL: this.state.input });
    app.models
      .predict(
        Clarifai.FACE_DETECT_MODEL, /* 'c0c0ac362b03416da06ab3fa36fb58e3' Usar esto en caso que la API no funcione */
        this.state.input
      )
      .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
      .catch(err => console.log(err));
  }

  /* onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({ isSignedIn: false })
    } else if (route === 'home') {
      this.setState({ isSignedIn: true })
    }
    this.setState({ route: route });
  } */

  render() {
    const { /* isSignedIn, */ imageURL, /* route, */ box } = this.state;
    return (
      <div className="App">
        <Particles
          className='particles'
          params={particlesSettings}
        />
        <Logo />
        {/* <Navigation
          isSignedIn={isSignedIn}
          onRouteChange={this.onRouteChange}
        /> */}
        <div>
          {/* <Rank /> */}
          <ImageLinkForm
            onInputChange={this.onInputChange}
            onButtonSubmit={this.onButtonSubmit}
          />
          <FaceRecognition
            box={box}
            imageURL={imageURL}
          />
        </div>
      </div>
    );
  }
}

export default App;
