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



// Add the V loading indicator CSS and HTML
const addVLoadingIndicator = () => {
  // Add CSS styles if not already added
  if (!document.getElementById('v-loading-css')) {
    const style = document.createElement('style');
    style.id = 'v-loading-css';
    style.textContent = `
      .v-loading-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        font-family: 'Arial', sans-serif;
      }

      .v-loading-overlay::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        opacity: 0.8;
      }

      .v-loading-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border-radius: 24px;
        padding: 40px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.3);
        position: relative;
        overflow: hidden;
        z-index: 1;
      }

      .v-loading-container::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
      }

      .v-loading-container::after {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(circle, rgba(255, 255, 255, 0.03) 0%, transparent 70%);
        animation: glass-shimmer 3s ease-in-out infinite;
      }

      .v-loader {
        position: relative;
        width: 120px;
        height: 120px;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .v-letter {
        font-size: 48px;
        font-weight: bold;
        color: rgba(255, 255, 255, 0.9);
        z-index: 2;
        position: relative;
        animation: v-pulse 2s ease-in-out infinite;
        text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
      }

      .v-spinner {
        position: absolute;
        width: 100%;
        height: 100%;
        border: 3px solid rgba(255, 255, 255, 0.1);
        border-top: 3px solid rgba(255, 255, 255, 0.6);
        border-radius: 50%;
        animation: v-spin 1s linear infinite;
      }

      .v-outer-ring {
        position: absolute;
        width: 140px;
        height: 140px;
        border: 2px solid transparent;
        border-top: 2px solid rgba(255, 255, 255, 0.4);
        border-right: 2px solid rgba(255, 255, 255, 0.4);
        border-radius: 50%;
        animation: v-spin-reverse 2s linear infinite;
        top: -10px;
        left: -10px;
      }

      .v-dots {
        position: absolute;
        width: 100%;
        height: 100%;
      }

      .v-dot {
        position: absolute;
        width: 8px;
        height: 8px;
        background: rgba(255, 255, 255, 0.7);
        border-radius: 50%;
        animation: v-dot-rotate 2s linear infinite;
        box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
      }

      .v-dot:nth-child(1) { transform: rotate(0deg) translateX(60px); animation-delay: 0s; }
      .v-dot:nth-child(2) { transform: rotate(120deg) translateX(60px); animation-delay: -0.67s; }
      .v-dot:nth-child(3) { transform: rotate(240deg) translateX(60px); animation-delay: -1.33s; }

      .v-loading-text {
        color: rgba(255, 255, 255, 0.8);
        font-size: 16px;
        font-weight: 500;
        animation: v-fade 2s ease-in-out infinite;
        text-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
        z-index: 1;
      }

      .v-glow {
        position: absolute;
        width: 120px;
        height: 120px;
        background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
        border-radius: 50%;
        animation: v-glow-pulse 2s ease-in-out infinite;
      }

      @keyframes v-spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      @keyframes v-spin-reverse {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(-360deg); }
      }

      @keyframes v-pulse {
        0%, 100% { 
          transform: scale(1);
          color: rgba(255, 255, 255, 0.9);
          text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
        }
        50% { 
          transform: scale(1.1);
          color: rgba(255, 255, 255, 1);
          text-shadow: 0 0 30px rgba(255, 255, 255, 0.6);
        }
      }

      @keyframes v-dot-rotate {
        0% { 
          transform: rotate(0deg) translateX(60px) scale(1);
          opacity: 1;
        }
        50% {
          transform: rotate(180deg) translateX(60px) scale(0.8);
          opacity: 0.7;
        }
        100% { 
          transform: rotate(360deg) translateX(60px) scale(1);
          opacity: 1;
        }
      }

      @keyframes v-fade {
        0%, 100% { opacity: 0.6; }
        50% { opacity: 1; }
      }

      @keyframes v-glow-pulse {
        0%, 100% { 
          transform: scale(1);
          opacity: 0.3;
        }
        50% { 
          transform: scale(1.2);
          opacity: 0.6;
        }
      }

      @keyframes glass-shimmer {
        0%, 100% { 
          transform: translateX(-100%) translateY(-100%) rotate(0deg);
        }
        50% { 
          transform: translateX(0%) translateY(0%) rotate(180deg);
        }
      }
    `;
    document.head.appendChild(style);
  }
};

// Show V loading indicator
const showVLoading = () => {

  const funnyQuotes = [
  "Progress: 1% code, 99% hope.",


  "If you found a bug, keep it. It’s yours now.",

  "Ctrl + Alt + Del your expectations",


"Almost there... then the real pain begins.",
"Uploading… hope you love puzzles and unpaid hours.",

"Uploading… pray it doesn’t trigger an escalation email.",

"Uploading… no clue what’s in it, but it’s your problem now"

];

const randomQuote = funnyQuotes[Math.floor(Math.random() * funnyQuotes.length)];

  const existingLoader = document.getElementById('v-loading-overlay');
  if (existingLoader) {
    existingLoader.remove();
  }

  // Create loading overlay
  const overlay = document.createElement('div');
  overlay.id = 'v-loading-overlay';
  overlay.className = 'v-loading-overlay';
  
  overlay.innerHTML = `
    <div class="v-loading-container">
      <div class="v-loader">
        <div class="v-glow"></div>
        <div class="v-outer-ring"></div>
        <div class="v-spinner"></div>
        <div class="v-dots">
          <div class="v-dot"></div>
          <div class="v-dot"></div>
          <div class="v-dot"></div>
        </div>
        <div class="v-letter">V</div>
      </div>
<div class="v-loading-text">${randomQuote}</div>
    </div>
  `;
  
  document.body.appendChild(overlay);
};

// Hide V loading indicator
const hideVLoading = () => {
  const overlay = document.getElementById('v-loading-overlay');
  if (overlay) {
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 0.3s ease-out';
    setTimeout(() => {
      overlay.remove();
    }, 300);
  }
};


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

// Modified handleFile function with V loading indicator
function handleFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  // Add CSS and show loading indicator
  addVLoadingIndicator();
  showVLoading();

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
    
    // Apply data processing after everything is set up
    applyDataProcessing();

    // Hide loading indicator after 5 seconds
    setTimeout(() => {
      hideVLoading();
    }, 9000);
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
    title.textContent = `Excel Row #${originalIndex + 2}(${currentPage + 1} / ${filteredData.length})${selectedFilterInfo}`;
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

          // Helper function to safely render HTML content
          const renderHtmlContent = (content, container) => {
            try {
              // Check if content looks like HTML
              const htmlRegex = /<[^>]*>/;
              if (typeof content === 'string' && htmlRegex.test(content)) {
                // Create a temporary container to parse HTML
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = content;
                
                // Move all child nodes to the target container
                while (tempDiv.firstChild) {
                  container.appendChild(tempDiv.firstChild);
                }
              } else {
                // Regular text content
                container.textContent = content;
              }
            } catch (e) {
              console.error('HTML parsing error:', e);
              // Fallback to text content
              container.textContent = content;
            }
          };

          // Enhanced image URL processing section for your renderPage function
          if (i === 3 || i === 4) {
            try {
              let urls = [];
              const trimmedVal = typeof val === 'string' ? val.trim() : '';
              
              // Store the completely original value before any processing
              const originalValue = val;

              if (trimmedVal.startsWith('[') && trimmedVal.endsWith(']')) {
                try {
                  const fixedVal = trimmedVal.replace(/'/g, '"');
                  // Try parsing as JSON array first
                  urls = JSON.parse(fixedVal);
                } catch (e) {
                  // If JSON parsing fails, try extracting Markdown-style single URL
                  const markdownUrl = trimmedVal.match(/^\[(https?:\/\/[^\]]+)\]$/);
                  if (markdownUrl) {
                    urls = [markdownUrl[1]];
                  } else {
                    console.warn('Failed to parse JSON or Markdown-style URL:', e);
                    // If all parsing fails, treat as single URL
                    urls = [trimmedVal.slice(1, -1)]; // Remove brackets
                  }
                }
              } else if (trimmedVal.includes(',')) {
                // Smart comma detection: only split if commas are likely URL separators
                // Check if the string contains multiple http/https protocols
                const httpCount = (trimmedVal.match(/https?:\/\//g) || []).length;
                
                if (httpCount > 1) {
                  // Multiple URLs detected, split carefully
                  urls = trimmedVal.split(/,\s*(?=https?:\/\/)/).map(url => url.trim());
                } else if (httpCount === 1) {
                  // Single URL that might contain commas as part of its structure
                  urls = [trimmedVal];
                } else {
                  // No HTTP protocols found, split by comma (fallback)
                  urls = trimmedVal.split(',').map(url => url.trim());
                }
              } else if (trimmedVal) {
                urls = [trimmedVal];
              }

              // Create URL objects that preserve the EXACT original URLs
              const urlObjects = urls.map(url => {
                const cleanUrl = typeof url === 'string' ? url.trim() : String(url).trim();
                return {
                  original: cleanUrl,  // This is the exact URL from your file
                  display: cleanUrl    // This is what we'll show to users
                };
              }).filter(urlObj => urlObj.original);

              const getSafeImageUrl = (originalUrl) => {
                // Fast, direct approach - try the most likely working URL first
                if (originalUrl.startsWith('https://')) {
                  return originalUrl;
                }
                
                if (originalUrl.startsWith('http://')) {
                  // For IP addresses and known working HTTP servers, try original first
                  // For others, try HTTPS conversion
                  const isIpAddress = /^http:\/\/\d+\.\d+\.\d+\.\d+/.test(originalUrl);
                  
                  if (isIpAddress) {
                    // IP addresses rarely support HTTPS, so try original HTTP first
                    return originalUrl;
                  } else {
                    // Try HTTPS version for domain names
                    return originalUrl.replace('http://', 'https://');
                  }
                }
                
                // For URLs without protocol, assume HTTP and apply proxy
                if (!originalUrl.startsWith('http')) {
                  return `https://images.weserv.nl/?url=${encodeURIComponent(originalUrl)}`;
                }
                
                return originalUrl;
              };

              // Streamlined error handling with smart fallbacks
              const loadImageWithFallbacks = (img, originalUrl) => {
                let fallbackAttempted = false;
                
                img.onerror = () => {
                  if (!fallbackAttempted) {
                    fallbackAttempted = true;
                    
                    // Smart fallback based on URL type
                    if (originalUrl.startsWith('http://')) {
                      const isIpAddress = /^http:\/\/\d+\.\d+\.\d+\.\d+/.test(originalUrl);
                      
                      if (isIpAddress) {
                        // For IP addresses, try proxy service
                        img.src = `https://images.weserv.nl/?url=${encodeURIComponent(originalUrl.replace('http://', ''))}`;
                      } else {
                        // For domains, try original HTTP
                        img.src = originalUrl;
                      }
                    } else if (originalUrl.startsWith('https://')) {
                      // For HTTPS failures, try proxy
                      img.src = `https://images.weserv.nl/?url=${encodeURIComponent(originalUrl.replace('https://', ''))}`;
                    } else {
                      // Final fallback to placeholder
                      if (i === 3) {
                        img.src = 'https://via.placeholder.com/350x350/cccccc/666666?text=Image+Not+Available';
                      } else {
                        img.src = 'https://via.placeholder.com/150x150/cccccc/666666?text=Not+Available';
                      }
                    }
                  } else {
                    // Second failure, show placeholder
                    if (i === 3) {
                      img.src = 'https://via.placeholder.com/350x350/cccccc/666666?text=Image+Not+Available';
                    } else {
                      img.src = 'https://via.placeholder.com/150x150/cccccc/666666?text=Not+Available';
                    }
                  }
                };
                
                // Set the initial src
                img.src = getSafeImageUrl(originalUrl);
              };

              const createUrlDisplay = (urlObj, isSecondary = false) => {
                const urlDisplay = document.createElement('div');
                urlDisplay.className = 'original-url-display';
                urlDisplay.style.cssText = `
                  margin-top: ${isSecondary ? '3px' : '5px'}; 
                  padding: ${isSecondary ? '4px' : '8px'}; 
                  background: #f8f9fa; 
                  border: 1px solid #dee2e6; 
                  border-radius: ${isSecondary ? '3px' : '4px'}; 
                  font-size: ${isSecondary ? '10px' : '11px'}; 
                  ${isSecondary ? 'max-width: 150px;' : ''} 
                  word-break: break-all;
                `;
                
                const label = document.createElement('div');
                label.textContent = 'Original URL:';
                label.style.cssText = `font-weight: bold; margin-bottom: ${isSecondary ? '2px' : '3px'}; color: #495057;`;
                
                const link = document.createElement('a');
                link.href = urlObj.original;
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
                
                if (isSecondary && urlObj.display.length > 30) {
                  link.textContent = urlObj.display.substring(0, 30) + '...';
                  link.title = urlObj.display; // Show full URL on hover
                } else {
                  link.textContent = urlObj.display;
                }
                
                link.style.cssText = `color: #007bff; text-decoration: underline; ${isSecondary ? 'font-size: 9px;' : ''}`;
                
                // Add protocol indicator for HTTP URLs
                if (urlObj.original.startsWith('http://')) {
                  const httpWarning = document.createElement('div');
                  httpWarning.textContent = '⚠️ HTTP (insecure)';
                  httpWarning.style.cssText = `
                    font-size: ${isSecondary ? '8px' : '9px'}; 
                    color: #dc3545; 
                    margin-top: 2px;
                    font-weight: bold;
                  `;
                  urlDisplay.appendChild(httpWarning);
                }
                
                urlDisplay.appendChild(label);
                urlDisplay.appendChild(link);
                return urlDisplay;
              };

              if (urlObjects.length) {
                if (i === 3) { // Main images
                  const container = document.createElement('div');
                  container.style.display = 'flex';
                  container.style.justifyContent = 'space-between';
                  container.style.gap = '10px';

                  urlObjects.forEach((urlObj, index) => {
                    const imgContainer = document.createElement('div');
                    imgContainer.style.cssText = `
                      position: relative;
                      width: 350px;
                      height: 350px;
                      border: 1px solid #dee2e6;
                      background: #f8f9fa;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                    `;
                    
                    // Create loading indicator
                    const loadingIndicator = document.createElement('div');
                    loadingIndicator.className = 'loading-indicator';
                    loadingIndicator.style.cssText = `
                      position: absolute;
                      top: 50%;
                      left: 50%;
                      transform: translate(-50%, -50%);
                      z-index: 2;
                    `;
                    
                    const spinner = document.createElement('div');
                    spinner.style.cssText = `
                      width: 30px;
                      height: 30px;
                      border: 3px solid #e9ecef;
                      border-top: 3px solid #007bff;
                      border-radius: 50%;
                      animation: spin 1s linear infinite;
                    `;
                    
                    loadingIndicator.appendChild(spinner);
                    
                    const img = document.createElement('img');
                    img.style.cssText = `
                      max-width: 100%;
                      max-height: 100%;
                      object-fit: contain;
                      cursor: pointer;
                      display: none;
                    `;
                    img.alt = `Main Image ${index + 1}`;
                    
                    // Container for the image and URL
                    const imageAndUrlContainer = document.createElement('div');
                    imageAndUrlContainer.style.cssText = 'display: flex; flex-direction: column; align-items: center;';
                    
                    // Always show the original URL immediately
                    const urlDisplay = createUrlDisplay(urlObj, false);
                    
                    img.onload = () => {
                      // Hide loading indicator and show image
                      loadingIndicator.style.display = 'none';
                      img.style.display = 'block';
                    };
                    
                    img.addEventListener('click', () => openModal(urlObjects.map(u => u.original), index));
                    
                    // Fast loading - try most likely working URL first
                    loadImageWithFallbacks(img, urlObj.original);
                    
                    imgContainer.appendChild(loadingIndicator);
                    imgContainer.appendChild(img);
                    
                    imageAndUrlContainer.appendChild(imgContainer);
                    imageAndUrlContainer.appendChild(urlDisplay);
                    container.appendChild(imageAndUrlContainer);
                  });

                  td.appendChild(container);
                  
                } else { // Secondary images (i === 4)
                  const grid = document.createElement('div');
                  grid.className = 'image-grid';

                  urlObjects.forEach((urlObj, imageIndex) => {
                    const imgContainer = document.createElement('div');
                    imgContainer.style.cssText = `
                      display: inline-block; 
                      margin: 5px; 
                      vertical-align: top;
                      position: relative;
                      width: 250px;
                      height: 250px;
                      border: 1px solid #dee2e6;
                      background: #f8f9fa;
                    `;
                    
                    // Create loading indicator for secondary images
                    const loadingIndicator = document.createElement('div');
                    loadingIndicator.className = 'loading-indicator-small';
                    loadingIndicator.style.cssText = `
                      position: absolute;
                      top: 50%;
                      left: 50%;
                      transform: translate(-50%, -50%);
                      z-index: 2;
                    `;
                    
                    const spinner = document.createElement('div');
                    spinner.style.cssText = `
                      width: 20px;
                      height: 20px;
                      border: 2px solid #e9ecef;
                      border-top: 2px solid #007bff;
                      border-radius: 50%;
                      animation: spin 1s linear infinite;
                    `;
                    
                    loadingIndicator.appendChild(spinner);
                    
                    const img = document.createElement('img');
                    img.style.cssText = `
                      max-width: 100%; 
                      max-height: 100%; 
                      object-fit: contain; 
                      cursor: pointer; 
                      display: none;
                      position: absolute;
                      top: 50%;
                      left: 50%;
                      transform: translate(-50%, -50%);
                    `;
                    img.alt = `Secondary Image ${imageIndex + 1}`;
                    
                    // Container for the image and URL
                    const imageAndUrlContainer = document.createElement('div');
                    imageAndUrlContainer.style.cssText = 'display: flex; flex-direction: column; align-items: center;';
                    
                    // Always show the original URL immediately for secondary images too
                    const urlDisplay = createUrlDisplay(urlObj, true);
                    
                    img.onload = () => {
                      // Hide loading indicator and show image
                      loadingIndicator.style.display = 'none';
                      img.style.display = 'block';
                    };
                    
                    img.addEventListener('click', () => openModal(urlObjects.map(u => u.original), imageIndex));
                    
                    // Fast loading - try most likely working URL first
                    loadImageWithFallbacks(img, urlObj.original);
                    
                    imgContainer.appendChild(loadingIndicator);
                    imgContainer.appendChild(img);
                    
                    imageAndUrlContainer.appendChild(imgContainer);
                    imageAndUrlContainer.appendChild(urlDisplay);
                    grid.appendChild(imageAndUrlContainer);
                  });

                  td.appendChild(grid);
                }
              } else {
                // If no URLs found, show the original value as text or HTML
                renderHtmlContent(originalValue, td);
              }
            } catch (e) {
              console.error('Image parsing error:', e);
              // On any error, show the original value exactly as it was (with HTML support)
              renderHtmlContent(val, td);
            }
          } else {
            // For all other columns (non-image columns), render HTML content
            renderHtmlContent(val, td);
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
    male: /\b(male|boy|boys|him|he)\b/gi, // Removed man/men from here
    unisex: /\b(unisex|any gender|all genders|gender-neutral)\b/gi,
    others: /\b(as shown|As Shown|as the picture shows|color|colors|colour|Crewneck|neck|Sleeve|sleeves|sleeveless|Author|Origin|colours|dimensions|dimension|materials|material|size|includes|package|weight|made|Made|Pk|Count|Pack|Pieceshort[- ]?sleeve|short[- ]?sleeved|shortsleeve|long[- ]?sleeve|long[- ]?sleeved|longsleeve|crew[- ]?neck|round[- ]?neck|v[- ]?neck|vneck)\b|(?<=\d\s?)(pcs?|ct)\b/gi
  };


   // Icon mappings
  const icons = {
    
    
    // Other icons
    color: '🎨',
    colors: '🎨',
    colour: '🎨',
    colours: '🎨',
    size: '📏',
    dimensions: '📐',
    dimension: '📐',
    weight: '⚖️',
    material: '🧱',
    materials: '🧱',
    package: '📦',
    made: '🏭',
    count: '🔢',
    pack: '📦',
    piece: '🧩',
    pcs: '🔢',
    pc: '🔢',
    ct: '🔢',
    pk: '📦',
    'as the picture shows': '👁️',
    'as shown': '👁️',
    'As Shown': '👁️',
    includes: '📋',
    author: '✍️',
    origin: '🌍',
        neck: '👔',
    sleeve: '👕',
    sleeves: '👕',
    sleeveless: '🎽',
    'short sleeve': '👕',
    'short-sleeve': '👕',
    'short sleeved': '👕',
    'short-sleeved': '👕',
    'shortsleeve': '👕',
    'long sleeve': '🧥',
    'long-sleeve': '🧥',
    'long sleeved': '🧥',
    'long-sleeved': '🧥',
    'longsleeve': '🧥',
    'crew neck': '⭕',
    'crew-neck': '⭕',
    'round neck': '⭕',
    'round-neck': '⭕',
    'v neck': '🔽',
    'v-neck': '🔽',
    'vneck': '🔽'
  };

  
  function getIconForWord(word) {
    const lowerWord = word.toLowerCase().replace(/[^\w\s-]/g, '');
    return icons[lowerWord] || '';
  }

  function createHighlightSpan(className, text) {
    const icon = getIconForWord(text);
    return `<span class="${className}">${icon}${text}</span>`;
  }

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
        .replace(keywords.kids, match => createHighlightSpan('highlight-kids', match))
        .replace(keywords.teens, match => createHighlightSpan('highlight-teens', match))
        .replace(keywords.adults, match => createHighlightSpan('highlight-adults', match));
    }

    if (genderToggle) {
      // Highlight male keywords (excluding man/men)
      html = html.replace(keywords.male, match => createHighlightSpan('highlight-male', match));

      // Highlight female first
      html = html.replace(keywords.female, match => createHighlightSpan('highlight-female', match));
      html = html.replace(keywords.unisex, match => createHighlightSpan('highlight-unisex', match));

      // Special handling for man/men to avoid conflicts with women
      html = html.replace(/\b(men|man)('s|'s)?\b/gi, (match, word, apostrophePart, offset, fullText) => {
        const before = fullText.slice(offset - 2, offset).toLowerCase();
        if (before === "wo") {
          // Don't highlight if preceded by "wo" (part of women)
          return match;
        }
        
        // Highlight if it's a standalone word
        return createHighlightSpan('highlight-male', match);
      });
    }

    if (othersToggle) {
      html = html.replace(keywords.others, match => createHighlightSpan('highlight-others', match));
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
title.textContent = `Excel Row #${originalIndex + 2}${selectedFilterInfo}`;
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

         // Enhanced image URL processing section for your renderPage function
          if (i === 3 || i === 4) {
            try {
              let urls = [];
              const trimmedVal = typeof val === 'string' ? val.trim() : '';
              
              // Store the completely original value before any processing
              const originalValue = val;

              if (trimmedVal.startsWith('[') && trimmedVal.endsWith(']')) {
                try {
                  const fixedVal = trimmedVal.replace(/'/g, '"');
                  // Try parsing as JSON array first
                  urls = JSON.parse(fixedVal);
                } catch (e) {
                  // If JSON parsing fails, try extracting Markdown-style single URL
                  const markdownUrl = trimmedVal.match(/^\[(https?:\/\/[^\]]+)\]$/);
                  if (markdownUrl) {
                    urls = [markdownUrl[1]];
                  } else {
                    console.warn('Failed to parse JSON or Markdown-style URL:', e);
                    // If all parsing fails, treat as single URL
                    urls = [trimmedVal.slice(1, -1)]; // Remove brackets
                  }
                }
              } else if (trimmedVal.includes(',')) {
                // Smart comma detection: only split if commas are likely URL separators
                // Check if the string contains multiple http/https protocols
                const httpCount = (trimmedVal.match(/https?:\/\//g) || []).length;
                
                if (httpCount > 1) {
                  // Multiple URLs detected, split carefully
                  urls = trimmedVal.split(/,\s*(?=https?:\/\/)/).map(url => url.trim());
                } else if (httpCount === 1) {
                  // Single URL that might contain commas as part of its structure
                  urls = [trimmedVal];
                } else {
                  // No HTTP protocols found, split by comma (fallback)
                  urls = trimmedVal.split(',').map(url => url.trim());
                }
              } else if (trimmedVal) {
                urls = [trimmedVal];
              }

              // Create URL objects that preserve the EXACT original URLs
              const urlObjects = urls.map(url => {
                const cleanUrl = typeof url === 'string' ? url.trim() : String(url).trim();
                return {
                  original: cleanUrl,  // This is the exact URL from your file
                  display: cleanUrl    // This is what we'll show to users
                };
              }).filter(urlObj => urlObj.original);

              const getSafeImageUrl = (originalUrl) => {
                // Fast, direct approach - try the most likely working URL first
                if (originalUrl.startsWith('https://')) {
                  return originalUrl;
                }
                
                if (originalUrl.startsWith('http://')) {
                  // For IP addresses and known working HTTP servers, try original first
                  // For others, try HTTPS conversion
                  const isIpAddress = /^http:\/\/\d+\.\d+\.\d+\.\d+/.test(originalUrl);
                  
                  if (isIpAddress) {
                    // IP addresses rarely support HTTPS, so try original HTTP first
                    return originalUrl;
                  } else {
                    // Try HTTPS version for domain names
                    return originalUrl.replace('http://', 'https://');
                  }
                }
                
                // For URLs without protocol, assume HTTP and apply proxy
                if (!originalUrl.startsWith('http')) {
                  return `https://images.weserv.nl/?url=${encodeURIComponent(originalUrl)}`;
                }
                
                return originalUrl;
              };

              // Streamlined error handling with smart fallbacks
              const loadImageWithFallbacks = (img, originalUrl) => {
                let fallbackAttempted = false;
                
                img.onerror = () => {
                  if (!fallbackAttempted) {
                    fallbackAttempted = true;
                    
                    // Smart fallback based on URL type
                    if (originalUrl.startsWith('http://')) {
                      const isIpAddress = /^http:\/\/\d+\.\d+\.\d+\.\d+/.test(originalUrl);
                      
                      if (isIpAddress) {
                        // For IP addresses, try proxy service
                        img.src = `https://images.weserv.nl/?url=${encodeURIComponent(originalUrl.replace('http://', ''))}`;
                      } else {
                        // For domains, try original HTTP
                        img.src = originalUrl;
                      }
                    } else if (originalUrl.startsWith('https://')) {
                      // For HTTPS failures, try proxy
                      img.src = `https://images.weserv.nl/?url=${encodeURIComponent(originalUrl.replace('https://', ''))}`;
                    } else {
                      // Final fallback to placeholder
                      if (i === 3) {
                        img.src = 'https://via.placeholder.com/350x350/cccccc/666666?text=Image+Not+Available';
                      } else {
                        img.src = 'https://via.placeholder.com/150x150/cccccc/666666?text=Not+Available';
                      }
                    }
                  } else {
                    // Second failure, show placeholder
                    if (i === 3) {
                      img.src = 'https://via.placeholder.com/350x350/cccccc/666666?text=Image+Not+Available';
                    } else {
                      img.src = 'https://via.placeholder.com/150x150/cccccc/666666?text=Not+Available';
                    }
                  }
                };
                
                // Set the initial src
                img.src = getSafeImageUrl(originalUrl);
              };

              const createUrlDisplay = (urlObj, isSecondary = false) => {
                const urlDisplay = document.createElement('div');
                urlDisplay.className = 'original-url-display';
                urlDisplay.style.cssText = `
                  margin-top: ${isSecondary ? '3px' : '5px'}; 
                  padding: ${isSecondary ? '4px' : '8px'}; 
                  background: #f8f9fa; 
                  border: 1px solid #dee2e6; 
                  border-radius: ${isSecondary ? '3px' : '4px'}; 
                  font-size: ${isSecondary ? '10px' : '11px'}; 
                  ${isSecondary ? 'max-width: 150px;' : ''} 
                  word-break: break-all;
                `;
                
                const label = document.createElement('div');
                label.textContent = 'Original URL:';
                label.style.cssText = `font-weight: bold; margin-bottom: ${isSecondary ? '2px' : '3px'}; color: #495057;`;
                
                const link = document.createElement('a');
                link.href = urlObj.original;
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
                
                if (isSecondary && urlObj.display.length > 30) {
                  link.textContent = urlObj.display.substring(0, 30) + '...';
                  link.title = urlObj.display; // Show full URL on hover
                } else {
                  link.textContent = urlObj.display;
                }
                
                link.style.cssText = `color: #007bff; text-decoration: underline; ${isSecondary ? 'font-size: 9px;' : ''}`;
                
                // Add protocol indicator for HTTP URLs
                if (urlObj.original.startsWith('http://')) {
                  const httpWarning = document.createElement('div');
                  httpWarning.textContent = '⚠️ HTTP (insecure)';
                  httpWarning.style.cssText = `
                    font-size: ${isSecondary ? '8px' : '9px'}; 
                    color: #dc3545; 
                    margin-top: 2px;
                    font-weight: bold;
                  `;
                  urlDisplay.appendChild(httpWarning);
                }
                
                urlDisplay.appendChild(label);
                urlDisplay.appendChild(link);
                return urlDisplay;
              };

              if (urlObjects.length) {
                if (i === 3) { // Main images
                  const container = document.createElement('div');
                  container.style.display = 'flex';
                  container.style.justifyContent = 'space-between';
                  container.style.gap = '10px';

                  urlObjects.forEach((urlObj, index) => {
                    const imgContainer = document.createElement('div');
                    imgContainer.style.cssText = `
                      position: relative;
                      width: 350px;
                      height: 350px;
                      border: 1px solid #dee2e6;
                      background: #f8f9fa;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                    `;
                    
                    // Create loading indicator
                    const loadingIndicator = document.createElement('div');
                    loadingIndicator.className = 'loading-indicator';
                    loadingIndicator.style.cssText = `
                      position: absolute;
                      top: 50%;
                      left: 50%;
                      transform: translate(-50%, -50%);
                      z-index: 2;
                    `;
                    
                    const spinner = document.createElement('div');
                    spinner.style.cssText = `
                      width: 30px;
                      height: 30px;
                      border: 3px solid #e9ecef;
                      border-top: 3px solid #007bff;
                      border-radius: 50%;
                      animation: spin 1s linear infinite;
                    `;
                    
                    loadingIndicator.appendChild(spinner);
                    
                    const img = document.createElement('img');
                    img.style.cssText = `
                      max-width: 100%;
                      max-height: 100%;
                      object-fit: contain;
                      cursor: pointer;
                      display: none;
                    `;
                    img.alt = `Main Image ${index + 1}`;
                    
                    // Container for the image and URL
                    const imageAndUrlContainer = document.createElement('div');
                    imageAndUrlContainer.style.cssText = 'display: flex; flex-direction: column; align-items: center;';
                    
                    // Always show the original URL immediately
                    const urlDisplay = createUrlDisplay(urlObj, false);
                    
                    img.onload = () => {
                      // Hide loading indicator and show image
                      loadingIndicator.style.display = 'none';
                      img.style.display = 'block';
                    };
                    
                    img.addEventListener('click', () => openModal(urlObjects.map(u => u.original), index));
                    
                    // Fast loading - try most likely working URL first
                    loadImageWithFallbacks(img, urlObj.original);
                    
                    imgContainer.appendChild(loadingIndicator);
                    imgContainer.appendChild(img);
                    
                    imageAndUrlContainer.appendChild(imgContainer);
                    imageAndUrlContainer.appendChild(urlDisplay);
                    container.appendChild(imageAndUrlContainer);
                  });

                  td.appendChild(container);
                  
                } else { // Secondary images (i === 4)
                  const grid = document.createElement('div');
                  grid.className = 'image-grid';

                  urlObjects.forEach((urlObj, imageIndex) => {
                    const imgContainer = document.createElement('div');
                    imgContainer.style.cssText = `
                      display: inline-block; 
                      margin: 5px; 
                      vertical-align: top;
                      position: relative;
                      width: 250px;
                      height: 250px;
                      border: 1px solid #dee2e6;
                      background: #f8f9fa;
                    `;
                    
                    // Create loading indicator for secondary images
                    const loadingIndicator = document.createElement('div');
                    loadingIndicator.className = 'loading-indicator-small';
                    loadingIndicator.style.cssText = `
                      position: absolute;
                      top: 50%;
                      left: 50%;
                      transform: translate(-50%, -50%);
                      z-index: 2;
                    `;
                    
                    const spinner = document.createElement('div');
                    spinner.style.cssText = `
                      width: 20px;
                      height: 20px;
                      border: 2px solid #e9ecef;
                      border-top: 2px solid #007bff;
                      border-radius: 50%;
                      animation: spin 1s linear infinite;
                    `;
                    
                    loadingIndicator.appendChild(spinner);
                    
                    const img = document.createElement('img');
                    img.style.cssText = `
                      max-width: 100%; 
                      max-height: 100%; 
                      object-fit: contain; 
                      cursor: pointer; 
                      display: none;
                      position: absolute;
                      top: 50%;
                      left: 50%;
                      transform: translate(-50%, -50%);
                    `;
                    img.alt = `Secondary Image ${imageIndex + 1}`;
                    
                    // Container for the image and URL
                    const imageAndUrlContainer = document.createElement('div');
                    imageAndUrlContainer.style.cssText = 'display: flex; flex-direction: column; align-items: center;';
                    
                    // Always show the original URL immediately for secondary images too
                    const urlDisplay = createUrlDisplay(urlObj, true);
                    
                    img.onload = () => {
                      // Hide loading indicator and show image
                      loadingIndicator.style.display = 'none';
                      img.style.display = 'block';
                    };
                    
                    img.addEventListener('click', () => openModal(urlObjects.map(u => u.original), imageIndex));
                    
                    // Fast loading - try most likely working URL first
                    loadImageWithFallbacks(img, urlObj.original);
                    
                    imgContainer.appendChild(loadingIndicator);
                    imgContainer.appendChild(img);
                    
                    imageAndUrlContainer.appendChild(imgContainer);
                    imageAndUrlContainer.appendChild(urlDisplay);
                    grid.appendChild(imageAndUrlContainer);
                  });

                  td.appendChild(grid);
                }
              } else {
                // If no URLs found, show the original value as text or HTML
                renderHtmlContent(originalValue, td);
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
    male: /\b(male|boy|boys|him|he)\b/gi, // Removed man/men from here
    unisex: /\b(unisex|any gender|all genders|gender-neutral)\b/gi,
    others: /\b(as shown|As Shown|as the picture shows|color|colors|colour|Crewneck|neck|Sleeve|sleeves|sleeveless|Author|Origin|colours|dimensions|dimension|materials|material|size|includes|package|weight|made|Made|Pk|Count|Pack|Pieceshort[- ]?sleeve|short[- ]?sleeved|shortsleeve|long[- ]?sleeve|long[- ]?sleeved|longsleeve|crew[- ]?neck|round[- ]?neck|v[- ]?neck|vneck)\b|(?<=\d\s?)(pcs?|ct)\b/gi
  };


   // Icon mappings
  const icons = {
    
    
    // Other icons
    color: '🎨',
    colors: '🎨',
    colour: '🎨',
    colours: '🎨',
    size: '📏',
    dimensions: '📐',
    dimension: '📐',
    weight: '⚖️',
    material: '🧱',
    materials: '🧱',
    package: '📦',
    made: '🏭',
    count: '🔢',
    pack: '📦',
    piece: '🧩',
    pcs: '🔢',
    pc: '🔢',
    ct: '🔢',
    pk: '📦',
    'as the picture shows': '👁️',
    'as shown': '👁️',
    'As Shown': '👁️',
    includes: '📋',
    author: '✍️',
    origin: '🌍',
        neck: '👔',
    sleeve: '👕',
    sleeves: '👕',
    sleeveless: '🎽',
    'short sleeve': '👕',
    'short-sleeve': '👕',
    'short sleeved': '👕',
    'short-sleeved': '👕',
    'shortsleeve': '👕',
    'long sleeve': '🧥',
    'long-sleeve': '🧥',
    'long sleeved': '🧥',
    'long-sleeved': '🧥',
    'longsleeve': '🧥',
    'crew neck': '⭕',
    'crew-neck': '⭕',
    'round neck': '⭕',
    'round-neck': '⭕',
    'v neck': '🔽',
    'v-neck': '🔽',
    'vneck': '🔽'
  };

  function getIconForWord(word) {
    const lowerWord = word.toLowerCase().replace(/[^\w\s-]/g, '');
    return icons[lowerWord] || '';
  }

  function createHighlightSpan(className, text) {
    const icon = getIconForWord(text);
    return `<span class="${className}">${icon}${text}</span>`;
  }

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
        .replace(keywords.kids, match => createHighlightSpan('highlight-kids', match))
        .replace(keywords.teens, match => createHighlightSpan('highlight-teens', match))
        .replace(keywords.adults, match => createHighlightSpan('highlight-adults', match));
    }

    if (genderToggle) {
      // Highlight male keywords (excluding man/men)
      html = html.replace(keywords.male, match => createHighlightSpan('highlight-male', match));

      // Highlight female first
      html = html.replace(keywords.female, match => createHighlightSpan('highlight-female', match));
      html = html.replace(keywords.unisex, match => createHighlightSpan('highlight-unisex', match));

      // Special handling for man/men to avoid conflicts with women
      html = html.replace(/\b(men|man)('s|'s)?\b/gi, (match, word, apostrophePart, offset, fullText) => {
        const before = fullText.slice(offset - 2, offset).toLowerCase();
        if (before === "wo") {
          // Don't highlight if preceded by "wo" (part of women)
          return match;
        }
        
        // Highlight if it's a standalone word
        return createHighlightSpan('highlight-male', match);
      });
    }

    if (othersToggle) {
      html = html.replace(keywords.others, match => createHighlightSpan('highlight-others', match));
    }

    td.innerHTML = html;
  });
}



document.getElementById('highlightToggle').addEventListener('change', highlightWords);
document.getElementById('genderHighlightToggle').addEventListener('change', highlightWords);
document.getElementById('othersHighlightToggle').addEventListener('change', highlightWords);
