import { timeTransform } from "../utils/utils"

type TimeDisplayProps = { time: number };

const TimeDisplay = ({ time }: TimeDisplayProps) => {
    return (
        <div className="w-[100%] h-[150px] flex justify-center items-center bg-slate-800 rounded-2xl m-2 my-1">
            <h1 className="md:text-[6rem] text-6xl text-white font-bold">{timeTransform(time)}</h1>
        </div>
    )
}

export default TimeDisplay;