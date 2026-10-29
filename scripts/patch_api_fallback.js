const fs = require('fs');

let code = fs.readFileSync('server.js', 'utf8');

code = code.replace(
`        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch' });
        }`,
`        } catch (err) {
            console.warn(\`API cache fallback for \${key}:\`, err.message);
            const fallback = key === 'profile' ? {} : [];
            res.json(fallback);
        }`
);

fs.writeFileSync('server.js', code, 'utf8');
console.log('✅ server.js patched with resilient API fallbacks');
