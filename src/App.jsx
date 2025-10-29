// gefron-central/src/App.jsx

import React, { useState, useEffect } from 'react';
// --- CORREÇÃO AQUI ---
// O seu firebaseConfig.js original parecia estar na raiz 'src/', não em 'src/services/'
import { db } from './firebaseConfig'; 
import { ref, onValue } from 'firebase/database';

// --- Importações do Mapa ---
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; 

// --- Importações de Estilo e Logo ---
import './App.css'; 
import logoGefron from './assets/gefron-logo.jpg'; 

// Importações para os ícones do mapa
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'; 
import 'leaflet-defaulticon-compatibility';

function App() {
  const [pontos, setPontos] = useState([]);
  const [mapCenter, setMapCenter] = useState([-15.793889, -47.882778]); 

  useEffect(() => {
    const historicoRef = ref(db, 'historico_localizacoes/'); // ATENÇÃO AQUI

    const listener = onValue(historicoRef, (snapshot) => {
      // (O resto do seu código useEffect está aqui...)
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
          ponto.chipId = chipId;
          ponto.id = pontoId;
          if (ponto.lat && ponto.lng) {
            listaDePontos.push(ponto);
          }
        });
      });

      setPontos(listaDePontos);

      if (listaDePontos.length > 0) {
        const ultimoPonto = listaDePontos[listaDePontos.length - 1];
        setMapCenter([ultimoPonto.lat, ultimoPonto.lng]);
      }
    });

    return () => { listener(); };
  }, []); 

  return (
    <div className="app-container">
      <header className="header">
        <img 
          src={logoGefron} 
          alt="Logo GEFRON" 
          className="logo-gefron" 
        />
        <h1 className="header-title">GEFRON LTE - Mapa de Cobertura</h1>
      </header>
      
      <MapContainer 
        center={mapCenter} 
        zoom={13} 
        className="map-container-leaflet" 
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {pontos.map((ponto) => (
          <CircleMarker
            key={ponto.id}
            center={[ponto.lat, ponto.lng]}
            radius={8}
            pathOptions={{ 
              color: ponto.success ? 'green' : 'red', 
              fillColor: ponto.success ? '#28a745' : '#dc3545',
              fillOpacity: 0.8
            }}
          >
            <Popup>
              <b>Chip:</b> {ponto.chipId} <br />
              <b>Status:</b> {ponto.success ? 'Online' : 'Offline'} <br />
              <b>Precisão:</b> {ponto.precisao ? ponto.precisao.toFixed(1) + 'm' : 'N/A'} <br />
              <b>Hora:</b> {new Date(ponto.timestamp).toLocaleTimeString()} <br />
              {ponto.errorMessage && (
                <span style={{ color: 'red' }}><b>Erro:</b> {ponto.errorMessage}</span>
              )}
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}

export default App;

