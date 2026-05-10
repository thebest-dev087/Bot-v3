# 🛡️ HΞXGUΛRD — Bot WhatsApp v2.01

> Dono: **THEBEST** • Bot: configurável no Termux • 400+ comandos

## ⚡ O que mudou em v2.01
- ✅ Pairing code **pede o número no Termux** (não precisa editar config.js)
- ✅ Comandos admin agora dão **erros reais** (não diz "feito" se falhou)
- ✅ `.silenciar` / `.fechar` agora **fecham mesmo** (verifica isBotAdmin antes)
- ✅ **Antiban DONO** total — bot nunca bani o dono
- ✅ **Online-only**: ignora mensagens recebidas enquanto o bot estava offline
- ✅ Antispam: 5 msgs iguais = aviso, 7+ = ban
- ✅ Antilink detecta `.com .net wa.me t.me bit.ly` etc., não só `https://`
- ✅ Efeito **digitando** (toggle `.typing on/off`)
- ✅ Buttons em `.prefix`, `.dono`, `.play` (mp3/mp4)
- ✅ Menus com **imagem do bot** (1080×1080)
- ✅ JdV vs bot é o padrão + **tutorial integrado**
- ✅ Comandos novos: `.on .off .restart .autosair <tempo> .typing .adv .lidme .lidgp .jid .cc`
- ✅ Logos sem API: `.logo .logoneon .logofire .logoice .logoshadow .logostyle`
- ✅ Loja com **52 itens**
- ✅ Welcome usa avatar default quando user não tem foto
- ✅ Escrever só **`dono`** (sem prefixo) → mostra prefixo + botão copiar

## 📲 Instalação no Termux
```bash
pkg update && pkg upgrade -y
pkg install nodejs git ffmpeg termux-api -y
unzip hexguard-bot.zip
cd hexguard-bot
npm install
node index.js
```
O terminal vai pedir o **número do bot** (formato `258841234567` ou `+258841234567`).
Depois copia o **pairing code** mostrado e cola em:
WhatsApp → Aparelhos conectados → Conectar com nº telefone.

## 🤖 IA (opcional)
```bash
export LOVABLE_API_KEY="sua_chave"
echo 'export LOVABLE_API_KEY="sua_chave"' >> ~/.bashrc
```
Outras opções: Gemini, Groq, OpenRouter (edita `bot/lib/ai.js`).

## 📜 Menus
`.menu .menucompleto .menuia .menugp .menujogos .menuacoes .menubrincadeiras .menuanti .menuutil .menueco .menuadm .menudono .menuvip .menupremium .menudownload .menulogos .menurank`

## 👑 Comandos só do DONO
`.on .off .restart .typing on/off .join <link> .sairgrupo .autosair <30s|5m|1h>`
`.broadcast .setbotname .modo publico|privado .resetdb / .limpezahd`
`.addsaldo .remsaldo .addxp .banuser .desbanuser .setvip .unvip .setpremium .unpremium`
`.listgrupos .exec .addcomando .delcomando`

## 🐛 Problemas comuns
| Erro | Solução |
|---|---|
| Bot diz "preciso ser admin" mas já é | Sai do grupo, volta a entrar e re-promove o bot |
| `.silenciar` não fecha | O bot tem mesmo de ser admin (verifica `.admins`) |
| Pairing falha | Apaga `./session` e corre `node index.js` |
| Sem notificação | `pkg install termux-api` + app **Termux:API** |

🛡️ **HΞXGUΛRD v2.01** by **THEBEST**
