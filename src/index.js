import { fetchCountries } from './js/fetchCountries';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import './css/styles.css';

const DEBOUNCE_DELAY = 300;
const refs = {
  input: document.querySelector('#search-box'),
  list: document.querySelector('.country-list'),
  info: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(evt) {
  evt.preventDefault();
  const name = refs.input.value.trim();
  if (!name) {
    resetInput();
    return;
  }

  fetchCountries(name)
    .then(response => onFetchResponse(response))
    .catch(error => onFetchError(error));
}

function resetInput() {
  refs.list.innerHTML = '';
  refs.info.innerHTML = '';
}

function onFetchError(error) {
  resetInput();
  return Notiflix.Notify.failure('Oops, there is no country with that name');
}

function onFetchResponse(response) {
  resetInput();
  const countriesName = response;
  if (countriesName.length > 10) {
    return Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  }
  if (countriesName.length >= 2 && countriesName.length <= 10) {
    listCountries(countriesName);
  } else {
    oneCountry(countriesName);
  }
}

function oneCountry(countriesName) {
  const markupInfo = countriesName
    .map(({ capital, population, languages }) => {
      return `<p class = "country-info__data"><b>Capital:</b> ${capital}</p><p class = "country-info__data"><b>Population:</b> ${population}</p><p class = "country-info__data"><b>Languages:</b>
       ${Object.values(languages).join(', ')}</p>`;
    })
    .join('');
  refs.info.innerHTML = markupInfo;
}

function listCountries(countriesName) {
  const markupCountry = countriesName
    .map(({ name, flags }) => {
      return `<li class = "country-list__item"><img src="${flags.svg}" alt="${name.common}" width="60" height="45"><span class = "country-list__name">${name.official}</span></li>`;
    })
    .join('');
  refs.list.innerHTML = markupCountry;
}
