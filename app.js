const https = require('https');
const http = require('http');

const url = 'https://isaliveevolutionapi.onrender.com';//'https://evolution-api-v2-2-3-4vxf.onrender.com';
const porta = 80;
let ultimaResposta = 'Ainda sem resposta da API externa.';
let getRandomInteger = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

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

  let timeout = getRandomInteger(30000, 50000);
  console.log(`Próxima requisição em ${timeout/1000}s [Agora: ${new Date().toISOString()} | ${new Date((new Date().getTime() + timeout)).toISOString()}]`)
  setTimeout(fazerRequisicao, timeout);
}

fazerRequisicao();

// Cria o servidor HTTP local
//const servidor = http.createServer((req, res) => {
//  res.writeHead(200, { 'Content-Type': 'application/json' });
//  res.end(ultimaResposta);
//});

//servidor.listen(porta, () => {
//  console.log(`Servidor HTTP rodando em http://localhost:${porta}`);
//});
