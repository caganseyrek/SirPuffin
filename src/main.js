const { app, BrowserWindow } = require('electron');

const createWindow = () => {
    const window = new BrowserWindow({
        width: 1064,
        height: 650,
        minWidth: 1064,
        minHeight: 650,
        frame: false,
        autoHideMenuBar: true,
        icon: "assets/icon.png",
        titleBarStyle: "hidden",
        titleBarOverlay: {
            color: '#1F5673',
            symbolColor: '#DDDDDD',
            height: 38
        },
        webPreferences: {
            nodeIntegration: true
        }
    });
    window.loadFile('./index.html');
    //For "npm run electron" command, use the line below instead
    //window.loadFile('../index.html');
}

app.whenReady().then(() => { createWindow() })

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})