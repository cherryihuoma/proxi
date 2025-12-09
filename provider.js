// Initialize map
const map = L.map('map').setView([6.5244, 3.3792], 12);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Marker for selected location
let marker;

// Click on map to pick location
map.on('click', function(e){
  const { lat, lng } = e.latlng;
  document.getElementById('lat').textContent = lat.toFixed(6);
  document.getElementById('lng').textContent = lng.toFixed(6);

  // Remove old marker
  if(marker) map.removeLayer(marker);

  marker = L.marker([lat, lng]).addTo(map).bindPopup("Your Location").openPopup();
});

// Form submission
document.getElementById('provider-form').addEventListener('submit', function(e){
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const service = document.getElementById('service').value;
  const phone = document.getElementById('phone').value.trim();
  const whatsapp = document.getElementById('whatsapp').value.trim();
  const lat = document.getElementById('lat').textContent;
  const lng = document.getElementById('lng').textContent;

  if(!name || !service || !phone || !whatsapp){
    alert("Please fill in all required fields!");
    return;
  }

  if(lat === '-' || lng === '-') {
    alert("Please select your location on the map!");
    return;
  }

  const providerData = {
    name,
    service,
    phone,
    whatsapp,
    lat: parseFloat(lat),
    lng: parseFloat(lng)
  };

  // Save to LocalStorage
  let storedProviders = JSON.parse(localStorage.getItem('providers')) || [];
  storedProviders.push(providerData);
  localStorage.setItem('providers', JSON.stringify(storedProviders));

  alert("Registered successfully! Provider will appear on the map.");

  // Clear form
  this.reset();
  if(marker) map.removeLayer(marker);
  document.getElementById('lat').textContent = '-';
  document.getElementById('lng').textContent = '-';
});

if (!/^\+?\d{10,15}$/.test(phone)) {
  alert("Invalid phone number format!");
  return;
}

L.marker([providerData.lat, providerData.lng])
  .addTo(map)
  .bindPopup(`${providerData.name}<br>${providerData.service}<br>Tel: ${providerData.phone}`);

  if(marker){
  map.removeLayer(marker);
  marker = null;
}
map.closePopup();


document.addEventListener("DOMContentLoaded", () => {
  const map = L.map('map').setView([6.5244, 3.3792], 12);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);
});


