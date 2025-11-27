/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string; // add any other env variables here
  // readonly VITE_OTHER_ENV: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
