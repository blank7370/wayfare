/* =========================================================
   WAYFARE — booking.js  (shared modal + toasts)
   Requires #modal, #modal-body, #toasts in the page.
   After a reservation it calls window.refreshTrip(id) if the
   page defines one, so each page can update its own UI.
   ========================================================= */
(function(){
  const { statusOf, money } = window.WAYFARE;
  const W = window.WAYFARE;

  /* ---- EmailJS config — fill these in after EmailJS setup ---- */
  const EJ = {
    publicKey:  "YOUR_PUBLIC_KEY",   // Account > API Keys
    serviceId:  "YOUR_SERVICE_ID",   // Email Services tab
    templateId: "YOUR_TEMPLATE_ID",  // Email Templates tab
    notifyEmail:"YOUR_COMPANY_EMAIL" // e.g. bookings@yourcompany.com
  };
  emailjs.init({ publicKey: EJ.publicKey });
  /* ------------------------------------------------------------ */

  const modal = document.getElementById("modal");
  const modalBody = document.getElementById("modal-body");
  const toastWrap = document.getElementById("toasts");
  let qty = 1, lastFocus = null;

  /* ---- modal ---- */
  function open(id){
    const t = W.tripById(id);
    if(!t || t.left <= 0) return;
    qty = 1; lastFocus = document.activeElement;
    modalBody.innerHTML = formHTML(t);
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    wireForm(t);
    modalBody.querySelector("#m-name-input")?.focus();
  }
  function close(){
    modal.hidden = true;
    document.body.style.overflow = "";
    lastFocus && lastFocus.focus();
  }

  function formHTML(t){
    const max = Math.min(4, t.left);
    return `
      <p class="m-trip">Reserve your seat${t.left>1?"s":""}</p>
      <h3 class="m-name">${t.name}</h3>
      <p class="m-sub">${t.where} · departs ${t.date}</p>
      <div class="m-line"><span>Duration</span><b>${t.days} days</b></div>
      <div class="m-line"><span>Per seat</span><b>${money(t.price)}</b></div>
      <div class="m-line"><span>Seats remaining</span><b class="${statusOf(t).s}">${t.left} of ${t.total}</b></div>

      <p class="m-trip" style="margin-top:1.3rem">How many seats?</p>
      <div class="qty">
        <button type="button" id="q-minus" aria-label="One fewer seat">&minus;</button>
        <span class="qty__val" id="q-val">1</span>
        <button type="button" id="q-plus" aria-label="One more seat">+</button>
      </div>
      <p class="qty-hint">Up to ${max} per booking · ${t.left} seat${t.left>1?"s":""} left on this date</p>

      <div class="m-field"><label for="m-name-input">Lead traveller</label>
        <input id="m-name-input" type="text" placeholder="Full name" autocomplete="name"></div>
      <div class="m-field"><label for="m-email-input">Email</label>
        <input id="m-email-input" type="email" placeholder="you@somewhere.far" autocomplete="email"></div>

      <div class="m-total"><span class="lbl">Total to hold</span><span class="amt" id="m-total">${money(t.price)}</span></div>
      <button class="btn btn--solid" id="m-confirm" type="button">Confirm reservation</button>
      <p class="m-err" id="m-err"></p>`;
  }

  function wireForm(t){
    const max = Math.min(4, t.left);
    const val = modalBody.querySelector("#q-val");
    const total = modalBody.querySelector("#m-total");
    const minus = modalBody.querySelector("#q-minus");
    const plus = modalBody.querySelector("#q-plus");
    const sync = () => {
      val.textContent = qty;
      total.textContent = money(t.price * qty);
      minus.disabled = qty <= 1;
      plus.disabled = qty >= max;
    };
    minus.onclick = () => { if(qty > 1){ qty--; sync(); } };
    plus.onclick  = () => { if(qty < max){ qty++; sync(); } };
    sync();
    modalBody.querySelector("#m-confirm").onclick = () => confirm(t);
  }

  function confirm(t){
    const name = modalBody.querySelector("#m-name-input").value.trim();
    const email = modalBody.querySelector("#m-email-input").value.trim();
    const err = modalBody.querySelector("#m-err");
    if(!name){ err.textContent = "Add a name so we know who's travelling."; return; }
    if(!/^\S+@\S+\.\S+$/.test(email)){ err.textContent = "That email doesn't look right."; return; }

    t.left = Math.max(0, t.left - qty);

    emailjs.send(EJ.serviceId, EJ.templateId, {
      to_email:     EJ.notifyEmail,
      trip_name:    t.name,
      destination:  t.where,
      depart_date:  t.date,
      traveller:    name,
      traveller_email: email,
      seats:        qty,
      total:        money(t.price * qty),
      seats_left:   t.left
    });

    if(typeof window.refreshTrip === "function") window.refreshTrip(t.id);
    done(t, name);
    toast(`<b>You're on the manifest.</b> <span>${qty} seat${qty>1?"s":""} held on ${t.name}.</span>`);
  }

  function done(t, name){
    modalBody.innerHTML = `
      <div class="m-done">
        <div class="m-done__seal">&#10003;</div>
        <h3>Seat${qty>1?"s":""} held</h3>
        <p>${name.split(" ")[0]}, ${qty} seat${qty>1?"s":""} on <b>${t.name}</b> ${qty>1?"are":"is"} yours.
           We've emailed the full itinerary and what happens next.
           ${t.left>0 ? `${t.left} seat${t.left>1?"s":""} now remain on this date.` : "That closes this departure — it's full."}</p>
        <button class="btn btn--solid" data-close type="button">Done</button>
      </div>`;
  }

  /* ---- toasts ---- */
  function toast(html){
    if(!toastWrap) return;
    const el = document.createElement("div");
    el.className = "toast";
    el.innerHTML = `<span class="toast__dot"></span><div>${html}</div>`;
    toastWrap.appendChild(el);
    setTimeout(() => { el.classList.add("out"); setTimeout(() => el.remove(), 350); }, 5200);
  }

  /* ---- close handlers ---- */
  if(modal){
    modal.addEventListener("click", e => { if(e.target.matches("[data-close]")) close(); });
    document.addEventListener("keydown", e => { if(e.key === "Escape" && !modal.hidden) close(); });
  }

  window.Booking = { open, toast };
})();
