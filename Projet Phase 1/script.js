// URL de l'API locale
const API_URL = "http://localhost:3000/courses";

// Sélection des éléments HTML
const courseListDiv = document.getElementById("course-list");
const courseDetailDiv = document.getElementById("course-detail");
const courseForm = document.getElementById("course-form");
const searchInput = document.getElementById("searchInput");

// Fonction principale au chargement
document.addEventListener("DOMContentLoaded", () => {
  fetchCourses();
  setupForm();
  setupSearch();
});

// 🔁 1. Récupérer et afficher les cours avec map()
function fetchCourses() {
  fetch(API_URL)
    .then(res => res.json())
    .then(courses => {
      displayCourseList(courses); // affiche tout
      setupLikeButtons();         // prépare les likes après affichage
    })
    .catch(err => console.error("Erreur chargement cours :", err));
}

function displayCourseList(courses) {
  courseListDiv.innerHTML = ""; // reset liste
  courses.map(course => {
    const div = document.createElement("div");
    div.className = "course-item";
    div.innerHTML = `
      <h3>${course.title}</h3>
      <p><strong>Formateur :</strong> ${course.instructor}</p>
      <p>❤️ ${course.likes} likes</p>
    `;
    div.addEventListener("click", () => showCourseDetail(course));
    courseListDiv.appendChild(div);
  });
}

// 📄 2. Affichage des détails
function showCourseDetail(course) {
  courseDetailDiv.innerHTML = `
    <h3>${course.title}</h3>
    <p><strong>Formateur :</strong> ${course.instructor}</p>
    <p>${course.description}</p>
    <p><strong>❤️ Likes :</strong> <span id="likes-count">${course.likes}</span></p>
    <button id="like-btn">👍 Aimer ce cours</button>
  `;

  document.getElementById("like-btn").addEventListener("click", () => {
    likeCourse(course);
  });
}

// 👍 3. Liker un cours (mise à jour avec PATCH)
function likeCourse(course) {
  const newLikes = course.likes + 1;

  fetch(`${API_URL}/${course.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ likes: newLikes })
  })
    .then(res => res.json())
    .then(updated => {
      document.getElementById("likes-count").textContent = updated.likes;
      fetchCourses(); // met à jour la liste
    });
}

// 🔍 4. Recherche avec filter()
function setupSearch() {
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();

    fetch(API_URL)
      .then(res => res.json())
      .then(courses => {
        const filtered = courses.filter(course =>
          course.title.toLowerCase().includes(query)
        );
        displayCourseList(filtered);
        setupLikeButtons();
      });
  });
}

// ➕ 5. Formulaire d'ajout
function setupForm() {
  courseForm.addEventListener("submit", event => {
    event.preventDefault();

    const newCourse = {
      title: document.getElementById("title").value,
      instructor: document.getElementById("instructor").value,
      description: document.getElementById("description").value,
      likes: 0
    };

    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCourse)
    })
      .then(res => res.json())
      .then(() => {
        courseForm.reset();
        fetchCourses();
      });
  });
}

// 🧠 6. forEach pour activer tous les boutons (exemple pédagogique)
function setupLikeButtons() {
  const items = document.querySelectorAll(".course-item");
  items.forEach(item => {
    item.style.cursor = "pointer";
  });
}
