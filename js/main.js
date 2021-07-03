$(document).ready(function () {
  var _url = "https://my-json-server.typicode.com/Dwidy99/pwaApi/product";

  var dataResults = "";
  var catResults = "";
  var categories = [];

  function renderData(data) {
    $.each(data, function (key, items) {
      _cat = items.deskripsi;

      dataResults +=
        "<div>" + "<h3>" + items.nama + "</h3>" + "<p>" + _cat + "</p>";
      ("</div>");

      if ($.inArray(_cat, categories) == -1) {
        categories.push(_cat);
        catResults += "<option value='" + _cat + "'>" + _cat + "</option>";
      }
    });

    $("#products").html(dataResults);
    $("#cat_select").html("<option value='all'>Semua</option>" + catResults);
  }

  var networkDataReceived = false;

  // fresh data from online
  var networkUpdate = fetch(_url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      networkDataReceived = true;
      renderData(data);
    });

  // return data from cache
  caches
    .match(_url)
    .then(function (response) {
      if (!response) throw Error("no data on cache");
      return response.json();
    })
    .then(function (data) {
      if (!networkDataReceived) {
        renderData(data);
        console.log("render data from cache");
      }
    })
    .catch(function () {
      return networkUpdate;
    });

  // Funcgsi Filter
  $("#cat_select").on("change", function () {
    updateProduct($(this).val());
  });

  function updateProduct(cat) {
    var dataResults = "";
    var _newUrl = _url;

    if (cat != "all") _newUrl = _url + "?deskripsi=" + cat;

    $.get(_newUrl, function (data) {
      $.each(data, function (key, items) {
        _cat = items.deskripsi;
        dataResults +=
          "<div>" + "<h3>" + items.nama + "</h3>" + "<p>" + _cat + "</p>";
        ("</div>");
      });

      $("#products").html(dataResults);
    });
  }
}); // end document ready jquery

// PWA (register service worker)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register("serviceWorker.js")
      .then((registration) => {
        alert("Service Worker is registered");
        console.log("Service Worker is registered", registration);
      })
      .catch((err) => {
        console.error("Registration failed:", err);
      });
  });
}
