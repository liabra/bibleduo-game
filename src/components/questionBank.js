const questionBank = [
   // Questions classiques
  { question: "Jésus est-il né à Nazareth ?", type: "Vrai ou Faux", category: "Question", options: ["Vrai", "Faux", "Je ne sais pas"], correctAnswer: "Faux", reference: "Matthieu 2:1" },
  { question: "Quel âge avait la fille de Jaïrus lorsqu'elle a été ressuscitée par Jésus ?", type: "Complétion de Texte", category: "Question", options: [], correctAnswer: "12", reference: "Matthieu 9:18-26" },
  { question: "Combien de fois devons-nous pardonner, selon Jésus ?", type: "Complétion de Texte", category: "Question", options: [], correctAnswer: "77 fois 7 fois", reference: "Matthieu 18:22" },
  { question: "Combien de jours Jésus a-t-il jeûné dans le désert ?", type: "Complétion de Texte", category: "Question", options: [], correctAnswer: "40", reference: "Matthieu 4:2" },
  { question: "Combien de pains Jésus a-t-il utilisé pour nourrir les 5000 hommes ?", type: "Complétion de Texte", category: "Question", options: [], correctAnswer: "5", reference: "Matthieu 14:17" },
  { question: "Combien de frères Jésus avait-il, selon le livre de Matthieu ?", type: "Complétion de Texte", category: "Question", options: [], correctAnswer: "4", reference: "Matthieu 13:55" },
  { question: "Quel est le nom du disciple qui a trahi Jésus ?", type: "Complétion de Texte", category: "Question", options: [], correctAnswer: "Judas", reference: "Matthieu 26:14-16" },
  { question: "Dans quelle ville Jésus est-il né ?", type: "Complétion de Texte", category: "Question", options: [], correctAnswer: "Bethléem", reference: "Matthieu 2:1" },
  { question: "Quel est le premier mot du sermon sur la montagne ?", type: "Complétion de Texte", category: "Question", options: [], correctAnswer: "Heureux", reference: "Matthieu 5:3" },
  { question: "Combien de jours Jésus est-il resté dans le tombeau avant sa résurrection ?", type: "Complétion de Texte", category: "Question", options: [], correctAnswer: "3", reference: "Matthieu 12:40" },
  { question: "Combien de jours et de nuits Jésus a-t-il jeûné dans le désert ?", type: "Nombre", category: "Question", options: ["40", "30", "50", "Je ne sais pas"], correctAnswer: "40", reference: "Matthieu 4:2" },
  { question: "Jésus a-t-il été baptisé par Jean-Baptiste ?", type: "Oui ou Non", category: "Question", options: ["Oui", "Non", "Je ne sais pas"], correctAnswer: "Oui", reference: "Matthieu 3:13" },
  { question: "Jésus a-t-il multiplié les pains et les poissons pour nourrir la foule ?", type: "Vrai ou Faux", category: "Question", options: ["Vrai", "Faux", "Je ne sais pas"], correctAnswer: "Vrai", reference: "Matthieu 14:19-21" },
  { question: "Combien de disciples Jésus avait-il ?", type: "Nombre", category: "Question", options: ["12", "10", "11", "Je ne sais pas"], correctAnswer: "12", reference: "Matthieu 10:2-4" },
  { question: "Le premier sermon de Jésus est appelé le Sermon sur la Montagne ?", type: "Vrai ou Faux", category: "Question", options: ["Vrai", "Faux", "Je ne sais pas"], correctAnswer: "Vrai", reference: "Matthieu 5:1-2" },
  { question: "Combien de Béatitudes Jésus a-t-il enseignées dans le Sermon sur la Montagne ?", type: "Nombre", category: "Question", options: ["8", "6", "10", "Je ne sais pas"], correctAnswer: "8", reference: "Matthieu 5:3-10" },
  { question: "Jésus a-t-il marché sur l'eau ?", type: "Vrai ou Faux", category: "Question", options: ["Vrai", "Faux", "Je ne sais pas"], correctAnswer: "Vrai", reference: "Matthieu 14:25" },
  { question: "Qui a trahi Jésus pour trente pièces d'argent ?", type: "QCM", category: "Question", options: ["Pierre", "Jean", "Judas", "Je ne sais pas"], correctAnswer: "Judas", reference: "Matthieu 26:14-15" },
  { question: "Jésus a-t-il ressuscité Lazare des morts ?", type: "Vrai ou Faux", category: "Question", options: ["Vrai", "Faux", "Je ne sais pas"], correctAnswer: "Vrai", reference: "Jean 11:1-44" },
  { question: "Combien de fois Jésus a-t-il prédit sa propre mort et résurrection ?", type: "Nombre", category: "Question", options: ["1", "2", "3", "Je ne sais pas"], correctAnswer: "3", reference: "Matthieu 16:21, 17:22-23, 20:17-19" },
  { question: "Jésus a-t-il chassé les marchands du temple ?", type: "Vrai ou Faux", category: "Question", options: ["Vrai", "Faux", "Je ne sais pas"], correctAnswer: "Vrai", reference: "Matthieu 21:12" },
  { question: "Jésus a-t-il guéri un aveugle en lui touchant les yeux ?", type: "Vrai ou Faux", category: "Question", options: ["Vrai", "Faux", "Je ne sais pas"], correctAnswer: "Vrai", reference: "Matthieu 9:27-31" },
  { question: "Combien de paraboles sont contenues dans le livre de Matthieu ?", type: "Nombre", category: "Question", options: ["23", "15", "30", "Je ne sais pas"], correctAnswer: "23", reference: "Divers versets" },
  { question: "Le sermon sur la montagne comprend-il le Notre Père ?", type: "Vrai ou Faux", category: "Question", options: ["Vrai", "Faux", "Je ne sais pas"], correctAnswer: "Vrai", reference: "Matthieu 6:9-13" },
  { question: "Jésus a-t-il été tenté par le diable ?", type: "Oui ou Non", category: "Question", options: ["Oui", "Non", "Je ne sais pas"], correctAnswer: "Oui", reference: "Matthieu 4:1" },
  { question: "Jésus a-t-il dit : « Aimez vos ennemis » ?", type: "Oui ou Non", category: "Question", options: ["Oui", "Non", "Je ne sais pas"], correctAnswer: "Oui", reference: "Matthieu 5:44" },
  { question: "Combien de talents l'homme a-t-il reçu dans la parabole des talents ?", type: "QCM", category: "Question", options: ["1", "3", "5", "Je ne sais pas"], correctAnswer: "5", reference: "Matthieu 25:14-30" },
  { question: "Combien de vierges étaient sages dans la parabole des dix vierges ?", type: "Nombre", category: "Question", options: ["1", "3", "5", "Je ne sais pas"], correctAnswer: "5", reference: "Matthieu 25:2" },
  { question: "Jésus a-t-il enseigné de prier en secret ?", type: "Vrai ou Faux", category: "Question", options: ["Vrai", "Faux", "Je ne sais pas"], correctAnswer: "Vrai", reference: "Matthieu 6:6" },
  { question: "Combien de fois devons-nous pardonner, selon Jésus ?", type: "Nombre", category: "Question", options: ["7 fois 9 fois", "70 fois 2 fois", "77 fois 7 fois", "Je ne sais pas"], correctAnswer: "77 fois 7 fois", reference: "Matthieu 18:22" },
  { question: "Jésus a-t-il été transfiguré sur une haute montagne ?", type: "Vrai ou Faux", category: "Question", options: ["Vrai", "Faux", "Je ne sais pas"], correctAnswer: "Vrai", reference: "Matthieu 17:1-2" },
  // Devinette.
  { 
    question: "Je suis le roi qui a construit le premier temple à Jérusalem. Qui suis-je ?", 
    type: "QCM", 
    category: "Devinette", 
    options: ["David", "Salomon", "Saül", "Je ne sais pas"], 
    correctAnswer: "Salomon", 
    reference: "1 Rois 6:1" 
  },
  { 
    question: "Je suis l'animal qui a parlé à Balaam. Qui suis-je ?", 
    type: "QCM", 
    category: "Devinette", 
    options: ["Âne", "Chien", "Cheval", "Je ne sais pas"], 
    correctAnswer: "Âne", 
    reference: "Nombres 22:28" 
  },
  { 
    question: "Quel prophète a été avalé par un grand poisson ?", 
    type: "QCM", 
    category: "Devinette", 
    options: ["Jonas", "Ésaïe", "Élie", "Je ne sais pas"], 
    correctAnswer: "Jonas", 
    reference: "Jonas 1:17" 
  },
  { 
    question: "Je suis le premier livre de la Bible. Qui suis-je ?", 
    type: "QCM", 
    category: "Devinette", 
    options: ["Genèse", "Exode", "Lévitique", "Je ne sais pas"], 
    correctAnswer: "Genèse", 
    reference: "Genèse 1:1" 
  },
  {
    question: "Je suis la ville où Paul s’est rendu pour prêcher, mais où il a été accueilli par des philosophes sur la colline de l'Aréopage. Quelle ville suis-je ?", 
    type: "Devinette", 
    options: ["Athènes", "Rome", "Corinthe", "Jérusalem"], 
    correctAnswer: "Athènes", 
    reference: "Actes 17:22-23"
  },
  {
    question: "J’ai été jeté dans une fosse aux lions pour ma foi, mais Dieu m’a sauvé. Qui suis-je ?", 
    type: "Devinette", 
    options: ["David", "Daniel", "Élie", "Samuel"], 
    correctAnswer: "Daniel", 
    reference: "Daniel 6:16-23"
  },
  {
    question: "Je suis une reine célèbre pour ma sagesse et ma visite au roi Salomon. Qui suis-je ?", 
    type: "Devinette", 
    options: ["La reine de Saba", "La reine Esther", "Débora", "Jézabel"], 
    correctAnswer: "La reine de Saba", 
    reference: "1 Rois 10:1-13"
  },
  {
    question: "Je suis le prophète qui a vu un chariot de feu emporter mon maître dans les cieux. Qui suis-je ?", 
    type: "Devinette", 
    options: ["Ésaïe", "Élie", "Élisée", "Jérémie"], 
    correctAnswer: "Élisée", 
    reference: "2 Rois 2:11-12"
  },
  {
    question: "Je suis l’homme qui a construit une arche pour sauver sa famille et les animaux d’un déluge. Qui suis-je ?", 
    type: "Devinette", 
    options: ["Moïse", "Noé", "Abraham", "Job"], 
    correctAnswer: "Noé", 
    reference: "Genèse 6:13-22"
  },
  {
    question: "J’ai été appelé par Dieu pour libérer les Israélites d’Égypte, mais je balbutiais beaucoup. Qui suis-je ?", 
    type: "Devinette", 
    options: ["Moïse", "Aaron", "Josué", "Samuel"], 
    correctAnswer: "Moïse", 
    reference: "Exode 3:10-12"
  },
  {
    question: "Je suis la femme qui a prié intensément pour avoir un enfant et a promis de le consacrer à Dieu. Qui suis-je ?", 
    type: "Devinette", 
    options: ["Anne", "Sarah", "Rachel", "Élisabeth"], 
    correctAnswer: "Anne", 
    reference: "1 Samuel 1:10-11"
  },
  {
    question: "Je suis le lieu où Jésus a prié juste avant son arrestation. Quel est mon nom ?", 
    type: "Devinette", 
    options: ["Golgotha", "Nazareth", "Gethsémani", "Béthanie"], 
    correctAnswer: "Gethsémani", 
    reference: "Matthieu 26:36"
  },
  {
    question: "Je suis l’homme qui a été rendu aveugle sur le chemin de Damas avant de devenir un apôtre. Qui suis-je ?", 
    type: "Devinette", 
    options: ["Paul", "Pierre", "Jean", "Jacques"], 
    correctAnswer: "Paul", 
    reference: "Actes 9:3-9"
  },
  {
    question: "Je suis une tour célèbre qui a été construite pour atteindre le ciel, mais Dieu a confondu les langues. Quel est mon nom ?", 
    type: "Devinette", 
    options: ["Tour de Jéricho", "Tour de Babel", "Tour de Siloé", "Tour de David"], 
    correctAnswer: "Tour de Babel", 
    reference: "Genèse 11:1-9"
  },
  {
    question: "Je suis le prophète qui a été nourri par des corbeaux près d’un ruisseau. Qui suis-je ?", 
    type: "Devinette", 
    options: ["Ésaïe", "Ézéchiel", "Élie", "Amos"], 
    correctAnswer: "Élie", 
    reference: "1 Rois 17:2-6"
  },
  {
    question: "Je suis le roi qui a fait jeter trois hommes dans une fournaise ardente pour ne pas avoir adoré une statue. Qui suis-je ?", 
    type: "Devinette", 
    options: ["Saül", "Nabuchodonosor", "Darius", "Hérode"], 
    correctAnswer: "Nabuchodonosor", 
    reference: "Daniel 3:19-23"
  },
  {
    question: "Je suis le nom de la montagne où Moïse a reçu les dix commandements. Quelle est cette montagne ?", 
    type: "Devinette", 
    options: ["Mont Sinaï", "Mont Hermon", "Mont des Oliviers", "Mont Horeb"], 
    correctAnswer: "Mont Sinaï", 
    reference: "Exode 19:18-20"
  },
  {
    question: "Je suis la seule femme jugée dans l’Ancien Testament, connue pour sa sagesse et sa direction. Qui suis-je ?", 
    type: "Devinette", 
    options: ["Esther", "Débora", "Jaël", "Abigaïl"], 
    correctAnswer: "Débora", 
    reference: "Juges 4:4-5"
  },
  {
    question: "Je suis le fils qui a demandé son héritage et a quitté la maison pour vivre dans le péché avant de revenir repentant. Qui suis-je ?", 
    type: "Devinette", 
    options: ["Le fils prodigue", "Caïn", "Absalom", "Samson"], 
    correctAnswer: "Le fils prodigue", 
    reference: "Luc 15:11-32"
  },
  { 
    question: "Je suis le fils qui a demandé son héritage et a quitté la maison pour vivre dans le péché avant de revenir repentant. Qui suis-je ?", 
      type: "Devinette", 
      options: ["Le fils prodigue", "Caïn", "Absalom", "Samson"], 
      correctAnswer: "Le fils prodigue", 
      reference: "Luc 15:11-32" 
  }
  
  
];


export default questionBank;
