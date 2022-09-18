import "../styles/index.css";
import type { AppProps } from "next/app";

import Layout from "../components/Layout";

import { AppContextProvider } from "../shared/context";

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <AppContextProvider>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </AppContextProvider>
        </>
    );
}

export default MyApp;
