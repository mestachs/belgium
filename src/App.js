import React, { Component } from "react";
import "./App.css";
import CountryMap from "./components/CountryMap";
class App extends Component {
  render() {
    return (
      <div className="App">
        <CountryMap />
      </div>
    );
  }
}

export default App;
