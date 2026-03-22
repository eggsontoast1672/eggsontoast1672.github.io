"use strict";

const articles = [
  {
    id: "the-point",
    title: "My Mission and the Point of Math",
    url: "the-point.html",
    date: "2026-03-15",
    tags: ["philosophy", "math-education", "exposition"],
    prerequisites: "Comfort reading short prose discussions about mathematics.",
    summary: "A mission-centered essay on what mathematics is and why communicating it clearly matters."
  },
  {
    id: "set-theory",
    title: "Set Theory: A First Course in Higher Mathematics",
    url: "set-theory.html",
    date: "2026-03-18",
    tags: ["foundations", "set-theory", "proof-writing"],
    prerequisites: "High-school algebra and willingness to read formal definitions.",
    summary: "An introduction to sets as the foundational language of modern mathematical reasoning."
  },
  {
    id: "quotient-groups",
    title: "An Intuition for Quotient Groups",
    url: "first-post.html",
    date: "2026-03-20",
    tags: ["algebra", "group-theory", "quotients"],
    prerequisites: "Basic group theory including subgroups and normal subgroups.",
    summary: "A conceptual overview of quotient groups and the idea of collapsing structure."
  }
];

const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const articleList = document.getElementById("articleList");
const articleDetail = document.getElementById("articleDetail");
const emptyState = document.getElementById("emptyState");
const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric"
});

let selectedId = null;

function formatDate(dateValue) {
  return dateFormatter.format(new Date(dateValue + "T00:00:00"));
}

function sortArticles(items) {
  const mode = sortSelect.value;
  const sorted = [...items];

  sorted.sort((a, b) => {
    if (mode === "oldest") return a.date.localeCompare(b.date);
    if (mode === "title-asc") return a.title.localeCompare(b.title);
    if (mode === "title-desc") return b.title.localeCompare(a.title);
    return b.date.localeCompare(a.date);
  });

  return sorted;
}

function filterArticles() {
  const query = searchInput.value.trim().toLowerCase();
  if (!query) return articles;

  return articles.filter((article) => {
    const titleMatch = article.title.toLowerCase().includes(query);
    const tagMatch = article.tags.some((tag) => tag.toLowerCase().includes(query));
    return titleMatch || tagMatch;
  });
}

function renderDetail(article) {
  articleDetail.innerHTML = `
    <h4>${article.title}</h4>
    <p class="date">Published ${formatDate(article.date)}</p>
    <p>${article.summary}</p>
    <p><strong>Tags:</strong> ${article.tags.join(", ")}</p>
    <p><strong>Prerequisite knowledge:</strong> ${article.prerequisites}</p>
    <a class="button" href="${article.url}">Open Article</a>
  `;
}

function renderList() {
  const visibleArticles = sortArticles(filterArticles());
  articleList.innerHTML = "";

  if (!visibleArticles.length) {
    emptyState.hidden = false;
    articleDetail.innerHTML = "<p class=\"small-text\">No article selected.</p>";
    return;
  }

  emptyState.hidden = true;
  const visibleIds = new Set(visibleArticles.map((article) => article.id));
  if (!selectedId || !visibleIds.has(selectedId)) {
    selectedId = visibleArticles[0].id;
  }

  visibleArticles.forEach((article) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "article-item";
    if (article.id === selectedId) {
      button.classList.add("active");
    }
    button.innerHTML = `
      <span class="article-title">${article.title}</span>
      <span class="article-meta">${formatDate(article.date)} • ${article.tags.join(", ")}</span>
    `;
    button.addEventListener("click", () => {
      selectedId = article.id;
      renderList();
    });
    articleList.appendChild(button);
  });

  const selectedArticle = visibleArticles.find((article) => article.id === selectedId);
  if (selectedArticle) {
    renderDetail(selectedArticle);
  }
}

searchInput.addEventListener("input", renderList);
sortSelect.addEventListener("change", renderList);
renderList();
