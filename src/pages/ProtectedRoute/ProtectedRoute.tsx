import { ReactNode, useEffect } from "react";
import useAuthContext from "../../contexts/FakeAuthContext/useAuthContext";
import { useNavigate } from "react-router-dom";

type ProtectedRoutePropsType = {
  children: ReactNode;
};

function ProtectedRoute({ children }: ProtectedRoutePropsType) {
  const {
    state: { isAuthenticated },
  } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    // navigate() is a side effect => useEffect(()=>{})
    // navigate() must be used in a Route component, so ProtectedRoute must be a Route component or be rendered inside a Route component: (1) inside the AppLayout where the application is rendered (2)inside the App component, <Route        path="app" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
    if (!isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);

  return isAuthenticated ? children : null;
}

export default ProtectedRoute;
