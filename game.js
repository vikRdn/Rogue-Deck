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
  player: { startEnergy: 3, handSize: 5, maxHp: 70 },

  balance: {
    softCapAdd: 8,        // Additive Boni über diesem Wert zählen nur zur Hälfte
    maxMultBonus: 1.0,    // Prozent-Boni summieren sich additiv (+25% +30% = +55%), max. +100%
    vulnerableMult: 1.5,  // Schaden gegen "verwundbare" Gegner
    maxChainDepth: 4,     // Max. Tiefe von Trigger-Ketten (Schutz vor Endlosschleifen)
    maxCardsPerTurn: 25,  // Harte Grenze gegen Kartenschleifen
    enemyDmgScale: 0.57,
    markBonus: 1,         // Markierte Ziele erhalten pro Treffer +1 Schaden
    tempoCap: 3,          // Max. Bonus durch "pro zuvor gespielter Karte"  // Globaler Regler für ALLEN Gegnerschaden (vor der Schwierigkeitsstufe)
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
  tagBias: { minCount: 2, perMatch: 0.6, cap: 1.2 },

  rewards: { cardChoices: 3, wildcardSlots: 1 },   // Wildcard-Slots ignorieren die Lenkung (Vielfalt!)

  shop: {
    cardSlots: 5, itemSlots: 3, wildcardCards: 2, wildcardItems: 1,
    basePrice: { gewoehnlich: 40, ungewoehnlich: 70, selten: 120, legendaer: 220 },
    itemFactor: 1.5,       // Items kosten mehr als Karten
    priceVariance: 0.15,   // +-15 % Zufallsschwankung
    startDiscount: 0.5,    // Startladen (nach dem ersten Kampf): halbe Preise
    removeBase: 50, removeIncrement: 25,
    rerollBase: 25, rerollIncrement: 15,
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
  run: { startGold: 60, restHealPct: 0.3, minDeck: 5, normalItemChance: 0.12 },
  map: {
    layers: 10,                 // Ebenen vor dem Boss
    width: [3, 4],              // Knoten pro Ebene (min, max)
    skipEdgeChance: 0.2,        // Chance auf Abkürzung (überspringt eine Ebene) -> Run-Länge hängt vom Weg ab
    minibossLayer: 5,           // Pflicht-Ebene mit Mini-Bossen (nicht überspringbar)
    firstEncounter: "kellerratten",   // Ebene 0 hat genau EINEN Ort mit diesem festen Kampf, danach beginnt die Wegwahl
    nodeWeights: { kampf: 48, ereignis: 18, haendler: 9, rast: 12, elite: 13 },
    minLayer: { elite: 3, rast: 2, haendler: 2 },
    tierSplit: 4,               // ab dieser Ebene kommen Begegnungen der Stufe 2
  },
  gold: { kampf: [14, 24], elite: [30, 44], miniboss: [50, 70], boss: [100, 100] },
  // Schwierigkeitsstufen. Stufe n wird erst nach einem Sieg auf Stufe n-1 freigeschaltet.
  difficulty: [
    { name: "Normal",   hpMult: 1,    dmgMult: 1 },
    { name: "Schwer",   hpMult: 1.2,  dmgMult: 1.1 },
    { name: "Albtraum", hpMult: 1.4,  dmgMult: 1.25 },
  ],

  // Typ-Tags, die für Vielfalts-Effekte und Lenkung zählen (Element-IDs kommen automatisch dazu)
  typeTags: ["feuer", "gift", "blut", "block"],
};

__exports.CONFIG = CONFIG;

});
__define("content/registry.js", function (__exports, __require) {
// Content-Registry: nimmt "Packs" (Sets) entgegen und stellt alles gesammelt bereit.
// Ein neues Set = eine neue Datei in content/packs + eine Zeile in content/index.js.
const { CONFIG } = __require("data/config.js");

const KINDS = ["cards", "weapons", "items", "enemies", "encounters", "classes", "events", "reactions", "speakers", "stories", "skins", "frames", "achievements"];
const uniq = (a) => [...new Set(a)];

function normalize(kind, id, def, packId) {
  const out = { id, pack: packId, ...def };
  if (kind === "cards" || kind === "weapons" || kind === "items") {
    out.tags = uniq([...(def.tags ?? []), ...(def.element ? [def.element] : [])]); // Element zählt als Tag
    out.pools = def.pools ?? ["alle"];                                             // "alle" oder Klassen-IDs
    out.rarity = def.rarity ?? "gewoehnlich";
  }
  if (kind === "weapons" || kind === "items") out.passives = def.passives ?? [];
  if (kind === "items") { out.stats = def.stats ?? {}; out.maxStack = def.maxStack ?? CONFIG.items.maxStack; }
  if (kind === "enemies") out.elements = def.elements ?? [];
  if (kind === "achievements") { out.group = def.group ?? "runs"; out.secret = Boolean(def.secret); }
  if (kind === "classes") { out.stats = def.stats ?? {}; out.starterWeapons = def.starterWeapons ?? [def.weapon]; out.shopBasics = def.shopBasics ?? []; }
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
  const c = { packs: [], elements: {}, relations: [], matrix: {}, cards: {}, weapons: {}, items: {}, enemies: {}, encounters: {}, classes: {}, events: {}, reactions: {}, reactionIndex: {}, speakers: {}, stories: {}, skins: {}, frames: {}, achievements: {} };
  const shinyCache = {};

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
      name: "Nahkämpfer", hp: 95, stats: {}, blurb: "Robust und geradlinig: Block, Waffenstärke und Blutung. Verzeiht Fehler.",
      deck: ["hieb", "hieb", "hieb", "hieb", "wuchtschlag", "wuchtschlag", "wirbel"], shopBasics: ["deckung", "deckung", "deckung"],
      weapon: "rostiges_schwert", starterWeapons: ["rostiges_schwert", "flammenschwert", "giftdolch"], items: [],
    },
  },

  cards: {
    hieb:        { name: "Hieb", cost: 1, tags: ["nahkampf", "angriff"], text: "Schaden: 4 + Waffe.",
                   play: [{ action: "damage", base: 4, weaponScale: 1 }] },
    wuchtschlag: { name: "Wuchtschlag", cost: 2, pools: ["nahkaempfer"], tags: ["nahkampf", "angriff"], text: "Schaden: 8 + 2x Waffe.",
                   play: [{ action: "damage", base: 8, weaponScale: 2 }] },
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
    rostiges_schwert: { name: "Rostiges Schwert", pools: ["nahkaempfer"], power: 2, tags: ["waffe", "nahkampf"] },
  },

  items: {
    // --- Wasser / Pflanze ---
    quellstein:    { name: "Quellstein", tags: ["wasser", "item"],
      passives: [{ trigger: "damage_calc", cardTag: "wasser", op: "add", value: 2 }], text: "Wasserkarten: +2 Schaden." },
    gezeitenperle: { name: "Gezeitenperle", rarity: "ungewoehnlich", tags: ["wasser", "item", "block"],
      passives: [{ trigger: "on_card_played", cardTag: "wasser", action: "block", value: 3, maxPerTurn: 4 }], text: "Wasserkarte gespielt: 3 Block (max. 4/Zug)." },
    treibholz:     { name: "Treibholz", tags: ["wasser", "item", "block"],
      passives: [{ trigger: "on_turn_start", action: "block", perTag: "wasser", value: 1, cap: 4 }], text: "Zugbeginn: 1 Block pro Wasser-Tag (max. 4)." },
    dornenring:    { name: "Dornenring", tags: ["pflanze", "item"],
      passives: [{ trigger: "damage_calc", cardTag: "pflanze", op: "add", value: 2 }], text: "Pflanzenkarten: +2 Schaden." },
    sporenbeutel:  { name: "Sporenbeutel", rarity: "ungewoehnlich", tags: ["pflanze", "gift", "item"],
      passives: [{ trigger: "on_card_played", cardTag: "pflanze", action: "status", status: "gift", stacks: 1, target: "random_enemy", maxPerTurn: 3 }],
      text: "Pflanzenkarte gespielt: 1 Gift auf einen Gegner (max. 3/Zug)." },
    wurzelherz:    { name: "Wurzelherz", rarity: "selten", tags: ["pflanze", "item", "heilung"],
      passives: [{ trigger: "on_turn_start", action: "heal", perTag: "pflanze", value: 1, cap: 2 }], text: "Zugbeginn: heile 1 HP pro Pflanzen-Tag (max. 2)." },
    eisenpanzer: { name: "Eisenpanzer", tags: ["block", "item"],
      passives: [{ trigger: "on_turn_start", action: "block", value: 2 }], text: "Zugbeginn: 2 Block." },
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
    knochenhauptmann: { name: "Knochenhauptmann", hp: 200,
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
    flammenschwert: { name: "Flammenschwert", rarity: "ungewoehnlich", pools: ["nahkaempfer"], power: 1, tags: ["waffe", "nahkampf", "feuer"],
      passives: [{ trigger: "damage_calc", cardTag: "feuer", op: "add", value: 1 }] },
  },
  items: {
    funkenfeuerzeug: { name: "Funkenfeuerzeug", tags: ["feuer", "item"],
      passives: [{ trigger: "on_card_played", cardTag: "feuer", chance: 0.3, action: "damage", value: 3, target: "random_enemy", maxPerTurn: 3 }],
      text: "Feuerkarte gespielt: 30 % Chance auf 3 Schaden an einen Gegner." },
    lavaruestung: { name: "Lavarüstung", rarity: "ungewoehnlich", tags: ["feuer", "item", "ruestung", "dornen"],
      passives: [{ trigger: "on_player_hit", action: "damage_all", value: 2, maxPerTurn: 2 }], text: "Du wirst getroffen: 2 Schaden an ALLE (max. 2/Zug)." },
    glutschale:   { name: "Glutschale", rarity: "ungewoehnlich", tags: ["feuer", "item", "block"],
      passives: [{ trigger: "on_turn_start", action: "block", perTag: "feuer", value: 1, cap: 6 }], text: "Zugbeginn: 1 Block pro Feuer-Tag (max. 6)." },
    aschemantel:  { name: "Aschemantel", rarity: "selten", tags: ["feuer", "item", "ruestung"],
      passives: [{ trigger: "damage_calc", cardTag: "feuer", requires: { tag: "feuer", count: 4 }, op: "add", value: 3 }], text: "Ab 4 Feuer-Tags: Feuerkarten +3 Schaden." },
    glutstein: { name: "Glutstein", text: "Feuerkarten: +2 Schaden.", tags: ["feuer", "item"],
      passives: [{ trigger: "damage_calc", cardTag: "feuer", op: "add", value: 2 }] },
    schmiedeherz: { name: "Schmiedeherz", text: "Feuerkarten: +1 Schaden pro Feuer-Tag (max. +4).", rarity: "selten", tags: ["feuer", "item"],
      // Tag-Zählung: +1 Schaden pro Feuer-Tag im Build, max. +4
      passives: [{ trigger: "damage_calc", cardTag: "feuer", perTag: "feuer", op: "add", value: 1, cap: 4 }] },
    flammenkrone: { name: "Flammenkrone", text: "Ab 6 Feuer-Tags: Feuerkarten +25 % Schaden.", unlock: { type: "wins", count: 1 }, rarity: "legendaer", tags: ["feuer", "item"],
      // Set-Bonus: ab 6 Feuer-Tags +25% Schaden für Feuer-Karten
      passives: [{ trigger: "damage_calc", cardTag: "feuer", requires: { tag: "feuer", count: 6 }, op: "pct", value: 0.25 }] },
  },
  enemies: {
    glutgeist: { name: "Glutgeist", hp: 24, elements: ["feuer"], pattern: [{ type: "attack", value: 8 }, { type: "attack", value: 5 }] },
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
    giftdolch: { name: "Giftdolch", rarity: "ungewoehnlich", pools: ["nahkaempfer"], power: 1, tags: ["waffe", "nahkampf", "gift"],
      passives: [{ trigger: "on_card_played", cardTag: "gift", action: "status", status: "gift", stacks: 1, target: "event_target", maxPerTurn: 3 }] },
  },
  items: {
    giftzahn:     { name: "Giftzahn", tags: ["gift", "item"],
      passives: [{ trigger: "damage_calc", cardTag: "gift", op: "add", value: 2 }], text: "Giftkarten: +2 Schaden." },
    schierlingsflasche: { name: "Schierlingsflasche", rarity: "ungewoehnlich", tags: ["gift", "item"],
      passives: [{ trigger: "on_turn_start", action: "status", status: "gift", stacks: 2, target: "random_enemy" }], text: "Zugbeginn: 2 Gift auf einen zufälligen Gegner." },
    miasmaflasche: { name: "Miasmaflasche", rarity: "ungewoehnlich", tags: ["gift", "item"],
      passives: [{ trigger: "on_status_applied", whenStatus: "gift", chance: 0.3, action: "damage", value: 2, target: "event_target", maxPerTurn: 4 }],
      text: "Gift aufgetragen: 30 % Chance auf 2 Schaden (max. 4/Zug)." },
    leichengift:  { name: "Leichengift", rarity: "selten", tags: ["gift", "item"], maxStack: 1,
      passives: [{ trigger: "on_kill", action: "status_all", status: "gift", stacks: 2, maxPerTurn: 3 }], text: "Gegner besiegt: 2 Gift auf ALLE übrigen (max. 3/Zug)." },
    apothekerwaage: { name: "Apothekerwaage", rarity: "selten", tags: ["gift", "item"],
      passives: [{ trigger: "damage_calc", requires: { tag: "gift", count: 4 }, op: "pct", value: 0.2 }], text: "Ab 4 Gift-Tags: ALLE Karten +20 % Schaden." },
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
      passives: [{ trigger: "damage_calc", cardTag: "blut", requires: { tag: "blut", count: 4 }, op: "pct", value: 0.25 }], text: "Ab 4 Blut-Tags: Blutkarten +25 % Schaden." },
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
    eissplitter: { name: "Eissplitter", cost: 2, element: "eis", tags: ["angriff"], text: "Eisschaden: 8 + 1,5x Waffe. 2 Verwundbar.",
      play: [{ action: "damage", base: 8, weaponScale: 1.5 }, { action: "status", status: "verwundbar", stacks: 2 }] },
    frostnova:   { name: "Frostnova", cost: 2, rarity: "ungewoehnlich", element: "eis", tags: ["flaeche"], text: "Eisschaden an ALLEN: 3 + 0,5x Waffe. 1 Verwundbar.",
      play: [{ action: "damage", base: 3, weaponScale: 0.5, target: "all" }, { action: "status", status: "verwundbar", stacks: 1, target: "all" }] },
    eiszeit:     { name: "Eiszeit", unlock: { type: "runs", count: 2 }, cost: 2, rarity: "selten", element: "eis", tags: ["flaeche"], text: "Eisschaden an ALLEN: 4 + Waffe. 2 Verwundbar.",
      play: [{ action: "damage", base: 4, weaponScale: 1, target: "all" }, { action: "status", status: "verwundbar", stacks: 2, target: "all" }] },
  },
  weapons: {
    frostklinge: { name: "Frostklinge", rarity: "ungewoehnlich", pools: ["nahkaempfer"], power: 1, tags: ["waffe", "nahkampf", "eis"],
      passives: [{ trigger: "damage_calc", cardTag: "eis", op: "add", value: 1 }] },
  },
  items: {
    raureif:      { name: "Raureif", tags: ["eis", "item", "block"],
      passives: [{ trigger: "on_turn_start", action: "block", perTag: "eis", value: 1, cap: 5 }], text: "Zugbeginn: 1 Block pro Eis-Tag (max. 5)." },
    eiszapfen:    { name: "Eiszapfen", tags: ["eis", "item"],
      passives: [{ trigger: "on_card_played", cardTag: "eis", action: "damage", value: 2, target: "event_target", maxPerTurn: 4 }], text: "Eiskarte gespielt: 2 Schaden (max. 4/Zug)." },
    schneekugel:  { name: "Schneekugel", rarity: "ungewoehnlich", tags: ["eis", "item", "debuff"],
      passives: [{ trigger: "on_turn_end", chance: 0.5, action: "status_all", status: "verwundbar", stacks: 1 }], text: "Zugende: 50 % Chance, alle Gegner 1x Verwundbar zu machen." },
    kaelteamulett: { name: "Kälteamulett", rarity: "selten", tags: ["eis", "item"],
      passives: [{ trigger: "damage_calc", cardTag: "eis", requires: { tag: "eis", count: 4 }, op: "pct", value: 0.25 }], text: "Ab 4 Eis-Tags: Eiskarten +25 % Schaden." },
    herz_des_winters: { name: "Herz des Winters", unlock: { type: "wins", count: 1 }, rarity: "legendaer", tags: ["eis", "item"], maxStack: 1,
      passives: [{ trigger: "on_combat_start", action: "status_all", status: "verwundbar", stacks: 3 }, { trigger: "damage_calc", cardTag: "eis", op: "add", value: 3 }],
      text: "Kampfbeginn: alle Gegner 3x Verwundbar. Eiskarten +3 Schaden." },
    eiskristall: { name: "Eiskristall", text: "Eiskarten: +2 Schaden.", rarity: "ungewoehnlich", tags: ["eis", "item"],
      passives: [{ trigger: "damage_calc", cardTag: "eis", op: "add", value: 2 }] },
    frostherz: { name: "Frostherz", text: "Eiskarte gespielt: 1x Verwundbar auf einen Gegner (max. 2/Zug).", rarity: "selten", tags: ["eis", "item"],
      passives: [{ trigger: "on_card_played", cardTag: "eis", action: "status", status: "verwundbar", stacks: 1, target: "random_enemy", maxPerTurn: 2 }] },
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
    eisenhelm:     { name: "Eisenhelm", tags: ["item", "ruestung", "block"], stats: { blockStart: 2 }, text: "Starte jeden Zug mit 2 Block." },
    muenzbeutel:   { name: "Münzbeutel", tags: ["item", "gold"], stats: { goldPct: 15 }, text: "+15 % Gold." },
    feldflasche:   { name: "Feldflasche", tags: ["item", "heilung"], stats: { regen: 5 }, text: "Heile 5 HP nach jedem Kampf." },
    hasenpfote:    { name: "Hasenpfote", tags: ["item", "glueck", "gold"], stats: { luck: 1, goldPct: 10 }, text: "+1 Glück, +10 % Gold." },
    wetzstein:     { name: "Wetzstein", tags: ["item", "angriff"],
                     passives: [{ trigger: "damage_calc", cardTag: "nahkampf", op: "add", value: 1 }], text: "Nahkampfkarten: +1 Schaden." },
    notfallration: { name: "Notfallration", tags: ["item", "heilung"],
                     passives: [{ trigger: "on_combat_start", action: "heal", value: 5 }], text: "Heile 5 HP zu Kampfbeginn." },

    // --- ungewöhnlich ---
    rucksack:      { name: "Rucksack", rarity: "ungewoehnlich", tags: ["item"], stats: { handSize: 1 }, maxStack: 2, text: "+1 Handkarte." },
    ledergurt:     { name: "Ledergurt", rarity: "ungewoehnlich", tags: ["item", "ruestung", "block"], stats: { maxHp: 6, blockStart: 1 }, text: "+6 Max-HP, +1 Block pro Zug." },
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
                     passives: [{ trigger: "on_turn_start", chance: 0.25, action: "energy", value: 1 }], text: "Zugbeginn: 25 % Chance auf +1 Energie." },
    echostein:     { name: "Echostein", rarity: "ungewoehnlich", tags: ["item"],
                     passives: [{ trigger: "on_card_played", chance: 0.15, action: "draw", value: 1, maxPerTurn: 2 }], text: "Karte gespielt: 15 % Chance, 1 Karte zu ziehen (max. 2/Zug)." },
    meisterhammer: { name: "Meisterhammer", rarity: "ungewoehnlich", tags: ["item", "angriff"],
                     passives: [{ trigger: "damage_calc", cardTag: "nahkampf", op: "pct", value: 0.2 }], text: "Nahkampfkarten: +20 % Schaden." },
    taschenuhr:    { name: "Taschenuhr", rarity: "ungewoehnlich", tags: ["item"],
                     passives: [{ trigger: "on_turn_start", chance: 0.3, action: "draw", value: 1 }], text: "Zugbeginn: 30 % Chance, 1 Karte zu ziehen." },

    // --- selten ---
    energiekristall: { name: "Energiekristall", rarity: "selten", tags: ["item"], stats: { energy: 1 }, maxStack: 1, text: "+1 Energie pro Zug." },
    blutpakt:      { name: "Blutpakt", rarity: "selten", tags: ["item", "pakt"], stats: { energy: 1, maxHp: -12 }, maxStack: 1, text: "+1 Energie, -12 Max-HP." },
    glaskanone:    { name: "Glaskanone", rarity: "selten", tags: ["item", "pakt"], stats: { maxHp: -15 }, maxStack: 2,
                     passives: [{ trigger: "damage_calc", op: "pct", value: 0.4 }], text: "+40 % Schaden, -15 Max-HP." },
    goldene_waage: { name: "Goldene Waage", rarity: "selten", tags: ["item", "gold"], stats: { goldPct: 40 }, maxStack: 1, text: "+40 % Gold." },
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
//  - Phase 2 (unter 50 % HP): beschwört zwei Funken und bekommt neue Platten.
__exports.default = {
  id: "boss",
  name: "Endboss",
  enemies: {
    funke: { name: "Funke", hp: 16, elements: ["feuer"], pattern: [{ type: "attack", value: 5 }] },
    elementarwandler: {
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
        { label: "40 Gold setzen (50 %: 120 Gold)", requires: { gold: 40 }, effects: [{ type: "gold", value: -40 }, { type: "gamble", chance: 0.5, win: [{ type: "gold", value: 120 }], lose: [] }] },
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
        { label: "Trinken (60 %: +20 HP, 40 %: -8 HP)", effects: [{ type: "gamble", chance: 0.6, win: [{ type: "heal", value: 20 }], lose: [{ type: "hurt", value: 8 }] }] },
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
        { label: "Öffnen (60 %: Item, 40 %: Falle -10 HP, +30 Gold)", effects: [{ type: "gamble", chance: 0.6, win: [{ type: "gainItem" }], lose: [{ type: "hurt", value: 10 }, { type: "gold", value: 30 }] }] },
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
      name: "Fernkämpfer", hp: 65, stats: { handSize: 1 }, blurb: "Schnell und fragil: Je mehr Karten du spielst, desto stärker jeder Treffer. Markieren, Mehrfachtreffer, Ausweichen.",
      deck: ["schnellschuss", "schnellschuss", "schnellschuss", "schnellschuss", "zielen", "praezisionsschuss", "praezisionsschuss"], shopBasics: ["rolle", "rolle"],
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
      text: "Eisschaden: 6 + 1,5x Waffe. 2 Verwundbar.",
      play: [{ action: "damage", base: 6, weaponScale: 1.5 }, { action: "status", status: "verwundbar", stacks: 2 }] },
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
    kurzbogen: { name: "Kurzbogen", pools: ["fernkaempfer"], power: 2, tags: ["waffe", "fernkampf"] },
    armbrust:  { name: "Armbrust", rarity: "ungewoehnlich", pools: ["fernkaempfer"], power: 3, tags: ["waffe", "fernkampf"] },
    giftbogen: { name: "Giftbogen", rarity: "ungewoehnlich", pools: ["fernkaempfer"], power: 1, tags: ["waffe", "fernkampf", "gift"],
      passives: [{ trigger: "on_card_played", cardTag: "fernkampf", action: "status", status: "gift", stacks: 1, target: "event_target", maxPerTurn: 3 }] },
    jagdbogen: { name: "Jagdbogen", rarity: "selten", pools: ["fernkaempfer"], power: 2, tags: ["waffe", "fernkampf"],
      passives: [{ trigger: "on_card_played", cardTag: "fernkampf", chance: 0.2, action: "draw", value: 1, maxPerTurn: 2 }] },
  },

  items: {
    koecher: { name: "Köcher", pools: ["fernkaempfer"], tags: ["item", "fernkampf"],
      passives: [{ trigger: "damage_calc", cardTag: "fernkampf", op: "add", value: 1 }], text: "Fernkampfkarten: +1 Schaden." },
    munitionsgurt: { name: "Munitionsgurt", pools: ["fernkaempfer"], tags: ["item", "fernkampf"],
      passives: [{ trigger: "on_turn_start", chance: 0.35, action: "draw", value: 1 }], text: "Zugbeginn: 35 % Chance, 1 Karte zu ziehen." },
    adlerauge: { name: "Adlerauge", rarity: "ungewoehnlich", pools: ["fernkaempfer"], tags: ["item", "fernkampf", "debuff"],
      passives: [{ trigger: "on_combat_start", action: "status_all", status: "markiert", stacks: 2 }], text: "Kampfbeginn: alle Gegner 2 Züge markiert." },
    leichtfuessig: { name: "Leichtfüßig", rarity: "ungewoehnlich", pools: ["fernkaempfer"], tags: ["item", "ausweichen"],
      passives: [{ trigger: "on_turn_start", action: "player_status", status: "ausweichen", stacks: 1 }], text: "Zugbeginn: weiche 1 Treffer aus." },
    jagdzeichen: { name: "Jagdzeichen", rarity: "selten", pools: ["fernkaempfer"], tags: ["item", "fernkampf", "debuff"],
      passives: [{ trigger: "on_card_played", cardTag: "fernkampf", chance: 0.3, action: "status", status: "markiert", stacks: 1, target: "random_enemy", maxPerTurn: 3 }],
      text: "Fernkampfkarte gespielt: 30 % Chance, einen Gegner zu markieren." },
    zielfernrohr: { name: "Zielfernrohr", rarity: "selten", pools: ["fernkaempfer"], tags: ["item", "fernkampf"],
      passives: [{ trigger: "damage_calc", cardTag: "fernkampf", requires: { tag: "fernkampf", count: 6 }, op: "pct", value: 0.25 }],
      text: "Ab 6 Fernkampf-Tags: Fernkampfkarten +25 % Schaden." },
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
      name: "Magier", hp: 64, stats: {}, blurb: "Mischen wird belohnt: Zwei verschiedene Elemente nacheinander lösen Reaktionen aus. Wenig HP, viel Kombo.",
      deck: ["funke", "funke", "tropfen", "tropfen", "ranke", "frostnadel", "arkanblitz"], shopBasics: ["manaschild", "manaschild"],
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
      text: "Eisschaden: 8 + Waffe. 2 Verwundbar.", play: [{ action: "damage", base: 8, weaponScale: 1 }, { action: "status", status: "verwundbar", stacks: 2 }] },
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
      text: "Eisschaden an ALLEN: 4 + 0,5x Waffe. 1 Verwundbar auf ALLE.",
      play: [{ action: "damage", base: 4, weaponScale: 0.5, target: "all" }, { action: "status", status: "verwundbar", stacks: 1, target: "all" }] },
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
    zauberstab: { name: "Zauberstab", pools: ["magier"], power: 1, tags: ["waffe", "zauber"],
      passives: [{ trigger: "damage_calc", cardTag: "zauber", op: "add", value: 1 }] },
    flammenstab: { name: "Flammenstab", rarity: "ungewoehnlich", pools: ["magier"], power: 1, tags: ["waffe", "zauber", "feuer"],
      passives: [{ trigger: "damage_calc", cardTag: "feuer", op: "add", value: 2 }] },
    runenstab:  { name: "Runenstab", rarity: "ungewoehnlich", pools: ["magier"], power: 1, tags: ["waffe", "zauber"],
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
      text: "Reaktionen sind 50 % stärker." },
    manaquelle: { name: "Manaquelle", rarity: "selten", pools: ["magier"], tags: ["item", "zauber"], maxStack: 1,
      passives: [{ trigger: "on_reaction", action: "energy", value: 1, maxPerTurn: 1 }], text: "Reaktion: +1 Energie (1x pro Zug)." },
    elementarlinse: { name: "Elementarlinse", rarity: "selten", pools: ["alle"], tags: ["item", "zauber"], stats: { reaction: 30 },
      passives: [{ trigger: "on_reaction", action: "block", value: 3, maxPerTurn: 2 }],
      text: "Reaktionen +30 %. Reaktion: 3 Block (max. 2/Zug). Für alle Klassen!" },
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
    wklassen: { group: "runs", name: "Drei Wege",            text: "Gewinne einen Run mit jeder Klasse.",   check: { mapAll: "winsByClass", of: "classes" }, reward: { kind: "frames", id: "prisma" } },
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
          default: "Du siehst fähig aus. Das reicht mir.",
        } },
        "Unten wimmelt es von Viechern. Sammle Karten, Beute und Gold. Und wenn dir etwas Glitzerndes über den Weg läuft: schnapp es dir. Das lohnt sich.",
        "Der erste Keller liegt gleich hier. Los! Und bring mir die Prinzessin heil zurück!",
      ],
    },
    startladen: {
      speaker: "brumm",
      lines: [
        "Na also, die Ratten hast du schon mal überlebt. Bevor es tiefer geht: Schau dich hier um, ich habe ein paar Sachen für dich. Halber Preis, weil ich dich mag.",
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
const story = __require("content/packs/story.js").default;

const CONTENT = createContent();
[core, ausruestung, feuer, gift, blut, frost, wildnis, boss, events, fernkaempfer, magier, story, achievements, aktiv].forEach((pack) => CONTENT.register(pack));

CONTENT.finalize();
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
__define("engine/map.js", function (__exports, __require) {
// Dungeon-Karte: Ebenen mit verzweigten Pfaden, Abkürzungen (Run-Länge hängt vom Weg ab) und Pflicht-Ebenen.
const { CONFIG } = __require("data/config.js");

function generateMap(rng) {
  const M = CONFIG.map, L = M.layers;
  const layers = [];
  for (let l = 0; l < L; l++) {
    const n = l === 0 ? 1 : M.width[0] + Math.floor(rng.next() * (M.width[1] - M.width[0] + 1));   // Ebene 0: fester Start
    layers.push(Array.from({ length: n }, (_, i) => ({ id: `l${l}n${i}`, layer: l, index: i, type: null, next: [] })));
  }
  const boss = { id: "boss", layer: L, index: 0, type: "boss", next: [] };
  const link = (from, to) => { if (!from.next.includes(to.id)) from.next.push(to.id); };

  // Verbindungen zur nächsten Ebene: jeder Knoten hat einen Ausgang, jeder Knoten einen Eingang
  for (let l = 0; l < L - 1; l++) {
    const a = layers[l], b = layers[l + 1];
    a.forEach((node, i) => {
      const base = a.length === 1 ? 0 : Math.round((i * (b.length - 1)) / (a.length - 1));
      const j = Math.min(b.length - 1, Math.max(0, base + Math.floor(rng.next() * 3) - 1));
      link(node, b[j]);
    });
    b.forEach((node, j) => {
      if (a.some((x) => x.next.includes(node.id))) return;
      const i = Math.min(a.length - 1, Math.round((j * (a.length - 1)) / Math.max(1, b.length - 1)));
      link(a[i], node);
    });
  }
  layers[L - 1].forEach((n) => n.next.push(boss.id));

  // Abkürzungen: eine Ebene überspringen (nie über die Mini-Boss-Ebene oder die Rast vor dem Boss)
  for (let l = 0; l < L - 2; l++) {
    if (l === 0 || l + 1 === M.minibossLayer || l + 1 === L - 1) continue;
    for (const node of layers[l]) {
      if (rng.next() >= M.skipEdgeChance) continue;
      const b = layers[l + 2];
      const j = Math.min(b.length - 1, Math.round((node.index * (b.length - 1)) / Math.max(1, layers[l].length - 1)));
      link(node, b[j]);
    }
  }

  // Knotentypen: Ebene 0 = Kampf, Mini-Boss-Ebene, Rast vor dem Boss, sonst gewichtet mit Regeln
  const parentsOf = (node) => layers.flat().filter((x) => x.next.includes(node.id));
  for (let l = 0; l < L; l++) {
    for (const node of layers[l]) {
      if (l === 0) node.type = "kampf";
      else if (l === M.minibossLayer) node.type = "miniboss";
      else if (l === L - 1) node.type = "rast";
      else {
        const parentTypes = new Set(parentsOf(node).map((p) => p.type));
        const entries = Object.entries(M.nodeWeights)
          .filter(([type]) => l >= (M.minLayer[type] ?? 0))
          .filter(([type]) => !(["rast", "haendler", "elite"].includes(type) && parentTypes.has(type)))
          .filter(([type]) => !(type === "rast" && l === L - 2))
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
const STAT_KEYS = ["luck", "maxHp", "energy", "handSize", "goldPct", "regen", "blockStart", "shiny", "reaction"];

// spec = { deck: [ids], weapon: id, items: [ids] }  ->  Build mit echten Definitionen
function resolveBuild(spec) {
  const items = (spec.items ?? []).map((id) => get("items", id));
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

function magnitude(eff, build) {
  let v = eff.value;
  if (eff.perTag) v *= tagCount(build, eff.perTag, eff.scope);
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
function computeDamage({ build, card, action, target, playsBefore = 0 }) {
  const B = CONFIG.balance;
  let base = action.base + (action.weaponScale ?? 0) * build.weapon.power;
  if (action.bonusPerStatus) {
    base += (target?.statuses[action.bonusPerStatus.status] ?? 0) * action.bonusPerStatus.value;
  }

  if (action.bonusPerPlay) base += Math.min(playsBefore, B.tempoCap) * action.bonusPerPlay;   // Tempo: Karten, die vorher gespielt wurden
  if ((target?.statuses.markiert ?? 0) > 0) base += B.markBonus;                              // Markierung: +Schaden pro Treffer

  let add = 0, pct = 0;
  for (const eff of passivesFor(build, "damage_calc")) {
    if (eff.op !== "add" && eff.op !== "pct") continue;
    if (!conditionsMet(eff, { card, build })) continue;
    const m = magnitude(eff, build);
    if (eff.op === "add") add += m; else pct += m;
  }
  if (add > B.softCapAdd) add = B.softCapAdd + (add - B.softCapAdd) / 2;
  pct = Math.min(pct, B.maxMultBonus);

  const element = action.element ?? card.element;
  const elem = target ? elementMultiplier({ element, enemy: target, build, card }) : 1;
  const vuln = (target?.statuses.verwundbar ?? 0) > 0 ? B.vulnerableMult : 1;

  const amount = Math.max(0, Math.floor((base + add) * (1 + pct) * elem * vuln));
  return { amount, detail: { base, add, pct, elem, vuln } };
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
    diff: CONFIG.difficulty[difficulty] ?? CONFIG.difficulty[0],
    encounter: CONTENT.encounters[encounterId], waveIndex: -1, turn: 0,
    player: { hp: Math.min(playerHp ?? maxHp, maxHp), maxHp, block: 0, energy: 0, statuses: {} },
    lastElement: null, fx: [], killLog: [], usedItems: [],
    // Zähler für Erfolge: höchster Einzeltreffer, erlittener Schaden, Karten/Reaktionen pro Zug, höchster Status-Stapel
    metrics: { plays: 0, reactions: 0, reactionIds: [], maxHit: 0, damageTaken: 0, maxPlaysTurn: 0, reactionsTurn: 0, maxReactionsTurn: 0, maxStatus: {} },
    piles: {
      draw: rng.shuffle(build.cards.map((def, uid) => ({ uid, def }))),
      hand: [], discard: [],
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
  const hp = Math.round(def.hp * s.diff.hpMult * (shiny ? CONFIG.shiny.enemyHpMult : 1));
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
  const i = getIntent(e);
  return i.type === "attack" ? { ...i, value: Math.max(1, Math.round(i.value * CONFIG.balance.enemyDmgScale * s.diff.dmgMult)) } : i;
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
      s.result = "won";
      s.player.hp = Math.min(s.player.maxHp, s.player.hp + s.build.stats.regen);   // Regeneration nach dem Kampf
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
  s.counters = {};
  s.playsThisTurn = 0;
  s.metrics.reactionsTurn = 0;
  s.player.block = s.build.stats.blockStart;
  s.player.energy = CONFIG.player.startEnergy + s.build.stats.energy;
  s.player.statuses.ausweichen = 0;     // Ausweichen hält nur einen Zug
  s.lastElement = null;                 // Reaktionen gelten nur innerhalb eines Zuges
  log(s, `=== Zug ${s.turn} (HP ${s.player.hp}/${s.player.maxHp})`);
  fx(s, { t: "turn", n: s.turn });
  emit(s, "on_turn_start", {}, 0);
  draw(s, CONFIG.player.handSize + s.build.stats.handSize);
}

// ---------------------------------------------------------------- Schaden / Status
function dealDamage(s, enemy, amount, source, { pierce = false, note = "", depth = 0 } = {}) {
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
    return;
  }
  let rest = amount, blocked = 0;
  if (!pierce) {
    blocked = Math.min(enemy.block, rest);
    enemy.block -= blocked;
    rest -= blocked;
  }
  enemy.hp = Math.max(0, enemy.hp - rest);
  log(s, `  ${source}: ${enemy.name} -${rest}${note}${enemy.hp === 0 ? " (besiegt)" : ` (HP ${enemy.hp})`}`);
  fx(s, { t: "hit", uid: enemy.uid, amount: rest, blocked, pierce, strong: note.includes("sehr"), weak: note.includes("resistent") });
  if (enemy.hp > 0) checkPhases(s, enemy);
  if (wasAlive && enemy.hp === 0) {
    fx(s, { t: "kill", uid: enemy.uid, shiny: enemy.shiny });
    s.killLog.push({ id: enemy.id, shiny: Boolean(enemy.shiny) });
    if (enemy.shiny) { s.shinyKills.push(enemy.id); log(s, `  *** ${enemy.name} war SHINY! ***`); }
    emit(s, "on_kill", { target: enemy }, depth);
  }
}

function damagePlayer(s, amount, source, attacker) {
  if ((s.player.statuses.ausweichen ?? 0) > 0) {   // Ausweichen: ein Treffer geht komplett daneben
    s.player.statuses.ausweichen--;
    log(s, `  ${source} verfehlt dich (Ausweichen)`);
    fx(s, { t: "dodge", uid: attacker?.uid });
    return;
  }
  const absorbed = Math.min(s.player.block, amount);
  s.player.block -= absorbed;
  const lost = amount - absorbed;
  s.player.hp -= lost;
  s.metrics.damageTaken += lost;
  log(s, `  ${source} trifft dich für ${lost} (Block ${absorbed})`);
  fx(s, { t: "phit", uid: attacker?.uid, amount: lost, blocked: absorbed });
  if (s.player.hp <= 0) { s.result = "lost"; return; }
  if (lost > 0) emit(s, "on_player_hit", { target: attacker }, 0);
}

function applyStatus(s, enemy, status, stacks, depth) {
  enemy.statuses[status] = (enemy.statuses[status] ?? 0) + stacks;
  s.metrics.maxStatus[status] = Math.max(s.metrics.maxStatus[status] ?? 0, enemy.statuses[status]);
  log(s, `  ${enemy.name} +${stacks} ${status}`);
  fx(s, { t: "status", uid: enemy.uid, status, stacks });
  emit(s, "on_status_applied", { target: enemy, status, stacks }, depth + 1);
}

// ---------------------------------------------------------------- Trigger-Ketten
// Trigger: on_combat_start | on_turn_start | on_turn_end | on_card_played | on_status_applied | on_kill | on_player_hit | on_reaction
function emit(s, event, payload, depth) {
  if (depth > CONFIG.balance.maxChainDepth) return;
  for (const eff of passivesFor(s.build, event)) {
    if (s.result) return;
    if (!conditionsMet(eff, { card: payload.card, build: s.build })) continue;
    if (eff.whenStatus && payload.status !== eff.whenStatus) continue;
    const used = s.counters[eff.key] ?? 0;
    if (eff.maxPerTurn !== undefined && used >= eff.maxPerTurn) continue;
    if (eff.chance !== undefined && s.rng.next() >= eff.chance) continue;
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
    case "heal":  { const v = magnitude(eff, s.build); P.hp = Math.min(P.maxHp, P.hp + v); log(s, `  ${eff.sourceName}: +${v} HP`); fx(s, { t: "heal", amount: v }); return; }
    case "hurt":  { const v = magnitude(eff, s.build); P.hp = Math.max(1, P.hp - v); log(s, `  ${eff.sourceName}: -${v} HP`); return; }
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

// Wirkungen einer Karte (oder eines aktiven Items) ausführen. def = { play: [...], element?, tags, name }
function runActions(s, def, chosen) {
  for (const action of def.play) {
    const targets = action.target === "all" ? aliveEnemies(s) : (chosen && chosen.hp > 0 ? [chosen] : []);
    if (action.action === "damage") {
      for (const t of targets) {
        for (let h = 0; h < (action.hits ?? 1); h++) {
          const { amount, detail } = computeDamage({ build: s.build, card: def, action, target: t, playsBefore: s.playsThisTurn - 1 });
          s.metrics.maxHit = Math.max(s.metrics.maxHit, amount);
          const note = detail.elem > 1 ? " [sehr effektiv]" : detail.elem < 1 ? " [resistent]" : "";
          dealDamage(s, t, amount, def.name, { note });
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
    } else if (action.action === "heal") {
      const before = s.player.hp;
      s.player.hp = Math.min(s.player.maxHp, s.player.hp + action.value);
      if (s.player.hp > before) fx(s, { t: "heal", amount: s.player.hp - before });
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
  s.piles.discard.push(inst);
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

function endPlayerTurn(s) {
  if (s.result) return;
  emit(s, "on_turn_end", {}, 0);
  checkProgress(s);
  if (s.result) return;
  s.piles.discard.push(...s.piles.hand);
  s.piles.hand = [];
  enemyPhase(s);
  if (!s.result) startPlayerTurn(s);
}

// ---------------------------------------------------------------- Gegnerphase
function tickStatuses(s, e) {
  const st = e.statuses;
  // Gift: Schaden = Stapel (ignoriert Block), Stapel -1
  if (st.gift > 0) { dealDamage(s, e, st.gift, "Gift", { pierce: true }); st.gift--; }
  // Blutung: Schaden = Stapel (ignoriert Block), Stapel halbiert
  if (st.blutung > 0 && e.hp > 0) { dealDamage(s, e, st.blutung, "Blutung", { pierce: true }); st.blutung = Math.floor(st.blutung / 2); }
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
__exports.activeDef = activeDef;
__exports.activeItems = activeItems;
__exports.useItem = useItem;
__exports.playCard = playCard;
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
  stats: { kills: 0, fightsWon: 0, elites: 0, minibosses: 0, shinyEnemies: 0, winsByClass: {}, winsByWeapon: {} },
  // Was schon einmal gefunden/erlebt wurde (Grundlage für "alle Items gefunden" usw.), Schlüssel = Basis-ID ohne Shiny-Endung
  discovered: { items: {}, cards: {}, weapons: {}, enemies: {}, reactions: {} },
  achievements: {},                                   // id -> { at }
  cosmetics: { skin: {}, frame: "default" },          // gewählte Farbvariante je Held und Kartenrahmen
  settings: { speed: 1, manual: false, autoEnd: true }, // Kampf-Bedienung: Tempo, manuelles Zielen, Zug automatisch beenden
});

// Ergänzt bei älteren Spielständen fehlende Felder (neue Funktionen, alter Fortschritt bleibt erhalten)
function normalizeMeta(meta) {
  const base = createMeta();
  for (const k of Object.keys(base)) {
    if (meta[k] === undefined) meta[k] = base[k];
    else if (base[k] && typeof base[k] === "object" && !Array.isArray(base[k])) meta[k] = { ...base[k], ...meta[k] };
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
const maxDifficulty = (meta) => Math.min(CONFIG.difficulty.length - 1, meta.highestWon + 1);

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
  for (const kind of ["cards", "weapons", "items", "skins", "frames"]) {
    for (const d of Object.values(CONTENT[kind])) {
      const key = `${kind}/${d.id}`;
      if (d.unlock && !meta.unlocked[key] && conditionMet(meta, d.unlock)) { meta.unlocked[key] = true; fresh.push({ kind, id: d.id, name: d.name }); }
    }
  }
  return fresh;
}

function recordRun(meta, run, won) {
  meta.runs++;
  if (won) {
    meta.wins++;
    meta.bossKills++;
    meta.highestWon = Math.max(meta.highestWon, run.difficulty);
    const st = meta.stats;
    st.winsByClass[run.classId] = (st.winsByClass[run.classId] ?? 0) + 1;
    const w = baseId(run.startWeapon ?? run.weapon);
    st.winsByWeapon[w] = (st.winsByWeapon[w] ?? 0) + 1;
  }
  const before = maxDifficulty(meta);
  const unlocks = evaluateUnlocks(meta);
  return { unlocks, newDifficulty: won && before > run.difficulty ? CONFIG.difficulty[before]?.name : null };
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
function rarityWeights({ luck = 0, depth = 0 }) {
  const L = Math.min(Math.max(luck, 0), CONFIG.luck.maxLuck);
  const out = {};
  for (const [r, { weight }] of Object.entries(CONFIG.rarities)) {
    const factor = 1 + L * (CONFIG.luck.perPoint[r] ?? 0) + depth * (CONFIG.depthBonus[r] ?? 0);
    out[r] = { weight: weight * factor };
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
    (d.pools.includes("alle") || d.pools.includes(ctx.classId)));
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
  return ctx.rng.weighted(list.map((d) => ({ value: d, weight: dom ? biasWeight(d, dom) : 1 })));
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

const generateWeaponChoices = (ctx, n = 2) => pickMany(ctx, "weapons", n, 1);

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
function priceFor(rng, kind, def) {
  const S = CONFIG.shop;
  const base = S.basePrice[def.rarity] * (kind === "items" ? S.itemFactor : 1) * (def.shiny ? CONFIG.shiny.priceMult : 1);
  const jitter = 1 + (rng.next() * 2 - 1) * S.priceVariance;
  return Math.round((base * jitter) / 5) * 5;
}
const slot = (rng, kind, def) => ({
  kind, id: def.id, name: def.name, rarity: def.rarity, shiny: Boolean(def.shiny),
  price: priceFor(rng, kind, def), sold: false,
});

// Startladen nach dem ersten Kampf: halbe Preise, die Grundkarten der Klasse (z. B. Schild) fest dabei, sonst nur einfache Ware
function generateStartShop(ctx) {
  const S = CONFIG.shop, cls = CONTENT.classes[ctx.classId];
  const cheap = (kind, def) => ({ ...slot(ctx.rng, kind, def), price: Math.max(5, Math.round((priceFor(ctx.rng, kind, def) * S.startDiscount) / 5) * 5) });
  const basics = cls.shopBasics.map((id) => ({ ...cheap("cards", CONTENT.get("cards", id)), fixed: true }));
  const pickPlain = (kind, rarities, n, exclude) => {                                   // zufällig aus einfachen Seltenheiten, ohne Wiederholung
    const out = [], taken = new Set(exclude);
    for (let i = 0; i < n; i++) {
      const list = rarities.flatMap((r) => candidates(kind, ctx, r, taken));
      if (!list.length) break;
      const def = ctx.rng.pick(list); taken.add(def.id); out.push(maybeShiny(ctx, kind, def));
    }
    return out;
  };
  const cards = pickPlain("cards", ["gewoehnlich"], Math.max(0, S.cardSlots - basics.length), cls.shopBasics).map((d) => cheap("cards", d));
  const items = pickPlain("items", ["gewoehnlich", "ungewoehnlich"], S.itemSlots, maxedItems(ctx.build)).map((d) => cheap("items", d));
  return { cards: [...basics, ...cards], items, removeCost: S.removeBase, removals: 0, rerollCost: S.rerollBase, rerolls: 0, start: true };
}

function generateShop(ctx) {
  const S = CONFIG.shop;
  return {
    cards: pickMany(ctx, "cards", S.cardSlots, S.wildcardCards).map((d) => slot(ctx.rng, "cards", d)),
    items: pickMany(ctx, "items", S.itemSlots, S.wildcardItems, maxedItems(ctx.build)).map((d) => slot(ctx.rng, "items", d)),
    removeCost: S.removeBase, removals: 0,
    rerollCost: S.rerollBase, rerolls: 0,
  };
}

// Würfelt alle noch NICHT gekauften Slots neu. Kostet Gold, jeder Reroll wird teurer.
function rerollShop(shop, ctx, run) {
  if (run.gold < shop.rerollCost) return { ok: false, reason: "Zu wenig Gold" };
  run.gold -= shop.rerollCost;
  shop.rerollCost += CONFIG.shop.rerollIncrement;
  shop.rerolls++;
  const shown = new Set([...shop.cards, ...shop.items].map((s) => baseOf(s.id)));
  for (const [list, kind, wild] of [[shop.cards, "cards", CONFIG.shop.wildcardCards], [shop.items, "items", CONFIG.shop.wildcardItems]]) {
    list.forEach((s, i) => {
      if (s.sold || s.fixed) return;                          // verkaufte und feste Grundkarten bleiben
      const exclude = new Set([...shown, ...(kind === "items" ? maxedItems(ctx.build) : [])]);
      const def = pickOne(ctx, kind, exclude, i < list.length - wild);
      if (!def) return;
      shown.add(def.id);
      list[i] = slot(ctx.rng, kind, maybeShiny(ctx, kind, def));
    });
  }
  return { ok: true };
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
  if (run.gold < shop.removeCost) return { ok: false, reason: "Zu wenig Gold" };
  run.gold -= shop.removeCost;
  shop.removeCost += CONFIG.shop.removeIncrement;
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
__exports.generateStartShop = generateStartShop;
__exports.generateShop = generateShop;
__exports.rerollShop = rerollShop;
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
const { createRng } = __require("engine/rng.js");
const { generateMap, findNode } = __require("engine/map.js");
const { resolveBuild } = __require("engine/modifiers.js");
const { createCombat } = __require("engine/combat.js");
const { recordShiny } = __require("engine/dex.js");
const { recordRun, discover, recordCombat, isUnlocked } = __require("engine/meta.js");
const { evaluateAchievements } = __require("engine/achievements.js");
const { generateCardReward, generateItemChoices, generateWeaponChoices, generateShinyItemChoices, generateShop, generateStartShop, rerollShop, buy, payRemoval, goldDrop, generateShinyWeaponChoices } = __require("engine/loot.js");

const RARITY_RANK = { gewoehnlich: 0, ungewoehnlich: 1, selten: 2, legendaer: 3 };
const fail = (reason) => ({ ok: false, reason });
const ok = (extra = {}) => ({ ok: true, ...extra });

// ---------------------------------------------------------------- Aufbau
// Shiny-Held: wird beim Run-Start einmal gewürfelt (bewusst NICHT vom Seed abhängig, damit man keine Seeds "farmen" kann).
const rollShinyHero = (rand = Math.random) => rand() < CONFIG.shiny.heroChance;

function createRun({ classId = "nahkaempfer", seed = (Date.now() >>> 0), difficulty = 0, meta, weapon, shinyHero = false } = {}) {
  const cls = CONTENT.classes[classId];
  const startWeapon = cls.starterWeapons.includes(weapon) ? weapon : cls.starterWeapons[0];
  const rng = createRng(seed);
  const run = {
    seed, classId, difficulty, meta, rng, shinyHero: Boolean(shinyHero),
    phase: "intro", map: generateMap(rng), nodeId: null,
    hp: 0, maxHp: 0, bonusMaxHp: 0, gold: CONFIG.run.startGold,
    deck: [...cls.deck], weapon: startWeapon, startWeapon, items: [...(cls.items ?? [])],
    skin: pickSkin(meta, classId), achQueue: [], achDone: [],
    pending: { story: "intro" }, seenEncounters: [], usedEvents: [], summary: null, path: [], verbose: false,
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
  queueAch(run, { type: "pickup" });
}
// Für die Oberfläche: neu erreichte Erfolge abholen (Meldung einblenden)
const takeNewAchievements = (run) => (run?.achQueue ?? []).splice(0);

const specOf = (run) => {
  const cls = CONTENT.classes[run.classId];
  const stats = { ...cls.stats, luck: (cls.stats.luck ?? 0) + (run.shinyHero ? CONFIG.shiny.heroLuck : 0) };   // Chrom-Held: +1 Glück
  return { deck: run.deck, weapon: run.weapon, items: run.items, hp: cls.hp, stats };
};
const buildOf = (run) => resolveBuild(specOf(run));
const computeMaxHp = (run) => Math.max(1, CONTENT.classes[run.classId].hp + run.bonusMaxHp + buildOf(run).stats.maxHp);
const currentLayer = (run) => (run.nodeId ? findNode(run.map, run.nodeId).layer : 0);
const ctxOf = (run) => {
  const build = buildOf(run);
  return { rng: run.rng, build, classId: run.classId, depth: currentLayer(run), luck: build.stats.luck, meta: run.meta };
};

// Neue Max-HP-Boni heilen um den Zuwachs (wie bei Slay the Spire)
function refreshMaxHp(run) {
  const next = computeMaxHp(run);
  if (next > run.maxHp) run.hp += next - run.maxHp;
  run.maxHp = next;
  run.hp = Math.min(run.hp, run.maxHp);
}
const addItem = (run, id) => { run.items.push(id); refreshMaxHp(run); found(run, "items", id); };
const addCard = (run, id) => { run.deck.push(id); found(run, "cards", id); };
const setWeapon = (run, id) => { run.weapon = id; found(run, "weapons", id); };
const backToMap = (run) => { run.phase = "map"; run.pending = null; };

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
  if (layer === 0 && CONFIG.map.firstEncounter) { run.seenEncounters.push(CONFIG.map.firstEncounter); return CONFIG.map.firstEncounter; }
  const kind = nodeKind === "kampf" ? "normal" : nodeKind;
  const tier = layer < CONFIG.map.tierSplit ? 1 : 2;
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
function completeCombat(run) {
  if (run.phase !== "combat") return fail("Kein Kampf aktiv");
  const { combat, kind } = run.pending;
  if (!combat.result) return fail("Kampf läuft noch");
  run.hp = Math.max(0, combat.player.hp);
  run.stats.fights++;
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
  if (kind === "boss") return endRun(run, true);

  const ctx = ctxOf(run);
  const [lo, hi] = CONFIG.gold[kind];
  const bonus = combat.shinyKills.length ? CONFIG.shiny.enemyGold : 0;                 // Chrom-Gegner besiegt: Extra-Gold
  const gold = goldDrop(ctx, lo + Math.floor(run.rng.next() * (hi - lo + 1))) + bonus;
  run.gold += gold;
  run.stats.goldEarned += gold;
  queueAch(run, { type: "state" });                       // z. B. 500 Gold gleichzeitig

  const reward = { gold, shinyBonus: bonus, cards: generateCardReward(ctx).map((d) => d.id), items: [], weapons: [], shinyItems: [], shinyWeapons: [], taken: {} };
  if (kind === "elite" || kind === "miniboss" || run.rng.next() < CONFIG.run.normalItemChance) {
    reward.items = generateItemChoices(ctx).map((d) => d.id);
  }
  if (kind === "miniboss") reward.weapons = generateWeaponChoices(ctx).map((d) => d.id);
  if (combat.shinyKills.length) {
    reward.shinyItems = generateShinyItemChoices(ctx).map((d) => d.id);
    reward.shinyWeapons = generateShinyWeaponChoices(ctx).map((d) => d.id);
    if (run.meta) {                                           // Chrom-Funde gelten als gefunden (Sammlung), auch wenn man sie nicht wählt
      for (const id of reward.shinyItems) recordShiny(run.meta.dex, "items", id);
      for (const id of reward.shinyWeapons) recordShiny(run.meta.dex, "weapons", id);
    }
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
    if (run.meta) recordShiny(run.meta.dex, kind, id);
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
  if (!run.startShopDone && run.stats.fights === 1) {          // nach dem ersten (leichten) Kampf: Startladen mit Grundausrüstung
    run.startShopDone = true;
    const shop = generateStartShop(ctxOf(run));
    countShiny(run, [...shop.cards, ...shop.items].map((s) => ({ id: s.id, kind: s.kind })));
    run.phase = "shop"; run.pending = { shop };
    return ok({ startShop: true });
  }
  backToMap(run);
  return ok();
}

// ---------------------------------------------------------------- Rast
function restHeal(run) {
  if (run.phase !== "rest") return fail("Nicht an einer Rast");
  run.hp = Math.min(run.maxHp, run.hp + Math.ceil(run.maxHp * CONFIG.run.restHealPct));
  backToMap(run);
  return ok();
}
function restRemove(run, deckIndex) {
  if (run.phase !== "rest") return fail("Nicht an einer Rast");
  if (run.deck.length <= CONFIG.run.minDeck || !run.deck[deckIndex]) return fail("Karte kann nicht entfernt werden");
  run.deck.splice(deckIndex, 1);
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
  return res;
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
function leaveShop(run) {
  if (run.phase !== "shop") return fail("Nicht im Shop");
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
      case "heal": run.hp = Math.min(run.maxHp, run.hp + e.value); break;
      case "healPct": run.hp = Math.min(run.maxHp, run.hp + Math.ceil(run.maxHp * e.value)); break;
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
__exports.completeCombat = completeCombat;
__exports.takeCard = takeCard;
__exports.takeItem = takeItem;
__exports.takeWeapon = takeWeapon;
__exports.takeShinyItem = takeShinyItem;
__exports.takeShinyWeapon = takeShinyWeapon;
__exports.finishReward = finishReward;
__exports.restHeal = restHeal;
__exports.restRemove = restRemove;
__exports.shopBuy = shopBuy;
__exports.shopReroll = shopReroll;
__exports.shopRemove = shopRemove;
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
const { aliveEnemies, intentOf, activeItems } = __require("engine/combat.js");
const { computeDamage } = __require("engine/modifiers.js");

// Braucht die Karte ein einzelnes Ziel? (Flächen-, Block- und Zieh-Karten nicht)
const needsTarget = (def) =>
  def.play.some((a) => ["damage", "status", "multiplyStatus"].includes(a.action) && a.target !== "all");

function hasPlayable(s) {
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

function statusValue(status, stacks, t) {
  const have = t.statuses[status] ?? 0;
  switch (status) {
    case "gift": return (stacks * (stacks + 1) / 2) * 0.75 + (have > 0 ? stacks * 0.5 : 0);   // Gift tickt mit abnehmender Stärke
    case "blutung": return stacks * 1.6;
    case "verwundbar": return have > 1 ? 1 : 4 + stacks;
    case "markiert": return have > 1 ? 0.5 : 3.5;
    default: return 1;
  }
}

// Wert einer Karte gegen ein bestimmtes Ziel
function cardValue(s, def, target, th) {
  const alive = aliveEnemies(s);
  let v = 0;
  for (const a of def.play) {
    if (a.action === "damage") {
      for (const t of a.target === "all" ? alive : [target]) {
        for (let h = 0; h < (a.hits ?? 1); h++) {
          if (t.plates > 0) { v += 2.4; continue; }                                  // Panzerplatten: jeder Treffer zählt, Schaden nicht
          const { amount } = computeDamage({ build: s.build, card: def, action: a, target: t, playsBefore: s.playsThisTurn });
          const room = t.hp + t.block;
          v += Math.min(amount, room);
          if (amount >= room) v += 4;                                                // Kill-Bonus
        }
      }
    } else if (a.action === "block") v += Math.min(a.value, th.needBlock) * 1.15 + (th.needBlock > 0 ? 0 : 0.2);
    else if (a.action === "playerStatus") v += th.hits > 0 ? Math.min(a.stacks, th.hits) * 4 : 0.2;
    else if (a.action === "status") for (const t of a.target === "all" ? alive : [target]) v += statusValue(a.status, a.stacks, t);
    else if (a.action === "multiplyStatus") for (const t of a.target === "all" ? alive : [target]) v += (t.statuses[a.status] ?? 0) * 0.9;
    else if (a.action === "draw") v += s.piles.hand.length < 5 ? 2.6 * a.value : a.value;
    else if (a.action === "energy") v += 3;
    else if (a.action === "heal") v += Math.min(a.value, s.player.maxHp - s.player.hp) * (s.player.hp < s.player.maxHp * 0.6 ? 1.3 : 0.15);
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
  on_status_applied: "Status aufgetragen", on_kill: "Gegner besiegt", on_player_hit: "Du wirst getroffen", on_reaction: "Reaktion",
};
function actionText(p) {
  const v = p.value;
  switch (p.action) {
    case "block": return `${v} Block`;
    case "heal": return `heile ${v} HP`;
    case "hurt": return `verliere ${v} HP`;
    case "draw": return `ziehe ${v} Karte(n)`;
    case "energy": return `+${v} Energie`;
    case "damage": return `${v} Schaden`;
    case "damage_all": return `${v} Schaden an ALLE`;
    case "status": return `${p.stacks}x ${p.status}`;
    case "status_all": return `${p.stacks}x ${p.status} auf ALLE`;
    case "player_status": return `${p.stacks}x ${p.status}`;
    default: return "";
  }
}
function describePassive(p) {
  if (p.trigger === "damage_calc") {
    const who = p.cardTag ? `${cap(p.cardTag)}-Karten` : "Alle Karten";
    const what = p.op === "add" ? `+${p.value} Schaden` : p.op === "pct" ? `+${Math.round(p.value * 100)} % Schaden`
      : p.op === "ignore_resist" ? "ignorieren Resistenzen" : "Schwächen +" + p.value;
    return `${who}: ${what}${p.perTag ? ` pro ${p.perTag}-Tag` : ""}${p.cap ? ` (max. ${p.cap})` : ""}${p.requires ? ` ab ${p.requires.count} ${p.requires.tag}-Tags` : ""}`;
  }
  return `${TRIGGER[p.trigger] ?? p.trigger}: ${actionText(p)}${p.chance ? ` (${Math.round(p.chance * 100)} %)` : ""}${p.maxPerTurn ? `, max. ${p.maxPerTurn}/Zug` : ""}`;
}
function describeWeapon(def) {
  const parts = [`Stärke ${def.power}`, ...def.passives.map(describePassive)];
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
function resolveRig(spec, { grid, pal, W, H, shiny }) {
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
const seqValues = (seq) => seq.map(([dx, dy]) => `${dx} ${dy}`).join(";");
const seqTimes = (seq) => seq.map((_, i) => (i / seq.length).toFixed(3)).join(";");
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
    const moving = `<g>${pathsOf(r.own)}${r.over.join("")}${r.kids.map(render).join("")}<animateTransform attributeName="transform" type="translate" calcMode="discrete" values="${seqValues(r.seq)}" keyTimes="${seqTimes(r.seq)}" dur="${r.dur}s" begin="${-(r.phase ?? 0)}s" repeatCount="indefinite"/></g>`;
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
};

__exports.WEAPON_SHAPES = WEAPON_SHAPES;
__exports.WEAPON_ASYM = WEAPON_ASYM;
__exports.WEAPON_ART = WEAPON_ART;

});
__define("ui/art/chars2.js", function (__exports, __require) {
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
const { HEROES, NPCS, ENEMIES, ENEMY_SCALE } = __require("ui/art/chars2.js");
const { RIGS } = __require("ui/art/rigs.js");
const rigged = (def, id) => (RIGS[id] ? { ...def, rig: RIGS[id] } : def);   // Idle-Animation anhängen
const { ALL_ICONS } = __require("ui/art/icons.js");


const pal = (p) => (typeof p === "string" ? PALETTES[p] : p);

function itemPixels(id, opts = {}) {
  const [shape, palette, mark] = ITEM_ART[id];
  return pixels(SHAPES[shape], { pal: PALETTES[palette], mark: mark ? MARKS[mark] : null, ...opts });
}
const WEAPON_IDS = Object.keys(WEAPON_ART);
function weaponPixels(id, opts = {}) {
  const a = WEAPON_ART[id];
  const def = a.shape ? WEAPON_SHAPES[a.shape] : { rows: Array.isArray(WEAPON_ASYM[a.asym]) ? WEAPON_ASYM[a.asym] : WEAPON_ASYM[a.asym].rows };
  return pixels(def, { pal: pal(a.pal), ...opts });
}
const HERO_IDS = [...Object.keys(HEROES), ...Object.keys(NPCS)];
const heroPixels = (id, opts = {}) => pixels(rigged(HEROES[id] ?? NPCS[id], id), opts);
const ENEMY_IDS = Object.keys(ENEMIES);
const enemyPixels = (id, opts = {}) => pixels(rigged(ENEMIES[id], id), opts);
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
__exports.ICON_IDS = ICON_IDS;
__exports.iconPixels = iconPixels;
__exports.spr = spr;
__exports.sprSize = sprSize;
__exports.cardIconId = cardIconId;
__exports.elementIconId = elementIconId;

});
__define("ui/theme.js", function (__exports, __require) {
// Namen und Farben für die Oberfläche (keine Emojis, die Symbole kommen aus ui/art).
const { CONTENT } = __require("content/index.js");

const elementColor = (id) => CONTENT.elements[id]?.color ?? "#8a8a9a";
const elementName = (id) => CONTENT.elements[id]?.name ?? id;

// Status -> [Symbol-ID, Name]
const STATUS = {
  gift: ["poison", "Gift"], blutung: ["blood", "Blutung"], verwundbar: ["crack", "Verwundbar"], markiert: ["mark", "Markiert"], ausweichen: ["wind", "Ausweichen"],
};
const NODE_ICON = { kampf: "n_kampf", elite: "n_elite", miniboss: "n_miniboss", rast: "n_rast", haendler: "n_haendler", ereignis: "n_ereignis", boss: "n_boss" };
const NODE_NAME = { kampf: "Kampf", elite: "Elite", miniboss: "Mini-Boss", rast: "Rast", haendler: "Händler", ereignis: "Ereignis", boss: "Endboss" };
const RARITY = { gewoehnlich: ["Gewöhnlich", "#9aa4b2"], ungewoehnlich: ["Ungewöhnlich", "#4fc27a"], selten: ["Selten", "#5aa0ff"], legendaer: ["Legendär", "#ffb347"] };
const CLASS_ART = { nahkaempfer: "nahkaempfer", fernkaempfer: "fernkaempfer", magier: "magier" };

__exports.elementColor = elementColor;
__exports.elementName = elementName;
__exports.STATUS = STATUS;
__exports.NODE_ICON = NODE_ICON;
__exports.NODE_NAME = NODE_NAME;
__exports.RARITY = RARITY;
__exports.CLASS_ART = CLASS_ART;

});
__define("ui/widgets.js", function (__exports, __require) {
// Wiederverwendbare Bausteine als HTML-Strings: Symbole, Karten, Items, Balken, Logo. Keine Emojis, alles aus ui/art.
const { CONTENT } = __require("content/index.js");
const { computeDamage } = __require("engine/modifiers.js");
const { spr, cardIconId, elementIconId } = __require("ui/art/index.js");
const { esc, describeItem, describeWeapon } = __require("ui/util.js");
const { elementColor, STATUS, RARITY } = __require("ui/theme.js");

const at = (action, arg, arg2) => ` data-action="${action}"${arg !== undefined ? ` data-arg="${esc(arg)}"` : ""}${arg2 !== undefined ? ` data-arg2="${esc(arg2)}"` : ""}`;
const ico = (id, px = 16, o = {}) => spr("icon", id, { attrs: `width="${px}" height="${px}"`, cls: o.cls ?? "", ...(o.pal ? { pal: o.pal } : {}) });
const btn = (label, action, arg, o = {}) =>
  `<button class="btn ${o.cls ?? ""}"${o.disabled ? " disabled" : at(action, arg, o.arg2)}>${label}</button>`;
const ibtn = (iconId, action, label, extra = "") => `<button class="ibtn"${at(action)} aria-label="${esc(label)}">${ico(iconId, 22)}${extra}</button>`;
const pctOf = (a, b) => Math.max(0, Math.min(100, Math.round((a / Math.max(1, b)) * 100)));
const bar = (frac, cls = "") => `<div class="bar ${cls}"><i style="width:${pctOf(frac * 100, 100)}%"></i></div>`;

// ---------------------------------------------------------------- Karten
// Kennzahlen einer Karte (aktueller Schaden inkl. Waffe und Items), als kleine Symbol-Zahl-Paare
function cardChips(def, build, playsBefore = 0) {
  const raw = [];
  for (const a of def.play) {
    if (a.action === "damage") {
      const { amount } = computeDamage({ build, card: def, action: a, target: null, playsBefore });
      raw.push([a.target === "all" ? "c_burst" : "sword", `${amount}${(a.hits ?? 1) > 1 ? "x" + a.hits : ""}`]);
    } else if (a.action === "block") raw.push(["shield", String(a.value)]);
    else if (a.action === "status") raw.push([STATUS[a.status]?.[0] ?? "star", `${a.stacks}${a.target === "all" ? "+" : ""}`]);
    else if (a.action === "multiplyStatus") raw.push([STATUS[a.status]?.[0] ?? "star", "x2"]);
    else if (a.action === "draw") raw.push(["pile", String(a.value)]);
    else if (a.action === "playerStatus") raw.push([STATUS[a.status]?.[0] ?? "wind", String(a.stacks)]);
    else if (a.action === "energy") raw.push(["bolt", String(a.value)]);
  }
  const merged = [], seen = new Map();
  for (const [ic, n] of raw) { const k = ic + n; if (seen.has(k)) seen.get(k).count++; else { const e = { ic, n, count: 1 }; seen.set(k, e); merged.push(e); } }
  return merged.slice(0, 4).map((e) => ({ ic: e.ic, n: e.count > 1 ? `${e.n}x${e.count}` : e.n }));
}

// o: { build, size: "sm" (Hand) | "lg", selected, dim, action, arg, arg2, count, plays }
function cardHtml(def, o = {}) {
  const el = def.element ? elementColor(def.element) : "#6e6a80";
  const rar = RARITY[def.rarity] ?? RARITY.gewoehnlich;
  const chips = o.build ? cardChips(def, o.build, o.plays ?? 0) : [];
  const icon = cardIconId(def);
  const art = spr("icon", icon, { shiny: def.shiny, attrs: 'width="100%" height="100%"' });
  const glow = `rgba(${[1, 3, 5].map((i) => parseInt(el.slice(i, i + 2), 16)).join(",")},.38)`;
  return `<div class="card ${o.size ?? "sm"} ${def.shiny ? "shiny sh" : ""} ${o.selected ? "sel" : ""} ${o.dim ? "dim" : ""}" style="--el:${el};--rar:${rar[1]};--elg:${glow}"${o.action ? at(o.action, o.arg, o.arg2) : ""}>
    <div class="c-top"><span class="c-cost">${ico("bolt", 12)}${def.cost}</span><span class="c-name">${esc(def.name)}</span></div>
    <div class="c-art">${art}</div>
    <div class="c-chips">${chips.map((c) => `<span class="chip2">${ico(c.ic, 12)}<b>${esc(c.n)}</b></span>`).join("")}</div>
    ${o.size === "lg" ? `<div class="c-text">${esc(def.text ?? "")}</div>` : ""}
    <div class="c-foot" style="background:${rar[1]}">${o.count > 1 ? `x${o.count}` : esc(rar[0])}</div></div>`;
}

// ---------------------------------------------------------------- Items und Waffen
function itemHtml(def, kind = "items", o = {}) {
  const rar = RARITY[def.rarity] ?? RARITY.gewoehnlich;
  const art = spr(kind === "weapons" ? "weapon" : "item", def.id.replace(/:s$/, ""), { shiny: def.shiny, attrs: 'width="100%" height="100%"' });
  const text = kind === "weapons" ? describeWeapon(def) : describeItem(def);
  return `<div class="itemcard ${def.shiny ? "shiny sh" : ""}" style="--rar:${rar[1]}">
    <div class="i-art ${kind === "weapons" ? "tall" : ""}">${art}</div>
    <div class="i-body"><b>${esc(def.name)}</b><span class="rar" style="color:${rar[1]}">${esc(rar[0])}${kind === "weapons" ? " · Waffe" : ""}</span><span class="d">${esc(text)}</span></div></div>`;
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
};
function logoText(textStr = "ROGUE-DECK") {
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
  return `<svg class="logo" viewBox="-1 -1 ${width + 3} 10" shape-rendering="crispEdges" role="img" aria-label="Rogue-Deck"><g fill="#17121f">${shadow}</g>${main}${sheen}</svg>`;
}

// Wahrzeichen des Spiels: der Herzstein, umkreist von den vier Elementen, darunter der Schriftzug
function logo(textStr = "ROGUE-DECK") {
  const orb = (icon, a) => `<span class="orb" style="--a:${a}deg">${ico(icon, 18)}</span>`;
  return `<div class="logoblock"><div class="emblemwrap">${ico("emblem", 88, { cls: "emblem" })}<div class="orbit">${orb("flame", 0)}${orb("water", 90)}${orb("leaf", 180)}${orb("snow", 270)}</div></div>${logoText(textStr)}</div>`;
}

__exports.at = at;
__exports.ico = ico;
__exports.btn = btn;
__exports.ibtn = ibtn;
__exports.pctOf = pctOf;
__exports.bar = bar;
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
  return `<div class="ach px ${done ? "done" : "open"}"><div class="achicon">${ico(done ? "trophy" : "lock", 28)}</div>
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
  const sections = GROUPS.map(([g, title]) => {
    const list = visible.filter((a) => a.group === g);
    return `<div class="section"><h3>${title} <span class="muted">${list.filter(isDone).length}/${list.length}</span></h3><div class="grid2">${list.map((a) => achCard(meta, a)).join("")}</div></div>`;
  }).join("");
  // Geheimbereich: erst sichtbar, wenn man den ersten geheimen Erfolg erreicht hat. Offene bleiben als "???" ohne jeden Hinweis.
  const secret = secDone.length
    ? `<div class="section"><h3 class="chrome">Geheim <span class="muted">${secDone.length} entdeckt</span></h3><div class="grid2">${secDone.map((a) => achCard(meta, a)).join("")}${secrets.filter((a) => !isDone(a)).map(hiddenCard).join("")}</div></div>`
    : `<div class="muted small center pad">Manche Erfolge zeigen sich erst, wenn du sie erreichst.</div>`;
  return `<div class="screen scroll"><div class="pad stack"><h2>Erfolge</h2><div class="muted">${visible.filter(isDone).length} von ${visible.length} freigeschaltet</div>${sections}${secret}${btn("Zurück", "to-title", undefined, { cls: "primary" })}</div></div>`;
}

// Was fehlt noch, um eine Freischaltung zu bekommen? (geheime Erfolge verraten nichts)
function lockHint(def) {
  const a = def.unlock?.type === "achievement" ? CONTENT.achievements[def.unlock.id] : null;
  return a && !a.secret ? `Erfolg: ${a.name}` : "???";
}

function cosmeticsView(ui) {
  const meta = ui.meta, frame = activeFrame(meta);
  const heroes = Object.values(CONTENT.classes).map((cl) => {
    const cur = activeSkin(meta, cl.id);
    const chips = [`<span class="chip ${cur === "default" ? "on" : ""}"${at("pick-skin", cl.id, "default")}>Standard</span>`,
      ...Object.values(CONTENT.skins).filter((s) => s.hero === cl.id).map((s) => meta.unlocked[`skins/${s.id}`]
        ? `<span class="chip ${cur === s.id ? "on" : ""}"${at("pick-skin", cl.id, s.id)}>${esc(s.name)}</span>`
        : `<span class="chip lock">${ico("lock", 12)} ${esc(s.name)}: ${esc(lockHint(s))}</span>`)];
    return `<div class="px pad skinrow"><div class="skinart">${spr("hero", cl.id, { pal: skinPal(cur), attrs: 'height="92"' })}</div><div class="grow stack"><b>${esc(cl.name)}</b><div class="chips">${chips.join("")}</div></div></div>`;
  }).join("");
  const frames = [`<span class="chip ${frame === "default" ? "on" : ""}"${at("pick-frame", "default")}><span class="framesample"></span> Standard</span>`,
    ...Object.values(CONTENT.frames).map((f) => meta.unlocked[`frames/${f.id}`]
      ? `<span class="chip ${frame === f.id ? "on" : ""}"${at("pick-frame", f.id)}><span class="framesample frame-${esc(f.id)}"></span> ${esc(f.name)}</span>`
      : `<span class="chip lock">${ico("lock", 12)} ${esc(f.name)}: ${esc(lockHint(f))}</span>`)];
  return `<div class="screen scroll"><div class="pad stack"><h2>Aussehen</h2><h3>Farbvarianten der Helden</h3>${heroes}
    <h3>Rahmen für Karten und Gegenstände</h3><div class="px pad"><div class="chips">${frames.join("")}</div></div>
    <div class="muted small">Neue Varianten und Rahmen schaltest du über Erfolge frei.</div>${btn("Zurück", "to-title", undefined, { cls: "primary" })}</div></div>`;
}

// Meldung, die kurz eingeblendet wird, wenn ein Erfolg erreicht wurde
function bannerHtml(id) {
  const a = CONTENT.achievements[id];
  if (!a) return "";
  const r = rewardInfo(a);
  return `<div class="achbanner"><span class="achicon">${ico("trophy", 26)}</span><div><b>Erfolg freigeschaltet</b><div>${esc(a.name)}</div>${r ? `<div class="small">Belohnung: ${esc(r.name)} (${esc(r.label)})</div>` : ""}</div></div>`;
}

__exports.rewardChip = rewardChip;
__exports.achievementsView = achievementsView;
__exports.cosmeticsView = cosmeticsView;
__exports.bannerHtml = bannerHtml;

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
__define("ui/backdrop.js", function (__exports, __require) {
// Kulissen: ein Dungeon-Raum mit Tiefe (Säulen, Tor, Fackeln, Banner mit dem Herzstein, perspektivischer Boden, Runenkreis der vier Elemente)
// plus Atmosphäre (Lichtstrahl, Nebel, Staub, Funken). Drei Räume: Keller, Höhle, Thronsaal.
// Alles reine SVG-Strings in der virtuellen Größe 400x232. Animationen laufen per CSS (siehe style.css).
const { CONTENT } = __require("content/index.js");
const { spr } = __require("ui/art/index.js");
const { elementColor } = __require("ui/theme.js");

const W = 400, H = 232, HORIZON = 150;

const BIOMES = [
  { name: "Keller",    wall: "#2b2234", brick: "#382c44", brick2: "#31263c", mortar: "#150f1d", floor: "#30273a", tile: "#3a2f47", line: "#1c1525", glow: "#ff9a4a", cloth: "#7a2230", trim: "#e8b93d", props: "cellar", fog: "#8c7ca3" },
  { name: "Höhle",     wall: "#1a2433", brick: "#26354a", brick2: "#202d40", mortar: "#0d131e", floor: "#212b3c", tile: "#2b384d", line: "#131a27", glow: "#7fd6ff", cloth: "#1f4a6b", trim: "#bfeaff", props: "cave", fog: "#7fa3c4" },
  { name: "Thronsaal", wall: "#2f1621", brick: "#3f1d2b", brick2: "#361829", mortar: "#190a11", floor: "#34202e", tile: "#412a3b", line: "#21111a", glow: "#d68aff", cloth: "#5a1f6b", trim: "#ff8be6", props: "throne", fog: "#a572b6" },
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
function torch(x, y, b) {
  const embers = [0, 1, 2].map((i) => `<rect class="ember" x="${x + 9 + i * 3}" y="${y + 6}" width="1.5" height="1.5" fill="${b.glow}" style="--dx:${(i - 1) * 5}px;--dur:${(1.6 + i * 0.5).toFixed(1)}s;--d:${(i * 0.45).toFixed(2)}s"/>`).join("");
  return `<g>${px(x + 8, y + 26, 8, 4, "#4a4458")}${px(x + 10, y + 30, 4, 12, "#33303d")}
    <circle class="glow" cx="${x + 12}" cy="${y + 10}" r="44" fill="url(#tg${b.props})"/>
    ${spr("icon", "torch", { attrs: `x="${x}" y="${y}" width="24" height="42"`, cls: "flick" })}${embers}</g>`;
}
function banner(cx, b) {
  const x = cx - 15;
  return `<g class="sway" style="transform-origin:${cx}px 0">${px(x - 3, 0, 36, 4, "#5b4a2b")}
    <polygon points="${x},4 ${x + 30},4 ${x + 30},58 ${cx},70 ${x},58" fill="${b.cloth}"/>
    <polygon points="${x},4 ${x + 30},4 ${x + 30},9 ${x},9" fill="${b.trim}" opacity=".85"/>
    <polygon points="${x + 3},12 ${x + 27},12 ${x + 27},56 ${cx},66 ${x + 3},56" fill="none" stroke="${b.trim}" stroke-width="1" opacity=".55"/>
    ${spr("icon", "emblem", { attrs: `x="${cx - 12}" y="24" width="24" height="24"` })}</g>`;
}
function gate(b, id) {
  const x = 164, w = 72, top = 40;
  const bars = Array.from({ length: 7 }, (_, i) => px(x + 6 + i * 10, top + 12, 2, HORIZON - top - 12, "#0b0910")).join("");
  return `<g>${px(x - 7, top - 6, w + 14, HORIZON - top + 6, b.mortar)}
    <path d="M${x} ${HORIZON} V${top + 28} Q${x} ${top} ${x + w / 2} ${top} Q${x + w} ${top} ${x + w} ${top + 28} V${HORIZON} Z" fill="#07050b"/>
    <path d="M${x} ${HORIZON} V${top + 28} Q${x} ${top} ${x + w / 2} ${top} Q${x + w} ${top} ${x + w} ${top + 28} V${HORIZON} Z" fill="url(#gl${id})"/>
    ${bars}${px(x + 4, top + 34, w - 8, 3, "#0b0910")}
    <path d="M${x + 36} ${top + 6} l-3 12 l4 8 l-3 14" stroke="${b.glow}" stroke-width="2" fill="none" class="glow" opacity=".9"/>
    <path d="M${x - 4} ${HORIZON} V${top + 28} Q${x - 4} ${top - 4} ${x + w / 2} ${top - 4} Q${x + w + 4} ${top - 4} ${x + w + 4} ${top + 28} V${HORIZON}" fill="none" stroke="${b.brick2}" stroke-width="5"/>
    ${[0, 1, 2, 3, 4].map((i) => px(x - 4 + (i * (w + 8)) / 4 - 2, top - 8 + Math.abs(i - 2) * -0 + (i === 2 ? 0 : 5 - Math.abs(i - 2) * 2), 5, 5, b.brick)).join("")}</g>`;
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
const props = (b) => {
  if (b.props === "cave") {
    const ceil = [20, 70, 120, 215, 262, 330, 372].map((x, i) => `<polygon points="${x},0 ${x + 12},0 ${x + 6},${22 + Math.round(rnd(i + 3) * 26)}" fill="${b.mortar}"/>`).join("");
    return `${ceil}${crystal(22, HORIZON + 2, 26, "#2f8fb0", "#bfeaff")}${crystal(32, HORIZON + 2, 16, "#3aa0c0", "#dff7ff")}${crystal(358, HORIZON + 2, 22, "#2f8fb0", "#bfeaff")}${crystal(370, HORIZON + 2, 30, "#3aa0c0", "#dff7ff")}`;
  }
  if (b.props === "throne") {
    return `<polygon points="170,${H} 230,${H} 214,${HORIZON + 1} 186,${HORIZON + 1}" fill="#6b1f33" opacity=".75"/>${px(186, HORIZON + 1, 28, 2, "#e8b93d", ' opacity=".6"')}
      ${[[30, "feuer"], [62, "wasser"], [320, "pflanze"], [352, "eis"]].map(([x, el]) => `<g>${px(x - 2, HORIZON - 10, 18, 10, b.brick2)}${crystal(x, HORIZON - 10, 28, elementColor(el), "#fff")}<circle class="glow" cx="${x + 5}" cy="${HORIZON - 26}" r="26" fill="url(#eg_${el})"/></g>`).join("")}`;
  }
  return `${barrel(22, HORIZON + 4)}${barrel(44, HORIZON + 2)}${crate(348, HORIZON + 3)}${crate(366, HORIZON + 3, 18)}${crate(357, HORIZON - 13, 14)}${cobweb(0, false)}${cobweb(W, true)}`;
};

// ---- Boden mit Perspektive
function floor(b, id) {
  const vp = 92, t = (HORIZON - vp) / (H - vp);
  const rays = [-220, -140, -60, 20, 100, 180, 260, 340, 420, 500, 580].map((xb) => `<line x1="${xb}" y1="${H}" x2="${(200 + (xb - 200) * t).toFixed(1)}" y2="${HORIZON}" stroke="${b.line}" stroke-width="1"/>`).join("");
  const rows = [HORIZON + 8, HORIZON + 18, HORIZON + 31, HORIZON + 48, HORIZON + 69].map((y) => px(0, y, W, 1, b.line)).join("");
  const stain = [[60, 176, 14], [310, 188, 18], [150, 210, 12]].map(([x, y, r], i) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 0.26}" fill="#000" opacity="${(0.1 + i * 0.03).toFixed(2)}"/>`).join("");
  const cracks = `<path d="M96 170 l8 6 l-3 5 l9 7" stroke="${b.line}" stroke-width="1" fill="none"/><path d="M286 196 l-9 4 l4 6 l-8 6" stroke="${b.line}" stroke-width="1" fill="none"/>`;
  const puddle = `<ellipse cx="318" cy="208" rx="22" ry="4.5" fill="${b.glow}" opacity=".12"/><ellipse cx="318" cy="207" rx="22" ry="4.5" fill="#000" opacity=".25"/><rect x="306" y="206" width="9" height="1" fill="#fff" opacity=".28"/>`;
  return `${px(0, HORIZON, W, H - HORIZON, `url(#fl${id})`)}${px(0, HORIZON, W, 4, "#000", ' opacity=".4"')}${rays}${rows}${stain}${cracks}${puddle}`;
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
function atmosphere(b, id) {
  const motes = Array.from({ length: 16 }, (_, i) => `<rect class="mote" x="${(rnd(i + 11) * W).toFixed(0)}" y="${(40 + rnd(i + 31) * 170).toFixed(0)}" width="${rnd(i + 5) > 0.6 ? 2 : 1.4}" height="${rnd(i + 5) > 0.6 ? 2 : 1.4}" fill="#fff" style="--dx:${((rnd(i + 21) - 0.5) * 30).toFixed(0)}px;--dur:${(7 + rnd(i + 41) * 8).toFixed(1)}s;--d:${(-rnd(i + 51) * 10).toFixed(1)}s"/>`).join("");
  return `<polygon class="shaft" points="30,0 66,0 168,${H} 96,${H}" fill="url(#sh${id})"/>
    <rect class="fog f1" x="-60" y="${HORIZON - 12}" width="${W + 120}" height="26" fill="url(#fg${id})"/><rect class="fog f2" x="-60" y="${HORIZON + 14}" width="${W + 120}" height="22" fill="url(#fg${id})" opacity=".6"/>${motes}`;
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
    <radialGradient id="vg${id}" cx="50%" cy="58%" r="78%"><stop offset="55%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity=".62"/></radialGradient></defs>`;
  const arch = (x0, x1) => `<path d="M${x0} ${HORIZON} V50 Q${(x0 + x1) / 2} 12 ${x1} 50 V${HORIZON} Z" fill="#000" opacity=".22"/><path d="M${x0} ${HORIZON} V50 Q${(x0 + x1) / 2} 12 ${x1} 50 V${HORIZON}" fill="none" stroke="${b.mortar}" stroke-width="2" opacity=".7"/>`;
  return `${defs}${px(0, 0, W, HORIZON, `url(#brk${id})`)}${px(0, 0, W, HORIZON, `url(#mos${id})`)}${px(0, 0, W, HORIZON, `url(#tp${id})`)}
    ${arch(30, 128)}${arch(272, 372)}${gate(b, id)}
    ${[0, 134, 248, 382].map((x) => pillar(x, b, id)).join("")}
    ${banner(80, b)}${banner(320, b)}${torch(129, 60, b)}${torch(247, 60, b)}
    ${floor(b, id)}${runes(b)}${props(b)}${atmosphere(b, id)}
    ${px(0, 0, W, H, `url(#vg${id})`, ' pointer-events="none"')}`;
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
const { spr, sprSize, ENEMY_SCALE, cardIconId, elementIconId } = __require("ui/art/index.js");
const { esc, skinPal } = __require("ui/util.js");
const { elementColor, STATUS } = __require("ui/theme.js");
const { backdrop, BIOMES } = __require("ui/backdrop.js");

const W = 400, H = 232;
const HERO = { x: 78, feet: 192, scale: 2.45 };
// Handposition (in Sprite-Pixeln) und Griffpunkt der Waffe (Sprite 10x18 mit Rand)
const HAND = { nahkaempfer: [22, 27], fernkaempfer: [22, 22], magier: [22, 25] };
const GRIP = [5, 16], WEAPON_SCALE = 2.9;
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
    const big = sprSize("enemy", e.id).h * (ENEMY_SCALE[e.id] ?? 3) > 100;
    out[e.uid] = { x: Math.min(x, W - 30), y: two ? (row ? 198 : 184) : big ? 196 : 192, order: row };
  });
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
function combatScene({ run, c, fx = [], enter = null, targetable = new Set(), focus = null }) {
  const b = BIOMES[biomeFor(run)];
  const tl = timeline(fx);
  const layout = layoutEnemies(c.enemies);
  const heroPx = { x: HERO.x, y: HERO.feet };
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
  const cls = run.classId, sz = sprSize("hero", cls), hs = HERO.scale;
  const [hx, hy] = HAND[cls] ?? [15, 16];
  const wid = run.weapon.replace(/:s$/, "");        // Chrom-Waffen haben die ID "x:s", die Grafik kennt nur "x"
  const wsz = sprSize("weapon", wid);
  const hx0 = HERO.x - (sz.w * hs) / 2, hy0 = HERO.feet - sz.h * hs;
  const wpn = CONTENT.get("weapons", run.weapon);
  const hero = `<g class="pos" transform="translate(${hx0} ${hy0})"><g class="mover${enter ? " enter-l" : ""}${anim("hero", "strike", ` strike-${play?.style ?? "slash"}`)}" ${del("hero", "strike")}>
      <ellipse cx="${(sz.w * hs) / 2}" cy="${sz.h * hs - 1}" rx="${sz.w * hs * 0.4}" ry="5" fill="#000" opacity=".42"/><g class="flash${anim("hero", "hurt", " hurtflash")}" ${del("hero", "hurt")}><g class="shake${anim("hero", "hurt", " hurtshake")}" ${del("hero", "hurt")}><g class="bob ${cls === "magier" ? "mv-hover" : "mv-none"}">
      ${spr("hero", cls, { shiny: run.shinyHero, pal: skinPal(run.skin), attrs: `width="${sz.w * hs}" height="${sz.h * hs}"` })}
      <g transform="translate(${hx * hs} ${hy * hs})"><g class="wpn ${cls}${anim("hero", "strike", " wpn-swing")}" ${del("hero", "strike")}>
        <g transform="translate(${-GRIP[0] * WEAPON_SCALE} ${-GRIP[1] * WEAPON_SCALE})">${spr("weapon", wid, { shiny: wpn.shiny, attrs: `width="${wsz.w * WEAPON_SCALE}" height="${wsz.h * WEAPON_SCALE}"` })}</g></g></g>
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
    const s = ENEMY_SCALE[e.id] ?? 3, z = sprSize("enemy", e.id, { element: el });
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
        ${icon(intent.type === "attack" ? "sword" : "shield", 3, 2, 1)}${text(intent.type === "attack" ? `${intent.value}${(intent.hits ?? 1) > 1 ? "x" + intent.hits : ""}` : String(intent.value), 15, 11, "int")}</g>` : "";
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
    if (s.style === "slash") return `<g class="slash" style="--d:${(s.t + 0.2).toFixed(2)}s" transform="translate(${to.x - 24} ${to.y - 66})">${spr("icon", "fx_slash", { attrs: 'width="48" height="48"' })}</g>`;
    const body = s.style === "shoot" ? spr("icon", "fx_arrow", { attrs: 'width="30" height="11"' }) : spr("icon", "fx_orb", { attrs: 'width="22" height="22"', pal: s.element ? { b: elementColor(s.element), c: "#ffffff" } : undefined });
    return `<g transform="translate(${fromX} ${fromY})"><g class="shot" style="--dx:${Math.round(dx)}px;--dy:${Math.round(dy)}px;--d:${(s.t + 0.1).toFixed(2)}s"><g transform="translate(-12 -6)">${body}</g></g></g>`;
  }).join("");
  const floatsSvg = floats.map((f, i) => text(f.text, Math.round(f.x), Math.round(f.y), `float ${f.cls}`, `style="--d:${(f.t + i * 0.03).toFixed(2)}s"`)).join("");

  return `<svg class="scene-svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMax meet" role="img" aria-label="Kampfszene">${backdrop(b)}${ents}${hero}${heroHud}${fxLayer}${floatsSvg}</svg>`;
}

// ---------------------------------------------------------------- Intro (Geschichte): Held steht links, Figur kommt von rechts herein
function introScene({ run, speaker, first, bubble = "" }) {
  const b = BIOMES[0], cls = run.classId, sz = sprSize("hero", cls), s = 2.9;
  const npc = sprSize("npc", speaker.id), ns = 2.6;
  const hx = 90, hfeet = 190, nx = 270;
  const wid = run.weapon.replace(/:s$/, ""), wsz = sprSize("weapon", wid), [hx2, hy2] = HAND[cls] ?? [15, 16];
  return `<svg class="scene-svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMax meet" role="img" aria-label="Geschichte">${backdrop(b, "i")}
    <g class="pos" transform="translate(${hx - (sz.w * s) / 2} ${hfeet - sz.h * s})"><g class="bob mv-none">${spr("hero", cls, { shiny: run.shinyHero, pal: skinPal(run.skin), attrs: `width="${sz.w * s}" height="${sz.h * s}"` })}
      <g transform="translate(${hx2 * s} ${hy2 * s})"><g class="wpn idle-wpn"><g transform="translate(${-GRIP[0] * WEAPON_SCALE} ${-GRIP[1] * WEAPON_SCALE})">${spr("weapon", wid, { shiny: CONTENT.get("weapons", run.weapon).shiny, attrs: `width="${wsz.w * WEAPON_SCALE}" height="${wsz.h * WEAPON_SCALE}"` })}</g></g></g></g></g>
    <g class="pos" transform="translate(${nx - (npc.w * ns) / 2} ${hfeet - npc.h * ns})"><g class="mover${first ? " enter-npc" : ""}"><g class="bob mv-none">${spr("npc", speaker.id, { attrs: `width="${npc.w * ns}" height="${npc.h * ns}"` })}</g></g></g>
    <g class="bubblewrap${first ? " late" : ""}"><foreignObject x="132" y="0" width="262" height="98"><div class="bubble">${bubble}</div></foreignObject>
      <polygon class="tail" points="${nx - 14},96 ${nx + 6},96 ${nx - 4},101"/></g></svg>`;
}

// ---------------------------------------------------------------- Menü-/Auswahl-Hintergrund (nur Kulisse)
const menuBackdrop = () => `<svg class="scene-svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${backdrop(BIOMES[0], "m")}</svg>`;


// Held mit Waffe in der Hand als Standbild (Auswahl, Vorschau)
function heroPortrait(cls, weaponId, skinId = "default") {
  const sz = sprSize("hero", cls), [hx, hy] = HAND[cls] ?? [15, 16], wsz = sprSize("weapon", weaponId), ws = WEAPON_SCALE / HERO.scale;
  return `<svg class="portrait" viewBox="0 0 ${sz.w + 10} ${sz.h}" shape-rendering="crispEdges" role="img" aria-label="${esc(cls)}">
    ${spr("hero", cls, { pal: skinPal(skinId), attrs: `x="0" y="0" width="${sz.w}" height="${sz.h}"` })}
    <g transform="translate(${hx} ${hy}) rotate(16)"><g transform="translate(${-GRIP[0] * ws} ${-GRIP[1] * ws})">${spr("weapon", weaponId, { attrs: `width="${wsz.w * ws}" height="${wsz.h * ws}"` })}</g></g></svg>`;
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
const { CONTENT } = __require("content/index.js");
const { CONFIG } = __require("data/config.js");
const { aliveEnemies, activeItems } = __require("engine/combat.js");
const { availableNodes, buildOf, currentLayer } = __require("engine/run.js");
const { findNode } = __require("engine/map.js");
const { tagCount } = __require("engine/modifiers.js");
const { maxDifficulty, describeUnlock } = __require("engine/meta.js");
const { dexProgress } = __require("engine/dex.js");
const { storyLines, storySpeaker } = __require("engine/story.js");
const { esc, needsTarget, describeWeapon, skinPal, activeSkin, activeFrame } = __require("ui/util.js");
const { achievementsView, cosmeticsView } = __require("ui/achview.js");
const { spr, elementIconId } = __require("ui/art/index.js");
const { NODE_ICON, NODE_NAME, STATUS, elementName } = __require("ui/theme.js");
const { at, ico, btn, ibtn, bar, pctOf, cardHtml, itemHtml, itemIcon, statusChips, logo } = __require("ui/widgets.js");
const { combatScene, introScene, menuBackdrop, heroPortrait } = __require("ui/scene.js");

// ---------------------------------------------------------------- Kopfzeile im Run
function hud(ui) {
  const run = ui.run, cls = CONTENT.classes[run.classId];
  const where = run.nodeId ? `Ebene ${currentLayer(run) + 1}/${CONFIG.map.layers}` : "Start";
  return `<div class="hud"><div class="hud-l">${ico("heart", 18)}<span class="hudhp">${run.hp}/${run.maxHp}</span>${ico("coin", 18)}<b class="gold">${run.gold}</b></div>
    <div class="hud-m">${esc(cls.name)} · ${esc(CONFIG.difficulty[run.difficulty].name)} · ${where}</div>
    <div class="hud-r">${ibtn("pile", "show-deck", "Deck", `<span class="cnt">${run.deck.length}</span>`)}${ibtn("bag", "show-items", "Ausrüstung", `<span class="cnt">${run.items.length + 1}</span>`)}${ibtn("menu", "show-menu", "Menü")}</div></div>`;
}

// ---------------------------------------------------------------- Titel
function titleView(ui) {
  const m = ui.meta;
  return `<div class="screen title"><div class="bgscene">${menuBackdrop()}</div>
    <div class="title-body">${logo()}<div class="tag">Ein Deckbuilder-Roguelite</div>
      <div class="menu-buttons">${ui.hasSave ? btn("Run fortsetzen", "continue", undefined, { cls: "good big" }) : ""}
        ${btn("Neuer Run", "new-run", undefined, { cls: "primary big" })}${btn("Erfolge", "show-achievements", undefined, { cls: "big" })}${btn("Aussehen", "show-cosmetics", undefined, { cls: "big" })}${btn("Sammlung", "show-collection", undefined, { cls: "big" })}</div>
      <div class="muted center small">Siege ${m.wins} · Runs ${m.runs} · Shinys ${Object.keys(m.dex.shiny).length}</div></div></div>`;
}

// ---------------------------------------------------------------- Charakter- und Waffenwahl
function setupView(ui) {
  const st = ui.setup, classes = Object.values(CONTENT.classes), cur = CONTENT.classes[st.classId];
  if (st.step === 0) {
    return `<div class="screen setup"><div class="bgscene">${menuBackdrop()}</div><div class="setup-body scroll"><h2>Wähle deinen Charakter</h2>
      <div class="herogrid">${classes.map((c) => `<div class="herocard px ${st.classId === c.id ? "on" : ""}"${at("pick-class", c.id)}>
        <div class="hero-art">${heroPortrait(c.id, c.starterWeapons[0], activeSkin(ui.meta, c.id))}</div><b>${esc(c.name)}</b>
        <div class="stats"><span>${ico("heart", 14)}${c.hp}</span><span>${ico("pile", 14)}${CONFIG.player.handSize + (c.stats.handSize ?? 0)}</span><span>${ico("bolt", 14)}${CONFIG.player.startEnergy + (c.stats.energy ?? 0)}</span></div>
        <div class="d">${esc(c.blurb ?? "")}</div></div>`).join("")}</div>
      <div class="row center">${btn("Zurück", "setup-back")}${btn("Weiter", "setup-next", undefined, { cls: "primary" })}</div></div></div>`;
  }
  const maxD = maxDifficulty(ui.meta);
  return `<div class="screen setup"><div class="bgscene">${menuBackdrop()}</div><div class="setup-body scroll"><h2>Wähle deine Waffe</h2>
    <div class="weaponrow"><div class="hero-big px">${heroPortrait(cur.id, st.weaponId, activeSkin(ui.meta, cur.id))}<b>${esc(cur.name)}</b></div>
      <div class="weaponlist">${cur.starterWeapons.map((id) => { const w = CONTENT.get("weapons", id);
        return `<div class="wpick ${st.weaponId === id ? "on" : ""}"${at("pick-weapon", id)}>${itemHtml(w, "weapons")}</div>`; }).join("")}</div></div>
    <h3>Schwierigkeit</h3><div class="chips">${CONFIG.difficulty.map((d, i) => i <= maxD
      ? `<span class="chip ${st.difficulty === i ? "on" : ""}"${at("set-diff", String(i))}>${esc(d.name)}</span>` : `<span class="chip lock">${ico("lock", 12)} ${esc(d.name)}</span>`).join("")}</div>
    ${maxD < CONFIG.difficulty.length - 1 ? `<div class="muted small">Die nächste Stufe wird nach einem Sieg freigeschaltet.</div>` : ""}
    <h3>Seed (optional)</h3><input class="seed" inputmode="numeric" placeholder="leer = Zufall, gleiche Zahl = gleiche Karte" value="${esc(st.seed)}" data-change="set-seed">
    <div class="row center">${btn("Zurück", "setup-back")}${btn("Aufbrechen", "start-run", undefined, { cls: "primary big" })}</div></div></div>`;
}

// ---------------------------------------------------------------- Geschichte
function storyView(ui) {
  const run = ui.run, lines = storyLines("intro", run.classId), sp = storySpeaker("intro");
  const i = Math.min(ui.storyIdx, lines.length - 1), last = i === lines.length - 1;
  const bubble = `<div class="who">${esc(sp.name)} <small>${esc(sp.title ?? "")}</small></div><p>${esc(lines[i])}</p>
    <div class="bubble-foot"><span class="dots">${lines.map((_, k) => `<i class="${k <= i ? "on" : ""}"></i>`).join("")}</span>${btn(last ? "Los geht's" : "Weiter", "story-next", undefined, { cls: "primary small" })}</div>`;
  return `<div class="screen story"><div class="scene">${introScene({ run, speaker: sp, first: i === 0, bubble })}</div>
    <div class="storybar">${btn("Überspringen", "story-skip", undefined, { cls: "small" })}</div></div>`;
}

// ---------------------------------------------------------------- Karte (Querformat: waagerecht, Hochformat: senkrecht)
function mapView(ui) {
  const run = ui.run, map = run.map, L = map.layers.length, land = ui.landscape;
  const path = run.path ?? [], avail = run.phase === "map" ? availableNodes(run) : [];
  const SP = 66, PAD = 40, SPAN = 230;
  const W = land ? (L + 1) * SP + PAD * 2 : 340, H = land ? SPAN : (L + 1) * SP + PAD * 2;
  const pos = (n) => {
    const count = n.id === "boss" ? 1 : map.layers[n.layer].length;
    const lane = (n.index + 1) / (count + 1);
    return land ? { x: PAD + n.layer * SP, y: 22 + lane * (SPAN - 44) } : { x: 24 + lane * (W - 48), y: H - PAD - n.layer * SP };
  };
  const nodes = [...map.layers.flat(), map.boss];
  const edges = nodes.flatMap((n) => n.next.map((id) => {
    const a = pos(n), b = pos(findNode(map, id)), on = path.includes(n.id) && (path.includes(id) || avail.includes(id));
    return `<line class="edge ${on ? "on" : ""}" x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}"/>`;
  })).join("");
  const plates = nodes.map((n) => {
    const p = pos(n), isAvail = avail.includes(n.id), done = path.includes(n.id), cur = run.nodeId === n.id, r = n.type === "boss" ? 24 : 18;
    return `<g class="node ${isAvail ? "avail" : done ? "done" : "dim"} ${cur ? "cur" : ""}"${isAvail ? at("node", n.id) : ""}><title>${NODE_NAME[n.type]}</title>
      <circle cx="${p.x}" cy="${p.y}" r="${r}"/>${spr("icon", NODE_ICON[n.type], { attrs: `x="${p.x - r * 0.75}" y="${p.y - r * 0.75}" width="${r * 1.5}" height="${r * 1.5}"` })}</g>`;
  }).join("");
  const here = run.nodeId ? pos(findNode(map, run.nodeId)) : null;
  const hero = here ? `<g class="mapHero" transform="translate(${here.x - 10} ${here.y - 52})">${spr("hero", run.classId, { shiny: run.shinyHero, pal: skinPal(run.skin), attrs: 'width="20" height="29"' })}</g>` : "";
  return `${hud(ui)}<div class="screen mapscreen"><div class="maphead"><h3>${run.nodeId ? "Wohin als Nächstes?" : "Der Weg beginnt"}</h3><span class="muted small">Leuchtende Orte sind erreichbar. Abkürzungen überspringen Ebenen.</span></div>
    <div class="mapwrap scroll ${land ? "land" : "port"}"><svg class="mapsvg" viewBox="0 0 ${W} ${H}" ${land ? `style="width:${W}px;height:100%;min-height:${SPAN}px"` : ""} role="img" aria-label="Dungeon-Karte">${edges}${plates}${hero}</svg></div>
    <div class="legend">${Object.entries(NODE_ICON).map(([k, v]) => `<span>${ico(v, 16)}${NODE_NAME[k]}</span>`).join("")}</div></div>`;
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
  const acts = activeItems(c);
  const actives = acts.length ? `<div class="actives">${acts.map((a) => {
    const off = a.used || a.def.cost > P.energy || Boolean(c.result);
    return `<button class="activebtn${a.used ? " used" : ""}"${off ? " disabled" : at("use-item", String(a.index))} title="${esc(a.item.text ?? a.item.name)}" aria-label="${esc(a.item.name)}">${itemIcon(a.item, 30)}<span class="acost">${ico("bolt", 11)}${a.def.cost}</span>${a.used ? '<span class="aused">benutzt</span>' : ""}</button>`;
  }).join("")}</div>` : "";
  const logLines = c.log.slice(ui.showLog ? -30 : -0).map((l) => `<div class="${l.includes("***") ? "hit" : ""}">${esc(l.trim())}</div>`).join("");
  return `${hud(ui)}<div class="screen combat"><div class="scene">${combatScene({ run, c, fx: ui.fx, enter: ui.enter, targetable, focus: ui.focus })}${actives}${info}
      ${ui.showLog ? `<div class="logpanel px">${logLines}</div>` : ""}</div>
    <div class="handrow"><div class="piles"><span class="pile">${ico("pile", 16)}<b>${c.piles.draw.length}</b></span><span class="pile">${ico("discard", 16)}<b>${c.piles.discard.length}</b></span></div>
      <div class="hand">${hand.map((inst, i) => cardHtml(inst.def, { build, plays: c.playsThisTurn, selected: ui.selected === i, dim: inst.def.cost > P.energy, action: "select-card", arg: String(i) })).join("") || "<span class='muted pad'>Keine Karten auf der Hand</span>"}</div>
      <div class="turnbox"><div class="energy">${pips}</div><div class="row tbtns">${btn(ui.auto ? "Auto: an" : "Auto", "toggle-auto", undefined, { cls: `small ${ui.auto ? "good" : ""}`, disabled: Boolean(c.result) })}${btn(`Tempo x${ui.speed}`, "cycle-speed", undefined, { cls: "small" })}</div>${btn("Zug beenden", "end-turn", undefined, { cls: "primary", disabled: Boolean(c.result) || ui.auto })}${btn(ui.showLog ? "Log aus" : "Log", "toggle-log", undefined, { cls: "small" })}</div></div></div>
    ${c.result ? `<div class="overlay"><div class="sheet mid center stack"><h2>${c.result === "won" ? "Sieg!" : "Niederlage"}</h2>
      ${c.shinyKills.length ? `<div class="shiny sh px pad"><b>Chrom-Gegner besiegt!</b><br>Bonus: +${CONFIG.shiny.enemyGold} Gold, ein seltenes Chrom-Item und eine Chrom-Waffe zur Wahl.</div>` : ""}${btn("Weiter", "after-combat", undefined, { cls: "primary" })}</div></div>` : ""}`;
}

// ---------------------------------------------------------------- Belohnung
function rewardView(ui) {
  const run = ui.run, r = run.pending.reward, t = r.taken, build = buildOf(run), cur = CONTENT.get("weapons", run.weapon);
  const cards = r.cards.map((id, i) => `<div class="slot">${cardHtml(CONTENT.get("cards", id), { size: "lg", build })}${btn(t.cards ? "Gewählt" : "Nehmen", "take", "cards", { arg2: String(i), cls: "small good", disabled: t.cards })}</div>`).join("");
  const list = (ids, kind, key) => ids.map((id, i) => `<div class="slot wide">${itemHtml(CONTENT.get(kind, id), kind)}${btn(t[key] ? "Gewählt" : "Nehmen", "take", key, { arg2: String(i), cls: "small good", disabled: t[key] })}</div>`).join("");
  return `${hud(ui)}<div class="screen scroll"><div class="section"><h2>Beute</h2><div class="gold row">${ico("coin", 18)}<b>+${r.gold} Gold</b>${r.shinyBonus ? `<span class="chrome small">&nbsp;(inkl. ${r.shinyBonus} Chrom-Bonus)</span>` : ""}</div></div>
    ${r.shinyItems.length ? `<div class="section"><h3 class="chrome">Chrom-Fund: Item (wähle 1)</h3><div class="grid2">${list(r.shinyItems, "items", "shinyItems")}</div></div>` : ""}
    ${r.shinyWeapons?.length ? `<div class="section"><h3 class="chrome">Chrom-Fund: Waffe (aktuell: ${esc(cur.name)}, Stärke ${cur.power})</h3><div class="grid2">${list(r.shinyWeapons, "weapons", "shinyWeapons")}</div></div>` : ""}
    <div class="section"><h3>Karte wählen (oder überspringen)</h3><div class="grid">${cards}</div></div>
    ${r.items.length ? `<div class="section"><h3>Item wählen</h3><div class="grid2">${list(r.items, "items", "items")}</div></div>` : ""}
    ${r.weapons.length ? `<div class="section"><h3>Waffe tauschen? (aktuell: ${esc(cur.name)}, Stärke ${cur.power})</h3><div class="grid2">${list(r.weapons, "weapons", "weapons")}</div></div>` : ""}
    <div class="pad center">${btn("Weiter", "finish-reward", undefined, { cls: "primary big" })}</div></div>`;
}

// ---------------------------------------------------------------- Shop, Rast, Ereignis
function shopView(ui) {
  const run = ui.run, shop = run.pending.shop, build = buildOf(run);
  const cards = shop.cards.map((s, i) => `<div class="slot ${s.sold ? "sold" : ""}">${cardHtml(CONTENT.get("cards", s.id), { size: "lg", build })}
    ${btn(s.sold ? "Verkauft" : `${ico("coin", 14)} ${s.price}`, "buy", "cards", { arg2: String(i), cls: "small", disabled: s.sold || s.price > run.gold })}</div>`).join("");
  const items = shop.items.map((s, i) => `<div class="slot wide ${s.sold ? "sold" : ""}">${itemHtml(CONTENT.get("items", s.id))}
    ${btn(s.sold ? "Verkauft" : `${ico("coin", 14)} ${s.price}`, "buy", "items", { arg2: String(i), cls: "small", disabled: s.sold || s.price > run.gold })}</div>`).join("");
  const brumm = shop.start ? storyLines("startladen", run.classId)[0] : null;
  return `${hud(ui)}<div class="screen scroll">${brumm ? `<div class="section"><div class="outro"><div class="npc">${spr("npc", "brumm", { attrs: 'width="64" height="92"' })}</div><div class="bubble static"><div class="who">${esc(CONTENT.speakers.brumm.name)} <small>${esc(CONTENT.speakers.brumm.title)}</small></div><p>${esc(brumm)}</p></div></div></div>` : ""}<div class="section shophead"><div class="npcbox">${spr("icon", "n_haendler", { attrs: 'width="56" height="56"' })}</div><div><h2>${shop.start ? "Startladen" : "Händler"}</h2><div class="muted">Dein Gold: <b class="gold">${run.gold}</b></div></div></div>
    <div class="section"><h3>Karten</h3><div class="grid">${cards}</div></div><div class="section"><h3>Items</h3><div class="grid2">${items}</div></div>
    <div class="section row wrap">${btn(`${ico("star", 14)} Neu würfeln (${shop.rerollCost})`, "reroll", undefined, { disabled: run.gold < shop.rerollCost })}
      ${btn(`${ico("discard", 14)} Karte entfernen (${shop.removeCost})`, "remove-start", undefined, { disabled: run.gold < shop.removeCost || run.deck.length <= CONFIG.run.minDeck })}</div>
    <div class="pad center">${btn("Weiter", "leave-shop", undefined, { cls: "primary big" })}</div></div>`;
}
function restView(ui) {
  const run = ui.run, heal = Math.min(run.maxHp - run.hp, Math.ceil(run.maxHp * CONFIG.run.restHealPct));
  return `${hud(ui)}<div class="screen scroll"><div class="section center stack"><div class="bigicon">${spr("icon", "n_rast", { attrs: 'width="96" height="96"', cls: "flick" })}</div><h2>Rastplatz</h2><div class="muted">Ein Feuer knistert. Du hast Zeit für genau eine Sache.</div>
    ${btn(`Ausruhen (+${heal} HP)`, "rest-heal", undefined, { cls: "good" })}${btn("Eine Karte aus dem Deck entfernen", "rest-remove-start", undefined, { disabled: run.deck.length <= CONFIG.run.minDeck })}</div></div>`;
}
function eventView(ui) {
  const run = ui.run, ev = CONTENT.events[run.pending.eventId];
  return `${hud(ui)}<div class="screen scroll"><div class="section center stack"><div class="bigicon">${spr("icon", "n_ereignis", { attrs: 'width="96" height="96"' })}</div><h2>${esc(ev.name)}</h2><div>${esc(ev.text)}</div></div>
    <div class="section stack">${ev.choices.map((ch, i) => { const lack = ch.requires?.gold > run.gold;
      return btn(esc(ch.label) + (lack ? " (zu wenig Gold)" : ""), "event-choice", String(i), { disabled: lack }); }).join("")}</div></div>`;
}

// ---------------------------------------------------------------- Ende
function endView(ui) {
  const run = ui.run, s = run.summary, won = s.won, m = s.meta, outro = CONTENT.stories.outro, sp = CONTENT.speakers[outro?.speaker];
  const mira = won && outro ? `<div class="outro"><div class="npc">${spr("npc", outro.speaker, { attrs: 'width="72" height="104"' })}</div><div class="bubble static"><div class="who">${esc(sp.name)}</div>${storyLines("outro", run.classId).map((l) => `<p>${esc(l)}</p>`).join("")}</div></div>` : "";
  return `<div class="screen scroll"><div class="pad stack center"><h1>${won ? "Sieg! Der Wandler ist gefallen." : "Der Run ist zu Ende."}</h1>${mira}
    <div class="px pad left"><div>Klasse: <b>${esc(CONTENT.classes[run.classId].name)}</b> · ${esc(CONFIG.difficulty[run.difficulty].name)}</div>
      <div>Kämpfe: <b>${s.stats.fights}</b> · Orte: <b>${s.stats.nodes}</b> · Gold verdient: <b>${s.stats.goldEarned}</b></div>
      <div>Items: <b>${s.items}</b> · Deckgröße: <b>${s.deck}</b></div><div>Shinys gesehen: <b>${s.stats.shinyEnemies + s.stats.shinyLoot}</b> · Seed: <b>${run.seed}</b></div></div>
    ${m?.newDifficulty ? `<div class="px pad good"><b>Neue Schwierigkeit freigeschaltet: ${esc(m.newDifficulty)}</b></div>` : ""}
    ${m?.unlocks?.length ? `<div class="px pad"><b>Neu freigeschaltet:</b><br>${m.unlocks.map((u) => esc(u.name)).join(", ")}</div>` : ""}
    ${s.achievements?.length ? `<div class="px pad left"><b>Neue Erfolge:</b>${s.achievements.map((id) => `<div>${esc(CONTENT.achievements[id].name)}</div>`).join("")}</div>` : ""}
    ${btn("Zurück zum Titel", "to-title", undefined, { cls: "primary" })}</div></div>`;
}

// ---------------------------------------------------------------- Sammlung (Shiny-Dex)
function collectionView(ui) {
  const meta = ui.meta, prog = dexProgress(meta.dex), found = (kind, id) => Boolean(meta.dex.shiny[`${kind}/${id}`]);
  const labels = { heroes: "Helden", cards: "Karten", weapons: "Waffen", items: "Items", enemies: "Gegner" };
  const tile = (kind, id, svgKind) => {
    const f = found(kind, id);
    return `<div class="dextile ${f ? "found sh" : "unknown"}" title="${f ? esc((kind === "heroes" ? CONTENT.classes : CONTENT[kind])[id].name) : "???"}">${spr(svgKind, id, { shiny: f, attrs: 'width="100%" height="100%"' })}</div>`;
  };
  const unlockables = ["cards", "weapons", "items"].flatMap((kind) => Object.values(CONTENT[kind])
    .filter((d) => d.unlock && !(d.unlock.type === "achievement" && CONTENT.achievements[d.unlock.id]?.secret && !meta.unlocked[`${kind}/${d.id}`]))   // Belohnungen geheimer Erfolge bleiben verborgen
    .map((d) => ({ kind, d })));
  return `<div class="screen scroll"><div class="pad stack"><h2>Shiny-Sammlung</h2>
    <div class="px pad">${Object.entries(prog).map(([k, v]) => `<div class="dexrow"><span>${labels[k]}</span><b>${v.found}/${v.total}</b></div>`).join("")}</div>
    ${[["heroes", "heroes", "hero"], ["items", "items", "item"], ["weapons", "weapons", "weapon"], ["enemies", "enemies", "enemy"]].map(([k, kind, sk]) => `<h3>${labels[k]}</h3><div class="dexgrid ${k}">${Object.keys(kind === "heroes" ? CONTENT.classes : CONTENT[kind]).map((id) => tile(kind, id, sk)).join("")}</div>`).join("")}
    <div class="muted small">Ein Shiny taucht mit 1 zu ${Math.round(1 / CONFIG.shiny.enemyChance)} pro Gegner auf. Ein Chrom-Held erscheint mit 1 zu ${Math.round(1 / CONFIG.shiny.heroChance)} beim Run-Start. Gefundene Shinys erscheinen hier als Chrom-Variante.</div>
    <h2>Freischaltungen</h2><div class="px pad">${unlockables.map(({ kind, d }) => { const open = Boolean(meta.unlocked[`${kind}/${d.id}`]);
      return `<div class="dexrow"><span>${open ? ico("plus", 12) : ico("lock", 12)} ${esc(d.name)}</span><span class="muted right">${open ? "frei" : esc(describeUnlock(d.unlock))}</span></div>`; }).join("")}</div>
    ${btn("Chrom-Vorschau starten", "start-preview", undefined, { cls: "small" })}<div class="muted small">Ein Run, in dem alles Shiny ist, damit du den Chrom-Look siehst. Nichts wird gespeichert.</div>
    ${ui.confirmReset ? `<div class="px pad stack"><b class="bad">Wirklich alles löschen?</b><div class="row">${btn("Ja, löschen", "reset-yes", undefined, { cls: "danger" })}${btn("Abbrechen", "reset-no")}</div></div>` : btn("Spielstand löschen", "reset-ask", undefined, { cls: "small" })}
    ${btn("Zurück", "to-title", undefined, { cls: "primary" })}</div></div>`;
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
    const labels = { luck: "Glück", maxHp: "Max-HP", energy: "Energie", handSize: "Handkarten", goldPct: "% Gold", regen: "Regeneration", blockStart: "Block/Zug", shiny: "Shiny-Chance", reaction: "% Reaktionen" };
    const stats = Object.entries(build.stats).filter(([, v]) => v).map(([k, v]) => `<span class="chip">${v > 0 ? "+" : ""}${v} ${labels[k] ?? k}</span>`).join(" ");
    const tags = [...new Set([...CONFIG.typeTags, ...Object.keys(CONTENT.elements)])].map((t) => [t, tagCount(build, t)]).filter(([, n]) => n > 0)
      .map(([t, n]) => `<span class="chip">${CONTENT.elements[t] ? ico(elementIconId(t), 12) + " " : ""}${esc(t)} ${n}</span>`).join(" ");
    return `<div class="overlay"><div class="sheet stack"><h2>Ausrüstung</h2><div class="grid2">${itemHtml(weapon, "weapons")}${run.items.map((id) => itemHtml(CONTENT.get("items", id))).join("")}</div>
      ${run.items.length ? "" : "<div class='muted'>Noch keine Items.</div>"}${stats ? `<h3>Werte</h3><div class="chips">${stats}</div>` : ""}${tags ? `<h3>Typen im Build (für Synergien)</h3><div class="chips">${tags}</div>` : ""}${close}</div></div>`;
  }
  if (o === "pick-remove") return `<div class="overlay"><div class="sheet"><h2>Welche Karte entfernen?</h2><div class="grid">${groupedDeck(run).map((g) =>
    `<div class="slot">${cardHtml(g.def, { size: "lg", build, count: g.idxs.length })}${btn("Entfernen", "pick-remove", String(g.idxs[0]), { cls: "small danger" })}</div>`).join("")}</div>${close}</div></div>`;
  if (o === "menu") return `<div class="overlay"><div class="sheet mid stack"><h2>Menü</h2>${run.phase === "combat" ? `<div class="stack"><h3>Kampf-Bedienung</h3>${btn(ui.manual ? "Zielen: von Hand" : "Zielen: automatisch", "toggle-manual", undefined, { cls: "small" })}<div class="muted small">${ui.manual ? "Erst Karte wählen, dann Gegner antippen." : "Ein Tipp spielt die Karte. Einen Gegner antippen setzt ihn als Hauptziel."}</div>${btn(ui.autoEnd ? "Zug endet automatisch: an" : "Zug endet automatisch: aus", "toggle-autoend", undefined, { cls: "small" })}</div>` : ""}<div class="muted">Seed: <b>${run.seed}</b> (für Freunde: gleiche Karte)</div>${run.shinyHero ? `<div class="chrome">Chrom-Held: +${CONFIG.shiny.heroLuck} Glück in diesem Run</div>` : ""}${btn("Weiterspielen", "close-overlay", undefined, { cls: "primary" })}
    ${run.phase === "combat" ? `<div class="muted small">Im Kampf wird nicht gespeichert. Beendest du jetzt, beginnt der Kampf beim nächsten Mal von vorn.</div>` : ""}${btn("Zum Titel (speichert)", "to-title")}${btn("Run aufgeben", "abandon", undefined, { cls: "danger" })}</div></div>`;
  return "";
}
const noticeView = (n) => `<div class="overlay"><div class="sheet mid stack center"><h2>${esc(n.title)}</h2>${n.lines.map((l) => `<div>${esc(l)}</div>`).join("")}${btn("OK", "ack-notice", undefined, { cls: "primary" })}</div></div>`;

// ---------------------------------------------------------------- Einstieg
function render(ui) {
  let body;
  if (ui.screen === "title") body = titleView(ui);
  else if (ui.screen === "setup") body = setupView(ui);
  else if (ui.screen === "collection") body = collectionView(ui);
  else if (ui.screen === "achievements") body = achievementsView(ui);
  else if (ui.screen === "cosmetics") body = cosmeticsView(ui);
  else {
    const p = ui.run.phase;
    body = p === "intro" ? storyView(ui) : p === "map" ? mapView(ui) : p === "combat" ? combatView(ui) : p === "reward" ? rewardView(ui) : p === "shop" ? shopView(ui)
      : p === "rest" ? restView(ui) : p === "event" ? eventView(ui) : endView(ui);
  }
  const overlay = ui.screen === "game" && ui.overlay ? overlayView(ui) : "";
  const frame = activeFrame(ui.meta);
  return `<div class="app ${ui.landscape ? "land" : "port"}${frame !== "default" ? ` frame-${frame}` : ""}">${body}</div>${overlay}${ui.notice ? noticeView(ui.notice) : ""}${ui.toast ? `<div class="toast">${esc(ui.toast)}</div>` : ""}`;
}

__exports.render = render;

});
__define("ui/controller.js", function (__exports, __require) {
// Controller: verbindet Engine und Ansichten. Kein DOM, daher komplett in Node testbar.
// dispatch(action, arg, arg2) verändert den Zustand und gibt false zurück, wenn kein Neuzeichnen nötig ist.
const { CONTENT } = __require("content/index.js");
const { CONFIG } = __require("data/config.js");
const { createRun, startAdventure, enterNode, completeCombat, takeCard, takeItem, takeWeapon, takeShinyItem, takeShinyWeapon, finishReward, restHeal, shopBuy, shopReroll, shopRemove, restRemove, leaveShop, eventChoose, serializeRun, loadRun, peekSave, rollShinyHero, takeNewAchievements } = __require("engine/run.js");
const { playCard, endPlayerTurn, useItem, activeItems } = __require("engine/combat.js");
const { nextAction, pickTarget, hasPlayable } = __require("engine/autoplay.js");
const { createMeta, normalizeMeta, maxDifficulty } = __require("engine/meta.js");
const { evaluateAchievements } = __require("engine/achievements.js");
const { bannerHtml } = __require("ui/achview.js");
const { storyLines } = __require("engine/story.js");
const { render: renderViews } = __require("ui/views.js");
const { nameAny } = __require("ui/util.js");

const KEY_META = "rd_meta_v1", KEY_RUN = "rd_run_v1";
const signed = (n) => (n > 0 ? `+${n}` : `${n}`);

function createController({ storage = null, seedFn = () => Math.floor(Math.random() * 2147483647), shinyRollFn = Math.random, landscape = false } = {}) {
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
    screen: "title", run: null, meta, landscape,
    setup: { step: 0, classId: "nahkaempfer", weaponId: CONTENT.classes.nahkaempfer.starterWeapons[0], difficulty: 0, seed: "" },
    storyIdx: 0, selected: null, overlay: null, removeMode: null, notice: null, toast: null, showLog: false, confirmReset: false,
    fx: [], enter: null, hasSave: false,
    // Kampf-Bedienung
    auto: false, speed: meta.settings.speed, manual: meta.settings.manual, autoEnd: meta.settings.autoEnd, focus: null,
  };
  let lastWave = -1;

  // Gespeicherten Run prüfen: passt er nicht zur aktuellen Version, wird er sauber verworfen.
  const rawSave = (() => { try { return storage?.getItem(KEY_RUN); } catch { return null; } })();
  if (rawSave) {
    if (peekSave(rawSave).ok) ui.hasSave = true;
    else {
      remove(KEY_RUN);
      ui.notice = { title: "Neue Version", lines: ["Das Spiel wurde aktualisiert. Dein angefangener Run passt nicht mehr dazu und wurde verworfen.", "Freischaltungen und Shinys bleiben erhalten."] };
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
  const saveSettings = () => { ui.meta.settings = { speed: ui.speed, manual: ui.manual, autoEnd: ui.autoEnd }; };
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
      case "pick-class": st.classId = arg; st.weaponId = CONTENT.classes[arg].starterWeapons[0]; break;
      case "setup-next": st.step = 1; break;
      case "setup-back": if (st.step === 0) ui.screen = "title"; else st.step = 0; break;
      case "pick-weapon": st.weaponId = arg; break;
      case "set-diff": st.difficulty = Number(arg); break;
      case "set-seed": st.seed = String(arg ?? "").replace(/\D/g, "").slice(0, 10); rerender = false; break;
      case "start-preview": {
        endPreview();
        savedShiny = { ...CONFIG.shiny };
        Object.assign(CONFIG.shiny, { enemyChance: 1, lootChance: 1 });
        const st = ui.setup;
        openRun(createRun({ classId: st.classId, weapon: st.weaponId, difficulty: 0, seed: seedFn(), meta: undefined, shinyHero: true }));
        ui.preview = true;
        ui.notice = { title: "Chrom-Vorschau", lines: ["Hier ist alles Shiny: Held, Gegner, Beute.", "Nichts davon wird gespeichert oder zählt für deinen Fortschritt.", "Über das Menü kommst du zurück."] };
        break;
      }
      case "start-run": {
        endPreview();
        const seed = parseInt(st.seed, 10) || seedFn();
        openRun(createRun({ classId: st.classId, weapon: st.weaponId, difficulty: Math.min(st.difficulty, maxDifficulty(ui.meta)), seed, meta: ui.meta, shinyHero: rollShinyHero(shinyRollFn) }));
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
      case "to-title": endPreview(); ui.auto = false; ui.screen = "title"; ui.overlay = null; ui.run = null; ui.confirmReset = false; break;
      case "show-collection": ui.screen = "collection"; break;
      case "show-achievements": ui.screen = "achievements"; break;
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
      case "abandon": { const wasPreview = ui.preview; endPreview(); if (!wasPreview) { remove(KEY_RUN); ui.hasSave = false; } ui.run = null; ui.screen = "title"; ui.overlay = null; break; }
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
      case "use-item": {                                   // aktives Item auslösen (1x pro Kampf), Ziel wählt der Autopilot
        if (!inPhase("combat") || run.pending.combat.result) break;
        const combat = run.pending.combat, entry = activeItems(combat).find((x) => x.index === Number(arg));
        if (!entry) break;
        const res = useItem(combat, entry.index, pickTarget(combat, entry.def, ui.focus));
        if (!res.ok) toast(res.reason); else maybeEndTurn();
        break;
      }
      case "focus": if (inPhase("combat")) ui.focus = ui.focus === arg ? null : arg; break;       // Hauptziel merken: einzelne Angriffe gehen darauf
      case "toggle-auto": ui.auto = !ui.auto; break;
      case "cycle-speed": ui.speed = ui.speed >= 3 ? 1 : ui.speed + 1; saveSettings(); break;
      case "toggle-manual": ui.manual = !ui.manual; ui.selected = null; saveSettings(); break;
      case "toggle-autoend": ui.autoEnd = !ui.autoEnd; saveSettings(); break;
      case "auto-step": {                                  // ein Schritt des Autopiloten (der Browser ruft das im Takt auf)
        if (!inPhase("combat") || run.pending.combat.result) break;
        const combat = run.pending.combat, a = nextAction(combat);
        if (a.type === "play") tryPlay(a.index, a.targetUid);
        else if (a.type === "item") useItem(combat, a.index, a.targetUid);
        else endPlayerTurn(combat);
        break;
      }
      case "end-turn": if (inPhase("combat") && !run.pending.combat.result) { endPlayerTurn(run.pending.combat); ui.selected = null; } break;
      case "after-combat": if (inPhase("combat")) { const r = completeCombat(run); if (!r.ok) toast(r.reason); ui.selected = null; } break;

      // ---- Belohnung
      case "take": {
        const fn = { cards: takeCard, items: takeItem, weapons: takeWeapon, shinyItems: takeShinyItem, shinyWeapons: takeShinyWeapon }[arg];
        const r = fn ? fn(run, Number(arg2)) : { ok: false, reason: "Unbekannte Liste" };
        toast(r.ok ? `Genommen: ${nameAny(r.id)}` : r.reason);
        break;
      }
      case "finish-reward": { const r = finishReward(run); if (!r.ok) toast(r.reason); break; }

      // ---- Shop und Rast
      case "buy": { const r = shopBuy(run, arg, Number(arg2)); toast(r.ok ? `Gekauft: ${nameAny(r.id)}` : r.reason); break; }
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
        ui.notice = { title: ev.name, lines: lines.length ? lines : ["Nichts passiert."] };
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
    persist();
    return rerender;
  }

  return {
    ui, dispatch, render: () => renderViews(ui),
    // Wartezeit (ms) bis zum nächsten Autopilot-Schritt, oder null wenn gerade nichts zu tun ist
    autoWait: () => {
      const r = ui.run;
      if (!ui.auto || ui.screen !== "game" || !r || r.phase !== "combat" || r.pending.combat.result || ui.overlay || ui.notice) return null;
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

const root = document.getElementById("app");
const storage = (() => {
  try { const s = window.localStorage; s.setItem("rd_probe", "1"); s.removeItem("rd_probe"); return s; } catch { return null; }
})();
const isLandscape = () => window.innerWidth > window.innerHeight;
const ctrl = createController({ storage, landscape: isLandscape() });

// Erfolgs-Meldungen: liegen außerhalb der Spielansicht, damit sie ein Neuzeichnen überdauern
const banners = document.getElementById("banners");
function showBanners() {
  for (const id of ctrl.takeAchievementEvents()) {
    const wrap = document.createElement("div");
    wrap.innerHTML = ctrl.achievementBanner(id);
    const el = wrap.firstElementChild;
    if (!el || !banners) continue;
    banners.appendChild(el);
    setTimeout(() => el.remove(), 5400);
  }
}

// Autopilot: solange "Auto" an ist, im Takt Schritte ausführen (Wartezeit kommt vom Controller und hängt vom Tempo ab)
let autoTimer = null;
function scheduleAuto() {
  clearTimeout(autoTimer);
  const wait = ctrl.autoWait();
  if (wait === null) return;
  autoTimer = setTimeout(() => { ctrl.dispatch("auto-step"); render(); }, wait);
}

function render() {
  root.innerHTML = ctrl.render();
  showBanners();
  scheduleAuto();
  // Auf der Karte zum nächsten wählbaren Ort scrollen
  const next = root.querySelector(".node.avail");
  if (next && next.scrollIntoView) next.scrollIntoView({ block: "center", inline: "center" });
}

root.addEventListener("click", (ev) => {
  const el = ev.target.closest("[data-action]");
  if (!el || el.disabled) return;
  if (ctrl.dispatch(el.dataset.action, el.dataset.arg, el.dataset.arg2) !== false) render();
});
root.addEventListener("change", (ev) => {
  const el = ev.target.closest("[data-change]");
  if (el) ctrl.dispatch(el.dataset.change, el.value);
});
// Quer-/Hochformat: nur neu zeichnen, wenn sich die Ausrichtung wirklich ändert
let last = isLandscape();
function onResize() {
  const now = isLandscape();
  if (now === last) return;
  last = now;
  ctrl.dispatch("orientation", now ? "landscape" : "portrait");
  render();
}
window.addEventListener("resize", onResize);
window.addEventListener("orientationchange", () => setTimeout(onResize, 120));
render();



});
__require("ui/main.js");
})();
