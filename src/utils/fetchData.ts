// import { CityType } from "../contexts/CityContextProvider/CityContextProvider";

// export const fetchData = async function (
//   controller: AbortController,
//   url: string,
//   setState:
//     | React.Dispatch<React.SetStateAction<CityType | null>>
//     | React.Dispatch<React.SetStateAction<CityType[]>>,
//   setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
//   rejectValue: Promise<[]> | Promise<null>
// ) {
//   try {
//     const response = await fetch(url, {
//       signal: controller.signal,
//     });
//     const data = await response.json();
//     setState(data);
//     // if (!data.length) throw new Error("Data not available");
//     setIsLoading(false);
//     return data;
//   } catch (error) {
//     if (error instanceof Error && error.name === "AbortError") {
//       // setIsLoading(false);
//       return rejectValue;
//     } else if (error instanceof Error && error.name !== "AbortError")
//       console.error(error.message);
//     else console.error(error);
//     setIsLoading(false);
//     return rejectValue;
//   }
// };

export const fetchData = async function <T>(
  controller: AbortController,
  url: string,
  setState: React.Dispatch<React.SetStateAction<T>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  rejectValue: Promise<[]> | Promise<null>
): Promise<T | [] | null> {
  try {
    setIsLoading(true);
    const response = await fetch(url, {
      signal: controller.signal,
    });
    // const data = (await response.json()) as T;
    const data: T = await response.json();
    setState(data);
    setIsLoading(false);
    return data;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return rejectValue;
    } else if (error instanceof Error && error.name !== "AbortError") {
      console.error(error.message);
    } else {
      console.error(error);
    }
    setIsLoading(false);
    return rejectValue;
  }
};
