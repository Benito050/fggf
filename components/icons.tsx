import React from 'react';

const iconProps = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "currentColor",
  className: "w-full h-full"
};

export const StoreIcon: React.FC = () => (
  <svg {...iconProps}>
    <path d="M12 2L1 9l4 12h14l4-12L12 2zm0 2.24L18.66 9H5.34L12 4.24zM5 20v-9h14v9H5zm2-7v2h2v-2H7zm4 0v2h2v-2h-2zm4 0v2h2v-2h-2z" />
  </svg>
);

export const ShoppingCartIcon: React.FC = () => (
  <svg {...iconProps}>
    <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
  </svg>
);

export const UploadIcon: React.FC = () => (
  <svg {...iconProps}>
    <path d="M9 16h6v-6h4l-7-7-7 7h4v6zm-4 2h14v2H5v-2z" />
  </svg>
);

export const SpinnerIcon: React.FC = () => (
  <svg {...iconProps} className="w-full h-full animate-spin" viewBox="0 0 24 24">
    <path fill="none" d="M0 0h24v24H0z" />
    <path d="M12 2v4c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6c0-1.01-.25-1.97-.7-2.8l1.46-1.46C19.54 10.33 20 11.61 20 13c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8z" />
  </svg>
);
// To use spin, add animation to CSS. I'll add it in a style tag for simplicity.
const spinAnimation = `@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } .animate-spin { animation: spin 1s linear infinite; }`;
if (typeof document !== 'undefined' && !document.getElementById('spinner-animation-style')) {
    const style = document.createElement('style');
    style.id = 'spinner-animation-style';
    style.innerHTML = spinAnimation;
    document.head.appendChild(style);
}


export const ArrowLeftIcon: React.FC = () => (
  <svg {...iconProps}>
    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
  </svg>
);

export const SparklesIcon: React.FC = () => (
  <svg {...iconProps}>
    <path d="M12 2L9.5 8.5 3 11l6.5 2.5L12 22l2.5-8.5L21 11l-6.5-2.5z" />
  </svg>
);

export const ChatIcon: React.FC = () => (
  <svg {...iconProps}>
    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
  </svg>
);

export const CloseIcon: React.FC = () => (
  <svg {...iconProps}>
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
  </svg>
);

export const SendIcon: React.FC = () => (
  <svg {...iconProps}>
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
  </svg>
);

export const TrashIcon: React.FC = () => (
    <svg {...iconProps}>
        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
    </svg>
);

export const PlusIcon: React.FC = () => (
  <svg {...iconProps}>
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
  </svg>
);

export const MinusIcon: React.FC = () => (
  <svg {...iconProps}>
    <path d="M19 13H5v-2h14v2z" />
  </svg>
);

export const ListIcon: React.FC = () => (
  <svg {...iconProps}>
    <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" />
  </svg>
);

export const CheckCircleIcon: React.FC = () => (
  <svg {...iconProps}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
  </svg>
);

export const CheckIcon: React.FC = () => (
  <svg {...iconProps}>
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
  </svg>
);
