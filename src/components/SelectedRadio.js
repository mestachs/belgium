import React from "react";

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

export default SelectedRadio;
