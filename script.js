
  let excelData = [];
  let headers = [];
  let currentPage = 0;
  let currentImages = [];
  let currentIndex = 0;
  let filteredData = [];


  const selectorsIds = [
    'row1_col1','row1_col2',
    'row2_col1','row2_col2',
    'row3_col1','row3_col2',
    'row4_col1','row4_col2',
    'row5_col1','row5_col2'
  ];

  const debounce = (fn, delay) => {
    let timer = null;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  };

const toggleBtn = document.getElementById('toggleBtn');
const sidebar = document.getElementById('sidebar');

function updateTogglePosition() {
  if (sidebar.classList.contains('hidden')) {
    toggleBtn.style.left = '0px';
  } else if (sidebar.classList.contains('collapsed')) {
    toggleBtn.style.left = '60px';
  } else {
    toggleBtn.style.left = '300px';
  }
}

toggleBtn.addEventListener('click', () => {
  if (sidebar.classList.contains('hidden')) {
    sidebar.classList.remove('hidden');
  } else if (sidebar.classList.contains('collapsed')) {
    sidebar.classList.remove('collapsed');
  } else {
    sidebar.classList.add('collapsed');
  }
  updateTogglePosition();
});

updateTogglePosition(); // Call on page load


  document.getElementById('fileInput').addEventListener('change', handleFile);

  function handleFile(event) {
    

    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
       function handleFile(event) {
                      filteredData = [...excelData];



    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {

      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      headers = json[0];
      excelData = json.slice(1);

      populateSelectors();
      currentPage = 0;
      updatePageInfo();
      renderPage();
      updateNavButtons();
populateFilterOptions();

    };
    reader.readAsArrayBuffer(file);
  }

      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      headers = json[0];
      excelData = json.slice(1);

      populateSelectors();
      currentPage = 0;
      updatePageInfo();
      renderPage();
      updateNavButtons();
populateFilterOptions();

    };
    reader.readAsArrayBuffer(file);
  }

  function populateFilterOptions() {
    const columnSelect = document.getElementById('filterColumn');
    const valueSelect = document.getElementById('filterValue');
  
    columnSelect.innerHTML = '<option value="">-- Select Column --</option>';
    headers.forEach((header, index) => {
      const option = document.createElement('option');
      option.value = index;
      option.textContent = header;
      columnSelect.appendChild(option);
    });
  
    columnSelect.addEventListener('change', () => {
      const colIndex = parseInt(columnSelect.value);
      if (isNaN(colIndex)) return;
  
      const uniqueValues = [...new Set(excelData.map(row => row[colIndex]))];
      valueSelect.innerHTML = '<option value="">-- Select Value --</option>';
      uniqueValues.forEach(val => {
        const option = document.createElement('option');
        option.value = val;
        option.textContent = val;
        valueSelect.appendChild(option);
      });
    });
  
 valueSelect.addEventListener('change', () => {
  const colIndex = parseInt(columnSelect.value);
  const selectedValue = valueSelect.value;
if (!isNaN(colIndex) && selectedValue !== '') {
  filteredData = excelData.filter(row => row[colIndex] == selectedValue);
  selectedFilterInfo = ` — ${headers[colIndex]} = ${selectedValue}`;
} else {
  filteredData = [...excelData];
  selectedFilterInfo = '';
}


  currentPage = 0;
  updatePageInfo();

  if (isScrollView) {
    renderAllRows();
  } else {
    renderPage();
    updateNavButtons();
  }
});


  }
  

  function populateSelectors() {
    selectorsIds.forEach(id => {
      const sel = document.getElementById(id);
      sel.innerHTML = '<option value="">-- No selection --</option>';
      headers.forEach((header, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = header;
        sel.appendChild(option);
      });
      sel.removeEventListener('change', debouncedRender);
      sel.addEventListener('change', debouncedRender);
    });
  }

  const debouncedRender = debounce(() => {
    currentPage = 0;
    updatePageInfo();
    renderPage();
    updateNavButtons();
  }, 250);

  function getSelectedIndex(selectId) {
    const sel = document.getElementById(selectId);
    return sel.value === '' ? null : parseInt(sel.value, 10); 
  }


function renderPage() {
  const mainContainer = document.getElementById('mainContainer');
  mainContainer.innerHTML = '';
  const fragment = document.createDocumentFragment();

  if (!filteredData.length) {
    fragment.appendChild(document.createTextNode('No data loaded'));
    mainContainer.appendChild(fragment);
    return;
  }

  const pagesToRender = isScrollView ? filteredData : [filteredData[currentPage]];

  pagesToRender.forEach((row, pageIndex) => {
    const originalIndex = excelData.indexOf(row);
    const wrapper = document.createElement('div');
    wrapper.className = 'table-block';

    const title = document.createElement('div');
    title.className = 'row-block-title';
title.textContent = `Excel Row #${originalIndex + 2}(${originalIndex + 1} / ${filteredData.length})${selectedFilterInfo}`;
    wrapper.appendChild(title);

    const groups = [
      ['row1_col1', 'row1_col2'],
      ['row2_col1', 'row2_col2'],
      ['row3_col1', 'row3_col2'],
      ['row4_col1', 'row4_col2'],
      ['row5_col1', 'row5_col2']
    ];

    groups.forEach((pair, i) => {
      const [idx1, idx2] = pair.map(getSelectedIndex);
      if (idx1 === null && idx2 === null) return;

      const table = document.createElement('table');
      const thead = document.createElement('thead');
      const trHead = document.createElement('tr');
      const tbody = document.createElement('tbody');
      const trData = document.createElement('tr');

      [idx1, idx2].forEach((idx, j) => {
        const th = document.createElement('th');
        const td = document.createElement('td');

        if (idx !== null) {
          th.textContent = headers[idx];
          let val = row[idx] ?? '';
;
if (i === 3 || i === 4) {
  try {
    let urls = [];

    // Normalize input
    const trimmedVal = typeof val === 'string' ? val.trim() : '';

    // Try parsing JSON array
    if (trimmedVal.startsWith('[') && trimmedVal.endsWith(']')) {
      try {
        const fixedVal = trimmedVal.replace(/'/g, '"');
        urls = JSON.parse(fixedVal);
      } catch (e) {
        console.warn('Failed to parse JSON array:', e);
      }
    } else if (trimmedVal.includes(',')) {
      urls = trimmedVal.split(',').map(url => url.trim());
    } else if (trimmedVal) {
      urls = [trimmedVal];
    }

    // Clean and encode URLs
    urls = urls.map(url => {
      try {
        const u = new URL(url.trim());
        const encodedPath = u.pathname.split('/').map(encodeURIComponent).join('/');
        return `${u.protocol}//${u.host}${encodedPath}${u.search}`;
      } catch (e) {
        console.warn('Invalid URL skipped:', url);
        return null;
      }
    }).filter(Boolean);

    // Convert to HTTPS-safe URLs
    const getSafeImageUrl = (url) => {
      if (url.startsWith('https://')) return url;
      const cleanUrl = url.replace(/^http:\/\//i, '');
      return `https://images.weserv.nl/?url=${encodeURIComponent(cleanUrl)}`;
    };

    td.textContent = ''; // Clear cell

    if (urls.length) {
      if (i === 3) {
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.justifyContent = 'space-between';
        container.style.gap = '10px';

        urls.forEach((url, index) => {
          const img = document.createElement('img');
          img.src = getSafeImageUrl(url);
          
          img.style.width = '350px';
          img.style.height = '350px';
          img.style.objectFit = 'contain';
          img.style.cursor = 'pointer';
          img.alt = `Main Image ${index + 1}`;
          img.onerror = () => {
            img.src = 'https://via.placeholder.com/350?text=Image+Not+Found';
            console.warn('Image failed to load:', url);
          };
          img.addEventListener('click', () => openModal(urls, index));
          container.appendChild(img);
        });

        td.appendChild(container);
      } else {
        const grid = document.createElement('div');
        grid.className = 'image-grid';
        urls.forEach((url, imageIndex) => {
          const img = document.createElement('img');
          img.src = getSafeImageUrl(url);
          img.alt = `Secondary Image ${imageIndex + 1}`;
          img.onerror = () => {
            img.src = 'https://via.placeholder.com/150?text=Image+Not+Found';
            console.warn('Image failed to load:', url);
          };
          img.addEventListener('click', () => openModal(urls, imageIndex));
          grid.appendChild(img);
        });

        td.appendChild(grid);
      }
    } else {
      td.textContent = val;
    }
  } catch (e) {
    console.error('Image parsing error:', e);
    td.textContent = val;
  }
} else if (/<[a-z][\s\S]*>/i.test(val)) {
  td.innerHTML = val;
} else {
  td.textContent = val;
}


        
    } else {
          th.textContent = '';
          td.textContent = '';
        }

        trHead.appendChild(th);
        trData.appendChild(td);
      });

      thead.appendChild(trHead);
      tbody.appendChild(trData);
      table.appendChild(thead);
      table.appendChild(tbody);
      wrapper.appendChild(table);
    });

    fragment.appendChild(wrapper);
  });

  mainContainer.appendChild(fragment);
  highlightWords();
}


function highlightWords() {
  const keywords = {
    kids: /\b(kids?|children|child)\b/gi,
    teens: /\b(teens?|teenagers?)\b/gi,
    adults: /\b(adults?|grown[- ]?ups?)\b/gi,
    female: /\b(girl|girls|woman|women|womens|female|her|she)\b/gi,
    unisex: /\b(unisex|any gender|all genders|gender-neutral)\b/gi,
others: /\b(color|colors|colour|colours|dimensions|dimension|materials|material|size|includes|package|weight|made|Made|Pk|Count|Pack|Piece)\b|(?<=\b\d\s?)(pcs?|ct)\b/gi
  };

  const mainContainer = document.getElementById('mainContainer');
  const elements = mainContainer.querySelectorAll('td');

  const ageToggle = document.getElementById('highlightToggle').checked;
  const genderToggle = document.getElementById('genderHighlightToggle').checked;
    const othersToggle = document.getElementById('othersHighlightToggle').checked;


  elements.forEach(td => {
    if (td.querySelector('img')) return;

    let html = td.innerHTML;

    if (ageToggle) {
      html = html
        .replace(keywords.kids, match => `<span class="highlight-kids">${match}</span>`)
        .replace(keywords.teens, match => `<span class="highlight-teens">${match}</span>`)
        .replace(keywords.adults, match => `<span class="highlight-adults">${match}</span>`);
    }

   if (genderToggle) {
  // Highlight female first
  html = html.replace(keywords.female, match => `<span class="highlight-female">${match}</span>`);
    html = html.replace(keywords.unisex, match => `<span class="highlight-unisex">${match}</span>`);


html = html.replace(/men(’s|'s)?\b/gi, (match, apostrophePart, offset, fullText) => {
  const before = fullText.slice(offset - 2, offset).toLowerCase(); // 2 chars before "men"
  if (before === "wo") {
    // don't highlight if preceded by "wo" (part of women)
    return match;
  }

  const after = fullText.slice(offset + match.length, offset + match.length + 1);
  if (apostrophePart || !after || /\W/.test(after)) {
    // highlight if followed by apostrophe part or non-word boundary (standalone men)
    return `<span class="highlight-male">${match}</span>`;
  }
  
  return match; // part of bigger word, don't highlight
});

}
 if (othersToggle) {
      html = html
        .replace(keywords.others, match => `<span class="highlight-others">${match}</span>`)
       
    }

    td.innerHTML = html;
  });
}

  document.getElementById('highlightToggle').addEventListener('change', () => {
    renderPage();
  });
  document.getElementById('genderHighlightToggle').addEventListener('change', () => {
  renderPage();
});



   // Modal functions
  const modal = document.getElementById('modal');
  const modalImage = document.getElementById('modalImage');
  const modalClose = document.getElementById('modalClose');
  const modalNavPrev = document.getElementById('modalNavPrev');
  const modalNavNext = document.getElementById('modalNavNext');

  function openModal(images, index) {
    currentImages = images;
    currentIndex = index;
    modalImage.src = currentImages[currentIndex];
    modal.style.display = 'flex';
    modal.focus();
  }
  function closeModal() {
    modal.style.display = 'none';
    modalImage.src = '';
    currentImages = [];
    currentIndex = 0;
  }
  function navigate(direction) {
    if (!currentImages.length) return;
    currentIndex = (currentIndex + direction + currentImages.length) % currentImages.length;
    modalImage.src = currentImages[currentIndex];
  }

  modalClose.onclick = closeModal;
  modalNavPrev.onclick = () => navigate(-1);
  modalNavNext.onclick = () => navigate(1);

  // Close modal on click outside image or press Esc
  modal.onclick = e => {
    if (e.target === modal || e.target === modalContent) closeModal();
  };
  window.addEventListener('keydown', e => {
    if (modal.style.display === 'flex') {
      if (e.key === 'Escape') closeModal();
      else if (e.key === 'ArrowLeft') navigate(-1);
      else if (e.key === 'ArrowRight') navigate(1);
    }
  });

  // Navigation buttons & pagination
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const pageInfo = document.getElementById('pageInfo');

  prevBtn.onclick = () => {
    if (currentPage > 0) {
      currentPage--;
      smoothScrollToTop();
      updatePageInfo();
      renderPage();
      updateNavButtons();
    }
  };
  nextBtn.onclick = () => {
    if (currentPage < excelData.length - 1) {
      currentPage++;
      smoothScrollToTop();
      updatePageInfo();
      renderPage();
      updateNavButtons();
    }
  };

  function updatePageInfo() {
    if (!excelData.length) {
      pageInfo.textContent = 'No data loaded';
      prevBtn.disabled = true;
      nextBtn.disabled = true;
      return;
    }
    pageInfo.textContent = `Page ${currentPage + 1} of ${filteredData.length}`;  }

  function updateNavButtons() {
    prevBtn.disabled = currentPage <= 0;
    nextBtn.disabled = currentPage >= excelData.length - 1;
  }

  function smoothScrollToTop() {
    const content = document.getElementById('content');
    content.scrollTo({ top: 0, behavior: 'smooth' });
  }


  function bindImageClickEvents() {
  const allImages = document.querySelectorAll('.image-grid img, td img');
  allImages.forEach((img, i) => {
    const container = img.closest('.image-grid');
    if (container) {
      const urls = Array.from(container.querySelectorAll('img')).map(el => el.src);
      const index = urls.indexOf(img.src);
      img.addEventListener('click', () => openModal(urls, index));
    } else {
      // For main images
      const urls = Array.from(img.parentElement.querySelectorAll('img')).map(el => el.src);
      const index = urls.indexOf(img.src);
      img.addEventListener('click', () => openModal(urls, index));
    }
  });
}

const jumpInput = document.getElementById('jumpInput');
const jumpBtn = document.getElementById('jumpBtn');

jumpBtn.addEventListener('click', () => {
  let jumpRow = parseInt(jumpInput.value, 10);
  if (isNaN(jumpRow)) return;

  // Excel data rows start at index 0, but UI shows from Row 2 (headers + 1)
  // So jumpRow - 2 maps to excelData index
  const targetIndex = jumpRow - 2;

  if (targetIndex >= 0 && targetIndex < excelData.length) {
    currentPage = targetIndex;
    updatePageInfo();
    renderPage();
    updateNavButtons();
    smoothScrollToTop();
  } else {
    alert(`Row number must be between 2 and ${excelData.length + 1}`);
  }
});


let isScrollView = false;

const toggleViewBtn = document.getElementById('toggleViewBtn');

toggleViewBtn.addEventListener('click', () => {
  isScrollView = !isScrollView;

  const content = document.getElementById('content');
  const mainContainer = document.getElementById('mainContainer');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const pageInfo = document.getElementById('pageInfo');

  if (isScrollView) {
    // Switch to scroll view
    mainContainer.style.display = 'none';
    content.style.display = 'block';

    renderAllRows(); // Make sure this function is defined and working

    prevBtn.style.display = 'none';
    nextBtn.style.display = 'none';
    pageInfo.style.display = 'none';
    toggleViewBtn.textContent = 'Switch to Paginated View';
  } else {
    // Switch to paginated view
    content.style.display = 'none';
    mainContainer.style.display = 'block';

    currentPage = 0;
    renderPage(); // Make sure this function is defined and working
    updatePageInfo();
    updateNavButtons();

    prevBtn.style.display = '';
    nextBtn.style.display = '';
    pageInfo.style.display = '';
    toggleViewBtn.textContent = 'Switch to Scroll View';
  }
});



function renderAllRows() {
  const content = document.getElementById('content');
  content.innerHTML = ''; // Clear existing content

  const fragment = document.createDocumentFragment();

  filteredData.forEach((row, pageIndex) => {
    const originalIndex = excelData.indexOf(row);
    const wrapper = document.createElement('div');
    wrapper.className = 'table-block';

    const title = document.createElement('div');
    title.className = 'row-block-title';
title.textContent = `Excel Row #${originalIndex + 2} (${pageIndex + 1} / ${filteredData.length})${selectedFilterInfo}`;
    wrapper.appendChild(title);

    const groups = [
      ['row1_col1', 'row1_col2'],
      ['row2_col1', 'row2_col2'],
      ['row3_col1', 'row3_col2'],
      ['row4_col1', 'row4_col2'],
      ['row5_col1', 'row5_col2']
    ];

    groups.forEach((pair, i) => {
      const [idx1, idx2] = pair.map(getSelectedIndex);
      if (idx1 === null && idx2 === null) return;

      const table = document.createElement('table');
      const thead = document.createElement('thead');
      const trHead = document.createElement('tr');
      const tbody = document.createElement('tbody');
      const trData = document.createElement('tr');

      [idx1, idx2].forEach((idx) => {
        const th = document.createElement('th');
        const td = document.createElement('td');

        if (idx !== null) {
          th.textContent = headers[idx];
          let val = row[idx] ?? '';

          if (i === 3 || i === 4) {
            try {
              let urls = [];
              const trimmedVal = typeof val === 'string' ? val.trim() : '';

              if (trimmedVal.startsWith('[') && trimmedVal.endsWith(']')) {
                try {
                  const fixedVal = trimmedVal.replace(/'/g, '"');
                  urls = JSON.parse(fixedVal);
                } catch (e) {
                  console.warn('Failed to parse JSON array:', e);
                }
              } else if (trimmedVal.includes(',')) {
                urls = trimmedVal.split(',').map(url => url.trim());
              } else if (trimmedVal) {
                urls = [trimmedVal];
              }

              urls = urls.map(url => {
                try {
                  const u = new URL(url.trim());
                  const encodedPath = u.pathname.split('/').map(encodeURIComponent).join('/');
                  return `${u.protocol}//${u.host}${encodedPath}${u.search}`;
                } catch (e) {
                  console.warn('Invalid URL skipped:', url);
                  return null;
                }
              }).filter(Boolean);

              const getSafeImageUrl = (url) => {
                if (url.startsWith('https://')) return url;
                const cleanUrl = url.replace(/^http:\/\//i, '');
                return `https://images.weserv.nl/?url=${encodeURIComponent(cleanUrl)}`;
              };

              if (urls.length) {
                if (i === 3) {
                  const container = document.createElement('div');
                  container.style.display = 'flex';
                  container.style.justifyContent = 'space-between';
                  container.style.gap = '10px';

                  urls.forEach((url, index) => {
                    const img = document.createElement('img');
                    img.src = getSafeImageUrl(url);
                    img.style.width = '350px';
                    img.style.height = '350px';
                    img.style.objectFit = 'contain';
                    img.style.cursor = 'pointer';
                    img.alt = `Main Image ${index + 1}`;
                    img.onerror = () => {
                      img.src = 'https://via.placeholder.com/350?text=Image+Not+Found';
                    };
                    img.addEventListener('click', () => openModal(urls, index));
                    container.appendChild(img);
                  });

                  td.appendChild(container);
                } else {
                  const grid = document.createElement('div');
                  grid.className = 'image-grid';

                  urls.forEach((url, imageIndex) => {
                    const img = document.createElement('img');
                    img.src = getSafeImageUrl(url);
                    img.alt = `Secondary Image ${imageIndex + 1}`;
                    img.onerror = () => {
                      img.src = 'https://via.placeholder.com/150?text=Image+Not+Found';
                    };
                    img.addEventListener('click', () => openModal(urls, imageIndex));
                    grid.appendChild(img);
                  });

                  td.appendChild(grid);
                }
              } else {
                td.textContent = val;
              }
            } catch (e) {
              console.error('Image parsing error:', e);
              td.textContent = val;
            }
          } else if (/<[a-z][\s\S]*>/i.test(val)) {
            td.innerHTML = val;
          } else {
            td.textContent = val;
          }

        } else {
          th.textContent = '';
          td.textContent = '';
        }

        trHead.appendChild(th);
        trData.appendChild(td);
      });

      thead.appendChild(trHead);
      tbody.appendChild(trData);
      table.appendChild(thead);
      table.appendChild(tbody);
      wrapper.appendChild(table);
    });

    fragment.appendChild(wrapper);
  });

  content.appendChild(fragment);
  bindImageClickEvents();
  highlightWords();
}


document.getElementById('scrollToggleBtn').addEventListener('click', () => {
  isScrollView = !isScrollView;
  document.getElementById('scrollToggleBtn').textContent = isScrollView 
    ? 'Switch to Paginated View' 
    : 'Switch to Scroll View';
  renderPage(); // Re-render based on new mode
});
function highlightWords() {
  const keywords = {
    kids: /\b(kids?|children|child)\b/gi,
    teens: /\b(teens?|teenagers?)\b/gi,
    adults: /\b(adults?|grown[- ]?ups?)\b/gi,
    female: /\b(girl|girls|woman|women|womens|female|her|she)\b/gi,
    unisex: /\b(unisex|any gender|all genders|gender-neutral)\b/gi,
others: /\b(color|colors|colour|colours|dimensions|dimension|materials|material|size|includes|package|weight|made|Made|Pk|Count|Pack|Piece)\b|(?<=\b\d\s?)(pcs?|ct)\b/gi
  };

  const container = isScrollView
  ? document.getElementById('content')
  : document.getElementById('mainContainer');
const elements = container.querySelectorAll('td');


  const ageToggle = document.getElementById('highlightToggle').checked;
  const genderToggle = document.getElementById('genderHighlightToggle').checked;
    const othersToggle = document.getElementById('othersHighlightToggle').checked;


  elements.forEach(td => {
    if (td.querySelector('img')) return;

    let html = td.innerHTML;

    if (ageToggle) {
      html = html
        .replace(keywords.kids, match => `<span class="highlight-kids">${match}</span>`)
        .replace(keywords.teens, match => `<span class="highlight-teens">${match}</span>`)
        .replace(keywords.adults, match => `<span class="highlight-adults">${match}</span>`);
    }

   if (genderToggle) {
  // Highlight female first
  html = html.replace(keywords.female, match => `<span class="highlight-female">${match}</span>`);
    html = html.replace(keywords.unisex, match => `<span class="highlight-unisex">${match}</span>`);


html = html.replace(/men(’s|'s)?\b/gi, (match, apostrophePart, offset, fullText) => {
  const before = fullText.slice(offset - 2, offset).toLowerCase(); // 2 chars before "men"
  if (before === "wo") {
    // don't highlight if preceded by "wo" (part of women)
    return match;
  }

  const after = fullText.slice(offset + match.length, offset + match.length + 1);
  if (apostrophePart || !after || /\W/.test(after)) {
    // highlight if followed by apostrophe part or non-word boundary (standalone men)
    return `<span class="highlight-male">${match}</span>`;
  }
  
  return match; // part of bigger word, don't highlight
});

}
 if (othersToggle) {
      html = html
        .replace(keywords.others, match => `<span class="highlight-others">${match}</span>`)
       
    }

    td.innerHTML = html;
  });
}



document.getElementById('highlightToggle').addEventListener('change', highlightWords);
document.getElementById('genderHighlightToggle').addEventListener('change', highlightWords);
document.getElementById('othersHighlightToggle').addEventListener('change', highlightWords);

