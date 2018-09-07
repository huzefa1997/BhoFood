$('#dish-search').on('input', function() {
  var search = $(this).serialize();
  if(search === "search=") {
    search = "all"
  }
  $.get('/menu?' + search, function(data) {
    $('#menu-grid').html('');
    data.forEach(function(dish) {
      $('#dish-grid').append(`
        <div class="col-md-3 col-sm-6">
          <div class="thumbnail">
            <img src="${ dish.image }">
            <div class="caption">
              <h4>${ dish.name }</h4>
            </div>
            <p>
              <a href="/campgrounds/${ dish._id }" class="btn btn-primary">More Info</a>
            </p>
          </div>
        </div>
      `);
    });
  });
});

$('#dish-search').submit(function(event) {
  event.preventDefault();
});