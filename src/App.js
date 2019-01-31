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
          <Switch>
            <Route
              path="/europe/belgium/radios/:selectedSlug"
              Component={React.Fragment}
            />
            <Route path="/europe/belgium/radios" Component={React.Fragment} />
            <Route>
              <div className="navigation">
                <ul>
                  <Link to={"/europe/"} replace>
                    Europe
                  </Link>
                  <Link to={"/europe/belgium/communautes/"} replace>
                    Communautés
                  </Link>
                  <Link to={"/europe/belgium/regions/region-wallonne"} replace>
                    Régions
                  </Link>
                  <Link to={"/europe/belgium/provinces/namur"} replace>
                    Provinces
                  </Link>
                  <Link to={"/europe/belgium/communes/la-bruyere"} replace>
                    Communes
                  </Link>
                </ul>
              </div>
            </Route>
          </Switch>
          <Switch>
            <Route
              exact
              path="/europe"
              render={props => (
                <CountryMap
                  key="europe"
                  {...props}
                  type="europe"
                  zone="europe"
                />
              )}
            />
            <Route
              exact
              path="/europe/:zone"
              render={props => (
                <CountryMap
                  key="europe"
                  {...props}
                  type="europe"
                  zone={props.match.params.zone}
                />
              )}
            />

            <Route
              path="/europe/belgium/radios/:selectedSlug"
              render={props => (
                <Radios selectedSlug={props.match.params.selectedSlug} />
              )}
            />
            <Route
              path="/europe/belgium/radios"
              render={props => <Redirect to="/belgium/radios/pure-fm" />}
            />
            <Route
              path="/europe/belgium/:type/:zone"
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
              path="/europe/belgium/communautes"
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
              path="/europe/belgium/communes"
              render={() => (
                <Redirect to="/europe/belgium/communes/la-bruyere" />
              )}
            />
            <Route
              render={() => (
                <Redirect to="/europe/belgium/regions/region-flamande" />
              )}
            />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
