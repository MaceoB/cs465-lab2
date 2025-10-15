import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom/client";
import L, { marker } from 'leaflet';

//Define HTML elements

const divOverlay = document.getElementById("overlay");
const txtDescription = document.getElementById("content");
const userPrompt = document.getElementById("popup");
const btnCreateMarker = document.getElementById("submitButton");
const btnReset = document.getElementById("resetButton");

function App() {
    //Define references to be updated during the framework runtime
    const mapRef = useRef(null); 
    const leafletMapRef = useRef(null);
    const clickedCoordsRef = useRef(null);
    const markersRef = useRef([]);
    useEffect(() => {
        //Create map tiles using leaflet.js
        leafletMapRef.current = L.map(mapRef.current).setView([51.505, -0.09], 13);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(leafletMapRef.current);
       
        leafletMapRef.current.on("click", function (e) {
            userPrompt.style.display = 'block';
            divOverlay.style.display = 'block';
            clickedCoordsRef.current = e.latlng;
            //alert(e.latlng)
        });
        
        //On click function that prompts the user to add a description to the popup for the marker.
        btnCreateMarker.addEventListener('click', function () { 
            const description = txtDescription.value;
            const marker = L.marker(clickedCoordsRef.current).addTo(leafletMapRef.current);
            marker.bindPopup(description).openPopup();
            userPrompt.style.display = 'none';
            divOverlay.style.display = 'none';
            markersRef.current.push(marker);
            txtDescription.value = "";

        });

        //On click function for the reset button: deletes list of referenced markers

        btnReset.addEventListener('click', function () {
            const markers  = markersRef.current;
            for (const marker of markers) {
                marker.remove(); 
            }

            markersRef.current.length = 0;

        });

        return () => {
            leafletMapRef.current.remove();
        };

    }, []);
    return (
    <div
       ref={mapRef}
       id="map"
       style={{ height: "150vh", width: "100%" }}
    ></div> ); //returns updated map to the body of the website
    
}


ReactDOM.createRoot(document.getElementById("root")).render(<App />);