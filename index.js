import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createWindow = () => {
    const win = new BrowserWindow({
        backgroundColor: '#000000',
        //autoHideMenuBar: true,
        fullscreen: true,
        width: 1600,
        height: 1000,
        minWidth: 1600,
        minHeight: 1000,
        icon: path.join(__dirname, "./src/slimefeet.png"),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });
    //win.removeMenu();
    win.loadFile('src/index.html');
}

app.whenReady().then(() => {
    createWindow();
});

ipcMain.handle('quit-app', () => {
    app.quit();
  });

  ipcMain.handle('fullscreen-app', () => {
    const win = BrowserWindow.getFocusedWindow();
    win.isFullScreen() ? win.setFullScreen(false) : win.setFullScreen(true);
  });
  