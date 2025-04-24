import React, { useState } from 'react';
import { speakText, fallbackTextToSpeech, isSpeechSynthesisLanguageSupported } from '../utils/speechUtils';
import { motion } from 'framer-motion';

const commonPhrases = [
  {
    category: "Greetings",
    phrases: [
      { english: "Hello", spanish: "Hola", french: "Bonjour", japanese: "こんにちは", chinese: "你好", german: "Hallo", italian: "Ciao", portuguese: "Olá", russian: "Привет", korean: "안녕하세요", arabic: "مرحبا", hindi: "नमस्ते" },
      { english: "Good morning", spanish: "Buenos días", french: "Bonjour", japanese: "おはようございます", chinese: "早上好", german: "Guten Morgen", italian: "Buongiorno", portuguese: "Bom dia", russian: "Доброе утро", korean: "좋은 아침", arabic: "صباح الخير", hindi: "सुप्रभात" },
      { english: "Good evening", spanish: "Buenas noches", french: "Bonsoir", japanese: "こんばんは", chinese: "晚上好", german: "Guten Abend", italian: "Buonasera", portuguese: "Boa noite", russian: "Добрый вечер", korean: "안녕하세요", arabic: "مساء الخير", hindi: "शुभ संध्या" },
      { english: "Goodbye", spanish: "Adiós", french: "Au revoir", japanese: "さようなら", chinese: "再见", german: "Auf Wiedersehen", italian: "Arrivederci", portuguese: "Adeus", russian: "До свидания", korean: "안녕히 가세요", arabic: "مع السلامة", hindi: "अलविदा" },
      { english: "Thank you", spanish: "Gracias", french: "Merci", japanese: "ありがとう", chinese: "谢谢", german: "Danke", italian: "Grazie", portuguese: "Obrigado/a", russian: "Спасибо", korean: "감사합니다", arabic: "شكرا", hindi: "धन्यवाद" },
      { english: "You're welcome", spanish: "De nada", french: "De rien", japanese: "どういたしまして", chinese: "不客气", german: "Bitte", italian: "Prego", portuguese: "De nada", russian: "Пожалуйста", korean: "천만에요", arabic: "عفوا", hindi: "आपका स्वागत है" },
      { english: "Excuse me", spanish: "Disculpe", french: "Excusez-moi", japanese: "すみません", chinese: "对不起", german: "Entschuldigung", italian: "Scusi", portuguese: "Com licença", russian: "Извините", korean: "실례합니다", arabic: "عذرا", hindi: "क्षमा करें" },
    ]
  },
  {
    category: "Transportation",
    phrases: [
      { english: "Where is the train station?", spanish: "¿Dónde está la estación de tren?", french: "Où est la gare?", japanese: "駅はどこですか？", chinese: "火车站在哪里？", german: "Wo ist der Bahnhof?", italian: "Dov'è la stazione ferroviaria?", portuguese: "Onde fica a estação de trem?", russian: "Где находится вокзал?", korean: "기차역이 어디에 있나요?", arabic: "أين محطة القطار؟", hindi: "रेलवे स्टेशन कहां है?" },
      { english: "How much is a taxi to...?", spanish: "¿Cuánto cuesta un taxi a...?", french: "Combien coûte un taxi pour...?", japanese: "...までタクシーはいくらですか？", chinese: "到...的出租车多少钱？", german: "Wie viel kostet ein Taxi nach...?", italian: "Quanto costa un taxi per...?", portuguese: "Quanto custa um táxi para...?", russian: "Сколько стоит такси до...?", korean: "...까지 택시 요금이 얼마인가요?", arabic: "كم تكلفة سيارة أجرة إلى...؟", hindi: "...तक टैक्सी का कितना किराया है?" },
      { english: "I need a bus ticket", spanish: "Necesito un billete de autobús", french: "J'ai besoin d'un ticket de bus", japanese: "バスのチケットが必要です", chinese: "我需要一张公交车票", german: "Ich brauche eine Busfahrkarte", italian: "Ho bisogno di un biglietto dell'autobus", portuguese: "Preciso de um bilhete de ônibus", russian: "Мне нужен билет на автобус", korean: "버스 티켓이 필요합니다", arabic: "أحتاج تذكرة حافلة", hindi: "मुझे बस टिकट चाहिए" },
      { english: "Is this the right way to...?", spanish: "¿Es este el camino correcto para...?", french: "Est-ce le bon chemin pour...?", japanese: "...への正しい道はこれですか？", chinese: "这是去...的正确方向吗？", german: "Ist dies der richtige Weg nach...?", italian: "È questa la strada giusta per...?", portuguese: "Este é o caminho certo para...?", russian: "Это правильный путь к...?", korean: "...로 가는 올바른 길인가요?", arabic: "هل هذا هو الطريق الصحيح إلى...؟", hindi: "क्या यह...का सही रास्ता है?" },
    ]
  },
  {
    category: "Accommodation",
    phrases: [
      { english: "I have a reservation", spanish: "Tengo una reserva", french: "J'ai une réservation", japanese: "予約があります", chinese: "我有预订", german: "Ich habe eine Reservierung", italian: "Ho una prenotazione", portuguese: "Tenho uma reserva", russian: "У меня есть бронь", korean: "예약이 있습니다", arabic: "لدي حجز", hindi: "मेरे पास आरक्षण है" },
      { english: "Do you have any rooms available?", spanish: "¿Tienen habitaciones disponibles?", french: "Avez-vous des chambres disponibles?", japanese: "空室はありますか？", chinese: "有空房间吗？", german: "Haben Sie freie Zimmer?", italian: "Avete camere disponibili?", portuguese: "Vocês têm quartos disponíveis?", russian: "Есть ли у вас свободные номера?", korean: "가능한 객실이 있나요?", arabic: "هل لديكم غرف متاحة؟", hindi: "क्या आपके पास कोई कमरे उपलब्ध हैं?" },
      { english: "How much per night?", spanish: "¿Cuánto cuesta por noche?", french: "Combien par nuit?", japanese: "一泊いくらですか？", chinese: "每晚多少钱？", german: "Wie viel kostet es pro Nacht?", italian: "Quanto costa per notte?", portuguese: "Quanto custa por noite?", russian: "Сколько стоит за ночь?", korean: "하루 얼마인가요?", arabic: "كم التكلفة لليلة الواحدة؟", hindi: "प्रति रात कितना है?" },
      { english: "Is breakfast included?", spanish: "¿El desayuno está incluido?", french: "Le petit-déjeuner est-il inclus?", japanese: "朝食は含まれていますか？", chinese: "包含早餐吗？", german: "Ist Frühstück inklusive?", italian: "La colazione è inclusa?", portuguese: "O café da manhã está incluído?", russian: "Завтрак включен?", korean: "아침 식사가 포함되어 있나요?", arabic: "هل الإفطار مشمول؟", hindi: "क्या नाश्ता शामिल है?" },
    ]
  },
  {
    category: "Dining",
    phrases: [
      { english: "A table for two, please", spanish: "Una mesa para dos, por favor", french: "Une table pour deux, s'il vous plaît", japanese: "二人用のテーブルをお願いします", chinese: "请给我一张双人桌", german: "Einen Tisch für zwei, bitte", italian: "Un tavolo per due, per favore", portuguese: "Uma mesa para dois, por favor", russian: "Столик на двоих, пожалуйста", korean: "두 명을 위한 테이블 부탁합니다", arabic: "طاولة لشخصين ، من فضلك", hindi: "दो लोगों के लिए एक मेज, कृपया" },
      { english: "The menu, please", spanish: "La carta, por favor", french: "Le menu, s'il vous plaît", japanese: "メニューをお願いします", chinese: "请给我菜单", german: "Die Speisekarte, bitte", italian: "Il menù, per favore", portuguese: "O cardápio, por favor", russian: "Меню, пожалуйста", korean: "메뉴 부탁합니다", arabic: "قائمة الطعام ، من فضلك", hindi: "मेनू, कृपया" },
      { english: "I am vegetarian", spanish: "Soy vegetariano/a", french: "Je suis végétarien(ne)", japanese: "私はベジタリアンです", chinese: "我是素食主义者", german: "Ich bin Vegetarier(in)", italian: "Sono vegetariano/a", portuguese: "Eu sou vegetariano/a", russian: "Я вегетарианец", korean: "저는 채식주의자입니다", arabic: "أنا نباتي", hindi: "मैं शाकाहारी हूं" },
      { english: "The bill, please", spanish: "La cuenta, por favor", french: "L'addition, s'il vous plaît", japanese: "お会計をお願いします", chinese: "请结账", german: "Die Rechnung, bitte", italian: "Il conto, per favore", portuguese: "A conta, por favor", russian: "Счет, пожалуйста", korean: "계산서 부탁합니다", arabic: "الحساب ، من فضلك", hindi: "बिल, कृपया" },
    ]
  },
  {
    category: "Emergency",
    phrases: [
      { english: "Help!", spanish: "¡Ayuda!", french: "Au secours!", japanese: "助けて！", chinese: "救命！", german: "Hilfe!", italian: "Aiuto!", portuguese: "Socorro!", russian: "Помогите!", korean: "도와주세요!", arabic: "مساعدة!", hindi: "बचाओ!" },
      { english: "I need a doctor", spanish: "Necesito un médico", french: "J'ai besoin d'un médecin", japanese: "医者が必要です", chinese: "我需要医生", german: "Ich brauche einen Arzt", italian: "Ho bisogno di un medico", portuguese: "Preciso de um médico", russian: "Мне нужен врач", korean: "의사가 필요합니다", arabic: "أحتاج طبيبا", hindi: "मुझे डॉक्टर चाहिए" },
      { english: "Call the police", spanish: "Llame a la policía", french: "Appelez la police", japanese: "警察を呼んでください", chinese: "叫警察", german: "Rufen Sie die Polizei", italian: "Chiami la polizia", portuguese: "Chame a polícia", russian: "Вызовите полицию", korean: "경찰을 불러주세요", arabic: "اتصل بالشرطة", hindi: "पुलिस को बुलाओ" },
      { english: "I'm lost", spanish: "Estoy perdido/a", french: "Je suis perdu(e)", japanese: "道に迷いました", chinese: "我迷路了", german: "Ich habe mich verlaufen", italian: "Mi sono perso/a", portuguese: "Estou perdido/a", russian: "Я заблудился", korean: "길을 잃었습니다", arabic: "لقد ضللت الطريق", hindi: "मैं खो गया हूं" },
    ]
  },
  {
    category: "Shopping",
    phrases: [
      { english: "How much does this cost?", spanish: "¿Cuánto cuesta esto?", french: "Combien ça coûte?", japanese: "これはいくらですか？", chinese: "这个多少钱？", german: "Wie viel kostet das?", italian: "Quanto costa questo?", portuguese: "Quanto custa isto?", russian: "Сколько это стоит?", korean: "이것은 얼마인가요?", arabic: "كم يكلف هذا؟", hindi: "यह कितने का है?" },
      { english: "That's too expensive", spanish: "Es demasiado caro", french: "C'est trop cher", japanese: "それは高すぎます", chinese: "太贵了", german: "Das ist zu teuer", italian: "È troppo costoso", portuguese: "É muito caro", russian: "Это слишком дорого", korean: "너무 비싸요", arabic: "هذا مكلف جدا", hindi: "यह बहुत महंगा है" },
      { english: "Do you have a smaller size?", spanish: "¿Tiene una talla más pequeña?", french: "Avez-vous une taille plus petite?", japanese: "もっと小さいサイズはありますか？", chinese: "有小一点的尺码吗？", german: "Haben Sie eine kleinere Größe?", italian: "Avete una taglia più piccola?", portuguese: "Tem um tamanho menor?", russian: "У вас есть размер поменьше?", korean: "더 작은 사이즈가 있나요?", arabic: "هل لديك مقاس أصغر؟", hindi: "क्या आपके पास छोटा साइज़ है?" },
      { english: "Can I try this on?", spanish: "¿Puedo probármelo?", french: "Puis-je l'essayer?", japanese: "これを試着してもいいですか？", chinese: "我可以试穿一下吗？", german: "Kann ich das anprobieren?", italian: "Posso provarlo?", portuguese: "Posso experimentar isto?", russian: "Можно это примерить?", korean: "이것을 입어볼 수 있을까요?", arabic: "هل يمكنني تجربة هذا؟", hindi: "क्या मैं इसे पहन कर देख सकता/सकती हूँ?" },
      { english: "I'll take it", spanish: "Me lo llevo", french: "Je le prends", japanese: "これをください", chinese: "我要买这个", german: "Ich nehme es", italian: "Lo prendo", portuguese: "Eu levo", russian: "Я возьму это", korean: "이것으로 할게요", arabic: "سآخذه", hindi: "मैं इसे ले लूंगा/लूंगी" },
    ]
  },
  {
    category: "Directions",
    phrases: [
      { english: "Where is the nearest...?", spanish: "¿Dónde está el/la... más cercano/a?", french: "Où est le/la... le plus proche?", japanese: "最寄りの...はどこですか？", chinese: "最近的...在哪里？", german: "Wo ist der/die/das nächste...?", italian: "Dov'è il/la... più vicino/a?", portuguese: "Onde fica o/a... mais próximo/a?", russian: "Где находится ближайший...?", korean: "가장 가까운...은 어디에 있나요?", arabic: "أين أقرب...?", hindi: "निकटतम... कहां है?" },
      { english: "Turn left", spanish: "Gire a la izquierda", french: "Tournez à gauche", japanese: "左に曲がってください", chinese: "左转", german: "Links abbiegen", italian: "Giri a sinistra", portuguese: "Vire à esquerda", russian: "Поверните налево", korean: "좌회하세요", arabic: "انعطف يسارا", hindi: "बाएं मुड़ें" },
      { english: "Turn right", spanish: "Gire a la derecha", french: "Tournez à droite", japanese: "右に曲がってください", chinese: "右转", german: "Rechts abbiegen", italian: "Giri a destra", portuguese: "Vire à direita", russian: "Поверните направо", korean: "우회하세요", arabic: "انعطف يمينا", hindi: "दाएं मुड़ें" },
      { english: "Go straight", spanish: "Siga recto", french: "Allez tout droit", japanese: "まっすぐ進んでください", chinese: "直走", german: "Geradeaus gehen", italian: "Vada dritto", portuguese: "Siga em frente", russian: "Идите прямо", korean: "직진하세요", arabic: "اذهب مباشرة", hindi: "सीधे जाएं" },
      { english: "How far is it?", spanish: "¿A qué distancia está?", french: "C'est à quelle distance?", japanese: "どれくらい距離がありますか？", chinese: "有多远？", german: "Wie weit ist es?", italian: "Quanto è lontano?", portuguese: "Fica a que distância?", russian: "Как далеко это?", korean: "얼마나 멀리 있나요?", arabic: "كم يبعد؟", hindi: "यह कितनी दूर है?" },
      { english: "Can you show me on the map?", spanish: "¿Puede mostrármelo en el mapa?", french: "Pouvez-vous me montrer sur la carte?", japanese: "地図で見せていただけますか？", chinese: "你能在地图上给我看吗？", german: "Können Sie es mir auf der Karte zeigen?", italian: "Può mostrarmi sulla mappa?", portuguese: "Pode mostrar-me no mapa?", russian: "Можете показать мне на карте?", korean: "지도에서 보여주실 수 있나요?", arabic: "هل يمكنك أن تريني على الخريطة؟", hindi: "क्या आप मुझे नक्शे पर दिखा सकते हैं?" },
    ]
  },
  {
    category: "Health",
    phrases: [
      { english: "I don't feel well", spanish: "No me siento bien", french: "Je ne me sens pas bien", japanese: "具合が悪いです", chinese: "我不舍服", german: "Ich fühle mich nicht wohl", italian: "Non mi sento bene", portuguese: "Não me sinto bem", russian: "Я плохо себя чувствую", korean: "아프네요", arabic: "لا أشعر بتحسن", hindi: "मैं ठीक महसूस नहीं कर रहा हूं" },
      { english: "I have a headache", spanish: "Tengo dolor de cabeza", french: "J'ai mal à la tête", japanese: "頭が痛いです", chinese: "我头痛", german: "Ich habe Kopfschmerzen", italian: "Ho mal di testa", portuguese: "Tenho dor de cabeça", russian: "У меня болит голова", korean: "두통이 있어요", arabic: "أعاني من صداع", hindi: "मेरे सिर में दर्द है" },
      { english: "I have a fever", spanish: "Tengo fiebre", french: "J'ai de la fièvre", japanese: "熱があります", chinese: "我发烧了", german: "Ich habe Fieber", italian: "Ho la febbre", portuguese: "Tenho febre", russian: "У меня жар", korean: "열이 있어요", arabic: "لدي حمى", hindi: "मुझे बुखार है" },
      { english: "I'm allergic to...", spanish: "Soy alérgico/a a...", french: "Je suis allergique à...", japanese: "私は...にアレルギーがあります", chinese: "我对...过敏", german: "Ich bin allergisch gegen...", italian: "Sono allergico/a a...", portuguese: "Sou alérgico/a a...", russian: "У меня аллергия на...", korean: "저는 ...에 알레르기가 있어요", arabic: "لدي حساسية من...", hindi: "मुझे ... से एलर्जी है" },
      { english: "I need this medicine", spanish: "Necesito este medicamento", french: "J'ai besoin de ce médicament", japanese: "この薬が必要です", chinese: "我需要这种药", german: "Ich brauche dieses Medikament", italian: "Ho bisogno di questa medicina", portuguese: "Preciso deste medicamento", russian: "Мне нужно это лекарство", korean: "이 약이 필요합니다", arabic: "أحتاج هذا الدواء", hindi: "मुझे यह दवा चाहिए" },
      { english: "Where is the pharmacy?", spanish: "¿Dónde está la farmacia?", french: "Où est la pharmacie?", japanese: "薬局はどこですか？", chinese: "药店在哪里？", german: "Wo ist die Apotheke?", italian: "Dov'è la farmacia?", portuguese: "Onde fica a farmácia?", russian: "Где находится аптека?", korean: "약국은 어디에 있나요?", arabic: "أين الصيدلية؟", hindi: "फार्मेसी कहां है?" },
    ]
  },
  {
    category: "Weather",
    phrases: [
      { english: "What's the weather like today?", spanish: "¿Cómo está el clima hoy?", french: "Quel temps fait-il aujourd'hui?", japanese: "今日の天気はどうですか？", chinese: "今天天气怎么样？", german: "Wie ist das Wetter heute?", italian: "Com'è il tempo oggi?", portuguese: "Como está o tempo hoje?", russian: "Какая сегодня погода?", korean: "오늘 날씨가 어때요?", arabic: "كيف الطقس اليوم؟", hindi: "आज मौसम कैसा है?" },
      { english: "It's sunny", spanish: "Está soleado", french: "Il fait soleil", japanese: "晴れています", chinese: "天气晴朗", german: "Es ist sonnig", italian: "C'è il sole", portuguese: "Está ensolarado", russian: "Солнечно", korean: "화창한 날씨예요", arabic: "إنها مشمسة", hindi: "धूप है" },
      { english: "It's raining", spanish: "Está lloviendo", french: "Il pleut", japanese: "雨が降っています", chinese: "在下雨", german: "Es regnet", italian: "Piove", portuguese: "Está chovendo", russian: "Идет дождь", korean: "비가 오고 있어요", arabic: "إنها تمطر", hindi: "बारिश हो रही है" },
      { english: "It's cold", spanish: "Hace frío", french: "Il fait froid", japanese: "寒いです", chinese: "天气很冷", german: "Es ist kalt", italian: "Fa freddo", portuguese: "Está frio", russian: "Холодно", korean: "추워요", arabic: "إنها باردة", hindi: "ठंडा है" },
      { english: "It's hot", spanish: "Hace calor", french: "Il fait chaud", japanese: "暑いです", chinese: "天气很热", german: "Es ist heiß", italian: "Fa caldo", portuguese: "Está quente", russian: "Жарко", korean: "더워요", arabic: "إنها حارة", hindi: "गर्मी है" },
      { english: "Will it rain tomorrow?", spanish: "¿Lloverá mañana?", french: "Est-ce qu'il va pleuvoir demain?", japanese: "明日は雨が降りますか？", chinese: "明天会下雨吗？", german: "Wird es morgen regnen?", italian: "Pioverà domani?", portuguese: "Vai chover amanhã?", russian: "Завтра будет дождь?", korean: "내일 비가 올까요?", arabic: "هل ستمطر غدا؟", hindi: "क्या कल बारिश होगी?" },
    ]
  },
  {
    category: "Cultural Phrases",
    phrases: [
      { english: "Cheers!", spanish: "¡Salud!", french: "Santé!", japanese: "乾杯！", chinese: "干杯！", german: "Prost!", italian: "Salute!", portuguese: "Saúde!", russian: "На здоровье!", korean: "건배!", arabic: "نخبك!", hindi: "चियर्स!" },
      { english: "Bon appetit!", spanish: "¡Buen provecho!", french: "Bon appétit!", japanese: "いただきます！", chinese: "祝您用餐愉快！", german: "Guten Appetit!", italian: "Buon appetito!", portuguese: "Bom apetite!", russian: "Приятного аппетита!", korean: "맛있게 드세요!", arabic: "بالهناء والشفاء!", hindi: "शुभ भोजन!" },
      { english: "Happy Birthday!", spanish: "¡Feliz cumpleaños!", french: "Joyeux anniversaire!", japanese: "お誕生日おめでとう！", chinese: "生日快乐！", german: "Alles Gute zum Geburtstag!", italian: "Buon compleanno!", portuguese: "Feliz aniversário!", russian: "С днём рождения!", korean: "생일 축하해요!", arabic: "عيد ميلاد سعيد!", hindi: "जन्मदिन मुबारक!" },
      { english: "I'm sorry", spanish: "Lo siento", french: "Je suis désolé(e)", japanese: "すみません", chinese: "对不起", german: "Es tut mir leid", italian: "Mi dispiace", portuguese: "Desculpe", russian: "Извините", korean: "죄송합니다", arabic: "أنا آسف", hindi: "मुझे खेद है" },
      { english: "No problem", spanish: "No hay problema", french: "Pas de problème", japanese: "問題ありません", chinese: "没问题", german: "Kein Problem", italian: "Nessun problema", portuguese: "Sem problema", russian: "Нет проблем", korean: "문제 없어요", arabic: "لا مشكلة", hindi: "कोई बात नहीं" },
      { english: "It was delicious", spanish: "Estaba delicioso", french: "C'était délicieux", japanese: "美味しかったです", chinese: "很好吃", german: "Es war köstlich", italian: "Era delizioso", portuguese: "Estava delicioso", russian: "Было очень вкусно", korean: "맛있었어요", arabic: "كان لذيذا", hindi: "बहुत स्वादिष्ट था" },
    ]
  }
];

const TravelPhrases = () => {
  const [selectedCategory, setSelectedCategory] = useState("Greetings");
  const [selectedLanguage, setSelectedLanguage] = useState("spanish");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copiedText, setCopiedText] = useState(null);

  const languages = [
    { value: "spanish", label: "Spanish", code: "es" },
    { value: "french", label: "French", code: "fr" },
    { value: "japanese", label: "Japanese", code: "ja" },
    { value: "chinese", label: "Chinese", code: "zh" },
    { value: "german", label: "German", code: "de" },
    { value: "italian", label: "Italian", code: "it" },
    { value: "portuguese", label: "Portuguese", code: "pt" },
    { value: "russian", label: "Russian", code: "ru" },
    { value: "korean", label: "Korean", code: "ko" },
    { value: "arabic", label: "Arabic", code: "ar" },
    { value: "hindi", label: "Hindi", code: "hi" }
  ];

  const currentPhrases = commonPhrases.find(cat => cat.category === selectedCategory)?.phrases || [];

  // Handle text-to-speech for phrases
  const handleSpeak = (text) => {
    if (isSpeaking) return;

    setIsSpeaking(true);

    // Get the language code for the selected language
    const langCode = languages.find(lang => lang.value === selectedLanguage)?.code || "en";

    // Try to speak the text
    const speechResult = speakText(text, langCode, () => {
      setIsSpeaking(false);
    });

    // If speech synthesis fails or isn't supported for this language, use fallback
    if (!speechResult || !isSpeechSynthesisLanguageSupported(langCode)) {
      fallbackTextToSpeech(text, langCode);
      setIsSpeaking(false);
    }
  };

  // Handle copy to clipboard
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopiedText(text);
        setTimeout(() => setCopiedText(null), 2000);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  };

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="font-pacifico bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Voxify</span> Travel Phrases
          </motion.h2>
          <motion.p
            className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Essential phrases to help you communicate during your travels
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Categories</h3>
                <nav className="space-y-2">
                  {commonPhrases.map(category => (
                    <button
                      key={category.category}
                      onClick={() => setSelectedCategory(category.category)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                        selectedCategory === category.category
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                          : 'hover:bg-gray-100 text-gray-700 dark:hover:bg-gray-700/50 dark:text-gray-300'
                      }`}
                    >
                      {category.category}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Target Language</h3>
                <div className="space-y-2">
                  {languages.map(language => (
                    <button
                      key={language.value}
                      onClick={() => setSelectedLanguage(language.value)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                        selectedLanguage === language.value
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                          : 'hover:bg-gray-100 text-gray-700 dark:hover:bg-gray-700/50 dark:text-gray-300'
                      }`}
                    >
                      {language.label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                  <span>{selectedCategory}</span>
                  <span className="ml-2 px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                    {currentPhrases.length} phrases
                  </span>
                </h3>

                <div className="space-y-4">
                  {currentPhrases.map((phrase, index) => (
                    <motion.div
                      key={index}
                      className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 * index }}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <p className="text-gray-900 dark:text-white font-medium">{phrase.english}</p>
                          <p className="text-blue-600 dark:text-blue-400 mt-1">{phrase[selectedLanguage]}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleCopy(phrase[selectedLanguage])}
                            className={`p-2 rounded-full ${copiedText === phrase[selectedLanguage] ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-800/50'} transition-colors`}
                            title="Copy to clipboard"
                          >
                            {copiedText === phrase[selectedLanguage] ? (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
                                <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z" />
                              </svg>
                            )}
                          </button>
                          <button
                            className={`p-2 rounded-full ${isSpeaking ? 'bg-purple-300 dark:bg-purple-700' : 'bg-purple-100 dark:bg-purple-900/30'} text-purple-800 hover:bg-purple-200 dark:text-purple-300 dark:hover:bg-purple-800/50 transition-colors`}
                            title="Listen"
                            onClick={() => handleSpeak(phrase[selectedLanguage])}
                            disabled={isSpeaking}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071a1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243a1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <img
                src="/phrasebook.svg"
                alt="Travel phrasebook"
                className="h-60 md:h-72 w-auto"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TravelPhrases;
