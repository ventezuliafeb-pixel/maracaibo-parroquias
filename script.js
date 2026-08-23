const map = L.map('map').setView([10.6427, -71.6125], 12);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

function styleParroquias(feature) {
    return {
        fillColor: '#3182ce',
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.5
    };
}

function highlightFeature(e) {
    const layer = e.target;
    layer.setStyle({
        weight: 3,
        color: '#ff7800',
        fillOpacity: 0.7
    });
    layer.bringToFront();
}

function resetHighlight(e) {
    geojsonLayer.resetStyle(e.target);
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
    const props = e.target.feature.properties;
    document.getElementById('parroquia-nombre').innerHTML = `
        <strong>Parroquia:</strong> ${props.nombre || props.PARROQUIA || 'No especificada'} <br>
        <em>Información territorial y urbana de la zona.</em>
    `;
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

let geojsonLayer;

fetch('maracaibo_parroquias.geojson')
    .then(response => response.json())
    .then(data => {
        geojsonLayer = L.geoJson(data, {
            style: styleParroquias,
            onEachFeature: onEachFeature
        }).addTo(map);
    })
    .catch(error => console.error('Error cargando el archivo GeoJSON:', error));
