document.addEventListener("DOMContentLoaded", () => {
  // 🌙 Dark Mode Toggle
  const toggleBtn = document.getElementById("toggle-dark");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      document.body.classList.toggle("dark");
      localStorage.setItem("dark-mode", document.body.classList.contains("dark"));
    });
  }

  // 🌙 Apply Saved Dark Mode
  if (localStorage.getItem("dark-mode") === "true") {
    document.body.classList.add("dark");
  }

  const newsContainer = document.getElementById("news-container");
  const breakingScroll = document.getElementById("breaking-scroll");
  const apiKey = 'cedb4d47b506430c92c79cda67b7c2f4';
  let currentQuery = document.body.dataset.category || "india";

  // 🔍 Search Input Handler
  const searchInput = document.getElementById("search-box");
  if (searchInput) {
    searchInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (query !== "") {
          currentQuery = query;
          fetchAndDisplayNews(currentQuery);
        }
      }
    });
  }

  // 🔄 Fetch and Display News
  function fetchAndDisplayNews(query) {
    const url = `https://newsapi.org/v2/everything?q=${query}&pageSize=8&sortBy=publishedAt&language=en&apiKey=${apiKey}`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (!data.articles || data.articles.length === 0) {
          newsContainer.innerHTML = '<p>No news found for this category.</p>';
          return;
        }

        // Breaking headlines
        if (breakingScroll) {
          breakingScroll.innerHTML = data.articles
            .slice(0, 5)
            .map(article => `<a href="${article.url}" target="_blank">${article.title}</a>`)
            .join(" | ");
        }

        // News cards
        newsContainer.innerHTML = '';
        data.articles.forEach(article => {
          const card = document.createElement("div");
          card.className = "news-card";
          card.innerHTML = `
            <img src="${article.urlToImage || 'https://via.placeholder.com/400x200'}" alt="news" />
            <h3>${article.title}</h3>
            <p>${article.description || 'No description available.'}</p>
            <a href="${article.url}" target="_blank">Read more</a>
          `;
          newsContainer.appendChild(card);
        });
      })
      .catch(err => {
        console.error("Error fetching news:", err);
        newsContainer.innerHTML = "<p>Failed to load news. Try again later.</p>";
      });
  }

  // 🔰 Initial Load
  fetchAndDisplayNews(currentQuery);
});
