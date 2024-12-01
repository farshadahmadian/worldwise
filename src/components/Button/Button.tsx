import React, { MouseEvent } from "react";

import styles from "./Button.module.css";

export type ButtonPropsType = {
  children: React.ReactNode;
  type: "primary" | "back" | "position";
  onClick: (event: MouseEvent) => void;
};

function Button({ children, type, onClick }: ButtonPropsType) {
  return (
    <button className={`${styles.btn} ${styles[type]}`} onClick={onClick}>
      {children}
    </button>
  );
}

export default Button;
