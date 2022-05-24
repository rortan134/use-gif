import { useState, useCallback, useRef, RefObject, useEffect } from "react";
import html2canvas, { Options } from "html2canvas";
import {
    fnIgnoreElements,
    isValidFramerate,
    isValidQuality,
} from "./utils/validation";

import GIF = require("gif.js");
import { workerBlob } from "./gif.worker";

import type { Ran } from "./types";

type framerateRange = Ran<61>; // 1 - 60 fps range
type qualityRange = Ran<11>; // 1 - 10 quality range

type Status = "Idle" | "Recording" | "Processing";

interface GifOptions {
    framerate: framerateRange;
    quality: qualityRange;
    loop: boolean;
    background: string | null;
    width?: number;
    height?: number;
    offset: { x: number; y: number };
    releaseMemory: boolean;
    debug: boolean;
    smoothing: boolean;
    overrideHtml2Canvas: Partial<Options>;
}

interface GifHandlers {
    start: () => void;
    render: () => void;
    abort: () => void;
    result: Promise<ResultType> | undefined;
}

interface GifAuxiliaryStates {
    isRecording: boolean;
    isRendering: boolean;
    progress: number;
    status: Status;
    // getSnapshot: (element: HTMLElement) => void;
}

type GifReturnType = GifHandlers & GifAuxiliaryStates;

type ResultType = {
    blobFormat: Blob;
    url: string;
    data: Uint8Array;
};

export const defaultOptions: GifOptions = {
    framerate: 15,
    quality: 10,
    loop: true,
    background: null,
    releaseMemory: true,
    offset: { x: 0, y: 0 },
    debug: false,
    smoothing: false,
    overrideHtml2Canvas: {},
};

/**
 *
 * useGif hook
 *
 * useGif is a React hook that is able to record and create a GIF from animations directly in the DOM. This means that CSS, videos, images and SVG animations are also possible.
 * Constraints: iframe tag is not supported. For any rendering issue please refer to Html2Canvas's github page https://github.com/niklasvh/html2canvas
 * @param ref - RefObject<HTMLElement | null>
 * @param options - Partial<GifOptions>
 * @param [callback] - (result: Promise<ResultType>) => void
 * @returns Returns the following properties: start, render, abort, result, progress, status, isRecording, and isRendering state.
 */
function useGif(
    ref: RefObject<HTMLElement | null>,
    options: Partial<GifOptions>,
    callback?: (result: Promise<ResultType>) => void
): GifReturnType | undefined {
    useEffect(() => {
        if (!ref.current) {
            throw new Error("useGif: Gif element was not provided.");
        }
    }, [ref]);

    const settings = Object.assign(defaultOptions, options);

    const [active, setActive] = useState(false);
    const [isRendering, setIsRendering] = useState(false);
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState<Status>("Idle");

    const w = ref?.current?.clientWidth;
    const h = ref?.current?.clientHeight;

    // delay between frames, defaults to 66.6ms
    const timestep = useRef<number>(
        1000 / isValidFramerate(settings.framerate)
    );

    // gif processor handler
    const [handler] = useState(
        () =>
            new GIF({
                workers: 4,
                quality: isValidQuality(settings.quality),
                workerScript: URL.createObjectURL(workerBlob),
                repeat: settings.loop === false ? -1 : 0, // ignore other falsy values
                debug: settings.debug,
                width: settings.width ?? w,
                height: settings.height ?? h,
            })
    );

    // to copy data from other elements
    const tempCanvasRef = useRef<HTMLCanvasElement>(
        document.createElement("canvas")
    );
    const [videos, setVideos] = useState<NodeListOf<HTMLVideoElement>>();

    const captureVideos = useCallback(
        (videos: NodeListOf<HTMLVideoElement>) => {
            const canvas = tempCanvasRef.current;
            const ctx = canvas.getContext("2d");

            let h, w;
            for (let i = 0, len = videos.length; i < len; i++) {
                const v = videos[i];
                if (!v?.src) continue; // no video here

                w = v.videoWidth;
                h = v.videoHeight;
                canvas.width = w;
                canvas.height = h;
                ctx?.fillRect(0, 0, w, h);
                ctx?.drawImage(v, 0, 0, w, h);
                v.style.backgroundImage = `url(${canvas.toDataURL()})`; // here is the magic
                v.style.backgroundSize = "cover";
                ctx?.clearRect(0, 0, w, h);
            }
        },
        []
    );

    useEffect(() => {
        const videos = ref.current?.parentElement?.querySelectorAll("video");
        if (videos) setVideos(videos);
    }, [ref]);

    const [snapshotSettings] = useState({
        x: settings.offset.x ?? 0,
        y: settings.offset.y ?? 0,
        scrollX: -window.scrollX,
        scrollY: -window.scrollY,
        width: w,
        height: h,
        foreignObjectRendering: true,
        backgroundColor: settings.background,
        ignoreElements: fnIgnoreElements,
        allowTaint: true,
        useCORS: true,
        logging: settings.debug,
        ...settings.overrideHtml2Canvas,
    });

    // capture snapshot of the DOM
    const getSnapshot = useCallback(
        async (element: HTMLElement) => {
            if (videos && videos.length > 0) {
                captureVideos(videos);
            }

            const snapshot = await html2canvas(element, {
                windowWidth: document.documentElement.offsetWidth,
                windowHeight: document.documentElement.offsetHeight,
                ...snapshotSettings,
            });

            return snapshot;
        },
        [captureVideos, snapshotSettings, videos]
    );

    // throttle framerate using requestAnimationFrame
    const animationFrame = useRef(0);
    const [result, setResult] = useState<Promise<ResultType> | undefined>(
        undefined
    );

    const startTime = useRef(0);
    const elapsed = useRef(0);
    const now = useRef(0);
    const then = useRef(0);

    const record = useCallback(
        async (currentTime: number) => {
            animationFrame.current = window.requestAnimationFrame(record);
            now.current = currentTime;

            elapsed.current = now.current - then.current;

            // if enough time has passed since the last frame depending on the framerate
            if (elapsed.current > timestep.current) {
                then.current =
                    now.current - (elapsed.current % timestep.current);

                // add frame to gif file
                handler.addFrame(
                    await getSnapshot(ref.current as HTMLElement),
                    {
                        delay:
                            timestep.current +
                            (settings.smoothing ? elapsed.current : 0),
                        copy: true,
                    }
                );
            }
        },
        [getSnapshot, handler, settings.smoothing, ref]
    );

    useEffect(() => {
        if (active) {
            record(0);
            setStatus("Recording");
        }
    }, [active, record]);

    const start = useCallback(() => {
        if (!ref.current) return;

        handler.on("start", function () {
            setIsRendering(true);
            setStatus("Processing");
        });

        handler.on("progress", function (progress) {
            setProgress(progress * 100);
        });

        setResult(() => {
            return new Promise((resolve) => {
                handler.on("finished", function (blob, data) {
                    const rawResult = {
                        blobFormat: blob,
                        url: URL.createObjectURL(blob),
                        data: data,
                    };

                    resolve(rawResult);
                    setStatus("Idle");
                    setIsRendering(false);

                    // https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL#memory_management
                    if (settings.releaseMemory === true) {
                        setTimeout(() => {
                            URL.revokeObjectURL(rawResult.url);
                        }, 5000);
                    }
                });
            });
        });

        if (ref.current instanceof HTMLElement) {
            setActive(true);
        }

        then.current = window.performance.now();
        startTime.current = then.current;
    }, [handler, ref, settings.releaseMemory]);

    useEffect(() => {
        if (!result || !callback) return;
        callback(result);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [result]);

    const render = () => {
        if (!active) {
            throw new Error("GIF must first be started before rendering");
        }

        window.cancelAnimationFrame(animationFrame.current);
        setActive(false);

        handler.render();
    };

    const abort = () => {
        if (!active) {
            throw new Error("GIF must first be started before aborting");
        }

        window.cancelAnimationFrame(animationFrame.current);
        setActive(false);

        handler.abort();
    };

    return {
        start,
        render,
        abort,
        result,
        progress,
        status,
        isRecording: active,
        isRendering,
    };
}

export { useGif };
