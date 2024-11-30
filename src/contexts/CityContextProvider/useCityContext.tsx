import { useContext } from "react";
import CityContext from "./CityContextProvider";

const useCityContext = () => {
  const contextValue = useContext(CityContext);
  if (contextValue === undefined)
    throw new Error(
      "CityContext is being used in a component that is not the context consumer"
    );
  return contextValue;
};

export default useCityContext;
