// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

// URL to get animations
const URL = "https://animatedbackgrounds.me";

const getRawData = (URL: string) => {
    return fetch(URL)
        .then((response: any) => response.text())
        .then((data: Promise<any>) => {
            return data;
        });
};

const getData = async () => {
    const scrapedData = await getRawData(URL);
    return scrapedData;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "GET") {
        const data = await getData();

        res.status(200).json(data);
    }
}
