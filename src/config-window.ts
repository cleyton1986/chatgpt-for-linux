import { BrowserWindow, app, shell } from "electron";
import path from "path";
import Settings from "./settings";
import { t, DEFAULT_LOCALE } from "./i18n";

let configWindow: BrowserWindow | null = null;

/**
 * Resolve o caminho para arquivos na pasta data/.
 * Em dev: ./data/ relativo ao projeto
 * Em producao (AppImage/deb/rpm): extraFiles ficam na raiz do app, ao lado de resources/
 */
export function getDataPath(file: string): string {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, "..", "data", file);
  }
  return path.join(__dirname, "..", "data", file);
}

function currentTitle(): string {
  const locale = new Settings("app").get("locale", DEFAULT_LOCALE);
  return t(locale, "config.windowTitle");
}

/**
 * Abre a janela de configuracoes (singleton).
 */
export function openConfigWindow() {
  if (configWindow && !configWindow.isDestroyed()) {
    configWindow.show();
    configWindow.focus();
    return;
  }

  configWindow = new BrowserWindow({
    title: currentTitle(),
    width: 620,
    height: 965,
    minWidth: 460,
    minHeight: 600,
    backgroundColor: "#101010",
    webPreferences: {
      preload: path.join(__dirname, "preload-config.js"),
      contextIsolation: true,
      sandbox: true,
    },
  });

  configWindow.setMenu(null);

  // Links da assinatura (GitHub) abrem no navegador padrao, nao navegam a janela
  configWindow.webContents.on("will-navigate", (event, url) => {
    if (url.startsWith("http")) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });

  configWindow.loadFile(getDataPath("config.html"));

  configWindow.on("closed", () => {
    configWindow = null;
  });
}

/**
 * Recarrega a janela de configuracoes (usado ao trocar de idioma, pra
 * repintar todos os textos sem precisar reescrever o DOM na mao).
 */
export function reloadConfigWindow() {
  if (!configWindow || configWindow.isDestroyed()) return;
  configWindow.setTitle(currentTitle());
  configWindow.reload();
}
