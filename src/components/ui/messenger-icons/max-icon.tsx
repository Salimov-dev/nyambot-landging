export function MaxIcon({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="max-bg" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#5B8DEF" />
          <stop offset="0.5" stopColor="#7B5CE5" />
          <stop offset="1" stopColor="#9B4ED8" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="12" fill="url(#max-bg)" />
      {/* Outer D-shape (chat bubble) */}
      <path
        d="M24 10C16.268 10 10 16.268 10 24C10 27.5 11.3 30.7 13.5 33.1L12 38L17.2 36.6C19.4 37.8 21.6 38.5 24 38.5C31.732 38.5 38 32.232 38 24.25C38 16.268 31.732 10 24 10Z"
        fill="white"
      />
      {/* Inner circle cutout */}
      <circle cx="24" cy="24" r="7" fill="url(#max-bg)" />
    </svg>
  );
}
