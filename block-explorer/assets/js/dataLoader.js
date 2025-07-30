import { API_KEY, CHANNEL_URLS, CHANNELS_NAME } from './consts.js';

// Success handler
export function renderTable(channel, dynamicContentArea, data) {
    let tableHtml = `
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">${CHANNELS_NAME[channel]} Data</h3>
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
    // convertir los datos recibidos en un arreglo de objetos
    if (!Array.isArray(data)) {
        data = Array.isArray(data.result) ? data.result : [data.result];
    }
    data.forEach(function(item) {
        const { candidateID, electorID, partyID, positionID, electoralRollType, ...rest } = item;
        const dataString = JSON.stringify(rest, null, 2);
        tableHtml += `
                        <tr>
                            <td>${candidateID || electorID || partyID || positionID}</td>
                            <td>${electoralRollType}</td>
                            <td>${dataString}</td>
                        </tr>   
        `;
    });

    tableHtml += `
                    </tbody>
                </table>
            </div>
        </div>
    `;

    dynamicContentArea.html(tableHtml);
}

// Error handler
export function renderError(channel, dynamicContentArea) {
    dynamicContentArea.html(`
        <div class="card card-danger card-outline">
            <div class="card-header">
                <h5 class="m-0">Error al cargar datos para ${CHANNELS_NAME[channel]}</h5>
            </div>
            <div class="card-body">
                <p class="text-danger">No se pudieron cargar los datos. Intenta de nuevo más tarde.</p>
            </div>
        </div>
    `);
}

// Loader function
export function loadChannelData(channel, dynamicContentArea) {
    dynamicContentArea.html(`
        <div class="card card-primary card-outline">
            <div class="card-header">
                <h5 class="m-0">Loading ${CHANNELS_NAME[channel]} data...</h5>
            </div>
            <div class="card-body">
                <p class="text-info">Please wait a few seconds...</p>
            </div>
        </div>
    `);

    const apiUrl = CHANNEL_URLS[channel];
    const header_auth = API_KEY;

    $.ajax({
        url: apiUrl,
            method: 'GET',
            dataType: 'json',
            contentType: 'application/json', 
            headers: {
                'auth': header_auth
            },
            data: JSON.stringify({
                pageSize: 20,
                bookmark: ""
        }),
        success: function(data) {
            renderTable(channel, dynamicContentArea, data);
        },
        error: function() {
            renderError(channel, dynamicContentArea);
        }
    });
}
