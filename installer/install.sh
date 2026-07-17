#!/bin/bash
# Instalador universal do ChatGPT for Linux para Linux.
# Detecta o gerenciador de pacotes da distro e instala o formato nativo
# (.deb/.rpm/.pacman); se nenhum pacote nativo existir ou a distro nao for
# reconhecida, cai no AppImage (funciona em qualquer distro x86_64).
set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
BUILD_DIR="$SCRIPT_DIR/../build"
APP_NAME="chatgpt-for-linux"

DEB=$(ls "$BUILD_DIR"/*.deb 2>/dev/null | head -n1 || true)
RPM=$(ls "$BUILD_DIR"/*.rpm 2>/dev/null | head -n1 || true)
PACMAN_PKG=$(ls "$BUILD_DIR"/*.pacman 2>/dev/null | head -n1 || true)
APPIMAGE=$(ls "$BUILD_DIR"/*.AppImage 2>/dev/null | head -n1 || true)

install_deb() {
  echo "Instalando pacote .deb: $1"
  sudo apt install -y "$1" 2>/dev/null || sudo dpkg -i "$1"
}

install_rpm() {
  echo "Instalando pacote .rpm: $1"
  if command -v dnf >/dev/null 2>&1; then
    sudo dnf install -y "$1"
  elif command -v zypper >/dev/null 2>&1; then
    sudo zypper install -y "$1"
  else
    sudo rpm -i "$1"
  fi
}

install_pacman_pkg() {
  echo "Instalando pacote pacman: $1"
  sudo pacman -U --noconfirm "$1"
}

install_appimage() {
  local file="$1"
  local install_dir="/opt/$APP_NAME"
  local bin_link="/usr/local/bin/$APP_NAME"

  echo "Instalando AppImage universal em $install_dir..."
  chmod +x "$file"
  sudo mkdir -p "$install_dir"
  sudo cp "$file" "$install_dir/$APP_NAME.AppImage"
  sudo chmod +x "$install_dir/$APP_NAME.AppImage"
  sudo ln -sf "$install_dir/$APP_NAME.AppImage" "$bin_link"

  local icon_src="$SCRIPT_DIR/../data/icons/hicolor/512x512/apps/$APP_NAME.png"
  local icon_dir="$HOME/.local/share/icons/hicolor/512x512/apps"
  mkdir -p "$icon_dir"
  [ -f "$icon_src" ] && cp "$icon_src" "$icon_dir/$APP_NAME.png"

  mkdir -p "$HOME/.local/share/applications"
  cat > "$HOME/.local/share/applications/$APP_NAME.desktop" <<EOF
[Desktop Entry]
Type=Application
Name=ChatGPT for Linux
Comment=Aplicativo ChatGPT for Linux nao-oficial
Exec=$bin_link %u
StartupNotify=false
MimeType=x-scheme-handler/chatgpt;
Categories=Utility;Office;
Icon=$APP_NAME
Terminal=false
EOF

  if command -v update-desktop-database >/dev/null 2>&1; then
    update-desktop-database "$HOME/.local/share/applications"
  fi
}

echo "Instalando ChatGPT for Linux..."

if command -v apt >/dev/null 2>&1 && [ -n "$DEB" ]; then
  install_deb "$DEB"
elif command -v pacman >/dev/null 2>&1 && [ -n "$PACMAN_PKG" ]; then
  install_pacman_pkg "$PACMAN_PKG"
elif { command -v dnf >/dev/null 2>&1 || command -v zypper >/dev/null 2>&1 || command -v rpm >/dev/null 2>&1; } && [ -n "$RPM" ]; then
  install_rpm "$RPM"
elif [ -n "$APPIMAGE" ]; then
  install_appimage "$APPIMAGE"
else
  echo "Nenhum pacote encontrado em $BUILD_DIR."
  echo "Rode 'yarn build' primeiro para gerar os instaladores."
  exit 1
fi

echo "Instalacao concluida. Abra 'ChatGPT for Linux' no menu de aplicativos, ou rode '$APP_NAME' no terminal."
