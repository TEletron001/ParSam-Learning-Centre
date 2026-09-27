'use strict';

const studentApplication = document.getElementById('studentApplication');

if (studentApplication) {
  const applicationStatus = document.getElementById('applicationStatus');
  const applicationSubmit = document.getElementById('applicationSubmit');
  const applicationPdf = document.getElementById('applicationPdf');
  const applicationReturnUrl = document.getElementById('applicationReturnUrl');
  const dateOfBirth = document.getElementById('dateOfBirth');
  const currentDate = new Date();
  const today = [currentDate.getFullYear(), String(currentDate.getMonth() + 1).padStart(2, '0'), String(currentDate.getDate()).padStart(2, '0')].join('-');

  dateOfBirth.max = today;

  if (new URLSearchParams(window.location.search).get('application') === 'sent') {
    applicationStatus.textContent = 'Your application was submitted. The admissions team will contact you.';
    const cleanUrl = new URL(window.location.href);
    cleanUrl.searchParams.delete('application');
    window.history.replaceState({}, '', cleanUrl);
  }

  studentApplication.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!window.jspdf || !window.jspdf.jsPDF || typeof DataTransfer === 'undefined') {
      applicationStatus.textContent = 'The application PDF could not be prepared. Please download the application form and email it to parsamlearningcentre@gmail.com.';
      return;
    }

    applicationSubmit.disabled = true;
    applicationStatus.textContent = 'Preparing your PDF application...';

    try {
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF();
      const margin = 18;
      const contentWidth = 174;
      let y = 22;

      const addPageIfNeeded = (height) => {
        if (y + height > 275) {
          pdf.addPage();
          y = 20;
        }
      };

      const addSection = (title) => {
        addPageIfNeeded(20);
        pdf.setFillColor(10, 47, 68);
        pdf.rect(margin, y, contentWidth, 9, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(11);
        pdf.text(title, margin + 4, y + 6.2);
        pdf.setTextColor(30, 43, 60);
        y += 15;
      };

      const addField = (label, fieldValue) => {
        const lines = pdf.splitTextToSize(`${label}: ${fieldValue || 'Not provided'}`, contentWidth);
        addPageIfNeeded(lines.length * 6 + 5);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        pdf.text(lines, margin, y);
        y += lines.length * 6 + 4;
      };

      const value = (id) => document.getElementById(id).value.trim();
      const formattedDate = new Date().toLocaleDateString('en-GB');

      pdf.setTextColor(10, 47, 68);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(18);
      pdf.text('ParSam Learning Centre', margin, y);
      y += 8;
      pdf.setFontSize(14);
      pdf.text('Student Application', margin, y);
      y += 7;
      pdf.setTextColor(70, 70, 70);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.text(`117 First Avenue, Prospect Waterfalls, Harare  |  Application date: ${formattedDate}`, margin, y);
      y += 12;

      addSection('Student details');
      addField('Full name', value('studentName'));
      addField('Date of birth', value('dateOfBirth'));
      addField('Applying for', value('applyingFor'));
      addField('Previous school', value('previousSchool'));
      addField('Last form completed', value('lastGrade'));
      addField('Home address', value('homeAddress'));

      addSection('Parent or guardian');
      addField('Full name', value('guardianName'));
      addField('Relationship to student', value('relationship'));
      addField('Phone number', value('guardianPhone'));
      addField('Email address', value('guardianEmail'));
      addField('Additional information', value('additionalInfo'));
      addField('Parent or guardian declaration', 'Confirmed');

      pdf.setFontSize(8);
      pdf.setTextColor(100, 100, 100);
      pdf.text('Submitted to ParSam Learning Centre admissions.', margin, 285);

      const studentSlug = value('studentName').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '');
      const filename = `ParSam-Application-${studentSlug || 'student'}-${today}.pdf`;
      const file = new File([pdf.output('blob')], filename, { type: 'application/pdf' });
      const transfer = new DataTransfer();
      transfer.items.add(file);
      applicationPdf.files = transfer.files;

      const returnUrl = new URL(window.location.href);
      returnUrl.searchParams.set('application', 'sent');
      returnUrl.hash = '';
      applicationReturnUrl.value = returnUrl.toString();

      applicationStatus.textContent = 'Sending your application to the admissions team...';
      studentApplication.submit();
    } catch (error) {
      applicationSubmit.disabled = false;
      applicationStatus.textContent = 'We could not prepare the application PDF. Please download the application form and email it to parsamlearningcentre@gmail.com.';
    }
  });
}

const mobileMenuButton = document.getElementById('mobileBtn');
const navigationMenu = document.getElementById('navMenu');
const siteNavigation = document.querySelector('.site-nav');
const mobileViewport = window.matchMedia('(max-width: 768px)');

if (mobileMenuButton && navigationMenu) {
  const menuIcon = mobileMenuButton.querySelector('i');
  const navigationLinks = [...navigationMenu.querySelectorAll('a[href]')];
  const currentPage = window.location.pathname.split('/').pop() || 'parsam.html';

  navigationLinks.forEach((link) => {
    const isCurrent = link.getAttribute('href') === currentPage;
    if (isCurrent) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });

  const setMenuOpen = (isOpen) => {
    navigationMenu.classList.toggle('active', isOpen);
    if (siteNavigation) siteNavigation.classList.toggle('open', isOpen);
    mobileMenuButton.setAttribute('aria-expanded', String(isOpen));
    mobileMenuButton.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');

    if (menuIcon) {
      menuIcon.classList.toggle('fa-bars', !isOpen);
      menuIcon.classList.toggle('fa-times', isOpen);
    }
  };

  mobileMenuButton.setAttribute('aria-controls', navigationMenu.id);
  setMenuOpen(false);

  mobileMenuButton.addEventListener('click', () => {
    setMenuOpen(mobileMenuButton.getAttribute('aria-expanded') !== 'true');
  });

  navigationLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (mobileViewport.matches) setMenuOpen(false);
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && mobileMenuButton.getAttribute('aria-expanded') === 'true') {
      setMenuOpen(false);
      mobileMenuButton.focus();
    }
  });

  document.addEventListener('click', (event) => {
    if (mobileViewport.matches &&
        mobileMenuButton.getAttribute('aria-expanded') === 'true' &&
        !navigationMenu.contains(event.target) &&
        !mobileMenuButton.contains(event.target)) {
      setMenuOpen(false);
    }
  });

  mobileViewport.addEventListener('change', (event) => {
    if (!event.matches) setMenuOpen(false);
  });

}