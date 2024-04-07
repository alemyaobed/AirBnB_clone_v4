// Execute the script when DOM is loaded
$(document).ready(function () {
  // Initialize an empty object to store Amenity IDs
  const selectedAmenities = {};

  // Function to update API status
  function updateApiStatus () {
    // Make an AJAX request to get the API status
    $.ajax({
      url: 'http://0.0.0.0:5001/api/v1/status/',
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

  // Listen for changes on each input checkbox tag
  $('input[type="checkbox"]').change(function () {
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
