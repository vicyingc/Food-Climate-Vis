
class WorldMap {
    constructor(parentElement,geoData,visData) {
        this.parentElement = parentElement
        this.geo = geoData
        this.data = visData

        this.initvis()
    }

    initvis(){
        let vis = this

        L.Icon.Default.imagePath = 'img/images/';

        vis.map = L.map(vis.parentElement).setView([30,0], 2);

        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(vis.map);

        vis.geoLayer = L.geoJson(vis.geo).addTo(vis.map);

        vis.LayerGroup = new L.LayerGroup()
        vis.LayerGroup.addTo(vis.map)

        vis.LayerGroup.addLayer(vis.geoLayer);

        vis.color = function getColor(d) {
            return d > 10 ? '#c51b7d' :
                d > 5  ? '#e9a3c9' :
                    d > 0   ? '#fde0ef' :
                        d > -5  ? '#e6f5d0' :
                            d > -15   ? '#a1d76a' :
                                d > -25   ? '#4d9221' :
                                    d > -35   ? '#254810' :
                                    '#777572';
        };

        vis.legend = L.control(({position: 'bottomright'}));

        vis.legend.onAdd = function (map) {

            let div = L.DomUtil.create('div', 'info legend'),
                grades = [-35, -25, -15, -5, 0, 5, 10],
                labels = [];

            // loop through our density intervals and generate a label with a colored square for each interval
            for (let i = 0; i < grades.length; i++) {
                div.innerHTML +=
                    '<i style="background:' + vis.color(grades[i] + 1) + '"></i> ' +
                    grades[i] + (grades[i + 1] ? ' &ndash; ' + grades[i + 1] + '<br>' : '+');
            }

            return div;
        };

        vis.legend.addTo(vis.map);

        vis.wrangledata()
    }

    wrangledata(){
        let vis = this

        vis.relevantCountryData = []
        vis.listofcountries = []

        vis.data.forEach(d =>
        {
            let country ={
                country: d['BLS_2_Countries_(SRES)_ABBREVNAME'],
                WH: d.WH_2000,
                RI: d.RI_2000,
                MZ: d.MZ_2000,
                A1F12050: [d.WHA1F2050,d.RIA1F2050,d.MZA1F2050],
                A1F12080: [d.WHA1F2080,d.RIA1F2080,d.MZA1F2080],
                A2a2050: [d.WHA2a2050,d.RIA2a2050,d.MZA2a2050],
                A2a2080: [d.WHA2a2080,d.RIA2a2080,d.MZA2a2080],
                A2b2050:[d.WHA2b2050,d.RIA2b2050,d.MZA2b2050],
                A2b2080:[d.WHA2b2080,d.RIA2b2080,d.MZA2b2080],
                A2c2050:[d.WHA2c2050,d.RIA2c2050,d.MZA2c2050],
                A2c2080:[d.WHA2c2080,d.RIA2c2080,d.MZA2c2080],
                B1a2050:[d.WHB1a2050,d.RIB1a2050,d.MZB1a2050],
                B1a2080:[d.WHB1a2080,d.RIB1a2080,d.MZB1a2080],
                B2a2050:[d.WHB2a2050,d.RIB2a2050,d.MZB2a2050],
                B2a2080:[d.WHB2a2080,d.RIB2a2080,d.MZB2a2080],
                B2b2050:[d.WHB2b2050,d.RIB2b2050,d.MZB2b2050],
                B2b2080:[d.WHB2b2080,d.RIB2b2080,d.MZB2b2080],
            }
        vis.relevantCountryData.push(country);
            vis.listofcountries.push(d['BLS_2_Countries_(SRES)_ABBREVNAME'])
        })

        vis.updatevis()
    }

    updatevis(){
        let vis = this

        vis.LayerGroup.removeLayer(vis.geoLayer)

        function style(feature) {
            return {
                fillColor: vis.color(findValue(feature)),
                weight: 2,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.7
            };
        }

        function findValue(feature){
            let year = d3.select("#V1year").property("value");
            let proj = d3.select("#V1projection").property("value");
            let crop = d3.select("#V1crop").property("value");
            let country = feature.properties.name;
            if (vis.listofcountries.includes(country))
            {
                let values = vis.relevantCountryData.filter(d => d.country === country);
                return values[0][proj + year][parseInt(crop)]
            }
            else
                return NaN;
        }


        vis.geoLayer = L.geoJson(vis.geo,{style: style}).addTo(vis.map);
        vis.LayerGroup.addLayer(vis.geoLayer);
    }

    surveyInitialization(){
        let vis = this;
        vis.updatevis()
    }
}