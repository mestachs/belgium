import React, { Component } from "react";
import slugify from "slugify";
import { withRouter } from "react-router-dom";

import radios from "./radios.json";
import SelectedRadio from "./SelectedRadio.js";
import RadioCard from "./RadioCard.js";

const humanize = str => {
  if (str === undefined) {
    return "";
  }
  const lower = str.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.substr(1);
};
radios.forEach(element => {
  element.slug = slugify(element.name, { lower: true });
});

class Radios extends Component {
  constructor(props) {
    super(props);
    this.state = { playStatus: "paused" };
    this.play = this.play.bind(this);
    this.togglePlay = this.togglePlay.bind(this);
  }

  componentDidMount() {
    if (this.props.selectedSlug) {
      const radio = radios.find(
        radio => radio.slug === this.props.selectedSlug
      );
      this.play(radio, radio.slug);
    }
  }

  togglePlay() {
    if (this.state.playStatus !== "playing") {
      this.audio.play();
      this.setState({ playStatus: "playing" });
    } else {
      this.audio.pause();
      this.setState({ playStatus: "paused" });
    }
  }

  play(radio, slug) {
    this.props.history.push("/belgium/radios/" + radio.slug);
    this.setState({ playingNow: undefined });
    if (this.audio) {
      this.audio.pause();
    }
    this.setState({ selectedRadio: radio });
    this.audio = new Audio(radio.listen.high);
    this.audio
      .play()
      .then(() => {
        this.setState({ playStatus: "playing" });
      })
      .catch(() => {
        this.setState({ playStatus: "paused" });
      });

    if (radio.onair) {
      var proxyUrl = "https://cors-anywhere.herokuapp.com/";

      fetch(proxyUrl + radio.onair)
        .then(response => response.json())
        .then(response => {
          let now = response.results.now;
          if (now.type === "SI" && response.results.previous) {
            now =
              response.results.previous[response.results.previous.length - 1];
          }
          if (now.type !== "SI") {
            this.setState({
              playingNow: {
                imageUrl: now.imageUrl,
                name: humanize(now.name || now.programmeName),
                artistName: humanize(now.artistName)
              }
            });
          }
        });
    }
  }
  render() {
    const { selectedRadio, playStatus, playingNow } = this.state;

    return (
      <React.Fragment>
        <link
          href="https://fonts.googleapis.com/css?family=Open+Sans|Roboto"
          rel="stylesheet"
        />
        <div
          style={{
            fontFamily: "'Roboto', sans-serif"
          }}
        >
          {!selectedRadio && <p>Click to play</p>}
          {selectedRadio && (
            <SelectedRadio
              selectedRadio={selectedRadio}
              playingNow={playingNow}
              playStatus={playStatus}
              togglePlay={this.togglePlay}
            />
          )}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexWrap: "wrap",
              width: "80%",
              margin: "auto"
            }}
          >
            {radios.map(radio => (
              <RadioCard radio={radio} play={this.play} />
            ))}
          </div>
          <br />
          <br />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            Want more check &nbsp;
            <a href="http://www.radioplayer.be/">http://www.radioplayer.be/</a>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
export default withRouter(Radios);
