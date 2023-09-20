import { useEffect, useRef, useState } from "react";
import {
  ArrowUturnRightIcon,
  PlayIcon,
  PauseIcon,
  ForwardIcon,
  ArrowPathIcon,
  PlusIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";
import { DEFAULT_SETTINGS, DEFAULT_UPDATE_INTERVAL } from "../config/constants";
import TimeDisplay from "./TimeDisplay";
import { ms2hms, s2hms, s2ms, timeTransform } from "../utils/utils";

type TimerStateType = "init" | "running" | "paused" | "completed";

const Timer = () => {
  const intervalIdRef = useRef<number>(0);
  const totalTimeRef = useRef<number>(0);
  const elapsedTimeRef = useRef<number>(0);
  const latestResumeTimeRef = useRef<number>(0);
  const firstStart = useRef<boolean>(true);
  const hourInputRef = useRef<HTMLInputElement>(null);
  const minInputRef = useRef<HTMLInputElement>(null);
  const secInputRef = useRef<HTMLInputElement>(null);

  const [phaseList, setPhaseList] = useState<number[]>(
    DEFAULT_SETTINGS.phase_list
  );
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [phase, setPhase] = useState<number>(0);
  const [resultTime, setResultTime] = useState<number>(0);
  const [timerState, setTimerState] = useState<TimerStateType>("init");

  useEffect(() => {
    if (phaseList.length === 0) setResultTime(0);

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
    totalTimeRef.current = s2ms(phaseList[phase]);
    setResultTime(totalTimeRef.current);
    setTimerState("init");
  };

  const handlePhaseInput = () => {
    const h = hourInputRef.current?.value
      ? parseInt(hourInputRef.current.value)
      : 0;
    const m = minInputRef.current?.value
      ? parseInt(minInputRef.current.value)
      : 0;
    const s = secInputRef.current?.value
      ? parseInt(secInputRef.current.value)
      : 0;

    const newPhase = h * 3600 + m * 60 + s;
    if (newPhase) setPhaseList([...phaseList, newPhase]);

    if (hourInputRef.current) hourInputRef.current.value = "";
    if (minInputRef.current) minInputRef.current.value = "";
    if (secInputRef.current) secInputRef.current.value = "";
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
    console.log("pauseTimer");
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

  const startButton = (
    <button
      className="group action-btn bg-green-600 active:bg-green-700 focus:ring-green-200"
      onClick={startTimer}
    >
      <PlayIcon className="action-btn-icon ml-1 mr-[-0.25rem]" />
    </button>
  );

  const resumeButton = (
    <button
      className="group action-btn bg-green-600 active:bg-green-700 focus:ring-green-200"
      onClick={resumeTimer}
    >
      <PlayIcon className="action-btn-icon ml-1 mr-[-0.25rem]" />
    </button>
  );

  const pauseButton = (
    <button
      className="group action-btn bg-yellow-600 active:bg-yellow-700 focus:ring-yellow-200"
      onClick={pauseTimer}
    >
      <PauseIcon className="action-button-icon" />
    </button>
  );

  const resetButton = (
    <button
      className="group action-btn bg-cyan-600 active:bg-cyan-700 focus:ring-cyan-200"
      onClick={resetTimer}
    >
      <ArrowPathIcon className="action-btn-icon" />
    </button>
  );

  const autoNextToggle = (
    <button
      className={`group ${settings.autostart_next_phase ? "toggle-btn-on" : "toggle-btn-off"
        }`}
      onClick={() =>
        setSettings((prev) => ({
          ...prev,
          autostart_next_phase: !prev.autostart_next_phase,
        }))
      }
    >
      <ForwardIcon className="toggle-btn-icon" />
    </button>
  );

  const loopToggle = (
    <button
      className={`group ${settings.loop ? "toggle-btn-on" : "toggle-btn-off"}`}
      onClick={() => setSettings((prev) => ({ ...prev, loop: !prev.loop }))}
    >
      <ArrowUturnRightIcon className="toggle-btn-icon rotate-180" />
    </button>
  );

  return (
    <div className="lg:w-[85%] md:w-[95%] sm:w-[98%] w-[35rem]flex flex-col items-center p-2">
      <TimeDisplay time={resultTime} />
      <div className="w-[100%] h-16 rounded-2xl flex flex-wrap justify-center items-center md:px-4 sm:px-10 px-10 m-1">
        {phaseList.map((p, i) => (
          <div
            key={i}
            className="flex justify-center items-center"
            onClick={() =>
              setPhaseList((prev) => prev.filter((p, idx) => idx !== i))
            }
          >
            <div className={`${i === phase ? "phase-active" : "phase-inactive"}`} >
              <p className="text-white ">{timeTransform(p, s2hms)}</p>
            </div>
            {i < phaseList.length - 1 || settings.loop ? <PlayIcon className="w-4 h-4 mx-1 text-white" /> : null}
          </div>
        ))}
        {phaseList.length && settings.loop ? (
          <div className="flex items-center">{loopToggle}</div>
        ) : null}
      </div>

      <div className="w-[100%] flex justify-center items-center rounded-2xl mt-5">
        <div className="flex">{autoNextToggle}</div>
        <div className="w-64 flex justify-center items-center rounded-2xl m-2 my-1">
          {timerState === "init" && startButton}
          {timerState === "paused" && resumeButton}
          {timerState === "running" && pauseButton}
          {timerState !== "init" && resetButton}
        </div>
        <div className="flex">{loopToggle}</div>
      </div>

      <div className="w-[100%] flex flex-col justify-center items-center">
        <div className="flex justify-center items-start my-4">
          {/* <div className="flex">
            {settings.quick_phases
              .slice(0, Math.round(settings.quick_phases.length / 2))
              .map((qp, i) => (
                <div
                  key={i}
                  className="flex items-center"
                  onClick={() => setPhaseList((prev) => [...prev, qp])}
                >
                  <div className="w-10 h-10 flex justify-center items-center p-2 mx-3 my-2 bg-yellow-500 rounded-full">
                    <p className="text-white font-bold">{timeTransform(qp, s2hms)}</p>
                  </div>
                </div>
              ))}
          </div> */}

          <div className="flex flex-col items-center mx-3">
            <div className="flex justify-center items-center">
              <input
                ref={hourInputRef}
                className="z-10 w-16 h-16 text-center text-gray-800 rounded-full focus:outline-none"
                placeholder="H"
              />
              <input
                ref={minInputRef}
                className="z-10 w-16 h-16 text-center text-gray-800 rounded-full focus:outline-none"
                placeholder="M"
              />
              <input
                ref={secInputRef}
                className="z-10 w-16 h-16 text-center text-gray-800 rounded-full focus:outline-none"
                placeholder="S"
              />
            </div>
            <button
              className="z-9 w-48 h-14 flex flex-col items-center justify-end rounded-b-2xl shadow-sm font-bold text-2xl focus:outline-none focus:ring focus:ring-opacity-50 bg-violet-500 hover:bg-violet-700 text-white border-transparent focus:border-violet-300 mt-[-1.8rem] focus:ring-indigo-200 mb-2 pb-1"
              onClick={handlePhaseInput}
            >
              <PlusIcon className="w-6 h-6" />
            </button>
          </div>

          {/* <div className="flex">
            {settings.quick_phases
              .slice(Math.round(settings.quick_phases.length / 2))
              .map((qp, i) => (
                <div
                  key={i}
                  className="flex items-center"
                  onClick={() => setPhaseList((prev) => [...prev, qp])}
                >
                  <div className="w-10 h-10 flex justify-center items-center p-2 mx-3 my-2 bg-yellow-500 rounded-full">
                    <p className="text-white font-bold">{timeTransform(qp, s2hms)}</p>
                  </div>
                </div>
              ))}
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Timer;
