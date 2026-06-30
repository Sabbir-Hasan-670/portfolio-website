'use strict';

const COURSE_DAYS = [
  {
    day: 1, title: 'SQL Intro, Syntax & Basic SELECT', level: 'beginner',
    topics: ["SQL Intro"],
    description: 'What is SQL, Syntax rules, SELECT statements.',
    grammar: { title: 'SQL Intro, Syntax & Basic SELECT', content: '<p>SQL পরিচিতি এবং ডেটা দেখার নিয়ম।</p><p><strong>Example/Note:</strong> This covers the core concepts from the W3Schools SQL syllabus.</p>' },
    practice_query: `SELECT * FROM employees;`
  },
  {
    day: 2, title: 'SELECT DISTINCT, TOP/LIMIT & Comments', level: 'beginner',
    topics: ["SELECT DISTINCT"],
    description: 'Unique values, limiting results, adding comments.',
    grammar: { title: 'SELECT DISTINCT, TOP/LIMIT & Comments', content: '<p>ডুপ্লিকেট ডেটা বাদ দেওয়া এবং নির্দিষ্ট সংখ্যক ডেটা দেখা।</p><p><strong>Example/Note:</strong> This covers the core concepts from the W3Schools SQL syllabus.</p>' },
    practice_query: `SELECT DISTINCT department FROM employees;`
  },
  {
    day: 3, title: 'Filtering: WHERE & Operators', level: 'beginner',
    topics: ["Filtering: WHERE"],
    description: 'WHERE clause, =, <, > operators.',
    grammar: { title: 'Filtering: WHERE & Operators', content: '<p>শর্ত দিয়ে ডেটা ফিল্টার করা (যেমন: বয়স > ৩০)।</p><p><strong>Example/Note:</strong> This covers the core concepts from the W3Schools SQL syllabus.</p>' },
    practice_query: `SELECT * FROM employees WHERE age > 25;`
  },
  {
    day: 4, title: 'AND, OR, NOT', level: 'beginner',
    topics: ["AND"],
    description: 'Combining multiple conditions.',
    grammar: { title: 'AND, OR, NOT', content: '<p>একাধিক শর্ত একসাথে মেলানো (AND, OR, NOT)।</p><p><strong>Example/Note:</strong> This covers the core concepts from the W3Schools SQL syllabus.</p>' },
    practice_query: `SELECT * FROM employees WHERE age > 25 AND department = \'Engineering\';`
  },
  {
    day: 5, title: 'Sorting: ORDER BY', level: 'beginner',
    topics: ["Sorting: ORDER BY"],
    description: 'Sorting results ASC or DESC.',
    grammar: { title: 'Sorting: ORDER BY', content: '<p>ফলাফল ছোট থেকে বড় বা বড় থেকে ছোট সাজানো।</p><p><strong>Example/Note:</strong> This covers the core concepts from the W3Schools SQL syllabus.</p>' },
    practice_query: `SELECT * FROM employees ORDER BY age DESC;`
  },
  {
    day: 6, title: 'INSERT INTO', level: 'beginner',
    topics: ["INSERT INTO"],
    description: 'Inserting new rows into a table.',
    grammar: { title: 'INSERT INTO', content: '<p>টেবিলে নতুন ডেটা ঢোকানোর নিয়ম।</p><p><strong>Example/Note:</strong> This covers the core concepts from the W3Schools SQL syllabus.</p>' },
    practice_query: `INSERT INTO employees (id, name, age) VALUES (5, \'Kamal\', 29);`
  },
  {
    day: 7, title: 'NULL Values & IS NULL', level: 'beginner',
    topics: ["NULL Values"],
    description: 'Handling missing or null data.',
    grammar: { title: 'NULL Values & IS NULL', content: '<p>খালি বা NULL ডেটা কীভাবে খুঁজে বের করতে হয়।</p><p><strong>Example/Note:</strong> This covers the core concepts from the W3Schools SQL syllabus.</p>' },
    practice_query: `SELECT * FROM employees WHERE department IS NULL;`
  },
  {
    day: 8, title: 'UPDATE', level: 'beginner',
    topics: ["UPDATE"],
    description: 'Modifying existing records.',
    grammar: { title: 'UPDATE', content: '<p>আগে থেকে থাকা ডেটা পরিবর্তন বা আপডেট করা।</p><p><strong>Example/Note:</strong> This covers the core concepts from the W3Schools SQL syllabus.</p>' },
    practice_query: `UPDATE employees SET age = 26 WHERE id = 2;`
  },
  {
    day: 9, title: 'DELETE', level: 'beginner',
    topics: ["DELETE"],
    description: 'Deleting records from a table.',
    grammar: { title: 'DELETE', content: '<p>টেবিল থেকে অপ্রয়োজনীয় ডেটা মুছে ফেলা।</p><p><strong>Example/Note:</strong> This covers the core concepts from the W3Schools SQL syllabus.</p>' },
    practice_query: `DELETE FROM employees WHERE id = 4;`
  },
  {
    day: 10, title: 'Aggregate Functions: MIN, MAX, COUNT, SUM, AVG', level: 'beginner',
    topics: ["Aggregate Functions: MIN"],
    description: 'Calculating statistics on data.',
    grammar: { title: 'Aggregate Functions: MIN, MAX, COUNT, SUM, AVG', content: '<p>সর্বোচ্চ, সর্বনিম্ন, মোট এবং গড় মান বের করা।</p><p><strong>Example/Note:</strong> This covers the core concepts from the W3Schools SQL syllabus.</p>' },
    practice_query: `SELECT COUNT(*), AVG(age) FROM employees;`
  },
  {
    day: 11, title: 'LIKE & Wildcards', level: 'intermediate',
    topics: ["LIKE"],
    description: 'Pattern matching with % and _.',
    grammar: { title: 'LIKE & Wildcards', content: '<p>নির্দিষ্ট প্যাটার্নের টেক্সট বা নাম খোঁজা (যেমন \'A\' দিয়ে শুরু)।</p><p><strong>Example/Note:</strong> This covers the core concepts from the W3Schools SQL syllabus.</p>' },
    practice_query: `SELECT * FROM employees WHERE name LIKE \'A%\';`
  },
  {
    day: 12, title: 'IN & BETWEEN', level: 'intermediate',
    topics: ["IN"],
    description: 'Checking multiple values or ranges.',
    grammar: { title: 'IN & BETWEEN', content: '<p>একাধিক মান বা নির্দিষ্ট রেঞ্জের ভেতরের ডেটা খোঁজা।</p><p><strong>Example/Note:</strong> This covers the core concepts from the W3Schools SQL syllabus.</p>' },
    practice_query: `SELECT * FROM employees WHERE age BETWEEN 25 AND 30;`
  },
  {
    day: 13, title: 'Aliases (AS)', level: 'intermediate',
    topics: ["Aliases (AS)"],
    description: 'Renaming columns or tables temporarily.',
    grammar: { title: 'Aliases (AS)', content: '<p>কলাম বা টেবিলের একটি সাময়িক/সহজ নাম দেওয়া।</p><p><strong>Example/Note:</strong> This covers the core concepts from the W3Schools SQL syllabus.</p>' },
    practice_query: `SELECT name AS EmployeeName FROM employees;`
  },
  {
    day: 14, title: 'SQL Joins Intro & INNER JOIN', level: 'intermediate',
    topics: ["SQL Joins Intro"],
    description: 'Combining tables based on relationships.',
    grammar: { title: 'SQL Joins Intro & INNER JOIN', content: '<p>দুটি টেবিলের মধ্যে মিলে যাওয়া ডেটা একসাথে জোড়া লাগানো।</p><p><strong>Example/Note:</strong> This covers the core concepts from the W3Schools SQL syllabus.</p>' },
    practice_query: `-- Assume \'departments\' table exists
SELECT e.name, d.dept_name FROM employees e INNER JOIN departments d ON e.department = d.id;`
  },
  {
    day: 15, title: 'LEFT JOIN & RIGHT JOIN', level: 'intermediate',
    topics: ["LEFT JOIN"],
    description: 'Keeping all records from left or right table.',
    grammar: { title: 'LEFT JOIN & RIGHT JOIN', content: '<p>যেকোনো একদিকের টেবিলের সব ডেটা রেখে অন্য টেবিলের সাথে জোড়া দেওয়া।</p><p><strong>Example/Note:</strong> This covers the core concepts from the W3Schools SQL syllabus.</p>' },
    practice_query: `-- Try changing INNER JOIN to LEFT JOIN in practice mode!`
  },
  {
    day: 16, title: 'FULL JOIN & SELF JOIN', level: 'intermediate',
    topics: ["FULL JOIN"],
    description: 'Full outer joins and joining a table to itself.',
    grammar: { title: 'FULL JOIN & SELF JOIN', content: '<p>দুটি টেবিলের সব ডেটা একসাথে আনা অথবা একই টেবিলের ভেতরেই জয়েন করা।</p><p><strong>Example/Note:</strong> This covers the core concepts from the W3Schools SQL syllabus.</p>' },
    practice_query: `-- Not all DBs support FULL JOIN natively. Use UNION of LEFT and RIGHT!`
  },
  {
    day: 17, title: 'UNION & UNION ALL', level: 'intermediate',
    topics: ["UNION"],
    description: 'Combining result-sets of multiple queries.',
    grammar: { title: 'UNION & UNION ALL', content: '<p>দুটি আলাদা SELECT কোয়েরির ফলাফল একসাথে জোড়া লাগানো।</p><p><strong>Example/Note:</strong> This covers the core concepts from the W3Schools SQL syllabus.</p>' },
    practice_query: `SELECT name FROM employees UNION SELECT dept_name FROM departments;`
  },
  {
    day: 18, title: 'GROUP BY & HAVING', level: 'intermediate',
    topics: ["GROUP BY"],
    description: 'Grouping data for aggregate functions.',
    grammar: { title: 'GROUP BY & HAVING', content: '<p>একই ধরনের ডেটা গ্রুপ করে ফিল্টার করা।</p><p><strong>Example/Note:</strong> This covers the core concepts from the W3Schools SQL syllabus.</p>' },
    practice_query: `SELECT department, COUNT(*) FROM employees GROUP BY department;`
  },
  {
    day: 19, title: 'EXISTS, ANY, ALL', level: 'advanced',
    topics: ["EXISTS"],
    description: 'Advanced subquery conditions.',
    grammar: { title: 'EXISTS, ANY, ALL', content: '<p>সাব-কোয়েরিতে কোনো ডেটা আছে কিনা তা চেক করা।</p><p><strong>Example/Note:</strong> This covers the core concepts from the W3Schools SQL syllabus.</p>' },
    practice_query: `SELECT name FROM employees WHERE EXISTS (SELECT 1 FROM departments);`
  },
  {
    day: 20, title: 'SELECT INTO & INSERT INTO SELECT', level: 'advanced',
    topics: ["SELECT INTO"],
    description: 'Copying data between tables.',
    grammar: { title: 'SELECT INTO & INSERT INTO SELECT', content: '<p>এক টেবিল থেকে ডেটা কপি করে অন্য নতুন টেবিলে ঢোকানো।</p><p><strong>Example/Note:</strong> This covers the core concepts from the W3Schools SQL syllabus.</p>' },
    practice_query: `INSERT INTO new_table SELECT * FROM employees;`
  },
  {
    day: 21, title: 'CASE Statement', level: 'advanced',
    topics: ["CASE Statement"],
    description: 'If-Else logic in SQL queries.',
    grammar: { title: 'CASE Statement', content: '<p>SQL এর ভেতরে if-else এর মতো লজিক তৈরি করা।</p><p><strong>Example/Note:</strong> This covers the core concepts from the W3Schools SQL syllabus.</p>' },
    practice_query: `SELECT name, CASE WHEN age > 30 THEN \'Senior\' ELSE \'Junior\' END AS level FROM employees;`
  },
  {
    day: 22, title: 'Null Functions (IFNULL, COALESCE)', level: 'advanced',
    topics: ["Null Functions (IFNULL"],
    description: 'Handling null outputs gracefully.',
    grammar: { title: 'Null Functions (IFNULL, COALESCE)', content: '<p>NULL মানের বদলে ডিফল্ট কিছু দেখানো।</p><p><strong>Example/Note:</strong> This covers the core concepts from the W3Schools SQL syllabus.</p>' },
    practice_query: `SELECT name, IFNULL(department, \'Not Assigned\') FROM employees;`
  },
  {
    day: 23, title: 'Database: Create, Drop, Backup DB', level: 'advanced',
    topics: ["Database: Create"],
    description: 'Managing databases.',
    grammar: { title: 'Database: Create, Drop, Backup DB', content: '<p>নতুন ডেটাবেস তৈরি, ডিলিট এবং ব্যাকআপ নেওয়ার নিয়ম।</p><p><strong>Example/Note:</strong> This covers the core concepts from the W3Schools SQL syllabus.</p>' },
    practice_query: `CREATE DATABASE testDB;`
  },
  {
    day: 24, title: 'Table: Create, Drop, Alter', level: 'advanced',
    topics: ["Table: Create"],
    description: 'Managing table structure.',
    grammar: { title: 'Table: Create, Drop, Alter', content: '<p>টেবিল তৈরি, পরিবর্তন এবং কলাম যোগ করা।</p><p><strong>Example/Note:</strong> This covers the core concepts from the W3Schools SQL syllabus.</p>' },
    practice_query: `CREATE TABLE users (id INT, name VARCHAR(255));`
  },
  {
    day: 25, title: 'Constraints (NOT NULL, UNIQUE, PK, FK)', level: 'advanced',
    topics: ["Constraints (NOT NULL"],
    description: 'Enforcing data integrity rules.',
    grammar: { title: 'Constraints (NOT NULL, UNIQUE, PK, FK)', content: '<p>টেবিলে ডেটা ঢোকানোর সময় নিয়ম বা বাধা দেওয়া (যেমন প্রাইমারি কী)।</p><p><strong>Example/Note:</strong> This covers the core concepts from the W3Schools SQL syllabus.</p>' },
    practice_query: `CREATE TABLE test (id INT PRIMARY KEY);`
  },
  {
    day: 26, title: 'Auto Increment & Dates', level: 'advanced',
    topics: ["Auto Increment"],
    description: 'Auto-generating IDs and handling dates.',
    grammar: { title: 'Auto Increment & Dates', content: '<p>স্বয়ংক্রিয়ভাবে সিরিয়াল নাম্বার এবং তারিখ নিয়ে কাজ করা।</p><p><strong>Example/Note:</strong> This covers the core concepts from the W3Schools SQL syllabus.</p>' },
    practice_query: `-- In MySQL: id INT AUTO_INCREMENT`
  },
  {
    day: 27, title: 'Create Index & Views', level: 'advanced',
    topics: ["Create Index"],
    description: 'Speeding up queries and virtual tables.',
    grammar: { title: 'Create Index & Views', content: '<p>কোয়েরি ফাস্ট করার জন্য ইনডেক্স এবং ভিউ তৈরি করা।</p><p><strong>Example/Note:</strong> This covers the core concepts from the W3Schools SQL syllabus.</p>' },
    practice_query: `CREATE INDEX idx_name ON employees(name);`
  },
  {
    day: 28, title: 'Stored Procedures', level: 'advanced',
    topics: ["Stored Procedures"],
    description: 'Saving queries for reuse.',
    grammar: { title: 'Stored Procedures', content: '<p>बार बार ব্যবহারের জন্য কোড সেভ করে রাখা।</p><p><strong>Example/Note:</strong> This covers the core concepts from the W3Schools SQL syllabus.</p>' },
    practice_query: `CREATE PROCEDURE GetEmps() BEGIN SELECT * FROM employees; END;`
  },
  {
    day: 29, title: 'SQL Injection & Prepared Statements', level: 'advanced',
    topics: ["SQL Injection"],
    description: 'Security and parameters.',
    grammar: { title: 'SQL Injection & Prepared Statements', content: '<p>হ্যাকিং থেকে বাঁচতে এবং নিরাপদ কোয়েরি লিখতে Prepared Statements ব্যবহার করা।</p><p><strong>Example/Note:</strong> This covers the core concepts from the W3Schools SQL syllabus.</p>' },
    practice_query: `-- Always use prepared statements in your apps!`
  },
  {
    day: 30, title: 'SQL Hosting, Data Types, Quick Ref', level: 'advanced',
    topics: ["SQL Hosting"],
    description: 'Wrap up and reference.',
    grammar: { title: 'SQL Hosting, Data Types, Quick Ref', content: '<p>সার্ভারে হোস্টিং, ডেটা টাইপস এবং ফুল কোর্সের সামারি।</p><p><strong>Example/Note:</strong> This covers the core concepts from the W3Schools SQL syllabus.</p>' },
    practice_query: `SELECT \'Congratulations on completing 30 Days!\' AS Message;`
  }
];

const AITutor = {
  msgCount: 0,
  currentTopic: 'freemode',
  
  topics: {
    freemode: { starter: '💬 Hello! I am your SQL AI Tutor. Ask me any database questions!' },
    select: { starter: '🔍 Let us practice SELECT queries. How do you select all columns from a table?' },
    joins: { starter: '🔗 Let us talk about JOINs. What is the difference between INNER and LEFT JOIN?' },
    tables: { starter: '🛠️ Table creation! Try writing a CREATE TABLE statement.' }
  },

  init() {
    this.setupTopicBtns();
    this.setupSendBtn();
    this.addMessage('ai', this.topics.freemode.starter);
  },

  setupTopicBtns() {
    document.querySelectorAll('.topic-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.topic-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const topic = btn.dataset.topic;
        this.currentTopic = topic;
        this.currentLessonPractice = null; 
        this.addMessage('ai', this.topics[topic].starter);
      });
    });
  },

  setupSendBtn() {
    const sendBtn = document.getElementById('sendBtn');
    const chatInput = document.getElementById('chatInput');
    if (!sendBtn || !chatInput) return;
    sendBtn.addEventListener('click', () => this.handleUserInput());
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); this.handleUserInput(); }
    });
  },

  handleUserInput() {
    const input = document.getElementById('chatInput');
    const text = input.value.trim();
    if (!text) return;
    
    this.addMessage('user', text);
    input.value = '';
    
    setTimeout(() => {
      const reply = this.generateReply(text);
      this.addMessage('ai', reply);
    }, 600);
  },

  generateReply(text) {
    const lower = text.toLowerCase();
    
    if (this.currentLessonPractice) {
      const { dayNum } = this.currentLessonPractice;
      const dayData = COURSE_DAYS.find(d => d.day === dayNum);
      const kw = dayData ? dayData.title : 'SQL';
      return `Great job practicing Lesson ${dayNum} (${kw})! Keep experimenting in the Browser IDE.`;
    }

    if (lower.includes('select')) return 'SELECT extracts data. e.g. SELECT * FROM users;';
    if (lower.includes('insert')) return 'INSERT adds data. e.g. INSERT INTO users (name) VALUES ("John");';
    if (lower.includes('update')) return 'UPDATE modifies data. e.g. UPDATE users SET age=25 WHERE id=1;';
    if (lower.includes('delete')) return 'DELETE removes data. e.g. DELETE FROM users WHERE id=1;';
    if (lower.includes('join')) return 'JOIN combines rows from two or more tables based on a related column.';
    if (lower.includes('error')) return 'If you get a SQL syntax error, check your commas, quotes, and spellings carefully!';
    
    return 'Interesting question! Try testing that in the SQL IDE to see what happens.';
  },

  addMessage(sender, text) {
    const win = document.getElementById('chatWindow');
    if (!win) return;
    const div = document.createElement('div');
    div.className = `chat-msg ${sender}`;
    const avatar = sender === 'ai' ? '🤖' : '👤';
    div.innerHTML = `<div class="chat-avatar">${avatar}</div><div class="chat-bubble"><p>${text}</p></div>`;
    win.appendChild(div);
    win.scrollTop = win.scrollHeight;
  }
};

const app = {
  currentSection: 'dashboard',
  db: null,

  async init() {
    const savedSection = localStorage.getItem('mysql_last_section') || 'dashboard';
    this.setupNav();
    this.setupTheme();
    this.setupSidebarToggle();
    this.renderSidebar();
    this.updateProgress();
    this.renderLessons();
    this.goToSection(savedSection);
    AITutor.init();
    await this.initDatabase();
  },

  setupTheme() {
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;
    const isDark = localStorage.getItem('fluentpath_theme') === 'dark';
    if (isDark) document.body.classList.replace('light-mode', 'dark-mode');
    toggle.addEventListener('click', () => {
      const isDarkNow = document.body.classList.contains('dark-mode');
      document.body.classList.replace(isDarkNow ? 'dark-mode' : 'light-mode', isDarkNow ? 'light-mode' : 'dark-mode');
      localStorage.setItem('fluentpath_theme', isDarkNow ? 'light' : 'dark');
    });
  },

  setupSidebarToggle() {
    const hamburger = document.getElementById('hamburger');
    const sidebar = document.getElementById('sidebar');
    if (!hamburger || !sidebar) return;
    hamburger.addEventListener('click', () => sidebar.classList.toggle('active'));
  },

  renderSidebar() {
    const list = document.getElementById('dayList');
    if (!list) return;
    let html = '';
    const completedDays = JSON.parse(localStorage.getItem('mysql_completed_days') || '[]');
    
    COURSE_DAYS.forEach(day => {
      const isCompleted = completedDays.includes(day.day);
      html += `
        <li class="day-item" onclick="app.openLesson(${day.day})">
          <div class="day-num">${day.day}</div>
          <div class="day-title">${day.title} ${isCompleted ? '✅' : ''}</div>
        </li>
      `;
    });
    list.innerHTML = html;
  },
  
  async initDatabase() {
    try {
      const SQL = await initSqlJs({ locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}` });
      this.db = new SQL.Database();
      this.db.run(`
        CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT, age INTEGER, department TEXT);
        INSERT INTO employees VALUES (1, 'Alice Smith', 28, 'Engineering');
        INSERT INTO employees VALUES (2, 'Bob Johnson', 35, 'Marketing');
        INSERT INTO employees VALUES (3, 'Charlie Brown', 42, 'Sales');
        INSERT INTO employees VALUES (4, 'Diana Prince', 30, 'Engineering');
      `);
      console.log('SQL.js Database initialized successfully!');
    } catch (err) {
      console.error('Failed to initialize SQL.js', err);
    }
  },

  runSQL() {
    if (!this.db) {
      document.getElementById('sqlResults').innerHTML = '<span style="color:red">Database engine is still loading...</span>';
      return;
    }
    const input = document.getElementById('sqlInput').value.trim();
    const resultsDiv = document.getElementById('sqlResults');
    if (!input) return;
    
    try {
      if (!input.toLowerCase().startsWith('select')) {
        this.db.run(input);
        resultsDiv.innerHTML = '<span style="color:green">✅ Query executed successfully.</span>';
        return;
      }
      
      const res = this.db.exec(input);
      if (res.length === 0) {
        resultsDiv.innerHTML = '<em>0 rows returned.</em>';
        return;
      }
      
      const columns = res[0].columns;
      const values = res[0].values;
      
      let tableHTML = '<table style="width:100%; border-collapse:collapse; text-align:left;"><thead><tr>';
      columns.forEach(col => {
        tableHTML += `<th style="border-bottom:2px solid var(--border); padding:8px;">${col}</th>`;
      });
      tableHTML += '</tr></thead><tbody>';
      
      values.forEach(row => {
        tableHTML += '<tr>';
        row.forEach(val => {
          tableHTML += `<td style="border-bottom:1px solid var(--border); padding:8px;">${val}</td>`;
        });
        tableHTML += '</tr>';
      });
      tableHTML += '</tbody></table>';
      
      resultsDiv.innerHTML = tableHTML;
      
    } catch (err) {
      resultsDiv.innerHTML = `<span style="color:red">❌ SQL Error: ${err.message}</span>`;
    }
  },

  setupNav() {
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const section = link.dataset.section;
        if (section) this.goToSection(section);
      });
    });
  },

  goToSection(id) {
    localStorage.setItem('mysql_last_section', id);
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    
    const target = document.getElementById(id);
    if (target) target.classList.add('active');
    
    const navLink = document.querySelector(`.nav-link[data-section="${id}"]`);
    if (navLink) navLink.classList.add('active');
  },
  
  resumeJourney() {
    this.goToSection('lessons');
  },

  renderLessons() { this.openLesson(1); },
  

  openLesson(dayId) {
    this.goToSection('lessons');
    const list = document.getElementById('lessonDetail');
    if (!list) return;
    
    const day = COURSE_DAYS.find(d => d.day === dayId);
    if (!day) return;

    const completedDays = JSON.parse(localStorage.getItem('mysql_completed_days') || '[]');
    const isCompleted = completedDays.includes(dayId);

    let html = `
      <div class="lesson-day-card single-lesson-view" id="lesson-day-${day.day}" style="margin-bottom: 20px; padding: 20px; border: 1px solid var(--border); border-radius: 12px; background: var(--bg-card);">
        <div class="ld-header" style="display:flex; justify-content:space-between; align-items:center; flex-wrap: wrap; gap: 10px;">
          <h3>Day ${day.day}: ${day.title}</h3>
          <span class="badge ${day.level}" style="padding: 5px 10px; background: var(--primary); color: white; border-radius: 20px;">${day.level}</span>
        </div>
        <p style="margin-top: 10px;">${day.description}</p>
        <div style="background:var(--bg-sidebar); color:#fff; padding:15px; border-radius:8px; margin-top:15px;">
          <h4>${day.grammar.title}</h4>
          ${day.grammar.content}
          <div style="margin-top:15px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.2);">
            <strong>Practice in IDE:</strong> <code style="background: rgba(0,0,0,0.3); padding: 2px 6px; border-radius: 4px; display:inline-block; margin-top:5px; word-break: break-all;">${day.practice_query}</code>
            <button class="btn-primary" style="margin-top:15px; display:block; width: 100%;" onclick="app.practiceLesson(${day.day})">💻 Open IDE & Practice</button>
          </div>
        </div>
        
        <div id="quizContainer-${day.day}" style="margin-top: 20px; padding: 15px; background: var(--bg-hover); border-radius: 8px; border: 1px solid var(--border);">
          ${isCompleted 
            ? `<div style="color: #10b981; font-weight: bold; text-align: center;">✅ You have completed this day!</div>` 
            : `<button class="btn-primary" style="width: 100%; background: #10b981;" onclick="app.startQuiz(${day.day})">📝 Take Quiz & Complete Day</button>`
          }
        </div>
      </div>
    `;
    list.innerHTML = html;
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (window.innerWidth <= 768) {
      document.getElementById('sidebar').classList.remove('active');
    }
  },

  startQuiz(dayId) {
    const container = document.getElementById(`quizContainer-${dayId}`);
    if(!container) return;
    
    container.innerHTML = `
      <h4 style="margin-bottom: 10px;">Quick Quiz: Day ${dayId}</h4>
      <p style="margin-bottom: 15px;">To mark this day as complete, did you understand the concepts in this lesson?</p>
      <div style="display:flex; flex-direction:column; gap:10px;">
        <label><input type="radio" name="q${dayId}" value="wrong"> No, I just skipped it.</label>
        <label><input type="radio" name="q${dayId}" value="wrong"> I don't know MySQL.</label>
        <label><input type="radio" name="q${dayId}" value="correct"> Yes, I read and practiced the SQL query!</label>
      </div>
      <button class="btn-primary" style="margin-top:15px; background: #10b981;" onclick="app.checkQuiz(${dayId})">Submit Answer</button>
      <div id="quizResult-${dayId}" style="margin-top: 10px; font-weight: bold;"></div>
    `;
  },

  checkQuiz(dayId) {
    const selected = document.querySelector(`input[name="q${dayId}"]:checked`);
    const resultDiv = document.getElementById(`quizResult-${dayId}`);
    if (!selected) {
      resultDiv.style.color = "#ef4444";
      resultDiv.textContent = "Please select an answer!";
      return;
    }
    
    if (selected.value === "correct") {
      resultDiv.style.color = "#10b981";
      resultDiv.textContent = "✅ Correct! Day marked as completed.";
      
      let completed = JSON.parse(localStorage.getItem('mysql_completed_days') || '[]');
      if (!completed.includes(dayId)) {
        completed.push(dayId);
        localStorage.setItem('mysql_completed_days', JSON.stringify(completed));
        this.updateProgress();
        this.renderSidebar();
      }
      setTimeout(() => this.openLesson(dayId), 1500);
    } else {
      resultDiv.style.color = "#ef4444";
      resultDiv.textContent = "❌ Incorrect. Try again!";
    }
  },

  updateProgress() {
    const completed = JSON.parse(localStorage.getItem('mysql_completed_days') || '[]');
    const total = 30;
    const pct = Math.round((completed.length / total) * 100);
    
    const pb = document.getElementById('progressBar');
    const pt = document.getElementById('progressText');
    const sd = document.getElementById('statDays');
    const sp = document.getElementById('statProgress');
    
    if (pb) pb.style.width = pct + '%';
    if (pt) pt.textContent = `${completed.length} of ${total} days completed`;
    if (sd) sd.textContent = `${completed.length} / ${total}`;
    if (sp) sp.textContent = pct + '%';
  },

  practiceLesson(dayNum) {
    const dayData = COURSE_DAYS.find(d => d.day === dayNum);
    if (dayData) {
      document.getElementById('sqlInput').value = dayData.practice_query;
      AITutor.currentLessonPractice = { dayNum };
      
      // Optionally notify the AI tutor
      AITutor.addMessage('ai', `I see you are practicing Lesson ${dayNum}. Try running the query in the editor above!`);
    }
    this.goToSection('ide');
  }
};

window.addEventListener('DOMContentLoaded', () => {
  app.init();
  window.app = app;
});
