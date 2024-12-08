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
import { CityContextProvider } from "./contexts/CityContextProvider/CityContextProvider";
import { AuthContextProvider } from "./contexts/FakeAuthContext/AuthContextProvider";
import ProtectedRoute from "./pages/ProtectedRoute/ProtectedRoute";

function App() {
  return (
    <AuthContextProvider>
      <CityContextProvider>
        <BrowserRouter>
          <Routes>
            {/* element means a react element which is a component instant */}
            <Route index element={<Homepage />} />
            <Route />
            <Route path="product" element={<Product />} />
            <Route path="pricing" element={<Pricing />} />
            <Route path="login" element={<Login />} />
            <Route
              path="app"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route
                index
                // element={<CityList cities={cities} isLoading={isLoading} />}
                element={<Navigate replace to="cities" />}
              />
              <Route path="cities" element={<CityList />} />
              <Route path="cities/:id" element={<City />} />
              <Route path="countries" element={<CountryList />} />
              <Route path="form" element={<Form />} />
            </Route>
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>
      </CityContextProvider>
    </AuthContextProvider>
  );
}

export default App;
