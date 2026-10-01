import { memo, useEffect, useRef, useState } from 'react';

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const fallbackCenter = { lat: 30.3752, lng: 76.1526 };
let mapsLoader;

function loadGoogleMaps() {
  if (window.google?.maps) return Promise.resolve(window.google.maps);
  if (mapsLoader) return mapsLoader;

  mapsLoader = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    const params = new URLSearchParams({ key: apiKey, loading: 'async', v: 'weekly' });
    script.src = `https://maps.googleapis.com/maps/api/js?${params}`;
    script.async = true;
    script.dataset.googleMaps = 'true';
    script.onload = () => {
      if (window.google?.maps) resolve(window.google.maps);
      else reject(new Error('Google Maps loaded without its JavaScript API.'));
    };
    script.onerror = () => {
      mapsLoader = undefined;
      reject(new Error('Google Maps JavaScript API failed to load.'));
    };
    document.head.appendChild(script);
  });

  return mapsLoader;
}

function NearbyMap({ location }) {
  const sectionRef = useRef(null);
  const mapElementRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const geocoderRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [mapStatus, setMapStatus] = useState(apiKey ? 'loading' : 'unconfigured');
  const [mapMessage, setMapMessage] = useState('');

  useEffect(() => {
    if (!apiKey || !sectionRef.current || !('IntersectionObserver' in window)) {
      if (apiKey) setIsVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, { rootMargin: '180px' });

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!apiKey || !isVisible) return undefined;

    let cancelled = false;
    const timer = window.setTimeout(() => {
      loadGoogleMaps()
        .then((maps) => {
          if (cancelled || !mapElementRef.current) return;

          if (!mapRef.current) {
            mapRef.current = new maps.Map(mapElementRef.current, {
              center: fallbackCenter,
              zoom: 12,
              mapTypeControl: false,
              streetViewControl: false,
              fullscreenControl: false,
              clickableIcons: false,
              gestureHandling: 'cooperative',
              mapTypeId: maps.MapTypeId.ROADMAP,
              styles: [
                { elementType: 'geometry', stylers: [{ color: '#f1eee3' }] },
                { elementType: 'labels.text.fill', stylers: [{ color: '#53634f' }] },
                { elementType: 'labels.text.stroke', stylers: [{ color: '#f7f5ed' }] },
                { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#c9cbb9' }] },
                { featureType: 'landscape.natural', elementType: 'geometry', stylers: [{ color: '#e4e7d5' }] },
                { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#dde5d0' }] },
                { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#fffaf0' }] },
                { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#d5cdbb' }] },
                { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#cbdedb' }] },
              ],
            });
            geocoderRef.current = new maps.Geocoder();
            markerRef.current = new maps.Marker({
              map: mapRef.current,
              title: 'Farm location',
              animation: maps.Animation.DROP,
            });
          }

          setMapStatus('ready');
          geocoderRef.current.geocode(
            { address: `${location.trim()}, Punjab, India` },
            (results, status) => {
              if (cancelled) return;
              if (status !== 'OK' || !results?.[0]) {
                mapRef.current.setCenter(fallbackCenter);
                markerRef.current.setPosition(fallbackCenter);
                mapRef.current.setZoom(11);
                setMapMessage(`Could not find “${location}” in Punjab. Showing the Nabha area.`);
                return;
              }

              const position = results[0].geometry.location;
              mapRef.current.setCenter(position);
              markerRef.current.setPosition(position);
              setMapMessage(`Showing ${results[0].formatted_address}`);
            },
          );
        })
        .catch((error) => {
          if (cancelled) return;
          console.error('Google Maps initialization failed:', error);
          setMapStatus('error');
          setMapMessage('Google Maps could not load. Check the API key, enabled APIs, billing, and referrer restrictions.');
        });
    }, 350);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [isVisible, location]);

  return (
    <section className="map-panel panel glass-panel" ref={sectionRef}>
      <div className="panel-header map-panel-header">
        <div>
          <p className="map-kicker">FIELD LOCATION</p>
          <h2>Start with the place it begins.</h2>
        </div>
        <span className="map-label"><i /> GOOGLE MAPS</span>
      </div>
      <div className={`map-canvas-wrap ${mapStatus === 'ready' ? 'is-ready' : ''}`}>
        <div className="google-map-canvas" ref={mapElementRef} aria-label={`Map showing ${location}, Punjab`} />
        {mapStatus !== 'ready' && (
          <div className={`map-message map-message-${mapStatus}`} role="status">
            <span className="map-message-icon">{mapStatus === 'error' ? '!' : '⌖'}</span>
            <strong>{mapStatus === 'loading' ? 'Opening the field map' : mapStatus === 'error' ? 'Map unavailable' : 'Connect your field map'}</strong>
            <span>
              {mapStatus === 'loading'
                ? 'Finding the area around your listing…'
                : mapStatus === 'error'
                  ? mapMessage
                  : 'Add VITE_GOOGLE_MAPS_API_KEY to frontend/.env.local to enable live Google Maps.'}
            </span>
          </div>
        )}
      </div>
      <div className="map-panel-footer">
        <span className="map-location-status"><i />{mapMessage || (mapStatus === 'ready' ? `Searching near ${location}, Punjab` : 'Nabha, Punjab · Field-to-market pilot')}</span>
        <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${location}, Punjab, India`)}`} target="_blank" rel="noreferrer">
          Open location in Google Maps <span aria-hidden="true">↗</span>
        </a>
      </div>
    </section>
  );
}

export default memo(NearbyMap);
