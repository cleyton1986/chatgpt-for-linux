import { BrowserWindow, session, shell } from "electron";
import path from "path";
import HotkeyModule from "./module/hotkey-module";
import ModuleManager from "./module/module-manager";
import WindowSettingsModule from "./module/window-settings-module";

const CHATGPT_URL = "https://chatgpt.com/";
const PARTITION = "persist:chatgpt";

// Permissoes concedidas ao site: microfone/camera (voice mode) e clipboard
// (colar imagem). Notificacao e decidida dinamicamente (ver abaixo).
const ALLOWED_PERMISSIONS = new Set(["media", "clipboard-read", "clipboard-sanitized-write"]);

/**
 * Gerencia a janela principal do ChatGPT for Linux.
 * Sessao unica e persistente (login/cookies sobrevivem a reinicios).
 */
export default class MainWindow {
  public readonly window: BrowserWindow;
  private readonly moduleManager: ModuleManager;
  public quitting = false;

  private retryTimer?: ReturnType<typeof setTimeout>;
  private retryDelay = 3000;

  constructor() {
    this.window = new BrowserWindow({
      title: "ChatGPT",
      width: 1200,
      height: 800,
      minWidth: 650,
      minHeight: 500,
      show: !process.argv.includes("--start-hidden"),
      webPreferences: {
        contextIsolation: true,
        sandbox: true,
        partition: PARTITION,
      },
    });

    this.moduleManager = new ModuleManager([
      new HotkeyModule(
        {
          quit: () => this.quit(),
          reload: () => this.reload(),
          newChat: () => this.newChat(),
        },
        this.window
      ),
      new WindowSettingsModule(this.window),
    ]);
  }

  public init() {
    this.window.setMenu(null);
    this.registerPermissions();
    this.registerListeners();
    this.registerLoadingListeners();
    this.makeExternalLinksOpenInBrowser();
    this.moduleManager.beforeLoad();
    this.window.loadURL(CHATGPT_URL);
    this.moduleManager.onLoad();
  }

  public show() {
    this.window.show();
    this.window.focus();
  }

  public hide() {
    this.window.hide();
  }

  public reload() {
    this.window.webContents.reloadIgnoringCache();
  }

  /** Abre uma nova conversa navegando para a raiz do ChatGPT. */
  public newChat() {
    this.show();
    this.window.loadURL(CHATGPT_URL);
  }

  public quit() {
    this.quitting = true;
    if (this.retryTimer) {
      clearTimeout(this.retryTimer);
      this.retryTimer = undefined;
    }
    this.moduleManager.onQuit();
  }

  /**
   * Concede apenas as permissoes necessarias ao ChatGPT (mic para voice mode,
   * clipboard para colar imagens, notification para avisos de resposta pronta).
   * Nega o resto (geolocation, etc).
   */
  private registerPermissions() {
    const ses = session.fromPartition(PARTITION);
    ses.setPermissionRequestHandler((_webContents, permission, callback) => {
      if (permission === "notifications") {
        callback(true);
        return;
      }
      callback(ALLOWED_PERMISSIONS.has(permission));
    });
  }

  /**
   * Links externos (docs, ajuda, terceiros) abrem no navegador padrao.
   * Popups de login OAuth (Google/Microsoft/Apple) abrem como janela filha real,
   * senao o fluxo de autenticacao trava.
   */
  private makeExternalLinksOpenInBrowser() {
    this.window.webContents.setWindowOpenHandler((details) => {
      const url = new URL(details.url);
      const isAuthPopup =
        /accounts\.google\.com|login\.live\.com|login\.microsoftonline\.com|appleid\.apple\.com|auth0\.com|okta\.com/.test(
          url.hostname
        ) || details.features.includes("popup");

      if (isAuthPopup) {
        return {
          action: "allow",
          overrideBrowserWindowOptions: {
            width: 500,
            height: 650,
            autoHideMenuBar: true,
            webPreferences: { partition: PARTITION },
          },
        };
      }

      shell.openExternal(details.url);
      return { action: "deny" };
    });
  }

  private registerListeners() {
    // Esconde para o tray em vez de fechar o processo
    this.window.on("close", (event) => {
      if (this.quitting) return;
      event.preventDefault();
      this.window.hide();
    });
  }

  /**
   * Overlay minimo de "sem conexao" + retry com backoff exponencial.
   * Nao depende do DOM do ChatGPT, so de eventos nativos do Electron.
   */
  private registerLoadingListeners() {
    const wc = this.window.webContents;

    wc.on("did-finish-load", () => {
      if (this.retryTimer) {
        clearTimeout(this.retryTimer);
        this.retryTimer = undefined;
      }
      this.retryDelay = 3000;
    });

    wc.on("did-fail-load", (_event, errorCode, _errorDescription, _url, isMainFrame) => {
      if (!isMainFrame || errorCode === -3) return; // -3 = ABORTED (navegacao cancelada)
      this.scheduleReload();
    });
  }

  private scheduleReload() {
    if (this.retryTimer) clearTimeout(this.retryTimer);
    this.retryTimer = setTimeout(() => {
      if (this.window.isDestroyed()) return;
      this.window.loadURL(CHATGPT_URL);
      this.retryDelay = Math.min(this.retryDelay * 2, 30000);
    }, this.retryDelay);
  }
}
