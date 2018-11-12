import React from "react";

const ZoneCard = props => {
  const { zone } = props;

  return (
    <div className="card">
      <div className="container">
        <img
          src={zone.armories}
          alt={"armories of " + zone.name.fr}
          width="100%"
          style={{ maxWidth: "200px", maxHeight: "200px" }}
        />
        <h4>
          <b>{zone.name.fr}</b> <br /> <b>{zone.name.nl}</b>
        </h4>
        {zone.chiefTown && <p>Chef lieu : {zone.chiefTown.fr}</p>}
      </div>
    </div>
  );
};

export default ZoneCard;
