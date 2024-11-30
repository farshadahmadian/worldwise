import useCityContext from "../../contexts/CityContextProvider/useCityContext";
import CityItem from "../CityItem/CityItem";
import Message from "../Message/Message";
import Spinner from "../Spinner/Spinner";
import styles from "./CityList.module.css";

function CityList() {
  const { cities, isLoading } = useCityContext();
  return (
    <>
      {isLoading && <Spinner />}
      {!cities.length && !isLoading && (
        <Message message="Add your first city by clicking on a city on the map" />
      )}
      {cities.length > 0 && !isLoading && (
        <ul className={styles.cityList}>
          {cities.map(city => (
            <CityItem key={city.id} city={city} />
          ))}
        </ul>
      )}
    </>
  );
}

export default CityList;
