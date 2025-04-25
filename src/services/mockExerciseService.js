/**
 * Mock data service for exercise generation
 * This replaces the server API calls with client-side mock data
 */

// Sample vocabulary exercises
const vocabularyExercises = {
  beginner: {
    vocabulary: [
      "casa (house)",
      "perro (dog)",
      "gato (cat)",
      "libro (book)",
      "agua (water)",
      "comida (food)",
      "amigo (friend)",
      "familia (family)"
    ],
    fillBlanks: [
      "Mi ____ es grande. (house)",
      "El ____ es un animal. (dog)",
      "Me gusta leer un ____. (book)",
      "Necesito beber ____. (water)",
      "Mi ____ es muy amable. (friend)"
    ],
    matching: [
      "Match the words: casa - house, perro - dog, gato - cat, libro - book",
      "Match the words: agua - water, comida - food, amigo - friend, familia - family"
    ],
    questions: [
      "¿Qué es 'casa' en inglés?",
      "¿Cuál es la palabra para 'dog'?",
      "¿Cómo se dice 'book' en español?"
    ]
  },
  intermediate: {
    vocabulary: [
      "desarrollar (to develop)",
      "conseguir (to get/achieve)",
      "mientras (while)",
      "sin embargo (however)",
      "según (according to)",
      "a través de (through)",
      "a pesar de (despite)"
    ],
    fillBlanks: [
      "Necesito ____ mis habilidades. (to develop)",
      "Quiero ____ un buen trabajo. (to get/achieve)",
      "____ estudio, escucho música. (while)",
      "Me gusta el café, ____, prefiero el té por la noche. (however)",
      "____ el profesor, el examen será difícil. (according to)"
    ],
    matching: [
      "Match the phrases: a través de - through, a pesar de - despite, sin embargo - however, según - according to"
    ],
    questions: [
      "¿Cuál es la diferencia entre 'conseguir' y 'obtener'?",
      "¿Cómo usarías 'sin embargo' en una frase?",
      "Explica el uso de 'a pesar de'."
    ]
  },
  advanced: {
    vocabulary: [
      "imprescindible (essential)",
      "desempeñar (to perform/carry out)",
      "plantear (to pose/raise)",
      "cuestionar (to question)",
      "ámbito (field/sphere)",
      "vigente (current/in force)",
      "matiz (nuance)"
    ],
    fillBlanks: [
      "Es ____ tener experiencia para este trabajo. (essential)",
      "El actor debe ____ varios papeles en la obra. (to perform)",
      "Vamos a ____ algunas preguntas difíciles. (to pose/raise)",
      "Es importante ____ las ideas tradicionales. (to question)",
      "Este tema pertenece al ____ de la filosofía. (field/sphere)"
    ],
    matching: [
      "Match the words: imprescindible - essential, desempeñar - to perform, plantear - to pose, cuestionar - to question",
      "Match the words: ámbito - field/sphere, vigente - current/in force, matiz - nuance"
    ],
    questions: [
      "Explica la diferencia entre 'plantear' y 'proponer'.",
      "¿Cómo usarías 'matiz' en una frase?",
      "¿En qué contextos se utiliza la palabra 'ámbito'?"
    ]
  }
};

// Sample grammar exercises
const grammarExercises = {
  beginner: {
    grammarPoints: [
      "Present tense conjugation: -ar verbs (hablar, cantar, estudiar)",
      "Present tense conjugation: -er verbs (comer, beber, leer)",
      "Present tense conjugation: -ir verbs (vivir, escribir, abrir)",
      "Gender and number agreement with nouns and adjectives"
    ],
    transformations: [
      "Change to plural: El libro rojo → Los libros rojos",
      "Change to feminine: El niño alto → La niña alta",
      "Change to present tense: Yo (comer) → Yo como",
      "Change to negative: Tú hablas español → Tú no hablas español"
    ],
    corrections: [
      "Correct: 'Yo soy estudiante' (not 'Yo es estudiante')",
      "Correct: 'La casa blanca' (not 'La casa blanco')",
      "Correct: 'Ellos tienen dos perros' (not 'Ellos tienen dos perro')",
      "Correct: 'Nosotros hablamos español' (not 'Nosotros hablamos españoles')"
    ],
    questions: [
      "¿Cómo se conjuga el verbo 'hablar' en presente?",
      "¿Cuál es la forma correcta: 'la problema' o 'el problema'?",
      "¿Cómo se forma el plural de 'lápiz'?"
    ]
  },
  intermediate: {
    grammarPoints: [
      "Past tenses: Preterite vs Imperfect",
      "Subjunctive mood: Present subjunctive",
      "Direct and indirect object pronouns",
      "Reflexive verbs and pronouns"
    ],
    transformations: [
      "Change to preterite: Yo como → Yo comí",
      "Change to imperfect: Ella estudia → Ella estudiaba",
      "Use subjunctive: Quiero que tú (venir) → Quiero que tú vengas",
      "Add object pronouns: Yo doy el libro a María → Yo se lo doy"
    ],
    corrections: [
      "Correct: 'Ayer fui al cine' (not 'Ayer iba al cine')",
      "Correct: 'Me ducho todos los días' (not 'Yo ducho todos los días')",
      "Correct: 'Quiero que vengas' (not 'Quiero que vienes')",
      "Correct: 'Te lo dije' (not 'Lo te dije')"
    ],
    questions: [
      "¿Cuándo se usa el pretérito y cuándo el imperfecto?",
      "¿Cómo se forma el presente de subjuntivo?",
      "Explica el orden de los pronombres de objeto directo e indirecto."
    ]
  },
  advanced: {
    grammarPoints: [
      "Conditional perfect and future perfect tenses",
      "Past subjunctive and if clauses",
      "Passive voice and impersonal expressions",
      "Reported speech and sequence of tenses"
    ],
    transformations: [
      "Change to conditional perfect: Yo viajo → Yo habría viajado",
      "Change to past subjunctive: Es importante que estudies → Era importante que estudiaras",
      "Change to passive voice: Los estudiantes hacen los ejercicios → Los ejercicios son hechos por los estudiantes",
      "Change to reported speech: Ella dice: 'Estoy cansada' → Ella dijo que estaba cansada"
    ],
    corrections: [
      "Correct: 'Si hubiera tenido tiempo, habría ido' (not 'Si habría tenido tiempo, hubiera ido')",
      "Correct: 'Se venden casas' (not 'Casas se venden')",
      "Correct: 'Me preguntó si había terminado' (not 'Me preguntó si he terminado')",
      "Correct: 'Habría venido si me lo hubieras dicho' (not 'Habría venido si me lo habrías dicho')"
    ],
    questions: [
      "Explica la diferencia entre el condicional simple y el condicional perfecto.",
      "¿Cómo se forma la voz pasiva en español?",
      "¿Qué cambios se producen en el estilo indirecto?"
    ]
  }
};

// Sample comprehension exercises
const comprehensionExercises = {
  beginner: {
    multipleChoice: [
      "¿Dónde vive Juan? a) En Madrid b) En Barcelona c) En Sevilla",
      "¿Qué le gusta hacer a María? a) Leer b) Nadar c) Bailar",
      "¿Cuántos hermanos tiene Pedro? a) Uno b) Dos c) Tres"
    ],
    trueFalse: [
      "Juan vive en Madrid. (Verdadero/Falso)",
      "A María le gusta nadar. (Verdadero/Falso)",
      "Pedro tiene dos hermanos. (Verdadero/Falso)"
    ],
    shortAnswer: [
      "¿Dónde vive Juan?",
      "¿Qué le gusta hacer a María?",
      "¿Cuántos hermanos tiene Pedro?"
    ],
    summary: [
      "Escribe un resumen breve sobre Juan, María y Pedro."
    ]
  },
  intermediate: {
    multipleChoice: [
      "¿Por qué decidió Carmen estudiar medicina? a) Por influencia familiar b) Por vocación c) Por las oportunidades laborales",
      "¿Qué obstáculos enfrentó durante sus estudios? a) Problemas económicos b) Dificultad con algunas materias c) Falta de tiempo",
      "¿Cómo superó estos obstáculos? a) Con ayuda de su familia b) Estudiando más c) Organizando mejor su tiempo"
    ],
    trueFalse: [
      "Carmen decidió estudiar medicina por vocación. (Verdadero/Falso)",
      "No tuvo ningún obstáculo durante sus estudios. (Verdadero/Falso)",
      "Superó los obstáculos con ayuda de su familia. (Verdadero/Falso)"
    ],
    shortAnswer: [
      "¿Por qué decidió Carmen estudiar medicina?",
      "¿Qué obstáculos enfrentó durante sus estudios?",
      "¿Cómo superó estos obstáculos?"
    ],
    summary: [
      "Escribe un resumen sobre la experiencia de Carmen en la facultad de medicina."
    ]
  },
  advanced: {
    multipleChoice: [
      "¿Cuál es la tesis principal del autor? a) La tecnología mejora la calidad de vida b) La tecnología tiene efectos negativos en la sociedad c) La tecnología tiene tanto efectos positivos como negativos",
      "¿Qué evidencia presenta para apoyar su argumento? a) Estudios científicos b) Experiencias personales c) Opiniones de expertos",
      "¿Qué solución propone el autor? a) Reducir el uso de tecnología b) Usar la tecnología de manera más consciente c) Desarrollar nuevas tecnologías"
    ],
    trueFalse: [
      "El autor argumenta que la tecnología solo tiene efectos negativos. (Verdadero/Falso)",
      "El autor presenta estudios científicos como evidencia. (Verdadero/Falso)",
      "El autor propone usar la tecnología de manera más consciente. (Verdadero/Falso)"
    ],
    shortAnswer: [
      "¿Cuál es la tesis principal del autor?",
      "¿Qué evidencia presenta para apoyar su argumento?",
      "¿Qué solución propone el autor?"
    ],
    summary: [
      "Escribe un resumen del argumento del autor sobre los efectos de la tecnología en la sociedad."
    ]
  }
};

// Sample mixed exercises
const mixedExercises = {
  beginner: {
    vocabulary: vocabularyExercises.beginner.vocabulary.slice(0, 4),
    grammar: grammarExercises.beginner.grammarPoints.slice(0, 2),
    comprehension: comprehensionExercises.beginner.shortAnswer.slice(0, 2),
    discussion: [
      "¿Te gusta aprender idiomas? ¿Por qué?",
      "¿Qué actividades haces para practicar español?"
    ]
  },
  intermediate: {
    vocabulary: vocabularyExercises.intermediate.vocabulary.slice(0, 4),
    grammar: grammarExercises.intermediate.grammarPoints.slice(0, 2),
    comprehension: comprehensionExercises.intermediate.shortAnswer.slice(0, 2),
    discussion: [
      "¿Cómo ha cambiado tu vida desde que empezaste a aprender español?",
      "¿Qué aspectos del español te parecen más difíciles? ¿Por qué?"
    ]
  },
  advanced: {
    vocabulary: vocabularyExercises.advanced.vocabulary.slice(0, 4),
    grammar: grammarExercises.advanced.grammarPoints.slice(0, 2),
    comprehension: comprehensionExercises.advanced.shortAnswer.slice(0, 2),
    discussion: [
      "¿Cómo influye el idioma en la forma de pensar de una cultura?",
      "¿Qué papel juega el español en el mundo actual y cómo crees que evolucionará en el futuro?"
    ]
  }
};

/**
 * Generate mock exercises based on the input parameters
 * @param {Object} params - The parameters for generating exercises
 * @param {string} params.text - The text to analyze
 * @param {string} params.targetLanguage - The target language
 * @param {string} params.proficiencyLevel - The user's proficiency level
 * @param {string} params.exerciseType - The type of exercises to generate
 * @returns {Object} - The generated exercises
 */
export const generateExercises = (params) => {
  const { text, targetLanguage, proficiencyLevel, exerciseType } = params;
  
  // Select exercises based on type and proficiency level
  let exercises;
  
  switch (exerciseType) {
    case 'vocabulary':
      exercises = vocabularyExercises[proficiencyLevel] || vocabularyExercises.intermediate;
      break;
    case 'grammar':
      exercises = grammarExercises[proficiencyLevel] || grammarExercises.intermediate;
      break;
    case 'comprehension':
      exercises = comprehensionExercises[proficiencyLevel] || comprehensionExercises.intermediate;
      break;
    case 'mixed':
    default:
      exercises = mixedExercises[proficiencyLevel] || mixedExercises.intermediate;
      break;
  }
  
  // Add a custom exercise based on the input text
  if (text && text.length > 10) {
    // Create a fill-in-the-blanks exercise from the input text
    const words = text.split(' ');
    if (words.length > 5) {
      const randomIndex = Math.floor(Math.random() * (words.length - 4)) + 2;
      const blankWord = words[randomIndex];
      words[randomIndex] = '____';
      
      const customExercise = words.join(' ') + ` (${blankWord})`;
      
      // Add the custom exercise to the appropriate section
      if (exerciseType === 'vocabulary' && exercises.fillBlanks) {
        exercises.fillBlanks.unshift(customExercise);
      } else if (exerciseType === 'grammar' && exercises.transformations) {
        exercises.transformations.unshift(`Complete: ${customExercise}`);
      } else if (exerciseType === 'mixed' && exercises.vocabulary) {
        exercises.vocabulary.unshift(`New word: ${blankWord}`);
      }
    }
  }
  
  return exercises;
};

export default {
  generateExercises
};
