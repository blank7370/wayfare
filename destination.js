/* =========================================================
   RESERVED ROUTE — destination.js  (detail page)
   Reads ?trip=<id>, renders the trip + a photo gallery.
   ========================================================= */
(function(){
  const W = window.RESERVED_ROUTE;
  const { statusOf, pctTaken, money, regionGradient } = W;
  const reduce = matchMedia("(prefers-reduced-motion:reduce)").matches;

  const id = new URLSearchParams(location.search).get("trip");
  const t = W.tripById(id);
  const root = document.getElementById("trip-root");

  if(!t){
    root.innerHTML = `<div class="d-missing">
      <h1>That trip isn't on the board</h1>
      <p>The departure you're after may have closed, or the link's gone astray.</p>
      <a class="btn btn--solid" href="index.html#departures">Back to all departures</a>
    </div>`;
    return;
  }

  document.title = `${t.name} — Reserved Route`;

  function availBlock(){
    const st = statusOf(t);
    const out = st.key === "out";
    return `
      <div class="d-avail" id="d-avail">
        <div class="d-avail__row">
          <span class="d-avail__label ${st.s}">${st.label}</span>
          <span class="d-avail__price">${money(t.price)} <span>/ person</span></span>
        </div>
        <div class="d-avail__bar"><span class="d-avail__fill ${st.f}" style="width:${pctTaken(t)}%"></span></div>
        <button class="btn btn--solid d-reserve" data-book="${t.id}" ${out?"disabled":""}>
          ${out ? "Sold out — join the waitlist below" : "Reserve a seat"}
        </button>
      </div>`;
  }

  function render(){
    const hero = t.photos[0];
    root.innerHTML = `
      <a class="d-back" href="index.html#departures">&larr; All departures</a>

      <header class="d-hero">
        <div class="d-hero__media" style="background:${regionGradient(t.region)}">
          <img src="${hero.src}" alt="${hero.caption}" onerror="this.style.display='none'">
          <span class="d-hero__region">${t.region} · ${t.coord}</span>
        </div>
        <div class="d-hero__copy">
          <p class="eyebrow">${t.where} · ${t.days} days</p>
          <h1 class="d-title">${t.name}</h1>
          <p class="d-lede">${t.long}</p>
          <dl class="d-facts">
            <div><dt>Departs</dt><dd>${t.date}</dd></div>
            <div><dt>Duration</dt><dd>${t.days} days</dd></div>
            <div><dt>Group cap</dt><dd>${t.total}</dd></div>
          </dl>
          ${availBlock()}
        </div>
      </header>

      <section class="d-section">
        <h2 class="d-h2">What makes it</h2>
        <ul class="d-highlights">
          ${t.highlights.map(h => `<li>${h}</li>`).join("")}
        </ul>
      </section>

      <section class="d-section">
        <h2 class="d-h2">The route</h2>
        <ol class="d-route">
          ${t.stops.map((s,i) => `<li class="d-stop">
            <span class="d-stop__n">${String(i+1).padStart(2,"0")}</span>
            <div><h3>${s[0]}</h3><p>${s[1]}</p></div>
          </li>`).join("")}
        </ol>
      </section>

      <section class="d-section">
        <h2 class="d-h2">Photos from the route</h2>
        <div class="d-gallery" id="gallery">
          ${t.photos.map((p,i) => `<figure class="g-item g-item--${i%5}" data-i="${i}">
            <div class="g-item__media" style="background:${regionGradient(t.region)}">
              <img src="${p.src}" alt="${p.caption}" loading="lazy" onerror="this.style.display='none'">
            </div>
            <figcaption>${p.caption}</figcaption>
          </figure>`).join("")}
        </div>
      </section>

      <section class="d-section">
        <h2 class="d-h2">In the price</h2>
        <ul class="d-included">
          ${t.included.map(x => `<li>${x}</li>`).join("")}
        </ul>
      </section>

      <section class="d-cta">
        <div>
          <h2>${t.left>0 ? "Hold your seat before it's gone" : "This date is full"}</h2>
          <p>${t.left>0
            ? `${t.left} of ${t.total} seats remain on the ${t.date} departure. We cap the group at ${t.total} and don't reopen it.`
            : `The ${t.date} departure sold out. Leave your email and we'll tell you the moment a seat frees up or a new date opens.`}</p>
        </div>
        ${t.left>0
          ? `<button class="btn btn--solid d-reserve" data-book="${t.id}">Reserve a seat</button>`
          : `<form class="signup" id="d-signup" novalidate>
               <input id="d-signup-email" type="email" placeholder="you@somewhere.far" autocomplete="email">
               <button class="btn btn--solid" type="submit">Notify me</button>
               <p class="signup__msg" id="d-signup-msg" role="status" aria-live="polite"></p>
             </form>`}
      </section>
    `;

    wire();
  }

  /* refresh availability after a booking */
  window.refreshTrip = function(){
    const block = document.getElementById("d-avail");
    if(block) block.outerHTML = availBlock();
    wire(); // rebind the (new) reserve button
  };

  function wire(){
    document.querySelectorAll("[data-book]").forEach(b => {
      b.onclick = () => { if(!b.disabled) window.Booking.open(t.id); };
    });
    setupGallery();
    if(!reduce) setupTilt();

    const sf = document.getElementById("d-signup");
    if(sf){
      sf.addEventListener("submit", e => {
        e.preventDefault();
        const input = document.getElementById("d-signup-email");
        const msg = document.getElementById("d-signup-msg");
        if(!/^\S+@\S+\.\S+$/.test(input.value.trim())){
          msg.style.color = "#c2410c"; msg.textContent = "Enter a valid email."; return;
        }
        msg.style.color = ""; msg.textContent = "You're on the list for this date.";
        input.value = "";
      });
    }
  }

  /* ---------- 3D tilt on gallery tiles ---------- */
  function setupTilt(){
    document.querySelectorAll(".g-item").forEach(item => {
      const media = item.querySelector(".g-item__media");
      let raf;
      item.addEventListener("mousemove", e => {
        const r = item.getBoundingClientRect();
        const px = (e.clientX - r.left)/r.width - .5;
        const py = (e.clientY - r.top)/r.height - .5;
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          media.style.transform = `rotateX(${(-py*8).toFixed(2)}deg) rotateY(${(px*10).toFixed(2)}deg)`;
        });
      });
      item.addEventListener("mouseleave", () => { cancelAnimationFrame(raf); media.style.transform = ""; });
    });
  }

  /* ---------- lightbox ---------- */
  let lbIndex = 0;
  const lb = document.getElementById("lightbox");
  const lbImg = document.getElementById("lb-img");
  const lbCap = document.getElementById("lb-cap");

  function openLightbox(i){
    lbIndex = i;
    show();
    lb.hidden = false;
    document.body.style.overflow = "hidden";
  }
  function closeLightbox(){
    lb.hidden = true;
    document.body.style.overflow = "";
  }
  function show(){
    const p = t.photos[lbIndex];
    lbImg.style.opacity = 0;
    lbImg.src = p.src.replace(/w=\d+/, "w=2000");
    lbImg.alt = p.caption;
    lbCap.textContent = p.caption;
    lbImg.onload = () => { lbImg.style.opacity = 1; };
  }
  function step(d){ lbIndex = (lbIndex + d + t.photos.length) % t.photos.length; show(); }

  function setupGallery(){
    document.querySelectorAll(".g-item").forEach(item => {
      item.addEventListener("click", () => openLightbox(+item.dataset.i));
    });
  }
  lb.addEventListener("click", e => { if(e.target.matches("[data-close]")) closeLightbox(); });
  document.getElementById("lb-prev").addEventListener("click", () => step(-1));
  document.getElementById("lb-next").addEventListener("click", () => step(1));
  document.addEventListener("keydown", e => {
    if(lb.hidden) return;
    if(e.key === "Escape") closeLightbox();
    if(e.key === "ArrowLeft") step(-1);
    if(e.key === "ArrowRight") step(1);
  });

  render();
})();
