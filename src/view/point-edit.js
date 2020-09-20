import {generateOffers, generateDescription, generatePhoto} from "../mock/events.js";
import {toHoursAndMinutes, toForwardSlashDate} from "../utils/task.js";
import SmartView from "./smart.js";
import {cities} from "../const.js";
import flatpickr from "flatpickr";

import "../../node_modules/flatpickr/dist/flatpickr.min.css";

const createDestinationListTemplate = (destinations) => {
  return `<datalist id="destination-list-1">
    ${destinations.map((destination) => `<option value="${destination}"></option>`).join(`\n`)}
  </datalist>`;
};

const createDestinationTemplate = (description, photos) => {
  if (description === null && photos === null) {
    return ``;
  }
  const photosTemplate = photos
  .map((photo) => {
    return `<img class="event__photo" src="${photo}" alt="Event photo"></img>`;
  })
  .join(`\n`);
  return `<section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${description}</p>
            <div class="event__photos-container">
              <div class="event__photos-tape">
                ${photosTemplate}
              </div>
            </div>
          </section>`;
};

const createOfferTemplate = (offer) => {
  if (!offer) {
    return ``;
  }

  const {title, type, cost, isChecked} = offer;
  const checkedAttributeValue = isChecked ? `checked` : ``;

  return (
    `<div class="event__offer-selector">
      <input
        class="event__offer-checkbox  visually-hidden"
        id="event-offer-${type}-1" type="checkbox"
        name="event-offer-${type}"
        ${checkedAttributeValue}
      >
      <label class="event__offer-label" for="event-offer-${type}-1">
        <span class="event__offer-title">${title}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${cost}</span>
      </label>
    </div>`
  );
};

const createOffersTemplate = (offers) => {
  if (offers.length === 0) {
    return ``;
  }

  return `<section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>
            <div class="event__available-offers">
              ${offers.map(createOfferTemplate).join(`\n`)}
            </div>
          </section>`;
};

const createPointEditTemplate = (data) => {

  const {isFavorite, point, destination, startDate, endDate, offers, price, description, photos} = data;

  return `<form class="event  event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/flight.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Transfer</legend>

              <div class="event__type-item">
                <input id="event-type-taxi-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="taxi">
                <label class="event__type-label  event__type-label--taxi" for="event-type-taxi-1">Taxi</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-bus-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="bus">
                <label class="event__type-label  event__type-label--bus" for="event-type-bus-1">Bus</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-train-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="train">
                <label class="event__type-label  event__type-label--train" for="event-type-train-1">Train</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-ship-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="ship">
                <label class="event__type-label  event__type-label--ship" for="event-type-ship-1">Ship</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-transport-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="transport">
                <label class="event__type-label  event__type-label--transport" for="event-type-transport-1">Transport</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-drive-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="drive">
                <label class="event__type-label  event__type-label--drive" for="event-type-drive-1">Drive</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-flight-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="flight" checked>
                <label class="event__type-label  event__type-label--flight" for="event-type-flight-1">Flight</label>
              </div>
            </fieldset>

            <fieldset class="event__type-group">
              <legend class="visually-hidden">Activity</legend>

              <div class="event__type-item">
                <input id="event-type-check-in-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="check-in">
                <label class="event__type-label  event__type-label--check-in" for="event-type-check-in-1">Check-in</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-sightseeing-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="sightseeing">
                <label class="event__type-label  event__type-label--sightseeing" for="event-type-sightseeing-1">Sightseeing</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-restaurant-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="restaurant">
                <label class="event__type-label  event__type-label--restaurant" for="event-type-restaurant-1">Restaurant</label>
              </div>
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${point}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination}" list="destination-list-1">
          ${createDestinationListTemplate(cities)}
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">
            From
          </label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${toForwardSlashDate(startDate)} ${toHoursAndMinutes(startDate)}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">
            To
          </label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${toForwardSlashDate(startDate)} ${toHoursAndMinutes(endDate)}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>

        <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isFavorite && `checked`}>
        <label class="event__favorite-btn" for="event-favorite-1">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </label>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>

      <section class="event__details">
        ${createOffersTemplate(offers)}
        ${createDestinationTemplate(description, photos)}
      </section>
    </form>`;
};

export default class Form extends SmartView {
  constructor(event) {
    super();
    this._data = event;
    this._datepicker = null;
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._formDeleteClickHandler = this._formDeleteClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._eventTypeChangeHandler = this._eventTypeChangeHandler.bind(this);
    this._destinationChoseHandler = this._destinationChoseHandler.bind(this);
    this._priceChangeHandler = this._priceChangeHandler.bind(this);
    this._startDateFocusHandler = this._startDateFocusHandler.bind(this);
    this._endDateFocusHandler = this._endDateFocusHandler.bind(this);

    this._setInnerHandlers();
    this._startDateFocusHandler();
    this._endDateFocusHandler();
  }

  removeElement() {
    super.removeElement();

    if (this._datepicker) {
      this._datepicker.destroy();
      this._datepicker = null;
    }
  }

  getTemplate() {
    return createPointEditTemplate(this._data);
  }

  reset(event) {
    this.updateData(Form.parseEventToData(event));
  }

  _startDateFocusHandler() {
    if (this._datepicker) {
      this._datepicker.destroy();
      this._datepicker = null;
    }

    this._datepicker = flatpickr(
        this.getElement().querySelector(`#event-start-time-1`),
        {
          enableTime: true,
          dateFormat: `d/m/y H:i`,
          defaultDate: this._data.startDate,
          onChange: ([userDate]) => {
            this.updateData({
              startDate: userDate,
              endDate: this._data.endDate
            }, true);
          }
        }
    );
  }

  _endDateFocusHandler() {
    if (this._datepicker) {
      this._datepicker.destroy();
      this._datepicker = null;
    }

    this._datepicker = flatpickr(
        this.getElement().querySelector(`#event-end-time-1`),
        {
          enableTime: true,
          dateFormat: `d/m/y H:i`,
          minDate: this._data.startDate,
          defaultDate: this._data.endDate,
          onChange: ([userDate]) => {
            this.updateData({
              startDate: this._data.startDate,
              endDate: userDate
            }, true);
          }
        }
    );
  }

  _eventTypeChangeHandler(evt) {
    this.updateData({
      point: evt.target.value,
      destination: null,
      offers: generateOffers(false),
    });
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  _destinationChoseHandler(evt) {
    const userDestination = evt.target.value;
    const update = {
      description: generateDescription(),
      photos: generatePhoto()
    };

    if (this._data.destination.some((destination) => destination === userDestination)) {
      update.destination = userDestination;
    } else {
      update.destination = ``;
    }

    this.updateData(update);
  }

  _priceChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({price: evt.target.value});
  }

  _formDeleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(Form.parseDataToEvent(this._data));
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();

    if (this._data.startDate > this._data.endDate) {
      return;
    }

    this._callback.formSubmit(this._data);
  }

  _setInnerHandlers() {
    this.getElement().querySelectorAll(`.event__type-group`).forEach((eventTypeGroup) => {
      eventTypeGroup.addEventListener(`change`, this._eventTypeChangeHandler);
    });

    this.getElement().querySelector(`.event__input--destination`).addEventListener(`change`, this._destinationChoseHandler);
    this.getElement().querySelector(`#event-start-time-1`).addEventListener(`focus`, this._startDateFocusHandler);
    this.getElement().querySelector(`#event-end-time-1`).addEventListener(`focus`, this._endDateFocusHandler);
    this.getElement().querySelector(`.event__input--price`).addEventListener(`change`, this._priceChangeHandler);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this._startDateFocusHandler();
    this._endDateFocusHandler();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setFavoriteClickHandler(this._callback.favoriteClick);
    this.setDeleteClickHandler(this._callback.deleteClick);
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, this._formDeleteClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector(`.event__favorite-checkbox`).addEventListener(`click`, this._favoriteClickHandler);
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().addEventListener(`submit`, this._formSubmitHandler);
  }

  static parseEventToData(event) {
    return Object.assign(
        {},
        event,
        {
          isFavorite: event.isFavorite ? `checked` : ``
        }
    );
  }

  static parseDataToEvent(data) {
    data = Object.assign({}, data);

    delete data.isFavorite;

    return data;
  }

}
