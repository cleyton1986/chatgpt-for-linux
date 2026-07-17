<div align="center">

<img src="assets/top.png" alt="ChatGPT" width="420" />

# ChatGPT for Linux

**An unofficial, personal-use native desktop wrapper for ChatGPT on Linux.**

🇧🇷 [Leia em Português](README.pt-BR.md)

[![Download .deb](https://img.shields.io/badge/Download-.deb%20(amd64)-10A37F?style=for-the-badge&logo=debian&logoColor=white)](https://github.com/cleyton1986/chatgpt-for-linux/releases/latest/download/chatgpt-for-linux_0.1.0_amd64.deb)

![Platform](https://img.shields.io/badge/Platform-Linux-yellow?logo=linux)
![Language](https://img.shields.io/badge/Language-TypeScript-3178C6?logo=typescript&logoColor=white)
![Framework](https://img.shields.io/badge/Framework-Electron-47848F?logo=electron&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

</div>

---

## ⚠️ Legal Disclaimer

> **This is an unofficial, independent personal project, not affiliated with, endorsed by, sponsored by, or in any way officially connected to OpenAI, OpCo, LLC, or the ChatGPT product.**
>
> "ChatGPT", "OpenAI", and their respective logos and trademarks are the exclusive property of OpenAI. All rights to these names, logos, and brand assets are reserved to their respective owner. This project uses the ChatGPT name and logo strictly for descriptive, nominative purposes — to identify which web service this wrapper points to — and not to claim any affiliation.
>
> This project **does not** modify, reverse-engineer, decompile, redistribute, or replicate any OpenAI software, model, or service in any way. It contains **no OpenAI source code, no proprietary assets, and no API keys or credentials belonging to OpenAI**. It is simply a native desktop window (built with Electron/Chromium) that loads the **official, publicly available** ChatGPT web application at `https://chatgpt.com` — exactly as any web browser would. All functionality, content, and data you see come directly from OpenAI's own servers, subject to OpenAI's [Terms of Use](https://openai.com/policies/terms-of-use) and [Privacy Policy](https://openai.com/policies/privacy-policy).
>
> This project was created solely because OpenAI does not currently ship an official native Linux desktop client, to fill that gap for personal, non-commercial use, and is shared openly in case it helps others with the same need. Use it at your own risk and in accordance with OpenAI's own terms.
>
> If you are a representative of OpenAI and have any concerns about this project, please [open an issue](https://github.com/cleyton1986/chatgpt-for-linux/issues) and it will be addressed promptly, including takedown if requested.

---

## Why this exists

ChatGPT ships official apps for Windows, macOS, iOS, and Android — but **no native Linux desktop client**. This project was built for personal use to have a proper, always-available native window (system tray, persistent session, native notifications) instead of keeping a browser tab open.

It is intentionally a thin wrapper: no custom UI is injected into the ChatGPT page itself, no data is intercepted, and no feature of the web app is altered. What OpenAI ships on the web is exactly what you get, packaged as a desktop app.

## Features

- 🖥️ **Native app window** — no browser chrome, no address bar
- 🔁 **Persistent session** — login survives app restarts (`persist:chatgpt` partition)
- 📌 **System tray** — open, new chat, reload, settings, quit
- ❌ **Close to tray** — closing the window hides the app; your session stays alive in the background
- 🚀 **Single instance** — launching the app again just focuses the existing window
- ⚙️ **Start with system** — toggle directly from the tray menu
- 🔐 **OAuth login works** — Google / Apple / Microsoft popups open correctly, since it's real Chromium under the hood
- 🎙️ **Voice mode & clipboard image paste** — microphone and clipboard permissions are granted where ChatGPT needs them
- 🎨 **Customizable tray icon** — color, background shape (none / square / round) and background color, all configurable and live-previewed
- 🌐 **Multi-language interface** — English (default), Português (Brasil), Español, Français, Deutsch, 中文 (简体), 日本語, Русский
- 📦 **Native packages** — `.deb`, `.rpm`, `pacman`, and a universal AppImage

## Screenshots

<div align="center">

**Main window**

<img src="assets/image-1.png" alt="ChatGPT for Linux main window" width="600" />

**ChatGPT's own settings**

<img src="assets/image-2.png" alt="ChatGPT settings inside the wrapper" width="600" />

**Conversation**

<img src="assets/image-3.png" alt="A conversation in ChatGPT for Linux" width="600" />

**App settings (ours)**

<img src="assets/image-4.png" alt="ChatGPT for Linux settings window" width="600" />

</div>

## Install

### Online installer (recommended)

```bash
curl -fsSL https://github.com/cleyton1986/chatgpt-for-linux/releases/latest/download/install-online.sh | bash
```

Downloads the latest [release](https://github.com/cleyton1986/chatgpt-for-linux/releases/latest) and installs the right native package for your distro (Debian/Ubuntu, Fedora/openSUSE, Arch), falling back to the universal AppImage otherwise.

### Manual (prebuilt package)

Download the asset that matches your distro from the [Releases](https://github.com/cleyton1986/chatgpt-for-linux/releases/latest) page:

```bash
# Debian / Ubuntu / Mint
sudo apt install ./chatgpt-for-linux_0.1.0_amd64.deb

# Fedora / openSUSE
sudo dnf install ./chatgpt-for-linux-0.1.0.x86_64.rpm

# Arch / Manjaro
sudo pacman -U ./chatgpt-for-linux-0.1.0.pacman

# Any distro (universal)
chmod +x ./chatgpt-for-linux-0.1.0.AppImage
./chatgpt-for-linux-0.1.0.AppImage
```

Uninstall (source checkout):

```bash
./installer/uninstall.sh
```

## Build from source

```bash
yarn install
yarn start        # run in dev mode
yarn build         # generates AppImage/deb/rpm/pacman in ./build
./installer/install.sh
```

Building `.rpm` requires `rpm-build` installed; `.pacman` requires the Arch toolchain (`pacman`/`makepkg`) — `electron-builder` skips that target if the tool isn't present.

## Keyboard shortcuts

- `Ctrl+R` — reload
- `Ctrl+W` — hide window (keeps running in the tray)
- `Ctrl+Shift+O` — new chat
- `Ctrl+ +` / `Ctrl+ -` / `Ctrl+0` — zoom in / out / reset

## How it works

```
┌──────────────────────────────────────────────────────┐
│  ChatGPT for Linux (Electron main process)            │
│  ├─ BrowserWindow ── https://chatgpt.com (Chromium)    │
│  ├─ persist:chatgpt session partition                  │
│  ├─ System tray (customizable icon)                    │
│  ├─ Settings window (tray appearance, language)         │
│  └─ i18n (en / pt-BR / es / fr / de)                    │
└──────────────────────────────────────────────────────┘
```

## Project layout

```
src/
  index.ts               entry point, GPU/protocol setup
  app-controller.ts       tray, autostart, IPC handlers
  main-window.ts          BrowserWindow, session, permissions
  config-window.ts         settings window
  i18n.ts                 translation dictionaries
  module/                 tray, hotkeys, window state
data/
  config.html             settings window UI
installer/
  install.sh              local install (built package)
  install-online.sh        remote install (GitHub release)
  uninstall.sh
```

## Support the Project

If this project was useful to you and you'd like to support its development, consider buying me a coffee:

<p align="center">
  <a href="https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=cleyton1986%40gmail.com&currency_code=BRL&item_name=ChatGPT+for+Linux">
    <img src="https://img.shields.io/badge/PayPal-Donate-00457C?logo=paypal&logoColor=white&style=for-the-badge" alt="Donate via PayPal">
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/PIX-cleyton1986%40gmail.com-077C6C?logo=pix&logoColor=white&style=for-the-badge" alt="PIX">
</p>

Any contribution is voluntary and greatly appreciated!

## License

[MIT](LICENSE) — covers only the wrapper code in this repository.
ChatGPT, its web application, and all related trademarks remain the property of OpenAI.
