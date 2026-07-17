# ChatGPT for Linux (não-oficial)

Wrapper desktop do [chatgpt.com](https://chatgpt.com) para Linux — não é um clone, não reimplementa nada do ChatGPT, só empacota o próprio site como app nativo (tray, atalhos, notificação nativa, sessão persistente).

## Desenvolvimento

```bash
yarn install
yarn start        # roda em modo dev
yarn build        # gera AppImage/deb/rpm/pacman em ./build
```

Build de `.rpm` requer `rpm-build` instalado; `.pacman` requer toolchain Arch (`pacman`/`makepkg`) — se a ferramenta não existir na máquina, `electron-builder` pula esse alvo.

## Instalação

### Online (recomendado)

```bash
curl -fsSL https://github.com/cleyton1986/chatgpt-for-linux/releases/latest/download/install-online.sh | bash
```

Baixa a versão mais recente da [release](https://github.com/cleyton1986/chatgpt-for-linux/releases/latest) e instala o pacote nativo certo pra sua distro (Debian/Ubuntu, Fedora/openSUSE, Arch), com AppImage como universal.

### A partir do código-fonte

```bash
yarn build
./installer/install.sh
```

Desinstalar:

```bash
./installer/uninstall.sh
```

## Atalhos

- `Ctrl+R` — recarregar
- `Ctrl+W` — esconder janela (continua na bandeja)
- `Ctrl+Shift+O` — nova conversa
- `Ctrl+ +` / `Ctrl+ -` / `Ctrl+0` — zoom

## Notas técnicas

- Sessão em `persist:chatgpt` — login sobrevive a reinício do app.
- Popups de login (Google/Microsoft/Apple) abrem como janela filha real (necessário para OAuth funcionar).
- Notificação nativa via API padrão do Chromium/libnotify — sem UI customizada.
- Cor, forma e fundo do ícone da bandeja são configuráveis, assim como o idioma (tray → Configurações...).
- Interface disponível em: English (padrão), Português (Brasil), Español, Français, Deutsch.
- Ícone usa a logo da OpenAI para identificação visual do wrapper — projeto não-oficial, sem qualquer afiliação com a OpenAI.
