
// EVENTS + MARKETPLACE APP

document.addEventListener("DOMContentLoaded", () => {

  const campusBtn = document.getElementById("campusBtn");
  const ticketBtn = document.getElementById("ticketBtn");

  if (campusBtn) {
    campusBtn.addEventListener("click", loadCampusEvents);
  }

  if (ticketBtn) {
    ticketBtn.addEventListener("click", loadTicketmasterEvents);
  }

  const addBtn = document.getElementById("addItemBtn");

  if (addBtn) {
    addBtn.addEventListener("click", addItem);
    loadItems();
  }

});
// Load campus events created in a json file (not an actual API)
async function loadCampusEvents() {
  const container = document.getElementById("eventsContainer");
  container.innerHTML = "<p>Loading campus events...</p>";

  try {
    const response = await fetch("data/campusEvents.json");
    const events = await response.json();

    displayEvents(events, "On-Campus Events");

  } catch (error) {
    container.innerHTML = "<p>Failed to load campus events.</p>";
  }
}
// Load the API from ticketmasters with just the first 6
async function loadTicketmasterEvents() {
  const container = document.getElementById("eventsContainer");
  container.innerHTML = "<p>Loading off-campus events...</p>";

  const API_KEY = "12TZi2CzmxG45UDsuoo43caXG6uqjFDG";
  const url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${API_KEY}&city=St%20Louis&size=6`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    const events = data._embedded?.events || [];

    const formattedEvents = events.map(event => {

      const [year, month, day] = event.dates.start.localDate.split("-");
      const fixedDate = new Date(year, month - 1, day);

      return {
        name: event.name,
        date: fixedDate.toLocaleDateString(),
        location: event._embedded?.venues?.[0]?.name || "Unknown Location",
        url: event.url
      };
    });

    displayEvents(formattedEvents, "Off-Campus Events");

  } catch (error) {
    container.innerHTML = "<p>Failed to load off-campus events.</p>";
  }
}
//Print the event
function displayEvents(events, title) {

  const container = document.getElementById("eventsContainer");
  if (!container) return;

  if (!events || events.length === 0) {
    container.innerHTML = `
      <div class="col-12 text-center">
        <h3>${title}</h3>
        <p>No events found.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="col-12">
      <h3 class="mb-3 text-center">${title}</h3>
    </div>
  `;

  events.forEach(event => {
    container.innerHTML += `
      <div class="col-md-4 mb-3">
        <div class="card shadow-sm h-100 p-3 d-flex flex-column">

          <h5>${event.name}</h5>

          <p><strong>Date:</strong> ${event.date}</p>

          ${event.time ? `<p><strong>Time:</strong> ${event.time}</p>` : ""}

          <p><strong>Location:</strong> ${event.location}</p>

          ${event.url ? `
            <a href="${event.url}" target="_blank" class="btn btn-outline-primary mt-auto">
              View Event
            </a>
          ` : ""}

        </div>
      </div>
    `;
  });
}

// Marketplace

//Add item (future improvement I want to make this for just users that are logged in to add items)
function addItem() {
  const studentName = document.getElementById("studentName").value;
  const studentEmail = document.getElementById("studentEmail").value;
  const name = document.getElementById("itemName").value;
  const price = document.getElementById("itemPrice").value;
  const desc = document.getElementById("itemDesc").value;
  const imageInput = document.getElementById("itemImage");

  if (!studentName || !studentEmail || !name || !price || !desc || !imageInput) {
    alert("Please fill in all fields");
    return;
  }

  const reader = new FileReader();

  reader.onload = function () {

    const item = {
      studentName,
      studentEmail,
      name,
      price,
      desc,
      image: reader.result 
    };

    let items = JSON.parse(localStorage.getItem("marketItems")) || [];
    items.push(item);

    localStorage.setItem("marketItems", JSON.stringify(items));

    loadItems();

    document.getElementById("studentName").value = "";
    document.getElementById("studentEmail").value = "";
    document.getElementById("itemName").value = "";
    document.getElementById("itemPrice").value = "";
    document.getElementById("itemDesc").value = "";
    imageInput.value = "";
  };

  if (imageInput.files[0]) {
    reader.readAsDataURL(imageInput.files[0]);
  } else {
    reader.onload();
  }
}

//Load items and save them
function loadItems() {

  const container = document.getElementById("marketContainer");
  if (!container) return;

  const items = JSON.parse(localStorage.getItem("marketItems")) || [];

  container.innerHTML = "";

  if (items.length === 0) {
    container.innerHTML = "<p class='text-center'>No items yet.</p>";
    return;
  }

  items.forEach((item, index) => {

    container.innerHTML += `
      <div class="col-md-4">
        <div class="card shadow-sm p-3 h-100">

          ${item.image ? `<img src="${item.image}" class="img-fluid mb-2" alt="Item image">` : ""}

          <h5>${item.name}</h5>
          <p><strong>Seller:</strong> ${item.studentName}</p>
          <p><strong>Contact:</strong> ${item.studentEmail}</p>
          <p><strong>Price:</strong> $${item.price}</p>
          <p>${item.desc}</p>

          <button class="btn btn-danger btn-sm mt-2" onclick="deleteItem(${index})">
            Delete
          </button>

        </div>
      </div>
    `;
  });
}

// Delete function to delete the item from the marketplace (future improvement: Just people who posted the item can delete them)
function deleteItem(index) {

  let items = JSON.parse(localStorage.getItem("marketItems")) || [];

  items.splice(index, 1);

  localStorage.setItem("marketItems", JSON.stringify(items));

  loadItems();
}