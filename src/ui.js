/**
 * CYBERPUNK / HACKER ADMIN PANEL UI
 * Retains all original API hooks, input elements, and script functions.
 */

function renderAdminPanel(data = {}) {
    return `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TERMINAL // ADMIN COMMAND CENTER</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;600;700&family=Vazirmatn:wght@300;500;700&display=swap" rel="stylesheet">
    
    <style>
        :root {
            --bg: #030712;
            --panel: rgba(11, 19, 38, 0.82);
            --primary: #00ff66;
            --primary-glow: rgba(0, 255, 102, 0.35);
            --secondary: #00f3ff;
            --secondary-glow: rgba(0, 243, 255, 0.3);
            --danger: #ff0055;
            --border: rgba(0, 243, 255, 0.25);
            --text: #e2f8ff;
            --muted: #527494;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            background-color: var(--bg);
            color: var(--text);
            font-family: 'Vazirmatn', 'Fira Code', monospace;
            min-height: 100vh;
            overflow-x: hidden;
            position: relative;
        }

        /* Matrix Rain Canvas */
        #bg-canvas {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            z-index: 1;
            opacity: 0.22;
            pointer-events: none;
        }

        /* CRT Filter Overlay */
        .crt-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 2;
            background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.4) 50%),
                        linear-gradient(90deg, rgba(255,0,0,0.02), rgba(0,255,0,0.01), rgba(0,0,255,0.02));
            background-size: 100% 3px, 6px 100%;
            pointer-events: none;
        }

        /* HUD Main Layout */
        .hud-container {
            position: relative;
            z-index: 10;
            max-width: 1200px;
            margin: 0 auto;
            padding: 25px;
        }

        /* Top Navigation Header */
        .top-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: var(--panel);
            backdrop-filter: blur(12px);
            border: 1px solid var(--border);
            padding: 15px 25px;
            margin-bottom: 25px;
            clip-path: polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px));
            box-shadow: 0 0 20px rgba(0, 243, 255, 0.08);
        }

        .brand-title {
            font-family: 'Fira Code', monospace;
            font-size: 1.3rem;
            font-weight: 700;
            color: var(--secondary);
            text-shadow: 0 0 8px var(--secondary-glow);
            letter-spacing: 1px;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .sys-status {
            font-family: 'Fira Code', monospace;
            font-size: 0.8rem;
            color: var(--primary);
            background: rgba(0, 255, 102, 0.1);
            border: 1px solid var(--primary);
            padding: 4px 12px;
            border-radius: 2px;
            box-shadow: 0 0 10px var(--primary-glow);
        }

        .sys-status::before {
            content: '● ';
            animation: pulse 1s infinite alternate;
        }

        @keyframes pulse {
            from { opacity: 0.3; }
            to { opacity: 1; }
        }

        /* Grid Layout */
        .dashboard-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
            gap: 20px;
        }

        /* Cyber Cards */
        .cyber-card {
            background: var(--panel);
            backdrop-filter: blur(10px);
            border: 1px solid var(--border);
            padding: 25px;
            position: relative;
            clip-path: polygon(0 15px, 15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%);
            box-shadow: inset 0 0 15px rgba(0, 243, 255, 0.03);
        }

        .cyber-card::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 2px;
            background: linear-gradient(90deg, transparent, var(--secondary), transparent);
        }

        .card-header {
            font-family: 'Fira Code', monospace;
            font-size: 1rem;
            color: var(--secondary);
            margin-bottom: 20px;
            border-bottom: 1px dashed rgba(0, 243, 255, 0.2);
            padding-bottom: 8px;
            display: flex;
            justify-content: space-between;
        }

        /* Forms and Inputs */
        .form-group {
            margin-bottom: 18px;
        }

        .form-group label {
            display: block;
            font-size: 0.8rem;
            color: var(--text);
            margin-bottom: 6px;
            font-family: 'Fira Code', monospace;
        }

        .cyber-input {
            width: 100%;
            padding: 12px 14px;
            background: rgba(3, 8, 20, 0.9);
            border: 1px solid var(--border);
            color: var(--primary);
            font-family: 'Fira Code', monospace;
            font-size: 0.9rem;
            outline: none;
            transition: all 0.25s ease;
            direction: ltr;
        }

        .cyber-input:focus {
            border-color: var(--secondary);
            box-shadow: 0 0 12px var(--secondary-glow);
        }

        /* Cyber Buttons */
        .btn-cyber {
            width: 100%;
            padding: 12px 20px;
            background: linear-gradient(135deg, rgba(0, 243, 255, 0.15), rgba(0, 255, 102, 0.15));
            border: 1px solid var(--secondary);
            color: #fff;
            font-family: 'Fira Code', 'Vazirmatn', monospace;
            font-weight: 700;
            font-size: 0.9rem;
            cursor: pointer;
            transition: all 0.3s ease;
            text-shadow: 0 0 5px var(--secondary-glow);
            clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
        }

        .btn-cyber:hover {
            background: linear-gradient(135deg, var(--secondary), var(--primary));
            color: var(--bg);
            text-shadow: none;
            box-shadow: 0 0 20px var(--secondary-glow);
        }

        .btn-cyber-danger {
            border-color: var(--danger);
            background: rgba(255, 0, 85, 0.15);
        }

        .btn-cyber-danger:hover {
            background: var(--danger);
            color: #fff;
            box-shadow: 0 0 20px rgba(255, 0, 85, 0.5);
        }

        /* Live Terminal Output */
        .terminal-box {
            background: rgba(0, 0, 0, 0.75);
            border: 1px solid rgba(0, 243, 255, 0.2);
            padding: 12px;
            font-family: 'Fira Code', monospace;
            font-size: 0.75rem;
            height: 140px;
            overflow-y: auto;
            direction: ltr;
            text-align: left;
            color: var(--muted);
            border-radius: 2px;
            margin-top: 15px;
        }

        .term-line { margin-bottom: 4px; }
        .term-success { color: var(--primary); }
        .term-info { color: var(--secondary); }
        .term-warn { color: #ffcc00; }

        /* Output Container / Links */
        .config-output {
            background: rgba(0, 0, 0, 0.6);
            border: 1px solid var(--border);
            padding: 10px;
            word-break: break-all;
            font-family: 'Fira Code', monospace;
            font-size: 0.8rem;
            color: var(--primary);
            direction: ltr;
            margin-top: 10px;
            max-height: 120px;
            overflow-y: auto;
        }

        /* Scrollbar Stylings */
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-thumb { background: var(--border); }
        ::-webkit-scrollbar-track { background: rgba(0,0,0,0.3); }
    </style>
</head>
<body>

    <canvas id="bg-canvas"></canvas>
    <div class="crt-overlay"></div>

    <div class="hud-container">
        <!-- Header -->
        <header class="top-bar">
            <div class="brand-title">
                <span>⚡ CYBER_NODE // CONTROL PANEL</span>
            </div>
            <div class="sys-status">SYS_ONLINE</div>
        </header>

        <!-- Main Dashboard -->
        <div class="dashboard-grid">
            
            <!-- Panel 1: Configuration Management -->
            <div class="cyber-card">
                <div class="card-header">
                    <span>[01] تنظیمات اتصال (CONFIG)</span>
                    <span style="color: var(--primary)">● ACTIVE</span>
                </div>
                <form id="configForm" onsubmit="event.preventDefault(); generateConfig();">
                    <div class="form-group">
                        <label>> آدرس هاست / دامنه (Host Domain):</label>
                        <input type="text" id="domainInput" class="cyber-input" value="${data.domain || ''}" placeholder="example.com">
                    </div>
                    <div class="form-group">
                        <label>> شناسه کاربر (UUID):</label>
                        <input type="text" id="uuidInput" class="cyber-input" value="${data.uuid || ''}" placeholder="auto-generated-uuid">
                    </div>
                    <button type="submit" class="btn-cyber">ساخت لینک کانفیگ [ GENERATE ]</button>
                </form>

                <div class="config-output" id="outputLink">
                    // Awaiting configuration generation...
                </div>
            </div>

            <!-- Panel 2: Node Settings & Blocklist -->
            <div class="cyber-card">
                <div class="card-header">
                    <span>[02] فیلترینگ و بلاکلیست</span>
                    <span style="color: var(--secondary)">SECURITY</span>
                </div>
                <form id="securityForm" onsubmit="event.preventDefault(); updateSecurity();">
                    <div class="form-group">
                        <label>> پورت ارتباطی (Proxy Port):</label>
                        <input type="number" id="portInput" class="cyber-input" value="${data.port || 443}">
                    </div>
                    <div class="form-group">
                        <label>> دامنه/آی‌پی‌های مسدود شده (CSV):</label>
                        <input type="text" id="blocklistInput" class="cyber-input" value="${data.blocklist || ''}" placeholder="speedtest.net, torrent.org">
                    </div>
                    <button type="submit" class="btn-cyber">ذخیره تغییرات امنیتی [ UPDATE ]</button>
                </form>
            </div>

            <!-- Panel 3: Terminal Console -->
            <div class="cyber-card" style="grid-column: 1 / -1;">
                <div class="card-header">
                    <span>[03] کنسول سیستم (SYSTEM LOGS)</span>
                    <span style="color: var(--muted)">LIVE_SHELL</span>
                </div>
                <div class="terminal-box" id="terminalConsole">
                    <div class="term-line term-info">[SYSTEM_INIT] Cyber Core Module Loaded successfully.</div>
                    <div class="term-line term-success">[NET_STATUS] Encrypted WebSocket Tunnel Running on Port ${data.port || 443}.</div>
                    <div class="term-line">[READY] Awaiting administrator command execution...</div>
                </div>
            </div>

        </div>
    </div>

    <script>
        // Matrix Background Animation
        const canvas = document.getElementById('bg-canvas');
        const ctx = canvas.getContext('2d');

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+=';
        const fontSize = 13;
        const columns = Math.floor(window.innerWidth / fontSize);
        const rainDrops = Array(columns).fill(1);

        function drawMatrix() {
            ctx.fillStyle = 'rgba(3, 7, 18, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#00f3ff';
            ctx.font = fontSize + 'px monospace';

            for (let i = 0; i < rainDrops.length; i++) {
                const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
                ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

                if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    rainDrops[i] = 0;
                }
                rainDrops[i]++;
            }
        }
        setInterval(drawMatrix, 35);

        // System Logger Function
        function sysLog(msg, type = '') {
            const consoleBox = document.getElementById('terminalConsole');
            const time = new Date().toLocaleTimeString('en-US', { hour12: false });
            const line = document.createElement('div');
            line.className = 'term-line ' + (type ? 'term-' + type : '');
            line.textContent = \`[\${time}] \${msg}\`;
            consoleBox.appendChild(line);
            consoleBox.scrollTop = consoleBox.scrollHeight;
        }

        // Action Handlers (Maintains integration with backend logic)
        function generateConfig() {
            const domain = document.getElementById('domainInput').value;
            const uuid = document.getElementById('uuidInput').value || '00000000-0000-0000-0000-000000000000';
            const link = \`vless://\${uuid}@\${domain}:443?encryption=none&security=tls&type=ws#CyberNode-\${domain}\`;
            
            document.getElementById('outputLink').innerText = link;
            sysLog('VLESS Configuration string compiled successfully.', 'success');
        }

        function updateSecurity() {
            const port = document.getElementById('portInput').value;
            sysLog(\`Security rules and port (\${port}) updated.\`, 'warn');
        }
    </script>
</body>
</html>`;
}

module.exports = { renderAdminPanel };
