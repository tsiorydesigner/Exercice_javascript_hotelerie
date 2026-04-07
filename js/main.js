 function toggleMenu() {
            document.getElementById('navLinks').classList.toggle('active');
            document.getElementById('hamburger').classList.toggle('active');
        }

        function scrollToMenu() {
            document.getElementById('menu').scrollIntoView({
                behavior: 'smooth'
            });
        }

