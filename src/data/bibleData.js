// ─── BIBLE LOUIS SEGOND 1910 (domaine public) ─────────────────────────────
// Sélection représentative de versets pour la génération de questions

const BIBLE_VERSES = [
  // Genèse
  { ref:"Genèse 1:1",     text:"Au commencement, Dieu créa les cieux et la terre.",           book:"Genèse",     testament:"AT" },
  { ref:"Genèse 1:27",    text:"Dieu créa l'homme à son image, il le créa à l'image de Dieu, il créa l'homme et la femme.", book:"Genèse", testament:"AT" },
  { ref:"Genèse 2:7",     text:"L'Éternel Dieu forma l'homme de la poussière de la terre, il souffla dans ses narines un souffle de vie.", book:"Genèse", testament:"AT" },
  { ref:"Genèse 3:15",    text:"Je mettrai inimitié entre toi et la femme, entre ta postérité et sa postérité.",              book:"Genèse",     testament:"AT" },
  { ref:"Genèse 6:14",    text:"Fais-toi une arche en bois de gofer.",                        book:"Genèse",     testament:"AT" },
  { ref:"Genèse 12:1",    text:"L'Éternel dit à Abram : Va-t'en de ton pays, de ta patrie, et de la maison de ton père.",    book:"Genèse",     testament:"AT" },
  { ref:"Genèse 22:2",    text:"Dieu dit : Prends ton fils, ton unique, celui que tu aimes, Isaac.",                          book:"Genèse",     testament:"AT" },
  { ref:"Genèse 50:20",   text:"Vous aviez médité de me faire du mal : Dieu l'a changé en bien.",                            book:"Genèse",     testament:"AT" },
  // Exode
  { ref:"Exode 3:14",     text:"Dieu dit à Moïse : Je suis celui qui suis.",                  book:"Exode",      testament:"AT" },
  { ref:"Exode 20:3",     text:"Tu n'auras pas d'autres dieux devant ma face.",               book:"Exode",      testament:"AT" },
  { ref:"Exode 14:21",    text:"Moïse étendit sa main sur la mer. Et l'Éternel refoula la mer par un vent d'orient.", book:"Exode", testament:"AT" },
  // Psaumes
  { ref:"Psaume 1:1",     text:"Heureux l'homme qui ne marche pas selon le conseil des méchants.",                           book:"Psaumes",    testament:"AT" },
  { ref:"Psaume 23:1",    text:"L'Éternel est mon berger : je ne manquerai de rien.",         book:"Psaumes",    testament:"AT" },
  { ref:"Psaume 23:4",    text:"Quand je marche dans la vallée de l'ombre de la mort, je ne crains aucun mal.",              book:"Psaumes",    testament:"AT" },
  { ref:"Psaume 46:2",    text:"Dieu est pour nous un refuge et un appui, un secours qui ne manque jamais dans la détresse.", book:"Psaumes",   testament:"AT" },
  { ref:"Psaume 100:3",   text:"Sachez que l'Éternel est Dieu ! C'est lui qui nous a faits, et nous lui appartenons.", book:"Psaumes", testament:"AT" },
  { ref:"Psaume 119:105", text:"Ta parole est une lampe à mes pieds, et une lumière sur mon sentier.",                       book:"Psaumes",    testament:"AT" },
  { ref:"Psaume 139:14",  text:"Je te loue de ce que je suis une créature si merveilleuse.",  book:"Psaumes",    testament:"AT" },
  // Proverbes
  { ref:"Proverbes 3:5",  text:"Confie-toi en l'Éternel de tout ton cœur, et ne t'appuie pas sur ta sagesse.",              book:"Proverbes",  testament:"AT" },
  { ref:"Proverbes 3:6",  text:"Reconnais-le dans toutes tes voies, et il aplanira tes sentiers.",                           book:"Proverbes",  testament:"AT" },
  { ref:"Proverbes 4:23", text:"Garde ton cœur plus que toute autre chose, car de lui viennent les sources de la vie.",      book:"Proverbes",  testament:"AT" },
  // Ésaïe
  { ref:"Ésaïe 40:31",    text:"Ceux qui se confient en l'Éternel renouvellent leur force. Ils prennent le vol comme les aigles.", book:"Ésaïe", testament:"AT" },
  { ref:"Ésaïe 53:5",     text:"Mais il était blessé pour nos péchés, brisé pour nos iniquités.",                           book:"Ésaïe",      testament:"AT" },
  { ref:"Ésaïe 9:5",      text:"Car un enfant nous est né, un fils nous est donné.",          book:"Ésaïe",      testament:"AT" },
  // Jérémie
  { ref:"Jérémie 29:11",  text:"Car je connais les projets que j'ai formés sur vous, dit l'Éternel, projets de paix et non de malheur.", book:"Jérémie", testament:"AT" },
  // Matthieu
  { ref:"Matthieu 5:3",   text:"Heureux les pauvres en esprit, car le royaume des cieux est à eux !",                       book:"Matthieu",   testament:"NT" },
  { ref:"Matthieu 5:9",   text:"Heureux les artisans de paix, car ils seront appelés fils de Dieu !",                       book:"Matthieu",   testament:"NT" },
  { ref:"Matthieu 6:9",   text:"Voici donc comment vous devez prier : Notre Père qui es aux cieux !",                       book:"Matthieu",   testament:"NT" },
  { ref:"Matthieu 6:33",  text:"Cherchez premièrement le royaume et la justice de Dieu ; et toutes ces choses vous seront données par-dessus.", book:"Matthieu", testament:"NT" },
  { ref:"Matthieu 11:28", text:"Venez à moi, vous tous qui êtes fatigués et chargés, et je vous donnerai du repos.",         book:"Matthieu",   testament:"NT" },
  { ref:"Matthieu 22:37", text:"Tu aimeras le Seigneur, ton Dieu, de tout ton cœur, de toute ton âme, et de toute ta pensée.", book:"Matthieu", testament:"NT" },
  { ref:"Matthieu 28:19", text:"Allez, faites de toutes les nations des disciples, les baptisant au nom du Père, du Fils et du Saint-Esprit.", book:"Matthieu", testament:"NT" },
  // Marc
  { ref:"Marc 10:27",     text:"Cela est impossible aux hommes, mais non à Dieu, car tout est possible à Dieu.",            book:"Marc",       testament:"NT" },
  { ref:"Marc 16:15",     text:"Allez dans le monde entier, et prêchez la bonne nouvelle à toute la création.",             book:"Marc",       testament:"NT" },
  // Luc
  { ref:"Luc 1:37",       text:"Rien n'est impossible à Dieu.",                               book:"Luc",        testament:"NT" },
  { ref:"Luc 15:7",       text:"Je vous dis qu'il y aura plus de joie dans le ciel pour un seul pécheur qui se repent.", book:"Luc", testament:"NT" },
  { ref:"Luc 19:10",      text:"Car le Fils de l'homme est venu chercher et sauver ce qui était perdu.",                    book:"Luc",        testament:"NT" },
  // Jean
  { ref:"Jean 1:1",       text:"Au commencement était la Parole, et la Parole était avec Dieu, et la Parole était Dieu.",   book:"Jean",       testament:"NT" },
  { ref:"Jean 1:14",      text:"Et la Parole a été faite chair, et elle a habité parmi nous.",book:"Jean",       testament:"NT" },
  { ref:"Jean 3:16",      text:"Car Dieu a tant aimé le monde qu'il a donné son Fils unique, afin que quiconque croit en lui ne périsse point.", book:"Jean", testament:"NT" },
  { ref:"Jean 8:12",      text:"Je suis la lumière du monde. Celui qui me suit ne marchera pas dans les ténèbres.",         book:"Jean",       testament:"NT" },
  { ref:"Jean 10:10",     text:"Je suis venu afin que les brebis aient la vie, et qu'elles soient dans l'abondance.",       book:"Jean",       testament:"NT" },
  { ref:"Jean 10:11",     text:"Je suis le bon berger. Le bon berger donne sa vie pour ses brebis.",                        book:"Jean",       testament:"NT" },
  { ref:"Jean 11:25",     text:"Je suis la résurrection et la vie. Celui qui croit en moi vivra, quand même il serait mort.", book:"Jean",     testament:"NT" },
  { ref:"Jean 14:6",      text:"Je suis le chemin, la vérité, et la vie. Nul ne vient au Père que par moi.",                book:"Jean",       testament:"NT" },
  { ref:"Jean 15:5",      text:"Je suis le cep, vous êtes les sarments. Celui qui demeure en moi et en qui je demeure porte beaucoup de fruit.", book:"Jean", testament:"NT" },
  { ref:"Jean 16:33",     text:"Dans le monde vous aurez des tribulations ; mais prenez courage, j'ai vaincu le monde.",    book:"Jean",       testament:"NT" },
  // Actes
  { ref:"Actes 1:8",      text:"Vous recevrez une puissance, le Saint-Esprit survenant sur vous, et vous serez mes témoins.", book:"Actes",    testament:"NT" },
  { ref:"Actes 2:38",     text:"Repentez-vous, et que chacun de vous soit baptisé au nom de Jésus-Christ.",                 book:"Actes",      testament:"NT" },
  // Romains
  { ref:"Romains 1:16",   text:"Je n'ai pas honte de l'Évangile de Christ ; car c'est une puissance de Dieu pour le salut de quiconque croit.", book:"Romains", testament:"NT" },
  { ref:"Romains 3:23",   text:"Car tous ont péché et sont privés de la gloire de Dieu.",    book:"Romains",    testament:"NT" },
  { ref:"Romains 5:8",    text:"Mais Dieu prouve son amour envers nous, en ce que, lorsque nous étions encore des pécheurs, Christ est mort pour nous.", book:"Romains", testament:"NT" },
  { ref:"Romains 6:23",   text:"Car le salaire du péché, c'est la mort ; mais le don gratuit de Dieu, c'est la vie éternelle.", book:"Romains", testament:"NT" },
  { ref:"Romains 8:28",   text:"Nous savons, du reste, que toutes choses concourent au bien de ceux qui aiment Dieu.",      book:"Romains",    testament:"NT" },
  { ref:"Romains 8:38",   text:"Ni mort, ni vie, ni anges, ni dominations, rien ne pourra nous séparer de l'amour de Dieu.", book:"Romains",  testament:"NT" },
  { ref:"Romains 10:9",   text:"Si tu confesses de ta bouche le Seigneur Jésus, et si tu crois dans ton cœur que Dieu l'a ressuscité des morts, tu seras sauvé.", book:"Romains", testament:"NT" },
  { ref:"Romains 12:2",   text:"Ne vous conformez pas au siècle présent, mais soyez transformés par le renouvellement de l'intelligence.", book:"Romains", testament:"NT" },
  // Galates
  { ref:"Galates 2:20",   text:"Ce n'est plus moi qui vis, c'est Christ qui vit en moi.",    book:"Galates",    testament:"NT" },
  { ref:"Galates 5:22",   text:"Le fruit de l'Esprit, c'est l'amour, la joie, la paix, la patience, la bonté, la bénignité, la fidélité.", book:"Galates", testament:"NT" },
  // Éphésiens
  { ref:"Éphésiens 2:8",  text:"Car c'est par la grâce que vous êtes sauvés, par le moyen de la foi. Et cela ne vient pas de vous, c'est le don de Dieu.", book:"Éphésiens", testament:"NT" },
  { ref:"Éphésiens 3:20", text:"Or, à celui qui peut faire infiniment au-delà de tout ce que nous demandons ou pensons, selon la puissance qui agit en nous.", book:"Éphésiens", testament:"NT" },
  { ref:"Éphésiens 6:11", text:"Revêtez-vous de toutes les armes de Dieu, afin de pouvoir tenir ferme contre les ruses du diable.", book:"Éphésiens", testament:"NT" },
  // Philippiens
  { ref:"Philippiens 4:4",  text:"Réjouissez-vous toujours dans le Seigneur ; je le dis encore, réjouissez-vous.",          book:"Philippiens", testament:"NT" },
  { ref:"Philippiens 4:7",  text:"La paix de Dieu, qui surpasse toute intelligence, gardera vos cœurs et vos pensées en Jésus-Christ.", book:"Philippiens", testament:"NT" },
  { ref:"Philippiens 4:13", text:"Je puis tout par celui qui me fortifie.",                  book:"Philippiens", testament:"NT" },
  // Colossiens
  { ref:"Colossiens 3:17",  text:"Et quoi que vous fassiez, en parole ou en œuvre, faites tout au nom du Seigneur Jésus.",  book:"Colossiens", testament:"NT" },
  // 1 Timothée
  { ref:"1 Timothée 4:8",   text:"L'exercice corporel est utile à peu de chose, mais la piété est utile à tout.", book:"1 Timothée", testament:"NT" },
  // Hébreux
  { ref:"Hébreux 11:1",     text:"Or la foi est une ferme assurance des choses qu'on espère, une démonstration de celles qu'on ne voit pas.", book:"Hébreux", testament:"NT" },
  { ref:"Hébreux 13:8",     text:"Jésus-Christ est le même hier, aujourd'hui, et éternellement.",                           book:"Hébreux",    testament:"NT" },
  // Jacques
  { ref:"Jacques 1:2",      text:"Mes frères, regardez comme un sujet de joie complète les diverses épreuves auxquelles vous pouvez être exposés.", book:"Jacques", testament:"NT" },
  { ref:"Jacques 2:26",     text:"De même que le corps sans âme est mort, de même la foi sans les œuvres est morte.",       book:"Jacques",    testament:"NT" },
  // 1 Pierre
  { ref:"1 Pierre 5:7",     text:"Déchargez-vous sur lui de tous vos soucis, car lui-même prend soin de vous.",             book:"1 Pierre",   testament:"NT" },
  // 1 Jean
  { ref:"1 Jean 1:9",       text:"Si nous confessons nos péchés, il est fidèle et juste pour nous les pardonner.",          book:"1 Jean",     testament:"NT" },
  { ref:"1 Jean 4:8",       text:"Celui qui n'aime pas n'a pas connu Dieu, car Dieu est amour.",                            book:"1 Jean",     testament:"NT" },
  // Apocalypse
  { ref:"Apocalypse 3:20",  text:"Voici, je me tiens à la porte, et je frappe. Si quelqu'un entend ma voix et ouvre la porte, j'entrerai chez lui.", book:"Apocalypse", testament:"NT" },
  { ref:"Apocalypse 21:4",  text:"Il essuiera toute larme de leurs yeux, et la mort ne sera plus.",                         book:"Apocalypse", testament:"NT" },
  { ref:"Apocalypse 22:13", text:"Je suis l'alpha et l'oméga, le premier et le dernier, le commencement et la fin.",        book:"Apocalypse", testament:"NT" },
];

// ─── KNOWLEDGE BASE for question generation ────────────────────────────────
// Characters, events, numbers used across question templates
const BIBLE_FACTS = [
  { question:"Qui a écrit la majorité des Psaumes ?",             answer:"David",         wrong:["Salomon","Moïse","Samuel"],            hint:"Roi-musicien d'Israël" },
  { question:"Combien de livres dans le Nouveau Testament ?",     answer:"27",            wrong:["24","30","33"],                        hint:"39 AT + 27 NT = 66" },
  { question:"Combien de livres dans l'Ancien Testament ?",       answer:"39",            wrong:["36","40","45"],                        hint:"39 AT + 27 NT = 66" },
  { question:"Quelle tribu Jésus descend-il ?",                   answer:"Juda",          wrong:["Lévi","Benjamin","Ruben"],             hint:"Lion de Juda" },
  { question:"Quel disciple était médecin ?",                     answer:"Luc",           wrong:["Jean","Marc","Paul"],                 hint:"Il a écrit un Évangile et les Actes" },
  { question:"Qui a écrit l'Évangile de Jean ?",                  answer:"Jean",          wrong:["Pierre","Paul","Jacques"],            hint:"Le disciple bien-aimé" },
  { question:"Dans quelle langue l'AT a-t-il été principalement écrit ?", answer:"Hébreu", wrong:["Grec","Araméen","Latin"],           hint:"Langue de l'Israël antique" },
  { question:"Dans quelle langue le NT a-t-il été principalement écrit ?", answer:"Grec",  wrong:["Hébreu","Latin","Araméen"],         hint:"Langue internationale de l'Empire romain" },
  { question:"Combien de frères avait Joseph en Égypte ?",        answer:"11",            wrong:["10","12","9"],                        hint:"Jacob avait 12 fils au total" },
  { question:"Quel est le livre le plus long de la Bible ?",       answer:"Psaumes",      wrong:["Genèse","Ésaïe","Jérémie"],          hint:"150 chapitres" },
  { question:"Quel est le livre le plus court de la Bible ?",      answer:"3 Jean",       wrong:["Philémon","Abdias","2 Jean"],         hint:"Seulement 14 versets" },
  { question:"Qui a remplacé Judas parmi les apôtres ?",          answer:"Matthias",      wrong:["Paul","Barnabas","Silas"],            hint:"Choisi par tirage au sort" },
  { question:"Combien d'années Israël a erré dans le désert ?",   answer:"40",            wrong:["30","20","50"],                       hint:"Comme Moïse avait passé 40 ans au désert" },
  { question:"Qui a construit le premier autel après le déluge ?", answer:"Noé",          wrong:["Abraham","Moïse","Aaron"],            hint:"Il avait l'arche" },
  { question:"Quel apôtre a été lapidé en premier ?",             answer:"Étienne",       wrong:["Jacques","Pierre","Paul"],            hint:"On l'appelle le premier martyr chrétien" },
  { question:"Dans quelle ville Jésus a-t-il grandi ?",           answer:"Nazareth",      wrong:["Bethléem","Capharnaüm","Jérusalem"],  hint:"Jésus de ___" },
  { question:"Quel ange a annoncé la naissance de Jésus à Marie ?", answer:"Gabriel",     wrong:["Michel","Raphaël","Uriel"],           hint:"Il est aussi l'ange de Daniel" },
  { question:"Combien de paniers restèrent après la multiplication ?", answer:"12",        wrong:["7","5","3"],                         hint:"Un par apôtre" },
  { question:"Quelle profession avait Paul avant d'être apôtre ?", answer:"Fabricant de tentes", wrong:["Pêcheur","Médecin","Berger"], hint:"Métier manuel qu'il continua" },
  { question:"Quel prophète a prédit la naissance d'un Fils à une vierge ?", answer:"Ésaïe", wrong:["Michée","Jérémie","Daniel"],     hint:"Chapitre 7:14" },
  { question:"À Béthanie, qui Jésus a-t-il ressuscité ?",         answer:"Lazare",        wrong:["Jaïrus","Tabitha","Eutychus"],        hint:"Frère de Marie et Marthe" },
  { question:"Quel était le nom du père de Jean-Baptiste ?",      answer:"Zacharie",      wrong:["Élisée","Siméon","Joseph"],           hint:"Il devint muet après l'annonce de l'ange" },
  { question:"Quel roi a construit le Temple à Jérusalem ?",      answer:"Salomon",       wrong:["David","Josias","Ézéchias"],          hint:"Fils de David" },
  { question:"Combien de jours le monde fut-il inondé avant que les eaux se retirent ?", answer:"150", wrong:["40","100","365"],       hint:"La pluie dura 40 jours, l'eau resta plus longtemps" },
  { question:"Quel fruit Ève a-t-elle mangé selon le texte biblique ?", answer:"Fruit défendu", wrong:["Pomme","Figue","Grenade"],    hint:"La Bible ne précise pas l'espèce" },
];

// ─── FILL-IN-THE-BLANK GENERATOR ──────────────────────────────────────────
// Creates completion questions from Bible verses
const generateVerseQuestion = (verse) => {
  const words = verse.text.split(' ').filter(w => w.length > 4);
  if (words.length === 0) return null;
  // Pick a meaningful word (not the first 3 words)
  const allWords = verse.text.split(' ');
  const candidates = allWords.filter((w, i) => i > 2 && w.replace(/[,;:.!?«»]/g,'').length > 4);
  if (candidates.length === 0) return null;
  const target = candidates[Math.floor(Math.random() * candidates.length)];
  const clean = target.replace(/[,;:.!?«»]/g, '');
  const display = verse.text.replace(target, '___');
  return {
    q:    `Complète ce verset (${verse.ref}) : « ${display} »`,
    a:    clean,
    type: 'text',
    hint: `Référence : ${verse.ref} — ${verse.book}`,
  };
};

// ─── MULTIPLE CHOICE GENERATOR from BIBLE_FACTS ───────────────────────────
const generateFactQuestion = (fact, allFacts) => {
  return {
    q:    fact.question,
    a:    fact.answer,
    type: 'mc',
    opts: shuffleArr([fact.answer, ...fact.wrong]),
    hint: fact.hint,
  };
};

const shuffleArr = (arr) => [...arr].sort(() => Math.random() - 0.5);

// ─── QUESTION POOL BUILDER ─────────────────────────────────────────────────
// Returns a fresh pool of N questions mixing verse completions + fact QCMs
const buildQuestionPool = (n = 20) => {
  const pool = [];

  // ~40% verse completion
  const verses = [...BIBLE_VERSES].sort(() => Math.random() - 0.5).slice(0, Math.ceil(n * 0.4));
  for (const v of verses) {
    const q = generateVerseQuestion(v);
    if (q) pool.push(q);
  }

  // ~60% fact QCMs
  const facts = [...BIBLE_FACTS].sort(() => Math.random() - 0.5).slice(0, Math.ceil(n * 0.6));
  for (const f of facts) {
    pool.push(generateFactQuestion(f));
  }

  return shuffleArr(pool).slice(0, n);
};

module.exports = { BIBLE_VERSES, BIBLE_FACTS };
