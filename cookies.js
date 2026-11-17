"use strict";

const cookieName = "is117_a10_visitor";
const directory = location.pathname.slice(0, location.pathname.lastIndexOf("/") + 1);
const secure = location.protocol === "https:" ? "; Secure" : "";
const cookieOptions = "; Path=" + directory + "; SameSite=Lax" + secure;
const dialog = document.querySelector("#name-dialog");
const form = document.querySelector("#name-form");
const nameInput = document.querySelector("#visitor-name");
const welcome = document.querySelector("#welcome");
const status = document.querySelector("#status");

function readName() {
  const prefix = cookieName + "=";
  const entry = document.cookie.split(";").map(cookie => cookie.trim())
    .find(cookie => cookie.startsWith(prefix));
  if (!entry) return "";

  try {
    return decodeURIComponent(entry.slice(prefix.length));
  } catch {
    return "";
  }
}

function updateGreeting() {
  const name = readName();
  welcome.textContent = name ? "Welcome, " + name + "!" : "Welcome, visitor!";
}

function saveName(event) {
  event.preventDefault();
  const name = nameInput.value.trim();
  if (!name) {
    nameInput.value = "";
    nameInput.reportValidity();
    return;
  }

  document.cookie = cookieName + "=" + encodeURIComponent(name) +
    "; Max-Age=2592000" + cookieOptions;
  status.textContent = readName() === name
    ? "Name saved. Refresh the page to try it."
    : "Your browser did not save the cookie.";
  dialog.close();
  updateGreeting();
}

function deleteName() {
  document.cookie = cookieName + "=; Max-Age=0" + cookieOptions;
  nameInput.value = "";
  status.textContent = readName() ? "The cookie could not be removed." : "No name is saved.";
  updateGreeting();
}

document.querySelector("#enter-name").addEventListener("click", () => {
  nameInput.value = readName();
  dialog.showModal();
});
document.querySelector("#cancel-name").addEventListener("click", () => dialog.close());
form.addEventListener("submit", saveName);
document.querySelector("#delete-cookie").addEventListener("click", deleteName);
updateGreeting();
if (!readName()) dialog.showModal();
