(function(){
  "use strict";

  var root = document.documentElement;
  var themeBtn = document.getElementById('themeToggle');
  function applyTheme(t){
    root.setAttribute('data-theme', t);
    themeBtn.textContent = t === 'dark' ? '☀️' : '🌙';
    themeBtn.setAttribute('aria-label', t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    themeBtn.title = t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
    document.querySelector('meta[name="theme-color"]').content = t === 'dark' ? '#231129' : '#fdf3ff';
  }
  var saved = null;
  try{ saved = localStorage.getItem('portfolio-theme'); }catch(e){}
  applyTheme(saved || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  themeBtn.addEventListener('click', function(){
    var cur = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(cur);
    try{ localStorage.setItem('portfolio-theme', cur); }catch(e){}
  });

  var navToggle = document.getElementById('navToggle');
  var navlinks = document.getElementById('navlinks');
  var navAnchors = Array.prototype.slice.call(navlinks.querySelectorAll('a'));
  navToggle.addEventListener('click', function(){
    var open = navlinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  navAnchors.forEach(function(a){
    a.addEventListener('click', function(){
      navlinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded','false');
    });
  });
  document.addEventListener('keydown', function(event){
    if(event.key === 'Escape' && navlinks.classList.contains('open')){
      navlinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded','false');
      navToggle.focus();
    }
  });

  var navTargets = navAnchors.map(function(anchor){
    return {anchor:anchor, target:document.querySelector(anchor.getAttribute('href'))};
  }).filter(function(entry){ return entry.target; });
  var backToTop = document.getElementById('backToTop');
  function updateScrollUI(){
    var headerHeight = document.querySelector('header').offsetHeight;
    var current = navTargets.length ? navTargets[0].anchor : null;
    navTargets.forEach(function(entry){
      if(entry.target.getBoundingClientRect().top <= headerHeight + 100) current = entry.anchor;
    });
    navAnchors.forEach(function(anchor){
      if(anchor === current) anchor.setAttribute('aria-current','location');
      else anchor.removeAttribute('aria-current');
    });
    backToTop.hidden = window.scrollY < 480;
  }
  window.addEventListener('scroll', updateScrollUI, {passive:true});
  window.addEventListener('resize', updateScrollUI);
  updateScrollUI();
  backToTop.addEventListener('click', function(){
    window.scrollTo({top:0, behavior:'smooth'});
  });

  var hobbyList = document.getElementById('hobbyList');
  var hideHobbies = document.getElementById('hideHobbies');
  var showHobbies = document.getElementById('showHobbies');
  var hobbyStatus = document.getElementById('hobbyStatus');
  var hobbyChoices = Array.prototype.slice.call(hobbyList.querySelectorAll('.hobby-choice'));
  var favoriteHobbies = [];
  var favoritesStorageAvailable = true;
  try{
    var savedHobbies = JSON.parse(localStorage.getItem('favorite-hobbies') || '[]');
    if(Array.isArray(savedHobbies)){
      favoriteHobbies = savedHobbies.filter(function(id){
        return hobbyChoices.some(function(choice){ return choice.dataset.hobby === id; });
      });
    }
  }catch(error){
    favoritesStorageAvailable = false;
  }
  function updateHobbyStatus(){
    if(hobbyList.hidden){
      hobbyStatus.textContent = 'Hobbies are hidden. Select Show to view them again.';
    }else if(favoriteHobbies.length){
      hobbyStatus.textContent = favoriteHobbies.length + ' favorite ' +
        (favoriteHobbies.length === 1 ? 'hobby is' : 'hobbies are') + ' saved.';
    }else{
      hobbyStatus.textContent = 'Tap a hobby to save it as a favorite.';
    }
    if(!favoritesStorageAvailable){
      hobbyStatus.textContent += ' Favorites are only saved for this visit because browser storage is unavailable.';
    }
  }
  hobbyChoices.forEach(function(choice){
    var selected = favoriteHobbies.indexOf(choice.dataset.hobby) !== -1;
    choice.setAttribute('aria-pressed', String(selected));
    choice.closest('li').classList.toggle('has-favorite', selected);
    choice.setAttribute('aria-label', (selected ? 'Remove ' : 'Add ') + choice.textContent + ' ' +
      (selected ? 'from' : 'to') + ' favorites');
    choice.addEventListener('click', function(){
      var index = favoriteHobbies.indexOf(choice.dataset.hobby);
      if(index === -1) favoriteHobbies.push(choice.dataset.hobby);
      else favoriteHobbies.splice(index, 1);
      var isSelected = index === -1;
      choice.setAttribute('aria-pressed', String(isSelected));
      choice.closest('li').classList.toggle('has-favorite', isSelected);
      choice.setAttribute('aria-label', (isSelected ? 'Remove ' : 'Add ') + choice.textContent + ' ' +
        (isSelected ? 'from' : 'to') + ' favorites');
      if(favoritesStorageAvailable){
        try{
          localStorage.setItem('favorite-hobbies', JSON.stringify(favoriteHobbies));
        }catch(error){
          favoritesStorageAvailable = false;
        }
      }
      updateHobbyStatus();
    });
  });
  updateHobbyStatus();
  hideHobbies.addEventListener('click', function(){
    hobbyList.hidden = true;
    hideHobbies.disabled = true;
    showHobbies.disabled = false;
    updateHobbyStatus();
  });
  showHobbies.addEventListener('click', function(){
    hobbyList.hidden = false;
    hideHobbies.disabled = false;
    showHobbies.disabled = true;
    updateHobbyStatus();
  });

  var progress = document.getElementById('progress');
  function updateProgress(){
    var h = document.documentElement;
    var scrollableHeight = h.scrollHeight - h.clientHeight;
    progress.style.width = (scrollableHeight > 0 ? h.scrollTop / scrollableHeight * 100 : 0) + '%';
  }
  window.addEventListener('scroll', updateProgress, {passive:true});
  window.addEventListener('resize', updateProgress);
  updateProgress();

  var phrases = ["3rd-year Computer Science student.", "Exploring technology.", "Still learning, still growing."];
  var typedEl = document.getElementById('typed');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var pi = 0, ci = 0, deleting = false;
  function tick(){
    var phrase = phrases[pi];
    if(!deleting){
      ci++;
      typedEl.textContent = phrase.slice(0, ci);
      if(ci === phrase.length){ deleting = true; setTimeout(tick, 1400); return; }
    } else {
      ci--;
      typedEl.textContent = phrase.slice(0, ci);
      if(ci === 0){ deleting = false; pi = (pi+1) % phrases.length; }
    }
    setTimeout(tick, deleting ? 35 : 65);
  }
  if(reduceMotion){ typedEl.textContent = phrases[0]; } else { tick(); }

  var revealElements = document.querySelectorAll('section, .hero-card');
  revealElements.forEach(function(el){ el.classList.add('reveal'); });
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, {threshold:.15});
  revealElements.forEach(function(el){ io.observe(el); });

  document.getElementById('year').textContent = new Date().getFullYear();
})();

(function(){
  "use strict";

  // Keep the activity content together so it is easy to update.
  var projects = [
    {
      category:"Midterm",
      title:"Student Info Site v1",
      description:"Multi-page site built with inline styles — a home announcement page, registration form, grade table, and profile, all linked through a shared navbar.",
      tags:["HTML","CSS","Multi-page"],
      output:"ACT1_midterm/main.html",
      reflection:"This activity taught me the basics of multi-page site structure and consistent navigation. Using inline styles for everything also showed me firsthand why that approach gets messy fast once a site has more than one page."
    },
    {
      category:"Midterm",
      title:"Student Info Site v2",
      description:"The same four-page student portal, refactored to pull its styling from an external stylesheet instead of inline CSS.",
      tags:["HTML","CSS","External Stylesheet"],
      output:"ACT2_midterm/main.html",
      reflection:"Moving the styling into style.css made the difference between inline and external CSS concrete for me — one file change now updates every page, and the HTML reads much cleaner."
    },
    {
      category:"Midterm",
      title:"Personal Profile Page",
      description:"A one-page profile with About, Hobbies, Sports, Daily Routine, and Contact sections, linked by in-page anchor navigation.",
      tags:["HTML","CSS","Anchor Nav"],
      output:"ACT3_midterm/index4.html",
      reflection:"Building this helped me understand semantic sectioning and how anchor links and smooth-scroll navigation work together to organize a long single page into something easy to jump around in."
    },
    {
      category:"Midterm",
      title:"Student Portal Redesign",
      description:"A redesigned student portal homepage with a two-column welcome and announcements layout, plus matching registration, grades, and profile pages.",
      tags:["HTML","CSS","Layout"],
      output:"ACT4_midterm/index5.html",
      reflection:"This was my first real redesign pass — comparing it to my earlier version made me more conscious of visual hierarchy, whitespace, and writing content that actually reads well, not just fills space."
    },
    {
      category:"Finals",
      title:"Interactive Student Dashboard",
      description:"A jQuery-driven profile dashboard — change the heading, show or hide the profile and table, pick a course, and recolor table rows, all without reloading.",
      tags:["HTML","CSS","jQuery","DOM"],
      output:"finals-act3/act.html",
      reflection:"This activity was my introduction to jQuery for DOM manipulation. Wiring buttons to show/hide elements and change content live made JavaScript feel a lot more tangible than reading about it."
    },
    {
      category:"Finals",
      title:"Interactive Frog Profile",
      description:"A playful profile page with a nickname field, year-level selector, and buttons wired to click, double-click, and press-and-hold events.",
      tags:["HTML","CSS","JS","Events"],
      output:"finals-interactive-profile/index%20(2).html",
      reflection:"I learned the difference between click, dblclick, and mousedown/mouseup event handling here, and how to combine them to build a slightly more playful, interactive UI."
    },
    {
      category:"Finals",
      title:"Student Form & Dark Mode",
      description:"A student registration form that appends new entries to a live table, with a dark-mode toggle that restyles the whole page.",
      tags:["HTML","CSS","JS","DOM"],
      output:"finals-javascript-loading-demo/index.html",
      reflection:"This taught me how to capture form input with JavaScript and insert new rows into a table dynamically, plus how a simple class toggle on the body can drive a full light/dark theme switch."
    },
    {
      category:"Ajax",
      title:"AJAX User Loader",
      description:"A jQuery AJAX demo that loads user data on button click and reports the request's loading, success, and result states.",
      tags:["HTML","JS","AJAX","jQuery"],
      output:"finals-ajax-user-loader/index%20(1).html",
      reflection:"This was my first hands-on AJAX request — tracking the loading/success/error states made me understand why asynchronous requests need clear UI feedback while data is in transit."
    },
    {
      category:"Ajax",
      title:"Promise Dashboard",
      description:"A JavaScript Promises demo that simulates loading profile, grade, and schedule data asynchronously and reveals each section in sequence.",
      tags:["JS","Promises","Async"],
      output:"finals-promise-dashboard/index.html",
      reflection:"Working with Promises here helped me understand asynchronous sequencing — how to chain .then() calls (or async/await) so data appears in the right order instead of all at once."
    }
  ];

  var filterGroup = document.getElementById('activityFilters');
  var grid = document.getElementById('activityGrid');
  var countLabel = document.getElementById('activityCount');
  var backdrop = document.getElementById('activityModalBackdrop');
  var closeButton = document.getElementById('activityModalClose');
  var outputLink = document.getElementById('activityModalOutput');
  var lastFocusedCard = null;

  function addTag(container, text){
    var tag = document.createElement('span');
    tag.className = 'activity-tag';
    tag.textContent = text;
    container.appendChild(tag);
  }

  function openProject(project, card){
    lastFocusedCard = card;
    document.getElementById('activityModalCategory').textContent = project.category;
    document.getElementById('activityModalTitle').textContent = project.title;
    document.getElementById('activityModalDescription').textContent = project.description;
    document.getElementById('activityModalReflection').textContent = project.reflection;
    outputLink.href = project.output;
    var tags = document.getElementById('activityModalTags');
    tags.replaceChildren();
    project.tags.forEach(function(tag){ addTag(tags, tag); });
    backdrop.hidden = false;
    document.body.classList.add('modal-open');
    closeButton.focus();
  }

  projects.forEach(function(project, index){
    var card = document.createElement('article');
    card.className = 'activity-card';
    card.dataset.category = project.category;
    var cardOpen = document.createElement('button');
    cardOpen.className = 'activity-card-open';
    cardOpen.type = 'button';
    cardOpen.setAttribute('aria-label', 'View details for ' + project.title);

    var top = document.createElement('span');
    top.className = 'activity-card-topline';
    var category = document.createElement('span');
    category.className = 'activity-category';
    category.textContent = project.category;
    var number = document.createElement('span');
    number.className = 'activity-index';
    number.textContent = String(index + 1).padStart(2, '0');
    top.append(category, number);

    var title = document.createElement('h3');
    title.textContent = project.title;
    var description = document.createElement('span');
    description.className = 'activity-description';
    description.textContent = project.description;
    var tags = document.createElement('span');
    tags.className = 'activity-tags';
    tags.setAttribute('aria-label', 'Technologies: ' + project.tags.join(', '));
    project.tags.forEach(function(tag){ addTag(tags, tag); });

    cardOpen.append(top, title, description, tags);
    var outputLink = document.createElement('a');
    outputLink.className = 'activity-output-link';
    outputLink.href = project.output;
    outputLink.target = '_blank';
    outputLink.rel = 'noopener';
    outputLink.setAttribute('aria-label', 'Open ' + project.title + ' activity output in a new tab');
    outputLink.append('Open activity output ');
    var arrow = document.createElement('span');
    arrow.textContent = '↗';
    arrow.setAttribute('aria-hidden', 'true');
    outputLink.appendChild(arrow);
    card.append(cardOpen, outputLink);
    cardOpen.addEventListener('click', function(){ openProject(project, cardOpen); });
    grid.appendChild(card);
  });

  var canTiltCards = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(canTiltCards){
    Array.prototype.forEach.call(document.querySelectorAll('.hero-card, .activity-card'), function(card){
      card.addEventListener('pointermove', function(event){
        if(event.pointerType !== 'mouse') return;
        var bounds = card.getBoundingClientRect();
        var x = (event.clientX - bounds.left) / bounds.width;
        var y = (event.clientY - bounds.top) / bounds.height;
        card.style.setProperty('--pointer-x', (x * 100) + '%');
        card.style.setProperty('--pointer-y', (y * 100) + '%');
        card.style.setProperty('--tilt-x', ((.5 - y) * 5) + 'deg');
        card.style.setProperty('--tilt-y', ((x - .5) * 5) + 'deg');
        card.classList.add('is-pointer-active');
      });
      card.addEventListener('pointerleave', function(){
        card.style.removeProperty('--tilt-x');
        card.style.removeProperty('--tilt-y');
        card.classList.remove('is-pointer-active');
      });
    });
  }

  filterGroup.addEventListener('click', function(event){
    var selected = event.target.closest('button[data-filter]');
    if(!selected) return;
    filterGroup.querySelectorAll('.activity-filter').forEach(function(button){
      var active = button === selected;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    var visibleCount = 0;
    grid.querySelectorAll('.activity-card').forEach(function(card){
      var visible = selected.dataset.filter === 'All' || card.dataset.category === selected.dataset.filter;
      card.hidden = !visible;
      if(visible) visibleCount++;
    });
    countLabel.textContent = visibleCount + ' projects';
  });

  function closeProject(){
    if(backdrop.hidden) return;
    backdrop.hidden = true;
    document.body.classList.remove('modal-open');
    if(lastFocusedCard) lastFocusedCard.focus();
  }

  closeButton.addEventListener('click', closeProject);
  backdrop.addEventListener('click', function(event){
    if(event.target === backdrop) closeProject();
  });
  document.addEventListener('keydown', function(event){
    if(backdrop.hidden) return;
    if(event.key === 'Escape'){
      closeProject();
      return;
    }
    if(event.key === 'Tab'){
      var focusable = backdrop.querySelectorAll('button:not([disabled]), a[href]');
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if(event.shiftKey && document.activeElement === first){
        event.preventDefault();
        last.focus();
      }else if(!event.shiftKey && document.activeElement === last){
        event.preventDefault();
        first.focus();
      }
    }
  });
})();
