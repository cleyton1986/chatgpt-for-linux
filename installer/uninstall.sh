#!/bin/bash
# Desinstalador do ChatGPT for Linux.
# Cobre instalacao via pacote nativo (apt/dnf/pacman remove) ou via AppImage manual.
set -e

APP_NAME="chatgpt-for-linux"
INSTALL_DIR="/opt/$APP_NAME"
BIN_LINK="/usr/local/bin/$APP_NAME"
DESKTOP_ENTRY="$HOME/.local/share/applications/$APP_NAME.desktop"

echo "Iniciando desinstalacao do ChatGPT for Linux..."

if command -v apt >/dev/null 2>&1 && dpkg -s "$APP_NAME" >/dev/null 2>&1; then
  sudo apt remove -y "$APP_NAME"
elif command -v dnf >/dev/null 2>&1 && rpm -q "$APP_NAME" >/dev/null 2>&1; then
  sudo dnf remove -y "$APP_NAME"
elif command -v pacman >/dev/null 2>&1 && pacman -Q "$APP_NAME" >/dev/null 2>&1; then
  sudo pacman -Rns --noconfirm "$APP_NAME"
fi

if [ -L "$BIN_LINK" ]; then
  echo "Removendo symlink $BIN_LINK..."
  sudo rm -f "$BIN_LINK"
fi

if [ -d "$INSTALL_DIR" ]; then
  echo "Removendo $INSTALL_DIR..."
  sudo rm -rf "$INSTALL_DIR"
fi

if [ -f "$DESKTOP_ENTRY" ]; then
  echo "Removendo desktop entry $DESKTOP_ENTRY..."
  rm -f "$DESKTOP_ENTRY"
fi

if command -v update-desktop-database >/dev/null 2>&1; then
  update-desktop-database "$HOME/.local/share/applications"
fi

echo "Desinstalacao concluida."
