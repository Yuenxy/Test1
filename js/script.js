let isAdminMode = false;
let currentImageData = ""; // Menyimpan base64 gambar upload
let menuModalBS = null;

document.addEventListener("DOMContentLoaded", () => {
    menuModalBS = new bootstrap.Modal(document.getElementById('menuModal'));
    renderAllMenu();

    // Event Submit Form Modal
    document.getElementById("menuForm").addEventListener("submit", handleFormSubmit);
});

// Toggle Admin Mode
function toggleAdminMode() {
    isAdminMode = !isAdminMode;
    const btn = document.getElementById("btn-toggle-admin");
    const panel = document.getElementById("admin-panel");

    if (isAdminMode) {
        btn.className = "btn btn-warning btn-sm fw-bold";
        btn.innerHTML = `<i class="bi bi-shield-check me-1"></i> Mode Admin: ON`;
        panel.classList.remove("d-none");
    } else {
        btn.className = "btn btn-outline-warning btn-sm fw-bold";
        btn.innerHTML = `<i class="bi bi-shield-lock me-1"></i> Mode Admin: OFF`;
        panel.classList.add("d-none");
    }
    renderAllMenu();
}

// Render Semua Menu
function renderAllMenu() {
    renderSimpleMenu("container-americano", dataAmericano, "americano");
    renderSimpleMenu("container-espresso", dataEspresso, "espresso");
    renderBubukMenu("container-bubuk", dataKopiBubuk, "bubuk");
}

// Render Menu Sederhana (Americano & Espresso)
function renderSimpleMenu(elementId, menuData, categoryKey) {
    const container = document.getElementById(elementId);
    if (!container) return;

    let htmlContent = "";
    menuData.forEach(item => {
        let adminActionButtons = isAdminMode ? `
            <div class="mt-2 d-flex gap-1 justify-content-center">
                <button class="btn btn-sm btn-primary py-0 px-2" onclick="openEditModal('${categoryKey}', '${item.id}')"><i class="bi bi-pencil"></i></button>
                <button class="btn btn-sm btn-danger py-0 px-2" onclick="deleteMenu('${categoryKey}', '${item.id}')"><i class="bi bi-trash"></i></button>
            </div>
        ` : '';

        htmlContent += `
            <div class="col-6 col-md-4 col-lg-3">
                <div class="card menu-card h-100 shadow-sm border-0 text-center">
                    <img src="${item.gambar}" class="card-img-top" alt="${item.nama}">
                    <div class="card-body d-flex flex-column justify-content-center">
                        <h6 class="card-title fw-bold mb-2">${item.nama}</h6>
                        <span class="badge bg-secondary fs-6 align-self-center">${item.harga}</span>
                        ${adminActionButtons}
                    </div>
                </div>
            </div>
        `;
    });
    container.innerHTML = htmlContent;
}

// Render Menu Bubuk
function renderBubukMenu(elementId, menuData, categoryKey) {
    const container = document.getElementById(elementId);
    if (!container) return;

    let htmlContent = "";
    menuData.forEach(item => {
        const pesanText = encodeURIComponent(`Halo Admin, saya mau pesan ${item.nama} (Per Kg).`);
        const waUrl = `https://wa.me/${NOMOR_WA}?text=${pesanText}`;

        let adminActionButtons = isAdminMode ? `
            <div class="mt-2 d-flex gap-2">
                <button class="btn btn-sm btn-primary w-50" onclick="openEditModal('${categoryKey}', '${item.id}')"><i class="bi bi-pencil me-1"></i>Edit</button>
                <button class="btn btn-sm btn-danger w-50" onclick="deleteMenu('${categoryKey}', '${item.id}')"><i class="bi bi-trash me-1"></i>Hapus</button>
            </div>
        ` : '';

        htmlContent += `
            <div class="col-md-6 col-lg-4">
                <div class="card menu-card h-100 shadow-sm border-0">
                    <img src="${item.gambar}" class="card-img-top" alt="${item.nama}">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title fw-bold mb-1">${item.nama}</h5>
                        <p class="text-muted small mb-2"><i class="bi bi-tag-fill me-1"></i>${item.kemasan || 'Kiloan'}</p>
                        <p class="card-text text-muted flex-grow-1">${item.deskripsi || ''}</p>
                        <div class="mb-3">
                            <span class="fs-5 fw-bold text-success">${item.harga}</span> <span class="text-muted">/ kg</span>
                        </div>
                        <a href="${waUrl}" target="_blank" class="btn btn-wa w-100 fw-bold">
                            <i class="bi bi-whatsapp me-2"></i>Pesan via WA
                        </a>
                        ${adminActionButtons}
                    </div>
                </div>
            </div>
        `;
    });
    container.innerHTML = htmlContent;
}

// Tampilkan/Sembunyikan Field Tambahan Kopi Bubuk di Form
function toggleKemasanInput() {
    const kat = document.getElementById("menuKategori").value;
    const extraField = document.getElementById("field-bubuk-only");
    if (kat === "bubuk") {
        extraField.classList.remove("d-none");
    } else {
        extraField.classList.add("d-none");
    }
}

// Buka Modal Tambah
function openAddModal() {
    document.getElementById("menuForm").reset();
    document.getElementById("menuId").value = "";
    document.getElementById("modalTitle").innerText = "Tambah Menu Baru";
    document.getElementById("imagePreview").classList.add("d-none");
    currentImageData = "";
    toggleKemasanInput();
    menuModalBS.show();
}

// Buka Modal Edit
function openEditModal(categoryKey, id) {
    let targetData = categoryKey === "americano" ? dataAmericano : (categoryKey === "espresso" ? dataEspresso : dataKopiBubuk);
    let item = targetData.find(x => x.id === id);

    if (!item) return;

    document.getElementById("menuId").value = item.id;
    document.getElementById("menuKategori").value = categoryKey;
    document.getElementById("menuNama").value = item.nama;
    document.getElementById("menuHarga").value = item.harga;
    document.getElementById("menuGambarUrl").value = item.gambar.startsWith("data:image") ? "" : item.gambar;
    
    if (categoryKey === "bubuk") {
        document.getElementById("menuKemasan").value = item.kemasan || "";
        document.getElementById("menuDeskripsi").value = item.deskripsi || "";
    }

    currentImageData = item.gambar;
    const imgPrev = document.getElementById("imagePreview");
    imgPrev.src = item.gambar;
    imgPrev.classList.remove("d-none");

    document.getElementById("modalTitle").innerText = "Edit Menu";
    toggleKemasanInput();
    menuModalBS.show();
}

// Preview Upload Gambar & Convert ke Base64 DataURL
function previewImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            currentImageData = e.target.result;
            const imgPrev = document.getElementById("imagePreview");
            imgPrev.src = currentImageData;
            imgPrev.classList.remove("d-none");
        };
        reader.readAsDataURL(file);
    }
}

// Handle Form Save (Tambah / Edit)
function handleFormSubmit(e) {
    e.preventDefault();

    const id = document.getElementById("menuId").value;
    const kategori = document.getElementById("menuKategori").value;
    const nama = document.getElementById("menuNama").value;
    const harga = document.getElementById("menuHarga").value;
    const urlGambar = document.getElementById("menuGambarUrl").value;

    let finalGambar = currentImageData || urlGambar || "https://via.placeholder.com/300?text=Kopi+Kito";

    let newItem = {
        id: id || "id-" + Date.now(),
        nama: nama,
        harga: harga,
        gambar: finalGambar
    };

    if (kategori === "bubuk") {
        newItem.kemasan = document.getElementById("menuKemasan").value || "Kiloan";
        newItem.deskripsi = document.getElementById("menuDeskripsi").value || "";
    }

    // Tentukan Array mana yang diproses
    let targetArray, storageKey;
    if (kategori === "americano") { targetArray = dataAmericano; storageKey = "dataAmericano"; }
    else if (kategori === "espresso") { targetArray = dataEspresso; storageKey = "dataEspresso"; }
    else { targetArray = dataKopiBubuk; storageKey = "dataKopiBubuk"; }

    if (id) {
        // Edit Item
        let idx = targetArray.findIndex(x => x.id === id);
        if (idx !== -1) targetArray[idx] = newItem;
    } else {
        // Tambah Baru
        targetArray.push(newItem);
    }

    saveStoredData(storageKey, targetArray);
    renderAllMenu();
    menuModalBS.hide();
}

// Fungsi Hapus
function deleteMenu(categoryKey, id) {
    if (!confirm("Apakah kamu yakin mau menghapus menu ini?")) return;

    if (categoryKey === "americano") {
        dataAmericano = dataAmericano.filter(x => x.id !== id);
        saveStoredData("dataAmericano", dataAmericano);
    } else if (categoryKey === "espresso") {
        dataEspresso = dataEspresso.filter(x => x.id !== id);
        saveStoredData("dataEspresso", dataEspresso);
    } else {
        dataKopiBubuk = dataKopiBubuk.filter(x => x.id !== id);
        saveStoredData("dataKopiBubuk", dataKopiBubuk);
    }

    renderAllMenu();
}
  
