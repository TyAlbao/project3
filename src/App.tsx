import Thermometer from "./Components/Thermometer";
import Clock from "./Components/Clock";
import Mouse from "./Components/Mouse";
import Dashboard from "./Components/Dashboard";
import mouseData from "./Assets/mouse_data.json";
import useStore from "./Hooks/useStore";
import { useDayNight } from "./Hooks/useDayNight";

const App = () => {
  useDayNight();
  const { minutes } = useStore();

  const minutesString = String(Math.floor(minutes)) as keyof typeof mouseData;
  const maleTemp = mouseData[minutesString]["male"]["temperature"];
  const femaleTemp = mouseData[minutesString]["female"]["temperature"];
  const maleActivity = mouseData[minutesString]["male"]["activity"];
  const femaleActivity = mouseData[minutesString]["female"]["activity"];

  return (
    <div className="flex flex-col items-center relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Mouse speed={maleActivity / 2} gender="male" />
        <Mouse speed={femaleActivity / 2} gender="female" />
      </div>
      <div className="relative z-10 flex flex-col items-center w-full">
        <div className="flex items-center justify-center gap-4">
          <Thermometer temp={femaleTemp} gender="female" />
          <Clock />
          <Thermometer temp={maleTemp} gender="male" />
        </div>
        <Dashboard />
      </div>
    </div>
  );
};

export default App;
