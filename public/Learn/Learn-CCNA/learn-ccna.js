'use strict';
// =============================================
// CCNA 200-301 BANGLA LEARNING APP
// =============================================

// ---- CURRICULUM DATA (Bengali) ----
const CURRICULUM = [
  // ===================== MODULE 1: NETWORK FUNDAMENTALS =====================
  { id: 1, module: 1, title: 'নেটওয়ার্ক কী? — পরিচিতি', content: `
<h3>🌐 নেটওয়ার্ক কী?</h3>
<p><strong>নেটওয়ার্ক</strong> হলো দুই বা তার বেশি ডিভাইসের একটি সংযোগ, যেখানে তারা একে অপরের সাথে তথ্য (data) শেয়ার করতে পারে। সহজ ভাষায়, তোমার মোবাইল, কম্পিউটার, প্রিন্টার — সবাই মিলে একটা নেটওয়ার্ক তৈরি করে যখন তারা কানেক্টেড থাকে।</p>

<h3>📌 নেটওয়ার্কের ধরন</h3>
<ul>
  <li><strong>PAN (Personal Area Network):</strong> একটি মানুষের আশেপাশের ডিভাইসগুলো — যেমন Bluetooth হেডফোন, স্মার্টওয়াচ। রেঞ্জ প্রায় ১০ মিটার।</li>
  <li><strong>LAN (Local Area Network):</strong> একটি বাড়ি বা অফিসের মধ্যে নেটওয়ার্ক। যেমন, তোমার বাড়ির WiFi। রেঞ্জ প্রায় ১ কিলোমিটার পর্যন্ত।</li>
  <li><strong>MAN (Metropolitan Area Network):</strong> একটি শহরের মধ্যে নেটওয়ার্ক। যেমন, ক্যাবল TV নেটওয়ার্ক।</li>
  <li><strong>WAN (Wide Area Network):</strong> দেশ বা সারা বিশ্বের নেটওয়ার্ক। ইন্টারনেট হলো সবচেয়ে বড় WAN।</li>
  <li><strong>WLAN (Wireless LAN):</strong> WiFi ব্যবহার করে তৈরি LAN।</li>
</ul>

<div class="note-box">💡 <strong>মনে রাখো:</strong> CCNA পরীক্ষায় LAN এবং WAN এর পার্থক্য সবচেয়ে বেশি আসে। LAN সাধারণত একটি প্রতিষ্ঠানের মালিকানাধীন, WAN বিভিন্ন প্রতিষ্ঠান মিলে তৈরি হয়।</div>

<h3>🔧 নেটওয়ার্কের উপাদান</h3>
<ul>
  <li><strong>Router:</strong> বিভিন্ন নেটওয়ার্কের মধ্যে ডেটা পাঠায়। এটি Best Path বেছে নেয়।</li>
  <li><strong>Switch:</strong> একই নেটওয়ার্কের মধ্যে ডিভাইসগুলোকে কানেক্ট করে।</li>
  <li><strong>Hub:</strong> পুরনো ডিভাইস। সব port-এ একসাথে ডেটা পাঠায়। এখন ব্যবহার হয় না।</li>
  <li><strong>Access Point (AP):</strong> Wireless সংযোগ দেয়।</li>
  <li><strong>Firewall:</strong> নেটওয়ার্ক রক্ষা করে, অননুমোদিত ট্রাফিক ব্লক করে।</li>
  <li><strong>Server:</strong> Service প্রদান করে (Web, DNS, DHCP, File)।</li>
  <li><strong>Client:</strong> Service গ্রহণ করে।</li>
</ul>

<h3>🔁 নেটওয়ার্ক টপোলজি</h3>
<ul>
  <li><strong>Bus:</strong> সব ডিভাইস একটি কেবেলে। যেকোনো একটা নষ্ট হলে সমস্যা।</li>
  <li><strong>Ring:</strong> বৃত্তাকারে সংযোগ।</li>
  <li><strong>Star (★):</strong> সব ডিভাইস একটি Switch/Hub-এর সাথে কানেক্ট। এটিই সবচেয়ে বেশি ব্যবহৃত।</li>
  <li><strong>Mesh:</strong> সব ডিভাইস সব ডিভাইসের সাথে কানেক্ট। সবচেয়ে নির্ভরযোগ্য কিন্তু ব্যয়বহুল।</li>
  <li><strong>Hybrid:</strong> একাধিক টপোলজির মিশ্রণ।</li>
</ul>

<div class="tip-box">🏆 <strong>CCNA টিপস:</strong> Enterprise নেটওয়ার্কে Star Topology সবচেয়ে বেশি ব্যবহৃত হয়।</div>
  `, lab: 'show version' },

  { id: 2, module: 1, title: 'OSI Model — ৭ লেয়ার বিস্তারিত', content: `
<h3>📦 OSI Model কী?</h3>
<p><strong>OSI (Open Systems Interconnection)</strong> Model হলো নেটওয়ার্ক কমিউনিকেশনকে ৭টি ধাপে ভাগ করার একটি কাঠামো। ISO ১৯৮৪ সালে এটি তৈরি করেছিল। মনে রাখার সহজ উপায়: <strong>"Please Do Not Throw Sausage Pizza Away"</strong></p>

<h3>📋 ৭টি লেয়ার</h3>
<ul>
  <li><strong>Layer 7 — Application (অ্যাপ্লিকেশন):</strong> ব্যবহারকারী সরাসরি এই লেয়ার ব্যবহার করে। HTTP, HTTPS, FTP, DNS, SMTP, Telnet। উদাহরণ: ব্রাউজার, ইমেইল।</li>
  <li><strong>Layer 6 — Presentation (উপস্থাপন):</strong> ডেটা ফরম্যাট করে, Encrypt করে। SSL/TLS। উদাহরণ: JPEG, MP4, ASCII।</li>
  <li><strong>Layer 5 — Session (সেশন):</strong> Connection তৈরি, রক্ষণাবেক্ষণ ও বন্ধ করে। উদাহরণ: SQL Session।</li>
  <li><strong>Layer 4 — Transport (পরিবহন):</strong> End-to-End communication। <strong>TCP</strong> (নির্ভরযোগ্য) ও <strong>UDP</strong> (দ্রুত)। Segment তৈরি করে। Port নম্বর ব্যবহার করে।</li>
  <li><strong>Layer 3 — Network (নেটওয়ার্ক):</strong> Logical Addressing (IP Address)। Routing করে। Packet তৈরি করে। ডিভাইস: <strong>Router</strong>।</li>
  <li><strong>Layer 2 — Data Link (ডেটা লিংক):</strong> Physical Addressing (MAC Address)। Frame তৈরি করে। Error Detection। ডিভাইস: <strong>Switch</strong>।</li>
  <li><strong>Layer 1 — Physical (ফিজিক্যাল):</strong> Bits (0 এবং 1) পাঠায়। Cables, Voltage, Light। ডিভাইস: <strong>Hub, Cable, NIC</strong>।</li>
</ul>

<h3>📦 ডেটার নাম (Protocol Data Unit - PDU)</h3>
<div class="codeblock">
Layer 7, 6, 5 → Data
Layer 4 (Transport) → Segment (TCP) / Datagram (UDP)
Layer 3 (Network) → Packet
Layer 2 (Data Link) → Frame
Layer 1 (Physical) → Bits
</div>

<div class="note-box">💡 <strong>Encapsulation vs Decapsulation:</strong> পাঠানোর সময় (7→1): প্রতিটি লেয়ার Header যোগ করে — এটাকে Encapsulation বলে। পাওয়ার সময় (1→7): প্রতিটি লেয়ার Header সরিয়ে নেয় — এটাকে Decapsulation বলে।</div>

<h3>🆚 TCP/IP Model বনাম OSI Model</h3>
<div class="codeblock">
OSI Model          TCP/IP Model
─────────────────────────────────
Application   ┐
Presentation  ├──→  Application
Session       ┘
Transport     ────→ Transport
Network       ────→ Internet
Data Link     ┬──→ Network Access
Physical      ┘
</div>
<p>TCP/IP Model মাত্র ৪টি লেয়ার নিয়ে গঠিত এবং বাস্তবে ইন্টারনেটে এটিই ব্যবহৃত হয়।</p>
  `, lab: '? ' },

  { id: 3, module: 1, title: 'TCP vs UDP — পার্থক্য বিস্তারিত', content: `
<h3>🔄 TCP (Transmission Control Protocol)</h3>
<p>TCP হলো <strong>নির্ভরযোগ্য</strong> Transport Protocol। এটি নিশ্চিত করে যে সব ডেটা পৌঁছেছে। ডেটা না পৌঁছালে আবার পাঠায়।</p>

<h3>TCP-এর বৈশিষ্ট্য</h3>
<ul>
  <li><strong>Connection-Oriented:</strong> ডেটা পাঠানোর আগে 3-Way Handshake করে।</li>
  <li><strong>Reliable:</strong> সব Segment পৌঁছানো নিশ্চিত করে।</li>
  <li><strong>Ordered:</strong> ডেটা সঠিক ক্রমে পৌঁছায়।</li>
  <li><strong>Flow Control:</strong> Receiver-কে overwhelm করে না।</li>
  <li><strong>Error Checking:</strong> Checksum ব্যবহার করে।</li>
</ul>

<h3>🤝 3-Way Handshake (TCP Connection)</h3>
<div class="codeblock">
Client                    Server
  │───── SYN ──────────────→│   (আমি কানেক্ট করতে চাই)
  │←─── SYN-ACK ────────────│   (ঠিক আছে, কানেক্ট করো)
  │───── ACK ──────────────→│   (ধন্যবাদ, কানেক্টেড!)
  │    [Data Transfer]       │
  │───── FIN ──────────────→│   (কানেক্শন বন্ধ করি?)
  │←─── FIN-ACK ────────────│   (হ্যাঁ, বন্ধ করো)
</div>

<h3>⚡ UDP (User Datagram Protocol)</h3>
<p>UDP হলো <strong>দ্রুত</strong> কিন্তু <strong>অনির্ভরযোগ্য</strong> Transport Protocol। কোনো Handshake নেই, কোনো নিশ্চয়তা নেই।</p>

<h3>UDP-এর বৈশিষ্ট্য</h3>
<ul>
  <li><strong>Connectionless:</strong> কোনো Connection setup নেই।</li>
  <li><strong>Unreliable:</strong> ডেটা হারিয়ে গেলে পুনরায় পাঠায় না।</li>
  <li><strong>Fast:</strong> TCP-এর চেয়ে অনেক দ্রুত।</li>
  <li><strong>Low Overhead:</strong> Header অনেক ছোট।</li>
</ul>

<h3>🔢 গুরুত্বপূর্ণ Port নম্বর</h3>
<div class="codeblock">
Protocol    Port    TCP/UDP    ব্যবহার
────────────────────────────────────────
FTP         20,21   TCP        ফাইল ট্রান্সফার
SSH         22      TCP        Secure Remote Access
Telnet      23      TCP        Remote Access (Insecure)
SMTP        25      TCP        ইমেইল পাঠানো
DNS         53      TCP/UDP    Domain Name Resolution
DHCP        67,68   UDP        IP Address দেওয়া
TFTP        69      UDP        Simple File Transfer
HTTP        80      TCP        ওয়েবসাইট
POP3        110     TCP        ইমেইল রিসিভ
IMAP        143     TCP        ইমেইল রিসিভ
SNMP        161     UDP        নেটওয়ার্ক Monitoring
HTTPS       443     TCP        Secure ওয়েবসাইট
</div>

<div class="warning-box">⚠️ <strong>পরীক্ষায় সতর্ক থাকো:</strong> DNS UDP/53 ব্যবহার করে সাধারণ query-র জন্য, কিন্তু বড় response (Zone Transfer)-এর জন্য TCP/53 ব্যবহার করে।</div>
  `, lab: 'show ip interface brief' },

  { id: 4, module: 1, title: 'IP Addressing — IPv4 সম্পূর্ণ', content: `
<h3>🔢 IPv4 Address কী?</h3>
<p>IPv4 হলো ৩২ বিটের একটি ঠিকানা যা প্রতিটি নেটওয়ার্ক ডিভাইসকে একটি অনন্য পরিচয় দেয়। এটি ৪টি Octet-এ লেখা হয়: <strong>192.168.1.1</strong></p>

<h3>📊 IP Address-এর শ্রেণী (Classes)</h3>
<div class="codeblock">
Class  Range                   Default Mask      ব্যবহার
─────────────────────────────────────────────────────────
A      1.0.0.0 - 126.255.255.255   /8 (255.0.0.0)     বড় নেটওয়ার্ক
B      128.0.0.0 - 191.255.255.255  /16 (255.255.0.0)   মাঝারি নেটওয়ার্ক
C      192.0.0.0 - 223.255.255.255  /24 (255.255.255.0) ছোট নেটওয়ার্ক
D      224.0.0.0 - 239.255.255.255  —                  Multicast
E      240.0.0.0 - 255.255.255.255  —                  Reserved
</div>

<h3>🏠 Private IP Ranges (বাড়ি/অফিসে ব্যবহৃত)</h3>
<div class="codeblock">
Class A: 10.0.0.0 - 10.255.255.255       (10.0.0.0/8)
Class B: 172.16.0.0 - 172.31.255.255     (172.16.0.0/12)
Class C: 192.168.0.0 - 192.168.255.255   (192.168.0.0/16)
</div>

<div class="note-box">💡 Private IP গুলো ইন্টারনেটে রাউট হয় না। NAT ব্যবহার করে এগুলোকে Public IP-তে রূপান্তরিত করতে হয়।</div>

<h3>🔢 Subnet Mask ও CIDR Notation</h3>
<p>Subnet Mask নেটওয়ার্ক অংশ ও হোস্ট অংশ আলাদা করে।</p>
<div class="codeblock">
CIDR   Binary Mask              Dotted Decimal      Hosts
/8     11111111.00000000...     255.0.0.0           16,777,214
/16    11111111.11111111.0.0    255.255.0.0         65,534
/24    11111111.11111111.11111111.0  255.255.255.0  254
/25    ...                      255.255.255.128     126
/26    ...                      255.255.255.192     62
/27    ...                      255.255.255.224     30
/28    ...                      255.255.255.240     14
/29    ...                      255.255.255.248     6
/30    ...                      255.255.255.252     2
</div>

<h3>🧮 Subnetting হিসাব</h3>
<p>একটি /24 নেটওয়ার্ক (192.168.1.0/24) ধরো:</p>
<ul>
  <li><strong>Network Address:</strong> 192.168.1.0 (প্রথম ঠিকানা — কখনো Host-এ দেওয়া যায় না)</li>
  <li><strong>Broadcast Address:</strong> 192.168.1.255 (শেষ ঠিকানা — কখনো Host-এ দেওয়া যায় না)</li>
  <li><strong>Usable Hosts:</strong> 192.168.1.1 থেকে 192.168.1.254 (মোট ২৫৪টি)</li>
</ul>

<div class="tip-box">🏆 সূত্র: Usable Hosts = 2^(Host bits) - 2। /24-এ Host bits = 8, তাই 2^8 - 2 = 254</div>
  `, lab: 'show ip route' },

  { id: 5, module: 1, title: 'Subnetting — বিস্তারিত অনুশীলন', content: `
<h3>🧮 Subnetting কী এবং কেন?</h3>
<p>Subnetting মানে একটি বড় নেটওয়ার্ককে ছোট ছোট নেটওয়ার্কে ভাগ করা। এতে করে: ১) ব্রডকাস্ট ট্রাফিক কমে, ২) নিরাপত্তা বাড়ে, ৩) IP Address সাশ্রয় হয়।</p>

<h3>📝 Subnetting সমাধানের ধাপ</h3>
<p><strong>উদাহরণ:</strong> 192.168.10.0/25 নেটওয়ার্কের বিস্তারিত বের করো।</p>
<ul>
  <li><strong>ধাপ ১ — Subnet Mask বের করো:</strong> /25 = 255.255.255.128</li>
  <li><strong>ধাপ ২ — Block Size:</strong> 256 - 128 = 128</li>
  <li><strong>ধাপ ৩ — Network Address:</strong> 192.168.10.0</li>
  <li><strong>ধাপ ৪ — First Host:</strong> 192.168.10.1</li>
  <li><strong>ধাপ ৫ — Last Host:</strong> 192.168.10.126</li>
  <li><strong>ধাপ ৬ — Broadcast:</strong> 192.168.10.127</li>
  <li><strong>ধাপ ৭ — Usable Hosts:</strong> 2^7 - 2 = 126</li>
</ul>

<h3>📋 সব Subnet বের করার অনুশীলন</h3>
<p>192.168.1.0/26 নেটওয়ার্ককে ভাগ করলে কয়টি Subnet হবে এবং কী কী?</p>
<div class="codeblock">
/26 = 255.255.255.192, Block Size = 64

Subnet 0: 192.168.1.0/26   → Host: .1-.62,   Broadcast: .63
Subnet 1: 192.168.1.64/26  → Host: .65-.126, Broadcast: .127
Subnet 2: 192.168.1.128/26 → Host: .129-.190, Broadcast: .191
Subnet 3: 192.168.1.192/26 → Host: .193-.254, Broadcast: .255

মোট Subnet: 4 (2^2 = 4, কারণ 2 টি বিট ধার করা হয়েছে)
প্রতি Subnet-এ Host: 62
</div>

<h3>🧩 VLSM (Variable Length Subnet Masking)</h3>
<p>VLSM ব্যবহার করে বিভিন্ন আকারের Subnet তৈরি করা যায়, যা IP Address বাঁচায়।</p>
<div class="note-box">💡 মনে রাখো: বড় থেকে ছোট ক্রমে VLSM বরাদ্দ করো।</div>
  `, lab: 'show ip route' },

  { id: 6, module: 1, title: 'Ethernet ও Cabling — LAN মিডিয়া', content: `
<h3>🔌 Ethernet কী?</h3>
<p>Ethernet হলো সবচেয়ে জনপ্রিয় LAN Technology। IEEE 802.3 Standard অনুসরণ করে।</p>

<h3>📋 Ethernet Speeds</h3>
<div class="codeblock">
Standard        Speed      Cable Type
──────────────────────────────────────
10BASE-T        10 Mbps    Cat3/Cat5
100BASE-TX      100 Mbps   Cat5/Cat5e (Fast Ethernet)
1000BASE-T      1 Gbps     Cat5e/Cat6 (Gigabit Ethernet)
10GBASE-T       10 Gbps    Cat6a/Cat7
</div>

<h3>🔌 Copper Cabling ধরন</h3>
<ul>
  <li><strong>UTP (Unshielded Twisted Pair):</strong> সবচেয়ে সস্তা ও বেশি ব্যবহৃত। দূরত্ব সীমা: 100 মিটার।</li>
  <li><strong>STP (Shielded Twisted Pair):</strong> EMI interference কম। ব্যয়বহুল।</li>
  <li><strong>Coaxial:</strong> পুরনো, ক্যাবল TV-তে ব্যবহৃত।</li>
</ul>

<h3>📡 Fiber Optic Cabling</h3>
<ul>
  <li><strong>Single-Mode Fiber (SMF):</strong> দীর্ঘ দূরত্বের জন্য (কিলোমিটার)। Yellow রঙের কেবল।</li>
  <li><strong>Multi-Mode Fiber (MMF):</strong> ছোট দূরত্বের জন্য (কয়েকশো মিটার)। Orange/Aqua রঙের কেবল।</li>
</ul>

<h3>🔗 Cable Types (Connection অনুযায়ী)</h3>
<div class="codeblock">
Straight-Through Cable:
  Router ←→ Switch    ✓
  PC ←→ Switch        ✓
  Switch ←→ Hub       ✓

Crossover Cable:
  Switch ←→ Switch    ✓
  PC ←→ PC            ✓
  Router ←→ Router    ✓

Rollover (Console) Cable:
  PC ←→ Router/Switch Console Port  ✓
</div>

<div class="tip-box">🏆 আধুনিক ডিভাইসে Auto-MDIX থাকায় Straight বা Crossover যেকোনো Cable ব্যবহার করা যায়।</div>
  `, lab: 'show interfaces' },

  { id: 7, module: 1, title: 'IPv6 — পরিচিতি ও Configuration', content: `
<h3>🌐 IPv6 কেন দরকার?</h3>
<p>IPv4-এ মাত্র ৪.৩ বিলিয়ন ঠিকানা আছে। কিন্তু ইন্টারনেটে কোটি কোটি ডিভাইস! তাই IPv6 তৈরি হয়েছে যা 128-bit ঠিকানা ব্যবহার করে — প্রায় অসীম সংখ্যক ঠিকানা।</p>

<h3>📋 IPv6 Address Format</h3>
<div class="codeblock">
সম্পূর্ণ:  2001:0DB8:0000:0001:0000:0000:0000:0001
সংক্ষিপ্ত: 2001:DB8:0:1::1

নিয়ম:
1. প্রতিটি Group-এর শুরুতে '0' বাদ দেওয়া যায়
   0001 → 1
2. একটানা শুধু '0'-এর Group কে '::' দিয়ে সংক্ষিপ্ত করা যায়
   কিন্তু '::' একবারের বেশি ব্যবহার করা যাবে না!
</div>

<h3>🔢 IPv6 Address Types</h3>
<ul>
  <li><strong>Global Unicast:</strong> Public IP-এর মতো। 2000::/3 থেকে শুরু।</li>
  <li><strong>Link-Local:</strong> একই Link-এ যোগাযোগের জন্য। FE80::/10 থেকে শুরু। Mandatory।</li>
  <li><strong>Unique Local:</strong> Private IP-এর মতো। FC00::/7 থেকে শুরু।</li>
  <li><strong>Multicast:</strong> FF00::/8 থেকে শুরু।</li>
  <li><strong>Loopback:</strong> ::1 (IPv4-এর 127.0.0.1 এর মতো)।</li>
</ul>

<h3>⚙️ IPv6 Configuration (Cisco)</h3>
<div class="codeblock">
<span class="prompt">Router(config)#</span> <span class="cmd">ipv6 unicast-routing</span>
<span class="prompt">Router(config)#</span> <span class="cmd">interface g0/0</span>
<span class="prompt">Router(config-if)#</span> <span class="cmd">ipv6 address 2001:DB8:1:1::1/64</span>
<span class="prompt">Router(config-if)#</span> <span class="cmd">ipv6 address fe80::1 link-local</span>
<span class="prompt">Router(config-if)#</span> <span class="cmd">no shutdown</span>
</div>
  `, lab: 'show ipv6 interface brief' },

  // ===================== MODULE 2: NETWORK ACCESS =====================
  { id: 8, module: 2, title: 'Switch Basics — কীভাবে Switch কাজ করে', content: `
<h3>🔀 Switch কীভাবে কাজ করে?</h3>
<p>Switch Layer 2 ডিভাইস। এটি MAC Address ব্যবহার করে Frame পাঠায়। Switch-এর মধ্যে একটি টেবিল থাকে যাকে বলে <strong>MAC Address Table</strong> (CAM Table)।</p>

<h3>📖 Switch-এর ৩টি প্রধান ক্রিয়া</h3>
<ul>
  <li><strong>১. Learning (শেখা):</strong> Frame পেলে Source MAC Address টেবিলে সেভ করে।</li>
  <li><strong>২. Flooding (বন্যা):</strong> Destination MAC যদি টেবিলে না থাকে, সব port-এ পাঠায় (Source port বাদে)।</li>
  <li><strong>৩. Forwarding (পাঠানো):</strong> Destination MAC টেবিলে থাকলে শুধু সেই port-এ পাঠায়।</li>
</ul>

<div class="codeblock">
<span class="prompt">Switch#</span> <span class="cmd">show mac address-table</span>
<span class="comment">-- MAC Address টেবিল দেখতে</span>
<span class="prompt">Switch#</span> <span class="cmd">clear mac address-table dynamic</span>
<span class="comment">-- MAC Table মুছতে</span>
</div>

<h3>🏃 Switching Methods</h3>
<ul>
  <li><strong>Store-and-Forward:</strong> পুরো Frame রিসিভ করে, Error চেক করে, তারপর পাঠায়। সবচেয়ে নির্ভরযোগ্য। দেরি বেশি।</li>
  <li><strong>Cut-Through:</strong> শুধু Destination MAC পড়েই পাঠিয়ে দেয়। দ্রুত কিন্তু Error চেক নেই।</li>
  <li><strong>Fragment-Free:</strong> প্রথম 64 bytes পড়ে পাঠায়। মাঝামাঝি পদ্ধতি।</li>
</ul>

<h3>💡 Collision Domain vs Broadcast Domain</h3>
<ul>
  <li><strong>Hub:</strong> সব Port একটি Collision Domain। এক Broadcast Domain।</li>
  <li><strong>Switch:</strong> প্রতিটি Port আলাদা Collision Domain। কিন্তু সব Port একটি Broadcast Domain।</li>
  <li><strong>Router:</strong> প্রতিটি Interface আলাদা Collision Domain এবং আলাদা Broadcast Domain।</li>
</ul>
  `, lab: 'show mac address-table' },

  { id: 9, module: 2, title: 'VLAN — Virtual LAN সম্পূর্ণ', content: `
<h3>🏢 VLAN কী?</h3>
<p>VLAN (Virtual Local Area Network) দিয়ে একটি Physical Switch-এ একাধিক আলাদা আলাদা লজিক্যাল নেটওয়ার্ক তৈরি করা যায়। যেমন, একই Switch-এ IT Department ও HR Department আলাদা রাখা।</p>

<h3>✅ VLAN-এর সুবিধা</h3>
<ul>
  <li>Broadcast Domain ছোট হয় — নেটওয়ার্ক দ্রুত হয়।</li>
  <li>নিরাপত্তা বাড়ে — আলাদা VLAN আলাদা ব্রডকাস্ট পাবে না।</li>
  <li>IP Address পরিকল্পনা সহজ হয়।</li>
  <li>ফিজিক্যাল পরিবর্তন ছাড়াই লজিক্যাল পরিবর্তন সম্ভব।</li>
</ul>

<h3>⚙️ VLAN Configuration</h3>
<div class="codeblock">
<span class="comment">-- VLAN তৈরি করা</span>
<span class="prompt">Switch(config)#</span> <span class="cmd">vlan 10</span>
<span class="prompt">Switch(config-vlan)#</span> <span class="cmd">name HR_Department</span>

<span class="prompt">Switch(config)#</span> <span class="cmd">vlan 20</span>
<span class="prompt">Switch(config-vlan)#</span> <span class="cmd">name IT_Department</span>

<span class="comment">-- Port কে Access Mode এ রাখা (শুধু একটি VLAN)</span>
<span class="prompt">Switch(config)#</span> <span class="cmd">interface f0/1</span>
<span class="prompt">Switch(config-if)#</span> <span class="cmd">switchport mode access</span>
<span class="prompt">Switch(config-if)#</span> <span class="cmd">switchport access vlan 10</span>

<span class="comment">-- Trunk Port (একাধিক VLAN বহন করে)</span>
<span class="prompt">Switch(config)#</span> <span class="cmd">interface g0/1</span>
<span class="prompt">Switch(config-if)#</span> <span class="cmd">switchport mode trunk</span>
<span class="prompt">Switch(config-if)#</span> <span class="cmd">switchport trunk encapsulation dot1q</span>

<span class="comment">-- দেখা</span>
<span class="prompt">Switch#</span> <span class="cmd">show vlan brief</span>
<span class="prompt">Switch#</span> <span class="cmd">show interfaces trunk</span>
</div>

<h3>🔗 VLAN Trunking Protocol (VTP)</h3>
<p>VTP দিয়ে একটি Switch (VTP Server) থেকে সব Switch-এ স্বয়ংক্রিয়ভাবে VLAN তথ্য পাঠানো যায়।</p>
<ul>
  <li><strong>VTP Server:</strong> VLAN তৈরি, মুছতে ও পরিবর্তন করতে পারে।</li>
  <li><strong>VTP Client:</strong> Server থেকে VLAN তথ্য পায়। নিজে পরিবর্তন করতে পারে না।</li>
  <li><strong>VTP Transparent:</strong> VTP তথ্য পাঠিয়ে দেয়, কিন্তু নিজে প্রয়োগ করে না।</li>
</ul>

<div class="warning-box">⚠️ <strong>সতর্কতা:</strong> VTP একটি বিপজ্জনক Protocol। নতুন Switch যোগ করার সময় ভুল হলে সব VLAN মুছে যেতে পারে!</div>
  `, lab: 'vlan 10' },

  { id: 10, module: 2, title: 'STP — Spanning Tree Protocol', content: `
<h3>🌲 STP কী এবং কেন দরকার?</h3>
<p>নেটওয়ার্কে Redundancy (একাধিক পথ) রাখা ভালো কিন্তু এতে <strong>Switching Loop</strong> হয়। Loop হলে Broadcast Storm তৈরি হয়ে পুরো নেটওয়ার্ক বন্ধ হয়ে যায়। STP এই Loop বন্ধ করে।</p>

<h3>⚙️ STP কীভাবে কাজ করে</h3>
<ul>
  <li><strong>ধাপ ১ — Root Bridge নির্বাচন:</strong> সর্বনিম্ন Bridge ID (Priority + MAC Address) সহ Switch-টি Root Bridge হয়।</li>
  <li><strong>ধাপ ২ — Root Port নির্বাচন:</strong> প্রতিটি Non-Root Switch-এ Root Bridge-এর দিকে যাওয়ার সেরা Port হলো Root Port।</li>
  <li><strong>ধাপ ৩ — Designated Port নির্বাচন:</strong> প্রতিটি Segment-এ একটি Designated Port থাকে।</li>
  <li><strong>ধাপ ৪ — Blocked Port:</strong> বাকি Port গুলো Block হয় (ডেটা পাঠায় না, শুধু BPDU শোনে)।</li>
</ul>

<h3>📋 STP Port States</h3>
<div class="codeblock">
State        Action              সময়
────────────────────────────────────────
Blocking     শুধু BPDU শোনে      20 সেকেন্ড (Max Age)
Listening    BPDU পাঠায়/শোনে    15 সেকেন্ড
Learning     MAC শেখে           15 সেকেন্ড
Forwarding   ডেটা পাঠায়         —
Disabled     নিষ্ক্রিয়           —

মোট Convergence Time: 50 সেকেন্ড!
</div>

<h3>⚡ RSTP (Rapid STP — IEEE 802.1w)</h3>
<p>RSTP আধুনিক STP। Convergence মাত্র <strong>1-2 সেকেন্ডে</strong> হয়। Cisco-র PVST+ ও Rapid PVST+ সবচেয়ে বেশি ব্যবহৃত।</p>

<div class="codeblock">
<span class="comment">-- Root Bridge নির্ধারণ করা</span>
<span class="prompt">Switch(config)#</span> <span class="cmd">spanning-tree vlan 1 priority 4096</span>
<span class="prompt">Switch(config)#</span> <span class="cmd">spanning-tree vlan 1 root primary</span>

<span class="comment">-- PortFast (End Device-এর Port-এ — Server, PC)</span>
<span class="prompt">Switch(config-if)#</span> <span class="cmd">spanning-tree portfast</span>

<span class="comment">-- দেখা</span>
<span class="prompt">Switch#</span> <span class="cmd">show spanning-tree</span>
</div>
  `, lab: 'show spanning-tree' },

  // ===================== MODULE 3: IP CONNECTIVITY (ROUTING) =====================
  { id: 11, module: 3, title: 'Routing Fundamentals — রাউটার কীভাবে কাজ করে', content: `
<h3>🗺️ Routing কী?</h3>
<p>Routing হলো Router-এর কাজ — বিভিন্ন নেটওয়ার্কের মধ্যে Packet-এর সেরা পথ খুঁজে বের করা। Router Layer 3 ডিভাইস এবং IP Address ব্যবহার করে।</p>

<h3>📋 Routing Table</h3>
<p>Router একটি Routing Table রাখে যেখানে বিভিন্ন নেটওয়ার্কে যাওয়ার পথ লেখা থাকে।</p>
<div class="codeblock">
<span class="prompt">Router#</span> <span class="cmd">show ip route</span>

Codes: C - connected, S - static, R - RIP, O - OSPF
       B - BGP, * - candidate default

Gateway of last resort is 192.168.1.1 to network 0.0.0.0

C    192.168.1.0/24 is directly connected, GigabitEthernet0/0
S    10.0.0.0/8 [1/0] via 192.168.1.254
O    172.16.0.0/16 [110/2] via 192.168.1.254
</div>

<h3>🔢 Administrative Distance (AD)</h3>
<p>একাধিক Routing Protocol থেকে একই নেটওয়ার্কের Route পেলে, AD কম হলে সেটি বেছে নেওয়া হয়।</p>
<div class="codeblock">
Source              AD       বিশ্বাসযোগ্যতা
──────────────────────────────────────────
Connected           0        সর্বোচ্চ
Static              1
EIGRP (Summary)     5
External BGP        20
EIGRP (Internal)    90
OSPF                110
IS-IS               115
RIP                 120
External EIGRP      170
Internal BGP        200
Unknown             255       (কখনো ব্যবহার হয় না)
</div>

<h3>⚖️ Metric কী?</h3>
<p>একই Protocol থেকে একই নেটওয়ার্কে একাধিক Route পেলে, Metric দিয়ে সেরাটি বেছে নেওয়া হয়।</p>
<ul>
  <li><strong>RIP:</strong> Hop Count (রাউটারের সংখ্যা)</li>
  <li><strong>OSPF:</strong> Cost (Bandwidth-এর উপর ভিত্তি করে)</li>
  <li><strong>EIGRP:</strong> Composite Metric (Bandwidth + Delay)</li>
</ul>
  `, lab: 'show ip route' },

  { id: 12, module: 3, title: 'Cisco Router প্রাথমিক Configuration', content: `
<h3>⚙️ Router প্রাথমিক Setup</h3>

<div class="codeblock">
<span class="comment">═══ ধাপ ১: Password সেট করা ═══</span>
<span class="prompt">Router></span> <span class="cmd">enable</span>
<span class="prompt">Router#</span> <span class="cmd">configure terminal</span>

<span class="comment">-- Hostname পরিবর্তন</span>
<span class="prompt">Router(config)#</span> <span class="cmd">hostname R1</span>

<span class="comment">-- Console Password</span>
<span class="prompt">R1(config)#</span> <span class="cmd">line console 0</span>
<span class="prompt">R1(config-line)#</span> <span class="cmd">password cisco123</span>
<span class="prompt">R1(config-line)#</span> <span class="cmd">login</span>

<span class="comment">-- Enable Password (Privileged Exec)</span>
<span class="prompt">R1(config)#</span> <span class="cmd">enable secret StrongPass123</span>

<span class="comment">-- VTY (Telnet/SSH) Password</span>
<span class="prompt">R1(config)#</span> <span class="cmd">line vty 0 4</span>
<span class="prompt">R1(config-line)#</span> <span class="cmd">password vtypass</span>
<span class="prompt">R1(config-line)#</span> <span class="cmd">login</span>
<span class="prompt">R1(config-line)#</span> <span class="cmd">transport input ssh telnet</span>

<span class="comment">═══ ধাপ ২: Interface Configuration ═══</span>
<span class="prompt">R1(config)#</span> <span class="cmd">interface gigabitethernet 0/0</span>
<span class="prompt">R1(config-if)#</span> <span class="cmd">ip address 192.168.1.1 255.255.255.0</span>
<span class="prompt">R1(config-if)#</span> <span class="cmd">description LAN Interface</span>
<span class="prompt">R1(config-if)#</span> <span class="cmd">no shutdown</span>

<span class="comment">═══ ধাপ ৩: Config সেভ করা ═══</span>
<span class="prompt">R1#</span> <span class="cmd">write memory</span>  <span class="comment">বা copy running-config startup-config</span>
</div>

<h3>🔍 Important Show Commands</h3>
<div class="codeblock">
<span class="prompt">R1#</span> <span class="cmd">show version</span>            <span class="comment">-- IOS Version ও Hardware তথ্য</span>
<span class="prompt">R1#</span> <span class="cmd">show running-config</span>     <span class="comment">-- চলমান Configuration</span>
<span class="prompt">R1#</span> <span class="cmd">show startup-config</span>     <span class="comment">-- সেভ করা Configuration</span>
<span class="prompt">R1#</span> <span class="cmd">show ip interface brief</span> <span class="comment">-- সব Interface সংক্ষেপে</span>
<span class="prompt">R1#</span> <span class="cmd">show interfaces g0/0</span>    <span class="comment">-- নির্দিষ্ট Interface বিস্তারিত</span>
</div>
  `, lab: 'hostname R1' },

  { id: 13, module: 3, title: 'Static Routing — ম্যানুয়াল Route', content: `
<h3>📍 Static Route কী?</h3>
<p>Static Route হলো Administrator নিজে হাতে লেখা Route। এটি স্বয়ংক্রিয়ভাবে আপডেট হয় না।</p>

<h3>✅ Static Route সুবিধা ও অসুবিধা</h3>
<ul>
  <li>✅ নিরাপদ, CPU ও Bandwidth সাশ্রয়ী।</li>
  <li>✅ ছোট নেটওয়ার্কে সহজ।</li>
  <li>❌ বড় নেটওয়ার্কে ম্যানেজ করা কঠিন।</li>
  <li>❌ নেটওয়ার্ক পরিবর্তন হলে ম্যানুয়ালি আপডেট করতে হয়।</li>
</ul>

<h3>⚙️ Static Route Configuration</h3>
<div class="codeblock">
<span class="comment">-- সিনট্যাক্স: ip route [destination-network] [mask] [next-hop | exit-interface]</span>

<span class="comment">-- Next-Hop IP দিয়ে</span>
<span class="prompt">R1(config)#</span> <span class="cmd">ip route 10.0.0.0 255.0.0.0 192.168.1.254</span>

<span class="comment">-- Exit Interface দিয়ে (Serial Link-এ)</span>
<span class="prompt">R1(config)#</span> <span class="cmd">ip route 172.16.0.0 255.255.0.0 s0/0/0</span>

<span class="comment">-- Default Route (সব ট্রাফিক এখানে যাবে যদি Route না পাওয়া যায়)</span>
<span class="prompt">R1(config)#</span> <span class="cmd">ip route 0.0.0.0 0.0.0.0 192.168.1.1</span>

<span class="comment">-- Floating Static Route (Backup Route — বেশি AD)</span>
<span class="prompt">R1(config)#</span> <span class="cmd">ip route 10.0.0.0 255.0.0.0 192.168.2.1 5</span>
</div>

<h3>🔍 Verification</h3>
<div class="codeblock">
<span class="prompt">R1#</span> <span class="cmd">show ip route static</span>
<span class="prompt">R1#</span> <span class="cmd">ping 10.0.0.1</span>
<span class="prompt">R1#</span> <span class="cmd">traceroute 10.0.0.1</span>
</div>
  `, lab: 'ip route 0.0.0.0 0.0.0.0 192.168.1.1' },

  { id: 14, module: 3, title: 'OSPF — Open Shortest Path First (A-Z)', content: `
<h3>🗺️ OSPF কী?</h3>
<p>OSPF (Open Shortest Path First) হলো একটি Link-State Routing Protocol। এটি Dijkstra's Algorithm ব্যবহার করে সেরা পথ বের করে। CCNA-র জন্য OSPFv2 (IPv4) জানতে হবে।</p>

<h3>📋 OSPF মূল ধারণা</h3>
<ul>
  <li><strong>Area:</strong> OSPF নেটওয়ার্ককে Area-তে ভাগ করে। Area 0 হলো Backbone Area।</li>
  <li><strong>Router ID:</strong> OSPF-এ প্রতিটি Router-এর একটি অনন্য ID থাকে।</li>
  <li><strong>DR/BDR:</strong> Broadcast নেটওয়ার্কে Designated Router ও Backup DR নির্বাচন হয়।</li>
  <li><strong>Cost (Metric):</strong> Cost = Reference Bandwidth / Interface Bandwidth। কম Cost = সেরা পথ।</li>
  <li><strong>LSA:</strong> Link State Advertisement — Router নেটওয়ার্ক তথ্য শেয়ার করে।</li>
</ul>

<h3>⚙️ OSPF Configuration</h3>
<div class="codeblock">
<span class="comment">-- OSPF চালু করা</span>
<span class="prompt">R1(config)#</span> <span class="cmd">router ospf 1</span>

<span class="comment">-- Router ID সেট করা (ঐচ্ছিক কিন্তু ভালো অভ্যাস)</span>
<span class="prompt">R1(config-router)#</span> <span class="cmd">router-id 1.1.1.1</span>

<span class="comment">-- Network সংযোগ করা</span>
<span class="prompt">R1(config-router)#</span> <span class="cmd">network 192.168.1.0 0.0.0.255 area 0</span>
<span class="prompt">R1(config-router)#</span> <span class="cmd">network 10.0.0.0 0.255.255.255 area 0</span>

<span class="comment">-- Passive Interface (এই port-এ OSPF Hello পাঠাবে না)</span>
<span class="prompt">R1(config-router)#</span> <span class="cmd">passive-interface g0/0</span>

<span class="comment">-- Default Route OSPF-এ প্রচার করা</span>
<span class="prompt">R1(config-router)#</span> <span class="cmd">default-information originate</span>

<span class="comment">-- Verification</span>
<span class="prompt">R1#</span> <span class="cmd">show ip ospf neighbor</span>
<span class="prompt">R1#</span> <span class="cmd">show ip ospf database</span>
<span class="prompt">R1#</span> <span class="cmd">show ip route ospf</span>
<span class="prompt">R1#</span> <span class="cmd">show ip ospf interface g0/0</span>
</div>

<div class="note-box">💡 OSPF-এর Wildcard Mask হলো Subnet Mask-এর উল্টো। 255.255.255.0 → 0.0.0.255</div>
  `, lab: 'router ospf 1' },

  { id: 15, module: 3, title: 'EIGRP — Cisco-র নিজস্ব Protocol', content: `
<h3>⚡ EIGRP কী?</h3>
<p>EIGRP (Enhanced Interior Gateway Routing Protocol) হলো Cisco-র নিজস্ব Routing Protocol। এটি Distance Vector ও Link State Protocol-এর সমন্বয় — তাই একে "Hybrid Protocol" বলা হয়। EIGRP খুব দ্রুত Converge করে।</p>

<h3>📋 EIGRP মূল ধারণা</h3>
<ul>
  <li><strong>AD:</strong> Internal = 90, External = 170, Summary = 5</li>
  <li><strong>Metric:</strong> Bandwidth + Delay (এবং আরও কয়েকটি)।</li>
  <li><strong>Successor:</strong> সেরা পথ।</li>
  <li><strong>Feasible Successor:</strong> Backup পথ। Instant Failover করে।</li>
  <li><strong>DUAL Algorithm:</strong> Loop-Free পথ নিশ্চিত করে।</li>
</ul>

<h3>⚙️ EIGRP Configuration</h3>
<div class="codeblock">
<span class="comment">-- EIGRP চালু করা (AS Number সব Router-এ একই হতে হবে)</span>
<span class="prompt">R1(config)#</span> <span class="cmd">router eigrp 100</span>
<span class="prompt">R1(config-router)#</span> <span class="cmd">network 192.168.1.0 0.0.0.255</span>
<span class="prompt">R1(config-router)#</span> <span class="cmd">network 10.0.0.0 0.255.255.255</span>
<span class="prompt">R1(config-router)#</span> <span class="cmd">no auto-summary</span>

<span class="comment">-- Passive Interface</span>
<span class="prompt">R1(config-router)#</span> <span class="cmd">passive-interface g0/0</span>

<span class="comment">-- Verification</span>
<span class="prompt">R1#</span> <span class="cmd">show ip eigrp neighbors</span>
<span class="prompt">R1#</span> <span class="cmd">show ip eigrp topology</span>
<span class="prompt">R1#</span> <span class="cmd">show ip route eigrp</span>
</div>
  `, lab: 'router eigrp 100' },

  // ===================== MODULE 4: IP SERVICES =====================
  { id: 16, module: 4, title: 'DHCP — স্বয়ংক্রিয় IP Address', content: `
<h3>🔄 DHCP কী?</h3>
<p>DHCP (Dynamic Host Configuration Protocol) স্বয়ংক্রিয়ভাবে নেটওয়ার্কের ডিভাইসগুলোকে IP Address, Subnet Mask, Default Gateway এবং DNS Server এর তথ্য দেয়।</p>

<h3>🤝 DHCP DORA Process</h3>
<div class="codeblock">
Client                DHCP Server
  │─── DISCOVER ──────────→│   (ব্রডকাস্ট: কোনো DHCP আছে?)
  │←── OFFER ─────────────│   (আমি আছি, এই IP নেবে?)
  │─── REQUEST ───────────→│   (হ্যাঁ, ওই IP চাই।)
  │←── ACKNOWLEDGE ────────│   (নাও, তোমার IP: 192.168.1.10)
</div>

<h3>⚙️ DHCP Server Configuration (Cisco Router)</h3>
<div class="codeblock">
<span class="comment">-- DHCP Pool তৈরি</span>
<span class="prompt">R1(config)#</span> <span class="cmd">ip dhcp pool LAN_POOL</span>
<span class="prompt">R1(dhcp-config)#</span> <span class="cmd">network 192.168.1.0 255.255.255.0</span>
<span class="prompt">R1(dhcp-config)#</span> <span class="cmd">default-router 192.168.1.1</span>
<span class="prompt">R1(dhcp-config)#</span> <span class="cmd">dns-server 8.8.8.8 8.8.4.4</span>
<span class="prompt">R1(dhcp-config)#</span> <span class="cmd">lease 7</span>

<span class="comment">-- বিশেষ IP বাদ দেওয়া (Reserved)</span>
<span class="prompt">R1(config)#</span> <span class="cmd">ip dhcp excluded-address 192.168.1.1 192.168.1.10</span>

<span class="comment">-- Verification</span>
<span class="prompt">R1#</span> <span class="cmd">show ip dhcp pool</span>
<span class="prompt">R1#</span> <span class="cmd">show ip dhcp binding</span>
</div>

<h3>🔀 DHCP Relay Agent</h3>
<p>ভিন্ন নেটওয়ার্কে DHCP Server থাকলে, Router-এ ip helper-address দিয়ে DHCP Broadcast-কে Unicast-এ রূপান্তরিত করতে হয়।</p>
<div class="codeblock">
<span class="prompt">R1(config-if)#</span> <span class="cmd">ip helper-address 10.0.0.1</span>
</div>
  `, lab: 'show ip dhcp binding' },

  { id: 17, module: 4, title: 'NAT — Private IP কে Public IP-তে রূপান্তর', content: `
<h3>🌐 NAT কী?</h3>
<p>NAT (Network Address Translation) Private IP Address-কে Public IP Address-এ রূপান্তরিত করে, যাতে ইন্টারনেটে যোগাযোগ করা যায়।</p>

<h3>📋 NAT-এর তিনটি ধরন</h3>
<ul>
  <li><strong>Static NAT:</strong> একটি Private IP → একটি নির্দিষ্ট Public IP। Server-এর জন্য।</li>
  <li><strong>Dynamic NAT:</strong> একটি Private IP → একটি Pool থেকে Public IP। তবে Overload নেই।</li>
  <li><strong>PAT (Port Address Translation / NAT Overload):</strong> অনেক Private IP → একটি Public IP। Port নম্বর দিয়ে আলাদা করে। বাড়িতে এটিই ব্যবহৃত হয়।</li>
</ul>

<h3>⚙️ PAT Configuration (সবচেয়ে প্রচলিত)</h3>
<div class="codeblock">
<span class="comment">-- Inside ও Outside Interface চিহ্নিত করা</span>
<span class="prompt">R1(config)#</span> <span class="cmd">interface g0/0</span>
<span class="prompt">R1(config-if)#</span> <span class="cmd">ip nat inside</span>

<span class="prompt">R1(config)#</span> <span class="cmd">interface g0/1</span>
<span class="prompt">R1(config-if)#</span> <span class="cmd">ip nat outside</span>

<span class="comment">-- Access List তৈরি (কোন IP-গুলো NAT হবে)</span>
<span class="prompt">R1(config)#</span> <span class="cmd">access-list 1 permit 192.168.1.0 0.0.0.255</span>

<span class="comment">-- PAT চালু করা</span>
<span class="prompt">R1(config)#</span> <span class="cmd">ip nat inside source list 1 interface g0/1 overload</span>

<span class="comment">-- Verification</span>
<span class="prompt">R1#</span> <span class="cmd">show ip nat translations</span>
<span class="prompt">R1#</span> <span class="cmd">show ip nat statistics</span>
</div>
  `, lab: 'show ip nat translations' },

  { id: 18, module: 4, title: 'DNS ও NTP — নাম ও সময় সেবা', content: `
<h3>🌐 DNS (Domain Name System)</h3>
<p>DNS হলো ইন্টারনেটের "ফোনবুক"। Domain Name (google.com) কে IP Address (142.250.186.46)-এ রূপান্তরিত করে।</p>

<h3>📋 DNS Query Process</h3>
<ul>
  <li><strong>ধাপ ১:</strong> Browser Cache চেক।</li>
  <li><strong>ধাপ ২:</strong> OS Cache (hosts file) চেক।</li>
  <li><strong>ধাপ ৩:</strong> Local DNS Server (Recursive Resolver)।</li>
  <li><strong>ধাপ ৪:</strong> Root DNS Server (যদি উত্তর না পাওয়া যায়)।</li>
  <li><strong>ধাপ ৫:</strong> TLD DNS Server (.com, .net)।</li>
  <li><strong>ধাপ ৬:</strong> Authoritative DNS Server (মূল উত্তর)।</li>
</ul>

<h3>⏰ NTP (Network Time Protocol)</h3>
<p>NTP সব নেটওয়ার্ক ডিভাইসের সময় সঠিক রাখে। নিরাপত্তা ও Syslog log-এর জন্য সঠিক সময় খুবই গুরুত্বপূর্ণ।</p>

<div class="codeblock">
<span class="comment">-- NTP Server সেট করা</span>
<span class="prompt">R1(config)#</span> <span class="cmd">ntp server 216.239.35.0</span>

<span class="comment">-- Timezone সেট করা</span>
<span class="prompt">R1(config)#</span> <span class="cmd">clock timezone BST 6</span>

<span class="comment">-- Verification</span>
<span class="prompt">R1#</span> <span class="cmd">show ntp status</span>
<span class="prompt">R1#</span> <span class="cmd">show clock</span>
</div>
  `, lab: 'show clock' },

  // ===================== MODULE 5: SECURITY =====================
  { id: 19, module: 5, title: 'ACL — Access Control List সম্পূর্ণ', content: `
<h3>🛡️ ACL কী?</h3>
<p>ACL (Access Control List) হলো Router-এর Firewall। এটি ট্রাফিক Permit (অনুমতি) বা Deny (নিষেধ) করে। ACL Router-এর Interface-এ প্রয়োগ করা হয়।</p>

<h3>📋 ACL-এর দুটি ধরন</h3>
<ul>
  <li><strong>Standard ACL (1-99, 1300-1999):</strong> শুধু Source IP দেখে। Destination-এর কাছে প্রয়োগ করা উচিত।</li>
  <li><strong>Extended ACL (100-199, 2000-2699):</strong> Source IP, Destination IP, Protocol, Port সব দেখে। Source-এর কাছে প্রয়োগ করা উচিত।</li>
</ul>

<h3>⚙️ Standard ACL Configuration</h3>
<div class="codeblock">
<span class="comment">-- ACL তৈরি করা</span>
<span class="prompt">R1(config)#</span> <span class="cmd">access-list 10 permit 192.168.1.0 0.0.0.255</span>
<span class="prompt">R1(config)#</span> <span class="cmd">access-list 10 deny any</span>

<span class="comment">-- Interface-এ প্রয়োগ করা (in = আসা, out = যাওয়া)</span>
<span class="prompt">R1(config)#</span> <span class="cmd">interface g0/1</span>
<span class="prompt">R1(config-if)#</span> <span class="cmd">ip access-group 10 out</span>
</div>

<h3>⚙️ Extended ACL Configuration</h3>
<div class="codeblock">
<span class="comment">-- Named Extended ACL (নাম দিয়ে)</span>
<span class="prompt">R1(config)#</span> <span class="cmd">ip access-list extended BLOCK_WEB</span>
<span class="prompt">R1(config-ext-nacl)#</span> <span class="cmd">deny tcp 192.168.1.0 0.0.0.255 any eq 80</span>
<span class="prompt">R1(config-ext-nacl)#</span> <span class="cmd">deny tcp 192.168.1.0 0.0.0.255 any eq 443</span>
<span class="prompt">R1(config-ext-nacl)#</span> <span class="cmd">permit ip any any</span>

<span class="prompt">R1(config)#</span> <span class="cmd">interface g0/0</span>
<span class="prompt">R1(config-if)#</span> <span class="cmd">ip access-group BLOCK_WEB in</span>

<span class="comment">-- Verification</span>
<span class="prompt">R1#</span> <span class="cmd">show access-lists</span>
<span class="prompt">R1#</span> <span class="cmd">show ip interface g0/0</span>
</div>

<div class="warning-box">⚠️ <strong>গুরুত্বপূর্ণ:</strong> প্রতিটি ACL-এর শেষে একটি implicit "deny any" থাকে। তাই permit না দিলে সব ব্লক হয়ে যাবে!</div>
  `, lab: 'show access-lists' },

  { id: 20, module: 5, title: 'SSH Configuration — নিরাপদ Remote Access', content: `
<h3>🔐 Telnet vs SSH</h3>
<ul>
  <li><strong>Telnet (Port 23):</strong> সব কিছু Plain Text-এ পাঠায় — নিরাপদ নয়।</li>
  <li><strong>SSH (Port 22):</strong> Encrypted — নিরাপদ। সবসময় SSH ব্যবহার করতে হবে।</li>
</ul>

<h3>⚙️ SSH Configuration (Step by Step)</h3>
<div class="codeblock">
<span class="comment">-- ধাপ ১: Hostname ও Domain Name (SSH Key-র জন্য প্রয়োজন)</span>
<span class="prompt">Router(config)#</span> <span class="cmd">hostname R1</span>
<span class="prompt">R1(config)#</span> <span class="cmd">ip domain-name aravals.com</span>

<span class="comment">-- ধাপ ২: RSA Key তৈরি করা</span>
<span class="prompt">R1(config)#</span> <span class="cmd">crypto key generate rsa modulus 2048</span>

<span class="comment">-- ধাপ ৩: Username ও Password তৈরি</span>
<span class="prompt">R1(config)#</span> <span class="cmd">username admin privilege 15 secret Admin@Pass</span>

<span class="comment">-- ধাপ ৪: VTY Line Configure করা</span>
<span class="prompt">R1(config)#</span> <span class="cmd">line vty 0 4</span>
<span class="prompt">R1(config-line)#</span> <span class="cmd">transport input ssh</span>
<span class="prompt">R1(config-line)#</span> <span class="cmd">login local</span>

<span class="comment">-- ধাপ ৫: SSH Version 2 ব্যবহার (নিরাপদ)</span>
<span class="prompt">R1(config)#</span> <span class="cmd">ip ssh version 2</span>

<span class="comment">-- Verification</span>
<span class="prompt">R1#</span> <span class="cmd">show ip ssh</span>
<span class="prompt">R1#</span> <span class="cmd">show ssh</span>
</div>
  `, lab: 'show ip ssh' },

  // ===================== MODULE 6: AUTOMATION =====================
  { id: 21, module: 6, title: 'Network Automation — পরিচিতি', content: `
<h3>🤖 Automation কেন দরকার?</h3>
<p>আগে নেটওয়ার্ক Manually configure করতে হতো — প্রতিটি ডিভাইসে আলাদাভাবে। এটি সময়সাপেক্ষ ও ভুলপ্রবণ। Automation দিয়ে একটি Script দিয়েই শতশত ডিভাইস Configure করা যায়।</p>

<h3>📋 Automation Tools</h3>
<ul>
  <li><strong>Python + Netmiko:</strong> Python Script দিয়ে SSH এর মাধ্যমে Cisco ডিভাইসে কমান্ড পাঠানো।</li>
  <li><strong>Ansible:</strong> YAML file দিয়ে Configuration পাঠানো। Agentless।</li>
  <li><strong>Puppet/Chef:</strong> জটিল Configuration Management।</li>
  <li><strong>REST API:</strong> HTTP দিয়ে নেটওয়ার্ক ডিভাইসের সাথে কথা বলা।</li>
</ul>

<h3>🐍 Python Netmiko উদাহরণ</h3>
<div class="codeblock">
from netmiko import ConnectHandler

cisco_router = {
    'device_type': 'cisco_ios',
    'host': '192.168.1.1',
    'username': 'admin',
    'password': 'Admin@Pass',
}

connection = ConnectHandler(**cisco_router)
output = connection.send_command('show ip route')
print(output)
connection.disconnect()
</div>

<h3>🔗 REST API (DNA Center)</h3>
<p>Cisco DNA Center REST API ব্যবহার করে নেটওয়ার্ক ডিভাইসের তথ্য পাওয়া যায়।</p>
<div class="codeblock">
GET  /api/v1/network-device  → সব ডিভাইস দেখো
GET  /api/v1/interface       → সব Interface দেখো
POST /api/v1/network-device  → নতুন ডিভাইস যোগ করো
</div>

<h3>📄 JSON (Data Format)</h3>
<div class="codeblock">
{
  "hostname": "R1",
  "interfaces": [
    {
      "name": "GigabitEthernet0/0",
      "ip": "192.168.1.1",
      "mask": "255.255.255.0",
      "status": "up"
    }
  ]
}
</div>
  `, lab: 'show version' },
];

// ---- COMMAND GUIDE DATA ----
const COMMANDS = [
  // Basic
  { cmd: 'enable', short: 'en', mode: 'User EXEC', cat: 'basic', desc: 'Privileged EXEC Mode এ প্রবেশ করো' },
  { cmd: 'configure terminal', short: 'conf t', mode: 'Privileged EXEC', cat: 'basic', desc: 'Global Configuration Mode এ প্রবেশ করো' },
  { cmd: 'exit', mode: 'Any', cat: 'basic', desc: 'আগের Mode এ ফিরে যাও' },
  { cmd: 'end', short: 'Ctrl+Z', mode: 'Any', cat: 'basic', desc: 'Privileged EXEC Mode এ সরাসরি ফিরে যাও' },
  { cmd: 'write memory', short: 'wr', mode: 'Privileged EXEC', cat: 'basic', desc: 'Running Config সেভ করো' },
  { cmd: 'copy running-config startup-config', mode: 'Privileged EXEC', cat: 'basic', desc: 'Running Config NVRAM-এ সেভ করো' },
  { cmd: 'hostname [name]', mode: 'Global Config', cat: 'basic', desc: 'ডিভাইসের নাম পরিবর্তন করো' },
  { cmd: 'enable secret [pass]', mode: 'Global Config', cat: 'basic', desc: 'Enable Password সেট করো (Encrypted)' },
  { cmd: 'no [command]', mode: 'Any', cat: 'basic', desc: 'যেকোনো কনফিগারেশন বাতিল করো' },
  { cmd: 'do [exec-cmd]', mode: 'Config Mode', cat: 'basic', desc: 'Config Mode থেকে EXEC কমান্ড চালাও' },
  // Show
  { cmd: 'show version', mode: 'Privileged EXEC', cat: 'show', desc: 'IOS Version, Uptime, Hardware তথ্য দেখো' },
  { cmd: 'show running-config', mode: 'Privileged EXEC', cat: 'show', desc: 'বর্তমান চলমান Configuration দেখো' },
  { cmd: 'show startup-config', mode: 'Privileged EXEC', cat: 'show', desc: 'NVRAM-এ সেভ করা Config দেখো' },
  { cmd: 'show ip interface brief', mode: 'Privileged EXEC', cat: 'show', desc: 'সব Interface-এর IP ও Status দেখো' },
  { cmd: 'show interfaces', mode: 'Privileged EXEC', cat: 'show', desc: 'সব Interface-এর বিস্তারিত তথ্য দেখো' },
  { cmd: 'show ip route', mode: 'Privileged EXEC', cat: 'show', desc: 'Routing Table দেখো' },
  { cmd: 'show mac address-table', mode: 'Privileged EXEC', cat: 'show', desc: 'Switch MAC Address Table দেখো' },
  { cmd: 'show vlan brief', mode: 'Privileged EXEC', cat: 'show', desc: 'VLAN List ও তাদের Port দেখো' },
  { cmd: 'show spanning-tree', mode: 'Privileged EXEC', cat: 'show', desc: 'STP তথ্য দেখো' },
  { cmd: 'show ip ospf neighbor', mode: 'Privileged EXEC', cat: 'show', desc: 'OSPF Neighbor দেখো' },
  { cmd: 'show ip eigrp neighbors', mode: 'Privileged EXEC', cat: 'show', desc: 'EIGRP Neighbor দেখো' },
  { cmd: 'show access-lists', mode: 'Privileged EXEC', cat: 'show', desc: 'সব ACL ও Match Count দেখো' },
  { cmd: 'show ip nat translations', mode: 'Privileged EXEC', cat: 'show', desc: 'NAT Translation Table দেখো' },
  { cmd: 'show ip dhcp binding', mode: 'Privileged EXEC', cat: 'show', desc: 'DHCP-দেওয়া IP List দেখো' },
  { cmd: 'show ip ssh', mode: 'Privileged EXEC', cat: 'show', desc: 'SSH Version ও Status দেখো' },
  // Routing
  { cmd: 'ip route [net] [mask] [next-hop]', mode: 'Global Config', cat: 'routing', desc: 'Static Route যোগ করো' },
  { cmd: 'ip route 0.0.0.0 0.0.0.0 [gw]', mode: 'Global Config', cat: 'routing', desc: 'Default Route সেট করো' },
  { cmd: 'router ospf [pid]', mode: 'Global Config', cat: 'routing', desc: 'OSPF চালু করো' },
  { cmd: 'network [net] [wild] area [id]', mode: 'OSPF Config', cat: 'routing', desc: 'OSPF-এ Network যোগ করো' },
  { cmd: 'router-id [id]', mode: 'OSPF Config', cat: 'routing', desc: 'OSPF Router ID সেট করো' },
  { cmd: 'router eigrp [as]', mode: 'Global Config', cat: 'routing', desc: 'EIGRP চালু করো' },
  { cmd: 'no auto-summary', mode: 'EIGRP Config', cat: 'routing', desc: 'Auto Summary বন্ধ করো' },
  { cmd: 'passive-interface [intf]', mode: 'Router Config', cat: 'routing', desc: 'নির্দিষ্ট Interface-এ Routing Hello বন্ধ করো' },
  // Switching
  { cmd: 'vlan [id]', mode: 'Global Config', cat: 'switching', desc: 'VLAN তৈরি করো বা প্রবেশ করো' },
  { cmd: 'name [vlan-name]', mode: 'VLAN Config', cat: 'switching', desc: 'VLAN-এর নাম দাও' },
  { cmd: 'switchport mode access', mode: 'Interface Config', cat: 'switching', desc: 'Port কে Access Mode করো' },
  { cmd: 'switchport access vlan [id]', mode: 'Interface Config', cat: 'switching', desc: 'Port কে VLAN-এ যোগ করো' },
  { cmd: 'switchport mode trunk', mode: 'Interface Config', cat: 'switching', desc: 'Port কে Trunk Mode করো' },
  { cmd: 'spanning-tree portfast', mode: 'Interface Config', cat: 'switching', desc: 'PortFast চালু করো (PC/Server Port-এ)' },
  { cmd: 'spanning-tree vlan [id] root primary', mode: 'Global Config', cat: 'switching', desc: 'এই Switch কে Root Bridge বানাও' },
  // Security
  { cmd: 'access-list [num] permit/deny [src]', mode: 'Global Config', cat: 'security', desc: 'Standard ACL তৈরি করো' },
  { cmd: 'ip access-list extended [name]', mode: 'Global Config', cat: 'security', desc: 'Named Extended ACL তৈরি করো' },
  { cmd: 'ip access-group [name] in/out', mode: 'Interface Config', cat: 'security', desc: 'Interface-এ ACL প্রয়োগ করো' },
  { cmd: 'crypto key generate rsa modulus 2048', mode: 'Global Config', cat: 'security', desc: 'SSH-এর জন্য RSA Key তৈরি করো' },
  { cmd: 'ip ssh version 2', mode: 'Global Config', cat: 'security', desc: 'SSH Version 2 ব্যবহার করো' },
  // Troubleshoot
  { cmd: 'ping [ip]', mode: 'Privileged EXEC', cat: 'troubleshoot', desc: 'Host Reachable কিনা চেক করো' },
  { cmd: 'traceroute [ip]', mode: 'Privileged EXEC', cat: 'troubleshoot', desc: 'Packet-এর পথ ধাপে ধাপে দেখো' },
  { cmd: 'debug ip icmp', mode: 'Privileged EXEC', cat: 'troubleshoot', desc: 'ICMP Packet Debug করো' },
  { cmd: 'undebug all', mode: 'Privileged EXEC', cat: 'troubleshoot', desc: 'সব Debug বন্ধ করো' },
  { cmd: 'show log', mode: 'Privileged EXEC', cat: 'troubleshoot', desc: 'Syslog বার্তা দেখো' },
];

// ---- CHEATSHEET DATA ----
const CHEATSHEETS = [
  { title: 'IOS Mode পরিবর্তন', items: [
    { cmd: 'enable', desc: 'User → Privileged' },
    { cmd: 'configure terminal', desc: 'Privileged → Global Config' },
    { cmd: 'interface g0/0', desc: 'Global → Interface Config' },
    { cmd: 'router ospf 1', desc: 'Global → Router Config' },
    { cmd: 'line vty 0 4', desc: 'Global → Line Config' },
    { cmd: 'exit / end', desc: 'আগের Mode / Privileged' },
  ]},
  { title: 'IP Address — Subnet Mask', items: [
    { cmd: '/8  = 255.0.0.0', desc: '16,777,214 hosts' },
    { cmd: '/16 = 255.255.0.0', desc: '65,534 hosts' },
    { cmd: '/24 = 255.255.255.0', desc: '254 hosts' },
    { cmd: '/25 = 255.255.255.128', desc: '126 hosts' },
    { cmd: '/26 = 255.255.255.192', desc: '62 hosts' },
    { cmd: '/30 = 255.255.255.252', desc: '2 hosts (WAN Link)' },
  ]},
  { title: 'OSI Layer — PDU', items: [
    { cmd: 'Layer 7 Application', desc: 'Data' },
    { cmd: 'Layer 4 Transport', desc: 'Segment/Datagram' },
    { cmd: 'Layer 3 Network', desc: 'Packet' },
    { cmd: 'Layer 2 Data Link', desc: 'Frame' },
    { cmd: 'Layer 1 Physical', desc: 'Bits' },
  ]},
  { title: 'Port নম্বর', items: [
    { cmd: 'FTP: 20/21', desc: 'TCP' },
    { cmd: 'SSH: 22', desc: 'TCP' },
    { cmd: 'DNS: 53', desc: 'UDP/TCP' },
    { cmd: 'HTTP: 80', desc: 'TCP' },
    { cmd: 'HTTPS: 443', desc: 'TCP' },
    { cmd: 'DHCP: 67/68', desc: 'UDP' },
  ]},
  { title: 'Administrative Distance', items: [
    { cmd: 'Connected: 0', desc: 'সর্বোচ্চ বিশ্বাস' },
    { cmd: 'Static: 1', desc: '' },
    { cmd: 'EIGRP Internal: 90', desc: '' },
    { cmd: 'OSPF: 110', desc: '' },
    { cmd: 'RIP: 120', desc: '' },
    { cmd: 'Unknown: 255', desc: 'ব্যবহার হয় না' },
  ]},
  { title: 'OSPF দ্রুত Setup', items: [
    { cmd: 'router ospf 1', desc: 'OSPF চালু' },
    { cmd: 'router-id 1.1.1.1', desc: 'Router ID সেট' },
    { cmd: 'network X.X.X.X 0.0.0.255 area 0', desc: 'Network যোগ' },
    { cmd: 'passive-interface g0/0', desc: 'LAN Port বন্ধ' },
    { cmd: 'show ip ospf neighbor', desc: 'Neighbor দেখো' },
  ]},
];

// ---- CLI SIMULATOR ----
const DeviceState = {
  type: 'router',
  hostname: 'Router',
  mode: 'user',
  config: {
    interfaces: {},
    routes: [],
    vlans: { 1: 'default' },
    ospf: null,
    eigrp: null,
    hostname: 'Router',
    passwords: {},
    acls: {},
    dhcpPools: {},
  },
  history: [],
  historyIndex: -1,
  currentIface: null,
  currentVlan: null,
};

function getPrompt() {
  const h = DeviceState.config.hostname;
  const t = DeviceState.type === 'switch' ? 'Switch' : 'Router';
  const name = h !== 'Router' && h !== 'Switch' ? h : t;
  const modeMap = {
    user: `${name}>`,
    privileged: `${name}#`,
    global: `${name}(config)#`,
    interface: `${name}(config-if)#`,
    router: `${name}(config-router)#`,
    vlan: `${name}(config-vlan)#`,
    line: `${name}(config-line)#`,
    'dhcp-config': `${name}(dhcp-config)#`,
    'ext-nacl': `${name}(config-ext-nacl)#`,
    'std-nacl': `${name}(config-std-nacl)#`,
  };
  return modeMap[DeviceState.mode] || `${name}>`;
}

function parseCmd(raw) {
  const t = raw.trim().toLowerCase();
  const parts = raw.trim().split(/\s+/);
  const low = t.split(/\s+/);

  // No output if empty
  if (!t) return null;

  // ---- UNIVERSAL ----
  if (t === '?' || t === 'help') {
    const modeHelps = {
      user: ['enable', 'logout', 'ping <ip>', 'traceroute <ip>', 'show version', '?'],
      privileged: ['configure terminal (conf t)', 'show ip route', 'show ip interface brief', 'show interfaces', 'show running-config', 'show version', 'show mac address-table', 'show vlan brief', 'show spanning-tree', 'show ip ospf neighbor', 'show ip eigrp neighbors', 'show access-lists', 'show ip nat translations', 'show ip dhcp binding', 'show ip ssh', 'show clock', 'write memory', 'ping <ip>', 'traceroute <ip>', 'reload', 'disable', '?'],
      global: ['hostname <name>', 'interface <intf>', 'ip route <dest> <mask> <next-hop>', 'ip dhcp pool <name>', 'ip access-list extended <name>', 'access-list <num> permit/deny <src>', 'vlan <id> (Switch)', 'router ospf <pid>', 'router eigrp <as>', 'line vty 0 4', 'username <name> privilege <lvl> secret <pass>', 'enable secret <pass>', 'ip ssh version 2', 'crypto key generate rsa modulus 2048', 'ip nat inside source list <acl> interface <intf> overload', 'do <exec-cmd>', 'no <cmd>', 'end', 'exit', '?'],
      interface: ['ip address <ip> <mask>', 'ipv6 address <ipv6>/<prefix>', 'no shutdown', 'shutdown', 'description <desc>', 'ip nat inside', 'ip nat outside', 'switchport mode access', 'switchport mode trunk', 'switchport access vlan <id>', 'spanning-tree portfast', 'ip helper-address <ip>', 'exit', 'end', '?'],
      router: ['network <net> <wild> area <id>', 'router-id <id>', 'passive-interface <intf>', 'default-information originate', 'no auto-summary', 'exit', '?'],
    };
    const cmds = modeHelps[DeviceState.mode] || modeHelps.user;
    return { type: 'info', text: '  পাওয়া কমান্ডসমূহ:\n' + cmds.map(c => `  ${c}`).join('\n') };
  }

  if (t === 'exit') {
    if (DeviceState.mode === 'user') return { type: 'info', text: 'logout' };
    const prev = { interface: 'global', router: 'global', vlan: 'global', line: 'global', 'dhcp-config': 'global', 'ext-nacl': 'global', 'std-nacl': 'global', global: 'privileged', privileged: 'user' };
    DeviceState.mode = prev[DeviceState.mode] || 'user';
    DeviceState.currentIface = null;
    return { type: 'prompt' };
  }

  if (t === 'end' || t === '\u0003') {
    DeviceState.mode = DeviceState.mode === 'user' ? 'user' : 'privileged';
    DeviceState.currentIface = null;
    return { type: 'prompt' };
  }

  // ---- USER EXEC MODE ----
  if (DeviceState.mode === 'user') {
    if (t === 'enable' || t === 'en') {
      DeviceState.mode = 'privileged';
      return { type: 'prompt' };
    }
    if (t.startsWith('ping')) {
      const ip = parts[1] || '192.168.1.1';
      return { type: 'success', text: `Sending 5, 100-byte ICMP Echos to ${ip}, timeout is 2 seconds:\n!!!!!  \nSuccess rate is 100 percent (5/5), round-trip min/avg/max = 1/1/4 ms` };
    }
    return { type: 'error', text: `% Unknown command: "${raw}". Type '?' for available commands.` };
  }

  // ---- PRIVILEGED EXEC ----
  if (DeviceState.mode === 'privileged') {
    if (t === 'disable') { DeviceState.mode = 'user'; return { type: 'prompt' }; }
    if (t === 'configure terminal' || t === 'conf t') {
      DeviceState.mode = 'global';
      return { type: 'info', text: 'Enter configuration commands, one per line.  End with CNTL/Z.' };
    }
    if (t === 'write memory' || t === 'wr' || t === 'copy running-config startup-config') {
      return { type: 'success', text: 'Building configuration...\n[OK]  Configuration saved successfully!' };
    }
    if (t === 'show version' || t === 'sh ver') {
      return { type: 'info', text: `Cisco IOS Software, Version 15.6(3)M2\n${DeviceState.type === 'switch' ? 'WS-C2960-24TT-L' : 'CISCO1941/K9'}\nRouter uptime is 2 hours, 14 minutes\nHostname: ${DeviceState.config.hostname}` };
    }
    if (t === 'show running-config' || t === 'sh run') {
      const cfg = buildRunningConfig();
      return { type: 'info', text: cfg };
    }
    if (t === 'show ip interface brief' || t === 'sh ip int br') {
      return { type: 'info', text: buildInterfaceBrief() };
    }
    if (t === 'show interfaces' || t === 'sh int') {
      return { type: 'info', text: buildInterfacesDetail() };
    }
    if (t === 'show ip route' || t === 'sh ip ro') {
      return { type: 'info', text: buildRouteTable() };
    }
    if (t === 'show mac address-table' || t === 'sh mac addr') {
      return { type: 'info', text: buildMacTable() };
    }
    if (t === 'show vlan brief' || t === 'sh vlan br') {
      return { type: 'info', text: buildVlanBrief() };
    }
    if (t === 'show spanning-tree' || t === 'sh span') {
      return { type: 'info', text: buildSpanTree() };
    }
    if (t === 'show ip ospf neighbor' || t === 'sh ip ospf nei') {
      return { type: 'info', text: DeviceState.config.ospf ? 'OSPF Neighbor Table:\nNeighbor ID   Pri   State  Interface\n2.2.2.2         1   FULL/DR  GigabitEthernet0/1' : '% OSPF not configured.' };
    }
    if (t === 'show ip eigrp neighbors') {
      return { type: 'info', text: DeviceState.config.eigrp ? 'IP-EIGRP neighbors for process ' + DeviceState.config.eigrp + '\nH   Address        Interface   Hold  Uptime   SRTT  RTO  Q  Seq\n0   10.0.0.2       Gi0/1       12    00:01:23   4    200  0  8' : '% EIGRP not configured.' };
    }
    if (t === 'show access-lists' || t === 'sh access-lists') {
      return { type: 'info', text: buildACLs() };
    }
    if (t === 'show ip nat translations' || t === 'sh ip nat trans') {
      return { type: 'info', text: 'Pro  Inside global       Inside local        Outside local       Outside global\ntcp  203.0.113.1:1024  192.168.1.10:1024  8.8.8.8:80          8.8.8.8:80' };
    }
    if (t === 'show ip dhcp binding') {
      const bindings = Object.entries(DeviceState.config.dhcpPools);
      if (!bindings.length) return { type: 'info', text: 'No DHCP bindings found.' };
      return { type: 'info', text: 'IP address       Client-ID          Lease expiration  Type\n192.168.1.10     0100.5079.aabb.01  Jul 19 2026 09:00  Automatic' };
    }
    if (t === 'show ip ssh' || t === 'sh ip ssh') {
      return { type: 'info', text: 'SSH Enabled - version 2.0\nAuthentication timeout: 120 secs; Authentication retries: 3' };
    }
    if (t === 'show clock') {
      return { type: 'info', text: `*${new Date().toLocaleString('en-US')} BST` };
    }
    if (t.startsWith('ping')) {
      const ip = parts[1] || '192.168.1.1';
      return { type: 'success', text: `Sending 5, 100-byte ICMP Echos to ${ip}, timeout is 2 seconds:\n!!!!!\nSuccess rate is 100 percent (5/5), round-trip min/avg/max = 1/2/4 ms` };
    }
    if (t.startsWith('traceroute') || t.startsWith('trace')) {
      const ip = parts[1] || '8.8.8.8';
      return { type: 'info', text: `Tracing the route to ${ip}\n  1  192.168.1.1 4 msec 2 msec 1 msec\n  2  10.0.0.1 8 msec 6 msec 7 msec\n  3  ${ip} 20 msec 19 msec 21 msec` };
    }
    if (t === 'reload') {
      return { type: 'warn', text: 'System configuration has been modified. Save? [yes/no]: (ল্যাবে reload সম্পন্ন হয় না)' };
    }
    return { type: 'error', text: `% Unknown command or wrong mode. Type '?' for help.` };
  }

  // ---- GLOBAL CONFIG ----
  if (DeviceState.mode === 'global') {
    if (t.startsWith('do ')) {
      const subcmd = raw.trim().substring(3);
      const savedMode = DeviceState.mode;
      DeviceState.mode = 'privileged';
      const res = parseCmd(subcmd);
      DeviceState.mode = savedMode;
      return res;
    }
    if (t.startsWith('hostname ') || t.startsWith('host ')) {
      const hn = parts[1];
      DeviceState.config.hostname = hn;
      return { type: 'prompt' };
    }
    if (t.startsWith('interface ') || t.startsWith('int ')) {
      const iface = parts.slice(1).join(' ');
      const normalized = normalizeIface(iface);
      DeviceState.currentIface = normalized;
      if (!DeviceState.config.interfaces[normalized]) {
        DeviceState.config.interfaces[normalized] = { ip: '', mask: '', desc: '', status: 'down', nat: '', mode: 'access', vlan: 1, trunk: false, portfast: false };
      }
      DeviceState.mode = 'interface';
      return { type: 'prompt' };
    }
    if (t.startsWith('ip route ') || t.startsWith('ip rou')) {
      const dest = parts[2]; const mask = parts[3]; const nh = parts[4];
      if (dest && mask && nh) {
        DeviceState.config.routes.push({ dest, mask, nh });
        return { type: 'success', text: `Static route added: ${dest} ${mask} via ${nh}` };
      }
      return { type: 'error', text: '% Incomplete command. Syntax: ip route <dest> <mask> <next-hop>' };
    }
    if (t.startsWith('router ospf')) {
      const pid = parts[2] || '1';
      DeviceState.config.ospf = { pid, networks: [], rid: '', passive: [] };
      DeviceState.mode = 'router';
      return { type: 'info', text: `OSPF Process ${pid} started.` };
    }
    if (t.startsWith('router eigrp')) {
      const as = parts[2] || '100';
      DeviceState.config.eigrp = as;
      DeviceState.mode = 'router';
      return { type: 'info', text: `EIGRP AS ${as} started.` };
    }
    if (t.startsWith('enable secret')) {
      DeviceState.config.passwords.enable = parts[2];
      return { type: 'success', text: 'Enable secret password set.' };
    }
    if (t.startsWith('username ')) {
      return { type: 'success', text: `User '${parts[1]}' created with privilege ${parts[3] || '1'}.` };
    }
    if (t.startsWith('ip ssh version')) {
      return { type: 'success', text: 'SSH Version 2 enabled.' };
    }
    if (t.startsWith('crypto key generate rsa')) {
      return { type: 'success', text: 'The name for the keys will be: ' + DeviceState.config.hostname + '.aravals.com\nGenerating RSA keys... [OK] (2048 bits)' };
    }
    if (t.startsWith('ip domain-name ') || t.startsWith('ip domain name ')) {
      return { type: 'success', text: `Domain name set to ${parts.slice(2).join('')}` };
    }
    if (t.startsWith('vlan ')) {
      const vid = parts[1];
      DeviceState.currentVlan = vid;
      if (!DeviceState.config.vlans[vid]) DeviceState.config.vlans[vid] = 'VLAN' + vid;
      DeviceState.mode = 'vlan';
      return { type: 'prompt' };
    }
    if (t.startsWith('ip dhcp pool ')) {
      const pname = parts.slice(3).join(' ');
      DeviceState.config.dhcpPools[pname] = { network: '', mask: '', gw: '', dns: '', lease: 1 };
      DeviceState.mode = 'dhcp-config';
      return { type: 'prompt' };
    }
    if (t.startsWith('ip dhcp excluded-address ')) {
      return { type: 'success', text: `Excluded: ${parts[3]} to ${parts[4] || parts[3]}` };
    }
    if (t.startsWith('access-list ')) {
      const num = parts[1]; const action = parts[2]; const src = parts[3];
      if (!DeviceState.config.acls[num]) DeviceState.config.acls[num] = [];
      DeviceState.config.acls[num].push({ action, src });
      return { type: 'success', text: `ACL ${num}: ${action} ${src}` };
    }
    if (t.startsWith('ip access-list extended ')) {
      const aclName = parts.slice(3).join(' ');
      if (!DeviceState.config.acls[aclName]) DeviceState.config.acls[aclName] = [];
      DeviceState.mode = 'ext-nacl';
      return { type: 'prompt' };
    }
    if (t.startsWith('line ')) {
      DeviceState.mode = 'line';
      return { type: 'info', text: `Entering line config for: ${parts.slice(1).join(' ')}` };
    }
    if (t.startsWith('spanning-tree vlan')) {
      return { type: 'success', text: 'STP VLAN priority/root configured.' };
    }
    if (t.startsWith('ip nat inside source')) {
      return { type: 'success', text: 'NAT overload (PAT) configured.' };
    }
    if (t.startsWith('no ')) {
      return { type: 'success', text: `Configuration removed: "${raw.substring(3)}"` };
    }
    return { type: 'error', text: `% Unknown command in Global Config: "${raw}". Type '?' for help.` };
  }

  // ---- INTERFACE CONFIG ----
  if (DeviceState.mode === 'interface') {
    const iface = DeviceState.currentIface;
    if (!iface) return { type: 'error', text: '% No interface selected.' };

    if (t.startsWith('ip address ') || t.startsWith('ip addr ')) {
      const ip = parts[2]; const mask = parts[3];
      if (!ip || !mask) return { type: 'error', text: '% Incomplete command.' };
      DeviceState.config.interfaces[iface].ip = ip;
      DeviceState.config.interfaces[iface].mask = mask;
      return { type: 'success', text: `IP ${ip}/${mask} assigned to ${iface}` };
    }
    if (t === 'no shutdown' || t === 'no shut') {
      DeviceState.config.interfaces[iface].status = 'up';
      return { type: 'success', text: `%LINK-5-CHANGED: Interface ${iface}, changed state to up\n%LINEPROTO-5-UPDOWN: Line protocol on Interface ${iface}, changed state to up` };
    }
    if (t === 'shutdown' || t === 'shut') {
      DeviceState.config.interfaces[iface].status = 'down';
      return { type: 'warn', text: `%LINK-5-CHANGED: Interface ${iface}, changed state to administratively down` };
    }
    if (t.startsWith('description ')) {
      DeviceState.config.interfaces[iface].desc = parts.slice(1).join(' ');
      return { type: 'success', text: `Description set on ${iface}` };
    }
    if (t === 'ip nat inside') {
      DeviceState.config.interfaces[iface].nat = 'inside';
      return { type: 'success', text: `${iface} set as NAT inside.` };
    }
    if (t === 'ip nat outside') {
      DeviceState.config.interfaces[iface].nat = 'outside';
      return { type: 'success', text: `${iface} set as NAT outside.` };
    }
    if (t === 'switchport mode access') {
      DeviceState.config.interfaces[iface].trunk = false;
      return { type: 'success', text: `${iface} set to Access mode.` };
    }
    if (t === 'switchport mode trunk') {
      DeviceState.config.interfaces[iface].trunk = true;
      return { type: 'success', text: `${iface} set to Trunk mode.` };
    }
    if (t.startsWith('switchport access vlan ')) {
      const vid = parts[3];
      DeviceState.config.interfaces[iface].vlan = vid;
      return { type: 'success', text: `${iface} assigned to VLAN ${vid}` };
    }
    if (t === 'spanning-tree portfast') {
      DeviceState.config.interfaces[iface].portfast = true;
      return { type: 'success', text: `PortFast enabled on ${iface}` };
    }
    if (t.startsWith('ip helper-address ')) {
      return { type: 'success', text: `DHCP Relay set to ${parts[2]}` };
    }
    if (t.startsWith('ipv6 address ')) {
      return { type: 'success', text: `IPv6 address configured on ${iface}` };
    }
    if (t.startsWith('ip access-group ')) {
      return { type: 'success', text: `ACL "${parts[2]}" applied ${parts[3]} on ${iface}` };
    }
    if (t.startsWith('no ')) {
      return { type: 'success', text: `Config removed on ${iface}: ${raw.substring(3)}` };
    }
    return { type: 'error', text: `% Unknown Interface command: "${raw}". Type '?' for help.` };
  }

  // ---- ROUTER/OSPF/EIGRP CONFIG ----
  if (DeviceState.mode === 'router') {
    if (t.startsWith('network ')) {
      const network = parts[1], wild = parts[2], area = parts[4];
      if (DeviceState.config.ospf) {
        DeviceState.config.ospf.networks.push({ network, wild, area });
        return { type: 'success', text: `Network ${network} added to OSPF area ${area}` };
      }
      return { type: 'success', text: `Network ${network} added.` };
    }
    if (t.startsWith('router-id ')) {
      if (DeviceState.config.ospf) DeviceState.config.ospf.rid = parts[1];
      return { type: 'success', text: `Router ID set to ${parts[1]}. Reload or clear OSPF to take effect.` };
    }
    if (t.startsWith('passive-interface ')) {
      const iface = parts[1];
      if (DeviceState.config.ospf) DeviceState.config.ospf.passive.push(iface);
      return { type: 'success', text: `${iface} set as passive.` };
    }
    if (t === 'default-information originate') {
      return { type: 'success', text: 'Default route will be advertised via OSPF.' };
    }
    if (t === 'no auto-summary') {
      return { type: 'success', text: 'Auto-summary disabled.' };
    }
    if (t.startsWith('no ')) return { type: 'success', text: `Config removed: ${raw.substring(3)}` };
    return { type: 'error', text: `% Unknown Router Config command: "${raw}"` };
  }

  // ---- VLAN CONFIG ----
  if (DeviceState.mode === 'vlan') {
    if (t.startsWith('name ')) {
      const vname = parts.slice(1).join(' ');
      if (DeviceState.currentVlan) DeviceState.config.vlans[DeviceState.currentVlan] = vname;
      return { type: 'success', text: `VLAN ${DeviceState.currentVlan} named: ${vname}` };
    }
    return { type: 'error', text: `% Unknown VLAN command.` };
  }

  // ---- LINE CONFIG ----
  if (DeviceState.mode === 'line') {
    if (t.startsWith('password ')) return { type: 'success', text: `Password set.` };
    if (t === 'login') return { type: 'success', text: `Login authentication enabled.` };
    if (t === 'login local') return { type: 'success', text: `Local username auth enabled.` };
    if (t.startsWith('transport input')) return { type: 'success', text: `Transport set: ${parts.slice(2).join(' ')}` };
    return { type: 'error', text: `% Unknown line command.` };
  }

  // ---- DHCP CONFIG ----
  if (DeviceState.mode === 'dhcp-config') {
    if (t.startsWith('network ')) {
      return { type: 'success', text: `DHCP Network: ${parts[1]} ${parts[2]}` };
    }
    if (t.startsWith('default-router ')) return { type: 'success', text: `Default GW: ${parts[1]}` };
    if (t.startsWith('dns-server ')) return { type: 'success', text: `DNS: ${parts.slice(1).join(' ')}` };
    if (t.startsWith('lease ')) return { type: 'success', text: `Lease: ${parts[1]} day(s)` };
    return { type: 'error', text: `% Unknown DHCP command.` };
  }

  // ---- EXT-NACL ----
  if (DeviceState.mode === 'ext-nacl' || DeviceState.mode === 'std-nacl') {
    if (t.startsWith('permit ') || t.startsWith('deny ')) {
      return { type: 'success', text: `ACL entry added: ${raw}` };
    }
    return { type: 'error', text: `% Unknown ACL command.` };
  }

  return { type: 'error', text: `% Unknown command: "${raw}"` };
}

// ---- HELPER BUILDERS ----
function normalizeIface(str) {
  const s = str.toLowerCase();
  if (s.startsWith('g') && !s.startsWith('gi')) return 'GigabitEthernet' + s.substring(1);
  if (s.startsWith('gi')) return 'GigabitEthernet' + s.substring(2);
  if (s.startsWith('fa')) return 'FastEthernet' + s.substring(2);
  if (s.startsWith('f0')) return 'FastEthernet' + s.substring(1);
  if (s.startsWith('s0')) return 'Serial' + s.substring(1);
  if (s.startsWith('lo')) return 'Loopback' + s.replace(/\D/g,'');
  return str;
}

function buildRunningConfig() {
  const c = DeviceState.config;
  let out = `Building configuration...\n\nCurrent configuration:\n!\nversion 15.6\n!\nhostname ${c.hostname}\n!`;
  if (c.passwords.enable) out += `\nenable secret 5 $1$xxxx$encrypted`;
  Object.entries(c.interfaces).forEach(([name, d]) => {
    out += `\n!\ninterface ${name}`;
    if (d.desc) out += `\n description ${d.desc}`;
    if (d.ip) out += `\n ip address ${d.ip} ${d.mask}`;
    if (d.nat) out += `\n ip nat ${d.nat}`;
    if (d.trunk) out += `\n switchport mode trunk`;
    else if (d.vlan !== 1) out += `\n switchport mode access\n switchport access vlan ${d.vlan}`;
    if (d.portfast) out += `\n spanning-tree portfast`;
    if (d.status !== 'up') out += `\n shutdown`;
  });
  if (c.ospf) { out += `\n!\nrouter ospf ${c.ospf.pid}`; if (c.ospf.rid) out += `\n router-id ${c.ospf.rid}`; c.ospf.networks.forEach(n => out += `\n network ${n.network} ${n.wild} area ${n.area}`); }
  if (c.eigrp) out += `\n!\nrouter eigrp ${c.eigrp}`;
  c.routes.forEach(r => out += `\n!\nip route ${r.dest} ${r.mask} ${r.nh}`);
  out += `\n!\nend`;
  return out;
}

function buildInterfaceBrief() {
  let out = `Interface              IP-Address      OK? Method Status                Protocol\n`;
  const ifaces = Object.entries(DeviceState.config.interfaces);
  if (!ifaces.length) {
    out += `GigabitEthernet0/0     unassigned      YES unset  administratively down down\nGigabitEthernet0/1     unassigned      YES unset  administratively down down`;
  } else {
    ifaces.forEach(([name, d]) => {
      const ip = d.ip || 'unassigned';
      const ok = d.ip ? 'YES' : 'YES';
      const status = d.status === 'up' ? 'up' : 'administratively down';
      const proto = d.status === 'up' ? 'up' : 'down';
      out += `${name.padEnd(25)}${ip.padEnd(16)}${ok}  manual ${status.padEnd(22)}${proto}\n`;
    });
  }
  return out.trim();
}

function buildInterfacesDetail() {
  const ifaces = Object.entries(DeviceState.config.interfaces);
  if (!ifaces.length) return 'GigabitEthernet0/0 is administratively down, line protocol is down\n  Hardware is ISR4231-3x1GE\n  MTU 1500 bytes, BW 1000000 Kbit/sec';
  return ifaces.map(([name, d]) => {
    const status = d.status === 'up' ? 'up, line protocol is up' : 'administratively down, line protocol is down';
    return `${name} is ${status}\n  Hardware is Gigabit Ethernet\n  ${d.ip ? 'Internet address is ' + d.ip + '/' + cidrFromMask(d.mask) : 'Internet protocol processing disabled'}\n  ${d.desc ? 'Description: ' + d.desc : ''}`;
  }).join('\n\n');
}

function buildRouteTable() {
  let out = `Codes: C - connected, S - static, O - OSPF, R - RIP\n\n`;
  const ifaces = Object.entries(DeviceState.config.interfaces).filter(([,d]) => d.ip && d.status === 'up');
  if (!ifaces.length && !DeviceState.config.routes.length) return out + 'Gateway of last resort is not set\n\n(No routes in table)';
  out += 'Gateway of last resort is not set\n\n';
  ifaces.forEach(([name, d]) => {
    out += `C    ${d.ip}/${cidrFromMask(d.mask)} is directly connected, ${name}\n`;
  });
  DeviceState.config.routes.forEach(r => {
    out += `S    ${r.dest}/${cidrFromMask(r.mask)} [1/0] via ${r.nh}\n`;
  });
  if (DeviceState.config.ospf && DeviceState.config.ospf.networks.length) {
    out += `O    172.16.0.0/24 [110/2] via 10.0.0.2, 00:00:05, GigabitEthernet0/1\n`;
  }
  return out.trim();
}

function buildMacTable() {
  const ifaces = Object.keys(DeviceState.config.interfaces);
  if (!ifaces.length) return 'Mac Address Table\n─────────────────────────────────────\nVlan  Mac Address     Type     Ports\n─────────────────────────────────────\n(empty)';
  let out = 'Mac Address Table\n─────────────────────────────────────\nVlan  Mac Address       Type     Ports\n─────────────────────────────────────\n';
  out += `   1  0050.7966.0001  DYNAMIC  ${ifaces[0] || 'Gi0/0'}\n`;
  out += `   1  00e0.a3b1.1234  DYNAMIC  ${ifaces[1] || 'Gi0/1'}\n`;
  out += `Total Mac Addresses for this criterion: 2`;
  return out;
}

function buildVlanBrief() {
  let out = 'VLAN Name                             Status    Ports\n──── ──────────────────────────────── ──────── ───────────────────────\n';
  Object.entries(DeviceState.config.vlans).forEach(([id, name]) => {
    const ports = Object.entries(DeviceState.config.interfaces).filter(([,d]) => String(d.vlan) === String(id)).map(([n]) => n.replace('GigabitEthernet', 'Gi').replace('FastEthernet', 'Fa'));
    out += `${String(id).padEnd(5)}${name.padEnd(37)} active   ${ports.join(', ')}\n`;
  });
  return out.trim();
}

function buildSpanTree() {
  return `VLAN0001\n  Spanning tree enabled protocol ieee\n  Root ID    Priority    32769\n             Address     000a.0000.0001\n             This bridge is the root\n  Bridge ID  Priority    32769 (priority 32768 sys-id-ext 1)\n             Address     000a.0000.0001\n\nInterface      Role  Sts  Cost     Prio.Nbr Type\n─────────────────────────────────────────────\nGi0/0          Desg  FWD  4        128.1    P2p\nGi0/1          Desg  FWD  4        128.2    P2p`;
}

function buildACLs() {
  const acls = Object.entries(DeviceState.config.acls);
  if (!acls.length) return '% No ACLs configured.';
  let out = '';
  acls.forEach(([name, entries]) => {
    out += `\nIP access list ${name}\n`;
    entries.forEach((e, i) => out += `  ${i * 10 + 10} ${e.action} ${e.src || 'any'} (${Math.floor(Math.random()*100)} matches)\n`);
  });
  return out.trim();
}

function cidrFromMask(mask) {
  if (!mask) return '?';
  return mask.split('.').reduce((acc, o) => acc + (parseInt(o).toString(2).match(/1/g)||[]).length, 0);
}

// ---- SCENARIOS ----
const SCENARIOS = {
  router: [
    { label: '🔧 Basic Setup', cmds: ['enable', 'configure terminal', 'hostname R1', 'enable secret StrongPass'] },
    { label: '🌐 IP Config', cmds: ['enable', 'conf t', 'interface g0/0', 'ip address 192.168.1.1 255.255.255.0', 'no shutdown', 'exit', 'interface g0/1', 'ip address 10.0.0.1 255.255.255.252', 'no shutdown'] },
    { label: '🗺️ Static Route', cmds: ['enable', 'conf t', 'ip route 0.0.0.0 0.0.0.0 10.0.0.2', 'ip route 172.16.0.0 255.255.0.0 10.0.0.2'] },
    { label: '📡 OSPF Setup', cmds: ['enable', 'conf t', 'router ospf 1', 'router-id 1.1.1.1', 'network 192.168.1.0 0.0.0.255 area 0', 'network 10.0.0.0 0.0.0.3 area 0', 'passive-interface g0/0'] },
    { label: '🔐 SSH Config', cmds: ['enable', 'conf t', 'hostname R1', 'ip domain-name aravals.com', 'crypto key generate rsa modulus 2048', 'username admin privilege 15 secret Admin@Pass', 'line vty 0 4', 'transport input ssh', 'login local', 'exit', 'ip ssh version 2'] },
    { label: '🌐 NAT/PAT', cmds: ['enable', 'conf t', 'interface g0/0', 'ip nat inside', 'exit', 'interface g0/1', 'ip nat outside', 'exit', 'access-list 1 permit 192.168.1.0 0.0.0.255', 'ip nat inside source list 1 interface g0/1 overload'] },
  ],
  switch: [
    { label: '🏢 VLAN Setup', cmds: ['enable', 'conf t', 'vlan 10', 'name HR_Dept', 'exit', 'vlan 20', 'name IT_Dept', 'exit', 'interface f0/1', 'switchport mode access', 'switchport access vlan 10'] },
    { label: '🔗 Trunk Port', cmds: ['enable', 'conf t', 'interface g0/1', 'switchport mode trunk', 'exit', 'show interfaces trunk'] },
    { label: '🌲 STP Root', cmds: ['enable', 'conf t', 'spanning-tree vlan 1 root primary', 'exit', 'show spanning-tree'] },
  ],
};

// ============================
// MAIN APP
// ============================
const app = {
  currentLesson: null,
  activeModule: 0,

  init() {
    this.loadProgress();
    this.renderSidebar();
    this.renderCheatsheet();
    this.renderCommandTable('all');
    this.renderScenarios();
    this.updateStats();
    this.initNav();
    this.initSearch();
    this.initTerminal();
    this.initTheme();
  },

  loadProgress() {
    try {
      this._progress = JSON.parse(localStorage.getItem('ccna_progress') || '{}');
    } catch { this._progress = {}; }
  },

  saveProgress() {
    localStorage.setItem('ccna_progress', JSON.stringify(this._progress));
  },

  markComplete(id) {
    this._progress[id] = true;
    this.saveProgress();
    this.updateStats();
    this.renderSidebar();
    const btn = document.getElementById('btnComplete');
    if (btn) { btn.textContent = '✅ সম্পন্ন হয়েছে'; btn.classList.add('done'); btn.disabled = true; }
  },

  updateStats() {
    const done = Object.keys(this._progress).length;
    const total = CURRICULUM.length;
    const pct = Math.round((done / total) * 100);
    document.getElementById('statCompleted').textContent = done;
    document.getElementById('statProgress').textContent = pct + '%';
    document.getElementById('progressBar').style.width = pct + '%';
    document.getElementById('progressText').textContent = `${done} of ${total} পাঠ সম্পন্ন হয়েছে`;
  },

  resumeJourney() {
    const first = CURRICULUM.find(l => !this._progress[l.id]) || CURRICULUM[0];
    this.loadLesson(first.id);
    this.goToSection('lessons');
  },

  filterModule(m) {
    this.activeModule = m;
    document.querySelectorAll('.filter-btn').forEach((b, i) => b.classList.toggle('active', i === m));
    this.renderSidebar();
  },

  renderSidebar() {
    const list = document.getElementById('dayList');
    let lastModule = 0;
    const lessons = this.activeModule === 0 ? CURRICULUM : CURRICULUM.filter(l => l.module === this.activeModule);
    list.innerHTML = lessons.map(l => {
      let divider = '';
      if (l.module !== lastModule) {
        lastModule = l.module;
        const names = ['', 'Network Fundamentals', 'Network Access', 'IP Connectivity', 'IP Services', 'Security', 'Automation'];
        divider = `<li class="module-divider">📌 ${names[l.module] || 'Module ' + l.module}</li>`;
      }
      const done = this._progress[l.id] ? 'completed' : '';
      const active = this.currentLesson === l.id ? 'active' : '';
      return `${divider}<li class="day-item ${done} ${active}">
        <a href="#" onclick="app.loadLesson(${l.id}); return false;">
          <span class="day-num">M${l.module}-${String(l.id).padStart(2,'0')}</span>
          ${l.title}
        </a>
      </li>`;
    }).join('');
  },

  loadLesson(id) {
    const lesson = CURRICULUM.find(l => l.id === id);
    if (!lesson) return;
    this.currentLesson = id;
    this.goToSection('lessons');
    this.renderSidebar();

    const idx = CURRICULUM.indexOf(lesson);
    const prev = CURRICULUM[idx - 1];
    const next = CURRICULUM[idx + 1];
    const done = this._progress[id];

    const detail = document.getElementById('lessonDetail');
    detail.innerHTML = `
      <div class="lesson-title-bar">
        <h2>${lesson.title}</h2>
        <div class="lesson-meta">
          <span class="lesson-badge module-${lesson.module}">মডিউল ${lesson.module}</span>
          ${done ? '<span class="lesson-badge" style="background:rgba(63,185,80,.15);color:#3fb950">✅ সম্পন্ন</span>' : ''}
        </div>
      </div>
      <div class="lesson-body">${lesson.content}</div>
      ${lesson.lab ? `<div class="note-box" style="margin-top:1.5rem">
        💻 <strong>ল্যাব:</strong> CLI ল্যাবে গিয়ে এই কমান্ডটি চেষ্টা করুন: <code>${lesson.lab}</code>
        <button onclick="app.openLab('${lesson.lab}')" style="margin-left:0.5rem; background:var(--cisco-blue); border:none; color:white; padding:3px 10px; border-radius:6px; cursor:pointer; font-size:0.8rem;">ল্যাবে যাও →</button>
      </div>` : ''}
      <div class="lesson-nav-row">
        ${prev ? `<button class="btn-lesson-nav" onclick="app.loadLesson(${prev.id})">← পূর্ববর্তী</button>` : '<span></span>'}
        <button class="btn-complete ${done ? 'done' : ''}" id="btnComplete" onclick="app.markComplete(${id})" ${done ? 'disabled' : ''}>
          ${done ? '✅ সম্পন্ন হয়েছে' : '✔ পাঠ সম্পন্ন করুন'}
        </button>
        ${next ? `<button class="btn-lesson-nav" onclick="app.loadLesson(${next.id})">পরবর্তী →</button>` : '<span></span>'}
      </div>
    `;
    detail.scrollTop = 0;
  },

  openLab(cmd) {
    this.goToSection('lab');
    const input = document.getElementById('termInput');
    if (input) { input.value = cmd; input.focus(); }
  },

  renderCommandTable(cat) {
    document.querySelectorAll('.cmd-cat-btn').forEach(b => {
      b.classList.toggle('active', b.getAttribute('onclick').includes(`'${cat}'`));
    });
    const filtered = cat === 'all' ? COMMANDS : COMMANDS.filter(c => c.cat === cat);
    const wrap = document.getElementById('cmdTableWrap');
    wrap.innerHTML = `<table>
      <thead><tr><th>কমান্ড</th><th>সংক্ষিপ্ত</th><th>Mode</th><th>বর্ণনা (বাংলা)</th></tr></thead>
      <tbody>${filtered.map(c => `<tr>
        <td>${c.cmd}</td>
        <td>${c.short || '—'}</td>
        <td><span class="cmd-mode-badge">${c.mode}</span></td>
        <td>${c.desc}</td>
      </tr>`).join('')}</tbody>
    </table>`;
  },

  filterCmds(cat) { this.renderCommandTable(cat); },

  renderCheatsheet() {
    const grid = document.getElementById('cheatsheetGrid');
    grid.innerHTML = CHEATSHEETS.map(cs => `
      <div class="cs-card">
        <div class="cs-card-header">${cs.title}</div>
        <div class="cs-card-body">
          ${cs.items.map(item => `<div class="cs-row"><span class="cs-cmd">${item.cmd}</span><span class="cs-desc">${item.desc}</span></div>`).join('')}
        </div>
      </div>
    `).join('');
  },

  renderScenarios() {
    const list = document.getElementById('scenarioList');
    const type = DeviceState.type;
    const scenarios = SCENARIOS[type] || [];
    list.innerHTML = scenarios.map((s, i) => `
      <button class="scenario-btn" onclick="app.runScenario(${i})">${s.label}</button>
    `).join('');
  },

  runScenario(idx) {
    const scenarios = SCENARIOS[DeviceState.type] || [];
    const s = scenarios[idx];
    if (!s) return;
    this.resetDevice(false);
    const output = document.getElementById('termOutput');
    let delay = 0;
    this.clearTerminal();
    s.cmds.forEach(cmd => {
      setTimeout(() => {
        this.executeCommand(cmd, true);
      }, delay);
      delay += 150;
    });
  },

  // ---- TERMINAL ----
  initTerminal() {
    const input = document.getElementById('termInput');
    const terminal = document.getElementById('terminal');

    terminal.addEventListener('click', () => input.focus());

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const cmd = input.value;
        input.value = '';
        this.executeCommand(cmd);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (DeviceState.historyIndex < DeviceState.history.length - 1) {
          DeviceState.historyIndex++;
          input.value = DeviceState.history[DeviceState.history.length - 1 - DeviceState.historyIndex] || '';
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (DeviceState.historyIndex > 0) {
          DeviceState.historyIndex--;
          input.value = DeviceState.history[DeviceState.history.length - 1 - DeviceState.historyIndex] || '';
        } else {
          DeviceState.historyIndex = -1;
          input.value = '';
        }
      } else if (e.key === 'Tab') {
        e.preventDefault();
        this.autocomplete(input);
      }
    });

    // Boot sequence
    const out = document.getElementById('termOutput');
    out.innerHTML = `<span class="line-info">Cisco IOS Software, Version 15.6(3)M2
Compiled Mon 28-Jun-21 12:00 by mcpre

         Cisco ${DeviceState.type === 'switch' ? 'Catalyst 2960' : '1941'} — NetPath CCNA ল্যাব সিমুলেটর
         ⌨️  কমান্ড লিখুন এবং Enter চাপুন।
         💡 '?' টাইপ করুন সব কমান্ড দেখতে।
         ⬆️⬇️ Arrow Key দিয়ে History দেখুন।

</span>`;
    this.updatePrompt();
  },

  autocomplete(input) {
    const t = input.value.toLowerCase().trim();
    const allCmds = ['enable', 'configure terminal', 'exit', 'end', 'show', 'ping', 'traceroute', 'interface', 'ip address', 'no shutdown', 'hostname', 'router ospf', 'router eigrp', 'vlan', 'write memory', 'show ip route', 'show ip interface brief', 'show running-config', 'show version', 'show interfaces', 'show vlan brief', 'show spanning-tree', 'show access-lists', 'show ip nat translations'];
    const match = allCmds.find(c => c.startsWith(t) && c !== t);
    if (match) input.value = match;
  },

  executeCommand(rawCmd, silent = false) {
    if (!rawCmd.trim() && !silent) return;
    const output = document.getElementById('termOutput');
    const prompt = getPrompt();

    if (!silent) {
      DeviceState.history.push(rawCmd);
      DeviceState.historyIndex = -1;
    }

    // Print command line
    const cmdLine = document.createElement('div');
    cmdLine.className = 'line-cmd';
    cmdLine.textContent = `${prompt} ${rawCmd}`;
    output.appendChild(cmdLine);

    const result = parseCmd(rawCmd);

    if (result && result.type !== 'prompt') {
      const resLine = document.createElement('div');
      resLine.className = result.type === 'error' ? 'line-err' : result.type === 'success' ? 'line-success' : result.type === 'warn' ? 'line-warn' : 'line-info';
      resLine.textContent = result.text;
      output.appendChild(resLine);
    }

    const blankLine = document.createElement('div');
    blankLine.textContent = '';
    output.appendChild(blankLine);

    this.updatePrompt();
    const terminal = document.getElementById('terminal');
    terminal.scrollTop = terminal.scrollHeight;
  },

  updatePrompt() {
    document.getElementById('termPrompt').textContent = getPrompt();
    document.getElementById('termTitle').textContent = `${DeviceState.config.hostname} — ${DeviceState.type === 'switch' ? 'Cisco Switch' : 'Cisco Router'} Simulator`;
  },

  clearTerminal() {
    document.getElementById('termOutput').innerHTML = '';
    this.updatePrompt();
  },

  resetDevice(confirm = true) {
    if (confirm && !window.confirm('ডিভাইস রিসেট করবেন? সব Config মুছে যাবে।')) return;
    DeviceState.mode = 'user';
    DeviceState.config = { interfaces: {}, routes: [], vlans: { 1: 'default' }, ospf: null, eigrp: null, hostname: DeviceState.type === 'switch' ? 'Switch' : 'Router', passwords: {}, acls: {}, dhcpPools: {} };
    DeviceState.history = [];
    DeviceState.historyIndex = -1;
    DeviceState.currentIface = null;
    this.clearTerminal();
    const out = document.getElementById('termOutput');
    out.innerHTML = '<span class="line-success">✅ ডিভাইস রিসেট সম্পন্ন। নতুন করে শুরু করুন।\n</span>';
    this.updatePrompt();
  },

  setDevice(type) {
    DeviceState.type = type;
    DeviceState.config.hostname = type === 'switch' ? 'Switch' : 'Router';
    document.getElementById('devRouter').classList.toggle('active', type === 'router');
    document.getElementById('devSwitch').classList.toggle('active', type === 'switch');
    this.renderScenarios();
    this.resetDevice(false);
    const out = document.getElementById('termOutput');
    out.innerHTML = `<span class="line-info">ডিভাইস পরিবর্তিত হয়েছে: ${type === 'switch' ? 'Cisco Catalyst 2960 Switch' : 'Cisco 1941 Router'}\n</span>`;
    this.updatePrompt();
  },

  // ---- NAVIGATION ----
  initNav() {
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const section = link.dataset.section;
        this.goToSection(section);
      });
    });

    document.getElementById('hamburger').addEventListener('click', () => {
      document.getElementById('sidebar').classList.toggle('open');
    });

    // Close sidebar on mobile when clicking content
    document.querySelector('.main-content').addEventListener('click', () => {
      if (window.innerWidth < 900) {
        document.getElementById('sidebar').classList.remove('open');
      }
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

    input.addEventListener('input', () => {
      const q = input.value.toLowerCase().trim();
      if (!q) { results.classList.remove('open'); return; }
      const matches = CURRICULUM.filter(l => l.title.toLowerCase().includes(q) || l.content.toLowerCase().includes(q)).slice(0, 8);
      if (!matches.length) { results.innerHTML = '<div class="search-result-item" style="color:var(--text-secondary)">কোনো ফলাফল পাওয়া যায়নি।</div>'; results.classList.add('open'); return; }
      results.innerHTML = matches.map(m => `<div class="search-result-item" onclick="app.loadLesson(${m.id}); document.getElementById('searchInput').value=''; document.getElementById('searchResults').classList.remove('open');">M${m.module}-${m.id}: ${m.title}</div>`).join('');
      results.classList.add('open');
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.search-wrap')) results.classList.remove('open');
    });
  },

  // ---- THEME ----
  initTheme() {
    const btn = document.getElementById('themeToggle');
    const saved = localStorage.getItem('ccna_theme') || 'dark';
    document.body.className = saved + '-mode';
    btn.textContent = saved === 'dark' ? '☀️' : '🌙';

    btn.addEventListener('click', () => {
      const isDark = document.body.classList.contains('dark-mode');
      document.body.className = isDark ? 'light-mode' : 'dark-mode';
      btn.textContent = isDark ? '🌙' : '☀️';
      localStorage.setItem('ccna_theme', isDark ? 'light' : 'dark');
    });
  },
};

// ================= QUIZ LOGIC =================
const allQuizData = [
  { q: "OSI Model-এর কোন লেয়ারে IP Address কাজ করে?", options: ["Data Link Layer", "Network Layer", "Transport Layer", "Application Layer"], ans: 1, exp: "IP Address হলো Logical Address যা Network Layer (Layer 3)-এ কাজ করে। রাউটার এই লেয়ারে কাজ করে।" },
  { q: "একটি /24 সাবনেটে কতগুলো ব্যবহারযোগ্য IP ঠিকানা (Usable Host IPs) থাকে?", options: ["256", "255", "254", "128"], ans: 2, exp: "সূত্র: (2^H) - 2। এখানে Host bit হলো 8 (32 - 24)। সুতরাং, 2^8 - 2 = 256 - 2 = 254।" },
  { q: "কোন প্রোটোকলটি IP Address থেকে MAC Address খুঁজে বের করে?", options: ["DNS", "DHCP", "ARP", "ICMP"], ans: 2, exp: "ARP (Address Resolution Protocol) একটি প্রদত্ত IP Address এর বিপরীতে সংশ্লিষ্ট MAC Address খুঁজে বের করে।" },
  { q: "OSPF এর Administrative Distance (AD) কত?", options: ["90", "110", "120", "1"], ans: 1, exp: "OSPF এর AD হলো 110। EIGRP এর 90, RIP এর 120 এবং Static Route এর AD 1।" },
  { q: "TCP এবং UDP এর মধ্যে মূল পার্থক্য কী?", options: ["TCP Connectionless, UDP Connection-oriented", "TCP Reliable, UDP Unreliable", "TCP ভিডিও স্ট্রিমিং এর জন্য, UDP ফাইলের জন্য", "কোনো পার্থক্য নেই"], ans: 1, exp: "TCP একটি Connection-oriented এবং Reliable প্রোটোকল। এটি Data ডেলিভারি নিশ্চিত করে। UDP Connectionless এবং Unreliable (দ্রুত)।" },
  { q: "Default Route এর IP ও Subnet Mask কনফিগারেশন কী?", options: ["0.0.0.0 255.255.255.255", "255.255.255.255 0.0.0.0", "0.0.0.0 0.0.0.0", "10.0.0.0 0.0.0.0"], ans: 2, exp: "Default Route কনফিগার করা হয় 'ip route 0.0.0.0 0.0.0.0 [Next Hop/Interface]' কমান্ড দিয়ে।" },
  { q: "VLAN (Virtual LAN) কেন ব্যবহার করা হয়?", options: ["রাউটিং বন্ধ করার জন্য", "ব্রডকাস্ট ডোমেইন (Broadcast Domain) ছোট করার জন্য", "ব্যান্ডউইথ কমানোর জন্য", "ইন্টারনেট স্পিড বাড়ানোর জন্য"], ans: 1, exp: "VLAN লজিক্যালি একটি ফিজিক্যাল সুইচকে একাধিক সুইচে ভাগ করে, ফলে ব্রডকাস্ট ডোমেইন ছোট হয় এবং সিকিউরিটি বাড়ে।" },
  { q: "NAT (Network Address Translation) এর প্রধান কাজ কী?", options: ["MAC Address পরিবর্তন করা", "Private IP কে Public IP তে রূপান্তর করা", "ভিপিএন (VPN) তৈরি করা", "ডেটা এনক্রিপ্ট করা"], ans: 1, exp: "NAT ইন্টারনেটে অ্যাক্সেস দেওয়ার জন্য লোকাল Private IP Address কে Public IP Address এ ট্রান্সলেট করে।" },
  { q: "STP (Spanning Tree Protocol) কেন প্রয়োজন?", options: ["ডেটা এনক্রিপ্ট করতে", "ইন্টারনেট কানেকশন শেয়ার করতে", "লেয়ার ২ লুপ (Layer 2 Loop) প্রতিরোধ করতে", "IP Address দিতে"], ans: 2, exp: "STP নেটওয়ার্কের রিডান্ড্যান্ট (Redundant) লিংকগুলোতে লুপ তৈরি হওয়া বন্ধ করে, যা ব্রডকাস্ট স্টর্ম (Broadcast Storm) থেকে সুইচকে রক্ষা করে।" },
  { q: "সুইচের (Switch) মূল কাজ কী?", options: ["MAC Address Table তৈরি করা এবং Frame ফরওয়ার্ড করা", "Routing Table তৈরি করা", "IP Address বিতরণ করা", "Wi-Fi সিগন্যাল প্রদান করা"], ans: 0, exp: "সুইচ Layer 2 তে কাজ করে এবং MAC Address এর উপর ভিত্তি করে ডেটা (Frame) নির্দিষ্ট পোর্টে পাঠায়।" },
  { q: "কোন IPv4 ক্লাসটি মাল্টিকাস্ট (Multicast) এর জন্য সংরক্ষিত?", options: ["Class A", "Class B", "Class C", "Class D"], ans: 3, exp: "Class D (224.0.0.0 থেকে 239.255.255.255) মাল্টিকাস্টিং এর জন্য ব্যবহৃত হয়।" },
  { q: "Ping কমান্ড কোন প্রোটোকল ব্যবহার করে কাজ করে?", options: ["TCP", "UDP", "ICMP", "ARP"], ans: 2, exp: "Ping এবং Traceroute সাধারণত ICMP (Internet Control Message Protocol) ব্যবহার করে।" },
  { q: "IPv6 অ্যাড্রেস কত বিটের (bits) হয়ে থাকে?", options: ["32 bit", "64 bit", "128 bit", "256 bit"], ans: 2, exp: "IPv4 হলো 32 bit এবং IPv6 হলো 128 bit।" },
  { q: "কোন পোর্ট নম্বরটি HTTP-এর জন্য ব্যবহৃত হয়?", options: ["21", "22", "80", "443"], ans: 2, exp: "HTTP পোর্ট 80 এবং HTTPS পোর্ট 443 ব্যবহার করে।" },
  { q: "SSH (Secure Shell) কোন পোর্টে কাজ করে?", options: ["20", "21", "22", "23"], ans: 2, exp: "SSH পোর্ট 22 ব্যবহার করে। 23 হলো Telnet এর পোর্ট।" },
  { q: "কোন ডিভাইস ব্রডকাস্ট ডোমেইনকে আলাদা করে?", options: ["Hub", "Switch", "Router", "Bridge"], ans: 2, exp: "রাউটার ব্রডকাস্ট মেসেজ ফরওয়ার্ড করে না, তাই প্রতিটি ইন্টারফেস আলাদা ব্রডকাস্ট ডোমেইন তৈরি করে।" },
  { q: "Dynamic Routing Protocol-এর উদাহরণ কোনটি?", options: ["Static Routing", "Default Routing", "OSPF", "ARP"], ans: 2, exp: "OSPF, EIGRP, RIP, BGP ইত্যাদি হলো Dynamic Routing Protocol।" },
  { q: "VTP (VLAN Trunking Protocol) এর মূল কাজ কী?", options: ["VLAN তৈরি ও ম্যানেজ করা সহজ করা", "VLAN সিকিউরিটি বাড়ানো", "Routing করা", "Loop বন্ধ করা"], ans: 0, exp: "VTP-এর মাধ্যমে একটি সুইচ (Server) থেকে অন্য সুইচগুলোতে (Client) স্বয়ংক্রিয়ভাবে VLAN তথ্য ছড়ানো যায়।" },
  { q: "Trunk port-এর মাধ্যমে একাধিক VLAN-এর ডেটা পাঠানোর প্রোটোকল কোনটি?", options: ["802.1Q", "802.11", "STP", "CDP"], ans: 0, exp: "802.1Q (Dot1Q) হলো স্ট্যান্ডার্ড ট্রাঙ্কিং প্রোটোকল যা ফ্রেমে VLAN ট্যাগ যুক্ত করে।" },
  { q: "Access Control List (ACL) কোন কাজে ব্যবহৃত হয়?", options: ["ইন্টারনেট স্পিড বাড়াতে", "ট্রাফিক ফিল্টার বা ব্লক করতে", "Routing Table আপডেট করতে", "MAC Address খুঁজতে"], ans: 1, exp: "ACL ব্যবহার করে নির্দিষ্ট IP বা পোর্ট ব্লক (Deny) বা পারমিট (Permit) করা হয়।" },
  { q: "Standard ACL এর নাম্বার রেঞ্জ কত?", options: ["1-99", "100-199", "200-299", "300-399"], ans: 0, exp: "Standard ACL 1-99 এবং 1300-1999। Extended ACL 100-199 এবং 2000-2699।" },
  { q: "CDP (Cisco Discovery Protocol) কার জন্য ব্যবহৃত হয়?", options: ["সকল ব্র্যান্ডের ডিভাইসের জন্য", "শুধুমাত্র Cisco ডিভাইসের জন্য", "লুপ বন্ধ করার জন্য", "রুট খোঁজার জন্য"], ans: 1, exp: "CDP হলো Cisco-র নিজস্ব প্রোটোকল যা সরাসরি যুক্ত থাকা Cisco ডিভাইসগুলোর তথ্য দেয়। (LLDP হলো ওপেন স্ট্যান্ডার্ড)।" },
  { q: "Port Security Violation-এ ডিফল্ট মুড কী থাকে?", options: ["Protect", "Restrict", "Shutdown", "Disable"], ans: 2, exp: "ডিফল্টভাবে Violation হলে পোর্ট 'Shutdown' (err-disable) অবস্থায় চলে যায়।" },
  { q: "Wireless ল্যানে (WLAN) কোন প্রোটোকল ব্যবহৃত হয়?", options: ["802.3", "802.1Q", "802.11", "802.1X"], ans: 2, exp: "802.11 হলো Wireless LAN-এর স্ট্যান্ডার্ড। 802.3 হলো ইথারনেট।" },
  { q: "DORA প্রসেস কোন প্রোটোকলের সাথে সম্পর্কিত?", options: ["DNS", "ARP", "DHCP", "OSPF"], ans: 2, exp: "DHCP-এর IP পাওয়ার প্রক্রিয়া হলো DORA: Discover, Offer, Request, Acknowledge।" },
  { q: "First Hop Redundancy Protocol (FHRP) এর উদাহরণ কোনটি?", options: ["HSRP", "OSPF", "EIGRP", "BGP"], ans: 0, exp: "HSRP, VRRP, GLBP হলো FHRP এর উদাহরণ যা ডিফল্ট গেটওয়েকে রিডান্ড্যান্ট করে।" },
  { q: "PoE (Power over Ethernet) এর কাজ কী?", options: ["ডেটার গতি বাড়ানো", "ইথারনেট কেবলের মাধ্যমেই বিদ্যুৎ সরবরাহ করা", "পাসওয়ার্ড সেট করা", "লুপ বন্ধ করা"], ans: 1, exp: "PoE-এর মাধ্যমে সুইচ থেকে আইপি ফোন, এক্সেস পয়েন্ট বা ক্যামেরায় বিদ্যুৎ সরবরাহ করা যায়।" },
  { q: "SDN (Software Defined Networking) এ কন্ট্রোল প্লেন এবং ডেটা প্লেন এর অবস্থা কী?", options: ["দুটোই একসাথে থাকে", "আলাদা করা থাকে (Separated)", "কন্ট্রোল প্লেন থাকে না", "ডেটা প্লেন থাকে না"], ans: 1, exp: "SDN-এ কন্ট্রোল প্লেন (বুদ্ধিমত্তা) এবং ডেটা প্লেন (ফরওয়ার্ডিং) আলাদা করা হয়।" },
  { q: "REST API কোন ফরম্যাটে ডেটা প্রদান করে?", options: ["XML এবং JSON", "শুধুমাত্র HTML", "শুধুমাত্র Text", "Binary format"], ans: 0, exp: "REST API সাধারণত JSON এবং XML ফরম্যাটে ডেটা আদান-প্রদান করে।" },
  { q: "Subnet Mask 255.255.255.224 এর সিআইডিআর (CIDR) ভ্যালু কত?", options: ["/24", "/25", "/26", "/27"], ans: 3, exp: "224 মানে হলো 11100000, অর্থাৎ ৩টি বিট অন। 24 + 3 = 27। তাই CIDR হলো /27।" },
  { q: "APIPA (Automatic Private IP Addressing) এর রেঞ্জ কত?", options: ["10.0.0.0/8", "172.16.0.0/12", "192.168.0.0/16", "169.254.0.0/16"], ans: 3, exp: "ডিভাইস যখন DHCP থেকে IP পায় পণ্ডিত না, তখন সে নিজে নিজে 169.254.x.x রেঞ্জের একটি IP বসিয়ে নেয়।" },
  { q: "DNS (Domain Name System) এর কাজ কী?", options: ["MAC Address বের করা", "Domain Name কে IP Address এ রূপান্তর করা", "IP Address বিতরণ করা", "ইন্টারনেট স্পিড কন্ট্রোল করা"], ans: 1, exp: "DNS (যেমন google.com) কে মেশিনের বোধগম্য IP Address এ রূপান্তর করে।" },
  { q: "কোন কমান্ডের মাধ্যমে রাউটারের কনফিগারেশন সেভ করা হয়?", options: ["save config", "copy running-config startup-config", "write config", "store memory"], ans: 1, exp: "কনফিগারেশন সেভ করতে 'copy running-config startup-config' বা সংক্ষেপে 'write' কমান্ড ব্যবহৃত হয়।" }
];

const quizApp = {
  currentQuizData: [],
  currentIdx: 0,
  score: 0,
  userAnswers: [],
  timeLeft: 300, // 5 minutes
  timerInt: null,

  startQuiz() {
    this.currentIdx = 0;
    this.score = 0;
    this.timeLeft = 300;
    
    // 1. Shuffle all questions
    const shuffledQuestions = [...allQuizData].sort(() => 0.5 - Math.random());
    
    // 2. Pick top 10 questions
    const selectedQuestions = shuffledQuestions.slice(0, 10);
    
    // 3. Shuffle options for each question to make it fully random
    this.currentQuizData = selectedQuestions.map(q => {
      const originalCorrectAnsText = q.options[q.ans];
      
      // clone options and shuffle
      const shuffledOptions = [...q.options].sort(() => 0.5 - Math.random());
      
      // find new index of correct answer
      const newAnsIndex = shuffledOptions.indexOf(originalCorrectAnsText);
      
      return {
        q: q.q,
        options: shuffledOptions,
        ans: newAnsIndex,
        exp: q.exp
      };
    });

    this.userAnswers = new Array(this.currentQuizData.length).fill(null);
    
    document.getElementById('quizIntro').style.display = 'none';
    document.getElementById('quizResult').style.display = 'none';
    document.getElementById('quizPlay').style.display = 'block';
    
    this.startTimer();
    this.loadQuestion();
  },

  startTimer() {
    clearInterval(this.timerInt);
    this.timerInt = setInterval(() => {
      this.timeLeft--;
      let m = Math.floor(this.timeLeft / 60).toString().padStart(2, '0');
      let s = (this.timeLeft % 60).toString().padStart(2, '0');
      document.getElementById('quizTimer').textContent = 'সময়: ' + m + ':' + s;
      
      if (this.timeLeft <= 0) {
        clearInterval(this.timerInt);
        this.finishQuiz();
      }
    }, 1000);
  },

  loadQuestion() {
    const q = this.currentQuizData[this.currentIdx];
    document.getElementById('quizQuestionCount').textContent = 'প্রশ্ন ' + (this.currentIdx + 1) + ' / ' + this.currentQuizData.length;
    document.getElementById('quizQuestionText').textContent = q.q;
    
    // Progress
    const pct = ((this.currentIdx) / this.currentQuizData.length) * 100;
    document.getElementById('quizProgressFill').style.width = pct + '%';

    const optsContainer = document.getElementById('quizOptions');
    optsContainer.innerHTML = '';
    
    q.options.forEach((opt, idx) => {
      const d = document.createElement('div');
      d.className = 'quiz-option';
      d.textContent = opt;
      d.onclick = () => this.selectOption(idx);
      
      if (this.userAnswers[this.currentIdx] === idx) {
        d.classList.add('selected');
      }
      optsContainer.appendChild(d);
    });

    document.getElementById('quizNextBtn').disabled = (this.userAnswers[this.currentIdx] === null);
    document.getElementById('quizNextBtn').textContent = (this.currentIdx === this.currentQuizData.length - 1) ? 'শেষ করুন' : 'পরবর্তী প্রশ্ন';
  },

  selectOption(idx) {
    this.userAnswers[this.currentIdx] = idx;
    this.loadQuestion(); // re-render to show selection
  },

  nextQuestion() {
    if (this.currentIdx < this.currentQuizData.length - 1) {
      this.currentIdx++;
      this.loadQuestion();
    } else {
      this.finishQuiz();
    }
  },

  finishQuiz() {
    clearInterval(this.timerInt);
    document.getElementById('quizPlay').style.display = 'none';
    document.getElementById('quizResult').style.display = 'block';
    
    let correctCount = 0;
    const reviewHtml = [];

    this.currentQuizData.forEach((q, idx) => {
      const uAns = this.userAnswers[idx];
      const isCorrect = (uAns === q.ans);
      if (isCorrect) correctCount++;

      let html = '<div class="review-item ' + (isCorrect ? 'review-correct' : 'review-wrong') + '">';
      html += '<p><strong>প্রশ্ন ' + (idx+1) + ':</strong> ' + q.q + '</p>';
      
      if (uAns !== null) {
        html += '<p>আপনার উত্তর: <span style="color:' + (isCorrect?'var(--success)':'var(--danger)') + '">' + q.options[uAns] + '</span></p>';
      } else {
        html += '<p>আপনার উত্তর: <span style="color:var(--danger)">উত্তর দেওয়া হয়নি</span></p>';
      }

      if (!isCorrect) {
        html += '<p>সঠিক উত্তর: <span style="color:var(--success)">' + q.options[q.ans] + '</span></p>';
      }
      
      html += '<div class="review-explanation">' + q.exp + '</div>';
      html += '</div>';
      reviewHtml.push(html);
    });

    const finalPct = Math.round((correctCount / this.currentQuizData.length) * 100);
    document.getElementById('quizScore').textContent = finalPct + '%';
    
    let msg = '';
    if (finalPct >= 80) msg = 'অসাধারণ! আপনি CCNA পরীক্ষার জন্য বেশ প্রস্তুত। 🚀';
    else if (finalPct >= 50) msg = 'ভালো চেষ্টা! তবে আরও একটু পড়াশোনা করতে হবে। 📖';
    else msg = 'হতাশ হবেন না! ড্যাশবোর্ডের লেসনগুলো আবার ভালো করে পড়ে নিন। 💪';
    
    document.getElementById('quizMessage').textContent = msg;
    document.getElementById('quizReview').innerHTML = reviewHtml.join('');
    
    // Final progress bar
    document.getElementById('quizProgressFill').style.width = '100%';
  },

  restartQuiz() {
    this.startQuiz();
  }
};

document.addEventListener('DOMContentLoaded', () => app.init());
