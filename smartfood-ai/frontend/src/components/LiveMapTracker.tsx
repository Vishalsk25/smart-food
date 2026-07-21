import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon issues in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const createCustomIcon = (emoji: string, bgColor: string) => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: ${bgColor}; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border-radius: 50%; box-shadow: 0 2px 5px rgba(0,0,0,0.3); font-size: 16px;">${emoji}</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15],
  });
};

const icons = {
  donor: createCustomIcon('🍏', '#22c55e'),
  ashrama: createCustomIcon('🏠', '#a855f7'),
  driver: createCustomIcon('🚗', '#3b82f6'),
  picker: createCustomIcon('📍', '#ef4444'),
};

export type MapLocation = {
  lat: number;
  lng: number;
  address?: string;
};

export type MapMode = 'picker' | 'tracking' | 'global' | 'navigation';

export interface LiveMapTrackerProps {
  mode: MapMode;
  initialLocation?: MapLocation;
  onLocationSelect?: (loc: MapLocation) => void;
  pickupLocation?: MapLocation;
  dropoffLocation?: MapLocation;
  driverLocation?: MapLocation;
  onDriverLocationUpdate?: (loc: MapLocation) => void;
  activeOrders?: any[];
  style?: React.CSSProperties;
}

// Component to handle clicks on the map for location picking
const LocationPicker = ({ onLocationSelect, initialPosition }: { onLocationSelect: (loc: MapLocation) => void, initialPosition: [number, number] }) => {
  const [position, setPosition] = useState<[number, number]>(initialPosition);
  
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
      onLocationSelect({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });

  return position ? (
    <Marker position={position} icon={icons.picker}>
      <Popup>Selected Location</Popup>
    </Marker>
  ) : null;
};

// Component to auto-fit bounds based on provided locations
const MapBounds = ({ locations }: { locations: [number, number][] }) => {
  const map = useMap();
  useEffect(() => {
    if (locations.length > 0) {
      const bounds = L.latLngBounds(locations);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [locations, map]);
  return null;
};

export default function LiveMapTracker({
  mode,
  initialLocation,
  onLocationSelect,
  pickupLocation,
  dropoffLocation,
  driverLocation,
  onDriverLocationUpdate,
  activeOrders = [],
  style = { height: '400px', width: '100%', borderRadius: '12px' },
}: LiveMapTrackerProps) {
  
  const defaultCenter: [number, number] = [12.9716, 77.5946]; // Default to Bangalore, for example
  
  const center: [number, number] = initialLocation 
    ? [initialLocation.lat, initialLocation.lng] 
    : driverLocation 
      ? [driverLocation.lat, driverLocation.lng]
      : pickupLocation
        ? [pickupLocation.lat, pickupLocation.lng]
        : defaultCenter;

  const allPoints: [number, number][] = [];
  if (pickupLocation) allPoints.push([pickupLocation.lat, pickupLocation.lng]);
  if (dropoffLocation) allPoints.push([dropoffLocation.lat, dropoffLocation.lng]);
  if (driverLocation) allPoints.push([driverLocation.lat, driverLocation.lng]);

  const tileLayerUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'; // Clean map style

  return (
    <div style={{ position: 'relative', zIndex: 0, ...style }}>
      <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%', borderRadius: 'inherit' }}>
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url={tileLayerUrl}
        />
        
        {/* Bounds adjustment */}
        {mode !== 'picker' && mode !== 'global' && allPoints.length > 1 && (
          <MapBounds locations={allPoints} />
        )}

        {/* Picker Mode */}
        {mode === 'picker' && onLocationSelect && (
          <LocationPicker 
            onLocationSelect={onLocationSelect} 
            initialPosition={initialLocation ? [initialLocation.lat, initialLocation.lng] : center} 
          />
        )}

        {/* Tracking & Navigation Modes */}
        {(mode === 'tracking' || mode === 'navigation') && (
          <>
            {pickupLocation && (
              <Marker position={[pickupLocation.lat, pickupLocation.lng]} icon={icons.donor}>
                <Popup>Pickup Location</Popup>
              </Marker>
            )}
            {dropoffLocation && (
              <Marker position={[dropoffLocation.lat, dropoffLocation.lng]} icon={icons.ashrama}>
                <Popup>Drop-off Location</Popup>
              </Marker>
            )}
            {driverLocation && (
              <Marker position={[driverLocation.lat, driverLocation.lng]} icon={icons.driver}>
                <Popup>Delivery Partner (Live)</Popup>
              </Marker>
            )}
            {pickupLocation && dropoffLocation && (
              <Polyline positions={[[pickupLocation.lat, pickupLocation.lng], [dropoffLocation.lat, dropoffLocation.lng]]} color="#94a3b8" dashArray="5, 10" />
            )}
            {driverLocation && dropoffLocation && (
              <Polyline positions={[[driverLocation.lat, driverLocation.lng], [dropoffLocation.lat, dropoffLocation.lng]]} color="#3b82f6" weight={3} />
            )}
            
            {/* Simulation controls for navigation mode */}
            {mode === 'navigation' && onDriverLocationUpdate && driverLocation && dropoffLocation && (
              <SimulateMovement 
                driverLocation={driverLocation} 
                dropoffLocation={dropoffLocation} 
                onUpdate={onDriverLocationUpdate} 
              />
            )}
          </>
        )}

        {/* Global Admin Mode */}
        {mode === 'global' && (
          <>
            {activeOrders.map((order, idx) => {
              const pLat = order.pickupLat || (12.9716 + (Math.random() - 0.5) * 0.1);
              const pLng = order.pickupLng || (77.5946 + (Math.random() - 0.5) * 0.1);
              const dLat = order.dropLat || (pLat + 0.05);
              const dLng = order.dropLng || (pLng + 0.05);
              const drLat = order.ngoLat || (pLat + 0.02);
              const drLng = order.ngoLng || (pLng + 0.02);

              return (
                <React.Fragment key={order.id || idx}>
                  <Marker position={[pLat, pLng]} icon={icons.donor}>
                    <Popup>Donor: {order.donorName}</Popup>
                  </Marker>
                  <Marker position={[dLat, dLng]} icon={icons.ashrama}>
                    <Popup>Destination: {order.toLocation}</Popup>
                  </Marker>
                  {['Accepted', 'On the Way to Pickup', 'Picked Up', 'On the Way to Delivery'].includes(order.status) && (
                    <Marker position={[drLat, drLng]} icon={icons.driver}>
                      <Popup>Driver: {order.deliveryNgoName}<br/>Status: {order.status}</Popup>
                    </Marker>
                  )}
                  <Polyline positions={[[pLat, pLng], [dLat, dLng]]} color="#64748b" weight={2} dashArray="5, 5" opacity={0.5} />
                </React.Fragment>
              );
            })}
            <MapBounds locations={activeOrders.length > 0 ? activeOrders.map(o => [o.pickupLat || 12.9716, o.pickupLng || 77.5946] as [number, number]) : [center]} />
          </>
        )}
      </MapContainer>
    </div>
  );
}

// Helper component to simulate driver movement for demo purposes
function SimulateMovement({ driverLocation, dropoffLocation, onUpdate }: { driverLocation: MapLocation, dropoffLocation: MapLocation, onUpdate: (loc: MapLocation) => void }) {
  const map = useMap();
  
  useEffect(() => {
    const btn = new L.Control({ position: 'bottomright' });
    btn.onAdd = () => {
      const div = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
      div.innerHTML = `<button style="padding: 8px 12px; background: #3b82f6; color: white; border: none; cursor: pointer; border-radius: 4px; font-weight: bold;">Simulate Move</button>`;
      div.onclick = (e) => {
        e.stopPropagation();
        // Move 10% closer to dropoff
        const newLat = driverLocation.lat + (dropoffLocation.lat - driverLocation.lat) * 0.1;
        const newLng = driverLocation.lng + (dropoffLocation.lng - driverLocation.lng) * 0.1;
        onUpdate({ lat: newLat, lng: newLng });
      };
      return div;
    };
    btn.addTo(map);
    return () => { btn.remove(); };
  }, [map, driverLocation, dropoffLocation, onUpdate]);

  return null;
}
