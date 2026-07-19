 
   mapboxgl.accessToken = mapToken;
    const map = new mapboxgl.Map({
        
        container: 'map', // container ID
        style: "mapbox://styles/mapbox/streets-v12",
        center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 9 // starting zoom
    });

    const marker = new mapboxgl.Marker({color:"red"})
    .setLngLat(listing.geometry.coordinates) // Listing .geometry.cooredinates
    .setPopup(new mapboxgl.Popup().setHTML(`
      <h5>${listing.title}</h5>
      <p>${listing.location}, ${listing.country}</p>
     `))
    .addTo(map);
