import {app, BrowserWindow} from 'electron';

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1280,
        height: 800
    });

    win.loadFile('src/index.html');
}

app.whenReady().then(() => {
    createWindow();
})