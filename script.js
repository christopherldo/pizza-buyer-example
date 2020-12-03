let cart = [];
let modalQuantity = 1;
let modalKey = 0;

const search = (element) => document.querySelector(element);
const searchAll = (element) => document.querySelectorAll(element);

// Constutor da lista de pizzas
pizzaJson.map((item, index) => {
  let pizzaItem = search('.models .pizza-item').cloneNode(true);

  pizzaItem.setAttribute('data-key', index);

  pizzaItem.querySelector('.pizza-item--img img').src = item.img;
  pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2).replace('.', ',')}`;
  pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
  pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
  pizzaItem.querySelector('a').addEventListener('click', (event) => {
    event.preventDefault();
    let key = event.target.closest('.pizza-item').getAttribute('data-key');
    
    modalQuantity = 1;
    modalKey = key;

    search('.pizzaBig img').src = pizzaJson[key].img;
    search('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
    search('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
    search('.pizzaInfo--size.selected').classList.remove('selected');

    searchAll('.pizzaInfo--size').forEach((size, sizeIndex) => {
      if(sizeIndex === 2){
        size.classList.add('selected');
      };
      size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
    });

    search('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2).replace('.', ',')}`;
    search('.pizzaInfo--qt').innerHTML = modalQuantity;

    search('.pizzaWindowArea').style.opacity = '0';
    search('.pizzaWindowArea').style.display = 'flex';
    setTimeout(() => {
      search('.pizzaWindowArea').style.opacity = '1';
    }, 100);
  });
  
  search('.pizza-area').append(pizzaItem);
});

// Eventos do MODAL
const closeModal = () => {
  search('.pizzaWindowArea').style.opacity = '0';
  setTimeout(() => {
    search('.pizzaWindowArea').style.display = 'none';
  }, 500);
};

searchAll('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item) => {
  item.addEventListener('click', closeModal)
});

search('.pizzaInfo--qtmenos').addEventListener('click', (event) => {
  if(modalQuantity > 1){
    modalQuantity--;
    search('.pizzaInfo--qt').innerHTML = modalQuantity;
  }
});

search('.pizzaInfo--qtmais').addEventListener('click', (event) => {
  modalQuantity++;
  search('.pizzaInfo--qt').innerHTML = modalQuantity;
});

searchAll('.pizzaInfo--size').forEach((size, sizeIndex) => {
  size.addEventListener('click', (event) => {
    search('.pizzaInfo--size.selected').classList.remove('selected');
    size.classList.add('selected');
  });
});

search('.pizzaInfo--addButton').addEventListener('click', (event) => {
  let size = parseInt(search('.pizzaInfo--size.selected').getAttribute('data-key'));

  let identifier = `${pizzaJson[modalKey].id}@${size}`

  let key = cart.findIndex((item) => item.identifier === identifier);

  if(key !== -1){
    cart[key].quantity += modalQuantity;
  } else {
    cart.push({
      identifier,
      id: pizzaJson[modalKey].id,
      size,
      quantity: modalQuantity
    });
  };

  updateCart();
  closeModal();
});

search('.menu-openner').addEventListener('click', () => {
  if(cart.length > 0){
    search('aside').style.left = 0;
  }
});

search('.menu-closer').addEventListener('click', () => {
  search('aside').style.left = '100vw';
});

const updateCart = () => {
  search('.menu-openner span').innerHTML = cart.length;

  if(cart.length > 0){
    search('aside').classList.add('show');
    search('.cart').innerHTML = '';

    let subtotal = 0, desconto = 0, total = 0;

    for(let i in cart){
      let pizzaItem = pizzaJson.find((item) => item.id === cart[i].id);
      
      subtotal += pizzaItem.price * cart[i].quantity;
      
      let cartItem = search('.models .cart--item').cloneNode(true);
      let pizzaSizeName;

      switch(cart[i].size){
        case 0:
          pizzaSizeName = 'P';
          break;
        case 1:
          pizzaSizeName = 'M';
          break;
        case 2:
          pizzaSizeName = 'G';
          break;
      };

      let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

      cartItem.querySelector('img').src = pizzaItem.img;
      cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
      cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].quantity;
      cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
        if(cart[i].quantity > 1) {
          cart[i].quantity--;
        } else {
          cart.splice(i, 1);
        };

        updateCart();
      });
      cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
        cart[i].quantity++;
        updateCart();
      });

      search('.cart').append(cartItem);
    };

    desconto = subtotal * 0.1;
    total = subtotal - desconto;

    search('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
    search('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
    search('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;
  } else {
    search('aside').classList.remove('show');
    search('aside').style.left = '100vw';
  };
};