// Function to fetch and display places data
function fetchPlacesData (data = {}) {
  // Show loading indicator
  $('.loading-indicator').show();

  $.ajax({
    url: 'http://127.0.0.1:5001/api/v1/places_search/',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(data),
    success: (response) => {
      // Clear existing places
      $('.places').empty();

      // Loop through the result of the request and create article tags representing Places
      response.forEach((place) => {
        // Create the article tag
        const article = $('<article>');

        // Create the title box
        const titleBox = $('<div>').addClass('title_box');
        titleBox.append($('<h2>').text(place.name));
        titleBox.append(
          $('<div>')
            .addClass('price_by_night')
            .text('$' + place.price_by_night)
        );

        // Create the information div
        const information = $('<div>').addClass('information');
        information.append(
          $('<div>')
            .addClass('max_guest')
            .text(
              place.max_guest + ' Guest' + (place.max_guest !== 1 ? 's' : '')
            )
        );
        information.append(
          $('<div>')
            .addClass('number_rooms')
            .text(
              place.number_rooms +
                ' Bedroom' +
                (place.number_rooms !== 1 ? 's' : '')
            )
        );
        information.append(
          $('<div>')
            .addClass('number_bathrooms')
            .text(
              place.number_bathrooms +
                ' Bathroom' +
                (place.number_bathrooms !== 1 ? 's' : '')
            )
        );

        // Create the description div
        const description = $('<div>')
          .addClass('description')
          .html(place.description);

        // Make a separate AJAX request to fetch user details
        $.ajax({
          url: `http://127.0.0.1:5001/api/v1/users/${place.user_id}`,
          type: 'GET',
          success: (user) => {
            // Create the user div with the retrieved user details
            const userDiv = $('<div>').addClass('user');
            const owner = $('<b>').text('Owner:');
            userDiv.append(owner);
            userDiv.append(' ' + user.first_name + ' ' + user.last_name);

            // Append elements to the article
            article.append(titleBox);
            article.append(information);
            article.append(userDiv);
            article.append(description);
          },
          error: (xhr, status, error) => {
            // Hide loading indicator in case of error
            $('.loading-indicator').hide();
            console.error('Error fetching user data:', error);
          }
        });

        // Append article to section.places
        $('.places').append(article);
      });
    },
    error: (xhr, status, error) => {
      // Hide loading indicator in case of error
      $('.loading-indicator').hide();
      // Log any errors to console
      console.error('Error fetching places data:', error);
    }
  });
}

// Execute the script when DOM is loaded
$(document).ready(function () {
  // Initialize empty objects to store Amenity IDs, State IDs, and City IDs
  const selectedAmenities = {};
  const selectedStates = {};
  const selectedCities = {};

  // Call fetchPlacesData initially with empty data
  fetchPlacesData();

  // Set up button click event listener
  $('button').click(function () {
    // Make a new POST request to places_search endpoint with the list of selected amenities, states, and cities
    fetchPlacesData({
      amenities: Object.keys(selectedAmenities),
      states: Object.keys(selectedStates),
      cities: Object.keys(selectedCities)
    });
  });

  // Function to update API status
  function updateApiStatus () {
    // Make an AJAX request to get the API status
    $.ajax({
      url: 'http://127.0.0.1:5001/api/v1/status/',
      type: 'GET',
      success: function (response) {
        // Check if the status is "OK"
        if (response.status === 'OK') {
          // If status is "OK", add the class "available" to div#api_status
          $('#api_status').addClass('available');
        } else {
          // If status is not "OK", remove the class "available" from div#api_status
          $('#api_status').removeClass('available');
        }
      },
      error: function (xhr, status, error) {
        $('#api_status').removeClass('available');
        // Log any errors to console
        console.error('Error fetching API status:', error);
      }
    });
  }

  // Call the updateApiStatus function initially
  updateApiStatus();

  // Set an interval to periodically update the API status every 10 seconds (10000 milliseconds)
  setInterval(updateApiStatus, 5000);

  // Function to update the h4 tag inside the div Locations with the list of States or Cities checked
  function updateLocations () {
    $('.locations h4').text(
      Object.values(selectedStates)
        .concat(Object.values(selectedCities))
        .join(', ')
    );
  }

  // Listen for changes on each input checkbox tag for states
  $('.locations h2 input[type="checkbox"]').change(function () {
    const id = $(this).data('id');
    const name = $(this).data('name');

    if ($(this).prop('checked')) {
      selectedStates[id] = name;
      // Select all city checkboxes under the selected state
      $(this)
        .closest('li')
        .find('ul input[type="checkbox"]')
        .prop('checked', true)
        .change();
    } else {
      delete selectedStates[id];
      // Deselect all city checkboxes under the deselected state
      $(this)
        .closest('li')
        .find('ul input[type="checkbox"]')
        .prop('checked', false)
        .change();
    }
    updateLocations();
  });
  // Listen for changes on each input checkbox tag for cities
  $('.locations ul ul input[type="checkbox"]').change(function () {
    const id = $(this).data('id');
    const name = $(this).data('name');

    if ($(this).prop('checked')) {
      selectedCities[id] = name;
    } else {
      delete selectedCities[id];
    }
    updateLocations();
  });

  // Listen for changes on each input checkbox tag
  $('.amenities input[type="checkbox"]').change(function () {
    const amenityId = $(this).data('id'); // Get the Amenity ID from data-id attribute
    const amenityName = $(this).data('name'); // Get the Amenity name from data-name attribute

    // If the checkbox is checked, store the Amenity ID in the variable
    if ($(this).prop('checked')) {
      selectedAmenities[amenityId] = amenityName;
    } else {
      // If the checkbox is unchecked, remove the Amenity ID from the variable
      delete selectedAmenities[amenityId];
    }

    // Update the h4 tag inside the div Amenities with the list of Amenities checked
    $('.amenities h4').text(Object.values(selectedAmenities).join(', '));
  });
});
