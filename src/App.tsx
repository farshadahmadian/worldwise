import { lazy, Suspense } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import { CityContextProvider } from "./contexts/CityContextProvider/CityContextProvider";
import { AuthContextProvider } from "./contexts/FakeAuthContext/AuthContextProvider";

import CityList from "./components/CityList/CityList";
import CountryList from "./components/CountryList/CountryList";
import City from "./components/City/City";
import Form from "./components/Form/Form";
import SpinnerFullPage from "./components/SpinnerFullPage/SpinnerFullPage";

import ProtectedRoute from "./pages/ProtectedRoute/ProtectedRoute";

const AppLayout = lazy(() => import("./pages/AppLayout/AppLayout"));
const Homepage = lazy(() => import("./pages/Homepage/Homepage"));
const Product = lazy(() => import("./pages/Product/Product"));
const Pricing = lazy(() => import("./pages/Pricing/Pricing"));
const PageNotFound = lazy(() => import("./pages/PageNotFound/PageNotFound"));
const Login = lazy(() => import("./pages/Login/Login"));

function App() {
  // to use useLocation() inside App, "BrowserRouter" must wrap "App" in main.tsx.
  const location = useLocation();

  return (
    <AuthContextProvider>
      <CityContextProvider>
        {/* for better performance, instead of one global Suspense with the key attribute which forces Suspense to be unmounted and mounted again, use a Suspense component for each route separately */}
        <Suspense key={location.pathname} fallback={<SpinnerFullPage />}>
          <Routes>
            {/* element means a react element which is a component instant */}
            <Route index element={<Homepage />} />
            {/* <Route /> */}
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
        </Suspense>
      </CityContextProvider>
    </AuthContextProvider>
  );
}

export default App;
