window.exports = {
   "demo_match_text": { // 注意：键对应的是 plugin.json 中的 features.code
      mode: "none",  // 用于无需 UI 显示，执行一些简单的代码
      args: {
         // 进入插件应用时调用
         enter: (action) => {
            // action = { code, type, payload }
            window.utools.hideMainWindow();
            
            // 获取传入的 ASIN 号
            const asin = action.payload;

            var cp = require('child_process');
            
            // 动态构造 URL 并打开浏览器
            var open = function(baseUrl, path, browserName) {
                const fullUrl = baseUrl + path;  // 拼接完整的URL
                cp.exec('start ' + browserName + ' ' + fullUrl, function (err, stdout, stderr) {
                    if (err) {
                        console.log(err);
                    }
                    // 在浏览器打开后退出插件
                    window.utools.outPlugin();
                });
            };

            // 打开 Chrome 浏览器，并导航到指定的亚马逊产品页面
            open("https://www.amazon.com/dp/", asin, 'chrome');
         }
      }
   }
}
