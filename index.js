import { app, BrowserWindow } from 'electron';

const createWindow = () => {
    const win = new BrowserWindow({
        backgroundColor: '#000000',
        width: 1280,
        height: 800
    });

    win.loadFile('src/index.html');
}

app.whenReady().then(() => {
    createWindow();
});

const test = document.getElementById('quit');