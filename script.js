// ============================================
// MADHAV STUDIOS — MAIN WEBSITE
// ============================================

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

// Footer year
const yearElement = document.getElementById("year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}


// ============================================
// LOAD HOMEPAGE CONTENT
// ============================================

async function loadHomepageContent() {

  const { data, error } = await supabaseClient
    .from("site_content")
    .select("*");

  if (error) {
    console.error("Could not load website content:", error);
    return;
  }

  if (!data) return;

  const hero = data.find(item => item.section === "hero");

  if (!hero) return;


  // Brand name
  const brandElements = document.querySelectorAll(
    "[data-content='brand']"
  );

  brandElements.forEach(element => {
    if (hero.title) {
      element.textContent = hero.title;
    }
  });


  // Main headline
  const headlineElements = document.querySelectorAll(
    "[data-content='headline']"
  );

  headlineElements.forEach(element => {
    if (hero.subtitle) {
      element.textContent = hero.subtitle;
    }
  });


  // Description
  const descriptionElements = document.querySelectorAll(
    "[data-content='description']"
  );

  descriptionElements.forEach(element => {
    if (hero.description) {
      element.textContent = hero.description;
    }
  });
}


// ============================================
// LOAD PROJECTS
// ============================================

async function loadProjects() {

  const container = document.querySelector(
    "[data-projects]"
  );

  if (!container) return;

  const { data, error } = await supabaseClient
    .from("projects")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Could not load projects:", error);
    return;
  }

  if (!data || data.length === 0) return;

  container.innerHTML = data.map(project => {

    return `
      <article class="work-card">

        ${
          project.image_url
            ? `<img
                src="${project.image_url}"
                alt="${project.title || "Project"}"
                loading="lazy"
              >`
            : ""
        }

        <div class="work-card-content">

          <div class="work-category">
            ${project.category || ""}
          </div>

          <h3>
            ${project.title || ""}
          </h3>

          <p>
            ${project.description || ""}
          </p>

        </div>

      </article>
    `;

  }).join("");
}


// ============================================
// MOBILE NAVIGATION
// ============================================

const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector("nav");

if (menuButton && nav) {

  menuButton.addEventListener("click", () => {
    nav.classList.toggle("active");
  });

}


// ============================================
// SMOOTH SCROLL
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(link => {

  link.addEventListener("click", function(event) {

    const target = document.querySelector(
      this.getAttribute("href")
    );

    if (!target) return;

    event.preventDefault();

    target.scrollIntoView({
      behavior: "smooth"
    });

  });

});


// ============================================
// SCROLL REVEAL
// ============================================

const revealElements =
  document.querySelectorAll(".reveal");

const revealObserver =
  new IntersectionObserver((entries) => {

    entries.forEach(entry => {

      if (entry.isIntersecting) {

        entry.target.classList.add("visible");

        revealObserver.unobserve(entry.target);

      }

    });

  }, {
    threshold: 0.12
  });


revealElements.forEach(element => {
  revealObserver.observe(element);
});


// ============================================
// START
// ============================================

document.addEventListener("DOMContentLoaded", async () => {

  await loadHomepageContent();

  await loadProjects();

});
