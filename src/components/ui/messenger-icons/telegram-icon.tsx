export function TelegramIcon({ size = 48 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="24" cy="24" r="24" fill="#29B6F6" />
      <path
        d="M34.9 13.4L30.4 35.2C30.1 36.5 29.3 36.8 28.2 36.2L21.7 31.4L18.6 34.4C18.2 34.8 17.9 35.1 17.2 35.1L17.7 28.4L29.6 17.7C30.1 17.3 29.5 17.0 28.8 17.4L14.0 26.7L7.7 24.7C6.4 24.3 6.3 23.4 7.9 22.7L33.1 12.7C34.2 12.3 35.2 13.0 34.9 13.4Z"
        fill="white"
      />
    </svg>
  );
}
