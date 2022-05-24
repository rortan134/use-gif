import React, { useRef } from "react";
import { createRoot } from "react-dom/client";
import useGif from "../src";

// @ts-expect-error: Force parcel to serve file with "url:"
import video from "url:./video.mp4";

const css = `
body {
    background: radial-gradient(#fff, #aaa);
    background-size: 100vw 100vh;
    overflow: hidden;
    height: 100vh;
    width: 100%;
    overflow: hidden;
    position: relative;
  }
  
  .txt {
    text-align: center;
    font-family: "Roboto";
    font-size: 12vmin;
    font-weight: 700;
    animation: netflix_style 3.5s infinite;
    outline: none;
    white-space: nowrap;
  }
  
  @keyframes netflix_style {
    0% {
      text-shadow: 0px 0px transparent, 1px 1px #aaa, 2px 2px #aaa, 3px 3px #aaa, 4px 4px #aaa, 5px 5px #aaa, 6px 6px #aaa, 7px 7px #aaa, 8px 8px #aaa, 9px 9px #aaa, 10px 10px #aaa, 11px 11px #aaa, 12px 12px #aaa, 13px 13px #aaa, 14px 14px #aaa, 15px 15px #aaa, 16px 16px #aaa, 17px 17px #aaa, 18px 18px #aaa, 19px 19px #aaa, 20px 20px #aaa, 21px 21px #aaa, 22px 22px #aaa, 23px 23px #aaa, 24px 24px #aaa, 25px 25px #aaa, 26px 26px #aaa, 27px 27px #aaa, 28px 28px #aaa, 29px 29px #aaa, 30px 30px #aaa, 31px 31px #aaa, 32px 32px #aaa, 33px 33px #aaa, 34px 34px #aaa, 35px 35px #aaa, 36px 36px #aaa, 37px 37px #aaa, 38px 38px #aaa, 39px 39px #aaa, 40px 40px #aaa, 41px 41px #aaa, 42px 42px #aaa, 43px 43px #aaa, 44px 44px #aaa, 45px 45px #aaa, 46px 46px #aaa, 47px 47px #aaa, 48px 48px #aaa, 49px 49px #aaa, 50px 50px #aaa, 51px 51px #aaa, 52px 52px #aaa, 53px 53px #aaa, 54px 54px #aaa, 55px 55px #aaa, 56px 56px #aaa, 57px 57px #aaa, 58px 58px #aaa, 59px 59px #aaa, 60px 60px #aaa, 61px 61px #aaa, 62px 62px #aaa, 63px 63px #aaa, 64px 64px #aaa, 65px 65px #aaa, 66px 66px #aaa, 67px 67px #aaa, 68px 68px #aaa, 69px 69px #aaa, 70px 70px #aaa, 71px 71px #aaa, 72px 72px #aaa, 73px 73px #aaa, 74px 74px #aaa, 75px 75px #aaa, 76px 76px #aaa, 77px 77px #aaa, 78px 78px #aaa, 79px 79px #aaa, 80px 80px #aaa, 81px 81px #aaa, 82px 82px #aaa, 83px 83px #aaa, 84px 84px #aaa, 85px 85px #aaa, 86px 86px #aaa, 87px 87px #aaa, 88px 88px #aaa, 89px 89px #aaa, 90px 90px #aaa, 91px 91px #aaa, 92px 92px #aaa, 93px 93px #aaa, 94px 94px #aaa, 95px 95px #aaa, 96px 96px #aaa, 97px 97px #aaa, 98px 98px #aaa, 99px 99px #aaa, 100px 100px #aaa;
      color: #f3f3f3;
      transform: scale(1.5, 1.5);
    }
    10% {
      text-shadow: 0px 0px transparent, 1px 1.5px #aaa, 2px 3px #aaa, 3px 4.5px #aaa, 4px 6px #aaa, 5px 7.5px #aaa, 6px 9px #aaa, 7px 10.5px #aaa, 8px 12px #aaa, 9px 13.5px #aaa, 10px 15px #aaa, 11px 16.5px #aaa, 12px 18px #aaa, 13px 19.5px #aaa, 14px 21px #aaa, 15px 22.5px #aaa, 16px 24px #aaa, 17px 25.5px #aaa, 18px 27px #aaa, 19px 28.5px #aaa, 20px 30px #aaa, 21px 31.5px #aaa, 22px 33px #aaa, 23px 34.5px #aaa, 24px 36px #aaa, 25px 37.5px #aaa, 26px 39px #aaa, 27px 40.5px #aaa, 28px 42px #aaa, 29px 43.5px #aaa, 30px 45px #aaa, 31px 46.5px #aaa, 32px 48px #aaa, 33px 49.5px #aaa, 34px 51px #aaa, 35px 52.5px #aaa, 36px 54px #aaa, 37px 55.5px #aaa, 38px 57px #aaa, 39px 58.5px #aaa, 40px 60px #aaa, 41px 61.5px #aaa, 42px 63px #aaa, 43px 64.5px #aaa, 44px 66px #aaa, 45px 67.5px #aaa, 46px 69px #aaa, 47px 70.5px #aaa, 48px 72px #aaa, 49px 73.5px #aaa, 50px 75px #aaa, 51px 76.5px #aaa, 52px 78px #aaa, 53px 79.5px #aaa, 54px 81px #aaa, 55px 82.5px #aaa, 56px 84px #aaa, 57px 85.5px #aaa, 58px 87px #aaa, 59px 88.5px #aaa, 60px 90px #aaa, 61px 91.5px #aaa, 62px 93px #aaa, 63px 94.5px #aaa, 64px 96px #aaa, 65px 97.5px #aaa, 66px 99px #aaa, 67px 100.5px #aaa, 68px 102px #aaa, 69px 103.5px #aaa, 70px 105px #aaa, 71px 106.5px #aaa, 72px 108px #aaa, 73px 109.5px #aaa, 74px 111px #aaa, 75px 112.5px #aaa, 76px 114px #aaa, 77px 115.5px #aaa, 78px 117px #aaa, 79px 118.5px #aaa, 80px 120px #aaa, 81px 121.5px #aaa, 82px 123px #aaa, 83px 124.5px #aaa, 84px 126px #aaa, 85px 127.5px #aaa, 86px 129px #aaa, 87px 130.5px #aaa, 88px 132px #aaa, 89px 133.5px #aaa, 90px 135px #aaa, 91px 136.5px #aaa, 92px 138px #aaa, 93px 139.5px #aaa, 94px 141px #aaa, 95px 142.5px #aaa, 96px 144px #aaa, 97px 145.5px #aaa, 98px 147px #aaa, 99px 148.5px #aaa, 100px 150px #aaa;
      color: #f3f3f3;
      transform: scale(1.5, 1.5);
    }
    15% {
      color: #f3f3f3;
    }
    20% {
      color: #e90418;
      text-shadow: none;
      transform: scale(1.1, 1.1);
    }
    75% {
      opacity: 1;
    }
    80% {
      opacity: 0;
      color: #e90418;
      transform: scale(0.85, 0.9);
    }
    100% {
      opacity: 0;
    }
  }

.container {
    height: 100%;
    width: 100%;
    padding: 4rem 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.button {
    outline: none;
    border: none;
    padding: 6px;
    color: #383838;
    border-radius: 4px;
    margin: 2px 4px;
}

.interaction {
    position: absolute;
    padding: .5rem;
    left: 50%;
    transform: translateX(-50%);
    top: 0;
}

.wrapper {
    height: 100vh;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
}

.section {
    height: 100%;
}

.img {
    width: auto;
    height: 500px;
}

.progressBar {
    width: 0px;
    height: 2px;
    background-color: blue;
    position: absolute;
    top: 0;
    left: 0;
}
`;

const App = () => {
    const gifRef = useRef(null);

    const { start, render, abort, progress, status } = useGif(
        gifRef,
        {
            framerate: 15,
            quality: 5,
            background: "#fff",
            releaseMemory: false,
        },
        // callback function
        async (result) => {
            console.log("callback", result);

            // open gif in browser
            window.open((await result).url);
        }
    );

    return (
        <>
            <style>{css}</style>
            <div className="progressBar" style={{ width: `${progress}%` }} />

            <div className="interaction">
                <button className="button" onClick={start}>
                    Start Recording
                </button>
                <button className="button" onClick={render}>
                    Stop Recording
                </button>
                <button className="button" onClick={abort}>
                    Abort
                </button>

                <span style={{ margin: "0 1rem" }}>Status: {status}</span>
                {status === "Processing" && (
                    <span>
                        Rendering Progress: {`${Number(progress.toFixed(2))}%`}
                    </span>
                )}
            </div>

            <div className="wrapper">
                <div ref={gifRef} className="container section">
                    <video
                        style={{ display: "block" }}
                        width="500"
                        height="500"
                        src={video}
                        autoPlay
                        muted
                        loop
                    ></video>
                    <div
                        className="txt"
                        contentEditable="true"
                        suppressContentEditableWarning
                    >
                        Wow!
                    </div>
                </div>
            </div>
        </>
    );
};

const container = document.getElementById("root");
createRoot(container).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
