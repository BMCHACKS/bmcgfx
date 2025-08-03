let projectsData = [];
let currentMediaIndex = 0;
let currentMediaList = [];

async function loadProjects() {
  const response = await fetch('projects.json');
  const data = await response.json();
  projectsData = data.projects;
  const projectList = document.getElementById('project-list');

  projectsData.forEach((proj, index) => {
    const div = document.createElement('div');
    div.classList.add('project');
    div.textContent = proj.name;
    div.addEventListener('click', () => loadMedia(index, div));
    projectList.appendChild(div);
  });

  // ✅ Auto-select first project
  if (projectsData.length > 0) {
    const firstProject = projectList.querySelector('.project');
    if (firstProject) firstProject.click();
  }
}

function loadMedia(projectIndex, clickedElement) {
  document.querySelectorAll('.project').forEach(p => p.classList.remove('active'));
  clickedElement.classList.add('active');

  const grid = document.getElementById('media-grid');
  grid.innerHTML = '';

  const project = projectsData[projectIndex];

  // ✅ Use RELATIVE paths (works locally and on GitHub Pages)
  currentMediaList = project.files.map(file => `media/${project.folder}/${file}`);

  currentMediaList.forEach((file, idx) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'media-item';
    wrapper.style.animationDelay = `${idx * 0.05}s`;

    let mediaEl;
    if (file.endsWith('.mp4')) {
      mediaEl = document.createElement('video');
      mediaEl.src = file;
      mediaEl.autoplay = true;
      mediaEl.loop = true;
      mediaEl.muted = true;
      mediaEl.playsInline = true;
      mediaEl.controls = false;
      wrapper.classList.add('loaded');
    } 
    else if (file.endsWith('.pdf')) {
      const fileName = file.split('/').pop().replace('.pdf', '');
      mediaEl = document.createElement('img');

      // ✅ RELATIVE path for icons
      mediaEl.src = `icons/${fileName}-pdf.png`;
      mediaEl.onload = () => wrapper.classList.add('loaded');
    } 
    else {
      mediaEl = document.createElement('img');
      mediaEl.src = file;
      mediaEl.onload = () => wrapper.classList.add('loaded');
    }

    mediaEl.addEventListener('click', () => openLightbox(idx));
    wrapper.appendChild(mediaEl);
    grid.appendChild(wrapper);
  });
}

function openLightbox(index) {
  currentMediaIndex = index;
  const lightbox = document.getElementById('lightbox');
  const content = document.getElementById('lightbox-content');
  content.innerHTML = '';

  const file = currentMediaList[currentMediaIndex];

  if (file.endsWith('.mp4')) {
    const vid = document.createElement('video');
    vid.src = file;
    vid.controls = true;
    vid.autoplay = true;
    content.appendChild(vid);
  } 
  else if (file.endsWith('.pdf')) {
    const frame = document.createElement('iframe');
    frame.src = file;
    frame.style.width = '80vw';
    frame.style.height = '80vh';
    frame.style.border = 'none';
    content.appendChild(frame);
  }
  else {
    const img = document.createElement('img');
    img.src = file;
    content.appendChild(img);
  }

  lightbox.style.display = 'flex';
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  const content = document.getElementById('lightbox-content');
  
  const vid = content.querySelector('video');
  if (vid) {
    vid.pause();
    vid.currentTime = 0;
  }

  lightbox.style.display = 'none';
  content.innerHTML = '';
}

document.getElementById('lightbox-close').onclick = () => closeLightbox();

window.addEventListener('click', (e) => {
  const lightbox = document.getElementById('lightbox');
  if (e.target === lightbox) closeLightbox();
});

document.getElementById('prev').onclick = () => {
  currentMediaIndex = (currentMediaIndex - 1 + currentMediaList.length) % currentMediaList.length;
  openLightbox(currentMediaIndex);
};

document.getElementById('next').onclick = () => {
  currentMediaIndex = (currentMediaIndex + 1) % currentMediaList.length;
  openLightbox(currentMediaIndex);
};

loadProjects();
