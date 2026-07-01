"use client";

import IntroAnimation from "./components/ui/scroll-morph-hero";

export default function Demo() {
    return (
        <div className="w-full h-[800px] border rounded-lg overflow-hidden relative bg-[#FAFAFA] dark:bg-[#0A0A0A]">
            <IntroAnimation onEnter={() => console.log("Splash Screen Dismissed!")} />
        </div>
    );
}
