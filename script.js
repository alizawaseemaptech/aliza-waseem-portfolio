// ---------------------
// Basic helpers & variables
// ---------------------
const header = document.getElementById('site-header');
const nav = document.getElementById('nav-links');
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.querySelectorAll('.nav-link');
const themeBtn = document.getElementById('theme-toggle');

// Set header height CSS variable dynamically (in case device/responsive)
function updateHeaderHeightVar() {
  const h = Math.round(header.getBoundingClientRect().height);
  document.documentElement.style.setProperty('--header-h', `${h}px`);
}
window.addEventListener('resize', updateHeaderHeightVar);
updateHeaderHeightVar();

// ---------------------
// Mobile nav toggle
// ---------------------
navToggle.addEventListener('click', () => {
  nav.classList.toggle('open');
  navToggle.classList.toggle('open');
});

// Close nav when clicking a link (mobile)
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    // if link is external (target blank), don't intercept
    const href = link.getAttribute('href') || '';
    if (href.startsWith('http') || link.target === '_blank') {
      nav.classList.remove('open');
      return;
    }

    // Smooth scroll with offset to account for sticky header
    e.preventDefault();
    const targetId = href.replace('#','');
    const targetEl = document.getElementById(targetId);
    if (!targetEl) return;

    // compute top offset (header height + small gap)
    const headerHeight = header.getBoundingClientRect().height;
    const y = targetEl.getBoundingClientRect().top + window.pageYOffset - headerHeight - 12;

    window.scrollTo({
      top: Math.max(y, 0),
      behavior: 'smooth'
    });

    // close mobile nav
    nav.classList.remove('open');

    // set active class immediately (visual feedback)
    navLinks.forEach(n => n.classList.remove('active'));
    link.classList.add('active');
  });
});

// ---------------------
// IntersectionObserver to set active nav link correctly on scroll
// ---------------------
const sections = document.querySelectorAll('.section');
const observerOptions = {
  root: null,
  rootMargin: `-${Math.round(header.getBoundingClientRect().height)}px 0px 0px 0px`,
  threshold: [0.15, 0.5, 0.9]
};

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // find nav link for this section
      const id = entry.target.id;
      navLinks.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
      });
    }
  });
}, observerOptions);

sections.forEach(s => sectionObserver.observe(s));

// ---------------------
// Fade in on scroll (existing behavior) - reuse same observer or separate
// ---------------------
const faders = document.querySelectorAll('.fade');
const appearOptions = { threshold: 0.15, rootMargin: "0px 0px -20px 0px" };
const appearOnScroll = new IntersectionObserver(function(entries, observer){
  entries.forEach(entry => {
    if(!entry.isIntersecting) return;
    entry.target.classList.add("visible");
    observer.unobserve(entry.target);
  });
}, appearOptions);
faders.forEach(fader => appearOnScroll.observe(fader));

// ---------------------
// Theme toggle
// ---------------------
themeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  themeBtn.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
});

// ---------------------
// EmailJS init + contact form
// ---------------------
(function(){
  if (typeof emailjs !== 'undefined' && emailjs.init) {
    try { emailjs.init("ZCFU77tah9UtBYfZN"); } catch(e){ console.warn('EmailJS init err', e); }
  }
})();

const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', function(e){
    e.preventDefault();
    const status = document.getElementById('status');
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !message) {
      status.innerText = 'Please fill all fields.';
      status.style.color = 'red';
      return;
    }

    if (typeof emailjs !== 'undefined' && emailjs.send) {
      emailjs.send("service_4j8slre", "template_76fuqvp", {
        from_name: name,
        from_email: email,
        message: message
      }).then(() => {
        status.innerText = "Message sent successfully!";
        status.style.color = "green";
        contactForm.reset();
      }).catch((error) => {
        console.error("EmailJS error:", error);
        status.innerText = "Failed to send. Try again!";
        status.style.color = "red";
      });
    } else {
      status.innerText = "Email service not available.";
      status.style.color = "red";
    }
  });
}
