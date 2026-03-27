/* =========================================================
   BLOG POSTS DATA
   =========================================================*/

const blogPosts = [
    {
        id: 1,
        title: "Why I Focus More on Thinking Than Just Writing Code",
        date: "03 December 2025",
        category: "Philosophy",
        image: "jakub-zerdzicki-WD7S-Lz12Es-unsplash.jpg",
        content: `There's a common trap that new developers fall into - the rush to start typing code the moment an idea clicks. I used to do the same thing. Open a blank file, start writing HTML, throw in some JavaScript, and hope it all comes together. But over time, I realized the best code I ever wrote started without a keyboard. It started with thinking.

Before I write a single line, I ask myself: what is this supposed to do? Who is it for? What could go wrong? This habit changed everything. When I built my portfolio, I didn't jump into CSS right away. I first mapped out what sections I needed, what the user flow would look like, and how the navigation should feel. Only after that mental model was clear did I start coding.

One principle I follow now is keeping functions small and focused. Each function should do one thing well:

\`\`\`
function toggleMenu() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
}
\`\`\`

This function does exactly one thing - it toggles the mobile menu. No side effects, no hidden logic. When something breaks, I know exactly where to look. Compare this to a 50-line function doing menu toggling, theme switching, and animation all at once - debugging that becomes a nightmare.

Breaking big problems into smaller parts is another thinking habit that pays off. When I needed to set up animations across my portfolio, I didn't hardcode each one. I configured a library once with clear, predictable settings:

\`\`\`
AOS.init({
    once: true,
    offset: 50,
    duration: 1000,
    easing: 'ease-out-cubic',
});
\`\`\`

The \`once: true\` flag ensures animations play only on first scroll - a deliberate decision to keep the page feeling polished without unnecessary re-triggers. That single config line saved me from performance issues I would have spent hours debugging.

I also try to write logic that is self-explanatory. Future-me should be able to open the file six months later and immediately understand what's happening:

\`\`\`
if (items.length === 0) {
    showEmptyState();
} else {
    renderItems(items);
}
\`\`\`

No cryptic variable names, no clever one-liners that sacrifice readability for brevity. The intent is clear: if there's nothing to show, display an empty state. Otherwise, render the items.

I build projects to sharpen my thinking, not just to fill a GitHub profile. Every project I've worked on - my portfolio, my weather app, my resume analyzer - taught me something new about how to approach problems. And every time, the lesson was the same: slow down, think first, then code.

I'm still learning. And that's not a weakness - it's the whole point.`
    },
    {
        id: 2,
        title: "How I Built My Portfolio Website",
        date: "05 December 2025",
        category: "Project Breakdown",
        image: "nick-morrison-FHnnjk1Yj7Y-unsplash.jpg",
        content: `Every developer needs a portfolio, but building one that actually represents you is harder than it sounds. I didn't want a generic template with placeholder text. I wanted something that reflected how I think - clean, intentional, and built from scratch.

Before writing any code, I defined the purpose: this site should communicate who I am as a developer, showcase my projects, and host my blog - all without overwhelming the visitor. Simplicity was the guiding principle from day one.

For the tech stack, I chose HTML, Tailwind CSS, JavaScript, and AOS (Animate On Scroll). No React, no frameworks. This was a deliberate decision - I wanted to strengthen my fundamentals and prove that you don't need a complex stack to build something professional.

The navigation was one of the first things I built. On mobile, I needed a toggle menu that felt responsive without being janky:

\`\`\`
function toggleMenu() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
}
\`\`\`

Simple, fast, and predictable. Tailwind's \`hidden\` utility class made this seamless - no custom CSS animations fighting with JavaScript state.

Animations were something I spent a lot of time getting right. I wanted them to feel smooth and professional, not distracting. AOS gave me the control I needed:

\`\`\`
AOS.init({
    once: true,
    offset: 50,
    duration: 1000,
    easing: 'ease-out-cubic',
});
\`\`\`

Setting \`once: true\` was an important decision. Without it, elements would re-animate every time the user scrolled up and down, which felt chaotic. With it, each section reveals once and stays visible - much more polished.

One of the bigger challenges was building the blog system. Instead of using a CMS or external service, I hardcoded the blog posts as a JavaScript array and built a custom renderer. The blog view switches dynamically between a card grid and a full article view - all handled with vanilla JS and DOM manipulation. This approach keeps the site self-contained and fast, with zero external dependencies for content.

Dark mode was another detail I integrated carefully. Instead of a simple toggle that just swaps colors, I made sure the transitions felt smooth and that every component - from cards to code blocks to navigation - respected the theme consistently.

The design philosophy was always the same: every visual decision should serve the content. No decorative elements that don't have a purpose. No animations that slow things down. No colors that distract.

This project taught me three things. First, planning saves time - mapping out sections before coding prevented multiple redesigns. Second, simplicity is a feature, not a limitation. Third, building something yourself, even when templates exist, gives you a level of understanding and confidence that nothing else can.`
    },
    {
        id: 3,
        title: "Mistakes I Made While Building My Portfolio Website",
        date: "07 December 2025",
        category: "Reflection",
        image: "kevin-ku-w7ZyuGYNpRQ-unsplash.jpg",
        content: `If you looked at my portfolio today, you'd see a clean, minimal website that works smoothly. What you wouldn't see is the messy process behind it - the wrong decisions, the wasted hours, and the lessons that only came through failure. Here are the biggest mistakes I made and what I learned from each one.

My first and biggest mistake was designing before I had content. I spent days picking color palettes, adjusting font sizes, and tweaking layouts - all before I'd written the actual text for my sections. The result? When I finally added real content, half the design didn't work. Paragraphs were too long for the cards I'd designed. Section headings didn't fit the spacing I'd chosen. I ended up redesigning almost everything. The lesson was clear: content first, design second. Always.

I also tried to build the entire website in one marathon session. I thought I could go from zero to deployed in a single sitting. Instead, I ended up with tangled code, duplicated styles, and a CSS file that made no sense by hour six. Breaking the project into focused sessions - navigation one day, hero section the next, blog system after that - made the code cleaner and the process less exhausting.

At one point, I went overboard with visual effects. I added scroll animations on every element, hover transitions on every card, and subtle parallax effects. It looked impressive on my high-end laptop. On a mid-range phone, the site stuttered and lagged. I had to strip most of the extra effects back and focus on what truly matters for performance and user experience.

Variable naming was another area where I stumbled early on. I used names like \`x\`, \`temp\`, \`el1\`, and \`btn2\` - names that made sense at 2 AM but were completely cryptic two weeks later. When I came back to fix a bug, I couldn't tell which element was which. I started being deliberate about naming:

\`\`\`
function toggleMenu() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
}
\`\`\`

\`toggleMenu\`, \`mobile-menu\`, \`hidden\` - every name tells you exactly what it does. Debugging became significantly faster after this shift.

Perhaps my most costly mistake was underestimating mobile users. I built the entire site on a desktop monitor and only tested mobile responsiveness near the end. By that point, the hero section was overflowing, the navigation was unusable on small screens, and images were loading at full desktop resolution on phones. Fixing all of that required significant restructuring. Now I check mobile at every step, not just at the end.

I also spent too long chasing perfection. I delayed sharing the site for weeks because the blog section wasn't "polished enough" or the dark mode transition wasn't "smooth enough." The truth is, a portfolio is a living document. It evolves as you grow. Waiting for perfection is just a form of procrastination.

The biggest takeaway from all these mistakes: a portfolio doesn't need to be perfect. It needs to be honest, functional, and evolving. Ship it, learn from the feedback, and keep improving.`
    },
    {
        id: 4,
        title: "How I Built My Weather App (J.SkyCast)",
        date: "10 December 2025",
        category: "Project Breakdown",
        image: "dawn-patrol-surf-tracking-nV8Hc0VZA1w-unsplash.jpg",
        content: `J.SkyCast wasn't supposed to be just another weather app. I wanted to build something that felt premium - glassmorphism UI, dynamic sky backgrounds, live air quality data, and a sunrise arc visualization. All with zero frameworks. Just HTML, CSS, and vanilla JavaScript.

The idea was simple: type a city name or tap the location button, and get a beautiful, data-rich weather dashboard. But the execution required solving some genuinely interesting problems.

The foundation of the app is a single async function that fetches weather data from WeatherAPI. I used their forecast endpoint to get current conditions, a multi-day forecast, and air quality data in one API call:

\`\`\`
async function fetchWeather(query) {
    showLoading('Scanning satellite data…');
    try {
        const res = await fetch(
            \`https://api.weatherapi.com/v1/forecast.json?key=\${API_KEY}&q=\${encodeURIComponent(query)}&days=7&aqi=yes\`
        );
        if (!res.ok) throw new Error('Failed to fetch weather data.');
        const data = await res.json();
        updateUI(data);
        showContent();
    } catch (err) {
        showError(err.message);
    }
}
\`\`\`

A few things to notice here. The query is encoded with \`encodeURIComponent\` to handle city names with spaces or special characters. The loading state appears instantly so the user knows something is happening. And the entire flow is wrapped in try-catch because network requests can fail in a hundred different ways.

For API key management, I took security seriously. The key is stored in a separate \`config.js\` file that's git-ignored, with a \`config.example.js\` template for contributors. This way, the actual key never touches the repository.

The search system handles both text queries and geolocation. The form submission is straightforward:

\`\`\`
searchForm.addEventListener('submit', e => {
    e.preventDefault();
    const city = searchInput.value.trim();
    if (city) {
        fetchWeather(city);
        searchInput.blur();
    }
});
\`\`\`

For live location, I used the Geolocation API with proper error handling for denied permissions, unavailable positions, and timeouts:

\`\`\`
locationBtn.addEventListener('click', () => {
    if (!navigator.geolocation) {
        showError('Geolocation is not supported by this browser.');
        return;
    }
    showLoading('Acquiring coordinates…');
    navigator.geolocation.getCurrentPosition(
        pos => fetchWeather(\`\${pos.coords.latitude},\${pos.coords.longitude}\`),
        err => {
            const msgs = {
                [err.PERMISSION_DENIED]: 'Location permission denied.',
                [err.POSITION_UNAVAILABLE]: 'Location information unavailable.',
                [err.TIMEOUT]: 'Location request timed out.',
            };
            showError(msgs[err.code] || 'Location access denied.');
        }
    );
});
\`\`\`

This maps each specific geolocation error code to a human-readable message. No vague "something went wrong" - the user always knows exactly what happened.

One of the features I'm most proud of is the dynamic background system. The app fetches high-quality Unsplash images based on the current weather condition. I built a mapping system that matches condition text to the right atmosphere:

\`\`\`
function getWeatherImageUrl(conditionText, isDay) {
    const c = conditionText.toLowerCase();
    if (c.includes('thunder') || c.includes('storm'))
        return WEATHER_IMAGES.thunderstorm;
    if (c.includes('rain') || c.includes('drizzle'))
        return WEATHER_IMAGES.rain;
    if (c.includes('sunny') || c.includes('clear'))
        return isDay ? WEATHER_IMAGES.clear_day : WEATHER_IMAGES.clear_night;
    return WEATHER_IMAGES.default;
}
\`\`\`

The \`isDay\` parameter is key - a clear sky at noon shows a bright blue background, but at midnight it switches to a starry night. Small detail, but it makes the app feel alive.

The hero section also generates contextual headlines and descriptions. Instead of just showing "Sunny," the app displays "Bright & Clear Sky" with a description like "Sky conditions look perfect today with 28°C temperatures." Each weather condition has its own copy, making the dashboard feel more like a weather broadcast than a data table.

For the forecast, I built an SVG temperature graph that renders dynamically. It calculates x/y coordinates from the temperature data and draws smooth Bezier curves between the points:

\`\`\`
function renderForecastGraph(temps) {
    const svg = document.getElementById('forecastGraph');
    const W = svg.parentElement.offsetWidth || 600;
    const H = 44;
    const min = Math.min(...temps);
    const max = Math.max(...temps);
    const range = (max - min) || 1;

    const xs = temps.map((_, i) => {
        const colW = W / temps.length;
        return colW * i + colW / 2;
    });
    const ys = temps.map(t =>
        H - ((t - min) / range) * (H - 10) - 5
    );
    // Smooth Bezier curves between points
}
\`\`\`

The air quality section uses the EPA index standard with a color-coded system that goes from green ("Good") to red ("Hazardous"), showing pollutant levels for CO, NO2, and O3.

The entire layout uses a CSS Grid three-column structure - a narrow left sidebar for navigation, a central hero panel for the main display, and a right sidebar for detailed weather cards. On mobile, it collapses responsively using breakpoints at 900px and 640px.

The design system is built on glassmorphism - frosted-glass card effects using \`backdrop-filter: blur()\` with semi-transparent backgrounds. Every card, every stat, every button uses this consistent visual language.

This project taught me more than any tutorial could. I learned how to work with real APIs, manage application state across loading/content/error views, build responsive layouts with CSS Grid, and create data visualizations with SVG. Most importantly, I learned that building something that feels premium doesn't require a premium tech stack - it requires attention to detail.`
    },
    {
        id: 5,
        title: "Mistakes I Made While Building This Weather App",
        date: "12 December 2025",
        category: "Development",
        image: "image-3.jpeg",
        content: `When people use J.SkyCast, they see a polished glassmorphism dashboard with dynamic backgrounds and smooth transitions. What they don't see is the trail of bugs, bad assumptions, and frustrating debugging sessions that shaped the final product. Every mistake taught me something I couldn't have learned from a tutorial.

The first major mistake was trusting the API blindly. I assumed that if I sent a valid city name, I'd always get valid data back. In reality, APIs fail for dozens of reasons - network timeouts, rate limits, misspelled city names, expired keys. My initial code had no error handling at all, which meant the app would silently break and show a blank screen. The fix was straightforward but essential:

\`\`\`
if (!res.ok) {
    let msg = 'Failed to fetch weather data.';
    try {
        const err = await res.json();
        msg = err.error.message;
    } catch {
        msg = \`Error \${res.status}: \${res.statusText}\`;
    }
    throw new Error(msg);
}
\`\`\`

This code tries to extract a meaningful error message from the API response. If even that fails, it falls back to the HTTP status code. The user always gets a clear explanation of what went wrong - not a blank screen or a cryptic console error.

My second mistake was not showing a loading state from the very first moment. When a user searched for a city, the app would sit there doing nothing for one to three seconds while the API responded. No spinner, no text, no feedback. Users thought the app was broken. Adding a loading state with contextual messages fixed this completely:

\`\`\`
function showLoading(text) {
    if (text) loadingText.textContent = text;
    loader.classList.remove('hidden');
    weatherContent.classList.add('hidden');
    errorDiv.classList.add('hidden');
}
\`\`\`

Now the app shows "Scanning satellite data..." during fetch and "Acquiring coordinates..." during geolocation. I learned that UX isn't just about what you show - it's about what happens in the gaps between actions.

The geolocation handling was another disaster early on. I called \`navigator.geolocation.getCurrentPosition\` with only a success callback and completely ignored the error case. When a user denied location permission, the app threw an unhandled error. The fix required mapping each possible failure to a specific message:

\`\`\`
navigator.geolocation.getCurrentPosition(
    pos => fetchWeather(\`\${pos.coords.latitude},\${pos.coords.longitude}\`),
    err => {
        const msgs = {
            [err.PERMISSION_DENIED]: 'Location permission denied.',
            [err.POSITION_UNAVAILABLE]: 'Location information unavailable.',
            [err.TIMEOUT]: 'Location request timed out.',
        };
        showError(msgs[err.code] || 'Location access denied.');
    }
);
\`\`\`

Permission denied, position unavailable, and timeout each get their own message. This taught me a critical lesson: never assume users will grant permissions, and always plan for the "no" path.

I also went overboard with the background system initially. My first version had complex logic with multiple image sources, CSS transitions, gradient overlays, and animated weather effects all fighting for attention. The page loaded slowly and the transitions looked choppy. I simplified the approach to a clean condition-to-image mapping:

\`\`\`
function getWeatherImageUrl(conditionText, isDay) {
    const c = conditionText.toLowerCase();
    if (c.includes('thunder') || c.includes('storm'))
        return WEATHER_IMAGES.thunderstorm;
    if (c.includes('rain') || c.includes('drizzle'))
        return WEATHER_IMAGES.rain;
    if (c.includes('sunny') || c.includes('clear'))
        return isDay ? WEATHER_IMAGES.clear_day : WEATHER_IMAGES.clear_night;
    return WEATHER_IMAGES.default;
}
\`\`\`

A simple cascade of string checks. Readable, fast, and easy to extend. The previous version was three times longer and half as reliable.

Another mistake was the state management between loading, content, and error views. Early on, I was toggling CSS classes inconsistently - sometimes the error message would appear on top of the weather data, or the loader would stay visible after content loaded. I eventually created three clear state functions that each guarantee a clean transition:

\`\`\`
function showError(message) {
    loader.classList.add('hidden');
    weatherContent.classList.add('hidden');
    errorDiv.classList.remove('hidden');
    errorMessage.textContent = message;
}
\`\`\`

Each function hides everything else before revealing its own view. No overlap, no stale state, no visual bugs. Simple state management without any frameworks.

I also waited far too long to test on mobile. The three-column CSS Grid layout looked perfect on desktop but was completely broken on smaller screens. I had to add responsive breakpoints at 900px and 640px to collapse the layout gracefully. That restructuring would have been trivial if I'd planned for mobile from the start.

Finally, I spent weeks trying to make the app "perfect" before showing it to anyone. I kept adding features, polishing animations, tweaking colors. In hindsight, I should have deployed a basic version early and iterated based on real usage. The features I was most proud of weren't even the ones users noticed most - they cared about speed and accuracy, not fancy SVG graphs.

The biggest lesson from this project: ship early, handle errors gracefully, and always design for the user who says "no" to your permissions dialog.`
    },
    {
        id: 6,
        title: "How AI Helps Me Build Better Websites",
        date: "15 December 2025",
        category: "Workflow",
        image: "igor-omilaev-FHgWFzDDAOs-unsplash.jpg",
        content: `When people hear "AI in web development," they imagine a robot writing entire websites from a prompt. That's not how I use AI. For me, AI is a thinking partner - it helps me reason through problems, spot blind spots, and learn faster. I still design, code, and debug everything myself. AI just makes that process sharper.

The biggest way AI helps me is during the planning phase. When I'm starting a new feature, I often know what I want but not exactly how to approach it. Take my weather app's error handling system, for example. I knew I needed to handle API failures, but AI helped me think through all the edge cases I'd have missed: expired keys, rate limits, malformed responses, network timeouts. Instead of discovering these in production, I planned for them upfront.

AI also helps me write cleaner code. Not by writing it for me, but by showing me patterns I didn't know existed. When I was building conditional UI logic, I used to write verbose null checks everywhere. AI introduced me to optional chaining, which changed how I handle uncertain data:

\`\`\`
if (items?.length) {
    showItems();
}
\`\`\`

This single line safely checks if \`items\` exists and has entries. Before learning this pattern, I would have written three separate checks. The logic is identical, but the code is more concise and readable.

Debugging is another area where AI genuinely accelerates my workflow. When I hit an error, I don't just ask AI to fix it - I ask it to explain why the error happened. When my weather app's geolocation feature was silently failing, AI helped me understand that \`getCurrentPosition\` requires an explicit error callback, and that different browsers handle permission denial differently. That context turned a confusing bug into a clear fix and taught me something I'll remember for every future project.

Learning new concepts is where AI shines the most. When I was integrating my first weather API, I didn't fully understand async/await, CORS, or how to properly encode URL parameters. Instead of spending hours reading documentation that assumed I already knew the prerequisites, I could ask AI to explain these concepts in the context of what I was actually building. It explained that \`encodeURIComponent\` prevents city names with spaces from breaking the URL, why \`await\` only works inside \`async\` functions, and how try-catch blocks work with Promises. Each explanation was tied to my real code, which made the learning stick.

AI also improved my thinking about UI and UX. Before AI, I would build features that worked technically but felt incomplete. AI taught me to ask questions like: What happens while data is loading? What does the user see if the request fails? What if the user clicks the button twice? These questions led to real improvements - loading states with contextual messages, proper error displays, and input validation that prevents duplicate requests.

Beyond code, AI helps me write better content. These blog posts, project descriptions, and documentation all benefit from AI's ability to help me organize my thoughts and express ideas more clearly. But the ideas themselves are always mine - AI doesn't know what I built, what mistakes I made, or what lessons I learned. It just helps me communicate those experiences more effectively.

There's an important distinction I want to make. AI doesn't replace learning - it accelerates it. I still read documentation, study other people's code, and solve problems on my own first. AI is the tool I reach for when I'm stuck, when I want a second opinion, or when I'm trying to understand a concept that documentation explains poorly.

I've seen developers on both extremes: those who refuse to use AI because they think it's "cheating," and those who use AI for everything without understanding the output. Both approaches miss the point. AI is most powerful when you already understand the fundamentals and use it to push your boundaries further. It's a power tool, not a replacement for skill.

The way I see it: AI helps me build better websites faster. But it's my understanding, my design decisions, and my debugging skills that make those websites actually work.`
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
    },
    {
        id: 11,
        title: "How I Use Groq API as a Free AI Tool in My Projects",
        date: "27th March 2026",
        category: "Workflow",
        image: "groq.jpg",
        content: `Most tutorials about adding AI to your projects assume you have money to spend. OpenAI charges per token. Gemini has rate limits that kick in fast on free tiers. When I was looking for a way to integrate AI into my projects without a credit card, I found Groq — and it changed how I think about AI in development.

Groq offers a free API tier that gives you access to models like LLaMA 3 and Mixtral with genuinely fast inference speeds. No billing setup required to start. For a student developer building side projects, this is as good as it gets.

The API follows the same structure as OpenAI's — so if you've seen one, the other feels familiar immediately. Here's the core pattern I use in Python:

\`\`\`python
from groq import Groq

client = Groq(api_key="your_api_key_here")

def ask_groq(prompt):
    response = client.chat.completions.create(
        model="llama3-8b-8192",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=500
    )
    return response.choices[0].message.content
\`\`\`

This is clean, minimal, and works immediately after a pip install groq. I use this exact function for AI-assisted scripts, content generation experiments, and testing ideas before committing to a bigger build.

You can also call it directly via HTTP without installing any SDK — useful when you're inside an environment where installing packages is inconvenient:

\`\`\`python
import requests

def ask_groq_raw(prompt, api_key):
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    body = {
        "model": "llama3-8b-8192",
        "messages": [{"role": "user", "content": prompt}],
        "max_tokens": 500
    }
    response = requests.post(
        "https://api.groq.com/openai/v1/chat/completions",
        headers=headers,
        json=body
    )
    data = response.json()
    return data["choices"][0]["message"]["content"]
\`\`\`

A few things worth explaining here. The model llama3-8b-8192 is fast, lightweight, and free on Groq's tier. I cap max_tokens depending on the use case — shorter for quick responses, higher for detailed analysis. I always check that the response structure exists before accessing nested keys, because API responses can be unpredictable when something goes wrong.

One important habit I developed early: never hardcode your API key. I store it in a .env file and load it with python-dotenv:

\`\`\`python
from dotenv import load_dotenv
import os

load_dotenv()
api_key = os.getenv("GROQ_API_KEY")
\`\`\`

Groq's free keys are rate-limited, and if yours leaks publicly on GitHub, someone else will burn through your quota fast.

I also use Groq with a system prompt when I need the AI to behave in a specific way — like acting as a resume reviewer or a code explainer:

\`\`\`python
response = client.chat.completions.create(
    model="llama3-8b-8192",
    messages=[
        {"role": "system", "content": "You are a helpful career advisor. Be concise and direct."},
        {"role": "user", "content": prompt}
    ],
    max_tokens=500
)
\`\`\`

The system prompt shapes the entire personality and focus of the response. Without it, the model answers too broadly. With it, responses become targeted and useful.

The biggest thing Groq taught me is that AI integration does not have to be expensive or complicated. The free tier is genuinely usable for real projects, not just toy demos. The inference speed is faster than most alternatives I've tried, and the model quality is more than sufficient for content tools, analyzers, or development assistance.

If you're a student developer who keeps avoiding AI features because of cost — start with Groq. The barrier is lower than you think.

— Jyotirmoy Laha
`
    }
];
