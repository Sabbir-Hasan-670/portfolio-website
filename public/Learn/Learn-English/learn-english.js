/* ============================================================
   FluentPath – 30-Day English Mastery Course
   script.js  |  Full Application Logic with 1-30 Days Bangla Map
   ============================================================ */

'use strict';

/* ============================================================
   DATA – 30 DAYS COURSE CONTENT
   ============================================================ */
const COURSE_DAYS = [
  {
    day: 1, title: "The English Alphabet & Basic Sounds", level: "beginner",
    topics: ["Alphabet", "Vowels & Consonants", "Basic Phonics"],
    description: "Master the 26 letters of the English alphabet, understand vowels and consonants, and learn basic phonics rules.",
    grammar: {
      title: "The English Alphabet",
      content: `<p>The English alphabet has <strong>26 letters</strong>: 5 vowels (A, E, I, O, U) and 21 consonants.</p>
      <div class="vocab-day-list">
        <div class="vocab-day-item"><div class="vdi-word">Vowels</div><div class="vdi-def">A, E, I, O, U – the open sounds</div></div>
        <div class="vocab-day-item"><div class="vdi-word">Consonants</div><div class="vdi-def">All other 21 letters</div></div>
        <div class="vocab-day-item"><div class="vdi-word">Phonics</div><div class="vdi-def">The relationship between letters and sounds</div></div>
      </div>
      <table class="grammar-table"><thead><tr><th>Letter</th><th>Name (IPA)</th><th>Bangla Sound</th><th>Sound Example</th></tr></thead>
      <tbody>
        <tr><td>A</td><td>/eɪ/</td><td><strong style="color: #2563eb;">এই</strong></td><td>apple, ant</td></tr>
        <tr><td>B</td><td>/biː/</td><td><strong style="color: #2563eb;">বি</strong></td><td>ball, book</td></tr>
        <tr><td>C</td><td>/siː/</td><td><strong style="color: #2563eb;">সি</strong></td><td>cat, cup</td></tr>
        <tr><td>D</td><td>/diː/</td><td><strong style="color: #2563eb;">ডি</strong></td><td>dog, door</td></tr>
        <tr><td>E</td><td>/iː/</td><td><strong style="color: #2563eb;">ই</strong></td><td>egg, end</td></tr>
        <tr><td>F</td><td>/ɛf/</td><td><strong style="color: #2563eb;">এফ</strong></td><td>fish, fan</td></tr>
        <tr><td>G</td><td>/dʒiː/</td><td><strong style="color: #2563eb;">জি</strong></td><td>goat, girl</td></tr>
        <tr><td>H</td><td>/eɪtʃ/</td><td><strong style="color: #2563eb;">এইচ</strong></td><td>hat, hand</td></tr>
        <tr><td>I</td><td>/aɪ/</td><td><strong style="color: #2563eb;">আই</strong></td><td>ice, ink</td></tr>
        <tr><td>J</td><td>/dʒeɪ/</td><td><strong style="color: #2563eb;">জেই</strong></td><td>jam, juice</td></tr>
        <tr><td>K</td><td>/keɪ/</td><td><strong style="color: #2563eb;">কেই</strong></td><td>kite, king</td></tr>
        <tr><td>L</td><td>/ɛl/</td><td><strong style="color: #2563eb;">এল</strong></td><td>lamp, leg</td></tr>
        <tr><td>M</td><td>/ɛm/</td><td><strong style="color: #2563eb;">এম</strong></td><td>man, milk</td></tr>
        <tr><td>N</td><td>/ɛn/</td><td><strong style="color: #2563eb;">এন</strong></td><td>net, nest</td></tr>
        <tr><td>O</td><td>/oʊ/</td><td><strong style="color: #2563eb;">ওউ</strong></td><td>orange, owl</td></tr>
        <tr><td>P</td><td>/piː/</td><td><strong style="color: #2563eb;">পি</strong></td><td>pen, pencil</td></tr>
        <tr><td>Q</td><td>/kjuː/</td><td><strong style="color: #2563eb;">কিউ</strong></td><td>queen, quick</td></tr>
        <tr><td>R</td><td>/ɑːr/</td><td><strong style="color: #2563eb;">আর</strong></td><td>red, ring</td></tr>
        <tr><td>S</td><td>/ɛs/</td><td><strong style="color: #2563eb;">এস</strong></td><td>sun, star</td></tr>
        <tr><td>T</td><td>/tiː/</td><td><strong style="color: #2563eb;">টি</strong></td><td>tea, tree</td></tr>
        <tr><td>U</td><td>/juː/</td><td><strong style="color: #2563eb;">ইউ</strong></td><td>umbrella, use</td></tr>
        <tr><td>V</td><td>/viː/</td><td><strong style="color: #2563eb;">ভি</strong></td><td>van, vase</td></tr>
        <tr><td>W</td><td>/ˈdʌb.əl.juː/</td><td><strong style="color: #2563eb;">ডাবল-ইউ</strong></td><td>water, window</td></tr>
        <tr><td>X</td><td>/ɛks/</td><td><strong style="color: #2563eb;">এক্স</strong></td><td>x-ray, box</td></tr>
        <tr><td>Y</td><td>/waɪ/</td><td><strong style="color: #2563eb;">ওয়াই</strong></td><td>yo-yo, yellow</td></tr>
        <tr><td>Z</td><td>/zɛd/ /ziː/</td><td><strong style="color: #2563eb;">জেড / জি</strong></td><td>zebra, zoo</td></tr>
      </tbody></table>`
    },
    vocabulary: ["hello", "goodbye", "yes", "no", "please", "thank you", "sorry", "excuse me", "name", "age"],
    speaking: "Practice saying the alphabet aloud. Sing the ABC song. Record yourself and listen back.",
    writing: "Write each letter of the alphabet 5 times in uppercase and lowercase.",
    quiz: [
      { type: "mcq", question: "How many letters are in the English alphabet?", options: ["24", "25", "26", "27"], answer: 2 },
      { type: "mcq", question: "Which of these is a vowel?", options: ["B", "C", "E", "F"], answer: 2 },
      { type: "fill", question: "The English alphabet has ___ vowels.", answer: "5" },
      { type: "mcq", question: "Which word starts with a vowel sound?", options: ["Ball", "Cat", "Apple", "Dog"], answer: 2 },
      { type: "fill", question: "A, E, I, O, ___ are the five vowels.", answer: "U" }
    ]
  },
  {
    day: 2, title: "Greetings & Introductions", level: "beginner",
    topics: ["Greetings", "Introductions", "Basic Questions"],
    description: "Learn how to greet people, introduce yourself, and ask basic questions in English.",
    grammar: {
      title: "Subject Pronouns & 'To Be'",
      content: `<p>Use subject pronouns with the verb <strong>'to be'</strong> to introduce yourself.</p>
      <table class="grammar-table"><thead><tr><th>Pronoun</th><th>To Be</th><th>Example</th></tr></thead>
      <tbody>
        <tr><td>I</td><td>am</td><td>I am Maria.</td></tr>
        <tr><td>You</td><td>are</td><td>You are my friend.</td></tr>
        <tr><td>He/She/It</td><td>is</td><td>She is a teacher.</td></tr>
        <tr><td>We/They</td><td>are</td><td>We are students.</td></tr>
      </tbody></table>`
    },
    vocabulary: ["hello", "hi", "good morning", "good afternoon", "good evening", "my name is", "nice to meet you", "how are you", "I am fine", "see you later"],
    speaking: "Practice the dialogue: 'Hello! My name is ___. Nice to meet you!' with a partner or in front of a mirror.",
    writing: "Write 5 sentences introducing yourself: your name, age, country, job/study, and a hobby.",
    quiz: [
      { type: "mcq", question: "Which greeting is used in the morning?", options: ["Good night", "Good morning", "Good evening", "Goodbye"], answer: 1 },
      { type: "fill", question: "My ___ is John.", answer: "name" },
      { type: "mcq", question: "Complete: 'I ___ a student.'", options: ["am", "is", "are", "be"], answer: 0 },
      { type: "mcq", question: "What do you say when you first meet someone?", options: ["Goodbye", "See you later", "Nice to meet you", "Good night"], answer: 2 },
      { type: "fill", question: "How ___ you? I am fine, thank you.", answer: "are" }
    ]
  },
  {
    day: 3, title: "Numbers, Colors & Basic Nouns", level: "beginner",
    topics: ["Numbers 1-100", "Colors", "Common Nouns"],
    description: "Learn numbers from 1 to 100, all basic colors, and essential everyday nouns.",
    grammar: {
      title: "Nouns – Singular & Plural",
      content: `<p>A <strong>noun</strong> is a person, place, thing, or idea. Most nouns form their plural by adding <strong>-s</strong> or <strong>-es</strong>.</p>
      <table class="grammar-table"><thead><tr><th>Singular</th><th>Plural</th><th>Rule</th></tr></thead>
      <tbody>
        <tr><td>cat</td><td>cats</td><td>Add -s</td></tr>
        <tr><td>box</td><td>boxes</td><td>Add -es (after x, s, sh, ch)</td></tr>
        <tr><td>baby</td><td>babies</td><td>Change y → ies</td></tr>
        <tr><td>man</td><td>men</td><td>Irregular</td></tr>
        <tr><td>child</td><td>children</td><td>Irregular</td></tr>
      </tbody></table>`
    },
    vocabulary: ["one", "two", "three", "red", "blue", "green", "yellow", "black", "white", "book"],
    speaking: "Count from 1 to 20 aloud. Name 5 objects in your room and their colors.",
    writing: "Write the numbers 1-20 in words. Write 5 sentences: 'I have ___ red ___.'",
    quiz: [
      { type: "mcq", question: "What is the plural of 'child'?", options: ["childs", "childes", "children", "childer"], answer: 2 },
      { type: "fill", question: "The sky is ___.", answer: "blue" },
      { type: "mcq", question: "Which number comes after 19?", options: ["18", "21", "20", "22"], answer: 2 },
      { type: "mcq", question: "What is the plural of 'box'?", options: ["boxs", "boxes", "boxies", "box"], answer: 1 },
      { type: "fill", question: "Red, blue, and green are ___.", answer: "colors" }
    ]
  },
  {
    day: 4, title: "Present Simple Tense", level: "beginner",
    topics: ["Present Simple", "Daily Routines", "Frequency Adverbs"],
    description: "Master the present simple tense to talk about habits, routines, and general truths.",
    grammar: {
      title: "Present Simple Tense",
      content: `<p>Use the <strong>present simple</strong> for habits, routines, and facts.</p>
      <div class="formula-box">Subject + Base Verb (+ s/es for he/she/it)</div>
      <table class="grammar-table"><thead><tr><th>Subject</th><th>Positive</th><th>Negative</th><th>Question</th></tr></thead>
      <tbody>
        <tr><td>I/You/We/They</td><td>work</td><td>don't work</td><td>Do you work?</td></tr>
        <tr><td>He/She/It</td><td>works</td><td>doesn't work</td><td>Does she work?</td></tr>
      </tbody></table>
      <p><strong>Frequency Adverbs:</strong> always (100%) → usually → often → sometimes → rarely → never (0%)</p>`
    },
    vocabulary: ["wake up", "eat breakfast", "go to work", "study", "exercise", "cook dinner", "watch TV", "sleep", "always", "never"],
    speaking: "Describe your daily routine using present simple. 'I always wake up at 7 AM. I usually have coffee...'",
    writing: "Write a paragraph about your daily routine using at least 8 present simple sentences.",
    quiz: [
      { type: "mcq", question: "Which is correct?", options: ["She work every day.", "She works every day.", "She working every day.", "She do work every day."], answer: 1 },
      { type: "fill", question: "He ___ (not) eat meat. He is vegetarian.", answer: "doesn't" },
      { type: "mcq", question: "Which adverb means 100% of the time?", options: ["Sometimes", "Often", "Always", "Rarely"], answer: 2 },
      { type: "mcq", question: "Complete: '___ they speak English?'", options: ["Is", "Does", "Do", "Are"], answer: 2 },
      { type: "fill", question: "The sun ___ in the east.", answer: "rises" }
    ]
  },
  {
    day: 5, title: "Articles, Adjectives & Descriptions", level: "beginner",
    topics: ["Articles (a/an/the)", "Adjectives", "Describing People & Things"],
    description: "Learn to use articles correctly and describe people, places, and things with adjectives.",
    grammar: {
      title: "Articles: A, An, The",
      content: `<p><strong>A/An</strong> = indefinite (first mention, one of many). <strong>The</strong> = definite (specific, already known).</p>
      <table class="grammar-table"><thead><tr><th>Article</th><th>Use</th><th>Example</th></tr></thead>
      <tbody>
        <tr><td>a</td><td>Before consonant sounds</td><td>a book, a car</td></tr>
        <tr><td>an</td><td>Before vowel sounds</td><td>an apple, an hour</td></tr>
        <tr><td>the</td><td>Specific/unique things</td><td>the sun, the book I told you about</td></tr>
      </tbody></table>
      <p><strong>Adjective order:</strong> Opinion → Size → Age → Shape → Color → Origin → Material + Noun</p>
      <p>Example: a <em>beautiful little old rectangular green French silver</em> whittling knife</p>`
    },
    vocabulary: ["beautiful", "ugly", "big", "small", "old", "new", "fast", "slow", "happy", "sad"],
    speaking: "Describe 5 people or objects around you using at least 2 adjectives each.",
    writing: "Write 10 sentences using a/an/the correctly. Write a description of your bedroom.",
    quiz: [
      { type: "mcq", question: "Which is correct?", options: ["a apple", "an apple", "the apple", "an apples"], answer: 1 },
      { type: "fill", question: "I saw ___ elephant at the zoo.", answer: "an" },
      { type: "mcq", question: "Which article is used for unique things?", options: ["a", "an", "the", "no article"], answer: 2 },
      { type: "mcq", question: "Which sentence is correct?", options: ["She is a beautiful.", "She is beautiful.", "She is beauty.", "She beautiful."], answer: 1 },
      { type: "fill", question: "___ sun rises in the east.", answer: "The" }
    ]
  },
  {
    day: 6, title: "Past Simple Tense", level: "beginner",
    topics: ["Past Simple", "Regular & Irregular Verbs", "Time Expressions"],
    description: "Learn to talk about completed actions in the past using regular and irregular verbs.",
    grammar: {
      title: "Past Simple Tense",
      content: `<p>Use the <strong>past simple</strong> for completed actions at a specific time in the past.</p>
      <div class="formula-box">Subject + Past Verb (regular: +ed / irregular: special form)</div>
      <table class="grammar-table"><thead><tr><th>Base</th><th>Past Simple</th><th>Type</th></tr></thead>
      <tbody>
        <tr><td>walk</td><td>walked</td><td>Regular</td></tr>
        <tr><td>play</td><td>played</td><td>Regular</td></tr>
        <tr><td>go</td><td>went</td><td>Irregular</td></tr>
        <tr><td>eat</td><td>ate</td><td>Irregular</td></tr>
        <tr><td>have</td><td>had</td><td>Irregular</td></tr>
        <tr><td>see</td><td>saw</td><td>Irregular</td></tr>
      </tbody></table>
      <p><strong>Negative:</strong> Subject + didn't + base verb</p>
      <p><strong>Question:</strong> Did + subject + base verb?</p>`
    },
    vocabulary: ["yesterday", "last week", "ago", "before", "after", "then", "suddenly", "finally", "first", "next"],
    speaking: "Tell a partner about what you did yesterday. Use at least 5 past simple sentences.",
    writing: "Write a short paragraph about a memorable day in your life using past simple.",
    quiz: [
      { type: "mcq", question: "What is the past simple of 'go'?", options: ["goed", "gone", "went", "goes"], answer: 2 },
      { type: "fill", question: "She ___ (eat) pizza for dinner last night.", answer: "ate" },
      { type: "mcq", question: "Which is the correct negative form?", options: ["I not went.", "I didn't went.", "I didn't go.", "I don't went."], answer: 2 },
      { type: "mcq", question: "What is the past simple of 'study'?", options: ["studyed", "studied", "studid", "studed"], answer: 1 },
      { type: "fill", question: "___ you see the movie last night?", answer: "Did" }
    ]
  },
  {
    day: 7, title: "Future Tenses", level: "beginner",
    topics: ["Will", "Going to", "Present Continuous for Future"],
    description: "Learn three ways to talk about the future: will, going to, and present continuous.",
    grammar: {
      title: "Future Tenses",
      content: `<table class="grammar-table"><thead><tr><th>Form</th><th>Use</th><th>Example</th></tr></thead>
      <tbody>
        <tr><td>will + verb</td><td>Spontaneous decisions, predictions, promises</td><td>I'll help you. It will rain tomorrow.</td></tr>
        <tr><td>going to + verb</td><td>Plans, intentions, evidence-based predictions</td><td>I'm going to study medicine. Look at those clouds!</td></tr>
        <tr><td>Present Continuous</td><td>Fixed arrangements</td><td>I'm meeting John at 3 PM.</td></tr>
      </tbody></table>`
    },
    vocabulary: ["tomorrow", "next week", "soon", "in the future", "plan", "intend", "predict", "promise", "arrange", "schedule"],
    speaking: "Talk about your plans for next week. Use 'going to' for plans and 'will' for predictions.",
    writing: "Write about your plans for the next 5 years. Use all three future forms.",
    quiz: [
      { type: "mcq", question: "Which form is used for spontaneous decisions?", options: ["going to", "will", "present continuous", "past simple"], answer: 1 },
      { type: "fill", question: "I ___ going to visit Paris next summer.", answer: "am" },
      { type: "mcq", question: "Complete: 'Look at those clouds! It ___ rain.'", options: ["will", "is going to", "goes to", "shall"], answer: 1 },
      { type: "mcq", question: "Which sentence shows a fixed arrangement?", options: ["I will go.", "I'm going to go.", "I'm meeting her at 6.", "I go tomorrow."], answer: 2 },
      { type: "fill", question: "She ___ (will) be a great doctor one day.", answer: "will" }
    ]
  },
  {
    day: 8, title: "Questions & Negatives", level: "beginner",
    topics: ["Wh- Questions", "Yes/No Questions", "Negative Sentences"],
    description: "Master forming all types of questions and negative sentences in English.",
    grammar: {
      title: "Question Formation",
      content: `<p><strong>Wh- Questions</strong> ask for specific information.</p>
      <table class="grammar-table"><thead><tr><th>Question Word</th><th>Asks About</th><th>Example</th></tr></thead>
      <tbody>
        <tr><td>What</td><td>Things/actions</td><td>What do you do?</td></tr>
        <tr><td>Where</td><td>Place</td><td>Where do you live?</td></tr>
        <tr><td>When</td><td>Time</td><td>When did you arrive?</td></tr>
        <tr><td>Who</td><td>Person</td><td>Who is your teacher?</td></tr>
        <tr><td>Why</td><td>Reason</td><td>Why are you late?</td></tr>
        <tr><td>How</td><td>Manner/degree</td><td>How are you?</td></tr>
        <tr><td>Which</td><td>Choice</td><td>Which do you prefer?</td></tr>
      </tbody></table>`
    },
    vocabulary: ["what", "where", "when", "who", "why", "how", "which", "whose", "whom", "however"],
    speaking: "Ask your partner 10 questions using different question words. Practice answering them too.",
    writing: "Write 10 questions about your favorite topic. Then write the answers.",
    quiz: [
      { type: "mcq", question: "Which question word asks about a place?", options: ["What", "When", "Where", "Who"], answer: 2 },
      { type: "fill", question: "___ did you go to school? – I went by bus.", answer: "How" },
      { type: "mcq", question: "Which is the correct question form?", options: ["Where you live?", "Where do you live?", "Where you do live?", "Do where you live?"], answer: 1 },
      { type: "mcq", question: "Complete: '___ is your birthday?'", options: ["Where", "Who", "When", "Why"], answer: 2 },
      { type: "fill", question: "___ is your favorite color?", answer: "What" }
    ]
  },
  {
    day: 9, title: "Prepositions & Conjunctions", level: "beginner",
    topics: ["Prepositions of Place", "Prepositions of Time", "Conjunctions"],
    description: "Learn prepositions to describe location and time, and conjunctions to connect ideas.",
    grammar: {
      title: "Prepositions",
      content: `<table class="grammar-table"><thead><tr><th>Type</th><th>Prepositions</th><th>Example</th></tr></thead>
      <tbody>
        <tr><td>Place</td><td>in, on, at, under, above, between, next to, behind, in front of</td><td>The book is on the table.</td></tr>
        <tr><td>Time</td><td>in (months/years), on (days/dates), at (specific times)</td><td>I was born in 1995, on a Monday, at 3 AM.</td></tr>
        <tr><td>Movement</td><td>to, from, into, out of, through, across</td><td>She walked to the store.</td></tr>
      </tbody></table>
      <p><strong>Conjunctions:</strong> and, but, or, so, because, although, however, therefore</p>`
    },
    vocabulary: ["in", "on", "at", "under", "above", "between", "next to", "behind", "because", "although"],
    speaking: "Describe where objects are in your room using prepositions of place.",
    writing: "Write 10 sentences using different prepositions. Write 5 compound sentences using conjunctions.",
    quiz: [
      { type: "mcq", question: "Which preposition is used with months?", options: ["at", "on", "in", "by"], answer: 2 },
      { type: "fill", question: "The cat is ___ the table. (below the table)", answer: "under" },
      { type: "mcq", question: "Complete: 'I go to school ___ Monday.'", options: ["in", "at", "on", "by"], answer: 2 },
      { type: "mcq", question: "Which conjunction shows contrast?", options: ["and", "so", "but", "because"], answer: 2 },
      { type: "fill", question: "I was tired, ___ I went to bed early.", answer: "so" }
    ]
  },
  {
    day: 10, title: "Modal Verbs", level: "beginner",
    topics: ["Can/Could", "Must/Have to", "Should/Ought to", "May/Might"],
    description: "Learn modal verbs to express ability, obligation, advice, and possibility.",
    grammar: {
      title: "Modal Verbs",
      content: `<table class="grammar-table"><thead><tr><th>Modal</th><th>Use</th><th>Example</th></tr></thead>
      <tbody>
        <tr><td>can / could</td><td>Ability, permission, request</td><td>I can swim. Could you help me?</td></tr>
        <tr><td>must / have to</td><td>Obligation, necessity</td><td>You must wear a seatbelt.</td></tr>
        <tr><td>should / ought to</td><td>Advice, recommendation</td><td>You should see a doctor.</td></tr>
        <tr><td>may / might</td><td>Possibility, permission</td><td>It might rain. May I come in?</td></tr>
        <tr><td>will / would</td><td>Future, polite requests</td><td>Would you like some tea?</td></tr>
      </tbody></table>`
    },
    vocabulary: ["ability", "permission", "obligation", "advice", "possibility", "necessity", "request", "suggestion", "prohibition", "certainty"],
    speaking: "Give advice to a friend who wants to learn English. Use 'should', 'must', and 'can'.",
    writing: "Write 10 sentences using different modal verbs. Include at least 2 of each type.",
    quiz: [
      { type: "mcq", question: "Which modal expresses advice?", options: ["can", "must", "should", "might"], answer: 2 },
      { type: "fill", question: "You ___ smoke here. It's not allowed.", answer: "can't" },
      { type: "mcq", question: "Complete: 'It ___ rain tomorrow. The sky is cloudy.'", options: ["must", "can", "might", "should"], answer: 2 },
      { type: "mcq", question: "Which is a polite request?", options: ["Give me water.", "I want water.", "Could you give me some water?", "Water, please give."], answer: 2 },
      { type: "fill", question: "She ___ speak three languages. She's very talented.", answer: "can" }
    ]
  },
  {
    day: 11, title: "Present Perfect Tense", level: "intermediate",
    topics: ["Present Perfect", "Have/Has + Past Participle", "Ever/Never/Already/Yet"],
    description: "Learn the present perfect to connect past experiences to the present moment.",
    grammar: {
      title: "Present Perfect",
      content: `<p>Use the <strong>present perfect</strong> for experiences, recent events, and actions with present relevance.</p>
      <div class="formula-box">Subject + have/has + Past Participle</div>
      <table class="grammar-table"><thead><tr><th>Key Word</th><th>Use</th><th>Example</th></tr></thead>
      <tbody>
        <tr><td>ever</td><td>Questions about experience</td><td>Have you ever been to Paris?</td></tr>
        <tr><td>never</td><td>No experience</td><td>I have never eaten sushi.</td></tr>
        <tr><td>already</td><td>Completed before expected</td><td>I've already finished.</td></tr>
        <tr><td>yet</td><td>Expected but not done (negatives/questions)</td><td>Have you eaten yet?</td></tr>
        <tr><td>just</td><td>Very recently completed</td><td>She has just arrived.</td></tr>
        <tr><td>for/since</td><td>Duration</td><td>I've lived here for 5 years / since 2019.</td></tr>
      </tbody></table>`
    },
    vocabulary: ["experience", "achievement", "recently", "lately", "so far", "up to now", "throughout", "accomplish", "complete", "achieve"],
    speaking: "Talk about 5 things you have done in your life and 5 things you have never done.",
    writing: "Write a paragraph about your life experiences using the present perfect.",
    quiz: [
      { type: "mcq", question: "Which is correct?", options: ["I have went to London.", "I have gone to London.", "I have go to London.", "I went to London already."], answer: 1 },
      { type: "fill", question: "She has ___ (live) in Paris for three years.", answer: "lived" },
      { type: "mcq", question: "Which word is used in present perfect questions about experience?", options: ["already", "yet", "ever", "just"], answer: 2 },
      { type: "mcq", question: "Complete: 'I haven't finished my homework ___.'", options: ["already", "ever", "yet", "just"], answer: 2 },
      { type: "fill", question: "Have you ___ eaten Japanese food?", answer: "ever" }
    ]
  },
  {
    day: 12, title: "Conditionals – Zero & First", level: "intermediate",
    topics: ["Zero Conditional", "First Conditional", "If Clauses"],
    description: "Learn to talk about real conditions and their results using zero and first conditionals.",
    grammar: {
      title: "Conditionals",
      content: `<table class="grammar-table"><thead><tr><th>Type</th><th>Structure</th><th>Use</th><th>Example</th></tr></thead>
      <tbody>
        <tr><td>Zero</td><td>If + present simple, present simple</td><td>General truths, facts</td><td>If you heat water to 100°C, it boils.</td></tr>
        <tr><td>First</td><td>If + present simple, will + verb</td><td>Real/possible future situations</td><td>If it rains, I will stay home.</td></tr>
      </tbody></table>
      <p><strong>Note:</strong> The if-clause can come first or second. When it comes first, use a comma.</p>`
    },
    vocabulary: ["condition", "result", "consequence", "unless", "provided that", "as long as", "in case", "suppose", "imagine", "otherwise"],
    speaking: "Make 5 first conditional sentences about your plans. 'If I pass my exam, I will...'",
    writing: "Write 5 zero conditional sentences (facts) and 5 first conditional sentences (future plans).",
    quiz: [
      { type: "mcq", question: "Which conditional talks about general truths?", options: ["First", "Second", "Zero", "Third"], answer: 2 },
      { type: "fill", question: "If you ___ (study) hard, you will pass.", answer: "study" },
      { type: "mcq", question: "Complete: 'If it rains, I ___ take an umbrella.'", options: ["would", "will", "would have", "had"], answer: 1 },
      { type: "mcq", question: "Which is a zero conditional?", options: ["If I were rich, I would travel.", "If you freeze water, it becomes ice.", "If I had studied, I would have passed.", "If it rains, I will stay."], answer: 1 },
      { type: "fill", question: "If you heat ice, it ___.", answer: "melts" }
    ]
  },
  {
    day: 13, title: "Passive Voice", level: "intermediate",
    topics: ["Active vs Passive", "Passive Formation", "When to Use Passive"],
    description: "Learn to use the passive voice to shift focus from the doer to the action or receiver.",
    grammar: {
      title: "Passive Voice",
      content: `<p>Use the <strong>passive voice</strong> when the action is more important than who does it.</p>
      <div class="formula-box">Subject + be (conjugated) + Past Participle (+ by + agent)</div>
      <table class="grammar-table"><thead><tr><th>Tense</th><th>Active</th><th>Passive</th></tr></thead>
      <tbody>
        <tr><td>Present Simple</td><td>They make cars here.</td><td>Cars are made here.</td></tr>
        <tr><td>Past Simple</td><td>Someone stole my bag.</td><td>My bag was stolen.</td></tr>
        <tr><td>Present Perfect</td><td>They have built a new bridge.</td><td>A new bridge has been built.</td></tr>
        <tr><td>Future</td><td>They will announce the results.</td><td>The results will be announced.</td></tr>
      </tbody></table>`
    },
    vocabulary: ["manufacture", "produce", "construct", "discover", "invent", "publish", "announce", "deliver", "report", "investigate"],
    speaking: "Describe how something is made (e.g., chocolate, paper) using passive voice.",
    writing: "Rewrite 5 active sentences in passive voice. Write a paragraph about a historical event using passive.",
    quiz: [
      { type: "mcq", question: "Which is the passive form of 'They built the bridge'?", options: ["The bridge built.", "The bridge was built.", "The bridge is built.", "The bridge has built."], answer: 1 },
      { type: "fill", question: "English ___ (speak) all over the world.", answer: "is spoken" },
      { type: "mcq", question: "When do we use passive voice?", options: ["When the subject is important", "When the action/receiver is more important", "Only in formal writing", "Only in past tense"], answer: 1 },
      { type: "mcq", question: "Complete: 'The letter ___ sent yesterday.'", options: ["is", "was", "were", "has"], answer: 1 },
      { type: "fill", question: "The Mona Lisa ___ painted by Leonardo da Vinci.", answer: "was" }
    ]
  },
  {
    day: 14, title: "Reported Speech", level: "intermediate",
    topics: ["Direct vs Indirect Speech", "Reporting Verbs", "Tense Backshift"],
    description: "Learn to report what others have said using indirect speech and reporting verbs.",
    grammar: {
      title: "Reported Speech",
      content: `<p>When reporting speech, verbs usually shift back one tense (backshift).</p>
      <table class="grammar-table"><thead><tr><th>Direct Speech</th><th>Reported Speech</th></tr></thead>
      <tbody>
        <tr><td>"I am tired."</td><td>She said (that) she was tired.</td></tr>
        <tr><td>"I work here."</td><td>He said he worked there.</td></tr>
        <tr><td>"I will help."</td><td>She said she would help.</td></tr>
        <tr><td>"I have finished."</td><td>He said he had finished.</td></tr>
        <tr><td>"I can swim."</td><td>She said she could swim.</td></tr>
      </tbody></table>
      <p><strong>Common reporting verbs:</strong> said, told, asked, explained, admitted, promised, warned, suggested</p>`
    },
    vocabulary: ["report", "claim", "admit", "deny", "promise", "warn", "suggest", "explain", "announce", "confirm"],
    speaking: "Report what a famous person said in an interview. Use different reporting verbs.",
    writing: "Write a news report using reported speech. Report 5 different statements.",
    quiz: [
      { type: "mcq", question: "Report: 'I am happy.' She said...", options: ["she is happy.", "she was happy.", "she were happy.", "she has been happy."], answer: 1 },
      { type: "fill", question: "He said he ___ (will) call me later.", answer: "would" },
      { type: "mcq", question: "Which verb is used to report questions?", options: ["said", "told", "asked", "spoke"], answer: 2 },
      { type: "mcq", question: "Report: 'I can drive.' He said...", options: ["he can drive.", "he could drive.", "he will drive.", "he drives."], answer: 1 },
      { type: "fill", question: "She ___ me that she was leaving.", answer: "told" }
    ]
  },
  {
    day: 15, title: "Relative Clauses", level: "intermediate",
    topics: ["Defining Relative Clauses", "Non-defining Relative Clauses", "Who/Which/That/Where/Whose"],
    description: "Learn to use relative clauses to add information about nouns in a sentence.",
    grammar: {
      title: "Relative Clauses",
      content: `<table class="grammar-table"><thead><tr><th>Pronoun</th><th>Refers to</th><th>Example</th></tr></thead>
      <tbody>
        <tr><td>who / that</td><td>People</td><td>The woman who/that called is my sister.</td></tr>
        <tr><td>which / that</td><td>Things</td><td>The book which/that I read was great.</td></tr>
        <tr><td>whose</td><td>Possession</td><td>The man whose car was stolen called the police.</td></tr>
        <tr><td>where</td><td>Places</td><td>The city where I was born is beautiful.</td></tr>
        <tr><td>when</td><td>Time</td><td>The year when I graduated was 2020.</td></tr>
      </tbody></table>
      <p><strong>Defining:</strong> Essential information – no commas. <strong>Non-defining:</strong> Extra information – use commas.</p>`
    },
    vocabulary: ["define", "describe", "identify", "specify", "clarify", "elaborate", "restrict", "essential", "additional", "parenthetical"],
    speaking: "Describe 5 people or places using relative clauses. 'My teacher, who has been teaching for 20 years, is very inspiring.'",
    writing: "Write 5 defining and 5 non-defining relative clauses about people and places you know.",
    quiz: [
      { type: "mcq", question: "Which pronoun is used for people?", options: ["which", "whose", "who", "where"], answer: 2 },
      { type: "fill", question: "The book ___ I borrowed was very interesting.", answer: "that" },
      { type: "mcq", question: "Which sentence has a non-defining relative clause?", options: ["The man who called is my uncle.", "My uncle, who called yesterday, is a doctor.", "The book that I read was good.", "The city where I live is big."], answer: 1 },
      { type: "mcq", question: "Complete: 'The house ___ I grew up is now a museum.'", options: ["who", "which", "where", "whose"], answer: 2 },
      { type: "fill", question: "The student ___ won the prize is from our class.", answer: "who" }
    ]
  },
  {
    day: 16, title: "Second & Third Conditionals", level: "intermediate",
    topics: ["Second Conditional", "Third Conditional", "Mixed Conditionals"],
    description: "Learn to talk about hypothetical situations and past regrets using second and third conditionals.",
    grammar: {
      title: "Second & Third Conditionals",
      content: `<table class="grammar-table"><thead><tr><th>Type</th><th>Structure</th><th>Use</th><th>Example</th></tr></thead>
      <tbody>
        <tr><td>Second</td><td>If + past simple, would + verb</td><td>Hypothetical present/future</td><td>If I were rich, I would travel the world.</td></tr>
        <tr><td>Third</td><td>If + past perfect, would have + past participle</td><td>Hypothetical past (regrets)</td><td>If I had studied, I would have passed.</td></tr>
        <tr><td>Mixed</td><td>If + past perfect, would + verb</td><td>Past condition, present result</td><td>If I had taken that job, I would be rich now.</td></tr>
      </tbody></table>
      <p><strong>Note:</strong> In second conditional, use 'were' for all subjects (not 'was') in formal English.</p>`
    },
    vocabulary: ["hypothetical", "imaginary", "regret", "wish", "suppose", "assume", "speculate", "contrary", "unreal", "counterfactual"],
    speaking: "Share 3 regrets using third conditional. 'If I had studied harder, I would have...'",
    writing: "Write a paragraph about how your life would be different if you had made different choices.",
    quiz: [
      { type: "mcq", question: "Which conditional expresses regret about the past?", options: ["Zero", "First", "Second", "Third"], answer: 3 },
      { type: "fill", question: "If I ___ (be) you, I would apologize.", answer: "were" },
      { type: "mcq", question: "Complete: 'If she had studied, she ___ passed.'", options: ["would", "will have", "would have", "had"], answer: 2 },
      { type: "mcq", question: "Which is a second conditional?", options: ["If it rains, I'll stay.", "If I were a bird, I would fly.", "If you heat water, it boils.", "If I had known, I would have come."], answer: 1 },
      { type: "fill", question: "If I had more time, I ___ learn to play the piano.", answer: "would" }
    ]
  },
  {
    day: 17, title: "Gerunds & Infinitives", level: "intermediate",
    topics: ["Gerunds as Subjects/Objects", "Infinitives", "Verbs + Gerund/Infinitive"],
    description: "Master the use of gerunds (-ing forms) and infinitives (to + verb) in English.",
    grammar: {
      title: "Gerunds & Infinitives",
      content: `<table class="grammar-table"><thead><tr><th>Pattern</th><th>Verbs</th><th>Example</th></tr></thead>
      <tbody>
        <tr><td>Verb + Gerund</td><td>enjoy, finish, avoid, suggest, mind, consider, keep, practice</td><td>I enjoy swimming.</td></tr>
        <tr><td>Verb + Infinitive</td><td>want, need, hope, plan, decide, agree, refuse, manage</td><td>I want to swim.</td></tr>
        <tr><td>Verb + Both</td><td>like, love, hate, begin, start, continue, prefer</td><td>I like swimming / to swim.</td></tr>
        <tr><td>Meaning change</td><td>remember, forget, stop, try, regret</td><td>I stopped smoking. / I stopped to smoke.</td></tr>
      </tbody></table>`
    },
    vocabulary: ["enjoy", "avoid", "consider", "manage", "refuse", "suggest", "practice", "attempt", "intend", "prefer"],
    speaking: "Talk about your hobbies using gerunds. 'I enjoy reading. I avoid watching too much TV.'",
    writing: "Write 10 sentences using gerunds and 10 using infinitives. Note any meaning differences.",
    quiz: [
      { type: "mcq", question: "Which verb is followed by a gerund?", options: ["want", "hope", "enjoy", "decide"], answer: 2 },
      { type: "fill", question: "She avoided ___ (make) eye contact.", answer: "making" },
      { type: "mcq", question: "Complete: 'He decided ___ a new job.'", options: ["finding", "to find", "find", "found"], answer: 1 },
      { type: "mcq", question: "Which sentence is correct?", options: ["I enjoy to swim.", "I enjoy swimming.", "I enjoy swim.", "I enjoying swimming."], answer: 1 },
      { type: "fill", question: "I stopped ___ (smoke) two years ago.", answer: "smoking" }
    ]
  },
  {
    day: 18, title: "Phrasal Verbs & Idioms", level: "intermediate",
    topics: ["Common Phrasal Verbs", "Idiomatic Expressions", "Colloquial English"],
    description: "Learn essential phrasal verbs and idioms to sound more natural and fluent in English.",
    grammar: {
      title: "Phrasal Verbs",
      content: `<p>A <strong>phrasal verb</strong> = verb + particle (preposition/adverb). The meaning is often different from the individual words.</p>
      <table class="grammar-table"><thead><tr><th>Phrasal Verb</th><th>Meaning</th><th>Example</th></tr></thead>
      <tbody>
        <tr><td>give up</td><td>stop doing something</td><td>Don't give up on your dreams.</td></tr>
        <tr><td>look up</td><td>search for information</td><td>Look up the word in a dictionary.</td></tr>
        <tr><td>run out of</td><td>have no more of something</td><td>We ran out of milk.</td></tr>
        <tr><td>put off</td><td>postpone</td><td>Don't put off what you can do today.</td></tr>
        <tr><td>come across</td><td>find by chance</td><td>I came across an old photo.</td></tr>
        <tr><td>bring up</td><td>raise a child / mention a topic</td><td>She was brought up in London.</td></tr>
      </tbody></table>`
    },
    vocabulary: ["give up", "look up", "run out", "put off", "come across", "bring up", "break down", "carry on", "set up", "turn down"],
    speaking: "Use 5 phrasal verbs in sentences about your daily life. Explain the meaning of each.",
    writing: "Write a short story using at least 8 phrasal verbs. Underline each one.",
    quiz: [
      { type: "mcq", question: "What does 'give up' mean?", options: ["start something", "stop doing something", "give a gift", "look up"], answer: 1 },
      { type: "fill", question: "We ___ out of petrol on the motorway.", answer: "ran" },
      { type: "mcq", question: "What does 'put off' mean?", options: ["turn off", "postpone", "remove", "add"], answer: 1 },
      { type: "mcq", question: "Complete: 'I ___ an old friend at the supermarket.'", options: ["came across", "came up", "came in", "came over"], answer: 0 },
      { type: "fill", question: "Don't ___ up! You're almost there.", answer: "give" }
    ]
  },
  {
    day: 19, title: "Academic Writing Skills", level: "intermediate",
    topics: ["Essay Structure", "Thesis Statements", "Academic Vocabulary"],
    description: "Develop academic writing skills including essay structure, argumentation, and formal vocabulary.",
    grammar: {
      title: "Academic Writing",
      content: `<p><strong>Academic writing</strong> is formal, objective, and well-structured. Avoid contractions, slang, and first person (in some styles).</p>
      <table class="grammar-table"><thead><tr><th>Informal</th><th>Academic/Formal</th></tr></thead>
      <tbody>
        <tr><td>I think</td><td>It can be argued that / Evidence suggests</td></tr>
        <tr><td>a lot of</td><td>a significant number of / numerous</td></tr>
        <tr><td>but</td><td>however / nevertheless / nonetheless</td></tr>
        <tr><td>because</td><td>due to / as a result of / owing to</td></tr>
        <tr><td>show</td><td>demonstrate / illustrate / indicate</td></tr>
        <tr><td>use</td><td>utilize / employ / implement</td></tr>
      </tbody></table>`
    },
    vocabulary: ["analyze", "evaluate", "demonstrate", "illustrate", "indicate", "significant", "substantial", "furthermore", "consequently", "nevertheless"],
    speaking: "Present a 2-minute argument on a topic of your choice using academic language.",
    writing: "Write a 5-paragraph academic essay on: 'The impact of technology on education.'",
    quiz: [
      { type: "mcq", question: "Which is more academic?", options: ["I think technology is good.", "It can be argued that technology has significant benefits.", "Technology is really great.", "Loads of people like technology."], answer: 1 },
      { type: "fill", question: "The study ___ that exercise improves mental health.", answer: "demonstrates" },
      { type: "mcq", question: "Which word is NOT academic?", options: ["furthermore", "consequently", "loads of", "nevertheless"], answer: 2 },
      { type: "mcq", question: "What is a thesis statement?", options: ["The conclusion of an essay", "The main argument of an essay", "A list of references", "A topic sentence"], answer: 1 },
      { type: "fill", question: "___ to the research, sleep deprivation affects cognitive function.", answer: "According" }
    ]
  },
  {
    day: 20, title: "Business English Essentials", level: "intermediate",
    topics: ["Business Vocabulary", "Professional Communication", "Meeting Language"],
    description: "Master essential business English for professional settings, meetings, and correspondence.",
    grammar: {
      title: "Business Communication",
      content: `<p>Professional English requires formal tone, clear structure, and appropriate vocabulary.</p>
      <table class="grammar-table"><thead><tr><th>Situation</th><th>Useful Phrases</th></tr></thead>
      <tbody>
        <tr><td>Starting a meeting</td><td>Shall we get started? / Let's begin. / The purpose of today's meeting is...</td></tr>
        <tr><td>Agreeing</td><td>I completely agree. / That's a valid point. / Absolutely.</td></tr>
        <tr><td>Disagreeing politely</td><td>I see your point, however... / With respect, I think... / I'm not sure I agree.</td></tr>
        <tr><td>Making suggestions</td><td>What if we...? / Have you considered...? / Perhaps we could...</td></tr>
        <tr><td>Closing</td><td>To summarize... / Let's wrap up. / The next steps are...</td></tr>
      </tbody></table>`
    },
    vocabulary: ["agenda", "minutes", "deadline", "stakeholder", "deliverable", "benchmark", "synergy", "leverage", "scalable", "ROI"],
    speaking: "Role-play a business meeting. One person presents a proposal, others ask questions and give feedback.",
    writing: "Write a formal business email requesting a meeting and a follow-up email after the meeting.",
    quiz: [
      { type: "mcq", question: "What is an 'agenda' in a business context?", options: ["A type of report", "A list of topics to be discussed", "A financial document", "A business plan"], answer: 1 },
      { type: "fill", question: "We need to meet the ___ by Friday or we'll lose the contract.", answer: "deadline" },
      { type: "mcq", question: "Which phrase politely disagrees?", options: ["You're wrong.", "I disagree.", "I see your point, however...", "That's not right."], answer: 2 },
      { type: "mcq", question: "What does 'ROI' stand for?", options: ["Rate of Interest", "Return on Investment", "Risk of Inflation", "Revenue of Industry"], answer: 1 },
      { type: "fill", question: "Let's ___ up the meeting. We've covered all the agenda items.", answer: "wrap" }
    ]
  },
  {
    day: 21, title: "Advanced Grammar – Subjunctive & Inversion", level: "advanced",
    topics: ["Subjunctive Mood", "Inversion", "Cleft Sentences"],
    description: "Master advanced grammatical structures used in formal and literary English.",
    grammar: {
      title: "Advanced Grammar Structures",
      content: `<p><strong>Subjunctive:</strong> Used for hypothetical, wished-for, or demanded situations.</p>
      <div class="examples-list">
        <div class="example">I suggest that he <strong>be</strong> present at the meeting. (formal)</div>
        <div class="example">It is essential that she <strong>submit</strong> the report on time.</div>
        <div class="example">If I <strong>were</strong> you, I would reconsider.</div>
      </div>
      <p><strong>Inversion:</strong> Placing the auxiliary before the subject for emphasis (formal/literary).</p>
      <div class="examples-list">
        <div class="example"><strong>Never have I</strong> seen such dedication.</div>
        <div class="example"><strong>Not only did</strong> she win, but she also broke the record.</div>
        <div class="example"><strong>Rarely does</strong> one encounter such talent.</div>
      </div>`
    },
    vocabulary: ["subjunctive", "inversion", "emphasis", "formal register", "literary", "rhetorical", "syntactic", "clause", "auxiliary", "imperative"],
    speaking: "Give a formal speech using at least 3 inversions for emphasis.",
    writing: "Write a formal letter of complaint using subjunctive mood and inversion structures.",
    quiz: [
      { type: "mcq", question: "Which sentence uses the subjunctive correctly?", options: ["I suggest that he is present.", "I suggest that he be present.", "I suggest that he was present.", "I suggest that he being present."], answer: 1 },
      { type: "fill", question: "Never ___ I seen such a beautiful sunset.", answer: "have" },
      { type: "mcq", question: "Which is an example of inversion?", options: ["She never lies.", "Never does she lie.", "She does never lie.", "She lies never."], answer: 1 },
      { type: "mcq", question: "Complete: 'Not only ___ she pass, but she got the highest score.'", options: ["she did", "did she", "she has", "has she"], answer: 1 },
      { type: "fill", question: "It is vital that every student ___ the exam.", answer: "pass" }
    ]
  },
  {
    day: 22, title: "Discourse Markers & Cohesion", level: "advanced",
    topics: ["Discourse Markers", "Cohesive Devices", "Text Organization"],
    description: "Learn advanced techniques to create cohesive, well-organized texts using discourse markers.",
    grammar: {
      title: "Discourse Markers",
      content: `<p><strong>Discourse markers</strong> are words/phrases that organize and connect ideas in speech and writing.</p>
      <table class="grammar-table"><thead><tr><th>Function</th><th>Markers</th></tr></thead>
      <tbody>
        <tr><td>Adding</td><td>Furthermore, Moreover, In addition, What is more, Besides</td></tr>
        <tr><td>Contrasting</td><td>However, Nevertheless, Nonetheless, On the contrary, That said</td></tr>
        <tr><td>Cause/Effect</td><td>Consequently, Therefore, As a result, Hence, Thus, Thereby</td></tr>
        <tr><td>Exemplifying</td><td>For instance, To illustrate, Specifically, In particular, Namely</td></tr>
        <tr><td>Conceding</td><td>Admittedly, Granted, It is true that, While it may be argued</td></tr>
        <tr><td>Concluding</td><td>In conclusion, To summarize, Ultimately, All things considered</td></tr>
      </tbody></table>`
    },
    vocabulary: ["cohesion", "coherence", "discourse", "transition", "connective", "anaphora", "cataphora", "ellipsis", "substitution", "reference"],
    speaking: "Give a 3-minute talk on a complex topic, using at least 8 different discourse markers.",
    writing: "Write a discursive essay on 'Social media: blessing or curse?' using varied discourse markers.",
    quiz: [
      { type: "mcq", question: "Which discourse marker shows contrast?", options: ["Furthermore", "Therefore", "Nevertheless", "Consequently"], answer: 2 },
      { type: "fill", question: "___ the high cost, many people still buy organic food.", answer: "Despite" },
      { type: "mcq", question: "Which marker introduces an example?", options: ["However", "Therefore", "For instance", "Nevertheless"], answer: 2 },
      { type: "mcq", question: "Which marker shows a result?", options: ["Moreover", "Consequently", "Although", "Granted"], answer: 1 },
      { type: "fill", question: "___ conclusion, technology has transformed modern life.", answer: "In" }
    ]
  },
  {
    day: 23, title: "Advanced Vocabulary – Collocations & Word Formation", level: "advanced",
    topics: ["Collocations", "Word Formation", "Prefixes & Suffixes"],
    description: "Expand your vocabulary through collocations, word families, and morphological analysis.",
    grammar: {
      title: "Word Formation",
      content: `<p><strong>Collocations</strong> are words that naturally go together. Learning them makes your English sound native.</p>
      <table class="grammar-table"><thead><tr><th>Verb</th><th>Common Collocations</th></tr></thead>
      <tbody>
        <tr><td>make</td><td>make a decision, make progress, make an effort, make a mistake</td></tr>
        <tr><td>do</td><td>do homework, do research, do business, do damage</td></tr>
        <tr><td>take</td><td>take a break, take responsibility, take action, take advantage</td></tr>
        <tr><td>have</td><td>have a meeting, have an impact, have a conversation, have doubts</td></tr>
      </tbody></table>
      <p><strong>Common Prefixes:</strong> un- (not), re- (again), pre- (before), mis- (wrongly), over- (too much)</p>
      <p><strong>Common Suffixes:</strong> -tion/-sion (noun), -ous/-ful/-less (adj), -ly (adv), -ize/-ise (verb)</p>`
    },
    vocabulary: ["collocation", "morphology", "prefix", "suffix", "root word", "derivative", "compound", "synonym", "antonym", "connotation"],
    speaking: "Use 10 collocations in a conversation about your career or studies.",
    writing: "Write a paragraph using at least 5 collocations and 5 words with prefixes/suffixes.",
    quiz: [
      { type: "mcq", question: "Which is the correct collocation?", options: ["do a decision", "make a decision", "take a decision", "have a decision"], answer: 1 },
      { type: "fill", question: "The prefix 're-' means ___.", answer: "again" },
      { type: "mcq", question: "What does 'overestimate' mean?", options: ["estimate correctly", "estimate too low", "estimate too high", "not estimate"], answer: 2 },
      { type: "mcq", question: "Which is the correct collocation?", options: ["do research", "make research", "have research", "take research"], answer: 0 },
      { type: "fill", question: "The suffix '-less' means without, so 'hopeless' means without ___.", answer: "hope" }
    ]
  },
  {
    day: 24, title: "Critical Reading & Analysis", level: "advanced",
    topics: ["Reading Strategies", "Critical Analysis", "Inference & Implication"],
    description: "Develop advanced reading skills including critical analysis, inference, and evaluation of texts.",
    grammar: {
      title: "Critical Reading Skills",
      content: `<p>Critical reading involves <strong>analyzing</strong>, <strong>evaluating</strong>, and <strong>questioning</strong> a text, not just understanding it.</p>
      <table class="grammar-table"><thead><tr><th>Skill</th><th>Description</th><th>Questions to Ask</th></tr></thead>
      <tbody>
        <tr><td>Inference</td><td>Understanding implied meaning</td><td>What does the author imply? What is suggested?</td></tr>
        <tr><td>Tone</td><td>Author's attitude</td><td>Is the tone formal/informal, positive/negative, ironic?</td></tr>
        <tr><td>Bias</td><td>One-sided perspective</td><td>What perspective is missing? Who benefits from this view?</td></tr>
        <tr><td>Purpose</td><td>Why the text was written</td><td>To inform? Persuade? Entertain? Argue?</td></tr>
        <tr><td>Evidence</td><td>Support for claims</td><td>Is the evidence reliable? Is it sufficient?</td></tr>
      </tbody></table>`
    },
    vocabulary: ["inference", "implication", "connotation", "denotation", "bias", "perspective", "rhetoric", "credibility", "validity", "objectivity"],
    speaking: "Analyze a newspaper article. Discuss the author's purpose, tone, and any bias you detect.",
    writing: "Write a critical analysis of a short text. Evaluate the author's argument and evidence.",
    quiz: [
      { type: "mcq", question: "What is 'inference' in reading?", options: ["Understanding literal meaning", "Understanding implied meaning", "Summarizing a text", "Translating a text"], answer: 1 },
      { type: "fill", question: "The author's ___ is the attitude they express toward the subject.", answer: "tone" },
      { type: "mcq", question: "What is 'bias' in a text?", options: ["Balanced perspective", "One-sided perspective", "Factual information", "Academic language"], answer: 1 },
      { type: "mcq", question: "Which question helps identify the author's purpose?", options: ["What words are used?", "Why was this written?", "How long is the text?", "Who is the author?"], answer: 1 },
      { type: "fill", question: "A text that presents only one side of an argument may be considered ___.", answer: "biased" }
    ]
  },
  {
    day: 25, title: "Advanced Speaking – Debate & Argumentation", level: "advanced",
    topics: ["Debate Techniques", "Argumentation", "Persuasive Language"],
    description: "Master the art of debate, argumentation, and persuasive speaking in English.",
    grammar: {
      title: "Persuasive Language",
      content: `<p>Effective argumentation uses <strong>logos</strong> (logic), <strong>ethos</strong> (credibility), and <strong>pathos</strong> (emotion).</p>
      <table class="grammar-table"><thead><tr><th>Technique</th><th>Language</th><th>Example</th></tr></thead>
      <tbody>
        <tr><td>Stating position</td><td>I firmly believe / It is my contention that / I would argue that</td><td>I firmly believe that education should be free.</td></tr>
        <tr><td>Conceding</td><td>While it is true that / Admittedly / I grant that</td><td>While it is true that costs are high, the benefits outweigh them.</td></tr>
        <tr><td>Refuting</td><td>However / On the contrary / This argument fails to consider</td><td>However, this argument fails to consider the long-term benefits.</td></tr>
        <tr><td>Emphasizing</td><td>What is crucial is / The key point is / Above all</td><td>What is crucial is that we act now.</td></tr>
      </tbody></table>`
    },
    vocabulary: ["contention", "proposition", "refute", "concede", "rebut", "premise", "conclusion", "fallacy", "rhetoric", "persuasion"],
    speaking: "Debate the topic: 'Technology does more harm than good.' Argue both sides.",
    writing: "Write a persuasive essay arguing for or against: 'University education should be free for all.'",
    quiz: [
      { type: "mcq", question: "What does 'refute' mean?", options: ["agree with", "prove wrong", "support", "ignore"], answer: 1 },
      { type: "fill", question: "I firmly ___ that climate change is the greatest challenge of our time.", answer: "believe" },
      { type: "mcq", question: "Which technique acknowledges the opposing view?", options: ["Stating position", "Refuting", "Conceding", "Emphasizing"], answer: 2 },
      { type: "mcq", question: "What is 'ethos' in argumentation?", options: ["Emotional appeal", "Logical appeal", "Credibility appeal", "Statistical appeal"], answer: 2 },
      { type: "fill", question: "While it is true that social media connects people, it also ___ privacy concerns.", answer: "raises" }
    ]
  },
  {
    day: 26, title: "Idiomatic English & Figurative Language", level: "advanced",
    topics: ["Advanced Idioms", "Metaphors & Similes", "Euphemisms & Understatement"],
    description: "Master figurative language, advanced idioms, and subtle expressions used by native speakers.",
    grammar: {
      title: "Figurative Language",
      content: `<table class="grammar-table"><thead><tr><th>Device</th><th>Definition</th><th>Example</th></tr></thead>
      <tbody>
        <tr><td>Metaphor</td><td>Direct comparison (A is B)</td><td>Life is a rollercoaster. Time is money.</td></tr>
        <tr><td>Simile</td><td>Comparison using 'like' or 'as'</td><td>She sings like an angel. He's as strong as an ox.</td></tr>
        <tr><td>Euphemism</td><td>Polite substitute for harsh words</td><td>'passed away' (died), 'let go' (fired)</td></tr>
        <tr><td>Understatement</td><td>Saying less than you mean</td><td>'Not bad' (meaning very good)</td></tr>
        <tr><td>Hyperbole</td><td>Extreme exaggeration</td><td>I've told you a million times!</td></tr>
        <tr><td>Irony</td><td>Saying the opposite of what you mean</td><td>'Oh great, another Monday.' (sarcastically)</td></tr>
      </tbody></table>`
    },
    vocabulary: ["metaphor", "simile", "euphemism", "understatement", "hyperbole", "irony", "sarcasm", "alliteration", "personification", "oxymoron"],
    speaking: "Use 5 idioms and 3 figurative language devices in a conversation about your life.",
    writing: "Write a creative piece (story or poem) using at least 5 different figurative language devices.",
    quiz: [
      { type: "mcq", question: "Which is a metaphor?", options: ["She runs like the wind.", "Life is a rollercoaster.", "He is very tall.", "The sun is bright."], answer: 1 },
      { type: "fill", question: "'Passed away' is a ___ for 'died'.", answer: "euphemism" },
      { type: "mcq", question: "What is hyperbole?", options: ["Understatement", "Extreme exaggeration", "Direct comparison", "Polite substitute"], answer: 1 },
      { type: "mcq", question: "Which is a simile?", options: ["Time is money.", "She is a star.", "He runs like a cheetah.", "The world is a stage."], answer: 2 },
      { type: "fill", question: "Saying 'not bad' when you mean 'very good' is an example of ___.", answer: "understatement" }
    ]
  },
  {
    day: 27, title: "Advanced Writing – Research & Citation", level: "advanced",
    topics: ["Research Writing", "Citation Styles", "Paraphrasing & Summarizing"],
    description: "Develop advanced academic writing skills including research methodology, citation, and synthesis.",
    grammar: {
      title: "Research Writing Skills",
      content: `<p>Academic research writing requires proper <strong>citation</strong>, <strong>paraphrasing</strong>, and <strong>synthesis</strong> of sources.</p>
      <table class="grammar-table"><thead><tr><th>Skill</th><th>Description</th><th>Example</th></tr></thead>
      <tbody>
        <tr><td>Quoting</td><td>Using exact words with quotation marks</td><td>Smith (2020) argues that "education is the key to success" (p. 45).</td></tr>
        <tr><td>Paraphrasing</td><td>Restating in your own words</td><td>According to Smith (2020), education plays a crucial role in achieving success.</td></tr>
        <tr><td>Summarizing</td><td>Condensing main ideas</td><td>Smith's (2020) research highlights the importance of education.</td></tr>
        <tr><td>Synthesizing</td><td>Combining multiple sources</td><td>Both Smith (2020) and Jones (2019) emphasize the value of education.</td></tr>
      </tbody></table>`
    },
    vocabulary: ["citation", "reference", "bibliography", "paraphrase", "synthesize", "plagiarism", "peer-reviewed", "methodology", "hypothesis", "empirical"],
    speaking: "Present a 3-minute research summary on a topic of your choice, citing at least 2 sources.",
    writing: "Write a 500-word research summary on a topic, using proper citations and paraphrasing.",
    quiz: [
      { type: "mcq", question: "What is paraphrasing?", options: ["Copying text exactly", "Restating in your own words", "Summarizing briefly", "Quoting with marks"], answer: 1 },
      { type: "fill", question: "Using someone else's work without credit is called ___.", answer: "plagiarism" },
      { type: "mcq", question: "What does 'synthesizing' sources mean?", options: ["Copying from one source", "Summarizing one source", "Combining ideas from multiple sources", "Quoting directly"], answer: 2 },
      { type: "mcq", question: "Which citation style is commonly used in social sciences?", options: ["MLA", "APA", "Chicago", "Harvard"], answer: 1 },
      { type: "fill", question: "A ___ article has been reviewed by experts in the field.", answer: "peer-reviewed" }
    ]
  },
  {
    day: 28, title: "English for Specific Purposes", level: "advanced",
    topics: ["Legal English", "Medical English", "Technical English"],
    description: "Explore specialized English used in professional fields including law, medicine, and technology.",
    grammar: {
      title: "Specialized English",
      content: `<table class="grammar-table"><thead><tr><th>Field</th><th>Key Terms</th><th>Example Sentence</th></tr></thead>
      <tbody>
        <tr><td>Legal</td><td>plaintiff, defendant, jurisdiction, liability, statute, precedent</td><td>The plaintiff filed a lawsuit against the defendant for breach of contract.</td></tr>
        <tr><td>Medical</td><td>diagnosis, prognosis, symptom, chronic, acute, benign, malignant</td><td>The patient presented with acute symptoms requiring immediate intervention.</td></tr>
        <tr><td>Technology</td><td>algorithm, bandwidth, encryption, interface, protocol, scalability</td><td>The new encryption protocol significantly enhanced data security.</td></tr>
        <tr><td>Finance</td><td>equity, liability, dividend, portfolio, liquidity, depreciation</td><td>The company's liquidity ratio indicates strong financial health.</td></tr>
      </tbody></table>`
    },
    vocabulary: ["plaintiff", "diagnosis", "algorithm", "equity", "jurisdiction", "prognosis", "bandwidth", "liability", "symptom", "protocol"],
    speaking: "Choose a professional field and give a 2-minute presentation using specialized vocabulary.",
    writing: "Write a professional report in your field of interest using appropriate technical vocabulary.",
    quiz: [
      { type: "mcq", question: "In legal English, who is the 'plaintiff'?", options: ["The judge", "The lawyer", "The person who files the lawsuit", "The defendant"], answer: 2 },
      { type: "fill", question: "A ___ condition is one that lasts a long time.", answer: "chronic" },
      { type: "mcq", question: "What is an 'algorithm' in technology?", options: ["A type of computer", "A set of rules for solving a problem", "A programming language", "A network connection"], answer: 1 },
      { type: "mcq", question: "In finance, 'liquidity' refers to?", options: ["Profit margins", "How easily assets can be converted to cash", "Total debt", "Annual revenue"], answer: 1 },
      { type: "fill", question: "The doctor's ___ was that the patient would make a full recovery.", answer: "prognosis" }
    ]
  },
  {
    day: 29, title: "Intercultural Communication", level: "advanced",
    topics: ["Cultural Differences", "Cross-cultural Communication", "Global English"],
    description: "Explore intercultural communication dynamics.",
    grammar: {
      title: "Intercultural Communication",
      content: `<p>Effective communication across cultures requires awareness of <strong>cultural dimensions</strong> and <strong>communication styles</strong>.</p>
      <table class="grammar-table"><thead><tr><th>Dimension</th><th>High Context</th><th>Low Context</th></tr></thead>
      <tbody>
        <tr><td>Communication</td><td>Indirect, implicit</td><td>Direct, explicit</td></tr>
        <tr><td>Examples</td><td>Japan, China, Arab countries</td><td>USA, Germany, Scandinavia</td></tr>
        <tr><td>Business style</td><td>Relationships first</td><td>Task-oriented</td></tr>
        <tr><td>Disagreement</td><td>Indirect, face-saving</td><td>Direct, open</td></tr>
      </tbody></table>
      <p><strong>Tips for cross-cultural communication:</strong> Be patient, avoid assumptions, ask clarifying questions, be aware of non-verbal cues, and adapt your communication style.</p>`
    },
    vocabulary: ["intercultural", "cross-cultural", "stereotype", "ethnocentrism", "cultural relativism", "high-context", "low-context", "face-saving", "taboo", "protocol"],
    speaking: "Discuss cultural differences in communication styles. Share examples from your own culture.",
    writing: "Write an essay on the challenges and benefits of working in a multicultural environment.",
    quiz: [
      { type: "mcq", question: "What is 'high-context' communication?", options: ["Very direct and explicit", "Indirect and implicit", "Very formal", "Very informal"], answer: 1 },
      { type: "fill", question: "Making assumptions about people based on their nationality is called ___.", answer: "stereotyping" },
      { type: "mcq", question: "Which country is typically 'low-context'?", options: ["Japan", "China", "Germany", "Saudi Arabia"], answer: 2 },
      { type: "mcq", question: "What is 'face-saving' in communication?", options: ["Protecting one's reputation and dignity", "Saving money", "Being honest", "Being direct"], answer: 0 },
      { type: "fill", question: "Global English, or ___, is English used as a lingua franca.", answer: "ELF" }
    ]
  },
  {
    day: 30, title: "Mastery Review & Advanced Fluency", level: "advanced",
    topics: ["Comprehensive Review", "Fluency Strategies", "Lifelong Learning"],
    description: "Celebrate your 30-day journey! Review key concepts, assess your progress, and plan your continued English learning.",
    grammar: {
      title: "Your English Learning Journey",
      content: `<p>Congratulations on completing 30 days of English learning! Here's a summary of what you've mastered:</p>
      <table class="grammar-table"><thead><tr><th>Level</th><th>Days</th><th>Key Skills</th></tr></thead>
      <tbody>
        <tr><td>Beginner</td><td>1-10</td><td>Alphabet, greetings, basic tenses, articles, modals</td></tr>
        <tr><td>Intermediate</td><td>11-20</td><td>Perfect tenses, conditionals, passive, reported speech, business English</td></tr>
        <tr><td>Advanced</td><td>21-30</td><td>Subjunctive, discourse markers, figurative language, research writing, intercultural communication</td></tr>
      </tbody></table>
      <p><strong>Strategies for continued improvement:</strong></p>
      <div class="examples-list">
        <div class="example">📚 Read English books, newspapers, and articles daily</div>
        <div class="example">🎧 Listen to English podcasts, music, and films</div>
        <div class="example">✍️ Write in English every day – a journal, blog, or social media</div>
        <div class="example">🗣️ Speak with native speakers or language exchange partners</div>
        <div class="example">📱 Use language learning apps for vocabulary practice</div>
      </div>`
    },
    vocabulary: ["fluency", "proficiency", "mastery", "competence", "acquisition", "immersion", "consistency", "perseverance", "dedication", "achievement"],
    speaking: "Give a 5-minute presentation about your English learning journey and your future goals.",
    writing: "Write a reflective essay about what you have learned in 30 days and your plans for continued improvement.",
    quiz: [
      { type: "mcq", question: "Which is the best strategy for improving fluency?", options: ["Only studying grammar", "Daily practice in all skills", "Memorizing vocabulary lists", "Watching TV without subtitles"], answer: 1 },
      { type: "fill", question: "Language ___ means learning a language naturally through exposure.", answer: "acquisition" },
      { type: "mcq", question: "What does 'proficiency' mean?", options: ["Beginner level", "High level of skill", "Native speaker level", "Zero knowledge"], answer: 1 },
      { type: "mcq", question: "Which activity best improves speaking fluency?", options: ["Reading grammar books", "Memorizing vocabulary", "Regular conversation practice", "Watching films with subtitles"], answer: 2 },
      { type: "fill", question: "Congratulations! You have completed the 30-Day English ___ Course.", answer: "Mastery" }
    ]
  }
];

/* ============================================================
   GLOBAL TRANSLATION DICTIONARY FOR DAILY LESSON VOCABULARY (DAYS 1-30)
   ============================================================ */
const GLOBAL_BANGLA_MAP = {
  // Day 1 & Common Core
  "hello": { bn: "হ্যালো / ওহে", pr: "হ্যালো" },
  "goodbye": { bn: "বিদায়", pr: "গুডবাই" },
  "yes": { bn: "হ্যাঁ", pr: "ইয়েস" },
  "no": { bn: "না", pr: "নো" },
  "please": { bn: "দয়া করে", pr: "প্লিজ" },
  "thank you": { bn: "ধন্যবাদ", pr: "থ্যাংক ইউ" },
  "sorry": { bn: "দুঃখিত", pr: "সরি" },
  "excuse me": { bn: "ক্ষমা করবেন", pr: "এক্সকিউজ মি" },
  "name": { bn: "নাম", pr: "নেইম" },
  "age": { bn: "বয়স", pr: "এইজ" },

  // Day 2
  "hi": { bn: "ওহে / হাই", pr: "হাই" },
  "good morning": { bn: "সুপ্রভাত", pr: "গুড মর্নিং" },
  "good afternoon": { bn: "শুভ অপরাহ্ন", pr: "গুড আফটারনুন" },
  "good evening": { bn: "শুভ সন্ধ্যা", pr: "গুড ইভনিং" },
  "my name is": { bn: "আমার নাম হয়...", pr: "মাই নেইম ইজ" },
  "nice to meet you": { bn: "আপনার সাথে দেখা করে ভালো লাগলো", pr: "নাইস টু মিট ইউ" },
  "how are you": { bn: "আপনি কেমন আছেন?", pr: "হাউ আর ইউ" },
  "i am fine": { bn: "আমি ভালো আছি", pr: "আই অ্যাম ফাইন" },
  "see you later": { bn: "পরে দেখা হবে", pr: "সী ইউ লেটার" },

  // Day 3
  "one": { bn: "এক", pr: "ওয়ան" },
  "two": { bn: "দুই", pr: "টু" },
  "three": { bn: "তিন", pr: "থ্রি" },
  "red": { bn: "লাল", pr: "রেড" },
  "blue": { bn: "নীল", pr: "ব্লু" },
  "green": { bn: "সবুজ", pr: "গ্রীন" },
  "yellow": { bn: "হলুদ", pr: "ইয়েলো" },
  "black": { bn: "কালো", pr: "ব্ল্যাক" },
  "white": { bn: "সাদা", pr: "হোয়াইট" },
  "book": { bn: "বই", pr: "বুক" },

  // Day 4-10 (Beginner Content Words)
  "wake up": { bn: "জেগে ওঠা", pr: "ওয়েন আপ" },
  "eat breakfast": { bn: "সকালের নাস্তা খাওয়া", pr: "ইট ব্রেকফাস্ট" },
  "go to work": { bn: "কাজে যাওয়া", pr: "গো টু ওয়ার্ক" },
  "study": { bn: "পড়াশোনা করা", pr: "স্টাডি" },
  "exercise": { bn: "ব্যায়াম করা", pr: "এক্সারসাইজ" },
  "cook dinner": { bn: "রাতের খাবার রান্না করা", pr: "কুক ডিনার" },
  "watch tv": { bn: "টিভি দেখা", pr: "ওয়াচ টিভি" },
  "sleep": { bn: "ঘুমানো", pr: "স্লিপ" },
  "always": { bn: "সবসময়", pr: "অলওয়েজ" },
  "never": { bn: "কখনোই না", pr: "নেভার" },
  "beautiful": { bn: "সুন্দর", pr: "বিউটিফুল" },
  "ugly": { bn: "কুৎসিত", pr: "আগলি" },
  "big": { bn: "বড়", pr: "বিগ" },
  "small": { bn: "ছোট", pr: "স্মল" },
  "old": { bn: "পুরানো / বৃদ্ধ", pr: "ওল্ড" },
  "new": { bn: "নতুন", pr: "নিউ" },
  "fast": { bn: "দ্রুত", pr: "ফাস্ট" },
  "slow": { bn: "ধীর", pr: "স্লো" },
  "happy": { bn: "খুশি", pr: "হ্যাপি" },
  "sad": { bn: "দুঃখিত", pr: "স্যাড" },
  "yesterday": { bn: "গতকাল", pr: "ইয়েস্টারডে" },
  "last week": { bn: "গত সপ্তাহে", pr: "লাস্ট উইক" },
  "ago": { bn: "আগে", pr: "এগো" },
  "before": { bn: "পূর্বে", pr: "বিফোর" },
  "after": { bn: "পরে", pr: "আফটার" },
  "then": { bn: "তারপর", pr: "দেন" },
  "suddenly": { bn: "হঠাৎ", pr: "সাডেনলি" },
  "finally": { bn: "অবশেষে", pr: "ফাইনালি" },
  "first": { bn: "প্রথম", pr: "ফাস্ট" },
  "next": { bn: "পরবর্তী", pr: "নেক্সট" },
  "tomorrow": { bn: "আগামীকাল", pr: "টুমরো" },
  "soon": { bn: "শীঘ্রই", pr: "সুন" },
  "in the future": { bn: "ভবিষ্যতে", pr: "ইন দ্য ফিউচার" },
  "plan": { bn: "পরিকল্পনা করা", pr: "প্ল্যান" },
  "intend": { bn: "ইচ্ছা করা", pr: "ইনটেন্ড" },
  "predict": { bn: "ভবিষ্যদ্বাণী করা", pr: "প্রেডিক্ট" },
  "promise": { bn: "প্রতিশ্রুতি দেওয়া", pr: "প্রমিজ" },
  "arrange": { bn: "ব্যবস্থা করা", pr: "অ্যারেঞ্জ" },
  "schedule": { bn: "সময়সূচী", pr: "শিডিউল" },
  "what": { bn: "কি", pr: "হোয়াট" },
  "where": { bn: "কোথায়", pr: "হোয়্যার" },
  "when": { bn: "কখন", pr: "হোয়েন" },
  "who": { bn: "কে", pr: "হু" },
  "why": { bn: "কেন", pr: "হোয়াই" },
  "how": { bn: "কিভাবে", pr: "হাউ" },
  "which": { bn: "কোনটি", pr: "হুইচ" },
  "whose": { bn: "কার", pr: "হুজ" },
  "whom": { bn: "কাকে", pr: "হুম" },
  "however": { bn: "যাইহোক", pr: "হাউএভার" },
  "in": { bn: "ভেতরে", pr: "ইন" },
  "on": { bn: "উপরে", pr: "অন" },
  "at": { bn: "নির্দিষ্ট স্থানে/সময়ে", pr: "অ্যাট" },
  "under": { bn: "নিচে", pr: "আন্ডার" },
  "above": { bn: "উপরে (স্পর্শ ছাড়া)", pr: "অ্যাবাভ" },
  "between": { bn: "দুজনের মধ্যে", pr: "বিটউইন" },
  "next to": { bn: "পাশে", pr: "নেক্সট টু" },
  "behind": { bn: "পেছনে", pr: "বিহাইন্ড" },
  "because": { bn: "কারণ", pr: "বিকজ" },
  "although": { bn: "যদিও", pr: "অলদো" },
  "ability": { bn: "ক্ষমতা", pr: "অ্যাবিলিটি" },
  "permission": { bn: "অনুমতি", pr: "পারমিশন" },
  "obligation": { bn: "বাধ্যবাধকতা", pr: "অবলিগেশন" },
  "advice": { bn: "উপদেশ", pr: "অ্যাডভাইস" },
  "possibility": { bn: "সম্ভাবনা", pr: "পসিবিলিটি" },
  "necessity": { bn: "প্রয়োজনীয়তা", pr: "নেসিসিটি" },
  "request": { bn: "অনুরোধ", pr: "রিকুয়েস্ট" },
  "suggestion": { bn: "পরামর্শ", pr: "সাজেশন" },
  "prohibition": { bn: "নিষেধাজ্ঞা", pr: "প্রোহিবিশন" },
  "certainty": { bn: "নিশ্চয়তা", pr: "সার্টেনটি" },

  // Day 11-20 (Intermediate Content Words)
  "experience": { bn: "অভিজ্ঞতা", pr: "এক্সপেরিয়েন্স" },
  "achievement": { bn: "অর্জিত সাফল্য", pr: "অ্যাচিভমেন্ট" },
  "recently": { bn: "সম্প্রতি", pr: "রিসেন্টলি" },
  "lately": { bn: "আজকাল / ইদানীং", pr: "লেইটলি" },
  "so far": { bn: "এখন পর্যন্ত", pr: "সো ফার" },
  "up to now": { bn: "এই পর্যন্ত", pr: "আপ টু নাও" },
  "throughout": { bn: "সারা সময় ধরে", pr: "থ্রুআউট" },
  "accomplish": { bn: "সম্পাদন করা", pr: "অ্যাকমপ্লিশ" },
  "complete": { bn: "সম্পূর্ণ করা", pr: "কমপ্লিট" },
  "achieve": { bn: "অর্জন করা", pr: "অ্যাচিভ" },
  "condition": { bn: "শর্ত", pr: "কন্ডিশন" },
  "result": { bn: "ফলাফল", pr: "রেজাল্ট" },
  "consequence": { bn: "পরিণতি", pr: "কনসিকুয়েন্স" },
  "unless": { bn: "যদি না", pr: "আনলেস" },
  "provided that": { bn: "এই শর্তে যে", pr: "প্রোভাইডেড দ্যাট" },
  "as long as": { bn: "যতক্ষণ পর্যন্ত", pr: "অ্যাজ লং অ্যাজ" },
  "in case": { bn: "যদি ঘটে সেই আশঙ্কায়", pr: "ইন কেইস" },
  "suppose": { bn: "মনে করা", pr: "সাপোজ" },
  "imagine": { bn: "কল্পনা করা", pr: "ইমাজিন" },
  "otherwise": { bn: "অন্যথায়", pr: "আদারওয়াইজ" },
  "manufacture": { bn: "কারখানায় উৎপাদন করা", pr: "ম্যানুফ্যাকচার" },
  "produce": { bn: "উৎপন্ন করা", pr: "প্রডিউস" },
  "construct": { bn: "নির্মাণ করা", pr: "কনস্ট্রাক্ট" },
  "discover": { bn: "আবিষ্কার করা", pr: "ডিসকাভার" },
  "invent": { bn: "নতুন কিছু উদ্ভাবন করা", pr: "ইনভেন্ট" },
  "publish": { bn: "প্রকাশ করা", pr: "পাবলিশ" },
  "announce": { bn: "ঘোষণা করা", pr: "অ্যানাউন্স" },
  "deliver": { bn: "পৌঁছে দেওয়া", pr: "ডেলিভার" },
  "report": { bn: "প্রতিবেদন পেশ করা", pr: "রিপোর্ট" },
  "investigate": { bn: "তদন্ত করা", pr: "ইনভেস্টিগেট" },
  "claim": { bn: "দাবি করা", pr: "ক্লেইম" },
  "admit": { bn: "স্বীকার করা", pr: "অ্যাডমিট" },
  "deny": { bn: "অস্বীকার করা", pr: "ডিনাই" },
  "warn": { bn: "সতর্ক করা", pr: "ওয়ার্ন" },
  "suggest": { bn: "পরামর্শ দেওয়া", pr: "সাজেস্ট" },
  "explain": { bn: "ব্যাখ্যা করা", pr: "এক্সপ্লেইন" },
  "confirm": { bn: "নিশ্চিত করা", pr: "কনফার্ম" },
  "define": { bn: "সংজ্ঞায়িত করা", pr: "ডিফাইন" },
  "describe": { bn: "বর্ণনা করা", pr: "ডেসক্রাইব" },
  "identify": { bn: "শনাক্ত করা", pr: "আইডেন্টিফাই" },
  "specify": { bn: "নির্দিষ্ট করে বলা", pr: "স্পেসিফাই" },
  "clarify": { bn: "স্পষ্ট করা", pr: "ক্ল্যারিফাই" },
  "elaborate": { bn: "বিস্তারিত বলা", pr: "ইলাবোরেট" },
  "restrict": { bn: "সীমাবদ্ধ করা", pr: "রেস্ট্রিক্ট" },
  "essential": { bn: "অপরিহার্য", pr: "ইসেনশিয়াল" },
  "additional": { bn: "অতিরিক্ত", pr: "অ্যাডিশনাল" },
  "parenthetical": { bn: "বন্ধনীযুক্ত / অতিরিক্ত তথ্য", pr: "প্যারেনথেটিকাল" },
  "hypothetical": { bn: "কাল্পনিক", pr: "হাইপোথেটিকাল" },
  "imaginary": { bn: "কাল্পনিক দৃশ্য", pr: "ইমাজিনারি" },
  "regret": { bn: "অনুতাপ করা", pr: "রিগ্রেট" },
  "wish": { bn: "ইচ্ছা পোষণ করা", pr: "উইশ" },
  "assume": { bn: "অনুমান করে নেওয়া", pr: "অ্যাসিউম" },
  "speculate": { bn: "জল্পনা-কল্পনা করা", pr: "স্পেকুলেট" },
  "contrary": { bn: "বিপরীত", pr: "কনট্রারি" },
  "unreal": { bn: "অবাস্তব", pr: "আনরিয়েল" },
  "counterfactual": { bn: "বাস্তব বিরোধী তথ্য", pr: "কাউন্টারফ্যাকচুয়াল" },
  "avoid": { bn: "এড়িয়ে চলা", pr: "অ্যাভয়েড" },
  "consider": { bn: "বিবেচনা করা", pr: "কনসিডার" },
  "manage": { bn: "ব্যবস্থাপনা বা সফল হওয়া", pr: "ম্যানেজ" },
  "refuse": { bn: "প্রত্যাখ্যান করা", pr: "রিফিউজ" },
  "attempt": { bn: "চেষ্টা করা", pr: "অ্যাটেম্পট" },
  "prefer": { bn: "অধিকতর পছন্দ করা", pr: "প্রেফার" },
  "run out": { bn: "শেষ হয়ে যাওয়া", pr: "রান আউট" },
  "put off": { bn: "স্থগিত রাখা", pr: "পুট অফ" },
  "come across": { bn: "হঠাৎ দেখা পাওয়া", pr: "কাম অ্যাক্রস" },
  "bring up": { bn: "লালন-পালন করা / উত্থাপন করা", pr: "ব্রিং আপ" },
  "break down": { bn: "ভেঙে পড়া / অচল হওয়া", pr: "ব্রেক ডাউন" },
  "carry on": { bn: "চালিয়ে যাওয়া", pr: "ক্যারী অন" },
  "set up": { bn: "প্রতিষ্ঠা করা", pr: "সেট আপ" },
  "turn down": { bn: "প্রত্যাখ্যান করা / ভলিউম কমানো", pr: "টার্ন ডাউন" },
  "analyze": { bn: "বিশ্লেষণ করা", pr: "অ্যানালাইজ" },
  "evaluate": { bn: "মূল্যায়ন করা", pr: "ইভ্যালুয়েট" },
  "demonstrate": { bn: "প্রমাণ বা প্রদর্শন করা", pr: "ডেমনস্ট্রেট" },
  "illustrate": { bn: "উদাহরণ দিয়ে বোঝানো", pr: "ইলাস্ট্রেট" },
  "indicate": { bn: "নির্দেশ করা", pr: "ইন্ডিকেট" },
  "significant": { bn: "তাৎপর্যপূর্ণ", pr: "সিগনিফিক্যান্ট" },
  "substantial": { bn: "প্রচুর / টেকসই", pr: "সাবস্ট্যানশিয়াল" },
  "furthermore": { bn: "তাছাড়া", pr: "ফার্দারমোর" },
  "consequently": { bn: "ফলস্বরূপ", pr: "কনসিকুয়েন্টলি" },
  "nevertheless": { bn: "তবুও", pr: "নেভারদালাইস" },
  "agenda": { bn: "আলোচ্যসূচী", pr: "অ্যাজেন্ডা" },
  "minutes": { bn: "সভার কার্যবিবরণী", pr: "মিনিটস" },
  "deadline": { bn: "নির্দিষ্ট শেষ সময়", pr: "ডেডলাইন" },
  "stakeholder": { bn: "অংশীদার", pr: "স্টেকহোল্ডার" },
  "deliverable": { bn: "প্রদেয় পণ্য বা ফলাফল", pr: "ডেলিভারেবল" },
  "benchmark": { bn: "মানদণ্ড", pr: "বেঞ্চমার্ক" },
  "synergy": { bn: "সম্মিলিত শক্তি", pr: "সিনার্জি" },
  "leverage": { bn: "সুবিধা নেওয়া / প্রভাব খাটানো", pr: "লিভারেজ" },
  "scalable": { bn: "সম্প্রসারণযোগ্য", pr: "স্কেলাবল" },
  "roi": { bn: "বিনিয়োগের লাভ (Return on Investment)", pr: "আর-ও-আই" },

  // Day 21-30 (Advanced Content Words)
  "subjunctive": { bn: "অনুজ্ঞা ভাববাচক ক্রিয়ারূপ", pr: "সাবজাঙ্কটিভ" },
  "inversion": { bn: "ব্যাকরণিক পদক্রম উল্টানো", pr: "ইনভারশন" },
  "emphasis": { bn: "জোর প্রদান করা", pr: "এমফ্যাসিস" },
  "formal register": { bn: "আনুষ্ঠানিক ভাষা শৈলী", pr: "ফরমাল রেজিস্টার" },
  "literary": { bn: "সাহিত্যিক", pr: "লিটারারি" },
  "rhetorical": { bn: "আলংকারিক বা বাগ্মীতা পূর্ণ", pr: "রেটোরিকাল" },
  "syntactic": { bn: "বাক্য গঠন সংক্রান্ত", pr: "সিনট্যাক্টিক" },
  "clause": { bn: "খণ্ডবাক্য", pr: "ক্লজ" },
  "auxiliary": { bn: "সাহায্যকারী ক্রিয়াপদ", pr: "অক্সিলিয়ারি" },
  "imperative": { bn: "আদেশসূচক", pr: "ইম্পারেটিভ" },
  "cohesion": { bn: "যোগসূত্র / সংগতি", pr: "কোশেন" },
  "coherence": { bn: "সামঞ্জস্যতা", pr: "কোহিয়ারেন্স" },
  "discourse": { bn: "প্রবন্ধ / আলোচনা", pr: "ডিসকোর্স" },
  "transition": { bn: "পরিবর্তন বা উত্তরণকাল", pr: "ট্রানজিশন" },
  "connective": { bn: "সংযোগকারী শব্দ", pr: "কানেক্টিভ" },
  "anaphora": { bn: "পূর্ববর্তী পদের পুনরুল্লেখ", pr: "অ্যানাফোরা" },
  "cataphora": { bn: "পরবর্তী পদের আগাম উল্লেখ", pr: "ক্যাটাফোরা" },
  "ellipsis": { bn: "শব্দলোপ", pr: "ইলিপসিস" },
  "substitution": { bn: "বিকল্প প্রতিস্থাপন", pr: "সাবস্টিটিউশন" },
  "reference": { bn: "সূত্র বা উল্লেখ", pr: "রেফারেন্স" },
  "collocation": { bn: "শব্দগুচ্ছের স্বাভাবিক সহাবস্থান", pr: "কলোকেশন" },
  "morphology": { bn: "শব্দতত্ত্ব", pr: "মরফোলজি" },
  "prefix": { bn: "উপসর্গ", pr: "প্রিফিক্স" },
  "suffix": { bn: "প্রত্যয়", pr: "সাফিক্স" },
  "root word": { bn: "মূল শব্দ", pr: "রুট ওয়ার্ড" },
  "derivative": { bn: "মূল শব্দ থেকে উৎপন্ন পদ", pr: "ডেরাইভেটিভ" },
  "compound": { bn: "যৌগিক শব্দ", pr: "কম্পাউন্ড" },
  "synonym": { bn: "সমার্থক শব্দ", pr: "সিনোনিম" },
  "antonym": { bn: "বিপরীতার্থক শব্দ", pr: "অ্যান্টোনিম" },
  "connotation": { bn: "অর্থের পরোক্ষ আভাস বা ব্যঞ্জনা", pr: "কনোটেশন" },
  "inference": { bn: "অনুমান / সিদ্ধান্ত", pr: "ইনফারেন্স" },
  "implication": { bn: "উহ্য বা অন্তর্নিহিত অর্থ", pr: "ইমপ্লিকেশন" },
  "denotation": { bn: "আক্ষরিক বা মূখ্য অর্থ", pr: "ডিনোটেশন" },
  "bias": { bn: "পক্ষপাতিত্ব", pr: "বায়াস" },
  "perspective": { bn: "দৃষ্টিকোণ", pr: "পারসপেক্টিভ" },
  "rhetoric": { bn: "অলংকারশাস্ত্র", pr: "রেটোরিক" },
  "credibility": { bn: "বিশ্বাসযোগ্যতা", pr: "ক্রেডিবিলিটি" },
  "validity": { bn: "বৈধতা", pr: "ভ্যালিডিটি" },
  "objectivity": { bn: "নিরপেক্ষতা", pr: "অবজেক্টিভিটি" },
  "contention": { bn: "যুক্তি বা প্রধান দাবি", pr: "কনটেনশন" },
  "proposition": { bn: "প্রস্তাবনা", pr: "প্রপজিশন" },
  "refute": { bn: "যুক্তি দিয়ে খণ্ডন করা", pr: "রিফিউট" },
  "concede": { bn: "সত্যতা স্বীকার করা", pr: "কনসীড" },
  "rebut": { bn: "পাল্টা যুক্তি দেওয়া", pr: "রিবুট" },
  "premise": { bn: "মূল ভিত্তি বা অনুমিত শর্ত", pr: "প্রিমিস" },
  "fallacy": { bn: "হেত্বাভাস বা ভুল যুক্তি", pr: "ফ্যালাসি" },
  "persuasion": { bn: "প্ররোচনা বা পটানো", pr: "পারসুয়েশন" },
  "metaphor": { bn: "রূপক অলংকার", pr: "মেটাফোর" },
  "simile": { bn: "উপমা অলংকার", pr: "সিমিলি" },
  "euphemism": { bn: "কোমলতর বা শ্রুতিমধুর প্রকাশ", pr: "ইউফেমিজম" },
  "understatement": { bn: "কমিয়ে বা হালকা করে বলা", pr: "আন্ডারস্টেটমেন্ট" },
  "hyperbole": { bn: "অতিরঞ্জন", pr: "হাইপারবোল" },
  "irony": { bn: "ব্যঙ্গোক্তি / বিদ্রূপ", pr: "আয়রনি" },
  "sarcasm": { bn: "কটূক্তি বা তীব্র উপহাস", pr: "সারকাজম" },
  "alliteration": { bn: "অনুপ্রাস অলংকার", pr: "অ্যালিটারেশন" },
  "personification": { bn: "অচেতন বস্তুতে মানবিক গুণের আরোপ", pr: "পারসনিফিকেশন" },
  "oxymoron": { bn: "বিরোধাভাস অলংকার", pr: "অক্সিমোরন" },
  "citation": { bn: "উদ্ধৃতি বা উৎসের উল্লেখ", pr: "সাইটেশন" },
  "bibliography": { bn: "সহায়ক গ্রন্থপঞ্জি", pr: "বিবলিওগ্রাফি" },
  "paraphrase": { bn: "ভিন্ন শব্দে পুনর্লিখন", pr: "প্যারাফ্রেজ" },
  "synthesize": { bn: "সমন্বয় বা সংশ্লেষণ করা", pr: "সিন্থেসাইজ" },
  "plagiarism": { bn: "মেধাস্বত্ব চুরি", pr: "প্লেজিয়ারিজম" },
  "peer-reviewed": { bn: "বিশেষজ্ঞ দ্বারা পর্যালোচিত", pr: "পিয়ার-রিভিউড" },
  "methodology": { bn: "গবেষণা পদ্ধতি", pr: "মেথডোলজি" },
  "hypothesis": { bn: "অনুকল্প / খসড়া অনুমান", pr: "হাইপোথিসিস" },
  "empirical": { bn: "পরীক্ষামূলক বা বাস্তবভিত্তিক", pr: "এম্পিরিকাল" },
  "plaintiff": { bn: "বাদী বা ফরিয়াদী", pr: "প্লেনটিফ" },
  "diagnosis": { bn: "রোগ নির্ণয়", pr: "ডায়াগনসিস" },
  "algorithm": { bn: "ধাপভিত্তিক গাণিতিক নিয়ম", pr: "অ্যালগরিদম" },
  "equity": { bn: "মূলধন / সাধারণ অংশীদারিত্ব", pr: "ইকুইটি" },
  "jurisdiction": { bn: "এখতিয়ার বা বিচারসীমা", pr: "জুরিসডিকশন" },
  "prognosis": { bn: "রোগের ভবিষ্যৎ পূর্বাভাস", pr: "প্রগনোসিস" },
  "bandwidth": { bn: "তথ্য আদান-প্রদানের গতিমাত্রা", pr: "ব্যান্ডউইথ" },
  "liability": { bn: "দায়বদ্ধতা বা ঋণ", pr: "লায়াবিলিটি" },
  "symptom": { bn: "রোগের লক্ষণ", pr: "সিম্পটম" },
  "protocol": { bn: "নিয়মাবলী বা কার্যবিধি", pr: "প্রোটোকল" },
  "intercultural": { bn: "আন্তঃসাংস্কৃতিক", pr: "ইন্টারকালচারাল" },
  "cross-cultural": { bn: "বিভিন্ন সংস্কৃতির তুলনামূলক", pr: "ক্রস-কালচারাল" },
  "stereotype": { bn: "বাঁধাধরা গতানুগতিক ধারণা", pr: "স্টেরিওটাইপ" },
  "ethnocentrism": { bn: "স্বজাত্যবোধ বা নিজের সংস্কৃতিকে সেরা ভাবা", pr: "এথনোসেন্ট্রিজম" },
  "cultural relativism": { bn: "সাংস্কৃতিক আপেক্ষিকতাবাদ", pr: "কালচারাল রিলেটিভিজম" },
  "high-context": { bn: "পরোক্ষ বা সংকেতপ্রধান যোগাযোগ শৈলী", pr: "হাই-কনটেক্সট" },
  "low-context": { bn: "সরাসরি ও স্পষ্ট যোগাযোগ শৈলী", pr: "লো-কনটেক্সট" },
  "face-saving": { bn: "সম্মান বা মর্যাদা রক্ষা", pr: "ফেস-সেভিং" },
  "taboo": { bn: "সামাজিক নিষেধাজ্ঞা বা বর্জনীয় বিষয়", pr: "ট্যাবু" },
  "fluency": { bn: "সাবলীলতা", pr: "ফ্লুয়েন্সি" },
  "proficiency": { bn: "দক্ষতা বা পারদর্শিতা", pr: "প্রফিশিয়েন্সি" },
  "mastery": { bn: "পূর্ণ আধিপত্য বা আয়ত্ত", pr: "মাস্টারি" },
  "competence": { bn: "যোগ্যতা বা সক্ষমতা", pr: "কম্পিটেন্স" },
  "acquisition": { bn: "সহজাত ভাষা অর্জন প্রক্রিয়া", pr: "অ্যাকুইজিশন" },
  "immersion": { bn: "ভাষার পরিবেশে পূর্ণ নিমজ্জন", pr: "ইমার্শন" },
  "consistency": { bn: "ধারাবাহিকতা", pr: "কনসিস্টেন্সি" },
  "perseverance": { bn: "অধ্যাবসায় / একনিষ্ঠতা", pr: "পারসিভিয়ারেন্স" },
  "dedication": { bn: "উৎসর্গীকৃত মনোভাব", pr: "ডেডিকেশন" }
};

/* ============================================================
   VOCABULARY DATA WITH BANGLA FEATURE FIELDS
   ============================================================ */
const VOCAB_DAILY = [
  { word: "Abundant", pos: "adjective", pronunciationBangla: "অ্যাবানড্যান্ট", meaningBangla: "প্রচুর, ওফুরন্ত", def: "Existing in large quantities; more than enough.", syn: "plentiful, ample", ant: "scarce, rare", ex: "The region has abundant natural resources." },
  { word: "Benevolent", pos: "adjective", pronunciationBangla: "বেনেভোলেন্ট", meaningBangla: "দয়ালু, পরোপকারী", def: "Well-meaning and kindly; generous.", syn: "kind, charitable", ant: "malevolent, cruel", ex: "The benevolent donor funded the entire school." },
  { word: "Candid", pos: "adjective", pronunciationBangla: "ক্যান্ডিড", meaningBangla: "অকপটে কথা বলা, স্পষ্টভাষী", def: "Truthful and straightforward; frank.", syn: "honest, direct", ant: "dishonest, evasive", ex: "She gave a candid assessment of the situation." },
  { word: "Diligent", pos: "adjective", pronunciationBangla: "ডিলিজেন্ট", meaningBangla: "পরিশ্রমী, অধ্যাবসায়ী", def: "Having or showing care and conscientiousness in one's work.", syn: "hardworking, industrious", ant: "lazy, negligent", ex: "He was a diligent student who never missed a class." },
  { word: "Eloquent", pos: "adjective", pronunciationBangla: "অ্যালোকোয়েন্ট", meaningBangla: "বাগ্মী, sabolīl বক্তা", def: "Fluent or persuasive in speaking or writing.", syn: "articulate, expressive", ant: "inarticulate, tongue-tied", ex: "Her eloquent speech moved the entire audience." },
  { word: "Frugal", pos: "adjective", pronunciationBangla: "ফ্রুগাল", meaningBangla: "মিতব্যয়ী, হিসাব করে চলা", def: "Sparing or economical with money or food.", syn: "thrifty, economical", ant: "wasteful, extravagant", ex: "Living a frugal lifestyle helped him save for retirement." },
  { word: "Gregarious", pos: "adjective", pronunciationBangla: "গ্রেগেরিয়াস", meaningBangla: "মিশুক, দলপ্রিয়", def: "Fond of company; sociable.", syn: "sociable, outgoing", ant: "introverted, solitary", ex: "She was gregarious and made friends easily." },
  { word: "Humble", pos: "adjective", pronunciationBangla: "হাম্বল", meaningBangla: "নম্র, বিনীত", def: "Having a modest opinion of oneself; not proud.", syn: "modest, unassuming", ant: "arrogant, proud", ex: "Despite his success, he remained humble." },
  { word: "Innovative", pos: "adjective", pronunciationBangla: "ইনোভেティブ", meaningBangla: "উদ্ভাবনী, নতুনত্বপূর্ণ", def: "Featuring new methods; advanced and original.", syn: "creative, pioneering", ant: "conventional, traditional", ex: "The company is known for its innovative products." },
  { word: "Jubilant", pos: "adjective", pronunciationBangla: "জুবিল্যান্ট", meaningBangla: "উল্লসিত, অত্যন্ত আনন্দিত", def: "Feeling or expressing great happiness and triumph.", syn: "elated, overjoyed", ant: "despondent, miserable", ex: "The team was jubilant after winning the championship." },
  { word: "Keen", pos: "adjective", pronunciationBangla: "কীন", meaningBangla: "আগ্রহী, তীব্র, তীক্ষ্ণ", def: "Having or showing eagerness or enthusiasm.", syn: "eager, enthusiastic", ant: "indifferent, apathetic", ex: "She was keen to learn new skills." },
  { word: "Lucid", pos: "adjective", pronunciationBangla: "লুসিড", meaningBangla: "স্পষ্ট, সহজবোধ্য", def: "Expressed clearly; easy to understand.", syn: "clear, coherent", ant: "confusing, obscure", ex: "His lucid explanation made the concept easy to grasp." },
  { word: "Meticulous", pos: "adjective", pronunciationBangla: "মেটিকিউলাস", meaningBangla: "খুঁতখুঁতে, অতি যত্নশীল", def: "Showing great attention to detail; very careful.", syn: "thorough, precise", ant: "careless, sloppy", ex: "She was meticulous in her research." },
  { word: "Nuanced", pos: "adjective", pronunciationBangla: "নূয়্যান্সড", meaningBangla: "সূক্ষ্ম তারতম্যপূর্ণ", def: "Characterized by subtle distinctions or variations.", syn: "subtle, refined", ant: "simplistic, crude", ex: "His nuanced understanding of the issue impressed everyone." },
  { word: "Optimistic", pos: "adjective", pronunciationBangla: "অপটিমিস্টিক", meaningBangla: "আশাবাদী", def: "Hopeful and confident about the future.", syn: "positive, hopeful", ant: "pessimistic, negative", ex: "She remained optimistic despite the challenges." },
  { word: "Pragmatic", pos: "adjective", pronunciationBangla: "প্র্যাগম্যাটিক", meaningBangla: "বাস্তববাদী, ব্যবহারিক", def: "Dealing with things sensibly and realistically.", syn: "practical, realistic", ant: "idealistic, impractical", ex: "We need a pragmatic approach to solve this problem." },
  { word: "Resilient", pos: "adjective", pronunciationBangla: "রেজিলিয়েন্ট", meaningBangla: "স্থিতিস্থাপক, বাধা কাটিয়ে উঠতে সক্ষম", def: "Able to recover quickly from difficulties.", syn: "tough, adaptable", ant: "fragile, vulnerable", ex: "Children are remarkably resilient." },
  { word: "Sophisticated", pos: "adjective", pronunciationBangla: "সোফিস্টিকেটেড", meaningBangla: "পরিশীলিত, উন্নত, জটিল", def: "Having a refined knowledge of the world.", syn: "cultured, refined", ant: "naive, unsophisticated", ex: "She had a sophisticated taste in art." },
  { word: "Tenacious", pos: "adjective", pronunciationBangla: "টেনেশিয়াস", meaningBangla: "ছোড়বান্দা, দৃঢ়প্রতিজ্ঞ", def: "Tending to keep a firm hold; persistent.", syn: "persistent, determined", ant: "weak, yielding", ex: "His tenacious spirit helped him overcome every obstacle." },
  { word: "Versatile", pos: "adjective", pronunciationBangla: "ভার্সাটাইল", meaningBangla: "বহুমুখী প্রতিভাধর, পরিবর্তনযোগ্য", def: "Able to adapt or be adapted to many functions.", syn: "adaptable, flexible", ant: "limited, inflexible", ex: "She is a versatile actress who can play any role." }
];

const VOCAB_IDIOMS = [
  { phrase: "Break a leg", meaning: "Good luck (used especially in theater)", example: "Break a leg at your audition tonight!" },
  { phrase: "Hit the nail on the head", meaning: "To describe exactly what is causing a situation or problem", example: "You hit the nail on the head with that analysis." },
  { phrase: "Bite the bullet", meaning: "To endure a painful or difficult situation", example: "I just had to bite the bullet and tell him the truth." },
  { phrase: "Spill the beans", meaning: "To reveal secret information accidentally or indiscreetly", example: "Don't spill the beans about the surprise party!" },
  { phrase: "Under the weather", meaning: "Feeling ill or unwell", example: "I'm feeling a bit under the weather today." },
  { phrase: "Burn the midnight oil", meaning: "To work late into the night", example: "She burned the midnight oil to finish the project." },
  { phrase: "Cost an arm and a leg", meaning: "To be very expensive", example: "That designer bag costs an arm and a leg." },
  { phrase: "Let the cat out of the bag", meaning: "To accidentally reveal a secret", example: "He let the cat out of the bag about the merger." },
  { phrase: "Once in a blue moon", meaning: "Very rarely", example: "I only eat fast food once in a blue moon." },
  { phrase: "The ball is in your court", meaning: "It is up to you to make the next decision", example: "I've made my offer. The ball is in your court now." },
  { phrase: "Bite off more than you can chew", meaning: "To take on more responsibility than you can handle", example: "I think I bit off more than I could chew with this project." },
  { phrase: "Beat around the bush", meaning: "To avoid talking about what is important", example: "Stop beating around the bush and tell me what happened." },
  { phrase: "Get out of hand", meaning: "To become out of control", example: "The situation got out of hand very quickly." },
  { phrase: "Hit the sack", meaning: "To go to bed", example: "I'm exhausted. I'm going to hit the sack." },
  { phrase: "Kill two birds with one stone", meaning: "To accomplish two things with a single action", example: "By cycling to work, I kill two birds with one stone." }
];

const VOCAB_PHRASAL = [
  { verb: "Break down", meaning: "To stop functioning; to lose emotional control", example: "The car broke down on the highway. She broke down in tears." },
  { verb: "Bring up", meaning: "To raise a child; to mention a topic", example: "She was brought up in a small town. He brought up an interesting point." },
  { verb: "Call off", meaning: "To cancel something", example: "They called off the meeting due to bad weather." },
  { verb: "Carry on", meaning: "To continue doing something", example: "Please carry on with your work." },
  { verb: "Come across", meaning: "To find or meet by chance", example: "I came across an old photo album in the attic." },
  { verb: "Cut down on", meaning: "To reduce the amount of something", example: "The doctor told him to cut down on sugar." },
  { verb: "Deal with", meaning: "To handle or manage a situation", example: "She knows how to deal with difficult customers." },
  { verb: "Figure out", meaning: "To understand or solve something", example: "I can't figure out how to use this software." },
  { verb: "Get along with", meaning: "To have a good relationship with someone", example: "She gets along well with all her colleagues." },
  { verb: "Give up", meaning: "To stop doing something; to surrender", example: "Never give up on your dreams." },
  { verb: "Look forward to", meaning: "To feel excited about something in the future", example: "I'm looking forward to the holidays." },
  { verb: "Make up", meaning: "To invent; to reconcile after an argument", example: "He made up an excuse. They made up after the fight." },
  { verb: "Put off", meaning: "To postpone; to delay", example: "Don't put off until tomorrow what you can do today." },
  { verb: "Run out of", meaning: "To have no more of something", example: "We've run out of coffee. Can you buy some?" },
  { verb: "Take after", meaning: "To resemble a parent or relative", example: "She takes after her mother in personality." }
];

const VOCAB_BUSINESS = [
  { word: "Acquisition", pos: "noun", pronunciationBangla: "অ্যাকুইজিশন", meaningBangla: "অধিগ্রহণ, লাভ করা", def: "The purchase of one company by another.", syn: "takeover, merger", ant: "divestiture", ex: "The acquisition of the startup cost $2 billion." },
  { word: "Benchmark", pos: "noun", pronunciationBangla: "বেঞ্চমার্ক", meaningBangla: "মানদণ্ড", def: "A standard or point of reference for comparison.", syn: "standard, criterion", ant: "anomaly", ex: "We use industry benchmarks to measure performance." },
  { word: "Contingency", pos: "noun", pronunciationBangla: "কনটিনজেন্সি", meaningBangla: "আকস্মিক পরিস্থিতি", def: "A future event that is possible but cannot be certain.", syn: "possibility, eventuality", ant: "certainty", ex: "We have a contingency plan for every scenario." },
  { word: "Diversify", pos: "verb", pronunciationBangla: "ডাইভারসিফাই", meaningBangla: "বহুমুখীকরণ করা", def: "To make or become more varied; to spread investment.", syn: "vary, expand", ant: "concentrate, specialize", ex: "The company decided to diversify its product range." },
  { word: "Entrepreneur", pos: "noun", pronunciationBangla: "আঁন্ট্রাপ্রেনার", meaningBangla: "উদ্যোক্তা", def: "A person who sets up a business, taking on financial risks.", syn: "founder, innovator", ant: "employee", ex: "She became a successful entrepreneur at age 25." },
  { word: "Fiscal", pos: "adjective", pronunciationBangla: "ফিসকাল", meaningBangla: "রাজস্ব সংক্রান্ত, আর্থিক", def: "Relating to government revenue, especially taxes.", syn: "financial, monetary", ant: "non-financial", ex: "The fiscal year ends in March." },
  { word: "Leverage", pos: "noun/verb", pronunciationBangla: "লিভারেজ", meaningBangla: "প্রভাব খাটানো, সুবিধা নেওয়া", def: "Use of borrowed capital; to use something to maximum advantage.", syn: "influence, utilize", ant: "underutilize", ex: "We can leverage our existing network to grow faster." },
  { word: "Mitigation", pos: "noun", meaningBangla: "উপশম, তীব্রতা হ্রাস", def: "The action of reducing the severity of something.", syn: "reduction, alleviation", ant: "aggravation", ex: "Risk mitigation is essential in project management." },
  { word: "Outsource", pos: "verb", pronunciationBangla: "আউটসোর্স", meaningBangla: "বহিঃউৎস থেকে কাজ করানো", def: "To obtain goods or services from an outside supplier.", syn: "contract out, delegate", ant: "insource", ex: "Many companies outsource their IT support." },
  { word: "Scalable", pos: "adjective", pronunciationBangla: "স্কেলাবল", meaningBangla: "সম্প্ৰসারণযোগ্য", def: "Able to be changed in size or scale; able to grow.", syn: "expandable, adaptable", ant: "rigid, fixed", ex: "We need a scalable solution for our growing business." }
];

const VOCAB_ACADEMIC = [
  { word: "Analyze", pos: "verb", pronunciationBangla: "অ্যানালাইজ", meaningBangla: "বিশ্লেষণ করা", def: "To examine methodically and in detail.", syn: "examine, investigate", ant: "ignore, overlook", ex: "The researchers analyzed the data carefully." },
  { word: "Concept", pos: "noun", pronunciationBangla: "কনসেপ্ট", meaningBangla: "ধারণা", def: "An abstract idea; a general notion.", syn: "idea, notion", ant: "concrete fact", ex: "The concept of democracy has evolved over centuries." },
  { word: "Constitute", pos: "verb", pronunciationBangla: "কনসিটিউট", meaningBangla: "গঠন করা, উপাদান হওয়া", def: "To be a part of a whole; to make up.", syn: "comprise, form", ant: "exclude", ex: "Women constitute 52% of the population." },
  { word: "Context", pos: "noun", pronunciationBangla: "কনটেক্সট", meaningBangla: "প্রসঙ্গ, প্রেক্ষাপট", def: "The circumstances that form the setting for an event.", syn: "background, setting", ant: "isolation", ex: "You need to understand the historical context." },
  { word: "Derive", pos: "verb", pronunciationBangla: "ডেরাইভ", meaningBangla: "উৎস থেকে পাওয়া, ahরণ করা", def: "To obtain something from a specified source.", syn: "obtain, get", ant: "give, provide", ex: "The word 'democracy' derives from Greek." },
  { word: "Establish", pos: "verb", pronunciationBangla: "এস্টাব্লিশ", meaningBangla: "প্রতিষ্ঠা করা", def: "To set up on a firm or permanent basis.", syn: "found, create", ant: "abolish, destroy", ex: "The university was established in 1850." },
  { word: "Evaluate", pos: "verb", pronunciationBangla: "ইভ্যালুয়েট", meaningBangla: "মূল্যায়ন করা", def: "To form an idea of the amount or value of; to assess.", syn: "assess, appraise", ant: "ignore, neglect", ex: "We need to evaluate the effectiveness of the program." },
  { word: "Hypothesis", pos: "noun", pronunciationBangla: "হাইপোথিসিস", meaningBangla: "অনুমান, হাইপোথিসিস", def: "A proposed explanation made on the basis of limited evidence.", syn: "theory, proposition", ant: "fact, certainty", ex: "The scientist tested her hypothesis through experiments." },
  { word: "Significant", pos: "adjective", pronunciationBangla: "সিগনিফিক্যান্ট", meaningBangla: "গুরুত্বপূর্ণ, তাৎপর্যপূর্ণ", def: "Sufficiently great or important to be worthy of attention.", syn: "important, notable", ant: "insignificant, trivial", ex: "There was a significant improvement in test scores." },
  { word: "Subsequent", pos: "adjective", pronunciationBangla: "সাবসিকুয়েন্ট", meaningBangla: "পরবর্তী", def: "Coming after or following.", syn: "following, later", ant: "previous, prior", ex: "Subsequent research confirmed the initial findings." }
];

/* ============================================================
   APP OBJECT
   ============================================================ */
const app = {
  currentSection: 'dashboard',
  currentDay: null,
  completedDays: [],
  isDarkMode: false,
  currentQuizDay: null,

  /* ── INIT ── */
  init() {
    this.loadState();
    this.buildSidebar();
    this.buildDayCards();
    this.buildVocabulary();
    this.buildIdioms();
    this.buildPhrasalVerbs();
    this.buildBusinessVocab();
    this.buildAcademicVocab();
    this.updateProgress();
    this.bindEvents();
    this.applyTheme();
    this.updateCertificateStats();
    const savedSection = localStorage.getItem('eng_last_section') || 'dashboard';
    this.goToSection(savedSection);
  },

  /* ── STATE MANAGEMENT ── */
  loadState() {
    try {
      const saved = localStorage.getItem('fluentpath_state');
      if (saved) {
        const state = JSON.parse(saved);
        this.completedDays = state.completedDays || [];
        this.isDarkMode = state.isDarkMode || false;
      }
    } catch (e) {
      this.completedDays = [];
      this.isDarkMode = false;
    }
  },

  saveState() {
    try {
      localStorage.setItem('fluentpath_state', JSON.stringify({
        completedDays: this.completedDays,
        isDarkMode: this.isDarkMode
      }));
    } catch (e) { /* silent fail */ }
  },

  /* ── TEXT TO SPEECH (PRONUNCIATION ENGINE) ── */
  speakWord(text) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); 
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US'; 
      utterance.rate = 0.9; 
      window.speechSynthesis.speak(utterance);
    } else {
      console.warn('Text-to-speech engine fallback used.');
      const audioFallback = new Audio(`https://dict.youdao.com/dictvoice?type=2&audio=${encodeURIComponent(text)}`);
      audioFallback.play().catch(() => {
         this.showToast('⚠️ Audio output stream restricted by system configuration.', 'warning');
      });
    }
  },

  /* ── THEME ── */
  applyTheme() {
    const body = document.body;
    const btn = document.getElementById('themeToggle');
    if (this.isDarkMode) {
      body.classList.remove('light-mode');
      body.classList.add('dark-mode');
      if (btn) btn.textContent = '☀️';
    } else {
      body.classList.remove('dark-mode');
      body.classList.add('light-mode');
      if (btn) btn.textContent = '🌙';
    }
  },

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    this.applyTheme();
    this.saveState();
  },

  /* ── NAVIGATION ── */
  goToSection(sectionId) {
    localStorage.setItem('eng_last_section', sectionId);
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(sectionId);
    if (target) target.classList.add('active');

    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.toggle('active', link.dataset.section === sectionId);
    });

    document.querySelectorAll('.day-item').forEach(item => {
      item.classList.remove('active');
    });

    this.currentSection = sectionId;

    const navLinks = document.getElementById('navLinks');
    if (navLinks) navLinks.classList.remove('open');

    if (window.innerWidth <= 768) {
      this.closeSidebar();
    }

    if (sectionId === 'certificate') {
      this.updateCertificateStats();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  /* ── SIDEBAR ── */
  buildSidebar() {
    const list = document.getElementById('dayList');
    if (!list) return;
    list.innerHTML = '';
    COURSE_DAYS.forEach(day => {
      const isCompleted = this.completedDays.includes(day.day);
      const li = document.createElement('li');
      li.className = `day-item${isCompleted ? ' completed' : ''}`;
      li.dataset.day = day.day;
      li.innerHTML = `
        <div class="day-num">${day.day}</div>
        <div class="day-info">
          <div class="day-title">${day.title}</div>
          <div class="day-level">${day.level}</div>
        </div>
        <div class="day-check">✓</div>
      `;
      li.addEventListener('click', () => this.openLesson(day.day));
      list.appendChild(li);
    });
  },

  openSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    if (sidebar) sidebar.classList.add('open');
    if (overlay) overlay.classList.add('open');
  },

  closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    if (sidebar) sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
  },

  /* ── DAY CARDS ── */
  buildDayCards() {
    const grid = document.getElementById('dayCardsGrid');
    if (!grid) return;
    grid.innerHTML = '';
    COURSE_DAYS.forEach(day => {
      const isCompleted = this.completedDays.includes(day.day);
      const card = document.createElement('div');
      card.className = `day-card${isCompleted ? ' completed' : ''}`;
      card.dataset.day = day.day;
      card.innerHTML = `
        <div class="dc-header">
          <div class="dc-num">${isCompleted ? '✓' : day.day}</div>
          <div class="dc-meta">
            <div class="dc-day">Day ${day.day}</div>
            <div class="dc-title">${day.title}</div>
          </div>
          <span class="dc-level ${day.level}">${day.level}</span>
        </div>
        <div class="dc-topics">
          ${day.topics.map(t => `<span class="dc-topic">${t}</span>`).join('')}
        </div>
        <div class="dc-footer">
          <div class="dc-status">${isCompleted ? '✓ Completed' : ''}</div>
          <button class="dc-btn">Open Lesson →</button>
        </div>
      `;
      card.addEventListener('click', () => this.openLesson(day.day));
      grid.appendChild(card);
    });
  },

  /* ── LESSON DETAIL ── */
  openLesson(dayNum) {
    const day = COURSE_DAYS.find(d => d.day === dayNum);
    if (!day) return;
    this.currentDay = dayNum;

    const isCompleted = this.completedDays.includes(dayNum);
    const prevDay = dayNum > 1 ? dayNum - 1 : null;
    const nextDay = dayNum < 30 ? dayNum + 1 : null;

    const content = document.getElementById('lessonContent');
    if (!content) return;

    const vocabHTML = day.vocabulary.map(v => {
      if (typeof v === 'string') {
        const lowerWord = v.toLowerCase().trim();
        const safeWordParam = v.replace(/'/g, "\\'");
        
        // ১ থেকে ৩০ দিনের যেকোনো ওয়ার্ড এখন GLOBAL_BANGLA_MAP অবজেক্ট থেকে ডেটা রেন্ডার করবে
        if (GLOBAL_BANGLA_MAP[lowerWord]) {
          const targetBn = GLOBAL_BANGLA_MAP[lowerWord];
          return `
            <div class="vocab-day-item" style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding: 12px 10px; background: var(--card-bg); margin-bottom: 8px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
              <div>
                <div class="vdi-word" style="font-weight: 700; color: #2563eb; font-size: 1.1rem; text-transform: capitalize;">${v}</div>
                <div style="font-size: 0.9rem; color: var(--text-muted); margin-top: 4px;">
                  <strong>উচ্চারণ:</strong> [ ${targetBn.pr} ] <span style="margin: 0 8px; color: rgba(255,255,255,0.2);">|</span> <strong>অর্থ:</strong> ${targetBn.bn}
                </div>
              </div>
              <button onclick="app.speakWord('${safeWordParam}')" style="background: none; border: none; cursor: pointer; font-size: 1.3rem; padding: 5px; color: #2563eb;" title="Listen Pronunciation">🔊</button>
            </div>`;
        } else {
          return `
            <div class="vocab-day-item" style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding: 12px 10px; background: var(--card-bg); margin-bottom: 8px; border-radius: 8px;">
              <div class="vdi-word" style="font-weight: 600; font-size: 1.1rem; text-transform: capitalize;">${v}</div>
              <button onclick="app.speakWord('${safeWordParam}')" style="background: none; border: none; cursor: pointer; font-size: 1.3rem; padding: 5px; color: #2563eb;" title="Listen Pronunciation">🔊</button>
            </div>`;
        }
      } else {
        const fallbackWord = (v.word || '').replace(/'/g, "\\'");
        return `
          <div class="vocab-day-item" style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding: 12px 10px; background: var(--card-bg); margin-bottom: 8px; border-radius: 8px;">
            <div class="vdi-word" style="font-weight: 600; font-size: 1.1rem; text-transform: capitalize;">${v.word || ''}</div>
            <button onclick="app.speakWord('${fallbackWord}')" style="background: none; border: none; cursor: pointer; font-size: 1.3rem; padding: 5px; color: #2563eb;" title="Listen Pronunciation">🔊</button>
          </div>`;
      }
    }).join('');

    content.innerHTML = `
      <div class="lesson-nav">
        <button class="lesson-nav-btn back" onclick="app.goToSection('lessons')">← Back to Lessons</button>
        ${prevDay ? `<button class="lesson-nav-btn" onclick="app.openLesson(${prevDay})">← Day ${prevDay}</button>` : ''}
        ${nextDay ? `<button class="lesson-nav-btn" onclick="app.openLesson(${nextDay})">Day ${nextDay} →</button>` : ''}
      </div>

      <div class="lesson-header">
        <div class="lh-day">Day ${day.day} of 30</div>
        <h1>${day.title}</h1>
        <div class="lh-desc">${day.description}</div>
        <div class="lh-meta">
          <span class="lh-badge">${day.level.charAt(0).toUpperCase() + day.level.slice(1)}</span>
          ${day.topics.map(t => `<span class="lh-badge">${t}</span>`).join('')}
        </div>
      </div>

      <div class="lesson-tabs">
        <button class="lesson-tab active" data-ltab="lt-grammar">📚 Grammar</button>
        <button class="lesson-tab" data-ltab="lt-vocabulary">📝 Vocabulary</button>
        <button class="lesson-tab" data-ltab="lt-speaking">🎤 Speaking</button>
        <button class="lesson-tab" data-ltab="lt-writing">✍️ Writing</button>
        <button class="lesson-tab" data-ltab="lt-quiz">🧠 Quiz</button>
      </div>

      <div class="lesson-tab-content active" id="lt-grammar">
        <div class="content-card">
          <h4>${day.grammar.title}</h4>
          ${day.grammar.content}
        </div>
      </div>

      <div class="lesson-tab-content" id="lt-vocabulary">
        <div class="content-card">
          <h4>📝 Day ${day.day} Vocabulary</h4>
          <div class="vocab-day-list" style="margin-top: 15px;">
            ${vocabHTML}
          </div>
        </div>
      </div>

      <div class="lesson-tab-content" id="lt-speaking">
        <div class="speaking-task">
          <h5>🎤 Speaking Task</h5>
          <p>${day.speaking}</p>
          <button class="btn-primary" style="margin-top: 15px; font-size: 0.9rem;" onclick="app.practiceLessonWithAI(${day.day}, 'speaking')">🤖 Practice Speaking with AI</button>
        </div>
      </div>

      <div class="lesson-tab-content" id="lt-writing">
        <div class="writing-task">
          <h5>✍️ Writing Task</h5>
          <p>${day.writing}</p>
          <button class="btn-primary" style="margin-top: 15px; font-size: 0.9rem;" onclick="app.practiceLessonWithAI(${day.day}, 'writing')">🤖 Practice Writing with AI</button>
        </div>
      </div>

      <div class="lesson-tab-content" id="lt-quiz">
        <div class="content-card">
          <h4>🧠 Day ${day.day} Quiz</h4>
          <p>Test your knowledge from today's lesson.</p>
          <button class="open-quiz-btn" onclick="app.openQuiz(${day.day})">🚀 Start Quiz</button>
        </div>
      </div>

      <button class="complete-btn${isCompleted ? ' done' : ''}" id="completeBtn" onclick="app.markComplete(${day.day})">
        ${isCompleted ? '✓ Completed' : '✅ Mark as Complete'}
      </button>
    `;

    content.querySelectorAll('.lesson-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        content.querySelectorAll('.lesson-tab').forEach(t => t.classList.remove('active'));
        content.querySelectorAll('.lesson-tab-content').forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        const target = content.querySelector(`#${tab.dataset.ltab}`);
        if (target) target.classList.add('active');
      });
    });

    document.querySelectorAll('.day-item').forEach(item => {
      item.classList.toggle('active', parseInt(item.dataset.day) === dayNum);
    });

    this.goToSection('lessonDetail');
  },

  /* ── MARK COMPLETE ── */
  markComplete(dayNum) {
    if (this.completedDays.includes(dayNum)) return;
    this.completedDays.push(dayNum);
    this.saveState();
    this.updateProgress();
    this.buildSidebar();
    this.buildDayCards();
    this.updateCertificateStats();

    const btn = document.getElementById('completeBtn');
    if (btn) {
      btn.textContent = '✓ Completed';
      btn.classList.add('done');
    }

    this.showToast(`🎉 Day ${dayNum} completed! Keep going!`);
  },

  /* ── PROGRESS ── */
  updateProgress() {
    const count = this.completedDays.length;
    const pct = Math.round((count / 30) * 100);

    const bar = document.getElementById('progressBar');
    const text = document.getElementById('progressText');
    const statCompleted = document.getElementById('statCompleted');
    const statProgress = document.getElementById('statProgress');

    if (bar) bar.style.width = pct + '%';
    if (text) text.textContent = `${count} of 30 days completed`;
    if (statCompleted) statCompleted.textContent = count;
    if (statProgress) statProgress.textContent = pct + '%';
  },

  updateCertificateStats() {
    const count = this.completedDays.length;
    const pct = Math.round((count / 30) * 100);
    const certCompleted = document.getElementById('certCompleted');
    const certPercent = document.getElementById('certPercent');
    if (certCompleted) certCompleted.textContent = count;
    if (certPercent) certPercent.textContent = pct + '%';
  },

  /* ── VOCABULARY ── */
  buildVocabulary() {
    this.renderVocabGrid('vocabGrid', VOCAB_DAILY);
  },

  buildBusinessVocab() {
    this.renderVocabGrid('businessVocabGrid', VOCAB_BUSINESS);
  },

  buildAcademicVocab() {
    this.renderVocabGrid('academicVocabGrid', VOCAB_ACADEMIC);
  },

  renderVocabGrid(containerId, data) {
    const grid = document.getElementById(containerId);
    if (!grid) return;
    grid.innerHTML = data.map(v => {
      const safeWord = v.word.replace(/'/g, "\\'");
      return `
        <div class="vocab-card" style="position: relative;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div class="vocab-word">${v.word}</div>
            <button onclick="app.speakWord('${safeWord}')" style="background: none; border: none; cursor: pointer; font-size: 1.2rem; padding: 0;" title="Listen Pronunciation">🔊</button>
          </div>
          <div class="vocab-pos">${v.pos}</div>
          
          ${v.pronunciationBangla ? `<div class="vocab-bn-pron" style="margin: 4px 0; font-size: 0.9rem; color: var(--text-muted);"><strong>উচ্চারণ:</strong> [ ${v.pronunciationBangla} ]</div>` : ''}
          ${v.meaningBangla ? `<div class="vocab-bn-meaning" style="margin: 4px 0; font-size: 0.95rem; font-weight: 500; color: #2563eb;"><strong>অর্থ:</strong> ${v.meaningBangla}</div>` : ''}
          
          <div class="vocab-def" style="margin-top: 8px;">${v.def}</div>
          ${v.syn ? `<div class="vocab-syn">↑ ${v.syn}</div>` : ''}
          ${v.ant ? `<div class="vocab-ant">↓ ${v.ant}</div>` : ''}
          ${v.ex ? `<div class="vocab-ex">"${v.ex}"</div>` : ''}
        </div>
      `;
    }).join('');
  },

  buildIdioms() {
    const list = document.getElementById('idiomList');
    if (!list) return;
    list.innerHTML = VOCAB_IDIOMS.map(i => `
      <div class="idiom-item">
        <div class="idiom-phrase">${i.phrase}</div>
        <div class="idiom-meaning">${i.meaning}</div>
        <div class="idiom-example">"${i.example}"</div>
      </div>
    `).join('');
  },

  buildPhrasalVerbs() {
    const list = document.getElementById('phrasalList');
    if (!list) return;
    list.innerHTML = VOCAB_PHRASAL.map(p => `
      <div class="phrasal-item">
        <div class="phrasal-verb">${p.verb}</div>
        <div class="phrasal-meaning">${p.meaning}</div>
        <div class="phrasal-example">"${p.example}"</div>
      </div>
    `).join('');
  },

  /* ── VOCABULARY SEARCH ── */
  filterVocab(query) {
    const q = query.toLowerCase().trim();
    const filtered = q ? VOCAB_DAILY.filter(v =>
      v.word.toLowerCase().includes(q) ||
      v.def.toLowerCase().includes(q) ||
      (v.meaningBangla && v.meaningBangla.toLowerCase().includes(q)) ||
      (v.syn && v.syn.toLowerCase().includes(q))
    ) : VOCAB_DAILY;
    this.renderVocabGrid('vocabGrid', filtered);
  },

  /* ── SEARCH ── */
  handleSearch(query) {
    const resultsEl = document.getElementById('searchResults');
    if (!resultsEl) return;

    if (!query.trim()) {
      resultsEl.classList.remove('open');
      resultsEl.innerHTML = '';
      return;
    }

    const q = query.toLowerCase();
    const results = COURSE_DAYS.filter(d =>
      d.title.toLowerCase().includes(q) ||
      d.topics.some(t => t.toLowerCase().includes(q)) ||
      d.level.toLowerCase().includes(q)
    ).slice(0, 8);

    if (results.length === 0) {
      resultsEl.innerHTML = '<div class="search-result-item">No results found.</div>';
    } else {
      resultsEl.innerHTML = results.map(d => `
        <div class="search-result-item" data-day="${d.day}">
          <span class="sr-day">Day ${d.day}</span>
          <span class="sr-title"> – ${d.title}</span>
        </div>
      `).join('');
      resultsEl.querySelectorAll('.search-result-item[data-day]').forEach(item => {
        item.addEventListener('click', () => {
          this.openLesson(parseInt(item.dataset.day));
          resultsEl.classList.remove('open');
          document.getElementById('searchInput').value = '';
        });
      });
    }
    resultsEl.classList.add('open');
  },

  /* ── QUIZ ── */
  openQuiz(dayNum) {
    const day = COURSE_DAYS.find(d => d.day === dayNum);
    if (!day) return;
    this.currentQuizDay = dayNum;

    const modal = document.getElementById('quizModal');
    const title = document.getElementById('quizTitle');
    const body = document.getElementById('quizBody');

    if (!modal || !title || !body) return;

    title.textContent = `Day ${dayNum} Quiz – ${day.title}`;
    body.innerHTML = day.quiz.map((q, i) => this.buildQuizQuestion(q, i)).join('');

    modal.classList.add('open');
  },

  buildQuizQuestion(q, index) {
    if (q.type === 'mcq') {
      return `
        <div class="quiz-question" data-index="${index}" data-answer="${q.answer}" data-type="mcq">
          <div class="q-text"><span class="q-num">${index + 1}</span>${q.question}</div>
          <div class="q-options">
            ${q.options.map((opt, i) => `
              <label class="q-option">
                <input type="radio" name="q${index}" value="${i}" />
                ${opt}
              </label>
            `).join('')}
          </div>
          <div class="q-feedback"></div>
        </div>
      `;
    } else if (q.type === 'fill') {
      return `
        <div class="quiz-question" data-index="${index}" data-answer="${q.answer.toLowerCase()}" data-type="fill">
          <div class="q-text"><span class="q-num">${index + 1}</span>${q.question}</div>
          <div class="fill-blank">
            <input type="text" placeholder="Type your answer…" />
          </div>
          <div class="q-feedback"></div>
        </div>
      `;
    }
    return '';
  },

  submitQuiz() {
    const body = document.getElementById('quizBody');
    if (!body) return;

    let correct = 0;
    let total = 0;

    body.querySelectorAll('.quiz-question').forEach(qEl => {
      const type = qEl.dataset.type;
      const correctAnswer = qEl.dataset.answer;
      const feedback = qEl.querySelector('.q-feedback');
      total++;

      if (type === 'mcq') {
        const selected = qEl.querySelector('input[type="radio"]:checked');
        const options = qEl.querySelectorAll('.q-option');

        options.forEach((opt, i) => {
          if (i === parseInt(correctAnswer)) {
            opt.classList.add('correct');
          }
        });

        if (selected) {
          const selectedVal = parseInt(selected.value);
          if (selectedVal === parseInt(correctAnswer)) {
            correct++;
            if (feedback) { feedback.textContent = '✓ Correct!'; feedback.className = 'q-feedback show correct'; }
          } else {
            selected.closest('.q-option').classList.add('wrong');
            if (feedback) { feedback.textContent = `✗ Incorrect. The correct answer is: ${qEl.querySelectorAll('.q-option')[parseInt(correctAnswer)].textContent.trim()}`; feedback.className = 'q-feedback show wrong'; }
          }
        } else {
          if (feedback) { feedback.textContent = '✗ No answer selected.'; feedback.className = 'q-feedback show wrong'; }
        }

        qEl.querySelectorAll('input[type="radio"]').forEach(r => r.disabled = true);

      } else if (type === 'fill') {
        const input = qEl.querySelector('input[type="text"]');
        if (input) {
          const userAnswer = input.value.toLowerCase().trim();
          if (userAnswer === correctAnswer) {
            correct++;
            input.classList.add('correct');
            if (feedback) { feedback.textContent = '✓ Correct!'; feedback.className = 'q-feedback show correct'; }
          } else {
            input.classList.add('wrong');
            if (feedback) { feedback.textContent = `✗ Incorrect. The correct answer is: "${correctAnswer}"`; feedback.className = 'q-feedback show wrong'; }
          }
          input.disabled = true;
        }
      }
    });

    const pct = Math.round((correct / total) * 100);
    const scoreEl = document.createElement('div');
    scoreEl.className = 'quiz-score';
    scoreEl.innerHTML = `
      <div class="score-num">${correct}/${total}</div>
      <div class="score-label">${pct}% – ${pct >= 80 ? '🎉 Excellent!' : pct >= 60 ? '👍 Good job!' : '📚 Keep practicing!'}</div>
    `;
    body.appendChild(scoreEl);

    const submitBtn = document.getElementById('submitQuiz');
    if (submitBtn) submitBtn.style.display = 'none';

    if (pct >= 60 && this.currentQuizDay && !this.completedDays.includes(this.currentQuizDay)) {
      this.markComplete(this.currentQuizDay);
    }
  },

  closeQuiz() {
    const modal = document.getElementById('quizModal');
    if (modal) modal.classList.remove('open');
    const submitBtn = document.getElementById('submitQuiz');
    if (submitBtn) submitBtn.style.display = '';
    this.currentQuizDay = null;
  },

  /* ── CERTIFICATE ── */
  generateCertificate() {
    const nameInput = document.getElementById('certName');
    const display = document.getElementById('certificateDisplay');
    const nameDisplay = document.getElementById('certNameDisplay');
    const dateEl = document.getElementById('certDate');

    if (!nameInput || !display || !nameDisplay || !dateEl) return;

    // FIX: Restrict certificate generation to 100% completion (30 days)
    if (this.completedDays.length < 30) {
      this.showToast('⚠️ Certificate Locked: You must complete all 30 days to generate your certificate.', 'warning');
      display.style.display = 'none'; // Keep it hidden
      return; 
    }

    const name = nameInput.value.trim();
    if (!name) {
      this.showToast('⚠️ Please enter your full name.', 'warning');
      nameInput.focus();
      return;
    }

    nameDisplay.textContent = name;
    const now = new Date();
    dateEl.textContent = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    display.style.display = 'block';
    display.scrollIntoView({ behavior: 'smooth' });
  },

  /* ── MODULE TABS ── */
  initModuleTabs() {
    document.querySelectorAll('.module-tabs').forEach(tabGroup => {
      tabGroup.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const section = tabGroup.closest('.section');
          if (!section) return;

          tabGroup.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
          section.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

          btn.classList.add('active');
          const target = section.querySelector(`#${btn.dataset.tab}`);
          if (target) target.classList.add('active');
        });
      });
    });
  },

  /* ── TOAST NOTIFICATION ── */
  showToast(message, type = 'success') {
    const existing = document.querySelector('.toast-notification');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      background: ${type === 'warning' ? 'var(--warning)' : 'var(--success)'};
      color: #fff;
      padding: .85rem 1.5rem;
      border-radius: 12px;
      font-weight: 600;
      font-size: .9rem;
      z-index: 9999;
      box-shadow: 0 10px 40px rgba(0,0,0,.2);
      animation: slideInRight .3s ease;
      max-width: 320px;
    `;

    if (!document.getElementById('toast-style')) {
      const style = document.createElement('style');
      style.id = 'toast-style';
      style.textContent = `
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(100px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity .3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  },

  /* ── EVENT BINDING ── */
  bindEvents() {
    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) themeBtn.addEventListener('click', () => this.toggleTheme());

    const hamburger = document.getElementById('hamburger');
    if (hamburger) hamburger.addEventListener('click', () => {
      const navLinks = document.getElementById('navLinks');
      if (navLinks) navLinks.classList.toggle('open');
      this.openSidebar();
    });

    const overlay = document.querySelector('.sidebar-overlay');
    if (!overlay) {
      const newOverlay = document.createElement('div');
      newOverlay.className = 'sidebar-overlay';
      document.body.appendChild(newOverlay);
      newOverlay.addEventListener('click', () => this.closeSidebar());
    } else {
      overlay.addEventListener('click', () => this.closeSidebar());
    }

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const section = link.dataset.section;
        if (section) this.goToSection(section);
      });
    });

    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
      searchInput.addEventListener('blur', () => {
        setTimeout(() => {
          const results = document.getElementById('searchResults');
          if (results) results.classList.remove('open');
        }, 200);
      });
    }

    const vocabSearch = document.getElementById('vocabSearch');
    if (vocabSearch) {
      vocabSearch.addEventListener('input', (e) => this.filterVocab(e.target.value));
    }

    const quizClose = document.getElementById('quizClose');
    if (quizClose) quizClose.addEventListener('click', () => this.closeQuiz());

    const closeQuizBtn = document.getElementById('closeQuizBtn');
    if (closeQuizBtn) closeQuizBtn.addEventListener('click', () => this.closeQuiz());

    const submitQuiz = document.getElementById('submitQuiz');
    if (submitQuiz) submitQuiz.addEventListener('click', () => this.submitQuiz());

    const quizModal = document.getElementById('quizModal');
    if (quizModal) {
      quizModal.addEventListener('click', (e) => {
        if (e.target === quizModal) this.closeQuiz();
      });
    }

    const certBtn = document.getElementById('generateCertBtn');
    if (certBtn) certBtn.addEventListener('click', () => this.generateCertificate());

    const certName = document.getElementById('certName');
    if (certName) certName.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.generateCertificate();
    });

    this.initModuleTabs();

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeQuiz();
        const navLinks = document.getElementById('navLinks');
        if (navLinks) navLinks.classList.remove('open');
        this.closeSidebar();
      }
    });

    if (window.location.hash) {
      const section = window.location.hash.replace('#', '');
      const validSections = ['dashboard', 'lessons', 'speaking', 'writing', 'vocabulary', 'pronunciation', 'ai-tutor', 'exams', 'certificate'];
      if (validSections.includes(section)) {
        this.goToSection(section);
      }
    }
  }
};

/* ============================================================
   AI SMART TUTOR MODULE
   ============================================================ */
const AITutor = {
  msgCount: 0, wordsLearned: 0, corrections: 0,
  currentTopic: 'greeting', listening: false, recognition: null,

  topics: {
    greeting: { bn: 'হাসিমুখে আত্মপরিচয় করতে শিখুন!', prompt: 'greeting and introduction', starter: 'Hello! I am your AI Tutor. Let us practice greetings! Say: "Hello, my name is [your name]. Nice to meet you!" আপনি English-এ নিজের নাম বলুন!' },
    daily: { bn: 'দৈনন্দিন জীবনের English!', prompt: 'daily life situations', starter: 'Let’s talk about daily life! বাংলায় বলুন আজকে আপনি কি কি করেছেন? Tell me: "Today I woke up at..."' },
    shopping: { bn: 'বাজারে English!', prompt: 'shopping conversations', starter: '🛒 Shopping English! Say: "How much does this cost?" or "Do you have this in a different size?"' },
    travel: { bn: 'ভ্রমণে English!', prompt: 'travel and directions', starter: '✈️ Travel English! Practice: "Excuse me, how do I get to the airport?" বলুন!' },
    work: { bn: 'অফিসে English!', prompt: 'workplace communication', starter: '💼 Workplace English! Say: "Good morning everyone. I have a meeting at 10 AM."' },
    grammar: { bn: 'ব্যাকরণ শিখুন!', prompt: 'grammar rules', starter: '📖 Grammar Help! আমাকে যেকোনো ব্যাকরণের প্রশ্ন করুন! E.g. "What is Present Perfect Tense?"' },
    pronunciation: { bn: 'উচ্চারণ মনে রাখুন!', prompt: 'pronunciation practice', starter: '🔊 Pronunciation! বলুন এবং শুনুন! Practice word: "BEAUTIFUL" বাংলা: সুন্দর [বিউটিফুল]' },
    freemode: { bn: 'যা খুশি বলুন!', prompt: 'free conversation', starter: '💬 Free Chat! যেকোনো বিষয়ে English-এ কথা বলুন অথবা বাংলায় প্রশ্ন করুন — আমি সাহায্য করব!' }
  },

  // Smart rule-based response engine
  responses: {
    greetings: { patterns: [/\b(hi|hello|hey|good morning|good evening|good afternoon|assalamu|salam)\b/i], reply_en: 'Hello! Nice to meet you! 😊 How are you doing today?', reply_bn: 'হ্যালো বলতে পারেন: "Hi there! I am doing well, thank you."' },
    thanks: { patterns: [/\b(thank|thanks|thank you|dhonnobad)\b/i], reply_en: 'You\'re welcome! Keep up the great work! 🌟', reply_bn: 'Thank you বলে উত্তর দিন: "You\'re welcome!" অথবা "My pleasure!"' },
    how_are_you: { patterns: [/\b(how are you|ami kemon|kemon acho|how do you do)\b/i], reply_en: 'I am doing great, thank you for asking! And how are you?', reply_bn: 'দারুণ! উত্তর দিন: "I am fine, thank you!" অথবা "I am doing well!"' },
    name: { patterns: [/\b(my name is|i am|i\'m|ami|amar naam)\b/i], reply_en: 'Wonderful! It\'s great to meet you! 🙌 Try saying: "I am from Bangladesh. I am learning English."', reply_bn: 'আপনার নাম সুন্দর! অনুশীলন করুন: "My name is [name] and I am from Bangladesh."' },
    tense_present: { patterns: [/\b(present tense|simple present|present indefinite)\b/i], reply_en: 'Present Simple Tense: Subject + Verb (base form). E.g: "I eat rice." "She eats rice." (add -s/-es for He/She/It)', reply_bn: 'সাধারণ বর্তমান কাল: সাধারণ কাজ বোঝাতে ব্যবহার হয়। I/We/You/They + verb, He/She/It + verb+s' },
    tense_past: { patterns: [/\b(past tense|simple past|past indefinite)\b/i], reply_en: 'Past Simple Tense: Subject + Verb (past form). Regular: add -ed. E.g: "I walked." "She played." Irregular: go→went, eat→ate, see→saw', reply_bn: 'সাধারণ অতীত কাল: সমাপ্ত কাজের জন্য ব্যবহার হয়। Regular verb-এ -ed যোগ হয়।' },
    tense_future: { patterns: [/\b(future tense|will|going to|shall)\b/i], reply_en: 'Future Tense: Use "will + verb" or "am/is/are going to + verb". E.g: "I will go." "She is going to eat."', reply_bn: 'ভবিষ্যৎ কাল: will/shall + verb অথবা going to + verb ব্যবহার করুন।' },
    tense_perfect: { patterns: [/\b(present perfect|have|has|had)\b/i], reply_en: 'Present Perfect: Subject + have/has + past participle. E.g: "I have eaten." "She has gone to school." Use for past actions with present connection.', reply_bn: 'সাধারণ পূর্ণ: have/has + past participle ব্যবহার হয় — অতীতে হয়েছে তবে এখনো প্রাসঙ্গিক।' },
    vocab_q: { patterns: [/\b(what does|meaning of|what is|ki mane|mane ki|mane holo|bangla)\b/i], reply_en: 'Great vocabulary question! Use the Vocabulary section to search 500+ words with Bangla meanings. 📝', reply_bn: 'শব্দ এর অর্থ জানতে Vocabulary সেকশনে যান! 500+ বাংলা অর্থসহ শব্দ আছে।' },
    pronunciation_q: { patterns: [/\b(pronounce|pronunciation|how to say|uccharon|bolo|kemon bole)\b/i], reply_en: 'Pronunciation tip: Listen carefully, then repeat slowly. Use the Pronunciation section for IPA guides. 🔊 Try saying the word 3 times.', reply_bn: 'উচ্চারণ শিখতে: প্রথমে শুনুন, তারপর আস্তে বলুন। Pronunciation সেকশনে IPA Guide দেখুন।' },
    exam_q: { patterns: [/\b(exam|test|quiz|poriksha|porikkha)\b/i], reply_en: 'Ready to test yourself? Go to the 📝 Exams section! Choose Beginner, Intermediate, or Advanced. 🏆', reply_bn: 'পরীক্ষা দিতে প্রস্তুত? Exams সেকশনে যান!' },
    help: { patterns: [/\b(help|sahajjo|ki korbo|how to learn|english shikhbo)\b/i], reply_en: 'Learning tips: ✅ Practice daily for 15 mins. ✅ Read English every day. ✅ Speak without fear. ✅ Use the 30-day lessons. ✅ Take exams weekly.', reply_bn: 'ইংরেজি শেখার টিপস: ১) প্রতিদিন ১৫ মিনিট অনুশীলন ২) জোরে বলুন ৩) পাঠ পড়ুন ৪) Lesson ব্যবহার করুন' },
    shopping: { patterns: [/\b(shop|buy|cost|price|how much|koto taka|dam)\b/i], reply_en: 'Shopping phrases: "How much does this cost?" / "Can I get a discount?" / "Do you accept credit cards?" / "I\'ll take it!"', reply_bn: 'কেনাকাটার ইংরেজি: How much? = দাম কত? Discount = ছাড়, Credit card = ক্রেডিট কার্ড' },
    travel: { patterns: [/\b(travel|airport|hotel|direction|where is|kothay|kemon jabo)\b/i], reply_en: 'Travel phrases: "Where is the nearest hotel?" / "How do I get to the airport?" / "Can you call me a taxi?" / "I need a map."', reply_bn: 'ভ্রমণের ইংরেজি: airport = বিমানবন্দর, hotel = হোটেল, taxi = ট্যাক্সি, map = নকশা' },
    job: { patterns: [/\b(job|interview|work|career|office|salary|chakri|chomri)\b/i], reply_en: 'Job interview tips: 1) Greet confidently. 2) Speak clearly. 3) Use the STAR method for answers. Practice: "Tell me about yourself."', reply_bn: 'চাকরির ইন্টারভিউ: আত্মবিশ্বাসী হন, স্পষ্ট কথা বলুন, STAR পদ্ধতি অনুসরণ করুন।' },
  },

  defaultReplies: [
    { en: 'Interesting! Tell me more about that in English. 😊', bn: 'দারুণ! English-এ আরো কিছু বলুন।' },
    { en: 'Good effort! Try to make a full sentence. E.g: "I think that..."', bn: 'চেষ্টা ভালো! একটা পূর্ণ বাক্য লিখুন।' },
    { en: 'Keep practicing! Every mistake is a step forward. 💪', bn: 'অনুশীলন চালিয়ে যান! প্রতিটি ভুল একটি শিক্ষা।' },
    { en: 'You are doing great! Can you write that in a longer sentence?', bn: 'আপনি ভালো করছেন! একটু বড় বাক্য লিখুন।' },
    { en: 'Excellent! Now try to say that sentence out loud using the microphone! 🎤', bn: 'অসাধারণ! Mic দিয়ে কথাটা বলুন।' },
  ],

  commonErrors: [
    { pattern: /\bi goes\b/i, correction: '"I go" (not "I goes")' },
    { pattern: /\bshe go\b/i, correction: '"She goes" (add -s for He/She/It)' },
    { pattern: /\bhe have\b/i, correction: '"He has" (not "He have")' },
    { pattern: /\bthey is\b/i, correction: '"They are" (not "They is")' },
    { pattern: /\bi are\b/i, correction: '"I am" (not "I are")' },
    { pattern: /\bwe was\b/i, correction: '"We were" (not "We was")' },
    { pattern: /\byesterday i will\b/i, correction: 'For past events use "I went/I ate" (Past Simple), not "will"' },
    { pattern: /\bmore better\b/i, correction: 'Just "better" (not "more better")' },
    { pattern: /\bvery much very\b/i, correction: 'Use "very much" or "very" alone, not both' },
  ],

  init() {
    this.setupTopicBtns();
    this.setupSendBtn();
    this.setupMicBtn();
    this.setupClearBtn();
  },

  setupTopicBtns() {
    document.querySelectorAll('.topic-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.topic-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const topic = btn.dataset.topic;
        this.currentTopic = topic;
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

  setupMicBtn() {
    const micBtn = document.getElementById('micBtn');
    if (!micBtn) return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      micBtn.title = 'Voice not supported in this browser';
      micBtn.style.opacity = '0.4';
      return;
    }
    this.recognition = new SpeechRecognition();
    this.recognition.lang = 'en-US';
    this.recognition.interimResults = true; // Show text as user speaks!
    this.recognition.continuous = false;
    
    this.recognition.onresult = (e) => {
      let interim = '';
      let final = '';
      for (let i = e.resultIndex; i < e.results.length; ++i) {
        if (e.results[i].isFinal) {
          final += e.results[i][0].transcript;
        } else {
          interim += e.results[i][0].transcript;
        }
      }
      
      const input = document.getElementById('chatInput');
      if (final) {
        input.value = final;
        this.hideVoiceStatus();
        this.handleUserInput();
      } else if (interim) {
        input.value = interim;
      }
    };
    
    this.recognition.onerror = (e) => { 
      const vs = document.getElementById('voiceStatus');
      if (vs) {
        vs.textContent = `❌ Mic Error: ${e.error} (Please check browser permissions)`;
        setTimeout(() => this.stopListening(), 3000);
      } else {
        this.stopListening(); 
      }
    };
    this.recognition.onend = () => { this.stopListening(); };
    micBtn.addEventListener('click', () => {
      if (this.listening) { this.stopListening(); }
      else { this.startListening(); }
    });
  },

  startListening() {
    if (!this.recognition) return;
    this.listening = true;
    document.getElementById('micBtn').classList.add('listening');
    const vs = document.getElementById('voiceStatus');
    if (vs) {
      vs.textContent = '🎤 Listening... speak now';
      vs.classList.remove('hidden');
    }
    document.getElementById('chatInput').value = ''; // clear input for fresh speech
    
    // Safety timeout in case their OS microphone is muted and no sound is detected
    this.silenceTimeout = setTimeout(() => {
      if (this.listening) {
        if (vs) {
          vs.textContent = '❌ No sound detected! Is your PC microphone muted?';
        }
        setTimeout(() => this.stopListening(), 4000);
      }
    }, 8000);

    this.recognition.onspeechstart = () => {
      clearTimeout(this.silenceTimeout);
    };

    try {
      this.recognition.start();
    } catch (e) {
      this.stopListening();
    }
  },

  stopListening() {
    this.listening = false;
    clearTimeout(this.silenceTimeout);
    const micBtn = document.getElementById('micBtn');
    if (micBtn) micBtn.classList.remove('listening');
    this.hideVoiceStatus();
    if (this.recognition) { try { this.recognition.stop(); } catch(e) {} }
  },

  hideVoiceStatus() {
    const vs = document.getElementById('voiceStatus');
    if (vs) vs.classList.add('hidden');
  },

  setupClearBtn() {
    const clearBtn = document.getElementById('clearChatBtn');
    if (!clearBtn) return;
    clearBtn.addEventListener('click', () => {
      const win = document.getElementById('chatWindow');
      if (win) win.innerHTML = '<div class="chat-msg ai"><div class="chat-avatar">🤖</div><div class="chat-bubble"><p>চ্যাট মুছে ফেলা হয়েছে! 🔄 নতুনভাবে শুরু করুন।</p></div></div>';
      this.msgCount = 0; this.wordsLearned = 0; this.corrections = 0;
      this.updateStats();
    });
  },

  handleUserInput() {
    const chatInput = document.getElementById('chatInput');
    const text = chatInput.value.trim();
    if (!text) return;
    chatInput.value = '';
    this.addMessage('user', text);
    // Check grammar errors
    const correction = this.checkGrammar(text);
    // Show typing indicator
    const typingId = this.showTyping();
    setTimeout(() => {
      this.removeTyping(typingId);
      const reply = this.generateReply(text);
      this.addMessage('ai', reply.en, reply.bn, correction);
      if (document.getElementById('autoSpeak').checked) {
        this.speak(reply.en);
      }
    }, 800 + Math.random() * 600);
  },

  checkGrammar(text) {
    for (const err of this.commonErrors) {
      if (err.pattern.test(text)) {
        this.corrections++;
        this.updateStats();
        return err.correction;
      }
    }
    return null;
  },

  generateReply(text) {
    const lower = text.toLowerCase();
    for (const [key, data] of Object.entries(this.responses)) {
      for (const pat of data.patterns) {
        if (pat.test(lower)) {
          this.wordsLearned += 3;
          this.updateStats();
          return { en: data.reply_en, bn: data.reply_bn };
        }
      }
    }
    const r = this.defaultReplies[Math.floor(Math.random() * this.defaultReplies.length)];
    return { en: r.en, bn: r.bn };
  },

  addMessage(sender, text, bangla, correction) {
    const win = document.getElementById('chatWindow');
    if (!win) return;
    const div = document.createElement('div');
    div.className = `chat-msg ${sender}`;
    const avatar = sender === 'ai' ? '🤖' : '👤';
    const showBangla = document.getElementById('showBangla');
    let html = `<div class="chat-avatar">${avatar}</div><div class="chat-bubble"><p>${text}</p>`;
    if (bangla && showBangla && showBangla.checked) {
      html += `<p class="chat-en">🇧🇩 ${bangla}</p>`;
    }
    if (correction) {
      html += `<div class="chat-correction">✏️ <strong>Grammar Tip:</strong> ${correction}</div>`;
    }
    html += '</div>';
    div.innerHTML = html;
    win.appendChild(div);
    win.scrollTop = win.scrollHeight;
    this.msgCount++;
    this.updateStats();
  },

  showTyping() {
    const win = document.getElementById('chatWindow');
    if (!win) return null;
    const id = 'typing-' + Date.now();
    win.innerHTML += `<div class="chat-msg ai" id="${id}"><div class="chat-avatar">🤖</div><div class="chat-bubble"><div class="chat-typing"><span></span><span></span><span></span></div></div></div>`;
    win.scrollTop = win.scrollHeight;
    return id;
  },

  removeTyping(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
  },

  speak(text) {
    if (!window.speechSynthesis) return;
    const clean = text.replace(/[\u0980-\u09FF]/g, '').replace(/[\ud83c-\udfff\u2600-\u27ff]/gu, '').trim();
    if (!clean) return;
    const utt = new SpeechSynthesisUtterance(clean);
    utt.lang = 'en-US'; utt.rate = 0.9; utt.pitch = 1;
    const voices = speechSynthesis.getVoices();
    const enVoice = voices.find(v => v.lang.startsWith('en') && v.name.includes('Google'));
    if (enVoice) utt.voice = enVoice;
    speechSynthesis.speak(utt);
  },

  updateStats() {
    const mc = document.getElementById('tutorMsgCount');
    const wl = document.getElementById('tutorWordsLearned');
    const tc = document.getElementById('tutorCorrections');
    if (mc) mc.textContent = this.msgCount;
    if (wl) wl.textContent = this.wordsLearned;
    if (tc) tc.textContent = this.corrections;
  }
};

/* ============================================================
   EXAM MODULE
   ============================================================ */
const ExamModule = {
  currentLevel: 'beginner', currentQ: 0, answers: [], timerInterval: null,
  timeLeft: 600, sessionId: null,

  questions: {
    beginner: [
      { type: 'mcq', q: 'What is the plural of "child"?', bn: '"child" শব্দের plural কি?', options: ['childs', 'children', 'childes', 'childrens'], answer: 1 },
      { type: 'mcq', q: 'Which is correct: "She ___ to school every day."', bn: 'সঠিক শব্দ বেছে নিন:', options: ['go', 'goes', 'going', 'gone'], answer: 1 },
      { type: 'mcq', q: 'What is the opposite of "big"?', bn: '"big" এর বিপরীত শব্দ?', options: ['large', 'huge', 'small', 'tall'], answer: 2 },
      { type: 'mcq', q: 'I ___ a student.', bn: 'সঠিক verb বেছে নিন:', options: ['is', 'are', 'am', 'be'], answer: 2 },
      { type: 'mcq', q: 'Which sentence is correct?', bn: 'কোন বাক্যটি সঠিক?', options: ['He have a car.', 'He has a car.', 'He having a car.', 'He is have a car.'], answer: 1 },
      { type: 'mcq', q: 'The English alphabet has ___ letters.', bn: 'ইংরেজি বর্ণমালায় কতটি অক্ষর?', options: ['24', '25', '26', '27'], answer: 2 },
      { type: 'fill', q: 'Complete: "Good ___, how are you?"', bn: 'বাক্যটি পূরণ করুন।', answer: 'morning' },
      { type: 'mcq', q: 'What does "beautiful" mean in Bangla?', bn: 'beautiful মানে কি?', options: ['ভয়ঙ্কর', 'সুন্দর', 'দুঃখী', 'রাগান্বিত'], answer: 1 },
      { type: 'mcq', q: 'Which is a vowel?', bn: 'নিচের কোনটি vowel?', options: ['B', 'C', 'E', 'D'], answer: 2 },
      { type: 'mcq', q: 'We ___ friends.', bn: 'সঠিক verb:', options: ['is', 'am', 'are', 'be'], answer: 2 },
      { type: 'mcq', q: 'What is 3 + 4 in English?', bn: 'ইংরেজিতে 3+4 কত?', options: ['Six', 'Eight', 'Seven', 'Five'], answer: 2 },
      { type: 'mcq', q: 'I ___ reading a book now.', bn: 'বর্তমানে চলমান কাজ:', options: ['is', 'am', 'are', 'be'], answer: 1 },
      { type: 'fill', q: 'Opposite of "hot" is ___.', bn: 'hot এর বিপরীত:', answer: 'cold' },
      { type: 'mcq', q: 'Which animal says "meow"?', bn: 'কোন প্রাণী meow বলে?', options: ['Dog', 'Cat', 'Cow', 'Bird'], answer: 1 },
      { type: 'mcq', q: 'My name ___ Sabbir.', bn: 'সঠিক verb:', options: ['am', 'are', 'is', 'be'], answer: 2 },
      { type: 'mcq', q: 'What color is the sky?', bn: 'আকাশের রং কি?', options: ['Red', 'Green', 'Blue', 'Yellow'], answer: 2 },
      { type: 'fill', q: 'A week has ___ days.', bn: 'এক সপ্তাহে কত দিন?', answer: 'seven' },
      { type: 'mcq', q: 'She ___ not like tea.', bn: 'সঠিক auxiliary verb:', options: ['do', 'did', 'does', 'doing'], answer: 2 },
      { type: 'mcq', q: 'Which word means "happy" in Bangla?', bn: 'happy মানে?', options: ['দুঃখী', 'রাগী', 'খুশি', 'ভয়ার্ত'], answer: 2 },
      { type: 'mcq', q: 'The sun rises in the ___.', bn: 'সূর্য কোথায় ওঠে?', options: ['West', 'South', 'North', 'East'], answer: 3 },
    ],
    intermediate: [
      { type: 'mcq', q: 'She has been working here ___ 2020.', bn: 'সঠিক preposition:', options: ['for', 'since', 'from', 'in'], answer: 1 },
      { type: 'mcq', q: 'If I ___ rich, I would travel the world.', bn: 'Conditional sentence:', options: ['am', 'was', 'were', 'will be'], answer: 2 },
      { type: 'mcq', q: 'The report ___ submitted yesterday.', bn: 'Passive voice:', options: ['was', 'is', 'were', 'has'], answer: 0 },
      { type: 'fill', q: 'She suggested that I ___ (go) to the doctor.', bn: 'Subjunctive mood:', answer: 'go' },
      { type: 'mcq', q: '"Break a leg" means:', bn: 'এই idiom এর মানে:', options: ['Get injured', 'Good luck', 'Run fast', 'Stop talking'], answer: 1 },
      { type: 'mcq', q: 'Choose the correct spelling:', bn: 'সঠিক বানান:', options: ['Accomodate', 'Accommodate', 'Acommodate', 'Acomodate'], answer: 1 },
      { type: 'mcq', q: 'I wish I ___ fly like a bird.', bn: 'wish clause:', options: ['can', 'could', 'will', 'shall'], answer: 1 },
      { type: 'fill', q: 'Despite ___ tired, he finished the work.', bn: 'সঠিক word:', answer: 'being' },
      { type: 'mcq', q: 'He asked me where I ___', bn: 'Reported speech:', options: ['live', 'lived', 'lives', 'will live'], answer: 1 },
      { type: 'mcq', q: 'Neither the students nor the teacher ___ ready.', bn: 'Subject-verb agreement:', options: ['were', 'are', 'is', 'was'], answer: 2 },
      { type: 'mcq', q: 'She is used to ___ early.', bn: 'be used to + ___:', options: ['wake', 'waking', 'waked', 'woken'], answer: 1 },
      { type: 'mcq', q: 'The meeting had already started when I ___', bn: 'Past perfect:', options: ['arrive', 'arrived', 'had arrived', 'arrives'], answer: 1 },
      { type: 'fill', q: 'We should protect the ___ (environment).', bn: 'সঠিক শব্দ:', answer: 'environment' },
      { type: 'mcq', q: '"Hit the nail on the head" means:', bn: 'idiom এর মানে:', options: ['Hurt someone', 'Be exactly right', 'Make a mistake', 'Work hard'], answer: 1 },
      { type: 'mcq', q: 'This is the book ___ I was looking for.', bn: 'Relative pronoun:', options: ['who', 'whom', 'that', 'whose'], answer: 2 },
      { type: 'mcq', q: 'By next year, she ___ finished her degree.', bn: 'Future Perfect:', options: ['will finish', 'will have finished', 'has finished', 'finished'], answer: 1 },
      { type: 'fill', q: 'He speaks English very ___ (fluency).', bn: 'সঠিক form:', answer: 'fluently' },
      { type: 'mcq', q: 'The word "benevolent" means:', bn: 'benevolent মানে:', options: ['Evil', 'Kind/Generous', 'Angry', 'Sad'], answer: 1 },
      { type: 'mcq', q: 'Choose: "The data ___ incorrect."', bn: 'data plural/singular:', options: ['is', 'are', 'was', 'were'], answer: 1 },
      { type: 'mcq', q: 'Hardly ___ she arrived when it started raining.', bn: 'Inversion:', options: ['had', 'has', 'have', 'did'], answer: 0 },
      { type: 'mcq', q: 'She looked at me ___ surprise.', bn: 'সঠিক preposition:', options: ['in', 'with', 'by', 'at'], answer: 0 },
      { type: 'fill', q: '___ you please pass the salt?', bn: 'Polite request:', answer: 'Could' },
      { type: 'mcq', q: 'Antonym of "Verbose":', bn: 'verbose এর বিপরীত:', options: ['Talkative', 'Brief/Concise', 'Loud', 'Angry'], answer: 1 },
      { type: 'mcq', q: 'We must protect ___ environment.', bn: 'সঠিক article:', options: ['a', 'an', 'the', 'no article'], answer: 2 },
      { type: 'mcq', q: '"Call off" means:', bn: 'phrasal verb:', options: ['Cancel', 'Shout', 'Start', 'Finish'], answer: 0 },
    ],
    advanced: [
      { type: 'mcq', q: 'The sentence "It is I who am responsible" demonstrates:', bn: 'বাক্যটিতে কোন নিয়ম?', options: ['Proximity rule', 'Notional concord', 'Grammatical concord', 'Attraction error'], answer: 2 },
      { type: 'mcq', q: 'Which word is a portmanteau?', bn: 'portmanteau শব্দ কোনটি?', options: ['Dictionary', 'Breakfast', 'Brunch', 'Language'], answer: 2 },
      { type: 'fill', q: 'The phenomenon of words changing meaning over time is called semantic ___.', bn: '', answer: 'change' },
      { type: 'mcq', q: '"Sesquipedalian" refers to someone who:', bn: 'Sesquipedalian মানে যে:', options: ['Uses short words', 'Uses long words', 'Cannot speak', 'Speaks fast'], answer: 1 },
      { type: 'mcq', q: 'An oxymoron is a figure of speech that:', bn: 'oxymoron কাকে বলে?', options: ['Exaggerates', 'Combines contradictory terms', 'Compares using like/as', 'Repeats consonants'], answer: 1 },
      { type: 'mcq', q: 'Identify the gerund: "Swimming is good exercise."', bn: 'Gerund চিহ্নিত করুন:', options: ['is', 'good', 'Swimming', 'exercise'], answer: 2 },
      { type: 'fill', q: 'A "Pyrrhic victory" means a victory that costs too much — it is a ___ phrase.', bn: '', answer: 'idiomatic' },
      { type: 'mcq', q: 'Which is correct for formal writing?', bn: 'Formal writing এ কোনটি সঠিক?', options: ['It\'s important that he finishes soon.', 'It is important that he finish soon.', 'It is important that he finished soon.', 'It is important that he will finish.'], answer: 1 },
      { type: 'mcq', q: '"Eponymous" means:', bn: 'eponymous মানে:', options: ['Nameless', 'Named after a person', 'Famous', 'Fictional'], answer: 1 },
      { type: 'mcq', q: 'The rhetorical device in "O Romeo, Romeo! Wherefore art thou Romeo?" is:', bn: 'কোন rhetorical device?', options: ['Simile', 'Apostrophe', 'Hyperbole', 'Synecdoche'], answer: 1 },
      { type: 'mcq', q: 'Which sentence uses the Oxford comma correctly?', bn: 'Oxford comma কোথায়?', options: ['I need eggs milk and bread.', 'I need eggs, milk and bread.', 'I need eggs, milk, and bread.', 'I need eggs milk, and bread.'], answer: 2 },
      { type: 'fill', q: 'The study of the meaning of words and sentences is called ___.', bn: '', answer: 'semantics' },
      { type: 'mcq', q: 'A "synecdoche" uses:', bn: 'synecdoche কি ব্যবহার করে?', options: ['A part to represent the whole', 'Opposite words', 'Sound to convey meaning', 'Repetition for emphasis'], answer: 0 },
      { type: 'mcq', q: 'Which of these is in the subjunctive mood?', bn: 'Subjunctive mood কোনটি?', options: ['She goes to school.', 'I suggested that she go.', 'He went home.', 'They are eating.'], answer: 1 },
      { type: 'mcq', q: 'The prefix "mis-" in "misanthrope" means:', bn: 'mis- prefix মানে:', options: ['Love', 'Hatred/Wrong', 'Many', 'Good'], answer: 1 },
      { type: 'mcq', q: '"Laconic" means:', bn: 'laconic মানে:', options: ['Long-winded', 'Using few words', 'Cheerful', 'Confused'], answer: 1 },
      { type: 'fill', q: 'In "The pen is mightier than the sword", "pen" and "sword" are examples of ___.', bn: '', answer: 'metonymy' },
      { type: 'mcq', q: 'Which is NOT a linking verb?', bn: 'কোনটি linking verb নয়?', options: ['seem', 'appear', 'run', 'become'], answer: 2 },
      { type: 'mcq', q: '"Prolix" means:', bn: 'prolix মানে:', options: ['Concise', 'Professional', 'Using too many words', 'Expert'], answer: 2 },
      { type: 'mcq', q: 'An "epistrophe" repeats words at the:', bn: 'epistrophe কোথায় শব্দ repeat করে?', options: ['Beginning of lines', 'End of lines', 'Middle of sentences', 'Before verbs'], answer: 1 },
      { type: 'mcq', q: 'The term "malapropism" refers to:', bn: 'malapropism কি?', options: ['Correct word usage', 'Using wrong word sounding similar', 'A type of rhyme', 'A grammar rule'], answer: 1 },
      { type: 'fill', q: 'A word that sounds like what it describes is called ___.', bn: '', answer: 'onomatopoeia' },
      { type: 'mcq', q: '"Ubiquitous" means:', bn: 'ubiquitous মানে:', options: ['Rare', 'Everywhere/Very common', 'Beautiful', 'Dangerous'], answer: 1 },
      { type: 'mcq', q: 'Which is a dangling modifier?', bn: 'dangling modifier কোনটি?', options: ['She ran fast.', 'Running to the bus, my bag fell.', 'He ate quickly.', 'They arrived late.'], answer: 1 },
      { type: 'mcq', q: '"Verisimilitude" in literature means:', bn: 'verisimilitude মানে:', options: ['Being truthful', 'Appearance of being real', 'A plot twist', 'A metaphor'], answer: 1 },
      { type: 'fill', q: 'The use of irony to mock or convey contempt is called ___.', bn: '', answer: 'sarcasm' },
      { type: 'mcq', q: 'Which sentence avoids the passive voice correctly?', bn: 'Active voice কোনটি?', options: ['The cake was eaten by me.', 'I ate the cake.', 'The cake has been eaten.', 'Eaten was the cake by me.'], answer: 1 },
      { type: 'mcq', q: 'A "paradox" is a statement that:', bn: 'paradox কি?', options: ['Makes no sense', 'Seems contradictory but is true', 'Tells a story', 'Uses rhyme'], answer: 1 },
      { type: 'mcq', q: '"Ameliorate" means:', bn: 'ameliorate মানে:', options: ['Worsen', 'Improve', 'Destroy', 'Ignore'], answer: 1 },
      { type: 'mcq', q: 'Identify the correct use of "whom":', bn: 'whom সঠিকভাবে কোথায়?', options: ['Who did you call?', 'Whom did you call?', 'Whom is at the door?', 'Who should I blame whom?'], answer: 1 },
    ]
  },

  levelConfig: {
    beginner: { time: 600, label: '🌱 Beginner', passMark: 60 },
    intermediate: { time: 900, label: '📚 Intermediate', passMark: 65 },
    advanced: { time: 1200, label: '🏆 Advanced', passMark: 70 }
  },

  init() {
    this.sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    this.loadHistory();
  },

  async loadHistory() {
    const histEl = document.getElementById('examHistory');
    if (!histEl) return;
    try {
      const res = await fetch(`/api/learn/exam-scores/${this.sessionId}`);
      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) return;
      histEl.innerHTML = data.map(r => {
        const pct = Math.round((r.score / r.total) * 100);
        const date = new Date(r.created_at).toLocaleDateString('bn-BD');
        return `<div class="exam-history-item"><span class="ehi-level">${r.exam_level}</span><span class="ehi-score">${r.score}/${r.total} (${pct}%)</span><span class="ehi-date">${date}</span></div>`;
      }).join('');
    } catch(e) {}
  },

  startExam(level) {
    this.currentLevel = level;
    this.currentQ = 0;
    this.answers = [];
    const cfg = this.levelConfig[level];
    this.timeLeft = cfg.time;
    const qs = this.questions[level];

    document.getElementById('exam-home').classList.add('hidden');
    document.getElementById('exam-active').classList.remove('hidden');
    document.getElementById('exam-result').classList.add('hidden');
    document.getElementById('examLevelLabel').textContent = cfg.label;
    document.getElementById('examQTotal').textContent = qs.length;

    this.startTimer();
    this.renderQuestion();
  },

  startTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      const m = Math.floor(this.timeLeft / 60).toString().padStart(2, '0');
      const s = (this.timeLeft % 60).toString().padStart(2, '0');
      const timerEl = document.getElementById('examTimer');
      if (timerEl) timerEl.textContent = `⏱ ${m}:${s}`;
      if (this.timeLeft <= 0) { clearInterval(this.timerInterval); this.showResult(); }
    }, 1000);
  },

  renderQuestion() {
    const qs = this.questions[this.currentLevel];
    if (this.currentQ >= qs.length) { this.showResult(); return; }
    const q = qs[this.currentQ];
    const pct = ((this.currentQ / qs.length) * 100).toFixed(0);
    document.getElementById('examProgressBar').style.width = pct + '%';
    document.getElementById('examQNum').textContent = this.currentQ + 1;

    let html = `<div class="exam-question-card">
      <div class="eq-type">${q.type === 'mcq' ? '🟣 Multiple Choice' : '✏️ Fill in the Blank'}</div>
      <div class="eq-question">${q.q}</div>`;
    if (q.bn) html += `<div class="eq-bangla">🇧🇩 ${q.bn}</div>`;
    if (q.type === 'mcq') {
      html += `<div class="eq-options">${q.options.map((opt, i) =>
        `<div class="eq-option" data-idx="${i}" onclick="ExamModule.selectOption(this, ${i})">${opt}</div>`
      ).join('')}</div>`;
    } else {
      html += `<input class="eq-fill-input" id="fillInput" type="text" placeholder="Type your answer..." />`;
    }
    html += '</div>';
    document.getElementById('examQuestionWrap').innerHTML = html;
    document.getElementById('examNextBtn').textContent = this.currentQ < qs.length - 1 ? 'Next →' : 'Finish ✓';
  },

  selectOption(el, idx) {
    document.querySelectorAll('.eq-option').forEach(o => o.classList.remove('selected'));
    el.classList.add('selected');
  },

  nextExamQuestion() {
    const qs = this.questions[this.currentLevel];
    const q = qs[this.currentQ];
    let userAnswer = null;
    if (q.type === 'mcq') {
      const sel = document.querySelector('.eq-option.selected');
      if (!sel && this.currentQ < qs.length - 1) {
        if (window.showToast) window.showToast('একটি উত্তর বেছে নিন!', 'warning');
        return;
      }
      userAnswer = sel ? parseInt(sel.dataset.idx) : -1;
      const correct = q.answer;
      // Show feedback briefly
      document.querySelectorAll('.eq-option').forEach((o, i) => {
        if (i === correct) o.classList.add('correct');
        else if (i === userAnswer && userAnswer !== correct) o.classList.add('wrong');
      });
    } else {
      const inp = document.getElementById('fillInput');
      userAnswer = inp ? inp.value.trim().toLowerCase() : '';
    }
    this.answers.push({ q: q.q, type: q.type, answer: q.answer, userAnswer });
    setTimeout(() => {
      this.currentQ++;
      if (this.currentQ >= qs.length) { this.showResult(); }
      else { this.renderQuestion(); }
    }, q.type === 'mcq' ? 600 : 0);
  },

  showResult() {
    clearInterval(this.timerInterval);
    document.getElementById('exam-active').classList.add('hidden');
    document.getElementById('exam-result').classList.remove('hidden');
    const qs = this.questions[this.currentLevel];
    let score = 0;
    const feedbackItems = [];
    this.answers.forEach((a, i) => {
      let correct = false;
      if (a.type === 'mcq') {
        correct = a.userAnswer === a.answer;
      } else {
        const correctStr = (qs[i] ? qs[i].answer : '').toString().toLowerCase();
        correct = a.userAnswer === correctStr || a.userAnswer.includes(correctStr);
      }
      if (correct) score++;
      feedbackItems.push(`<div class="rf-item"><span class="rf-q">${i+1}. ${a.q.substring(0,50)}...</span><span class="rf-status">${correct ? '✅' : '❌'}</span></div>`);
    });
    const total = qs.length;
    const pct = Math.round((score / total) * 100);
    const cfg = this.levelConfig[this.currentLevel];
    const passed = pct >= cfg.passMark;
    document.getElementById('resultIcon').textContent = pct >= 90 ? '🏆' : pct >= 70 ? '🌟' : pct >= 50 ? '💪' : '📚';
    document.getElementById('resultTitle').textContent = pct >= 80 ? 'অসাধারণ!' : pct >= 60 ? 'ভালো করেছেন!' : 'পরেরবার আরো ভালো হবেন!';
    document.getElementById('resultScore').textContent = `${score} / ${total}`;
    document.getElementById('resultPercent').textContent = `${pct}% — ${passed ? '✅ PASSED' : '❌ TRY AGAIN'}`;
    document.getElementById('resultMessage').textContent = passed ? 'আপনি pass করেছেন! বাংলাদেশের বাঘ। প্রতিদিন অনুশীলন চালিয়ে যান!' : `পরীক্ষাতে pass মার্ক ${cfg.passMark}%। আরো পড়ুন ও পুনরায় চেষ্টা করুন!`;
    document.getElementById('resultFeedback').innerHTML = feedbackItems.join('');
    // Save score to server
    this.saveScore(score, total);
    this.loadHistory();
  },

  async saveScore(score, total) {
    try {
      await fetch('/api/learn/exam-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: this.sessionId, exam_level: this.currentLevel, score, total })
      });
    } catch(e) {}
  }
};

/* ============================================================
   ENHANCED A-Z VOCABULARY DATA + RENDER
   ============================================================ */
const AZ_VOCAB = [
  // A
  {w:'Abandon',ipa:'/əˈbændən/',bn:'পরিত্যাগ করা',type:'verb',ex:'He abandoned the project.'},
  {w:'Ability',ipa:'/əˈbɪlɪti/',bn:'সামর্থ্য, দক্ষতা',type:'noun',ex:'She has great ability.'},
  {w:'Absent',ipa:'/ˈæbsənt/',bn:'অনুপস্থিত',type:'adj',ex:'He was absent today.'},
  {w:'Achieve',ipa:'/əˈtʃiːv/',bn:'অর্জন করা',type:'verb',ex:'Work hard to achieve success.'},
  {w:'Admire',ipa:'/ədˈmaɪər/',bn:'প্রশংসা করা',type:'verb',ex:'I admire your courage.'},
  {w:'Advice',ipa:'/ədˈvaɪs/',bn:'পরামর্শ',type:'noun',ex:'She gave me good advice.'},
  {w:'Afraid',ipa:'/əˈfreɪd/',bn:'ভয় পাওয়া',type:'adj',ex:'Are you afraid of dogs?'},
  {w:'Angry',ipa:'/ˈæŋɡri/',bn:'রাগান্বিত',type:'adj',ex:'He was angry at the news.'},
  {w:'Announce',ipa:'/əˈnaʊns/',bn:'ঘোষণা করা',type:'verb',ex:'They announced the winner.'},
  {w:'Answer',ipa:'/ˈɑːnsər/',bn:'উত্তর',type:'noun',ex:'Please answer the question.'},
  // B
  {w:'Balance',ipa:'/ˈbæləns/',bn:'ভারসাম্য',type:'noun',ex:'Keep a good work-life balance.'},
  {w:'Beautiful',ipa:'/ˈbjuːtɪfəl/',bn:'সুন্দর',type:'adj',ex:'She has a beautiful smile.'},
  {w:'Believe',ipa:'/bɪˈliːv/',bn:'বিশ্বাস করা',type:'verb',ex:'I believe in you.'},
  {w:'Benefit',ipa:'/ˈbenɪfɪt/',bn:'সুবিধা, উপকার',type:'noun',ex:'Exercise has many benefits.'},
  {w:'Brave',ipa:'/breɪv/',bn:'সাহসী',type:'adj',ex:'Be brave and speak up.'},
  {w:'Business',ipa:'/ˈbɪznɪs/',bn:'ব্যবসা',type:'noun',ex:'He runs a small business.'},
  // C
  {w:'Careful',ipa:'/ˈkeərfəl/',bn:'সাবধান',type:'adj',ex:'Be careful on the road.'},
  {w:'Challenge',ipa:'/ˈtʃælɪndʒ/',bn:'চ্যালেঞ্জ',type:'noun',ex:'Life is full of challenges.'},
  {w:'Change',ipa:'/tʃeɪndʒ/',bn:'পরিবর্তন করা',type:'verb',ex:'Change your habits.'},
  {w:'Character',ipa:'/ˈkærəktər/',bn:'চরিত্র',type:'noun',ex:'Good character matters.'},
  {w:'Communicate',ipa:'/kəˈmjuːnɪkeɪt/',bn:'যোগাযোগ করা',type:'verb',ex:'Communicate clearly.'},
  {w:'Confident',ipa:'/ˈkɒnfɪdənt/',bn:'আত্মবিশ্বাসী',type:'adj',ex:'Be confident in yourself.'},
  {w:'Create',ipa:'/kriˈeɪt/',bn:'তৈরি করা',type:'verb',ex:'Create something beautiful.'},
  {w:'Curious',ipa:'/ˈkjʊərɪəs/',bn:'কৌতূহলী',type:'adj',ex:'Stay curious and keep learning.'},
  // D
  {w:'Dangerous',ipa:'/ˈdeɪndʒərəs/',bn:'বিপজ্জনক',type:'adj',ex:'Driving fast is dangerous.'},
  {w:'Decide',ipa:'/dɪˈsaɪd/',bn:'সিদ্ধান্ত নেওয়া',type:'verb',ex:'You must decide now.'},
  {w:'Dedicated',ipa:'/ˈdedɪkeɪtɪd/',bn:'নিবেদিত, পরিশ্রমী',type:'adj',ex:'She is dedicated to her work.'},
  {w:'Describe',ipa:'/dɪˈskraɪb/',bn:'বর্ণনা করা',type:'verb',ex:'Can you describe the scene?'},
  {w:'Dream',ipa:'/driːm/',bn:'স্বপ্ন',type:'noun',ex:'Follow your dreams.'},
  {w:'Develop',ipa:'/dɪˈveləp/',bn:'উন্নয়ন করা',type:'verb',ex:'Develop your skills daily.'},
  // E
  {w:'Eager',ipa:'/ˈiːɡər/',bn:'আগ্রহী, উৎসাহী',type:'adj',ex:'She was eager to learn.'},
  {w:'Educate',ipa:'/ˈedʒʊkeɪt/',bn:'শিক্ষিত করা',type:'verb',ex:'Education is power.'},
  {w:'Effective',ipa:'/ɪˈfektɪv/',bn:'কার্যকর',type:'adj',ex:'Find an effective solution.'},
  {w:'Encourage',ipa:'/ɪnˈkʌrɪdʒ/',bn:'উৎসাহ দেওয়া',type:'verb',ex:'Encourage your friends.'},
  {w:'Excellent',ipa:'/ˈeksələnt/',bn:'চমৎকার',type:'adj',ex:'You did an excellent job.'},
  {w:'Experience',ipa:'/ɪkˈspɪərɪəns/',bn:'অভিজ্ঞতা',type:'noun',ex:'Experience is the best teacher.'},
  // F
  {w:'Failure',ipa:'/ˈfeɪljər/',bn:'ব্যর্থতা',type:'noun',ex:'Failure teaches success.'},
  {w:'Famous',ipa:'/ˈfeɪməs/',bn:'বিখ্যাত',type:'adj',ex:'He is a famous author.'},
  {w:'Flexible',ipa:'/ˈfleksɪbəl/',bn:'নমনীয়',type:'adj',ex:'Stay flexible in your plans.'},
  {w:'Focus',ipa:'/ˈfoʊkəs/',bn:'মনোযোগ দেওয়া',type:'verb',ex:'Focus on your goal.'},
  {w:'Forgive',ipa:'/fərˈɡɪv/',bn:'ক্ষমা করা',type:'verb',ex:'Learn to forgive others.'},
  {w:'Freedom',ipa:'/ˈfriːdəm/',bn:'স্বাধীনতা',type:'noun',ex:'Freedom is precious.'},
  // G
  {w:'Generous',ipa:'/ˈdʒenərəs/',bn:'উদার, দানশীল',type:'adj',ex:'He is a generous person.'},
  {w:'Goal',ipa:'/ɡoʊl/',bn:'লক্ষ্য',type:'noun',ex:'Set a clear goal.'},
  {w:'Grateful',ipa:'/ˈɡreɪtfəl/',bn:'কৃতজ্ঞ',type:'adj',ex:'Be grateful for what you have.'},
  {w:'Grow',ipa:'/ɡroʊ/',bn:'বৃদ্ধি পাওয়া',type:'verb',ex:'Every day is a chance to grow.'},
  {w:'Guide',ipa:'/ɡaɪd/',bn:'পথপ্রদর্শক, গাইড',type:'noun',ex:'He is my guide.'},
  // H
  {w:'Hardworking',ipa:'/ˈhɑːrdˌwɜːrkɪŋ/',bn:'পরিশ্রমী',type:'adj',ex:'She is very hardworking.'},
  {w:'Honest',ipa:'/ˈɒnɪst/',bn:'সৎ',type:'adj',ex:'Always be honest.'},
  {w:'Hope',ipa:'/hoʊp/',bn:'আশা',type:'noun',ex:'Never lose hope.'},
  {w:'Humble',ipa:'/ˈhʌmbəl/',bn:'বিনয়ী',type:'adj',ex:'Stay humble even when successful.'},
  // I
  {w:'Imagination',ipa:'/ɪˌmædʒɪˈneɪʃən/',bn:'কল্পনা',type:'noun',ex:'Use your imagination.'},
  {w:'Improve',ipa:'/ɪmˈpruːv/',bn:'উন্নত করা',type:'verb',ex:'Improve a little every day.'},
  {w:'Independence',ipa:'/ˌɪndɪˈpendəns/',bn:'স্বাধীনতা',type:'noun',ex:'Bangladesh won independence in 1971.'},
  {w:'Influence',ipa:'/ˈɪnfluəns/',bn:'প্রভাব',type:'noun',ex:'Good teachers influence lives.'},
  {w:'Intelligent',ipa:'/ɪnˈtelɪdʒənt/',bn:'বুদ্ধিমান',type:'adj',ex:'She is very intelligent.'},
  // J
  {w:'Journey',ipa:'/ˈdʒɜːrni/',bn:'যাত্রা, ভ্রমণ',type:'noun',ex:'Life is a beautiful journey.'},
  {w:'Joyful',ipa:'/ˈdʒɔɪfəl/',bn:'আনন্দিত',type:'adj',ex:'She has a joyful personality.'},
  {w:'Judge',ipa:'/dʒʌdʒ/',bn:'বিচার করা',type:'verb',ex:'Do not judge others quickly.'},
  // K
  {w:'Knowledge',ipa:'/ˈnɒlɪdʒ/',bn:'জ্ঞান',type:'noun',ex:'Knowledge is power.'},
  {w:'Kind',ipa:'/kaɪnd/',bn:'দয়ালু',type:'adj',ex:'Be kind to everyone.'},
  // L
  {w:'Language',ipa:'/ˈlæŋɡwɪdʒ/',bn:'ভাষা',type:'noun',ex:'English is a global language.'},
  {w:'Leader',ipa:'/ˈliːdər/',bn:'নেতা',type:'noun',ex:'Be a good leader.'},
  {w:'Learn',ipa:'/lɜːrn/',bn:'শেখা',type:'verb',ex:'Never stop learning.'},
  {w:'Listen',ipa:'/ˈlɪsən/',bn:'মনোযোগ দিয়ে শোনা',type:'verb',ex:'Listen before you speak.'},
  {w:'Loyalty',ipa:'/ˈlɔɪəlti/',bn:'আনুগত্য, বিশ্বস্ততা',type:'noun',ex:'Loyalty is a great quality.'},
  // M
  {w:'Manage',ipa:'/ˈmænɪdʒ/',bn:'পরিচালনা করা',type:'verb',ex:'She manages her time well.'},
  {w:'Meaningful',ipa:'/ˈmiːnɪŋfəl/',bn:'অর্থবহ',type:'adj',ex:'Live a meaningful life.'},
  {w:'Motivate',ipa:'/ˈmoʊtɪveɪt/',bn:'অনুপ্রাণিত করা',type:'verb',ex:'Motivate yourself daily.'},
  {w:'Mindful',ipa:'/ˈmaɪndfəl/',bn:'সচেতন',type:'adj',ex:'Be mindful of your words.'},
  // N
  {w:'Nature',ipa:'/ˈneɪtʃər/',bn:'প্রকৃতি',type:'noun',ex:'Love and protect nature.'},
  {w:'Necessary',ipa:'/ˈnesəseri/',bn:'প্রয়োজনীয়',type:'adj',ex:'Practice is necessary.'},
  {w:'Negotiate',ipa:'/nɪˈɡoʊʃieɪt/',bn:'আলোচনা করা',type:'verb',ex:'Learn to negotiate.'},
  // O
  {w:'Opportunity',ipa:'/ˌɒpərˈtjuːnɪti/',bn:'সুযোগ',type:'noun',ex:'Grab every opportunity.'},
  {w:'Optimistic',ipa:'/ˌɒptɪˈmɪstɪk/',bn:'আশাবাদী',type:'adj',ex:'Stay optimistic always.'},
  {w:'Organize',ipa:'/ˈɔːrɡənaɪz/',bn:'সংগঠিত করা',type:'verb',ex:'Organize your thoughts.'},
  // P
  {w:'Patience',ipa:'/ˈpeɪʃəns/',bn:'ধৈর্য',type:'noun',ex:'Patience is a virtue.'},
  {w:'Persistent',ipa:'/pərˈsɪstənt/',bn:'অধ্যবসায়ী',type:'adj',ex:'Be persistent in your efforts.'},
  {w:'Polite',ipa:'/pəˈlaɪt/',bn:'ভদ্র, শিষ্ট',type:'adj',ex:'Always be polite.'},
  {w:'Positive',ipa:'/ˈpɒzɪtɪv/',bn:'ইতিবাচক',type:'adj',ex:'Think positive thoughts.'},
  {w:'Practice',ipa:'/ˈpræktɪs/',bn:'অনুশীলন করা',type:'verb',ex:'Practice every single day.'},
  {w:'Problem',ipa:'/ˈprɒbləm/',bn:'সমস্যা',type:'noun',ex:'Every problem has a solution.'},
  {w:'Progress',ipa:'/ˈprəʊɡres/',bn:'অগ্রগতি',type:'noun',ex:'Track your progress.'},
  // Q
  {w:'Quality',ipa:'/ˈkwɒlɪti/',bn:'গুণমান',type:'noun',ex:'Always aim for quality.'},
  {w:'Question',ipa:'/ˈkwestʃən/',bn:'প্রশ্ন',type:'noun',ex:'Ask good questions.'},
  // R
  {w:'Respect',ipa:'/rɪˈspekt/',bn:'সম্মান',type:'noun',ex:'Respect everyone.'},
  {w:'Responsible',ipa:'/rɪˈspɒnsɪbəl/',bn:'দায়িত্বশীল',type:'adj',ex:'Be responsible for your actions.'},
  {w:'Resilient',ipa:'/rɪˈzɪlɪənt/',bn:'স্থিতিস্থাপক',type:'adj',ex:'Stay resilient during hard times.'},
  // S
  {w:'Sacrifice',ipa:'/ˈsækrɪfaɪs/',bn:'ত্যাগ',type:'noun',ex:'Success requires sacrifice.'},
  {w:'Sincere',ipa:'/sɪnˈsɪər/',bn:'আন্তরিক',type:'adj',ex:'Be sincere in your work.'},
  {w:'Skill',ipa:'/skɪl/',bn:'দক্ষতা',type:'noun',ex:'Develop your skills.'},
  {w:'Speak',ipa:'/spiːk/',bn:'কথা বলা',type:'verb',ex:'Speak with confidence.'},
  {w:'Strength',ipa:'/streŋθ/',bn:'শক্তি',type:'noun',ex:'Find your inner strength.'},
  {w:'Success',ipa:'/səkˈses/',bn:'সাফল্য',type:'noun',ex:'Hard work leads to success.'},
  // T
  {w:'Talent',ipa:'/ˈtælənt/',bn:'প্রতিভা',type:'noun',ex:'Nurture your talent.'},
  {w:'Thoughtful',ipa:'/ˈθɔːtfəl/',bn:'চিন্তাশীল',type:'adj',ex:'Be thoughtful before speaking.'},
  {w:'Tolerant',ipa:'/ˈtɒlərənt/',bn:'সহিষ্ণু',type:'adj',ex:'Be tolerant of differences.'},
  {w:'Trust',ipa:'/trʌst/',bn:'বিশ্বাস',type:'noun',ex:'Trust is hard to earn.'},
  // U
  {w:'Understand',ipa:'/ˌʌndəˈstænd/',bn:'বোঝা',type:'verb',ex:'Try to understand others.'},
  {w:'Unique',ipa:'/juːˈniːk/',bn:'অনন্য, অদ্বিতীয়',type:'adj',ex:'You are unique!'},
  {w:'Useful',ipa:'/ˈjuːsfəl/',bn:'উপকারী',type:'adj',ex:'English is very useful.'},
  // V
  {w:'Valuable',ipa:'/ˈvæljuəbəl/',bn:'মূল্যবান',type:'adj',ex:'Time is valuable.'},
  {w:'Verify',ipa:'/ˈverɪfaɪ/',bn:'যাচাই করা',type:'verb',ex:'Always verify facts.'},
  {w:'Vision',ipa:'/ˈvɪʒən/',bn:'দৃষ্টিভঙ্গি, লক্ষ্য',type:'noun',ex:'Have a clear vision.'},
  {w:'Vocabulary',ipa:'/vəˈkæbjʊləri/',bn:'শব্দভাণ্ডার',type:'noun',ex:'Build your vocabulary daily.'},
  // W
  {w:'Wisdom',ipa:'/ˈwɪzdəm/',bn:'প্রজ্ঞা, জ্ঞান',type:'noun',ex:'Wisdom comes with experience.'},
  {w:'Wonder',ipa:'/ˈwʌndər/',bn:'বিস্ময়',type:'noun',ex:'The world is full of wonder.'},
  {w:'Worthy',ipa:'/ˈwɜːrði/',bn:'যোগ্য',type:'adj',ex:'You are worthy of success.'},
  // X, Y, Z
  {w:'Xenial',ipa:'/ˈziːnɪəl/',bn:'অতিথিপরায়ণ',type:'adj',ex:'Bangladeshis are known to be xenial.'},
  {w:'Yearn',ipa:'/jɜːrn/',bn:'আকাঙ্ক্ষা করা',type:'verb',ex:'She yearns for success.'},
  {w:'Zeal',ipa:'/ziːl/',bn:'উৎসাহ, আগ্রহ',type:'noun',ex:'Work with zeal and passion.'},
  {w:'Zealous',ipa:'/ˈzeləs/',bn:'উৎসাহী',type:'adj',ex:'Be zealous in your studies.'},
];

function renderAZVocab(filter) {
  const grid = document.getElementById('vocabGrid');
  if (!grid) return;
  let words = AZ_VOCAB;
  if (filter && filter.length === 1) {
    // Filter by letter
    words = AZ_VOCAB.filter(w => w.w.toUpperCase().startsWith(filter.toUpperCase()));
  } else if (filter && filter.length > 1) {
    // Search filter
    const q = filter.toLowerCase();
    words = AZ_VOCAB.filter(w => w.w.toLowerCase().includes(q) || w.bn.includes(q));
  }
  if (words.length === 0) {
    grid.innerHTML = '<p style="color:var(--text-muted);padding:1rem;">No words found.</p>';
    return;
  }
  grid.innerHTML = words.map(v => `
    <div class="vocab-card">
      <div class="vocab-word">${v.w} <button class="vocab-speak-btn" onclick="speakWord('${v.w}'" title="Listen">🔊</button></div>
      <div class="vocab-ipa">${v.ipa}</div>
      <div class="vocab-type">${v.type}</div>
      <div class="vocab-bangla">🇧🇩 ${v.bn}</div>
      <div class="vocab-example">“${v.ex}”</div>
    </div>
  `).join('');
}

function speakWord(word) {
  if (!window.speechSynthesis) return;
  const utt = new SpeechSynthesisUtterance(word);
  utt.lang = 'en-US'; utt.rate = 0.8;
  speechSynthesis.speak(utt);
}

function buildAZIndex() {
  const idx = document.getElementById('azIndex');
  if (!idx) return;
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  idx.innerHTML = letters.map(l =>
    `<button onclick="filterByLetter('${l}')" id="az-btn-${l}">${l}</button>`
  ).join('') + `<button onclick="filterByLetter('')" style="padding:0 8px;font-size:0.7rem;">ALL</button>`;
}

function filterByLetter(letter) {
  document.querySelectorAll('.az-index button').forEach(b => b.classList.remove('az-active'));
  if (letter) {
    const btn = document.getElementById(`az-btn-${letter}`);
    if (btn) btn.classList.add('az-active');
  }
  renderAZVocab(letter);
}

/* ============================================================
   INITIALIZE APP ON DOM READY
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  app.init();
  AITutor.init();
  ExamModule.init();
  // Build A-Z index and render all vocabulary
  buildAZIndex();
  renderAZVocab('');
  // Hook up vocab search
  const vs = document.getElementById('vocabSearch');
  if (vs) {
    vs.addEventListener('input', () => {
      const q = vs.value.trim();
      document.querySelectorAll('.az-index button').forEach(b => b.classList.remove('az-active'));
      renderAZVocab(q);
    });
  }
  // Expose startExam to global scope for onclick handlers
  window.app = app;
  window.app.startExam = (level) => ExamModule.startExam(level);
  
  window.app.practiceLessonWithAI = (dayNum, type) => {
    const dayData = COURSE_DAYS.find(d => d.day === dayNum);
    if (!dayData) return;
    
    app.goToSection('ai-tutor');
    
    // Switch AI to free chat mode for the lesson task
    document.querySelectorAll('.topic-btn').forEach(b => b.classList.remove('active'));
    const freeBtn = document.querySelector('.topic-btn[data-topic="freemode"]');
    if (freeBtn) freeBtn.classList.add('active');
    AITutor.currentTopic = 'freemode';
    
    // Set practice state for dynamic smart replies
    AITutor.currentLessonPractice = { dayNum: dayNum, type: type, step: 1 };
    
    // Clear chat and set custom lesson prompt
    const win = document.getElementById('chatWindow');
    if (!win) return;
    
    const taskText = type === 'speaking' ? dayData.speaking : dayData.writing;
    const taskTypeStr = type === 'speaking' ? 'Speaking' : 'Writing';
    const actionStr = type === 'speaking' ? 'use the 🎤 Mic button below to speak to me' : 'type your answer below';
    
    win.innerHTML = `
      <div class="chat-msg ai">
        <div class="chat-avatar">🤖</div>
        <div class="chat-bubble">
          <p><strong>Lesson ${dayNum} ${taskTypeStr} Practice!</strong></p>
          <p><em>Task: ${taskText}</em></p>
          <p>I am ready to help you with this task. You can ${actionStr}!</p>
        </div>
      </div>
    `;
    
    // Reset stats for the new session
    AITutor.msgCount = 0; 
    AITutor.wordsLearned = 0; 
    AITutor.corrections = 0;
    AITutor.updateStats();
  };

  window.ExamModule = ExamModule;
  window.speakWord = speakWord;
  window.filterByLetter = filterByLetter;
});
