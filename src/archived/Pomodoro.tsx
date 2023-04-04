import React, { useEffect, useRef, useState } from 'react';

const DEFAULT_UPDATE_INTERVAL = 50;

type TimerStatusType = "init" | "running" | "paused" | "completed";

const transform = (t: number) => {
    let seconds = t / 1000;
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    seconds = Math.floor((seconds % 3600) % 60);

    return `${hours.toString().padStart(2, '0')} : ${mins.toString().padStart(2, '0')} : ${seconds.toString().padStart(2, '0')}`
}

export const Timer = (props: any) => {

    const {
        action,
        totalTime,
        onStart,
        onUpdate,
        onPause,
        onResume,
        onReset,
        onComplete
    } = props;

    const [displayTime, setDisplayTime] = useState<number>(0);
    const [timerState, setTimerState] = useState<TimerStatusType>("init");

    const intervalRef = useRef(0);
    const latestResumeTime = useRef(0);
    const elapsedTimeRef = useRef(0);

    useEffect(() => {
        if (displayTime <= 999 && timerState !== "init") {
            handleTimerComplete()
        }
    }, [displayTime])

    useEffect(() => {
        const fsaMap: any = {
            "init:start": () => { setDisplayTime(totalTime); startTimer(); }
        }

        fsaMap["init:start"]();

    }, [timerState, action])

    const updateTimer = () => {

        const curElapsedTime = Date.now() - latestResumeTime.current;
        const totalElapsedTime = elapsedTimeRef.current + curElapsedTime;
        const timeLeft = totalTime - totalElapsedTime;
        const newDisplayTime = timeLeft <= 0 ? 0 : timeLeft;

        setDisplayTime(newDisplayTime);
        if (onUpdate) onUpdate();
    }

    const startTimer = () => {
        clearInterval(intervalRef.current);

        latestResumeTime.current = Date.now();
        intervalRef.current = setInterval(updateTimer, DEFAULT_UPDATE_INTERVAL);
        setDisplayTime(totalTime);

        if (onStart) onStart();
    }

    const pauseTimer = () => {
        clearInterval(intervalRef.current);
        elapsedTimeRef.current += Date.now() - latestResumeTime.current;

        if (onPause) onPause();
    }

    const resumeTimer = () => {
        latestResumeTime.current = Date.now();
        intervalRef.current = setInterval(updateTimer, DEFAULT_UPDATE_INTERVAL);

        if (onResume) onResume();
    }

    const resetTimer = () => {
        clearInterval(intervalRef.current);
        intervalRef.current = 0;
        latestResumeTime.current = 0;
        elapsedTimeRef.current = 0;
        setDisplayTime(0);

        if (onReset) onReset();
    }

    const handleTimerComplete = () => {
        clearInterval(intervalRef.current);

        if (onComplete) onComplete();
    }

    console.log("render", displayTime);
    return <div>{transform(displayTime)}  {status}</div>
}


const Pomodoro = () => {
    const [timerAction, setTimerAction] = useState("init");

    return (
        <div>
            <div style={{ display: 'flex', gap: 5 }}>
                {timerAction === "init" && <button onClick={() => setTimerAction("start")}>Start</button>}
                {timerAction === "pause" && <button onClick={() => setTimerAction("resume")}>Resume</button>}
                {(timerAction === "start" || timerAction === "resume") && <button onClick={() => setTimerAction("pause")}>Pause</button>}
                {timerAction !== "reset" && <button onClick={() => setTimerAction("init")}>Reset</button>}
            </div>
            <Timer action={timerAction} totalTime={2000} onComplete={() => console.log("Done")} />
        </div>
    )
}

export default Pomodoro