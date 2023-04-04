import React, { useEffect, useRef, useState } from 'react'


type TimerStateType = "init" | "running" | "paused" | "completed";


const DEFAULT_UPDATE_INTERVAL = 50;
const DEFAULT_SETTINGS = {
    autostart_next_phase: false,
};

const PomodoroTimer = () => {

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
                startTimer()
            }
        }
    }, [phase, phaseList])

    const setupTimer = () => {
        console.log("Setup Timer", phaseList[phase])
        totalTimeRef.current = phaseList[phase];
        setResultTime(totalTimeRef.current);
        setTimerState("init");
    }

    const addPhase = () => {
        const val = inputRef.current?.value ? parseInt(inputRef.current?.value) : null;
        if (val) setPhaseList([...phaseList, val]);
    }

    const handleComplete = () => {
        clearInterval(intervalIdRef.current);
        setTimerState("completed");

        console.log("Completed", phase);
        setPhase(phase + 1);
    }

    const updateTimer = () => {
        console.log(resultTime)
        const curElapsedTime = Date.now() - latestResumeTimeRef.current;
        const totalElapsedTime = elapsedTimeRef.current + curElapsedTime;
        const timeLeft = totalTimeRef.current - totalElapsedTime;
        const newResultTime = timeLeft <= 999 ? 0 : timeLeft;
        setResultTime(newResultTime);

        if (newResultTime <= 0) handleComplete();
    }

    const startTimer = () => {
        clearInterval(intervalIdRef.current);
        latestResumeTimeRef.current = Date.now();
        intervalIdRef.current = setInterval(updateTimer, DEFAULT_UPDATE_INTERVAL);
        setTimerState("running");
    }

    const pauseTimer = () => {
        clearInterval(intervalIdRef.current);
        const curElapsedTime = Date.now() - latestResumeTimeRef.current;
        elapsedTimeRef.current += curElapsedTime;
        setTimerState("paused");
    }

    const resumeTimer = () => {
        latestResumeTimeRef.current = Date.now();
        intervalIdRef.current = setInterval(updateTimer, DEFAULT_UPDATE_INTERVAL);
        setTimerState("running");
    }

    const resetTimer = () => {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = 0;
        totalTimeRef.current = 0;
        elapsedTimeRef.current = 0;
        latestResumeTimeRef.current = 0;

        setTimerState("init");
        setResultTime(0);
    }

    const transform = (t: number) => {
        let seconds = t / 1000;
        const hours = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        seconds = Math.floor((seconds % 3600) % 60);

        return `${hours.toString().padStart(2, '0')} : ${mins.toString().padStart(2, '0')} : ${seconds.toString().padStart(2, '0')}`
    }


    return (<div style={{ display: 'flex' }}>
        <div style={{ display: 'flex', flexDirection: 'column', minWidth: '250px' }}>
            {timerState === "init" &&
                <div style={{ display: 'flex', gap: 5 }}>
                    <input ref={inputRef} style={{ maxWidth: 100 }} id="hours" type="number" />
                    <button onClick={addPhase}>Add Phase</button>
                </div>

            }
            <div style={{ display: 'flex', gap: 5 }}>
                {phaseList.map((p, i) => (i === phase ? <em key={i}> {p} </em> : p))} end
            </div>
            <div>{transform(resultTime)}</div> <span> ::: {phase}</span>
            <div style={{ display: 'flex', gap: 5 }}>
                {timerState === "init" && <button onClick={startTimer}>Start</button>}
                {timerState === "paused" && <button onClick={resumeTimer}>Resume</button>}
                {timerState === "running" && <button onClick={pauseTimer}>Pause</button>}
                {timerState !== "init" && <button onClick={resetTimer}>Reset</button>}
            </div>
        </div>
        <div>
            <pre>
                {`Details: Pomodoro\nstatus:           ${timerState}\nlatestResumeTime: ${transform(latestResumeTimeRef.current)}\ntotalElapsedTime: ${transform(elapsedTimeRef.current)}\nelapsedTime:      ${transform(elapsedTimeRef.current)}\ndisplayTime:      ${transform(resultTime)}
            `}
            </pre>
        </div>
    </div>)
}

export default PomodoroTimer