import React from "react";
import { Link } from "react-router-dom";
import slugify from "slugify";

import FlagIcon from "./FlagIcon";

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
  const { zone, zonesByNsi, parentZonesByNsi } = props;
  return (
    <div className="card">
      <div className="container">
        {zone.armories && (
          <img
            src={zone.armories}
            alt={"armories of " + zone.name.fr}
            width="100%"
            style={{ maxWidth: "200px", maxHeight: "200px" }}
          />
        )}
        <h4>
          <b>{zone.name.fr}</b> <br /> <b>{zone.name.nl}</b>
        </h4>
        {zone.chiefTown && (
          <p>
            <i className="fas fa-gopuram" title="Chef lieu" /> &nbsp;
            {zone.chiefTown.fr}
          </p>
        )}
        {zone.nsi && (
          <React.Fragment>
            <p>
              <i className="fas fa-id-badge" title="Nis code" /> &nbsp;
              {zone.nsi}
            </p>
            {parentZonesByNsi[zone.nsi] && parentZonesByNsi[zone.nsi].name.fr}
            {parentZonesByNsi[zone.nsi] &&
              parentZonesByNsi[parentZonesByNsi[zone.nsi].nsi] && (
                <React.Fragment>
                  <br />
                  <Link
                    to={
                      "/europe/belgium/regions/" +
                      slugify(
                        parentZonesByNsi[parentZonesByNsi[zone.nsi].nsi].name
                          .fr,
                        { lower: true }
                      )
                    }
                    replace
                  >
                    {parentZonesByNsi[parentZonesByNsi[zone.nsi].nsi].name.fr}
                  </Link>
                </React.Fragment>
              )}
          </React.Fragment>
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
                to={"/europe/belgium/provinces/" + slugify(p, { lower: true })}
                replace
              >
                {p}
              </Link>
            </li>
          ))}
        {zone.region && (
          <Link
            to={
              "/europe/belgium/regions/" + slugify(zone.region, { lower: true })
            }
            replace
          >
            {zone.region}
          </Link>
        )}
        {zone.capital && (
          <p>
            <i className="fas fa-gopuram" title="Capitale" /> &nbsp;
            {zone.capital}
          </p>
        )}
        {zone.code && <FlagIcon code={zone.code.toLowerCase()} size="5x" />}
        {zone.cee_accession && <p>CEE : {zone.cee_accession}</p>}
      </div>
    </div>
  );
};

export default ZoneCard;
