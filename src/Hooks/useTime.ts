import { create } from "zustand";

interface TimeProps {
  play: boolean;
  minutes: number;
  startTime: number;
  setMinutes: (minutes: number) => void;
  setPlay: (play: boolean) => void;
}

const useTime = create<TimeProps>((set) => ({
  play: false,
  minutes: 0,
  startTime: 60 * 18,
  setMinutes: (minutes: number | ((prev: number) => number)) => {
    if (typeof minutes === "function") {
      set((state) => ({ minutes: minutes(state.minutes) }));
    } else {
      set({ minutes });
    }
  },
  setPlay: (play: boolean | ((prev: boolean) => boolean)) => {
    if (typeof play === "function") {
      set((state) => ({ play: play(state.play) }));
    } else {
      set({ play });
    }
  },
}));

export default useTime;
