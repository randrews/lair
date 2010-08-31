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
var targetLocations = {};
targetLocations[3+2*20] = true;
targetLocations[10+6*20] = true;
targetLocations[11+7*20] = true;
targetLocations[16+8*20] = true;
targetLocations[17+8*20] = true;

// And a function...
function targetMap(x,y){
    if(targetLocations[x+y*20]){
	return 2;
    } else {
	return null;
    }
}

$(document).ready(function(){
	// Create a new map, put it in #map
	map = new Lair.Map().id("map");

	// A background image
	background = map.add(new Lair.Background({image:"floor.png",x:0}));

	// Tile layer with all the same tile
	floor = map.add(new Lair.Tiles({size:32, image:"tiles.png", data:1}));

	// Tile layer reading from an array, good for walls or whatever
	walls = map.add(new Lair.Tiles({size:32, image:"tiles.png", data:wallArray}));

	// Tile layer with a function reading from a hash, good for powerups
	targets = map.add(new Lair.Tiles({size:32, image:"tiles.png", data:targetMap}));

	// A moving piece
	// crate = map.add(new Lair.Piece({size:32, image:"tiles.png", tile:0}));

	// Draw the map
	map.draw();
    });
