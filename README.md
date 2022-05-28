# use-gif

### React hook for creating client-side GIFs from DOM animations.

<br/>

`⚠️ This library is experimental and is not recommended to be used in production.`

## Demo
Work in progress... Try coming back later.

## Usage

### _Installation:_

    npm install --save use-gif

### _Hook:_

    const { start, render, abort, progress, status, isRendering, isProcessing, result } = useGif(ref, options, callback);

### - _Recording a GIF:_

This library works by first recording the animation you want to convert to a GIF and then rendering, it uses [html2canvas][1] under the hood to capture the elements by first looking at the available information on each node, this means it may not be a 100% accurate representation and you're the one responsible for how the end result will look.

For this reason you must give the most information possible about an element's style & animations, CSS animations must include proper animation-\* properties separately (animation-name, animation-fill-mode, animation-duration...) as the `animation` shorthand may cause rendering issues. For more information please visit html2canvas's [documentation][3].

This library is powered by [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), for older browser support please consider using a polyfill.

    import React from "react"
    import useGif from "use-gif"

    const App = () => {
        const ref = useRef(null);
        const { start, render, abort } = useGif(ref, { background: "#fff" },
            // callback function
            async (result) => {
                    console.log("result object:", resul
                // open gif in browser
                window.open((await result).url);
            }
        );

        // handle start and rendering...

        return (
            <div ref={ref} className="bounce-animation">
                Hey! I am bouncing!
            </div>
        )
    }

### Output:

![Output](https://imgur.com/SJC3QqH.gif)

Anything inside the ref will be part of the GIF's output, for any rendering issues please visit html2canvas's [documentation][3]. 

### - _Advanced Usage:_

Recording videos are also possible:
You can combine this library with [FileSaver][4] and download your GIF result.

    import React from "react"
    import useGif from "use-gif"
    import { saveAs } from 'file-saver';

    import demoVideo from "./video.mp4";

    const App = () => {
        const ref = useRef(null);
        const { start, render, abort } = useGif(
            ref,
            {
                framerate: 15,
                quality: 10,
                background: "#fff",
                releaseMemory: false,
                debugMode: true,
            },
            async (result) => {
                saveAs(result.blobFormat, "myGif.gif")
            }
        );

        return (
            <div>
                <div ref={ref} className="wrapper">
                    <video src={demoVideo} style={{ width: "500px", height: "500px" }} autoplay muted loop>
                </div>
                <button onClick={start}>Start Recording</button>
                <button onClick={render}>Render Recording</button>
                <button onClick={abort}>Abort Recording</button>
            </div>
        )
    }

#### You can also provide a duration to `start()` which will automatically render your GIF after the provided time (in miliseconds) has passed:

        const { start, abort, status } = useGif(ref, options,
            async (result) => {
                saveAs(result.blobFormat, "myGif.gif")
            }
        );

        return (
            <div ref={ref} className="wrapper">
                <video src={demoVideo} style={{ width: "500px", height: "500px" }} autoplay muted loop>
                <button onClick={() => start(10000)}>
            </div>
        )

#### If you don't like having a callback function to access your result, you can also use the `{ result }` state.
    
    const { result } = useGif(ref, options) 

    useEffect(() => {
        console.log(result)
    }, [result])

### - _User Feedback:_

The hook provides two ways of reacting UI:

`isRecording` and `isRendering` provide two booleans states that are available at any given moment:

    if (!isRecording && !isRendering) {
        return <span>Try recording a GIF.</span>
    }

    if (isRecording) {
        return <span>Your GIF is being recorded, smile!</span>
    }

    if (isRendering) {
        return <span>Your GIF is being processed.</span>
    }

    if (result) {
        return <img src={result.url} alt="" />
    }

    // ...

If booleans aren't your thing, the `status` property returns a string which can be either "Idle", "Recording" or "Processing".

    const { status, result } = useGif(ref)

    if (status === "Idle") {
        return <span>Try recording a GIF.</span>
    }

    if (status === "Recording") {
        return <span>Your GIF is being recorded, smile!</span>
    }

    if (status === "Processing") {
        return <span>Your GIF is being processed.</span>
    }

    if (result) {
        return <img src={result.url} alt="" />
    }

    // ...

### - _Override:_

You can override [html2canvas][1] settings with the `overrideHtml2Canvas` property

    const { start, render, abort } = useGif(
        ref,
        {
            // ...
            overrideHtml2Canvas: {
                allowTaint: false,
            }
        },
    );

## Options

useGif hook options 

| Name         | Default         | Description                                        |
| -------------|-----------------|----------------------------------------------------|
| framerate    | `15`            | GIF's framerate, limit is 50 due to .gif limitations |
| quality      | `10`            | Pixel sample interval, lower is better             |
| loop         | `true`          | Loop GIF                                           |
| background   | `transparent`   | Background color                                   |
| width        | `auto`          | Output image width                                 |
| height       | `auto`          | Output image height                                |
| releaseMemory| `true`          | Will revoke result URL after 5 seconds             |
| smoothing    | `true`          | Whether to smooth GIF's frames                     |
| debugMode    | `false`         | Prints extra information to Console                |
| overrideHtml2Canvas | `{}`     | Override default [html2canvas][1] options          |



#### This library depends on **[html2canvas][1]** and **[gif.js][2]**

#### Released under [MIT license](https://github.com/rortan134/use-gif).

[1]: https://github.com/niklasvh/html2canvas
[2]: https://github.com/jnordberg/gif.js
[3]: https://html2canvas.hertzen.com/documentation
[4]: https://github.com/eligrey/FileSaver.js/
