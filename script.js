// DARK/LIGHT MODE
const themeBtn = document.getElementById("theme-toggle");
themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  themeBtn.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
});

// EMAILJS INIT
(function(){
  emailjs.init("ZCFU77tah9UtBYfZN"); // Public Key
})();

// CONTACT FORM
document.getElementById("contact-form").addEventListener("submit", function(e){
  e.preventDefault();
  emailjs.send("service_4j8slre", "template_76fuqvp", {
    from_name: document.getElementById("name").value,
    from_email: document.getElementById("email").value,
    message: document.getElementById("message").value
  }).then(() => {
    const status = document.getElementById("status");
    status.innerText = "Message sent successfully!";
    status.style.color = "green";
  }).catch((error) => {
    console.error("Error:", error);
    const status = document.getElementById("status");
    status.innerText = "Failed to send. Try again!";
    status.style.color = "red";
  });
  e.target.reset();
});

// FADE IN ANIMATION ON SCROLL
const faders = document.querySelectorAll(".fade");
const appearOptions = { threshold: 0.2, rootMargin: "0px 0px -50px 0px" };
const appearOnScroll = new IntersectionObserver(function(entries, observer){
  entries.forEach(entry => {
    if(!entry.isIntersecting) return;
    entry.target.classList.add("visible");
    observer.unobserve(entry.target);
  });
}, appearOptions);
faders.forEach(fader => appearOnScroll.observe(fader));
