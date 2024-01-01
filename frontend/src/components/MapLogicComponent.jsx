import { useEffect } from "react";
import { GeoJSON, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../css/leaflet.css";
import PropTypes from "prop-types";
import "leaflet-boundary-canvas";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const MapLogicComponent = ({
  geojsonData,
  onAreaClick,
  leadingParties,
  getColorForParty,
}) => {
  const map = useMap();

  useEffect(() => {
    if (!geojsonData) {
      return;
    }

    let osm, ukLayer;

    if (!map._container_id) {
      map._container_id = true;

      // Logic for setting up the tile layer
      const osm = L.TileLayer.boundaryCanvas(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          boundary: geojsonData,
        }
      );
      map.addLayer(osm);
      const ukLayer = L.geoJSON(geojsonData);
      map.fitBounds(ukLayer.getBounds());
    }
    // Logic for creating constituency labels
    const markers = geojsonData.features.map((feature) => {
      const centroid = L.geoJSON(feature.geometry).getBounds().getCenter();
      const marker = L.marker(centroid, {
        icon: L.divIcon({
          className: "constituency-label",
          html: `<div style="color: #000000;">${feature.properties.cst.toString()}</div>`,
        }),
      });
      marker.on("click", () => onAreaClick(feature));
      return marker;
    });

    const markersGroup = L.featureGroup(markers).addTo(map);

    // Cleanup function
    return () => {
      if (map && map.remove) {
        markersGroup.clearLayers(); // Clear the markers
        if (osm) {
          map.removeLayer(osm); // Remove the boundaryCanvas layer if it's defined
        }
        // Remove ukLayer if added to the map and it's defined
        if (ukLayer && map.hasLayer(ukLayer)) {
          map.removeLayer(ukLayer);
        }
      }
    };
  }, [geojsonData]);

  return (
    <GeoJSON
      data={geojsonData}
      style={(feature) => {
        const constituencyId = feature.properties.cst;
        const leadingParty = leadingParties[constituencyId]?.Party;
        return {
          fillColor: getColorForParty(leadingParty),
          fillOpacity: "0.55",
          color: "#202940",
          weight: 1,
        };
      }}
      onEachFeature={(feature, layer) => {
        layer.on({
          click: () => {
            onAreaClick(feature);
          },
        });
      }}
    />
  );
};

MapLogicComponent.propTypes = {
  geojsonData: PropTypes.object,
  onAreaClick: PropTypes.func.isRequired,
  leadingParties: PropTypes.object.isRequired,
  getColorForParty: PropTypes.func.isRequired,
};

export default MapLogicComponent;
