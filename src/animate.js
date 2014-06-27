  /* Animate JS
     Copyright Alistair MacDonald
     License: CC3 */
(function( window ){

  'use strict';

  // Main Interface for Creating Animation Timelines
  function animate () {
    
    // var args = arguments;

    // if (args.length){
      return Timeline(arguments);
    // }

    // return globalTransportControl;
  }

  // Easing
  //////////////////////////////////////////////////////////////////////////////
  var ease = {
    linear: function (x, t, b, c, d) {
      return c*t/d + b;
    }
  };

  function set (obj, prop, val) {
    console.log(obj, prop, val);
  }

  var timelinePlayStack = {}
    , timelineCounter = 0
    , interval = null  
    , fps = 24
    ;

  // Add a nre timeline to the stakc and return it to the user

  function addTimelineToPlayStack (timeline) {
    timelinePlayStack[timelineCounter] = timeline;
    timelineCounter+=1;
  };

  function removeTimelineFromPlayStack (index) {
    delete timelinePlayStack[index];
  };

  // Global Animation Controls (all timelines run from the same timer) //
    
  // Plays all timelines from their current positions
  function playAll () {
        
    // start = time();
    
    function onInterval () {
      for (var index in timelinePlayStack) {
        var timeline = timelinePlayStack[index];
        timeline.time( timeNow() );
      }
    }

    interval = setInterval(onInterval, 1000 / fps);

  };
  
  // Stop all timelines in their tracks
  // 
  function stopAll () {
    
    clearInterval(interval);

  };





  function getActorType (actor) {
    // console.log(actor.tagName);
  }

  function timeNow (){
    return (+new Date());
  }



  // Timeline Object
  function Timeline (args) {

    var objectsToAnimate = args.length
      , i = 0
      ;

    // Encapsulate Timeline Object
    return (function () {

      // Define Timeline Object Globals
      var actors = []
        , frames = []
        , playhead = 0
        , lastMS = timeNow()
        , framesPerSecond = 4
        , index
        ;

      // Loop through the argument pairs
      for (; i< objectsToAnimate; i+=2) {

        // Add the Actor object and the Timeline Frames to the timeline object
        var actorObject = args[i]
          // , actorType = getActorType( actorObject )
          , tracksAndFrames = args[i+1]
          , tracksToAnimate
          , framesObject
          , frame
          , value
          , track
          ;


        // Shuffle the frames object into an array (optimize for animating later)
        for (track in tracksAndFrames) {
          framesObject = tracksAndFrames[track];
          
          // Associative array (optimization)
          var framesArray = []
            , valuesArray = []
            ;

          for (frame in framesObject) {
            framesArray.push(frame);
            valuesArray.push(framesObject[frame]);
          }
          
          tracksAndFrames[track] = [framesArray, valuesArray];
        }

      }

      function update () {

        // var relativeTime = (ms-startTime)/1000
        var relativeTime = playhead
          , fromValue, fromFrame , toValue, toFrame
          , frames, values, track, trackName
          , i, l
          ;

        for (trackName in tracksAndFrames) {
          track = tracksAndFrames[trackName];
          frames = track[0];
          values = track[1];
        
          fromFrame = frames[0];
          fromValue = values[0];
          toFrame = frames[1];
          toValue = values[1];

        for (i=1, l=frames.length; i< l; i+=1) {
          if (relativeTime >= frames[i]) {
            fromFrame = parseFloat(frames[i]);
            fromValue = values[i];
            toFrame = parseFloat(frames[i+1]);
            toValue = values[i+1];
          }
        }

        var value = ease.linear(0,
          relativeTime-fromFrame,
          fromValue,
          toValue-fromValue,
          toFrame-fromFrame
        );
        actorObject.setAttribute(trackName, value);

        // console.log('time:',parseFloat(relativeTime.toFixed(2)), ' fromF:',parseFloat(fromFrame), ' fromV:',fromValue, ' toF:',toFrame, ' toV:',toValue);

        }
        
      };

      // Export Timeline Interface
      
      return {
                
        // init: function () {
        //   return addTimelineToPlayStack(this);
        // },

        // Play the animation
        ////////////////////////////////////////////////////////////////////////////////////////////

        play: function () {
          index = timelineCounter;
          lastMS = timeNow();
          addTimelineToPlayStack(this);
        },

        // Stop the animation
        
        pause: function () {
          removeTimelineFromPlayStack(index);
          index = false;
        },


        time: function (ms) {
          if (index !== false) {
            playhead += (ms-lastMS)/1000
            update();
            lastMS = ms;
          }
        },

        reset: function () {
          playhead = 0
        },

        // Set the speed (fraction)
        ////////////////////////////////////////////////////////////////////////////////////////////

        // speed: function () {
          
        // },

        onUpdate: function () {

        },

        onEnd: function () {
          
        }

      };
      
    } ());

  }

  // Expose animate to window
  
  window.animate = animate;

  // Play all timelines
  
  playAll();

})( this );