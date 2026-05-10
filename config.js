// HEXGUARD V3 — Carrega api.json (Shizuko) opcional
let apiCfg = { enabled: false };
try { apiCfg = require("./api.json"); } catch {}

module.exports = {
  prefix: ".",
  botName: "🛡️ HΞXGUΛRD",
  version: "V3",
  botNumber: "27670127384",
  ownerName: "THEBEST",
  owner: ["29369590374428"],            // 👑 DONO — antiban total
  ownerWa: "258848881576",            // botão "conversar com dono"
  status: "🚀 HEXGUARD V3 — Bizarre Edition",
  api: apiCfg,                        // Shizuko / IA externa
  enableAudio: true,                  // áudios TTS em comandos
  enableGifs: true,                   // gifs anime em ações
  timezone: "Africa/Maputo",
  loginMode: "pairing",               // será pedido no Termux

  defaultMode: "publico",
  typingEffect: true,                 // efeito digitando (toggle .typing on/off)
  onlineOnly: true,                   // ignora mensagens recebidas enquanto offline

  // XP / recompensas
  xpPerMessage: 8,
  xpToLevel: (lvl) => 120 + lvl * 60,
  saldoPerLevel: 250,
  dailyReward: 1500,
  workMin: 150,
  workMax: 800,
  jdvWinReward: 800,
  gameWinBase: 500,

  // ════════ LOJA — 50+ itens ════════
  shop: {
    "ban-token":     { preco: 2500,  desc: "Banir 1× sem ser admin",            usos: 1 },
    "kick-token":    { preco: 1800,  desc: "Kick 1× sem ser admin",             usos: 1 },
    "mute-token":    { preco: 1200,  desc: "Fechar grupo 1× sem ser admin",     usos: 1 },
    "promote-token": { preco: 6000,  desc: "Promover alguém a admin",           usos: 1 },
    "unmute-token":  { preco: 1200,  desc: "Abrir grupo 1×",                    usos: 1 },
    "vip":           { preco: 25000, desc: "✨ VIP por 30 dias",                 usos: 999 },
    "premium":       { preco: 60000, desc: "💎 PREMIUM por 30 dias",            usos: 999 },
    "xp-boost":      { preco: 1000,  desc: "Dobra XP por 1 hora",               usos: 1 },
    "saldo-boost":   { preco: 1500,  desc: "Dobra saldo do daily 1 dia",        usos: 1 },
    "shield":        { preco: 3000,  desc: "Bloqueia 1 roubo",                  usos: 1 },
    "lucky-charm":   { preco: 2000,  desc: "+10% sorte em jogos por 1 dia",     usos: 1 },
    "loot-box":      { preco: 1500,  desc: "Caixa misteriosa",                  usos: 1 },
    "elite-loot":    { preco: 5000,  desc: "Caixa elite",                       usos: 1 },
    "mega-loot":     { preco: 12000, desc: "Caixa mega",                        usos: 1 },
    "rev-token":     { preco: 4000,  desc: "Vingar 1× roubo",                   usos: 1 },
    "name-tag":      { preco: 800,   desc: "Mudar nick personalizado",          usos: 1 },
    "color-tag":     { preco: 1200,  desc: "Cor especial no perfil",            usos: 1 },
    "rank-up":       { preco: 8000,  desc: "+1 nível",                          usos: 1 },
    "double-xp":     { preco: 6000,  desc: "Dobra XP por 6h",                   usos: 1 },
    "rich":          { preco: 50000, desc: "Status 💰 RICO 7 dias",             usos: 999 },
    "ghost":         { preco: 7000,  desc: "Imune ao antispam 1 dia",           usos: 1 },
    "whisper":       { preco: 1000,  desc: "Mensagem privada via bot",          usos: 1 },
    "anonymous":     { preco: 2500,  desc: "Esconde nome em jogos",             usos: 1 },
    "love-potion":   { preco: 1800,  desc: "Aumenta ship %",                    usos: 1 },
    "wedding-ring":  { preco: 9000,  desc: "Casamento oficial",                 usos: 1 },
    "divorce-paper": { preco: 3000,  desc: "Divórcio oficial",                  usos: 1 },
    "pet-cat":       { preco: 4000,  desc: "Adotar gato 🐱",                    usos: 1 },
    "pet-dog":       { preco: 4500,  desc: "Adotar cão 🐶",                     usos: 1 },
    "pet-dragon":    { preco: 25000, desc: "Adotar dragão 🐉 raro",             usos: 1 },
    "pet-food":      { preco: 500,   desc: "Comida para o pet",                 usos: 5 },
    "sword":         { preco: 8000,  desc: "Espada — duelos +20%",              usos: 1 },
    "armor":         { preco: 9000,  desc: "Armadura — defesa +20%",            usos: 1 },
    "katana":        { preco: 30000, desc: "🗡️ Katana — bani 1× admin",         usos: 1 },
    "skip-cd":       { preco: 2000,  desc: "Pula 1 cooldown",                   usos: 1 },
    "double-daily":  { preco: 3000,  desc: "Daily x2 1×",                       usos: 1 },
    "lottery-ticket":{ preco: 500,   desc: "Bilhete loteria",                   usos: 1 },
    "trivia-pass":   { preco: 800,   desc: "Pula pergunta trivia",              usos: 1 },
    "joker-card":    { preco: 1500,  desc: "Curinga em jogos",                  usos: 1 },
    "magic-wand":    { preco: 7000,  desc: "Reseta o teu cooldown",             usos: 1 },
    "gem-blue":      { preco: 5000,  desc: "Gema azul (colecionar)",            usos: 999 },
    "gem-red":       { preco: 8000,  desc: "Gema vermelha",                     usos: 999 },
    "gem-purple":    { preco: 15000, desc: "Gema roxa rara",                    usos: 999 },
    "gem-rainbow":   { preco: 50000, desc: "Gema arco-íris MITICA",             usos: 999 },
    "energy-drink":  { preco: 600,   desc: "Pula cooldown trabalhar",           usos: 1 },
    "bank-loan":     { preco: 0,     desc: "Empréstimo 5000 (paga 6000)",       usos: 1 },
    "scratch-card":  { preco: 300,   desc: "Raspadinha",                        usos: 1 },
    "stealth":       { preco: 4500,  desc: "Esconde de roubos 12h",             usos: 1 },
    "spy-glass":     { preco: 2500,  desc: "Vê saldo de outros",                usos: 1 },
    "hacker-kit":    { preco: 18000, desc: "+30% sucesso em crime",             usos: 1 },
    "lawyer":        { preco: 6000,  desc: "Reduz multa de crime",              usos: 1 },
    "vip-badge":     { preco: 12000, desc: "Badge ✨ no perfil",                 usos: 999 },
    "champ-badge":   { preco: 30000, desc: "🏆 Campeão",                        usos: 999 },
    "owner-tip":     { preco: 100,   desc: "Gorjeta para o dono",               usos: 1 },
  },
};
