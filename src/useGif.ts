import {
    useState,
    useCallback,
    useRef,
    RefObject,
    useEffect,
    useMemo,
} from "react";
import html2canvas, { Options } from "html2canvas";
import {
    fnIgnoreElements,
    isValidFramerate,
    isValidQuality,
} from "./utils/validation";

import GIF = require("gif.js");
import { workerBlob } from "./gif.worker";

import type { Ran } from "./types";

export const promiseErr =
    "useGif: The browser doesn't support Promises, please try using a polyfill.";

type framerateRange = Ran<51>; // 1 - 60 fps range
type qualityRange = Ran<11>; // 1 - 10 quality range

type Status = "Idle" | "Recording" | "Processing";

interface GifOptions extends Partial<Options> {
    framerate: framerateRange;
    quality: qualityRange;
    loop: boolean;
    background: string | null;
    width?: number;
    height?: number;
    offset: { x: number; y: number };
    releaseMemory: boolean;
    debugMode: boolean;
    smoothing: boolean;
    overrideHtml2Canvas: Partial<Options>;
}

interface UseGifHandlers {
    start: () => void;
    render: () => void;
    abort: () => void;
    result: Promise<UseGifResultType> | undefined;
}

interface GifAuxiliaryStates {
    isRecording: boolean;
    isRendering: boolean;
    progress: number;
    status: Status;
    // getSnapshot: (element: HTMLElement) => void;
}

type UseGifReturnType = UseGifHandlers & GifAuxiliaryStates;

type UseGifResultType = {
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
    debugMode: false,
    smoothing: true,
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
 * @param [callback] - (result: Promise<UseGifResultType>) => void
 * @returns Returns the following properties: start, render, abort, result, progress, status, isRecording, and isRendering state.
 */
const useGif = <T extends HTMLElement | null>(
    ref: RefObject<T>,
    options: Partial<GifOptions> = {},
    callback?: (result: Promise<UseGifResultType>) => void
): UseGifReturnType | undefined => {
    const settings = useMemo(
        () => Object.assign(defaultOptions, options),
        [options]
    );

    const [active, setActive] = useState(false);
    const [isRendering, setIsRendering] = useState(false);
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState<Status>("Idle");

    const [result, setResult] = useState<Promise<UseGifResultType> | undefined>(
        undefined
    );

    const w = ref?.current?.clientWidth;
    const h = ref?.current?.clientHeight;

    // delay between frames, defaults to 66.6ms (15fps)
    const timestep = useRef(1000 / isValidFramerate(settings.framerate));

    useEffect(() => {
        if (typeof Promise === "undefined" || !window.Promise) {
            console.error(promiseErr);
            return () => undefined;
        }
    }, []);

    useEffect(() => {
        if (!result || !callback) return;
        callback(result);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [result]);

    // for copying temporary data
    const offscreenCanvas = useRef<HTMLCanvasElement>(
        document.createElement("canvas")
    );
    const [videos, setVideos] = useState<
        NodeListOf<HTMLVideoElement> | undefined
    >();

    useEffect(() => {
        setVideos(ref.current?.parentElement?.querySelectorAll("video"));
    }, [ref]);

    const mutateVideoFrame = useCallback(
        (
            canvas: HTMLCanvasElement,
            ctx: CanvasRenderingContext2D | null,
            video: HTMLVideoElement,
            h: number,
            w: number
        ) => {
            canvas.width = w;
            canvas.height = h;

            if (video.readyState > 1 && ctx) {
                ctx.fillRect(0, 0, w, h);
                ctx.drawImage(video, 0, 0, w, h);
                video.style.backgroundImage = `url(${canvas.toDataURL()})`; // Make video frame the background so it can be captured by html2canvas, this is a workaround
                ctx.clearRect(0, 0, w, h);
            }
        },
        []
    );

    const renderVideos = useCallback(
        (videos: NodeListOf<HTMLVideoElement>) => {
            const canvas = offscreenCanvas.current;
            const ctx = canvas.getContext("2d", { alpha: false });
            let h, w;

            for (let i = 0, len = videos.length; i < len; i++) {
                const v = videos[i];
                if (!v?.src) continue; // no video here

                w = v.videoWidth;
                h = v.videoHeight;
                mutateVideoFrame(canvas, ctx, v, h, w);
            }
        },
        [mutateVideoFrame]
    );

    const [snapshotSettings] = useState({
        x: settings.offset.x,
        y: settings.offset.y,
        scrollX: -window.scrollX,
        scrollY: -window.scrollY,
        width: w,
        height: h,
        foreignObjectRendering: true,
        backgroundColor: settings.background,
        ignoreElements: fnIgnoreElements,
        allowTaint: true,
        useCORS: true,
        logging: settings.debugMode,
        ...settings.overrideHtml2Canvas,
    });

    // snapshot of the DOM
    const captureSnapshot = useCallback(
        async (element: HTMLElement) => {
            if (videos && videos.length > 0) {
                renderVideos(videos);
            }

            return await html2canvas(element, {
                windowWidth: document.documentElement.offsetWidth,
                windowHeight: document.documentElement.offsetHeight,
                ...snapshotSettings,
            });
        },
        [renderVideos, snapshotSettings, videos]
    );

    // gif processor handler
    const [handler] = useState(
        () =>
            new GIF({
                workers: 4,
                quality: isValidQuality(settings.quality),
                workerScript: URL.createObjectURL(workerBlob),
                repeat: settings.loop === false ? -1 : 0, // ignore other falsy values such as null or undefined
                debug: settings.debugMode,
                width: settings.width ?? w,
                height: settings.height ?? h,
            })
    );

    // throttle requestAnimationFrame depending on the framerate
    const _animationFrame = useRef(0);

    const startTime = useRef(0);
    const elapsed = useRef(0);
    const now = useRef(0);
    const then = useRef(0);

    const recordFrames = useCallback(
        async (currentTime: number) => {
            if (!active) {
                window.cancelAnimationFrame(_animationFrame.current);
                return;
            }

            _animationFrame.current =
                window.requestAnimationFrame(recordFrames);
            now.current = currentTime;

            elapsed.current = now.current - then.current;

            // if enough time has passed since the last frame
            if (elapsed.current >= timestep.current) {
                then.current =
                    now.current - (elapsed.current % timestep.current);
                // add frame to gif
                handler.addFrame(
                    await captureSnapshot(ref.current as HTMLElement), // capture DOM element as canvas
                    {
                        delay:
                            timestep.current +
                            (!settings.smoothing ? timestep.current : 0),
                        copy: true,
                    }
                );

                if (settings.debugMode) {
                    console.log(`Frame added in ${elapsed.current}ms`); // expected result = 66.6ms
                }
            }
        },
        [
            active,
            captureSnapshot,
            handler,
            ref,
            settings.debugMode,
            settings.smoothing,
        ]
    );

    useEffect(() => {
        return () => {
            return window.cancelAnimationFrame(_animationFrame.current);
        };
    }, []);

    useEffect(() => {
        if (active) {
            recordFrames(0);
            setStatus("Recording");
        }
    }, [active, recordFrames]);

    const render = useCallback(() => {
        if (!active) {
            throw new Error("GIF must first be started before rendering");
        }

        setActive(false);
        if (_animationFrame.current) {
            window.cancelAnimationFrame(_animationFrame.current);
        }

        handler.render();
    }, [active, handler]);

    const abort = useCallback(() => {
        if (!active) {
            throw new Error("GIF must first be started before aborting");
        }

        setActive(false);
        if (_animationFrame.current) {
            window.cancelAnimationFrame(_animationFrame.current);
        }

        handler.abort();
    }, [active, handler]);

    const start = useCallback(
        (duration?: number) => {
            if (!ref.current) {
                throw new Error("useGif: Element was not provided.");
            }

            if (settings.debugMode) {
                console.log("useGif: Debug Mode Enabled");
            }

            const timeout =
                duration && duration > 0
                    ? setTimeout(render, duration)
                    : undefined;

            const videosExist = videos && videos.length > 0;

            if (videosExist) {
                for (let i = 0, len = videos.length; i < len; i++) {
                    const v = videos[i] as HTMLVideoElement;
                    v.style.backgroundSize = "cover"; // optimize videos for later
                }

                if (settings.debugMode) {
                    console.warn(
                        "useGif: Video(s) found: rendering video frames may cause FPS drops. You can safely ignore this warning."
                    );
                }
            }

            handler.on("start", function () {
                clearTimeout(timeout);

                setIsRendering(true);
                setActive(false);
                setStatus("Processing");

                startTime.current = 0;
                elapsed.current = 0;
                then.current = 0;
                now.current = 0;

                if (videosExist) {
                    for (let i = 0, len = videos.length; i < len; i++) {
                        const v = videos[i] as HTMLVideoElement;
                        v.style.backgroundImage = "";
                        v.style.backgroundSize = "initial";
                    }
                }
            });

            handler.on("progress", function (progress) {
                setProgress(progress * 100);
            });

            setResult(() => {
                return new Promise((resolve) => {
                    handler.on("finished", function (blob, data) {
                        const rawResult = {
                            element: ref.current,
                            blobFormat: blob,
                            url: URL.createObjectURL(blob),
                            data: data,
                        };

                        setStatus("Idle");
                        setIsRendering(false);
                        setProgress(0);
                        resolve(rawResult);

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
            } else {
                console.error("useGif: Invalid element provided.");
            }

            then.current = window.performance.now();
            startTime.current = then.current;
        },
        [
            handler,
            ref,
            render,
            settings.debugMode,
            settings.releaseMemory,
            videos,
        ]
    );

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
};

export { useGif };
