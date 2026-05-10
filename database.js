const fs = require("fs-extra");
const path = require("path");

const DB_DIR = path.join(__dirname, "data");
fs.ensureDirSync(DB_DIR);

const FILES = {
  users:  path.join(DB_DIR, "users.json"),
  groups: path.join(DB_DIR, "groups.json"),
  global: path.join(DB_DIR, "global.json"),
};

function load(file, def) {
  try { return fs.readJsonSync(file); }
  catch { fs.writeJsonSync(file, def); return def; }
}
function save(file, data) { fs.writeJsonSync(file, data, { spaces: 2 }); }

let users  = load(FILES.users,  {});
let groups = load(FILES.groups, {});
let global = load(FILES.global, {
  banned: [], premium: {}, vip: {}, mode: "publico", customCmds: {},
  botOn: true, typingEffect: true, autoSair: {},
});

if (!global.premium || Array.isArray(global.premium)) global.premium = {};
if (!global.vip)   global.vip   = {};
if (!global.banned) global.banned = [];
if (!global.customCmds) global.customCmds = {};
if (global.botOn === undefined) global.botOn = true;
if (global.typingEffect === undefined) global.typingEffect = true;
if (!global.autoSair) global.autoSair = {};

function persist() {
  save(FILES.users,  users);
  save(FILES.groups, groups);
  save(FILES.global, global);
}
setInterval(persist, 12000);

// ================== USERS ==================
function getUser(jid) {
  if (!users[jid]) {
    users[jid] = {
      jid, saldo: 200, xp: 0, level: 1, pontos: 0, items: {},
      lastDaily: 0, lastWork: 0, lastCrime: 0, lastSteal: 0,
      msgCount: 0, registeredAt: Date.now(), name: "",
      married: null, shield: false, boostXpUntil: 0, boostMoneyUntil: 0,
    };
  }
  return users[jid];
}
function addSaldo(jid, v) { getUser(jid).saldo += v; if (getUser(jid).saldo < 0) getUser(jid).saldo = 0; }
function addXP(jid, v) {
  const u = getUser(jid); u.xp += v;
  let leveled = false;
  while (true) {
    const need = 120 + u.level * 60;
    if (u.xp >= need) { u.level++; u.xp -= need; leveled = true; } else break;
  }
  return leveled;
}
function addPontos(jid, v) { getUser(jid).pontos += v; }
function addItem(jid, name, qtd = 1) {
  const u = getUser(jid); u.items[name] = (u.items[name] || 0) + qtd;
}
function useItem(jid, name) {
  const u = getUser(jid);
  if (!u.items[name] || u.items[name] <= 0) return false;
  u.items[name]--; if (u.items[name] <= 0) delete u.items[name];
  return true;
}

// ================== VIP / PREMIUM ==================
function setVip(jid, days = 30) { global.vip[jid] = Date.now() + days * 86400000; }
function unsetVip(jid) { delete global.vip[jid]; }
function isVip(jid) { const t=global.vip[jid]; if(!t) return false; if(Date.now()>t){delete global.vip[jid]; return false;} return true; }
function setPremium(jid, days = 30) { global.premium[jid] = Date.now() + days * 86400000; }
function unsetPremium(jid) { delete global.premium[jid]; }
function isPremium(jid) { const t=global.premium[jid]; if(!t) return false; if(Date.now()>t){delete global.premium[jid]; return false;} return true; }

// ================== GROUPS ==================
function getGroup(gid) {
  if (!groups[gid]) {
    groups[gid] = {
      gid, welcome: true, goodbye: true,
      antilink: false, antifoto: false, antivideo: false, antisticker: false,
      antistatus: false, antipv: false, antifake: false, antipalavrao: false, antispam: false,
      antibanadm: true, // 🛡️ só DONO pode banir admins
      palavroes: ["puta","caralho","fdp","viado","cuzao","corno","arrombado"],
      welcomeMsg: "🌟 Bem-vindo @user ao grupo *@group*!\n\nLê as regras e diverte-te 🛡️",
      goodbyeMsg: "👋 @user saiu do grupo. Até breve!",
      spamCount: {},
    };
  }
  // backfill chaves novas em DBs antigos
  const g = groups[gid];
  if (g.antibanadm === undefined) g.antibanadm = true;
  return g;
}

// ================== CUSTOM COMMANDS ==================
function addCmd(name, response) { global.customCmds[name.toLowerCase()] = response; }
function delCmd(name) { delete global.customCmds[name.toLowerCase()]; }
function getCmd(name) { return global.customCmds[name?.toLowerCase()]; }

// ================== RESET / LIMPEZA HD ==================
function resetAll() {
  users = {}; groups = {}; global = { banned: [], premium: {}, vip: {}, mode: "publico", customCmds: {} };
  persist();
}

module.exports = {
  users, groups, global,
  getUser, addSaldo, addXP, addPontos, addItem, useItem,
  getGroup, persist,
  setVip, unsetVip, isVip,
  setPremium, unsetPremium, isPremium,
  addCmd, delCmd, getCmd,
  resetAll,
};
