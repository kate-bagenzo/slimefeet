import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import steamworks from 'steamworks.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = steamworks.init(3551200);
console.log(client.localplayer.getName());
app.commandLine.appendSwitch('no-sandbox');
app.commandLine.appendSwitch("in-process-gpu");
app.commandLine.appendSwitch("disable-direct-composition");
app.allowRendererProcessReuse = false;

const createWindow = () => {
    const win = new BrowserWindow({
        backgroundColor: '#000000',
        autoHideMenuBar: true,
        fullscreen: true,
        width: 1600,
        height: 1000,
        minWidth: 1600,
        minHeight: 1000,
        icon: path.join(__dirname, "./src/slimefeet.png"),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    win.removeMenu();
    win.loadFile('src/index.html');
}

app.whenReady().then(() => {
    createWindow();
});

ipcMain.handle('quit-app', () => {
    console.log('quitting...');
    app.quit();
});

ipcMain.handle('achieve-1', () => {
  client.achievement.activate('miasma');
})

ipcMain.handle('achieve-2', () => {
  client.achievement.activate('slimefeet');
})

  ipcMain.handle('fullscreen-app', () => {
    const win = BrowserWindow.getFocusedWindow();
    win.isFullScreen() ? win.setFullScreen(false) : win.setFullScreen(true);
});
  