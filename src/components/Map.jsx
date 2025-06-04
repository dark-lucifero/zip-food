"use client"

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';


import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import { createUser } from "@/lib/actions"

// Fix for Leaflet marker icon issue (Webpack)
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
});

L.Marker.prototype.options.icon = DefaultIcon;

function LocationPicker({ user }) {
    const [location, setLocation] = useState(null);
    const [mapCenter, setMapCenter] = useState([36.191113, 44.009167]); // Default center (London)

    function LocationMarker() {
        const map = useMapEvents({
            click(e) {
                setLocation(e.latlng);
                map.flyTo(e.latlng, map.getZoom());
            },
            locationfound(e) {
                setLocation(e.latlng);
                map.flyTo(e.latlng, 13);
            },
        });
        
        useEffect(() => {
            map.locate(); // Attempt to get user's location on mount
        }, [map]);
        
        return location === null ? null : (
            <Marker position={location}></Marker>
        );
    }

    async function handleCreateUser() {
        const userObj = {
            email: user?.email,
            name: user?.name,
            address: `${location?.lat?.toFixed(6) || 36.191113}, ${location?.lng?.toFixed(6) || 44.009167}`,
            role: "customer"
        }
        
        const formData = new FormData();
        for (const key in userObj) {
            formData.append(key, userObj[key]);
        }
        
        
        
        try {
            await createUser(formData)
        } catch (e) {
            console.log(e)
        }
    }


    return (
        <div className="p-6" >
            
            <h1 className="md:text-5xl text-3xl font-bold text-black text-center py-10" >Welcome</h1>
            
            <div className="px-10 flex flex-col gap-4 mb-4" >
                <Input type="text" placeholder="name" value={user?.name} readOnly />
                <Input type="text" placeholder="email" value={user?.email} readOnly />
                <Input type="text" placeholder="address" value={`${location?.lat?.toFixed(6) || 36.191113}, ${location?.lng?.toFixed(6) || 44.009167}`} readOnly  />
                <Button onClick={handleCreateUser} >create</Button>
            </div>
            
            <MapContainer center={mapCenter} zoom={13} style={{ height: '400px', width: '100%',  }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                
                <LocationMarker />
          
                {location && (
                    <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'white', padding: '10px', borderRadius: '5px',}}>
                        <p>Latitude: {location.lat.toFixed(6)}</p>
                        <p>Longitude: {location.lng.toFixed(6)}</p>
                    </div>
                )}
                
            </MapContainer>
        </div>
    );
}

export default LocationPicker;