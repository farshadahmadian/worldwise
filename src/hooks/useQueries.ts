import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

enum Params {
  LAT = "lat",
  LNG = "lng",
}

function useQueries() {
  const [searchParams] = useSearchParams();
  const lat = searchParams.get(Params.LAT);
  const lng = searchParams.get(Params.LNG);

  return useMemo(() => {
    return { lat, lng };
  }, [lat, lng]);
}

export default useQueries;
