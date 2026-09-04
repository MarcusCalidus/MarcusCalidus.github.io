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
    this.phaseBadge = document.getElementById('solar-phase-badge');
    this.tipDisplay = document.getElementById('solar-tip-display');
    this.nowBtn = document.getElementById('solar-now-btn');
    this.displayCard = document.getElementById('solar-display-card');

    this.init();
  }

  init() {
    if (!this.slider) return;

    // Set to current local time initially
    this.setToCurrentTime();

    this.slider.addEventListener('input', () => {
      this.update(parseFloat(this.slider.value));
    });

    if (this.nowBtn) {
      this.nowBtn.addEventListener('click', () => {
        this.setToCurrentTime();
      });
    }
  }

  setToCurrentTime() {
    const now = new Date();
    const hours = now.getHours() + now.getMinutes() / 60;
    this.slider.value = hours.toFixed(2);
    this.update(hours);
  }

  update(hourDecimal) {
    const h = Math.floor(hourDecimal);
    const m = Math.floor((hourDecimal - h) * 60);
    const timeFormatted = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    
    if (this.timeLabel) {
      this.timeLabel.textContent = `${timeFormatted} (Simulated Time)`;
    }

    // Mathematical approximation of solar elevation across 24h
    // Solar noon roughly at 12:30, peak elevation ~52 deg (mid-latitude spring/autumn), nadir ~-48 deg
    const angleRad = ((hourDecimal - 12.5) / 24) * 2 * Math.PI;
    const elevation = Math.round(Math.cos(angleRad) * 50 - 2);

    let phase = '';
    let badgeColor = '';
    let badgeBg = '';
    let tip = '';

    if (elevation < -12) {
      phase = 'Night / Astrophotography';
      badgeColor = '#818cf8';
      badgeBg = 'rgba(99, 102, 241, 0.2)';
      tip = 'Minimal atmospheric glow. Ideal for starry skies, Milky Way captures, long exposures, and urban light trails.';
    } else if (elevation >= -12 && elevation < -6) {
      phase = 'Nautical Twilight';
      badgeColor = '#38bdf8';
      badgeBg = 'rgba(56, 189, 248, 0.2)';
      tip = 'Horizon is clearly visible while bright stars still shine. Great for moody architectural and seascape silhouettes.';
    } else if (elevation >= -6 && elevation < -4) {
      phase = 'Blue Hour (-6° to -4°)';
      badgeColor = '#38bdf8';
      badgeBg = 'rgba(56, 189, 248, 0.25)';
      tip = 'SunTimes hallmark! Rich deep blue sky balancing tungsten city lights. Perfect for architecture and harbor photography without blown highlights.';
    } else if (elevation >= -4 && elevation <= 6) {
      phase = 'Golden Hour (-4° to +6°)';
      badgeColor = '#f59e0b';
      badgeBg = 'rgba(245, 158, 11, 0.25)';
      tip = 'Magic hour! Warm low-angle raking sunlight, long soft shadows, natural diffusion, and mountain mist backlight.';
    } else if (elevation > 6 && elevation <= 25) {
      phase = 'Soft Daytime Light';
      badgeColor = '#10b981';
      badgeBg = 'rgba(16, 185, 129, 0.2)';
      tip = 'Pleasant directional lighting. Good for portraits with reflectors, street photography, and texture studies.';
    } else {
      phase = 'Midday Harsh Sunlight';
      badgeColor = '#94a3b8';
      badgeBg = 'rgba(148, 163, 184, 0.2)';
      tip = 'High contrast and deep shadows. Use a polarizing filter, look for geometric architectural shadows, or switch to black & white.';
    }

    if (this.elevationDisplay) {
      this.elevationDisplay.textContent = `${elevation > 0 ? '+' : ''}${elevation}°`;
      this.elevationDisplay.style.color = badgeColor;
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
