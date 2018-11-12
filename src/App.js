import React, { Component } from "react";
import "./App.css";
import CountryMap from "./components/CountryMap";
import {
  HashRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Switch>
            <Route
              path="/belgium/:type/:zone"
              render={props => {
                return (
                  <CountryMap
                    key={
                      props.match.params.type + "-" + props.match.params.zone
                    }
                    {...props}
                    type={props.match.params.type}
                    zone={props.match.params.zone}
                  />
                );
              }}
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
