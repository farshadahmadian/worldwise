import React, { createContext, Reducer, useReducer } from "react";

type UserType = {
  email: string;
  name: string;
  password: string;
  avatar?: string;
};

type ActionReducerType = "login" | "logout";

interface IState {
  user: UserType | null;
  isAuthenticated: boolean;
}

type ActionType = { type: ActionReducerType; payload?: UserType };

const initialState: IState = {
  user: null,
  isAuthenticated: false,
};

type DefaultAuthType = {
  state: IState;
  login: (email: string, password: string) => void;
  logout: () => void;
};

const defaultAuth: DefaultAuthType = {
  state: initialState,
  login: () => {},
  logout: () => {},
};

const AuthContext = createContext(defaultAuth);

type AuthContextProviderPropsType = {
  children: React.ReactNode;
};

function reducer(prevState: IState, action: ActionType): IState {
  const { type, payload = null } = action;

  switch (type) {
    case "login":
      return { ...prevState, user: payload, isAuthenticated: true };
    case "logout":
      return { ...prevState, user: null, isAuthenticated: false };
    default: {
      const exhaustiveCheck: never = type;
      throw new Error(`Unhandled action type ${exhaustiveCheck}`);
    }
  }
  return prevState;
}

const FAKE_USER: UserType = {
  name: "Jack",
  email: "jack@example.com",
  password: "qwerty",
  avatar: "https://i.pravatar.cc/100?u=zz",
};

export function AuthContextProvider({
  children,
}: AuthContextProviderPropsType) {
  const [state, dispatch] = useReducer<Reducer<IState, ActionType>>(
    reducer,
    initialState
  );

  // const { user, isAuthenticated } = state;

  function login(email: string, password: string) {
    if (email === FAKE_USER.email && password === FAKE_USER.password) {
      dispatch({ type: "login", payload: FAKE_USER });
      return true;
    }
    return false;
  }

  function logout() {
    dispatch({ type: "logout" });
  }

  return (
    <AuthContext.Provider value={{ state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
