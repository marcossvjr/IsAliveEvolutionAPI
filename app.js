const https = require('https');
const http = require('http');

const url1 = 'https://isaliveevolutionapi.onrender.com';//'https://evolution-api-v2-2-3-4vxf.onrender.com';
const url2 = 'https://evolution-api-v2-2-3-4vxf.onrender.com';//'https://evolution-api-v2-2-3-4vxf.onrender.com';
const porta = 443;
let ultimaResposta = 'Ainda sem resposta da API externa.';
let getRandomInteger = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
let timeoutId = null;

if (!global.isStarted) {
  // Cria o servidor HTTP local
  const servidor = https.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(ultimaResposta);
  });
  
  servidor.listen(porta, () => {
    console.log(`Servidor HTTPS rodando em https://localhost:${porta}`);
  });
  
  global.isStarted = true;
}
// Função que faz a requisição GET
function fazerRequisicao(paramUrl) {
  if (timeoutId)
    clearTimeout(timeoutId);
  
  https.get(paramUrl, (res) => {
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

  let timeout = getRandomInteger(30000, 50000);
  console.log(`Próxima requisição em ${timeout/1000}s [Agora: ${new Date().toISOString()} | ${new Date((new Date().getTime() + timeout)).toISOString()}]`)
  timeoutId = setTimeout(fazerRequisicao, timeout);
}

fazerRequisicao(url1);
fazerRequisicao(url2);
