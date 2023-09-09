export const timeTransform = (t: number) => {
    let seconds = t / 1000;
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    seconds = Math.floor((seconds % 3600) % 60);

    return `${hours.toString().padStart(2, "0")} : ${mins
        .toString()
        .padStart(2, "0")} : ${seconds.toString().padStart(2, "0")}`;
};