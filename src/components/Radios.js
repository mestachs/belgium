import React, { Component } from "react";
import slugify from "slugify";
import { withRouter } from "react-router-dom";

const radios = [
  {
    name: "Radio1",
    site: "https://radio1.be/",
    logo: "./logos/radio1.png",
    listen: {
      high: "http://icecast.vrtcdn.be/radio1-high.mp3"
    }
  },
  {
    name: "La Première - La 1ère",
    site: "https://www.rtbf.be/lapremiere/",
    logo:
      "https://www.static.rtbf.be/news/common/svg/radio/lapremiere-500x220.png",
    listen: {
      high: "https://radios.rtbf.be/laprem1ere-128.mp3"
    }
  },
  {
    name: "Pure fm",
    site: "https://www.rtbf.be/pure/",
    logo: "https://www.static.rtbf.be/news/common/svg/radio/purefm-500x220.png",
    listen: {
      high: "https://radios.rtbf.be/pure-128.mp3"
    }
  },
  {
    name: "Classic 21",
    site: "https://www.rtbf.be/classic21/",
    logo:
      "https://www.static.rtbf.be/news/common/svg/radio/classic21-500x220.png",
    listen: {
      high: "https://radios.rtbf.be/classic21-128.mp3"
    }
  },
  {
    name: "Bel-RTL",
    site: "https://www.rtl.be/belrtl/player/index.html",
    logo:
      "https://marpimagecache.s3.amazonaws.com/image/6_300x170_2018-09-07-10-30-04-149.png",
    listen: {
      high: "http://audiostream.rtl.be/belrtl128"
    }
  },
  {
    name: "Radio Contact",
    site: "http://www.radiocontact.be/player/",
    logo:
      "https://marpimagecache.s3.amazonaws.com/image/1_300x170_2018-06-12-12-17-32-443.png",
    listen: {
      high: "http://audiostream.rtl.be/contactfr192"
    }
  },
  {
    name: "Nostalgie",
    site: "https://www.nostalgie.be/",
    logo: "./logos/nostalgie.png",
    listen: {
      high: "http://nostalgiepremium.ice.infomaniak.ch/nostalgiepremium-128.mp3"
    }
  },
  {
    name: "Mint",
    site: "https://mint.be/player/",
    logo:
      "https://marpimagecache.s3.amazonaws.com/image/7_300x170_2018-06-12-12-19-20-831.png",
    listen: {
      high: "http://audiostream.rtl.be/mint192"
    }
  },
  {
    name: "DH Radio",
    site: "https://www.dhnet.be/medias/dh-radio",
    logo: "https://o0.ldh.be/file/5b9fd2c9cd7076ce3b3b7aef.png",
    listen: {
      high: " http://dhradio.ice.infomaniak.ch/dhradio-192.mp3"
    }
  },
  {
    name: "Fun Radio",
    site: "http://www.funradio.be/",
    logo:
      "http://funradio.be/wp-content/themes/funradio/library/img/logo_fun-radio_le-son-dancefloor.png",
    listen: { high: "http://live.funradio.be/funradiobe-high.mp3" }
  },

  {
    name: "Musiq'3",
    site: "http://www.rtbf.be/musiq3/",
    logo: "https://www.static.rtbf.be/news/common/svg/radio/musiq3-500x220.png",
    listen: { high: "https://radios.rtbf.be/musiq3-128.mp3" }
  },
  {
    name: "Tarmac",
    site: "https://www.rtbf.be/Tarmac",
    logo: "https://www.static.rtbf.be/news/common/svg/radio/tarmac-500x220.png",
    listen: { high: "https://radios.rtbf.be/tarmac-128.mp3" }
  },
  {
    name: "Studio Brussel",
    site: "https://stubru.be/",
    logo: "https://cds.stubru.be/sites/default/files/_still_.gif",
    listen: { high: "http://icecast.vrtcdn.be/stubru-high.mp3" }
  },
  {
    name: "Vivacité",
    site: "https://www.rtbf.be/vivacite/",
    logo:
      "https://www.static.rtbf.be/news/common/svg/radio/vivacite-500x220.png",
    listen: {
      high: "https://radios.rtbf.be/vivabxl-128.mp3"
    }
  },
  {
    name: "Check",
    site: "https://www.checkcheckcheck.be/player/",
    logo:
      "https://marpimagecache.s3.amazonaws.com/image/8_300x170_2018-06-12-12-19-20-331.png",
    listen: { high: "http://audiostream.rtl.be/check192" }
  },
  {
    name: "Antipode",
    site: "http://www.antipode.be/",
    logo: "http://www.antipode.be/images/fixes/antipode-logo-blanc.svg",
    listen: { high: "http://antipode.belstream.net/antipode128.mp3" }
  },
  {
    name: "Ketnet Hits",
    site: "http://www.ketnet.be/wrap/luister-naar-ketnet-hits",
    logo:
      "https://www.ketnet.be/sites/default/files/styles/program_header_epg/public/Header-ketnethits.jpg?itok=qOX5mpWp",
    listen: { high: " http://icecast.vrtcdn.be/ketnetradio-high.mp3" }
  },
  {
    name: "Sporza",
    site: "http://sporza.be/",
    logo: "./logos/sporza.png",
    listen: { high: "http://icecast.vrtcdn.be/sporza-high.mp3" }
  },
  {
    name: "Klara",
    site: "https://klara.be/",
    logo: "https://klara.be/s/i/1OGsTnwJDXQyhZ7P.svg",
    listen: { high: "http://icecast.vrtcdn.be/klara-high.mp3" }
  },
  {
    name: "BDJ Mashup",
    site: "https://bdjradio.com/mashup/",
    logo: "https://bdjradio.com/media/images/logo-bdj-mashup.jpg",
    listen: { high: "http://listen128.radionomy.com/bdjmashup" }
  },
  {
    name: "NRJ",
    site: "https://www.nrj.be/",
    logo: "https://www.nrj.be/images/LogoNRJ150.png",
    listen: {
      high: "http://streamingp.shoutcast.com/NRJPremium"
    }
  },
  {
    name: "MNM",
    site: "https://mnm.be/",
    logo: "https://mnm.be/images/_layout/logo-color.svg",
    backgroundColor: "#2c2a79",
    listen: { high: "http://icecast.vrtcdn.be/mnm-high.mp3" }
  }
];

radios.forEach(element => {
  element.slug = slugify(element.name, { lower: true });
});
class Radios extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.play = this.play.bind(this);
  }

  componentDidMount() {
    debugger;
    if (this.props.selectedSlug) {
      const radio = radios.find(radio => radio.slug == this.props.selectedSlug);
      this.play(radio);
    }
  }

  play(radio) {
    this.props.history.push("/belgium/radios/" + radio.slug);
    this.setState({ selectedRadio: radio }, () => {
      this.audioEl.play();
    });
  }
  render() {
    const { selectedRadio } = this.state;
    return (
      <React.Fragment>
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
            <div key={radio.slug} className="radio-thumbnail top-img">
              <img
                src={radio.logo}
                style={{
                  maxWidth: "150px",
                  maxHeigh: "150px",
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          {!selectedRadio && <p>Click to play</p>}
          {selectedRadio && (
            <React.Fragment>
              <div>
                <p>
                  Now playing :{" "}
                  <a href={selectedRadio.site} target="_blank">
                    {selectedRadio.name}
                  </a>
                </p>
                <p>Streaming : {selectedRadio.listen.high}</p>

                <audio
                  key={selectedRadio.name}
                  controls
                  ref={ref => {
                    this.audioEl = ref;
                  }}
                >
                  <source src={selectedRadio.listen.high} type="audio/mpeg" />
                </audio>
              </div>
            </React.Fragment>
          )}
        </div>
      </React.Fragment>
    );
  }
}
export default withRouter(Radios);
