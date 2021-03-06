
//variables globales
var parameters = { 'id': 0 };
var jsonsites;
var thisasadas;
var map;
var provincia = 0;
var canton = 0;
var distrito = 0;
var thisid = 0;
var thistipo = 'IRSSAS';
var thisnombre = 'índice de Riesgo Sostenible en el Servicio de Agua y Saneamiento';
var filtroAsadas = false;

// array de colores
var colores = ['rgba(234, 77, 70, 0.7)', 'rgba(232, 215, 75, 0.7)', 'rgba(72, 118, 90, 0.7)', 'rgba(22, 155, 220, 0.7)', 'rgba(22, 87, 205, 0.7)'];
var colores2 = ['rgba(156, 26, 18, 1)', 'rgba(130, 118, 17, 1)', 'rgba(35, 58, 45, 1)', 'rgba(10, 66, 92, 1)', 'rgba(9, 32, 74, 1)'];


// array de Styles de OL
var styles = [new ol.style.Style({
  fill: new ol.style.Fill({
    color: 'rgba(255, 255, 255, 0.0)'
  }),
  stroke: new ol.style.Stroke({
    color: 'rgba(255, 255, 255, 0.0)'

  })
}), new ol.style.Style({
  fill: new ol.style.Fill({
    color: 'rgba(254, 0, 2, 0.7)'
  }),
  stroke: new ol.style.Stroke({
    color: 'rgba(254, 0, 2, 0.7)'

  })
})];
//en proceso


var style1 = [
  new ol.style.Style({
    image: new ol.style.Icon(({
      scale: 0.4,
      rotateWithView: false,
      anchor: [0.5, 1],
      anchorXUnits: 'fraction',
      anchorYUnits: 'fraction',
      opacity: 1,
      src: '/images/mark.png'
    })),
    zIndex: 5
  })/*,
  new ol.style.Style({
      image: new ol.style.Circle({
          radius: 4,
          fill: new ol.style.Fill({
              color: 'rgba(255,255,255,0.5)'
          }),
          stroke: new ol.style.Stroke({
              color: 'rgba(0,0,0,1)'
          })
      })
  })*/
];
// Función toma codigo de distrito y busca en jsonsites si existe riesgo en el, de no ser asi lo pinta transparente
var styleFunction = function (feature) {
  var id = parseInt(feature.get('CODIGO'));
  var index = jsonsites.sitios.indexOf(id);

  if (index == -1)
    return styles[0];
  else
    return new ol.style.Style({
      fill: new ol.style.Fill({
        color: colores[jsonsites.valores[index]]
      }),
      stroke: new ol.style.Stroke({
        color: colores[jsonsites.valores[index]]

      })
    });
};

// Array de capas por defecto, capas OSM y urbano 5000
var layers = [
  new ol.layer.Tile({
    source: new ol.source.OSM()
  }),
  new ol.layer.Tile({
    source: new ol.source.TileWMS({
      url: 'http://geos.snitcr.go.cr/be/IGN_5/wms?',
      params: { 'LAYERS': 'urbano_5000', 'TILED': true },
      serverType: 'geoserver',
      transition: 0,
      crossOrigin: 'anonymous'
    })
  })
]

// funcion jquery para obtener datos de riesgo de asadas
var parameters = { "tipo": "1", "provincia": provincia, "canton": canton, "distrito": distrito };
$.get('/getSites', parameters, function (data) {
  jsonsites = data.jsonsites1;
}).done(function (res) {

  // Carga capa de distritos, llama a función stylefunction
  layers.push(new ol.layer.Vector({
    source: new ol.source.Vector({
      url: 'geojson/District.geojson',
      format: new ol.format.GeoJSON()
    }),
    style: styleFunction
  }))

  // Carga capas de distritos y provincial para sobreponerlas
  layers.push(new ol.layer.Tile({
    source: new ol.source.TileWMS({
      url: 'http://geos.snitcr.go.cr/be/IGN_5/wms?',
      params: { 'LAYERS': 'limitedistrital_5k', 'TILED': true },
      serverType: 'geoserver',
      transition: 0,
      crossOrigin: 'anonymous'
    })
  }))

  layers.push(new ol.layer.Tile({
    source: new ol.source.TileWMS({
      url: 'http://geos.snitcr.go.cr/be/IGN_5/wms?',
      params: { 'LAYERS': 'limitecantonal_5k', 'TILED': true },
      serverType: 'geoserver',
      transition: 0,
      crossOrigin: 'anonymous'
    })
  }))

  layers.push(new ol.layer.Tile({
    source: new ol.source.TileWMS({
      url: 'http://geos.snitcr.go.cr/be/IGN_5/wms?',
      params: { 'LAYERS': 'limiteprovincial_5k', 'TILED': true },
      serverType: 'geoserver',
      transition: 0,
      crossOrigin: 'anonymous'
    })
  }))


  puntos = [];
  var x;
  for (var i = 0; i < jsonsites.asadas.length; i++) {
    x = getTipoRiesgo(jsonsites.asadas[i].valor);

    puntos.push(new ol.Feature({
      type: 'click',
      geometry: new ol.geom.Point(ol.proj.fromLonLat([parseFloat(jsonsites.asadas[i].Latitud), parseFloat(jsonsites.asadas[i].Longitud)])),
      name: jsonsites.asadas[i].Nombre,
      riesgo:jsonsites.asadas[i].valor.toFixed(0),
      poblacion: jsonsites.asadas[i].poblacion,
      color: (["Muy Alto", "Alto", "Medio", "Bajo", "Muy bajo"])[x]
    }));
    puntos[i].setStyle(style1);
  }

  var vectorSource = new ol.source.Vector({
    features: puntos
  });
  var vectorLayer = new ol.layer.Vector({
    source: vectorSource
  });

  layers.push(vectorLayer);

  var container = document.getElementById('popup');
  var content = document.getElementById('popup-content');
  var closer = document.getElementById('popup-closer');


  var overlay = new ol.Overlay({
    element: container,
    autoPan: true,
    autoPanAnimation: {
      duration: 250
    }
  });

  closer.onclick = function () {
    overlay.setPosition(undefined);
    closer.blur();
    return false;
  };


  var long = -84.097118;
  var lat = 9.934691;
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      long = position.coords.longitude;
      lat = position.coords.latitude;
    });
  }

  map = new ol.Map({
    target: 'map',
    overlays: [overlay],
    layers: layers,
    view: new ol.View({
      center: ol.proj.fromLonLat([long, lat]),
      zoom: 8
    })
  });

  map.on('click', function (evt) {
    var f = map.forEachFeatureAtPixel(
      evt.pixel,
      function (ft, layer) { return ft; }
    );
    if (f && f.get('type') == 'click') {
      var geometry = f.getGeometry();
      var coord = geometry.getCoordinates();
      content.innerHTML = '<p><b>' + f.get("name") + '</b></p><p><b>Población: </b> ' + f.get("poblacion") + ' <b>Riesgo: </b>' + f.get("riesgo") + '%<br><b>Nivel de Riesgo: </b>' + f.get("color") + ' </p>';
      overlay.setPosition(coord);
    }
  });

// See: https://github.com/bubkoo/html-to-image#options
var exportOptions = {
  filter: function(element) {
    return element.className ? element.className.indexOf('ol-control') === -1 : true;
  }
};

document.getElementById('export-png').addEventListener('click', function() {
  map.once('rendercomplete', function() {
    domtoimage.toPng(map.getTargetElement(), exportOptions)
      .then(function(dataURL) {
        $("#img-map-tec")[0].hidden = false
        $("#img-map-tec").css("width", map.getSize()[0])
        $("#img-map-tec").css("height", map.getSize()[1])
        $("#map-png").css("width", map.getSize()[0])
        $("#map-png").css("height", map.getSize()[1])

        $("#img-map-tec").css("background-image", `url(${dataURL})`)
        $("#map-png")[0].src = "/images/tec.png"
        html2canvas(document.querySelector("#img-map-tec")).then(canvas =>
        {
          $("#img-map-tec")[0].hidden = true
          var link = document.getElementById('image-download');
          link.href = canvas.toDataURL("image/png");
          link.click()
        });
      });
  });
  map.renderSync();
});

});

function checkear(id) {
  var x = parseInt(id.split("-")[1]);
  var k = $('#filts-' + x).attr('class').split("-")[1];
  $('#filts-' + x).toggleClass("glyphicon-ok glyphicon-remove");
  if (k == "ok") {
    map.removeLayer(layers[x]);
    filtroAsadas = (x == 6 ? !filtroAsadas : filtroAsadas);
  } else {
    map.getLayers().insertAt(x, layers[x]);
  }
}

function loadPoints(points) {
  map.removeLayer(layers[6]);
  puntos = [];
  for (var i = 0; i < points.asadas.length; i++) {
    if (thisasadas == undefined || busquedaAsada(points.asadas[i], thisasadas.asadas)) {
      x = getTipoRiesgo(jsonsites.asadas[i].valor);

      puntos.push(new ol.Feature({
        type: 'click',
        geometry: new ol.geom.Point(ol.proj.fromLonLat([parseFloat(points.asadas[i].Latitud), parseFloat(points.asadas[i].Longitud)])),
        name: points.asadas[i].Nombre,
        id: points.asadas[i].Asada_ID,
        riesgo: points.asadas[i].valor,
        poblacion: points.asadas[i].Poblacion,
        color: (["Muy Alto", "Alto", "Medio", "Bajo", "Muy bajo"])[x]
      }));
      puntos[puntos.length - 1].setStyle(style1);
    }
  }

  var vectorSource = new ol.source.Vector({
    features: puntos
  });
  var vectorLayer = new ol.layer.Vector({
    source: vectorSource
  });
  layers[6] = vectorLayer;
  map.addLayer(layers[6]);
}

function changeComp() {
  layers[2].setStyle(null);
  var parameters = { "id": thisid, "tipo": thistipo, "provincia": provincia, "canton": canton, "distrito": distrito };
  $.get('/getComponente', parameters, function (data) {
    jsonsites = data;
    if (!filtroAsadas) loadPoints(jsonsites);
  }).done(function (res) {
    layers[2].setStyle(styleFunction);
    if (thistipo == "SubComponente") {
      var z = document.getElementById(thisnombre).parentNode.parentNode.parentNode.firstChild.innerHTML;
      $("#mycomponent").html(z + " - " + thisnombre);
    }
    else {
      $("#mycomponent").html(thisnombre);
    }

  });
};

function changeComponent(tipo, id, nombre) {
  thisid = id;
  thistipo = tipo;
  thisnombre = nombre;
  changeComp();
};

function filtrarMap() {
  provincia = document.getElementById("prov").value;
  canton = document.getElementById("cant").value;
  var selectDist = document.getElementById("dist")[document.getElementById("dist").selectedIndex].attributes["dist"]
  distrito = selectDist ? selectDist.value : 0;
  changeComp();
  var parameters = { "tipo": "1", "provincia": provincia, "canton": canton, "distrito": distrito };
  $.get('/getSites', parameters, function (data) {
    thisasadas = data.jsonsites1;
  }).done(function (res) {
    loadPoints(thisasadas);
  });

};

function busquedaAsada(asada, asadas) {
  if (asadas.length == 0) {
    return false;
  }
  else if (asada.Asada_ID == asadas[Math.trunc(asadas.length / 2)].Asada_ID) {
    return true;
  }
  else if (asada.Asada_ID < asadas[Math.trunc(asadas.length / 2)].Asada_ID) {
    return true && busquedaAsada(asada, asadas.slice(0, Math.trunc(asadas.length / 2)))
  }
  else {
    return true && busquedaAsada(asada, asadas.slice(Math.trunc(asadas.length / 2) + 1))
  }
}

function getTipoRiesgo(valor) {

  if (valor < 47.0) {
    return 4
  }
  else if (valor < 57.0) {
    return 3
  }
  else if (valor < 67.0) {
    return 2
  }
  else if (valor < 77.0) {
    return 1
  }
  else {
    return 0
  }
}

function downloadMap() {
  var dataUrl = document.getElementById('map').toDataURL(); //attempt to save base64 string to server using this var  
  var windowContent = '<!DOCTYPE html>';
  windowContent += '<html>'
  windowContent += '<head><title>Print canvas</title></head>';
  windowContent += '<body>'
  windowContent += '<img src="' + dataUrl + '">';
  windowContent += '</body>';
  windowContent += '</html>';
  var printWin = window.open('', '', 'width=340,height=260');
  printWin.document.open();
  printWin.document.write(windowContent);
  printWin.document.close();
  printWin.focus();
  printWin.print();
  printWin.close();
}