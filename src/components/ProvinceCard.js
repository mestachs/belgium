import React from "react";

const ProvinceCard = props => {
  const { province } = props;

  return (
    <div className="card">
      <div className="container">
        <img
          src={province.armories}
          alt={"armories of " + province.name.fr}
          width="100%"
          style={{ maxWidth: "200px", maxHeight: "200px" }}
        />
        <h4>
          <b>{province.name.fr}</b> - <b>{province.name.nl}</b>
        </h4>
        <p>Chef lieu : {province.chiefTown.fr}</p>
      </div>
    </div>
  );
};

export default ProvinceCard;
