/*
var markers = new ol.layer.Vector({
      source: new ol.source.Vector(),
      style: new ol.style.Style({
        image: new ol.style.Icon({
          anchor: [0.5, 1],
          src: 'marker.png'
        })
      })
    });
    map.addLayer(markers);
    
    var marker = new ol.Feature(new ol.geom.Point(ol.proj.fromLonLat([106.8478695, -6.1568562])));
    markers.getSource().addFeature(marker);
*/

/*  1. Make a list of food banks
    2. Make a list of grocery stores
    3. Based on what they offer, add them to a list
    4. In each iist, extract the lat/long and add a marker to the respective layer
*/

import React, { useEffect, useState } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { OSM } from 'ol/source';
import VectorSource from 'ol/source/Vector';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import { Style, Icon } from 'ol/style';

// Sample data
const foodBanks = [
  { id: 1, name: "Arizona Baptist Children's Services & Family Ministries", coords: [32.245541, -110.909240], 
    services: ["bread", "canned foods", "clothes", "diapers", "feminine products"]
  },
  
  { id: 2, name: "Armory Parks and Rec Food Distribution", coords: [32.219745, -110.966062],
    services: ["bread", "canned foods", "food boxes"]
  },

  { id: 3, name: "Caring Ministries", coords: [32.246979, -110.983545],
    services: ["bread", "diapers", "clothes", "milk", "produce", "fruits"]
  },

  { id: 4, name: "UA Campus Pantry", coords: [32.232789, -110.949571],
    services: ["bread", "eggs", "produce", "milk", "canned foods", "fruits", "feminine products"]
  }
];
const groceryStores = [
  { id: 1, name: "Grocery Store A", coords: [] },
  // Add more grocery store objects...
];
const mealProviders = [
  { id: 1, name: "Caridad Community Kitchen", coords: [32.232698, -110.978260]},
  { id: 2, name: "Holy Family Church", coords: [32.231906, -110.975433]},
  { id: 3, name: "Life in Christ Community Church", coords: [32.175469, -110.963277]},
  { id: 4, name: "Living Faith Christian Center", coords: [32.250232, -110.905664]},
  { id: 5, name: "Northminister Presbyterian Church", coords: [32.264756, -110.935915]},
  { id: 6, name: "Saguato Christian Church", coords: [32.220264, -110.812955]},
  { id: 7, name: "Casa Maria", coords: [32.203693, -110.963007]}
]

function FoodMap() {
  const [map, setMap] = useState(null);
  const [foodBanksLayer, setFoodBanksLayer] = useState(null);
  const [groceryLayer, setGroceryLayer] = useState(null);
  const [mealProvLayer, setMealLayer] = useState(null);
  const [filters, setFilters] = useState({ showStores: true, showBanks: true, searchItem: '' });

  useEffect(() => {
    // Initialize the map
    const initialMap = new Map({
      target: 'map',
      layers: [
        new TileLayer({ source: new OSM() }),
      ],
      view: new View({ center: [0, 0], zoom: 2 }),
    });
    setMap(initialMap);

    // Initialize layers for food banks and grocery stores
    const createLayer = (locations, iconPath) => new VectorLayer({
      source: new VectorSource({
        features: locations.map(location => {
          const feature = new Feature(new Point(location.coords));
          feature.setStyle(new Style({
            image: new Icon({ src: iconPath }),
          }));
          feature.set('name', location.name); // Extra info for filtering
          feature.set('services', location.services || []); // Services provided
          return feature;
        })
      })
    });

    const foodBanksLayer = createLayer(foodBanks, '../mapIcons/BankPin.png');
    const groceryLayer = createLayer(groceryStores, '../mapIcons/GroceryPin.png');
    const mealProvLayer = createLayer(mealProviders, '../mapIcons/MealPin.png');

    initialMap.addLayer(foodBanksLayer);
    initialMap.addLayer(groceryLayer);
    initialMap.addLayer(mealProvLayer);

    setFoodBanksLayer(foodBanksLayer);
    setGroceryLayer(groceryLayer);
    setMealLayer(mealProvLayer);

  }, []);

  // Toggle visibility of layers
  useEffect(() => {
    if (foodBanksLayer) foodBanksLayer.setVisible(filters.showBanks);
    if (groceryLayer) groceryLayer.setVisible(filters.showStores);
    if (mealProvLayer) mealProvLayer.setVisible(filters.showMeals);
  }, [filters.showBanks, filters.showStores, filters.showMeals, foodBanksLayer, groceryLayer, mealProvLayer]);

  // Filter food banks by services or items
  useEffect(() => {
    if (foodBanksLayer) {
      foodBanksLayer.getSource().getFeatures().forEach(feature => {
        const services = feature.get('services');
        const matchesSearch = filters.searchItem === '' || services.includes(filters.searchItem.toLowerCase());
        feature.setStyle(matchesSearch ? null : new Style({ visibility: 'hidden' }));
      });
    }
  }, [filters.searchItem, foodBanksLayer]);

  return (
    <div>
      <div id="map" style={{ width: '100%', height: '500px' }}></div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={filters.showBanks}
            onChange={() => setFilters(prev => ({ ...prev, showBanks: !prev.showBanks }))}
          />
          Show Food Banks
        </label>

        <label>
          <input
            type="checkbox"
            checked={filters.showStores}
            onChange={() => setFilters(prev => ({ ...prev, showStores: !prev.showStores }))}
          />
          Show Grocery Stores
        </label>

        <label>
          <input
            type="checkbox"
            checked={filters.showMeals}
            onChange={() => setFilters(prev => ({ ...prev, showMeals: !prev.showMeals }))}
          />
          Show Meal Providers
        </label>

        <input
          type="text"
          placeholder="Search for specific item or service"
          onChange={(e) => setFilters(prev => ({ ...prev, searchItem: e.target.value }))}
        />
      </div>
    </div>
  );
}

export default FoodMap;
