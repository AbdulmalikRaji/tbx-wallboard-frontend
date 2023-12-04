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
const MapComponent: React.FC<MapComponentProps> = ({ pins }) => {
    
        const filterState:string[] = useSelector(selectFilterState);
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
        try {
        return (
            <div className="overflow-hidden h-[30rem] rounded-lg">
            <MapContainer center={[41.0082, 28.9784]} zoom={9} scrollWheelZoom={false}>
                <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
    
                {filteredPins?.map((pin, index) => {
                    const dotIcon = L.divIcon({
                        className: "dot-marker-red",
                        iconSize: [8, 8], // Adjust the size of the dot
                    })
                    if(pin.X && pin.Y){
                      return(
                        <Marker key={index} position={[pin.X, pin.Y]} icon={dotIcon}>
                        <Popup>
                        {pin.Category} <br /> {pin.ProductName}
                        </Popup>
                        </Marker>
                      )}
    
                      })}
            </MapContainer>
            </div>
        );
    } catch (err) {
        console.error("Map Component(stats) Error:", err)
    }
};

export default MapComponent;
