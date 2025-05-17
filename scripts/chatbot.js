const chatbotPhrases = [
  'Когда приходит пенсия?',
  'Что делать, если болит спина?',
  'Как вызвать социального работника?',
  'Как пользоваться телефоном?',
  'Где получить помощь по уходу?',
  'Как включить телевизор?',
  'Как узнать результаты анализов?',
  'Где посмотреть погоду на сегодня?',
  'Как найти ближайшую аптеку?',
  'Что такое СНИЛС и зачем он нужен?',
  'Где посмотреть свои записи к врачу?',
  'Как выключить компьютер правильно?'
];

const chatbotInput = document.getElementById('userInput');

let chatbotPhraseIndex = 0;
let chatbotCharIndex = 0;
let isDeleting = false;

const typingDelay = 100;
const erasingDelay = 50;
const pauseAfterTyping = 1000;
const pauseAfterErase = 600;

function tick() {
  const current = chatbotPhrases[chatbotPhraseIndex];

  if (!isDeleting) {
    chatbotInput.placeholder = current.slice(0, chatbotCharIndex);
    chatbotCharIndex++;

    if (chatbotCharIndex > current.length) {
      isDeleting = true;
      setTimeout(tick, pauseAfterTyping);
    } else {
      setTimeout(tick, typingDelay);
    }
  } else {
    chatbotInput.placeholder = current.slice(0, chatbotCharIndex);
    chatbotCharIndex--;

    if (chatbotCharIndex < 0) {
      isDeleting = false;
      chatbotPhraseIndex = (chatbotPhraseIndex + 1) % chatbotPhrases.length;
      chatbotCharIndex = 0;
      setTimeout(tick, pauseAfterErase);
    } else {
      setTimeout(tick, erasingDelay);
    }
  }
}

setTimeout(tick, 500);

///////////////

const rawAnswers = [
  {
    question: 'пенсия',
    response:
      'Пенсия приходит на карту или по почте в определённые даты. Точную дату можно узнать в Пенсионном фонде или на портале госуслуг.',
    simplified:
      'Пенсия приходит по расписанию. Спросите в Пенсионном фонде, когда именно.'
  },
  {
    question: 'спина',
    response:
      'Если болит спина, желательно отдохнуть, избегать подъема тяжестей и обратиться к врачу за рекомендациями.',
    simplified: 'Если болит спина, лучше отдохнуть и сходить к врачу.'
  },
  {
    question: 'социальный',
    response:
      'Чтобы вызвать социального работника, позвоните в центр социального обслуживания по вашему району.',
    simplified: 'Позвоните в соцслужбу — они отправят работника помочь.'
  },
  {
    question: 'телефон',
    response:
      'Чтобы пользоваться телефоном, можно включить режим для пожилых, где всё крупно и просто. Также можно попросить настроить близких.',
    simplified:
      'Попросите близких настроить телефон — будет проще пользоваться.'
  },
  {
    question: 'уход',
    response:
      'Помощь по уходу можно получить через соцслужбы, медсестру на дом или частный уход.',
    simplified: 'Спросите в соцслужбе — они могут организовать уход.'
  },
  {
    question: 'телевизор',
    response:
      'Чтобы включить телевизор, возьмите пульт, нажмите кнопку питания, затем выберите нужный канал.',
    simplified: 'Нажмите кнопку на пульте — телевизор включится.'
  },
  {
    question: 'анализ',
    response:
      'Результаты анализов можно получить в поликлинике или через портал госуслуг.',
    simplified: 'Позвоните в поликлинику — там скажут результат.'
  },
  {
    question: 'погода',
    response:
      'Погоду на сегодня можно посмотреть в интернете, на телефоне или спросить у голосового помощника.',
    simplified: 'Посмотрите погоду на телефоне или спросите у кого-то.'
  },
  {
    question: 'аптека',
    response:
      'Найти ближайшую аптеку можно через Яндекс.Карты, Google или спросить в справочной.',
    simplified: 'Спросите у кого-то или посмотрите в телефоне — где аптека.'
  },
  {
    question: 'снилс',
    response:
      'СНИЛС — это страховой номер. Он нужен для получения пенсии и обращения в поликлинику.',
    simplified: 'СНИЛС — это номер, который нужен в поликлинике и для пенсии.'
  },
  {
    question: 'запись',
    response:
      'Записи к врачу можно найти на сайте госуслуг или позвонив в регистратуру вашей поликлиники.',
    simplified: 'Позвоните в поликлинику — там скажут про запись.'
  },
  {
    question: 'выключить',
    response:
      'Чтобы правильно выключить компьютер, нажмите кнопку «Пуск», затем «Завершение работы».',
    simplified: 'Нажмите «Пуск», потом «Выключить» — и всё.'
  },
  {
    question: 'зовут',
    response:
      'Вы можете посмотреть ваше имя и фамилию в паспорте или других личных документах, спросить у соседей или позвоним кому-нибудь из списка ваших контактов.',
    simplified:
      'Посмотрите в паспорте или спросите у знакомых — они подскажут, как вас зовут.'
  }
];

function getStem(word) {
  return word
    .toLowerCase()
    .replace(
      /(ия|ие|ий|ый|ой|ые|ую|ую|ов|ев|ам|ям|ом|ем|ах|ях|ей|ю|а|я|о|е|и|ы|ь|н)$/g,
      ''
    )
    .trim();
}

// Создаём финальный массив ответов со стеммингом ключей
const finalAnswers = rawAnswers.map(item => ({
  ...item,
  stem: getStem(item.question)
}));

const aiResponse = document.getElementById('aiResponse');
const form = document.getElementById('chatForm');
const input = document.getElementById('userInput');
const clearBtn = document.getElementById('clearBtn');
const simplifyBtn = document.getElementById('simplifyBtn');

let currentAnswer = null;

form.addEventListener('submit', function (e) {
  e.preventDefault();
  const question = input.value.trim().toLowerCase();

  // Если поле пустое или содержит стандартный текст, не добавляем в чат
  if (!question || question === 'задайте ваш вопрос') {
    return;
  }

  const stemmedInput = getStem(question);

  const found = finalAnswers.find(a => question.includes(a.stem));
  let answerText;

  if (found) {
    currentAnswer = found;
    answerText = found.response;
  } else {
    answerText = 'Извините, я пока не знаю, как на это ответить.';
    currentAnswer = null;
  }

  // Создаём новый блок для ответа
  const answerBlock = document.createElement('div');
  answerBlock.textContent = answerText;
  answerBlock.classList.add('answer-block');

  // Добавляем ответ в контейнер с ответами, не стирая предыдущие
  aiResponse.appendChild(answerBlock);
  aiResponse.scrollTop = aiResponse.scrollHeight;

  input.value = ''; // очищаем поле ввода

  saveAnswerToStorage(answerText);

  function saveAnswerToStorage(text) {
    const stored = JSON.parse(localStorage.getItem('chatAnswers')) || [];
    stored.push(text);
    if (stored.length > 10) stored.shift(); // удаляем самый старый
    localStorage.setItem('chatAnswers', JSON.stringify(stored));
  }
});

simplifyBtn.addEventListener('click', function () {
  let textToAdd;
  const simplifiedBlock = document.createElement('div');
  simplifiedBlock.classList.add('simplified-answer');

  if (currentAnswer && currentAnswer.simplified) {
    textToAdd = currentAnswer.simplified;
  } else {
    textToAdd = 'Извините, я пока не могу упростить этот ответ.';
  }

  simplifiedBlock.textContent = textToAdd;
  aiResponse.appendChild(simplifiedBlock);
  aiResponse.scrollTop = aiResponse.scrollHeight;

  saveAnswerToStorage(textToAdd); // Сохраняем упрощённый текст в localStorage
});

clearBtn.addEventListener('click', function () {
  input.value = '';
  aiResponse.textContent = ''; // очищаем ответы
  currentAnswer = null;
  localStorage.removeItem('chatAnswers');
});

///////

function toggleButtonsState() {
  const isEmpty = chatbotInput.value.trim() === '';
  simplifyBtn.disabled = isEmpty;
  clearBtn.disabled = isEmpty;
  sendBtn.disabled = isEmpty;
}

// При вводе текста — обновляем состояние кнопок
chatbotInput.addEventListener('input', toggleButtonsState);
// При загрузке страницы — выключаем кнопки по умолчанию
toggleButtonsState();

//////
chatbotInput.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    if (e.ctrlKey || e.metaKey) {
      // Ctrl+Enter или Cmd+Enter — вставляем перенос строки
      const start = input.selectionStart;
      const end = input.selectionEnd;
      input.value =
        input.value.substring(0, start) + '\n' + input.value.substring(end);
      input.selectionStart = input.selectionEnd = start + 1;
      e.preventDefault();
    } else {
      // Просто Enter — отправка формы
      e.preventDefault();
      form.dispatchEvent(new Event('submit'));
    }
  }
});

//////// Голосовая поддержка
const voiceBtn = document.getElementById('voiceBtn');

// Проверка поддержки браузером
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
  const recognition = new SpeechRecognition();
  recognition.lang = 'ru-RU'; // Русский язык
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  let isListening = false;

  voiceBtn.addEventListener('click', () => {
    if (!isListening) {
      recognition.start();
      isListening = true;
      voiceBtn.textContent = '🔴 Нажмите, чтобы остановить';
    } else {
      recognition.stop();
      isListening = false;
      voiceBtn.textContent = '🎤 Говорить';
    }
  });

  recognition.addEventListener('result', event => {
    const transcript = event.results[0][0].transcript;
    chatbotInput.value = transcript;
    toggleButtonsState();
    voiceBtn.textContent = '🎤 Говорить';
  });

  recognition.addEventListener('end', () => {
    isListening = false;
    voiceBtn.textContent = '🎤 Говорить';
  });

  recognition.addEventListener('error', () => {
    isListening = false;
    aiResponse.textContent = 'Ошибка распознавания. Попробуйте ещё раз.';
    voiceBtn.textContent = '🎤 Говорить';
  });
} else {
  voiceBtn.disabled = true;
  voiceBtn.textContent = '🎤 Нет поддержки';
}

window.addEventListener('DOMContentLoaded', () => {
  const stored = JSON.parse(localStorage.getItem('chatAnswers')) || [];
  stored.forEach(answer => {
    const block = document.createElement('div');
    block.textContent = answer;
    block.classList.add('answer-block');
    aiResponse.appendChild(block);
  });
});
