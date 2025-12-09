// Header scroll effect
window.addEventListener('scroll', () => {
  document.querySelector('header')
    .classList.toggle('scrolled', window.scrollY > 50);
});

// ---------------- PROVIDERS DATA ----------------
let providers = [
  { name: "Xander Jay", service: "Mechanic", lat: 6.5244, lng: 3.3792, phone: "+2348012345678", rating: 4.5 },
  { name: "Bryan Explorer", service: "Electrician", lat: 6.5450, lng: 3.3615, phone: "+2348012345679", rating: 4.2 },
  { name: "Mike Johnson", service: "Plumber", lat: 6.5300, lng: 3.3750, phone: "+2348012345680", rating: 4.8 }
];

// ---------------- STORAGE ----------------
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let bookings = JSON.parse(localStorage.getItem('bookings')) || [];

// ---------------- MAP ----------------
const map = L.map('map').setView([6.5244, 3.3792], 12);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap'
}).addTo(map);

// ---------------- DISTANCE ----------------
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  return R * 2 * Math.atan2(
    Math.sqrt(Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) ** 2),
    Math.sqrt(1 - Math.sin(dLat / 2) ** 2)
  );
}

// ---------------- RENDER ----------------
function renderProviders(list, userLocation) {
  const container = document.getElementById('providers-grid');
  container.innerHTML = '';

  map.eachLayer(layer => {
    if (layer instanceof L.Marker) map.removeLayer(layer);
  });

  if (userLocation) {
    L.marker([userLocation.lat, userLocation.lng])
      .addTo(map).bindPopup("You are here");
  }

  list.forEach(p => {
    const distance = userLocation
      ? getDistance(userLocation.lat, userLocation.lng, p.lat, p.lng).toFixed(2)
      : "N/A";

    const card = document.createElement('div');
    card.className = 'provider-card';
    card.innerHTML = `
      <h3>${p.name}</h3>
      <p>${p.service}</p>
      <p>Distance: ${distance} km</p>
      <p>Rating: ${p.rating}★</p>
      <div class="contact-buttons">
        <a href="tel:${p.phone}" class="btn-primary">Call</a>
        <a href="https://wa.me/${p.phone.replace('+','')}" target="_blank" class="btn-primary">WhatsApp</a>
        <button class="btn-favorite" data-name="${p.name}">
          ${favorites.includes(p.name) ? '★' : '☆'}
        </button>
      </div>
    `;
    container.appendChild(card);

    L.marker([p.lat, p.lng]).addTo(map)
      .bindPopup(`<b>${p.name}</b><br>${p.service}`);
  });

  attachFavoriteEvents();
}

// ---------------- FAVORITES ----------------
function attachFavoriteEvents() {
  document.querySelectorAll('.btn-favorite').forEach(btn => {
    btn.onclick = () => {
      const name = btn.dataset.name;
      favorites = favorites.includes(name)
        ? favorites.filter(f => f !== name)
        : [...favorites, name];
      localStorage.setItem('favorites', JSON.stringify(favorites));
      btn.textContent = favorites.includes(name) ? '★' : '☆';
    };
  });
}

// ---------------- FILTER ----------------
document.getElementById('apply-filters').onclick = () => {
  const service = document.getElementById('service-filter').value;
  const rating = parseInt(document.getElementById('rating-filter').value);

  let filtered = providers;
  if (service) filtered = filtered.filter(p => p.service === service);
  if (rating) filtered = filtered.filter(p => p.rating >= rating);

  renderProviders(filtered, window.userLocation);
};

// ---------------- LOCATION ----------------
navigator.geolocation?.getCurrentPosition(
  pos => {
    window.userLocation = {
      lat: pos.coords.latitude,
      lng: pos.coords.longitude
    };
    renderProviders(providers, window.userLocation);
  },
  () => renderProviders(providers, null)
);
