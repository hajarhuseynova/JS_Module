const StorageController = (function () {
  return {
    productStore: function (product) {
      let products;
      if (localStorage.getItem("products") === null) {
        products = [];
        products.push(product);
      } else {
        products = JSON.parse(localStorage.getItem("products"));
        products.push(product);
      }
      localStorage.setItem("products", JSON.stringify(products));
    },
    getProducts: function () {
      let products;
      if (localStorage.getItem("products") === null) {
        products = [];
      } else {
        products = JSON.parse(localStorage.getItem("products"));
      }
      return products;
    },
    updateStorage: function (product) {
      products = JSON.parse(localStorage.getItem("products"));
      products.forEach(function (prd, index) {
        if (prd.id == product.id) {
          products.splice(index, 1, product);
        }
        localStorage.setItem("products", JSON.stringify(products));
      });
    },
    deleteStorage: function (product) {
      products = JSON.parse(localStorage.getItem("products"));
      products.forEach(function (prd, index) {
        if (prd.id == product.id) {
          products.splice(index, 1);
        }
        localStorage.setItem("products", JSON.stringify(products));
      });
    },
  };
})();

const ProductController = (function () {
  const Product = function (id, name, price) {
    this.id = id;
    this.name = name;
    this.price = price;
  };
  const data = {
    products: StorageController.getProducts(),
    selectedProduct: null,
    totalPrice: 0,
  };
  return {
    getProducts: function () {
      return data.products;
    },
    getProductById: function (id) {
      let product = null;

      data.products.forEach(function (prd) {
        if (prd.id == id) {
          product = prd;
        }
      });

      return product;
    },
    setCurrentProduct: function (product) {
      data.selectedProduct = product;
    },
    getCurrentProduct: function () {
      return data.selectedProduct;
    },
    getData: function () {
      return data;
    },
    addProduct: function (name, price) {
      let id;
      if (data.products.length > 0) {
        id = data.products[data.products.length - 1].id + 1;
      } else {
        id = 0;
      }

      const newProduct = new Product(id, name, parseFloat(price));
      data.products.push(newProduct);
      return newProduct;
    },
    getTotal: function () {
      let total = 0;
      data.products.forEach(function (item) {
        total += item.price;
      });
      data.totalPrice = total;
      return data.totalPrice;
    },
    updateProduct: function (name, price) {
      let product = null;
      data.products.forEach(function (prd) {
        if (prd.id === data.selectedProduct.id) {
          prd.name = name;
          prd.price = parseFloat(price);
          product = prd;
        }
      });
      return product;
    },
    deleteProduct: function (product) {
      data.products.forEach(function (prd, index) {
        if (product.id == prd.id) {
          data.products.splice(index, 1);
        }
      });
    },
  };
})();

const UIController = (function () {
  const Selectors = {
    productList: "#item-list",
    addButton: ".addBtn",
    updateButton: ".updateBtn",
    deleteButton: ".deleteBtn",
    cancelButton: ".cancelBtn",
    nameInput: "#productName",
    priceInput: "#productPrice",
    productCard: "#productCard",
    totalTl: "#totalTl",
    totalDolar: "#totalDolar",
    productListItem: "#item-list tr",
  };
  return {
    createProductList: function (products) {
      let html = "";
      products.forEach((element) => {
        html += `<tr>
        <td>${element.id}</td>
        <td>${element.name}</td>
        <td>${element.price}$</td>
        <td class="text-right">
            <i class="far fa-edit editBtn"></i>
        </td>
      </tr>`;
      });
      document.querySelector(Selectors.productList).innerHTML = html;
    },
    getSelectors: function () {
      return Selectors;
    },
    addProductToForm: function () {
      const selectedProduct = ProductController.getCurrentProduct();

      document.querySelector(Selectors.nameInput).value = selectedProduct.name;

      document.querySelector(Selectors.priceInput).value =
        selectedProduct.price;
    },
    addProduct: function (element) {
      document.querySelector(Selectors.productCard).style.display = "block";
      var item = `
      <tr>
        <td>${element.id}</td>
        <td>${element.name}</td>
        <td>${element.price}$</td>
        <td class="text-right">
        <i class="far fa-edit editBtn"></i>
         </td>
      </tr>`;
      document.querySelector(Selectors.productList).innerHTML += item;
    },
    clearInputs: function () {
      document.querySelector(Selectors.nameInput).value = "";
      document.querySelector(Selectors.priceInput).value = "";
    },
    clearWarnings: function () {
      let items = document.querySelectorAll(Selectors.productListItem);
      items.forEach(function (item) {
        if (item.classList.contains("bg-warning")) {
          item.classList.remove("bg-warning");
        }
      });
    },
    hideCard: function () {
      document.querySelector(Selectors.productCard).style.display = "none";
    },
    showTotal: function (total) {
      document.querySelector(Selectors.totalDolar).textContent = total;
      document.querySelector(Selectors.totalTl).textContent = total * 20;
    },
    addState: function () {
      UIController.clearInputs();
      UIController.clearWarnings();

      document.querySelector(Selectors.addButton).style.display = "inline";
      document.querySelector(Selectors.updateButton).style.display = "none";
      document.querySelector(Selectors.deleteButton).style.display = "none";
      document.querySelector(Selectors.cancelButton).style.display = "none";
    },
    editState: function (tr) {
      tr.classList.add("bg-warning");
      document.querySelector(Selectors.addButton).style.display = "none";
      document.querySelector(Selectors.updateButton).style.display = "inline";
      document.querySelector(Selectors.deleteButton).style.display = "inline";
      document.querySelector(Selectors.cancelButton).style.display = "inline";
    },
    updateProduct: function (prd) {
      let updatedItem = null;

      let items = document.querySelectorAll(Selectors.productListItem);
      items.forEach(function (item) {
        if (item.classList.contains("bg-warning")) {
          item.children[1].textContent = prd.name;
          item.children[2].textContent = prd.price + " $";
          updatedItem = item;
        }
      });
      return updatedItem;
    },
    deleteProduct: function () {
      const items = document.querySelectorAll(Selectors.productListItem);

      items.forEach(function (item) {
        if (item.classList.contains("bg-warning")) {
          item.remove();
        }
      });
    },
  };
})();

const App = (function (ProductCtrl, UICtrl, StorageCtrl) {
  const UISelectors = UICtrl.getSelectors();

  const loadEventListeners = function () {
    //add
    document
      .querySelector(UISelectors.addButton)
      .addEventListener("click", productAddSubmit);

    //edit click
    document
      .querySelector(UISelectors.productList)
      .addEventListener("click", productEditClick);

    document
      .querySelector(UISelectors.deleteButton)
      .addEventListener("click", productDeleteClick);

    document
      .querySelector(UISelectors.cancelButton)
      .addEventListener("click", productCancelClick);

    document
      .querySelector(UISelectors.updateButton)
      .addEventListener("click", productEditSubmit);
  };

  //edit submit

  const productAddSubmit = function (e) {
    const productName = document.querySelector(UISelectors.nameInput).value;
    const productPrice = document.querySelector(UISelectors.priceInput).value;

    if (productName !== "" && productPrice !== "") {
      const newProduct = ProductCtrl.addProduct(productName, productPrice);

      UIController.addProduct(newProduct);

      StorageCtrl.productStore(newProduct);

      const total = ProductCtrl.getTotal();

      UIController.showTotal(total);

      UIController.clearInputs();
    }
    e.preventDefault();
  };

  const productEditClick = function (e) {
    if (e.target.classList.contains("editBtn")) {
      const id =
        e.target.parentNode.previousElementSibling.previousElementSibling
          .previousElementSibling.textContent;

      const product = ProductCtrl.getProductById(id);

      ProductCtrl.setCurrentProduct(product);

      UICtrl.addProductToForm();
      UICtrl.clearWarnings();

      UICtrl.editState(e.target.parentNode.parentNode);
    }
    e.preventDefault();
  };

  const productEditSubmit = function (e) {
    const productName = document.querySelector(UISelectors.nameInput).value;
    const productPrice = document.querySelector(UISelectors.priceInput).value;

    if (productName !== "" && productPrice !== "") {
      const updateProduct = ProductCtrl.updateProduct(
        productName,
        productPrice
      );
      let item = UICtrl.updateProduct(updateProduct);

      // get total
      const total = ProductCtrl.getTotal();
      // show total
      UICtrl.showTotal(total);
      //update storage
      StorageCtrl.updateStorage(updateProduct);

      UICtrl.addState();
    }
    e.preventDefault();
  };
  const productCancelClick = function (e) {
    UICtrl.addState();
    UICtrl.clearWarnings();

    e.preventDefault();
  };
  const productDeleteClick = function (e) {
    const selectedProduct = ProductCtrl.getCurrentProduct();

    ProductCtrl.deleteProduct(selectedProduct);

    UICtrl.deleteProduct();
    // get total
    const total = ProductCtrl.getTotal();

    // show total
    UICtrl.showTotal(total);
    //storage
    StorageCtrl.deleteStorage(selectedProduct);
    //total check
    if (total == 0) {
      UICtrl.hideCard();
    }
    UICtrl.addState();

    e.preventDefault();
  };
  return {
    init: function () {
      UICtrl.addState();
      const products = ProductCtrl.getProducts();
      if (products.length == 0) {
        UICtrl.hideCard();
      } else {
        UICtrl.createProductList(products);
      }
      // get total
      const total = ProductCtrl.getTotal();
      // show total
      UICtrl.showTotal(total);
      //loads
      loadEventListeners();
    },
  };
})(ProductController, UIController, StorageController);
App.init();
