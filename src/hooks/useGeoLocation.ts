import { useState } from "react";

type PositionType = {
  lat: number;
  lng: number;
};

function useGeoLocation(defaultPosition: PositionType | null = null) {
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState<PositionType | null>(
    defaultPosition
  );
  const [error, setError] = useState<string | null>(null);

  function getPosition() {
    if (!navigator.geolocation)
      return setError("Your browser does not support geolocation!");

    setIsLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      position => {
        setPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsLoading(false);
      },
      error => {
        setError(error.message);
        setIsLoading(false);
      }
    );
  }

  return { isLoading, position, error, getPosition };
}

export default useGeoLocation;
