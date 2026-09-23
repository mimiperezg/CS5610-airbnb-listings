function MainModule(listingsID = "#listings") {
  const me = {};


  const listingsElement = document.querySelector(listingsID);
  const sortButton = document.querySelector("#sortPrice");
  // shared list of listings. starts empty, gets filled after loadData(). 
  // later used for sortByPrice()
  let listings = [];

  function getListingCode(listing) {
    const amenities = JSON.parse(listing.amenities);
    // col-4 gives each card a width of 1/3 of the row, h-100 makes the card take full height of the column
    return `<div class="col-4">
  <div class="listing card h-100">
    <img
      src="${listing.picture_url}"
      class="card-img-top"
      alt="Photo of ${listing.name}"
    />
    <div class="card-body d-flex flex-column">
      <h2 class="card-title">${listing.name}</h2>
      <div class="price">
      ${listing.price} / night
      </div>
      <div class="host">
        <img
          src="${listing.host_thumbnail_url}"
          alt="Photo of host ${listing.host_name}"
        />
        Hosted by ${listing.host_name}
      </div>
      <div class="description">
      ${listing.description}
      </div>
      <h3>Amenities</h3>
      <ul>
        ${amenities.slice(0, 10).map((amenity) => `<li>${amenity}</li>`).join("\n")}
      </ul>
      <div class="mt-auto">
      <a href="${listing.listing_url}" target="_blank" class="btn btn-secondary">View on AirBnb</a>
      </div>
    </div>
  </div>
  <!-- /card -->
  </div>

  `;
  }

  function redraw(listings) {
    listingsElement.innerHTML = "";
    // for (let i = 0; i < listings.length; i++) {
    //   listingsElement.innerHTML += getListingCode(listings[i]);
    // }

    // for (let listing of listings) {
    //   console.log("listing", listing );
    //   listingsElement.innerHTML += getListingCode(listing);
    // }

    listingsElement.innerHTML = listings.map(getListingCode).join("\n");
  }

  async function loadData() {
    const res = await fetch("./airbnb_sf_listings_500.json");
    const data = await res.json();

    // keeping the first 50 in the listings list so the sort button can use it
    listings = data.slice(0, 50);
    // draw the listings as cards on the page
    redraw(listings);

    // me.redraw(listings.slice(0, 50));
  }

  function getPrice(listing) {
    // changes "$1,234" to 1234
    return parseFloat(listing.price.replace("$", "").replace(",", ""));
  }

  function sortByPrice() {
    listings.sort((a, b) => getPrice(a) - getPrice(b));
    redraw(listings);
  }

  // when sort button is clicked, call sortByPrice()
  sortButton.addEventListener("click", sortByPrice);

  me.redraw = redraw;
  me.loadData = loadData;
  me.sortByPrice = sortByPrice;

  return me;
}

const main = MainModule();


main.loadData();
