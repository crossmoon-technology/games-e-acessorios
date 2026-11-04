/* Troca cada [data-include="arquivo.html"] pelo conteúdo do arquivo (caminho relativo ao index.html). */
const loadIncludes = async () => {
  const slots = document.querySelectorAll("[data-include]");

  await Promise.all(
    [...slots].map(async (slot) => {
      const url = slot.dataset.include;
      const response = await fetch(url);

      if (!response.ok) {
        console.error(`Não foi possível carregar ${url} (${response.status})`);
        return;
      }

      slot.outerHTML = await response.text();
    })
  );
};

const initBanner = () => {
  const banner = document.querySelector(".banner");

  if (!banner) {
    return;
  }

  const slides = banner.querySelectorAll(".banner-slide");
  const dots = banner.querySelectorAll(".banner-dots button");
  const interval = 5000;
  let current = 0;
  let timer;

  const show = (index) => {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle("is-active", i === current));
    dots.forEach((dot, i) => dot.classList.toggle("is-active", i === current));
  };

  const start = () => {
    stop();
    timer = setInterval(() => show(current + 1), interval);
  };

  const stop = () => clearInterval(timer);

  banner.querySelector(".banner-arrow--prev").addEventListener("click", () => {
    show(current - 1);
    start();
  });

  banner.querySelector(".banner-arrow--next").addEventListener("click", () => {
    show(current + 1);
    start();
  });

  dots.forEach((dot, i) =>
    dot.addEventListener("click", () => {
      show(i);
      start();
    })
  );

  banner.addEventListener("mouseenter", stop);
  banner.addEventListener("mouseleave", start);

  start();
};

const initMenu = () => {
  const header = document.querySelector(".header");
  const burger = document.querySelector(".burger");

  if (!header || !burger) {
    return;
  }

  burger.addEventListener("click", () => {
    const open = header.classList.toggle("is-menu-open");
    burger.setAttribute("aria-expanded", open);
    burger.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  });
};

loadIncludes().then(() => {
  initBanner();
  initMenu();
  renderCartBadge();
  renderCartPage();
  renderProductList();
  renderProductPage();
  linkCards();
});

/* Login: mostrar/ocultar senha. Sem backend ainda, então o envio do formulário é interrompido. */
const initLogin = () => {
  const form = document.querySelector(".login-form");

  if (!form) {
    return;
  }

  form.addEventListener("submit", (event) => event.preventDefault());

  document.querySelectorAll("[data-toggle-password]").forEach((button) => {
    const input = button.closest(".field").querySelector("input");
    const icon = button.querySelector(".bx");

    button.addEventListener("click", () => {
      const show = input.type === "password";
      input.type = show ? "text" : "password";
      icon.classList.toggle("bx-show", !show);
      icon.classList.toggle("bx-hide", show);
      button.setAttribute("aria-label", show ? "Ocultar senha" : "Mostrar senha");
    });
  });
};

initLogin();

/* ----- Carrinho (guardado no localStorage, sem backend) ----- */
const CART_KEY = "cart";

const readCart = () => {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
};

const writeCart = (items) => {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  } catch {
    /* armazenamento indisponível: o carrinho vale só até recarregar a página */
  }

  renderCartBadge();
};

const formatPrice = (cents) =>
  (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

/* "R$ 3.999,90" vira 399990 (centavos) */
const parsePrice = (text) =>
  Math.round(parseFloat(text.replace(/[^\d,]/g, "").replace(",", ".")) * 100);

const slugify = (text) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const renderCartBadge = () => {
  const total = readCart().reduce((sum, item) => sum + item.qty, 0);

  document.querySelectorAll(".cart-badge").forEach((badge) => {
    badge.textContent = total;
  });
};

/* Lê nome, preço e imagem do próprio cartão (.product ou .game). */
const addToCart = (card) => {
  const name = card.querySelector("h3").textContent.trim();
  const price = parsePrice(card.querySelector(".product-footer strong").textContent);
  const image = card.querySelector("img")?.getAttribute("src") ?? "";
  const spec = card.querySelector(".product-info p")?.textContent.trim() ?? "";

  addItem({ id: slugify(name), name, price, image, spec });
};

const addItem = ({ id, name, price, image, spec }, qty = 1) => {
  const items = readCart();
  const found = items.find((item) => item.id === id);

  if (found) {
    found.qty += qty;
  } else {
    items.push({ id, name, price, image, spec, qty });
  }

  writeCart(items);
};

document.addEventListener("click", (event) => {
  const button = event.target.closest(".cart-button");

  if (!button) {
    return;
  }

  addToCart(button.closest(".product, .game"));

  const icon = button.querySelector(".bx");
  icon.classList.replace("bx-cart", "bx-check");
  setTimeout(() => icon.classList.replace("bx-check", "bx-cart"), 1000);
});

/* Página do carrinho (carrinho.html) */
/* Valor fixo de exemplo: ainda não existe cálculo real de frete. */
const SHIPPING_CENTS = 2490;

let shipping = null;
let shippingCep = "";
let shippingHint = "";
let couponOpen = false;
let couponHint = "";

const isSelected = (item) => item.selected !== false;

const renderCartPage = () => {
  const root = document.getElementById("cart-root");

  if (!root) {
    return;
  }

  const items = readCart();
  const title = document.querySelector(".cart-page h1 span");
  const count = items.reduce((sum, item) => sum + item.qty, 0);

  if (title) {
    title.textContent = count > 0 ? `Meu carrinho (${count})` : "Meu carrinho";
  }

  if (items.length === 0) {
    root.innerHTML = `
      <div class="cart-empty">
        <i class="bx bx-cart" aria-hidden="true"></i>
        <p>Seu carrinho está vazio.</p>
        <a class="cart-back" href="/src/index.html"><i class="bx bx-arrow-back" aria-hidden="true"></i> Continuar comprando</a>
      </div>`;
    return;
  }

  const chosen = items.filter(isSelected);
  const chosenQty = chosen.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = chosen.reduce((sum, item) => sum + item.price * item.qty, 0);
  const freight = chosen.length > 0 && shipping !== null ? shipping : 0;

  root.innerHTML = `
    <div class="cart-layout">
      <div class="cart-main">
        <ul class="cart-list">
          ${items
            .map(
              (item) => `
            <li class="cart-item" data-id="${item.id}">
              <label class="cart-check">
                <input type="checkbox" data-action="select" ${isSelected(item) ? "checked" : ""} />
                <span class="cart-check-box"><i class="bx bx-check" aria-hidden="true"></i></span>
                <span class="sr-only">Selecionar ${item.name}</span>
              </label>
              <img src="${item.image}" alt="" />
              <div class="cart-item-info">
                <h2>${item.name}</h2>
                ${item.spec ? `<p>${item.spec}</p>` : ""}
              </div>
              <div class="cart-qty">
                <button type="button" data-action="dec" aria-label="Diminuir quantidade"><i class="bx bx-minus" aria-hidden="true"></i></button>
                <span>${item.qty}</span>
                <button type="button" data-action="inc" aria-label="Aumentar quantidade"><i class="bx bx-plus" aria-hidden="true"></i></button>
              </div>
              <strong class="cart-item-total">${formatPrice(item.price * item.qty)}</strong>
              <button type="button" class="cart-remove" data-action="remove" aria-label="Remover ${item.name}"><i class="bx bx-trash" aria-hidden="true"></i></button>
            </li>`
            )
            .join("")}
        </ul>

        <div class="cart-actions">
          <a class="cart-back" href="/src/index.html"><i class="bx bx-arrow-back" aria-hidden="true"></i> Continuar comprando</a>
          <button type="button" class="cart-clear" data-action="clear"><i class="bx bx-trash" aria-hidden="true"></i> Limpar carrinho</button>
        </div>
      </div>

      <aside class="cart-summary">
        <h2>Resumo do pedido</h2>

        <p class="cart-line">
          <span>Subtotal (${chosenQty} ${chosenQty === 1 ? "item" : "itens"})</span>
          <strong>${formatPrice(subtotal)}</strong>
        </p>

        <button type="button" class="cart-coupon" data-action="coupon" aria-expanded="${couponOpen}">
          <i class="bx bx-purchase-tag-alt" aria-hidden="true"></i>
          <span>Cupom de desconto</span>
          <i class="bx bx-chevron-right" aria-hidden="true"></i>
        </button>
        ${
          couponOpen
            ? `<form class="cart-inline-form" data-form="coupon">
                <input type="text" name="coupon" placeholder="Código do cupom" aria-label="Código do cupom" />
                <button type="submit">Aplicar</button>
              </form>
              ${couponHint ? `<p class="cart-hint">${couponHint}</p>` : ""}`
            : ""
        }

        <h3 class="cart-subtitle"><i class="bx bxs-truck" aria-hidden="true"></i> Calcular frete</h3>
        <form class="cart-inline-form" data-form="shipping">
          <input type="text" name="cep" inputmode="numeric" maxlength="9" placeholder="Digite seu CEP" aria-label="CEP" value="${shippingCep}" />
          <button type="submit">Calcular</button>
        </form>
        ${shippingHint ? `<p class="cart-hint">${shippingHint}</p>` : ""}

        <p class="cart-line cart-line--divider">
          <span>Frete</span>
          <strong>${shipping !== null && chosen.length > 0 ? formatPrice(freight) : "—"}</strong>
        </p>

        <p class="cart-total">
          <span>Total</span>
          <strong>${formatPrice(subtotal + freight)}</strong>
        </p>

        <button type="button" class="cart-checkout" disabled>
          Finalizar compra <i class="bx bx-chevron-right" aria-hidden="true"></i>
        </button>
        <p class="cart-secure"><i class="bx bx-lock-alt" aria-hidden="true"></i> Compra 100% segura</p>
      </aside>
    </div>`;
};

document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");

  if (!button || button.dataset.action === "select") {
    return;
  }

  const action = button.dataset.action;

  if (action === "clear") {
    if (confirm("Remover todos os itens do carrinho?")) {
      writeCart([]);
      renderCartPage();
    }

    return;
  }

  if (action === "coupon") {
    couponOpen = !couponOpen;
    couponHint = "";
    renderCartPage();
    return;
  }

  const row = button.closest(".cart-item");

  if (!row) {
    return;
  }

  const items = readCart();
  const item = items.find((entry) => entry.id === row.dataset.id);

  if (action === "inc") {
    item.qty += 1;
  } else if (action === "dec") {
    item.qty -= 1;
  } else {
    item.qty = 0;
  }

  writeCart(items.filter((entry) => entry.qty > 0));
  renderCartPage();
});

document.addEventListener("change", (event) => {
  const box = event.target.closest('[data-action="select"]');

  if (!box) {
    return;
  }

  const items = readCart();
  items.find((entry) => entry.id === box.closest(".cart-item").dataset.id).selected = box.checked;
  writeCart(items);
  renderCartPage();
});

document.addEventListener("submit", (event) => {
  const form = event.target.closest("[data-form]");

  if (!form) {
    return;
  }

  event.preventDefault();

  if (form.dataset.form === "coupon") {
    couponHint = "Cupom inválido ou indisponível.";
  } else {
    const digits = form.elements.cep.value.replace(/\D/g, "");

    if (digits.length === 8) {
      shippingCep = `${digits.slice(0, 5)}-${digits.slice(5)}`;
      shipping = SHIPPING_CENTS;
      shippingHint = "";
    } else {
      shippingCep = form.elements.cep.value;
      shipping = null;
      shippingHint = "Digite um CEP com 8 números.";
    }
  }

  renderCartPage();
});

/* ----- Catálogo: listagem (produtos.html) e detalhe (produto.html) ----- */
/* PRODUCTS vem de js/products.js, carregado só nas páginas que precisam dele. */
const catalog = (typeof PRODUCTS === "undefined" ? [] : PRODUCTS).map((product) => ({
  ...product,
  id: slugify(product.name),
}));

const CATEGORY_LABELS = {
  consoles: "Consoles",
  jogos: "Jogos",
  acessorios: "Acessórios",
  "pc-gamer": "PC Gamer",
  colecionaveis: "Colecionáveis",
};

const LISTED_CATEGORIES = ["consoles", "jogos", "acessorios", "pc-gamer", "colecionaveis"];

const SORT_OPTIONS = [
  ["", "Relevância"],
  ["preco-asc", "Menor preço"],
  ["preco-desc", "Maior preço"],
  ["nome", "Nome (A-Z)"],
];

const productUrl = (id) => `/src/produto.html?id=${id}`;

const listUrl = (params) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      query.set(key, value);
    }
  });

  const text = query.toString();
  return `/src/produtos.html${text ? `?${text}` : ""}`;
};

const escapeHtml = (text) =>
  text.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);

const normalize = (text) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

const productCard = (product) => `
  <article class="product">
    <a class="product-image" href="${productUrl(product.id)}">
      <img src="${product.image}" alt="${escapeHtml(product.name)}" loading="lazy" />
    </a>
    <div class="product-info">
      <h3><a href="${productUrl(product.id)}">${escapeHtml(product.name)}</a></h3>
      ${product.spec ? `<p>${escapeHtml(product.spec)}</p>` : ""}
    </div>
    <div class="product-footer">
      <strong>${formatPrice(product.price)}</strong>
      <button type="button" class="cart-button" aria-label="Adicionar ao carrinho">
        <i class="bx bx-cart" aria-hidden="true"></i>
      </button>
    </div>
  </article>`;

const renderProductList = () => {
  const root = document.getElementById("products-root");

  if (!root) {
    return;
  }

  const params = new URLSearchParams(location.search);
  const category = params.get("categoria") || "";
  const query = (params.get("q") || "").trim();
  const order = params.get("ordem") || "";

  const list = catalog.filter(
    (product) =>
      (!category || product.category === category) &&
      (!query ||
        normalize([product.name, product.spec, product.brand, CATEGORY_LABELS[product.category]].join(" ")).includes(
          normalize(query)
        ))
  );

  if (order === "preco-asc") {
    list.sort((a, b) => a.price - b.price);
  } else if (order === "preco-desc") {
    list.sort((a, b) => b.price - a.price);
  } else if (order === "nome") {
    list.sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
  }

  const title = query
    ? `Resultados para "${escapeHtml(query)}"`
    : CATEGORY_LABELS[category] || "Todos os produtos";

  document.title = `${query ? "Busca" : CATEGORY_LABELS[category] || "Produtos"} | Games e Acessórios`;

  root.innerHTML = `
    <h1 class="list-title">${title}</h1>

    <div class="list-toolbar">
      <nav class="list-chips" aria-label="Categorias">
        <a class="chip${category ? "" : " is-active"}" href="${listUrl({ q: query, ordem: order })}">Todos</a>
        ${LISTED_CATEGORIES.map(
          (key) =>
            `<a class="chip${category === key ? " is-active" : ""}" href="${listUrl({ categoria: key, q: query, ordem: order })}">${CATEGORY_LABELS[key]}</a>`
        ).join("")}
      </nav>

      <label class="list-sort">
        <span>Ordenar por</span>
        <select id="sort-select">
          ${SORT_OPTIONS.map(
            ([value, label]) => `<option value="${value}"${order === value ? " selected" : ""}>${label}</option>`
          ).join("")}
        </select>
      </label>
    </div>

    <p class="list-count">${list.length} ${list.length === 1 ? "produto" : "produtos"}</p>

    ${
      list.length > 0
        ? `<div class="products">${list.map(productCard).join("")}</div>`
        : `<div class="cart-empty">
            <i class="bx bx-search" aria-hidden="true"></i>
            <p>Nenhum produto encontrado.</p>
            <a class="cart-back" href="/src/produtos.html">Ver todos os produtos</a>
          </div>`
    }`;
};

const renderProductPage = () => {
  const root = document.getElementById("product-root");

  if (!root) {
    return;
  }

  const product = catalog.find((item) => item.id === new URLSearchParams(location.search).get("id"));

  if (!product) {
    root.innerHTML = `
      <div class="cart-empty">
        <i class="bx bx-error-circle" aria-hidden="true"></i>
        <p>Produto não encontrado.</p>
        <a class="cart-back" href="/src/produtos.html">Ver todos os produtos</a>
      </div>`;
    return;
  }

  document.title = `${product.name} | Games e Acessórios`;

  const related = catalog.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 5);
  const installment = formatPrice(Math.ceil(product.price / 12));

  root.dataset.id = product.id;
  root.innerHTML = `
    <nav class="breadcrumb" aria-label="Você está em">
      <a href="/src/index.html">Início</a>
      <i class="bx bx-chevron-right" aria-hidden="true"></i>
      <a href="${listUrl({ categoria: product.category })}">${CATEGORY_LABELS[product.category]}</a>
      <i class="bx bx-chevron-right" aria-hidden="true"></i>
      <span>${escapeHtml(product.name)}</span>
    </nav>

    <div class="product-detail">
      <div class="detail-image">
        <img src="${product.image}" alt="${escapeHtml(product.name)}" />
      </div>

      <div class="detail-info">
        <h1>${escapeHtml(product.name)}</h1>
        <p class="detail-meta">${[product.brand, product.spec].filter(Boolean).map(escapeHtml).join(" • ")}</p>

        <p class="detail-price">${formatPrice(product.price)}</p>
        <p class="detail-installments">ou 12x de ${installment} sem juros</p>

        <div class="detail-buy">
          <div class="cart-qty">
            <button type="button" data-detail="dec" aria-label="Diminuir quantidade"><i class="bx bx-minus" aria-hidden="true"></i></button>
            <span id="detail-qty">1</span>
            <button type="button" data-detail="inc" aria-label="Aumentar quantidade"><i class="bx bx-plus" aria-hidden="true"></i></button>
          </div>
          <button type="button" class="detail-add" data-detail="add">
            <i class="bx bx-cart" aria-hidden="true"></i> Adicionar ao carrinho
          </button>
        </div>
        <button type="button" class="detail-buy-now" data-detail="buy">Comprar agora</button>

        <ul class="detail-perks">
          <li><i class="bx bxs-truck" aria-hidden="true"></i> Frete para todo o Brasil</li>
          <li><i class="bx bx-credit-card" aria-hidden="true"></i> Parcele em até 12x no cartão</li>
          <li><i class="bx bx-shield-quarter" aria-hidden="true"></i> Compra segura e dados protegidos</li>
        </ul>

        <h2>Descrição</h2>
        <p class="detail-description">${escapeHtml(product.description)}</p>
      </div>
    </div>

    ${
      related.length > 0
        ? `<section class="shelf" aria-label="Produtos relacionados">
            <header class="section-head">
              <h2 class="section-title">Produtos relacionados</h2>
            </header>
            <div class="products">${related.map(productCard).join("")}</div>
          </section>`
        : ""
    }`;
};

/* Compra na página do produto */
document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-detail]");
  const root = document.getElementById("product-root");

  if (!button || !root?.dataset.id) {
    return;
  }

  const qtyBox = document.getElementById("detail-qty");
  const action = button.dataset.detail;
  let qty = Number(qtyBox.textContent);

  if (action === "inc") {
    qtyBox.textContent = qty + 1;
    return;
  }

  if (action === "dec") {
    qtyBox.textContent = Math.max(1, qty - 1);
    return;
  }

  addItem(catalog.find((item) => item.id === root.dataset.id), qty);

  if (action === "buy") {
    location.href = "/src/carrinho.html";
    return;
  }

  const original = button.innerHTML;
  button.innerHTML = '<i class="bx bx-check" aria-hidden="true"></i> Adicionado!';
  setTimeout(() => (button.innerHTML = original), 1200);
});

/* Ordenação da listagem */
document.addEventListener("change", (event) => {
  if (event.target.id !== "sort-select") {
    return;
  }

  const params = new URLSearchParams(location.search);

  if (event.target.value) {
    params.set("ordem", event.target.value);
  } else {
    params.delete("ordem");
  }

  location.search = params.toString();
});

/* Busca do header (desktop e menu mobile) leva para a listagem */
document.addEventListener("submit", (event) => {
  const form = event.target.closest(".search, .mobile-search");

  if (!form) {
    return;
  }

  event.preventDefault();
  location.href = listUrl({ q: form.querySelector("input").value.trim() });
});

/* Na home, nome e imagem dos cartões passam a abrir o produto. */
const linkCards = () => {
  document.querySelectorAll(".product, .game").forEach((card) => {
    const title = card.querySelector("h3");

    if (!title || title.querySelector("a")) {
      return;
    }

    const url = productUrl(slugify(title.textContent.trim()));
    title.innerHTML = `<a href="${url}">${title.innerHTML}</a>`;

    const media = card.querySelector(".product-image, .game-cover");

    if (media && media.tagName !== "A") {
      media.style.cursor = "pointer";
      media.addEventListener("click", () => (location.href = url));
    }
  });
};
