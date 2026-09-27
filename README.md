# ParSam Learning Centre

Static multi-page website for ParSam Learning Centre in Prospect Waterfalls, Harare.

## Pages

- `parsam.html` - Home
- `about.html` - School profile and leadership
- `academics.html` - Curriculum, fees and term calendar
- `resources.html` - Learning resources organized by form and subject
- `admissions.html` - Requirements, online application and application form download
- `gallery.html` - School and programme images
- `news.html` - Announcements
- `contact.html` - Contact details and location

## Run locally

Open `index.html` in a browser. It forwards to the Home page in `parsam.html`. The site uses plain HTML, CSS and JavaScript and does not require a build step or application server.

For deployment, publish the HTML, CSS, JavaScript, image assets and `ParSam_Student_Application_Form_Fillable.pdf` together, preserving their filenames and relative paths.

Online applications use FormSubmit to email a generated PDF to `parsamlearningcentre@gmail.com`. The school must confirm FormSubmit's first-use activation email, and live applications should be submitted from the deployed HTTPS website.

## Learning resources

The resource library is maintained in `resources.js`. Add each resource file under `resources/`, then add an entry to `resourceFiles` with its form number, subject name, title, type (`PDF`, `Video` or `Image`) and relative file path. Resource links are downloadable by students. The subject lists reflect the published O-Level and A-Level programmes; confirm each learner's subject combination with the school.
