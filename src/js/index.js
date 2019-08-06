import "svgxuse";
import objectFitImages from "object-fit-images";

// Determine whether or not we need to listen for that event at all
if (document.readyState !== "loading") {
  objectFitImages();
} else {
  document.addEventListener("DOMContentLoaded", function() {
    objectFitImages();
  });
}

document.addEventListener("DOMContentLoaded", () => objectFitImages());

const menuButtonOpen = document.querySelector(".header__button-menu-open");
const menuButtonClose = document.querySelector(".header__button-menu-close");
const menu = document.querySelector(".menu");
// Show menu and close button
menuButtonOpen.addEventListener("click", () => {
  menu.classList.add("menu--show");
  menuButtonOpen.classList.remove("header__button-menu-open--show");
  menuButtonClose.classList.add("header__button-menu-close--show");
});
// Hide menu and close button
menuButtonClose.addEventListener("click", () => {
  menu.classList.remove("menu--show");
  menuButtonClose.classList.remove("header__button-menu-close--show");
  menuButtonOpen.classList.add("header__button-menu-open--show");
});
