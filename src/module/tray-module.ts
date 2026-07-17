import { Menu, Tray, NativeImage } from "electron";
import { findIcon, buildStyledIcon, IconStyle, IconBgShape } from "../util";
import Settings from "../settings";
import { t, DEFAULT_LOCALE } from "../i18n";
import type AppController from "../app-controller";

const ICON = findIcon("chatgpt-for-linux.png");

// Branco por padrao: a maioria dos paineis Linux (Cinnamon, GNOME, KDE, XFCE)
// e escura, e o traço original do logo e preto (fica invisivel sem isso).
const DEFAULT_FG_COLOR = "#ffffff";

/**
 * Modulo responsavel pelo icone na bandeja do sistema.
 * Aparencia (cor do traço, cor e forma do fundo) e configuravel
 * (ver config-window.ts / data/config.html).
 */
export default class TrayModule {
  private readonly tray: Tray;
  private readonly settings = new Settings("tray");
  private readonly appSettings = new Settings("app");

  constructor(private readonly controller: AppController) {
    this.tray = new Tray(this.buildIcon(this.getStyle()));
  }

  public onLoad() {
    this.buildMenu();
    this.registerTrayClick();
  }

  public getStyle(): IconStyle {
    return {
      fgColor: this.settings.get("fgColor", DEFAULT_FG_COLOR),
      bgColor: this.settings.get("bgColor", null),
      bgShape: this.settings.get("bgShape", "none") as IconBgShape,
    };
  }

  public setStyle(style: IconStyle) {
    this.settings.set("fgColor", style.fgColor);
    this.settings.set("bgColor", style.bgColor);
    this.settings.set("bgShape", style.bgShape);
    this.tray.setImage(this.buildIcon(style));
  }

  public buildIcon(style: IconStyle): NativeImage {
    return buildStyledIcon(ICON, style);
  }

  /** Reconstroi o menu (usado tambem ao trocar o idioma, pra refletir na hora). */
  public buildMenu() {
    const locale = this.appSettings.get("locale", DEFAULT_LOCALE);
    const tr = (key: string) => t(locale, key);

    const menu = Menu.buildFromTemplate([
      {
        label: tr("tray.open"),
        click: () => this.controller.show(),
      },
      {
        label: tr("tray.newChat"),
        click: () => this.controller.newChat(),
      },
      {
        label: tr("tray.reload"),
        click: () => this.controller.reload(),
      },
      { type: "separator" },
      {
        label: tr("tray.settings"),
        click: () => this.controller.openConfig(),
      },
      {
        label: tr("tray.startWithSystem"),
        type: "checkbox",
        checked: this.controller.isAutostartEnabled(),
        click: (item) => this.controller.setAutostart(item.checked),
      },
      { type: "separator" },
      {
        label: tr("tray.quit"),
        click: () => this.controller.quit(),
      },
    ]);

    this.tray.setContextMenu(menu);
    this.tray.setToolTip("ChatGPT for Linux");
  }

  private registerTrayClick() {
    this.tray.on("click", () => {
      if (this.controller.window.isVisible()) {
        this.controller.window.hide();
      } else {
        this.controller.show();
      }
    });
  }
}
