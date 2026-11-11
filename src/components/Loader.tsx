import { PuffLoader } from "react-spinners";

type LoaderProps = {
  message: string;
};

export default function Loader({ message }: LoaderProps) {
  return (
    // fills the visible page below the header, so the loader sits in its
    // center
    <div
      aria-live="polite"
      className="grid min-h-[calc(100dvh-14rem)] place-items-center"
    >
      <div className="glass grid place-items-center p-6">
        {/* pulsing rings from the react-spinners library, in the accent
            color of the theme; only decoration, the hidden message says
            what happens */}
        <PuffLoader aria-hidden="true" color="var(--color-accent)" size={56} />
        {/* not shown on the screen, but read by screen readers */}
        <p className="sr-only">{message}</p>
      </div>
    </div>
  );
}
