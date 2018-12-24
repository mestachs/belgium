import React, { Component } from "react";
import slugify from "slugify";
import { withRouter } from "react-router-dom";

import radios from "./radios.json";

console.log(JSON.stringify(radios));

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
  }
  render() {
    const { selectedRadio, playStatus } = this.state;
    let classNames = "playPause";
    if (playStatus !== "playing") {
      classNames = "playPause paused";
    }
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
            <React.Fragment>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "200px",
                  flexWrap: "wrap",
                  width: "80%",
                  margin: "auto"
                }}
              >
                <button className={classNames} onClick={this.togglePlay} />
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
                  <p>Streaming : {selectedRadio.listen.high}</p>
                </div>
              </div>
              <hr />
              <br />
              <br />
            </React.Fragment>
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
                    width: "150px",
                    backgroundColor: radio.backgroundColor
                      ? radio.backgroundColor
                      : ""
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
