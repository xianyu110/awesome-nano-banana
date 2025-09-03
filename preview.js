const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 8000;

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    let pathname = parsedUrl.pathname;

    // 默认访问index.html
    if (pathname === '/') {
        pathname = '/index.html';
    }

    // 构建文件路径
    let filePath = path.join(__dirname, pathname);

    // 检查文件是否存在
    if (!fs.existsSync(filePath)) {
        // 如果是访问cases目录下的文件，可能不存在，使用占位符
        if (pathname.startsWith('/cases/')) {
            res.writeHead(404);
            res.end('File not found');
            return;
        }

        // 其他文件不存在
        res.writeHead(404);
        res.end('File not found');
        return;
    }

    // 获取文件扩展名
    const ext = path.extname(filePath);

    // 设置Content-Type
    const contentTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'text/javascript',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.ico': 'image/x-icon'
    };

    const contentType = contentTypes[ext] || 'text/plain';

    // 读取文件
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(500);
            res.end('Internal server error');
            return;
        }

        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    });
});

server.listen(PORT, () => {
    console.log(`🍌 Awesome Nano Banana Preview Server`);
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`📁 Serving files from: ${__dirname}`);
    console.log(`💡 Open your browser and visit: http://localhost:${PORT}`);
    console.log(`\n📋 Available pages:`);
    console.log(`   • Main site: http://localhost:${PORT}/`);
    console.log(`   • GitHub Pages Guide: http://localhost:${PORT}/README-GitHub-Pages.html`);
    console.log(`\n⚠️  Note: Some case images may not display if they don't exist locally`);
    console.log(`🔧 Press Ctrl+C to stop the server`);
});

process.on('SIGINT', () => {
    console.log('\n👋 Shutting down preview server...');
    server.close(() => {
        console.log('✅ Server stopped');
        process.exit(0);
    });
});
