/* Sxoiu Coelho — portfolio interactions (shared by every page) */
(() => {
  // Where the contact form on the home page sends to (opens the visitor's email app).
  // To receive messages without an email app, swap this for a Formspree endpoint.
  const CONTACT_EMAIL = "sxoiuberlin@gmail.com";

  // Fanzine pages. Put each page image in assets/fanzine/ and write its file name here.
  // Spreads only appear once both of their pages are filled in. Pages 6–7 are one A4 sheet.
  const FANZINE = {
    cover: "assets/fanzine/cover-wrap.webp", // A4 wrap: left half = back cover, right half = front cover
    pages: { 2: "", 3: "", 4: "", 5: "", "6-7": "", 8: "", 9: "", 10: "", 11: "" },
  };

  const DESIGN_WIDTH = 1728;
  const CAROUSEL_W = 1063.797, CAROUSEL_H = 645.37;

  /* ---------- Home: scale the 1728px desktop canvas to the window ---------- */
  const desk = document.querySelector(".desk");
  const fitDesk = () => desk && desk.style.setProperty("--z", (document.documentElement.clientWidth / DESIGN_WIDTH).toFixed(5));
  fitDesk();

  /* ---------- Typewriter headline (50ms per character, 44s loop) ---------- */
  document.querySelectorAll(".typewriter").forEach((el) => {
    let i = 0;
    const walk = (node) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === Node.TEXT_NODE) {
          const frag = document.createDocumentFragment();
          for (const c of n.textContent) {
            if (/\s/.test(c)) { frag.append(c); continue; }
            const s = document.createElement("span");
            s.className = "ch";
            s.setAttribute("aria-hidden", "true");
            s.textContent = c;
            s.style.animationDelay = `${i++ * 50}ms`;
            frag.append(s);
          }
          n.replaceWith(frag);
        } else if (n.nodeType === Node.ELEMENT_NODE) walk(n);
      });
    };
    el.setAttribute("aria-label", el.textContent.replace(/\s+/g, " ").trim());
    walk(el);
  });

  /* ---------- Phone mockup carousel ---------- */
  const tpl = document.getElementById("carousel-tpl");
  const CENTER_LEFT = 398.92, STEP = 274.82, SIDE_L = 152.48, SIDE_R = 702.11;
  const fitHosts = [];

  if (tpl) document.querySelectorAll("[data-carousel]").forEach((host) => {
    host.append(tpl.content.cloneNode(true));
    const root = host.querySelector(".carousel");
    const phones = [...root.querySelectorAll(".phone")];
    const dots = [...root.querySelectorAll(".carousel__dots button")];
    let active = Number(root.dataset.active) || 0;

    const render = () => {
      phones.forEach((p, i) => {
        const d = i - active;
        let left = CENTER_LEFT;
        if (d < 0) left = SIDE_L + (d + 1) * STEP;
        if (d > 0) left = SIDE_R + (d - 1) * STEP;
        p.style.left = `${left}px`;
        p.classList.toggle("is-active", d === 0);
        p.setAttribute("aria-current", d === 0 ? "true" : "false");
      });
      dots.forEach((dot, i) => dot.classList.toggle("is-active", i === active));
    };
    const go = (i) => { active = (i + phones.length) % phones.length; render(); };

    phones.forEach((p, i) => p.addEventListener("click", () => go(i)));
    dots.forEach((d, i) => d.addEventListener("click", () => go(i)));
    root.querySelector(".carousel__arrow--prev").addEventListener("click", () => go(active - 1));
    root.querySelector(".carousel__arrow--next").addEventListener("click", () => go(active + 1));
    swipe(root, (dir) => go(active + dir));
    render();
    if (host.hasAttribute("data-fit")) fitHosts.push(host);
  });

  const fitCarousels = () => fitHosts.forEach((h) => {
    const s = h.clientWidth / CAROUSEL_W;
    h.style.setProperty("--s", s);
    h.style.height = `${CAROUSEL_H * s}px`;
  });
  fitCarousels();

  function swipe(el, cb) {
    let x0 = null;
    el.addEventListener("touchstart", (e) => (x0 = e.touches[0].clientX), { passive: true });
    el.addEventListener("touchend", (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 30) cb(dx < 0 ? 1 : -1);
      x0 = null;
    });
  }

  /* ---------- Contact form (home page) ---------- */
  const formTpl = document.getElementById("form-tpl");
  if (formTpl) document.querySelectorAll("[data-form]").forEach((host) => {
    host.append(formTpl.content.cloneNode(true));
    const form = host.querySelector("form");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let ok = true;
      form.querySelectorAll("[required]").forEach((f) => {
        const bad = !f.value.trim() || (f.type === "email" && !/^\S+@\S+\.\S+$/.test(f.value));
        f.classList.toggle("is-error", bad);
        if (bad) ok = false;
      });
      if (!ok) return;
      const { name, email, message } = Object.fromEntries(new FormData(form));
      const subject = encodeURIComponent(`Portfolio contact from ${name}`);
      const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    });
    form.addEventListener("input", (e) => e.target.classList.remove("is-error"));
  });

  /* ---------- Home menu bar: smooth scroll + scroll spy ---------- */
  const order = ["home", "work", "contact"];
  const menu = document.querySelector(".menu");
  const tabs = [...document.querySelectorAll(".menu__tab")];
  const headerH = () => document.querySelector(".menubar").offsetHeight;
  const visibleSection = (name) =>
    [...document.querySelectorAll(`[data-section="${name}"]`)].find((s) => s.getClientRects().length);
  const isHome = !!document.querySelector("[data-section]");

  if (isHome) {
    const setTab = (name) => {
      menu.style.setProperty("--tab", order.indexOf(name));
      tabs.forEach((t) => t.classList.toggle("is-active", t.dataset.target === name));
    };
    document.addEventListener("click", (e) => {
      const link = e.target.closest("[data-target]");
      if (!link) return;
      const sec = visibleSection(link.dataset.target);
      if (!sec) return;
      e.preventDefault();
      const top = link.dataset.target === "home" ? 0 : sec.getBoundingClientRect().top + window.scrollY - headerH();
      window.scrollTo({ top: Math.max(0, top) });
      history.replaceState(null, "", `#${link.dataset.target}`);
    });
    const spy = () => {
      const line = headerH() + window.innerHeight * 0.3;
      let current = "home";
      order.forEach((name) => {
        const s = visibleSection(name);
        if (s && s.getBoundingClientRect().top <= line) current = name;
      });
      setTab(current);
    };
    window.addEventListener("scroll", spy, { passive: true });
    window.addEventListener("resize", spy);
    spy();
    // arriving from another page with #work / #contact
    const hash = location.hash.slice(1);
    if (order.includes(hash) && hash !== "home") {
      window.addEventListener("load", () => {
        const sec = visibleSection(hash);
        if (sec) window.scrollTo({ top: sec.getBoundingClientRect().top + window.scrollY - headerH(), behavior: "instant" });
      });
    }
  }

  /* ---------- Lightbox ---------- */
  const dlg = document.querySelector(".lightbox");
  const openLightbox = (src, alt) => {
    if (!dlg) return;
    const img = dlg.querySelector("img");
    img.src = src; img.alt = alt || "";
    dlg.showModal();
  };
  if (dlg) dlg.addEventListener("click", () => dlg.close());

  /* ---------- Illustration gallery ---------- */
  document.querySelectorAll("[data-gallery]").forEach((g) => {
    const track = g.querySelector(".gallery__track");
    const slides = [...g.querySelectorAll(".gallery__slide")];
    const thumbs = [...g.querySelectorAll(".gallery__thumbs button")];
    const count = g.querySelector(".gallery__count");
    let i = 0;
    const go = (n) => {
      i = (n + slides.length) % slides.length;
      track.style.transform = `translateX(${-100 * i}%)`;
      thumbs.forEach((t, k) => t.classList.toggle("is-active", k === i));
      thumbs[i].scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
      count.textContent = `${i + 1} / ${slides.length}`;
    };
    g.querySelector(".gallery__arrow--prev").addEventListener("click", () => go(i - 1));
    g.querySelector(".gallery__arrow--next").addEventListener("click", () => go(i + 1));
    thumbs.forEach((t, k) => t.addEventListener("click", () => go(k)));
    slides.forEach((s) => s.addEventListener("click", () => openLightbox(s.dataset.full, s.querySelector("img").alt)));
    swipe(g.querySelector(".gallery__viewport"), (dir) => go(i + dir));
    document.addEventListener("keydown", (e) => {
      if (dlg && dlg.open) return;
      if (e.key === "ArrowRight") go(i + 1);
      if (e.key === "ArrowLeft") go(i - 1);
    });
  });

  /* ---------- Fanzine page turner ---------- */
  document.querySelectorAll("[data-zine]").forEach((z) => {
    const P = FANZINE.pages;
    const views = [{ label: "Front cover", right: { src: FANZINE.cover, cls: "is-front" } }];
    [[2, 3], [4, 5], ["6-7"], [8, 9], [10, 11]].forEach((pair) => {
      if (pair.length === 1 && P[pair[0]]) views.push({ label: "Pages 6–7", wide: { src: P[pair[0]] } });
      else if (pair.length === 2 && P[pair[0]] && P[pair[1]])
        views.push({ label: `Pages ${pair[0]}–${pair[1]}`, left: { src: P[pair[0]] }, right: { src: P[pair[1]] } });
    });
    views.push({ label: "Back cover", left: { src: FANZINE.cover, cls: "is-back" } });

    const left = z.querySelector(".zine__page--left");
    const right = z.querySelector(".zine__page--right");
    const prev = z.querySelector(".zine__arrow--prev");
    const next = z.querySelector(".zine__arrow--next");
    const label = z.querySelector(".zine__label");
    let v = 0;

    const fill = (el, page) => {
      const img = el.querySelector("img");
      el.classList.toggle("is-empty", !page);
      if (page) { img.src = page.src; img.className = page.cls || ""; }
    };
    const render = () => {
      const view = views[v];
      left.classList.toggle("zine__page--wide", !!view.wide);
      fill(left, view.wide || view.left);
      fill(right, view.wide ? null : view.right);
      label.textContent = view.label;
      prev.disabled = v === 0;
      next.disabled = v === views.length - 1;
    };
    const go = (n) => {
      if (n < 0 || n >= views.length || n === v) return;
      z.classList.add("is-turning");
      setTimeout(() => { v = n; render(); z.classList.remove("is-turning"); }, 220);
    };
    prev.addEventListener("click", () => go(v - 1));
    next.addEventListener("click", () => go(v + 1));
    left.addEventListener("click", () => (views[v].wide ? go(v + 1) : go(v - 1)));
    right.addEventListener("click", () => go(v + 1));
    swipe(z, (dir) => go(v + dir));
    render();
  });

  /* ---------- Videos: play when the file exists, otherwise keep the poster ---------- */
  document.querySelectorAll("[data-video]").forEach((vid) => {
    const enable = () => {
      vid.controls = true;
      new IntersectionObserver((entries) => entries.forEach((en) =>
        en.isIntersecting ? vid.play().catch(() => {}) : vid.pause()), { threshold: .4 }).observe(vid);
    };
    if (vid.readyState >= 1) enable(); else vid.addEventListener("loadedmetadata", enable, { once: true });
  });

  /* ---------- Optional links: show once filled in ---------- */
  document.querySelectorAll("[data-proto]").forEach((p) => {
    const a = p.querySelector("a");
    if (a && a.getAttribute("href")) p.hidden = false;
  });

  window.addEventListener("resize", () => { fitDesk(); fitCarousels(); });
})();
