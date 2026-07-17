export const DEFAULT_LOCALE = "en";

export interface LocaleInfo {
  code: string;
  label: string;
}

export const AVAILABLE_LOCALES: LocaleInfo[] = [
  { code: "en", label: "English" },
  { code: "pt-BR", label: "Português (Brasil)" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
];

type Dict = Record<string, string>;

const en: Dict = {
  "tray.open": "Open ChatGPT",
  "tray.newChat": "New chat",
  "tray.reload": "Reload",
  "tray.settings": "Settings...",
  "tray.startWithSystem": "Start with system",
  "tray.quit": "Quit",

  "config.windowTitle": "Settings - ChatGPT for Linux",
  "config.header": "Appearance & settings",
  "config.subheader": "Customize the tray icon and app behavior.",
  "config.previewTitle": "Preview",
  "config.panelDark": "Dark panel",
  "config.panelLight": "Light panel",
  "config.strokeColorTitle": "Icon color",
  "config.customColor": "Custom color",
  "config.bgTitle": "Icon background",
  "config.shapeNone": "None",
  "config.shapeSquare": "Square",
  "config.shapeCircle": "Round",
  "config.systemTitle": "System",
  "config.startWithSystem": "Start with system",
  "config.startWithSystemHint": "Opens in background on login",
  "config.languageTitle": "Language",
  "config.languageHint": "Changes apply immediately.",

  "color.white": "White",
  "color.black": "Black",
  "color.green": "Green",
  "color.blue": "Blue",
  "color.purple": "Purple",
  "color.red": "Red",
};

const ptBR: Dict = {
  "tray.open": "Abrir ChatGPT",
  "tray.newChat": "Nova conversa",
  "tray.reload": "Recarregar",
  "tray.settings": "Configurações...",
  "tray.startWithSystem": "Iniciar com o sistema",
  "tray.quit": "Fechar",

  "config.windowTitle": "Configurações - ChatGPT for Linux",
  "config.header": "Aparência e configurações",
  "config.subheader": "Personalize o ícone da bandeja e o comportamento do app.",
  "config.previewTitle": "Pré-visualização",
  "config.panelDark": "Painel escuro",
  "config.panelLight": "Painel claro",
  "config.strokeColorTitle": "Cor do ícone",
  "config.customColor": "Cor personalizada",
  "config.bgTitle": "Fundo do ícone",
  "config.shapeNone": "Nenhum",
  "config.shapeSquare": "Quadrado",
  "config.shapeCircle": "Redondo",
  "config.systemTitle": "Sistema",
  "config.startWithSystem": "Iniciar com o sistema",
  "config.startWithSystemHint": "Abre em segundo plano no login",
  "config.languageTitle": "Idioma",
  "config.languageHint": "As mudanças são aplicadas na hora.",

  "color.white": "Branco",
  "color.black": "Preto",
  "color.green": "Verde",
  "color.blue": "Azul",
  "color.purple": "Roxo",
  "color.red": "Vermelho",
};

const es: Dict = {
  "tray.open": "Abrir ChatGPT",
  "tray.newChat": "Nueva conversación",
  "tray.reload": "Recargar",
  "tray.settings": "Configuración...",
  "tray.startWithSystem": "Iniciar con el sistema",
  "tray.quit": "Salir",

  "config.windowTitle": "Configuración - ChatGPT for Linux",
  "config.header": "Apariencia y configuración",
  "config.subheader": "Personaliza el icono de la bandeja y el comportamiento de la app.",
  "config.previewTitle": "Vista previa",
  "config.panelDark": "Panel oscuro",
  "config.panelLight": "Panel claro",
  "config.strokeColorTitle": "Color del icono",
  "config.customColor": "Color personalizado",
  "config.bgTitle": "Fondo del icono",
  "config.shapeNone": "Ninguno",
  "config.shapeSquare": "Cuadrado",
  "config.shapeCircle": "Redondo",
  "config.systemTitle": "Sistema",
  "config.startWithSystem": "Iniciar con el sistema",
  "config.startWithSystemHint": "Se abre en segundo plano al iniciar sesión",
  "config.languageTitle": "Idioma",
  "config.languageHint": "Los cambios se aplican de inmediato.",

  "color.white": "Blanco",
  "color.black": "Negro",
  "color.green": "Verde",
  "color.blue": "Azul",
  "color.purple": "Morado",
  "color.red": "Rojo",
};

const fr: Dict = {
  "tray.open": "Ouvrir ChatGPT",
  "tray.newChat": "Nouvelle discussion",
  "tray.reload": "Recharger",
  "tray.settings": "Paramètres...",
  "tray.startWithSystem": "Démarrer avec le système",
  "tray.quit": "Quitter",

  "config.windowTitle": "Paramètres - ChatGPT for Linux",
  "config.header": "Apparence et paramètres",
  "config.subheader": "Personnalisez l'icône de la zone de notification et le comportement de l'app.",
  "config.previewTitle": "Aperçu",
  "config.panelDark": "Panneau sombre",
  "config.panelLight": "Panneau clair",
  "config.strokeColorTitle": "Couleur de l'icône",
  "config.customColor": "Couleur personnalisée",
  "config.bgTitle": "Fond de l'icône",
  "config.shapeNone": "Aucun",
  "config.shapeSquare": "Carré",
  "config.shapeCircle": "Rond",
  "config.systemTitle": "Système",
  "config.startWithSystem": "Démarrer avec le système",
  "config.startWithSystemHint": "S'ouvre en arrière-plan à la connexion",
  "config.languageTitle": "Langue",
  "config.languageHint": "Les changements s'appliquent immédiatement.",

  "color.white": "Blanc",
  "color.black": "Noir",
  "color.green": "Vert",
  "color.blue": "Bleu",
  "color.purple": "Violet",
  "color.red": "Rouge",
};

const de: Dict = {
  "tray.open": "ChatGPT öffnen",
  "tray.newChat": "Neuer Chat",
  "tray.reload": "Neu laden",
  "tray.settings": "Einstellungen...",
  "tray.startWithSystem": "Mit System starten",
  "tray.quit": "Beenden",

  "config.windowTitle": "Einstellungen - ChatGPT for Linux",
  "config.header": "Aussehen und Einstellungen",
  "config.subheader": "Passe das Tray-Symbol und das Verhalten der App an.",
  "config.previewTitle": "Vorschau",
  "config.panelDark": "Dunkles Panel",
  "config.panelLight": "Helles Panel",
  "config.strokeColorTitle": "Symbolfarbe",
  "config.customColor": "Eigene Farbe",
  "config.bgTitle": "Symbolhintergrund",
  "config.shapeNone": "Kein",
  "config.shapeSquare": "Quadratisch",
  "config.shapeCircle": "Rund",
  "config.systemTitle": "System",
  "config.startWithSystem": "Mit System starten",
  "config.startWithSystemHint": "Öffnet sich beim Login im Hintergrund",
  "config.languageTitle": "Sprache",
  "config.languageHint": "Änderungen wirken sofort.",

  "color.white": "Weiß",
  "color.black": "Schwarz",
  "color.green": "Grün",
  "color.blue": "Blau",
  "color.purple": "Lila",
  "color.red": "Rot",
};

const DICTS: Record<string, Dict> = {
  en,
  "pt-BR": ptBR,
  es,
  fr,
  de,
};

export function getStrings(locale: string): Dict {
  return DICTS[locale] || DICTS[DEFAULT_LOCALE];
}

export function t(locale: string, key: string): string {
  const dict = getStrings(locale);
  return dict[key] ?? getStrings(DEFAULT_LOCALE)[key] ?? key;
}

export function isValidLocale(locale: string): boolean {
  return Object.prototype.hasOwnProperty.call(DICTS, locale);
}
