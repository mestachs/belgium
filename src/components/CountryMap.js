import React from "react";
import { Map, TileLayer, GeoJSON } from "react-leaflet";
import Leaflet from "leaflet";
import "leaflet/dist/leaflet.css";

import ProvinceCard from "./ProvinceCard";
import Credits from "./Credits";
import provinces from "./Provinces";

Leaflet.Icon.Default.imagePath =
  "//cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.4/images/";

export const mapConfig = {
  center: [52.499219, 13.425416],
  zoom: 8
};

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
    fetch("./provinces.geo.json")
      .then(res => res.json())
      .then(geo => {
        this.setState({ geojson: geo });
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

    const names = layer.feature.properties.VARNAME_1.split("|");

    const province = provinces.find(ou => {
      return names.some(name => ou.name.fr === name || ou.name.nl === name);
    });

    this.setState({
      selectedFeature: layer.feature,
      selected: province
    });
  }

  highlightFeature(e) {}
  resetHighlight(e) {}
  render() {
    const position = [this.state.lat, this.state.lng];

    return (
      <div>
        <Map
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
              data={this.state.geojson}
              style={this.getStyle}
              onEachFeature={this.onEachFeature}
            />
          )}
        </Map>
        {this.state.selected && <ProvinceCard province={this.state.selected} />}
        <Credits />
      </div>
    );
  }
}

export default CountryMap;
