/**
 * FunctionName
 * Arguments: go_here
 * What_it_does
 * Returns things
 */

/**
 * preload (idea from http://stackoverflow.com/questions/476679/preloading-images-with-jquery)
 * Arguments: array of image srcs
 * Loads images into the DOM, but with no display so they don't show or take up space
 */


function preloadImages (arrayOfImages) {
    //nb ("start preloading images......");
    //this.loadAll = function () {}
	$(arrayOfImages).each(function () {
	    
	    $('<img />').attr('src',this).appendTo('body').css('display','none').load(function() {
		//nb("image", this.src, "loaded correctly");
	    });
	    
	});
    //}
}

/**
 * setContainerSize
 * Arguments: container that needs to fit into the viewable area (the width of this container should already be set to fit in window width)
 * Get the window size and make sure container fits, if container doesn't show full height, adjust its width
 */

function setContainerSize (inContainer) {
    //everyElement();
    //var viewportWidth = 900;
    //var viewportHeight = 600;
    var viewportWidth = $(window).width();
    var viewportHeight = $(window).height();
    var containerWidth = $( "#"+inContainer ).outerWidth();
    var containerHeight = $( "#"+inContainer ).outerHeight();
    //nb ("container Width x Height is", containerWidth, "x", containerHeight, "and viewport Width x Height", viewportWidth, viewportHeight);
    //nb ("	original percentage of container height to width", (containerHeight/containerWidth));
    //nb ("	picture bar as percent of height", $( "#pictureBar" ).outerHeight() / containerHeight);
    //nb ("	title as percent of height", $( "#titleText" ).outerHeight(true) / containerHeight);
    //nb ("	sq pic as percent of height", $( "#asquare" ).outerHeight() / containerHeight);
    //nb ("	nav as percent of height", $( "#nav" ).outerHeight(true) / containerHeight);
        
    // need to use Math.round frequently so as to not magnify small differences in the page sizes
    var ratioWeWant = Math.round((containerWidth/viewportWidth) * 100) / 100;
    //nb ("	ratioWeWant is", ratioWeWant);
    
    //var ratioOfHeights = (containerHeight/viewportHeight);
    //nb ("ratioOfHeights is", ratioOfHeights);

    // we know the width fits, so check on the height
    // if it is too tall then use width ratio to create new height, then work back to new width
    if (containerHeight > .96 * viewportHeight) {
	// the bottom of container isn't showing or has no whitespace around it
	
	// find new height that fits, then change the width to bring height into view
	var newContainerHeight = Math.round(ratioWeWant * viewportHeight);
	//nb ("	newContainerHeight", newContainerHeight, "made from rounding", (ratioWeWant * viewportHeight))
	var newContainerWidth = Math.round((containerWidth/containerHeight) * newContainerHeight);
	//nb ("	newContainerWidth", newContainerWidth, "made from rounding", ((containerWidth/containerHeight) * newContainerHeight))
	
	// now get the percentage width
	var newPercentage = Math.round((newContainerWidth/viewportWidth) * 100);
	//nb ("	newPercentage is", newPercentage, "newContainerWidth/viewportWidth", newContainerWidth/viewportWidth);
	$( "#"+inContainer ).outerWidth(newPercentage + "%");
	
	// and now for vertical centering....
	var newTopMargin = ((((viewportHeight - newContainerHeight) / 2) / viewportWidth) * 100).toFixed(2);
	$( "#"+inContainer ).css( "margin-top", newTopMargin + "%" );
    }

}

/**
 * showPage
 * Arguments: the container to fade in
 * Sets the visibility of the page to 100% using fadeTo and adds a class .fadeMe to any divs that are opacity=0 at start
 * (Note: opacity worked whereas visible and display did not)
 */

//NOTES:
//Consider combining with fadeNgo below...

function showPageUsingVisibility (inContainer) {
    //$( "#container" ).fadeTo( "slow", 1, function() {
    //    nb ("container faded to 1 with css visible value", $("#container").css("visibility"));
    //    nb ("and display value", $("#container").css("display"));
    //    nb ("and opacity value", $("#container").css("opacity"));
    //});

    $("div").each(function( i ) {
	var vis = $(this).css("visibility");
	//nb ($(this).attr('id'), "visibility is", vis);
	//nb ("	and display value", $(this).css("display"));
	//nb ("	and opacity value", $(this).css("opacity"));
	if (vis == "hidden") {
	    $(this).addClass("fadeMe");
	    //nb("	added class fadeMe");
	    $(this).fadeIn ("slow", function () {
		//nb ($(this).attr('id'), "NOW visibility is", $(this).css("visibility"));
		//nb ("	and display value", $(this).css("display"));
		//nb ("	and opacity value", $(this).css("opacity"));
	    });
	}
    });
     
}

function showPage (inContainer) {
    $( "#"+inContainer ).css("visibility", "visible");
    
    $( "div .fadeMe" ).fadeTo( "slow", 1, function () {
	//nb ($(this).attr('id'), "div faded IN with css opacity value", $(this).css("opacity"));
        //alert ($(this).attr('id')+ " div faded IN with css opacity value "+ $(this).css("opacity"));
    });
}


/**
 * fadeNgo
 * Arguments: src of page to go to on click
 * Fades out divs of current page that have an opacity setting in css and loads the next page
 */

function fadeNgo (inSrc) {    

    $( "div .fadeMe" ).fadeTo( "slow", 0, function () {
        //nb ($(this).attr('id'), "div faded out with css opacity value", $(this).css("opacity"));
        //alert ($(this).attr('id')+ " div faded out with css opacity value "+ $(this).css("opacity"));
    });
    
    window.location.href = inSrc;

}



/**
 * keyEventHandler
 * Arguments: event passes from jQuery .keydown handler
 * Find out which key was pressed and set action if any
 */

function keyEventHandler (event) {
    
    var theKey = event.which;
    //nb ( "key event", theKey );
    
    switch (theKey) {
	case 37:	// left arrow
	    //nb ("left arrow");
	    return (-1);
	    break;
	case 39:	// right arrow
	    //nb ("right arrow");
	    return (1);
	    break;
    }
    return (0);
    
}

/**
 * setDivHeight
 * Arguments: a div id or class, percentage of its width to set to its height
 * Sets the height of the div based on its width
 */

function setDivHeight (inDiv, inPercentage) {	
	var divWidth;
	
        divWidth = $( inDiv ).width();
        //nb ("div", inDiv, "width is", divWidth);
        inPercentage = inPercentage * .01;
        $( inDiv ).height(inPercentage * divWidth);
	
}


/**
 * nb
 * Arguments: a comma separated list of as many arguments as you want to see in the console log
 * Prints a space separated list of arguments to the console
 */

function nb () {
    if (typeof console == "object" && console.log) {
        var args = Array.prototype.slice.call(arguments);   // arguments is not a real array, make it one
        console.log (args.join(" "));
    }
}


/**
 * nbObject
 * Arguments: an object
 * Prints key:value pairs to console log
 */

function nbObject (inObj) {
    if (typeof console == "object" && console.log) {
	$.each(inObj, function( objectKey, objectValue ) {
	    console.log ( "Key: " + objectKey + ", Value: " + objectValue );
	});
    }
}


/**
 * everyElement
 * Prints size of every element to console log
 */

function everyElement (){
    $("*").each(function( i ) {
	var w = $(this).outerWidth(true);
	var h = $(this).outerHeight(true);
	nb ($(this).attr("id") || $(this).prop("tagName"), "width x height is", w.toFixed(2), "x", h.toFixed(2));
	$(this).css( "border", "thin solid red" );
    });
}