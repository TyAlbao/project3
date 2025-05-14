import { useEffect, useState } from "react";
import useTime from "./useTime";

export const useDayNight = () => {
  const { minutes, startTime } = useTime();
  const [isNight, setIsNight] = useState(true);

  useEffect(() => {
    const currentHour = (minutes / 60) % 24;
    setIsNight(currentHour >= startTime || currentHour < (startTime + 12) % 24);
    document.body.style.backgroundColor = isNight ? "#1D232A" : "#FFFFFF";
    document.body.style.color = isNight ? "#FFFFFF" : "#000000";
    document.body.style.transition = "background-color 0.5s, color 0.5s";
  }, [minutes]);

  return { isNight };
};
