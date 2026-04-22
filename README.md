# Campus Life Hub 🎓

Campus Life Hub is a simple web application designed to help students explore campus events, off-campus events, dining options, and a student marketplace where users can buy and sell items.


## Features

### Events
- View **on-campus events** (from a local JSON file)
- View **off-campus events** using the Ticketmaster API
- Clean card-based layout for easy browsing

### Marketplace
- Students can post items for sale
- Upload item images
- Includes:
  - Student name
  - Student email
  - Item name, price, and description
- Items are stored in **localStorage**
- Users can delete only their own posts

### Authentication (Basic)
- Simple signup and login system using localStorage
- Logged-in users can:
  - Access the marketplace
  - Post items
- Logout button replaces login when signed in

---

## Technologies Used

- HTML5
- CSS3 (Bootstrap 5)
- JavaScript (Vanilla JS)
- LocalStorage (for user data and marketplace)
- Ticketmaster API (for events)

---

## Project Structure
/project-root
│
├── index.html
├── events.html
├── marketplace.html
├── dining.html
├── signup.html
├── login.html
│
├── css/
│ └── style.css
│
├── js/
│ └── script.js
│
├── data/
│ └── campusEvents.json
│
├── images/
├── campus.jpg
├── logo.png
|
└── README.md


## Notes

- This project uses **localStorage**, so data is stored only in the browser
- Images uploaded in the marketplace are stored as base64 strings
- Authentication is for demo purposes only (not secure for production)

## Future Improvements

- Real backend database (Firebase / Node.js)
- Allow just students and faculty to use the marketplace
- Chat system between buyers and sellers
- Profile pages for users


