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
    this.props.history.push("/europe/belgium/radios/" + radio.slug);
    this.setState({ playingNow: undefined });
    if (this.audio) {
      this.audio.pause();
    }
    this.setState({ selectedRadio: radio });
    this.audio = new Audio(radio.listen.high);
    if (!radio.listen.high.includes("radionomy")) {
      this.audio.crossOrigin = "anonymous";
    }
    this.audio
      .play()
      .then(() => {
        this.setState({ playStatus: "playing" });
      })
      .catch(() => {
        this.setState({ playStatus: "paused" });
      });

    if (this.state.interval) {
      clearInterval(this.state.interval);
    }
    if (!radio.listen.high.includes("radionomy")) {
      try {
        const canvas = document.querySelector("canvas");
        const ctx = canvas.getContext("2d");
        var my_gradient = ctx.createLinearGradient(0, 0, 170, 0);
        my_gradient.addColorStop(0, "#000000");
        my_gradient.addColorStop(1, "#ffffff");
        ctx.fillStyle = my_gradient;
        // here we create our chain
        const audioContext = new AudioContext();
        const source = audioContext.createMediaElementSource(this.audio);
        const analyser = audioContext.createAnalyser();

        source.connect(analyser);
        analyser.connect(audioContext.destination);
        const width = 300;
        const height = 300;

        const interval = setInterval(() => {
          var freqData = new Uint8Array(analyser.frequencyBinCount);

          analyser.getByteFrequencyData(freqData);

          ctx.clearRect(0, 0, width, height);

          for (var i = 0; i < freqData.length; i++) {
            var magnitude = freqData[i];
            ctx.fillRect(300 - i * 5.5, height, 3, -magnitude * 0.8);
          }
        }, 33);
        this.setState({ interval: interval });
      } catch (error) {}
    }
    const proxyUrl = "https://cors-anywhere.herokuapp.com/";
    if (radio.onair) {
      if (radio.onair.includes("radionomy")) {
        fetch(proxyUrl + radio.onair)
          .then(response => response.text())
          .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
          .then(response => {
            console.log(JSON.stringify(response));
            const track = response.children[0].children[5];
            this.setState({
              playingNow: {
                imageUrl:
                  "https://imgplaceholder.com/50x50/cccccc/757575/fa-bullhorn",
                name: track.children[1].textContent,
                artistName: track.children[2].textContent
              }
            });
          });
      } else {
        fetch(proxyUrl + radio.onair)
          .then(response => response.json())
          .then(response => {
            console.log(JSON.stringify(response));
            if (radio.onair.includes("vrt.be")) {
              let onair = response.onairs.find(
                onair => onair.onairType === "NOW"
              );
              if (onair === undefined) {
                onair = response.onairs.find(
                  onair => onair.onairType === "PREVIOUS"
                );
              }
              if (onair) {
                this.setState({
                  playingNow: {
                    imageUrl:
                      "https://imgplaceholder.com/50x50/cccccc/757575/fa-bullhorn",
                    name: humanize(onair.properties[1].value),
                    artistName: humanize(onair.properties[2].value)
                  }
                });
              }
            } else {
              let now = response.results.now;
              if (now.type === "SI" && response.results.previous) {
                now =
                  response.results.previous[
                    response.results.previous.length - 1
                  ];
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
            }
          });
      }
    }
  }
  render() {
    const { selectedRadio, playStatus, playingNow } = this.state;

    return (
      <div>
        <link
          href="https://fonts.googleapis.com/css?family=Open+Sans|Roboto"
          rel="stylesheet"
        />
        <div style={{ position: "absolute", left: "60px", top: "10px" }}>
          <canvas />
        </div>
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
              <RadioCard key={radio.slug} radio={radio} play={this.play} />
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
      </div>
    );
  }
}
export default withRouter(Radios);
