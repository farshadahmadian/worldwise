// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { FormEvent, useEffect, useState } from "react";
import DatePicker from "react-datepicker";

import Button from "../Button/Button";
import BackButton from "../BackButton/BackButton";
import useQueries from "../../hooks/useQueries";
import { fetchData } from "../../utils/fetchData";
import Message from "../Message/Message";
import Spinner from "../Spinner/Spinner";

import "react-datepicker/dist/react-datepicker.css";
import styles from "./Form.module.css";
import { CityType } from "../../contexts/CityContextProvider/CityContextProvider";
import useCityContext from "../../contexts/CityContextProvider/useCityContext";
import { useNavigate } from "react-router-dom";

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
  countryName: string;
  countryCode: string;
};

function Form() {
  const [city, setCity] = useState<MapCity | null>(null);
  const [cityName, setCityName] = useState("");
  const [countryName, setCountryName] = useState("");
  // const [emoji, setEmoji] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [date, setDate] = useState<Date | null>(new Date());
  const [notes, setNotes] = useState("");
  const [isLoadingGeocoding, setIsLoadingGeocoding] = useState(true);
  const [error, setError] = useState("");
  const { lat, lng } = useQueries();
  const { createCity, addCity, isLoading } = useCityContext();
  const navigate = useNavigate();

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
    setCountryName(city?.countryName || "");
    // setEmoji(convertToEmoji(city?.countryCode || ""));
    setCountryCode(city?.countryCode || "");
  }, [city]);

  async function handleSubmit(event: FormEvent) {
    // isLoadingGeocoding is the local state and isLoading is the global state (Context API). because the createCity() function in the context API updates the isLoading state, we do not need to use the local state (isLoadingGeocoding). Instead we can use isLoading global state and update the UI based on its value (if true, add the "loading" class to the form)
    // setIsLoadingGeocoding(true);
    event.preventDefault();
    if (!cityName || !date) return;
    const newCity: CityType = {
      cityName,
      country: countryName,
      date: date.toString(),
      notes: notes,
      position: {
        lat: parseFloat(lat || "0"),
        lng: parseFloat(lng || "0"),
      },
      emoji: countryCode,
      id: Math.random().toString(16).slice(2) + Date.now().toString(16),
    };
    const data = await createCity(newCity);
    setNotes("");
    setCityName("");
    // setIsLoadingGeocoding(false);
    if (data) {
      addCity(data);
      navigate("/app");
    }
  }

  if (isLoadingGeocoding) return <Spinner />;

  if (error) return <Message message={error} />;

  return (
    <form
      className={`${styles.form} ${isLoading ? styles.loading : ""}`}
      onSubmit={handleSubmit}
    >
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
            <img src={`https://flagsapi.com/${countryCode}/flat/24.png`} />
          )}
        </div>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
      </div>
      <DatePicker id="date" selected={date} onChange={date => setDate(date)} />
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
