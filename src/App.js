import React, { Component } from "react";
import "./App.css";
import CountryMap from "./components/CountryMap";
import Radios from "./components/Radios";
import {
  HashRouter as Router,
  Route,
  Switch,
  Redirect,
  Link
} from "react-router-dom";

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <div className="navigation">
            <ul>
              <Link to={"/belgium/communautes/"} replace>
                Communautés
              </Link>
              <Link to={"/belgium/regions/region-wallonne"} replace>
                Régions
              </Link>
              <Link to={"/belgium/provinces/namur"} replace>
                Provinces
              </Link>
              <Link to={"/belgium/communes/la-bruyere"} replace>
                Communes
              </Link>
            </ul>
          </div>
          <Switch>
            <Route
              path="/belgium/radios/:selectedSlug"
              render={props => (
                <Radios selectedSlug={props.match.params.selectedSlug} />
              )}
            />
            <Route path="/belgium/radios" render={props => <Radios />} />
            <Route
              path="/belgium/:type/:zone"
              render={props => {
                return (
                  <CountryMap
                    key={props.match.params.type}
                    {...props}
                    type={props.match.params.type}
                    zone={props.match.params.zone}
                  />
                );
              }}
            />
            <Route
              path="/belgium/communautes"
              render={props => {
                return (
                  <CountryMap
                    key="communautes"
                    {...props}
                    type="communautes"
                    zone=""
                  />
                );
              }}
            />
            <Route
              path="/belgium/communes"
              render={() => <Redirect to="/belgium/communes/la-bruyere" />}
            />
            <Route
              render={() => <Redirect to="/belgium/regions/region-flamande" />}
            />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
