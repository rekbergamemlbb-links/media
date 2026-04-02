// =========================================

// Support: Brand • Theme • Primary • Active
// =========================================

const BIN_ID = "69cebf1c856a682189f3e900";
const API_KEY = "$2a$10$yA/vfW30MeF0P3p4S7nbnuaeEDbxCS61Z2ccBx5NGI1w2VUNYboGS";

const elBrand = document.getElementById("brandText");
const elTagline = document.querySelector(".tagline");
const elDescription = document.querySelector(".description");
const elLogo = document.querySelector(".logo-wrap img");
const elLinks = document.getElementById("links");

fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
  headers: {
    "X-Master-Key": API_KEY
  }
})
.then(res => {
  if (!res.ok) throw new Error("Gagal fetch data");
  return res.json();
})
.then(res => {

  const data = res.record;

  /* ==========================
     BRAND SECTION
  ========================== */

  if (data.brand) {

    if (data.brand.title)
      elBrand.textContent = data.brand.title;

    if (data.brand.tagline)
      elTagline.textContent = data.brand.tagline;

    if (data.brand.description)
      elDescription.textContent = data.brand.description;

    if (data.brand.logo)
      elLogo.src = data.brand.logo;
  }

  /* ==========================
     THEME SECTION
  ========================== */

  if (data.theme) {

  // if (data.theme.primaryColor)
  //   document.documentElement.style
  //     .setProperty("--gold", data.theme.primaryColor);

  // background dimatikan biar pakai gambar dari CSS
}

  /* ==========================
     LINKS SECTION
  ========================== */

  elLinks.innerHTML = "";

  if (Array.isArray(data.links)) {

    data.links.forEach((link, index) => {

      if (!link.active) return;

      const a = document.createElement("a");
      a.href = link.url || "#";
      a.target = "_blank";
      a.className = "link";

      if (link.primary)
        a.classList.add("primary");

      // ICON SUPPORT
      if (link.icon) {
        const img = document.createElement("img");
        img.src = link.icon;
        img.alt = "";
        img.style.width = "22px";
        img.style.marginRight = "10px";
        img.style.verticalAlign = "middle";
        a.appendChild(img);
      }

      const span = document.createElement("span");
      span.textContent = link.label || "Link";
      a.appendChild(span);

      // Animation stagger
      a.style.opacity = "0";
      a.style.transform = "translateY(10px)";
      a.style.animation = "fadeUp .4s ease forwards";
      a.style.animationDelay = `${index * 0.08}s`;

      elLinks.appendChild(a);
    });

  }

})
.catch(err => {
  console.error("Error:", err);
  elLinks.innerHTML = `
    <p style="opacity:.6; font-size:13px;">
      Gagal memuat data.
    </p>
  `;
});


/* ==========================
   FADE ANIMATION
========================== */

const style = document.createElement("style");
style.innerHTML = `
@keyframes fadeUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
`;
document.head.appendChild(style);