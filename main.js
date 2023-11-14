const categorylist = document.querySelector("#categorylist");
const productlist = document.getElementById("products");

// açma butonu

const openButton = document.querySelector("#openbutton");
//kapama butonu
const closeButton = document.querySelector("#closebutton");

//sepet modalı
const modal = document.getElementById("modal");

const modalList = document.querySelector(".modallist");
const totalPrice = document.getElementById("totalprice");
/* 
  Kategorileri sitede listeleme adımları
  APİ ye istek at
  İstekten dönen verileri işle 
  
  */

// APİ ye kategori listesi için istek attığımız ve uygulamada kategorileri bastırmak için fonksiyon

/* 
  APİ isteklerinde verinin gelme süreci 
  İsteklerin 2 sonucu vardır.
  Olumlu olma durumu (then metodu ile ele alınır)
  Olumsuz hata döndürme sonucu (error metodu ile ele alınır )
  */

//apiye veri çekmek için istek atma

function fetchcategories() {
  fetch("https://fakestoreapi.com/products")
    //eger apiden olumlu sonuc gelmişs ise then blogu calısıcak
    //APİ den gelen ilk cevabı json verisine ceviriyoruz
    .then((response) => response.json())
    .then((data) =>
      //gelen data verisi cok fazla oldugu için slice metodu ile diziyi bölduk ve bölunmus olan  yeni diziye mapp metodu uygulayarak her bir eleman ıcın işlem gerçekleştirdik
      data.slice(0, 5).map((categoryy) => {
        const { category, image } = categoryy;

        const categoryDiv = document.createElement("div");

        categoryDiv.classList.add("category");

        categoryDiv.innerHTML = `<img
    src=${image}    alt=""
  />

<span>${category}</span>`;

        categorylist.appendChild(categoryDiv);
      })
    )
    //eğer apiden olumsuz sonuç gelmişsse burdaki blok calışır
    .catch((error) => console.log(error));
}

fetchcategories();

function fetchproducts() {
  fetch("https://fakestoreapi.com/products")
    .then((response) => response.json())
    .then((data) =>
      data.map((product) => {
        const { title, price, category, image, id } = product;

        const productDiv = document.createElement("div");
        productDiv.classList.add("product");
        productDiv.innerHTML = `
<img src="${image}" alt="">
<p>${title}</p>
<p>${category}</p>
<div class="product-action">

    <p>${price}$</p>
    <button onclick="addtobasket({id:${id},title:'${title}',price:${price},image:'${image}',amount:1})">Sepete Ekle</button>
</div>`;

        productlist.appendChild(productDiv);
      })
    )
    .catch((error) => console.log("api hatası", error));
}

// sepete ekleme işlemi
fetchproducts();

let basket = [];
let total = 0;

function addtobasket(product) {
  const idsiaynieleman = basket.find(
    (sepettekieleman) => sepettekieleman.id === product.id
  );

  if (idsiaynieleman) {
    idsiaynieleman.amount++;
  } else {
    basket.push(product);
  }
}
  function showBasketItems() {
    basket.map((basketProduct) => {
      const listİtem = document.createElement("div");

      listİtem.classList.add("listitem");

      const { image, title, price, amount, id ,} =basketProduct;
      listİtem.innerHTML = `
  
  <img src="${image}" alt="">
  <h4>${title}</h4>
  <h2 class="price">${price}</h2>
  <p>Miktar : ${amount}</p>
  <button class="deletebutton" onclick='deleteItem({id:${id},price:${price},amount:${amount}})'>Sil</button>
  `;

      modalList.appendChild(listİtem);

      total += price * amount;
    });
  }

  // sepet acma kapama işlemleri

  openButton.addEventListener("click", () => {
    //console.log("sepet butonuna tıklandı")
    showBasketItems();
    modal.classList.add("active");
    totalPrice.innerText = total;
  });
  closeButton.addEventListener("click", () => {
    modal.classList.remove("active");
    modalList.innerHTML='';
    total=0;
  });

  modal.addEventListener("click", (event) => {
    //  console.log(event.target)

    if (event.target.classList.contains("modalwrap")) {
      modal.classList.remove("active");
    }
  });


function deleteItem(willdeleteItem) {
  basket = basket.filter((eleman)=>eleman.id !=willdeleteItem.id);
  total -= willdeleteItem.price * willdeleteItem.amount;
  totalPrice.innerText = total;
}

modalList.addEventListener("click", (tiklamaolaybilgileri) => {


  if (tiklamaolaybilgileri.target.classList.contains('deletebutton')) {
    tiklamaolaybilgileri.target.parentElement.remove();
  }
  if (basket.length === 0) {
    modal.classList.remove("active");
  }
});
