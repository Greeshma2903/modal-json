"use strict";

// load data on window load event
document.addEventListener("DOMContentLoaded", loadData);

// render data from json ----------->
async function fetchData() {
  try {
    const res = await fetch("./data.json");
    const data = await res.json();
    return data;
  } catch (err) {
    return err.message;
  }
}

// modal open ------->
function openModal(btn) {
  const modalId = btn.dataset.modal;
  const modalContainer = document.querySelector(`.modal-container#${modalId}`);

  modalContainer.classList.add("show");
}

// modal close logic --------->
function closeModal(btn) {
  // select the modal to be closed
  const modalId = btn.dataset.modal;
  const modalContainer = document.querySelector(`.modal-container#${modalId}`);

  // remove the "show" class
  modalContainer.classList.remove("show");
}

// card data ------->
function fillCard(events, container) {
  // card data
  const cards = events.map((eve) => {
    // coordinators HTML data
    const coordinators = eve.coordinators
      .map((item) => {
        return `
            <p>${item.Name}: ${item.Contact}</p>
        `;
      })
      .join(" ");

    // the HTML for the card: using template literals
    const html = `
        <div class="card" data-card="${eve.event}">
          <div class="card-content">
            <h3>${eve.event_name}</h3>
            <h4>${eve.alias_name}</h4>
            <p class="coordinators">Coodinators:</p>
            ${coordinators}
          </div>
          <button class="card-action btn btn-primary" id="openModal" data-modal="${eve.event}" onClick="openModal(this)">
            read more
          </button>
        </div>

        <div class="modal-container" id="${eve.event}">
            <div class="modal">
                <div class="modal-content">
                    <p>${eve.rules[0]}</p>
                    <p>${eve.rules[1]}</p>
                </div>
                <button class="close btn btn-primary" data-modal="${eve.event}" onClick="closeModal(this)">close</button>
            </div>
        </div>`;

    return html;
  });
  container.innerHTML = cards.join("");
}

// load data ------->
async function loadData() {
  // fetch data
  const data = await fetchData();

  //   extract category names
  const catArray = Object.keys(data);

  // map over each category and create sections and cards within
  catArray.map((item, i) => {

    // create 'section' and 'h1' tag
    const section = document.createElement("section");
    const heading = document.createElement("h1");
    heading.innerHTML = item;
    heading.classList.add("section-title");

    const cardContainer = document.createElement("div");
    cardContainer.classList.add("cards-container");

    // insert cards and modal
    fillCard(data[item], cardContainer);

    section.append(heading);
    section.append(cardContainer);
    section.classList.add("category");

    // append sections to body
    document.querySelector("body").append(section);
  });
}
