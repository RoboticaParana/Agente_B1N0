chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getDeviceSerial") {
    const isChromeOS = /\bCrOS\b/.test(navigator.userAgent);

    // Tenta obter o Serial institucional em Chromebooks gerenciados
    if (isChromeOS && chrome.enterprise && chrome.enterprise.deviceAttributes) {
      chrome.enterprise.deviceAttributes.getDeviceSerialNumber((serial) => {
        sendResponse({ serial: serial ? "CB-" + serial : "CB-DESCONHECIDO" });
      });
      return true; 
    } else {
      // Identificação para Windows, Linux ou ChromeOS pessoal
      const ua = navigator.userAgent.toLowerCase();
      let prefixo = ua.includes("win") ? "WIN-" : (isChromeOS ? "CB-" : "LIN-");
      
      chrome.storage.local.get(['seed_id'], (res) => {
        if (res.seed_id && res.seed_id.startsWith(prefixo)) {
          sendResponse({ serial: res.seed_id });
        } else {
          // Gera um ID aleatório persistente de 6 caracteres
          const novoId = prefixo + Math.random().toString(36).substring(2, 8).toUpperCase();
          chrome.storage.local.set({ seed_id: novoId }, () => {
            sendResponse({ serial: novoId });
          });
        }
      });
      return true;
    }
  }
});