const fs = require('fs');
const path = require('path');
const CleanCSS = require('clean-css');
const { minify } = require('terser');

const cssOptions = {
  level: {
    1: {
      all: true,
      normalizeUrls: false // preserve exact url() strings
    }
  }
};

const terserOptions = {
  compress: {
    drop_console: false, // preserve console messages
    passes: 1
  },
  mangle: false // keep function & variable names safe so HTML inline onclicks still work!
};

async function minifyFiles() {
  const cssCleaner = new CleanCSS(cssOptions);
  
  // List of CSS files to minify
  const cssFiles = [
    'public/style.css',
    'public/about.css',
    'public/contact.css',
    'public/projects.css',
    'public/project-pages.css',
    'public/resume.css',
    'public/streams.css',
    'public/learning-tools-v6.css',
    'public/home-v5.css',
    'public/Learn/Learn-CCNA/learn-ccna.css',
    'public/Learn/Learn-JS/learn-js.css',
    'public/Learn/Learn-MySQL/learn-mysql.css',
    'public/Learn/Learn-English/learn-english.css'
  ];

  // List of JS files to minify
  const jsFiles = [
    'public/main.js',
    'public/toast.js',
    'public/contact.js',
    'public/projects.js',
    'public/project-pages.js',
    'public/resume.js',
    'public/streams.js',
    'public/home-v5.js',
    'public/global-profile.js',
    'public/Learn/Learn-CCNA/learn-ccna.js',
    'public/Learn/Learn-JS/learn-js.js',
    'public/Learn/Learn-MySQL/learn-mysql.js',
    'public/Learn/Learn-English/learn-english.js'
  ];

  // Also check if calculator.js exists
  if (fs.existsSync('public/tools/calculator.js')) jsFiles.push('public/tools/calculator.js');
  if (fs.existsSync('public/tools/subnet-calculator.js')) jsFiles.push('public/tools/subnet-calculator.js');

  console.log('--- MINIFYING CSS FILES ---');
  for (const f of cssFiles) {
    if (fs.existsSync(f)) {
      const orig = fs.readFileSync(f, 'utf8');
      const backupDir = path.join('public_src', path.dirname(f));
      fs.mkdirSync(backupDir, { recursive: true });
      fs.writeFileSync(path.join('public_src', f), orig, 'utf8');

      const res = cssCleaner.minify(orig);
      if (res.errors && res.errors.length > 0) {
        console.error('❌ Error minifying ' + f + ':', res.errors);
      } else {
        fs.writeFileSync(f, res.styles, 'utf8');
        const pct = ((1 - res.styles.length / orig.length) * 100).toFixed(1);
        console.log(`✅ CSS: ${f.padEnd(45)} (${(orig.length/1024).toFixed(1)}KB -> ${(res.styles.length/1024).toFixed(1)}KB, -${pct}%)`);
      }
    } else {
      console.log('⚠️ Not found: ' + f);
    }
  }

  console.log('\n--- MINIFYING JS FILES ---');
  for (const f of jsFiles) {
    if (fs.existsSync(f)) {
      const orig = fs.readFileSync(f, 'utf8');
      const backupDir = path.join('public_src', path.dirname(f));
      fs.mkdirSync(backupDir, { recursive: true });
      fs.writeFileSync(path.join('public_src', f), orig, 'utf8');

      try {
        const res = await minify(orig, terserOptions);
        if (res.code) {
          fs.writeFileSync(f, res.code, 'utf8');
          const pct = ((1 - res.code.length / orig.length) * 100).toFixed(1);
          console.log(`✅ JS:  ${f.padEnd(45)} (${(orig.length/1024).toFixed(1)}KB -> ${(res.code.length/1024).toFixed(1)}KB, -${pct}%)`);
        }
      } catch (err) {
        console.error('❌ Error minifying ' + f + ':', err.message);
      }
    } else {
      console.log('⚠️ Not found: ' + f);
    }
  }

  console.log('\n🎉 ALL ASSETS MINIFIED SUCCESSFULLY!');
}

minifyFiles();
