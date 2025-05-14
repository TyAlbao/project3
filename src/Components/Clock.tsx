import { FaPause, FaPlay } from "react-icons/fa";
import useClock from "../Hooks/useClock";
import {
  BsSkipBackwardFill,
  BsSkipEndFill,
  BsSkipForwardFill,
  BsSkipStartFill,
} from "react-icons/bs";
import useTime from "../Hooks/useTime";

const Clock = () => {
  const { svgRef, play, setPlay, setSpeed } = useClock();
  const { minutes, setMinutes, startTime } = useTime();

  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-2xl font-bold">
        <span>{String(Math.floor((minutes + startTime) / 60 + 12) % 12 || 12).padStart(2, "0")}</span> :{" "}
        <span>{String(Math.floor((minutes + startTime) % 60)).padStart(2, "0")}</span>{" "}
        <span>{(minutes + startTime) % 1440 > 720 ? "PM" : "AM"}</span>
      </h1>
      <svg ref={svgRef} />
      <div className="flex gap-2 text-2xl">
        <button
          className="cursor-pointer"
          onClick={() => setSpeed((prev) => (prev > 0.25 ? prev / 2 : prev))}
        >
          <BsSkipBackwardFill />
        </button>
        <button className="cursor-pointer" onClick={() => setMinutes((minutes - 60) % 1440)}>
          <BsSkipStartFill />
        </button>
        <button className="cursor-pointer" onClick={() => setPlay(!play)}>
          {play ? <FaPause /> : <FaPlay />}
        </button>
        <button className="cursor-pointer" onClick={() => setMinutes((minutes + 60) % 1440)}>
          <BsSkipEndFill />
        </button>
        <button
          className="cursor-pointer"
          onClick={() => setSpeed((prev) => (prev < 16 ? prev * 2 : prev))}
        >
          <BsSkipForwardFill />
        </button>
      </div>
    </div>
  );
};

export default Clock;
