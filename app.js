const https = require('https');
const http = require('http');

const url1 = 'https://isaliveevolutionapi.onrender.com';//'https://evolution-api-v2-2-3-4vxf.onrender.com';
const url2 = 'https://evolution-api-v2-2-3-4vxf.onrender.com';//'https://evolution-api-v2-2-3-4vxf.onrender.com';
const porta = 80;
let ultimaResposta = 'Ainda sem resposta da API externa.';
let getRandomInteger = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
let timeoutId = null;

if (!global.isStarted) {
  // Cria o servidor HTTP local
  const servidor = http.createServer((req, res) => {    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(global.ultimaResposta);
  });

  servidor.listen(porta, () => {
    console.log(`Servidor HTTPS rodando em http://localhost:${porta}`);
  });
  
  global.isStarted = true;
}

let timeout = getRandomInteger(30000, 50000);


function fazerRequisicaoGet(paramUrl) {
  if (global.timeoutId)
    clearTimeout(global.timeoutId);
  
  https.get(paramUrl, (res) => {
    let dados = '';

    res.on('data', (chunk) => {
      dados += chunk;
    });

    res.on('end', () => {
      global.ultimaResposta = dados;
      console.log(`[${new Date().toISOString()}] Resposta recebida:`, dados);
    });
  }).on('error', (err) => {
    global.ultimaResposta = `Erro: ${err.message}`;
    console.error(`[${new Date().toISOString()}] Erro na requisição:`, err.message);
  });

  console.log(`Próxima requisição em ${timeout/1000}s [Agora: ${new Date().toISOString()} | ${new Date((new Date().getTime() + timeout)).toISOString()}]`)
}

global.timeoutId = setTimeout(function(){
  fazerRequisicoes();
}, timeout);

let fazerRequisicoes = function(){
  fazerRequisicaoGet(url1);
  fazerRequisicaoGet(url2);
};
