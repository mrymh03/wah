import React, { useEffect } from 'react';
import { Map, Tile, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import 'ol/ol.css';
import { fromLonLat } from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Style, Icon } from 'ol/style';

function NewMap() {
    useEffect(() => {
        const osmLayer = new TileLayer({
            preload: Infinity,
            source: new OSM(),
        });

        const marker = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: [new ol.Feature({
                    geometry: new ol.geom.Point(fromLonLat([-110.9747, 32.2226]))
                })],
                style: new ol.style.Style({
                    image: new ol.style.Icon({
                        src: 'https://openlayers.org/en/latest/examples/data/icon.png'
                    })
                })
            })
        });


        const map = new Map({
            target: "map",
            layers: [osmLayer, marker],  // add more layers to this list
            view: new View({
                center: fromLonLat([-110.9747, 32.2226]),
                zoom: 11,
              }),
          });
      return () => map.setTarget(null)
    }, []);

    return (
      <div 
        style={
            {height:'300px',width:'100%'}
        } 
        id="map"
      />
    );
}

export default NewMap;