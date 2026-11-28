class SiteNavbar extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <aside class="announcement" aria-label="Official launch dates" aria-live="polite">
        <p class="announcement-title">We will officially launch</p>
        <div class="announcement-countdowns">
          <p>
            <strong data-countdown="southeast-asia">--</strong>
            <span data-countdown-unit="southeast-asia">days</span>
            <span class="announcement-date">in Southeast Asia · Dec 25</span>
          </p>
          <p>
            <strong data-countdown="all">--</strong>
            <span data-countdown-unit="all">days</span>
            <span class="announcement-date">for everyone · Dec 27</span>
          </p>
        </div>
      </aside>
      <header class="main glass">
        <a href="/" id="logo">
          <img id="h-img" src="assets/logo.svg" alt="Zanop Technologies Logo">
          <h2>Zanop Technologies</h2>
        </a>

        <nav class="list" aria-label="Main navigation">
          <a href="index.html">Home</a>
          <a href="about.html">About</a>
          <a href="contact.html">Contact Us</a>
          <a href="downloads.html">Downloads</a>
          <a href="team.html">The Team</a>
        </nav>
      </header>
    `;

    const getDaysUntil = (month, day, timeZone) => {
      const parts = new Intl.DateTimeFormat("en-US", {
        timeZone,
        year: "numeric",
        month: "numeric",
        day: "numeric",
      }).formatToParts(new Date());
      const today = Object.fromEntries(
        parts.map(({ type, value }) => [type, Number(value)]),
      );
      const currentDate = Date.UTC(today.year, today.month - 1, today.day);
      let targetDate = Date.UTC(today.year, month - 1, day);

      return (targetDate - currentDate) / 86_400_000;
    };

    const countdowns = [
      {
        name: "southeast-asia",
        timeZone: "Asia/Singapore",
        day: 25,
      },
      {
        name: "all",
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
        day: 27,
      },
    ];

    let completedCount = 0;

    countdowns.forEach(({ name, timeZone, day }) => {
      const days = getDaysUntil(12, day, timeZone);
      const countdown = this.querySelector(
        `[data-countdown="${name}"]`,
      ).closest("p");

      if (days <= 0) {
        countdown.hidden = true;
        completedCount += 1;
      } else {
        this.querySelector(`[data-countdown="${name}"]`).textContent = days;
        this.querySelector(`[data-countdown-unit="${name}"]`).textContent =
          days === 1 ? "day" : "days";
      }
    });

    if (completedCount === countdowns.length) {
      this.querySelector(".announcement").hidden = true;
    }

    const currentPage =
      window.location.pathname.split("/").pop() || "index.html";

    this.querySelectorAll("nav a").forEach((link) => {
      if (link.getAttribute("href") === currentPage) {
        link.setAttribute("aria-current", "page");
      }
    });
  }
}

customElements.define("site-navbar", SiteNavbar);
