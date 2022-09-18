import { renderHook, act } from "@testing-library/react-hooks";

import { defaultOptions, useGif } from "../useGif";

// ToDo

describe("useGif", () => {
    jest.useFakeTimers();

    const el = document.createElement("div");
    const target = { current: el };

    const renderHelper = ({ ref = target, ...rest }) =>
        renderHook(() =>
            useGif(ref, defaultOptions, async (result) => {
                it("should contain a blob as result", () => {
                    expect(result).toBeInstanceOf(Blob); // image/gif blob
                });
            })
        );

    renderHelper({ ref: target });
});
