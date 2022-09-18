import Sidebar from "./Sidebar";
import Header from "./Header";

export default function Layout({
    children,
}: {
    children: React.ReactNode | React.ReactNode[];
}) {
    return (
        <main className="relative flex h-full w-full overflow-hidden">
            <div className="flex-shrink h-full">
                <Sidebar />
            </div>
            <div className="relative flex flex-col h-full flex-grow">
                <Header />
                <div role="application" className="h-full select-none">
                    {children}
                </div>
            </div>
        </main>
    );
}
