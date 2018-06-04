function initialize () {
}

function sendRequest(callBackFunction, methodName, parameter) {
    var xhr = new XMLHttpRequest();
	var query = encodeURI(parameter);
	xhr.open("GET", "proxy.php?method=" + methodName + query);
	xhr.setRequestHeader("Accept","application/json");
	xhr.onreadystatechange = function () {
       if (this.readyState == 4) {
          var json = JSON.parse(this.responseText);
		  callBackFunction(json);
       }
	};
   xhr.send(null);
}

function showDetailInfo(movieId)
{
	sendRequest(displayDetails,"/3/movie/"+movieId, "");
}

function displaySearchResults(json)
{
			var noOfPages = parseInt(json.total_pages);
			var pageStr="<ul><li class='bold'>Pages : </li>";
			var pageChangeQuery = "sendRequest(displaySearchResults,'/3/search/movie','&query='+document.getElementById('form-input').value+'&page=";
			for(var i=1; i<=noOfPages; i++) {
				pageStr = pageStr + '<li> <label onclick="' + pageChangeQuery + i + '\')">' + i + ' </label></li>';
			}
			pageStr = pageStr + "</ul>";		 	  
			document.getElementById("pages").innerHTML = pageStr ;	
			  
			var output = "<ul> ";
			for (var i=0; i<json.results.length; i++) {
			  output = output + "<li> <label onclick='showDetailInfo(\"" + json.results[i].id + "\")'>" + json.results[i].title + " (" + json.results[i].release_date.substring(0,4) + ")" + " </label></li>";
			}
			output = output + " </ul>";		  

			document.getElementById("output").innerHTML = output;
}

function displayDetails(json)
{
		var detailInfoHtml = "<H2>"+json.title+"</H2>";
		
		detailInfoHtml = detailInfoHtml + "<img src='http://image.tmdb.org/t/p/w500" + json.poster_path + "'>";
		
		detailInfoHtml = detailInfoHtml + "<span class='bold'>Summary : </span><br/><p align='justify'>"+json.overview+"</p><br/><br/>";
		
		detailInfoHtml = detailInfoHtml + "<span class='bold'>Genres : </span><br/><p align='justify'>"
		for (i in json.genres) {
			if(i==0)
				detailInfoHtml = detailInfoHtml + json.genres[i].name;
			else
				detailInfoHtml = detailInfoHtml + ", " + json.genres[i].name;
		}	
		detailInfoHtml = detailInfoHtml + "</p><br/><br/>";				
		
		detailInfoHtml = detailInfoHtml + "<span class='bold'>Release Date : </span><br/><p align='justify'>"+json.release_date+"</p><br/><br/>";		
				
		document.getElementById("movieDetails").innerHTML = detailInfoHtml; //"<pre>" + detailInfoHtml + "</pre>";	
		
		sendRequest(displayCast, "/3/movie/"+json.id+"/credits", "");			
}

function displayCast(json)
{
	var detailInfoHtml = "<h3>Cast:</h3><table>";
	
		for (i in json.cast) {
			if(json.cast[i].character)							
				detailInfoHtml = detailInfoHtml + "<tr><td rowspan='2'>" + "<img src='http://image.tmdb.org/t/p/w500" + json.cast[i].profile_path + "'></td><td>" + json.cast[i].name + "</td></tr><tr><td>" + json.cast[i].character +"</td></tr>";			
			//Comment below 2 lines to display all cast
			if(i==4)
				break;
		}	
		
		detailInfoHtml = detailInfoHtml +"</table>";
		
	document.getElementById("movieCast").innerHTML = detailInfoHtml;
}
