/* =========================================================
   RESERVED ROUTE — app.js  (home page)
   ========================================================= */
(function(){
  const W = window.RESERVED_ROUTE;
  const { TRIPS, statusOf, pctTaken, money, regionGradient } = W;
  const reduce = matchMedia("(prefers-reduced-motion:reduce)").matches;

  /* ---------- HERO MANIFEST ---------- */
  const manifestList = document.getElementById("manifest-list");
  function renderManifest(){
    const soon = [...TRIPS].sort((a,b) => (b.left>0)-(a.left>0) || a.left-b.left).slice(0,5);
    manifestList.innerHTML = soon.map((t,i) => {
      const st = statusOf(t);
      return `<li class="m-row" data-id="${t.id}" style="animation-delay:${i*70}ms" tabindex="0" role="link" aria-label="View ${t.name}">
        <span class="m-row__name">${t.name}</span>
        <span class="m-row__seats ${st.s}">${t.left>0 ? `${String(t.left).padStart(2,"0")} / ${t.total} seats` : "sold out"}</span>
        <span class="m-row__date">${t.where} · ${t.date}</span>
        <span class="m-row__meter"><span class="m-row__fill ${st.f}" style="width:${pctTaken(t)}%"></span></span>
      </li>`;
    }).join("");
  }
  function goto(id){ location.href = `destination.html?trip=${id}`; }
  manifestList.addEventListener("click", e => {
    const row = e.target.closest(".m-row"); if(row) goto(row.dataset.id);
  });
  manifestList.addEventListener("keydown", e => {
    if(e.key === "Enter"){ const row = e.target.closest(".m-row"); if(row) goto(row.dataset.id); }
  });

  /* ---------- DEPARTURES GRID ---------- */
  const grid = document.getElementById("trip-grid");
  let region = "all";

  function cardHTML(t){
    const st = statusOf(t);
    const out = st.key === "out";
    const hero = t.photos[0];
    return `<article class="card ${out?"is-out":""}" data-id="${t.id}" data-region="${t.region}">
      <div class="card__tilt">
        <div class="plate" style="background:${regionGradient(t.region)}">
          <img class="plate__img" src="${hero.src}" alt="${hero.caption}" loading="lazy"
               onerror="this.style.display='none'">
          <span class="plate__tag">${t.region}</span>
          <span class="badge ${st.s}">${st.label}</span>
          <span class="plate__coord">${t.coord}</span>
        </div>
        <div class="card__body">
          <h3 class="card__name">${t.name}</h3>
          <span class="card__where">${t.where}</span>
          <p class="card__blurb">${t.blurb}</p>
          <div class="card__meta">
            <span><b>${t.days}</b> days</span>
            <span>Departs <b>${t.date}</b></span>
            <span>Cap <b>${t.total}</b></span>
          </div>
          <div class="avail">
            <div class="avail__top">
              <span class="avail__label ${st.s}">${st.label}</span>
              <span class="avail__price">${money(t.price)} <span>/ person</span></span>
            </div>
            <div class="avail__bar"><span class="avail__fill ${st.f}" style="width:${pctTaken(t)}%"></span></div>
          </div>
          <div class="card__foot">
            <a class="card__view" href="destination.html?trip=${t.id}">View trip &rarr;</a>
            <button class="btn btn--book" data-book="${t.id}" ${out?"disabled":""}>
              ${out ? "Sold out" : "Reserve"}
            </button>
          </div>
        </div>
      </div>
    </article>`;
  }

  function renderGrid(){
    const list = TRIPS.filter(t => region === "all" || t.region === region);
    grid.innerHTML = list.map(cardHTML).join("");
    reveal();
    if(!reduce) grid.querySelectorAll(".card").forEach(addTilt);
  }

  window.refreshTrip = function(id){
    const t = W.tripById(id);
    const card = grid.querySelector(`.card[data-id="${id}"]`);
    if(card){
      const wrap = document.createElement("div");
      wrap.innerHTML = cardHTML(t);
      const node = wrap.firstElementChild;
      node.classList.add("in");
      card.replaceWith(node);
      if(!reduce) addTilt(node);
    }
    renderManifest();
  };

  /* clicks: reserve → modal, view link → default nav, card → detail */
  grid.addEventListener("click", e => {
    const b = e.target.closest("[data-book]");
    if(b){ if(!b.disabled){ e.preventDefault(); window.Booking.open(b.dataset.book); } return; }
    if(e.target.closest("a.card__view")) return;       // let the link navigate
    const card = e.target.closest(".card");
    if(card) goto(card.dataset.id);
  });

  /* ---------- 3D TILT ---------- */
  function addTilt(card){
    const tilt = card.querySelector(".card__tilt");
    const img = card.querySelector(".plate__img");
    let raf = null;
    function move(e){
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - .5;
      const py = (e.clientY - r.top) / r.height - .5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        tilt.style.transform = `rotateX(${(-py*7).toFixed(2)}deg) rotateY(${(px*9).toFixed(2)}deg) translateZ(0)`;
        if(img) img.style.transform = `scale(1.12) translate(${(-px*10).toFixed(1)}px, ${(-py*10).toFixed(1)}px)`;
      });
    }
    function leave(){
      cancelAnimationFrame(raf);
      tilt.style.transform = "";
      if(img) img.style.transform = "";
    }
    card.addEventListener("mousemove", move);
    card.addEventListener("mouseleave", leave);
  }

  /* ---------- FILTERS ---------- */
  const chips = document.querySelectorAll(".chip");
  chips.forEach(chip => {
    chip.addEventListener("click", () => {
      chips.forEach(c => { c.classList.remove("is-active"); c.setAttribute("aria-selected","false"); });
      chip.classList.add("is-active"); chip.setAttribute("aria-selected","true");
      region = chip.dataset.region;
      renderGrid();
    });
  });
  function setCounts(){
    document.querySelectorAll(".chip__n").forEach(el => {
      const r = el.dataset.count;
      el.textContent = r === "all" ? TRIPS.length : TRIPS.filter(t => t.region === r).length;
    });
  }

  /* ---------- SCROLL REVEAL ---------- */
  let io;
  function reveal(){
    const cards = grid.querySelectorAll(".card");
    if(reduce || !("IntersectionObserver" in window)){ cards.forEach(c => c.classList.add("in")); return; }
    io && io.disconnect();
    io = new IntersectionObserver(entries => {
      entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold:.12 });
    cards.forEach((c,i) => { c.style.transitionDelay = `${(i%3)*60}ms`; io.observe(c); });
  }

  /* ---------- HERO MANIFEST PARALLAX (3D float) ---------- */
  const manifest = document.querySelector(".manifest");
  if(manifest && !reduce){
    const hero = document.querySelector(".hero");
    hero.addEventListener("mousemove", e => {
      const r = hero.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - .5;
      const py = (e.clientY - r.top) / r.height - .5;
      manifest.style.transform = `perspective(1100px) rotateX(${(-py*4).toFixed(2)}deg) rotateY(${(px*5).toFixed(2)}deg)`;
    });
    hero.addEventListener("mouseleave", () => { manifest.style.transform = ""; });
  }

  /* ---------- SIGNUP ---------- */
  /* ---- EmailJS config — reuses the same account as booking.js ---- */
  const EJ_SIGNUP = {
    serviceId:   "service_zw3cegc",
    templateId:  "template_d1wrg4v",
    notifyEmail: "contact@reservedroute.com"
  };
  /* ------------------------------------------------------------ */

  const signup = document.getElementById("signup");
  signup.addEventListener("submit", e => {
    e.preventDefault();
    const input = document.getElementById("signup-email");
    const msg = document.getElementById("signup-msg");
    if(!/^\S+@\S+\.\S+$/.test(input.value.trim())){
      msg.style.color = "#c2410c"; msg.textContent = "Enter a valid email so we can reach you."; return;
    }

    emailjs.send(EJ_SIGNUP.serviceId, EJ_SIGNUP.templateId, {
      to_email:     EJ_SIGNUP.notifyEmail,
      signup_email: input.value.trim()
    });

    msg.style.color = ""; msg.textContent = "You're on the list. We'll write the moment a seat frees up.";
    input.value = "";
  });

  /* ---------- NAV ---------- */
  const toggle = document.querySelector(".nav-toggle");
  const mnav = document.getElementById("mobile-nav");
  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!open));
    mnav.hidden = open;
  });
  mnav.addEventListener("click", e => {
    if(e.target.tagName === "A"){ mnav.hidden = true; toggle.setAttribute("aria-expanded","false"); }
  });

  document.getElementById("year").textContent = new Date().getFullYear();
  document.querySelector('[data-stat="routes"]').textContent = TRIPS.length;

  /* ---------- AMBIENT ACTIVITY (cosmetic) ---------- */
  const CITIES = ["Lisbon","Toronto","Berlin","Singapore","Austin","Oslo","Dubai","Melbourne","Cape Town","Seoul"];
  function ambient(){
    if(reduce) return;
    const open = TRIPS.filter(t => t.left > 0);
    if(!open.length) return;
    const t = open[Math.floor(Math.random()*open.length)];
    const c = CITIES[Math.floor(Math.random()*CITIES.length)];
    window.Booking.toast(`<b>Someone in ${c}</b> <span>is viewing ${t.name}.</span>`);
  }

  /* ---------- INIT ---------- */
  renderManifest();
  setCounts();
  renderGrid();
  setTimeout(ambient, 6500);
  setInterval(ambient, 23000);
})();
