import React, { Component } from "react";
import io from "socket.io-client";
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      response: false,
      endpoint: "http://localhost:4000"
    };
  }
  componentDidMount() {
    const { endpoint } = this.state;
    const socket = io.connect(endpoint);
    socket.on('bus1', data => {
      this.setState({ response: data })
    })
  }
  render() {
    // console.log(this.state.response)
    const { response } = this.state;
    return (
      <div style={{ textAlign: "center" }}>
        {response.gps
          ? <p>BUS1 GPS: {response.gps}</p>
          : <p>Loading...</p>}
      </div>
    );
  }
}
export default App;