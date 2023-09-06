import React, { ReactNode, useEffect, useRef, useState } from "react";

type TimerStateType = "init" | "running" | "paused" | "completed";

const DEFAULT_UPDATE_INTERVAL = 50;
const DEFAULT_SETTINGS = {
  autostart_next_phase: false,
};

const Timer = () => {
  const intervalIdRef = useRef<number>(0);
  const totalTimeRef = useRef<number>(0);
  const elapsedTimeRef = useRef<number>(0);
  const latestResumeTimeRef = useRef<number>(0);

  const inputRef = useRef<HTMLInputElement>(null);

  const [phaseList, setPhaseList] = useState<number[]>([]);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [phase, setPhase] = useState<number>(0);

  const [resultTime, setResultTime] = useState<number>(0);
  const [timerState, setTimerState] = useState<TimerStateType>("init");

  useEffect(() => {
    console.log("useEffect");
    if (phase < phaseList.length) {
      setupTimer();
      if (settings.autostart_next_phase && phase > 0) {
        startTimer();
      }
    }
  }, [phase, phaseList]);

  const setupTimer = () => {
    console.log("Setup Timer", phaseList[phase]);
    totalTimeRef.current = phaseList[phase];
    setResultTime(totalTimeRef.current);
    setTimerState("init");
  };

  const addPhase = () => {
    const val = inputRef.current?.value
      ? parseInt(inputRef.current?.value)
      : null;
    if (val) setPhaseList([...phaseList, val]);
  };

  const handleComplete = () => {
    clearInterval(intervalIdRef.current);
    setTimerState("completed");

    console.log("Completed", phase);
    setPhase(phase + 1);
  };

  const updateTimer = () => {
    console.log(resultTime);
    const curElapsedTime = Date.now() - latestResumeTimeRef.current;
    const totalElapsedTime = elapsedTimeRef.current + curElapsedTime;
    const timeLeft = totalTimeRef.current - totalElapsedTime;
    const newResultTime = timeLeft <= 999 ? 0 : timeLeft;
    setResultTime(newResultTime);

    if (newResultTime <= 0) handleComplete();
  };

  const startTimer = () => {
    clearInterval(intervalIdRef.current);
    latestResumeTimeRef.current = Date.now();
    intervalIdRef.current = setInterval(updateTimer, DEFAULT_UPDATE_INTERVAL);
    setTimerState("running");
  };

  const pauseTimer = () => {
    console.log("pauseTimer")
    clearInterval(intervalIdRef.current);
    const curElapsedTime = Date.now() - latestResumeTimeRef.current;
    elapsedTimeRef.current += curElapsedTime;
    setTimerState("paused");
  };

  const resumeTimer = () => {
    latestResumeTimeRef.current = Date.now();
    intervalIdRef.current = setInterval(updateTimer, DEFAULT_UPDATE_INTERVAL);
    setTimerState("running");
  };

  const resetTimer = () => {
    clearInterval(intervalIdRef.current);
    intervalIdRef.current = 0;
    totalTimeRef.current = 0;
    elapsedTimeRef.current = 0;
    latestResumeTimeRef.current = 0;

    setTimerState("init");
    setResultTime(0);
  };

  const transform = (t: number) => {
    let seconds = t / 1000;
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    seconds = Math.floor((seconds % 3600) % 60);

    return `${hours.toString().padStart(2, "0")} : ${mins
      .toString()
      .padStart(2, "0")} : ${seconds.toString().padStart(2, "0")}`;
  };

  const StartButton =
    <button className="block border rounded-full shadow-sm font-bold py-2 px-4 focus:outline-none focus:ring focus:ring-opacity-50 bg-indigo-500 hover:bg-indigo-700 text-white border-transparent focus:border-indigo-300 focus:ring-indigo-200 m-2" onClick={startTimer}>
      Start
    </button>;

  const ResumeButton =
    <button className="block border rounded-full shadow-sm font-bold py-2 px-4 focus:outline-none focus:ring focus:ring-opacity-50 bg-indigo-500 hover:bg-indigo-700 text-white border-transparent focus:border-indigo-300 focus:ring-indigo-200 m-2" onClick={resumeTimer}>
      Resume
    </button>;


  const PauseButton =
    <button className="block border rounded-full shadow-sm font-bold py-2 px-4 focus:outline-none focus:ring focus:ring-opacity-50 bg-indigo-500 hover:bg-indigo-700 text-white border-transparent focus:border-indigo-300 focus:ring-indigo-200 m-2" onClick={pauseTimer}>
      Pause
    </button>;

  const ResetButton =
    <button className="block border rounded-full shadow-sm font-bold py-2 px-4 focus:outline-none focus:ring focus:ring-opacity-50 bg-indigo-500 hover:bg-indigo-700 text-white border-transparent focus:border-indigo-300 focus:ring-indigo-200 m-2" onClick={resetTimer}>
      Reset
    </button>;

  return (
    <div className="w-96 flex flex-col items-center p-2 bg-slate-700 rounded-2xl">
      <div className="w-[100%] h-[150px] flex justify-center items-center bg-slate-500 rounded-2xl m-2 my-1">
        <h1 className="text-6xl text-white font-bold">{transform(resultTime)}</h1>
      </div>
      <div className="w-[100%] h-20 flex justify-center items-center bg-slate-500 rounded-2xl m-2 my-1">
        {timerState === "init" && StartButton}
        {timerState === "paused" && ResumeButton}
        {timerState === "running" && PauseButton}
        {timerState !== "init" && ResetButton}
        {timerState}
        {/* <StartButton />
        <ResumeButton />
        <PauseButton />
        <ResetButton /> */}
      </div>
      <div className="w-[100%] h-20 flex justify-center items-center bg-slate-500 rounded-2xl m-2 my-1">
        <input ref={inputRef} className="px-4 py-1 text-gray-800 rounded-full focus:outline-none"
          placeholder="mins" />
        <button className="block border rounded-full shadow-sm font-bold py-2 px-4 focus:outline-none focus:ring focus:ring-opacity-50 bg-indigo-500 hover:bg-indigo-700 text-white border-transparent focus:border-indigo-300 focus:ring-indigo-200 m-2" onClick={addPhase}>
          Add Phase
        </button>

      </div>

    </div>


  );
};

export default Timer;
