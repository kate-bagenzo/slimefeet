const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');
const fileURLToPath = require('url');
const steamworks = require('steamworks.js');

const client = steamworks.init(480);
console.log(`steam client name is ${client.localplayer.getName()}`);
app.commandLine.appendSwitch("in-process-gpu");
app.commandLine.appendSwitch("disable-direct-composition");
app.allowRendererProcessReuse = false;
steamworks.electronEnableSteamOverlay(true);

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
            preload: path.join(__dirname, 'preload.cjs'),
            contextIsolation: true,
            nodeIntegration: true
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