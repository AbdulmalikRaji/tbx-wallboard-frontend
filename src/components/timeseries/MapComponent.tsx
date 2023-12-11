import React, { useEffect, useRef, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import 'leaflet.heat/dist/leaflet-heat.js';
import 'leaflet.heat';
import L from 'leaflet';
import { Pin } from "@/interfaces/pin_interface";


interface MapComponentProps {
  pins: Array<Pin>;
}

const MapComponent: React.FC<MapComponentProps> = ({ pins }) => {
  // const [points,setPoints] = useState([
  //   [41.0082, 28.9784], // lat, lng, intensity
  // ])

  useEffect(() => {
    const map = L.map('map');
    map.setView([41.0082, 28.9784],9)

    var heat = L.heatLayer( pins.map((point) => {
      // Convert data point to LatLng object
      return L.latLng(point.X, point.Y,15);
    }), {radius: 50}).addTo(map);


    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    return () => {
      // Cleanup when component unmounts
      if (map) {
        map.remove();
      }
    };
  },[]);

 
  try {
    return (
      <div className="h-[30rem]">
          <div id="map" className="w-full rounded-xl" />
      </div>
       
        )
  } catch (err) {
    console.error("Map Component(Main) Error:", err)
  }
};

export default MapComponent;
