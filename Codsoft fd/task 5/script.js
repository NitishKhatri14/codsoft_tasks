
document.addEventListener("DOMContentLoaded", function () {
    const homePage = document.getElementById("homePage");
    const articlePage = document.getElementById("articlePage");
    const featuredPost = document.getElementById("featuredPost");
    const articleGrid = document.getElementById("articleGrid");
    const articleContent = document.getElementById("articleContent");
    const relatedGrid = document.getElementById("relatedGrid");

    const searchInput = document.getElementById("searchInput");
    const categoryList = document.getElementById("categoryList");
    const tagList = document.getElementById("tagList");
    const loadMoreBtn = document.getElementById("loadMoreBtn");
    const resultCount = document.getElementById("resultCount");
    const noResults = document.getElementById("noResults");

    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");
    const themeToggle = document.getElementById("themeToggle");

    const commentForm = document.getElementById("commentForm");
    const commentName = document.getElementById("commentName");
    const commentText = document.getElementById("commentText");
    const commentList = document.getElementById("commentList");
    const commentCount = document.getElementById("commentCount");
    const commentStatus = document.getElementById("commentStatus");

    const PAGE_SIZE = 6;
    const COMMENTS_KEY = "inkSpaceComments";
    const THEME_KEY = "inkSpaceTheme";

    let selectedCategory = "All";
    let selectedTag = "All";
    let visibleCount = PAGE_SIZE;
    let currentArticleId = null;

    // Demo articles. Replace these with your own blog content.
    const posts = [
        {
            id: "ai-everyday",
            title: "How Artificial Intelligence Is Changing Everyday Life",
            category: "Technology",
            tags: ["AI", "Innovation", "Technology"],
            date: "2026-09-18",
            author: "Alex Morgan",
            readTime: "6 min read",
            featured: true,
            image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=85",
            excerpt: "From smart assistants to personalized learning, discover how AI is quietly transforming the way we live and work.",
            body: [
                {
                    heading: "AI is closer than you think",
                    text: "Artificial intelligence is no longer limited to research laboratories or science fiction. It helps organize our schedules, recommend music, translate languages, and make digital services easier to use. Many of these changes happen quietly in the background."
                },
                {
                    heading: "A new way to learn and work",
                    text: "AI-powered tools can help people brainstorm ideas, summarize information, practice new skills, and automate repetitive tasks. Used thoughtfully, these tools can give us more time to focus on creativity, collaboration, and problem-solving."
                },
                {
                    heading: "Use it thoughtfully",
                    text: "AI systems can make mistakes, reflect biases, or handle personal information in unexpected ways. Verify important information, protect sensitive data, and use your own judgment when making decisions."
                },
                {
                    heading: "Looking ahead",
                    text: "The most useful future is not one in which technology replaces human curiosity, but one in which it supports it. Understanding both the benefits and limitations of AI helps us make better choices about the tools we use."
                }
            ]
        },
        {
            id: "mindful-mornings",
            title: "The Art of Building a Mindful Morning Routine",
            category: "Lifestyle",
            tags: ["Wellness", "Habits", "Balance"],
            date: "2026-09-14",
            author: "Sophia Lee",
            readTime: "5 min read",
            image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1000&q=85",
            excerpt: "Create a calmer start to your day with small, practical habits that support focus and well-being.",
            body: [
                {
                    heading: "Start with a little space",
                    text: "A mindful morning does not need to begin at an unusually early hour. Give yourself a few quiet minutes before opening messages or checking social media. A slower start can make the day feel less rushed."
                },
                {
                    heading: "Choose simple habits",
                    text: "Drink some water, stretch gently, open a window, or write down one thing you want to accomplish. Small routines are easier to repeat than ambitious schedules that leave no room for real life."
                },
                {
                    heading: "Make the routine your own",
                    text: "There is no universal morning routine. Experiment with a few habits, notice what helps you feel prepared, and keep the practices that genuinely suit your schedule."
                }
            ]
        },
        {
            id: "creative-block",
            title: "Finding Your Creativity When Inspiration Runs Dry",
            category: "Creativity",
            tags: ["Design", "Creativity", "Learning"],
            date: "2026-09-10",
            author: "Jamie Carter",
            readTime: "7 min read",
            image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1000&q=85",
            excerpt: "Practical ways to get unstuck, experiment with ideas, and rediscover the joy of making things.",
            body: [
                {
                    heading: "Create before you judge",
                    text: "Creative blocks often grow when every early idea has to be perfect. Try making a rough draft, sketching freely, or writing for ten minutes without editing. Give yourself permission to produce something unfinished."
                },
                {
                    heading: "Change your inputs",
                    text: "Read outside your usual interests, take a walk, visit a new place, or talk to someone with a different perspective. Fresh experiences can introduce connections that you might not find by repeating the same routine."
                },
                {
                    heading: "Build a repeatable practice",
                    text: "Inspiration is unpredictable, but a small creative habit is something you can schedule. Consistent practice helps ideas develop even on days when motivation is low."
                }
            ]
        },
        {
            id: "deep-work",
            title: "Deep Work: Doing More by Focusing on Less",
            category: "Productivity",
            tags: ["Focus", "Learning", "Habits"],
            date: "2026-09-06",
            author: "Daniel Brooks",
            readTime: "6 min read",
            image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1000&q=85",
            excerpt: "Learn how focused work sessions, fewer distractions, and realistic priorities can improve your day.",
            body: [
                {
                    heading: "Protect your attention",
                    text: "Switching between tasks repeatedly can make demanding work feel harder. Choose one meaningful task, silence unnecessary notifications, and keep unrelated browser tabs out of sight while you work."
                },
                {
                    heading: "Work in manageable sessions",
                    text: "Start with a focused session that fits your energy and schedule. Take a short break afterward, then decide whether another session makes sense. Sustainable concentration is more useful than constant exhaustion."
                },
                {
                    heading: "Measure progress, not busyness",
                    text: "A full calendar does not necessarily mean important work is getting done. Identify the outcome that matters most and use it to decide which tasks deserve your attention."
                }
            ]
        },
        {
            id: "web-design",
            title: "The Design Principles Behind Beautiful Websites",
            category: "Technology",
            tags: ["Design", "Web Development", "Creativity"],
            date: "2026-09-02",
            author: "Taylor Reed",
            readTime: "8 min read",
            image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1000&q=85",
            excerpt: "Explore visual hierarchy, whitespace, typography, and the details that make websites easier to use.",
            body: [
                {
                    heading: "Give every element a purpose",
                    text: "Good web design helps visitors understand what matters first. Clear headings, readable text, consistent spacing, and obvious actions create an interface that feels easier to navigate."
                },
                {
                    heading: "Use whitespace intentionally",
                    text: "Empty space is not wasted space. It separates ideas, improves readability, and gives important content room to stand out. A layout does not need to fill every available pixel."
                },
                {
                    heading: "Design for real people",
                    text: "A beautiful interface should also work with keyboards, screen readers, small screens, and different input methods. Accessibility and responsive design are essential parts of a complete user experience."
                }
            ]
        },
        {
            id: "digital-wellness",
            title: "Digital Wellness in an Always-Connected World",
            category: "Lifestyle",
            tags: ["Wellness", "Balance", "Habits"],
            date: "2026-08-28",
            author: "Sophia Lee",
            readTime: "5 min read",
            image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=85",
            excerpt: "Build a healthier relationship with technology without giving up the digital tools you enjoy.",
            body: [
                {
                    heading: "Notice your digital habits",
                    text: "Pay attention to when you reach for your phone and how you feel afterward. A little awareness can help you distinguish useful screen time from automatic scrolling."
                },
                {
                    heading: "Create boundaries that work",
                    text: "You might keep meals screen-free, silence nonessential notifications, or place your phone away from your workspace. Start with one manageable boundary rather than trying to change everything at once."
                },
                {
                    heading: "Make room for offline life",
                    text: "Walking, reading, meeting friends, and pursuing hobbies can provide valuable breaks from screens. The goal is not to avoid technology entirely, but to use it in ways that support the life you want."
                }
            ]
        },
        {
            id: "learning-skills",
            title: "How to Learn a New Skill Without Feeling Overwhelmed",
            category: "Productivity",
            tags: ["Learning", "Habits", "Focus"],
            date: "2026-08-22",
            author: "Alex Morgan",
            readTime: "6 min read",
            image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1000&q=85",
            excerpt: "Turn a big learning goal into small milestones, practical exercises, and steady progress.",
            body: [
                {
                    heading: "Define a clear outcome",
                    text: "Instead of vaguely deciding to learn programming, design, or a language, choose a small result you want to achieve. A clear goal makes it easier to pick the right resources and measure progress."
                },
                {
                    heading: "Practice actively",
                    text: "Reading and watching tutorials can introduce ideas, but applying them helps you discover what you understand. Build a tiny project, solve a problem, or explain a concept in your own words."
                },
                {
                    heading: "Keep the feedback loop short",
                    text: "Review your mistakes, seek feedback, and adjust your approach regularly. Learning becomes more manageable when progress is broken into achievable steps."
                }
            ]
        },
        {
            id: "sustainable-living",
            title: "Small Sustainable Choices That Add Up Over Time",
            category: "Lifestyle",
            tags: ["Wellness", "Habits", "Environment"],
            date: "2026-08-16",
            author: "Jamie Carter",
            readTime: "5 min read",
            image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1000&q=85",
            excerpt: "Explore everyday ways to reduce waste, use resources thoughtfully, and make sustainability practical.",
            body: [
                {
                    heading: "Begin with what you already do",
                    text: "Reusable bags, careful meal planning, repairing items, and avoiding unnecessary purchases can be practical starting points. The best habits are those that fit your circumstances and that you can maintain."
                },
                {
                    heading: "Focus on progress",
                    text: "Sustainability is not about making every choice perfectly. Consider which changes are realistic in your household, community, and budget, and build from there."
                },
                {
                    heading: "Think beyond individual actions",
                    text: "Community projects, responsible purchasing, and support for better infrastructure can complement personal habits. Collective improvements can make sustainable choices easier for more people."
                }
            ]
        },
        {
            id: "future-of-work",
            title: "The Future of Work: Skills That Help You Adapt",
            category: "Technology",
            tags: ["AI", "Learning", "Innovation"],
            date: "2026-08-10",
            author: "Daniel Brooks",
            readTime: "7 min read",
            image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1000&q=85",
            excerpt: "Explore the value of communication, critical thinking, digital skills, and lifelong learning in changing workplaces.",
            body: [
                {
                    heading: "Combine technical and human skills",
                    text: "Digital tools continue to evolve, but communication, collaboration, sound judgment, and creative problem-solving remain valuable. Combining technical knowledge with these skills can help people adapt to new responsibilities."
                },
                {
                    heading: "Stay curious",
                    text: "You do not need to master every new technology. Focus on learning the tools and concepts relevant to your goals, and practice evaluating new information carefully."
                },
                {
                    heading: "Build evidence of your skills",
                    text: "Projects, practical exercises, and clear explanations of your work can demonstrate what you know. Small, finished examples often communicate capability better than a long list of topics you have studied."
                }
            ]
        }
    ];

    // Show the featured article.
    function renderFeatured() {
        const post = posts.find(function (item) {
            return item.featured;
        });

        if (!post) return;

        featuredPost.replaceChildren();

        const card = makeElement("article", "featured-card");

        const imageLink = makeElement("a", "featured-image");
        imageLink.href = "#article/" + post.id;
        imageLink.setAttribute("aria-label", "Read " + post.title);

        const image = makeElement("img");
        image.src = post.image;
        image.alt = post.title;
        image.loading = "lazy";
        imageLink.appendChild(image);

        const content = makeElement("div", "featured-content");
        content.appendChild(makeElement("span", "post-category", post.category));
        content.appendChild(makeElement("h3", "", post.title));
        content.appendChild(makeElement("p", "", post.excerpt));

        const meta = makeElement("div", "post-meta");
        meta.appendChild(makeElement("span", "", post.author));
        meta.appendChild(makeElement("span", "", "•"));
        meta.appendChild(makeElement("span", "", formatDate(post.date)));
        meta.appendChild(makeElement("span", "", "•"));
        meta.appendChild(makeElement("span", "", post.readTime));

        const link = makeElement("a", "read-link", "Read the story ↗");
        link.href = "#article/" + post.id;

        content.appendChild(meta);
        content.appendChild(link);
        card.appendChild(imageLink);
        card.appendChild(content);
        featuredPost.appendChild(card);
    }

    function makeElement(tag, className, text) {
        const element = document.createElement(tag);

        if (className) element.className = className;
        if (text !== undefined) element.textContent = text;

        return element;
    }

    function formatDate(dateString) {
        const parts = dateString.split("-");

        return new Date(
            Number(parts[0]),
            Number(parts[1]) - 1,
            Number(parts[2])
        ).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    }

    // Create an article card.
    function createArticleCard(post) {
        const card = makeElement("article", "article-card");

        const imageLink = makeElement("a", "article-image");
        imageLink.href = "#article/" + post.id;
        imageLink.setAttribute("aria-label", "Read " + post.title);

        const image = makeElement("img");
        image.src = post.image;
        image.alt = post.title;
        image.loading = "lazy";
        imageLink.appendChild(image);

        const body = makeElement("div", "article-body");

        body.appendChild(makeElement("span", "card-category", post.category));

        const heading = makeElement("h3");
        const titleLink = makeElement("a", "", post.title);
        titleLink.href = "#article/" + post.id;
        heading.appendChild(titleLink);

        body.appendChild(heading);
        body.appendChild(makeElement("p", "article-excerpt", post.excerpt));

        const tags = makeElement("div", "card-tags");

        post.tags.forEach(function (tag) {
            tags.appendChild(makeElement("span", "card-tag", "#" + tag));
        });

        body.appendChild(tags);

        const footer = makeElement("div", "card-footer");
        footer.appendChild(
            makeElement("span", "", formatDate(post.date) + " · " + post.readTime)
        );

        const readLink = makeElement("a", "read-link", "Read ↗");
        readLink.href = "#article/" + post.id;
        footer.appendChild(readLink);

        body.appendChild(footer);
        card.appendChild(imageLink);
        card.appendChild(body);

        return card;
    }

    // Apply search, category and tag filters.
    function getFilteredPosts() {
        const query = searchInput.value.trim().toLowerCase();

        return posts.filter(function (post) {
            const matchesSearch = [
                post.title,
                post.excerpt,
                post.category,
                post.author,
                ...post.tags
            ].join(" ").toLowerCase().includes(query);

            const matchesCategory =
                selectedCategory === "All" ||
                post.category === selectedCategory;

            const matchesTag =
                selectedTag === "All" ||
                post.tags.includes(selectedTag);

            return matchesSearch && matchesCategory && matchesTag;
        });
    }

    // Render article grid and Load More button.
    function renderArticles() {
        const filtered = getFilteredPosts();
        const visible = filtered.slice(0, visibleCount);

        articleGrid.replaceChildren();

        visible.forEach(function (post) {
            articleGrid.appendChild(createArticleCard(post));
        });

        resultCount.textContent =
            filtered.length + (filtered.length === 1
                ? " article found"
                : " articles found");

        noResults.hidden = filtered.length > 0;
        loadMoreBtn.hidden =
            filtered.length === 0 || visibleCount >= filtered.length;

        if (filtered.length === 0) {
            loadMoreBtn.hidden = true;
        }
    }

    // Category selection.
    categoryList.addEventListener("click", function (event) {
        const button = event.target.closest("[data-category]");

        if (!button) return;

        selectedCategory = button.dataset.category;
        visibleCount = PAGE_SIZE;

        categoryList.querySelectorAll("[data-category]").forEach(function (item) {
            item.classList.toggle("active", item === button);
        });

        renderArticles();
    });

    // Tag selection.
    tagList.addEventListener("click", function (event) {
        const button = event.target.closest("[data-tag]");

        if (!button) return;

        selectedTag = button.dataset.tag;
        visibleCount = PAGE_SIZE;

        tagList.querySelectorAll("[data-tag]").forEach(function (item) {
            item.classList.toggle("active", item === button);
        });

        renderArticles();
    });

    searchInput.addEventListener("input", function () {
        visibleCount = PAGE_SIZE;
        renderArticles();
    });

    loadMoreBtn.addEventListener("click", function () {
        visibleCount += PAGE_SIZE;
        renderArticles();
    });

    document.getElementById("resetSearch").addEventListener("click", resetFilters);

    function resetFilters() {
        selectedCategory = "All";
        selectedTag = "All";
        visibleCount = PAGE_SIZE;
        searchInput.value = "";

        categoryList.querySelectorAll("[data-category]").forEach(function (item) {
            item.classList.toggle("active", item.dataset.category === "All");
        });

        tagList.querySelectorAll("[data-tag]").forEach(function (item) {
            item.classList.toggle("active", item.dataset.tag === "All");
        });

        renderArticles();
    }

    // Mobile navigation.
    menuToggle.addEventListener("click", function () {
        const isOpen = navLinks.classList.toggle("open");

        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Close navigation" : "Open navigation"
        );

        menuToggle.textContent = isOpen ? "✕" : "☰";
    });

    navLinks.addEventListener("click", function (event) {
        if (event.target.closest("a")) {
            navLinks.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute("aria-label", "Open navigation");
            menuToggle.textContent = "☰";
        }
    });

    // Theme preference.
    function applyTheme(theme) {
        document.body.classList.toggle("dark", theme === "dark");
        themeToggle.textContent = theme === "dark" ? "☀" : "☾";
        themeToggle.setAttribute(
            "aria-label",
            theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
        );
    }

    let savedTheme = "light";

    try {
        savedTheme = localStorage.getItem(THEME_KEY) || "light";
    } catch (error) {
        savedTheme = "light";
    }

    applyTheme(savedTheme);

    themeToggle.addEventListener("click", function () {
        const newTheme = document.body.classList.contains("dark")
            ? "light"
            : "dark";

        applyTheme(newTheme);

        try {
            localStorage.setItem(THEME_KEY, newTheme);
        } catch (error) {
            // The selected theme remains active for this page.
        }
    });

    // Render an individual article.
    function showArticle(id) {
        const post = posts.find(function (item) {
            return item.id === id;
        });

        if (!post) {
            showHome();
            return;
        }

        currentArticleId = id;

        homePage.hidden = true;
        articlePage.hidden = false;

        navLinks.querySelectorAll("a").forEach(function (link) {
            link.classList.remove("active");
        });

        articleContent.replaceChildren();

        const header = makeElement("header", "detail-header");
        header.appendChild(makeElement("span", "post-category", post.category));

        header.appendChild(makeElement("h1", "", post.title));
        header.appendChild(makeElement("p", "detail-subtitle", post.excerpt));

        const meta = makeElement("div", "post-meta");
        meta.appendChild(makeElement("span", "", "By " + post.author));
        meta.appendChild(makeElement("span", "", "•"));
        meta.appendChild(makeElement("span", "", formatDate(post.date)));
        meta.appendChild(makeElement("span", "", "•"));
        meta.appendChild(makeElement("span", "", post.readTime));

        header.appendChild(meta);
        articleContent.appendChild(header);

        const cover = makeElement("img", "detail-cover");
        cover.src = post.image;
        cover.alt = post.title;
        articleContent.appendChild(cover);

        const prose = makeElement("div", "article-prose");

        post.body.forEach(function (section) {
            prose.appendChild(makeElement("h2", "", section.heading));
            prose.appendChild(makeElement("p", "", section.text));
        });

        articleContent.appendChild(prose);

        const tags = makeElement("div", "detail-tags");

        post.tags.forEach(function (tag) {
            tags.appendChild(makeElement("span", "", "#" + tag));
        });

        articleContent.appendChild(tags);

        // Social sharing.
        const shareRow = makeElement("div", "share-row");
        shareRow.appendChild(makeElement("span", "", "Share this story"));

        [
            { label: "Facebook", network: "facebook" },
            { label: "X", network: "x" },
            { label: "WhatsApp", network: "whatsapp" },
            { label: "Copy link", network: "copy" }
        ].forEach(function (item) {
            const button = makeElement("button", "share-btn", item.label);
            button.type = "button";

            button.addEventListener("click", function () {
                shareArticle(post, item.network);
            });

            shareRow.appendChild(button);
        });

        articleContent.appendChild(shareRow);

        renderComments();
        renderRelated(post);

        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function showHome() {
        currentArticleId = null;
        articlePage.hidden = true;
        homePage.hidden = false;

        window.scrollTo({ top: 0, behavior: "smooth" });
        renderArticles();
    }

    document.getElementById("backToBlog").addEventListener("click", function () {
        location.hash = "";
    });

    document.getElementById("homeLogo").addEventListener("click", function () {
        location.hash = "";
    });

    // Use the URL hash so article views can be opened or bookmarked.
    function handleRoute() {
        const match = location.hash.match(/^#article\/([a-z0-9-]+)$/);

        if (match) {
            showArticle(match[1]);
        } else {
            showHome();
        }
    }

    window.addEventListener("hashchange", handleRoute);

    // Share article links. Copy uses the Clipboard API when available.
    async function shareArticle(post, network) {
        const articleUrl = new URL(
            "#article/" + post.id,
            window.location.href
        ).href;

        const encodedUrl = encodeURIComponent(articleUrl);
        const encodedTitle = encodeURIComponent(post.title);

        if (network === "facebook") {
            window.open(
                "https://www.facebook.com/sharer/sharer.php?u=" + encodedUrl,
                "_blank",
                "noopener,noreferrer"
            );
        } else if (network === "x") {
            window.open(
                "https://twitter.com/intent/tweet?text=" +
                encodedTitle + "&url=" + encodedUrl,
                "_blank",
                "noopener,noreferrer"
            );
        } else if (network === "whatsapp") {
            window.open(
                "https://api.whatsapp.com/send?text=" +
                encodedTitle + "%20" + encodedUrl,
                "_blank",
                "noopener,noreferrer"
            );
        } else {
            try {
                await navigator.clipboard.writeText(articleUrl);
                alert("Article link copied!");
            } catch (error) {
                window.prompt("Copy this article link:", articleUrl);
            }
        }
    }

    // Comments are stored locally per article.
    function loadComments() {
        try {
            const data = JSON.parse(
                localStorage.getItem(COMMENTS_KEY) || "{}"
            );

            return data && typeof data === "object" && !Array.isArray(data)
                ? data
                : {};
        } catch (error) {
            return {};
        }
    }

    function saveComments(data) {
        try {
            localStorage.setItem(COMMENTS_KEY, JSON.stringify(data));
            return true;
        } catch (error) {
            commentStatus.textContent =
                "Unable to save the comment in browser storage.";
            return false;
        }
    }

    commentForm.addEventListener("submit", function (event) {
        event.preventDefault();

        if (!currentArticleId) return;

        const name = commentName.value.trim();
        const message = commentText.value.trim();

        if (!name || !message) {
            commentStatus.textContent =
                "Please enter your name and comment.";
            return;
        }

        if (name.length > 50 || message.length > 1000) {
            commentStatus.textContent =
                "Your name or comment exceeds the allowed length.";
            return;
        }

        const allComments = loadComments();
        const existing = Array.isArray(allComments[currentArticleId])
            ? allComments[currentArticleId]
            : [];

        existing.push({
            name: name,
            text: message,
            date: new Date().toISOString()
        });

        allComments[currentArticleId] = existing;

        if (!saveComments(allComments)) return;

        commentText.value = "";
        commentStatus.textContent = "Your comment was saved in this browser.";

        renderComments();
    });

    function renderComments() {
        const allComments = loadComments();

        const comments = Array.isArray(allComments[currentArticleId])
            ? allComments[currentArticleId]
            : [];

        commentList.replaceChildren();

        comments.slice().reverse().forEach(function (comment) {
            const card = makeElement("article", "comment-card");
            card.appendChild(makeElement("h3", "", comment.name));

            const time = makeElement("time", "", "");

            const parsedDate = new Date(comment.date);

            if (!Number.isNaN(parsedDate.getTime())) {
                time.dateTime = parsedDate.toISOString();
                time.textContent = parsedDate.toLocaleString();
            }

            card.appendChild(time);
            card.appendChild(makeElement("p", "", comment.text));
            commentList.appendChild(card);
        });

        commentCount.textContent =
            comments.length + (comments.length === 1 ? " comment" : " comments");
    }

    // Show articles from the same category first.
    function renderRelated(post) {
        relatedGrid.replaceChildren();

        const related = posts.filter(function (item) {
            return item.id !== post.id &&
                (item.category === post.category ||
                 item.tags.some(function (tag) {
                     return post.tags.includes(tag);
                 }));
        }).slice(0, 2);

        related.forEach(function (item) {
            relatedGrid.appendChild(createArticleCard(item));
        });

        if (related.length === 0) {
            relatedGrid.appendChild(
                makeElement("p", "", "More stories are coming soon.")
            );
        }
    }

    document.getElementById("year").textContent =
        new Date().getFullYear();

    // Initial render.
    renderFeatured();
    renderArticles();
    handleRoute();
});
