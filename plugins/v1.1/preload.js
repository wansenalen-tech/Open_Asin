window.exports = {
   "demo_match_text": { // 注意：键对应的是 plugin.json 中的 features.code
      mode: "none",  // 用于无需 UI 显示，执行一些简单的代码
      args: {
         enter: (action) => {
            window.utools.hideMainWindow();
            
            // 获取传入的 ASIN 号或完整 URL
            const input = action.payload;

            var cp = require('child_process');
            
            // 动态构造 URL 并打开浏览器
            function openUrl(baseUrl, path, browserName) {
                let fullUrl;
                
                if (path.startsWith('B0')) {
                    fullUrl = `${baseUrl}${path}`;
                } else if (path.includes('www.amazon.com') || path.includes('amazon.com')) {
                    fullUrl = path;
                } else {
                    console.error("Invalid input:", path);
                    window.utools.showNotification({ title: "插件通知", content: "无效的输入，请检查输入内容。" });
                    return;
                }
                
                cp.exec(`start ${browserName} "${fullUrl}"`, function (err, stdout, stderr) {
                    if (err) {
                        console.error("Error opening browser:", err);
                        window.utools.showNotification({ title: "插件通知", content: "打开浏览器失败：" + err.message });
                    }
                    
                    // 在浏览器打开后退出插件
                    window.utools.outPlugin();
                });
            }

            openUrl("https://www.amazon.com/dp/", input, 'msedge');
         }
      }
   }
};
