// gefron-central/src/services/dbService.js

import { db } from "../firebaseConfig";
import { ref, set, serverTimestamp } from "firebase/database"; 

/**
 * Envia o comando "PING" para um celular específico no Realtime Database.
 * @param {string} chipId - O ID do chip do celular alvo (ex: 'GEF-001').
 */
export const sendPingCommand = async (chipId) => {
  if (!chipId) {
    console.error("O Chip ID é obrigatório para enviar o comando.");
    return false;
  }

  // Define o caminho no Firebase: /comandos/{chipId}
  const commandRef = ref(db, `comandos/${chipId}`);

  try {
    // Grava o objeto de comando no RTDB
    await set(commandRef, {
      solicitacao: "ping",
      timestamp: serverTimestamp(), // Usa o tempo do servidor para precisão
      status: "enviado"
    });

    console.log(`Comando PING enviado com sucesso para ${chipId}.`);
    return true;
  } catch (error) {
    console.error("Erro ao enviar comando para o Firebase:", error);
    return false;
  }
};