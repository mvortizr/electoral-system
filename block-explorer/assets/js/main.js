// assets/js/main.js

import { CHANNELS } from './consts.js';
import { loadChannelData } from './dataLoader.js';

// Asegúrate de que el DOM esté completamente cargado antes de ejecutar el script
$(document).ready(function() {
    const dynamicContentArea = $('#dynamicContent');
    const sidebarLinks = $('.nav-sidebar .nav-link'); // Selecciona todos los enlaces del sidebar

    // Event Listeners para los enlaces del sidebar
    $('#channel1Link').on('click', function(e) {
        e.preventDefault(); // Evita que el enlace recargue la página
        sidebarLinks.removeClass('active'); // Quita 'active' de todos
        $(this).addClass('active'); // Añade 'active' al clicado
        loadChannelData(CHANNELS[1], dynamicContentArea);
    });

    $('#channel2Link').on('click', function(e) {
        e.preventDefault();
        sidebarLinks.removeClass('active');
        $(this).addClass('active');
        loadChannelData(CHANNELS[2], dynamicContentArea);
    });

    $('#channel3Link').on('click', function(e) {
        e.preventDefault();
        sidebarLinks.removeClass('active');
        $(this).addClass('active');
        loadChannelData(CHANNELS[3], dynamicContentArea);
    });

    // Cargar el contenido del "Channel 1" por defecto al cargar la página
    $('#channel1Link').click(); 
});