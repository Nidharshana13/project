(function () {
  const form = document.getElementById("book-form");
  const titleIn = document.getElementById("title");
  const authorIn = document.getElementById("author");
  const yearIn = document.getElementById("year");
  const booksContainer = document.getElementById("books-container");
  const emptyMsg = document.getElementById("empty-msg");
  const searchIn = document.getElementById("search");
  const STORAGE_KEY = "libraryBooks_v1";

  let books = [];

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  }
  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      books = raw ? JSON.parse(raw) : [];
    } catch (e) {
      books = [];
    }
  }

  function render(filterText = "") {
    booksContainer.innerHTML = "";
    const normalized = filterText.trim().toLowerCase();
    const filtered = normalized
      ? books.filter((b) =>
          (b.title + b.author).toLowerCase().includes(normalized)
        )
      : books;
    if (filtered.length === 0) {
      emptyMsg.style.display = "block";
      return;
    }
    emptyMsg.style.display = "none";

    filtered.forEach((b) => {
      const card = document.createElement("div");
      card.className = "book-card";

      const t = document.createElement("div");
      t.className = "book-title";
      t.textContent = b.title;
      const m = document.createElement("div");
      m.className = "book-meta";
      m.textContent = `${b.author}${b.year ? " • " + b.year : ""}`;

      const actions = document.createElement("div");
      actions.className = "book-actions";

      const toggle = document.createElement("button");
      toggle.className = "small";
      toggle.textContent = b.borrowed ? "Return" : "Borrow";
      toggle.style.background = b.borrowed ? "#10b981" : ""; // green if borrowed
      toggle.addEventListener("click", () => {
        b.borrowed = !b.borrowed;
        save();
        render(searchIn.value);
      });

      const del = document.createElement("button");
      del.className = "small delete";
      del.textContent = "Delete";
      del.addEventListener("click", () => {
        if (confirm("Delete this book?")) {
          books = books.filter((x) => x.id !== b.id);
          save();
          render(searchIn.value);
        }
      });

      actions.appendChild(toggle);
      actions.appendChild(del);

      card.appendChild(t);
      card.appendChild(m);
      if (b.borrowed) {
        const badge = document.createElement("div");
        badge.className = "book-meta muted";
        badge.textContent = "Currently borrowed";
        card.appendChild(badge);
      }
      card.appendChild(actions);
      booksContainer.appendChild(card);
    });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = titleIn.value.trim();
    const author = authorIn.value.trim();
    const year = yearIn.value ? parseInt(yearIn.value, 10) : null;
    if (!title || !author) {
      alert("Please enter title and author.");
      return;
    }
    const book = { id: Date.now(), title, author, year, borrowed: false };
    books.unshift(book);
    save();
    render(searchIn.value);
    form.reset();
    titleIn.focus();
  });

  searchIn.addEventListener("input", () => render(searchIn.value));

  // init
  load();
  render();
})();
