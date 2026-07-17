#!/bin/bash
# ChatGPT for Linux — instalador online
# Uso: curl -fsSL https://github.com/cleyton1986/chatgpt-for-linux/releases/latest/download/install-online.sh | bash
set -e

REPO="cleyton1986/chatgpt-for-linux"
APP_NAME="chatgpt-for-linux"
INSTALL_DIR="/opt/$APP_NAME"
BIN_LINK="/usr/local/bin/$APP_NAME"
DESKTOP_DIR="$HOME/.local/share/applications"
DESKTOP_FILE="$DESKTOP_DIR/$APP_NAME.desktop"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

info()  { echo -e "${GREEN}[OK]${NC} $1"; }
warn()  { echo -e "${YELLOW}[!]${NC} $1"; }
error() { echo -e "${RED}[x]${NC} $1"; exit 1; }

echo ""
echo "  ChatGPT for Linux — Instalador"
echo "  -------------------------------"
echo ""

info "Verificando versão mais recente..."
LATEST=$(curl -fsSL "https://api.github.com/repos/$REPO/releases/latest" \
  | grep '"tag_name"' | head -1 | sed 's/.*"tag_name": *"\(.*\)".*/\1/')

if [ -z "$LATEST" ]; then
  error "Não foi possível obter a versão mais recente. Verifique sua conexão."
fi

VERSION="${LATEST#v}"
info "Versão encontrada: $LATEST"

BASE_URL="https://github.com/$REPO/releases/download/$LATEST"

install_deb() {
  local FILE="/tmp/${APP_NAME}_${VERSION}_amd64.deb"
  info "Baixando pacote .deb..."
  curl -fsSL --progress-bar "$BASE_URL/${APP_NAME}_${VERSION}_amd64.deb" -o "$FILE"
  info "Instalando (requer sudo)..."
  sudo apt install -y "$FILE" 2>/dev/null || sudo dpkg -i "$FILE" || sudo apt-get -f install -y
  rm -f "$FILE"
  info "Instalação via .deb concluída."
}

install_rpm() {
  local FILE="/tmp/${APP_NAME}-${VERSION}.x86_64.rpm"
  info "Baixando pacote .rpm..."
  curl -fsSL --progress-bar "$BASE_URL/${APP_NAME}-${VERSION}.x86_64.rpm" -o "$FILE"
  info "Instalando (requer sudo)..."
  if command -v dnf &>/dev/null; then
    sudo dnf install -y "$FILE"
  elif command -v zypper &>/dev/null; then
    sudo zypper install -y "$FILE"
  else
    sudo rpm -i "$FILE"
  fi
  rm -f "$FILE"
  info "Instalação via .rpm concluída."
}

install_pacman_pkg() {
  local FILE="/tmp/${APP_NAME}-${VERSION}.pacman"
  info "Baixando pacote pacman..."
  curl -fsSL --progress-bar "$BASE_URL/${APP_NAME}-${VERSION}.pacman" -o "$FILE"
  info "Instalando (requer sudo)..."
  sudo pacman -U --noconfirm "$FILE"
  rm -f "$FILE"
  info "Instalação via pacman concluída."
}

install_appimage() {
  local NAME="${APP_NAME}-${VERSION}.AppImage"
  local FILE="/tmp/$NAME"
  info "Baixando AppImage..."
  curl -fsSL --progress-bar "$BASE_URL/$NAME" -o "$FILE"
  chmod +x "$FILE"

  info "Instalando (requer sudo)..."
  sudo mkdir -p "$INSTALL_DIR"
  sudo cp "$FILE" "$INSTALL_DIR/$NAME"
  sudo chmod +x "$INSTALL_DIR/$NAME"
  sudo ln -sf "$INSTALL_DIR/$NAME" "$BIN_LINK"
  rm -f "$FILE"

  mkdir -p "$DESKTOP_DIR"
  cat > "$DESKTOP_FILE" <<EOF
[Desktop Entry]
Type=Application
Name=ChatGPT for Linux
Comment=ChatGPT for Linux (unofficial wrapper around chatgpt.com)
Exec=$BIN_LINK %u
StartupNotify=false
MimeType=x-scheme-handler/chatgpt;
Categories=Utility;
Icon=$APP_NAME
Terminal=false
StartupWMClass=$APP_NAME
EOF

  command -v update-desktop-database &>/dev/null && update-desktop-database "$DESKTOP_DIR"
  info "Instalação via AppImage concluída."
}

if command -v apt &>/dev/null; then
  info "Distro baseada em Debian/Ubuntu detectada — usando .deb"
  install_deb
elif command -v pacman &>/dev/null; then
  info "Arch/Manjaro detectado — usando pacote pacman"
  install_pacman_pkg
elif command -v dnf &>/dev/null || command -v zypper &>/dev/null || command -v rpm &>/dev/null; then
  info "Fedora/openSUSE detectado — usando .rpm"
  install_rpm
else
  warn "Distro não reconhecida — usando AppImage universal"
  install_appimage
fi

echo ""
info "ChatGPT for Linux ${LATEST} instalado com sucesso!"
echo ""
echo "  Execute no terminal:  $APP_NAME"
echo "  Ou abra pelo menu de aplicativos: ChatGPT for Linux"
echo ""
