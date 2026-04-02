// ============================
// FULL VERSION  EDITION
// ============================

const BIN_ID = "69cebf1c856a682189f3e900";
const API_KEY = "$2a$10$yA/vfW30MeF0P3p4S7nbnuaeEDbxCS61Z2ccBx5NGI1w2VUNYboGS";

let data = null;
let confirmAction = null;

// ============================
// TOAST
// ============================

function toast(msg) {
  const t = document.getElementById("toast");
  t.innerText = msg;
  t.style.opacity = 1;
  setTimeout(() => t.style.opacity = 0, 2000);
}

// ============================
// MODAL CONTROL
// ============================

function openModal(message, callback) {
  document.getElementById("confirmText").innerText = message;
  document.getElementById("confirmModal").classList.add("show");
  confirmAction = callback;
}

function closeModal() {
  document.getElementById("confirmModal").classList.remove("show");
  confirmAction = null;
}

document.getElementById("confirmBtn").onclick = function () {
  if (confirmAction) confirmAction();
  closeModal();
};

// ============================
// LOAD DATA FROM JSONBIN
// ============================

fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
  headers: { "X-Master-Key": API_KEY }
})
  .then(res => res.json())
  .then(res => {
    data = res.record;
    loadBrand();
    renderLinks();
  })
  .catch(() => toast("Gagal load data ❌"));

// ============================
// LOAD BRAND DATA
// ============================

function loadBrand() {
  document.getElementById("title").value = data.brand.title || "";
  document.getElementById("tagline").value = data.brand.tagline || "";
  document.getElementById("description").value = data.brand.description || "";
  document.getElementById("logo").value = data.brand.logo || "";

  document.getElementById("primaryColor").value = data.theme.primaryColor || "";
  document.getElementById("bgTop").value = data.theme.backgroundTop || "";
  document.getElementById("bgBottom").value = data.theme.backgroundBottom || "";
}

// ============================
// SAVE BRAND (WITH CONFIRM)
// ============================

function saveBrand() {
  openModal("Simpan perubahan brand?", function () {

    data.brand.title = document.getElementById("title").value;
    data.brand.tagline = document.getElementById("tagline").value;
    data.brand.description = document.getElementById("description").value;
    data.brand.logo = document.getElementById("logo").value;

    data.theme.primaryColor = document.getElementById("primaryColor").value;
    data.theme.backgroundTop = document.getElementById("bgTop").value;
    data.theme.backgroundBottom = document.getElementById("bgBottom").value;

    updateBin("Brand disimpan ✔");
  });
}

// ============================
// RENDER LINKS
// ============================

function renderLinks() {

  const box = document.getElementById("links");
  box.innerHTML = "";

  data.links.forEach((l, i) => {

    const div = document.createElement("div");
    div.className = "link-item";

    div.innerHTML = `
      <input value="${l.label}" placeholder="Label">
      <input value="${l.url}" placeholder="URL">
      <input value="${l.icon}" placeholder="Icon URL">
      <label>
        <input type="checkbox" ${l.primary ? "checked" : ""}>
        Primary
      </label>
      <label>
        <input type="checkbox" ${l.active ? "checked" : ""}>
        Active
      </label>
      <div class="actions">
        <button class="edit" onclick="saveLink(${i})">Simpan</button>
        <button class="delete" onclick="deleteLink(${i})">Hapus</button>
      </div>
    `;

    box.appendChild(div);
  });
}

// ============================
// SAVE LINK (WITH CONFIRM)
// ============================

function saveLink(i) {

  openModal("Simpan perubahan link ini?", function () {

    const card = document.getElementsByClassName("link-item")[i];
    const inputs = card.querySelectorAll("input");

    data.links[i] = {
      id: data.links[i].id,
      label: inputs[0].value,
      url: inputs[1].value,
      icon: inputs[2].value,
      primary: inputs[3].checked,
      active: inputs[4].checked
    };

    updateBin("Link disimpan ✔");
  });
}

// ============================
// DELETE LINK (WITH CONFIRM)
// ============================

function deleteLink(i) {

  openModal("Yakin ingin menghapus link ini?", function () {
    data.links.splice(i, 1);
    updateBin("Link dihapus 🗑");
  });
}

// ============================
// ADD NEW LINK
// ============================

function addLink() {
  data.links.push({
    id: "new_" + Date.now(),
    label: "Link Baru",
    url: "#",
    icon: "",
    primary: false,
    active: true
  });

  renderLinks();
}

// ============================
// UPDATE JSONBIN
// ============================

function updateBin(msg) {

  fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Master-Key": API_KEY
    },
    body: JSON.stringify(data)
  })
    .then(() => {
      renderLinks();
      toast(msg);
    })
    .catch(() => toast("Gagal menyimpan ❌"));
}