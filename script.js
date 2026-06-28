const mobileBtn = document.getElementById('mobileBtn');
const navMenu = document.getElementById('navMenu');
mobileBtn.addEventListener('click', () => {
  navMenu.classList.toggle('active');
});
// Close menu when link clicked (mobile)
navMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth <= 768) {
      navMenu.classList.remove('active');
    }
  });
});