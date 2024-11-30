import useCityContext from "../../contexts/CityContextProvider/useCityContext";
import CountryItem from "../CountryItem/CountryItem";
import Message from "../Message/Message";
import Spinner from "../Spinner/Spinner";
import styles from "./CountryList.module.css";

function CountryList() {
  type accuType = {
    country: string;
    emoji: string;
    id: number;
  };

  const { cities, isLoading } = useCityContext();

  const countries = cities.reduce((accu: accuType[], city) => {
    /* let isUniqueCountry = true;
    for (const c of accu) {
      if (c?.country === city.country) {
        isUniqueCountry = false;
        break;
      }
    }
    if (isUniqueCountry) accu.push(city);
    return accu; */

    if (!accu.map(c => c?.country).includes(city.country)) {
      return [
        ...accu,
        { id: city.id, country: city.country, emoji: city.emoji },
      ];
    } else return accu;
  }, []);

  return (
    <>
      {isLoading && <Spinner />}
      {!countries.length && !isLoading && (
        <Message message="Add your first city by clicking on a city on the map" />
      )}
      {countries.length > 0 && !isLoading && (
        <ul className={styles.countryList}>
          {countries.map(country => (
            <CountryItem key={country.id} country={country} />
          ))}
        </ul>
      )}
    </>
  );
}

export default CountryList;
