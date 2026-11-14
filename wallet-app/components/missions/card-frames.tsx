import Image from "next/image";
import type { ReactNode } from "react";
import type { Mission, MissionFrame } from "@/lib/mission-data";

// The tilted card frames are exported vectors from Figma. Every card in the design has its own
// slightly different frame, so each variant keeps the exact position and transform from Figma.

const DIR = "/missions/frames";

type Box = { left: number; top: number; width: number; height: number };
type Size = { width: number; height: number };

const FULL_BOX: Box = { left: -62.61, top: -78.73, width: 532.204, height: 391.665 };
const FILL_INNER: Size = { width: 424.396, height: 267.63 };
const LINE_INNER: Size = { width: 423.724, height: 294.706 };
const FILL_INSET = "0.87% 1.4% 1.59% 1%";
const LINE_INSET = "1.06% 1.25% 1.59% 1.19%";
const EXTRA_INSET = "0.72% 1.01% 1.25% 0.96%";

// Mirrors its children around the card's centre (Figma's "flip horizontal")
function Flip({ children }: { children: ReactNode }) {
  return <div className="pointer-events-none absolute inset-0 -scale-x-100">{children}</div>;
}

// A vector that sits flat at its Figma bounding box
function FlatLayer({ src, box }: { src: string; box: Box }) {
  return (
    <Image
      src={src}
      alt=""
      aria-hidden
      width={Math.round(box.width)}
      height={Math.round(box.height)}
      className="pointer-events-none absolute max-w-none"
      style={box}
    />
  );
}

// A vector drawn inside a rotated + skewed box — same structure Figma uses for transformed layers.
// `tilt` is a plain CSS transform written as rotate → skewX → scale, the order Figma's values
// assume. (Tailwind v4's rotate/scale/skew classes apply in a different order, which bends
// mirrored frames the wrong way.)
function TiltedLayer({
  src,
  box,
  tilt,
  inner,
  inset,
}: {
  src: string;
  box: Box;
  tilt: string;
  inner: Size;
  inset: string;
}) {
  return (
    <div className="pointer-events-none absolute flex items-center justify-center" style={box}>
      <div className="flex-none" style={{ transform: tilt }}>
        <div className="relative" style={inner}>
          <div className="absolute" style={{ inset }}>
            <Image src={src} alt="" aria-hidden fill sizes="425px" className="max-w-none" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Drawn below the text
export function FrameUnder({ frame }: { frame: MissionFrame }) {
  switch (frame) {
    case "a":
      return <FlatLayer src={`${DIR}/a.svg`} box={FULL_BOX} />;
    case "b":
      return (
        <Flip>
          <FlatLayer src={`${DIR}/b.svg`} box={FULL_BOX} />
        </Flip>
      );
    case "c":
      return (
        <>
          <TiltedLayer
            src={`${DIR}/c-fill.svg`}
            box={{ left: -41, top: -47, width: 495.208, height: 339.129 }}
            tilt="rotate(-11.34deg) skewX(5.85deg) scaleY(0.99)"
            inner={FILL_INNER}
            inset={FILL_INSET}
          />
          <TiltedLayer
            src={`${DIR}/line.svg`}
            box={{ left: -56.39, top: -67.38, width: 519.757, height: 368.979 }}
            tilt="rotate(-12.85deg) skewX(8.36deg) scaleY(0.99)"
            inner={LINE_INNER}
            inset={LINE_INSET}
          />
        </>
      );
    case "d":
      return (
        <Flip>
          <FlatLayer src={`${DIR}/d.svg`} box={{ left: -57.58, top: -69.44, width: 522.155, height: 373.098 }} />
        </Flip>
      );
    case "e":
      return (
        <>
          <TiltedLayer
            src={`${DIR}/e-fill.svg`}
            box={{ left: -41, top: -47.36, width: 495.208, height: 339.129 }}
            tilt="rotate(-11.34deg) skewX(5.85deg) scaleY(0.99)"
            inner={FILL_INNER}
            inset={FILL_INSET}
          />
          <TiltedLayer
            src={`${DIR}/line.svg`}
            box={{ left: -57.47, top: -69.24, width: 521.92, height: 372.69 }}
            tilt="rotate(-13.55deg) skewX(8.36deg) scaleY(0.99)"
            inner={LINE_INNER}
            inset={LINE_INSET}
          />
        </>
      );
    case "f":
      return (
        <Flip>
          <FlatLayer src={`${DIR}/f.svg`} box={FULL_BOX} />
        </Flip>
      );
    case "g":
      return <FlatLayer src={`${DIR}/g.svg`} box={FULL_BOX} />;
  }
}

// Extra gold outline that Figma draws above the text (only some frames have it)
export function FrameOver({ frame }: { frame: MissionFrame }) {
  switch (frame) {
    case "c":
    case "e":
      return (
        <TiltedLayer
          src={`${DIR}/extra.svg`}
          box={{ left: -63.36, top: -80.76, width: 532.921, height: 393.096 }}
          tilt="rotate(-17.6deg) skewX(8.36deg) scaleY(0.99)"
          inner={LINE_INNER}
          inset={EXTRA_INSET}
        />
      );
    case "d":
      return (
        <TiltedLayer
          src={`${DIR}/extra.svg`}
          box={{ left: -73, top: -82, width: 532.204, height: 391.665 }}
          tilt="rotate(-162.69deg) skewX(-8.36deg) scaleY(-0.99)"
          inner={LINE_INNER}
          inset={EXTRA_INSET}
        />
      );
    default:
      return null;
  }
}

// Figma "Vector 1642": black 30% shape with a background blur (radius 5) over a finished card
const OVERLAY_PATH =
  "M401.571 89.3181L75.1583 0.563112C67.3877 -1.54979 59.2576 2.44166 56.1771 9.88188L1.22164 142.614C-2.21906 150.924 1.86393 160.436 10.2581 163.667L327.694 285.827C335.941 289.001 345.199 284.888 348.373 276.641L412.305 110.504C415.71 101.656 410.718 91.8055 401.571 89.3181Z";

function BlurPane({ box, tilt }: { box: Box; tilt: string }) {
  return (
    <div className="pointer-events-none absolute flex items-center justify-center" style={box}>
      <div className="flex-none" style={{ transform: tilt }}>
        <div className="relative" style={LINE_INNER}>
          <div
            className="absolute bg-black/30 backdrop-blur-[2.5px]"
            style={{ inset: LINE_INSET, clipPath: `path("${OVERLAY_PATH}")` }}
          />
        </div>
      </div>
    </div>
  );
}

// The picture-right pane is the picture-left shape mirrored, written as one transform
// (same mirroring as the extra outline on frame "d")
export function CompletedOverlay({ layout }: { layout: Mission["layout"] }) {
  return layout === "image-right" ? (
    <BlurPane
      box={{ left: -72, top: -79, width: 532.204, height: 391.665 }}
      tilt="rotate(-162.69deg) skewX(-8.36deg) scaleY(-0.99)"
    />
  ) : (
    <BlurPane
      box={{ left: -63.71, top: -78, width: 533.211, height: 393.68 }}
      tilt="rotate(-17.72deg) skewX(8.36deg) scaleY(0.99)"
    />
  );
}

export function CompletedStamp({ layout }: { layout: Mission["layout"] }) {
  const isRight = layout === "image-right";
  return (
    <Image
      src={`${DIR}/stamp.svg`}
      alt="ภารกิจสำเร็จ"
      width={269}
      height={115}
      className={`pointer-events-none absolute max-w-none ${
        isRight ? "top-[55px] left-[64px]" : "top-[54px] left-[59px] drop-shadow-[0px_4px_2px_black]"
      }`}
      style={{ width: 269.008, height: 114.999 }}
    />
  );
}
