// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react";

import styles from "./Form.module.css";
import Button from "../Button/Button";
import BackButton from "../BackButton/BackButton";
import useQueries from "../../hooks/useQueries";
import { fetchData } from "../../utils/fetchData";
import Message from "../Message/Message";
import Spinner from "../Spinner/Spinner";

/* function convertToEmoji(countryCode: string) {
  if (!countryCode) return "";
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
} */

type MapCity = {
  city: string;
  country: string;
  countryCode: string;
};

function Form() {
  const [city, setCity] = useState<MapCity | null>(null);
  const [cityName, setCityName] = useState("");
  const [countryName, setCountryName] = useState("");
  // const [emoji, setEmoji] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [isLoadingGeocoding, setIsLoadingGeocoding] = useState(true);
  const [error, setError] = useState("");
  const { lat, lng } = useQueries();

  const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

  useEffect(() => {
    if (!lat || !lng) {
      setError("Please start by clicking on the map");
      setIsLoadingGeocoding(false);
      // setCity(null);
      return;
    }
    const controller = new AbortController();
    fetchData<MapCity | null>(
      controller,
      `${BASE_URL}?latitude=${lat}&longitude=${lng}`,
      setCity,
      setIsLoadingGeocoding,
      Promise.resolve(null)
    );

    return () => controller.abort();
  }, [lat, lng]);

  useEffect(() => {
    if (!city) return;
    setError("");
    if (!city?.countryCode) setError("Please select a city");
    setCityName(city?.city || "");
    setCountryName(city?.country || "");
    // setEmoji(convertToEmoji(city?.countryCode || ""));
    setCountryCode(city?.countryCode || "");
  }, [city]);

  if (isLoadingGeocoding) return <Spinner />;

  if (error) return <Message message={error} />;

  return (
    <form className={styles.form}>
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <div className={styles.cityInputContainer}>
          <input
            id="cityName"
            onChange={e => {
              // setCountryCode("");
              setCityName(e.target.value);
            }}
            value={cityName}
          />
          {/* <span className={styles.flag}>{emoji}</span> */}
          {countryCode && (
            <img
              width="24px"
              src={`https://flagsapi.com/${countryCode}/flat/24.png`}
            />
          )}
        </div>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <input
          id="date"
          onChange={e => setDate(new Date(e.target.value))}
          value={date.toDateString()}
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={e => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary" onClick={() => {}}>
          Add
        </Button>
        <BackButton />
      </div>
    </form>
  );
}

export default Form;
