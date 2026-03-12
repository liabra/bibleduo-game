const questionBank = [
  // Questions "Vrai ou Faux"
  { 
    question: "Jésus est-il né à Nazareth ?", 
    type: "Vrai ou Faux", 
    category: "Questions", 
    options: ["Vrai", "Faux", "Je ne sais pas"], 
    correctAnswer: "Faux", 
    reference: "Matthieu 2:1" 
  },
  { 
    "question": "Jésus est-il né à Nazareth ?", 
    "type": "Vrai ou Faux", 
    "category": "Questions", 
    "options": ["Vrai", "Faux", "Je ne sais pas"], 
    "correctAnswer": "Faux", 
    "reference": "Matthieu 2:1" 
  },
  { 
    "question": "Moïse a construit l'arche de Noé.", 
    "type": "Vrai ou Faux", 
    "category": "Questions", 
    "options": ["Vrai", "Faux", "Je ne sais pas"], 
    "correctAnswer": "Faux", 
    "reference": "Genèse 6:14-22" 
  },
  { 
    "question": "Paul était l'un des douze premiers disciples de Jésus.", 
    "type": "Vrai ou Faux", 
    "category": "Questions", 
    "options": ["Vrai", "Faux", "Je ne sais pas"], 
    "correctAnswer": "Faux", 
    "reference": "Actes 9:1-19" 
  },
  { 
    "question": "Jésus a multiplié cinq pains et deux poissons pour nourrir une foule.", 
    "type": "Vrai ou Faux", 
    "category": "Questions", 
    "options": ["Vrai", "Faux", "Je ne sais pas"], 
    "correctAnswer": "Vrai", 
    "reference": "Matthieu 14:13-21" 
  },
  { 
    "question": "Le premier miracle de Jésus fut de guérir un aveugle.", 
    "type": "Vrai ou Faux", 
    "category": "Questions", 
    "options": ["Vrai", "Faux", "Je ne sais pas"], 
    "correctAnswer": "Faux", 
    "reference": "Jean 2:1-11" 
  },
  { 
    "question": "David a tué Goliath avec une épée.", 
    "type": "Vrai ou Faux", 
    "category": "Questions", 
    "options": ["Vrai", "Faux", "Je ne sais pas"], 
    "correctAnswer": "Faux", 
    "reference": "1 Samuel 17:50" 
  },
  { 
    "question": "La Bible est composée de 66 livres.", 
    "type": "Vrai ou Faux", 
    "category": "Questions", 
    "options": ["Vrai", "Faux", "Je ne sais pas"], 
    "correctAnswer": "Vrai", 
    "reference": "2 Timothée 3:16" 
  },
  { 
    "question": "Jean-Baptiste était un disciple de Jésus.", 
    "type": "Vrai ou Faux", 
    "category": "Questions", 
    "options": ["Vrai", "Faux", "Je ne sais pas"], 
    "correctAnswer": "Faux", 
    "reference": "Jean 1:6-8" 
  },
  { 
    "question": "L'Apocalypse est le premier livre du Nouveau Testament.", 
    "type": "Vrai ou Faux", 
    "category": "Questions", 
    "options": ["Vrai", "Faux", "Je ne sais pas"], 
    "correctAnswer": "Faux", 
    "reference": "Matthieu 1:1" 
  },
  { 
    "question": "Jésus a été baptisé dans le Jourdain par Jean-Baptiste.", 
    "type": "Vrai ou Faux", 
    "category": "Questions", 
    "options": ["Vrai", "Faux", "Je ne sais pas"], 
    "correctAnswer": "Vrai", 
    "reference": "Matthieu 3:13-17" 
  },
  {
    question: "Jésus a transformé l'eau en vin lors d'une noce à Cana.",
    type: "Vrai ou Faux",
    category: "Questions",
    options: ["Vrai", "Faux", "Je ne sais pas"],
    correctAnswer: "Vrai",
    reference: "Jean 2:1-11"
  },
  {
    question: "Moïse a conduit les Israélites à travers la mer Rouge en construisant un pont.",
    type: "Vrai ou Faux",
    category: "Questions",
    options: ["Vrai", "Faux", "Je ne sais pas"],
    correctAnswer: "Faux",
    reference: "Exode 14:21-22"
  },
  {
    question: "David était le père de Salomon.",
    type: "Vrai ou Faux",
    category: "Questions",
    options: ["Vrai", "Faux", "Je ne sais pas"],
    correctAnswer: "Vrai",
    reference: "1 Rois 1:30"
  },
  {
    question: "Jésus a écrit un livre dans le Nouveau Testament.",
    type: "Vrai ou Faux",
    category: "Questions",
    options: ["Vrai", "Faux", "Je ne sais pas"],
    correctAnswer: "Faux",
    reference: "Aucun passage"
  },
  {
    question: "Paul était l'un des douze premiers disciples de Jésus.",
    type: "Vrai ou Faux",
    category: "Questions",
    options: ["Vrai", "Faux", "Je ne sais pas"],
    correctAnswer: "Faux",
    reference: "Actes 9:1-19"
  },

  // Questions "Complétion de Texte"
  { 
    question: "Quel âge avait la fille de Jaïrus lorsqu'elle a été ressuscitée par Jésus ?", 
    type: "Complétion de Texte", 
    category: "Questions", 
    options: [], 
    correctAnswer: "12", 
    reference: "Marc 5:42" 
  },
  { 
    "question": "Quel âge avait la fille de Jaïrus lorsqu'elle a été ressuscitée par Jésus ?", 
    "type": "Complétion de Texte", 
    "category": "Questions", 
    "options": [], 
    "correctAnswer": "12", 
    "reference": "Marc 5:42" 
  },
  { 
    "question": "Jésus a pleuré à la mort de son ami _____.", 
    "type": "Complétion de Texte", 
    "category": "Questions", 
    "options": [], 
    "correctAnswer": "Lazare", 
    "reference": "Jean 11:35" 
  },
  { 
    "question": "Jésus a été trahi par _____.", 
    "type": "Complétion de Texte", 
    "category": "Questions", 
    "options": [], 
    "correctAnswer": "Judas", 
    "reference": "Matthieu 26:14-16" 
  },
  { 
    "question": "Le premier livre de la Bible est _____.", 
    "type": "Complétion de Texte", 
    "category": "Questions", 
    "options": [], 
    "correctAnswer": "Genèse", 
    "reference": "Genèse 1:1" 
  },
  { 
    "question": "Le fruit défendu a été mangé par _____.", 
    "type": "Complétion de Texte", 
    "category": "Questions", 
    "options": [], 
    "correctAnswer": "Ève", 
    "reference": "Genèse 3:6" 
  },
  { 
    question: "Dans quelle ville Jésus est-il né ?", 
    type: "Complétion de Texte", 
    category: "Questions", 
    options: [], 
    correctAnswer: "Bethléem", 
    reference: "Matthieu 2:1" 
  },

  // Questions "Nombres"
  { 
    question: "Combien de fois devons-nous pardonner, selon Jésus ?", 
    type: "Nombre", 
    category: "Nombres", 
    options: ["7 fois", "77 fois 7 fois", "70 fois 7 fois", "Je ne sais pas"], 
    correctAnswer: "77 fois 7 fois", 
    reference: "Matthieu 18:22" 
  },
  { 
    "question": "Combien de pains et de poissons Jésus a-t-il multipliés pour nourrir la foule ?", 
    "type": "Nombre", 
    "category": "Nombres", 
    "options": ["5 pains et 2 poissons", "3 pains et 5 poissons", "7 pains et 3 poissons", "Je ne sais pas"], 
    "correctAnswer": "5 pains et 2 poissons", 
    "reference": "Matthieu 14:17-21" 
  },
  { 
    "question": "Combien de commandements Dieu a-t-il donnés à Moïse sur le mont Sinaï ?", 
    "type": "Nombre", 
    "category": "Nombres", 
    "options": ["5", "10", "12", "Je ne sais pas"], 
    "correctAnswer": "10", 
    "reference": "Exode 20:1-17" 
  },
  { 
    "question": "Combien de jours a duré le déluge ?", 
    "type": "Nombre", 
    "category": "Nombres", 
    "options": ["40 jours", "120 jours", "365 jours", "Je ne sais pas"], 
    "correctAnswer": "40 jours", 
    "reference": "Genèse 7:12" 
  },
  { 
    "question": "Combien d’apôtres Jésus avait-il ?", 
    "type": "Nombre", 
    "category": "Nombres", 
    "options": ["7", "10", "12", "Je ne sais pas"], 
    "correctAnswer": "12", 
    "reference": "Luc 6:13" 
  },
  { 
    "question": "Combien de jours Dieu a-t-il mis pour créer le monde ?", 
    "type": "Nombre", 
    "category": "Nombres", 
    "options": ["3", "6", "7", "Je ne sais pas"], 
    "correctAnswer": "6", 
    "reference": "Genèse 1:31" 
  },
  { 
    "question": "Combien de plaies Dieu a-t-il envoyées sur l'Égypte ?", 
    "type": "Nombre", 
    "category": "Nombres", 
    "options": ["5", "7", "10", "Je ne sais pas"], 
    "correctAnswer": "10", 
    "reference": "Exode 7-12" 
  },
  { 
    "question": "Combien de jours Jonas a-t-il passé dans le ventre du poisson ?", 
    "type": "Nombre", 
    "category": "Nombres", 
    "options": ["1 jour", "3 jours", "7 jours", "Je ne sais pas"], 
    "correctAnswer": "3 jours", 
    "reference": "Jonas 1:17" 
  },
  { 
    "question": "Combien de fois Pierre a-t-il renié Jésus ?", 
    "type": "Nombre", 
    "category": "Nombres", 
    "options": ["1", "3", "7", "Je ne sais pas"], 
    "correctAnswer": "3", 
    "reference": "Matthieu 26:75" 
  },
  { 
    "question": "Combien de jours Jésus a-t-il jeûné dans le désert ?", 
    "type": "Nombre", 
    "category": "Nombres", 
    "options": ["10", "30", "40", "Je ne sais pas"], 
    "correctAnswer": "40", 
    "reference": "Matthieu 4:2" 
  },
  { 
    "question": "Combien d’épîtres Paul a-t-il écrites dans le Nouveau Testament ?", 
    "type": "Nombre", 
    "category": "Nombres", 
    "options": ["9", "13", "21", "Je ne sais pas"], 
    "correctAnswer": "13", 
    "reference": "Romains à Philémon" 
  },
  { 
    question: "Combien de jours Jésus a-t-il jeûné dans le désert ?", 
    type: "Nombre", 
    category: "Nombres", 
    options: ["30", "40", "50", "Je ne sais pas"], 
    correctAnswer: "40", 
    reference: "Matthieu 4:2" 
  },
  { 
    question: "Combien de disciples Jésus avait-il ?", 
    type: "Nombre", 
    category: "Nombres", 
    options: ["10", "11", "12", "Je ne sais pas"], 
    correctAnswer: "12", 
    reference: "Matthieu 10:2-4" 
  },

  // Questions "QCM"
  { 
    question: "Quel est le nom du disciple qui a trahi Jésus ?", 
    type: "QCM", 
    category: "QCM", 
    options: ["Pierre", "Jean", "Judas", "Thomas"], 
    correctAnswer: "Judas", 
    reference: "Matthieu 26:14-16" 
  }, 
  { 
    "question": "Quel est le premier miracle de Jésus ?", 
    "type": "QCM", 
    "category": "QCM", 
    "options": ["Guérison d'un aveugle", "Multiplication des pains", "Transformation de l'eau en vin", "Je ne sais pas"], 
    "correctAnswer": "Transformation de l'eau en vin", 
    "reference": "Jean 2:1-11" 
  },
  { 
    "question": "Qui a reçu les dix commandements ?", 
    "type": "QCM", 
    "category": "QCM", 
    "options": ["Moïse", "Abraham", "Élie", "Je ne sais pas"], 
    "correctAnswer": "Moïse", 
    "reference": "Exode 20:1-17" 
  },
  { 
    "question": "Comment s'appelle la mère de Jésus ?", 
    "type": "QCM", 
    "category": "QCM", 
    "options": ["Marie", "Marthe", "Miriam", "Je ne sais pas"], 
    "correctAnswer": "Marie", 
    "reference": "Matthieu 1:18" 
  },
  { 
    "question": "Quel apôtre a marché sur l'eau avec Jésus ?", 
    "type": "QCM", 
    "category": "QCM", 
    "options": ["Jean", "Pierre", "Jacques", "Je ne sais pas"], 
    "correctAnswer": "Pierre", 
    "reference": "Matthieu 14:29" 
  },
  { 
    "question": "Quel disciple était collecteur d’impôts avant de suivre Jésus ?", 
    "type": "QCM", 
    "category": "QCM", 
    "options": ["Matthieu", "Paul", "Judas", "Je ne sais pas"], 
    "correctAnswer": "Matthieu", 
    "reference": "Matthieu 9:9" 
  },
  { 
    "question": "Qui est considéré comme le père de la foi dans la Bible ?", 
    "type": "QCM", 
    "category": "QCM", 
    "options": ["Moïse", "Abraham", "David", "Je ne sais pas"], 
    "correctAnswer": "Abraham", 
    "reference": "Romains 4:16" 
  },
  { 
    "question": "Quel est le plus grand commandement selon Jésus ?", 
    "type": "QCM", 
    "category": "QCM", 
    "options": ["Aimer Dieu et son prochain", "Ne pas tuer", "Honorer son père et sa mère", "Je ne sais pas"], 
    "correctAnswer": "Aimer Dieu et son prochain", 
    "reference": "Matthieu 22:37-39" 
  },
  { 
    "question": "Quel est le dernier livre du Nouveau Testament ?", 
    "type": "QCM", 
    "category": "QCM", 
    "options": ["Éphésiens", "Apocalypse", "Jean", "Je ne sais pas"], 
    "correctAnswer": "Apocalypse", 
    "reference": "Apocalypse 1:1" 
  },
  { 
    "question": "Qui a trahi Jésus pour 30 pièces d’argent ?", 
    "type": "QCM", 
    "category": "QCM", 
    "options": ["Pierre", "Judas", "Thomas", "Je ne sais pas"], 
    "correctAnswer": "Judas", 
    "reference": "Matthieu 26:14-16" 
  },
  { 
    "question": "Quel roi a jeté Daniel dans la fosse aux lions ?", 
    "type": "QCM", 
    "category": "QCM", 
    "options": ["Nabuchodonosor", "Darius", "Salomon", "Je ne sais pas"], 
    "correctAnswer": "Darius", 
    "reference": "Daniel 6:16" 
  },
  {
    "question": "Quel est le premier livre de la Bible ?",
    "type": "QCM",
    "category": "QCM",
    "options": ["Exode", "Genèse", "Lévitique", "Nombres"],
    "correctAnswer": "Genèse",
    "reference": "Genèse 1:1"
  },
  {
    "question": "Qui a construit l'arche pour survivre au déluge ?",
    "type": "QCM",
    "category": "QCM",
    "options": ["Moïse", "Abraham", "Noé", "Élie"],
    "correctAnswer": "Noé",
    "reference": "Genèse 6:13-22"
  },
  {
    "question": "Quel roi d'Israël a tué Goliath ?",
    "type": "QCM",
    "category": "QCM",
    "options": ["Saül", "Salomon", "David", "Josué"],
    "correctAnswer": "David",
    "reference": "1 Samuel 17:45-50"
  },
  {
    "question": "Qui a reçu les dix commandements sur le mont Sinaï ?",
    "type": "QCM",
    "category": "QCM",
    "options": ["Moïse", "Élie", "Aaron", "Josué"],
    "correctAnswer": "Moïse",
    "reference": "Exode 20:1-21"
  },
  {
    "question": "Combien de jours Jésus a-t-il jeûné dans le désert ?",
    "type": "QCM",
    "category": "QCM",
    "options": ["30", "40", "50", "60"],
    "correctAnswer": "40",
    "reference": "Matthieu 4:2"
  },
  {
    "question": "Qui est connu comme étant 'l'apôtre des Gentils' ?",
    "type": "QCM",
    "category": "QCM",
    "options": ["Pierre", "Jean", "Paul", "Jacques"],
    "correctAnswer": "Paul",
    "reference": "Romains 11:13"
  },
  {
    "question": "Dans quelle ville Jésus est-il né ?",
    "type": "QCM",
    "category": "QCM",
    "options": ["Nazareth", "Jérusalem", "Bethléem", "Capharnaüm"],
    "correctAnswer": "Bethléem",
    "reference": "Matthieu 2:1"
  },
  {
    "question": "Quel disciple a renié Jésus trois fois ?",
    "type": "QCM",
    "category": "QCM",
    "options": ["Jean", "Pierre", "Judas", "Thomas"],
    "correctAnswer": "Pierre",
    "reference": "Luc 22:61-62"
  },
  {
    "question": "Quel est le dernier livre de la Bible ?",
    "type": "QCM",
    "category": "QCM",
    "options": ["Jude", "Apocalypse", "Jean", "Actes"],
    "correctAnswer": "Apocalypse",
    "reference": "Apocalypse 1:1"
  },
  {
    "question": "Qui a baptisé Jésus ?",
    "type": "QCM",
    "category": "QCM",
    "options": ["Jean-Baptiste", "Moïse", "Élie", "Pierre"],
    "correctAnswer": "Jean-Baptiste",
    "reference": "Matthieu 3:13-17"
  },
  {
    question: "Quel roi a jeté Daniel dans la fosse aux lions ?",
    type: "QCM",
    category: "QCM",
    options: ["Saül", "Nabuchodonosor", "Darius", "Salomon"],
    correctAnswer: "Darius",
    reference: "Daniel 6:16"
  },

  // Devinettes
  { 
    question: "Je suis le roi qui a construit le premier temple à Jérusalem. Qui suis-je ?", 
    type: "Devinettes", 
    category: "Devinettes", 
    options: ["David", "Salomon", "Saül", "Je ne sais pas"], 
    correctAnswer: "Salomon", 
    reference: "1 Rois 6:1" 
  },
  {
    "question": "Je suis le roi qui a construit le premier temple à Jérusalem. Qui suis-je ?",
    "type": "Devinettes",
    "category": "Devinettes",
    "options": ["David", "Salomon", "Saül", "Je ne sais pas"],
    "correctAnswer": "Salomon",
    "reference": "1 Rois 6:1"
  },
  {
    "question": "Je suis l'homme qui a survécu au déluge en construisant une arche. Qui suis-je ?",
    "type": "Devinettes",
    "category": "Devinettes",
    "options": ["Abraham", "Moïse", "Noé", "Je ne sais pas"],
    "correctAnswer": "Noé",
    "reference": "Genèse 6:9-22"
  },
  {
    "question": "J'ai été avalé par un grand poisson et recraché après trois jours. Qui suis-je ?",
    "type": "Devinettes",
    "category": "Devinettes",
    "options": ["Élie", "Jonas", "Paul", "Je ne sais pas"],
    "correctAnswer": "Jonas",
    "reference": "Jonas 1:17"
  },
  {
    "question": "J'ai trahi Jésus pour 30 pièces d'argent. Qui suis-je ?",
    "type": "Devinettes",
    "category": "Devinettes",
    "options": ["Pierre", "Judas", "Thomas", "Je ne sais pas"],
    "correctAnswer": "Judas",
    "reference": "Matthieu 26:14-16"
  },
  {
    "question": "Je suis la seule femme juge d'Israël. Qui suis-je ?",
    "type": "Devinettes",
    "category": "Devinettes",
    "options": ["Esther", "Ruth", "Débora", "Je ne sais pas"],
    "correctAnswer": "Débora",
    "reference": "Juges 4:4"
  },
  {
    "question": "Je suis monté au ciel dans un char de feu sans passer par la mort. Qui suis-je ?",
    "type": "Devinettes",
    "category": "Devinettes",
    "options": ["Élie", "Ésaïe", "Ézéchiel", "Je ne sais pas"],
    "correctAnswer": "Élie",
    "reference": "2 Rois 2:11"
  },
  {
    "question": "J'ai été enfermé dans une fosse aux lions, mais Dieu m'a sauvé. Qui suis-je ?",
    "type": "Devinettes",
    "category": "Devinettes",
    "options": ["Joseph", "Daniel", "David", "Je ne sais pas"],
    "correctAnswer": "Daniel",
    "reference": "Daniel 6:16-22"
  },
  {
    "question": "Je suis le disciple que Jésus aimait. Qui suis-je ?",
    "type": "Devinettes",
    "category": "Devinettes",
    "options": ["Pierre", "Jean", "Paul", "Je ne sais pas"],
    "correctAnswer": "Jean",
    "reference": "Jean 13:23"
  },
  {
    "question": "J'ai été transformé en statue de sel parce que j’ai regardé en arrière. Qui suis-je ?",
    "type": "Devinettes",
    "category": "Devinettes",
    "options": ["Sara", "La femme de Lot", "Rachel", "Je ne sais pas"],
    "correctAnswer": "La femme de Lot",
    "reference": "Genèse 19:26"
  },
  {
    "question": "J'ai combattu Goliath avec une fronde et une pierre. Qui suis-je ?",
    "type": "Devinettes",
    "category": "Devinettes",
    "options": ["Saül", "David", "Samuel", "Je ne sais pas"],
    "correctAnswer": "David",
    "reference": "1 Samuel 17:49"
  },
  { 
    question: "Quel prophète a été avalé par un grand poisson ?", 
    type: "Devinettes", 
    category: "Devinettes", 
    options: ["Jonas", "Ésaïe", "Élie", "Je ne sais pas"], 
    correctAnswer: "Jonas", 
    reference: "Jonas 1:17" 
  },

  // Chronologie
  {
    question: "Classez ces événements dans l'ordre chronologique :",
    type: "Chronologie",
    category: "Chronologie",
    options: ["Création de la lumière", "Création des animaux", "Création de l'homme", "Repos de Dieu"],
    correctAnswer: ["Création de la lumière", "Création des animaux", "Création de l'homme", "Repos de Dieu"],
    reference: "Genèse 1:1-31"
  },
  {
    "question": "Classez ces événements dans l'ordre chronologique :",
    "type": "Chronologie",
    "category": "Chronologie",
    "options": ["Création de la lumière", "Création des animaux", "Création de l'homme", "Repos de Dieu"],
    "correctAnswer": ["Création de la lumière", "Création des animaux", "Création de l'homme", "Repos de Dieu"],
    "reference": "Genèse 1:1-31"
  },
  {
    "question": "Classez ces patriarches dans l'ordre chronologique :",
    "type": "Chronologie",
    "category": "Chronologie",
    "options": ["Abraham", "Isaac", "Jacob", "Joseph"],
    "correctAnswer": ["Abraham", "Isaac", "Jacob", "Joseph"],
    "reference": "Genèse 12-50"
  },
  {
    "question": "Classez ces événements de l'Exode dans l'ordre chronologique :",
    "type": "Chronologie",
    "category": "Chronologie",
    "options": ["Les dix plaies", "Sortie d'Égypte", "Ouverture de la mer Rouge", "Don de la loi sur le mont Sinaï"],
    "correctAnswer": ["Les dix plaies", "Sortie d'Égypte", "Ouverture de la mer Rouge", "Don de la loi sur le mont Sinaï"],
    "reference": "Exode 7-20"
  },
  {
    "question": "Classez ces événements de la vie de Jésus dans l'ordre chronologique :",
    "type": "Chronologie",
    "category": "Chronologie",
    "options": ["Baptême de Jésus", "Sermon sur la montagne", "Crucifixion", "Résurrection"],
    "correctAnswer": ["Baptême de Jésus", "Sermon sur la montagne", "Crucifixion", "Résurrection"],
    "reference": "Matthieu 3-28"
  },
  {
    "question": "Classez ces rois d'Israël dans l'ordre chronologique :",
    "type": "Chronologie",
    "category": "Chronologie",
    "options": ["Saül", "David", "Salomon", "Jéroboam"],
    "correctAnswer": ["Saül", "David", "Salomon", "Jéroboam"],
    "reference": "1 Samuel 10 - 1 Rois 12"
  },
  {
    "question": "Classez ces miracles de Jésus dans l'ordre chronologique :",
    "type": "Chronologie",
    "category": "Chronologie",
    "options": ["Transformation de l'eau en vin", "Multiplication des pains", "Marche sur l'eau", "Résurrection de Lazare"],
    "correctAnswer": ["Transformation de l'eau en vin", "Multiplication des pains", "Marche sur l'eau", "Résurrection de Lazare"],
    "reference": "Jean 2-11"
  },
  {
    "question": "Classez ces étapes de la Passion du Christ dans l'ordre chronologique :",
    "type": "Chronologie",
    "category": "Chronologie",
    "options": ["Dernier repas", "Arrestation", "Procès", "Crucifixion"],
    "correctAnswer": ["Dernier repas", "Arrestation", "Procès", "Crucifixion"],
    "reference": "Matthieu 26-27"
  },
  {
    "question": "Classez ces juges d'Israël dans l'ordre chronologique :",
    "type": "Chronologie",
    "category": "Chronologie",
    "options": ["Gédéon", "Samson", "Débora", "Samuel"],
    "correctAnswer": ["Débora", "Gédéon", "Samson", "Samuel"],
    "reference": "Juges 4-16"
  },
  {
    "question": "Classez ces lettres de Paul dans l'ordre de leur écriture :",
    "type": "Chronologie",
    "category": "Chronologie",
    "options": ["Romains", "1 Corinthiens", "Galates", "Philippiens"],
    "correctAnswer": ["Galates", "1 Corinthiens", "Romains", "Philippiens"],
    "reference": "Épîtres de Paul"
  },
  {
    "question": "Classez ces événements de la Genèse dans l'ordre chronologique :",
    "type": "Chronologie",
    "category": "Chronologie",
    "options": ["Déluge de Noé", "Tour de Babel", "Alliance avec Abraham", "Vente de Joseph par ses frères"],
    "correctAnswer": ["Déluge de Noé", "Tour de Babel", "Alliance avec Abraham", "Vente de Joseph par ses frères"],
    "reference": "Genèse 6-37"
  },
  {
    "question": "Classez ces patriarches dans l'ordre chronologique :",
    "type": "Chronologie",
    "category": "Chronologie",
    "options": ["Abraham", "Isaac", "Jacob", "Joseph"],
    "correctAnswer": ["Abraham", "Isaac", "Jacob", "Joseph"],
    "reference": "Genèse 12-50"
  },
  {
    "question": "Classez ces événements de la vie de Moïse dans l'ordre :",
    "type": "Chronologie",
    "category": "Chronologie",
    "options": ["Moïse dans un panier sur le Nil", "Moïse tue un Égyptien", "Les 10 plaies d'Égypte", "Moïse reçoit les 10 commandements"],
    "correctAnswer": ["Moïse dans un panier sur le Nil", "Moïse tue un Égyptien", "Les 10 plaies d'Égypte", "Moïse reçoit les 10 commandements"],
    "reference": "Exode 2-20"
  },
  {
    "question": "Classez ces rois d'Israël dans l'ordre de leur règne :",
    "type": "Chronologie",
    "category": "Chronologie",
    "options": ["Saül", "David", "Salomon", "Roboam"],
    "correctAnswer": ["Saül", "David", "Salomon", "Roboam"],
    "reference": "1 Samuel 10 - 1 Rois 12"
  },
  {
    "question": "Classez ces étapes de l'exil babylonien dans l'ordre :",
    "type": "Chronologie",
    "category": "Chronologie",
    "options": ["Destruction du Temple de Jérusalem", "Déportation à Babylone", "Prophétie de Daniel", "Retour sous Cyrus"],
    "correctAnswer": ["Destruction du Temple de Jérusalem", "Déportation à Babylone", "Prophétie de Daniel", "Retour sous Cyrus"],
    "reference": "2 Rois 25, Daniel 1, Esdras 1"
  },
  {
    "question": "Classez ces événements de la vie de Jésus dans l'ordre :",
    "type": "Chronologie",
    "category": "Chronologie",
    "options": ["Naissance de Jésus", "Baptême par Jean-Baptiste", "Sermon sur la montagne", "Crucifixion et résurrection"],
    "correctAnswer": ["Naissance de Jésus", "Baptême par Jean-Baptiste", "Sermon sur la montagne", "Crucifixion et résurrection"],
    "reference": "Matthieu 1-28"
  },
  {
    "question": "Classez ces miracles de Jésus dans l'ordre :",
    "type": "Chronologie",
    "category": "Chronologie",
    "options": ["Transformation de l'eau en vin", "Multiplication des pains", "Marche sur l'eau", "Résurrection de Lazare"],
    "correctAnswer": ["Transformation de l'eau en vin", "Multiplication des pains", "Marche sur l'eau", "Résurrection de Lazare"],
    "reference": "Jean 2, Matthieu 14, Jean 11"
  },
  {
    "question": "Classez ces étapes de la mission des apôtres après la Pentecôte :",
    "type": "Chronologie",
    "category": "Chronologie",
    "options": ["Pentecôte", "Conversion de Saul", "Premier concile de Jérusalem", "Voyages missionnaires de Paul"],
    "correctAnswer": ["Pentecôte", "Conversion de Saul", "Premier concile de Jérusalem", "Voyages missionnaires de Paul"],
    "reference": "Actes 2-15"
  },
  {
    "question": "Classez ces lettres du Nouveau Testament dans l'ordre chronologique de leur écriture :",
    "type": "Chronologie",
    "category": "Chronologie",
    "options": ["1 Thessaloniciens", "1 Corinthiens", "Éphésiens", "2 Timothée"],
    "correctAnswer": ["1 Thessaloniciens", "1 Corinthiens", "Éphésiens", "2 Timothée"],
    "reference": "Datation des lettres de Paul"
  },
  {
    "question": "Classez ces événements de la fin des temps selon l'Apocalypse :",
    "type": "Chronologie",
    "category": "Chronologie",
    "options": ["Ouverture des sceaux", "Son des trompettes", "Coupes de la colère", "Retour de Christ"],
    "correctAnswer": ["Ouverture des sceaux", "Son des trompettes", "Coupes de la colère", "Retour de Christ"],
    "reference": "Apocalypse 6-19"
  },
  {
    question: "Classez ces étapes de la vie de Moïse dans l'ordre chronologique :",
    type: "Chronologie",
    category: "Chronologie",
    options: ["Fuite en Madian", "Ouverture de la mer Rouge", "Don des dix commandements", "Né dans un panier sur le Nil"],
    correctAnswer: ["Né dans un panier sur le Nil", "Fuite en Madian", "Ouverture de la mer Rouge", "Don des dix commandements"],
    reference: "Exode 2-20"
  },
];

export default questionBank;
