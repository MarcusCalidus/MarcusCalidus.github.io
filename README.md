# MarcusCalidus.github.io

Personal website and dynamic portfolio for **Marco Warm** ([@MarcusCalidus](https://github.com/MarcusCalidus)), hosted on **GitHub Pages**.

Designed with a modern, glassmorphic aesthetic supporting both Dark and Light modes, real-time GitHub API integration, interactive photo lightboxes, and a live solar calculator.

---

## 🌟 Core Pillars

### 1. 💻 Software Engineering & Open Source
- **Live GitHub API Sync**: Dynamically loads repositories, stars, and topics from [`MarcusCalidus`](https://github.com/MarcusCalidus).
- **Featured Projects**:
  - [**marcuscalidus-svg-panel**](https://github.com/MarcusCalidus/marcuscalidus-svg-panel) (64+ stars) – Dynamic Grafana panel for metric-sensitive SVG animations using Snap.svg.
  - [**SunTimes**](https://github.com/MarcusCalidus/SunTimes) – Apple watchOS complication tracking photographic golden hour, blue hour, civil twilight, sunrise, and sunset using NOAA solar equations.
  - [**sigma-air-manager-exporter**](https://github.com/MarcusCalidus/sigma-air-manager-exporter) – Prometheus telemetry exporter for Kaeser Sigma Air Manager 4.0.
  - [**s7-plc-exporter**](https://github.com/MarcusCalidus/s7-plc-exporter) – Siemens S7 PLC industrial automation exporter for Prometheus.
  - [**twincat-ads-webservice-exporter**](https://github.com/MarcusCalidus/twincat-ads-webservice-exporter) – Beckhoff PLC ADS exporter.
  - [**BudgetEnvelopes**](https://github.com/MarcusCalidus/BudgetEnvelopes) – Native Android budgeting app based on envelope cash allocation.
- **Interactive SunTimes Showcase**: Live interactive browser widget demonstrating the mathematical solar elevation calculation and photographic lighting phases (Blue hour, Golden hour, Daylight, Night) across a 24-hour slider.

### 2. 📷 Global Stock Photography
- Contributor portfolios across the world's leading stock platforms:
  - [**Alamy Collection**](https://www.alamy.com/stock-photo/?cid=U8DZTKBZNCRB9MQC2GX4JH3M2FQAN8VQHF443HPFEZ2J7WV7KT76RQ9GPNST8457&sortBy=relevant) – Commercial and editorial high-res licensing.
  - [**Adobe Stock**](https://stock.adobe.com/de/contributor/208533127/Marco%20Warm) – Creative Cloud contributor profile 208533127.
  - [**Shutterstock**](https://www.shutterstock.com/g/Marco+Warm) – Royalty-free commercial portfolio.
- **Interactive Gallery**: Filterable photo showcase with simulated camera EXIF data (Sony Alpha 7R IV, GM lenses, shutter speeds, apertures, ISO) and a fullscreen modal lightbox with direct licensing buttons.

### 3. 📖 Connection to the Bible
- **Core Feature**: Detailed exploration of the *Watchtower* (2018 No. 1) article:
  > **["Is the Bible’s Guidance Relevant Today?"](https://www.jw.org/en/library/magazines/watchtower-no1-2018-jan-feb/bible-guidance-relevant/)**
- **Harmonizing Faith & Tech**:
  - Examines why the skeptic's analogy (comparing the Bible to a 1920s chemistry book or obsolete computer manual) is flawed: *“Science and technology change rapidly, but has human nature changed?”*
  - Reflection on how biblical principles of integrity, diligence, and empathy guide software engineering and human relationships.
  - The observing lens: How capturing the geometry, light, and natural world strengthens awe for the Creator.
  - Direct links to read the article in 100+ languages on [JW.org](https://www.jw.org/en/).

---

## 🚀 Local Development & Preview

To preview the website locally without any build toolchain:

```bash
# Using Python 3
python3 -m http.server 8080

# Or using Node.js
npx serve .
```

Open [http://localhost:8080](http://localhost:8080) in your web browser.

---

## 📂 Project Structure

```
├── index.html                   # Main semantic HTML5 page
├── .nojekyll                    # Disables Jekyll processing on GitHub Pages
├── README.md                    # Project documentation
└── assets/
    ├── css/
    │   └── style.css            # Responsive styles, glassmorphism, themes
    ├── js/
    │   └── main.js              # Theme manager, GitHub API, Solar calculator, Lightbox
    ├── data/
    │   ├── projects.json        # Curated repository catalog with fallback
    │   └── gallery.json         # Stock photography catalog & EXIF metadata
    └── img/
        ├── avatar.jpg           # Marco Warm profile picture
        ├── suntimes-icon.png    # Authentic SunTimes watchOS app icon
        └── gallery/             # High-resolution stock photography showcases
```

---

## 📄 License

- Code: [MIT License](LICENSE) or [Apache 2.0](NOTICE)
- Photography & Content: &copy; Marco Warm. All rights reserved.
