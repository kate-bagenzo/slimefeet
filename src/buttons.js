const { ipcRenderer, app } = require('electron');

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('quit-window-yes').addEventListener('click', () => {
      ipcRenderer.invoke('quit-app');
  });
  document.getElementById('fullscreen').addEventListener('click', () => {
    ipcRenderer.invoke('fullscreen-app');
});
});
