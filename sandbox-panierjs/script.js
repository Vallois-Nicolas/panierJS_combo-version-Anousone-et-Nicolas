// Je créé un tableau d'objets dans catalog
const catalog = [
    {
        "name": "Tournevis Turquoise",
        "ref": "0001",
        "description": "Tournevis ergonomique et très joli.",
        "img": "tournevis_001.jpg",
        "price": 5.5
    },
    {
        "name": "Tournevis Rouge",
        "ref": "0002",
        "description": "Tournevis rouge transportable.",
        "img": "tournevis_002.jpg",
        "price": 50
    }
];

// Je parcours mon array catalog, et à chaque passage de ligne du tableau, je stock la valeur dans product
catalog.forEach(function(product) {
    createProducts(product);
});

function createProducts(product) {
    // on créé notre const pour manipuler notre div products
    const products = document.getElementById('products');
    let div = document.createElement('div');
    // Je suis en mode faineant : j'utilise les magic quote pour écrire mon code html
    div.innerHTML =
        `<div class="card col" style="width: 18rem;">
            <img src="assets/img/${product.img}" class="card-img-top" alt="${product.name}">
            <div class="card-body">
                <p class="card-title h5">${product.name}</p>
                <p class="card-text">Ref: ${product.ref}</p>
                <p class="card-text">${product.description}</p>
                <p class="card-text">${product.price}€</p>
                <a id="alexis" data-name="${product.name}" data-ref="${product.ref}" data-price="${product.price}"
                    data-img="${product.img}" data-description="${product.description}" href="#"
                    class="btn btn-primary add-basket-btn" data-toggle="modal" data-target="#myModal">Détails</a>
            </div>
        </div>`
        products.appendChild(div);
}


// je créé une const qui va regrouper tous les boutons add-basket-btn
const basketBtnArray = document.querySelectorAll('.add-basket-btn');

basketBtnArray.forEach(function (button) {
    button.addEventListener('click', function () {
        // on recupère tous les éléments du button à l'aide du this
        // et nous l'utilisons en paramètre de fonction
        writeInModal(this);
    });
});

// La fonction nous permet d'écrire le contenu de la modal en fonction de l'élement : ici il s'agit du bouton
// le paramètre button de la fonction contient tous les attributs de this (Nous avons changé le nom pour plus de praticité)
function writeInModal(button) {
    // Je définis mes constantes pour pouvoir écrire dans ma modale
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalPrice = document.getElementById('modalPrice');
    const btnAddToCart = document.getElementById('btnAddToCart');

    // J'écris dans mon html à l'aide de innerText
    modalTitle.innerText = button.dataset.name;
    modalDescription.innerText = button.dataset.description;
    modalPrice.innerText = button.dataset.price;

    // J'ajoute des attributs data au bouton d'ajout au panier pour faciliter le passage des données lorsque l'utilisateur souhaitera ajouter l'article à son panier
    btnAddToCart.setAttribute('data-name', button.dataset.name);
    btnAddToCart.setAttribute('data-price', button.dataset.price);
    btnAddToCart.setAttribute('data-ref', button.dataset.ref)
}

let btnAddToCart = document.getElementById('btnAddToCart');
// Ce tableau contiendra tous les articles que l'utilisateur souhaite acheter
let cartArray = [];
// Lorsque l'utilisateur cliquera sur "ajouter au panier" dans la modale, on déclenche une fonction anonyme qui permettra l'ajout de l'article au panier
btnAddToCart.addEventListener('click', function() {
    // Si l'article que l'utilisateur cherche à ajouter à son panier est déjà présent dans le tableau cartArray
    if(cartArray[btnAddToCart.dataset.ref] != undefined) {
        // On incrémente la propriété de la quantité du produit
        cartArray[btnAddToCart.dataset.ref].quantity ++;
    } else {
        // Sinon on ajoute l'article au tableau de produits souhaités par l'utilisateur
        // ATTENTION : ici on crée un tableau multidimensionnel avec :
        // - en index : la référence du produit
        // - en valeur : un objet ayant les propriétés 'nom', 'price' et 'quantity'
        cartArray[btnAddToCart.dataset.ref] = {name: btnAddToCart.dataset.name, price: btnAddToCart.dataset.price,quantity: 1};
    }
})

let btnTiggerCart = document.getElementById('btnTriggerCart');
let cartContent = document.getElementById('cartContent');
// Ces 3 tableaux permettront de stocker les divers boutons d'ajout, de retrait ou de suppression que le panier contiendra
let allRemoveButtons = [];
let allAddButtons = [];
let allDeleteButtons = [];
// Lorsque l'utilisateur cliquera sur le bouton pour accéder au panier, j'injecte dynamiquement le contenu du tableau cartArray dans la modale panier
btnTriggerCart.addEventListener('click', function () {
    // ATTENTION : ici j'utilise une boucle for car la boucle foreach ne marche pas avec les tableaux multidimensionnels en JS
    for (var indexProduct in cartArray) {
        // Pour éviter les abus d'ajouts / suppression d'articles dans le tableau cartArray, une fois qu'un produit est inscrit dans le panier, il y restera jusqu'à la fin.
        // Donc pour éviter d'afficher les produits dont la quantité est égale à 0, on ajoute une condition
        if(cartArray[indexProduct].quantity > 0) {
            // On modifie le contenu de la modale, en injectant diverses data pour faciliter les manipulations ultérieures
            cartContent.innerHTML += `
                <div class="d-flex" id="product-${indexProduct}">
                    <p>${cartArray[indexProduct].name}</p>
                    <button type="button" data-target="${indexProduct}" class="removeBtn btn btn-warning">-</button>
                    <button type="button" data-target="${indexProduct}" class="addBtn btn btn-warning">+</button>
                    <input type="number" readonly id="productInput-${indexProduct}" value="${cartArray[indexProduct].quantity}">
                    <p> X <span id="priceProduct-${indexProduct}">${cartArray[indexProduct].price}</span>€ = <span class="individualTotal" id="individualTotal-${indexProduct}">${cartArray[indexProduct].price * cartArray[indexProduct].quantity}</span></p>
                    <button type="button" data-target="${indexProduct}" class="deleteBtn btn btn-danger">Supprimer</button>
                </div>
            `;
        }
    }
    // Ce genre de délcaration empêche de récupérer une HTMLCollection en type de tableau (qui n'est pas exploitable en foreach)
    allRemoveButtons = [...document.getElementsByClassName('removeBtn')];
    // Ensuite, pour chaque bouton de retrait d'article, on va ajouter un écouteur d'événement qui délcenchera plusieurs actions
    allRemoveButtons.forEach(element => {
        element.addEventListener('click', function() {
            // La quantité de l'article diminuera dans l'objet qui est compris dans le tableau cartArray
            cartArray[element.dataset.target].quantity --;
            // La quantité affichée évoluera dynamiquement dans la modale
            document.getElementById('productInput-' + element.dataset.target).value --;
            // On gère le cas où l'utilisateur viendrait à supprimer l'article en cliquant sur le bouton - au lieu du bouton "supprimer"
            if(cartArray[element.dataset.target].quantity > 0){
                // Et on oublie pas de mettre à jour le prix total individuel
                document.getElementById('individualTotal-' + element.dataset.target).innerText = document.getElementById('productInput-' + element.dataset.target).value * cartArray[element.dataset.target].price;
            } else {
                // Si le nombre de produit est égal à 0, alors on l'efface dynamiquement de l'affichage de la modale panier
                document.getElementById('product-' + element.dataset.target).remove();
            }
        })
    });
    
    // Le fonctionnement de ce bout de code est similaire à celui juste au-dessus, sauf que celui-ci à pour action d'incrémenter de 1 le nombre d'articles
    allAddButtons = [...document.getElementsByClassName('addBtn')];
    allAddButtons.forEach(element => {
        element.addEventListener('click', function() {
            cartArray[element.dataset.target].quantity ++;
            document.getElementById('productInput-' + element.dataset.target).value ++;
            document.getElementById('individualTotal-' + element.dataset.target).innerText = document.getElementById('productInput-' + element.dataset.target).value * cartArray[element.dataset.target].price;
        })
    });

    // Le fonctionnement de ce bout de code est également similaire à ceux juste au-dessus, sauf que celui-ci supprime directement l'article de la modale panier
    allDeleteButtons = [...document.getElementsByClassName('deleteBtn')];
    allDeleteButtons.forEach(element => {
        element.addEventListener('click', function() {
            cartArray[element.dataset.target].quantity = 0;
            document.getElementById('product-' + element.dataset.target).remove();
        })
    });
})

// Petite arnaque pour effacer le contenu de la modale du panier quand l'utilisateur la ferme. Cela évite les doublons d'articles à la réouverture
$('#cart').on('hidden.bs.modal', function (){
    cartContent.innerHTML = "";
})