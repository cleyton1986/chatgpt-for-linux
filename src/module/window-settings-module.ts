import { BrowserWindow } from "electron";
import Settings from "../settings";
import Module from "./module";

/**
 * Modulo para salvar e restaurar as configuracoes de tamanho e posicao da janela.
 */
export default class WindowSettingsModule extends Module {
  private readonly settings = new Settings("window");

  constructor(private readonly window: BrowserWindow) {
    super();
  }

  public override beforeLoad() {
    const defaults = this.window.getBounds();
    this.window.setBounds(this.settings.get("bounds", defaults));

    if (this.settings.get("maximized", false) && this.window.isVisible()) {
      this.window.maximize();
    }
  }

  public override onQuit() {
    this.settings.set("maximized", this.window.isMaximized());

    if (!this.window.isMaximized()) {
      this.settings.set("bounds", this.window.getBounds());
    }
  }
}
