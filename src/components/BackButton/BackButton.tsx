import { MouseEvent } from "react";
import Button from "../Button/Button";
import { useNavigate } from "react-router-dom";

function BackButton() {
  const navigate = useNavigate();
  return (
    <Button
      type="back"
      onClick={(event: MouseEvent) => {
        event.preventDefault();
        navigate(-1);
      }}
    >
      &larr; Back
    </Button>
  );
}

export default BackButton;
