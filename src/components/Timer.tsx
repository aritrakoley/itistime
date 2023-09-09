import { useEffect, useRef, useState } from "react";
import { ArrowUturnRightIcon, PlayIcon, PauseIcon, StopIcon, ArrowPathIcon } from '@heroicons/react/24/solid';
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

  const [phaseList, setPhaseList] = useState<number[]>([]);
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


  const StartButton =
    <button className="group action-btn bg-green-600 active:bg-green-700 focus:ring-green-200" onClick={startTimer}>
      <PlayIcon className="action-button-icon ml-1 mr-[-0.25rem] w-20 h-20" />
    </button >;

  const ResumeButton =
    <button className="group action-btn bg-green-600 active:bg-green-700 focus:ring-green-200" onClick={resumeTimer}>
      <PlayIcon className="action-button-icon ml-1 mr-[-0.25rem] w-20 h-20" />
    </button>;


  const PauseButton =
    <button className="group action-btn bg-yellow-600 active:bg-yellow-700 focus:ring-yellow-200" onClick={pauseTimer}>
      <PauseIcon className="action-button-icon w-20 h-20" />
    </button>;

  const ResetButton =
    <button className="group action-btn bg-cyan-600 active:bg-cyan-700 focus:ring-cyan-200" onClick={resetTimer}>
      <ArrowPathIcon className="action-button-icon w-20 h-20" />
    </button>;

  return (
    <div className="lg:w-[85%] md:w-[95%] sm:w-[98%] w-[35rem] flex flex-col items-center p-2">
      <TimeDisplay time={resultTime} />

      <div className="w-[100%] h-40 flex justify-center items-center rounded-2xl m-2 my-1">
        {timerState === "init" && StartButton}
        {timerState === "paused" && ResumeButton}
        {timerState === "running" && PauseButton}
        {timerState !== "init" && ResetButton}
        {/* {StartButton}
        {ResumeButton}
        {PauseButton}
        {ResetButton} */}
      </div>

      <div className="w-[100%] flex flex-col justify-center items-center bg-slate-500 rounded-2xl m-2 my-1">
        <div>
          <h4 className="text-white font-bold">Phase Config</h4>
        </div>
        <div>
          <label htmlFor="auto-start" className="text-white">Start Next Phase Automatically: </label>
          <input name="auto-start" type="checkbox" checked={settings.autostart_next_phase} onChange={() => setSettings(prev => ({ ...prev, autostart_next_phase: !prev.autostart_next_phase }))} />
        </div>
        <div className="flex">
          {settings.quick_phases.map((qp, i) => (
            <div key={i} className="flex items-center" onClick={() => setPhaseList(prev => [...prev, qp * 1000])}>
              <div className="w-10 h-10 flex justify-center items-center p-2 m-2 bg-yellow-500 rounded-full">
                <p className="text-white font-bold">{qp}</p>
              </div>
            </div>
          ))}
        </div>
        {phaseList.length ? <div className="w-[90%] min-h-20 rounded-2xl flex flex-wrap justify-start items-center bg-slate-900 p-2 m-2">
          {phaseList.map((p, i) => (
            <div key={i} className="flex items-center">
              <div className={`w-10 h-10 flex justify-center items-center p-2 m-2 ${i === phase ? "bg-lime-600" : "bg-gray-400"} rounded-full`}>
                <p className="text-white font-bold">{Math.round(p / 1000)}</p>
              </div>
              <p className="text-white font-bold"> &gt;&gt; </p>

            </div>
          ))}
          <div onClick={() => setSettings(prev => ({ ...prev, loop: !prev.loop }))} className={`w-10 h-10 flex justify-center items-center p-2 m-2 ${settings.loop ? "bg-lime-600" : "bg-red-400"} rounded-full`}>
            {settings.loop ? <i className="text-white font-bold"><ArrowUturnRightIcon className="w-7 h-7 text-white rotate-180" /></i> : null}
          </div>
        </div> : null}
        <div className="flex justify-center items-center">
          <input ref={inputRef} className=" w-16 h-10 text-center text-gray-800 rounded-l-xl focus:outline-none"
            placeholder="seconds" />
          <button className="w-12 h-10 block border rounded-r-xl shadow-sm font-bold text-2xl  px-2 focus:outline-none focus:ring focus:ring-opacity-50 bg-indigo-500 hover:bg-indigo-700 text-white border-transparent focus:border-indigo-300 focus:ring-indigo-200 mr-2 mt-2 mb-2" onClick={handlePhaseInput}>
            <p>+</p>
          </button>
        </div>



      </div>

    </div>


  );
};

export default Timer;
