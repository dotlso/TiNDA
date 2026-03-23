const { app, BrowserWindow } = require("electron");
const path = require("path");

try {
  require("./backend/server.js");
} catch (err) {
  const { dialog } = require("electron");
  dialog.showErrorBox(
    "Server failed to start",
    err.message
  );
  app.quit();
}

let mainWindow;

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    mainWindow.loadFile(path.join(__dirname, "frontend/index.html"));
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});