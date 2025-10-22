// لیست اولیه کتاب‌ها
const books = [
    {
      title: "The Forty Rules of Love",
      author: "Elif Shafak",
      image: "assets/love.jpg"
    },
    {
      title: "The Little Prince",
      author: "Antoine de Saint-Exupéry",
      image: "assets/prince.jpg"
    },
    {
      title: "The Alchemist",
      author: "Paulo Coelho",
      image: "assets/alchemist.jpg"
    }
  ];
  
  // نمایش کتاب‌ها در صفحه books.html
  function displayBooks(filter = "") {
    const bookList = document.getElementById("book-list");
    if (!bookList) return;
  
    bookList.innerHTML = "";
  
    const filteredBooks = books.filter(book =>
      book.title.toLowerCase().includes(filter.toLowerCase()) ||
      book.author.toLowerCase().includes(filter.toLowerCase())
    );
  
    if (filteredBooks.length === 0) {
      bookList.innerHTML = `<p class="text-center">No books found.</p>`;
      return;
    }
  
    filteredBooks.forEach(book => {
      const col = document.createElement("div");
      col.className = "col-md-4";
      col.innerHTML = `
        <div class="card">
          <img src="${book.image}" class="card-img-top" alt="${book.title}">
          <div class="card-body text-center">
            <h5 class="card-title">${book.title}</h5>
            <p class="card-text">Author: ${book.author}</p>
          </div>
        </div>
      `;
      bookList.appendChild(col);
    });
  }
  
  // افزودن کتاب جدید در add-book.html
  function handleAddBookForm() {
    const form = document.getElementById("book-form");
    const successMessage = document.getElementById("success-message");
  
    if (!form) return;
  
    form.addEventListener("submit", function (e) {
      e.preventDefault();
  
      const title = document.getElementById("title").value.trim();
      const author = document.getElementById("author").value.trim();
      const image = document.getElementById("image").value.trim();
  
      if (title && author && image) {
        books.push({ title, author, image });
  
        if (successMessage) {
          successMessage.classList.remove("d-none");
          setTimeout(() => {
            successMessage.classList.add("d-none");
          }, 3000);
        }
  
        form.reset();
      }
    });
  }
  
  // جست‌وجو در صفحه books.html
  function handleSearch() {
    const searchInput = document.getElementById("search-input");
    if (!searchInput) return;
  
    searchInput.addEventListener("input", () => {
      displayBooks(searchInput.value);
    });
  }
  
  // اجرای توابع هنگام بارگذاری صفحه
  document.addEventListener("DOMContentLoaded", () => {
    displayBooks();
    handleAddBookForm();
 handleSearch();
});