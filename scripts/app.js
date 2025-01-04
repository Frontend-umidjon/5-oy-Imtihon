const categoryCollectionEl = document.querySelector(".category__list");
const productsCollectionEl = document.querySelector(".products__list");
const loadingEl = document.querySelector(".category__loading");
const loadingEl2 = document.querySelector(".products__loading");
const btnSeeMore = document.querySelector(".products__btn");
const searchInput = document.querySelector(".navbar__form-input");
const searchDropdown = document.querySelector(".search__drop");
const BASE_URL = "https://dummyjson.com";
let totalProducts = 0;
let productEndpoint = "/products";
const perPageCount = 8
let offset = 0;

window.onload = () => {
  createLoading(perPageCount);
  fetchCategories();
  fetchProducts(`${productEndpoint}?limit=${perPageCount}`);
};
function createLoading(n) {
  loadingEl2.style.display = "grid";
  loadingEl2.innerHTML = null;
  Array(n).fill().forEach(() => {
    const loadingEl = document.createElement("div");
    loadingEl.classList.add("products__loading__item");
    loadingEl2.appendChild(loadingEl);
  })
}

async function fetchCategories() {
  await fetch(`${BASE_URL}/products/categories`)
    .then((res) => res.json())
    .then((res) => {
      createCategory(res);
    })
    .catch((err) => console.log(err))
    .finally(() => {
      loadingEl.style.display = "none"; 
    });
}

function createCategory(data) {
  ["All", ...data].forEach((category) => {
    const categoryEl = document.createElement("div");
    categoryEl.classList.add("category__item");
    categoryEl.dataset.category = category === "All" ? "/products" : `/products/category/${category.slug || category}`
    categoryEl.innerHTML = `
      <div class="category__item__img">
       <i class="fa-solid fa-list"></i>
      </div>
      <p class="category__item__name">${category.name || category}</p>
    `;
    categoryCollectionEl.appendChild(categoryEl);
    categoryEl.addEventListener("click", (e) => {
       let category = e.currentTarget.dataset.category; 
       productEndpoint = category;
       productsCollectionEl.innerHTML = "";
       fetchProducts(`${category}?limit=${perPageCount}`);
       if (totalProducts <= perPageCount + (offset * perPageCount)) {
        btnSeeMore.style.display = "none";
      }
    })
  });
}

async function fetchProducts(endpoint) {
  await fetch(`${BASE_URL}${endpoint}`)
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
      createProduct(res);
      totalProducts = res.total;
      if (totalProducts <= perPageCount + (offset * perPageCount)) {
        btnSeeMore.style.display = "none";
      }else{
        btnSeeMore.style.display = "block";
      }
    })
    .catch((err) => console.log(err))
    .finally(() => {
      loadingEl2.style.display = "none";
      btnSeeMore.removeAttribute("disabled");
      btnSeeMore.style.cursor = "pointer";
      btnSeeMore.style.opacity = "1";
      btnSeeMore.textContent = "See more";
    });

}

function createProduct(data) {
  data.products.forEach((product) => {
    const productEl = document.createElement("div");
    productEl.classList.add("products__item");
    productEl.dataset.id = product.id;
    productEl.innerHTML = `
       <div class="products__item__image">
                        <img src="${product.images[0]}" alt="">
                    </div>
                    <button class="products__item__like">
                        <i class="fa-regular fa-heart"></i>
                    </button>
                    <button class="products__item__eye">
                        <i class="fa-regular fa-eye"></i>
                    </button>
                    <div class="products__item__description">
                        <p class="products__item__name">${product.title}</p>
                        <div class="products__item__pricing">
                            <p class="products__item__price">${product.price}$</p>
                            <div class="products__item__star"><img src="./assets/Four Star.png" alt=""></div>
                            <p class="products__item__rating">(${Math.floor(Math.random() * 100)})</p>
                        </div>
                    </div>
    `;
    productsCollectionEl.appendChild(productEl);
  });
}

btnSeeMore.addEventListener("click", () => {

  btnSeeMore.setAttribute("disabled", true);
  btnSeeMore.style.cursor = "not-allowed";
  btnSeeMore.style.opacity = "0.5";
  btnSeeMore.textContent = "Loading...";
  createLoading(perPageCount);
  offset ++
 
  fetchProducts(`${productEndpoint}?limit=${perPageCount}&skip=${perPageCount * offset}`);


});

productsCollectionEl.addEventListener("click", (e) => {
  const id = e.target.closest(".products__item").dataset.id;
  if (e.target.closest(".products__item__image")) {
    open(`../pages/details.html?id=${id}`, "_self");

  }

})

searchInput.addEventListener("keyup", async (e)=>{
  const value = e.target.value.trim()
  if(value){
      searchDropdown.style.display = "block"
      const response = await fetch(`${BASE_URL}/products/search?q=${value}&limit=5`)
      response
          .json()
          .then(res => {
              searchDropdown.innerHTML = null
              res.products.forEach((item)=>{
                  const divEl = document.createElement("div")
                  divEl.className = "search__item"
                  divEl.dataset.id = item.id
                  divEl.innerHTML = `
                  <img src=${item.thumbnail} alt="">
                  <div>
                       <p>${item.title}</p>
                  </div>
                  `
                  searchDropdown.appendChild(divEl)
              })
          })
          .catch(err => console.log(err))
  }else{
      searchDropdown.style.display = "none"
  }
})
searchDropdown.addEventListener("click", (e)=>{
  console.log(e.target.dataset.id);
  
 if(e.target.closest(".search__item")){
     open(`./pages/details.html?id=${e.target.closest(".search__item").dataset.id}`, "_self");
 }
})