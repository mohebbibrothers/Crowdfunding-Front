/**
 * Tailwind v4 از طریق PostCSS.
 *
 * چرا PostCSS و نه لودر اختصاصی Turbopack: بیلد تولید روی هاست (CloudLinux با
 * glibc قدیمی) نمی‌تواند باینری بومی SWC را بارگذاری کند و مجبور است با webpack
 * و بایندینگ WASM بسازد. خط لولهٔ PostCSS در هر دو حالت (webpack و Turbopack)
 * یکسان کار می‌کند و ما را از وابستگی به بیلدِ Turbopack بی‌نیاز می‌کند.
 */
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
