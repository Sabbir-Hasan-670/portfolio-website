'use strict';
/* ============================================================
   JavaScript A-Z Learning Module — Main Script
   Author: JSPath
   ============================================================ */

// ===================== CURRICULUM DATA =====================
const CURRICULUM = [
  // ===== MODULE 1: FOUNDATION =====
  {
    id: 1, module: 1, title: 'JavaScript পরিচিতি',
    level: 1, levelName: 'মৌলিক',
    content: `
<h3>🟡 JavaScript কী?</h3>
<p>JavaScript (সংক্ষেপে JS) হলো একটি হালকা, interpreted, এবং অবজেক্ট-ওরিয়েন্টেড প্রোগ্রামিং ভাষা। ১৯৯৫ সালে <strong>Brendan Eich</strong> মাত্র ১০ দিনে এটি তৈরি করেন। আজকে এটি ওয়েবের সবচেয়ে জনপ্রিয় ভাষা।</p>
<h3>কোথায় JavaScript ব্যবহার হয়?</h3>
<ul>
  <li><strong>ব্রাউজার:</strong> ওয়েবপেইজে ইন্টারেক্টিভিটি যোগ করতে (Frontend)</li>
  <li><strong>Node.js:</strong> সার্ভার-সাইড ব্যাকএন্ড ডেভেলপমেন্টে</li>
  <li><strong>মোবাইল অ্যাপ:</strong> React Native দিয়ে</li>
  <li><strong>ডেস্কটপ অ্যাপ:</strong> Electron.js দিয়ে</li>
</ul>
<h3>প্রথম JavaScript কোড</h3>
<div class="codeblock"><span class="comment">// HTML ফাইলে script ট্যাগের মধ্যে লিখুন</span>
<span class="keyword">console</span>.<span class="func">log</span>(<span class="string">"হ্যালো, বাংলাদেশ!"</span>);

<span class="comment">// অ্যালার্ট দেখান</span>
<span class="keyword">alert</span>(<span class="string">"আমার প্রথম JS প্রোগ্রাম!"</span>);

<span class="comment">// গণনা</span>
<span class="keyword">console</span>.<span class="func">log</span>(<span class="number">5</span> + <span class="number">10</span>); <span class="comment">// ফলাফল: 15</span>
<div class="output">▶ হ্যালো, বাংলাদেশ!
▶ 15</div></div>
<button class="try-btn" onclick="jsApp.tryInConsole('console.log(&quot;হ্যালো, বাংলাদেশ!&quot;);\nconsole.log(5 + 10);')">🖥️ কনসোলে চেষ্টা করুন</button>
`
  },
  {
    id: 2, module: 1, title: 'Variables: var, let, const',
    level: 1, levelName: 'মৌলিক',
    content: `
<h3>📦 Variable কী?</h3>
<p>Variable হলো ডেটা সংরক্ষণ করার একটি ধারক (container)। JavaScript-এ ৩ ধরনের variable declaration আছে।</p>
<h3>var (পুরানো পদ্ধতি)</h3>
<div class="codeblock"><span class="keyword">var</span> <span class="func">name</span> = <span class="string">"Sabbir"</span>;
<span class="keyword">var</span> <span class="func">age</span> = <span class="number">25</span>;
<span class="comment">// var ব্যবহার এখন এড়িয়ে চলা উচিত</span></div>
<h3>let (পরিবর্তনযোগ্য)</h3>
<div class="codeblock"><span class="keyword">let</span> <span class="func">score</span> = <span class="number">100</span>;
<span class="func">score</span> = <span class="number">200</span>; <span class="comment">// পরিবর্তন করা যাবে</span>
<span class="keyword">console</span>.<span class="func">log</span>(<span class="func">score</span>); <span class="comment">// 200</span>
<div class="output">▶ 200</div></div>
<h3>const (স্থায়ী/পরিবর্তনযোগ্য নয়)</h3>
<div class="codeblock"><span class="keyword">const</span> <span class="func">PI</span> = <span class="number">3.14159</span>;
<span class="comment">// PI = 3; // এটি এরর দেবে!</span>
<span class="keyword">console</span>.<span class="func">log</span>(<span class="func">PI</span>);
<div class="output">▶ 3.14159</div></div>
<h3>⚡ তুলনা সারণী</h3>
<table style="width:100%;border-collapse:collapse;font-size:0.85rem;margin-top:10px">
  <tr style="background:rgba(247,223,30,0.1)"><th style="padding:8px;border:1px solid #333;text-align:left">বৈশিষ্ট্য</th><th style="padding:8px;border:1px solid #333">var</th><th style="padding:8px;border:1px solid #333">let</th><th style="padding:8px;border:1px solid #333">const</th></tr>
  <tr><td style="padding:8px;border:1px solid #333">পুনর্নির্ধারণ</td><td style="padding:8px;border:1px solid #333;color:#2ed573">✅</td><td style="padding:8px;border:1px solid #333;color:#2ed573">✅</td><td style="padding:8px;border:1px solid #333;color:#ff4757">❌</td></tr>
  <tr><td style="padding:8px;border:1px solid #333">Block Scope</td><td style="padding:8px;border:1px solid #333;color:#ff4757">❌</td><td style="padding:8px;border:1px solid #333;color:#2ed573">✅</td><td style="padding:8px;border:1px solid #333;color:#2ed573">✅</td></tr>
  <tr><td style="padding:8px;border:1px solid #333">Hoisting</td><td style="padding:8px;border:1px solid #333;color:#2ed573">✅</td><td style="padding:8px;border:1px solid #333;color:#ff4757">❌</td><td style="padding:8px;border:1px solid #333;color:#ff4757">❌</td></tr>
</table>
<button class="try-btn" onclick="jsApp.tryInConsole('let score = 100;\nscore = 200;\nconsole.log(score);\n\nconst PI = 3.14159;\nconsole.log(PI);')">🖥️ চেষ্টা করুন</button>
`
  },
  {
    id: 3, module: 1, title: 'Data Types (ডেটা টাইপ)',
    level: 1, levelName: 'মৌলিক',
    content: `
<h3>🔤 JavaScript-এর Data Types</h3>
<p>JavaScript-এ ডেটা দুই ধরনের: <strong>Primitive</strong> ও <strong>Reference</strong>।</p>
<h3>Primitive Types</h3>
<div class="codeblock"><span class="comment">// 1. Number</span>
<span class="keyword">let</span> age = <span class="number">25</span>;
<span class="keyword">let</span> price = <span class="number">9.99</span>;

<span class="comment">// 2. String</span>
<span class="keyword">let</span> name = <span class="string">"Sabbir"</span>;
<span class="keyword">let</span> city = <span class="string">'Dhaka'</span>;

<span class="comment">// 3. Boolean</span>
<span class="keyword">let</span> isActive = <span class="keyword">true</span>;
<span class="keyword">let</span> isDeleted = <span class="keyword">false</span>;

<span class="comment">// 4. null (ইচ্ছাকৃতভাবে কিছু না)</span>
<span class="keyword">let</span> data = <span class="keyword">null</span>;

<span class="comment">// 5. undefined (মান দেওয়া হয়নি)</span>
<span class="keyword">let</span> result;
<span class="keyword">console</span>.<span class="func">log</span>(<span class="keyword">typeof</span> result); <span class="comment">// "undefined"</span>

<span class="comment">// 6. Symbol (unique identifier)</span>
<span class="keyword">const</span> sym = <span class="func">Symbol</span>(<span class="string">"id"</span>);</div>
<h3>Reference Types</h3>
<div class="codeblock"><span class="comment">// Object</span>
<span class="keyword">const</span> person = { name: <span class="string">"Sabbir"</span>, age: <span class="number">25</span> };

<span class="comment">// Array</span>
<span class="keyword">const</span> fruits = [<span class="string">"আম"</span>, <span class="string">"কলা"</span>, <span class="string">"লিচু"</span>];

<span class="comment">// typeof দিয়ে টাইপ চেক করুন</span>
<span class="keyword">console</span>.<span class="func">log</span>(<span class="keyword">typeof</span> <span class="string">"hello"</span>);  <span class="comment">// "string"</span>
<span class="keyword">console</span>.<span class="func">log</span>(<span class="keyword">typeof</span> <span class="number">42</span>);     <span class="comment">// "number"</span>
<span class="keyword">console</span>.<span class="func">log</span>(<span class="keyword">typeof</span> <span class="keyword">true</span>);   <span class="comment">// "boolean"</span>
<div class="output">▶ "string"
▶ "number"
▶ "boolean"</div></div>
<button class="try-btn" onclick="jsApp.tryInConsole('console.log(typeof 42);\nconsole.log(typeof &quot;Hello&quot;);\nconsole.log(typeof true);\nconsole.log(typeof null);\nconsole.log(typeof undefined);')">🖥️ চেষ্টা করুন</button>
`
  },
  {
    id: 4, module: 1, title: 'Operators (অপারেটর)',
    level: 1, levelName: 'মৌলিক',
    content: `
<h3>➕ Arithmetic Operators</h3>
<div class="codeblock"><span class="keyword">let</span> a = <span class="number">10</span>, b = <span class="number">3</span>;
<span class="keyword">console</span>.<span class="func">log</span>(a + b);  <span class="comment">// 13 (যোগ)</span>
<span class="keyword">console</span>.<span class="func">log</span>(a - b);  <span class="comment">// 7  (বিয়োগ)</span>
<span class="keyword">console</span>.<span class="func">log</span>(a * b);  <span class="comment">// 30 (গুণ)</span>
<span class="keyword">console</span>.<span class="func">log</span>(a / b);  <span class="comment">// 3.33 (ভাগ)</span>
<span class="keyword">console</span>.<span class="func">log</span>(a % b);  <span class="comment">// 1  (ভাগশেষ)</span>
<span class="keyword">console</span>.<span class="func">log</span>(a ** b); <span class="comment">// 1000 (ঘাত)</span></div>
<h3>🔍 Comparison Operators</h3>
<div class="codeblock"><span class="keyword">console</span>.<span class="func">log</span>(<span class="number">5</span> == <span class="string">"5"</span>);   <span class="comment">// true  (শুধু মান দেখে)</span>
<span class="keyword">console</span>.<span class="func">log</span>(<span class="number">5</span> === <span class="string">"5"</span>);  <span class="comment">// false (মান + টাইপ দেখে)</span>
<span class="keyword">console</span>.<span class="func">log</span>(<span class="number">10</span> > <span class="number">5</span>);   <span class="comment">// true</span>
<span class="keyword">console</span>.<span class="func">log</span>(<span class="number">10</span> !== <span class="number">5</span>); <span class="comment">// true</span>
<div class="output">▶ true
▶ false</div></div>
<h3>🔗 Logical Operators</h3>
<div class="codeblock"><span class="keyword">console</span>.<span class="func">log</span>(<span class="keyword">true</span> && <span class="keyword">false</span>); <span class="comment">// false (AND)</span>
<span class="keyword">console</span>.<span class="func">log</span>(<span class="keyword">true</span> || <span class="keyword">false</span>); <span class="comment">// true  (OR)</span>
<span class="keyword">console</span>.<span class="func">log</span>(!<span class="keyword">true</span>);         <span class="comment">// false (NOT)</span></div>
<h3>📝 Assignment Operators</h3>
<div class="codeblock"><span class="keyword">let</span> x = <span class="number">10</span>;
x += <span class="number">5</span>;  <span class="comment">// x = x + 5 = 15</span>
x -= <span class="number">3</span>;  <span class="comment">// x = x - 3 = 12</span>
x++;     <span class="comment">// x = x + 1 = 13</span>
x--;     <span class="comment">// x = x - 1 = 12</span>
<span class="keyword">console</span>.<span class="func">log</span>(x); <span class="comment">// 12</span></div>
<button class="try-btn" onclick="jsApp.tryInConsole('let a = 10, b = 3;\nconsole.log(a + b, a - b, a * b);\nconsole.log(a % b, a ** b);\nconsole.log(5 === &quot;5&quot;, 5 == &quot;5&quot;);')">🖥️ চেষ্টা করুন</button>
`
  },
  {
    id: 5, module: 1, title: 'Conditional Statements (শর্তমূলক)',
    level: 1, levelName: 'মৌলিক',
    content: `
<h3>🔀 if / else if / else</h3>
<div class="codeblock"><span class="keyword">let</span> marks = <span class="number">75</span>;

<span class="keyword">if</span> (marks >= <span class="number">90</span>) {
  <span class="keyword">console</span>.<span class="func">log</span>(<span class="string">"A+"</span>);
} <span class="keyword">else if</span> (marks >= <span class="number">80</span>) {
  <span class="keyword">console</span>.<span class="func">log</span>(<span class="string">"A"</span>);
} <span class="keyword">else if</span> (marks >= <span class="number">70</span>) {
  <span class="keyword">console</span>.<span class="func">log</span>(<span class="string">"B"</span>);
} <span class="keyword">else</span> {
  <span class="keyword">console</span>.<span class="func">log</span>(<span class="string">"C বা কম"</span>);
}
<div class="output">▶ B</div></div>
<h3>🔄 Switch Statement</h3>
<div class="codeblock"><span class="keyword">let</span> day = <span class="string">"শুক্রবার"</span>;
<span class="keyword">switch</span>(day) {
  <span class="keyword">case</span> <span class="string">"শুক্রবার"</span>:
    <span class="keyword">console</span>.<span class="func">log</span>(<span class="string">"সাপ্তাহিক ছুটি!"</span>);
    <span class="keyword">break</span>;
  <span class="keyword">case</span> <span class="string">"শনিবার"</span>:
    <span class="keyword">console</span>.<span class="func">log</span>(<span class="string">"হাফ ডে!"</span>);
    <span class="keyword">break</span>;
  <span class="keyword">default</span>:
    <span class="keyword">console</span>.<span class="func">log</span>(<span class="string">"কর্মদিবস"</span>);
}
<div class="output">▶ সাপ্তাহিক ছুটি!</div></div>
<h3>⚡ Ternary Operator (এক লাইনে শর্ত)</h3>
<div class="codeblock"><span class="keyword">let</span> age = <span class="number">20</span>;
<span class="keyword">let</span> status = age >= <span class="number">18</span> ? <span class="string">"প্রাপ্তবয়স্ক"</span> : <span class="string">"অপ্রাপ্তবয়স্ক"</span>;
<span class="keyword">console</span>.<span class="func">log</span>(status); <span class="comment">// প্রাপ্তবয়স্ক</span>
<div class="output">▶ প্রাপ্তবয়স্ক</div></div>
<button class="try-btn" onclick="jsApp.tryInConsole('let marks = 85;\nif (marks >= 90) {\n  console.log(\"A+\");\n} else if (marks >= 80) {\n  console.log(\"A\");\n} else {\n  console.log(\"B\");\n}')">🖥️ চেষ্টা করুন</button>
`
  },
  {
    id: 6, module: 1, title: 'Loops (লুপ)',
    level: 1, levelName: 'মৌলিক',
    content: `
<h3>🔄 for Loop</h3>
<div class="codeblock"><span class="keyword">for</span> (<span class="keyword">let</span> i = <span class="number">1</span>; i <= <span class="number">5</span>; i++) {
  <span class="keyword">console</span>.<span class="func">log</span>(<span class="string">"সংখ্যা:"</span>, i);
}
<div class="output">▶ সংখ্যা: 1
▶ সংখ্যা: 2
▶ সংখ্যা: 3
▶ সংখ্যা: 4
▶ সংখ্যা: 5</div></div>
<h3>🔁 while Loop</h3>
<div class="codeblock"><span class="keyword">let</span> count = <span class="number">1</span>;
<span class="keyword">while</span> (count <= <span class="number">3</span>) {
  <span class="keyword">console</span>.<span class="func">log</span>(<span class="string">"count:"</span>, count);
  count++;
}
<div class="output">▶ count: 1
▶ count: 2
▶ count: 3</div></div>
<h3>🔃 for...of (Array-এর জন্য)</h3>
<div class="codeblock"><span class="keyword">const</span> fruits = [<span class="string">"আম"</span>, <span class="string">"কলা"</span>, <span class="string">"লিচু"</span>];
<span class="keyword">for</span> (<span class="keyword">const</span> fruit <span class="keyword">of</span> fruits) {
  <span class="keyword">console</span>.<span class="func">log</span>(fruit);
}
<div class="output">▶ আম
▶ কলা
▶ লিচু</div></div>
<h3>🔑 for...in (Object-এর জন্য)</h3>
<div class="codeblock"><span class="keyword">const</span> person = { name: <span class="string">"Sabbir"</span>, age: <span class="number">25</span>, city: <span class="string">"Dhaka"</span> };
<span class="keyword">for</span> (<span class="keyword">const</span> key <span class="keyword">in</span> person) {
  <span class="keyword">console</span>.<span class="func">log</span>(key + <span class="string">": "</span> + person[key]);
}
<div class="output">▶ name: Sabbir
▶ age: 25
▶ city: Dhaka</div></div>
<button class="try-btn" onclick="jsApp.tryInConsole('const fruits = [\"আম\", \"কলা\", \"লিচু\"];\nfor (const fruit of fruits) {\n  console.log(fruit);\n}')">🖥️ চেষ্টা করুন</button>
`
  },

  // ===== MODULE 2: CORE JS =====
  {
    id: 7, module: 2, title: 'Functions (ফাংশন)',
    level: 2, levelName: 'মধ্যবর্তী',
    content: `
<h3>🔧 Function Declaration</h3>
<div class="codeblock"><span class="comment">// সাধারণ ফাংশন</span>
<span class="keyword">function</span> <span class="func">greet</span>(name) {
  <span class="keyword">return</span> <span class="string">"হ্যালো, "</span> + name + <span class="string">"!"</span>;
}
<span class="keyword">console</span>.<span class="func">log</span>(<span class="func">greet</span>(<span class="string">"Sabbir"</span>)); <span class="comment">// হ্যালো, Sabbir!</span>
<div class="output">▶ হ্যালো, Sabbir!</div></div>
<h3>🎯 Arrow Function (ES6)</h3>
<div class="codeblock"><span class="comment">// এক লাইনে</span>
<span class="keyword">const</span> add = (a, b) => a + b;
<span class="keyword">console</span>.<span class="func">log</span>(<span class="func">add</span>(<span class="number">5</span>, <span class="number">3</span>)); <span class="comment">// 8</span>

<span class="comment">// একাধিক লাইনে</span>
<span class="keyword">const</span> multiply = (a, b) => {
  <span class="keyword">let</span> result = a * b;
  <span class="keyword">return</span> result;
};
<span class="keyword">console</span>.<span class="func">log</span>(<span class="func">multiply</span>(<span class="number">4</span>, <span class="number">5</span>)); <span class="comment">// 20</span>
<div class="output">▶ 8
▶ 20</div></div>
<h3>📦 Default Parameters</h3>
<div class="codeblock"><span class="keyword">function</span> <span class="func">welcome</span>(name = <span class="string">"বন্ধু"</span>) {
  <span class="keyword">return</span> <span class="string">"স্বাগতম, "</span> + name;
}
<span class="keyword">console</span>.<span class="func">log</span>(<span class="func">welcome</span>());           <span class="comment">// স্বাগতম, বন্ধু</span>
<span class="keyword">console</span>.<span class="func">log</span>(<span class="func">welcome</span>(<span class="string">"Sabbir"</span>));   <span class="comment">// স্বাগতম, Sabbir</span>
<div class="output">▶ স্বাগতম, বন্ধু
▶ স্বাগতম, Sabbir</div></div>
<button class="try-btn" onclick="jsApp.tryInConsole('const add = (a, b) => a + b;\nconsole.log(add(10, 5));\n\nfunction welcome(name = &quot;বন্ধু&quot;) {\n  return &quot;স্বাগতম, &quot; + name;\n}\nconsole.log(welcome());\nconsole.log(welcome(&quot;Sabbir&quot;));')">🖥️ চেষ্টা করুন</button>
`
  },
  {
    id: 8, module: 2, title: 'Arrays ও Array Methods',
    level: 2, levelName: 'মধ্যবর্তী',
    content: `
<h3>📋 Array তৈরি করা</h3>
<div class="codeblock"><span class="keyword">const</span> fruits = [<span class="string">"আম"</span>, <span class="string">"কলা"</span>, <span class="string">"লিচু"</span>];
<span class="keyword">console</span>.<span class="func">log</span>(fruits[<span class="number">0</span>]);     <span class="comment">// আম</span>
<span class="keyword">console</span>.<span class="func">log</span>(fruits.length); <span class="comment">// 3</span></div>
<h3>🔥 সবচেয়ে গুরুত্বপূর্ণ Array Methods</h3>
<div class="codeblock"><span class="keyword">const</span> nums = [<span class="number">1</span>, <span class="number">2</span>, <span class="number">3</span>, <span class="number">4</span>, <span class="number">5</span>];

<span class="comment">// map: প্রতিটি element-এ অপারেশন চালায়</span>
<span class="keyword">const</span> doubled = nums.<span class="func">map</span>(n => n * <span class="number">2</span>);
<span class="keyword">console</span>.<span class="func">log</span>(doubled); <span class="comment">// [2, 4, 6, 8, 10]</span>

<span class="comment">// filter: শর্ত মানলে রাখে</span>
<span class="keyword">const</span> evens = nums.<span class="func">filter</span>(n => n % <span class="number">2</span> === <span class="number">0</span>);
<span class="keyword">console</span>.<span class="func">log</span>(evens); <span class="comment">// [2, 4]</span>

<span class="comment">// reduce: সব element মিলিয়ে একটি মান</span>
<span class="keyword">const</span> sum = nums.<span class="func">reduce</span>((acc, n) => acc + n, <span class="number">0</span>);
<span class="keyword">console</span>.<span class="func">log</span>(sum); <span class="comment">// 15</span>

<span class="comment">// find: প্রথম ম্যাচিং element</span>
<span class="keyword">const</span> found = nums.<span class="func">find</span>(n => n > <span class="number">3</span>);
<span class="keyword">console</span>.<span class="func">log</span>(found); <span class="comment">// 4</span>

<span class="comment">// includes: আছে কি না</span>
<span class="keyword">console</span>.<span class="func">log</span>(nums.<span class="func">includes</span>(<span class="number">3</span>)); <span class="comment">// true</span>
<div class="output">▶ [2, 4, 6, 8, 10]
▶ [2, 4]
▶ 15</div></div>
<button class="try-btn" onclick="jsApp.tryInConsole('const nums = [1, 2, 3, 4, 5];\nconsole.log(nums.map(n => n * 2));\nconsole.log(nums.filter(n => n % 2 === 0));\nconsole.log(nums.reduce((acc, n) => acc + n, 0));')">🖥️ চেষ্টা করুন</button>
`
  },
  {
    id: 9, module: 2, title: 'Objects ও Destructuring',
    level: 2, levelName: 'মধ্যবর্তী',
    content: `
<h3>🏗️ Object তৈরি করা</h3>
<div class="codeblock"><span class="keyword">const</span> person = {
  name: <span class="string">"Sabbir"</span>,
  age: <span class="number">25</span>,
  city: <span class="string">"Dhaka"</span>,
  greet: <span class="keyword">function</span>() {
    <span class="keyword">return</span> <span class="string">"হ্যালো, আমি "</span> + <span class="keyword">this</span>.name;
  }
};
<span class="keyword">console</span>.<span class="func">log</span>(person.name);      <span class="comment">// Sabbir</span>
<span class="keyword">console</span>.<span class="func">log</span>(person[<span class="string">"age"</span>]);   <span class="comment">// 25</span>
<span class="keyword">console</span>.<span class="func">log</span>(person.<span class="func">greet</span>()); <span class="comment">// হ্যালো, আমি Sabbir</span></div>
<h3>💥 Object Destructuring</h3>
<div class="codeblock"><span class="keyword">const</span> { name, age, city } = person;
<span class="keyword">console</span>.<span class="func">log</span>(name, age, city); <span class="comment">// Sabbir 25 Dhaka</span>

<span class="comment">// নতুন নামে</span>
<span class="keyword">const</span> { name: fullName } = person;
<span class="keyword">console</span>.<span class="func">log</span>(fullName); <span class="comment">// Sabbir</span>
<div class="output">▶ Sabbir 25 Dhaka</div></div>
<h3>🔀 Spread Operator (...)</h3>
<div class="codeblock"><span class="keyword">const</span> obj1 = { a: <span class="number">1</span>, b: <span class="number">2</span> };
<span class="keyword">const</span> obj2 = { ...obj1, c: <span class="number">3</span> };
<span class="keyword">console</span>.<span class="func">log</span>(obj2); <span class="comment">// {a: 1, b: 2, c: 3}</span>

<span class="comment">// Array-এও কাজ করে</span>
<span class="keyword">const</span> arr1 = [<span class="number">1</span>, <span class="number">2</span>];
<span class="keyword">const</span> arr2 = [...arr1, <span class="number">3</span>, <span class="number">4</span>];
<span class="keyword">console</span>.<span class="func">log</span>(arr2); <span class="comment">// [1, 2, 3, 4]</span>
<div class="output">▶ {a: 1, b: 2, c: 3}
▶ [1, 2, 3, 4]</div></div>
<button class="try-btn" onclick="jsApp.tryInConsole('const person = { name: &quot;Sabbir&quot;, age: 25, city: &quot;Dhaka&quot; };\nconst { name, age } = person;\nconsole.log(name, age);\n\nconst obj1 = { a: 1, b: 2 };\nconst obj2 = { ...obj1, c: 3 };\nconsole.log(obj2);')">🖥️ চেষ্টা করুন</button>
`
  },
  {
    id: 10, module: 2, title: 'DOM Manipulation',
    level: 2, levelName: 'মধ্যবর্তী',
    content: `
<h3>🌐 DOM কী?</h3>
<p>DOM (Document Object Model) হলো HTML পেইজের একটি JavaScript উপস্থাপনা। এর মাধ্যমে আমরা HTML element যোগ, পরিবর্তন ও মুছে ফেলতে পারি।</p>
<h3>📍 Element সিলেক্ট করা</h3>
<div class="codeblock"><span class="comment">// ID দিয়ে</span>
<span class="keyword">const</span> btn = document.<span class="func">getElementById</span>(<span class="string">"myBtn"</span>);

<span class="comment">// CSS Selector দিয়ে</span>
<span class="keyword">const</span> title = document.<span class="func">querySelector</span>(<span class="string">"h1"</span>);
<span class="keyword">const</span> allBtns = document.<span class="func">querySelectorAll</span>(<span class="string">".btn"</span>);</div>
<h3>✏️ কনটেন্ট পরিবর্তন</h3>
<div class="codeblock"><span class="comment">// টেক্সট পরিবর্তন</span>
title.textContent = <span class="string">"নতুন শিরোনাম"</span>;

<span class="comment">// HTML পরিবর্তন</span>
title.innerHTML = <span class="string">"&lt;strong&gt;Bold শিরোনাম&lt;/strong&gt;"</span>;

<span class="comment">// Style পরিবর্তন</span>
title.style.color = <span class="string">"red"</span>;
title.style.fontSize = <span class="string">"2rem"</span>;

<span class="comment">// Class যোগ/বাদ দেওয়া</span>
title.<span class="func">classList</span>.<span class="func">add</span>(<span class="string">"active"</span>);
title.<span class="func">classList</span>.<span class="func">remove</span>(<span class="string">"hidden"</span>);
title.<span class="func">classList</span>.<span class="func">toggle</span>(<span class="string">"dark"</span>);</div>
<h3>🆕 Element তৈরি করা</h3>
<div class="codeblock"><span class="keyword">const</span> newDiv = document.<span class="func">createElement</span>(<span class="string">"div"</span>);
newDiv.textContent = <span class="string">"আমি নতুন!"</span>;
newDiv.classList.<span class="func">add</span>(<span class="string">"card"</span>);
document.body.<span class="func">appendChild</span>(newDiv);</div>
<p style="color:#ffa502;margin-top:10px;">⚠️ DOM manipulation ব্রাউজারে চলে। কনসোলে শুধু document.title পরীক্ষা করা যাবে।</p>
`
  },
  {
    id: 11, module: 2, title: 'Events ও Event Listeners',
    level: 2, levelName: 'মধ্যবর্তী',
    content: `
<h3>🖱️ Event কী?</h3>
<p>Event হলো ব্রাউজারে ঘটে যাওয়া কোনো ঘটনা — যেমন বাটন ক্লিক, কী-প্রেস, মাউস মুভ, ফর্ম সাবমিট।</p>
<h3>📌 addEventListener</h3>
<div class="codeblock"><span class="keyword">const</span> btn = document.<span class="func">getElementById</span>(<span class="string">"myBtn"</span>);

btn.<span class="func">addEventListener</span>(<span class="string">"click"</span>, <span class="keyword">function</span>(event) {
  <span class="keyword">console</span>.<span class="func">log</span>(<span class="string">"বাটনে ক্লিক হয়েছে!"</span>);
  <span class="keyword">console</span>.<span class="func">log</span>(event.target); <span class="comment">// যে element-এ ক্লিক হলো</span>
});</div>
<h3>⌨️ সাধারণ Event-গুলো</h3>
<div class="codeblock"><span class="comment">// click, dblclick, mouseover, mouseout</span>
btn.<span class="func">addEventListener</span>(<span class="string">"mouseover"</span>, () => {
  btn.style.background = <span class="string">"yellow"</span>;
});

<span class="comment">// keydown, keyup, input</span>
<span class="keyword">const</span> input = document.<span class="func">querySelector</span>(<span class="string">"input"</span>);
input.<span class="func">addEventListener</span>(<span class="string">"input"</span>, (e) => {
  <span class="keyword">console</span>.<span class="func">log</span>(<span class="string">"টাইপ করলেন:"</span>, e.target.value);
});

<span class="comment">// submit</span>
form.<span class="func">addEventListener</span>(<span class="string">"submit"</span>, (e) => {
  e.<span class="func">preventDefault</span>(); <span class="comment">// রিলোড বন্ধ</span>
  <span class="keyword">console</span>.<span class="func">log</span>(<span class="string">"ফর্ম জমা হলো!"</span>);
});</div>
`
  },
  {
    id: 12, module: 2, title: 'Error Handling (try/catch)',
    level: 2, levelName: 'মধ্যবর্তী',
    content: `
<h3>🛡️ Error কেন হয়?</h3>
<p>প্রোগ্রামে error হতে পারে অনেক কারণে — ভুল ইনপুট, নেটওয়ার্ক সমস্যা, অপরিচিত variable ইত্যাদি। try/catch দিয়ে আমরা error ধরে সুন্দরভাবে handle করতে পারি।</p>
<h3>🔧 try / catch / finally</h3>
<div class="codeblock"><span class="keyword">try</span> {
  <span class="keyword">let</span> result = <span class="func">JSON</span>.<span class="func">parse</span>(<span class="string">"এটা JSON না"</span>);
} <span class="keyword">catch</span> (error) {
  <span class="keyword">console</span>.<span class="func">log</span>(<span class="string">"Error:"</span>, error.message);
} <span class="keyword">finally</span> {
  <span class="keyword">console</span>.<span class="func">log</span>(<span class="string">"এটি সবসময় চলবে"</span>);
}
<div class="output">▶ Error: Unexpected token এ
▶ এটি সবসময় চলবে</div></div>
<h3>🚀 Custom Error Throw করা</h3>
<div class="codeblock"><span class="keyword">function</span> <span class="func">divide</span>(a, b) {
  <span class="keyword">if</span> (b === <span class="number">0</span>) {
    <span class="keyword">throw new</span> <span class="func">Error</span>(<span class="string">"শূন্য দিয়ে ভাগ করা যাবে না!"</span>);
  }
  <span class="keyword">return</span> a / b;
}
<span class="keyword">try</span> {
  <span class="keyword">console</span>.<span class="func">log</span>(<span class="func">divide</span>(<span class="number">10</span>, <span class="number">0</span>));
} <span class="keyword">catch</span> (e) {
  <span class="keyword">console</span>.<span class="func">log</span>(e.message);
}
<div class="output">▶ শূন্য দিয়ে ভাগ করা যাবে না!</div></div>
<button class="try-btn" onclick="jsApp.tryInConsole('try {\n  let x = JSON.parse(&quot;not json&quot;);\n} catch (e) {\n  console.log(&quot;Error:&quot;, e.message);\n} finally {\n  console.log(&quot;finally block ran&quot;);\n}')">🖥️ চেষ্টা করুন</button>
`
  },

  // ===== MODULE 3: ADVANCED =====
  {
    id: 13, module: 3, title: 'ES6+ Features',
    level: 3, levelName: 'উন্নত',
    content: `
<h3>🚀 Template Literals</h3>
<div class="codeblock"><span class="keyword">const</span> name = <span class="string">"Sabbir"</span>;
<span class="keyword">const</span> age = <span class="number">25</span>;
<span class="comment">// পুরানো পদ্ধতি:</span>
<span class="keyword">console</span>.<span class="func">log</span>(<span class="string">"নাম: "</span> + name + <span class="string">", বয়স: "</span> + age);
<span class="comment">// নতুন পদ্ধতি (Template Literal):</span>
<span class="keyword">console</span>.<span class="func">log</span>(<span class="string">\`নাম: \${name}, বয়স: \${age}\`</span>);
<div class="output">▶ নাম: Sabbir, বয়স: 25</div></div>
<h3>📦 Destructuring</h3>
<div class="codeblock"><span class="comment">// Array Destructuring</span>
<span class="keyword">const</span> [first, second, ...rest] = [<span class="number">1</span>, <span class="number">2</span>, <span class="number">3</span>, <span class="number">4</span>, <span class="number">5</span>];
<span class="keyword">console</span>.<span class="func">log</span>(first, second, rest); <span class="comment">// 1 2 [3, 4, 5]</span></div>
<h3>🔁 Spread & Rest</h3>
<div class="codeblock"><span class="comment">// Spread</span>
<span class="keyword">const</span> arr = [<span class="number">1</span>, <span class="number">2</span>, <span class="number">3</span>];
<span class="keyword">console</span>.<span class="func">log</span>(<span class="func">Math</span>.<span class="func">max</span>(...arr)); <span class="comment">// 3</span>

<span class="comment">// Rest Parameters</span>
<span class="keyword">function</span> <span class="func">sum</span>(...nums) {
  <span class="keyword">return</span> nums.<span class="func">reduce</span>((a, b) => a + b, <span class="number">0</span>);
}
<span class="keyword">console</span>.<span class="func">log</span>(<span class="func">sum</span>(<span class="number">1</span>, <span class="number">2</span>, <span class="number">3</span>, <span class="number">4</span>)); <span class="comment">// 10</span>
<div class="output">▶ 3
▶ 10</div></div>
<h3>🗺️ Map ও Set</h3>
<div class="codeblock"><span class="comment">// Set (unique values)</span>
<span class="keyword">const</span> mySet = <span class="keyword">new</span> <span class="func">Set</span>([<span class="number">1</span>, <span class="number">2</span>, <span class="number">2</span>, <span class="number">3</span>, <span class="number">3</span>]);
<span class="keyword">console</span>.<span class="func">log</span>([...mySet]); <span class="comment">// [1, 2, 3]</span>

<span class="comment">// Map (key-value pairs)</span>
<span class="keyword">const</span> myMap = <span class="keyword">new</span> <span class="func">Map</span>();
myMap.<span class="func">set</span>(<span class="string">"name"</span>, <span class="string">"Sabbir"</span>);
<span class="keyword">console</span>.<span class="func">log</span>(myMap.<span class="func">get</span>(<span class="string">"name"</span>)); <span class="comment">// Sabbir</span>
<div class="output">▶ [1, 2, 3]
▶ Sabbir</div></div>
<button class="try-btn" onclick="jsApp.tryInConsole('const name = &quot;Sabbir&quot;, age = 25;\nconsole.log(\`নাম: \${name}, বয়স: \${age}\`);\n\nconst mySet = new Set([1, 2, 2, 3, 3]);\nconsole.log([...mySet]);')">🖥️ চেষ্টা করুন</button>
`
  },
  {
    id: 14, module: 3, title: 'Promises ও Async/Await',
    level: 3, levelName: 'উন্নত',
    content: `
<h3>⏳ Asynchronous JS কেন?</h3>
<p>JavaScript single-threaded। অনেক কাজ (API call, timer) সময় নেয়। সেই সময় পেইজ থামিয়ে না রেখে অন্য কাজ চালিয়ে যেতে হয় — এটাই Asynchronous প্রোগ্রামিং।</p>
<h3>🤝 Promise</h3>
<div class="codeblock"><span class="keyword">const</span> myPromise = <span class="keyword">new</span> <span class="func">Promise</span>((resolve, reject) => {
  <span class="keyword">const</span> success = <span class="keyword">true</span>;
  <span class="keyword">if</span> (success) {
    <span class="func">resolve</span>(<span class="string">"ডেটা পেয়ে গেছি! ✅"</span>);
  } <span class="keyword">else</span> {
    <span class="func">reject</span>(<span class="string">"কিছু একটা ভুল হয়েছে! ❌"</span>);
  }
});

myPromise
  .<span class="func">then</span>(result => <span class="keyword">console</span>.<span class="func">log</span>(result))
  .<span class="func">catch</span>(err => <span class="keyword">console</span>.<span class="func">log</span>(err));
<div class="output">▶ ডেটা পেয়ে গেছি! ✅</div></div>
<h3>🎯 async / await (সহজ পদ্ধতি)</h3>
<div class="codeblock"><span class="keyword">async function</span> <span class="func">fetchUser</span>() {
  <span class="keyword">try</span> {
    <span class="keyword">const</span> response = <span class="keyword">await</span> <span class="func">fetch</span>(<span class="string">"https://api.github.com/users/github"</span>);
    <span class="keyword">const</span> data = <span class="keyword">await</span> response.<span class="func">json</span>();
    <span class="keyword">console</span>.<span class="func">log</span>(data.name);
  } <span class="keyword">catch</span> (error) {
    <span class="keyword">console</span>.<span class="func">log</span>(<span class="string">"Error:"</span>, error);
  }
}
<span class="func">fetchUser</span>();</div>
<button class="try-btn" onclick="jsApp.tryInConsole('const p = new Promise((resolve, reject) => {\n  resolve(\"Promise resolved! ✅\");\n});\np.then(r => console.log(r));')">🖥️ চেষ্টা করুন</button>
`
  },
  {
    id: 15, module: 3, title: 'Closures ও Scope',
    level: 3, levelName: 'উন্নত',
    content: `
<h3>🔒 Scope কী?</h3>
<p>Scope মানে কোন variable কোন জায়গায় accessible সেটা নির্ধারণ করে।</p>
<div class="codeblock"><span class="comment">// Global Scope</span>
<span class="keyword">let</span> globalVar = <span class="string">"আমি সবার"</span>;

<span class="keyword">function</span> <span class="func">myFunc</span>() {
  <span class="comment">// Local Scope</span>
  <span class="keyword">let</span> localVar = <span class="string">"শুধু এখানে"</span>;
  <span class="keyword">console</span>.<span class="func">log</span>(globalVar); <span class="comment">// ✅ কাজ করবে</span>
  <span class="keyword">console</span>.<span class="func">log</span>(localVar);  <span class="comment">// ✅ কাজ করবে</span>
}
<span class="comment">// console.log(localVar); ❌ এরর হবে</span></div>
<h3>🎭 Closure</h3>
<p>Closure হলো এমন একটি ফাংশন যে তার বাইরের ফাংশনের variable মনে রাখে।</p>
<div class="codeblock"><span class="keyword">function</span> <span class="func">makeCounter</span>() {
  <span class="keyword">let</span> count = <span class="number">0</span>; <span class="comment">// এই variable মনে থাকবে</span>
  <span class="keyword">return</span> <span class="keyword">function</span>() {
    count++;
    <span class="keyword">return</span> count;
  };
}
<span class="keyword">const</span> counter = <span class="func">makeCounter</span>();
<span class="keyword">console</span>.<span class="func">log</span>(<span class="func">counter</span>()); <span class="comment">// 1</span>
<span class="keyword">console</span>.<span class="func">log</span>(<span class="func">counter</span>()); <span class="comment">// 2</span>
<span class="keyword">console</span>.<span class="func">log</span>(<span class="func">counter</span>()); <span class="comment">// 3</span>
<div class="output">▶ 1
▶ 2
▶ 3</div></div>
<button class="try-btn" onclick="jsApp.tryInConsole('function makeCounter() {\n  let count = 0;\n  return function() {\n    count++;\n    return count;\n  };\n}\nconst counter = makeCounter();\nconsole.log(counter());\nconsole.log(counter());\nconsole.log(counter());')">🖥️ চেষ্টা করুন</button>
`
  },
  {
    id: 16, module: 3, title: 'OOP — Class ও Prototype',
    level: 3, levelName: 'উন্নত',
    content: `
<h3>🏛️ Class (ES6)</h3>
<div class="codeblock"><span class="keyword">class</span> <span class="func">Animal</span> {
  <span class="func">constructor</span>(name, sound) {
    <span class="keyword">this</span>.name = name;
    <span class="keyword">this</span>.sound = sound;
  }

  <span class="func">speak</span>() {
    <span class="keyword">return</span> <span class="string">\`\${this.name} বলে: \${this.sound}\`</span>;
  }
}

<span class="keyword">const</span> dog = <span class="keyword">new</span> <span class="func">Animal</span>(<span class="string">"কুকুর"</span>, <span class="string">"ঘেউ ঘেউ"</span>);
<span class="keyword">console</span>.<span class="func">log</span>(dog.<span class="func">speak</span>()); <span class="comment">// কুকুর বলে: ঘেউ ঘেউ</span>
<div class="output">▶ কুকুর বলে: ঘেউ ঘেউ</div></div>
<h3>🧬 Inheritance (উত্তরাধিকার)</h3>
<div class="codeblock"><span class="keyword">class</span> <span class="func">Dog</span> <span class="keyword">extends</span> <span class="func">Animal</span> {
  <span class="func">constructor</span>(name) {
    <span class="keyword">super</span>(name, <span class="string">"ঘেউ ঘেউ"</span>);
    <span class="keyword">this</span>.type = <span class="string">"গৃহপালিত"</span>;
  }

  <span class="func">fetch</span>() {
    <span class="keyword">return</span> <span class="string">\`\${this.name} বল নিয়ে এলো!\`</span>;
  }
}

<span class="keyword">const</span> rex = <span class="keyword">new</span> <span class="func">Dog</span>(<span class="string">"Rex"</span>);
<span class="keyword">console</span>.<span class="func">log</span>(rex.<span class="func">speak</span>());  <span class="comment">// Rex বলে: ঘেউ ঘেউ</span>
<span class="keyword">console</span>.<span class="func">log</span>(rex.<span class="func">fetch</span>());  <span class="comment">// Rex বল নিয়ে এলো!</span>
<div class="output">▶ Rex বলে: ঘেউ ঘেউ
▶ Rex বল নিয়ে এলো!</div></div>
<button class="try-btn" onclick="jsApp.tryInConsole('class Animal {\n  constructor(name, sound) {\n    this.name = name;\n    this.sound = sound;\n  }\n  speak() {\n    return \`\${this.name} বলে: \${this.sound}\`;\n  }\n}\nconst dog = new Animal(\"কুকুর\", \"ঘেউ ঘেউ\");\nconsole.log(dog.speak());')">🖥️ চেষ্টা করুন</button>
`
  },
  {
    id: 17, module: 3, title: 'Fetch API ও HTTP Requests',
    level: 3, levelName: 'উন্নত',
    content: `
<h3>🌐 Fetch API কী?</h3>
<p>Fetch API দিয়ে আমরা external server থেকে ডেটা আনতে বা পাঠাতে পারি (AJAX)।</p>
<h3>📥 GET Request (ডেটা আনা)</h3>
<div class="codeblock"><span class="keyword">async function</span> <span class="func">getPost</span>() {
  <span class="keyword">const</span> response = <span class="keyword">await</span> <span class="func">fetch</span>(
    <span class="string">"https://jsonplaceholder.typicode.com/posts/1"</span>
  );
  <span class="keyword">const</span> data = <span class="keyword">await</span> response.<span class="func">json</span>();
  <span class="keyword">console</span>.<span class="func">log</span>(data.title);
}
<span class="func">getPost</span>();</div>
<h3>📤 POST Request (ডেটা পাঠানো)</h3>
<div class="codeblock"><span class="keyword">async function</span> <span class="func">createPost</span>() {
  <span class="keyword">const</span> response = <span class="keyword">await</span> <span class="func">fetch</span>(<span class="string">"https://api.example.com/posts"</span>, {
    method: <span class="string">"POST"</span>,
    headers: { <span class="string">"Content-Type"</span>: <span class="string">"application/json"</span> },
    body: <span class="func">JSON</span>.<span class="func">stringify</span>({
      title: <span class="string">"আমার পোস্ট"</span>,
      body: <span class="string">"কনটেন্ট..."</span>
    })
  });
  <span class="keyword">const</span> data = <span class="keyword">await</span> response.<span class="func">json</span>();
  <span class="keyword">console</span>.<span class="func">log</span>(data);
}</div>
<button class="try-btn" onclick="jsApp.tryInConsole('async function getPost() {\n  const r = await fetch(\"https://jsonplaceholder.typicode.com/posts/1\");\n  const d = await r.json();\n  console.log(d.title);\n  console.log(d.body);\n}\ngetPost();')">🖥️ চেষ্টা করুন (Live API)</button>
`
  },

  // ===== MODULE 4: PROFESSIONAL =====
  {
    id: 18, module: 4, title: 'localStorage ও sessionStorage',
    level: 4, levelName: 'প্রফেশনাল',
    content: `
<h3>💾 Browser Storage কী?</h3>
<p>ব্রাউজারে ডেটা সংরক্ষণ করার দুটি উপায়: localStorage (স্থায়ী) ও sessionStorage (সেশন পর্যন্ত)।</p>
<div class="codeblock"><span class="comment">// localStorage-এ সংরক্ষণ</span>
localStorage.<span class="func">setItem</span>(<span class="string">"username"</span>, <span class="string">"Sabbir"</span>);
localStorage.<span class="func">setItem</span>(<span class="string">"theme"</span>, <span class="string">"dark"</span>);

<span class="comment">// পড়া</span>
<span class="keyword">const</span> user = localStorage.<span class="func">getItem</span>(<span class="string">"username"</span>);
<span class="keyword">console</span>.<span class="func">log</span>(user); <span class="comment">// Sabbir</span>

<span class="comment">// মুছে দেওয়া</span>
localStorage.<span class="func">removeItem</span>(<span class="string">"theme"</span>);

<span class="comment">// Object সংরক্ষণ (JSON করতে হবে)</span>
<span class="keyword">const</span> user2 = { name: <span class="string">"Sabbir"</span>, age: <span class="number">25</span> };
localStorage.<span class="func">setItem</span>(<span class="string">"user"</span>, <span class="func">JSON</span>.<span class="func">stringify</span>(user2));

<span class="keyword">const</span> retrieved = <span class="func">JSON</span>.<span class="func">parse</span>(localStorage.<span class="func">getItem</span>(<span class="string">"user"</span>));
<span class="keyword">console</span>.<span class="func">log</span>(retrieved.name); <span class="comment">// Sabbir</span>
<div class="output">▶ Sabbir
▶ Sabbir</div></div>
<button class="try-btn" onclick="jsApp.tryInConsole('localStorage.setItem(\"test\", \"Hello JS!\");\nconst val = localStorage.getItem(\"test\");\nconsole.log(val);\nlocalStorage.removeItem(\"test\");')">🖥️ চেষ্টা করুন</button>
`
  },
  {
    id: 19, module: 4, title: 'JSON Handling',
    level: 4, levelName: 'প্রফেশনাল',
    content: `
<h3>📋 JSON কী?</h3>
<p>JSON (JavaScript Object Notation) হলো ডেটা আদান-প্রদানের সবচেয়ে জনপ্রিয় ফরম্যাট।</p>
<div class="codeblock"><span class="comment">// JSON String → JavaScript Object</span>
<span class="keyword">const</span> jsonStr = <span class="string">'{"name":"Sabbir","age":25,"active":true}'</span>;
<span class="keyword">const</span> obj = <span class="func">JSON</span>.<span class="func">parse</span>(jsonStr);
<span class="keyword">console</span>.<span class="func">log</span>(obj.name); <span class="comment">// Sabbir</span>
<span class="keyword">console</span>.<span class="func">log</span>(obj.age);  <span class="comment">// 25</span>

<span class="comment">// JavaScript Object → JSON String</span>
<span class="keyword">const</span> data = { city: <span class="string">"Dhaka"</span>, country: <span class="string">"Bangladesh"</span> };
<span class="keyword">const</span> json = <span class="func">JSON</span>.<span class="func">stringify</span>(data);
<span class="keyword">console</span>.<span class="func">log</span>(json);
<span class="comment">// '{"city":"Dhaka","country":"Bangladesh"}'</span>

<span class="comment">// Pretty Print (সুন্দর ফরম্যাটে)</span>
<span class="keyword">console</span>.<span class="func">log</span>(<span class="func">JSON</span>.<span class="func">stringify</span>(data, <span class="keyword">null</span>, <span class="number">2</span>));
<div class="output">▶ Sabbir
▶ {"city":"Dhaka","country":"Bangladesh"}</div></div>
<button class="try-btn" onclick="jsApp.tryInConsole('const jsonStr = \'{\"name\":\"Sabbir\",\"age\":25}\';\nconst obj = JSON.parse(jsonStr);\nconsole.log(obj.name, obj.age);\n\nconst data = { city: \"Dhaka\" };\nconsole.log(JSON.stringify(data, null, 2));')">🖥️ চেষ্টা করুন</button>
`
  },
  {
    id: 20, module: 4, title: 'Regular Expressions (RegEx)',
    level: 4, levelName: 'প্রফেশনাল',
    content: `
<h3>🔍 RegEx কী?</h3>
<p>Regular Expression হলো text pattern matching-এর শক্তিশালী হাতিয়ার। Email validation, phone number চেক, text search ইত্যাদিতে ব্যবহার হয়।</p>
<div class="codeblock"><span class="comment">// Email Validation</span>
<span class="keyword">const</span> emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
<span class="keyword">console</span>.<span class="func">log</span>(emailRegex.<span class="func">test</span>(<span class="string">"test@gmail.com"</span>));  <span class="comment">// true</span>
<span class="keyword">console</span>.<span class="func">log</span>(emailRegex.<span class="func">test</span>(<span class="string">"not-an-email"</span>));    <span class="comment">// false</span>

<span class="comment">// Phone Number (Bangladesh)</span>
<span class="keyword">const</span> phoneRegex = /^01[3-9]\d{8}$/;
<span class="keyword">console</span>.<span class="func">log</span>(phoneRegex.<span class="func">test</span>(<span class="string">"01712345678"</span>)); <span class="comment">// true</span>

<span class="comment">// Text Search & Replace</span>
<span class="keyword">const</span> text = <span class="string">"JavaScript is fun. JS is everywhere."</span>;
<span class="keyword">const</span> result = text.<span class="func">replace</span>(/js/gi, <span class="string">"<strong>JS</strong>"</span>);
<span class="keyword">console</span>.<span class="func">log</span>(result);

<span class="comment">// Match সব occurrence</span>
<span class="keyword">const</span> matches = text.<span class="func">match</span>(/js/gi);
<span class="keyword">console</span>.<span class="func">log</span>(matches); <span class="comment">// ["JavaScript", "JS"]</span>
<div class="output">▶ true
▶ false
▶ true</div></div>
<button class="try-btn" onclick="jsApp.tryInConsole('const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}\$/i;\nconsole.log(emailRegex.test(\"test@gmail.com\"));\nconsole.log(emailRegex.test(\"not-valid\"));\n\nconst text = \"Hello World. Hello JS.\";\nconsole.log(text.replace(/hello/gi, \"হ্যালো\"));')">🖥️ চেষ্টা করুন</button>
`
  },
  {
    id: 21, module: 4, title: 'Modules (import/export)',
    level: 4, levelName: 'প্রফেশনাল',
    content: `
<h3>📦 JavaScript Modules</h3>
<p>Modules দিয়ে কোডকে আলাদা ফাইলে ভাগ করা যায় এবং দরকার মতো import করা যায়।</p>
<div class="codeblock"><span class="comment">// math.js ফাইলে এক্সপোর্ট করুন</span>
<span class="keyword">export function</span> <span class="func">add</span>(a, b) { <span class="keyword">return</span> a + b; }
<span class="keyword">export function</span> <span class="func">multiply</span>(a, b) { <span class="keyword">return</span> a * b; }
<span class="keyword">export const</span> PI = <span class="number">3.14159</span>;

<span class="comment">// Default Export</span>
<span class="keyword">export default function</span> <span class="func">calculator</span>() { ... }</div>
<div class="codeblock"><span class="comment">// main.js ফাইলে import করুন</span>
<span class="keyword">import</span> { add, multiply, PI } <span class="keyword">from</span> <span class="string">"./math.js"</span>;
<span class="keyword">import</span> calculator <span class="keyword">from</span> <span class="string">"./math.js"</span>; <span class="comment">// default</span>

<span class="keyword">console</span>.<span class="func">log</span>(<span class="func">add</span>(<span class="number">5</span>, <span class="number">3</span>));      <span class="comment">// 8</span>
<span class="keyword">console</span>.<span class="func">log</span>(<span class="func">multiply</span>(<span class="number">4</span>, <span class="number">5</span>)); <span class="comment">// 20</span>
<span class="keyword">console</span>.<span class="func">log</span>(PI);             <span class="comment">// 3.14159</span>

<span class="comment">// সব একসাথে import</span>
<span class="keyword">import</span> * <span class="keyword">as</span> Math <span class="keyword">from</span> <span class="string">"./math.js"</span>;
<span class="keyword">console</span>.<span class="func">log</span>(Math.<span class="func">add</span>(<span class="number">2</span>, <span class="number">3</span>)); <span class="comment">// 5</span></div>
<p style="color:#ffa502;margin-top:10px;">⚠️ Modules ব্যবহারের জন্য HTML-এ <code>type="module"</code> দরকার।</p>
`
  },
  {
    id: 22, module: 4, title: 'Performance ও Best Practices',
    level: 4, levelName: 'প্রফেশনাল',
    content: `
<h3>⚡ JavaScript Best Practices</h3>
<h3>1. 'use strict' ব্যবহার করুন</h3>
<div class="codeblock"><span class="string">'use strict'</span>;
<span class="comment">// এটি সাধারণ ভুলগুলো error হিসেবে দেখায়</span></div>
<h3>2. === ব্যবহার করুন</h3>
<div class="codeblock"><span class="comment">// ❌ এড়িয়ে চলুন</span>
<span class="keyword">if</span> (x == <span class="string">"5"</span>) { }

<span class="comment">// ✅ ভালো পদ্ধতি</span>
<span class="keyword">if</span> (x === <span class="number">5</span>) { }</div>
<h3>3. Debouncing (Search Input-এ)</h3>
<div class="codeblock"><span class="keyword">function</span> <span class="func">debounce</span>(fn, delay) {
  <span class="keyword">let</span> timer;
  <span class="keyword">return</span> (...args) => {
    <span class="func">clearTimeout</span>(timer);
    timer = <span class="func">setTimeout</span>(() => <span class="func">fn</span>(...args), delay);
  };
}
<span class="keyword">const</span> search = <span class="func">debounce</span>((q) => <span class="keyword">console</span>.<span class="func">log</span>(q), <span class="number">300</span>);</div>
<h3>4. Optional Chaining (?.) ও Nullish Coalescing (??)</h3>
<div class="codeblock"><span class="keyword">const</span> user = <span class="keyword">null</span>;
<span class="comment">// ❌ এরর হবে: user.profile.name</span>
<span class="comment">// ✅ নিরাপদ:</span>
<span class="keyword">const</span> name = user?.profile?.name ?? <span class="string">"অজ্ঞাত"</span>;
<span class="keyword">console</span>.<span class="func">log</span>(name); <span class="comment">// "অজ্ঞাত"</span>
<div class="output">▶ অজ্ঞাত</div></div>
<button class="try-btn" onclick="jsApp.tryInConsole('const user = null;\nconst name = user?.profile?.name ?? \"অজ্ঞাত\";\nconsole.log(name);\n\n// Nullish Coalescing\nconst val = 0 ?? \"default\";\nconsole.log(val); // 0 (falsy হলেও 0 ও \"\" রাখে)');  ">🖥️ চেষ্টা করুন</button>
`
  }
];

// ===================== SNIPPETS =====================
const SNIPPETS = {
  hello: `// হ্যালো ওয়ার্ল্ড
console.log("হ্যালো, বাংলাদেশ! 🇧🇩");
console.log("JavaScript শেখা শুরু!");`,

  variables: `// Variables
let name = "Sabbir";
const age = 25;
let isStudent = true;

console.log(name);
console.log(age);
console.log(typeof isStudent);`,

  loop: `// Loops
// for loop
for (let i = 1; i <= 5; i++) {
  console.log("সংখ্যা:", i);
}

// Array loop
const fruits = ["আম", "কলা", "লিচু"];
for (const fruit of fruits) {
  console.log("ফল:", fruit);
}`,

  function: `// Functions
function greet(name = "বন্ধু") {
  return \`হ্যালো, \${name}!\`;
}

const add = (a, b) => a + b;

console.log(greet("Sabbir"));
console.log(greet());
console.log(add(10, 20));`,

  array: `// Array Methods
const nums = [1, 2, 3, 4, 5];

const doubled = nums.map(n => n * 2);
const evens   = nums.filter(n => n % 2 === 0);
const total   = nums.reduce((a, b) => a + b, 0);

console.log("Original:", nums);
console.log("Doubled:", doubled);
console.log("Evens:", evens);
console.log("Sum:", total);`,

  object: `// Objects
const person = {
  name: "Sabbir",
  age: 25,
  city: "Dhaka",
  greet() {
    return \`আমি \${this.name}, \${this.city} থেকে\`;
  }
};

// Destructuring
const { name, age } = person;
console.log(name, age);
console.log(person.greet());

// Spread
const updated = { ...person, age: 26 };
console.log(updated);`,

  promise: `// Promise & async/await
const delay = (ms) => new Promise(r => setTimeout(r, ms));

async function runAsync() {
  console.log("শুরু হলো...");
  await delay(100); // 100ms অপেক্ষা
  console.log("সম্পন্ন! ✅");
  
  // Promise.all - একসাথে চালান
  const [a, b] = await Promise.all([
    Promise.resolve(10),
    Promise.resolve(20)
  ]);
  console.log("একসাথে:", a + b);
}
runAsync();`,

  fetch: `// Fetch API (Real HTTP Request)
async function fetchData() {
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/users/1");
    const user = await res.json();
    console.log("নাম:", user.name);
    console.log("ইমেইল:", user.email);
    console.log("শহর:", user.address.city);
  } catch (err) {
    console.error("Error:", err.message);
  }
}
fetchData();`
};

// ===================== REFERENCE DATA =====================
const REFERENCE = {
  array: [
    { name: 'arr.push(item)', desc: 'শেষে element যোগ করে, নতুন length রিটার্ন করে', ex: '[1,2].push(3) → 3 (len)\n// arr is now [1,2,3]' },
    { name: 'arr.pop()', desc: 'শেষের element সরিয়ে রিটার্ন করে', ex: '[1,2,3].pop() → 3' },
    { name: 'arr.shift()', desc: 'শুরু থেকে element সরিয়ে রিটার্ন করে', ex: '[1,2,3].shift() → 1' },
    { name: 'arr.unshift(item)', desc: 'শুরুতে element যোগ করে', ex: '[2,3].unshift(1) → [1,2,3]' },
    { name: 'arr.map(fn)', desc: 'প্রতিটি element transform করে নতুন array দেয়', ex: '[1,2,3].map(x => x*2)\n→ [2,4,6]' },
    { name: 'arr.filter(fn)', desc: 'শর্ত মানলে নতুন array-এ রাখে', ex: '[1,2,3,4].filter(x => x>2)\n→ [3,4]' },
    { name: 'arr.reduce(fn, init)', desc: 'একটি মানে পরিণত করে', ex: '[1,2,3].reduce((a,b)=>a+b, 0)\n→ 6' },
    { name: 'arr.find(fn)', desc: 'প্রথম মিলানো element রিটার্ন করে', ex: '[1,2,3].find(x => x>1) → 2' },
    { name: 'arr.findIndex(fn)', desc: 'প্রথম মিলানো index রিটার্ন করে', ex: '[1,2,3].findIndex(x=>x>1) → 1' },
    { name: 'arr.includes(val)', desc: 'value আছে কি না (boolean)', ex: '[1,2,3].includes(2) → true' },
    { name: 'arr.indexOf(val)', desc: 'value-এর index রিটার্ন করে', ex: '[1,2,3].indexOf(2) → 1' },
    { name: 'arr.slice(s, e)', desc: 'অংশ কেটে নতুন array দেয়', ex: '[1,2,3,4].slice(1,3) → [2,3]' },
    { name: 'arr.splice(i, n)', desc: 'element সরায় বা যোগ করে (mutates)', ex: 'arr.splice(1, 2) removes 2 items' },
    { name: 'arr.join(sep)', desc: 'String-এ পরিণত করে', ex: '["a","b"].join("-") → "a-b"' },
    { name: 'arr.sort(fn)', desc: 'Sort করে (mutates)', ex: '[3,1,2].sort() → [1,2,3]' },
    { name: 'arr.reverse()', desc: 'উল্টো করে (mutates)', ex: '[1,2,3].reverse() → [3,2,1]' },
    { name: 'arr.flat(depth)', desc: 'Nested array সমতল করে', ex: '[[1,2],[3]].flat() → [1,2,3]' },
    { name: 'arr.some(fn)', desc: 'কোনো একটি match করলে true', ex: '[1,2,3].some(x=>x>2) → true' },
    { name: 'arr.every(fn)', desc: 'সব match করলে true', ex: '[1,2,3].every(x=>x>0) → true' },
    { name: 'Array.from()', desc: 'Array-like থেকে Array তৈরি', ex: 'Array.from("abc") → ["a","b","c"]' },
  ],
  string: [
    { name: 'str.length', desc: 'String-এর দৈর্ঘ্য', ex: '"hello".length → 5' },
    { name: 'str.toUpperCase()', desc: 'বড় হাতে রূপান্তর', ex: '"hello".toUpperCase() → "HELLO"' },
    { name: 'str.toLowerCase()', desc: 'ছোট হাতে রূপান্তর', ex: '"HELLO".toLowerCase() → "hello"' },
    { name: 'str.trim()', desc: 'শুরু-শেষের space সরায়', ex: '" hi ".trim() → "hi"' },
    { name: 'str.includes(sub)', desc: 'substring আছে কি না', ex: '"hello".includes("ell") → true' },
    { name: 'str.startsWith(s)', desc: 'শুরুতে আছে কি না', ex: '"hello".startsWith("he") → true' },
    { name: 'str.endsWith(s)', desc: 'শেষে আছে কি না', ex: '"hello".endsWith("lo") → true' },
    { name: 'str.indexOf(s)', desc: 'প্রথম occurrence-এর index', ex: '"hello".indexOf("l") → 2' },
    { name: 'str.slice(s, e)', desc: 'অংশ কেটে নেয়', ex: '"hello".slice(1,3) → "el"' },
    { name: 'str.split(sep)', desc: 'Array-এ ভাগ করে', ex: '"a,b,c".split(",") → ["a","b","c"]' },
    { name: 'str.replace(old, new)', desc: 'প্রতিস্থাপন করে', ex: '"hi all".replace("hi","হ্যালো")' },
    { name: 'str.replaceAll(o,n)', desc: 'সব occurrence প্রতিস্থাপন করে', ex: '"aa".replaceAll("a","b") → "bb"' },
    { name: 'str.repeat(n)', desc: 'n বার পুনরাবৃত্তি করে', ex: '"ha".repeat(3) → "hahaha"' },
    { name: 'str.padStart(n, c)', desc: 'শুরুতে pad করে', ex: '"5".padStart(3,"0") → "005"' },
    { name: 'str.padEnd(n, c)', desc: 'শেষে pad করে', ex: '"5".padEnd(3,"0") → "500"' },
    { name: 'str.charAt(i)', desc: 'নির্দিষ্ট index-এর character', ex: '"hello".charAt(1) → "e"' },
    { name: 'str.charCodeAt(i)', desc: 'character-এর ASCII code', ex: '"A".charCodeAt(0) → 65' },
    { name: 'str.match(regex)', desc: 'Regex match করে', ex: '"Hi JS".match(/js/i) → ["JS"]' },
  ],
  object: [
    { name: 'Object.keys(obj)', desc: 'সব key-এর array', ex: 'Object.keys({a:1,b:2}) → ["a","b"]' },
    { name: 'Object.values(obj)', desc: 'সব value-এর array', ex: 'Object.values({a:1,b:2}) → [1,2]' },
    { name: 'Object.entries(obj)', desc: '[key, value] pair-এর array', ex: 'Object.entries({a:1}) → [["a",1]]' },
    { name: 'Object.assign(t, s)', desc: 'source থেকে target-এ copy', ex: 'Object.assign({}, {a:1},{b:2})' },
    { name: 'Object.freeze(obj)', desc: 'object পরিবর্তন বন্ধ', ex: 'const o=Object.freeze({a:1})' },
    { name: 'Object.create(proto)', desc: 'prototype থেকে object তৈরি', ex: 'Object.create(Animal.prototype)' },
    { name: 'Object.hasOwn(o, k)', desc: 'নিজস্ব property আছে কি না', ex: 'Object.hasOwn({a:1}, "a") → true' },
    { name: 'Spread {...obj}', desc: 'Object copy/merge করে', ex: '{...obj1, ...obj2}' },
    { name: 'Destructuring', desc: 'Key-এ ভাগ করে', ex: 'const {a, b} = {a:1, b:2}' },
    { name: 'Optional Chaining ?.', desc: 'নিরাপদে nested access', ex: 'user?.address?.city' },
    { name: 'Nullish Coalescing ??', desc: 'null/undefined হলে default', ex: 'null ?? "default" → "default"' },
  ],
  dom: [
    { name: 'document.getElementById(id)', desc: 'ID দিয়ে element খোঁজে', ex: 'document.getElementById("btn")' },
    { name: 'document.querySelector(sel)', desc: 'CSS selector দিয়ে প্রথমটা', ex: 'document.querySelector(".card")' },
    { name: 'document.querySelectorAll()', desc: 'CSS selector দিয়ে সব', ex: 'querySelectorAll("p")' },
    { name: 'el.textContent', desc: 'Text কনটেন্ট পড়া/লেখা', ex: 'el.textContent = "নতুন টেক্সট"' },
    { name: 'el.innerHTML', desc: 'HTML কনটেন্ট পড়া/লেখা', ex: 'el.innerHTML = "<b>Bold</b>"' },
    { name: 'el.style.prop', desc: 'Inline style সেট করা', ex: 'el.style.color = "red"' },
    { name: 'el.classList.add()', desc: 'Class যোগ করা', ex: 'el.classList.add("active")' },
    { name: 'el.classList.remove()', desc: 'Class সরানো', ex: 'el.classList.remove("hidden")' },
    { name: 'el.classList.toggle()', desc: 'Class toggle করা', ex: 'el.classList.toggle("dark")' },
    { name: 'el.getAttribute()', desc: 'Attribute-এর মান পড়া', ex: 'el.getAttribute("href")' },
    { name: 'el.setAttribute()', desc: 'Attribute সেট করা', ex: 'el.setAttribute("href", "/")' },
    { name: 'el.addEventListener()', desc: 'Event listener যোগ', ex: 'el.addEventListener("click", fn)' },
    { name: 'document.createElement()', desc: 'নতুন element তৈরি', ex: 'document.createElement("div")' },
    { name: 'el.appendChild()', desc: 'Element যোগ করা', ex: 'parent.appendChild(child)' },
    { name: 'el.remove()', desc: 'Element সরানো', ex: 'el.remove()' },
    { name: 'el.closest(sel)', desc: 'কাছের ancestor খোঁজা', ex: 'el.closest(".card")' },
  ],
  es6: [
    { name: 'Arrow Function', desc: 'সংক্ষিপ্ত ফাংশন syntax', ex: 'const add = (a, b) => a + b;' },
    { name: 'Template Literal', desc: 'String-এ expression ব্যবহার', ex: 'const s = `হ্যালো ${name}!`' },
    { name: 'Destructuring', desc: 'Array/Object থেকে মান বের করা', ex: 'const [a, b] = [1, 2];\nconst {x} = {x: 10};' },
    { name: 'Spread ...', desc: 'Array/Object expand করা', ex: '[...arr1, ...arr2]\n{...obj1, extra: val}' },
    { name: 'Rest ...', desc: 'বাকি সব একত্রিত করা', ex: 'function(first, ...rest) {}' },
    { name: 'Default Params', desc: 'Default মান', ex: 'function greet(n = "বন্ধু") {}' },
    { name: 'Promise', desc: 'Async operation handle', ex: 'new Promise((res, rej) => {})' },
    { name: 'async/await', desc: 'Promise সহজে লেখা', ex: 'async function f() {\n  await somePromise();\n}' },
    { name: 'import/export', desc: 'Module system', ex: 'import { fn } from "./file.js"' },
    { name: 'Class', desc: 'OOP Class syntax', ex: 'class Animal { constructor() {} }' },
    { name: 'Set', desc: 'Unique value collection', ex: 'new Set([1, 2, 2, 3]) → {1,2,3}' },
    { name: 'Map', desc: 'Key-value store (any type key)', ex: 'const m = new Map(); m.set(k, v)' },
    { name: 'Symbol', desc: 'Unique identifier', ex: 'const id = Symbol("id")' },
    { name: 'WeakRef', desc: 'Garbage collection safe reference', ex: 'new WeakRef(object)' },
    { name: 'Optional Chaining ?.', desc: 'Null-safe property access', ex: 'user?.address?.city' },
    { name: 'Nullish Coalescing ??', desc: 'Null/undefined fallback', ex: 'val ?? "default"' },
    { name: 'Logical Assignment ||=, &&=', desc: 'Conditional assignment', ex: 'x ||= "default"' },
    { name: 'BigInt', desc: 'বড় integer', ex: 'const n = 9007199254740991n' },
  ]
};

// ===================== CHEAT SHEET DATA =====================
const CHEATSHEET = [
  {
    title: '📦 Variables',
    items: [
      { key: 'let x = 5', val: 'পরিবর্তনযোগ্য' },
      { key: 'const y = 10', val: 'স্থায়ী' },
      { key: 'typeof x', val: 'ডেটা টাইপ জানুন' },
      { key: 'x ?? "def"', val: 'Nullish fallback' },
      { key: 'x ??= "val"', val: 'Nullish assignment' },
    ]
  },
  {
    title: '🔢 Numbers',
    items: [
      { key: 'Math.round(n)', val: 'নিকটতম পূর্ণ সংখ্যা' },
      { key: 'Math.floor(n)', val: 'নিচের পূর্ণ সংখ্যা' },
      { key: 'Math.ceil(n)', val: 'উপরের পূর্ণ সংখ্যা' },
      { key: 'Math.random()', val: '0 থেকে 1 random' },
      { key: 'parseInt("5")', val: 'String → Integer' },
      { key: 'parseFloat("5.5")', val: 'String → Float' },
      { key: 'Number.isNaN(x)', val: 'NaN চেক করুন' },
    ]
  },
  {
    title: '🔤 Strings',
    items: [
      { key: '`${var}`', val: 'Template literal' },
      { key: 'str.split(",")', val: 'Array-এ ভাগ করুন' },
      { key: 'str.trim()', val: 'Space সরান' },
      { key: 'str.includes(s)', val: 'খুঁজুন' },
      { key: 'str.replace(o,n)', val: 'বদলান' },
      { key: 'str.toUpperCase()', val: 'বড় হাতে' },
    ]
  },
  {
    title: '📋 Arrays',
    items: [
      { key: 'arr.push(x)', val: 'শেষে যোগ' },
      { key: 'arr.pop()', val: 'শেষ সরান' },
      { key: 'arr.map(fn)', val: 'Transform করুন' },
      { key: 'arr.filter(fn)', val: 'ফিল্টার করুন' },
      { key: 'arr.reduce(fn)', val: 'একত্রিত করুন' },
      { key: 'arr.find(fn)', val: 'একটি খুঁজুন' },
      { key: '[...a, ...b]', val: 'Merge করুন' },
    ]
  },
  {
    title: '🏗️ Objects',
    items: [
      { key: '{...obj}', val: 'Copy/merge' },
      { key: 'const {a} = obj', val: 'Destructure' },
      { key: 'Object.keys(o)', val: 'সব key' },
      { key: 'Object.values(o)', val: 'সব value' },
      { key: 'Object.entries(o)', val: '[k,v] pairs' },
      { key: 'obj?.prop', val: 'Safe access' },
    ]
  },
  {
    title: '⏳ Async',
    items: [
      { key: 'async function f(){}', val: 'Async function' },
      { key: 'await promise', val: 'Wait করুন' },
      { key: 'try { } catch {}', val: 'Error handle' },
      { key: 'Promise.all([])', val: 'সব একসাথে' },
      { key: 'Promise.race([])', val: 'প্রথমটা নিন' },
      { key: 'fetch(url)', val: 'HTTP request' },
    ]
  },
  {
    title: '🌐 DOM',
    items: [
      { key: 'querySelector(s)', val: 'Element খুঁজুন' },
      { key: 'el.textContent', val: 'টেক্সট বদলান' },
      { key: 'el.innerHTML', val: 'HTML বদলান' },
      { key: 'classList.add(c)', val: 'Class যোগ' },
      { key: 'addEventListener(e,f)', val: 'Event যোগ' },
      { key: 'createElement(t)', val: 'নতুন element' },
    ]
  },
  {
    title: '🎯 ES6+ Quick',
    items: [
      { key: '(a,b) => a+b', val: 'Arrow function' },
      { key: 'const [a,b] = arr', val: 'Array destruct' },
      { key: 'const {x} = obj', val: 'Object destruct' },
      { key: 'import {x} from ""', val: 'Import' },
      { key: 'export default fn', val: 'Export' },
      { key: 'class X extends Y{}', val: 'Inheritance' },
    ]
  },
  {
    title: '🔧 Useful Methods',
    items: [
      { key: 'JSON.parse(str)', val: 'String→Object' },
      { key: 'JSON.stringify(o)', val: 'Object→String' },
      { key: 'setTimeout(fn, ms)', val: 'Delayed run' },
      { key: 'setInterval(fn, ms)', val: 'Repeated run' },
      { key: 'clearTimeout(id)', val: 'Cancel timer' },
      { key: 'console.log()', val: 'Debug করুন' },
    ]
  },
  {
    title: '💾 Storage & JSON',
    items: [
      { key: 'localStorage.setItem(k,v)', val: 'সংরক্ষণ' },
      { key: 'localStorage.getItem(k)', val: 'পড়ুন' },
      { key: 'localStorage.removeItem(k)', val: 'মুছুন' },
      { key: 'sessionStorage.*', val: 'Session storage' },
      { key: 'document.cookie', val: 'Cookie' },
    ]
  },
];

// ===================== QUIZ DATA =====================
const ALL_QUIZ = [
  { q: "JavaScript-এ কোন keyword দিয়ে স্থায়ী (পরিবর্তনযোগ্য নয়) variable ঘোষণা করা হয়?", options: ["var", "let", "const", "static"], ans: 2, exp: "const দিয়ে declare করা variable-কে পরে পুনরায় assign করা যায় না। তবে Object বা Array-এর ভেতরের মান পরিবর্তন করা যায়।" },
  { q: "console.log(typeof null) এর আউটপুট কী?", options: ['"null"', '"undefined"', '"object"', '"boolean"'], ans: 2, exp: "এটি JavaScript-এর একটি ঐতিহাসিক বাগ। typeof null সবসময় 'object' রিটার্ন করে।" },
  { q: "নিচের কোনটি Falsy value নয়?", options: ["0", '""', "[]", "null"], ans: 2, exp: "[] (empty array) হলো Truthy! JavaScript-এ falsy values: false, 0, '', null, undefined, NaN।" },
  { q: "== এবং === এর মধ্যে পার্থক্য কী?", options: ["কোনো পার্থক্য নেই", "== শুধু মান দেখে, === মান ও type দুটোই দেখে", "=== শুধু মান দেখে", "== মান ও type দুটোই দেখে"], ans: 1, exp: "'5' == 5 হবে true কারণ type coercion হয়, কিন্তু '5' === 5 হবে false কারণ type আলাদা।" },
  { q: "Arrow function ও regular function-এর মধ্যে মূল পার্থক্য কী?", options: ["Arrow function দ্রুত", "Arrow function-এ নিজস্ব 'this' নেই", "Arrow function-এ parameters দেওয়া যায় না", "কোনো পার্থক্য নেই"], ans: 1, exp: "Arrow function-এ 'this' lexically bind হয় — অর্থাৎ surrounding context-এর 'this' নেয়। Regular function-এ 'this' dynamically নির্ধারণ হয়।" },
  { q: "[1,2,3].map(x => x*2) এর ফলাফল কী?", options: ["[2,4,6]", "[1,2,3,2,4,6]", "6", "[1,4,9]"], ans: 0, exp: "map() প্রতিটি element-এ function apply করে নতুন array রিটার্ন করে। x*2 মানে প্রতিটি সংখ্যা দ্বিগুণ।" },
  { q: "Promise-এ reject হলে কোন method দিয়ে ধরা যায়?", options: [".then()", ".catch()", ".finally()", ".error()"], ans: 1, exp: ".catch() দিয়ে rejected Promise ধরা যায়। .finally() সফলতা বা ব্যর্থতা উভয় ক্ষেত্রেই চলে।" },
  { q: "Closure কী?", options: ["একটি ফাংশন যা নিজের বাইরের scope-এর variable মনে রাখে", "একটি ধরনের loop", "Array-এর একটি method", "Error handling technique"], ans: 0, exp: "Closure হলো inner function-এর বাইরের function-এর scope-এ access রাখার ক্ষমতা, এমনকি outer function শেষ হয়ে গেলেও।" },
  { q: "localStorage এবং sessionStorage-এর পার্থক্য কী?", options: ["localStorage বড় ডেটা রাখতে পারে", "sessionStorage ব্রাউজার বন্ধ করলে মুছে যায়", "localStorage শুধু string রাখতে পারে", "কোনো পার্থক্য নেই"], ans: 1, exp: "sessionStorage শুধু browser session পর্যন্ত টেকে, tab বন্ধ হলে ডেটা চলে যায়। localStorage স্থায়ীভাবে থাকে।" },
  { q: "async/await কীসের উপরে নির্মিত?", options: ["Callbacks", "Generators", "Promises", "setTimeout"], ans: 2, exp: "async/await হলো Promises-এর উপরে syntactic sugar। একটি async function সবসময় Promise রিটার্ন করে।" },
  { q: "spread operator (...) কীসের জন্য ব্যবহার হয়?", options: ["শুধু arrays-এর জন্য", "শুধু objects-এর জন্য", "Arrays ও objects উভয়কে expand করতে", "শুধু strings-এর জন্য"], ans: 2, exp: "Spread operator ব্যবহার করে array clone, merge এবং object clone, merge উভয়ই করা যায়।" },
  { q: "typeof function(){} এর আউটপুট কী?", options: ['"object"', '"function"', '"method"', '"undefined"'], ans: 1, exp: "JavaScript-এ function একটি first-class object, কিন্তু typeof দিয়ে check করলে 'function' আসে।" },
  { q: "Array-এর শেষে নতুন element যোগ করার সবচেয়ে সাধারণ method কোনটি?", options: ["arr.add()", "arr.append()", "arr.push()", "arr.insert()"], ans: 2, exp: "push() array-এর শেষে element যোগ করে এবং নতুন length রিটার্ন করে।" },
  { q: "Template literal লেখার সঠিক syntax কোনটি?", options: ["'Hello ${name}'", '"Hello ${name}"', '`Hello ${name}`', '`Hello [name]`'], ans: 2, exp: "Template literal-এ backtick (`) ব্যবহার করতে হয় এবং expression ${} দিয়ে লিখতে হয়।" },
  { q: "for...of loop কীসের জন্য?", options: ["Object-এর keys-এর জন্য", "Array বা iterable-এর values-এর জন্য", "শুধু number-এর জন্য", "DOM elements-এর জন্য"], ans: 1, exp: "for...of loop Array, String, Map, Set ইত্যাদি iterable-এর প্রতিটি value-এর উপর iterate করে।" },
  { q: "JSON.parse() কী করে?", options: ["Object কে String-এ রূপান্তর করে", "JSON String কে JavaScript Object-এ রূপান্তর করে", "JavaScript কে compress করে", "Array sort করে"], ans: 1, exp: "JSON.parse(jsonString) → JavaScript Object। উল্টোটা হলো JSON.stringify(object) → JSON String।" },
  { q: "Optional chaining (?.) কেন ব্যবহার করা হয়?", options: ["Performance বাড়াতে", "undefined বা null থেকে error এড়াতে", "নতুন object তৈরি করতে", "Async code লিখতে"], ans: 1, exp: "user?.address?.city — যদি user বা address null/undefined হয় তাহলে error না দিয়ে undefined রিটার্ন করবে।" },
  { q: "Set data structure কীসের জন্য ব্যবহার হয়?", options: ["Sorted data", "Unique values store করতে", "Key-value pairs", "Async operations"], ans: 1, exp: "Set-এ duplicate value রাখা যায় না। তাই array থেকে unique values বের করতে এটি খুব কাজে লাগে।" },
  { q: "নিচের কোনটি সঠিক arrow function?", options: ["function => () { }", "const f = x => x * 2;", "arrow f(x) { return x; }", "def f(x) = x * 2"], ans: 1, exp: "Arrow function syntax: const f = (params) => expression; অথবা const f = (params) => { return expression; };" },
  { q: "try...catch block কোন ক্ষেত্রে ব্যবহার হয়?", options: ["Loops-এ", "Runtime errors handle করতে", "Variables declare করতে", "DOM select করতে"], ans: 1, exp: "try-এর ভেতরে code চলে, কোনো error হলে catch block-এ ধরা যায়। finally সবসময় চলে।" },
  { q: "JavaScript-এ 'this' keyword কী বোঝায়?", options: ["সবসময় global object", "যে context-এ function চলছে সেই object", "নতুন object", "Parent class"], ans: 1, exp: "'this' dynamically নির্ধারণ হয়। Regular function-এ call করার context, arrow function-এ surrounding lexical scope।" },
  { q: "Array.from() method কী করে?", options: ["Array clone করে", "Array-like বা iterable থেকে Array তৈরি করে", "Empty array তৈরি করে", "Array sort করে"], ans: 1, exp: "Array.from('hello') → ['h','e','l','l','o']; Array.from({length:3}, (_, i) => i) → [0,1,2];" },
  { q: "Event bubbling কী?", options: ["Event শুধু target element-এ চলে", "Event target থেকে DOM-এ উপরে যায়", "Event নিচে নামে", "Event cancel হয়"], ans: 1, exp: "Event bubbling: child element-এ event fire হলে সেটা parent, grandparent... document পর্যন্ত propagate হয়। e.stopPropagation() দিয়ে থামানো যায়।" },
  { q: "Promise.all() কী করে?", options: ["প্রথম resolve হওয়া Promise নেয়", "সব Promises একসাথে run করে সব শেষ হলে resolve করে", "সব reject করে", "Serial-এ চালায়"], ans: 1, exp: "Promise.all([p1, p2, p3]) সব Promise একসাথে শুরু করে এবং সব resolve হলে array হিসেবে দেয়। একটিও reject হলে পুরো all() reject হয়।" },
  { q: "Hoisting কী?", options: ["Code optimize করা", "Variable ও function declaration code-এর উপরে নিয়ে যাওয়া", "DOM load", "Async operation"], ans: 1, exp: "JavaScript execution-এর আগে var declaration ও function declaration code-এর উপরে 'toist' হয়। let ও const হয় না।" },
  { q: "Array-এ শর্ত মেনে কোনো একটি element খুঁজে বের করতে কোন method?", options: ["arr.search()", "arr.find()", "arr.get()", "arr.locate()"], ans: 1, exp: "arr.find(fn) প্রথম মিলানো element রিটার্ন করে। না পেলে undefined রিটার্ন করে। findIndex() দিয়ে index পাওয়া যায়।" },
  { q: "Debouncing কী?", options: ["Code speed বাড়ানো", "বারবার call হওয়া function-কে delay করে একবার চালানো", "Error handle করা", "Async কে sync করা"], ans: 1, exp: "Debouncing: search input-এ প্রতিটি keystroke-এ API call না করে, user টাইপ থামানোর কিছু সময় পরে একবার call করা।" },
  { q: "WeakMap ও Map-এর পার্থক্য কী?", options: ["WeakMap বড়", "WeakMap-এর key garbage collected হতে পারে", "Map শুধু string key নেয়", "কোনো পার্থক্য নেই"], ans: 1, exp: "WeakMap-এ শুধু object key হতে পারে এবং key-এর কোনো reference না থাকলে garbage collected হয়। Iteration করা যায় না।" },
  { q: "Symbol কেন ব্যবহার করা হয়?", options: ["Number-এর বিকল্প", "Unique identifier তৈরি করতে", "String শর্টকাট", "Array তৈরি করতে"], ans: 1, exp: "Symbol() প্রতিবার একটি globally unique value তৈরি করে। Object-এর private-like property key হিসেবে ব্যবহৃত হয়।" },
  { q: "JavaScript-এ garbage collection কীভাবে কাজ করে?", options: ["Manual করতে হয়", "Automatically, reachable না হলে memory মুক্ত হয়", "শুধু null assign করলে", "Browser restart-এ"], ans: 1, exp: "JavaScript engine (V8 etc.) mark-and-sweep algorithm ব্যবহার করে। কোনো variable-এর কোনো reference না থাকলে সেই memory automatic free হয়।" },
  { q: "Rest parameter কী?", options: ["শেষ parameter-কে array হিসেবে ধরে", "Default parameter", "Optional parameter", "Object parameter"], ans: 0, exp: "Rest parameter (...args) function-এর remaining arguments-কে একটি array হিসেবে ধরে। function sum(...nums) { return nums.reduce((a,b)=>a+b) }" },
  { q: "Prototype chain কী?", options: ["একটি Array type", "Object-এর property lookup chain", "Async chain", "Event chain"], ans: 1, exp: "JavaScript-এ প্রতিটি object-এর একটি prototype আছে। Property না পেলে prototype-এ যায়, prototype-এর prototype-এ যায়... null পর্যন্ত।" },
  { q: "Generator function কোন keyword ব্যবহার করে?", options: ["async function", "function*", "yield function", "gen function"], ans: 1, exp: "function* দিয়ে generator তৈরি হয় এবং yield দিয়ে মান দেওয়া হয়। generator.next() call করলে পরবর্তী yield পর্যন্ত চলে।" },
  { q: "Immutability মানে কী?", options: ["Variable মুছে ফেলা", "Data পরিবর্তন না করা, নতুন copy তৈরি করা", "const ব্যবহার", "Object freeze করা"], ans: 1, exp: "Immutability: existing data পরিবর্তন না করে নতুন data তৈরি করা। এটি bugs কমায় ও predictable code লেখা যায়।" },
  { q: "Currying কী?", options: ["String format করা", "একাধিক argument-এর function কে একে একে argument নেওয়া function-এ convert করা", "Error handling", "Loop technique"], ans: 1, exp: "Currying: f(a, b) → f(a)(b). উদাহরণ: const add = a => b => a + b; add(5)(3) === 8" },
  { q: "Event delegation কী?", options: ["Event cancel করা", "Parent element-এ event listener রেখে child elements-এর event handle করা", "Multiple event চালানো", "Custom event তৈরি"], ans: 1, exp: "Event delegation: সব child-এ আলাদা listener না দিয়ে parent-এ একটি listener দেওয়া। Dynamic element-এর জন্য খুব কাজে লাগে।" },
  { q: "IIFE কী?", options: ["একটি Array method", "Immediately Invoked Function Expression — declare হওয়ার সাথে সাথে চলে", "Import method", "Error type"], ans: 1, exp: "IIFE: (function() { ... })(); অথবা (() => { ... })(); — declare হওয়ার সাথে সাথে চলে এবং private scope তৈরি করে।" },
  { q: "JavaScript single-threaded মানে কী?", options: ["একটি ব্রাউজারে চলে", "একসাথে একটাই task run করতে পারে", "একটি ফাইলে থাকতে হয়", "একটি variable নেয়"], ans: 1, exp: "JavaScript একসাথে একটাই operation চালাতে পারে (single call stack)। Async operations (setTimeout, fetch) Web APIs handle করে এবং Event Loop এর মাধ্যমে callback queue থেকে main thread-এ ফিরে আসে।" },
  { q: "Short-circuit evaluation কী?", options: ["Error শর্টকাট", "Logical operator-এ প্রথম operand result নির্ধারণ করলে দ্বিতীয় evaluate না করা", "Fast loop", "Code minify"], ans: 1, exp: "true || anything → true (কখনো 'anything' evaluate করে না)। false && anything → false। এটি conditional render-এ ব্যবহার হয়: isLoggedIn && <Dashboard />" },
  { q: "Object.freeze() এর কাজ কী?", options: ["Object কে array-এ রূপান্তর", "Object-এর modification বন্ধ করে", "Object কপি করে", "Object delete করে"], ans: 1, exp: "Object.freeze(obj) করলে সেই object-এর property যোগ, বাদ বা পরিবর্তন করা যায় না। Shallow freeze — nested objects এখনো mutable।" },
  { q: "Nullish coalescing operator (??) কী করে?", options: ["null check করে মুছে দেয়", "শুধুমাত্র null বা undefined হলে right side নেয়", "সব falsy value-র জন্য right side নেয়", "Optional chaining এর alias"], ans: 1, exp: "?? শুধু null এবং undefined-এর ক্ষেত্রে right side নেয়। 0 ?? 'default' → 0 (কারণ 0 falsy হলেও null/undefined নয়)।" },
];

// ===================== APP LOGIC =====================
const jsApp = {
  currentLesson: null,

  init() {
    this.renderSidebar();
    this.renderCheatsheet();
    this.showRef('array');
    this.initNav();
    this.initSearch();
    this.initTheme();
    this.initConsole();
  },

  // ---- SIDEBAR ----
  renderSidebar() {
    const list = document.getElementById('dayList');
    if (!list) return;

    const modules = {
      1: { name: '🌱 মৌলিক', lessons: [] },
      2: { name: '⚡ মধ্যবর্তী', lessons: [] },
      3: { name: '🚀 উন্নত', lessons: [] },
      4: { name: '💼 প্রফেশনাল', lessons: [] },
    };

    CURRICULUM.forEach(l => {
      if (modules[l.module]) modules[l.module].lessons.push(l);
    });

    let html = '';
    Object.entries(modules).forEach(([mod, data]) => {
      html += `<li><div class="module-header">${data.name}</div></li>`;
      data.lessons.forEach(l => {
        html += `<li><a data-id="${l.id}" onclick="jsApp.loadLesson(${l.id})">
          <span class="lesson-num">${l.id}</span>
          <span>${l.title}</span>
        </a></li>`;
      });
    });

    list.innerHTML = html;
  },

  renderSidebarForModule(module) {
    const items = document.querySelectorAll('#dayList li a[data-id]');
    items.forEach(item => {
      const lesson = CURRICULUM.find(l => l.id === parseInt(item.dataset.id));
      if (lesson) {
        item.parentElement.style.display = (module === 0 || lesson.module === module) ? '' : 'none';
      }
    });
    const headers = document.querySelectorAll('#dayList .module-header');
    headers.forEach(h => h.parentElement.style.display = '');
  },

  loadLesson(id) {
    const lesson = CURRICULUM.find(l => l.id === id);
    if (!lesson) return;

    this.currentLesson = id;
    this.goToSection('lessons');

    const detail = document.getElementById('lessonDetail');
    const levelColors = { 1: 'level-1', 2: 'level-2', 3: 'level-3', 4: 'level-4' };
    const levelColor = levelColors[lesson.level] || 'level-1';

    detail.innerHTML = `
      <div class="lesson-card">
        <div class="lesson-card-header">
          <h3>${lesson.title}</h3>
          <span class="lesson-level-badge ${levelColor}">${lesson.levelName}</span>
        </div>
        <div class="lesson-card-body">
          ${lesson.content}
          <div class="lesson-nav-btns">
            <button class="btn-prev" onclick="jsApp.loadLesson(${id - 1})" ${id <= 1 ? 'disabled style="opacity:0.4"' : ''}>⬅️ আগের পাঠ</button>
            <button class="btn-next" onclick="jsApp.loadLesson(${id + 1})" ${id >= CURRICULUM.length ? 'disabled style="opacity:0.4"' : ''}>পরের পাঠ ➡️</button>
          </div>
        </div>
      </div>`;

    document.querySelectorAll('#dayList li a').forEach(a => {
      a.classList.toggle('active', parseInt(a.dataset.id) === id);
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  filterModule(module) {
    document.querySelectorAll('.filter-btn').forEach((b, i) => b.classList.toggle('active', i === module));
    this.renderSidebarForModule(module);
  },

  // ---- CONSOLE ----
  initConsole() {
    const editor = document.getElementById('codeEditor');
    const lineNums = document.getElementById('lineNumbers');
    if (!editor) return;

    editor.addEventListener('input', () => {
      const lines = editor.value.split('\n').length;
      lineNums.textContent = Array.from({ length: lines }, (_, i) => i + 1).join('\n');
    });

    editor.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const start = editor.selectionStart, end = editor.selectionEnd;
        editor.value = editor.value.substring(0, start) + '  ' + editor.value.substring(end);
        editor.selectionStart = editor.selectionEnd = start + 2;
        lineNums.textContent = Array.from({ length: editor.value.split('\n').length }, (_, i) => i + 1).join('\n');
      }
    });
  },

  loadSnippet(name) {
    const editor = document.getElementById('codeEditor');
    const lineNums = document.getElementById('lineNumbers');
    if (editor && SNIPPETS[name]) {
      editor.value = SNIPPETS[name];
      const lines = editor.value.split('\n').length;
      lineNums.textContent = Array.from({ length: lines }, (_, i) => i + 1).join('\n');
    }
    this.goToSection('console');
  },

  tryInConsole(code) {
    const editor = document.getElementById('codeEditor');
    const lineNums = document.getElementById('lineNumbers');
    if (editor) {
      editor.value = code;
      const lines = editor.value.split('\n').length;
      lineNums.textContent = Array.from({ length: lines }, (_, i) => i + 1).join('\n');
    }
    this.goToSection('console');
    setTimeout(() => this.runCode(), 100);
  },

  runCode() {
    const code = document.getElementById('codeEditor').value;
    const output = document.getElementById('outputArea');
    output.innerHTML = '';

    const logs = [];
    const origLog = console.log;
    const origWarn = console.warn;
    const origError = console.error;
    const origInfo = console.info;

    const fmt = (args) => args.map(a => {
      if (typeof a === 'object' && a !== null) {
        try { return JSON.stringify(a, null, 2); } catch { return String(a); }
      }
      return String(a);
    }).join(' ');

    console.log   = (...a) => logs.push({ t: 'log', m: fmt(a) });
    console.warn  = (...a) => logs.push({ t: 'warn', m: '⚠️ ' + fmt(a) });
    console.error = (...a) => logs.push({ t: 'error', m: '❌ ' + fmt(a) });
    console.info  = (...a) => logs.push({ t: 'info', m: 'ℹ️ ' + fmt(a) });

    try {
      const result = new Function(code)();
      logs.forEach(log => {
        const cls = { log:'out-log', warn:'out-warn', error:'out-error', info:'out-info' }[log.t] || 'out-log';
        const line = document.createElement('span');
        line.className = `out-line ${cls}`;
        line.textContent = log.m;
        output.appendChild(line);
        output.appendChild(document.createElement('br'));
      });
      if (result !== undefined) {
        const line = document.createElement('span');
        line.className = 'out-line out-result';
        line.textContent = '⟵ ' + (typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result));
        output.appendChild(line);
      }
      if (logs.length === 0 && result === undefined) {
        const line = document.createElement('span');
        line.className = 'out-line out-info';
        line.textContent = '✅ কোড সফলভাবে চলেছে (কোনো output নেই)';
        output.appendChild(line);
      }
    } catch (e) {
      const line = document.createElement('span');
      line.className = 'out-line out-error';
      line.textContent = '❌ ' + e.name + ': ' + e.message;
      output.appendChild(line);
    } finally {
      console.log = origLog;
      console.warn = origWarn;
      console.error = origError;
      console.info = origInfo;
    }
  },

  clearEditor() {
    document.getElementById('codeEditor').value = '';
    document.getElementById('lineNumbers').textContent = '1';
  },

  clearOutput() {
    document.getElementById('outputArea').innerHTML = `<div class="output-welcome"><span class="out-icon">🟡</span><p>আউটপুট এখানে দেখাবে।</p></div>`;
  },

  // ---- REFERENCE ----
  showRef(cat) {
    document.querySelectorAll('.ref-tab').forEach(t => t.classList.toggle('active', t.getAttribute('onclick').includes(`'${cat}'`)));
    const data = REFERENCE[cat] || [];
    document.getElementById('refContent').innerHTML = `<div class="ref-grid">${data.map(r => `
      <div class="ref-card">
        <h4>${r.name}</h4>
        <p class="ref-desc">${r.desc}</p>
        <pre class="ref-example">${r.ex}</pre>
      </div>`).join('')}</div>`;
  },

  // ---- CHEATSHEET ----
  renderCheatsheet() {
    const grid = document.getElementById('cheatsheetGrid');
    if (!grid) return;
    grid.innerHTML = CHEATSHEET.map(section => `
      <div class="cheat-card">
        <div class="cheat-header">${section.title}</div>
        <div class="cheat-body">
          ${section.items.map(item => `
            <div class="cheat-item">
              <span class="cheat-key">${item.key}</span>
              <span class="cheat-val">${item.val}</span>
            </div>`).join('')}
        </div>
      </div>`).join('');
  },

  // ---- NAVIGATION ----
  initNav() {
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        this.goToSection(link.dataset.section);
      });
    });
    document.getElementById('hamburger')?.addEventListener('click', () => {
      document.getElementById('sidebar').classList.toggle('open');
    });
    document.querySelector('.main-content')?.addEventListener('click', () => {
      if (window.innerWidth < 900) document.getElementById('sidebar').classList.remove('open');
    });
  },

  goToSection(id) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(id);
    if (target) target.classList.add('active');
    document.querySelectorAll('.nav-link').forEach(l => l.classList.toggle('active', l.dataset.section === id));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  // ---- SEARCH ----
  initSearch() {
    const input = document.getElementById('searchInput');
    const results = document.getElementById('searchResults');
    if (!input) return;

    input.addEventListener('input', () => {
      const q = input.value.toLowerCase().trim();
      if (!q) { results.classList.remove('open'); return; }
      const matches = CURRICULUM.filter(l => l.title.toLowerCase().includes(q) || l.content.toLowerCase().includes(q)).slice(0, 8);
      if (!matches.length) {
        results.innerHTML = '<div class="search-result-item" style="color:var(--text-muted)">কোনো ফলাফল নেই।</div>';
        results.classList.add('open');
        return;
      }
      results.innerHTML = matches.map(m => `<div class="search-result-item" onclick="jsApp.loadLesson(${m.id}); document.getElementById('searchInput').value=''; document.getElementById('searchResults').classList.remove('open');">
        <strong>${m.id}.</strong> ${m.title}
      </div>`).join('');
      results.classList.add('open');
    });
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.search-wrap')) results.classList.remove('open');
    });
  },

  // ---- THEME ----
  initTheme() {
    const btn = document.getElementById('themeToggle');
    const saved = localStorage.getItem('js_theme') || 'dark';
    document.body.className = saved + '-mode';
    btn.textContent = saved === 'dark' ? '☀️' : '🌙';
    btn.addEventListener('click', () => {
      const isDark = document.body.classList.contains('dark-mode');
      document.body.className = isDark ? 'light-mode' : 'dark-mode';
      btn.textContent = isDark ? '🌙' : '☀️';
      localStorage.setItem('js_theme', isDark ? 'light' : 'dark');
    });
  },
};

// ===================== QUIZ LOGIC =====================
const jsQuiz = {
  currentData: [],
  currentIdx: 0,
  userAnswers: [],
  timeLeft: 300,
  timerInt: null,

  startQuiz() {
    const count = parseInt(document.getElementById('quizCount').value);
    this.timeLeft = parseInt(document.getElementById('quizTime').value);
    this.currentIdx = 0;
    this.userAnswers = [];

    // Shuffle all questions and pick count
    const shuffled = [...ALL_QUIZ].sort(() => 0.5 - Math.random());
    this.currentData = shuffled.slice(0, count).map(q => {
      const correctText = q.options[q.ans];
      const shuffledOpts = [...q.options].sort(() => 0.5 - Math.random());
      return { q: q.q, options: shuffledOpts, ans: shuffledOpts.indexOf(correctText), exp: q.exp };
    });
    this.userAnswers = new Array(this.currentData.length).fill(null);

    document.getElementById('quizIntro').style.display = 'none';
    document.getElementById('quizResult').style.display = 'none';
    document.getElementById('quizPlay').style.display = 'block';

    this.startTimer();
    this.renderQuestion();
  },

  startTimer() {
    clearInterval(this.timerInt);
    const timerEl = document.getElementById('quizTimer');
    this.timerInt = setInterval(() => {
      this.timeLeft--;
      const m = Math.floor(this.timeLeft / 60).toString().padStart(2, '0');
      const s = (this.timeLeft % 60).toString().padStart(2, '0');
      timerEl.textContent = `⏱ ${m}:${s}`;
      timerEl.classList.toggle('danger', this.timeLeft <= 30);
      if (this.timeLeft <= 0) { clearInterval(this.timerInt); this.finishQuiz(); }
    }, 1000);
  },

  renderQuestion() {
    const q = this.currentData[this.currentIdx];
    const total = this.currentData.length;
    document.getElementById('quizQuestionCount').textContent = `প্রশ্ন ${this.currentIdx + 1} / ${total}`;
    document.getElementById('quizProgressFill').style.width = `${(this.currentIdx / total) * 100}%`;
    document.getElementById('quizQuestionText').textContent = q.q;

    const optLetters = ['A', 'B', 'C', 'D'];
    const container = document.getElementById('quizOptions');
    container.innerHTML = '';
    q.options.forEach((opt, idx) => {
      const div = document.createElement('div');
      div.className = 'quiz-option' + (this.userAnswers[this.currentIdx] === idx ? ' selected' : '');
      div.innerHTML = `<span class="opt-letter">${optLetters[idx]}</span><span>${opt}</span>`;
      div.onclick = () => this.selectOpt(idx);
      container.appendChild(div);
    });

    const nextBtn = document.getElementById('quizNextBtn');
    nextBtn.disabled = this.userAnswers[this.currentIdx] === null;
    nextBtn.textContent = this.currentIdx === total - 1 ? '✅ শেষ করুন' : 'পরবর্তী প্রশ্ন ➡️';
  },

  selectOpt(idx) {
    this.userAnswers[this.currentIdx] = idx;
    this.renderQuestion();
  },

  nextQuestion() {
    if (this.currentIdx < this.currentData.length - 1) {
      this.currentIdx++;
      this.renderQuestion();
    } else {
      this.finishQuiz();
    }
  },

  finishQuiz() {
    clearInterval(this.timerInt);
    document.getElementById('quizPlay').style.display = 'none';
    document.getElementById('quizResult').style.display = 'block';

    let correct = 0;
    const review = this.currentData.map((q, i) => {
      const u = this.userAnswers[i];
      const ok = u === q.ans;
      if (ok) correct++;
      return `<div class="review-item ${ok ? 'review-correct' : 'review-wrong'}">
        <p><strong>প্রশ্ন ${i + 1}:</strong> ${q.q}</p>
        <p>আপনার উত্তর: <span style="color:${ok ? 'var(--success)' : 'var(--danger)'}">${u !== null ? q.options[u] : 'উত্তর দেননি'}</span></p>
        ${!ok ? `<p>সঠিক উত্তর: <span style="color:var(--success)">${q.options[q.ans]}</span></p>` : ''}
        <div class="review-explanation">${q.exp}</div>
      </div>`;
    }).join('');

    const pct = Math.round((correct / this.currentData.length) * 100);
    document.getElementById('quizScore').textContent = pct + '%';
    const scoreCircle = document.getElementById('scoreCircle');
    scoreCircle.style.borderColor = pct >= 80 ? 'var(--success)' : pct >= 50 ? 'var(--js-yellow)' : 'var(--danger)';
    scoreCircle.style.color = pct >= 80 ? 'var(--success)' : pct >= 50 ? 'var(--js-yellow)' : 'var(--danger)';

    document.getElementById('quizMessage').textContent =
      pct >= 80 ? `অসাধারণ! ${correct}/${this.currentData.length} সঠিক। আপনি JavaScript-এ দারুণ দক্ষ! 🚀` :
      pct >= 50 ? `ভালো! ${correct}/${this.currentData.length} সঠিক। আরেকটু পড়াশোনা করলে পারফেক্ট হবে। 📖` :
      `${correct}/${this.currentData.length} সঠিক। হতাশ হবেন না, লেসনগুলো আবার দেখুন। 💪`;

    document.getElementById('quizReview').innerHTML = review;
    document.getElementById('quizProgressFill').style.width = '100%';
  },

  restartQuiz() {
    document.getElementById('quizResult').style.display = 'none';
    document.getElementById('quizIntro').style.display = 'block';
  }
};

document.addEventListener('DOMContentLoaded', () => jsApp.init());
