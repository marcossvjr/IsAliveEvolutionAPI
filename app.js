const https = require('https');
const http = require('http');

// URLs
const url1 = 'https://isaliveevolutionapi.onrender.com';
const url2 = process.env.EVOLUTION_SERVICE_URL;

// Configurações
const CONFIG = {
  porta: Number(process.env.PORT || 80),

  // Intervalo entre requisições (ms)
  intervaloMinimo: 30000,
  intervaloMaximo: 55000,

  // Janela em que as requisições ficam suspensas
  horarioInicioBloqueio: process.env.HORARIO_INICIO_BLOQUEIO || '19:00',
  horarioFimBloqueio: process.env.HORARIO_FIM_BLOQUEIO || '08:00',

  // Frequência de verificação durante o bloqueio (ms)
  intervaloVerificacao: 60000
};

global.ultimaResposta = 'Ainda sem resposta da API externa.';

function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Converte HH:mm em minutos desde meia-noite
function converterHorarioParaMinutos(horario) {
  const partes = horario.split(':');

  if (partes.length !== 2) {
    throw new Error(`Horário inválido: ${horario}`);
  }

  const [hora, minuto] = partes.map(Number);

  if (
    !Number.isInteger(hora) ||
    !Number.isInteger(minuto) ||
    hora < 0 || hora > 23 ||
    minuto < 0 || minuto > 59
  ) {
    throw new Error(`Horário inválido: ${horario}`);
  }

  return hora * 60 + minuto;
}

const inicioBloqueio = converterHorarioParaMinutos(
  CONFIG.horarioInicioBloqueio
);

const fimBloqueio = converterHorarioParaMinutos(
  CONFIG.horarioFimBloqueio
);

// Verifica se o horário atual está dentro da janela de bloqueio
function estaNoHorarioBloqueado() {
  const agora = new Date();
  const minutosAtuais = agora.getHours() * 60 + agora.getMinutes();

  // Mesmo dia: exemplo 00:15 até 06:00
  if (inicioBloqueio < fimBloqueio) {
    return minutosAtuais >= inicioBloqueio &&
           minutosAtuais < fimBloqueio;
  }

  // Atravessa a meia-noite: exemplo 22:00 até 06:00
  if (inicioBloqueio > fimBloqueio) {
    return minutosAtuais >= inicioBloqueio ||
           minutosAtuais < fimBloqueio;
  }

  // Horários iguais: bloqueio desabilitado
  return false;
}

// Servidor HTTP local
if (!global.isStarted) {
  const servidor = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(global.ultimaResposta);
  });

  servidor.listen(CONFIG.porta, () => {
    console.log(`Servidor rodando em http://localhost:${CONFIG.porta}`);
  });

  global.isStarted = true;
}

// Executa requisição GET
function fazerRequisicaoGet(paramUrl) {
  if (!paramUrl) return;

  https.get(paramUrl, (res) => {
    let dados = '';

    res.on('data', (chunk) => {
      dados += chunk;
    });

    res.on('end', () => {
      global.ultimaResposta = dados;

      console.log(
        `[${new Date().toISOString()}] Resposta recebida:`,
        dados
      );
    });
  }).on('error', (err) => {
    global.ultimaResposta = `Erro: ${err.message}`;

    console.error(
      `[${new Date().toISOString()}] Erro na requisição:`,
      err.message
    );
  });
}

// Loop principal
function fazerRequisicoes() {
  if (global.timeoutId) {
    clearTimeout(global.timeoutId);
    global.timeoutId = null;
  }

  // Verifica se está dentro do horário bloqueado
  if (estaNoHorarioBloqueado()) {
    console.log(
      `[${new Date().toISOString()}] Requisições suspensas. ` +
      `Janela: ${CONFIG.horarioInicioBloqueio} até ${CONFIG.horarioFimBloqueio}`
    );

    // Continua o loop, mas sem realizar requisições
    global.timeoutId = setTimeout(
      fazerRequisicoes,
      CONFIG.intervaloVerificacao
    );

    return;
  }

  const timeout = getRandomInteger(
    CONFIG.intervaloMinimo,
    CONFIG.intervaloMaximo
  );

  fazerRequisicaoGet(url1);
  fazerRequisicaoGet(url2);

  console.log(
    `Próxima requisição em ${timeout / 1000}s ` +
    `[Agora: ${new Date().toISOString()}]`
  );

  global.timeoutId = setTimeout(fazerRequisicoes, timeout);
}

// Inicialização
fazerRequisicoes();
