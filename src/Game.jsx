import { useState, useEffect, useRef } from "react";

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

const STORAGE_KEY = "the_scramble_lb_v1";

/* ─── Helpers ─────────────────────────────────────────── */
function pickRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function getPool(era) {
  if (era === "modern")  return GOLFERS.modern;
  if (era === "legends") return GOLFERS.legends;
  return [...GOLFERS.modern, ...GOLFERS.legends];
}

function drawAttrChoices(pool, count = 3) {
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

function generateRoundWeather(holeCount) {
  const baseWind = Math.floor(Math.random() * 25);
  const willRain = Math.random() > 0.7;
  const rainStart = willRain ? Math.floor(Math.random() * (holeCount - 4)) : -1;
  const rainLength = 3 + Math.floor(Math.random() * 6);
  let wind = baseWind;
  const weatherByHole = [];
  for (let i = 0; i < holeCount; i++) {
    wind = Math.max(0, Math.min(34, wind + (Math.random() - 0.5) * 6));
    const rain = willRain && i >= rainStart && i < rainStart + rainLength;
    weatherByHole.push({ wind: Math.round(wind), rain, windLabel: windLabelFor(Math.round(wind)) });
  }
  return weatherByHole;
}

function generatePar3Hole() {
  const name = pickRandom(PAR3_NAMES);
  return { number: 1, name, par: 3, distance: 130 + Math.floor(Math.random() * 90), weather: generateWeather() };
}

function generateCourseHoles(course) {
  const weatherByHole = generateRoundWeather(course.holes.length);
  return course.holes.map((h, i) => ({
    number: i + 1, name: h.name || `Hole ${i + 1}`, par: h.par, distance: h.yards, weather: weatherByHole[i],
  }));
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

function loadLeaderboard() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; } }
function saveLeaderboard(lb) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(lb.slice(0, 20))); } catch {} }

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

function ScoreBadge({ score, par }) {
  const diff = score - par;
  const map = { [-3]: ["Albatross", "#7c5cad"], [-2]: ["Eagle", "#a9762c"], [-1]: ["Birdie", "#3f6b3f"], 0: ["Par", "#6b5d47"], 1: ["Bogey", "#b9712f"], 2: ["Dbl Bogey", "#a0432e"] };
  const [label, color] = map[diff] || (diff > 0 ? [`+${diff}`, "#7a2f1f"] : [`${diff}`, "#2d5c2d"]);
  return <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.05em", color, textTransform: "uppercase" }}>{label}</span>;
}

function RollingSlots({ attrKey, era }) {
  const [cards, setCards] = useState([null, null, null]);
  useEffect(() => {
    const pool = getPool(era);
    const interval = setInterval(() => setCards(drawAttrChoices(pool, 3)), 80);
    return () => clearInterval(interval);
  }, [attrKey, era]);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
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
  const [rerollsLeft, setRerollsLeft] = useState({});
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
  const [showBoard, setShowBoard]   = useState(false);
  const [boardCourseFilter, setBoardCourseFilter] = useState("all");
  const [boardTab, setBoardTab] = useState("hole");
  const [playerName, setPlayerName] = useState("");
  const [nameSaved, setNameSaved]   = useState(false);

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
    const budget = activeAttrs.reduce((acc, a) => ({ ...acc, [a.key]: d.rerolls }), {});
    setAttrChoices(blankChoices);
    setAttrSources(blankSources);
    setRerollsLeft(budget);
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
      setAttrChoices(prev => ({ ...prev, [key]: drawAttrChoices(pool, 3) }));
      setRolling(false);
    }, 900);
  }

  function pickAttrChoice(key, golfer) {
    const value = golfer.attrs[key];
    setAttrSources(prev => ({ ...prev, [key]: { golfer, value } }));
    setActiveAttr(null);
  }

  function rerollChoices(key) {
    if (rerollsLeft[key] <= 0 || rolling) return;
    setRerollsLeft(prev => ({ ...prev, [key]: prev[key] - 1 }));
    setAttrChoices(prev => ({ ...prev, [key]: null }));
    runRoll(key);
  }

  function startPlay() {
    const h = mode === "hole" ? [generatePar3Hole()] : generateCourseHoles(selectedCourse);
    setHoles(h); setResults([]); setSimulating(false); setAnimIdx(-1);
    setShowFlight(false); setFlightDone(false); setPendingResult(null);
    setScreen("playing");
  }

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
      setSimulating(false);
    }
  }

  function onFlightDone() { setFlightDone(true); setResults([pendingResult]); setSimulating(false); }

  function saveScore() {
    if (nameSaved || !playerName.trim()) return;
    const conditions = mode === "hole"
      ? { wind: holes[0]?.weather.wind, windLabel: holes[0]?.weather.windLabel, rain: holes[0]?.weather.rain }
      : (() => {
          const avgWind = Math.round(holes.reduce((a, h) => a + h.weather.wind, 0) / holes.length);
          const anyRain = holes.some(h => h.weather.rain);
          return { wind: avgWind, windLabel: windLabelFor(avgWind), rain: anyRain };
        })();
    const entry = {
      name: playerName.trim(), mode,
      score: mode === "hole" ? results[0]?.distanceToPin : totalScore,
      par: mode === "hole" ? null : totalPar,
      diff: difficulty, ovr: getOVR(attrs, activeAttrs),
      courseId: mode === "round" ? selectedCourse?.id : null,
      courseName: mode === "round" ? selectedCourse?.name : null,
      conditions,
      date: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
    };
    const updated = [...leaderboard, entry].sort((a, b) =>
      mode === "hole" ? a.score - b.score : (a.score - a.par) - (b.score - b.par)
    );
    setLeaderboard(updated); saveLeaderboard(updated); setNameSaved(true);
  }

  function reset() {
    setScreen("menu"); setMode(null); setEra(null); setDifficulty(null); setSelectedCourse(null);
    setAttrChoices({}); setAttrSources({}); setRerollsLeft({});
    setActiveAttr(null); setRolling(false);
    setResults([]); setHoles([]); setAnimIdx(-1);
    setShowFlight(false); setFlightDone(false); setPendingResult(null);
    setNameSaved(false); setPlayerName("");
  }

  function viewLeaderboard() {
    if (mode === "round" && selectedCourse) setBoardCourseFilter(selectedCourse.id);
    reset();
    setShowBoard(true);
  }

  const totalScore = results.reduce((a, r) => a + r.score, 0);
  const totalPar   = holes.slice(0, results.length).reduce((a, h) => a + h.par, 0);
  const scoreDiff  = totalScore - totalPar;
  const holeBoard  = leaderboard.filter(e => e.mode === "hole").slice(0, 8);
  const roundBoardAll = leaderboard.filter(e => e.mode === "round");
  const roundBoard = (boardCourseFilter === "all" ? roundBoardAll : roundBoardAll.filter(e => e.courseId === boardCourseFilter)).slice(0, 8);

  const GLOBAL_STYLES = `
    @keyframes fadeUp  { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
    @keyframes pop     { from{opacity:0;transform:scale(0.78)}      to{opacity:1;transform:scale(1)} }
    @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:0.4} }
    @keyframes rowPop  { 0%{background:#e8dcc0} 100%{background:transparent} }
    @keyframes spinBtn { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
    @keyframes shimmer { 0%{opacity:0.35} 50%{opacity:0.75} 100%{opacity:0.35} }
  `;
  const FontLink = () => <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,500;9..144,600&display=swap" rel="stylesheet" />;
  const wordmark = { fontFamily: "'Fraunces', Georgia, serif", fontWeight: 600 };

  /* ══ MENU ══ */
  if (screen === "menu") return (
    <div style={S.root}>
      <FontLink />
      <style>{GLOBAL_STYLES}</style>
      <div style={{ textAlign: "center", marginBottom: 36, animation: "fadeUp 0.5s ease both" }}>
        <div style={{ ...S.label, marginBottom: 10, color: C.brass }}>⛳ A Round Worth Talking About</div>
        <h1 style={{ ...S.title, ...wordmark, fontSize: 38 }}>The Scramble</h1>
        <p style={{ ...S.sub, marginTop: 8, fontSize: 13 }}>Pull a stat from a different pro every time. Build your golfer. Play the course.</p>
      </div>
      <div style={{ ...S.card, textAlign: "center", animation: "fadeUp 0.5s ease 0.1s both" }}>
        <p style={{ ...S.label, marginBottom: 18 }}>Choose your format</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          {[["⛳ Single Hole · Par 3", "hole"], ["🏌 Full Round · 18", "round"]].map(([lbl, m]) => (
            <button key={m} style={S.btn()} onClick={() => startSetup(m)}
              onMouseEnter={e => e.currentTarget.style.background = "#eaf0e6"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>{lbl}</button>
          ))}
        </div>
        <hr style={S.divider} />
        <button style={{ ...S.btn(C.inkSoft), fontSize: 12 }} onClick={() => setShowBoard(b => !b)}>
          {showBoard ? "Hide" : "🏆 View"} Leaderboard
        </button>
      </div>
      {showBoard && (
        <div style={{ ...S.card, marginTop: 14, maxWidth: 480 }}>
          <div style={{ display: "flex", gap: 4, marginBottom: 16, background: C.bgDeep, borderRadius: 8, padding: 3 }}>
            {[["hole", "⛳ Closest to Pin"], ["round", "🏌 Best Round"]].map(([key, lbl]) => (
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

          {boardTab === "hole" && (
            holeBoard.length === 0
              ? <div style={{ ...S.sub, fontSize: 12, textAlign: "center", padding: "16px 0" }}>No scores yet</div>
              : <div style={{ display: "grid", gap: 2 }}>
                {holeBoard.map((e, i) => {
                  const c = e.conditions;
                  const icon = c ? (c.rain ? "🌧" : c.wind > 25 ? "🌬" : c.wind > 15 ? "💨" : "☀️") : null;
                  return (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 4px", borderBottom: i < holeBoard.length - 1 ? `1px solid ${C.bgDeep}` : "none" }}>
                      <span style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ color: C.inkFaint, minWidth: 16, fontWeight: 600 }}>{i + 1}</span>
                        {e.name}
                        {icon && <span title={c.rain ? `${c.windLabel}, Rain` : c.windLabel} style={{ fontSize: 12 }}>{icon}</span>}
                      </span>
                      <span style={{ fontSize: 13, color: C.brass, fontWeight: 700 }}>{e.score}ft</span>
                    </div>
                  );
                })}
              </div>
          )}

          {boardTab === "round" && (
            <>
              <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 10, marginBottom: 4, WebkitOverflowScrolling: "touch" }}>
                <button onClick={() => setBoardCourseFilter("all")}
                  style={{
                    flexShrink: 0, padding: "6px 14px", borderRadius: 20, whiteSpace: "nowrap",
                    border: `1.5px solid ${boardCourseFilter === "all" ? C.brass : C.panelEdge}`,
                    background: boardCourseFilter === "all" ? "#f3e6c8" : "transparent",
                    color: boardCourseFilter === "all" ? "#7a5620" : C.inkFaint,
                    fontSize: 11, fontWeight: 600, cursor: "pointer",
                  }}>
                  All Courses
                </button>
                {COURSES.map(c => (
                  <button key={c.id} onClick={() => setBoardCourseFilter(c.id)}
                    style={{
                      flexShrink: 0, padding: "6px 14px", borderRadius: 20, whiteSpace: "nowrap",
                      border: `1.5px solid ${boardCourseFilter === c.id ? C.brass : C.panelEdge}`,
                      background: boardCourseFilter === c.id ? "#f3e6c8" : "transparent",
                      color: boardCourseFilter === c.id ? "#7a5620" : C.inkFaint,
                      fontSize: 11, fontWeight: 600, cursor: "pointer",
                    }}>
                    {c.name}
                  </button>
                ))}
              </div>

              {roundBoard.length === 0
                ? <div style={{ ...S.sub, fontSize: 12, textAlign: "center", padding: "16px 0" }}>No scores yet</div>
                : <div style={{ display: "grid", gap: 2 }}>
                  {roundBoard.map((e, i) => {
                    const c = e.conditions;
                    const icon = c ? (c.rain ? "🌧" : c.wind > 25 ? "🌬" : c.wind > 15 ? "💨" : "☀️") : null;
                    return (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 4px", borderBottom: i < roundBoard.length - 1 ? `1px solid ${C.bgDeep}` : "none" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                          <span style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ color: C.inkFaint, minWidth: 16, fontWeight: 600 }}>{i + 1}</span>
                            {e.name}
                            {icon && <span title={c.rain ? `${c.windLabel}, Rain` : c.windLabel} style={{ fontSize: 12 }}>{icon}</span>}
                          </span>
                          {boardCourseFilter === "all" && e.courseName && (
                            <span style={{ fontSize: 10, color: C.inkFaint, marginLeft: 22 }}>{e.courseName}</span>
                          )}
                        </div>
                        <span style={{ fontSize: 13, color: C.brass, fontWeight: 700 }}>
                          {e.score - e.par <= 0 ? e.score - e.par || "E" : `+${e.score - e.par}`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              }
            </>
          )}

          {leaderboard.length > 0 && (
            <button style={{ ...S.btn(C.rust), fontSize: 11, marginTop: 14, width: "100%" }}
              onClick={() => { setLeaderboard([]); saveLeaderboard([]); }}>Clear Board</button>
          )}
        </div>
      )}
    </div>
  );

  /* ══ COURSE PICKER ══ */
  if (screen === "course") return (
    <div style={S.root}>
      <FontLink />
      <style>{GLOBAL_STYLES}</style>
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
                {d.rerolls === 0 ? "No re-rolls" : `${d.rerolls} re-roll${d.rerolls > 1 ? "s" : ""} per stat`}
              </span>
            </div>
            <p style={{ ...S.sub, fontSize: 12, marginTop: 4 }}>
              {d.key === "easy" ? "Re-roll the 3 choices on any stat up to 3 times if you don't like your options"
               : d.key === "medium" ? "One re-roll of the 3 choices on each stat"
               : "What's offered is final — pick from your first 3"}
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

        <div style={{ textAlign: "center", marginBottom: 20, animation: "fadeUp 0.4s ease both" }}>
          <div style={S.label}>Build Your Scramble</div>
          <h2 style={{ ...S.title, fontSize: 26, marginTop: 6 }}>Pick Your Pros</h2>
          <div style={{ fontSize: 12, fontWeight: 600, color: diff?.color, marginTop: 4 }}>
            {diff?.label.toUpperCase()} · {diff?.rerolls > 0 ? `${diff.rerolls} re-roll${diff.rerolls > 1 ? "s" : ""} per stat` : "No re-rolls"}
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
            const budget = rerollsLeft[attr.key] ?? 0;

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
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
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
          <div style={S.label}>🏆 Save to Leaderboard</div>
          {nameSaved
            ? <div style={{ fontSize: 13, color: C.good, fontWeight: 600, marginTop: 10 }}>✓ Score saved!</div>
            : (
              <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                <input value={playerName} onChange={e => setPlayerName(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && saveScore()} placeholder="Your name…" maxLength={16}
                  style={{ flex: 1, background: C.bgDeep, border: `1.5px solid ${C.panelEdge}`, color: C.ink, padding: "9px 12px", fontSize: 16, borderRadius: 8, outline: "none", fontFamily: "inherit" }} />
                <button style={S.btnF()} onClick={saveScore}>Save</button>
              </div>
            )
          }
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", animation: "fadeUp 0.5s ease 0.3s both" }}>
          <button style={S.btn()} onClick={reset}
            onMouseEnter={e => e.currentTarget.style.background = "#eaf0e6"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>New Golfer</button>
          <button style={S.btn(C.inkSoft)} onClick={viewLeaderboard}
            onMouseEnter={e => e.currentTarget.style.background = C.bgDeep}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>🏆 View Leaderboard</button>
          <button style={S.btnF()} onClick={() => startSetup(mode)}>Same Format →</button>
        </div>
      </div>
    );
  }

  return null;
}
