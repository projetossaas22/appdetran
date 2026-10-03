# TreinaDETRAN

> **"Não estude para a prova. Treine para ela."**

App de **Treino Inteligente por Quiz** para a prova teórica do DETRAN. Aprenda respondendo questões, receba correção imediata e descubra seus pontos fracos antes da prova.

---

## 🚀 Funcionalidades

| Feature | Descrição |
|---|---|
| 🎯 Quiz por Módulo | 6 módulos temáticos com 10 questões cada |
| 📋 Simulado Final | 30 questões misturadas de todos os módulos |
| ❤️ Sistema de Vidas | 5 corações por sessão — cuidado com os erros! |
| ⚡ XP e Pontos | Ganhe XP por acerto, bônus por sequência |
| 🔥 Sequência | Multiplique seu XP com acertos consecutivos |
| 📊 Progresso | Acompanhe seu desempenho por módulo |
| 🧠 Treino Inteligente | App identifica onde você mais erra e recomenda revisão |
| 💡 Feedback Imediato | Explicação detalhada a cada resposta |
| ⭐ Estrelas | 1, 2 ou 3 estrelas por módulo baseado no aproveitamento |
| 🎯 Meta Diária | Meta de 10 questões por dia |

## 📚 Módulos

1. **Legislação e CTB** — Código de Trânsito Brasileiro, normas de circulação
2. **Placas e Sinais** — Regulamentação, advertência, indicação
3. **Infrações e Multas** — Classificação, pontos na CNH, penalidades
4. **Direção Defensiva** — Técnicas para evitar acidentes
5. **Primeiros Socorros** — Procedimentos em caso de acidente
6. **Mecânica Básica** — Manutenção preventiva, painel do carro

## 🎨 Design

- Dark mode premium com paleta laranja neon
- Animações suaves e micro-interações
- Totalmente responsivo (mobile-first)
- Fonte: Outfit (Google Fonts)
- Funciona 100% offline (localStorage)

## 📁 Estrutura

```
appdetran/
├── index.html          # App completo (1 página, múltiplas telas)
├── style.css           # Design system completo
├── app.js              # Motor do quiz + lógica de gamificação
├── data.js             # Banco de 72+ questões por módulo
└── PROMPTS_IMAGENS.md  # Prompts para gerar imagens no ChatGPT
```

## 🖼️ Imagens

Os prompts para geração de imagens estão em [`PROMPTS_IMAGENS.md`](./PROMPTS_IMAGENS.md).
São **6 batches de 10 prompts** cobrindo:
- Ícones do app
- Placas de trânsito
- Situações de trânsito
- Banners/splash screen
- Conquistas/gamificação
- Infográficos educativos

## 📱 Como usar

Abra o `index.html` diretamente no navegador. Nenhuma instalação necessária.

---

Desenvolvido com ❤️ para ajudar candidatos a conquistar a CNH.
