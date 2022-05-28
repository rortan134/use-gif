export const isValidFramerate = (value: number): number => {
    if (value < 1 || value > 50) {
        throw new Error(`Framerate range is 1 - 60, you provided ${value} `);
    } else return value;
};

export const isValidQuality = (value: number) => {
    if (value < 1 || value > 10) {
        throw new Error(`Framerate range is 1 - 60, you provided ${value} `);
    } else return value;
};

export function fnIgnoreElements(el: any) {
    return typeof el.shadowRoot === "object" && el.shadowRoot !== null;
}
