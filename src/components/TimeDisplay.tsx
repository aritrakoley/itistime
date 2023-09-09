import { timeTransform } from "../utils/utils"

type TimeDisplayProps = { time: number };

const TimeDisplay = ({ time }: TimeDisplayProps) => {
    return (
        <div className="w-[100%] h-[150px] flex justify-center items-center rounded-2xl xl:my-40 lg:my-20 md:my-10 text-6xlm-2 my-1">
            <h1 className="xl:text-[13rem] lg:text-[10rem] md:text-[8rem] text-[4.6rem] text-white font-sans font-bold drop-shadow-[0_0_25px_rgba(255,255,255,0.5)] subpixel-antialiased">{timeTransform(time)}</h1>
        </div>
    )
}

export default TimeDisplay;