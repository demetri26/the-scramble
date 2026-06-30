import { useState, useEffect, useRef } from 'react'

/* ─── Golfer Roster ──────────────────────────────────────
   Modern roster: ratings derived from real 2025/26 PGA Tour &
   Data Golf statistics — Strokes Gained (Off-the-Tee, Approach,
   Around-the-Green, Putting), Driving Distance, Driving Accuracy,
   and Putts-per-Round, converted to 1-99 scale.
   Legends roster: educated estimates from major-championship
   record, scoring averages, and well-documented playing styles
   (e.g. Seve's scrambling, Trevino's ball-striking in wind).
──────────────────────────────────────────────────────── */
const GOLFERS = {
  modern: [
    { name: "Scottie Scheffler",  flag: "🇺🇸", attrs: { power: 86, accuracy: 95, shortGame: 88, putting: 80, mental: 97, windPlay: 86, wetPlay: 82, recovery: 88, stamina: 95, spin: 88 } },
    { name: "Rory McIlroy",       flag: "🇬🇧", attrs: { power: 98, accuracy: 80, shortGame: 83, putting: 86, mental: 84, windPlay: 89, wetPlay: 87, recovery: 79, stamina: 90, spin: 86 } },
    { name: "Jon Rahm",           flag: "🇪🇸", attrs: { power: 91, accuracy: 87, shortGame: 88, putting: 84, mental: 89, windPlay: 86, wetPlay: 85, recovery: 86, stamina: 87, spin: 88 } },
    { name: "Xander Schauffele",  flag: "🇺🇸", attrs: { power: 87, accuracy: 89, shortGame: 85, putting: 81, mental: 91, windPlay: 81, wetPlay: 79, recovery: 82, stamina: 88, spin: 84 } },
    { name: "Collin Morikawa",    flag: "🇺🇸", attrs: { power: 78, accuracy: 96, shortGame: 85, putting: 80, mental: 89, windPlay: 81, wetPlay: 76, recovery: 79, stamina: 84, spin: 93 } },
    { name: "Viktor Hovland",     flag: "🇳🇴", attrs: { power: 89, accuracy: 83, shortGame: 80, putting: 76, mental: 84, windPlay: 86, wetPlay: 82, recovery: 78, stamina: 86, spin: 85 } },
    { name: "Patrick Cantlay",    flag: "🇺🇸", attrs: { power: 82, accuracy: 88, shortGame: 84, putting: 88, mental: 93, windPlay: 78, wetPlay: 76, recovery: 82, stamina: 86, spin: 82 } },
    { name: "Wyndham Clark",      flag: "🇺🇸", attrs: { power: 90, accuracy: 78, shortGame: 78, putting: 85, mental: 80, windPlay: 76, wetPlay: 74, recovery: 76, stamina: 80, spin: 78 } },
    { name: "Matt Fitzpatrick",   flag: "🇬🇧", attrs: { power: 78, accuracy: 90, shortGame: 86, putting: 80, mental: 86, windPlay: 84, wetPlay: 82, recovery: 84, stamina: 82, spin: 88 } },
    { name: "Tommy Fleetwood",    flag: "🇬🇧", attrs: { power: 81, accuracy: 84, shortGame: 90, putting: 70, mental: 85, windPlay: 90, wetPlay: 88, recovery: 86, stamina: 84, spin: 84 } },
    { name: "Shane Lowry",        flag: "🇮🇪", attrs: { power: 84, accuracy: 80, shortGame: 84, putting: 78, mental: 87, windPlay: 93, wetPlay: 95, recovery: 84, stamina: 82, spin: 80 } },
    { name: "Bryson DeChambeau",  flag: "🇺🇸", attrs: { power: 99, accuracy: 70, shortGame: 76, putting: 79, mental: 80, windPlay: 73, wetPlay: 70, recovery: 80, stamina: 88, spin: 74 } },
    { name: "Brooks Koepka",      flag: "🇺🇸", attrs: { power: 93, accuracy: 80, shortGame: 82, putting: 79, mental: 97, windPlay: 78, wetPlay: 76, recovery: 80, stamina: 88, spin: 80 } },
    { name: "Ludvig Åberg",       flag: "🇸🇪", attrs: { power: 91, accuracy: 86, shortGame: 81, putting: 79, mental: 84, windPlay: 84, wetPlay: 82, recovery: 80, stamina: 86, spin: 84 } },
    { name: "Justin Thomas",      flag: "🇺🇸", attrs: { power: 85, accuracy: 84, shortGame: 88, putting: 82, mental: 86, windPlay: 80, wetPlay: 78, recovery: 84, stamina: 84, spin: 88 } },
  ],
  legends: [
    { name: "Tiger Woods",        flag: "🇺🇸", attrs: { power: 92, accuracy: 88, shortGame: 97, putting: 94, mental: 99, windPlay: 86, wetPlay: 84, recovery: 96, stamina: 94, spin: 95 } },
    { name: "Jack Nicklaus",      flag: "🇺🇸", attrs: { power: 90, accuracy: 90, shortGame: 88, putting: 92, mental: 98, windPlay: 88, wetPlay: 84, recovery: 88, stamina: 96, spin: 86 } },
    { name: "Seve Ballesteros",   flag: "🇪🇸", attrs: { power: 86, accuracy: 72, shortGame: 99, putting: 88, mental: 94, windPlay: 88, wetPlay: 86, recovery: 99, stamina: 84, spin: 96 } },
    { name: "Nick Faldo",         flag: "🇬🇧", attrs: { power: 78, accuracy: 94, shortGame: 88, putting: 86, mental: 96, windPlay: 92, wetPlay: 90, recovery: 84, stamina: 90, spin: 88 } },
    { name: "Greg Norman",        flag: "🇦🇺", attrs: { power: 94, accuracy: 82, shortGame: 84, putting: 80, mental: 82, windPlay: 86, wetPlay: 84, recovery: 82, stamina: 88, spin: 84 } },
    { name: "Phil Mickelson",     flag: "🇺🇸", attrs: { power: 86, accuracy: 72, shortGame: 98, putting: 86, mental: 86, windPlay: 80, wetPlay: 78, recovery: 94, stamina: 84, spin: 98 } },
    { name: "Ernie Els",          flag: "🇿🇦", attrs: { power: 90, accuracy: 86, shortGame: 86, putting: 84, mental: 84, windPlay: 84, wetPlay: 82, recovery: 84, stamina: 86, spin: 86 } },
    { name: "Vijay Singh",        flag: "🇫🇯", attrs: { power: 88, accuracy: 84, shortGame: 86, putting: 80, mental: 86, windPlay: 80, wetPlay: 80, recovery: 84, stamina: 96, spin: 84 } },
    { name: "Lee Trevino",        flag: "🇺🇸", attrs: { power: 76, accuracy: 93, shortGame: 90, putting: 90, mental: 90, windPlay: 96, wetPlay: 90, recovery: 86, stamina: 84, spin: 92 } },
    { name: "Tom Watson",         flag: "🇺🇸", attrs: { power: 80, accuracy: 88, shortGame: 90, putting: 86, mental: 92, windPlay: 95, wetPlay: 92, recovery: 86, stamina: 88, spin: 86 } },
    { name: "Arnold Palmer",      flag: "🇺🇸", attrs: { power: 88, accuracy: 78, shortGame: 86, putting: 84, mental: 94, windPlay: 82, wetPlay: 80, recovery: 90, stamina: 90, spin: 82 } },
    { name: "Gary Player",        flag: "🇿🇦", attrs: { power: 76, accuracy: 84, shortGame: 92, putting: 86, mental: 96, windPlay: 86, wetPlay: 84, recovery: 90, stamina: 95, spin: 88 } },
    { name: "Bernhard Langer",    flag: "🇩🇪", attrs: { power: 76, accuracy: 90, shortGame: 88, putting: 88, mental: 94, windPlay: 90, wetPlay: 88, recovery: 86, stamina: 92, spin: 86 } },
    { name: "Ian Woosnam",        flag: "🏴", attrs: { power: 84, accuracy: 82, shortGame: 86, putting: 84, mental: 86, windPlay: 88, wetPlay: 86, recovery: 82, stamina: 82, spin: 84 } },
    { name: "Sandy Lyle",         flag: "🇬🇧", attrs: { power: 86, accuracy: 80, shortGame: 84, putting: 82, mental: 84, windPlay: 90, wetPlay: 88, recovery: 84, stamina: 82, spin: 82 } },
  ],
};

const ATTRIBUTES = [
  { key: "power",     label: "Power",      icon: "💪", desc: "Distance off the tee" },
  { key: "accuracy",  label: "Accuracy",   icon: "🎯", desc: "Fairway & green precision" },
  { key: "shortGame", label: "Short Game", icon: "🏌️", desc: "Chipping & pitching" },
  { key: "putting",   label: "Putting",    icon: "⛳", desc: "Putt distance control" },
  { key: "mental",    label: "Mental",     icon: "🧠", desc: "Pressure handling" },
  { key: "windPlay",  label: "Wind Play",  icon: "💨", desc: "Performance in wind" },
  { key: "wetPlay",   label: "Wet Play",   icon: "🌧️", desc: "Performance in rain" },
  { key: "recovery",  label: "Recovery",   icon: "🌿", desc: "Rough & bunker escapes" },
  { key: "stamina",   label: "Stamina",    icon: "🔋", desc: "Late round consistency" },
  { key: "spin",      label: "Spin",       icon: "🌀", desc: "Shot shaping control" },
];

const PAR3_ATTR_KEYS = ["accuracy", "spin", "mental", "windPlay", "wetPlay"];

const DIFFICULTIES = [
  { key: "easy",   label: "Amateur",  rerolls: 3, color: "#5b8c5a" },
  { key: "medium", label: "Pro",      rerolls: 1, color: "#b8860b" },
  { key: "hard",   label: "Tour Pro", rerolls: 0, color: "#a0432e" },
];

const PAR3_NAMES = ["Postage Stamp","The Island Green","Amen Corner","Golden Bell","Devil's Anvil","The Redan","Widow Maker","The Pulpit","Sleepy Hollow","The Knoll"];

const COURSES = [
  {
    id: "augusta", name: "Augusta National", location: "Augusta, Georgia, USA",
    blurb: "Home of The Masters. Dogwoods, azaleas, and Amen Corner.", par: 72,
    weather: { baseWind: 3, rain: false },
    holes: [
      { par: 4, yards: 445, name: "Tea Olive" }, { par: 5, yards: 575, name: "Pink Dogwood" },
      { par: 4, yards: 350, name: "Flowering Peach" }, { par: 3, yards: 240, name: "Flowering Crab Apple" },
      { par: 4, yards: 495, name: "Magnolia" }, { par: 3, yards: 180, name: "Juniper" },
      { par: 4, yards: 450, name: "Pampas" }, { par: 5, yards: 570, name: "Yellow Jasmine" },
      { par: 4, yards: 460, name: "Carolina Cherry" }, { par: 4, yards: 495, name: "Camellia" },
      { par: 4, yards: 520, name: "White Dogwood" }, { par: 3, yards: 155, name: "Golden Bell" },
      { par: 5, yards: 545, name: "Azalea" }, { par: 4, yards: 440, name: "Chinese Fir" },
      { par: 5, yards: 550, name: "Firethorn" }, { par: 3, yards: 170, name: "Redbud" },
      { par: 4, yards: 440, name: "Nandina" }, { par: 4, yards: 465, name: "Holly" },
    ],
  },
  {
    id: "standrews", name: "St Andrews — Old Course", location: "St Andrews, Fife, Scotland",
    blurb: "The oldest course in the world. Home of The Open.", par: 72,
    weather: { baseWind: 14, rain: false, rainChance: 0.4 },
    holes: [
      { par: 4, yards: 376, name: "Burn" }, { par: 4, yards: 411, name: "Dyke" },
      { par: 4, yards: 397, name: "Cartgate (Out)" }, { par: 4, yards: 419, name: "Ginger Beer" },
      { par: 5, yards: 568, name: "Hole O'Cross (Out)" }, { par: 4, yards: 412, name: "Heathery (Out)" },
      { par: 4, yards: 371, name: "High (Out)" }, { par: 3, yards: 174, name: "Short" },
      { par: 4, yards: 352, name: "End" }, { par: 4, yards: 386, name: "Bobby Jones" },
      { par: 3, yards: 174, name: "High (In)" }, { par: 4, yards: 348, name: "Heathery (In)" },
      { par: 4, yards: 465, name: "Hole O'Cross (In)" }, { par: 5, yards: 618, name: "Long" },
      { par: 4, yards: 455, name: "Cartgate (In)" }, { par: 4, yards: 423, name: "Corner of the Dyke" },
      { par: 4, yards: 495, name: "Road Hole" }, { par: 4, yards: 357, name: "Tom Morris" },
    ],
  },
  {
    id: "pebble", name: "Pebble Beach Golf Links", location: "Pebble Beach, California, USA",
    blurb: "Cliffside golf on the Monterey Peninsula.", par: 72,
    weather: { baseWind: 12, rain: false },
    holes: [
      { par: 4, yards: 381, name: "" }, { par: 5, yards: 516, name: "" }, { par: 4, yards: 404, name: "" },
      { par: 4, yards: 331, name: "" }, { par: 3, yards: 195, name: "" }, { par: 5, yards: 523, name: "" },
      { par: 3, yards: 106, name: "" }, { par: 4, yards: 428, name: "" }, { par: 4, yards: 504, name: "" },
      { par: 4, yards: 446, name: "" }, { par: 4, yards: 390, name: "" }, { par: 3, yards: 202, name: "" },
      { par: 4, yards: 445, name: "" }, { par: 5, yards: 580, name: "" }, { par: 4, yards: 397, name: "" },
      { par: 4, yards: 403, name: "" }, { par: 3, yards: 178, name: "" }, { par: 5, yards: 543, name: "Pescadero" },
    ],
  },
  {
    id: "sawgrass", name: "TPC Sawgrass — Stadium Course", location: "Ponte Vedra Beach, Florida, USA",
    blurb: "Pete Dye's stadium masterpiece. Home of THE PLAYERS.", par: 72,
    weather: { baseWind: 7, rain: false, rainChance: 0.35 },
    holes: [
      { par: 4, yards: 423, name: "" }, { par: 5, yards: 532, name: "" }, { par: 3, yards: 177, name: "" },
      { par: 4, yards: 384, name: "" }, { par: 4, yards: 466, name: "" }, { par: 4, yards: 393, name: "" },
      { par: 4, yards: 442, name: "" }, { par: 3, yards: 237, name: "" }, { par: 4, yards: 583, name: "" },
      { par: 4, yards: 424, name: "" }, { par: 5, yards: 558, name: "" }, { par: 4, yards: 358, name: "" },
      { par: 3, yards: 181, name: "" }, { par: 4, yards: 467, name: "" }, { par: 5, yards: 523, name: "" },
      { par: 4, yards: 442, name: "" }, { par: 3, yards: 137, name: "Island Green" }, { par: 4, yards: 462, name: "" },
    ],
  },
  {
    id: "bethpage", name: "Bethpage Black", location: "Farmingdale, New York, USA",
    blurb: "Public, brutal, and proud of it. \"Warning: extremely difficult.\"", par: 71,
    weather: { baseWind: 10, rain: false },
    holes: [
      { par: 4, yards: 430, name: "" }, { par: 4, yards: 389, name: "" }, { par: 3, yards: 205, name: "" },
      { par: 5, yards: 517, name: "" }, { par: 4, yards: 478, name: "" }, { par: 4, yards: 408, name: "" },
      { par: 5, yards: 525, name: "" }, { par: 3, yards: 210, name: "" }, { par: 4, yards: 449, name: "" },
      { par: 4, yards: 502, name: "" }, { par: 4, yards: 423, name: "" }, { par: 4, yards: 489, name: "" },
      { par: 3, yards: 161, name: "" }, { par: 5, yards: 545, name: "" }, { par: 4, yards: 459, name: "" },
      { par: 4, yards: 490, name: "" }, { par: 3, yards: 207, name: "" }, { par: 4, yards: 411, name: "" },
    ],
  },
  {
    id: "pinehurst", name: "Pinehurst No. 2", location: "Pinehurst, North Carolina, USA",
    blurb: "Donald Ross's crowned, turtleback greens. A US Open staple.", par: 72,
    weather: { baseWind: 6, rain: false },
    holes: [
      { par: 4, yards: 406, name: "" }, { par: 4, yards: 472, name: "" }, { par: 4, yards: 387, name: "" },
      { par: 5, yards: 529, name: "" }, { par: 4, yards: 482, name: "" }, { par: 3, yards: 224, name: "" },
      { par: 4, yards: 401, name: "" }, { par: 5, yards: 489, name: "" }, { par: 4, yards: 444, name: "" },
      { par: 4, yards: 615, name: "" }, { par: 4, yards: 472, name: "" }, { par: 4, yards: 446, name: "" },
      { par: 4, yards: 388, name: "" }, { par: 4, yards: 459, name: "" }, { par: 3, yards: 206, name: "" },
      { par: 4, yards: 489, name: "" }, { par: 3, yards: 200, name: "" }, { par: 4, yards: 451, name: "" },
    ],
  },
  {
    id: "royaltroon", name: "Royal Troon", location: "Troon, Ayrshire, Scotland",
    blurb: "Scottish links featuring the tiny, treacherous Postage Stamp.", par: 71,
    weather: { baseWind: 22, rain: false, rainChance: 0.45 },
    holes: [
      { par: 4, yards: 380, name: "" }, { par: 4, yards: 391, name: "" }, { par: 4, yards: 379, name: "" },
      { par: 5, yards: 557, name: "" }, { par: 3, yards: 210, name: "" }, { par: 5, yards: 601, name: "" },
      { par: 4, yards: 402, name: "" }, { par: 3, yards: 123, name: "Postage Stamp" }, { par: 4, yards: 423, name: "" },
      { par: 4, yards: 457, name: "" }, { par: 4, yards: 463, name: "" }, { par: 4, yards: 431, name: "" },
      { par: 3, yards: 169, name: "" }, { par: 4, yards: 478, name: "" }, { par: 4, yards: 481, name: "" },
      { par: 3, yards: 223, name: "" }, { par: 4, yards: 433, name: "" }, { par: 4, yards: 458, name: "" },
    ],
  },
  {
    id: "whistling", name: "Whistling Straits", location: "Kohler, Wisconsin, USA",
    blurb: "Lake Michigan dunes built to look like Ireland.", par: 72,
    weather: { baseWind: 20, rain: false },
    holes: [
      { par: 4, yards: 426, name: "" }, { par: 5, yards: 593, name: "" }, { par: 3, yards: 190, name: "" },
      { par: 4, yards: 489, name: "" }, { par: 4, yards: 459, name: "" }, { par: 4, yards: 355, name: "" },
      { par: 4, yards: 481, name: "" }, { par: 3, yards: 257, name: "" }, { par: 4, yards: 424, name: "" },
      { par: 4, yards: 369, name: "" }, { par: 5, yards: 599, name: "" }, { par: 3, yards: 137, name: "" },
      { par: 4, yards: 411, name: "" }, { par: 5, yards: 478, name: "" }, { par: 4, yards: 502, name: "" },
      { par: 4, yards: 423, name: "" }, { par: 3, yards: 223, name: "" }, { par: 4, yards: 500, name: "Dyeabolical" },
    ],
  },
  {
    id: "carnoustie", name: "Carnoustie", location: "Angus, Scotland",
    blurb: "\"Carnasty.\" Widely considered the toughest Open venue.", par: 71,
    weather: { baseWind: 24, rain: true },
    holes: [
      { par: 4, yards: 406, name: "" }, { par: 4, yards: 449, name: "" }, { par: 4, yards: 358, name: "" },
      { par: 4, yards: 412, name: "" }, { par: 4, yards: 415, name: "" }, { par: 5, yards: 578, name: "" },
      { par: 4, yards: 410, name: "" }, { par: 3, yards: 183, name: "" }, { par: 4, yards: 474, name: "" },
      { par: 4, yards: 461, name: "South America" }, { par: 4, yards: 383, name: "" }, { par: 5, yards: 499, name: "" },
      { par: 3, yards: 167, name: "" }, { par: 5, yards: 514, name: "Spectacles" }, { par: 4, yards: 472, name: "" },
      { par: 4, yards: 250, name: "" }, { par: 4, yards: 433, name: "" }, { par: 4, yards: 499, name: "Home" },
    ],
  },
  {
    id: "muirfield", name: "Muirfield", location: "Gullane, East Lothian, Scotland",
    blurb: "The Honourable Company's links — a classic figure-eight routing.", par: 71,
    weather: { baseWind: 16, rain: false, rainChance: 0.35 },
    holes: [
      { par: 4, yards: 449, name: "" }, { par: 4, yards: 367, name: "" }, { par: 4, yards: 379, name: "" },
      { par: 3, yards: 213, name: "" }, { par: 5, yards: 558, name: "" }, { par: 4, yards: 469, name: "" },
      { par: 3, yards: 188, name: "" }, { par: 4, yards: 444, name: "" }, { par: 5, yards: 504, name: "" },
      { par: 4, yards: 374, name: "" }, { par: 4, yards: 385, name: "" }, { par: 5, yards: 484, name: "" },
      { par: 4, yards: 365, name: "" }, { par: 4, yards: 446, name: "" }, { par: 4, yards: 449, name: "" },
      { par: 4, yards: 188, name: "" }, { par: 4, yards: 379, name: "" }, { par: 4, yards: 444, name: "" },
    ],
  },
];

const STORAGE_KEY = "the_scramble_lb_v2";
const PLAYER_KEY  = "the_scramble_player_v1";

/* ─── Helpers ─────────────────────────────────────────── */

function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

function loadPlayer() {
  try {
    const raw = JSON.parse(localStorage.getItem(PLAYER_KEY) || "null");
    if (raw?.id) return raw;
  } catch {}
  return null; // null = first launch
}

function savePlayer(player) {
  try { localStorage.setItem(PLAYER_KEY, JSON.stringify(player)); } catch {}
}

function loadLeaderboard() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; } }
function saveLeaderboard(lb) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(lb)); } catch {} }

// Derives personal bests per course and full history for a given player from the flat lb array.
function deriveRecords(leaderboard, playerId) {
  const bests   = {}; // { courseId|"par3": entry }
  const history = []; // all entries for this player, newest first
  leaderboard.filter(e => e.playerId === playerId).forEach(e => {
    history.push(e);
    if (e.mode === "round" && e.courseId) {
      const existing = bests[e.courseId];
      if (!existing || (e.score - e.par) < (existing.score - existing.par)) bests[e.courseId] = e;
    }
    if (e.mode === "hole") {
      if (!bests.par3 || e.score < bests.par3.score) bests.par3 = e;
    }
  });
  history.sort((a, b) => b.timestamp - a.timestamp);
  return { bests, history };
}
function pickRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function getPool(era) {
  if (era === "modern")  return GOLFERS.modern;
  if (era === "legends") return GOLFERS.legends;
  return [...GOLFERS.modern, ...GOLFERS.legends];
}

function drawAttrChoices(pool, count = 4) {
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

function windLabelFor(wind) {
  return wind < 5 ? "Calm" : wind < 15 ? "Breezy" : wind < 25 ? "Gusty" : "Stormy";
}

function generateWeather() {
  const wind = Math.floor(Math.random() * 35);
  const rain = Math.random() > 0.6;
  return { wind, rain, windLabel: windLabelFor(wind) };
}

// Full round uses the course's fixed canonical weather as a baseline.
// Wind drifts slightly hole-to-hole (±3mph) for realism, but stays
// anchored to the course's character. Rain follows the course's fixed
// setting (always / never / occasional via rainChance).
function generateCourseHoles(course) {
  const cw = course.weather || { baseWind: 8, rain: false };
  const willRain = cw.rain === true || (cw.rainChance && Math.random() < cw.rainChance);
  const rainStart = willRain ? Math.floor(Math.random() * (course.holes.length - 4)) : -1;
  const rainLength = 3 + Math.floor(Math.random() * 5);
  let wind = cw.baseWind;

  return course.holes.map((h, i) => {
    // Gentle drift ±3mph per hole, clamped close to baseline
    wind = Math.max(cw.baseWind - 5, Math.min(cw.baseWind + 5, wind + (Math.random() - 0.5) * 6));
    const rain = willRain && i >= rainStart && i < rainStart + rainLength;
    return {
      number: i + 1, name: h.name || `Hole ${i + 1}`,
      par: h.par, distance: h.yards,
      weather: { wind: Math.round(wind), rain, windLabel: windLabelFor(Math.round(wind)) },
    };
  });
}

function generatePar3Hole() {
  const name = pickRandom(PAR3_NAMES);
  return { number: 1, name, par: 3, distance: 130 + Math.floor(Math.random() * 90), weather: generateWeather() };
}

function simulateHole(attrs, hole) {
  const { wind, rain } = hole.weather;
  const windMult = wind > 20 ? 1 + (1 - attrs.windPlay / 100) * (wind / 35) * 0.5 : 1;
  const rainMult = rain ? 1 + (1 - attrs.wetPlay / 100) * 0.35 : 1;

  const skillAcc  = ((attrs.accuracy + attrs.mental + attrs.shortGame) / 3) / 100;
  const skillPow  = ((attrs.power + attrs.stamina) / 2) / 100;
  const skillRec  = attrs.recovery / 100;
  const skillSpin = attrs.spin / 100;
  const composite = skillAcc * 0.45 + skillPow * 0.25 + skillRec * 0.2 + skillSpin * 0.1;

  const bogeyBase = 3.5 - composite * 4.0;
  const adjusted  = bogeyBase * windMult * rainMult;
  const variance  = (Math.random() - 0.45) * (3.2 - attrs.mental / 90);

  const luckRoll = (Math.random() - 0.5) * 2;
  const luck = luckRoll * 0.6;

  let blowUp = 0;
  const blowUpChance = 0.035 * (1 - attrs.mental / 140) * (luckRoll > 0.3 ? 0.3 : 1);
  if (Math.random() < blowUpChance) blowUp = 2 + Math.random() * 1.5;

  const score = Math.max(1, Math.round(hole.par + adjusted + variance + luck + blowUp));

  const par3Acc = ((attrs.accuracy + attrs.mental + attrs.spin) / 3) / 100;
  const distanceToPin = hole.par === 3
    ? Math.max(0, Math.round((1 - par3Acc * (1 / windMult) * (1 / rainMult)) * 28 + Math.random() * 5 - luck * 2))
    : null;

  return { score, distanceToPin };
}

function getOVR(attrs, attrList = ATTRIBUTES) {
  const sum = attrList.reduce((a, attr) => a + (attrs[attr.key] ?? 0), 0);
  return Math.round(sum / attrList.length);
}

/* ─── The Scramble Almanac ────────────────────────────────
   The Almanac is a progression/record system styled as an old
   leather-bound club record book, not an achievement list. Players
   "discover pages" rather than "unlock achievements" — same
   underlying mechanic (a condition is met, something becomes
   recorded), but the data model and presentation are built around
   that book metaphor throughout.

   ARCHITECTURE NOTES — for adding entries later:
   - ALMANAC_ENTRIES is the only place new pages get added. Each
     entry is pure data plus a `check` function.
   - `check(state)` receives the same `state` shape every time
     (see runAlmanacCheck below) and returns true/false for whether
     THIS round satisfies the entry. It does not need to worry about
     whether the entry was already discovered — checkAlmanacEntries
     handles that.
   - Lifetime/career stats (rounds played, total birdies, etc.) are
     tracked separately in the `career` object below, since many
     entries depend on cumulative totals rather than a single round.
   - Categories drive the section grouping in the book UI. Stick to
     the existing category ids unless adding a genuinely new section.
   - Rarity drives both the visual treatment and the reveal ceremony
     length. "greenjacket" should stay rare by convention — only use
     it for entries meant to feel like a genuine pinnacle.
   - Hidden entries (hidden: true) render as a blank/torn page in the
     book until discovered, and never show their title/description
     beforehand — checked in the same pass as visible entries.
──────────────────────────────────────────────────────── */
const ALMANAC_STORAGE_KEY = "the_scramble_almanac_v1";

const ALMANAC_CATEGORIES = [
  { id: "career",     label: "Career",     icon: "📖" },
  { id: "results",    label: "Results",    icon: "📜" },
  { id: "builds",     label: "Builds",     icon: "🖋️" },
  { id: "courses",    label: "Courses",    icon: "🗺️" },
  { id: "challenges", label: "Challenges", icon: "⚔️" },
  { id: "secrets",    label: "Secrets",    icon: "🕊️" },
];

const RARITIES = {
  common:      { label: "Common",      color: "#6b5d47" },
  uncommon:    { label: "Uncommon",    color: "#3f6b3f" },
  rare:        { label: "Rare",        color: "#2f6f8f" },
  epic:        { label: "Epic",        color: "#7c5cad" },
  legendary:   { label: "Legendary",   color: "#a9762c" },
  greenjacket: { label: "Green Jacket",color: "#1f5c34" },
};

/*
  Each entry:
    id, title, category, rarity, hidden, flavour, description, icon
    check(state) -> boolean   (evaluated once per finished round)

  `state` passed to check() has the shape:
    {
      mode, attrs, attrSources, activeAttrs, holes, results,
      totalScore, totalPar, scoreDiff, selectedCourse, difficulty, era,
      career  // cumulative stats object, see initial shape in loadAlmanac()
    }

  This is intentionally a SMALL starter set (one or two per category)
  to establish the pattern. Add further entries by following the same
  shape — nothing else in the codebase needs to change.
*/
const ALMANAC_ENTRIES = [
  {
    id: "first_round",
    title: "Welcome to the Club",
    category: "career",
    rarity: "common",
    hidden: false,
    flavour: "Every member's record begins with a single round.",
    description: "Complete your first round of golf.",
    icon: "⛳",
    check: (s) => s.career.roundsPlayed >= 1,
  },
  {
    id: "break_par",
    title: "Under the Card",
    category: "results",
    rarity: "uncommon",
    hidden: false,
    flavour: "The number on the card finally bent to your will.",
    description: "Finish a full round under par.",
    icon: "📉",
    check: (s) => s.mode === "round" && s.scoreDiff < 0,
  },
  {
    id: "the_purist",
    title: "The Purist",
    category: "builds",
    rarity: "rare",
    hidden: false,
    flavour: "One legend. Endless possibilities.",
    description: "Build a card using a single golfer for every attribute.",
    icon: "🧬",
    check: (s) => {
      if (!s.attrSources || !s.activeAttrs) return false;
      const names = s.activeAttrs.map(a => s.attrSources[a.key]?.golfer?.name).filter(Boolean);
      if (names.length < s.activeAttrs.length) return false;
      return new Set(names).size === 1;
    },
  },
  {
    id: "got_tiger",
    title: "A Piece of the Legend",
    category: "builds",
    rarity: "common",
    hidden: false,
    flavour: "Even one stat from the greatest changes everything.",
    description: "Have Tiger Woods contribute a stat to your card.",
    icon: "🐯",
    check: (s) => {
      if (!s.attrSources || !s.activeAttrs) return false;
      return s.activeAttrs.some(a => s.attrSources[a.key]?.golfer?.name === "Tiger Woods");
    },
  },
  {
    id: "grand_tour",
    title: "The Grand Tour",
    category: "courses",
    rarity: "epic",
    hidden: false,
    flavour: "Augusta to Carnoustie, every blade of grass beneath your spikes.",
    description: "Play a round at all 10 real courses in the Almanac.",
    icon: "🗺️",
    check: (s) => s.career.coursesPlayed.length >= COURSES.length,
  },
  {
    id: "ace",
    title: "The Hole That Disappeared",
    category: "challenges",
    rarity: "legendary",
    hidden: false,
    flavour: "One swing. One sound. The crowd that wasn't there roared anyway.",
    description: "Score a hole-in-one on the Par 3 Challenge.",
    icon: "🎉",
    check: (s) => s.mode === "hole" && s.results[0]?.distanceToPin === 0,
  },
  {
    id: "storm_survivor",
    title: "Wind and Water",
    category: "challenges",
    rarity: "uncommon",
    hidden: false,
    flavour: "The card doesn't care if your hands were frozen.",
    description: "Break 80 on a round with rain on at least one hole.",
    icon: "🌧️",
    check: (s) => s.mode === "round" && s.holes.some(h => h.weather.rain) && s.totalScore < 80,
  },
  {
    id: "the_green_jacket",
    title: "A Green Jacket of Your Own",
    category: "secrets",
    rarity: "greenjacket",
    hidden: true,
    flavour: "Some rounds are remembered. This one will be retold.",
    description: "Finish 5-under or better on a full round at Augusta National.",
    icon: "🟢",
    check: (s) => s.mode === "round" && s.selectedCourse?.id === "augusta" && s.scoreDiff <= -5,
  },
];

function defaultCareer() {
  return {
    roundsPlayed: 0,
    coursesPlayed: [],
    birdiesOrBetter: 0,
    eagles: 0,
    aces: 0,
    bestScoreDiff: null,     // lowest (best) strokes-vs-par across all rounds
    bestPar3Distance: null,  // lowest (best) distance-to-pin
    golferDraftCounts: {},   // { golferName: count } — tracks most-drafted golfer
    courseRoundCounts: {},   // { courseId: count } — tracks favourite course
  };
}

function loadAlmanac() {
  try {
    const raw = JSON.parse(localStorage.getItem(ALMANAC_STORAGE_KEY) || "{}");
    return {
      discovered: raw.discovered || {},   // { [entryId]: dateString }
      newEntries: raw.newEntries || [],   // [entryId] — discovered but not yet viewed
      career: { ...defaultCareer(), ...(raw.career || {}) },
    };
  } catch {
    return { discovered: {}, newEntries: [], career: defaultCareer() };
  }
}
function saveAlmanac(state) {
  try { localStorage.setItem(ALMANAC_STORAGE_KEY, JSON.stringify(state)); } catch {}
}

/*
  Pure check function — given current almanac state and a just-finished
  round, returns the updated state plus any newly-discovered entries
  (for the reveal ceremony queue).
*/
function checkAlmanacEntries(almanacState, round) {
  const { mode, attrSources, activeAttrs, holes, results, totalScore, scoreDiff, selectedCourse } = round;
  const discovered = { ...almanacState.discovered };
  const newEntries = [...(almanacState.newEntries || [])];
  const career = { ...almanacState.career, golferDraftCounts: { ...almanacState.career.golferDraftCounts }, courseRoundCounts: { ...almanacState.career.courseRoundCounts } };
  const today = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

  // Update cumulative career stats first, so entry checks can read fresh values.
  career.roundsPlayed += 1;

  if (mode === "round") {
    if (selectedCourse) {
      const cset = new Set(career.coursesPlayed);
      cset.add(selectedCourse.id);
      career.coursesPlayed = [...cset];
      career.courseRoundCounts[selectedCourse.id] = (career.courseRoundCounts[selectedCourse.id] || 0) + 1;
    }
    results.forEach((r, i) => {
      const diff = r.score - holes[i].par;
      if (diff <= -1) career.birdiesOrBetter += 1;
      if (diff <= -2) career.eagles += 1;
    });
    if (career.bestScoreDiff === null || scoreDiff < career.bestScoreDiff) career.bestScoreDiff = scoreDiff;
  }

  if (mode === "hole") {
    const d = results[0]?.distanceToPin;
    if (d === 0) career.aces += 1;
    if (d != null && (career.bestPar3Distance === null || d < career.bestPar3Distance)) career.bestPar3Distance = d;
  }

  if (attrSources && activeAttrs) {
    activeAttrs.forEach(a => {
      const name = attrSources[a.key]?.golfer?.name;
      if (name) career.golferDraftCounts[name] = (career.golferDraftCounts[name] || 0) + 1;
    });
  }

  // Now evaluate every not-yet-discovered entry against the updated state.
  const checkState = { ...round, career };
  const newlyDiscovered = [];
  ALMANAC_ENTRIES.forEach(entry => {
    if (discovered[entry.id]) return;
    try {
      if (entry.check(checkState)) {
        discovered[entry.id] = { date: today, diff: round.difficulty || "easy" };
        newEntries.push(entry.id);
        newlyDiscovered.push(entry);
      }
    } catch {
      // Defensive: a malformed entry's check() should never crash the round.
    }
  });

  return { newAlmanacState: { discovered, newEntries, career }, newlyDiscovered };
}

/* ─── Design tokens (vintage golf club) ──────────────────
   Warm parchment/cream backgrounds, deep forest green and
   leather-brown accents, brass/gold for highlights. Inter for
   a warm, modern humanist sans throughout.
──────────────────────────────────────────────────────── */
const C = {
  bg: "#f4ead8",
  bgDeep: "#ece0c8",
  panel: "#fbf5e9",
  panelEdge: "#d8c7a3",
  ink: "#2e2418",
  inkSoft: "#6b5d47",
  inkFaint: "#9c8e72",
  forest: "#2f4a3c",
  brass: "#a9762c",
  rust: "#a0432e",
  good: "#3f6b3f",
  cream: "#fbf5e9",
};

/* ─── Sub-components ──────────────────────────────────── */
function StatBar({ value }) {
  const [width, setWidth] = useState(0);
  useEffect(() => { const t = setTimeout(() => setWidth(value), 60); return () => clearTimeout(t); }, [value]);
  const color = value > 85 ? C.good : value > 70 ? C.brass : value > 55 ? "#c4942e" : C.rust;
  return (
    <div style={{ background: "#e4d6b8", borderRadius: 3, height: 6, width: "100%", overflow: "hidden", border: `1px solid ${C.panelEdge}` }}>
      <div style={{ width: `${width}%`, height: "100%", background: color, transition: "width 0.5s cubic-bezier(0.4,0,0.2,1)" }} />
    </div>
  );
}

// Renders 1-3 gems representing the difficulty the accolade was earned on.
// Amateur = 1 green gem, Pro = 2 gold gems, Tour Pro = 3 red gems.
function DifficultyGems({ diff, size = 10 }) {
  if (!diff) return null;
  const map = {
    easy:   { count: 1, color: "#4ade80", label: "Amateur" },
    medium: { count: 2, color: "#d4a017", label: "Pro" },
    hard:   { count: 3, color: "#e85a5a", label: "Tour Pro" },
  };
  const { count, color, label } = map[diff] || map.easy;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 3 }} title={`Earned on ${label}`}>
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} style={{
          width: size, height: size, borderRadius: "50%",
          background: i < count ? color : "transparent",
          border: `1.5px solid ${i < count ? color : "#cdbf9c"}`,
          flexShrink: 0,
        }} />
      ))}
    </div>
  );
}

function ScoreBadge({ score, par }) {
  const diff = score - par;
  const map = { [-3]: ["Albatross", "#7c5cad"], [-2]: ["Eagle", "#a9762c"], [-1]: ["Birdie", "#3f6b3f"], 0: ["Par", "#6b5d47"], 1: ["Bogey", "#b9712f"], 2: ["Dbl Bogey", "#a0432e"] };
  const [label, color] = map[diff] || (diff > 0 ? [`+${diff}`, "#7a2f1f"] : [`${diff}`, "#2d5c2d"]);
  return <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.05em", color, textTransform: "uppercase" }}>{label}</span>;
}

/*
  The ceremonial reveal shown when a new Almanac page is discovered.
  Deliberately paced and quiet — a page sliding into view, the title
  settling, the flavour quote fading in after, then the description.
  Green Jacket discoveries get a darkened backdrop and a slower,
  more deliberate sequence; everything else is the same ceremony at
  a slightly brisker pace.
*/
function PageReveal({ entry, difficulty, onDismiss, C }) {
  if (!entry) return null;
  const isGreenJacket = entry.rarity === "greenjacket";
  const rarityMeta = RARITIES[entry.rarity] || RARITIES.common;
  const glowColor = rarityMeta.color;
  const rarityGlow = {
    common:      `0 8px 28px rgba(46,36,24,0.22)`,
    uncommon:    `0 0 16px 3px ${glowColor}44, 0 8px 28px rgba(46,36,24,0.22)`,
    rare:        `0 0 20px 5px ${glowColor}55, 0 8px 28px rgba(46,36,24,0.22)`,
    epic:        `0 0 24px 7px ${glowColor}66, 0 8px 28px rgba(46,36,24,0.25)`,
    legendary:   `0 0 28px 9px ${glowColor}77, 0 12px 36px rgba(46,36,24,0.3)`,
    greenjacket: `0 0 36px 12px ${glowColor}88, 0 16px 48px rgba(0,0,0,0.35)`,
  }[entry.rarity] || `0 8px 28px rgba(46,36,24,0.22)`;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: isGreenJacket ? "rgba(20,16,10,0.55)" : "rgba(46,36,24,0.28)",
      animation: "revealBackdrop 0.5s ease both",
      padding: 20,
    }}>
      <div onClick={onDismiss} style={{
        background: "#fbf5e9",
        backgroundImage: "radial-gradient(circle at 15% 15%, rgba(169,118,44,0.07), transparent 50%)",
        border: `2px solid ${glowColor}${isGreenJacket ? "cc" : "77"}`,
        borderRadius: 10, padding: "28px 30px", maxWidth: 380, width: "100%",
        boxShadow: rarityGlow,
        cursor: "pointer",
        animation: `pageSlide ${isGreenJacket ? 0.8 : 0.55}s cubic-bezier(0.16,1,0.3,1) both`,
        textAlign: "center",
      }}>
        <div style={{
          fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700,
          color: rarityMeta.color, marginBottom: 10, animation: "fadeIn 0.5s ease 0.2s both",
        }}>
          {isGreenJacket ? "✦ A Page for the Ages ✦" : "A New Page"}
        </div>

        <div style={{ fontSize: 36, marginBottom: 8, animation: "fadeIn 0.5s ease 0.3s both" }}>{entry.icon}</div>

        <div style={{
          fontFamily: "'Fraunces', Georgia, serif", fontWeight: 600, fontSize: 22, color: C.forest,
          marginBottom: 10, animation: "fadeIn 0.5s ease 0.45s both",
        }}>
          {entry.title}
        </div>

        <div style={{
          fontSize: 13, fontStyle: "italic", color: C.inkSoft, marginBottom: 14, lineHeight: 1.5,
          animation: "fadeIn 0.6s ease 0.7s both",
        }}>
          "{entry.flavour}"
        </div>

        <div style={{
          fontSize: 12, color: C.inkFaint, lineHeight: 1.5, animation: "fadeIn 0.6s ease 1s both",
        }}>
          {entry.description}
        </div>

        <div style={{
          marginTop: 16, fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase",
          color: rarityMeta.color, fontWeight: 700, animation: "fadeIn 0.5s ease 1.3s both",
        }}>
          {rarityMeta.label}
        </div>
        {difficulty && (
          <div style={{ display: "flex", justifyContent: "center", marginTop: 8, animation: "fadeIn 0.5s ease 1.5s both" }}>
            <DifficultyGems diff={difficulty} size={10} />
          </div>
        )}
        <div style={{ marginTop: 14, fontSize: 10, color: "#9c8e72", animation: "fadeIn 0.4s ease 1.8s both" }}>
          Tap to continue
        </div>
      </div>
    </div>
  );
}

/*
  The Almanac itself — a browsable book modal. Category tabs down the
  left/top, parchment progress bars per section, entries rendered as
  small filed pages. Hidden + undiscovered entries render as a faded
  blank/torn page rather than a question mark, per design intent.
*/
function AlmanacBook({ almanac, onClose, clearNew, C, S }) {
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [category, setCategory] = useState("career");

  const newSet = new Set(almanac.newEntries || []);
  const totalDiscovered = Object.keys(almanac.discovered).length;
  const totalEntries = ALMANAC_ENTRIES.length;
  const hasAnyNew = newSet.size > 0;

  // Clear the notification dot when the detail overlay opens for a new entry,
  // using an effect so it doesn't trigger during the card-click render cycle.
  useEffect(() => {
    if (selectedEntry && newSet.has(selectedEntry.id)) {
      clearNew(selectedEntry.id);
    }
  }, [selectedEntry]);

  // Auto-clear new dots for career-category entries when Career tab is viewed,
  // since career entries have no tappable card grid to clear them.
  useEffect(() => {
    if (category !== "career") return;
    const careerNew = (almanac.newEntries || []).filter(id => {
      const entry = ALMANAC_ENTRIES.find(e => e.id === id);
      return entry?.category === "career";
    });
    careerNew.forEach(id => clearNew(id));
  }, [category]);

  const categoriesWithCounts = ALMANAC_CATEGORIES.map(cat => {
    const entries = ALMANAC_ENTRIES.filter(e => e.category === cat.id);
    const discoveredCount = entries.filter(e => almanac.discovered[e.id]).length;
    const hasNew = entries.some(e => newSet.has(e.id));
    return { ...cat, total: entries.length, discoveredCount, hasNew };
  });

  const careerStats = [
    ["Rounds Played",       almanac.career.roundsPlayed],
    ["Best Score (vs Par)", almanac.career.bestScoreDiff === null ? "—" : (almanac.career.bestScoreDiff > 0 ? `+${almanac.career.bestScoreDiff}` : almanac.career.bestScoreDiff === 0 ? "E" : almanac.career.bestScoreDiff)],
    ["Best Par 3 Distance", almanac.career.bestPar3Distance === null ? "—" : `${almanac.career.bestPar3Distance}ft`],
    ["Birdies or Better",   almanac.career.birdiesOrBetter],
    ["Eagles",              almanac.career.eagles],
    ["Aces",                almanac.career.aces],
    ["Courses Played",      `${almanac.career.coursesPlayed.length} / ${COURSES.length}`],
    ["Pages Discovered",    `${totalDiscovered} / ${totalEntries}`],
  ];
  const mostDrafted = Object.entries(almanac.career.golferDraftCounts).sort((a, b) => b[1] - a[1])[0];
  const favouriteCourseId = Object.entries(almanac.career.courseRoundCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
  const favouriteCourse = COURSES.find(c => c.id === favouriteCourseId);
  if (mostDrafted) careerStats.splice(6, 0, ["Most Drafted Golfer", `${mostDrafted[0]} (${mostDrafted[1]})`]);
  if (favouriteCourse) careerStats.splice(7, 0, ["Favourite Course", favouriteCourse.name]);

  const activeCat = categoriesWithCounts.find(c => c.id === category);
  const pct = activeCat ? Math.round((activeCat.discoveredCount / (activeCat.total || 1)) * 100) : Math.round((totalDiscovered / (totalEntries || 1)) * 100);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 999,
      background: C.bg, display: "flex", flexDirection: "column",
      fontFamily: "'Inter', sans-serif",
      animation: "bookOpen 0.3s cubic-bezier(0.16,1,0.3,1) both",
    }}>

      {/* ── Header ── */}
      <div style={{
        background: C.forest, padding: "16px 20px 12px", flexShrink: 0,
        display: "flex", flexDirection: "column", gap: 8,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: 600, fontSize: 20, color: "#f4ead8", lineHeight: 1 }}>
                The Scramble Almanac
              </div>
              {hasAnyNew && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#e8745a", flexShrink: 0 }} />}
            </div>
            <div style={{ fontSize: 11, color: "#cdbf9c", marginTop: 3 }}>
              {activeCat
                ? `${activeCat.label} · ${activeCat.discoveredCount} / ${activeCat.total}`
                : `${totalDiscovered} of ${totalEntries} pages recorded`
              }
            </div>
          </div>
          <button onClick={onClose} style={{
            background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 8,
            fontSize: 13, color: "#cdbf9c", cursor: "pointer", padding: "6px 12px", fontWeight: 600,
          }}>Close</button>
        </div>
        {/* Progress bar */}
        <div style={{ height: 4, background: "rgba(255,255,255,0.15)", borderRadius: 2, overflow: "hidden" }}>
          <div style={{ width: `${pct}%`, height: "100%", background: C.brassLight || "#c79140", transition: "width 0.4s ease" }} />
        </div>
      </div>

      {/* ── Grid content — each category pre-rendered, CSS visibility switch (no flash) ── */}
      <div style={{ flex: 1, overflowY: "auto", WebkitOverflowScrolling: "touch" }}>
        {/* Career tab: stats grid */}
        <div style={{ display: category === "career" ? "grid" : "none", gridTemplateColumns: "1fr 1fr", gap: 10, padding: 16 }}>
          {careerStats.map(([label, val]) => (
            <div key={label} style={{
              background: C.panel, border: `1px solid ${C.panelEdge}`, borderRadius: 10,
              padding: "12px 14px",
              boxShadow: "0 1px 3px rgba(46,36,24,0.06)",
            }}>
              <div style={{ fontSize: 10, letterSpacing: "0.07em", color: C.inkFaint, textTransform: "uppercase", fontWeight: 600 }}>{label}</div>
              <div style={{ fontSize: 17, fontWeight: 700, color: C.ink, marginTop: 3 }}>{val}</div>
            </div>
          ))}
          <button
            onClick={() => {
              try { localStorage.removeItem("the_scramble_almanac_v1"); } catch {}
              window.location.reload();
            }}
            style={{
              gridColumn: "1 / -1", marginTop: 4, background: "transparent",
              border: `1px solid ${C.panelEdge}`, borderRadius: 8, padding: "8px",
              fontSize: 10, color: C.inkFaint, cursor: "pointer", letterSpacing: "0.06em",
            }}>
            Reset Almanac Progress
          </button>
        </div>

        {/* All other categories: entry card grid */}
        {ALMANAC_CATEGORIES.filter(c => c.id !== "career").map(cat => {
          const entries = ALMANAC_ENTRIES.filter(e => e.category === cat.id);
          const isActive = category === cat.id;
          return (
            <div key={cat.id} style={{ display: isActive ? "grid" : "none", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, padding: 12 }}>
              {entries.map(entry => {
                const discoveredVal = almanac.discovered[entry.id];
                const isDiscovered = !!discoveredVal;
                const discoveredDiff = typeof discoveredVal === "object" ? discoveredVal.diff : null;
                const isNew = newSet.has(entry.id);
                const rarityMeta = RARITIES[entry.rarity] || RARITIES.common;
                const isHiddenLocked = entry.hidden && !isDiscovered;
                const glowColor = rarityMeta.color;

                // Rarity-driven glow — stronger for higher rarities
                const rarityGlow = {
                  common:      `0 1px 4px rgba(46,36,24,0.06)`,
                  uncommon:    `0 0 8px 1px ${glowColor}33, 0 2px 6px rgba(46,36,24,0.08)`,
                  rare:        `0 0 10px 2px ${glowColor}44, 0 2px 8px rgba(46,36,24,0.1)`,
                  epic:        `0 0 14px 3px ${glowColor}55, 0 4px 10px rgba(46,36,24,0.12)`,
                  legendary:   `0 0 16px 4px ${glowColor}66, 0 4px 12px rgba(46,36,24,0.15)`,
                  greenjacket: `0 0 20px 6px ${glowColor}77, 0 6px 16px rgba(46,36,24,0.2)`,
                }[entry.rarity] || `0 1px 4px rgba(46,36,24,0.06)`;

                return (
                  <button key={entry.id}
                    onClick={() => {
                      if (isHiddenLocked) return;
                      setSelectedEntry(entry);
                    }}
                    style={{
                      background: isDiscovered ? "#f3e6c8" : C.panel,
                      border: `1.5px solid ${isNew ? "#e8745a" : isDiscovered ? glowColor + "88" : C.panelEdge}`,
                      borderRadius: 10, padding: "12px 6px 8px",
                      display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
                      cursor: isHiddenLocked ? "default" : "pointer",
                      position: "relative", textAlign: "center",
                      boxShadow: isNew
                        ? `0 0 0 2.5px #e8745a, 0 0 12px 3px #e8745a66`
                        : isDiscovered ? rarityGlow : "none",
                      transition: "transform 0.12s",
                    }}
                    onMouseEnter={e => { if (!isHiddenLocked) e.currentTarget.style.transform = "scale(1.04)"; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
                  >
                    {/* New-entry notification — bright pulse dot */}
                    {isNew && (
                      <div style={{
                        position: "absolute", top: -4, right: -4,
                        width: 12, height: 12, borderRadius: "50%",
                        background: "#e8745a",
                        border: "2px solid #fbf5e9",
                        boxShadow: "0 0 6px 2px #e8745a88",
                      }} />
                    )}
                    {/* Rarity dot — shown when discovered and no new-dot */}
                    {isDiscovered && !isNew && (
                      <div style={{
                        position: "absolute", top: 5, right: 5,
                        width: 7, height: 7, borderRadius: "50%",
                        background: glowColor,
                      }} title={rarityMeta.label} />
                    )}

                    {isHiddenLocked ? (
                      <>
                        <div style={{
                          width: 44, height: 44, borderRadius: 8,
                          background: "repeating-linear-gradient(135deg, #e4d6b8, #e4d6b8 4px, #d8c9a3 4px, #d8c9a3 8px)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          <span style={{ fontSize: 18, opacity: 0.4 }}>📄</span>
                        </div>
                        <div style={{ fontSize: 10, color: C.inkFaint, fontStyle: "italic", lineHeight: 1.3 }}>
                          Unknown
                        </div>
                      </>
                    ) : (
                      <>
                        <div style={{
                          fontSize: 30, filter: isDiscovered ? "none" : "grayscale(1)",
                          opacity: isDiscovered ? 1 : 0.35,
                        }}>
                          {entry.icon}
                        </div>
                        <div style={{
                          fontSize: 10, fontWeight: isDiscovered ? 700 : 500,
                          color: isDiscovered ? C.ink : C.inkFaint,
                          lineHeight: 1.25,
                        }}>
                          {entry.title}
                        </div>
                        {isDiscovered && discoveredDiff && (
                          <DifficultyGems diff={discoveredDiff} size={7} />
                        )}
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* ── Bottom tab bar ── */}
      <div style={{
        background: C.forest, flexShrink: 0,
        display: "flex", borderTop: `1px solid rgba(255,255,255,0.08)`,
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}>
        {categoriesWithCounts.map(cat => {
          const isActive = category === cat.id;
          return (
            <button key={cat.id} onClick={() => setCategory(cat.id)}
              style={{
                flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
                gap: 3, padding: "10px 4px 8px",
                background: "transparent", border: "none", cursor: "pointer",
                borderTop: `2px solid ${isActive ? C.brass : "transparent"}`,
                transition: "border-color 0.15s", position: "relative",
              }}>
              <span style={{ fontSize: 18 }}>{cat.icon}</span>
              <span style={{
                fontSize: 9, fontWeight: 600, letterSpacing: "0.04em",
                color: isActive ? "#f4ead8" : "#7a9080",
                textTransform: "uppercase", lineHeight: 1,
              }}>
                {cat.label}
              </span>
              {cat.hasNew && (
                <div style={{ position: "absolute", top: 6, right: "calc(50% - 14px)", width: 7, height: 7, borderRadius: "50%", background: "#e8745a" }} />
              )}
            </button>
          );
        })}
      </div>

      {/* ── Entry detail overlay ── */}
      {selectedEntry && (() => {
        const entry = selectedEntry;
        const discoveredVal = almanac.discovered[entry.id];
        const isDiscovered = !!discoveredVal;
        // Handle both old shape (plain string) and new shape ({ date, diff })
        const discoveredDate = typeof discoveredVal === "object" ? discoveredVal.date : discoveredVal;
        const discoveredDiff = typeof discoveredVal === "object" ? discoveredVal.diff : null;
        const rarityMeta = RARITIES[entry.rarity] || RARITIES.common;
        const isGJ = entry.rarity === "greenjacket";
        const glowColor = rarityMeta.color;
        return (
          <div style={{
            position: "absolute", inset: 0, zIndex: 10,
            background: "rgba(30,24,16,0.6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 20, animation: "revealBackdrop 0.2s ease both",
          }} onClick={() => setSelectedEntry(null)}>
            <div style={{
              background: C.panel,
              border: `2px solid ${glowColor}${isGJ ? "cc" : "88"}`,
              borderRadius: 14, padding: "26px 22px", maxWidth: 340, width: "100%",
              boxShadow: `0 0 0 1px ${glowColor}22, 0 0 18px 2px ${glowColor}${isGJ ? "55" : "33"}, 0 12px 36px rgba(46,36,24,0.25)`,
              animation: "pop 0.25s cubic-bezier(0.34,1.56,0.64,1) both",
              textAlign: "center",
            }} onClick={e => e.stopPropagation()}>
              <div style={{ fontSize: 48, marginBottom: 10 }}>{entry.icon}</div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: glowColor }}>
                  {rarityMeta.label}
                </span>
                {isDiscovered && <DifficultyGems diff={discoveredDiff} size={9} />}
              </div>
              <div style={{
                fontFamily: "'Fraunces', Georgia, serif", fontWeight: 600,
                fontSize: 20, color: C.forest, marginBottom: 10, lineHeight: 1.2,
              }}>{entry.title}</div>
              {isDiscovered ? (
                <>
                  <div style={{ fontSize: 13, fontStyle: "italic", color: C.inkSoft, marginBottom: 10, lineHeight: 1.5 }}>
                    "{entry.flavour}"
                  </div>
                  <div style={{ fontSize: 12, color: C.inkFaint, lineHeight: 1.5, marginBottom: 12 }}>
                    {entry.description}
                  </div>
                  <div style={{ fontSize: 10, color: C.inkFaint }}>
                    Recorded {discoveredDate}
                  </div>
                </>
              ) : (
                <div style={{ fontSize: 12, color: C.inkFaint, lineHeight: 1.5 }}>
                  {entry.description}
                </div>
              )}
              <button onClick={() => setSelectedEntry(null)} style={{
                marginTop: 16, background: "transparent",
                border: `1.5px solid ${C.panelEdge}`, borderRadius: 8,
                padding: "8px 20px", fontSize: 12, fontWeight: 600,
                color: C.inkSoft, cursor: "pointer",
              }}>Close</button>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

function RollingSlots({ attrKey, era }) {
  const [cards, setCards] = useState([null, null, null, null]);
  useEffect(() => {
    const pool = getPool(era);
    const interval = setInterval(() => setCards(drawAttrChoices(pool, 4)), 80);
    return () => clearInterval(interval);
  }, [attrKey, era]);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
      {cards.map((g, i) => (
        <div key={i} style={{
          background: "#e4d6b8", border: `1.5px solid ${C.panelEdge}`, borderRadius: 6, padding: "10px 6px",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 5, opacity: 0.65,
        }}>
          <span style={{ fontSize: 18 }}>{g ? g.flag : "🏌"}</span>
          <span style={{ fontSize: 10, color: C.inkFaint, textAlign: "center", lineHeight: 1.25, minHeight: 24, display: "flex", alignItems: "center" }}>
            {g ? g.name : "—"}
          </span>
          <span style={{ fontSize: 19, fontWeight: 700, color: C.inkFaint }}>
            {g ? g.attrs[attrKey] : "--"}
          </span>
        </div>
      ))}
    </div>
  );
}

function BallFlight({ onDone, distanceToPin }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    const groundY = H - 20, teeX = 40, flagX = W - 52;
    const MAX_DIST = 28, MAX_OFFSET = (flagX - teeX) * 0.54;
    const clamped = Math.min(distanceToPin, MAX_DIST);
    const landX = flagX - (clamped / MAX_DIST) * MAX_OFFSET;
    const peakY = H * (0.1 + (clamped / MAX_DIST) * 0.08);
    const totalFrames = 85;
    let t = 0, raf;
    const trail = [];

    function scene() {
      ctx.clearRect(0, 0, W, H);
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, "#dcebd8"); grad.addColorStop(0.65, "#bfdcb8"); grad.addColorStop(1, "#7fae72");
      ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
      ctx.beginPath(); ctx.moveTo(0, groundY); ctx.lineTo(W, groundY);
      ctx.strokeStyle = "#5c8a52"; ctx.lineWidth = 1.5; ctx.stroke();
      if (distanceToPin > 0) {
        ctx.beginPath(); ctx.ellipse(landX, groundY, 4 + clamped * 0.6, 3, 0, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(160,67,46,0.25)"; ctx.lineWidth = 1; ctx.stroke();
      }
      ctx.beginPath(); ctx.moveTo(flagX, groundY); ctx.lineTo(flagX, groundY - 40);
      ctx.strokeStyle = "#4a4030"; ctx.lineWidth = 1.5; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(flagX, groundY - 40); ctx.lineTo(flagX + 14, groundY - 33); ctx.lineTo(flagX, groundY - 26); ctx.closePath();
      ctx.fillStyle = C.brass; ctx.fill();
      ctx.beginPath(); ctx.ellipse(flagX, groundY, 4, 2, 0, 0, Math.PI * 2);
      ctx.fillStyle = "#2f4a3c"; ctx.fill(); ctx.strokeStyle = "#1f3326"; ctx.lineWidth = 1; ctx.stroke();
      ctx.beginPath(); ctx.arc(teeX, groundY, 3, 0, Math.PI * 2); ctx.fillStyle = "#4a4030"; ctx.fill();
    }

    const tick = () => {
      t++;
      const p = t / totalFrames;
      const bx = teeX + (landX - teeX) * p;
      const by = groundY - 4 * (groundY - peakY) * p * (1 - p);
      trail.push({ x: bx, y: by });
      scene();
      for (let i = 1; i < trail.length; i++) {
        const a = (i / trail.length) * 0.55;
        ctx.beginPath(); ctx.moveTo(trail[i-1].x, trail[i-1].y); ctx.lineTo(trail[i].x, trail[i].y);
        ctx.strokeStyle = `rgba(169,118,44,${a})`; ctx.lineWidth = 1.8; ctx.stroke();
      }
      if (t < totalFrames) {
        ctx.beginPath(); ctx.ellipse(bx, groundY, 6*p+2, 2, 0, 0, Math.PI*2);
        ctx.fillStyle = `rgba(46,36,24,${0.08+0.18*p})`; ctx.fill();
        ctx.beginPath(); ctx.arc(bx, by, 5, 0, Math.PI*2);
        ctx.fillStyle = "#fdfaf2"; ctx.fill(); ctx.strokeStyle = "rgba(46,36,24,0.2)"; ctx.lineWidth = 0.5; ctx.stroke();
        raf = requestAnimationFrame(tick);
      } else {
        scene();
        const ringCol = distanceToPin === 0 ? "#7c5cad" : clamped < 5 ? C.good : C.brass;
        for (let r = 1; r <= 3; r++) {
          ctx.beginPath(); ctx.arc(landX, groundY, r*5, 0, Math.PI*2);
          ctx.strokeStyle = ringCol + Math.round((1-r*0.28)*255).toString(16).padStart(2,"0");
          ctx.lineWidth = 1.5; ctx.stroke();
        }
        if (distanceToPin > 0) {
          ctx.setLineDash([3,4]); ctx.beginPath(); ctx.moveTo(landX, groundY-2); ctx.lineTo(flagX, groundY-2);
          ctx.strokeStyle = "rgba(160,67,46,0.5)"; ctx.lineWidth = 1; ctx.stroke(); ctx.setLineDash([]);
        }
        setTimeout(onDone, 650);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return <canvas ref={canvasRef} width={360} height={120} style={{ display: "block", margin: "0 auto", borderRadius: 6 }} />;
}

/* ─── Main ────────────────────────────────────────────── */
export default function GolfGame() {
  const [screen, setScreen]         = useState("menu");
  const [mode, setMode]             = useState(null);
  const [era, setEra]               = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [difficulty, setDifficulty] = useState(null);
  const [attrChoices, setAttrChoices] = useState({});
  const [attrSources, setAttrSources] = useState({});
  const [rerollsLeft, setRerollsLeft] = useState(0);
  const [activeAttr, setActiveAttr]   = useState(null);
  const [rolling, setRolling]         = useState(false);
  const [holes, setHoles]           = useState([]);
  const [results, setResults]       = useState([]);
  const [simulating, setSimulating] = useState(false);
  const [animIdx, setAnimIdx]       = useState(-1);
  const [showFlight, setShowFlight] = useState(false);
  const [flightDone, setFlightDone] = useState(false);
  const [pendingResult, setPendingResult] = useState(null);
  const [leaderboard, setLeaderboard] = useState(loadLeaderboard);
  const [showBoard, setShowBoard]     = useState(false);
  const [boardCourseFilter, setBoardCourseFilter] = useState("all");
  const [boardTab, setBoardTab]       = useState("records");
  const [player, setPlayer]           = useState(loadPlayer);      // null on first launch
  const [showNamePrompt, setShowNamePrompt] = useState(!loadPlayer()); // show on first launch
  const [nameInput, setNameInput]     = useState("");
  const [almanac, setAlmanac] = useState(loadAlmanac);
  const [showAlmanac, setShowAlmanac] = useState(false);
  const [pageReveal, setPageReveal] = useState(null);
  const [pageQueue, setPageQueue] = useState([]);

  const diff = DIFFICULTIES.find(d => d.key === difficulty);

  const activeAttrs = mode === "hole"
    ? ATTRIBUTES.filter(a => PAR3_ATTR_KEYS.includes(a.key))
    : ATTRIBUTES;

  const allRolled = activeAttrs.every(a => attrSources[a.key] != null);

  const attrs = ATTRIBUTES.reduce((acc, a) => {
    acc[a.key] = attrSources[a.key]?.value ?? 50;
    return acc;
  }, {});

  const S = {
    root: {
      minHeight: "100vh", background: C.bg, color: C.ink,
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      display: "flex", flexDirection: "column", alignItems: "center", padding: "28px 16px 48px",
      backgroundImage: "radial-gradient(circle at 20% 10%, rgba(169,118,44,0.05), transparent 40%), radial-gradient(circle at 85% 90%, rgba(47,74,60,0.06), transparent 45%)",
    },
    card: {
      background: C.panel, border: `1px solid ${C.panelEdge}`, borderRadius: 10,
      padding: "20px 22px", width: "100%", maxWidth: 500,
      boxShadow: "0 1px 2px rgba(46,36,24,0.04), 0 4px 14px rgba(46,36,24,0.05)",
    },
    label: { fontSize: 11, letterSpacing: "0.1em", color: C.inkFaint, textTransform: "uppercase", fontWeight: 600 },
    divider: { borderColor: C.panelEdge, margin: "16px 0", border: "none", borderTop: `1px solid ${C.panelEdge}` },
    title: { fontSize: 30, color: C.forest, letterSpacing: "-0.01em", margin: 0, fontWeight: 700 },
    sub: { fontSize: 13, color: C.inkSoft, lineHeight: 1.5 },
    btn: (c = C.forest) => ({
      background: "transparent", border: `1.5px solid ${c}`, color: c,
      fontSize: 13, fontWeight: 600, letterSpacing: "0.01em",
      padding: "10px 20px", cursor: "pointer", borderRadius: 8, transition: "background 0.15s, transform 0.1s",
    }),
    btnF: (c = C.forest) => ({
      background: c, border: `1.5px solid ${c}`, color: C.cream,
      fontSize: 13, fontWeight: 700, letterSpacing: "0.01em",
      padding: "10px 20px", cursor: "pointer", borderRadius: 8,
      boxShadow: "0 1px 2px rgba(46,36,24,0.15)",
    }),
  };

  function startSetup(m) {
    setMode(m);
    setScreen(m === "round" ? "course" : "era");
  }

  function chooseCourse(course) { setSelectedCourse(course); setScreen("era"); }
  function chooseEra(e) { setEra(e); setScreen("setup"); }

  function chooseDifficulty(d) {
    setDifficulty(d.key);
    const blankChoices = activeAttrs.reduce((acc, a) => ({ ...acc, [a.key]: null }), {});
    const blankSources = activeAttrs.reduce((acc, a) => ({ ...acc, [a.key]: null }), {});
    setAttrChoices(blankChoices);
    setAttrSources(blankSources);
    setRerollsLeft(d.rerolls); // single shared integer, not per-attribute
    setActiveAttr(null);
    setRolling(false);
    setScreen("card");
  }

  function selectAttr(key) {
    if (rolling) return;
    setActiveAttr(key);
    if (!attrChoices[key]) runRoll(key);
  }

  function runRoll(key) {
    setRolling(true);
    const pool = getPool(era);
    setTimeout(() => {
      setAttrChoices(prev => ({ ...prev, [key]: drawAttrChoices(pool, 4) }));
      setRolling(false);
    }, 900);
  }

  function pickAttrChoice(key, golfer) {
    const value = golfer.attrs[key];
    setAttrSources(prev => ({ ...prev, [key]: { golfer, value } }));
    setActiveAttr(null);
  }

  function rerollChoices(key) {
    if (rerollsLeft <= 0 || rolling) return;
    setRerollsLeft(prev => prev - 1); // decrement shared pool
    setAttrChoices(prev => ({ ...prev, [key]: null }));
    runRoll(key);
  }

  function startPlay() {
    const h = mode === "hole" ? [generatePar3Hole()] : generateCourseHoles(selectedCourse);
    setHoles(h); setResults([]); setSimulating(false); setAnimIdx(-1);
    setShowFlight(false); setFlightDone(false); setPendingResult(null);
    setScreen("playing");
  }

  // Runs Almanac checks against a just-finished round's results, queues any
  // newly-discovered pages for the reveal ceremony, and persists updated state.
  function runAlmanacCheck(finishedResults, finishedHoles) {
    const finalScore = finishedResults.reduce((a, r) => a + r.score, 0);
    const finalPar = finishedHoles.slice(0, finishedResults.length).reduce((a, h) => a + h.par, 0);
    const finalDiff = finalScore - finalPar;
    const { newAlmanacState, newlyDiscovered } = checkAlmanacEntries(almanac, {
      mode, attrs, attrSources, activeAttrs,
      holes: finishedHoles, results: finishedResults,
      totalScore: finalScore, totalPar: finalPar, scoreDiff: finalDiff,
      selectedCourse, difficulty, era,
    });
    setAlmanac(newAlmanacState);
    saveAlmanac(newAlmanacState);
    if (newlyDiscovered.length > 0) setPageQueue(q => [...q, ...newlyDiscovered]);
  }

  // Clears the notification dot for a specific entry when the user taps it in the Almanac.
  const clearNew = useCallback((entryId) => {
    setAlmanac(prev => {
      const updated = { ...prev, newEntries: (prev.newEntries || []).filter(id => id !== entryId) };
      saveAlmanac(updated);
      return updated;
    });
  }, []);

  // Reveal queue: show one discovered page at a time, ceremonial pacing.
  useEffect(() => {
    if (!pageReveal && pageQueue.length > 0) {
      setPageReveal(pageQueue[0]);
      setPageQueue(q => q.slice(1));
    }
  }, [pageReveal, pageQueue]);

  async function simulate() {
    setSimulating(true);
    if (mode === "hole") {
      const r = simulateHole(attrs, holes[0]);
      setPendingResult(r); setShowFlight(true);
    } else {
      const res = [];
      for (let i = 0; i < holes.length; i++) {
        await new Promise(r => setTimeout(r, 160));
        setAnimIdx(i);
        res.push(simulateHole(attrs, holes[i]));
        setResults([...res]);
      }
      const finalScore = res.reduce((a, r) => a + r.score, 0);
      const finalPar   = holes.reduce((a, h) => a + h.par, 0);
      setSimulating(false);
      runAlmanacCheck(res, holes);
      autoSaveRound(res, holes, finalScore, finalPar);
    }
  }

  function onFlightDone() {
    setFlightDone(true); setResults([pendingResult]); setSimulating(false);
    runAlmanacCheck([pendingResult], holes);
    autoSaveRound([pendingResult], holes, pendingResult?.distanceToPin, null);
  }

  // Called once on first launch when player confirms their display name.
  function confirmName() {
    if (!nameInput.trim()) return;
    const newPlayer = { id: generateUUID(), name: nameInput.trim() };
    setPlayer(newPlayer);
    savePlayer(newPlayer);
    setShowNamePrompt(false);
  }

  // Auto-records every completed round — no player action required.
  function autoSaveRound(finishedResults, finishedHoles, finishedTotalScore, finishedTotalPar) {
    const currentPlayer = player || loadPlayer();
    if (!currentPlayer) return; // shouldn't happen but guard anyway
    const conditions = mode === "hole"
      ? { wind: finishedHoles[0]?.weather.wind, windLabel: finishedHoles[0]?.weather.windLabel, rain: finishedHoles[0]?.weather.rain }
      : (() => {
          const avgWind = Math.round(finishedHoles.reduce((a, h) => a + h.weather.wind, 0) / finishedHoles.length);
          const anyRain = finishedHoles.some(h => h.weather.rain);
          return { wind: avgWind, windLabel: windLabelFor(avgWind), rain: anyRain };
        })();
    const entry = {
      playerId: currentPlayer.id,
      playerName: currentPlayer.name,
      mode,
      score: mode === "hole" ? finishedResults[0]?.distanceToPin : finishedTotalScore,
      par:   mode === "hole" ? null : finishedTotalPar,
      diff:  difficulty,
      ovr:   getOVR(attrs, activeAttrs),
      courseId:   mode === "round" ? selectedCourse?.id   : null,
      courseName: mode === "round" ? selectedCourse?.name : null,
      conditions,
      timestamp: Date.now(),
      date: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
    };
    const updated = [...leaderboard, entry];
    setLeaderboard(updated);
    saveLeaderboard(updated);
  }

  function reset() {
    setScreen("menu"); setMode(null); setEra(null); setDifficulty(null); setSelectedCourse(null);
    setAttrChoices({}); setAttrSources({}); setRerollsLeft(0);
    setActiveAttr(null); setRolling(false);
    setResults([]); setHoles([]); setAnimIdx(-1);
    setShowFlight(false); setFlightDone(false); setPendingResult(null);
  }

  function viewLeaderboard() {
    if (mode === "round" && selectedCourse) setBoardCourseFilter(selectedCourse.id);
    reset();
    setShowBoard(true);
  }

  const totalScore = results.reduce((a, r) => a + r.score, 0);
  const totalPar   = holes.slice(0, results.length).reduce((a, h) => a + h.par, 0);
  const scoreDiff  = totalScore - totalPar;

  const { bests, history } = player
    ? deriveRecords(leaderboard, player.id)
    : { bests: {}, history: [] };

  const GLOBAL_STYLES = `
    @keyframes fadeUp  { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
    @keyframes pop     { from{opacity:0;transform:scale(0.78)}      to{opacity:1;transform:scale(1)} }
    @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:0.4} }
    @keyframes rowPop  { 0%{background:#e8dcc0} 100%{background:transparent} }
    @keyframes spinBtn { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
    @keyframes shimmer { 0%{opacity:0.35} 50%{opacity:0.75} 100%{opacity:0.35} }
    @keyframes revealBackdrop { from{opacity:0} to{opacity:1} }
    @keyframes pageSlide { from{opacity:0;transform:translateY(18px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
    @keyframes fadeIn { from{opacity:0} to{opacity:1} }
    @keyframes bookOpen { from{opacity:0;transform:translateY(14px) scale(0.96)} to{opacity:1;transform:translateY(0) scale(1)} }
  `;
  const FontLink = () => <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,500;9..144,600&display=swap" rel="stylesheet" />;
  const wordmark = { fontFamily: "'Fraunces', Georgia, serif", fontWeight: 600 };

  // Rendered at the top of every screen: the page-discovery ceremony (if any)
  // and the Almanac book modal (if open). One render call dropped into each
  // screen right after GLOBAL_STYLES.
  const almanacLayer = (
    <>
      <PageReveal entry={pageReveal} difficulty={difficulty} onDismiss={() => setPageReveal(null)} C={C} />
      {showAlmanac && (
        <AlmanacBook
          almanac={almanac}
          onClose={() => setShowAlmanac(false)}
          clearNew={clearNew}
          C={C} S={S}
        />
      )}
      {showNamePrompt && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 2000, background: "rgba(30,24,16,0.6)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
        }}>
          <div style={{
            background: C.panel, border: `1.5px solid ${C.panelEdge}`, borderRadius: 12,
            padding: "28px 24px", maxWidth: 320, width: "100%", textAlign: "center",
            boxShadow: "0 12px 36px rgba(46,36,24,0.25)",
            animation: "pop 0.4s cubic-bezier(0.34,1.56,0.64,1) both",
          }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>⛳</div>
            <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: 600, fontSize: 20, color: C.forest, marginBottom: 6 }}>
              Welcome to The Scramble
            </div>
            <div style={{ fontSize: 13, color: C.inkSoft, marginBottom: 20, lineHeight: 1.5 }}>
              What should we call you in the records?
            </div>
            <input
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && confirmName()}
              placeholder="Your name…"
              maxLength={20}
              autoFocus
              style={{
                width: "100%", background: C.bgDeep, border: `1.5px solid ${C.panelEdge}`,
                color: C.ink, padding: "10px 14px", fontSize: 16, borderRadius: 8,
                outline: "none", fontFamily: "inherit", marginBottom: 12, boxSizing: "border-box",
              }}
            />
            <button
              onClick={confirmName}
              disabled={!nameInput.trim()}
              style={{
                ...S.btnF(), width: "100%",
                opacity: nameInput.trim() ? 1 : 0.4,
                cursor: nameInput.trim() ? "pointer" : "default",
              }}>
              Enter the Clubhouse →
            </button>
          </div>
        </div>
      )}
    </>
  );

  /* ══ MENU ══ */
  if (screen === "menu") return (
    <div style={S.root}>
      <FontLink />
      <style>{GLOBAL_STYLES}</style>
      {almanacLayer}
      <div style={{ textAlign: "center", marginBottom: 36, animation: "fadeUp 0.5s ease both" }}>
        <div style={{ ...S.label, marginBottom: 10, color: C.brass }}>⛳ A Round Worth Talking About</div>
        <h1 style={{ ...S.title, ...wordmark, fontSize: 38 }}>The Scramble</h1>
        <p style={{ ...S.sub, marginTop: 8, fontSize: 13 }}>Pull a stat from a different pro every time. Build your golfer. Play the course.</p>
      </div>
      <div style={{ ...S.card, animation: "fadeUp 0.5s ease 0.1s both", maxWidth: 360 }}>
        <div style={{ display: "grid", gap: 10 }}>
          {[
            ["⛳ Single Hole · Par 3", () => startSetup("hole"), C.forest, "#f4ead8"],
            ["🏌 Full Round · 18 Holes", () => startSetup("round"), C.forest, "#f4ead8"],
            ["🏆 Leaderboard", () => setShowBoard(b => !b), C.inkSoft, "#f4ead8"],
          ].map(([lbl, fn, bg, fg]) => (
            <button key={lbl} onClick={fn}
              style={{
                width: "100%", textAlign: "center",
                background: bg, border: `1.5px solid ${bg}`,
                color: fg, fontSize: 15, fontWeight: 700, letterSpacing: "0.01em",
                padding: "13px 20px", cursor: "pointer", borderRadius: 8,
                fontFamily: "'Inter', sans-serif",
                boxShadow: "0 1px 3px rgba(46,36,24,0.12)",
                transition: "opacity 0.15s",
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
              {lbl}
            </button>
          ))}
          {/* Almanac button — separate so we can show notification dot */}
          <button onClick={() => setShowAlmanac(true)}
            style={{
              width: "100%", textAlign: "center", position: "relative",
              background: C.brass, border: `1.5px solid ${C.brass}`,
              color: "#2e2418", fontSize: 15, fontWeight: 700, letterSpacing: "0.01em",
              padding: "13px 20px", cursor: "pointer", borderRadius: 8,
              fontFamily: "'Inter', sans-serif",
              boxShadow: "0 1px 3px rgba(46,36,24,0.12)",
              transition: "opacity 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
            📖 Almanac  {Object.keys(almanac.discovered).length}/{ALMANAC_ENTRIES.length}
            {(almanac.newEntries?.length > 0) && (
              <span style={{
                position: "absolute", top: 10, right: 14,
                width: 9, height: 9, borderRadius: "50%",
                background: "#e8745a", border: "1.5px solid #2e2418",
                display: "inline-block",
              }} />
            )}
          </button>
        </div>
      </div>
      {showBoard && (() => {
        const condIcon = (c) => !c ? null : c.rain ? "🌧" : c.wind > 25 ? "🌬" : c.wind > 15 ? "💨" : "☀️";
        return (
          <div style={{ ...S.card, marginTop: 14, maxWidth: 480 }}>
            {/* Player name header */}
            {player && (
              <div style={{ fontSize: 12, color: C.inkFaint, marginBottom: 12, fontWeight: 600 }}>
                📋 {player.name}'s Records
              </div>
            )}
            {/* Tab switcher */}
            <div style={{ display: "flex", gap: 4, marginBottom: 16, background: C.bgDeep, borderRadius: 8, padding: 3 }}>
              {[["records", "🏆 Records"], ["history", "🕐 History"]].map(([key, lbl]) => (
                <button key={key} onClick={() => setBoardTab(key)}
                  style={{
                    flex: 1, padding: "8px 0", borderRadius: 6, border: "none", cursor: "pointer",
                    background: boardTab === key ? C.panel : "transparent",
                    color: boardTab === key ? C.forest : C.inkFaint,
                    fontSize: 12, fontWeight: 600,
                    boxShadow: boardTab === key ? "0 1px 2px rgba(46,36,24,0.08)" : "none",
                    transition: "background 0.15s, color 0.15s",
                  }}>
                  {lbl}
                </button>
              ))}
            </div>

            {/* Records tab — best score per course + par 3 best */}
            {boardTab === "records" && (
              <div style={{ display: "grid", gap: 4 }}>
                {/* Par 3 best */}
                {bests.par3 && (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 4px", borderBottom: `1px solid ${C.bgDeep}` }}>
                    <span style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
                      ⛳ Par 3 Best
                      {condIcon(bests.par3.conditions) && <span style={{ fontSize: 12 }}>{condIcon(bests.par3.conditions)}</span>}
                    </span>
                    <span style={{ fontSize: 13, color: C.brass, fontWeight: 700 }}>{bests.par3.score}ft</span>
                  </div>
                )}
                {/* Best per course */}
                {COURSES.map(course => {
                  const best = bests[course.id];
                  if (!best) return (
                    <div key={course.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 4px", borderBottom: `1px solid ${C.bgDeep}`, opacity: 0.4 }}>
                      <span style={{ fontSize: 12 }}>{course.name}</span>
                      <span style={{ fontSize: 11, color: C.inkFaint }}>Unplayed</span>
                    </div>
                  );
                  const diff = best.score - best.par;
                  return (
                    <div key={course.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 4px", borderBottom: `1px solid ${C.bgDeep}` }}>
                      <span style={{ fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}>
                        {course.name}
                        {condIcon(best.conditions) && <span style={{ fontSize: 11 }}>{condIcon(best.conditions)}</span>}
                      </span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: diff < 0 ? C.good : diff > 0 ? C.rust : C.inkSoft }}>
                        {diff > 0 ? `+${diff}` : diff === 0 ? "E" : diff}
                      </span>
                    </div>
                  );
                })}
                {Object.keys(bests).length === 0 && !bests.par3 && (
                  <div style={{ ...S.sub, fontSize: 12, textAlign: "center", padding: "16px 0" }}>No rounds recorded yet</div>
                )}
              </div>
            )}

            {/* History tab — all rounds newest first */}
            {boardTab === "history" && (
              history.length === 0
                ? <div style={{ ...S.sub, fontSize: 12, textAlign: "center", padding: "16px 0" }}>No rounds recorded yet</div>
                : <div style={{ display: "grid", gap: 2, maxHeight: 320, overflowY: "auto" }}>
                  {history.slice(0, 30).map((e, i) => {
                    const icon = condIcon(e.conditions);
                    const isRound = e.mode === "round";
                    const diff = isRound ? e.score - e.par : null;
                    return (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 4px", borderBottom: `1px solid ${C.bgDeep}` }}>
                        <div>
                          <div style={{ fontSize: 12, display: "flex", alignItems: "center", gap: 5 }}>
                            {isRound ? "🏌" : "⛳"}
                            {isRound ? e.courseName : "Par 3 Challenge"}
                            {icon && <span style={{ fontSize: 11 }}>{icon}</span>}
                          </div>
                          <div style={{ fontSize: 10, color: C.inkFaint, marginTop: 1 }}>{e.date}</div>
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 700, color: isRound ? (diff < 0 ? C.good : diff > 0 ? C.rust : C.inkSoft) : C.brass }}>
                          {isRound ? (diff > 0 ? `+${diff}` : diff === 0 ? "E" : diff) : `${e.score}ft`}
                        </span>
                      </div>
                    );
                  })}
                </div>
            )}
          </div>
        );
      })()}
    </div>
  );

  /* ══ COURSE PICKER ══ */
  if (screen === "course") return (
    <div style={S.root}>
      <FontLink />
      <style>{GLOBAL_STYLES}</style>
      {almanacLayer}
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={S.label}>Choose Your Course</div>
        <h2 style={{ ...S.title, fontSize: 26, marginTop: 6 }}>10 Championship Venues</h2>
        <p style={{ ...S.sub, fontSize: 12, marginTop: 6 }}>Real layouts, real pars, real yardages</p>
      </div>
      <div style={{ display: "grid", gap: 10, width: "100%", maxWidth: 480 }}>
        {COURSES.map((c, i) => (
          <div key={c.id} onClick={() => chooseCourse(c)}
            style={{ ...S.card, cursor: "pointer", transition: "border-color 0.2s, transform 0.1s", animation: `fadeUp 0.3s ease ${i * 0.04}s both` }}
            onMouseEnter={el => el.currentTarget.style.borderColor = C.brass}
            onMouseLeave={el => el.currentTarget.style.borderColor = C.panelEdge}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 17, fontWeight: 700, color: C.forest }}>{c.name}</div>
                <div style={{ fontSize: 11, color: C.inkFaint, marginTop: 2 }}>{c.location}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>Par {c.par}</div>
                <div style={{ fontSize: 11, color: C.inkFaint }}>
                  {c.holes.reduce((a, h) => a + h.yards, 0).toLocaleString()} yds
                </div>
              </div>
            </div>
            <div style={{ fontSize: 12, color: C.inkSoft, marginTop: 6 }}>{c.blurb}</div>
          </div>
        ))}
      </div>
      <button style={{ ...S.btn(), marginTop: 20 }} onClick={() => setScreen("menu")}>← Back</button>
    </div>
  );

  /* ══ ERA PICKER ══ */
  if (screen === "era") return (
    <div style={S.root}>
      <FontLink />
      <style>{GLOBAL_STYLES}</style>
      {almanacLayer}
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        {mode === "round" && selectedCourse && (
          <div style={{ fontSize: 12, fontWeight: 600, color: C.brass, marginBottom: 8 }}>⛳ {selectedCourse.name}</div>
        )}
        <div style={S.label}>Choose Your Era</div>
        <h2 style={{ ...S.title, fontSize: 26, marginTop: 6 }}>Golfer Pool</h2>
        <p style={{ ...S.sub, fontSize: 12, marginTop: 6 }}>Each attribute will be drawn from a random pro in your chosen era</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", maxWidth: 380 }}>
        {[
          { key: "modern",  label: "Modern Tour", icon: "🏆", desc: "Scheffler, McIlroy, Rahm, Koepka & more", names: GOLFERS.modern.map(g => g.name).slice(0, 5).join(" · ") + "…" },
          { key: "legends", label: "Legends",     icon: "👑", desc: "Tiger, Nicklaus, Seve, Faldo & more",      names: GOLFERS.legends.map(g => g.name).slice(0, 5).join(" · ") + "…" },
          { key: "both",    label: "All Eras",    icon: "⚡", desc: "Mix legends and modern pros",             names: "The fullest possible scramble" },
        ].map((e, i) => (
          <div key={e.key} onClick={() => chooseEra(e.key)}
            style={{ ...S.card, cursor: "pointer", transition: "border-color 0.2s", animation: `fadeUp 0.3s ease ${i * 0.08}s both` }}
            onMouseEnter={el => el.currentTarget.style.borderColor = C.brass}
            onMouseLeave={el => el.currentTarget.style.borderColor = C.panelEdge}>
            <div style={{ fontSize: 18, fontWeight: 700, color: C.forest }}>{e.icon} {e.label}</div>
            <div style={{ ...S.sub, fontSize: 12, marginTop: 3 }}>{e.desc}</div>
            <div style={{ fontSize: 11, color: C.inkFaint, marginTop: 8 }}>{e.names}</div>
          </div>
        ))}
      </div>
      <button style={{ ...S.btn(), marginTop: 20 }} onClick={() => setScreen(mode === "round" ? "course" : "menu")}>← Back</button>
    </div>
  );

  /* ══ DIFFICULTY ══ */
  if (screen === "setup") return (
    <div style={S.root}>
      <FontLink />
      <style>{GLOBAL_STYLES}</style>
      {almanacLayer}
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={S.label}>Select Difficulty</div>
        <h2 style={{ ...S.title, fontSize: 26, marginTop: 6 }}>{mode === "hole" ? "⛳ Par 3 Challenge" : "🏌 Full Round · 18 Holes"}</h2>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", maxWidth: 380 }}>
        {DIFFICULTIES.map((d, i) => (
          <div key={d.key} onClick={() => chooseDifficulty(d)}
            style={{ ...S.card, cursor: "pointer", transition: "border-color 0.2s", animation: `fadeUp 0.3s ease ${i * 0.08}s both` }}
            onMouseEnter={e => e.currentTarget.style.borderColor = d.color}
            onMouseLeave={e => e.currentTarget.style.borderColor = C.panelEdge}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 18, fontWeight: 700, color: d.color }}>{d.label}</span>
              <span style={{ fontSize: 11, color: C.inkFaint, fontWeight: 600 }}>
                {d.rerolls === 0 ? "No re-rolls" : `${d.rerolls} re-roll${d.rerolls > 1 ? "s" : ""} total`}
              </span>
            </div>
            <p style={{ ...S.sub, fontSize: 12, marginTop: 4 }}>
              {d.key === "easy" ? "3 re-rolls to use anywhere across your card — spend them wisely"
               : d.key === "medium" ? "1 re-roll to use on any attribute of your choosing"
               : "No re-rolls — your first 4 choices on each stat are final"}
            </p>
          </div>
        ))}
      </div>
      <button style={{ ...S.btn(), marginTop: 20 }} onClick={() => setScreen("era")}>← Back</button>
    </div>
  );

  /* ══ THE SCRAMBLE CARD ══ */
  if (screen === "card") {
    const pickedCount = activeAttrs.filter(a => attrSources[a.key] != null).length;
    const contributions = {};
    activeAttrs.forEach(a => {
      const src = attrSources[a.key];
      if (src) contributions[src.golfer.name] = (contributions[src.golfer.name] || 0) + 1;
    });
    const topContributor = Object.entries(contributions).sort((a, b) => b[1] - a[1])[0];

    return (
      <div style={S.root}>
        <FontLink />
        <style>{GLOBAL_STYLES}</style>
      {almanacLayer}

        <div style={{ textAlign: "center", marginBottom: 20, animation: "fadeUp 0.4s ease both" }}>
          <div style={S.label}>Build Your Scramble</div>
          <h2 style={{ ...S.title, fontSize: 26, marginTop: 6 }}>Pick Your Pros</h2>
          <div style={{ fontSize: 12, fontWeight: 600, color: diff?.color, marginTop: 4 }}>
            {diff?.label.toUpperCase()} · {rerollsLeft > 0 ? `${rerollsLeft} re-roll${rerollsLeft > 1 ? "s" : ""} remaining` : "No re-rolls left"}
          </div>
          <div style={{ ...S.sub, fontSize: 12, marginTop: 4 }}>
            {mode === "hole" && <span style={{ color: C.brass, fontWeight: 600 }}>Par 3 mode — only approach-shot stats apply · </span>}
            {pickedCount < activeAttrs.length ? `${pickedCount} / ${activeAttrs.length} chosen — tap an attribute to roll it` : "All stats chosen — ready to tee off!"}
          </div>
        </div>

        <div style={{ width: "100%", maxWidth: 560, display: "grid", gap: 10, animation: "fadeUp 0.4s ease 0.08s both" }}>
          {activeAttrs.map((attr) => {
            const src = attrSources[attr.key];
            const isPicked = src != null;
            const isActive = activeAttr === attr.key;
            const isActiveRolling = isActive && rolling;
            const isActiveChoosing = isActive && !rolling && attrChoices[attr.key];
            const budget = rerollsLeft; // shared pool, not per-attribute

            return (
              <div key={attr.key} style={{
                ...S.card,
                cursor: isPicked && !isActive ? "default" : "pointer",
                border: `1.5px solid ${isActive ? C.brass : C.panelEdge}`,
                transition: "border-color 0.2s",
              }}>
                <div
                  onClick={() => { if (!isPicked || isActive) { if (!isActive) selectAttr(attr.key); } }}
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: isPicked && !isActive ? "default" : "pointer" }}
                >
                  <span style={{ fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 7 }}>
                    <span>{attr.icon}</span>
                    <span>{attr.label}</span>
                    {!isActive && <span style={{ fontSize: 11, color: C.inkFaint, fontWeight: 400 }}>{attr.desc}</span>}
                  </span>

                  {isPicked && !isActive && (
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 12, color: C.inkSoft }}>{src.golfer.flag} {src.golfer.name}</span>
                      <span style={{
                        fontSize: 16, fontWeight: 700, minWidth: 28, textAlign: "right",
                        color: src.value > 85 ? C.good : src.value > 70 ? C.brass : src.value > 55 ? "#c4942e" : C.rust,
                      }}>
                        {src.value}
                      </span>
                      <button onClick={(e) => { e.stopPropagation(); selectAttr(attr.key); }}
                        title="Change pick"
                        style={{ background: "transparent", border: `1px solid ${C.panelEdge}`, color: C.inkFaint, fontSize: 12, width: 26, height: 26, borderRadius: 6, cursor: "pointer" }}
                      >↺</button>
                    </div>
                  )}
                  {!isPicked && !isActive && (
                    <span style={{ fontSize: 12, color: C.brass, fontWeight: 600 }}>Tap to roll →</span>
                  )}
                  {isActive && (
                    <span style={{ fontSize: 11, color: C.inkFaint, fontWeight: 600 }}>
                      {isActiveRolling ? "Rolling…" : isActiveChoosing ? "Pick one ↓" : ""}
                    </span>
                  )}
                </div>

                {isActive && (
                  <div style={{ marginTop: 14 }}>
                    {isActiveRolling && <RollingSlots attrKey={attr.key} era={era} />}

                    {isActiveChoosing && (
                      <>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                          {attrChoices[attr.key].map((golfer) => {
                            const value = golfer.attrs[attr.key];
                            const color = value > 85 ? C.good : value > 70 ? C.brass : value > 55 ? "#c4942e" : C.rust;
                            return (
                              <button key={golfer.name} onClick={() => pickAttrChoice(attr.key, golfer)}
                                style={{
                                  background: "#f3e6c8", border: `1.5px solid ${C.panelEdge}`,
                                  borderRadius: 8, padding: "10px 6px", cursor: "pointer",
                                  display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
                                  transition: "border-color 0.15s, background 0.15s",
                                  animation: "pop 0.3s cubic-bezier(0.34,1.56,0.64,1) both",
                                }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = C.brass; e.currentTarget.style.background = "#ecdcb0"; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = C.panelEdge; e.currentTarget.style.background = "#f3e6c8"; }}
                              >
                                <span style={{ fontSize: 18 }}>{golfer.flag}</span>
                                <span style={{ fontSize: 10, color: C.inkSoft, textAlign: "center", lineHeight: 1.25, minHeight: 24, display: "flex", alignItems: "center", fontWeight: 500 }}>
                                  {golfer.name}
                                </span>
                                <span style={{ fontSize: 19, fontWeight: 700, color }}>{value}</span>
                              </button>
                            );
                          })}
                        </div>
                        <div style={{ display: "flex", justifyContent: "center", marginTop: 10 }}>
                          <button onClick={() => rerollChoices(attr.key)} disabled={budget <= 0}
                            title={budget > 0 ? `Re-roll (${budget} left)` : "No re-rolls left"}
                            style={{
                              background: "transparent",
                              border: `1.5px solid ${budget > 0 ? C.panelEdge : "#e4d6b8"}`,
                              color: budget > 0 ? C.inkSoft : C.inkFaint,
                              fontSize: 11, fontWeight: 600,
                              padding: "6px 14px",
                              borderRadius: 20, cursor: budget > 0 ? "pointer" : "default",
                            }}
                            onMouseEnter={e => { if (budget > 0) { e.currentTarget.style.borderColor = C.brass; e.currentTarget.style.color = C.brass; }}}
                            onMouseLeave={e => { if (budget > 0) { e.currentTarget.style.borderColor = C.panelEdge; e.currentTarget.style.color = C.inkSoft; }}}
                          >
                            ↺ Re-roll all 3 {budget > 0 ? `(×${budget})` : "(0 left)"}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ ...S.card, maxWidth: 560, marginTop: 4 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
            <div>
              <span style={{ fontSize: 12, color: C.inkFaint, fontWeight: 600 }}>OVR {allRolled ? getOVR(attrs, activeAttrs) : "--"}</span>
              {topContributor && topContributor[1] > 1 && (
                <div style={{ fontSize: 11, color: C.inkFaint, marginTop: 3 }}>
                  Most picked: {topContributor[0]} ({topContributor[1]} stats)
                </div>
              )}
            </div>
            <button
              style={{ ...S.btnF(), opacity: allRolled ? 1 : 0.35, cursor: allRolled ? "pointer" : "default" }}
              onClick={() => allRolled && startPlay()}>
              Tee Off →
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ══ PLAYING ══ */
  if (screen === "playing") return (
    <div style={S.root}>
      <FontLink />
      <style>{GLOBAL_STYLES}</style>
      {almanacLayer}
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div style={S.label}>{mode === "hole" ? "⛳ Par 3 Challenge" : "Full Round · 18 Holes"}</div>
        <h2 style={{ ...S.title, fontSize: 24, marginTop: 6 }}>{mode === "hole" ? holes[0]?.name : selectedCourse?.name}</h2>
        {mode === "round" && selectedCourse && (
          <div style={{ fontSize: 12, color: C.inkFaint, marginTop: 4 }}>{selectedCourse.location}</div>
        )}
      </div>

      {mode === "hole" && holes[0] && (
        <div style={{ ...S.card, maxWidth: 420 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
            <div>
              <div style={S.label}>Par</div>
              <div style={{ fontSize: 32, fontWeight: 700, color: C.forest }}>3</div>
              <div style={{ fontSize: 12, color: C.inkFaint }}>{holes[0].distance} yards</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={S.label}>Conditions</div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{holes[0].weather.windLabel} · {holes[0].weather.wind}mph</div>
              {holes[0].weather.rain && <div style={{ fontSize: 12, color: "#3a6a9e" }}>🌧 Rain</div>}
            </div>
          </div>
          {!showFlight && !flightDone && (
            <button style={{ ...S.btnF(), width: "100%" }} onClick={simulate}>🏌 Simulate Shot</button>
          )}
          {showFlight && !flightDone && pendingResult && (
            <div>
              <div style={{ ...S.label, textAlign: "center", marginBottom: 10, animation: "pulse 0.9s infinite" }}>Ball in the air…</div>
              <BallFlight onDone={onFlightDone} distanceToPin={pendingResult.distanceToPin} />
            </div>
          )}
          {flightDone && results[0] && (
            <div style={{ textAlign: "center", animation: "pop 0.45s cubic-bezier(0.34,1.56,0.64,1)" }}>
              <div style={S.label}>Distance to Pin</div>
              <div style={{
                fontSize: 64, lineHeight: 1, fontWeight: 800, margin: "10px 0",
                color: results[0].distanceToPin === 0 ? "#7c5cad" : results[0].distanceToPin <= 4 ? C.good : results[0].distanceToPin <= 10 ? C.brass : C.rust,
              }}>
                {results[0].distanceToPin}<span style={{ fontSize: 26 }}>ft</span>
              </div>
              {results[0].distanceToPin === 0 && <div style={{ fontSize: 14, color: "#7c5cad", fontWeight: 700, letterSpacing: "0.06em" }}>HOLE IN ONE 🎉</div>}
            </div>
          )}
        </div>
      )}

      {mode === "round" && (
        <div style={{ ...S.card, maxWidth: 480 }}>
          {!simulating && results.length === 0 && (
            <button style={{ ...S.btnF(), width: "100%" }} onClick={simulate}>🏌 Simulate Full Round</button>
          )}
          {(simulating || results.length > 0) && (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", gap: 6, paddingBottom: 8, borderBottom: `1px solid ${C.panelEdge}` }}>
                {["Hole","Par","Conditions","Score",""].map(h => <div key={h} style={S.label}>{h}</div>)}
              </div>
              <div style={{ maxHeight: 340, overflowY: "auto" }}>
                {holes.map((hole, i) => {
                  const r = results[i];
                  const active = simulating && i === animIdx;
                  const w = hole.weather;
                  const condIcon = w.rain ? "🌧" : w.wind > 25 ? "🌬" : w.wind > 15 ? "💨" : "☀️";
                  return (
                    <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", gap: 6, padding: "7px 0", borderBottom: `1px solid ${C.bgDeep}`, opacity: r ? 1 : 0.3, background: active ? "#f3e6c8" : "transparent", animation: r && !active ? "rowPop 0.5s ease" : "none", transition: "opacity 0.2s, background 0.3s", borderRadius: 4 }}>
                      <div style={{ fontSize: 12, fontWeight: 500 }}>{hole.number}. {hole.name}</div>
                      <div style={{ fontSize: 12, color: C.inkFaint }}>{hole.par}</div>
                      <div style={{ fontSize: 11, color: C.inkFaint, display: "flex", alignItems: "center", gap: 3 }} title={`${w.windLabel} · ${w.wind}mph${w.rain ? " · Rain" : ""}`}>
                        {condIcon} {w.wind}
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: r ? (r.score < hole.par ? C.good : r.score > hole.par ? C.rust : C.inkSoft) : C.panelEdge }}>
                        {r ? r.score : active ? "…" : "—"}
                      </div>
                      <div>{r && <ScoreBadge score={r.score} par={hole.par} />}</div>
                    </div>
                  );
                })}
              </div>
              {results.length === holes.length && (
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", gap: 6, paddingTop: 10, borderTop: `1px solid ${C.panelEdge}`, marginTop: 4 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: C.brass }}>TOTAL</div>
                  <div style={{ fontSize: 12 }}>{totalPar}</div>
                  <div></div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: scoreDiff < 0 ? C.good : scoreDiff > 0 ? C.rust : C.inkSoft }}>{totalScore}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: scoreDiff < 0 ? C.good : scoreDiff > 0 ? C.rust : C.inkSoft }}>
                    {scoreDiff > 0 ? `+${scoreDiff}` : scoreDiff === 0 ? "E" : scoreDiff}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {results.length > 0 && results.length === holes.length && (
        <button style={{ ...S.btnF(), marginTop: 16 }} onClick={() => setScreen("result")}>View Results →</button>
      )}
    </div>
  );

  /* ══ RESULT ══ */
  if (screen === "result") {
    const ovr = getOVR(attrs, activeAttrs);
    const bestEntry  = activeAttrs.reduce((a, b) => (attrSources[a.key]?.value ?? 0) > (attrSources[b.key]?.value ?? 0) ? a : b);
    const worstEntry = activeAttrs.reduce((a, b) => (attrSources[a.key]?.value ?? 99) < (attrSources[b.key]?.value ?? 99) ? a : b);
    const uniqueGolfers = [...new Set(activeAttrs.map(a => attrSources[a.key]?.golfer?.name).filter(Boolean))];

    const getGrade = () => {
      if (mode === "hole") {
        const d = results[0]?.distanceToPin;
        if (d === 0)  return ["Hole in One! 🎉", "#7c5cad"];
        if (d <= 3)   return ["Inches Away",     C.brass];
        if (d <= 8)   return ["Tap In",          C.good];
        if (d <= 15)  return ["Solid Strike",    C.inkSoft];
        return              ["Work to Do",       C.rust];
      }
      if (scoreDiff <= -5)  return ["Legendary",    "#7c5cad"];
      if (scoreDiff <= 0)   return ["Outstanding",  C.brass];
      if (scoreDiff <= 8)   return ["Solid Round",  C.good];
      if (scoreDiff <= 16)  return ["Club Amateur", C.inkSoft];
      if (scoreDiff <= 25)  return ["Rough Day",    "#b9712f"];
      return                       ["Hack Job",     C.rust];
    };
    const [gradeLabel, gradeColor] = getGrade();

    return (
      <div style={S.root}>
        <FontLink />
        <style>{GLOBAL_STYLES}</style>
      {almanacLayer}

        <div style={{ textAlign: "center", marginBottom: 24, animation: "fadeUp 0.5s ease both" }}>
          <div style={S.label}>Round Complete</div>
          {mode === "round" && selectedCourse && (
            <div style={{ fontSize: 12, color: C.inkFaint, marginTop: 4 }}>{selectedCourse.name}</div>
          )}
          <div style={{ ...wordmark, fontSize: 34, color: gradeColor, marginTop: 6, animation: "pop 0.55s cubic-bezier(0.34,1.56,0.64,1) 0.15s both" }}>
            {gradeLabel}
          </div>
        </div>

        <div style={{ ...S.card, maxWidth: 460, marginBottom: 14, animation: "fadeUp 0.5s ease 0.1s both" }}>
          {mode === "hole" ? (
            <div style={{ textAlign: "center" }}>
              <div style={S.label}>Distance to Pin</div>
              <div style={{ fontSize: 60, fontWeight: 800, lineHeight: 1, margin: "10px 0", color: results[0]?.distanceToPin === 0 ? "#7c5cad" : results[0]?.distanceToPin <= 5 ? C.good : C.brass }}>
                {results[0]?.distanceToPin}<span style={{ fontSize: 24 }}>ft</span>
              </div>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, textAlign: "center" }}>
              {[["Score", String(totalScore), C.brass],
                ["To Par", scoreDiff > 0 ? `+${scoreDiff}` : scoreDiff === 0 ? "E" : String(scoreDiff), scoreDiff < 0 ? C.good : scoreDiff > 0 ? C.rust : C.inkSoft],
                ["OVR", String(ovr), C.brass]].map(([lbl, val, col]) => (
                <div key={lbl}><div style={S.label}>{lbl}</div><div style={{ fontSize: 28, fontWeight: 700, color: col }}>{val}</div></div>
              ))}
            </div>
          )}

          <hr style={S.divider} />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
            <div>
              <div style={S.label}>Best Stat</div>
              <div style={{ fontSize: 13, fontWeight: 600, marginTop: 4 }}>{bestEntry.icon} {bestEntry.label}</div>
              <div style={{ fontSize: 11, color: C.inkSoft, marginTop: 2 }}>
                {attrSources[bestEntry.key]?.golfer?.flag} {attrSources[bestEntry.key]?.golfer?.name} · <span style={{ color: C.good, fontWeight: 700 }}>{attrSources[bestEntry.key]?.value}</span>
              </div>
            </div>
            <div>
              <div style={S.label}>Weakest Stat</div>
              <div style={{ fontSize: 13, fontWeight: 600, marginTop: 4 }}>{worstEntry.icon} {worstEntry.label}</div>
              <div style={{ fontSize: 11, color: C.inkSoft, marginTop: 2 }}>
                {attrSources[worstEntry.key]?.golfer?.flag} {attrSources[worstEntry.key]?.golfer?.name} · <span style={{ color: C.rust, fontWeight: 700 }}>{attrSources[worstEntry.key]?.value}</span>
              </div>
            </div>
          </div>

          <div>
            <div style={S.label}>The Scramble · {uniqueGolfers.length} pros</div>
            <div style={{ fontSize: 12, color: C.inkSoft, marginTop: 6, lineHeight: 1.7 }}>
              {uniqueGolfers.join(" · ")}
            </div>
          </div>
        </div>

        <div style={{ ...S.card, maxWidth: 460, marginBottom: 14, animation: "fadeUp 0.5s ease 0.2s both" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 20 }}>✓</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.good }}>Round recorded automatically</div>
              <div style={{ fontSize: 11, color: C.inkFaint, marginTop: 2 }}>
                Saved to {player?.name || "your"} records
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", animation: "fadeUp 0.5s ease 0.3s both" }}>
          <button style={S.btn()} onClick={reset}
            onMouseEnter={e => e.currentTarget.style.background = "#eaf0e6"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>New Golfer</button>
          <button style={S.btn(C.inkSoft)} onClick={viewLeaderboard}
            onMouseEnter={e => e.currentTarget.style.background = C.bgDeep}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>🏆 View Leaderboard</button>
          <button style={S.btn(C.brass)} onClick={() => { setShowAlmanac(true); }}>📖 Almanac</button>
          <button style={S.btnF()} onClick={() => startSetup(mode)}>Same Format →</button>
        </div>
      </div>
    );
  }

  return null;
}