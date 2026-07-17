import { contextBridge, ipcRenderer } from "electron";

interface IconStyle {
  fgColor: string | null;
  bgColor: string | null;
  bgShape: "none" | "square" | "circle";
}

/**
 * Preload para a janela de configuracoes.
 */
contextBridge.exposeInMainWorld("configAPI", {
  getTrayStyle: () => ipcRenderer.invoke("get-tray-style"),
  setTrayStyle: (style: IconStyle) => ipcRenderer.invoke("set-tray-style", style),
  iconDataUrl: (style: IconStyle) => ipcRenderer.invoke("get-icon-preview", style),

  getAutostart: () => ipcRenderer.invoke("get-autostart"),
  setAutostart: (enabled: boolean) => ipcRenderer.invoke("set-autostart", enabled),

  getLocale: () => ipcRenderer.invoke("get-locale"),
  setLocale: (locale: string) => ipcRenderer.invoke("set-locale", locale),
  getLocales: () => ipcRenderer.invoke("get-locales"),
  getStrings: () => ipcRenderer.invoke("get-strings"),
});
