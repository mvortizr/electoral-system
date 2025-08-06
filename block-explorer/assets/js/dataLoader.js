import { CHANNEL_API_KEYS, CHANNEL_URLS, CHANNELS_NAME } from './consts.js';

// Objeto para almacenar el estado de paginación de cada canal
const paginationState = {};
let isLoading = false; // Flag para evitar múltiples llamadas simultáneas

/**
 * Renderiza la tabla de datos y el selector de página.
 * @param {string} channel El nombre del canal.
 * @param {object[]} dataArray Los datos a mostrar en la tabla.
 * @returns {string} El HTML de la tabla.
 */
export function renderTable(channel, dataArray) {
    // Si el estado del canal no existe, se inicializa.
    // NOTA: Esta inicialización se ha movido a loadChannelData para evitar el error.
    const { bookmarks, currentPageIndex } = paginationState[channel];
    let tableHtml = `
        <div class="card">
            <div class="card-header d-flex align-items-center">
                <h3 class="card-title mb-0">${CHANNELS_NAME[channel]} Data</h3>
                <div class="pxage-selector-container d-flex align-items-center ml-auto">
                    <span class="mr-2">Go to page:</span>
                    <select id="pageSelector" class="form-control d-inline-block w-auto">
                        ${bookmarks.map((bookmark, index) => `
                            <option value="${index}" ${index === currentPageIndex ? 'selected' : ''}>Page ${index + 1}</option>
                        `).join('')}
                    </select>
                </div>
            </div>
            <div class="card-body">
                <table class="table table-bordered table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Type</th>
                            <th>Content</th>
                        </tr>
                    </thead>
                    <tbody>
    `;

    if (dataArray.length === 0) {
        tableHtml += `<tr><td colspan="3">No data available.</td></tr>`;
    } else {
        dataArray.forEach(function(item) {
            const { candidateID, electorID, partyID, positionID, registryID, electoralRollType, voteRegistryType, voteResultType, ...rest } = item;
            const dataString = JSON.stringify(rest, null, 2);
            tableHtml += `
                            <tr>
                                <td>${candidateID || electorID || partyID || positionID || registryID || '-'}</td>
                                <td>${electoralRollType || voteRegistryType || voteResultType ||  '-'}</td>
                                <td><pre>${dataString}</pre></td>
                            </tr>   
            `;
        });
    }

    tableHtml += `
                    </tbody>
                </table>
            </div>
        </div>
    `;

    return tableHtml;
}

/**
 * Render an error message when data loading fails.
 * @param {string} channel Channel name.
 * @param {jQuery} dynamicContentArea The area where the content is rendered.
 */
export function renderError(channel, dynamicContentArea) {
    dynamicContentArea.html(`
        <div class="card card-danger card-outline">
            <div class="card-header">
                <h5 class="m-0">Error loading ${CHANNELS_NAME[channel]}</h5>
            </div>
            <div class="card-body">
                <p class="text-danger">Try later.</p>
            </div>
        </div>
    `);
}

/**
 * Show a loading message while data is being fetched.
 * @param {string} channel Channel name.
 * @param {jQuery} dynamicContentArea The area where the content is rendered.
 */
function renderLoader(channel, dynamicContentArea) {
    dynamicContentArea.html(`
        <div class="card card-primary card-outline">
            <div class="card-header">
                <h5 class="m-0">Loading ${CHANNELS_NAME[channel]}...</h5>
            </div>
            <div class="card-body">
                <p class="text-info">Wait a few seconds...</p>
            </div>
        </div>
    `);
}

/**
 * Load data for a specific channel and render it in the dynamic content area.
 * @param {string} channel Channel name.
 * @param {jQuery} dynamicContentArea The area where the content is rendered.
 */
export function loadChannelData(channel, dynamicContentArea) {
    if (isLoading) return;
    isLoading = true;
    renderLoader(channel, dynamicContentArea);

    // FIX: Se inicializa el estado del canal AQUI, antes de usarlo.
    if (!paginationState[channel]) {
        paginationState[channel] = {
            bookmarks: [''],
            currentPageIndex: 0
        };
    }

    const { bookmarks, currentPageIndex } = paginationState[channel];
    const apiUrl = CHANNEL_URLS[channel];
    const header_auth = CHANNEL_API_KEYS[channel];
    const currentBookmark = bookmarks[currentPageIndex] || '';

    $.ajax({
        url: apiUrl,
        method: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        headers: {
            'auth': header_auth
        },
        data: JSON.stringify({
            pageSize: 10,
            bookmark: currentBookmark
        }),
        success: function(response) {
            isLoading = false;
            const data = response.result;
            const nextBookmark = data.bookmark;
            
            let dataArray = [];
            if (data && data.data) {
                dataArray = Array.isArray(data.data) ? data.data : [data.data];
            } else if (Array.isArray(data)) {
                dataArray = data;
            }

            // Aquí se valida si hay datos Y un próximo bookmark
            const hasMorePages = dataArray.length > 0 && nextBookmark && nextBookmark !== '';

            // Renderiza la tabla
            let fullHtml = renderTable(channel, dataArray);

            let buttonsHtml = '<div style="display: flex; justify-content: center; gap: 10px; margin-top: 15px;">';
            
            // Botón "Anterior"
            if (currentPageIndex > 0) {
                buttonsHtml += `<button id="goBackBtn" class="btn btn-primary">Previous</button>`;
            }

            // Botón "Siguiente"
            if (hasMorePages) {
                buttonsHtml += `<button id="loadMoreBtn" class="btn btn-primary">Next</button>`;
                
                // Si el bookmark es nuevo, lo agregamos al arreglo
                if (!bookmarks.includes(nextBookmark)) {
                    bookmarks.push(nextBookmark);
                }
            }

            buttonsHtml += `</div>`;
            fullHtml += buttonsHtml;

            // Reemplaza todo el contenido del área dinámica de una vez
            dynamicContentArea.html(fullHtml);

            // Adjunta los event listeners a los botones y al selector recién creados
            if (currentPageIndex > 0) {
                $('#goBackBtn').on('click', function() {
                    paginationState[channel].currentPageIndex--;
                    loadChannelData(channel, dynamicContentArea);
                });
            }

            if (hasMorePages) {
                $('#loadMoreBtn').on('click', function() {
                    paginationState[channel].currentPageIndex++;
                    loadChannelData(channel, dynamicContentArea);
                });
            }
            
            $('#pageSelector').on('change', function() {
                const newIndex = parseInt($(this).val(), 10);
                if (newIndex !== currentPageIndex) {
                    paginationState[channel].currentPageIndex = newIndex;
                    loadChannelData(channel, dynamicContentArea);
                }
            });

        },
        error: function() {
            isLoading = false;
            renderError(channel, dynamicContentArea);
        }
    });
}
