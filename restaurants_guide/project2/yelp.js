var map;
var markers = new Array(10);		

function initialize()
{
	document.getElementById("output").style.width = (screen.width-650) + "px";	
	map = new google.maps.Map(document.getElementById('map'), {
	  center: {lat: 32.75, lng: -97.13},
	  zoom: 16
	});	
}

function sendRequest () {
   var query = document.getElementById("search").value;
   if(query)
	{
	   var queryStr = encodeURI(query);
	   var bounds = map.getBounds();
	   var boundStr = bounds.getSouthWest().lat()+","+bounds.getSouthWest().lng()+"|"+bounds.getNorthEast().lat()+","+bounds.getNorthEast().lng();
	   var xhr = new XMLHttpRequest();
	   xhr.open("GET", "proxy.php?term=" + queryStr + "&bounds=" + boundStr + "&limit=10");
	   xhr.setRequestHeader("Accept","application/json");
	   xhr.onreadystatechange = function () {
			if (this.readyState == 4) {				
				var json = JSON.parse(this.responseText);	
				displayResult(json);
			}
	   };
	   xhr.send(null);
	}
}

function displayResult(json)
{
	clearMarkers();
	var max = json.businesses.length<10 ? json.businesses.length : 10;
	var resulthtml = "";
	for (var i=0; i<max; i++) {
		if(json.businesses[i]) {
			resulthtml = resulthtml + "<div class='item'>";
			resulthtml = resulthtml + "<img class='main_image' src='" + json.businesses[i].image_url + "'>";
			resulthtml = resulthtml + "<label class='itemheader' onclick='window.location.href=\"" + json.businesses[i].url + "\"'>" + (i+1) + ". " + json.businesses[i].name + "</label>";
			resulthtml = resulthtml + "<img class='rating_image' src='" + json.businesses[i].rating_img_url + "'>";
			resulthtml = resulthtml + "<br/><p class='itemtext'>" + json.businesses[i].snippet_text + "</p>";
			resulthtml = resulthtml + "</div>";
			addMarker(i, json.businesses[i].location.coordinate.latitude, json.businesses[i].location.coordinate.longitude);
		}
	}
	resulthtml = resulthtml + "";
	document.getElementById("output").innerHTML = resulthtml;	
}

function addMarker(index, latitude, longitude)
{
	if(latitude && longitude)
	{
		markers[index] = new google.maps.Marker({
			map: map,
			label: (index+1).toString(),
			position: {lat: latitude, lng: longitude}
		});
	}
}

function clearMarkers()
{
	for(var i=0; i<markers.length; i++)
	{
		if(markers[i]!=null)
		{
			markers[i].setMap(null);
			markers[i]=null;
		}
	}
}