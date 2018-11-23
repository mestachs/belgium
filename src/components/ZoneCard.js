import React from "react";
import { Link } from "react-router-dom";
import slugify from "slugify";

const numberWithSpaces = x => {
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return parts.join(".");
};

const factsToFa = {
  population: "users",
  surface: "ruler-combined"
};

const factsToUnit = {
  surface: "km²"
};

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
        {zone.chiefTown && (
          <p>
            <i className="fas fa-gopuram" title="Chef lieu" /> &nbsp;
            {zone.chiefTown.fr}
          </p>
        )}
        {zone.facts &&
          Object.keys(zone.facts).map(fact => (
            <p key={fact}>
              <i className={"fas fa-" + factsToFa[fact]} title={fact} />
              &nbsp;
              <span>
                {numberWithSpaces(zone.facts[fact])}&nbsp;
                {factsToUnit[fact]}
              </span>
            </p>
          ))}
        {zone.provinces &&
          zone.provinces.map(p => (
            <li key={p}>
              <Link
                to={"/belgium/provinces/" + slugify(p, { lower: true })}
                replace
              >
                {p}
              </Link>
            </li>
          ))}
        {zone.region && (
          <Link
            to={"/belgium/regions/" + slugify(zone.region, { lower: true })}
            replace
          >
            {zone.region}
          </Link>
        )}
      </div>
    </div>
  );
};

export default ZoneCard;
