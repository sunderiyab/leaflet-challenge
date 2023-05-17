
//load the data from earthquake URL
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson").then((data) => {
  
// create a map centered specific location
    const map = L.map("map").setView([37.09, -95.71],4);                 
// Create the tile layer that will be the background of our map.
  let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
//define function to determine the marker size based on the magnitude of the earthquake
  function getMarkerSize(magnitude) {
    return Math.sqrt(magnitude) * 8; ///increasing size of a marker by multiplying the sqrt of the magnitude
  }
  // marker color based on the earhtquake depth
  function getMarkerColor(depth) {
    if (depth > 90) {
      return "#FF0000"; // Red
    } else if (depth > 70) {
      return "#FF4500"; // OrangeRed
    } else if (depth > 50) {
      return "#FFA500"; // Orange
    } else if (depth > 30) {
      return "#FFD700"; // Gold
    } else if (depth > 10) {
      return "#ADFF2F"; // GreenYellow
    } else {
      return "#32CD32"; // LimeGreen
    }
  }
// Define a function to create a marker for each earthquake feature
    function createMarker(feature, latlng) {
    const magnitude = feature.properties.mag;
    const depth = feature.geometry.coordinates[2];
    const markerSize = getMarkerSize(magnitude);
    const markerColor = getMarkerColor(depth);

    const markerOptions = {
      radius: markerSize,
      fillColor: markerColor,
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8,
    };
    ///Include popups that provide additional information about the earthquake when its associated marker is clicked
    const popupContent = `
      <h3>${feature.properties.place}</h3>
      <p>Magnitude: ${magnitude}</p>
      <p>Depth: ${depth}</p>
    `;
    const marker = L.circleMarker(latlng, markerOptions).bindPopup(popupContent);
    return marker;
  }

      // Create a GeoJSON layer with the earthquake features and custom marker creation
    const earthquakes = L.geoJSON(data.features, {
        pointToLayer: createMarker,
      }).addTo(map);
    
      // Create a legend that will provide context for your map data.
      const legend = L.control({ position: "bottomright" });
      legend.onAdd = function (map) {
        const div = L.DomUtil.create("div", "legend");
        const depths = [0, 10, 30, 50, 70, 90];
        const labels = [];
    
        for (let i = 0; i < depths.length; i++) {
          div.innerHTML += `
            <i style="background: ${getMarkerColor(depths[i] + 1)}"></i>
            ${depths[i]} km${depths[i + 1] ? "&ndash;" + depths[i + 1] + " km" : "+"}<br>
          `;
        }
    
        return div;
      };
    
      // Add the legend to the map
      legend.addTo(map);
    });
    