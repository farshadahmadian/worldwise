import { useContext } from "react";
import AuthContext from "./AuthContextProvider";

const useAuthContext = () => {
  const AuthContextValue = useContext(AuthContext);
  if (AuthContextValue === undefined)
    throw new Error(
      "AuthContext is being used by a component that is not a context consumer"
    );
  return AuthContextValue;
};

export default useAuthContext;
