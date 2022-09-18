import Image from "next/image";

export default function Issue() {
    return (
        <div className="relative bg-white rounded-xl pt-9 p-6 mx-2 xs:mx-4 shadow-sm">
            <div className="absolute left-1/2 -translate-x-1/2 -top-5 bg-white p-2 rounded-full border-4 border-[#F7F6F9] h-12 w-12 flex justify-center items-center">
                <Image
                    className="object-contain"
                    width={28}
                    height={28}
                    src="/help.svg"
                ></Image>
            </div>
            <div className="flex flex-col justify-center items-center">
                <div className="flex flex-col justify-between items-center gap-3">
                    <h4 className="text-center text-sm sm:text-base font-bold text-[#010042]">
                        Found an Issue?
                    </h4>
                    <p className="text-center text-xs xs:text-sm text-[#868686]">
                        Start a discussion or a pull request!
                    </p>
                    <a
                        href="https://github.com/rortan134/use-gif/issues/new"
                        className="text-sm sm:text-base border text-center rounded border-[#ECECEC] w-10/12 py-2 font-bold text-[#010042] transition-colors hover:bg-[#fdfdfd]"
                        target="_blank"
                    >
                        Report it
                    </a>
                </div>
            </div>
        </div>
    );
}
