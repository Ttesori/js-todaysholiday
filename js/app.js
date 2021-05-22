const els = {
  daysEl: document.querySelector('.tih-days'),
  getDayBtn: document.querySelector('.tih-submit'),
  getDateInput: document.querySelector('.tih-date-picker'),
  dateHeaderEl: document.querySelector('.tih-date'),
  searchTextEl: document.querySelector('.tih-search-text'),
  searchBtnEl: document.querySelector('.tih-search-btn'),
  searchResultsEl: document.querySelector('.tih-search-results')
}

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const monthsOfYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const getDayData = async (day = new Date()) => {
  const todayMonth = day.getUTCMonth();
  const todayDate = day.getUTCDate();
  const prettyDay = daysOfWeek[day.getUTCDay()];
  const prettyMonth = monthsOfYear[todayMonth];
  const prettyDate = todayDate.length === 1 ? '0' + todayDate : todayDate;
  els.dateHeaderEl.textContent = `${prettyDay}, ${prettyMonth} ${prettyDate} ${day.getUTCFullYear()}`;
  try {
    let res = await fetch(`https://todaysholiday.herokuapp.com/holidays/${todayMonth + 1}/${todayDate}`);
    let dayArr = await res.json();
    els.daysEl.innerHTML = '';
    dayArr.forEach(day => {
      let newEl = document.createElement('li');
      newEl.textContent = day.name;
      els.daysEl.appendChild(newEl);
    })
  } catch (err) {
    console.log(err);
  }
}

getDayData();

const searchDays = async () => {
  els.searchResultsEl.textContent = '';
  let query = encodeURIComponent(els.searchTextEl.value);
  let results = await fetch(`http://todaysholiday.herokuapp.com/holidays/search?s=${query}`);
  let days = await results.json();
  if (!days.length) els.searchResultsEl.textContent = 'No results found...';
  days.forEach(day => {
    let newLi = document.createElement('li');
    newLi.textContent = `${day.month}/${day.day}: ${day.name}`;
    els.searchResultsEl.appendChild(newLi);
  });

}

els.searchBtnEl.addEventListener('click', searchDays);

els.getDayBtn.addEventListener('click', () => {
  const pickedDate = els.getDateInput.value;
  if (pickedDate) {
    getDayData(new Date(pickedDate));
    els.getDateInput.value = '';
  }
});



