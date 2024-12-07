import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import { fetchData } from "../../utils/fetchData";

type CityContextProviderPropsType = {
  children: ReactNode;
};

export type CityType = {
  cityName: string;
  country: string;
  emoji: string;
  date: string;
  notes: string;
  position: {
    lat: number;
    lng: number;
  };
  id: string;
};

type defaultCityContextType = {
  cities: CityType[];
  // setCities: React.Dispatch<React.SetStateAction<CityType[]>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  currentCity: CityType | null;
  setCurrentCity: React.Dispatch<React.SetStateAction<CityType | null>>;
  // getCurrentCity: (
  //   controller: AbortController,
  //   url: string,
  //   setState:
  //     | React.Dispatch<React.SetStateAction<CityType | null>>
  //     | React.Dispatch<React.SetStateAction<CityType[]>>,
  //   setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  //   rejectValue: Promise<[]> | Promise<null>
  // ) => Promise<[]> | Promise<null>;

  getCurrentCity: <T>(
    controller: AbortController,
    url: string,
    setState: React.Dispatch<React.SetStateAction<T>>,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
    rejectValue: Promise<[]> | Promise<null>
  ) => Promise<T | [] | null>;

  createCity: (city: CityType) => Promise<CityType | null>;
  addCity: (city: CityType) => void;
  deleteCity: (id: string) => void;
};

const defaultCityContext: defaultCityContextType = {
  cities: [],
  // setCities: () => {},
  isLoading: true,
  setIsLoading: () => {},
  currentCity: null,
  setCurrentCity: () => {},
  getCurrentCity: () => Promise.resolve(null),
  createCity: () => Promise.resolve(null),
  addCity: () => {},
  deleteCity: () => {},
};

const CityContext = createContext(defaultCityContext);

export const BASE_URL = "http://localhost:8000";

export function CityContextProvider({
  children,
}: CityContextProviderPropsType) {
  const [cities, setCities] = useState<CityType[]>([]);
  const [currentCity, setCurrentCity] = useState<CityType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getCurrentCity = useCallback(fetchData, [
    setCurrentCity,
    currentCity,
    setIsLoading,
  ]);

  useEffect(() => {
    setIsLoading(true);
    const controller = new AbortController();
    fetchData(
      controller,
      `${BASE_URL}/cities`,
      setCities,
      setIsLoading,
      Promise.resolve([])
    );

    return () => {
      controller.abort();
    };
  }, []);

  async function createCity(city: CityType): Promise<CityType | null> {
    setIsLoading(true);
    const request = {
      method: "POST",
      body: JSON.stringify(city),
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const response = await fetch(`${BASE_URL}/cities`, request);
      const data = await response.json();
      setIsLoading(false);

      if (Object.keys(data).length) return data;
      else return null;
    } catch (error) {
      setIsLoading(false);
      console.error(error);
      alert("Something went wrong");
      return Promise.resolve(null);
    }
  }

  async function deleteCity(id: string) {
    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });
      if (response.status == 200) {
        await response.json();
        setCities(prevCities => prevCities.filter(city => city.id !== id));
      } else alert("Something went wrong");
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  }

  function addCity(city: CityType) {
    setCities(prevCities => [...prevCities, city]);
  }

  return (
    <CityContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCurrentCity,
        setCurrentCity,
        setIsLoading,
        createCity,
        addCity,
        deleteCity,
      }}
    >
      {children}
    </CityContext.Provider>
  );
}

export default CityContext;
