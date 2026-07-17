import { app } from "electron";
import AppController from "./app-controller";

// Permite que o modo de voz e outras midias autoplay funcionem sem gesto do usuario
app.commandLine.appendSwitch("autoplay-policy", "no-user-gesture-required");

// Sem isso o processo de GPU falha ao iniciar em varias distros Linux
// (chrome-sandbox sem bit setuid root) e o Chromium mata o app inteiro
// ("GPU process isn't usable. Goodbye."). Mantem aceleracao de hardware
// ligada, so remove o sandbox do processo de GPU especificamente.
app.commandLine.appendSwitch("disable-gpu-sandbox");

// So funciona de forma confiavel quando empacotado (AppImage/deb/rpm): em
// dev o binario e o Electron cru, sem um executavel proprio pra registrar.
if (app.isPackaged) {
  app.setAsDefaultProtocolClient("chatgpt");
}

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit();
}

app.whenReady().then(() => {
  new AppController().init();
});

// Nao encerra o app quando a janela fecha - continua na bandeja do sistema
app.on("window-all-closed", () => {});
