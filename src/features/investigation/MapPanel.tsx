interface MapPanelProps {
  locations: Array<{ id: string; label: string }>;
  selectedLocationId: string;
  onSelectLocation: (locationId: string) => void;
}

function MapPanel({
  locations,
  selectedLocationId,
  onSelectLocation
}: MapPanelProps) {
  return (
    <section className="panel">
      <h2>地图探索</h2>
      <div className="location-grid">
        {locations.map((location) => (
          <button
            key={location.id}
            type="button"
            className={`location-btn ${
              selectedLocationId === location.id ? "active" : ""
            }`}
            onClick={() => onSelectLocation(location.id)}
          >
            {location.label}
          </button>
        ))}
      </div>
    </section>
  );
}

export default MapPanel;
