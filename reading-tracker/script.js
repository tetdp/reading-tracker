let books = JSON.parse(localStorage.getItem("books")) || [];
let currentFilter = "All";

const form = document.getElementById("book-form");
const bookList = document.getElementById("book-list");
const filters = document.querySelectorAll(".filters button");
const progressFill = document.getElementById("progress-bar-fill");
const darkToggle = document.getElementById("dark-mode-toggle");
const exportBtn = document.getElementById("export-btn");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value.trim();
  const author = document.getElementById("author").value.trim();
  const status = document.getElementById("status").value;
  const cover = document.getElementById("cover").value.trim();

  const book = { id: Date.now(), title, author, status, cover };
  books.push(book);
  saveBooks();
  form.reset();
  renderBooks();
});

filters.forEach((btn) => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;
    renderBooks();
  });
});

function saveBooks() {
  localStorage.setItem("books", JSON.stringify(books));
}

function renderBooks() {
  bookList.innerHTML = "";

  const filtered = books.filter(book =>
    currentFilter === "All" ? true : book.status === currentFilter
  );

  filtered.forEach((book) => {
    const li = document.createElement("li");
    li.className = "book";

    const img = book.cover ? `<img src="${book.cover}" alt="cover" />` : "";

    li.innerHTML = `
      ${img}
      <div class="book-info">
        <h3>${book.title}</h3>
        ${book.author ? `<small>Author: ${book.author}</small>` : ""}
        <small>Status: ${book.status}</small>
      </div>
      <button class="delete-btn" onclick="deleteBook(${book.id})">Delete</button>
    `;

    bookList.appendChild(li);
  });

  updateProgressBar();
}

function deleteBook(id) {
  books = books.filter(book => book.id !== id);
  saveBooks();
  renderBooks();
}

function updateProgressBar() {
  const total = books.length;
  const finished = books.filter(b => b.status === "Finished").length;
  const percent = total ? Math.round((finished / total) * 100) : 0;
  progressFill.style.width = `${percent}%`;
}

darkToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

exportBtn.addEventListener("click", () => {
  const rows = [["Title", "Author", "Status", "Cover"]];
  books.forEach(b => rows.push([b.title, b.author, b.status, b.cover || ""]));
  const csvContent = rows.map(e => e.map(cell => `"${cell}"`).join(",")).join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "reading_list.csv";
  link.click();
});

renderBooks();
