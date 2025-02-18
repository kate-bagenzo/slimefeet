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
        width: 1200,
        height: 800,
        minWidth: 1200,
        minHeight: 800,
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
  