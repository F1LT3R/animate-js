
  /* Animate JS
     Copyright Alistair MacDonald
     License: CC3 */

(function( window ){

  var ease = {
    linear: function (x,t,b,c,d) {
      return c*t/d+b
    }
  };
  
  // Global Variables
  var timelinePlayStack = {}
    , timelineCounter = 0
    , intervalTimer = null
    , framesPerSecond = 24
    ;

  // Add a timeline to the play stack
  function addTimelineToPlayStack (timeline) {
    timelinePlayStack[timelineCounter] = timeline;
    timelineCounter+=1;
  };

  // Remove a timeline from the play stack
  function removeTimelineFromPlayStack (index) {
    delete timelinePlayStack[index];
  };

  // Initialize the global timer
  function initTimer () {
    
    // On every interval...
    function eachInterval () {
      var currentTime = timeNow()
        , index
        ;

      // Increment through the playstack and update the individual timelines
      for (var index in timelinePlayStack) {
        timelinePlayStack[index].time(currentTime);
      }
    }

    // Fire the timer on each interval
    intervalTimer = setInterval(eachInterval, 1000 / framesPerSecond);
  };
  
  // Stop all timelines
  function stopAll () {
    clearInterval(interval);
  };


  function getActorType (actor) {
    // console.log(actor.tagName);
  }

  function timeNow (){
    return (+new Date());
  }

  // Global Namespace "Animate" becomes public interface
  // ...Returns controls to a timeline object

  
  function animate () {
    // var objectsToAnimate = args.length
    //   , i = 0
    //   ;
    
    // Encapsulate Timeline Object
    return (function (args) {


      // Private Timeline Member-Variables
      var objectsToAnimate = args.length
        , i = 0

        , actorStore = []
        , trackStore = []
        , t=0
        , playhead = 0
        , lastPlayhead = timeNow()
        , actorObject
        , framesObject
        , tracksAndFrames
        , frame
        , value
        , track
        , index
        , framesArray
        , valuesArray
        ;

      // Loop through the argument pairs
      for (; i< objectsToAnimate; i+=2) {

        actorObject = args[i];
        actorStore[t] = actorObject;
        
        tracksAndFrames = args[i+1];

        // Shuffle the frames object into an array (optimize for animating later)
        for (track in tracksAndFrames) {

          framesObject = tracksAndFrames[track];
          
          // Associative array (optimization)
          framesArray = [];
          valuesArray = [];

          for (frame in framesObject) {
            framesArray.push(parseFloat(frame));
            valuesArray.push(framesObject[frame]);
          }
          
          trackStore[t] = {};
          trackStore[t][track] = [framesArray, valuesArray];
          t++;
        }

      }

      function update () {
        var value, fromValue, fromFrame, toValue, toFrame
          , frames, values, trackName, lastFrame
          , i=0, j=0, k
          , l=actorStore.length
          , actorObject
          , trackObject
          ;

        for (; i< l; i+=1) {

          actorObject = actorStore[i];
          trackObject = trackStore[i];  

          for (trackName in trackObject) {

            frames = trackObject[trackName][0];
            values = trackObject[trackName][1];

            lastFrame = frames.length;

            fromFrame = frames[0];
            fromValue = values[0];
            toFrame = frames[1];
            toValue = values[1];

            for (j=1, k=lastFrame; j< k; j+=1) {

              if (playhead >= frames[j]) {
                fromFrame = frames[j];
                fromValue = values[j];
                toFrame = frames[j+1];
                toValue = values[j+1];
                if (j===lastFrame-1) {
                  toFrame = fromFrame;
                  toValue = fromValue;
                }
              }
            }

            // console.log(fromFrame, fromValue, toFrame, toValue, playhead);

            value = ease.linear(0, playhead-fromFrame, fromValue, toValue-fromValue, toFrame-fromFrame);

            actorObject.setAttribute(trackName, value);
            // console.log(actorObject.id);
          }
        }
      };

      

      // Timeline Controls
      
      return {
                
        play: function () {
          index = timelineCounter;
          addTimelineToPlayStack(this);
          lastPlayhead = timeNow();
        },

        // Stop the animation        
        pause: function () {
          removeTimelineFromPlayStack(index);
          index = false;
        },

        // 
        time: function (currentTime) {
          if (index !== false) {
            playhead += (currentTime-lastPlayhead)/1000
            update();
            lastPlayhead = currentTime;
          }
        },

        reset: function () {
          playhead = 0;
        },

        // speed: function () {
          
        // },

        onUpdate: function () {

        },

        onEnd: function () {
          
        }

      };
      
    } (arguments));

  }

  // 

  // Expose animate intercace to the window
  
  window.animate = animate;

  // Begin the global timer
  
  initTimer();

})( this );











