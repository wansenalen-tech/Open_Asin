const { exec } = require('child_process');
const { platform } = process;
const fs = require('fs'); 
const path = require('path');

const fileExists = (filePath) => {
    try {
        // uTools 环境下，路径可能需要特殊处理
        return fs.existsSync(filePath);
    } catch (e) {
        return false;
    }
}

// 辅助函数：获取特定浏览器在特定系统上的通用安装路径
const getBrowserPaths = (code, platform) => {
    switch (platform) {
        case 'darwin': // macOS
            switch (code) {
                case 'chrome': return ['/Applications/Google Chrome.app'];
                case 'msedge': return ['/Applications/Microsoft Edge.app'];
                case 'firefox': return ['/Applications/Firefox.app'];
                case 'safari': return ['/Applications/Safari.app']; 
                default: return [];
            }
        case 'win32': // Windows
            const programFiles = process.env['ProgramFiles'];
            const programFilesX86 = process.env['ProgramFiles(x86)'];
            switch (code) {
                case 'chrome': 
                    return [
                        path.join(programFiles, 'Google', 'Chrome', 'Application', 'chrome.exe'),
                        path.join(programFilesX86, 'Google', 'Chrome', 'Application', 'chrome.exe')
                    ].filter(Boolean);
                case 'msedge':
                    return [
                        path.join(programFiles, 'Microsoft', 'Edge', 'Application', 'msedge.exe'),
                        path.join(programFilesX86, 'Microsoft', 'Edge', 'Application', 'msedge.exe')
                    ].filter(Boolean);
                case 'firefox': 
                    return [
                        path.join(programFiles, 'Mozilla Firefox', 'firefox.exe'),
                        path.join(programFilesX86, 'Mozilla Firefox', 'firefox.exe')
                    ].filter(Boolean);
                default: return [];
            }
        case 'linux': // Linux
            switch (code) {
                case 'chrome': return ['/usr/bin/google-chrome', '/usr/bin/chromium'];
                case 'msedge': return ['/usr/bin/microsoft-edge'];
                case 'firefox': return ['/usr/bin/firefox'];
                default: return [];
            }
        default:
            return [];
    }
};

window.preload = {
    detectInstalledBrowsers: () => {
        const installedCodes = [];
        const browserCodes = ['chrome', 'msedge', 'firefox', 'safari']; // 移除 'custom'

        browserCodes.forEach(code => {
            if (code === 'safari' && platform !== 'darwin') {
                return; 
            }
            
            const paths = getBrowserPaths(code, platform);
            const found = paths.some(p => fileExists(p));

            if (found) {
                installedCodes.push(code);
            }
        });

        if (platform === 'linux' && installedCodes.length < 3) {
            if (!installedCodes.includes('chrome')) installedCodes.push('chrome');
            if (!installedCodes.includes('msedge')) installedCodes.push('msedge');
            if (!installedCodes.includes('firefox')) installedCodes.push('firefox');
        }

        installedCodes.push('default');
        
        return [...new Set(installedCodes)];
    },

    openBrowser: (url, browserCode, browserName) => {
        let cmd = '';
        const name = browserName || '指定浏览器';
        
        // 只有 default 才会使用 utools.shellOpenExternal
        if (browserCode === 'default') {
            utools.shellOpenExternal(url);
            utools.outPlugin();
            return;
        }

        const browserMaps = {
            'darwin': { 'chrome': 'Google Chrome', 'msedge': 'Microsoft Edge', 'firefox': 'Firefox', 'safari': 'Safari' },
            'win32': { 'chrome': 'chrome', 'msedge': 'msedge', 'firefox': 'firefox', 'safari': 'chrome' },
            'linux': { 'chrome': 'google-chrome', 'msedge': 'microsoft-edge', 'firefox': 'firefox', 'safari': 'xdg-open' }
        };

        const targetMap = browserMaps[platform] || browserMaps['win32'];
        const targetExe = targetMap[browserCode] || targetMap['chrome'];

        if (platform === 'darwin') {
            cmd = `open -a "${targetExe}" "${url}"`;
        } else if (platform === 'win32') {
            cmd = `start "" "${targetExe}" "${url}"`; 
        } else if (platform === 'linux') {
            if (browserCode === 'safari') {
                cmd = `xdg-open "${url}"`;
            } else {
                cmd = `${targetExe} "${url}"`;
            }
        } else {
            utools.showNotification(`未知的操作系统平台 (${platform})，已使用系统默认浏览器打开。`);
            utools.shellOpenExternal(url);
            utools.outPlugin();
            return;
        }

        exec(cmd, (err) => {
            if (err) {
                utools.showNotification(`⚠️ 打开 ${name} 失败，已回退到系统默认浏览器。`);
                utools.shellOpenExternal(url); 
            }
            
            utools.outPlugin();
        });
    }
};
