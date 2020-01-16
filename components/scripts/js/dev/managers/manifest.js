X.registerModule("managers/manifest", function() {

	// Change this to elongate the loading timeout. 
  var LOAD_TIMEOUT = 60000; // 1 minute

  var composition = Object.keys(AdobeAn.compositions)[0];
  var library = AdobeAn.getComposition(composition).getLibrary();
  var manifest = library.properties.manifest;

	// Increase load timeout for each atlas
  manifest.forEach(function(item) {
    item.loadTimeout = LOAD_TIMEOUT;
  });
});
