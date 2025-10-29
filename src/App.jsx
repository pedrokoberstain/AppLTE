// gefron-central/src/App.jsx

import React, { useState } from 'react';
import { sendPingCommand } from './services/dbService'; // Importa a função do serviço
import './App.css'; // Mantenha, se existir

function App() {
  const [chipId, setChipId] = useState('GEF-001');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePing = async () => {
    if (!chipId) return;

    setLoading(true);
    setMessage(`Enviando PING para ${chipId}...`);
    setIsSuccess(false);

    // CHAMADA AO FIREBASE REALTIME DATABASE
    const success = await sendPingCommand(chipId);

    if (success) {
      setMessage(`✅ PING enviado. Verifique o nó "comandos/${chipId}" no Firebase.`);
      setIsSuccess(true);
    } else {
      setMessage(`❌ Erro ao enviar PING. Verifique suas credenciais e permissões.`);
      setIsSuccess(false);
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>GEFRON LTE - Teste de cobertura</h1>
      <p>Teste de Escrita no Banco de Dados (Simulação do PING)</p>

      <div style={{ marginBottom: '10px' }}>
        <input 
          type="text" 
          value={chipId} 
          onChange={(e) => setChipId(e.target.value)} 
          placeholder="Digite o Chip ID (ex: GEF-001)"
          disabled={loading}
        />
        
        <button 
          onClick={handlePing} 
          disabled={loading || !chipId}
          style={{ marginLeft: '10px' }}
        >
          {loading ? 'Enviando...' : 'Enviar Comando PING'}
        </button>
      </div>

      {message && (
        <p style={{ marginTop: '10px', color: isSuccess ? 'green' : 'red' }}>
          {message}
        </p>
      )}
    </div>
  );
}

export default App;