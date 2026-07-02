// ===================================================
// FREE FIRE TOURNAMENT FLOW: MODES, MODAL, FORM, COUNTDOWN, SUCCESS
// ===================================================

(function () {
  const modeModal = document.getElementById('modeModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalStepChoose = document.getElementById('modalStepChoose');
  const modalStepForm = document.getElementById('modalStepForm');
  const modalTitle = document.getElementById('modalTitle');
  const modalSubtitle = document.getElementById('modalSubtitle');
  const suboptionGrid = document.getElementById('suboptionGrid');
  const customTeamsLayout = document.getElementById('customTeamsLayout');
  const customContinueBtn = document.getElementById('customContinueBtn');
  const backToChoose = document.getElementById('backToChoose');
  const formTitle = document.getElementById('formTitle');
  const formSubtitle = document.getElementById('formSubtitle');
  const sumMode = document.getElementById('sumMode');
  const sumSlots = document.getElementById('sumSlots');
  const dynFieldGroup = document.getElementById('dynFieldGroup');
  const registrationForm = document.getElementById('registrationForm');
  const successOverlay = document.getElementById('successOverlay');
  const successCloseBtn = document.getElementById('successCloseBtn');
  const quickRegisterBtn = document.getElementById('quickRegisterBtn');

  if (!modeModal) return;

  const MODE_CONFIG = {
    br: {
      name: 'Battle Royale',
      subtitle: 'Choose your squad size for Battle Royale',
      options: [
        { key: 'solo', icon: '🎯', title: 'Solo', sub: '1 Player', uidCount: 1 },
        { key: 'duo', icon: '🤝', title: 'Duo', sub: '2 Players', uidCount: 2 },
        { key: 'squad', icon: '👥', title: 'Squad', sub: '4 Players', uidCount: 4 },
      ],
    },
    cs: {
      name: 'Clash Squad',
      subtitle: 'Choose your format for Clash Squad',
      options: [
        { key: 'solo', icon: '🎯', title: 'Solo', sub: '1 Player', uidCount: 1 },
        { key: 'squad', icon: '👥', title: 'Squad', sub: '4 Players', uidCount: 4 },
      ],
    },
    custom: {
      name: 'Custom Room',
      subtitle: 'Set up Team A vs Team B',
      isCustom: true,
      uidCount: 4,
    },
  };

  let currentMode = null;
  let currentSub = null;
  let currentUidCount = 1;

  function openModal() {
    modeModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modeModal.classList.remove('active');
    document.body.style.overflow = '';
    showChooseStep();
  }

  function showChooseStep() {
    modalStepChoose.style.display = 'block';
    modalStepForm.classList.remove('active');
  }

  function showFormStep() {
    modalStepChoose.style.display = 'none';
    modalStepForm.classList.add('active');
  }

  modalCloseBtn.addEventListener('click', closeModal);
  modeModal.addEventListener('click', (e) => {
    if (e.target === modeModal) closeModal();
  });
  backToChoose.addEventListener('click', showChooseStep);

  // Mode card click -> open modal with relevant sub-options
  document.querySelectorAll('.mode-card').forEach((card) => {
    card.addEventListener('click', () => {
      const modeKey = card.getAttribute('data-mode');
      currentMode = modeKey;
      const cfg = MODE_CONFIG[modeKey];

      modalTitle.textContent = cfg.name;
      modalSubtitle.textContent = cfg.subtitle;
      suboptionGrid.innerHTML = '';

      if (cfg.isCustom) {
        suboptionGrid.style.display = 'none';
        customTeamsLayout.style.display = 'block';
      } else {
        suboptionGrid.style.display = 'grid';
        customTeamsLayout.style.display = 'none';

        cfg.options.forEach((opt) => {
          const el = document.createElement('div');
          el.className = 'suboption-card';
          el.innerHTML = `
            <span class="sub-icon">${opt.icon}</span>
            <h4>${opt.title}</h4>
            <span>${opt.sub}</span>
          `;
          el.addEventListener('click', () => {
            currentSub = opt.key;
            currentUidCount = opt.uidCount;
            buildDynamicForm(cfg.name, opt.title, opt.uidCount, false);
            showFormStep();
          });
          suboptionGrid.appendChild(el);
        });
      }

      showChooseStep();
      openModal();
    });
  });

  customContinueBtn.addEventListener('click', () => {
    currentSub = 'custom';
    currentUidCount = 4;
    buildDynamicForm('Custom Room', 'Team A vs Team B', 4, true);
    showFormStep();
  });

  quickRegisterBtn && quickRegisterBtn.addEventListener('click', () => {
    document.getElementById('modes').scrollIntoView({ behavior: 'smooth' });
  });

  function buildDynamicForm(modeName, subLabel, uidCount, isCustom) {
    formTitle.textContent = `${modeName} — ${subLabel}`;
    formSubtitle.textContent = isCustom
      ? 'Fill in both teams to lock your custom room.'
      : 'Fill your details to confirm your registration.';
    sumMode.textContent = subLabel;
    sumSlots.textContent = Math.max(2, Math.floor(Math.random() * 22) + 2);

    dynFieldGroup.innerHTML = '';

    function addInput(type, placeholder, required = true, name = '') {
      const input = document.createElement('input');
      input.type = type;
      input.className = 'form-input';
      input.placeholder = placeholder;
      input.name = name || placeholder.toLowerCase().replace(/\s+/g, '_');
      if (required) input.required = true;
      dynFieldGroup.appendChild(input);
    }

    if (isCustom) {
      const labelA = document.createElement('div');
      labelA.style.cssText = 'color:var(--primary-glow);font-weight:700;font-family:Rajdhani,sans-serif;margin-top:.4rem;';
      labelA.textContent = 'TEAM A';
      dynFieldGroup.appendChild(labelA);
      addInput('text', 'Team A Name', true, 'team_a_name');
      for (let i = 1; i <= uidCount; i++) addInput('text', `Team A — Player ${i} UID`, true, `uid${i}_team_a`);

      const labelB = document.createElement('div');
      labelB.style.cssText = 'color:var(--primary-glow);font-weight:700;font-family:Rajdhani,sans-serif;margin-top:.8rem;';
      labelB.textContent = 'TEAM B';
      dynFieldGroup.appendChild(labelB);
      addInput('text', 'Team B Name', true, 'team_b_name');
      for (let i = 1; i <= uidCount; i++) addInput('text', `Team B — Player ${i} UID`, true, `uid${i}_team_b`);

      addInput('tel', 'Contact Mobile Number', true, 'mobile');
      addInput('email', 'Email Address', true, 'gmail');
    } else {
      if (uidCount > 1) addInput('text', 'Team Name', true, 'team_name');
      for (let i = 1; i <= uidCount; i++) {
        const label = uidCount === 1 ? 'Player UID' : (i === 1 ? 'Leader UID' : `Player ${i} UID`);
        addInput('text', label, true, `uid${i}`);
      }
      addInput('tel', 'Mobile Number', true, 'mobile');
      addInput('email', 'Email Address', true, 'gmail');
    }
  }

  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyhl674-W0FOwSqL3U581Pm77fJO4PDq6P9jiiNU9IK23MHM5QI0kR13hwPVenSRjOc/exec';

  async function sendToGoogleSheets(data) {
    try {
      console.log('📤 Sending to Google Sheets:', data);
      
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify(data)
      });

      // With no-cors, we can't read the response body directly
      // But we can at least verify the fetch succeeded
      if (response && response.status) {
        console.log('✅ Request sent successfully (Status:', response.status + ')');
        return true;
      }

      console.log('✅ Data sent to Google Sheets');
      return true;
    } catch (error) {
      console.error('❌ Error sending data:', error);
      return false;
    }
  }

  registrationForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const inputs = [...dynFieldGroup.querySelectorAll('.form-input')];
    let gmail = '';
    let mobile = '';
    let allPlayers = [];
    let teamAPlayers = [];
    let teamBPlayers = [];
    let teamAName = '';
    let teamBName = '';

    // For custom mode: separate team A and team B
    if (currentMode === 'custom') {
      inputs.forEach((input) => {
        const value = input.value.trim();
        const placeholder = input.placeholder.toLowerCase();

        if (placeholder.includes('email')) {
          gmail = value;
        } else if (placeholder.includes('mobile')) {
          mobile = value;
        } else if (placeholder.includes('team a name')) {
          teamAName = value;
          // Don't add team name to players array
        } else if (placeholder.includes('team b name')) {
          teamBName = value;
          // Don't add team name to players array
        } else if (placeholder.includes('team a')) {
          // Only add UIDs, not the team name
          teamAPlayers.push(value);
        } else if (placeholder.includes('team b')) {
          // Only add UIDs, not the team name
          teamBPlayers.push(value);
        }
      });

      // Filter out empty values for validation
      const teamAUIDs = teamAPlayers.filter(p => p);
      const teamBUIDs = teamBPlayers.filter(p => p);

      // Validate: at least 1 player per team (ONLY for custom)
      if (teamAUIDs.length === 0) {
        alert('Team A must have at least 1 player UID');
        return;
      }
      if (teamBUIDs.length === 0) {
        alert('Team B must have at least 1 player UID');
        return;
      }

      if (!gmail || !mobile) {
        alert('Please fill Email and Mobile Number');
        return;
      }

      // Send ALL 8 UIDs: Team A first (uid1-4), then Team B (uid5-8)
      const data = {
        game: 'Free Fire',
        mode: 'Custom Room',
        player: (teamAUIDs.length + teamBUIDs.length).toString(),
        gmail: gmail,
        uid1: teamAUIDs[0] || '',
        uid2: teamAUIDs[1] || '',
        uid3: teamAUIDs[2] || '',
        uid4: teamAUIDs[3] || '',
        uid5: teamBUIDs[0] || '',
        uid6: teamBUIDs[1] || '',
        uid7: teamBUIDs[2] || '',
        uid8: teamBUIDs[3] || '',
        mobile: mobile,
        teamAName: teamAName,
        teamBName: teamBName
      };

      console.log('📤 Custom Room - Submitting ALL 8 UIDs:', data);
      console.log('   Team A Name:', teamAName, '| Team A UIDs:', teamAUIDs);
      console.log('   Team B Name:', teamBName, '| Team B UIDs:', teamBUIDs);
      console.log('   Payload:', data);
      
      const success = await sendToGoogleSheets(data);
      if (!success) {
        alert('Registration failed. Please try again.');
        return;
      }
    } else {
      // For BR/CS/Solo mode: normal flow (NO team validation)
      let teamName = '';
      let playerUIDs = [];

      inputs.forEach(input => {
        const value = input.value.trim();
        const placeholder = input.placeholder.toLowerCase();

        if (input.type === 'email') {
          gmail = value;
        } else if (input.type === 'tel') {
          mobile = value;
        } else if (placeholder.includes('team name')) {
          // Skip team name - don't store as UID
          teamName = value;
        } else {
          // All other fields are player UIDs
          playerUIDs.push(value);
        }
      });

      if (!gmail || !mobile) {
        alert('Please fill Email and Mobile Number');
        return;
      }

      const data = {
        game: 'Free Fire',
        mode: currentSub || '',
        player: currentUidCount || 1,
        gmail: gmail,
        uid1: playerUIDs[0] || '',
        uid2: playerUIDs[1] || '',
        uid3: playerUIDs[2] || '',
        uid4: playerUIDs[3] || '',
        mobile: mobile
      };

      console.log('📤 BR/CS/Solo Mode - Submitting:', data);
      console.log('   Team Name (not stored as UID):', teamName);
      console.log('   UIDs:', data.uid1, data.uid2, data.uid3, data.uid4);
      
      const success = await sendToGoogleSheets(data);
      if (!success) {
        alert('Registration failed. Please try again.');
        return;
      }
    }

    // Only show success AFTER data is sent
    closeModal();
    successOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    console.log('✅ Registration successful!');

    setTimeout(() => {
      registrationForm.reset();
      successOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }, 3000);
  });

  successCloseBtn.addEventListener('click', () => {
    successOverlay.classList.remove('active');
    document.body.style.overflow = '';
    registrationForm.reset();
  });

  successOverlay.addEventListener('click', (e) => {
    if (e.target === successOverlay) {
      successOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // ===== COUNTDOWN TIMER =====
  const cdDays = document.getElementById('cdDays');
  const cdHours = document.getElementById('cdHours');
  const cdMins = document.getElementById('cdMins');
  const cdSecs = document.getElementById('cdSecs');

  if (cdDays) {
    const targetDate = new Date('2026-06-25T18:00:00').getTime();
    function pad(n) {
      return String(n).padStart(2, '0');
    }
    function updateCountdown() {
      const now = Date.now();
      let diff = targetDate - now;
      if (diff < 0) diff = 0;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((diff / (1000 * 60)) % 60);
      const secs = Math.floor((diff / 1000) % 60);
      cdDays.textContent = pad(days);
      cdHours.textContent = pad(hours);
      cdMins.textContent = pad(mins);
      cdSecs.textContent = pad(secs);
    }
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }
})();

// ===== LIGHTNING STRIKE =====
(function () {
  const bolt = document.querySelector('.bolt-overlay');
  function lightningStrike() {
    bolt.classList.add('strike');
    document.body.classList.add('flash');
    setTimeout(() => {
      bolt.classList.remove('strike');
      document.body.classList.remove('flash');
    }, 450);
  }
  setInterval(() => {
    if (Math.random() > 0.5) {
      lightningStrike();
    }
  }, 6000);
})();

// ===== SCROLL REVEAL OBSERVER =====
(function () {
  const revealEls = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
  revealEls.forEach((el) => obs.observe(el));
})();

// ===== LOADING SCREEN =====
(function () {
  const loader = document.getElementById('loader');
  if (!loader) return;
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
    }, 600);
  });
  setTimeout(() => loader.classList.add('hidden'), 3000);
})();

// ===== ATMOSPHERE: FLOATING EMBERS =====
(function () {
  const container = document.getElementById('embers');
  if (!container) return;
  const count = 30;
  for (let i = 0; i < count; i++) {
    const ember = document.createElement('div');
    ember.className = 'ember';
    const size = 2 + Math.random() * 4;
    ember.style.width = size + 'px';
    ember.style.height = size + 'px';
    ember.style.left = Math.random() * 100 + '%';
    ember.style.setProperty('--drift', (Math.random() * 60 - 30) + 'px');
    const duration = 6 + Math.random() * 8;
    ember.style.animationDuration = duration + 's';
    ember.style.animationDelay = (Math.random() * duration) + 's';
    container.appendChild(ember);
  }
})();
