import { useEffect } from "react";
import useStore from "./useStore";

export const useDayNight = () => {
  const { minutes, startTime } = useStore();

  useEffect(() => {
    const currentHour = (minutes / 60) % 24;
    const isNight = currentHour >= startTime || currentHour < (startTime + 12) % 24;
    document.body.style.backgroundColor = isNight ? "#1D232A" : "#FFFFFF";
    document.body.style.color = isNight ? "#FFFFFF" : "#000000";
    document.body.style.transition = "background-color 0.5s, color 0.5s";
  }, [minutes]);
};
