// --- Main Interaction & Widget Logic ---

document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Sticky Navigation Scroll Effect
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // 2. Mobile Responsive Hamburger Menu Toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    // Close menu when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }

  // 3. Dynamic Dashboard Sidebar Toggle
  const dashMenuToggle = document.querySelector('.dash-menu-toggle');
  const sidebar = document.querySelector('.sidebar');
  if (dashMenuToggle && sidebar) {
    dashMenuToggle.addEventListener('click', () => {
      dashMenuToggle.classList.toggle('active');
      sidebar.classList.toggle('active');
    });
  }

  // 4. Interactive Savings / Treasury Yield Calculator
  const calcAmount = document.getElementById('calc-amount');
  const calcTerm = document.getElementById('calc-term');
  const valAmount = document.getElementById('val-amount');
  const valTerm = document.getElementById('val-term');
  const resRate = document.getElementById('res-rate');
  const resInterest = document.getElementById('res-interest');
  const resTotal = document.getElementById('res-total');

  if (calcAmount && calcTerm) {
    const updateCalculator = () => {
      const amount = parseFloat(calcAmount.value);
      const term = parseInt(calcTerm.value);
      
      // Dynamic yield interest rate depending on balance size (corporate tiered structure)
      let rate = 3.25;
      if (amount >= 500000 && amount < 2000000) rate = 4.10;
      else if (amount >= 2000000 && amount < 5000000) rate = 4.65;
      else if (amount >= 5000000) rate = 5.25;
      
      const interest = amount * (rate / 100) * (term / 12);
      const total = amount + interest;

      valAmount.textContent = `$${amount.toLocaleString('en-US')}`;
      valTerm.textContent = `${term} Months`;
      resRate.textContent = `${rate.toFixed(2)}%`;
      resInterest.textContent = `$${interest.toLocaleString('en-US', {maximumFractionDigits:2})}`;
      resTotal.textContent = `$${total.toLocaleString('en-US', {maximumFractionDigits:2})}`;
    };

    calcAmount.addEventListener('input', updateCalculator);
    calcTerm.addEventListener('input', updateCalculator);
    updateCalculator(); // Initial calculation on load
  }

  // 5. FAQ Accordion Panels
  const faqItems = document.querySelectorAll('.faq-item');
  if (faqItems) {
    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        // Close other panels
        faqItems.forEach(i => i.classList.remove('active'));
        // Toggle selected
        if (!isActive) {
          item.classList.add('active');
        }
      });
    });
  }

  // 6. Blog Articles Category Filtering
  const filterBtns = document.querySelectorAll('.filter-btn');
  const blogCards = document.querySelectorAll('.blog-card');
  if (filterBtns && blogCards) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Toggle active button
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filterVal = btn.getAttribute('data-filter');
        
        blogCards.forEach(card => {
          if (filterVal === 'all' || card.getAttribute('data-category') === filterVal) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // 7. Contact / Scheduling Forms Validation
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('contact-name').value.trim();
      const company = document.getElementById('contact-company').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const revenue = document.getElementById('contact-revenue').value;
      const message = document.getElementById('contact-message').value.trim();
      
      // Field validations
      if (name.length < 3) {
        alert('Please enter your full name (minimum 3 characters).');
        return;
      }
      if (company.length < 2) {
        alert('Please enter your entity legal name.');
        return;
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert('Please enter a valid corporate email address.');
        return;
      }
      
      if (!revenue) {
        alert('Please select your estimated annual revenue.');
        return;
      }
      
      if (message.length < 15) {
        alert('Please provide a summary of your requirements (minimum 15 characters).');
        return;
      }
      
      alert('Transmission secure. Re-routing to restricted signature authentication page...');
      window.location.href = '404.html';
    });
  }

  const meetingForm = document.getElementById('meeting-form');
  if (meetingForm) {
    meetingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const date = document.getElementById('meeting-date').value;
      const time = document.getElementById('meeting-time').value;
      alert(`Meeting successfully scheduled for ${date} at ${time}. A confirmation link has been sent to your email.`);
      meetingForm.reset();
    });
  }

  // 8. General Dashboard View Switcher (Tabs)
  const sidebarLinks = document.querySelectorAll('.sidebar-link[data-section]');
  const dashSections = document.querySelectorAll('.dash-section');
  if (sidebarLinks && dashSections) {
    sidebarLinks.forEach(link => {
      link.addEventListener('click', () => {
        // Toggle Active Sidebar Link
        sidebarLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        // Toggle Active Section Panel
        const sectionId = link.getAttribute('data-section');
        dashSections.forEach(sec => {
          if (sec.id === sectionId) {
            sec.classList.add('active');
          } else {
            sec.classList.remove('active');
          }
        });

        // Close mobile sidebar on layout click
        if (sidebar && window.innerWidth <= 768) {
          sidebar.classList.remove('active');
          if (dashMenuToggle) dashMenuToggle.classList.remove('active');
        }
      });
    });
  }

  // 9. CLIENT DASHBOARD: Wire Transfer Simulator
  const transferForm = document.getElementById('transfer-form');
  const balanceChecking = document.getElementById('balance-checking');
  const txRoster = document.getElementById('transaction-roster-body');

  if (transferForm && balanceChecking && txRoster) {
    transferForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const bank = document.getElementById('transfer-bank').value.trim();
      const routing = document.getElementById('transfer-routing').value.trim();
      const account = document.getElementById('transfer-account').value.trim();
      const amount = parseFloat(document.getElementById('transfer-amount').value);
      const memo = document.getElementById('transfer-memo').value.trim() || 'Wire Transfer';

      // Basic validations
      if (!bank || !routing || !account || !amount) {
        alert('Please fill in all details for the wire transfer.');
        return;
      }

      let currentBalance = parseFloat(balanceChecking.textContent.replace(/[^0-9.-]+/g,""));
      
      if (amount > currentBalance) {
        alert('Insufficient funds in account checking balance.');
        return;
      }

      // Deduct funds
      currentBalance -= amount;
      balanceChecking.textContent = `$${currentBalance.toLocaleString('en-US', {minimumFractionDigits: 2})}`;

      // Register mock transaction in Client Dashboard list
      const date = new Date().toLocaleDateString('en-US', {month: 'short', day: '2-digit', year: 'numeric'});
      const newRow = document.createElement('tr');
      newRow.innerHTML = `
        <td>${date}</td>
        <td>${bank} - Acct *${account.slice(-4)}</td>
        <td>${memo}</td>
        <td>Outflow</td>
        <td class="status-badge-container"><span class="status-badge warning">Pending Approval</span></td>
        <td style="font-weight:700; color:var(--accent-red)">-$${amount.toLocaleString('en-US', {minimumFractionDigits:2})}</td>
      `;
      txRoster.insertBefore(newRow, txRoster.firstChild);

      // Save transfer query to general global logs inside localStorage for Admin view access
      const pendingTransfers = JSON.parse(localStorage.getItem('corp_bank_pending_transfers')) || [];
      const session = JSON.parse(localStorage.getItem('corp_bank_current_user'));
      
      pendingTransfers.push({
        id: 'TX' + Math.floor(1000 + Math.random() * 9000),
        sender: session ? session.email : 'client@nexus.com',
        recipient: `${bank} (Acct: *${account.slice(-4)})`,
        amount: amount,
        memo: memo,
        date: date
      });
      localStorage.setItem('corp_bank_pending_transfers', JSON.stringify(pendingTransfers));

      alert('Wire transaction initiated successfully. Awaiting compliance approval desk review.');
      transferForm.reset();
    });
  }

  // 10. ADMIN DASHBOARD: Transaction Approvals desk simulator
  const adminTxBody = document.getElementById('admin-approvals-body');
  if (adminTxBody) {
    const renderAdminApprovals = () => {
      const pendingTransfers = JSON.parse(localStorage.getItem('corp_bank_pending_transfers')) || [];
      adminTxBody.innerHTML = '';

      if (pendingTransfers.length === 0) {
        adminTxBody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:var(--text-muted)">No pending transfers require compliance review.</td></tr>';
        return;
      }

      pendingTransfers.forEach((tx, idx) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${tx.id}</td>
          <td>${tx.sender}</td>
          <td>${tx.recipient}</td>
          <td>$${tx.amount.toLocaleString('en-US', {minimumFractionDigits:2})}</td>
          <td>${tx.date}</td>
          <td>
            <button class="action-btn action-btn-approve" onclick="resolveTx(${idx}, 'approve')">Approve</button>
            <button class="action-btn action-btn-reject" onclick="resolveTx(${idx}, 'reject')">Reject</button>
          </td>
        `;
        adminTxBody.appendChild(tr);
      });
    };

    // Attach to window so buttons can access it
    window.resolveTx = (idx, status) => {
      let pendingTransfers = JSON.parse(localStorage.getItem('corp_bank_pending_transfers')) || [];
      const tx = pendingTransfers[idx];
      
      alert(`Transaction ${tx.id} for $${tx.amount.toLocaleString()} has been ${status === 'approve' ? 'Approved' : 'Rejected'}.`);
      
      pendingTransfers.splice(idx, 1);
      localStorage.setItem('corp_bank_pending_transfers', JSON.stringify(pendingTransfers));
      renderAdminApprovals();
    };

    renderAdminApprovals();
  }
});
