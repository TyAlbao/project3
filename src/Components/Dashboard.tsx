import { useEffect, useState } from "react";
import * as d3 from "d3";
import "../index.css";
import useStore from "../Hooks/useStore"
import { useDayNight } from "../Hooks/useDayNight";

interface MouseSeries {
  id: string;
  sex: "f" | "m";
  values: number[];
}


function MouseDashboard() {
  const [series, setSeries] = useState<MouseSeries[]>([]);
  const { minutes } = useStore();
  const { isNight } = useDayNight();

  useEffect(() => {
    d3.csv("../../Checkpoint/mouse_data.csv").then((rows) => {
      const activityCols = rows.columns!.filter((col) => col.endsWith("_act"));

      const parsed: MouseSeries[] = activityCols.map((col) => {
        const id = col.replace("_act", "");
        const sex  = id.startsWith("f") ? "f" : "m";
        const values = rows.map((row) => +row[col]);
        return { id, sex, values };
      });

      setSeries(parsed);
    });
  }, []);

  const females = series.filter((s) => s.sex === "f");
  const males = series.filter((s) => s.sex === "m");

  const allValues = series.flatMap((s) => s.values);
  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(allValues) ?? 0])
    .nice();

  const plot = (subset: MouseSeries[], width: number, height: number) => {
    const mouse = { top: 60, right: 50, bottom: 40, left: 50 };
    const innerHeight = height - mouse.top - mouse.bottom;

    const xScale = d3
      .scaleBand<string>()
      .domain(subset.map((s) => s.id))
      .range([mouse.left, width - mouse.right])
      .padding(0.1);

    yScale.range([innerHeight + mouse.top, mouse.top]);

    const textColor = isNight ? "#FFFFFF" : "#000000";

    return (
      <svg width={width} height={height} className="mouse-chart mt-6" key={subset[0]?.sex}>
        <g
          ref={(g) => {
            if (g) {
              d3.select(g).call(d3.axisLeft(yScale).ticks(5));
            }
          }}
          transform={`translate(${mouse.left},0)`}
        />
        <g
          ref={(g)=> {
            if (g) {
              d3.select(g).call(d3.axisBottom(xScale).tickSizeOuter(0));
            }
          }}
          transform={`translate(0,${innerHeight + mouse.top})`}
        />

        <text
          x={width / 2}
          y={mouse.top / 2}
          textAnchor="middle"
          className="text-lg font-bold"
          style={{
            transition: "color 0.5s",
            fill: textColor,
          }}
        >
          {subset[0]?.sex === "f" ? "Female Mouse Activity" : "Male Mouse Activity"}
        </text>

        <text
          transform={`rotate(-90)`}
          x={- (height / 2)}
          y={mouse.left -35}
          textAnchor="middle"
          className="text-md font-regular"
          style={{
            transition: "color 0.5s",
            fill: textColor,
          }}
        >
          Activity Level
        </text>

        <text
          x={width / 2}
          y={height - 6}
          textAnchor="middle"
          className="text-md font-regular"    
          style={{
            transition: "color 0.5s",
            fill: textColor,
          }}   
        >
          Mouse ID
        </text>

        {subset.map((s) => {
          const idx = Math.floor(minutes) % s.values.length;
          const values = s.values[idx];
          const x = xScale(s.id)!;
          const y = yScale(values);
          const barHeight = yScale(0) - y;
          const color  = s.sex === "f" ? "#e56997" : "#4f83c4";

          return (
            <rect
              key={s.id}
              x={x}
              y={y}
              width={xScale.bandwidth()}
              height={barHeight}
              fill={color}
            />
          );
        })}
      </svg>
    );
  };


  const height = 350;
  const width  = 350;

  return (
    <div className="flex justify-center items-center">
      {plot(females, width, height)}
      {plot(males, width, height)}
    </div>
  );
}

export default MouseDashboard;