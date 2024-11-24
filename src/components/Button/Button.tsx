import React, { MouseEvent } from "react";

import styles from "./Button.module.css";

type ButtonPropsType = {
  children: React.ReactNode;
  type: string;
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
