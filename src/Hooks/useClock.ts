import { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import useStore from "./useStore";

const useClock = () => {
  const { minutes, setMinutes, startTime } = useStore();
  const [play, setPlay] = useState(false);
  const [speed, setSpeed] = useState(2);

  const svgRef = useRef(null);
  const initialAngleRef = useRef(0);
  const initialMinutesRef = useRef(0);
  const draggingRef = useRef(false);

  useEffect(() => {
    if (!play) return;

    const interval = setInterval(() => {
      setMinutes((minutes + speed) % 1440);
    }, 1000 / 60);

    return () => clearInterval(interval);
  }, [play, speed, minutes]);

  useEffect(() => {
    const radius = 150;
    const svg = d3
      .select(svgRef.current)
      .attr("width", radius * 2)
      .attr("height", radius * 2)
      .attr("viewBox", `0 0 ${radius * 2} ${radius * 2}`)
      .append("g")
      .attr("transform", `translate(${radius}, ${radius})`);

    svg.append("circle").attr("r", radius).attr("fill", "#f0f0f0").attr("stroke", "#333");

    const calculateAngle = ({ x, y }: { x: number; y: number }) => Math.atan2(y, x);

    const drag = d3
      .drag()
      .on("start", (event) => {
        initialAngleRef.current = calculateAngle(event);
        initialMinutesRef.current = minutes;
      })
      .on("drag", (event) => {
        const newAngle = calculateAngle({
          x: event.x - radius * Number(draggingRef.current),
          y: event.y - radius * Number(draggingRef.current),
        });
        const adjustedAngle = newAngle - initialAngleRef.current;
        const newMinutes = Math.floor((adjustedAngle / (2 * Math.PI)) * 1440 * speed);
        draggingRef.current = true;

        setMinutes((initialMinutesRef.current + newMinutes) % 1440);
      })
      .on("end", () => {
        draggingRef.current = false;
      });

    svg
      .append("circle")
      .attr("r", radius - 10)
      .attr("fill", "transparent")
      .attr("cursor", "pointer")
      .call(drag as any);

    const updateClock = () => {
      const hourAngle = ((minutes + startTime) / 60 / 12) * 360;
      const minuteAngle = (((minutes + startTime) % 60) / 60) * 360;

      svg.selectAll(".hour-hand").remove();
      svg.selectAll(".minute-hand").remove();

      svg
        .append("line")
        .attr("class", "hour-hand")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", 0)
        .attr("y2", -radius / 2)
        .attr("stroke", "#333")
        .attr("stroke-width", 4)
        .attr("transform", `rotate(${hourAngle})`);

      svg
        .append("line")
        .attr("class", "minute-hand")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", 0)
        .attr("y2", -radius * 0.75)
        .attr("stroke", "#333")
        .attr("stroke-width", 2)
        .attr("transform", `rotate(${minuteAngle})`);
    };

    updateClock();

    return () => {
      d3.select(svgRef.current).selectAll("*").remove();
    };
  }, [minutes]);

  return { svgRef, play, setPlay, speed, setSpeed };
};

export default useClock;
