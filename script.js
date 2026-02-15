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

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (viewName === 'blog') {
        // Show Blog View
        portfolio.classList.add('view-hidden');
        blog.classList.remove('view-hidden');

        // Switch Navigation to Blog Mode
        desktopPortfolioNav.classList.add('hidden');
        desktopBlogNav.classList.remove('hidden');
        mobilePortfolioNav.classList.add('hidden');
        mobileBlogNav.classList.remove('hidden');
        
        // Initialize Blog Components if needed
        setTimeout(() => {
            AOS.refresh();
        }, 100);
    } else {
        // Show Portfolio View
        blog.classList.add('view-hidden');
        portfolio.classList.remove('view-hidden');

        // Switch Navigation to Portfolio Mode
        desktopBlogNav.classList.add('hidden');
        desktopPortfolioNav.classList.remove('hidden');
        mobileBlogNav.classList.add('hidden');
        mobilePortfolioNav.classList.remove('hidden');
        
        // Reset Blog to list view when leaving
        showList();
        
        setTimeout(() => {
            AOS.refresh();
        }, 100);
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
            if (element) element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    } else {
        // Already in portfolio view, just scroll
        const element = document.getElementById(sectionId);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
}

// --- BLOG FUNCTIONS ---

function renderList() {
    const grid = document.getElementById('posts-grid');
    if (!grid) return;
    grid.innerHTML = blogPosts.map(post => `
        <article class="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-premium hover:shadow-premium-hover hover:-translate-y-1 transition-all duration-300 flex flex-col h-full cursor-pointer" onclick="showDetail(${post.id})">
            <div class="h-48 bg-slate-100 relative overflow-hidden">
                <img src="${post.image}" alt="${post.title}" class="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700">
                <div class="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-md text-xs font-bold text-slate-600 shadow-sm border border-slate-100">
                    ${post.category}
                </div>
            </div>
            <div class="p-6 flex-1 flex flex-col">
                <div class="text-xs text-slate-400 mb-3 flex items-center gap-2">
                    <i class="fa-regular fa-calendar"></i> ${post.date}
                </div>
                <h2 class="font-display text-xl font-bold text-slate-900 mb-3 group-hover:text-accent-primary transition-colors">
                    ${post.title}
                </h2>
                <p class="text-slate-600 text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
                    ${post.content.replace(/```/g, '').substring(0, 100)}...
                </p>
                <div class="inline-flex items-center text-sm font-semibold text-accent-primary hover:text-blue-700 transition-colors group/link">
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
            formattedContent += `<pre class="bg-slate-900 text-blue-200 p-6 rounded-xl my-6 font-mono text-sm overflow-x-auto shadow-inner leading-relaxed border border-slate-700">${part.trim()}</pre>`;
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

    document.getElementById('blog-list').classList.add('hidden');
    document.getElementById('blog-detail').classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showList() {
    document.getElementById('blog-detail').classList.add('hidden');
    document.getElementById('blog-list').classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- INIT SCRIPTS ---

// Initialize AOS
AOS.init({
    once: true,
    offset: 50,
    duration: 1000,
    easing: 'ease-out-cubic',
});

// Mobile Menu Toggle
function toggleMenu() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
}

// Particles Config (Header)
particlesJS("particles-js", {
    "particles": {
        "number": { "value": 30, "density": { "enable": true, "value_area": 800 } },
        "color": { "value": "#94a3b8" },
        "shape": { "type": "circle" },
        "opacity": { "value": 0.3, "random": false },
        "size": { "value": 2, "random": true },
        "line_linked": { 
            "enable": true, 
            "distance": 150, 
            "color": "#cbd5e1",
            "opacity": 0.4, 
            "width": 1 
        },
        "move": { "enable": true, "speed": 1, "direction": "none", "random": false, "straight": false, "out_mode": "out", "bounce": false }
    },
    "interactivity": {
        "detect_on": "canvas",
        "events": { "onhover": { "enable": true, "mode": "grab" }, "onclick": { "enable": false }, "resize": true },
        "modes": { "grab": { "distance": 140, "line_linked": { "opacity": 0.8 } } }
    },
    "retina_detect": true
});

// Particles Config (Blog Background)
particlesJS("blog-particles", {
    "particles": {
        "number": { "value": 20 },
        "color": { "value": "#94a3b8" },
        "shape": { "type": "circle" },
        "opacity": { "value": 0.3 },
        "size": { "value": 3 },
        "move": { "enable": true, "speed": 1 }
    }
});



// ===================== DARK MODE TOGGLE =====================

// Toggle Dark Mode Function
function toggleDarkMode() {
    const html = document.documentElement;
    const currentMode = html.classList.contains('dark');
    
    if (currentMode) {
        // Switch to light mode
        html.classList.remove('dark');
        updateDarkModeIcon(false);
        localStorage.setItem('darkMode', 'false');
    } else {
        // Switch to dark mode
        html.classList.add('dark');
        updateDarkModeIcon(true);
        localStorage.setItem('darkMode', 'true');
    }
}

// Update Dark Mode Icon
function updateDarkModeIcon(isDark) {
    const desktopIcon = document.getElementById('darkModeIcon');
    const mobileIcon = document.getElementById('mobileDarkModeIcon');
    
    if (isDark) {
        // Show sun icon for light mode option
        desktopIcon.classList.remove('fa-moon');
        desktopIcon.classList.add('fa-sun');
        mobileIcon.classList.remove('fa-moon');
        mobileIcon.classList.add('fa-sun');
    } else {
        // Show moon icon for dark mode option
        desktopIcon.classList.remove('fa-sun');
        desktopIcon.classList.add('fa-moon');
        mobileIcon.classList.remove('fa-sun');
        mobileIcon.classList.add('fa-moon');
    }
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

// ===================== SCROLL REVEAL (Storytelling Effect) =====================

(function initScrollReveal() {
    const reveals = document.querySelectorAll('.scroll-reveal');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                entry.target.classList.remove('fade-out');
            } else {
                // Only fade out if element is above the viewport (scrolled past)
                const rect = entry.boundingClientRect;
                if (rect.top < 0) {
                    entry.target.classList.add('fade-out');
                    entry.target.classList.remove('active');
                } else {
                    // Below viewport — reset to initial hidden state
                    entry.target.classList.remove('active', 'fade-out');
                }
            }
        });
    }, {
        threshold: 0.15
    });

    reveals.forEach(el => observer.observe(el));
})();
