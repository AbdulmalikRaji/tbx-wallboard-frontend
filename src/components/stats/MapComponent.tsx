import React, { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { Pin } from "@/interfaces/pin_interface";
import { selectFilterState, setFilterState} from "@/store/filterSlice";
import { useDispatch, useSelector } from "react-redux";


interface MapComponentProps {
  pins: Array<Pin>;
}
// const dotIcon = L.divIcon({
//     className: "dot-marker",
//     iconSize: [8, 8], // Adjust the size of the dot
//     html: `<div style="background-color: red;"></div>`, // Use the dynamic color
//   })

// function calculateDotColor(density:number) {
//     // Adjust these values according to your density/color preference
//     const minDensity = 1;
//     const maxDensity = 10;
//     const minColor = "#FFFFFF"; // Light color for low density
//     const maxColor = "#FF0000"; // Dark color for high density
  
//     // Calculate the interpolated color based on density
//     const normalizedDensity = Math.min(
//       Math.max(density, minDensity),
//       maxDensity
//     );
//     const t = (normalizedDensity - minDensity) / (maxDensity - minDensity);
//     const r = Math.round((1 - t) * parseInt(minColor.slice(1), 16) + t * parseInt(maxColor.slice(1), 16));
//     const g = Math.round((1 - t) * parseInt(minColor.slice(3, 5), 16) + t * parseInt(maxColor.slice(3, 5), 16));
//     const b = Math.round((1 - t) * parseInt(minColor.slice(5, 7), 16) + t * parseInt(maxColor.slice(5, 7), 16));
//     const color = `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
    
//     return color;
// }

// // Calculate density and dynamic radius based on surrounding pins
// function calculateDensity(pins:Array<Pin>, currentPinX:number, currentPinY:number) {
//     const initialRadius = 5; // Initial radius for density calculation
//     let density = 0;
  
//     for (const pin of pins) {
//       const distance = Math.sqrt(
//         Math.pow(pin.X - currentPinX, 2) + Math.pow(pin.Y - currentPinY, 2)
//       );
  
//       // Adjust the radius based on density of other pins
//       const radius = initialRadius - (density * 5);
  
//       if (distance <= initialRadius) {
//         density++;
//       }
//     }
  
//     return density;

// }
const MapComponent: React.FC<MapComponentProps> = ({ pins }) => {
    try {
        const filterState = useSelector(selectFilterState);
        const [filteredPins,setFilterdPins] = useState<Array<Pin>>()
        useEffect(()=>{
            let newPins;
            if(filterState.length !== 0){
                newPins = pins.filter(pin => filterState.includes(pin.Category));
            }else{
                newPins = pins;
            }
            setFilterdPins(newPins);
            filteredPins?.map((pin)=>{
                // const density = calculateDensity(filteredPins,pin.X, pin.Y); // Implement your own density calculation logic
                // const dotColor = calculateDotColor(density);
                // pin.DotColor = dotColor;
            })
    
        },[pins,filterState])
        return (
            <div className="overflow-hidden h-[40rem] rounded-lg">
            <MapContainer center={[41.0082, 28.9784]} zoom={9} scrollWheelZoom={false}>
                <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
    
                {filteredPins?.map((pin, index) => {
                    console.log(pin.DotColor)
                    const dotIcon = L.divIcon({
                        className: "dot-marker-red",
                        iconSize: [8, 8], // Adjust the size of the dot
                    })
                      return(
                        <Marker key={index} position={[pin.X, pin.Y]} icon={dotIcon}>
                        <Popup>
                        {pin.Category} <br /> {pin.ProductName}
                        </Popup>
                        </Marker>
                      )
    
                      })}
            </MapContainer>
            </div>
        );
    } catch (err) {
        console.error("Map Component(stats) Error:", err)
    }
};

export default MapComponent;
