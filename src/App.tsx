import Thermometer from "./Components/Thermometer";
import Clock from "./Components/Clock";
import Mouse from "./Components/Mouse";
import Dashboard from "./Components/Dashboard";
import mouseData from "./Assets/mouse_data.json";
import useStore from "./Hooks/useStore";
import { useDayNight } from "./Hooks/useDayNight";
{/*import { useState, useEffect } from "react";*/}
import {
  BsSkipBackwardFill,
  BsSkipEndFill,
  BsSkipForwardFill,
  BsSkipStartFill,
} from "react-icons/bs";
import { FaPause, FaPlay } from "react-icons/fa";

const App = () => {
  useDayNight();
  let { minutes } = useStore();
  minutes = Math.floor(minutes);

  const maleTemp = mouseData[minutes as keyof typeof mouseData]["male"]["temperature"];
  const femaleTemp = mouseData[minutes as keyof typeof mouseData]["female"]["temperature"];
  const maleActivity = mouseData[minutes as keyof typeof mouseData]["male"]["activity"];
  const femaleActivity = mouseData[minutes as keyof typeof mouseData]["female"]["activity"];

  return (
  <div className="flex flex-col items-center relative min-h-screen overflow-hidden">
    <div className="absolute inset-0 z-0">
      <Mouse speed={maleActivity} gender="male" />
      <Mouse speed={femaleActivity} gender="female" />
    </div>
    <div className="relative z-10 flex flex-col items-center w-full">
      {/* Outer wrapper to center content */}
      <div className="flex justify-center w-full">
        <div className="flex flex-row max-w-7xl w-full px-8 gap-x-16 mt-6">
          {/* Left side: legend and description */}
          <div className="w-1/3 pl-6 text-xl"> {/* Increased font size */}
            {/* Legend */}
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-3">Legend</h2> {/* Increased font size */}
              <div className="flex items-center mb-2">
                <div className="w-4 h-4 mr-3" style={{ backgroundColor: "#e56997" }}></div>
                <span>Female Mice</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 mr-3" style={{ backgroundColor: "#4f83c4" }}></div>
                <span>Male Mice</span>
              </div>
            </div>

            {/* Components */}
            <div>
              <h2 className="text-2xl font-semibold mb-3">Components</h2> {/* Increased font size */}
              <p className="text-lg leading-relaxed"> {/* Increased font size */}
                <ul className="list-disc pl-6">
                  <li className="text-xl">
                    Thermometers: mean temperature of males and females at current minute.
                  </li>
                  <li className="text-xl">
                    Bar plots: activity level of all males and females.
                  </li>
                  <li className="text-xl">
                    Mice clipart: animated mice moving at mean activity level at current minute.
                  </li>
                </ul>
              </p>
            </div>

            <div className="mb-6" />

            {/* Interaction */}
            <div>
              <h2 className="text-2xl font-semibold mb-3">Interaction</h2> {/* Increased font size */}
              <p className="text-lg leading-relaxed"> {/* Increased font size */}
                <ul>
                  <li className="text-xl">
                    <FaPlay className="inline-block mr-2" />
                    <FaPause className="inline-block mr-2" />
                    Start/stop clock.
                  </li>
                  <li className="text-xl">
                    <BsSkipStartFill className="inline-block mr-2" />
                    <BsSkipEndFill className="inline-block mr-2" />
                    Fast-forward/backward by one hour.
                  </li>
                  <li className="text-xl">
                    <BsSkipBackwardFill className="inline-block mr-2" />
                    <BsSkipForwardFill className="inline-block mr-2" />
                    Speed-up/slow-down the clock.
                  </li>
                </ul>
              </p>
            </div>
          </div>

          {/* Right side: visual dashboard */}
          <div className="flex flex-col items-center flex-grow text-xl"> {/* Increased font size */}
            {/* Title at the top of the visualization */}
            <h1 className="text-3xl font-bold mb-6">
              Temperature and Activity of Mice Over Time
            </h1> {/* Added title */}

            <div className="flex items-center justify-center gap-6 mb-4">
              <Thermometer temp={femaleTemp} gender="female" />
              <Clock />
              <Thermometer temp={maleTemp} gender="male" />
            </div>
            <Dashboard />
            <div className="absolute inset-0 z-0">
              <Mouse speed={maleActivity / 2} gender="male" />
              <Mouse speed={femaleActivity / 2} gender="female" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

  
};

export default App;
