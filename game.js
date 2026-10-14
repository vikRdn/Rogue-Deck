(function () {
"use strict";

const __defs = {}, __cache = {};
function __define(p, f) { __defs[p] = f; }
function __require(p) {
  if (__cache[p]) return __cache[p].exports;
  const m = { exports: {} }; __cache[p] = m;
  if (!__defs[p]) throw new Error("Modul fehlt: " + p);
  __defs[p](m.exports, __require); return m.exports;
}
__define("data/config.js", function (__exports, __require) {
// Zentrale Balancing-Konfiguration. Alle Stellschrauben an EINEM Ort.
const CONFIG = {
  version: "6.3",   // wird auf dem Titelbildschirm angezeigt: so sieht man sofort, ob die neue Version geladen ist (nicht aus dem Browser-Zwischenspeicher)
  player: { startEnergy: 3, handSize: 4, openingDraw: 1, maxHp: 70 },       // kleine Start-Decks: Hand 4, im ersten Zug jedes Kampfes +1 Karte

  balance: {
    softCapAdd: 8,        // Additive Boni über diesem Wert zählen nur zur Hälfte
    maxMultBonus: 1.0,    // Prozent-Boni summieren sich additiv (+25% +30% = +55%), max. +100%
    vulnerableMult: 1.5,  // Schaden gegen "verwundbare" Gegner
    maxChainDepth: 4,     // Max. Tiefe von Trigger-Ketten (Schutz vor Endlosschleifen)
    maxCardsPerTurn: 25,  // Harte Grenze gegen Kartenschleifen
    enemyDmgScale: 0.80,
    markBonus: 1,         // Markierte Ziele erhalten pro Treffer +1 Schaden
    tempoCap: 3, unbeugsamPct: 0.25, unbeugsamCap: 2,
    maxHpGainPerCombat: 2,   // Photosynthese: dauerhaftes Max-HP höchstens so oft pro Kampf (sonst wächst es ohne Grenze)
    critMult: 1.5,          // kritischer Treffer: Schaden x1,5
    dodgeCap: 60,           // Ausweichen: höchstens 60 % Chance
    armorK: 15,             // Rüstung: Schaden x K/(K+Rüstung), also 15 Rüstung = halber Schaden
    maxTurnStartBlock: 10,  // Obergrenze für GRATIS-Block zu Beginn des Zuges (Block-Start und Zugbeginn-Items zusammen); Block aus Karten zählt nicht
    freezeAt: 3,            // Eis: so viele Kälte-Stapel lassen einen Gegner einfrieren (Kältemulett senkt die Schwelle um 1, mindestens 2)
    maxXMult: 3,          // Obergrenze für den Endmultiplikator (xMult), damit High-Risk-Builds nicht ins Unendliche laufen,          // Max. Bonus durch "pro zuvor gespielter Karte"  // Globaler Regler für ALLEN Gegnerschaden (vor der Schwierigkeitsstufe)
  },

  // Element-System: Multiplikatoren pro Gegner-Element (bei Doppel-Elementen werden sie multipliziert)
  elements: { strongMult: 1.5, weakMult: 0.5, sameElementMult: 0.75, minMult: 0.25, maxMult: 2.5 },

  // Seltenheiten mit Grundgewichtung
  rarities: {
    gewoehnlich:   { weight: 60 },
    ungewoehnlich: { weight: 28 },
    selten:        { weight: 10 },
    legendaer:     { weight: 2 },
  },

  // Glück: pro Punkt wird das Gewicht der Seltenheit um diesen Anteil erhöht (Gewöhnlich bleibt gleich)
  luck: { maxLuck: 15, perPoint: { ungewoehnlich: 0.06, selten: 0.15, legendaer: 0.25 } },
  // Tiefe im Run: pro Etage zusätzlicher Anteil
  depthBonus: { selten: 0.03, legendaer: 0.02 },

  // Leichte Lenkung: Tags, von denen der Build mind. minCount Stück hat, erhöhen das Gewicht passender Angebote
  heroItemBias: 2.5,       // Gewicht für Items, die auf den gespielten Helden zugeschnitten sind (bei anderen Helden 1)
  tagBias: { minCount: 2, perMatch: 0.6, cap: 1.2 },

  rewards: { cardChoices: 3, wildcardSlots: 1, weaponMinRarity: "ungewoehnlich" },   // Waffen-Beute ist besser als die Startwaffen (gleiche Stufe wie der Start gäbe keinen Grund zum Tausch)   // Wildcard-Slots ignorieren die Lenkung (Vielfalt!)

  shop: {
    cardSlots: 5, itemSlots: 4, wildcardCards: 2, wildcardItems: 1,
    basePrice: { gewoehnlich: 30, ungewoehnlich: 55, selten: 100, legendaer: 190 },
    itemFactor: 1.4,       // Items kosten mehr als Karten
    priceVariance: 0.15,   // +-15 % Zufallsschwankung
    startDiscount: 0.45,
    inflationPerFight: 0.015,   // Inflation: alle Warenpreise steigen pro abgeschlossenem Kampf um 4 %    // Startladen (nach dem ersten Kampf): halbe Preise
    afterFight: true, quick: { cards: 3, items: 3 },          // nach JEDEM Kampf ein Schnellladen (kleineres Angebot); Händler-Orte auf der Karte bleiben der große Laden
    services: { heal: { price: 35, pct: 0.3, step: 10 }, vitality: { price: 75, maxHp: 6 } },   // Dienste beim Händler: Verband (heilt, wird teurer) und Stärkungstrank (+Max-HP, einmal je Besuch)
    removeBase: 50, removeIncrement: 25,
    rerollBase: 4, rerollMult: 1.3,                                // Reroll: 4, 5, 7, 9 ... Gold (Brotato-Stil: im ersten Laden etwa 4 Rerolls)
  },

  // Items dürfen gestapelt werden (wie bei Brotato). Einzelne Items überschreiben das mit "maxStack".
  items: { maxStack: 3 },

  // Shiny: Chance pro Gegner-Begegnung (enemyChance) und pro Angebots-Slot in Belohnung/Shop (lootChance).
  // scale: Shiny-Gegenstände haben +25 % auf ihre positiven Werte. priceMult: Shop-Aufpreis.
  shiny: {
    enemyChance: 1 / 500, lootChance: 1 / 500, scale: 1.25, priceMult: 3,
    heroChance: 1 / 500, heroLuck: 1,           // Shiny-Held beim Run-Start: Zufall, dazu +1 Glück in diesem Run
    enemyHpMult: 1.25, enemyGold: 60,                     // Shiny-Gegner: +25 % HP, dafür +60 Gold ...
    enemyMinRarity: "selten", enemyWeaponMinRarity: "ungewoehnlich",   // ... mindestens seltene Chrom-Items und eine Chrom-Waffe zur Wahl
  },

  // ---- Run-Aufbau
  run: { startGold: 60, restHealPct: 0.3, minDeck: 4, normalItemChance: 0.12 },
  map: {
    layers: 10,                 // Ebenen vor dem Boss
    width: [3, 4],              // Knoten pro Ebene (min, max)
    skipEdgeChance: 0.2,        // Chance auf Abkürzung (überspringt eine Ebene) -> Run-Länge hängt vom Weg ab
    minibossLayer: 5, restBeforeMiniboss: true, merchantLayers: [2, 7], merchantShare: 0.5,   // auf diesen Ebenen ist mindestens die Hälfte der Orte ein Händler           // Pflicht-Ebene mit Mini-Bossen (nicht überspringbar)
    firstEncounter: "kellerratten",   // Ebene 0 hat genau EINEN Ort mit diesem festen Kampf, danach beginnt die Wegwahl
    nodeWeights: { kampf: 48, ereignis: 18, haendler: 9, rast: 12, elite: 13 },
    minLayer: { elite: 3, rast: 2, haendler: 2 },
    tierSplit: 4,               // ab dieser Ebene kommen Begegnungen der Stufe 2
  },
  // Erfahrung und Wert-Aufstiege (Brotato-Richtung): Gegner geben Erfahrung nach ihren Lebenspunkten, volle Leiste = ein Aufstieg mit 4 Wert-Angeboten
  draft: { rounds: 4, options: 3, ownWeight: 2.5 },        // Startdeck-Draft: 4 Züge, je 3 Karten zur Wahl, eigene Klassenkarten 2,5x so wahrscheinlich
  xp: { hpPerXp: 14, base: 8, step: 4 },
  // Run-Struktur: 10 Stages mit je einer Karte (Kämpfe, Elite, Mini-Boss, Rast, Händler, Ereignisse). Stage 1 bis 9 enden mit einem Wächter, Stage 10 mit dem Endboss. Gegner, Gold und Preise wachsen von Stage zu Stage.
  stages: { count: 10, heal: 0.3, guards: ["steinwaechter", "banditenbande", "eliterudel", "knochenhauptmann", "sumpfwacht", "steinwaechter", "eliterudel", "banditenbande", "knochenhauptmann"] },
  stageScale: { hp: [0.2, 0.025], dmg: [0.08, 0.012],       // Faktor = 1 + a*(Stage-1) + b*(Stage-1)^2: sanft am Anfang, hart am Ende
     gold: 0.16, price: 0.2, xp: 0.1, finalHp: 1.6, finalDmg: 1.15 },   // finalHp/finalDmg: zusätzlich auf den Endboss der letzten Stage
  rarityMinStage: { gewoehnlich: 1, ungewoehnlich: 1, selten: 2, legendaer: 5 },    // starke Items erscheinen erst in späteren Stages
  upgrades: {
    stats: ["maxHp", "regen", "lifesteal", "damagePct", "meleeDmg", "rangedDmg", "elementDmg", "crit", "armor", "dodge", "luck", "ernte"],
    values: { maxHp: [4, 7, 10, 14], regen: [1, 1, 2, 3], lifesteal: [1, 3, 4, 6], damagePct: [3, 5, 7, 10], meleeDmg: [1, 1, 2, 3], rangedDmg: [1, 1, 2, 3], elementDmg: [1, 1, 2, 3], crit: [2, 4, 6, 8], armor: [1, 1, 2, 3], dodge: [2, 4, 5, 7], luck: [1, 3, 4, 6], ernte: [1, 1, 2, 3] },
    tierChance: [0.62, 0.28, 0.09, 0.01], tierShiftPerLevel: 0.02, tierShiftPerLuck: 0.008,   // Stufe I bis IV; mit Level und Glück häufiger besser
  },
  gold: { kampf: [20, 32], elite: [38, 54], miniboss: [60, 80], boss: [100, 100] },
  // Schwierigkeitsstufen. Stufe n wird erst nach einem Sieg auf Stufe n-1 freigeschaltet.
  difficulty: [
    { name: "Normal",   hpMult: 1,    dmgMult: 1 },
    { name: "Schwer",   hpMult: 1.2,  dmgMult: 1.1 },
    { name: "Albtraum", hpMult: 1.4,  dmgMult: 1.25 },
  ],

  // Typ-Tags, die für Vielfalts-Effekte und Lenkung zählen (Element-IDs kommen automatisch dazu)
  ui: { speeds: [1, 2], victoryMs: 1500 },   // Kampf-Tempo: Tempo 3 war zu schnell. Bei Bedarf wieder [1, 2, 3] eintragen, die Logik kann es noch.
  economy: { overkillPerGold: 5 },   // Überschuss-Schaden beim Töten wird zu Gold (5 Überschuss = 1 Gold)
  typeTags: ["feuer", "gift", "blut", "block", "dornen", "pakt", "heilung", "ruestung"],   // diese Tags zählen für Synergien und die Beute-Lenkung
};

__exports.CONFIG = CONFIG;

});
__define("content/registry.js", function (__exports, __require) {
// Content-Registry: nimmt "Packs" (Sets) entgegen und stellt alles gesammelt bereit.
// Ein neues Set = eine neue Datei in content/packs + eine Zeile in content/index.js.
const { CONFIG } = __require("data/config.js");

const KINDS = ["cards", "weapons", "items", "enemies", "encounters", "classes", "abilities", "events", "reactions", "speakers", "stories", "skins", "frames", "achievements"];
const uniq = (a) => [...new Set(a)];

function normalize(kind, id, def, packId) {
  const out = { id, pack: packId, ...def };
  if (kind === "cards" || kind === "weapons" || kind === "items") {
    out.tags = uniq([...(def.tags ?? []), ...(def.element ? [def.element] : [])]); // Element zählt als Tag
    out.pools = def.pools ?? ["alle"];                                             // "alle" oder Klassen-IDs
    // Waffen sind NICHT an eine Klasse gebunden (wie bei Brotato): "pools" nennt nur die Signatur-Klasse, zu der die Waffe am besten passt. Wählbar und findbar ist sie für alle.
    if (kind === "weapons") { out.signature = def.signature ?? (def.pools ?? []).find((p) => p !== "alle") ?? null; out.pools = ["alle"]; }
    out.rarity = def.rarity ?? "gewoehnlich";
  }
  if (kind === "weapons" || kind === "items") out.passives = def.passives ?? [];
  if (kind === "items") { out.stats = def.stats ?? {}; out.maxStack = def.maxStack ?? CONFIG.items.maxStack; }
  if (kind === "enemies") out.elements = def.elements ?? [];
  if (kind === "achievements") { out.group = def.group ?? "runs"; out.secret = Boolean(def.secret); }
  if (kind === "classes") { out.stats = def.stats ?? {}; out.starterWeapons = def.starterWeapons ?? [def.weapon]; out.shopBasics = def.shopBasics ?? []; out.passive = def.passive ?? null;
    out.passives = def.passives ?? []; out.perks = def.perks ?? []; out.cardPools = def.cardPools ?? [out.id]; out.abilities = def.abilities ?? []; out.coreCards = def.coreCards ?? []; }      // passives: Klassen-Passive als Daten, perks: Vor- und Nachteile für die Anzeige, cardPools: welche Kartenpools der Held findet
  if (kind === "abilities") { out.levels = def.levels ?? []; out.cooldown = def.cooldown ?? 4; }
  if (kind === "reactions") out.key = [...def.pair].sort().join("+");   // ungeordnetes Elementpaar
  if (kind === "encounters") { out.kind = def.kind ?? "normal"; out.tier = def.tier ?? 1; }   // normal | elite | miniboss | boss
  return out;
}

// ---- Shiny-Varianten: gleiche Definition, positive Zahlen +25 %. Nachteile (negative Werte) bleiben.
const SCALE_KEYS = new Set(["base", "value", "stacks", "power", "cap"]);
const NO_SCALE_STATS = new Set(["energy", "handSize", "shiny"]);   // zu mächtig, um sie zu skalieren
const F = CONFIG.shiny.scale;
const shinyScale = (n) => (n <= 0 ? n : n < 1 ? Math.round(n * F * 100) / 100 : Math.ceil(n * F));

function scaleDeep(node) {
  if (Array.isArray(node)) return node.map(scaleDeep);
  if (node && typeof node === "object") {
    const out = {};
    for (const [k, v] of Object.entries(node)) out[k] = typeof v === "number" && SCALE_KEYS.has(k) ? shinyScale(v) : scaleDeep(v);
    return out;
  }
  return node;
}

function makeShiny(def) {
  const out = { ...scaleDeep({ ...def, stats: undefined }), shiny: true, baseId: def.id, id: `${def.id}:s`, name: `✦ ${def.name}` };
  if (def.stats) {
    out.stats = Object.fromEntries(Object.entries(def.stats).map(([k, v]) => [k, NO_SCALE_STATS.has(k) ? v : shinyScale(v)]));
  } else delete out.stats;
  if (def.text) out.text = `${def.text} ✦ Werte +${Math.round((F - 1) * 100)} %`;
  return out;
}

function createContent() {
  const c = { packs: [], elements: {}, relations: [], matrix: {}, cards: {}, weapons: {}, items: {}, enemies: {}, encounters: {}, classes: {}, abilities: {}, events: {}, reactions: {}, reactionIndex: {}, speakers: {}, stories: {}, skins: {}, frames: {}, achievements: {} };
  const shinyCache = {};
  c.clearShinyCache = () => { for (const k of Object.keys(shinyCache)) delete shinyCache[k]; };         // nach Sprachwechsel: Chrom-Namen neu bilden

  // Holt eine Definition. IDs mit Endung ":s" liefern die Shiny-Variante (serialisierbar für Savegames).
  c.get = (kind, id) => {
    if (!id.endsWith(":s")) return c[kind][id];
    if (shinyCache[`${kind}/${id}`]) return shinyCache[`${kind}/${id}`];
    const base = c[kind][id.slice(0, -2)];
    return base ? (shinyCache[`${kind}/${id}`] = makeShiny(base)) : undefined;
  };

  // Reaktion für zwei Elemente in beliebiger Reihenfolge (oder undefined)
  c.reactionFor = (a, b) => c.reactionIndex[[a, b].sort().join("+")];

  // Element-Matrix: Zeile = Angreifer-Element, Spalte = Gegner-Element. Wird nach jedem Pack neu berechnet,
  // damit auch Beziehungen zu später geladenen Elementen greifen.
  const E = CONFIG.elements;
  function buildMatrix() {
    const ids = Object.keys(c.elements);
    const m = {};
    for (const a of ids) {
      m[a] = {};
      for (const d of ids) m[a][d] = a === d ? E.sameElementMult : 1;
    }
    for (const a of ids) {
      for (const d of c.elements[a].strong ?? []) if (m[a][d] !== undefined) m[a][d] = E.strongMult;
      for (const d of c.elements[a].weak ?? []) if (m[a][d] !== undefined) m[a][d] = E.weakMult;
    }
    for (const r of c.relations) if (m[r.from]?.[r.to] !== undefined) m[r.from][r.to] = r.mult;
    c.matrix = m;
  }

  c.register = (pack) => {
    if (c.packs.includes(pack.id)) throw new Error(`Pack doppelt: ${pack.id}`);
    c.packs.push(pack.id);
    for (const kind of KINDS) {
      for (const [id, def] of Object.entries(pack[kind] ?? {})) {
        if (c[kind][id]) throw new Error(`${kind}.${id} existiert schon (Pack ${pack.id})`);
        if (id.includes(":")) throw new Error(`${kind}.${id}: IDs dürfen keinen Doppelpunkt enthalten`);
        c[kind][id] = normalize(kind, id, def, pack.id);
        if (kind === "reactions") {
          const key = c[kind][id].key;
          if (c.reactionIndex[key]) throw new Error(`Reaktion für ${key} existiert schon (Pack ${pack.id})`);
          c.reactionIndex[key] = c[kind][id];
        }
      }
    }
    for (const [id, el] of Object.entries(pack.elements ?? {})) {
      if (c.elements[id]) throw new Error(`Element ${id} existiert schon (Pack ${pack.id})`);
      c.elements[id] = { id, pack: pack.id, ...el };
    }
    c.relations.push(...(pack.elementRelations ?? []));
    buildMatrix();
    return c;
  };

  // Verknüpft Erfolgs-Belohnungen mit den Inhalten: Was als Belohnung vergeben wird, ist vorher gesperrt.
  // Wird einmal aufgerufen, nachdem ALLE Sets geladen sind.
  c.finalize = () => {
    // Gemeinsamer Startpool: alle Waffen mit starter: true stehen JEDER Klasse zur Wahl (Klassen-Standardwaffe bleibt cl.weapon)
    const starters = Object.values(c.weapons).filter((w) => w.starter).map((w) => w.id);
    for (const cl of Object.values(c.classes)) cl.starterWeapons = starters;
    const seen = new Set();
    for (const a of Object.values(c.achievements)) {
      const rw = a.reward;
      const target = rw && c[rw.kind]?.[rw.id];
      if (!target || seen.has(`${rw.kind}/${rw.id}`)) continue;
      seen.add(`${rw.kind}/${rw.id}`);
      if (!target.unlock) target.unlock = { type: "achievement", id: a.id };
    }
  };

  // Prüft, ob alle Verweise gültig sind. Gibt eine Liste von Problemen zurück.
  c.validate = () => {
    const p = [];
    const has = (kind, id) => Boolean(c[kind][id]);
    for (const x of [...Object.values(c.cards), ...Object.values(c.weapons), ...Object.values(c.items)]) {
      if (x.element && !c.elements[x.element]) p.push(`${x.id}: unbekanntes Element ${x.element}`);
      for (const pool of x.pools) if (pool !== "alle" && !has("classes", pool)) p.push(`${x.id}: unbekannter Pool ${pool}`);
    }
    const ACTIONS = ["damage", "block", "status", "multiplyStatus", "draw", "energy", "playerStatus", "heal"];
    for (const it of Object.values(c.items)) {
      if (!it.active) continue;
      if (!(it.active.cost >= 0 && it.active.cost <= 3) || !Array.isArray(it.active.play) || !it.active.play.length) p.push(`Item ${it.id}: active braucht cost (0-3) und play`);
      for (const a of it.active.play ?? []) {
        if (!ACTIONS.includes(a.action)) p.push(`Item ${it.id}: unbekannte Aktion ${a.action}`);
        if (a.element && !c.elements[a.element]) p.push(`Item ${it.id}: unbekanntes Element ${a.element}`);
      }
      if (it.active.element && !c.elements[it.active.element]) p.push(`Item ${it.id}: unbekanntes Element ${it.active.element}`);
    }
    for (const e of Object.values(c.enemies)) for (const el of e.elements) if (!c.elements[el]) p.push(`${e.id}: unbekanntes Element ${el}`);
    for (const e of Object.values(c.enemies)) {
      for (const el of e.mechanics?.rotateElement?.cycle ?? []) if (!c.elements[el]) p.push(`${e.id}: Zyklus-Element ${el} unbekannt`);
      for (const ph of e.mechanics?.phases ?? []) for (const id of ph.summon ?? []) if (!has("enemies", id)) p.push(`${e.id}: Phase beschwört unbekannten Gegner ${id}`);
    }
    for (const r of Object.values(c.reactions)) for (const el of r.pair) if (!c.elements[el]) p.push(`Reaktion ${r.id}: unbekanntes Element ${el}`);
    for (const cl of Object.values(c.classes)) for (const pool of cl.cardPools) if (pool !== "alle" && !has("classes", pool)) p.push(`Klasse ${cl.id}: unbekannter Kartenpool ${pool}`);
    for (const a of Object.values(c.abilities)) if (!has("classes", a.class)) p.push(`Fähigkeit ${a.id}: unbekannte Klasse ${a.class}`);
    for (const cl of Object.values(c.classes)) for (const a of cl.abilities) if (!has("abilities", a)) p.push(`Klasse ${cl.id}: unbekannte Fähigkeit ${a}`);
    for (const cl of Object.values(c.classes)) for (const a of cl.coreCards) if (!has("cards", a)) p.push(`Klasse ${cl.id}: unbekannte Kernkarte ${a}`);
    for (const w of Object.values(c.weapons)) if (w.signature && !has("classes", w.signature)) p.push(`Waffe ${w.id}: unbekannte Signatur-Klasse ${w.signature}`);
    const REWARD_KINDS = ["items", "weapons", "cards", "skins", "frames"];
    const starters = new Set(Object.values(c.classes).flatMap((cl) => [cl.weapon, ...cl.starterWeapons]));
    const rewarded = {};
    for (const a of Object.values(c.achievements)) {
      const k = a.check ?? {};
      const kinds = ["stat", "discovered", "mapAll", "special"].filter((x) => k[x] !== undefined);
      if (kinds.length !== 1) p.push(`Erfolg ${a.id}: genau EINE Bedingung nötig (stat/discovered/mapAll/special)`);
      if (k.discovered && !["items", "cards", "weapons", "enemies", "reactions"].includes(k.discovered)) p.push(`Erfolg ${a.id}: unbekannte Sammlung ${k.discovered}`);
      if (k.mapAll && !["classes", "starterWeapons"].includes(k.of)) p.push(`Erfolg ${a.id}: mapAll braucht of = classes | starterWeapons`);
      if (a.secret && a.group !== "geheim") p.push(`Erfolg ${a.id}: geheime Erfolge gehören in die Gruppe "geheim"`);
      const rw = a.reward;
      if (!rw) continue;
      if (!REWARD_KINDS.includes(rw.kind)) { p.push(`Erfolg ${a.id}: unbekannte Belohnungsart ${rw.kind}`); continue; }
      const target = c[rw.kind][rw.id];
      if (!target) { p.push(`Erfolg ${a.id}: Belohnung ${rw.kind}/${rw.id} existiert nicht`); continue; }
      if (rewarded[`${rw.kind}/${rw.id}`]) p.push(`Belohnung ${rw.kind}/${rw.id} wird von zwei Erfolgen vergeben (${rewarded[`${rw.kind}/${rw.id}`]}, ${a.id})`);
      rewarded[`${rw.kind}/${rw.id}`] = a.id;
      if (target.unlock && !(target.unlock.type === "achievement" && target.unlock.id === a.id)) p.push(`Erfolg ${a.id}: ${rw.kind}/${rw.id} hat schon eine andere Freischaltung`);
      if (rw.kind === "weapons" && starters.has(rw.id)) p.push(`Erfolg ${a.id}: Startwaffe ${rw.id} darf nicht gesperrt werden`);
      if (rw.kind === "cards" && Object.values(c.classes).some((cl) => cl.deck.includes(rw.id))) p.push(`Erfolg ${a.id}: Startkarte ${rw.id} darf nicht gesperrt werden`);
    }
    for (const s of Object.values(c.skins)) if (!c.classes[s.hero]) p.push(`Skin ${s.id}: unbekannter Held ${s.hero}`);
    for (const st of Object.values(c.stories)) if (!has("speakers", st.speaker)) p.push(`Geschichte ${st.id}: unbekannter Sprecher ${st.speaker}`);
    for (const ev of Object.values(c.events)) {
      const walk = (effects) => { for (const x of effects ?? []) {
        if (x.type === "giveItem" && !has("items", x.id)) p.push(`Event ${ev.id}: unbekanntes Item ${x.id}`);
        if (x.type === "giveCard" && !has("cards", x.id)) p.push(`Event ${ev.id}: unbekannte Karte ${x.id}`);
        if (x.type === "gamble") { walk(x.win); walk(x.lose); }
      } };
      for (const ch of ev.choices) walk(ch.effects);
    }
    for (const enc of Object.values(c.encounters)) for (const w of enc.waves) for (const id of w) if (!has("enemies", id)) p.push(`${enc.id}: unbekannter Gegner ${id}`);
    for (const cl of Object.values(c.classes)) {
      for (const id of cl.shopBasics) if (!has("cards", id)) p.push(`Klasse ${cl.id}: unbekannte Shop-Grundkarte ${id}`);
      for (const id of cl.deck) if (!has("cards", id)) p.push(`Klasse ${cl.id}: unbekannte Karte ${id}`);
      if (!has("weapons", cl.weapon)) p.push(`Klasse ${cl.id}: unbekannte Waffe ${cl.weapon}`);
      for (const w of cl.starterWeapons) if (!has("weapons", w)) p.push(`Klasse ${cl.id}: unbekannte Startwaffe ${w}`);
    }
    return p;
  };
  return c;
}

__exports.createContent = createContent;

});
__define("content/packs/core.js", function (__exports, __require) {
// BASIS-SET: Dreieck Feuer > Pflanze > Wasser > Feuer, neutrale Karten, Startklasse, Standardgegner.
__exports.default = {
  id: "core",
  name: "Basis",

  // strong: dieses Element macht x1,5 Schaden gegen ...   weak: macht x0,5 Schaden gegen ...
  elements: {
    feuer:   { name: "Feuer",   color: "#e8643c", strong: ["pflanze"], weak: ["wasser"] },
    wasser:  { name: "Wasser",  color: "#3c8de8", strong: ["feuer"],   weak: ["pflanze"] },
    pflanze: { name: "Pflanze", color: "#4caf50", strong: ["wasser"],  weak: ["feuer"] },
  },

  // Reaktionen: zwei VERSCHIEDENE Elemente nacheinander im selben Zug (gilt für alle Klassen).
  // Effekte nutzen dieselben Aktionen wie Items; "target" ist standardmäßig das Ziel der zweiten Karte.
  reactions: {
    dampf:          { name: "Dampfexplosion", pair: ["feuer", "wasser"],  effects: [{ action: "damage_all", value: 3 }] },
    flaechenbrand:  { name: "Flächenbrand",   pair: ["feuer", "pflanze"], effects: [{ action: "damage", value: 5 }] },
    wachstum:       { name: "Wachstum",       pair: ["wasser", "pflanze"], effects: [{ action: "heal", value: 2 }, { action: "block", value: 2 }] },
  },

  classes: {
    nahkaempfer: {
      coreCards: ["schildstoss", "aufschlitzen", "dornenpanzer"], abilities: ["steinschere", "donnerjojo"], name: "Nahkämpfer", hp: 90, stats: { armor: 1, meleeDmg: 2 }, blurb: "Robust und geradlinig: Block, Waffenstärke und Blutung. Verzeiht Fehler.",
      perks: ["+ Viel Leben: 90 Max-HP", "+ Unbeugsam: 25% des Blocks wird zu Schaden (max. 2)", "+ Rüstung 1, Nahkampfschaden +2", "- Kein Fern- oder Zauberbonus"],
      passive: { id: "unbeugsam", name: "Unbeugsam", text: "Am Zugende gehen 25% deines übrigen Blocks als Schaden an den ersten Gegner (höchstens 2)." },
      deck: ["hieb", "wuchtschlag", "wirbel", "deckung"], shopBasics: [],
      weapon: "rostiges_schwert", starterWeapons: ["rostiges_schwert", "flammenschwert", "giftdolch"], items: [],
    },
  },

  cards: {
    hieb:        { name: "Hieb", cost: 1, tags: ["nahkampf", "angriff"], text: "Schaden: 4 + Waffe.",
                   play: [{ action: "damage", base: 4, weaponScale: 1 }] },
    wuchtschlag: { name: "Wuchtschlag", cost: 2, pools: ["nahkaempfer"], tags: ["nahkampf", "angriff"], text: "Schaden: 11 + 3x Waffe.",
                   play: [{ action: "damage", base: 11, weaponScale: 3 }] },
    wirbel:      { name: "Wirbel", cost: 2, pools: ["nahkaempfer"], tags: ["nahkampf", "flaeche"], text: "Schaden an ALLEN: 3 + Waffe.",
                   play: [{ action: "damage", base: 3, weaponScale: 1, target: "all" }] },
    deckung:     { name: "Deckung", cost: 1, tags: ["block"], text: "6 Block.",
                   play: [{ action: "block", value: 6 }] },
    schildwall:  { name: "Schildwall", cost: 2, rarity: "ungewoehnlich", tags: ["block"], text: "13 Block.",
                   play: [{ action: "block", value: 13 }] },
    adrenalin:   { name: "Adrenalin", cost: 0, rarity: "ungewoehnlich", tags: ["utility"], text: "Ziehe 2 Karten.",
                   play: [{ action: "draw", value: 2 }] },
    schwachstelle: { name: "Schwachstelle", cost: 1, tags: ["debuff"], text: "2x Verwundbar (+50% Schaden).",
                   play: [{ action: "status", status: "verwundbar", stacks: 2 }] },

    // Elementkarten für Wasser und Pflanze (Feuer liegt im Feuer-Set)
    wasserstrahl: { name: "Wasserstrahl", cost: 2, element: "wasser", tags: ["angriff"], text: "Wasserschaden: 10 + 2x Waffe.",
                    play: [{ action: "damage", base: 10, weaponScale: 2 }] },
    flutwelle:    { name: "Flutwelle", cost: 2, rarity: "ungewoehnlich", element: "wasser", tags: ["flaeche"], text: "Wasserschaden an ALLEN: 4 + 0,5x Waffe.",
                    play: [{ action: "damage", base: 4, weaponScale: 0.5, target: "all" }] },
    dornenpeitsche: { name: "Dornenpeitsche", cost: 1, element: "pflanze", tags: ["angriff", "blut"], text: "Pflanzenschaden: 3 + 0,5x Waffe. 3 Blutung.",
                    play: [{ action: "damage", base: 3, weaponScale: 0.5 }, { action: "status", status: "blutung", stacks: 3 }] },
  },

  weapons: {
    rostiges_schwert: { name: "Rostiges Schwert", starter: true, pools: ["nahkaempfer"], power: 2, tags: ["waffe", "nahkampf"] },
  },

  items: {
    // --- Wasser / Pflanze ---
    quellstein:    { name: "Quellstein", tags: ["wasser", "item"],
      passives: [{ trigger: "damage_calc", cardTag: "wasser", op: "add", value: 2 }], text: "Wasserkarten: +2 Schaden." },
    gezeitenperle: { name: "Gezeitenperle", rarity: "ungewoehnlich", tags: ["wasser", "item", "block"],
      passives: [{ trigger: "on_card_played", cardTag: "wasser", action: "block", value: 3, maxPerTurn: 4 }], text: "Wasserkarte gespielt: 3 Block (max. 4/Zug)." },
    treibholz:     { name: "Treibholz", tags: ["wasser", "item", "block"],
      passives: [{ trigger: "on_turn_start", action: "block", perTag: "wasser", value: 2, cap: 8, oncePerCombat: true }], text: "Erster Zug jedes Kampfes: 2 Block pro Wasser-Tag (max. 8)." },
    dornenring:    { name: "Dornenring", tags: ["pflanze", "item"],
      passives: [{ trigger: "damage_calc", cardTag: "pflanze", op: "add", value: 2 }], text: "Pflanzenkarten: +2 Schaden." },
    sporenbeutel:  { name: "Sporenbeutel", rarity: "ungewoehnlich", tags: ["pflanze", "gift", "item"],
      passives: [{ trigger: "on_card_played", cardTag: "pflanze", action: "status", status: "gift", stacks: 1, target: "random_enemy", maxPerTurn: 3 }],
      text: "Pflanzenkarte gespielt: 1 Gift auf einen Gegner (max. 3/Zug)." },
    wurzelherz:    { name: "Wurzelherz", rarity: "selten", tags: ["pflanze", "item", "heilung"],
      passives: [{ trigger: "on_turn_start", action: "heal", perTag: "pflanze", value: 1, cap: 2 }], text: "Zugbeginn: heile 1 HP pro Pflanzen-Tag (max. 2)." },
    eisenpanzer: { name: "Eisenpanzer", tags: ["block", "item"],
      passives: [{ trigger: "on_turn_start", action: "block", value: 4, oncePerCombat: true }], text: "Erster Zug jedes Kampfes: 4 Block." },
    vielfaltsmedaille: { name: "Vielfaltsmedaille", text: "Alle Karten: +1 Schaden pro verschiedenem Typ im Build (max. +3).", rarity: "selten", tags: ["item", "utility"],
      // Belohnt gemischte Builds: +1 Schaden pro verschiedenem Typ-Tag, max. +3
      passives: [{ trigger: "damage_calc", perDistinct: true, op: "add", value: 1, cap: 3 }] },
    kleeblatt: { name: "Kleeblatt", text: "+2 Glück (bessere Seltenheiten bei Belohnungen).", tags: ["item", "glueck"], stats: { luck: 2 } },
    glueckswuerfel: { name: "Glückswürfel", text: "+4 Glück (bessere Seltenheiten bei Belohnungen).", rarity: "selten", tags: ["item", "glueck"], stats: { luck: 4 } },
    prismalinse: { name: "Prismalinse", text: "Elementare Resistenzen werden ignoriert.", rarity: "selten", tags: ["item"],
      // Elementare Resistenzen werden ignoriert (Schaden gegen resistente Gegner nie unter x1)
      passives: [{ trigger: "damage_calc", op: "ignore_resist" }] },
    jaegerauge: { name: "Jägerauge", text: "Elementare Schwächen wirken stärker (x1,5 wird x1,75).", rarity: "ungewoehnlich", tags: ["item"],
      // Elementare Schwächen wirken stärker (x1,5 wird x1,75)
      passives: [{ trigger: "damage_calc", op: "amplify_weakness", value: 0.25 }] },
  },

  enemies: {
    ratte:   { name: "Ratte",   hp: 10, pattern: [{ type: "attack", value: 4 }] },
    goblin:  { name: "Goblin",  hp: 22, pattern: [{ type: "attack", value: 8 }, { type: "attack", value: 5 }] },
    skelett: { name: "Skelett", hp: 28, pattern: [{ type: "attack", value: 9 }, { type: "block", value: 8 }] },
    bandit:  { name: "Bandit",  hp: 26, pattern: [{ type: "attack", value: 5 }, { type: "attack", value: 3, hits: 2 }, { type: "block", value: 6 }] },
    steingolem: { name: "Steingolem", hp: 130,
      pattern: [{ type: "block", value: 14 }, { type: "attack", value: 22 }, { type: "attack", value: 12 }] },
    knochenhauptmann: { name: "Knochenhauptmann", hp: 245,
      pattern: [{ type: "attack", value: 14 }, { type: "block", value: 16 }, { type: "attack", value: 6, hits: 3 }] },
  },

  encounters: {
    kellerratten:     { kind: "intro", name: "Kellerratten (erster Kampf)", waves: [["ratte", "ratte", "ratte"]] },
    rattenschwarm:    { name: "Rattenschwarm (große Welle, schwache Gegner)", waves: [["ratte", "ratte", "ratte", "ratte", "ratte"], ["goblin", "goblin"]] },
    wachposten:       { name: "Wachposten (gemischt)", waves: [["goblin", "skelett", "goblin"]] },
    steinwaechter:    { kind: "elite", name: "Steinwächter (ein tankiger Gegner)", waves: [["steingolem"]] },
    banditenbande:    { kind: "miniboss", name: "Banditenbande (5 Mini-Bosse)", waves: [["bandit", "bandit", "bandit", "bandit", "bandit"]] },
    knochenhauptmann: { kind: "miniboss", name: "Knochenhauptmann (Mini-Boss allein)", waves: [["knochenhauptmann"]] },
  },
};



});
__define("content/packs/feuer.js", function (__exports, __require) {
// FEUER-SET
__exports.default = {
  id: "feuer",
  name: "Feuer",
  cards: {
    flammenhieb: { name: "Flammenhieb", cost: 1, element: "feuer", tags: ["nahkampf", "angriff"], text: "Feuerschaden: 4 + Waffe.",
      play: [{ action: "damage", base: 4, weaponScale: 1 }] },
    feuerball:   { name: "Feuerball", cost: 2, rarity: "ungewoehnlich", element: "feuer", tags: ["flaeche"], text: "Feuerschaden an ALLEN: 5 + 0,5x Waffe.",
      play: [{ action: "damage", base: 5, weaponScale: 0.5, target: "all" }] },
    inferno:     { name: "Inferno", unlock: { type: "runs", count: 2 }, cost: 3, rarity: "selten", element: "feuer", tags: ["flaeche"], text: "Feuerschaden an ALLEN: 9 + Waffe.",
      play: [{ action: "damage", base: 9, weaponScale: 1, target: "all" }] },
    phoenixschlag: { name: "Phönixschlag", unlock: { type: "wins", count: 1 }, cost: 2, rarity: "legendaer", element: "feuer", tags: ["angriff"], text: "Feuerschaden: 14 + 2x Waffe. Ziehe 1 Karte.",
      play: [{ action: "damage", base: 14, weaponScale: 2 }, { action: "draw", value: 1 }] },
  },
  weapons: {
    flammenschwert: { name: "Flammenschwert", starter: true, pools: ["nahkaempfer"], power: 1, tags: ["waffe", "nahkampf", "feuer"],
      passives: [{ trigger: "damage_calc", cardTag: "feuer", op: "add", value: 1 }] },
  },
  items: {
    funkenfeuerzeug: { name: "Funkenfeuerzeug", tags: ["feuer", "item"],
      passives: [{ trigger: "on_card_played", cardTag: "feuer", chance: 0.3, action: "damage", value: 3, target: "random_enemy", maxPerTurn: 3 }],
      text: "Feuerkarte gespielt: 30% Chance auf 3 Schaden an einen Gegner." },
    lavaruestung: { name: "Lavarüstung", rarity: "ungewoehnlich", tags: ["feuer", "item", "ruestung", "dornen"],
      passives: [{ trigger: "on_player_hit", action: "damage_all", value: 2, maxPerTurn: 2 }], text: "Du wirst getroffen: 2 Schaden an ALLE (max. 2/Zug)." },
    glutschale:   { name: "Glutschale", rarity: "ungewoehnlich", tags: ["feuer", "item", "block"],
      passives: [{ trigger: "on_turn_start", action: "block", perTag: "feuer", value: 2, cap: 8, oncePerCombat: true }], text: "Erster Zug jedes Kampfes: 2 Block pro Feuer-Tag (max. 8)." },
    aschemantel:  { name: "Aschemantel", rarity: "selten", tags: ["feuer", "item", "ruestung"],
      passives: [{ trigger: "damage_calc", cardTag: "feuer", requires: { tag: "feuer", count: 4 }, op: "add", value: 3 }], text: "Ab 4 Feuer-Tags: Feuerkarten +3 Schaden." },
    glutstein: { name: "Glutstein", text: "Feuerkarten: +2 Schaden.", tags: ["feuer", "item"],
      passives: [{ trigger: "damage_calc", cardTag: "feuer", op: "add", value: 2 }] },
    schmiedeherz: { name: "Schmiedeherz", text: "Feuerkarten: +1 Schaden pro Feuer-Tag (max. +4).", rarity: "selten", tags: ["feuer", "item"],
      // Tag-Zählung: +1 Schaden pro Feuer-Tag im Build, max. +4
      passives: [{ trigger: "damage_calc", cardTag: "feuer", perTag: "feuer", op: "add", value: 1, cap: 4 }] },
    flammenkrone: { name: "Flammenkrone", text: "Ab 6 Feuer-Tags: Feuerkarten +25% Schaden.", unlock: { type: "wins", count: 1 }, rarity: "legendaer", tags: ["feuer", "item"],
      // Set-Bonus: ab 6 Feuer-Tags +25% Schaden für Feuer-Karten
      passives: [{ trigger: "damage_calc", cardTag: "feuer", requires: { tag: "feuer", count: 6 }, op: "pct", value: 0.25 }] },
  },
  enemies: {
    glutgeist: { immune: ["eingefroren"], name: "Glutgeist", hp: 24, elements: ["feuer"], pattern: [{ type: "attack", value: 8 }, { type: "attack", value: 5 }] },
  },
  encounters: {
    gluthoehle: { tier: 2, name: "Glutöhle (Feuergeister)", waves: [["glutgeist", "glutgeist", "glutgeist"]] },
  },
};



});
__define("content/packs/gift.js", function (__exports, __require) {
// GIFT-SET
__exports.default = {
  id: "gift",
  name: "Gift",
  cards: {
    giftklinge: { name: "Giftklinge", cost: 1, tags: ["gift", "nahkampf", "angriff"], text: "Schaden: 3 + 0,5x Waffe. 4 Gift.",
      play: [{ action: "damage", base: 3, weaponScale: 0.5 }, { action: "status", status: "gift", stacks: 4 }] },
    giftwolke:  { name: "Giftwolke", cost: 2, rarity: "ungewoehnlich", tags: ["gift", "flaeche"], text: "3 Gift auf ALLE.",
      play: [{ action: "status", status: "gift", stacks: 3, target: "all" }] },
    pandemie:   { name: "Pandemie", unlock: { type: "runs", count: 2 }, cost: 2, rarity: "selten", tags: ["gift", "flaeche"], text: "Verdopple das Gift ALLER Gegner.",
      play: [{ action: "multiplyStatus", status: "gift", factor: 2, target: "all" }] },
  },
  weapons: {
    giftdolch: { name: "Giftdolch", starter: true, pools: ["nahkaempfer"], power: 1, tags: ["waffe", "nahkampf", "gift"],
      passives: [{ trigger: "on_card_played", cardTag: "gift", action: "status", status: "gift", stacks: 1, target: "event_target", maxPerTurn: 3 }] },
  },
  items: {
    giftzahn:     { name: "Giftzahn", tags: ["gift", "item"],
      passives: [{ trigger: "damage_calc", cardTag: "gift", op: "add", value: 2 }], text: "Giftkarten: +2 Schaden." },
    schierlingsflasche: { name: "Schierlingsflasche", rarity: "ungewoehnlich", tags: ["gift", "item"],
      passives: [{ trigger: "on_turn_start", action: "status", status: "gift", stacks: 2, target: "random_enemy" }], text: "Zugbeginn: 2 Gift auf einen zufälligen Gegner." },
    miasmaflasche: { name: "Miasmaflasche", rarity: "ungewoehnlich", tags: ["gift", "item"],
      passives: [{ trigger: "on_status_applied", whenStatus: "gift", chance: 0.3, action: "damage", value: 2, target: "event_target", maxPerTurn: 4 }],
      text: "Gift aufgetragen: 30% Chance auf 2 Schaden (max. 4/Zug)." },
    leichengift:  { name: "Leichengift", rarity: "selten", tags: ["gift", "item"], maxStack: 1,
      passives: [{ trigger: "on_kill", action: "status_all", status: "gift", stacks: 2, maxPerTurn: 3 }], text: "Gegner besiegt: 2 Gift auf ALLE übrigen (max. 3/Zug)." },
    apothekerwaage: { name: "Apothekerwaage", rarity: "selten", tags: ["gift", "item"],
      passives: [{ trigger: "damage_calc", requires: { tag: "gift", count: 4 }, op: "pct", value: 0.2 }], text: "Ab 4 Gift-Tags: ALLE Karten +20% Schaden." },
    seuchenkoenig: { name: "Seuchenkönig", unlock: { type: "wins", count: 2 }, rarity: "legendaer", tags: ["gift", "item"], maxStack: 1,
      passives: [{ trigger: "on_status_applied", whenStatus: "gift", action: "status_all", status: "gift", stacks: 1, maxPerTurn: 2 }],
      text: "Gift aufgetragen: 1 Gift auf ALLE Gegner (max. 2/Zug)." },
    giftring: { name: "Giftring", text: "Giftkarte gespielt: 1 Gift auf einen zufälligen Gegner (max. 2/Zug).", tags: ["gift", "item"],
      passives: [{ trigger: "on_card_played", cardTag: "gift", action: "status", status: "gift", stacks: 1, target: "random_enemy", maxPerTurn: 2 }] },
    seuchenbeutel: { name: "Seuchenbeutel", text: "Gift aufgetragen: Ziel wird 1x Verwundbar (max. 2/Zug).", rarity: "ungewoehnlich", tags: ["gift", "item"],
      // Trigger-Kette: Gift aufgetragen -> Ziel wird verwundbar -> ALLE Builds profitieren
      passives: [{ trigger: "on_status_applied", whenStatus: "gift", action: "status", status: "verwundbar", stacks: 1, target: "event_target", maxPerTurn: 2 }] },
  },
};



});
__define("content/packs/blut.js", function (__exports, __require) {
// BLUT-SET
__exports.default = {
  id: "blut",
  name: "Blut",
  cards: {
    aufschlitzen: { name: "Aufschlitzen", cost: 1, pools: ["nahkaempfer"], tags: ["blut", "nahkampf", "angriff"], text: "Schaden: 3 + 0,5x Waffe. 4 Blutung.",
      play: [{ action: "damage", base: 3, weaponScale: 0.5 }, { action: "status", status: "blutung", stacks: 4 }] },
    blutrausch:   { name: "Blutrausch", cost: 2, rarity: "ungewoehnlich", pools: ["nahkaempfer"], tags: ["blut", "angriff"], text: "Schaden: 6 + 1,5x Waffe, +2 pro Blutung auf dem Ziel.",
      play: [{ action: "damage", base: 6, weaponScale: 1.5, bonusPerStatus: { status: "blutung", value: 2 } }] },
  },
  items: {
    blutegel:     { name: "Blutegel", tags: ["blut", "item", "heilung"],
      passives: [{ trigger: "on_status_applied", whenStatus: "blutung", action: "heal", value: 1, maxPerTurn: 3 }], text: "Blutung aufgetragen: heile 1 HP (max. 3/Zug)." },
    rasiermesser: { name: "Rasiermesser", tags: ["blut", "item"],
      passives: [{ trigger: "damage_calc", cardTag: "blut", op: "add", value: 2 }], text: "Blutkarten: +2 Schaden." },
    vampirzahn:   { name: "Vampirzahn", rarity: "ungewoehnlich", tags: ["blut", "item", "heilung"],
      passives: [{ trigger: "on_kill", action: "heal", value: 4, maxPerTurn: 2 }], text: "Gegner besiegt: heile 4 HP (max. 2/Zug)." },
    dornenkrone:  { name: "Dornenkrone", rarity: "ungewoehnlich", tags: ["blut", "item", "dornen"],
      passives: [{ trigger: "on_player_hit", action: "status", status: "blutung", stacks: 3, target: "event_target", maxPerTurn: 3 }],
      text: "Wer dich trifft, blutet (3 Blutung, max. 3/Zug)." },
    blutmond:     { name: "Blutmond", rarity: "selten", tags: ["blut", "item"],
      passives: [{ trigger: "damage_calc", cardTag: "blut", requires: { tag: "blut", count: 4 }, op: "pct", value: 0.25 }], text: "Ab 4 Blut-Tags: Blutkarten +25% Schaden." },
    opferdolch:   { name: "Opferdolch", rarity: "selten", tags: ["blut", "item", "pakt"], maxStack: 1,
      passives: [{ trigger: "on_turn_start", action: "hurt", value: 2 }, { trigger: "damage_calc", op: "add", value: 4 }],
      text: "Zugbeginn: -2 HP. Alle Karten +4 Schaden." },
    blutkelch: { name: "Blutkelch", text: "Blutung aufgetragen: 2 Schaden (max. 4/Zug).", rarity: "ungewoehnlich", tags: ["blut", "item"],
      passives: [{ trigger: "on_status_applied", whenStatus: "blutung", action: "damage", value: 2, target: "event_target", maxPerTurn: 4 }] },
  },
};



});
__define("content/packs/frost.js", function (__exports, __require) {
// FROST-SET: Beispiel für ein NACHTRÄGLICH hinzugefügtes Element.
// Es bringt ein neues Element mit, und "elementRelations" ändert, wie ANDERE Elemente gegen Eis wirken.
__exports.default = {
  id: "frost",
  name: "Frost",
  elements: {
    eis: { name: "Eis", color: "#7fd6ff", strong: ["pflanze", "wasser"], weak: ["feuer"] },
  },
  elementRelations: [
    { from: "feuer",  to: "eis", mult: 1.5 },   // Feuer schmilzt Eis
    { from: "wasser", to: "eis", mult: 0.5 },   // Wasser beeindruckt Eis kaum
  ],
  reactions: {
    schmelzen:   { name: "Schmelzen",  pair: ["feuer", "eis"],   effects: [{ action: "status", status: "verwundbar", stacks: 2 }, { action: "damage", value: 2 }] },
    frostschock: { name: "Frostschock", pair: ["wasser", "eis"], effects: [{ action: "block", value: 4 }, { action: "status", status: "verwundbar", stacks: 1 }] },
    dornenfrost: { name: "Dornenfrost", pair: ["pflanze", "eis"], effects: [{ action: "status", status: "blutung", stacks: 4 }] },
  },
  cards: {
    eissplitter: { name: "Eissplitter", cost: 2, element: "eis", tags: ["angriff"], text: "Eisschaden: 8 + 1,5x Waffe. 1 Verwundbar, 1 Kälte.",
      play: [{ action: "damage", base: 8, weaponScale: 1.5 }, { action: "status", status: "verwundbar", stacks: 1 }, { action: "status", status: "frost", stacks: 1 }] },
    frostnova:   { name: "Frostnova", cost: 2, rarity: "ungewoehnlich", element: "eis", tags: ["flaeche"], text: "Eisschaden an ALLEN: 3 + 0,5x Waffe. 1 Verwundbar und 1 Kälte auf ALLE.",
      play: [{ action: "damage", base: 3, weaponScale: 0.5, target: "all" }, { action: "status", status: "verwundbar", stacks: 1, target: "all" }, { action: "status", status: "frost", stacks: 1, target: "all" }] },
    eiszeit:     { name: "Eiszeit", unlock: { type: "runs", count: 2 }, cost: 2, rarity: "selten", element: "eis", tags: ["flaeche"], text: "Eisschaden an ALLEN: 4 + Waffe. 1 Verwundbar und 2 Kälte auf ALLE.",
      play: [{ action: "damage", base: 4, weaponScale: 1, target: "all" }, { action: "status", status: "verwundbar", stacks: 1, target: "all" }, { action: "status", status: "frost", stacks: 2, target: "all" }] },
  },
  weapons: {
    frostklinge: { name: "Frostklinge", rarity: "ungewoehnlich", pools: ["nahkaempfer"], power: 1, tags: ["waffe", "nahkampf", "eis"],
      passives: [{ trigger: "damage_calc", cardTag: "eis", op: "add", value: 1 }] },
  },
  items: {
    raureif:      { name: "Raureif", tags: ["eis", "item", "block"],
      passives: [{ trigger: "on_turn_start", action: "block", perTag: "eis", value: 2, cap: 8, oncePerCombat: true }], text: "Erster Zug jedes Kampfes: 2 Block pro Eis-Tag (max. 8)." },
    eiszapfen:    { name: "Eiszapfen", tags: ["eis", "item"],
      passives: [{ trigger: "on_card_played", cardTag: "eis", action: "damage", value: 2, target: "event_target", maxPerTurn: 4 }], text: "Eiskarte gespielt: 2 Schaden (max. 4/Zug)." },
    schneekugel:  { name: "Schneekugel", rarity: "ungewoehnlich", tags: ["eis", "item", "debuff"],
      passives: [{ trigger: "on_turn_end", chance: 0.5, action: "status_all", status: "frost", stacks: 1 }], text: "Zugende: 50% Chance, allen Gegnern 1 Kälte zu geben." },
    kaelteamulett: { name: "Kälteamulett", rarity: "selten", tags: ["eis", "item"], maxStack: 1, stats: { freezeEase: 1 },
      passives: [{ trigger: "damage_calc", cardTag: "eis", requires: { tag: "eis", count: 4 }, op: "pct", value: 0.25 }], text: "Gegner frieren schon bei 2 Kälte ein. Ab 4 Eis-Tags: Eiskarten +25% Schaden." },
    herz_des_winters: { name: "Herz des Winters", unlock: { type: "wins", count: 1 }, rarity: "legendaer", tags: ["eis", "item"], maxStack: 1,
      passives: [{ trigger: "on_combat_start", action: "status_all", status: "frost", stacks: 2 }, { trigger: "on_combat_start", action: "status_all", status: "verwundbar", stacks: 2 }, { trigger: "damage_calc", cardTag: "eis", op: "add", value: 3 }],
      text: "Kampfbeginn: alle Gegner 2 Kälte und 2x Verwundbar. Eiskarten +3 Schaden." },
    eiskristall: { name: "Eiskristall", text: "Eiskarten: +2 Schaden.", rarity: "ungewoehnlich", tags: ["eis", "item"],
      passives: [{ trigger: "damage_calc", cardTag: "eis", op: "add", value: 2 }] },
    frostherz: { name: "Frostherz", text: "Eiskarte gespielt: 1 Kälte auf einen Gegner (max. 2/Zug).", rarity: "selten", tags: ["eis", "item"],
      passives: [{ trigger: "on_card_played", cardTag: "eis", action: "status", status: "frost", stacks: 1, target: "random_enemy", maxPerTurn: 2 }] },
  },
  enemies: {
    frostwolf: { name: "Frostwolf", hp: 26, elements: ["eis"], pattern: [{ type: "attack", value: 9 }, { type: "attack", value: 6 }] },
  },
  encounters: {
    frostmeute: { tier: 2, name: "Frostmeute (Wolfsrudel)", waves: [["frostwolf", "frostwolf", "frostwolf"]] },
    eliterudel: { kind: "elite", tier: 2, name: "Eisrudel (Elite)", waves: [["frostwolf", "frostwolf", "frostwolf", "frostwolf"]] },
  },
};



});
__define("content/packs/wildnis.js", function (__exports, __require) {
// WILDNIS-SET: Gegner mit Elementen, auch ein Doppel-Element (Sumpfgeist = Pflanze + Wasser).
__exports.default = {
  id: "wildnis",
  name: "Wildnis",
  enemies: {
    dornenranke: { name: "Dornenranke", hp: 18, elements: ["pflanze"], pattern: [{ type: "attack", value: 6 }, { type: "attack", value: 3, hits: 2 }] },
    flussgeist:  { name: "Flussgeist", hp: 24, elements: ["wasser"],  pattern: [{ type: "attack", value: 7 }, { type: "block", value: 6 }] },
    sumpfgeist:  { name: "Sumpfgeist", hp: 45, elements: ["pflanze", "wasser"], pattern: [{ type: "block", value: 8 }, { type: "attack", value: 10 }] },
  },
  encounters: {
    pflanzenhain: { tier: 2, name: "Pflanzenhain (Ranken + Sumpfgeist)", waves: [["dornenranke", "dornenranke", "dornenranke", "sumpfgeist"]] },
    sumpfwacht:   { kind: "elite", tier: 2, name: "Sumpfwacht (Elite)", waves: [["dornenranke", "dornenranke", "sumpfgeist", "sumpfgeist"]] },
    flussufer:    { tier: 2, name: "Flussufer (Wassergeister)", waves: [["flussgeist", "flussgeist", "sumpfgeist"]] },
  },
};



});
__define("content/packs/ausruestung.js", function (__exports, __require) {
// AUSRÜSTUNGS-SET: elementlose Items. Meist Stat-Boni (wie bei Brotato), dazu Trigger-Items und Pakte (Vor- UND Nachteil).
// stats: maxHp | energy | handSize | luck | goldPct | regen | blockStart | shiny  (Summe über alle gestapelten Items)
__exports.default = {
  id: "ausruestung",
  name: "Ausrüstung",
  items: {
    // --- gewöhnlich ---
    lederweste:    { name: "Lederweste", tags: ["item", "ruestung"], stats: { maxHp: 8 }, text: "+8 Max-HP." },
    eisenhelm:     { name: "Eisenhelm", tags: ["item", "ruestung", "block"], passives: [{ trigger: "on_turn_start", action: "block", value: 6, oncePerCombat: true }], text: "Erster Zug jedes Kampfes: 6 Block." },
    muenzbeutel:   { name: "Münzbeutel", tags: ["item", "gold"], stats: { goldPct: 15 }, text: "+15% Gold." },
    feldflasche:   { name: "Feldflasche", tags: ["item", "heilung"], stats: { regen: 5 }, text: "Heile 5 HP nach jedem Kampf." },
    hasenpfote:    { name: "Hasenpfote", tags: ["item", "glueck", "gold"], stats: { luck: 1, goldPct: 10 }, text: "+1 Glück, +10% Gold." },
    wetzstein:     { name: "Wetzstein", tags: ["item", "angriff"],
                     passives: [{ trigger: "damage_calc", cardTag: "nahkampf", op: "add", value: 1 }], text: "Nahkampfkarten: +1 Schaden." },
    notfallration: { name: "Notfallration", tags: ["item", "heilung"],
                     passives: [{ trigger: "on_combat_start", action: "heal", value: 5 }], text: "Heile 5 HP zu Kampfbeginn." },

    // --- ungewöhnlich ---
    rucksack:      { name: "Rucksack", rarity: "ungewoehnlich", tags: ["item"], stats: { handSize: 1 }, maxStack: 2, text: "+1 Handkarte." },
    ledergurt:     { name: "Ledergurt", rarity: "ungewoehnlich", tags: ["item", "ruestung", "block"], stats: { maxHp: 4 }, passives: [{ trigger: "on_turn_start", action: "block", value: 3, oncePerCombat: true }], text: "+4 Max-HP. Erster Zug jedes Kampfes: 3 Block." },
    dornenruestung: { name: "Dornenrüstung", rarity: "ungewoehnlich", tags: ["item", "ruestung", "dornen"],
                     passives: [{ trigger: "on_player_hit", action: "damage", value: 3, target: "event_target", maxPerTurn: 4 }],
                     text: "Wer dich trifft, nimmt 3 Schaden." },
    kampfhorn:     { name: "Kampfhorn", rarity: "ungewoehnlich", tags: ["item", "debuff"],
                     passives: [{ trigger: "on_combat_start", action: "status_all", status: "verwundbar", stacks: 1 }],
                     text: "Kampfbeginn: alle Gegner 1x Verwundbar." },
    adrenalinpumpe: { name: "Adrenalinpumpe", rarity: "ungewoehnlich", tags: ["item"],
                     passives: [{ trigger: "on_kill", action: "draw", value: 1, maxPerTurn: 2 }], text: "Besiegter Gegner: ziehe 1 Karte (max. 2/Zug)." },
    beutegier:     { name: "Beutegier", rarity: "ungewoehnlich", tags: ["item", "heilung"],
                     passives: [{ trigger: "on_kill", action: "heal", value: 2, maxPerTurn: 3 }], text: "Besiegter Gegner: heile 2 HP (max. 3/Zug)." },
    kriegstrommel: { name: "Kriegstrommel", rarity: "ungewoehnlich", tags: ["item"],
                     passives: [{ trigger: "on_turn_start", chance: 0.25, action: "energy", value: 1 }], text: "Zugbeginn: 25% Chance auf +1 Energie." },
    echostein:     { name: "Echostein", rarity: "ungewoehnlich", tags: ["item"],
                     passives: [{ trigger: "on_card_played", chance: 0.15, action: "draw", value: 1, maxPerTurn: 2 }], text: "Karte gespielt: 15% Chance, 1 Karte zu ziehen (max. 2/Zug)." },
    meisterhammer: { name: "Meisterhammer", rarity: "ungewoehnlich", tags: ["item", "angriff"],
                     passives: [{ trigger: "damage_calc", cardTag: "nahkampf", op: "pct", value: 0.2 }], text: "Nahkampfkarten: +20% Schaden." },
    taschenuhr:    { name: "Taschenuhr", rarity: "ungewoehnlich", tags: ["item"],
                     passives: [{ trigger: "on_turn_start", chance: 0.3, action: "draw", value: 1 }], text: "Zugbeginn: 30% Chance, 1 Karte zu ziehen." },

    // --- selten ---
    energiekristall: { name: "Energiekristall", rarity: "selten", tags: ["item"], stats: { energy: 1, handSize: -1, maxHp: -8 }, maxStack: 1, text: "+1 Energie pro Zug, aber 1 Handkarte weniger und -8 Max-HP." },
    blutpakt:      { name: "Blutpakt", rarity: "selten", tags: ["item", "pakt"], stats: { energy: 1, maxHp: -20 }, maxStack: 1, text: "+1 Energie, -20 Max-HP." },
    glaskanone:    { name: "Glaskanone", rarity: "selten", tags: ["item", "pakt"], stats: { maxHp: -15 }, maxStack: 2,
                     passives: [{ trigger: "damage_calc", op: "pct", value: 0.4 }], text: "+40% Schaden, -15 Max-HP." },
    goldene_waage: { name: "Goldene Waage", rarity: "selten", tags: ["item", "gold"], stats: { goldPct: 40 }, maxStack: 1, text: "+40% Gold." },
    kartenhaus:    { name: "Kartenhaus", rarity: "selten", tags: ["item", "pakt"], stats: { handSize: 2, maxHp: -8 }, maxStack: 1, text: "+2 Handkarten, -8 Max-HP." },
    schillernder_charme: { name: "Schillernder Charme", rarity: "selten", tags: ["item", "glueck"], stats: { shiny: 1 }, maxStack: 2,
                     text: "Verdoppelt deine Shiny-Chance (zweiter Charme: verdreifacht)." },

    // --- legendär ---
    phoenixfeder:  { name: "Phönixfeder", unlock: { type: "wins", count: 1 }, rarity: "legendaer", tags: ["item", "heilung"], stats: { maxHp: 10, regen: 12 }, maxStack: 1, text: "+10 Max-HP, heile 12 HP nach jedem Kampf." },
  },
};



});
__define("content/packs/boss.js", function (__exports, __require) {
// ENDBOSS-SET. Der Elementarwandler soll nicht nur viele HP haben, sondern kluges Spielen verlangen:
//  - Element-Wechsel: alle 2 Gegner-Züge wechselt sein Element (Feuer > Wasser > Pflanze > Eis). Die UI zeigt das nächste Element an.
//    Wer das passende Gegen-Element dabei hat (oder gemischte Builds spielt), macht viel mehr Schaden.
//  - Panzerplatten: Jeder Karten-TREFFER zerbricht nur 1 Platte (Schaden = 0). Viele billige Karten, Mehrfachtreffer und
//    Flächenschaden helfen. Gift/Blutung und Item-Effekte ignorieren Platten. Sind alle Platten weg, ist er 2 Züge verwundbar.
//  - Phase 2 (unter 50% HP): beschwört zwei Funken und bekommt neue Platten.
__exports.default = {
  id: "boss",
  name: "Endboss",
  enemies: {
    funke: { name: "Funke", hp: 16, elements: ["feuer"], pattern: [{ type: "attack", value: 5 }] },
    elementarwandler: {
      immune: ["aussetzen", "eingefroren"],   // Bestechung und Einfrieren wirken nicht auf den Endboss
      name: "Elementarwandler", hp: 230, elements: ["feuer"],
      mechanics: {
        rotateElement: { cycle: ["feuer", "wasser", "pflanze", "eis"], every: 2 },
        plates: { count: 5, regenAfter: 3 },
        phases: [{ hpBelow: 0.5, summon: ["funke", "funke"], setPlates: 6, text: "Der Wandler zerfällt in Funken und panzert sich neu!" }],
      },
      pattern: [{ type: "attack", value: 11 }, { type: "attack", value: 5, hits: 2 }, { type: "block", value: 12 }, { type: "attack", value: 16 }],
    },
  },
  encounters: {
    boss_wandler: { kind: "boss", name: "Elementarwandler (Endboss)", waves: [["elementarwandler"]] },
  },
};



});
__define("content/packs/events.js", function (__exports, __require) {
// ZUFALLSEREIGNISSE: Entscheidungen mit Risiko und Belohnung (viel RNG, passt zum Roguelite-Gefühl).
// Effekte: gold | heal | healPct | hurt (tötet nie) | maxHp | gainItem (minRarity) | gainCard (minRarity)
//          giveItem | giveCard | removeCard (zufällig) | gamble { chance, win, lose } | fight
// requires: { gold } sperrt eine Wahl, wenn zu wenig Gold da ist
__exports.default = {
  id: "events",
  name: "Ereignisse",
  events: {
    gluecksspieler: {
      name: "Der Glücksspieler", text: "Ein Mann mit drei Bechern fordert dich heraus.",
      choices: [
        { label: "40 Gold setzen (50%: 120 Gold)", requires: { gold: 40 }, effects: [{ type: "gold", value: -40 }, { type: "gamble", chance: 0.5, win: [{ type: "gold", value: 120 }], lose: [] }] },
        { label: "Weitergehen", effects: [] },
      ],
    },
    altar: {
      name: "Verlassener Altar", text: "Ein blutbefleckter Altar. Er scheint etwas zu verlangen.",
      choices: [
        { label: "Blut opfern (-10 HP): zufälliges Item (mind. ungewöhnlich)", effects: [{ type: "hurt", value: 10 }, { type: "gainItem", minRarity: "ungewoehnlich" }] },
        { label: "Beten: heile 12 HP", effects: [{ type: "heal", value: 12 }] },
        { label: "Ignorieren", effects: [] },
      ],
    },
    haendler_mo: {
      name: "Wanderhändler Mo", text: "Mo bietet an, dein Deck zu 'entrümpeln'.",
      choices: [
        { label: "Zufällige Karte entfernen (40 Gold)", requires: { gold: 40 }, effects: [{ type: "gold", value: -40 }, { type: "removeCard" }] },
        { label: "Nein danke", effects: [] },
      ],
    },
    quelle: {
      name: "Heilige Quelle", text: "Klares Wasser sprudelt aus dem Fels.",
      choices: [
        { label: "Trinken (60%: +20 HP, 40%: -8 HP)", effects: [{ type: "gamble", chance: 0.6, win: [{ type: "heal", value: 20 }], lose: [{ type: "hurt", value: 8 }] }] },
        { label: "Nur Flasche füllen: +3 Max-HP", effects: [{ type: "maxHp", value: 3 }] },
      ],
    },
    hinterhalt: {
      name: "Hinterhalt!", text: "Schatten lösen sich von den Wänden.",
      choices: [
        { label: "Kämpfen (normaler Kampf mit Belohnung)", effects: [{ type: "fight", kind: "kampf" }] },
        { label: "Fliehen (-15 Gold)", effects: [{ type: "gold", value: -15 }] },
      ],
    },
    truhe: {
      name: "Verdächtige Truhe", text: "Eine Truhe steht mitten im Gang. Zu mittig.",
      choices: [
        { label: "Öffnen (60%: Item, 40%: Falle -10 HP, +30 Gold)", effects: [{ type: "gamble", chance: 0.6, win: [{ type: "gainItem" }], lose: [{ type: "hurt", value: 10 }, { type: "gold", value: 30 }] }] },
        { label: "Liegen lassen", effects: [] },
      ],
    },
    kleeblattfeld: {
      name: "Kleeblattfeld", text: "Ein Feld voller Kleeblätter. Eines hat vier Blätter.",
      choices: [
        { label: "Das Vierblättrige pflücken", effects: [{ type: "giveItem", id: "kleeblatt" }] },
        { label: "Rasten: heile 8 HP", effects: [{ type: "heal", value: 8 }] },
      ],
    },
    alchemistin: {
      name: "Die Alchemistin", text: "Sie schwenkt einen dampfenden Trank.",
      choices: [
        { label: "Trank trinken (-6 HP): +6 Max-HP", effects: [{ type: "hurt", value: 6 }, { type: "maxHp", value: 6 }] },
        { label: "Zufällige Karte tauschen: 30 Gold", requires: { gold: 30 }, effects: [{ type: "gold", value: -30 }, { type: "removeCard" }, { type: "gainCard", minRarity: "ungewoehnlich" }] },
        { label: "Ablehnen", effects: [] },
      ],
    },
  },
};



});
__define("content/packs/fernkaempfer.js", function (__exports, __require) {
// FERNKÄMPFER-SET: Tempo, Mehrfachtreffer, Markieren und Ausweichen.
// Spielgefühl: wenig HP und kaum Block, dafür +1 Handkarte. Je mehr Karten in einem Zug gespielt werden, desto stärker
// wird "Schnellschuss". Markierte Ziele nehmen pro Treffer +2 Schaden, deshalb lohnen sich viele kleine Treffer.
// Ausweichen lässt ganze Treffer verpuffen (hält nur einen Zug).
__exports.default = {
  id: "fernkaempfer",
  name: "Fernkämpfer",

  classes: {
    fernkaempfer: {
      coreCards: ["salve", "giftpfeil", "fluchtschuss"], abilities: ["seelenpfeil", "schattentausch"], name: "Fernkämpfer", hp: 84, stats: { handSize: 1, dodge: 6, crit: 6, rangedDmg: 2 }, blurb: "Schnell und fragil: Je mehr Karten du spielst, desto stärker jeder Treffer. Markieren, Mehrfachtreffer, Ausweichen.",
      deck: ["schnellschuss", "zielen", "praezisionsschuss", "rolle"], shopBasics: [],
      perks: ["+ Eine Handkarte mehr (6)", "+ Mehrfachtreffer und Markieren", "+ Ausweichen 6%, Krit 6%, Fernkampfschaden +2", "- Weniger Leben: 84 Max-HP"],
      weapon: "kurzbogen", starterWeapons: ["kurzbogen", "armbrust", "giftbogen"], items: [],
    },
  },

  cards: {
    schnellschuss: { name: "Schnellschuss", cost: 1, pools: ["fernkaempfer"], tags: ["fernkampf", "angriff"],
      text: "Schaden: 3 + Waffe, +1 pro zuvor gespielter Karte in diesem Zug.",
      play: [{ action: "damage", base: 3, weaponScale: 1, bonusPerPlay: 1 }] },
    zielen:        { name: "Zielen", cost: 0, pools: ["fernkaempfer"], tags: ["fernkampf", "debuff"],
      text: "Markiere das Ziel (3 Züge): Treffer machen +1 Schaden.",
      play: [{ action: "status", status: "markiert", stacks: 3 }] },
    rolle:         { name: "Ausweichrolle", cost: 1, pools: ["fernkaempfer"], tags: ["fernkampf", "ausweichen"],
      text: "Weiche 1 Treffer aus. 4 Block.",
      play: [{ action: "playerStatus", status: "ausweichen", stacks: 1 }, { action: "block", value: 4 }] },
    praezisionsschuss: { name: "Präzisionsschuss", cost: 2, pools: ["fernkaempfer"], tags: ["fernkampf", "angriff"],
      text: "Schaden: 6 + 1,5x Waffe, +3 pro Markierung auf dem Ziel.",
      play: [{ action: "damage", base: 6, weaponScale: 1.5, bonusPerStatus: { status: "markiert", value: 3 } }] },

    giftpfeil:     { name: "Giftpfeil", cost: 2, pools: ["fernkaempfer"], tags: ["fernkampf", "gift", "angriff"],
      text: "Schaden: 4 + 1,5x Waffe. 6 Gift.",
      play: [{ action: "damage", base: 4, weaponScale: 1.5 }, { action: "status", status: "gift", stacks: 6 }] },
    brandpfeil:    { name: "Brandpfeil", cost: 2, element: "feuer", pools: ["fernkaempfer"], tags: ["fernkampf", "angriff"],
      text: "Feuerschaden: 8 + 2x Waffe.",
      play: [{ action: "damage", base: 8, weaponScale: 2 }] },
    eispfeil:      { name: "Eispfeil", cost: 2, element: "eis", pools: ["fernkaempfer"], tags: ["fernkampf", "angriff"],
      text: "Eisschaden: 6 + 1,5x Waffe. 1 Verwundbar, 1 Kälte.",
      play: [{ action: "damage", base: 6, weaponScale: 1.5 }, { action: "status", status: "verwundbar", stacks: 1 }, { action: "status", status: "frost", stacks: 1 }] },
    nachladen:     { name: "Nachladen", cost: 0, rarity: "ungewoehnlich", pools: ["fernkaempfer"], tags: ["fernkampf", "utility"],
      text: "Ziehe 2 Karten.",
      play: [{ action: "draw", value: 2 }] },
    salve:         { name: "Salve", cost: 2, rarity: "ungewoehnlich", pools: ["fernkaempfer"], tags: ["fernkampf", "angriff"],
      text: "3 Treffer: je 2 + 0,5x Waffe.",
      play: [{ action: "damage", base: 2, weaponScale: 0.5, hits: 3 }] },
    pfeilhagel:    { name: "Pfeilhagel", cost: 2, rarity: "ungewoehnlich", pools: ["fernkaempfer"], tags: ["fernkampf", "flaeche"],
      text: "2 Treffer auf ALLE: je 2 + 0,5x Waffe.",
      play: [{ action: "damage", base: 2, weaponScale: 0.5, hits: 2, target: "all" }] },
    fluchtschuss:  { name: "Fluchtschuss", cost: 2, rarity: "ungewoehnlich", pools: ["fernkaempfer"], tags: ["fernkampf", "ausweichen", "angriff"],
      text: "Schaden: 6 + 1,5x Waffe. Ziehe 1 Karte. Weiche 2 Treffern aus.",
      play: [{ action: "damage", base: 6, weaponScale: 1.5 }, { action: "draw", value: 1 }, { action: "playerStatus", status: "ausweichen", stacks: 2 }] },
    scharfschuetze: { name: "Scharfschuss", cost: 3, rarity: "selten", pools: ["fernkaempfer"], tags: ["fernkampf", "angriff"],
      text: "Schaden: 12 + 2x Waffe, +4 pro Markierung auf dem Ziel.",
      play: [{ action: "damage", base: 12, weaponScale: 2, bonusPerStatus: { status: "markiert", value: 4 } }] },
    dauerfeuer:    { name: "Dauerfeuer", cost: 2, rarity: "selten", pools: ["fernkaempfer"], tags: ["fernkampf", "angriff"],
      text: "6 Treffer: je 1 + 0,5x Waffe, +1 pro zuvor gespielter Karte.",
      play: [{ action: "damage", base: 1, weaponScale: 0.5, hits: 6, bonusPerPlay: 1 }] },
    pfeilsturm:    { name: "Pfeilsturm", cost: 3, rarity: "legendaer", unlock: { type: "wins", count: 1 }, pools: ["fernkaempfer"], tags: ["fernkampf", "flaeche"],
      text: "4 Treffer auf ALLE: je 2 + 0,5x Waffe.",
      play: [{ action: "damage", base: 2, weaponScale: 0.5, hits: 4, target: "all" }] },
  },

  weapons: {
    kurzbogen: { name: "Kurzbogen", starter: true, pools: ["fernkaempfer"], power: 1, tags: ["waffe", "fernkampf"],
      passives: [{ trigger: "damage_calc", cardTag: "fernkampf", op: "add", value: 1 }] },
    armbrust:  { name: "Armbrust", starter: true, pools: ["fernkaempfer"], power: 1, tags: ["waffe", "fernkampf"],     // Startwaffe: markiert das Ziel (passt zu Mehrfachtreffern)
      passives: [{ trigger: "on_card_played", cardTag: "fernkampf", action: "status", status: "markiert", stacks: 1, target: "event_target", maxPerTurn: 2 }] },
    giftbogen: { name: "Giftbogen", starter: true, pools: ["fernkaempfer"], power: 1, tags: ["waffe", "fernkampf", "gift"],
      passives: [{ trigger: "on_card_played", cardTag: "fernkampf", action: "status", status: "gift", stacks: 1, target: "event_target", maxPerTurn: 3 }] },
    jagdbogen: { name: "Jagdbogen", rarity: "selten", pools: ["fernkaempfer"], power: 2, tags: ["waffe", "fernkampf"],
      passives: [{ trigger: "on_card_played", cardTag: "fernkampf", chance: 0.2, action: "draw", value: 1, maxPerTurn: 2 }] },
  },

  items: {
    koecher: { name: "Köcher", pools: ["fernkaempfer"], tags: ["item", "fernkampf"],
      passives: [{ trigger: "damage_calc", cardTag: "fernkampf", op: "add", value: 1 }], text: "Fernkampfkarten: +1 Schaden." },
    munitionsgurt: { name: "Munitionsgurt", pools: ["fernkaempfer"], tags: ["item", "fernkampf"],
      passives: [{ trigger: "on_turn_start", chance: 0.35, action: "draw", value: 1 }], text: "Zugbeginn: 35% Chance, 1 Karte zu ziehen." },
    adlerauge: { name: "Adlerauge", rarity: "ungewoehnlich", pools: ["fernkaempfer"], tags: ["item", "fernkampf", "debuff"],
      passives: [{ trigger: "on_combat_start", action: "status_all", status: "markiert", stacks: 2 }], text: "Kampfbeginn: alle Gegner 2 Züge markiert." },
    leichtfuessig: { name: "Leichtfüßig", rarity: "ungewoehnlich", pools: ["fernkaempfer"], tags: ["item", "ausweichen"],
      passives: [{ trigger: "on_turn_start", action: "player_status", status: "ausweichen", stacks: 2, oncePerCombat: true }], text: "Erster Zug jedes Kampfes: weiche 2 Treffern aus." },
    jagdzeichen: { name: "Jagdzeichen", rarity: "selten", pools: ["fernkaempfer"], tags: ["item", "fernkampf", "debuff"],
      passives: [{ trigger: "on_card_played", cardTag: "fernkampf", chance: 0.3, action: "status", status: "markiert", stacks: 1, target: "random_enemy", maxPerTurn: 3 }],
      text: "Fernkampfkarte gespielt: 30% Chance, einen Gegner zu markieren." },
    zielfernrohr: { name: "Zielfernrohr", rarity: "selten", pools: ["fernkaempfer"], tags: ["item", "fernkampf"],
      passives: [{ trigger: "damage_calc", cardTag: "fernkampf", requires: { tag: "fernkampf", count: 6 }, op: "pct", value: 0.25 }],
      text: "Ab 6 Fernkampf-Tags: Fernkampfkarten +25% Schaden." },
  },
};



});
__define("content/packs/magier.js", function (__exports, __require) {
// MAGIER-SET: Elementar-Reaktionen. Zwei VERSCHIEDENE Elemente nacheinander im selben Zug lösen eine Reaktion aus
// (siehe "reactions" in core/frost). Der Magier hat wenig HP, wenig Block, aber Karten aller Elemente und Items,
// die Reaktionen verstärken. Mono-Element-Decks funktionieren weiter, nutzen Reaktionen aber nicht.
__exports.default = {
  id: "magier",
  name: "Magier",

  classes: {
    magier: {
      abilities: ["fluchblitz", "domain"], name: "Magier", hp: 70, stats: { elementDmg: 3, crit: 8 }, blurb: "Mischen wird belohnt: Zwei verschiedene Elemente nacheinander lösen Reaktionen aus. Wenig HP, viel Kombo.",
      deck: ["funke", "tropfen", "ranke", "manaschild"], shopBasics: [], coreCards: ["flammenwelle", "eisregen", "arkanblitz"],
      perks: ["+ Reaktionen: 2 Elemente nacheinander = Zusatzeffekt", "+ Elementarschaden +3, Krit 8%", "- Wenig Leben: 70 Max-HP"],
      weapon: "zauberstab", starterWeapons: ["zauberstab", "runenstab", "flammenstab"], items: [],
    },
  },

  cards: {
    funke:      { name: "Funke", cost: 1, element: "feuer", pools: ["magier"], tags: ["zauber", "angriff"],
      text: "Feuerschaden: 5 + 0,5x Waffe.", play: [{ action: "damage", base: 5, weaponScale: 0.5 }] },
    tropfen:    { name: "Wassertropfen", cost: 1, element: "wasser", pools: ["magier"], tags: ["zauber", "angriff"],
      text: "Wasserschaden: 4 + 0,5x Waffe. 2 Block.", play: [{ action: "damage", base: 4, weaponScale: 0.5 }, { action: "block", value: 2 }] },
    ranke:      { name: "Ranke", cost: 1, element: "pflanze", pools: ["magier"], tags: ["zauber", "angriff", "blut"],
      text: "Pflanzenschaden: 3 + 0,5x Waffe. 2 Blutung.", play: [{ action: "damage", base: 3, weaponScale: 0.5 }, { action: "status", status: "blutung", stacks: 2 }] },
    frostnadel: { name: "Frostnadel", cost: 2, element: "eis", pools: ["magier"], tags: ["zauber", "angriff"],
      text: "Eisschaden: 8 + Waffe. 2 Kälte.", play: [{ action: "damage", base: 8, weaponScale: 1 }, { action: "status", status: "frost", stacks: 2 }] },
    manaschild: { name: "Manaschild", cost: 1, pools: ["magier"], tags: ["zauber", "block"],
      text: "5 Block.", play: [{ action: "block", value: 5 }] },
    arkanblitz: { name: "Arkanblitz", cost: 2, pools: ["magier"], tags: ["zauber", "angriff"],
      text: "Schaden: 11 + 1,5x Waffe (kein Element).", play: [{ action: "damage", base: 11, weaponScale: 1.5 }] },

    gedankenblitz: { name: "Gedankenblitz", cost: 0, rarity: "ungewoehnlich", pools: ["magier"], tags: ["zauber", "utility"],
      text: "Ziehe 1 Karte.", play: [{ action: "draw", value: 1 }] },
    flammenwelle: { name: "Flammenwelle", cost: 2, rarity: "ungewoehnlich", element: "feuer", pools: ["magier"], tags: ["zauber", "flaeche"],
      text: "Feuerschaden an ALLEN: 5 + 0,5x Waffe.", play: [{ action: "damage", base: 5, weaponScale: 0.5, target: "all" }] },
    dornenwall: { name: "Dornenwall", cost: 2, rarity: "ungewoehnlich", element: "pflanze", pools: ["magier"], tags: ["zauber", "block", "blut"],
      text: "Pflanze: 8 Block. 3 Blutung auf ALLE.", play: [{ action: "block", value: 8 }, { action: "status", status: "blutung", stacks: 3, target: "all" }] },
    eisregen:   { name: "Eisregen", cost: 2, rarity: "ungewoehnlich", element: "eis", pools: ["magier"], tags: ["zauber", "flaeche"],
      text: "Eisschaden an ALLEN: 4 + 0,5x Waffe. 1 Kälte auf ALLE.",
      play: [{ action: "damage", base: 4, weaponScale: 0.5, target: "all" }, { action: "status", status: "frost", stacks: 1, target: "all" }] },
    meteor:     { name: "Meteor", cost: 3, rarity: "selten", element: "feuer", pools: ["magier"], tags: ["zauber", "angriff"],
      text: "Feuerschaden: 16 + 2x Waffe.", play: [{ action: "damage", base: 16, weaponScale: 2 }] },
    arkaner_sturm: { name: "Arkaner Sturm", cost: 2, rarity: "selten", pools: ["magier"], tags: ["zauber", "flaeche"],
      text: "Schaden an ALLEN: 4 + Waffe. 1 Verwundbar auf ALLE.",
      play: [{ action: "damage", base: 4, weaponScale: 1, target: "all" }, { action: "status", status: "verwundbar", stacks: 1, target: "all" }] },
    prismasturm: { name: "Prismatischer Sturm", cost: 3, rarity: "legendaer", unlock: { type: "wins", count: 1 }, pools: ["magier"], tags: ["zauber", "flaeche"],
      text: "Je 3 + 0,5x Waffe Schaden an ALLEN in Feuer, Wasser, Pflanze und Eis.",
      play: [
        { action: "damage", base: 3, weaponScale: 0.5, target: "all", element: "feuer" },
        { action: "damage", base: 3, weaponScale: 0.5, target: "all", element: "wasser" },
        { action: "damage", base: 3, weaponScale: 0.5, target: "all", element: "pflanze" },
        { action: "damage", base: 3, weaponScale: 0.5, target: "all", element: "eis" },
      ] },
  },

  weapons: {
    zauberstab: { name: "Zauberstab", starter: true, pools: ["magier"], power: 1, tags: ["waffe", "zauber"],
      passives: [{ trigger: "damage_calc", cardTag: "zauber", op: "add", value: 1 }] },
    flammenstab: { name: "Flammenstab", starter: true, pools: ["magier"], power: 1, tags: ["waffe", "zauber", "feuer"],
      passives: [{ trigger: "damage_calc", cardTag: "feuer", op: "add", value: 2 }] },
    runenstab:  { name: "Runenstab", starter: true, pools: ["magier"], power: 1, tags: ["waffe", "zauber"],
      passives: [{ trigger: "on_reaction", action: "damage", value: 3, target: "event_target", maxPerTurn: 2 }] },
    kristallstab: { name: "Kristallstab", rarity: "selten", pools: ["magier"], power: 2, tags: ["waffe", "zauber"],
      passives: [{ trigger: "damage_calc", cardTag: "zauber", op: "add", value: 2 }] },
  },

  items: {
    grimoire:   { name: "Grimoire", pools: ["magier"], tags: ["item", "zauber"],
      passives: [{ trigger: "damage_calc", cardTag: "zauber", op: "add", value: 1 }], text: "Zauberkarten: +1 Schaden." },
    funkenschlag: { name: "Funkenschlag", rarity: "ungewoehnlich", pools: ["magier"], tags: ["item", "zauber"],
      passives: [{ trigger: "on_reaction", action: "damage_all", value: 2, maxPerTurn: 3 }], text: "Reaktion: 2 Schaden an ALLE (max. 3/Zug)." },
    gedankenstein: { name: "Gedankenstein", rarity: "ungewoehnlich", pools: ["magier"], tags: ["item", "zauber"],
      passives: [{ trigger: "on_reaction", action: "draw", value: 1, maxPerTurn: 2 }], text: "Reaktion: ziehe 1 Karte (max. 2/Zug)." },
    resonanzkristall: { name: "Resonanzkristall", rarity: "selten", pools: ["magier"], tags: ["item", "zauber"], stats: { reaction: 50 }, maxStack: 2,
      text: "Reaktionen sind 50% stärker." },
    manaquelle: { name: "Manaquelle", rarity: "selten", pools: ["magier"], tags: ["item", "zauber"], maxStack: 1,
      passives: [{ trigger: "on_reaction", action: "energy", value: 1, maxPerTurn: 1 }], text: "Reaktion: +1 Energie (1x pro Zug)." },
    elementarlinse: { name: "Elementarlinse", rarity: "selten", pools: ["alle"], tags: ["item", "zauber"], stats: { reaction: 30 },
      passives: [{ trigger: "on_reaction", action: "block", value: 3, maxPerTurn: 2 }],
      text: "Reaktionen +30%. Reaktion: 3 Block (max. 2/Zug). Für alle Klassen!" },
  },
};



});
__define("content/packs/achievements.js", function (__exports, __require) {
// ERFOLGE, HELDEN-FARBVARIANTEN ("skins") UND RAHMEN ("frames").
//
// Erfolg: { name, text, group, secret?, check, reward? }
//   group:  gegner | kaempfe | sammlung | runs | geheim   (geheim = erst sichtbar, wenn erreicht; vorher weiß man nicht wie)
//   check:  { stat: "kills", min: 100 }                      Zähler >= min
//           { discovered: "items", min: 25 }                  so viele verschiedene Dinge gefunden (optional tag/rarity als Filter)
//           { discovered: "items", all: true }                ALLE gefunden
//           { mapAll: "winsByClass", of: "classes" }          in jeder Klasse mindestens 1 Sieg
//           { special: "<name>" }                             Spezialregel aus engine/achievements.js (besondere Taten)
//   reward: { kind: "items" | "weapons" | "cards" | "skins" | "frames", id }   schaltet den Inhalt frei (vorher nicht in Beute/Shop/Auswahl)
__exports.default = {
  id: "achievements",
  name: "Erfolge",

  // Farbvarianten: überschreiben Farbschlüssel der Heldengrafik (siehe ui/art/chars.js)
  skins: {
    rotgardist:   { hero: "nahkaempfer",  name: "Rotgardist",      pal: { U: "#b83a3a", u: "#7a2230", R: "#f2efe6", y: "#e8b93d" } },
    nachtwache:   { hero: "nahkaempfer",  name: "Nachtwache",      pal: { h: "#2f2a3a", i: "#6a6486", U: "#3a2a5a", u: "#241a3d", R: "#8a4fc0", y: "#8cc0ff" } },
    herbstlaeufer: { hero: "fernkaempfer", name: "Herbstläufer",   pal: { f: "#7a3b14", F: "#c8742b" } },
    schneejaeger: { hero: "fernkaempfer", name: "Schneejäger",     pal: { f: "#6a7fa0", F: "#e8f0fb", n: "#3b4660", N: "#6a7fa0" } },
    feuerrobe:    { hero: "magier",       name: "Feuerrobe",       pal: { Q: "#e8643c", q: "#a3321f", P: "#ffb35a", U: "#c73c3c", u: "#7a2230", V: "#ff8a5a", Y: "#ffe58a" } },
    mondrobe:     { hero: "magier",       name: "Mondrobe",        pal: { Q: "#7fd1c0", q: "#3b8a8a", P: "#d8fff6", U: "#2b3a67", u: "#1b2548", V: "#8cc0ff", Y: "#e6dfc9" } },
  },

  // Rahmen für Karten und Gegenstände (Aussehen siehe ui/style.css, Klasse frame-<id>)
  frames: {
    bronze: { name: "Bronze" }, eisen: { name: "Eisen" }, efeu: { name: "Efeu" }, frost: { name: "Frost" },
    gold: { name: "Gold" }, flamme: { name: "Flamme" }, prisma: { name: "Prisma" }, blut: { name: "Blut" }, chrom: { name: "Chrom" },
  },

  achievements: {
    // ---------------- Gegner
    g10:   { group: "gegner", name: "Erste Beute",          text: "Besiege 10 Gegner.",                    check: { stat: "kills", min: 10 },   reward: { kind: "frames", id: "bronze" } },
    g50:   { group: "gegner", name: "Kammerjäger",          text: "Besiege 50 Gegner.",                    check: { stat: "kills", min: 50 },   reward: { kind: "items", id: "kampfhorn" } },
    g100:  { group: "gegner", name: "Hundertschaft",        text: "Besiege 100 Gegner.",                   check: { stat: "kills", min: 100 },  reward: { kind: "skins", id: "rotgardist" } },
    g250:  { group: "gegner", name: "Schrecken der Tiefe",  text: "Besiege 250 Gegner.",                   check: { stat: "kills", min: 250 },  reward: { kind: "items", id: "vampirzahn" } },
    g500:  { group: "gegner", name: "Legende des Kellers",  text: "Besiege 500 Gegner.",                   check: { stat: "kills", min: 500 },  reward: { kind: "frames", id: "eisen" } },
    g1000: { group: "gegner", name: "Tausend Gegner",       text: "Besiege 1000 Gegner.",                  check: { stat: "kills", min: 1000 }, reward: { kind: "weapons", id: "kristallstab" } },
    gtypen: { group: "gegner", name: "Bestiarium",          text: "Besiege jede Gegnerart mindestens einmal.", check: { discovered: "enemies", all: true }, reward: { kind: "frames", id: "efeu" } },

    // ---------------- Kämpfe
    k25:    { group: "kaempfe", name: "Kampferprobt",        text: "Gewinne 25 Kämpfe.",                    check: { stat: "fightsWon", min: 25 },  reward: { kind: "items", id: "kriegstrommel" } },
    k100:   { group: "kaempfe", name: "Frontkämpfer",        text: "Gewinne 100 Kämpfe.",                   check: { stat: "fightsWon", min: 100 }, reward: { kind: "skins", id: "herbstlaeufer" } },
    kelite: { group: "kaempfe", name: "Elitejäger",          text: "Gewinne 10 Elite-Begegnungen.",         check: { stat: "elites", min: 10 },      reward: { kind: "items", id: "dornenruestung" } },
    kmini:  { group: "kaempfe", name: "Bossbrecher",         text: "Besiege 10 Mini-Bosse.",                check: { stat: "minibosses", min: 10 }, reward: { kind: "items", id: "meisterhammer" } },

    // ---------------- Sammlung
    s10:   { group: "sammlung", name: "Neugierig",           text: "Finde 10 verschiedene Items.",          check: { discovered: "items", min: 10 }, reward: { kind: "frames", id: "frost" } },
    s25:   { group: "sammlung", name: "Sammler",             text: "Finde 25 verschiedene Items.",          check: { discovered: "items", min: 25 }, reward: { kind: "items", id: "echostein" } },
    s50:   { group: "sammlung", name: "Hamster",             text: "Finde 50 verschiedene Items.",          check: { discovered: "items", min: 50 }, reward: { kind: "skins", id: "mondrobe" } },
    s20:   { group: "sammlung", name: "Schatzsucher",        text: "Schalte 20 verschiedene Items in der Sammlung frei.", check: { discovered: "items", min: 20 } },
    s30:   { group: "sammlung", name: "Beutejäger",          text: "Schalte 30 verschiedene Items in der Sammlung frei.", check: { discovered: "items", min: 30 } },
    s75:   { group: "sammlung", name: "Kurator",             text: "Schalte 75 verschiedene Items in der Sammlung frei.", check: { discovered: "items", min: 75 } },
    s100:  { group: "sammlung", name: "Archivar",            text: "Schalte 100 verschiedene Items in der Sammlung frei.", check: { discovered: "items", min: 100 } },
    w12:   { group: "sammlung", name: "Waffenmeister",       text: "Schalte 12 verschiedene Waffen in der Sammlung frei.", check: { discovered: "weapons", min: 12 } },
    w18:   { group: "sammlung", name: "Waffenkammer",        text: "Schalte 18 verschiedene Waffen in der Sammlung frei.", check: { discovered: "weapons", min: 18 } },
    x_vollendung: { group: "sammlung", name: "Vollendung",   text: "Erreiche alle anderen Erfolge. Der Lohn ist ein einzigartiges Item.", check: { special: "alle" }, reward: { kind: "items", id: "herz_der_vollendung" } },
    salle: { group: "sammlung", name: "Schatzmeister",       text: "Finde alle Items.",                     check: { discovered: "items", all: true }, reward: { kind: "frames", id: "gold" } },
    c25:   { group: "sammlung", name: "Kartenfreund",        text: "Finde 25 verschiedene Karten.",         check: { discovered: "cards", min: 25 }, reward: { kind: "items", id: "adrenalinpumpe" } },
    calle: { group: "sammlung", name: "Kartenmeister",       text: "Finde alle Karten.",                    check: { discovered: "cards", all: true }, reward: { kind: "skins", id: "schneejaeger" } },
    w6:    { group: "sammlung", name: "Waffensammler",       text: "Finde 6 verschiedene Waffen.",          check: { discovered: "weapons", min: 6 }, reward: { kind: "weapons", id: "frostklinge" } },
    walle: { group: "sammlung", name: "Arsenal",             text: "Finde alle Waffen.",                    check: { discovered: "weapons", all: true }, reward: { kind: "skins", id: "feuerrobe" } },
    ralle: { group: "sammlung", name: "Alchemist",           text: "Löse alle Elementar-Reaktionen aus.",   check: { discovered: "reactions", all: true }, reward: { kind: "items", id: "elementarlinse" } },

    // ---------------- Runs und Siege
    r1:    { group: "runs", name: "Aufbruch",                text: "Beende deinen ersten Run.",             check: { stat: "runs", min: 1 } },
    r10:   { group: "runs", name: "Stammgast",               text: "Beende 10 Runs.",                       check: { stat: "runs", min: 10 },  reward: { kind: "items", id: "taschenuhr" } },
    r50:   { group: "runs", name: "Dauergast",               text: "Beende 50 Runs.",                       check: { stat: "runs", min: 50 },  reward: { kind: "items", id: "ledergurt" } },
    w1:    { group: "runs", name: "Der Wandler fällt",       text: "Gewinne deinen ersten Run.",            check: { stat: "wins", min: 1 },   reward: { kind: "skins", id: "nachtwache" } },
    w5:    { group: "runs", name: "Serienheld",              text: "Gewinne 5 Runs.",                       check: { stat: "wins", min: 5 },   reward: { kind: "frames", id: "flamme" } },
    w25:   { group: "runs", name: "Dungeon-Legende",         text: "Gewinne 25 Runs.",                      check: { stat: "wins", min: 25 },  reward: { kind: "weapons", id: "jagdbogen" } },
    wklassen: { group: "runs", name: "Alle Wege",            text: "Gewinne einen Run mit jedem Helden.",   check: { mapAll: "winsByClass", of: "classes" }, reward: { kind: "frames", id: "prisma" } },
    wwaffen:  { group: "runs", name: "Waffenmeister",        text: "Gewinne mit jeder Startwaffe.",         check: { mapAll: "winsByWeapon", of: "starterWeapons" }, reward: { kind: "items", id: "glaskanone" } },
    whart: { group: "runs", name: "Härtetest",               text: "Gewinne einen Run auf Schwer.",         check: { special: "win_hard" },      reward: { kind: "items", id: "energiekristall" } },
    walb:  { group: "runs", name: "Albtraum bezwungen",      text: "Gewinne einen Run auf Albtraum.",       check: { special: "win_nightmare" }, reward: { kind: "frames", id: "blut" } },

    // ---------------- Geheim: Shiny-Jagd und besondere Taten (Text bleibt verborgen, bis der Erfolg erreicht ist)
    x_shiny1:  { group: "geheim", secret: true, name: "Glanzlicht",          text: "Du hast einen Chrom-Gegner besiegt.",                  check: { stat: "shinyEnemies", min: 1 }, reward: { kind: "items", id: "schillernder_charme" } },
    x_shiny5:  { group: "geheim", secret: true, name: "Jäger des Glanzes",   text: "Du hast 5 Chrom-Gegner besiegt.",                      check: { stat: "shinyEnemies", min: 5 }, reward: { kind: "items", id: "glueckswuerfel" } },
    x_dex5:    { group: "geheim", secret: true, name: "Chrom-Sammler",       text: "Fünf verschiedene Chrom-Funde sind in deiner Sammlung.", check: { special: "dex5" },                 reward: { kind: "items", id: "blutmond" } },
    x_heroshiny: { group: "geheim", secret: true, name: "Chrom-Geboren",     text: "Du bist als Chrom-Held in einen Run gestartet.",       check: { special: "shiny_hero_start" },     reward: { kind: "frames", id: "chrom" } },
    x_herowin: { group: "geheim", secret: true, name: "Doppelglanz",         text: "Du hast einen Run als Chrom-Held gewonnen.",           check: { special: "shiny_hero_win" },       reward: { kind: "items", id: "goldene_waage" } },
    x_untouched: { group: "geheim", secret: true, name: "Unberührbar",       text: "Du hast einen Elite- oder Endgegner besiegt, ohne Schaden zu nehmen.", check: { special: "untouched" }, reward: { kind: "items", id: "dornenkrone" } },
    x_oneturn: { group: "geheim", secret: true, name: "Blitzkrieg",          text: "Du hast einen Kampf gegen mindestens 3 Gegner in einem einzigen Zug gewonnen.", check: { special: "one_turn" }, reward: { kind: "items", id: "funkenfeuerzeug" } },
    x_bighit:  { group: "geheim", secret: true, name: "Wuchtbrumme",         text: "Du hast mit einer Karte mindestens 40 Schaden auf einmal verursacht.", check: { special: "big_hit" }, reward: { kind: "items", id: "opferdolch" } },
    x_chain:   { group: "geheim", secret: true, name: "Kettenreaktion",      text: "Du hast 3 Reaktionen in einem Zug ausgelöst.",         check: { special: "chain" },                reward: { kind: "items", id: "manaquelle" } },
    x_flurry:  { group: "geheim", secret: true, name: "Kartenwirbel",        text: "Du hast 10 Karten in einem Zug gespielt.",             check: { special: "flurry" },               reward: { kind: "items", id: "munitionsgurt" } },
    x_poison:  { group: "geheim", secret: true, name: "Seuchenherd",         text: "Ein Gegner hatte gleichzeitig 25 Gift.",               check: { special: "poison25" },             reward: { kind: "items", id: "leichengift" } },
    x_nobuy:   { group: "geheim", secret: true, name: "Geizhals",            text: "Du hast einen Run gewonnen, ohne im Shop etwas zu kaufen.", check: { special: "no_purchase_win" }, reward: { kind: "items", id: "muenzbeutel" } },
    x_minideck: { group: "geheim", secret: true, name: "Weniger ist mehr",   text: "Du hast einen Run mit höchstens 11 Karten im Deck gewonnen.", check: { special: "small_deck_win" }, reward: { kind: "items", id: "wetzstein" } },
    x_stack3:  { group: "geheim", secret: true, name: "Dreifach hält besser", text: "Du hast dasselbe Item dreimal besessen.",            check: { special: "stack3" },               reward: { kind: "items", id: "apothekerwaage" } },
    x_lowhp:   { group: "geheim", secret: true, name: "Haarscharf",          text: "Du hast einen Run mit höchstens 5 HP gewonnen.",       check: { special: "low_hp_win" },           reward: { kind: "items", id: "notfallration" } },
    x_rich:    { group: "geheim", secret: true, name: "Dagobert",            text: "Du hast 500 Gold gleichzeitig besessen.",              check: { special: "rich" },                 reward: { kind: "items", id: "hasenpfote" } },
  },
};



});
__define("content/packs/aktiv.js", function (__exports, __require) {
// AKTIVE ITEMS: werden im Kampf gegen Energie ausgelöst, aber nur EINMAL PRO KAMPF (keine zusätzliche Aktion in jeder Runde).
// active: { cost, element?, play: [Karten-Aktionen] }  (damage | block | status | multiplyStatus | draw | energy | playerStatus | heal)
// Ein Element im Item löst Reaktionen aus, wenn davor im selben Zug ein anderes Element gespielt wurde.
__exports.default = {
  id: "aktiv",
  name: "Aktive Items",
  items: {
    feuerflasche: { name: "Feuerflasche", tags: ["item", "feuer", "aktiv"],
      text: "Aktiv (1 Energie, 1x pro Kampf): 6 Feuerschaden an ALLE.",
      active: { cost: 1, element: "feuer", play: [{ action: "damage", base: 6, target: "all" }] } },
    heiltrank: { name: "Heiltrank", tags: ["item", "heilung", "aktiv"],
      text: "Aktiv (1 Energie, 1x pro Kampf): heile 12 HP.",
      active: { cost: 1, play: [{ action: "heal", value: 12 }] } },
    rauchbombe: { name: "Rauchbombe", tags: ["item", "ausweichen", "aktiv"],
      text: "Aktiv (1 Energie, 1x pro Kampf): weiche 3 Treffern aus. 4 Block.",
      active: { cost: 1, play: [{ action: "playerStatus", status: "ausweichen", stacks: 3 }, { action: "block", value: 4 }] } },
    giftphiole: { name: "Giftphiole", rarity: "ungewoehnlich", tags: ["item", "gift", "aktiv"],
      text: "Aktiv (1 Energie, 1x pro Kampf): 6 Gift auf ALLE Gegner.",
      active: { cost: 1, play: [{ action: "status", status: "gift", stacks: 6, target: "all" }] } },
    frostphiole: { name: "Frostphiole", rarity: "ungewoehnlich", tags: ["item", "eis", "aktiv"],
      text: "Aktiv (1 Energie, 1x pro Kampf): 4 Eisschaden und 2 Verwundbar auf ALLE.",
      active: { cost: 1, element: "eis", play: [{ action: "damage", base: 4, target: "all" }, { action: "status", status: "verwundbar", stacks: 2, target: "all" }] } },
    blutampulle: { name: "Blutampulle", rarity: "ungewoehnlich", tags: ["item", "blut", "aktiv"],
      text: "Aktiv (1 Energie, 1x pro Kampf): 10 Schaden und 5 Blutung auf ein Ziel.",
      active: { cost: 1, play: [{ action: "damage", base: 10 }, { action: "status", status: "blutung", stacks: 5 }] } },
    schlachtrufrolle: { name: "Schlachtrufrolle", rarity: "selten", tags: ["item", "debuff", "aktiv"],
      text: "Aktiv (1 Energie, 1x pro Kampf): alle Gegner 3 Züge markiert und 1 Verwundbar.",
      active: { cost: 1, play: [{ action: "status", status: "markiert", stacks: 3, target: "all" }, { action: "status", status: "verwundbar", stacks: 1, target: "all" }] } },
    prismasplitter: { name: "Prismasplitter", rarity: "selten", tags: ["item", "aktiv"],
      text: "Aktiv (2 Energie, 1x pro Kampf): je 4 Schaden an ALLEN in Feuer, Wasser, Pflanze und Eis.",
      active: { cost: 2, play: ["feuer", "wasser", "pflanze", "eis"].map((element) => ({ action: "damage", base: 4, target: "all", element })) } },
    phoenixasche: { name: "Phönixasche", rarity: "legendaer", maxStack: 1, tags: ["item", "heilung", "aktiv"],
      text: "Aktiv (2 Energie, 1x pro Kampf): heile 20 HP, 10 Block und +1 Energie.",
      active: { cost: 2, play: [{ action: "heal", value: 20 }, { action: "block", value: 10 }, { action: "energy", value: 1 }] } },
  },
};



});
__define("content/packs/bollwerk.js", function (__exports, __require) {
// NAHKÄMPFER-AUSBAU: drei Pfade für die Klasse mit den wenigsten eigenen Karten.
//  - Bollwerk: Block wird zur Waffe (Schildstoß, Dornen), "Unbeugsam" (Klassen-Passiv) gibt übrigem Block einen Nutzen.
//  - Aderlass: Pakt mit dem eigenen Blut (HP gegen Energie und Karten), Heilung durch Blutung.
//  - Blutrausch: Blutung als Hauptschaden (Zerfleischen).
// Neue Bausteine: Aktion loseHp, fromBlock (Schaden aus Block), ifTarget (nur wenn das Ziel den Status trägt), Spieler-Status "dornen".
__exports.default = {
  id: "bollwerk",
  name: "Nahkämpfer-Ausbau",
  cards: {
    schildstoss:    { name: "Schildstoß", cost: 1, pools: ["nahkaempfer"], tags: ["block", "angriff", "nahkampf"],
      text: "Schaden gleich deinem Block (max. 12). Der Block bleibt.", play: [{ action: "damage", base: 0, fromBlock: { max: 12 } }] },
    dornenpanzer:   { name: "Dornenpanzer", cost: 2, pools: ["nahkaempfer"], tags: ["block", "dornen", "ruestung"],
      text: "8 Block. Dornen 2: Angreifer erleiden bis zu deinem Zug 2 Schaden.", play: [{ action: "block", value: 8 }, { action: "playerStatus", status: "dornen", stacks: 2 }] },
    eiserner_wille: { name: "Eiserner Wille", cost: 1, rarity: "ungewoehnlich", pools: ["nahkaempfer"], tags: ["block", "heilung"],
      text: "5 Block. Heile 2 HP.", play: [{ action: "block", value: 5 }, { action: "heal", value: 2 }] },
    bollwerk:       { name: "Bollwerk", cost: 2, rarity: "ungewoehnlich", pools: ["nahkaempfer"], tags: ["block", "ruestung"],
      text: "12 Block. Ziehe 1 Karte.", play: [{ action: "block", value: 12 }, { action: "draw", value: 1 }] },
    festungsbau:    { name: "Festungsbau", cost: 3, rarity: "selten", pools: ["nahkaempfer"], tags: ["block", "dornen", "ruestung"],
      text: "16 Block. Dornen 4: Angreifer erleiden bis zu deinem Zug 4 Schaden.", play: [{ action: "block", value: 16 }, { action: "playerStatus", status: "dornen", stacks: 4 }] },
    blutopfer:      { name: "Blutopfer", cost: 0, rarity: "ungewoehnlich", pools: ["nahkaempfer"], tags: ["pakt", "blut"],
      text: "Verliere 5 HP (nie unter 1). +1 Energie.", play: [{ action: "loseHp", value: 5 }, { action: "energy", value: 1 }] },
    blutdurst:      { name: "Blutdurst", cost: 1, pools: ["nahkaempfer"], tags: ["blut", "heilung", "angriff", "nahkampf"],
      text: "Schaden: 4 + Waffe. Blutet das Ziel: heile 3 HP.", play: [{ action: "damage", base: 4, weaponScale: 1 }, { action: "heal", value: 3, ifTarget: "blutung" }] },
    zerfleischen:   { name: "Zerfleischen", cost: 2, rarity: "selten", pools: ["nahkaempfer"], tags: ["blut", "angriff", "nahkampf"],
      text: "Schaden: 4 + Waffe, +4 pro Blutung auf dem Ziel.", play: [{ action: "damage", base: 4, weaponScale: 1, bonusPerStatus: { status: "blutung", value: 4 } }] },
  },
  items: {
    narbenleder:   { name: "Narbenleder", tags: ["blut", "ruestung", "item"],
      passives: [{ trigger: "on_status_applied", whenStatus: "blutung", action: "block", value: 2, maxPerTurn: 3 }], text: "Blutung aufgetragen: 2 Block (max. 3x/Zug)." },
    stachelschild: { name: "Stachelschild", tags: ["dornen", "block", "item"],
      passives: [{ trigger: "on_turn_start", action: "player_status", status: "dornen", stacks: 1 }], text: "Zugbeginn: Dornen 1 (Angreifer erleiden 1 Schaden)." },
    eisenfaust:    { name: "Eisenfaust", rarity: "ungewoehnlich", tags: ["block", "ruestung", "item"],
      passives: [{ trigger: "damage_calc", cardTag: "block", op: "add", value: 3 }], text: "Block-Karten: +3 Schaden." },
  },
};



});
__define("content/packs/pyro.js", function (__exports, __require) {
// PYRO-MASOCHIST: Schmerz als Währung. HP werden bewusst geopfert und in Schaden, Energie und Karten verwandelt (hohes Risiko, hohe Belohnung).
// Dazu die Wirtschafts-Items "Ernte". Neue Bausteine: Status "verbrennung", Trigger "on_hp_lost", xMult-Passiv, Stat healLoss (Heilung gemindert),
// Aktionen mit Bedingung (ifHpLost / unlessHpLost) und Schaden aus fehlenden HP (fromMissingHp).
// Die Karten liegen im allgemeinen Pool: jede Klasse kann sich zum Pyro-Masochisten entwickeln.
__exports.default = {
  id: "pyro",
  name: "Pyro-Masochist und Ernte",
  cards: {
    aderlass: { name: "Aderlass", cost: 0, rarity: "ungewoehnlich", tags: ["pakt"],
      text: "Erleide 4 Schaden (nie unter 1 HP). Ziehe 2 Karten, erhalte 1 Energie.",
      play: [{ action: "loseHp", value: 4 }, { action: "draw", value: 2 }, { action: "energy", value: 1 }] },
    lodernder_schmerz: { name: "Lodernder Schmerz", cost: 1, rarity: "ungewoehnlich", element: "feuer", tags: ["pakt", "angriff"],
      text: "Feuerschaden gleich deinen fehlenden Lebenspunkten (max. 40).",
      play: [{ action: "damage", base: 0, fromMissingHp: { max: 40 } }] },
    feuersturm: { name: "Feuersturm", cost: 2, rarity: "selten", element: "feuer", tags: ["pakt", "angriff"],
      text: "12 Feuerschaden auf einen Gegner. Hast du diesen Zug HP verloren: trifft ALLE Gegner und gibt jedem 2 Verbrennung.",
      play: [{ action: "damage", base: 12, unlessHpLost: true }, { action: "damage", base: 12, target: "all", ifHpLost: true }, { action: "status", status: "verbrennung", stacks: 2, target: "all", ifHpLost: true }] },
  },
  items: {
    pech_raeucherstaebchen: { name: "Pech-Räucherstäbchen", tags: ["feuer", "pakt", "item"],
      passives: [{ trigger: "damage_calc", op: "add", value: 3, cardTag: "feuer" }, { trigger: "on_turn_end", action: "hurt", value: 1 }],
      text: "Feuer-Karten: +3 Schaden. Zugende: du erleidest 1 Schaden." },
    asche_lunge: { name: "Asche-Lunge", rarity: "ungewoehnlich", tags: ["feuer", "pakt", "item"],
      stats: { healLoss: 0.5 },
      passives: [{ trigger: "on_hp_lost", action: "status_all", status: "verbrennung", stacks: 3 }],
      text: "Wenn du HP verlierst: alle Feinde erhalten 3 Verbrennung. Heilung auf dich ist um 50% reduziert." },
    krone_des_maertyrers: { name: "Krone des Märtyrers", rarity: "selten", maxStack: 1, tags: ["pakt", "item"],
      stats: { maxHp: -10 },
      passives: [{ trigger: "damage_calc", op: "xmult", perMissingHp: { step: 5, value: 0.1 } }],
      text: "Schaden x0,1 je 5 HP, die dir zum Maximum fehlen (Obergrenze x3). -10 Max-HP." },
    erntesichel: { name: "Erntesichel", tags: ["gold", "item"], stats: { ernte: 2 }, text: "Ernte 2: nach jedem Kampf +2 Gold." },
    vorratskammer: { name: "Vorratskammer", rarity: "ungewoehnlich", tags: ["gold", "item"], stats: { ernte: 4 }, text: "Ernte 4: nach jedem Kampf +4 Gold." },
  },
};



});
__define("content/packs/aristokrat_gaertner.js", function (__exports, __require) {
// ZWEI NEUE DECK-ARCHETYPEN
//  1) Gieriger Aristokrat (Gold-Skalierung): Gold wird zu Schaden, Kopfgeld, Bestechung.
//  2) Parasitärer Gärtner (Pflanze und Heilungs-Umwandlung): Heilung wird zu Waffe, Max-HP wächst.
// Engine-Bausteine (engine/modifiers.js, engine/combat.js, engine/run.js):
//   Passiv-Op "baseadd" + perGold (Grundschaden je Gold), perHandCard (je Karte auf der Hand), Stats goldDouble / healToDamage,
//   Item-Flags (flags: ["noFreeze"] setzt run.flags dauerhaft), Aktionen onKill / lifesteal / payGoldPct / maxHpUp,
//   Bedingungen ifHealed / unlessHealed, Status "aussetzen" (Gegner überspringt die Runde, Bosse: immune).
__exports.default = {
  id: "aristokrat_gaertner",
  name: "Aristokrat und Gärtner",
  items: {
    // ---------------- Gieriger Aristokrat
    boerse_des_geizkragens: { name: "Börse des Geizkragens", rarity: "selten", tags: ["gold", "item"],
      passives: [{ trigger: "damage_calc", op: "baseadd", perGold: { step: 50, value: 1 }, cap: 15 }],    // cap 15: Sicherheitsgrenze gegen unbegrenzte Gold-Skalierung
      text: "Alle Karten: +1 Grundschaden je 50 Gold, das du besitzt (max. +15)." },
    midas_fluch: { name: "Midas-Fluch", rarity: "ungewoehnlich", maxStack: 1, tags: ["gold", "item"],
      stats: { goldDouble: 1 },
      flags: ["noFreeze"],                                                                               // Player-State: run.flags.noFreeze = true (dauerhaft)
      text: "Verdoppelt das gesamte erhaltene Gold (Beute, Überschuss, Ernte, Kartengold). Item-Sperren im Shop sind dauerhaft deaktiviert." },
    // ---------------- Parasitärer Gärtner
    nekromanten_pakt: { name: "Nekromanten-Pakt", rarity: "selten", maxStack: 1, tags: ["pakt", "heilung", "item"],
      stats: { healToDamage: 2 },                                                                        // überschreibt die Heilung: 0 HP, stattdessen 2x als Schaden auf einen zufälligen Gegner
      text: "Jede Heilung wird zu 0. Stattdessen erleidet ein zufälliger Gegner den doppelten Wert als Schaden (außerhalb von Kämpfen verpufft sie)." },
    wuchernde_wurzeln: { name: "Wuchernde Wurzeln", rarity: "ungewoehnlich", tags: ["pflanze", "heilung", "item"],
      stats: { handSize: -2 },
      passives: [{ trigger: "on_turn_end", action: "heal", value: 1, perHandCard: true }],
      text: "Zugende: heile 1 HP je Karte auf der Hand. Handgröße -2." },
  },
  cards: {
    // ---------------- Gieriger Aristokrat
    taschendiebstahl: { name: "Taschendiebstahl", cost: 1, rarity: "ungewoehnlich", tags: ["gold", "angriff"],
      text: "2 Schaden. Tötet diese Karte den Gegner: erhalte sofort 40 Gold.",
      play: [{ action: "damage", base: 2, onKill: { gold: 40 } }] },
    bestechung: { name: "Bestechung", cost: 2, rarity: "ungewoehnlich", tags: ["gold"],
      text: "Ein Gegner setzt diese Runde aus. Du zahlst sofort 15% deines Goldes. Bosse sind unbestechlich.",
      play: [{ action: "status", status: "aussetzen", stacks: 1 }, { action: "payGoldPct", value: 0.15, ifTarget: "aussetzen" }] },
    // ---------------- Parasitärer Gärtner
    photosynthese: { name: "Photosynthese", cost: 1, element: "pflanze", tags: ["pflanze", "heilung"], exhaust: true,
      text: "Heile 8 HP. Max-HP +1 bis zum Ende des Runs. Verbrauchen.",
      play: [{ action: "heal", value: 8 }, { action: "maxHpUp", value: 1 }] },
    sporenwolke: { name: "Sporenwolke", cost: 1, element: "pflanze", tags: ["pflanze", "block"],
      text: "5 Block. Wurdest du diesen Zug schon geheilt (oder wolltest heilen): stattdessen 15 Block.",
      play: [{ action: "block", value: 5, unlessHealed: true }, { action: "block", value: 15, ifHealed: true }] },
    blutsauger_ranke: { name: "Blutsauger-Ranke", cost: 2, rarity: "ungewoehnlich", element: "pflanze", tags: ["pflanze", "blut", "angriff", "heilung"],
      text: "6 Schaden. Heile dich um den verursachten Schaden.",
      play: [{ action: "damage", base: 6, lifesteal: true }] },
  },
};



});
__define("content/packs/waffen_stufe2.js", function (__exports, __require) {
// WAFFEN, STUFE 2 (ungewöhnlich): kommen erst später im Run (Beute nach dem Mini-Boss, Chrom-Funde), nie als Startwaffe.
// Jede ist mindestens so stark wie die beste gewöhnliche Startwaffe der Klasse (Test: test/weapons-pool.js) und ergänzt eine Richtung.
__exports.default = {
  id: "waffen_stufe2",
  name: "Waffen, Stufe 2",
  weapons: {
    // Nahkämpfer
    stahlschwert: { name: "Stahlschwert", rarity: "ungewoehnlich", pools: ["nahkaempfer"], power: 3, tags: ["waffe", "nahkampf"] },
    glutschwert: { name: "Glutschwert", rarity: "ungewoehnlich", pools: ["nahkaempfer"], power: 2, tags: ["waffe", "nahkampf", "feuer"],
      passives: [{ trigger: "damage_calc", cardTag: "feuer", op: "add", value: 1 }] },
    natterndolch: { name: "Natterndolch", rarity: "ungewoehnlich", pools: ["nahkaempfer"], power: 2, tags: ["waffe", "nahkampf", "gift"],
      passives: [{ trigger: "on_card_played", cardTag: "gift", action: "status", status: "gift", stacks: 1, target: "event_target", maxPerTurn: 3 }] },
    // Fernkämpfer
    langbogen: { name: "Langbogen", rarity: "ungewoehnlich", pools: ["fernkaempfer"], power: 3, tags: ["waffe", "fernkampf"] },
    brandbogen: { name: "Brandbogen", rarity: "ungewoehnlich", pools: ["fernkaempfer"], power: 2, tags: ["waffe", "fernkampf", "feuer"],
      passives: [{ trigger: "damage_calc", cardTag: "feuer", op: "add", value: 1 }] },
    wundbogen: { name: "Wundbogen", rarity: "ungewoehnlich", pools: ["fernkaempfer"], power: 2, tags: ["waffe", "fernkampf", "blut"],
      passives: [{ trigger: "on_card_played", cardTag: "fernkampf", action: "status", status: "blutung", stacks: 1, target: "event_target", maxPerTurn: 2 }] },
    // Magier
    arkanstab: { name: "Arkanstab", rarity: "ungewoehnlich", pools: ["magier"], power: 2, tags: ["waffe", "zauber"],
      passives: [{ trigger: "damage_calc", cardTag: "zauber", op: "add", value: 1 }] },
    glutzepter: { name: "Glutzepter", rarity: "ungewoehnlich", pools: ["magier"], power: 2, tags: ["waffe", "zauber", "feuer"],
      passives: [{ trigger: "damage_calc", cardTag: "feuer", op: "add", value: 2 }] },
    frostzepter: { name: "Frostzepter", rarity: "ungewoehnlich", pools: ["magier"], power: 2, tags: ["waffe", "zauber", "eis"],
      passives: [{ trigger: "damage_calc", cardTag: "eis", op: "add", value: 2 }] },
  },
};



});
__define("content/packs/helden2.js", function (__exports, __require) {
// DREI NEUE HELDEN (Brotato-Prinzip: jeder Held hat Vor- und Nachteile, eine Signaturwaffe und eigene Karten; freischaltbar über Erfolge).
// Klassen-Passive stehen als Daten in "passives" (wie bei Items), Vor- und Nachteile für die Anzeige in "perks".
// cardPools: Der Held findet auch die Karten verwandter Klassen. startGold, shopDiscount, restHealPct: Wirtschafts-Eigenheiten.
__exports.default = {
  id: "helden2",
  name: "Neue Helden",
  classes: {
    pyromant: {
      abilities: ["feuerfaust", "hoellenflamme"], name: "Pyromant", hp: 80, stats: { regen: 2, elementDmg: 3, crit: 5 },
      blurb: "Spielt mit dem Schmerz: Jeder Verlust an HP setzt Gegner in Brand, und je mehr ihm fehlt, desto härter schlägt er zu. Dafür hat er wenig Leben.",
      perks: ["+ Schmerzensglut: HP-Verlust = 1 Verbrennung für alle", "+ Lodernder Schmerz im Startdeck", "- Pechfackel verletzt dich jeden Zug", "+ Elementarschaden +3, Krit 5%", "- Nur 80 Max-HP"],
      passive: { id: "schmerzensglut", name: "Schmerzensglut", text: "Wenn du HP verlierst, erhalten alle Gegner 1 Verbrennung (höchstens 2x pro Zug)." },
      passives: [{ trigger: "on_hp_lost", action: "status_all", status: "verbrennung", stacks: 1, maxPerTurn: 2 }],
      cardPools: ["pyromant", "magier"],
      deck: ["flammenhieb", "feuerball", "lodernder_schmerz", "deckung"], shopBasics: [], coreCards: ["feuersturm", "flammenmantel", "selbstentzuendung"],
      weapon: "pechfackel", items: [], unlock: { type: "achievement", id: "g50" },
    },
    aristokrat: {
      abilities: ["tor_der_schaetze", "absoluter_befehl"], name: "Aristokrat", hp: 118, stats: { goldPct: 30, ernte: 2, regen: 3, luck: 3, armor: 1 }, startGold: 40, shopDiscount: 0.1, restHealPct: 0.2,
      blurb: "Gold ist Macht: mehr Beute, billigere Händler und festes Einkommen. Dafür kämpft er schlecht und erholt sich kaum an der Rast.",
      perks: ["+ 30% Gold, Ernte 2, 40 Startgold", "+ Mäzen: Händlerpreise -10%", "- Schwaches Startdeck und schwache Waffe", "+ Glück 3, Rüstung 1", "- Rast heilt nur 20%"],
      passive: { id: "maezen", name: "Mäzen", text: "Händlerpreise -10%." },
      cardPools: ["aristokrat", "nahkaempfer"],
      deck: ["hieb", "taschendiebstahl", "schuldschein", "wirbel"], shopBasics: [], coreCards: ["dekadenz", "bestechung", "adrenalin"],
      weapon: "stockdegen", items: [], unlock: { type: "achievement", id: "k25" },
    },
    gaertnerin: {
      abilities: ["heilende_ranken", "wuchernder_wald"], name: "Gärtnerin", hp: 64, stats: { regen: 3, handSize: -1, lifesteal: 4, elementDmg: 1, dodge: 8 },
      blurb: "Geduldig: Pflanzenkarten und Heilung, nach jedem Kampf erholt sie sich. Dafür hat sie wenig Leben und eine kleine Hand.",
      perks: ["+ Nach jedem Kampf +3 HP", "+ Wurzelwerk: Pflanzenkarten +1 Schaden", "- Nur 4 Handkarten", "+ Lebensraub 4%, Ausweichen 8%", "- Nur 64 Max-HP"],
      passive: { id: "wurzelwerk", name: "Wurzelwerk", text: "Pflanzenkarten machen +1 Schaden." },
      passives: [{ trigger: "damage_calc", cardTag: "pflanze", op: "add", value: 1 }],
      cardPools: ["gaertnerin", "magier"],
      deck: ["ranke", "photosynthese", "blutsauger_ranke", "hieb"], shopBasics: [], coreCards: ["wurzelgeflecht", "rankendornen", "sporenwolke"],
      weapon: "rankenstab", items: [], unlock: { type: "achievement", id: "s10" },
    },
  },
  weapons: {
    // Signaturwaffen (gewöhnlich, frei wählbar wie alle Startwaffen)
    pechfackel: { name: "Pechfackel", starter: true, pools: ["pyromant"], power: 2, tags: ["waffe", "nahkampf", "feuer"],
      passives: [{ trigger: "damage_calc", cardTag: "feuer", op: "add", value: 2 }, { trigger: "on_turn_end", action: "hurt", value: 1 }] },
    stockdegen: { name: "Stockdegen", starter: true, pools: ["aristokrat"], power: 2, tags: ["waffe", "nahkampf", "gold"],
      passives: [{ trigger: "damage_calc", op: "baseadd", perGold: { step: 100, value: 1 }, cap: 8 }] },
    rankenstab: { name: "Rankenstab", starter: true, pools: ["gaertnerin"], power: 1, tags: ["waffe", "zauber", "pflanze"],
      passives: [{ trigger: "damage_calc", cardTag: "pflanze", op: "add", value: 1 }] },
  },
  cards: {
    // Pyromant
    selbstentzuendung: { name: "Selbstentzündung", cost: 1, rarity: "ungewoehnlich", element: "feuer", pools: ["pyromant"], tags: ["pakt"],
      text: "Erleide 4 Schaden (nie unter 1 HP). Alle Gegner erhalten 4 Verbrennung.",
      play: [{ action: "loseHp", value: 4 }, { action: "status", status: "verbrennung", stacks: 4, target: "all" }] },
    flammenmantel: { name: "Flammenmantel", cost: 2, rarity: "ungewoehnlich", element: "feuer", pools: ["pyromant"], tags: ["pakt", "block", "dornen"],
      text: "10 Block. Hast du diesen Zug HP verloren: Dornen 5 (Angreifer erleiden bis zu deinem Zug 5 Schaden).",
      play: [{ action: "block", value: 10 }, { action: "playerStatus", status: "dornen", stacks: 5, ifHpLost: true }] },
    // Aristokrat
    schuldschein: { name: "Schuldschein", cost: 1, pools: ["aristokrat"], tags: ["gold"],
      text: "Erhalte 20 Gold. Ziehe 1 Karte.", play: [{ action: "gainGold", value: 20 }, { action: "draw", value: 1 }] },
    dekadenz: { name: "Dekadenz", cost: 2, rarity: "ungewoehnlich", pools: ["aristokrat"], tags: ["gold", "angriff"],
      text: "12 Schaden an ALLEN Gegnern. Du zahlst 10% deines Goldes.", play: [{ action: "damage", base: 12, target: "all" }, { action: "payGoldPct", value: 0.1 }] },
    // Gärtnerin
    rankendornen: { name: "Ranken-Dornen", cost: 1, element: "pflanze", pools: ["gaertnerin"], tags: ["pflanze", "block", "dornen"],
      text: "4 Block. Dornen 3 (Angreifer erleiden bis zu deinem Zug 3 Schaden).", play: [{ action: "block", value: 4 }, { action: "playerStatus", status: "dornen", stacks: 3 }] },
    wurzelgeflecht: { name: "Wurzelgeflecht", cost: 2, rarity: "ungewoehnlich", element: "pflanze", pools: ["gaertnerin"], tags: ["pflanze", "block", "heilung"],
      text: "8 Block. Heile 4 HP.", play: [{ action: "block", value: 8 }, { action: "heal", value: 4 }] },
  },
};



});
__define("content/packs/story.js", function (__exports, __require) {
// GESCHICHTE: Sprecher und Dialoge als Daten. Neue Geschichten (z. B. je Klasse, je Boss, je Schwierigkeit) = nur Einträge ergänzen.
// lines: Text oder { perClass: { <klassen-id>: "...", default: "..." } }
__exports.default = {
  id: "story",
  name: "Geschichte",

  speakers: {
    brumm: { name: "Brumm", title: "Wirt vom Zerbrochenen Schild" },
    mira:  { name: "Prinzessin Mira", title: "Hüterin des Herzsteins" },
  },

  stories: {
    intro: {
      speaker: "brumm",
      lines: [
        "Psst! Du da! Ja, du. Komm rein, bevor dich der Regen erwischt. Falls das Regen ist. Heute war es Feuerregen.",
        "Der Elementarwandler ist gestern Nacht ins Schloss eingebrochen. Er hat den Herzstein gestohlen, der Feuer, Wasser, Pflanzen und Eis im Gleichgewicht hält.",
        "Und er hat Prinzessin Mira mitgeschleppt. Sie war die Einzige, die den Stein zum Singen bringen konnte.",
        { perClass: {
          nahkaempfer: "Du siehst aus, als hättest du schon mal eine Tür mit dem Gesicht geöffnet. Perfekt. Unten braucht man Leute wie dich.",
          fernkaempfer: "Gute Augen, leise Schritte. Genau, was die Tiefe verlangt. Und nein, die Pfeile bezahlt dir niemand.",
          magier: "Ein Magier! Endlich jemand, der die Elemente versteht. Pass auf: Seit der Stein fort ist, vertragen die sich nicht mehr. Mischst du sie, knallt es.",
          pyromant: "Du riechst nach Rauch und siehst aus, als wäre dir das egal. Gut. Unten brennt es ohnehin schon.",
          aristokrat: "Ein feiner Herr! Verirrt? Nein? Dann nimm den Stock, die Geldbörse bleibt, wo sie ist. Unten kostet alles extra.",
          gaertnerin: "Eine Gärtnerin im Dungeon? Na, Unkraut gibt es da unten genug. Und die Wände könnten etwas Grün vertragen.",
          default: "Du siehst fähig aus. Das reicht mir.",
        } },
        "Unten wimmelt es von Viechern. Sammle Karten, Beute und Gold. Und wenn dir etwas Glitzerndes über den Weg läuft: schnapp es dir. Das lohnt sich.",
        "Der erste Keller liegt gleich hier. Los! Und bring mir die Prinzessin heil zurück!",
      ],
    },
    startladen: {
      speaker: "brumm",
      lines: [
        "Die Ratten hast du überlebt. Schau dich um, halber Preis, weil ich dich mag.",
      ],
    },
    outro: {
      speaker: "mira",
      lines: [
        "Du hast es geschafft! Der Wandler ist besiegt, und der Herzstein singt wieder.",
        "Brumm behauptet übrigens, er hätte das alles geplant. Glaub ihm kein Wort.",
      ],
    },
  },
};



});
__define("content/packs/helden_items.js", function (__exports, __require) {
// HELDEN-ITEMS: je Held drei eigene Items (erscheinen bei jedem Helden, sind aber auf ihren Helden zugeschnitten und im Spiel mit "Passt zu" gekennzeichnet), gebaut für seine Stärken. Brotato-Richtung: Items sollen mit dem Helden Synergien bilden.
__exports.default = {
  id: "heldenitems",
  name: "Helden-Items",
  items: {
    ritterschwur: { name: "Ritterschwur", rarity: "ungewoehnlich", hero: "nahkaempfer", tags: ["item", "block"], text: "Block-Karte gespielt: 2 Schaden auf einen Gegner (max. 4/Zug).",
      passives: [{ trigger: "on_card_played", cardTag: "block", action: "damage", value: 2, target: "random_enemy", maxPerTurn: 4 }] },
    eisenwall: { name: "Eisenwall", rarity: "selten", hero: "nahkaempfer", tags: ["item", "block"], text: "Ab 4 Block-Tags: ALLE Karten +20% Schaden.",
      passives: [{ trigger: "damage_calc", requires: { tag: "block", count: 4 }, op: "pct", value: 0.2 }] },
    siegerhelm: { name: "Siegerhelm", rarity: "selten", hero: "nahkaempfer", tags: ["item", "ruestung"], text: "Gegner besiegt: 4 Block und 2 HP (max. 2/Zug).",
      passives: [{ trigger: "on_kill", action: "block", value: 4, maxPerTurn: 2 }, { trigger: "on_kill", action: "heal", value: 2, maxPerTurn: 2 }] },
    sperrfeuer: { name: "Sperrfeuer", rarity: "ungewoehnlich", hero: "fernkaempfer", tags: ["item", "fernkampf"], text: "Fernkampfkarte gespielt: 1 Schaden an ALLE (max. 4/Zug).",
      passives: [{ trigger: "on_card_played", cardTag: "fernkampf", action: "damage_all", value: 1, maxPerTurn: 4 }] },
    windlaeufer: { name: "Windläufer", rarity: "ungewoehnlich", hero: "fernkaempfer", tags: ["item", "ausweichen", "fernkampf"], text: "Erster Zug jedes Kampfes: weiche 1 Treffer aus. Fernkampfkarten: +1 Schaden.",
      passives: [{ trigger: "on_turn_start", action: "player_status", status: "ausweichen", stacks: 1, oncePerCombat: true }, { trigger: "damage_calc", cardTag: "fernkampf", op: "add", value: 1 }] },
    meisterschuetze: { name: "Meisterschütze", rarity: "selten", hero: "fernkaempfer", tags: ["item", "fernkampf", "debuff"], text: "Kampfbeginn: alle Gegner 2 Züge markiert. Ab 5 Fernkampf-Tags: Fernkampfkarten +30% Schaden.",
      passives: [{ trigger: "on_combat_start", action: "status_all", status: "markiert", stacks: 2 }, { trigger: "damage_calc", cardTag: "fernkampf", requires: { tag: "fernkampf", count: 5 }, op: "pct", value: 0.3 }] },
    arkane_feder: { name: "Arkane Feder", rarity: "ungewoehnlich", hero: "magier", tags: ["item", "zauber"], text: "Zauberkarten: +2 Schaden. Zauberkarte gespielt: 15% Chance auf +1 Energie (max. 1/Zug).",
      passives: [{ trigger: "damage_calc", cardTag: "zauber", op: "add", value: 2 }, { trigger: "on_card_played", cardTag: "zauber", action: "energy", value: 1, chance: 0.15, maxPerTurn: 1 }] },
    elementarkompass: { name: "Elementarkompass", rarity: "selten", hero: "magier", tags: ["item", "zauber"], text: "Kampfbeginn: ziehe 2 Karten. Reaktion: ziehe 1 Karte (max. 1/Zug).",
      passives: [{ trigger: "on_combat_start", action: "draw", value: 2 }, { trigger: "on_reaction", action: "draw", value: 1, maxPerTurn: 1 }] },
    prismakrone: { name: "Prismakrone", rarity: "legendaer", hero: "magier", tags: ["item", "zauber"], maxStack: 1, stats: { reaction: 50 }, text: "Reaktionen +50%. Reaktion: heile 2 HP (max. 2/Zug).",
      passives: [{ trigger: "on_reaction", action: "heal", value: 2, maxPerTurn: 2 }] },
    glutherz: { name: "Glutherz", rarity: "ungewoehnlich", hero: "pyromant", tags: ["item", "feuer"], text: "Du wirst getroffen: alle Gegner 2 Verbrennung (max. 2/Zug).",
      passives: [{ trigger: "on_player_hit", action: "status_all", status: "verbrennung", stacks: 2, maxPerTurn: 2 }] },
    schmerzkelch: { name: "Schmerzkelch", rarity: "selten", hero: "pyromant", tags: ["item", "feuer"], text: "Zugbeginn: -2 HP. Feuerkarten +4 Schaden.",
      passives: [{ trigger: "on_turn_start", action: "hurt", value: 2 }, { trigger: "damage_calc", cardTag: "feuer", op: "add", value: 4 }] },
    phoenixblut: { name: "Phönixblut", rarity: "legendaer", hero: "pyromant", tags: ["item", "feuer"], maxStack: 1, text: "Kampfbeginn: heile 8 HP. Feuerkarte gespielt: 1 Verbrennung auf ALLE (max. 2/Zug).",
      passives: [{ trigger: "on_combat_start", action: "heal", value: 8 }, { trigger: "on_card_played", cardTag: "feuer", action: "status_all", status: "verbrennung", stacks: 1, maxPerTurn: 2 }] },
    goldener_zahn: { name: "Goldener Zahn", rarity: "ungewoehnlich", hero: "aristokrat", tags: ["item", "gold"], stats: { goldPct: 20, ernte: 1 }, text: "+20% Gold, Ernte 1." },
    bankier: { name: "Bankier", rarity: "selten", hero: "aristokrat", tags: ["item", "gold"], text: "Alle Karten: +1 Grundschaden je 40 Gold, das du besitzt (max. +12).",
      passives: [{ trigger: "damage_calc", op: "baseadd", perGold: { step: 40, value: 1 }, cap: 12 }] },
    kronjuwelen: { name: "Kronjuwelen", rarity: "legendaer", hero: "aristokrat", tags: ["item", "gold"], maxStack: 1, stats: { goldPct: 50, ernte: 3 }, text: "+50% Gold, Ernte 3." },
    gruener_daumen: { name: "Grüner Daumen", rarity: "ungewoehnlich", hero: "gaertnerin", tags: ["item", "pflanze"], stats: { regen: 3 }, text: "Pflanzenkarten: +2 Schaden. Heile 3 HP nach jedem Kampf.",
      passives: [{ trigger: "damage_calc", cardTag: "pflanze", op: "add", value: 2 }] },
    erntekorb: { name: "Erntekorb", rarity: "ungewoehnlich", hero: "gaertnerin", tags: ["item", "pflanze"], text: "Pflanzenkarte gespielt: heile 1 HP (max. 3/Zug).",
      passives: [{ trigger: "on_card_played", cardTag: "pflanze", action: "heal", value: 1, maxPerTurn: 3 }] },
    weltenbaum: { name: "Weltenbaum", rarity: "legendaer", hero: "gaertnerin", tags: ["item", "pflanze"], maxStack: 1, stats: { maxHp: 10 }, text: "+10 Max-HP. Zugbeginn: heile 1 HP pro Pflanzen-Tag (max. 3).",
      passives: [{ trigger: "on_turn_start", action: "heal", perTag: "pflanze", value: 1, cap: 3 }] },
  },
};



});
__define("content/packs/abilities.js", function (__exports, __require) {
// SIGNATUR-FÄHIGKEITEN (an bekannte Anime-Fähigkeiten angelehnt): Jede Klasse wählt vor dem Run genau eine. Kosten keine Energie, nur einen Cooldown in eigenen Zügen.
// Stufe 2 gibt es NUR über Meta-Aufgaben im Hauptmenü (nie im Run): levels[0] überschreibt Werte (ganze Felder wie effects/forms/cost/cooldown werden ersetzt).
// effects: damage {base, weaponScale, hits, target "one"|"all", ignoreBlock, element, tags, status}, status {status, stacks, target "target"|"all"|"strongest"}, playerStatus, heal {pct}, block, draw, field {turns, xmult}.
// forms: Fähigkeit wechselt bei jedem Einsatz die Form (reihum). cost: {hp, gold}. unlock.stat: uses | damage | fieldDamage (Meta-Zähler).
__exports.default = {
  id: "abilities",
  name: "Fähigkeiten",
  abilities: {
    // ---- Hunter (Nahkämpfer): Nen-Techniken
    steinschere: { name: "Stein-Schere-Papier", class: "nahkaempfer", icon: "sword", cooldown: 5,
      text: "Wechselt bei jedem Einsatz die Form: Stein (Riesenschlag, ignoriert Block), Schere (3 Treffer mit Blutung), Papier (Schaden an ALLE und 4 Block). Alle 5 Züge.",
      forms: [
        { name: "Stein", effects: [{ type: "damage", base: 14, weaponScale: 3, target: "one", ignoreBlock: true }] },
        { name: "Schere", effects: [{ type: "damage", base: 4, weaponScale: 1, hits: 3, target: "one", status: { status: "blutung", stacks: 2 } }] },
        { name: "Papier", effects: [{ type: "damage", base: 6, weaponScale: 1, target: "all" }, { type: "block", value: 4 }] }],
      levels: [{ unlock: { stat: "uses", count: 40 }, task: "Setze Stein-Schere-Papier 40 Mal in Kämpfen ein.", reward: "Der Cooldown sinkt auf 4 Züge.", cooldown: 4,
        text: "Wechselt bei jedem Einsatz die Form: Stein (Riesenschlag, ignoriert Block), Schere (3 Treffer mit Blutung), Papier (Schaden an ALLE und 4 Block). Alle 4 Züge." }] },
    donnerjojo: { name: "Donner-Jojo", class: "nahkaempfer", icon: "bolt", cooldown: 5,
      text: "Elektro-Jojos treffen ALLE Gegner (8 + 2x Waffe, ignoriert Block) und betäuben den stärksten: er überspringt seine nächste Aktion (Bosse sind immun). Alle 5 Züge.",
      effects: [{ type: "damage", base: 8, weaponScale: 2, target: "all", ignoreBlock: true }, { type: "status", status: "aussetzen", stacks: 1, target: "strongest" }],
      levels: [{ unlock: { stat: "damage", count: 3000 }, task: "Verursache 3.000 Schaden mit dem Donner-Jojo.", reward: "Der Cooldown sinkt auf 4 Züge.", cooldown: 4,
        text: "Elektro-Jojos treffen ALLE Gegner (8 + 2x Waffe, ignoriert Block) und betäuben den stärksten: er überspringt seine nächste Aktion (Bosse sind immun). Alle 4 Züge." }] },
    // ---- Scout (Fernkämpfer)
    seelenpfeil: { name: "Seelenpfeil", class: "fernkaempfer", icon: "bolt", cooldown: 3,
      text: "Ein Geisterpfeil, den kein Block aufhält: 18 + 3x Waffe Schaden und das Ziel wird 3 Züge markiert. Alle 3 Züge.",
      effects: [{ type: "damage", base: 18, weaponScale: 3, target: "one", ignoreBlock: true }, { type: "status", status: "markiert", stacks: 3, target: "target" }],
      levels: [{ unlock: { stat: "uses", count: 45 }, task: "Setze den Seelenpfeil 45 Mal in Kämpfen ein.", reward: "Der Schaden steigt auf 26 + 3x Waffe.",
        effects: [{ type: "damage", base: 26, weaponScale: 3, target: "one", ignoreBlock: true }, { type: "status", status: "markiert", stacks: 3, target: "target" }],
        text: "Ein Geisterpfeil, den kein Block aufhält: 26 + 3x Waffe Schaden und das Ziel wird 3 Züge markiert. Alle 3 Züge." }] },
    schattentausch: { name: "Schattentausch", class: "fernkaempfer", icon: "wind", cooldown: 5,
      text: "Du tauschst den Platz mit deinem Schatten: weiche den nächsten 2 Angriffen aus und ziehe 3 Karten. Alle 5 Züge.",
      effects: [{ type: "playerStatus", status: "ausweichen", stacks: 2 }, { type: "draw", value: 3 }],
      levels: [{ unlock: { stat: "uses", count: 30 }, task: "Setze den Schattentausch 30 Mal in Kämpfen ein.", reward: "Du weichst 3 Angriffen aus.",
        effects: [{ type: "playerStatus", status: "ausweichen", stacks: 3 }, { type: "draw", value: 3 }],
        text: "Du tauschst den Platz mit deinem Schatten: weiche den nächsten 3 Angriffen aus und ziehe 3 Karten. Alle 5 Züge." }] },
    // ---- Sorcerer (Fluchmagier)
    fluchblitz: { name: "Fluchblitz", class: "magier", icon: "bolt", cooldown: 3,
      text: "Ein Zauber-Schlag, den kein Block aufhält: 14 + 2x Waffe Schaden an einem Gegner. Alle 3 Züge.",
      effects: [{ type: "damage", base: 14, weaponScale: 2, target: "one", ignoreBlock: true, tags: ["zauber"] }],
      levels: [{ unlock: { stat: "uses", count: 50 }, task: "Setze den Fluchblitz 50 Mal in Kämpfen ein.", reward: "Der Schaden steigt auf 22 + 2x Waffe.",
        effects: [{ type: "damage", base: 22, weaponScale: 2, target: "one", ignoreBlock: true, tags: ["zauber"] }],
        text: "Ein Zauber-Schlag, den kein Block aufhält: 22 + 2x Waffe Schaden an einem Gegner. Alle 3 Züge." }] },
    domain: { name: "Sphärenentfaltung", class: "magier", icon: "star", cooldown: 6,
      text: "2 Züge lang ignorieren alle deine Treffer den Block der Gegner und machen x1,5 Endschaden. Alle 6 Züge.",
      effects: [{ type: "field", turns: 2, xmult: 0.5 }],
      levels: [{ unlock: { stat: "fieldDamage", count: 5000 }, task: "Verursache 5.000 Gesamtschaden, während die Sphärenentfaltung aktiv ist.", reward: "Der Cooldown sinkt auf 5 Züge.", cooldown: 5,
        text: "2 Züge lang ignorieren alle deine Treffer den Block der Gegner und machen x1,5 Endschaden. Alle 5 Züge." }] },
    // ---- Pyromancer
    feuerfaust: { name: "Feuerfaust", class: "pyromant", icon: "flame", cooldown: 3,
      text: "Eine brennende Faust: 12 + 2x Waffe Feuerschaden an einem Gegner und 3 Verbrennung. Alle 3 Züge.",
      effects: [{ type: "damage", base: 12, weaponScale: 2, target: "one", element: "feuer", status: { status: "verbrennung", stacks: 3 } }],
      levels: [{ unlock: { stat: "uses", count: 50 }, task: "Setze die Feuerfaust 50 Mal in Kämpfen ein.", reward: "Die Verbrennung steigt auf 5.",
        effects: [{ type: "damage", base: 12, weaponScale: 2, target: "one", element: "feuer", status: { status: "verbrennung", stacks: 5 } }],
        text: "Eine brennende Faust: 12 + 2x Waffe Feuerschaden an einem Gegner und 5 Verbrennung. Alle 3 Züge." }] },
    hoellenflamme: { name: "Höllenflamme", class: "pyromant", icon: "flame", cooldown: 5, cost: { hp: 6 },
      text: "Du zahlst 6 HP (nie unter 1): 10 + 2x Waffe Feuerschaden an ALLE Gegner und 8 Verbrennung auf alle. Alle 5 Züge.",
      effects: [{ type: "damage", base: 10, weaponScale: 2, target: "all", element: "feuer", status: { status: "verbrennung", stacks: 8 } }],
      levels: [{ unlock: { stat: "uses", count: 25 }, task: "Setze die Höllenflamme 25 Mal in Kämpfen ein.", reward: "Sie kostet nur noch 4 HP.", cost: { hp: 4 },
        text: "Du zahlst 4 HP (nie unter 1): 10 + 2x Waffe Feuerschaden an ALLE Gegner und 8 Verbrennung auf alle. Alle 5 Züge." }] },
    // ---- Noble
    tor_der_schaetze: { name: "Tor der Schätze", class: "aristokrat", icon: "coin", cooldown: 4, cost: { gold: 10 },
      text: "Du öffnest dein Schatzhaus (10 Gold): 22 + 2x Waffe Schaden an ALLE Gegner, ignoriert Block. Alle 4 Züge.",
      effects: [{ type: "damage", base: 22, weaponScale: 2, target: "all", ignoreBlock: true }],
      levels: [{ unlock: { stat: "uses", count: 35 }, task: "Öffne das Tor der Schätze 35 Mal in Kämpfen.", reward: "Es kostet nur noch 6 Gold.", cost: { gold: 6 },
        text: "Du öffnest dein Schatzhaus (6 Gold): 22 + 2x Waffe Schaden an ALLE Gegner, ignoriert Block. Alle 4 Züge." }] },
    absoluter_befehl: { name: "Absoluter Befehl", class: "aristokrat", icon: "bolt", cooldown: 5,
      text: "Der stärkste Gegner gehorcht: er überspringt seine nächste Aktion (Bosse sind immun), und alle Gegner werden 3 Züge verwundbar. Alle 5 Züge.",
      effects: [{ type: "status", status: "aussetzen", stacks: 1, target: "strongest" }, { type: "status", status: "verwundbar", stacks: 3, target: "all" }],
      levels: [{ unlock: { stat: "uses", count: 20 }, task: "Gib den Absoluten Befehl 20 Mal in Kämpfen.", reward: "Der Cooldown sinkt auf 4 Züge.", cooldown: 4,
        text: "Der stärkste Gegner gehorcht: er überspringt seine nächste Aktion (Bosse sind immun), und alle Gegner werden 3 Züge verwundbar. Alle 4 Züge." }] },
    // ---- Herbalist
    heilende_ranken: { name: "Heilende Ranken", class: "gaertnerin", icon: "heart", cooldown: 5,
      text: "Ranken umhüllen dich: heile 20% deiner Max-HP und erhalte Dornen 3. Alle 5 Züge.",
      effects: [{ type: "heal", pct: 20 }, { type: "playerStatus", status: "dornen", stacks: 3 }],
      levels: [{ unlock: { stat: "uses", count: 30 }, task: "Setze die Heilenden Ranken 30 Mal in Kämpfen ein.", reward: "Sie heilen 30% deiner Max-HP.",
        effects: [{ type: "heal", pct: 30 }, { type: "playerStatus", status: "dornen", stacks: 3 }],
        text: "Ranken umhüllen dich: heile 30% deiner Max-HP und erhalte Dornen 3. Alle 5 Züge." }] },
    wuchernder_wald: { name: "Wuchernder Wald", class: "gaertnerin", icon: "leaf", cooldown: 4,
      text: "Ein Wald bricht aus dem Boden: 7 + 2x Waffe Pflanzenschaden an ALLE Gegner und 4 Blutung auf alle. Alle 4 Züge.",
      effects: [{ type: "damage", base: 7, weaponScale: 2, target: "all", element: "pflanze", status: { status: "blutung", stacks: 4 } }],
      levels: [{ unlock: { stat: "damage", count: 2500 }, task: "Verursache 2.500 Schaden mit dem Wuchernden Wald.", reward: "Die Blutung steigt auf 6.",
        effects: [{ type: "damage", base: 7, weaponScale: 2, target: "all", element: "pflanze", status: { status: "blutung", stacks: 6 } }],
        text: "Ein Wald bricht aus dem Boden: 7 + 2x Waffe Pflanzenschaden an ALLE Gegner und 6 Blutung auf alle. Alle 4 Züge." }] },
  },
};



});
__define("content/packs/stat_items.js", function (__exports, __require) {
// WERT-ITEMS (Brotato-Richtung): Items geben Werte, oft mit Plus UND Minus. Dazu skalieren drei Items mit einem Wert (perStat).
// ADAPT: bestehende Items werden auf die Werte umgebaut (ersetzen ihre alten Boni).
const PACK = {
  id: "statitems",
  name: "Wert-Items",
  items: {
    kraftring: { name: "Kraftring", tags: ["item"], stats: { damagePct: 4 }, text: "+4% Schaden." },
    kriegsbemalung: { name: "Kriegsbemalung", tags: ["item"], stats: { damagePct: 8, armor: -1 }, text: "+8% Schaden, -1 Rüstung." },
    gewichtsweste: { name: "Gewichtsweste", tags: ["item", "ruestung"], stats: { armor: 3, dodge: -5 }, text: "+3 Rüstung, -5% Ausweichen." },
    federstiefel: { name: "Federstiefel", tags: ["item", "ausweichen"], stats: { dodge: 10, armor: -1 }, text: "+10% Ausweichen, -1 Rüstung." },
    wuchtgurt: { name: "Wuchtgurt", tags: ["item", "nahkampf"], stats: { meleeDmg: 3, dodge: -3 }, text: "+3 Nahkampfschaden, -3% Ausweichen." },
    heilkraut: { name: "Heilkraut", tags: ["item", "pflanze"], stats: { regen: 2, maxHp: 2 }, text: "+2 Regeneration, +2 Max-HP." },
    stahlhaut: { name: "Stahlhaut", tags: ["item", "ruestung"], stats: { armor: 2, maxHp: 6 }, text: "+2 Rüstung, +6 Max-HP." },
    sparbuch: { name: "Sparbuch", tags: ["item", "gold"], stats: { ernte: 2, damagePct: -2 }, text: "+2 Ernte, -2% Schaden." },
    scharfes_auge: { name: "Scharfes Auge", rarity: "ungewoehnlich", tags: ["item", "fernkampf"], stats: { crit: 8, rangedDmg: 1 }, text: "+8% Krit-Chance, +1 Fernkampfschaden." },
    elementarfokus: { name: "Elementarfokus", rarity: "ungewoehnlich", tags: ["item", "zauber"], stats: { elementDmg: 3, armor: -1 }, text: "+3 Elementarschaden, -1 Rüstung." },
    blutdurstamulett: { name: "Blutdurstamulett", rarity: "ungewoehnlich", tags: ["item", "blut"], stats: { lifesteal: 5, maxHp: -6 }, text: "+5% Lebensraub, -6 Max-HP." },
    glueckskeks: { name: "Glückskeks", rarity: "ungewoehnlich", tags: ["item", "gold"], stats: { luck: 3, ernte: 1 }, text: "+3 Glück, +1 Ernte." },
    kampfnarben: { name: "Kampfnarben", rarity: "ungewoehnlich", tags: ["item"], stats: { crit: 6, damagePct: 3 }, text: "+6% Krit-Chance, +3% Schaden." },
    schattenmantel: { name: "Schattenmantel", rarity: "ungewoehnlich", tags: ["item", "ausweichen"], stats: { dodge: 8, crit: 4 }, text: "+8% Ausweichen, +4% Krit-Chance." },
    panzerfaust: { name: "Panzerfaust", rarity: "ungewoehnlich", tags: ["item", "block", "ruestung"], text: "Alle Karten: +1 Schaden je 3 Rüstung (max. +6).",
      passives: [{ trigger: "damage_calc", op: "add", value: 1, perStat: { stat: "armor", step: 3 }, cap: 6 }] },
    glueckspilz: { name: "Glückspilz", rarity: "ungewoehnlich", tags: ["item", "gold"], text: "Alle Karten: +1 Schaden je 3 Glück (max. +6).",
      passives: [{ trigger: "damage_calc", op: "add", value: 1, perStat: { stat: "luck", step: 3 }, cap: 6 }] },
    schattenklinge: { name: "Schattenklinge", rarity: "ungewoehnlich", tags: ["item", "ausweichen"], text: "Alle Karten: +1 Schaden je 4% Ausweichen (max. +6).",
      passives: [{ trigger: "damage_calc", op: "add", value: 1, perStat: { stat: "dodge", step: 4 }, cap: 6 }] },
    rotes_siegel: { name: "Rotes Siegel", rarity: "selten", tags: ["item", "blut"], stats: { damagePct: 10, lifesteal: 4, maxHp: -10 }, text: "+10% Schaden, +4% Lebensraub, -10 Max-HP." },
    gutschein: { name: "Gutschein", tags: ["item", "gold"], stats: { priceMod: -10 }, text: "-10% Preise im Shop." },
    handelsabkommen: { name: "Handelsabkommen", rarity: "ungewoehnlich", tags: ["item", "gold"], stats: { priceMod: -20, ernte: 1 }, text: "-20% Preise im Shop, +1 Ernte." },
    wuerfelbecher: { name: "Würfelbecher", rarity: "ungewoehnlich", tags: ["item", "gold"], stats: { rerollMod: -50, freeRerolls: 1 }, text: "1 freier Reroll pro Shop, Reroll-Preis -50%." },
    gluecksrad: { name: "Glücksrad", rarity: "selten", tags: ["item", "gold"], stats: { freeRerolls: 2, luck: 2 }, text: "2 freie Rerolls pro Shop, +2 Glück." },
    drachentoeter: { name: "Drachentöter", rarity: "ungewoehnlich", tags: ["item", "nahkampf"], stats: { bossDmg: 25 }, text: "+25% Schaden gegen Bosse, Wächter und Elite." },
    henkersbeil: { name: "Henkersbeil", rarity: "selten", tags: ["item", "nahkampf"], stats: { bossDmg: 50, armor: -1 }, text: "+50% Schaden gegen Bosse, Wächter und Elite, -1 Rüstung." },
    schlangengift: { name: "Schlangengift", rarity: "ungewoehnlich", tags: ["item", "gift"], stats: { poisonPower: 1 }, text: "Gift tickt +1 Schaden stärker." },
    gluthoel: { name: "Glutöl", rarity: "ungewoehnlich", tags: ["item", "feuer"], stats: { burnPower: 1 }, text: "Verbrennung tickt +1 Schaden stärker." },
    dornenwein: { name: "Dornenwein", rarity: "ungewoehnlich", tags: ["item", "blut"], stats: { bleedPower: 1 }, text: "Blutung tickt +1 Schaden stärker." },
    kraeutertee: { name: "Kräutertee", tags: ["item", "pflanze"], stats: { healPct: 25 }, text: "+25% Heilung." },
    lebensquell: { name: "Lebensquell", rarity: "selten", tags: ["item", "pflanze"], stats: { healPct: 50, regen: 1 }, text: "+50% Heilung, +1 Regeneration." },
    goldwaescher: { name: "Goldwäscher", rarity: "ungewoehnlich", tags: ["item", "gold"], stats: { doubleChance: 15 }, text: "15% Chance, dass die Gold-Belohnung eines Kampfes verdoppelt wird." },
    gluecksmuenze: { name: "Glücksmünze", tags: ["item", "gold"], stats: { doubleChance: 10, luck: 1 }, text: "10% Doppel-Gold-Chance, +1 Glück." },
    verfluchter_dolch: { name: "Verfluchter Dolch", rarity: "selten", maxStack: 1, tags: ["item", "fluch"], stats: { curse: 15, damagePct: 14 }, text: "+15 Fluch (Gegner stärker, mehr Gold und bessere Beute), +14% Schaden." },
    fluchsiegel: { name: "Fluchsiegel", rarity: "ungewoehnlich", tags: ["item", "fluch"], stats: { curse: 8, luck: 2, ernte: 1 }, text: "+8 Fluch, +2 Glück, +1 Ernte." },
    daemonenpakt: { name: "Dämonenpakt", rarity: "legendaer", maxStack: 1, tags: ["item", "fluch"], stats: { curse: 25, damagePct: 20, armor: 2 }, text: "+25 Fluch, +20% Schaden, +2 Rüstung." },
    herz_der_vollendung: { name: "Herz der Vollendung", rarity: "legendaer", maxStack: 1, tags: ["item"], unlock: { type: "achievement", id: "x_vollendung" }, stats: { damagePct: 10, armor: 2, luck: 3, regen: 2, crit: 6, maxHp: 15, ernte: 2 }, text: "Die Belohnung für 100%: +10% Schaden, +2 Rüstung, +3 Glück, +2 Regeneration, +6% Krit, +15 Max-HP, +2 Ernte." },
    koenigsring: { name: "Königsring", rarity: "selten", tags: ["item", "gold"], stats: { luck: 4, ernte: 2, damagePct: 5, armor: -1 }, text: "+4 Glück, +2 Ernte, +5% Schaden, -1 Rüstung." },
  },
};
const ADAPT = {
  koenigsring: { maxStack: 1 }, rotes_siegel: { maxStack: 1 }, glaskanone: { maxStack: 1 }, kartenhaus: { maxStack: 1 }, krone_des_maertyrers: { maxStack: 1 }, asche_lunge: { maxStack: 1 }, schillernder_charme: { maxStack: 2 }, apothekerwaage: { maxStack: 1 }, flammenkrone: { maxStack: 1 }, herz_des_winters: { maxStack: 1 },
  wetzstein: { stats: { meleeDmg: 2 }, passives: [], text: "+2 Nahkampfschaden." },
  koecher: { stats: { rangedDmg: 2 }, passives: [], text: "+2 Fernkampfschaden." },
  grimoire: { stats: { elementDmg: 2 }, passives: [], text: "+2 Elementarschaden." },
  lederweste: { stats: { armor: 1 }, text: "+8 Max-HP, +1 Rüstung." },
  eisenpanzer: { stats: { armor: 2 }, text: "+2 Rüstung. Erster Zug jedes Kampfes: 4 Block." },
  eisenhelm: { stats: { armor: 1 }, text: "+1 Rüstung. Erster Zug jedes Kampfes: 6 Block." },
  vampirzahn: { stats: { lifesteal: 3 }, text: "+3% Lebensraub. Gegner besiegt: heile 4 HP (max. 2/Zug)." },
  leichtfuessig: { stats: { dodge: 6 }, text: "+6% Ausweichen. Erster Zug jedes Kampfes: weiche 2 Treffern aus." },
  adlerauge: { stats: { crit: 6 }, text: "+6% Krit-Chance. Kampfbeginn: alle Gegner 2 Züge markiert." },
  dornenruestung: { stats: { armor: 1 }, text: "+1 Rüstung. Wer dich trifft, nimmt 3 Schaden." },
};
PACK.adapt = ADAPT;
__exports.default = PACK;



});
__define("content/packs/thema_anime.js", function (__exports, __require) {
// THEMA: Moderne Dark-Fantasy im Anime-Stil (Gates, Hunter, Mana-Kern). Ersetzt NUR Anzeigenamen und Geschichte; IDs, Werte und Mechanik bleiben unverändert.
// Neue Helden gehören zu einer Klasse (Archetyp); die Klassen-IDs bleiben die bisherigen. Englische Fassung: ui/en_world.js.
__exports.default = {
  classes: { nahkaempfer: { name: "Hunter" }, fernkaempfer: { name: "Scout" }, magier: { name: "Sorcerer" }, pyromant: { name: "Pyromancer" }, aristokrat: { name: "Noble" }, gaertnerin: { name: "Herbalist" } },
  enemies: { ratte: { name: "Gate-Ratte" }, skelett: { name: "Knochensoldat" }, bandit: { name: "Syndikat-Schläger" }, steingolem: { name: "Beton-Golem" }, knochenhauptmann: { name: "Knochenmarschall" }, glutgeist: { name: "Fluchflamme" },
    dornenranke: { name: "Fressende Ranke" }, flussgeist: { name: "Kanal-Geist" }, sumpfgeist: { name: "Smog-Geist" }, elementarwandler: { name: "Gate-Lord" } },
  encounters: { kellerratten: { name: "Gate-Ratten (erster Kampf)" }, wachposten: { name: "Syndikat-Posten (gemischt)" }, steinwaechter: { name: "Betonwächter (ein zäher Gegner)" }, banditenbande: { name: "Syndikat-Bande (5 Mini-Bosse)" },
    knochenhauptmann: { name: "Knochenmarschall (Mini-Boss allein)" }, gluthoehle: { name: "Brandzone (Fluchflammen)" }, eliterudel: { name: "Eisrudel (Elite)" }, pflanzenhain: { name: "Wuchergarten (Ranken + Smog-Geist)" },
    sumpfwacht: { name: "Smogwacht (Elite)" }, flussufer: { name: "Kanalufer (Wassergeister)" }, boss_wandler: { name: "Gate-Lord (Endboss)" } },
  achievements: { g500: { name: "Legende der Gates" }, w1: { name: "Der Gate-Lord fällt" }, w25: { name: "Gate-Legende" } },
  cards: { hieb: { name: "Direkter Treffer" }, wuchtschlag: { name: "Ernster Schlag" }, wirbel: { name: "Sturmwirbel" }, deckung: { name: "Abwehrhaltung" }, schildwall: { name: "Unbezwingbare Mauer" }, adrenalin: { name: "Zweiter Gang" }, schwachstelle: { name: "Linie des Todes" }, wasserstrahl: { name: "Hydro-Lanze" }, flutwelle: { name: "Tsunami-Schlag" }, dornenpeitsche: { name: "Rosenpeitsche" }, flammenhieb: { name: "Atem der Flamme" }, feuerball: { name: "Feuerball-Jutsu" }, inferno: { name: "Schwarze Flamme" }, phoenixschlag: { name: "Phönixsturz" }, giftklinge: { name: "Viperbiss" }, giftwolke: { name: "Toxische Schwaden" }, pandemie: { name: "Ausbruch" }, aufschlitzen: { name: "Raubtier-Kralle" }, blutrausch: { name: "Berserker-Wut" }, eissplitter: { name: "Gefrorener Splitter" }, frostnova: { name: "Kristallwelt" }, eiszeit: { name: "Absolute Null" }, schnellschuss: { name: "Blitzschuss" }, zielen: { name: "Adleraugen-Fokus" }, rolle: { name: "Blitzschritt" }, praezisionsschuss: { name: "Punktgenauer Treffer" }, giftpfeil: { name: "Giftdorn-Pfeil" }, brandpfeil: { name: "Glutpfeil" }, eispfeil: { name: "Frostspitze" }, nachladen: { name: "Schneller Wechsel" }, salve: { name: "Drei-Pfeil-Salve" }, pfeilhagel: { name: "Pfeilregen" }, fluchtschuss: { name: "Rückzugsschuss" }, scharfschuetze: { name: "Todesschuss" }, dauerfeuer: { name: "Dauerbeschuss" }, pfeilsturm: { name: "Himmel aus Pfeilen" }, funke: { name: "Zündfunke" }, tropfen: { name: "Wasserperle" }, ranke: { name: "Würgender Spross" }, frostnadel: { name: "Eisnadel-Stich" }, manaschild: { name: "Mana-Barriere" }, arkanblitz: { name: "Reiner Mana-Strahl" }, gedankenblitz: { name: "Plötzliche Eingebung" }, flammenwelle: { name: "Brandwelle" }, dornenwall: { name: "Dornenhecke" }, eisregen: { name: "Hagelsturm" }, meteor: { name: "Sternenfall" }, arkaner_sturm: { name: "Manasturm" }, prismasturm: { name: "Elementarer Zorn" }, schildstoss: { name: "Bollwerk-Stoß" }, dornenpanzer: { name: "Stachelpanzer" }, eiserner_wille: { name: "Unbeugsamer Wille" }, bollwerk: { name: "Titanenmauer" }, festungsbau: { name: "Zitadelle" }, blutopfer: { name: "Äquivalenter Tausch" }, blutdurst: { name: "Durst der Klinge" }, zerfleischen: { name: "Gnadenloses Zerfetzen" }, aderlass: { name: "Blutige Beschwörung" }, lodernder_schmerz: { name: "Flammende Qual" }, feuersturm: { name: "Höllenfeuer-Sturm" }, taschendiebstahl: { name: "Fertigkeiten-Raub" }, bestechung: { name: "Schmiergeld" }, photosynthese: { name: "Sonnenbad" }, sporenwolke: { name: "Sporenschleier" }, blutsauger_ranke: { name: "Vampir-Liane" }, selbstentzuendung: { name: "Inneres Feuer" }, flammenmantel: { name: "Glutmantel" }, schuldschein: { name: "Blankoscheck" }, dekadenz: { name: "Goldener Exzess" }, rankendornen: { name: "Verflochtene Dornen" }, wurzelgeflecht: { name: "Lebenswurzeln" } },
  items: { quellstein: { name: "Ozean-Splitter" }, gezeitenperle: { name: "Mondflut-Perle" }, treibholz: { name: "Schiffbruch-Splitter" }, dornenring: { name: "Rosenring" }, sporenbeutel: { name: "Myzel-Beutel" }, wurzelherz: { name: "Keimling des Lebens" }, eisenpanzer: { name: "Schwarzstahl-Weste" }, vielfaltsmedaille: { name: "S-Rang-Abzeichen" }, kleeblatt: { name: "Fünfblatt-Klee" }, glueckswuerfel: { name: "Zockerwürfel" }, prismalinse: { name: "Wahrheitsbrille" }, jaegerauge: { name: "Scharlachrote Augen" }, lederweste: { name: "Jägerweste" }, eisenhelm: { name: "Gate-Einsatzhelm" }, muenzbeutel: { name: "Gilden-Taschengeld" }, feldflasche: { name: "Konbini-Tee" }, hasenpfote: { name: "Maneki-Neko" }, wetzstein: { name: "Schwertschmied-Stein" }, notfallration: { name: "Onigiri-Ration" }, rucksack: { name: "Inventar-Tasche" }, ledergurt: { name: "Werkzeuggürtel" }, dornenruestung: { name: "Stachel-Exoskelett" }, kampfhorn: { name: "Gate-Sirene" }, adrenalinpumpe: { name: "Notfall-Injektor" }, beutegier: { name: "Raubtier-Instinkt" }, kriegstrommel: { name: "Kriegs-Taiko" }, echostein: { name: "Hanafuda-Ohrringe" }, meisterhammer: { name: "Schmiedekönig-Hammer" }, taschenuhr: { name: "Zeitstopp-Uhr" }, energiekristall: { name: "Instabiler Mana-Kern" }, blutpakt: { name: "Geass-Vertrag" }, glaskanone: { name: "Zerbrechliche Macht" }, goldene_waage: { name: "Händlers Goldwaage" }, kartenhaus: { name: "Joker-Kartenspiel" }, schillernder_charme: { name: "Chromatisches Amulett" }, phoenixfeder: { name: "Blauer Phönix" }, funkenfeuerzeug: { name: "Zippo des Pyromanen" }, lavaruestung: { name: "Magma-Panzer" }, glutschale: { name: "Kohlenbecken" }, aschemantel: { name: "Aschenmantel" }, glutstein: { name: "Ember-Kristall" }, schmiedeherz: { name: "Herz der Esse" }, flammenkrone: { name: "Flammenkönig-Krone" }, giftzahn: { name: "Hydra-Zahn" }, schierlingsflasche: { name: "Apotheker-Fläschchen" }, miasmaflasche: { name: "Miasma-Gefäß" }, leichengift: { name: "Verwesungs-Essenz" }, apothekerwaage: { name: "Alchemisten-Mörser" }, seuchenkoenig: { name: "Pestkönig" }, giftring: { name: "Skorpion-Ring" }, seuchenbeutel: { name: "Pest-Talisman" }, blutegel: { name: "Parasit" }, rasiermesser: { name: "Todes-Rasiermesser" }, vampirzahn: { name: "Nosferatu-Reißzahn" }, dornenkrone: { name: "Leidenskrone" }, blutmond: { name: "Roter Vollmond" }, opferdolch: { name: "Ritual-Tanto" }, blutkelch: { name: "Blutnacht-Kelch" }, raureif: { name: "Eishauch" }, eiszapfen: { name: "Eislanze" }, schneekugel: { name: "Winter-Globus" }, kaelteamulett: { name: "Schneefrau-Amulett" }, herz_des_winters: { name: "Eismonarch-Herz" }, eiskristall: { name: "Gefrorene Träne" }, frostherz: { name: "Kaltes Herz" }, koecher: { name: "Reishi-Köcher" }, munitionsgurt: { name: "Magazin-Bandelier" }, adlerauge: { name: "Falkenblick" }, leichtfuessig: { name: "Wolkenschritt" }, jagdzeichen: { name: "Hunter-Lizenz" }, zielfernrohr: { name: "Sniper-Visier" }, grimoire: { name: "Zauberbuch der Gilde" }, funkenschlag: { name: "Elektro-Impuls" }, gedankenstein: { name: "Telepathie-Stein" }, resonanzkristall: { name: "Resonanz-Kern" }, manaquelle: { name: "Brunnen der Magie" }, elementarlinse: { name: "Elementar-Prisma" }, feuerflasche: { name: "Brandflasche" }, heiltrank: { name: "Senzu-Bohne" }, rauchbombe: { name: "Ninja-Rauchbombe" }, giftphiole: { name: "Toxin-Ampulle" }, frostphiole: { name: "Kältekapsel" }, blutampulle: { name: "Berserker-Ampulle" }, schlachtrufrolle: { name: "Kriegs-Schriftrolle" }, prismasplitter: { name: "Regenbogenscherbe" }, phoenixasche: { name: "Wiedergeburts-Asche" }, narbenleder: { name: "Vernarbte Haut" }, stachelschild: { name: "Stachel-Buckler" }, eisenfaust: { name: "Stahl-Knöchel" }, pech_raeucherstaebchen: { name: "Fluchweihrauch" }, asche_lunge: { name: "Rauchlunge" }, krone_des_maertyrers: { name: "Märtyrer-Aureole" }, erntesichel: { name: "Schnitter-Sichel" }, vorratskammer: { name: "Konbini-Lager" }, boerse_des_geizkragens: { name: "Geizhals-Brieftasche" }, midas_fluch: { name: "Goldene Hand" }, nekromanten_pakt: { name: "Skelettkönig-Pakt" }, wuchernde_wurzeln: { name: "Lebendiger Wald" }, ritterschwur: { name: "Hunter-Eid" }, eisenwall: { name: "Mauer-Fragment" }, siegerhelm: { name: "Trophäen-Helm" }, sperrfeuer: { name: "Deckungsfeuer-Modul" }, windlaeufer: { name: "Windläufer-Stiefel" }, meisterschuetze: { name: "Scharfschützen-Orden" }, arkane_feder: { name: "Grimoire-Feder" }, elementarkompass: { name: "Mana-Kompass" }, prismakrone: { name: "Erzmagier-Diadem" }, glutherz: { name: "Pyro-Kern" }, schmerzkelch: { name: "Kelch der Qual" }, phoenixblut: { name: "Unsterbliches Blut" }, goldener_zahn: { name: "Goldzahn-Grinsen" }, bankier: { name: "Schwarze Kreditkarte" }, kronjuwelen: { name: "Juwelen des Hauses" }, gruener_daumen: { name: "Hand der Natur" }, erntekorb: { name: "Korb der Fülle" }, weltenbaum: { name: "Yggdrasil-Zweig" }, kraftring: { name: "Kraft-Armband" }, kriegsbemalung: { name: "Kriegs-Tattoo" }, gewichtsweste: { name: "Trainingsgewichte" }, federstiefel: { name: "Sprint-Sneaker" }, wuchtgurt: { name: "Champion-Gürtel" }, heilkraut: { name: "Kräuterbündel" }, stahlhaut: { name: "Stahlhaut-Technik" }, sparbuch: { name: "Haushaltsbuch" }, scharfes_auge: { name: "Zielhilfe-Monokel" }, elementarfokus: { name: "Fokus-Kristall" }, blutdurstamulett: { name: "Blutdurst-Anhänger" }, glueckskeks: { name: "Omikuji-Zettel" }, kampfnarben: { name: "Veteranen-Narben" }, schattenmantel: { name: "Schattenmonarch-Umhang" }, panzerfaust: { name: "Titanfaust" }, glueckspilz: { name: "Fliegenpilz-Talisman" }, schattenklinge: { name: "Schatten-Kunai" }, rotes_siegel: { name: "Crimson-Siegel" }, gutschein: { name: "Gilden-Rabattmarke" }, handelsabkommen: { name: "Kaufmanns-Abkommen" }, wuerfelbecher: { name: "Gacha-Kapsel" }, gluecksrad: { name: "Schicksals-Roulette" }, drachentoeter: { name: "Drachentöter" }, henkersbeil: { name: "Henker-Guillotine" }, schlangengift: { name: "Schlangen-Toxin" }, gluthoel: { name: "Brandöl" }, dornenwein: { name: "Blutroter Wein" }, kraeutertee: { name: "Beruhigungstee" }, lebensquell: { name: "Quell der Jugend" }, goldwaescher: { name: "Goldsucher-Pfanne" }, gluecksmuenze: { name: "Fünf-Yen-Münze" }, verfluchter_dolch: { name: "Muramasa-Dolch" }, fluchsiegel: { name: "Fluch-Ofuda" }, daemonenpakt: { name: "Dämonenfürst-Pakt" }, koenigsring: { name: "Königlicher Siegelring" }, herz_der_vollendung: { name: "Kern der Vollendung", text: "Die Belohnung für 100%: +10% Schaden, +2 Rüstung, +3 Glück, +2 Regeneration, +6% Krit, +15 Max-HP, +2 Ernte." } },
  speakers: { brumm: { name: "Brumm", title: "Besitzer des Konbini am Gate" }, mira: { name: "Mira", title: "Forscherin der Hunter-Gilde" } },
  stories: {
    intro: [
      "Psst! Du da! Ja, du. Komm rein, bevor dich der Regen erwischt. Wenn das Regen ist. Heute war es Ascheregen aus dem Gate.",
      "Letzte Nacht hat der Gate-Lord das Hauptquartier der Hunter-Gilde gestürmt und den Mana-Kern geraubt. Er hält Feuer, Wasser, Pflanzen und Eis im Gleichgewicht.",
      "Und er hat Mira mitgenommen. Nur sie konnte den Kern zum Singen bringen.",
      { perClass: {
        nahkaempfer: "Du siehst aus, als hättest du schon mal ein Gate mit der Stirn geöffnet. Perfekt. Hinter dem Gate braucht man Leute wie dich.",
        fernkaempfer: "Gute Augen, leise Schritte. Genau das, was die Gates verlangen. Und nein, deine Pfeile bezahlt niemand.",
        magier: "Ein Sorcerer! Endlich jemand, der die Elemente versteht. Seit der Kern weg ist, vertragen sie sich nicht mehr. Mischst du sie, knallt es.",
        pyromant: "Du riechst nach Rauch und siehst aus, als wäre dir das egal. Gut. Hinter dem Gate brennt es sowieso.",
        aristokrat: "Ein feiner Herr aus gutem Clan! Verlaufen? Nein? Dann nimm den Gehstock, das Portemonnaie bleibt hier. Hinter dem Gate kostet alles extra.",
        gaertnerin: "Eine Kräuterkundige im Gate? Nun, Unkraut gibt es dort genug. Und die Wände könnten etwas Grün vertragen.",
        default: "Du siehst fähig aus. Das reicht mir.",
      } },
      "Im Gate wimmelt es von Biestern. Sammle Karten, Beute und Gold. Und wenn etwas Glitzerndes vorbeikommt: schnapp es dir. Es lohnt sich.",
      "Das erste Gate ist gleich hier. Los! Und bring mir Mira heil zurück!",
    ],
    startladen: ["Die Ratten hast du überlebt. Sieh dich um, halber Preis, weil ich dich mag."],
    outro: ["Geschafft! Der Gate-Lord ist besiegt, und der Mana-Kern singt wieder.", "Übrigens behauptet Brumm, er hätte alles geplant. Glaub ihm kein Wort."],
  },
};



});
__define("content/index.js", function (__exports, __require) {
// Hier werden alle Sets geladen. Neues Set = eine Import-Zeile + eine register-Zeile.
const { createContent } = __require("content/registry.js");
const core = __require("content/packs/core.js").default;
const feuer = __require("content/packs/feuer.js").default;
const gift = __require("content/packs/gift.js").default;
const blut = __require("content/packs/blut.js").default;
const frost = __require("content/packs/frost.js").default;
const wildnis = __require("content/packs/wildnis.js").default;
const ausruestung = __require("content/packs/ausruestung.js").default;
const boss = __require("content/packs/boss.js").default;
const events = __require("content/packs/events.js").default;
const fernkaempfer = __require("content/packs/fernkaempfer.js").default;
const magier = __require("content/packs/magier.js").default;
const achievements = __require("content/packs/achievements.js").default;
const aktiv = __require("content/packs/aktiv.js").default;
const bollwerk = __require("content/packs/bollwerk.js").default;
const pyro = __require("content/packs/pyro.js").default;
const aristokratGaertner = __require("content/packs/aristokrat_gaertner.js").default;
const waffenStufe2 = __require("content/packs/waffen_stufe2.js").default;
const helden2 = __require("content/packs/helden2.js").default;
const story = __require("content/packs/story.js").default;
const heldenItems = __require("content/packs/helden_items.js").default;
const abilityPack = __require("content/packs/abilities.js").default;
const statItems = __require("content/packs/stat_items.js").default;
const thema = __require("content/packs/thema_anime.js").default;

const CONTENT = createContent();
[core, ausruestung, feuer, gift, blut, frost, wildnis, boss, events, fernkaempfer, magier, story, achievements, aktiv, bollwerk, pyro, aristokratGaertner, waffenStufe2, helden2, heldenItems, statItems, abilityPack].forEach((pack) => CONTENT.register(pack));

CONTENT.finalize();
for (const [id, patch] of Object.entries(statItems.adapt)) { const d = CONTENT.items[id]; if (d) { d.stats = { ...d.stats, ...patch.stats }; if (patch.passives) d.passives = patch.passives; if (patch.text) d.text = patch.text; if (patch.maxStack) d.maxStack = patch.maxStack; } }     // bestehende Items auf die Werte umbauen
for (const kind of ["classes", "enemies", "encounters", "achievements", "cards", "items", "speakers"]) for (const [id, patch] of Object.entries(thema[kind] ?? {})) if (CONTENT[kind]?.[id]) Object.assign(CONTENT[kind][id], patch);       // Thema: Anzeigenamen
for (const [id, lines] of Object.entries(thema.stories)) if (CONTENT.stories[id]) CONTENT.stories[id].lines = lines;                                  // Thema: Geschichte
const problems = CONTENT.validate();
if (problems.length) throw new Error("Content-Fehler:\n- " + problems.join("\n- "));

__exports.CONTENT = CONTENT;

});
__define("engine/rng.js", function (__exports, __require) {
// Zufall mit Seed: gleicher Seed = gleicher Run (wichtig für Tests und "Daily Seeds").
const { CONFIG } = __require("data/config.js");

function createRng(seed = Date.now()) {
  let s = seed >>> 0;
  const next = () => { // mulberry32
    s = (s + 0x6D2B79F5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return {
    next,
    state: () => s,                       // für Savegames: createRng(state) setzt den Strom fort
    pick: (arr) => arr[Math.floor(next() * arr.length)],
    shuffle: (arr) => {
      const a = [...arr];
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(next() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    },
    // entries: [{ value, weight }]
    weighted: (entries) => {
      const total = entries.reduce((sum, e) => sum + e.weight, 0);
      let r = next() * total;
      for (const e of entries) { r -= e.weight; if (r < 0) return e.value; }
      return entries[entries.length - 1].value;
    },
  };
}

// Würfelt eine Seltenheit anhand der Gewichte aus der Config.
function rollRarity(rng, table = CONFIG.rarities) {
  return rng.weighted(Object.entries(table).map(([value, { weight }]) => ({ value, weight })));
}

__exports.createRng = createRng;
__exports.rollRarity = rollRarity;

});
__define("engine/draft.js", function (__exports, __require) {
// STARTDECK-DRAFT: Nach der Heldenwahl stellt man das Startdeck in mehreren Zügen zusammen. Bei jedem Zug werden zufällig
// CONFIG.draft.options Karten angeboten (nur einfache Karten aus dem Pool des Helden, eigene Karten häufiger), man nimmt eine.
// Das Angebot hängt nur vom Seed, vom Helden und von den bisherigen Wahlen ab (gleicher Seed = gleiche Angebote).
// Sicherung: Zug 1 enthält immer eine Angriffskarte; hat man bis zum letzten Zug keine genommen, sind alle Angebote Angriffskarten.
const { CONTENT } = __require("content/index.js");
const { CONFIG } = __require("data/config.js");
const { createRng } = __require("engine/rng.js");

const isAttackCard = (def) => def.play.some((a) => String(a.action).startsWith("damage"));

function starterPool(classId) {
  const cls = CONTENT.classes[classId], pools = cls.cardPools ?? [classId];
  return Object.values(CONTENT.cards).filter((c) => (c.rarity ?? "gewoehnlich") === "gewoehnlich" && (c.pools.includes("alle") || c.pools.some((p) => pools.includes(p))));
}

function draftOffer(classId, seed, picks = []) {
  const D = CONFIG.draft, pool = starterPool(classId), round = picks.length, rng = createRng(((seed >>> 0) ^ Math.imul(round + 1, 0x9e3779b1)) >>> 0);
  const hasAtk = picks.some((id) => isAttackCard(CONTENT.cards[id])), lastForced = round === D.rounds - 1 && !hasAtk;       // letzter Zug ohne Angriffskarte im Deck: nur Angriffskarten zur Wahl
  const own = (c) => !c.pools.includes("alle"), left = lastForced ? pool.filter(isAttackCard) : [...pool], offer = [];
  while (offer.length < D.options && left.length) {                                         // gewichtet ohne Wiederholung innerhalb eines Zuges
    const w = left.map((c) => (own(c) ? D.ownWeight : 1)), sum = w.reduce((a, b) => a + b, 0);
    let r = rng.next() * sum, i = 0; while (i < left.length - 1 && r > w[i]) { r -= w[i]; i++; }
    offer.push(left.splice(i, 1)[0]);
  }
  if (round === 0 && !offer.some(isAttackCard)) {                                               // Sicherung: mindestens eine Angriffskarte im Angebot
    const atk = pool.filter((c) => isAttackCard(c) && !offer.includes(c));
    if (atk.length) offer[offer.length - 1] = atk[Math.floor(rng.next() * atk.length)];
  }
  return offer.map((c) => c.id);
}

function validStartDeck(ids, classId) {
  const pool = new Set(starterPool(classId).map((c) => c.id));
  return Array.isArray(ids) && ids.length === CONFIG.draft.rounds && ids.every((id) => pool.has(id)) && ids.some((id) => isAttackCard(CONTENT.cards[id]));
}

__exports.isAttackCard = isAttackCard;
__exports.starterPool = starterPool;
__exports.draftOffer = draftOffer;
__exports.validStartDeck = validStartDeck;

});
__define("engine/abilities.js", function (__exports, __require) {
// Signatur-Fähigkeiten: Daten auf eine Stufe auflösen. Stufe 1 = Grundwerte, Stufe 2 = levels[0] überschreibt (nur über Meta-Meilensteine).
const { CONTENT } = __require("content/index.js");
function abilityAt(id, level = 1) {
  const base = CONTENT.abilities[id];
  if (!base) return null;
  let def = { ...base };
  for (let i = 0; i < Math.min(level - 1, base.levels.length); i++) def = { ...def, ...base.levels[i] };
  return def;
}
const maxAbilityLevel = (id) => 1 + (CONTENT.abilities[id]?.levels.length ?? 0);

__exports.abilityAt = abilityAt;
__exports.maxAbilityLevel = maxAbilityLevel;

});
__define("ui/en_cards_items.js", function (__exports, __require) {
// Englische Texte: Karten und Items. Format: id: [Name, Text].
const EN_CARDS = {
  hieb: ["Direct Hit", "Damage: 4 + weapon."], wuchtschlag: ["Serious Punch", "Damage: 11 + 3x weapon."], wirbel: ["Storm Whirl", "Damage to ALL: 3 + weapon."],
  deckung: ["Guard Stance", "6 Block."], schildwall: ["Unbreakable Wall", "13 Block."], adrenalin: ["Second Gear", "Draw 2 cards."], schwachstelle: ["Line of Death", "2 Vulnerable (+50% damage)."],
  wasserstrahl: ["Hydro Lance", "Water damage: 10 + 2x weapon."], flutwelle: ["Tsunami Strike", "Water damage to ALL: 4 + 0.5x weapon."], dornenpeitsche: ["Rose Whip", "Plant damage: 3 + 0.5x weapon. 3 Bleed."],
  flammenhieb: ["Flame Breathing", "Fire damage: 4 + weapon."], feuerball: ["Fireball Jutsu", "Fire damage to ALL: 5 + 0.5x weapon."], inferno: ["Black Flame", "Fire damage to ALL: 9 + weapon."],
  phoenixschlag: ["Phoenix Fall", "Fire damage: 14 + 2x weapon. Draw 1 card."], giftklinge: ["Viper Bite", "Damage: 3 + 0.5x weapon. 4 Poison."], giftwolke: ["Toxic Haze", "3 Poison to ALL."],
  pandemie: ["Outbreak", "Double the Poison on ALL enemies."], aufschlitzen: ["Predator's Claw", "Damage: 3 + 0.5x weapon. 4 Bleed."], blutrausch: ["Berserker Rage", "Damage: 6 + 1.5x weapon, +2 per Bleed on the target."],
  eissplitter: ["Frozen Shard", "Ice damage: 8 + 1.5x weapon. 1 Vulnerable, 1 Chill."], frostnova: ["Crystal World", "Ice damage to ALL: 3 + 0.5x weapon. 1 Vulnerable and 1 Chill to ALL."],
  eiszeit: ["Absolute Zero", "Ice damage to ALL: 4 + weapon. 1 Vulnerable and 2 Chill to ALL."], schnellschuss: ["Quick Draw", "Damage: 3 + weapon, +1 per card played earlier this turn."],
  zielen: ["Eagle Focus", "Mark the target (3 turns): hits deal +1 damage."], rolle: ["Flash Step", "Dodge 1 hit. 4 Block."], praezisionsschuss: ["Pinpoint Hit", "Damage: 6 + 1.5x weapon, +3 per Mark on the target."],
  giftpfeil: ["Venom Arrow", "Damage: 4 + 1.5x weapon. 6 Poison."], brandpfeil: ["Blazing Arrow", "Fire damage: 8 + 2x weapon."], eispfeil: ["Frost Point", "Ice damage: 6 + 1.5x weapon. 1 Vulnerable, 1 Chill."],
  nachladen: ["Quick Reload", "Draw 2 cards."], salve: ["Triple Volley", "3 hits: 2 + 0.5x weapon each."], pfeilhagel: ["Arrow Rain", "2 hits on ALL: 2 + 0.5x weapon each."],
  fluchtschuss: ["Parting Shot", "Damage: 6 + 1.5x weapon. Draw 1 card. Dodge 2 hits."], scharfschuetze: ["Kill Shot", "Damage: 12 + 2x weapon, +4 per Mark on the target."],
  dauerfeuer: ["Rapid Barrage", "6 hits: 1 + 0.5x weapon each, +1 per card played earlier."], pfeilsturm: ["Sky of Arrows", "4 hits on ALL: 2 + 0.5x weapon each."],
  funke: ["Spark", "Fire damage: 5 + 0.5x weapon."], tropfen: ["Water Bead", "Water damage: 4 + 0.5x weapon. 2 Block."], ranke: ["Choking Sprout", "Plant damage: 3 + 0.5x weapon. 2 Bleed."],
  frostnadel: ["Ice Needle", "Ice damage: 8 + weapon. 2 Chill."], manaschild: ["Mana Barrier", "5 Block."], arkanblitz: ["Pure Mana Beam", "Damage: 11 + 1.5x weapon (no element)."],
  gedankenblitz: ["Sudden Insight", "Draw 1 card."], flammenwelle: ["Fire Surge", "Fire damage to ALL: 5 + 0.5x weapon."], dornenwall: ["Thorn Hedge", "Plant: 8 Block. 3 Bleed to ALL."],
  eisregen: ["Hailstorm", "Ice damage to ALL: 4 + 0.5x weapon. 1 Chill to ALL."], meteor: ["Starfall", "Fire damage: 16 + 2x weapon."], arkaner_sturm: ["Mana Storm", "Damage to ALL: 4 + weapon. 1 Vulnerable to ALL."],
  prismasturm: ["Elemental Wrath", "3 + 0.5x weapon damage each to ALL in Fire, Water, Plant and Ice."], schildstoss: ["Bulwark Bash", "Damage equal to your Block (max. 12). The Block stays."],
  dornenpanzer: ["Spiked Armor", "8 Block. Thorns 2: attackers take 2 damage until your next turn."], eiserner_wille: ["Unbreakable Will", "5 Block. Heal 2 HP."], bollwerk: ["Titan Wall", "12 Block. Draw 1 card."],
  festungsbau: ["Citadel", "16 Block. Thorns 4: attackers take 4 damage until your next turn."], blutopfer: ["Equivalent Exchange", "Lose 5 HP (never below 1). +1 Energy."],
  blutdurst: ["Thirsting Blade", "Damage: 4 + weapon. If the target bleeds: heal 3 HP."], zerfleischen: ["Merciless Rend", "Damage: 4 + weapon, +4 per Bleed on the target."],
  aderlass: ["Blood Summoning", "Take 4 damage (never below 1 HP). Draw 2 cards, gain 1 Energy."], lodernder_schmerz: ["Burning Agony", "Fire damage equal to your missing HP (max. 40)."],
  feuersturm: ["Hellfire Storm", "12 fire damage to one enemy. If you lost HP this turn: hits ALL enemies and gives each 2 Burn."],
  taschendiebstahl: ["Skill Steal", "2 damage. If this card kills the enemy: gain 40 Gold at once."], bestechung: ["Hush Money", "One enemy skips this turn. You pay 15% of your Gold at once. Bosses can't be bribed."],
  photosynthese: ["Sun Bath", "Heal 8 HP. Max HP +1 until the end of the run. Exhaust."], sporenwolke: ["Spore Veil", "5 Block. If you were already healed this turn (or tried to heal): 15 Block instead."],
  blutsauger_ranke: ["Vampire Vine", "6 damage. Heal yourself for the damage dealt."], selbstentzuendung: ["Inner Fire", "Take 4 damage (never below 1 HP). All enemies get 4 Burn."],
  flammenmantel: ["Ember Cloak", "10 Block. If you lost HP this turn: Thorns 5 (attackers take 5 damage until your next turn)."], schuldschein: ["Blank Check", "Gain 20 Gold. Draw 1 card."],
  dekadenz: ["Golden Excess", "12 damage to ALL enemies. You pay 10% of your Gold."], rankendornen: ["Entwined Thorns", "4 Block. Thorns 3 (attackers take 3 damage until your next turn)."], wurzelgeflecht: ["Life Roots", "8 Block. Heal 4 HP."],
};
const EN_ITEMS = {
  quellstein: ["Ocean Shard", "Water cards: +2 damage."], gezeitenperle: ["Moontide Pearl", "Water card played: 3 Block (max. 4/turn)."], treibholz: ["Shipwreck Splinter", "First turn of every combat: 2 Block per Water tag (max. 8)."],
  dornenring: ["Rose Ring", "Plant cards: +2 damage."], sporenbeutel: ["Mycelium Pouch", "Plant card played: 1 Poison on an enemy (max. 3/turn)."], wurzelherz: ["Seed of Life", "Start of turn: heal 1 HP per Plant tag (max. 2)."],
  eisenpanzer: ["Blacksteel Vest", "First turn of every combat: 4 Block."], vielfaltsmedaille: ["S-Rank Badge", "All cards: +1 damage per different type in your build (max. +3)."],
  kleeblatt: ["Five-Leaf Clover", "+2 Luck (better rarities in rewards)."], glueckswuerfel: ["Gambler's Dice", "+4 Luck (better rarities in rewards)."], prismalinse: ["Truth Lens", "Elemental resistances are ignored."],
  jaegerauge: ["Scarlet Eyes", "Elemental weaknesses hit harder (x1.5 becomes x1.75)."], lederweste: ["Hunter's Vest", "+8 Max HP."], eisenhelm: ["Gate Raid Helmet", "First turn of every combat: 6 Block."],
  muenzbeutel: ["Guild Allowance", "+15% Gold."], feldflasche: ["Konbini Tea", "Heal 5 HP after every combat."], hasenpfote: ["Lucky Cat", "+1 Luck, +10% Gold."], wetzstein: ["Swordsmith Stone", "Melee cards: +1 damage."],
  notfallration: ["Onigiri Ration", "Heal 5 HP at the start of combat."], rucksack: ["Inventory Pouch", "+1 card in hand."], ledergurt: ["Tool Belt", "+4 Max HP. First turn of every combat: 3 Block."],
  dornenruestung: ["Spiked Exoskeleton", "Whoever hits you takes 3 damage."], kampfhorn: ["Gate Siren", "Start of combat: all enemies 1 Vulnerable."], adrenalinpumpe: ["Emergency Injector", "Enemy defeated: draw 1 card (max. 2/turn)."],
  beutegier: ["Predator Instinct", "Enemy defeated: heal 2 HP (max. 3/turn)."], kriegstrommel: ["War Taiko", "Start of turn: 25% chance for +1 Energy."], echostein: ["Hanafuda Earrings", "Card played: 15% chance to draw 1 card (max. 2/turn)."],
  meisterhammer: ["Smith King's Hammer", "Melee cards: +20% damage."], taschenuhr: ["Time-Stop Watch", "Start of turn: 30% chance to draw 1 card."], energiekristall: ["Unstable Mana Core", "+1 Energy per turn, but 1 fewer card in hand and -8 Max HP."],
  blutpakt: ["Geass Contract", "+1 Energy, -20 Max HP."], glaskanone: ["Fragile Power", "+40% damage, -15 Max HP."], goldene_waage: ["Merchant's Gold Scale", "+40% Gold."], kartenhaus: ["Joker Card Deck", "+2 cards in hand, -8 Max HP."],
  schillernder_charme: ["Chromatic Amulet", "Doubles your Shiny chance (second charm: triples it)."], phoenixfeder: ["Blue Phoenix", "+10 Max HP, heal 12 HP after every combat."],
  funkenfeuerzeug: ["Pyromaniac's Lighter", "Fire card played: 30% chance for 3 damage to an enemy."], lavaruestung: ["Magma Plate", "When you are hit: 2 damage to ALL (max. 2/turn)."],
  glutschale: ["Brazier", "First turn of every combat: 2 Block per Fire tag (max. 8)."], aschemantel: ["Ashen Mantle", "From 4 Fire tags: Fire cards +3 damage."], glutstein: ["Ember Crystal", "Fire cards: +2 damage."],
  schmiedeherz: ["Heart of the Forge", "Fire cards: +1 damage per Fire tag (max. +4)."], flammenkrone: ["Flame King's Crown", "From 6 Fire tags: Fire cards +25% damage."], giftzahn: ["Hydra Fang", "Poison cards: +2 damage."],
  schierlingsflasche: ["Apothecary Vial", "Start of turn: 2 Poison on a random enemy."], miasmaflasche: ["Miasma Jar", "Poison applied: 30% chance for 2 damage (max. 4/turn)."],
  leichengift: ["Decay Essence", "Enemy defeated: 2 Poison on ALL others (max. 3/turn)."], apothekerwaage: ["Alchemist's Mortar", "From 4 Poison tags: ALL cards +20% damage."],
  seuchenkoenig: ["Plague King", "Poison applied: 1 Poison on ALL enemies (max. 2/turn)."], giftring: ["Scorpion Ring", "Poison card played: 1 Poison on a random enemy (max. 2/turn)."],
  seuchenbeutel: ["Plague Talisman", "Poison applied: target becomes 1 Vulnerable (max. 2/turn)."], blutegel: ["Parasite", "Bleed applied: heal 1 HP (max. 3/turn)."], rasiermesser: ["Death Razor", "Blood cards: +2 damage."],
  vampirzahn: ["Nosferatu Fang", "Enemy defeated: heal 4 HP (max. 2/turn)."], dornenkrone: ["Crown of Suffering", "Whoever hits you bleeds (3 Bleed, max. 3/turn)."], blutmond: ["Crimson Full Moon", "From 4 Blood tags: Blood cards +25% damage."],
  opferdolch: ["Ritual Tanto", "Start of turn: -2 HP. All cards +4 damage."], blutkelch: ["Bloodnight Chalice", "Bleed applied: 2 damage (max. 4/turn)."], raureif: ["Ice Breath", "First turn of every combat: 2 Block per Ice tag (max. 8)."],
  eiszapfen: ["Ice Lance", "Ice card played: 2 damage (max. 4/turn)."], schneekugel: ["Winter Globe", "End of turn: 50% chance to give all enemies 1 Chill."],
  kaelteamulett: ["Snow Woman Amulet", "Enemies freeze at just 2 Chill. From 4 Ice tags: Ice cards +25% damage."], herz_des_winters: ["Ice Monarch Heart", "Start of combat: all enemies 2 Chill and 2 Vulnerable. Ice cards +3 damage."],
  eiskristall: ["Frozen Tear", "Ice cards: +2 damage."], frostherz: ["Cold Heart", "Ice card played: 1 Chill on an enemy (max. 2/turn)."], koecher: ["Reishi Quiver", "Ranged cards: +1 damage."],
  munitionsgurt: ["Bandolier", "Start of turn: 35% chance to draw 1 card."], adlerauge: ["Falcon's Gaze", "Start of combat: all enemies marked for 2 turns."], leichtfuessig: ["Cloud Step", "First turn of every combat: dodge 2 hits."],
  jagdzeichen: ["Hunter License", "Ranged card played: 30% chance to mark an enemy."], zielfernrohr: ["Sniper Visor", "From 6 Ranged tags: Ranged cards +25% damage."], grimoire: ["Guild Grimoire", "Spell cards: +1 damage."],
  funkenschlag: ["Static Pulse", "Reaction: 2 damage to ALL (max. 3/turn)."], gedankenstein: ["Telepathy Stone", "Reaction: draw 1 card (max. 2/turn)."], resonanzkristall: ["Resonance Core", "Reactions are 50% stronger."],
  manaquelle: ["Well of Magic", "Reaction: +1 Energy (once per turn)."], elementarlinse: ["Elemental Prism", "Reactions +30%. Reaction: 3 Block (max. 2/turn). For all classes!"],
  feuerflasche: ["Firebomb Flask", "Active (1 Energy, once per combat): 6 fire damage to ALL."], heiltrank: ["Senzu Bean", "Active (1 Energy, once per combat): heal 12 HP."],
  rauchbombe: ["Ninja Smoke Bomb", "Active (1 Energy, once per combat): dodge 3 hits. 4 Block."], giftphiole: ["Toxin Ampoule", "Active (1 Energy, once per combat): 6 Poison on ALL enemies."],
  frostphiole: ["Cold Capsule", "Active (1 Energy, once per combat): 4 ice damage and 2 Vulnerable to ALL."], blutampulle: ["Berserker Ampoule", "Active (1 Energy, once per combat): 10 damage and 5 Bleed on one target."],
  schlachtrufrolle: ["War Scroll", "Active (1 Energy, once per combat): all enemies marked for 3 turns and 1 Vulnerable."],
  prismasplitter: ["Rainbow Shard", "Active (2 Energy, once per combat): 4 damage each to ALL in Fire, Water, Plant and Ice."], phoenixasche: ["Rebirth Ash", "Active (2 Energy, once per combat): heal 20 HP, 10 Block and +1 Energy."],
  narbenleder: ["Scarred Hide", "Bleed applied: 2 Block (max. 3x/turn)."], stachelschild: ["Spiked Buckler", "Start of turn: Thorns 1 (attackers take 1 damage)."], eisenfaust: ["Steel Knuckles", "Block cards: +3 damage."],
  pech_raeucherstaebchen: ["Cursed Incense", "Fire cards: +3 damage. End of turn: you take 1 damage."], asche_lunge: ["Ashen Lungs", "When you lose HP: all foes get 3 Burn. Healing on you is reduced by 50%."],
  krone_des_maertyrers: ["Martyr's Halo", "Damage x0.1 per 5 HP you are missing from your maximum (cap x3). -10 Max HP."], erntesichel: ["Reaper's Sickle", "Harvest 2: +2 Gold after every combat."],
  vorratskammer: ["Konbini Stockroom", "Harvest 4: +4 Gold after every combat."], boerse_des_geizkragens: ["Miser's Wallet", "All cards: +1 base damage per 50 Gold you own (max. +15)."],
  midas_fluch: ["Golden Touch", "Doubles all Gold you receive (loot, overkill, harvest, card gold). Item locking in the shop is permanently disabled."],
  nekromanten_pakt: ["Skeleton King's Pact", "All healing becomes 0. Instead, a random enemy takes double the amount as damage (outside combat it fizzles)."], wuchernde_wurzeln: ["Living Forest", "End of turn: heal 1 HP per card in hand. Hand size -2."],
  ritterschwur: ["Hunter's Oath", "Block card played: 2 damage to an enemy (max. 4/turn)."], eisenwall: ["Wall Fragment", "From 4 Block tags: ALL cards +20% damage."], siegerhelm: ["Trophy Helm", "Enemy defeated: 4 Block and 2 HP (max. 2/turn)."],
  sperrfeuer: ["Suppression Module", "Ranged card played: 1 damage to ALL (max. 4/turn)."], windlaeufer: ["Windrunner Boots", "First turn of every combat: dodge 1 hit. Ranged cards: +1 damage."],
  meisterschuetze: ["Marksman Order", "Start of combat: all enemies marked for 2 turns. From 5 Ranged tags: Ranged cards +30% damage."],
  arkane_feder: ["Grimoire Quill", "Spell cards: +2 damage. Spell card played: 15% chance for +1 Energy (max. 1/turn)."], elementarkompass: ["Mana Compass", "Start of combat: draw 2 cards. Reaction: draw 1 card (max. 1/turn)."],
  prismakrone: ["Archmage Diadem", "Reactions +50%. Reaction: heal 2 HP (max. 2/turn)."], glutherz: ["Pyro Core", "You are hit: all enemies 2 Burn (max. 2/turn)."], schmerzkelch: ["Chalice of Agony", "Start of turn: -2 HP. Fire cards +4 damage."],
  phoenixblut: ["Immortal Blood", "Start of combat: heal 8 HP. Fire card played: 1 Burn on ALL (max. 2/turn)."], goldener_zahn: ["Gold-Tooth Grin", "+20% Gold, Harvest 1."],
  bankier: ["Black Credit Card", "All cards: +1 base damage per 40 Gold you own (max. +12)."], kronjuwelen: ["House Jewels", "+50% Gold, Harvest 3."], gruener_daumen: ["Nature's Hand", "Plant cards: +2 damage. Heal 3 HP after every combat."],
  erntekorb: ["Basket of Plenty", "Plant card played: heal 1 HP (max. 3/turn)."], weltenbaum: ["Yggdrasil Branch", "+10 Max HP. Start of turn: heal 1 HP per Plant tag (max. 3)."],
  kraftring: ["Strength Band", "+4% Damage."], kriegsbemalung: ["War Tattoo", "+8% Damage, -1 Armor."], gewichtsweste: ["Training Weights", "+3 Armor, -5% Dodge."], federstiefel: ["Sprint Sneakers", "+10% Dodge, -1 Armor."],
  wuchtgurt: ["Champion Belt", "+3 Melee Damage, -3% Dodge."], heilkraut: ["Herb Bundle", "+2 Regeneration, +2 Max HP."], stahlhaut: ["Iron Body Technique", "+2 Armor, +6 Max HP."], sparbuch: ["Budget Ledger", "+2 Harvest, -2% Damage."],
  scharfes_auge: ["Targeting Monocle", "+8% Crit Chance, +1 Ranged Damage."], elementarfokus: ["Focus Crystal", "+3 Elemental Damage, -1 Armor."], blutdurstamulett: ["Bloodthirst Pendant", "+5% Lifesteal, -6 Max HP."], glueckskeks: ["Omikuji Slip", "+3 Luck, +1 Harvest."],
  kampfnarben: ["Veteran Scars", "+6% Crit Chance, +3% Damage."], schattenmantel: ["Shadow Monarch Cloak", "+8% Dodge, +4% Crit Chance."], panzerfaust: ["Titan Fist", "All cards: +1 damage per 3 Armor (max. +6)."], glueckspilz: ["Toadstool Talisman", "All cards: +1 damage per 3 Luck (max. +6)."],
  schattenklinge: ["Shadow Kunai", "All cards: +1 damage per 4% Dodge (max. +6)."], rotes_siegel: ["Crimson Seal", "+10% Damage, +4% Lifesteal, -10 Max HP."], koenigsring: ["Royal Signet Ring", "+4 Luck, +2 Harvest, +5% Damage, -1 Armor."],
  wetzstein: ["Whetstone", "+2 Melee Damage."], koecher: ["Quiver", "+2 Ranged Damage."], grimoire: ["Grimoire", "+2 Elemental Damage."], lederweste: ["Leather Vest", "+8 Max HP, +1 Armor."], eisenpanzer: ["Iron Armor", "+2 Armor. First turn of every combat: 4 Block."],
  eisenhelm: ["Iron Helmet", "+1 Armor. First turn of every combat: 6 Block."], vampirzahn: ["Vampire Fang", "+3% Lifesteal. Enemy defeated: heal 4 HP (max. 2/turn)."], leichtfuessig: ["Light-Footed", "+6% Dodge. First turn of every combat: dodge 2 hits."],
  adlerauge: ["Eagle Eye", "+6% Crit Chance. Start of combat: all enemies marked for 2 turns."], dornenruestung: ["Spiked Mail", "+1 Armor. Whoever hits you takes 3 damage."],
  gutschein: ["Guild Coupon", "-10% shop prices."], handelsabkommen: ["Merchant Accord", "-20% shop prices, +1 Harvest."], wuerfelbecher: ["Gacha Capsule", "1 free reroll per shop, reroll price -50%."], gluecksrad: ["Wheel of Fate", "2 free rerolls per shop, +2 Luck."],
  drachentoeter: ["Dragonslayer", "+25% damage vs bosses, guardians and elites."], henkersbeil: ["Executioner's Guillotine", "+50% damage vs bosses, guardians and elites, -1 Armor."], schlangengift: ["Serpent Toxin", "Poison ticks for +1 more damage."], gluthoel: ["Burning Oil", "Burn ticks for +1 more damage."],
  dornenwein: ["Crimson Wine", "Bleed ticks for +1 more damage."], kraeutertee: ["Calming Tea", "+25% healing."], lebensquell: ["Fountain of Youth", "+50% healing, +1 Regeneration."], goldwaescher: ["Prospector's Pan", "15% chance that a combat's Gold reward is doubled."],
  gluecksmuenze: ["Five-Yen Coin", "10% Double Gold chance, +1 Luck."], verfluchter_dolch: ["Muramasa Dagger", "+15 Curse (stronger enemies, more Gold and better loot), +14% Damage."], fluchsiegel: ["Curse Ofuda", "+8 Curse, +2 Luck, +1 Harvest."], daemonenpakt: ["Demon Lord Pact", "+25 Curse, +20% Damage, +2 Armor."],
  herz_der_vollendung: ["Core of Completion", "The reward for 100%: +10% Damage, +2 Armor, +3 Luck, +2 Regeneration, +6% Crit, +15 Max HP, +2 Harvest."],
};

__exports.EN_CARDS = EN_CARDS;
__exports.EN_ITEMS = EN_ITEMS;

});
__define("ui/en_world.js", function (__exports, __require) {
// Englische Texte: Waffen, Gegner, Begegnungen, Helden, Farbvarianten, Rahmen, Ereignisse, Erfolge, Geschichte.
const EN_WEAPONS = { rostiges_schwert: "Rusty Sword", flammenschwert: "Flame Sword", giftdolch: "Poison Dagger", frostklinge: "Frost Blade", kurzbogen: "Shortbow", armbrust: "Crossbow", giftbogen: "Poison Bow", jagdbogen: "Hunting Bow", zauberstab: "Magic Wand", flammenstab: "Flame Staff", runenstab: "Rune Staff", kristallstab: "Crystal Staff", stahlschwert: "Steel Sword", glutschwert: "Ember Sword", natterndolch: "Viper Dagger", langbogen: "Longbow", brandbogen: "Fire Bow", wundbogen: "Wound Bow", arkanstab: "Arcane Staff", glutzepter: "Ember Scepter", frostzepter: "Frost Scepter", pechfackel: "Pitch Torch", stockdegen: "Cane Sword", rankenstab: "Vine Staff" };
const EN_ENEMIES = { ratte: "Gate Rat", goblin: "Goblin", skelett: "Bone Soldier", bandit: "Syndicate Thug", steingolem: "Concrete Golem", knochenhauptmann: "Bone Marshal", glutgeist: "Cursed Flame", frostwolf: "Frost Wolf", dornenranke: "Devouring Vine", flussgeist: "Canal Spirit", sumpfgeist: "Smog Spirit", funke: "Spark", elementarwandler: "Gate Lord" };
const EN_ENCOUNTERS = { kellerratten: "Gate Rats (first fight)", rattenschwarm: "Rat Swarm (big wave, weak enemies)", wachposten: "Syndicate Post (mixed)", steinwaechter: "Concrete Guardian (one tanky enemy)", banditenbande: "Syndicate Gang (5 mini-bosses)", knochenhauptmann: "Bone Marshal (mini-boss alone)", gluthoehle: "Burn Zone (cursed flames)", frostmeute: "Frost Pack (wolf pack)", eliterudel: "Ice Pack (elite)", pflanzenhain: "Overgrown Garden (vines + smog spirit)", sumpfwacht: "Smog Watch (elite)", flussufer: "Canal Bank (water spirits)", boss_wandler: "Gate Lord (final boss)" };
const EN_SKINS = { rotgardist: "Red Guard", nachtwache: "Night Watch", herbstlaeufer: "Autumn Runner", schneejaeger: "Snow Hunter", feuerrobe: "Fire Robe", mondrobe: "Moon Robe" };
const EN_FRAMES = { bronze: "Bronze", eisen: "Iron", efeu: "Ivy", frost: "Frost", gold: "Gold", flamme: "Flame", prisma: "Prism", blut: "Blood", chrom: "Chrome" };
const EN_CLASSES = {
  nahkaempfer: { name: "Hunter", blurb: "Sturdy and straightforward: Block, weapon power and Bleed. Forgives mistakes.", perks: ["+ Lots of life: 90 Max HP", "+ Unyielding: 25% of Block becomes damage (max. 2)", "+ Armor 1, Melee Damage +2", "- No ranged or spell bonus"], passive: { name: "Unyielding", text: "At the end of your turn, 25% of your remaining Block is dealt as damage to the first enemy (at most 2)." } },
  fernkaempfer: { name: "Scout", blurb: "Fast and fragile: the more cards you play, the stronger each hit. Marking, multi-hits, dodging.", perks: ["+ One more card in hand (6)", "+ Multi-hits and Marking", "+ Dodge 6%, Crit 6%, Ranged Damage +2", "- Less life: 84 Max HP"] },
  magier: { name: "Sorcerer", blurb: "Mixing is rewarded: two different elements in a row trigger Reactions. Low HP, lots of combos.", perks: ["+ Reactions: 2 elements in a row = bonus effect", "+ Elemental Damage +3, Crit 8%", "- Low life: 70 Max HP"] },
  pyromant: { name: "Pyromancer", blurb: "Plays with pain: every loss of HP sets enemies on fire, and the more he is missing, the harder he hits. In return he has little life.", perks: ["+ Pain Glow: losing HP = 1 Burn on all", "+ Burning Pain in the starting deck", "- Pitch Torch hurts you every turn", "+ Elemental Damage +3, Crit 5%", "- Only 80 Max HP"], passive: { name: "Pain Glow", text: "When you lose HP, all enemies get 1 Burn (at most 2x per turn)." } },
  aristokrat: { name: "Noble", blurb: "Gold is power: more loot, cheaper merchants and fixed income. In return he fights poorly and hardly recovers at rests.", perks: ["+ 30% Gold, Harvest 2, 40 starting Gold", "+ Patron: merchant prices -10%", "- Weak starting deck and weak weapon", "+ Luck 3, Armor 1", "- Rest heals only 20%"], passive: { name: "Patron", text: "Patron: merchant prices -10%." } },
  gaertnerin: { name: "Herbalist", blurb: "Patient: plant cards and healing, she recovers after every combat. In return she has little life and a small hand.", perks: ["+ +3 HP after every combat", "+ Rootwork: plant cards +1 damage", "- Only 4 cards in hand", "+ Lifesteal 4%, Dodge 8%", "- Only 64 Max HP"], passive: { name: "Rootwork", text: "Plant cards deal +1 damage." } },
};
const EN_EVENTS = {
  gluecksspieler: { name: "The Gambler", text: "A man with three cups challenges you.", choices: ["Bet 40 Gold (50%: 120 Gold)", "Walk on"] },
  altar: { name: "Abandoned Altar", text: "A blood-stained altar. It seems to demand something.", choices: ["Sacrifice blood (-10 HP): random item (at least uncommon)", "Pray: heal 12 HP", "Ignore"] },
  haendler_mo: { name: "Wandering Merchant Mo", text: "Mo offers to 'declutter' your deck.", choices: ["Remove a random card (40 Gold)", "No thanks"] },
  quelle: { name: "Holy Spring", text: "Clear water bubbles from the rock.", choices: ["Drink (60%: +20 HP, 40%: -8 HP)", "Just fill a flask: +3 Max HP"] },
  hinterhalt: { name: "Ambush!", text: "Shadows detach from the walls.", choices: ["Fight (normal combat with reward)", "Flee (-15 Gold)"] },
  truhe: { name: "Suspicious Chest", text: "A chest stands in the middle of the corridor. Too much in the middle.", choices: ["Open (60%: item, 40%: trap -10 HP, +30 Gold)", "Leave it"] },
  kleeblattfeld: { name: "Clover Field", text: "A field full of clovers. One has four leaves.", choices: ["Pick the four-leaf one", "Rest: heal 8 HP"] },
  alchemistin: { name: "The Alchemist", text: "She swirls a steaming potion.", choices: ["Drink potion (-6 HP): +6 Max HP", "Swap a random card: 30 Gold", "Decline"] },
};
const EN_ACH = {
  g10: ["First Loot", "Defeat 10 enemies."], g50: ["Exterminator", "Defeat 50 enemies."], g100: ["Hundred-Strong", "Defeat 100 enemies."], g250: ["Terror of the Depths", "Defeat 250 enemies."], g500: ["Legend of the Gates", "Defeat 500 enemies."], g1000: ["Thousand Foes", "Defeat 1000 enemies."],
  gtypen: ["Bestiary", "Defeat every enemy type at least once."], k25: ["Battle-Tested", "Win 25 combats."], k100: ["Frontliner", "Win 100 combats."], kelite: ["Elite Hunter", "Win 10 elite encounters."], kmini: ["Boss Breaker", "Defeat 10 mini-bosses."],
  s10: ["Curious", "Find 10 different items."], s25: ["Collector", "Find 25 different items."], s50: ["Hoarder", "Find 50 different items."], salle: ["Treasurer", "Find all items."], c25: ["Card Friend", "Find 25 different cards."], calle: ["Card Master", "Find all cards."],
  w6: ["Weapon Collector", "Find 6 different weapons."], walle: ["Arsenal", "Find all weapons."], ralle: ["Alchemist", "Trigger all elemental reactions."], r1: ["Departure", "Finish your first run."], r10: ["Regular", "Finish 10 runs."], r50: ["Frequent Guest", "Finish 50 runs."],
  w1: ["The Gate Lord Falls", "Win your first run."], w5: ["Serial Hero", "Win 5 runs."], w25: ["Gate Legend", "Win 25 runs."], wklassen: ["All Paths", "Win a run with every hero."], wwaffen: ["Weapon Master", "Win with every starting weapon."],
  whart: ["Stress Test", "Win a run on Hard."], walb: ["Nightmare Conquered", "Win a run on Nightmare."],
  s20: ["Treasure Seeker", "Unlock 20 different items in the collection."], s30: ["Loot Hunter", "Unlock 30 different items in the collection."], s75: ["Curator", "Unlock 75 different items in the collection."], s100: ["Archivist", "Unlock 100 different items in the collection."],
  w12: ["Weapon Master", "Unlock 12 different weapons in the collection."], w18: ["Weapon Vault", "Unlock 18 different weapons in the collection."], x_vollendung: ["Completion", "Earn all other achievements. The reward is a unique item."],
  x_shiny1: ["Glint", "You defeated a Chrome enemy."], x_shiny5: ["Glint Hunter", "You defeated 5 Chrome enemies."], x_dex5: ["Chrome Collector", "Five different Chrome finds are in your collection."], x_heroshiny: ["Chrome-Born", "You started a run as a Chrome hero."],
  x_herowin: ["Double Gleam", "You won a run as a Chrome hero."], x_untouched: ["Untouchable", "You defeated an elite or final enemy without taking damage."], x_oneturn: ["Blitzkrieg", "You won a combat against at least 3 enemies in a single turn."],
  x_bighit: ["Heavy Hitter", "You dealt at least 40 damage with one card at once."], x_chain: ["Chain Reaction", "You triggered 3 reactions in one turn."], x_flurry: ["Card Flurry", "You played 10 cards in one turn."],
  x_poison: ["Plague Hotspot", "An enemy had 25 Poison at the same time."], x_nobuy: ["Skinflint", "You won a run without buying anything in the shop."], x_minideck: ["Less Is More", "You won a run with at most 11 cards in your deck."],
  x_stack3: ["Third Time's the Charm", "You owned the same item three times."], x_lowhp: ["Close Call", "You won a run with at most 5 HP."], x_rich: ["Scrooge", "You owned 500 Gold at the same time."],
};
const EN_SPEAKERS = { brumm: { name: "Brumm", title: "Owner of the Convenience Store at the Gate" }, mira: { name: "Mira", title: "Researcher of the Hunter Guild" } };
const EN_STORIES = {
  intro: [
    "Psst! You there! Yes, you. Come in before the rain gets you. If that is rain. Today it was ash rain from the Gate.",
    "Last night the Gate Lord stormed the Hunter Guild headquarters and stole the Mana Core. It keeps fire, water, plants and ice in balance.",
    "And he took Mira with him. She was the only one who could make the Core sing.",
    { perClass: {
      nahkaempfer: "You look like you've opened a Gate with your forehead before. Perfect. Beyond the Gate they need people like you.",
      fernkaempfer: "Good eyes, quiet steps. Exactly what the Gates demand. And no, nobody pays for your arrows.",
      magier: "A Sorcerer! Finally someone who understands the elements. Ever since the Core is gone, they don't get along anymore. Mix them and it goes boom.",
      pyromant: "You smell of smoke and look like you don't care. Good. It's burning beyond the Gate anyway.",
      aristokrat: "A fine gentleman from a good clan! Lost? No? Then take the cane, the purse stays here. Beyond the Gate everything costs extra.",
      gaertnerin: "An herbalist in a Gate? Well, there are plenty of weeds in there. And the walls could use some green.",
      default: "You look capable. That's enough for me.",
    } },
    "The Gate is crawling with beasts. Collect cards, loot and Gold. And if something glittering crosses your path: grab it. It pays off.",
    "The first Gate is right here. Go! And bring Mira back safe!",
  ],
  startladen: ["You survived the rats. Look around, half price, because I like you."],
  outro: ["You did it! The Gate Lord is defeated, and the Mana Core sings again.", "By the way, Brumm claims he planned all of this. Don't believe a word."],
};
const EN_REACTIONS = { dampf: "Steam Burst", flaechenbrand: "Wildfire", wachstum: "Growth", schmelzen: "Melt", frostschock: "Frost Shock", dornenfrost: "Thorn Frost" };
const EN_ABILITIES = {
  steinschere: { name: "Rock-Paper-Scissors", forms: ["Rock", "Scissors", "Paper"], text: "Changes form with every use: Rock (huge punch, ignores Block), Scissors (3 hits with Bleed), Paper (damage to ALL and 6 Block). Every 4 turns.",
    levels: [{ task: "Use Rock-Paper-Scissors 40 times in combat.", reward: "Cooldown drops to 3 turns.", text: "Changes form with every use: Rock (huge punch, ignores Block), Scissors (3 hits with Bleed), Paper (damage to ALL and 6 Block). Every 3 turns." }] },
  donnerjojo: { name: "Thunder Yo-Yo", text: "Electric yo-yos hit ALL enemies (8 + 2x weapon, ignores Block) and stun the strongest: it skips its next action (bosses are immune). Every 5 turns.",
    levels: [{ task: "Deal 3,000 damage with the Thunder Yo-Yo.", reward: "Cooldown drops to 4 turns.", text: "Electric yo-yos hit ALL enemies (8 + 2x weapon, ignores Block) and stun the strongest: it skips its next action (bosses are immune). Every 4 turns." }] },
  seelenpfeil: { name: "Soul Arrow", text: "A ghost arrow no Block can stop: 18 + 3x weapon damage and the target is marked for 3 turns. Every 3 turns.",
    levels: [{ task: "Use the Soul Arrow 45 times in combat.", reward: "Damage rises to 26 + 3x weapon.", text: "A ghost arrow no Block can stop: 26 + 3x weapon damage and the target is marked for 3 turns. Every 3 turns." }] },
  schattentausch: { name: "Shadow Swap", text: "You swap places with your shadow: dodge the next 2 attacks and draw 3 cards. Every 5 turns.",
    levels: [{ task: "Use the Shadow Swap 30 times in combat.", reward: "You dodge 3 attacks.", text: "You swap places with your shadow: dodge the next 3 attacks and draw 3 cards. Every 5 turns." }] },
  fluchblitz: { name: "Curse Bolt", text: "A spell strike no Block can stop: 14 + 2x weapon damage to one enemy. Every 3 turns.",
    levels: [{ task: "Use Curse Bolt 50 times in combat.", reward: "Damage rises to 22 + 2x weapon.", text: "A spell strike no Block can stop: 22 + 2x weapon damage to one enemy. Every 3 turns." }] },
  domain: { name: "Domain Expansion", text: "For 2 turns all your hits ignore enemy Block and deal x1.5 final damage. Every 6 turns.",
    levels: [{ task: "Deal 5,000 total damage while Domain Expansion is active.", reward: "Cooldown drops to 5 turns.", text: "For 2 turns all your hits ignore enemy Block and deal x1.5 final damage. Every 5 turns." }] },
  feuerfaust: { name: "Fire Fist", text: "A burning fist: 14 + 3x weapon fire damage to one enemy and 4 Burn. Every 3 turns.",
    levels: [{ task: "Use the Fire Fist 50 times in combat.", reward: "Burn rises to 6.", text: "A burning fist: 14 + 3x weapon fire damage to one enemy and 6 Burn. Every 3 turns." }] },
  hoellenflamme: { name: "Hellflame", text: "You pay 6 HP (never below 1): 10 + 2x weapon fire damage to ALL enemies and 8 Burn on all. Every 5 turns.",
    levels: [{ task: "Use Hellflame 25 times in combat.", reward: "It only costs 4 HP.", text: "You pay 4 HP (never below 1): 10 + 2x weapon fire damage to ALL enemies and 8 Burn on all. Every 5 turns." }] },
  tor_der_schaetze: { name: "Gate of Treasures", text: "You open your treasury (10 Gold): 22 + 2x weapon damage to ALL enemies, ignores Block. Every 4 turns.",
    levels: [{ task: "Open the Gate of Treasures 35 times in combat.", reward: "It only costs 6 Gold.", text: "You open your treasury (6 Gold): 22 + 2x weapon damage to ALL enemies, ignores Block. Every 4 turns." }] },
  absoluter_befehl: { name: "Absolute Command", text: "The strongest enemy obeys: it skips its next action (bosses are immune), and all enemies become Vulnerable for 2 turns. Every 6 turns.",
    levels: [{ task: "Give the Absolute Command 20 times in combat.", reward: "Cooldown drops to 5 turns.", text: "The strongest enemy obeys: it skips its next action (bosses are immune), and all enemies become Vulnerable for 2 turns. Every 5 turns." }] },
  heilende_ranken: { name: "Healing Vines", text: "Vines wrap around you: heal 20% of your Max HP and gain Thorns 3. Every 5 turns.",
    levels: [{ task: "Use the Healing Vines 30 times in combat.", reward: "They heal 30% of your Max HP.", text: "Vines wrap around you: heal 30% of your Max HP and gain Thorns 3. Every 5 turns." }] },
  wuchernder_wald: { name: "Overgrown Forest", text: "A forest bursts from the ground: 7 + 2x weapon plant damage to ALL enemies and 4 Bleed on all. Every 4 turns.",
    levels: [{ task: "Deal 2,500 damage with the Overgrown Forest.", reward: "Bleed rises to 6.", text: "A forest bursts from the ground: 7 + 2x weapon plant damage to ALL enemies and 6 Bleed on all. Every 4 turns." }] },
};

__exports.EN_WEAPONS = EN_WEAPONS;
__exports.EN_ENEMIES = EN_ENEMIES;
__exports.EN_ENCOUNTERS = EN_ENCOUNTERS;
__exports.EN_SKINS = EN_SKINS;
__exports.EN_FRAMES = EN_FRAMES;
__exports.EN_CLASSES = EN_CLASSES;
__exports.EN_EVENTS = EN_EVENTS;
__exports.EN_ACH = EN_ACH;
__exports.EN_SPEAKERS = EN_SPEAKERS;
__exports.EN_STORIES = EN_STORIES;
__exports.EN_REACTIONS = EN_REACTIONS;
__exports.EN_ABILITIES = EN_ABILITIES;

});
__define("ui/en_ui.js", function (__exports, __require) {
// Englische Texte der Oberfläche. EN_UI: genauer deutscher Text -> englisch. EN_PATTERNS: [Muster, (t, ...Gruppen) => Text] für Texte mit Zahlen oder Inhalten (t übersetzt Teile).
const P = (o) => Object.entries(o);
const EN_UI = {
  "Abbrechen": "Cancel", "Ablagestapel": "Discard pile", "Albtraum": "Nightmare", "Aufbrechen": "Set out", "Ausrüstung": "Equipment", "Aussehen": "Appearance", "Beute": "Loot",
  "Bitte drehe dein Gerät ins Querformat.": "Please rotate your device to landscape.", "Ani-Rogue wird quer gespielt.": "Ani-Rogue is played in landscape.", "Chrom-Item": "Chrome item", "Chrom-Waffe": "Chrome weapon",
  "Dein Gold:": "Your Gold:", "Dein Held": "Your hero", "Der Run ist zu Ende.": "The run is over.", "Gate-Karte": "Gate map", "Ein Anime-Roguelite-Deckbuilder": "An anime roguelite deckbuilder",
  "Ein Feuer knistert. Du hast Zeit für genau eine Sache.": "A fire crackles. You have time for exactly one thing.", "Eine Karte aus dem Deck entfernen": "Remove a card from your deck", "Einstellungen": "Settings",
  "Endboss": "Final boss", "Ereignis": "Event", "Erfolg freigeschaltet": "Achievement unlocked", "Erfolge": "Achievements", "Farben der Helden": "Hero colors", "Farbvariante": "Color variant", "Freischaltungen": "Unlocks",
  "Gegner": "Enemies", "Geschichte": "Story", "Gesperrt": "Locked", "Gewöhnlich": "Common", "Ungewöhnlich": "Uncommon", "Selten": "Rare", "Legendär": "Legendary", "Gift": "Poison", "Helden": "Heroes", "Händler": "Merchant",
  "Item für die nächste Runde sperren": "Lock item for the next merchant visit", "Sperre aufheben": "Remove lock", "Midas-Fluch: Sperren ist dauerhaft deaktiviert": "Midas Curse: locking is permanently disabled", "Items": "Items", "Waffen": "Weapons", "Waffe": "Weapon", "Karte": "Card", "Karten": "Cards",
  "Jede Waffe ist frei wählbar und passt zu einem Helden am besten. Bessere Waffen findest du später, zum Beispiel nach dem Mini-Boss.": "Every weapon is free to choose and suits one hero best. You'll find better weapons later, for example after the mini-boss.",
  "Kampf": "Combat", "Kampfszene": "Combat scene", "Karte wählen (oder überspringen)": "Choose a card (or skip)", "Klasse:": "Class:", "Kämpfe": "Combats", "Kämpfe:": "Combats:", "Leuchtende Orte sind erreichbar.": "Glowing places are reachable.",
  "Manche Erfolge zeigen sich erst, wenn du sie erreichst.": "Some achievements only appear once you reach them.", "Mehr": "More", "Menü": "Menu", "Mini-Boss": "Mini-boss", "Nachziehstapel": "Draw pile", "Nehmen": "Take", "Gewählt": "Chosen",
  "Neu freigeschaltet:": "Newly unlocked:", "Neue Erfolge:": "New achievements:", "Neue Varianten und Rahmen schaltest du über Erfolge frei. Ein Rahmen umrandet alle Karten und Items im Spiel (Hand, Shop, Beute).": "Unlock new variants and frames through achievements. A frame outlines all cards and items in the game (hand, shop, rewards).", "Neuer Run": "New run", "Noch keine Items.": "No items yet.",
  "Normal": "Normal", "Schwer": "Hard", "Groß": "Large", "Sehr groß": "Extra large", "Rahmen": "Frames", "Rast": "Rest", "Rastplatz": "Campsite", "Run aufgeben": "Abandon run", "Runs und Siege": "Runs and wins", "Sammlung": "Collection", "Schließen": "Close",
  "Schwierigkeit": "Difficulty", "Shiny-Sammlung": "Shiny collection", "Shinys gesehen:": "Shinies seen:", "Sieg! Der Gate-Lord ist gefallen.": "Victory! The Gate Lord has fallen.", "Standard": "Default", "Startladen": "Starter shop", "Tippe einen Gegner an": "Tap an enemy",
  "Weiter": "Continue", "Weiterspielen": "Resume", "Wohin als Nächstes?": "Where next?", "Der Weg beginnt": "The journey begins", "Wähle deine Waffe": "Choose your weapon", "Wähle deinen Helden": "Choose your hero", "Zug beenden": "End turn",
  "Zum Titel (speichert)": "To title (saves)", "Zurück": "Back", "Zurück zum Titel": "Back to title", "Überspringen": "Skip", "· Deckgröße:": "· Deck size:", "· Gold verdient:": "· Gold earned:", "· Orte:": "· Places:", "leer = Zufall": "empty = random",
  "Preise: Grundpreis": "Prices: base price", "Neu würfeln": "Reroll", "Schredder": "Shredder", "Welche Karte entfernen?": "Which card to remove?", "Wirklich alles löschen?": "Really delete everything?", "Ja, löschen": "Yes, delete", "Spielstand löschen": "Delete save",
  "Etwas Verborgenes wartet noch.": "Something hidden is still waiting.", "Aufbrechen ": "Set out", "(für Freunde: gleiche Karte)": "(for friends: same map)", "Chrom-Held:": "Chrome hero:", "Verkauft": "Sold", "Gewählt ": "Chosen",
  "Im Kampf wird nicht gespeichert. Beendest du jetzt, beginnt der Kampf beim nächsten Mal von vorn.": "Progress is not saved during combat. If you quit now, the combat starts over next time.",
  "Karte entfernt": "Card removed", "Eine Karte wurde entfernt.": "A card was removed.", "Angebot neu gewürfelt": "Offer rerolled", "Item gesperrt: wartet auf den nächsten Händler": "Item locked: waits for the next merchant", "Sperre aufgehoben": "Lock removed",
  "Zu wenig Gold": "Not enough gold", "Nicht verfügbar": "Not available", "Bereits gewählt": "Already chosen", "Ungültige Wahl": "Invalid choice", "Nicht auf der Karte": "Not on the map", "Knoten nicht erreichbar": "Place not reachable", "Kampf läuft noch": "Combat still running",
  "Karte kann nicht entfernt werden": "Card can't be removed", "Spielstand gelöscht": "Save deleted", "Freischaltungen und Shinys bleiben erhalten.": "Unlocks and Shinies are kept.", "Glück gehabt!": "Lucky!", "Hier ist alles Shiny: Held, Gegner, Beute.": "Everything here is Shiny: hero, enemies, loot.",
  "Das Spiel wurde aktualisiert. Dein angefangener Run passt nicht mehr dazu und wurde verworfen.": "The game was updated. Your run in progress no longer fits and was discarded.", "Spielstand war beschädigt": "Save was corrupted", "Spielstand passt nicht zur neuen Version und wurde verworfen": "Save doesn't match the new version and was discarded",
  "Nichts davon wird gespeichert oder zählt für deinen Fortschritt.": "None of this is saved or counts toward your progress.", "Über das Menü kommst du zurück.": "Use the menu to get back.",
  "Ein Tipp spielt die Karte. Einen Gegner antippen setzt ihn als Hauptziel.": "One tap plays the card. Tapping an enemy makes it the main target.", "Erst Karte wählen, dann Gegner antippen.": "Choose a card first, then tap an enemy.",
  "Spielstand": "Save data", "Sichern (Datei)": "Back up (file)", "Laden (Datei)": "Restore (file)", "Ja, ersetzen": "Yes, replace", "Das ist keine Ani-Rogue-Sicherung": "This is not an Ani-Rogue backup", "Spielstand geladen": "Save loaded",
  "Verband angelegt": "Bandage applied", "Stärkungstrank getrunken": "Tonic drunk", "Du bist bei vollen HP": "You are at full HP",
  "Deutsch": "German", "Englisch": "English",
  "Vollbild geht auf iPad und iPhone nur als App: Teilen, dann „Zum Home-Bildschirm“.": "On iPad and iPhone, fullscreen only works as an app: Share, then \"Add to Home Screen\".",
  "Schnellladen": "Quick shop",
  "Auf Update prüfen": "Check for update", "Jetzt aktualisieren": "Update now", "Neu laden": "Reload", "Prüfe …": "Checking…", "Du hast die neueste Version.": "You have the latest version.",
  "Update verfügbar! Ein laufender Kampf wird dabei nicht gespeichert.": "Update available! A combat in progress is not saved.", "Prüfen nicht möglich. Lade die Seite neu, um sicher die neueste Version zu haben.": "Can't check. Reload the page to be sure you have the latest version.",
  "Das Spiel wurde aktualisiert. Dein angefangener Run passt nicht mehr dazu und wurde beendet und gezählt.": "The game was updated. Your run in progress no longer fits and was ended and counted.", "Erfolge, Entdeckungen, Freischaltungen und Shinys sind übernommen.": "Achievements, discoveries, unlocks and Shinies were carried over.", "Neue Version": "New version",
  "Rüstung": "Armor", "Regeneration": "Regeneration", "Lebensraub %": "Lifesteal %", "Schaden %": "Damage %", "Nahkampfschaden": "Melee Damage", "Fernkampfschaden": "Ranged Damage", "Elementarschaden": "Elemental Damage", "Krit-Chance %": "Crit Chance %", "Ausweichen %": "Dodge %", "Glück": "Luck", "Ernte": "Harvest",
  "Handkarten": "Hand size", "% Gold": "% Gold", "Block/Zug": "Block/turn", "Shiny-Chance": "Shiny chance", "% Reaktionen": "% Reactions", "Einfrier-Hilfe": "Freeze help", "Aufstieg": "Level-up", "Erfahrung": "Experience",
  "Mehr Lebenspunkte.": "More hit points.", "Heilung nach jedem Kampf.": "Healing after every combat.", "Heilt dich um einen Teil deines Kartenschadens.": "Heals you for part of your card damage.", "Alle Karten machen mehr Schaden.": "All cards deal more damage.",
  "Mehr Schaden mit Nahkampfkarten.": "More damage with melee cards.", "Mehr Schaden mit Fernkampfkarten.": "More damage with ranged cards.", "Mehr Schaden mit Element- und Zauberkarten.": "More damage with element and spell cards.", "Chance auf einen kritischen Treffer (x1,5 Schaden).": "Chance for a critical hit (x1.5 damage).",
  "Gegner machen weniger Schaden (15 Rüstung = halber Schaden).": "Enemies deal less damage (15 Armor = half damage).", "Chance, dass ein Angriff danebengeht (höchstens 60 %).": "Chance that an attack misses (at most 60%).", "Bessere Seltenheiten bei Belohnungen und im Shop.": "Better rarities in rewards and in the shop.", "Festes Gold nach jedem Kampf.": "Fixed Gold after every combat.",
  "Zufall": "random",
  "Endboss ": "Final boss",
  "Run fortsetzen": "Continue run", "Kein Spielstand gefunden": "No save found", "Kein Intro aktiv": "No intro active", "Kein Kampf aktiv": "No combat active", "Nicht im Shop": "Not in a shop", "Kein Ereignis aktiv": "No event active", "Keine Belohnung offen": "No reward open", "Nicht an einer Rast": "Not at a rest site", "Unbekannter Knotentyp": "Unknown place type",
  "Feuer": "Fire", "Wasser": "Water", "Pflanze": "Plant", "Eis": "Ice", "Reaktionen": "Reactions", "Zwei verschiedene Elemente nacheinander im selben Zug lösen eine Reaktion aus:": "Two different elements in a row in the same turn trigger a reaction:",
  "Leuchtende Orte sind erreichbar. Tippe auf ein Symbol für Infos.": "Glowing places are reachable. Tap a symbol for info.",
  "Normale Gegner. Du bekommst Gold, eine Karte zur Wahl und manchmal ein Item.": "Normal enemies. You get Gold, a card to choose and sometimes an item.", "Ein starker Gegner. Dafür gibt es mehr Gold und sicher ein Item.": "A strong enemy. In return you get more Gold and a sure item.",
  "Ein sehr starker Gegner. Dafür gibt es eine Waffe zur Wahl, ein Item und viel Gold.": "A very strong enemy. In return you get a weapon to choose, an item and lots of Gold.", "Ein Lagerfeuer: Heile dich oder entferne eine Karte aus deinem Deck.": "A campfire: heal yourself or remove a card from your deck.",
  "Hier kaufst du Karten, Items und Dienste (Verband, Stärkungstrank). Gold ausgeben lohnt sich.": "Buy cards, items and services here (bandage, tonic). Spending Gold pays off.", "Eine Begegnung mit einer Wahl. Sie kann dir nützen oder etwas kosten.": "An encounter with a choice. It can help you or cost you something.", "Der Endboss. Besiegst du ihn, gewinnst du den Run.": "The final boss. Defeat him to win the run.",
  "Das ist die letzte Stage. Am Ende wartet der Endboss.": "This is the last stage. The final boss waits at the end.", "Du hast die Stage geschafft. Die Gegner werden stärker, dafür wird die Beute besser.": "You cleared the stage. Enemies get stronger, but the loot gets better.", "Wächter": "Guardian",
  "Preise %": "Prices %", "Reroll-Preis %": "Reroll price %", "Freie Rerolls": "Free rerolls", "Schaden gegen Bosse %": "Damage vs bosses %", "Gift-Stärke": "Poison power", "Brenn-Stärke": "Burn power", "Blutungs-Stärke": "Bleed power", "Heilung %": "Healing %", "Doppel-Gold %": "Double Gold %", "Fluch": "Curse", "Werte": "Stats",
  "Sammlung": "Collection", "Statistik": "Statistics", "Runs": "Runs", "Siege": "Wins", "Niederlagen": "Losses", "Siegrate": "Win rate", "Beste Stage": "Best stage", "Gegner besiegt": "Enemies defeated", "Kämpfe gewonnen": "Combats won", "Gold verdient": "Gold earned", "Elite besiegt": "Elites defeated", "Chrom-Gegner": "Chrome enemies",
  "Letzte Runs": "Recent runs", "Noch nicht freigeschaltet": "Not unlocked yet", "Freigeschaltet (Datum unbekannt)": "Unlocked (date unknown)", "Sieg": "Victory",
  "Fähigkeit": "Ability", "BEREIT": "READY", "Keine Fähigkeit gewählt": "No ability chosen",
  "Fähigkeiten": "Abilities", "Maximale Stufe": "Max level", "Fähigkeit verbessert": "Ability upgraded", "Fähigkeiten werden nur hier verbessert: durch Aufgaben mit der jeweiligen Fähigkeit, nie während eines Runs.": "Abilities are only upgraded here: by tasks with that ability, never during a run.",
  "Sieg!": "Victory!", "Niederlage": "Defeat",
  "Lebensraub": "Lifesteal", "Schaden": "Damage", "Krit-Chance": "Crit Chance", "Ausweichen": "Dodge", "Gold": "Gold", "Preise": "Prices", "Reroll-Preis": "Reroll price", "Schaden gegen Bosse": "Damage vs bosses", "Heilung": "Healing", "Doppel-Gold": "Double Gold", "Reaktionen": "Reactions",
  "Wird behalten": "Will be kept", "Am Zugende behalten": "Keep at end of turn", "Gratis": "Free",
  "Empfohlenes Deck": "Recommended deck", "Neu wählen": "Choose again", "Dein Startdeck steht. Mit Aufbrechen beginnt der Run.": "Your starting deck is set. Set out to begin the run.", "Weiter": "Next",
  "Sprache": "Language", "Anzeigegröße": "Display size", "Vollbild": "Fullscreen", "Tempo im Kampf": "Combat speed", "Zug beenden ": "End turn", "Ziele wählen": "Choose targets", "Automatisch": "Automatic", "Von Hand": "Manual",
  "Größer heißt: weniger Platz, aber alles erscheint größer. Vollbild blendet die Browser-Leisten aus.": "Larger means less room, but everything looks bigger. Fullscreen hides the browser bars.", "Automatisch: Der Zug endet von selbst, sobald du keine Karte mehr spielen kannst. Von Hand: Du tippst immer selbst auf Zug beenden.": "Automatic: your turn ends by itself once you can't play a card. Manual: you always tap End turn yourself.",
  "Der Elementarwandler": "The Elemental Wanderer", "Erst Karte wählen": "Choose a card first", "Tempo": "Speed", "Auto": "Auto", "Normal ": "Normal", "Ausruhen": "Rest",
  // Heldenwahl / Sammlung
  "Gesperrt ": "Locked", "Erfolg": "Achievement", "Neue Schwierigkeit freigeschaltet": "New difficulty unlocked",
  // Begriffserklärungen (ui/glossary.js)
  "Gift ": "Poison", "Blutung": "Bleed", "Verwundbar": "Vulnerable", "Markiert": "Marked", "Ausweichen": "Dodge", "Dornen": "Thorns", "Verbrennung": "Burn", "Kälte": "Chill", "Eingefroren": "Frozen", "Aussetzen": "Skip", "Lebensraub": "Lifesteal", "Kopfgeld": "Bounty",
  "Max-HP": "Max HP", "Geheilt": "Healed", "Verbrauchen": "Exhaust", "Schaden aus Block": "Damage from Block", "HP verlieren": "Lose HP", "Reaktion": "Reaction", "Block": "Block", "Fehlende HP": "Missing HP", "HP verloren": "HP lost",
  "Am Ende der Gegnerrunde Schaden in Höhe der Stapel (ignoriert Block), danach 1 Stapel weniger.": "At the end of the enemy round, damage equal to the stacks (ignores Block), then 1 stack less.",
  "Am Ende der Gegnerrunde Schaden in Höhe der Stapel (ignoriert Block), danach halbieren sich die Stapel.": "At the end of the enemy round, damage equal to the stacks (ignores Block), then the stacks are halved.",
  "Das Ziel erleidet 50 % mehr Schaden. Jede Runde 1 Stapel weniger.": "The target takes 50% more damage. 1 stack less each round.", "Jeder Treffer macht 1 Schaden mehr. Jede Runde 1 Stapel weniger.": "Every hit deals 1 more damage. 1 stack less each round.",
  "Pro Stapel geht ein Angriff daneben. Endet mit deinem nächsten Zug.": "Each stack makes one attack miss. Ends with your next turn.", "Jeder Angreifer erleidet Schaden, auch wenn dein Block alles abfängt. Endet mit deinem nächsten Zug.": "Every attacker takes damage, even if your Block absorbs everything. Ends with your next turn.",
  "Der Schaden hängt davon ab, wie viele Lebenspunkte dir zum Maximum fehlen.": "The damage depends on how many hit points you are missing from your maximum.", "Zählt alle HP, die seit Beginn deines Zuges verloren gingen, auch durch eigene Karten und Items.": "Counts all HP lost since the start of your turn, including through your own cards and items.",
  "Sammelt sich beim Gegner. Bei 3 Stapeln friert er ein und überspringt seine nächste Aktion (der Endboss und Feuerwesen sind immun).": "Builds up on the enemy. At 3 stacks it freezes and skips its next action (the final boss and fire creatures are immune).",
  "Der Gegner überspringt diese Runde seine Aktion. Bosse sind unbestechlich.": "The enemy skips its action this round. Bosses can't be bribed.", "Du heilst dich um den tatsächlich verursachten Schaden (Block des Ziels zählt nicht).": "You heal for the damage actually dealt (the target's Block doesn't count).",
  "Tötet genau diese Karte den Gegner, erhältst du sofort das Gold.": "If exactly this card kills the enemy, you get the Gold at once.", "Dauerhaft bis zum Ende des Runs; die aktuellen HP steigen mit.": "Permanent until the end of the run; current HP rises with it.",
  "Zählt auch, wenn die Heilung durch einen Effekt (z. B. Nekromanten-Pakt) verhindert wurde.": "Also counts if the healing was prevented by an effect (e.g. Necromancer's Pact).", "Nach dem Spielen ist die Karte für den Rest dieses Kampfes weg. Im nächsten Kampf ist sie wieder da.": "After playing, the card is gone for the rest of this combat. It is back in the next combat.",
  "Der Schaden hängt von deinem aktuellen Block ab. Der Block bleibt erhalten.": "The damage depends on your current Block. The Block is kept.", "Kostet HP, aber nie die letzte: mindestens 1 HP bleibt. Zählt nicht als erlittener Schaden.": "Costs HP, but never the last one: at least 1 HP remains. Doesn't count as damage taken.",
  "Zwei verschiedene Elemente nacheinander im selben Zug lösen eine Reaktion mit Zusatzwirkung aus.": "Two different elements in a row in the same turn trigger a Reaction with a bonus effect.", "Fängt Schaden ab und verfällt zu Beginn deines nächsten Zuges.": "Absorbs damage and expires at the start of your next turn.",
};
const EN_PATTERNS = [
  [/^Dein Startdeck: Karte (\d+) von (\d+)$/, (t, a, b) => `Your starting deck: card ${a} of ${b}`],
  [/^([+-]?\d+%?) (Max-HP|Regeneration|Lebensraub|Schaden|Nahkampfschaden|Fernkampfschaden|Elementarschaden|Krit-Chance|Rüstung|Ausweichen|Glück|Ernte|Energie|Handkarten|Gold|Block\/Zug|Shiny-Chance|Reaktionen|Einfrier-Hilfe|Preise|Reroll-Preis|Freie Rerolls|Schaden gegen Bosse|Gift-Stärke|Brenn-Stärke|Blutungs-Stärke|Heilung|Doppel-Gold|Fluch)$/, (t, v, s) => `${v} ${t(s)}`],
  [/^Stufe (\d+)\/(\d+)$/, (t, a, b) => `Level ${a}/${b}`], [/^(.+) ist jetzt Stufe (\d+)\.$/, (t, n, l) => `${n} is now level ${l}.`], [/^([\d.,]+) \/ ([\d.,]+) · Belohnung: (.+)$/, (t, a, b, r) => `${a} / ${b} · Reward: ${r}`],
  [/^(.+) · St\. (\d+)$/, (t, n, l) => `${n} · Lv ${l}`], [/^Noch (\d+) Züge Cooldown$/, (t, n) => `${n} more turns of cooldown`],
  [/^(Items|Waffen|Gegner): (\d+) von (\d+) entdeckt · (\d+) Shiny$/, (t, k, a, b, c) => `${t(k)}: ${a} of ${b} discovered · ${c} Shiny`], [/^Freigeschaltet am (.+)$/, (t, d) => `Unlocked on ${d}`],
  [/^(\d+) Runs · (\d+) Siege · Stage (\d+) · (.+)$/, (t, r, w, s, d) => `${r} runs · ${w} wins · Stage ${s} · ${t(d)}`], [/^Niederlage in Stage (\d+) · (\d+) Kämpfe$/, (t, s, f) => `Defeat in Stage ${s} · ${f} combats`], [/^Sieg · (\d+) Kämpfe$/, (t, f) => `Victory · ${f} combats`],
  [/^(.+) · (Normal|Schwer|Albtraum)$/, (t, c, d) => `${c} · ${t(d)}`],
  [/^Neu würfeln \(gratis x(\d+)\)$/, (t, n) => `Reroll (free x${n})`],
  [/^(Gewöhnlich|Ungewöhnlich|Selten|Legendär)( · Passt zu: .+?)?( · Einzigartig)$/, (t, r, h, u) => `${t(r)}${h ? ` · Fits: ${h.slice(" · Passt zu: ".length)}` : ""} · Unique`],
  [/^Stage (\d+)\/(\d+) · (.+)$/, (t, a, b, w) => `Stage ${a}/${b} · ${w === "Wächter" ? "Guardian" : w === "Start" ? "Start" : w === "Endboss" ? "Final boss" : w.replace(/^Ebene/, "Level")}`], [/^Stage (\d+) von (\d+)$/, (t, a, b) => `Stage ${a} of ${b}`],
  [/^Du wurdest zu (\d+) % geheilt\.$/, (t, n) => `You were healed by ${n}%.`],
  [/^(.+) \((Feuer|Wasser|Pflanze|Eis) \+ (Feuer|Wasser|Pflanze|Eis)\): (.+)$/, (t, n, a, b, x) => `${t(n)} (${t(a)} + ${t(b)}): ${x}`],
  [/^Gekauft: (.+)$/, (t, n) => `Bought: ${n}`], [/^Genommen: (.+)$/, (t, n) => `Taken: ${n}`], [/^\+(\d+) HP$/, (t, n) => `+${n} HP`], [/^Noch gesperrt: (.+)$/, (t, n) => `Still locked: ${n}`],
  [/^Werte · Stufe (\d+) \((\d+)\/(\d+) EP\)$/, (t, l, a, b) => `Stats · Level ${l} (${a}/${b} XP)`], [/^St\. (\d+)$/, (t, n) => `Lv ${n}`], [/^Stufe (I|II|III|IV)$/, (t, n) => `Tier ${n}`],
  [/^Stufe (\d+): Wert-Aufstieg wählen( \((\d+) offen\))?$/, (t, l, x, n) => `Level ${l}: choose a stat upgrade${n ? ` (${n} open)` : ""}`],
  [/^\+(\d+) (Max-HP|Regeneration|Lebensraub %|Schaden %|Nahkampfschaden|Fernkampfschaden|Elementarschaden|Krit-Chance %|Rüstung|Ausweichen %|Glück|Ernte)$/, (t, v, s) => `+${v} ${t(s)}`],
  [/^Version (.+)$/, (t, v) => `Version ${v}`],
  [/^(Gewöhnlich|Ungewöhnlich|Selten|Legendär) · Passt zu: (.+)$/, (t, r, c) => `${t(r)} · Fits: ${c}`],
  [/^Verband \+(\d+)% HP \((\d+)\)$/, (t, p, c) => `Bandage +${p}% HP (${c})`], [/^Trank \+(\d+) Max-HP \((\d+)\)$/, (t, m, c) => `Tonic +${m} Max HP (${c})`],
  [/^Sicherung ersetzen\? Siege (\d+), Runs (\d+)(, Run in Arbeit)?\. Dein jetziger Fortschritt wird überschrieben\.$/, (t, w, r, x) => `Replace backup? Wins ${w}, runs ${r}${x ? ", run in progress" : ""}. Your current progress will be overwritten.`],
  [/^Tempo x(\d)$/, (t, n) => `Speed x${n}`], [/^Siege (\d+) · Runs (\d+) · Shinys (\d+)$/, (t, a, b, c) => `Wins ${a} · Runs ${b} · Shinies ${c}`],
  [/^Items: (\d+) von (\d+) als Shiny gefunden$/, (t, a, b) => `Items: ${a} of ${b} found as Shiny`], [/^(Helden|Karten|Waffen|Gegner): (\d+) von (\d+) als Shiny gefunden$/, (t, k, a, b) => `${t(k)}: ${a} of ${b} found as Shiny`],
  [/^(\d+) von (\d+)$/, (t, a, b) => `${a} of ${b}`], [/^Platten (\d+)$/, (t, n) => `Plates ${n}`], [/^Preise: \+(\d+) % Inflation$/, (t, n) => `Prices: +${n}% inflation`],
  [/^Ausruhen \(\+(\d+) HP\)$/, (t, n) => `Rest (+${n} HP)`], [/^Schredder \((\d+)\)$/, (t, n) => `Shredder (${n})`], [/^Neu würfeln \((\d+)\)$/, (t, n) => `Reroll (${n})`], [/^Details zu (.+)$/, (t, n) => `Details for ${n}`],
  [/^Dein Deck \((\d+)\)$/, (t, n) => `Your deck (${n})`], [/^\(\+(\d+) Chrom\)$/, (t, n) => `(+${n} Chrome)`], [/^Chrom-Fund: (Item|Waffe) \(wähle (\d+)\)$/, (t, k, n) => `Chrome find: ${t(k).toLowerCase()} (choose ${n})`],
  [/^Belohnung: (.+) \((Item|Waffe|Karte)\)$/, (t, n, k) => `Reward: ${n} (${t(k).toLowerCase()})`], [/^Erfolg: (.+)$/, (t, n) => `Achievement: ${n}`], [/^(.+): Erfolg: (.+)$/, (t, a, n) => `${a}: Achievement: ${n}`],
  [/^Neue Schwierigkeit freigeschaltet: (.+)$/, (t, n) => `New difficulty unlocked: ${t(n)}`], [/^(.+) · (Normal|Schwer|Albtraum) · Ebene (\d+)\/(\d+)$/, (t, c, d, l, m) => `${c} · ${t(d)} · Level ${l}/${m}`],
  [/^Kosten (\d+) · (Gewöhnlich|Ungewöhnlich|Selten|Legendär)(?: · (.+))?$/, (t, c, r, e) => `Cost ${c} · ${t(r)}${e ? ` · ${t(e)}` : ""}`], [/^(Gewöhnlich|Ungewöhnlich|Selten|Legendär) · Waffe$/, (t, r) => `${t(r)} · Weapon`],
  [/^(Gewöhnlich|Ungewöhnlich|Selten|Legendär) · Signatur: (.+)$/, (t, r, c) => `${t(r)} · Signature: ${c}`], [/^(Gewöhnlich|Ungewöhnlich|Selten|Legendär) · (Item|Karte)$/, (t, r, k) => `${t(r)} · ${t(k)}`],
  [/^(.+) ✦ Werte \+(\d+) ?%$/, (t, x, n) => `${x} ✦ Stats +${n}%`], [/^✦ Werte \+(\d+) ?%$/, (t, n) => `✦ Stats +${n}%`], [/^(\d+) von (\d+) Erfolgen$/, (t, a, b) => `${a} of ${b} achievements`],
  [/^Max-HP ([+-]?\d+)$/, (t, n) => `Max HP ${n}`], [/^([+-]?\d+) HP$/, (t, n) => `${n} HP`], [/^Kein Ort vom Typ (.+) auf dieser Karte$/, (t, n) => `No place of type ${n} on this map`],
  [/^Bonus für diesen Run: \+(\d+) Glück\.$/, (t, n) => `Bonus for this run: +${n} Luck.`], [/^Chance beim Start: 1 zu (\d+)\.$/, (t, n) => `Chance at start: 1 in ${n}.`],
  [/^Seed: (\d+) \(für Freunde: gleiche Karte\)$/, (t, n) => `Seed: ${n} (for friends: same map)`], [/^Stärke (\d+)\.(.*)$/, (t, n, r) => `Power ${n}.${r}`],
  [/^ und (\d+) weitere$/, (t, n) => ` and ${n} more`], [/^(.+)-Tag$/, (t, n) => `${n} tag`],
];

__exports.EN_UI = EN_UI;
__exports.EN_PATTERNS = EN_PATTERNS;

});
__define("ui/i18n_en.js", function (__exports, __require) {
// Englische Texte. EN_UI: genauer deutscher Text -> englisch (Oberfläche, ui/en_ui.js). EN_PATTERNS: Texte mit Zahlen. EN_CONTENT: Inhalte nach Art und ID (ui/en_cards_items.js, ui/en_world.js).
const { EN_CARDS, EN_ITEMS } = __require("ui/en_cards_items.js");
const { EN_WEAPONS, EN_ENEMIES, EN_ENCOUNTERS, EN_SKINS, EN_FRAMES, EN_CLASSES, EN_EVENTS, EN_ACH, EN_SPEAKERS, EN_STORIES, EN_REACTIONS, EN_ABILITIES } = __require("ui/en_world.js");
const { EN_UI, EN_PATTERNS } = __require("ui/en_ui.js");

const obj = (src, names) => Object.fromEntries(Object.entries(src).map(([k, v]) => [k, Object.fromEntries(names.map((n, i) => [n, v[i]]))]));
const named = (src) => Object.fromEntries(Object.entries(src).map(([k, v]) => [k, { name: v }]));
const EN_CONTENT = {
  cards: obj(EN_CARDS, ["name", "text"]), items: obj(EN_ITEMS, ["name", "text"]), weapons: named(EN_WEAPONS), enemies: named(EN_ENEMIES), encounters: named(EN_ENCOUNTERS),
  skins: named(EN_SKINS), abilities: EN_ABILITIES, reactions: named(EN_REACTIONS), frames: named(EN_FRAMES), classes: EN_CLASSES, achievements: obj(EN_ACH, ["name", "text"]), events: EN_EVENTS, speakers: EN_SPEAKERS, stories: EN_STORIES,
};

__exports.EN_UI = EN_UI;
__exports.EN_PATTERNS = EN_PATTERNS;
__exports.EN_CONTENT = EN_CONTENT;

});
__define("ui/i18n.js", function (__exports, __require) {
// Sprachumschaltung Deutsch / Englisch.
// Inhalte (Karten, Items, Waffen, Gegner, Helden, Ereignisse, Erfolge, Geschichte ...): applyContentLanguage tauscht die Textfelder der Definitionen, die deutschen Originale bleiben gemerkt.
// Oberfläche: translateDom übersetzt nach jedem Zeichnen alle Textknoten und Beschriftungen über ein Wörterbuch (genaue Texte) und Muster (Texte mit Zahlen).
// Neue Texte: deutsch ins Spiel schreiben, die englische Fassung in ui/i18n_en.js eintragen; node tools/i18n-check.mjs meldet fehlende Übersetzungen.
const { EN_UI, EN_PATTERNS, EN_CONTENT } = __require("ui/i18n_en.js");

let lang = "de";
const orig = new WeakMap();                       // Definition -> deutsche Originaltexte
const LANGS = { de: "Deutsch", en: "English" };
const getLang = () => lang;

// Einzelner Text (für Meldungen und Texte, die nicht im DOM landen)
function t(s) {
  if (lang !== "en" || typeof s !== "string") return s;
  const trimmed = s.trim();
  if (!trimmed) return s;
  const lead = s.slice(0, s.indexOf(trimmed)), tail = s.slice(s.indexOf(trimmed) + trimmed.length);
  if (EN_UI[trimmed] !== undefined) return lead + EN_UI[trimmed] + tail;
  for (const [re, fn] of EN_PATTERNS) { const m = trimmed.match(re); if (m) return lead + fn(t, ...m.slice(1)) + tail; }
  return s;
}

// Alle Texte in einem Teilbaum übersetzen (Textknoten und Beschriftungen)
const ATTRS = ["title", "aria-label", "placeholder", "alt"];
function translateDom(root) {
  if (lang !== "en" || !root) return;
  const walker = (root.ownerDocument ?? document).createTreeWalker(root, 4 /* NodeFilter.SHOW_TEXT */);
  const nodes = []; for (let n = walker.nextNode(); n; n = walker.nextNode()) nodes.push(n);
  for (const n of nodes) { const v = t(n.nodeValue); if (v !== n.nodeValue) n.nodeValue = v; }
  for (const el of root.querySelectorAll("[" + ATTRS.join("],[") + "]")) for (const a of ATTRS) if (el.hasAttribute(a)) { const v = t(el.getAttribute(a)); if (v !== el.getAttribute(a)) el.setAttribute(a, v); }
}

// Inhalte: je Art die Felder, die übersetzt werden. Die deutschen Originale werden beim ersten Tausch gemerkt.
const FIELDS = { cards: ["name", "text"], items: ["name", "text"], weapons: ["name"], enemies: ["name"], encounters: ["name"], classes: ["name", "blurb", "perks"], skins: ["name"], frames: ["name"], achievements: ["name", "text"], events: ["name", "text"], abilities: ["name", "text"], speakers: ["name", "title"], reactions: ["name"] };
function swap(obj, fields, en) {
  if (!orig.has(obj)) orig.set(obj, Object.fromEntries(fields.map((f) => [f, structuredClone(obj[f])])));
  const o = orig.get(obj);
  for (const f of fields) if (o[f] !== undefined) obj[f] = lang === "en" && en?.[f] !== undefined ? structuredClone(en[f]) : structuredClone(o[f]);
}
function applyContentLanguage(CONTENT, to) {
  lang = to === "en" ? "en" : "de";
  CONTENT.clearShinyCache?.();
  for (const [kind, fields] of Object.entries(FIELDS)) for (const [id, def] of Object.entries(CONTENT[kind] ?? {})) swap(def, fields, EN_CONTENT[kind]?.[id]);
  for (const [id, def] of Object.entries(CONTENT.classes ?? {})) if (def.passive) swap(def.passive, ["name", "text"], EN_CONTENT.classes?.[id]?.passive);   // Klassen-Passiv
  for (const [id, def] of Object.entries(CONTENT.abilities ?? {})) {
    const en = EN_CONTENT.abilities?.[id];
    (def.forms ?? []).forEach((f, i) => swap(f, ["name"], { name: en?.forms?.[i] }));
    def.levels.forEach((lv, i) => { swap(lv, ["text", "task", "reward"], en?.levels?.[i]); (lv.forms ?? []).forEach((f, j) => swap(f, ["name"], { name: en?.forms?.[j] })); });
  }         // Stufen-Texte der Fähigkeiten
  for (const def of Object.values(CONTENT.events ?? {})) (def.choices ?? []).forEach((c, i) => swap(c, ["label"], { label: EN_CONTENT.events?.[def.id]?.choices?.[i] }));
  for (const [id, story] of Object.entries(CONTENT.stories ?? {})) swap(story, ["lines"], { lines: EN_CONTENT.stories?.[id] });
  if (typeof document !== "undefined" && document.documentElement) document.documentElement.lang = lang;
}

__exports.LANGS = LANGS;
__exports.getLang = getLang;
__exports.t = t;
__exports.translateDom = translateDom;
__exports.applyContentLanguage = applyContentLanguage;

});
__define("ui/theme.js", function (__exports, __require) {
// Namen und Farben für die Oberfläche (keine Emojis, die Symbole kommen aus ui/art).
const { CONTENT } = __require("content/index.js");

const elementColor = (id) => CONTENT.elements[id]?.color ?? "#8a8a9a";
const elementName = (id) => CONTENT.elements[id]?.name ?? id;

// Status -> [Symbol-ID, Name]
const STATUS = {
  gift: ["poison", "Gift"], blutung: ["blood", "Blutung"], verwundbar: ["crack", "Verwundbar"], markiert: ["mark", "Markiert"], ausweichen: ["wind", "Ausweichen"], dornen: ["thorns", "Dornen"], verbrennung: ["flame", "Verbrennung"], aussetzen: ["wind", "Aussetzen"], frost: ["snow", "Kälte"], eingefroren: ["snow", "Eingefroren"],
};
const NODE_ICON = { kampf: "n_kampf", elite: "n_elite", miniboss: "n_miniboss", rast: "n_rast", haendler: "n_haendler", ereignis: "n_ereignis", boss: "n_boss" };
const NODE_NAME = { kampf: "Kampf", elite: "Elite", miniboss: "Mini-Boss", rast: "Rast", haendler: "Händler", ereignis: "Ereignis", boss: "Endboss" };
const RARITY = { gewoehnlich: ["Gewöhnlich", "#9aa4b2"], ungewoehnlich: ["Ungewöhnlich", "#4fc27a"], selten: ["Selten", "#5aa0ff"], legendaer: ["Legendär", "#ffb347"] };
const CLASS_ART = { nahkaempfer: "nahkaempfer", fernkaempfer: "fernkaempfer", magier: "magier" };

// Werte (Brotato-Richtung): Kernwerte in fester Reihenfolge, dazu Spezialwerte der Items
const CORE_STATS = ["maxHp", "regen", "lifesteal", "damagePct", "meleeDmg", "rangedDmg", "elementDmg", "crit", "armor", "dodge", "luck", "ernte"];
const STAT_LABELS = { maxHp: "Max-HP", regen: "Regeneration", lifesteal: "Lebensraub", damagePct: "Schaden", meleeDmg: "Nahkampfschaden", rangedDmg: "Fernkampfschaden", elementDmg: "Elementarschaden", crit: "Krit-Chance", armor: "Rüstung", dodge: "Ausweichen", luck: "Glück", ernte: "Ernte",
  energy: "Energie", handSize: "Handkarten", goldPct: "Gold", blockStart: "Block/Zug", shiny: "Shiny-Chance", reaction: "Reaktionen", freezeEase: "Einfrier-Hilfe", priceMod: "Preise", rerollMod: "Reroll-Preis", freeRerolls: "Freie Rerolls", bossDmg: "Schaden gegen Bosse", poisonPower: "Gift-Stärke", burnPower: "Brenn-Stärke", bleedPower: "Blutungs-Stärke", healPct: "Heilung", doubleChance: "Doppel-Gold", curse: "Fluch" };
const PCT_STATS = new Set(["lifesteal", "damagePct", "crit", "dodge", "goldPct", "shiny", "reaction", "priceMod", "rerollMod", "bossDmg", "healPct", "doubleChance"]);
const fmtVal = (k, v) => `${v > 0 ? "+" : ""}${v}${PCT_STATS.has(k) ? "%" : ""}`;                       // +3% bzw. -2 (Prozent direkt am Wert)
const fmtStat = (k, v) => `${fmtVal(k, v)} ${STAT_LABELS[k] ?? k}`;                                       // +3% Lebensraub
const STAT_ICON = { maxHp: "heart", regen: "s_regen", lifesteal: "s_drop", damagePct: "s_up", meleeDmg: "s_fist", rangedDmg: "s_arrow", elementDmg: "s_orb", crit: "s_crit", armor: "shield", dodge: "wind", luck: "s_clover", ernte: "s_wheat",
  energy: "bolt", handSize: "pile", goldPct: "coin", blockStart: "shield", shiny: "star", reaction: "s_orb", freezeEase: "snow", priceMod: "coin", rerollMod: "s_dice", freeRerolls: "s_dice", bossDmg: "skull", poisonPower: "poison", burnPower: "flame", bleedPower: "blood", healPct: "plus", doubleChance: "s_coins", curse: "s_curse" };

const STAT_DESC = { maxHp: "Mehr Lebenspunkte.", regen: "Heilung nach jedem Kampf.", lifesteal: "Heilt dich um einen Teil deines Kartenschadens.", damagePct: "Alle Karten machen mehr Schaden.", meleeDmg: "Mehr Schaden mit Nahkampfkarten.", rangedDmg: "Mehr Schaden mit Fernkampfkarten.", elementDmg: "Mehr Schaden mit Element- und Zauberkarten.", crit: "Chance auf einen kritischen Treffer (x1,5 Schaden).", armor: "Gegner machen weniger Schaden (15 Rüstung = halber Schaden).", dodge: "Chance, dass ein Angriff danebengeht (höchstens 60 %).", luck: "Bessere Seltenheiten bei Belohnungen und im Shop.", ernte: "Festes Gold nach jedem Kampf." };
const TIER_NAME = ["I", "II", "III", "IV"];
const TIER_COLOR = ["#9aa0a6", "#4a8fd8", "#a45bd6", "#e8a33d"];

const NODE_INFO = { kampf: "Normale Gegner. Du bekommst Gold, eine Karte zur Wahl und manchmal ein Item.", elite: "Ein starker Gegner. Dafür gibt es mehr Gold und sicher ein Item.", miniboss: "Ein sehr starker Gegner. Dafür gibt es eine Waffe zur Wahl, ein Item und viel Gold.",
  rast: "Ein Lagerfeuer: Heile dich oder entferne eine Karte aus deinem Deck.", haendler: "Hier kaufst du Karten, Items und Dienste (Verband, Stärkungstrank). Gold ausgeben lohnt sich.", ereignis: "Eine Begegnung mit einer Wahl. Sie kann dir nützen oder etwas kosten.", boss: "Der Endboss. Besiegst du ihn, gewinnst du den Run." };


__exports.elementColor = elementColor;
__exports.elementName = elementName;
__exports.STATUS = STATUS;
__exports.NODE_ICON = NODE_ICON;
__exports.NODE_NAME = NODE_NAME;
__exports.RARITY = RARITY;
__exports.CLASS_ART = CLASS_ART;
__exports.CORE_STATS = CORE_STATS;
__exports.STAT_LABELS = STAT_LABELS;
__exports.PCT_STATS = PCT_STATS;
__exports.fmtVal = fmtVal;
__exports.fmtStat = fmtStat;
__exports.STAT_ICON = STAT_ICON;
__exports.STAT_DESC = STAT_DESC;
__exports.TIER_NAME = TIER_NAME;
__exports.TIER_COLOR = TIER_COLOR;
__exports.NODE_INFO = NODE_INFO;

});
__define("engine/map.js", function (__exports, __require) {
// Dungeon-Karte: Ebenen mit verzweigten Pfaden, Abkürzungen (Run-Länge hängt vom Weg ab) und Pflicht-Ebenen.
const { CONFIG } = __require("data/config.js");

// Lage eines Knotens: x = Ebene, y = Spur (gleich wie in der Ansicht), damit "keine Kreuzungen" wirklich so gezeichnet wird
const lane = (len, idx) => (idx + 1) / (len + 1);
const same = (p, q) => p.x === q.x && p.y === q.y;
const orient = (a, b, c) => Math.sign((b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x));
const cross = (a, b, c, d) => orient(a, b, c) * orient(a, b, d) < 0 && orient(c, d, a) * orient(c, d, b) < 0;
const findNodeIn = (layers, boss, id) => (id === "boss" ? boss : layers.flat().find((n) => n.id === id));
function generateMap(rng) {
  const M = CONFIG.map, L = M.layers;
  const layers = [];
  for (let l = 0; l < L; l++) {
    const n = l === 0 ? 1 : M.width[0] + Math.floor(rng.next() * (M.width[1] - M.width[0] + 1));   // Ebene 0: fester Start
    layers.push(Array.from({ length: n }, (_, i) => ({ id: `l${l}n${i}`, layer: l, index: i, type: null, next: [] })));
  }
  const boss = { id: "boss", layer: L, index: 0, type: "boss", next: [] };
  const link = (from, to) => { if (!from.next.includes(to.id)) from.next.push(to.id); };

  // Verbindungen zur nächsten Ebene OHNE Kreuzungen: ein zufälliger monotoner Weg durch beide Ebenen (von oben nach unten), jeder Knoten hat so einen Ein- und einen Ausgang
  for (let l = 0; l < L - 1; l++) {
    const a = layers[l], b = layers[l + 1];
    let i = 0, j = 0; link(a[0], b[0]);
    while (i < a.length - 1 || j < b.length - 1) {
      const opts = [];
      if (i < a.length - 1) opts.push("i"); if (j < b.length - 1) opts.push("j"); if (i < a.length - 1 && j < b.length - 1) opts.push("ij", "ij");
      const m = opts[Math.floor(rng.next() * opts.length)];
      if (m !== "j") i++; if (m !== "i") j++;
      link(a[i], b[j]);
    }
  }
  layers[L - 1].forEach((n) => n.next.push(boss.id));

  // Abkürzungen: eine Ebene überspringen (nie über die Mini-Boss-Ebene oder die Rast vor dem Boss), aber nur wenn sie keinen Weg kreuzen und an keinem Ort vorbeiführen
  const P = (n) => ({ x: n.layer, y: lane(n.id === "boss" ? 1 : layers[n.layer].length, n.index) });
  const segs = () => layers.flat().flatMap((n) => n.next.map((id) => [P(n), P(findNodeIn(layers, boss, id))]));
  for (let l = 0; l < L - 2; l++) {
    if (l === 0 || l + 1 === M.minibossLayer || l + 1 === L - 1) continue;
    for (const node of layers[l]) {
      if (rng.next() >= M.skipEdgeChance) continue;
      const b = layers[l + 2];
      const j = Math.min(b.length - 1, Math.round((node.index * (b.length - 1)) / Math.max(1, layers[l].length - 1)));
      const A = P(node), C = P(b[j]);
      const passes = layers[l + 1].some((m) => Math.abs((A.y + C.y) / 2 - P(m).y) < 0.08);
      if (!passes && !segs().some(([s, e]) => !(same(s, A) || same(s, C) || same(e, A) || same(e, C)) && cross(A, C, s, e))) link(node, b[j]);
    }
  }

  // Knotentypen: Ebene 0 = Kampf, Mini-Boss-Ebene, Rast vor dem Boss, sonst gewichtet mit Regeln
  const parentsOf = (node) => layers.flat().filter((x) => x.next.includes(node.id));
  const forced = new Map();                                                   // Ebene -> Indizes der garantierten Händler
  for (const l of M.merchantLayers ?? []) {
    const idx = layers[l].map((_, i) => i); for (let i = idx.length - 1; i > 0; i--) { const j = Math.floor(rng.next() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; }
    forced.set(l, new Set(idx.slice(0, Math.max(1, Math.ceil(layers[l].length * (M.merchantShare ?? 0.5))))));
  }
  for (let l = 0; l < L; l++) {
    for (const node of layers[l]) {
      if (l === 0) node.type = "kampf";
      else if (l === M.minibossLayer) node.type = "miniboss";
      else if (l === L - 1) node.type = "rast";
      else if (forced.get(l)?.has(node.index)) node.type = "haendler";           // garantierter Händler
      else if (M.restBeforeMiniboss && l === M.minibossLayer - 1) node.type = "rast";          // Rast vor dem Mini-Boss (dort starben die meisten Läufe)
      else {
        const parentTypes = new Set(parentsOf(node).map((p) => p.type));
        const entries = Object.entries(M.nodeWeights)
          .filter(([type]) => l >= (M.minLayer[type] ?? 0))
          .filter(([type]) => !(["rast", "haendler", "elite"].includes(type) && parentTypes.has(type)))
          .filter(([type]) => !(type === "rast" && l === L - 2))
          .filter(([type]) => !(type === "haendler" && forced.has(l)))                // auf Händler-Ebenen sind die übrigen Orte keine weiteren Händler
          .filter(([type]) => !(type === "rast" && M.restBeforeMiniboss && l === M.minibossLayer - 2))      // keine zwei Rasten hintereinander
          .map(([value, weight]) => ({ value, weight }));
        node.type = rng.weighted(entries);
      }
    }
  }
  return { layers, boss };
}

const findNode = (map, id) => (id === "boss" ? map.boss : map.layers.flat().find((n) => n.id === id));

// Kürzester und längster Weg (Anzahl Knoten inkl. Boss), nützlich für Tests und die UI
function pathLengths(map) {
  const memo = {};
  const walk = (id) => {
    if (memo[id]) return memo[id];
    const node = findNode(map, id);
    if (!node.next.length) return (memo[id] = [1, 1]);
    const sub = node.next.map(walk);
    return (memo[id] = [1 + Math.min(...sub.map((s) => s[0])), 1 + Math.max(...sub.map((s) => s[1]))]);
  };
  const starts = map.layers[0].map((n) => walk(n.id));
  return [Math.min(...starts.map((s) => s[0])), Math.max(...starts.map((s) => s[1]))];
}

__exports.lane = lane;
__exports.cross = cross;
__exports.generateMap = generateMap;
__exports.findNode = findNode;
__exports.pathLengths = pathLengths;

});
__define("engine/modifiers.js", function (__exports, __require) {
// Synergie- und Schadensberechnung. Hier liegt das Herzstück des Build-Systems.
const { CONFIG } = __require("data/config.js");
const { CONTENT } = __require("content/index.js");

const get = (kind, id) => {
  const def = CONTENT.get(kind, id);   // versteht auch Shiny-IDs ("glutstein:s")
  if (!def) throw new Error(`Unbekannte ${kind}-ID: ${id}`);
  return def;
};

// Alle Werte, die Items über "stats" verändern können (werden über alle Items summiert, auch gestapelt).
const STAT_KEYS = ["luck", "maxHp", "energy", "handSize", "goldPct", "regen", "blockStart", "shiny", "reaction", "ernte", "healLoss", "goldDouble", "healToDamage", "freezeEase", "damagePct", "meleeDmg", "rangedDmg", "elementDmg", "crit", "armor", "dodge", "lifesteal", "priceMod", "rerollMod", "freeRerolls", "bossDmg", "poisonPower", "burnPower", "bleedPower", "healPct", "doubleChance", "curse"];   // ernte: Gold nach jedem Kampf, healLoss: Anteil, um den Heilung sinkt

// spec = { deck: [ids], weapon: id, items: [ids] }  ->  Build mit echten Definitionen
function resolveBuild(spec) {
  const cls = spec.classId ? CONTENT.classes[spec.classId] : null;
  // Klassen-Passive (cls.passives, Daten wie bei Items) zählen wie ein verstecktes Item: sie erscheinen nicht in der Ausrüstung, wirken aber in allen Trigger-Ketten
  const classSrc = cls?.passives?.length ? [{ id: `klasse_${cls.id}`, name: cls.passive?.name ?? cls.name, tags: [], stats: {}, passives: cls.passives }] : [];
  const items = [...(spec.items ?? []).map((id) => get("items", id)), ...classSrc];
  return {
    cards: spec.deck.map((id) => get("cards", id)),
    weapon: get("weapons", spec.weapon),
    items,
    stats: Object.fromEntries(STAT_KEYS.map((k) => [k, (spec.stats?.[k] ?? 0) + items.reduce((sum, i) => sum + (i.stats[k] ?? 0), 0)])),
  };
}

// Wie viele Quellen (Karten, Waffe, Items) tragen dieses Tag?
function tagCount(build, tag, scope = "build") {
  const sources = scope === "deck" ? build.cards : [...build.cards, build.weapon, ...build.items];
  return sources.filter((s) => s.tags.includes(tag)).length;
}

// Wie viele verschiedene Typ-Tags (Feuer, Gift, ...) kommen im Build vor?
function distinctTypes(build, scope = "build") {
  const tags = new Set([...CONFIG.typeTags, ...Object.keys(CONTENT.elements)]);
  return [...tags].filter((t) => tagCount(build, t, scope) > 0).length;
}

// Alle Passive von Waffe + Items für einen Trigger, mit eindeutigem Schlüssel.
function passivesFor(build, trigger) {
  const out = [];
  [build.weapon, ...build.items].forEach((src, n) => {
    src.passives.forEach((p, i) => {
      // n = Position im Build, damit gestapelte Items eigene Zähler (maxPerTurn) haben
      if (p.trigger === trigger) out.push({ ...p, key: `${src.id}@${n}:${i}`, sourceName: src.name });
    });
  });
  return out;
}

function conditionsMet(eff, { card, build }) {
  if (eff.cardTag && !card?.tags.includes(eff.cardTag)) return false;
  if (eff.requires && tagCount(build, eff.requires.tag, eff.requires.scope) < eff.requires.count) return false;
  return true;
}

function magnitude(eff, build, ctx = {}) {
  let v = eff.value ?? 0;
  if (eff.perGold) v += Math.floor((ctx.gold ?? 0) / eff.perGold.step) * eff.perGold.value;                  // z. B. +1 je 50 Gold (Börse des Geizkragens)
  if (eff.perHandCard) v *= ctx.hand ?? 0;                                                                // z. B. 1 HP je Karte auf der Hand (Wuchernde Wurzeln)
  if (eff.perMissingHp) v += Math.floor(Math.max(0, (ctx.maxHp ?? 0) - (ctx.hp ?? 0)) / eff.perMissingHp.step) * eff.perMissingHp.value;   // z. B. +0,1 je 5 fehlende HP
  if (eff.perTag) v *= tagCount(build, eff.perTag, eff.scope);
  if (eff.perStat) v *= Math.floor(Math.max(0, build.stats[eff.perStat.stat] ?? 0) / eff.perStat.step);          // z. B. +1 Schaden je 3 Rüstung
  if (eff.perDistinct) v *= distinctTypes(build, eff.scope);
  return eff.cap !== undefined ? Math.min(v, eff.cap) : v;
}

// Element-Multiplikator: Matrix-Wert je Gegner-Element (multipliziert bei Doppel-Elementen),
// dazu gegnerspezifische Overrides (enemy.modifiers) und Item-Effekte (ignore_resist, amplify_weakness).
function elementMultiplier({ element, enemy, build, card }) {
  if (!element) return 1;
  const E = CONFIG.elements;
  const row = CONTENT.matrix[element] ?? {};
  const def = CONTENT.enemies[enemy.id];
  let m = 1;
  for (const el of enemy.elements ?? def.elements) m *= row[el] ?? 1;
  m *= def.modifiers?.[element] ?? 1;
  for (const eff of passivesFor(build, "damage_calc")) {
    if (!conditionsMet(eff, { card, build })) continue;
    if (eff.op === "ignore_resist" && m < 1) m = 1;
    if (eff.op === "amplify_weakness" && m > 1) m += eff.value;
  }
  return Math.min(Math.max(m, E.minMult), E.maxMult);
}

// Schadens-Pipeline (feste Reihenfolge, damit nichts explodiert):
//  1. Basis = base + Waffe * Skalierung (+ Bonus pro Status auf dem Ziel)
//  2. Flache Boni (add) summieren, Soft-Cap ab config.softCapAdd (Überschuss halbiert)
//  3. Prozent-Boni (pct) SUMMIEREN sich (nicht multiplizieren), Max. config.maxMultBonus
//  4. Element-Multiplikator (Stärken/Schwächen/Resistenzen)
//  5. Verwundbar-Multiplikator des Ziels
//  6. xMult (Endmultiplikator, z. B. Krone des Märtyrers), Obergrenze config.balance.maxXMult
function computeDamage({ build, card, action, target, playsBefore = 0, hp = 0, maxHp = 0, gold = 0 }) {
  const B = CONFIG.balance;
  let base = action.base + (action.weaponScale ?? 0) * build.weapon.power;
  if (action.bonusPerStatus) {
    base += (target?.statuses[action.bonusPerStatus.status] ?? 0) * action.bonusPerStatus.value;
  }

  if (action.bonusPerPlay) base += Math.min(playsBefore, B.tempoCap) * action.bonusPerPlay;   // Tempo: Karten, die vorher gespielt wurden
  if ((target?.statuses.markiert ?? 0) > 0) base += B.markBonus;                              // Markierung: +Schaden pro Treffer

  let add = 0, pct = 0, xm = 0, baseAdd = 0;
  for (const eff of passivesFor(build, "damage_calc")) {
    if (eff.op !== "add" && eff.op !== "pct" && eff.op !== "xmult" && eff.op !== "baseadd") continue;
    if (!conditionsMet(eff, { card, build })) continue;
    const m = magnitude(eff, build, { hp, maxHp, gold });
    if (eff.op === "add") add += m; else if (eff.op === "pct") pct += m; else if (eff.op === "baseadd") baseAdd += m; else xm += m;
  }
  { const S = build.stats, tg = card.tags ?? [];                                       // Kernwerte: Nahkampf-, Fernkampf-, Elementarschaden (flach je Treffer) und Schaden % (alles)
    if (tg.includes("nahkampf")) add += S.meleeDmg; if (tg.includes("fernkampf")) add += S.rangedDmg; if ((action.element ?? card.element) || tg.includes("zauber")) add += S.elementDmg;
    pct += S.damagePct / 100; }
  base += baseAdd;                                                // "baseadd": Grundschaden (vor dem weichen Deckel der flachen Boni), z. B. aus Gold
  if (add > B.softCapAdd) add = B.softCapAdd + (add - B.softCapAdd) / 2;
  pct = Math.min(pct, B.maxMultBonus);

  const element = action.element ?? card.element;
  const elem = target ? elementMultiplier({ element, enemy: target, build, card }) : 1;
  const vuln = (target?.statuses.verwundbar ?? 0) > 0 ? B.vulnerableMult : 1;

  const xMult = Math.min(1 + xm, B.maxXMult);                    // xMult: Endmultiplikator, greift NACH Prozent, Element und Verwundbar (Quellen summieren sich, Deckel maxXMult)
  const amount = Math.max(0, Math.floor((base + add) * (1 + pct) * elem * vuln * xMult));
  return { amount, detail: { base, add, pct, elem, vuln, xMult } };
}

__exports.STAT_KEYS = STAT_KEYS;
__exports.resolveBuild = resolveBuild;
__exports.tagCount = tagCount;
__exports.distinctTypes = distinctTypes;
__exports.passivesFor = passivesFor;
__exports.conditionsMet = conditionsMet;
__exports.magnitude = magnitude;
__exports.elementMultiplier = elementMultiplier;
__exports.computeDamage = computeDamage;

});
__define("engine/combat.js", function (__exports, __require) {
// Rundenbasierter Kampf. Der State ist ein einfaches Objekt, die UI liest ihn nur.
const { abilityAt } = __require("engine/abilities.js");
const { CONFIG } = __require("data/config.js");
const { CONTENT } = __require("content/index.js");
const { createRng } = __require("engine/rng.js");
const { resolveBuild, computeDamage, passivesFor, conditionsMet, magnitude } = __require("engine/modifiers.js");

const log = (s, msg) => { if (s.verbose) s.log.push(msg); };
// Strukturierte Ereignisse für Animationen (nur mit verbose, die UI holt sie nach jeder Aktion ab)
const fx = (s, e) => { if (s.verbose) s.fx.push(e); };

const aliveEnemies = (s) => s.enemies.filter((e) => e.hp > 0);
const getIntent = (e) => {
  const p = CONTENT.enemies[e.id].pattern;
  return p[e.patternIdx % p.length];
};

// ---------------------------------------------------------------- Aufbau
// shinyChance: nur für Tests (erzwingt z. B. 1 = jeder Gegner schillert)
const stageMul = ([a, b], stage = 1) => 1 + a * (stage - 1) + b * (stage - 1) ** 2;       // Gegner-Skalierung je Stage

function createCombat({ spec, encounterId, seed = 1, playerHp, verbose = false, shinyChance, difficulty = 0 }) {
  const rng = createRng(seed);
  const build = resolveBuild(spec);
  const maxHp = Math.max(1, (spec.hp ?? CONFIG.player.maxHp) + build.stats.maxHp);
  const state = {
    rng, build, verbose, log: [],
    // Eigener Zufallsstrom für Shiny, damit Shiny-Würfe den Kampfverlauf nie verändern
    shinyRng: createRng((seed ^ 0x9e3779b9) >>> 0),
    shinyChance: shinyChance ?? CONFIG.shiny.enemyChance * (1 + build.stats.shiny),
    shinyKills: [], addCount: 0,
    diff: CONFIG.difficulty[difficulty] ?? CONFIG.difficulty[0], stage: spec.stage ?? 1, bigFight: ["boss", "elite", "miniboss"].includes(CONTENT.encounters[encounterId]?.kind), finalBoss: (spec.stage ?? 1) >= CONFIG.stages.count && CONTENT.encounters[encounterId]?.kind === "boss",
    encounter: CONTENT.encounters[encounterId], waveIndex: -1, turn: 0,
    player: { hp: Math.min(playerHp ?? maxHp, maxHp), maxHp, block: 0, energy: 0, statuses: {} },
    lastElement: null, fx: [], killLog: [], usedItems: [], classPassive: CONTENT.classes[spec.classId]?.passive?.id ?? null, once: {}, overkill: 0, hpLostThisTurn: false, healTriedThisTurn: false,
    gold: spec.gold ?? 0, goldStart: spec.gold ?? 0, goldGained: 0, maxHpGain: 0,    // Gold im Kampf (Börse, Taschendiebstahl, Bestechung) und dauerhafte Max-HP (Photosynthese)
    // Zähler für Erfolge: höchster Einzeltreffer, erlittener Schaden, Karten/Reaktionen pro Zug, höchster Status-Stapel
    metrics: { plays: 0, reactions: 0, reactionIds: [], maxHit: 0, damageTaken: 0, maxPlaysTurn: 0, reactionsTurn: 0, maxReactionsTurn: 0, maxStatus: {}, abilityUses: {}, abilityDamage: {}, fieldDamage: 0 },
    ability: spec.ability ? { id: spec.ability, level: spec.abilityLevel ?? 1, def: abilityAt(spec.ability, spec.abilityLevel ?? 1), cd: 0, form: 0 } : null, field: null,
    piles: {
      draw: rng.shuffle(build.cards.map((def, uid) => ({ uid, def }))),
      hand: [], discard: [], exhaust: [],        // exhaust: verbrauchte Karten (weg bis zum Kampfende)
    },
    enemies: [], counters: {}, playsThisTurn: 0, result: null,
  };
  spawnNextWave(state);
  emit(state, "on_combat_start", {}, 0);
  startPlayerTurn(state);
  return state;
}

function spawnNextWave(s) {
  s.waveIndex++;
  s.enemies = s.encounter.waves[s.waveIndex].map((id, i) =>
    makeEnemy(s, id, `${s.waveIndex}-${i}`, s.shinyRng.next() < s.shinyChance));
  log(s, `--- Welle ${s.waveIndex + 1}: ${s.enemies.map((e) => e.name).join(", ")}`);
}

// Gegner mit Schwierigkeits-Skalierung und Mechaniken (Element-Wechsel, Panzerplatten, Phasen)
function makeEnemy(s, id, uid, shiny) {
  const def = CONTENT.enemies[id];
  const hp = Math.round(def.hp * s.diff.hpMult * stageMul(CONFIG.stageScale.hp, s.stage) * (s.finalBoss ? CONFIG.stageScale.finalHp : 1) * (shiny ? CONFIG.shiny.enemyHpMult : 1) * (1 + 0.02 * (s.build.stats.curse ?? 0)));
  const m = def.mechanics ?? {};
  const e = { uid, id, shiny, name: `${shiny ? "✦ " : ""}${def.name}`, hp, maxHp: hp, block: 0, statuses: {},
              patternIdx: 0, elements: [...def.elements], phasesDone: [] };
  if (m.rotateElement) {
    const c = m.rotateElement.cycle;
    e.rotIdx = 0; e.rotTimer = 0; e.elements = [c[0]]; e.nextElement = c[1 % c.length];
  }
  if (m.plates) { e.plates = m.plates.count; e.plateTimer = 0; }
  return e;
}

// Angekündigte Aktion, Schaden mit Schwierigkeit skaliert
function intentOf(s, e) {
  if ((e.statuses.eingefroren ?? 0) > 0) return { type: "skip", value: 0, frozen: true };   // eingefroren: überspringt die nächste Aktion
  if ((e.statuses.aussetzen ?? 0) > 0) return { type: "skip", value: 0 };       // bestochen: setzt diese Runde aus
  const i = getIntent(e);
  return i.type === "attack" ? { ...i, value: Math.max(1, Math.round(i.value * CONFIG.balance.enemyDmgScale * s.diff.dmgMult * stageMul(CONFIG.stageScale.dmg, s.stage) * (s.finalBoss ? CONFIG.stageScale.finalDmg : 1) * (1 + 0.012 * (s.build.stats.curse ?? 0)))) } : i;
}

function checkPhases(s, e) {
  const phases = CONTENT.enemies[e.id].mechanics?.phases ?? [];
  phases.forEach((ph, i) => {
    if (e.phasesDone.includes(i) || e.hp / e.maxHp > ph.hpBelow) return;
    e.phasesDone.push(i);
    log(s, `  !!! ${ph.text ?? "Phasenwechsel"}`);
    fx(s, { t: "phase", uid: e.uid, text: ph.text });
    for (const id of ph.summon ?? []) {
      const add = makeEnemy(s, id, `add${s.addCount++}`, false);
      s.enemies.push(add);
      fx(s, { t: "summon", uid: add.uid });
    }
    if (ph.setPlates) { e.plates = ph.setPlates; e.plateTimer = 0; }
  });
}

function checkProgress(s) {
  if (s.result) return;
  if (s.player.hp <= 0) { s.result = "lost"; return; }
  if (aliveEnemies(s).length === 0) {
    if (s.waveIndex + 1 < s.encounter.waves.length) spawnNextWave(s);
    else {
      emit(s, "on_combat_victory", {}, 0);                                // Siegesereignis für Passive/Items (vor dem Ergebnis, sonst laufen sie nicht)
      s.result = "won"; fx(s, { t: "victory" });                           // Anzeige: Sieges-Pose
      s.player.hp = Math.min(s.player.maxHp, s.player.hp + ((s.build.stats.healToDamage ?? 0) > 0 ? 0 : healAmount(s, s.build.stats.regen)));   // Regeneration nach dem Kampf (auch sie wird durch healLoss gemindert)
    }
  }
}

// ---------------------------------------------------------------- Karten ziehen
function draw(s, n) {
  for (let i = 0; i < n; i++) {
    if (s.piles.draw.length === 0) {
      s.piles.draw = s.rng.shuffle(s.piles.discard);
      s.piles.discard = [];
    }
    const card = s.piles.draw.pop();
    if (!card) return;
    s.piles.hand.push(card);
  }
}

function startPlayerTurn(s) {
  s.turn++;
  if (s.ability && s.ability.cd > 0) s.ability.cd--;                                      // Cooldown zählt eigene Züge
  if (s.field && --s.field.turnsLeft <= 0) { log(s, `  ${s.field.name} endet`); fx(s, { t: "field", on: false }); s.field = null; }
  s.counters = {};
  s.playsThisTurn = 0;
  s.metrics.reactionsTurn = 0;
  s.player.block = s.build.stats.blockStart;
  s.player.energy = CONFIG.player.startEnergy + s.build.stats.energy;
  s.player.statuses.ausweichen = 0;     // Ausweichen hält nur einen Zug
  s.player.statuses.dornen = 0;         // Dornen wirken in der Gegnerphase und enden mit dem nächsten eigenen Zug
  s.hpLostThisTurn = false;             // "Wenn du diesen Zug HP verloren hast" zählt ab Beginn deines Zuges
  s.healTriedThisTurn = false;          // "Wenn du diesen Zug geheilt wurdest (oder heilen wolltest)"
  s.lastElement = null;                 // Reaktionen gelten nur innerhalb eines Zuges
  log(s, `=== Zug ${s.turn} (HP ${s.player.hp}/${s.player.maxHp})`);
  fx(s, { t: "turn", n: s.turn });
  emit(s, "on_turn_start", {}, 0);
  s.player.block = Math.min(s.player.block, CONFIG.balance.maxTurnStartBlock);          // Gratis-Block pro Zug ist gedeckelt (Block aus Karten nicht)
  draw(s, Math.max(1, CONFIG.player.handSize + s.build.stats.handSize + (s.turn === 1 ? CONFIG.player.openingDraw ?? 0 : 0) - s.piles.hand.length));          // behaltene Karten zählen zur Handgröße
}

// ---------------------------------------------------------------- Schaden / Status
// Heilung wird durch den Stat healLoss gemindert (z. B. Asche-Lunge: -50 %). Gibt die tatsächlich geheilten HP zurück.
const healAmount = (s, v) => Math.max(0, Math.floor(v * (1 + (s.build.stats.healPct ?? 0) / 100) * (1 - Math.min(0.9, s.build.stats.healLoss ?? 0))));
function healPlayer(s, v) {
  if (v > 0) s.healTriedThisTurn = true;                          // auch eine vereitelte Heilung zählt als "geheilt" (Sporenwolke)
  const want = healAmount(s, v), necro = s.build.stats.healToDamage ?? 0;
  if (necro > 0) {                                                // Nekromanten-Pakt: Heilung wird zu 0, ein zufälliger Gegner erleidet den doppelten Wert als Schaden
    const alive = aliveEnemies(s);
    if (want > 0 && alive.length) {
      const target = s.rng.pick(alive), dmg = want * necro;
      log(s, `  Nekromanten-Pakt: Heilung ${want} wird zu ${dmg} Schaden an ${target.name}`);
      dealDamage(s, target, dmg, "Nekromanten-Pakt", { pierce: true });
    }
    return 0;
  }
  const before = s.player.hp;
  s.player.hp = Math.min(s.player.maxHp, before + want);
  const got = s.player.hp - before;
  if (got > 0) fx(s, { t: "heal", amount: got });
  return got;
}
// Gold im Kampf: Midas-Fluch (Stat goldDouble) verdoppelt jeden Gewinn; Verluste (Bestechung) nie unter 0
const goldMult = (stats) => 1 + Math.min(1, stats.goldDouble ?? 0);
function gainGold(s, v) { const real = Math.floor(v * goldMult(s.build.stats)); s.gold += real; s.goldGained += real; log(s, `  +${real} Gold`); return real; }
function loseGold(s, v) { const real = Math.min(s.gold, v); s.gold -= real; log(s, `  -${real} Gold`); return real; }
// Eigener HP-Verlust (Karten, Items): nie tödlich, zählt nicht als erlittener Schaden, löst aber "on_hp_lost" aus
function loseHp(s, v) {
  const before = s.player.hp;
  s.player.hp = Math.max(1, before - v);
  const lost = before - s.player.hp;
  if (lost > 0) { s.hpLostThisTurn = true; log(s, `  Du verlierst ${lost} HP`); fx(s, { t: "phit", amount: lost, blocked: 0 }); emit(s, "on_hp_lost", {}, 0); }
  return lost;
}

function dealDamage(s, enemy, amount, source, { pierce = false, ignoreBlock = false, note = "", depth = 0 } = {}) {
  const wasAlive = enemy.hp > 0;
  // Panzerplatten: Jeder Karten-Treffer (nicht Gift/Blutung/Item-Effekte) zerbricht nur eine Platte
  if (!pierce && enemy.plates > 0) {
    enemy.plates--;
    log(s, `  ${source}: ${enemy.name} Panzerplatte zerbricht (${enemy.plates} übrig)`);
    fx(s, { t: "plate", uid: enemy.uid, left: enemy.plates });
    if (enemy.plates === 0) {
      enemy.plateTimer = 0;
      log(s, `  ${enemy.name}: Panzer gebrochen, 2 Züge verwundbar!`);
      applyStatus(s, enemy, "verwundbar", 2, depth);
    }
    return 0;
  }
  let rest = amount, blocked = 0;
  if (!pierce && !ignoreBlock) {
    blocked = Math.min(enemy.block, rest);
    enemy.block -= blocked;
    rest -= blocked;
  }
  const hpBefore = enemy.hp;
  enemy.hp = Math.max(0, enemy.hp - rest);
  if (s.field) s.metrics.fieldDamage += rest;                                          // Meta: Schaden, während die Sphärenentfaltung aktiv ist
  if (wasAlive && enemy.hp === 0 && rest > hpBefore) s.overkill += rest - hpBefore;      // Überschuss-Schaden beim Töten wird nach dem Kampf zu Gold
  log(s, `  ${source}: ${enemy.name} -${rest}${note}${enemy.hp === 0 ? " (besiegt)" : ` (HP ${enemy.hp})`}`);
  fx(s, { t: "hit", uid: enemy.uid, amount: rest, blocked, pierce, strong: note.includes("sehr"), weak: note.includes("resistent") });
  if (enemy.hp > 0) checkPhases(s, enemy);
  if (wasAlive && enemy.hp === 0) {
    fx(s, { t: "kill", uid: enemy.uid, shiny: enemy.shiny });
    s.killLog.push({ id: enemy.id, shiny: Boolean(enemy.shiny) });
    if (enemy.shiny) { s.shinyKills.push(enemy.id); log(s, `  *** ${enemy.name} war SHINY! ***`); }
    emit(s, "on_kill", { target: enemy }, depth);
  }
  return rest;                                                  // tatsächlich verlorene HP (für Lebensraub)
}

function damagePlayer(s, amount, source, attacker) {
  if ((s.player.statuses.ausweichen ?? 0) > 0) {   // Ausweichen: ein Treffer geht komplett daneben
    s.player.statuses.ausweichen--;
    log(s, `  ${source} verfehlt dich (Ausweichen)`);
    fx(s, { t: "dodge", uid: attacker?.uid });
    return;
  }
  const dd = Math.min(CONFIG.balance.dodgeCap, s.build.stats.dodge ?? 0);                    // Ausweichen (Wert): Chance, dass ein Angriff ganz danebengeht
  if (dd > 0 && s.rng.next() * 100 < dd) { log(s, `  ${source} verfehlt dich (Ausweichwert)`); fx(s, { t: "dodge", uid: attacker?.uid }); s.metrics.dodges = (s.metrics.dodges ?? 0) + 1; return; }
  const ar = s.build.stats.armor ?? 0, K = CONFIG.balance.armorK;                              // Rüstung (Wert): senkt den Schaden vor dem Block, negative Rüstung erhöht ihn
  if (ar !== 0 && amount > 0) amount = Math.max(1, Math.round(ar > 0 ? (amount * K) / (K + ar) : amount * (1 + -ar / K)));
  const absorbed = Math.min(s.player.block, amount);
  s.player.block -= absorbed;
  const lost = amount - absorbed;
  s.player.hp -= lost;
  s.metrics.damageTaken += lost;
  if (lost > 0) s.hpLostThisTurn = true;
  log(s, `  ${source} trifft dich für ${lost} (Block ${absorbed})`);
  fx(s, { t: "phit", uid: attacker?.uid, amount: lost, blocked: absorbed });
  const thorns = s.player.statuses.dornen ?? 0;
  if (thorns > 0 && attacker && attacker.hp > 0) { log(s, `  Dornen treffen ${attacker.name} für ${thorns}`); dealDamage(s, attacker, thorns, "Dornen", { pierce: true }); }
  if (s.player.hp <= 0) { s.result = "lost"; return; }
  if (lost > 0) { emit(s, "on_hp_lost", {}, 0); emit(s, "on_player_hit", { target: attacker }, 0); }
}

function applyStatus(s, enemy, status, stacks, depth) {
  if (status === "aussetzen" && CONTENT.enemies[enemy.id].immune?.includes("aussetzen")) { log(s, `  ${enemy.name} ist unbestechlich`); return; }
  if (status === "aussetzen") { enemy.statuses.aussetzen = 1; log(s, `  ${enemy.name} setzt diese Runde aus`); fx(s, { t: "status", uid: enemy.uid, status, stacks: 1 }); return; }
  enemy.statuses[status] = (enemy.statuses[status] ?? 0) + stacks;
  s.metrics.maxStatus[status] = Math.max(s.metrics.maxStatus[status] ?? 0, enemy.statuses[status]);
  log(s, `  ${enemy.name} +${stacks} ${status}`);
  fx(s, { t: "status", uid: enemy.uid, status, stacks });
  emit(s, "on_status_applied", { target: enemy, status, stacks }, depth + 1);
  if (status === "frost") freezeCheck(s, enemy);
}
// Eis-Mechanik: Kälte sammelt sich; ab freezeThreshold Stapeln friert der Gegner ein und überspringt seine nächste Aktion (Bosse und Feuerwesen sind immun)
const freezeThreshold = (stats) => Math.max(2, CONFIG.balance.freezeAt - (stats.freezeEase ?? 0));
function freezeCheck(s, enemy) {
  const th = freezeThreshold(s.build.stats);
  if ((enemy.statuses.frost ?? 0) < th) return;
  enemy.statuses.frost -= th;
  if (CONTENT.enemies[enemy.id].immune?.includes("eingefroren")) { log(s, `  ${enemy.name} ist immun gegen Kälte`); return; }
  enemy.statuses.eingefroren = 1;
  s.metrics.freezes = (s.metrics.freezes ?? 0) + 1;
  log(s, `  ${enemy.name} friert ein!`);
  fx(s, { t: "status", uid: enemy.uid, status: "eingefroren", stacks: 1 });
}

// ---------------------------------------------------------------- Trigger-Ketten
// Trigger: on_combat_start | on_turn_start | on_turn_end | on_card_played | on_status_applied | on_kill | on_player_hit | on_hp_lost | on_reaction
function emit(s, event, payload, depth) {
  if (depth > CONFIG.balance.maxChainDepth) return;
  for (const eff of passivesFor(s.build, event)) {
    if (s.result) return;
    if (!conditionsMet(eff, { card: payload.card, build: s.build })) continue;
    if (eff.whenStatus && payload.status !== eff.whenStatus) continue;
    const used = s.counters[eff.key] ?? 0;
    if (eff.maxPerTurn !== undefined && used >= eff.maxPerTurn) continue;
    if (eff.everyN && (s.turn - 1) % eff.everyN !== 0) continue;                       // everyN: nur jeden N-ten Zug (1., N+1., ...)
    if (eff.chance !== undefined && s.rng.next() >= eff.chance) continue;
    if (eff.oncePerCombat) { if (s.once[eff.key]) continue; s.once[eff.key] = true; }       // oncePerCombat: nur einmal pro Kampf (z. B. "Erster Zug: 8 Block")
    s.counters[eff.key] = used + 1;
    runPassive(s, eff, payload, depth);
  }
}

function resolveTarget(s, eff, payload) {
  if (eff.target === "event_target" && payload.target) {
    return payload.target.hp > 0 ? payload.target : null;
  }
  const alive = aliveEnemies(s);
  return alive.length ? s.rng.pick(alive) : null;
}

// Aktionen: block | heal | hurt | draw | energy | player_status | damage_all | status_all | damage | status
// Kettenschaden wird bewusst NICHT durch Boni verstärkt (sonst Explosionsgefahr).
function runPassive(s, eff, payload, depth) {
  const P = s.player;
  switch (eff.action) {
    case "block": { const v = magnitude(eff, s.build); P.block += v; log(s, `  ${eff.sourceName}: +${v} Block`); fx(s, { t: "block", amount: v }); return; }
    case "heal":  { const got = healPlayer(s, magnitude(eff, s.build, { hp: P.hp, maxHp: P.maxHp, hand: s.piles.hand.length, gold: s.gold })); if (got > 0) log(s, `  ${eff.sourceName}: +${got} HP`); return; }
    case "hurt":  { loseHp(s, magnitude(eff, s.build, { hp: P.hp, maxHp: P.maxHp })); return; }
    case "draw":  { draw(s, magnitude(eff, s.build)); return; }
    case "energy": { P.energy += magnitude(eff, s.build); return; }
    case "player_status": { P.statuses[eff.status] = (P.statuses[eff.status] ?? 0) + eff.stacks; log(s, `  ${eff.sourceName}: +${eff.stacks} ${eff.status}`); return; }
    case "damage_all": {
      const v = magnitude(eff, s.build);
      for (const t of aliveEnemies(s)) dealDamage(s, t, v, eff.sourceName, { pierce: true, depth: depth + 1 });
      return;
    }
    case "status_all": {
      for (const t of aliveEnemies(s)) applyStatus(s, t, eff.status, eff.stacks, depth);
      return;
    }
  }
  const target = resolveTarget(s, eff, payload);
  if (!target) return;
  if (eff.action === "damage") dealDamage(s, target, magnitude(eff, s.build), eff.sourceName, { pierce: true, depth: depth + 1 });
  if (eff.action === "status") applyStatus(s, target, eff.status, eff.stacks, depth);
}

// ---------------------------------------------------------------- Spieler-Aktionen
// Reaktionen sind Daten (content "reactions"). Stat "reaction" (+%) verstärkt sie. Wirkt für ALLE Klassen.
function triggerReaction(s, a, b, target) {
  const r = CONTENT.reactionFor(a, b);
  if (!r) return;
  const mult = 1 + s.build.stats.reaction / 100;
  s.metrics.reactions++;
  s.metrics.reactionsTurn++;
  s.metrics.maxReactionsTurn = Math.max(s.metrics.maxReactionsTurn, s.metrics.reactionsTurn);
  if (!s.metrics.reactionIds.includes(r.id)) s.metrics.reactionIds.push(r.id);
  log(s, `  *** Reaktion: ${r.name} (${a} + ${b})`);
  fx(s, { t: "reaction", name: r.name, a, b, target: target?.uid });
  for (const eff of r.effects) {
    runPassive(s, {
      ...eff, sourceName: r.name, target: eff.target ?? "event_target",
      value: eff.value !== undefined ? Math.round(eff.value * mult) : undefined,
      stacks: eff.stacks !== undefined ? Math.max(1, Math.round(eff.stacks * mult)) : undefined,
    }, { target }, 0);
  }
  emit(s, "on_reaction", { target, reaction: r }, 0);
}

// Aktion mit Laufzeitwerten: "fromBlock" macht den Schaden vom aktuellen Block abhängig (z. B. Schildstoß), ohne den Block zu verbrauchen
const effectiveAction = (s, a) => {
  if (a.fromBlock) return { ...a, base: Math.min(a.fromBlock.max ?? 99, Math.floor(s.player.block * (a.fromBlock.factor ?? 1))) };
  if (a.fromMissingHp) return { ...a, base: Math.min(a.fromMissingHp.max ?? 999, Math.floor((s.player.maxHp - s.player.hp) * (a.fromMissingHp.factor ?? 1))) };   // Lodernder Schmerz
  return a;
};
// Bedingungen einer Aktion: ifTarget (Ziel trägt Status), ifHpLost / unlessHpLost (HP in diesem Zug verloren)
const actionAllowed = (s, raw, target) =>
  !(raw.ifTarget && !((target?.statuses[raw.ifTarget] ?? 0) > 0)) && !(raw.ifHpLost && !s.hpLostThisTurn) && !(raw.unlessHpLost && s.hpLostThisTurn)
  && !(raw.ifHealed && !s.healTriedThisTurn) && !(raw.unlessHealed && s.healTriedThisTurn);

// Wirkungen einer Karte (oder eines aktiven Items) ausführen. def = { play: [...], element?, tags, name }
function runActions(s, def, chosen) {
  for (const raw of def.play) {
    const action = effectiveAction(s, raw);
    if (!actionAllowed(s, raw, chosen)) continue;     // z. B. Heilung nur, wenn das Ziel blutet, oder Feuersturm nur nach HP-Verlust
    const targets = action.target === "all" ? aliveEnemies(s) : (chosen && chosen.hp > 0 ? [chosen] : []);
    if (action.action === "damage") {
      for (const t of targets) {
        for (let h = 0; h < (action.hits ?? 1); h++) {
          let { amount, detail } = computeDamage({ build: s.build, card: def, action, target: t, playsBefore: s.playsThisTurn - 1, hp: s.player.hp, maxHp: s.player.maxHp, gold: s.gold });
          let crit = false;
          if ((s.build.stats.crit ?? 0) > 0 && s.rng.next() * 100 < s.build.stats.crit) { amount = Math.floor(amount * CONFIG.balance.critMult); crit = true; s.metrics.crits = (s.metrics.crits ?? 0) + 1; }   // kritischer Treffer
          if (s.bigFight && (s.build.stats.bossDmg ?? 0) !== 0) amount = Math.max(0, Math.floor(amount * (1 + s.build.stats.bossDmg / 100)));      // Schaden gegen Bosse, Wächter und Elite
          s.metrics.maxHit = Math.max(s.metrics.maxHit, amount);
          const note = (detail.elem > 1 ? " [sehr effektiv]" : detail.elem < 1 ? " [resistent]" : "") + (crit ? " [KRITISCH]" : "");
          const wasAlive = t.hp > 0;
          if (s.field?.xmult) amount = Math.floor(amount * (1 + s.field.xmult));                 // Sphärenentfaltung: x1,5 Endschaden
          const lost = dealDamage(s, t, amount, def.name, { note, ignoreBlock: Boolean(s.field?.ignoreBlock) });
          const ls = s.build.stats.lifesteal ?? 0;                                                // Lebensraub (Wert): Anteil des Kartenschadens als Heilung, Reste werden gesammelt
          if (ls > 0 && lost > 0) { s.lsAcc = (s.lsAcc ?? 0) + (lost * ls) / 100; const h = Math.floor(s.lsAcc); if (h > 0) { s.lsAcc -= h; healPlayer(s, h); } }
          if (action.lifesteal && lost > 0) healPlayer(s, lost);                                   // Blutsauger-Ranke: Heilung in Höhe des verursachten Schadens
          if (action.onKill && wasAlive && t.hp === 0) gainGold(s, action.onKill.gold);            // Taschendiebstahl: Kopfgeld, wenn DIESE Karte tötet
        }
      }
    } else if (action.action === "block") {
      s.player.block += action.value;
      fx(s, { t: "block", amount: action.value });
    } else if (action.action === "status") {
      for (const t of targets) applyStatus(s, t, action.status, action.stacks, 0);
    } else if (action.action === "multiplyStatus") {
      for (const t of targets) {
        const have = t.statuses[action.status] ?? 0;
        if (have > 0) applyStatus(s, t, action.status, Math.floor(have * (action.factor - 1)), 0);
      }
    } else if (action.action === "draw") {
      draw(s, action.value);
    } else if (action.action === "energy") {
      s.player.energy += action.value;
    } else if (action.action === "gainGold") {                    // Schuldschein: Gold (Midas-Fluch verdoppelt es)
      gainGold(s, action.value);
    } else if (action.action === "payGoldPct") {                // Bestechung: Anteil des aktuellen Goldes zahlen
      const pay = Math.floor(s.gold * action.value);
      if (pay > 0) { log(s, `  Bestechung kostet ${pay} Gold`); loseGold(s, pay); }
    } else if (action.action === "maxHpUp") {                   // Photosynthese: Max-HP dauerhaft (der Lauf übernimmt es nach dem Kampf), die aktuelle HP steigen mit; pro Kampf gedeckelt
      if (s.maxHpGain + action.value <= CONFIG.balance.maxHpGainPerCombat) {
        s.player.maxHp += action.value; s.player.hp += action.value; s.maxHpGain += action.value;
        log(s, `  Max-HP +${action.value}`);
      }
    } else if (action.action === "loseHp") {                   // Pakt-Kosten: nie tödlich, zählt nicht als erlittener Schaden
      loseHp(s, action.value);
    } else if (action.action === "heal") {
      healPlayer(s, action.value);
    } else if (action.action === "playerStatus") {
      s.player.statuses[action.status] = (s.player.statuses[action.status] ?? 0) + action.stacks;
      log(s, `  Du: +${action.stacks} ${action.status}`);
    }
  }

}

// Elementar-Reaktion: zwei verschiedene Elemente nacheinander im selben Zug
function chainReaction(s, def, chosen) {
  if (def.element) {
    if (s.lastElement && s.lastElement !== def.element) triggerReaction(s, s.lastElement, def.element, chosen);
    s.lastElement = def.element;
  }
}

// ---------------------------------------------------------------- Aktive Items (einmal pro Kampf, kosten Energie)
// item.active = { cost, element?, play: [Karten-Aktionen] }. Sie laufen wie eine Karte ohne Hand, lösen aber keine "Karte gespielt"-Effekte aus.
const activeDef = (item) => ({ id: item.id, name: item.name, cost: item.active.cost, element: item.active.element ?? null, tags: ["item", "aktiv"], play: item.active.play, isItem: true });
const activeItems = (s) => s.build.items.map((item, index) => ({ index, item })).filter((x) => x.item.active)
  .map((x) => ({ ...x, def: activeDef(x.item), used: s.usedItems.includes(x.index) }));

// Signatur-Fähigkeit einsetzen: kostet keine Energie, nur einen Cooldown (und je nach Fähigkeit HP oder Gold)
function abilityReady(s) { return Boolean(s.ability && !s.result && s.ability.cd === 0); }
function abilityAffordable(s, margin = 0) {                                       // Autopilot nutzt margin, damit er sich nicht mit HP-Kosten selbst umbringt
  const c = s.ability?.def.cost; return !c || ((!c.gold || s.gold >= c.gold) && (!c.hp || s.player.hp > c.hp + margin));
}
const abilityForm = (a) => (a.def.forms ? a.def.forms[a.form % a.def.forms.length] : a.def);          // aktuelle Form (Stein/Schere/Papier) oder die Fähigkeit selbst
const abilityNeedsAttack = (a) => abilityForm(a).effects.some((e) => e.type === "field");              // Felder lohnen nur mit Angriffskarten
function useAbility(s, targetUid) {
  const a = s.ability;
  if (!a) return { ok: false, reason: "Keine Fähigkeit gewählt" };
  if (s.result) return { ok: false, reason: "Kampf beendet" };
  if (a.cd > 0) return { ok: false, reason: `Noch ${a.cd} Züge Cooldown` };
  const d = a.def;
  if (d.cost?.gold && s.gold < d.cost.gold) return { ok: false, reason: "Zu wenig Gold" };
  const form = abilityForm(a), label = d.forms ? `${d.name}: ${form.name}` : d.name;
  const alive = aliveEnemies(s), target = alive.find((e) => e.uid === targetUid) ?? alive[0];
  a.cd = d.cooldown; a.form++; s.metrics.abilityUses[a.id] = (s.metrics.abilityUses[a.id] ?? 0) + 1;
  if (d.cost?.gold) loseGold(s, d.cost.gold);
  if (d.cost?.hp) loseHp(s, d.cost.hp);                                                    // nie unter 1 HP
  log(s, `> ${label} (Fähigkeit)`);
  fx(s, { t: "play", name: label, tags: [], element: null, target: target?.uid, all: form.effects.some((e) => e.target === "all" || e.type === "field"), ability: true });
  let total = 0;
  for (const e of form.effects) {
    if (s.result) break;
    const foes = aliveEnemies(s);
    if (e.type === "damage") {
      const targets = e.target === "all" ? foes : target && target.hp > 0 ? [target] : [];
      for (let h = 0; h < (e.hits ?? 1); h++) for (const x of targets) {
        if (x.hp <= 0) continue;
        const card = { name: d.name, element: e.element ?? null, tags: [...(e.tags ?? []), ...(e.element ? [e.element] : [])] };
        const { amount } = computeDamage({ build: s.build, card, action: { base: e.base, weaponScale: e.weaponScale, element: e.element }, target: x, playsBefore: s.playsThisTurn, hp: s.player.hp, maxHp: s.player.maxHp, gold: s.gold });
        s.metrics.maxHit = Math.max(s.metrics.maxHit, amount);
        total += dealDamage(s, x, amount, d.name, { ignoreBlock: e.ignoreBlock ?? false }) ?? 0;     // Panzerplatten bleiben ein Treffer-Zähler
        if (e.status && x.hp > 0) applyStatus(s, x, e.status.status, e.status.stacks, 0);
      }
    } else if (e.type === "status") {
      const targets = e.target === "all" ? foes : e.target === "strongest" ? [[...foes].sort((p, q) => q.hp - p.hp)[0]].filter(Boolean) : target ? [target] : [];
      for (const x of targets) applyStatus(s, x, e.status, e.stacks, 0);
    } else if (e.type === "playerStatus") {
      s.player.statuses[e.status] = (s.player.statuses[e.status] ?? 0) + e.stacks; log(s, `  ${label}: +${e.stacks} ${e.status}`);
    } else if (e.type === "heal") healPlayer(s, Math.ceil((s.player.maxHp * e.pct) / 100));
    else if (e.type === "block") { s.player.block += e.value; log(s, `  ${label}: +${e.value} Block`); fx(s, { t: "block", amount: e.value }); }
    else if (e.type === "draw") draw(s, e.value);
    else if (e.type === "field") { s.field = { id: a.id, name: d.name, turnsLeft: e.turns, xmult: e.xmult, ignoreBlock: true }; log(s, `  ${d.name}: ${e.turns} Züge lang ignorieren deine Treffer Block, Endschaden x${1 + e.xmult}`); fx(s, { t: "field", on: true, name: d.name }); }
  }
  s.metrics.abilityDamage[a.id] = (s.metrics.abilityDamage[a.id] ?? 0) + total;
  checkProgress(s);
  return { ok: true };
}

function useItem(s, index, targetUid) {
  if (s.result) return { ok: false, reason: "Kampf beendet" };
  const entry = activeItems(s).find((x) => x.index === index);
  if (!entry) return { ok: false, reason: "Kein aktives Item" };
  if (entry.used) return { ok: false, reason: "Schon benutzt (1x pro Kampf)" };
  if (entry.def.cost > s.player.energy) return { ok: false, reason: "Zu wenig Energie" };
  s.player.energy -= entry.def.cost;
  s.usedItems.push(index);
  log(s, `> ${entry.def.name} (Item)`);
  const alive = aliveEnemies(s);
  const chosen = alive.find((e) => e.uid === targetUid) ?? alive[0];
  fx(s, { t: "play", name: entry.def.name, tags: entry.def.tags, element: entry.def.element, target: chosen?.uid, all: entry.def.play.some((a) => a.target === "all") });
  runActions(s, entry.def, chosen);
  chainReaction(s, entry.def, chosen);
  checkProgress(s);
  return { ok: true };
}

function playCard(s, handIndex, targetUid) {
  if (s.result) return { ok: false, reason: "Kampf beendet" };
  const inst = s.piles.hand[handIndex];
  if (!inst) return { ok: false, reason: "Keine Karte" };
  const def = inst.def;
  if (def.cost > s.player.energy) return { ok: false, reason: "Zu wenig Energie" };
  if (s.playsThisTurn >= CONFIG.balance.maxCardsPerTurn) return { ok: false, reason: "Kartenlimit pro Zug" };

  s.player.energy -= def.cost;
  s.playsThisTurn++;
  s.metrics.plays++;
  s.metrics.maxPlaysTurn = Math.max(s.metrics.maxPlaysTurn, s.playsThisTurn);
  s.piles.hand.splice(handIndex, 1);
  (inst.def.exhaust ? s.piles.exhaust : s.piles.discard).push(inst);       // "Verbrauchen": die Karte ist für den Rest des Kampfes weg
  log(s, `> ${def.name}`);

  const alive = aliveEnemies(s);
  const chosen = alive.find((e) => e.uid === targetUid) ?? alive[0];
  fx(s, { t: "play", name: def.name, tags: def.tags, element: def.element ?? null, target: chosen?.uid, all: def.play.some((a) => a.target === "all") });

  runActions(s, def, chosen);
  chainReaction(s, def, chosen);

  emit(s, "on_card_played", { card: def, target: chosen }, 0);
  checkProgress(s);
  return { ok: true };
}

function toggleKeep(s, index) {                                                       // eine Karte zum Behalten markieren (höchstens eine)
  const card = s.piles.hand[index];
  if (s.result || !card) return { ok: false, reason: "Keine Karte" };
  const was = card.keep; s.piles.hand.forEach((c) => { c.keep = false; }); card.keep = !was;
  return { ok: true, keep: card.keep };
}
function endPlayerTurn(s) {
  if (s.result) return;
  emit(s, "on_turn_end", {}, 0);
  if (s.classPassive === "unbeugsam" && s.player.block > 0) {      // Nahkämpfer: ein Teil des übrigen Blocks wird als Schaden abgegeben (der Block bleibt)
    const target = aliveEnemies(s)[0], dmg = Math.min(CONFIG.balance.unbeugsamCap, Math.floor(s.player.block * CONFIG.balance.unbeugsamPct));
    if (target && dmg > 0) { log(s, `  Unbeugsam: ${dmg} Schaden`); dealDamage(s, target, dmg, "Unbeugsam", { pierce: true }); }
  }
  checkProgress(s);
  if (s.result) return;
  const kept = s.piles.hand.filter((c) => c.keep);                                       // "Behalten": eine markierte Karte bleibt auf der Hand und belegt dort einen Platz
  s.piles.discard.push(...s.piles.hand.filter((c) => !c.keep));
  s.piles.hand = kept; kept.forEach((c) => { c.keep = false; });
  if (kept.length) log(s, `  Behalten: ${kept.map((c) => c.def.name).join(", ")}`);
  enemyPhase(s);
  if (!s.result) startPlayerTurn(s);
}

// ---------------------------------------------------------------- Gegnerphase
function tickStatuses(s, e) {
  const st = e.statuses;
  // Gift: Schaden = Stapel (ignoriert Block), Stapel -1
  if (st.gift > 0) { dealDamage(s, e, st.gift + (s.build.stats.poisonPower ?? 0), "Gift", { pierce: true }); st.gift--; }
  // Blutung: Schaden = Stapel (ignoriert Block), Stapel halbiert
  if (st.blutung > 0 && e.hp > 0) { dealDamage(s, e, st.blutung + (s.build.stats.bleedPower ?? 0), "Blutung", { pierce: true }); st.blutung = Math.floor(st.blutung / 2); }
  // Verbrennung: Schaden = Stapel (ignoriert Block), danach halbiert sich der Stapel
  if (st.verbrennung > 0 && e.hp > 0) { dealDamage(s, e, st.verbrennung + (s.build.stats.burnPower ?? 0), "Verbrennung", { pierce: true }); st.verbrennung = Math.floor(st.verbrennung / 2); }
  if (st.verwundbar > 0) st.verwundbar--;
  if (st.markiert > 0) st.markiert--;
}

function tickMechanics(s, e) {
  const m = CONTENT.enemies[e.id].mechanics ?? {};
  if (m.rotateElement) {
    const { cycle, every } = m.rotateElement;
    if (++e.rotTimer >= every) {
      e.rotTimer = 0;
      e.rotIdx = (e.rotIdx + 1) % cycle.length;
      e.elements = [cycle[e.rotIdx]];
      e.nextElement = cycle[(e.rotIdx + 1) % cycle.length];
      log(s, `  ${e.name} wechselt zu ${cycle[e.rotIdx]}`);
      fx(s, { t: "rotate", uid: e.uid, element: cycle[e.rotIdx] });
    }
  }
  if (m.plates && e.plates === 0 && ++e.plateTimer >= m.plates.regenAfter) {
    e.plates = m.plates.count;
    log(s, `  ${e.name}: Panzerplatten wachsen nach (${e.plates})`);
  }
}

function enemyPhase(s) {
  for (const e of [...s.enemies]) {            // Kopie: beschworene Gegner handeln erst in der nächsten Runde
    if (e.hp <= 0) continue;
    e.block = 0;
    tickStatuses(s, e);
    if (e.hp <= 0) continue;
    if ((e.statuses.aussetzen ?? 0) > 0 || (e.statuses.eingefroren ?? 0) > 0) {        // Bestechung oder Einfrieren: Aktion entfällt, das Muster rückt nicht weiter
      const frozen = (e.statuses.eingefroren ?? 0) > 0;
      e.statuses.aussetzen = 0; e.statuses.eingefroren = 0;
      log(s, `  ${e.name} ${frozen ? "ist eingefroren" : "setzt aus"}`);
      fx(s, { t: "eact", uid: e.uid, kind: "skip", value: 0, hits: 1, frozen });
      if (e.hp > 0) tickMechanics(s, e);
      continue;
    }
    const intent = intentOf(s, e);
    e.patternIdx++;
    fx(s, { t: "eact", uid: e.uid, kind: intent.type, value: intent.value, hits: intent.hits ?? 1 });
    if (intent.type === "attack") {
      for (let h = 0; h < (intent.hits ?? 1); h++) {
        if (e.hp <= 0) break;                       // z. B. durch Dornen im Treffer gefallen
        damagePlayer(s, intent.value, e.name, e);
        if (s.result) return;
      }
    } else if (intent.type === "block") {
      e.block += intent.value;
    }
    if (e.hp > 0) tickMechanics(s, e);
  }
  checkProgress(s);
}

__exports.aliveEnemies = aliveEnemies;
__exports.getIntent = getIntent;
__exports.createCombat = createCombat;
__exports.intentOf = intentOf;
__exports.healAmount = healAmount;
__exports.goldMult = goldMult;
__exports.freezeThreshold = freezeThreshold;
__exports.effectiveAction = effectiveAction;
__exports.actionAllowed = actionAllowed;
__exports.activeDef = activeDef;
__exports.activeItems = activeItems;
__exports.abilityReady = abilityReady;
__exports.abilityAffordable = abilityAffordable;
__exports.abilityForm = abilityForm;
__exports.abilityNeedsAttack = abilityNeedsAttack;
__exports.useAbility = useAbility;
__exports.useItem = useItem;
__exports.playCard = playCard;
__exports.toggleKeep = toggleKeep;
__exports.endPlayerTurn = endPlayerTurn;

});
__define("engine/dex.js", function (__exports, __require) {
// Shiny-Dex: Sammlung aller gefundenen Shinys (reine Daten, die UI speichert sie z. B. in localStorage).
const { CONTENT } = __require("content/index.js");

const createDex = () => ({ shiny: {} });          // Schlüssel: "kind/id", Wert: Anzahl Funde

function recordShiny(dex, kind, id) {
  const key = `${kind}/${id.replace(/:s$/, "")}`;
  const isNew = !dex.shiny[key];
  dex.shiny[key] = (dex.shiny[key] ?? 0) + 1;
  return { isNew, count: dex.shiny[key] };
}

// Fortschritt je Kategorie: wie viele verschiedene Shinys gefunden / insgesamt möglich
function dexProgress(dex) {
  const out = {};
  for (const kind of ["heroes", "cards", "weapons", "items", "enemies"]) {
    const total = Object.keys(kind === "heroes" ? CONTENT.classes : CONTENT[kind]).length;
    const found = Object.keys(dex.shiny).filter((k) => k.startsWith(`${kind}/`)).length;
    out[kind] = { found, total };
  }
  return out;
}

__exports.createDex = createDex;
__exports.recordShiny = recordShiny;
__exports.dexProgress = dexProgress;

});
__define("engine/meta.js", function (__exports, __require) {
// Meta-Fortschritt zwischen Runs: Siege, Freischaltungen, Schwierigkeit, Shiny-Dex.
// Reine Daten (JSON-tauglich), die UI speichert sie z. B. in localStorage.
const { CONFIG } = __require("data/config.js");
const { CONTENT } = __require("content/index.js");
const { createDex } = __require("engine/dex.js");

const createMeta = () => ({
  runs: 0, wins: 0, highestWon: -1, bossKills: 0, unlocked: {}, dex: createDex(),
  // Zähler für Erfolge
  stats: { kills: 0, fightsWon: 0, elites: 0, minibosses: 0, shinyEnemies: 0, winsByClass: {}, winsByWeapon: {}, bestStage: 0, goldTotal: 0, fightsTotal: 0, byClass: {}, maxDiffByClass: {} },
  abilities: {},                                       // je Fähigkeit: Stufe und Zähler (Einsätze, Schaden in der Sphäre), nur hier steigen Stufen auf
  history: [],                                        // die letzten Runs (Held, Sieg, Stage, Kämpfe, Datum)
  // Was schon einmal gefunden/erlebt wurde (Grundlage für "alle Items gefunden" usw.), Schlüssel = Basis-ID ohne Shiny-Endung
  discovered: { items: {}, cards: {}, weapons: {}, enemies: {}, reactions: {} },
  achievements: {},                                   // id -> { at }
  cosmetics: { skin: {}, frame: "default" },          // gewählte Farbvariante je Held und Kartenrahmen
  settings: { speed: 1, manual: false, autoEnd: true, size: "gross", lang: "de" }, // Kampf-Bedienung: Tempo, manuelles Zielen, Zug automatisch beenden
});

// Ergänzt bei älteren Spielständen fehlende Felder (neue Funktionen, alter Fortschritt bleibt erhalten)
function normalizeMeta(meta) {
  const base = createMeta();
  for (const k of Object.keys(base)) {
    if (meta[k] === undefined) meta[k] = base[k];
    else if (base[k] && typeof base[k] === "object" && !Array.isArray(base[k])) meta[k] = { ...base[k], ...meta[k] };
  }
  meta.abilities ??= {};
  for (const id of Object.keys(CONTENT.abilities ?? {})) meta.abilities[id] = { level: 1, uses: 0, damage: 0, fieldDamage: 0, ...(meta.abilities[id] ?? {}) };
  if (!Object.keys(meta.stats.maxDiffByClass ?? {}).length && meta.highestWon >= 0) {        // ältere Spielstände: Schwierigkeit gilt nur für Helden, mit denen schon gewonnen wurde
    meta.stats.maxDiffByClass = {};
    for (const c of Object.keys(meta.stats.winsByClass ?? {})) if (meta.stats.winsByClass[c] > 0) meta.stats.maxDiffByClass[c] = meta.highestWon;
  }
  return meta;
}

const baseId = (id) => String(id).replace(/:s$/, "");
const TOP = new Set(["runs", "wins", "bossKills"]);
const statValue = (meta, name) => (TOP.has(name) ? meta[name] : meta.stats[name]) ?? 0;

// Merkt, dass etwas gefunden wurde. Gibt true zurück, wenn es neu war.
function discover(meta, kind, id) {
  const key = baseId(id);
  if (meta.discovered[kind][key]) return false;
  meta.discovered[kind][key] = true;
  return true;
}

// Nach jedem Kampf: Zähler und Fundliste aktualisieren (auch bei Niederlage zählen besiegte Gegner)
function recordCombat(meta, { killLog, won, kind, reactionIds }) {
  const st = meta.stats;
  st.kills += killLog.length;
  for (const k of killLog) { discover(meta, "enemies", k.id); if (k.shiny) st.shinyEnemies++; }
  if (won) {
    st.fightsWon++;
    if (kind === "elite") st.elites++;
    if (kind === "miniboss") st.minibosses++;
  }
  for (const id of reactionIds ?? []) discover(meta, "reactions", id);
}

// Schwierigkeit n ist erst nach einem Sieg auf Stufe n-1 verfügbar
const maxDifficulty = (meta, classId) => Math.min(CONFIG.difficulty.length - 1, (meta.stats.maxDiffByClass?.[classId] ?? -1) + 1);     // Schwer und Albtraum gelten je Held: erst mit diesem Helden gewinnen

// Ohne meta (Tests, Simulation) ist alles freigeschaltet.
function isUnlocked(meta, kind, def) {
  if (!def.unlock || !meta) return true;
  return Boolean(meta.unlocked[`${kind}/${def.id}`]);
}

function conditionMet(meta, c) {
  switch (c.type) {
    case "wins": return meta.wins >= c.count;
    case "runs": return meta.runs >= c.count;
    case "bossKills": return meta.bossKills >= c.count;
    case "shinies": return Object.keys(meta.dex.shiny).length >= c.count;
    case "achievement": return Boolean(meta.achievements?.[c.id]);
    default: return false;
  }
}

function describeUnlock(c) {
  if (c.type === "achievement") { const a = CONTENT.achievements[c.id]; return a && !a.secret ? `Erfolg: ${a.name}` : "Geheimer Erfolg"; }
  return { wins: `${c.count} Run(s) gewinnen`, runs: `${c.count} Run(s) spielen`, bossKills: `${c.count}x den Endboss besiegen`, shinies: `${c.count} Shiny finden` }[c.type];
}

// Prüft alle Bedingungen, gibt neu Freigeschaltetes zurück
function evaluateUnlocks(meta) {
  const fresh = [];
  for (const kind of ["cards", "weapons", "items", "skins", "frames", "classes"]) {
    for (const d of Object.values(CONTENT[kind])) {
      const key = `${kind}/${d.id}`;
      if (d.unlock && !meta.unlocked[key] && conditionMet(meta, d.unlock)) { meta.unlocked[key] = true; fresh.push({ kind, id: d.id, name: d.name }); }
    }
  }
  return fresh;
}

function recordRun(meta, run, won) {
  meta.runs++;
  const st0 = meta.stats, before0 = maxDifficulty(meta, run.classId), stage = run.stage ?? 1;
  const bc = (st0.byClass[run.classId] ??= { runs: 0, wins: 0, bestStage: 0 }); bc.runs++; if (won) bc.wins++; bc.bestStage = Math.max(bc.bestStage, stage);
  st0.bestStage = Math.max(st0.bestStage ?? 0, stage); st0.goldTotal += run.stats?.goldEarned ?? 0; st0.fightsTotal += run.stats?.fights ?? 0;
  meta.history = [{ classId: run.classId, won: Boolean(won), stage, fights: run.stats?.fights ?? 0, difficulty: run.difficulty ?? 0, at: Date.now() }, ...(meta.history ?? [])].slice(0, 10);
  if (won) {
    meta.wins++;
    meta.bossKills++;
    meta.highestWon = Math.max(meta.highestWon, run.difficulty);
    st0.maxDiffByClass[run.classId] = Math.max(st0.maxDiffByClass[run.classId] ?? -1, run.difficulty ?? 0);
    const st = meta.stats;
    st.winsByClass[run.classId] = (st.winsByClass[run.classId] ?? 0) + 1;
    const w = baseId(run.startWeapon ?? run.weapon);
    st.winsByWeapon[w] = (st.winsByWeapon[w] ?? 0) + 1;
  }
  const after = maxDifficulty(meta, run.classId);
  const unlocks = evaluateUnlocks(meta);
  return { unlocks, newDifficulty: won && after > before0 ? CONFIG.difficulty[after]?.name : null };
}

// ---- Fähigkeiten: Zähler und Meta-Stufen (nie im Run)
function trackAbilities(meta, combat) {                       // nach jedem Kampf: Einsätze und Sphären-Schaden dem Fortschritt zuschlagen
  const a = combat.ability; if (!a) return;
  const m = (meta.abilities[a.id] ??= { level: 1, uses: 0, damage: 0, fieldDamage: 0 });
  m.uses += combat.metrics.abilityUses?.[a.id] ?? 0; m.damage = (m.damage ?? 0) + (combat.metrics.abilityDamage?.[a.id] ?? 0);
  const base = CONTENT.abilities[a.id], effs = [...(base?.effects ?? []), ...(base?.forms ?? []).flatMap((f) => f.effects)];
  if (effs.some((e) => e.type === "field")) m.fieldDamage += combat.metrics.fieldDamage ?? 0;
}
function abilityProgress(meta, id) {                           // Stand und nächste Aufgabe
  const def = CONTENT.abilities[id], m = meta.abilities[id] ?? { level: 1, uses: 0, damage: 0, fieldDamage: 0 }, next = def.levels[m.level - 1];
  if (!next) return { level: m.level, max: true };
  return { level: m.level, max: false, task: next.task, reward: next.reward, goal: next.unlock.count, count: Math.min(next.unlock.count, m[next.unlock.stat] ?? 0), done: (m[next.unlock.stat] ?? 0) >= next.unlock.count };
}
function evaluateAbilityLevels(meta) {                         // Stufen freischalten, wenn die Aufgabe erfüllt ist
  const ups = [];
  for (const id of Object.keys(CONTENT.abilities)) for (let g = 0; g < 5; g++) { const p = abilityProgress(meta, id); if (p.max || !p.done) break; meta.abilities[id].level++; ups.push({ id, level: meta.abilities[id].level }); }
  return ups;
}

__exports.createMeta = createMeta;
__exports.normalizeMeta = normalizeMeta;
__exports.statValue = statValue;
__exports.discover = discover;
__exports.recordCombat = recordCombat;
__exports.maxDifficulty = maxDifficulty;
__exports.isUnlocked = isUnlocked;
__exports.describeUnlock = describeUnlock;
__exports.evaluateUnlocks = evaluateUnlocks;
__exports.recordRun = recordRun;
__exports.trackAbilities = trackAbilities;
__exports.abilityProgress = abilityProgress;
__exports.evaluateAbilityLevels = evaluateAbilityLevels;

});
__define("engine/achievements.js", function (__exports, __require) {
// Erfolge: Bedingungen prüfen, Belohnungen freischalten. Die Erfolge selbst stehen als Daten in content/packs/achievements.js.
const { CONTENT } = __require("content/index.js");
const { statValue, evaluateUnlocks } = __require("engine/meta.js");

const baseOf = (id) => String(id).replace(/:s$/, "");
const wonRun = (ev) => ev.type === "run" && ev.won;
const afterCombat = (ev) => ev.type === "combat";

// Spezialregeln für "besondere Taten". ev = { type: "start" | "combat" | "pickup" | "run", run, combat?, kind?, won? }
const SPECIALS = {
  win_hard: (ev) => wonRun(ev) && ev.run.difficulty >= 1,
  win_nightmare: (ev) => wonRun(ev) && ev.run.difficulty >= 2,
  dex5: (ev, meta) => Object.keys(meta.dex.shiny).length >= 5,
  shiny_hero_start: (ev) => ev.type === "start" && ev.run.shinyHero,
  shiny_hero_win: (ev) => wonRun(ev) && ev.run.shinyHero,
  untouched: (ev) => afterCombat(ev) && ev.won && ["elite", "boss"].includes(ev.kind) && ev.combat.metrics.damageTaken === 0,
  one_turn: (ev) => afterCombat(ev) && ev.won && ev.combat.turn === 1 && ev.combat.encounter.waves.flat().length >= 3,
  big_hit: (ev) => afterCombat(ev) && ev.combat.metrics.maxHit >= 40,
  chain: (ev) => afterCombat(ev) && ev.combat.metrics.maxReactionsTurn >= 3,
  flurry: (ev) => afterCombat(ev) && ev.combat.metrics.maxPlaysTurn >= 10,
  poison25: (ev) => afterCombat(ev) && (ev.combat.metrics.maxStatus.gift ?? 0) >= 25,
  no_purchase_win: (ev) => wonRun(ev) && (ev.run.stats.purchases ?? 0) === 0,
  small_deck_win: (ev) => wonRun(ev) && ev.run.deck.length <= 11,
  stack3: (ev) => {
    const n = {};
    for (const id of ev.run?.items ?? []) { const b = baseOf(id); n[b] = (n[b] ?? 0) + 1; }
    return Object.values(n).some((v) => v >= 3);
  },
  low_hp_win: (ev) => wonRun(ev) && ev.run.hp <= 5,
  rich: (ev) => (ev.run?.gold ?? 0) >= 500,
  alle: (ev, meta) => Object.values(CONTENT.achievements).filter((a) => a.id !== "x_vollendung").every((a) => meta.achievements[a.id]),       // 100 %: alle anderen Erfolge
};
const SPECIAL_NAMES = Object.keys(SPECIALS);

// Alle Dinge einer Sammlung (optional gefiltert), Grundlage für "alle gefunden"
function poolOf(check) {
  const source = CONTENT[check.discovered] ?? {};
  return Object.values(source).filter((d) => (!check.tag || d.tags?.includes(check.tag)) && (!check.rarity || d.rarity === check.rarity)).map((d) => d.id);
}
const mapKeys = (of) => (of === "classes" ? Object.keys(CONTENT.classes) : [...new Set(Object.values(CONTENT.classes).flatMap((c) => c.starterWeapons))]);

// Fortschritt für die Anzeige: { value, target } oder null (Spezialregeln und geheime Erfolge zeigen keinen Fortschritt)
function progressOf(meta, a) {
  const k = a.check;
  if (k.stat) return { value: Math.min(statValue(meta, k.stat), k.min), target: k.min };
  if (k.discovered) {
    const pool = poolOf(k), found = pool.filter((id) => meta.discovered[k.discovered][id]).length;
    return { value: found, target: k.all ? pool.length : k.min };
  }
  if (k.mapAll) {
    const keys = mapKeys(k.of), m = meta.stats[k.mapAll] ?? {};
    return { value: keys.filter((x) => (m[x] ?? 0) > 0).length, target: keys.length };
  }
  return null;
}

function isMet(meta, a, ev) {
  const k = a.check;
  if (k.special) return Boolean(SPECIALS[k.special]?.(ev, meta));
  const p = progressOf(meta, a);
  return Boolean(p) && p.target > 0 && p.value >= p.target;
}

// Prüft alle noch offenen Erfolge. Gibt { achievements: [ids], unlocks: [{kind,id,name}] } der NEU erreichten zurück.
function evaluateAchievements(meta, ev = { type: "state" }, now = Date.now()) {
  const done = [];
  for (const a of Object.values(CONTENT.achievements)) {
    if (meta.achievements[a.id] || !isMet(meta, a, ev)) continue;
    meta.achievements[a.id] = { at: now };
    done.push(a.id);
  }
  // Belohnungen: Inhalte mit unlock { type: "achievement" } werden frei. Der Abgleich läuft immer, so holt ein Update
  // auch Belohnungen nach, die zu schon erreichten Erfolgen neu hinzugekommen sind.
  const unlocks = evaluateUnlocks(meta);
  return { achievements: done, unlocks };
}

// Beschreibung der Belohnung für die Anzeige
function rewardInfo(a) {
  const r = a.reward;
  if (!r) return null;
  const def = CONTENT[r.kind]?.[r.id];
  const label = { items: "Item", weapons: "Waffe", cards: "Karte", skins: "Farbvariante", frames: "Rahmen" }[r.kind];
  return def ? { kind: r.kind, id: r.id, name: def.name, label } : null;
}

__exports.SPECIALS = SPECIALS;
__exports.SPECIAL_NAMES = SPECIAL_NAMES;
__exports.poolOf = poolOf;
__exports.progressOf = progressOf;
__exports.evaluateAchievements = evaluateAchievements;
__exports.rewardInfo = rewardInfo;

});
__define("engine/loot.js", function (__exports, __require) {
// Loot, Belohnungen und Shop. Alles läuft über seed-basierten Zufall (ctx.rng).
//
// ctx = { rng, build (resolveBuild), classId, depth, luck, shinyChance? }
//   luck = build.stats.luck (+ evtl. Run-Bonus), depth = Etage im Run
const { CONFIG } = __require("data/config.js");
const { CONTENT } = __require("content/index.js");
const { rollRarity } = __require("engine/rng.js");
const { tagCount } = __require("engine/modifiers.js");
const { isUnlocked } = __require("engine/meta.js");

const RARITY_ORDER = ["gewoehnlich", "ungewoehnlich", "selten", "legendaer"];
const baseOf = (id) => id.replace(/:s$/, "");

// Seltenheits-Gewichte mit Glück und Tiefe. Gewöhnlich bleibt konstant, Seltenes wird wahrscheinlicher.
function rarityWeights({ luck = 0, depth = 0, stage = 99 }) {
  const L = Math.min(Math.max(luck, 0), CONFIG.luck.maxLuck);
  const out = {};
  for (const [r, { weight }] of Object.entries(CONFIG.rarities)) {
    const factor = 1 + L * (CONFIG.luck.perPoint[r] ?? 0) + depth * (CONFIG.depthBonus[r] ?? 0);
    out[r] = { weight: stage < (CONFIG.rarityMinStage[r] ?? 1) ? 0 : weight * factor };           // zu starke Seltenheit erscheint erst ab ihrer Stage
  }
  return out;
}
const rollRarityFor = (ctx) => rollRarity(ctx.rng, rarityWeights(ctx));

// Shiny-Chance pro Wurf (Schillernder Charme erhöht sie über build.stats.shiny).
const shinyChanceFor = (ctx) => ctx.shinyChance ?? CONFIG.shiny.lootChance * (1 + (ctx.build.stats.shiny ?? 0));

// Tags, von denen der Build genug hat, um "leichte Lenkung" auszulösen.
function dominantTags(build) {
  const all = new Set([...CONFIG.typeTags, ...Object.keys(CONTENT.elements)]);
  return new Set([...all].filter((t) => tagCount(build, t) >= CONFIG.tagBias.minCount));
}
const biasWeight = (def, dominant) =>
  1 + Math.min(CONFIG.tagBias.cap, def.tags.filter((t) => dominant.has(t)).length * CONFIG.tagBias.perMatch);

// Items, die ihr Stapel-Limit erreicht haben, werden nicht mehr angeboten.
function maxedItems(build) {
  const counts = {};
  for (const i of build.items) counts[baseOf(i.id)] = (counts[baseOf(i.id)] ?? 0) + 1;
  return new Set(Object.entries(counts)
    .filter(([id, n]) => n >= (CONTENT.items[id]?.maxStack ?? CONFIG.items.maxStack))
    .map(([id]) => id));
}

function candidates(kind, ctx, rarity, exclude) {
  return Object.values(CONTENT[kind]).filter((d) =>
    d.rarity === rarity && !exclude.has(d.id) && !d.noReward && isUnlocked(ctx.meta, kind, d) &&
    (d.pools.includes("alle") || (CONTENT.classes[ctx.classId]?.cardPools ?? [ctx.classId]).some((p) => d.pools.includes(p))));
}

// Würfelt Seltenheit, dann ein Element aus dem passenden Pool. Gibt es keins, eine Stufe tiefer.
function pickOne(ctx, kind, exclude, biased, minIdx = 0) {
  let idx = Math.max(minIdx, RARITY_ORDER.indexOf(rollRarityFor(ctx)));
  let list = [];
  while (idx >= 0) {
    list = candidates(kind, ctx, RARITY_ORDER[idx], exclude);
    if (list.length) break;
    idx--;
  }
  if (!list.length) return null;
  const dom = biased ? dominantTags(ctx.build) : null;
  return ctx.rng.weighted(list.map((d) => ({ value: d, weight: (d.hero === ctx.classId ? CONFIG.heroItemBias : 1) * (dom ? biasWeight(d, dom) : 1) })));          // Helden-Items erscheinen bei jedem Helden, beim passenden Helden öfter
}

// Jeder gewürfelte Slot kann mit sehr geringer Chance zur Shiny-Variante werden.
const maybeShiny = (ctx, kind, def) =>
  ctx.rng.next() < shinyChanceFor(ctx) ? CONTENT.get(kind, `${def.id}:s`) : def;

function pickMany(ctx, kind, n, wildcards, exclude = new Set()) {
  const out = [];
  const taken = new Set(exclude);
  for (let i = 0; i < n; i++) {
    const def = pickOne(ctx, kind, taken, i < n - wildcards);   // letzte Slots = Wildcards ohne Lenkung
    if (!def) break;
    taken.add(def.id);
    out.push(maybeShiny(ctx, kind, def));
  }
  return out;
}

// ---------------------------------------------------------------- Belohnungen
const generateCardReward = (ctx, n = CONFIG.rewards.cardChoices) =>
  pickMany(ctx, "cards", n, CONFIG.rewards.wildcardSlots);

function generateWeaponChoices(ctx, n = 2) {
  const minIdx = RARITY_ORDER.indexOf(CONFIG.rewards.weaponMinRarity), out = [], taken = new Set([baseOf(ctx.build.weapon.id)]);
  for (let i = 0; i < n; i++) {
    const def = pickOne(ctx, "weapons", taken, i < n - 1, minIdx);   // nie unter der Mindeststufe, nie die getragene Waffe; das erste Angebot passt zum Build, das letzte ist frei (Vielfalt)
    if (!def) break;
    taken.add(def.id); out.push(def);
  }
  return out;
}

const generateItemChoices = (ctx, n = 3) =>
  pickMany(ctx, "items", n, 1, maxedItems(ctx.build));

// Belohnung für einen besiegten Shiny-Gegner: 3 Items zur Auswahl, ALLE in Shiny-Form.
function generateShinyItemChoices(ctx, n = 3) {
  const out = [];
  const taken = maxedItems(ctx.build);
  for (let i = 0; i < n; i++) {
    const def = pickOne(ctx, "items", taken, false, RARITY_ORDER.indexOf(CONFIG.shiny.enemyMinRarity));   // Chrom-Funde haben eine Mindest-Seltenheit (config.shiny.enemyMinRarity)
    if (!def) break;
    taken.add(def.id);
    out.push(CONTENT.get("items", `${def.id}:s`));
  }
  return out;
}

// Chrom-Waffen als Beute für einen Shiny-Gegner: mindestens ungewöhnlich, nie die Waffe, die man schon trägt
function generateShinyWeaponChoices(ctx, n = 2) {
  const out = [], taken = new Set([baseOf(ctx.build.weapon.id)]);
  for (let i = 0; i < n; i++) {
    const def = pickOne(ctx, "weapons", taken, false, RARITY_ORDER.indexOf(CONFIG.shiny.enemyWeaponMinRarity));
    if (!def) break;
    taken.add(def.id);
    out.push(CONTENT.get("weapons", `${def.id}:s`));
  }
  return out;
}

const goldDrop = (ctx, base) => Math.round(base * (1 + (ctx.build.stats.goldPct ?? 0) / 100));

// ---------------------------------------------------------------- Shop
function priceFor(rng, kind, def, inflation = 1) {
  const S = CONFIG.shop;
  const base = S.basePrice[def.rarity] * (kind === "items" ? S.itemFactor : 1) * (def.shiny ? CONFIG.shiny.priceMult : 1) * inflation;      // Inflation: Preise steigen mit jedem abgeschlossenen Kampf
  const jitter = 1 + (rng.next() * 2 - 1) * S.priceVariance;
  return Math.round((base * jitter) / 5) * 5;
}
const slot = (rng, kind, def, inflation = 1) => ({
  kind, id: def.id, name: def.name, rarity: def.rarity, shiny: Boolean(def.shiny),
  price: priceFor(rng, kind, def, inflation), sold: false,
});
// Karten-Schredder: 50 Gold, pauschal +25 Gold für jede bereits entfernte Karte in diesem Run (Shop und Rast zusammen)
const removalCost = (removed) => (removed === 0 ? 0 : CONFIG.shop.removeBase + CONFIG.shop.removeIncrement * (removed - 1));       // das erste Entfernen im Run ist gratis

// Startladen nach dem ersten Kampf: halbe Preise, die Grundkarten der Klasse (z. B. Schild) fest dabei, sonst nur einfache Ware
function generateStartShop(ctx) {
  const S = CONFIG.shop, cls = CONTENT.classes[ctx.classId];
  const cheap = (kind, def) => ({ ...slot(ctx.rng, kind, def), price: Math.max(5, Math.round((priceFor(ctx.rng, kind, def) * S.startDiscount) / 5) * 5) });
  const basics = cls.shopBasics.map((id) => ({ ...cheap("cards", CONTENT.get("cards", id)), fixed: true }));
  const core = cls.coreCards.map((id) => ({ ...slot(ctx.rng, "cards", CONTENT.get("cards", id)), price: 0, core: true }));          // Kernkarten: eine davon gratis
  const pickPlain = (kind, rarities, n, exclude) => {                                   // zufällig aus einfachen Seltenheiten, ohne Wiederholung
    const out = [], taken = new Set(exclude);
    for (let i = 0; i < n; i++) {
      const list = rarities.flatMap((r) => candidates(kind, ctx, r, taken));
      if (!list.length) break;
      const def = ctx.rng.pick(list); taken.add(def.id); out.push(maybeShiny(ctx, kind, def));
    }
    return out;
  };
  const cards = pickPlain("cards", ["gewoehnlich"], Math.max(0, S.cardSlots - basics.length - core.length), [...cls.shopBasics, ...cls.coreCards]).map((d) => cheap("cards", d));
  const items = pickPlain("items", ["gewoehnlich"], S.itemSlots, maxedItems(ctx.build)).map((d) => cheap("items", d));
  return { cards: [...core, ...basics, ...cards], items, removeCost: removalCost(ctx.removedCards ?? 0), removals: 0, rerollCost: S.rerollBase, rerolls: 0, start: true };
}

function generateShop(ctx, quick = false) {
  const S = quick ? { ...CONFIG.shop, cardSlots: CONFIG.shop.quick.cards, itemSlots: CONFIG.shop.quick.items, wildcardCards: 1, wildcardItems: 1 } : CONFIG.shop, infl = ctx.inflation ?? 1;
  // Gesperrte Items der letzten Händlerrunde ("Freeze") kommen zuerst wieder, zu den aktuellen Preisen
  const frozen = (ctx.frozen ?? []).slice(0, S.itemSlots).map((f) => ({ ...slot(ctx.rng, "items", CONTENT.get("items", f.id), infl), frozen: true }));
  const need = S.itemSlots - frozen.length;
  const exclude = new Set([...maxedItems(ctx.build), ...frozen.map((f) => baseOf(f.id))]);
  const fresh = need > 0 ? pickMany(ctx, "items", need, Math.min(S.wildcardItems, need), exclude).map((d) => slot(ctx.rng, "items", d, infl)) : [];
  return {
    cards: pickMany(ctx, "cards", S.cardSlots, S.wildcardCards).map((d) => slot(ctx.rng, "cards", d, infl)),
    items: [...frozen, ...fresh],
    removeCost: removalCost(ctx.removedCards ?? 0), removals: 0,
    rerollCost: Math.max(1, Math.round(S.rerollBase * Math.max(0.2, 1 + (ctx.build?.stats?.rerollMod ?? 0) / 100))), freeRerolls: Math.max(0, Math.floor(ctx.build?.stats?.freeRerolls ?? 0)), rerolls: 0,
    quick,
    services: [{ id: "heal", price: S.services.heal.price, uses: 0 }, { id: "vitality", price: S.services.vitality.price, sold: false }],
  };
}

// Würfelt alle noch NICHT gekauften und NICHT gesperrten Slots neu. Reroll-Falle: Die Kosten verdoppeln sich bei jeder Nutzung (10, 20, 40, 80 ...).
function rerollShop(shop, ctx, run) {
  const free = (shop.freeRerolls ?? 0) > 0;                                       // freie Rerolls (Wert) zuerst, ohne dass die Kosten steigen
  if (!free && run.gold < shop.rerollCost) return { ok: false, reason: "Zu wenig Gold" };
  if (free) shop.freeRerolls--; else { run.gold -= shop.rerollCost; shop.rerollCost = Math.round(shop.rerollCost * CONFIG.shop.rerollMult); }
  shop.rerolls++;
  const infl = ctx.inflation ?? 1;
  const shown = new Set([...shop.cards, ...shop.items].map((s) => baseOf(s.id)));
  for (const [list, kind, wild] of [[shop.cards, "cards", CONFIG.shop.wildcardCards], [shop.items, "items", CONFIG.shop.wildcardItems]]) {
    list.forEach((s, i) => {
      if (s.sold || s.fixed || s.frozen) return;              // verkaufte, feste und gesperrte Slots bleiben
      const exclude = new Set([...shown, ...(kind === "items" ? maxedItems(ctx.build) : [])]);
      const def = pickOne(ctx, kind, exclude, i < list.length - wild);
      if (!def) return;
      shown.add(def.id);
      list[i] = slot(ctx.rng, kind, maybeShiny(ctx, kind, def), infl);
    });
  }
  return { ok: true };
}

// Freeze: sperrt ein Item für die nächste Händlerrunde (und vor Rerolls). Nochmal antippen hebt die Sperre auf.
function toggleFreeze(shop, index) {
  const s = shop.items[index];
  if (!s || s.sold) return { ok: false, reason: "Nicht verfügbar" };
  s.frozen = !s.frozen;
  return { ok: true, frozen: s.frozen };
}

function buy(shop, kind, index, run) {
  const s = shop[kind][index];
  if (!s || s.sold) return { ok: false, reason: "Nicht verfügbar" };
  if (run.gold < s.price) return { ok: false, reason: "Zu wenig Gold" };
  run.gold -= s.price;
  s.sold = true;
  return { ok: true, id: s.id, kind };
}

// Karte aus dem Deck entfernen (Preis steigt mit jeder Nutzung).
function payRemoval(shop, run) {
  const cost = removalCost(run.removedCards ?? 0);
  if (run.gold < cost) return { ok: false, reason: "Zu wenig Gold" };
  run.gold -= cost;
  run.removedCards = (run.removedCards ?? 0) + 1;                 // der Preis hängt an der Anzahl entfernter Karten im ganzen Run
  shop.removeCost = removalCost(run.removedCards);
  shop.removals++;
  return { ok: true };
}

__exports.baseOf = baseOf;
__exports.rarityWeights = rarityWeights;
__exports.rollRarityFor = rollRarityFor;
__exports.shinyChanceFor = shinyChanceFor;
__exports.generateCardReward = generateCardReward;
__exports.generateWeaponChoices = generateWeaponChoices;
__exports.generateItemChoices = generateItemChoices;
__exports.generateShinyItemChoices = generateShinyItemChoices;
__exports.generateShinyWeaponChoices = generateShinyWeaponChoices;
__exports.goldDrop = goldDrop;
__exports.removalCost = removalCost;
__exports.generateStartShop = generateStartShop;
__exports.generateShop = generateShop;
__exports.rerollShop = rerollShop;
__exports.toggleFreeze = toggleFreeze;
__exports.buy = buy;
__exports.payRemoval = payRemoval;

});
__define("engine/run.js", function (__exports, __require) {
// Run-Ablauf als Zustandsmaschine (UI-unabhängig). Der Run besteht nur aus IDs und Zahlen und ist speicherbar.
//
// Phasen (run.phase): intro | map | combat | reward | shop | rest | event | won | lost
// Ein neuer Run beginnt mit "intro" (Geschichte), danach startAdventure: fester erster Kampf, erst dann die Wegwahl.
// Ablauf: availableNodes -> enterNode -> (Kampf spielen -> completeCombat -> takeCard/takeItem/... -> finishReward) usw.
const { CONFIG } = __require("data/config.js");
const { CONTENT } = __require("content/index.js");
const { validStartDeck } = __require("engine/draft.js");
const { createRng } = __require("engine/rng.js");
const { generateMap, findNode } = __require("engine/map.js");
const { resolveBuild } = __require("engine/modifiers.js");
const { createCombat, goldMult } = __require("engine/combat.js");
const { recordShiny } = __require("engine/dex.js");
const { recordRun, discover, recordCombat, isUnlocked, trackAbilities, evaluateAbilityLevels } = __require("engine/meta.js");
const { evaluateAchievements } = __require("engine/achievements.js");
const { generateCardReward, generateItemChoices, generateWeaponChoices, generateShinyItemChoices, generateShop, generateStartShop, rerollShop, toggleFreeze, buy, payRemoval, goldDrop, generateShinyWeaponChoices } = __require("engine/loot.js");

const RARITY_RANK = { gewoehnlich: 0, ungewoehnlich: 1, selten: 2, legendaer: 3 };
const fail = (reason) => ({ ok: false, reason });
const ok = (extra = {}) => ({ ok: true, ...extra });

// ---------------------------------------------------------------- Aufbau
// Shiny-Held: wird beim Run-Start einmal gewürfelt (bewusst NICHT vom Seed abhängig, damit man keine Seeds "farmen" kann).
const rollShinyHero = (rand = Math.random) => rand() < CONFIG.shiny.heroChance;

function createRun({ startDeck, ability, classId = "nahkaempfer", seed = (Date.now() >>> 0), difficulty = 0, meta, weapon, shinyHero = false } = {}) {
  const cls = CONTENT.classes[classId];
  const startWeapon = cls.starterWeapons.includes(weapon) ? weapon : cls.weapon;      // jede Klasse darf jede Startwaffe wählen
  const rng = createRng(seed);
  const run = {
    seed, classId, difficulty, meta, rng, shinyHero: Boolean(shinyHero),
    phase: "intro", map: generateMap(rng), nodeId: null,
    hp: 0, maxHp: 0, bonusMaxHp: 0, gold: CONFIG.run.startGold + (cls.startGold ?? 0), removedCards: 0, frozenItems: [], flags: {},
    deck: validStartDeck(startDeck, classId) ? [...startDeck] : [...cls.deck], weapon: startWeapon, startWeapon, items: [...(cls.items ?? [])],
    skin: pickSkin(meta, classId), achQueue: [], achDone: [],
    pending: { story: "intro" }, seenEncounters: [], usedEvents: [], summary: null, path: [], verbose: false,
    ability: ability ?? CONTENT.classes[classId]?.abilities?.[0] ?? null, xp: 0, level: 0, upStats: {}, pendingLevels: 0, stage: 1, stageFights: 0, stageClear: false, stageNotice: null,
    stats: { fights: 0, elites: 0, minibosses: 0, nodes: 0, shinyEnemies: 0, shinyLoot: 0, goldEarned: 0, purchases: 0 },
  };
  run.maxHp = computeMaxHp(run);
  run.hp = run.maxHp;
  if (run.shinyHero && meta) recordShiny(meta.dex, "heroes", classId);
  if (meta) {                                             // Startausrüstung zählt als gefunden; Erfolge prüfen (z. B. Chrom-Held)
    for (const id of new Set(run.deck)) discover(meta, "cards", id);
    discover(meta, "weapons", startWeapon);
    for (const id of run.items) discover(meta, "items", id);
    queueAch(run, { type: "start" });
  }
  return run;
}

// ---- Erfolge und Funde
// Gewählte Farbvariante des Helden, nur wenn sie zu diesem Helden passt und freigeschaltet ist
function pickSkin(meta, classId) {
  const id = meta?.cosmetics?.skin?.[classId];
  const def = id && CONTENT.skins[id];
  return def && def.hero === classId && isUnlocked(meta, "skins", def) ? id : "default";
}
function queueAch(run, ev) {
  if (!run.meta) return;
  const res = evaluateAchievements(run.meta, { ...ev, run });
  run.achQueue ??= []; run.achDone ??= [];
  for (const id of res.achievements) { run.achQueue.push(id); run.achDone.push(id); }
}
function found(run, kind, id) {
  if (!run.meta) return;
  discover(run.meta, kind, id);
  if (String(id).endsWith(":s") && (kind === "items" || kind === "weapons")) recordShiny(run.meta.dex, kind, id);       // Sammlung: erst wenn man es wirklich gewählt oder gekauft hat
  queueAch(run, { type: "pickup" });
}
// Für die Oberfläche: neu erreichte Erfolge abholen (Meldung einblenden)
const takeNewAchievements = (run) => (run?.achQueue ?? []).splice(0);

const specOf = (run) => {
  const cls = CONTENT.classes[run.classId];
  const stats = { ...cls.stats, luck: (cls.stats.luck ?? 0) + (run.shinyHero ? CONFIG.shiny.heroLuck : 0) };   // Chrom-Held: +1 Glück
  for (const [k, v] of Object.entries(run.upStats ?? {})) stats[k] = (stats[k] ?? 0) + v;                    // Wert-Aufstiege aus Erfahrung
  return { deck: run.deck, weapon: run.weapon, items: run.items, hp: cls.hp + run.bonusMaxHp, stats, classId: run.classId, gold: run.gold, stage: run.stage, ability: run.ability ?? null, abilityLevel: run.meta?.abilities?.[run.ability]?.level ?? 1 };   // hp inkl. dauerhafter Max-HP-Boni (vorher gingen sie im Kampf verloren)
};
const buildOf = (run) => resolveBuild(specOf(run));
const computeMaxHp = (run) => Math.max(1, CONTENT.classes[run.classId].hp + run.bonusMaxHp + buildOf(run).stats.maxHp);
const currentLayer = (run) => (run.nodeId ? findNode(run.map, run.nodeId).layer : 0);
const ctxOf = (run) => {
  const build = buildOf(run);
  return { rng: run.rng, build, classId: run.classId, depth: (run.stage - 1) + currentLayer(run) / 10, stage: run.stage, luck: build.stats.luck + Math.floor((build.stats.curse ?? 0) / 5), meta: run.meta,
    inflation: (1 + CONFIG.stageScale.price * (run.stage - 1) + CONFIG.shop.inflationPerFight * run.stageFights) * (1 - (CONTENT.classes[run.classId].shopDiscount ?? 0)) * Math.max(0.4, 1 + (build.stats.priceMod ?? 0) / 100), removedCards: run.removedCards ?? 0, frozen: run.frozenItems ?? [] };
};

// Neue Max-HP-Boni heilen um den Zuwachs (wie bei Slay the Spire)
function refreshMaxHp(run) {
  const next = computeMaxHp(run);
  if (next > run.maxHp) run.hp += next - run.maxHp;
  run.maxHp = next;
  run.hp = Math.min(run.hp, run.maxHp);
}
const addItem = (run, id) => {
  run.items.push(id); refreshMaxHp(run); found(run, "items", id);
  run.flags ??= {};
  for (const f of CONTENT.get("items", id).flags ?? []) run.flags[f] = true;                    // Items können dauerhafte Run-Flags setzen (Midas-Fluch: noFreeze)
  if (run.flags.noFreeze) { run.frozenItems = []; run.pending?.shop?.items?.forEach((s) => { s.frozen = false; }); }
};
const addCard = (run, id) => { run.deck.push(id); found(run, "cards", id); };
const setWeapon = (run, id) => { run.weapon = id; found(run, "weapons", id); };
function advanceStage(run) {                                                         // nächste Stage: neue Karte, Teil-Heilung, Hinweis
  run.stage++; run.stageClear = false; run.stageFights = 0; run.map = generateMap(run.rng); run.path = []; run.nodeId = null;
  healRun(run, Math.ceil(run.maxHp * CONFIG.stages.heal)); run.stageNotice = run.stage;
}
const backToMap = (run) => { if (run.stageClear) advanceStage(run); run.phase = "map"; run.pending = null; };

// ---------------------------------------------------------------- Start
// Nach der Geschichte: der feste erste Kampf (Ebene 0 hat nur einen Ort)
function startAdventure(run) {
  if (run.phase !== "intro") return fail("Kein Intro aktiv");
  run.phase = "map"; run.pending = null;
  return enterNode(run, run.map.layers[0][0].id);
}

// ---------------------------------------------------------------- Karte
function availableNodes(run) {
  return run.nodeId ? findNode(run.map, run.nodeId).next : run.map.layers[0].map((n) => n.id);
}

function enterNode(run, nodeId) {
  if (run.phase !== "map") return fail("Nicht auf der Karte");
  if (!availableNodes(run).includes(nodeId)) return fail("Knoten nicht erreichbar");
  const node = findNode(run.map, nodeId);
  run.nodeId = nodeId;
  (run.path ??= []).push(nodeId);
  run.stats.nodes++;
  switch (node.type) {
    case "kampf": case "elite": case "miniboss": case "boss":
      return startCombat(run, node.type, node.layer);
    case "rast":
      run.phase = "rest"; run.pending = {};
      return ok({ type: "rast" });
    case "haendler": {
      const shop = generateShop(ctxOf(run));
      countShiny(run, [...shop.cards, ...shop.items].map((s) => ({ id: s.id, kind: s.kind })));
      run.phase = "shop"; run.pending = { shop };
      return ok({ type: "haendler" });
    }
    case "ereignis": return startEvent(run);
  }
  return fail("Unbekannter Knotentyp");
}

// ---------------------------------------------------------------- Kampf
function pickEncounter(run, nodeKind, layer) {
  if (run.stage === 1 && layer === 0 && CONFIG.map.firstEncounter) { run.seenEncounters.push(CONFIG.map.firstEncounter); return CONFIG.map.firstEncounter; }
  const kind = nodeKind === "kampf" ? "normal" : nodeKind;
  const tier = run.stage > 1 || layer >= CONFIG.map.tierSplit ? 2 : 1;
  if (kind === "boss" && run.stage < CONFIG.stages.count) { const id = CONFIG.stages.guards[(run.stage - 1) % CONFIG.stages.guards.length]; run.seenEncounters.push(id); return id; }     // Stage-Wächter
  let list = Object.values(CONTENT.encounters).filter((e) => e.kind === kind && (kind === "normal" ? e.tier === tier : e.tier <= tier || kind === "boss"));
  if (!list.length) list = Object.values(CONTENT.encounters).filter((e) => e.kind === kind);
  const fresh = list.filter((e) => !run.seenEncounters.includes(e.id));
  const id = run.rng.pick(fresh.length ? fresh : list).id;
  run.seenEncounters.push(id);
  return id;
}

function startCombat(run, nodeKind, layer) {
  const encounterId = pickEncounter(run, nodeKind, layer);
  const seed = Math.floor(run.rng.next() * 4294967296);
  const combat = createCombat({ spec: specOf(run), encounterId, seed, playerHp: run.hp, difficulty: run.difficulty, verbose: Boolean(run.verbose) });
  run.pending = { kind: nodeKind, encounterId, combat };
  run.phase = "combat";
  return ok({ type: nodeKind, encounterId });
}

// Aufruf, wenn pending.combat.result gesetzt ist (won/lost)
const xpNeed = (level) => CONFIG.xp.base + CONFIG.xp.step * level;
const xpOf = (enemyId) => Math.max(1, Math.round((CONTENT.enemies[enemyId]?.hp ?? 10) / CONFIG.xp.hpPerXp));
// Vier verschiedene Wert-Angebote; die Stufe (I bis IV) hängt von Level und Glück ab
function makeLevelChoices(run) {
  const U = CONFIG.upgrades, luck = buildOf(run).stats.luck, shift = run.level * U.tierShiftPerLevel + luck * U.tierShiftPerLuck;
  const pool = [...U.stats], out = [];
  while (out.length < 4 && pool.length) {
    const stat = pool.splice(Math.floor(run.rng.next() * pool.length), 1)[0];
    const w = U.tierChance.map((p, i) => Math.max(0.001, p + (i - 1.2) * shift * 0.5)), sum = w.reduce((a, b) => a + b, 0);
    let r = run.rng.next() * sum, tier = 0; while (tier < 3 && r > w[tier]) { r -= w[tier]; tier++; }
    out.push({ stat, tier, value: U.values[stat][tier] });
  }
  return out;
}
function takeLevelUp(run, index) {
  const r = run.pending?.reward, ch = r?.levelChoices?.[index];
  if (run.phase !== "reward" || !ch || run.pendingLevels <= 0) return fail("Ungültige Wahl");
  run.upStats[ch.stat] = (run.upStats[ch.stat] ?? 0) + ch.value; run.pendingLevels--;
  if (ch.stat === "maxHp") { run.maxHp = computeMaxHp(run); run.hp += ch.value; }
  r.levelChoices = run.pendingLevels > 0 ? makeLevelChoices(run) : [];
  return ok({ stat: ch.stat, value: ch.value });
}
function completeCombat(run) {
  if (run.phase !== "combat") return fail("Kein Kampf aktiv");
  const { combat, kind } = run.pending;
  if (!combat.result) return fail("Kampf läuft noch");
  if (run.meta) { trackAbilities(run.meta, combat); const up = evaluateAbilityLevels(run.meta); if (up.length) run.abilityNotice = up; }          // Fähigkeiten: Zähler und Meta-Stufen (auch nach einer Niederlage)
  run.hp = Math.max(0, combat.player.hp);
  run.gold = Math.max(0, run.gold + (combat.gold - combat.goldStart));                       // Gold aus dem Kampf (Taschendiebstahl, Bestechung)
  run.stats.goldEarned += combat.goldGained;
  if (combat.maxHpGain) { run.bonusMaxHp += combat.maxHpGain; run.maxHp = computeMaxHp(run); }  // Photosynthese: dauerhaft (die HP wurden im Kampf schon erhöht)
  run.stats.fights++; run.stageFights++;
  run.xp += Math.round(combat.killLog.reduce((a, k) => a + xpOf(k.id), 0) * (1 + CONFIG.stageScale.xp * (run.stage - 1)));                              // Erfahrung für besiegte Gegner, volle Leiste = Aufstieg
  while (run.xp >= xpNeed(run.level)) { run.xp -= xpNeed(run.level); run.level++; run.pendingLevels++; }
  if (kind === "elite") run.stats.elites++;
  if (kind === "miniboss") run.stats.minibosses++;
  if (run.meta) {                                         // Zähler und Erfolge (auch bei Niederlage zählen besiegte Gegner)
    recordCombat(run.meta, { killLog: combat.killLog, won: combat.result === "won", kind, reactionIds: combat.metrics.reactionIds });
    queueAch(run, { type: "combat", combat, kind, won: combat.result === "won" });
  }

  if (combat.result === "lost") return endRun(run, false);

  for (const id of combat.shinyKills) {
    run.stats.shinyEnemies++;
    if (run.meta) recordShiny(run.meta.dex, "enemies", id);
  }
  if (kind === "boss" && run.stage >= CONFIG.stages.count) return endRun(run, true);

  const ctx = ctxOf(run);
  const [lo, hi] = CONFIG.gold[kind];
  const bonus = combat.shinyKills.length ? CONFIG.shiny.enemyGold : 0;                 // Chrom-Gegner besiegt: Extra-Gold
  const overkillGold = Math.floor(combat.overkill / CONFIG.economy.overkillPerGold);       // Überschuss-Schaden beim Töten
  const harvest = Math.max(0, Math.floor(combat.build.stats.ernte ?? 0));                  // Ernte: festes Einkommen nach jedem Kampf
  const midas = goldMult(combat.build.stats);                                                // Midas-Fluch: verdoppelt das gesamte erhaltene Gold
  const gold = Math.round((goldDrop(ctx, Math.round((lo + Math.floor(run.rng.next() * (hi - lo + 1))) * (1 + CONFIG.stageScale.gold * (run.stage - 1)))) + bonus + overkillGold + harvest) * midas);
  let gold2 = gold; if (run.rng.next() * 100 < (combat.build.stats.doubleChance ?? 0)) gold2 *= 2; gold2 = Math.round(gold2 * (1 + 0.015 * (combat.build.stats.curse ?? 0)));   // Doppel-Gold-Chance und Fluch-Bonus
  run.gold += gold2;
  run.stats.goldEarned += gold2;
  queueAch(run, { type: "state" });                       // z. B. 500 Gold gleichzeitig

  const levelChoices = run.pendingLevels > 0 ? makeLevelChoices(run) : [];
  const reward = { levelChoices, stageClear: kind === "boss", gold: gold2, shinyBonus: bonus, overkillGold, harvest, midas: midas > 1, cards: generateCardReward(ctx).map((d) => d.id), items: [], weapons: [], shinyItems: [], shinyWeapons: [], taken: {} };
  if (kind === "elite" || kind === "miniboss" || run.rng.next() < CONFIG.run.normalItemChance) {
    reward.items = generateItemChoices(ctx).map((d) => d.id);
  }
  if (kind === "miniboss") reward.weapons = generateWeaponChoices(ctx).map((d) => d.id);
  if (combat.shinyKills.length) {
    reward.shinyItems = generateShinyItemChoices(ctx).map((d) => d.id);
    reward.shinyWeapons = generateShinyWeaponChoices(ctx).map((d) => d.id);
  }
  countShiny(run, [
    ...reward.cards.map((id) => ({ id, kind: "cards" })), ...reward.items.map((id) => ({ id, kind: "items" })),
    ...reward.weapons.map((id) => ({ id, kind: "weapons" })),
  ]);
  run.pending = { reward };
  run.phase = "reward";
  return ok({ gold });
}

function countShiny(run, entries) {
  for (const { id, kind } of entries) {
    if (!id.endsWith(":s")) continue;
    run.stats.shinyLoot++;
  }
}

// ---------------------------------------------------------------- Belohnungen (je Liste genau eine Wahl)
function take(run, list, idx, apply) {
  if (run.phase !== "reward") return fail("Keine Belohnung offen");
  const r = run.pending.reward;
  if (r.taken[list]) return fail("Bereits gewählt");
  const id = r[list][idx];
  if (!id) return fail("Ungültige Wahl");
  apply(id);
  r.taken[list] = true;
  return ok({ id });
}
const takeCard = (run, idx) => take(run, "cards", idx, (id) => addCard(run, id));
const takeItem = (run, idx) => take(run, "items", idx, (id) => addItem(run, id));
const takeWeapon = (run, idx) => take(run, "weapons", idx, (id) => setWeapon(run, id));
const takeShinyItem = (run, idx) => take(run, "shinyItems", idx, (id) => addItem(run, id));
const takeShinyWeapon = (run, idx) => take(run, "shinyWeapons", idx, (id) => setWeapon(run, id));
function finishReward(run) {
  if (run.phase !== "reward") return fail("Keine Belohnung offen");
  run.stageClear = Boolean(run.pending.reward.stageClear);                       // Wächter besiegt: nach Beute und Laden beginnt die nächste Stage
  if (!run.startShopDone && run.stats.fights === 1) {          // nach dem ersten (leichten) Kampf: Startladen mit Grundausrüstung
    run.startShopDone = true;
    const shop = generateStartShop(ctxOf(run));
    countShiny(run, [...shop.cards, ...shop.items].map((s) => ({ id: s.id, kind: s.kind })));
    run.phase = "shop"; run.pending = { shop };
    return ok({ startShop: true });
  }
  if (CONFIG.shop.afterFight && run.stats.fights >= 2) {                             // ab dem zweiten Kampf: Schnellladen nach jedem Kampf
    const shop = generateShop(ctxOf(run), true);
    countShiny(run, [...shop.cards, ...shop.items].map((s) => ({ id: s.id, kind: s.kind })));
    run.phase = "shop"; run.pending = { shop };
    return ok({ quickShop: true });
  }
  backToMap(run);
  return ok();
}

// ---------------------------------------------------------------- Rast
// Heilung außerhalb des Kampfes, gemindert durch den Stat healLoss (z. B. Asche-Lunge)
// Anteil der Max-HP, den eine Rast heilt (Klassen können abweichen, z. B. der Aristokrat nur 20 %)
const restPct = (run) => CONTENT.classes[run.classId].restHealPct ?? CONFIG.run.restHealPct;
const healRun = (run, amount) => { run.hp = Math.min(run.maxHp, run.hp + restHealAmount(run, amount)); };
// Wie viel eine Heilung außerhalb des Kampfes wirklich bringt: gemindert durch healLoss, mit Nekromanten-Pakt immer 0
const restHealAmount = (run, amount) => { const st = buildOf(run).stats; return (st.healToDamage ?? 0) > 0 ? 0 : Math.floor(amount * (1 - Math.min(0.9, st.healLoss ?? 0))); };
function restHeal(run) {
  if (run.phase !== "rest") return fail("Nicht an einer Rast");
  healRun(run, Math.ceil(run.maxHp * restPct(run)));
  backToMap(run);
  return ok();
}
function restRemove(run, deckIndex) {
  if (run.phase !== "rest") return fail("Nicht an einer Rast");
  if (run.deck.length <= CONFIG.run.minDeck || !run.deck[deckIndex]) return fail("Karte kann nicht entfernt werden");
  run.deck.splice(deckIndex, 1);
  run.removedCards = (run.removedCards ?? 0) + 1;                // zählt für den Preis des Karten-Schredders mit
  backToMap(run);
  return ok();
}

// ---------------------------------------------------------------- Shop
function shopBuy(run, kind, idx) {
  if (run.phase !== "shop") return fail("Nicht im Shop");
  const res = buy(run.pending.shop, kind, idx, run);
  if (!res.ok) return res;
  run.stats.purchases = (run.stats.purchases ?? 0) + 1;
  if (kind === "cards") addCard(run, res.id); else addItem(run, res.id);
  if (kind === "cards" && run.pending.shop.cards[idx].core) for (const s of run.pending.shop.cards) if (s.core) s.sold = true;          // nur eine Kernkarte gratis
  return res;
}
function shopService(run, id) {                                         // Dienste beim Händler: Verband und Stärkungstrank
  if (run.phase !== "shop") return fail("Nicht im Shop");
  const sv = run.pending.shop.services?.find((s) => s.id === id), S = CONFIG.shop.services;
  if (!sv || sv.sold) return fail("Nicht verfügbar");
  if (run.gold < sv.price) return fail("Zu wenig Gold");
  if (id === "heal") {
    if (run.hp >= run.maxHp) return fail("Du bist bei vollen HP");
    run.gold -= sv.price; sv.uses++; sv.price += S.heal.step; healRun(run, Math.ceil(run.maxHp * S.heal.pct));
  } else {
    run.gold -= sv.price; sv.sold = true; run.maxHp += S.vitality.maxHp; run.hp += S.vitality.maxHp;
  }
  return ok();
}
function shopReroll(run) {
  if (run.phase !== "shop") return fail("Nicht im Shop");
  const res = rerollShop(run.pending.shop, ctxOf(run), run);
  if (res.ok) countShiny(run, [...run.pending.shop.cards, ...run.pending.shop.items].filter((s) => !s.sold).map((s) => ({ id: s.id, kind: s.kind })));
  return res;
}
function shopRemove(run, deckIndex) {
  if (run.phase !== "shop") return fail("Nicht im Shop");
  if (run.deck.length <= CONFIG.run.minDeck || !run.deck[deckIndex]) return fail("Karte kann nicht entfernt werden");
  const res = payRemoval(run.pending.shop, run);
  if (res.ok) run.deck.splice(deckIndex, 1);
  return res;
}
function shopFreeze(run, idx) {
  if (run.phase !== "shop") return fail("Nicht im Shop");
  if (run.flags?.noFreeze) return fail("Midas-Fluch: Sperren ist dauerhaft deaktiviert");
  return toggleFreeze(run.pending.shop, idx);
}
function leaveShop(run) {
  if (run.phase !== "shop") return fail("Nicht im Shop");
  run.frozenItems = run.pending.shop.items.filter((s) => s.frozen && !s.sold).map((s) => ({ id: s.id }));     // gesperrte Items warten auf die nächste Händlerrunde
  backToMap(run);
  return ok();
}

// ---------------------------------------------------------------- Ereignisse
function startEvent(run) {
  const all = Object.keys(CONTENT.events);
  const fresh = all.filter((id) => !run.usedEvents.includes(id));
  const eventId = run.rng.pick(fresh.length ? fresh : all);
  run.usedEvents.push(eventId);
  run.phase = "event";
  run.pending = { eventId };
  return ok({ type: "ereignis", eventId });
}

function itemOfRarity(run, minRarity) {
  const ctx = ctxOf(run);
  for (let i = 0; i < 40; i++) {
    const def = generateItemChoices(ctx, 1)[0];
    if (def && RARITY_RANK[def.rarity] >= RARITY_RANK[minRarity ?? "gewoehnlich"]) return def.id;
  }
  return null;
}
function cardOfRarity(run, minRarity) {
  const ctx = ctxOf(run);
  for (let i = 0; i < 40; i++) {
    const def = generateCardReward(ctx, 1)[0];
    if (def && RARITY_RANK[def.rarity] >= RARITY_RANK[minRarity ?? "gewoehnlich"]) return def.id;
  }
  return null;
}

function applyEffects(run, effects, out) {
  for (const e of effects ?? []) {
    switch (e.type) {
      case "gold": run.gold = Math.max(0, run.gold + e.value); break;
      case "heal": healRun(run, e.value); break;
      case "healPct": healRun(run, Math.ceil(run.maxHp * e.value)); break;
      case "hurt": run.hp = Math.max(1, run.hp - e.value); break;          // Ereignisse töten nie
      case "maxHp": run.bonusMaxHp += e.value; refreshMaxHp(run); break;
      case "gainItem": { const id = itemOfRarity(run, e.minRarity); if (id) { addItem(run, id); out.gained.push(id); } break; }
      case "gainCard": { const id = cardOfRarity(run, e.minRarity); if (id) { addCard(run, id); out.gained.push(id); } break; }
      case "giveItem": addItem(run, e.id); out.gained.push(e.id); break;
      case "giveCard": addCard(run, e.id); out.gained.push(e.id); break;
      case "removeCard":
        if (run.deck.length > CONFIG.run.minDeck) run.deck.splice(Math.floor(run.rng.next() * run.deck.length), 1);
        break;
      case "gamble": {
        const win = run.rng.next() < e.chance;
        out.gambled = win ? "gewonnen" : "verloren";
        applyEffects(run, win ? e.win : e.lose, out);
        break;
      }
      case "fight": out.fight = e.kind ?? "kampf"; break;
    }
  }
}

function eventChoose(run, choiceIdx) {
  if (run.phase !== "event") return fail("Kein Ereignis aktiv");
  const ev = CONTENT.events[run.pending.eventId];
  const choice = ev.choices[choiceIdx];
  if (!choice) return fail("Ungültige Wahl");
  if (choice.requires?.gold > run.gold) return fail("Zu wenig Gold");
  const out = { gained: [] };
  applyEffects(run, choice.effects, out);
  if (out.fight) return { ...startCombat(run, out.fight, currentLayer(run)), ...out };
  backToMap(run);
  return ok(out);
}

// ---------------------------------------------------------------- Ende, Speichern
function endRun(run, won) {
  run.phase = won ? "won" : "lost";
  run.summary = { won, difficulty: run.difficulty, layer: currentLayer(run), stats: { ...run.stats }, items: run.items.length, deck: run.deck.length, meta: null };
  if (run.meta) {
    run.summary.meta = recordRun(run.meta, run, won);
    queueAch(run, { type: "run", won });
  }
  run.summary.achievements = [...(run.achDone ?? [])];
  return ok({ ended: true, won });
}

// ---- Speichern
// SAVE_FORMAT erhöhen, wenn sich der Aufbau des Run-Objekts ändert. Die Inhalts-Signatur ändert sich automatisch,
// sobald Karten, Items, Waffen, Gegner, Begegnungen, Ereignisse, Klassen oder Reaktionen hinzukommen/wegfallen/umbenannt werden.
// Passt ein Spielstand nicht mehr, wird er verworfen statt zu crashen (Freischaltungen/Shinys bleiben).
const SAVE_FORMAT = 2;
function contentSignature() {
  const kinds = ["cards", "weapons", "items", "enemies", "encounters", "events", "classes", "reactions"];
  const text = kinds.map((k) => `${k}:${Object.keys(CONTENT[k]).sort().join(",")}`).join("|");
  let h = 5381;
  for (let i = 0; i < text.length; i++) h = ((h << 5) + h + text.charCodeAt(i)) >>> 0;
  return h.toString(16);
}
const saveError = (reason) => Object.assign(new Error(`Spielstand nicht kompatibel: ${reason}`), { code: "SAVE_INCOMPATIBLE" });

// Prüft einen gespeicherten Run, ohne ihn zu laden. Gibt { ok } oder { ok: false, reason } zurück.
function peekSave(json) {
  try {
    const data = JSON.parse(json);
    if (data.saveFormat !== SAVE_FORMAT) return { ok: false, reason: "älteres Speicherformat" };
    if (data.contentSig !== contentSignature()) return { ok: false, reason: "Inhalte haben sich geändert" };
    if (!CONTENT.classes[data.classId]) return { ok: false, reason: "Klasse existiert nicht mehr" };
    return { ok: true };
  } catch {
    return { ok: false, reason: "Spielstand beschädigt" };
  }
}

// Speichern ist nur zwischen Kämpfen möglich (Kampfzustand wird nicht gespeichert).
function serializeRun(run) {
  if (run.phase === "combat") throw new Error("Im Kampf kann nicht gespeichert werden");
  const { rng, meta, ...rest } = run;
  return JSON.stringify({ ...rest, saveFormat: SAVE_FORMAT, contentSig: contentSignature(), rngState: rng.state() });
}
function loadRun(json, meta) {
  const check = peekSave(json);
  if (!check.ok) throw saveError(check.reason);
  const { rngState, saveFormat, contentSig, ...rest } = JSON.parse(json);
  return { ...rest, rng: createRng(rngState), meta };
}

__exports.rollShinyHero = rollShinyHero;
__exports.createRun = createRun;
__exports.takeNewAchievements = takeNewAchievements;
__exports.specOf = specOf;
__exports.buildOf = buildOf;
__exports.currentLayer = currentLayer;
__exports.ctxOf = ctxOf;
__exports.startAdventure = startAdventure;
__exports.availableNodes = availableNodes;
__exports.enterNode = enterNode;
__exports.xpNeed = xpNeed;
__exports.xpOf = xpOf;
__exports.makeLevelChoices = makeLevelChoices;
__exports.takeLevelUp = takeLevelUp;
__exports.completeCombat = completeCombat;
__exports.takeCard = takeCard;
__exports.takeItem = takeItem;
__exports.takeWeapon = takeWeapon;
__exports.takeShinyItem = takeShinyItem;
__exports.takeShinyWeapon = takeShinyWeapon;
__exports.finishReward = finishReward;
__exports.restPct = restPct;
__exports.restHealAmount = restHealAmount;
__exports.restHeal = restHeal;
__exports.restRemove = restRemove;
__exports.shopBuy = shopBuy;
__exports.shopService = shopService;
__exports.shopReroll = shopReroll;
__exports.shopRemove = shopRemove;
__exports.shopFreeze = shopFreeze;
__exports.leaveShop = leaveShop;
__exports.eventChoose = eventChoose;
__exports.SAVE_FORMAT = SAVE_FORMAT;
__exports.contentSignature = contentSignature;
__exports.peekSave = peekSave;
__exports.serializeRun = serializeRun;
__exports.loadRun = loadRun;

});
__define("engine/autoplay.js", function (__exports, __require) {
// Autopilot für den Kampf: wählt Karten und Ziele. Wird für den Auto-Knopf und für das automatische Zielen beim Antippen benutzt.
// Keine feste Reihenfolge, sondern eine Bewertung: erwarteter Schaden (inkl. Kill-Bonus), nötiger Block, Debuffs, Reaktionen, Kartenzug.
const { CONFIG } = __require("data/config.js");
const { CONTENT } = __require("content/index.js");
const { abilityReady, abilityAffordable, abilityNeedsAttack, aliveEnemies, intentOf, activeItems, effectiveAction, actionAllowed, freezeThreshold } = __require("engine/combat.js");
const { computeDamage } = __require("engine/modifiers.js");

// Braucht die Karte ein einzelnes Ziel? (Flächen-, Block- und Zieh-Karten nicht)
const needsTarget = (def) =>
  def.play.some((a) => ["damage", "status", "multiplyStatus"].includes(a.action) && a.target !== "all");

function hasPlayable(s) {
  if (abilityReady(s)) return true;                                                  // eine bereite Fähigkeit zählt als spielbar (Zug nicht automatisch beenden)
  return s.playsThisTurn < CONFIG.balance.maxCardsPerTurn && s.piles.hand.some((c) => c.def.cost <= s.player.energy);
}

function threat(s) {
  let dmg = 0, hits = 0;
  for (const e of aliveEnemies(s)) {
    const i = intentOf(s, e);
    if (i.type === "attack") { dmg += i.value * (i.hits ?? 1); hits += i.hits ?? 1; }
  }
  return { needBlock: Math.max(0, dmg - s.player.block), hits: Math.max(0, hits - (s.player.statuses.ausweichen ?? 0)) };
}

function statusValue(status, stacks, t, s) {
  const have = t.statuses[status] ?? 0;
  switch (status) {
    case "gift": return (stacks * (stacks + 1) / 2) * 0.75 + (have > 0 ? stacks * 0.5 : 0);   // Gift tickt mit abnehmender Stärke
    case "blutung": return stacks * 1.6;
    case "verwundbar": return have > 1 ? 1 : 4 + stacks;
    case "markiert": return have > 1 ? 0.5 : 3.5;
    case "verbrennung": return stacks * 1.6;
    case "frost": { const need = freezeThreshold(s.build.stats), have = t.statuses.frost ?? 0, i = intentOf(s, t); return have + stacks >= need ? (i.type === "attack" ? i.value * (i.hits ?? 1) + 2 : 3) : stacks * 1.2; }     // friert der Gegner dadurch ein, zählt sein nächster Angriff
    case "aussetzen": { const i = s ? intentOf(s, t) : null; return i && i.type === "attack" ? i.value * (i.hits ?? 1) : 0.5; }     // Bestechung lohnt, wenn der Gegner angreifen würde
    default: return 1;
  }
}

// Wert einer Karte gegen ein bestimmtes Ziel
function cardValue(s, def, target, th) {
  const alive = aliveEnemies(s);
  let v = 0;
  for (const raw of def.play) {
    const a = effectiveAction(s, raw);
    if (!actionAllowed(s, raw, target)) continue;
    if (a.action === "damage") {
      for (const t of a.target === "all" ? alive : [target]) {
        for (let h = 0; h < (a.hits ?? 1); h++) {
          if (t.plates > 0) { v += 2.4; continue; }                                  // Panzerplatten: jeder Treffer zählt, Schaden nicht
          const { amount } = computeDamage({ build: s.build, card: def, action: a, target: t, playsBefore: s.playsThisTurn, hp: s.player.hp, maxHp: s.player.maxHp, gold: s.gold });
          const room = t.hp + t.block;
          v += Math.min(amount, room);
          if (amount >= room) v += 4;                                                // Kill-Bonus
          const necro = s.build.stats.healToDamage ?? 0;
          if (a.lifesteal) v += necro > 0 ? Math.min(amount, room) * necro * 0.5 : Math.min(Math.min(amount, room), s.player.maxHp - s.player.hp) * 0.8;    // Lebensraub (mit Nekromanten-Pakt: Zusatzschaden)
          if (a.onKill && amount >= room) v += a.onKill.gold / 8;                    // Kopfgeld
        }
      }
    } else if (a.action === "block") v += Math.min(a.value, th.needBlock) * 1.15 + (th.needBlock > 0 ? 0 : 0.2);
    else if (a.action === "playerStatus") v += a.status === "dornen" ? a.stacks * Math.max(1, th.hits) * 0.9 : th.hits > 0 ? Math.min(a.stacks, th.hits) * 4 : 0.2;
    else if (a.action === "status") for (const t of a.target === "all" ? alive : [target]) v += statusValue(a.status, a.stacks, t, s);
    else if (a.action === "multiplyStatus") for (const t of a.target === "all" ? alive : [target]) v += (t.statuses[a.status] ?? 0) * 0.9;
    else if (a.action === "draw") v += s.piles.hand.length < 5 ? 2.6 * a.value : a.value;
    if (a.action === "draw" && s.playsThisTurn >= 8) v -= 50;                // keine endlosen Ziehketten: ab der 9. Karte pro Zug lohnt Ziehen nicht mehr
    else if (a.action === "energy") v += 3;
    else if (a.action === "loseHp") v -= (s.player.hp - a.value < s.player.maxHp * 0.3 ? 50 : a.value * 0.35);      // Pakt-Kosten: der Autopilot opfert nie so viele HP, dass er unter 30 % fällt      // Pakt-Kosten: teuer, wenn man wenig HP hat
    else if (a.action === "heal") v += (s.build.stats.healToDamage ?? 0) > 0 ? a.value * s.build.stats.healToDamage * 0.5 : Math.min(a.value, s.player.maxHp - s.player.hp) * (s.player.hp < s.player.maxHp * 0.6 ? 1.3 : 0.15);
    else if (a.action === "payGoldPct") v -= Math.floor(s.gold * a.value) / 10;           // Bestechung kostet Gold
    else if (a.action === "maxHpUp") v += 2;
    else if (a.action === "gainGold") v += a.value / 8;                                              // Gold ist etwas wert
  }
  if (def.element && s.lastElement && s.lastElement !== def.element && CONTENT.reactionFor(s.lastElement, def.element)) v += 6;   // Reaktion
  if (def.element && s.lastElement === def.element) v -= 0.3;
  return v;
}

// Bestes Ziel für eine Karte. focusUid = vom Spieler angetipptes Hauptziel (hat Vorrang, solange es lebt).
function pickTarget(s, def, focusUid) {
  if (!needsTarget(def)) return undefined;
  const alive = aliveEnemies(s);
  if (!alive.length) return undefined;
  const focus = alive.find((e) => e.uid === focusUid);
  if (focus) return focus.uid;
  const th = threat(s);
  let best = alive[0], bestV = -Infinity;
  for (const t of alive) {
    const v = cardValue(s, def, t, th) + (t.hp <= 0 ? -99 : 0) - t.hp * 0.01;       // bei Gleichstand der schwächere zuerst
    if (v > bestV) { bestV = v; best = t; }
  }
  return best.uid;
}

// Aktive Items gibt es nur einmal pro Kampf: nicht in jedem Kleinkampf verbrauchen, sondern in großen Kämpfen oder bei wenig Leben
function itemWorthIt(s, def) {
  const alive = aliveEnemies(s), hpFrac = s.player.hp / s.player.maxHp;
  if (def.play.some((a) => a.action === "heal")) return hpFrac < 0.55;
  const foeHp = alive.reduce((sum, e) => sum + e.hp + e.block, 0);
  return foeHp >= 45 || alive.length >= 3 || hpFrac < 0.5;
}

// Nächster Schritt: { type: "play", index, targetUid } | { type: "item", index, targetUid } | { type: "end" }
function nextAction(s) {
  if (!s.result && abilityReady(s) && aliveEnemies(s).length) {                       // Fähigkeit zuerst: Burst auf den stärksten Gegner, Sphäre nur mit Angriffskarten auf der Hand
    const attack = s.piles.hand.some((c) => c.def.cost <= s.player.energy && c.def.play.some((a) => a.action === "damage"));
    if (abilityAffordable(s, 8) && (!abilityNeedsAttack(s.ability) || attack)) return { type: "ability", targetUid: aliveEnemies(s).sort((a, b) => b.hp - a.hp)[0].uid };
  }
  if (s.result || !hasPlayable(s)) return { type: "end" };
  const th = threat(s);
  let best = null;
  s.piles.hand.forEach((inst, index) => {
    const def = inst.def;
    if (def.cost > s.player.energy) return;
    const targetUid = pickTarget(s, def);
    const target = aliveEnemies(s).find((e) => e.uid === targetUid) ?? aliveEnemies(s)[0];
    if (!target) return;
    const score = cardValue(s, def, target, th) / (def.cost + 0.6);                 // Wert pro Energie
    if (!best || score > best.score) best = { score, index, targetUid };
  });
  // aktive Items als zusätzliche Kandidaten
  let bestItem = null;
  for (const entry of activeItems(s)) {
    if (entry.used || entry.def.cost > s.player.energy || !itemWorthIt(s, entry.def)) continue;
    const targetUid = pickTarget(s, entry.def);
    const target = aliveEnemies(s).find((e) => e.uid === targetUid) ?? aliveEnemies(s)[0];
    if (!target) continue;
    const score = (cardValue(s, entry.def, target, th) / (entry.def.cost + 0.6)) * 0.85;
    if (!bestItem || score > bestItem.score) bestItem = { score, index: entry.index, targetUid };
  }
  if (bestItem && bestItem.score >= 0.9 && (!best || bestItem.score > best.score)) return { type: "item", index: bestItem.index, targetUid: bestItem.targetUid };
  if (!best || best.score < 0.35) return { type: "end" };
  return { type: "play", index: best.index, targetUid: best.targetUid };
}

__exports.needsTarget = needsTarget;
__exports.hasPlayable = hasPlayable;
__exports.pickTarget = pickTarget;
__exports.nextAction = nextAction;

});
__define("ui/util.js", function (__exports, __require) {
// Kleine Helfer für die Oberfläche (kein DOM nötig, daher in Node testbar).
const { CONTENT } = __require("content/index.js");
const { getLang } = __require("ui/i18n.js");

const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const cap = (s) => (s ? s[0].toUpperCase() + s.slice(1) : "");

const { needsTarget: engineNeedsTarget } = __require("engine/autoplay.js");
const needsTarget = engineNeedsTarget;   // gleiche Regel wie im Autopiloten

function nameAny(id) {
  for (const kind of ["items", "cards", "weapons"]) {
    const d = CONTENT.get(kind, id);
    if (d) return d.name;
  }
  return id;
}

// ---- Automatische Beschreibung für Passive (Fallback, wenn kein "text" gepflegt ist)
const TRIGGER = {
  on_combat_start: "Kampfbeginn", on_turn_start: "Zugbeginn", on_turn_end: "Zugende", on_card_played: "Karte gespielt",
  on_status_applied: "Status aufgetragen", on_kill: "Gegner besiegt", on_player_hit: "Du wirst getroffen", on_reaction: "Reaktion", on_hp_lost: "Du verlierst HP", on_combat_victory: "Kampf gewonnen",
};
const TRIGGER_EN = { on_combat_start: "Combat start", on_turn_start: "Start of turn", on_turn_end: "End of turn", on_card_played: "Card played", on_status_applied: "Status applied", on_kill: "Enemy defeated", on_player_hit: "You are hit", on_reaction: "Reaction", on_hp_lost: "You lose HP", on_combat_victory: "Combat won" };
const TAG_EN = { feuer: "Fire", wasser: "Water", pflanze: "Plant", eis: "Ice", gift: "Poison", blut: "Blood", fernkampf: "Ranged", nahkampf: "Melee", zauber: "Spell", block: "Block", angriff: "Attack", flaeche: "Area", item: "Item", waffe: "Weapon" };
const STATUS_EN = { gift: "Poison", markiert: "Marked", blutung: "Bleed", verwundbar: "Vulnerable", verbrennung: "Burn", frost: "Chill", ausweichen: "Dodge", dornen: "Thorns", aussetzen: "Skip" };
const en = () => getLang() === "en";
const tagName = (tg) => (en() ? TAG_EN[tg] ?? cap(tg) : cap(tg));
const stName = (s) => (en() ? STATUS_EN[s] ?? s : s);
function actionText(p) {
  const v = p.value, E = en();
  switch (p.action) {
    case "block": return `${v} Block`;
    case "heal": return E ? `heal ${v} HP` : `heile ${v} HP`;
    case "hurt": return E ? `lose ${v} HP` : `verliere ${v} HP`;
    case "draw": return E ? `draw ${v} card(s)` : `ziehe ${v} Karte(n)`;
    case "energy": return E ? `+${v} Energy` : `+${v} Energie`;
    case "damage": return E ? `${v} damage` : `${v} Schaden`;
    case "damage_all": return E ? `${v} damage to ALL` : `${v} Schaden an ALLE`;
    case "status": return `${p.stacks}x ${stName(p.status)}`;
    case "status_all": return E ? `${p.stacks}x ${stName(p.status)} to ALL` : `${p.stacks}x ${p.status} auf ALLE`;
    case "player_status": return `${p.stacks}x ${stName(p.status)}`;
    default: return "";
  }
}
function describePassive(p) {
  const E = en();
  if (p.trigger === "damage_calc" && p.op === "baseadd" && p.perGold) return E ? `All cards: +${p.perGold.value} base damage per ${p.perGold.step} Gold${p.cap ? ` (max. +${p.cap})` : ""}` : `Alle Karten: +${p.perGold.value} Grundschaden je ${p.perGold.step} Gold${p.cap ? ` (max. +${p.cap})` : ""}`;
  if (p.trigger === "damage_calc" && p.op === "xmult") return p.perMissingHp ? (E ? `Damage x${p.perMissingHp.value} per ${p.perMissingHp.step} missing HP` : `Schaden x${String(p.perMissingHp.value).replace(".", ",")} je ${p.perMissingHp.step} fehlende HP`) : `${E ? "Damage" : "Schaden"} x${1 + (p.value ?? 0)}`;
  if (p.trigger === "damage_calc") {
    const who = p.cardTag ? (E ? `${tagName(p.cardTag)} cards` : `${cap(p.cardTag)}-Karten`) : (E ? "All cards" : "Alle Karten");
    const what = p.op === "add" ? (E ? `+${p.value} damage` : `+${p.value} Schaden`) : p.op === "pct" ? (E ? `+${Math.round(p.value * 100)}% damage` : `+${Math.round(p.value * 100)} % Schaden`)
      : p.op === "ignore_resist" ? (E ? "ignore resistances" : "ignorieren Resistenzen") : (E ? "Weaknesses +" : "Schwächen +") + (p.value ?? "");
    return E ? `${who}: ${what}${p.perTag ? ` per ${tagName(p.perTag)} tag` : ""}${p.cap ? ` (max. ${p.cap})` : ""}${p.requires ? ` from ${p.requires.count} ${tagName(p.requires.tag)} tags` : ""}`
      : `${who}: ${what}${p.perTag ? ` pro ${p.perTag}-Tag` : ""}${p.cap ? ` (max. ${p.cap})` : ""}${p.requires ? ` ab ${p.requires.count} ${p.requires.tag}-Tags` : ""}`;
  }
  const trig = (E ? TRIGGER_EN : TRIGGER)[p.trigger] ?? p.trigger;
  return E ? `${trig}: ${actionText(p)}${p.chance ? ` (${Math.round(p.chance * 100)}%)` : ""}${p.maxPerTurn ? `, max. ${p.maxPerTurn}/turn` : ""}`
    : `${trig}: ${actionText(p)}${p.chance ? ` (${Math.round(p.chance * 100)} %)` : ""}${p.maxPerTurn ? `, max. ${p.maxPerTurn}/Zug` : ""}`;
}
function describeWeapon(def) {
  const parts = [`${en() ? "Power" : "Stärke"} ${def.power}`, ...def.passives.map(describePassive)];
  return parts.join(". ") + ".";
}
const describeItem = (def) => def.text ?? def.passives.map(describePassive).join(". ");

// Welche Farbvariante / welcher Rahmen ist gerade gültig? (nur freigeschaltete, sonst Standard)
function activeSkin(meta, classId) {
  const id = meta?.cosmetics?.skin?.[classId];
  const def = id && CONTENT.skins[id];
  return def && def.hero === classId && meta.unlocked[`skins/${id}`] ? id : "default";
}
const activeFrame = (meta) => {
  const id = meta?.cosmetics?.frame;
  return id && id !== "default" && CONTENT.frames[id] && meta.unlocked[`frames/${id}`] ? id : "default";
};
const skinPal = (id) => CONTENT.skins[id]?.pal;

// Reaktionen in Worten (für die Karten-Info): Wirkung der Effekte
function reactionText(r) {
  const E = getLang() === "en";
  return r.effects.map((e) => ({ damage_all: E ? `${e.value} damage to ALL` : `${e.value} Schaden an ALLE`, damage: E ? `${e.value} damage` : `${e.value} Schaden`, heal: E ? `heal ${e.value} HP` : `heile ${e.value} HP`, block: `${e.value} Block`,
    status: `${e.stacks}x ${stName(e.status)}` }[e.action] ?? e.action)).join(", ");
}

__exports.esc = esc;
__exports.cap = cap;
__exports.needsTarget = needsTarget;
__exports.nameAny = nameAny;
__exports.describePassive = describePassive;
__exports.describeWeapon = describeWeapon;
__exports.describeItem = describeItem;
__exports.activeSkin = activeSkin;
__exports.activeFrame = activeFrame;
__exports.skinPal = skinPal;
__exports.reactionText = reactionText;

});
__define("ui/art/core.js", function (__exports, __require) {
// Pixel-Art-Kern: Text-Raster -> Pixel -> SVG (und PNG für Vorschauen). Keine Bilddateien nötig.
// Jedes Zeichen im Raster ist ein Farbschlüssel, "." ist durchsichtig.

// Feste Farben (gelten in allen Sprites). a-e sind für Paletten reserviert (siehe palettes.js).
const GLOBAL = {
  k: "#17121f", w: "#f2efe6", x: "#2b2433",
  g: "#4a4458", h: "#7d778c", i: "#b6b1c4",
  y: "#b8862b", Y: "#e8b93d", z: "#ffe58a",
  r: "#7a2230", R: "#c73c3c", o: "#e8843a", O: "#ffb35a",
  n: "#5a3b26", N: "#8b5e3c", M: "#c28a54",
  s: "#e0a875", S: "#b07a50", t: "#f3c9a0",
  f: "#2f5f3a", F: "#4f9a4f", G: "#8fd16a",
  u: "#2a4a8a", U: "#4a7fd0", V: "#8cc0ff",
  q: "#4a2a6a", Q: "#8a4fc0", P: "#c79af0",
  j: "#3b8aa8", J: "#bfeaf5",
  m: "#e6dfc9", B: "#b3a98c", D: "#7a705a",
  W: "#2a2540",
};
const DEFAULT_ACCENT = { d: "#b8862b", e: "#ffe58a" };       // d, e = goldener Zierrat, falls eine Palette keinen definiert
const OUTLINE = "#17121f";
const SHINY_OUTLINE = "#0b1328";

// ---------------- Farbhilfen
const h2r = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
function rgb2hsl([r, g, b]) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min, s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  const h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [h * 60, s, l];
}
function hsl2hex([h, s, l]) {
  h = ((h % 360) + 360) % 360;
  const c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs(((h / 60) % 2) - 1)), m = l - c / 2;
  const [r, g, b] = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
  return "#" + [r, g, b].map((v) => Math.round((v + m) * 255).toString(16).padStart(2, "0")).join("");
}
const shift = (hex, dl) => { const [h, s, l] = rgb2hsl(h2r(hex)); return hsl2hex([h, s, Math.max(0, Math.min(1, l + dl))]); };

// ---------------- Shiny = CHROM
// Jede Farbe wird nach ihrer Helligkeit auf eine hart abgestufte Metall-Rampe abgebildet (wie eine spiegelnde Oberfläche).
// Formen und Schattierung bleiben erkennbar. Die Rampe wird leicht in der Grundfarbe des Wesens getönt (grüner Goblin = grünes Chrom),
// dadurch sehen verschiedene Shinys unterschiedlich aus. Graue Wesen bekommen klassisches Stahlblau.
const CHROME = ["#070c1c", "#17254a", "#2f4f8c", "#6489c4", "#a2c0ea", "#dbeaff", "#ffffff"];
const luma = (hex) => { const [r, g, b] = h2r(hex); return (0.299 * r + 0.587 * g + 0.114 * b) / 255; };

function chromeProfile(colors) {
  let sx = 0, sy = 0, w = 0, lmin = 1, lmax = 0;
  for (const c of colors) {
    const [h, s, l] = rgb2hsl(h2r(c)), y = luma(c);
    lmin = Math.min(lmin, y); lmax = Math.max(lmax, y);
    const wt = s * (1 - Math.abs(2 * l - 1));
    sx += Math.cos((h * Math.PI) / 180) * wt; sy += Math.sin((h * Math.PI) / 180) * wt; w += wt;
  }
  const chroma = colors.length ? w / colors.length : 0;
  const hue = ((Math.atan2(sy, sx) * 180) / Math.PI + 360) % 360;
  const amt = chroma < 0.06 ? 0 : Math.min(0.34, 0.1 + chroma * 0.6);         // wie stark die Rampe getönt wird (dezent: bleibt Metall)
  const ramp = CHROME.map((hex) => {
    if (!amt) return hex;
    const [, s0, l0] = rgb2hsl(h2r(hex));
    const s = Math.min(0.42, s0 * 0.4 + 0.45 * amt) * (l0 > 0.85 ? 0.25 : l0 < 0.08 ? 0.6 : 1);
    return hsl2hex([hue, s, l0]);
  });
  return { ramp, lmin, lmax: Math.max(lmax, lmin + 0.05) };
}
// ry = Höhe im Sprite (0 oben, 1 unten). Chrom spiegelt eine Umgebung: oben heller "Himmel", ein scharfer dunkler "Horizont",
// darunter ein weicherer "Boden". Das erzeugt den typischen Metall-Look, ohne Formen und Details zu zerstören.
function chromeMap(hex, prof, ry = 0.5) {
  const n = Math.min(1, Math.max(0, (luma(hex) - prof.lmin) / (prof.lmax - prof.lmin)));
  const shift = ry < 0.36 ? 0.45 : ry < 0.5 ? -1.3 : 0.2;
  const idx = Math.round(Math.pow(n, 1.15) * (prof.ramp.length - 1) + shift);
  return prof.ramp[Math.min(prof.ramp.length - 1, Math.max(0, idx))];
}

// ---------------- Sprite-Definition
// def: { rows: [...], sym?: bool, pal?: {...} }   sym = Zeilen sind nur die linke Hälfte und werden gespiegelt
function parse(def) {
  const rows = def.rows.map((r) => (def.sym ? r + [...r].reverse().join("") : r));
  const w = Math.max(...rows.map((r) => r.length));
  const cells = rows.map((r) => r.padEnd(w, ".").split(""));
  // over: unsymmetrische Zusatzzeilen { zeile: "ganze Breite" } über dem gespiegelten Raster ("." = unverändert, " " = löschen)
  for (const [y, s] of Object.entries(def.over ?? {})) {
    [...s].forEach((ch, x) => { if (ch !== "." && cells[Number(y)] && x < w) cells[Number(y)][x] = ch === " " ? "." : ch; });
  }
  return { w, h: rows.length, cells, pal: def.pal ?? {}, name: def.name };
}

// Rechnet ein Sprite in eine Pixelliste um (mit Rahmen 1 px, Kontur und leichter Schattierung).
// opts: { pal, shiny, shade, outline, mark }
function pixels(def, opts = {}) {
  const rigSpec = def.rig ?? null;
  const sp = def.cells ? def : parse(def);
  const { shiny = false, shade = true, outline = true, mark = null } = opts;
  const pal = { ...GLOBAL, ...DEFAULT_ACCENT, ...sp.pal, ...(opts.pal ?? {}) };
  const W = sp.w + 2, H = sp.h + 2;
  const grid = Array.from({ length: H }, () => Array(W).fill("."));
  for (let y = 0; y < sp.h; y++) for (let x = 0; x < sp.w; x++) grid[y + 1][x + 1] = sp.cells[y][x];
  if (mark) {                                                // kleines Zeichen unten rechts über das Sprite legen
    const m = mark.cells ?? parse(mark).cells;
    const ox = W - 1 - m[0].length, oy = H - 1 - m.length;
    m.forEach((row, y) => row.forEach((ch, x) => { if (ch !== ".") grid[oy + y][ox + x] = ch; }));
  }
  const solid = (x, y) => x >= 0 && y >= 0 && x < W && y < H && grid[y][x] !== ".";
  const px = [];
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const ch = grid[y][x];
    if (ch === ".") {
      if (outline && (solid(x - 1, y) || solid(x + 1, y) || solid(x, y - 1) || solid(x, y + 1))) px.push([x, y, OUTLINE]);
      continue;
    }
    let c = pal[ch] ?? "#ff00ff";                            // magenta = unbekannter Farbschlüssel (fällt sofort auf)
    if (shade) {                                             // Licht von oben links: Kanten oben heller, unten dunkler
      const top = !solid(x, y - 1), bottom = !solid(x, y + 1);
      if (top && !bottom) c = shift(c, 0.07); else if (bottom && !top) c = shift(c, -0.08);
    }
    px.push([x, y, c]);
  }
  const rig = rigSpec ? resolveRig(rigSpec, { grid, pal, W, H, shiny }) : null;
  if (!shiny) return { w: W, h: H, px, ...(rig ? { rig } : {}) };
  const prof = chromeProfile(px.filter((p) => p[2] !== OUTLINE).map((p) => p[2]));
  return { w: W, h: H, shiny: true, px: px.map(([x, y, c]) => [x, y, c === OUTLINE ? SHINY_OUTLINE : chromeMap(c, prof, y / H)]), ...(rig ? { rig } : {}) };
}

// ---------------- Animation der Figuren (Rig)
// spec = { regions: [{ id, parent?, box: [x0,y0,x1,y1], seq: [[dx,dy], ...], dur, phase? }], blink: [{ cells, color, every, at }], glow: [{ letters, box?, color, max, dur }] }
// Koordinaten wie im Raster (ohne Rahmen). Bereiche bewegen sich in GANZEN Pixelschritten (Pixel-Art-typisch), verschachtelte Bereiche addieren ihre Bewegung.
// spec.rel = true: Boxen, Zellen und Glühbereiche sind ANTEILE (0 bis 1) von Breite und Höhe des Rasters statt Pixel, die Animation passt dann auf jede Figurengröße.
function relSpec(spec, W, H) {
  const gw = W - 2, gh = H - 2;                                       // Raster ohne den Rahmen (Kontur)
  const X = (f) => Math.round(f * (gw - 1)), Y = (f) => Math.round(f * (gh - 1));
  const box = ([a, b, c, d]) => [X(a), Y(b), X(c), Y(d)];
  return { ...spec, rel: false,
    regions: spec.regions.map((r) => ({ ...r, box: box(r.box) })),
    blink: (spec.blink ?? []).map((b) => ({ ...b, cells: b.cells.map(([x, y]) => [X(x), Y(y)]) })),
    glow: (spec.glow ?? []).map((g) => ({ ...g, ...(g.box ? { box: box(g.box) } : {}) })) };
}
function resolveRig(spec0, { grid, pal, W, H, shiny }) {
  const spec = spec0.rel ? relSpec(spec0, W, H) : spec0;
  const edge = (v, max) => (v <= 0 ? 0 : v >= max - 3 ? max - 1 : v + 1);
  const bx = ([x0, y0, x1, y1]) => [edge(x0, W), edge(y0, H), edge(x1, W), edge(y1, H)];
  const regions = spec.regions.map((r) => ({ ...r, box: bx(r.box) }));
  if (shiny) return { regions, blink: [], glow: [] };            // Chrom: nur Bewegung, kein Blinzeln/Leuchten (der Schimmer liegt schon darüber)
  const blink = (spec.blink ?? []).map((b) => ({ cells: b.cells.map(([x, y]) => [x + 1, y + 1]), color: pal[b.color] ?? "#000", every: b.every ?? 4.2, at: b.at ?? 0 }));
  const glow = (spec.glow ?? []).map((g) => {
    const cells = [], [x0, y0, x1, y1] = g.box ?? [0, 0, W, H];
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (g.letters.includes(grid[y][x]) && grid[y][x] !== "." && x - 1 >= x0 && x - 1 <= x1 && y - 1 >= y0 && y - 1 <= y1) cells.push([x, y]);
    return { cells, color: pal[g.color] ?? "#fff", max: g.max ?? 0.5, dur: g.dur ?? 1.6, phase: g.phase ?? 0 };
  });
  return { regions, blink, glow };
}
const seqValues = (seq) => [...seq, seq[0]].map(([dx, dy]) => `${dx} ${dy}`).join(";");          // zurück zum Anfang, damit die Schleife weich schließt
const seqTimes = (seq) => [...seq, seq[0]].map((_, i) => (i / seq.length).toFixed(3)).join(";");
const seqSplines = (seq) => seq.map(() => "0.45 0 0.55 1").join(";");                           // sanftes Beschleunigen und Abbremsen
function rigTree(rig) {
  const byId = new Map(rig.regions.map((r) => [r.id, { ...r, kids: [], own: [], over: [] }]));
  const depth = (r) => (r.parent ? 1 + depth(byId.get(r.parent)) : 1);
  for (const r of byId.values()) { r.d = depth(r); if (r.parent) byId.get(r.parent).kids.push(r); }
  const deepest = (x, y, outline = false) => {
    const m = outline ? 1 : 0;                                    // Konturpixel wandern mit dem Bereich, an dessen Rand sie liegen
    let best = null;
    for (const r of byId.values()) if (x >= r.box[0] - m && x <= r.box[2] + m && y >= r.box[1] - m && y <= r.box[3] + m && (!best || r.d > best.d)) best = r;
    return best;
  };
  return { byId, deepest, roots: [...byId.values()].filter((r) => !r.parent) };
}
// Verschobene Pixelliste eines Animationsbildes (für Vorschau und Tests): k = Schritt in der Sequenz
function rigFramePx({ px, rig }, k = 0) {
  const { byId, deepest } = rigTree(rig);
  const chain = (r) => { const out = []; for (let q = r; q; q = q.parent ? byId.get(q.parent) : null) out.push(q); return out; };
  const out = [];
  for (const [x, y, c] of px) {
    const r = deepest(x, y, c === OUTLINE || c === SHINY_OUTLINE); let dx = 0, dy = 0, ax = 0, ay = 0;
    if (r) chain(r).forEach((q, i) => { const s = q.seq[k % q.seq.length]; dx += s[0]; dy += s[1]; if (i > 0) { ax += s[0]; ay += s[1]; } });
    if (r?.under) out.push([x + ax, y + ay, c]);                  // feste Kopie darunter (siehe rigBody)
    out.push([x + dx, y + dy, c]);
  }
  return out;
}
function rigBody(px, rig) {
  const { byId, deepest, roots } = rigTree(rig);
  const rootOwn = [], rootOver = [];
  for (const p of px) { const r = deepest(p[0], p[1], p[2] === OUTLINE || p[2] === SHINY_OUTLINE); (r ? r.own : rootOwn).push(p); }
  const pathsOf = (list) => {
    const m = new Map();
    for (const [x, y, c] of list) { if (!m.has(c)) m.set(c, []); m.get(c).push([x, y]); }
    return [...m].map(([c, l]) => `<path fill="${c}" d="${runs(l)}"/>`).join("");
  };
  const put = (spec, kind) => {                                   // Blink-/Leuchtzellen dem tiefsten Bereich zuordnen
    const parts = new Map();
    for (const cell of spec.cells) { const r = deepest(cell[0], cell[1]) ?? null; if (!parts.has(r)) parts.set(r, []); parts.get(r).push(cell); }
    for (const [r, cells] of parts) {
      const d = runs(cells);
      const g = kind === "blink"
        ? `<g opacity="0"><path fill="${spec.color}" d="${d}"/><animate attributeName="opacity" calcMode="discrete" values="0;1;0" keyTimes="0;0.94;0.98" dur="${spec.every}s" begin="${-spec.at}s" repeatCount="indefinite"/></g>`
        : `<g opacity="0"><path fill="${spec.color}" d="${d}"/><animate attributeName="opacity" values="0;${spec.max};0" dur="${spec.dur}s" begin="${-spec.phase}s" repeatCount="indefinite"/></g>`;
      (r ? r.over : rootOver).push(g);
    }
  };
  rig.blink.forEach((b) => put(b, "blink")); rig.glow.forEach((g) => put(g, "glow"));
  // under: eine feste Kopie des Bereichs liegt darunter, damit beim seitlichen Schwingen nie ein Loch entsteht (nur ein 1-px-Schatten des alten Platzes)
  const render = (r) => {
    const moving = `<g>${pathsOf(r.own)}${r.over.join("")}${r.kids.map(render).join("")}<animateTransform attributeName="transform" type="translate" calcMode="spline" values="${seqValues(r.seq)}" keyTimes="${seqTimes(r.seq)}" keySplines="${seqSplines(r.seq)}" dur="${r.dur}s" begin="${-(r.phase ?? 0)}s" repeatCount="indefinite"/></g>`;
    return r.under ? `<g>${pathsOf(r.own)}${moving}</g>` : moving;
  };
  return pathsOf(rootOwn) + rootOver.join("") + roots.map(render).join("");
}

// SVG: ein Pfad pro Farbe, waagerechte Pixel werden zusammengefasst
// SVG: ein Pfad pro Farbe, waagerechte Pixel werden zusammengefasst.
// Shiny-Sprites bekommen zusätzlich einen bewegten Schimmer (Regenbogen-Band + heller Glanzstreifen), der nur auf der Figur selbst liegt.
const runs = (list) => {
  list.sort((a, b) => a[1] - b[1] || a[0] - b[0]);
  let d = "", i = 0;
  while (i < list.length) {
    let j = i;
    while (j + 1 < list.length && list[j + 1][1] === list[i][1] && list[j + 1][0] === list[j][0] + 1) j++;
    d += `M${list[i][0]} ${list[i][1]}h${j - i + 1}v1h-${j - i + 1}z`;
    i = j + 1;
  }
  return d;
};
const hashStr = (s) => { let h = 5381; for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0; return h.toString(36); };

function toSvg({ w, h, px, shiny = false, rig = null }, { cls = "", attrs = "" } = {}) {
  const byColor = new Map();
  for (const [x, y, c] of px) { if (!byColor.has(c)) byColor.set(c, []); byColor.get(c).push([x, y]); }
  const paths = rig ? rigBody(px, rig) : [...byColor].map(([c, list]) => `<path fill="${c}" d="${runs(list)}"/>`).join("");
  let extra = "";
  if (shiny) {
    const id = "c" + hashStr(paths);                      // gleiche Grafik = gleiche ID, mehrfaches Einfügen ist unkritisch
    const inner = px.filter((p) => p[2] !== SHINY_OUTLINE).map(([x, y]) => [x, y]);
    extra = `<defs><mask id="${id}m" maskUnits="userSpaceOnUse" x="0" y="0" width="${w}" height="${h}"><path fill="#fff" d="${runs(inner)}"/></mask>
      <linearGradient id="${id}g" x1="0" y1="0" x2="0.333" y2="0.15" spreadMethod="repeat"><stop offset="0" stop-color="#7ff6ff"/><stop offset=".25" stop-color="#ff8be6"/><stop offset=".5" stop-color="#b79bff"/><stop offset=".75" stop-color="#8dffc4"/><stop offset="1" stop-color="#7ff6ff"/></linearGradient>
      <linearGradient id="${id}s" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".95"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>
      <g mask="url(#${id}m)" pointer-events="none"><rect x="${-2 * w}" y="0" width="${3 * w}" height="${h}" fill="url(#${id}g)" opacity=".45"><animate attributeName="x" from="${-2 * w}" to="${-w}" dur="2.6s" repeatCount="indefinite"/></rect>
      <rect x="${-Math.round(w * 0.6)}" y="0" width="${Math.round(w * 0.4)}" height="${h}" fill="url(#${id}s)" opacity=".9" transform="skewX(-18)"><animate attributeName="x" from="${-Math.round(w * 0.6)}" to="${Math.round(w * 1.3)}" dur="3.1s" repeatCount="indefinite"/></rect></g>`;
  }
  return `<svg class="spr ${cls}" viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges"${rig ? ' style="overflow:visible"' : ""}${attrs ? " " + attrs : ""}>${paths}${extra}</svg>`;   // bewegte Teile am Rand dürfen 1 Pixel überstehen
}

const hexToRgb = h2r;

__exports.GLOBAL = GLOBAL;
__exports.OUTLINE = OUTLINE;
__exports.SHINY_OUTLINE = SHINY_OUTLINE;
__exports.shift = shift;
__exports.chromeProfile = chromeProfile;
__exports.chromeMap = chromeMap;
__exports.parse = parse;
__exports.pixels = pixels;
__exports.rigFramePx = rigFramePx;
__exports.toSvg = toSvg;
__exports.hexToRgb = hexToRgb;

});
__define("ui/art/palettes.js", function (__exports, __require) {
// Farbpaletten (dunkel, mittel, hell). Dieselbe Form (Shape) sieht mit anderer Palette wie ein anderer Gegenstand aus.
const P = (a, b, c, d, e) => ({ a, b, c, ...(d ? { d } : {}), ...(e ? { e } : {}) });
const PALETTES = {
  eisen:     P("#4a4458", "#7d778c", "#b6b1c4"),
  gold:      P("#8a6014", "#e8b93d", "#ffe58a"),
  leder:     P("#4a2f1d", "#8b5e3c", "#c28a54"),
  holz:      P("#4a3220", "#7a5535", "#a67c4e"),
  feuer:     P("#8a2a14", "#e8542a", "#ffb35a"),
  wasser:    P("#1f4f8a", "#3c8de8", "#a6d4ff"),
  pflanze:   P("#2a5a30", "#4caf50", "#a6e08a"),
  eis:       P("#2f6f8f", "#7fd6ff", "#e3f8ff"),
  gift:      P("#3f5a1a", "#8fc93a", "#d4f08a"),
  blut:      P("#5a0f1f", "#b8283a", "#ff7a85"),
  arkan:     P("#3a2a7a", "#7a5ad8", "#c9b8ff"),
  prisma:    P("#7a3aa8", "#3ca8e8", "#ffe58a", "#e8542a", "#8fe0a0"),
  knochen:   P("#7a705a", "#b3a98c", "#e6dfc9"),
  schatten:  P("#1a1530", "#3d3366", "#6e5fa8"),
  asche:     P("#3a3540", "#6e6878", "#a8a2b4"),
  perlmutt:  P("#8a8aa0", "#d8d8ea", "#ffffff"),
  blitz:     P("#6a4a00", "#ffd23c", "#fff7b0"),
  glas:      P("#3a6a8a", "#8fd0e8", "#eafaff"),
  pergament: P("#8a6a3a", "#d8c08a", "#f4e6bc"),
  stein:     P("#3a3645", "#6c6878", "#9c98aa"),
};

__exports.PALETTES = PALETTES;

});
__define("ui/art/shapes.js", function (__exports, __require) {
// Item-Formen (12x12). a/b/c = Palette dunkel/mittel/hell, d/e = Zierfarbe. "sym": linke Hälfte (6 Zeichen), wird gespiegelt.
const S = (rows) => ({ rows, sym: true });
const A = (rows) => ({ rows });

const SHAPES = {
  gem: S(["......","..bbbb",".bcccc","bcwcbb","bbbbbb","bbbbbb",".abbbb","..abbb","...abb","....ab",".....a","......"]),
  crystal: S(["......",".....b","....bc","...bcc","..bccw","..bccc","..bbcc","..abbc","..abbb","...aab","....aa","......"]),
  ring: S(["......","......","....ee","....dd","..bbbb",".bc...",".b....",".b....",".b....",".ab...","..abbb","......"]),
  medal: S(["..dd..","..dd..","...dd.","....dd","..bbbb",".bccbb","bccebb","bcebbb","bbbbbb",".abbbb","..aabb","......"]),
  flask: S(["......","....dd","....cc","....cc","...ccc","..cbbb",".cbbbb",".bbbbb",".bbbbb",".abbbb","..aabb","......"]),
  vial: S(["......","....dd","....dd","....cc","...ccb","...cbb","...cbb","...cbb","...cbb","...abb","....aa","......"]),
  pouch: S(["......","....cc","...cbb","....dd","...bbb","..bbbb",".bbcbb",".bbbbb",".bbbbb",".abbbb","..aabb","......"]),
  dice: S(["......",".bbbbb",".bcccc",".bcacc",".bcccc",".bcccc",".bcccc",".bcacc",".bcccc",".babbb","..aaaa","......"]),
  scroll: S(["......",".ddddd","..ccbb","..cbbb","..cabb","..cbbb","..cabb","..cbbb","..ccbb",".ddddd","......","......"]),
  book: S(["......",".aaaaa",".abbbb",".abbdd",".abdee",".abbdd",".abbbb",".abbbb",".awwww",".aiiii","..aaaa","......"]),
  helmet: S(["......","....bb","...hhh","..hiii","..hiii","..hhhh","..hkkk","..hkkk","..hiii","..hhii","...hhh","......"]),
  chest: S(["......","hhhh..","hbbbbb",".bcbbb",".bcbbb",".bbbbb",".baabb",".dddde",".bbbbb",".bbbba","..bbaa","......"]),
  belt: S(["......","......","......","......","aaaaaa","bbbbbb","bbbeee","bbbede","bbbeee","aaaaaa","......","......"]),
  clover: S(["......","..bb..",".bccb.",".bccb.","..bbbb",".....b","..bb.b",".bccb.",".bccb.","..bb.a","....aa","......"]),
  heart: S(["......",".bbb..","bccbbb","bcwbbb","bccbbb","bbbbbb",".bbbbb","..bbbb","...abb","....ab",".....a","......"]),
  orb: S(["......","...bbb","..bbbb",".bccbb",".bcwbb",".bbbbb",".bbbbb",".abbbb","..abbb","...aab","......","......"]),
  log: S(["......","..aaaa",".abbbb","abbccc","abcbbb","abcbcc","abcbcc","abcbbb","abbccc",".abbbb","..aaaa","......"]),
  stone: S(["......","......","......",".bbbbb",".bccwc",".bccbb",".bbbbb",".abbbb",".aaaaa","......","......","......"]),
  bread: S(["......","......","...bbb","..bccc",".bcbcc",".bbbbb",".bbbbb",".abbbb","..aaaa","......","......","......"]),
  backpack: S(["......","...bbb","..bbbb",".bcccc",".bbbbb",".bdddd",".bdeee",".bdeee",".bbbbb",".abbbb","..aaaa","......"]),
  skull: S(["......","..bbbb",".bcccc","bccccc","bckkcc","bckkcc","bcccck",".bcccc","..bcbc","..aaaa","......","......"]),
  drum: S(["......","..cccc",".cbbbb",".bbbbb",".bdbdb",".bbdbd",".bdbdb",".bbdbd",".bbbbb",".abbbb","..aaaa","......"]),
  crown: S(["......","......",".e.e.e",".b.b.b",".bbbbb",".bcbcb",".bbbbb",".bdede",".bbbbb",".aaaaa","......","......"]),
  fang: S(["......","..bbbb","..bccc","...bcc","...bcc","...bbc","....bc","....bc",".....b",".....b","......","......"]),
  chalice: S(["......","bbbbbb","bcbbbb","bbbbbb",".bbbbb","..bbbb","....dd","....dd","....dd","...ddd","..aaaa","......"]),
  moon: A(["............","....bbbb....","...bccb.....","..bcb.......","..bcb.......","..bcb.......","..bcb.......","..bcb.......","...bccb.....","....bbbb....","............","............"]),
  dagger: S(["......",".....c",".....c","....bc","....bc","....bc","....bc","..dddd",".....n",".....n","....dd","......"]),
  snowflake: S(["......",".....c",".b...c","..b..c","...b.c","cccccc","...b.c","..b..c",".b...c",".....c","......","......"]),
  icicle: S(["......","bbbbbb","bcbbbc",".cbbbc",".bbbbc","..bbbc","..bcb.","..bcb.","...cb.","...b..","......","......"]),
  globe: S(["......","...ccc","..cbbb",".cbwbb",".cbbbb",".cbbwb",".cbbbb","..cbbb","..dddd",".dddde",".aaaaa","......"]),
  star: S(["......",".....b",".....c","....bc","bbbbcc",".bccww","..bccc","..bccc",".bcbbb",".bb..b","......","......"]),
  target: S(["......","...bbb","..b..a",".b...a",".b....",".b..cc",".b..cc",".b....",".b...a","..b..a","...bbb","......"]),
  eye: S(["......","......","..bbbb",".bcccc","bccaak","bccaak",".bcccc","..bbbb","......","......","......","......"]),
  paw: S(["......","......",".bb.bb",".bb.bb","..bbbb",".bbbbb","bbccbb","bbccbb","bbbbbb",".bbbbb","..bbbb","......"]),
  watch: S(["......","....dd","....dd","..bbbb",".bcccc","bcccca","bcccca","bccaaa","bcccca",".bcccc","..bbbb","......"]),
  scales: S(["......",".....d",".....d","dddddd",".b...d",".b...d","bbbb.b","cbbb.b",".aa..b",".....b","...bbb","..aaaa"]),
  cards: S(["......","....cc","...cbb","..cbdd",".cbbdd",".cbbbb",".cbbbb",".cbbbb",".cbbbb",".aabbb","......","......"]),
  cloak: S(["......","..bbbb",".bbbbb",".bbbbe","bbbbbb","bbcbbb","bbcbbb","bbbbbb","babbbb","bbabab","b.b.b.","......"]),
  lighter: S(["......",".....o","....oY","....oY","....bb","..bbbb","..bccc","..bccc","..bbbb","..abbb","..aaaa","......"]),
  bowl: S(["......",".....o","....oY","...oYY","..cccc",".bbbbb",".bbbbb","..bbbb","...abb","....aa","...aaa","......"]),
  hammer: A(["............","..aaaaaaaa..",".abbbbbbbba.",".abccccccba.","..aaaaaaaa..",".....nn.....",".....nN.....",".....nN.....",".....nN.....",".....nN.....",".....nn.....","............"]),
  cannon: A(["............","............","............","....bbbbbb..","..bbcccccbb.",".bbbbbbbbbbb","bbbbbbbbbbb.",".bbbbbbbbbb.","..aaaaaaaa..","..aa....aa..",".aaa....aaa.","............"]),
  bolt: S(["......",".....b","....bc","...bcc","..bccc","bbbbcc","...bcc","...bbc","....bc","....bc",".....b","......"]),
  feather: A(["............","..........bb","........bbcb",".......bbccb","......bbccb.",".....bbccb..","....bbccb...","...bbccb....","..dbbcb.....",".d.bbb......","d..b........","............"]),
  worm: A(["............","............",".....bbb....","....bccbb...","...bcbbbb...","..bcb..bbb..","..bb....bb..","..bb...bbb..","...bbbbbb...","....bbbb....","............","............"]),
  razor: A(["............","............","......cccc..",".....cbbbb..","....cbbbb...","...cbbbb....","..aabb......",".ddd........",".dd.........","............","............","............"]),
  quiver: A(["............","....e..e....","....e..e.e..",".....b.b.b..","....bbbbbb..","....bcbbbb..","....bcbbbb..","....bcbbbb..","....bbbbbb..","....abbbba..","....aaaaaa..","............"]),
  boot: A(["............","...bbbb.....","...bccb.....","...bccb.....","...bbbb.....","...bbbb.....","...bbbbb....","..bbbbbbb...","..bbbbbbbbb.","..aabbbbbbb.","..aaaaaaaaa.","............"]),
  scope: A(["............","............","...dd.dd....",".bbbbbbbbb..","bccbbbbbbcb.","bccbbbbbbcb.",".bbbbbbbbb..","...dd.dd....","............","............","............","............"]),
  lens: A(["............","...bbbbb....","..bcccccb...",".bcwcccccb..",".bcccccccb..",".bcccccccb..","..bcccccb...","...bbbbbbd..",".........dd.","..........dd","............","............"]),
  horn: A(["............","........bbb.",".......bccbb","......bccbb.",".....bccbb..","....bccbb...","...bccbb....","..bccbb.....",".dbbbb......",".dddb.......","............","............"]),
};

// Kleine Zeichen (5x5), die unten rechts über eine Form gelegt werden und Gegenstände unterscheiden
const MARKS = {
  flame: A(["..o..",".oRo.","oRYo.","oYYYo",".ooo."]),
  thorn: A(["..f..",".fFf.","fFFFf",".fFf.","..f.."]),
  leaf:  A(["...FF","..FGF",".FGF.","FGF..","F...."]),
  snow:  A(["..J..","J.J.J",".JJJ.","J.J.J","..J.."]),
  bolt:  A(["..YY.",".YY..","YYYY.","..YY.",".YY.."]),
  skull: A([".www.","wkwkw","wwwww",".www.",".w.w."]),
  drop:  A(["..R..",".RRR.","RRwRR","RRRRR",".RRR."]),
  wing:  A(["ww...","www..",".wwww","..www","...ww"]),
  coin:  A([".YYY.","YzzYY","YzYYY","YYYYY",".YYY."]),
};

// Zuordnung: Item-ID -> [Form, Palette, optionales Zeichen]
const ITEM_ART = {
  boerse_des_geizkragens: ["chest", "gold", "coin"], midas_fluch: ["ring", "gold"], nekromanten_pakt: ["skull", "pflanze"], wuchernde_wurzeln: ["worm", "pflanze", "leaf"],
  pech_raeucherstaebchen: ["log", "feuer", "flame"], asche_lunge: ["heart", "asche", "flame"], krone_des_maertyrers: ["crown", "blut"], erntesichel: ["razor", "gold"], vorratskammer: ["backpack", "pflanze", "leaf"],
  narbenleder: ["belt", "blut"], stachelschild: ["orb", "eisen", "thorn"], eisenfaust: ["hammer", "eisen", "bolt"],
  feuerflasche: ["flask", "feuer", "flame"], heiltrank: ["flask", "blut", "drop"], rauchbombe: ["orb", "asche"], giftphiole: ["vial", "gift", "skull"],
  frostphiole: ["vial", "eis", "snow"], blutampulle: ["vial", "blut", "drop"], schlachtrufrolle: ["scroll", "gold", "bolt"],
  prismasplitter: ["gem", "prisma", "bolt"], phoenixasche: ["bowl", "feuer", "wing"],
  eisenpanzer: ["chest", "eisen"], vielfaltsmedaille: ["medal", "prisma"], kleeblatt: ["clover", "pflanze"], glueckswuerfel: ["dice", "gold"],
  prismalinse: ["lens", "prisma"], jaegerauge: ["eye", "pflanze"], quellstein: ["gem", "wasser"], gezeitenperle: ["orb", "wasser"],
  treibholz: ["log", "holz"], dornenring: ["ring", "pflanze", "thorn"], sporenbeutel: ["pouch", "pflanze", "leaf"], wurzelherz: ["heart", "pflanze", "leaf"],
  lederweste: ["chest", "leder"], eisenhelm: ["helmet", "eisen"], muenzbeutel: ["pouch", "gold", "coin"], feldflasche: ["flask", "leder"],
  hasenpfote: ["paw", "perlmutt"], wetzstein: ["stone", "eisen"], notfallration: ["bread", "leder"], rucksack: ["backpack", "leder"],
  ledergurt: ["belt", "leder"], dornenruestung: ["chest", "eisen", "thorn"], kampfhorn: ["horn", "knochen"], adrenalinpumpe: ["vial", "blut", "bolt"],
  beutegier: ["skull", "gold", "coin"], kriegstrommel: ["drum", "blut"], echostein: ["gem", "arkan"], meisterhammer: ["hammer", "eisen"],
  taschenuhr: ["watch", "gold"], energiekristall: ["crystal", "blitz"], blutpakt: ["scroll", "blut", "drop"], glaskanone: ["cannon", "glas"],
  goldene_waage: ["scales", "gold"], kartenhaus: ["cards", "pergament"], schillernder_charme: ["star", "prisma"], phoenixfeder: ["feather", "feuer", "flame"],
  glutstein: ["gem", "feuer"], schmiedeherz: ["heart", "feuer", "flame"], flammenkrone: ["crown", "feuer", "flame"], funkenfeuerzeug: ["lighter", "eisen"],
  lavaruestung: ["chest", "feuer", "flame"], glutschale: ["bowl", "eisen"], aschemantel: ["cloak", "asche"],
  giftring: ["ring", "gift"], seuchenbeutel: ["pouch", "gift", "skull"], giftzahn: ["fang", "gift"], schierlingsflasche: ["vial", "gift"],
  miasmaflasche: ["flask", "gift"], leichengift: ["skull", "gift"], apothekerwaage: ["scales", "eisen", "drop"], seuchenkoenig: ["crown", "gift", "skull"],
  blutkelch: ["chalice", "blut"], blutegel: ["worm", "blut"], rasiermesser: ["razor", "eisen"], vampirzahn: ["fang", "blut"],
  dornenkrone: ["crown", "blut", "thorn"], blutmond: ["moon", "blut"], opferdolch: ["dagger", "blut"],
  eiskristall: ["crystal", "eis"], frostherz: ["heart", "eis"], raureif: ["snowflake", "eis"], eiszapfen: ["icicle", "eis"],
  schneekugel: ["globe", "eis"], kaelteamulett: ["medal", "eis", "snow"], herz_des_winters: ["heart", "eis", "snow"],
  koecher: ["quiver", "leder"], munitionsgurt: ["belt", "leder", "bolt"], adlerauge: ["eye", "gold"], leichtfuessig: ["boot", "perlmutt", "wing"],
  jagdzeichen: ["target", "blut"], zielfernrohr: ["scope", "eisen"],
  grimoire: ["book", "arkan"], funkenschlag: ["bolt", "blitz"], gedankenstein: ["gem", "arkan", "bolt"], resonanzkristall: ["crystal", "prisma"],
  manaquelle: ["orb", "arkan"], elementarlinse: ["lens", "prisma", "flame"],
};

// Helden-Items (content/packs/helden_items.js): [Form, Farbe, Zeichen]
Object.assign(ITEM_ART, {
  ritterschwur: ["medal", "eisen", null], eisenwall: ["chest", "stein", null], siegerhelm: ["helmet", "blut", "drop"],
  sperrfeuer: ["quiver", "holz", "bolt"], windlaeufer: ["boot", "leder", "wing"], meisterschuetze: ["scope", "prisma", null],
  arkane_feder: ["feather", "arkan", "bolt"], elementarkompass: ["globe", "prisma", null], prismakrone: ["crown", "prisma", null],
  glutherz: ["heart", "schatten", "flame"], schmerzkelch: ["chalice", "blut", "flame"], phoenixblut: ["vial", "feuer", "wing"],
  goldener_zahn: ["fang", "gold", "coin"], bankier: ["scales", "gold", "coin"], kronjuwelen: ["crown", "gold", "coin"],
  gruener_daumen: ["clover", "pflanze", "leaf"], erntekorb: ["bowl", "pflanze", "leaf"], weltenbaum: ["log", "pflanze", "leaf"],
});

// Wert-Items (content/packs/stat_items.js)
Object.assign(ITEM_ART, {
  kraftring: ["ring", "blut", null], kriegsbemalung: ["pouch", "blut", "bolt"], gewichtsweste: ["backpack", "eisen", null], federstiefel: ["boot", "wasser", "wing"],
  wuchtgurt: ["belt", "stein", "skull"], heilkraut: ["clover", "pflanze", "drop"], stahlhaut: ["chest", "gold", "thorn"], sparbuch: ["book", "gold", "coin"],
  scharfes_auge: ["eye", "gold", "bolt"], elementarfokus: ["lens", "arkan", "flame"], blutdurstamulett: ["medal", "blut", "drop"], glueckskeks: ["bread", "gold", "coin"],
  kampfnarben: ["razor", "knochen", "skull"], schattenmantel: ["cloak", "schatten", null], panzerfaust: ["hammer", "stein", "thorn"], glueckspilz: ["stone", "pflanze", "leaf"],
  schattenklinge: ["dagger", "schatten", "wing"], rotes_siegel: ["scroll", "blut", "flame"], koenigsring: ["ring", "prisma", "coin"],
});

// Nebenwert- und Fluch-Items (content/packs/stat_items.js)
Object.assign(ITEM_ART, {
  gutschein: ["scroll", "gold", "coin"], handelsabkommen: ["book", "pergament", "coin"], wuerfelbecher: ["dice", "leder", null], gluecksrad: ["globe", "gold", "coin"],
  drachentoeter: ["dagger", "blut", "skull"], henkersbeil: ["hammer", "blut", "skull"], schlangengift: ["vial", "knochen", "skull"], gluthoel: ["flask", "asche", "flame"],
  dornenwein: ["flask", "blut", "thorn"], kraeutertee: ["flask", "pflanze", "leaf"], lebensquell: ["orb", "wasser", "drop"], goldwaescher: ["bowl", "gold", "coin"],
  gluecksmuenze: ["medal", "gold", "coin"], verfluchter_dolch: ["dagger", "schatten", "skull"], fluchsiegel: ["scroll", "schatten", "skull"], daemonenpakt: ["book", "schatten", "flame"],
});
Object.assign(ITEM_ART, { herz_der_vollendung: ["heart", "perlmutt", "wing"] });

__exports.SHAPES = SHAPES;
__exports.MARKS = MARKS;
__exports.ITEM_ART = ITEM_ART;

});
__define("ui/art/weapons.js", function (__exports, __require) {
// Waffen (senkrecht gezeichnet, Griff unten). Die Oberfläche dreht sie in die Hand des Helden.
// 8 Pixel breit (linke Hälfte, 4 Zeichen) und 16 hoch. a/b/c = Palette.
const S = (rows) => ({ rows, sym: true });
const WEAPON_SHAPES = {
  sword: S(["...c","...c","..bc","..bc","..bc","..bc","..bc","..bc","..bc","..bc","..bc","yyyy","...n","...N","...n","..yY"]),
  dagger: S(["....","....","....","....","...c","..bc","..bc","..bc","..bc","..bc","dddd","...n","...N","...n","..yY","...."]),
  staff: S(["..bb",".bcc",".bcc","..bb","...n","...N","...n","...N","...n","...N","...n","...N","...n","...N","...n","..dd"]),
  wand: S(["..cc",".cbb",".cbb","..aa","...n","..cN","...n","...N","..cn","...N","...n","..cN","...n","...N","...n","..dd"]),
  torch: S(["..oo",".ooO",".oOY",".oOY","..oo","...n","...N","...n","...N","...n","...N","...n","...N","...n","..dd","...."]),
  rapier: S(["...c","...c","...c","...c","...c","...c","...c","...c","...c","...c","..yy","...n","...N","...n","..yY","...."]),
  crystalstaff: S(["...b","..bc",".bcc",".bcw",".bcc","..bc","...b","...n","...N","...n","...N","...n","...N","...n","...N","..dd"]),
};
// Bögen und Armbrust sind nicht symmetrisch
const WEAPON_ASYM = {
  bow: [".....bb.","....bc.i","...bc..i","..bc...i","..bc...i",".bc....i",".bc....i",".dd....i",".dd....i",".bc....i",".bc....i","..bc...i","..bc...i","...bc..i","....bc.i",".....bb."],
  crossbow: { rows: ["b..ii..b".replace("ii","..").slice(0, 8), "bb....bb", ".bbiibb.", "..bddb..", "...dd...", "...nn...", "...nn...", "...nN...", "...nN...", "..nnNN..", "..nnNN..", "...nn...", "...nn...", "...nn...", "........", "........"] },
};
const WEAPON_ART = {
  rostiges_schwert: { shape: "sword", pal: { a: "#6b4a2a", b: "#8a6a4a", c: "#a8a39a" }, rust: true },
  flammenschwert: { shape: "sword", pal: "feuer" },
  frostklinge: { shape: "sword", pal: "eis" },
  giftdolch: { shape: "dagger", pal: "gift" },
  kurzbogen: { asym: "bow", pal: "holz" },
  armbrust: { asym: "crossbow", pal: "eisen" },
  jagdbogen: { asym: "bow", pal: "gold" },
  giftbogen: { asym: "bow", pal: "gift" },
  zauberstab: { shape: "staff", pal: "arkan" },
  runenstab: { shape: "wand", pal: "wasser" },
  kristallstab: { shape: "crystalstaff", pal: "prisma" },
  flammenstab: { shape: "staff", pal: "feuer" },
  pechfackel: { shape: "torch", pal: "feuer" }, stockdegen: { shape: "rapier", pal: "eisen" }, rankenstab: { shape: "wand", pal: "pflanze" },
  stahlschwert: { shape: "sword", pal: "eisen" }, glutschwert: { shape: "sword", pal: "blut" }, natterndolch: { shape: "dagger", pal: "pflanze" },
  langbogen: { asym: "bow", pal: "eisen" }, brandbogen: { asym: "bow", pal: "feuer" }, wundbogen: { asym: "bow", pal: "blut" },
  arkanstab: { shape: "wand", pal: "arkan" }, glutzepter: { shape: "wand", pal: "feuer" }, frostzepter: { shape: "wand", pal: "eis" },
};

__exports.WEAPON_SHAPES = WEAPON_SHAPES;
__exports.WEAPON_ASYM = WEAPON_ASYM;
__exports.WEAPON_ART = WEAPON_ART;

});
__define("ui/art/weapons2.js", function (__exports, __require) {
// ERZEUGT von tools/figures/weapons.mjs (nicht von Hand ändern). Waffen im detaillierten Stil: 12x32 Pixel, Pixelgröße wie bei den Helden (1,65).
const R = (rows) => rows.map((r) => [...r]);
const WEAPONS2 = {
  rostiges_schwert: { w: 12, h: 32, cells: R(["............","............","............","............",".....mD.....","....mmD.....","....mBD.....","....mBBD....","....mmBD....","....mmBn....","....nmBD....","....mmBD....","....mmBD....","....mmBD....","....mmBD....","....mmBn....","....mmBD....","....mmBD....","....mmBD....","....nmBD....","....mmBD....","....mmBD....","....mBBD....",".N..DDDD..N.",".MMMMMMMMMn.",".nnnnnnnnnn.",".....Mn.....",".....nn.....",".....Mn.....",".....mD.....","....mmBD....","....DDDD...."]), px: 1.65, grip: [6,27] },
  flammenschwert: { w: 12, h: 32, cells: R(["............","............","............","............",".....YY.....","....OOr.....","....Oor.....","....Ooor....","....OOor....","....OOor....","....OOor....","....OOor....","....OOor....","....OOor....","....OOor....","....OOor....","....OOor....","....OOor....","....OOor....","....OOor....","....OOor....","....OOor....","....Ooor....",".Y..rrrr..Y.",".zzzzRRzzzy.",".yyyyyyyyyy.",".....Mn.....",".....nn.....",".....Mn.....",".....zy.....","....zzYy....","....yyyy...."]), px: 1.65, grip: [6,27] },
  frostklinge: { w: 12, h: 32, cells: R(["............","............","............","............",".....ww.....","....JJu.....","....JVu.....","....JVVu....","....JJVu....","....JJVu....","....JJVu....","....JJVu....","....JJVu....","....JJVu....","....JJVu....","....JJVu....","....JJVu....","....JJVu....","....JJVu....","....JJVu....","....JJVu....","....JJVu....","....JVVu....",".J..uuuu..J.",".wwwwwwwwwU.",".UUUUUUUUUU.",".....Vu.....",".....uu.....",".....Vu.....",".....wU.....","....wwJU....","....UUUU...."]), px: 1.65, grip: [6,27] },
  giftdolch: { w: 12, h: 32, cells: R(["............","............","............","............","............","............","............","............","............","............","............",".....Gf.....",".....Gf.....","....GGf.....","....GFf.....","....GGf.....","....GGf.....","....GGFf....","....GGFf....","....GGFf....","....GGFf....","....GGFf....","....GGFf....","....ffff....","..PPPGGPPq..","..qqqqqqqq..",".....Mn.....",".....Mn.....",".....Mn.....",".....Pq.....","....PPQq....","....qqqq...."]), px: 1.65, grip: [6,27] },
  stahlschwert: { w: 12, h: 32, cells: R(["............","............","............",".....wh.....","....wwh.....","...wwih.....","...wiiih....","...wiwih....","...wiwih....","...wiwih....","...wiwih....","...wiwih....","...wiwih....","...wiwih....","...wiwih....","...wiwih....","...wiwih....","...wiwih....","...wiwih....","...wiwih....","...wiwih....","...wiwih....","...wiiih....",".Y.hhhhh..Y.",".zzzzzzzzzy.",".yyyyyyyyyy.",".....Mn.....",".....nn.....",".....Mn.....",".....zy.....","....zzYy....","....yyyy...."]), px: 1.65, grip: [6,27] },
  glutschwert: { w: 12, h: 32, cells: R(["............","............","............","............",".....YY.....","....OOr.....","....ORr.....","....ORRr....","....OORr....","....OORr....","....OORr....","....OORr....","....OORr....","....OORr....","....OORr....","....OORr....","....OORr....","....OORr....","....OORr....","....OORr....","....OORr....","....OORr....","....ORRr....",".n..rrrr..n.",".NNNNYYNNNx.",".xxxxxxxxxx.",".....Nx.....",".....xx.....",".....Nx.....",".....Or.....","....OORr....","....rrrr...."]), px: 1.65, grip: [6,27] },
  natterndolch: { w: 12, h: 32, cells: R(["............","............","............","............","............","............","............","............","............","............","............",".....Gf.....",".....Gf.....","....GGf.....","....GFf.....","....GGf.....","....GGf.....","....GGFf....","....GGFf....","....GGFf....","....GGFf....","....GGFf....","....GGFf....","....ffff....","..zzzRRzzy..","..yyyyyyyy..",".....Pq.....",".....Pq.....",".....Pq.....",".....zy.....","....zzYy....","....yyyy...."]), px: 1.65, grip: [6,27] },
  kurzbogen: { w: 12, h: 32, cells: R([".........zYn","........zwn.",".......zYnw.",".......MNnw.","......MNn.w.","......MNn.w.",".....MNn..w.",".....MNn..w.","....MNn...w.","....MNn...w.","....MNn...w.","....MNn...w.","...MNn....w.","...nnx....w.","...nnx....w.","...nnx....w.","...nnx....w.","...nnx....w.","...nnx....w.","...MNn....w.","....MNn...w.","....MNn...w.","....MNn...w.","....MNn...w.",".....MNn..w.",".....MNn..w.","......MNn.w.","......MNn.w.",".......MNnw.",".......zYnw.","........zwn.",".........zYn"]), px: 1.65, grip: [4,16] },
  jagdbogen: { w: 12, h: 32, cells: R([".........MNy","........Mwy.",".......MNyw.","......zYy.w.","......zYy.w.",".....zYy..w.",".....zYy..w.","....zYy...w.","....zYy...w.","...zYy....w.","...zYy....w.","...zYy....w.","..zYy.....w.","..nnx.....w.","..nnx.....w.","..nnx.....w.","..nnx.....w.","..nnx.....w.","..nnx.....w.","..zYy.....w.","...zYy....w.","...zYy....w.","...zYy....w.","....zYy...w.","....zYy...w.",".....zYy..w.",".....zYy..w.","......zYy.w.","......zYy.w.",".......MNyw.","........Mwy.",".........MNy"]), px: 1.65, grip: [4,16] },
  giftbogen: { w: 12, h: 32, cells: R([".........PQf","........Pwf.",".......PQfw.","......GFf.w.","......GFf.w.",".....GFf..w.",".....GFf..w.","....GFf...w.","....GFf...w.","...GFf....w.","...GFf....w.","...GFf....w.","..GFf.....w.","..nnx.....w.","..nnx.....w.","..nnx.....w.","..nnx.....w.","..nnx.....w.","..nnx.....w.","..GFf.....w.","...GFf....w.","...GFf....w.","...GFf....w.","....GFf...w.","....GFf...w.",".....GFf..w.",".....GFf..w.","......GFf.w.","......GFf.w.",".......PQfw.","........Pwf.",".........PQf"]), px: 1.65, grip: [4,16] },
  langbogen: { w: 12, h: 32, cells: R([".........ihn","........iwn.",".......ihnw.","......MNn.w.",".....MNn..w.",".....MNn..w.","....MNn...w.","...MNn....w.","...MNn....w.","..MNn.....w.","..MNn.....w.","..MNn.....w.",".MNn......w.",".nnx......w.",".nnx......w.",".nnx......w.",".nnx......w.",".nnx......w.",".nnx......w.",".MNn......w.","..MNn.....w.","..MNn.....w.","..MNn.....w.","...MNn....w.","...MNn....w.","....MNn...w.",".....MNn..w.",".....MNn..w.","......MNn.w.",".......ihnw.","........iwn.",".........ihn"]), px: 1.65, grip: [4,16] },
  brandbogen: { w: 12, h: 32, cells: R([".........zYr","........zwr.",".......zYrw.","......Oor.w.","......Oor.w.",".....Oor..w.",".....Oor..w.","....Oor...w.","....Oor...w.","...Oor....w.","...Oor....w.","...Oor....w.","..Oor.....w.","..nnx.....w.","..nnx.....w.","..nnx.....w.","..nnx.....w.","..nnx.....w.","..nnx.....w.","..Oor.....w.","...Oor....w.","...Oor....w.","...Oor....w.","....Oor...w.","....Oor...w.",".....Oor..w.",".....Oor..w.","......Oor.w.","......Oor.w.",".......zYrw.","........zwr.",".........zYr"]), px: 1.65, grip: [4,16] },
  wundbogen: { w: 12, h: 32, cells: R([".........Nnr","........Nwr.",".......Nnrw.","......ORr.w.","......ORr.w.",".....ORr..w.",".....ORr..w.","....ORr...w.","....ORr...w.","...ORr....w.","...ORr....w.","...ORr....w.","..ORr.....w.","..nnx.....w.","..nnx.....w.","..nnx.....w.","..nnx.....w.","..nnx.....w.","..nnx.....w.","..ORr.....w.","...ORr....w.","...ORr....w.","...ORr....w.","....ORr...w.","....ORr...w.",".....ORr..w.",".....ORr..w.","......ORr.w.","......ORr.w.",".......Nnrw.","........Nwr.",".........Nnr"]), px: 1.65, grip: [4,16] },
  armbrust: { w: 12, h: 32, cells: R(["............",".....ii.....",".....ii.....",".....NN.....",".....NN....g","w....NN...iw","iw...NN..iwg","gwiiiNNiigwg",".gwhhNNhgw..","..wggNNggw..","...w.NN.w...","...w.RN.w...","....wNRw....","....wMnw....",".....ww.....",".....Mn.....",".....Mn.....",".....Mn.....",".....Mn.....",".....Mn.....",".....Mn.....",".....Mn.....",".....Mn.....",".....Mn.....",".....Mn.....",".....Mn.....","....MMNn....","....MNNn....","....MNNn....","....MNNn....","....MNNn....","....nnnn...."]), px: 1.65, grip: [6,24] },
  zauberstab: { w: 12, h: 32, cells: R(["............","...PPPPPq...","..PPQQQQQq..","..PQwQQQQq..",".PPQwQQQQQq.",".PQQQwwQQQq.",".qQQQwwQQqq.","..PQQQQQQq..","..qQQQQQqq..","..YqqqqqqY..","...Y.Mn.Y...",".....Mn.....",".....Mn.....",".....Mn.....",".....Mn.....",".....Mn.....",".....nn.....",".....Mn.....",".....Mn.....",".....Mn.....",".....Mn.....",".....Mn.....",".....Mn.....",".....Mn.....",".....Mn.....",".....Mn.....",".....Mn.....",".....Mn.....",".....nn.....",".....Mn.....",".....yy.....",".....yy....."]), px: 1.65, grip: [6,22] },
  runenstab: { w: 12, h: 32, cells: R([".....u......","....VVu.....","....Vwu.....","...VwUUu....","..VVwUUUu...",".uVUUUUUuu..","..uUUUUuu...","...VUUUu....","...uUUuu....","....uuu.....","...Y.u..Y...","....YMnY....",".....Mn.....",".....Mn.....",".....Mn.....",".....Mn.....",".....Mn.....",".....nn.....",".....Mn.....",".....Mn.....",".....Mn.....",".....Mn.....",".....Mn.....",".....Mn.....",".....Mn.....",".....Mn.....",".....Mn.....",".....Mn.....",".....Mn.....",".....nn.....",".....yy.....",".....yy....."]), px: 1.65, grip: [6,22] },
  kristallstab: { w: 12, h: 32, cells: R([".....U......","....wwU.....","....wwU.....","...wwJJU....","..wwwJJJU...",".UwJJJJJUU..","..UJJJJUU...","...wJJJU....","...UJJUU....","....UUU.....","...Y.U..Y...","....YmDY....",".....mD.....",".....mD.....",".....mD.....",".....mD.....",".....mD.....",".....DD.....",".....mD.....",".....mD.....",".....mD.....",".....mD.....",".....mD.....",".....mD.....",".....mD.....",".....mD.....",".....mD.....",".....mD.....",".....mD.....",".....DD.....",".....yy.....",".....yy....."]), px: 1.65, grip: [6,22] },
  flammenstab: { w: 12, h: 32, cells: R([".....o......",".....o......","....YYo.....","....YOOo....","...YYOOOo...","..YYYYYYo...","..YOYzzYOo..",".oYYYzzYYo..","..YOYzzYo...","..oOYYYYo...","...ooooo....","..y..Mn..y..","...y.Mn.y...",".....Mn.....",".....Mn.....",".....Mn.....",".....Mn.....",".....nn.....",".....Mn.....",".....Mn.....",".....Mn.....",".....Mn.....",".....Mn.....",".....Mn.....",".....Mn.....",".....Mn.....",".....Mn.....",".....Mn.....",".....Mn.....",".....nn.....",".....yy.....",".....yy....."]), px: 1.65, grip: [6,22] },
  arkanstab: { w: 12, h: 32, cells: R(["............",".....Pq.....","...PPPQPq...","..PPwQQQQq..","..PQwQQQQq..","..PQQPPQQq..","..PQQPPQQq..","..qQQQQQqq..","...qqQqqq...","..Y..qq..Y..","...Y.gx.Y...",".....gx.....",".....gx.....",".....gx.....",".....gx.....",".....xx.....",".....gx.....",".....gx.....",".....gx.....",".....gx.....",".....gx.....",".....gx.....",".....gx.....",".....gx.....",".....gx.....",".....gx.....",".....gx.....",".....xx.....",".....gx.....",".....gx.....",".....yy.....",".....yy....."]), px: 1.65, grip: [6,22] },
  glutzepter: { w: 12, h: 32, cells: R(["............",".....Yo.....","...YYYOYo...","..YYwOOOOo..","..YOwOOOOo..","..YOOzzOOo..","..YOOzzOOo..","..oOOOOOoo..","...ooOooo...","..Y..oo..Y..","...Y.gx.Y...",".....gx.....",".....gx.....",".....gx.....",".....gx.....",".....xx.....",".....gx.....",".....gx.....",".....gx.....",".....gx.....",".....gx.....",".....gx.....",".....gx.....",".....gx.....",".....gx.....",".....gx.....",".....gx.....",".....xx.....",".....gx.....",".....gx.....",".....yy.....",".....yy....."]), px: 1.65, grip: [6,22] },
  frostzepter: { w: 12, h: 32, cells: R(["............",".....JU.....","...JJJVJU...","..JJwVVVVU..","..JVwVVVVU..","..JVVwwVVU..","..JVVwwVVU..","..UVVVVVUU..","...UUVUUU...","..Y..UU..Y..","...Y.mD.Y...",".....mD.....",".....mD.....",".....mD.....",".....mD.....",".....DD.....",".....mD.....",".....mD.....",".....mD.....",".....mD.....",".....mD.....",".....mD.....",".....mD.....",".....mD.....",".....mD.....",".....mD.....",".....mD.....",".....DD.....",".....mD.....",".....mD.....",".....yy.....",".....yy....."]), px: 1.65, grip: [6,22] },
  pechfackel: { w: 12, h: 32, cells: R([".....o......",".....o......","....YYo.....","....YOOo....","...YYOOOo...","...YOYYOo...","..YYYYzYo...","..YOYzzYo...","..oOYzYYoo..","...ooYYok...","...gxxxxk...","..kgxxxxkk..","...gxxxxo...","...kxxxkk...","....kkkk....",".....Mn.....",".....Mn.....",".....Mn.....",".....Mn.....",".....nn.....",".....Mn.....",".....Mn.....",".....Mn.....",".....Mn.....",".....Mn.....",".....Mn.....",".....Mn.....",".....Mn.....",".....Mn.....",".....Mn.....",".....yy.....",".....yy....."]), px: 1.65, grip: [6,24] },
  stockdegen: { w: 12, h: 32, cells: R(["............","............","....zzzy....","...zzYYYy...","..zzwYYYYy..","..zYwYYYYy..","..zYYYYYYy..","..yYYYYYyy..","...yYYYyy...","....yyyy....","...zzzzzy...","...yyyyyy...",".....xk.....",".....xk.....",".....xk.....",".....xk.....",".....xk.....",".....xk.....",".....xk.....",".....xk.....",".....xk.....",".....xk.....",".....xk.....",".....xk.....",".....xk.....",".....xk.....",".....xk.....",".....xk.....",".....xk.....",".....ii.....",".....ii.....",".....ii....."]), px: 1.65, grip: [6,22] },
  rankenstab: { w: 12, h: 32, cells: R(["............","............","..f..Or.f...",".GGfOORrGf..",".fFFOYYrff..","..fFrRrrf...","...Gfrrf....","...ff.ff....","....f.f.....",".....Mn.....",".....Mn.....",".....Mn.....","....FMn.....","....FMn.....",".....Fn.....",".....nn.....",".....Mn.....",".....MnF....",".....MnF....",".....MF.....",".....Mn.....",".....Mn.....","....FMn.....","....FMn.....",".....Fn.....",".....Mn.....",".....MnF....",".....nnF....",".....Mn.....",".....Mn.....",".....yy.....",".....yy....."]), px: 1.65, grip: [6,22] },
};

__exports.WEAPONS2 = WEAPONS2;

});
__define("ui/art/cards2.js", function (__exports, __require) {
// ERZEUGT von tools/figures/cards.mjs (nicht von Hand ändern). Kartenmotive, 32x32 Pixel, je Karte ein eigenes Bild.
const R = (rows) => rows.map((r) => [...r]);
const CARDS2 = {
  hieb: { w: 32, h: 32, cells: R(["................................","................................","................................","........................w.......","............................i...",".........................i.i....",".........i..............i.hhh.w.",".......................i.hhhh...","......................i.hhhhh...","......i..............i.hhhhhwg..","....................i.hhhhh.g...","...................i.hhhhh.g....","..................i.hhhhh.g..w..",".................i.hhhhh.g......","................i.hhhhh.g.......","...............i.hhhhh.g........","..........YY..i.hhhhh.g.........","..........YYYi.hhhhh.g..........","...........YYYhhhhh.g...........","............YYYhhh.g............",".............YYYh.g.............","............NNYYYg..............","...........NNN.YYY..............","..........NNN...YYY.............",".........NNN.....YY.............","........NNN.....................","........NN......................","......YY........................","................................","................................","................................","................................"]) },
  wuchtschlag: { w: 32, h: 32, cells: R(["................................","................ii..............","..............iiiiig............","..............iiiiig............","..............ihihhg............","..............ihihhg............","..z...........ihihhg..........z.","...zz.........ihihhg.........z..",".....zz.......ihihhg.......zz...",".......z......ihihhg......z.....",".............iihihhhg...........",".............ihhihhhg...........",".............ihhihhhg...........",".............ihhihhhg...........",".............ihhihhhg...........",".............ihhihhhg...........",".............ihhihhhg...........",".............gggggggg...........","........zzzzzzzzzzzzzzzzzy......","........zYYYYYYYYYYYYYYYYy......",".......zyyyyyyyyyyyyyyyyyy......",".....zz........MMMn.......z.....","...zz..........MNNn........zz...","...............MNNn..........zz.","...............MNNn.............","...............MNNn.............","...............MNNn.............","...............MNNn.............","...............zzzy.............","..............zzYYYy............","..............yYYYyy............","...............yyyy............."]) },
  wirbel: { w: 32, h: 32, cells: R(["................................","................................","................................","................................","................................",".............iiiiiiii.....i.....","...........iii......iii..i.hh...",".........iii..........iii.hhh...","........iii..hhhhhhh...iihhh.g..",".......iii..hh.....hhhi.hhh.g...",".......ii.hh........iihhhhig....","......ii.hh........i.hhhh.gw....","......ii.h........i.hhhh.gii....",".....ii.hh.......i.hhh.gg.......",".....ii.........i.hhh.g.h.w.....",".....ii........i.hhh.g..h.......",".....ii.......i.YYh.g...h.......",".....ii......i.hYY.g....h.......",".....ii.....i.hhh.g.....h.......",".....iw..h.i.hhh.g.....hh.......","......ii.ii.hhh.g......h..ii....","......iii.hhhh.g......hh..ii....",".....w.iihhhh.g......hh..ii.....","......iihhhhgg.....hh...iii.....",".....i.hhhig.hhhhhhh...iii......","....i.hhhigi..........iii.......",".....hhh.g.iii......iii.........",".....hh.g....iiiiiiii...........",".......g........................","................................","................................","................................"]) },
  deckung: { w: 32, h: 32, cells: R(["................................","................................","................................","................................","......iiiiiiiiiiiiiiiiiigg......","......ihhhhhhhhhhhhhhhhhgg......","......ihhhhhhhhhhhhhhhhhgg......","......ihhhhhhhhhhhhhhhhhgg......","......ihhhhhhhhYYhhhhhhhgg......","......ihhhhhhhhYYhhhhhhhgg......","......ihhhhhhhhYYhhhhhhhgg......","......ihhhhhhhhYYhhhhhhhgg......","......ihhhhhhhhYYhhhhhhhgg......","......ihhhhYYYYYYYYYYhhhgg......","......ihhhhYYYYYYYYYYhhhgg......","......ihhhhhhhhYYhhhhhhhgg......","......ihhhhhhhhYYhhhhhhhgg......","......ghhhhhhhhYYhhhhhhggg......",".......ghhhhhhhYYhhhhhggg.......","........ghhhhhhYYhhhhggg........",".........ghhhhhYYhhhggg.........","..........ihhhhYYhhhgg..........","..........ghhhhYYhhggg..........","...........ghhhhhhggg...........","............ghhhhggg............",".............ghhggg.............","..............gggg..............","...............gg...............","................................","................................","................................","................................"]) },
  schildwall: { w: 32, h: 32, cells: R(["................................","................................","................................","................................","........iiiiiiiiiiiiiigg........","........ihhhhhhhhhhhhhgg........","........ihhhhhhhhhhhhhgg........","........ihhhhhhhhhhhhhgg........","..hhhhhhihhhhhhhhhhhhhgghhhhxx..","..hgggggihhhhhhhhhhhhhggggggxx..","..hgggggihhhhhhhOOhhhhggggggxx..","..hgggggihhhhhhOOOOhhhggggggxx..","..hgggggihhhhhJOOOOUhhggggggxx..","..hgggggihhhhJJJwwUUUhggggggxx..","..hgggggihhhhJJJwwUUUhggggggxx..","..hgggggihhhhhJFFFFUhhggggggxx..","..hgggggghhhhhhFFFFhhgggggggxx..","..hgYYYYYghhhhhhFFhhhggYYYYYxx..","..xgYYYYYYihhhhhhhhhggYYYYYYxx..","...xggggYYghhhhhhhhgggYYggxxx...","....xgggYYgghhhhhhggggYYggxx....",".....xgggggxghhhhhgggggggxx.....","......hgggxx.ghhhgg.hgggxx......","......xggxxx..ihgg..xggxxx......",".......xxxx...gggg...xxxx.......","........xx.....gg.....xx........","................................","................................","................................","................................","................................","................................"]) },
  adrenalin: { w: 32, h: 32, cells: R(["................................","................................","................................","................................","................................","................................","................................","..................y.............","...........OOr...zyOOr..........",".........OOORROr.yyORROr........","........OORRRRRRzyRRRRRRr.......","........ORRwRRRRzYzzyRRRr.......","........ORRRRRRzzYYyyRRRr.......","........ORRRRRyyyYyyRRRRr.......","........ORRRRRRRRzyRRRRRr.......","........rRRRRRRRRyyRRRRrr.......",".........rRRRRRRyyRRRRrr........","..........rRRRRRyRRRrrr.........","...........rRRRRyRRrr...........","............rRRyRRrr............",".............rRRRrr.............","..............ORRr..............","..............rRrr..............","...............rr...............","................................","................................","................................","................................","................................","................................","................................","................................"]) },
  schwachstelle: { w: 32, h: 32, cells: R(["................................","................................","................................","................................","................R...............","................R...............","................R...............",".............RRRRRRR............","...........RRk..R..RRR..........","..........RR.k..R....RR.........",".........RR...k.R.....RR........","........RR....k.R......RR.......","........R......kR.......R.......",".......RR......kR.......RR......",".......R.......kR........R......",".......R........k........R......","....RRRRRRRRRRR.k.RRRRRRRRRRR...",".......R........kkk......R......",".......R......kkkk.......R......",".......RR..kkk..Rk......RR......","........Rkk.....R.k.....R.......","........RR......R.k....RR.......",".........RR.....R.k...RR........","..........RR....R..k.RR.........","...........RRR..R.kkRR..........",".............RRRkkRR............","..............kkR...............","................R...............","................R...............","................................","................................","................................"]) },
  wasserstrahl: { w: 32, h: 32, cells: R(["................................","...........................JU...","...JU......................JU...","...JU..................JU..wU...","...wU..................JU.......",".......................wU.......","................................","................................","................................",".....JU....................u....",".....JU..................VVu....",".....wU.................VVUUu...",".......................VVUUUu...",".....................VVVUUUuu...","..........VVVVVVVVVVVVUUUUuu....",".........VVUUUUUUUUUUUUUUuu.....",".......VVVUUUUUUUUUUUUUuuu......","......VVUUUUUUUUUUUUUUuu.....JU.",".....VVUUUUUUUUUUUUUUuu......JU.","...VVVUUUUuuuuuuuuuuuu.......wU.","..VVUUUUUuu.....................","..VUUUUuuu......................","..VUUUuu........................","..uUUuu.........................","...uuu..........................","...u............................","................................","................................","................................","................................","................................","................................"]) },
  flutwelle: { w: 32, h: 32, cells: R(["................................","................................","................................","................................","................................","................................","................................","................................","................................","...........VVuu.................","........VVVVUUuu................","......VVVUwwUUUUuu..............",".....VVUUwUUUuuuuuu.............",".....VUUUUUUuuuuu...............","....VVUUUUUUuu..................","....VUUUUUUUuu..................","...VVUUUUUUUUuu.................","...VUUUUUUUUUuu.................","..VVUUUUUUUUUUuu................","..VUUUUUUUUUUUUUVwVVVVVVuu......",".VVUUUUUUUUUUUUUUUUUUUUUUuu.....",".VUUUUUUUUUUUUUUUUUUUUUUwUUuu...",".VUUUUUUUUUUUUUUUUUUwUUUUUUUuu..",".VUUUUUUUUUUUUUUUUUUUUUUUUUUuu..",".VUUUUUUUUUUUUUUUUUUUUUUUUUUuu..",".VVVVVVVVVVVVVVVVVVVVVVVVVVVVVu.",".VUUUUUUUUUUUUUUUUUUUUUUUUUUUUu.",".VUUUUUUUUUUUUUUUUUUUUUUUUUUUUu.",".VUUUUUUUUUUUUUUUUUUUUUUUUUUUUu.",".VUUUUUUUUUUUUUUUUUUUUUUUUUUUUu.",".uuuuuuuuuuuuuuuuuuuuuuuuuuuuuu.","................................"]) },
  tropfen: { w: 32, h: 32, cells: R(["................................","................................","................................","................................","................................","................................","...............Vu...............","...............Vu...............","..............VVUu..............","..............VUUu..............",".............VVUUUu.............",".............VUUUUu.............","............VVUUUUUu............","............VUUUUUUu............","...........VVUUUUUUUu...........","...........VUUUUUUUUu...........","..........VVUUUUUUUUUu..........","..........VUUUUwUUUUUu..........","..........VUUUUUUUUUUu..........","..........VUUUUUUUUUUu..........","..........uUUUUUUUUUuu..........","...........VUUUUUUUUu...........","...........uUUUUUUUuu...........","............uuuuuuuu............","................................","................................","................................","................................","................................","................................","................................","................................"]) },
  dornenpeitsche: { w: 32, h: 32, cells: R(["................................","................................","..........................Gf....","........................y.GFGf..",".........................GGFFff.","........................GGFfff..",".......................fGffFff..","...........y............ffFff...",".......................FFFff....",".............FFF......FFF.......","...........FFFFFFFFF.FFF........",".........FFFFF.yFFFFFFF.........",".......FFFFF.......FFF..........","......FFFF......................","......FF........................","......FFF.......................",".......FF.......................",".......FF.......................","......yFF.......................",".......FFF......................","........FF......................",".......FFF......................",".......FF.y.....................","......FFF.......................",".....FFF........................","....FFF.........................","....FF..........................","...FFF..........................","...FF...........................","................................","................................","................................"]) },
  ranke: { w: 32, h: 32, cells: R(["................................","................................","................................","....................Gf..........","....................GFGf........","...................GGFFFf.......","..................GGFFFfff......",".................GGFFffFf.......","................FGFffFFff.......","..............FFfffFFFff........",".............FFFF.fffff.........",".......Gf...FFF......f..........",".......GFGf.FF..................","......GGFFffFF..................",".....GGFfffFF...................","....fGffFffF....................",".....ffFffF.....................",".......ffFFF....Gf..............","..........FF....GFGf............","..........FFF..GGFFff...........","...........FF.GGFfff............","...........FFfGffFff............","............FFffFff.............","...........FFF..ff..............","...........FF...................","..........FFF...................","..........FF....................",".........FFF....................",".........FF.....................","........FFF.....................","........FF......................","................................"]) },
  dornenwall: { w: 32, h: 32, cells: R(["................................","................................","................................","................................","................................","................................","................................","................................","......Gf.....Gf.....Gf.....Gf...","......Gf.....Gf.....Gf.....Gf...","......Gy.....Gy.....Gy.....Gy...","......Gf.....Gf.....Gf.....Gf...","......Gf.....Gf.....Gf.....Gf...","......Gf.....Gf.....Gf.....Gf...","......Gf.....Gf.....Gf.....Gf...","......Gf.....Gf.....Gf.....Gf...",".....GGFf...GGFf...GGFf...GGFf..",".....GFyf...GFyf...GFyf...GFyf..",".....GFFf...GFFf...GFFf...GFFf..",".....GFFf...GFFf...GFFf...GFFf..",".....GFFf...GFFf...GFFf...GFFf..",".....GFFf...GFFf...GFFf...GFFf..",".....GFFf...GFFf...GFFf...GFFf..",".....GFFf...GFFf...GFFf...GFFf..","....GGFFFf.GGFFFf.GGFFFf.GGFFFf.","....GFFFFf.GFFFFf.GFFFFf.GFFFFf.","..MMMMMMMMMMMMMMMMMMMMMMMMMMMnf.","..MNNNNNNNNNNNNNNNNNNNNNNNNNNnf.","..MNNNNNNNNNNNNNNNNNNNNNNNNNNn..","..nnnnnnnnnnnnnnnnnnnnnnnnnnnn..","................................","................................"]) },
  photosynthese: { w: 32, h: 32, cells: R([".........Y......................","..Y......Y......Y...............","...Y...........Y................","....Y..zzzzy..Y.................","......zzYYYYy...................",".....zzYYYYYYy..................","....zzYYYYYYYYy.................","....zYYYYYYYYYy.................","YYY.zYYYYYYYYYy.YYYY............","....zYYYYYYYYYy.................","....yYYYYYYYYyy.................",".....yYYYYYYyy..................","......yYYYYyy...................","....Y..yyyyy..Y.....Gf..........","...Y...........Y....GFGf........","..Y......Y......Y..GGFFFf.......",".........Y........GGFFFFFf......",".........Y.......GGFFFFFFFf.....",".........Y.......GFFFFFFFFfff...","................GGFFFFFFffFff...","...............GGFFFFfffFFff....","...............GFFFffFFFFff.....","..............GGffffFFFFFf......",".............fffFFfFFFFFff......","...............fffFFFFFff.......",".................fffFFff........","................f...fff.........","...............f......f.........","..............f.................","................................","................................","................................"]) },
  sporenwolke: { w: 32, h: 32, cells: R(["................................","................................","...............GGF..............","..............GGGGF.............",".......GGF....GGGGF.............","......GGGGF...FGGFF.....GGF.....","......GGGGF....FFFmm...GGGGF....","......FGGFF..wwwBBBBmm.GGGGF....",".......FFF..wwBBBBBBBmmFGGFF....","...........wwBBBBBBBBBmmFFF.....","...........wBBBBBBBBBBmm........","..........wwBBBGfBBBBBBmm.......","........wwwBBBBGFGfBBBBBmm......","......wwwBBBBBGGFFffBBBBBBmm....",".....wwBBBBBBGGFfffBBBBBBBBmm...","....wwBBBBBBfGffFffBBBBBBBBBmm..","....wBBBBBBBBffFffBBBBBBBBBBmm..","....wBBBBBBBBBBffBBBBBBBBBBBmm..","....wBBBBBBBBBBBBBBBBBBBBBBBmm..","....mBBBBBBBBBBBBBBBBBBBBBBmmm..",".....mmBBBBBBBBBBBBBBBBBBmmmm...","......mmmmmmmmmmmmmmmmmmmmmm....","........mmmmmmmmmmmmmmmmmm......","................................",".....GGF...............GGF......","....GGGGF....GGF......GGGGF.....","....GGGGF...GGGGF.....GGGGF.....","....FGGFF...GGGGF.....FGGFF.....",".....FFF....FGGFF......FFF......",".............FFF................","................................","................................"]) },
  blutsauger_ranke: { w: 32, h: 32, cells: R(["................................","................................","................................","................................","................................","................................","................................","................................","....FF..........................","....FFFF........................",".....FFFy.......................",".......FFFF.....................","........FFFF..........w.w.......","..........FF....................",".........FFFy..........w........",".........FF.....................",".........FF.....................",".........FF...........FF........","........FFF..........FFFOr......","........FFF.........FFF.Or......","........FFFFF.y...FFFF.OORr.....","..........FFFFFF.FFFF..ORRr.....","............FFFFFFF...OORRRr....","...............FFF....ORwRRr....","..................y...rRRRrr....",".......................rrrr.....","................................","................................","................................","................................","................................","................................"]) },
  rankendornen: { w: 32, h: 32, cells: R(["................................","................................","................................","................................","................................",".......GGGGGGGGGGGGGGGGff.......",".......GFFFFFFFFFFFFFFFff.......","..y....GFFFFFFFFFFFFFFFff.y.....",".......GFFFFFFFFFFFFFFFff.......","....FF.GFFFFFFFYYFFFFFFff...FF..","....FFFGFFFFFFFYYFFFFFFff..FFF..",".....FyFFFFFFFFYYFFFFFFff.FFF.y.","......FFFFFFFFFYYFFFFFFff.FF....","......FFFFFFFFFYYFFFFFFffFFF....",".......FFFFYYYYYYYYYYFFfFFF.....",".......GFFFYYYYYYYYYYFFfFF......",".......GFFFFFFFYYFFFFFFfFF......",".......fFFFFFFFYYFFFFFffFF......","........FFFFFFFYYFFFFffFFF......",".......y.FFFFFFYYFFFfyfFF.......",".........FFFFFFYYFFFff.FF.......",".........FFGFFFYYFFff..FF.......",".......FFFFfFFFFFFfff..FFFF.....","......FFFF.yfFFFFfff....FyFF....","....FFFF.....fFFfff.......FFFF..","...FFFF.......ffff.........FFFF.","...FF..........ff............FF.","................................","................................","................................","................................","................................"]) },
  wurzelgeflecht: { w: 32, h: 32, cells: R(["...............Gf...............","...............GFGf.............","..............GGFFff............",".............GGFfff.............","............fGffFff.............",".............ffFff..............","...............ffN..............","................NN..............","................NN..............","................NN..............","................NN..............","................NN..............","................NN..............","................NN..............","................MM..............","...............NNNN.............","..............NNNNNN............",".............NNN..NNN...........","...........NNNN....NNNN.........","..........NNNN......NNNN........",".........NNN..........NNN.......","........NNN............NNN......",".......NNN..............NNN.....","......NNNN..............NNNN....","......NNNN..............NNNN....",".....NNNNNN............NNNNNN...",".....NN..NNN..........NNN..NN...","....NNN...NNN........NNN...NNN..","....NN.....NN........NN.....NN..","...NNN.....NNN......NNN.....NNN.","...NN.......NN......NN.......NN.","................................"]) },
  flammenhieb: { w: 32, h: 32, cells: R(["................................","................................","................................",".......oo.......................","......YYoo..................O...","......YOoo.........O.....O.O....",".....YYOOoo.........OOO.O.ooo...","....YYOOYOoo...........OOoooo...","....YOOYYYoo..........O.OOooo...","....YOYYYYYo.........O.ooOOo.r..","....YOYYYYYo........O.ooooOOr...","....ooYYYYYo.......O.ooooo.O....",".....ooYYYo.......O.ooooo.rOO...",".......YYY.......O.ooooo.r..O...","................O.ooooo.r...O...","...............O.ooooo.r.....O..","..........YY..O.ooooo.r......O..","..........YYYO.ooooo.r.......O..","...........YYYooooo.r........O..","............YYYooo.r............",".............YYYo.r.............","............NNYYYr..............","...........NNN.YYY..............","..........NNN...YYY.............",".........NNN.....YY.............","........NNN.....................","........NN......................","......YY........................","................................","................................","................................","................................"]) },
  feuerball: { w: 32, h: 32, cells: R(["................................","................................","................................","................................","................................",".................YYYYYoo........","...............YYYOOOOOOoo......","..............YYOOOOOOOOOoo.....",".............YYOOOOOOOOOOOoo....","............YYOOOzzzzzOOOOOoo...","............YOOOzzzzzzzOOOOoo...","...........YYOOzzzzzzzzzOOOOoo..","...........YOOOzzzzzzzzzOOOOoo..","...........YOOOzzzzzzzzzOOOOoo..","...........YOOOzzzzzzzzzOOOOoo..","...........YOOOzzzzzzzzzOOOOoo..","...........YOOOOzzzzzzzOOOOOoo..","...........oOOOOOzzzzzOOOOOooo..","............YOOOOOOOOOOOOOOoo...","............oOOOOOOOOOOOOOooo...","...........OOoOOOOOOOOOOOooo....","..........OOooooOOOOOOOoooo.....",".........OOooooooooooooooo......","........OOooorrr.ooooooo........","........Ooorrr..................",".......Orrrr....................","......rrr.......................",".....rr.........................","....r...........................","................................","................................","................................"]) },
  inferno: { w: 32, h: 32, cells: R(["................................","................................","................................","...............rr...............","...............rr...............","..............OOrr..............","..............Oorr..............",".............OOoorr.............",".............Ooooorr............","............OOoooorr............","............Ooooooorr..oo.......","...........OOoooooorr..oo.......",".......oo.OOoooooooorrYYoo......",".......oo.OooooooooorrYOOoo.....","......YYooOooooOOOoorrYOOoo.....",".....YYOOoOoooOOOOOorrOOOOoo....",".....YOOOOOoooOooOOoorrOOOoo....","....YYOOOOOooOOooOOOorrOOOOoo...","...YYOOOOOoooOYYooOOorrYYYOoo...","...YOOOYYOoooOYOooOOorrYYYYoo...","...YOOYYYOoooYYOOooOorrYYYYoo...","...YOOYYYOoooYOOYooOorrYYYYOoo..","..YYOOYYYOoooYOYYYooorrYYYYOoo..","..YOOOYYYrooYYOYYYoorrrYYYYOoo..","..oOOOYYYYOoYOYYYYYorrYYYYYooo..","...YOOYYYYrooOYYYYYorrYYYYYoo...","...oooYYYYYrrooYYYorroYYYYYoo...","....oooYYYorrooYYYorrooYYYoo....","........Y.......Y...............","................................","................................","................................"]) },
  phoenixschlag: { w: 32, h: 32, cells: R(["................................","................................","................................","...oo......................oo...","....YYo..................YYo....","....YOOYYo............YYYYOo....","....YOOOOOYo........YYYOOOOo....","....oOOOOOOOYo.OOrYYYOOOOOoo....",".....YOOOOOOOOOOoorOOOOOOOo.....",".....YOOOOOOOOOkokorOOOOOOo.....",".....oOOOOOOOOooooorOOOOOoo.....","......YOOOOOOOooYooorOOOOo......","......YOOOOOOooooooorOOOOo......",".....YYOOOOOOooooooorOOOOOo.....","....YYOOOOOOOooooooorOOOOOOo....","....YOOOOOOOroooooorrOOOOOOo....","...ooooooooOOOooooorooooooooo...","...........ooroooorro...........",".............oroorr.............","..............orrr..............","...............Or...............","...............Or...............","..............OOor..............","..............Ooor..............",".............OOooor.............",".............Orrror.............","............Orr..ror............","............rr....rr............","...........r........r...........","................................","................................","................................"]) },
  funke: { w: 32, h: 32, cells: R(["................................","................................","................................","................................","................................","................................","...............Yo...............","...............Yo...............","...............Yo...............","..............YYOo..............","..............YOOo..............","..............YOOo..............","..............YOOo..............",".............YYzzzo.............","..........YYYYzzzzzYYo..........",".......YYYYOOzzzzzzzOOYYo.......","....oooYOOOOOzzzzzzzOOOOoooo....",".......oooOOOzzzzzzzOoooo.......","..........oooOzzzzzooo..........",".............oOzzzo.............","..............YOOo..............","..............YOOo..............","..............YOOo..............","..............oOoo..............","...............Yo...............","...............Yo...............","...............oo...............","................................","................................","................................","................................","................................"]) },
  flammenwelle: { w: 32, h: 32, cells: R(["................................","................................","................................","................................","................................","................................","................................","................................","................................","................................",".....................oo.........",".........oo..........oo.........",".........oo.........YYoo........","........YYoo........YOoo........","........YOoo.......YYOOoo.......",".......YYOOoo..oo..YOOOoo.......",".......YOOOoo..oo..YOOOOoo......","...oo..YOOOOooYYooYYOYYYoo.oo...","...YooYYOYYYoYYOOoYOOYYYooYYoo..","..YYooYOOYYYoYOOOoYOYYYYYoYOoo..",".YYOOoYOYYYYYYOOYOYOYYYYYYYOOoo.","YYOOYOYOYYYYYOOYYYYOYYYYYYOOYOoo","YOOYYYYOYYYYYOYYYoYOYYYYYOOYYYoo","YOYYYYYOYYYYYOYYYYYOYYYYYOYYYYYo","YOYYYYYOYYYYYOYYYYoOYYYYYOYYYYYo","ooYYYYoooYYYooYYYYYooYYYooYYYYYo",".OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOr",".Oooooooooooooooooooooooooooooor",".Oooooooooooooooooooooooooooooor",".Oooooooooooooooooooooooooooooor",".rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr","................................"]) },
  meteor: { w: 32, h: 32, cells: R(["................................","................................","................................","................................",".......oo.......................","...rr...Yo......................","....Or..oOYo....................","....roOr.YOOo...................",".....rooroOOOo..................","......OooOYOOOYo................","......rooooOOOOOo...............",".......OooooOOOOOYo.............",".......rooooYOOOOOoo............","........OooooOOOOoohhhxx........","........rooooYOOOhhhggggxx......",".........rooooOhhhggggggggxx....","..........OoooYhggOgggggggxx....","..........roorhhgOgggggggggxx...","...........Orrhggggxgggggggxx...","...........rrhhgggggggggggggxx..",".............hggggggggggggggxx..",".............hggggggggggggggxx..",".............hggggggggggxgggxx..",".............xgggggggggggggxxx..","..............hggggggggggggxx...","..............xgggggxgggggxxx...","...............xgggggggggxxx....","...............xxxgggggxxxxx....",".................xxxxxxxxx......","...................xxxxx........","................................","................................"]) },
  feuersturm: { w: 32, h: 32, cells: R(["................................","................................","................................","................................",".............OOOOOOOOO..........","...........OOOO.....OOOO........",".........OOOO.........OOO.......","........OOO.....................",".......OOOO..ooooooooo..........","......OOO...oooo...ooooo........","......OOO.oooo.......oooo.......",".....OOO.oooo.........ooo.......",".....OOO.ooo..YYYYYY...ooo......","....OOO.oooo.YYoo.YYY..oooo.....","....OOO.....YYYoo..YY...ooo.....","....OOO.....YYYYoo......ooo.....","....OOO.....YYYOYoo.....ooo.....","....OOO.....YYOYYYo.YY..ooo.....","....OOO.....YYOYYYoYYY..ooo.....","....OOO.....oooYYYooY..oooo.....",".....OOO.....ooYYYoY...ooo......",".....OOO.......YYY....oooo......","......OOO............oooo.OOO...","......OOO..........oooo...OOO...",".......OOOO..ooooooooo..OOOO....","........OOO.............OOO.....",".........OOOO.........OOOO......","...........OOOO.....OOOO........",".............OOOOOOOOO..........","................................","................................","................................"]) },
  lodernder_schmerz: { w: 32, h: 32, cells: R(["...............oo...............","...............Yoo..............","..............YYoo..............",".............YYOOoo.............","............YYOOOOoo............","............YOOOOOoo............","...........YYOOYYYOoo...........","...........YOOYYYYYoo...........","...........YOOYYYYYoo...........","...........YOOYYYYYoor..........","........OOOYOOYYYYYooOOOr.......",".......OORRoooYYYYYooRRRRr......","......OORRRRoooYYYooRRRRRRr.....","......ORRRwRRRRYYYRRRRRRRRr.....","......ORRRRRRRRRRRRRRRRRRRr.....",".....rORRRRRRRRRRRRRRRRRRRrr....","......ORRRRRRRRRRRRRRRRRRRr.....",".....rORRRRRRRRRRRRRRRRRRRr.....","......rRRRRRRRRRRRRRRRRRRrr.....",".......rRRRRRRRRRRRRRRRRrr......","........rRRRRRRRRRRRRRrrr.......",".........rRRRRRRRRRRRrr.........","..........rRRRRRRRRRrr..........","...........rRRRRRRRrr...........","............ORRRRRRr............","............rRRRRRrr............",".............rRRRrr.............","..............rRrr..............","...............rr...............","................................","................................","................................"]) },
  selbstentzuendung: { w: 32, h: 32, cells: R(["................................","...............oo...............","..............YYoo..............",".............YYOOoo.............","............YYOOOOoo............","............YOOYYYoo............","............YOYYYYYoo...........",".....oo....YYOYYYYYoo....oo.....",".....oo....oooYYYYYoo....oo.....","....YYoo....ooYYYYYos...YYoo....","...YYOOoo...tSSYYYSSs..YYOOoo...","...YOOYoo...tSSSSSSSs..YOOYoo...","...YOYYYoo..sSSSSSSss..YOYYYoo..","..YYOYYYoo...sSSSSss..YYOYYYoo..","..YOYYYYYo....sssss...YOYYYYYo..","..ooYYYYYo.VVVVVVVVVu.ooYYYYYo..","...ooYYYo..VUUUUUUUUu..ooYYYo...",".....YYYu..VUUUUUUUUu..VUYYY....","......VUu..VUUUUUUUUu..VUu......","......VUu.VVUUUUUUUUUu.VUu......","......VUu.VUUUUUUUUUUu.VUu......","......VUu.VUUUUUUUUUUu.VUu......","......VUu.VUUUUUUUUUUu.VUu......","......VUu.VUUUUUUUUUUu.VUu......","......VUu.VUUUUUUUUUUu.VUu......","......uuu.VUUUUUUUUUUu.uuu......",".........VVUUUUUUUUUUUu.........",".........VUUUUUUUUUUUUu.........",".........uuuuuuuuuuuuuu.........","................................","................................","................................"]) },
  flammenmantel: { w: 32, h: 32, cells: R(["................................","................................","................................","................................","............zzzzzzzy............","............zYYYYYYy............",".........OOOzYYYYYYyOrr.........",".........ORRzYYYYYYyRrr.........","........OORRyyyyyyyyRRrr........","........ORRRRRRRRRRRRRrr........","........ORRRRRRRRRRRRRrr........","........ORRRRRRRRRRRRRrr........",".......OORRRRRRRRRRRRRRrr.......",".......ORRRRRRRRRRRRRRRrr.......",".......ORRRRRRRRRRRRRRRrr.......",".......ORRRRRRRooRRRRRRrr.......","......OORRRRRRRooRRRRRRRrr......",".....ooRRRRRRRYYooRRRRRRroo.....",".....ooRRRRRRYYOOooRRRRRroo.....","....YYooRRRRRYOOOooRRRRRYYoo....","...YYOOooRRRYYOOYOooRRRYYOOoo...","...YOOYooRRRYOOYYYooRRRYOOYoo...","...YOYYYooRRYOYYYYYoRRRYOYYYoo..","..YYOYYYooRRYOYYYYYoRRYYOYYYoo..","..YOYYYYYoRRYOYYYYYoRRYOYYYYYo..","..ooYYYYYoRRooYYYYYoRRooYYYYYo..","...ooYYYorrrrooYYYorrrrooYYYo...","...rrYYYrrrrrrrrYrrrrrrrrYYYr...","................................","................................","................................","................................"]) },
  giftklinge: { w: 32, h: 32, cells: R(["................................","................................","................................","................................","............................G...",".........................G.G....","........................G.FFF...",".......................G.FFFF...","......................G.FFFFF...","........Pq...........G.FFFFF.f..","........Pq..........G.FFFFF.f...",".......PPQq........G.FFFFF.f....",".......PQQq.......G.FFFFF.f.....","......qPwQqq.....G.FFFFF.f......",".......PQQq.....G.FFFFF.f.......",".......qqqq....G.FFFFF.f........","..........YY..G.FFFFF.f.........","..........YYYG.FFFFF.f..........","...........YYYFFFFF.f...........","............YYYFFF.f............",".............YYYF.f.............","............NNYYYf..............","...........NNN.YYY......Gf......","..........NNN...YYY.....Gf......",".........NNN.....YY....GGFf.....","........NNN............GwFf.....","........NN.............ffff.....","......YY........................","................................","................................","................................","................................"]) },
  giftwolke: { w: 32, h: 32, cells: R(["................................","................................","................................","................................","................................","...............GGGff............",".............GGGFFFFff..........","............GGFFFFFFFff.........","...........GGFFFFFFFFFff........","...........GFFFFFFFFFFff........","..........GGFFwwwwBFFFFff.......","........GGGFFwwmmmmBFFFFff......","......GGGFFFwwmmmmmmBFFFFFff....",".....GGFFFFFwmmmmmmmBFFFFFFff...","....GGFFFFFFwmkkmkkmBFFFFFFFff..","....GFFFFFFFwmmmmmmmBFFFFFFFff..","....GFFFFFFFBmmmkmmBBFFFFFFFff..","....GFFFFFFFFBwwwwBBFFFFFFFFff..","....fFFFFFFFFFwmkmBFFFFFFFFfff..",".....ffFFFFFFFBBBBBFFFFFFffff...","......ffffffffffffffffffffff....","........ffffffffffffffffff......","................................","................................","................................","................................",".....Gf.................Gf......",".....Gf.................Gf......",".....wf.................wf......","................................","................................","................................"]) },
  pandemie: { w: 32, h: 32, cells: R(["................................","................................","................................","...............PPPqq............",".............PPPQQQQqq..........","............PPQQQQQQQqq.........","...........PPQQQQQQQQQqq........","...........PQQQQQQQQQQqq........","..........PPQQQQQQQQQQQqq.......","........PPPQQQQGGGffQQQQqq......","......PPPQQQQGGGFFFFffQQQQqq....",".....PPQQQQQGGFFFFFFFffQQQQqq...","....PPQQQQQGGFFFFFFFFFffQQQQqq..","....PQQQQQQGFFwwwwBFFFffQQQQqq..","....PQQQQQGGFwwmmmmBFFFffQQQqq..","....PQQQGGGFwwmmmmmmBFFFffQQqq..","....qQGGGFFFwmmmmmmmBFFFFFffqq..",".....GGFFFFFwmkkmkkmBFFFFFFff...","....GGFFFFFFwmmmmmmmBFFFFFFFff..","....GFFFFFFFBmmmkmmBBFFFFFFFff..","....GFFFFFFFFBwwwwBBFFFFFFFFff..","....GFFFFFFFFFwmkmBFFFFFFFFFff..","....fFFFFFFFFFBBBBBFFFFFFFFfff..",".....ffFFFFFFFFFFFFFFFFFFffff...","......ffffffffffffffffffffff....","........ffffffffffffffffff......","....Gf....................Gf....","....Gf.............Gf.....Gf....","....wf.....Gf......Gf.....wf....","...........Gf......wf...........","...........wf...................","................................"]) },
  aufschlitzen: { w: 32, h: 32, cells: R(["................................","................................","................................","................................",".............rOOOr..............","......rOOOr...ORRr..rOOOr.......",".......ORRr...ORRRr..ORRr.......",".......ORRRr..ORRRr..ORRRr......",".......ORRRr..rRRRr..ORRRr......",".......rRRRr...ORRRr.rRRRr......","........ORRRr..ORRRr..ORRRr.....","........ORRRr..rRRRr..ORRRr.....","........rRRRr...ORRr..rRRRr.....",".........ORRr...ORRRr..ORRr.....",".........ORRRr..ORRRr..ORRRr....",".........ORRRr..rRRRr..ORRRr....",".........rRRRr...ORRRr.rRRRr....","..........ORRRr..ORRRr..ORRRr...","..........ORRRr..ORRRr..ORRRr...","..........ORRRr..rRRRRr.OROrr...","..........rRRRRr..ORRRr.rROrRr..","...........ORRRr..ORRRr..OwrRr..","...........ORRRr..rRRRr..ORRRr..","...........rRRRr...ORRRr.rRRRr..","............ORRRr..ORRRr..ORRRr.","............ORRRr..ORRRr..ORRRr.","............ORRRr..rRRRRr.ORRRr.","............rRRRRr..rrrrr.rRRRRr","........r....rrrrr.....r...rrrrr","................r...............","................................","................................"]) },
  blutrausch: { w: 32, h: 32, cells: R(["................................","................................","................................","................................","...............rr...............","..............OOrr..............",".............OORRrr.............","............OORRRRrr............","...........OORRRRRRrr...........",".........OOORRRRRRRRRrr.........","........OORRRRRRRRRRRRrr........",".......OORRRRRRRRRRRRRRrr.......","......OORRRRRRRRRRRRRRRRrr......",".....OORRRRRRRRRRRRRRRRRRrr.....","....OORRRRYYRRRRRRRRRYYRRRrr....","....ORRRRRRRYRRRRRRRYRRRRRrr....","....ORRRRRRRRRRRRRRRRRRRRRrr....","....rRRRRRRRRRRRRRRRRRRRRrrr....",".....ORRRRRRRRRRRRRRRRRRRrr.....",".....ORRRRRRRRRRRRRRRRRRRrr.....",".....ORRRRRRRRRRRRRRRRRRRrr.....",".....ORRRRRRRRRRRRRRRRRRRrr.....",".....ORRRRRRwwwwwwwwwRRRRrr.....",".....rRRRRRRwwwwwwwwRRRRrrr.....","......ORRRRRRwwRRwwRRRRRrr......","......rRRRRRRwwRRwwRRRRrrr......","......rrrrRRRwwRRwwRrrrrrr......","........rrrrRRRRRRrrrrrr........","...........rrrrrrrrrr...........",".............rrrrrr.............","................................","................................"]) },
  blutopfer: { w: 32, h: 32, cells: R(["................................","................................","..............iiig..............","..............ihhg..............","..............ihhg..............","..............ihhg..............","..............ihhg..............","..............ihhg..............","..............ihhg..............","..............ghgg..............","...............ig...............","...............ig...............","...............ig...............","...............ig...............","...............ig...............","...............ig...............","...........zzzzzzzzzzy..........","...........zYYYYYYYYYy..........","...........yyyyyRyyyyy..........","................R...............","...............Or...............","...............Or...............","..............OORr..............","..............ORRr..............",".............OORRRr.............",".............ORRRRr.............","............OORwRRRr............","............rRRRRRrr............",".............rRRRrr.............","..............rrrr..............","................................","................................"]) },
  blutdurst: { w: 32, h: 32, cells: R(["................................","................................","................................","................................","................................",".............wwwwwwm............","..........wwwwBBBBBBwwm.........",".........wwBBBBBBBBBBBBm........","........wwBBBBBBBBBBBBBBm.......",".......wwBBBBBBBBBBBBBBBBm......","......wwBBBRRBBBBBBBRRBBBBm.....","......wBBBBBBBBBBBBBBBBBBBm.....",".....wwBBBBBBBBBBBBBBBBBBBBm....",".....wBBBBBBBBBBBBBBBBBBBBBm....",".....wBBBBBBBBBBBBBBBBBBBBBm....",".....wBBBwwwwBBBBBBwwwwBBBBm....",".....mBBBwwwwBBBBBBwwwwBBBmm....","......wBBwwwwBBBBBBwwwwBBBm.....","......mBBBwwBBBBBBBBwwBBBmm.....",".......mBBwwBBBBBBBBwwBBmm......","........mBwwBBBBBBBBwwBmm.......",".........mwwBBBBBBBBwwmm........","..........wwmBBBBBBmwwm.........",".............mmmmmmm............","...............Or...............","...............Or...............","..............OORr..............","..............OwRr..............","..............rrrr..............","................................","................................","................................"]) },
  zerfleischen: { w: 32, h: 32, cells: R(["................................","................................","................................","................................","..........rOOOr..xhhhx..........","...rOOOr..xhhhx..rhggx..xhhhx...","....ORRr...hggxr..hgggx..hggx...","....ORRRr..hgggx..hgggx..hgggx..","....ORRRr..hgggx..xgggx..hgggx..","....rRRRr..xgggxr.rhgggx.xgggx..",".....ORRRr..hgggx..hgggx..hgggx.",".....ORRRr..hgggx..xgggx..hgggx.",".....rRRRr..xgggx..rhggx..xgggx.","......ORRr...hggxr..hgggx..hggx.","......ORRRr..hgggx..hgggx..hgggx","......ORRRr..hgggx..xgggx..hgggx","......rRRRr..xgggxr.rhgggx.xgggx",".......ORRRr..hgggx..hgggx..hggx",".......ORRRr..hgggx..hgggx..hggx",".......ORRRr..hgggxr.xggggx.hggx",".......rRRRRr.xggggx.rhgggx.xggx","........ORRRr..hgggx..hgggx..hgx","........ORRRr..hgggx..xgggx..hgx","........rRRRr..xgggxr.rhgggx.xgx",".........ORRRr..hgggx..hgggx..hx",".........wwRRr.wwgggxwwhgggww.hx",".........wwRRr.wwgggxwwxgggww.hx","........wwwwRRwwwwggwwwwxxwwwwxx","..........rrrrr..xxxxx..rrrrr..x","................................","................................","................................"]) },
  aderlass: { w: 32, h: 32, cells: R(["................................","................................","................................","................................","............................i...","...........................i....","....................iiiiiii.....","....................ihhhhig.....","....................ihhhihg.....","..................OOOOrihhg.....","..................ORRRrhhhg.....",".......Or.........ORRRrhhhg.....",".......Or.........ORRRrgggg.....","......OORr........ORRRrh........","......ORRr........ORRRr.........",".....rOwRrr......hrrrrr.........","......ORRr......hhhhh...........","......rrrr.....hhhhh............","..............hhhhh.............",".............hhhhh..............","............hhhhh...............","...........hhhhh................","..........hhhhh.................",".........hhhhh..................","........hhhhh...................",".......hhhhh....................","......hhhhh.....................",".....ihhhh......................","....i.hhh.......................","................................","................................","................................"]) },
  eissplitter: { w: 32, h: 32, cells: R(["................................","................................","................................","................................","................................","...............JU...............","...............JU...............","..............JJVU..............","..............JJVU..............",".............JJJVVU.....w.......",".............JVJVVU.............","............JJVJVVVU............","............JVVJVVVU............","...........JJVVJVVVVU...........","...........JVVVJVVVVU......w....","..........JJVVVJVVVVVU..........","..........JVVVVJVVVVVU..........","..........JVVVVJVVVVVU..........","..........UVVVVJVVVVUU..........","...........JVVVJVVVVU...........","...........JVVVJVVVVU...........","...........JVVVJVVVVU...........","...........UVVVJVVVUU...........","............JVVJVVVU............","......w.....JVVJVVVU............","............JVVJVVVU............","............UVVJVVUU............",".............JVVVVU.............",".............UUUUUU.............","................................","................................","................................"]) },
  frostnova: { w: 32, h: 32, cells: R(["................................","................................","............VVVVVVVVV...........","..........VVV.......VVV.........","........VVV...........VVV.......",".......VV...............VV......","......VV..J...........J..VV.....",".....VV....J..J...J..J....VV....","....VV.....J.J.....J.J.....VV...","....V.......JJ.....JJ.......V...","...VV...JJJJJ.......JJJJJ...VV..","...V.........J.....J.........V..","..VV..........J...J..........VV.","..V....J......J...J......J....V.","..V.....J......J.J......J.....V.","..V.....J......J.J......J.....V.","..V.JJJJJJJJJJJJwwJJJJJJJJJJJ.V.","..V.....J......J.J......J.....V.","..V.....J......J.J......J.....V.","..V....J......J...J......J....V.","..VV..........J...J..........VV.","...V.........J.....J.........V..","...VV...JJJJJ.......JJJJJ...VV..","....V.......JJ.....JJ.......V...","....VV.....J.J.....J.J.....VV...",".....VV....J..J...J..J....VV....","......VV..J...........J..VV.....",".......VV...............VV......","........VVV...........VVV.......","..........VVV.......VVV.........","............VVVVVVVVV...........","................................"]) },
  eiszeit: { w: 32, h: 32, cells: R(["................................","................................",".............J.J.J.J............","..............JJ..J.............","............JJJ...JJJ...........","...........J...J.J...J..........","............J..J.J...J..........","..........JJJJJJwwJJJJJ.........","............J..J.J...J..........","...........J...J.J...J..........","............JJJ...JJJ...........","..............JJ..J.............",".............J.J.J.J............",".....................ww.........",".....................ww.........","....................wwww........",".......ww..........Vwwww........",".......ww..........wwwwww.......","......wwww........Vwwwwww.......","......wwwwu......VVUUUUUu.......",".....VVUUUu......VUUUUUUUu......",".....VUUUUUu....VVUUUUUUUu......","....VVUUUUUUu..VVUUUUUUUUUu.....","....VUUUUUUUu..VUUUUUUUUUUu.....","...VVUUUUUUUUVVVUUUUUUUUUUUu....","...VUUUUUUUUUUUUUUUUUUUUUUUu....","..VVUUUUUUUUUUUUUUUUUUUUUUUUu...","..VUUUUUUUUUUUUUUUUUUUUUUUUUu...",".VVUUUUUUUUUUUUUUUUUUUUUUUUUUu..",".VUUUUUUUUUUUUUUUUUUUUUUUUUUUu..","uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu.","................................"]) },
  frostnadel: { w: 32, h: 32, cells: R(["................................","................................","................................","................................","..........................wU....",".........................wJUU...","........................JJUU....",".......................JJUU.....","......................JJUU......",".....................JJUU.......","....................JJUU........","...................JJUU.........","..................JJUU..........","................JJJUU...........","...............JJVUU............","..............JJVUU.............",".............JJVUU..............","............JJVUU...............","...........JJVUU................","..........JJVUU.................",".........JJVUU..................","........JJVUU...................","....JJJJJJUU....................","....JVVVVVU.....................","....JVVVVVU.....................","....JVVVVVU.....................","....JVVVVVU.....................","....JVVVVVU.....................","....UUUUUUU.....................","................................","................................","................................"]) },
  eisregen: { w: 32, h: 32, cells: R(["...........hhhhhhhhhhhxx........","..........hhgggggggggggxx.......","........hhhgggggggggggggxx......","......hhhgggggggggggggggggxx....",".....hhggggggggggggggggggggxx...","....hhggggggggggggggggggggggxx..","....hgggggggggggggggggggggggxx..","....hgggggggggggggggggggggggxx..","....hgggggggggggggggggggggggxx..","....xggggggggggggggggggggggxxx..",".....xxggggggggggggggggggxxxx...","......xxxxxxxxxxxxxxxxxxxxxx....","........xxxxxxxxxxxxxxxxxx......","................................","................................","................................","................................","....................JU..........","......JU............JU..........","......JU...........JJVU.........",".....JJVU..........UVUU.........",".....UVUU...........JU..........","......JU.....JU.....UU..........","......UU.....JU.................","............JJVU................","............UVUU................",".............JU..........JU.....",".........JU..UU..........JU.....",".........JU.............JJVU....","........JJVU............UVUU....","........UVUU.............JU.....",".........UU..............UU....."]) },
  schnellschuss: { w: 32, h: 32, cells: R(["................................","................................","................................","................................","................................","................................","................................","................................","..JJJJJJJJJ.................ig..",".........................iiigg..",".....iiiiiiiiii..........ghgg...",".........................oig....",".......................ooogg....",".....................ooo........","JJJJJJJJJ..........ooo..........",".................ooo............","...iiiiiiiiii..ooo..............",".............oooo...............","...........oooo.................",".........oooo...................",".......oooo.....................","......ooR.......................","......R.........................",".....R.R........................","................................","................................",".JJJJJJJJJ......................","................................","....iiiiiiiiii..................","................................","................................","................................"]) },
  zielen: { w: 32, h: 32, cells: R(["................................","................................","................................","................................","................R...............","................R...............","................R...............",".............RRRRRRR............","...........RRR..R..RRR..........","..........RR....R....RR.........",".........RR.....R.....RR........","........RR......R......RR.......","........R.......R.......R.......",".......RR.......R.......RR......",".......R........R........R......",".......R.................R......","....RRRRRRRRRRR.w.RRRRRRRRRRR...",".......R.................R......",".......R........R........R......",".......RR.......R.......RR......","........R.......R.......R.......","........RR......R......RR.......",".........RR.....R.....RR........","..........RR....R....RR.........","...........RRR..R..RRR..........",".............RRRRRRR............","................R...............","................R...............","................R...............","................................","................................","................................"]) },
  rolle: { w: 32, h: 32, cells: R(["................................","................................","................................","................................","................................","................................",".............JJJJJJJJJ..........","...........JJJJJ...JJJJJ........",".........JJJJJ..................",".........JJJ....................",".....JJJJJJ.....................","......JJJJJJJJ..................","......JJJJJJJ...................","......JJJJJJ....................","......JJJJJJ....MMMMMn..........","......JJJJJ.....MNNNNn..........","......JJJJ......MNNNNn..........","......JJJ.......MNNNNn..........","......JJJ.......MNNNNn..........","......JJJJ......MNNNNn..........",".......JJJ......MNNNNn..........",".......JJJJ.....MNNNNn..........","........JJJ.....MNNNNn..JJJ.....","........JJJJ....MNNNNNMMMMMn....","..........JJJ...MNNNNNNNNNNn....","...........JJJJJMNNNNNNNNNNn....",".............JJJxxxxxxxxxxxxx...","................xxxxxxxxxxxxx...","................................","................................","................................","................................"]) },
  praezisionsschuss: { w: 32, h: 32, cells: R(["................................","................................","................................","..........................ig....",".......................iiigg....",".......................ghgg.....","...............R........ig......","...............R........gg......","...............R.......oo.......",".............RRRRR....oo........","...........RR..R..RR.oo.........",".........RR....R....Roo.........",".........R.....R....oo..........","........R......R...oo.R.........","........R......R..oo..R.........",".......R.......R..oo...R........",".......R.........oo....R........","....RRRRRRRRRR.wooRRRRRRRRR.....",".......R.......oo......R........",".......R.......oo......R........","........R.....oo......R.........","........R....ooR......R.........",".........R..oo.R.....R..........",".........RR.oo.R....RR..........","...........oo..R..RR............","..........oo.RRRRR..............",".........oo....R................",".........oo....R................","........ooR....R................","........R.......................",".......R.R......................","................................"]) },
  giftpfeil: { w: 32, h: 32, cells: R(["................................","................................","................................","................................","..........................Gf....",".......................GGGff....",".......................fFff.....","........................Gf......",".......................off......","......................oo........",".......Gf............oo.........",".......Gf...........oo..........","......GGFf.........oo...........","......GwFf........oo............","......ffff.......oo.............","................oo..............","...............oo...............","..............oo................",".............oo.................","............oo..................","...........oo...................","..........oo....................",".........oo.....................","........oo..............Pq......",".......oo...............Pq......","......oo................wq......",".....ooG........................",".....G..........................","....G.G.........................","................................","................................","................................"]) },
  brandpfeil: { w: 32, h: 32, cells: R(["................................","........................oo......","........................Yoo.....",".......................YYoo.....","......................YYOOoo....","......................YOYYYo....",".....................YYOYYYoo...",".....................YOYYYYYo...",".....................ooYYYYYo...","......................ooYYYo....",".....................oo.YYY.....","....................oo..........","...................oo...........","..................oo............",".................oo.............","................oo..............","...............oo...............","..............oo................",".............oo.................","............oo..................","...........oo...................","..........oo....................",".........oo.....................","........oo......................",".......oo.......................","......oo........................",".....ooo........................",".....o..........................","....o.o.........................","................................","................................","................................"]) },
  eispfeil: { w: 32, h: 32, cells: R(["................................","................................","................................","................................","..........................JU....",".......................JJJUU....",".......................UVUU.....","........................JU......",".......................oUU......","......................oo........",".....................oo.........","....................oo..........","...................oo...........","..................oo............",".................oo.............","................oo..............","...............oo...............","..............oo................",".............oo.................","............oo..................","...........oo........J.J.J.J....","..........oo........JJJ...JJJ...",".........oo............J..J.....","........oo..........J..J.J..J...",".......oo..........JJJJJwwJJJJ..","......oo............J...JJ..J...",".....ooJ...............J..J.....",".....J..............JJJJ..JJJ...","....J.J...............JJ.J.J....","................................","................................","................................"]) },
  nachladen: { w: 32, h: 32, cells: R(["................................","................................","................................","...........gg..gg..gg...........","............M...M...M...........","............M...M...M...........","............M...M...M...........","............M...M...M...........","...........RM..RM..RM...........","............R...R...R...........","............M...M...M...........","............M...M...M...........",".........YYYMYYYMYYYMYYY........",".........YYYYYYYYYYYYYYY........","...........MNNNNNNNNn...........","...........MNNNNNNNNn...........","...........MNNNNNNNNn...........","..........MMNNNNNNNNNn..........","..........MNNNNNNNNNNn..........","..........MNNNNNNNNNNn..........","..........MNNNNNNNNNNn..........","..........MNNNNNNNNNNn..........","..........MNNNNNNNNNNn..........","..........MNNNNNNNNNNn..........","..........MNNNNNNNNNNn..........",".........MMNNNNNNNNNNNn.........",".........MNNNNNNNNNNNNn.........",".........MNNNNNNNNNNNNn.........",".........nnnnnnnnnnnnnn.........","................................","................................","................................"]) },
  salve: { w: 32, h: 32, cells: R(["................................","................................","................................","...............ig...............","...............ig...............",".......ig.....gggg.....ig.......",".......ig.......N......ig.......","......gggg......N.....gggg......","........N.......N.......N.......","........N.......N.......N.......",".......N........N........N......",".......N........N........N......",".......N........N........N......",".......N........N........N......",".......N........N........N......",".......N........N........N......","......N.........N.........N.....","......N.........N.........N.....","......N.........N.........N.....","......N.........N.........N.....","......N.........N.........N.....",".....N..........N..........N....",".....N..........N..........N....",".....N..........N..........N....",".....N..........N..........N....",".....N..........N..........N....",".....N..........N..........N....","....N...........N...........N...","....R...........R...........R...","....R...........R...........R...","................................","................................"]) },
  pfeilhagel: { w: 32, h: 32, cells: R(["................................","....RNR.........................","....RNR...........RNR...........",".....N............RNR...........",".....N.............N............",".....N.............N............",".....N.............N............",".....N.....RNR.....N............",".....N.....RNR.....N.....RNR....",".....N......N......N.....RNR....","...iiig.....N......N......N.....","...ghgg.....N....iiig.....N.....","....ig......N....ghgg.....N.....","....gg......N.....ig......N.....","............N.....gg......N.....","............N.............N.....","..........iiigRNR.........N.....",".......RNRghggRNR.......iiig....",".......RNR.ig..N........ghgg....","........N..gg..N.....RNR.ig.....","........N......N.....RNR.gg.....","........N......N......N.........","........N......N......N.........","........N......N......N.........","........N......N......N.........","........N....iiig.....N.........","......iiig...ghgg.....N.........","......ghgg....ig......N.........",".......ig.....gg....iiig........",".......gg...........ghgg........",".....................ig.........",".....................gg........."]) },
  fluchtschuss: { w: 32, h: 32, cells: R(["................................","................................","................................","................................","................................","................................","..............................ig","...........................iiigg","...........................ghgg.","............................ig..","...........................ogg..","..........................oo....","........................ooo.....",".......................oo.......","......................oo........",".....................oo.........","..MMMMMn............oo..........","..MNNNNn...........oo...........","..MNNNNn..........oo............","..MNNNNn........ooo.............","..MNNNNn.......ooo..............","..MNNNNn......oo................","..MNNNNn.....oo.................","..MNNNNn....ooR.................","..MNNNNn....R...................","..MNNNNNMMMMMn..................","..MNNNNNNNNNNn..................","..MNNNNNNNNNNn..................","..xxxxJJJJJJJJJJJJJ.............","..xxxxxxxxxxxxx.................",".........iiiiiiiiiiiiii.........","................................"]) },
  scharfschuetze: { w: 32, h: 32, cells: R(["................................","................................","................................","................................",".............hhhhhxx............","...........hhhggggggxx..........",".........hhhggggggggggxx........","........hhgggxxxRxxxgggxx.......",".......hhggxxxxxRxxxxxggxx......","......hhggxxxxxxRxxxxxxggxx.....","......hggxwwxxRRRRRxxxxxgxx.....",".....hhgxxwxRRRxRxRRRxxxxgxx....",".....hggxxxRRxxxRxxxRRxxxgxx....","....hhgxxxxRxxxxRxxxxRxxxxgxx...","....hggxxxRRxxxxRxxxxRRxxxgxx...","....hggxxxRxxxxxxxxxxxRxxxgxx...","....hggRRRRRRRRxwxRRRRRRRRgxx...","....hggxxxRxxxxxxxxxxxRxxxgxx...","....hggxxxRRxxxxRxxxxRRxxxgxx...","....xggxxxxRxxxxRxxxxRxxxxxxx...",".....hggxxxRRxxxRxxxRRxxxgxx....",".....xggxxxxRRRxRxRRRxxxxxxx....","......hggxxxxxRRRRRxxxxxgxx.....","......xgggxxxxxxRxxxxxxgxxx.....",".......xgggxxxxxRxxxxxgxxx......","........xxgggxxxRxxxgxxxx.......",".........xxxgggggggxxxxx........","...........xxxxxxxxxxx..........",".............xxxxxxx............","................................","................................","................................"]) },
  dauerfeuer: { w: 32, h: 32, cells: R(["................................","................................","................................",".......................ig.......","......R................ihg......","......NNNNNNNNNNNNNNNNNihggg....","......R................igg......",".......................gg.......","................................","...................ig...........","..R................ihg..........","..NNNNNNNNNNNNNNNNNihggg........","..R................igg..........","...................gg...........","................................",".........................ig.....","........R................ihg....","........NNNNNNNNNNNNNNNNNihggg..","........R................igg....",".........................gg.....","................................","....................ig..........","...R................ihg.........","...NNNNNNNNNNNNNNNNNihggg.......","...R................igg.........","....................gg..........","................................","................................","................................","................................","................................","................................"]) },
  pfeilsturm: { w: 32, h: 32, cells: R(["................................","................................","................................","...........................gg...","...........ggJJJJJJJJ.....ig....","..........igJJ......JJJ.giig....","........giig..........JJJggg....","........Jggg............NJg.....",".......JNJg...........NNJJJ.....","......NN.............Nig..JJ....",".....NJJ...........iiigg..JJ....","....NJJ............ghgg.........","...N.JJ.............ig..........","....JJ.............ogg..........","....JJ............oo............","....JJ...........oo.............","....JJ..........oo..........JJ..","....JJ.........oo...........Jgg.","....JJ........oo............ig..","....JJ.......oo...........giig..",".....JJ..gg.oo.............ggg..",".....JJ.ig.ooR............NJg...","......giig.R............NNJJ....","......JgggR.R..........N..JJ....","......NJgJ............N.JJJ.....","....NN..JJ...........N..JJ......","...N.....JJJ..........JJJ.......","..N........JJJ......JJJ.........",".N...........JJJJJJJJ...........","................................","................................","................................"]) },
  manaschild: { w: 32, h: 32, cells: R(["................................","................................","................................","................................",".............VVVVVuu............","...........VVVUUUUUUuu..........",".........VVVUUUUUUUUUUuu........","........VVUUUUUUUUUUUUUuu.......",".......VVUUUUUUUUUUUUUUUuu......","......VVUUUPPPPPPPPqqUUUUuu.....","......VUUUUPQQQQQQQqqUUUUuu.....",".....VVUUUUPQQQQQQQqqUUUUUuu....",".....VUUUUUPQQQQQQQqqUUUUUuu....","....VVUUUUUPQQQQQQQqqUUUUUUuu...","....VUUUUUUPQQQQQQQqqUUUUUUuu...","....VUUUUUUPQQQQQQQqqUUUUUUuu...","....VUUUUUUqQQQQQQQqqUUUUUUuu...","....VUUUUUUUqQQQQQqqUUUUUUUuu...","....VUUUUUUUUPQQQqqUUUUUUUUuu...","....uUUUUUUUUqQQqqqUUUUUUUuuu...",".....VUUUUUUUUqqqqUUUUUUUUuu....",".....uUUUUUUUUUqqUUUUUUUUuuu....","......VUUUUUUUUUUUUUUUUUUuu.....","......uUUUUUUUUUUUUUUUUUuuu.....",".......uUUUUUUUUUUUUUUUuuu......","........uuUUUUUUUUUUUuuuu.......",".........uuuUUUUUUUuuuuu........","...........uuuuuuuuuuu..........",".............uuuuuuu............","................................","................................","................................"]) },
  arkanblitz: { w: 32, h: 32, cells: R(["................................","................................","................................","................................","...................q............","...................q............",".....P............q.............",".................Pq.............",".................Pq.............","................PPq.............","...............PPqq.............","...............PQq..............","..............PPQq.........P....","..............PQQQPPPqq.........",".............PPQQQQQQq..........","............PPQQQQQQqq..........","............qqqqQQQqq...........","................PQQq............","................PQqq............","...............PPqq.............","...............PQq..............","...............Pqq..............","......P.......PPq...............","..............Pqq...............","..............qq................","..............q.................",".............qq...........P.....",".............q..................","................................","............q...................","................................","................................"]) },
  gedankenblitz: { w: 32, h: 32, cells: R(["................................","................................","................................","................................","............tttts........y......","..........tttSSSSts.....zy......","........tttSSSSSSSSts...yy......",".......ttSSSSSSSSSSSSs.zy.......",".......tSSSSSSSSSSSSSs.zYzzy....","......ttSSSSSSSSSSSSSSzzYYyy....","......tSSSSSSSSSSSSSSyyyYyy.....",".....ttSSSSSSSSSSSSSSSSszy......",".....tSSSSSSkSSSkSSSSSSsyy......",".....tSSSSSSSSSSSSSSSSSyy.......",".....tSSSSSSSSSSSSSSSSSy........",".....tSSSSSSSSSSSSSSSSSy........",".....tSSSSSSSSSSSSSSSSys........",".....sSSSSSSSSSSSSSSSSss........","......tSSSSSSSSSSSSSSSs.........","......sSSSSSSSSSSSSSSss.........",".......tSSSSSSSSSSSSSs..........",".......sSSSSSSSSSSSSss..........","........ssttttttttsss...........","..........tSSSSSSSs.............","..........tSSSSSSSs.............","..........tSSSSSSSs.............","..........tSSSSSSSs.............","..........tSSSSSSSs.............","..........sssssssss.............","................................","................................","................................"]) },
  arkaner_sturm: { w: 32, h: 32, cells: R(["................................","................................","................................","................................","...............Pq...............","...............Pq...............","...............Pq...............",".......q.......Pq.......q.......",".......qq.....PPQq.....qq.......","........PPq...PQQq...PPq........","........qQQPq.PQQq.PPPqq........",".........PQQQPPwPQPPQQq.........",".........qQQPQQwPQQPQqq.........","..........PQPPQwPQPPQq..........",".........PPQQwwwPwPQQQq.........","......PPPPQQQwPPPPPQQQQPPq......","..qqqqPQQPPPPwPPPPPPPPPQQqqqqq..","......qqqQQQQwPPPPPQQQqqqq......",".........qQQQPPPPPPQQqq.........","..........PQPPQwPQPPQq..........",".........PPQPQQwPQQPQQq.........",".........PQQqqQPPqqQQQq.........","........PPqqq.PQQq.qqQQq........","........qqq...PQQq...qqq........",".......qq.....qQqq.....qq.......",".......q.......Pq.......q.......","...............Pq...............","...............Pq...............","...............qq...............","................................","................................","................................"]) },
  prismasturm: { w: 32, h: 32, cells: R(["................................","................................","................................","...............JU...............","...............JU...............","..............JJVU..............","..............JVVU..............",".............JJVVVU.............",".............JVVVVU.............","............JJVwwVVU............","............JVVwwVVU............","...........JJVwwwwVVU...........","...........JVVwwwwVVU.........Y.","..........JJVwwwwwwVVU.......Y..","..........JVVwwwwwwVVU.....YY...",".........JJVwwwwwwwwVVU...Y.....","..RRR....JVVwwwwwwwwVVU..Y......",".....RRRRRVwwwwwwwwwwVVUY.......","........JVRRRwwwwwwwwVYY.....GG.",".......JJVwwwwwwwwwwwYVVU..GG...",".......JVVwwwwwwwwwwYwVVUGG.....","......JJVwwwwwwwwwwwwwwGGU......","......JVVwwwwwwwwwwwwGGVVU......",".....JJVwwwwwwwwwwwwwwwwVVU.....",".....JVVVVVVVVVVVVVVUUUUUVU.....","....JJVVVVVVVVVVVVVVVVVVVUUUUUU.","....UUUUUUUUUUUUUUUUUUUUUUUU....","................................","................................","................................","................................","................................"]) },
  eiserner_wille: { w: 32, h: 32, cells: R(["................................","................................","................................","................................","......iiiiiiiiiiiiiiiiiigg......","......ihhhhhhhhhhhhhhhhhgg......","......ihhhhhhhhhhhhhhhhhgg......","......ihhhhhhhhhhhhhhhhhgg......","......ihhhhhhhhhhhhhhhhhgg......","......ihhhhOOOOrhOOOOrhhgg......","......ihhhOORRRROORRRRrhgg......","......ihhhORwRRRRRRRRRrhgg......","......ihhhORRRRRRRRRRRrhgg......","......ihhhORRRRRRRRRRRrhgg......","......ihhhrRRRRRRRRRRrrhgg......","......ihhhhrRRRRRRRrrrhhgg......","......ihhhhhrRRRRRrrhhhhgg......","......ghhhhhhrRRRrrhhhhggg......",".......ghhhhhhrRrrhhhhggg.......","........ghhhhhhOrhhhhggg........",".........ghhhhhrrhhhggg.........","..........ihhhhhhhhhgg..........","..........ghhhhhhhhggg..........","...........ghhhhhhggg...........","............ghhhhggg............",".............ghhggg.............","..............gggg..............","...............gg...............","................................","................................","................................","................................"]) },
  schildstoss: { w: 32, h: 32, cells: R(["................................","................................","................................","................................","................................","................................","......iiiiiiiiiiiiiigg..........","......ihhhhhhhhhhhhhgg.......ww.","......ihhhhhhhhhhhhhgg.....ww...","......ihhhhhhhhhhhhhgg...ww.....","......ihhhhhhYYhhhhhgg..........","......ihhhhhhYYhhhhhgg..........","......ihhhhhhYYhhhhhgg..iiiiiiw.","......ihhhhhhYYhhhhhgg.....ww...","......ihhhhhhYYhhhhhgg...ww.....","......ihhYYYYYYYYYYhgg..........","......ihhYYYYYYYYYYhgg..........","......ghhhhhhYYhhhhggg.......ww.",".......ghhhhhYYhhhggg......ww...","........ghhhhYYhhggg.....ww.....",".........ghhhYYhhgg.............","..........ihhhhhgg..............","..........ghhhhggg..............","...........ghhggg...............","............gggg................",".............gg.................","................................","................................","................................","................................","................................","................................"]) },
  dornenpanzer: { w: 32, h: 32, cells: R(["................................","................................","................................","...............ig...............","...............ig...............","...............ig...............",".......iiiiiiiggggiiiiigg.......","....g..ihhhhhhhhhhhhhhhgg..g....",".....g.ihhhhhhhhhhhhhhhgg.g.....",".....gighhhhhhhhhhhhhhhgigg.....","......ggghhhhhhhhhhhhhhggg......",".......ihhhhhhhhhhhhhhhgg.......",".......ihhhhhhhhOOhhhhhgg.......",".......ihhhhhhhOOOOhhhhgg.......",".......ihhhhhhJOOOOUhhhgg.......",".......ihhhhhJJJwwUUUhhgg.......",".......ihhhhhJJJwwUUUhhgg.......",".......ihhhhhhJFFFFUhhhgg.......",".......ghhhhhhhFFFFhhhggg.......","........ghhhhhhhFFhhhggg........",".........ghhhhhhhhhhggg.........","..........ghhhhhhhhhgg..........","...........ihhhhhhhgg...........","...........ghhhhhhggg...........","............ghhhhggg............",".............ghhggg.............","..............gggg..............","...............gg...............","................................","................................","................................","................................"]) },
  bollwerk: { w: 32, h: 32, cells: R(["................................","................................","................................","................................","................................","................................","................................","....iiig...iiig...iiig...iiig...","....ihhg...ihhg...ihhg...ihhg...","....ihhg...ihhg...ihhg...ihhg...","....ihhg...ihhg...ihhg...ihhg...","....ihhg...ihhg...ihhg...ihhg...","....ggggiiiggggiiiggggiiigggg...","....ihhhhhhhhhhhhhhhhhhhhhgg....","....ihhhhhhhhhhhhhhhhhhhhhgg....","....ihhhhhhhhhhhhhhhhhhhhhgg....","....ihhhhhhhhhhhhhhhhhhhhhgg....","....ihhhxhhhhhhgkhhhhhhxhhgg....","....ihhhhhhhhhggxkhhhhhhhhgg....","....ihhhhhhhhggxxxkhhhhhhhgg....","....ihhhhhhhggxxxxxkhhhhhhgg....","....ihhhhhhhgxxxxxxkhhhhhhgg....","....ihhhhhhhgxxxxxxkhhhhhhgg....","....ihhhhhhhgxxxxxxkhhhhhhgg....","....ihhhhhhhgxxxxxxkhhhhhhgg....","....ihhhhhhhgxxxxxxkhhhhhhgg....","....ihhhhhhhgxxxxxxkhhhhhhgg....","....ihhhhhhhgxxxxxxkhhhhhhgg....","....ggggggggkkkkkkkkgggggggg....","....gggggggggggggggggggggggg....","................................","................................"]) },
  festungsbau: { w: 32, h: 32, cells: R(["...........ig..ig..ig...........","...........ig..iOOrig...........","...........ig..iORrrrr..........","...........ggiigrrrgg...........","...........ihhhhhhhgg...........","...........ihhhhhhhgg...........","...........ihhhhhhhgg...........","...........ihhhhhhhgg...........","...........ihhhxxhhgg...........","..iiig..iiiihhhxxhhggiiig.iiig..","..ihhg..ihhihhhxxhhggihhg.ihhg..","..ihhg..ihhihhhxxhhggihhg.ihhg..","..ihhg..ihhihhhhhhhggihhg.ihhg..","..ihhg..ihhihhhhhhhggihhg.ihhg..","..ggggiigggihhhhhhhggggggigggg..","..ihhhhhhhhgggggggggghhhhhhhgg..","..ihhhhhhhhgggggggggghhhhhhhgg..","..ihhhhhhhhhhhhhhhhhhhhhhhhhgg..","..ihhhhhhhhhhhhhhhhhhhhhhhhhgg..","..ihhhhhhhhhhhhhhhhhhhhhhhhhgg..","..ihhhhhhhhhhhhgkhhhhhhhhhhhgg..","..ihhhhhhhhhhhggxkhhhhhhhhhhgg..","..ihhhhhhhhhhggxxxkhhhhhhhhhgg..","..ihhhhhhhhhhgxxxxkhhhhhhhhhgg..","..ihhhhhhhhhhgxxxxkhhhhhhhhhgg..","..ihhhhhhhhhhgxxxxkhhhhhhhhhgg..","..ihhhhhhhhhhgxxxxkhhhhhhhhhgg..","..ihhhhhhhhhhgxxxxkhhhhhhhhhgg..","..gggggggggggkkkkkkggggggggggg..","..gggggggggggggggggggggggggggg..","................................","................................"]) },
  taschendiebstahl: { w: 32, h: 32, cells: R(["................................","................................","................................","................................","......................zzzzy.....",".....................zzYYYYy....","....................zzYYyYYYy...","....................zYYzyYYYy...","....................zYYYyYYYy...","....................zYYYyYYYy...","....................yYYYyYYyy...","....i...........tts..yYYYYyy....","................tSsttsyyyyy.....","................tSstSs..........","...i......tttts.tSstSs..........","........tttSSStttSstSss.........",".......ttSSSSStSsssssss.........","..i...ttSSSSSStSSSSSSSs.........",".....ttSSSSSSSsssssssss.........",".....tSSSSSSSSSSSSSs............",".....tSSSSSSSSSSSSSs............",".....tSSSSSSSSSSSSSs............",".....sSSSSSSSSSSSSss............","......sSSSSSSSSSSss.............",".......sSSSSSSSSss..............","........ssSSSSsss...............","..........sssss.................","................................","................................","................................","................................","................................"]) },
  bestechung: { w: 32, h: 32, cells: R(["................................","................................","..........................zzy...","....zzy..................zzyYy..","...zzyYy................zzzyYYy.","..zzzyYYy...............zYYyYYy.","..zYYyYYy...............yYYyYyy.","..yYYyYyy................yYyyy..","...yYyyy....MMMMMMMMn.....yyy...","....yyy.....MNNNNNNNn...........","............MNNNNNNNn...........","............MNNNNNNNn...........","...........yyyyyyyyyy...........","...........yyyyyyyyyy...........","..........MMNNNNNNNNnn..........","..........MNNNNNNNNNnn..........",".........MMNNNNNNNNNNnn.........",".........MNNNNzzzzyNNnn.........",".........MNNNzzYYYYyNnn.........","........MMNNzzYYyYYYyNnn........","........MNNNzYYzyYYYyNnn........",".......MMNNNzYYYyYYYyNNnn.......",".......MNNNNzYYYyYYYyNNnn.......",".......MNNNNyYYYyYYyyNNnn.......","......MMNNNNNyYYYYyyNNNNnn......","......nnnnnnnnyyyyynnnnnnn......",".....nnnnnnnnnnnnnnnnnnnnnn.....","................................","................................","................................","................................","................................"]) },
  schuldschein: { w: 32, h: 32, cells: R(["................................","................................","................................","......wwwwwwwwwwwwwwwwwm........","......wBBBBBBBBBBBBBBBBBm.......","......wBBBBBBBBBBBBBBBBBm.......","......wBBBBBBBBBBBBBBBBBBm......","......wBBBBBBBBBBBBBBBBBBm......","......wBBBBBBBBBBBBBBBBBBm......","......wBBBDDDDDDDDDDDDDBBm......","......wBBBBBBBBBBBBBBBBBBm......","......wBBBBBBBBBBBBBBBBBBm......","......wBBBBBBBBBBBBBBBBBmm......","......wBBBDDDDDDDDDDDDDBm.......","......wBBBBBBBBBBBBBBBBBm.......","......wBBBBBBBBBBBBBBBBBm.......","......wBBBBBBBBBBBBBBBBBm.......","......wBBBDDDDDDDDDDDDDBm.......","......wBBBBBBBBBBBBBBBBBm.......","......wBBBBBBBBBBBzzzzyBm.......","......wBBBBBBBBBBzzYYYYym.......","......wBBBBBBBBBzzYYyYYYy.......","......wBBBBBBrrBzYYzyYYYy.......","......wBBBBrrBBBzYYYyYYYy.......","......wBBrrBBBBBzYYYyYYYy.......","......wBBBBBBBBByYYYyYYyy.......","......mBBBBBBBBBByYYYYyy........",".......wBBBBBBBBBByyyyym........",".......mmmmmmmmmmmmmmmmm........","................................","................................","................................"]) },
  dekadenz: { w: 32, h: 32, cells: R(["................................","................................","................................",".........JJJJJJJJJJJJJU.........",".........JOOOOOOOOOOOOr.........",".........UORRRRRRRRRRRr.........","..........ORRRRRRRRRRRr.........","..........ORRRRRRRRRRRr.........","..........rrrrrrrrrrrrr.........","..........JVVVVVVVVVVU..........","..........JVVVVVVVVVVU..........","..........UVVVVVVVVVUU..........","...........JVVVVVVVVU...........","...........JVVVVVVVVU...........","...........UUVVVVVUUU...........",".............UVVVUU.............","..............UUUU..............","...............zzy..............","...............zYy..............","...............zYy..............","...............zYy..............","...............zYy..............","...............zYy..............","...............zYy..............","....zzy........zYy........zzy...","...zzyYy..zzzzzzzzzzzzy..zzyYy..","..zzzyYYy.zYYYYYYYYYYYy.zzzyYYy.","..zYYyYYy.yyyyyyyyyyyyy.zYYyYYy.","..yYYyYyy...............yYYyYyy.","...yYyyy.................yYyyy..","....yyy...................yyy...","................................"]) },
};

__exports.CARDS2 = CARDS2;

});
__define("ui/art/items2.js", function (__exports, __require) {
// ERZEUGT von tools/figures/items.mjs (nicht von Hand ändern). Item-Formen, 24x24 Pixel, mit Palette-Buchstaben a (dunkel), b (mittel), c (hell).
const R = (rows) => rows.map((r) => [...r]);
const SHAPES2 = {
  gem: { w: 24, h: 24, cells: R(["........................","........................","........................","...........aa...........",".........ccccaa.........","........ccccccca........",".......cwwcccccca.......","......ccwwccccccca......","....ccccccccccccccca....","...acccccccccccccccca...","....cbbbccccccccaaaa....","....abbbbbbbaaaaaaaa....",".....abbbbbbaaaaaaa.....","......cbbbbbaaaaaa......","......abbbbbaaaaaa......",".......abbbbaaaaa.......","........abbbaaaa........",".........bbbaaa.........",".........abbaaa.........","..........abaa..........","...........ba...........","...........aa...........","........................","........................"]) },
  crystal: { w: 24, h: 24, cells: R(["........................","........................","...........aa...........","..........ccca..........",".........ccbcaa.........","........wwbbcbaa........",".......cwwbbcbbaa.......","......ccwwbbcbbbaa......","......cbbbbbcbbbaa......","......cbbbbbcbbbaa......","......cbbbbbcbbbaa......","......cbbbbbcbbbaa......","......cbbbbbcbbbaa......","......abbbbbcbbbaa......","....ccabbbbbcbbbaa......","...ccbabbbbbcbbbaa......","...cbbabbbbbcbbbaa......","...cbbabbbbbcbbaaa......","...cbbbabbbbcbaaa.......","...abbbaabbbcaaa........","....cbba.abbcaa.........","....cbba..aaca..........","....aaaa...aa...........","........................"]) },
  ring: { w: 24, h: 24, cells: R(["........................","........................","........................","...........ee...........","..........ewwe..........",".........eewwde.........","........eeddddee........","........ceedeeeaa.......","......cccaaeeabbbaa.....","......cbaaaaaaabbaa.....",".....ccaaa.....abbaa....",".....caaa.......abaa....","....ccaa.........cbaa...","....cbaa.........cbaa...","....cbaa.........cbaa...","....cbaa.........cbaa...","....abaa.........caaa...",".....cbaa.......ccaa....",".....abbaa.....ccaaa....","......abbbccccccaaa.....","......aaabbbbbaaaaa.....","........aaaaaaaaa.......","..........aaaaa.........","........................"]) },
  medal: { w: 24, h: 24, cells: R(["........................","........................","....ddd.........ddd.....","...dded.........dedd....","....deed.......dded.....","....deeed.....ddedd.....",".....deed.....dedd......","......deed...dded.......","......deedcccaadd.......",".......dcccbbbbaa.......",".......ccbbbbbbbaa......","......ccbbcccccbbaa.....","......cbbcccdcccbaa.....",".....ccbcccccccccbaa....",".....cbbcccdcdcccbaa....",".....cbbccccdccccbaa....",".....cbbcccccccccbaa....",".....abbccccdccccaaa....","......cbbcccccccbaa.....","......abbbcccccbaaa.....",".......aabbbbbaaaa......","........aaaaaaaaa.......","..........aaaaa.........","........................"]) },
  flask: { w: 24, h: 24, cells: R(["........................","........................",".........NNNNNN.........",".........NNNNNN.........","..........cbba..........","..........cbba..........","..........cbba..........","..........cbba..........","..........cbba..........",".........cccccaa........",".......cccbbbbbbaa......","......ccbbbbbbbbbaa.....",".....ccbbbbbbbbbbbaa....",".....cbbbwbbbbbbbbaa....","....ccbbwbbbbbbbbbbaa...","....cbbbwbbbbbbbbbbaa...","....cbbbbbbbbbbbbbbaa...","....cbbbbbbbbbbbbbbaa...","....abbbbbbbbbcbbbbaa...",".....cbbbbcbbbbbbbba....",".....abbbbbbbbbbbbba....","......bbbbbbbbbbbbb.....",".......aaaaaaaaaaa......",".........aaaaaaa........"]) },
  vial: { w: 24, h: 24, cells: R(["........................","........................",".......NNNNNNNNNN.......",".......NNNNNNNNNN.......",".......NNNNNNNNNN.......","........cbbbbbaa........","........cwbbbbaa........","........cwbbbbaa........","........cwbbbbaa........","........cbbbbbaa........","........cbbbbbaa........","........cbbbbbba........","........cbbbbbba........","........cbbbbbba........","........cbbcbbba........","........cbbbbbba........","........cbbbbbba........","........cbbbbcba........","........cbbbbbba........","........cbbbbbba........","........abbbbbba........","........aaaaaaaa........","........................","........................"]) },
  pouch: { w: 24, h: 24, cells: R(["........................","........................","........................","........................","........ccccccca........","........cbbbbbba........","........abbbbbaa........",".........cbbbbaa........",".......dddddddddda......",".....ecddddddddddae.....",".....cebbbbbbbbbbeaa....","....ccbbbbbbbbbbbbbaa...","....cbbbbbbbbbbbbbbaa...","...ccbbwwbbbbbbbbbbbaa..","...cbbbwwbbbbbbbbbbbaa..","...cbbbbbbbbbbbbbbbbaa..","...cbbbbbbbbbbbbbbbbaa..","...abbbbbbbbbbbbbbbaaa..","....cbbbbbbbbbbbbbbaa...","....abbbbbbbbbbbbbaaa...",".....abbbbbbbbbbbaaa....","......aabbbbbbbaaaa.....",".......aaaaaaaaaaa......",".........aaaaaaa........"]) },
  dice: { w: 24, h: 24, cells: R(["........................","........................","........................","........cccccccccccc....",".......cccccccccccca....","......ccccccccccccaa....",".....ccccccccccccaaa....",".....ccccccccccccaaa....","....ccccccccccccakaa....","...cccccccccccaaaaaa....","...cbbbbbbbbbbaaaaaa....","...cbbbbbbbbbbaaaaaa....","...cbbkbbbbkbbaaaaka....","...cbbbbbbbbbbaaaaaa....","...cbbbbbbbbbbaaaaaa....","...cbbbbkbbbbbaaaaaa....","...cbbbbbbbbbbaaaaa.....","...cbbbbbbbbbbaaaa......","...cbbkbbbbkbbaaaa......","...cbbbbbbbbbbaaa.......","...aaaaaaaaaaaaa........","...aaaaaaaaaaaaa........","........................","........................"]) },
  scroll: { w: 24, h: 24, cells: R(["........................","........................","........................",".....a............a.....","....ccawwwwwwwwwwcca....","....cbaBBBBBBBBBBcba....","....cbaBBBBBBBBBBcba....","...ccbbaBBBBBBBBccbba...","...cbbbakkkkkkkkcbbba...","...cbbbaBBBBBBBBcbbba...","...cbbbaBBBBBBBBcbbba...","...cbbbakkkkkkkkcbbba...","...cbbbaBBBBBBBBcbbba...","...cbbbaBBBBBBBBcbbba...","...cbbbakkkkkkkkcbbba...","...cbbbaBBBBBBBBcbbba...","...cbbbaBBBBBBBBcbbba...","...abbaakkkkkkkkabbaa...","....cbaBBBBBBBBBBcba....","....cbaBBBBBBBBBBcba....","....aaammmmmmmmmmaaa....",".....a............a.....","........................","........................"]) },
  book: { w: 24, h: 24, cells: R(["........................","........................","........................","....aaacccccccccccaa....","....aaabbbbbbbbbbbaa....","....aaabbbbbbbbbbbww....","....aaabbbbbbbbbbbww....","....aaabbbbbbbbbbbww....","....aaabbdddddddbbww....","....aaabbdeeeeedbbww....","....aaabbdeaeaedbbww....","....aaabbdeeaeedbbww....","....aaabbdeeeeedbbww....","....aaabbdeeeeedbbww....","....aaabbdddddddbbww....","....aaabbbbbbbbbbbww....","....aaabbbbbbbbbbbww....","....aaabbbbbbbbbbbww....","....aaabbbbbbbbbbbww....","....aaabbbbbbbbbbbww....","....aaaaaaaaaaaaaaaa....","....aaaaaaaaaaaaaaaa....","........................","........................"]) },
  helmet: { w: 24, h: 24, cells: R(["........................","........................",".........cccccaa........",".......cccbbbbbbaa......","......ccbbbbbbbbbaa.....",".....ccbbbbccbbbbbaa....","....ccbbbbbccbbbbbbaa...","....cbbbbbbccbbbbbbaa...","...ccbbbbbbccbbbbbbbaa..","...cbbbbbbbccbbbbbbbaa..","...cbbbbbbbccbbbbbbbaa..","...cbbbbbbbccbbbbbbbaa..","...cbbbbbbbccbbbbbbbaa..","...cbdbbkkkkkkkkbbdaaa..","...cbbbbkkkkkkkkbbbaa...","...cbbbbkkkkkkkkbbbaa...","...cbbbbbbbbbbbbbbbaa...","...cbbbbbbbbbbbbbbbaa...","...cbbbbbbbbbbbbbbbaa...","...aaaaaaaaaaaaaaaaaa...","...aaaaaaacccaaaaaaaa...","..........aaaa..........","........................","........................"]) },
  chest: { w: 24, h: 24, cells: R(["........................","........................","........................","........................",".........ccccaa.........",".......cccbbbbbaa.......","......ccbbbbbbbbaa......",".....ccbbbbbbbbbbaa.....","....ccbbbbbbbbbbbbaa....","....cbbbbbbbbbbbbbaa....","...aaaaaaaaaaaaaaaaaa...","...aaaaaaaaaaaaaaaaaa...","...dddddddYYYYddddddd...","...dddddddYYYYddddddd...","...cebbbbbYkkYbbbbbea...","...cbbbbbbYYYYbbbbbaa...","...cbbbbbbYYYYbbbbbaa...","...cbbbbbbYYYYbbbbbaa...","...cbbbbbbbbbbbbbbbaa...","...cebbbbbbbbbbbbbbea...","...aaaaaaaaaaaaaaaaaa...","...aaaaaaaaaaaaaaaaaa...","........................","........................"]) },
  belt: { w: 24, h: 24, cells: R(["........................","........................","........................","........................","........................","........................","........eeeeeeee........","........edddddde........","........edddddde........",".cccccccedkkkkdecccccca.",".cbbbbbbedkkkkdebbbbbba.",".cbbdbbdedkkkkdedbbdbba.",".cbbbbbbedkkkkdebbbbbba.",".cbbbbbbedkkkkdebbbbbba.",".aaaaaaaedkkkkdeaaaaaaa.","........edddddde........","........edddddde........","........eeeeeeee........","........................","........................","........................","........................","........................","........................"]) },
  clover: { w: 24, h: 24, cells: R(["........................","........................","........................","........a.......a.......",".....cccccca.cccccca....","....ccbbbbbbccbbbbbba...","....cbbbbbbbcbbbbbbba...","....cbbbbbbbcbbbbbbba...","...acbbbbbbacbbbbbbbaa..","....cbbbbbbbcbbbbbbba...","....cbbbbbbbcbbbbbbba...","....abbbabbacbbbabbaa...",".....cccccccccccccca....","....ccbbbbbbacbbbbbba...","....cbbbbbbbabbbbbbba...","....cbbbbbbbcabbbbbba...","...acbbbbbbacabbbbbbaa..","....cbbbbbbbcabbbbbba...","....cbbbbbbbcabbbbbba...","....abbbbbbaaabbbbbaa...",".....aaaaaaa.aaaaaaa....","........a.....a.a.......","..............a.........","........................"]) },
  heart: { w: 24, h: 24, cells: R(["........................","........................","........................",".....ccccaa...ccccaa....","....ccbbbbaa.ccbbbbaa...","...ccwwbbbbbccbbbbbbaa..","..ccbwwbbbbbbbbbbbbbbaa.","..cbbwwbbbbbbbbbbbbbbaa.","..cbbbbbbbbbbbbbbbbbbaa.","..cbbbbbbbbbbbbbbbbbbaa.","..abbbbbbbbbbbbbbbbbaaa.","...abbbbbbbbbbbbbbbaaa..","....cbbbbbbbbbbbbbaaa...","....abbbbbbbbbbbbaaa....",".....abbbbbbbbbbaaa.....","......abbbbbbbbaaa......",".......abbbbbbaaa.......","........abbbbaaa........",".........cbbbaa.........",".........abbaaa.........","..........aaaa..........","...........aa...........","........................","........................"]) },
  orb: { w: 24, h: 24, cells: R(["........................","........................",".........cccccaa........",".......cccbbbbbbaa......","......ccbbbbbbbbbaa.....",".....ccbbbbbbbbbbbaa....","....ccbwwwbbbbbbbbbaa...","....cbbwwwbbbbbbbbbaa...","...ccbbwwwbbbbbbbbbbaa..","...cbbbbbbbbbbbbbbbbaa..","...cbbbbbbbbbbbbbbbbaa..","...cbbbbbbbbbbbbbbbbaa..","...cbbbbbbbbbbbbbbbbaa..","...cbbbbbbbbbbbbbbbbaa..","...abbbbbbbbbbbcbbbaaa..","....cbbbbbbbbbcbbbbaa...","....abbbbbbbbbbbbbaaa...",".....abbbbbbbbbbbaaa....","......aabbbbbbbaaaa.....",".......aaaaaaaaaaa......","......dddddddddddd......",".......deeeeeeeed.......",".......dddddddddd.......","........................"]) },
  log: { w: 24, h: 24, cells: R(["........................","........................","........................","...........a............","...........ca...........","..........cca...........","..........aaaa.....c....","...cccccccccccccccccc...","...cbbbbbbbbbbbbbccbbc..","...cbbbbbbbbbbabccbbbbc.","...cbbbabbbbbbbbcbbbbbc.","...cbbbbbbbbbbbbcbbbbbc.","...cbbbbbbbbbbbbcbbbbbc.","...cbbbbbbbbbbbbcbbbbbc.","...cbbbbbbbabbbbcbbbbbc.","...cbbbbbbbbbbbbcbbbbcc.","...aaaaaaaaaaaaaacbbcc..","...aaaaaaaaaaaaaaaccc...","...................c....","........................","........................","........................","........................","........................"]) },
  stone: { w: 24, h: 24, cells: R(["........................","........................","........................","........................","...........ccaa.........","........ccccbbbaa.......","......cccbbbbbbbaa......","......cbbcbbbbbbbbaa....",".....ccbcbabbbbbbbaa....",".....cbbbbbbbbbbbbaa....","....ccbbbbbbbbbbbbaa....","....cbbbbbbbbbbbbbbaa...","....cbbbbbbabbbbbbbaa...","...ccbbbbbbbabbbbbbaa...","...abbbbbbbbbbbbbbbaa...","....cbbbbbbbbbbabbaaa...","....abbbbbbbbbbbbaaa....",".....abbbbbbbbbbaaa.....","......aaaaaaaaaaaa......","......aaaaaaaaaaa.......","........................","........................","........................","........................"]) },
  bread: { w: 24, h: 24, cells: R(["........................","........................","........................","........................","........................","........................",".........cccccaa........","......ccccbbbbbbcaa.....",".....ccbbbbbbbbbbbaa....","....cccbbbbcbbbbcbbaa...","...ccbcbbbbcbbbbcbbbaa..","..ccbbbcbbbbcbbbbcbbbaa.","..cbbbbcbbbbcbbbbcbbbaa.","..cbbbbbcbbbbcbbbbcbbaa.","..cbbbbbcbbbbcbbbbcbbaa.","..abbbbbbbbbbbbbbbbbaaa.","...abbbbbbbbbbbbbbbaaa..","....abbbabbbbbbbbbaaa...",".....aaabbbbbbbaaaaa....","......aaaaaaaaaaaaa.....",".........aaaaaaa........","........................","........................","........................"]) },
  backpack: { w: 24, h: 24, cells: R(["........................","........................","........................",".........ccccca.........",".......cccbbbbbca.......","......ccbbbbbbbbba......",".....ccbbbbbbbbbbba.....",".....aaaaaaaaaaaaaa.....",".....cbbbbbbbbbbbaa.....","..dd.cbbbbbbbbbbbaa.dd..","..dd.cbbbbbbbbbbbaa.dd..","..dd.cbbbbbbbbbbbaa.dd..","..dd.cbbbddddddbbaa.dd..","..dd.cbbbddddddbbaa.dd..","..dd.cbbbaaaaaabbaa.dd..","..dd.cbbbaaeeaabbaa.dd..","..dd.cbbbaaaaaabbaa.dd..","..dd.cbbbaaaaaabbaa.dd..","..dd.cbbbaaaaaabbaa.dd..",".....cbbbbbbbbbbbaa.....",".....aaaaaaaaaaaaaa.....",".....aaaaaaaaaaaaaa.....","........................","........................"]) },
  skull: { w: 24, h: 24, cells: R(["........................","........................","..........cccaa.........","........cccbbbbaa.......","......cccbbbbbbbbaa.....","......cbbbbbbbbbbaa.....",".....ccbbbbbbbbbbbaa....",".....cbkkkkbbbkkkkaa....","....ccbkkkkbbbkkkkbaa...","....cbkkkkkkbkkkkkkaa...","....cbkkkkkkbkkkkkkaa...","....cbkkkkkkbkkkkkkaa...","....abbkkkkbbbkkkkaaa...",".....cbkkkkbbbkkkkaa....",".....abbbbbkkbbbbaaa....","......acccccccccaaa.....","......acbbbbbbbbaaa.....",".......cbbbbbbbba.......",".......cbkbbkbbka.......",".......cbbbbbbbba.......",".......cbkbbkbbka.......",".......aaaaaaaaaa.......","........................","........................"]) },
  drum: { w: 24, h: 24, cells: R(["........................","........................","...N................N...","....NN............NN....","......N..........N......","......cNccccccccNc......",".....ccbNNbbbbNNbbc.....","....ccbbbbNbbNbbbbbc....","...ccbbbbbbbbbbbbbbcc...","....cbbbbbbbbbbbbbcc....","....cdbbdbbdbbdbbdca....","....cdccdccdccdccdaa....","....cbdbbdbbdbbdbbda....","....cbdbbdbbdbbdbbda....","....cbdbbdbbdbbdbbda....","....cbdbbdbbdbbdbbda....","....cbbdccdccdcadbad....","....cccdcbdbbdbbdcad....","....ccbdbbdbbdbbdbbd....","...acbbbbbbbbbbbbbbaa...","....abbbbbbbbbbbbbaa....",".....aaabbbbbbbaaaa.....","........aaaaaaaa........","........................"]) },
  crown: { w: 24, h: 24, cells: R(["........................","........................","........................","........................","........................","...........aw...........","...w.......aa........w..","...a......ccaa......a...","...aa.....cbaa.....aa...","...caa...ccbbaa...caa...","...caa...cbbbaa...caa...","...cbaa.ccbbbbaa.ccaa...","...cbbbccbbbbbbbccbaa...","..ccbbbbbbbbbbbbbbbbaa..","..cbbbbbbbbbbbbbbbbbaa..","..cbbbbbbbbbbbbbbbbbaa..","..ddddddddddddddddddddd.","..ddddddedddedddedddddd.","..ddddddddddddddddddddd.","..ddddddddddddddddddddd.","........................","........................","........................","........................"]) },
  fang: { w: 24, h: 24, cells: R(["........................","........................",".....cccccccccccccc.....",".....cccccccccccccc.....",".....cccccccccccccc.....",".....cccccccccccccc.....",".......cwbbbbbbaa.......",".......awbbbbbbaa.......","........wbbbbbaaa.......","........wbbbbbaa........",".........cbbbbaa........",".........cbbbaaa........",".........abbbaa.........","..........cbbaa.........","..........cbaaa.........","..........cbaa..........","..........abaa..........","...........aaa..........","...........aa...........","...........aa...........","...........aa...........","........................","........................","........................"]) },
  chalice: { w: 24, h: 24, cells: R(["........................","........................","........................","...cedeedeedeedeedeedeedeedeedeedeedeedeedeedeedeede....","...cedeedeedeedeedeedeedeedeedeedeedeedeedeedeedeede....","...aedeedeedeedeedeedeedeedeedeedeedeedeedeedeedeede....","....cbwbbbbbbbbbbaa.....","....cbwbbbbbbbbbbaa.....","....cbwbbbbbbbbbbaa.....","....abbbbbbbbbbbaaa.....",".....cbbbbbbbbbbaa......",".....aabbbbbbbaaaa......","......aaaaaaaaaaa.......","........aaaaaaa.........","...........ca...........","...........ca...........","...........ca...........","...........ca...........","...........ca...........","......ccccccccccca......","......cbbbbbbbbbba......","......aaaaaaaaaaaa......","........................","........................"]) },
  moon: { w: 24, h: 24, cells: R(["........................","........................",".........caaaaa.........",".......ccaaaa...........","......ccbaa.........w...",".....ccbaaa.............","....ccbbaa..............","...ccbbaaa..............","...cbbwaa...............","..ccbwbaa...............","..cbbbbaa...............","..cbbbbaa...............","..cbbbbaa...............","..cbbbbbaa..............","..cbbbbbaa..............","..abbbbbbaa.............","...cbbbbbaa.............","...abbbbbbbaa...........","....abbbbbbbbaa...w.a...",".....abbbbbbbbbccaaa....","......aabbbbbbbaaaa.....",".......aaaaaaaaaaa......",".........aaaaaaa........","........................"]) },
  dagger: { w: 24, h: 24, cells: R(["........................","........................","........................","........................","....................c...","...................c....","................c.c.....","...............c.cbb....","..............c.bbbb....",".............c.bbbab....","............c.bbbab.....","...........c.bbbab......","..........c.bbbab.......",".........c.bbbab........","...YY...c.bbbab.........","...YYY.c.bbbab..........","....YYY.bbbab...........",".....YYYbbab............","....c.YYYab.............",".....NNYYY..............","....NNNaYYY.............","...NNNab.YYY............","..NNN.....YY............","..NN...................."]) },
  snowflake: { w: 24, h: 24, cells: R(["........................","............w...........","........................",".......cb........cb.....",".......bcb......cbb.....","........cb......cb......","..w.....bcb....cbb...w..",".........cb....cb.......",".........bcb..cbb.......","..........cb..cb........","..........bwwwbb........","..........wwwww.........","..ccccccccwwwwwccccccccb","..bbbbbbbbwwwwwbbbbbbbbb","...........wwwb.........","..........cbbbcb........","..........cb..cb........","..w......cbb..bcb....w..",".........cb....cb.......","........cbb....bcb......","........cb......cb......",".......cbb......bcb.....",".......bb...w....bb.....","........................"]) },
  icicle: { w: 24, h: 24, cells: R(["........................","........................","...ccccccccccccccccccc..","...ccccccccccccccccccc..","...ccccccccccccccccccc..","....ca.abbbbbbaaaabba...","....aa..cbbbbbaa..cba...","....a...cbbbbbaa..cba...","...ca...cbbbbbaa..cba...","...aa...abbbbaaa..aaa...","...a.....cbbbaa....a....","...a.....cbbbaa....a....",".........cbbbaa....a....",".........abbaaa....a....","..........cbaa..........","..........cbaa..........","..........cbaa..........","..........aaaa..........","...........aa...........","...........aa...........","...........aa...........","...........aa...........","........................","........................"]) },
  globe: { w: 24, h: 24, cells: R(["........................","........................",".........cccccaa........",".......cccbbbbbbaa......","......ccbbbbbbbbbaa.....",".....cwwbbbbbbbbbbaa....","....ccwwbbbbbbbbbbbaa...","....cbbbbcccbbbbbbbaa...","...ccbbcccccbbbbbbbbaa..","...cbbbccccccbbbbbbbaa..","...cbbbbcccccbbbbbbbaa..","...cbbbbccccbbbbbbbbaa..","...cbbbbbcbbbbbbbbbbaa..","...cbbbbbbbbbbccccbbaa..","...abbbbbbbbbbccccbaaa..","....cbbbbbbbbbcccbbaa...","....abbbbbbbbbcccbaaa...",".....abbbbbbbbbbbaaa....","......aabbbbbbbaaaa.....",".......aaaaaaaaaaa......","........dddddddd........","........deeeeeed........","........dddddddd........","........................"]) },
  star: { w: 24, h: 24, cells: R(["........................","........................","........................","........................","...........aa...........","...........aa...........","...........aa...........","..........ccaa..........","..........wwaa..........","........ccwwbbaa........","...aaccccbbbbbbbcaaaa...","....aabbbbbbbbbbaaaa....","......abbbbbbbbaaa......",".......abbbbbbaaa.......","........cbbbbbaa........",".......ccbbbbbbaa.......",".......cbaaaabbaa.......",".......caaaaaabaa.......",".......aaa....aaa.......",".......aa......aa.......","......a..........a......","........................","........................","........................"]) },
  target: { w: 24, h: 24, cells: R(["........................","........................",".........cccccca........",".......cccbbbbbbca......","......ccbbbbbbbbbba.....",".....ccbbbwwwwwbbbba....","....ccbbwwwwwwwwwbbba...","...ccbbwwwbbbbbwwwbbba..","...cbbwwwbbbbbbbwwwbba..","..ccbbwwbbbwwwbbbwwbbba.","..cbbwwbbbwwawwbbbwwbba.","..cbbwwbbwwaaawwbbwwbba.","..cbbwwbbwaaaaawbbwwbba.","..cbbwwbbwwaaawwbbwwbba.","..cbbwwbbbwwawwbbbwwbba.","..abbbwwbbbwwwbbbwwbbaa.","...cbbwwwbbbbbbbwwwbba..","...abbbwwwbbbbbwwwbbaa..","....abbbwwwwwwwwwbbaa...",".....abbbbwwwwwbbbaa....","......abbbbbbbbbbaa.....",".......aabbbbbbaaa......",".........aaaaaaa........","........................"]) },
  eye: { w: 24, h: 24, cells: R(["........................","........................","........................","........................","........................",".........wwwwwm.........",".......wwwBBBBBwm.......","......wwBBccccaBBm......",".....wwBBccbbbbaBBm.....","....wwBBccwbkbbbaBBm....","...wwBBccbwkkkkbbaBBm...","..wwBBBcbbkkkkkbbaBBBm..",".mwBBBBcbbkkkkkbbaBBBmm.","..mBBBBcbbkkkkkbbaBBmm..","...mBBBabbkkkkkbaaBmm...","....mBBBabbbkbbaaBmm....",".....mBBBabbbbaaBmm.....","......mBBBaaaaaBmm......",".......mmBBBBBmmm.......",".........mmmmmm.........","........................","........................","........................","........................"]) },
  paw: { w: 24, h: 24, cells: R(["........................","........................","........................","........cca...cca.......",".......ccbba.ccbba......",".......cbbba.cbbba......","......acbbbaacbbbaa.....","....ccacbbba.cbbbacca...","...ccbbabbaa.abbaccbba..","...cbbbaaaa...aaacbbba..","..acbbbaa.......acbbbaa.","...cbbba..cccca..cbbba..","...abbaacccbbbbcaabbaa..","....aaaccbbbbbbbbaaaa...","......ccbbbbbbbbbba.....","......cbbbbbbbbbbba.....","......cbbbbbbbbbbba.....","......cbbbbbbbbbbba.....","......abbbbbbbbbbaa.....",".......abbbbbbbbaa......","........aabbbbaaa.......","..........aaaaa.........","........................","........................"]) },
  watch: { w: 24, h: 24, cells: R(["........................","............YY..........","............YY..........","............YY..........","............YY..........",".........cccccaa........",".......cccbbbbbbaa......","......ccbbwwwwwbbaa.....",".....ccbwwwwawwwwbaa....","....ccbwwwwwkwwwwwbaa...","....cbwwwwwwkwwwwwwaa...","...ccbwwwwwwkwwwwwwbaa..","...cbwwwwwwwkwwwwwwwaa..","...cbwwwwwwwkwwwwwwwaa..","...cbwawwwwwkwwwwwawaa..","...cbwwwwwwwwkkwwwwwaa..","...cbwwwwwwwwwwkkwwwaa..","...abbwwwwwwwwwwwwwaaa..","....cbwwwwwwwwwwwwwaa...","....abbwwwwwwwwwwwaaa...",".....abbwwwwawwwwaaa....","......aabbwwwwwaaaa.....",".......aaaaaaaaaaa......",".........aaaaaaa........"]) },
  scales: { w: 24, h: 24, cells: R(["........................","........................","........................","............bb..........","............bb..........","............bb..........","....cccccccccccccccccc..","....aacccccccccccccaac..","....aa......bb.....aa...","....a.a.....bb....a..a..","...a..a.....bb....a..a..","...a...a....bb...a...a..","...a...a....bb...a...a..","...a...a....bb..a.....a.","..accccaa...bb..cccccaa.",".cccbbbbca..bb.ccbbbbba.",".cbbbbbbba..bbacbbbbbbaa",".aabbbbaaa..bb.abbbbbaa.","...aaaaa....bb..aaaaaa..","............bb..........",".......ccccccccca.......",".......cbbbbbbbba.......",".......aaaaaaaaaa.......","........................"]) },
  cards: { w: 24, h: 24, cells: R(["........................","........................","........................","........................",".........wwwwwwwwwm.....","......cccwBBBBBBBBm.....","...ccccbbwBBBBBBBBm.....","...abbbbbwBBRBRBBBm.....","....cbbbbwBBBBBBBBm.....","....cbbbbwBBBBBBBBm.....","....cbbbbwBBBRBBBBm.....","....abbbbmBBBBBBBBm.....",".....cbbbbwBBBBBBBBm....",".....cbbbbwBRBBBBBBm....",".....abbbbwBBBkkkBBm....","......cbbbwBBBkkkBBm....","......cbbbwBBBkkkBBm....","......cbbbwBBBBBBBBm....","......abbammmmmmmmmm....",".......aaa..............","........................","........................","........................","........................"]) },
  cloak: { w: 24, h: 24, cells: R(["........................","............e...........",".......ccceeeeecc.......",".......cccedddecc.......","......ccceedddeeca......","......cbbbedddebaa......","......cbbbeeeeebaa......","......cbbbbbebbbaa......",".....ccbbbbbbbbbbaa.....",".....cbbbbbbbbbbbaa.....",".....cbbbbbbbbbbbaa.....",".....cbbbbbbbbbbbaa.....","....ccbbbabbbbbbbbaa....","....cbbbbbbbbbbbbbaa....","....cbbbbbbbbbbabbaa....","....cbbbbbbbbbbbbbaa....","...ccbbbbbbbbbbbbbbaa...","...cbbbbbbbbbbbbbbbaa...","...cbbbbbbbbbbbbbbbaa...","...aaaaaaaaaaaaaaaaaa...","..aaaaaaaaaaaaaaaaaaaa..","........................","........................","........................"]) },
  lighter: { w: 24, h: 24, cells: R(["........................","........................",".............o..........","............Yo..........","............YOo.........","...........oooo.........",".......ccccccccca.......",".......cbbbbbbbba.......",".......cbbbbbbbba.......",".......aaaaaaaaaa.......",".......cbbbbbbbaa.......",".......cbbbbbbbaa.......",".......cbbbbbbbaa.......",".......cdddddddda.......",".......cdddddddda.......",".......cwbbbbbbaa.......",".......cwbbbbbbaa.......",".......cwbbbbbbaa.......",".......cwbbbbbbaa.......",".......cbbbbbbbaa.......",".......cbbbbbbbaa.......",".......aaaaaaaaaa.......",".......aaaaaaaaaa.......","........................"]) },
  bowl: { w: 24, h: 24, cells: R(["........................","........................","........................","........................","........................","........................",".......ccccccccccc......","....ccccbaaaaaaabbccc...","..cccaaaaaaaaaaaaaaabcc.","..cbaaaaaaaaaaaaaaaaabc.","..ccbaaaaaaaaaaaaaaaccc.","...ccccbbaaaaaaabcccc...","...cbbwcccccccccccbaa...","...abbbbbbbbbbbbbbaaa...","....cbbbbbbbbbbbbbaa....","....cbbbbbbbbbbbbbaa....","....abbbbbbbbbbbbaaa....",".....cbbbbbbbbbbaaa.....",".....aabbbbbbbbaaaa.....","......aaaaaaaaaaa.......","........aaaaaaaa........","........................","........................","........................"]) },
  hammer: { w: 24, h: 24, cells: R(["........................","........................","...cccccccccccccccccc...","...cccccccccccccccccc...","...cbbbbbbbbbbbbbbbaa...","...cbdbbbbbbbbbbbbdaa...","...cbbbbbbbbbbbbbbbaa...","...cbbbbbbbbbbbbbbbaa...","...aaaaaaaaaaaaaaaaaa...","...aaaaaaaddddaaaaaaa...","..........dddd..........","..........NNNn..........","..........NNNn..........","..........NNNn..........","..........NNNn..........","..........NNNn..........","..........NNNn..........","..........NNNn..........","..........NNNn..........","..........NNNn..........","..........NNNn..........","..........NNNn..........","..........nnnn..........","........................"]) },
  cannon: { w: 24, h: 24, cells: R(["........................","........................","........................","........................","........................","........................","........................","........................","..ccccccccccccaa........","..cbbbbbbbbbbbbbaa.ggk..","..cbwwbbbbbbbbbbbbagxk..","..cbbbbbbbbbbbbbbbggxxk.","..cbbbbbbbbbbbbbbbgxxxk.","..cbbbbbbbbbbbbbbbgxxxk.","..cbbbbbbbbbbbbbbakxxkk.","..aaaaaaaaaaaaaaaaagxk..","..aaaaNNNNnaaaaaaa.kkk..","....NNNNNNNNn...........","....NNNNNNNNn...........","...NNNNNNNNNNn..........","...NNNNNNNNNNn..........","...nNNNNNNNNnn..........","....NNNNNNNNn...........","....nnnnnnnnn..........."]) },
  bolt: { w: 24, h: 24, cells: R(["........................","........................","..............a.........",".............aa.........","............wa..........","...........cwa..........","..........ccwa..........",".........ccbaa..........",".........cbba...........","........ccbbbcccccaa....",".......ccbbbbbbbbaa.....","......ccbbbbbbbbaa......",".....aaaaaabbbbba.......","...........cbbbaa.......","...........cbbaa........","..........ccbaa.........","..........cbaa..........","..........caa...........",".........caa............",".........ca.............",".........aa.............",".........a..............","........a...............","........................"]) },
  feather: { w: 24, h: 24, cells: R(["........................","........................","........................",".................cca....","..............ccccda....","...........ccccbbda.....","........ccccbbbbdba.....",".......ccbbbbbbbdba.....",".......cbbbbbabdbaa.....","......ccbbabbbdbba......","......cbbbbbbdbbaa......",".....ccbbbbbbdaaa.......",".....cbbbbbadaa.........","....ccbbabbdaa..........","....cbbbbbda............","....abbbbad.............",".....cbbad..............",".....cbad...............",".....aad................","......ad................","......d.................",".....d..................","........................","........................"]) },
  worm: { w: 24, h: 24, cells: R(["........................","........................","........................","............a...........","..........cccaa.........",".........cccccaa........","........ccccccbaa.......","........caaccccca.......","........aaaccccca.......","...a...ccaaaccbaba.wwa..",".cccca.aaaaaccccca.kkcca",".cccca.cabaaccccca.cbbba","accccaaabaaaaccccaacbbba",".ccccaccaaaa.ccccaccbbba",".ccccacaaaaa.ccccacaaaaa",".acccaabbaaa.acccaabbaaa","..cccccaaaa...cccccaaaa.","..cccaaaaaa...cccaaaaaa.","..acccabaaa...acccabaaa.","...aaaaaaa.....aaaaaaa..","....aaaaa.......aaaaa...","......a...........a.....","........................","........................"]) },
  razor: { w: 24, h: 24, cells: R(["........................","........................","........................","........................","........................","........................","........................","..................wwa...","................wwcba...","..............wwcbbaaa..","...........wwwcbbaaa....",".........wwwbbbaaa......",".......wwwbbbaaa........",".....wwwbbbaaa..........","...wwwbbbaaa............","..NNNNNNNn..............","..NNNNNNNn..............","..NNNNNNNn..............","..NNYNNNNn..............","..NNNNNNNn..............","..NNNNNNNn..............","..nnnnnnnn..............","........................","........................"]) },
  quiver: { w: 24, h: 24, cells: R(["........................","........................",".......gg..gg.gg........","........N...N..N........","........N...N..N........","........N...N..N........",".......RN..RN.RN........","........R...R..R........","........N...N..N........",".......dddddddddd.......",".......dddddddddd.......",".......cbbbbbbaa........",".......cbbbbbbaa........","......ccbbbbbbbaa.......","......cbbbbbbbbaa.......","......cbbbbbbbbaa.......","......cbbbbbbbbaa.......","......cbbbbbbbbaa.......","......cbbbbbbbbaa.......",".....ccbbbbbbbbbaa......",".....aaaaaaaaaaaaa......",".....aaaaaaaaaaaaa......","........................","........................"]) },
  boot: { w: 24, h: 24, cells: R(["........................","........................","........................",".....cccccccc...........",".....cccccccc...........",".....cccccccc...........",".....cbbbbbaa...........",".....cbbbbbaa...........",".....cbdbbbaa...........",".....cbbbbbaa...........",".....cbbbbbaa...........",".....cbdbbbaa...........",".....cbbbbbaa...........",".....cbbbbbaa...........",".....cbbbbbaa...........",".....cbbbbbbbcccccaa....",".....cbbbbbbbbbbbbaa....",".....cbbbbbbbbbbbbaa....",".....aaaaaaaaaaaaaaaa...",".....kkkkkkkkkkkkkkkkk..",".....kkkkkkkkkkkkkkkkk..","........................","........................","........................"]) },
  scope: { w: 24, h: 24, cells: R(["........................","........................","........................","........................","........................","........................","...........ddccccccaac..","...........ddbbbbbbaccc.","..cccccccccddbbbbbbccwbc","..cbbbbbbbbddbbbbbbcwwwc","..cbbbbbbbbddbbbbbbcwwwc","..cbbbbbbbbddbbbbbbcwwwc","..cbbbbbbbbddbbbbbbcwwwc","..cbbbbbbbbddbbbbbbcwwwc","..aaaaaaaaaddbbbbbbcwwwc","..aaaaaaNNnddbbbbbbcbwcc","........NNnddaaaaaaaccc.","........NNnddaaaaaaaac..","........NNn.............","........NNn.............","........NNn.............","........nnn.............","........................","........................"]) },
  lens: { w: 24, h: 24, cells: R(["........................","........................","........cacaa...........","......aaaaaaaaa.........","....caaaaa.aaabaa.......","....aaa.wwwww.aaa.......","...aaa.wwwwwww.aaa......","...aa.wccwwwwww.aa......","..caawwwwwwwwwwwcaa.....","..aaawwwwwwwwwwwaaa.....","..aa.wwwwwwwwwww.aa.....","..caawwwwwwwwwwwcaa.....","..aaawwwwwwwwwwwaaa.....","...aa.wwwwwwwww.aa......","...aaa.wwwwwww.aNn......","....aaa.wwwww.anNNn.....","....aaacaa.caaaaNNNn....","......aaaaaaaaa.nNNn....","........aaaaa....nNNn...","..................nNnn..","...................Nn...","...................nn...","........................","........................"]) },
  horn: { w: 24, h: 24, cells: R(["........................","........................","........................","...........cccccccaa....","..........wcbbwbbbaa....","........cccbbbbbbbaa....",".......ccbbbbbbbbbbaa...",".....cccbbbaaaaaaaaaa...","....ccbbbbaaaaaaaaaaa...","....cbbbbaaa............","....cbbbaaa.............","...ccbbbaa..............","...cbbbaaa..............","...cbbaaa...............","...cbbaa................","...cbbaa................","..ddddddd...............","..ddddddd...............","..ddddddd...............","..ddddddd...............","........................","........................","........................","........................"]) },
};

__exports.SHAPES2 = SHAPES2;

});
__define("ui/art/enemies2.js", function (__exports, __require) {
// ERZEUGT von tools/figures/enemies.mjs (nicht von Hand ändern). Gegner im detaillierten Stil, jeder mit eigener Pixelgröße px.
const R = (rows) => rows.map((r) => [...r]);
const ENEMIES2 = {
  ratte: { w: 36, h: 18, cells: R(["....................................",".........ppn.........Pq.............","........ppppn........Pq.............","........ppppn..Pq...PPQq............",".......nppppnn.Pq...PQQq...q........",".......pppppn..PqMMqqqqqq..Pq.......",".....MMnnppnnMqqqqNNNNNNMnPPq.......","...MMMNNnnnnMNNNNNNNNNNNNNqqqq.....p","...MwNNNNnNnNNNNNNNNNNNNNNNNnn.....p","..MMRRNNNNNNnNNNNNNNNNNNNNNNNnn...p.","..MMnNNNNNNNnNNNNNNNNNNNNNNNNnn...p.","ppMNnNNNNNNnnNNNNNNNNNNNNNNNnnn..p..","..nNnNNNNNNnNNNNNNNNNNNNNNnnnnpppp..","...wwNNNNnnnnnNNNNNNNNNnnnnnn.......",".....nnnnn.nnnnnnnnnnnnnnnn.........","...........nn..nnnnnnnnnnn..nn......","...........nn...nn......nn..nn......","...........nn...nn......nn..nn......"]), px: 1.5, pal: {"p":"#e86f9a"} },
  goblin: { w: 26, h: 36, cells: R(["..........................","..........................","..........................",".........zzzzzzzy.........",".......zzzYYYkYYYzy.......","Gf....zzYYYYkYYYYYYy....Gf","GFG..zzYYYYYYYYYYYYYy..GGf","fFFGfzYYYYYYYYYYYYYYyGGGff",".GFFFyyyyyyyyyyyyyyyyGFFf.",".GFFFyyyyyyyyyyyyyyyyFFFf.",".ffFFfGFFFFFFFFFFFFffFfff.","...fffGFFFFFffFFFFFffff...","......GFFFFFFFFFFFFf......","......fFFkkkkkkkkFff......",".......fFFwFFFFwFff.......","........ffFFFFFfff........","..........ffffff..........",".......YYYoGGGGYYYo.......","...GGf.YOOoFFFFYOOo.GGf...","...GFf.YOOoFFFFYOOo.GFf...","...GFf.YwOoFFFFYOwo.GFf...","...GFf.YOOoFFFFYOOo.GFf...","...Gff.YOooFFFFoOOo.fFf...","..GGf.YYOoFFFFFFYOOo.GFf..","..GFf.YOwoFFFFFFYwOo.GFf..","..GFf.YOOoFFFFFFYOOo.GFf..","..fff.YOOoxxYYxxYOOo.fff..","...f..ooooxxxxxxoooo..f...","..GGf...GFFf..GFFf...GGf..",".fGFff..GFFf..GFFf..fGFff.","..fff...GFFf..GFFf...fff..","...f....GFFf..GFFf....f...","........nFFf..GFFn........",".....MMMMMMn..MMMMMMn.....",".....MNNNNNn..MNNNNNn.....",".....nnnnnnn..nnnnnnn....."]), px: 1.55 },
  skelett: { w: 26, h: 46, cells: R(["..........................","..........gggggx..........","........gggWWWWWgx........",".......ggWWWWWWWWWx.......","......ggWWWWWWWWWWWx......","......gWWWWWWWWWWWWx......",".....xgWWWWWWWWWWWWxx.....","......xxxxxxxxxxxxxx......","......wmJJkkmmkJkkmB......","......wmJkkkmmkJkkmB......","......BmmkkmmmmkkmBB......",".......wmmmmkkmmmmB.......",".......BmmmmmmmmmBB.......","........BwwwwwwwBB........",".........wkmkmkmB.........","......wwwBBBBBBBBwwB......","...wB.BggggggggggxBB.wB...","...wB..gWwWWWWWWwx...wB...","...wB..gWWwWWWWwWxB..wB...","...wB..gWWwWWWWwWxB..wB...","...wB..gWWWwWWwWWx...wB...","...wB..gWWWwWWwWWxB..wB...","...wB..gWWWWwwWWWxB..wB...","...wB..xWWWWwwWWxx...wB...","...wB..wgWWWwwWWxwB..wB...","...wB..BgWWWwwWWxBB..wB...","...wB...gWWwWWwWx....wB...","...wB..wgWWwWWwWxwB..wB...","...wB..BgWYWWWWYxBB..wB...","...wB...gWwWWWWwx....wB...","...wB...xwxxxxxxw....wB...","...wB...wmmmmmmmB....wB...","..wwmB..BmmmmmmBB...wwmB..","..wmmB...BBBBBBBB...wmmB..","..BmBB...wB....wB...BmBB..","...BB....wB....wB....BB...",".........wB....wB.........",".........wB....wB.........",".........wB....wB.........",".........wB....wB.........",".........wB....wB.........",".........wB....wB.........",".........wB....wB.........",".......wwBB....BwwB.......","......BBBB......BBBB......",".........................."]), px: 1.5 },
  bandit: { w: 28, h: 44, cells: R(["............................","...........ggggxx...........",".........gggWWWWWxx.........","........ggWWWWWWWWxx........","........gWWWWWWWWWxx........",".......ggWWWWWWWWWWxx.......",".......gWWWWxxxxWWWxx.......","......ggWWxxxxxxxxWWxx......","......gWWxxxxxxxxxxWxx......","......gWWxxxxxxxxxxWxx......","......gWWkgkkkkkgkkWxx......","......xWxkkkkkkkkkkxxx......",".......gWkkkkkkkkkkxx.......",".......xWrrrrrrrrrrxx.......","........gxxxxxxxxxxx........","......ggxxxwwwwwwwwmm.......","......gWWxxwwwwwwBBmx.......","......gWWWWwYwwYwBmmx.......","......gWWWWWwYYwwBmxx.......",".....ggWWWWWwwwwBmmWxx......",".....gWWWWWWwwwwmmWWxx......",".....gWWWWWWwwwwmWWWxx....i.",".....gWWWWWWwwwmmWWWxx....i.",".....gWWWWWWWwmmWWWWxx...i..",".....gWWWWWWWwmWWWWWxx...i..",".....gWWWWWWWwmWWWWWxx...i..",".....gWWWWWWWwWWWWWWxx..i...","....ggWWnnnnnYYnnnnnWxx.i...","....MMnWnnnnnnnnnnnnWMMi....","...MMNNnWWWWWWWWWWWWMMNin...","...MNNNnWWWWWWWWWWWWMNNNn...","...nNNnnWWWWWWWWWWWWnNNnn...","....nnnWWWWWWWWWWWWWWnnn....","....gWWWWWWWWWWWWWWWWxx.....","....gWWWWWWWWWWWWWWWWxx.....","...ggWWWWWWWWWWWWWWWWWxx....","...xxxxxxxxxxxxxxxxxxxxx....","...xxxxxxxxxxxxxxxxxxxxx....",".........gWWx..gWWx.........",".........gWWx..gWWx.........",".......WWWWkx..xWWWWk.......",".......Wxxxk....Wxxxk.......","......kkkkkk....kkkkkk......","............................"]), px: 1.5, pal: {"W":"#4a4468","g":"#7a7498","x":"#2b2433"} },
  funke: { w: 18, h: 18, cells: R(["..................","........Yo........",".w......Yo......w.","..w....YYOo....w..",".w.....YOOo.....w.","......YYYYYo......","...YYYYYzzzYYYo...",".oYYOYYzzzzzYOOoo.","..oOOYwzwwzwYOoo..","...oYYzkwwkzYYo...","....oYzzzzzzYo....",".....YzzzzzYY.....",".....YYzzzYYo.....",".w..YYOYYYYOOo..w.","..w.YOoooooOOo.w..","....ooo....ooo....","...oo........oo...",".................."]), px: 1.6 },
  dornenranke: { w: 26, h: 42, cells: R(["..........................","..........................","..........PPPPPqq.........",".......PPPPQQYQQQPqq......","......PPQQQQQQQQQQQqq.....",".....PPQYkQQQQQQQkYQqq....","....PPQQQQQQQQQQQQQQQqq...","...PPQQQQQQQQWQQQQQQQQqq..","...PYQQQQQWWWWWWWQQQQYqq..","..PPQQQQQwWwWwWwWwQQQQQqq.","..PQQQQQWWWWWWWWWWWQQQQqq.","..PQQQQWWWWWWWWWWWWWQQQqq.","..PQQQQWWWWWWWWWWWWWQQQqq.","..qQQQQWWWWWWWWWWWWWQQqqq.","...PQQQWWWWWRRWWWWWWQQqq..","...qQQQWWWWWRRWWWWWWQqqq..","....qQYQWWWWWWWWWWWYqqq...",".....qQQwWwWwWwWwWwqqq....","......qqqQWWWWWWWqqqq.....",".......qqqqqqWqqqqqq......","..........qqqqqqq.........","..........................","..........................","..........................","...........GGGf...........","...........GFFf...........","...........GFFf......GGf..","..Gf.......GFFf.....GGFf..","..GFGf....yGFFf...GGGFFff.",".fGFFFf....GFFf..GGFFFFf..","..GFFFFf...GFFfGyGFFFFff..","..fFFFFFGf.GFFfGFFFFFFf...","...GFFFFFFfGFFFGFFFFFff...","...fFFFFFFfFFFFGFFffff....","....fffFFfyFFFFffff.......",".......fffGFFFFf..........","..........GFFFFfy.........","..........GFFFFf..........","..........GFFFFfn.........","........MMffffffNMn.......",".......nMNNNNNNNNNnn......","........nnnnnnnnnnn......."]), px: 1.6 },
  glutgeist: { w: 26, h: 38, cells: R(["..........................","............qq............","............qq............","...........PPqq...........","...........PQqq...........","..........PPQQqq..........","..........PQQQqq..........",".........PPQQQQqq.........",".......PPPQQQQQQQqq.......","......PPQQQQQQQQQQqq......","......PQQQQQQQQQQQqq......","......qQQQQQQQQQQqqq......",".......PQQQQQQQQQqq.......",".......PQQQQQQQQQqq.......",".......PQQQQQQQQQqq.......","......PPQQQQQQQQQQqq......",".....PPQQQQwwwVQQQQqq.....","....PPQQQwwwJJJwVQQQqq....","....PQQQwwJJJJJJJVQQqq....","...PPQQwwJJJJJJJJJVQQqq...","..PPQQQwJJJJJJJJJJVQQQqq..","..PQQQwwJJJJJJJJJJJVQQqq..","..qQQQwJJwkJJJJwkJJVQqqq..","...PQQwJJkkJJJJkkJJVQqq...","...PQQwJJJJJJJJJJJJVQqq...","...PQVwJJJJJJJJJJJJVVqq...","...PQQwJJJJJJJJJJJJVQqq...","...qQQwJJJJJJJJJJJJVqqq...","....PQwJJJJkkkkJJJJVqq....","....PQVJJJJJJJJJJJVVqq....","....qQQwJJJJJJJJJJVqqq....",".....qQVJJJJJJJJJVVqq.....","......PQVJJJJJJJVVqq......","......qQQVVJJJVVVqqq......",".......qqqqVVVVqqqq.......","........qqqqqqqqqq........","..........................",".........................."]), px: 1.5 },
  flussgeist: { w: 26, h: 38, cells: R(["............Yo............","............Yo............","...........YYOo...........","...........YOOo...........","..........YYOOOo..........","..........wwwwww..........",".........YYOOOOOo.........",".........YOOOOOOo.........","........owwwwwwwwo........","........VVUUUUUUuu..J.....","........VUUUUUUUuu........",".......VVUUUUUUUUuu.......",".....J.VUUUUUUUUUuu.......","......VVUUUUUUUUUUuu......","......VUUUUUUUUUUUuu......",".....VVUUUUUUUUUUUUuu.....",".....VUUUUUUUUUUUUUuuJ....","....VVUUUUUUUUUUUUUUuu....","....VUUUUUUUUUUUUUUUuu....","....VUUJJUUUUUUUUUUUuu....","....VJJJwwwwUUUwwwwUuu....","....VJVVwwwwUUUwwwwUuu....","....JJVwwwkwwUwwwkwwuu....","...VJVVVwwkwUUUwwkwUUuu...","...VJVVVwwwwUUUwwwwUUuu...","...VJVVVVVVVUUUUUUUUUuu...","...VUVVVVVVUUUUUUUUUUuu...","...VUJVVVVVUUUUUUUUUUuu...","...uUUUVVUUUUUUUUUUUuuu...","....VUUUUUkUUUUkUUUUuu....","....uUUUUUUkkkkUUUUuuu....",".....VUJUUUUUUUUUUUuu.....",".....uUUUUUUUUUUUUuuu.....","......VUUUUUUUUUUUuu......","......uuuUUUUUUuuuuu......",".......uuuuuuuuuuuu.......","..........uuuuuu..........",".........................."]), px: 1.6 },
  sumpfgeist: { w: 40, h: 36, cells: R(["..........g.......iiiiiig...............","........iiiig....iihhhhhhg.....g........",".......iihhhhg...ghhhhhhgg...iiiig......","......gihhhhhgg..hghhhhgg...iihhhhg.....",".......ghhhhgg.hhhggggggx...ihhhhhg.....","........ggggghhhggggggggghxxghhhhgg.....","..........ghhgggggggggggggggxggggg......",".........hhgggggggkkkkkggggggxxg........",".........hggggggkkkkkkkkkggggxx.........","........hhggggkkkkkkkkkkkkkgggxx........",".......hhgggggkkkkkkkkkkkkkgggxx........",".......hgggggkkkkkkkkkkkkkkkgggxx.......","......hhGggggkkkkkkkkkkkkkkkggggGx......",".....hhgggggkkkkkkkkkkkkkkkkkgggxx......",".....hggggggkkkYYkkkkkkYYkkkkggggxx.....","....hhggggggkkkYYkkkkkkYYkkkkggggxx.....","...hhgggggggkkkkkkkkkkkkkkkkkgggggxx....","...hggggggggkkkkkkkkkkkkkkkkkgggggxx....","..hhgggggggggkkkkkkkkkkkkkkkgggggggxx...","..hggggggggggkkkkkkkkkkkkkkkgggggggxx...","..hgggggggggggkkwkkkwkkkwkkggggggggxx...","..hgggggggggggkkkkwkkkwkkkkggggggggxx...","..hgggggggggggggkkkkkkkkkggggggggggxx...","..hgggggggggggggggkkkkkggggggggggggxx...","..hgggGggggggggggggggggggggggggggggxx...","..hgggggggggggggggggggggggggggggggggxx..","..hgggggggggggggggggggggggggggggggGgxx..","..hgggggggggggggggggggggggggggggggggxx..","..hgggggggggggggggggggggggggggggggggxx..","..hgggggggggggggggggggggggggggggggggxx..","..hgxxggggggxxggggggxxggggggxxggggggxx..","..xxxxxggggxxxxggggxxxxggggxxxxgggggxx..","..xxx..xggxxx..xggxxx..xggxxx..xggxxxx..","..x.....xxxx....xxxx....xxxx....xxxxx...",".........xx......xx......xx......xx.....","........................................"]), px: 1.5 },
  knochenhauptmann: { w: 38, h: 58, cells: R(["......................................","................gggggkkOOr............",".............ggggxxxxxxgkk............","............ggxxxxxxxxxxxkk...........","...........ggxxxxxxxxxxxxxkk..........","..........ggxxxxxxxxxxxxxxxkk.........","..........gxxxxxxxYYYxxxxxxkk.........","..........gxxxxxxxxxxxxxxxxkk.........","..........gxxxxxxxxxxxxxxxxkk.........","..........kkkkkkkkkkkkkkkkkkk.........","..........iggggggggggggggggxg.........","..........ggWWWWWWWWWWWWWWWxg.........","...........xxxxxxxxxxxxxxxxx..........","...........igmkkkkmmmkkkkig...........","...........ggmkkkkmmmkkkkgg...........","............BmmmmmmmmmmmmBB...........",".............BmmmmkkkmmmBB............","..............BmmmmmmmmBB.............","....OOOOOOOOOOOBBmmmmBBBOOOOOOOOrr....","....ORiiiigRRRRRRBBBBBRRRRRiiiigrr....","....OiiYYYhgiiiiiiiiiiiiigiiYYYhgr....","....iihYYYhhghhhhhhhhhhhhiihYYYhhg....","....ihhhhhhhghhhhhhhhhhhhihhhhhhhg....","....ghhhhhhgghhhhhhhhhhhhghhhhhhgg....","...OOghhhhgghhhhhhhhhhhhhgghhhhggrr...","...ORwwBgggihYhYhhhhhhhYhYggggwwBrr...","...ORwmBRRRihhhhhhhhhhhhhggRRRwmBrr...","...ORwmBRRRihhhhhhhhhhhhhggRRRwmBrr...","...ORwmBRRRghhhhhhhhhhhhgggRRRwmBrr...","...ORwmBRRRRihhhhhhhhhhhggRRRRwmBrr...","...ORwmBRRRRihhhhhhhhhhhggRRRRwmBrr...","...ORwmBRRRRihhhhhhhhhhhggRRRRwmBrr...","...ORwmBRRRRihhhhhhhhhhhggRRRRwmBrr...","...ORwmBRRRRnnnnnnnnnnnnnnnRRRwmBrr...","...ORwmBRRRRnnnnnnnnnnnnnnnRRRwmBrr...","..OORwmBRRRRggggggggggggggRRRRwmBRrr..","..ORRwmBRRRRRRwwwwwwwwwBRRRRRRwmBRrr..","..ORRwmBRRRRRRwmmmmmmmmBRRRRRRwmBRrr..","..ORRwwBRRRRRRBmmmmmmmBBRRRRRRwwBRrr..","..ORwwmmBRRRRRRwmmmmmmBRRRRRRwwmmBrr..","..ORwmmmBRRRRRwBBBBBBBBBRRRRRwmmmBrr..","..ORBmmBBRRRRRwmBRRRRwmBRRRRRBmmBBrr..","..ORRBBBRRRRRRwmBRRRRwmBRRRRRRBBBRrr..","..ORRRRRRRRRRRwmBRRRRwmBRRRRRRRRRRrr..","..ORRRRRRRRRRRwmBRRRRwmBRRRRRRRRRRrr..","..ORRRRRRRRRRRwmBRRRRwmBRRRRRRRRRRrr..","..ORRRRRRRRRRRwmBRRRRwmBRRRRRRRRRRrr..",".OORRRRRRRRRRRwmBRRRRwmBRRRRRRRRRRRrr.",".ORRRRRRRRRRRRwmBRRRRwmBRRRRRRRRRRRrr.",".ORRRRRRRRRRRRwmBRRRRwmBRRRRRRRRRRRrr.",".rrrrrrrrrrrrrwmBrrrrwmBrrrrrrrrrrrrr.",".rrrrrrrrrrrrrwmBrrrrwmBrrrrrrrrrrrrr.","..............wmB....wmB..............","..............wmB....wmB..............","............wwwBB....BwwwB............","...........wwmmB......wmmmB...........","..........BBBBBB......BBBBBB..........","......................................"]), px: 1.75 },
  steingolem: { w: 42, h: 54, cells: R(["..........................................","..........................................","..........................................","..........................................",".................iiiiiiig.................","................iihhhhhhhg................","...............iihhhhhhhhhg...............","..............iggggggggggggg..............",".........M....iggggggggggggg...M..........","...M.....N....ihhhhhhhhhhhhg...N....M.....","...N.....N...gihhOOhhhhOOhhgg..N....N.....","....N.....N...ihhOOhhhhOOhhg..N....N......","....N.....N...ihhhhhhhhhhhhg..N....N......",".....N....N...ghhhhhhhhhhhgg..N....N......",".....N....N....ghhhhhhhhhgg...N...N.......","......NiiigN....ghkhkhkhgg...N.iiiNg......","....iiNhhhhNg....gggggggg....NiihNhhig....","...iihhNhhhNhg..............iNhhhNhhhhg...","..iihhhNhhhhhhgiiiiiiiiiiiiiihhhhhhhhhhg..","..ihhhhhhhhhhhghhhhhhhhhhhhihhhhhhhhhhhg..",".ighhhhhhhhhhgghhhhhhhhhhhhghhhhhhhhhhggg.",".ihghhhhhhhhgghhhhhhhhhhhhhhghhhhhhhhgghg.",".ihhgghhhhggghhhhhhhhhhhhhhhhgghhhhggghhg.",".ihhhhggggghhhhhhhhhhhhhhhhhhhhggggghhhhg.",".ihhhhhghhhhhhghhhzzzzzohhhhhhghggihhhhhg.","iihhhhhghhhhhhhhhzzOOOOOohhhhhhhggihhhhhhg","ihhhhhhghhhhhhhhzzOOOOOOOohhhhhhggihhhhhhg","ihhhhhhghhhhhhhgzOOOzzOOOohhhhhhggihhhhhhg","ihhhhhhghhhhhhhhzOOOzzOOOohhhhhhggihhhhhhg","ihhhhhhghhhhhhhhzOOOOOOOOohhhhhhggihhhhhhg","ihhhhhhghhhhhhhhoOOOOOOOoohhhhhhhgihhhhhhg","ihhhhhhghhhhhhhhhoOOOOOoohhhhhhhhgihhhhhhg","ihhhhhhghhhhhhhhhhoooooohhhhhhhhhgihhhhhhg","ihhhhhhghhhhhhhhhhhhhhhhhhghhhhhhgihhhhhhg","ihhhhhhghhhhhhhhhhhhhhhhqhqhhhhhhgihhhhhhg","ihhhhhhghhhhyyhhhhyyhhhhyqhqhhyyhgihyyhhhg","ihhhhhhghhhyyyhhhyyyhhhyyyhghyyyhgiyyyhhhg","ihhhhhhghhhyyhhhhyyhhhhyyhhhhyyhhgiyyhhhhg","ihhhhhhghhyyyhhhyyyhhhyyyhhhyyyhhhyyyhhhhg","ihhhghhghyyyhhhyyyhhhyyyhhhyyyhhhyyyhghhhg","iiiiiiiggyyggggyyggggyyggggyyggggyyiiiiigg","iihhhhhhyyygggyyygggyyygggyyygggyyyhhhhhhg","ihhhhhhhyyihhhyyhg..yy..ihyyhhhgyyhhhhhhhg","ihhhhhhhhgihhhhhhg......ihhhhhhgihhhhhhhhg","ihhhhhhhhgihhhhhhg......ihhhhhhgihhhhhhhhg","ihhhhhhhhgihhhhhhg......ihhhhhhgihhhhhhhhg","ihhhhhhhggihhhhhhg......ihhhhhhgghhhhhhhhg","ghhhhhhgg.ihhhhhhg......ihhhhhhg.ghhhhhhgg",".ggggggg..ihhhhhhg......ihhhhhhg..ggggggg.","....g.....ihhhhhhg......ihhhhhhg.....g....","..........iiiiiigg......iiiiiiig..........","........iiihhhhhhig....iiihhhhhhig........",".......gihhhhhhhhhgg..gihhhhhhhhhgg.......","........ggggggggggg....ggggggggggg........"]), px: 1.65 },
  frostwolf: { w: 52, h: 34, cells: R(["....................................................","....................................................","....................................................","....................................................","....................................................","...............wV...................................",".........JJJU..wV..wV...............................",".........UVVVU.wV..wV....wV.............wV..........","..........JVVU.wV.wwVV...wV........wV...wV..........","........JJUUUUwwJVwJVV...wV...wV...wV...wV..........","......JJJVVVVJVVVwwJJV...wV...wV...wV...wV..........",".....JJVVVVVVVVU.VVVVVV.VVVVJVVVVJVVVV.VVVV......U..","....JJVVVVVVVVVVU....JJJJJVVVVVVVVVVJJUU........JU..","...JJUVVVVVVVVVVVU.JJJVVVVVVVVVVVVVVVVVVUU....JJJVU.","...JJJUVwJVVVVVVVUJJVVVVVVVVVVVVVVVVVVVVVVUU.JJVVVU.","..JJJVUVVVVVVVVVVUVVVVVVVVVVVVVVVVVVVVVVVVVUUJVVVVU.",".JJVVVUVVVVVVVVVVUVVVVVVVVVVVVVVVVVVVVVVVVVVUUVVVUU.","kkUVVVUVVVVVVVVVUUVVVVVVVVVVVVVVVVVVVVVVVVVVVUUVUU..","...UUVVUVVVVVVVUUVVVVVVVVVVVVVVVVVVVVVVVVVVVVUUUU...","..wwwwwUVVVVVVUUVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUU.....","......UUVVVVUUUVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUU.....","........UUUUU.UVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUUU.....","...............UVVVVVVVVVVVVVVVVVVVVVVVVVVVUUU......","................UUVVVVVVVVVVVVVVVVVVVVVVVUUUU.......",".................UUUVVVVVVVVVVVVVVVVVVVUUUUU........",".................JVUUUUUVVVVVVVVVVVUUUUUUUVU........",".................JVU.UUUUUUUUUUUUUUUUUUU.JVU........",".................JVU..JVUUUUUUUUUUUUJVU..JVU........",".................JVU..JVU...........JVU..JVU........",".................JVU..JVU...........JVU..JVU........",".................JVU..JVU...........JVU..JVU........",".................UUU..UUU...........UUU..UUU........","....................................................","...................................................."]), px: 1.4 },
  elementarwandler: { w: 64, h: 64, cells: R(["................................................................","........m..............................................m........","........mm.....................ca.....................mm........",".........mm...............m....ma....m...............mm.........",".........mmm..............m....ca....m..............mmm.........",".........mmmm.cccccaa....mm...ccma...mm....cccccaa.mmmm.........",".........mmmmmcbbbbbbaa..mm...cbba...mm..cccbbbbbbmmmmm.........","..........mmcbbbbbbbbbaammm...abaa...mmmccbbbbbbbbbamm..........","..........ccbbbbbbbbbbbaa......ca......ccbbbbbbbbbbbaa..........",".........ccbbbbbbbbbbbbbaca....ca....cacbbbbbbbbbbbbbaa.........",".........cbbbbbbbbbbbbbbaca....ca....cabbbbbbbbbbbbbbaa.........","........ccbbbbbbbbbbbbbbccba...aa...ccbabbbbbbbbbbbbbbaa........","........cbbbbbbbbbbbbbbbcbba........cbbabbbbbbbbbbbbbbaa........","........cbbbbeebbbbbeebbabaa........abaabbeebbbbbeebbbaa........","........cbbbbeebbbbbeebbbca..........cabbbeebbbbbeebbbaa........","........cbbbbbbbbbbbbbbbbaa..........aabbbbbbbbbbbbbbbaa........","........cbbbbbbbbbbbbbbbbaa..........cbbbbbbbbbbbbbbbbaa........","........abbbbbbbbbbbbbbbaaa..........abbbbbbbbbbbbbbbaaa........",".........cbbbbbbbbbbbbbbaa............cbbbbbbbbbbbbbbaa.........",".........abbbbmbmbmbbbbaaa............abbbbbbmbmbmbbaaa.........","..........abbbbbbbbbbbaaa..............abbbbbbbbbbbaaa..........","..........caabbbbbbbaaaa................aabbbbbbbaaaaa..........","..........cbaaaaaaaaaaa..................aaaaaaaaaaaba..........",".........ccbbbaaaaaaacca................cccaaaaaaabbbba.........",".........cbbbbbbbbbbbbbbccca........cccccbbbbbbbbbbbbba.........",".........cbbbbbbbbbbbbbbbbba........cbbbbbbbbbbbbbbbbba.........",".........cbbbbbbbbbbbbbbbbba........cbbbbbbbbbbbbbbbbba.........",".........cbbbbbbbbbbbbbbbbba........cbbbbbbbbbbbbbbbbba.........","....ccccccbbbbbbbbbbbbbbbbbaccccmccccbbbbbbbbbbbbbbbbbbaccca....","....cbbbcbbbbbbbbbbbbbbbbbbacccccccccbbbbbbbbbbbbbbbbbbabbba....","....cbbbaaaaaaaaaabbbbbbbbcccccccccccccbbbbbbaaaaaaaaaaabbba....","....cbbbbbbbbabbbbaaaaaaaccccbbbbbbbccccaaaaaabbbacbbbbbbbba....","....cbbbbbbbbabbbbbbbbbbmccbbbkkkkkbbbcccbbbbbbbbacbbbbbbbba....","....cbbbbbbbaabbbbbbbbbcccbbkkkkkkkkkbbcccbbbbbbbbabbbbbbbba....","...ccbbbbbbbabbbbbbbbbcccbkkkkeeeeekkkkbcccbbbbbbbacbbbbbbbba...","...cbbbbbbbbabbbbbbbbbccbbkkeeeeeeeeekkbbccbbbbbbbacbbbbbbbba...","...cbbbbbbbbabbbbbbbbcccbkkeeeeeeeeeeekkbcccbbbbbbbcbbbbbbbba...","...cbbbbbbbbabbbbbbbbccbbkkeeeeeweeeeekkbbccbbbbbbbcbbbbbbbba...","...cbbbbbbbbabbbbbbbbccbkkeeeewwwwweeeekkbccbbbbbbbcbbbbbbbba...","...cbbbbbbbbabbbbbbbbccbkkeeeewwwwweeeekkbccbbbbbbbcbbbbbbbba...","...cbbbbbbbbabbbbbbbmccbkkeeewwwwwwweeekkbccmbbbbbbcbbbbbbbba...","...cbbbbbbbbabbbbbbbbccbkkeeeewwwwweeeekkbccbbbbbbbcbbbbbbbba...","...cbbbbbbbbabbbbbbbbccbkkeeeewwwwweeeekkbccbbbbbbbcbbbbbbbba...","...cbbbbbbbaabbbbbbbbccbbkkeeeeeweeeeekkbbccbbbbbbbabbbbbbbba...","...cbbbbbbbabbbbbbbbbcccbkkeeeeeeeeeeekkbcccbbbbbbbbcbbbbbbba...","..ccbbbbbbbabbbbbbbbbbccbbkkeeeeeeeeekkbbccbbbbbbbbbcbbbbbbbba..","..cbbbbbbbbabbbbbbbbbbcccbkkkkeeeeekkkkbcccbbbbbbbbbcbbbbbbbba..","..cbbbbbbbbabbbbbbbbbbbcccbbkkkkkkkkkbbcccbbbbbbbbbbcbbbbbbbba..","..cbbbaaaaaabbbbbbbbbbbbcccbbbkkkkkbbbccmbbbbbbbbbbbaaaaabbbba..","..aaaaacbbbbbbbbbbbbbbbbbccccbbbbbbbccccbbbbbbbbbbbbbbbaaaaaaa..",".......aaaaaaaaaaaaaaaaaaacccccccccccccaaaaaaaaaaaaaaaaaa.......","..m...aaaaaaaaaaaaaaaaaaaaaacccccccccaaaaaaaaaaaaaaaaaaaaa...m..","...m.m....ccccccccccca..........m.........ccccccccccca....m.m...","..........cbbbbbbbbbba....................cbbbbbbbbbba..........",".........ccbbbbbbbbbba....................cbbbbbbbbbbba.........",".........cbbbbbbbbbbba....................cbbbbbbbbbbba.........","........ccbbbbbbbbbbba....................cbbbbbbbbbbbba........","........cbbbbbbbbbbbba....................cbbbbbbbbbbbba........","........cbbbbbbbbbbbba....................cbbbbbbbbbbbba........",".......ccbbbbbbbbbbbba....................cbbbbbbbbbbbbba.......",".......cbbbbbbbbbbbbba....................cbbbbbbbbbbbbba.......","......aaaaaaaaaaaaaaaa....................aaaaaaaaaaaaaaaa......","......k..k..k......................................k..k..k......","................................................................"]), px: 1.7, pal: {"a":"#4a2a6a","b":"#8a4fc0","c":"#c79af0","e":"#ffe58a"} },
};
const RIGS3 = {
  ratte: {"rel":true,"regions":[{"id":"head","box":[0,0,0.3429,0.8824],"seq":[[0,0],[-1,0],[0,0],[0,0]],"dur":1.6,"under":true},{"id":"ear","parent":"head","box":[0.1714,0.0588,0.3429,0.4118],"seq":[[0,0],[0,0],[0,1],[0,0],[0,0]],"dur":2.4,"under":true},{"id":"tail","box":[0.8286,0.2353,1,0.7647],"seq":[[0,0],[0,1],[0,0],[0,-1]],"dur":0.9,"under":true}]},
  goblin: {"rel":true,"regions":[{"id":"up","box":[0,0,1,0.6857],"seq":[[0,0],[0,1]],"dur":1.3},{"id":"earl","parent":"up","box":[0,0.0857,0.2,0.3429],"seq":[[0,0],[0,1],[0,0],[0,0]],"dur":2,"under":true},{"id":"earr","parent":"up","box":[0.8,0.0857,1,0.3429],"seq":[[0,0],[0,1],[0,0],[0,0]],"dur":2,"under":true,"phase":0.9}],"blink":[{"cells":[[0.36,0.2571],[0.4,0.2571],[0.6,0.2571],[0.64,0.2571]],"color":"F","every":3.4,"at":0.5}]},
  skelett: {"rel":true,"regions":[{"id":"up","box":[0,0,1,0.7111],"seq":[[0,0],[0,1]],"dur":1.6},{"id":"jaw","parent":"up","box":[0.32,0.2889,0.68,0.3333],"seq":[[0,0],[0,1],[0,0],[0,1],[0,0],[0,0],[0,0],[0,0]],"dur":2.4},{"id":"al","parent":"up","box":[0.08,0.3556,0.2,0.7556],"seq":[[0,0],[-1,0],[0,0],[0,0]],"dur":2.2,"under":true},{"id":"ar","parent":"up","box":[0.8,0.3556,0.92,0.7556],"seq":[[0,0],[1,0],[0,0],[0,0]],"dur":2.2,"phase":1.1,"under":true}],"glow":[{"letters":"J","color":"w","max":0.7,"dur":1.8}]},
  bandit: {"rel":true,"regions":[{"id":"up","box":[0,0,1,0.8372],"seq":[[0,0],[0,1]],"dur":1.5},{"id":"hood","parent":"up","box":[0.1481,0,0.8519,0.4651],"seq":[[0,0],[0,0],[1,0],[0,0],[0,0],[-1,0]],"dur":3.6,"under":true},{"id":"hem","box":[0,0.7907,1,0.9535],"seq":[[0,0],[1,0],[0,0],[-1,0]],"dur":2.2,"under":true}],"blink":[{"cells":[[0.3704,0.2558],[0.4074,0.2558],[0.5926,0.2558],[0.6296,0.2558]],"color":"x","every":4.4,"at":1.2}]},
  funke: {"rel":true,"regions":[{"id":"s","box":[0,0,1,1],"seq":[[0,0],[0,1],[0,0],[1,0]],"dur":0.8}],"glow":[{"letters":"zw","color":"w","max":0.85,"dur":0.8}]},
  dornenranke: {"rel":true,"regions":[{"id":"up","box":[0,0,1,0.7317],"seq":[[0,0],[1,0],[0,0],[-1,0]],"dur":3},{"id":"head","parent":"up","box":[0,0,1,0.4634],"seq":[[0,0],[1,0],[1,0],[0,0],[-1,0],[-1,0]],"dur":2.2,"phase":0.5,"under":true},{"id":"ll","parent":"up","box":[0,0.5854,0.24,0.8293],"seq":[[0,0],[0,1],[0,0],[0,0]],"dur":1.2,"under":true},{"id":"lr","parent":"up","box":[0.76,0.5854,1,0.8293],"seq":[[0,0],[0,1],[0,0],[0,0]],"dur":1.2,"under":true,"phase":0.6}],"blink":[{"cells":[[0.32,0.122],[0.36,0.122],[0.68,0.122],[0.72,0.122]],"color":"Q","every":3.6,"at":1}]},
  glutgeist: {"rel":true,"regions":[{"id":"tl","box":[0.24,0,0.36,0.1622],"seq":[[0,0],[0,1],[0,0],[0,0]],"dur":0.9},{"id":"tc","box":[0.4,0,0.6,0.1622],"seq":[[0,0],[0,0],[0,1],[0,0]],"dur":0.9,"phase":0.3},{"id":"tr","box":[0.64,0,0.76,0.1622],"seq":[[0,0],[0,0],[0,0],[0,1]],"dur":0.9,"phase":0.6},{"id":"hem","box":[0.08,0.8378,0.92,1],"seq":[[0,0],[1,0],[0,0],[-1,0]],"dur":1.1,"under":true}],"blink":[{"cells":[[0.36,0.5946],[0.4,0.5946],[0.36,0.6216],[0.4,0.6216],[0.6,0.5946],[0.64,0.5946],[0.6,0.6216],[0.64,0.6216]],"color":"V","every":3.2,"at":0.7}],"glow":[{"letters":"w","color":"J","max":0.5,"dur":1.2}]},
  flussgeist: {"rel":true,"regions":[{"id":"up","box":[0,0,1,0.8108],"seq":[[0,0],[0,1]],"dur":1.8},{"id":"hem","box":[0.12,0.8378,0.92,1],"seq":[[0,0],[1,0],[0,0],[-1,0]],"dur":1,"under":true}],"blink":[{"cells":[[0.36,0.5946],[0.4,0.5946],[0.36,0.6216],[0.4,0.6216],[0.64,0.5946],[0.68,0.5946],[0.64,0.6216],[0.68,0.6216]],"color":"U","every":3.9,"at":0.9}]},
  sumpfgeist: {"rel":true,"regions":[{"id":"body","box":[0,0.0571,1,0.9429],"seq":[[0,0],[0,1]],"dur":1.7}],"blink":[{"cells":[[0.3846,0.4],[0.4103,0.4],[0.3846,0.4286],[0.4103,0.4286],[0.5897,0.4],[0.6154,0.4],[0.5897,0.4286],[0.6154,0.4286]],"color":"k","every":3.3,"at":0.6}]},
  knochenhauptmann: {"rel":true,"regions":[{"id":"up","box":[0,0,1,0.7018],"seq":[[0,0],[0,1]],"dur":2.4},{"id":"cl","parent":"up","box":[0,0.5965,0.1351,0.9123],"seq":[[0,0],[-1,0],[0,0],[0,0]],"dur":2.6,"under":true},{"id":"cr","parent":"up","box":[0.8919,0.5965,1,0.9123],"seq":[[0,0],[1,0],[0,0],[0,0]],"dur":2.6,"phase":1.3,"under":true}],"glow":[{"letters":"J","color":"w","max":0.7,"dur":1.5}]},
  steingolem: {"rel":true,"regions":[{"id":"up","box":[0,0,1,0.7736],"seq":[[0,0],[0,1]],"dur":3.2}],"glow":[{"letters":"oOz","box":[0.3902,0.434,0.6098,0.6038],"color":"z","max":0.65,"dur":1.6},{"letters":"O","box":[0.3415,0.1698,0.6585,0.2264],"color":"w","max":0.5,"dur":2.2}]},
  frostwolf: {"rel":true,"regions":[{"id":"head","box":[0,0,0.3529,0.8485],"seq":[[0,0],[0,1],[0,0],[0,0]],"dur":2.6},{"id":"tail","box":[0.8431,0.1818,1,0.6667],"seq":[[0,0],[1,0],[0,0],[-1,0]],"dur":1.4,"under":true},{"id":"crest","box":[0.3529,0.1212,0.8235,0.3939],"seq":[[0,0],[0,0],[0,1],[0,0]],"dur":1.9}]},
  elementarwandler: {"rel":true,"regions":[{"id":"up","box":[0,0,1,0.7302],"seq":[[0,0],[0,1]],"dur":2.8},{"id":"hl","parent":"up","box":[0,0,0.3968,0.381],"seq":[[0,0],[0,1],[0,0],[0,0]],"dur":2.4},{"id":"hr","parent":"up","box":[0.6032,0,1,0.381],"seq":[[0,0],[0,0],[0,1],[0,0]],"dur":2.4},{"id":"kl","box":[0,0.7937,0.1429,1],"seq":[[0,0],[0,1],[0,0]],"dur":1.5,"under":true},{"id":"kr","box":[0.8571,0.7937,1,1],"seq":[[0,0],[0,1],[0,0]],"dur":1.5,"phase":0.7,"under":true}],"glow":[{"letters":"ew","color":"w","max":0.6,"dur":1.4}]},
};

__exports.ENEMIES2 = ENEMIES2;
__exports.RIGS3 = RIGS3;

});
__define("ui/art/heroes2.js", function (__exports, __require) {
// ERZEUGT von tools/figures/heroes.mjs (nicht von Hand ändern). Neue Helden und NPCs im detaillierten Stil (40x60 Pixel).
const R = (rows) => rows.map((r) => [...r]);
const HEROES2 = {
  nahkaempfer: { w: 40, h: 60, cells: R(["........................................","........................................","...............x....xx..................","..............xx....xx....x.............","..............gxx..gxx...xx.............","..............gxx..gxx...gxx............","..........x...gWWgggWxx.ggxx.x..........","..........xx.ggWWWWWWWWggWxx.x..........","..........gWggWWWWWWWWWWWWWWxx..........","..........gWxxxxxxxxxxxxxxWWxx..........","..........xxxxxxxxxxxxxxxxxxxx..........","..........xggxttsssssssssSggxx..........","..........xgWxtssxssssrsssgWxx..........","...........gxxsxxsssssrxxsxWx...........","...........gxtsskssssssrssSgx...........","...........xxtsskssssssrssSxx...........","............xSssssssssssrSSx............","............x.SsssssssssrS.x............","...............SssrrrrsSS...............",".............OOOSSSSSSSSOr....g.........","............OORRRtssssSRRRriiiiigg......","...........OOOOrRSSSSSSRRRrihhhhhgg.....","...........ORRRrrrrrrrrrrrrrwwhhhhgg....","...........ORRRriiiiiiiigihhhhhhhhgg....",".....VVVVuOORRrrhhhhhhhhgihhhhhhhhggg...",".....VUUUuORRRrhhhhOOhhhgihhhhhhhhgg....",".....VUUUuORRRrhhhOOOOhhgghhhhhhhggg....",".....VUUUuORRRrhhJJwwUUhggggghggggg.....","....VVUUUuORRRrhhJJwwUUgggUgggggggUu....","....VUUUUuORRRrhhhFFFFhggUUuu.gUUUUu....","....VUUUUOORRRrhhhhFFhhggUUuu.VUUUUu....","....VUUUUORRRRrggggggggggUUuu.VUUUUu....","....VUUUUORRRrrggggggggggUUuu.VUUUUu....","....VUUUUrrRRrUUUgWWWWxUUUUuu.VUUUUu....","....uUUUUuVrRrUUUgWWWWxUUUUUuuVUUUuu....",".....VUUUuUUrrUUUgWWWWxUUUUUuuVUUUu.....","....iiiiiigUUUUUUgWWWWxUUUUUuiiiiiig....","....ihhhhhgUUUUUUgWWWWxUUUUUuihhhhhg....","....ihhghhgUUUUUUgWWWWxUUUUUuihhghhg....","....giiiiggnnnnnnnnYYnnnnnnnngiiiigg....",".....ihhhgnnnnnnnnnnnnnnnnnnnnihhhg.....","....gihhhggUUUUUUgWWWWxUUUUUugihhhgg....",".....ihhhgUUUUUUUgWWWWxUUUUUUuihhhg.....",".....ggggguuuuuuugWWWWxuuuuuuuggggg.....",".......guuuuuuuuugWWWWxuuuuuuuu.g.......",".............gWWWxxxxxxWWWx.............",".............gWWWWx..gWWWWx.............",".............gWWWWx..gWWWWx.............",".............gWWWWx..gWWWWx.............",".............gWWWWx..gWWWWx.............",".............gWWWWx..gWWWWx.............",".............gWWWWx..gWWWWx.............",".............gWWWWx..gWWWWx.............",".............gWWWWx..gWWWWx.............",".............gWWWWx..gWWWWx.............","..........hhhhhhhkx..xhhhhhhhk..........",".........hhxxxxxxk....hxxxxxxxk.........","........hhxxxxxxxk....hxxxxxxxxk........","........kkkkkkkkkk....kkkkkkkkkk........","........................................"]), px: 1.65, hand: [36,41] },
  fernkaempfer: { w: 40, h: 60, cells: R(["........................................","........................................",".................wBB....................","...............wwwmmwwwwwBB.............","..............wwmmmmmmmmmmBB............","............wwwmmmmmmmmmmmBB............","..........wwwJJJgBBBBmmJJJgBB...........","..........wmJwJJJgBBBBJJJJwgB...........","..........wxJJJJJgxxxxJJJJJgxx..........","..........BxgJJJggxxxxgJJJggxx..........","...........BBggggssssssggggB.MR.........","...........B..ttsssssssssS.BR.M.........",".............ttsssssssssssS.M.M.........",".............tsBBBssssBBBsS.M...........",".............tssJssssssJssSggggx........",".............tssksssssskssSgnnnx........",".............SsssssssssssSSgnnnx........","..............SsssssssssSS.gnnnx........","...............SssrrrrsSS..gnnnx........","............GGGGSSSSSSSSFGGfnnnx........","...........GGFFFFtssssSFFFFFfnnx........","..........fGFFFFFSSSSSSFFFFFffnx........","..........GfFFFFFFFFFFFFFFFffnnx........","..........GFfffFFFFFFFFFfffffnnx........",".....GGGGfGFNFFffffffffffFFNfnGGGGf.....",".....GFFFfGFFNFFFFFiGFFFFFNffnGFFFf.....",".....GFFFfGFFFNNFFFiGFFFNNFffnGFFFf.....",".....GFFFfGFFFFFNFFiGFFNFFFffnGFFFf.....",".....GFFFfGFFFFFFNFOOFNFFFFffnGFFFf.....",".....GFFFfGFFFFFFFJwwUFFFFFffnGFFFf.....",".....GFFFfGFFFFFFFJwwUFFFFFffxGFFFf.....",".....GFFFfGFFFFFFFNFFNFFFFFff.GFFFf.....",".....GFFFfGFFFFFFNFiGFNFFFFff.GFFFf.....",".....GFFFfGFFFFFNFFiGFFNFFFFffGFFFf.....",".....GFFFfFFFFNNFFFiGFFFNNFFffGFFFf.....",".....MMMMMnFFNFFFFFiGFFFFFNFfMMMMMn.....",".....MNNNNnFNFFFFFFiGFFFFFFNfMNNNNn.....",".....MNNNNnFFFFFFFFiGFFFFFFFfMNNNNn.....",".....ntttSnFFFFFFFFiGFFFFFFFfntttSn.....","......tssSxxxxxxxxxxxxxxxxxxxxtssS......",".....StssSSxxxxxxxxxxxxxxxxxxStssSS.....","......tssSfffffffffiGffffffffftssS......","......SSSSfffffffffiGfffffffffSSSS......",".............MNNNNn..MNNNNn.............",".............MNNNNn..MNNNNn.............",".............MNNNNn..MNNNNn.............",".............MNNNNn..MNNNNn.............",".............gggggx..gggggx.............",".............gnnnnx..gnnnnx.............",".............xxxxxx..xxxxxx.............",".............MNNNNn..MNNNNn.............",".............MNNNNn..MNNNNn.............",".............MNNNNn..MNNNNn.............",".............MNNNNn..MNNNNn.............",".............MNNNNn..MNNNNn.............","..........NNNNNNNxn..nNNNNNNNx..........",".........NNnnnnnnx....Nnnnnnnnx.........","........NNnnnnnnnx....Nnnnnnnnnx........","........xxxxxxxxxx....xxxxxxxxxx........","........................................"]), px: 1.65, hand: [36,41] },
  magier: { w: 40, h: 60, cells: R(["........................................","..............B.....B...................","..............B.....BB....B.............","..............BB...wBB...BB.............",".............wwBB..wBB...wBB............",".............wmBB.wwmBB.wwBB............",".............wmmmwwmmmmwwmBB.BB.........",".........wwwwwmmmmmmmmmmmmmmwBB.........",".........wmmmmmmmmmmmmmmmmmmmBB.........",".........wmBBBBBBBBBBBBBBBmmBBB.........",".........BBBBBBBBBBBBBBBBBBmBB..........","..........BwwBttsssssssssSwwBB..........","..........BwmBtssssssssssSwmBB..........","..........BwBBtxxxssssxxxsBmBB..........","...........wBtssJssssssJssSwB...........","...........BBtssJssssssJssSBB...........","............BSsssssssssssSSB............","............B.tssssssssssS.B............","..............SsssrrrrssSS..............","...............SSsssssSSS...............","...........uuuuuuSSSSSSuuuux............","...........xWWWWWWWWWWWWWWxx............",".........uuuuWWWWWWWWWWWWWxuxx..........",".........uWWxWWWWWWWWWWWWxxWxx..........","....uuuuuxWWWxxxxxxxxxxxxxWWxxuuuuux....","....uWWWWxWWWWWWWWxxxxkWWWWWxxuWWWWx....","....uWWWWxWWWWWWWWxxxxkWWWWWxxuWWWWx....","....uWWWWxWWWWWWWWxxxxkWWWWWWxuWWWWx....","....uWWWWxWWWWWWWWYxxYkWWWWWWxuWWWWx....","...uuWWWWxWWWWWWWWxxxxkWWWWWWxuWWWWWx...","...uWWWWWxWWWWWWWWxxxxkWWWWWWxuWWWWWx...","...uWWWWWxWWWWWWWWxxxxkWWWWWWxuWWWWWx...","...uWWWWWxWWWWWWWWYxxYkWWWWWWxuWWWWWx...","...uWWWWxxWWWWWWWWxxxxkWWWWWWxxWWWWWx...","...uWWWWxWWWWWWWWWxxxxkWWWWWWxxuWWWWx...","...uWWWWxWWWWWWWWWxxxxkWWWWWWxxuWWWWx...","...uWWWWxWWWWWWWWWYxxYkWWWWWWWxuWWWWx...","...uWWWWxWWWWWWWWWxxxxkWWWWWWWxuWWWWx...","...uWWWWxWWxxxxxxxxOOxxxxxxxxWxuWWWWx...","..uuWWWWxWWxxxxxxxJwwUxxxxxxxWxuWWWWWx..","..uWWWWWxWWWWWWWWWJwwUkwwmWWWWxuWWWWWx..","..uWWWWWxWWWWWwwmWxFFxkwBmWWWWxuWWWWWx..","..uWttSxxWWWWWwBmWxxxxkwBmWWWWxxxttSWx..","..xttssSWWWWWWwBmWxxxxkwRmWWWWxxttssSx..","...tsssSWWWWWWwRmWxxxxkwBmWWWWxxtsssS...","...SssSSWWWWWWwBmWxxxxkwBmWWWWWxSssSS...","....SSSWWWWWWWwBmWxxxxkwRmWWWWWxxSSS....","......uWWWWWWWwRmWxxxxkwBmWWWWWxx.......","......uWWWWWWWwBmWxxxxkwBmWWWWWxx.......","......uWWWWWWWmmmWxxxxkwBmWWWWWxx.......","......uWWWWWWWWWWWxxxxkmmmWWWWWxx.......","......uWWWWWWWWWWWxxxxkWWWWWWWWxx.......","......uWWWWWWWWWWWxxxxkWWWWWWWWxx.......","......uWWWWWWWWWWWxxxxkWWWWWWWWxx.......",".....uuWWWWWWWWWWWxxxxkWWWWWWWWWxx......",".....uWWWWWWWWWWWWxxxxkWWWWWWWWWxx......",".....xxxxxxxxxxxxWxxxxkxxxxxxxxxxx......",".....YYYYYYYYYYYYWxxxxkYYYYYYYYYYYY.....",".....YYYYYYYYYYYYkkkkkkYYYYYYYYYYYY.....","........................................"]), px: 1.65, hand: [36,43] },
  pyromant: { w: 40, h: 60, cells: R(["........................................","..................oo....................","............o.....oo......o.............","............oo...YYoo....oo.............","............oo...YOoo...Yoo.............","............Yoo.YYOOoo.YYOoo............","............YOOYYOOOOOYYOOoo............","............YOOOOOOOOOOOOOoo............","........oYYYYOOOOOOOOOOOOOOOYooo........",".........YOOooooooooooooooOOOoo.........",".........YooooooooooooooooooOoo.........",".........ooYYottsssssssssSYYooo.........","..........oYootssrssssrsssoOoo..........","...........YotsrrssssssrrsSYo...........","...........ootssYssssssYssSoo...........","............otssYssssssYssSo............","............oSsssssssssssSSo............","..............SsssssssssSS..............","...............SssrrrrsSS...............","................SSSSSSSS................",".........o......YtssssSo.....o..........",".........Yo....YYSSSSSSOo...Yo..........",".........ooogkgooooggoooogggoo..........",".........gxxxoxxxOOooOrxxgoxxk..........",".....ggggkxxxkxxxORRRRrxxgxxxkggggk.....",".....gxxxkxxxkxxxORRRRrxxgxxxkgxxxk.....",".....gxxxkxxxkxxxORRRRrxxgxxxkgxxxk.....",".....gxxxkxxkkxxxORRRRrxxkxxxkgxxxk.....",".....gxxxkxxkxxxxORRRRrxxxgxxkgxxxk.....",".....gxxxkxxkxxxxORRRRrxxxgxxkgxxxk.....",".....gxxxkxxkxxxxOROORrxxxgxxkgxxxk.....",".....gxxxkxxkxxxxOJwwUrxxxgxxkgxxxk.....",".....gxxxkxxkxxxxOJwwUrxxxgxxkgxxxk.....",".....gxxxkxxkxxxxORFFRrxxxgxxxgxxxk.....",".....gxxxkxxkxxxxORRRRrxxxgxxxgxxxk.....",".....gxxxkxxkxxxxORRRRrxxxgxxxgxxxk.....",".....gxxxkxxkxxxxORRRRrxxxgxxxgxxxk.....",".....kkkkkxxkxxxxORRRRrxxxgxxxkkkkk.....","........gxxkkxxxxORRRRrxxxkxxxk.........","....wwwwwwmkxxxxxORRRRrxxxxgxwwwwwwm....","....wDBBBBmnnnnnnnnnnnnnnnnnnwDBBBBm....","....wBBBBBmnnnnnnnnnnnnnnnnnnwBBBBBm....","....wBBBDBmkkkkkkORRRRrkkkkgxwBBBDBm....","....mmmmmmmkkkkkkORRRRrkkkkkkmmmmmmm....",".............uWWWrrrrrrWWWx.............",".............uWWWWx..uWWWWx.............",".............uWWWWx..uWWWWx.............",".............uWWWWx..uWWWWx.............",".............uWWWWx..uWWWWx.............",".............uWWWWx..uWWWWx.............",".............uWWWWx..uWWWWx.............",".............uWWWWx..uWWWWx.............",".............uWWWWx..uWWWWx.............",".............uWWWWx..uWWWWx.............",".............uWWWWx..uWWWWx.............",".............uWWWWx..uWWWWx.............","..........OOOOOOOrx..xOOOOOOOr..........",".........OORRRRRRr....ORRRRRRRr.........","........rrrrrrrrrr....rrrrrrrrrr........","........................................"]), px: 1.65, hand: [36,43] },
  aristokrat: { w: 40, h: 60, cells: R(["........................................","........................................",".................qqqqqq.................","..............qqqqxxxxxqqq..............",".............qqxxxxxxxxxxqq.............","............qqxxqqqqqxxxxxqq............","...........qqqqqqqqqqqqqxxqq............","..........qqqqqqq.....qqqxxqq...........","..........qqqq...........qxqq...........","..........qqq...tttttttS..qqq...........","..........qqq..ttsssssssS.qqq...........","...........q..ttsssssssssS.q............","...........q.ttsssssssssssSq............",".............kggkkkkkkkkggk.............",".............kkkkkkkkkkkkkk.............",".............kkkkkkkkkkkkkk.............",".............SsssssssssssSS.............","..............SsssssssssSS..............","...............SssrrrrsSS...............","................SSSSSSSS................",".................tttttS.................",".................tssssS.................","..........PPPPPPPSSSSSSPPPPqq...........","..........PQQQQQQwmmmmBQQQQqq...........","....PPPPPqPQQQQQQwmmmmBQQQQqq.PPPPPq....","....PQQQQqPQQQQQzwOOrmByQQQqq.PQQQQq....","....PQQQQqPQQQQQzBORrBByQQQqq.PQQQQq....","....PQQQQqPQQQQQzYORrYYyQQQQqqPQQQQq....","....PQQQQqQQYQQQzYORrYYyQQQYqqPQQQQq....","....PQQQQqQQQQQQzYORrYYyQQQQqqPQQQQq....","....PQQQQqQQQQQQzYrrrYYyQQQQqqPQQQQq....","....PQQQQqQQQQQQzYYkkYYyQQQQqqPQQQQq....","....PQQQQqQQYQQQzYYrYYYyQQQYqqPQQQQq....","....PQQQQqQQQQQQzYYrYYYyQQQQqqPQQQQq....","....PQQQQqQQQQQQzYYrYYYyQQQQqqPQQQQq....","....PQQQQqQQQQQQzYYrYYYyQQQQqqPQQQQq....","....PQQQQqQQQQQQzYYYYYYyQQQQQqPQQQQq....","....PQQQQqQQQQQQzYYYYYYyQQQQQqPQQQQq....","....wwwwwwQQQQQQzYYYYYYyQQQQQqwwwwww....","....wwwwwwQQQQQQzYYYYYYyQQQQQqwwwwww....","....wwwwwwQQQQQQzYYYYYYyQQQQQqwwwwww....","......ttSQQQQQQQzYYYYYYyQQQQQqqttS......",".....ttssSQQQQQQzYYYYYYyQQQQQqttssS.....",".....tsssSQQQQQQyyyyyyyyQQQQQqtsssS.....",".....SssSSQQQQQQQQQQQQQQQQQQQqSssSS.....","......SSSQQQQQQQQQQQQQQQQQQQQQqSSS......",".......PQQQQQQQQQQQQQQQQQQQQQQqq........",".......qqqqqqqqqqqqqqqqqqqqqqqqq........",".......qqqqqqqqqqqqqqqqqqqqqqqqq........","..............xWWWk..xWWWk..............","..............xWWWk..xWWWk..............","..............xWWWk..xWWWk..............","..............xWWWk..xWWWk..............","..............xWWWk..xWWWk..............","..............xWWWk..xWWWk..............","...........hhhhhhkk..khhhhhhk...........","..........hhxxxxxk....hxxxxxxk..........",".........hhxxxxxxk....hxxxxxxxk.........",".........kkkkkkkkk....kkkkkkkkk.........","........................................"]), px: 1.65, hand: [36,43] },
  gaertnerin: { w: 40, h: 60, cells: R(["........................................","................MMMMnn..................",".............MMMMNNNNNMnn...............","............MMNNNNNNNNNNnn..............","...........MMNNNNNNNNNNNNNnn............","..........MMFNNNNNNNNNNNNNNFn...........",".........MMFNNNNNNNNNNNNNNNNFn..........",".........MNNGnnnNNNNNNnnnnNGnn..........",".........MNnnnnnnnnnnnnnnnnNnn..........",".........Mnnn...tnnnnnnS...Mnn..........",".........Mnn...ttsssssssS..nnn..........",".........nnn..ttsssssssssS..nn..........",".........nn..ttYssssssssYsS..n..........","........Mnn..zzzzYsssszzzzY.Mnn.........","........MNNMnzwwwYsssszwwwYMMNn.........","........MNNNYzwkwYYYYYzwkwYYNNn.........","........MNNNnzwwwYsssszwwwYNNNn.........","........MNNNnYYYYYssssYYYYYNNNn.........","........MNNNn..YsssssssSY.MNNNn.........","........MNNNn...SSSRRSSS..MNNNn.........","........MNNNn.............MNNNn.........","........MNNNn.............MNNNn.........","........MNNnn....tttttS...nNNNn.........","........MNNn.....tssssS....MNNn.........","........MNNn...GGtssssSGf..MNNn.........",".....wwwMNNnwwwwFSSSSSSFwwwMNNnwwwB.....",".....wmmMNNnmmmwFFFFFFFFwmmMNNnmmmB.....",".....wmmMNNnmmmwFFFFFFFFwmmMNNnmmmB.....",".....wmmnNNnmmmwFFFFFFFFwmmMNnnmmmB.....",".....wmmmnnnmmmwFFFFFFFFwmmnnnwmmmB.....",".....wmmmBmnmmmwFFFFFFFFwmmnBBwmmmB.....",".....wmmmBmmmmmwFFFFFFFFwmmmBBwmmmB.....",".....wmmmBmmmmmwFFFFFFFFwmmmBBwmmmB.....",".....wGmmFmmmmmwFFFFFFFFwmmmBBwmmmB.....",".....wmmFBmmmmmwFFFFFFFFwmmmBBwmmmB.....",".....wFFmBmmmmmwFFFFFFFFwmmmBBwmmmB.....",".....FmmGBmmmmmwFFFFFFFFwmmmmBwmmmB.....",".....BBBBBmmmmmwFFFFFFFFwmmmmBBBBBB.....","......tttSmmmmmwFFFFFFFFwmmmmBtttS......","......tssSmmmmmwFFFFFFFFwmmmmBtssS......",".....StssSSmmmmwFFFFFFFFwmmmmStssSS.....","......tssSmmmmmwFFFFFFFFwmmmmBtssS......","......SSSSwwmmmwFFFFFFFFwmmwwwSSSS......",".......wwBFBmmmwFFFFFFFFwmmwBBBm........",".......wwBBBmmmwFFFFFFFFwmmwBBBm........",".......wwBBBmmmwFFFFFFFFwmmwBBBm........",".......wwBBBmmmwFFFFFFFFwmmwBBBm........",".......wmmmmmmmwFFFFFFFFwmmmmmmm........",".......wmmmmmmmwFFFFFFFFwmmmmmBB........",".......wmmmmmmmwFFFFFFFFwmmmmmBB........","......wwmmmmmmmwFFFFFFFFwmmmmmmBB.......","......BBBBBBBBBwFFFFFFFFwBBBBBBBB.......","......BBBBBBBBBwffffffffwBBBBBBBB.......","..............tssS....tssS..............","...........MMMMMMn....MMMMMMn...........","..........MMNNNNNn....MNNNNNNn..........","..........MNNNNNNn....MNNNNNNn..........",".........MMNNNNNNn....MNNNNNNNn.........",".........nnnnnnnnn....nnnnnnnnn.........","........................................"]), px: 1.65, hand: [36,41] },
};
const NPCS2 = {
  brumm: { w: 40, h: 60, cells: R(["........................................","........................................","........................................","........................................","........................................","..................VVVuu.................","................VVVUUUUVuu..............","..............VVVUUUUUUUuu..............","..............VUUUURRUUUUuu.............",".............VVUUUUUUUUUUuu.............",".............VUUUUUUUUUUUuu.............","............VVUUUUUUUUUUUuu.............","............uuuuuuuuuuuuuuuu............","..........wwwwwwwwwwwwwwwwwwww..........","..........wwwwwwwwwwwwwwwwwwww..........",".............ttxxxssssxxxsS.............",".............tssssssssssssS.............",".............tssksssssskssS.............","............StssksRRRSskssSS............",".............tsqqqqqqqqqqsS.............",".............qqqxxxxxxxxxqq.............","............qqxxxxxxxxxxxxqq............",".............qqxxxxxxxxxqqq.............","...............qqqqqqqqqq...............","................SSSSSSSS................","........................................","........................................","........................................","................wwwwwwmm................","..............wwwBBBBBBBmm..............","............wwwBBBBBBBBBBBmm............","...wwwwwm..wwBBBBBBBBBBBBBBmm..wwwwwm...","...wBBBBm.wwVVVVVVVVVVVVVuuBmm.wBBBBm...","...wBBBBmwwBVUUUUUUUUUUUUuuBBmmwBBBBm...","...wBBBBmwBBVUUUUUUUUUUUUuuBBBmwBBBBm...","...wBBBBmBBBVUUUUUUUUUUUUuuBBBmwBBBBm...","...wBBBBmBBBwwwwwwwwwwwwwwwwBBBwBBBBm...","...wBBBBmBBBwwwwwwwwwwwwwwwwBBBwBBBBm...","...wBBBBmBBBVUUUUUUUUUUUUuuBBBBwBBBBm...","...wBBBBmxxxxxxxxxxxxxxxxxxxxxxwBBBBm...","...wBBBBmxxxxxxxxxxxxxxxxxxxxxxwBBBBm...","...wBBBBmBBBwwwwwwwwwwwwwwwwBBBwBBBBm...","...wBBBBmBBBwwwwwwwwwwwwwwwwBBBwBBBBm...","...wBBBBmBBBVUUUUUUUUUUUUuuBBBBwBBBBm...","...mmmSmmBBVVUUUUUUUUUUUUUuuBBmmmSmmm...","....ttttSBBVUUUUUUUUUUUUUUuuBBmttttS....","....tsssSBBVwwwwwwwwwwwwwwwwBmmtsssS....","...StsssSSBVwwwwwwwwwwwwwwwwmmStsssSS...","....tsssS.mVUUwwRwwUUUUUUUuumm.tsssS....","....SSSSS..VUUwwwwwUUUUUUUuum..SSSSS....","......S....VUUwwwwwUUUUUUUuu.....S......","...........Vwwwwwwwwwwwwwwww............","...........Vwwwwwwwwwwwwwwww............","...........VUUUUUUUUUUUUUUuu............","...........uuuuuuuuuuuuuuuuu............","...........uuuuuuuuuuuuuuuuu............","...........hhhhhhkx..xhhhhhhk...........","..........hhxxxxxk....hxxxxxxk..........",".........kkkkkkkkk....kkkkkkkkk.........","........................................"]), px: 1.55, hand: [36,47] },
  mira: { w: 40, h: 60, cells: R(["........................................","................JJJJJuu.................",".............JJJJVVVVVVJuu..............","............JJVVVVVVVVVVVuu.............","...........JJVVVVVVVVVVVVVuu............","..........JJVVVVVVVVVVVVVVVuu...........",".........JJVVVVVVVVVVVVVVVVVuu..........",".........JVVVVVVVVVVVVVVVVVVuu..........",".........JVVuuuuVVVVVVuuuuVVuu..........",".........JVuuuuuuuuuuuuuuuuVuu..........",".........Juuu...tuuuuuuS...uuu..........",".........uuu...ttsssssssS...uu..........",".......JJuuu..tYssssssssYS..uuJJu.......",".......JVuVu.zzzzYsssszzzzY.JuVVu.......",".......JVVVu.zwwwYsssszwwwY.JVVVu.......","......JJVVVuYzwuwYYYYYzwuwYYJVVVVu......","......JVVVVu.zwwwYsssszwwwY.JVVVVu......","......JVVVVu.YYYYYssssYYYYY.JVVVVu......","......JVRVVu..SYssssssssYS..JVVRVu......","......JVVVVu...SsssRRssSS...JVVVVu......","......JVVVVu....SSSSSSSS....JVVVVu......",".....JJVVVVu.....tttttS.....JVVVVVu.....",".....JVVVVVu.....tssssS.....JVVVVVu.....",".....JVVVVVu.....tssssS.....JVVVVVu.....",".....JVVVVuuwwwwPtssssSqwwwwuVVVVVu.....",".....JVVVVummmmmwSSSSSSwmmmmBJVVVVu.....",".....JVVVVummmmmwQQQQQQwmmmmBJVVVVu.....","....JJVVVVummmmmwQQQQQQwmmmmBJVVVVVu....","....JVVVVVummmmmwQQQQQQwmmmmBJVVVVVu....","....JVVVVVummmmmwQQQQQQwmmmmBJVVVVVu....","....JVVVVVummmmmwQQOOQQwmmmmBJVVVVVu....","....uVVVVVummmmmwQJwwUQwmmmmmJVVVVuu....",".....JVVVVummmmmwQJwwUQwmmmmmJVVVVu.....",".....JVVVVummmmmwQQFFQQwmmmmmJVVVVu.....",".....JVVVVummmmmwQQQQQQwmmmmmJVVVVu.....",".....uVVVVummmmmwQQQQQQwmmmmmJVVVuu.....",".....wJVVuummmmmwQQQQQQwmmmmmuVVVuB.....",".....wJVuummmmmmwQQQQQQwmmmmmBuVVuB.....",".....wuuuBmmmmmmwQQQQQQwmmmmmBwuuuB.....",".....BBuBBmmmmmmwQQQQQQwmmmmmBBBuBB.....","........wmmmmmmmwQQQQQQwmmmmmBB.........","......ttSmmmmmmmwQQQQQQwmmmmmBBttS......",".....ttssSmmmmmmwQQQQQQwmmmmmBttssS.....",".....tsssSmmmmmmwQQQQQQwmmmmmBtsssS.....",".....SssSSmmmmmmwQQQQQQwmmmmmBSssSS.....","......SSSmmmmmmmwQQQQQQwmmmmmmBSSS......",".......wmmmmmmmmwQQQQQQwmmmmmmBB........",".......wmmmmmmmmwQQQQQQwmmmmmmBB........",".......wmmmmmmmmwQQQQQQwmmmmmmBB........","......uwmmmmmmmmwQQQQQQwmmmmmmBBx.......","......uBBBBBBBBBwQQQQQQwBBBBBBBBx.......","......uBBBBBBBBBwQQQQQQwBBBBBBBBx.......","......uWWWWWWWWWwqqqqqqwWWWWWWWxx.......","......uWWWWWWWWWWWWWWWWWWWWWWWWxx.......","......uWWWWWWWWWWWWWWWWWWWWWWWWxx.......",".....uuWWWWWWWWWWWWWWWWWWWWWWWWWxx......",".....xxxxxxxxxxxxxxxxxxxxxxxxxxxxx......",".....xxxxxxxxxxxxxxxxxxxxxxxxxxxxx......",".........xxxxxxxxx....xxxxxxxxx.........","........................................"]), px: 1.55, hand: [36,43] },
};
const RIGS2 = {
  nahkaempfer: {"rel":true,"regions":[{"id":"up","box":[0,0,1,0.7458],"seq":[[0,0],[0,1]],"dur":2.2}],"blink":[{"cells":[[0.4103,0.2373],[0.5897,0.2373]],"color":"s","every":4.6,"at":0.8}]},
  fernkaempfer: {"rel":true,"regions":[{"id":"up","box":[0,0,1,0.7119],"seq":[[0,0],[0,1]],"dur":2}],"blink":[{"cells":[[0.4103,0.2373],[0.5897,0.2373]],"color":"s","every":3.8,"at":1.5}]},
  magier: {"rel":true,"regions":[{"id":"up","box":[0,0,1,0.7458],"seq":[[0,0],[0,1]],"dur":2.4},{"id":"hem","parent":null,"box":[0.1026,0.8475,0.8974,0.9831],"seq":[[0,0],[1,0],[0,0],[-1,0]],"dur":3,"under":true}],"blink":[{"cells":[[0.4103,0.2373],[0.5897,0.2373]],"color":"s","every":5,"at":2}],"glow":[{"letters":"J","box":[0.359,0.2034,0.641,0.2712],"color":"w","max":0.7,"dur":1.8}]},
  pyromant: {"rel":true,"regions":[{"id":"up","box":[0,0,1,0.7627],"seq":[[0,0],[0,1]],"dur":2}],"blink":[{"cells":[[0.4103,0.2373],[0.5897,0.2373]],"color":"S","every":4.2,"at":1}],"glow":[{"letters":"Y","box":[0.359,0.2034,0.641,0.2712],"color":"w","max":0.7,"dur":1.4}]},
  aristokrat: {"rel":true,"regions":[{"id":"up","box":[0,0,1,0.7966],"seq":[[0,0],[0,1]],"dur":2.6},{"id":"tail","parent":"up","box":[0.1538,0.7119,0.8462,0.8305],"seq":[[0,0],[1,0],[0,0],[-1,0]],"dur":2.4,"under":true}],"blink":[{"cells":[[0.4103,0.2373],[0.5897,0.2373]],"color":"k","every":99,"at":0}]},
  gaertnerin: {"rel":true,"regions":[{"id":"up","box":[0,0,1,0.6102],"seq":[[0,0],[0,1]],"dur":2.2},{"id":"hem","parent":null,"box":[0.1026,0.7458,0.8974,0.8983],"seq":[[0,0],[1,0],[0,0],[-1,0]],"dur":2.8,"under":true}],"blink":[{"cells":[[0.3846,0.2542],[0.6154,0.2542]],"color":"s","every":4.4,"at":0.9}]},
  brumm: {"rel":true,"regions":[{"id":"up","box":[0,0,1,0.7627],"seq":[[0,0],[0,1]],"dur":2}],"blink":[{"cells":[[0.4103,0.2881],[0.5897,0.2881]],"color":"s","every":3.6,"at":1.2}]},
  mira: {"rel":true,"regions":[{"id":"up","box":[0,0,1,0.7797],"seq":[[0,0],[0,1]],"dur":2.4},{"id":"hem","parent":null,"box":[0.0513,0.8475,0.9487,0.9831],"seq":[[0,0],[1,0],[0,0],[-1,0]],"dur":3.2,"under":true}],"blink":[{"cells":[[0.3846,0.2542],[0.6154,0.2542]],"color":"s","every":4.8,"at":0.5}]},
};

__exports.HEROES2 = HEROES2;
__exports.NPCS2 = NPCS2;
__exports.RIGS2 = RIGS2;

});
__define("ui/art/chars2.js", function (__exports, __require) {
const { ENEMIES2 } = __require("ui/art/enemies2.js");
const { HEROES2, NPCS2 } = __require("ui/art/heroes2.js");
// Figuren in höherer Auflösung (Helden 24x36, Gegner bis 48x44). Symmetrisch gezeichnet (linke Hälfte), dazu "over" für unsymmetrische Details.
// Farbschlüssel siehe core.js GLOBAL: g/h/i Stahl (dunkel/mittel/hell), s/S/t Haut, U/u/V Blau, f/F/G Grün, n/N/M Leder, R/r/O Rot/Orange, Y/y/z Gold.
const S = (rows, extra = {}) => ({ rows, sym: true, ...extra });

// Herzstein als Wahrzeichen auf der Ausrüstung: n x n Raster mit vier farbigen Facetten (oben Feuer, rechts Wasser, unten Pflanze, links Eis)
function gemRows(n) {
  const c = (n - 1) / 2, rows = [];
  for (let y = 0; y < n; y++) {
    let r = "";
    for (let x = 0; x < n; x++) {
      const dx = x - c, dy = y - c, d = Math.abs(dx) + Math.abs(dy);
      if (d > c + 0.1) { r += "."; continue; }
      if (d > c - 0.9) { r += "k"; continue; }                                   // dunkle Kante
      const top = Math.abs(dy) > Math.abs(dx);
      r += top ? (dy < 0 ? "O" : "G") : dx < 0 ? "J" : "V";
    }
    rows.push(r);
  }
  return rows;
}
// legt Zeilen an eine Stelle (x0, y0) in einer Zeilentabelle fester Breite
function place(width, y0, x0, lines) {
  const out = {};
  lines.forEach((ln, i) => { out[y0 + i] = ".".repeat(x0) + ln + ".".repeat(Math.max(0, width - x0 - ln.length)); });
  return out;
}

const HEROES = {
  nahkaempfer: S([
    "............",
    "...........R",
    "..........rR",
    "..........RO",
    "........ghhR",
    ".......ghhhi",
    "......ghhhii",
    "......ghhiii",
    "......ghhhii",
    "......gggggg",
    "......ghsssh",
    "......ghsskh",
    "......ghsssh",
    ".......gSssh",
    ".......gghhh",
    "......gghhii",
    "..gghhhhhiii",
    ".gghhiihYUUU",
    "gghhiiihYUUV",
    "ghhiihgYUUUV",
    "ghiihgYUUUUV",
    "ghhhggYUUUUU",
    "gihhgYUUUUUU",
    ".ghhgYUUUUUU",
    ".gihgYUUUUUU",
    ".ghhgnNNNNNN",
    ".gSSgnYYzYYY",
    ".gSSgYUUUUUU",
    "..gg.YUUUUUU",
    "......YUUUUU",
    "......nUUUUV",
    ".....ghhhhh.",
    ".....ghiihh.",
    ".....gghhhg.",
    ".....gnnNNn.",
    "....nnnNNNn.",
  ], { over: place(24, 17, 8, gemRows(8)) }),
  fernkaempfer: S([
    "............",
    ".........fff",
    ".......ffFFF",
    "......fFFFGG",
    ".....fFFFGGG",
    ".....fFFGGGG",
    "....fFFGGGGG",
    "....fFFfffff",
    "....fFfSSSSS",
    "....fFfsskss",
    "....fFfsssss",
    "....fFfssSSs",
    ".....ffMMMMM",
    "....fFFNMMMM",
    "...fFFFFFGGG",
    "..fFFFFFGGGG",
    ".fFFFNNNNNNN",
    "fFFFGNMNNNNN",
    "fFFGGNNNMNNN",
    "fFFGGNNNNNNN",
    "fFFGFNNNMNNN",
    "fFFGFNNNNNNN",
    "fFSGFNNNNNnn",
    "ffSSfnNNNnnn",
    ".ffffnNNnnNN",
    "..nnnnNYYzYY",
    "...ffnNNNNNN",
    ".....nNNNNn.",
    ".....nNNNNn.",
    ".....nnNNnn.",
    ".....fnNNnf.",
    ".....nNNNNn.",
    ".....nNNNNn.",
    ".....nnNNnn.",
    "....nnNNNnn.",
    "....kknnnnk.",
  ], { pal: { G: "#6aa653" }, over: place(24, 14, 9, gemRows(6)) }),
  magier: S([
    "...........P",
    "..........PQ",
    ".........PQQ",
    ".........QQq",
    "........PQQq",
    ".......PQQQq",
    "......PQQQqq",
    "......QQQYYY",
    ".....qqqqqqq",
    "..qqqqQQQQQQ",
    ".qqqqqqqqqqq",
    ".......SSSSS",
    ".......sskss",
    ".......sssss",
    "......wwwwww",
    "......wmmmmm",
    ".....wwmmmmm",
    ".uUUUUwwmmmm",
    "uUUUVUUwmmmm",
    "uUUVVUUUwmmm",
    "uUVVVUUUUwmm",
    "uUUVVUUUUUwm",
    "uUUUUUUUUUUw",
    "uuSSUUUUUUUU",
    "uuSSuUUUUUUU",
    ".uuuYYYYzYYY",
    ".uUUuUUUUUUU",
    ".uUUUUUUUUUV",
    "uUUUUVUUUUUV",
    "uUUUUVUUUUUU",
    "uuUUUUUUUUUU",
    "uUUUUUUVUUUU",
    "uuuuUUUUUUUU",
    "YYYYYYYYYYYY",
    "uuuunnnnnnn.",
    ".....nnnnnn.",
  ], { over: place(24, 23, 9, gemRows(6)) }),
  pyromant: S([
    "............",
    "...........r",
    "..........rR",
    ".........rRR",
    "........rRRR",
    ".......rRRRO",
    "......rRRRRO",
    "......rRRRRR",
    ".....rRRrrrr",
    ".....rRrSSSS",
    ".....rRrSYSS",
    ".....rRrSSSS",
    ".....rRrSkkS",
    "......rRrSSS",
    "....rRRRRRRR",
    "..rrRRRRRRRO",
    ".rRRRRRRRRRO",
    "rRRRRnRRRRRR",
    "rRRRrnRRRRRR",
    "rRRrRnRRUYRR",
    "rRRrRnRRUYRR",
    "rRRRrnRRRRRR",
    "rRSSrnRRRRRR",
    "rrSSrnRRRRRR",
    ".rrrrnRRRRRR",
    "..rrrnYYYYzY",
    "...rRnRRRRRR",
    "...rRRRRRRRR",
    "..rrRRRRRRRO",
    "..rRRRRRRROO",
    ".rrRRRRRRROO",
    ".rRRRRRRRROY",
    "rrRRRRRROOOY",
    "rRRRRRROOYYz",
    "rRROOOOYYYzz",
    "rROOYYzz....",
  ]),
  aristokrat: S([
    "............",
    "......xxxxxx",
    "......xggxxx",
    "......xgxxxx",
    "......xxxxxx",
    "......xxxxxx",
    "......YYYYYY",
    "....xxxxxxxx",
    "...xxxxxxxxx",
    ".......sssss",
    ".......sskss",
    ".......sssSS",
    "......nNnnnn",
    ".......sSSss",
    "......wwwwww",
    "...qQQQQQQww",
    "..qQQQQQQQww",
    ".qQQPQQQQYww",
    "qQQPPQQQQYww",
    "qQQPQQQQYYww",
    "qQQQQQQQYyww",
    "qQSSQQQQYyww",
    "qqSSqQQQYyww",
    ".qqqqQQQYyww",
    "..qqQQQQYYww",
    "...qQQQQQQQQ",
    "...qQQQQQQQq",
    "..qQQQQQQQQQ",
    "..qqQQQQQQQQ",
    "...xxxxxxxx.",
    "...xgxxxxxx.",
    "...xxxxxxxx.",
    "...xxxxxxxx.",
    "...xgxxxxxx.",
    "..kkkkkkkkk.",
    "..kwkkkkkkk.",
  ]),
  gaertnerin: S([
    "............",
    "...........R",
    "..........RY",
    ".......MMMMM",
    "......MMMMMM",
    "......MMMMMM",
    "......FFFFFF",
    ".MMMMMMMMMMM",
    "MMmmMMMMMMMM",
    "....nnssssss",
    "....nnssksss",
    "....nnsssSSs",
    "....nNsssssR",
    "....nNssssss",
    "...nNmmmmmmm",
    "...nNmmmmmmm",
    ".mmmnFFFFFFF",
    "mmmmnFFGFFFF",
    "mmmmmFFGFFFF",
    "mmmmmFFFFFFF",
    "mmmmmFFFFFYY",
    "mmSSmFFFFFYR",
    ".mSSmFFFFFFF",
    "..mmmFFfFFFF",
    "...nnfFFFFFF",
    "...nffffffff",
    "..FFFFFFFFFF",
    "..FFGFFFFFFF",
    ".FFFGFFFFGFF",
    ".FFFFFFFFGFF",
    "FFFFFFFFFFFF",
    "ffffffffffff",
    "....nnnnnnn.",
    "....nNnnnnn.",
    "...nnnnnnnn.",
    "..kkkkkkkkk.",
  ]),
};

const NPCS = {
  brumm: S([
    "............",
    ".........RRR",
    "........RRRO",
    ".......RRROO",
    "......RRRRRR",
    "......rrrrrr",
    "......sssssS",
    "......ssksss",
    "......sssssM",
    "....wwwwwwww",
    "....wwwwwwww",
    "...wwwmmmmmm",
    "...wwmmmmmmm",
    "..wwmmmmmmmm",
    "..wwwmmmmmmm",
    ".NNNNNNNNNNN",
    "NNNNNmmmmmmm",
    "NNNNnmmmmmmm",
    "NNnnnmmwmmmm",
    "SSnnnmmmmmmm",
    "SSnnnmmmmmmm",
    ".nnnnmmmmmmm",
    "..nnnnmmmmmm",
    "..nnnMMMMMMM",
    "...nnnNNNNNN",
    "....NNNNNNNN",
    "....nnnNNNNN",
    "....nnnNNNNN",
    "....nnNNNNNN",
    "...nnnnNNNNN",
    "...kkkkkkkkk",
    "............",
  ]),
  mira: S([
    "............",
    ".......Y...Y",
    ".......YYYYY",
    ".......yYzYY",
    "......nnnnnn",
    ".....nnNNNNN",
    ".....nNsssss",
    ".....nNsssks",
    ".....nNsssss",
    ".....nNssSSs",
    ".....nNsssRs",
    "....nNNNssss",
    "....nNNnPPPP",
    "...nNNnPPPPP",
    "...nNNnPPQQQ",
    "...nNNnPPQQQ",
    "...nNNnPPPPP",
    "...nNNYYYYYY",
    "...nNNnPPQQQ",
    "..nNNNPPPPPQ",
    "..nNNPPPPQQQ",
    "..nNnPPPPQQQ",
    "...nPPPPQQQQ",
    "...PPPPPQQQQ",
    "..PPPPPQQQQQ",
    "..PPPPQQQQQQ",
    ".PPPPQQQQQQQ",
    ".PPPQQQQQQQq",
    "PPPQQQQQQQqq",
    "PPQQQQQQQqqq",
    "YYYYYYYYYYYY",
    "qqqqqqqqqqqq",
  ]),
};

// ---------------------------------------------------------------- Gegner
const A = (rows, extra = {}) => ({ rows, ...extra });
const ENEMIES = {
  ratte: A([
    ".........nn.................",
    "........nNpn................",
    ".......nNppNn.nnnnnnn.......",
    "....nnnnnnnnnnnnnnnnnnn.....",
    "..nNNNwNNNNNNNNNNNNNNNNNn...",
    ".MMNNkNNNNNNNNNNNNNNNNNNNn..",
    "pMMMNNNNNNNNNNNNNNNNNNNNNn.p",
    ".MMMMNNNNNNNNNNNNNNNNNNNNppp",
    "..wwNNNNNNNNNNNNNNNNNNNNn...",
    ".....nMMMMMMMMMMMMMMMMn.....",
    ".....nNnnnnnnnnnnNNnn.......",
    ".....nNn........nNNn........",
    "....nMMn.......nMMMn........",
    "....kkkk.......kkkkk........",
  ], { pal: { p: "#e86f9a" } }),
  goblin: S([
    "........." ,
    "....fFFFF",
    "...fFFFGG",
    "..fFFFGGG",
    "ffFFFFFGG",
    "fFFFFFFFF",
    ".fFFYkFFF",
    "..fFFFFFF",
    "..fFFFfFF",
    "..fFkkkkk",
    "..fFFwFFw",
    "...fFFFFF",
    "....nNNNN",
    "...NNNnnN",
    ".FFNNNnnN",
    "FFFNNnnnN",
    "FFFNnnnnn",
    "FSFNnYnnn",
    ".FFNNNNNN",
    "..nnnNNNN",
    "...NNNNNN",
    "...NNNNNN",
    "...fFFFF.",
    "...fFFFF.",
    "..ffFFFF.",
    "..kkfFFFk",
  ]),
  skelett: S([
    ".........",
    "....mmmmm",
    "...mmmmmm",
    "..mmmmmmm",
    "..mmmmmmm",
    "..mkkmmkk",
    "..mkJkmkJ",
    "..mmmmmBm",
    "...mmBBBB",
    "...mmkBkB",
    "....kmmmm",
    "....BmBmB",
    ".....BBBB",
    "..BBBBBBB",
    ".BmmBmBmB",
    ".B.BBBBBB",
    ".m.mBkBkB",
    ".B.BmBmBm",
    ".m.BBBBBB",
    ".B..BkBkB",
    ".m..BBBBB",
    ".m...mBmB",
    ".B...BBBB",
    ".m..BBBBB",
    "....BmBmB",
    "....BBBBB",
    "....mB.mB",
    "....mB.mB",
    "....mB.mB",
    "....BB.BB",
    "....mB.mB",
    "....mB.mB",
    "...mmB.mB",
    "...kkk.kk",
  ]),
  glutgeist: S([
    ".........",
    "....O...O",
    "....OO.OO",
    "...OOOOOO",
    "..ooOOOOO",
    ".ooOOOOOO",
    ".oOOOOOOO",
    "ooOOOOOOO",
    "ooOOOOOOO",
    "ooOkkOOOO",
    "ooOkzOOOO",
    "ooOOOOOOO",
    "ooOOkkkkk",
    "ooOOOkOkO",
    "ooOOOOYYY",
    "ooOOOOYYY",
    ".ooOOOYYY",
    ".ooOOOYYY",
    ".oooOOYYY",
    ".oooOOYYY",
    ".oooOOYYY",
    ".ooOOOOOO",
    ".ooOOOOOO",
    ".ooOOOOOO",
    ".oo.OOOOO",
    ".oo..OOOO",
    ".o...OOOO",
    "......OOO",
    ".......OO",
  ]),
  funke: S([
    "......",
    ".....Y",
    "....YY",
    "..YYzz",
    ".YYzzw",
    "YYzzww",
    "YYzzww",
    ".YYzzw",
    "..YYzz",
    "....YY",
    ".....Y",
    "......",
  ]),
  bandit: S([
    "..........",
    "......xxxx",
    ".....xWWWW",
    "....xWWWWW",
    "...xWWWWgW",
    "...xWWgWWW",
    "...xWxxxxx",
    "...xWxxYxx",
    "...xWRRRRR",
    "...xWrRRRr",
    "...xWWrrrr",
    "..xxWWWgWW",
    ".xWWgWWWWW",
    "xWWWgWWWWW",
    "xWWgWWWWWg",
    "xWWWWgWWWW",
    "xWgWWWWgWW",
    "xWWWWWWWWW",
    "xWWgWWWWgW",
    "xWWWWnnnnn",
    "xWWWnNNNNY",
    "nnWWnNiiNN",
    "nNnWWnNNNN",
    "nnNWWWWWWW",
    ".nnWWgWWWW",
    "..WWWWWWWW",
    "..WWgWWWWW",
    "..WgWWWWWW",
    "...WWWWWW.",
    "...WWWWWW.",
    "...gWWWWW.",
    "...WWWWWW.",
    "..nnnWWWW.",
    "..nNNnnnn.",
  ], { pal: { W: "#4a4468", g: "#7a7498", x: "#2b2433" } }),
  flussgeist: S([
    ".........",
    "........U",
    ".......UU",
    "......UUU",
    ".....VUUU",
    "....VJUUU",
    "...VUUUUU",
    "..uVJUUUU",
    "..uVVUUUU",
    ".uVJUUUUU",
    ".uVUUUUUU",
    ".uUkwUUUU",
    ".uUkkUUUU",
    "uUUUUUUUU",
    "uUUUUUUUU",
    "uUUUUUwww",
    "uUUUUUwww",
    "uUUUUUUUU",
    "uUUUUUUUU",
    ".uUUUUUUU",
    ".uUUUUUUU",
    ".uuUUUUUU",
    "..uVVVVVJ",
    "..uVVVVVV",
    "..uV.VVVV",
    "..u...VVV",
    "......VVV",
    ".......VV",
  ]),
  dornenranke: S([
    ".........",
    "...R...RR",
    "..RRR.RRO",
    "..RRRRRRO",
    ".RRrRRRRO",
    ".RRkYRRRO",
    ".RRRRRRRO",
    ".RrkkkkkW",
    ".RRwkwkwk",
    "..RRRRRrr",
    "...rrRRrr",
    "....ffFFG",
    "....fFFGG",
    ".ff.fFFGG",
    "fFFfffFGG",
    "FFFFfFFGG",
    ".fFFfFFGG",
    "..y.fFFGG",
    "....fFFGG",
    "....fyFGG",
    "..ff.fFGG",
    ".fFFfffGG",
    "fFFFfFFGG",
    ".fFF.FFGG",
    "..y..fFGG",
    "....ffFGG",
    "...ffFFGG",
    "..ffFFFGG",
    ".ffFFFFGG",
    "ffFFFFGGG",
    "fFfFFFGGG",
    "kkkkkkkkk",
  ]),
  steingolem: S([
    "..............",
    "........gggggg",
    "......ghhhhhhh",
    ".....ghhiiiihh",
    ".....ghhiiihhh",
    ".....ghhhhhhhh",
    ".....ghOOhhhhh",
    ".....ghOOhhhhh",
    ".....ghhhhhkkk",
    "...gggghhhhhhh",
    "..ggghhhhhhhhh",
    ".gghhiihhhhhhh",
    "gghiiiihhhhhhh",
    "ghhiiihhgggggg",
    "ghhiihhgghhhhO",
    "ghiihhgghhhoOO",
    "ghiihhgghhoOzz",
    "ghhiihgghhoOzz",
    "ghhiihgghhhoOO",
    "ghhhhhgghhhhhO",
    "gghhhhgghhhhhh",
    "ggFfhhggghhhhh",
    ".ghhhhgggggggg",
    ".ghiihghhhhhhh",
    ".gghhhgghhhFFh",
    ".gihhhggggggfF",
    ".ghhhhg.gghhhh",
    "..ggggg..ggggg",
    "....ghhhhhhhhg",
    "....ghiihhhhhg",
    "....ghhhhhhhhg",
    "....ghhhFFhhhg",
    "....ghhhfFhhhg",
    "....gghhhhhhgg",
    "....ghhhhhhhhg",
    "...ggggggggggg",
  ]),
  knochenhauptmann: S([
    ".............",
    "...........rR",
    "..........rRR",
    "..........RRO",
    ".......gghhhR",
    "......ghhhiii",
    "......ghhiiii",
    "......ghhhhhh",
    "......gggggg.",
    "......gmmmmmm",
    "......gmkJkmm",
    "......gmkJkmm",
    "......gmmmBBm",
    "......gBkBkBk",
    ".......gBBBBB",
    "......ggghhhi",
    "..ggghhhhiiii",
    ".gghhiiiihhhh",
    "ggghiiihhgggg",
    "ghhiihhggBmBm",
    "ghhhhgggBmBmB",
    "ggghgBmBmBmBm",
    "rrgggBBBBBBBB",
    "rRrgBmBmBmBmB",
    "rRRgBBBBBBBBB",
    "rRRrgBmBmBmBm",
    "rRRRgBBBBBBBB",
    "rRRRrgYYYYzYY",
    "rRRRRgnnnnNNN",
    "rRRRrgBBBBBBB",
    "rRRRrr.BmBmBm",
    ".rRRr..BBBBBB",
    ".rRr...BmBBmB",
    "..rr...BBBBBB",
    ".......BmBmBm",
    ".......BBBBBB",
    "......gghhhhh",
    "......ggghhhh",
    "......kkkkkkk",
  ]),
  sumpfgeist: S([
    "..............",
    ".........FF...",
    ".......fFFGG.f",
    "......fFGGGGFf",
    "....ffFFFGGGGF",
    "...fFFFFFGGGFF",
    "..fFFGGFFFFFFF",
    "..fFFFFFFFFFFF",
    ".fFFFYYkFFFFYY",
    ".fFFFYkkFFFFYk",
    ".fFFFFFFFFFFFF",
    ".fFGFFFFFFFFFF",
    "fFFFFFkkkkkkkk",
    "fFFFFkwkwkwkwk",
    "fFFFFFFFFFFFFF",
    "fFFGFFFFFFGFFF",
    "fFFFFFFFFFFFFF",
    "fFFFFFFfFFFFFF",
    "ffFFFFFFFFFFFF",
    ".ffFFFFFFFFFFF",
    ".fffFFFFFFFFFF",
    "..ffffFFFFFFFF",
    "...fffffFFFFFF",
    "....ffffffFFFF",
    "......fffffffF",
    "..............",
  ]),
  frostwolf: A([
    "........J...........................",
    ".......JVJ..........................",
    ".......JVV.......w....w...........JJ",
    "......JVVVJ......wJ...wJ...w.....JVV",
    "......JVVVV......JJ...JJ...wJ...JVVU",
    "......JVVVVJ.....JJ...JJ...JJ..JVVU.",
    "....JwVVVVVVJ..JJJJJJJJJJJJJJ.JVVU..",
    "..JJVYkVVVVVVJJVVVVVVVVVVVVVJJVVU...",
    ".JVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV....",
    "kkVVVVVVVVVVVVVVVVVVJVVVJVVVVVVV....",
    ".UkkkkVVVVVVVVVVVVVVJVVVJVVVVVVV....",
    "..UwVVwVVVVVVVVVVVVVJVVVJVVVVVVU....",
    "....UUVVVVVVUUUUUUUUUUUUUUUUUUU.....",
    "......UUUUUU..UUUUUUUUUUUUUUUU......",
    "................UUUUUUUUUUUU........",
    ".............JJJ..UU..UU..VVJ.......",
    ".............VVV..UU..UU..VVV.......",
    ".............VVV..UU..UU..VVV.......",
    ".............VVV..UU..UU..VVV.......",
    ".............VVV..UU..UU..VVV.......",
    ".............VVV..UU..UU..VVV.......",
    ".............www..JJ..JJ..www.......",
    "....................................",
    "....................................",
  ]),
  elementarwandler: S([
    "......c...c...c.......",
    "......c...c...c.......",
    ".....ccc.ccc.ccc......",
    "m...ccccccccccccc.....",
    ".mm.cbbbbbbbbbb.......",
    ".mmmmmbbbbbbbbbc......",
    ".mmmmmaaaabbbbbb......",
    "..mmmmbbbbbbbbbb......",
    "..mmmmbeebbbbbbbc.....",
    ".mmbbbbeebbbbbbb......",
    "m..cbbbbbbbbbbbb......",
    "...cbkkkkkkkkbba......",
    "....cbmcmbmbmba.......",
    ".ccccccbbbbbbb........",
    "..cccccbbbbbbb.......c",
    "...ccc.cbbbbbb.ccccccb",
    "...ccc.cbbbbbbcbbbbbbb",
    "...cc..cbbbbbbbbbbbbbb",
    "..cbc..cbbbbbbbbbbbbba",
    "..cbb...aaaaaaaaaaaaac",
    ".cbbbc.cbbbbbbbbbbaccc",
    ".cbbbbcbbbbbbbbbbaccce",
    ".cbbbbbbbbbbbbbbacceee",
    ".cbbbbbbaaaaaaaaacceee",
    ".cbbbbbbbbbbbbbbaceeew",
    "cbbbbbbbbbbbbbbbaceeww",
    "cbbbbbbbbbbbbbbacceeww",
    "cbbbbbbbbbbbbbbbaceeww",
    "cbbbbbbbbbbbbbbbaceeew",
    "cbbbbbbbbbbbbbbbacceee",
    "bbbbbbbbbbbbbbbbacceee",
    "abbbbbbbaaaaaaaaaaccce",
    ".bbbbbbbbbbbbbbbbbaccc",
    ".bbbbbabbbbbbbbbbbbaac",
    ".bbbbb.abbbbbbbbbbbbba",
    ".bbbbb..aaaaaaaaaaaaab",
    ".abbbaccbbbbbbbbbbbbbb",
    "..bbb.bbbbbbbbbbbbbbbb",
    "mmmmmmmbbbbbbbbbbbbbbb",
    ".m.m.mbbbbbbbbbaaabbbb",
    ".m.m.mbbbbbbbbb...bbbb",
    ".m.m.mbbbbbbbbb...aaaa",
    ".m.m.maaaaaaaaa.......",
    ".m.m.m................",
  ], { pal: { a: "#4a2a6a", b: "#8a4fc0", c: "#c79af0", e: "#ffe58a" } }),
};

// Vergrößerung je Gegner (Sprite-Pixel -> Szenen-Einheiten). Die Ratte ist klein, der Boss groß.
const ENEMY_SCALE = { ratte: 1.9, goblin: 2.15, skelett: 2.05, bandit: 1.95, steingolem: 2.5, knochenhauptmann: 2.6, glutgeist: 1.95, frostwolf: 1.95, dornenranke: 2.15, flussgeist: 2.25, sumpfgeist: 2.15, funke: 2.4, elementarwandler: 2.5 };

Object.assign(HEROES, HEROES2); Object.assign(NPCS, NPCS2);          // neue Figuren (tools/figures/heroes.mjs) ersetzen die alten gleichen Namens
Object.assign(ENEMIES, ENEMIES2);          // neue Gegner (tools/figures/enemies.mjs)

__exports.gemRows = gemRows;
__exports.place = place;
__exports.HEROES = HEROES;
__exports.NPCS = NPCS;
__exports.ENEMIES = ENEMIES;
__exports.ENEMY_SCALE = ENEMY_SCALE;

});
__define("ui/art/rigs.js", function (__exports, __require) {
// Idle-Animationen der Figuren. Koordinaten wie im Raster (x, y ab 0, ohne Rahmen), Boxen [x0, y0, x1, y1] inklusive.
// Ein Bereich bewegt sich in ganzen Pixeln durch seq = [[dx, dy], ...] (diskret, pro Durchlauf dur Sekunden); phase verschiebt den Start.
// Kinder (parent) erben die Bewegung des Elternbereichs und fügen ihre eigene hinzu. Senkrechte Bewegung geht nur nach unten (dy >= 0),
// damit zwischen den Körperteilen keine Lücke entsteht: der Oberkörper "sinkt" beim Atmen leicht ein.
// blink: Zellen, die kurz die Hautfarbe bekommen (Lidschlag); glow: Pixel mit bestimmten Farbschlüsseln pulsieren heller.
const Z = [0, 0];
const breathe = (id, box, dur, extra = {}) => ({ id, box, seq: [Z, [0, 1]], dur, ...extra });
const sway = (id, parent, box, dur, dir = 1, extra = {}) => ({ id, parent, box, seq: [Z, [dir, 0], Z, [-dir, 0]], dur, ...extra });
const U = { under: true };                                   // feste Kopie darunter (keine Löcher)
const flick = (id, parent, box, dur, extra = {}) => ({ id, parent, box, seq: [Z, [0, 1], Z, Z], dur, ...extra });

const { RIGS2 } = __require("ui/art/heroes2.js");
const { RIGS3 } = __require("ui/art/enemies2.js");
const RIGS = {
  // ---------------- Helden
  nahkaempfer: {   // schwer und ruhig: tiefes Atmen, Helmbusch weht
    regions: [breathe("up", [0, 0, 23, 24], 2.2), sway("plume", "up", [10, 0, 13, 3], 1.8)],
    blink: [{ cells: [[10, 11], [13, 11]], color: "s", every: 4.6, at: 0.8 }],
  },
  fernkaempfer: {  // wachsam: Kapuze dreht sich langsam, Umhang flattert
    regions: [breathe("up", [0, 0, 23, 24], 2.0),
      { id: "hood", parent: "up", box: [4, 0, 19, 13], seq: [Z, Z, [1, 0], [1, 0], Z, Z, [-1, 0], [-1, 0]], dur: 4.4, ...U },
      { id: "cl", parent: "up", box: [0, 14, 4, 26], seq: [Z, [-1, 0], Z, Z], dur: 2.8, ...U },
      { id: "cr", parent: "up", box: [19, 14, 23, 26], seq: [Z, [1, 0], Z, Z], dur: 2.8, phase: 1.4, ...U }],
    blink: [{ cells: [[9, 9], [14, 9]], color: "s", every: 3.8, at: 1.5 }],
  },
  magier: {        // schwebt leicht (siehe CSS), Hutspitze kippt, Bart schwingt
    regions: [breathe("up", [0, 0, 23, 31], 2.4),
      { id: "tip", parent: "up", box: [8, 0, 15, 6], seq: [Z, Z, [1, 0], [1, 0]], dur: 2.6, ...U },
      { id: "beard", parent: "up", box: [6, 14, 17, 22], seq: [Z, Z, [1, 0], Z, Z, [-1, 0]], dur: 3.6, ...U }],
    blink: [{ cells: [[9, 12], [14, 12]], color: "s", every: 5.0, at: 2.0 }],
  },
  pyromant: {      // flackernd: Kapuze schwankt, der Saum brennt, die Augen glühen
    regions: [breathe("up", [0, 0, 23, 27], 2.0), { id: "hood", parent: "up", box: [4, 0, 19, 13], seq: [Z, Z, [1, 0], Z, Z, [-1, 0]], dur: 3.8, ...U },
      sway("hem", null, [0, 30, 23, 35], 0.9)],
    blink: [{ cells: [[9, 10], [14, 10]], color: "S", every: 4.2, at: 1.0 }],
    glow: [{ letters: "Y", box: [8, 9, 15, 10], color: "w", max: 0.7, dur: 1.4 }],
  },
  aristokrat: {    // vornehm: ruhig, Zylinder wippt leicht, Mantelschöße schwingen
    regions: [breathe("up", [0, 0, 23, 28], 2.6), { id: "hat", parent: "up", box: [3, 0, 20, 8], seq: [Z, Z, [1, 0], Z], dur: 3.4, ...U }, sway("tail", "up", [0, 25, 23, 28], 2.4, 1, U)],
    blink: [{ cells: [[9, 10], [14, 10]], color: "s", every: 5.0, at: 1.6 }],
  },
  gaertnerin: {    // sanft: Blume und Zöpfe schwingen, der Rock weht
    regions: [breathe("up", [0, 0, 23, 25], 2.2), sway("flower", "up", [10, 1, 13, 2], 1.8, 1, U),
      { id: "bl", parent: "up", box: [3, 9, 5, 24], seq: [Z, [-1, 0], Z], dur: 2.6, ...U }, { id: "br", parent: "up", box: [18, 9, 20, 24], seq: [Z, [1, 0], Z], dur: 2.6, phase: 1.3, ...U },
      sway("hem", null, [0, 26, 23, 31], 2.8)],
    blink: [{ cells: [[9, 10], [14, 10]], color: "s", every: 4.4, at: 0.9 }],
  },
  // ---------------- NPCs
  brumm: {
    regions: [breathe("up", [0, 0, 23, 24], 2.0), sway("cap", "up", [7, 0, 16, 5], 3.0),
      { id: "beard", parent: "up", box: [4, 9, 19, 17], seq: [Z, Z, [1, 0], Z, [-1, 0], Z], dur: 3.2, ...U }],
    blink: [{ cells: [[8, 7], [15, 7]], color: "s", every: 4.2, at: 1.0 }],
  },
  mira: {
    regions: [breathe("up", [0, 0, 23, 22], 2.2),
      { id: "hl", parent: "up", box: [2, 11, 6, 22], seq: [Z, [-1, 0], Z], dur: 2.4, ...U },
      { id: "hr", parent: "up", box: [17, 11, 21, 22], seq: [Z, [1, 0], Z], dur: 2.4, phase: 1.2, ...U },
      sway("hem", null, [0, 24, 23, 31], 2.8)],
    blink: [{ cells: [[10, 7], [13, 7]], color: "s", every: 4.0, at: 0.4 }],
    glow: [{ letters: "YzyY", box: [7, 1, 16, 3], color: "w", max: 0.6, dur: 2.4 }],
  },
  // ---------------- Gegner
  ratte: {         // schnüffelt, Schwanz wedelt, Ohr zuckt
    regions: [
      { id: "head", box: [0, 0, 11, 10], seq: [Z, [-1, 0], Z, Z], dur: 1.6, ...U },
      { id: "ear", parent: "head", box: [7, 0, 12, 2], seq: [Z, Z, [0, 1], Z, Z], dur: 2.4, ...U },
      { id: "tail", box: [24, 5, 27, 9], seq: [Z, [0, 1], Z, [0, -1]], dur: 0.9, ...U }],
  },
  goblin: {        // zappelig: Ohren zucken, kichert (kleine Sprünge)
    regions: [breathe("up", [0, 0, 17, 19], 1.3),
      flick("earl", "up", [0, 3, 2, 6], 2.0, U), flick("earr", "up", [15, 3, 17, 6], 2.0, { phase: 0.9, ...U })],
    blink: [{ cells: [[4, 6], [5, 6], [12, 6], [13, 6]], color: "F", every: 3.4, at: 0.5 }],
  },
  skelett: {       // klappert mit dem Kiefer, Arme rasseln, Augen glimmen
    regions: [breathe("up", [0, 0, 17, 24], 1.6),
      { id: "jaw", parent: "up", box: [5, 8, 12, 10], seq: [Z, [0, 1], Z, [0, 1], Z, Z, Z, Z], dur: 2.4 },
      { id: "al", parent: "up", box: [0, 12, 3, 24], seq: [Z, [-1, 0], Z, Z], dur: 2.2, ...U },
      { id: "ar", parent: "up", box: [14, 12, 17, 24], seq: [Z, [1, 0], Z, Z], dur: 2.2, phase: 1.1, ...U }],
    glow: [{ letters: "J", color: "w", max: 0.7, dur: 1.8 }],
  },
  bandit: {        // lauernd: Kapuze schaut hin und her, Mantelsaum weht
    regions: [breathe("up", [0, 0, 19, 26], 1.5),
      { id: "hood", parent: "up", box: [3, 0, 16, 10], seq: [Z, Z, [1, 0], Z, Z, [-1, 0]], dur: 3.6, ...U },
      sway("hem", null, [0, 24, 19, 29], 2.2)],
    blink: [{ cells: [[7, 7], [12, 7]], color: "x", every: 4.4, at: 1.2 }],
  },
  steingolem: {    // langsam und schwer, Kern und Augen glühen
    regions: [breathe("up", [0, 0, 27, 27], 3.2)],
    glow: [{ letters: "oOz", box: [11, 14, 16, 19], color: "z", max: 0.65, dur: 1.6 }, { letters: "O", box: [7, 6, 20, 7], color: "w", max: 0.5, dur: 2.2 }],
  },
  knochenhauptmann: { // Umhang weht, Helmbusch flattert, Augen glimmen
    regions: [breathe("up", [0, 0, 25, 26], 2.4), sway("plume", "up", [11, 0, 14, 3], 1.7),
      { id: "cl", parent: "up", box: [0, 22, 4, 34], seq: [Z, [-1, 0], Z, Z], dur: 2.6, ...U },
      { id: "cr", parent: "up", box: [21, 22, 25, 34], seq: [Z, [1, 0], Z, Z], dur: 2.6, phase: 1.3, ...U }],
    glow: [{ letters: "J", color: "w", max: 0.7, dur: 1.5 }],
  },
  glutgeist: {     // Flammen züngeln unterschiedlich, der Saum wabert
    regions: [{ id: "tl", box: [3, 0, 6, 3], seq: [Z, [0, 1], Z, Z], dur: 0.9 }, { id: "tc", box: [7, 0, 10, 3], seq: [Z, Z, [0, 1], Z], dur: 0.9, phase: 0.3 },
      { id: "tr", box: [11, 0, 14, 3], seq: [Z, Z, Z, [0, 1]], dur: 0.9, phase: 0.6 }, sway("hem", null, [0, 22, 17, 28], 1.1)],
    blink: [{ cells: [[3, 9], [4, 9], [3, 10], [4, 10], [13, 9], [14, 9], [13, 10], [14, 10]], color: "O", every: 3.2, at: 0.7 }],
    glow: [{ letters: "Y", color: "z", max: 0.5, dur: 1.2 }],
  },
  frostwolf: {     // schnüffelt, Schwanz pendelt
    regions: [{ id: "head", box: [0, 0, 13, 14], seq: [Z, [0, 1], Z, Z], dur: 2.6 }, { id: "tail", box: [29, 2, 35, 9], seq: [Z, [1, 0], Z, [-1, 0]], dur: 1.4, ...U },
      { id: "crest", box: [16, 2, 28, 6], seq: [Z, Z, [0, 1], Z], dur: 1.9 }],
  },
  dornenranke: {   // wiegt sich, Blütenkopf schwingt stärker, Blätter schlagen
    regions: [{ id: "up", box: [0, 0, 17, 24], seq: [Z, [1, 0], Z, [-1, 0]], dur: 3.0 },
      { id: "head", parent: "up", box: [0, 0, 17, 10], seq: [Z, [1, 0], [1, 0], Z, [-1, 0], [-1, 0]], dur: 2.2, phase: 0.5, ...U },
      flick("ll", "up", [0, 13, 3, 16], 1.2, U), flick("lr", "up", [14, 13, 17, 16], 1.2, { phase: 0.6, ...U })],
    blink: [{ cells: [[3, 5], [4, 5], [13, 5], [14, 5]], color: "R", every: 3.6, at: 1.0 }],
  },
  flussgeist: {    // fließt: Körper sinkt, Saum wellt sich
    regions: [breathe("up", [0, 0, 17, 21], 1.8), sway("hem", null, [0, 22, 17, 27], 1.0)],
    blink: [{ cells: [[3, 11], [4, 11], [3, 12], [4, 12], [13, 11], [14, 11], [13, 12], [14, 12]], color: "U", every: 3.9, at: 0.9 }],
  },
  sumpfgeist: {    // quatscht sich zusammen und wieder auseinander
    regions: [{ id: "body", box: [0, 2, 27, 24], seq: [Z, [0, 1]], dur: 1.7 }],
    blink: [{ cells: [5, 6, 7, 20, 21, 22].flatMap((x) => [[x, 8], [x, 9]]), color: "F", every: 3.3, at: 0.6 }],
  },
  funke: {         // zuckt und funkelt
    regions: [{ id: "s", box: [0, 0, 11, 11], seq: [Z, [0, 1], Z, [1, 0]], dur: 0.8 }],
    glow: [{ letters: "zw", color: "w", max: 0.85, dur: 0.8 }],
  },
  elementarwandler: { // beide Köpfe wippen versetzt, Krallen zucken, der Kern pocht
    regions: [breathe("up", [0, 0, 43, 34], 2.8),
      { id: "hl", parent: "up", box: [0, 0, 14, 13], seq: [Z, [0, 1], Z, Z], dur: 2.4 },
      { id: "hr", parent: "up", box: [29, 0, 43, 13], seq: [Z, Z, [0, 1], Z], dur: 2.4 },
      { id: "kl", box: [0, 36, 5, 43], seq: [Z, [0, 1], Z], dur: 1.5, ...U }, { id: "kr", box: [38, 36, 43, 43], seq: [Z, [0, 1], Z], dur: 1.5, phase: 0.7, ...U }],
    glow: [{ letters: "ew", color: "w", max: 0.6, dur: 1.4 }],
  },
};

Object.assign(RIGS, RIGS2);          // Animationen der neuen Figuren (in Anteilen, rel: true)
Object.assign(RIGS, RIGS3);          // Animationen der neuen Gegner

__exports.RIGS = RIGS;

});
__define("ui/art/icons.js", function (__exports, __require) {
// Kleine Symbole (8x8), Kartensymbole (12x12) und Effekte. Ersetzen alle Emojis.
const S = (rows) => ({ rows, sym: true });
const A = (rows) => ({ rows });

// Herzstein: das Wahrzeichen des Spiels. Ein Edelstein aus vier Facetten, je ein Element: oben Feuer, rechts Wasser, unten Pflanze, links Eis.
function emblemRows() {
  const ramp = { top: ["r", "R", "O"], right: ["u", "U", "V"], bottom: ["f", "F", "G"], left: ["j", "j", "J"] };
  const rows = [];
  for (let y = 0; y < 16; y++) {
    let r = "";
    for (let x = 0; x < 16; x++) {
      const dx = x - 7.5, dy = y - 7.5, d = Math.abs(dx) + Math.abs(dy);
      if (d > 7.6) { r += "."; continue; }
      const face = Math.abs(dy) > Math.abs(dx) ? (dy < 0 ? "top" : "bottom") : (dx < 0 ? "left" : "right");
      const edge = Math.abs(Math.abs(dy) - Math.abs(dx)) < 0.7;       // Kante zwischen zwei Facetten: dunkel, das lässt den Stein kristallin wirken
      r += ramp[face][edge ? 0 : d >= 5.6 ? 2 : 1];
    }
    rows.push(r);
  }
  for (const [x, y] of [[7, 7], [8, 7], [7, 8], [8, 8], [5, 4]]) rows[y] = rows[y].slice(0, x) + "w" + rows[y].slice(x + 1);   // heller Kern und ein Glanzpunkt
  return rows;
}

const ICONS = {
  emblem: A(emblemRows()),
  trophy: A(["..YYYYYY..", ".YzzzzzzY.", "yYzzzzzzYy", "y.YzzzzY.y", ".y.YzzY.y.", "...YzzY...", "....YY....", "....YY....", "...yYYy...", "..yYYYYy..", "..yyyyyy.."]),
  frame: A(["hhhhhhhh", "hiiiiiih", "hi....ih", "hi....ih", "hi....ih", "hi....ih", "hiiiiiih", "hhhhhhhh"]),
  heart: S(["....", ".RR.", "RwRR", "RRRR", ".RRR", "..RR", "...R", "...."]),
  shield: S(["....", "hhhh", "hVUU", "hUUU", "hUUU", ".hUU", "..hU", "...h"]),
  bolt: A(["....YY..", "...YY...", "..YYYY..", "....YY..", "...YY...", "..YY....", ".Y......", "........"]),
  coin: S(["....", "..YY", ".YzY", ".YzY", ".YzY", ".YzY", "..YY", "...."]),
  sword: A(["......hi", "......ii", ".....ii.", "....ii..", "y..ii...", ".yii....", "..yy....", "nn......"]),
  pile: S(["..hh", ".hUU", "hUUV", "hUVU", "hUVU", "hUUV", ".hUU", "..hh"]),
  discard: S(["..hh", "hhhh", "....", "hiii", "hiih", "hiii", "hiih", ".hhh"]),
  bag: S(["....", "..NN", ".NNN", "NNMM", "NNMM", "NNNN", ".NNN", "...."]),
  menu: A(["........", "iiiiiiii", "........", "iiiiiiii", "........", "iiiiiiii", "........", "........"]),
  skull: S(["....", ".www", "wwww", "wkkw", "wkkw", "wwwk", ".wBw", "..BB"]),
  poison: S(["...G", "..GG", ".GGG", "GGGG", "GFGG", "GGGG", ".GGG", "..GG"]),
  blood: S(["...R", "..RR", ".RRR", "RRRR", "RwRR", "RRRR", ".RRR", "..RR"]),
  crack: S(["....", "hhhh", "hVUU", "hUUk", "hUkU", "hkUU", ".hkU", "..hU"]),
  mark: A(["...RR...", "..R..R..", ".R.RR.R.", "RRRRRRRR", "RRRRRRRR", ".R.RR.R.", "..R..R..", "...RR..."]),
  wind: A(["........", "..wwww..", "......w.", ".wwwww..", "......w.", "..wwww..", "........", "........"]),
  flame: S(["...o", "..oo", ".oRo", ".oOo", "oOYo", "oYYo", ".oYo", "..oo"]),
  water: S(["...U", "..UU", ".UVU", "UVVU", "UVUU", "UUUU", ".UUU", "..UU"]),
  leaf: A(["......FF", ".....FGF", "....FGF.", "...FGF..", "..FGF...", ".FGF....", "FGF.....", "F......."]),
  snow: S(["...J", "J..J", ".J.J", "..JJ", "JJJJ", "..JJ", ".J.J", "J..J"]),
  pointer: S(["...Y", "...Y", "...Y", "YYYY", ".YYY", "..YY", "...Y", "...."]),
  plus: S(["....", "...G", "...G", "GGGG", "GGGG", "...G", "...G", "...."]),
  lock: S(["..hh", ".h..", ".h..", "yyyy", "yYYY", "yYkY", "yYkY", "yyyy"]),
  star: A(["...Y....", "...Y....", "YYYzYYY.".slice(0, 8), ".YYzYY..", "..YzY...", ".YY.YY..", ".Y...Y..", "........"]),
  // Kartensymbole (größer)
  c_attack: A(["..........wi", ".........wii", "........wii.", ".......wii..", "......wii...", ".y...wii....", "..y.wii.....", "...ywi......", "....yy......", "...n.yy.....", "..nn........", ".nn........."]),
  c_arrow: A(["...........i", "..........ii", ".........ii.", ".......iii..", "......iii...", ".....iii....", "...iii......", "..wiiN......", ".wwiN.......", ".wN.........", "............", "............"]),
  c_spell: S(["..Y...", "..Y...", "YYYzYY", ".YzzzY".slice(0, 6), "..YzzY".slice(0, 6), ".YYzYY".slice(0, 6), ".Y..Y.", "......"]),
  c_shield: S(["......", "hhhhhh", "hVUUUU", "hUUVUU", "hUUVUU", "hUVVVU", ".hUVUU", "..hUUU", "...hUU", "....hU", ".....h", "......"]),
  c_dodge: A(["............", "...wwwwww...", ".........w..", "..wwwwwww...", "..........w.", "...wwwwww...", "............", "..wwwww.....", "............", "............", "............", "............"]),
  c_draw: S(["......", "..hhhh", ".hUUUU", "hUUVVU", "hUVUUV", "hUVUUV", "hUUVVU", ".hUUUU", "..hhhh", "......", "......", "......"]),
  c_debuff: A(["....RRRR....", "..RR....RR..", ".R...RR...R.", ".R..RRRR..R.", "R..RRRRRR..R", "RRRRRRRRRRRR", "R..RRRRRR..R", ".R..RRRR..R.", ".R...RR...R.", "..RR....RR..", "....RRRR....", "............"]),
  c_burst: S(["..Y...", "Y.Yo.Y", "..YoY.".slice(0, 6), "YYoOYY", ".oOOYY".slice(0, 6), "YYoOYY", "..YoY.".slice(0, 6), "Y.Yo.Y".slice(0, 6), "..Y...", "......", "......", "......"]),
  c_book: { ...S(["......", ".aaaaa", ".abbbb", ".abbdd", ".abdee", ".abbdd", ".abbbb", ".awwww", ".aiiii", "..aaaa", "......", "......"]), pal: { a: "#3a2a7a", b: "#7a5ad8", c: "#c9b8ff" } },
};

// Orte auf der Karte (12x12)
const NODES = {
  n_kampf: S(["ii....", ".ii...", "..ii..", "...ii.", "....ii", ".....i", "...ii.", "..ii..", ".yyy..", "nn....", "n.....", "......"]),
  n_elite: S(["m.....", "mm.www", ".mwwww", "..wwww", "..wkkw", "..wkkw", "..wwwk", "...wwB", "...wBw", "....BB", "......", "......"]),
  n_miniboss: S(["w.....", "ww....", ".w.hhh", ".whhii", "..hiii", "..hiii", "..hkkk", "..hkkk", "..hiii", "..hhhh", "......", "......"]),
  n_rast: A(["............", ".....o......", "....oOo.....", "...oOYOo....", "...oYYYo....", "..ooYYYoo...", "..oOYzYOo...", ".ooOYYYOoo..", "nnNnooonNnn.", ".nNNnnnNNn..", "..nnn.nnn...", "............"]),
  n_haendler: S(["......", "...nnn", "....dd", "...YYY", "..YYYY", ".YYzYY", ".YYzzY", ".YYzYY", ".YYYYY", "..YYYY", "......", "......"]),
  n_ereignis: A(["............", "...PPPPPP...", "..PPPPPPPP..", "..PP....PP..", "........PP..", ".......PP...", "......PP....", ".....PP.....", ".....PP.....", "............", ".....PP.....", ".....PP....."]),
  n_boss: S(["mm....", ".mm.RR", "..RRRR", ".RRRRR", ".RORRR", ".RRRRR", "..RwRw", "..RRRR", "...rrr", "......", "......", "......"]),
};

// Effekte und Kulissen
const FX = {
  fx_arrow: A(["w.......", "wNNNNNii", "w......."]),
  fx_orb: { ...S(["....", "..cc", ".cww", "cwwb", "cwbb", ".cbb", "..cb", "...."]), pal: { b: "#ffb35a", c: "#ffe58a" } },
  fx_slash: A(["........ww", "......www.", ".....www..", "....www...", "...www....", "..www.....", ".www......", "www......."]),
  fx_spark: A(["..w..", "..w..", "wwwww", "..w..", "..w.."]),
  torch: S(["...", "..Y", "..o", "..O", "..o", "..n", "..N", "..n", "..N", "..n", "..n", "..n"]),
};
ICONS.thorns = S([".....i", "i....i", ".i.hhh", "..hhhi", "i.hhhg", "..hhgg", "..hhgg", "i.hhhg", "..hhhi", ".i.hhh", "i....i", ".....i"]);      // Dornen: Stachelkugel (eigenes Symbol, nicht mehr der Block-Schild)
// Wert-Symbole (8x8): jedes Symbol sieht anders aus, damit Werte schneller erfasst werden
Object.assign(ICONS, {
  s_regen: A(["...FF...", "...FF...", "...FF...", "FFFFFFFF", "FFFFFFFF", "...FF...", "...FF...", "...FF..."]),
  s_drop: A(["...RR...", "..RRRR..", "..RRRR..", ".RRwRRR.", ".RRwRRR.", ".RRRRRR.", "..RRRR..", "...RR..."]),
  s_up: A(["...RR...", "..RRRR..", ".RRRRRR.", "RR.RR.RR", "...RR...", "...RR...", "...RR...", "........"]),
  s_fist: A(["..SSSS..", ".SSSSSS.", "SSsSsSsS", "SSSSSSSS", "SSSSSSSS", ".SSSSSS.", "..hhhh..", "..hhhh.."]),
  s_arrow: A(["......hh", ".....hhh", "...nhhh.", "..nnh...", ".nn.....", "wn......", "ww......", "w......."]),
  s_orb: A(["..RRuu..", ".RRRuuu.", "RRRRuuuu", "RRRRuuuu", "ffffjjjj", "ffffjjjj", ".fffjjj.", "..ffjj.."]),
  s_crit: A(["...Y....", "...Y..Y.", "Y.YYY.Y.", ".YYYYY..", "YYYwYYYY", ".YYYYY..", "Y.YYY.Y.", "...Y..Y."]),
  s_clover: A(["..FF.FF.", ".FFFFFFF", "..FFGFF.", ".FFFFFFF", "..FF.FF.", "....F...", "...F....", "..F....."]),
  s_wheat: A(["..Y..Y..", "..Y..Y..", ".YY..YY.", "..YYYY..", "...YY...", "...nn...", "...nn...", "...nn..."]),
  s_dice: A(["hhhhhhhh", "hwwwwwwh", "hwkwwwwh", "hwwwwwwh", "hwwwkwwh", "hwwwwwwh", "hwwwwkwh", "hhhhhhhh"]),
  s_coins: A(["..YY....", ".YzzY...", ".YzYzY..", ".YYzzYY.", "..YYYzY.", "...YzzY.", "....YY..", "........"]),
  s_curse: A(["...Q....", "..QQ.Q..", "..QQQQ..", ".QQPPQQ.", ".QPPPPQ.", ".QPwPPQ.", "..QPPQ..", "...QQ..."]),
});
const ALL_ICONS = { ...ICONS, ...NODES, ...FX };

__exports.ICONS = ICONS;
__exports.NODES = NODES;
__exports.FX = FX;
__exports.ALL_ICONS = ALL_ICONS;

});
__define("ui/art/index.js", function (__exports, __require) {
// Öffentliche Grafik-Schnittstelle.
const { pixels, toSvg, parse } = __require("ui/art/core.js");
const { PALETTES } = __require("ui/art/palettes.js");
const { SHAPES, MARKS, ITEM_ART } = __require("ui/art/shapes.js");
const { WEAPON_SHAPES, WEAPON_ASYM, WEAPON_ART } = __require("ui/art/weapons.js");
const { WEAPONS2 } = __require("ui/art/weapons2.js");
const { CARDS2 } = __require("ui/art/cards2.js");
const { SHAPES2 } = __require("ui/art/items2.js");
const { HEROES, NPCS, ENEMIES, ENEMY_SCALE } = __require("ui/art/chars2.js");
const { RIGS } = __require("ui/art/rigs.js");
const rigged = (def, id) => (def.rig ? def : RIGS[id] ? { ...def, rig: RIGS[id] } : def);   // Idle-Animation: eigene (def.rig) oder aus rigs.js
const { ALL_ICONS } = __require("ui/art/icons.js");


const pal = (p) => (typeof p === "string" ? PALETTES[p] : p);

function itemPixels(id, opts = {}) {
  const [shape, palette, mark] = ITEM_ART[id];
  return pixels(SHAPES2[shape] ?? SHAPES[shape], { pal: PALETTES[palette], mark: mark ? MARKS[mark] : null, ...opts });      // neue Formen (tools/figures/items.mjs) vor den alten
}
const WEAPON_IDS = Object.keys(WEAPON_ART);
function weaponPixels(id, opts = {}) {
  if (WEAPONS2[id]) return pixels(WEAPONS2[id], opts);                  // neue Waffen (tools/figures/weapons.mjs) ersetzen die alten gleichen Namens
  const a = WEAPON_ART[id];
  const def = a.shape ? WEAPON_SHAPES[a.shape] : { rows: Array.isArray(WEAPON_ASYM[a.asym]) ? WEAPON_ASYM[a.asym] : WEAPON_ASYM[a.asym].rows };
  return pixels(def, { pal: pal(a.pal), ...opts });
}
const HERO_IDS = [...Object.keys(HEROES), ...Object.keys(NPCS)];
const heroPixels = (id, opts = {}) => pixels(rigged(HEROES[id] ?? NPCS[id], id), opts);
const ENEMY_IDS = Object.keys(ENEMIES);
const enemyPixels = (id, opts = {}) => pixels(rigged(ENEMIES[id], id), opts);
const CARD_ART_IDS = Object.keys(CARDS2);
const cardPixels = (id, opts = {}) => pixels(CARDS2[id], opts);          // Kartenmotive (tools/figures/cards.mjs)
const ICON_IDS = Object.keys(ALL_ICONS);
const iconPixels = (id, opts = {}) => pixels(ALL_ICONS[id], opts);

// ---------------- Für die Oberfläche: fertige SVG-Strings (mit Zwischenspeicher)
const cache = new Map();
function pxOf(kind, id, o = {}) {
  const base = { shiny: Boolean(o.shiny), ...(o.mark !== undefined ? { mark: o.mark } : {}) };
  switch (kind) {
    case "item": return itemPixels(id, base);
    case "weapon": return weaponPixels(id, base);
    case "hero": case "npc": return heroPixels(id, { ...base, ...(o.pal ? { pal: o.pal } : {}) });
    case "enemy": {
      const pal = o.element && PALETTES[o.element] ? { ...PALETTES[o.element], e: "#ffe58a" } : undefined;
      return enemyPixels(id, { ...base, ...(pal ? { pal } : {}) });
    }
    case "card": return cardPixels(id, base);
    case "icon": return iconPixels(id, { ...base, ...(o.pal ? { pal: o.pal } : {}) });
    default: throw new Error(`Unbekannte Grafik-Art: ${kind}`);
  }
}
// spr("item", "glutstein", { shiny, cls, attrs, element, pal })
function spr(kind, id, o = {}) {
  const key = `${kind}|${id}|${o.shiny ? 1 : 0}|${o.element ?? ""}|${o.cls ?? ""}|${o.attrs ?? ""}|${o.pal ? JSON.stringify(o.pal) : ""}`;
  let s = cache.get(key);
  if (!s) { s = toSvg(pxOf(kind, id, o), { cls: o.cls ?? "", attrs: o.attrs ?? "" }); cache.set(key, s); }
  return s;
}
const sprSize = (kind, id, o = {}) => { const p = pxOf(kind, id, o); return { w: p.w, h: p.h }; };

// ---------------- Anzeige-Parameter der Figuren (Stufe 1 des Grafik-Umbaus)
// Jede Figur darf in ihrer Definition (chars2.js) eigene Werte tragen; ohne Angabe gelten die bisherigen Standardwerte, damit sich nichts ändert:
//   px      Szenen-Einheiten je Kunst-Pixel im Kampf (EINE gemeinsame Pixelgröße je Figurengruppe ist das Ziel)
//   introPx dasselbe in der Geschichte (Standard: etwas größer, im Verhältnis wie bisher)
//   hand    Handposition in Sprite-Pixeln [x, y] (Standard: Anteile der Spritegröße); Waffen: px und grip [x, y] (Standard: Mitte, unteres Ende)
const LEGACY = { heroPx: 2.45, introFactor: 2.9 / 2.45, npcPx: 2.6, weaponPx: 2.9, enemyPx: 3, hand: { nahkaempfer: [22, 27], fernkaempfer: [22, 22], magier: [22, 25], pyromant: [22, 24], aristokrat: [22, 23], gaertnerin: [22, 23] } };
const heroDef = (id) => HEROES[id] ?? NPCS[id];
const heroPx = (id, mode = "combat") => { const d = heroDef(id); return mode === "intro" ? (d.introPx ?? Number(((d.px ?? LEGACY.heroPx) * LEGACY.introFactor).toFixed(3))) : (d.px ?? LEGACY.heroPx); };
const npcPx = (id) => NPCS[id]?.px ?? LEGACY.npcPx;
// Breite in Szenen-Einheiten für die Anordnung: nur Gegner mit eigener Pixelgröße (neue Grafik) zählen, die heutigen sind so schmal, dass sie nie eingreifen
const enemyFootprint = (id) => (ENEMIES[id]?.px ? sprSize("enemy", id).w * ENEMIES[id].px : 0);
const enemyPx = (id) => ENEMIES[id]?.px ?? ENEMY_SCALE[id] ?? LEGACY.enemyPx;
function handOf(id) {
  const d = heroDef(id);
  if (d?.hand) return d.hand;
  if (LEGACY.hand[id]) return LEGACY.hand[id];
  const { w, h } = sprSize("hero", id);
  return [Math.round(w * 0.92), Math.round(h * 0.72)];
}
const weaponPx = (id) => WEAPONS2[id]?.px ?? WEAPON_ART[id]?.px ?? LEGACY.weaponPx;
function weaponGrip(id) {
  const g = WEAPONS2[id]?.grip ?? WEAPON_ART[id]?.grip;
  if (g) return g;
  const { w, h } = sprSize("weapon", id);
  return [w / 2, Math.round(h * 0.88)];                    // bisherige Waffen (10x18): [5, 16]
}

// Welches Symbol zeigt eine Karte? (Element, Typ, Wirkung)
const ELEMENT_ICON = { feuer: "flame", wasser: "water", pflanze: "leaf", eis: "snow" };
function cardIconId(def) {
  if (def.element && ELEMENT_ICON[def.element]) return ELEMENT_ICON[def.element];
  const t = def.tags, acts = def.play.map((a) => a.action);
  if (t.includes("gift")) return "poison";
  if (t.includes("blut")) return "blood";
  if (t.includes("fernkampf")) return t.includes("ausweichen") ? "c_dodge" : "c_arrow";
  if (t.includes("zauber")) return t.includes("block") ? "c_shield" : "c_spell";
  if (acts.every((a) => a === "block")) return "c_shield";
  if (acts.includes("playerStatus") && !acts.includes("damage")) return "c_dodge";
  if (acts.includes("draw") && !acts.includes("damage")) return "c_draw";
  if (t.includes("debuff")) return "c_debuff";
  if (t.includes("flaeche")) return "c_burst";
  return "c_attack";
}
const elementIconId = (el) => ELEMENT_ICON[el] ?? "star";

__exports.ITEM_ART = ITEM_ART;
__exports.PALETTES = PALETTES;
__exports.ENEMY_SCALE = ENEMY_SCALE;
__exports.itemPixels = itemPixels;
__exports.WEAPON_IDS = WEAPON_IDS;
__exports.weaponPixels = weaponPixels;
__exports.HERO_IDS = HERO_IDS;
__exports.heroPixels = heroPixels;
__exports.ENEMY_IDS = ENEMY_IDS;
__exports.enemyPixels = enemyPixels;
__exports.CARD_ART_IDS = CARD_ART_IDS;
__exports.cardPixels = cardPixels;
__exports.ICON_IDS = ICON_IDS;
__exports.iconPixels = iconPixels;
__exports.spr = spr;
__exports.sprSize = sprSize;
__exports.heroPx = heroPx;
__exports.npcPx = npcPx;
__exports.enemyFootprint = enemyFootprint;
__exports.enemyPx = enemyPx;
__exports.handOf = handOf;
__exports.weaponPx = weaponPx;
__exports.weaponGrip = weaponGrip;
__exports.cardIconId = cardIconId;
__exports.elementIconId = elementIconId;

});
__define("ui/widgets.js", function (__exports, __require) {
// Wiederverwendbare Bausteine als HTML-Strings: Symbole, Karten, Items, Balken, Logo. Keine Emojis, alles aus ui/art.
const { CONTENT } = __require("content/index.js");
const { computeDamage } = __require("engine/modifiers.js");
const { spr, cardIconId, elementIconId, CARD_ART_IDS } = __require("ui/art/index.js");
const { esc, describeItem, describeWeapon } = __require("ui/util.js");
const { elementColor, STATUS, RARITY } = __require("ui/theme.js");

const at = (action, arg, arg2) => ` data-action="${action}"${arg !== undefined ? ` data-arg="${esc(arg)}"` : ""}${arg2 !== undefined ? ` data-arg2="${esc(arg2)}"` : ""}`;
const ico = (id, px = 16, o = {}) => spr("icon", id, { attrs: `width="${px}" height="${px}"`, cls: o.cls ?? "", ...(o.pal ? { pal: o.pal } : {}) });
const btn = (label, action, arg, o = {}) =>
  `<button class="btn ${o.cls ?? ""}"${o.title ? ` title="${esc(o.title)}" aria-label="${esc(o.title)}"` : ""}${o.disabled ? " disabled" : at(action, arg, o.arg2)}>${label}</button>`;
const ibtn = (iconId, action, label, extra = "") => `<button class="ibtn"${at(action)} aria-label="${esc(label)}">${ico(iconId, 22)}${extra}</button>`;
const pctOf = (a, b) => Math.max(0, Math.min(100, Math.round((a / Math.max(1, b)) * 100)));
const bar = (frac, cls = "") => `<div class="bar ${cls}"><i style="width:${pctOf(frac * 100, 100)}%"></i></div>`;

// ---------------------------------------------------------------- Karten
// Kennzahlen einer Karte (aktueller Schaden inkl. Waffe und Items), als kleine Symbol-Zahl-Paare
const nameLen = (n) => (n.length > 17 ? " n-xl" : n.length > 13 ? " n-l" : "");        // lange Namen bekommen automatisch kleinere Schrift
const itemNameCls = nameLen;
function cardChips(def, build, playsBefore = 0, ctx = {}) {
  const raw = [];
  for (const a of def.play) {
    if (a.action === "damage" && (a.fromBlock || a.fromMissingHp)) raw.push(["sword", "X"]);        // Schaden hängt vom Spielstand ab (Block, fehlende HP)
    else if (a.action === "damage" && (a.ifHpLost || a.unlessHpLost) && a.ifHpLost) { /* Zusatzwirkung nach HP-Verlust: keine eigene Kennzahl */ }
    else if (a.action === "damage") {
      const { amount } = computeDamage({ build, card: def, action: a, target: null, playsBefore, ...ctx });
      raw.push([a.target === "all" ? "c_burst" : "sword", `${amount}${(a.hits ?? 1) > 1 ? "x" + a.hits : ""}`]);
    } else if (a.action === "block") raw.push(["shield", String(a.value)]);
    else if (a.action === "status" && a.ifHpLost) { /* Zusatzwirkung nach HP-Verlust */ }
    else if (a.action === "status") raw.push([STATUS[a.status]?.[0] ?? "star", `${a.stacks}${a.target === "all" ? "+" : ""}`]);
    else if (a.action === "multiplyStatus") raw.push([STATUS[a.status]?.[0] ?? "star", "x2"]);
    else if (a.action === "draw") raw.push(["pile", String(a.value)]);
    else if (a.action === "playerStatus") raw.push([STATUS[a.status]?.[0] ?? "wind", String(a.stacks)]);
    else if (a.action === "energy") raw.push(["bolt", String(a.value)]);
    else if (a.action === "heal") raw.push(["heart", String(a.value)]);
    else if (a.action === "maxHpUp") raw.push(["heart", `+${a.value}`]);
    else if (a.action === "gainGold") raw.push(["coin", `+${a.value}`]);
    else if (a.action === "payGoldPct") raw.push(["coin", `-${Math.round(a.value * 100)}%`]);
  }
  const merged = [], seen = new Map();
  for (const [ic, n] of raw) { const k = ic + n; if (seen.has(k)) seen.get(k).count++; else { const e = { ic, n, count: 1 }; seen.set(k, e); merged.push(e); } }
  return merged.slice(0, 4).map((e) => ({ ic: e.ic, n: e.count > 1 ? `${e.n}x${e.count}` : e.n }));
}

// o: { build, size: "sm" (Hand) | "lg", selected, dim, action, arg, arg2, count, plays }
function cardHtml(def, o = {}) {
  const el = def.element ? elementColor(def.element) : "#6e6a80";
  const rar = RARITY[def.rarity] ?? RARITY.gewoehnlich;
  const chips = o.build ? cardChips(def, o.build, o.plays ?? 0, o.ctx ?? {}) : [];
  const icon = cardIconId(def);
  const baseId = def.id.replace(/:s$/, "");
  const art = CARD_ART_IDS.includes(baseId) ? spr("card", baseId, { shiny: def.shiny, attrs: 'width="100%" height="100%"' })        // eigenes Motiv der Karte
    : spr("icon", icon, { shiny: def.shiny, attrs: 'width="100%" height="100%"' });
  const glow = `rgba(${[1, 3, 5].map((i) => parseInt(el.slice(i, i + 2), 16)).join(",")},.38)`;
  return `<div class="card ${o.size ?? "sm"} ${def.shiny ? "shiny sh" : ""} ${o.selected ? "sel" : ""} ${o.dim ? "dim" : ""}" style="--el:${el};--rar:${rar[1]};--elg:${glow}"${o.action ? at(o.action, o.arg, o.arg2) : ""}>
    <div class="c-top"><span class="c-cost">${ico("bolt", 12)}${def.cost}</span><span class="c-name${nameLen(def.name)}">${esc(def.name)}</span></div>
    <div class="c-art">${art}</div>
    ${o.keepIdx === undefined ? "" : `<span class="c-keep${o.kept ? " on" : ""}"${at("keep-card", String(o.keepIdx))} title="${o.kept ? "Wird behalten" : "Am Zugende behalten"}" role="button" aria-label="Karte behalten">${ico("lock", 10)}</span>`}
    ${o.info === false ? "" : `<span class="c-info"${at("card-info", def.id)} title="Details" role="button" aria-label="Details zu ${esc(def.name)}">i</span>`}
    <div class="c-chips">${chips.map((c) => `<span class="chip2">${ico(c.ic, 12)}<b>${esc(c.n)}</b></span>`).join("")}</div>
    ${o.size === "lg" ? `<div class="c-text">${esc(def.text ?? "")}</div>` : ""}
    <div class="c-foot" style="background:${rar[1]}">${o.count > 1 ? `x${o.count}` : esc(rar[0])}</div></div>`;
}

// ---------------------------------------------------------------- Items und Waffen
function itemHtml(def, kind = "items", o = {}) {
  const rar = RARITY[def.rarity] ?? RARITY.gewoehnlich;
  const art = spr(kind === "weapons" ? "weapon" : "item", def.id.replace(/:s$/, ""), { shiny: def.shiny, attrs: 'width="100%" height="100%"' });
  const text = kind === "weapons" ? describeWeapon(def) : describeItem(def);
  return `<div class="itemcard ${def.shiny ? "shiny sh" : ""}" style="--rar:${rar[1]}" data-tip-ref="${kind}:${def.id}">
    <div class="i-art ${kind === "weapons" ? "tall" : ""}">${art}</div>
    <div class="i-body"><b class="${nameLen(def.name).trim()}">${esc(def.name)}</b><span class="rar" style="color:${rar[1]}">${esc(rar[0])}${kind === "weapons" ? " · Waffe" : ""}${def.hero && CONTENT.classes[def.hero] ? ` · Passt zu: ${esc(CONTENT.classes[def.hero].name)}` : ""}${kind === "items" && def.maxStack === 1 ? " · Einzigartig" : ""}</span><span class="d">${esc(text)}</span></div></div>`;
}
const itemIcon = (def, px = 30, kind = "item") =>
  `<span class="mini ${def.shiny ? "sh" : ""}">${spr(kind, def.id.replace(/:s$/, ""), { shiny: def.shiny, attrs: `width="${px}" height="${px}"` })}</span>`;

const statusChips = (statuses) =>
  Object.entries(statuses).filter(([, v]) => v > 0).map(([k, v]) => `<span class="stchip" title="${(STATUS[k] ?? [])[1] ?? k}">${ico(STATUS[k]?.[0] ?? "star", 14)}${v}</span>`).join("");

// ---------------------------------------------------------------- Pixel-Logo (eigene 5x7-Schrift)
const FONT = {
  R: ["1111.", "1...1", "1...1", "1111.", "1.1..", "1..1.", "1...1"], O: [".111.", "1...1", "1...1", "1...1", "1...1", "1...1", ".111."],
  G: [".1111", "1....", "1....", "1.111", "1...1", "1...1", ".1111"], U: ["1...1", "1...1", "1...1", "1...1", "1...1", "1...1", ".111."],
  E: ["11111", "1....", "1....", "1111.", "1....", "1....", "11111"], D: ["1111.", "1...1", "1...1", "1...1", "1...1", "1...1", "1111."],
  C: [".1111", "1....", "1....", "1....", "1....", "1....", ".1111"], K: ["1...1", "1..1.", "1.1..", "11...", "1.1..", "1..1.", "1...1"],
  "-": [".....", ".....", ".....", ".111.", ".....", ".....", "....."],
  A: [".111.", "1...1", "1...1", "11111", "1...1", "1...1", "1...1"], N: ["1...1", "11..1", "11..1", "1.1.1", "1..11", "1..11", "1...1"], I: ["11111", "..1..", "..1..", "..1..", "..1..", "..1..", "11111"],
};
function logoText(textStr = "ANI-ROGUE") {
  const chars = [...textStr];
  const width = chars.length * 6 - 1;
  let main = "", shadow = "", inner = "";
  chars.forEach((ch, ci) => FONT[ch].forEach((row, y) => [...row].forEach((v, x) => {
    if (v !== "1") return;
    const X = ci * 6 + x;
    shadow += `<rect x="${X + 1}" y="${y + 1}" width="1" height="1"/>`;
    inner += `M${X} ${y}h1v1h-1z`;
    main += `<rect x="${X}" y="${y}" width="1" height="1" fill="${y < 2 ? "#ffe58a" : y < 5 ? "#e8b93d" : "#b8862b"}"/>`;
  })));
  // heller Glanzstreifen, der regelmäßig über die Buchstaben wandert
  const sheen = `<defs><mask id="lgm" maskUnits="userSpaceOnUse" x="-1" y="-1" width="${width + 3}" height="10"><path fill="#fff" d="${inner}"/></mask>
    <linearGradient id="lgs"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".95"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>
    <g mask="url(#lgm)"><rect x="-12" y="-1" width="9" height="10" fill="url(#lgs)" transform="skewX(-20)"><animate attributeName="x" from="-14" to="${width + 8}" dur="4.2s" repeatCount="indefinite"/></rect></g>`;
  return `<svg class="logo" viewBox="-1 -1 ${width + 3} 10" shape-rendering="crispEdges" role="img" aria-label="Ani-Rogue"><g fill="#17121f">${shadow}</g>${main}${sheen}</svg>`;
}

// Wahrzeichen des Spiels: der Mana-Kern, umkreist von den vier Elementen, darunter der Schriftzug
function logo(textStr = "ANI-ROGUE") {
  const orb = (icon, a) => `<span class="orb" style="--a:${a}deg">${ico(icon, 18)}</span>`;
  return `<div class="logoblock"><div class="emblemwrap">${ico("emblem", 88, { cls: "emblem" })}<div class="orbit">${orb("flame", 0)}${orb("water", 90)}${orb("leaf", 180)}${orb("snow", 270)}</div></div>${logoText(textStr)}</div>`;
}

__exports.at = at;
__exports.ico = ico;
__exports.btn = btn;
__exports.ibtn = ibtn;
__exports.pctOf = pctOf;
__exports.bar = bar;
__exports.itemNameCls = itemNameCls;
__exports.cardChips = cardChips;
__exports.cardHtml = cardHtml;
__exports.itemHtml = itemHtml;
__exports.itemIcon = itemIcon;
__exports.statusChips = statusChips;
__exports.logo = logo;

});
__define("ui/achview.js", function (__exports, __require) {
// Ansichten für Erfolge, Aussehen (Farbvarianten, Rahmen) und die Erfolgs-Meldung. Reine HTML-Strings, kein DOM.
const { CONTENT } = __require("content/index.js");
const { progressOf, rewardInfo } = __require("engine/achievements.js");
const { esc, skinPal, activeSkin, activeFrame } = __require("ui/util.js");
const { spr } = __require("ui/art/index.js");
const { at, ico, btn, pctOf } = __require("ui/widgets.js");

const GROUPS = [["gegner", "Gegner"], ["kaempfe", "Kämpfe"], ["sammlung", "Sammlung"], ["runs", "Runs und Siege"]];

// Kleine Vorschau der Belohnung eines Erfolgs
function rewardChip(a) {
  const r = rewardInfo(a);
  if (!r) return "";
  const art = r.kind === "items" ? spr("item", r.id, { attrs: 'width="24" height="24"' })
    : r.kind === "weapons" ? spr("weapon", r.id, { attrs: 'width="24" height="24"' })
    : r.kind === "skins" ? spr("hero", CONTENT.skins[r.id].hero, { pal: skinPal(r.id), attrs: 'height="28"' })
    : r.kind === "frames" ? `<span class="framesample frame-${esc(r.id)}"></span>` : "";
  return `<span class="rw">${art}<span><b>${esc(r.name)}</b> <span class="muted small">${esc(r.label)}</span></span></span>`;
}

function achCard(meta, a) {
  const done = Boolean(meta.achievements[a.id]);
  const prog = done ? null : progressOf(meta, a);
  return `<div class="ach px ${done ? "done" : "open"}"${at("ach-info", a.id)}><div class="achicon">${ico(done ? "trophy" : "lock", 28)}</div>
    <div class="achbody"><b>${esc(a.name)}</b><div class="d">${esc(a.text)}</div>
      ${prog ? `<div class="prog"><div class="bar"><i style="width:${pctOf(prog.value, prog.target)}%"></i></div><span class="small">${prog.value}/${prog.target}</span></div>` : ""}
      ${rewardChip(a)}</div></div>`;
}
const hiddenCard = () => `<div class="ach px open secret"><div class="achicon">${ico("n_ereignis", 28)}</div><div class="achbody"><b>???</b><div class="d">Etwas Verborgenes wartet noch.</div></div></div>`;

function achievementsView(ui) {
  const meta = ui.meta, all = Object.values(CONTENT.achievements);
  const visible = all.filter((a) => !a.secret), secrets = all.filter((a) => a.secret);
  const isDone = (a) => Boolean(meta.achievements[a.id]);
  const secDone = secrets.filter(isDone);
  // Reiter: eine Gruppe pro Reiter, damit nichts gescrollt werden muss. Geheimbereich erst, wenn der erste geheime Erfolg erreicht ist.
  const tabs = GROUPS.map(([g, title]) => ({ key: g, title, list: visible.filter((a) => a.group === g) }));
  if (secDone.length) tabs.push({ key: "geheim", title: "Geheim", secret: true });
  const cur = tabs.find((x) => x.key === ui.tab.ach) ?? tabs[0];
  const body = cur.secret
    ? `<div class="achgrid">${secDone.map((a) => achCard(meta, a)).join("")}${secrets.filter((a) => !isDone(a)).map(hiddenCard).join("")}</div>`   // offene bleiben "???" ohne jeden Hinweis
    : `<div class="achgrid">${cur.list.map((a) => achCard(meta, a)).join("")}</div>`;
  const label = (x) => x.secret ? `Geheim <span class="muted">${secDone.length}</span>` : `${x.title} <span class="muted">${x.list.filter(isDone).length}/${x.list.length}</span>`;
  return `<div class="screen collection"><div class="pg-head"><h2>Erfolge</h2><span class="muted small">${visible.filter(isDone).length} von ${visible.length}</span>
    <div class="tabs">${tabs.map((x) => `<span class="tab ${x.key === cur.key ? "on" : ""}"${at("set-tab", "ach", x.key)}>${label(x)}</span>`).join("")}</div><span class="grow"></span>${btn("Zurück", "to-title", undefined, { cls: "primary small" })}</div>
    <div class="pg-body">${body}${secDone.length ? "" : `<div class="muted small center pad">Manche Erfolge zeigen sich erst, wenn du sie erreichst.</div>`}</div></div>`;
}

// Was fehlt noch, um eine Freischaltung zu bekommen? (geheime Erfolge verraten nichts)
function lockHint(def) {
  const a = def.unlock?.type === "achievement" ? CONTENT.achievements[def.unlock.id] : null;
  return a && !a.secret ? `Erfolg: ${a.name}` : "???";
}

function cosmeticsView(ui) {
  const meta = ui.meta, frame = activeFrame(meta);
  const heroes = Object.values(CONTENT.classes).filter((cl) => Object.values(CONTENT.skins).some((s) => s.hero === cl.id)).map((cl) => {
    const cur = activeSkin(meta, cl.id);
    const chips = [`<span class="chip ${cur === "default" ? "on" : ""}"${at("pick-skin", cl.id, "default")}>Standard</span>`,
      ...Object.values(CONTENT.skins).filter((s) => s.hero === cl.id).map((s) => meta.unlocked[`skins/${s.id}`]
        ? `<span class="chip ${cur === s.id ? "on" : ""}"${at("pick-skin", cl.id, s.id)}>${esc(s.name)}</span>`
        : `<span class="chip lock">${ico("lock", 12)} ${esc(s.name)}: ${esc(lockHint(s))}</span>`)];
    return `<div class="px pad skinrow"><div class="skinart">${spr("hero", cl.id, { pal: skinPal(cur), attrs: 'height="96"' })}</div><div class="grow stack"><b>${esc(cl.name)}</b><div class="chips">${chips.join("")}</div></div></div>`;
  }).join("");
  const frames = [`<span class="chip ${frame === "default" ? "on" : ""}"${at("pick-frame", "default")}><span class="framesample"></span> Standard</span>`,
    ...Object.values(CONTENT.frames).map((f) => meta.unlocked[`frames/${f.id}`]
      ? `<span class="chip ${frame === f.id ? "on" : ""}"${at("pick-frame", f.id)}><span class="framesample frame-${esc(f.id)}"></span> ${esc(f.name)}</span>`
      : `<span class="chip lock">${ico("lock", 12)} ${esc(f.name)}: ${esc(lockHint(f))}</span>`)];
  const tab = ui.tab.cosm === "rahmen" ? "rahmen" : "farben";
  const body = tab === "farben" ? `<div class="skingrid">${heroes}</div>` : `<div class="px pad"><div class="chips">${frames.join("")}</div></div>`;
  return `<div class="screen collection"><div class="pg-head"><h2>Aussehen</h2><div class="tabs"><span class="tab ${tab === "farben" ? "on" : ""}"${at("set-tab", "cosm", "farben")}>Farben der Helden</span><span class="tab ${tab === "rahmen" ? "on" : ""}"${at("set-tab", "cosm", "rahmen")}>Rahmen</span></div><span class="grow"></span>${btn("Zurück", "to-title", undefined, { cls: "primary small" })}</div>
    <div class="pg-body">${body}<div class="muted small pad">Neue Varianten und Rahmen schaltest du über Erfolge frei. Ein Rahmen umrandet alle Karten und Items im Spiel (Hand, Shop, Beute).</div></div></div>`;
}

// Meldung, die kurz eingeblendet wird, wenn ein Erfolg erreicht wurde
function bannerHtml(id) {
  const a = CONTENT.achievements[id];
  if (!a) return "";
  const r = rewardInfo(a);
  return `<div class="achbanner"><span class="achicon">${ico("trophy", 26)}</span><div><b>Erfolg freigeschaltet</b><div>${esc(a.name)}</div>${r ? `<div class="small">Belohnung: ${esc(r.name)} (${esc(r.label)})</div>` : ""}</div></div>`;
}

// Info zu einem Erfolg: Text, Belohnung und Datum der Freischaltung
function achInfoView(ui) {
  const a = CONTENT.achievements[ui.achInfo], got = ui.meta.achievements[ui.achInfo], lang = document?.documentElement?.lang === "en" ? "en-US" : "de-DE";
  const when = got?.at ? new Date(got.at).toLocaleDateString(lang, { day: "2-digit", month: "2-digit", year: "numeric" }) : null;
  return `<div class="overlay"><div class="sheet mid stack center"><div>${ico(got ? "trophy" : "lock", 32)}</div><h2>${esc(a.name)}</h2><div>${esc(a.text)}</div>${rewardChip(a)}
    <div class="muted small">${got ? (when ? `Freigeschaltet am ${when}` : "Freigeschaltet (Datum unbekannt)") : "Noch nicht freigeschaltet"}</div>${btn("Schließen", "close-ach-info", undefined, { cls: "primary" })}</div></div>`;
}

__exports.rewardChip = rewardChip;
__exports.achievementsView = achievementsView;
__exports.cosmeticsView = cosmeticsView;
__exports.bannerHtml = bannerHtml;
__exports.achInfoView = achInfoView;

});
__define("engine/story.js", function (__exports, __require) {
// Dialogtexte für eine Klasse aufbereiten (klassenabhängige Zeilen werden aufgelöst).
const { CONTENT } = __require("content/index.js");

function storyLines(storyId, classId) {
  const st = CONTENT.stories[storyId];
  if (!st) return [];
  return st.lines.map((l) => (typeof l === "string" ? l : (l.perClass[classId] ?? l.perClass.default))).filter(Boolean);
}
const storySpeaker = (storyId) => {
  const st = CONTENT.stories[storyId];
  return st ? { id: st.speaker, ...CONTENT.speakers[st.speaker] } : null;
};

__exports.storyLines = storyLines;
__exports.storySpeaker = storySpeaker;

});
__define("ui/glossary.js", function (__exports, __require) {
// Kurze Begriffserklärungen für die Detailansicht einer Karte. Es werden höchstens drei gezeigt, damit es nicht zu viel wird.
// Die Texte beschreiben die echten Regeln der Engine (engine/combat.js: Ende der Gegnerrunde, modifiers.js: Verwundbar, Markiert).
const GLOSSARY = {
  gift:       ["Gift", "Am Ende der Gegnerrunde Schaden in Höhe der Stapel (ignoriert Block), danach 1 Stapel weniger."],
  blutung:    ["Blutung", "Am Ende der Gegnerrunde Schaden in Höhe der Stapel (ignoriert Block), danach halbieren sich die Stapel."],
  verwundbar: ["Verwundbar", "Das Ziel erleidet 50 % mehr Schaden. Jede Runde 1 Stapel weniger."],
  markiert:   ["Markiert", "Jeder Treffer macht 1 Schaden mehr. Jede Runde 1 Stapel weniger."],
  ausweichen: ["Ausweichen", "Pro Stapel geht ein Angriff daneben. Endet mit deinem nächsten Zug."],
  dornen:     ["Dornen", "Jeder Angreifer erleidet Schaden, auch wenn dein Block alles abfängt. Endet mit deinem nächsten Zug."],
  verbrennung: ["Verbrennung", "Am Ende der Gegnerrunde Schaden in Höhe der Stapel (ignoriert Block), danach halbieren sich die Stapel."],
  fromMissingHp: ["Fehlende HP", "Der Schaden hängt davon ab, wie viele Lebenspunkte dir zum Maximum fehlen."],
  hpLost:     ["HP verloren", "Zählt alle HP, die seit Beginn deines Zuges verloren gingen, auch durch eigene Karten und Items."],
  frost:      ["Kälte", "Sammelt sich beim Gegner. Bei 3 Stapeln friert er ein und überspringt seine nächste Aktion (der Endboss und Feuerwesen sind immun)."],
  aussetzen:  ["Aussetzen", "Der Gegner überspringt diese Runde seine Aktion. Bosse sind unbestechlich."],
  lifesteal:  ["Lebensraub", "Du heilst dich um den tatsächlich verursachten Schaden (Block des Ziels zählt nicht)."],
  kopfgeld:   ["Kopfgeld", "Tötet genau diese Karte den Gegner, erhältst du sofort das Gold."],
  maxHp:      ["Max-HP", "Dauerhaft bis zum Ende des Runs; die aktuellen HP steigen mit."],
  geheilt:    ["Geheilt", "Zählt auch, wenn die Heilung durch einen Effekt (z. B. Nekromanten-Pakt) verhindert wurde."],
  verbrauchen: ["Verbrauchen", "Nach dem Spielen ist die Karte für den Rest dieses Kampfes weg. Im nächsten Kampf ist sie wieder da."],
  fromBlock:  ["Schaden aus Block", "Der Schaden hängt von deinem aktuellen Block ab. Der Block bleibt erhalten."],
  loseHp:     ["HP verlieren", "Kostet HP, aber nie die letzte: mindestens 1 HP bleibt. Zählt nicht als erlittener Schaden."],
  reaktion:   ["Reaktion", "Zwei verschiedene Elemente nacheinander im selben Zug lösen eine Reaktion mit Zusatzwirkung aus."],
  block:      ["Block", "Fängt Schaden ab und verfällt zu Beginn deines nächsten Zuges."],
};
const ORDER = ["verbrauchen", "gift", "blutung", "verbrennung", "frost", "aussetzen", "lifesteal", "kopfgeld", "geheilt", "maxHp", "verwundbar", "markiert", "ausweichen", "dornen", "fromBlock", "fromMissingHp", "hpLost", "loseHp", "reaktion", "block"];

// Welche Begriffe kommen auf dieser Karte vor? (höchstens max, in fester Reihenfolge der Wichtigkeit)
function keywordsOf(def, max = 3) {
  const found = new Set();
  for (const a of def.play ?? []) {
    if ((a.action === "status" || a.action === "playerStatus") && GLOSSARY[a.status]) found.add(a.status);
    if (a.fromBlock) found.add("fromBlock");
    if (a.lifesteal) found.add("lifesteal");
    if (a.onKill) found.add("kopfgeld");
    if (a.action === "maxHpUp") found.add("maxHp");
    if (a.ifHealed || a.unlessHealed) found.add("geheilt");
    if (a.fromMissingHp) found.add("fromMissingHp");
    if (a.ifHpLost || a.unlessHpLost) found.add("hpLost");
    if (a.action === "loseHp") found.add("loseHp");
    if (a.action === "block") found.add("block");
  }
  if (def.exhaust) found.add("verbrauchen");
  if (def.element) found.add("reaktion");
  const list = ORDER.filter((k) => found.has(k));
  const rest = list.filter((k) => k !== "block");                 // Block ist Grundwissen: nur zeigen, wenn sonst nichts zu erklären ist
  return (rest.length ? rest : list).slice(0, max).map((k) => ({ key: k, name: GLOSSARY[k][0], text: GLOSSARY[k][1] }));
}

__exports.GLOSSARY = GLOSSARY;
__exports.keywordsOf = keywordsOf;

});
__define("ui/backdrop.js", function (__exports, __require) {
// Kulissen im Gate-Stil: Gasse, U-Bahn und Gate-Kern mit Tiefe (Säulen, wirbelndes Portal, Neonlampen, Gilden-Flaggen mit dem Mana-Kern, perspektivischer Boden, Runenkreis der vier Elemente)
// plus Atmosphäre (Lichtstrahl, Nebel, Staub, Funken).
// Alles reine SVG-Strings in der virtuellen Größe 400x232. Animationen laufen per CSS (siehe style.css).
const { CONTENT } = __require("content/index.js");
const { spr } = __require("ui/art/index.js");
const { elementColor } = __require("ui/theme.js");

const W = 400, H = 232, HORIZON = 150;

const BIOMES = [
  { name: "Gasse",     wall: "#1b2233", brick: "#27304a", brick2: "#212a40", mortar: "#0d1220", floor: "#1d2538", tile: "#27304a", line: "#121827", glow: "#ff4fa3", cloth: "#2a2f5a", trim: "#4fe3ff", props: "alley",  fog: "#6f86c9" },
  { name: "U-Bahn",    wall: "#14232b", brick: "#1f3944", brick2: "#1a2f39", mortar: "#0a1519", floor: "#182b33", tile: "#21404c", line: "#0f1c22", glow: "#33ffd1", cloth: "#124a4a", trim: "#9ffff0", props: "subway", fog: "#6fc4b8" },
  { name: "Gate-Kern", wall: "#1e1236", brick: "#2b1a4d", brick2: "#251642", mortar: "#0f0820", floor: "#241540", tile: "#33205a", line: "#150a2a", glow: "#b46bff", cloth: "#3a1d73", trim: "#ff7ae0", props: "core",   fog: "#9d7be0" },
];

// Zufall, der immer gleich ist (die Kulisse darf nicht bei jedem Zeichnen anders aussehen)
const rnd = (n) => { let h = (n * 2654435761) >>> 0; h ^= h >>> 15; h = Math.imul(h, 2246822519) >>> 0; return ((h ^ (h >>> 13)) >>> 0) / 4294967296; };
const px = (x, y, w, h, fill, extra = "") => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"${extra}/>`;

// ---- Bausteine
function pillar(x, b, id) {
  const w = 18;
  return `<g>${px(x, 0, w, HORIZON, `url(#pil${id})`)}
    ${px(x - 3, 0, w + 6, 8, b.mortar)}${px(x - 3, 8, w + 6, 2, "#000", ' opacity=".3"')}${px(x - 2, 10, w + 4, 3, b.brick)}
    ${px(x - 3, HORIZON - 9, w + 6, 9, b.brick2)}${px(x - 3, HORIZON - 9, w + 6, 2, "#fff", ' opacity=".08"')}${px(x - 5, HORIZON - 3, w + 10, 3, b.mortar)}
    ${[24, 52, 88, 118].map((y) => px(x, y, w, 1, "#000", ' opacity=".28"')).join("")}${px(x + 2, 14, 2, HORIZON - 26, "#fff", ' opacity=".07"')}</g>`;
}
function torch(x, y, b) {                                                          // Neonlampe an der Wand (statt Fackel)
  return `<g>${px(x + 11, y + 28, 2, 14, "#2a3350")}${px(x + 3, y + 26, 18, 3, "#2a3350")}
    <circle class="glow" cx="${x + 12}" cy="${y + 12}" r="46" fill="url(#tg${b.props})"/>
    <g class="flick">${px(x + 4, y + 4, 16, 22, "#0a0e1c")}${px(x + 6, y + 6, 12, 18, b.glow, ' opacity=".9"')}${px(x + 8, y + 8, 3, 14, "#fff", ' opacity=".55"')}${px(x + 14, y + 8, 2, 14, "#fff", ' opacity=".25"')}</g></g>`;
}
function banner(cx, b) {
  const x = cx - 15;
  return `<g class="sway" style="transform-origin:${cx}px 0">${px(x - 3, 0, 36, 4, "#5b4a2b")}
    <polygon points="${x},4 ${x + 30},4 ${x + 30},58 ${cx},70 ${x},58" fill="${b.cloth}"/>
    <polygon points="${x},4 ${x + 30},4 ${x + 30},9 ${x},9" fill="${b.trim}" opacity=".85"/>
    <polygon points="${x + 3},12 ${x + 27},12 ${x + 27},56 ${cx},66 ${x + 3},56" fill="none" stroke="${b.trim}" stroke-width="1" opacity=".55"/>
    ${spr("icon", "emblem", { attrs: `x="${cx - 12}" y="24" width="24" height="24"` })}</g>`;
}
function gate(b, id) {                                                             // das GATE: ein wirbelndes Portal in der Wand
  const x = 164, w = 72, top = 34, cx = x + w / 2, cy = top + 60, shape = `M${x} ${HORIZON} V${top + 28} Q${x} ${top} ${cx} ${top} Q${x + w} ${top} ${x + w} ${top + 28} V${HORIZON} Z`;
  const rings = [0, 1, 2, 3].map((i) => `<ellipse class="${i % 2 ? "" : "glow"}" cx="${cx}" cy="${cy + 6}" rx="${10 + i * 9}" ry="${16 + i * 15}" fill="none" stroke="${b.glow}" stroke-width="${(2.2 - i * 0.4).toFixed(1)}" opacity="${(0.9 - i * 0.18).toFixed(2)}"/>`).join("");
  const sparks = [[x + 12, top + 70], [x + 58, top + 52], [x + 22, top + 30], [x + 50, top + 96], [cx, top + 14]].map(([sx, sy], i) => `<rect class="mote" x="${sx}" y="${sy}" width="2" height="2" fill="#fff" style="--d:${(i * 0.5).toFixed(1)}s"/>`).join("");
  return `<g>${px(x - 8, top - 8, w + 16, HORIZON - top + 8, b.mortar)}
    <path d="${shape}" fill="#05030c"/><path d="${shape}" fill="url(#gl${id})"/>${rings}
    <path d="${shape}" fill="url(#pg${id})" opacity=".9"/>${sparks}
    <path d="M${x - 4} ${HORIZON} V${top + 28} Q${x - 4} ${top - 4} ${cx} ${top - 4} Q${x + w + 4} ${top - 4} ${x + w + 4} ${top + 28} V${HORIZON}" fill="none" stroke="${b.trim}" stroke-width="2.5" opacity=".85" class="glow"/>
    ${px(x - 10, HORIZON - 4, w + 20, 4, b.brick2)}</g>`;
}
function barrel(x, y) {
  return `<g>${px(x, y - 20, 18, 20, "#5a3b26")}${px(x + 2, y - 20, 3, 20, "#7a5232", ' opacity=".7"')}${px(x, y - 15, 18, 2, "#2c1c12")}${px(x, y - 6, 18, 2, "#2c1c12")}${px(x + 1, y - 22, 16, 3, "#6b4630")}${px(x + 14, y - 20, 4, 20, "#000", ' opacity=".25"')}</g>`;
}
function crate(x, y, s = 16) {
  return `<g>${px(x, y - s, s, s, "#6b4a2e")}${px(x, y - s, s, 2, "#8a643f")}${px(x, y - 2, s, 2, "#3a2717")}${px(x, y - s, 2, s, "#3a2717")}${px(x + s - 2, y - s, 2, s, "#3a2717")}<path d="M${x + 2} ${y - s + 2} L${x + s - 2} ${y - 2} M${x + s - 2} ${y - s + 2} L${x + 2} ${y - 2}" stroke="#3a2717" stroke-width="1.5"/></g>`;
}
function crystal(x, y, h, color, light) {
  return `<g><polygon points="${x},${y} ${x + 5},${y - h} ${x + 10},${y}" fill="${color}"/><polygon points="${x + 5},${y - h} ${x + 10},${y} ${x + 5},${y}" fill="#000" opacity=".22"/><polygon points="${x + 5},${y - h} ${x + 2},${y - 2} ${x + 4},${y - h + 6}" fill="${light}" opacity=".7"/></g>`;
}
function cobweb(x, flip) {
  const s = flip ? -1 : 1;
  return `<g stroke="#fff" stroke-opacity=".16" stroke-width=".8" fill="none"><path d="M${x} 0 L${x + 34 * s} 0 M${x} 0 L${x} 34 M${x} 0 L${x + 30 * s} 30"/><path d="M${x + 14 * s} 0 Q${x + 12 * s} 12 ${x} 14 M${x + 24 * s} 0 Q${x + 20 * s} 20 ${x} 24"/></g>`;
}
function vending(x, y, glow) {                                                      // Getränkeautomat
  return `<g>${px(x, y - 38, 24, 38, "#1c2440")}${px(x + 2, y - 36, 14, 24, "#0a0e1c")}${px(x + 3, y - 35, 12, 22, glow, ' opacity=".55"')}${[0, 1, 2].map((r) => [0, 1, 2].map((c) => px(x + 4 + c * 4, y - 33 + r * 7, 3, 5, ["#ff4fa3", "#4fe3ff", "#ffd166"][(r + c) % 3], ' opacity=".9"')).join("")).join("")}${px(x + 18, y - 34, 4, 20, "#2a3350")}${px(x + 4, y - 8, 10, 4, "#05070f")}</g>`;
}
function bin(x, y) { return `<g>${px(x, y - 16, 14, 16, "#2a3350")}${px(x - 1, y - 18, 16, 3, "#3b4770")}${px(x + 3, y - 14, 1, 12, "#fff", ' opacity=".12"')}</g>`; }
const props = (b) => {
  if (b.props === "subway") {
    const pipes = [0, 1, 2].map((i) => px(0, 10 + i * 7, W, 3, "#1b3038")).join("") + [30, 90, 150, 250, 310, 370].map((x) => px(x, 6, 12, 26, b.mortar)).join("");
    const lights = [40, 120, 280, 360].map((x) => `<g class="flick">${px(x, 34, 28, 4, b.glow, ' opacity=".8"')}<ellipse cx="${x + 14}" cy="40" rx="30" ry="8" fill="${b.glow}" opacity=".08"/></g>`).join("");
    return `${pipes}${lights}${crystal(22, HORIZON + 2, 22, "#2fb09a", "#bffff0")}${crystal(366, HORIZON + 2, 26, "#2fb09a", "#bffff0")}${bin(48, HORIZON + 4)}${crate(340, HORIZON + 3)}`;
  }
  if (b.props === "core") {
    return `<polygon points="170,${H} 230,${H} 214,${HORIZON + 1} 186,${HORIZON + 1}" fill="#3a1d73" opacity=".6"/>${px(186, HORIZON + 1, 28, 2, "#ff7ae0", ' opacity=".6"')}
      ${[[30, "feuer"], [62, "wasser"], [320, "pflanze"], [352, "eis"]].map(([x, el]) => `<g>${px(x - 2, HORIZON - 10, 18, 10, b.brick2)}${crystal(x, HORIZON - 10, 28, elementColor(el), "#fff")}<circle class="glow" cx="${x + 5}" cy="${HORIZON - 24}" r="22" fill="url(#eg_${el})"/></g>`).join("")}`;
  }
  return `${vending(24, HORIZON + 4, b.glow)}${bin(54, HORIZON + 4)}${bin(70, HORIZON + 5)}${crate(348, HORIZON + 3)}${crate(366, HORIZON + 3, 18)}${crate(357, HORIZON - 13, 14)}`;
};

// ---- Boden mit Perspektive
function floor(b, id, ext = 0) {
  const vp = 92, t = (HORIZON - vp) / (H - vp);
  const rays = Array.from({ length: 16 + Math.ceil(ext / 40) * 2 }, (_, i) => -220 - Math.ceil(ext / 40) * 80 + i * 80).map((xb) => `<line x1="${xb}" y1="${H}" x2="${(200 + (xb - 200) * t).toFixed(1)}" y2="${HORIZON}" stroke="${b.line}" stroke-width="1"/>`).join("");
  const rows = [HORIZON + 8, HORIZON + 18, HORIZON + 31, HORIZON + 48, HORIZON + 69].map((y) => px(-ext, y, W + 2 * ext, 1, b.line)).join("");
  const stain = [[60, 176, 14], [310, 188, 18], [150, 210, 12]].map(([x, y, r], i) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 0.26}" fill="#000" opacity="${(0.1 + i * 0.03).toFixed(2)}"/>`).join("");
  const cracks = `<path d="M96 170 l8 6 l-3 5 l9 7" stroke="${b.line}" stroke-width="1" fill="none"/><path d="M286 196 l-9 4 l4 6 l-8 6" stroke="${b.line}" stroke-width="1" fill="none"/>`;
  const puddle = `<ellipse cx="318" cy="208" rx="22" ry="4.5" fill="${b.glow}" opacity=".12"/><ellipse cx="318" cy="207" rx="22" ry="4.5" fill="#000" opacity=".25"/><rect x="306" y="206" width="9" height="1" fill="#fff" opacity=".28"/>`;
  return `${px(-ext, HORIZON, W + 2 * ext, H - HORIZON, `url(#fl${id})`)}${px(-ext, HORIZON, W + 2 * ext, 4, "#000", ' opacity=".4"')}${rays}${rows}${stain}${cracks}${puddle}`;
}
// Runenkreis der vier Elemente: das Wahrzeichen auf dem Boden
function runes(b) {
  const cx = 200, cy = 190, rx = 124, ry = 21;
  const pts = [["feuer", 0], ["wasser", 90], ["pflanze", 180], ["eis", 270]].map(([el, a]) => {
    const r = (a * Math.PI) / 180; return `<ellipse cx="${(cx + Math.cos(r) * rx).toFixed(1)}" cy="${(cy + Math.sin(r) * ry).toFixed(1)}" rx="4" ry="1.7" fill="${elementColor(el)}" opacity=".95"/><ellipse class="glow" cx="${(cx + Math.cos(r) * rx).toFixed(1)}" cy="${(cy + Math.sin(r) * ry).toFixed(1)}" rx="14" ry="5" fill="url(#eg_${el})"/>`;
  }).join("");
  const ticks = Array.from({ length: 24 }, (_, i) => { const r = (i * 15 * Math.PI) / 180; return px((cx + Math.cos(r) * (rx - 8) - 0.5).toFixed(1), (cy + Math.sin(r) * (ry - 3) - 0.5).toFixed(1), 1.2, 1.2, b.glow, ' opacity=".5"'); }).join("");
  return `<g class="runes"><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="${b.glow}" stroke-width="1.4" opacity=".4"/>
    <ellipse cx="${cx}" cy="${cy}" rx="${rx - 14}" ry="${ry - 3.5}" fill="none" stroke="${b.glow}" stroke-width="1" opacity=".28" stroke-dasharray="3 3"/>${ticks}${pts}</g>`;
}
// Atmosphäre
function atmosphere(b, id, ext = 0) {
  const motes = Array.from({ length: 16 }, (_, i) => `<rect class="mote" x="${(rnd(i + 11) * W).toFixed(0)}" y="${(40 + rnd(i + 31) * 170).toFixed(0)}" width="${rnd(i + 5) > 0.6 ? 2 : 1.4}" height="${rnd(i + 5) > 0.6 ? 2 : 1.4}" fill="#fff" style="--dx:${((rnd(i + 21) - 0.5) * 30).toFixed(0)}px;--dur:${(7 + rnd(i + 41) * 8).toFixed(1)}s;--d:${(-rnd(i + 51) * 10).toFixed(1)}s"/>`).join("");
  return `<polygon class="shaft" points="30,0 66,0 168,${H} 96,${H}" fill="url(#sh${id})"/>
    <rect class="fog f1" x="${-60 - ext}" y="${HORIZON - 12}" width="${W + 120 + 2 * ext}" height="26" fill="url(#fg${id})"/><rect class="fog f2" x="${-60 - ext}" y="${HORIZON + 14}" width="${W + 120 + 2 * ext}" height="22" fill="url(#fg${id})" opacity=".6"/>${motes}`;
}

// ---- Gesamte Kulisse
function backdrop(b, id = "", o = {}) {
  const k = `${b.props}`;
  const defs = `<defs>
    <pattern id="brk${id}" width="64" height="32" patternUnits="userSpaceOnUse"><rect width="64" height="32" fill="${b.mortar}"/>
      ${[[1, 1, 30, 14, b.brick], [33, 1, 30, 14, b.brick2], [-15, 17, 30, 14, b.brick2], [17, 17, 30, 14, b.brick], [49, 17, 30, 14, b.brick2]].map(([x, y, w, h, c]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}"/><rect x="${x}" y="${y}" width="${w}" height="1" fill="#fff" opacity=".07"/><rect x="${x}" y="${y + h - 1}" width="${w}" height="1" fill="#000" opacity=".22"/>`).join("")}</pattern>
    <pattern id="mos${id}" width="96" height="48" patternUnits="userSpaceOnUse">${Array.from({ length: 9 }, (_, i) => `<rect x="${(rnd(i + 70) * 90).toFixed(0)}" y="${(rnd(i + 90) * 44).toFixed(0)}" width="${6 + Math.round(rnd(i + 3) * 8)}" height="${3 + Math.round(rnd(i + 8) * 4)}" fill="#000" opacity=".16"/>`).join("")}</pattern>
    <linearGradient id="pil${id}" x1="0" x2="1"><stop offset="0" stop-color="${b.brick}"/><stop offset=".55" stop-color="${b.brick2}"/><stop offset="1" stop-color="${b.mortar}"/></linearGradient>
    <linearGradient id="fl${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${b.mortar}"/><stop offset=".25" stop-color="${b.floor}"/><stop offset="1" stop-color="${b.tile}"/></linearGradient>
    <linearGradient id="tp${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".62"/><stop offset=".6" stop-color="#000" stop-opacity="0"/></linearGradient>
    <radialGradient id="tg${k}"><stop offset="0" stop-color="${b.glow}" stop-opacity=".5"/><stop offset=".5" stop-color="${b.glow}" stop-opacity=".14"/><stop offset="1" stop-color="${b.glow}" stop-opacity="0"/></radialGradient>
    <linearGradient id="gl${id}" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${b.glow}" stop-opacity=".38"/><stop offset=".7" stop-color="${b.glow}" stop-opacity="0"/></linearGradient>
    <linearGradient id="sh${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".2"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
    <linearGradient id="fg${id}" x1="0" x2="1"><stop offset="0" stop-color="${b.fog}" stop-opacity="0"/><stop offset=".3" stop-color="${b.fog}" stop-opacity=".22"/><stop offset=".7" stop-color="${b.fog}" stop-opacity=".16"/><stop offset="1" stop-color="${b.fog}" stop-opacity="0"/></linearGradient>
    ${Object.keys(CONTENT.elements).map((el) => `<radialGradient id="eg_${el}"><stop offset="0" stop-color="${elementColor(el)}" stop-opacity=".6"/><stop offset=".55" stop-color="${elementColor(el)}" stop-opacity=".18"/><stop offset="1" stop-color="${elementColor(el)}" stop-opacity="0"/></radialGradient>`).join("")}
    <radialGradient id="pg${id}" cx="50%" cy="55%" r="60%"><stop offset="0" stop-color="${b.glow}" stop-opacity=".55"/><stop offset=".6" stop-color="${b.glow}" stop-opacity=".12"/><stop offset="1" stop-color="#000" stop-opacity=".0"/></radialGradient>
    <radialGradient id="vg${id}" cx="50%" cy="58%" r="78%"><stop offset="55%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity=".62"/></radialGradient></defs>`;
  const arch = (x0, x1) => `<path d="M${x0} ${HORIZON} V50 Q${(x0 + x1) / 2} 12 ${x1} 50 V${HORIZON} Z" fill="#000" opacity=".22"/><path d="M${x0} ${HORIZON} V50 Q${(x0 + x1) / 2} 12 ${x1} 50 V${HORIZON}" fill="none" stroke="${b.mortar}" stroke-width="2" opacity=".7"/>`;
  // breitere Bühne (Querformat): Wand und Boden laufen weiter, links und rechts stehen zusätzliche Säulen mit Bannern
  const ext = Math.round(o.ext ?? 0), X0 = -ext, WW = W + 2 * ext;
  const extra = [];
  for (let x = -134; x > X0 - 20; x -= 134) extra.push(x);
  for (let x = 516; x < W + ext + 20; x += 134) extra.push(x);
  const extraBanners = extra.map((x, i) => (i % 2 === 0 ? banner(x + (x < 0 ? 67 : -67), b) : "")).join("");
  return `${defs}${px(X0, 0, WW, HORIZON, `url(#brk${id})`)}${px(X0, 0, WW, HORIZON, `url(#mos${id})`)}${px(X0, 0, WW, HORIZON, `url(#tp${id})`)}
    ${arch(30, 128)}${arch(272, 372)}${gate(b, id)}
    ${[0, 134, 248, 382, ...extra].map((x) => pillar(x, b, id)).join("")}
    ${banner(80, b)}${banner(320, b)}${extraBanners}${torch(129, 60, b)}${torch(247, 60, b)}
    ${floor(b, id, ext)}${runes(b)}${o.noProps ? "" : props(b)}${atmosphere(b, id, ext)}
    ${px(X0, 0, WW, H, `url(#vg${id})`, ' pointer-events="none"')}`;
}

__exports.W = W;
__exports.BIOMES = BIOMES;
__exports.backdrop = backdrop;

});
__define("ui/scene.js", function (__exports, __require) {
// Szenen als SVG: Kampf (Boden, Held links, Gegner rechts), Intro und Menü-Hintergrund. Reine Funktionen, kein DOM.
// Virtuelle Größe 400x216, wird vom Browser auf Quer- und Hochformat skaliert.
const { CONTENT } = __require("content/index.js");
const { aliveEnemies, intentOf } = __require("engine/combat.js");
const { spr, sprSize, heroPx, npcPx, enemyPx, enemyFootprint, handOf, weaponPx, weaponGrip, cardIconId, elementIconId } = __require("ui/art/index.js");
const { esc, skinPal } = __require("ui/util.js");
const { elementColor, STATUS } = __require("ui/theme.js");
const { backdrop, BIOMES } = __require("ui/backdrop.js");

const W = 400, H = 232;
const HERO = { x: 78, feet: 192 };
// Größe, Handposition und Waffengriff kommen aus den Figurendaten (ui/art/index.js: heroPx, handOf, weaponPx, weaponGrip), nicht mehr aus festen Zahlen hier
// Haltung der Waffe nach ihrer Art (nicht nach der Klasse des Trägers): Bogen fast senkrecht, Stab leicht schräg, Klinge schräg
const wkind = (id) => { const t = CONTENT.get("weapons", id).tags; return t.includes("fernkampf") ? "fernkaempfer" : t.includes("zauber") ? "magier" : "nahkaempfer"; };
// Jede Gegnerart bewegt sich anders im Leerlauf: Geister schweben, Golems stampfen, Ratten hüpfen ...
const ENEMY_MOTION = {
  ratte: "hop", glutgeist: "float", flussgeist: "float", funke: "pulse",     // alle anderen bewegen sich über ihre Körperteile (ui/art/rigs.js)
};

const biomeFor = (run) => (run && run.nodeId === "boss" ? 2 : run && (run.path?.length ?? 0) > 5 ? 1 : 0);

// ---------------------------------------------------------------- Bausteine
const bar = (x, y, w, frac, color = "#c73c3c", h = 5) =>
  `<rect x="${x - 1}" y="${y - 1}" width="${w + 2}" height="${h + 2}" fill="#17121f"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#4a3a4a"/><rect x="${x}" y="${y}" width="${Math.max(0, Math.round(w * Math.min(1, frac)))}" height="${h}" fill="${color}"/>`;
const icon = (id, x, y, s = 1, extra = {}) => spr("icon", id, { attrs: `x="${x}" y="${y}" width="${10 * s}" height="${10 * s}"`, ...extra });
const text = (s, x, y, cls = "", extra = "") => `<text class="t ${cls}" x="${x}" y="${y}" ${extra}>${esc(s)}</text>`;
const sparkles = (cx, cy, w, h) => [[-0.45, -0.4, 0], [0.5, -0.1, 0.5], [-0.1, 0.45, 1], [0.35, 0.5, 1.5]]
  .map(([dx, dy, d]) => `<g transform="translate(${Math.round(cx + dx * w - 6)} ${Math.round(cy + dy * h - 6)})" class="twinkle" style="animation-delay:${d}s">${spr("icon", "fx_spark", { attrs: 'width="12" height="12"' })}</g>`).join("");

// Standort der Gegner: stabil, solange die Welle läuft (auch tote Gegner behalten ihren Platz)
function layoutEnemies(enemies) {
  const n = enemies.length, zoneL = 178, zoneW = 212, out = {};
  const two = n > 3;
  const cols = two ? Math.ceil(n / 2) : n;
  enemies.forEach((e, i) => {
    const row = two ? i % 2 : 0, col = two ? Math.floor(i / 2) : i;
    const x = zoneL + ((col + 0.5) * zoneW) / cols + (two && row ? 12 : 0);
    const big = sprSize("enemy", e.id).h * enemyPx(e.id) > 100;
    out[e.uid] = { x: Math.min(x, W - 30), y: two ? (row ? 198 : 184) : big ? 196 : 192, order: row };
  });
  // Breite Figuren (neue Grafik) dürfen sich höchstens zu 40 % überdecken: in jeder Reihe von links nach rechts nachrücken, bei Platzmangel nach links ausweichen.
  // Die heutigen Gegner sind so schmal, dass sich dadurch nichts ändert.
  for (const row of two ? [0, 1] : [0]) {
    const list = enemies.filter((_, i) => (two ? i % 2 : 0) === row);
    const half = (e) => enemyFootprint(e.id) / 2;
    for (let j = 1; j < list.length; j++) {
      const need = 0.6 * (half(list[j - 1]) + half(list[j]));
      if (out[list[j].uid].x - out[list[j - 1].uid].x < need) out[list[j].uid].x = out[list[j - 1].uid].x + need;
    }
    const last = list.at(-1);
    if (last) {
      const over = out[last.uid].x + half(last) - (W - 6);
      if (over > 0) list.forEach((e) => { out[e.uid].x -= over; });
    }
  }
  return out;
}

// ---------------------------------------------------------------- Zeitplan der Animationen aus den Kampf-Ereignissen
function timeline(fx) {
  let clock = 0;
  const out = [];
  for (const ev of fx) {
    if (ev.t === "eact") { clock += 0.55; out.push({ ev, t: clock }); }
    else if (ev.t === "play") { out.push({ ev, t: clock }); clock += 0.05; }
    else out.push({ ev, t: clock + 0.28 });
  }
  return out;
}

// ---------------------------------------------------------------- Kampfszene
// ctx: { run, c (Kampf), fx (Ereignisse der letzten Aktion), enter ("all" | "enemies" | null), targetable (Set von UIDs), weapon }
function combatScene({ run, c, fx = [], enter = null, targetable = new Set(), focus = null, ext = 0, victory = false }) {
  const b = BIOMES[biomeFor(run)];
  const tl = timeline(fx);
  const layout = layoutEnemies(c.enemies);
  const heroPos = { x: HERO.x, y: HERO.feet };
  const killed = new Set(fx.filter((e) => e.t === "kill").map((e) => e.uid));
  const summoned = new Set(fx.filter((e) => e.t === "summon").map((e) => e.uid));

  // Zeiten und Animationen pro Figur einsammeln
  const A = {};                                        // uid -> { strike, hurt, hit }
  const mark = (uid, key, t) => { (A[uid] ??= {})[key] ??= t; };
  const floats = [], shots = [];
  let play = null;
  const style = (tags, element) => (tags.includes("fernkampf") ? "shoot" : tags.includes("zauber") || element ? "cast" : "slash");
  const targetsOf = (ev) => (ev.all ? c.enemies.filter((e) => e.hp > 0 || killed.has(e.uid)).map((e) => e.uid) : [ev.target]);
  for (const { ev, t } of tl) {
    const pos = (uid) => (uid === "hero" ? { x: HERO.x, y: HERO.feet - 90 } : { x: layout[uid]?.x ?? 300, y: (layout[uid]?.y ?? 190) - 70 });
    switch (ev.t) {
      case "play": {
        play = { style: style(ev.tags, ev.element), element: ev.element, t };
        mark("hero", "strike", t);
        for (const uid of targetsOf(ev)) if (uid && layout[uid]) shots.push({ ...play, uid });
        break;
      }
      case "hit": {
        mark(ev.uid, "hit", t);
        if (ev.amount > 0) floats.push({ ...pos(ev.uid), text: `-${ev.amount}`, cls: ev.strong ? "crit" : ev.weak ? "weak" : "dmg", t });
        else if (ev.blocked > 0) floats.push({ ...pos(ev.uid), text: "Block", cls: "info", t });
        break;
      }
      case "plate": mark(ev.uid, "hit", t); floats.push({ ...pos(ev.uid), text: "Panzer!", cls: "info", t }); break;
      case "status": floats.push({ ...pos(ev.uid), y: pos(ev.uid).y + 14, text: `${STATUS[ev.status]?.[1] ?? ev.status} ${ev.stacks}`, cls: "stat", t }); break;
      case "eact": if (ev.kind === "attack") mark(ev.uid, "strike", t); break;
      case "phit": mark("hero", "hurt", t); floats.push({ ...pos("hero"), text: ev.amount > 0 ? `-${ev.amount}` : "Block", cls: ev.amount > 0 ? "dmg" : "info", t }); break;
      case "dodge": floats.push({ ...pos("hero"), text: "Ausgewichen", cls: "info", t }); break;
      case "block": floats.push({ ...pos("hero"), y: pos("hero").y + 16, text: `+${ev.amount} Block`, cls: "block", t }); break;
      case "heal": floats.push({ ...pos("hero"), y: pos("hero").y + 8, text: `+${ev.amount}`, cls: "heal", t }); break;
      case "reaction": floats.push({ x: W / 2, y: 70, text: `${ev.name}!`, cls: "react", t }); break;
      case "phase": floats.push({ x: W / 2, y: 52, text: "Phasenwechsel!", cls: "react", t }); break;
      case "rotate": floats.push({ ...pos(ev.uid), text: ev.element, cls: "react small", t }); break;
    }
  }
  const del = (uid, key) => (A[uid]?.[key] !== undefined ? `style="--d:${A[uid][key].toFixed(2)}s"` : "");
  const anim = (uid, key, cls) => (A[uid]?.[key] !== undefined ? ` ${cls}` : "");

  // ---- Held
  const cls = run.classId, sz = sprSize("hero", cls), hs = heroPx(cls);
  const [hx, hy] = handOf(cls);
  const wid = run.weapon.replace(/:s$/, "");        // Chrom-Waffen haben die ID "x:s", die Grafik kennt nur "x"
  const wsz = sprSize("weapon", wid), wp = weaponPx(wid), [wgx, wgy] = weaponGrip(wid);
  const hx0 = HERO.x - (sz.w * hs) / 2, hy0 = HERO.feet - sz.h * hs;
  const wpn = CONTENT.get("weapons", run.weapon);
  const hero = `<g class="pos" transform="translate(${hx0} ${hy0})"><g class="mover${enter ? " enter-l" : ""}${victory ? ` victory vic-${run.classId}` : ""}${anim("hero", "strike", ` strike-${play?.style ?? "slash"}`)}" ${del("hero", "strike")}>
      <ellipse cx="${(sz.w * hs) / 2}" cy="${sz.h * hs - 1}" rx="${sz.w * hs * 0.4}" ry="5" fill="#000" opacity=".42"/><g class="flash${anim("hero", "hurt", " hurtflash")}" ${del("hero", "hurt")}><g class="shake${anim("hero", "hurt", " hurtshake")}" ${del("hero", "hurt")}><g class="bob ${cls === "magier" ? "mv-hover" : "mv-none"}">
      ${spr("hero", cls, { shiny: run.shinyHero, pal: skinPal(run.skin), attrs: `width="${sz.w * hs}" height="${sz.h * hs}"` })}
      <g transform="translate(${hx * hs} ${hy * hs})"><g class="wpn ${wkind(run.weapon)}${anim("hero", "strike", " wpn-swing")}" ${del("hero", "strike")}>
        <g transform="translate(${-wgx * wp} ${-wgy * wp})">${spr("weapon", wid, { shiny: wpn.shiny, attrs: `width="${wsz.w * wp}" height="${wsz.h * wp}"` })}</g></g></g>
      </g></g></g></g></g>`;
  // Heldenwerte unter den Füßen
  const P = c.player;
  const heroHud = `<g>${bar(HERO.x - 28, HERO.feet + 5, 56, P.hp / P.maxHp, "#58d68d")}${text(`${P.hp}/${P.maxHp}`, HERO.x, HERO.feet + 21, "hp")}
    ${P.block > 0 ? `${icon("shield", HERO.x - 44, HERO.feet - 2, 1)}${text(String(P.block), HERO.x - 33, HERO.feet + 14, "blk")}` : ""}
    ${Object.entries(P.statuses).filter(([, v]) => v > 0).map(([k, v], i) => `${icon(STATUS[k]?.[0] ?? "star", HERO.x + 32 + i * 22, HERO.feet - 2, 1)}${text(String(v), HERO.x + 41 + i * 22, HERO.feet + 14, "num")}`).join("")}</g>`;

  // ---- Gegner (hinten zuerst zeichnen)
  const entList = [...c.enemies].sort((a, bb) => layout[a.uid].y - layout[bb.uid].y).map((e) => {
    const p = layout[e.uid], def = CONTENT.enemies[e.id], m = def.mechanics ?? {};
    const el = m.rotateElement ? e.elements[0] : null;
    const s = enemyPx(e.id), z = sprSize("enemy", e.id, { element: el });
    const w = z.w * s, h = z.h * s, x0 = p.x - w / 2, y0 = p.y - h;
    const dead = e.hp <= 0, dying = dead && killed.has(e.uid);
    const target = targetable.has(e.uid) && !dead;
    const focusable = !dead && !target, isFocus = focus === e.uid && !dead;
    const intent = dead ? null : intentOf(c, e);
    const enterCls = enter && !summoned.has(e.uid) ? " enter-r" : summoned.has(e.uid) ? " enter-r" : "";
    const bw = Math.max(34, Math.min(60, w * 0.8));
    const ael = e.elements?.[0];                                                  // Elementar-Aura hinter dem Gegner, beim Boss stärker
    const aura = ael ? `<ellipse class="aura" cx="${w / 2}" cy="${h * 0.56}" rx="${w * 0.66}" ry="${h * 0.6}" fill="url(#eg_${ael})" opacity="${m.rotateElement ? 1 : 0.7}"/>` : "";
    const shadow = `<ellipse cx="${w / 2}" cy="${h - 1}" rx="${w * 0.42}" ry="4.5" fill="#000" opacity=".42"/>`;
    const sts = Object.entries(e.statuses).filter(([, v]) => v > 0).slice(0, 4);
    const ibox = intent ? `<g transform="translate(${p.x - 18} ${y0 - 17})"><rect width="36" height="14" rx="3" fill="#17121f" stroke="${intent.type === "attack" ? "#c73c3c" : "#4a7fd0"}" stroke-width="1.5"/>
        ${icon(intent.type === "attack" ? "sword" : intent.type === "skip" ? (intent.frozen ? "snow" : "wind") : "shield", 3, 2, 1)}${text(intent.type === "attack" ? `${intent.value}${(intent.hits ?? 1) > 1 ? "x" + intent.hits : ""}` : intent.type === "skip" ? (intent.frozen ? "Eis" : "Aus") : String(intent.value), 15, 11, "int")}</g>` : "";
    const platesTxt = m.plates && !dead ? `<g transform="translate(${p.x - 22} ${y0 - 33})"><rect width="44" height="13" rx="3" fill="#17121f" stroke="#8fa3b8"/>${icon("shield", 2, 1, 1)}${text(e.plates > 0 ? `Platten ${e.plates}` : "gebrochen", 14, 10, "plt")}</g>` : "";
    const rot = m.rotateElement && !dead ? `<g transform="translate(${p.x + 22} ${y0 - 17})"><rect width="38" height="14" rx="3" fill="#17121f" stroke="#c9b8ff" stroke-width="1.5"/>${icon(elementIconId(e.nextElement), 3, 2, 1)}${text(`in ${Math.max(1, m.rotateElement.every - e.rotTimer)}`, 14, 11, "int")}</g>` : "";
    const elIcon = (e.elements ?? []).slice(0, 2).map((el2, i) => icon(elementIconId(el2), p.x - bw / 2 - 12 - i * 11, p.y + 1, 1)).join("");
    const body = `<g class="ent enemy${dead ? (dying ? " dying" : " gone") : ""}${target ? " targetable" : ""}${focusable ? " focusable" : ""}${e.shiny ? " shiny" : ""}"${target ? ` data-action="target" data-arg="${e.uid}"` : focusable ? ` data-action="focus" data-arg="${e.uid}"` : ""}>
      <rect x="${x0 - 8}" y="${y0 - 20}" width="${w + 16}" height="${h + 52}" fill="transparent" ${target || focusable ? 'pointer-events="all"' : 'pointer-events="none"'}/>
      <g class="pos" transform="translate(${x0} ${y0})"><g class="mover${enterCls}${anim(e.uid, "strike", " strike-enemy")}" ${enter || summoned.has(e.uid) ? `style="--d:${(0.15 * (e.uid.length % 5)).toFixed(2)}s"` : del(e.uid, "strike")}>
        ${shadow}${aura}<g class="flash${anim(e.uid, "hit", " hitflash")}" ${del(e.uid, "hit")}><g class="shake${anim(e.uid, "hit", " hitshake")}" ${del(e.uid, "hit")}><g class="bob mv-${ENEMY_MOTION[e.id] ?? "none"}">
        ${spr("enemy", e.id, { shiny: e.shiny, element: el, attrs: `width="${w}" height="${h}"` })}</g></g></g></g></g></g>`;
    const ui = dead ? "" : `<g class="entui" pointer-events="none">${e.shiny ? sparkles(p.x, y0 + h / 2, w, h) : ""}${bar(p.x - bw / 2, p.y + 3, bw, e.hp / e.maxHp)}${text(`${e.hp}`, p.x, p.y + 19, "hp")}
      ${e.block > 0 ? `${icon("shield", p.x + bw / 2 + 1, p.y - 2, 1)}${text(String(e.block), p.x + bw / 2 + 12, p.y + 7, "blk")}` : ""}${elIcon}
      ${sts.map(([k, v], i) => `${icon(STATUS[k]?.[0] ?? "star", p.x - sts.length * 11 + i * 22, p.y + 21, 1)}${text(String(v), p.x - sts.length * 11 + i * 22 + 10, p.y + 31, "num")}`).join("")}
      ${ibox}${platesTxt}${rot}${target || isFocus ? `<g class="ptr${isFocus && !target ? " focusmark" : ""}" transform="translate(${p.x - 8} ${y0 - 44})">${icon("pointer", 0, 0, 1.6)}</g>` : ""}</g>`;
    return { body, ui };
  });
  const ents = entList.map((x) => x.body).join("") + entList.map((x) => x.ui).join("");   // erst alle Figuren, dann alle Anzeigen darüber

  // ---- Effekte: Geschosse, Hiebe, Zahlen
  const fxLayer = shots.map((s) => {
    const to = layout[s.uid]; if (!to) return "";
    const fromX = HERO.x + 34, fromY = HERO.feet - 52, dx = to.x - fromX, dy = (to.y - 40) - fromY;
    if (s.style === "slash") return `<g transform="translate(${to.x - 24} ${to.y - 66})"><g class="slash" style="--d:${(s.t + 0.2).toFixed(2)}s">${spr("icon", "fx_slash", { attrs: 'width="48" height="48"' })}</g></g>`;       // Position außen, Animation innen (sonst springt der Strich nach oben links)
    const body = s.style === "shoot" ? spr("icon", "fx_arrow", { attrs: 'width="30" height="11"' }) : spr("icon", "fx_orb", { attrs: 'width="22" height="22"', pal: s.element ? { b: elementColor(s.element), c: "#ffffff" } : undefined });
    return `<g transform="translate(${fromX} ${fromY})"><g class="shot" style="--dx:${Math.round(dx)}px;--dy:${Math.round(dy)}px;--d:${(s.t + 0.1).toFixed(2)}s"><g transform="translate(-12 -6)">${body}</g></g></g>`;
  }).join("");
  const floatsSvg = floats.map((f, i) => text(f.text, Math.round(f.x), Math.round(f.y), `float ${f.cls}`, `style="--d:${(f.t + i * 0.03).toFixed(2)}s"`)).join("");

  return `<svg class="scene-svg" viewBox="${-ext} 0 ${W + 2 * ext} ${H}" preserveAspectRatio="xMidYMax meet" role="img" aria-label="Kampfszene">${backdrop(b, "", { ext })}${ents}${hero}${heroHud}${fxLayer}${floatsSvg}</svg>`;
}

// ---------------------------------------------------------------- Intro (Geschichte): Held steht links, Figur kommt von rechts herein
function introScene({ run, speaker, first, ext = 0 }) {   // die Sprechblase zeichnet storyView als Fenster darüber
  const b = BIOMES[0], cls = run.classId, sz = sprSize("hero", cls), s = heroPx(cls, "intro");
  const npc = sprSize("npc", speaker.id), ns = npcPx(speaker.id);
  const hx = 90, hfeet = 190, nx = 270;
  const wid = run.weapon.replace(/:s$/, ""), wsz = sprSize("weapon", wid), [hx2, hy2] = handOf(cls), wp = weaponPx(wid), [wgx, wgy] = weaponGrip(wid);
  return `<svg class="scene-svg" viewBox="${-ext} 0 ${W + 2 * ext} ${H}" preserveAspectRatio="xMidYMax meet" role="img" aria-label="Geschichte">${backdrop(b, "i", { ext })}
    <g class="pos" transform="translate(${hx - (sz.w * s) / 2} ${hfeet - sz.h * s})"><g class="bob mv-none">${spr("hero", cls, { shiny: run.shinyHero, pal: skinPal(run.skin), attrs: `width="${sz.w * s}" height="${sz.h * s}"` })}
      <g transform="translate(${hx2 * s} ${hy2 * s})"><g class="wpn idle-wpn"><g transform="translate(${-wgx * wp} ${-wgy * wp})">${spr("weapon", wid, { shiny: CONTENT.get("weapons", run.weapon).shiny, attrs: `width="${wsz.w * wp}" height="${wsz.h * wp}"` })}</g></g></g></g></g>
    <g class="pos" transform="translate(${nx - (npc.w * ns) / 2} ${hfeet - npc.h * ns})"><g class="mover${first ? " enter-npc" : ""}"><g class="bob mv-none">${spr("npc", speaker.id, { attrs: `width="${npc.w * ns}" height="${npc.h * ns}"` })}</g></g></g>
  </svg>`;
}

// ---------------------------------------------------------------- Menü-/Auswahl-Hintergrund (nur Kulisse)
const menuBackdrop = (ext = 0) => `<svg class="scene-svg" viewBox="${-ext} 0 ${W + 2 * ext} ${H}" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${backdrop(BIOMES[0], "m", { ext, noProps: true })}</svg>`;


// Held mit Waffe in der Hand als Standbild (Auswahl, Vorschau)
function heroPortrait(cls, weaponId, skinId = "default") {
  const sz = sprSize("hero", cls), [hx, hy] = handOf(cls), wsz = sprSize("weapon", weaponId), ws = weaponPx(weaponId) / heroPx(cls), [wgx, wgy] = weaponGrip(weaponId);
  return `<svg class="portrait" viewBox="0 0 ${sz.w + 10} ${sz.h}" shape-rendering="crispEdges" role="img" aria-label="${esc(cls)}">
    ${spr("hero", cls, { pal: skinPal(skinId), attrs: `x="0" y="0" width="${sz.w}" height="${sz.h}"` })}
    <g transform="translate(${hx} ${hy}) rotate(16)"><g transform="translate(${-wgx * ws} ${-wgy * ws})">${spr("weapon", weaponId, { attrs: `width="${wsz.w * ws}" height="${wsz.h * ws}"` })}</g></g></svg>`;
}

__exports.cardIconId = cardIconId;
__exports.W = W;
__exports.biomeFor = biomeFor;
__exports.layoutEnemies = layoutEnemies;
__exports.combatScene = combatScene;
__exports.introScene = introScene;
__exports.menuBackdrop = menuBackdrop;
__exports.heroPortrait = heroPortrait;

});
__define("ui/views.js", function (__exports, __require) {
// Ansichten: reine Funktionen, die HTML-Strings aus dem UI-Zustand erzeugen (kein DOM, daher in Node testbar).
const { keywordsOf } = __require("ui/glossary.js");
const { CONTENT } = __require("content/index.js");
const { CONFIG } = __require("data/config.js");
const { aliveEnemies, activeItems } = __require("engine/combat.js");
const { availableNodes, buildOf, currentLayer, restHealAmount, restPct } = __require("engine/run.js");
const { lane: mapLane } = __require("engine/map.js");
const { findNode } = __require("engine/map.js");
const { tagCount } = __require("engine/modifiers.js");
const { abilityAt } = __require("engine/abilities.js");
const { abilityForm } = __require("engine/combat.js");
const { abilityProgress } = __require("engine/meta.js");
const { maxDifficulty, describeUnlock, isUnlocked } = __require("engine/meta.js");
const { dexProgress } = __require("engine/dex.js");
const { storyLines, storySpeaker } = __require("engine/story.js");
const { CORE_STATS, STAT_LABELS, STAT_DESC, STAT_ICON, fmtVal, fmtStat, TIER_NAME, TIER_COLOR, NODE_INFO } = __require("ui/theme.js");
const { xpNeed } = __require("engine/run.js");
const { reactionText } = __require("ui/util.js");
const { esc, needsTarget, describeWeapon, describeItem, skinPal, activeSkin, activeFrame } = __require("ui/util.js");
const { achInfoView, achievementsView, cosmeticsView } = __require("ui/achview.js");
const { spr, elementIconId } = __require("ui/art/index.js");
const { NODE_ICON, NODE_NAME, STATUS, RARITY, elementName } = __require("ui/theme.js");
const { at, ico, btn, ibtn, bar, pctOf, cardHtml, itemHtml, itemIcon, statusChips, logo } = __require("ui/widgets.js");
const { combatScene, introScene, menuBackdrop, heroPortrait } = __require("ui/scene.js");

// ---------------------------------------------------------------- Kopfzeile im Run
// Breite der Kulisse: wie viel zusätzliche Wand links und rechts nötig ist, damit die Szene den Bereich (Höhe areaH) ausfüllt
const sceneExt = (ui, areaH) => Math.max(0, Math.round((232 * ((ui.stageW ?? 800) / areaH) - 400) / 2));

function hud(ui) {
  const run = ui.run, cls = CONTENT.classes[run.classId];
  const inFight = run.phase === "combat" && run.pending?.combat, hpNow = inFight ? run.pending.combat.player.hp : run.hp, hpMax = inFight ? run.pending.combat.player.maxHp : run.maxHp;     // im Kampf gilt die Kampf-HP sofort
  const where = `Stage ${run.stage}/${CONFIG.stages.count} · ` + (run.nodeId === "boss" ? (run.stage >= CONFIG.stages.count ? "Endboss" : "Wächter") : run.nodeId ? `Ebene ${Math.min(currentLayer(run) + 1, CONFIG.map.layers)}/${CONFIG.map.layers}` : "Start");
  return `<div class="hud"><div class="hud-l">${ico("heart", 18)}<span class="hudhp">${hpNow}/${hpMax}</span>${ico("coin", 18)}<b class="gold">${run.gold}</b><span class="xpbar" title="Erfahrung"><b>St. ${run.level + 1}</b><i style="width:${Math.round((100 * run.xp) / xpNeed(run.level))}%"></i></span></div>
    <div class="hud-m">${esc(cls.name)} · ${esc(CONFIG.difficulty[run.difficulty].name)} · ${where}</div>
    <div class="hud-r">${ibtn("pile", "show-deck", "Deck", `<span class="cnt">${run.deck.length}</span>`)}${ibtn("bag", "show-items", "Ausrüstung", `<span class="cnt">${run.items.length + 1}</span>`)}${ibtn("menu", "show-menu", "Menü")}</div></div>`;
}

// ---------------------------------------------------------------- Titel
const SIZE_NAMES = { normal: "Normal", gross: "Groß", riesig: "Sehr groß" };
function titleView(ui) {
  const m = ui.meta;
  return `<div class="screen title"><div class="bgscene">${menuBackdrop(sceneExt(ui, ui.stageH ?? 400))}</div>
    <div class="title-body"><div class="title-l">${logo()}<div class="tag">Ein Anime-Roguelite-Deckbuilder</div></div>
      <div class="title-r"><div class="menu-buttons">${ui.hasSave ? btn("Run fortsetzen", "continue", undefined, { cls: "good big" }) : ""}
        ${btn("Neuer Run", "new-run", undefined, { cls: "primary big" })}${btn("Erfolge", "show-achievements", undefined, { cls: "big" })}${btn("Aussehen", "show-cosmetics", undefined, { cls: "big" })}${btn("Sammlung", "show-collection", undefined, { cls: "big" })}${btn("Fähigkeiten", "show-abilities", undefined, { cls: "big" })}</div>
        <div class="row wrap center">${btn("Einstellungen", "open-settings", undefined, { cls: "small" })}</div>
        <div class="muted center small">Siege ${m.wins} · Runs ${m.runs} · Shinys ${Object.keys(m.dex.shiny).length}</div>
        <div class="muted center small">Version ${esc(CONFIG.version)}</div></div></div></div>`;
}

// ---------------------------------------------------------------- Charakter- und Waffenwahl
function setupView(ui) {
  const st = ui.setup, classes = Object.values(CONTENT.classes), cur = CONTENT.classes[st.classId];
  const bg = `<div class="bgscene">${menuBackdrop(sceneExt(ui, ui.stageH ?? 400))}</div>`;
  if (st.step === 2) {                                                                     // Startdeck zusammenstellen: 4 Züge, je 3 Karten
    const total = CONFIG.draft.rounds, n = st.picks.length, done = n === total;
    const slots = Array.from({ length: total }, (_, i) => st.picks[i] ? `<div class="dslot on">${esc(CONTENT.get("cards", st.picks[i]).name)}</div>` : `<div class="dslot">${i + 1}</div>`).join("");
    const body = done
      ? `<div class="muted small">Dein Startdeck steht. Mit Aufbrechen beginnt der Run.</div>${btn("Aufbrechen", "start-run", undefined, { cls: "primary big" })}${btn("Neu wählen", "draft-reset", undefined, { cls: "small" })}`
      : `<div class="cards3 dcards">${st.offer.map((id, i) => `<div class="slot">${cardHtml(CONTENT.get("cards", id), { size: "lg" })}${btn("Nehmen", "draft-pick", String(i), { cls: "small good" })}</div>`).join("")}</div>`;
    return `<div class="screen setup">${bg}<div class="setup-body"><div class="setup-head"><h2>Dein Startdeck: Karte ${Math.min(n + 1, total)} von ${total}</h2><div class="row">${btn("Zurück", "setup-back", undefined, { cls: "small" })}${done ? "" : btn("Empfohlenes Deck", "draft-recommended", undefined, { cls: "small" })}</div></div>
      <div class="dslots">${slots}</div><div class="stack center dbody">${body}</div></div></div>`;
  }
  if (st.step === 0) {
    const card = (c) => {
      const open = isUnlocked(ui.meta, "classes", c), on = st.classId === c.id;
      const body = open
        ? `<div class="stats"><span>${ico("heart", 12)}${c.hp}</span><span>${ico("pile", 12)}${CONFIG.player.handSize + (c.stats.handSize ?? 0)}</span><span>${ico("bolt", 12)}${CONFIG.player.startEnergy + (c.stats.energy ?? 0)}</span></div>
           <div class="perks">${c.perks.map((p) => `<div class="${p.startsWith("+") ? "plus" : "minus"}">${esc(p)}</div>`).join("")}</div>`
        : `<div class="lockhint">${ico("lock", 14)} Gesperrt<br><span class="muted small">${esc(describeUnlock(c.unlock))}</span></div>`;
      return `<div class="herocard2 px ${on ? "on" : ""} ${open ? "" : "locked"}"${at("pick-class", c.id)} title="${esc(open ? c.blurb ?? "" : "Gesperrt")}">
        <div class="hc-art">${heroPortrait(c.id, c.weapon, activeSkin(ui.meta, c.id))}</div><div class="hc-body"><b>${esc(open ? c.name : "???")}</b>${body}</div></div>`;
    };
    return `<div class="screen setup">${bg}<div class="setup-body"><div class="setup-head"><h2>Wähle deinen Helden</h2><div class="row">${btn("Zurück", "setup-back", undefined, { cls: "small" })}${btn("Weiter", "setup-next", undefined, { cls: "primary" })}</div></div>
      <div class="herogrid6">${classes.map(card).join("")}</div></div></div>`;
  }
  const maxD = maxDifficulty(ui.meta, cur.id);
  const sig = (w) => (w.signature === cur.id ? "Dein Held" : esc(CONTENT.classes[w.signature]?.name ?? ""));
  return `<div class="screen setup">${bg}<div class="setup-body"><div class="setup-head"><h2>Wähle deine Waffe</h2><div class="row">${btn("Zurück", "setup-back", undefined, { cls: "small" })}${btn("Weiter", "setup-draft", undefined, { cls: "primary" })}</div></div>
    <div class="weapongrid2"><div class="hero-big px">${heroPortrait(cur.id, st.weaponId, activeSkin(ui.meta, cur.id))}<b>${esc(cur.name)}</b></div>
      <div class="wcol"><div class="wgrid">${cur.starterWeapons.map((id) => { const w = CONTENT.get("weapons", id);
        return `<div class="wtile ${st.weaponId === id ? "on" : ""}"${at("pick-weapon", id)}><span class="wico">${spr("weapon", id, { attrs: 'width="100%" height="100%"' })}</span><span class="wname"><b>${esc(w.name)}</b><small class="${w.signature === cur.id ? "own" : ""}">${sig(w)}</small></span></div>`; }).join("")}</div>
        ${(() => { const w = CONTENT.get("weapons", st.weaponId), r = RARITY[w.rarity] ?? RARITY.gewoehnlich;
          return `<div class="wdetail px"><span class="wico big">${spr("weapon", st.weaponId, { attrs: 'width="100%" height="100%"' })}</span><div><b>${esc(w.name)}</b> <span class="rar" style="color:${r[1]}">${esc(r[0])} · Signatur: ${esc(CONTENT.classes[w.signature]?.name ?? "-")}</span><div>${esc(describeWeapon(w))}</div></div></div>`; })()}
        <div class="optsbar px"><div class="optrow"><b>Schwierigkeit</b><div class="chips">${CONFIG.difficulty.map((d, i) => i <= maxD
          ? `<span class="chip ${st.difficulty === i ? "on" : ""}"${at("set-diff", String(i))}>${esc(d.name)}</span>` : `<span class="chip lock">${ico("lock", 12)} ${esc(d.name)}</span>`).join("")}</div></div>
          <div class="optrow"><b>Seed</b><input class="seed" inputmode="numeric" placeholder="Zufall" value="${esc(st.seed)}" data-change="set-seed" readonly autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="done"></div>
          ${cur.abilities.length ? `<div class="optrow abil"><b>Fähigkeit</b><div class="chips">${cur.abilities.map((id) => `<span class="chip ${st.abilityId === id ? "on" : ""}"${at("pick-ability", id)}>${esc(CONTENT.abilities[id].name)} · St. ${abLevel(ui.meta, id)}</span>`).join("")}</div></div><div class="muted small optnote abtext">${esc(abilityAt(st.abilityId, abLevel(ui.meta, st.abilityId)).text)}</div>` : ""}
          <div class="muted small optnote">Jede Waffe ist frei wählbar und passt zu einem Helden am besten. Bessere Waffen findest du später, zum Beispiel nach dem Mini-Boss.</div></div></div></div></div></div>`;
}

// ---------------------------------------------------------------- Geschichte
function storyView(ui) {
  const run = ui.run, lines = storyLines("intro", run.classId), sp = storySpeaker("intro");
  const i = Math.min(ui.storyIdx, lines.length - 1), last = i === lines.length - 1;
  const bubble = `<div class="who">${esc(sp.name)} <small>${esc(sp.title ?? "")}</small></div><p>${esc(lines[i])}</p>
    <div class="bubble-foot"><span class="dots">${lines.map((_, k) => `<i class="${k <= i ? "on" : ""}"></i>`).join("")}</span>${btn(last ? "Los geht's" : "Weiter", "story-next", undefined, { cls: "primary small" })}</div>`;
  return `<div class="screen story"><div class="scene">${introScene({ run, speaker: sp, first: i === 0, ext: sceneExt(ui, ui.stageH ?? 400) })}</div>
    <div class="bubble storybubble${i === 0 ? " late" : ""}">${bubble}</div>
    <div class="storybar">${btn("Überspringen", "story-skip", undefined, { cls: "small" })}</div></div>`;
}

// ---------------------------------------------------------------- Karte (Querformat: waagerecht, Hochformat: senkrecht)
function mapView(ui) {
  const run = ui.run, map = run.map, L = map.layers.length, land = true;
  const path = run.path ?? [], avail = run.phase === "map" ? availableNodes(run) : [];
  const SP = 66, PAD = 40, SPAN = 270;
  const W = land ? (L + 1) * SP + PAD * 2 : 340, H = land ? SPAN : (L + 1) * SP + PAD * 2;
  const pos = (n) => {
    const count = n.id === "boss" ? 1 : map.layers[n.layer].length;
    const lane = mapLane(count, n.index);
    return { x: PAD + n.layer * SP, y: 26 + lane * (SPAN - 52) };
  };
  const nodes = [...map.layers.flat(), map.boss];
  const reach = new Set(), stack = [...avail];                                  // von hier aus noch erreichbare Orte (alles andere ist für diese Route verloren)
  if (!stack.length && run.nodeId) stack.push(...findNode(map, run.nodeId).next);
  while (stack.length) { const id = stack.pop(); if (reach.has(id)) continue; reach.add(id); stack.push(...(findNode(map, id)?.next ?? [])); }
  const edges = nodes.flatMap((n) => n.next.map((id) => {
    const a = pos(n), b = pos(findNode(map, id)), on = path.includes(n.id) && (path.includes(id) || avail.includes(id)), soft = !on && avail.includes(n.id), gone = !on && !soft && !(reach.has(id) || reach.has(n.id));
    return `<line class="edge ${on ? "on" : soft ? "soft" : gone ? "gone" : ""}" x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}"/>`;
  })).join("");
  const plates = nodes.map((n) => {
    const p = pos(n), isAvail = avail.includes(n.id), done = path.includes(n.id), cur = run.nodeId === n.id, r = n.type === "boss" ? 24 : 18;
    return `<g class="node ${isAvail ? "avail" : done ? "done" : reach.has(n.id) ? "dim" : "gone"} ${cur ? "cur" : ""}"${isAvail ? at("node", n.id) : at("node-info", n.type)}><title>${NODE_NAME[n.type]}</title>
      <circle cx="${p.x}" cy="${p.y}" r="${r}"/>${spr("icon", NODE_ICON[n.type], { attrs: `x="${p.x - r * 0.75}" y="${p.y - r * 0.75}" width="${r * 1.5}" height="${r * 1.5}"` })}</g>`;
  }).join("");
  const here = run.nodeId ? pos(findNode(map, run.nodeId)) : null;
  const hero = here ? `<g class="mapHero" transform="translate(${here.x - 10} ${here.y - 52})">${spr("hero", run.classId, { shiny: run.shinyHero, pal: skinPal(run.skin), attrs: 'width="20" height="29"' })}</g>` : "";
  return `${hud(ui)}<div class="screen mapscreen"><div class="maphead"><h3>${run.nodeId ? "Wohin als Nächstes?" : "Der Weg beginnt"}</h3><span class="muted small">Leuchtende Orte sind erreichbar. Tippe auf ein Symbol für Infos.</span>
    <span class="grow"></span><div class="legend">${Object.entries(NODE_ICON).map(([k, v]) => `<span${at("node-info", k)}>${ico(v, 14)}${NODE_NAME[k]}</span>`).join("")}</div></div>
    <div class="mapwrap"><svg class="mapsvg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Gate-Karte">${edges}${plates}${hero}</svg></div></div>`;
}

// ---------------------------------------------------------------- Kampf
function combatView(ui) {
  const run = ui.run, c = run.pending.combat, P = c.player, build = c.build;
  const alive = aliveEnemies(c), hand = c.piles.hand;
  const sel = ui.selected !== null ? hand[ui.selected] : null;
  const affordable = sel && sel.def.cost <= P.energy;
  const wantsTarget = sel && needsTarget(sel.def) && alive.length > 1 && affordable;
  const targetable = new Set(wantsTarget ? alive.map((e) => e.uid) : []);
  const maxEnergy = CONFIG.player.startEnergy + build.stats.energy;
  const pips = Array.from({ length: Math.max(maxEnergy, P.energy) }, (_, i) => `<span class="pip ${i < P.energy ? "on" : ""}">${ico("bolt", 18)}</span>`).join("");
  const info = sel ? `<div class="cardinfo px"><div class="ci-head"><b>${esc(sel.def.name)}</b><span class="ci-cost">${ico("bolt", 14)}${sel.def.cost}</span></div><div class="ci-text">${esc(sel.def.text ?? "")}</div>
      <div class="row">${wantsTarget ? `<span class="grow ci-hint">${ico("pointer", 14)} Tippe einen Gegner an</span>` : btn(affordable ? "Spielen" : "Zu wenig Energie", "play-selected", undefined, { cls: "primary grow small", disabled: !affordable })}
        ${btn("Abbrechen", "select-card", String(ui.selected), { cls: "small" })}</div></div>` : "";
  const ab = c.ability, abBtn = ab ? `<button class="abilitybtn${ab.cd === 0 && !c.result ? " ready" : ""}"${ab.cd > 0 || c.result ? " disabled" : at("use-ability")} title="${esc(ab.def.text)}" aria-label="${esc(ab.def.name)}">${ico(ab.def.icon ?? "bolt", 22)}<span class="abname">${esc(ab.def.name)}${ab.def.forms ? `<small> · ${esc(abilityForm(ab).name)}</small>` : ""}</span><span class="abcd">${ab.cd === 0 ? "BEREIT" : ab.cd}</span></button>` : "";
  const fieldBadge = c.field ? `<div class="fieldbadge">${esc(c.field.name)} · ${c.field.turnsLeft}</div>` : "";
  const acts = activeItems(c);
  const actives = acts.length || ab ? `<div class="actives">${abBtn}${acts.map((a) => {
    const off = a.used || a.def.cost > P.energy || Boolean(c.result);
    return `<button class="activebtn${a.used ? " used" : ""}"${off ? " disabled" : at("use-item", String(a.index))} title="${esc(a.item.text ?? a.item.name)}" aria-label="${esc(a.item.name)}">${itemIcon(a.item, 30)}<span class="acost">${ico("bolt", 11)}${a.def.cost}</span>${a.used ? '<span class="aused">benutzt</span>' : ""}</button>`;
  }).join("")}</div>` : "";
  const logLines = c.log.slice(ui.showLog ? -30 : -0).map((l) => `<div class="${l.includes("***") ? "hit" : ""}">${esc(l.trim())}</div>`).join("");
  const ext = sceneExt(ui, (ui.stageH ?? 400) - 148);
  return `${hud(ui)}<div class="screen combat"><div class="scene${c.field ? " field-on" : ""}">${fieldBadge}${combatScene({ run, c, fx: ui.fx, enter: ui.enter, targetable, focus: ui.focus, ext, victory: ui.victory })}${actives}${info}
      <div class="side left"><div class="piles"><span class="pile" title="Nachziehstapel">${ico("pile", 16)}<b>${c.piles.draw.length}</b></span><span class="pile" title="Ablagestapel">${ico("discard", 16)}<b>${c.piles.discard.length}</b></span></div>
        ${btn(ui.auto ? "Auto: an" : "Auto", "toggle-auto", undefined, { cls: `small ${ui.auto ? "good" : ""}`, disabled: Boolean(c.result) })}${btn(`Tempo x${ui.speed}`, "cycle-speed", undefined, { cls: "small" })}</div>
      <div class="side right"><div class="energy">${pips}</div>${btn("Zug beenden", "end-turn", undefined, { cls: "primary", disabled: Boolean(c.result) || ui.auto })}${btn(ui.showLog ? "Log aus" : "Log", "toggle-log", undefined, { cls: "small" })}</div>
      ${ui.showLog ? `<div class="logpanel px">${logLines}</div>` : ""}</div>
    <div class="handrow"><div class="hand" style="--n:${hand.length}">${hand.map((inst, i) => cardHtml(inst.def, { build, plays: c.playsThisTurn, ctx: { hp: P.hp, maxHp: P.maxHp, gold: c.gold }, selected: ui.selected === i, dim: inst.def.cost > P.energy, action: "select-card", arg: String(i), keepIdx: i, kept: Boolean(inst.keep) })).join("") || "<span class='muted pad'>Keine Karten auf der Hand</span>"}</div></div></div>
    ${ui.victory ? `<div class="victorybanner">Sieg!</div>` : ""}${c.result && !ui.victory ? `<div class="overlay"><div class="sheet mid center stack"><h2>${c.result === "won" ? "Sieg!" : "Niederlage"}</h2>
      ${c.shinyKills.length ? `<div class="shiny sh px pad"><b>Chrom-Gegner besiegt!</b><br>Bonus: +${CONFIG.shiny.enemyGold} Gold, ein seltenes Chrom-Item und eine Chrom-Waffe zur Wahl.</div>` : ""}${btn("Weiter", "after-combat", undefined, { cls: "primary" })}</div></div>` : ""}`;
}

// ---------------------------------------------------------------- Belohnung
function rewardView(ui) {
  const run = ui.run, r = run.pending.reward, t = r.taken, build = buildOf(run), cur = CONTENT.get("weapons", run.weapon);
  // Eine Kategorie pro Reiter: so sieht man jede Auswahl in Ruhe, ohne zu scrollen (auch bei Chrom-Beute)
  const cats = [];
  if (r.levelChoices?.length) cats.push({ key: "level", label: "Aufstieg", kind: "level", title: `Stufe ${run.level + 1}: Wert-Aufstieg wählen${run.pendingLevels > 1 ? ` (${run.pendingLevels} offen)` : ""}`, cls: "good" });
  if (r.shinyItems.length) cats.push({ key: "shinyItems", label: "Chrom-Item", kind: "items", ids: r.shinyItems, title: "Chrom-Fund: Item (wähle 1)", cls: "chrome" });
  if (r.shinyWeapons?.length) cats.push({ key: "shinyWeapons", label: "Chrom-Waffe", kind: "weapons", ids: r.shinyWeapons, title: `Chrom-Fund: Waffe (aktuell: ${cur.name}, Stärke ${cur.power})`, cls: "chrome" });
  cats.push({ key: "cards", label: "Karte", kind: "cards", ids: r.cards, title: "Karte wählen (oder überspringen)" });
  if (r.items.length) cats.push({ key: "items", label: "Item", kind: "items", ids: r.items, title: "Item wählen" });
  if (r.weapons.length) cats.push({ key: "weapons", label: "Waffe", kind: "weapons", ids: r.weapons, title: `Waffe tauschen? (aktuell: ${cur.name}, Stärke ${cur.power})` });
  const sel = cats.find((c) => c.key === ui.tab.reward) ?? cats.find((c) => !t[c.key]) ?? cats[0];
  const slots = sel.kind === "level"
    ? `<div class="items3 lv4">${r.levelChoices.map((c, i) => `<div class="slot"><div class="itemcard upg" style="--rar:${TIER_COLOR[c.tier]}"><div class="i-body"><b>${ico(STAT_ICON[c.stat], 18)} ${fmtStat(c.stat, c.value)}</b><span class="rar" style="color:${TIER_COLOR[c.tier]}">Stufe ${TIER_NAME[c.tier]}</span><span class="d">${esc(STAT_DESC[c.stat])}</span></div></div>${btn("Nehmen", "take-level", String(i), { cls: "small good" })}</div>`).join("")}</div>`
    : sel.kind === "cards"
    ? `<div class="cards3">${sel.ids.map((id, i) => `<div class="slot">${cardHtml(CONTENT.get("cards", id), { size: "lg", build })}${btn(t.cards ? "Gewählt" : "Nehmen", "take", "cards", { arg2: String(i), cls: "small good", disabled: t.cards })}</div>`).join("")}</div>`
    : `<div class="items3">${sel.ids.map((id, i) => `<div class="slot">${itemHtml(CONTENT.get(sel.kind, id), sel.kind)}${btn(t[sel.key] ? "Gewählt" : "Nehmen", "take", sel.key, { arg2: String(i), cls: "small good", disabled: t[sel.key] })}</div>`).join("")}</div>`;
  const tabs = cats.length > 1 ? `<div class="tabs">${cats.map((c) => `<span class="tab ${c.key === sel.key ? "on" : ""}"${at("set-tab", "reward", c.key)}>${t[c.key] ? "✓ " : ""}${c.label}</span>`).join("")}</div>` : "";
  return `${hud(ui)}<div class="screen reward"><div class="rw-head"><h2>Beute</h2><div class="gold row">${ico("coin", 16)}<b>+${r.gold} Gold</b>${r.shinyBonus ? `<span class="chrome small">&nbsp;(+${r.shinyBonus} Chrom)</span>` : ""}${r.overkillGold ? `<span class="muted small">&nbsp;Überschuss +${r.overkillGold}</span>` : ""}${r.midas ? `<span class="chrome small">&nbsp;(Midas x2)</span>` : ""}${r.harvest ? `<span class="muted small">&nbsp;Ernte +${r.harvest}</span>` : ""}</div>${tabs}<span class="grow"></span>${btn("Weiter", "finish-reward", undefined, { cls: "primary" })}</div>
    <div class="rw-body"><h3 class="${sel.cls ?? ""}">${esc(sel.title)}</h3>${slots}</div></div>`;
}

// ---------------------------------------------------------------- Shop, Rast, Ereignis
function shopView(ui) {
  const run = ui.run, shop = run.pending.shop, build = buildOf(run);
  const cards = shop.cards.map((s, i) => `<div class="slot ${s.sold ? "sold" : ""}">${cardHtml(CONTENT.get("cards", s.id), { size: "lg", build })}
    ${btn(s.sold ? "Verkauft" : s.core ? "Gratis" : `${ico("coin", 14)} ${s.price}`, "buy", "cards", { arg2: String(i), cls: "small", disabled: s.sold || s.price > run.gold })}</div>`).join("");
  const items = shop.items.map((s, i) => `<div class="slot ${s.sold ? "sold" : ""} ${s.frozen ? "frozen" : ""}"><div class="itemwrap">${itemHtml(CONTENT.get("items", s.id))}<span class="c-info iinfo"${at("item-info", `items:${s.id}`)} role="button" aria-label="Details">i</span></div>
    <div class="buyrow">${btn(s.sold ? "Verkauft" : `${ico("coin", 14)} ${s.price}`, "buy", "items", { arg2: String(i), cls: "small", disabled: s.sold || s.price > run.gold })}${s.sold ? "" : run.flags?.noFreeze ? btn(ico("lock", 14), "freeze", String(i), { cls: "small lockbtn", disabled: true, title: "Midas-Fluch: Sperren ist dauerhaft deaktiviert" }) : btn(ico("lock", 14), "freeze", String(i), { cls: `small lockbtn ${s.frozen ? "good" : ""}`, title: s.frozen ? "Sperre aufheben" : "Item für die nächste Runde sperren" })}</div></div>`).join("");
  const brumm = shop.start ? storyLines("startladen", run.classId)[0] : null;
  const npc = brumm
    ? `<div class="shop-npc"><div class="npc">${spr("npc", "brumm", { attrs: 'width="46" height="62"' })}</div><div class="bubble static"><div class="who">${esc(CONTENT.speakers.brumm.name)}</div><p>${esc(brumm)}</p></div></div>`
    : `<div class="shop-npc plain"><div class="npcbox">${spr("icon", "n_haendler", { attrs: 'width="44" height="44"' })}</div></div>`;
  return `${hud(ui)}<div class="screen shop"><div class="shop-side">${npc}<h2>${shop.start ? "Startladen" : shop.quick ? "Schnellladen" : "Händler"}</h2><div class="muted">Dein Gold: <b class="gold">${run.gold}</b></div>
      <div class="muted small">Preise: ${run.stats.fights ? `+${Math.round(CONFIG.shop.inflationPerFight * run.stats.fights * 100)} % Inflation` : "Grundpreis"}</div>
      ${btn(`${ico("star", 14)} Neu würfeln (${shop.freeRerolls > 0 ? `gratis x${shop.freeRerolls}` : shop.rerollCost})`, "reroll", undefined, { cls: "small", disabled: !(shop.freeRerolls > 0) && run.gold < shop.rerollCost })}
      ${btn(`${ico("discard", 14)} Schredder (${shop.removeCost})`, "remove-start", undefined, { cls: "small", disabled: run.gold < shop.removeCost || run.deck.length <= CONFIG.run.minDeck })}
      ${(shop.services ?? []).map((s) => btn(`${ico(s.id === "heal" ? "heart" : "star", 14)} ${s.id === "heal" ? `Verband +${Math.round(CONFIG.shop.services.heal.pct * 100)}% HP` : `Trank +${CONFIG.shop.services.vitality.maxHp} Max-HP`} (${s.price})`, "service", s.id, { cls: "small", disabled: s.sold || run.gold < s.price })).join("")}
      <span class="grow"></span>${btn("Weiter", "leave-shop", undefined, { cls: "primary" })}</div>
    <div class="shop-main"><h3>Karten</h3><div class="cards5">${cards}</div><h3>Items</h3><div class="items4">${items}</div></div><div class="shop-spacer"></div></div>`;
}
function restView(ui) {
  const run = ui.run, heal = Math.min(run.maxHp - run.hp, restHealAmount(run, Math.ceil(run.maxHp * restPct(run))));
  return `${hud(ui)}<div class="screen rest"><div class="bigicon">${spr("icon", "n_rast", { attrs: 'width="110" height="110"', cls: "flick" })}</div>
    <div class="rest-r stack"><h2>Rastplatz</h2><div class="muted">Ein Feuer knistert. Du hast Zeit für genau eine Sache.</div>
    <div class="stack">${btn(`Ausruhen (+${heal} HP)`, "rest-heal", undefined, { cls: "good" })}${btn("Eine Karte aus dem Deck entfernen", "rest-remove-start", undefined, { disabled: run.deck.length <= CONFIG.run.minDeck })}</div></div></div>`;
}
function eventView(ui) {
  const run = ui.run, ev = CONTENT.events[run.pending.eventId];
  return `${hud(ui)}<div class="screen event"><div class="ev-l stack"><div class="bigicon">${spr("icon", "n_ereignis", { attrs: 'width="84" height="84"' })}</div><h2>${esc(ev.name)}</h2><div>${esc(ev.text)}</div></div>
    <div class="ev-r stack">${ev.choices.map((ch, i) => { const lack = ch.requires?.gold > run.gold;
      return btn(esc(ch.label) + (lack ? " (zu wenig Gold)" : ""), "event-choice", String(i), { disabled: lack }); }).join("")}</div></div>`;
}

// ---------------------------------------------------------------- Ende
function endView(ui) {
  const run = ui.run, s = run.summary, won = s.won, m = s.meta, outro = CONTENT.stories.outro, sp = CONTENT.speakers[outro?.speaker];
  const mira = won && outro ? `<div class="outro"><div class="npc">${spr("npc", outro.speaker, { attrs: 'width="58" height="82"' })}</div><div class="bubble static"><div class="who">${esc(sp.name)}</div>${storyLines("outro", run.classId).map((l) => `<p>${esc(l)}</p>`).join("")}</div></div>` : "";
  const ach = (s.achievements ?? []).map((id) => CONTENT.achievements[id].name);
  return `<div class="screen end"><div class="end-l stack"><h1>${won ? "Sieg! Der Gate-Lord ist gefallen." : "Der Run ist zu Ende."}</h1>${mira}</div>
    <div class="end-r stack"><div class="px pad left"><div>Klasse: <b>${esc(CONTENT.classes[run.classId].name)}</b> · ${esc(CONFIG.difficulty[run.difficulty].name)}</div>
      <div>Kämpfe: <b>${s.stats.fights}</b> · Orte: <b>${s.stats.nodes}</b> · Gold verdient: <b>${s.stats.goldEarned}</b></div>
      <div>Items: <b>${s.items}</b> · Deckgröße: <b>${s.deck}</b></div><div>Shinys gesehen: <b>${s.stats.shinyEnemies + s.stats.shinyLoot}</b> · Seed: <b>${run.seed}</b></div></div>
    ${m?.newDifficulty ? `<div class="px pad good"><b>Neue Schwierigkeit freigeschaltet: ${esc(m.newDifficulty)}</b></div>` : ""}
    ${m?.unlocks?.length ? `<div class="px pad"><b>Neu freigeschaltet:</b> ${m.unlocks.slice(0, 6).map((u) => esc(u.name)).join(", ")}${m.unlocks.length > 6 ? ` und ${m.unlocks.length - 6} weitere` : ""}</div>` : ""}
    ${ach.length ? `<div class="px pad left"><b>Neue Erfolge:</b> ${ach.slice(0, 4).map(esc).join(", ")}${ach.length > 4 ? ` und ${ach.length - 4} weitere` : ""}</div>` : ""}
    ${btn("Zurück zum Titel", "to-title", undefined, { cls: "primary" })}</div></div>`;
}

// ---------------------------------------------------------------- Sammlung (Shiny-Dex)
function collectionView(ui) {
  const meta = ui.meta, prog = dexProgress(meta.dex), found = (kind, id) => Boolean(meta.dex.shiny[`${kind}/${id}`]);
  const labels = { heroes: "Helden", cards: "Karten", weapons: "Waffen", items: "Items", enemies: "Gegner" };
  const disc = (kind, id) => Boolean(meta.discovered?.[kind]?.[id]);
  const tile = (kind, id, svgKind) => {
    if (kind === "items" || kind === "weapons" || kind === "enemies") {                              // Sammlung: erst sichtbar, wenn gewählt, gekauft oder besiegt; ✦ = Chrom-Variante gefunden
      const d = disc(kind, id), sh = found(kind, id), name = CONTENT[kind][id].name;
      return `<div class="dextile ${d ? "found" : "unknown"}" title="${d ? esc(name) : "???"}"${d && kind !== "enemies" ? at("item-info", `${kind}:${id}`) : ""}>${spr(svgKind, id, { attrs: 'width="100%" height="100%"' })}${sh ? '<span class="shbadge">✦</span>' : ""}</div>`;
    }
    const f = found(kind, id);
    return `<div class="dextile ${f ? "found sh" : "unknown"}" title="${f ? esc((kind === "heroes" ? CONTENT.classes : CONTENT[kind])[id].name) : "???"}">${spr(svgKind, id, { shiny: f, attrs: 'width="100%" height="100%"' })}</div>`;
  };
  const grid = (kind, svgKind, cls) => `<div class="dexgrid ${cls}">${Object.keys(kind === "heroes" ? CONTENT.classes : CONTENT[kind]).map((id) => tile(kind, id, svgKind)).join("")}</div>`;
  const unlockables = ["cards", "weapons", "items"].flatMap((kind) => Object.values(CONTENT[kind])
    .filter((d) => d.unlock && !(d.unlock.type === "achievement" && CONTENT.achievements[d.unlock.id]?.secret && !meta.unlocked[`${kind}/${d.id}`]))   // Belohnungen geheimer Erfolge bleiben verborgen
    .map((d) => ({ kind, d })));
  const tabs = [["heroes", "Helden"], ["items", "Items"], ["weapons", "Waffen"], ["enemies", "Gegner"], ["stat", "Statistik"], ["frei", "Freischaltungen"], ["mehr", "Mehr"]];
  const tab = tabs.some(([k]) => k === ui.tab.collection) ? ui.tab.collection : "items";
  let body;
  if (tab === "frei") {
    body = `<div class="unlocklist">${unlockables.map(({ kind, d }) => { const open = Boolean(meta.unlocked[`${kind}/${d.id}`]);
      return `<div class="dexrow"><span>${open ? ico("plus", 12) : ico("lock", 12)} ${esc(d.name)}</span><span class="muted right">${open ? "frei" : esc(describeUnlock(d.unlock))}</span></div>`; }).join("")}</div>`;
  } else if (tab === "stat") {
    const st = meta.stats, lost = meta.runs - meta.wins, rate = meta.runs ? Math.round((100 * meta.wins) / meta.runs) : 0;
    const row = (k, v) => `<div class="dexrow"><span>${k}</span><b>${v}</b></div>`;
    const heroes = Object.values(CONTENT.classes).map((c) => { const b = st.byClass?.[c.id] ?? { runs: 0, wins: 0, bestStage: 0 }; return `<div class="dexrow"><span>${esc(c.name)}</span><span class="muted">${b.runs} Runs · ${b.wins} Siege · Stage ${b.bestStage} · ${esc(CONFIG.difficulty[Math.max(0, st.maxDiffByClass?.[c.id] ?? 0)].name)}</span></div>`; }).join("");
    const hist = (meta.history ?? []).slice(0, 5).map((h) => `<div class="dexrow"><span>${esc(CONTENT.classes[h.classId]?.name ?? h.classId)} · ${esc(CONFIG.difficulty[h.difficulty]?.name ?? "")}</span><span class="${h.won ? "good" : "muted"}">${h.won ? "Sieg" : `Niederlage in Stage ${h.stage}`} · ${h.fights} Kämpfe</span></div>`).join("");
    body = `<div class="stack"><div class="statcols"><div>${row("Runs", meta.runs)}${row("Siege", meta.wins)}${row("Niederlagen", lost)}${row("Siegrate", `${rate} %`)}${row("Beste Stage", `${st.bestStage ?? 0}/${CONFIG.stages.count}`)}</div>
      <div>${row("Gegner besiegt", st.kills)}${row("Kämpfe gewonnen", st.fightsWon)}${row("Gold verdient", st.goldTotal ?? 0)}${row("Elite besiegt", st.elites)}${row("Chrom-Gegner", st.shinyEnemies)}</div></div>
      <h3>Helden</h3><div class="unlocklist">${heroes}</div>${hist ? `<h3>Letzte Runs</h3><div class="unlocklist">${hist}</div>` : ""}</div>`;
  } else if (tab === "mehr") {
    body = `<div class="stack"><div class="muted small">Ein Shiny taucht mit 1 zu ${Math.round(1 / CONFIG.shiny.enemyChance)} pro Gegner auf. Ein Chrom-Held erscheint mit 1 zu ${Math.round(1 / CONFIG.shiny.heroChance)} beim Run-Start. Gefundene Shinys erscheinen hier als Chrom-Variante.</div>
      <div class="row wrap">${btn("Chrom-Vorschau starten", "start-preview", undefined, { cls: "small" })}<span class="muted small">Ein Run, in dem alles Shiny ist. Nichts wird gespeichert.</span></div>
      ${ui.confirmReset ? `<div class="px pad stack"><b class="bad">Wirklich alles löschen?</b><div class="row">${btn("Ja, löschen", "reset-yes", undefined, { cls: "danger" })}${btn("Abbrechen", "reset-no")}</div></div>` : btn("Spielstand löschen", "reset-ask", undefined, { cls: "small" })}</div>`;
  } else {
    body = `<div class="muted small dexcount">${labels[tab]}: ${tab === "heroes" ? `${prog[tab].found} von ${prog[tab].total} als Shiny gefunden` : `${Object.keys(CONTENT[tab]).filter((id) => disc(tab, id)).length} von ${Object.keys(CONTENT[tab]).length} entdeckt · ${prog[tab].found} Shiny`}</div>${grid(tab, { heroes: "hero", items: "item", weapons: "weapon", enemies: "enemy" }[tab], tab)}`;
  }
  return `<div class="screen collection"><div class="pg-head"><h2>Sammlung</h2><div class="tabs">${tabs.map(([k, label]) => `<span class="tab ${tab === k ? "on" : ""}"${at("set-tab", "collection", k)}>${label}</span>`).join("")}</div><span class="grow"></span>${btn("Zurück", "to-title", undefined, { cls: "primary small" })}</div>
    <div class="pg-body">${body}</div></div>`;
}

// ---------------------------------------------------------------- Overlays
function groupedDeck(run) {
  const order = [], counts = {};
  run.deck.forEach((id, i) => { if (!(id in counts)) { counts[id] = []; order.push(id); } counts[id].push(i); });
  return order.map((id) => ({ id, idxs: counts[id], def: CONTENT.get("cards", id) }));
}
function overlayView(ui) {
  const run = ui.run, o = ui.overlay, build = buildOf(run);
  const close = btn("Schließen", "close-overlay", undefined, { cls: "primary" });
  if (o === "deck") return `<div class="overlay"><div class="sheet"><h2>Dein Deck (${run.deck.length})</h2><div class="grid">${groupedDeck(run).map((g) => cardHtml(g.def, { size: "lg", build, count: g.idxs.length })).join("")}</div>${close}</div></div>`;
  if (o === "items") {
    const weapon = CONTENT.get("weapons", run.weapon);
    const labels = STAT_LABELS;
    const sv = (k) => (k === "maxHp" ? run.maxHp : build.stats[k] ?? 0);
    const grid = `<div class="statgrid">${CORE_STATS.map((k) => `<div class="stat" title="${esc(STAT_DESC[k])}"><span class="k">${ico(STAT_ICON[k], 12)} ${labels[k]}</span><b class="${k !== "maxHp" && sv(k) < 0 ? "bad" : k !== "maxHp" && sv(k) > 0 ? "good" : ""}">${k === "maxHp" ? sv(k) : fmtVal(k, sv(k))}</b></div>`).join("")}</div>`;
    const stats = grid + `<div class="chips">${Object.entries(build.stats).filter(([k, v]) => v && !CORE_STATS.includes(k)).map(([k, v]) => `<span class="chip">${ico(STAT_ICON[k] ?? "star", 12)} ${fmtStat(k, v)}</span>`).join(" ")}</div>`;
    const tags = [...new Set([...CONFIG.typeTags, ...Object.keys(CONTENT.elements)])].map((t) => [t, tagCount(build, t)]).filter(([, n]) => n > 0)
      .map(([t, n]) => `<span class="chip">${CONTENT.elements[t] ? ico(elementIconId(t), 12) + " " : ""}${esc(t)} ${n}</span>`).join(" ");
    return `<div class="overlay"><div class="sheet stack"><h2>Ausrüstung</h2><div class="grid2">${itemHtml(weapon, "weapons")}${run.items.map((id) => itemHtml(CONTENT.get("items", id))).join("")}</div>
      ${run.items.length ? "" : "<div class='muted'>Noch keine Items.</div>"}<h3>Werte · Stufe ${run.level + 1} (${run.xp}/${xpNeed(run.level)} EP)</h3>${stats}${tags ? `<h3>Typen im Build (für Synergien)</h3><div class="chips">${tags}</div>` : ""}${close}</div></div>`;
  }
  if (o === "pick-remove") return `<div class="overlay"><div class="sheet"><h2>Welche Karte entfernen?</h2><div class="grid">${groupedDeck(run).map((g) =>
    `<div class="slot">${cardHtml(g.def, { size: "lg", build, count: g.idxs.length })}${btn("Entfernen", "pick-remove", String(g.idxs[0]), { cls: "small danger" })}</div>`).join("")}</div>${close}</div></div>`;
  if (o === "menu") return `<div class="overlay"><div class="sheet mid stack"><h2>Menü</h2>${btn("Einstellungen", "open-settings")}<div class="muted">Seed: <b>${run.seed}</b> (für Freunde: gleiche Karte)</div>${run.shinyHero ? `<div class="chrome">Chrom-Held: +${CONFIG.shiny.heroLuck} Glück in diesem Run</div>` : ""}${btn("Weiterspielen", "close-overlay", undefined, { cls: "primary" })}
    ${run.phase === "combat" ? `<div class="muted small">Im Kampf wird nicht gespeichert. Beendest du jetzt, beginnt der Kampf beim nächsten Mal von vorn.</div>` : ""}${btn("Zum Titel (speichert)", "to-title")}${btn("Run aufgeben", "abandon", undefined, { cls: "danger" })}</div></div>`;
  return "";
}
// Einstellungen: Sprache, Anzeige, Tempo und Kampf-Bedienung an einem Ort (öffnet sich über jedem Bildschirm, auch im Spiel)
const chips = (list, cur, action) => `<div class="chips">${list.map(([v, label]) => `<span class="chip ${String(cur) === String(v) ? "on" : ""}"${at(action, String(v))}>${esc(label)}</span>`).join("")}</div>`;
const fsOk = () => typeof document !== "undefined" && Boolean(document.fullscreenEnabled || document.webkitFullscreenEnabled) && !/iPad|iPhone|iPod/.test(navigator.userAgent) && !(navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
const abLevel = (meta, id) => meta.abilities?.[id]?.level ?? 1;
// Fähigkeiten im Hauptmenü: Stufe, Fortschritt zur nächsten Stufe (nur hier, nie im Run)
function abilitiesView(ui) {
  const meta = ui.meta, rows = Object.values(CONTENT.classes).filter((cl) => cl.abilities.length).map((cl) => `<div class="abclass"><h3>${esc(cl.name)}</h3>${cl.abilities.map((id) => {
    const a = CONTENT.abilities[id], p = abilityProgress(meta, id), cur = abilityAt(id, p.level);
    return `<div class="abrow px"><div class="abhead"><b>${esc(a.name)}</b><span class="rar">Stufe ${p.level}/${1 + a.levels.length}</span></div><div class="muted small">${esc(cur.text)}</div>
      ${p.max ? '<div class="abdone">Maximale Stufe</div>' : `<div class="abtask"><div>${esc(p.task)}</div><div class="bar"><i style="width:${Math.round((100 * p.count) / p.goal)}%"></i></div><div class="muted small">${p.count.toLocaleString("de-DE")} / ${p.goal.toLocaleString("de-DE")} · Belohnung: ${esc(p.reward)}</div></div>`}</div>`; }).join("")}</div>`).join("");
  return `<div class="screen collection"><div class="pg-head"><h2>Fähigkeiten</h2>${btn("Zurück", "to-title", undefined, { cls: "small" })}</div><div class="pg-body"><div class="muted small pad">Fähigkeiten werden nur hier verbessert: durch Aufgaben mit der jeweiligen Fähigkeit, nie während eines Runs.</div>${rows}</div></div>`;
}
function settingsView(ui) {
  const s = ui.meta.settings, size = s.size ?? "gross", lang = s.lang ?? "de";
  return `<div class="overlay settings"><div class="sheet mid stack"><h2>Einstellungen</h2>
    <div class="setgroup"><b>Sprache</b>${chips([["de", "Deutsch"], ["en", "Englisch"]], lang, "set-lang")}</div>
    <div class="setgroup"><b>Anzeigegröße</b>${chips([["normal", "Normal"], ["gross", "Groß"], ["riesig", "Sehr groß"]], size, "set-size")}${fsOk() ? btn("Vollbild", "fullscreen", undefined, { cls: "small" }) : `<div class="muted small">Vollbild geht auf iPad und iPhone nur als App: Teilen, dann „Zum Home-Bildschirm“.</div>`}<div class="muted small">Größer heißt: weniger Platz, aber alles erscheint größer. Vollbild blendet die Browser-Leisten aus.</div></div>
    <div class="setgroup"><b>Tempo im Kampf</b>${chips(CONFIG.ui.speeds.map((v) => [v, `x${v}`]), ui.speed, "set-speed")}</div>
    <div class="setgroup"><b>Zug beenden</b>${chips([[1, "Automatisch"], [0, "Von Hand"]], ui.autoEnd ? 1 : 0, "set-autoend")}<div class="muted small">Automatisch: Der Zug endet von selbst, sobald du keine Karte mehr spielen kannst. Von Hand: Du tippst immer selbst auf Zug beenden.</div></div>
    <div class="setgroup"><b>Ziele wählen</b>${chips([[0, "Automatisch"], [1, "Von Hand"]], ui.manual ? 1 : 0, "set-manual")}<div class="muted small">${ui.manual ? "Erst Karte wählen, dann Gegner antippen." : "Ein Tipp spielt die Karte. Einen Gegner antippen setzt ihn als Hauptziel."}</div></div>
    <div class="setgroup full"><b>Version ${esc(CONFIG.version)}</b><div class="row wrap">${btn("Auf Update prüfen", "check-update", undefined, { cls: "small" })}${ui.updateStatus === "new" || ui.updateStatus === "error" ? btn(ui.updateStatus === "new" ? "Jetzt aktualisieren" : "Neu laden", "reload-page", undefined, { cls: "small good" }) : ""}</div>
      ${ui.updateStatus ? `<div class="muted small upd">${{ checking: "Prüfe …", current: "Du hast die neueste Version.", new: "Update verfügbar! Ein laufender Kampf wird dabei nicht gespeichert.", error: "Prüfen nicht möglich. Lade die Seite neu, um sicher die neueste Version zu haben." }[ui.updateStatus] ?? ""}</div>` : ""}</div>
    <div class="setgroup full"><b>Spielstand</b><div class="row wrap">${btn("Sichern (Datei)", "export-save", undefined, { cls: "small" })}<label class="btn small">Laden (Datei)<input type="file" accept=".json,application/json" data-import hidden></label></div>
      ${ui.importPending ? `<div class="px pad stack"><div>Sicherung ersetzen? Siege ${ui.importPending.wins}, Runs ${ui.importPending.runs}${ui.importPending.hasRun ? ", Run in Arbeit" : ""}. Dein jetziger Fortschritt wird überschrieben.</div><div class="row">${btn("Ja, ersetzen", "import-yes", undefined, { cls: "danger small" })}${btn("Abbrechen", "import-no", undefined, { cls: "small" })}</div></div>` : ""}</div>
    ${btn("Schließen", "close-settings", undefined, { cls: "primary" })}</div></div>`;
}
// Detailansicht einer Karte: voller Text und höchstens drei Begriffserklärungen
function cardDetailView(ui) {
  const def = CONTENT.get("cards", ui.cardInfo), build = buildOf(ui.run), rar = RARITY[def.rarity] ?? RARITY.gewoehnlich;
  const kws = keywordsOf(def);
  return `<div class="overlay"><div class="sheet cdetail"><div class="cd-card">${cardHtml(def, { size: "lg", build, info: false, ctx: ui.run.pending?.combat ? { hp: ui.run.pending.combat.player.hp, maxHp: ui.run.pending.combat.player.maxHp, gold: ui.run.pending.combat.gold } : { hp: ui.run.hp, maxHp: ui.run.maxHp, gold: ui.run.gold } })}</div>
    <div class="cd-body"><h2>${esc(def.name)}</h2><div class="muted small">Kosten ${def.cost} · ${esc(rar[0])}${def.element ? ` · ${esc(elementName(def.element))}` : ""}</div>
      <p>${esc(def.text ?? "")}</p>
      ${def.element ? `<div class="cd-kw"><div><b>Reaktionen</b> Zwei verschiedene Elemente nacheinander im selben Zug lösen eine Reaktion aus:</div>${Object.values(CONTENT.reactions).filter((r) => r.pair.includes(def.element)).map((r) => `<div>${esc(r.name)} (${r.pair.map((p) => esc(elementName(p))).join(" + ")}): ${esc(reactionText(r))}</div>`).join("")}</div>` : ""}
      ${kws.length ? `<div class="cd-kw">${kws.map((k) => `<div><b>${esc(k.name)}</b> ${esc(k.text)}</div>`).join("")}</div>` : ""}
      ${btn("Schließen", "close-cardinfo", undefined, { cls: "primary" })}</div></div></div>`;
}
const nodeInfoView = (ui) => `<div class="overlay"><div class="sheet mid stack center">${ico(NODE_ICON[ui.nodeInfo], 32)}<h2>${esc(NODE_NAME[ui.nodeInfo])}</h2><div>${esc(NODE_INFO[ui.nodeInfo] ?? "")}</div>${btn("Schließen", "close-node-info", undefined, { cls: "primary" })}</div></div>`;
function tipRefHtml(ref) {
  const [kind, id] = ref.split(":"), def = CONTENT.get(kind, id); if (!def) return "";
  const rar = RARITY[def.rarity] ?? RARITY.gewoehnlich, text = kind === "weapons" ? describeWeapon(def) : describeItem(def);
  const stats = Object.entries(def.stats ?? {}).filter(([, v]) => v).map(([k, v]) => `<span class="chip">${ico(STAT_ICON[k] ?? "star", 12)} ${fmtStat(k, v)}</span>`).join(" ");
  const hero = def.hero && CONTENT.classes[def.hero] ? ` · Passt zu: ${esc(CONTENT.classes[def.hero].name)}` : "", uniq = kind === "items" && def.maxStack === 1 ? " · Einzigartig" : "";
  return `<div class="tiprow"><b>${esc(def.name)}</b><div class="muted small">${esc(rar[0])}${esc(hero)}${uniq}</div><div>${esc(text)}</div>${stats ? `<div class="chips">${stats}</div>` : ""}</div>`;
}
function itemInfoView(ui) {
  const [kind, id] = ui.itemInfo.split(":"), def = CONTENT.get(kind, id), rar = RARITY[def.rarity] ?? RARITY.gewoehnlich;
  const stats = Object.entries(def.stats ?? {}).filter(([, v]) => v).map(([k, v]) => `<span class="chip">${ico(STAT_ICON[k] ?? "star", 12)} ${fmtStat(k, v)}</span>`).join(" ");
  const hero = def.hero && CONTENT.classes[def.hero] ? ` · Passt zu: ${esc(CONTENT.classes[def.hero].name)}` : "";
  const text = kind === "weapons" ? describeWeapon(def) : def.text ?? "";
  return `<div class="overlay"><div class="sheet mid stack"><div class="row">${itemHtml(def, kind)}</div><h2>${esc(def.name)}</h2><div class="muted small">${esc(rar[0])}${hero}</div><p>${esc(text)}</p>${stats ? `<div class="chips">${stats}</div>` : ""}${btn("Schließen", "close-item-info", undefined, { cls: "primary" })}</div></div>`;
}
function gainedBox(id) {                                                          // erhaltenes Item oder Karte mit voller Beschreibung
  const kind = CONTENT.get("items", id) ? "items" : CONTENT.get("cards", id) ? "cards" : CONTENT.get("weapons", id) ? "weapons" : null; if (!kind) return "";
  const def = CONTENT.get(kind, id);
  return kind === "cards" ? `<div class="gained px"><b>${esc(def.name)}</b><div class="muted small">${esc(def.text ?? "")}</div></div>` : `<div class="gained">${itemHtml(def, kind)}${tipRefHtml(`${kind}:${id}`)}</div>`;
}
const noticeView = (n) => `<div class="overlay"><div class="sheet mid stack center"><h2>${esc(n.title)}</h2>${n.lines.map((l) => `<div>${esc(l)}</div>`).join("")}${(n.gained ?? []).map(gainedBox).join("")}${btn("OK", "ack-notice", undefined, { cls: "primary" })}</div></div>`;

// ---------------------------------------------------------------- Einstieg
function render(ui) {
  let body;
  if (ui.screen === "title") body = titleView(ui);
  else if (ui.screen === "setup") body = setupView(ui);
  else if (ui.screen === "collection") body = collectionView(ui);
  else if (ui.screen === "achievements") body = achievementsView(ui);
  else if (ui.screen === "abilities") body = abilitiesView(ui);
  else if (ui.screen === "cosmetics") body = cosmeticsView(ui);
  else {
    const p = ui.run.phase;
    body = p === "intro" ? storyView(ui) : p === "map" ? mapView(ui) : p === "combat" ? combatView(ui) : p === "reward" ? rewardView(ui) : p === "shop" ? shopView(ui)
      : p === "rest" ? restView(ui) : p === "event" ? eventView(ui) : endView(ui);
  }
  const overlay = (ui.screen === "game" && ui.overlay ? overlayView(ui) : "") + (ui.settingsOpen ? settingsView(ui) : "") + (ui.nodeInfo ? nodeInfoView(ui) : "") + (ui.achInfo ? achInfoView(ui) : "") + (ui.itemInfo ? itemInfoView(ui) : "") + (ui.screen === "game" && ui.run && ui.cardInfo ? cardDetailView(ui) : "");
  const frame = activeFrame(ui.meta);
  return `<div class="app ${ui.landscape ? "land" : "port"}${frame !== "default" ? ` frame-${frame}` : ""}">${body}</div>${overlay}${ui.notice ? noticeView(ui.notice) : ""}${ui.toast ? `<div class="toast">${esc(ui.toast)}</div>` : ""}`;
}

__exports.tipRefHtml = tipRefHtml;
__exports.render = render;

});
__define("ui/controller.js", function (__exports, __require) {
// Controller: verbindet Engine und Ansichten. Kein DOM, daher komplett in Node testbar.
// dispatch(action, arg, arg2) verändert den Zustand und gibt false zurück, wenn kein Neuzeichnen nötig ist.
const { CONTENT } = __require("content/index.js");
const { draftOffer } = __require("engine/draft.js");
const { abilityAt } = __require("engine/abilities.js");
const { applyContentLanguage } = __require("ui/i18n.js");
const { fmtStat } = __require("ui/theme.js");
const { CONFIG } = __require("data/config.js");
const { createRun, startAdventure, enterNode, completeCombat, takeCard, takeItem, takeWeapon, takeShinyItem, takeShinyWeapon, finishReward, restHeal, takeLevelUp, shopBuy, shopReroll, shopService, shopFreeze, shopRemove, restRemove, leaveShop, eventChoose, serializeRun, loadRun, peekSave, rollShinyHero, takeNewAchievements } = __require("engine/run.js");
const { toggleKeep, aliveEnemies, playCard, endPlayerTurn, useItem, useAbility, activeItems } = __require("engine/combat.js");
const { nextAction, pickTarget, hasPlayable } = __require("engine/autoplay.js");
const { createMeta, normalizeMeta, recordRun, maxDifficulty, isUnlocked, describeUnlock } = __require("engine/meta.js");
const { evaluateAchievements } = __require("engine/achievements.js");
const { bannerHtml } = __require("ui/achview.js");
const { storyLines } = __require("engine/story.js");
const { render: renderViews } = __require("ui/views.js");
const { nameAny } = __require("ui/util.js");

const KEY_META = "rd_meta_v1", KEY_RUN = "rd_run_v1";
const signed = (n) => (n > 0 ? `+${n}` : `${n}`);

function createController({ storage = null, seedFn = () => Math.floor(Math.random() * 2147483647), shinyRollFn = Math.random, landscape = false, dev = false, victoryPose = false } = {}) {
  const read = (k) => { try { return storage ? JSON.parse(storage.getItem(k)) : null; } catch { return null; } };
  const write = (k, v) => { try { storage?.setItem(k, JSON.stringify(v)); } catch { /* Speicher voll/gesperrt: Spiel läuft trotzdem */ } };
  const remove = (k) => { try { storage?.removeItem(k); } catch { /* ignorieren */ } };

  const meta = normalizeMeta(Object.assign(createMeta(), read(KEY_META) ?? {}));   // ältere Spielstände bekommen fehlende Felder ergänzt
  // Einträge zu Inhalten, die es nach einem Update nicht mehr gibt, aus Dex und Freischaltungen entfernen
  const exists = (key) => { const [kind, id] = key.split("/"); return Boolean((kind === "heroes" ? CONTENT.classes : CONTENT[kind])?.[id]); };
  for (const key of Object.keys(meta.dex.shiny)) if (!exists(key)) delete meta.dex.shiny[key];
  for (const key of Object.keys(meta.unlocked)) if (!exists(key)) delete meta.unlocked[key];
  for (const id of Object.keys(meta.achievements)) if (!CONTENT.achievements[id]) delete meta.achievements[id];
  if (!CONTENT.frames[meta.cosmetics.frame]) meta.cosmetics.frame = "default";
  for (const [cls, id] of Object.entries(meta.cosmetics.skin)) if (!CONTENT.skins[id]) delete meta.cosmetics.skin[cls];

  // Neu erreichte Erfolge, die die Oberfläche als Meldung einblenden soll (z. B. rückwirkend für bereits gespielte Runs und Siege)
  const achEvents = [...evaluateAchievements(meta).achievements];

  const ui = {
    screen: "title", run: null, meta, landscape, dev,
    setup: { step: 0, classId: "nahkaempfer", weaponId: CONTENT.classes.nahkaempfer.weapon, abilityId: CONTENT.classes.nahkaempfer.abilities[0] ?? null, difficulty: 0, seed: "", draftSeed: null, picks: [], offer: [] },
    storyIdx: 0, selected: null, overlay: null, removeMode: null, notice: null, toast: null, showLog: false, confirmReset: false,
    fx: [], enter: null, hasSave: false,
    // Kampf-Bedienung
    tab: { collection: "items", ach: "gegner", cosm: "farben", reward: null }, cardInfo: null, victory: false, victoryFor: null, achInfo: null, nodeInfo: null, itemInfo: null, settingsOpen: false, updateStatus: null, importPending: null, reloadNeeded: false,
    auto: false, speed: CONFIG.ui.speeds.includes(meta.settings.speed) ? meta.settings.speed : 1, manual: meta.settings.manual, autoEnd: meta.settings.autoEnd, focus: null,
  };
  applyContentLanguage(CONTENT, meta.settings.lang ?? "de");                  // gespeicherte Sprache anwenden
  let lastWave = -1;

  // Gespeicherten Run prüfen: passt er nicht zur aktuellen Version, wird er sauber verworfen.
  const rawSave = (() => { try { return storage?.getItem(KEY_RUN); } catch { return null; } })();
  if (rawSave) {
    if (peekSave(rawSave).ok) ui.hasSave = true;
    else {
      remove(KEY_RUN);
      let old = null; try { old = JSON.parse(rawSave); } catch { /* ignorieren */ }
      if (old?.classId) { try { recordRun(meta, { classId: old.classId, difficulty: old.difficulty ?? 0, weapon: old.weapon ?? old.startWeapon }, false); write(KEY_META, meta); } catch { /* ignorieren */ } }   // der Run wird als beendet gezählt
      ui.notice = { title: "Neue Version", lines: ["Das Spiel wurde aktualisiert. Dein angefangener Run passt nicht mehr dazu und wurde beendet und gezählt.", "Erfolge, Entdeckungen, Freischaltungen und Shinys sind übernommen."] };
    }
  }

  const toast = (msg) => { ui.toast = msg; };

  function persist() {
    if (ui.preview) return;                                  // Vorschau: nie speichern, nie den echten Spielstand löschen
    write(KEY_META, ui.meta);
    const r = ui.run;
    if (!r) return;
    if (r.phase === "won" || r.phase === "lost") { remove(KEY_RUN); ui.hasSave = false; return; }
    if (r.phase === "combat") return;                       // Kampfzustand wird nicht gespeichert
    try { storage?.setItem(KEY_RUN, serializeRun(r)); ui.hasSave = Boolean(storage); } catch { /* ignorieren */ }
  }

  function tryPlay(idx, uid) {
    const res = playCard(ui.run.pending.combat, idx, uid);
    if (!res.ok) toast(res.reason);
    ui.selected = null;
    return res.ok;
  }
  // Zug automatisch beenden, sobald keine Karte mehr spielbar ist (spart den Tipp auf "Zug beenden")
  function maybeEndTurn() {
    const combat = ui.run.pending.combat;
    if (ui.autoEnd && !combat.result && !hasPlayable(combat)) endPlayerTurn(combat);
  }
  // Ein Tipp = Karte spielen. Das Ziel wählt der Autopilot (oder das angetippte Hauptziel "focus").
  function quickPlay(idx) {
    const combat = ui.run.pending.combat, inst = combat.piles.hand[idx];
    if (!inst) return;
    if (tryPlay(idx, pickTarget(combat, inst.def, ui.focus))) maybeEndTurn();
  }
  const saveSettings = () => { ui.meta.settings = { ...ui.meta.settings, speed: ui.speed, manual: ui.manual, autoEnd: ui.autoEnd }; };
  // Chrom-Vorschau: alles ist Shiny, nichts wird gespeichert und nichts zählt (kein Dex, keine Freischaltung, kein Eingriff in den echten Spielstand)
  let savedShiny = null;
  function endPreview() {
    if (!ui.preview) return;
    Object.assign(CONFIG.shiny, savedShiny);
    ui.preview = false;
  }

  function openRun(run) {
    ui.run = run; run.path ??= []; run.verbose = true;
    Object.assign(ui, { screen: "game", selected: null, overlay: null, notice: null, storyIdx: 0, enter: null, fx: [], focus: null });
    lastWave = -1;
  }

  function dispatch(action, arg, arg2) {
    ui.toast = null; ui.fx = []; ui.enter = null;
    const run = ui.run, was = run?.phase;
    const inPhase = (p) => run && run.phase === p;
    let rerender = true;
    const st = ui.setup;

    switch (action) {
      // ---- Titel und Vorbereitung
      case "new-run": Object.assign(st, { step: 0, difficulty: 0 }); ui.screen = "setup"; break;
      case "pick-class":
        if (!isUnlocked(ui.meta, "classes", CONTENT.classes[arg])) { toast(`Noch gesperrt: ${describeUnlock(CONTENT.classes[arg].unlock)}`); break; }
        st.draftSeed = null; st.picks = []; st.offer = []; st.classId = arg; st.weaponId = CONTENT.classes[arg].weapon; st.abilityId = CONTENT.classes[arg].abilities[0] ?? null; break;
      case "pick-ability": if (CONTENT.classes[st.classId].abilities.includes(arg)) st.abilityId = arg; break;
      case "setup-next": st.step = 1; break;
      case "setup-draft": {                                                  // Schritt 3: Startdeck zusammenstellen (Seed steht ab jetzt fest)
        st.draftSeed = parseInt(st.seed, 10) || seedFn(); st.picks = []; st.offer = draftOffer(st.classId, st.draftSeed, st.picks); st.step = 2; break;
      }
      case "draft-pick": {
        const id = st.offer[Number(arg)]; if (!id || st.picks.length >= CONFIG.draft.rounds) break;
        st.picks = [...st.picks, id]; st.offer = st.picks.length < CONFIG.draft.rounds ? draftOffer(st.classId, st.draftSeed, st.picks) : []; break;
      }
      case "draft-reset": st.picks = []; st.offer = draftOffer(st.classId, st.draftSeed, st.picks); break;
      case "draft-recommended": st.picks = [...CONTENT.classes[st.classId].deck]; st.offer = []; break;
      case "setup-back": if (st.step === 0) ui.screen = "title"; else if (st.step === 2) st.step = 1; else st.step = 0; break;
      case "pick-weapon": st.weaponId = arg; break;
      case "set-diff": st.difficulty = Number(arg); break;
      case "set-seed": st.seed = String(arg ?? "").replace(/\D/g, "").slice(0, 10); rerender = false; break;
      case "start-preview": {
        endPreview();
        savedShiny = { ...CONFIG.shiny };
        Object.assign(CONFIG.shiny, { enemyChance: 1, lootChance: 1 });
        const st = ui.setup;
        openRun(createRun({ ability: st.abilityId, classId: st.classId, weapon: st.weaponId, difficulty: 0, seed: seedFn(), meta: undefined, shinyHero: true }));
        ui.preview = true;
        ui.notice = { title: "Chrom-Vorschau", lines: ["Hier ist alles Shiny: Held, Gegner, Beute.", "Nichts davon wird gespeichert oder zählt für deinen Fortschritt.", "Über das Menü kommst du zurück."] };
        break;
      }
      case "start-run": {
        endPreview();
        const seed = st.draftSeed ?? (parseInt(st.seed, 10) || seedFn()), deck = st.picks.length === CONFIG.draft.rounds ? st.picks : undefined;     // gewähltes Startdeck (ohne Draft: das Standarddeck der Klasse)
        openRun(createRun({ startDeck: deck, ability: st.abilityId, classId: st.classId, weapon: st.weaponId, difficulty: Math.min(st.difficulty, maxDifficulty(ui.meta, st.classId)), seed, meta: ui.meta, shinyHero: rollShinyHero(shinyRollFn) }));
        if (ui.run.shinyHero) ui.notice = { title: "Chrom-Held!", lines: ["Sehr selten: Dein Held schimmert wie Chrom.", `Bonus für diesen Run: +${CONFIG.shiny.heroLuck} Glück.`, `Chance beim Start: 1 zu ${Math.round(1 / CONFIG.shiny.heroChance)}.`] };
        break;
      }
      case "continue": {
        endPreview();
        const raw = (() => { try { return storage?.getItem(KEY_RUN); } catch { return null; } })();
        if (!raw) { toast("Kein Spielstand gefunden"); ui.hasSave = false; break; }
        try { openRun(loadRun(raw, ui.meta)); } catch (e) {
          remove(KEY_RUN); ui.hasSave = false;
          toast(e.code === "SAVE_INCOMPATIBLE" ? "Spielstand passt nicht zur neuen Version und wurde verworfen" : "Spielstand war beschädigt");
        }
        break;
      }
      case "to-title": endPreview(); ui.auto = false; ui.cardInfo = null; ui.settingsOpen = false; ui.screen = "title"; ui.overlay = null; ui.run = null; ui.victory = false; ui.confirmReset = false; break;
      case "show-collection": ui.screen = "collection"; break;
      case "show-achievements": ui.screen = "achievements"; break;
      case "show-abilities": ui.screen = "abilities"; break;
      case "show-cosmetics": ui.screen = "cosmetics"; break;
      case "pick-skin": {                                  // arg = Held, arg2 = Farbvariante (oder "default")
        const def = CONTENT.skins[arg2];
        if (arg2 === "default" || (def && def.hero === arg && ui.meta.unlocked[`skins/${arg2}`])) ui.meta.cosmetics.skin[arg] = arg2;
        break;
      }
      case "pick-frame": if (arg === "default" || ui.meta.unlocked[`frames/${arg}`]) ui.meta.cosmetics.frame = arg; break;
      case "reset-ask": ui.confirmReset = true; break;
      case "reset-no": ui.confirmReset = false; break;
      case "reset-yes":
        Object.assign(ui.meta, createMeta());
        remove(KEY_RUN); ui.hasSave = false; ui.confirmReset = false; toast("Spielstand gelöscht");
        break;
      case "abandon": { const wasPreview = ui.preview; endPreview(); if (!wasPreview) { if (run && run.phase !== "won" && run.phase !== "lost") recordRun(ui.meta, run, false); remove(KEY_RUN); ui.hasSave = false; } ui.run = null; ui.screen = "title"; ui.overlay = null; break; }
      case "orientation": ui.landscape = arg === "landscape"; break;

      // ---- Geschichte
      case "story-next":
        if (inPhase("intro")) {
          const lines = storyLines("intro", run.classId);
          if (ui.storyIdx + 1 < lines.length) ui.storyIdx++; else startAdventure(run);
        }
        break;
      case "story-skip": if (inPhase("intro")) startAdventure(run); break;

      // ---- Overlays
      case "show-deck": ui.overlay = "deck"; break;
      case "show-items": ui.overlay = "items"; break;
      case "show-menu": ui.overlay = "menu"; break;
      case "close-overlay": ui.overlay = null; break;
      case "toggle-log": ui.showLog = !ui.showLog; break;
      case "ack-notice": ui.notice = null; break;

      // ---- Karte und Kampf
      case "node": if (inPhase("map")) { const r = enterNode(run, arg); if (!r.ok) toast(r.reason); ui.selected = null; } break;
      case "select-card":
        if (!inPhase("combat") || run.pending.combat.result) break;
        if (ui.manual) ui.selected = ui.selected === Number(arg) ? null : Number(arg);   // manuell: erst wählen, dann Ziel
        else quickPlay(Number(arg));                                                     // sonst: ein Tipp = spielen
        break;
      case "play-selected": if (inPhase("combat") && ui.selected !== null) { const i = ui.selected; if (tryPlay(i, pickTarget(run.pending.combat, run.pending.combat.piles.hand[i]?.def ?? { play: [] }, ui.focus))) maybeEndTurn(); } break;
      case "target": if (inPhase("combat") && ui.selected !== null) { if (tryPlay(ui.selected, arg)) maybeEndTurn(); } break;
      case "keep-card": if (inPhase("combat") && !run.pending.combat.result) toggleKeep(run.pending.combat, Number(arg)); break;       // Behalten: Karte bleibt am Zugende auf der Hand
      case "use-ability": {                                // Signatur-Fähigkeit (kostet keine Energie, nur Cooldown); Ziel: gewählter Gegner, sonst der stärkste
        if (!inPhase("combat") || run.pending.combat.result) break;
        const combat = run.pending.combat, alive = aliveEnemies(combat), t = alive.find((e) => e.uid === ui.focus) ?? [...alive].sort((a, b) => b.hp - a.hp)[0];
        const res = useAbility(combat, t?.uid);
        if (!res.ok) toast(res.reason); else maybeEndTurn();
        break;
      }
      case "use-item": {                                   // aktives Item auslösen (1x pro Kampf), Ziel wählt der Autopilot
        if (!inPhase("combat") || run.pending.combat.result) break;
        const combat = run.pending.combat, entry = activeItems(combat).find((x) => x.index === Number(arg));
        if (!entry) break;
        const res = useItem(combat, entry.index, pickTarget(combat, entry.def, ui.focus));
        if (!res.ok) toast(res.reason); else maybeEndTurn();
        break;
      }
      case "focus": if (inPhase("combat")) ui.focus = ui.focus === arg ? null : arg; break;       // Hauptziel merken: einzelne Angriffe gehen darauf
      case "dev-force": {                                  // nur für Screenshots/Tests (Adresse mit #dev): direkt zu einem Ortstyp springen
        if (!ui.dev || !run) break;
        const nodes = [...run.map.layers.flat(), run.map.boss], node = nodes.find((n) => n.type === arg);
        if (!node) { toast(`Kein Ort vom Typ ${arg} auf dieser Karte`); break; }
        const parent = run.map.layers.flat().find((n) => n.next.includes(node.id));
        run.phase = "map"; run.pending = null; run.nodeId = parent ? parent.id : null;
        enterNode(run, node.id);
        break;
      }
      case "card-info": ui.cardInfo = arg; break;                                 // Detailansicht einer Karte (Info-Symbol)
      case "close-cardinfo": ui.cardInfo = null; break;
      case "set-tab": ui.tab[arg] = arg2; break;                                  // Reiter in Sammlung, Erfolge und Aussehen
      case "import-save": {                                                      // Datei gelesen: erst prüfen, dann nachfragen
        let d; try { d = JSON.parse(arg); } catch { d = null; }
        if (!d || d.game !== "rogue-deck" || typeof d.meta !== "object" || !d.meta) { toast("Das ist keine Ani-Rogue-Sicherung"); break; }
        ui.importPending = { text: arg, wins: d.meta.wins ?? 0, runs: d.meta.runs ?? 0, version: d.version ?? "?", hasRun: Boolean(d.run) };
        break;
      }
      case "import-yes": {                                                       // Sicherung einspielen (die Seite lädt danach neu)
        const d = JSON.parse(ui.importPending.text);
        ui.meta = normalizeMeta(d.meta); write(KEY_META, ui.meta);                // auch im Speicher des Controllers ersetzen, sonst überschreibt das nächste Speichern die Sicherung
        ui.run = null; ui.screen = "title";
        if (d.run && peekSave(d.run).ok) { try { storage?.setItem(KEY_RUN, d.run); } catch { /* ignorieren */ } } else remove(KEY_RUN);
        ui.importPending = null; ui.reloadNeeded = true; ui.preview = ui.preview ?? false; toast("Spielstand geladen");
        break;
      }
      case "import-no": ui.importPending = null; break;
      case "open-settings": ui.settingsOpen = true; break;                          // Einstellungen (Titel und Spiel)
      case "reload-page": ui.reloadNow = true; break;                          // main.js lädt die Seite mit frischem Cache neu
      case "victory-done": ui.victory = false; break;                          // Sieges-Pose vorbei: Sieg-Fenster zeigen
      case "ach-info": ui.achInfo = arg; break;                                // Info und Datum eines Erfolgs
      case "close-ach-info": ui.achInfo = null; break;
      case "node-info": ui.nodeInfo = arg; break;                              // Info zu einem Ortstyp der Karte
      case "close-node-info": ui.nodeInfo = null; break;
      case "item-info": ui.itemInfo = arg; break;                              // volle Beschreibung eines Items (Shop)
      case "close-item-info": ui.itemInfo = null; break;
      case "close-settings": ui.settingsOpen = false; break;
      case "set-lang": ui.meta.settings = { ...ui.meta.settings, lang: arg === "en" ? "en" : "de" }; applyContentLanguage(CONTENT, ui.meta.settings.lang); break;
      case "set-size": ui.meta.settings = { ...ui.meta.settings, size: ["normal", "gross", "riesig"].includes(arg) ? arg : "gross" }; break;
      case "set-speed": ui.speed = CONFIG.ui.speeds.includes(Number(arg)) ? Number(arg) : 1; saveSettings(); break;
      case "set-manual": ui.manual = arg === "1"; ui.selected = null; saveSettings(); break;
      case "set-autoend": ui.autoEnd = arg === "1"; saveSettings(); break;
      case "cycle-size": {                                  // Anzeigegröße: Normal -> Groß -> Sehr groß (das Spiel zeigt dann weniger Platz, dafür größer)
        const order = ["normal", "gross", "riesig"], cur = order.indexOf(ui.meta.settings.size ?? "gross");
        ui.meta.settings = { ...ui.meta.settings, size: order[(cur + 1) % order.length] };
        break;
      }
      case "toggle-auto": ui.auto = !ui.auto; break;
      case "cycle-speed": ui.speed = CONFIG.ui.speeds[(CONFIG.ui.speeds.indexOf(ui.speed) + 1) % CONFIG.ui.speeds.length]; saveSettings(); break;
      case "toggle-manual": ui.manual = !ui.manual; ui.selected = null; saveSettings(); break;
      case "toggle-autoend": ui.autoEnd = !ui.autoEnd; saveSettings(); break;
      case "auto-step": {                                  // ein Schritt des Autopiloten (der Browser ruft das im Takt auf)
        if (!inPhase("combat") || run.pending.combat.result) break;
        const combat = run.pending.combat, a = nextAction(combat);
        if (a.type === "play") tryPlay(a.index, a.targetUid);
        else if (a.type === "item") useItem(combat, a.index, a.targetUid);
        else if (a.type === "ability") useAbility(combat, a.targetUid);
        else endPlayerTurn(combat);
        break;
      }
      case "end-turn": if (inPhase("combat") && !run.pending.combat.result) { endPlayerTurn(run.pending.combat); ui.selected = null; } break;
      case "after-combat": if (inPhase("combat")) { const r = completeCombat(run); if (!r.ok) toast(r.reason); ui.selected = null; ui.tab.reward = null; } break;

      // ---- Belohnung
      case "take-level": {
        const r = takeLevelUp(run, Number(arg));
        toast(r.ok ? fmtStat(r.stat, r.value) : r.reason);
        if (r.ok) {
          ui.tab.reward = null;
          const rw = run.pending.reward, t = rw.taken;
          const open = [["cards", true], ["items", rw.items.length], ["weapons", rw.weapons.length], ["shinyItems", rw.shinyItems.length], ["shinyWeapons", rw.shinyWeapons?.length], ["level", rw.levelChoices?.length]].filter(([k, n]) => n && !t[k]);
          if (!open.length) { const f = finishReward(run); if (!f.ok) toast(f.reason); }
        }
        break;
      }
      case "take": {
        const fn = { cards: takeCard, items: takeItem, weapons: takeWeapon, shinyItems: takeShinyItem, shinyWeapons: takeShinyWeapon }[arg];
        const r = fn ? fn(run, Number(arg2)) : { ok: false, reason: "Unbekannte Liste" };
        toast(r.ok ? `Genommen: ${nameAny(r.id)}` : r.reason);
        if (r.ok) {
          ui.tab.reward = null;                                                // nach einer Wahl zum nächsten offenen Reiter
          // Sind alle Auswahlen getroffen, geht es von selbst weiter (kein extra "Weiter" mehr nötig). Wer etwas auslassen will, tippt oben auf "Weiter".
          const rw = run.pending.reward, t = rw.taken;
          const open = [["cards", true], ["items", rw.items.length], ["weapons", rw.weapons.length], ["shinyItems", rw.shinyItems.length], ["shinyWeapons", rw.shinyWeapons?.length], ["level", rw.levelChoices?.length]].filter(([k, n]) => n && !t[k]);
          if (!open.length) { const f = finishReward(run); if (!f.ok) toast(f.reason); }
        }
        break;
      }
      case "finish-reward": { const r = finishReward(run); if (!r.ok) toast(r.reason); break; }

      // ---- Shop und Rast
      case "buy": { const r = shopBuy(run, arg, Number(arg2)); toast(r.ok ? `Gekauft: ${nameAny(r.id)}` : r.reason); break; }
      case "freeze": { const r = shopFreeze(run, Number(arg)); if (!r.ok) toast(r.reason); else toast(r.frozen ? "Item gesperrt: wartet auf den nächsten Händler" : "Sperre aufgehoben"); break; }
      case "service": { const r = shopService(run, arg); toast(r.ok ? (arg === "heal" ? "Verband angelegt" : "Stärkungstrank getrunken") : r.reason); break; }
      case "reroll": { const r = shopReroll(run); toast(r.ok ? "Angebot neu gewürfelt" : r.reason); break; }
      case "leave-shop": leaveShop(run); break;
      case "remove-start": ui.overlay = "pick-remove"; ui.removeMode = "shop"; break;
      case "rest-remove-start": ui.overlay = "pick-remove"; ui.removeMode = "rest"; break;
      case "pick-remove": {
        const r = (ui.removeMode === "shop" ? shopRemove : restRemove)(run, Number(arg));
        if (r.ok) { ui.overlay = null; toast("Karte entfernt"); } else toast(r.reason);
        break;
      }
      case "rest-heal": { const before = run.hp; restHeal(run); toast(`+${run.hp - before} HP`); break; }

      // ---- Ereignis
      case "event-choice": {
        const ev = CONTENT.events[run.pending.eventId];
        const before = { hp: run.hp, gold: run.gold, maxHp: run.maxHp, deck: run.deck.length };
        const res = eventChoose(run, Number(arg));
        if (!res.ok) { toast(res.reason); break; }
        const lines = [];
        if (res.gambled) lines.push(res.gambled === "gewonnen" ? "Glück gehabt!" : "Pech gehabt.");
        if (run.hp !== before.hp) lines.push(`${signed(run.hp - before.hp)} HP`);
        if (run.maxHp !== before.maxHp) lines.push(`Max-HP ${signed(run.maxHp - before.maxHp)}`);
        if (run.gold !== before.gold) lines.push(`${signed(run.gold - before.gold)} Gold`);
        if (res.gained?.length) lines.push(`Erhalten: ${res.gained.map(nameAny).join(", ")}`);
        const gainedCards = (res.gained ?? []).filter((id) => CONTENT.get("cards", id)).length;
        if (run.deck.length < before.deck + gainedCards) lines.push("Eine Karte wurde entfernt.");
        if (res.fight) lines.push("Ein Kampf beginnt!");
        ui.notice = { title: ev.name, lines: lines.length ? lines : ["Nichts passiert."], gained: res.gained ?? [] };
        break;
      }
      default: toast(`Unbekannte Aktion: ${action}`);
    }

    // Animationen: Ereignisse des Kampfs abholen, Auftritt bei neuem Kampf bzw. neuer Welle
    const r2 = ui.run;
    if (r2?.phase === "combat") {
      const c = r2.pending.combat;
      ui.fx = c.fx.splice(0);
      if (was !== "combat") { ui.enter = "all"; lastWave = c.waveIndex; }
      else if (c.waveIndex !== lastWave) { ui.enter = "enemies"; lastWave = c.waveIndex; }
    }
    if (ui.run) achEvents.push(...takeNewAchievements(ui.run));   // Erfolge, die in diesem Schritt erreicht wurden
    const cbw = ui.run?.pending?.combat;                          // Kampf gerade gewonnen: erst die Sieges-Pose zeigen (nur in der Oberfläche, nicht in Tests)
    if (victoryPose && cbw?.result === "won" && ui.victoryFor !== cbw) { ui.victoryFor = cbw; ui.victory = true; }
    if (ui.run?.abilityNotice) {                                  // Fähigkeit hat per Meta-Aufgabe eine neue Stufe erreicht
      const ups = ui.run.abilityNotice; ui.run.abilityNotice = null;
      ui.notice = { title: "Fähigkeit verbessert", lines: ups.flatMap((u) => [`${CONTENT.abilities[u.id].name} ist jetzt Stufe ${u.level}.`, abilityAt(u.id, u.level).text]) };
    }
    if (ui.run?.stageNotice) {                                    // neue Stage: kurzer Hinweis
      const n = ui.run.stageNotice; ui.run.stageNotice = null;
      ui.notice = { title: `Stage ${n} von ${CONFIG.stages.count}`, lines: [n >= CONFIG.stages.count ? "Das ist die letzte Stage. Am Ende wartet der Endboss." : "Du hast die Stage geschafft. Die Gegner werden stärker, dafür wird die Beute besser.", `Du wurdest zu ${Math.round(CONFIG.stages.heal * 100)} % geheilt.`] };
    }
    persist();
    return rerender;
  }

  return {
    ui, dispatch, render: () => renderViews(ui),
    // Wartezeit (ms) bis zum nächsten Autopilot-Schritt, oder null wenn gerade nichts zu tun ist
    exportSave: () => {                                                       // Sicherung als Text (Datei-Download macht main.js)
      persist();
      let run = null; try { run = storage?.getItem(KEY_RUN) ?? null; } catch { /* ignorieren */ }
      return JSON.stringify({ game: "rogue-deck", format: 1, version: CONFIG.version, exportedAt: new Date().toISOString(), meta: ui.meta, run }, null, 1);
    },
    victoryMs: () => (ui.victory ? Math.round(CONFIG.ui.victoryMs / ui.speed) : null),
    autoWait: () => {
      const r = ui.run;
      if (!ui.auto || ui.screen !== "game" || !r || r.phase !== "combat" || r.pending.combat.result || ui.overlay || ui.notice || ui.cardInfo || ui.settingsOpen || ui.importPending || ui.nodeInfo || ui.itemInfo || ui.achInfo) return null;
      const c = r.pending.combat;
      const first = c.turn === 1 && c.metrics.plays === 0;                                // Auftritt der Figuren abwarten
      return Math.round((first ? 1800 : 700) / ui.speed);
    },
    takeAchievementEvents: () => achEvents.splice(0),      // neue Erfolge abholen (einmalig)
    achievementBanner: bannerHtml,
  };
}

__exports.createController = createController;

});
__define("ui/main.js", function (__exports, __require) {
// Einstiegspunkt im Browser: hängt Controller und DOM zusammen (Klicks per Event-Delegation).
const { createController } = __require("ui/controller.js");
const { translateDom } = __require("ui/i18n.js");
const { tipRefHtml } = __require("ui/views.js");

const root = document.getElementById("app");
const storage = (() => {
  try { const s = window.localStorage; s.setItem("rd_probe", "1"); s.removeItem("rd_probe"); return s; } catch { return null; }
})();
const dev = window.location.hash.includes("dev");                       // Entwickler-Zugang für Screenshots und Tests
const ctrl = createController({ storage, landscape: true, dev, victoryPose: true });  // das Spiel ist für das Querformat gebaut

// ---- Bühne: das Spiel ist immer 400 Einheiten hoch und 720 bis 960 breit und wird auf den Bildschirm skaliert (Handy, Tablet, Monitor).
// So passt jeder Bildschirm ohne Scrollen, und alle Maße im Stylesheet gelten überall gleich.
const stage = document.getElementById("stage"), probe = document.getElementById("probe");
const STAGE_SIZES = { normal: 450, gross: 410, riesig: 360 };      // Anzeigegröße: weniger Höhe = alles erscheint größer
const STAGE_MIN_W = 720, STAGE_MAX_W = 960;
const devHeight = Number(new URLSearchParams(window.location.search).get("h")) || 0;     // nur zum Testen (?h=360)
function fit() {
  const desk = window.innerWidth >= 1100 && window.innerWidth > window.innerHeight ? 1.1 : 1;                  // Desktop: alles ca. 10 % kleiner (Schrift war zu groß)
  const BASE_H = devHeight || Math.round((STAGE_SIZES[ctrl.ui.meta.settings.size ?? "normal"] || 400) * desk);
  const cs = window.getComputedStyle(probe);                                    // Sicherheitsabstände (Notch) aus CSS lesen
  const L = parseFloat(cs.paddingLeft) || 0, R = parseFloat(cs.paddingRight) || 0, T = parseFloat(cs.paddingTop) || 0, B = parseFloat(cs.paddingBottom) || 0;
  const vw = window.innerWidth - L - R, vh = window.innerHeight - T - B;
  const sW = vw / STAGE_MIN_W;                                                  // Skalierung, wenn die Breite begrenzt (iPad, 4:3)
  const STAGE_H = devHeight ? BASE_H : BASE_H + Math.max(0, Math.min(BASE_H * 0.25, (vh / sW - BASE_H) * 0.6));   // ungenutzte Höhe: Bühne bis 25 % höher (kaum schwarze Balken auf dem iPad)
  const s = Math.min(vh / STAGE_H, vw / STAGE_MIN_W);
  const W = Math.min(STAGE_MAX_W, Math.floor(vw / s));
  stage.style.width = `${W}px`; stage.style.height = `${STAGE_H}px`;
  stage.classList.toggle("compact", BASE_H <= 360); stage.classList.toggle("tiny", BASE_H <= 330);     // bei größerer Anzeige werden dichte Bildschirme (Shop) kompakter
  stage.style.transform = `translate(${L + (vw - W * s) / 2}px, ${T + (vh - STAGE_H * s) / 2}px) scale(${s})`;
  document.body.classList.toggle("portrait", window.innerHeight > window.innerWidth * 1.08);
  const changed = ctrl.ui.stageW !== W;
  ctrl.ui.stageW = W;
  const hChanged = ctrl.ui.stageH !== STAGE_H;
  ctrl.ui.stageH = STAGE_H;
  return changed || hChanged;
}
fit();

// Erfolgs-Meldungen: liegen außerhalb der Spielansicht, damit sie ein Neuzeichnen überdauern
const banners = document.getElementById("banners");
function showBanners() {
  for (const id of ctrl.takeAchievementEvents()) {
    const wrap = document.createElement("div");
    wrap.innerHTML = ctrl.achievementBanner(id);
    const el = wrap.firstElementChild;
    if (!el || !banners) continue;
    banners.appendChild(el); translateDom(el);
    setTimeout(() => el.remove(), 5400);
  }
}

// Autopilot: solange "Auto" an ist, im Takt Schritte ausführen (Wartezeit kommt vom Controller und hängt vom Tempo ab)
let autoTimer = null;
// ---- Eigene Tooltips: native title-Tooltips lassen den Bildschirm im Vollbild flackern; hier eine ruhige Box, Hover (PC) und langes Drücken (Touch)
const hasDom = typeof document.addEventListener === "function" && typeof document.body?.appendChild === "function";          // (die Test-Attrappe hat kein echtes DOM)
const tipEl = hasDom ? document.createElement("div") : { hidden: true, style: {} }; tipEl.className = "tip"; tipEl.hidden = true; if (hasDom) document.body.appendChild(tipEl);
let tipTimer = null, pressTimer = null, tipOwner = null, swallowClick = false;
let tipKeyShown = "";
const tipKey = (el) => (el ? `${el.dataset.tipRef ?? ""}|${el.dataset.tip ?? ""}` : "");        // gleicher Inhalt = gleiches Ziel, auch wenn das Element beim Neuzeichnen ersetzt wurde
function hideTip() { clearTimeout(tipTimer); tipEl.hidden = true; tipOwner = null; tipKeyShown = ""; }
function showTip(el) {
  const ref = el.dataset.tipRef, html = ref ? tipRefHtml(ref) : `<div>${(el.dataset.tip ?? "").replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]))}</div>`;
  if (!html) return;
  tipEl.innerHTML = html; translateDom(tipEl); tipEl.hidden = false; tipOwner = el;
  const r = el.getBoundingClientRect(), tw = tipEl.offsetWidth, th = tipEl.offsetHeight;
  tipEl.style.left = `${Math.max(6, Math.min(window.innerWidth - tw - 6, r.left + r.width / 2 - tw / 2))}px`;
  tipEl.style.top = `${r.top - th - 8 > 6 ? r.top - th - 8 : Math.min(window.innerHeight - th - 6, r.bottom + 8)}px`;
}
function tipTarget(node) { return node?.closest?.("[data-tip],[data-tip-ref]"); }
function stripTitles(rootEl) { rootEl.querySelectorAll?.("[title]")?.forEach((e) => { e.dataset.tip = e.getAttribute("title"); e.removeAttribute("title"); }); }
if (hasDom) {
document.addEventListener("pointerover", (ev) => { if (ev.pointerType === "touch") return; const el = tipTarget(ev.target), key = tipKey(el); if (key && key === tipKeyShown) return; hideTip(); if (el) { tipKeyShown = key; tipTimer = setTimeout(() => showTip(el), 300); } });
document.addEventListener("pointerdown", (ev) => {
  if (ev.pointerType !== "touch") { hideTip(); return; }
  const el = tipTarget(ev.target); hideTip(); clearTimeout(pressTimer);
  if (el && !el.closest(".c-info")) pressTimer = setTimeout(() => { showTip(el); swallowClick = true; }, 450);     // Gedrückt halten: Infobox, der folgende Tipp löst nichts aus
});
for (const t of ["pointerup", "pointercancel", "pointermove"]) document.addEventListener(t, () => clearTimeout(pressTimer));
document.addEventListener("click", (ev) => { if (swallowClick) { swallowClick = false; ev.stopPropagation(); ev.preventDefault(); } else hideTip(); }, true);
}

let victoryTimer = null;
function scheduleVictory() {                                       // nach der Sieges-Pose das Sieg-Fenster zeigen
  const ms = ctrl.victoryMs();
  if (ms === null) { clearTimeout(victoryTimer); victoryTimer = null; return; }
  if (!victoryTimer) victoryTimer = setTimeout(() => { victoryTimer = null; ctrl.dispatch("victory-done"); render(); }, ms);
}
function scheduleAuto() {
  clearTimeout(autoTimer);
  const wait = ctrl.autoWait();
  if (wait === null) return;
  autoTimer = setTimeout(() => { ctrl.dispatch("auto-step"); render(); }, wait);
}

function render() {
  root.innerHTML = ctrl.render();
  if (ctrl.ui.toast) { const tt = ctrl.ui.toast; setTimeout(() => { if (ctrl.ui.toast === tt) { ctrl.ui.toast = null; document.querySelector(".toast")?.remove(); } }, 2200); }      // Meldungen blenden sich nach 2 Sekunden aus
  translateDom(document.body); stripTitles(document.body);          // Sprache Englisch: alle Texte der Oberfläche übersetzen (auch Hinweise und Meldungen außerhalb der App-Fläche)
  showBanners();
  scheduleVictory();
  scheduleAuto();
}

root.addEventListener("change", (ev) => {                          // Sicherung laden: Datei lesen und an den Controller geben
  const inp = ev.target.closest("input[data-import]");
  if (!inp || !inp.files?.[0]) return;
  inp.files[0].text().then((txt) => { ctrl.dispatch("import-save", txt); render(); }).catch(() => {});
});

root.addEventListener("click", (ev) => {                           // Seed-Feld: erst auf Antippen schreibbar (verhindert versehentliche Tastatur und die Safari-Warnung im Vollbild)
  const inp = ev.target.closest("input.seed[readonly]");
  if (inp) { inp.removeAttribute("readonly"); inp.focus(); inp.addEventListener("blur", () => inp.setAttribute("readonly", ""), { once: true }); }
});

root.addEventListener("click", (ev) => {
  const el = ev.target.closest("[data-action]");
  if (!el || el.disabled) return;
  if (el.dataset.action === "fullscreen") {                       // Vollbild blendet die Browser-Leisten aus: mehr Platz, das Spiel wird größer
    const d = document.documentElement;
    try { Promise.resolve((d.requestFullscreen ?? d.webkitRequestFullscreen)?.call(d)).then(() => window.screen.orientation?.lock?.("landscape")).catch(() => {}); } catch { /* nicht unterstützt */ }
    return;
  }
  if (el.dataset.action === "check-update") {                      // Prüfen, ob die Seite eine neuere Version hat (Kennung in der Adresse von game.js)
    ctrl.ui.updateStatus = "checking"; render();
    const cur = (document.querySelector('script[src*="game.js"]')?.getAttribute("src") ?? "").match(/v=([a-z0-9]+)/)?.[1];
    (cur ? fetch(`${window.location.pathname}?nocache=${Date.now()}`, { cache: "no-store" }).then((r) => r.text()).then((h) => { const m = h.match(/game\.js\?v=([a-z0-9]+)/); return m ? (m[1] === cur ? "current" : "new") : "error"; }) : Promise.resolve("error"))
      .catch(() => "error").then((st) => { ctrl.ui.updateStatus = st; render(); });
    return;
  }
  if (el.dataset.action === "export-save") {                       // Sicherung als Datei herunterladen
    const blob = new Blob([ctrl.exportSave()], { type: "application/json" }), a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = `ani-rogue-sicherung-${new Date().toISOString().slice(0, 10)}.json`; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    return;
  }
  const res = ctrl.dispatch(el.dataset.action, el.dataset.arg, el.dataset.arg2);
  if (ctrl.ui.reloadNow) { ctrl.exportSave(); window.location.href = `${window.location.pathname}?r=${Date.now()}${window.location.hash}`; return; }
  if (ctrl.ui.reloadNeeded) { setTimeout(() => window.location.reload(), 400); }
  if (el.dataset.action === "cycle-size" || el.dataset.action === "set-size") fit();                  // neue Höhe sofort anwenden
  if (res !== false) render();
});
root.addEventListener("change", (ev) => {
  const el = ev.target.closest("[data-change]");
  if (el) ctrl.dispatch(el.dataset.change, el.value);
});
// Größe oder Ausrichtung geändert: Bühne neu anpassen und bei anderer Breite neu zeichnen (die Kulisse passt sich der Breite an)
function onResize() { if (fit()) render(); }
window.addEventListener("resize", onResize);
window.addEventListener("orientationchange", () => setTimeout(onResize, 120));
render();
if (dev) window.__rd = { ctrl, render };



});
__require("ui/main.js");
})();
