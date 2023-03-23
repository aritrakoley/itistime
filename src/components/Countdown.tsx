import React, { ChangeEvent, useRef, useState } from 'react'
import { UPDATE_INTERVAL } from '../constants';

type DisplayTimeType = {
    hours: number;
    minutes: number;
    seconds: number;
}

type TimerStatusType = "init" | "running" | "paused"

type LapType = { id: number, laptime: DisplayTimeType }

const INIT_DISPLAY_TIME: DisplayTimeType = {
    hours: 0,
    minutes: 0,
    seconds: 0
}

const displayTime2String = (displayTime: DisplayTimeType) => `${displayTime.hours.toString().padStart(2, '0')} : ${displayTime.minutes.toString().padStart(2, '0')} : ${displayTime.seconds.toFixed(2).padStart(5, '0')}`;

const ms2HMS = (t: number, toString: boolean = false) => {
    let seconds = t / 1000;
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    seconds = (seconds % 3600) % 60;

    const res = { hours: hours, minutes: mins, seconds: seconds }
    return toString ? displayTime2String(res) : res;
}

const getDurationFromDisplayTime = (dt: DisplayTimeType) => (dt.hours * 3600 + dt.minutes * 60 + dt.seconds) * 1000;

const Countdown = () => {

    const [timerStatus, setTimerStatus] = useState<TimerStatusType>("init");
    const [displayTime, setDisplayTime] = useState<DisplayTimeType>(INIT_DISPLAY_TIME);

    const timeLeftRef = useRef(0);
    const intervalId = useRef(0);
    const latestStartTimeRef = useRef(0);
    const prevElapsedTimeRef = useRef(0);

    const updateTimer = () => {
        const elapsedTime = Date.now() - latestStartTimeRef.current;
        const timeLeft = timeLeftRef.current - (prevElapsedTimeRef.current + elapsedTime);
        setDisplayTime(ms2HMS(timeLeft) as DisplayTimeType);
        if (timeLeft <= UPDATE_INTERVAL) stopCountdown();
    }

    const stopCountdown = () => {
        clearInterval(intervalId.current);
        setDisplayTime(INIT_DISPLAY_TIME);
        setTimerStatus("init");
    }

    const startCountdown = () => {
        timeLeftRef.current = getDurationFromDisplayTime(displayTime);
        latestStartTimeRef.current = Date.now();
        intervalId.current = setInterval(updateTimer, UPDATE_INTERVAL)
        setTimerStatus("running");
    }

    const pauseTimer = () => {
        clearInterval(intervalId.current);

        const elapsedTime = Date.now() - latestStartTimeRef.current;
        prevElapsedTimeRef.current += elapsedTime;
        setTimerStatus("paused");
    }

    const resumeTimer = () => {
        latestStartTimeRef.current = Date.now();
        intervalId.current = setInterval(updateTimer, UPDATE_INTERVAL);
        setTimerStatus("running");
    }

    const resetTimer = () => {
        clearInterval(intervalId.current);

        timeLeftRef.current = 0;
        latestStartTimeRef.current = 0;
        prevElapsedTimeRef.current = 0;

        setDisplayTime(INIT_DISPLAY_TIME);
        setTimerStatus("init");;
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value);
        setDisplayTime({
            ...displayTime,
            [e.target.id]: val >= 0 ? val : 0
        })
    }

    // console.log(displayTime)
    return (
        <div style={{ display: 'flex' }}>
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: '250px' }}>
                {timerStatus === "init" &&
                    <div style={{ display: 'flex' }}>
                        <input style={{ maxWidth: 50 }} id="hours" type="number" onChange={handleChange} value={displayTime.hours} />
                        <input style={{ maxWidth: 50 }} id="minutes" type="number" onChange={handleChange} value={displayTime.minutes} />
                        <input style={{ maxWidth: 50 }} id="seconds" type="number" onChange={handleChange} value={displayTime.seconds} />
                    </div>
                }
                {["running", "paused"].includes(timerStatus) && <div>{displayTime2String(displayTime)}</div>}

                <div style={{ display: 'flex', gap: 5 }}>
                    {timerStatus === "init" && <button onClick={startCountdown}>Start</button>}
                    {timerStatus === "paused" && <button onClick={resumeTimer}>Resume</button>}
                    {timerStatus === "running" && <button onClick={pauseTimer}>Pause</button>}
                    {timerStatus !== "init" && <button onClick={resetTimer}>Reset</button>}
                </div>

            </div>
            <div>
                <pre>
                    {`Details:\tCountdown\nstatus:\t\t\t${timerStatus}\ntimeLeft:\t\t${timeLeftRef.current}\nprevElapsedTime:\t${ms2HMS(prevElapsedTimeRef.current, true)}
                    `}
                </pre>
            </div>
        </div>

    )
}

export default Countdown;