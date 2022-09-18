import type { NextApiRequest, NextApiResponse } from "next";

const CODEPEN_API_API_PREFIX = "https://codepen.io/api";

const getRawData = (URL: string, height: number) => {
    return fetch(`${CODEPEN_API_API_PREFIX}/oembed?=format=json&url=${URL}&height=${height}`)
        .then((response: any) => response.text())
        .then((data: Promise<any>) => {
            return data;
        });
};

const getHTML = (URL: string) => {
    return fetch(`${URL}.html`)
        .then((response: any) => response.text())
        .then((data: Promise<any>) => {
            return data;
        });
};

const getCSS = (URL: string) => {
    return fetch(`${URL}.css`)
        .then((response: any) => response.text())
        .then((data: Promise<any>) => {
            return data;
        });
};

const getJS = (URL: string) => {
    return fetch(`${URL}.js`)
        .then((response: any) => response.text())
        .then((data: Promise<any>) => {
            return data;
        });
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { query: url } = req;
    const reqUrl = Object.entries(url)[0][1].toString();
    const height = Number(url.height);

    const penData = await getRawData(reqUrl, height);
    const html = await getHTML(reqUrl);
    const css = await getCSS(reqUrl);
    const js = await getJS(reqUrl);

    const data = { penData, html, css, js };

    res.status(200).json(JSON.stringify(data));
}
