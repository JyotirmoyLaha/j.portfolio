import { Spotlight } from "@/components/ui/spotlight";

export function SplineSceneBasic() {
  return (
    <div className="absolute inset-0 w-full h-full bg-transparent overflow-visible pointer-events-auto flex items-center justify-end pr-[1%] lg:pr-[2%] z-0">
      {/* Glow Spotlight behind where the robot was */}
      <Spotlight
        className="top-5 right-2 lg:right-4 md:top-10 opacity-75 pointer-events-none scale-75"
        fill="rgba(34, 211, 238, 0.4)"
      />
    </div>
  )
}


