import { app, ipcMain } from "electron";
import fs from "fs";
import path from "path";
import os from "os";
import MainWindow from "./main-window";
import TrayModule from "./module/tray-module";
import { openConfigWindow, reloadConfigWindow } from "./config-window";
import { IconStyle } from "./util";
import Settings from "./settings";
import { AVAILABLE_LOCALES, DEFAULT_LOCALE, isValidLocale, getStrings } from "./i18n";

const AUTOSTART_FILE = "chatgpt-for-linux.desktop";

/**
 * Controlador principal da aplicacao: janela unica, tray e autostart.
 */
export default class AppController {
  public readonly mainWindow: MainWindow;
  private readonly appSettings = new Settings("app");
  private trayModule!: TrayModule;
  public quitting = false;

  constructor() {
    this.mainWindow = new MainWindow();
  }

  public get window() {
    return this.mainWindow.window;
  }

  public init() {
    this.mainWindow.init();

    this.trayModule = new TrayModule(this);
    this.trayModule.onLoad();

    this.registerListeners();
    this.registerIpcHandlers();
  }

  public openConfig() {
    openConfigWindow();
  }

  public show() {
    this.mainWindow.show();
  }

  public reload() {
    this.mainWindow.reload();
  }

  public newChat() {
    this.mainWindow.newChat();
  }

  public quit() {
    this.quitting = true;
    this.mainWindow.quit();
    app.quit();
  }

  public isAutostartEnabled(): boolean {
    return fs.existsSync(this.autostartPath());
  }

  public setAutostart(enabled: boolean) {
    if (!app.isPackaged) {
      // Em dev, process.execPath e o binario cru do Electron (sem o caminho
      // do app) - um .desktop assim so funciona empacotado (.deb/.rpm/AppImage).
      console.warn("Autostart ignorado: app rodando sem empacotar (yarn start/electron .).");
      return;
    }

    const autostartDir = path.join(os.homedir(), ".config", "autostart");
    const filePath = this.autostartPath();
    const execPath = process.env.APPIMAGE || process.execPath;

    if (enabled) {
      if (!fs.existsSync(autostartDir)) {
        fs.mkdirSync(autostartDir, { recursive: true });
      }
      const content = `[Desktop Entry]
Type=Application
Name=ChatGPT for Linux
Exec=${execPath} --start-hidden %u
StartupNotify=false
Terminal=false
Hidden=false
`;
      fs.writeFileSync(filePath, content, { mode: 0o644 });
    } else if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  private autostartPath() {
    return path.join(os.homedir(), ".config", "autostart", AUTOSTART_FILE);
  }

  private registerListeners() {
    app.on("second-instance", () => {
      this.show();
    });
  }

  private registerIpcHandlers() {
    ipcMain.handle("get-tray-style", () => this.trayModule.getStyle());

    ipcMain.handle("set-tray-style", (_event, style: IconStyle) => {
      this.trayModule.setStyle(style);
      return style;
    });

    ipcMain.handle("get-icon-preview", (_event, style: IconStyle) => {
      return this.trayModule.buildIcon(style).toDataURL();
    });

    ipcMain.handle("get-autostart", () => this.isAutostartEnabled());

    ipcMain.handle("set-autostart", (_event, enabled: boolean) => {
      this.setAutostart(enabled);
      return enabled;
    });

    ipcMain.handle("get-locale", () => this.appSettings.get("locale", DEFAULT_LOCALE));

    ipcMain.handle("get-locales", () => AVAILABLE_LOCALES);

    ipcMain.handle("get-strings", () => {
      const locale = this.appSettings.get("locale", DEFAULT_LOCALE);
      return getStrings(locale);
    });

    ipcMain.handle("set-locale", (_event, locale: string) => {
      const finalLocale = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
      this.appSettings.set("locale", finalLocale);
      this.trayModule.buildMenu();
      reloadConfigWindow();
      return finalLocale;
    });
  }
}
