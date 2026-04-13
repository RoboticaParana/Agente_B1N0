function atualizarPopup() {
  // Obtém a versão diretamente do manifest.json
  const manifestData = chrome.runtime.getManifest();
  document.getElementById('versaoAgente').innerText = `v${manifestData.version}`;

  chrome.storage.local.get({ logs: [] }, (res) => {
    const container = document.getElementById('logContainer');
    if (res.logs.length === 0) {
      container.innerHTML = "<p style='font-size:12px;'>Nenhum log registrado ainda.</p>";
      return;
    }

    container.innerHTML = res.logs.reverse().map(log => `
      <div class="log-item">
        <span class="data">${log.data}</span>
        <span class="evento">${log.evento}</span>
        Placa: <span class="placa">${log.placa}</span><br>
        ID: <strong>${log.serial}</strong>
        <div class="ips">IP Pub: ${log.ip_publico} | Local: ${log.ip_local}</div>
      </div>
    `).join('');
  });
}

document.addEventListener('DOMContentLoaded', atualizarPopup);