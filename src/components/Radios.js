import React, { Component } from "react";
import slugify from "slugify";
import { withRouter } from "react-router-dom";

import radios from "./radios.json";

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

const SelectedRadio = props => {
  const { selectedRadio, playingNow, playStatus, togglePlay } = props;
  let classNames = "playPause";
  if (playStatus !== "playing") {
    classNames = "playPause paused";
  }
  return (
    <React.Fragment>
      <div
        style={{
          paddingTop: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "200px",
          flexWrap: "wrap",
          width: "80%",
          margin: "auto"
        }}
      >
        <button className={classNames} onClick={togglePlay} />
        <img
          src={selectedRadio.logo}
          style={{
            margin: "10px",
            maxWidth: "150px",
            maxHeigh: "150px",
            height: "auto",
            backgroundColor: selectedRadio.backgroundColor
              ? selectedRadio.backgroundColor
              : ""
          }}
          alt={selectedRadio.name}
          title={selectedRadio.name}
        />
        <div style={{ margin: "10px" }}>
          <p>
            <a
              href={selectedRadio.site}
              target="_blank"
              rel="noopener noreferrer"
            >
              {selectedRadio.name}
            </a>
          </p>
          <p>Streaming: {selectedRadio.listen.high}</p>
          {playingNow && (
            <div>
              <div
                style={{
                  float: "left",
                  height: "60px",
                  marginRight: "5px",
                  paddingTop: "5px"
                }}
              >
                <img
                  src={playingNow.imageUrl}
                  width="60px"
                  alt={playingNow.name}
                  title={playingNow.name}
                />
              </div>
              <div
                style={{
                  float: "left",
                  marginTop: "10px",
                  height: "40px"
                }}
              >
                <i className="fab fa-itunes-note" />
                &nbsp; &nbsp;
                <b>{playingNow.name}</b>
                <br />
                &nbsp;&nbsp;<i>{playingNow.artistName}</i>
              </div>
            </div>
          )}
        </div>
      </div>
      <hr />
      <br />
      <br />
    </React.Fragment>
  );
};

const RadioCard = props => {
  const radio = props.radio;
  return (
    <div
      key={radio.slug}
      className="radio-thumbnail top-img"
      title={radio.name}
    >
      <img
        src={radio.logo}
        style={{
          maxWidth: "150px",
          maxHeigh: "150px",
          height: "auto",
          width: "120px",
          backgroundColor: radio.backgroundColor ? radio.backgroundColor : ""
        }}
        alt={radio.name}
        title={radio.name}
      />
      <div
        className="overlay"
        onClick={() => {
          this.play(radio);
        }}
      >
        <i className="fa fa-play" />
      </div>
    </div>
  );
};

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
              <RadioCard radio={radio} />
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
