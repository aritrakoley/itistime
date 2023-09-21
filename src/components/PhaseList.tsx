import { ArrowUturnRightIcon, PlayIcon, StopIcon } from '@heroicons/react/24/solid';
import { s2hms, timeTransform } from '../utils/utils';
import { Dispatch, SetStateAction } from 'react';

type PhaseListProps = {
    phaseList: number[];
    phase: number;
    handleManualPhaseChange: (p: number) => void;
    settings: any;
}
const PhaseList = (props: PhaseListProps) => {
    const { phaseList, phase, handleManualPhaseChange, settings } = props;
    return (
        <div className="w-[100%] min-h-16 rounded-2xl flex flex-wrap justify-center items-center md:px-4 sm:px-10 px-10 m-1">
            {phaseList.map((p, i) => (
                <div key={i} className="flex justify-center items-center my-1" onClick={() => handleManualPhaseChange(i)}>
                    <div className={`${i === phase ? "phase-active" : "phase-inactive"}`} >
                        <p className="text-white ">{timeTransform(p, s2hms)}</p>
                    </div>
                    {i < phaseList.length - 1 ? <PlayIcon className={`w-4 h-4 mx-1 ${settings.autostart_next_phase ? 'text-green-500' : 'text-white'}`} /> : null}
                    {i === phaseList.length - 1 && !settings.loop ? <StopIcon className="w-4 h-4 mx-1 text-red-500" /> : null}
                    {i === phaseList.length - 1 && settings.loop ? <div className="w-4 h-4 flex justify-center items-center ml-2 rounded-full bg-green-600"><ArrowUturnRightIcon className="w-3 h-3 rotate-180 text-white" /></div> : null}
                </div>
            ))}
        </div>
    )
}

export default PhaseList