const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const http = require('http');

// Puerto donde serviremos la app dentro de Electron
const APP_PORT = process.env.PORT || 3131;

let serverProcess = null;

function waitForServerReady(url, timeoutMs = 15000, intervalMs = 500) {
    const start = Date.now();
    return new Promise((resolve, reject) => {
        const tryPing = () => {
            const req = http.get(url, (res) => {
                if (res.statusCode === 200) {
                    resolve(true);
                } else {
                    if (Date.now() - start > timeoutMs) {
                        reject(new Error('Servidor no respondió a tiempo'));
                    } else {
                        setTimeout(tryPing, intervalMs);
                    }
                }
            });
            req.on('error', () => {
                if (Date.now() - start > timeoutMs) {
                    reject(new Error('Servidor no disponible'));
                } else {
                    setTimeout(tryPing, intervalMs);
                }
            });
        };
        tryPing();
    });
}

function startServer() {
    const env = { ...process.env, PORT: APP_PORT.toString(), APP_DATA_DIR: app.getPath('userData') };
    const serverEntry = path.join(__dirname, '..', 'src', 'server.js');
    if (app.isPackaged) {
        // En producción usamos el runtime de Node de Electron en el mismo proceso
        process.env.PORT = env.PORT;
        process.env.APP_DATA_DIR = env.APP_DATA_DIR;
        require(serverEntry);
        return;
    }
    // En desarrollo ejecutamos con Node del sistema para aislar logs y reinicios
    serverProcess = spawn(process.platform === 'win32' ? 'node.exe' : 'node', [serverEntry], {
        env,
        cwd: path.join(__dirname, '..'),
        stdio: 'inherit',
        windowsHide: true
    });
}

function createMainWindow() {
    const mainWindow = new BrowserWindow({
        width: 1366,
        height: 900,
        show: false,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    mainWindow.once('ready-to-show', () => mainWindow.show());
    mainWindow.loadURL(`http://localhost:${APP_PORT}`);
}

const singleInstanceLock = app.requestSingleInstanceLock();
if (!singleInstanceLock) {
    app.quit();
} else {
    app.on('second-instance', () => {
        const windows = BrowserWindow.getAllWindows();
        if (windows[0]) {
            windows[0].show();
            windows[0].focus();
        }
    });

    app.whenReady().then(async () => {
        startServer();
        try {
            await waitForServerReady(`http://localhost:${APP_PORT}/health`);
        } catch (_) {
            // Continuar igualmente; la ventana intentará cargar
        }
        createMainWindow();
    });
}

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
});

app.on('before-quit', () => {
    if (serverProcess && !serverProcess.killed) {
        try { serverProcess.kill(); } catch (_) {}
    }
});

