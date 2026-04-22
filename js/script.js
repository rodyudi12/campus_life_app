document.addEventListener("DOMContentLoaded", () => {

  // AUTH BUTTON (Login / Logout)
  const authBtn = document.getElementById("authBtn");

  if (authBtn) {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));

    if (user) {
      authBtn.textContent = `Logout (${user.name})`;

      authBtn.addEventListener("click", () => {
        localStorage.removeItem("loggedInUser");
        alert("Logged out!");
        window.location.href = "login.html";
      });

    } else {
      authBtn.textContent = "Login";

      authBtn.addEventListener("click", () => {
        window.location.href = "login.html";
      });
    }
  }


  // CHECK LOGIN (ONLY MARKETPLACE)
  const marketContainer = document.getElementById("marketContainer");

  if (marketContainer) {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));

    if (!user) {
      alert("You must be logged in to access the marketplace");
      window.location.href = "login.html";
      return;
    }

    // Auto-fill user info
    const nameInput = document.getElementById("studentName");
    const emailInput = document.getElementById("studentEmail");

    if (nameInput && emailInput) {
      nameInput.value = user.name;
      emailInput.value = user.email;

      nameInput.readOnly = true;
      emailInput.readOnly = true;
    }
  }


  // EVENTS BUTTONS
  const campusBtn = document.getElementById("campusBtn");
  const ticketBtn = document.getElementById("ticketBtn");

  if (campusBtn) campusBtn.addEventListener("click", loadCampusEvents);
  if (ticketBtn) ticketBtn.addEventListener("click", loadTicketmasterEvents);


  // MARKETPLACE
  const addBtn = document.getElementById("addItemBtn");

  if (addBtn) {
    addBtn.addEventListener("click", addItem);
    loadItems();
  }


  // AUTH FORMS
  const signupBtn = document.getElementById("signupBtn");
  if (signupBtn) signupBtn.addEventListener("click", signupUser);

  const loginBtn = document.getElementById("loginBtn");
  if (loginBtn) loginBtn.addEventListener("click", loginUser);

});


// EVENTS

// On-campus
async function loadCampusEvents() {
  const container = document.getElementById("eventsContainer");
  container.innerHTML = "<p>Loading campus events...</p>";

  try {
    const response = await fetch("data/campusEvents.json");
    const events = await response.json();
    displayEvents(events, "On-Campus Events");
  } catch {
    container.innerHTML = "<p>Failed to load campus events.</p>";
  }
}


// Ticketmaster
async function loadTicketmasterEvents() {
  const container = document.getElementById("eventsContainer");
  container.innerHTML = "<p>Loading off-campus events...</p>";

  const API_KEY = "YOUR_API_KEY_HERE"; // 🔥 replace later
  const url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${API_KEY}&city=St%20Louis&size=6`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    const events = data._embedded?.events || [];

    const formatted = events.map(event => {
      const [y, m, d] = event.dates.start.localDate.split("-");
      const date = new Date(y, m - 1, d);

      return {
        name: event.name,
        date: date.toLocaleDateString(),
        location: event._embedded?.venues?.[0]?.name || "Unknown",
        url: event.url
      };
    });

    displayEvents(formatted, "Off-Campus Events");

  } catch {
    container.innerHTML = "<p>Failed to load events.</p>";
  }
}


// Display events
function displayEvents(events, title) {
  const container = document.getElementById("eventsContainer");
  if (!container) return;

  if (!events.length) {
    container.innerHTML = `<p class="text-center">No events found</p>`;
    return;
  }

  container.innerHTML = `<h3 class="text-center mb-3">${title}</h3>`;

  events.forEach(event => {
    container.innerHTML += `
      <div class="col-md-4 mb-3">
        <div class="card p-3 h-100">
          <h5>${event.name}</h5>
          <p><strong>Date:</strong> ${event.date}</p>
          <p><strong>Location:</strong> ${event.location}</p>
          ${event.url ? `<a href="${event.url}" target="_blank" class="btn btn-outline-primary mt-auto">View Event</a>` : ""}
        </div>
      </div>
    `;
  });
}


// MARKETPLACE

function addItem() {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  const name = document.getElementById("itemName").value;
  const price = document.getElementById("itemPrice").value;
  const desc = document.getElementById("itemDesc").value;
  const imageInput = document.getElementById("itemImage");

  if (!name || !price || !desc) {
    alert("Fill all fields");
    return;
  }

  const reader = new FileReader();

  reader.onload = () => {

    const item = {
      name,
      price,
      desc,
      image: reader.result,
      ownerEmail: user.email,
      ownerName: user.name
    };

    let items = JSON.parse(localStorage.getItem("marketItems")) || [];
    items.push(item);

    localStorage.setItem("marketItems", JSON.stringify(items));

    loadItems();

    // reset form
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


function loadItems() {
  const container = document.getElementById("marketContainer");
  if (!container) return;

  const items = JSON.parse(localStorage.getItem("marketItems")) || [];
  const currentUser = JSON.parse(localStorage.getItem("loggedInUser"));

  container.innerHTML = "";

  if (!items.length) {
    container.innerHTML = "<p class='text-center'>No items yet</p>";
    return;
  }

  items.forEach((item, index) => {

    const canDelete = currentUser && currentUser.email === item.ownerEmail;

    container.innerHTML += `
      <div class="col-md-4">
        <div class="card p-3 h-100">

          ${item.image ? `<img src="${item.image}" class="img-fluid mb-2">` : ""}

          <h5>${item.name}</h5>
          <p><strong>Seller:</strong> ${item.ownerName}</p>
          <p><strong>Email:</strong> ${item.ownerEmail}</p>
          <p><strong>Price:</strong> $${item.price}</p>
          <p>${item.desc}</p>

          ${canDelete ? `<button class="btn btn-danger btn-sm" onclick="deleteItem(${index})">Delete</button>` : ""}

        </div>
      </div>
    `;
  });
}


function deleteItem(index) {
  let items = JSON.parse(localStorage.getItem("marketItems")) || [];
  items.splice(index, 1);
  localStorage.setItem("marketItems", JSON.stringify(items));
  loadItems();
}


// AUTH SYSTEM

function signupUser() {
  const name = document.getElementById("signupName").value;
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;

  if (!name || !email || !password) {
    alert("Fill all fields");
    return;
  }

  localStorage.setItem("user", JSON.stringify({ name, email, password }));

  alert("Account created!");
  window.location.href = "login.html";
}


function loginUser() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    alert("No account found");
    return;
  }

  if (email === user.email && password === user.password) {
    localStorage.setItem("loggedInUser", JSON.stringify(user));
    alert("Login successful!");
    window.location.href = "index.html";
  } else {
    alert("Invalid credentials");
  }
}