async function registrar(plataforma) {
  setTimeout(async () => {
    let placa = "Modelo não capturado";
    const host = window.location.hostname;

    try {
      // Busca da placa (Lógica que funcionou no Windows)
      const termos = ["ARDUINO", "UNO", "NANO", "CYBERPI", "MBOT", "ESP32"];
      const elementos = Array.from(document.querySelectorAll('span, div, b, p, li, [title]'));
      let encontrado = elementos.find(el => {
        const txt = (el.innerText || el.title || "").toUpperCase();
        return termos.some(t => txt.includes(t)) && txt.length < 25;
      });
      if (encontrado) placa = (encontrado.innerText || encontrado.title).replace('×', '').split('\n')[0].trim();

      const novoLog = {
        id: Date.now(),
        data: new Date().toLocaleString('pt-BR'),
        evento: `UPLOAD (${plataforma})`,
        placa: placa,
        ip: "Tentando...", 
        local: "Tentando..."
      };

      chrome.storage.local.get({ logs: [] }, (res) => {
        const lista = [...(res.logs || []), novoLog];
        chrome.storage.local.set({ logs: lista.slice(-100) }, async () => {
          try {
            // No Chromebook, o fetch direto do content script pode ser bloqueado por CSP
            // Tentamos uma chamada simples. Se falhar, o aluno precisa clicar em "Permitir" no ícone
            const r = await fetch('https://ipapi.co/json/', { mode: 'cors' });
            const d = await r.json();
            
            chrome.storage.local.get({ logs: [] }, (res2) => {
              let l2 = res2.logs;
              let i = l2.findIndex(x => x.id === novoLog.id);
              if (i !== -1) {
                l2[i].ip = d.ip || "Privado";
                l2[i].local = `${d.city}, ${d.country_code}`;
                chrome.storage.local.set({ logs: l2 });
              }
            });
          } catch (e) {
            console.log("Erro de rede: Certifique-se de que a extensão tem permissão de Host.");
          }
        });
      });
    } catch (err) { console.log("Erro de contexto."); }
  }, 800); 
}

document.addEventListener('click', (e) => {
  const el = e.target;
  const btn = el.closest('button') || el.closest('[class*="button"]') || el.closest('[role="button"]');
  const txt = (el.innerText || (btn ? btn.innerText : "") || el.title || "").toUpperCase();
  if (window.location.hostname.includes("arduino.cc") && (txt.includes("UPLOAD") || txt.includes("CARREGAR"))) {
    registrar("Arduino Cloud");
  } else if (window.location.hostname.includes("mblock.cc") && (txt.includes("CARREGAR") || txt.includes("UPLOAD") || txt.includes("CÓDIGO"))) {
    registrar("mBlock");
  }
}, true);