// ─── SPEEDRUN DATA ────────────────────────────────────────────────────────────
export const SPEEDRUN_QS = [
  { q: "Qui a construit l'arche ?", a: "Noé", type: "text" },
  { q: "Jésus est né à Bethléem", a: "Vrai", type: "tf", opts: ["Vrai", "Faux"] },
  { q: "Combien d'apôtres ?", a: "12", type: "text" },
  { q: "David a tué Goliath avec une épée", a: "Faux", type: "tf", opts: ["Vrai", "Faux"] },
  { q: "Quel prophète fut avalé par un grand poisson ?", a: "Jonas", type: "text" },
  { q: "Jésus a jeûné ___ jours dans le désert", a: "40", type: "text" },
  { q: "Paul s'appelait Saül avant sa conversion", a: "Vrai", type: "tf", opts: ["Vrai", "Faux"] },
  { q: "Quel roi a demandé la tête de Jean-Baptiste ?", a: "Hérode", type: "text" },
  { q: "La Bible compte 66 livres", a: "Vrai", type: "tf", opts: ["Vrai", "Faux"] },
  { q: "Qui a trahi Jésus ?", a: "Judas", type: "text" },
  { q: "Moïse a ouvert la mer Rouge", a: "Vrai", type: "tf", opts: ["Vrai", "Faux"] },
  { q: "Quel apôtre a renié Jésus 3 fois ?", a: "Pierre", type: "text" },
  { q: "Le premier livre de la Bible ?", a: "Genèse", type: "text" },
  { q: "Jésus est ressuscité le 3ème jour", a: "Vrai", type: "tf", opts: ["Vrai", "Faux"] },
  { q: "Qui a écrit l'Apocalypse ?", a: "Jean", type: "text" },
  { q: "Adam et Ève vivaient au jardin d'Éden", a: "Vrai", type: "tf", opts: ["Vrai", "Faux"] },
  { q: "Quel est le dernier livre de la Bible ?", a: "Apocalypse", type: "text" },
  { q: "David était berger avant d'être roi", a: "Vrai", type: "tf", opts: ["Vrai", "Faux"] },
  { q: "Combien de plaies ont frappé l'Égypte ?", a: "10", type: "text" },
  { q: "Jésus a changé l'eau en vin à Cana", a: "Vrai", type: "tf", opts: ["Vrai", "Faux"] },
  { q: "Quel est le plus court verset de la Bible ?", a: "Jésus pleura", type: "text" },
  { q: "Noé avait ___ fils", a: "3", type: "text" },
  { q: "Ruth était la belle-fille de Naomi", a: "Vrai", type: "tf", opts: ["Vrai", "Faux"] },
  { q: "Qui a écrit la plupart des Psaumes ?", a: "David", type: "text" },
  { q: "Combien de commandements Dieu a-t-il donnés à Moïse ?", a: "10", type: "text" },
];

// ─── MEMORY PAIRS ─────────────────────────────────────────────────────────────
export const MEMORY_PAIRS = [
  { a: "Noé 🚢",        b: "Arche & Déluge" },
  { a: "David 🗡️",      b: "Goliath & Fronde" },
  { a: "Jonas 🐋",      b: "Grand Poisson" },
  { a: "Moïse ✋",      b: "Mer Rouge" },
  { a: "Salomon 👑",    b: "Temple de Jérusalem" },
  { a: "Abraham ⭐",    b: "Père des nations" },
  { a: "Marie 🌹",      b: "Mère de Jésus" },
  { a: "Paul ✉️",       b: "Lettres aux Églises" },
  { a: "Ésaïe 📜",      b: "Prophète de la venue de Jésus" },
  { a: "Daniel 🦁",     b: "Fosse aux lions" },
  { a: "Élie ⚡",       b: "Char de feu" },
  { a: "Esther 👸",     b: "Reine qui sauva son peuple" },
];

// ─── BINGO CHALLENGES ─────────────────────────────────────────────────────────
export const BINGO_CHALLENGES = [
  { icon: "❓", label: "Vrai ou Faux", q: "David était le fils de Noé ?", a: "Faux", type: "tf" },
  { icon: "📖", label: "Verset", q: "Qui a dit : 'Je suis le chemin, la vérité et la vie' ?", a: "Jésus", type: "text" },
  { icon: "🔢", label: "Chiffre", q: "Combien de jours Jonas était dans le poisson ?", a: "3", type: "text" },
  { icon: "🧩", label: "Associe", q: "Goliath était un...", a: "Géant philistin", type: "mc", opts: ["Géant philistin", "Roi d'Israël", "Prophète", "Disciple"] },
  { icon: "⚡", label: "Rapide !", q: "Le premier homme ?", a: "Adam", type: "text" },
  { icon: "🌊", label: "Histoire", q: "Qui a marché sur l'eau ?", a: "Jésus", type: "mc", opts: ["Jésus", "Moïse", "Paul", "Pierre"] },
  { icon: "🎯", label: "Précis", q: "Quel arbre était interdit dans l'Éden ?", a: "Connaissance du bien et du mal", type: "mc", opts: ["Connaissance du bien et du mal", "Vie éternelle", "Sagesse", "Puissance"] },
  { icon: "🔍", label: "Détective", q: "Qui a vendu Joseph à des marchands ?", a: "Ses frères", type: "mc", opts: ["Ses frères", "Son père", "Des Égyptiens", "Des Philistins"] },
  { icon: "📜", label: "Texte", q: "Complète : 'L'Éternel est mon ___'", a: "berger", type: "text" },
  { icon: "👑", label: "Roi", q: "Quel roi a fait construire le premier Temple ?", a: "Salomon", type: "mc", opts: ["Salomon", "David", "Saül", "Roboam"] },
  { icon: "🌟", label: "Lumière", q: "Jésus est né à Bethléem ?", a: "Vrai", type: "tf" },
  { icon: "🔮", label: "Prophète", q: "Qui a annoncé la naissance de Jésus à Marie ?", a: "Gabriel", type: "mc", opts: ["Gabriel", "Michel", "Raphaël", "Uriel"] },
  { icon: "⚔️", label: "Bataille", q: "Avec quoi David a-t-il tué Goliath ?", a: "Fronde", type: "mc", opts: ["Fronde", "Épée", "Lance", "Arc"] },
  { icon: "🐑", label: "Berger", q: "Combien Jésus laisse-t-il pour chercher la brebis perdue ?", a: "99", type: "text" },
  { icon: "🌈", label: "Alliance", q: "Le signe de l'alliance avec Noé ?", a: "Arc-en-ciel", type: "mc", opts: ["Arc-en-ciel", "Étoile", "Nuée", "Flamme"] },
  { icon: "✝️", label: "Croix", q: "Simon de Cyrène a porté la croix de Jésus ?", a: "Vrai", type: "tf" },
  { icon: "🕊️", label: "Esprit", q: "Sous quelle forme l'Esprit est apparu lors du baptême ?", a: "Colombe", type: "mc", opts: ["Colombe", "Feu", "Vent", "Nuée"] },
  { icon: "🏙️", label: "Ville", q: "Dans quelle ville Jésus a-t-il ressuscité Lazare ?", a: "Béthanie", type: "mc", opts: ["Béthanie", "Jérusalem", "Nazareth", "Capharnaüm"] },
  { icon: "🍞", label: "Pain", q: "Jésus a multiplié 5 pains et 2 poissons ?", a: "Vrai", type: "tf" },
  { icon: "🌙", label: "Nuit", q: "Qui est venu voir Jésus de nuit pour apprendre ?", a: "Nicodème", type: "mc", opts: ["Nicodème", "Zachée", "Thomas", "Barthélemy"] },
  { icon: "🎺", label: "Trompette", q: "Combien de trompettes dans l'Apocalypse ?", a: "7", type: "text" },
  { icon: "🦁", label: "Lion", q: "Qui a été jeté dans la fosse aux lions ?", a: "Daniel", type: "mc", opts: ["Daniel", "Ézéchiel", "Jérémie", "Isaïe"] },
  { icon: "💧", label: "Eau", q: "Jésus a changé l'eau en vin à une noce à ___", a: "Cana", type: "text" },
  { icon: "🔑", label: "Clé", q: "Les clés du Royaume ont été données à ?", a: "Pierre", type: "mc", opts: ["Pierre", "Paul", "Jean", "Jacques"] },
  { icon: "🆓", label: "LIBRE", q: "Case gratuite !", a: "OK", type: "free" },
];

// ─── ESCAPE LEVELS ────────────────────────────────────────────────────────────
export const ESCAPE_LEVELS = [
  {
    id: 1, title: "La Chambre d'Éden", icon: "🌿",
    story: "Vous êtes dans le jardin d'Éden. Une porte mystérieuse vous bloque. Pour l'ouvrir, vous devez résoudre 3 énigmes.",
    enigmas: [
      { q: "Quel nom Dieu donna-t-il au premier homme ?", a: "Adam", hint: "Il fut créé de la poussière..." },
      { q: "Quel fruit était INTERDIT dans le jardin ?", a: "connaissance", hint: "L'arbre de la ___ du bien et du mal" },
      { q: "Combien de jours dura la création ?", a: "6", hint: "Et le 7ème jour, Il se reposa" },
    ],
    code: "EDEN",
    reward: "🗝️ Clé d'Or",
    xp: 80,
  },
  {
    id: 2, title: "Le Temple de Salomon", icon: "🏛️",
    story: "Vous entrez dans le Temple. Une inscription cryptique dit : 'Celui qui connaît le roi peut passer.'",
    enigmas: [
      { q: "Quel roi a construit le Temple à Jérusalem ?", a: "Salomon", hint: "Fils du roi David" },
      { q: "Combien d'années prit la construction du Temple ?", a: "7", hint: "Chiffre souvent sacré dans la Bible" },
      { q: "Quelle reine est venue rendre visite à Salomon ?", a: "Saba", hint: "Une reine d'Afrique" },
    ],
    code: "SAGE",
    reward: "⚡ Badge Sagesse",
    xp: 100,
  },
  {
    id: 3, title: "La Prison de Paul", icon: "⛓️",
    story: "Paul est emprisonné à Philippes. La porte tremble. Trouvez les réponses pour faire tomber les chaînes !",
    enigmas: [
      { q: "Quel était le nom de Paul avant sa conversion ?", a: "Saul", hint: "Un nom de roi d'Israël également" },
      { q: "Sur quel chemin Paul a-t-il eu sa vision lumineuse ?", a: "Damas", hint: "Chemin de ___" },
      { q: "Combien d'épîtres Paul a-t-il écrites dans le NT ?", a: "13", hint: "Entre 12 et 14..." },
    ],
    code: "LIBRE",
    reward: "✨ XP × 3",
    xp: 120,
  },
  {
    id: 4, title: "Le Désert de Tentation", icon: "🏜️",
    story: "Jésus jeûne dans le désert. Le tentateur arrive avec 3 défis. Répondez à sa place pour résister !",
    enigmas: [
      { q: "Combien de jours Jésus a-t-il jeûné dans le désert ?", a: "40", hint: "Même durée que le peuple d'Israël dans le désert" },
      { q: "Quelle fut la 1ère tentation ? Transformer des ___ en pain", a: "pierres", hint: "Des éléments du sol rocheux" },
      { q: "Sur quel mont Satan a-t-il montré tous les royaumes à Jésus ?", a: "Quarantaine", hint: "Une haute montagne... (nom controversé)" },
    ],
    code: "RESIST",
    reward: "🔥 Badge Résistance",
    xp: 140,
  },
];

// ─── BATTLE QS ────────────────────────────────────────────────────────────────
export const BATTLE_QS = [
  { q: "Qui a créé le monde en 6 jours ?", a: "Dieu", opts: ["Dieu", "Moïse", "Adam", "Noé"] },
  { q: "Combien d'archanges sont nommés dans la Bible ?", a: "3", opts: ["3", "4", "7", "12"] },
  { q: "Quel animal a parlé à Balaam ?", a: "L'ânesse", opts: ["L'ânesse", "Le serpent", "L'aigle", "La colombe"] },
  { q: "Qui a écrit le livre des Psaumes en majorité ?", a: "David", opts: ["David", "Salomon", "Moïse", "Samuel"] },
  { q: "Quel disciple était collecteur d'impôts ?", a: "Matthieu", opts: ["Matthieu", "Jean", "Pierre", "Jacques"] },
  { q: "Quel bois a utilisé Noé pour l'arche ?", a: "Gofer", opts: ["Gofer", "Cèdre", "Acacia", "Olivier"] },
  { q: "Quel personnage a vécu le plus vieux dans la Bible ?", a: "Mathusalem", opts: ["Mathusalem", "Noé", "Adam", "Abraham"] },
  { q: "Quel livre commence par 'Au commencement' ?", a: "Genèse", opts: ["Genèse", "Jean", "Exode", "Job"] },
  { q: "Combien de fils Jacob avait-il ?", a: "12", opts: ["12", "10", "11", "13"] },
  { q: "Qui a guéri 10 lépreux mais 1 seul est revenu ?", a: "Jésus", opts: ["Jésus", "Pierre", "Paul", "Élie"] },
  { q: "Quel disciple a mis le doigt dans les plaies du Christ ?", a: "Thomas", opts: ["Thomas", "Jean", "Pierre", "André"] },
  { q: "La femme de Loth s'est transformée en...", a: "Statue de sel", opts: ["Statue de sel", "Pilier de pierre", "Cendres", "Arbre"] },
];

// ─── SECRET KEY VERSES ────────────────────────────────────────────────────────
export const SECRET_KEY_VERSES = [
  { verse: "Je suis le chemin, la vérité et la ___", missing: "vie", ref: "Jean 14:6" },
  { verse: "L'Éternel est mon berger, je ne manquerai de ___", missing: "rien", ref: "Psaume 23:1" },
  { verse: "Car Dieu a tant aimé le monde qu'il a donné son ___ unique", missing: "Fils", ref: "Jean 3:16" },
  { verse: "Je puis tout par celui qui me ___", missing: "fortifie", ref: "Philippiens 4:13" },
  { verse: "Ta parole est une lampe à mes ___ et une lumière sur mon sentier", missing: "pieds", ref: "Psaume 119:105" },
  { verse: "Cherchez premièrement le royaume et la ___ de Dieu", missing: "justice", ref: "Matthieu 6:33" },
  { verse: "La foi sans les ___ est morte", missing: "œuvres", ref: "Jacques 2:26" },
  { verse: "L'amour ne fait point de mal au ___", missing: "prochain", ref: "Romains 13:10" },
  { verse: "Dieu est ___, et il faut que ceux qui l'adorent l'adorent en esprit", missing: "Esprit", ref: "Jean 4:24" },
  { verse: "Confie-toi en l'Éternel de tout ton ___", missing: "cœur", ref: "Proverbes 3:5" },
  { verse: "Que votre lumière luise devant les ___, afin qu'ils voient vos bonnes œuvres", missing: "hommes", ref: "Matthieu 5:16" },
  { verse: "Car c'est par la ___ que vous êtes sauvés, par le moyen de la foi", missing: "grâce", ref: "Éphésiens 2:8" },
];

// ─── GAME METADATA ────────────────────────────────────────────────────────────
export const GAMES_META = [
  { id: "speedrun",  icon: "⚡", label: "Bible Speedrun",  desc: "60s · max réponses · combos",     color: "#ff9f1c", tag: "COMPÉTITIF", xpMax: 200 },
  { id: "battle",    icon: "⚔️", label: "Bible Battle",    desc: "Toi vs IA · attaques spéciales",   color: "#e63946", tag: "COMBAT",     xpMax: 100 },
  { id: "bingo",     icon: "🎯", label: "Bible Bingo",     desc: "Grille 5×5 · lignes = bonus",      color: "#40916c", tag: "STRATÉGIE",  xpMax: 250 },
  { id: "escape",    icon: "🔐", label: "Bible Escape",    desc: "Énigmes · codes secrets",          color: "#7b2d8b", tag: "MYSTÈRE",    xpMax: 140 },
  { id: "memory",    icon: "🃏", label: "Bible Memory",    desc: "Retrouvez les paires",             color: "#2d8bb7", tag: "MÉMORIEL",   xpMax: 120 },
  { id: "secretkey", icon: "🗝️", label: "Clé Secrète",    desc: "1 verset/jour · 5 clés = coffre",  color: "#c9a84c", tag: "QUOTIDIEN",  xpMax: 30  },
];
