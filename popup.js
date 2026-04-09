function render() {
  chrome.storage.local.get({ logs: [] }, (res) => {
    const div = document.getElementById('lista');
    if (!res.logs || res.logs.length === 0) {
      div.innerHTML = "<p style='text-align:center; color:#999;'>Sem atividades registadas.</p>";
      return;
    }

    div.innerHTML = res.logs.slice().reverse().map(l => {
      const isMblock = l.evento.includes("mBlock");
      return `
        <div class="card ${isMblock ? 'mblock' : ''}">
          <div class="meta">
            <span class="time">${l.data.split(' ')[1]}</span>
            <span class="placa">${l.placa}</span>
          </div>
          <span class="info"><b>Sistema:</b> ${l.evento}</span>
          <span class="info"><b>IP:</b> ${l.ip}</span>
          <span class="info"><b>Local:</b> ${l.local}</span>
        </div>
      `;
    }).join('');
  });
}

document.getElementById('btnLimpar').addEventListener('click', () => {
  if (confirm("Apagar todo o histórico?")) {
    chrome.storage.local.set({ logs: [] }, render);
  }
});

document.addEventListener('DOMContentLoaded', render);
setInterval(render, 2000);