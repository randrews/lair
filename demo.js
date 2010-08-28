// You can specify the locations of tiles with arrays...
var wallArray = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
		 -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
		 -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
		 -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
		 -1, -1, -1, -1, -1, -1,  3,  3,  3,  3,  3,  3,  3,  3, -1, -1, -1, -1, -1, -1,
		 -1, -1, -1, -1, -1, -1,  3, -1, -1, -1, -1, -1, -1,  3, -1, -1, -1, -1, -1, -1,
		 -1, -1, -1, -1, -1, -1,  3, -1, -1, -1, -1, -1, -1,  3, -1, -1, -1, -1, -1, -1,
		 -1, -1, -1, -1, -1, -1,  3, -1, -1, -1, -1, -1, -1,  3, -1, -1, -1, -1, -1, -1,
		 -1, -1, -1, -1, -1, -1,  3, -1, -1, -1, -1, -1, -1,  3, -1, -1, -1, -1, -1, -1,
		 -1, -1, -1, -1, -1, -1,  3, -1, -1, -1, -1, -1, -1,  3, -1, -1, -1, -1, -1, -1,
		 -1, -1, -1, -1, -1, -1,  3,  3,  3,  3,  3,  3,  3,  3, -1, -1, -1, -1, -1, -1,
		 -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];

// With a hash of coordinates...
var crateLocations = {};
crateLocations[3+2*20] = true;
crateLocations[10+6*20] = true;
crateLocations[11+7*20] = true;
crateLocations[16+8*20] = true;
crateLocations[17+8*20] = true;

// And a function...
function crateMap(x,y){
    if(crateLocations[x+y*20]){
	return 0;
    } else {
	return null;
    }
}

$(document).ready(function(){
	// Create a new map, put it in #map
	map = new Lair.Map({id:"map"});

	// A background image
	background = map.add(new Lair.Background({image:"floor.png",x:0}));

	// Tile layer with all the same tile
	floor = map.add(new Lair.Tiles({size:32, image:"tiles.png", data:1}));

	// Tile layer reading from an array, good for walls or whatever
	walls = map.add(new Lair.Tiles({size:32, image:"tiles.png", data:wallArray}));

	// Tile layer with a function reading from a hash, good for powerups
	crates = map.add(new Lair.Tiles({size:32, image:"tiles.png", data:crateMap}));

	// Draw the map
	map.draw();
    });
