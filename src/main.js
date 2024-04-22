const { app, BrowserWindow } = require('electron')

const createWindow = () => {
    const window = new BrowserWindow({
        width: 1064,
        height: 650,
        minWidth: 1064,
        minHeight: 650,
        frame: false,
        autoHideMenuBar: true,
        icon: "../assets/icon.png",
        titleBarStyle: "hidden",
        titleBarOverlay: {
            color: '#FFFFFF',
            symbolColor: '#222222',
            height: 61
        },
        webPreferences: {
            nodeIntegration: true
        }
    })
    window.loadFile('../index.html')
}

app.whenReady().then(() => { createWindow() })

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
