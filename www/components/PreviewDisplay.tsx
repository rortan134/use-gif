import Image from "next/image";
import { useState, useEffect, useRef } from "react";

import { useOnScreen } from "../hooks/useOnScreen";
import { useAppContext } from "../shared/context";

import { EmbedResponse } from "../types";

const PreviewDisplay = ({ url }: { url: string }) => {
    const { setActivePen } = useAppContext();

    const [pen, setPen] = useState<EmbedResponse>();
    const [error, setError] = useState(false);

    const displayRef = useRef(null);

    const isOnScreen = useOnScreen(displayRef);

    useEffect(() => {
        if (!url) return;

        const fetchData = async () => {
            try {
                const response = await fetch(
                    `http://localhost:3000/api/getEmbed?=${url}&height=${window.innerHeight + 50}`
                );
                const data = JSON.parse(await response.json());

                return data;
            } catch (err) {
                setError(true);
                console.error(err);
            }
        };

        if (isOnScreen && !pen) {
            fetchData().then((data: any) => {
                setPen(JSON.parse(data.penData));
            });
        }
    }, [url, isOnScreen]);

    return (
        <div
            ref={displayRef}
            className="w-28 h-28 bg-white rounded-lg flex items-center justify-center"
        >
            {error || pen?.success === false ? (
                <Image
                    className="object-contain h-full w-full rounded-lg"
                    src="/warning.svg"
                    width={45}
                    height={45}
                    title="An error has ocurred"
                />
            ) : !pen ? (
                <button className="w-28 h-28 rounded-lg animate-skeleton" />
            ) : (
                <button
                    className="w-28 h-28 rounded-lg hover:grayscale-[35%]"
                    onClick={() => {
                        setActivePen({ pen: pen, url: url });
                    }}
                >
                    <Image
                        className="object-cover h-full w-full rounded-lg"
                        src={pen.thumbnail_url}
                        width={120}
                        height={120}
                        layout="responsive"
                        alt={pen.title}
                        title={`${pen.title} by ${pen.author_name}`}
                    />
                </button>
            )}
        </div>
    );
};

export default PreviewDisplay;
