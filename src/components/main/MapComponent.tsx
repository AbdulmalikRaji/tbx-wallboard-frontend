import React, { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { Pin } from "@/interfaces/pin_interface";


interface MapComponentProps {
  pins: Array<Pin>;
}

const MapComponent: React.FC<MapComponentProps> = ({ pins }) => {
  try {
    return (
      <div className="overflow-hidden h-[30rem] rounded-xl">
        <MapContainer center={[41.0082, 28.9784]} zoom={9} scrollWheelZoom={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
  
          {pins.map((pin, index) => {
if(pin.X && pin.Y){ return(
            <Marker key={index} position={[pin.X, pin.Y]}>
              <Popup>
                {pin.Barcode} <br /> Easily customizable.
              </Popup>
            </Marker>)}
   } )}
        </MapContainer>
      </div>
    );
  } catch (err) {
    console.error("Map Component(Main) Error:", err)
  }
};

export default MapComponent;
