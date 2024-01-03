import { ms2hms, timeTransform } from "../utils/utils"

type TimeDisplayProps = { time: number };

const TimeDisplay = ({ time }: TimeDisplayProps) => {
    return (
        <div className="w-[100%] min-h-[150px] flex justify-center items-center rounded-2xl xl:mt-40 lg:mt-20 md:mt-10 text-6xl mt-1">
            <h1 className="xl:text-[13rem] lg:text-[10rem] md:text-[8rem] text-[4rem] text-white font-sans font-bold drop-shadow-[0_0_25px_rgba(255,255,255,0.5)] subpixel-antialiased">{timeTransform(time, ms2hms)}</h1>
        </div>
    )
}

export default TimeDisplay;