let estaProcessando = false;

// Função para enviar os dados para o Google Apps Script
async function enviarParaPlanilha(dados) {
  const URL_SCRIPT = CONFIG.URL_PLANILHA;
  if (!URL_SCRIPT || URL_SCRIPT.includes("SUA_URL")) return;
  try {
    await fetch(URL_SCRIPT, {
      method: 'POST',
      mode: 'no-cors', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });
  } catch (error) { console.error("Erro no envio:", error); }
}

// Função para capturar o IP Local (WebRTC)
async function obterIPLocal() {
  return new Promise((resolve) => {
    const pc = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] });
    pc.createDataChannel("");
    pc.createOffer().then(o => pc.setLocalDescription(o));
    pc.onicecandidate = (e) => {
      if (e.candidate && e.candidate.candidate) {
        const match = /([0-9]{1,3}(\.[0-9]{1,3}){3})/.exec(e.candidate.candidate);
        if (match) { resolve(match[1]); pc.close(); }
      }
    };
    setTimeout(() => resolve("Protegido"), 1000);
  });
}

// Função principal de registro de eventos
async function registrar(plataforma, acaoBase) {
  if (estaProcessando) return;
  estaProcessando = true;

  chrome.runtime.sendMessage({ action: "getDeviceSerial" }, async (response) => {
    const serialRaw = response?.serial || "ID-FALHOU";
    const ipInterno = await obterIPLocal();
    const ua = navigator.userAgent.toLowerCase();
    const sistemaSO = ua.includes("win") ? "Windows" : (ua.includes("cros") ? "Chromebook" : "Linux");

    const eventoFormatado = `${acaoBase} via ${plataforma} (${sistemaSO})`;

    setTimeout(async () => {
      let placa = "Não identificada";
      const host = window.location.hostname;

      if (host.includes("arduino.cc")) {
        const elementos = document.querySelectorAll('[class*="board-name"], [class*="DevicePicker_label"], .arduino-device-picker__label');
        let nomeEncontrado = "";
        for (let el of elementos) {
          let texto = el.innerText.trim();
          if (texto !== "") {
            nomeEncontrado = texto.split('\n')[0].trim();
            break; 
          }
        }
        if (nomeEncontrado) {
            const palavras = nomeEncontrado.split(/\s+/);
            const metade = Math.floor(palavras.length / 2);
            if (palavras.length >= 2 && palavras.slice(0, metade).join(' ') === palavras.slice(metade).join(' ')) {
                placa = palavras.slice(0, metade).join(' ');
            } else {
                placa = nomeEncontrado;
            }
        }
        if (!nomeEncontrado || placa.toLowerCase().includes("select") || placa.toLowerCase().includes("no device")) {
            placa = "Arduino Uno"; 
        }
      } else {
        const elAtivo = document.querySelector('[class*="selected"] [class*="name"], [class*="active"] [class*="name"]');
        placa = elAtivo ? elAtivo.innerText.split('\n')[0].trim() : "mBlock Device";
      }

      const novoLog = {
        id: Date.now(),
        data: new Date().toLocaleString('pt-BR'),
        evento: eventoFormatado,
        placa: placa,
        serial: serialRaw,
        ip_publico: "Buscando...",
        ip_local: ipInterno
      };

      try {
        const r = await fetch('https://api.ipify.org?format=json');
        const d = await r.json();
        novoLog.ip_publico = d.ip;
      } catch (e) { novoLog.ip_publico = "Rede Restrita"; }

      enviarParaPlanilha(novoLog);
      setTimeout(() => { estaProcessando = false; }, 3000);
    }, 1200);
  });
}

// Ouvinte de Cliques Global
document.addEventListener('click', (e) => {
  const el = e.target.closest('button, [role="button"], a, div[class*="button"]') || e.target;
  const txt = (el.innerText || el.title || "").toUpperCase().trim();
  const host = window.location.hostname;

  if (host.includes("arduino.cc")) {
    // Arduino Cloud (Português e Inglês)
    if (txt.includes("UPLOAD") || txt.includes("CARREGAR")) {
      registrar("Arduino Cloud", "UPLOAD");
    }
  } else if (host.includes("mblock.cc")) {
    // mBlock Web (Português e Inglês)
    const matchesUpload = txt.includes("CARREGAR CÓDIGO") || 
                          txt.includes("UPLOAD CODE") || 
                          txt === "UPLOAD" || 
                          txt === "CARREGAR";

    const matchesFirmware = txt.includes("ATUALIZAR") || 
                            txt.includes("UPDATE") || 
                            txt.includes("FIRMWARE");

    if (matchesFirmware) {
      registrar("mBlock Web", "FIRMWARE");
    } else if (matchesUpload) {
      // Bloqueia se for o botão de alternar modo (Switch de modo ao vivo)
      if (txt === "CARREGAR" && e.target.closest('[class*="switch"]')) return;
      registrar("mBlock Web", "UPLOAD");
    }
  }
}, true);