import React, { useEffect } from 'react';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import 'ol/ol.css';
import { fromLonLat, toLonLat } from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { LineString } from 'ol/geom';
import { Style, Icon, Stroke } from 'ol/style';
import { circular } from 'ol/geom/Polygon';
import Control from 'ol/control/Control';
import GeoJSON from 'ol/format/GeoJSON';
import MapSubBanks from './SubBanksForMap';

import mealPin from '../mapIcons/MealPin.png';
import bankPin from '../mapIcons/BankPin.png';
import groceryPin from '../mapIcons/GroceryPin.png';




function MapComponent() {
    const subscribedBanks = MapSubBanks();  // Get the subscribed banks
    console.log("Subscribed Banks (at top): ", subscribedBanks);

    useEffect(() => {
        const osmLayer = new TileLayer({
            title: "OpenStreetMap layer",
            preload: Infinity,
            source: new OSM(),
        });

        const mealCoordinates = [
            [-110.978260, 32.232698, "Caridad Communitiy Kitchen", "845 N Main Ave, Tucson, AZ 85705","", "Mon-Fri 2:00PM-4:00PM"],
            [-110.975433, 32.231906, "Holy Family Church", "338 W University Blvd, Tucson, AZ 85705", "", "Sun-Wed 3:00PM-4:00 pm"],
            [-110.967017, 32.243502, "Mt. Calvary Missionary Baptist Church", "226 E Lester St, Tucson, AZ 85705", "", "Thurs 3:00PM-5:00PM"],
            [-110.935915, 32.264756, "Northminister Presbyterian Church", "2450 E Fort Lowell Rd, Tucson, AZ 85719", "", "Mon 5:00PM-6:00PM"],
            [-110.963007, 32.203693, "Casa Maria", "352 E 25th St, Tucson, AZ 85713", "", "Sun-Sat 8:30AM-11:30AM"],
            [-110.966062, 32.219745, "Armory Parks and Rec Food Distribution", "220 S 5th Ave, Tucson,AZ 85701", "", "Mon-Fri 3:00PM-4:00PM, Seniors Only"],
        ];
        const mealMarkerSource = new VectorSource({
            features: mealCoordinates.map(coord => {
                const feature = new Feature({
                    geometry: new Point(fromLonLat(coord.slice(0, 2))), // Convert to map's coordinate system
                });
            feature.setProperties({ description: coord[2] }); // Set description as property
            feature.setProperties({ address: coord[3] }); // Set address as property
            feature.setProperties({ services: coord[4] }); // Set services as property
            feature.setProperties({ hours: coord[5] }); // Set hours as property
            return feature;
            })
        });
        const mealMarker = new VectorLayer({
            title: "Meal Providers",
            source: mealMarkerSource,
            style: new Style({
                image: new Icon({
                    src: mealPin,
                    scale: 0.015
                })
            })
        });

        const bankCoordinates = [
            [-110.983545, 32.246979, "Caring Ministries", "820 W Calle Sur #5330, Tucson, AZ 85705", "Services: Fruit, Produce, Bread, Dairy, Clothing", "Mon-Fri 7:00AM-9:00AM"],
            [-110.951803, 32.232648, "UA Campus Pantry", "1303 E University Blvd, Tucson, AZ 85719", "Services: Produce, Breakfast Staples, Canned Goods, Bread", "Tues 3:00PM-6:00PM, Wed 12:00PM-3:00PM, Fri 12:00PM-3:00PM"],
            [-110.945729, 32.240149, "UA Campus Pantry North", "UA Health Science Library Rm 1152", "Services: Produce, Breakfast Staples, Canned Goods, Bread", "Thurs 12:30PM-2:30PM"],
            [-110.920240, 32.190317, "Community Food Bank", "3003 S Country Club Rd, Tucson, AZ 85713", "Services: Rice, Frozen Foods, Canned Goods, Vegetables", "Tues-Wed 8:00AM-3:00PM, Thurs 8:00AM-6:00PM"],            
            [-110.966476, 32.139167, "Interfaith Community Services Mobile Food Bank", "Location Varies", "Services: Food Boxes, Fresh Produce, Bread", "https://www.icstucson.org/what-we-do/emergency-assistance/mobile-food-bank/"],
            [-110.908747, 32.245588, "Emmanuael Baptist Church", "1825 N Alvernon Way, Tucson, AZ 85712", "Services: Food Boxes, Clothing, Hygiene Items", "Tues 11:00AM"],
            [-111.018756, 32.238158, "Most Holy Trinity Parish", "1300 N Greasewood Rd, Tucson, AZ 85745", "Services: Food Boxes, Non-perishables, Canned Goods", "Foodbox on Request (520-884-9021)"],
            [-110.935040, 32.241188, "Grace Saint Paul's Church - Joseph's Pantry", "2331 E Adams St, Tucson, AZ 85719", "Services: Food Boxes", "Mon-Fri 9:00AM-12:00PM"],
            [-110.911199, 32.233802, "Iskashitaa Refugee Network", "3736 E. 2nd St, Tucson, AZ 85716", "Services: Fresh Produce and Fruit, Canned and Dry Goods", "Mon-Fri 9:00AM-4:00PM"],
            [-110.964105, 32.231499, "Trinity Presbyterian Church", "400 E University Blvd, Tucson, AZ 85705", "Services: Fruit, Vegetables, Non-perishables, Canned Goods, Cases of Water", "Tues & Thurs 12:00PM-3:00PM"],
            [-110.875044, 32.230328, "Christ United Methodist Church", "655 N Craycroft Rd, Tucson, AZ 85711", "Services: Food Boxes, Bags of Groceries, Canned Meat", "Mon-Fri 9:00AM-12:00PM"],
            [-110.905664, 32.250232, "Living Faith Christian Center", "4108 E North St, Tucson, AZ 85712", "Services: Food Boxes", "Tues 5:00PM-6:00PM"],
            [-110.971171, 32.224325, "Tucson Indian Center", "97 E Congress St, Tucson, AZ 85701", "Services: Food Boxes, Diapers", "Mon: 11:00AM-4:00PM, Tues-Fri 9:00AM-4:00PM"],
        ];
        const bankMarkerSource = new VectorSource({
            features: bankCoordinates.map(coord => {
                const feature = new Feature({
                    geometry: new Point(fromLonLat(coord.slice(0, 2))), // Convert to map's coordinate system
                });
                feature.setProperties({ description: coord[2] }); // Set description as property
                feature.setProperties({ address: coord[3] }); // Set address as property
                feature.setProperties({ services: coord[4] }); // Set services as property
                feature.setProperties({ hours: coord[5] }); // Set hours as property
                return feature;
            })
        });
        const bankMarker = new VectorLayer({
            title: "Food Banks",
            source: bankMarkerSource,
            style: new Style({
                image: new Icon({
                    src: bankPin,
                    scale: 0.015
                })
            })
        });

        const groceryCoordinates = [
            [-110.952157, 32.232748, "Arizona Market", "1303 E University Blvd, Tucson, AZ 85719", "","Mon-Fri 7:30AM-10:00PM, Sat-Sun 9:00AM-9:00PM"],
            [-110.961967, 32.228032, "Food Conspiracy Co-op", "412 N 4th Ave, Tucson, AZ 85705", "","Sun-Sat 7:00AM-9:00PM"],
            [-110.959392, 32.225491, "New Empire Food Market", "526 E 9th St, Tucson, AZ 85705", "","Mon-Sat 9:00AM-8:00PM, Sun 9:00AM-3:00PM"],
            [-110.958276, 32.252715, "Fry's Food And Drug", "555 E Grant Rd, Tucson, AZ 85705", "","Sun-Sat 6:00AM-10:00PM"],
            [-110.942956, 32.220160, "Safeway", "1940 E Broadway Blvd, Tucson, AZ 85719", "","Sun-Sat 6:00AM-12:00AM"],
            [-110.918450, 32.236889, "Whole Foods Market", "3360 E Speedway Blvd, Tucson, AZ 85716", "","Sun-Sat 7:00AM-9:00PM"],
            [-110.913730, 32.225127, "Walmart Supercenter", "3435 E Broadway Blvd, Tucson, AZ 85716", "","Sun-Sat 6:00AM-10:00PM"],
            [-110.974508, 32.224825, "Johnny Gibson's Downtown Market", "11 S 6th Ave, Tucson, AZ 85701", "","Sun-Thurs 8:00AM-10:00PM, Fri-Sat 8:00AM-11:00PM"],
            [-110.921009, 32.208778, "Food City", "3030 E 22nd St, Tucson, AZ 85713", "","Sun-Sat 6:00AM-10:00AM"],
            [-110.935275, 32.260614, "Albertsons", "2854 N Campbell Ave, Tucson, AZ 85719", "","Sun-Sat 6:00AM-10:00AM"],
        ];
        const groceryMarkerSource = new VectorSource({
            features: groceryCoordinates.map(coord => {
                const feature = new Feature({
                    geometry: new Point(fromLonLat(coord.slice(0, 2))), // Convert to map's coordinate system
                });
                feature.setProperties({ description: coord[2] }); // Set description as property
                feature.setProperties({ address: coord[3] }); // Set address as property
                feature.setProperties({ services: coord[4] }); // Set services as property
                feature.setProperties({ hours: coord[5] }); // Set hours as property
                return feature;
            })
        });
        const groceryMarker = new VectorLayer({
            title: "Grocery Stores",
            source: groceryMarkerSource,
            style: new Style({
                image: new Icon({
                    src: groceryPin,
                    scale: 0.015
                })
            })
        });

        const subsSource = new VectorSource({});
        const subsLayer = new VectorLayer({
            title: 'Subscribed Banks',
            source: subsSource,
            style: new Style({
                image: new Icon({
                    src: groceryPin,  // change to a custom pin for subscribed banks
                    scale: 0.015,
                }),
            }),
        });


        
        const map = new Map({
            target: "map",
            layers: [osmLayer, subsLayer, mealMarker, bankMarker, groceryMarker],  // add more layers to this list
            view: new View({
                center: fromLonLat([-110.9747, 32.2226]),
                zoom: 14,
            }),
            
        });

        // Geocode function
        const geocodeAddress = async (address) => {
            const apiKey = '5b3ce3597851110001cf6248b851ba83b22545899b9a0d7216d640ea'; // Replace with your actual API key
            const url = `https://api.openrouteservice.org/geocode/search?api_key=${apiKey}&text=${encodeURIComponent(address)}`;
            
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Geocoding error: ${response.statusText}`);
                }
                const data = await response.json();
                console.log('Geocoding data:', data);
                if (data.features.length > 0) {
                    return data.features[0].geometry.coordinates; // [longitude, latitude]
                } else {
                    console.error('No results found for address:', address);
                    return null;
                }
            } catch (error) {
                console.error('Geocoding error:', error);
                return null;
            }
        };

        const addMarkers = async () => {
            for (const bank of subscribedBanks) {
                const { address, city, state, zip } = bank;
                const fullAddress = `${address}, ${city}, ${state} ${zip}`; // Format the address
                console.log('Geocoding address:', fullAddress);

                const coordinates = await geocodeAddress(fullAddress);
                if (coordinates) {
                    console.log('Coordinates from address:', coordinates);
                    
                    
                    const marker = new Feature({
                        geometry: new Point(fromLonLat(coordinates)), // Convert to map projection
                    });
                    map.getLayers().item(1).getSource().addFeature(marker); // Add marker to the subs layer
                }
                else {
                    console.error('Failed to geocode address:', fullAddress);
                }
            }
        };

        if (subscribedBanks.length > 0) {
            addMarkers();
        }

        // Create a vector source and layer for the user's location
        const geoSource = new VectorSource();
        const geoLayer = new VectorLayer({
            source: geoSource,
        });
        map.addLayer(geoLayer);

        var starting =[];

        // Get the current location of the user
        navigator.geolocation.watchPosition(
            function (pos) {
              const coords = [pos.coords.longitude, pos.coords.latitude];
                starting = coords;  // save the coordinates
              const accuracy = circular(coords, pos.coords.accuracy);
              geoSource.clear(true);
              geoSource.addFeatures([
                new Feature(
                  accuracy.transform('EPSG:4326', map.getView().getProjection())
                ),
                new Feature(new Point(fromLonLat(coords))),
              ]);
            },
            function (error) {
              alert(`ERROR: ${error.message}`);
            },
            {
              enableHighAccuracy: true,
            }
        );


        // Create a locate button
        const locate = document.createElement('div');
        locate.className = 'ol-control ol-unselectable locate';
        locate.innerHTML = '<button title="Locate me">◎</button>';
        locate.addEventListener('click', function () {
        if (!geoSource.isEmpty()) {
            map.getView().fit(geoSource.getExtent(), {
                maxZoom: 18,
                duration: 500,
            });
        }
        });
        map.addControl(
            new Control({
                element: locate,
            })
        );

        // let routeLayer = new VectorLayer({
        //     source: new VectorSource(),
        //     style: new Style({
        //         stroke: new Stroke({
        //             color: 'blue',
        //             width: 4
        //         })
        //     })
        // });

        
        // Create a popup element
        const popup = document.getElementById('popup');

        var dest = [];
        // Add click event listener to the map
        map.on('click', function(evt) {
            // Get the feature at the clicked coordinate
            map.forEachFeatureAtPixel(evt.pixel, function(feature) {
                const coordinates = feature.getGeometry().getCoordinates();
                
                // Convert back to EPSG:4326
                const lonLatCoordinates = toLonLat(coordinates);
                
                dest = lonLatCoordinates; // Now dest is [longitude, latitude]
                console.log("Destination: ", dest);

                const description = feature.getProperties().description;
                const address = feature.getProperties().address;
                const services = feature.getProperties().services;
                const hours = feature.getProperties().hours;

                // Set the popup content and position
                popup.innerHTML = `
                    <div class="popup-content">
                        <h3>${description}</h3>
                        <p>${address}</p>
                        <p>${hours}</p>
                        <p>${services}</p>
                        <button id="get-directions">Get Directions</button>
                        <button id="close-popup">Close</button>
                    </div>
                `;

                //popup.innerHTML = description;
                popup.style.display = 'block';
                popup.style.position = 'absolute'; // Keep it absolute
                popup.style.left = '350px'; // Fixed position on the right
                popup.style.top = '400px'; // Fixed position from the top
            });

            
        });

        // Function to fetch the route from OpenRouteService
        async function fetchRoute(start, destination) {
            const apiKey = '5b3ce3597851110001cf6248b851ba83b22545899b9a0d7216d640ea'; // Replace with your OpenRouteService API key
            console.log('Start:', start); // Log the start coordinates
            console.log('Destination:', destination); // Log the destination coordinates
            console.log("destination[0]: ", destination[0], "destination[1]: ", destination[1]);
            const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${start[0]},${start[1]}&end=${destination[0]},${destination[1]}`;
            console.log('Request URL:', url); // Log the request URL

            const response = await fetch(url, {
                headers: {
                    'Authorization': apiKey,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log("Data geometry:\n");
            console.log(data); // Log the response to check if it has route data
            
            return data;  // Get the route coordinates
        }

        var routeSource = new VectorSource();
        var routeLayer = new VectorLayer({
            source: new VectorSource(),
            style: new Style({
                stroke: new Stroke({
                    color: "rgb(240, 82, 82)",
                    width: 4
                })
            })
        });
        map.addLayer(routeLayer);

        function addRouteToMap(geojsonData) {
            console.log("GeojsonData in addToMap");
            console.log(geojsonData);

            routeLayer.getSource().clear(); // Clear the existing route layer

            // Create a vector source from the GeoJSON data
            const features = new GeoJSON().readFeatures(geojsonData, {
                featureProjection: 'EPSG:3857' // Ensure the projection matches your map
            });
            routeLayer.getSource().addFeatures(features);
            

             // If the route layer is not already added, add it to the map
            if (!map.getLayers().getArray().includes(routeLayer)) {
                map.addLayer(routeLayer);
            }
        
        }
        
        // Example of calling fetchRoute and adding the route to the map
        popup.addEventListener('click', async function(event) {
            if (event.target.id === 'get-directions') {
                try {
                    const geojsonData = await fetchRoute(starting, dest); // Get the route from ORS
                    console.log("GeojsonData");
                    console.log(geojsonData);
                    addRouteToMap(geojsonData); // Add the route to the map
                } 
                catch (error) {
                    console.error('Error fetching route:', error);
                }
                popup.style.display = 'none';
            }
        });

        

        // Close popup when clicking the close button
        popup.addEventListener('click', function(event) {
            if (event.target.id === 'close-popup') {
            popup.style.display = 'none';
            }
        });

        return () => map.setTarget(null)
    }, []);

    

    return (
        <div>
        <div 
          style={{ height: '500px', width: '100%' }} 
          id="map" 
          src="../libs/dist/ol-ext.min.js"
        />
        <div id="popup" className="popup" style={{
          position: 'absolute',
          background: 'white',
          border: '1px solid black',
          padding: '10px',
          display: 'none', // Start hidden
          zIndex: 1000
        }} />
      </div>
      
    );
}

export default MapComponent;