/**
 * MarcusCalidus (Marco Warm) - Interactive Portfolio Engine
 * Full dynamic feature set: GitHub API integration, Solar Calculator,
 * Gallery Lightbox, Theme Manager, and Interactive Background Canvas.
 */

// ==========================================================================
// 1. Theme Management (Dark / Light)
// ==========================================================================
class ThemeManager {
  constructor() {
    this.themeToggleBtn = document.getElementById('theme-toggle');
    this.themeIcon = document.getElementById('theme-icon');
    this.currentTheme = localStorage.getItem('theme') || 
      (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    
    this.init();
  }

  init() {
    this.applyTheme(this.currentTheme);
    if (this.themeToggleBtn) {
      this.themeToggleBtn.addEventListener('click', () => this.toggleTheme());
    }
    
    // Listen for system changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        this.applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  applyTheme(theme) {
    this.currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    if (this.themeIcon) {
      if (theme === 'light') {
        this.themeIcon.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>`;
      } else {
        this.themeIcon.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>`;
      }
    }
  }

  toggleTheme() {
    const nextTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.applyTheme(nextTheme);
  }
}

// ==========================================================================
// 2. Interactive Constellation / Particle Background Canvas
// ==========================================================================
class InteractiveHeroCanvas {
  constructor() {
    this.canvas = document.getElementById('hero-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.numParticles = 45;
    this.mouse = { x: null, y: null, radius: 120 };
    
    this.resize();
    this.initParticles();
    this.bindEvents();
    this.animate();
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  initParticles() {
    this.particles = [];
    for (let i = 0; i < this.numParticles; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 1.8 + 0.8,
        color: Math.random() > 0.4 ? 'rgba(6, 182, 212, ' : 'rgba(245, 158, 11, '
      });
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.resize();
      this.initParticles();
    });

    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const baseAlpha = isDark ? 0.35 : 0.15;

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = this.width;
      if (p.x > this.width) p.x = 0;
      if (p.y < 0) p.y = this.height;
      if (p.y > this.height) p.y = 0;

      // Mouse gentle push
      if (this.mouse.x !== null) {
        const dx = this.mouse.x - p.x;
        const dy = this.mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < this.mouse.radius) {
          const force = (this.mouse.radius - dist) / this.mouse.radius;
          p.x -= (dx / dist) * force * 1.2;
          p.y -= (dy / dist) * force * 1.2;
        }
      }

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `${p.color}${baseAlpha})`;
      this.ctx.fill();

      // Connect lines
      for (let j = i + 1; j < this.particles.length; j++) {
        const p2 = this.particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 110) {
          const lineAlpha = (1 - dist / 110) * (isDark ? 0.12 : 0.05);
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.strokeStyle = isDark ? `rgba(99, 102, 241, ${lineAlpha})` : `rgba(15, 23, 42, ${lineAlpha})`;
          this.ctx.lineWidth = 0.8;
          this.ctx.stroke();
        }
      }
    }

    requestAnimationFrame(() => this.animate());
  }
}

// ==========================================================================
// 3. Projects & GitHub API Dynamic Loader
// ==========================================================================
class ProjectsEngine {
  constructor() {
    this.projectsContainer = document.getElementById('projects-container');
    this.filterBtns = document.querySelectorAll('.filter-btn');
    this.searchInput = document.getElementById('project-search');
    this.liveStatusPill = document.getElementById('github-live-status');
    this.currentFilter = 'all';
    this.searchQuery = '';
    this.projects = [];

    this.init();
  }

  async init() {
    this.bindFilters();
    this.bindSearch();
    await this.loadProjects();
  }

  bindFilters() {
    this.filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentFilter = btn.getAttribute('data-filter') || 'all';
        this.render();
      });
    });
  }

  bindSearch() {
    if (this.searchInput) {
      this.searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.render();
      });
    }
  }

  async loadProjects() {
    try {
      // 1. Fetch local curated projects
      const res = await fetch('assets/data/projects.json');
      if (res.ok) {
        this.projects = await res.json();
      }
    } catch (e) {
      console.warn('Using fallback projects', e);
    }

    // 2. Fetch live data from GitHub API to enrich stars & repositories
    this.fetchLiveGitHubData();
    this.render();
  }

  async fetchLiveGitHubData() {
    try {
      const response = await fetch('https://api.github.com/users/MarcusCalidus/repos?per_page=100&sort=updated');
      if (response.ok) {
        const liveRepos = await response.json();
        
        // Enrich existing projects with live star count
        this.projects.forEach(p => {
          const matched = liveRepos.find(r => r.name.toLowerCase() === p.name.toLowerCase());
          if (matched) {
            p.stars = matched.stargazers_count;
            p.liveUrl = matched.html_url;
            p.updatedAt = matched.updated_at;
          }
        });

        // Add any non-forked repo that isn't yet in curated list
        liveRepos.forEach(repo => {
          if (!repo.fork && repo.name !== 'MarcusCalidus.github.io') {
            const exists = this.projects.some(p => p.name.toLowerCase() === repo.name.toLowerCase());
            if (!exists && repo.description) {
              this.projects.push({
                name: repo.name,
                title: repo.name.replace(/[-_]/g, ' '),
                category: 'all',
                categoryLabel: 'Open Source',
                featured: false,
                stars: repo.stargazers_count,
                language: repo.language || 'Code',
                languageColor: this.getLangColor(repo.language),
                description: repo.description,
                tags: [repo.language || 'Code', 'Open Source'],
                html_url: repo.html_url,
                highlights: [
                  `Last updated: ${new Date(repo.updated_at).toLocaleDateString()}`
                ]
              });
            }
          }
        });

        if (this.liveStatusPill) {
          this.liveStatusPill.innerHTML = `
            <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#10b981;margin-right:6px;"></span>
            Live GitHub Sync (${liveRepos.length} repos)
          `;
        }

        this.render();
      }
    } catch (err) {
      console.warn('GitHub API rate limit or offline, using curated dataset.', err);
      if (this.liveStatusPill) {
        this.liveStatusPill.innerHTML = `
          <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#f59e0b;margin-right:6px;"></span>
          Curated Catalog
        `;
      }
    }
  }

  getLangColor(lang) {
    const colors = {
      'TypeScript': '#3178c6',
      'JavaScript': '#f1e05a',
      'Swift': '#F05138',
      'Java': '#b07219',
      'Python': '#3572A5',
      'HTML': '#e34c26',
      'CSS': '#563d7c',
      'Pascal': '#E3F171'
    };
    return colors[lang] || '#8b949e';
  }

  render() {
    if (!this.projectsContainer) return;

    let filtered = this.projects.filter(p => {
      // Category filter
      if (this.currentFilter === 'featured') {
        if (!p.featured) return false;
      } else if (this.currentFilter !== 'all') {
        if (p.category !== this.currentFilter) return false;
      }

      // Search filter
      if (this.searchQuery) {
        const text = `${p.title} ${p.name} ${p.description} ${p.language} ${(p.tags || []).join(' ')}`.toLowerCase();
        if (!text.includes(this.searchQuery)) return false;
      }

      return true;
    });

    if (filtered.length === 0) {
      this.projectsContainer.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted);">
          <p style="font-size: 1.1rem; margin-bottom: 0.5rem;">No repositories found matching your filter.</p>
          <button class="btn btn-outline" onclick="document.getElementById('project-search').value=''; window.projectsEngine.searchQuery=''; window.projectsEngine.render();">
            Clear Search
          </button>
        </div>
      `;
      return;
    }

    this.projectsContainer.innerHTML = filtered.map(p => `
      <div class="project-card ${p.featured ? 'featured' : ''}">
        <div class="project-header">
          <div class="project-icon-box">
            ${p.icon ? `<img src="${p.icon}" alt="${p.title}" />` : `
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="16 18 22 12 16 6"></polyline>
                <polyline points="8 6 2 12 8 18"></polyline>
              </svg>
            `}
          </div>
          <span class="project-stars-pill">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            ${p.stars || 0}
          </span>
        </div>

        <h3 class="project-title">
          <a href="${p.html_url}" target="_blank" rel="noopener noreferrer">${p.title || p.name}</a>
        </h3>

        <p class="project-desc">${p.description || 'Open source engineering project by Marco Warm.'}</p>

        ${p.highlights && p.highlights.length ? `
          <ul class="project-highlights">
            ${p.highlights.map(h => `<li>${h}</li>`).join('')}
          </ul>
        ` : ''}

        <div class="project-tags">
          ${(p.tags || []).map(t => `<span class="tag">${t}</span>`).join('')}
        </div>

        <div class="project-footer">
          <span class="lang-indicator">
            <span class="lang-dot" style="background-color: ${p.languageColor || '#06b6d4'};"></span>
            ${p.language || 'Code'}
          </span>
          <a href="${p.html_url}" class="repo-link" target="_blank" rel="noopener noreferrer">
            GitHub Repo
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </a>
        </div>
      </div>
    `).join('');
  }
}

// ==========================================================================
// 4. Interactive SunTimes / Solar Phase Calculator Showcase
// ==========================================================================
class SunTimesCalculator {
  constructor() {
    this.slider = document.getElementById('solar-hour-slider');
    this.timeLabel = document.getElementById('solar-time-label');
    this.elevationDisplay = document.getElementById('solar-elevation-display');
    this.metricsSub = document.getElementById('solar-metrics-sub');
    this.phaseBadge = document.getElementById('solar-phase-badge');
    this.tipDisplay = document.getElementById('solar-tip-display');
    this.nowBtn = document.getElementById('solar-now-btn');
    this.displayCard = document.getElementById('solar-display-card');

    this.geolocateBtn = document.getElementById('solar-geolocate-btn');
    this.geoIcon = document.getElementById('solar-geo-icon');
    this.geoText = document.getElementById('solar-geo-text');
    this.presetSelect = document.getElementById('solar-preset-select');
    this.locationBadge = document.getElementById('solar-location-badge');
    this.datePicker = document.getElementById('solar-date-picker');

    this.msSunrise = document.getElementById('ms-sunrise');
    this.msNoon = document.getElementById('ms-noon');
    this.msSunset = document.getElementById('ms-sunset');
    this.msGolden = document.getElementById('ms-golden');
    this.msBlue = document.getElementById('ms-blue');

    // Preset coordinates
    this.presets = {
      frankfurt: { name: 'Frankfurt, Germany', lat: 50.1109, lon: 8.6821 },
      berlin: { name: 'Berlin, Germany', lat: 52.5200, lon: 13.4050 },
      zittau: { name: 'Zittau / Dreiländereck', lat: 50.8967, lon: 14.8058 },
      london: { name: 'London, UK', lat: 51.5074, lon: -0.1278 },
      newyork: { name: 'New York City, USA', lat: 40.7128, lon: -74.0060 },
      sanfrancisco: { name: 'San Francisco, USA', lat: 37.7749, lon: -122.4194 },
      tokyo: { name: 'Tokyo, Japan', lat: 35.6762, lon: 139.6503 },
      sydney: { name: 'Sydney, Australia', lat: -33.8688, lon: 151.2093 }
    };

    // Current state
    this.currentLat = this.presets.frankfurt.lat;
    this.currentLon = this.presets.frankfurt.lon;
    this.currentLocationName = this.presets.frankfurt.name;
    this.currentDate = new Date();

    this.init();
  }

  init() {
    if (!this.slider) return;

    this.initDatePicker();
    this.bindEvents();
    this.setToCurrentTime();
    this.recalculateAll();
  }

  initDatePicker() {
    if (this.datePicker) {
      const y = this.currentDate.getFullYear();
      const m = String(this.currentDate.getMonth() + 1).padStart(2, '0');
      const d = String(this.currentDate.getDate()).padStart(2, '0');
      this.datePicker.value = `${y}-${m}-${d}`;

      this.datePicker.addEventListener('change', () => {
        if (this.datePicker.value) {
          const parts = this.datePicker.value.split('-');
          this.currentDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
          this.recalculateAll();
        }
      });
    }
  }

  bindEvents() {
    this.slider.addEventListener('input', () => {
      this.update(parseFloat(this.slider.value));
    });

    if (this.nowBtn) {
      this.nowBtn.addEventListener('click', () => {
        this.setToCurrentTime();
      });
    }

    if (this.presetSelect) {
      this.presetSelect.addEventListener('change', () => {
        const key = this.presetSelect.value;
        if (this.presets[key]) {
          this.currentLat = this.presets[key].lat;
          this.currentLon = this.presets[key].lon;
          this.currentLocationName = this.presets[key].name;
          this.updateLocationBadge();
          this.recalculateAll();
        }
      });
    }

    if (this.geolocateBtn) {
      this.geolocateBtn.addEventListener('click', () => {
        this.detectUserLocation();
      });
    }
  }

  detectUserLocation() {
    if (!navigator.geolocation) {
      window.AppToast?.show('Geolocation is not supported by your browser', 'info');
      return;
    }

    if (this.geoText) this.geoText.textContent = 'Detecting GPS...';
    if (this.geolocateBtn) this.geolocateBtn.classList.add('loading');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.currentLat = position.coords.latitude;
        this.currentLon = position.coords.longitude;
        this.currentLocationName = 'Browser GPS Location';

        // Add or update custom GPS option in select
        let gpsOpt = this.presetSelect?.querySelector('option[value="gps"]');
        if (!gpsOpt && this.presetSelect) {
          gpsOpt = document.createElement('option');
          gpsOpt.value = 'gps';
          this.presetSelect.prepend(gpsOpt);
        }
        if (gpsOpt) {
          gpsOpt.textContent = `📍 GPS (${this.currentLat.toFixed(2)}°, ${this.currentLon.toFixed(2)}°)`;
          gpsOpt.selected = true;
        }

        if (this.geoText) this.geoText.textContent = 'GPS Located';
        if (this.geolocateBtn) this.geolocateBtn.classList.remove('loading');

        this.updateLocationBadge();
        this.recalculateAll();
        window.AppToast?.show(`📍 Solar location set to ${this.currentLat.toFixed(2)}°N, ${this.currentLon.toFixed(2)}°E`, 'success');
      },
      (error) => {
        if (this.geoText) this.geoText.textContent = 'Detect My Location';
        if (this.geolocateBtn) this.geolocateBtn.classList.remove('loading');
        let msg = 'Unable to retrieve location';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Location permission was denied. Using default preset.';
        } else if (error.code === error.TIMEOUT) {
          msg = 'Location request timed out. Using default preset.';
        }
        window.AppToast?.show(msg, 'info');
      },
      { timeout: 8000, enableHighAccuracy: false }
    );
  }

  updateLocationBadge() {
    if (this.locationBadge) {
      const latStr = `${Math.abs(this.currentLat).toFixed(2)}°${this.currentLat >= 0 ? 'N' : 'S'}`;
      const lonStr = `${Math.abs(this.currentLon).toFixed(2)}°${this.currentLon >= 0 ? 'E' : 'W'}`;
      this.locationBadge.textContent = `${latStr}, ${lonStr}`;
    }
  }

  setToCurrentTime() {
    const now = new Date();
    this.currentDate = now;
    if (this.datePicker) {
      const y = now.getFullYear();
      const m = String(now.getMonth() + 1).padStart(2, '0');
      const d = String(now.getDate()).padStart(2, '0');
      this.datePicker.value = `${y}-${m}-${d}`;
    }
    const hours = now.getHours() + now.getMinutes() / 60;
    this.slider.value = hours.toFixed(1);
    this.recalculateAll();
  }

  recalculateAll() {
    this.updateMilestones();
    this.update(parseFloat(this.slider.value));
  }

  // ========================================================================
  // NOAA Solar Equations (Derived from SunTimes watchOS App)
  // ========================================================================
  toRadians(deg) { return deg * Math.PI / 180; }
  toDegrees(rad) { return rad * 180 / Math.PI; }

  calcNOAA(lat, lon, date, hourDecimal) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    // Julian Day Calculation
    const a = Math.floor((14 - month) / 12);
    const y = year + 4800 - a;
    const m = month + 12 * a - 3;
    let jd = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;

    // Timezone Offset in hours
    const tzOffsetHours = -date.getTimezoneOffset() / 60;
    const utcHours = hourDecimal - tzOffsetHours;
    jd += (utcHours - 12) / 24;

    const T = (jd - 2451545.0) / 36525.0;

    // Geometric Mean Longitude of the Sun (deg)
    let geomMeanLongSun = (280.46646 + T * (36000.76983 + 0.0003032 * T)) % 360;
    if (geomMeanLongSun < 0) geomMeanLongSun += 360;

    // Geometric Mean Anomaly of the Sun (deg)
    const geomMeanAnomSun = 357.52911 + T * (35999.05029 - 0.0001537 * T);

    // Eccentricity of Earth's Orbit
    const eccentEarthOrbit = 0.016708634 - T * (0.000042037 + 0.0000001267 * T);

    // Sun Equation of Center
    const sunEqOfCtr = Math.sin(this.toRadians(geomMeanAnomSun)) * (1.914602 - T * (0.004817 + 0.000014 * T)) +
                       Math.sin(this.toRadians(2 * geomMeanAnomSun)) * (0.019993 - 0.000101 * T) +
                       Math.sin(this.toRadians(3 * geomMeanAnomSun)) * 0.000289;

    // True Longitude & Apparent Longitude
    const sunTrueLong = geomMeanLongSun + sunEqOfCtr;
    const sunAppLong = sunTrueLong - 0.00569 - 0.00478 * Math.sin(this.toRadians(125.04 - 1934.136 * T));

    // Mean Obliquity of the Ecliptic & Obliquity Correction
    const meanObliqEcliptic = 23 + (26 + (21.448 - T * (46.815 + T * (0.00059 - T * 0.001813))) / 60) / 60;
    const obliqCorr = meanObliqEcliptic + 0.00256 * Math.cos(this.toRadians(125.04 - 1934.136 * T));

    // Sun Declination
    const sunDeclin = this.toDegrees(Math.asin(Math.sin(this.toRadians(obliqCorr)) * Math.sin(this.toRadians(sunAppLong))));

    // Equation of Time (minutes)
    const varY = Math.tan(this.toRadians(obliqCorr / 2)) * Math.tan(this.toRadians(obliqCorr / 2));
    const eqOfTime = 4 * this.toDegrees(
      varY * Math.sin(2 * this.toRadians(geomMeanLongSun)) -
      2 * eccentEarthOrbit * Math.sin(this.toRadians(geomMeanAnomSun)) +
      4 * eccentEarthOrbit * varY * Math.sin(this.toRadians(geomMeanAnomSun)) * Math.cos(2 * this.toRadians(geomMeanLongSun)) -
      0.5 * varY * varY * Math.sin(4 * this.toRadians(geomMeanLongSun)) -
      1.25 * eccentEarthOrbit * eccentEarthOrbit * Math.sin(2 * this.toRadians(geomMeanAnomSun))
    );

    // True Solar Time & Hour Angle
    const timeOffset = eqOfTime + 4 * lon - 60 * tzOffsetHours;
    let trueSolarTime = (hourDecimal * 60 + timeOffset) % 1440;
    if (trueSolarTime < 0) trueSolarTime += 1440;

    let hourAngle = trueSolarTime / 4 - 180;
    if (hourAngle < -180) hourAngle += 360;

    // Solar Zenith & Elevation
    const csz = Math.sin(this.toRadians(lat)) * Math.sin(this.toRadians(sunDeclin)) +
                Math.cos(this.toRadians(lat)) * Math.cos(this.toRadians(sunDeclin)) * Math.cos(this.toRadians(hourAngle));
    const zenith = this.toDegrees(Math.acos(Math.max(-1, Math.min(1, csz))));
    let elevation = 90 - zenith;

    // Atmospheric Refraction Correction
    if (elevation > 5.0 && elevation < 85.0) {
      const te = Math.tan(this.toRadians(elevation));
      const r = (58.1 / te - 0.07 / (te * te * te) + 0.000086 / (te * te * te * te * te)) / 3600;
      elevation += r;
    } else if (elevation > -0.575 && elevation <= 5.0) {
      const r = (1735.0 + elevation * (-518.2 + elevation * (103.4 + elevation * (-12.79 + elevation * 0.711)))) / 3600;
      elevation += r;
    }

    // Solar Azimuth (bearing clockwise from true North)
    let azimuth;
    const caz = (Math.sin(this.toRadians(sunDeclin)) - Math.sin(this.toRadians(lat)) * Math.cos(this.toRadians(zenith))) /
                (Math.cos(this.toRadians(lat)) * Math.sin(this.toRadians(zenith)));
    const azRad = Math.acos(Math.max(-1, Math.min(1, caz)));
    if (hourAngle > 0) {
      azimuth = (this.toDegrees(azRad) + 180) % 360;
    } else {
      azimuth = (540 - this.toDegrees(azRad)) % 360;
    }

    return { elevation, azimuth, sunDeclin, eqOfTime };
  }

  getCardinal(azimuth) {
    const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const idx = Math.round(azimuth / 22.5) % 16;
    return dirs[idx];
  }

  updateMilestones() {
    const times = this.calcMilestoneTimes(this.currentLat, this.currentLon, this.currentDate);

    if (this.msSunrise) this.msSunrise.textContent = times.sunrise;
    if (this.msNoon) this.msNoon.textContent = times.noon;
    if (this.msSunset) this.msSunset.textContent = times.sunset;
    if (this.msGolden) this.msGolden.textContent = times.golden;
    if (this.msBlue) this.msBlue.textContent = times.blue;
  }

  calcMilestoneTimes(lat, lon, date) {
    // Calculate solar noon, declination, and equation of time at noon
    const noona = this.calcNOAA(lat, lon, date, 12);
    const tzOffsetHours = -date.getTimezoneOffset() / 60;
    const solarNoonHour = (720 - 4 * lon - noona.eqOfTime + 60 * tzOffsetHours) / 60;

    const timeForElevation = (targetElev) => {
      const csz = Math.sin(this.toRadians(targetElev));
      const cosHA = (csz - Math.sin(this.toRadians(lat)) * Math.sin(this.toRadians(noona.sunDeclin))) /
                    (Math.cos(this.toRadians(lat)) * Math.cos(this.toRadians(noona.sunDeclin)));
      if (cosHA > 1 || cosHA < -1) return null;
      const haDeg = this.toDegrees(Math.acos(cosHA));
      const deltaHours = haDeg / 15;
      return {
        morning: solarNoonHour - deltaHours,
        evening: solarNoonHour + deltaHours
      };
    };

    const fmt = (h) => {
      if (h == null || isNaN(h)) return '--:--';
      let hr = Math.floor(h);
      let min = Math.round((h - hr) * 60);
      if (min >= 60) { hr += 1; min = 0; }
      hr = (hr % 24 + 24) % 24;
      return `${String(hr).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
    };

    const sunriseSunset = timeForElevation(-0.833);
    const blueHour = timeForElevation(-6.0);
    const goldenStart = timeForElevation(-4.0);
    const goldenEnd = timeForElevation(6.0);

    return {
      noon: fmt(solarNoonHour),
      sunrise: fmt(sunriseSunset?.morning),
      sunset: fmt(sunriseSunset?.evening),
      golden: goldenEnd && goldenStart ? `${fmt(goldenEnd.evening)}–${fmt(goldenStart.evening)}` : '--:--',
      blue: goldenStart && blueHour ? `${fmt(goldenStart.evening)}–${fmt(blueHour.evening)}` : '--:--'
    };
  }

  update(hourDecimal) {
    const h = Math.floor(hourDecimal);
    const m = Math.floor((hourDecimal - h) * 60);
    const timeFormatted = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;

    if (this.timeLabel) {
      this.timeLabel.textContent = `${timeFormatted} (Simulated Time)`;
    }

    // Run NOAA Astronomical Calculation for exact latitude, longitude, date and hour
    const sol = this.calcNOAA(this.currentLat, this.currentLon, this.currentDate, hourDecimal);
    const elevation = sol.elevation;
    const azimuth = Math.round(sol.azimuth);
    const cardinal = this.getCardinal(sol.azimuth);
    const declinStr = `${sol.sunDeclin >= 0 ? '+' : ''}${sol.sunDeclin.toFixed(1)}°`;

    let phase = '';
    let badgeColor = '';
    let badgeBg = '';
    let tip = '';

    if (elevation < -12) {
      phase = 'Night / Astrophotography';
      badgeColor = '#818cf8';
      badgeBg = 'rgba(99, 102, 241, 0.2)';
      tip = 'Zero solar atmospheric glow. Optimal for Milky Way captures, astrophotography, light painting, and starry deep-sky panoramas.';
    } else if (elevation >= -12 && elevation < -6) {
      phase = 'Nautical Twilight';
      badgeColor = '#38bdf8';
      badgeBg = 'rgba(56, 189, 248, 0.2)';
      tip = 'Sea and horizon silhouettes emerge while navigation stars remain clearly visible. Excellent for moody coastal and skyline long exposures.';
    } else if (elevation >= -6 && elevation < -4) {
      phase = 'Blue Hour (-6° to -4°)';
      badgeColor = '#38bdf8';
      badgeBg = 'rgba(56, 189, 248, 0.25)';
      tip = 'SunTimes hallmark! Rich deep blue sky balancing warm illuminated cityscapes without blown highlight clipping.';
    } else if (elevation >= -4 && elevation <= 6) {
      phase = 'Golden Hour (-4° to +6°)';
      badgeColor = '#f59e0b';
      badgeBg = 'rgba(245, 158, 11, 0.25)';
      tip = 'Photographic magic! Warm low-angle raking sunlight, extended soft shadows, glowing atmospheric backscatter, and mountain alpenglow.';
    } else if (elevation > 6 && elevation <= 25) {
      phase = 'Soft Daytime Light';
      badgeColor = '#10b981';
      badgeBg = 'rgba(16, 185, 129, 0.2)';
      tip = 'Pleasant directional lighting with moderate contrast. Superb for architectural facades, nature landscapes, and street portraits.';
    } else {
      phase = 'Midday Harsh Sunlight';
      badgeColor = '#94a3b8';
      badgeBg = 'rgba(148, 163, 184, 0.2)';
      tip = 'High contrast overhead sun with stark vertical shadows. Use polarizing / ND filters, seek geometric architectural abstracts, or compose high-contrast B&W.';
    }

    if (this.elevationDisplay) {
      this.elevationDisplay.textContent = `${elevation >= 0 ? '+' : ''}${elevation.toFixed(1)}°`;
      this.elevationDisplay.style.color = badgeColor;
    }

    if (this.metricsSub) {
      this.metricsSub.textContent = `Azimuth: ${azimuth}° (${cardinal}) · Solar Declination: ${declinStr}`;
    }

    if (this.phaseBadge) {
      this.phaseBadge.textContent = phase;
      this.phaseBadge.style.color = badgeColor;
      this.phaseBadge.style.backgroundColor = badgeBg;
      this.phaseBadge.style.border = `1px solid ${badgeColor}55`;
    }

    if (this.tipDisplay) {
      this.tipDisplay.textContent = tip;
    }

    if (this.displayCard) {
      this.displayCard.style.boxShadow = `0 0 35px ${badgeColor}22`;
      this.displayCard.style.borderColor = `${badgeColor}44`;
    }
  }
}

// ==========================================================================
// 5. Photography Gallery & Fullscreen Lightbox
// ==========================================================================
class PhotographyEngine {
  constructor() {
    this.galleryContainer = document.getElementById('gallery-container');
    this.filterBtns = document.querySelectorAll('.photo-filter-btn');
    this.modal = document.getElementById('lightbox-modal');
    this.closeBtn = document.getElementById('lightbox-close');
    this.modalImg = document.getElementById('lightbox-image');
    this.modalTitle = document.getElementById('lightbox-title');
    this.modalLocation = document.getElementById('lightbox-location');
    this.modalCaption = document.getElementById('lightbox-caption');
    this.modalExif = document.getElementById('lightbox-exif-body');
    this.alamyBtn = document.getElementById('modal-alamy-btn');
    this.adobeBtn = document.getElementById('modal-adobe-btn');
    this.shutterBtn = document.getElementById('modal-shutter-btn');
    this.prevBtn = document.getElementById('lightbox-prev');
    this.nextBtn = document.getElementById('lightbox-next');

    this.photos = [];
    this.currentCategory = 'all';
    this.currentIndex = 0;

    this.init();
  }

  async init() {
    this.bindFilters();
    this.bindModalEvents();
    await this.loadGallery();
  }

  bindFilters() {
    this.filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentCategory = btn.getAttribute('data-filter') || 'all';
        this.render();
      });
    });
  }

  bindModalEvents() {
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.closeModal());
    }

    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.navigateModal(-1);
      });
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.navigateModal(1);
      });
    }

    if (this.modal) {
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) this.closeModal();
      });

      // Mobile touch swipe gestures
      let touchStartX = 0;
      this.modal.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      this.modal.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].screenX;
        if (touchStartX - touchEndX > 60) this.navigateModal(1);
        if (touchEndX - touchStartX > 60) this.navigateModal(-1);
      }, { passive: true });
    }

    window.addEventListener('keydown', (e) => {
      if (!this.modal || !this.modal.classList.contains('active')) return;
      if (e.key === 'Escape') this.closeModal();
      if (e.key === 'ArrowRight') this.navigateModal(1);
      if (e.key === 'ArrowLeft') this.navigateModal(-1);
    });
  }

  async loadGallery() {
    try {
      const res = await fetch('assets/data/gallery.json');
      if (res.ok) {
        this.photos = await res.json();
      }
    } catch (e) {
      console.warn('Gallery load error', e);
    }
    this.render();
  }

  render() {
    if (!this.galleryContainer) return;

    const filtered = this.photos.filter(p => {
      if (this.currentCategory === 'all') return true;
      return p.category === this.currentCategory;
    });

    this.galleryContainer.innerHTML = filtered.map((photo, idx) => `
      <div class="photo-card" data-index="${this.photos.indexOf(photo)}" tabindex="0" role="button" aria-label="View ${photo.title}">
        <div class="photo-img-wrap">
          <img src="${photo.image}" alt="${photo.title}" class="photo-img" loading="lazy" />
          <div class="photo-overlay">
            <span class="photo-badge">${photo.categoryLabel || 'Stock Photo'}</span>
            <h4 class="photo-title">${photo.title}</h4>
            <div class="photo-location">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              ${photo.location}
            </div>
            <div class="photo-exif-chips">
              <span class="exif-chip">${photo.exif.focal}</span>
              <span class="exif-chip">${photo.exif.aperture}</span>
              <span class="exif-chip">${photo.exif.shutter}</span>
              <span class="exif-chip">ISO ${photo.exif.iso}</span>
            </div>
          </div>
        </div>
      </div>
    `).join('');

    // Attach click listeners to cards
    this.galleryContainer.querySelectorAll('.photo-card').forEach(card => {
      card.addEventListener('click', () => {
        const index = parseInt(card.getAttribute('data-index'), 10);
        this.openModal(index);
      });
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const index = parseInt(card.getAttribute('data-index'), 10);
          this.openModal(index);
        }
      });
    });
  }

  openModal(index) {
    this.currentIndex = index;
    const photo = this.photos[this.currentIndex];
    if (!photo) return;

    if (this.modalImg) {
      this.modalImg.src = photo.image;
      this.modalImg.alt = photo.title;
    }
    if (this.modalTitle) this.modalTitle.textContent = photo.title;
    if (this.modalLocation) this.modalLocation.textContent = photo.location;
    if (this.modalCaption) this.modalCaption.textContent = photo.caption;

    if (this.modalExif) {
      this.modalExif.innerHTML = `
        <tr><td>Camera</td><td>${photo.exif.camera}</td></tr>
        <tr><td>Lens</td><td>${photo.exif.lens}</td></tr>
        <tr><td>Focal Length</td><td>${photo.exif.focal}</td></tr>
        <tr><td>Aperture</td><td>${photo.exif.aperture}</td></tr>
        <tr><td>Shutter Speed</td><td>${photo.exif.shutter}</td></tr>
        <tr><td>ISO Rating</td><td>${photo.exif.iso}</td></tr>
      `;
    }

    if (this.alamyBtn) this.alamyBtn.href = photo.licensing.alamy;
    if (this.adobeBtn) this.adobeBtn.href = photo.licensing.adobe;
    if (this.shutterBtn) this.shutterBtn.href = photo.licensing.shutterstock;

    if (this.modal) {
      this.modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  closeModal() {
    if (this.modal) {
      this.modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  navigateModal(direction) {
    this.currentIndex = (this.currentIndex + direction + this.photos.length) % this.photos.length;
    this.openModal(this.currentIndex);
  }
}

// ==========================================================================
// 6. Navigation Scroll Spy & Mobile Menu
// ==========================================================================
function initNavigation() {
  const navbar = document.getElementById('main-navbar');
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Scroll effect on navbar
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }

    // Scroll spy
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  });

  // Mobile menu toggle
  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
    });

    mobileMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
      });
    });
  }
}

// ==========================================================================
// 7. Toast Notification Helper
// ==========================================================================
window.showToast = function(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(15px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
};

// ==========================================================================
// Bootstrap on DOM Ready
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  window.themeManager = new ThemeManager();
  window.heroCanvas = new InteractiveHeroCanvas();
  window.projectsEngine = new ProjectsEngine();
  window.solarCalculator = new SunTimesCalculator();
  window.photographyEngine = new PhotographyEngine();
  initNavigation();
});
