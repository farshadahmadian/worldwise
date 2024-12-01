import { Link } from "react-router-dom";

import { CityType } from "../../contexts/CityContextProvider/CityContextProvider";
import styles from "./CityItem.module.css";
import useCityContext from "../../contexts/CityContextProvider/useCityContext";

type CityItemProps = {
  city: CityType;
};

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));

function CityItem({ city }: CityItemProps) {
  const { currentCity } = useCityContext();

  const {
    emoji,
    cityName,
    date,
    id,
    position: { lat, lng },
  } = city;
  return (
    <li>
      <Link
        className={`${styles.cityItem} ${
          currentCity?.id === id ? styles["cityItem--active"] : ""
        }`}
        to={`${id}?lat=${lat}&lng=${lng}`}
      >
        {/* <span className={styles.emoji}>{emoji}</span> */}
        <img src={`https://flagsapi.com/${emoji}/flat/24.png`} alt="flag" />
        <h3 className={styles.name}>{cityName}</h3>
        <time className={styles.date}>({formatDate(date)})</time>
        <button className={styles.deleteBtn}>&times;</button>
      </Link>
    </li>
  );
}

export default CityItem;
