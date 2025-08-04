const https = require('https');
const http = require('http');

const intervaloConsulta = 30000;
const url = 'https://evolution-api-v2-2-3-4vxf.onrender.com';
const porta = 80;

let ultimaResposta = 'Ainda sem resposta da API externa.';

// Função que faz a requisição GET
function fazerRequisicao() {
  https.get(url, (res) => {
    let dados = '';

    res.on('data', (chunk) => {
      dados += chunk;
    });

    res.on('end', () => {
      ultimaResposta = dados;
      console.log(`[${new Date().toISOString()}] Resposta recebida:`, dados);
    });
  }).on('error', (err) => {
    ultimaResposta = `Erro: ${err.message}`;
    console.error(`[${new Date().toISOString()}] Erro na requisição:`, err.message);
  });
}

// Executa imediatamente e a cada 30 segundos
fazerRequisicao();
setInterval(fazerRequisicao, intervaloConsulta);

// Cria o servidor HTTP local
const servidor = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(ultimaResposta);
});

servidor.listen(porta, () => {
  console.log(`Servidor HTTP rodando em http://localhost:${porta}`);
});
