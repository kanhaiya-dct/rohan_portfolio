/**
 * ROHAN_OS Terminal Command Parser and Engine
 * Controls CLI inputs, history, commands, and interactive sequences
 */

class RohanOS_Terminal {
  constructor(consoleElement, inputElement, promptElement) {
    this.console = consoleElement;
    this.input = inputElement;
    this.prompt = promptElement;
    this.history = [];
    this.historyIndex = -1;
    this.wizardMode = false;
    this.wizardStep = 0;
    this.wizardData = { name: "", email: "", details: "" };

    // Bind event listeners
    this.input.addEventListener("keydown", (e) => this.handleKeydown(e));
    this.console.addEventListener("click", () => this.input.focus());
  }

  // Soft digital keystroke audio via app hooks if available
  playKeystrokeSound() {
    if (window.ROHAN_APP && typeof window.ROHAN_APP.playBeep === "function") {
      window.ROHAN_APP.playBeep(800, 0.015, "square");
    }
  }

  playEnterSound() {
    if (window.ROHAN_APP && typeof window.ROHAN_APP.playBeep === "function") {
      window.ROHAN_APP.playBeep(600, 0.05, "sine");
    }
  }

  writeLine(text, cssClass = "") {
    const line = document.createElement("div");
    line.className = `term-line ${cssClass}`;
    line.innerHTML = text;
    this.console.appendChild(line);
    this.console.scrollTop = this.console.scrollHeight;
  }

  clear() {
    this.console.innerHTML = "";
  }

  showPrompt(prefix = "visitor@portfolio:~$ ") {
    this.prompt.innerHTML = prefix;
  }

  handleKeydown(e) {
    // Keystroke feedback audio
    if (e.key.length === 1 || e.key === "Backspace" || e.key === "Enter") {
      this.playKeystrokeSound();
    }

    if (e.key === "Enter") {
      e.preventDefault();
      const command = this.input.value.trim();
      this.playEnterSound();

      if (command) {
        this.history.push(command);
        this.historyIndex = this.history.length;
      }

      this.input.value = "";
      this.processInput(command);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (this.historyIndex > 0) {
        this.historyIndex--;
        this.input.value = this.history[this.historyIndex];
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (this.historyIndex < this.history.length - 1) {
        this.historyIndex++;
        this.input.value = this.history[this.historyIndex];
      } else {
        this.historyIndex = this.history.length;
        this.input.value = "";
      }
    }
  }

  processInput(inputString) {
    // 1. Output the entered prompt first
    const activePrompt = this.prompt.innerHTML;
    this.writeLine(`<span class="term-prompt">${activePrompt}</span> ${inputString}`);

    // 2. Wizard Mode (Contact Questionnaire)
    if (this.wizardMode) {
      this.handleWizardStep(inputString);
      return;
    }

    // 3. Normal command parsing
    const parts = inputString.trim().split(/\s+/);
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    if (!command) return;

    switch (command) {
      case "help":
        this.cmdHelp();
        break;
      case "cat":
        this.cmdCat(args);
        break;
      case "clear":
        this.clear();
        break;
      case "neofetch":
        this.cmdNeofetch();
        break;
      case "theme":
        this.cmdTheme(args);
        break;
      case "contact":
      case "initiate_collaboration":
        this.startCollaborationWizard();
        break;
      case "audio":
        this.cmdAudio(args);
        break;
      case "scanlines":
        this.cmdScanlines(args);
        break;
      case "capabilities":
        this.cmdCapabilities();
        break;
      case "linkedin":
        this.cmdLinkedin();
        break;
      case "ls":
        this.cmdLs();
        break;
      default:
        this.writeLine(`Command not found: '${command}'. Type <span class="text-orange">help</span> for a list of active commands.`, "text-error");
    }
  }

  // --- CMD: help ---
  cmdHelp() {
    this.writeLine("ROHAN_OS Shell v2.6.0 - Available Commands:", "text-orange");
    const commandsList = [
      { cmd: "help", desc: "Display this utility summary map." },
      { cmd: "ls", desc: "List virtual system files and script modules." },
      { cmd: "cat &lt;file&gt;", desc: "Read target source file (e.g., cat my_details.json)." },
      { cmd: "neofetch", desc: "Output system information, stats, and ASCII OS design." },
      { cmd: "theme &lt;style&gt;", desc: "Modify system colors (theme green | theme amber | theme paper)." },
      { cmd: "audio &lt;on|off&gt;", desc: "Toggle keyboard acoustic click response." },
      { cmd: "scanlines &lt;on|off&gt;", desc: "Toggle CRT terminal overlay filter." },
      { cmd: "linkedin", desc: "Open Rohan's profile: linkedin.com in new window." },
      { cmd: "contact", desc: "Execute: initiate_collaboration() and submit details." },
      { cmd: "clear", desc: "Wipe terminal session history buffer." }
    ];

    commandsList.forEach(item => {
      this.writeLine(`  <span class="text-green" style="display:inline-block; width:180px;">${item.cmd}</span> - ${item.desc}`);
    });
  }

  // --- CMD: ls ---
  cmdLs() {
    this.writeLine("Directory listing: <span class="text-orange">rohan_os/</span>", "text-muted");
    const files = [
      "home.sh",
      "design_works.sh",
      "my_details.json",
      "gallery.sh",
      "resume.pdf",
      "live_deploys.sh",
      "capabilities.json",
      "contact_init.sh"
    ];
    this.writeLine(files.map(f => {
      let color = "text-green";
      if (f.endsWith(".sh")) color = "text-orange";
      if (f.endsWith(".json")) color = "text-green";
      if (f.endsWith(".pdf")) color = "text-primary";
      return `<span class="${color}">${f}</span>`;
    }).join("    "));
  }

  // --- CMD: cat ---
  cmdCat(args) {
    if (args.length === 0) {
      this.writeLine("Usage: cat &lt;filename&gt;. Type <span class=\"text-orange\">ls</span> to see all file nodes.", "text-warning");
      return;
    }

    const filename = args[0].toLowerCase();
    
    // Check if filename contains paths and resolve to base
    const baseName = filename.split("/").pop();

    if (window.ROHAN_APP && typeof window.ROHAN_APP.openTabByFile === "function") {
      const tabMapped = window.ROHAN_APP.openTabByFile(baseName);
      if (tabMapped) {
        this.writeLine(`[SUCCESS] File '${baseName}' mounted into primary workspace viewport.`, "text-green");
        return;
      }
    }

    // Direct terminal output fallback if workspace isn't fully bound yet
    this.writeLine(`[SYSTEM]: Buffering raw file stream of ${baseName}...`, "text-muted");

    if (baseName === "my_details.json") {
      this.writeLine(JSON.stringify(window.ROHAN_DATA.profile, null, 2), "text-green font-code");
    } else if (baseName === "capabilities.json") {
      this.writeLine(JSON.stringify(window.ROHAN_DATA.capabilities, null, 2), "text-green font-code");
    } else if (baseName === "home.sh") {
      this.writeLine(`Executing shell script: home.sh...`, "text-orange");
      this.writeLine(`Welcome to ROHAN_OS Portfolio Workshop! Status is currently: ${window.ROHAN_DATA.system.status}`);
    } else {
      this.writeLine(`File content of '${baseName}' is formatted for graphical workspace. Accessing via sidebar is recommended.`, "text-warning");
    }
  }

  // --- CMD: neofetch ---
  cmdNeofetch() {
    const ascii = `
 <span class="text-orange">______   ______   _    _   ______   _   _     ____   _____ </span>
<span class="text-orange">|  __  | |  __  | | |  | | |  __  | | \\ | |   / __ \\ / ____|</span>
<span class="text-orange">| |__) | | |  | | | |__| | | |__| | |  \\| |  | |  | | (___  </span>
<span class="text-orange">|  _  /  | |  | | |  __  | |  __  | | . \` |  | |  | |\\___ \\ </span>
<span class="text-orange">| | \\ \\  | |__| | | |  | | | |  | | | |\\  |  | |__| |____) |</span>
<span class="text-orange">|_|  \\_\\ |______| |_|  |_| |_|  |_| |_| \\_|   \\____/|_____/ </span>
`;

    const stats = `
<span class="text-orange">USER:</span>            ROHAN_KHURANA
<span class="text-orange">OS:</span>              ROHAN_OS v${window.ROHAN_DATA.system.version} (Monospace Linux/Cyberpunk)
<span class="text-orange">LOCATION:</span>        Yamunanagar, India (IST)
<span class="text-orange">ROLE:</span>            UI/UX Designer & Systems Architect
<span class="text-orange">DEVICES:</span>         Figma, Canva, Framer Pro
<span class="text-orange">EDUCATION:</span>       Tilak Raj Chadha Institute of Management and Technology
<span class="text-orange">CAPABILITIES:</span>    Systems Thinking, User Research, Wireframes, Prototyping,
                 Usability Testing, Design Systems, Responsive Grids
<span class="text-orange">MANIFESTO:</span>       "Design systems before screens. Human-first experiences."
<span class="text-orange">STATUS:</span>          <span class="text-green pulse-dot" style="display:inline-block; width:8px; height:8px; background:#0f8f35; border-radius:50%; margin-right:4px;"></span>ACTIVE_READY (Open for Collaboration)
`;
    this.writeLine(ascii);
    this.writeLine(stats);
  }

  // --- CMD: linkedin ---
  cmdLinkedin() {
    this.writeLine("[SYSTEM] Requesting external handshake with linkedin.com...", "text-muted");
    this.writeLine("Opening LinkedIn profile connection in a new window tab...", "text-green");
    window.open("https://www.linkedin.com/in/rohan-khurana-425912266", "_blank");
  }

  // --- CMD: theme ---
  cmdTheme(args) {
    if (args.length === 0) {
      this.writeLine("Usage: theme &lt;green | amber | paper&gt;", "text-warning");
      return;
    }
    const themeName = args[0].toLowerCase();
    if (window.ROHAN_APP && typeof window.ROHAN_APP.setTheme === "function") {
      const result = window.ROHAN_APP.setTheme(themeName);
      if (result) {
        this.writeLine(`[SYSTEM] Global visual scheme updated to: <span class="text-orange">${themeName.toUpperCase()}</span>`, "text-green");
      } else {
        this.writeLine(`Invalid theme: '${themeName}'. Valid options: green, amber, paper.`, "text-error");
      }
    }
  }

  // --- CMD: audio ---
  cmdAudio(args) {
    if (args.length === 0) {
      const active = window.ROHAN_APP ? window.ROHAN_APP.audioActive : false;
      this.writeLine(`Audio state is currently: <span class="text-orange">${active ? "ON" : "OFF"}</span>. Toggle with: audio on | audio off`);
      return;
    }
    const state = args[0].toLowerCase();
    if (window.ROHAN_APP && typeof window.ROHAN_APP.setAudio === "function") {
      if (state === "on" || state === "1") {
        window.ROHAN_APP.setAudio(true);
        this.writeLine("[SYSTEM] Acoustic keyboard click enabled.", "text-green");
      } else if (state === "off" || state === "0") {
        window.ROHAN_APP.setAudio(false);
        this.writeLine("[SYSTEM] Keystroke feedback muted.", "text-green");
      } else {
        this.writeLine("Invalid audio parameter. Use 'on' or 'off'.", "text-error");
      }
    }
  }

  // --- CMD: scanlines ---
  cmdScanlines(args) {
    if (args.length === 0) {
      const active = document.body.classList.contains("crt-scanlines-active");
      this.writeLine(`CRT scanlines filter state is currently: <span class="text-orange">${active ? "ON" : "OFF"}</span>. Toggle with: scanlines on | scanlines off`);
      return;
    }
    const state = args[0].toLowerCase();
    const overlay = document.querySelector(".crt-scanlines-overlay");
    if (state === "on" || state === "1") {
      document.body.classList.add("crt-scanlines-active");
      if (overlay) overlay.style.display = "block";
      this.writeLine("[SYSTEM] Scanline raster layer engaged.", "text-green");
    } else if (state === "off" || state === "0") {
      document.body.classList.remove("crt-scanlines-active");
      if (overlay) overlay.style.display = "none";
      this.writeLine("[SYSTEM] CRT scanline overlay bypassed.", "text-green");
    } else {
      this.writeLine("Invalid parameter. Use 'on' or 'off'.", "text-error");
    }
  }

  // --- CMD: capabilities ---
  cmdCapabilities() {
    this.writeLine("Core Professional Capabilities:", "text-orange");
    window.ROHAN_DATA.capabilities.forEach((cap, i) => {
      this.writeLine(` [${i+1}] ${cap.toUpperCase().replace("_", " ")}`);
    });
  }

  // --- WIZARD: initiate_collaboration ---
  startCollaborationWizard() {
    this.wizardMode = true;
    this.wizardStep = 1;
    this.wizardData = { name: "", email: "", details: "" };

    this.writeLine("==========================================", "text-orange");
    this.writeLine("     COLLABORATION MODULE DETECTED        ", "text-orange pulse-text");
    this.writeLine("==========================================", "text-orange");
    this.writeLine("Establishing secure interface connection... [OK]");
    this.writeLine("Please answer the following system queries to submit collaboration request:");
    this.writeLine("Press <span class=\"text-orange\">CTRL+C</span> or type 'exit' at any point to cancel.");
    this.writeLine("");

    this.showPrompt("ROH_OS Wizard [NAME]: ");
    this.input.placeholder = "Enter your full name/organization...";
  }

  handleWizardStep(input) {
    const cancelWords = ["exit", "quit", "cancel", "abort"];
    if (cancelWords.includes(input.trim().toLowerCase())) {
      this.cancelWizard();
      return;
    }

    switch (this.wizardStep) {
      case 1: // Name Input
        if (!input.trim()) {
          this.writeLine("Field cannot be empty. Please specify name/organization:", "text-error");
          this.showPrompt("ROH_OS Wizard [NAME]: ");
          return;
        }
        this.wizardData.name = input.trim();
        this.wizardStep = 2;
        this.showPrompt("ROH_OS Wizard [EMAIL]: ");
        this.input.placeholder = "Enter contact email address...";
        break;

      case 2: // Email Input
        const email = input.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
          this.writeLine("Invalid email matrix format. Please enter a valid email address:", "text-error");
          this.showPrompt("ROH_OS Wizard [EMAIL]: ");
          return;
        }
        this.wizardData.email = email;
        this.wizardStep = 3;
        this.showPrompt("ROH_OS Wizard [DETAILS]: ");
        this.input.placeholder = "Enter project brief, budget, timeline...";
        break;

      case 3: // Details Input
        if (!input.trim() || input.trim().length < 5) {
          this.writeLine("Description too brief. Please supply more project context:", "text-error");
          this.showPrompt("ROH_OS Wizard [DETAILS]: ");
          return;
        }
        this.wizardData.details = input.trim();
        this.submitWizard();
        break;
    }
  }

  submitWizard() {
    this.writeLine("");
    this.writeLine("Constructing secure telemetry payload...", "text-muted");
    this.writeLine(`  Name:    ${this.wizardData.name}`);
    this.writeLine(`  Email:   ${this.wizardData.email}`);
    this.writeLine("Establishing secure transport layer connection...", "text-muted");

    const payload = {
      name: this.wizardData.name,
      email: this.wizardData.email,
      message: this.wizardData.details,
      _subject: `ROHAN_OS: Collaboration request from ${this.wizardData.name}`,
      _autoresponse: `Thank you for reaching out to Rohan!\n\nYour message brief has been successfully encrypted and dispatched to Rohan's workstation. Rohan is currently reviewing active inquiries and will contact you shortly.\n\nProject details submitted:\n- Name: ${this.wizardData.name}\n- Brief: ${this.wizardData.details}\n\nThis is an automated system receipt from ROHAN_OS. Please do not reply directly to this mail.`
    };

    fetch("https://formsubmit.co/ajax/rohankhurana141@gmail.com", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(data => {
      this.writeLine("[OK] ENCRYPTING PAYLOAD...", "text-green");
      setTimeout(() => {
        this.writeLine("[OK] ESTABLISHING SECURE PORT...", "text-green");
        setTimeout(() => {
          this.writeLine("[OK] TRANSMITTING COLLABORATION REQUEST...", "text-green");
          setTimeout(() => {
            this.writeLine("==========================================", "text-green");
            this.writeLine("      SUCCESS: TRANSMISSION DEPLOYED      ", "text-green pulse-text");
            this.writeLine("==========================================", "text-green");
            this.writeLine("Thank you! Your payload was dispatched successfully.");
            this.writeLine("Rohan has been notified and will decrypt your message shortly.");
            this.writeLine("An automated confirmation receipt has been routed to your email inbox.");
            this.writeLine("");
            
            // Sync with GUI form if it's open
            if (window.ROHAN_APP && typeof window.ROHAN_APP.syncWizardSubmission === "function") {
              window.ROHAN_APP.syncWizardSubmission(this.wizardData);
            }

            this.resetConsoleAfterWizard();
          }, 300);
        }, 300);
      }, 300);
    })
    .catch(error => {
      console.error("Mailing pipeline transport failed, using fallback:", error);
      this.writeLine("[ERROR] Network layer connection failed. Launching fallback proxy...", "text-error");
      
      setTimeout(() => {
        this.writeLine("[OK] SECURE ENCRYPTION FALLBACK ENGAGED.", "text-warning");
        this.writeLine("Handshake completed with offline cache container. Dispatched details to mailto protocol.", "text-warning");
        window.open(`mailto:rohankhurana141@gmail.com?subject=Collaboration Request from ${this.wizardData.name}&body=Hi Rohan,%0D%0A%0D%0AI want to collaborate on a project.%0D%0A%0D%0AName: ${this.wizardData.name}%0D%0AEmail: ${this.wizardData.email}%0D%0ADetails: ${this.wizardData.details}`, "_blank");
        this.resetConsoleAfterWizard();
      }, 1000);
    });
  }

  cancelWizard() {
    this.writeLine("Transmission aborted. Collaboration wizard deactivated.", "text-warning");
    this.resetConsoleAfterWizard();
  }

  resetConsoleAfterWizard() {
    this.wizardMode = false;
    this.wizardStep = 0;
    this.input.placeholder = "Type 'help' for terminal commands...";
    this.showPrompt();
  }
}
