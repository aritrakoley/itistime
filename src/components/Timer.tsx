import { useEffect, useRef, useState } from "react";
import {
  ArrowUturnRightIcon,
  PlayIcon,
  PauseIcon,
  ForwardIcon,
  ArrowPathIcon,
  PlusIcon,
  XCircleIcon,
  StopCircleIcon,
  StopIcon,
  Cog6ToothIcon,
  PencilIcon,
  PencilSquareIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { DEFAULT_SETTINGS, DEFAULT_UPDATE_INTERVAL } from "../config/constants";
import TimeDisplay from "./TimeDisplay";
import { ms2hms, s2hms, s2ms, timeTransform } from "../utils/utils";
import PhaseList from "./PhaseList";

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
  const [isEditMode, setIsEditMode] = useState<number>(-1);

  useEffect(() => {
    console.log("---")
    if (phaseList.length === 0) resetTimer();

    if (phase < phaseList.length) {
      setupTimer();
      if (settings.autostart_next_phase && !firstStart.current && timerState === 'running') {
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

  const handlePhaseInput = (index?: number) => {
    const h = hourInputRef.current?.value
      ? parseInt(hourInputRef.current.value)
      : 0;
    const m = minInputRef.current?.value
      ? parseInt(minInputRef.current.value)
      : 0;
    const s = secInputRef.current?.value
      ? parseInt(secInputRef.current.value)
      : 0;

    if (hourInputRef.current) hourInputRef.current.value = "";
    if (minInputRef.current) minInputRef.current.value = "";
    if (secInputRef.current) secInputRef.current.value = "";

    const newPhase = h * 3600 + m * 60 + s;
    console.log(newPhase, index);
    if (!newPhase) return;
    if (index == null) setPhaseList([...phaseList, newPhase]);
    if (index != null && index >= 0 && index < phaseList.length) setPhaseList(phaseList.map((p, i) => i === index ? newPhase : p));
  };

  const handlePhaseAdd = () => {
    setIsEditMode(phaseList.length);
    setPhaseList([...phaseList, 0]);
  }

  const handleManualPhaseChange = (p: number) => {
    resetTimer();
    setPhase(p);
  }

  const removePhaseAtIndex = (idx: number) => {
    setPhaseList(prev => prev.filter((p, i) => i !== idx))
  }

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

  const openSettingsModal = () => setSettings(prev => ({ ...prev, isModalOpen: true }));

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
    <div className="lg:w-[85%] md:w-[95%] z-10 sm:w-[98%] w-[35rem]flex flex-col items-center p-2">
      <TimeDisplay time={resultTime} />
      <PhaseList phaseList={phaseList} phase={phase} handleManualPhaseChange={handleManualPhaseChange} settings={settings} />

      <div className="w-[100%] flex justify-center items-center rounded-2xl mt-5">

        <div className="w-64 flex justify-center items-center rounded-2xl m-2 my-1">
          {timerState === "init" && startButton}
          {timerState === "paused" && resumeButton}
          {timerState === "running" && pauseButton}
          {timerState !== "init" && resetButton}
        </div>

      </div>

      <div className="w-[100%] flex flex-col justify-center items-center">

        <div className="flex justify-center items-start my-4">
          <div className="flex">{autoNextToggle}</div>
          <div className="flex">{loopToggle}</div>
          <div className="flex" onClick={openSettingsModal}><Cog6ToothIcon className="panel-btn" /></div>
        </div>

      </div>

      {
        settings.isModalOpen ? (
          <>
            <div className="w-screen h-screen fixed inset-0 flex justify-center items-center  bg-slate-900 opacity-70"></div>

            <div className="w-fit h-fit fixed inset-0 m-auto flex justify-center items-center rounded-2xl bg-red-900">
              <div className="w-[20rem] h-[30rem] flex flex-col items-center bg-slate-700 rounded-2xl p-2">
                <div className="w-full flex justify-center items-center mb-2">
                  <div className="grow"></div>
                  <div className="text-white text-3xl">Phases</div>
                  <div className="flex grow justify-end">
                    <button className="w-9 h-9 flex justify-center items-center text-white text-xl ml-1 mr-1 rounded-full bg-red-400" onClick={() => setSettings({ ...settings, isModalOpen: false })}><XMarkIcon className="w-5 h-5" /></button>
                  </div>
                </div>
                {phaseList.map((p, i) => (
                  <div key={i} className="w-full h-12 flex items-center bg-slate-500 rounded-l-full rounded-r-full mt-1 p-1">
                    <span className="w-9 h-9 flex justify-center items-center text-white text-xl ml-1 rounded-full bg-slate-400 ">{i + 1}</span>
                    {isEditMode !== i
                      ? <p className="text-white text-2xl ml-2">{timeTransform(p, s2hms)}</p>
                      : <div className="flex mx-1 text-white text-2xl">
                        <input
                          ref={hourInputRef}
                          className="z-10 w-9 h-9 bg-slate-400 text-center placeholder:text-slate-100 rounded-xl focus:outline-none mx-1"
                          placeholder="h"
                        />
                        :
                        <input
                          ref={minInputRef}
                          className="z-10 w-9 h-9 bg-slate-400 text-center placeholder:text-slate-100 rounded-xl focus:outline-none mx-1"
                          placeholder="m"
                        />
                        :
                        <input
                          ref={secInputRef}
                          className="z-10 w-9 h-9 bg-slate-400 text-center placeholder:text-slate-100 rounded-xl focus:outline-none mx-1"
                          placeholder="s"
                        />
                      </div>}
                    {isEditMode === i
                      ? <div className="flex grow justify-end">
                        <button className="w-9 h-9 flex justify-center items-center text-white text-xl ml-1 rounded-full bg-green-400" onClick={() => { handlePhaseInput(i); setIsEditMode(-1) }}><CheckIcon className="w-5 h-5" /></button>
                        <button className="w-9 h-9 flex justify-center items-center text-white text-xl mx-1 rounded-full bg-red-400" onClick={() => { setIsEditMode(-1) }}><XMarkIcon className="w-5 h-5" /></button>
                      </div>
                      : <div className="flex grow justify-end">
                        <button className="w-9 h-9 flex justify-center items-center text-white text-xl ml-1 rounded-full bg-amber-400" onClick={() => {
                          setIsEditMode(i);
                          const [h, m, s] = s2hms(p);
                          if (hourInputRef.current) hourInputRef.current.value = h.toString();
                          if (minInputRef.current) minInputRef.current.value = m.toString();
                          if (secInputRef.current) secInputRef.current.value = s.toString();
                        }}><PencilSquareIcon className="w-5 h-5" /></button>
                        <button className="w-9 h-9 flex justify-center items-center text-white text-xl mx-1 rounded-full bg-red-400" onClick={() => removePhaseAtIndex(i)}><TrashIcon className="w-5 h-5" /></button>
                      </div>
                    }

                  </div>
                ))}
                <button className="w-10 h-10 flex justify-center items-center mt-auto ml-auto items-center bg-green-500 rounded-l-full rounded-r-full p-1" onClick={handlePhaseAdd}>
                  <PlusIcon className="w-7 h-7 text-white" />
                </button>
              </div>

            </div>
          </>

        ) : null
      }
    </div >
  );
};

export default Timer;

