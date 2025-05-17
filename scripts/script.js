
import { updateDateTime, initHeaderEvents } from './header.js';

document.addEventListener('DOMContentLoaded', () => {
    updateDateTime();
    setInterval(updateDateTime, 1000);
    initHeaderEvents();
});

const slider = document.querySelector(".slider");
const prevButton = document.querySelector(".prev-button");
const nextButton = document.querySelector(".next-button");
const data = [
  "Регулярные медицинские осмотры: Не пренебрегайте посещением врача для профилактики и своевременного выявления заболеваний. Обсудите с врачом необходимые прививки, анализы и скрининги.",
  "Физическая активность: Регулярные физические упражнения помогают поддерживать здоровье, силу и мобильность. Выбирайте занятия, которые вам нравятся и соответствуют вашим возможностям, такие как ходьба, плавание, йога или танцы.",
  "Умственная активность: Поддерживайте умственную активность, читайте книги, решайте головоломки, учите новые языки или занимайтесь творчеством. Это помогает сохранить ясность ума и предотвратить снижение когнитивных функций.",
  "Сбалансированное питание: Питайтесь разнообразно, употребляйте достаточно фруктов, овощей, цельнозерновых продуктов и нежирного белка. Ограничьте потребление соли, сахара и насыщенных жиров. При необходимости проконсультируйтесь с диетологом.",
  "Достаточный сон: Старайтесь спать не менее 7-8 часов в сутки. Создайте комфортные условия для сна, соблюдайте режим и избегайте употребления кофеина и алкоголя перед сном.",
  "Берегите зрение и слух: Регулярно проверяйте зрение и слух. Используйте очки и слуховые аппараты, если они вам необходимы.",
  "Профилактика падений: Примите меры для предотвращения падений, такие как использование поручней, нескользящих ковриков и хорошего освещения.",
  "Поддерживайте связи с семьей и друзьями: Регулярно общайтесь с близкими людьми, проводите время вместе и делитесь своими чувствами и переживаниями.",
  "Используйте технологии для общения: Научитесь пользоваться компьютером, интернетом и смартфоном, чтобы оставаться на связи с близкими людьми, получать информацию и развлекаться.",
];
async function addAdvice() {
  //   const adviceData = await fetch("./advice.json", { mode: "no-cors" });
  //   console.log(adviceData);
  //   const data = await adviceData.json();

  data.forEach((el) => {
    const slide = document.createElement("div");
    slide.textContent = el;
    slide.className = "slide";
    slider.appendChild(slide);
  });
}
addAdvice();

const slides = document.querySelectorAll(".slide");

let slideIndex = 0; // Индекс текущего слайда
const slideWidth = slides[0]?.offsetWidth; // Ширина слайда

function showSlide(index) {
  if (index < 0) {
    slideIndex = slides.length - 1; // Переход к последнему слайду
  } else if (index >= slides.length) {
    slideIndex = 0; // Переход к первому слайду
  }

  slider.style.transform = `translateX(-${slideIndex * slideWidth}px)`;
}

function nextSlide() {
  slideIndex++;
  showSlide(slideIndex);
}

function prevSlide() {
  slideIndex--;
  showSlide(slideIndex);
}

// Обработчики событий для кнопок
nextButton.addEventListener("click", nextSlide);
prevButton.addEventListener("click", prevSlide);

// Показываем первый слайд при загрузке страницы
showSlide(slideIndex);