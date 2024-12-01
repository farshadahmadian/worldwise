import { useParams } from "react-router-dom";
import styles from "./City.module.css";
import { useEffect, useState } from "react";
import { BASE_URL } from "../../contexts/CityContextProvider/CityContextProvider";
import useCityContext from "../../contexts/CityContextProvider/useCityContext";
import { fetchData } from "../../utils/fetchData";
import Spinner from "../Spinner/Spinner";
import BackButton from "../BackButton/BackButton";

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  }).format(new Date(date));

function City() {
  const { id } = useParams();
  // const [searchParams, setSearchParams] = useSearchParams();
  const { currentCity, setCurrentCity } = useCityContext();
  const [isLoading, setIsLoading] = useState(true);

  // const lat = searchParams.get("lat");
  // const lng = searchParams.get("lng");

  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();
    fetchData(
      controller,
      `${BASE_URL}/cities/${id}`,
      setCurrentCity,
      setIsLoading,
      Promise.resolve(null)
    );

    return () => {
      controller.abort();
    };
  }, [id, setCurrentCity]);

  if (isLoading) return <Spinner />;

  if (!currentCity || !Object.keys(currentCity).length) {
    return <p>Not found</p>;
  }

  const { cityName, emoji, date, notes } = currentCity;
  return (
    <div className={styles.city}>
      <div className={styles.row}>
        <h6>City name</h6>
        <h3>
          {/* <span>{emoji}</span> {cityName} */}
          <img src={`https://flagsapi.com/${emoji}/flat/24.png`}></img>{" "}
          {cityName}
        </h3>
      </div>

      <div className={styles.row}>
        <h6>You went to {cityName} on</h6>
        <p>{formatDate(date) || null}</p>
      </div>

      {notes && (
        <div className={styles.row}>
          <h6>Your notes</h6>
          <p>{notes}</p>
        </div>
      )}

      <div className={styles.row}>
        <h6>Learn more</h6>
        <a
          href={`https://en.wikipedia.org/wiki/${cityName}`}
          target="_blank"
          rel="noreferrer"
        >
          Check out {cityName} on Wikipedia &rarr;
        </a>
      </div>
      <BackButton />
    </div>
  );
}

export default City;
