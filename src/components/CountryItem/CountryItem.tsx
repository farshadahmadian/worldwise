import styles from "./CountryItem.module.css";

type CountryItemPropsType = {
  country: {
    emoji: string;
    country: string;
    id: number;
  };
};

function CountryItem({ country }: CountryItemPropsType) {
  return (
    <li className={styles.countryItem}>
      {/* <span>{country.emoji}</span> */}

      <img
        src={`https://flagsapi.com/${country.emoji}/flat/24.png`}
        alt="flag"
      />
      <span>{country.country}</span>
    </li>
  );
}

export default CountryItem;
