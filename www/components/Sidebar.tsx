import { useState, useEffect, useRef, Fragment } from "react";

import Simplebar from "simplebar-react";

import Issue from "./Issue";
import PreviewDisplay from "./PreviewDisplay";

import { useAppContext } from "../shared/context";

import "simplebar/dist/simplebar.min.css";

export default function Sidebar() {
    const { urls } = useAppContext();
    const [isAtTop, setIsAtTop] = useState(true);

    const scrollRef = useRef<Simplebar>(null);

    useEffect(() => {
        if (!scrollRef.current) return;

        const bar = scrollRef.current?.getScrollElement();

        bar.addEventListener("scroll", () => {
            if (bar.scrollTop >= 100) {
                setIsAtTop(false);
            } else {
                setIsAtTop(true);
            }
        });
    }, [scrollRef]);

    const SkeletonFallback = () => {
        return (
            <>
                {[...Array(6)].map((e, i) => (
                    <Fragment key={i}>
                        <button className="w-28 h-28 bg-white rounded-lg animate-skeleton"></button>
                    </Fragment>
                ))}
            </>
        );
    };

    return (
        <div
            className={`relative sm:w-64 md:w-72 h-full bg-[#F7F6F9] rounded-r-3xl pb-64 px-2 font-poppins flex flex-col justify-between items-center transition-[padding] duration-200 ease-linear ${
                isAtTop ? "pt-8" : "pt-2"
            }`}
        >
            <div className="h-full w-full shrink">
                <span
                    className={`block px-4 font-light text-sm transition-[transform,opacity] ease-in-out duration-200 ${
                        isAtTop ? "" : "relative -translate-y-full opacity-0"
                    }`}
                >
                    Demo
                </span>
                <h1 className="px-4 mb-2 font-light text-base text-[#4484fc]">
                    <a
                        href="https://github.com/rortan134/use-gif"
                        target="_blank"
                    >
                        UseGif React Hook
                    </a>
                </h1>
                <div className="h-full w-full overflow-hidden">
                    <Simplebar
                        ref={scrollRef}
                        className="overflow-x-hidden h-full"
                    >
                        <div className="m-auto w-11/12 h-[0.5px] bg-black/10 mb-3 rounded-2xl" />
                        <h2 className="px-4 mb-4 font-bold text-base text-[#010042]">
                            Try recording some of these CSS animations!
                        </h2>
                        <div className="relative w-full h-full place-items-center grid grid-cols-2 gap-y-4 px-2">
                            {urls.length > 0 ? (
                                urls.map((url: string, i: number) => (
                                    <Fragment key={i}>
                                        <PreviewDisplay url={url} />
                                    </Fragment>
                                ))
                            ) : (
                                <SkeletonFallback />
                            )}
                        </div>
                    </Simplebar>
                </div>
            </div>
            <div className="fixed bottom-3 flex-1 grow">
                <Issue />
            </div>
        </div>
    );
}
