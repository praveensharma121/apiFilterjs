document.addEventListener("DOMContentLoaded", async () => {
  const searchInput = document.getElementById("searchInput");
  const dataTable = document.createElement("tbody"); // Create tbody element dynamically
  const table = document.createElement("table"); // Create table element dynamically
  table.id = "dataTable"; // Set table id

  // Create table header with labels
  const tableHeader = document.createElement("thead");
  const headerRow = document.createElement("tr");
  const labelId = document.createElement("th");
  const labelTitle = document.createElement("th");
  const labelUserId = document.createElement("th");

  labelId.textContent = "Id";
  labelTitle.textContent = "Title";
  labelUserId.textContent = "UserId";

  headerRow.appendChild(labelId);
  headerRow.appendChild(labelTitle);
  headerRow.appendChild(labelUserId);
  tableHeader.appendChild(headerRow);
  table.appendChild(tableHeader);

  table.appendChild(dataTable);
  let allData = JSON.parse(localStorage.getItem("allData"));
  let currentPage = 1;
  const rowsPerPage = 10; // Number of rows per page

  if (!allData) {
    // Fetch data only if not available in local storage
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts"
      );
      allData = await response.json();
      localStorage.setItem("allData", JSON.stringify(allData)); // Store data in local storage
    } catch (error) {
      console.error("Error fetching data:", error);
      return;
    }
  }

  const displayData = (data) => {
    // Clear existing table rows
    dataTable.innerHTML = "";

    // Display rows for current page
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      const row = document.createElement("tr");

      const idCell = document.createElement("td"); // Create td for id
      idCell.textContent = item.id; // Set text content for id cell
      row.appendChild(idCell); // Append id cell to row

      const titleCell = document.createElement("td"); // Create td for title
      titleCell.textContent = item.title; // Set text content for title cell
      row.appendChild(titleCell); // Append title cell to row

      const userIdCell = document.createElement("td"); // Create td for userId
      userIdCell.textContent = item.userId; // Set text content for userId cell
      row.appendChild(userIdCell); // Append userId cell to row

      dataTable.appendChild(row); // Append row to tbody
    }
  };

  displayData(allData.slice(0, rowsPerPage)); // Display first page of data initially
  document.body.appendChild(table); // Append table to document body

  async function renderCheckboxes() {
    const checkboxContainer = document.getElementById("checkboxContainer");
    // Clear previous checkboxes
    checkboxContainer.innerHTML = "";

    // Create checkbox and label for Id
    const checkboxId = document.createElement("input");
    checkboxId.type = "checkbox";
    checkboxId.id = "checkboxId";
    checkboxId.value = "Id";
    let labelId = document.createElement("label");
    labelId.htmlFor = "checkboxId";
    labelId.appendChild(document.createTextNode("Id"));
    checkboxContainer.appendChild(checkboxId);
    checkboxContainer.appendChild(labelId);
    checkboxContainer.appendChild(document.createElement("br"));

    // Create checkbox and label for Title
    const checkboxTitle = document.createElement("input");
    checkboxTitle.type = "checkbox";
    checkboxTitle.id = "checkboxTitle";
    checkboxTitle.value = "Title";
    let labelTitle = document.createElement("label");
    labelTitle.htmlFor = "checkboxTitle";
    labelTitle.appendChild(document.createTextNode("Title"));
    checkboxContainer.appendChild(checkboxTitle);
    checkboxContainer.appendChild(labelTitle);
    checkboxContainer.appendChild(document.createElement("br"));

    // Create checkbox and label for UserId
    const checkboxUserId = document.createElement("input");
    checkboxUserId.type = "checkbox";
    checkboxUserId.id = "checkboxUserId";
    checkboxUserId.value = "UserId";
    let labelUserId = document.createElement("label");
    labelUserId.htmlFor = "checkboxUserId";
    labelUserId.appendChild(document.createTextNode("UserId"));
    checkboxContainer.appendChild(checkboxUserId);
    checkboxContainer.appendChild(labelUserId);
  }

  renderCheckboxes();

  function filterData(searchText) {
    // Split the search text into terms
    const searchTerms = searchText
      .split(" ")
      .filter((term) => term.trim() !== "");
    // Filter data based on the search text terms
    return allData.filter((item) => {
      // Check if any search term exists within any of the cell contents
      return searchTerms.every((term) => {
        const idMatch = item.id.toString().toLowerCase().includes(term);
        const titleMatch = item.title.toLowerCase().includes(term);
        const userIdMatch = item.userId.toString().toLowerCase().includes(term);
        return idMatch || titleMatch || userIdMatch;
      });
    });
  }

  searchInput.addEventListener("input", () => {
    const searchText = searchInput.value.trim().toLowerCase();
    const filteredData = filterData(searchText);
    displayData(filteredData.slice(0, rowsPerPage)); // Display first page of filtered data
  });

  // Add pagination controls
  const paginationContainer = document.createElement("div");
  paginationContainer.classList.add("pagination");
  const totalPages = Math.ceil(allData.length / rowsPerPage);
  for (let i = 1; i <= totalPages; i++) {
    const pageLink = document.createElement("a");
    pageLink.href = "#";
    pageLink.textContent = i;
    pageLink.addEventListener("click", (event) => {
      event.preventDefault();
      currentPage = parseInt(event.target.textContent); // Update currentPage based on clicked link
      const startIndex = (currentPage - 1) * rowsPerPage;
      const endIndex = startIndex + rowsPerPage;
      displayData(allData.slice(startIndex, endIndex));
      // Remove active class from all page links
      const pageLinks = paginationContainer.querySelectorAll("a");
      pageLinks.forEach((link) => link.classList.remove("active"));
      // Add active class to the clicked page link
      event.target.classList.add("active");
    });
    paginationContainer.appendChild(pageLink);
  }

  // Add active class to the first page link initially
  paginationContainer.querySelector("a").classList.add("active");

  document.body.appendChild(paginationContainer);
});
