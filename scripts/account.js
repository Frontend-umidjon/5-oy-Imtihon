const logoutEl = document.querySelector(".logout-btn");
const loadEl = document.querySelector(".loading__screen");
const nameEl = document.querySelector(".account__top-name");
const firstNameEl = document.querySelector("#firstName");
const lastNameEl = document.querySelector("#lastName");
const emailEl = document.querySelector("#email");
const addressEl = document.querySelector("#address");
const BASE_URL = "https://dummyjson.com";

function checkToken() {
  fetch(`${BASE_URL}/auth/me`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem("accessToken")}`,
    },
  })
  .then(res => {
    if (!res.ok) {
      throw new Error("Invalid Token");
    }
    return res.json();
  })
  .then(data => {
    console.log(data);
    updateAccountInfo(data);
    removeLoadingScreen();
  })
  .catch(err => {
    console.error(err);
    localStorage.removeItem("accessToken");
    window.location.replace("/pages/login_in.html", "_self");
  });
}

function updateAccountInfo(data) {
  nameEl.textContent = `${data.firstName} ${data.lastName}`;
  firstNameEl.value = data.firstName || '';
  lastNameEl.value = data.lastName || '';
  emailEl.value = data.email || '';
  addressEl.value = data.address.address || '';
}

function removeLoadingScreen() {
  loadEl.style.display = "none";
}

window.onload = () => {
  checkToken();
};
