import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./Map.module.css";

function Map() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const handleNavigate = () => navigate("form");

  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  return (
    <div className={styles.mapContainer} onClick={handleNavigate}>
      <p>lat: {lat}</p>
      <p>lng: {lng}</p>
    </div>
  );
}

export default Map;
