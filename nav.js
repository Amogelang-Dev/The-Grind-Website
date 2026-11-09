(() => {
    function renderNavigation() {
        const host = document.querySelector('#header-placeholder, #header-container');
        if (!host) return;

        if (!document.querySelector('link[data-site-navigation]')) {
            const stylesheet = document.createElement('link');
            stylesheet.rel = 'stylesheet';
            stylesheet.href = 'nav.css';
            stylesheet.dataset.siteNavigation = 'true';
            document.head.appendChild(stylesheet);
        }

        host.innerHTML = `
            <nav class="site-nav">
                <a href="index.html" class="logo">THE GRIND.</a>
                <button class="menu-toggle" id="mobile-menu" type="button" aria-label="Toggle navigation" aria-expanded="false">
                    <span class="bar"></span><span class="bar"></span><span class="bar"></span>
                </button>
                <ul class="nav-links" id="nav-list">
                    <li><a href="index.html">Home</a></li>
                    <li><a href="menu.html">Menu</a></li>
                    <li><a href="workspace.html">Workspace</a></li>
                    <li><a href="hire-me.html">Hire Me</a></li>
                    <li><a href="contact.html">Contact</a></li>
                    <li class="auth-logged-in" style="display:none"><a href="tracker.html" class="tracker-link"><span class="live-dot"></span> Tracker</a></li>
                    <li class="auth-logged-in" style="display:none"><a href="profile.html" aria-label="My profile"><span class="nav-avatar" id="userInitial">U</span></a></li>
                    <li class="auth-logged-in" style="display:none"><a href="login.html" class="logout-icon" title="Logout" onclick="logoutUser()"><i class="fas fa-sign-out-alt"></i></a></li>
                    <li class="auth-logged-out"><a href="login.html">Login</a></li>
                </ul>
            </nav>`;

        if (typeof window.logoutUser !== 'function') {
            window.logoutUser = () => {
                localStorage.removeItem('user_session');
                window.location.href = 'login.html';
            };
        }

        let user = null;
        try {
            user = JSON.parse(localStorage.getItem('user_session') || 'null');
        } catch (error) {
            user = null;
        }
        document.querySelectorAll('.auth-logged-in').forEach(element => element.style.display = user?.user_id ? 'block' : 'none');
        document.querySelectorAll('.auth-logged-out').forEach(element => element.style.display = user?.user_id ? 'none' : 'block');
        const initial = document.getElementById('userInitial');
        if (initial) initial.textContent = user?.user_name?.charAt(0).toUpperCase() || 'U';

        const toggle = document.getElementById('mobile-menu');
        const links = document.getElementById('nav-list');
        toggle?.addEventListener('click', () => {
            const expanded = toggle.getAttribute('aria-expanded') === 'true';
            toggle.setAttribute('aria-expanded', String(!expanded));
            toggle.classList.toggle('is-active', !expanded);
            links.classList.toggle('active', !expanded);
        });
        links.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
            toggle?.classList.remove('is-active');
            toggle?.setAttribute('aria-expanded', 'false');
            links.classList.remove('active');
        }));
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderNavigation, { once: true });
    } else {
        renderNavigation();
    }
})();