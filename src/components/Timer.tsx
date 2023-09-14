import { useEffect, useRef, useState } from "react";
import { ArrowUturnRightIcon, PlayIcon, PauseIcon, ForwardIcon, ArrowPathIcon, PlusIcon } from '@heroicons/react/24/solid';
import { DEFAULT_SETTINGS, DEFAULT_UPDATE_INTERVAL } from '../config/constants';
import TimeDisplay from './TimeDisplay';

type TimerStateType = "init" | "running" | "paused" | "completed";

const Timer = () => {
  const intervalIdRef = useRef<number>(0);
  const totalTimeRef = useRef<number>(0);
  const elapsedTimeRef = useRef<number>(0);
  const latestResumeTimeRef = useRef<number>(0);
  const firstStart = useRef<boolean>(true);
  const inputRef = useRef<HTMLInputElement>(null);

  const [phaseList, setPhaseList] = useState<number[]>(DEFAULT_SETTINGS.phase_list);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [phase, setPhase] = useState<number>(0);
  const [resultTime, setResultTime] = useState<number>(0);
  const [timerState, setTimerState] = useState<TimerStateType>("init");

  useEffect(() => {
    console.log("useEffect");
    if (phase < phaseList.length) {
      setupTimer();
      if (settings.autostart_next_phase && !firstStart.current) {
        startTimer();
      }
    } else if (settings.loop) {
      setPhase(0);
    }
  }, [phase, phaseList]);

  const setupTimer = () => {
    console.log("Setup Timer", phaseList[phase]);
    totalTimeRef.current = phaseList[phase];
    setResultTime(totalTimeRef.current);
    setTimerState("init");
  };

  const handlePhaseInput = () => {
    const val = inputRef.current?.value
      ? parseInt(inputRef.current.value) * 1000
      : null;
    if (val) setPhaseList([...phaseList, val]);
    if (inputRef.current?.value) inputRef.current.value = '';

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
    if (!phaseList.length) return;
    if (firstStart.current) firstStart.current = false;

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
    firstStart.current = true;
    intervalIdRef.current = 0;
    totalTimeRef.current = 0;
    elapsedTimeRef.current = 0;
    latestResumeTimeRef.current = 0;

    setTimerState("init");
    setPhase(0);
    setResultTime(0);
  };


  const startButton =
    <button className="group action-btn bg-green-600 active:bg-green-700 focus:ring-green-200" onClick={startTimer}>
      <PlayIcon className="action-btn-icon ml-1 mr-[-0.25rem]" />
    </button >;

  const resumeButton =
    <button className="group action-btn bg-green-600 active:bg-green-700 focus:ring-green-200" onClick={resumeTimer}>
      <PlayIcon className="action-btn-icon ml-1 mr-[-0.25rem]" />
    </button>;


  const pauseButton =
    <button className="group action-btn bg-yellow-600 active:bg-yellow-700 focus:ring-yellow-200" onClick={pauseTimer}>
      <PauseIcon className="action-button-icon" />
    </button>;

  const resetButton =
    <button className="group action-btn bg-cyan-600 active:bg-cyan-700 focus:ring-cyan-200" onClick={resetTimer}>
      <ArrowPathIcon className="action-btn-icon" />
    </button>;

  const autoNextToggle = <button className={`group ${settings.autostart_next_phase ? 'toggle-btn-on' : 'toggle-btn-off'}`} onClick={() => setSettings(prev => ({ ...prev, autostart_next_phase: !prev.autostart_next_phase }))}>
    <ForwardIcon className="toggle-btn-icon" />
  </button >;

  const loopToggle = <button className={`group ${settings.loop ? 'toggle-btn-on' : 'toggle-btn-off'}`} onClick={() => setSettings(prev => ({ ...prev, loop: !prev.loop }))}>
    <ArrowUturnRightIcon className="toggle-btn-icon rotate-180" />
  </button >;

  return (
    <div className="lg:w-[85%] md:w-[95%] sm:w-[98%] w-[35rem]flex flex-col items-center p-2">
      <TimeDisplay time={resultTime} />
      <div className="w-[100%] min-h-24 rounded-2xl flex flex-wrap justify-center items-center md:px-4 sm:px-10 px-10 m-1">
          {phaseList.map((p, i) => (
            <div key={i} className="flex items-center" onClick={() => setPhaseList(prev => prev.filter((p, idx) => idx !== i))}>
              <div className={`${i === phase ? "phase-active" : "phase-inactive"}`}>
                <p className="text-white ">{Math.round(p / 1000)}</p>
              </div>
              <p className="text-slate-200 font-bold"><ForwardIcon className="w-4 h-4" /> </p>
            </div>
          ))}
          {phaseList.length ? <div className="flex items-center">{loopToggle}</div> : null}
        </div>

      <div className="w-[100%] h-40 flex justify-center items-center rounded-2xl m-2 my-1">
        {timerState === "init" && startButton}
        {timerState === "paused" && resumeButton}
        {timerState === "running" && pauseButton}
        {timerState !== "init" && resetButton}
      </div>

      <div className="w-[100%] flex flex-col justify-center items-center">
        <div className="flex">
          {autoNextToggle}
          {loopToggle}
        </div>

        <div className="flex justify-center items-center my-2">

          <div className="flex">
            {settings.quick_phases.map((qp, i) => (
              <div key={i} className="flex items-center" onClick={() => setPhaseList(prev => [...prev, qp * 1000])}>
                <div className="w-10 h-10 flex justify-center items-center p-2 m-2 bg-yellow-500 rounded-full">
                  <p className="text-white font-bold">{qp}</p>
                </div>
              </div>
            ))}
          </div>

          <input ref={inputRef} className="z-10 w-16 h-16 text-center text-gray-800 rounded-full focus:outline-none"
            placeholder="seconds" />
          <button className="z-9 w-12 h-10 block border rounded-r-xl shadow-sm font-bold text-2xl  px-2 focus:outline-none focus:ring focus:ring-opacity-50 bg-violet-500 hover:bg-violet-700 text-white border-transparent focus:border-violet-300 focus:ring-indigo-200 ml-[-0.8rem] mr-2 mt-2 mb-2" onClick={handlePhaseInput}>
            <PlusIcon className="ml-2 w-6 h-6" />
          </button>
        </div>

        

      </div>
    </div>
  );
};

export default Timer;
