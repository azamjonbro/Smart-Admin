"use strict";

import { app, protocol, BrowserWindow, ipcMain,  } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
import { eventController } from "./main/event.js";
import connection from "./main/utils/connection.js";
import createsuperadmin from "./main/utils/createsuperadmin.js";
const isDevelopment = process.env.NODE_ENV !== "production";

let mainWindow;
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  protocol.registerSchemesAsPrivileged([
    { scheme: "app", privileges: { secure: true, standard: true } },
  ]);
  app.on("ready", async () => {
    if (isDevelopment && !process.env.IS_TEST) {
      try {
        await installExtension(VUEJS_DEVTOOLS);
      } catch (e) {
        console.error("Vue Devtools failed to install:", e.toString());
      }
    }
    await createWindow();
    eventController(ipcMain);
    await connection();
    await createsuperadmin();
    mainWindow.setFullScreen(true);

    mainWindow.on("close", (event) => {
      event.preventDefault();
      mainWindow.hide();
    });

    mainWindow.on("restore", () => {
      mainWindow.setFullScreen(true);
    });
  });
}

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    frame: false,
    resizable: false,
    minimizable: true,
    maximizable: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
      customFileProtocol: "./",
      enableRemoteModule: false,
    },
  });
  mainWindow.webContents.openDevTools();
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    await mainWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) mainWindow.webContents.openDevTools();
  } else {
    createProtocol("app");
    mainWindow.loadURL("app://./index.html");
  }
}

// app.on('window-all-closed', () => {
//   globalShortcut.unregisterAll();
// });

// app.on('will-quit', () => {
//   globalShortcut.unregisterAll();
// });

ipcMain.on("minimize", () => {
  BrowserWindow().minimize();
});

ipcMain.on("close", () => {
  mainWindow.close();
});

ipcMain.on("reload", () => {
  mainWindow.reload();
});

// app.on('browser-window-focus', function () {
//   globalShortcut.register('CommandOrControl+R', () => {});
//   globalShortcut.register('Control+Shift+R', () => {});
//   globalShortcut.register('F5', () => {});
//   globalShortcut.register('F12', () => {});
//   globalShortcut.register('Control+Shift+I', () => {});
// });

// app.on('browser-window-blur', function () {
//   globalShortcut.unregister('CommandOrControl+R');
//   globalShortcut.unregister('Control+Shift+R');
//   globalShortcut.unregister('F5');
//   globalShortcut.unregister('F12');
//   globalShortcut.unregister('Control+Shift+I');
// });

if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}
