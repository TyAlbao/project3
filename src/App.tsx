import Thermometer from "./Components/Thermometer";
import Clock from "./Components/Clock";
import Mouse from "./Components/Mouse";
import Dashboard from "./Components/Dashboard";
import mouseData from "./Assets/mouse_data.json";
import useTime from "./Hooks/useTime";
import { useDayNight } from "./Hooks/useDayNight";
{
  /*import { useState, useEffect } from "react";*/
}
import {
  BsSkipBackwardFill,
  BsSkipEndFill,
  BsSkipForwardFill,
  BsSkipStartFill,
} from "react-icons/bs";
import { FaPause, FaPlay } from "react-icons/fa";

const App = () => {
  useDayNight();
  const { minutes } = useTime();

  const minutesString = String((Math.floor(minutes) + 1440) % 1440) as keyof typeof mouseData;
  console.log(minutesString);
  const maleTemp = mouseData[minutesString]["male"]["temperature"];
  const femaleTemp = mouseData[minutesString]["female"]["temperature"];
  const maleActivity = mouseData[minutesString]["male"]["activity"];
  const femaleActivity = mouseData[minutesString]["female"]["activity"];

  return (
    <div className="flex flex-col items-center relative min-h-screen overflow-hidden p-10">
      <div className="absolute inset-0 z-0">
        <Mouse speed={maleActivity / 2} gender="male" initialPos={{ x: 500, y: 100 }} />
        <Mouse speed={femaleActivity / 2} gender="female" initialPos={{ x: -500, y: 100 }} />
      </div>

      <div className="flex z-10 w-full">
        <div className="flex-2 flex flex-col items-center border-2 border-gray-400 rounded-lg p-4 h-fit gap-3">
          <h2 className="text-lg font-semibold">Components</h2>
          <ul className="list-disc pl-6 text-sm flex flex-col gap-2">
            <li>
              <strong>Thermometer:</strong> Mean temp per minute.
            </li>
            <li>
              <strong>Bar Plot:</strong> Activity level per mouse.
            </li>
            <li>
              <strong>Animated Mice:</strong> Mean activity over time.
            </li>
          </ul>
        </div>

        <div className="flex-[3] flex flex-col items-center flex-grow text-xl">
          <h1 className="text-2xl font-bold">A Day in the Life of a Mouse</h1>
          <a
            href="https://docs.google.com/document/d/1KPqizMmoEXTw7Z4Lwt1QpBspAC_ESh7OfkJ_49fLLrY/edit?tab=t.0"
            className="text-base mb-6 hover:underline text-blue-500"
            target="_blank"
            rel="noopener noreferrer"
          >
            Writeup
          </a>
          <div className="flex items-center justify-center gap-6 mb-4">
            <Thermometer temp={femaleTemp} gender="female" />
            <Clock />
            <Thermometer temp={maleTemp} gender="male" />
          </div>
          <Dashboard />
        </div>

        <div className="flex-2 flex flex-col items-center border-2 border-gray-400 rounded-lg p-4 h-fit gap-3">
          <h2 className="text-lg font-semibold">Interaction</h2>
          <ul className="text-sm flex flex-col gap-2">
            <li className="flex items-center gap-2">
              <FaPlay />
              <FaPause />
              <span>Start/stop clock.</span>
            </li>
            <li className="flex items-center gap-2">
              <BsSkipStartFill />
              <BsSkipEndFill />
              <span>Move forward/back by one hour.</span>
            </li>
            <li className="flex items-center gap-2">
              <BsSkipBackwardFill />
              <BsSkipForwardFill />
              <span>Speed-up/slow-down the clock.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default App;
