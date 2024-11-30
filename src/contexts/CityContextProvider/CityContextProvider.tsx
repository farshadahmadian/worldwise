import { createContext, ReactNode, useEffect, useState } from "react";

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
  id: number;
};

type defaultCityContextType = {
  cities: CityType[];
  // setCities: React.Dispatch<React.SetStateAction<CityType[]>>;
  isLoading: boolean;
  // setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const defaultCityContext: defaultCityContextType = {
  cities: [],
  // setCities: () => {},
  isLoading: true,
  // setIsLoading: () => {},
};

const CityContext = createContext(defaultCityContext);

export function CityContextProvider({
  children,
}: CityContextProviderPropsType) {
  const [cities, setCities] = useState<CityType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const controller = new AbortController();
    const getCities = async function (): Promise<CityType[]> {
      try {
        const response = await fetch("http://localhost:8000/cities", {
          signal: controller.signal,
        });
        const data = await response.json();
        setCities(data);
        // if (!data.length) throw new Error("Data not available");
        setIsLoading(false);
        return data;
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          // setIsLoading(false);
          return [];
        } else if (error instanceof Error && error.name !== "AbortError")
          console.error(error.message);
        else console.error(error);
        setIsLoading(false);
        return Promise.resolve([]);
      }
    };
    getCities();

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <CityContext.Provider value={{ cities, isLoading }}>
      {children}
    </CityContext.Provider>
  );
}

export default CityContext;
