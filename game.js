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
    removeBase: 50, removeIncrement: 25,
    rerollBase: 25, rerollIncrement: 15,
  },

  // Items dürfen gestapelt werden (wie bei Brotato). Einzelne Items überschreiben das mit "maxStack".
  items: { maxStack: 3 },

  // Shiny: Chance pro Gegner-Begegnung (enemyChance) und pro Angebots-Slot in Belohnung/Shop (lootChance).
  // scale: Shiny-Gegenstände haben +25 % auf ihre positiven Werte. priceMult: Shop-Aufpreis.
  shiny: { enemyChance: 1 / 500, lootChance: 1 / 500, scale: 1.25, priceMult: 3 },

  // ---- Run-Aufbau
  run: { startGold: 70, restHealPct: 0.3, minDeck: 5, normalItemChance: 0.12 },
  map: {
    layers: 10,                 // Ebenen vor dem Boss
    width: [3, 4],              // Knoten pro Ebene (min, max)
    skipEdgeChance: 0.2,        // Chance auf Abkürzung (überspringt eine Ebene) -> Run-Länge hängt vom Weg ab
    minibossLayer: 5,           // Pflicht-Ebene mit Mini-Bossen (nicht überspringbar)
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

const KINDS = ["cards", "weapons", "items", "enemies", "encounters", "classes", "events", "reactions"];
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
  if (kind === "classes") out.stats = def.stats ?? {};
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
  const c = { packs: [], elements: {}, relations: [], matrix: {}, cards: {}, weapons: {}, items: {}, enemies: {}, encounters: {}, classes: {}, events: {}, reactions: {}, reactionIndex: {} };
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

  // Prüft, ob alle Verweise gültig sind. Gibt eine Liste von Problemen zurück.
  c.validate = () => {
    const p = [];
    const has = (kind, id) => Boolean(c[kind][id]);
    for (const x of [...Object.values(c.cards), ...Object.values(c.weapons), ...Object.values(c.items)]) {
      if (x.element && !c.elements[x.element]) p.push(`${x.id}: unbekanntes Element ${x.element}`);
      for (const pool of x.pools) if (pool !== "alle" && !has("classes", pool)) p.push(`${x.id}: unbekannter Pool ${pool}`);
    }
    for (const e of Object.values(c.enemies)) for (const el of e.elements) if (!c.elements[el]) p.push(`${e.id}: unbekanntes Element ${el}`);
    for (const e of Object.values(c.enemies)) {
      for (const el of e.mechanics?.rotateElement?.cycle ?? []) if (!c.elements[el]) p.push(`${e.id}: Zyklus-Element ${el} unbekannt`);
      for (const ph of e.mechanics?.phases ?? []) for (const id of ph.summon ?? []) if (!has("enemies", id)) p.push(`${e.id}: Phase beschwört unbekannten Gegner ${id}`);
    }
    for (const r of Object.values(c.reactions)) for (const el of r.pair) if (!c.elements[el]) p.push(`Reaktion ${r.id}: unbekanntes Element ${el}`);
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
      for (const id of cl.deck) if (!has("cards", id)) p.push(`Klasse ${cl.id}: unbekannte Karte ${id}`);
      if (!has("weapons", cl.weapon)) p.push(`Klasse ${cl.id}: unbekannte Waffe ${cl.weapon}`);
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
      name: "Nahkämpfer", hp: 75, stats: {}, blurb: "Robust und geradlinig: Block, Waffenstärke und Blutung. Verzeiht Fehler.",
      deck: ["hieb", "hieb", "hieb", "hieb", "hieb", "deckung", "deckung", "deckung", "deckung", "wuchtschlag"],
      weapon: "rostiges_schwert", items: [],
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
    wasserstrahl: { name: "Wasserstrahl", cost: 1, element: "wasser", tags: ["angriff"], text: "Wasserschaden: 5 + Waffe.",
                    play: [{ action: "damage", base: 5, weaponScale: 1 }] },
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
    glueckswuerfel: { name: "Glückswürfel", text: "+4 Glück (bessere Seltenheiten bei Belohnungen).", unlock: { type: "runs", count: 3 }, rarity: "selten", tags: ["item", "glueck"], stats: { luck: 4 } },
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
    blutrausch:   { name: "Blutrausch", cost: 1, rarity: "ungewoehnlich", pools: ["nahkaempfer"], tags: ["blut", "angriff"], text: "Schaden: 3 + Waffe, +1 pro Blutung auf dem Ziel.",
      play: [{ action: "damage", base: 3, weaponScale: 1, bonusPerStatus: { status: "blutung", value: 1 } }] },
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
    eissplitter: { name: "Eissplitter", cost: 1, element: "eis", tags: ["angriff"], text: "Eisschaden: 4 + Waffe. 1 Verwundbar.",
      play: [{ action: "damage", base: 4, weaponScale: 1 }, { action: "status", status: "verwundbar", stacks: 1 }] },
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
    goldene_waage: { name: "Goldene Waage", unlock: { type: "runs", count: 2 }, rarity: "selten", tags: ["item", "gold"], stats: { goldPct: 40 }, maxStack: 1, text: "+40 % Gold." },
    kartenhaus:    { name: "Kartenhaus", rarity: "selten", tags: ["item", "pakt"], stats: { handSize: 2, maxHp: -8 }, maxStack: 1, text: "+2 Handkarten, -8 Max-HP." },
    schillernder_charme: { name: "Schillernder Charme", unlock: { type: "shinies", count: 1 }, rarity: "selten", tags: ["item", "glueck"], stats: { shiny: 1 }, maxStack: 2,
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
      name: "Fernkämpfer", hp: 45, stats: { handSize: 1 }, blurb: "Schnell und fragil: Je mehr Karten du spielst, desto stärker jeder Treffer. Markieren, Mehrfachtreffer, Ausweichen.",
      deck: ["schnellschuss", "schnellschuss", "schnellschuss", "schnellschuss", "zielen", "zielen", "rolle", "rolle", "rolle", "praezisionsschuss"],
      weapon: "kurzbogen", items: [],
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

    giftpfeil:     { name: "Giftpfeil", cost: 1, pools: ["fernkaempfer"], tags: ["fernkampf", "gift", "angriff"],
      text: "Schaden: 2 + Waffe. 3 Gift.",
      play: [{ action: "damage", base: 2, weaponScale: 1 }, { action: "status", status: "gift", stacks: 3 }] },
    brandpfeil:    { name: "Brandpfeil", cost: 1, element: "feuer", pools: ["fernkaempfer"], tags: ["fernkampf", "angriff"],
      text: "Feuerschaden: 3 + Waffe.",
      play: [{ action: "damage", base: 3, weaponScale: 1 }] },
    eispfeil:      { name: "Eispfeil", cost: 1, element: "eis", pools: ["fernkaempfer"], tags: ["fernkampf", "angriff"],
      text: "Eisschaden: 3 + Waffe. 1 Verwundbar.",
      play: [{ action: "damage", base: 3, weaponScale: 1 }, { action: "status", status: "verwundbar", stacks: 1 }] },
    nachladen:     { name: "Nachladen", cost: 0, rarity: "ungewoehnlich", pools: ["fernkaempfer"], tags: ["fernkampf", "utility"],
      text: "Ziehe 2 Karten.",
      play: [{ action: "draw", value: 2 }] },
    salve:         { name: "Salve", cost: 2, rarity: "ungewoehnlich", pools: ["fernkaempfer"], tags: ["fernkampf", "angriff"],
      text: "3 Treffer: je 2 + 0,5x Waffe.",
      play: [{ action: "damage", base: 2, weaponScale: 0.5, hits: 3 }] },
    pfeilhagel:    { name: "Pfeilhagel", cost: 2, rarity: "ungewoehnlich", pools: ["fernkaempfer"], tags: ["fernkampf", "flaeche"],
      text: "2 Treffer auf ALLE: je 2 + 0,5x Waffe.",
      play: [{ action: "damage", base: 2, weaponScale: 0.5, hits: 2, target: "all" }] },
    fluchtschuss:  { name: "Fluchtschuss", cost: 1, rarity: "ungewoehnlich", pools: ["fernkaempfer"], tags: ["fernkampf", "ausweichen", "angriff"],
      text: "Schaden: 3 + Waffe. Ziehe 1 Karte. Weiche 1 Treffer aus.",
      play: [{ action: "damage", base: 3, weaponScale: 1 }, { action: "draw", value: 1 }, { action: "playerStatus", status: "ausweichen", stacks: 1 }] },
    scharfschuetze: { name: "Scharfschuss", cost: 3, rarity: "selten", pools: ["fernkaempfer"], tags: ["fernkampf", "angriff"],
      text: "Schaden: 12 + 2x Waffe, +4 pro Markierung auf dem Ziel.",
      play: [{ action: "damage", base: 12, weaponScale: 2, bonusPerStatus: { status: "markiert", value: 4 } }] },
    dauerfeuer:    { name: "Dauerfeuer", cost: 1, rarity: "selten", pools: ["fernkaempfer"], tags: ["fernkampf", "angriff"],
      text: "4 Treffer: je 1 + 0,5x Waffe, +1 pro zuvor gespielter Karte.",
      play: [{ action: "damage", base: 1, weaponScale: 0.5, hits: 4, bonusPerPlay: 1 }] },
    pfeilsturm:    { name: "Pfeilsturm", cost: 3, rarity: "legendaer", unlock: { type: "wins", count: 1 }, pools: ["fernkaempfer"], tags: ["fernkampf", "flaeche"],
      text: "4 Treffer auf ALLE: je 2 + 0,5x Waffe.",
      play: [{ action: "damage", base: 2, weaponScale: 0.5, hits: 4, target: "all" }] },
  },

  weapons: {
    kurzbogen: { name: "Kurzbogen", pools: ["fernkaempfer"], power: 2, tags: ["waffe", "fernkampf"] },
    armbrust:  { name: "Armbrust", rarity: "ungewoehnlich", pools: ["fernkaempfer"], power: 3, tags: ["waffe", "fernkampf"] },
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
      name: "Magier", hp: 45, stats: {}, blurb: "Mischen wird belohnt: Zwei verschiedene Elemente nacheinander lösen Reaktionen aus. Wenig HP, viel Kombo.",
      deck: ["funke", "funke", "tropfen", "tropfen", "ranke", "ranke", "manaschild", "manaschild", "manaschild", "arkanblitz"],
      weapon: "zauberstab", items: [],
    },
  },

  cards: {
    funke:      { name: "Funke", cost: 1, element: "feuer", pools: ["magier"], tags: ["zauber", "angriff"],
      text: "Feuerschaden: 5 + 0,5x Waffe.", play: [{ action: "damage", base: 5, weaponScale: 0.5 }] },
    tropfen:    { name: "Wassertropfen", cost: 1, element: "wasser", pools: ["magier"], tags: ["zauber", "angriff"],
      text: "Wasserschaden: 4 + 0,5x Waffe. 2 Block.", play: [{ action: "damage", base: 4, weaponScale: 0.5 }, { action: "block", value: 2 }] },
    ranke:      { name: "Ranke", cost: 1, element: "pflanze", pools: ["magier"], tags: ["zauber", "angriff", "blut"],
      text: "Pflanzenschaden: 3 + 0,5x Waffe. 2 Blutung.", play: [{ action: "damage", base: 3, weaponScale: 0.5 }, { action: "status", status: "blutung", stacks: 2 }] },
    frostnadel: { name: "Frostnadel", cost: 1, element: "eis", pools: ["magier"], tags: ["zauber", "angriff"],
      text: "Eisschaden: 4 + 0,5x Waffe. 1 Verwundbar.", play: [{ action: "damage", base: 4, weaponScale: 0.5 }, { action: "status", status: "verwundbar", stacks: 1 }] },
    manaschild: { name: "Manaschild", cost: 1, pools: ["magier"], tags: ["zauber", "block"],
      text: "5 Block.", play: [{ action: "block", value: 5 }] },
    arkanblitz: { name: "Arkanblitz", cost: 1, pools: ["magier"], tags: ["zauber", "angriff"],
      text: "Schaden: 6 + Waffe (kein Element).", play: [{ action: "damage", base: 6, weaponScale: 1 }] },

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

const CONTENT = createContent();
[core, ausruestung, feuer, gift, blut, frost, wildnis, boss, events, fernkaempfer, magier].forEach((pack) => CONTENT.register(pack));

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
    const n = M.width[0] + Math.floor(rng.next() * (M.width[1] - M.width[0] + 1));
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
    if (l + 1 === M.minibossLayer || l + 1 === L - 1) continue;
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
    lastElement: null, metrics: { plays: 0, reactions: 0 },
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
  const hp = Math.round(def.hp * s.diff.hpMult);
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
    for (const id of ph.summon ?? []) s.enemies.push(makeEnemy(s, id, `add${s.addCount++}`, false));
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
  s.player.block = s.build.stats.blockStart;
  s.player.energy = CONFIG.player.startEnergy + s.build.stats.energy;
  s.player.statuses.ausweichen = 0;     // Ausweichen hält nur einen Zug
  s.lastElement = null;                 // Reaktionen gelten nur innerhalb eines Zuges
  log(s, `=== Zug ${s.turn} (HP ${s.player.hp}/${s.player.maxHp})`);
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
    if (enemy.plates === 0) {
      enemy.plateTimer = 0;
      log(s, `  ${enemy.name}: Panzer gebrochen, 2 Züge verwundbar!`);
      applyStatus(s, enemy, "verwundbar", 2, depth);
    }
    return;
  }
  let rest = amount;
  if (!pierce) {
    const absorbed = Math.min(enemy.block, rest);
    enemy.block -= absorbed;
    rest -= absorbed;
  }
  enemy.hp = Math.max(0, enemy.hp - rest);
  log(s, `  ${source}: ${enemy.name} -${rest}${note}${enemy.hp === 0 ? " (besiegt)" : ` (HP ${enemy.hp})`}`);
  if (enemy.hp > 0) checkPhases(s, enemy);
  if (wasAlive && enemy.hp === 0) {
    if (enemy.shiny) { s.shinyKills.push(enemy.id); log(s, `  *** ${enemy.name} war SHINY! ***`); }
    emit(s, "on_kill", { target: enemy }, depth);
  }
}

function damagePlayer(s, amount, source, attacker) {
  if ((s.player.statuses.ausweichen ?? 0) > 0) {   // Ausweichen: ein Treffer geht komplett daneben
    s.player.statuses.ausweichen--;
    log(s, `  ${source} verfehlt dich (Ausweichen)`);
    return;
  }
  const absorbed = Math.min(s.player.block, amount);
  s.player.block -= absorbed;
  const lost = amount - absorbed;
  s.player.hp -= lost;
  log(s, `  ${source} trifft dich für ${lost} (Block ${absorbed})`);
  if (s.player.hp <= 0) { s.result = "lost"; return; }
  if (lost > 0) emit(s, "on_player_hit", { target: attacker }, 0);
}

function applyStatus(s, enemy, status, stacks, depth) {
  enemy.statuses[status] = (enemy.statuses[status] ?? 0) + stacks;
  log(s, `  ${enemy.name} +${stacks} ${status}`);
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
    case "block": { const v = magnitude(eff, s.build); P.block += v; log(s, `  ${eff.sourceName}: +${v} Block`); return; }
    case "heal":  { const v = magnitude(eff, s.build); P.hp = Math.min(P.maxHp, P.hp + v); log(s, `  ${eff.sourceName}: +${v} HP`); return; }
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
  log(s, `  *** Reaktion: ${r.name} (${a} + ${b})`);
  for (const eff of r.effects) {
    runPassive(s, {
      ...eff, sourceName: r.name, target: eff.target ?? "event_target",
      value: eff.value !== undefined ? Math.round(eff.value * mult) : undefined,
      stacks: eff.stacks !== undefined ? Math.max(1, Math.round(eff.stacks * mult)) : undefined,
    }, { target }, 0);
  }
  emit(s, "on_reaction", { target, reaction: r }, 0);
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
  s.piles.hand.splice(handIndex, 1);
  s.piles.discard.push(inst);
  log(s, `> ${def.name}`);

  const alive = aliveEnemies(s);
  const chosen = alive.find((e) => e.uid === targetUid) ?? alive[0];

  for (const action of def.play) {
    const targets = action.target === "all" ? aliveEnemies(s) : (chosen && chosen.hp > 0 ? [chosen] : []);
    if (action.action === "damage") {
      for (const t of targets) {
        for (let h = 0; h < (action.hits ?? 1); h++) {
          const { amount, detail } = computeDamage({ build: s.build, card: def, action, target: t, playsBefore: s.playsThisTurn - 1 });
          const note = detail.elem > 1 ? " [sehr effektiv]" : detail.elem < 1 ? " [resistent]" : "";
          dealDamage(s, t, amount, def.name, { note });
        }
      }
    } else if (action.action === "block") {
      s.player.block += action.value;
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
    } else if (action.action === "playerStatus") {
      s.player.statuses[action.status] = (s.player.statuses[action.status] ?? 0) + action.stacks;
      log(s, `  Du: +${action.stacks} ${action.status}`);
    }
  }

  // Elementar-Reaktion: zwei verschiedene Elemente nacheinander im selben Zug
  if (def.element) {
    if (s.lastElement && s.lastElement !== def.element) triggerReaction(s, s.lastElement, def.element, chosen);
    s.lastElement = def.element;
  }

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
  for (const kind of ["cards", "weapons", "items", "enemies"]) {
    const total = Object.keys(CONTENT[kind]).length;
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

const createMeta = () => ({ runs: 0, wins: 0, highestWon: -1, bossKills: 0, unlocked: {}, dex: createDex() });

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
    default: return false;
  }
}

function describeUnlock(c) {
  return { wins: `${c.count} Run(s) gewinnen`, runs: `${c.count} Run(s) spielen`, bossKills: `${c.count}x den Endboss besiegen`, shinies: `${c.count} Shiny finden` }[c.type];
}

// Prüft alle Bedingungen, gibt neu Freigeschaltetes zurück
function evaluateUnlocks(meta) {
  const fresh = [];
  for (const kind of ["cards", "weapons", "items"]) {
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
  }
  const before = maxDifficulty(meta);
  const unlocks = evaluateUnlocks(meta);
  return { unlocks, newDifficulty: won && before > run.difficulty ? CONFIG.difficulty[before]?.name : null };
}

__exports.createMeta = createMeta;
__exports.maxDifficulty = maxDifficulty;
__exports.isUnlocked = isUnlocked;
__exports.describeUnlock = describeUnlock;
__exports.evaluateUnlocks = evaluateUnlocks;
__exports.recordRun = recordRun;

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
function pickOne(ctx, kind, exclude, biased) {
  let idx = RARITY_ORDER.indexOf(rollRarityFor(ctx));
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
    const def = pickOne(ctx, "items", taken, false);
    if (!def) break;
    taken.add(def.id);
    out.push(CONTENT.get("items", `${def.id}:s`));
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
      if (s.sold) return;
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
__exports.goldDrop = goldDrop;
__exports.generateShop = generateShop;
__exports.rerollShop = rerollShop;
__exports.buy = buy;
__exports.payRemoval = payRemoval;

});
__define("engine/run.js", function (__exports, __require) {
// Run-Ablauf als Zustandsmaschine (UI-unabhängig). Der Run besteht nur aus IDs und Zahlen und ist speicherbar.
//
// Phasen (run.phase): map | combat | reward | shop | rest | event | won | lost
// Ablauf: availableNodes -> enterNode -> (Kampf spielen -> completeCombat -> takeCard/takeItem/... -> finishReward) usw.
const { CONFIG } = __require("data/config.js");
const { CONTENT } = __require("content/index.js");
const { createRng } = __require("engine/rng.js");
const { generateMap, findNode } = __require("engine/map.js");
const { resolveBuild } = __require("engine/modifiers.js");
const { createCombat } = __require("engine/combat.js");
const { recordShiny } = __require("engine/dex.js");
const { recordRun } = __require("engine/meta.js");
const { generateCardReward, generateItemChoices, generateWeaponChoices, generateShinyItemChoices, generateShop, rerollShop, buy, payRemoval, goldDrop } = __require("engine/loot.js");

const RARITY_RANK = { gewoehnlich: 0, ungewoehnlich: 1, selten: 2, legendaer: 3 };
const fail = (reason) => ({ ok: false, reason });
const ok = (extra = {}) => ({ ok: true, ...extra });

// ---------------------------------------------------------------- Aufbau
function createRun({ classId = "nahkaempfer", seed = (Date.now() >>> 0), difficulty = 0, meta } = {}) {
  const cls = CONTENT.classes[classId];
  const rng = createRng(seed);
  const run = {
    seed, classId, difficulty, meta, rng,
    phase: "map", map: generateMap(rng), nodeId: null,
    hp: 0, maxHp: 0, bonusMaxHp: 0, gold: CONFIG.run.startGold,
    deck: [...cls.deck], weapon: cls.weapon, items: [...(cls.items ?? [])],
    pending: null, seenEncounters: [], usedEvents: [], summary: null, path: [], verbose: false,
    stats: { fights: 0, elites: 0, minibosses: 0, nodes: 0, shinyEnemies: 0, shinyLoot: 0, goldEarned: 0 },
  };
  run.maxHp = computeMaxHp(run);
  run.hp = run.maxHp;
  return run;
}

const specOf = (run) => ({ deck: run.deck, weapon: run.weapon, items: run.items, hp: CONTENT.classes[run.classId].hp, stats: CONTENT.classes[run.classId].stats });
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
const addItem = (run, id) => { run.items.push(id); refreshMaxHp(run); };
const backToMap = (run) => { run.phase = "map"; run.pending = null; };

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

  if (combat.result === "lost") return endRun(run, false);

  for (const id of combat.shinyKills) {
    run.stats.shinyEnemies++;
    if (run.meta) recordShiny(run.meta.dex, "enemies", id);
  }
  if (kind === "boss") return endRun(run, true);

  const ctx = ctxOf(run);
  const [lo, hi] = CONFIG.gold[kind];
  const gold = goldDrop(ctx, lo + Math.floor(run.rng.next() * (hi - lo + 1)));
  run.gold += gold;
  run.stats.goldEarned += gold;

  const reward = { gold, cards: generateCardReward(ctx).map((d) => d.id), items: [], weapons: [], shinyItems: [], taken: {} };
  if (kind === "elite" || kind === "miniboss" || run.rng.next() < CONFIG.run.normalItemChance) {
    reward.items = generateItemChoices(ctx).map((d) => d.id);
  }
  if (kind === "miniboss") reward.weapons = generateWeaponChoices(ctx).map((d) => d.id);
  if (combat.shinyKills.length) reward.shinyItems = generateShinyItemChoices(ctx).map((d) => d.id);
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
const takeCard = (run, idx) => take(run, "cards", idx, (id) => run.deck.push(id));
const takeItem = (run, idx) => take(run, "items", idx, (id) => addItem(run, id));
const takeWeapon = (run, idx) => take(run, "weapons", idx, (id) => { run.weapon = id; });
const takeShinyItem = (run, idx) => take(run, "shinyItems", idx, (id) => addItem(run, id));
function finishReward(run) {
  if (run.phase !== "reward") return fail("Keine Belohnung offen");
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
  if (kind === "cards") run.deck.push(res.id); else addItem(run, res.id);
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
      case "gainCard": { const id = cardOfRarity(run, e.minRarity); if (id) { run.deck.push(id); out.gained.push(id); } break; }
      case "giveItem": addItem(run, e.id); out.gained.push(e.id); break;
      case "giveCard": run.deck.push(e.id); out.gained.push(e.id); break;
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
  if (run.meta) run.summary.meta = recordRun(run.meta, run, won);
  return ok({ ended: true, won });
}

// ---- Speichern
// SAVE_FORMAT erhöhen, wenn sich der Aufbau des Run-Objekts ändert. Die Inhalts-Signatur ändert sich automatisch,
// sobald Karten, Items, Waffen, Gegner, Begegnungen, Ereignisse, Klassen oder Reaktionen hinzukommen/wegfallen/umbenannt werden.
// Passt ein Spielstand nicht mehr, wird er verworfen statt zu crashen (Freischaltungen/Shinys bleiben).
const SAVE_FORMAT = 1;
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

__exports.createRun = createRun;
__exports.specOf = specOf;
__exports.buildOf = buildOf;
__exports.currentLayer = currentLayer;
__exports.ctxOf = ctxOf;
__exports.availableNodes = availableNodes;
__exports.enterNode = enterNode;
__exports.completeCombat = completeCombat;
__exports.takeCard = takeCard;
__exports.takeItem = takeItem;
__exports.takeWeapon = takeWeapon;
__exports.takeShinyItem = takeShinyItem;
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
__define("ui/util.js", function (__exports, __require) {
// Kleine Helfer für die Oberfläche (kein DOM nötig, daher in Node testbar).
const { CONTENT } = __require("content/index.js");

const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const cap = (s) => (s ? s[0].toUpperCase() + s.slice(1) : "");

// Braucht die Karte ein einzelnes Ziel? (Flächen-, Block- und Zieh-Karten nicht)
const needsTarget = (def) =>
  def.play.some((a) => ["damage", "status", "multiplyStatus"].includes(a.action) && a.target !== "all");

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

__exports.esc = esc;
__exports.cap = cap;
__exports.needsTarget = needsTarget;
__exports.nameAny = nameAny;
__exports.describePassive = describePassive;
__exports.describeWeapon = describeWeapon;
__exports.describeItem = describeItem;

});
__define("ui/art.js", function (__exports, __require) {
// Grafik-Platzhalter: Emoji + Elementfarben. Später durch Pixel-Art ersetzbar (assets/<art>/<id>.png), ohne die Logik anzufassen.
const { CONTENT } = __require("content/index.js");

const ELEMENT_ICON = { feuer: "🔥", wasser: "💧", pflanze: "🌿", eis: "❄️" };
const elementIcon = (id) => ELEMENT_ICON[id] ?? "✨";
const elementColor = (id) => CONTENT.elements[id]?.color ?? "#8a8a9a";
const elementName = (id) => CONTENT.elements[id]?.name ?? id;

const ENEMY_ICON = {
  ratte: "🐀", goblin: "👺", skelett: "💀", bandit: "🥷", steingolem: "🗿", knochenhauptmann: "🦴", glutgeist: "👻",
  frostwolf: "🐺", dornenranke: "🌱", flussgeist: "🌊", sumpfgeist: "🫧", funke: "✨", elementarwandler: "🐲",
};
const enemyIcon = (id) => ENEMY_ICON[id] ?? "👾";

function cardIcon(def) {
  if (def.element) return elementIcon(def.element);
  const t = def.tags;
  if (t.includes("gift")) return "☠️";
  if (t.includes("blut")) return "🩸";
  if (t.includes("fernkampf")) return "🏹";
  if (t.includes("zauber")) return "✨";
  if (t.includes("block")) return "🛡️";
  if (t.includes("ausweichen")) return "💨";
  if (t.includes("flaeche")) return "💥";
  if (t.includes("debuff")) return "🎯";
  if (t.includes("utility")) return "📜";
  return "⚔️";
}
function itemIcon(def) {
  const t = def.tags, s = def.stats ?? {};
  if (s.luck || t.includes("glueck")) return "🍀";
  if (s.goldPct || t.includes("gold")) return "🪙";
  if (s.maxHp || t.includes("heilung")) return "❤️";
  if (s.energy) return "🔋";
  if (s.handSize) return "🎒";
  if (t.includes("pakt")) return "🩸";
  if (t.includes("dornen")) return "🌵";
  if (t.includes("ruestung") || t.includes("block")) return "🛡️";
  for (const e of Object.keys(CONTENT.elements)) if (t.includes(e)) return elementIcon(e);
  if (t.includes("gift")) return "☠️";
  if (t.includes("blut")) return "🩸";
  if (t.includes("fernkampf")) return "🏹";
  if (t.includes("zauber")) return "🔮";
  return "💎";
}
function weaponIcon(def) {
  if (def.tags.includes("fernkampf")) return "🏹";
  if (def.tags.includes("zauber")) return "🪄";
  return "🗡️";
}

const STATUS = {
  gift: ["☠️", "Gift"], blutung: ["🩸", "Blutung"], verwundbar: ["💢", "Verwundbar"], markiert: ["🎯", "Markiert"], ausweichen: ["💨", "Ausweichen"],
};
const NODE_ICON = { kampf: "⚔️", elite: "💀", miniboss: "👹", rast: "🏕️", haendler: "🛒", ereignis: "❓", boss: "🐲" };
const NODE_NAME = { kampf: "Kampf", elite: "Elite", miniboss: "Mini-Boss", rast: "Rast", haendler: "Händler", ereignis: "Ereignis", boss: "Endboss" };
const RARITY = { gewoehnlich: ["Gewöhnlich", "#9aa4b2"], ungewoehnlich: ["Ungewöhnlich", "#4fc27a"], selten: ["Selten", "#5aa0ff"], legendaer: ["Legendär", "#ffb347"] };

__exports.elementIcon = elementIcon;
__exports.elementColor = elementColor;
__exports.elementName = elementName;
__exports.enemyIcon = enemyIcon;
__exports.cardIcon = cardIcon;
__exports.itemIcon = itemIcon;
__exports.weaponIcon = weaponIcon;
__exports.STATUS = STATUS;
__exports.NODE_ICON = NODE_ICON;
__exports.NODE_NAME = NODE_NAME;
__exports.RARITY = RARITY;

});
__define("ui/views.js", function (__exports, __require) {
// Ansichten: reine Funktionen, die HTML-Strings aus dem UI-Zustand erzeugen (kein DOM, daher in Node testbar).
const { CONTENT } = __require("content/index.js");
const { CONFIG } = __require("data/config.js");
const { aliveEnemies, intentOf } = __require("engine/combat.js");
const { availableNodes, buildOf, currentLayer } = __require("engine/run.js");
const { findNode } = __require("engine/map.js");
const { tagCount } = __require("engine/modifiers.js");
const { maxDifficulty, describeUnlock } = __require("engine/meta.js");
const { dexProgress } = __require("engine/dex.js");
const { esc, needsTarget, nameAny, describeItem, describeWeapon } = __require("ui/util.js");
const { elementIcon, elementColor, elementName, enemyIcon, cardIcon, itemIcon, weaponIcon, STATUS, NODE_ICON, NODE_NAME, RARITY } = __require("ui/art.js");

const at = (action, arg, arg2) => ` data-action="${action}"${arg !== undefined ? ` data-arg="${esc(arg)}"` : ""}${arg2 !== undefined ? ` data-arg2="${esc(arg2)}"` : ""}`;
const btn = (label, action, arg, o = {}) =>
  `<button class="btn ${o.cls ?? ""}"${o.disabled ? " disabled" : at(action, arg, o.arg2)}>${label}</button>`;
const pctOf = (a, b) => Math.max(0, Math.min(100, Math.round((a / Math.max(1, b)) * 100)));

// ---------------------------------------------------------------- Bausteine
function cardHtml(def, o = {}) {
  const el = def.element ? elementColor(def.element) : "#7d8597";
  const rar = RARITY[def.rarity] ?? RARITY.gewoehnlich;
  const tags = def.tags.filter((t) => !["angriff"].includes(t)).slice(0, 3).join(" · ");
  return `<div class="card ${def.shiny ? "shiny" : ""} ${o.selected ? "sel" : ""} ${o.dim ? "dim" : ""} ${o.big ? "big" : ""}" style="--el:${el};--rar:${rar[1]}"${o.action ? at(o.action, o.arg, o.arg2) : ""}>
    <div class="c-top"><span class="c-cost">${def.cost}</span><span class="c-name">${esc(def.name)}</span></div>
    <div class="c-art">${cardIcon(def)}</div>
    <div class="c-text">${esc(def.text ?? "")}</div>
    <div class="c-foot">${esc(rar[0])}${tags ? " · " + esc(tags) : ""}${o.count > 1 ? ` · ×${o.count}` : ""}</div></div>`;
}

function itemHtml(def, kind = "items") {
  const rar = RARITY[def.rarity] ?? RARITY.gewoehnlich;
  const icon = kind === "weapons" ? weaponIcon(def) : itemIcon(def);
  const text = kind === "weapons" ? describeWeapon(def) : describeItem(def);
  return `<div class="itemcard px ${def.shiny ? "shiny" : ""}" style="--rar:${rar[1]}"><span class="ico">${icon}</span>
    <div><b>${esc(def.name)}</b><span class="d" style="color:${rar[1]}">${esc(rar[0])}${kind === "weapons" ? " · Waffe" : ""}</span><span class="d">${esc(text)}</span></div></div>`;
}

const statusChips = (statuses) =>
  Object.entries(statuses).filter(([, v]) => v > 0).map(([k, v]) => `<span title="${(STATUS[k] ?? [])[1] ?? k}">${(STATUS[k] ?? ["•"])[0]}${v}</span>`).join("");

// ---------------------------------------------------------------- Kopfzeile im Run
function header(ui) {
  const run = ui.run, build = buildOf(run);
  const weapon = CONTENT.get("weapons", run.weapon);
  const items = run.items.map((id) => CONTENT.get("items", id));
  return `<div class="top"><div class="row wrap">
      <span class="stat">❤️ ${run.hp}/${run.maxHp}</span><span class="stat gold">🪙 ${run.gold}</span>
      <span class="muted grow" style="font-size:12px">${esc(CONTENT.classes[run.classId].name)} · ${esc(CONFIG.difficulty[run.difficulty].name)}</span>
      ${btn(`🃏 ${run.deck.length}`, "show-deck", undefined, { cls: "small" })}${btn("☰", "show-menu", undefined, { cls: "small" })}</div>
    <div class="bar hpgood"><i style="width:${pctOf(run.hp, run.maxHp)}%"></i></div>
    <div class="itemrow"${at("show-items")}><span class="i ${weapon.shiny ? "shiny" : ""}">${weaponIcon(weapon)}</span>${items.map((d) => `<span class="i ${d.shiny ? "shiny" : ""}">${itemIcon(d)}</span>`).join("")}</div>
  </div>`;
}

// ---------------------------------------------------------------- Karte
function mapView(ui) {
  const run = ui.run, map = run.map, L = map.layers.length;
  const W = 340, SP = 72, PAD = 44, H = (L + 1) * SP + PAD * 2;
  const pos = (n) => {
    const count = n.id === "boss" ? 1 : map.layers[n.layer].length;
    return { x: ((n.index + 0.5) * W) / count, y: H - PAD - n.layer * SP };
  };
  const path = run.path ?? [];
  const avail = run.phase === "map" ? availableNodes(run) : [];
  const nodes = [...map.layers.flat(), map.boss];
  const edges = nodes.flatMap((n) => n.next.map((id) => {
    const a = pos(n), b = pos(findNode(map, id));
    const on = path.includes(n.id) && (path.includes(id) || avail.includes(id));
    return `<line class="edge ${on ? "on" : ""}" x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}"/>`;
  })).join("");
  const circles = nodes.map((n) => {
    const p = pos(n), isAvail = avail.includes(n.id), done = path.includes(n.id);
    const cls = `node ${isAvail ? "avail" : done ? "done" : "dim"} ${run.nodeId === n.id ? "cur" : ""}`;
    return `<g class="${cls}"${isAvail ? at("node", n.id) : ""}><title>${NODE_NAME[n.type]}</title><circle cx="${p.x}" cy="${p.y}" r="${n.type === "boss" ? 26 : 20}"/><text x="${p.x}" y="${p.y + 1}">${NODE_ICON[n.type]}</text></g>`;
  }).join("");
  return `${header(ui)}<div class="section"><h3>Dungeon · Ebene ${currentLayer(run) + (run.nodeId ? 1 : 0)}/${L}</h3>
    <div class="muted" style="font-size:12px">Wähle einen leuchtenden Ort. Abkürzungen überspringen Ebenen.</div></div>
    <div class="map-wrap"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Dungeon-Karte">${edges}${circles}</svg></div>
    <div class="legend">${Object.entries(NODE_ICON).map(([k, v]) => `${v} ${NODE_NAME[k]}`).join(" · ")}</div>`;
}

// ---------------------------------------------------------------- Kampf
function enemyHtml(e, combat, targetable) {
  const def = CONTENT.enemies[e.id], m = def.mechanics ?? {};
  const dead = e.hp <= 0, intent = dead ? null : intentOf(combat, e);
  const intentTxt = !intent ? "" : intent.type === "attack" ? `⚔️ ${intent.value}${(intent.hits ?? 1) > 1 ? `×${intent.hits}` : ""}` : `🛡️ ${intent.value}`;
  const els = e.elements.map((el) => `<span class="elchip" style="background:${elementColor(el)}">${elementIcon(el)} ${esc(elementName(el))}</span>`).join("");
  const rot = m.rotateElement && e.nextElement && !dead
    ? `<div class="muted" style="font-size:11px">→ ${elementIcon(e.nextElement)} in ${Math.max(1, m.rotateElement.every - e.rotTimer)} Zug</div>` : "";
  const plates = m.plates && !dead
    ? `<div style="font-size:12px;font-weight:800">${e.plates > 0 ? `🛡️ Platten: ${e.plates}` : `<span class="good">Panzer gebrochen</span> <span class="muted">(wächst in ${Math.max(1, m.plates.regenAfter - e.plateTimer)})</span>`}</div>` : "";
  return `<div class="enemy px ${e.shiny ? "shiny" : ""} ${dead ? "dead" : ""} ${targetable ? "targetable" : ""}"${targetable ? at("target", e.uid) : ""}>
    <div class="ico">${enemyIcon(e.id)}</div><div class="nm">${esc(e.name)}</div>
    <div class="bar"><i style="width:${pctOf(e.hp, e.maxHp)}%"></i></div><div style="font-size:12px">${e.hp}/${e.maxHp}${e.block > 0 ? ` · 🛡️${e.block}` : ""}</div>
    <div class="intent">${intentTxt}</div>${els}${rot}${plates}<div class="sts">${statusChips(e.statuses)}</div></div>`;
}

function combatView(ui) {
  const run = ui.run, c = run.pending.combat, P = c.player, build = c.build;
  const alive = aliveEnemies(c), hand = c.piles.hand;
  const sel = ui.selected !== null ? hand[ui.selected] : null;
  const wantsTarget = sel && needsTarget(sel.def) && alive.length > 1;
  const maxEnergy = CONFIG.player.startEnergy + build.stats.energy;
  const lines = c.log.slice(ui.showLog ? -28 : -6).map((l) => `<div class="${l.includes("***") ? "hit" : ""}">${esc(l.trim())}</div>`).join("");
  const info = sel ? `<div class="info px">${cardHtml(sel.def, { big: true })}
      <div class="row" style="margin-top:8px">${wantsTarget ? `<span class="grow"><b>🎯 Tippe einen Gegner an</b></span>`
        : btn(sel.def.cost > P.energy ? "Zu wenig Energie" : "Spielen ▶", "play-selected", undefined, { cls: "primary grow", disabled: sel.def.cost > P.energy })}
        ${btn("✖", "select-card", String(ui.selected), { cls: "small" })}</div></div>` : "";
  return `${header(ui)}<div class="combat">
    <div class="enemies">${c.enemies.map((e) => enemyHtml(e, c, wantsTarget && e.hp > 0)).join("")}</div>
    <div class="logbox px">${lines || "<span class='muted'>Der Kampf beginnt …</span>"}</div>
    <div class="player px" style="margin:8px"><div class="row"><span class="stat">❤️ ${P.hp}/${P.maxHp}</span><span class="pill">🛡️ ${P.block}</span>
      <span class="energy">⚡ ${P.energy}/${maxEnergy}</span><span class="muted">${statusChips(P.statuses)}</span></div>
      <div class="row" style="margin-top:4px"><span class="pill">📚 ${c.piles.draw.length}</span><span class="pill">🗑️ ${c.piles.discard.length}</span>
      <span class="muted grow center" style="font-size:12px">Zug ${c.turn} · ${esc(c.encounter.name)}</span></div></div>
    ${info}
    <div class="hand">${hand.map((inst, i) => cardHtml(inst.def, { selected: ui.selected === i, dim: inst.def.cost > P.energy, action: "select-card", arg: String(i) })).join("") || "<span class='muted pad'>Keine Karten auf der Hand</span>"}</div>
    <div class="bottombar row">${btn("Zug beenden ▶", "end-turn", undefined, { cls: "primary grow", disabled: Boolean(c.result) })}${btn(ui.showLog ? "Log ▲" : "Log ▼", "toggle-log", undefined, { cls: "small" })}</div>
  </div>
  ${c.result ? `<div class="overlay"><div class="sheet mid center stack"><div class="big-emoji">${c.result === "won" ? "⚔️" : "💀"}</div>
    <h2>${c.result === "won" ? "Sieg!" : "Niederlage"}</h2>
    ${c.shinyKills.length ? `<div class="shiny px pad"><b>✦ Ein Shiny wurde besiegt! ✦</b><br>Dafür gibt es einen besonderen Fund.</div>` : ""}
    ${btn("Weiter", "after-combat", undefined, { cls: "primary" })}</div></div>` : ""}`;
}

// ---------------------------------------------------------------- Belohnung
function rewardView(ui) {
  const run = ui.run, r = run.pending.reward, t = r.taken;
  const cardSlots = (list, kind) => list.map((id, i) => {
    const def = CONTENT.get("cards", id);
    return `<div class="slot">${cardHtml(def)}${btn(t.cards ? "—" : "Nehmen", "take", "cards", { arg2: String(i), cls: "small good", disabled: t.cards })}</div>`;
  }).join("");
  const listSlots = (list, kind, key) => list.map((id, i) => {
    const def = CONTENT.get(kind, id);
    return `<div class="stack">${itemHtml(def, kind)}${btn(t[key] ? "—" : "Nehmen", "take", key, { arg2: String(i), cls: "small good", disabled: t[key] })}</div>`;
  }).join("");
  const cur = CONTENT.get("weapons", run.weapon);
  return `${header(ui)}<div class="section"><h2>🎁 Beute</h2><div class="gold"><b>+${r.gold} 🪙 Gold</b></div></div>
    ${r.shinyItems.length ? `<div class="section"><h3 class="gold">✦ Schillernder Fund ✦ (wähle 1)</h3><div class="stack">${listSlots(r.shinyItems, "items", "shinyItems")}</div></div>` : ""}
    <div class="section"><h3>Karte wählen (oder überspringen)</h3><div class="grid">${cardSlots(r.cards)}</div></div>
    ${r.items.length ? `<div class="section"><h3>Item wählen</h3><div class="stack">${listSlots(r.items, "items", "items")}</div></div>` : ""}
    ${r.weapons.length ? `<div class="section"><h3>Waffe tauschen? (aktuell: ${esc(cur.name)}, Stärke ${cur.power})</h3><div class="stack">${listSlots(r.weapons, "weapons", "weapons")}</div></div>` : ""}
    <div class="pad">${btn("Weiter ▶", "finish-reward", undefined, { cls: "primary" })}</div>`;
}

// ---------------------------------------------------------------- Shop
function shopView(ui) {
  const run = ui.run, shop = run.pending.shop;
  const cards = shop.cards.map((s, i) => `<div class="slot ${s.sold ? "sold" : ""}">${cardHtml(CONTENT.get("cards", s.id))}
    ${btn(s.sold ? "Verkauft" : `${s.price} 🪙`, "buy", "cards", { arg2: String(i), cls: "small", disabled: s.sold || s.price > run.gold })}</div>`).join("");
  const items = shop.items.map((s, i) => `<div class="stack ${s.sold ? "sold" : ""}">${itemHtml(CONTENT.get("items", s.id))}
    ${btn(s.sold ? "Verkauft" : `${s.price} 🪙`, "buy", "items", { arg2: String(i), cls: "small", disabled: s.sold || s.price > run.gold })}</div>`).join("");
  return `${header(ui)}<div class="section"><h2>🛒 Händler</h2><div class="muted">Dein Gold: <b class="gold">${run.gold} 🪙</b></div></div>
    <div class="section"><h3>Karten</h3><div class="grid">${cards}</div></div>
    <div class="section"><h3>Items</h3><div class="stack">${items}</div></div>
    <div class="section row wrap">${btn(`🎲 Neu würfeln (${shop.rerollCost} 🪙)`, "reroll", undefined, { disabled: run.gold < shop.rerollCost })}
      ${btn(`🗑️ Karte entfernen (${shop.removeCost} 🪙)`, "remove-start", undefined, { disabled: run.gold < shop.removeCost || run.deck.length <= CONFIG.run.minDeck })}</div>
    <div class="pad">${btn("Weiter ▶", "leave-shop", undefined, { cls: "primary" })}</div>`;
}

// ---------------------------------------------------------------- Rast, Ereignis
function restView(ui) {
  const run = ui.run, heal = Math.min(run.maxHp - run.hp, Math.ceil(run.maxHp * CONFIG.run.restHealPct));
  return `${header(ui)}<div class="section center stack"><div class="big-emoji">🏕️</div><h2>Rastplatz</h2><div class="muted">Ein Feuer knistert. Du hast Zeit für genau eine Sache.</div>
    ${btn(`😴 Ausruhen (+${heal} HP)`, "rest-heal", undefined, { cls: "good" })}
    ${btn("🗑️ Eine Karte aus dem Deck entfernen", "rest-remove-start", undefined, { disabled: run.deck.length <= CONFIG.run.minDeck })}</div>`;
}
function eventView(ui) {
  const run = ui.run, ev = CONTENT.events[run.pending.eventId];
  return `${header(ui)}<div class="section center stack"><div class="big-emoji">❓</div><h2>${esc(ev.name)}</h2><div>${esc(ev.text)}</div></div>
    <div class="section stack">${ev.choices.map((ch, i) => {
      const lack = ch.requires?.gold > run.gold;
      return btn(esc(ch.label) + (lack ? " (zu wenig Gold)" : ""), "event-choice", String(i), { disabled: lack, cls: "grow" });
    }).join("")}</div>`;
}

// ---------------------------------------------------------------- Ende
function endView(ui) {
  const run = ui.run, s = run.summary, won = s.won, m = s.meta;
  return `<div class="pad stack center"><div class="big-emoji">${won ? "🏆" : "💀"}</div><h1>${won ? "Sieg! Der Wandler ist gefallen." : "Der Run ist zu Ende."}</h1>
    <div class="px pad" style="text-align:left"><div>Klasse: <b>${esc(CONTENT.classes[run.classId].name)}</b> · ${esc(CONFIG.difficulty[run.difficulty].name)}</div>
      <div>Kämpfe: <b>${s.stats.fights}</b> · Orte: <b>${s.stats.nodes}</b> · Gold verdient: <b>${s.stats.goldEarned}</b></div>
      <div>Items: <b>${s.items}</b> · Deckgröße: <b>${s.deck}</b></div>
      <div>Shinys gesehen: <b>${s.stats.shinyEnemies + s.stats.shinyLoot}</b> · Seed: <b>${run.seed}</b></div></div>
    ${m?.newDifficulty ? `<div class="px pad good"><b>🔓 Neue Schwierigkeit freigeschaltet: ${esc(m.newDifficulty)}</b></div>` : ""}
    ${m?.unlocks?.length ? `<div class="px pad"><b>🔓 Neu freigeschaltet:</b><br>${m.unlocks.map((u) => esc(u.name)).join(", ")}</div>` : ""}
    ${btn("Zurück zum Titel", "to-title", undefined, { cls: "primary" })}</div>`;
}

// ---------------------------------------------------------------- Titel, Sammlung
function titleView(ui) {
  const meta = ui.meta, maxD = maxDifficulty(meta), f = ui.form;
  return `<div class="title stack"><div class="logo">🃏 Rogue-Deck<small>Arbeitstitel · Deckbuilder-Roguelite</small></div>
    ${ui.hasSave ? btn("▶ Run fortsetzen", "continue", undefined, { cls: "good" }) : ""}
    <h3>Klasse</h3><div class="classes">${Object.values(CONTENT.classes).map((c) => `<div class="cls px ${f.classId === c.id ? "on" : ""}"${at("set-class", c.id)}>
      <b>${esc(c.name)}</b> <span class="muted">· ${c.hp} HP</span><div style="font-size:13px">${esc(c.blurb ?? "")}</div></div>`).join("")}</div>
    <h3>Schwierigkeit</h3><div class="chips">${CONFIG.difficulty.map((d, i) => i <= maxD
      ? `<span class="chip ${f.difficulty === i ? "on" : ""}"${at("set-diff", String(i))}>${esc(d.name)}</span>` : `<span class="chip lock">🔒 ${esc(d.name)}</span>`).join("")}</div>
    ${maxD < CONFIG.difficulty.length - 1 ? `<div class="muted" style="font-size:12px">Die nächste Stufe wird nach einem Sieg freigeschaltet.</div>` : ""}
    <h3>Seed (optional, gleiche Karte für Freunde)</h3><input class="seed" inputmode="numeric" placeholder="leer = Zufall" value="${esc(f.seed)}" data-change="set-seed">
    ${btn("⚔️ Neuer Run", "new-run", undefined, { cls: "primary" })}
    ${btn(`✦ Sammlung & Freischaltungen`, "show-collection")}
    <div class="muted center" style="font-size:12px">Siege ${meta.wins} · Runs ${meta.runs} · Shinys im Dex ${Object.keys(meta.dex.shiny).length}</div></div>`;
}

function collectionView(ui) {
  const meta = ui.meta, prog = dexProgress(meta.dex), found = Object.entries(meta.dex.shiny);
  const labels = { cards: "Karten", weapons: "Waffen", items: "Items", enemies: "Gegner" };
  const unlockables = ["cards", "weapons", "items"].flatMap((kind) => Object.values(CONTENT[kind]).filter((d) => d.unlock).map((d) => ({ kind, d })));
  return `<div class="title stack"><h2>✦ Shiny-Dex</h2>
    <div class="px pad">${Object.entries(prog).map(([k, v]) => `<div class="dexrow"><span>${labels[k]}</span><b>${v.found}/${v.total}</b></div>`).join("")}</div>
    ${found.length ? `<div class="px pad">${found.map(([key, n]) => { const [kind, id] = key.split("/"); return `<div class="dexrow"><span>✦ ${esc(CONTENT[kind][id]?.name ?? id)}</span><span class="muted">×${n}</span></div>`; }).join("")}</div>`
      : `<div class="muted">Noch kein Shiny gefunden. Chance: 1 zu ${Math.round(1 / CONFIG.shiny.enemyChance)} pro Gegner.</div>`}
    <h2>🔓 Freischaltungen</h2><div class="px pad">${unlockables.map(({ kind, d }) => {
      const open = Boolean(meta.unlocked[`${kind}/${d.id}`]);
      return `<div class="dexrow"><span>${open ? "✔️" : "🔒"} ${esc(d.name)}</span><span class="muted" style="text-align:right">${open ? "frei" : esc(describeUnlock(d.unlock))}</span></div>`;
    }).join("")}</div>
    ${ui.confirmReset ? `<div class="px pad stack"><b class="bad">Wirklich alles löschen?</b><div class="row">${btn("Ja, löschen", "reset-yes", undefined, { cls: "danger" })}${btn("Abbrechen", "reset-no")}</div></div>`
      : btn("Spielstand löschen", "reset-ask", undefined, { cls: "small" })}
    ${btn("← Zurück", "to-title", undefined, { cls: "primary" })}</div>`;
}

// ---------------------------------------------------------------- Overlays
function groupedDeck(run) {
  const order = [], counts = {};
  run.deck.forEach((id, i) => { if (!(id in counts)) { counts[id] = []; order.push(id); } counts[id].push(i); });
  return order.map((id) => ({ id, idxs: counts[id], def: CONTENT.get("cards", id) }));
}
function overlayView(ui) {
  const run = ui.run, o = ui.overlay;
  const close = btn("Schließen", "close-overlay", undefined, { cls: "primary" });
  if (o === "deck") {
    return `<div class="overlay"><div class="sheet"><h2>🃏 Dein Deck (${run.deck.length})</h2><div class="grid">${groupedDeck(run).map((g) => cardHtml(g.def, { count: g.idxs.length })).join("")}</div>${close}</div></div>`;
  }
  if (o === "items") {
    const build = buildOf(run), weapon = CONTENT.get("weapons", run.weapon);
    const labels = { luck: "Glück", maxHp: "Max-HP", energy: "Energie", handSize: "Handkarten", goldPct: "% Gold", regen: "Regeneration", blockStart: "Block/Zug", shiny: "Shiny-Chance", reaction: "% Reaktionen" };
    const stats = Object.entries(build.stats).filter(([, v]) => v).map(([k, v]) => `<span class="chip">${v > 0 ? "+" : ""}${v} ${labels[k] ?? k}</span>`).join(" ");
    const tags = [...new Set([...CONFIG.typeTags, ...Object.keys(CONTENT.elements)])].map((t) => [t, tagCount(build, t)]).filter(([, n]) => n > 0)
      .map(([t, n]) => `<span class="chip">${CONTENT.elements[t] ? elementIcon(t) + " " : ""}${esc(t)} ${n}</span>`).join(" ");
    return `<div class="overlay"><div class="sheet stack"><h2>🎒 Ausrüstung</h2>${itemHtml(weapon, "weapons")}
      ${run.items.map((id) => itemHtml(CONTENT.get("items", id))).join("") || "<div class='muted'>Noch keine Items.</div>"}
      ${stats ? `<h3>Werte</h3><div class="chips">${stats}</div>` : ""}${tags ? `<h3>Typen im Build (für Synergien)</h3><div class="chips">${tags}</div>` : ""}${close}</div></div>`;
  }
  if (o === "pick-remove") {
    return `<div class="overlay"><div class="sheet"><h2>🗑️ Welche Karte entfernen?</h2><div class="grid">${groupedDeck(run).map((g) =>
      `<div class="slot">${cardHtml(g.def, { count: g.idxs.length })}${btn("Entfernen", "pick-remove", String(g.idxs[0]), { cls: "small danger" })}</div>`).join("")}</div>${close}</div></div>`;
  }
  if (o === "menu") {
    return `<div class="overlay"><div class="sheet mid stack"><h2>☰ Menü</h2><div class="muted">Seed: <b>${run.seed}</b> (für Freunde: gleiche Karte)</div>
      ${btn("Weiterspielen", "close-overlay", undefined, { cls: "primary" })}
      ${run.phase === "combat" ? `<div class="muted" style="font-size:12px">Im Kampf wird nicht gespeichert. Beendest du jetzt, beginnt der Kampf beim nächsten Mal von vorn.</div>` : ""}
      ${btn("Zum Titel (speichert)", "to-title")}${btn("Run aufgeben", "abandon", undefined, { cls: "danger" })}</div></div>`;
  }
  return "";
}
const noticeView = (n) => `<div class="overlay"><div class="sheet mid stack center"><h2>${esc(n.title)}</h2>${n.lines.map((l) => `<div>${esc(l)}</div>`).join("")}${btn("OK", "ack-notice", undefined, { cls: "primary" })}</div></div>`;

// ---------------------------------------------------------------- Einstieg
function render(ui) {
  let body;
  if (ui.screen === "title") body = titleView(ui);
  else if (ui.screen === "collection") body = collectionView(ui);
  else {
    const p = ui.run.phase;
    body = p === "map" ? mapView(ui) : p === "combat" ? combatView(ui) : p === "reward" ? rewardView(ui) : p === "shop" ? shopView(ui)
      : p === "rest" ? restView(ui) : p === "event" ? eventView(ui) : endView(ui);
  }
  const overlay = ui.screen === "game" && ui.overlay ? overlayView(ui) : "";
  const notice = ui.notice ? noticeView(ui.notice) : "";
  const toast = ui.toast ? `<div class="toast">${esc(ui.toast)}</div>` : "";
  return body + overlay + notice + toast;
}

__exports.render = render;

});
__define("ui/controller.js", function (__exports, __require) {
// Controller: verbindet Engine und Ansichten. Kein DOM, daher komplett in Node testbar.
// dispatch(action, arg, arg2) verändert den Zustand und gibt false zurück, wenn kein Neuzeichnen nötig ist.
const { CONTENT } = __require("content/index.js");
const { createRun, enterNode, completeCombat, takeCard, takeItem, takeWeapon, takeShinyItem, finishReward, restHeal, shopBuy, shopReroll, shopRemove, restRemove, leaveShop, eventChoose, serializeRun, loadRun, peekSave } = __require("engine/run.js");
const { playCard, endPlayerTurn } = __require("engine/combat.js");
const { createMeta, maxDifficulty } = __require("engine/meta.js");
const { render: renderViews } = __require("ui/views.js");
const { nameAny } = __require("ui/util.js");

const KEY_META = "rd_meta_v1", KEY_RUN = "rd_run_v1";
const signed = (n) => (n > 0 ? `+${n}` : `${n}`);

function createController({ storage = null, seedFn = () => Math.floor(Math.random() * 2147483647) } = {}) {
  const read = (k) => { try { return storage ? JSON.parse(storage.getItem(k)) : null; } catch { return null; } };
  const write = (k, v) => { try { storage?.setItem(k, JSON.stringify(v)); } catch { /* Speicher voll/gesperrt: Spiel läuft trotzdem */ } };
  const remove = (k) => { try { storage?.removeItem(k); } catch { /* ignorieren */ } };

  const meta = Object.assign(createMeta(), read(KEY_META) ?? {});
  meta.dex ??= { shiny: {} };
  meta.unlocked ??= {};
  // Einträge zu Inhalten, die es nach einem Update nicht mehr gibt, aus Dex und Freischaltungen entfernen
  const exists = (key) => { const [kind, id] = key.split("/"); return Boolean(CONTENT[kind]?.[id]); };
  for (const key of Object.keys(meta.dex.shiny)) if (!exists(key)) delete meta.dex.shiny[key];
  for (const key of Object.keys(meta.unlocked)) if (!exists(key)) delete meta.unlocked[key];

  const ui = {
    screen: "title", run: null, meta, form: { classId: "nahkaempfer", difficulty: 0, seed: "" },
    selected: null, overlay: null, removeMode: null, notice: null, toast: null, showLog: false, confirmReset: false,
    hasSave: false,
  };

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
    write(KEY_META, ui.meta);
    const r = ui.run;
    if (!r) return;
    if (r.phase === "won" || r.phase === "lost") { remove(KEY_RUN); ui.hasSave = false; return; }
    if (r.phase === "combat") return;                       // Kampfzustand wird nicht gespeichert
    try { storage?.setItem(KEY_RUN, serializeRun(r)); ui.hasSave = Boolean(storage); } catch { /* ignorieren */ }
  }

  function tryPlay(idx, uid) {
    const combat = ui.run.pending.combat;
    const res = playCard(combat, idx, uid);
    if (!res.ok) toast(res.reason);
    ui.selected = null;
  }

  function dispatch(action, arg, arg2) {
    ui.toast = null;
    const run = ui.run;
    const inPhase = (p) => run && run.phase === p;
    let rerender = true;

    switch (action) {
      // ---- Titel
      case "set-class": ui.form.classId = arg; break;
      case "set-diff": ui.form.difficulty = Number(arg); break;
      case "set-seed": ui.form.seed = String(arg ?? "").replace(/\D/g, "").slice(0, 10); rerender = false; break;
      case "new-run": {
        const seed = parseInt(ui.form.seed, 10) || seedFn();
        ui.run = createRun({ classId: ui.form.classId, difficulty: Math.min(ui.form.difficulty, maxDifficulty(ui.meta)), seed, meta: ui.meta });
        ui.run.verbose = true;
        Object.assign(ui, { screen: "game", selected: null, overlay: null, notice: null });
        break;
      }
      case "continue": {
        const raw = (() => { try { return storage?.getItem(KEY_RUN); } catch { return null; } })();
        if (!raw) { toast("Kein Spielstand gefunden"); ui.hasSave = false; break; }
        try {
          ui.run = loadRun(raw, ui.meta);
          ui.run.path ??= [];
          ui.run.verbose = true;
          Object.assign(ui, { screen: "game", selected: null, overlay: null, notice: null });
        } catch (e) {
          remove(KEY_RUN); ui.hasSave = false;
          toast(e.code === "SAVE_INCOMPATIBLE" ? "Spielstand passt nicht zur neuen Version und wurde verworfen" : "Spielstand war beschädigt");
        }
        break;
      }
      case "to-title": ui.screen = "title"; ui.overlay = null; ui.run = null; ui.confirmReset = false; break;
      case "show-collection": ui.screen = "collection"; break;
      case "reset-ask": ui.confirmReset = true; break;
      case "reset-no": ui.confirmReset = false; break;
      case "reset-yes":
        Object.assign(ui.meta, createMeta());
        remove(KEY_RUN); ui.hasSave = false; ui.confirmReset = false; toast("Spielstand gelöscht");
        break;
      case "abandon": remove(KEY_RUN); ui.hasSave = false; ui.run = null; ui.screen = "title"; ui.overlay = null; break;

      // ---- Overlays
      case "show-deck": ui.overlay = "deck"; break;
      case "show-items": ui.overlay = "items"; break;
      case "show-menu": ui.overlay = "menu"; break;
      case "close-overlay": ui.overlay = null; break;
      case "toggle-log": ui.showLog = !ui.showLog; break;
      case "ack-notice": ui.notice = null; break;

      // ---- Karte und Kampf
      case "node": if (inPhase("map")) { const r = enterNode(run, arg); if (!r.ok) toast(r.reason); ui.selected = null; } break;
      case "select-card": if (inPhase("combat")) ui.selected = ui.selected === Number(arg) ? null : Number(arg); break;
      case "play-selected": if (inPhase("combat") && ui.selected !== null) tryPlay(ui.selected, undefined); break;
      case "target": if (inPhase("combat") && ui.selected !== null) tryPlay(ui.selected, arg); break;
      case "end-turn": if (inPhase("combat") && !run.pending.combat.result) { endPlayerTurn(run.pending.combat); ui.selected = null; } break;
      case "after-combat": if (inPhase("combat")) { const r = completeCombat(run); if (!r.ok) toast(r.reason); ui.selected = null; } break;

      // ---- Belohnung
      case "take": {
        const fn = { cards: takeCard, items: takeItem, weapons: takeWeapon, shinyItems: takeShinyItem }[arg];
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
        if (res.gambled) lines.push(res.gambled === "gewonnen" ? "🎲 Glück gehabt!" : "🎲 Pech gehabt.");
        if (run.hp !== before.hp) lines.push(`❤️ ${signed(run.hp - before.hp)} HP`);
        if (run.maxHp !== before.maxHp) lines.push(`Max-HP ${signed(run.maxHp - before.maxHp)}`);
        if (run.gold !== before.gold) lines.push(`🪙 ${signed(run.gold - before.gold)} Gold`);
        if (res.gained?.length) lines.push(`Erhalten: ${res.gained.map(nameAny).join(", ")}`);
        const gainedCards = (res.gained ?? []).filter((id) => CONTENT.get("cards", id)).length;
        if (run.deck.length < before.deck + gainedCards) lines.push("🗑️ Eine Karte wurde entfernt.");
        if (res.fight) lines.push("⚔️ Ein Kampf beginnt!");
        ui.notice = { title: ev.name, lines: lines.length ? lines : ["Nichts passiert."] };
        break;
      }
      default: toast(`Unbekannte Aktion: ${action}`);
    }
    persist();
    return rerender;
  }

  return { ui, dispatch, render: () => renderViews(ui) };
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
const ctrl = createController({ storage });

function render() {
  root.innerHTML = ctrl.render();
  // Auf der Karte zum nächsten wählbaren Ort scrollen
  const next = root.querySelector(".node.avail");
  if (next && next.scrollIntoView) next.scrollIntoView({ block: "center" });
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
render();



});
__require("ui/main.js");
})();
