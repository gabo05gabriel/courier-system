import React, { useMemo, useState, useCallback } from "react";
import { GoogleMap, useJsApiLoader, Marker, DirectionsRenderer, TrafficLayer } from "@react-google-maps/api";

type LatLng = { lat: number; lng: number };
const containerStyle = { width: "100%", height: "520px" };

// Ejemplos en La Paz (ajusta)
const ORIGEN: LatLng  = { lat: -16.50052, lng: -68.13011 };
const DESTINO: LatLng = { lat: -16.49497, lng: -68.13544 };
const PARADAS: LatLng[] = [
  { lat: -16.50312, lng: -68.12121 },
  { lat: -16.5079,  lng: -68.1367  },
  { lat: -16.4932,  lng: -68.1189  },
];

export default function MapRutas() {
  const [route, setRoute] = useState<google.maps.DirectionsResult | null>(null);
  const [altIndex, setAltIndex] = useState(0);

  const center = useMemo(() => ORIGEN, []);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    libraries: ["places"] // agrega "geometry" si vas a decodificar polilíneas manualmente
  });

  const calcularRuta = useCallback(async () => {
    if (!isLoaded) return;
    const ds = new google.maps.DirectionsService();
    const waypoints = PARADAS.map(p => ({ location: new google.maps.LatLng(p.lat, p.lng), stopover: true }));

    const res = await ds.route({
      origin: new google.maps.LatLng(ORIGEN.lat, ORIGEN.lng),
      destination: new google.maps.LatLng(DESTINO.lat, DESTINO.lng),
      waypoints,
      optimizeWaypoints: true,             // optimiza orden de paradas
      provideRouteAlternatives: true,      // rutas alternativas
      drivingOptions: { departureTime: new Date() },
      travelMode: google.maps.TravelMode.DRIVING,
    });

    setRoute(res);
    setAltIndex(0);
  }, [isLoaded]);

  if (!isLoaded) return <div>Cargando mapa…</div>;

  return (
    <div className="w-full space-y-3">
      <div className="flex gap-2">
        <button className="px-3 py-2 rounded bg-black text-white" onClick={calcularRuta}>Calcular ruta</button>
        {route?.routes?.length ? (
          <button className="px-3 py-2 rounded border" onClick={() => setAltIndex(i => route.routes && i + 1 < route.routes.length ? i + 1 : 0)}>
            Alternar alternativa ({(route.routes?.length)||0})
          </button>
        ) : null}
      </div>

      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={13} options={{ streetViewControl: false }}>
        <Marker position={ORIGEN} label="Origen" />
        <Marker position={DESTINO} label="Destino" />
        {PARADAS.map((p, i) => <Marker key={i} position={p} label={`P${i+1}`} />)}
        <TrafficLayer />
        {route && route.routes[altIndex] && (
          <DirectionsRenderer
            directions={route}
            routeIndex={altIndex}
            options={{ suppressMarkers: true, polylineOptions: { strokeOpacity: 0.9, strokeWeight: 5 } }}
          />
        )}
      </GoogleMap>

      {route && route.routes[altIndex] && (() => {
        const legs = route.routes[altIndex].legs ?? [];
        const distKm = legs.reduce((n, l) => n + (l.distance?.value ?? 0), 0) / 1000;
        const secs   = legs.reduce((n, l) => n + (l.duration_in_traffic?.value ?? l.duration?.value ?? 0), 0);
        return <div className="p-3 rounded border">Resumen: <b>{distKm.toFixed(1)} km</b> • <b>{Math.round(secs/60)} min</b></div>;
      })()}
    </div>
  );
}
