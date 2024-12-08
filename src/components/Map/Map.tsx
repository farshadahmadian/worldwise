import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

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

import useCityContext from "../../contexts/CityContextProvider/useCityContext";
import useGeoLocation from "../../hooks/useGeoLocation";

import styles from "./Map.module.css";
import Button from "../Button/Button";
import useQueries from "../../hooks/useQueries";

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
});
L.Marker.prototype.options.icon = DefaultIcon;

function Map() {
  const {
    state: { cities },
  } = useCityContext();
  const [mapPosition, setMapPosition] = useState<[number, number]>([49, 2]);
  const { lat, lng } = useQueries();
  const {
    error: geoLocationError,
    getPosition,
    isLoading: isLoadingPosition,
    position: geoLocationPosition,
  } = useGeoLocation();

  useEffect(() => {
    if (!lat || !lng) return;
    // mapPosition is the local state. lat and lng are the url states (searchParams). State update is asynchronous, so a state cannot be updated based on the value of another state at the same time. useEffect() can be used to sync a state with some value, e.g. with another state.
    setMapPosition([parseFloat(lat), parseFloat(lng)]);
  }, [lat, lng]);

  useEffect(() => {
    if (geoLocationPosition)
      setMapPosition([geoLocationPosition.lat, geoLocationPosition.lng]);
  }, [geoLocationPosition]);

  return (
    <div className={styles.mapContainer}>
      <Button
        type="position"
        onClick={() => {
          getPosition();
        }}
      >
        {geoLocationError
          ? "Location cannot be found!"
          : isLoadingPosition
          ? "Loading ..."
          : "User  your position"}
      </Button>

      <MapContainer
        center={[mapPosition[0], mapPosition[1]]}
        zoom={6}
        scrollWheelZoom={true}
        className={styles.mapContainer}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {!geoLocationError && !isLoadingPosition && geoLocationPosition && (
          <Marker position={[geoLocationPosition.lat, geoLocationPosition.lng]}>
            <Popup>
              <span>Your Location</span>
            </Popup>
          </Marker>
        )}
        {cities.map(city => {
          return (
            <Marker
              key={city.id}
              position={[city.position.lat, city.position.lng]}
            >
              <Popup>
                <span>{city.cityName}</span>
              </Popup>
            </Marker>
          );
        })}
        <ChangeCenter position={[mapPosition[0], mapPosition[1]]} />
        <DetectClick />
      </MapContainer>
    </div>
  );
}

type ChangeCenterPropsType = {
  position: [number, number];
};

// whenever the Map component is rendered or re-rendered, this component will be rendered too, and sets the map center according to the "position" prop
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
