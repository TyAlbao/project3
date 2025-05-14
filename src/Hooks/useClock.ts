import { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import useTime from "./useTime";

const useClock = () => {
  const { minutes, setMinutes, startTime, play } = useTime();
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
  }, [play, speed, minutes, setMinutes]);

  useEffect(() => {
    const radius = 130;
    const svg = d3
      .select(svgRef.current)
      .attr("width", radius * 2)
      .attr("height", radius * 2)
      .attr("viewBox", `0 0 ${radius * 2 + 10} ${radius * 2 + 10}`)
      .append("g")
      .attr("transform", `translate(${radius + 5}, ${radius + 5})`);

    svg.append("circle").attr("r", radius).attr("fill", "#f0f0f0").attr("stroke", "#333");

    const arc = d3.arc<d3.DefaultArcObject>()
      .innerRadius(radius + 20)
      .outerRadius(radius + 10)
      .startAngle(Math.PI / 6)
      .endAngle(Math.PI / 3);

    svg.append("path")
      .attr("d", arc({
        innerRadius: radius + 20,
        outerRadius: radius + 10,
        startAngle: Math.PI / 6,
        endAngle: Math.PI / 3
      }))
      .attr("fill", "#666")
      .attr("cursor", "pointer");
    
    const symbol = d3.symbol()
      .type(d3.symbolTriangle)
      .size(200);

    svg.append("path")
      .attr("d", symbol)
      .attr("fill", "#666")
      .attr("transform", `translate(${(radius + 15) * Math.sqrt(3) / 2}, ${-(radius + 15) * 1 / 2}) rotate(30)`);

    const calculateAngle = ({ x, y }: { x: number; y: number }) => Math.atan2(y, x);

    const drag = d3
      .drag()
      .on("start", (event) => {
        initialAngleRef.current = calculateAngle(event);
        initialMinutesRef.current = minutes;
      })
      .on("drag", (event) => {
        const newAngle = calculateAngle(event);
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
      .attr("r", radius)
      .attr("fill", "transparent")
      .attr("cursor", "pointer")
      .call(drag as unknown as d3.DragBehavior<SVGCircleElement, unknown, unknown>);

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

    const svgElement = svgRef.current;
    return () => {
      d3.select(svgElement).selectAll("*").remove();
    };
  }, [minutes, setMinutes, speed, startTime]);

  return { svgRef, speed, setSpeed };
};

export default useClock;
