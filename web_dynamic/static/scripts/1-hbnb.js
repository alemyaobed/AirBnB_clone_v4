// Execute the script when DOM is loaded
$(document).ready(function () {
  // Initialize an empty object to store Amenity IDs
  const selectedAmenities = {};

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
