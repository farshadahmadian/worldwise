import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import AppLayout from "./pages/AppLayout/AppLayout";
import Homepage from "./pages/Homepage/Homepage";
import Product from "./pages/Product/Product";
import Pricing from "./pages/Pricing/Pricing";
import PageNotFound from "./pages/PageNotFound/PageNotFound";
import Login from "./pages/Login/Login";
import CityList from "./components/CityList/CityList";
import CountryList from "./components/CountryList/CountryList";
import City from "./components/City/City";
import Form from "./components/Form/Form";

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

function App() {
  const [cities, setCities] = useState([]);
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
    <BrowserRouter>
      <Routes>
        {/* element means a react element which is a component instant */}
        <Route index element={<Homepage />} />
        <Route />
        <Route path="product" element={<Product />} />
        <Route path="pricing" element={<Pricing />} />
        <Route path="login" element={<Login />} />
        <Route path="app" element={<AppLayout />}>
          <Route
            index
            // element={<CityList cities={cities} isLoading={isLoading} />}
            element={<Navigate to="cities" />}
          />
          <Route
            path="cities"
            element={<CityList cities={cities} isLoading={isLoading} />}
          />
          <Route path="cities/:id" element={<City />} />
          <Route
            path="countries"
            element={<CountryList cities={cities} isLoading={isLoading} />}
          />
          <Route path="form" element={<Form />} />
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
