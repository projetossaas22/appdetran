/**
 * DetranQuiz — data.js
 * Método Gabarita Detran
 * Banco de questões organizado por módulo
 * Baseado nos temas mais cobrados no DETRAN 2025/2026
 * Total: 60 questões → Simulado usa 52
 */

const MODULES = [
  {
    id: 'legislacao',
    name: 'Legislação e CTB',
    icon: '\ud83d\udcdc',
    iconImg: 'images/icons/07-livro-legislacao.png',
    color: '#4A9EFF',
    description: 'Código de Trânsito Brasileiro e normas de circulação'
  },
  {
    id: 'placas',
    name: 'Placas e Sinais',
    icon: '\ud83d\udea6',
    iconImg: 'images/icons/08-placa-sinalizacao.png',
    color: '#22D45A',
    description: 'Regulamentação, advertência e indicação'
  },
  {
    id: 'infracoes',
    name: 'Infrações e Multas',
    icon: '⚠️',
    iconImg: 'images/placas/05-r7-proibido-ultrapassar.png',
    color: '#FFD700',
    description: 'Classificação, pontos e penalidades'
  },
  {
    id: 'direcao',
    name: 'Direção Defensiva',
    icon: '\ud83d\udee1️',
    iconImg: 'images/icons/06-escudo-check.png',
    color: '#FF6B00',
    description: 'Técnicas para evitar acidentes'
  },
  {
    id: 'primeiros_socorros',
    name: 'Primeiros Socorros',
    icon: '\ud83d\ude91',
    iconImg: 'images/icons/09-cruz-primeiros-socorros.png',
    color: '#FF4545',
    description: 'Procedimentos em caso de acidente'
  },
  {
    id: 'mecanica',
    name: 'Mecânica Básica',
    icon: '\ud83d\udd27',
    iconImg: 'images/icons/10-chave-engrenagem.png',
    color: '#A855F7',
    description: 'Manutenção preventiva e noções do veículo'
  }
];

const QUESTIONS = {
  legislacao: [
    {
      id: 'leg01',
      text: 'Onde não existir sinalização regulamentadora, qual a velocidade máxima permitida para automóveis em rodovias de pista dupla?',
      options: ['80 km/h', '90 km/h', '100 km/h', '110 km/h'],
      correct: 3,
      explanation: '✅ Conforme o Art. 61, § 1º, II, "a" do CTB: Onde NÃO existir sinalização regulamentadora, a velocidade máxima nas rodovias de PISTA DUPLA é de 110 km/h para automóveis, camionetas, caminhonetes e motocicletas (e 90 km/h para os demais veículos). Já nas rodovias de PISTA SIMPLES, o limite para esses mesmos veículos é de 100 km/h.'
    },
    {
      id: 'leg02',
      text: 'O motorista que dirigir sob efeito de álcool com resultado positivo acima do limite legal está sujeito à:',
      options: [
        'Multa leve e advertência',
        'Suspensão imediata do direito de dirigir e multa gravíssima',
        'Apenas recolhimento do veículo',
        'Multa grave e 5 pontos na CNH'
      ],
      correct: 1,
      explanation: 'Dirigir sob influência de álcool é infração gravíssima (Art. 165 do CTB). O motorista tem a CNH recolhida, o carro retido, paga multa com fator multiplicador por 10 (R$ 2.934,70) e responde a processo de suspensão do direito de dirigir por 12 meses.'
    },
    {
      id: 'leg03',
      text: 'Segundo o CTB, em qual situação é PERMITIDO parar na faixa de pedestres?',
      options: [
        'Quando o semáforo estiver vermelho e não houver pedestres',
        'Em situação de emergência, como problema mecânico',
        'Nunca é permitido parar na faixa de pedestres',
        'Quando estiver chovendo muito e a visibilidade for baixa'
      ],
      correct: 2,
      explanation: 'É expressamente proibido parar o veículo sobre a faixa de pedestres, pois coloca em risco a segurança dos pedestres. O CTB não prevê exceções para esta regra.'
    },
    {
      id: 'leg04',
      text: 'Ao se aproximar de uma lombada eletrônica (radar de velocidade fixo), qual é a obrigação do motorista?',
      options: [
        'Reduzir a velocidade apenas se a luz estiver acesa',
        'Manter a velocidade estabelecida para a via em todo o percurso',
        'Somente reduzir logo antes do radar',
        'Ligar o pisca-alerta para avisar outros motoristas'
      ],
      correct: 1,
      explanation: 'O motorista deve respeitar os limites de velocidade da via em todo o percurso, não apenas nos pontos com radar. Reduzir apenas na lombada e acelerar depois é infração de trânsito e comportamento perigoso.'
    },
    {
      id: 'leg05',
      text: 'Ao estacionar um veículo junto a uma esquina, qual é a distância mínima que deve ser mantida em relação ao bordo do alinhamento da via transversal?',
      options: ['1 metro', '3 metros', '5 metros', '10 metros'],
      correct: 2,
      explanation: '✅ Conforme o Art. 181, I do CTB, é proibido estacionar o veículo nas esquinas e a menos de 5 metros do bordo do alinhamento da via transversal. Essa infração é de natureza MÉDIA (4 pontos) com penalidade de multa e remoção do veículo.'
    },
    {
      id: 'leg06',
      text: 'Em uma interseção sem sinalização, dois veículos se aproximam de lados diferentes. Quem tem preferência?',
      options: [
        'O veículo mais pesado',
        'O veículo que chegar primeiro à interseção',
        'O veículo que estiver à direita',
        'O veículo que estiver em velocidade menor'
      ],
      correct: 2,
      explanation: '✅ Regra de Ouro do CTB (Art. 29, III, "c"): Em cruzamentos NÃO sinalizados, a preferência SEMPRE é do veículo que se aproxima pela DIREITA do condutor. Exceções onde a direita NÃO prevalece: 1) Rodovia (quem está na rodovia tem preferência); 2) Rotatória (quem já está circulando na rotatória tem preferência).'
    },
    {
      id: 'leg07',
      text: 'É obrigatório o uso de cinto de segurança:',
      options: [
        'Apenas no banco da frente',
        'Apenas em rodovias e estradas',
        'Em todos os bancos do veículo, em qualquer via',
        'Apenas quando a velocidade for superior a 60 km/h'
      ],
      correct: 2,
      explanation: 'O cinto de segurança é obrigatório para todos os ocupantes do veículo (motorista e passageiros) em qualquer banco e em qualquer tipo de via, seja urbana ou rural, conforme o CTB.'
    },
    {
      id: 'leg08',
      text: 'O que o CTB determina sobre o uso do celular ao volante?',
      options: [
        'É permitido se estiver em modo viva-voz',
        'É proibido de qualquer forma durante a condução do veículo',
        'É permitido se o veículo estiver parado no semáforo',
        'É proibido apenas em rodovias'
      ],
      correct: 1,
      explanation: 'É proibido usar o celular ao volante de qualquer forma — inclusive viva-voz, GPS no colo ou digitação. A única exceção é o uso com suporte fixo para GPS. A infração é gravíssima: multa de R$ 293,47 e 7 pontos na CNH.'
    },
    {
      id: 'leg09',
      text: 'Ultrapassar em local proibido é considerada infração de qual natureza?',
      options: ['Leve', 'Média', 'Grave', 'Gravíssima'],
      correct: 3,
      explanation: 'Ultrapassar em local proibido (como em curvas, lombadas, cruzamentos e próximo a escolas) é infração gravíssima, com multa elevada e pontuação máxima na CNH, por colocar vidas em risco.'
    },
    {
      id: 'leg10',
      text: 'De acordo com o CTB atualizado (Lei 14.071/20), o condutor que não cometer NENHUMA infração gravíssima no período de 12 meses terá a CNH suspensa ao atingir quantos pontos?',
      options: ['20 pontos', '30 pontos', '40 pontos', '50 pontos'],
      correct: 2,
      explanation: '✅ Conforme o Art. 261 do CTB (atualizado pela Lei 14.071/20): O limite para suspensão da CNH é de 40 pontos caso o condutor NÃO tenha nenhuma infração gravíssima; 30 pontos se constar 1 infração gravíssima; e 20 pontos caso constem 2 ou mais infrações gravíssimas.'
    },
    {
      id: 'leg11',
      text: 'O que é o "direito de passagem" (preferência) em vias de mão dupla?',
      options: [
        'O veículo que está em maior velocidade tem preferência',
        'Quem estiver em via de mão única tem preferência',
        'Quem estiver numa via com mais faixas tem preferência',
        'Quem estiver à direita tem preferência em interseções iguais'
      ],
      correct: 3,
      explanation: 'A regra básica do CTB para interseções sem sinalização é que o veículo que vem pela direita tem a preferência de passagem. Em rodovias, quem está na pista principal tem preferência sobre quem entra.'
    },
    {
      id: 'leg12',
      text: 'Onde não existir sinalização regulamentadora, qual a velocidade máxima permitida nas vias urbanas classificadas como LOCAIS?',
      options: ['30 km/h', '40 km/h', '50 km/h', '60 km/h'],
      correct: 0,
      explanation: '✅ Conforme o Art. 61, § 1º, I do CTB, onde NÃO houver sinalização, a velocidade máxima nas vias urbanas é: Vias Locais = 30 km/h; Vias Coletoras = 40 km/h; Vias Arteriais = 60 km/h; Vias de Trânsito Rápido = 80 km/h.'
    }
  ],

  placas: [
    {
      id: 'plc01',
      text: 'As placas de REGULAMENTAÇÃO têm como objetivo:',
      options: [
        'Alertar o motorista sobre condições perigosas da pista',
        'Informar sobre serviços e destinos disponíveis',
        'Estabelecer proibições, obrigações e restrições ao trânsito',
        'Indicar atrativos turísticos na região'
      ],
      correct: 2,
      explanation: 'Placas de regulamentação (bordas vermelhas, formato circular) impõem obrigações e proibições. Desrespeitá-las constitui infração de trânsito. Exemplos: PARE (R-1), velocidade máxima, proibido ultrapassar.'
    },
    {
      id: 'plc02',
      text: 'A placa de ADVERTÊNCIA (sinal de perigo) é reconhecida por qual característica principal?',
      options: [
        'Circular com borda vermelha e fundo branco',
        'Quadrada (losango), fundo amarelo e símbolo preto',
        'Retangular com fundo azul',
        'Octogonal com fundo vermelho'
      ],
      correct: 1,
      explanation: 'Placas de advertência têm formato de losango (quadrado virado na diagonal), fundo amarelo e símbolo em preto. Elas alertam o motorista sobre condições perigosas à frente, como curvas, lombadas e cruzamentos.'
    },
    {
      id: 'plc03',
      image: 'images/placas/01-r1-pare.png',
      text: 'A placa "PARE" (R-1) tem qual formato?',
      options: ['Circular', 'Triangular', 'Octogonal (8 lados)', 'Retangular'],
      correct: 2,
      explanation: '✅ A placa R-1 (Parada Obrigatória) é a ÚNICA placa de todo o trânsito brasileiro em formato OCTOGONAL (8 lados). O motivo técnico desse formato exclusivo é permitir que motoristas em sentido contrário a reconheçam mesmo vendo-a apenas de costas! Desobedecer a parada obrigatória é infração gravíssima (7 pontos).'
    },
    {
      id: 'plc04',
      text: 'Uma placa com fundo VERDE em uma rodovia indica:',
      options: [
        'Área de proteção ambiental',
        'Orientação de destino e distâncias',
        'Serviço de emergência médica à frente',
        'Velocidade máxima liberada'
      ],
      correct: 1,
      explanation: 'Placas com fundo verde nas rodovias são placas de indicação que orientam sobre destinos, distâncias e direções a seguir. Já fundo azul indica serviços (posto, hospital) e fundo marrom indica turismo.'
    },
    {
      id: 'plc05',
      image: 'images/placas/02-r2-preferencia.png',
      text: 'A placa "Dê a Preferência" (R-2) tem qual formato?',
      options: ['Circular com borda vermelha', 'Triangular com borda vermelha', 'Octogonal', 'Retangular azul'],
      correct: 1,
      explanation: '✅ A placa R-2 (Dê a Preferência) é a ÚNICA placa de regulamentação com formato TRIANGULAR (com vértice apontando para baixo). Assim como a placa PARE, seu formato único serve para identificação imediata até mesmo vista de trás. Não exige parada total se não houver veículos na via preferencial, mas exige redução de velocidade e preferência absoluta aos outros.'
    },
    {
      id: 'plc06',
      text: 'A placa de regulamentação R-6b, composta por um círculo de borda vermelha, fundo branco e a letra "E" preta, indica:',
      options: [
        'Estacionamento regulamentado',
        'Proibido estacionar',
        'Proibido parar e estacionar',
        'Ponto de parada de ônibus'
      ],
      correct: 0,
      explanation: '✅ A placa R-6b (Estacionamento Regulamentado) regulamenta o direito de estacionar na área sinalizada, podendo conter informações complementares de horário ou categoria de veículo. A placa com uma tarja diagonal vermelha (R-6a) proíbe o estacionamento, e com duas tarjas em "X" (R-6c) proíbe a parada e o estacionamento.'
    },
    {
      id: 'plc07',
      image: 'images/placas/07-a33a-area-escolar.png',
      text: 'Uma placa com fundo AMARELO e o símbolo de uma criança indica:',
      options: [
        'Proibido crianças neste trecho',
        'Escola ou área de recreação próxima — cuidado',
        'Parque infantil a 500 metros',
        'Zona de baixa velocidade permanente'
      ],
      correct: 1,
      explanation: 'Esta é uma placa de advertência (fundo amarelo, losango) que alerta sobre a presença de escola ou área de recreação próxima. O motorista deve redobrar a atenção e reduzir a velocidade.'
    },
    {
      id: 'plc08',
      text: 'A placa de advertência A-25, em formato de losango amarelo com duas setas verticais apontadas em sentidos opostos, alerta o condutor sobre:',
      options: [
        'Mão dupla adiante',
        'Sentido único de circulação',
        'Pista dividida',
        'Desvio obrigatório à direita'
      ],
      correct: 0,
      explanation: '✅ A placa A-25 (Mão Dupla Adiante) adverte que a via, até então de sentido único, passará a operar em mão dupla de direção à frente. O condutor deve se posicionar à direita e redobrar os cuidados.'
    },
    {
      id: 'plc09',
      text: 'A placa com fundo MARROM é usada para indicar:',
      options: [
        'Zonas de obras',
        'Atrativos turísticos e pontos de interesse cultural',
        'Área de floresta protegida',
        'Rodovias com taxa de pedágio'
      ],
      correct: 1,
      explanation: 'O fundo marrom nas placas de indicação é reservado para atrativos turísticos, como museus, pontos históricos, parques e praias. Isso facilita a identificação rápida pelo motorista.'
    },
    {
      id: 'plc10',
      image: 'images/placas/03-r3-sentido-proibido.png',
      text: 'A placa de regulamentação R-3, representada por um círculo com borda vermelha, fundo branco, uma seta preta apontada para cima cortada por uma faixa diagonal vermelha, indica:',
      options: [
        'Proibido ultrapassar',
        'Sentido proibido',
        'Velocidade reduzida à frente',
        'Proibido virar à esquerda'
      ],
      correct: 1,
      explanation: '✅ A placa R-3 (Sentido Proibido) proíbe o trânsito de qualquer veículo no sentido indicado pela seta. Entrar em via regulamentada com esta placa constitui infração GRAVÍSSIMA (7 pontos), com risco grave de colisão frontal.'
    },
    {
      id: 'plc11',
      text: 'As faixas de pedestre são pintadas em:',
      options: [
        'Amarelo, em todas as vias',
        'Branco, em vias urbanas e rodovias',
        'Vermelho, próximo a escolas',
        'A cor varia conforme o estado'
      ],
      correct: 1,
      explanation: 'As faixas de pedestres são sinalizadas horizontalmente em branco nas vias. O pedestre tem total preferência sobre os veículos nas faixas de pedestres, e o motorista que não ceder comete infração gravíssima.'
    },
    {
      id: 'plc12',
      text: 'O que é a linha contínua amarela no centro de uma pista de mão dupla?',
      options: [
        'Indica que a velocidade máxima é 80km/h naquele trecho',
        'Proíbe a ultrapassagem e a invasão da pista contrária',
        'Marca o limite para estacionamento lateral',
        'Indica que existe lombada eletrônica à frente'
      ],
      correct: 1,
      explanation: 'A linha longitudinal contínua amarela no centro da pista separa os sentidos opostos e indica que é PROIBIDO realizar ultrapassagem ou invadir a faixa contrária. Cruzá-la é infração gravíssima.'
    }
  ],

  infracoes: [
    {
      id: 'inf01',
      text: 'Como são classificadas as infrações de trânsito segundo o CTB?',
      options: [
        'Pequenas, médias, grandes e enormes',
        'Leves, médias, graves e gravíssimas',
        'Simples, duplas e agravadas',
        'Nível 1, Nível 2, Nível 3 e Nível 4'
      ],
      correct: 1,
      explanation: 'O CTB classifica as infrações em quatro categorias: Leve (3 pontos), Média (4 pontos), Grave (5 pontos) e Gravíssima (7 pontos). Cada categoria tem uma multa e pontuação específica na CNH.'
    },
    {
      id: 'inf02',
      text: 'Quantos pontos são adicionados à CNH por uma infração GRAVÍSSIMA?',
      options: ['3 pontos', '4 pontos', '5 pontos', '7 pontos'],
      correct: 3,
      explanation: 'Infrações gravíssimas valem 7 pontos na CNH. São exemplos: dirigir sob efeito de álcool, ultrapassar em local proibido, avançar sinal vermelho, disputar racha e manusear celular ao volante. (Lembrando: deixar de usar o cinto é infração GRAVE, com 5 pontos).'
    },
    {
      id: 'inf03',
      text: 'Avançar o sinal vermelho é considerada infração de qual natureza?',
      options: ['Leve', 'Média', 'Grave', 'Gravíssima'],
      correct: 3,
      explanation: 'Avançar sinal vermelho é infração GRAVÍSSIMA (7 pontos), pois coloca em risco direto a vida de outros motoristas e pedestres. A multa é elevada e pode levar à suspensão da CNH.'
    },
    {
      id: 'inf04',
      text: 'O que o CTB prevê para quem participa de "racha" (disputar corrida por espírito de emulação)?',
      options: [
        'Infração grave com 5 pontos',
        'Infração gravíssima com multa multiplicada por 10, suspensão da CNH e crime de trânsito',
        'Infração média apenas com advertência',
        'Infração leve em via com pouco trânsito'
      ],
      correct: 1,
      explanation: '✅ Conforme o Art. 173 do CTB, disputar racha é infração GRAVÍSSIMA, com multa multiplicada por 10 (R$ 2.934,70), suspensão do direito de dirigir e remoção do veículo. Além disso, configura CRIME DE TRÂNSITO previsto no Art. 308 do CTB.'
    },
    {
      id: 'inf05',
      text: 'Deixar o condutor ou passageiro de usar o cinto de segurança é infração de qual natureza?',
      options: ['Leve (3 pontos)', 'Média (4 pontos)', 'Grave (5 pontos)', 'Gravíssima (7 pontos)'],
      correct: 2,
      explanation: '✅ Resposta correta: GRAVE (5 pontos). Conforme o Art. 167 do CTB, deixar de usar o cinto de segurança é infração GRAVE, sujeita a multa de R$ 195,23 e retenção do veículo até a colocação do cinto. ⚠️ ATENÇÃO À PEGADINHA: Muitos candidatos erram marcando "Gravíssima" por achar que envolve risco de vida, mas a classificação legal do CTB é expressamente GRAVE.'
    },
    {
      id: 'inf06',
      text: 'Qual é a penalidade para quem for pego dirigindo sem CNH (carteira de habilitação)?',
      options: [
        'Multa leve e advertência',
        'Infração grave com 5 pontos na CNH de outro condutor',
        'Infração gravíssima, multa, veículo recolhido e proibição de obter CNH por 2 anos',
        'Apenas recolhimento do veículo por 24 horas'
      ],
      correct: 2,
      explanation: 'Dirigir sem CNH é infração gravíssima. O veículo é recolhido ao pátio (depósito), a pessoa é multada, e ficará proibida de obter a habilitação pelo prazo de 2 anos. Se for habitual, pode responder criminalmente.'
    },
    {
      id: 'inf07',
      text: 'Quantos pontos na CNH levam à suspensão do direito de dirigir para um habilitado há mais de 1 ano?',
      options: ['20 pontos', '30 pontos', '40 pontos', '50 pontos'],
      correct: 2,
      explanation: 'Desde a reforma do CTB, habilitados há mais de 1 ano têm o limite de 40 pontos. Ao atingir, a CNH é suspensa. Porém, se cometer infração gravíssima, o limite cai para 30 pontos. Habilitados há menos de 1 ano têm limite de 20 pontos.'
    },
    {
      id: 'inf08',
      text: 'Estacionar em vaga reservada para idosos ou pessoas com deficiência sem o credenciamento é infração:',
      options: ['Leve', 'Média', 'Grave', 'Gravíssima com remoção do veículo'],
      correct: 3,
      explanation: '✅ Conforme o Art. 181, XX do CTB, estacionar nas vagas reservadas às pessoas com deficiência ou idosos, sem credencial que comprove tal condição, é infração GRAVÍSSIMA (7 pontos), com multa e medida administrativa de remoção do veículo.'
    },
    {
      id: 'inf09',
      text: 'O que acontece com os pontos na CNH após 12 meses?',
      options: [
        'Os pontos acumulam permanentemente',
        'Os pontos somem automaticamente após 12 meses da data da infração',
        'Os pontos somem após pagar a multa',
        'Os pontos são reduzidos pela metade a cada ano'
      ],
      correct: 1,
      explanation: 'Os pontos na CNH têm prazo de validade de 12 meses contados da data da infração. Após esse período, eles são eliminados automaticamente do registro, desde que a multa tenha sido paga ou passado o prazo de recurso.'
    },
    {
      id: 'inf10',
      text: 'Dirigir veículo com a Carteira Nacional de Habilitação (CNH) vencida há mais de 30 dias é:',
      options: [
        'Apenas uma irregularidade administrativa sem pontuação',
        'Infração média com advertência por escrito',
        'Infração gravíssima com multa, recolhimento da CNH e retenção do veículo',
        'Infração leve com prazo de mais 30 dias para regularizar'
      ],
      correct: 2,
      explanation: '✅ Resposta correta: Infração GRAVÍSSIMA (Art. 162, V do CTB). Dirigir com a CNH vencida há MAIS de 30 dias gera 7 pontos na carteira, multa de R$ 293,47, recolhimento do documento e retenção do veículo até a apresentação de condutor habilitado. ⚠️ PEGADINHA: Nos primeiros 30 dias corridos após o vencimento, ainda é tolerado dirigir sem multa para que você faça a renovação.'
    }
  ],

  direcao: [
    {
      id: 'dir01',
      text: 'O que é "direção defensiva"?',
      options: [
        'Dirigir devagar em todas as situações para evitar multas',
        'Técnica de condução que antecipa riscos e adota atitudes preventivas para evitar acidentes',
        'Usar sempre o freio de mão para segurança',
        'Evitar ultrapassagens em qualquer circunstância'
      ],
      correct: 1,
      explanation: 'Direção defensiva é a técnica de conduzir um veículo identificando e prevendo perigos com antecedência, tomando atitudes corretas e preventivas para evitar acidentes, mesmo que o erro seja do outro motorista.'
    },
    {
      id: 'dir02',
      image: 'images/cenas/02-aquaplanagem.png',
      text: 'Em caso de aquaplanagem (pneu perdendo contato com o asfalto molhado), o correto é:',
      options: [
        'Frear com força total imediatamente',
        'Girar o volante bruscamente para manter o controle',
        'Soltar o acelerador gradualmente, sem frear bruscamente, e manter o volante firme',
        'Ligar o freio de mão para reduzir a velocidade rapidamente'
      ],
      correct: 2,
      explanation: '✅ Regra Máxima de Direção Defensiva: Na aquaplanagem (pneu perde o contato com o asfalto devido à lâmina de água), NUNCA pise no freio e NUNCA gire o volante bruscamente! A atitude correta é: 1) Tirar suavemente o pé do acelerador; 2) Manter o volante reto e firme; 3) Aguardar o peso do carro romper a lâmina de água e recuperar a aderência. Frear bruscamente trava as rodas e causa capotamento imediato.'
    },
    {
      id: 'dir03',
      image: 'images/cenas/03-distancia-segura.png',
      text: 'Qual é a distância mínima de segurança recomendada em relação ao veículo à frente?',
      options: [
        '1 metro por 10 km/h de velocidade',
        '1 segundo de tempo de reação',
        'A distância percorrida em 2 a 3 segundos à velocidade atual',
        '5 metros independentemente da velocidade'
      ],
      correct: 2,
      explanation: 'A "regra dos 2 segundos" é a referência básica: escolha um ponto fixo e quando o veículo à frente passar por ele, você deve levar pelo menos 2 a 3 segundos para chegar ao mesmo ponto. Em chuva ou má visibilidade, aumente para 4+ segundos.'
    },
    {
      id: 'dir04',
      image: 'images/cenas/04-sono-ao-volante.png',
      text: 'O que é a "fadiga ao volante" e como ela afeta a condução?',
      options: [
        'Um aquecimento do motor que reduz a potência do veículo',
        'Estado de cansaço que compromete reflexos, concentração e tempo de reação do motorista',
        'Desgaste dos pneus que reduz a aderência',
        'Superaquecimento dos freios em descidas longas'
      ],
      correct: 1,
      explanation: 'Fadiga ao volante é extremamente perigosa — ela reduz reflexos, compromete julgamentos e pode causar o sono involuntário ("microsono"). Mais de 20% dos acidentes graves têm a fadiga como causa. A solução é parar, descansar e não "lutar" contra o sono.'
    },
    {
      id: 'dir05',
      image: 'images/cenas/07-farois-na-neblina.png',
      text: 'Em condições de neblina intensa, qual equipamento deve ser utilizado e qual deve ser EVITADO?',
      options: [
        'Usar farol alto; evitar farol baixo',
        'Usar farol de neblina (milha); evitar farol alto (que reflete na neblina)',
        'Usar pisca-alerta; evitar qualquer iluminação',
        'Usar farol alto e baixo simultaneamente'
      ],
      correct: 1,
      explanation: 'Em neblina, use o farol de neblina (milha) e o farol baixo. O farol ALTO deve ser evitado pois a luz se reflete na neblina e piora ainda mais a visibilidade. Se a neblina for muito densa, pare em local seguro e aguarde.'
    },
    {
      id: 'dir06',
      image: 'images/cenas/08-pontos-cegos.png',
      text: 'O que é o "ponto cego" no automóvel?',
      options: [
        'A área à frente do veículo não visível pelo motorista',
        'Região lateral/traseira não coberta pelos espelhos retrovisores',
        'O ponto de maior desgaste dos pneus',
        'A zona de maior risco em cruzamentos'
      ],
      correct: 1,
      explanation: 'O ponto cego é a área ao redor do veículo que não aparece nos espelhos retrovisores (nem lateral, nem central). Para verificá-lo, o motorista deve girar levemente a cabeça para o lado antes de mudar de faixa, além de regular corretamente os espelhos.'
    },
    {
      id: 'dir07',
      text: 'Ao fazer uma ultrapassagem, o motorista deve:',
      options: [
        'Ultrapassar rapidamente em qualquer trecho reto',
        'Certificar-se de que há espaço suficiente, sinalizar, verificar pontos cegos e retornar à faixa com segurança',
        'Buzinar para avisar o veículo à frente e então ultrapassar',
        'Apenas verificar o retrovisor central antes de ultrapassar'
      ],
      correct: 1,
      explanation: 'Uma ultrapassagem segura exige: verificar que não há proibição de ultrapassagem (placa ou linha dupla), acionar a seta, verificar ponto cego, garantir espaço suficiente na pista contrária, executar a manobra com velocidade adequada e retornar à faixa com segurança.'
    },
    {
      id: 'dir08',
      image: 'images/cenas/06-freio-motor.png',
      text: 'Em uma descida longa e íngreme, para preservar os freios e ter controle do veículo, o correto é:',
      options: [
        'Manter o pé no freio pressionado continuamente',
        'Usar apenas o freio de mão',
        'Reduzir a marcha (usar o motor como freio) e utilizar o freio de serviço em intervalos',
        'Desligar o motor para economizar combustível e frear mais'
      ],
      correct: 2,
      explanation: 'Em descidas longas, usar o freio continuamente superaquece as pastilhas e pode causar falha total nos freios ("fading"). O correto é usar uma marcha mais baixa para que o motor ajude a frear ("freio motor") e acionar o freio de serviço em intervalos curtos.'
    },
    {
      id: 'dir09',
      text: 'O que é "hidroplanagem" e como ocorre?',
      options: [
        'Quando o veículo derrapa em lama ou areia seca',
        'Quando os pneus perdem aderência por uma camada de água entre o pneu e a pista',
        'Falha no sistema de arrefecimento do motor em dias de chuva',
        'Quando os freios ficam encharcados e param de funcionar'
      ],
      correct: 1,
      explanation: 'Hidroplanagem (ou aquaplanagem) ocorre quando há uma camada de água entre o pneu e o asfalto, fazendo o pneu "flutuar" e o motorista perder o controle direcional e de frenagem. É mais comum com pneus carecas, velocidade alta e pista molhada.'
    },
    {
      id: 'dir10',
      text: 'Ao perceber que os freios falharam, qual é a sequência correta de ações?',
      options: [
        'Desligar o motor e abrir a porta',
        'Bombear o pedal do freio, acionar o freio de mão gradualmente e direcionar para área de escape ou atrito',
        'Apenas buzinar e torcer para que o caminho fique livre',
        'Mudar para marcha à ré imediatamente'
      ],
      correct: 1,
      explanation: 'Com falha nos freios: 1) Bombear o pedal repetidamente para tentar recuperar pressão; 2) Reduzir marcha para usar o freio do motor; 3) Acionar o freio de mão GRADUALMENTE (brusco pode causar trava e derrapagem); 4) Direcionar para borrachões, gramado ou outra saída de emergência.'
    }
  ],

  primeiros_socorros: [
    {
      id: 'ps01',
      image: 'images/cenas/05-acidente-sinalizacao-samu.png',
      text: 'Ao se deparar com uma vítima de acidente, qual é a PRIMEIRA ação recomendada?',
      options: [
        'Mover a vítima imediatamente para longe do veículo',
        'Garantir a segurança do local, sinalizar e acionar o socorro (192 SAMU, 193 Bombeiros ou 190 PM)',
        'Dar água para a vítima se ela estiver consciente',
        'Retirar o capacete da vítima de moto imediatamente'
      ],
      correct: 1,
      explanation: 'A prioridade é a segurança: sinalizar o local para evitar novos acidentes, manter distância segura e acionar o socorro profissional. Agir precipitadamente (como mover a vítima sem preparo) pode piorar lesões, especialmente na coluna.'
    },
    {
      id: 'ps02',
      text: 'Quando NÃO se deve remover uma vítima de acidente do local?',
      options: [
        'Quando ela estiver consciente e pedindo ajuda',
        'Quando houver risco de incêndio ou afogamento no local',
        'Quando a vítima não apresentar risco imediato de vida no local onde está',
        'Sempre que a vítima estiver dentro de um veículo'
      ],
      correct: 2,
      explanation: 'A vítima NÃO deve ser removida a menos que o local represente risco imediato de vida (incêndio, afogamento). Movimentação incorreta pode agravar fraturas, especialmente da coluna vertebral, causando paralisia permanente.'
    },
    {
      id: 'ps03',
      text: 'Para verificar se uma pessoa inconsciente está respirando, o correto é:',
      options: [
        'Colocar um espelho na frente da boca',
        'Apertar o nariz da vítima e observar o peito',
        'Inclinar a cabeça da vítima para trás, levantar o queixo e observar, ouvir e sentir por 10 segundos',
        'Dar tapas no rosto da vítima para ela acordar'
      ],
      correct: 2,
      explanation: 'A técnica correta para verificar respiração é: inclinar a cabeça levemente para trás (desobstruir via aérea), levantar o queixo e por 10 segundos OLHAR (tórax sobe?), OUVIR (som de respiração?) e SENTIR (ar no rosto?). Se não respirar, inicie RCP.'
    },
    {
      id: 'ps04',
      text: 'A RCP (Reanimação Cardiopulmonar) deve ser realizada quando:',
      options: [
        'A vítima estiver consciente mas com dor no peito',
        'A vítima não responder a estímulos e não apresentar respiração normal',
        'A vítima estiver desmaiada mas respirando normalmente',
        'Sempre que a vítima estiver pálida'
      ],
      correct: 1,
      explanation: 'A RCP é indicada quando a vítima está inconsciente E não respira normalmente (sem respiração ou com respiração agônica). O procedimento combina compressões torácicas (30x) com ventilações (2x) no ritmo de 100-120 compressões por minuto.'
    },
    {
      id: 'ps05',
      text: 'O que fazer com uma vítima que está sangrando intensamente?',
      options: [
        'Fazer um torniquete com barbante ou fio',
        'Aplicar pressão direta sobre o ferimento com pano limpo ou compressa',
        'Lavar o ferimento com água antes de qualquer outra ação',
        'Elevar o ferimento mas não tocar na ferida'
      ],
      correct: 1,
      explanation: 'Para controlar hemorragia: pressione firmemente sobre o ferimento com pano limpo, lenço ou compressa. Mantenha a pressão constante (não solte para ver se parou). O torniquete só é usado em situações extremas de amputação ou sangramento que não para.'
    },
    {
      id: 'ps06',
      text: 'Em caso de suspeita de fratura na coluna vertebral (coluna), o correto é:',
      options: [
        'Sentar a vítima para ela ficar mais confortável',
        'Manter a vítima imóvel, estabilizar a cabeça e pescoço, e aguardar o socorro',
        'Levar a vítima ao hospital imediatamente no carro particular',
        'Dar movimentos suaves no pescoço para verificar a extensão da lesão'
      ],
      correct: 1,
      explanation: 'Suspeita de lesão na coluna exige imobilização total. Movimentar a vítima incorretamente pode causar lesão medular e paralisia permanente. Estabilize a cabeça manualmente, tranquilize a vítima e aguarde o SAMU com equipamento adequado.'
    },
    {
      id: 'ps07',
      text: 'Qual é o número de telefone do SAMU (Serviço de Atendimento Móvel de Urgência)?',
      options: ['190', '192', '193', '197'],
      correct: 1,
      explanation: 'O SAMU é acionado pelo número 192 e funciona 24 horas. Outros números importantes: 190 (Polícia Militar), 193 (Bombeiros), 197 (Polícia Civil). Em acidentes, chame o serviço mais adequado à situação.'
    },
    {
      id: 'ps08',
      text: 'Diante de uma vítima com sinais de choque (pálida, suando frio, pulso fraco), deve-se:',
      options: [
        'Dar água ou suco para hidratá-la',
        'Deixá-la sentada com a cabeça entre os joelhos',
        'Deitá-la, elevar as pernas (se não houver suspeita de fratura), manter aquecida e acionar socorro',
        'Fazer massagem cardíaca imediatamente'
      ],
      correct: 2,
      explanation: 'No choque circulatório: deite a vítima, eleve as pernas a 30cm (aumenta o fluxo de sangue ao coração e cérebro), cubra com agasalho para manter aquecimento, não dê nada pela boca (pode vomitar) e acione o socorro urgentemente.'
    }
  ],

  mecanica: [
    {
      id: 'mec01',
      image: 'images/cenas/10-alertas-do-painel.png',
      text: 'A luz de óleo acesa no painel durante a condução indica:',
      options: [
        'Hora de trocar o óleo (quilometragem atingida)',
        'Pressão do óleo do motor está baixa — pare imediatamente',
        'Excesso de óleo no motor',
        'Óleo de freio com nível baixo'
      ],
      correct: 1,
      explanation: 'A luz vermelha de óleo indica BAIXA PRESSÃO de óleo — isto é uma emergência! Pare imediatamente em local seguro e desligue o motor. Continuar dirigindo pode travar o motor completamente (romper peças internas) causando dano irreparável e perda do veículo.'
    },
    {
      id: 'mec02',
      text: 'O que indica o símbolo de temperatura alta no painel (termômetro na zona vermelha)?',
      options: [
        'Que o ar-condicionado está funcionando',
        'Motor superaquecido — risco de grave avaria',
        'Temperatura ambiente muito alta',
        'Bateria sobrecarregada'
      ],
      correct: 1,
      explanation: 'Temperatura do motor na zona vermelha indica superaquecimento — pode ser falta de água no radiador, falha no ventilador ou da bomba d\'água. Pare em local seguro, desligue o motor e aguarde esfriar antes de abrir o radiador (vapor quente causa queimaduras graves).'
    },
    {
      id: 'mec03',
      image: 'images/cenas/09-calibragem-dos-pneus.png',
      text: 'Qual é o intervalo recomendado para verificação da calibragem dos pneus?',
      options: [
        'Apenas quando o pneu estiver visivelmente murcho',
        'A cada 6 meses',
        'Pelo menos uma vez por mês e sempre antes de viagens longas',
        'A cada troca de óleo'
      ],
      correct: 2,
      explanation: 'A calibragem dos pneus deve ser verificada mensalmente, preferencialmente quando o pneu está frio (parado há pelo menos 3 horas). Pneu calibrado corretamente aumenta a segurança, reduz desgaste irregular e melhora o consumo de combustível.'
    },
    {
      id: 'mec04',
      text: 'O "sulco" (profundidade das ranhuras) mínimo permitido no pneu pelo CTB é:',
      options: ['0,5 mm', '1,6 mm', '3 mm', '5 mm'],
      correct: 1,
      explanation: 'O CTB estabelece profundidade mínima de 1,6 mm nos sulcos do pneu. Abaixo disso, o pneu é considerado "careca" e deve ser substituído. Pneus gastos reduzem drasticamente a aderência na pista molhada, aumentando o risco de aquaplanagem.'
    },
    {
      id: 'mec05',
      text: 'O que verifica o fluido de freio no veículo?',
      options: [
        'A potência do freio em condições normais',
        'Transmite a força do pedal para as rodas — nível baixo indica risco de falha no freio',
        'A temperatura dos discos de freio',
        'A lubrificação dos tambores do freio'
      ],
      correct: 1,
      explanation: 'O fluido de freio transmite hidraulicamente a força do pedal até as pastilhas/sapatas nas rodas. Nível baixo pode indicar vazamento ou desgaste das pastilhas. Fluido velho absorve umidade e reduz a eficiência dos freios em temperatura alta (fading).'
    },
    {
      id: 'mec06',
      text: 'A luz de bateria acesa durante a condução pode indicar:',
      options: [
        'Bateria completamente carregada',
        'Falha no sistema de carregamento (alternador) — bateria se esgotando',
        'Hora de realizar a revisão do óleo',
        'Nível de combustível baixo'
      ],
      correct: 1,
      explanation: 'A luz de bateria indica que o alternador não está carregando a bateria durante o funcionamento do motor. O carro pode continuar funcionando por alguns km até a bateria descarregar totalmente. Procure um mecânico rapidamente e desligue equipamentos elétricos desnecessários.'
    },
    {
      id: 'mec07',
      text: 'Para que serve o líquido de arrefecimento (água do radiador)?',
      options: [
        'Lubrificar o motor e reduzir o desgaste das peças',
        'Regular a temperatura do motor, evitando superaquecimento ou congelamento',
        'Limpar o sistema de combustível',
        'Aumentar a potência do motor'
      ],
      correct: 1,
      explanation: 'O líquido de arrefecimento circula pelo motor retirando o calor gerado pela combustão e levando ao radiador para ser resfriado. Ele também evita que o motor congele em baixas temperaturas. Nunca abra o radiador com o motor quente — risco de explosão do vapor.'
    },
    {
      id: 'mec08',
      text: 'O que é o rodízio de pneus e qual sua finalidade?',
      options: [
        'Trocar os pneus por um conjunto novo a cada 20.000 km',
        'Alternar a posição dos pneus entre eixos para equalizar o desgaste',
        'Calibrar os pneus em diferentes posições do veículo',
        'Girá-los manualmente para verificar balanceamento'
      ],
      correct: 1,
      explanation: 'Rodízio de pneus consiste em mudar a posição dos pneus entre eixo dianteiro e traseiro (e cruzado, nos veículos de tração) a cada 8.000-10.000 km. Isso iguala o desgaste de todos os pneus, prolongando a vida útil do conjunto e aumentando a segurança.'
    }
  ]
};

// Questões para Simulado Final (mistura de todos os módulos)
// 52 questões = termômetro do Método Gabarita Detran
const SIMULADO_QUESTIONS_COUNT = 52;

// Metas do termômetro (baseado no copy)
const THERMOMETER = [
  { threshold: 30, label: '30/52', pct: '~60%', message: 'Você está na média. Não pare!' },
  { threshold: 40, label: '40/52', pct: '~80%', message: 'Ótimo! Quase aprovado com folga.' },
  { threshold: 45, label: '45/52', pct: '~95%', message: 'Excelente! Praticamente gabaritando.' },
  { threshold: 52, label: '52/52', pct: '100%', message: 'GABARITOU! Você está mais do que pronto!' },
];
