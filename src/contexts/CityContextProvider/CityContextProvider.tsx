import {
  createContext,
  ReactNode,
  Reducer,
  useCallback,
  useEffect,
  useReducer,
} from "react";

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
  state: IState;
  updateCurrentCity: (
    id: string,
    controller: AbortController
  ) => Promise<CityType | null>;
  // setCurrentCity: React.Dispatch<React.SetStateAction<CityType | null>>;
  // getCurrentCity: (
  //   controller: AbortController,
  //   url: string,
  //   setState:
  //     | React.Dispatch<React.SetStateAction<CityType | null>>
  //     | React.Dispatch<React.SetStateAction<CityType[]>>,
  //   setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  //   rejectValue: Promise<[]> | Promise<null>
  // ) => Promise<[]> | Promise<null>;

  // getCurrentCity: <T>(
  //   controller: AbortController,
  //   url: string,
  //   setState: React.Dispatch<React.SetStateAction<T>>,
  //   setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  //   rejectValue: Promise<[]> | Promise<null>
  // ) => Promise<T | [] | null>;

  createCity: (city: CityType) => Promise<CityType | null>;
  addCity: (city: CityType) => void;
  deleteCity: (id: string) => void;
};

const initialState: IState = {
  cities: [],
  currentCity: null,
  isLoading: true,
};

const defaultCityContext: defaultCityContextType = {
  state: initialState,
  updateCurrentCity: () => Promise.resolve(null),
  createCity: () => Promise.resolve(null),
  addCity: () => {},
  deleteCity: () => {},
};

const CityContext = createContext(defaultCityContext);

interface IState {
  cities: CityType[];
  currentCity: CityType | null;
  isLoading: boolean;
}

type ActionType =
  | {
      type: "getCities";
      payload: { cities: CityType[]; isLoading: boolean };
    }
  | { type: "startLoading" }
  | { type: "stopLoading" }
  | { type: "deleteCity"; payload: string }
  | { type: "addCity"; payload: CityType }
  | { type: "updateCurrentCity"; payload: CityType };

function reducer(previousState: IState, action: ActionType): IState {
  const { type } = action;
  switch (type) {
    case "getCities":
      return {
        ...previousState,
        cities: action.payload.cities || [],
        isLoading: action.payload.isLoading || false,
      };
    case "startLoading":
      return { ...previousState, isLoading: true };
    case "stopLoading":
      return { ...previousState, isLoading: false };
    case "deleteCity":
      return {
        ...previousState,
        cities: previousState.cities.filter(city => city.id !== action.payload),
        currentCity: null,
      };
    case "addCity":
      return {
        ...previousState,
        cities: [...previousState.cities, action.payload],
        currentCity: action.payload,
      };
    case "updateCurrentCity":
      return { ...previousState, currentCity: action.payload };
    default: {
      const exhaustiveCheck: never = type;
      throw new Error(`Unhandled action type: ${exhaustiveCheck}`);
    }
  }
}

export const BASE_URL = "http://localhost:8000";

export function CityContextProvider({
  children,
}: CityContextProviderPropsType) {
  const [state, dispatch] = useReducer<Reducer<IState, ActionType>>(
    reducer,
    initialState
  );

  // const [cities, setCities] = useState<CityType[]>([]);
  // const [currentCity, setCurrentCity] = useState<CityType | null>(null);
  // const [isLoading, setIsLoading] = useState(true);

  // const getCurrentCity = useCallback(fetchData, [
  //   setCurrentCity,
  //   currentCity,
  //   setIsLoading,
  // ]);

  const updateCurrentCity = useCallback(
    async function (
      id: string,
      controller: AbortController
    ): Promise<CityType | null> {
      if (id === state.currentCity?.id) return state.currentCity;
      dispatch({ type: "startLoading" });
      try {
        const response = await fetch(`${BASE_URL}/cities/${id}`, {
          signal: controller.signal,
        });
        // const data = (await response.json()) as T;
        const data = await response.json();
        dispatch({ type: "updateCurrentCity", payload: data });
        dispatch({ type: "stopLoading" });
        return data;
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return null;
        } else if (error instanceof Error && error.name !== "AbortError") {
          console.error(error.message);
        } else {
          console.error(error);
        }
        dispatch({ type: "stopLoading" });
        return null;
      }
    },
    [state.currentCity]
  );

  useEffect(() => {
    dispatch({ type: "startLoading" });
    const controller = new AbortController();

    const getCities = async function (): Promise<CityType[]> {
      try {
        const response = await fetch(`${BASE_URL}/cities`, {
          signal: controller.signal,
        });
        const data = await response.json();
        dispatch({
          type: "getCities",
          payload: { cities: data, isLoading: false },
        });
        return data;
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return [];
        } else if (error instanceof Error && error.name !== "AbortError") {
          console.error(error.message);
        } else {
          console.error(error);
        }
        dispatch({ type: "stopLoading" });
        return [];
      }
    };
    getCities();

    return () => {
      controller.abort();
    };
  }, []);

  async function createCity(city: CityType): Promise<CityType | null> {
    dispatch({ type: "startLoading" });
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
      dispatch({ type: "stopLoading" });

      if (Object.keys(data).length) return data;
      else return null;
    } catch (error) {
      dispatch({ type: "stopLoading" });
      console.error(error);
      alert("Something went wrong");
      return Promise.resolve(null);
    }
  }

  async function deleteCity(id: string) {
    dispatch({ type: "startLoading" });
    try {
      const response = await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });
      if (response.status == 200) {
        await response.json();
        dispatch({ type: "deleteCity", payload: id });
      } else alert("Something went wrong");
      dispatch({ type: "stopLoading" });
    } catch (error) {
      dispatch({ type: "stopLoading" });
      console.error(error);
    }
  }

  function addCity(city: CityType) {
    dispatch({ type: "addCity", payload: city });
  }

  return (
    <CityContext.Provider
      value={{
        state,
        updateCurrentCity,
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
