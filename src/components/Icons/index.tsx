/**
 * Ícones em SVG inline — leves, sempre no mesmo traço e herdando `currentColor`.
 */
import React from "react";

type IconProps = {
  size?: number;
  className?: string;
  strokeWidth?: number;
};

const Base: React.FC<IconProps & { children: React.ReactNode; fill?: boolean }> = ({
  size = 20,
  className,
  strokeWidth = 1.8,
  fill = false,
  children,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill ? "currentColor" : "none"}
    stroke={fill ? "none" : "currentColor"}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
    focusable="false"
  >
    {children}
  </svg>
);

export const IconPlay: React.FC<IconProps> = (p) => (
  <Base {...p} fill>
    <path d="M8 5.14v13.72a1 1 0 0 0 1.52.85l11.14-6.86a1 1 0 0 0 0-1.7L9.52 4.29A1 1 0 0 0 8 5.14z" />
  </Base>
);

export const IconPause: React.FC<IconProps> = (p) => (
  <Base {...p} fill>
    <rect x="6" y="4.5" width="4" height="15" rx="1.4" />
    <rect x="14" y="4.5" width="4" height="15" rx="1.4" />
  </Base>
);

export const IconDownload: React.FC<IconProps> = (p) => (
  <Base {...p}>
    <path d="M12 3v12" />
    <path d="m7 11 5 5 5-5" />
    <path d="M4 20h16" />
  </Base>
);

export const IconShare: React.FC<IconProps> = (p) => (
  <Base {...p}>
    <path d="M12 3v13" />
    <path d="m8 7 4-4 4 4" />
    <path d="M5 12H4v8h16v-8h-1" />
  </Base>
);

export const IconHeart: React.FC<IconProps & { filled?: boolean }> = ({ filled, ...p }) => (
  <Base {...p} fill={filled}>
    <path d="M12 20.5 4.6 13.3a4.7 4.7 0 0 1 0-6.7 4.7 4.7 0 0 1 6.7 0l.7.7.7-.7a4.7 4.7 0 0 1 6.7 0 4.7 4.7 0 0 1 0 6.7z" />
  </Base>
);

export const IconRepeat: React.FC<IconProps> = (p) => (
  <Base {...p}>
    <path d="M17 2.5 20.5 6 17 9.5" />
    <path d="M3.5 12V9.5A3.5 3.5 0 0 1 7 6h13.5" />
    <path d="M7 21.5 3.5 18 7 14.5" />
    <path d="M20.5 12v2.5a3.5 3.5 0 0 1-3.5 3.5H3.5" />
  </Base>
);

export const IconSearch: React.FC<IconProps> = (p) => (
  <Base {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </Base>
);

export const IconSort: React.FC<IconProps> = (p) => (
  <Base {...p}>
    <path d="M4 6h16" />
    <path d="M6 12h12" />
    <path d="M9 18h6" />
  </Base>
);

export const IconFilter: React.FC<IconProps> = (p) => (
  <Base {...p}>
    <path d="M3 5h18l-7 8v6l-4 2v-8z" />
  </Base>
);

export const IconPlus: React.FC<IconProps> = (p) => (
  <Base {...p}>
    <path d="M12 5v14M5 12h14" />
  </Base>
);

export const IconClose: React.FC<IconProps> = (p) => (
  <Base {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Base>
);

export const IconCheck: React.FC<IconProps> = (p) => (
  <Base {...p}>
    <path d="m4 12.5 5 5L20 6.5" />
  </Base>
);

export const IconUser: React.FC<IconProps> = (p) => (
  <Base {...p}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
  </Base>
);

export const IconLogout: React.FC<IconProps> = (p) => (
  <Base {...p}>
    <path d="M15 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4" />
    <path d="M10 8 6 12l4 4" />
    <path d="M6 12h10" />
  </Base>
);

export const IconLock: React.FC<IconProps> = (p) => (
  <Base {...p}>
    <rect x="4" y="10" width="16" height="11" rx="2.5" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
  </Base>
);

export const IconMail: React.FC<IconProps> = (p) => (
  <Base {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <path d="m3.5 7 8.5 6 8.5-6" />
  </Base>
);

export const IconInstall: React.FC<IconProps> = (p) => (
  <Base {...p}>
    <rect x="6" y="2.5" width="12" height="19" rx="2.5" />
    <path d="M12 7.5v7" />
    <path d="m9 11.5 3 3 3-3" />
  </Base>
);

export const IconWave: React.FC<IconProps> = (p) => (
  <Base {...p}>
    <path d="M3 12h2M8 7v10M12 4v16M16 8v8M20 11h1" />
  </Base>
);

export const IconUpload: React.FC<IconProps> = (p) => (
  <Base {...p}>
    <path d="M12 16V4" />
    <path d="m7 9 5-5 5 5" />
    <path d="M4 15v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4" />
  </Base>
);

export const IconTrash: React.FC<IconProps> = (p) => (
  <Base {...p}>
    <path d="M4 7h16" />
    <path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    <path d="M6 7l1 12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-12" />
    <path d="M10 11v6M14 11v6" />
  </Base>
);

export const IconEdit: React.FC<IconProps> = (p) => (
  <Base {...p}>
    <path d="M4 20h4l10-10a2.8 2.8 0 0 0-4-4L4 16z" />
    <path d="m13.5 6.5 4 4" />
  </Base>
);

export const IconMenu: React.FC<IconProps> = (p) => (
  <Base {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Base>
);

export const IconAlert: React.FC<IconProps> = (p) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7.5v5.5" />
    <path d="M12 16.2v.3" />
  </Base>
);

export const IconMusic: React.FC<IconProps> = (p) => (
  <Base {...p}>
    <path d="M9 18V5l11-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="17" cy="16" r="3" />
  </Base>
);

/** Marca do site: respingo vermelho com o "4". */
export const BrandMark: React.FC<{ size?: number; className?: string }> = ({
  size = 32,
  className,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    className={className}
    aria-hidden="true"
    focusable="false"
  >
    <g fill="#e5322d">
      <circle cx="50" cy="53" r="30" />
      <circle cx="29" cy="35" r="16" />
      <circle cx="67" cy="28" r="12.5" />
      <circle cx="76" cy="57" r="17" />
      <circle cx="62" cy="78" r="14.5" />
      <circle cx="33" cy="71" r="12.5" />
      <circle cx="21" cy="56" r="10.5" />
      <circle cx="45" cy="21" r="11.5" />
      <circle cx="81" cy="40" r="8.5" />
      <circle cx="12" cy="24" r="3.6" />
      <circle cx="88" cy="19" r="2.2" />
      <circle cx="92" cy="78" r="3.4" />
      <circle cx="10" cy="79" r="2.8" />
      <circle cx="24" cy="10" r="1.9" />
      <circle cx="68" cy="93" r="2.6" />
    </g>
    <path
      d="M56.5 20h11.5v62H56.5zM26 57.5h53v11H26zM56.5 20h11.5L40 68.5H26z"
      fill="var(--bg, #0a0b0d)"
    />
  </svg>
);
