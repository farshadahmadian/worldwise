import { FormEvent, useEffect, useState } from "react";
import styles from "./Login.module.css";
import PageNav from "../../components/PageNav/PageNav";
import useAuthContext from "../../contexts/FakeAuthContext/useAuthContext";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";

function Login() {
  // PRE-FILL FOR DEV PURPOSES
  const [email, setEmail] = useState("jack@example.com");
  const [password, setPassword] = useState("qwerty");
  const navigate = useNavigate();
  const { login, state } = useAuthContext();
  const { isAuthenticated } = state;

  function submitHandler(event: FormEvent) {
    event.preventDefault();
    if (email && password) login(email, password);
  }

  useEffect(() => {
    /* 
    replace:
    / => /login => /app: all the 3 routes must be added to the route history stack, but replace: true replaces /login with /app so the route history stack will be: / => /app
    */
    if (isAuthenticated) navigate("/app", { replace: true });
  }, [isAuthenticated, navigate]);

  // if a logged in user clicks on the "LOGIN" button, first the "Login" page will render for a moment and then the user will be redirected to /app. To avoid this, return null if the user is already logged in
  if (isAuthenticated) return null;

  return (
    <main className={styles.login}>
      <PageNav />
      <form className={styles.form} onSubmit={submitHandler}>
        <div className={styles.row}>
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            onChange={e => setEmail(e.target.value)}
            value={email}
          />
        </div>

        <div className={styles.row}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            onChange={e => setPassword(e.target.value)}
            value={password}
          />
        </div>

        <div>
          <Button type="primary" onClick={() => {}}>
            Login
          </Button>
        </div>
      </form>
    </main>
  );
}

export default Login;
