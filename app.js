const https = require('https');
const intervaloConsulta = 30000;
const url = 'https://evolution-api-v2-2-3-4vxf.onrender.com'; // Substitua pela URL desejada

function fazerRequisicao() {
  https.get(url, (res) => {
    let dados = '';

    res.on('data', (chunk) => {
      dados += chunk;
    });

    res.on('end', () => {
      console.log(`[${new Date().toISOString()}] Resposta recebida:`, dados);
    });
  }).on('error', (err) => {
    console.error(`[${new Date().toISOString()}] Erro na requisição:`, err.message);
  });
}

// Executa a primeira vez imediatamente
fazerRequisicao();

// Executa a cada 30 segundos (30.000 milissegundos)
setInterval(fazerRequisicao, intervaloConsulta);
