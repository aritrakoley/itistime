export const timeTransform = (t: number, converter: (arg: number) => number[]) => {
    const [hours, mins, seconds] = converter(t);

    return `${hours.toString().padStart(2, "0")} : ${mins
        .toString()
        .padStart(2, "0")} : ${seconds.toString().padStart(2, "0")}`;
};

export const ms2s = (ms: number) => Math.round(ms / 1000);
export const ms2m = (ms: number) => Math.round(ms / 60000);
export const ms2h = (ms: number) => Math.round(ms / 3600_000);
export const ms2hms = (ms: number) => {
    let seconds = ms / 1000;
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    seconds = Math.floor((seconds % 3600) % 60);
    return [hours, mins, seconds];
}
export const s2hms = (s: number) => {
    const hours = Math.floor(s / 3600);
    const mins = Math.floor((s % 3600) / 60);
    const seconds = Math.floor((s % 3600) % 60);
    return [hours, mins, seconds];
}

export const s2ms = (s: number) => s * 1000;
export const m2ms = (m: number) => m * 60000;
export const h2ms = (h: number) => h * 3600_000;