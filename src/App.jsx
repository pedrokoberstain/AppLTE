// gefron-central/src/App.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { db } from './firebaseConfig'; 
import { ref, onValue } from 'firebase/database';
import { MapContainer, TileLayer, CircleMarker, Popup, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'; 
import './App.css'; // Importa o CSS que acabamos de mudar
import logoGefron from './assets/gefron-logo.jpg'; 
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'; 
import 'leaflet-defaulticon-compatibility';

// (Removemos o 'statusIndicatorStyle' daqui, pois agora está no CSS)

function App() {
  const [pontos, setPontos] = useState([]);
  const [mapCenter, setMapCenter] = useState([-15.793889, -47.882778]); 
  const [isCurrentlyOffline, setIsCurrentlyOffline] = useState(false);
  const [offlineEvents, setOfflineEvents] = useState([]);
  const [lastMessageTime, setLastMessageTime] = useState(Date.now());
  const [mapInstance, setMapInstance] = useState(null);

  // atualiza a vista do mapa quando o centro mudar (evita remount do MapContainer)
  useEffect(() => {
    if (mapInstance && mapCenter) {
      try {
        mapInstance.setView(mapCenter);
      } catch (e) {
        // noop
      }
    }
  }, [mapInstance, mapCenter]);

  // renderer em Canvas para melhorar performance com muitos pontos
  const canvasRenderer = useMemo(() => L.canvas({ padding: 0.5 }), []);

  // prepara GeoJSON a partir de `pontos` para renderizar com um único layer (mais rápido)
  const pontosGeoJson = useMemo(() => ({
    type: 'FeatureCollection',
    features: pontos.map(p => ({
      type: 'Feature',
      properties: p,
      geometry: { type: 'Point', coordinates: [Number(p.lng), Number(p.lat)] }
    }))
  }), [pontos]);

  // Efeito que busca dados do Firebase — mantém TODOS os pontos
  useEffect(() => {
    const historicoRef = ref(db, 'historico_localizacoes/');

    const unsubscribe = onValue(historicoRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        setPontos([]);
        return;
      }

      const listaDePontos = [];
      Object.keys(data).forEach((chipId) => {
        const historicoDoChip = data[chipId];
        Object.keys(historicoDoChip).forEach((pontoId) => {
          const ponto = historicoDoChip[pontoId];
          if (ponto && ponto.lat && ponto.lng) {
            ponto.chipId = chipId;
            ponto.id = pontoId;
            listaDePontos.push(ponto);
          }
        });
      });

      setPontos(listaDePontos);

      if (listaDePontos.length > 0) {
        const ultimoPonto = listaDePontos[listaDePontos.length - 1];
        if (ultimoPonto && ultimoPonto.lat && ultimoPonto.lng) {
          setMapCenter([ultimoPonto.lat, ultimoPonto.lng]);
          setLastMessageTime(Number(ultimoPonto.timestamp) || Date.now());
          setIsCurrentlyOffline(false);
        }
      }
    });

    return () => { try { unsubscribe(); } catch (e) { /* noop */ } };
  }, []);

  // 'useEffect' VIGILANTE (sem mudanças)
  useEffect(() => {
    const timer = setInterval(() => {
      const agora = Date.now();
      const diff = agora - lastMessageTime;

      if (diff > 3000) {
        if (!isCurrentlyOffline) { 
          setIsCurrentlyOffline(true);
          if (pontos.length > 0) {
            const lastPoint = pontos[pontos.length - 1];
            setOfflineEvents(prevEvents => [...prevEvents, lastPoint]);
          }
        }
      } else {
        setIsCurrentlyOffline(false);
      }
    }, 1000); 

    return () => clearInterval(timer);

  }, [lastMessageTime, pontos, isCurrentlyOffline]); 


  return (
    <div className="app-container">
      <header className="header">
        <img src={logoGefron} alt="Logo GEFRON" className="logo-gefron" />
        <h1 className="header-title">GEFRON LTE - Mapa de Cobertura</h1>
        
        {/* --- INDICADOR DE STATUS ATUALIZADO --- */}
        {/* Substituímos o 'div' com 'style' por este bloco com classes CSS */}
        <div className="status-indicator">
          <span className={`status-dot ${isCurrentlyOffline ? 'offline' : 'online'}`}></span>
          <span className="status-text">
            {isCurrentlyOffline ? 'STATUS: OFFLINE' : 'STATUS: ONLINE'}
          </span>
        </div>
      </header>
      
      <MapContainer 
        center={mapCenter} 
        zoom={13} 
        className="map-container-leaflet" 
        whenCreated={setMapInstance}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* 1. Renderiza os pontos (usando GeoJSON + Canvas renderer para melhor performance) */}
        {pontosGeoJson && pontosGeoJson.features && pontosGeoJson.features.length > 0 && (
          <GeoJSON
            data={pontosGeoJson}
            pointToLayer={(feature, latlng) => {
              const p = feature.properties;
              return L.circleMarker(latlng, {
                renderer: canvasRenderer,
                radius: 6,
                color: p.success ? 'green' : 'red',
                fillColor: p.success ? '#28a745' : '#dc3545',
                fillOpacity: 0.8,
                weight: 1,
              });
            }}
            onEachFeature={(feature, layer) => {
              const p = feature.properties;
              const popup = `
                <b>Chip:</b> ${p.chipId} <br />
                <b>Status:</b> ${p.success ? 'Online' : 'Offline (Falha no GPS)'} <br />
                <b>Hora:</b> ${new Date(p.timestamp).toLocaleTimeString()}${p.errorMessage ? `<br/><span style="color:red"><b>Erro:</b> ${p.errorMessage}</span>` : ''}
              `;
              layer.bindPopup(popup);
            }}
          />
        )}

        {/* 2. Renderiza os "carimbos" de sinal perdido (sem mudanças) */}
        {offlineEvents.map((ponto, index) => (
          <CircleMarker
            key={`offline-${index}`}
            center={[ponto.lat, ponto.lng]}
            radius={12} 
            pathOptions={{
              color: '#dc3545', 
              fillColor: '#dc3545',
              fillOpacity: 0.1, 
              weight: 5, 
            }}
          >
            <Popup>
              <b>SINAL PERDIDO (REDE)</b><br />
              <b>Chip:</b> {ponto.chipId} <br />
              <b>Último sinal às:</b> {new Date(ponto.timestamp).toLocaleTimeString()}
            </Popup>
          </CircleMarker>
        ))}

      </MapContainer>
      
    </div>
  );
}

export default App;