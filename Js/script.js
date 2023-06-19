//Assigning Variables
var return_journey = document.querySelector('#round-trip-1');
var one_trip_journey = document.querySelector('#one-trip-1');
var round_trip_box = document.querySelector('#round-trip-box');
var round_trip_return = document.querySelector('#datefield-return2');
var round_trip_return_box = document.querySelector('#datefield_div');
document.querySelector('#datefield-return').setAttribute('min', today);
round_trip_return.setAttribute('min', today);
const asia_box = document.querySelector('#air-asia');
const india_box = document.querySelector('#air-india');
const indigo_box = document.querySelector('#indigo');
const spiceject_box = document.querySelector('#spicejet');

//get started button
function getStarted() {
      document.querySelector('.opening-img').style.display='none';
      document.querySelector('header').style.display='block';
      document.querySelector('main').style.display='block';
      document.querySelector('footer').style.display='block';
      document.querySelector('.getstarted-btn').style.display = 'none';
      document.querySelector('.start-quote').style.display='none';
      document.querySelector('body').style.background='black';
}


// hamburger Menu
function menu() {
      var ham = document.getElementById('myLinks');
      if (ham.style.display === 'block') {
            ham.style.display = 'none';
      } else {
            ham.style.display = 'block';
      }
}

//  Scroll To Top
function goToTop() {
      window.scrollTo(0, 0);
}

//Empty array for Filter
let airlines_array = [];
let stops_array = [];
round_trip_return_box.style.display = 'none';
let airlines_data = document.querySelectorAll('.airlines_data');
let stops_data = document.querySelectorAll('.stops');


var price_changer, price_change_int = 0, clicked = false;
var c = 0;
var today = new Date();
//Disable past dates in calender
function dateSetUp() {
      var dd = today.getDate();
      var mm = today.getMonth() + 1;
      var yyyy = today.getFullYear();
      if (dd < 10) {
            dd = '0' + dd
      }
      if (mm < 10) {
            mm = '0' + mm
      }
      today = yyyy + '-' + mm + '-' + dd;
}
dateSetUp();
document.querySelector('#datefield').setAttribute('min', today);
document.querySelector('#datefield-2').setAttribute('min', today);

//Function to display return date
function display() {
      round_trip_box.style.display = return_journey.checked ? 'flex' : 'none';
      round_trip_return_box.style.display = return_journey.checked ? 'flex' : 'none';
}
return_journey.addEventListener('click', function () {
      display();

});
one_trip_journey.addEventListener('click', function () {
      display();
});

let search = document.querySelector('#search-btn');
let body_content = document.querySelector('#body-content');
let footer_section = document.querySelector('#footer-section');
let flight_results = document.querySelector('#flight-search-results');
var from_text, to_text, date_text, persons_text, from_text_lower, to_text_lower, return_date_text;
let persons_int;

// Search Flights on CLick for results 
search.addEventListener('click', function () {
      from_text = document.getElementById('from-1').value;
      from_text_lower = from_text.toLowerCase();
      to_text = document.getElementById('to-1').value;
      to_text_lower = to_text.toLowerCase();
      date_text = document.getElementById('datefield').value;
      persons_text = document.getElementById('num-1').value;
      persons_int = parseInt(persons_text);
      console.log(from_text);

      // To check empty fields
      if (from_text != '' && to_text != '' && date_text != '' && persons_text != 0) {
            if (from_text_lower == to_text_lower) {
                  alert('Different Source and Destination are needed');
            }
            else {

                  //Condition to check round trip
                  if (round_trip_return_box.style.display != 'none') {
                        return_date_text = document.getElementById('datefield-return').value;
                        if (return_date_text != '') {
                              if (date_text > return_date_text) {
                                    alert('Please Enter Date greater than departure date');
                              }
                              else {

                                    //condition to check number of passengers
                                    if (persons_text > 10 || persons_text <= 0) {
                                          alert('Check The Limit');
                                    }
                                    else {
                                          document.getElementById('datefield-return2').value = return_date_text;
                                          document.getElementById('from-2').value = from_text_lower;
                                          document.getElementById('to-2').value = to_text_lower;
                                          document.getElementById('datefield-2').value = date_text;
                                          document.getElementById('num-2').value = persons_text;
                                          body_content.style.display = 'none';
                                          document.getElementById('footer-section').style.display = 'none';

                                          flight_results.style.display = 'flex';
                                          jsonFetching();
                                    }
                              }
                        }
                        else {
                              alert('Fill all the fields');
                        }
                  }
                  else {
                        if (persons_text > 10 || persons_text <= 0) {
                              alert('Exceeded the limit😐 ');
                        }
                        else {
                              document.getElementById('from-2').value = from_text_lower;
                              document.getElementById('to-2').value = to_text_lower;
                              document.getElementById('datefield-2').value = date_text;
                              document.getElementById('num-2').value = persons_text;
                              body_content.style.display = 'none';
                              flight_results.style.display = 'flex';
                              footer_section.style.display = 'none';
                              jsonFetching();
                        }
                  }

            }
      }
      else {
            alert('Fill all the fields🧐 ');
      }

});

document.getElementById('input-search-btn').addEventListener('click', function () {
      from_text_lower = (document.getElementById('from-2').value).toLowerCase();
      to_text_lower = (document.getElementById('to-2').value).toLowerCase();
      date_text = document.getElementById('datefield-2').value;
      if (round_trip_return_box.style.display != 'none') {
            return_date_text = document.getElementById('datefield-return2').value;
      }
      persons_text = document.getElementById('num-2').value;
      persons_int = parseInt(persons_text);
      jsonFetching();
});

//JSON data fetching function
function jsonFetching() {
      let xhr = new XMLHttpRequest();
      xhr.open('get','planesdata.json', true);
      xhr.send();
      xhr.onload = function () {
            if (this.readyState == 4 && this.status == 200) {
                  console.log(this);
                  let aeroplanes = JSON.parse(this.responseText);
                  aeroplanes.sort(GetPriceSortOrder('price'));
                  let locations = aeroplanes[(aeroplanes.length) - 1].locations;

                  locations.map(element => {
                        return element.toLowerCase();
                  });
                   // Displaying Flight 
            function displayFlights() {
                  let flightdata = '';
                  let book_arr = [];
                  for (let i = 0; i < (aeroplanes.length) - 1; i++) {

                        item = aeroplanes[i];

                        if (airlines_array.length == 0 && stops_array.length == 0) {
                              result += tiles_data(flightdata, item, i);
                              book_arr.push(i);

                        }
                        else if (airlines_array.length != 0 && stops_array.length != 0) {
                              if (airlines_array.includes(item.name) && stops_array.includes(item.stops)) {
                                    result += tiles_data(flightdata, item, i);
                                    book_arr.push(i);
                              }
                        }
                        else if (airlines_array.includes(item.name)) {
                              result += tiles_data(flightdata, item, i);
                              book_arr.push(i);
                        }
                        else if (stops_array.includes(item.stops)) {
                              result += tiles_data(flightdata, item, i);
                              book_arr.push(i);
                        }
                        document.querySelector('.flights-information').innerHTML = result;


                        if (clicked) {
                              console.log('click');

                              if (item.price <= price_change_int) {
                                    result = '';
                                    result += tiles_data(flightdata, item, i);
                              }
                              document.querySelector('.flights-information').innerHTML = result;

                        }
                  }
                              
            }
                  //price range slider variable 
                  var slider = document.getElementById('range');
                  var output = document.getElementById('price_value');
                  output.innerHTML = slider.value;
                  let result = '';
                  displayFlights();

                  //displays data according to the stops
                  for (let i = 0; i < stops_data.length; i++) {
                        let action = 0;
                        stops_data[i].addEventListener('click', function () {
                              if (action % 2 == 0) {
                                    document.querySelector('.flights-information').style.display = 'none';
                                    stops_array.push(stops_data[i].value);
                                    action = action + 1;
                                    result = '';
                                    displayFlights();
                                    document.querySelector('.flights-information').style.display = 'flex';
                              }
                              else {
                                    stops_array.splice(stops_array.indexOf(stops_data[i].value), 1);
                                    action = action + 1;
                                    result = '';
                                    displayFlights();

                              }
                        })
                  }
                  //Price slider Filter
                  slider.addEventListener('click', function (event) {
                        price_changer = event.target.value;
                        output.innerHTML = price_changer;
                        price_change_int = parseInt(price_changer);
                        clicked = true;
                        displayFlights();
                  });

                  //Airlines Filters
                  for (let i = 0; i < airlines_data.length; i++) {
                        let action = 0;
                        airlines_data[i].addEventListener('click', function () {
                              if (action % 2 == 0) {
                                    document.querySelector('.flights-information').style.display = 'none';
                                    airlines_array.push(airlines_data[i].value);
                                    action = action + 1;
                                    result = '';
                                    displayFlights();
                                    document.querySelector('.flights-information').style.display = 'flex';
                                    console.log(airlines_array);
                              }
                              else {
                                    console.log(airlines_array.indexOf(airlines_data[i].value));
                                    airlines_array.splice(airlines_array.indexOf(airlines_data[i].value), 1);
                                    action = action + 1;
                                    result = '';
                                    displayFlights();
                                    console.log(airlines_array);
                              }
                        });
                  }
            }
           
      }
}
//Each flight data
function tiles_data(flightdata, item, itemId) {

      for (let i = 0; i < (item.source.length); i++) {

            if (item.source[i] == from_text_lower && item.destination[i] == to_text_lower) {

                  flightdata = flightDetails(flightdata, item, i, itemId);
            }
            if (round_trip_return_box.style.display != 'none') {
                  if (item.destination[i] == from_text_lower && item.source[i] == to_text_lower) {
                        flightdata = flightDetails(flightdata, item, i, itemId);
                  }
            }

      }

      return flightdata;
}
//Flight Tiles render
function flightDetails(flightdata, item, i, itemId) {
      flightdata += `<div class='one-flight-info'>
      <div class='flight-data'>
      <img src='${item.image}' alt='flight-img' class='flight-data-img'>
      </div>
      <div class='flight-data'>
      <p class='flight-brand flight-brand-name'>${item.name}</p>
      <p class='flight-brand flight-id'>${item.id}</p>
      </div>
      <div class='arrival-details flight-data'>
      <p>${item.arrival_time[i]}</p>
      <p >${item.source[i].charAt(0).toUpperCase() + item.source[i].slice(1)}</p>
      </div>
      <div class='flight-data'>
      <p class='number_stops'>${item.stops}</p>
      <hr>
      <p>${item.duration} hrs</p>
      </div>
      <div class='departure-details flight-data'>
            <p>${item.departure_time[i]}</p>
            <p>${item.destination[i].charAt(0).toUpperCase() + item.destination[i].slice(1)}</p>
      </div>
      <p class='flight-price'>Rs${item.cost}</p>
      </div>`
      return flightdata;

}
//Sorting by price
function GetPriceSortOrder(p) {
      return function (a, b) {
            if (a[p] < b[p]) {
                  return -1;
            } else if (a[p] > b[p]) {
                  return 1;
            }
            return 0;
      }
}
//  //Searching Flights using airlines brands in search bar
 function searching() {
      var input, flight_searching, filter, a, txtValue;
      input = document.getElementById('myInput');
      filter = input.value.toUpperCase();
      flight_searching = document.querySelectorAll('.one-flight-info');
      for (let i = 0; i < flight_searching.length; i++) {
            a = flight_searching[i].getElementsByClassName('flight-brand')[0];
            txtValue = a.textContent || a.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                  flight_searching[i].style.display = 'flex';
            } else {
                  flight_searching[i].style.display = 'none';
            }
      }
}
function init(){
      
}

window.onload = function () {
      init();
  
  
  };








