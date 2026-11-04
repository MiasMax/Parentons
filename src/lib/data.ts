// Données fictives — à remplacer par les appels à l'API.

export type Domain =
  | "Articulation"
  | "Vocabulaire"
  | "Conscience phonologique"
  | "Récit"
  | "Compréhension"
  | "Souffle";

export type Step = { title: string; detail: string; tip?: string };

export type Activity = {
  id: string;
  title: string;
  domain: Domain;
  duration: number; // minutes
  summary: string;
  objective: string;
  materials: string[];
  steps: Step[];
  validatedBy: string;
  status?: ActivityStatus; // absent = validée
};

export type ActivityStatus = "validee" | "a_valider";

export type Result = "reussi" | "moyen" | "difficile";

export type Feedback = { result: Result; note?: string; date: string };

export type Parcours = "suivi" | "abonnement";

export const child = {
  firstName: "Léo",
  age: 5,
  birthDate: "2021-03-14",
  difficulties: ["Prononciation des sons [s] et [ch]", "Vocabulaire restreint", "Difficulté à raconter"],
  diagnosis:
    "Retard de parole et de langage oral léger. Bilan réalisé en septembre 2026.",
};

export const orthophoniste = {
  firstName: "Claire",
  name: "Claire Martin",
  initials: "CM",
  city: "Lyon 7e",
  address: "12 rue de Marseille, 69007 Lyon",
  phone: "04 78 00 00 00",
  email: "claire.martin@ortho-exemple.fr",
  rpps: "10101234567",
  inviteCode: "CLAIRE-7K2",
  nextAppointment: "2026-11-18T10:30:00",
};

export const parent = { firstName: "Sophie", email: "sophie@exemple.fr" };

export const activities: Activity[] = [
  {
    id: "serpent-qui-siffle",
    title: "Le serpent qui siffle",
    domain: "Articulation",
    duration: 10,
    summary: "Faire siffler le serpent pour travailler le son [s].",
    objective:
      "Aider Léo à placer sa langue derrière les dents pour produire un [s] net, d'abord seul puis dans des syllabes.",
    materials: ["Un miroir", "Une feuille et des crayons"],
    steps: [
      {
        title: "Installez-vous face au miroir",
        detail:
          "Asseyez-vous côte à côte devant le miroir. Montrez votre bouche : dents serrées, lèvres en sourire.",
        tip: "Transformez-vous en serpent avec la main pour rendre le moment ludique.",
      },
      {
        title: "Le serpent siffle",
        detail:
          "Faites « sssss » longtemps et demandez à Léo de vous imiter. Il doit voir sa langue cachée derrière les dents.",
        tip: "Si la langue sort, touchez doucement ses dents du bas avec un doigt pour lui montrer où la garder.",
      },
      {
        title: "Le serpent se promène",
        detail:
          "Dessinez un chemin sinueux. Léo suit le chemin avec le doigt en faisant « sssss » sans s'arrêter.",
      },
      {
        title: "Le serpent parle",
        detail:
          "Enchaînez avec des syllabes : « sa, so, si, su ». Puis des mots : soleil, sac, souris.",
        tip: "Félicitez chaque essai, même imparfait. L'important est de pratiquer.",
      },
    ],
    validatedBy: "Claire Martin",
  },
  {
    id: "boite-a-rimes",
    title: "La boîte à rimes",
    domain: "Conscience phonologique",
    duration: 15,
    summary: "Trouver les mots qui finissent pareil.",
    objective:
      "Développer l'écoute des sons de la langue en repérant des rimes, une base pour l'apprentissage de la lecture.",
    materials: ["Une boîte ou un sac", "6 à 10 petits objets de la maison"],
    steps: [
      {
        title: "Remplissez la boîte",
        detail:
          "Mettez des objets dont les noms riment par deux : un bateau et un gâteau, une souris et un radis…",
      },
      {
        title: "Piochez un objet",
        detail:
          "Léo pioche un objet et le nomme. Répétez le mot en insistant sur la fin : « bat-EAU ».",
      },
      {
        title: "Cherchez son copain",
        detail:
          "Il pioche un deuxième objet et vous lui demandez : « Est-ce que ça finit pareil ? »",
        tip: "Si c'est difficile, proposez deux choix seulement.",
      },
      {
        title: "Inventez des rimes",
        detail:
          "Pour finir, inventez ensemble des rimes rigolotes, même avec des mots qui n'existent pas.",
      },
    ],
    validatedBy: "Claire Martin",
  },
  {
    id: "raconte-ton-dessin",
    title: "Raconte-moi ton dessin",
    domain: "Récit",
    duration: 15,
    summary: "Léo dessine puis raconte une petite histoire.",
    objective:
      "Encourager Léo à construire des phrases et à enchaîner des idées : qui, où, ce qui se passe.",
    materials: ["Feuilles", "Crayons de couleur"],
    steps: [
      {
        title: "Le dessin",
        detail:
          "Proposez à Léo de dessiner ce qu'il veut : sa journée, un animal, une aventure.",
      },
      {
        title: "Les questions magiques",
        detail:
          "Posez trois questions : « Qui est-ce ? », « Où est-il ? », « Qu'est-ce qui se passe ? »",
        tip: "Évitez les questions fermées (oui/non). Laissez-lui du temps pour répondre.",
      },
      {
        title: "Reformulez",
        detail:
          "Reprenez ses phrases en les enrichissant : « Le chien court » → « Oui, le gros chien court vite dans le jardin ! »",
      },
      {
        title: "L'histoire complète",
        detail:
          "Demandez-lui de raconter toute l'histoire du début à la fin. Écrivez-la sous le dessin.",
      },
    ],
    validatedBy: "Claire Martin",
  },
  {
    id: "jeu-des-devinettes",
    title: "Le jeu des devinettes",
    domain: "Vocabulaire",
    duration: 10,
    summary: "Deviner un objet à partir d'indices.",
    objective:
      "Enrichir le vocabulaire et apprendre à décrire un objet : sa forme, sa couleur, son usage.",
    materials: ["Des images ou des objets du quotidien"],
    steps: [
      {
        title: "Vous commencez",
        detail:
          "Choisissez un objet sans le montrer et donnez des indices : « C'est rond, c'est rouge, ça se mange. »",
      },
      {
        title: "À Léo de deviner",
        detail: "Il propose des réponses. Ajoutez un indice à chaque essai.",
      },
      {
        title: "On inverse les rôles",
        detail:
          "Léo choisit un objet et vous le décrit. Aidez-le avec des questions : « De quelle couleur ? À quoi ça sert ? »",
      },
    ],
    validatedBy: "Thomas Leroy",
  },
  {
    id: "souffle-la-plume",
    title: "Souffle la plume",
    domain: "Souffle",
    duration: 5,
    summary: "Faire avancer une plume en soufflant.",
    objective:
      "Travailler le contrôle du souffle, utile pour la parole et la prononciation.",
    materials: ["Une plume ou une boule de coton", "Une paille"],
    steps: [
      {
        title: "La course",
        detail:
          "Posez la plume sur la table. Léo souffle pour la faire avancer jusqu'à une ligne d'arrivée.",
      },
      {
        title: "Avec la paille",
        detail: "Recommencez en soufflant dans une paille, doucement puis fort.",
      },
    ],
    validatedBy: "Thomas Leroy",
  },
  {
    id: "jacques-a-dit",
    title: "Jacques a dit",
    domain: "Compréhension",
    duration: 10,
    summary: "Suivre des consignes de plus en plus longues.",
    objective:
      "Améliorer la compréhension des consignes orales et la mémoire de travail.",
    materials: ["Aucun"],
    steps: [
      {
        title: "Consignes simples",
        detail: "« Jacques a dit : touche ton nez. » Une seule action à la fois.",
      },
      {
        title: "Consignes doubles",
        detail: "« Jacques a dit : saute puis assieds-toi. »",
        tip: "Si Léo se trompe, répétez calmement la consigne.",
      },
      {
        title: "On inverse",
        detail: "Léo donne les consignes : c'est lui qui doit bien formuler.",
      },
    ],
    validatedBy: "Claire Martin",
  },
];

// Programme de la semaine : 3 activités, avec le jour conseillé.
export const thisWeek = [
  { id: "serpent-qui-siffle", day: "Lundi" },
  { id: "boite-a-rimes", day: "Mercredi" },
  { id: "raconte-ton-dessin", day: "Samedi" },
];

// Historique des semaines précédentes.
export const pastWeeks: {
  label: string;
  items: { id: string; feedback: Feedback }[];
}[] = [
  {
    label: "Semaine du 26 octobre",
    items: [
      { id: "jeu-des-devinettes", feedback: { result: "reussi", date: "2026-10-26" } },
      { id: "souffle-la-plume", feedback: { result: "reussi", date: "2026-10-28" } },
      {
        id: "jacques-a-dit",
        feedback: {
          result: "moyen",
          note: "A eu du mal avec les consignes doubles.",
          date: "2026-10-31",
        },
      },
    ],
  },
  {
    label: "Semaine du 19 octobre",
    items: [
      {
        id: "serpent-qui-siffle",
        feedback: { result: "difficile", note: "La langue sort encore souvent.", date: "2026-10-19" },
      },
      { id: "souffle-la-plume", feedback: { result: "reussi", date: "2026-10-21" } },
      { id: "jeu-des-devinettes", feedback: { result: "moyen", date: "2026-10-24" } },
    ],
  },
];

export const plans = [
  {
    id: "mensuel",
    name: "Mensuel",
    price: "19,90 €",
    period: "/ mois",
    note: "Sans engagement",
  },
  {
    id: "annuel",
    name: "Annuel",
    price: "14,90 €",
    period: "/ mois",
    note: "Facturé 178,80 € par an, soit 2 mois offerts",
    featured: true,
  },
];

export const planFeatures = [
  "3 activités personnalisées par semaine",
  "Toutes validées par des orthophonistes",
  "Rappels pour ne pas oublier",
  "Suivi des progrès de votre enfant",
];

export function getActivity(id: string) {
  return catalog.find((a) => a.id === id);
}

export const resultLabels: Record<Result, string> = {
  reussi: "Réussi",
  moyen: "Mitigé",
  difficile: "Difficile",
};

// ─── Espace orthophoniste ────────────────────────────────────────────────

// Date « du jour » de la démo, fixe pour que l'agenda et les alertes restent cohérents.
export const DEMO_TODAY = "2026-11-04";
export const DEMO_WEEK_START = "2026-11-02"; // lundi

// Activités proposées par l'équipe Parentons, en attente de relecture.
export const pendingActivities: Activity[] = [
  {
    id: "train-qui-chuchote",
    title: "Le train qui chuchote",
    domain: "Articulation",
    duration: 10,
    summary: "Le train fait « chhh » pour travailler le son [ch].",
    objective:
      "Produire un [ch] distinct du [s] : lèvres en avant, langue reculée, d'abord seul puis dans des mots.",
    materials: ["Un petit train ou une voiture", "Un miroir"],
    steps: [
      {
        title: "Le train démarre",
        detail: "Avancez lèvres en avant, comme pour un bisou, et faites « chhhh » en poussant le train.",
        tip: "Comparez avec le serpent « ssss » : la bouche ne fait pas la même forme.",
      },
      {
        title: "Les gares",
        detail: "À chaque gare, l'enfant dit une syllabe : « cha, cho, chi, chu ».",
      },
      {
        title: "Les voyageurs",
        detail: "Faites monter des voyageurs : chat, chaussure, cheval, chocolat.",
      },
    ],
    validatedBy: "",
    status: "a_valider",
  },
  {
    id: "marche-des-mots",
    title: "Le marché des mots",
    domain: "Vocabulaire",
    duration: 15,
    summary: "Jouer à la marchande pour apprendre des mots par catégorie.",
    objective:
      "Enrichir le vocabulaire des fruits, légumes et aliments, et travailler les catégories.",
    materials: ["Quelques fruits et légumes (vrais ou en images)", "Un panier"],
    steps: [
      {
        title: "Installez l'étal",
        detail: "Posez les aliments sur la table et nommez-les ensemble.",
      },
      {
        title: "La liste de courses",
        detail: "Demandez deux puis trois aliments : « Je voudrais une pomme et une carotte. »",
        tip: "Ajoutez une couleur ou une taille pour allonger la phrase.",
      },
      {
        title: "On range",
        detail: "Triez : les fruits d'un côté, les légumes de l'autre.",
      },
    ],
    validatedBy: "",
    status: "a_valider",
  },
];

export const catalog: Activity[] = [...activities, ...pendingActivities];

export type HistoryItem = { id: string; feedback: Feedback };

export type Patient = {
  id: string;
  firstName: string;
  age: number;
  parentName: string;
  parentEmail: string;
  since: string;
  diagnosis: string;
  difficulties: string[];
  programme: { id: string; day: string }[];
  weekFeedback: Record<string, Feedback>; // pour Léo, remplacé par le retour réel du parent
  history: HistoryItem[];
};

export const patients: Patient[] = [
  {
    id: "leo",
    firstName: child.firstName,
    age: child.age,
    parentName: "Sophie Durand",
    parentEmail: parent.email,
    since: "2026-09-15",
    diagnosis: child.diagnosis,
    difficulties: child.difficulties,
    programme: thisWeek,
    weekFeedback: {},
    history: pastWeeks.flatMap((w) => w.items),
  },
  {
    id: "ines",
    firstName: "Inès",
    age: 4,
    parentName: "Karim Benali",
    parentEmail: "karim.b@exemple.fr",
    since: "2026-10-01",
    diagnosis: "Retard de parole. Simplifications phonologiques fréquentes.",
    difficulties: ["Son [r]", "Simplifie les mots longs", "Manque du mot"],
    programme: [
      { id: "souffle-la-plume", day: "Lundi" },
      { id: "jeu-des-devinettes", day: "Mardi" },
      { id: "serpent-qui-siffle", day: "Vendredi" },
    ],
    weekFeedback: {
      "souffle-la-plume": { result: "reussi", date: "2026-11-02" },
      "jeu-des-devinettes": {
        result: "difficile",
        note: "Ne trouvait pas les mots, elle s'est découragée au bout de 5 minutes.",
        date: "2026-11-03",
      },
    },
    history: [
      { id: "jeu-des-devinettes", feedback: { result: "difficile", note: "Beaucoup d'hésitations.", date: "2026-10-27" } },
      { id: "souffle-la-plume", feedback: { result: "reussi", date: "2026-10-29" } },
      { id: "jacques-a-dit", feedback: { result: "moyen", date: "2026-10-20" } },
    ],
  },
  {
    id: "noah",
    firstName: "Noah",
    age: 7,
    parentName: "Julie Moreau",
    parentEmail: "julie.moreau@exemple.fr",
    since: "2026-06-10",
    diagnosis: "Fragilité de la conscience phonologique, entrée dans la lecture difficile.",
    difficulties: ["Repérer les rimes", "Segmenter les syllabes"],
    programme: [
      { id: "boite-a-rimes", day: "Lundi" },
      { id: "jacques-a-dit", day: "Jeudi" },
      { id: "raconte-ton-dessin", day: "Dimanche" },
    ],
    weekFeedback: {},
    history: [
      { id: "boite-a-rimes", feedback: { result: "moyen", note: "Trouve les rimes avec 2 choix seulement.", date: "2026-10-26" } },
      { id: "raconte-ton-dessin", feedback: { result: "reussi", date: "2026-10-30" } },
      { id: "boite-a-rimes", feedback: { result: "difficile", date: "2026-10-19" } },
    ],
  },
  {
    id: "lina",
    firstName: "Lina",
    age: 6,
    parentName: "Marc Dubois",
    parentEmail: "marc.dubois@exemple.fr",
    since: "2026-05-20",
    diagnosis: "Trouble de la compréhension orale, en nette amélioration.",
    difficulties: ["Consignes longues", "Vocabulaire abstrait"],
    programme: [
      { id: "jacques-a-dit", day: "Lundi" },
      { id: "raconte-ton-dessin", day: "Mardi" },
      { id: "jeu-des-devinettes", day: "Mercredi" },
    ],
    weekFeedback: {
      "jacques-a-dit": { result: "reussi", date: "2026-11-02" },
      "raconte-ton-dessin": { result: "reussi", note: "Une histoire avec un début et une fin !", date: "2026-11-03" },
      "jeu-des-devinettes": { result: "moyen", date: "2026-11-04" },
    },
    history: [
      { id: "jacques-a-dit", feedback: { result: "reussi", date: "2026-10-26" } },
      { id: "jeu-des-devinettes", feedback: { result: "reussi", date: "2026-10-28" } },
    ],
  },
  {
    id: "adam",
    firstName: "Adam",
    age: 3,
    parentName: "Camille Petit",
    parentEmail: "camille.petit@exemple.fr",
    since: "2026-10-20",
    diagnosis: "Retard de langage oral, peu de mots à 3 ans. Bilan initial en cours.",
    difficulties: ["Peu de vocabulaire", "Phrases d'un ou deux mots"],
    programme: [
      { id: "souffle-la-plume", day: "Lundi" },
      { id: "jeu-des-devinettes", day: "Jeudi" },
      { id: "raconte-ton-dessin", day: "Samedi" },
    ],
    weekFeedback: {
      "souffle-la-plume": { result: "moyen", note: "Préfère jouer avec la plume que souffler.", date: "2026-11-03" },
    },
    history: [{ id: "souffle-la-plume", feedback: { result: "moyen", date: "2026-10-27" } }],
  },
];

export function getPatient(id: string) {
  return patients.find((p) => p.id === id);
}

export type AppointmentType = "Séance" | "Bilan" | "Point parent";

export type Appointment = {
  id: string;
  patientId: string; // "" pour un patient du cabinet qui n'utilise pas Parentons
  name?: string; // nom affiché pour ces patients-là
  start: string; // ISO local, sans fuseau
  duration: number; // minutes
  type: AppointmentType;
  place: "Cabinet" | "Visio";
  note?: string;
};

export const appointmentTypes: AppointmentType[] = ["Séance", "Bilan", "Point parent"];

const parentonsAppointments: Appointment[] = [
  { id: "r1", patientId: "lina", start: "2026-11-04T09:00:00", duration: 45, type: "Séance", place: "Cabinet" },
  { id: "r2", patientId: "ines", start: "2026-11-04T14:00:00", duration: 45, type: "Séance", place: "Cabinet" },
  { id: "r3", patientId: "adam", start: "2026-11-05T10:00:00", duration: 60, type: "Bilan", place: "Cabinet", note: "Suite du bilan initial" },
  { id: "r4", patientId: "noah", start: "2026-11-05T17:00:00", duration: 30, type: "Point parent", place: "Visio", note: "Faire le point sur la régularité à la maison" },
  { id: "r5", patientId: "lina", start: "2026-11-09T09:00:00", duration: 45, type: "Séance", place: "Cabinet" },
  { id: "r6", patientId: "noah", start: "2026-11-10T16:30:00", duration: 45, type: "Séance", place: "Cabinet" },
  { id: "r7", patientId: "ines", start: "2026-11-11T14:00:00", duration: 45, type: "Séance", place: "Cabinet" },
  { id: "r8", patientId: "adam", start: "2026-11-13T10:00:00", duration: 45, type: "Séance", place: "Cabinet" },
  { id: "r9", patientId: "lina", start: "2026-11-16T09:00:00", duration: 45, type: "Séance", place: "Cabinet" },
  { id: "r10", patientId: "leo", start: "2026-11-18T10:30:00", duration: 45, type: "Séance", place: "Cabinet" },
  { id: "r11", patientId: "ines", start: "2026-11-18T14:00:00", duration: 45, type: "Séance", place: "Cabinet" },
  { id: "r12", patientId: "noah", start: "2026-11-19T16:30:00", duration: 45, type: "Séance", place: "Cabinet" },
  { id: "r13", patientId: "leo", start: "2026-11-25T18:00:00", duration: 30, type: "Point parent", place: "Visio", note: "Bilan d'étape avec Sophie" },
  { id: "r14", patientId: "adam", start: "2026-11-27T10:00:00", duration: 45, type: "Séance", place: "Cabinet" },
];

// Les autres patients du cabinet (sans Parentons), pour que l'agenda ressemble à une vraie semaine.
const cabinetWeek: Record<number, [string, string, number?, AppointmentType?][]> = {
  0: [["08:30", "Hugo R."], ["10:00", "Chloé M."], ["11:00", "Mathis L.", 30], ["14:00", "Emma D."], ["15:00", "Louis P."], ["16:30", "Jade T."], ["17:30", "Nathan G."]],
  1: [["08:30", "Manon B."], ["09:30", "Gabriel F."], ["10:30", "Sarah K."], ["13:30", "Raphaël V."], ["14:30", "Zoé C."], ["16:30", "Tom H."], ["17:30", "Léna S."]],
  2: [["08:00", "Arthur N."], ["09:00", "Alice J."], ["10:30", "Paul E."], ["11:30", "Camille R."], ["15:00", "Rose A."], ["16:00", "Ethan M."], ["17:00", "Clara W."]],
  3: [["09:00", "Jules D."], ["11:00", "Ambre L."], ["14:00", "Victor B.", 60, "Bilan"], ["15:15", "Lou G."], ["16:30", "Sacha P."], ["17:30", "Eva Z."]],
  4: [["08:30", "Timéo C."], ["09:30", "Inaya O."], ["10:30", "Lucas F."], ["13:30", "Anna Y."], ["14:30", "Noé I."], ["15:30", "Lise Q."]],
};

function overlaps(a: Appointment, b: Appointment) {
  const s1 = new Date(a.start).getTime();
  const s2 = new Date(b.start).getTime();
  return s1 < s2 + b.duration * 60000 && s2 < s1 + a.duration * 60000;
}

function buildCabinet(): Appointment[] {
  const out: Appointment[] = [];
  const monday = new Date(2026, 10, 2);
  for (let week = 0; week < 4; week++) {
    for (const [weekday, slots] of Object.entries(cabinetWeek)) {
      const d = new Date(monday);
      d.setDate(d.getDate() + week * 7 + Number(weekday));
      const day = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      for (const [time, name, duration = 45, type = "Séance"] of slots) {
        const a: Appointment = { id: `c-${day}-${time}`, patientId: "", name, start: `${day}T${time}:00`, duration, type, place: "Cabinet" };
        if (!parentonsAppointments.some((p) => overlaps(p, a))) out.push(a);
      }
    }
  }
  return out;
}

export const appointments: Appointment[] = [...parentonsAppointments, ...buildCabinet()];

export function appointmentName(a: Appointment) {
  return patients.find((p) => p.id === a.patientId)?.firstName ?? a.name ?? "Patient";
}

export const weekDays = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

// Les résultats « moyen » et « difficile » regroupés par activité : ce qu'il faut retravailler.
export type ToReview = {
  activity: Activity;
  difficile: number;
  moyen: number;
  entries: { patient: Patient; feedback: Feedback }[];
};

export function summarizeToReview(rows: { patient: Patient; item: HistoryItem }[]): ToReview[] {
  const map = new Map<string, ToReview>();
  for (const { patient, item } of rows) {
    if (item.feedback.result === "reussi") continue;
    const activity = getActivity(item.id);
    if (!activity) continue;
    const entry = map.get(item.id) ?? { activity, difficile: 0, moyen: 0, entries: [] };
    entry[item.feedback.result] += 1;
    entry.entries.push({ patient, feedback: item.feedback });
    map.set(item.id, entry);
  }
  return [...map.values()]
    .map((e) => ({ ...e, entries: e.entries.sort((a, b) => b.feedback.date.localeCompare(a.feedback.date)) }))
    .sort((a, b) => b.difficile * 2 + b.moyen - (a.difficile * 2 + a.moyen));
}
