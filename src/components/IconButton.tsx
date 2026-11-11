import type { ReactNode } from "react";

type IconName = "edit" | "delete" | "confirm" | "cancel";

type IconButtonProps = {
  // names the button for screen readers and shows as a tooltip
  label: string;
  icon: IconName;
  onClick: () => void;
  // neutral: quiet; primary: filled in the accent color; danger: filled red
  variant?: "neutral" | "primary" | "danger";
  autoFocus?: boolean;
  // the id of a text that tells more, for example the comment it acts on
  describedBy?: string;
};

// the lines of each icon, from lucide.dev/icons (pencil, trash-2, check, x)
const ICONS: Record<IconName, ReactNode> = {
  edit: (
    <>
      <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
      <path d="m15 5 4 4" />
    </>
  ),
  delete: (
    <>
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </>
  ),
  confirm: <path d="M20 6 9 17l-5-5" />,
  cancel: (
    <>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </>
  ),
};

const VARIANT_CLASS_NAMES = {
  neutral: "text-muted hover:bg-accent/10 hover:text-accent",
  primary: "bg-accent text-white shadow-md hover:bg-accent-strong",
  danger: "bg-red-600 text-white shadow-md hover:bg-red-700",
};

// a round button that shows only an icon
export default function IconButton({
  label,
  icon,
  onClick,
  variant = "neutral",
  autoFocus = false,
  describedBy,
}: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-describedby={describedBy}
      title={label}
      autoFocus={autoFocus}
      onClick={onClick}
      className={`focus-ring grid size-9 shrink-0 cursor-pointer place-items-center rounded-full transition-colors duration-200 motion-reduce:transition-none ${VARIANT_CLASS_NAMES[variant]}`}
    >
      <svg
        aria-hidden="true"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {ICONS[icon]}
      </svg>
    </button>
  );
}
