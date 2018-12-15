const electron = require('electron')
const url = require('url')
const path = require('path')

const { app, BrowserWindow, Menu, ipcMain } = electron

process.env.NODE_ENV = 'development'

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow;

function createMainWindow() {
    const window = new BrowserWindow()
  
    window.loadURL(`file://${__dirname}/mainWindow.html`)
  
    window.on('closed', () => {
      mainWindow = null
    })
  
    window.webContents.on('devtools-opened', () => {
      window.focus()
      setImmediate(() => {
        window.focus()
      })
    })
  
    window.ELECTRON_DISABLE_SECURITY_WARNINGS;
    return window
}

// quit application when all windows are closed
app.on('window-all-closed', () => {
    // on macOS it is common for applications to stay open until the user explicitly quits
    if (process.platform !== 'darwin') {
    app.quit()
}})

app.on('activate', () => {
    // on macOS it is common to re-create a window even after all windows have been closed
    if (mainWindow === null) {
    mainWindow = createMainWindow()
}})

// create main BrowserWindow when electron is ready
app.on('ready', () => {
    mainWindow = createMainWindow()
    // Build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    // Insert menu
    Menu.setApplicationMenu(mainMenu);
})

// Catch item:add
ipcMain.on('item:add', function(item) {
    mainWindow.webContents.send('item:add', item)
})

// Create menu template
const mainMenuTemplate = [
  {
    label: 'Clear Items',
    accelerator: process.platform == 'darwin' ? 'Command+C' : 'Ctrl+C',
    click() {
        mainWindow.webContents.send('item:clear');
    }
  },
  {
    label: 'Quit',
    accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
    click() {
        app.quit();
    }
  }
];

// If mac, add empty object to menu
if (process.platform == "darwin") {
    mainMenuTemplate.unshift({});
}

// Add developer tools item if not in production
if (process.env.NODE_ENV !== 'production') {
    mainMenuTemplate.push( {
        label: 'Developer Tools',
        submenu: [
            {
                label: 'Toggle DevTools',
                accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
                click() {
                    mainWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    });
}