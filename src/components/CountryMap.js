import React from "react";
import { Map, TileLayer, GeoJSON, ImageOverlay } from "react-leaflet";
import Leaflet from "leaflet";
import "leaflet/dist/leaflet.css";
import ReactMarkdown from "react-markdown";
import ZoneCard from "./ZoneCard";
import zones from "./Zones";
import countries from "./countries.json";
import { withRouter } from "react-router-dom";
import slugify from "slugify";
import debounce from "lodash.debounce";
import PapaParse from "papaparse";
import wikiToMarkdown from "./WikiToMarkdown";
Leaflet.Icon.Default.imagePath =
  "//cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.4/images/";

const zonesByNsi = {};

const parentZonesByNsi = {};

function getAvg(numbers) {
  const total = numbers.reduce((acc, c) => acc + c, 0);
  return total / numbers.length;
}

zones.forEach(zone => {
  zonesByNsi[zone.nsi] = zone;
  if (zone.children) {
    zone.children.forEach(child => (parentZonesByNsi[child] = zone));
  }
});

const countryColors = {
  founder: "#4CAF50",
  "1973": "#F57F17",
  "1981": "#zzzbad",
  "1986": "#42A5F5",
  "1995": "#304FFE",
  "2004": "#9FA8DA",
  "2007": "#badzzz"
};

const WikipediaArticle = props => {
  const { zone, article } = props;
  return (
    <div className="wikipedia">
      <div style={{ backgroundColor: "rgb(238,238,238,0.4)", padding: "50px" }}>
        <a href="http://creativecommons.org/licenses/by-sa/3.0/deed.fr">
          Contenu soumis à la licence CC-BY-SA
        </a>
        . Source : Article{" "}
        <em>
          <a href={"http://fr.wikipedia.org/wiki/" + zone.wikipedia}>
            {zone.wikipedia}
          </a>
        </em>{" "}
        de <a href="http://fr.wikipedia.org/">Wikipédia en français</a> (
        <a
          href={
            "http://fr.wikipedia.org/w/index.php?title=" +
            zone.wikipedia +
            "&action=history"
          }
        >
          auteurs
        </a>
        )
        <ReactMarkdown source={article} />
      </div>
    </div>
  );
};

function toColor(perc) {
  var r,
    g,
    b = 0;
  if (perc < 50) {
    r = 255;
    g = Math.round(5.1 * perc);
  } else {
    g = 255;
    r = Math.round(510 - 5.1 * perc);
  }
  var h = r * 0x10000 + g * 0x100 + b * 0x1;
  return "#" + ("000000" + h.toString(16)).slice(-6);
}

class CountryMap extends React.Component {
  constructor() {
    super();
    this.state = {
      lat: 50.5039,
      lng: 3.699,
      zoom: 12
    };
    this.onEachFeature = this.onEachFeature.bind(this);
    this.clickToFeature = this.clickToFeature.bind(this);
    this.resetHighlight = this.resetHighlight.bind(this);
    this.loadData = this.loadData.bind(this);
    this.getStyle = this.getStyle.bind(this);
    this.handleResize = debounce(this.handleResize.bind(this), 500);
  }

  getStyle(feature) {
    const selected = this.state && this.state.selectedFeature === feature;
    if (this.isEurope()) {
      const cee_accession = feature.properties.zone.cee_accession;
      const isCee = cee_accession !== undefined;
      return {
        fillColor: selected
          ? "red"
          : isCee
          ? countryColors[cee_accession] || "#badbad"
          : "#451263",
        weight: 2,
        opacity: 0.7,
        color: selected ? "red" : isCee ? "rgb(166, 219, 173)" : "#631263",
        dashArray: "3",
        fillOpacity: 0.6
      };
    }
    if (this.isCommunesTypes()) {
      if (this.state.covid) {
        if (feature.properties.covid == undefined) {

          feature.properties.covid = this.state.covid.filter(
            d =>
              feature.properties.nsi == "" + d.nis &&
              d.delta !== "" &&
              d.delta !== undefined
          );
          const covidData = feature.properties.covid;
          const dd = covidData.map(d => d.delta);

          if (dd.length != 0) {
            var maxDelta = Math.max(...dd);

            const lastData = dd[dd.length - 1];
            const last14Avg = getAvg(dd.slice(Math.max(dd.length - 14, 0)))
            const last7Avg = getAvg(dd.slice(Math.max(dd.length - 7, 0)))
            let percentage = 100 - (lastData / maxDelta) * 100;
            const last7AvgRounded = Math.round(last7Avg)
            if (last7AvgRounded >= 10) {
              percentage = 0
            } else if (last7AvgRounded >= 3) {
              percentage = 25
            } else if (last7AvgRounded >= 2) {
              percentage = 35
            } else if (last7AvgRounded >= 1) {
              percentage = 50
            } else if (last7Avg > 0) {
              percentage = 75
            }else {
              percentage = 100
            }
            const color = toColor(percentage);

            feature.properties.percentage = percentage;
            feature.properties.maxDelta = maxDelta;
            feature.properties.color = color;
            feature.properties.lastData = lastData;
            feature.properties.last14Avg = last14Avg
            feature.properties.last7Avg = last7Avg
            console.log(feature.properties.name + " => " + percentage);
          } else {
            feature.properties.color = "black";
          }
        }

        if (feature.properties.color) {
          return {
            fillColor: feature.properties.color,
            weight: 2,
            opacity: selected ? 1 : 0.5,
            color: selected ? "blue" : "white",
            dashArray: "3",
            fillOpacity: 0.6
          };
        }
      }
      const parentZone = parentZonesByNsi[feature.properties.zone.nsi];
      return {
        fillColor: selected ? "red" : parentZone ? parentZone.color : "#ece7f2",
        weight: 2,
        opacity: 0.7,
        color: selected ? "red" : parentZone ? parentZone.color : "#ece7f2",
        dashArray: "3",
        fillOpacity: 0.6
      };
    }
    return {
      fillColor: selected ? "red" : "#ece7f2",
      weight: 2,
      opacity: 1,
      color: selected ? "red" : "blue",
      dashArray: "3",
      fillOpacity: 0.7
    };
  }

  handleResize() {
    if (!this.isEurope()) {
      const zoom =
        window.innerWidth < 700 ? (window.innerWidth < 500 ? 6 : 7) : 9;
      this.setState({ zoom });
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
  }

  componentDidMount() {
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
    this.loadData();
    if (this.isEurope()) {
      this.setState({ zoom: 4 });
    }
  }

  isCommunauteType() {
    return this.props.type === "communautes";
  }
  isCommunesTypes() {
    return this.props.type === "communes";
  }

  async loadData() {
    const selectedZoneSlug = slugify(this.props.zone, { lower: true });
    const type = this.props.type;

    if (this.isCommunauteType()) {
      return;
    }

    if (this.isCommunesTypes()) {
      const papa = PapaParse;
      papa.parse("https://kronacheck.be/all.csv", {
        download: true,
        header: true,
        delimiter: ",",
        dynamicTyping: true,
        complete: data => {
          this.setState({ covid: data.data });
        }
      });
    }

    const filepath = this.isCommunesTypes()
      ? "./communes-be-2019.geojson"
      : "./" + type + ".geo.json";

    fetch(filepath)
      .then(res => res.json())
      .then(geojson => {
        let selectedFeature = undefined;
        geojson.features.forEach(feature => {
          if (feature.properties === undefined) {
            feature.properties = { name: { fr: feature.nom, nl: feature.nom } };
          }
          if (feature.properties.niscode) {
            feature.properties.nsi = feature.properties.niscode;
          }

          const names = feature.properties.VARNAME_1
            ? feature.properties.VARNAME_1.split("|")
            : [
                feature.properties.nom_commune
                  ? feature.properties.nom_commune
                  : feature.properties.nom
                  ? feature.properties.nom
                  : feature.properties.name
                  ? feature.properties.name
                  : countries[feature.properties.ISO2].name
              ];

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
                this.props.type.startsWith(ou.type) &&
                (ou.name.fr === name ||
                  ou.name.nl === name ||
                  slugOuFr === slugName ||
                  slugOuNl === slugName)
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
            feature.properties.zone = {
              name: { fr: names[0] },
              nsi: feature.properties.nsi,
              code: feature.properties.ISO2
            };
          }
          if (countries[feature.properties.ISO2]) {
            const country = countries[feature.properties.ISO2];
            feature.properties.zone.capital = country.capital;
            feature.properties.zone.cee_accession = country.cee_accession;
          }
          if (feature.properties.slug === selectedZoneSlug) {
            selectedFeature = feature;
          }
          if (zone && zone.wikipedia) {
            fetch(
              "https://fr.wikipedia.org/w/api.php?origin=*&format=json&action=query&prop=extracts&explaintext&redirects=1&titles=" +
                zone.wikipedia
            )
              .then(res => res.json())
              .then(json => {
                const pageKey = Object.keys(json.query.pages)[0];
                const article = wikiToMarkdown(
                  json.query.pages[pageKey].extract
                );
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

    if (this.isEurope()) {
      this.props.history.push("/europe/" + feature.properties.slug);
    } else {
      this.props.history.push(
        "/europe/belgium/" + this.props.type + "/" + feature.properties.slug
      );
    }

    this.setState({
      selectedFeature: feature
    });
  }

  isEurope() {
    return this.props.type === "europe";
  }

  highlightFeature(evt) {}
  resetHighlight(evt) {}
  render() {
    const position = [this.state.lat, this.state.lng];
    return (
      <div>
        <Map
          zoomControl={this.isCommunesTypes() || this.isEurope()}
          scrollWheelZoom={
            this.isCommunesTypes() || this.props.type == "europe"
          }
          key={this.props.type}
          center={position}
          zoom={this.state.zoom}
          style={{ width: "100%", height: "1300px" }}
        >
          <TileLayer
            url="https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.png"
            attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, Covid data compiled by <a href="https://kronacheck.be/">kronacheck<a/>'
          />

          {this.state.geojson && (
            <GeoJSON
              key={this.props.type}
              data={this.state.geojson}
              style={this.getStyle}
              onEachFeature={this.onEachFeature}
            />
          )}

          {this.isCommunauteType() && (
            <ImageOverlay
              url="https://upload.wikimedia.org/wikipedia/commons/1/1e/BelgieGemeenschappenkaart.svg"
              bounds={[
                [49.4894835476, 2.53357303225],
                [51.505023708, 6.42165815596]
              ]}
              opacity="0.8"
            />
          )}
        </Map>

        {this.state.selectedFeature &&
          this.state.selectedFeature.properties.zone && (
            <ZoneCard
              zone={this.state.selectedFeature.properties.zone}
              feature={this.state.selectedFeature}
              zonesByNsi={zonesByNsi}
              parentZonesByNsi={parentZonesByNsi}
            />
          )}
        {this.state.selectedFeature &&
          this.state.selectedFeature.properties.zone &&
          this.state.selectedFeature.properties.article && (
            <WikipediaArticle
              zone={this.state.selectedFeature.properties.zone}
              article={this.state.selectedFeature.properties.article}
            />
          )}
        {this.isCommunauteType() && (
          <div className="card xl">
            <div className="container">
              <div>
                <h4>Carte des Communautés de Belgique</h4>
                <li>
                  Communauté flamande{" "}
                  <span style={{ color: "#A0A000" }}>(en vert)</span>
                </li>
                <li>
                  La Fédération Wallonie-Bruxelles{" "}
                  <span style={{ color: "#A00000" }}>(en rouge)</span> aka
                  Communauté française de Belgique
                </li>
                <li>
                  Région Bruxelles-Capitale (striée{" "}
                  <span style={{ color: "#A0A000" }}>vert</span> et{" "}
                  <span style={{ color: "#A00000" }}>rouge</span>) où les 2
                  communautés ont des compétences
                </li>
                <li>
                  Communauté germanophone{" "}
                  <span style={{ color: "#0000A0" }}>(en bleu)</span>
                </li>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(CountryMap);
