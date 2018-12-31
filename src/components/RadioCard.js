import React from "react";

const RadioCard = props => {
  const radio = props.radio;
  const play = props.play;
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
          play(radio);
        }}
      >
        <i className="fa fa-play" />
      </div>
    </div>
  );
};

export default RadioCard;
