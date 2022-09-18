import { ReactNode } from "react";

export default function Header() {
    const Button = ({
        children,
        className,
        ...rest
    }: {
        children: ReactNode | ReactNode[] | string;
        className?: string;
    }) => {
        return (
            <button className={`px-2 py-1 text-white rounded-lg ${className}`} {...rest}>
                {children}
            </button>
        );
    };

    return (
        <div className="w-full h-14 z-50 bg-white">
            <div className="w-full flex justify-end items-center py-2 px-4 gap-2">
                <Button className="bg-[#009e60]">Record</Button>
                <Button className="bg-[#009e60]">Render</Button>
                <Button className="bg-red-400 ml-4">Abort</Button>
            </div>
        </div>
    );
}
