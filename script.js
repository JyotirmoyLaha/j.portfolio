// --- BLOG DATA & LOGIC ---

const blogPosts = [
    {
        id: 1,
        title: "Why I Focus More on Thinking Than Just Writing Code",
        date: "03 December 2025",
        category: "Philosophy",
        image: "jakub-zerdzicki-WD7S-Lz12Es-unsplash.jpg",
        content: `For me, coding starts before the keyboard. Understanding the problem comes first. That's why I prefer small, clear functions:

\`\`\`
function toggle Menu() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
}
\`\`\`

Breaking big problems into smaller parts makes them easier to handle:

\`\`\`
AOS.init({
    once: true,
    offset: 50,
    duration: 1000,
    easing: 'ease-out-cubic',
});
\`\`\`

I try to write logic that future-me can understand:

\`\`\`
if (items.length === 0) {
    showEmptyState();
} else {
    renderltems(items);
}
\`\`\`

Even small Ul features taught me performance and UX lessons:

\`\`\`
particlesJS("particles-js", {
    particles: {
        number: { value: 30 },
        size: { value: 2 },
        move: { speed: 1}
    }
});
\`\`\`

I build projects to improve thinking, not just to show skills. I'm still learning - and that's okay. Good thinking will always matter more than fast typing.`
    },
    {
        id: 2,
        title: "How I Built My Portfolio Website",
        date: "05 December 2025",
        category: "Project Breakdown",
        image: "nick-morrison-FHnnjk1Yj7Y-unsplash.jpg",
        content: `My portfolio website represents me as a learner and thinker. Before coding, I decided its purpose: simplicity, clarity, and professionalism.

I used HTML, Tailwind CSS, JavaScript, and AOS for animations. Navigation was kept simple:

\`\`\`
function toggle Menu() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
}
\`\`\`

Animations were controlled carefully:

\`\`\`
AOS.init({
    once: true,
    offset: 50,
    duration: 1000,
    easing: 'ease-out-cubic',
});
\`\`\`

I added subtle particles for visual balance:

\`\`\`
particlesJS("particles-js", {
    particles: {
        number: { value: 30 },
        color: { value: "#94a3b8" },
        size: { value: 2 },
        move: { speed: 1}
    }
});
\`\`\`

The design stays clean, readable, and content-focused. This project taught me planning, simplicity, and confidence.`
    },
    {
        id: 3,
        title: "Mistakes I Made While Building My Portfolio Website",
        date: "07 December 2025",
        category: "Reflection",
        image: "kevin-ku-w7ZyuGYNpRQ-unsplash.jpg",
        content: `One of my biggest mistakes was focusing too much on design before finalizing content. This caused unnecessary redesign later. Now I focus on structure and clarity first.

I also tried to build everything in one sitting, which led to messy code. Breaking the website into sections made development easier.

At one point, I added too many effects:

\`\`\`
particlesJS("particles-js", {
    particles: {
        number: { value: 30},
        move: { speed: 1}
    }
});
\`\`\`

It looked cool but hurt performance. I learned that visuals should support content.

Unclear variable names caused confusion later. Writing clear functions like this helped a lot:

\`\`\`
function toggle Menu() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
}
\`\`\`

I also underestimated mobile users and performance issues. Fixing these taught me responsive design and optimization. Most importantly, I learned that portfolios don't need to be perfect - they need to evolve.`
    },
    {
        id: 4,
        title: "How I Built My Weather App (J.SkyCast)",
        date: "10 December 2025",
        category: "Project Breakdown",
        image: "dawn-patrol-surf-tracking-nV8Hc0VZA1w-unsplash.jpg",
        content: `Building this weather app was not just about showing temperature. I wanted it to feel modern, smooth, and alive. Before writing any code, I focused on user experience instead of data.

I used a simple tech stack: HTML for structure, Tailwind CSS for styling, JavaScript for logic, and a weather API for real-time data. I avoided frameworks to strengthen my fundamentals.

The search system was kept simple and reliable:

\`\`\`
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (query) {
        fetchWeather(query);
    }
});
\`\`\`

This logic prevents page reloads and ensures only valid input is processed.

I also added live location support:

\`\`\`
navigator.geolocation.getCurrentPosition(
    (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeather(\`\${latitude} , \${longitude}\`);
    }
);
\`\`\`

Fetching real-time weather data was the core of the app:

\`\`\`
const response = await fetch(
    \`https://api.weatherapi.com/v1/current.json?key=\${decodedKey}&q=\${query}&aqi=yes\`
);
\`\`\`

To avoid freezing the UI, I added a loading state and dynamic backgrounds:

\`\`\`
function update Background Theme(condition, isDay) {
    if (condition.text.toLowerCase().includes ("rain")) {
        bgContainer.classList.add('rain-active');
    }
}
\`\`\`

I also added air quality index information:

\`\`\`
function getAQIDetails (index) {
    return {
        text: "Good",
        color: "text-green-400"
    };
}
\`\`\`

This project helped me understand APIs, Ul states, UX design, and readable JavaScript. It improved my confidence as a developer.`
    },
    {
        id: 5,
        title: "Mistakes I Made While Building This Weather App",
        date: "12 December 2025",
        category: "Development",
        image: "image-3.jpeg",
        content: `When people use my weather app, they see a smooth interface and real-time data. What they don't see are the mistakes and wrong assumptions I made while building it. This project taught me that mistakes are not failures they are lessons.

One of my first mistakes was assuming the weather API would always work perfectly. In reality, APIs can fail due to invalid city names or network issues. That's why I added proper error handling like this:

\`\`\`
if (!response.ok) {
    throw new Error("Failed to fetch weather data");
}
\`\`\`

This taught me that error handling is not optional - it's necessary.

Another mistake was not showing a loading state early. When users searched for a city, nothing happened for a few seconds, which felt broken. To fix this, I added a loader:

\`\`\`
function showLoading(msg) {
    loadingText.textContent = msg;
    loader.classList.remove('hidden');
}
\`\`\`

Now users know that something is happening. I learned that good UX is about communication, not just speed.

I also ignored edge cases in location access. I forgot that users can deny location permission, which caused errors. I fixed it by handling rejection properly:

\`\`\`
navigator.geolocation.getCurrentPosition(
    successCallback,
    () => showError("Location access denied.")
);
\`\`\`

This taught me never to assume user behavior.

At one point, I added too many animations and visual effects. The app looked cool but performance dropped. Reducing effects made the app feel cleaner and more professional.

Another mistake was making background logic too complex. Simplifying conditions made the code easier to understand:

\`\`\`
if (text.includes("rain")) {
    bgContainer.classList.add('rain-active');
}
\`\`\`

Readable code saves a lot of time in the future.

Users also make mistakes - wrong inputs, repeated clicks, and unrealistic expectations. That's why I added clear error messages:

\`\`\`
function showError(msg) {
    errorMessage.textContent = msg;
    errorDiv.classList.remove('hidden');
}
\`\`\`

Finally, I waited too long trying to make the app perfect. I learned that it's better to release early and improve later. This project taught me how real APIs work, why Ul states matter, and how to think like a user.`
    },
    {
        id: 6,
        title: "How AI Helps Me Build Better Websites",
        date: "15 December 2025",
        category: "Workflow",
        image: "igor-omilaev-FHgWFzDDAOs-unsplash.jpg",
        content: `When people hear about Al in web development, they often imagine that Al builds websites automatically. That's not how I use Al. For me, Al works more like a smart assistant that helps me think clearly, learn faster, and avoid common mistakes while building websites. It supports my learning instead of replacing it.

Many times, I know what I want to build, but I'm not fully sure how to approach it. That's where Al helps me the most. It helps me break a feature into steps, understand user flow, and think logically instead of guessing blindly. Al doesn't do the thinking for me it improves my thinking.

Al also helps me write cleaner and more readable code. Sometimes my code works, but it's not very clean. Al suggestions help me improve variable names, simplify logic, and remove unnecessary lines. For example, instead of writing complex checks, I learned to write clearer logic like this:

\`\`\`
if (items?.length) {
    showitems();
}
\`\`\`

The logic stays the same, but the code becomes easier to understand. Debugging is another area where Al helps a lot. When errors appear, Al helps me understand error messages, find missing logic, and spot small mistakes. Instead of just fixing bugs, I also learn why the bug happened, which helps me avoid it next time.

Al also helps me learn new concepts like APIs, animations, performance optimization, and responsive design. It explains things in simple language with examples, which builds my confidence as a student. It feels like having a patient teacher who is always available.

Beyond coding, Al improves my UI and UX thinking. It helps me think about loading states, error handling, and user behavior. For example, I often ask myself questions like whether I should show a loader or what happens if a user clicks twice. These small details make a big difference in how professional a website feels.

Al even helps me write better content, including blogs and project descriptions. But it's important to say what Al does not do. It does not build my website alone, make decisions for me, or replace my learning. I still design, code, test, and debug everything myself. Al is just a tool - how I use it defines the result.`
    },
    {
        id: 7,
        title: "How I Built My AI Resume Analyzer Tool",
        date: "3rd January 2026",
        category: "Project Breakdown",
        image: "chatgpt-resume-analyzer.png",
        content: `
Resumes play a very important role in today's job market. In most cases, they are the first thing a recruiter or an automated system looks at before deciding whether a candidate should move forward. However, many people struggle to understand whether their resume actually matches the job they are applying for. I built my AI Resume Analyzer to solve this exact problem by giving clear, role-based feedback instead of guesswork.

The main idea behind this project was to allow users to upload their resume, select a target job role, and instantly see how well their skills match that role. The system does not just show a score, but also highlights matched skills, missing skills, and practical recommendations. This makes resume improvement more structured and actionable instead of confusing or generic.

On the backend, the first challenge was extracting clean text from uploaded PDF resumes. Since resumes come in different formats, this step needed to be reliable. I used a dedicated resume parser to safely extract and clean text before analysis.

\`\`\`python
def extract_text_from_resume(file):
    extracted_text = []
    with pdfplumber.open(file) as pdf:
        for page in pdf.pages:
            text = page.extract_text()
            if text:
                extracted_text.append(text)

    text = "\\n".join(extracted_text)
    return text.lower().strip()
\`\`\`

This logic ensures that the system works even when resumes have multiple pages or inconsistent spacing.

\`\`\`python
def extract_skills(resume_text):
    found_skills = set()
    for skill, pattern in MASTER_SKILL_PATTERNS.items():
        if pattern.search(resume_text):
            found_skills.add(skill)
    return sorted(found_skills)
\`\`\`

Once the resume text is extracted, the next step is identifying technical skills accurately. Instead of relying on simple keyword checks, I built a structured skill extraction system using predefined patterns and role-based filters. This allows the analyzer to detect skills like Python, JavaScript, React, Docker, and many others with higher accuracy.

This approach makes the system flexible and easy to extend when new skills or roles are added.

The most important part of the project is the skill gap analysis. This is where the AI logic compares the candidate's skills with the required skills for a selected role. Instead of treating all skills equally, I introduced priority levels like critical, high, and medium to make the results more realistic.

\`\`\`python
matched_skills = candidate_skills & required_skills
missing_skills = required_skills - candidate_skills

match_percentage = round((earned_score / total_score) * 100, 2)
\`\`\`

This scoring system helps users understand not just what is missing, but how important those missing skills are for their target role.

To make the analysis more helpful, I also added a feedback generator that converts raw numbers into human-readable career advice. Instead of technical output, users see simple guidance that feels personal and encouraging.

\`\`\`python
if match >= 85:
    feedback = "You are strongly prepared for this role."
elif match >= 65:
    feedback = "You are moderately prepared, but need improvement."
else:
    feedback = "Focused upskilling is recommended."
\`\`\`

This step made the tool feel less like a machine and more like a mentor.

The backend API is built using Flask and is designed to be clean and minimal. It handles resume uploads, role selection, and returns structured JSON data that the frontend can easily consume.

\`\`\`python
@app.route("/analyze", methods=["POST"])
def analyze_resume():
    resume_text = extract_text_from_resume(resume_file)
    result = analyze_skill_gap(resume_text, role, include_resources=True)
    return jsonify(result)
\`\`\`

This separation between frontend and backend keeps the system scalable and easy to maintain.

On the frontend, my focus was clarity and simplicity. The interface allows users to select a role, upload a PDF resume, and view results without unnecessary distractions. I used a clean dashboard layout that highlights match score, skills, feedback, and next steps in a clear visual hierarchy.

\`\`\`javascript
const res = await fetch(\`\${API_BASE_URL}/analyze\`, {
  method: "POST",
  body: formData
});
const data = await res.json();
renderResults(data);
\`\`\`

The UI is designed to feel calm and supportive, because resume analysis is a sensitive process for many users.

Building this project taught me that AI is not just about complex models or buzzwords. The real value comes from solving a real problem in a way that users can understand and trust. Most of the effort went into thinking about what feedback actually helps people, not just how to calculate scores.

This AI Resume Analyzer represents my interest in combining backend logic, AI concepts, and frontend usability into a single meaningful product. It is not perfect, but it is practical, honest, and continuously improving. As I learn more, I plan to add better role comparisons, smarter recommendations, and deeper analysis.

— Jyotirmoy Laha
`
    },
    {
        id: 8,
        title: "Mistakes I Made While Building This AI Resume Analyzer",
        date: "6th January 2026",
        category: "Lessons Learned",
        image: "chatgpt-resume-mistakes.png",
        content: `
When I started building my AI Resume Analyzer, I was excited about the idea and features, but I underestimated how important clean structure, language separation, and proper API testing really are. Most of my mistakes were not about syntax errors, but about how I organized and tested my code. These mistakes slowed me down, but they taught me how real backend systems should be built.

One of the biggest mistakes I made in the beginning was poor separation of responsibilities between different Python files. Initially, my logic felt scattered. Skill extraction, role mapping, scoring, and feedback generation were tightly connected in my head, and I didn't clearly define where each responsibility should live. Over time, this made the code harder to debug and reason about.

Later, I fixed this by clearly separating concerns. For example, all skill detection logic now lives only inside skill_extractor.py, while role comparison and scoring logic stays inside skill_gap.py. This made the system much cleaner and easier to maintain.

\`\`\`python
# skill_extractor.py
def extract_skills(resume_text: str, role: Optional[str] = None) -> List[str]:
    if not resume_text:
        return []

    resume_text = resume_text.lower()
    found_skills = set()

    for skill, pattern in MASTER_SKILL_PATTERNS.items():
        if pattern.search(resume_text):
            found_skills.add(skill)

    if role and role in ROLE_SKILLS:
        found_skills &= ROLE_SKILLS[role]

    return sorted(found_skills)
\`\`\`

This separation helped me understand that each file should do one job well, not everything at once.

Another major mistake was treating API testing as an afterthought. At first, I tested my backend only by clicking buttons on the frontend. If the UI worked, I assumed the API was fine. This was a bad habit. When something broke, I had no clear idea whether the problem was coming from the frontend request, backend validation, or resume parsing.

Once I started reading my app.py carefully, I realized how important proper API validation really is. I improved my API by adding strict checks for file uploads and extracted text before running any analysis.

\`\`\`python
# app.py
if "resume" not in request.files:
    return jsonify({"error": "Resume file is required"}), 400

resume_file = request.files.get("resume")
if resume_file.filename == "":
    return jsonify({"error": "Resume file is empty"}), 400
\`\`\`

After this, testing the API independently (without the UI) became much easier, and errors were clearer and more predictable.

I also made mistakes while handling resume text extraction. In the beginning, I assumed that every PDF would return clean text. In reality, some resumes had missing text, broken formatting, or unexpected layouts. When extraction failed, the rest of the pipeline broke silently.

To fix this, I added proper checks and cleaning logic inside resume_parser.py.

\`\`\`python
# resume_parser.py
with pdfplumber.open(file) as pdf:
    for page in pdf.pages:
        text = page.extract_text()
        if text:
            extracted_text.append(text)

if not extracted_text:
    return None
\`\`\`

This taught me that data coming from users is never guaranteed to be clean, and defensive programming is necessary in real-world applications.

Another mistake I made was not thinking deeply about scoring logic at first. Initially, all skills felt equal in my head. But that produced unrealistic results. Missing a core skill like Python should matter more than missing a secondary one. This pushed me to design a weighted scoring system using skill priorities.

\`\`\`python
# skill_gap.py
for skill in required_skills:
    weight = _priority_weight(SKILL_PRIORITY.get(skill, "low"))
    total_score += weight
    if skill in candidate_skills:
        earned_score += weight
\`\`\`

This change completely improved the realism of the analyzer and made the results feel closer to real hiring expectations.

Looking back, most of my mistakes came from trying to move fast instead of thinking clearly about structure and testing. I learned that good AI tools are not built only with smart logic, but with clean separation of concerns, strong validation, and proper API testing.

This project taught me how backend systems actually behave in real usage. Every mistake forced me to slow down, refactor, and understand my own code better. Those lessons are far more valuable than a perfect first version.

— Jyotirmoy Laha
`
    },
    {
        id: 9,
        title: "How I Built Mess Manager — A Real-Time Expense Tracker for Hostel Life",
        date: "10th February 2026",
        category: "Project Breakdown",
        image: "mess-manager.jpeg",
        content: `Living in a hostel means sharing everything, including food costs. Every month, our group collects a fund, buys groceries, and tracks who spent what. But doing all of this manually through messages and notebooks created confusion, arguments, and lost records. That is exactly why I built Mess Manager — a real-time expense tracking app designed specifically for shared living situations.

Before writing any code, I spent time understanding the actual problem. Our group of four needed a system where anyone could add an expense, everyone could see the live balance, and no one could tamper with someone else's entries. The solution had to be simple, mobile-friendly, and always in sync across all devices.

I chose a clean tech stack: HTML5 for structure, Tailwind CSS for styling, vanilla JavaScript (ES6+) for logic, and Firebase for authentication and database. I intentionally avoided frameworks to keep things lightweight and to strengthen my fundamentals.

The first major decision was using Firebase Firestore as a real-time NoSQL database. This meant every expense added by one member would instantly appear on everyone else's screen without refreshing. I set up two main data collections — one for expenses and one for the shared fund.

I designed two main data collections — one for expenses and one for the shared fund. The expense collection stores each entry with fields like item name, cost, date, and the user who added it. The fund document tracks the current balance, active month, and previous month spending. This structure keeps expense records separate from fund management, making queries and updates clean and predictable.

Authentication was handled through Google OAuth 2.0 via Firebase Auth. But I did not want just anyone with a Google account to access our mess data. So I implemented an email whitelist — an array of authorized emails that acts as the first security gate.

\`\`\`
const AUTHORIZED_EMAILS = [
    'member1@example.com',
    'member2@example.com',
    'member3@example.com',
    'member4@example.com',
];
\`\`\`

If someone tries to log in with an unauthorized email, they are immediately signed out and shown a clear error message. This prevents random users from accessing or corrupting the group's financial data.

The real-time synchronization is probably the most satisfying part of the project. Using Firestore's onSnapshot listener, the app reacts to database changes instantly. When someone adds an expense from their phone, the dashboard updates on everyone else's screen within milliseconds. No polling, no manual refresh buttons — just clean, real-time data flow.

One of the more complex features was automatic month-change detection. At the start of each new month, the app detects that the month has changed, saves the previous month's total spending, and resets the current month's counter. This happens automatically without any user intervention through a function that compares the stored month key with the current one and updates the database accordingly.

I also built an admin system where I, as the admin, have additional permissions like editing or deleting any expense. Regular members can only modify their own entries. This permission logic runs both on the frontend and through database-level security rules for defense in depth.

The expense form itself handles both creating and editing entries. When a user clicks edit on their own expense, the form switches to edit mode, pre-fills the values, and updates the existing Firestore document instead of creating a new one.

When a user clicks edit, the form switches to edit mode, pre-fills the existing values, and updates the database document instead of creating a new one. For new entries, it writes the item name, cost, added-by info, and timestamp to the collection.

The UI supports two view modes — daily and monthly. In daily mode, expenses are grouped by date with individual item details. In monthly mode, they are aggregated for a broader overview. Users can also download PDF reports for both views, which I built using the jsPDF library with custom headers, tables, and formatting.

For the visual design, I used a dark-themed glassmorphism style with Tailwind CSS. The dashboard shows the current fund balance, total spent, a spending progress bar, and previous month stats — all updating in real time. I used Lucide icons for a clean, modern icon set.

Security was a major focus throughout the project. Beyond the frontend email whitelist, I also wrote database-level security rules that enforce authorization independently. Even if someone bypasses the frontend, they cannot read or write data without being on the approved list. Users can only delete their own expenses, and fund updates are restricted to authorized members only. This multi-layer approach — frontend whitelist, backend rules, and data validation — makes the system genuinely secure, not just superficially protected.

Building Mess Manager taught me how real-world applications work beyond just displaying data. It taught me state management, real-time architecture, authentication flows, permission systems, and the importance of thinking about edge cases before they become bugs. This is not just a project — it is a system that my hostel group actually uses every single day.

— Jyotirmoy Laha
`
    },
    {
        id: 10,
        title: "What Building Mess Manager Actually Taught Me",
        date: "14th February 2026",
        category: "Lessons Learned",
        image: "mess manager.jpg",
        content: `Every project teaches something. But Mess Manager taught me more than I expected because it was not a tutorial project or a practice exercise — it was built to solve a real problem for real people. My hostel group uses it daily, and that level of real-world pressure forced me to think differently about code, design, and responsibility.

The biggest lesson was understanding the difference between code that works and code that is reliable. In the beginning, my expense form worked perfectly when I tested it alone. But when four people started using it simultaneously, small issues appeared — race conditions, duplicate entries, and UI states that did not reset properly. This taught me that real-time multi-user applications behave very differently from single-user prototypes.

\`\`\`
elements.expenseForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = elements.itemName.value;
    const cost = elements.itemCost.value;
    if (!name || !cost) return;

    const btnText = document.getElementById('btn-text');
    btnText.innerText = "Saving...";
});
\`\`\`

Even something as simple as showing "Saving..." on the button was a lesson. Without it, users would click multiple times thinking nothing happened, which caused duplicate records. I learned that UX feedback is not decoration — it is functional communication.

The second major lesson was about security. When I first deployed the app, I only had frontend-level protection. The email whitelist worked great in the browser, but I soon realized that anyone with basic developer tools knowledge could bypass it. That is when I learned about defense in depth — the idea that security must exist at every layer, not just the surface.

I wrote database-level security rules that independently verify authorization. This means even if someone strips away my frontend code, they still cannot read or write data without being on the approved list. The rules enforce that only authenticated and whitelisted users can create, read, update, or delete records — and users can only modify their own entries.

This experience completely changed how I think about security. It is not something you add at the end — it is something you design from the start.

State management was another area where I grew significantly. Mess Manager has a global state object that tracks the user, expenses, fund balance, current month, view mode, edit state, and delete targets. Managing all of these without a framework like React taught me what frameworks actually solve under the hood. Every time the state changes, the UI needs to re-render the right parts. Getting this wrong meant stale data, broken buttons, or missing information. I learned how to think in terms of state transitions — what triggers a change, what depends on that change, and how to keep everything consistent.

Real-time data synchronization was both the most exciting and the most humbling part of the project. Firestore's onSnapshot listeners make it feel magical when one person adds an expense and it instantly appears on everyone else's screen. But handling edge cases — like what happens when the internet drops, or when two people edit at the same time — requires careful thought.

The listener watches the fund document and updates the local state with the current balance, active month, and previous month's spending. But I learned to always provide fallback values and to never assume the database document exists or contains the fields I expect. Defensive programming is not about being paranoid — it is about being realistic.

The month-change detection feature taught me about temporal logic in applications. I had to think about time zones, edge cases around midnight, and what happens when no one opens the app for several days. Building this feature made me appreciate how complex even simple-sounding requirements can become when they interact with real-world conditions.

Working with PDF generation using jsPDF was another eye-opener. I built custom PDF reports with headers, formatted tables, page breaks, and styled footers. This taught me that generating documents programmatically requires pixel-level thinking about layout, spacing, and content overflow.

\`\`\`
function downloadDailyExpensePdf(dayKey, group) {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 40;

    buildPdfHeader(doc, 'Daily Expenses', dayKey);

    items.forEach((expense, index) => {
        if (y > pageHeight - 90) {
            doc.addPage();
            y = 96;
        }
    });
}
\`\`\`

Handling page breaks properly — checking if the current y position would overflow the page height before rendering each row — was a detail I would have never thought about without building it myself.

Perhaps the most valuable lesson was about building for real users. When my friends use the app, they find edge cases I never imagined. Someone tried to add an expense with a cost of zero. Someone else accidentally deleted an entry and wanted it back. Another person opened the app at exactly midnight when the month was changing. Each of these scenarios forced me to add validation, confirmation dialogs, and better error messages.

\`\`\`
function showError(msg, isLogin) {
    if (isLogin) {
        loginErrorText.innerText = msg;
        loginError.classList.remove('hidden');
    } else {
        dashErrorText.innerText = msg;
        dashError.classList.remove('hidden');
    }
}
\`\`\`

Error handling in Mess Manager is not generic — it is contextual. Login errors appear differently from dashboard errors. Success toasts look different from error toasts. This attention to detail makes the app feel polished and trustworthy.

Looking back, Mess Manager transformed me from someone who builds projects to practice coding into someone who builds products to solve problems. The difference is enormous. Practice projects end when the feature works. Real products require you to think about security, reliability, edge cases, performance, user feedback, and long-term maintenance.

Every line of code in this project exists because a real situation demanded it. That is not something any tutorial can teach — it comes from building something that people actually depend on.

— Jyotirmoy Laha
`
    }
];

// --- VIEW SWITCHING LOGIC ---

function switchView(viewName) {
    const portfolio = document.getElementById('portfolio-view');
    const blog = document.getElementById('blog-view');
    
    // Nav Elements
    const desktopPortfolioNav = document.getElementById('desktop-portfolio-nav');
    const desktopBlogNav = document.getElementById('desktop-blog-nav');
    const mobilePortfolioNav = document.getElementById('mobile-portfolio-nav');
    const mobileBlogNav = document.getElementById('mobile-blog-nav');

    // Close mobile menu if open
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
        toggleMenu();
    }

    // Smooth scroll to top via Lenis
    lenis.scrollTo(0, { duration: 0.8 });

    if (viewName === 'blog') {
        // Fade out current view, then swap
        portfolio.style.opacity = '0';
        portfolio.style.transform = 'translateY(12px)';
        setTimeout(() => {
            portfolio.classList.add('view-hidden');
            portfolio.style.opacity = '';
            portfolio.style.transform = '';
            blog.classList.remove('view-hidden');

            // Switch Navigation to Blog Mode
            desktopPortfolioNav.classList.add('hidden');
            desktopBlogNav.classList.remove('hidden');
            mobilePortfolioNav.classList.add('hidden');
            mobileBlogNav.classList.remove('hidden');

            // Re-trigger entrance animation
            blog.style.animation = 'none';
            blog.offsetHeight; // trigger reflow
            blog.style.animation = '';

            setTimeout(() => AOS.refresh(), 100);
        }, 250);
    } else {
        // Fade out current view, then swap
        blog.style.opacity = '0';
        blog.style.transform = 'translateY(12px)';
        setTimeout(() => {
            blog.classList.add('view-hidden');
            blog.style.opacity = '';
            blog.style.transform = '';
            portfolio.classList.remove('view-hidden');

            // Switch Navigation to Portfolio Mode
            desktopBlogNav.classList.add('hidden');
            desktopPortfolioNav.classList.remove('hidden');
            mobileBlogNav.classList.add('hidden');
            mobilePortfolioNav.classList.remove('hidden');

            // Reset Blog to list view when leaving
            showList();

            // Re-trigger entrance animation
            portfolio.style.animation = 'none';
            portfolio.offsetHeight;
            portfolio.style.animation = '';

            setTimeout(() => AOS.refresh(), 100);
        }, 250);
    }
}

function navigateToSection(sectionId) {
    // First ensure we are in portfolio view
    const portfolio = document.getElementById('portfolio-view');
    
    if (portfolio.classList.contains('view-hidden')) {
        switchView('portfolio');
        // Wait for switch then scroll
        setTimeout(() => {
            const element = document.getElementById(sectionId);
            if (element) lenis.scrollTo(element, { duration: 1, offset: -80 });
        }, 150);
    } else {
        // Already in portfolio view, just scroll
        const element = document.getElementById(sectionId);
        if (element) lenis.scrollTo(element, { duration: 1, offset: -80 });
    }
}

// --- BLOG FUNCTIONS ---

function renderList() {
    const grid = document.getElementById('posts-grid');
    if (!grid) return;
    grid.innerHTML = blogPosts.map(post => `
        <article class="group bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-slate-200 shadow-premium hover:shadow-premium-hover hover:-translate-y-1 transition-all duration-300 flex flex-col h-full cursor-pointer" onclick="showDetail(${post.id})">
            <div class="h-36 sm:h-48 bg-slate-100 relative overflow-hidden">
                <img src="${post.image}" alt="${post.title}" class="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700" loading="lazy">
                <div class="absolute top-3 left-3 sm:top-4 sm:left-4 bg-white/90 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-md text-[10px] sm:text-xs font-bold text-slate-600 shadow-sm border border-slate-100">
                    ${post.category}
                </div>
            </div>
            <div class="p-4 sm:p-6 flex-1 flex flex-col">
                <div class="text-[10px] sm:text-xs text-slate-400 mb-2 sm:mb-3 flex items-center gap-2">
                    <i class="fa-regular fa-calendar"></i> ${post.date}
                </div>
                <h2 class="font-display text-base sm:text-xl font-bold text-slate-900 mb-2 sm:mb-3 group-hover:text-accent-primary transition-colors leading-snug">
                    ${post.title}
                </h2>
                <p class="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6 flex-1 line-clamp-3">
                    ${post.content.replace(/```/g, '').substring(0, 100)}...
                </p>
                <div class="inline-flex items-center text-xs sm:text-sm font-semibold text-accent-primary hover:text-blue-700 transition-colors group/link">
                    Read Article <i class="fa-solid fa-arrow-right ml-2 transition-transform group-hover:translate-x-1"></i>
                </div>
            </div>
        </article>
    `).join('');
}

function showDetail(id) {
    const post = blogPosts.find(p => p.id === id);
    if (!post) return;

    // Updated Parsing Logic: Split by triple backticks
    const parts = post.content.split('```');
    let formattedContent = '';
    
    parts.forEach((part, index) => {
        if (index % 2 === 1) {
            // This is a code block
            formattedContent += `<pre class="bg-slate-900 text-blue-200 p-4 sm:p-6 rounded-lg sm:rounded-xl my-4 sm:my-6 font-mono text-xs sm:text-sm overflow-x-auto shadow-inner leading-relaxed border border-slate-700 whitespace-pre-wrap break-words sm:whitespace-pre sm:break-normal">${part.trim()}</pre>`;
        } else {
            // This is regular text
            const lines = part.split('\n');
            lines.forEach(line => {
                const trimmed = line.trim();
                if (trimmed.startsWith('- ')) {
                    // List items
                    formattedContent += `<li class="ml-4 list-disc marker:text-accent-primary">${trimmed.substring(2)}</li>`;
                } else if (trimmed.length > 0) {
                    // Regular paragraphs
                    formattedContent += `<p>${line}</p>`;
                }
            });
        }
    });

    document.getElementById('detail-title').innerText = post.title;
    document.getElementById('detail-date').innerText = post.date;
    document.getElementById('detail-content').innerHTML = formattedContent;

    const blogList = document.getElementById('blog-list');
    const blogDetail = document.getElementById('blog-detail');

    // Fade out list, then show detail
    blogList.style.opacity = '0';
    blogList.style.transform = 'translateY(10px)';
    setTimeout(() => {
        blogList.classList.add('hidden');
        blogList.style.opacity = '';
        blogList.style.transform = '';
        blogDetail.classList.remove('hidden');
        blogDetail.style.opacity = '0';
        blogDetail.style.transform = 'translateY(10px)';
        requestAnimationFrame(() => {
            blogDetail.style.opacity = '1';
            blogDetail.style.transform = 'translateY(0)';
        });
    }, 250);
    lenis.scrollTo(0, { duration: 0.6 });
}

function showList() {
    const blogList = document.getElementById('blog-list');
    const blogDetail = document.getElementById('blog-detail');

    // Fade out detail, then show list
    blogDetail.style.opacity = '0';
    blogDetail.style.transform = 'translateY(10px)';
    setTimeout(() => {
        blogDetail.classList.add('hidden');
        blogDetail.style.opacity = '';
        blogDetail.style.transform = '';
        blogList.classList.remove('hidden');
        blogList.style.opacity = '0';
        blogList.style.transform = 'translateY(10px)';
        requestAnimationFrame(() => {
            blogList.style.opacity = '1';
            blogList.style.transform = 'translateY(0)';
        });
    }, 250);
    lenis.scrollTo(0, { duration: 0.6 });
}

// --- INIT SCRIPTS ---

// ===================== LENIS SMOOTH SCROLL =====================
const lenis = new Lenis({
    duration: 1.0,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 0.7,
    touchMultiplier: 1.2,
    infinite: false,
    lerp: 0.1,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// ===================== SMART NAV HIDE ON SCROLL =====================
(function() {
    const nav = document.querySelector('nav');
    if (!nav) return;
    let lastScroll = 0;
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const currentScroll = window.pageYOffset;
                if (currentScroll <= 10) {
                    nav.style.transform = 'translateY(0) translateZ(0)';
                } else if (currentScroll > lastScroll && currentScroll > 80) {
                    nav.style.transform = 'translateY(-100%) translateZ(0)';
                } else {
                    nav.style.transform = 'translateY(0) translateZ(0)';
                }
                lastScroll = currentScroll;
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
})();

// Initialize AOS with smoother settings
AOS.init({
    once: true,
    offset: 40,
    duration: 700,
    easing: 'ease-out-quart',
    delay: 0,
});

// Mobile Menu Toggle (smooth)
function toggleMenu() {
    const menu = document.getElementById('mobile-menu');
    if (menu.classList.contains('hidden')) {
        menu.classList.remove('hidden');
        menu.style.maxHeight = '0';
        menu.style.opacity = '0';
        requestAnimationFrame(() => {
            menu.style.transition = 'max-height 0.4s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.3s ease';
            menu.style.maxHeight = menu.scrollHeight + 'px';
            menu.style.opacity = '1';
        });
    } else {
        menu.style.transition = 'max-height 0.3s cubic-bezier(0.5, 0, 0.75, 0), opacity 0.2s ease';
        menu.style.maxHeight = '0';
        menu.style.opacity = '0';
        setTimeout(() => {
            menu.classList.add('hidden');
            menu.style.maxHeight = '';
            menu.style.opacity = '';
            menu.style.transition = '';
        }, 350);
    }
}

// ===================== CUSTOM CURSOR =====================
(function initCustomCursor() {
    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    if (!dot || !ring) return;

    // Skip on touch devices
    if (window.matchMedia('(hover: none)').matches) return;

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    let rafId = null;
    let isMoving = false;
    let moveTimeout;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.left = mouseX + 'px';
        dot.style.top = mouseY + 'px';

        // Start ring animation if not running
        if (!isMoving) {
            isMoving = true;
            animateRing();
        }

        // Stop ring animation after mouse is idle for 100ms
        clearTimeout(moveTimeout);
        moveTimeout = setTimeout(() => {
            isMoving = false;
        }, 100);
    }, { passive: true });

    function animateRing() {
        if (!isMoving) {
            // One final snap and stop
            ringX += (mouseX - ringX) * 0.3;
            ringY += (mouseY - ringY) * 0.3;
            ring.style.left = ringX + 'px';
            ring.style.top = ringY + 'px';
            return;
        }
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;
        ring.style.left = ringX + 'px';
        ring.style.top = ringY + 'px';
        requestAnimationFrame(animateRing);
    }

    // Hover effect on interactive elements
    const hoverTargets = document.querySelectorAll('a, button, [role="button"], .group, .project-card, .terminal-card, .social-icon-btn, .profile-img-wrapper');
    hoverTargets.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
        dot.style.opacity = '0';
        ring.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
        dot.style.opacity = '1';
        ring.style.opacity = '1';
    });
})();



// ===================== DARK MODE TOGGLE =====================

// Toggle Dark Mode Function
function toggleDarkMode() {
    const html = document.documentElement;
    const body = document.body;
    const currentMode = html.classList.contains('dark');
    
    // Enable transition only during toggle
    body.classList.add('theme-transitioning');
    
    if (currentMode) {
        html.classList.remove('dark');
        updateDarkModeIcon(false);
        localStorage.setItem('darkMode', 'false');
    } else {
        html.classList.add('dark');
        updateDarkModeIcon(true);
        localStorage.setItem('darkMode', 'true');
    }
    
    // Remove transition class after animation completes
    setTimeout(() => {
        body.classList.remove('theme-transitioning');
    }, 450);
}

// Update Dark Mode Icon (handled via CSS now — no JS icon swap needed)
function updateDarkModeIcon(isDark) {
    // The sliding toggle is fully CSS-driven via the .dark class on <html>.
    // No manual icon class changes required.
}

// Load Dark Mode Preference on Page Load
function loadDarkModePreference() {
    const darkModePreference = localStorage.getItem('darkMode');
    const html = document.documentElement;
    
    // Check for saved preference or system preference
    if (darkModePreference === 'true') {
        html.classList.add('dark');
        updateDarkModeIcon(true);
    } else if (darkModePreference === 'false') {
        html.classList.remove('dark');
        updateDarkModeIcon(false);
    } else {
        // Check system preference if no saved preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            html.classList.add('dark');
            updateDarkModeIcon(true);
            localStorage.setItem('darkMode', 'true');
        }
    }
}

// Initialize Dark Mode on Page Load
loadDarkModePreference();

// Initialize Render
renderList();

// ===================== SCROLL REVEAL (Smooth, one-way like vineet) =====================

(function initScrollReveal() {
    const reveals = document.querySelectorAll('.scroll-reveal');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Once visible, stay visible (like Framer Motion once:true)
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach(el => observer.observe(el));
})();

// ===================== NAVIGATION BUBBLE INDICATOR =====================
(function() {
    const bubble = document.querySelector('.nav-bubble-indicator');
    const navLinks = document.querySelectorAll('.nav-link');
    const logoLink = document.getElementById('logoLink');
    
    if (!bubble || !logoLink) return;
    
    let isHoveringNav = false;
    
    // Function to position bubble on an element
    const positionBubble = (element) => {
        const rect = element.getBoundingClientRect();
        const navContainer = document.querySelector('nav .max-w-6xl');
        const containerRect = navContainer.getBoundingClientRect();
        
        bubble.style.width = `${rect.width + 16}px`; // Add padding
        bubble.style.left = `${rect.left - containerRect.left - 8}px`; // Center with padding
        bubble.classList.add('active');
    };
    
    // Set default position on logo
    const setDefaultPosition = () => {
        if (!isHoveringNav) {
            positionBubble(logoLink);
        }
    };
    
    // Initialize on logo
    setTimeout(() => {
        positionBubble(logoLink);
    }, 100);
    
    // Move bubble on nav link hover
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            isHoveringNav = true;
            positionBubble(this);
        });
        
        link.addEventListener('mouseleave', function() {
            isHoveringNav = false;
            // Return to logo immediately
            setTimeout(() => {
                if (!isHoveringNav) {
                    positionBubble(logoLink);
                }
            }, 50);
        });
    });
    
    // Reposition on window resize
    window.addEventListener('resize', setDefaultPosition);
})();

// ===================== PROFILE IMAGE 3D TILT EFFECT =====================
(function() {
    const profileImage = document.getElementById('profileImage');
    
    if (!profileImage) return;
    
    profileImage.addEventListener('mouseenter', function() {
        this.style.animation = 'none';
        this.style.transition = 'transform 0.2s ease-out, box-shadow 0.2s ease-out';
    });
    
    profileImage.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -12;
        const rotateY = ((x - centerX) / centerX) * 12;
        
        this.style.transform = `
            perspective(1000px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            scale3d(1.05, 1.05, 1.05)
        `;
        
        this.style.boxShadow = `
            ${-rotateY * 2}px ${rotateX * 2}px 40px rgba(34, 211, 238, 0.3),
            0 0 0 1px rgba(34, 211, 238, 0.1)
        `;
    });
    
    profileImage.addEventListener('mouseleave', function() {
        this.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
        this.style.transform = '';
        this.style.boxShadow = '';
        setTimeout(() => {
            this.style.transition = '';
            this.style.animation = '';
        }, 500);
    });
})();
