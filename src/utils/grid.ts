import { getElementBackgroundColor } from "./htmlElement";

export function generateGridBackground(cols: number, gridWidth: number): string {
    const XMLNS = "http://www.w3.org/2000/svg";
    const margin = 10; // default grid layout margin

    const totalHorizontalMargin = (cols + 1) * margin;
    const freeSpace = gridWidth - totalHorizontalMargin;

    const w = freeSpace / cols;
    const h = 150; // default grid layout row height

    const rowHeight = h + margin;

    const colorGiver = document.getElementById("color-giver");

    const cellStrokeColor = getElementBackgroundColor(colorGiver);

    const y = margin;

    const rectangles = Array.from({length: cols}, (_, i) => {

        const x = i * (w + margin) + margin;
        return `<rect stroke='${cellStrokeColor}' stroke-width='1' fill='none' x='${x}' y='${y}' width='${w}' height='${h}'/>`;
    })

    const svg = [
        `<svg xmlns='${XMLNS}' width='${gridWidth}' height='${rowHeight}'>`,
        ...rectangles,
        `</svg>`,
    ].join("");

    return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
}