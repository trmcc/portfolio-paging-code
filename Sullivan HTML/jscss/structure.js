/**
 * structure
 * This file holds the routines that build and search the objects that hold text and pic src info
 * for the portfolio. An object has a name of title, it holds text descriptions, each one of those
 * holds as many srcs as apply to the description.
 */

/**
 * StoreBlurbs
 * Arguments: the text for this series of pictures
 * Stores an array of picture file names
 * Returns the 'next' picture to show based on arrow direction or a flag to tell calling object we are at an endpoint of the array
 */

function StoreBlurbs (inText) {
      
      this.name = inText;
      this.picsArray = [];
      
      var nPic = 0;
      
      this.loadPicArray = function (inPic) {    // name of picture source
            this.picsArray.push(inPic);
            // ?? do I want to return anything, length perhaps
      }

      this.getPic = function (inCount) {  // 0 means this is a new description, so move array to begin or end based on arrow direction    // 0 keeps array pointer nPic at its last value for the current object
            var tempCount = nPic + inCount;
            if (tempCount < 0) {    // move to prev description
                  // nb ("getPic: need to move to prev description");
                  return (-1);
            } else if (tempCount >= this.picsArray.length) {      // move to next description
                  // nb ("getPic: need to move to next description");
                  return (1);
            } else {    // all is well, update counter and return pic name
                  nPic = tempCount;
                  //nb ("from getPic this.picsArray[" + nPic + "]", this.picsArray[nPic]);
                  return (this.picsArray[nPic]);
            }
      }
      
      this.resetPicNum = function (beginning) {
            if (beginning) {    // set array pointer to beginning of array
                  nPic = 0;
            } else {    // set array pointer nPic to end of array
                  nPic = this.picsArray.length-1;
            }
            //nb ("nPic reset to ", nPic, " for object ", this.name);
      }
}

/**
 * InitProject
 * Arguments: title of this project
 * Finds the blurb and picture src based on the arrow direction and whether they should fade or not
 * (if top level fades, then all lower levels fade...)
 */

function InitProject (inName) {
      // creates an object that has an array of description objects
      // the description object has a name and an array of pictures
      // the calling fn maintains the list of titles or projects

      this.name = inName;

      var pgElementsToShow = {};
      var descrObjects = [];
      var nDescr = 0;
      var arrowDirection = 0; // -1 for left, 1 for right, 0 no change (last pointer location)
      //nb ("getNextInfo: arrowDirection initial value", arrowDirection);
      
      this.addDescription = function (inBlurb) {
            // creates array of description objects
            var currentDescr;
            currentDescr = new StoreBlurbs (inBlurb);
            descrObjects.push(currentDescr);
      }
      
      this.addPic = function (inPic) {
            // adds pictures to array of last created object
            var lastObject = descrObjects[descrObjects.length-1];
            lastObject.loadPicArray(inPic);
            /*$('<img />').attr('src',inPic).appendTo('body').css('display','none'); */     // preload images
            //nb ("object ", lastObject.name, " has a picture array ", lastObject.picsArray);
      }
      
      this.initializeShowStructure = function () {
            pgElementsToShow.blurb = "";
            pgElementsToShow.blurbFade = 0;
            pgElementsToShow.picSrc = "";
      }
      
      this.allPics = function () {
            // return all the pictures that were loaded under each blurb place into a single array
            var returnArray = []
            for (var i=0; i < descrObjects.length; i++) {
                  returnArray = returnArray.concat(descrObjects[i].picsArray);
            }
            //nb ("returning all pics", returnArray);
            return (returnArray);
      }

      this.getNextInfo = function (beginOrEnd) {
            // finds the actual description and the picture path, handles skipping to next blurb if pics hit endpoint
            var lastElem = descrObjects.length - 1;
            var currentObject = descrObjects[nDescr];
            if (beginOrEnd == -1) {    // set pic counter to last elem in new object's pic array
                  currentObject.resetPicNum(0);
            } else if (beginOrEnd == 1) {      // set pic counter to first elem in new object's pic array
                  currentObject.resetPicNum(1);
            }
            var nextPic = currentObject.getPic(arrowDirection);
            //nb ("getNextInfo: with arrowDirection", arrowDirection);
            
            if (nextPic == -1 || nextPic == 1) {    // move to prev/next description
                  arrowDirection = 0;     // don't move the pic array pointer
                  pgElementsToShow.blurbFade = 1;     // set description to fade
                  //nb ("getNextInfo: arrowDirection reset to", arrowDirection);
                  nDescr = nDescr + nextPic;
                  if (nDescr < 0) {    // wrap around to last description
                        nDescr = lastElem;
                        // also set pic counter to last elem in new object's pic array
                  } else if (nDescr > lastElem) {      // wrap around to first description
                        nDescr = 0;
                        // also set pic counter to first elem in new object's pic array
                  }
 
                  this.getNextInfo(nextPic);    // call it again to get next object, let that next obj know we've hit an endpoint

            } else {    // all is well, return blurb, fade info, and pic name
                  //nb ("getNextInfo: return values", currentObject.name, nextPic);
                  
                  pgElementsToShow.blurb = currentObject.name;
                  pgElementsToShow.picSrc = nextPic;
            }
      }
      
      this.arrowPress = function (inArrow, descContainer, picContainer) {
            // traverse structure to find text and pics
            arrowDirection = inArrow;
            
            // clear out the object that holds the final values
            this.initializeShowStructure();
            //nbObject (pgElementsToShow);

            // get all the next text and pics
            //nb ("nDescr is", nDescr, "with arrowDirection", arrowDirection);
            this.getNextInfo(0);
            //nbObject (pgElementsToShow);
            
            // fade picture always, then fade blurb if needed
            //$("#projTitle h1").text("Hello World");
            //$("#projTextParagraph").text(pgElementsToShow.blurb);

            $( "#"+picContainer ).fadeOut( "slow", function() {
                  //nb ("***Faded the picture, now reset pic and fade in");
                  $( "#"+picContainer+" img" ).attr("src", pgElementsToShow.picSrc);
                  $( "#"+picContainer ).fadeIn( "slow", function() {
                        //nb ("***Animation Complete");
                  });
            });

            if (pgElementsToShow.blurbFade) {
                  $( "#"+descContainer ).fadeOut( "slow", function() {
                        //nb ("**Faded, now reset text and fade in");
                        //$( "#"+descContainer+" p:first" ).next().text(pgElementsToShow.blurb);
                        $( "#"+descContainer+" p:first" ).text(pgElementsToShow.blurb);
                        $( "#"+descContainer ).fadeIn( "slow", function() {
                              //nb ("**Animation Complete");
                        });
                  });
            }
            
      }    
}
