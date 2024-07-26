document.addEventListener("DOMContentLoaded", () => {
  const displyQut = document.getElementById("quoteDisplay");
  const newQute = document.getElementById("newQuote");
  const newQuoteText = document.getElementById("newQuoteText");
  const newQuoteCategory = document.getElementById("newQuoteCategory");
  const categoryFilter = document.getElementById("categoryFilter");
  const notification = document.getElementById("notification");
  const quotes = [
    {
      text: "Many of life’s failures are people who did not realize how close they were to success when they gave up.",
      category: "life",
    },
    {
      text: "Life is like a coin. You can spend it any way you wish, but you only spend it once.”",
      category: "Motivation",
    },
    {
      text: "Never let the fear of striking out keep you from playing the game.”",
      category: "life",
    },
    {
      text: "Don’t settle for what life gives you; make life better and build something.”",
      category: "life",
    },
    {
      text: "I believe every human has a finite number of heartbeats. I don't intend to waste any of mine.”",
      category: "Motivation",
    },
    {
      text: "The best way to predict your future is to create it.”",
      category: "Motivation",
    },
    {
      text: "If you want to live a happy life, tie it to a goal, not to people or things.”",
      category: "life",
    },
  ];

  // generate randome quotes
  function showRandomQuote() {
    const filteredQuotes = getFilteredQuotes();
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const quote = filteredQuotes[randomIndex];
    displyQut.textContent = `${quote.text} - ${quote.category}`;
  }
  newQute.addEventListener("click", showRandomQuote);

  // adding quotes
  function addQuote() {
    const text = newQuoteText.value.trim();
    const category = newQuoteCategory.value.trim();
    if (text === "" || category === "") {
      alert("Please enter a quote and category");
      return;
    } else {
      quotes.push({ text, category });
      populateCategories();
      newQuoteText.value = "";
      newQuoteCategory.value = "";
      alert("Quote added successfully");
    }
  }
    //Check for posting data to the server using a mock API
    try {
      await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newQuote)
      });
      console.log('Quote posted to server');
    } catch (error) {
      console.error('Error posting quote to server:', error);
    }
  }

  // Function to create the Add Quote Form
  function createAddQuoteForm() {
    const formDiv = document.createElement("div");
    const quoteInput = document.createElement("input");
    quoteInput.id = "newQuoteText";
    quoteInput.type = "text";
    quoteInput.placeholder = "Enter a new quote";

    const categoryInput = document.createElement("input");
    categoryInput.id = "newQuoteCategory";
    categoryInput.type = "text";
    categoryInput.placeholder = "Enter quote category";

    const addButton = document.createElement("button");
    addButton.textContent = "Add Quote";
    addButton.onclick = addQuote;

    formDiv.appendChild(quoteInput);
    formDiv.appendChild(categoryInput);
    formDiv.appendChild(addButton);

    document.body.appendChild(formDiv);
  }

  // locaal storage, save quotes
  function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
  }

  // export quotes
  function exportToJsonFile() {
    const quotesJson = JSON.stringify(quotes);
    const blob = new Blob([quotesJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "quotes.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  //import files

  function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function (event) {
      const importedQuotes = JSON.parse(event.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      alert("Quotes imported successfully!");
    };
    fileReader.readAsText(event.target.files[0]);
  }

  //categorypopulation

  function populateCategories() {
    const categories = [...new Set(quotes.map((quote) => quote.category))];
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      categoryFilter.appendChild(option);
    });
  }

  // filter quots

  function getFilteredQuotes() {
    const selectedCategory = categoryFilter.value;
    if (selectedCategory === "all") {
      return quotes;
    }
    return quotes.filter((quote) => quote.category === selectedCategory);
  }

  function filterQuotes() {
    showRandomQuote();
  }
  categoryFilter.addEventListener("change", filterQuotes);

  // global accese to function
  window.addQuote = addQuote;
  window.exportToJsonFile = exportToJsonFile;
  window.importFromJsonFile = importFromJsonFile;
  populateCategories();
  showRandomQuote();

  const lastSelectedCategory = localStorage.getItem("selectedCategory");
  if (lastSelectedCategory) {
    categoryFilter.value = lastSelectedCategory;
    filterQuotes();
  }

  categoryFilter.addEventListener("change", () => {
    localStorage.setItem("selectedCategory", categoryFilter.value);
    filterQuotes();
  });

  //Simulate Server Interaction

  async function fetchQuotesFromServer() {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts"
      );
      const serverQuotes = await response.json();
      const newQuotes = serverQuotes.map((post) => ({
        text: post.title,
        category: "Server",
      }));
      const combinedQuotes = [...newQuotes, ...quotes];
      quotes = [
        ...new Set(combinedQuotes.map((quote) => JSON.stringify(quote))),
      ].map((quote) => JSON.parse(quote));
      saveQuotes();
      populateCategories();
      showRandomQuote();
      notification.textContent = "Quotes synced with server";
      notification.style.display = "block";
    } catch (error) {
      console.error("Error fetching data from server:", error);
    }
  }
  setInterval(fetchQuotesFromServer, 30000);
});
