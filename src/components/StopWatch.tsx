import React, { useRef, useState } from 'react'
import { UPDATE_INTERVAL } from '../constants';

type DisplayTimeType = {
    hours: number;
    minutes: number;
    seconds: number;
}

type TimerStatusType = "init" | "running" | "paused"

const INIT_DISPLAY_TIME: DisplayTimeType = {
    hours: 0,
    minutes: 0,
    seconds: 0
}

const hms2String = (displayTime: DisplayTimeType) => `${displayTime.hours.toString().padStart(2, '0')} : ${displayTime.minutes.toString().padStart(2, '0')} : ${displayTime.seconds.toFixed(2).padStart(5, '0')}`;

const ms2HMS = (t: number, toString: boolean = false) => {
    let seconds = t / 1000;
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    seconds = (seconds % 3600) % 60;

    const res = { hours: hours, minutes: mins, seconds: seconds }
    return toString ? hms2String(res) : res;
}

const StopWatch = () => {

    const [displayTime, setDisplayTime] = useState<DisplayTimeType>(INIT_DISPLAY_TIME)
    const [timerStatus, setTimerStatus] = useState<TimerStatusType>("init")

    const latestStartTimeRef = useRef(0)
    const elapsedTimeRef = useRef(0)
    const totalElapsedTimeRef = useRef(0)
    const intervalRef = useRef(0)


    const updateTimer = () => {
        elapsedTimeRef.current = Date.now() - latestStartTimeRef.current;
        const dT = totalElapsedTimeRef.current + elapsedTimeRef.current;
        setDisplayTime(ms2HMS(dT) as DisplayTimeType)
    }

    const startTimer = () => {
        clearInterval(intervalRef.current);

        latestStartTimeRef.current = Date.now();
        intervalRef.current = setInterval(updateTimer, UPDATE_INTERVAL);

        setTimerStatus("running");
    }

    const pauseTimer = () => {
        clearInterval(intervalRef.current);

        totalElapsedTimeRef.current += elapsedTimeRef.current;
        elapsedTimeRef.current = 0;

        setTimerStatus("paused");
    }

    const resumeTimer = () => {
        intervalRef.current = setInterval(updateTimer, UPDATE_INTERVAL);
        latestStartTimeRef.current = Date.now();

        setTimerStatus("running");
    }

    const resetTimer = () => {
        clearInterval(intervalRef.current);

        latestStartTimeRef.current = 0;
        totalElapsedTimeRef.current = 0;
        elapsedTimeRef.current = 0;

        setDisplayTime(INIT_DISPLAY_TIME)
        setTimerStatus("init");
    }

    return (
        <div style={{ display: 'flex' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div>{hms2String(displayTime)}</div>
                <div style={{ display: 'flex', gap: 5 }}>
                    {timerStatus === "init" && <button onClick={startTimer}>Start</button>}
                    {timerStatus === "paused" && <button onClick={resumeTimer}>Resume</button>}
                    {timerStatus === "running" && <button onClick={pauseTimer}>Pause</button>}
                    {timerStatus !== "init" && <button onClick={resetTimer}>Reset</button>}
                </div>
                <div>

                </div>
            </div>
            <div>
                <pre>
                    {`
                    Details:
                    status:           ${timerStatus}
                    latestResumeTime: ${new Date(latestStartTimeRef.current)}
                    totalElapsedTime: ${ms2HMS(totalElapsedTimeRef.current, true)}
                    elapsedTime:      ${ms2HMS(elapsedTimeRef.current, true)}
                    displayTime:      ${JSON.stringify(displayTime)}
                    `}
                </pre>
            </div>
        </div>

    )
}

export default StopWatch