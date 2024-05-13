import { useEffect } from "react";
import { GeoJSON, useMap } from "react-leaflet";
import L from "leaflet";
import PropTypes from "prop-types";
import useMediaQuery from "@mui/material/useMediaQuery";

const MapLogicComponent = ({ geojsonData, onAreaClick, leadingParties }) => {
  const map = useMap();
  const isSmallScreen = useMediaQuery("(max-width: 600px)");

  useEffect(() => {
    if (!geojsonData) {
      return;
    }

    let osm, ukLayer;

    if (!map._container_id) {
      map._container_id = true;

      // Tile layer
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
    if (isSmallScreen) {
      return;
    }
    // Constituency labels
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
        markersGroup.clearLayers();
        // Remove the boundaryCanvas layer
        if (osm) {
          map.removeLayer(osm);
        }
        // Remove Layer
        if (ukLayer && map.hasLayer(ukLayer)) {
          map.removeLayer(ukLayer);
        }
      }
    };
  }, [geojsonData, isSmallScreen]);

  return (
    <GeoJSON
      data={geojsonData}
      style={(feature) => {
        const constituencyId = feature.properties.cst;
        const leadingParty = leadingParties[constituencyId]?.Color;
        return {
          fillColor: leadingParty,
          fillOpacity: "0.55",
          color: "#061434",
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

// PropTypes
MapLogicComponent.propTypes = {
  geojsonData: PropTypes.object,
  onAreaClick: PropTypes.func.isRequired,
  leadingParties: PropTypes.object.isRequired,
};

export default MapLogicComponent;
