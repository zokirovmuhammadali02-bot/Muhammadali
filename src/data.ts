import { Question } from "./types";

export interface CuratedQuestion extends Question {
  level: "Elementary" | "Intermediate" | "Advanced";
  category: "Grammar" | "Vocabulary" | "Reading";
}

export const CURATED_QUESTIONS: CuratedQuestion[] = [
  // Elementary Grammar
  {
    level: "Elementary",
    category: "Grammar",
    q: "Each of the classrooms ___ a white board.",
    opts: ["have", "has", "are having", "were having"],
    ans: 1,
    explanation: "'Each' (har biri) yakka olmosh hisoblanadi, shuning uchun birlik shaklidagi fe'l 'has' ishlatiladi. 'Klasslarning har biri oq doskaga ega' deb tarjima qilinadi."
  },
  {
    level: "Elementary",
    category: "Grammar",
    q: "She ___ to the market yesterday morning.",
    opts: ["goes", "went", "has gone", "going"],
    ans: 1,
    explanation: "'Yesterday morning' (kecha ertalab) o'tgan zamon kalit so'zi hisoblanadi. Shuning uchun fe'lning II-shakli (Past Simple) - 'went' to'g'ri keladi."
  },
  {
    level: "Elementary",
    category: "Grammar",
    q: "There ___ two kittens sleeping under my bed.",
    opts: ["is", "am", "are", "was"],
    ans: 2,
    explanation: "Gap ko'plikda ('two kittens') berilgan. Hozirgi zamonda ko'plik uchun 'There are' birikmasi qo'llaniladi."
  },
  {
    level: "Elementary",
    category: "Grammar",
    q: "Choose the correct article: 'I saw ___ unique sculpture at the gallery.'",
    opts: ["a", "an", "the", "no article"],
    ans: 0,
    explanation: "'Unique' so'zi unli harf bilan boshlansa-da, u undosh 'y' /juː/ tovushi bilan talaffuz qilinadi. Shuning uchun noaniq 'a' artikli to'g'ri."
  },
  {
    level: "Elementary",
    category: "Grammar",
    q: "My cousin is older ___ me.",
    opts: ["then", "as", "than", "more"],
    ans: 2,
    explanation: "Solishtirma sifat darajasida kishilarni taqqoslash uchun 'than' (qaraganda) so'zi ishlatiladi. 'Mening amakivachcham mendan ko'ra yoshoroq'."
  },

  // Elementary Vocabulary
  {
    level: "Elementary",
    category: "Vocabulary",
    q: "What is the antonym of the word 'heavy'?",
    opts: ["thin", "easy", "light", "soft"],
    ans: 2,
    explanation: "'Heavy' tarjimasi 'og'ir' degani. Uning antonimi (teskari ma'nolisi) esa 'light' (engil; shuningdek, yorug' degan ma'nosi ham bor)."
  },
  {
    level: "Elementary",
    category: "Vocabulary",
    q: "Which of the following is associated with the 'kitchen'?",
    opts: ["pillow", "refrigerator", "shampoo", "wardrobe"],
    ans: 1,
    explanation: "'Refrigerator' (muzlatgich) oshxonaga tegishli bo'lgan maishiy texnika vositasi hisoblanadi. Pillow (yastiq), Shampoo (shampun), Wardrobe (shkaf) boshqa xonalarga mos."
  },
  {
    level: "Elementary",
    category: "Vocabulary",
    q: "What does the word 'frequent' mean in Uzbek?",
    opts: ["kamdan-kam", "shoshilinch", "tez-tez sodir bo'ladigan", "foydali"],
    ans: 2,
    explanation: "Ingliz tilidagi 'frequent' so'zi o'zbek tiliga 'tez-tez bo'lib turadigan', 'serqatnov' deb tarjima qilinadi (masalan, frequent flights)."
  },
  {
    level: "Elementary",
    category: "Vocabulary",
    q: "Fill in the blank: 'Please turn ___ the lights before sleeping.'",
    opts: ["down", "up", "off", "away"],
    ans: 2,
    explanation: "Chiroq yoki elektr jihozlarini o'chirish uchun 'turn off', yoqish uchun esa 'turn on' frazali fe'llari qo'llaniladi."
  },
  {
    level: "Elementary",
    category: "Vocabulary",
    q: "Which word means 'katta' in English size description?",
    opts: ["small", "narrow", "large", "tiny"],
    ans: 2,
    explanation: "'Large' ingliz tilida 'katta', 'keng' degan o'lchamni bildiradi. Small va tiny esa kichiklik ma'nosida."
  },

  // Intermediate Grammar
  {
    level: "Intermediate",
    category: "Grammar",
    q: "If I ___ you, I would study harder for the upcoming exam.",
    opts: ["am", "was", "were", "been"],
    ans: 2,
    explanation: "Bu Conditional Type 2 (amalga oshishi qiyin bo'lgan hozirgi istak). Rasmiy ingliz tilida maslahat berganda hamma shaxslar uchun 'If I were you' birikmasi to'g'ri."
  },
  {
    level: "Intermediate",
    category: "Grammar",
    q: "By the time we arrived at the cinema, the movie ___.",
    opts: ["starts", "has started", "started", "had started"],
    ans: 3,
    explanation: "O'tmishda sodir bo'lgan ikki ish-harakatdan birinchisi (biz yetib borishimizdan oldin film boshlangani) uchun Past Perfect ('had started') ishlatiladi."
  },
  {
    level: "Intermediate",
    category: "Grammar",
    q: "We are look forward to ___ our new grand-grandchildren next Sunday.",
    opts: ["seen", "see", "seeing", "have seen"],
    ans: 2,
    explanation: "'Look forward to' (intiqlik bilan kutmoq) idiomasidan so'ng har doim Gerund (-ing olgan) fe'l ishlatiladi. Shuning uchun 'seeing' to'g'ri."
  },
  {
    level: "Intermediate",
    category: "Grammar",
    q: "The news about the accident ___ shocking.",
    opts: ["was", "were", "are", "have been"],
    ans: 0,
    explanation: "'News' (yangilik) ingliz tilida sanalmaydigan otlar sirasiga kiradi va har doim birlik fe'lni ('was') talab qiladi."
  },
  {
    level: "Intermediate",
    category: "Grammar",
    q: "He denies ___ the money from the secure safe.",
    opts: ["steal", "to steal", "stealing", "stole"],
    ans: 2,
    explanation: "'Deny' (rad etmoq) fe'lidan keyin fe'lning orqasiga '-ing' qo'shimchasi qo'yiladi (Gerund). To'g'ri javob 'stealing'."
  },

  // Intermediate Vocabulary
  {
    level: "Intermediate",
    category: "Vocabulary",
    q: "What does the idiomatic expression 'break a leg' mean?",
    opts: ["Suyakni sindirish", "Omad tilash", "Yiqilib tushish", "Raqsga tushish"],
    ans: 1,
    explanation: "'Break a leg' - bu ingliz tilida sahnaga chiqadigan aktyor yoki san'atkorlarga ishlatiladigan 'Omad yor bo'lsin!' degan mashhur ko'chma ma'nodagi iboradir."
  },
  {
    level: "Intermediate",
    category: "Vocabulary",
    q: "Which word is a synonym for 'generous'?",
    opts: ["greedy", "benevolent", "industrious", "hostile"],
    ans: 1,
    explanation: "'Generous' - saxovatpesha, oliyjanob degani. 'Benevolent' ham xayrixoh, saxiy va rahmdil odamlarga nisbatan sinonim sifatida ishlatiladi."
  },
  {
    level: "Intermediate",
    category: "Vocabulary",
    q: "A person who is 'reluctant' is best described as:",
    opts: ["shoshilayotgan", "ishonchsiz va istamasdan qiladigan", "juda sabrli", "do'stona"],
    ans: 1,
    explanation: "'Reluctant' so'zi biror ishni qilishni unchalik istamaydigan, ikkilanuvchi va xohishsiz odamni tasvirlaydi."
  },
  {
    level: "Intermediate",
    category: "Vocabulary",
    q: "Choose the correct compound word: 'She received a ___ offer that she couldn't refuse.'",
    opts: ["once-in-a-lifetime", "once-in-lifetime", "once-life", "once-lifetime"],
    ans: 0,
    explanation: "'Once-in-a-lifetime' birikmasi 'hayotda bir marta beriladigan juda noyob imkoniyat' degan ma'noni beradi va chiziqchalar bilan yoziladi."
  },
  {
    level: "Intermediate",
    category: "Vocabulary",
    q: "What does the word 'vivid' mean?",
    opts: ["zerikarli", "yaxshi tushunilmagan", "yorqin va to'yingan", "og'riqli"],
    ans: 2,
    explanation: "'Vivid' so'zi xotira, rang yoki tasavvurlar uchun ishlatilib, uning o'zbekcha tarjimasi 'yorqin', 'aniq' yoki 'jonli' (masalan, vivid memories) deganidir."
  },

  // Advanced Grammar
  {
    level: "Advanced",
    category: "Grammar",
    q: "Hardly ___ entered the room when the light went off.",
    opts: ["I had", "had I", "I have", "has I"],
    ans: 1,
    explanation: "Gap boshida inkor ma'nosidagi 'Hardly' ravishi ishlatilganda gapda inversiya (fe'l egadan oldinga o'tib ketishi) sodir bo'ladi. 'had I' to'g'ri."
  },
  {
    level: "Advanced",
    category: "Grammar",
    q: "It is vital that the project manager ___ notified of these budget changes immediately.",
    opts: ["is", "was", "be", "being"],
    ans: 2,
    explanation: "Bu Subjunctive Mood (istak-buyruq mayli). 'It is vital/essential that' kabi boshlanmalardan keyin har doim shaklsiz asil fe'l (be) qo'llanadi."
  },
  {
    level: "Advanced",
    category: "Grammar",
    q: "___ known about his deceptive character, I would never have trusted him.",
    opts: ["If I have", "Should I have", "Had I", "Did I"],
    ans: 2,
    explanation: "Bu uchinchi tur shart gaplarining inversiya (shart bog'lovchisiz) shaklidir. 'If I had known' o'rniga 'Had I known' deb yozish mumkin."
  },
  {
    level: "Advanced",
    category: "Grammar",
    q: "The supervisor recommended that Alice ___ her thesis before submitting.",
    opts: ["revises", "revise", "should revise", "revising"],
    ans: 1,
    explanation: "Recommended dan keyingi 'that' bog'lovchili gapda Subjunctive Mood qo'llaniladi. Alice birlikda bo'lsa ham fe'lning asil ko'rinishi ('revise') yoziladi."
  },
  {
    level: "Advanced",
    category: "Grammar",
    q: "No sooner had we reached the dry land ___ it started to pour rain.",
    opts: ["when", "then", "than", "before"],
    ans: 2,
    explanation: "'No sooner' iborasi o'zi bilan birga 'than' bog'lovchisini talab qiladi (Hardly/Scarcely esa 'when' bog'lovchisini). Tarjimasi: 'Erga chiqishimiz bilan yomg'ir quydirib yubordi'."
  },

  // Advanced Vocabulary
  {
    level: "Advanced",
    category: "Vocabulary",
    q: "Which of the following words means 'juda tejamkor yoki ziqna'?",
    opts: ["parsimonious", "magnanimous", "prodigal", "audacious"],
    ans: 0,
    explanation: "'Parsimonious' so'zi haddan tashqari tejamkor yoki pul sarflashga umuman xohishi yo'q 'ziqna', 'qizg'anchiq' odamlarga nisbatan ishlatiladi."
  },
  {
    level: "Advanced",
    category: "Vocabulary",
    q: "What is the meaning of the word 'ephemeral'?",
    opts: ["bardoshli va doimiy", "bir lahzalik yoki o'tkinchi", "juda sirli", "haddan tashqari baland"],
    ans: 1,
    explanation: "'Ephemeral' so'zi tabiatan juda qisqa vaqt yashaydigan yoki qisqa muddatli 'o'tkinchi', 'vaqtinchalik' narsalarga nisbatan qo'llaniladi."
  },
  {
    level: "Advanced",
    category: "Vocabulary",
    q: "If someone is described as 'indefatigable', they are:",
    opts: ["tezda g'azablanadigan", "hech qachon charchamaydigan, g'ayratli", "juda dangasa", "shubhalanuvchan"],
    ans: 1,
    explanation: "Indefatigable - bu toymas, hech qachon tolmaydigan, o'z maqsadiga charchamay harakat qiladigan g'ayratli odamlarni tasvirlaydi."
  },
  {
    level: "Advanced",
    category: "Vocabulary",
    q: "The word 'cacophony' refers to:",
    opts: ["yoqimli va mayin navo", "quloqni teshuvchi tartibsiz shovqin", "chuqur falsafa", "sirli marosim"],
    ans: 1,
    explanation: "'Cacophony' - yunoncha so'z bo'lib, har xil yoqimsiz, tartibsiz va quloqqa yoqmaydigan shovqin-suronlarni (kakofoniya) bildiradi."
  },
  {
    level: "Advanced",
    category: "Vocabulary",
    q: "Select the synonym of 'lucrative':",
    opts: ["difficult", "unprofitable", "profitable", "dangerous"],
    ans: 2,
    explanation: "'Lucrative' so'zi ko'p foyda yoki daromad keltiradigan 'daromadli', 'serdaromad' (masalan, lucrative business) degan ma'noni anglatadi."
  }
];

export function getRandomQuestions(level: string, category: string, count: number = 15): Question[] {
  let list = CURATED_QUESTIONS;
  
  if (level && level !== "Aralash") {
    list = list.filter(q => q.level === level);
  }
  
  if (category && category !== "Aralash") {
    list = list.filter(q => q.category === category);
  }

  // Shuffle
  const shuffled = [...list].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
