let excelData = [];
let headers = [];
let currentPage = 0;
let currentImages = [];
let currentIndex = 0;
let filteredData = [];
let selectedFilterInfo = '';
let isScrollView = false; // Add this if missing

const addSpinnerCSS = () => {
  if (!document.getElementById('spinner-css')) {
    const style = document.createElement('style');
    style.id = 'spinner-css';
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      .spinner { width: 30px; height: 30px; border: 3px solid #f3f3f3; border-top: 3px solid #3498db; border-radius: 50%; animation: spin 1s linear infinite; margin: auto; }
    `;
    document.head.appendChild(style);
  }
};
addSpinnerCSS(); 

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

// Sidebar toggle logic
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

updateTogglePosition();

document.getElementById('fileInput').addEventListener('change', handleFile);

function handleFile(event) {
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
    
    console.log("File loaded. Headers:", headers);
    console.log("Excel data:", excelData);

    populateSelectors();
    populateFilterOptions();
    
    // ✅ KEY FIX: Apply data processing after everything is set up
    applyDataProcessing();
  };
  reader.readAsArrayBuffer(file);
}

// ✅ FIXED: Centralized data processing function
function applyDataProcessing() {
  // Start with all data
  let processedData = [...excelData];
  
  // Apply filter if selected (this is the main filtering)
  const columnSelect = document.getElementById('filterColumn');
  const valueSelect = document.getElementById('filterValue');
  const colIndex = parseInt(columnSelect.value);
  const selectedValue = valueSelect.value;
  
  if (!isNaN(colIndex) && selectedValue !== '') {
    processedData = processedData.filter(row => row[colIndex] == selectedValue);
    selectedFilterInfo = ` — ${headers[colIndex]} = ${selectedValue}`;
  } else {
    selectedFilterInfo = '';
  }
  
  // ✅ Don't filter by row selections - just store the filtered data
  // Row selections are for display/grouping purposes, not data filtering
  filteredData = processedData;
  
  // Reset pagination and render
  currentPage = 0;
  updatePageInfo();
  
  if (isScrollView) {
    renderAllRows();
  } else {
    renderPage();
    updateNavButtons();
  }
}

// ✅ Helper functions for row selection tracking (don't filter data)
function getSelectedRowsInfo() {
  const selectedRows = [];
  
  // Group selectors by rows (row1, row2, etc.)
  for (let i = 1; i <= 5; i++) {
    const col1Index = getSelectedIndex(`row${i}_col1`);
    const col2Index = getSelectedIndex(`row${i}_col2`);
    
    // If at least one column is selected for this row
    if (col1Index !== null || col2Index !== null) {
      selectedRows.push({
        rowNumber: i,
        col1: col1Index !== null ? headers[col1Index] : null,
        col2: col2Index !== null ? headers[col2Index] : null,
        col1Index: col1Index,
        col2Index: col2Index
      });
    }
  }
  
  return selectedRows;
}

// ✅ Get the actual values for selected columns from current filtered data
function getSelectedRowValues(rowIndex) {
  const selectedInfo = getSelectedRowsInfo();
  const result = {};
  
  selectedInfo.forEach(selection => {
    if (selection.col1Index !== null) {
      result[`row${selection.rowNumber}_col1`] = filteredData[rowIndex]?.[selection.col1Index];
    }
    if (selection.col2Index !== null) {
      result[`row${selection.rowNumber}_col2`] = filteredData[rowIndex]?.[selection.col2Index];
    }
  });
  
  return result;
}

function populateFilterOptions() {
  const columnSelect = document.getElementById('filterColumn');
  const valueSelect = document.getElementById('filterValue');

  columnSelect.innerHTML = '<option value="">-- Select Column (Optional) --</option>';
  headers.forEach((header, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = header;
    columnSelect.appendChild(option);
  });

  columnSelect.addEventListener('change', () => {
    const colIndex = parseInt(columnSelect.value);
    
    if (!isNaN(colIndex)) {
      // ✅ Just populate the existing select with search functionality
      populateValueSelectWithSearch(colIndex);
    } else {
      // Reset value select
      valueSelect.innerHTML = '<option value="">-- Select Column First --</option>';
    }
    
    applyDataProcessing();
  });

  // ✅ Keep original value select change listener
  valueSelect.addEventListener('change', () => {
    applyDataProcessing();
  });
}

// ✅ NEW: Add search functionality to existing value select
function populateValueSelectWithSearch(colIndex) {
  const valueSelect = document.getElementById('filterValue');
  const uniqueValues = [...new Set(excelData.map(row => row[colIndex]))].filter(val => val !== undefined && val !== '');
  
  // Sort values
  const sortedValues = uniqueValues.sort((a, b) => {
    const numA = parseFloat(a);
    const numB = parseFloat(b);
    if (!isNaN(numA) && !isNaN(numB)) {
      return numA - numB;
    }
    return a.toString().localeCompare(b.toString());
  });

  // Populate select with all values
  valueSelect.innerHTML = '<option value="">-- Select Value (Optional) --</option>';
  sortedValues.forEach(val => {
    const option = document.createElement('option');
    option.value = val;
    option.textContent = val;
    valueSelect.appendChild(option);
  });

  // ✅ Add search input right above the select (without replacing anything)
  let searchInput = document.getElementById('valueSearchInput');
  
  if (!searchInput) {
    searchInput = document.createElement('input');
    searchInput.id = 'valueSearchInput';
    searchInput.type = 'text';
    searchInput.placeholder = '🔍 Type to search values...';
    searchInput.style.cssText = 'width: 100%; padding: 6px; margin-bottom: 3px; border: 1px solid #ccc; border-radius: 4px; font-size: 12px;';
    
    // Insert search input before the value select
    valueSelect.parentNode.insertBefore(searchInput, valueSelect);
  }
  
  // Clear search when column changes
  searchInput.value = '';
  
  // ✅ Add search functionality that filters the select options
  searchInput.oninput = debounce(() => {
    const searchTerm = searchInput.value.toLowerCase();
    
    // Clear current options
    valueSelect.innerHTML = '<option value="">-- Select Value (Optional) --</option>';
    
    // Filter and add matching options
    const filteredValues = searchTerm === '' ? sortedValues : 
      sortedValues.filter(val => val.toString().toLowerCase().includes(searchTerm));
    
    filteredValues.forEach(val => {
      const option = document.createElement('option');
      option.value = val;
      option.textContent = val;
      valueSelect.appendChild(option);
    });
    
    // Update count
    const countText = filteredValues.length > 0 ? ` (${filteredValues.length} found)` : ' (no matches)';
    valueSelect.firstElementChild.textContent = `-- Select Value (Optional) --${countText}`;
    
  }, 200);
}

// ✅ FIXED: Back to original applyDataProcessing
function applyDataProcessing() {
  let processedData = [...excelData];
  
  const columnSelect = document.getElementById('filterColumn');
  const valueSelect = document.getElementById('filterValue');
  const colIndex = parseInt(columnSelect.value);
  const selectedValue = valueSelect.value;
  
  if (!isNaN(colIndex) && selectedValue !== '') {
    processedData = processedData.filter(row => row[colIndex] == selectedValue);
    selectedFilterInfo = ` — ${headers[colIndex]} = ${selectedValue}`;
  } else {
    selectedFilterInfo = '';
  }
  
  filteredData = processedData;
  
  currentPage = 0;
  updatePageInfo();
  
  if (isScrollView) {
    renderAllRows();
  } else {
    renderPage();
    updateNavButtons();
  }
}



// ✅ FIXED: Reset value select without breaking layout
function resetValueSelect() {
  const valueSelect = document.getElementById('filterValue');
  const searchInput = document.getElementById('valueSearch');
  
  // Remove search input if it exists
  if (searchInput) {
    searchInput.remove();
  }
  
  // Reset select options
  valueSelect.innerHTML = '<option value="">-- Select Column First --</option>';
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

// ✅ Updated debounced render to use centralized processing
const debouncedRender = debounce(() => {
  applyDataProcessing();
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
title.textContent = `Excel Row #${originalIndex + 2}(${currentIndex + 1} / ${filteredData.length})${selectedFilterInfo}`;
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
  try {
    // If already HTTPS, return as-is
    if (url.startsWith('https://')) return url;
    
    // For HTTP URLs, convert to HTTPS directly first
    if (url.startsWith('http://')) {
      const httpsUrl = url.replace(/^http:\/\//i, 'https://');
      return httpsUrl;
    }
    
    // If no protocol, assume HTTPS
    if (!url.startsWith('http')) {
      return `https://${url}`;
    }
    
    return url;
  } catch (e) {
    console.warn('URL processing failed:', url, e);
    return url;
  }
};const getSafeImageUrlWithProxy = (url) => {
  try {
    // If already HTTPS, return as-is
    if (url.startsWith('https://')) return url;
    
    // For HTTP URLs, try direct HTTPS first
    if (url.startsWith('http://')) {
      return url.replace(/^http:\/\//i, 'https://');
    }
    
    // If no protocol, assume HTTPS
    return url.startsWith('http') ? url : `https://${url}`;
    
  } catch (e) {
    // Fallback to proxy only if needed
    console.warn('Direct HTTPS failed, using proxy:', url);
    const cleanUrl = url.replace(/^https?:\/\//i, '');
    return `https://images.weserv.nl/?url=${encodeURIComponent(cleanUrl)}`;
  }
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
  if (currentPage < filteredData.length - 1) {
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
  pageInfo.textContent = `Page ${currentPage + 1} of ${filteredData.length}`;
}

function updateNavButtons() {
  prevBtn.disabled = currentPage <= 0;
  nextBtn.disabled = currentPage >= filteredData.length - 1;
}

function smoothScrollToTop() {
  // Try multiple possible containers
  const mainContainer = document.getElementById('mainContainer');
  const content = document.getElementById('content');
  const body = document.body;
  const html = document.documentElement;
  
  // Scroll main container if it exists and is visible
  if (mainContainer && mainContainer.style.display !== 'none') {
    mainContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  
  // Also scroll the page to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
  
  // Scroll content container if it exists and is visible
  if (content && content.style.display !== 'none') {
    content.scrollTo({ top: 0, behavior: 'smooth' });
  }
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



// ✅ FIXED: Working switch button functionality
const toggleViewBtn = document.getElementById('toggleViewBtn');

if (toggleViewBtn) {
  toggleViewBtn.addEventListener('click', () => {
    isScrollView = !isScrollView;

    const content = document.getElementById('content');
    const mainContainer = document.getElementById('mainContainer');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const pageInfo = document.getElementById('pageInfo');

    if (isScrollView) {
      // Switch to scroll view
      content.style.display = 'block';
      mainContainer.style.display = 'none';
      
      renderAllRows(); 
      prevBtn.style.display = 'none';
      nextBtn.style.display = 'none';
      pageInfo.style.display = 'none';
      toggleViewBtn.textContent = 'Switch to Paginated View';
    } else {
      // Switch to paginated view - THIS IS THE KEY FIX
      mainContainer.style.display = 'block';
      content.style.display = 'none';

      // Reset to first page and render
      currentPage = 0;
      renderPage();  // This was missing or not being called properly
      updatePageInfo();
      updateNavButtons();

      prevBtn.style.display = '';
      nextBtn.style.display = '';
      pageInfo.style.display = '';
      toggleViewBtn.textContent = 'Switch to Scroll View';
    }
  });
}

// Alternative if your button has a different ID:
const scrollToggleBtn = document.getElementById('scrollToggleBtn');

if (scrollToggleBtn) {
  scrollToggleBtn.addEventListener('click', () => {
    isScrollView = !isScrollView;
    
    const content = document.getElementById('content');
    const mainContainer = document.getElementById('mainContainer');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const pageInfo = document.getElementById('pageInfo');

    if (isScrollView) {
      // Switch to scroll view
      content.style.display = 'block';
      mainContainer.style.display = 'none';
      
      renderAllRows(); 
      prevBtn.style.display = 'none';
      nextBtn.style.display = 'none';
      pageInfo.style.display = 'none';
      scrollToggleBtn.textContent = 'Switch to Paginated View';
    } else {
      // Switch to paginated view - KEY FIX
      mainContainer.style.display = 'block';
      content.style.display = 'none';

      currentPage = 0;
      renderPage();  // Essential - this renders the content
      updatePageInfo();
      updateNavButtons();

      prevBtn.style.display = '';
      nextBtn.style.display = '';
      pageInfo.style.display = '';
      scrollToggleBtn.textContent = 'Switch to Scroll View';
    }
  });
}


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
title.textContent = `Excel Row #${originalIndex + 2} (${currentIndex + 1} / ${filteredData.length})${selectedFilterInfo}`;
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
