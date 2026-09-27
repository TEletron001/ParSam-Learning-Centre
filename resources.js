'use strict';

const oLevelSubjects = [
  'Mathematics',
  'Combined Science',
  'Pure Sciences',
  'English Language',
  'Shona Language and Literature',
  'Geography',
  'Computer Science',
  'History',
  'Heritage Studies',
  'Family and Religious Studies',
  'Principles of Accounting',
  'Commerce'
];

const aLevelSubjects = [
  'Pure Mathematics',
  'Biology',
  'Chemistry',
  'Physics',
  'English Literature',
  'Shona Literature',
  'Heritage',
  'Geography',
  'Business Studies',
  'Economic History',
  'History',
  'Family and Religious Studies',
  'Accounting',
  'Economics',
  'Statistics'
];

const subjectsByForm = {
  1: oLevelSubjects,
  2: oLevelSubjects,
  3: oLevelSubjects,
  4: oLevelSubjects,
  5: aLevelSubjects,
  6: aLevelSubjects
};

const resourceFiles = [
  /*
    Example:
    { form: 1, subject: 'Mathematics', kind: 'PDF', title: 'Form 1 Mathematics Notes', href: 'mathematics-form1.pdf' },
    { form: 4, subject: 'Geography', kind: 'PDF', title: 'Form 4 Geography Notes', href: 'geography-form4.pdf' }
  */
];
const resourceTabs = [...document.querySelectorAll('.resource-tab')];
const resourcePanel = document.getElementById('resource-panel');
const resourceFormHeading = document.getElementById('resource-form-heading');
const resourceLevel = document.getElementById('resource-level');
const resourceSubjectNote = document.getElementById('resource-subject-note');
const resourceSubjects = document.getElementById('resource-subjects');
const resourceIcons = { PDF: 'fa-file-pdf', Video: 'fa-file-video', Image: 'fa-file-image' };

const renderResources = (formNumber) => {
  const formSubjects = subjectsByForm[formNumber];
  const level = formNumber <= 4 ? 'O-Level' : 'A-Level';

  resourceFormHeading.textContent = `Form ${formNumber}`;
  resourceLevel.textContent = level;
  resourcePanel.setAttribute('aria-labelledby', `form-${formNumber}-tab`);
  resourceSubjectNote.textContent = `Subjects reflect the published ${level} programme. Learner subject combinations may vary.`;
  resourceSubjects.replaceChildren();

  formSubjects.forEach((subject) => {
    const subjectCard = document.createElement('article');
    subjectCard.className = 'resource-subject';

    const subjectHeading = document.createElement('h3');
    subjectHeading.textContent = subject;
    subjectCard.append(subjectHeading);

    const matchingFiles = resourceFiles.filter((resource) => resource.form === formNumber && resource.subject === subject);

    if (matchingFiles.length === 0) {
      const emptyMessage = document.createElement('p');
      emptyMessage.className = 'resource-empty';
      emptyMessage.textContent = 'No resources posted yet.';
      subjectCard.append(emptyMessage);
    } else {
      const fileList = document.createElement('ul');
      fileList.className = 'resource-list';

      matchingFiles.forEach((resource) => {
        const item = document.createElement('li');
        const link = document.createElement('a');
        link.className = 'resource-link';
        link.href = resource.href;
        link.download = '';

        const icon = document.createElement('i');
        icon.className = `fas ${resourceIcons[resource.kind] || 'fa-file-download'}`;
        icon.setAttribute('aria-hidden', 'true');

        const title = document.createElement('span');
        title.append(document.createTextNode(resource.title));

        const kind = document.createElement('small');
        kind.className = 'resource-kind';
        kind.textContent = resource.kind;
        title.append(kind);

        link.append(icon, title);
        item.append(link);
        fileList.append(item);
      });

      subjectCard.append(fileList);
    }

    resourceSubjects.append(subjectCard);
  });
};

const activateForm = (formNumber, moveFocus = false) => {
  resourceTabs.forEach((tab) => {
    const isSelected = Number(tab.dataset.form) === formNumber;
    tab.setAttribute('aria-selected', String(isSelected));
    tab.tabIndex = isSelected ? 0 : -1;
    if (isSelected && moveFocus) tab.focus();
  });

  renderResources(formNumber);
};

resourceTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => activateForm(Number(tab.dataset.form)));
  tab.addEventListener('keydown', (event) => {
    let nextIndex;
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % resourceTabs.length;
    if (event.key === 'ArrowLeft') nextIndex = (index - 1 + resourceTabs.length) % resourceTabs.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = resourceTabs.length - 1;

    if (nextIndex !== undefined) {
      event.preventDefault();
      activateForm(Number(resourceTabs[nextIndex].dataset.form), true);
    }
  });
});

renderResources(1);