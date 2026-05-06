/// <reference types="vite/client" />
/// <reference types="vitest/globals" />

declare module '*.css' {
  const content: string;
  export default content;
}

declare module '*.scss' {
  const content: string;
  export default content;
}
