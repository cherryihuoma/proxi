// ---------------- PAGE LOAD ----------------
window.addEventListener('load', () => {
  document.body.classList.add('loaded');

  const splash = document.getElementById("splash");
  if(splash){
    splash.classList.add("hidden");
    setTimeout(() => splash.style.display = "none", 500);
  }
});

// ---------------- NAVBAR ----------------
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
if(hamburger){
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.innerHTML = navLinks.classList.contains('active') ? '&times;' : '&#9776;';
  });
}

window.addEventListener('scroll', () => {
  const header = document.querySelector('header');
  if(header) header.classList.toggle('scrolled', window.scrollY > 50);
});

// ---------------- PARALLAX ----------------
document.addEventListener("mousemove", e => {
  document.querySelectorAll(".parallax").forEach(layer => {
    const speed = layer.getAttribute("data-speed");
    const x = (window.innerWidth - e.pageX * speed) / 100;
    const y = (window.innerHeight - e.pageY * speed) / 100;
    layer.style.transform = `translateX(${x}px) translateY(${y}px)`;
  });
});

// ---------------- PROVIDERS PAGE ----------------
document.addEventListener('DOMContentLoaded', () => {
  const mapElement = document.getElementById('map');
  const providersGrid = document.getElementById('providers-grid');

  if(mapElement){  // Only run if #map exists
    const map = L.map('map').setView([6.5244, 3.3792], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Sample providers data
    let providers = [
      { name: "Xander Jay", service: "Mechanic", lat: 6.5244, lng: 3.3792, phone: "+2348012345678", rating: 4.5 },
      { name: "Bryan Explorer", service: "Electrician", lat: 6.5450, lng: 3.3615, phone: "+2348012345679", rating: 4.2 },
      { name: "Mike Johnson", service: "Plumber", lat: 6.5300, lng: 3.3750, phone: "+2348012345680", rating: 4.8 }
    ];

    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    function getDistance(lat1, lon1, lat2, lon2){
      const R = 6371;
      const dLat = (lat2-lat1) * Math.PI/180;
      const dLon = (lon2-lon1) * Math.PI/180;
      return R * 2 * Math.atan2(
        Math.sqrt(Math.sin(dLat/2)**2 +
          Math.cos(lat1*Math.PI/180) *
          Math.cos(lat2*Math.PI/180) *
          Math.sin(dLon/2)**2),
        Math.sqrt(1 - Math.sin(dLat/2)**2)
      );
    }

    function renderProviders(list, userLocation){
      if(!providersGrid) return;
      providersGrid.innerHTML = '';
      map.eachLayer(layer => { if(layer instanceof L.Marker) map.removeLayer(layer); });

      if(userLocation){
        L.marker([userLocation.lat, userLocation.lng]).addTo(map).bindPopup("You are here");
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
        providersGrid.appendChild(card);

        L.marker([p.lat, p.lng]).addTo(map).bindPopup(`<b>${p.name}</b><br>${p.service}`);
      });

      document.querySelectorAll('.btn-favorite').forEach(btn => {
        btn.onclick = () => {
          const name = btn.dataset.name;
          favorites = favorites.includes(name)
            ? favorites.filter(f => f!==name)
            : [...favorites, name];
          localStorage.setItem('favorites', JSON.stringify(favorites));
          btn.textContent = favorites.includes(name) ? '★' : '☆';
        };
      });
    }

    // Filters
    const applyBtn = document.getElementById('apply-filters');
    if(applyBtn){
      applyBtn.onclick = () => {
        const service = document.getElementById('service-filter').value;
        const rating = parseInt(document.getElementById('rating-filter').value);
        let filtered = providers;
        if(service) filtered = filtered.filter(p=>p.service===service);
        if(rating) filtered = filtered.filter(p=>p.rating>=rating);
        renderProviders(filtered, window.userLocation);
      };
    }

    // Get user location
    navigator.geolocation?.getCurrentPosition(
      pos => {
        window.userLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        renderProviders(providers, window.userLocation);
      },
      () => renderProviders(providers, null)
    );
  }
});
