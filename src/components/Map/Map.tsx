import { useNavigate, useSearchParams } from "react-router-dom";
import { MouseEvent, useEffect, useState } from "react";
import L, { LeafletMouseEvent } from "leaflet";

import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

import styles from "./Map.module.css";
import useCityContext from "../../contexts/CityContextProvider/useCityContext";

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
});

L.Marker.prototype.options.icon = DefaultIcon;

function Map() {
  const { cities } = useCityContext();
  const [mapPosition, setMapPosition] = useState<[number, number]>([
    49.14, 9.21,
  ]);
  const [searchParams] = useSearchParams();
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  useEffect(() => {
    if (!lat || !lng) return;
    setMapPosition([parseFloat(lat), parseFloat(lng)]);
  }, [lat, lng]);

  return (
    <div className={styles.mapContainer}>
      <MapContainer
        center={mapPosition}
        zoom={6}
        scrollWheelZoom={true}
        className={styles.mapContainer}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map(city => {
          return (
            <Marker key={city.id} position={mapPosition}>
              <Popup>
                <span>{city.cityName}</span>
              </Popup>
            </Marker>
          );
        })}
        <ChangeCenter position={mapPosition} />
        <DetectClick />
      </MapContainer>
    </div>
  );
}

type ChangeCenterPropsType = {
  position: [number, number];
};

function ChangeCenter({ position }: ChangeCenterPropsType) {
  const map = useMap();
  map.setView(position);

  return null;
}

function DetectClick() {
  const navigate = useNavigate();
  useMapEvents({
    click: (event: LeafletMouseEvent) =>
      navigate(`form?lat=${event.latlng.lat}&lng=${event.latlng.lng}`),
  });

  return null;
}

export default Map;
