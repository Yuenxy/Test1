const NOMOR_WA = "6281234567890";

// Data Awal jika LocalStorage masih kosong
const defaultAmericano = [
    { id: "am-1", nama: "Americano Hot", harga: "Rp 15.000", gambar: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=500&q=80" },
    { id: "am-2", nama: "Iced Americano", harga: "Rp 16.000", gambar: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=500&q=80" }
];

const defaultEspresso = [
    { id: "es-1", nama: "Single Espresso", harga: "Rp 12.000", gambar: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=500&q=80" },
    { id: "es-2", nama: "Espresso Latte", harga: "Rp 20.000", gambar: "https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=500&q=80" }
];

const defaultBubuk = [
    { id: "bb-1", nama: "Bubuk Kopi Arabika Gayo", kemasan: "Kemasan Saset / Kiloan", deskripsi: "Aroma harum khas dengan karakter rasa buah yang segar.", harga: "Rp 150.000", gambar: "https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&w=500&q=80" }
];

// Helper LocalStorage
function getStoredData(key, fallback) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
}

function saveStoredData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// Inisialisasi Data
let dataAmericano = getStoredData("dataAmericano", defaultAmericano);
let dataEspresso = getStoredData("dataEspresso", defaultEspresso);
let dataKopiBubuk = getStoredData("dataKopiBubuk", defaultBubuk);
