//---------------------------------------------------------------- INITIALIZING MAP -----------------------------------------------------------------------

let activeMarker = null; // Declare activeMarker in the global scope
let activeMarkerData = null; // To store the active marker's data
let activeMarkerType = null; // To store the type of the active marker


document.addEventListener('DOMContentLoaded', async () => {
    // Initialize the map
    const map = L.map('map', {
        zoomControl: false, // Disable the default zoom control
    }).setView([0, 0], 2); // Global center and zoom

    // Add a light gray tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd',
        maxZoom: 19
    }).addTo(map);

    let activeMarker = null; // Keep track of the currently active marker

    // Map click event to reset active marker
    map.on('click', () => {
        if (activeMarker) {
            // Reset the previous active marker's style
            activeMarker.setIcon(createFaIcon(activeMarker.faClass, activeMarker.color));
            activeMarker = null;
        }
    });

    // Create custom panes
    map.createPane('institutionsPane');
    map.createPane('documentsPane');
    map.createPane('collectionsPane');
    map.createPane('personsPane');

    // Set z-index for each pane
    map.getPane('institutionsPane').style.zIndex = 350; // Highest
    map.getPane('collectionsPane').style.zIndex = 300;
    map.getPane('documentsPane').style.zIndex = 250;
    map.getPane('personsPane').style.zIndex = 200;

    // Load data dynamically and add markers with custom panes
    loadData('http://localhost:8081/wepAppNovara/apis/get-institutions.php', map, 'fa-university', '#708090', 'Institution', 'institutionsPane');
    loadData('http://localhost:8081/wepAppNovara/apis/get-collections.php', map, 'fa-dove', '#1E90FF', 'Collection', 'collectionsPane');
    loadData('http://localhost:8081/wepAppNovara/apis/get-documents.php', map, 'fa-book', '#2A9D8F', 'Document', 'documentsPane');
    loadData('http://localhost:8081/wepAppNovara/apis/get-persons.php', map, 'fa-user', '#264653', 'Person', 'personsPane');

    // Load stopover data and populate the left panel and map
    const stopovers = await fetchData('http://localhost:8081/wepAppNovara/apis/get-stopovers.php');
    populateLeftPanel(stopovers, map);

    // Load default counts
    fetchCounts();
});

//---------------------------------------------------------------- FONT AWESOME ICON FUNCTION -----------------------------------------------------------------------

function createFaIcon(faClass, color, isActive = false) {
    return L.divIcon({
        className: '',
        html: `
            <div style="
                width: ${isActive ? '25px' : '20px'}; 
                height: ${isActive ? '25px' : '20px'}; 
                background-color: ${isActive ? 'orange' : 'white'}; 
                border: 1.5px solid black; 
                border-radius: 50%; 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                color: ${color};
                font-size: 10px;">
                <i class="fa ${faClass}" aria-hidden="true"></i>
            </div>
        `,
        iconSize: [isActive ? 25 : 20, isActive ? 25 : 20],
        iconAnchor: [isActive ? 12.5 : 10, isActive ? 12.5 : 10],
        popupAnchor: [0, -10]
    });
}

//---------------------------------------------------------------- LOADING DATA AND ADDING CUSTOMIZED MARKERS -----------------------------------------------------------------------
function loadData(apiUrl, map, faClass, color, type, pane) {
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            data.forEach(item => {
                const latitude = parseFloat(item.latitude);
                const longitude = parseFloat(item.longitude);

                if (!isNaN(latitude) && !isNaN(longitude)) {
                    const marker = L.marker([latitude, longitude], {
                        icon: createFaIcon(faClass, color), // Default icon
                        pane: pane
                    }).addTo(map);

                    // Add custom properties for the marker
                    marker.data = item; // Store marker's data for info panel
                    marker.type = type; // Store marker type
                    marker.faClass = faClass; // Store font-awesome class
                    marker.color = color; // Store color

                    // Bind dynamic popup
                    marker.bindPopup(generatePopup(type, item, marker));

                    // Add click event to highlight marker
                    marker.on('click', () => {
                        // Reset the previous active marker's style
                        if (activeMarker && activeMarker !== marker) {
                            activeMarker.setIcon(createFaIcon(activeMarker.faClass, activeMarker.color));
                        }

                        // Highlight the current marker
                        marker.setIcon(createFaIcon(faClass, color, true));
                        activeMarker = marker;

                        // Hide the info panel if switching markers
                        const infoPanel = document.querySelector('.info-panel');
                        if (infoPanel) {
                            infoPanel.classList.remove('show');
                        }
                    });

                     // Ensure the info panel opens when clicking on highlighted text
                     marker.on('popupopen', () => {
                        const clickableElement = document.querySelector('.popup-highlight.clickable');
                        if (clickableElement) {
                            clickableElement.addEventListener('click', () => {
                                if (activeMarker === marker) {
                                    // Close the popup
                                    map.closePopup();
                                    // Populate and show the info panel
                                    populateInfoPanel(marker.data, marker.type);
                                }
                            });
                        }
                    });

                    // Reset marker and hide info panel on map click
                    map.on('click', () => {
                        if (activeMarker) {
                            activeMarker.setIcon(createFaIcon(activeMarker.faClass, activeMarker.color));
                            activeMarker = null;

                            // Hide the info panel
                            const infoPanel = document.querySelector('.info-panel');
                            if (infoPanel) {
                                infoPanel.classList.remove('show');
                            }
                        }
                    });
                } else {
                    console.warn(`Invalid coordinates for ${type}:`, { latitude, longitude });
                }
            });
        })
        .catch(error => console.error(`Error loading data from ${apiUrl}:`, error));
}

// Updated popup generation with direct binding for info panel
function generatePopup(type, data) {
    switch (type) {
        case 'Collection':
            return generateCollectionPopup(data);
        case 'Person':
            return generatePersonPopup(data);
        case 'Document':
            return generateDocumentPopup(data);
        case 'Institution':
            return generateInstitutionPopup(data);
        default:
            return `<div>No details available</div>`;
    }
}


//---------------------------------------------------------------- INFORMATION PANEL (RIGHT) -----------------------------------------------------------------------

// Populate the info panel when highlighted element is clicked
document.addEventListener('click', (event) => {
    if (event.target.classList.contains('clickable')) {
        const popupContainer = event.target.closest('.popup-container');
        if (!popupContainer) return;

        // Get the marker data stored in the popup's context
        const popupData = activeMarker ? activeMarker.data : null;
        const popupType = activeMarker ? activeMarker.type : null;

        if (popupData && popupType) {
            populateInfoPanel(popupData, popupType);
        }
    }
});

// Populate the info panel dynamically
function populateInfoPanel(data, type) {
    const infoPanel = document.querySelector('.info-panel');
    const rightPanel = document.querySelector('#right-panel');

    // Hide the right panel if it's active
    if (rightPanel && !rightPanel.classList.contains('hidden')) {
        rightPanel.classList.add('hidden');
    }

    if (infoPanel) {
        // Populate the info panel with the appropriate data
        let title = '';
        let image = '';
        let content = '';

        const toPascalCase = (text) => {
            return text
                .toLowerCase()
                .replace(/_/g, ' ') // Replace underscores with spaces
                .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter of each word
        };

        // Function to detect URLs and format them as clickable links
        const formatValue = (value) => {
            if (typeof value === 'string' && value.match(/^https?:\/\//)) {
                return `<a href="${value}" target="_blank" rel="noopener noreferrer">${value}</a>`;
            }
            return value;
        };

        switch (type) {
            case 'Collection':
                title = data.COMMON_NAME || 'Collection Details';
                image = data.Featured_Images || 'images/placeholder.jpg';
                content = Object.keys(data)
                    .map(key => `<p><span>${toPascalCase(key)}:</span> ${formatValue(data[key]) || 'N/A'}</p>`)
                    .join('');
                break;

            case 'Person':
                title = `${data.LAST_NAME || ''}, ${data.FIRST_NAME || ''}`;
                image = 'images/personinfo2.jpg';
                content = Object.keys(data)
                    .map(key => `<p><span>${toPascalCase(key)}:</span> ${formatValue(data[key]) || 'N/A'}</p>`)
                    .join('');
                break;

            case 'Document':
                title = data.TITLE_NAME || 'Document Details';
                image = 'images/documentinfo.jpeg';
                content = Object.keys(data)
                    .map(key => `<p><span>${toPascalCase(key)}:</span> ${formatValue(data[key]) || 'N/A'}</p>`)
                    .join('');
                break;

            case 'Institution':
                title = data.INSTITUTION_NAME || 'Institution Details';
                image = 'images/institutioninfo.jpg';
                content = Object.keys(data)
                    .map(key => `<p><span>${toPascalCase(key)}:</span> ${formatValue(data[key]) || 'N/A'}</p>`)
                    .join('');
                break;

            default:
                title = 'Details';
                content = '<p>No additional details available.</p>';
        }

        infoPanel.innerHTML = `
            <div class="info-panel-header">
                <h2>${title}</h2>
                <button class="close-info-panel">&times;</button>
            </div>
            <img src="${image}" alt="${title}" class="info-panel-image" />
            <div class="info-panel-content">
                ${content}
            </div>
        `;

        // Show the info panel
        infoPanel.classList.add('show');

        // Close button functionality
        const closeButton = infoPanel.querySelector('.close-info-panel');
        closeButton.addEventListener('click', () => {
            infoPanel.classList.remove('show');
        });
    }
}






//---------------------------------------------------------------- COLLECTION POPUP -----------------------------------------------------------------------

function generateCollectionPopup(collection) {
    const {
        COMMON_NAME,
        Featured_Images,
        Scientific_Name,
        Inventory_Number,
        Nomenclature_Adopted_By_Austrian_Scientists,
        Collection_Date,
        MAIN_PLACES,
        Collection_Place,
        Dimension,
        Indice_IUCN,
        Links,
        Subject,
        Class,
        Owner,
        References,
        State_of_Preservation,
        Spline_Code,
        COORDINATES_DD,
        COORDINATES_DMS,
        Description,
        Notes,
    } = collection;

    return `
        <div class="popup-container">
            <!-- Image Section -->
            ${Featured_Images
                ? `<img src="${Featured_Images}" alt="${COMMON_NAME}" class="popup-image" />`
                : '<div class="popup-image-placeholder">No Image Available</div>'
            }
            <div class="popup-body">
                <p><span class="popup-highlight clickable">${COMMON_NAME || 'N/A'}</span></p>
                <p><span>Scientific Name:</span> <strong>${Scientific_Name || 'N/A'}</strong></p>
                <p><span>Inventory Number:</span> <strong>${Inventory_Number || 'N/A'}</strong></p>
                <p><span>Main Places:</span> <strong>${MAIN_PLACES || 'N/A'}</strong></p>
                <p><span>Collection Place:</span> <strong>${Collection_Place || 'N/A'}</strong></p>
                <p><span>Subject:</span> <strong>${Subject || 'N/A'}</strong></p>
            </div>
        </div>
    `;
}





//---------------------------------------------------------------- PERSON POPUP -----------------------------------------------------------------------

// Function to generate a popup for persons
function generatePersonPopup(person) {
    const {
        LAST_NAME,
        FIRST_NAME,
        GENDER,
        LIFE_DATA,
        BIRTH_COUNTRY,
        TITLE,
        OCCUPATION,
        MAIN_ENCOUNTER_PLACE,
        SECONDARY_ENCOUNTER_PLACE,
        DATE,
        RESOURCES
    } = person;

    return `
        <div class="popup-container">
            <!-- Image Section -->
            <div class="popup-image" style="
                width: 100%;
                height: 150px;
                background-image: url('images/personinfo2.jpg');
                background-size: contain; /* Ensure the image covers the container */
                background-repeat: no-repeat; /* Prevent repeating */
                background-position: center; /* Center the image */
                border-radius: 8px; /* Rounded corners */
            "></div>

            <!-- Info Section -->
            <div class="popup-body">
                <p><span class="popup-highlight clickable">${LAST_NAME || 'N/A'}, ${FIRST_NAME || ''}</span></p>
                <p><span>Gender:</span> <strong>${GENDER || 'N/A'}</strong></p>
                <p><span>Life Data:</span> <strong>${LIFE_DATA || 'N/A'}</strong></p>
                <p><span>Birth Country:</span> <strong>${BIRTH_COUNTRY || 'N/A'}</strong></p>
                <p><span>Title:</span> <strong>${TITLE || 'N/A'}</strong></p>
                <p><span>Occupation:</span> <strong>${OCCUPATION || 'N/A'}</strong></p>
                <p><span>Main Encounter Place:</span> <strong>${MAIN_ENCOUNTER_PLACE || 'N/A'}</strong></p>
            </div>
        </div>
    `;
}


//---------------------------------------------------------------- DOCUMENT POPUP -----------------------------------------------------------------------


// Function to generate a popup for documents
function generateDocumentPopup(document) {
    const {
        TITLE_NAME,
        PLACE,
        PLACE_OF_COLLECTION,
        ALTERNATIVE_TITLE_NAME,
        ENGLISH_TRANSLATION,
        FIRST_AUTHOR,
        LANGUAGE,
        MEASURES_QUANTITY_FORMAT,
        PERIOD,
        COLLECTING_MODE,
        CURRENT_OWNER,
        DESCRIPTION
    } = document;

    return `
        <div class="popup-container">
            <div class="popup-image" style="
                width: 100%;
                height: 150px;
                background-image: url('images/documentinfo.jpeg');
                background-size: contain; /* Ensure the image covers the container */
                background-repeat: no-repeat; /* Prevent repeating */
                background-position: center; /* Center the image */
                border-radius: 8px; /* Rounded corners */
            "></div>
            <div class="popup-body">
                <p><span class="popup-highlight clickable">${TITLE_NAME || 'N/A'}</span></p>
                <p><span>Place:</span> <strong>${PLACE || 'N/A'}</strong></p>
                <p><span>Place of Collection:</span> <strong>${PLACE_OF_COLLECTION || 'N/A'}</strong></p>
                <p><span>First Author:</span> <strong>${FIRST_AUTHOR || 'N/A'}</strong></p>
                <p><span>Language:</span> <strong>${LANGUAGE || 'N/A'}</strong></p>
                <p><span>Collecting Mode:</span> <strong>${COLLECTING_MODE || 'N/A'}</strong></p>
            </div>
        </div>
    `;
}

//---------------------------------------------------------------- INSTITUTION POPUP -----------------------------------------------------------------------

// Function to generate a popup for institutions
function generateInstitutionPopup(institution) {
    const {
        INSTITUTION_NAME,
        MAIN_PLACE,
        PLACE,
        DIRECTOR,
        FOUNDATION_DATE,
        NATURE,
        REFERENCES
    } = institution;

    return `
        <div class="popup-container">
            <div class="popup-image" style="
                width: 100%;
                height: 150px;
                background-image: url('images/institutioninfo.jpg');
                background-size: contain;
                background-repeat: no-repeat; /* Prevent repeating */
                background-position: center; /* Center the image */
                border-radius: 8px; /* Rounded corners */
            "></div>
            <div class="popup-body">
                <p><span class="popup-highlight clickable">${INSTITUTION_NAME || 'N/A'}</span></p>
                <p><span>Main Place:</span> <strong>${MAIN_PLACE || 'N/A'}</strong></p>
                <p><span>Place:</span> <strong>${PLACE || 'N/A'}</strong></p>
                <p><span>Director:</span> <strong>${DIRECTOR || 'N/A'}</strong></p>
                <p><span>Foundation Date:</span> <strong>${FOUNDATION_DATE || 'N/A'}</strong></p>
                <p><span>Nature:</span> <strong>${NATURE || 'N/A'}</strong></p>
            </div>
        </div>
    `;
}

//---------------------------------------------------------------- LEFT PANEL - STOPOVERS -----------------------------------------------------------------------
// Function to load stopover data
async function fetchData(apiUrl) {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}

const leftPanel = document.createElement('div'); // Create left panel container
leftPanel.classList.add('left-panel');

// Function to populate the left panel with unique stopover data
function populateLeftPanel(stopovers, map) {
    const list = document.createElement('ul');
    list.classList.add('stopover-list');

    const infoPanel = document.querySelector('.info-panel');

    
    const uniqueStopovers = new Set(); // Track unique stopover names

    stopovers.forEach((stopover) => {
        const stopoverName = stopover.MAIN_PLACES;

        // Check if the stopover is already in the Set
        if (!uniqueStopovers.has(stopoverName)) {
            uniqueStopovers.add(stopoverName);

            const listItem = document.createElement('li');
            listItem.textContent = stopoverName;

            // Add click event for each list item
            listItem.addEventListener('click', () => {
                // Remove the active class from all items
                const allListItems = document.querySelectorAll('.stopover-list li');
                allListItems.forEach((item) => item.classList.remove('active'));

                // Add the active class to the clicked item
                listItem.classList.add('active');

                // Hide the info panel if it's active
                if (infoPanel && infoPanel.classList.contains('show')) {
                    infoPanel.classList.remove('show')
                }

                // Center map on selected stopover and open popup
                map.setView([parseFloat(stopover.latitude), parseFloat(stopover.longitude)], 10);
                const popup = L.popup({
                    closeButton: false,
                    offset: [0, -10],
                    className: 'custom-popup',
                })
                    .setLatLng([stopover.latitude, stopover.longitude])
                    .setContent(generateStopoverPopup(stopover))
                    .openOn(map);

                // Fetch and update counts based on the stopover
                fetchCounts(stopoverName);

                // Show the right panel
                showRightPanel(stopoverName); // Add function to show right panel
            });

            list.appendChild(listItem);
        }
    });

    leftPanel.innerHTML = ''; // Clear any existing content
    leftPanel.appendChild(list);
    document.body.appendChild(leftPanel); // Attach left panel to the DOM
}

// Popup for Stopover
function generateStopoverPopup(stopover) {
    const mainPlaces = stopover.MAIN_PLACES || 'Unknown Place';
    const region = stopover.REGION ? `${stopover.REGION}` : '';
    const partOf = stopover.PART_OF ? `${stopover.PART_OF}` : '';
    const additionalInfo = [region, partOf].filter(Boolean).join(', ');

    return `
        <div class="stopover-popup-container">
            <!-- Gradient Circle -->
            <div class="stopover-popup-circle">
                <div class="stopover-popup-inner-circle"></div>
            </div>

            <!-- Text Content -->
            <div class="stopover-popup-text">
                <div class="stopover-popup-main-text">${mainPlaces}</div>
                <div class="stopover-popup-additional-text">${additionalInfo}</div>
            </div>
        </div>
    `;
}

// Function to fetch and update counts (e.g., Persons, Documents)
async function fetchCounts(stopoverName) {
    try {
        const response = await fetch(`apis/fetch-counts.php?stopover=${encodeURIComponent(stopoverName)}`);
        if (!response.ok) {
            throw new Error('Failed to fetch counts');
        }
        const data = await response.json();

        document.getElementById('bird-count').textContent = data.collections || 0;
        document.getElementById('doc-count').textContent = data.documents || 0;
        document.getElementById('person-count').textContent = data.persons || 0;
        document.getElementById('institution-count').textContent = data.institutions || 0;
    } catch (error) {
        console.error('Error fetching counts:', error);
    }
}

// Function to toggle visibility of the left panel
function toggleLeftPanel(show) {
    if (show) {
        leftPanel.classList.remove('hidden');
    } else {
        leftPanel.classList.add('hidden');
    }
}

// Ensure left panel hides when grid is active
document.addEventListener('DOMContentLoaded', () => {
    const gridContainer = document.querySelector('.grid-container');
    const bottomNavItems = document.querySelectorAll('.bottom-nav-item');
    const closeGridButton = document.querySelector('.close-grid');

    // Hide left panel when grid is opened
    bottomNavItems.forEach((item) => {
        item.addEventListener('click', () => {
            toggleLeftPanel(false); // Hide the left panel
        });
    });

    // Show left panel when grid is closed
    if (closeGridButton) {
        closeGridButton.addEventListener('click', () => {
            toggleLeftPanel(true); // Show the left panel
        });
    }
});



//---------------------------------------------------------------- COUNT PANEL -----------------------------------------------------------------------

// Fetch counts from API and update the count panel
async function fetchCounts(stopover = '') {
    try {
        const url = stopover
            ? `http://localhost:8081/wepAppNovara/apis/get-counts.php?stopover=${encodeURIComponent(stopover)}`
            : 'http://localhost:8081/wepAppNovara/apis/get-total-counts.php';

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        if (data.counts) {
            updateCountPanel(data.counts.collections, data.counts.documents, data.counts.persons, data.counts.institutions);
        }
    } catch (error) {
        console.error('Error fetching counts:', error);
    }
}

// Update the count panel
function updateCountPanel(collections = 0, documents = 0, persons = 0, institutions = 0) {
    document.getElementById('bird-count').textContent = collections;
    document.getElementById('doc-count').textContent = documents;
    document.getElementById('person-count').textContent = persons;
    document.getElementById('institution-count').textContent = institutions;
}

//---------------------------------------------------------------- RIGHT PANEL -----------------------------------------------------------------------

document.getElementById('close-panel-btn').addEventListener('click', () => {
    const rightPanel = document.getElementById('right-panel');
    rightPanel.classList.add('hidden'); // Hide the panel when close button is clicked
});

// Function to show the right panel and populate it with API data
function showRightPanel(stopoverName) {
    const rightPanel = document.getElementById('right-panel');
    const panelContent = rightPanel.querySelector('.panel-content');

    // Display a loading state
    panelContent.innerHTML = `<p>Loading data for <strong>${stopoverName}</strong>...</p>`;
    rightPanel.classList.remove('hidden');

    // Fetch data from the API
    fetch(`http://localhost:8081/wepAppNovara/apis/get-all-from-stopover.php?stopover=${encodeURIComponent(stopoverName)}`)
        .then(response => response.json())
        .then(data => {
            panelContent.innerHTML = `
                <div class="filter-section">
                    <h2>Advance Filtering</h2>
                    <form id="filter-form">
                        <div class="filter-row">
                            <div>
                                <label for="type-filter">Type</label>
                                <select id="type-filter">
                                    <option value="all">All</option>
                                    <option value="persons">Persons</option>
                                    <option value="collections">Collections</option>
                                    <option value="documents">Documents</option>
                                    <option value="institutions">Institutions</option>
                                </select>
                            </div>
                            <div>
                                <label for="gender-filter">Gender</label>
                                <select id="gender-filter">
                                    <option value="all">All</option>
                                    <option value="M">Male</option>
                                    <option value="F">Female</option>
                                </select>
                            </div>
                        </div>
                        <div class="filter-row">
                            <div>
                                <label for="id-filter">Id</label>
                                <input type="text" id="id-filter" placeholder="Search">
                            </div>
                            <div>
                                <label for="occupation-filter">Occupation</label>
                                <input type="text" id="occupation-filter" placeholder="Search">
                            </div>
                        </div>
                        <div class="filter-row">
                            <div>
                                <label for="institution-filter">Institution</label>
                                <input type="text" id="institution-filter" placeholder="Search">
                            </div>
                            <div>
                                <label for="title-filter">Title</label>
                                <input type="text" id="title-filter" placeholder="Search">
                            </div>
                        </div>
                    </form>
                </div>
                <div class="results-section">
                <h2>Results</h2>
                    <div class="result-grid"></div>
                    <div class="pagination">
                        <button class="first-page" disabled>First</button>
                        <button class="prev-page" disabled>Previous</button>
                        <span class="pagination-info">1 of 1</span>
                        <button class="next-page" disabled>Next</button>
                        <button class="last-page" disabled>Last</button>
                    </div>
                </div>
            `;

            // Add filtering logic
            attachFilterLogic(data);
        })
        .catch(err => {
            console.error(err);
            panelContent.innerHTML = `<p>Failed to load data for <strong>${stopoverName}</strong>.</p>`;
        });
}

function attachFilterLogic(apiResponse) {
    const filterForm = document.getElementById('filter-form');
    const resultGrid = document.querySelector('.result-grid');

    // Combine all results into a single array with type
    const allResults = [
        ...(Array.isArray(apiResponse.data.persons) ? apiResponse.data.persons.map(p => ({ ...p, type: 'Persons' })) : []),
        ...(Array.isArray(apiResponse.data.collections) ? apiResponse.data.collections.map(c => ({ ...c, type: 'Collections' })) : []),
        ...(Array.isArray(apiResponse.data.documents) ? apiResponse.data.documents.map(d => ({ ...d, type: 'Documents' })) : []),
        ...(Array.isArray(apiResponse.data.institutions) ? apiResponse.data.institutions.map(i => ({ ...i, type: 'Institutions' })) : []),
    ];

    let filteredResults = [...allResults];

    // Apply filters
    const applyFilters = () => {
        const typeFilter = document.getElementById('type-filter').value.toLowerCase();
        const genderFilter = document.getElementById('gender-filter').value;
        const idFilter = document.getElementById('id-filter').value;
        const occupationFilter = document.getElementById('occupation-filter').value.toLowerCase();
        const institutionFilter = document.getElementById('institution-filter').value.toLowerCase();
        const titleFilter = document.getElementById('title-filter').value.toLowerCase();

        filteredResults = allResults.filter(item => {
            if (typeFilter !== 'all' && item.type.toLowerCase() !== typeFilter) return false;
            if (genderFilter !== 'all' && item.GENDER !== genderFilter) return false;
            if (idFilter && !(`${item.ID || ''}`.includes(idFilter))) return false;
            if (occupationFilter && !(item.OCCUPATION || '').toLowerCase().includes(occupationFilter)) return false;
            if (institutionFilter && !(item.INSTITUTION_NAME || '').toLowerCase().includes(institutionFilter)) return false;
            if (titleFilter && !(item.TITLE_NAME || '').toLowerCase().includes(titleFilter)) return false;
            return true;
        });

        renderFilteredResults(filteredResults);
    };

    // Attach input event listeners to filters
    filterForm.addEventListener('input', applyFilters);

    // Render filtered results
    const renderFilteredResults = (results) => {
        if (results.length === 0) {
            resultGrid.innerHTML = `<p>No results match your filters.</p>`;
        } else {
            generatePaginatedResultGrid({ stopover: apiResponse.stopover, data: { results } });
        }
    };

    // Initial render
    renderFilteredResults(filteredResults);
}

// Function to generate paginated results in a row format
function generatePaginatedResultGrid(apiResponse, resultsPerPage = 5) {
    const resultGrid = document.querySelector('.result-grid');
    const paginationInfo = document.querySelector('.pagination-info');
    const prevPageButton = document.querySelector('.prev-page');
    const nextPageButton = document.querySelector('.next-page');
    const firstPageButton = document.querySelector('.first-page');
    const lastPageButton = document.querySelector('.last-page');

    const filteredResults = apiResponse.data.results || [];
    const totalPages = Math.ceil(filteredResults.length / resultsPerPage);
    let currentPage = 1;

    const renderPage = (page) => {
        const startIndex = (page - 1) * resultsPerPage;
        const endIndex = startIndex + resultsPerPage;
        const pageResults = filteredResults.slice(startIndex, endIndex);

        resultGrid.innerHTML = pageResults.map(result => `
            <div class="result-item">
                <div class="result-details">
                    <p class="result-id">ID-${result.ID}</p>
                    <p><strong>${truncateText(result.LAST_NAME || result.FIRST_NAME || result.COMMON_NAME || result.TITLE_NAME || result.INSTITUTION_NAME, 15)}</strong></p>
                    <p class="result-tag ${result.type.toLowerCase()}">${result.type}</p>
                    <p>${truncateText(result.GENDER || result.Subject || result.YEAR_DATE || result.FOUNDATION_DATE || 'N/A', 10)}</p>
                </div>
            </div>
        `).join('');

        paginationInfo.textContent = `${page} of ${totalPages}`;
        prevPageButton.disabled = page === 1;
        nextPageButton.disabled = page === totalPages;
        firstPageButton.disabled = page === 1;
        lastPageButton.disabled = page === totalPages;
    };

    // Initial render
    renderPage(currentPage);

    // Pagination controls
    firstPageButton.addEventListener('click', () => {
        currentPage = 1;
        renderPage(currentPage);
    });

    prevPageButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderPage(currentPage);
        }
    });

    nextPageButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderPage(currentPage);
        }
    });

    lastPageButton.addEventListener('click', () => {
        currentPage = totalPages;
        renderPage(currentPage);
    });
}


function truncateText(text, limit) {
    if (text.length > limit) {
        return `${text.substring(0, limit)}...`;
    }
    return text;
}

//-------------------------------------------------------------- BOTTOM NAV - GRID -----------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    const gridContainer = document.querySelector('.grid-container');
    const bottomNavItems = document.querySelectorAll('.bottom-nav-item');
    const leftPanel = document.querySelector('.left-panel');
    const bottomPanel = document.querySelector('.bottom-panel');
    const rightPanel = document.querySelector('#right-panel');
    const closeGridButton = document.querySelector('.close-grid');
    const gridBody = document.querySelector('.grid-body');
    const paginationControls = document.createElement('div'); // For pagination
    paginationControls.classList.add('pagination');

    // Variables for Filters
    const genderFilter = document.getElementById('gender-filter');
    const idFilter = document.getElementById('id-filter');
    const occupationFilter = document.getElementById('occupation-filter');
    const institutionFilter = document.getElementById('institution-filter');
    const titleFilter = document.getElementById('title-filter');
    const applyFiltersButton = document.getElementById('apply-filters');
    const clearFiltersButton = document.getElementById('clear-filters');

    let currentPage = 1;
    const rowsPerPage = 5;
    let tableData = [];
    let currentCategory = '';
    let filteredData = [];

    // Apply Filters
    applyFiltersButton.addEventListener('click', () => {
        applyFilters();
        displayPageData(1);
    });

    // Apply Filters
    clearFiltersButton.addEventListener('click', () => {
        clearFilters();
    });

    function applyFilters() {
        const genderValue = genderFilter.value;
        const idValue = idFilter.value.trim();
        const occupationValue = occupationFilter.value.toLowerCase().trim();
        const institutionValue = institutionFilter.value.toLowerCase().trim();
        const titleValue = titleFilter.value.toLowerCase().trim();

        // Apply the filters on tableData
        filteredData = tableData.filter((item) => {
            if (genderValue !== 'all' && item.GENDER !== genderValue) return false;
            if (idValue && !(`${item.ID || ''}`.includes(idValue))) return false;
            if (occupationValue && !(item.OCCUPATION || '').toLowerCase().includes(occupationValue)) return false;
            if (institutionValue && !(item.INSTITUTION || '').toLowerCase().includes(institutionValue)) return false;
            if (titleValue && !(item.TITLE || '').toLowerCase().includes(titleValue)) return false;
            return true;
        });
    }

    function clearFilters() {
        // Reset filter inputs to their default values
        document.getElementById('gender-filter').value = 'all'; // Default for dropdown
        document.getElementById('id-filter').value = ''; // Clear text input
        document.getElementById('occupation-filter').value = ''; // Clear text input
        document.getElementById('institution-filter').value = ''; // Clear text input
        document.getElementById('title-filter').value = ''; // Clear text input

        // Reset the filtered data to the original table data
        filteredData = [...tableData]; // Reset filteredData to contain all tableData

        // Reset pagination to the first page and display all data
        currentPage = 1; 
        displayPageData(currentPage);

    }
    // Add pagination controls and create button to grid container
    const createButton = document.createElement('button');
    createButton.textContent = 'Create New';
    createButton.classList.add('create-btn');
    gridContainer.appendChild(createButton);
    gridContainer.appendChild(paginationControls);

    // Add pagination controls to grid container
    gridContainer.appendChild(paginationControls);

    const tableApiMap = {
        "Persons": "apis/get-persons.php",
        "Documents": "apis/get-documents.php",
        "Collections": "apis/get-collections.php",
        "Institutions": "apis/get-institutions.php",
    };

    const createApiMap = {
        "Persons": "apis/create-person.php",
        "Documents": "apis/create-document.php",
        "Collections": "apis/create-collection.php",
        "Institutions": "apis/create-institution.php",
    };

    // Handle create button click
    createButton.addEventListener('click', () => {
        const currentCategory = document.querySelector('.bottom-nav-item.active')?.getAttribute('data-category');
        const createApiUrl = createApiMap[currentCategory];

        if (!createApiUrl) {
            alert('Create API not found for this category.');
            return;
        }

        // Open modal for creating new entry
        openCreateModal(createApiUrl, currentCategory);
    });

    const deleteApiMap = {
        "Persons": "apis/delete-person.php",
        "Documents": "apis/delete-document.php",
        "Collections": "apis/delete-collection.php",
        "Institutions": "apis/delete-institution.php",
    };


    if (gridContainer && bottomNavItems.length > 0) {
        bottomNavItems.forEach((item) => {
            item.addEventListener('click', () => {
                const category = item.getAttribute('data-category');
                currentCategory = category; // Track current category

                bottomNavItems.forEach((nav) => nav.classList.remove('active')); // Remove active class
                item.classList.add('active'); // Add active class to clicked item

                if (leftPanel) leftPanel.classList.add('hidden');
                if (bottomPanel) bottomPanel.classList.add('hidden');
                if (rightPanel) rightPanel.classList.add('hidden');

                gridContainer.classList.add('show');

                if (category && tableApiMap[category]) {
                    currentPage = 1; // Reset to first page
                    fetchDataForGrid(tableApiMap[category]);
                }
            });
        });
    }

    if (closeGridButton) {
        closeGridButton.addEventListener('click', () => {
            gridContainer.classList.remove('show');
            if (leftPanel) leftPanel.classList.remove('hidden');
            if (bottomPanel) bottomPanel.classList.remove('hidden');

            bottomNavItems.forEach((nav) => nav.classList.remove('active')); // Remove active class
        });
    } else {
        console.error("Close button for grid not found!");
    }

    function fetchDataForGrid(apiUrl) {
        fetch(apiUrl)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                tableData = data;
                filteredData = [...tableData]; // Initially set filteredData to all data
                renderPaginationControls();
                displayPageData(currentPage);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                gridBody.innerHTML = '<p>Error loading data. Please try again later.</p>';
            });
    }

    function displayPageData(page) {
        gridBody.innerHTML = ''; // Clear previous data
    
        const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    
        if (filteredData.length === 0) {
            gridBody.innerHTML = '<p>No data available.</p>';
            return;
        }
    
        // Ensure the page number does not exceed total pages
        if (page > totalPages) {
            currentPage = totalPages;
        }
    
        const startIndex = (page - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        const pageData = filteredData.slice(startIndex, endIndex);
    
        // Safeguard for empty page data
        if (!pageData || pageData.length === 0) {
            gridBody.innerHTML = '<p>No data available on this page.</p>';
            return;
        }
    
        const table = document.createElement('table');
        table.classList.add('grid-table');
    
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        Object.keys(pageData[0] || {}).forEach((key) => {
            const th = document.createElement('th');
            th.textContent = key.replace(/_/g, ' ');
            headerRow.appendChild(th);
        });
        const actionTh = document.createElement('th');
        actionTh.textContent = 'Actions';
        headerRow.appendChild(actionTh); // Add Actions column header
        thead.appendChild(headerRow);
        table.appendChild(thead);
    
        const tbody = document.createElement('tbody');
        pageData.forEach((row, rowIndex) => {
            const tr = document.createElement('tr');
            Object.values(row).forEach((value) => {
                const td = document.createElement('td');
                td.textContent = value || 'N/A';
                tr.appendChild(td);
            });
    
            const actionTd = document.createElement('td');
            actionTd.classList.add('grid-actions');
            actionTd.innerHTML = `
                <i class="fa fa-edit edit-icon" title="Edit"></i>
                <i class="fa fa-trash delete-icon" title="Delete"></i>
            `;
            actionTd.querySelector('.edit-icon').addEventListener('click', () => handleUpdate(row));
            actionTd.querySelector('.delete-icon').addEventListener('click', () => handleDelete(row.ID));
            tr.appendChild(actionTd);
    
            tbody.appendChild(tr);
        });
        table.appendChild(tbody);
    
        gridBody.appendChild(table);
        updatePaginationInfo(totalPages);
    }
    
    function renderPaginationControls() {
        paginationControls.innerHTML = ''; // Clear existing controls
    
        const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    
        // Create the pagination buttons container
        const paginationWrapper = document.createElement('div');
        paginationWrapper.classList.add('pagination-wrapper');
        paginationWrapper.style.display = 'flex';
        paginationWrapper.style.alignItems = 'center';
        paginationWrapper.style.justifyContent = 'center';
    
        // Create buttons and pagination info
        const firstButton = createPaginationButton('First', () => {
            if (currentPage !== 1) {
                currentPage = 1;
                displayPageData(currentPage);
            }
        });
    
        const prevButton = createPaginationButton('Previous', () => {
            if (currentPage > 1) {
                currentPage--;
                displayPageData(currentPage);
            }
        });
    
        const nextButton = createPaginationButton('Next', () => {
            if (currentPage < totalPages) {
                currentPage++;
                displayPageData(currentPage);
            }
        });
    
        const lastButton = createPaginationButton('Last', () => {
            if (currentPage !== totalPages) {
                currentPage = totalPages;
                displayPageData(currentPage);
            }
        });
    
        const pageInfo = document.createElement('span');
        pageInfo.classList.add('pagination-info');
        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
        pageInfo.style.margin = '0 10px';
        pageInfo.style.fontSize = '0.9rem';
        pageInfo.style.color = '#333';
    
        // Append buttons and page info to the wrapper
        paginationWrapper.appendChild(firstButton);
        paginationWrapper.appendChild(prevButton);
        paginationWrapper.appendChild(pageInfo);
        paginationWrapper.appendChild(nextButton);
        paginationWrapper.appendChild(lastButton);
    
        // Add wrapper to paginationControls
        paginationControls.appendChild(paginationWrapper);
    }
    
    function createPaginationButton(label, onClick) {
        const button = document.createElement('button');
        button.textContent = label;
        button.classList.add('pagination-btn');
        button.style.margin = '0 5px';
        button.addEventListener('click', onClick);
        return button;
    }
    
    function updatePaginationInfo(totalPages) {
        const pageInfo = paginationControls.querySelector('.pagination-info');
        if (pageInfo) {
            pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
        }
    }
    
    
    

    // Create modal elements
    const modalOverlay = document.createElement('div');
    modalOverlay.classList.add('modal-overlay');
    modalOverlay.innerHTML = `
    <div class="modal">
        <div class="modal-header">
            <h2 id="modal-title">Update Row</h2>
            <button class="close-modal">&times;</button>
        </div>
        <div class="modal-body">
            <form id="update-form"></form>
        </div>
        <div class="modal-footer">
            <button class="btn-save" hidden>Save</button>
            <button class="btn-create hidden">Create</button>
            <button class="btn-cancel">Cancel</button>
        </div>
    </div>
`;
    document.body.appendChild(modalOverlay);

    const modal = modalOverlay.querySelector('.modal');
    const updateForm = modal.querySelector('#update-form');
    const closeModalBtn = modal.querySelector('.close-modal');
    const saveBtn = modal.querySelector('.btn-save');
    const createBtn = modal.querySelector('.btn-create');
    const cancelBtn = modal.querySelector('.btn-cancel');

    let currentRowData = null;
    let currentApiUrl = null; // Used for both update and create APIs
    let isCreateMode = false; // Track whether the modal is in create mode

    closeModalBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);

    // Handle Save button click for Update
    saveBtn.addEventListener('click', () => {
        if (!currentApiUrl || !currentRowData) return;

        // Collect form data
        const formData = new FormData(updateForm);
        const updatedData = {};
        formData.forEach((value, key) => {
            updatedData[key] = value;
        });
        updatedData.ID = currentRowData.ID; // Ensure the ID is included for the update API

        // Send the update request
        fetch(currentApiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData),
        })
            .then((response) => {
                if (!response.ok) {
                    return response.json().then((data) => {
                        throw new Error(data.error || 'Failed to update row');
                    });
                }
                alert('Row updated successfully');
                fetchDataForGrid(tableApiMap[document.querySelector('.bottom-nav-item.active')?.getAttribute('data-category')]); // Refresh grid
                closeModal();
            })
            .catch((error) => {
                alert('Error updating row: ' + error.message);
                console.error(error);
            });
    });

    // Handle Create button click for Create
    createBtn.addEventListener('click', () => {
        if (!currentApiUrl) return;

        // Collect form data
        const formData = new FormData(updateForm);
        const newData = {};
        formData.forEach((value, key) => {
            newData[key] = value;
        });

        // Send the create request
        fetch(currentApiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newData),
        })
            .then((response) => {
                if (!response.ok) {
                    return response.json().then((data) => {
                        throw new Error(data.error || 'Failed to create row');
                    });
                }
                alert('New row created successfully');
                fetchDataForGrid(tableApiMap[document.querySelector('.bottom-nav-item.active')?.getAttribute('data-category')]); // Refresh grid
                closeModal();
            })
            .catch((error) => {
                alert('Error creating row: ' + error.message);
                console.error(error);
            });
    });

    // Function to open modal for update
    function handleUpdate(row) {
        const updateApiMap = {
            "Persons": "apis/update-person.php",
            "Documents": "apis/update-document.php",
            "Collections": "apis/update-collection.php",
            "Institutions": "apis/update-institution.php",
        };

        const currentCategory = document.querySelector('.bottom-nav-item.active')?.getAttribute('data-category');
        currentApiUrl = updateApiMap[currentCategory];

        if (!currentApiUrl) {
            alert('Update API not found for this category.');
            return;
        }

        isCreateMode = false; // Not in create mode
        currentRowData = row;

        // Update modal title and buttons
        modalOverlay.querySelector('#modal-title').textContent = 'Update Row';
        saveBtn.classList.remove('hidden');
        createBtn.classList.add('hidden');

        // Populate the modal form with row data
        updateForm.innerHTML = '';
        Object.keys(row).forEach((key) => {
            const fieldWrapper = document.createElement('div');
            fieldWrapper.classList.add('form-field');
            fieldWrapper.innerHTML = `
            <label for="${key}">${key.replace(/_/g, ' ')}</label>
            <input type="text" id="${key}" name="${key}" value="${row[key] || ''}">
        `;
            updateForm.appendChild(fieldWrapper);
        });

        // Show the modal
        modalOverlay.style.display = 'flex';
    }

    // Function to open modal for create
    function openCreateModal(apiUrl, category) {
        currentApiUrl = apiUrl;

        isCreateMode = true; // Enable create mode
        currentRowData = null;

        // Update modal title and buttons
        modalOverlay.querySelector('#modal-title').textContent = 'Create New Entry';
        saveBtn.classList.add('hidden');
        createBtn.classList.remove('hidden');

        // Populate the modal form with empty fields
        updateForm.innerHTML = '';
        Object.keys(tableData[0] || {}).forEach((key) => {
            if (key === 'ID') return; // Exclude ID from the creation form

            const fieldWrapper = document.createElement('div');
            fieldWrapper.classList.add('form-field');
            fieldWrapper.innerHTML = `
            <label for="${key}">${key.replace(/_/g, ' ')}</label>
            <input type="text" id="${key}" name="${key}">
        `;
            updateForm.appendChild(fieldWrapper);
        });

        // Show the modal
        modalOverlay.style.display = 'flex';
    }

    function closeModal() {
        modalOverlay.style.display = 'none';
        updateForm.innerHTML = '';
        currentRowData = null;
        currentApiUrl = null;
    }

    function handleDelete(rowId, rowIndex) {
        const confirmation = confirm('Are you sure you want to delete this row?');
        if (confirmation) {
            const deleteApiUrl = deleteApiMap[currentCategory];
            if (!deleteApiUrl) {
                alert('Delete API not found for this category.');
                return;
            }
            fetch(deleteApiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ID: rowId }), // Send ID in request body
            })
                .then((response) => {
                    if (!response.ok) {
                        return response.json().then((data) => {
                            throw new Error(data.error || 'Failed to delete row');
                        });
                    }
                    alert('Row deleted successfully');
                    fetchDataForGrid(tableApiMap[currentCategory]); // Refresh data
                })
                .catch((error) => {
                    alert('Error deleting row: ' + error.message);
                    console.error(error);
                });
        }
    }

    // Initialize filters on grid open
    closeGridButton.addEventListener('click', () => {
        gridContainer.classList.remove('show');
        filteredData = [...tableData]; // Reset filters
        genderFilter.value = 'all';
        idFilter.value = '';
        occupationFilter.value = '';
        institutionFilter.value = '';
        titleFilter.value = '';
    });


    function truncateText(text, maxLength) {
        if (text.length > maxLength) {
            return text.slice(0, maxLength) + '...';
        }
        return text;
    }
});



