/**
 * ROHAN_OS Main Application Coordinator
 * Integrates Tabs, DOM structures, Web Audio Synthesis, and CLI feedback loop
 */

window.addEventListener("DOMContentLoaded", () => {
  // Initialize Global App Coordinator
  window.ROHAN_APP = new RohanOS_App();
});

class RohanOS_App {
  constructor() {
    this.audioActive = true;
    this.currentTheme = "paper";
    this.activeTabId = "home_sh";
    this.openTabs = new Set(["home_sh"]);
    
    // Core Web Audio Context
    this.audioCtx = null;

    // DOM Elements Mapping
    this.bodyElement = document.body;
    this.timeElement = document.getElementById("sys-clock");
    this.soundToggleBtn = document.getElementById("sound-toggle");
    this.crtToggleBtn = document.getElementById("crt-toggle");
    
    // Sidebar & Viewport Tabs
    this.sidebarNodes = document.querySelectorAll(".dir-node");
    this.tabContainer = document.getElementById("editor-tabs");
    this.panelSections = document.querySelectorAll(".panel-section");

    // Project inspector overlay
    this.inspectorElement = document.getElementById("project-inspector");
    this.inspectorCloseBtn = document.getElementById("inspector-close");

    // Initialize systems
    this.initSound();
    this.initClock();
    this.initCRT();
    this.initSidebarAndTabs();
    this.initTerminal();
    
    // Dynamic Contents Generation
    this.renderCaseStudies();
    this.renderGallery();
    this.renderGitTimeline();
    this.renderCapabilities();
    this.renderJsonEditor();
    
    // Traditional Contact Form synchronization
    this.initContactForm();

    // Trigger tube start power animation
    this.triggerPowerOnEffect();
  }

  // --- Sound Synthesizer via Web Audio API ---
  initSound() {
    this.soundToggleBtn.addEventListener("click", () => {
      this.audioActive = !this.audioActive;
      this.soundToggleBtn.innerHTML = this.audioActive ? "🔊 SOUND: ON" : "🔇 SOUND: MUTED";
      this.playBeep(900, 0.05, "sine");
      
      // Update CLI state log
      if (this.terminal) {
        this.terminal.writeLine(`[SYSTEM] Audio feedback: ${this.audioActive ? "ENGAGED" : "MUTED"}`);
      }
    });
  }

  setAudio(state) {
    this.audioActive = state;
    this.soundToggleBtn.innerHTML = this.audioActive ? "🔊 SOUND: ON" : "🔇 SOUND: MUTED";
    if (state) this.playBeep(900, 0.05, "sine");
  }

  playBeep(frequency = 800, duration = 0.03, type = "square") {
    if (!this.audioActive) return;
    
    try {
      if (!this.audioCtx) {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      
      if (this.audioCtx.state === "suspended") {
        this.audioCtx.resume();
      }

      const osc = this.audioCtx.createOscillator();
      const gainNode = this.audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, this.audioCtx.currentTime);
      
      gainNode.gain.setValueAtTime(0.04, this.audioCtx.currentTime); // keep it soft and subtle
      gainNode.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + duration);

      osc.connect(gainNode);
      gainNode.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch (e) {
      console.warn("Audio Context init blocked or not supported:", e);
    }
  }

  // --- Real-time Clock Ticker ---
  initClock() {
    const updateTime = () => {
      // Dynamic time in Yamunanagar, India (IST / UTC+5:30)
      const options = {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
      };
      const formatter = new Intl.DateTimeFormat("en-US", options);
      const parts = formatter.format(new Date());
      this.timeElement.innerHTML = `${parts} IST`;
    };
    updateTime();
    setInterval(updateTime, 1000);
  }

  // --- CRT Screen overlays ---
  initCRT() {
    this.crtToggleBtn.addEventListener("click", () => {
      const active = this.bodyElement.classList.contains("crt-scanlines-active");
      const overlay = document.querySelector(".crt-scanlines-overlay");
      
      if (active) {
        this.bodyElement.classList.remove("crt-scanlines-active");
        if (overlay) overlay.style.display = "none";
        this.crtToggleBtn.innerHTML = "📺 CRT: BYPASS";
        this.playBeep(500, 0.08, "sawtooth");
      } else {
        this.bodyElement.classList.add("crt-scanlines-active");
        if (overlay) overlay.style.display = "block";
        this.crtToggleBtn.innerHTML = "📺 CRT: FILTER";
        this.playBeep(1200, 0.08, "sine");
      }
    });
  }

  triggerPowerOnEffect() {
    const screen = document.querySelector(".crt-screen");
    if (screen) {
      screen.classList.add("screen-turn-on");
      // Add slight CRT flicker
      setTimeout(() => {
        screen.classList.remove("screen-turn-on");
        screen.classList.add("crt-flicker");
      }, 600);
    }
  }

  // --- Theme switcher support ---
  setTheme(themeName) {
    this.bodyElement.classList.remove("theme-green", "theme-amber");
    this.currentTheme = themeName;
    
    if (themeName === "green") {
      this.bodyElement.classList.add("theme-green");
      this.playBeep(600, 0.1, "sine");
      return true;
    } else if (themeName === "amber") {
      this.bodyElement.classList.add("theme-amber");
      this.playBeep(400, 0.1, "sine");
      return true;
    } else if (themeName === "paper" || themeName === "default") {
      this.playBeep(800, 0.1, "sine");
      return true;
    }
    return false;
  }

  // --- Interactive Terminal Bindings ---
  initTerminal() {
    const consoleHistory = document.getElementById("console-history");
    const consoleInputField = document.getElementById("console-input-field");
    const consoleInputPrefix = document.getElementById("console-input-prefix");

    this.terminal = new RohanOS_Terminal(consoleHistory, consoleInputField, consoleInputPrefix);
    
    // Initial banner print
    this.terminal.writeLine("ROHAN_OS v2.6.0-LTS [Connected to Workstation-01]");
    this.terminal.writeLine("Terminal security system engaged. Sandbox active.");
    this.terminal.writeLine("Type <span class=\"text-orange\">help</span> to explore available commands.");
    this.terminal.writeLine("");
  }

  // --- Workspace navigation & tabs manager ---
  initSidebarAndTabs() {
    this.sidebarNodes.forEach(node => {
      node.addEventListener("click", () => {
        const fileId = node.dataset.file;
        this.openFile(fileId);
      });
    });

    // Inspector close button
    this.inspectorCloseBtn.addEventListener("click", () => {
      this.inspectorElement.classList.remove("open");
      this.playBeep(400, 0.05, "sine");
    });
  }

  openTabByFile(filename) {
    // Map filename to visual file section ID
    const fileMap = {
      "home.sh": "home_sh",
      "case_studies.sh": "design_works_sh",
      "design_works.sh": "design_works_sh",
      "my_details.json": "my_details_json",
      "gallery.sh": "gallery_sh",
      "resume.pdf": "resume_pdf",
      "live_deploys.sh": "live_deploys_sh",
      "contact_init.sh": "contact_init_sh"
    };
    
    const fileId = fileMap[filename];
    if (fileId) {
      this.openFile(fileId, false); // open file in editor
      return true;
    }
    return false;
  }

  openFile(fileId, triggerTerminalCommand = true) {
    this.playBeep(1000, 0.02, "triangle");
    
    // Switch active tab ID
    this.activeTabId = fileId;
    this.openTabs.add(fileId);
    
    // 1. Update Sidebar nodes active state
    this.sidebarNodes.forEach(n => {
      if (n.dataset.file === fileId) {
        n.classList.add("active");
      } else {
        n.classList.remove("active");
      }
    });

    // 2. Refresh top workspace tabs bar
    this.renderTabsBar();

    // 3. Switch active content panel section
    this.panelSections.forEach(sec => {
      if (sec.id === fileId) {
        sec.classList.add("active");
      } else {
        sec.classList.remove("active");
      }
    });

    // Close project details drawer when changing tabs
    this.inspectorElement.classList.remove("open");

    // 4. Optionally print simulated log command execution in terminal
    if (triggerTerminalCommand && this.terminal) {
      const fileName = fileId.replace("_", ".");
      this.terminal.writeLine(`<span class="term-prompt">visitor@portfolio:~$</span> exec cat ${fileName}`, "text-muted");
      this.terminal.writeLine(`[OK] Mounted stream node: '${fileName}'`, "text-green");
    }
  }

  renderTabsBar() {
    this.tabContainer.innerHTML = "";
    this.openTabs.forEach(tabId => {
      const tabName = tabId.replace("_", ".");
      const isActive = tabId === this.activeTabId;

      const tabEl = document.createElement("div");
      tabEl.className = `viewport-tab ${isActive ? "active" : ""}`;
      tabEl.innerHTML = `
        <span class="file-icon"></span>
        <span>${tabName}</span>
        ${tabId !== "home_sh" ? `<span class="viewport-tab-close">&times;</span>` : ""}
      `;

      // Tab select trigger
      tabEl.addEventListener("click", (e) => {
        if (e.target.classList.contains("viewport-tab-close")) {
          e.stopPropagation();
          this.closeTab(tabId);
        } else {
          this.openFile(tabId);
        }
      });

      this.tabContainer.appendChild(tabEl);
    });
  }

  closeTab(tabId) {
    this.playBeep(450, 0.02, "sine");
    if (this.openTabs.has(tabId) && tabId !== "home_sh") {
      this.openTabs.delete(tabId);
      
      // If we closed the active tab, fall back to last remaining tab
      if (this.activeTabId === tabId) {
        const remainingTabs = Array.from(this.openTabs);
        this.openFile(remainingTabs[remainingTabs.length - 1]);
      } else {
        this.renderTabsBar();
      }
    }
  }

  // --- Dynamic renderers for Portfolio Data ---

  renderCaseStudies() {
    const grid = document.getElementById("projects-grid");
    grid.innerHTML = "";

    window.ROHAN_DATA.caseStudies.forEach(cs => {
      const card = document.createElement("div");
      card.className = "project-node";
      card.innerHTML = `
        <div class="project-header">
          <div class="project-id">${cs.id}</div>
          <div class="project-status">
            <span class="status-dot" style="background-color: ${cs.color}; box-shadow: 0 0 6px ${cs.color};"></span>
            ${cs.status}
          </div>
        </div>
        <div class="project-body">
          <h3 class="project-title">${cs.project}</h3>
          <div class="project-type">${cs.type}</div>
          <p class="project-desc">${cs.description}</p>
          <div class="project-tags">
            ${cs.tags.map(t => `<span class="project-tag">${t}</span>`).join("")}
          </div>
        </div>
        <div class="project-footer">
          <div class="project-role" style="font-size:11px; opacity:0.7;">ROLE: ${cs.role.toUpperCase()}</div>
          <span class="btn-inspect" data-id="${cs.id}">INSPECT_NODE() &gt;</span>
        </div>
      `;

      // Set listener to expand project details panel drawer
      card.querySelector(".btn-inspect").addEventListener("click", () => {
        this.inspectProject(cs.id);
      });

      grid.appendChild(card);
    });
  }

  inspectProject(projectId) {
    this.playBeep(1200, 0.05, "triangle");
    const cs = window.ROHAN_DATA.caseStudies.find(p => p.id === projectId);
    if (!cs) return;

    const titleEl = document.getElementById("inspector-title");
    const detailsEl = document.getElementById("inspector-details-box");

    titleEl.innerHTML = `INSPECTING: ${cs.project.toUpperCase()}`;
    
    let statsTable = "";
    if (cs.metrics) {
      statsTable = `
        <div style="margin-bottom: 20px; border: var(--border-style); background:rgba(0,0,0,0.02); padding: 12px;">
          <h4 style="color:var(--color-orange); font-size:14px; margin-bottom:8px; border-bottom:1px dashed var(--border-color); padding-bottom:4px;">KEY METRIC TELEMETRY:</h4>
          <table style="width:100%; font-family:var(--font-code); font-size:12px; border-collapse:collapse;">
            <tr>
              ${Object.keys(cs.metrics).map(k => `<td style="padding:4px; font-weight:bold; color:var(--text-muted);">${k.toUpperCase()}:</td>`).join("")}
            </tr>
            <tr>
              ${Object.values(cs.metrics).map(v => `<td style="padding:4px; font-size:15px; color:var(--color-green);">${v}</td>`).join("")}
            </tr>
          </table>
        </div>
      `;
    }

    detailsEl.innerHTML = `
      <div>
        <h3 style="font-size: 28px; color: var(--color-orange); margin-bottom:4px;">${cs.project}</h3>
        <div style="font-family:var(--font-code); font-size:12px; color:var(--text-muted); margin-bottom:16px;">${cs.type}</div>
        
        <p style="font-size:15px; line-height:1.6; margin-bottom:20px;">${cs.description}</p>
        
        ${statsTable}
        
        <div style="margin-bottom: 20px;">
          <h4 style="color: var(--color-orange); margin-bottom: 8px;">CORE RESPONSIBILITIES:</h4>
          <ul style="padding-left: 20px; font-size: 14px; line-height: 1.6;">
            ${cs.features.map(f => `<li style="margin-bottom: 6px;"><span style="color:var(--color-green);">*</span> ${f}</li>`).join("")}
          </ul>
        </div>
        
        ${cs.website ? `
          <div style="margin-top: 30px;">
            <a href="${cs.website}" target="_blank" class="btn-execute" style="display:inline-block; font-size:14px; padding: 8px 20px; text-decoration:none;">VISIT_LIVE_SITE() &gt;</a>
          </div>
        ` : ""}
      </div>
    `;

    this.inspectorElement.classList.add("open");
  }

  renderGallery() {
    const masonry = document.getElementById("gallery-masonry");
    const filterBar = document.getElementById("gallery-filters");
    
    // 1. Gather all unique categories
    const categories = ["ALL", ...new Set(window.ROHAN_DATA.gallery.map(g => g.category.toUpperCase()))];
    
    // 2. Render category filters
    filterBar.innerHTML = "";
    categories.forEach(cat => {
      const btn = document.createElement("button");
      btn.className = `filter-btn ${cat === "ALL" ? "active" : ""}`;
      btn.textContent = cat;
      btn.addEventListener("click", () => {
        this.playBeep(900, 0.03, "sine");
        filterBar.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.filterGalleryItems(cat);
      });
      filterBar.appendChild(btn);
    });

    this.filterGalleryItems("ALL");
  }

  filterGalleryItems(category) {
    const masonry = document.getElementById("gallery-masonry");
    masonry.innerHTML = "";

    window.ROHAN_DATA.gallery.forEach((g, index) => {
      if (category !== "ALL" && g.category.toUpperCase() !== category) return;

      const card = document.createElement("div");
      
      // Alternate sizes for masonry grid styling
      let sizeClass = "";
      if (index % 3 === 0) sizeClass = "size-wide";
      else if (index % 4 === 1) sizeClass = "size-tall";
      
      card.className = `gallery-card ${sizeClass}`;
      card.innerHTML = `
        <div class="gallery-asset-container">
          ${this.getGallerySVGContent(g.svgType, g.title)}
          <div class="gallery-overlay">
            <div>
              <div class="gallery-overlay-title">${g.title}</div>
              <div style="font-size:11px; color:#aaa; margin-top:2px;">CATEGORY: ${g.category.toUpperCase()}</div>
            </div>
            <div class="gallery-overlay-meta">
              <div style="margin-bottom: 4px;">${g.description}</div>
              <div>DIM: ${g.dimensions} | TOOL: ${g.tool.toUpperCase()}</div>
            </div>
          </div>
        </div>
        <div class="gallery-footer">
          <span style="font-family:var(--font-code); font-size:11px;">${g.title}</span>
          <span style="font-size:10px; color:var(--color-orange);">${g.category}</span>
        </div>
      `;

      card.addEventListener("click", () => {
        this.openLightbox(g);
      });

      masonry.appendChild(card);
    });
  }

  // Draw premium custom designer wireframes and visual SVGs inline
  getGallerySVGContent(type, title) {
    let svgBody = "";
    
    if (type === "dashboard") {
      svgBody = `
        <!-- Calendar Grid dashboard Wireframe mockup -->
        <rect width="100%" height="100%" fill="none" stroke="var(--border-color)" stroke-width="1"/>
        <line x1="0" y1="20" x2="240" y2="20" stroke="var(--border-color)" stroke-dasharray="2 2"/>
        <!-- Sidebar -->
        <rect x="5" y="25" width="40" height="150" fill="none" stroke="var(--border-color)"/>
        <line x1="10" y1="40" x2="35" y2="40" stroke="var(--border-color)"/>
        <line x1="10" y1="50" x2="35" y2="50" stroke="var(--border-color)"/>
        <line x1="10" y1="60" x2="35" y2="60" stroke="var(--border-color)"/>
        <!-- Calendar Grid -->
        <rect x="55" y="25" width="180" height="110" fill="none" stroke="var(--border-color)"/>
        <line x1="55" y1="45" x2="235" y2="45" stroke="var(--border-color)"/>
        <!-- Columns -->
        <line x1="100" y1="25" x2="100" y2="135" stroke="var(--border-color)" stroke-dasharray="1 3"/>
        <line x1="145" y1="25" x2="145" y2="135" stroke="var(--border-color)" stroke-dasharray="1 3"/>
        <line x1="190" y1="25" x2="190" y2="135" stroke="var(--border-color)" stroke-dasharray="1 3"/>
        <!-- Scheduled Post Blocks -->
        <rect x="60" y="55" width="35" height="20" fill="var(--color-orange)" opacity="0.3"/>
        <rect x="105" y="80" width="35" height="30" fill="var(--color-green)" opacity="0.3"/>
        <rect x="150" y="60" width="35" height="15" fill="var(--color-green)" opacity="0.2"/>
        <rect x="195" y="95" width="35" height="25" fill="var(--color-orange)" opacity="0.2"/>
        <circle cx="215" cy="40" r="3" fill="var(--color-orange)"/>
      `;
    } else if (type === "landing") {
      svgBody = `
        <!-- E-Commerce Hero Landing Page Mockup -->
        <rect width="100%" height="100%" fill="none" stroke="var(--border-color)" stroke-width="1"/>
        <line x1="10" y1="15" x2="230" y2="15" stroke="var(--border-color)"/>
        <circle cx="15" cy="15" r="2" fill="var(--color-green)"/>
        <!-- Bold Typography Text Header -->
        <text x="15" y="55" font-family="var(--font-ui)" font-size="22" fill="var(--color-orange)" font-weight="bold">AERO SPACE</text>
        <text x="15" y="70" font-family="var(--font-code)" font-size="7" fill="var(--text-muted)">// ZERO GRAVITY SNEAKERS FRAMEWORK</text>
        <!-- Sneaker silhouette wireframe outline -->
        <path d="M 120,95 Q 110,80 140,80 Q 155,80 170,90 T 215,95 Q 220,105 180,105 H 125 Z" fill="none" stroke="var(--border-color)" stroke-width="1.5"/>
        <line x1="125" y1="105" x2="140" y2="85" stroke="var(--border-color)" stroke-dasharray="1 1"/>
        <!-- Action Buttons -->
        <rect x="15" y="90" width="45" height="12" fill="none" stroke="var(--color-green)" stroke-width="1"/>
        <text x="22" y="98" font-family="var(--font-ui)" font-size="6" fill="var(--color-green)">EXECUTE()</text>
      `;
    } else if (type === "mobile") {
      svgBody = `
        <!-- Mobile App User Interface Wireframe -->
        <rect width="100%" height="100%" fill="none" stroke="var(--border-color)" stroke-width="1"/>
        <!-- Outer device shell curve -->
        <rect x="80" y="10" width="80" height="160" rx="6" fill="none" stroke="var(--border-color)" stroke-width="1.5"/>
        <circle cx="120" cy="163" r="3" fill="none" stroke="var(--border-color)"/>
        <line x1="105" y1="14" x2="135" y2="14" stroke="var(--border-color)" stroke-width="2"/>
        <!-- Cards List -->
        <rect x="86" y="28" width="68" height="24" rx="2" fill="none" stroke="var(--border-color)"/>
        <circle cx="95" cy="40" r="5" fill="var(--color-orange)" opacity="0.3"/>
        <line x1="105" y1="36" x2="145" y2="36" stroke="var(--border-color)"/>
        <line x1="105" y1="42" x2="130" y2="42" stroke="var(--border-color)" stroke-dasharray="2 1"/>
        
        <rect x="86" y="58" width="68" height="24" rx="2" fill="none" stroke="var(--border-color)"/>
        <circle cx="95" cy="70" r="5" fill="var(--color-green)" opacity="0.3"/>
        <line x1="105" y1="66" x2="145" y2="66" stroke="var(--border-color)"/>
        
        <rect x="86" y="88" width="68" height="24" rx="2" fill="none" stroke="var(--border-color)"/>
        <circle cx="95" cy="100" r="5" fill="var(--color-orange)" opacity="0.1"/>
        <line x1="105" y1="96" x2="145" y2="96" stroke="var(--border-color)"/>
      `;
    } else if (type === "wireframe") {
      svgBody = `
        <!-- Standard Blueprint UX Wireframe storyboard with structural cross-box -->
        <rect width="100%" height="100%" fill="none" stroke="var(--border-color)" stroke-width="1"/>
        <!-- Blueprint grids -->
        <line x1="0" y1="90" x2="240" y2="90" stroke="var(--border-color)" stroke-opacity="0.2"/>
        <line x1="120" y1="0" x2="120" y2="180" stroke="var(--border-color)" stroke-opacity="0.2"/>
        <!-- Structural X Image Block -->
        <rect x="40" y="30" width="160" height="90" fill="none" stroke="var(--border-color)" stroke-width="1"/>
        <line x1="40" y1="30" x2="200" y2="120" stroke="var(--border-color)"/>
        <line x1="200" y1="30" x2="40" y2="120" stroke="var(--border-color)"/>
        <text x="45" y="42" font-family="var(--font-code)" font-size="8" fill="var(--color-orange)">IMG_BOX_01 [PLACEHOLDER]</text>
      `;
    } else if (type === "system") {
      svgBody = `
        <!-- Design Token Component Specs -->
        <rect width="100%" height="100%" fill="none" stroke="var(--border-color)" stroke-width="1"/>
        <!-- Primary Buttons Spec -->
        <rect x="20" y="25" width="70" height="20" rx="3" fill="none" stroke="var(--color-orange)"/>
        <text x="32" y="37" font-family="var(--font-ui)" font-size="7" fill="var(--color-orange)">BTN_ACTIVE</text>
        <line x1="90" y1="35" x2="130" y2="35" stroke="var(--color-orange)"/>
        <text x="135" y="38" font-family="var(--font-code)" font-size="6" fill="var(--text-muted)">// padding: 8px 16px</text>

        <!-- Dynamic Color circles -->
        <circle cx="30" cy="80" r="10" fill="var(--color-green)"/>
        <text x="50" y="83" font-family="var(--font-code)" font-size="7" fill="var(--text-primary)">HEX #0F8F35</text>
        
        <circle cx="30" cy="110" r="10" fill="var(--color-orange)"/>
        <text x="50" y="113" font-family="var(--font-code)" font-size="7" fill="var(--text-primary)">HEX #C66B14</text>
      `;
    } else {
      // Default Analytics display
      svgBody = `
        <!-- Dashboard Graph/Telemetry Node -->
        <rect width="100%" height="100%" fill="none" stroke="var(--border-color)" stroke-width="1"/>
        <!-- Graph lines -->
        <path d="M 20,130 L 60,110 L 100,120 L 140,80 L 180,95 L 220,40" fill="none" stroke="var(--color-green)" stroke-width="2"/>
        <circle cx="220" cy="40" r="3" fill="var(--color-green)"/>
        <circle cx="140" cy="80" r="3" fill="var(--color-green)"/>
        <!-- Grid horizontal lines -->
        <line x1="20" y1="130" x2="220" y2="130" stroke="var(--border-color)"/>
        <line x1="20" y1="100" x2="220" y2="100" stroke="var(--border-color)" stroke-dasharray="2 2" stroke-opacity="0.5"/>
        <line x1="20" y1="70" x2="220" y2="70" stroke="var(--border-color)" stroke-dasharray="2 2" stroke-opacity="0.5"/>
        <line x1="20" y1="40" x2="220" y2="40" stroke="var(--border-color)" stroke-dasharray="2 2" stroke-opacity="0.5"/>
        <text x="25" y="32" font-family="var(--font-code)" font-size="7" fill="var(--color-green)">METRIC: SATURATION (+82%)</text>
      `;
    }

    return `
      <svg class="gallery-svg" viewBox="0 0 240 180" xmlns="http://www.w3.org/2000/svg">
        ${svgBody}
      </svg>
    `;
  }

  openLightbox(item) {
    this.playBeep(1100, 0.08, "sine");
    const lb = document.getElementById("gallery-lightbox");
    const lbContent = document.getElementById("lightbox-display-box");
    
    lbContent.innerHTML = `
      <div style="border: var(--border-double); background: var(--bg-screen); padding: 24px; max-width:600px; display:flex; flex-direction:column; gap:16px;">
        <div style="width:100%; display:flex; justify-content:center; background:#eaeae8; padding:20px; border-bottom:var(--border-style);">
          ${this.getGallerySVGContent(item.svgType, item.title)}
        </div>
        <div>
          <h3 style="font-size: 24px; color: var(--color-orange);">${item.title}</h3>
          <div style="font-family:var(--font-code); font-size:12px; color:var(--text-muted); margin-bottom:12px;">CATEGORY: ${item.category.toUpperCase()} | TOOL: ${item.tool.toUpperCase()}</div>
          <p style="font-size:14px; line-height:1.5;">${item.description}</p>
          <div style="font-family:var(--font-code); font-size:11px; margin-top:12px; color:var(--color-green);">SPECIFICATIONS: ${item.dimensions} // VECTOR_ASSET</div>
        </div>
      </div>
    `;

    lb.style.display = "flex";

    // Set closing hooks
    const closeHandler = () => {
      lb.style.display = "none";
      this.playBeep(400, 0.05, "sine");
      lb.querySelector(".gallery-lightbox-close").removeEventListener("click", closeHandler);
      lb.removeEventListener("click", overlayHandler);
    };

    const overlayHandler = (e) => {
      if (e.target === lb) closeHandler();
    };

    lb.querySelector(".gallery-lightbox-close").addEventListener("click", closeHandler);
    lb.addEventListener("click", overlayHandler);
  }

  renderGitTimeline() {
    const timeline = document.getElementById("git-timeline-box");
    timeline.innerHTML = "";

    window.ROHAN_DATA.gitTimeline.forEach(node => {
      const commit = document.createElement("div");
      commit.className = "commit-node";
      commit.innerHTML = `
        <div class="commit-hash">${node.commit}</div>
        <div class="commit-meta">
          <span>Author: ${node.author}</span> | 
          <span>Date: ${node.date}</span>
        </div>
        <div class="commit-msg">${node.repo} - <span class="text-green">${node.status}</span></div>
        <ul class="commit-details">
          ${node.bullets.map(b => `<li>${b}</li>`).join("")}
        </ul>
      `;
      timeline.appendChild(commit);
    });
  }

  renderCapabilities() {
    const box = document.getElementById("capabilities-json-box");
    box.innerHTML = "";

    window.ROHAN_DATA.capabilities.forEach(cap => {
      const tag = document.createElement("span");
      tag.className = "avail-tag";
      tag.style.borderColor = "var(--color-green)";
      tag.style.color = "var(--color-green)";
      tag.textContent = cap.toLowerCase();
      box.appendChild(tag);
    });
  }

  // --- Render JSON in code editor viewport ---
  renderJsonEditor() {
    const wrapper = document.getElementById("json-editor-content");
    wrapper.innerHTML = "";

    // Generate formatted HTML JSON with custom syntax classes
    const profileData = window.ROHAN_DATA.profile;
    
    // We construct the HTML representing JSON with colors manual parsing to prevent raw text escapes
    let jsonHtml = "";
    const lines = [
      `{`,
      `  <span class="json-key">"USER_ID"</span>: <span class="json-string">"${profileData.userId}"</span>,`,
      `  <span class="json-key">"STATUS"</span>: <span class="json-string">"${profileData.status}"</span>,`,
      `  <span class="json-key">"ROLE"</span>: <span class="json-string">"${profileData.role}"</span>,`,
      `  <span class="json-key">"LOCATION"</span>: <span class="json-string">"${profileData.location}"</span>,`,
      `  <span class="json-key">"EDUCATION"</span>: {`,
      `    <span class="json-key">"degree"</span>: <span class="json-string">"${profileData.education.degree}"</span>,`,
      `    <span class="json-key">"institution"</span>: <span class="json-string">"${profileData.education.institution}"</span>`,
      `  },`,
      `  <span class="json-key">"SKILLS"</span>: [`,
      profileData.skills.map(s => `    <span class="json-string">"${s}"</span>`).join(",\n"),
      `  ],`,
      `  <span class="json-key">"TOOLS"</span>: [`,
      profileData.tools.map(t => `    <span class="json-string">"${t}"</span>`).join(",\n"),
      `  ],`,
      `  <span class="json-key">"LANGUAGES"</span>: [`,
      profileData.languages.map(l => `    <span class="json-string">"${l}"</span>`).join(",\n"),
      `  ],`,
      `  <span class="json-key">"DESIGN_PHILOSOPHY"</span>: [`,
      profileData.philosophies.map(p => `    <span class="json-string">"${p.title}"</span>`).join(",\n"),
      `  ]`,
      `}`
    ].join("\n");

    const splitLines = jsonHtml + lines;
    
    // Generate line numbers
    const numLines = splitLines.split("\n").length;
    let numbers = "";
    for (let i = 1; i <= numLines; i++) {
      numbers += `${i}\n`;
    }

    const numbersCol = document.createElement("div");
    numbersCol.className = "line-numbers";
    numbersCol.textContent = numbers;

    const codeCol = document.createElement("div");
    codeCol.className = "code-content";
    codeCol.innerHTML = splitLines;

    wrapper.appendChild(numbersCol);
    wrapper.appendChild(codeCol);

    // Also populate interactive philosophy lists in side panel
    const philPanel = document.getElementById("philosophy-cards-box");
    philPanel.innerHTML = "";

    profileData.philosophies.forEach((p, i) => {
      const card = document.createElement("div");
      card.className = "philosophy-card";
      card.innerHTML = `
        <div class="philosophy-title">[${i+1}] ${p.title}</div>
        <div class="philosophy-desc">${p.detail}</div>
      `;
      philPanel.appendChild(card);
    });
  }

  // --- Form & Submit pipelines ---
  initContactForm() {
    const form = document.getElementById("traditional-contact-form");

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.playBeep(600, 0.08, "sine");

      const name = document.getElementById("contact-name").value.trim();
      const email = document.getElementById("contact-email").value.trim();
      const details = document.getElementById("contact-details").value.trim();

      if (!name || !email || !details) {
        alert("System constraints: all form inputs are required.");
        return;
      }

      this.sendEmail({ name, email, details });
    });
  }

  /**
   * Sends email via FormSubmit (no backend required).
   * - Notifies rohankhurana141@gmail.com with form data.
   * - Sends auto-reply "Thank you" mail to visitor.
   */
  async sendEmail(data) {
    const statusLog = document.getElementById("form-status-log");
    statusLog.style.display = "block";
    statusLog.innerHTML = `<span class="text-orange">> INITIATING_SECURE_TRANSMISSION...</span><br/>`;
    this.playBeep(440, 0.05, "sine");

    const payload = {
      name: data.name,
      email: data.email,
      message: data.details,
      _subject: `[ROHAN_OS] New Contact Request from ${data.name}`,
      _replyto: data.email,
      _autoresponse: `Hi ${data.name},\n\nThank you for reaching out through ROHAN_OS!\n\nI have received your message and will get back to you shortly.\n\nBest regards,\nRohan\nUI/UX Designer | rohankhurana141@gmail.com`,
      _template: "table",
      _captcha: "false"
    };

    try {
      const response = await fetch("https://formsubmit.co/ajax/rohankhurana141@gmail.com", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (result.success === "true" || result.success === true) {
        statusLog.innerHTML = `
          <span class="text-green">[SUCCESS] SECURE ENCRYPTED HANDSHAKE ESTABLISHED</span><br/>
          <span class="text-muted">> Packet transmitted for: <strong>${data.name}</strong></span><br/>
          <span class="text-green">> Message delivered to rohankhurana141@gmail.com ✓</span><br/>
          <span class="text-green">> Auto-reply dispatched to ${data.email} ✓</span><br/>
          <span class="text-orange">> COLLABORATION_REQUEST :: QUEUED_FOR_REVIEW</span>
        `;
        this.playBeep(1000, 0.5, "sine");
        // Clear the form
        document.getElementById("traditional-contact-form").reset();
      } else {
        statusLog.innerHTML = `<span style="color:red;">[ERROR] Transmission failed. Please email directly: rohankhurana141@gmail.com</span>`;
      }
    } catch (err) {
      statusLog.innerHTML = `<span style="color:red;">[ERROR] Network error. Please email: rohankhurana141@gmail.com</span>`;
      console.error("FormSubmit error:", err);
    }
  }

  syncWizardSubmission(data) {
    // Fill traditional HTML form fields
    document.getElementById("contact-name").value = data.name;
    document.getElementById("contact-email").value = data.email;
    document.getElementById("contact-details").value = data.details;

    // Trigger real email send
    this.sendEmail(data);
  }
}
