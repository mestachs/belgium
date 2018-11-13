import React from "react";
import { Map, TileLayer, GeoJSON } from "react-leaflet";
import Leaflet from "leaflet";
import "leaflet/dist/leaflet.css";
import ReactMarkdown from "react-markdown";
import ZoneCard from "./ZoneCard";
import Credits from "./Credits";
import provinces from "./Provinces";

import { withRouter } from "react-router-dom";
import slugify from "slugify";

Leaflet.Icon.Default.imagePath =
  "//cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.4/images/";

const wikiToMd = wiki => {
  wiki = wiki.replace("[pas clair]", "");
  wiki = wiki.replace("[r\u00e9f. n\u00e9cessaire]", "");
  wiki = wiki.replace("[\u00e9vasif]", "");
  wiki = wiki.replace(/=====\s*(.*)\s*=====/g, "#### $1\n\n");
  wiki = wiki.replace(/====\s*(.*)\s*====/g, "### $1\n\n");
  wiki = wiki.replace(/===\s*(.*)\s*===/g, "## $1");
  wiki = wiki.replace(/==\s*(.*)\s*==/g, "# $1");

  wiki = wiki.replace(/\[([^\s]*)\s([^\]]*)\]/g, "[$2]($1)");
  wiki = wiki.replace(/\*\*/g, "    *");
  return wiki;
};

const regions = [
  {
    name: { fr: "Région Wallonne", nl: "Waalse Gewest" },
    armories:
      "https://upload.wikimedia.org/wikipedia/commons/4/42/Flag_of_Wallonia.svg",
    provinces: ["Brabant wallon", "Hainaut", "Liège", "Luxembourg", "Namur"],
    wikipedia: "Région_wallonne"
  },
  {
    name: { fr: "Région Flamande", nl: "Vlaams Gewest" },
    armories:
      "https://upload.wikimedia.org/wikipedia/commons/2/2b/Flag_of_Flanders.svg",
    provinces: [
      "Anvers",
      "Brabant flamand",
      "Flandre occidentale",
      "Flandre orientale",
      "Limbourg"
    ],
    wikipedia: "Région_flamande"
  },
  {
    name: {
      fr: "Région Bruxelles-Capitale",
      nl: "Brussels Hoofdstedelijk Gewest"
    },
    armories:
      "https://upload.wikimedia.org/wikipedia/commons/b/bc/Flag_of_the_Brussels-Capital_Region.svg",
    provinces: ["Bruxelles capitale"],
    wikipedia: "Région_de_Bruxelles-Capitale"
  }
];

class CountryMap extends React.Component {
  constructor() {
    super();
    this.state = {
      lat: 50.5039,
      lng: 4.4699,
      zoom: 8
    };
    this.onEachFeature = this.onEachFeature.bind(this);
    this.clickToFeature = this.clickToFeature.bind(this);
    this.resetHighlight = this.resetHighlight.bind(this);
    this.loadData = this.loadData.bind(this);
    this.getStyle = this.getStyle.bind(this);
  }

  getStyle(feature) {
    const selected = this.state && this.state.selectedFeature === feature;
    return {
      fillColor: selected ? "red" : "#ece7f2",
      weight: 2,
      opacity: 1,
      color: selected ? "red" : "blue",
      dashArray: "3",
      fillOpacity: 0.7
    };
  }

  componentDidMount() {
    this.loadData();
  }

  loadData() {
    const selectedZoneSlug = slugify(this.props.zone, { lower: true });
    const type = this.props.type;

    fetch("./" + type + ".geo.json")
      .then(res => res.json())
      .then(geojson => {
        let selectedFeature = undefined;
        geojson.features.forEach(feature => {
          if (feature.properties === undefined) {
            feature.properties = { name: { fr: feature.nom, nl: feature.nom } };
          }
          const names = feature.properties.VARNAME_1
            ? feature.properties.VARNAME_1.split("|")
            : [feature.properties.nom];
          const zones = provinces.concat(regions);
          const zone = zones.find(ou => {
            return names.some(name => {
              const slugOuFr = slugify(ou.name.fr, {
                lower: true
              });
              const slugOuNl = slugify(ou.name.nl, {
                lower: true
              });
              const slugName = slugify(name, {
                lower: true
              });

              return (
                ou.name.fr === name ||
                ou.name.nl === name ||
                slugOuFr === slugName ||
                slugOuNl === slugName
              );
            });
          });
          if (zone) {
            feature.properties.zone = zone;
            feature.properties.slug = slugify(zone.name.fr, {
              lower: true
            });
          } else {
            feature.properties.slug = slugify(names[0], {
              lower: true
            });
          }

          if (feature.properties.slug === selectedZoneSlug) {
            selectedFeature = feature;
          }
          if (zone.wikipedia) {
            fetch(
              "https://fr.wikipedia.org/w/api.php?origin=*&format=json&action=query&prop=extracts&explaintext&redirects=1&titles=" +
                zone.wikipedia
            )
              .then(res => res.json())
              .then(json => {
                const pageKey = Object.keys(json.query.pages)[0];
                const article = wikiToMd(json.query.pages[pageKey].extract);
                feature.properties.article =
                  "# " + zone.name.fr + "\n\n" + article;
                this.setState({ demo: pageKey });
              });
          }
        });

        if (selectedFeature === undefined) {
          selectedFeature = geojson.features[0];
        }
        this.setState({ geojson, selectedFeature });
      });
  }

  onEachFeature(feature, layer) {
    layer.on({
      mouseover: this.highlightFeature,
      mouseout: this.resetHighlight,
      click: this.clickToFeature
    });
  }

  clickToFeature(e) {
    const layer = e.target;
    const feature = layer.feature;

    this.props.history.push(
      "/belgium/" + this.props.type + "/" + feature.properties.slug
    );

    this.setState({
      selectedFeature: feature
    });
  }

  highlightFeature(evt) {}
  resetHighlight(evt) {}
  render() {
    const position = [this.state.lat, this.state.lng];

    return (
      <div>
        <Map
          key={this.props.type}
          center={position}
          zoom={this.state.zoom}
          style={{ width: "100%", height: "600px" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />

          {this.state.geojson && (
            <GeoJSON
              key={this.props.type}
              data={this.state.geojson}
              style={this.getStyle}
              onEachFeature={this.onEachFeature}
            />
          )}
        </Map>
        {this.state.selectedFeature &&
          this.state.selectedFeature.properties.zone && (
            <ZoneCard zone={this.state.selectedFeature.properties.zone} />
          )}
        <div className="wikipedia">
          {this.state.selectedFeature && (
            <div>
              <a href="http://creativecommons.org/licenses/by-sa/3.0/deed.fr">
                Contenu soumis à la licence CC-BY-SA
              </a>
              . Source : Article{" "}
              <em>
                <a
                  href={
                    "http://fr.wikipedia.org/wiki/" +
                    this.state.selectedFeature.properties.zone.wikipedia
                  }
                >
                  {this.state.selectedFeature.properties.zone.wikipedia}
                </a>
              </em>{" "}
              de <a href="http://fr.wikipedia.org/">Wikipédia en français</a> (
              <a
                href={
                  "http://fr.wikipedia.org/w/index.php?title=" +
                  this.state.selectedFeature.properties.zone.wikipedia +
                  "&action=history"
                }
              >
                auteurs
              </a>
              )
              <ReactMarkdown
                source={this.state.selectedFeature.properties.article}
              />
            </div>
          )}
        </div>
        <Credits />
      </div>
    );
  }
}

export default withRouter(CountryMap);
