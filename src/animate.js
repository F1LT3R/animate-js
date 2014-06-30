/* 
  animate-js
  a micro-animation framework for JavaScript
  
  MIT License (MIT)
  
  Copyright © 2014 Alistair G MacDonald

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.

  */

(function( window ){

  "use strict";


  // EXTEND
  ////////////////////////////////////////////////////////////////////////////////////////////////

  // Used to extend the library, such as adding easing options
  var extend = {
    
    // Easing functions
    easing: {
      linear: function (t, b, c, d) {
        return c*t/d+b;
      }
    }

  };




  // DEFINE GLOBALS
  ////////////////////////////////////////////////////////////////////////////////////////////////
  
  // Any timeline added to this stack becomes active (is playing)
  var timelinePlayStack = {},
      
      // Counter used to create UUID's for each active timeline
      timelineCounter = 0,
      
      // The global JavaScript timer that from which all timelines are updated
      intervalTimer = null,
      
      // Set the frames second
      framesPerSecond = 24;

  
  // Add a timeline to the play stack
  function addTimelineToPlayStack (timeline) {
    timelinePlayStack[timelineCounter] = timeline;
    timelineCounter+=1;
  }


  // Remove a timeline from the play stack
  function removeTimelineFromPlayStack (uuid) {
    timelinePlayStack[uuid].timelineReference = null;
    delete timelinePlayStack[uuid];
  }


  // Initialize the global timer
  function initTimer () {
    
    // On every interval...
    function eachInterval () {
      var currentTime = timeNow(), uuid;

      // Increment through the playstack and update the individual timelines
      for (uuid in timelinePlayStack) {
        timelinePlayStack[uuid].update(currentTime);
      }
    }

    // Fire the timer on each interval
    intervalTimer = setInterval(eachInterval, 1000/framesPerSecond);
  }


  // Gets the current Epoch Time
  function timeNow (){
    return (+new Date());
  }



  // NAMESPACE
  ////////////////////////////////////////////////////////////////////////////////////////////////

  // Global Namespace "Animate" becomes public interface
  // ...returns the control interface to the instantiated timeline object  
  function animate () {



    // CONSTRUCT
    ////////////////////////////////////////////////////////////////////////////////////////////////
    
    // Encapsulate Timeline Object
    return (function (args) {
      
      // The Universally Unique Identifier this timeline is resigstered by in the timelinePlayStack
      // ...the UUID is updated whenever timeline is added back to the timelinePlayStack
      var uuid,

        // A back-reference to the timeline object in the timelinePlatStack
        timelineReference,
          
        // Playhead represents the current time of the animation
        playhead = 0,

        // Assume we want to start playing the newly created animation... 'right now'
        lastPlayhead = timeNow(),

        // The UUID of this timeline
        uuid,

        // The first argument passed is the object on which to act, the 'actor' on the stage
        actor = args[0],
      
        // A 'track' contains values of a given property at specific times (in seconds)
        track = args[1],
        
        // The type of easing to use for this timeline
        easeType = args[2] || 'linear',

        // Public callbacks
        onUpdateCallback, onEndCallback,

        // Associative array, used to optimize
        framesArray = [], valuesArray = [],
        
        // Key index for each frame in the track
        frame,

        i=0, l;

      // Shuffle the frames object into an array (optimize for animating later)
      // ...we do this using an associative array, re-ordering due to JS objs being sorted by alpha

      // Loop through the frames object
      for (frame in track) {
        
        // Create an array from the object containing the float values of the frames (seconds)
        framesArray.push(parseFloat(frame));
      }

      // Sort the array (because values like .5 will be sorted alphabetically, we want numeric sort)
      framesArray.sort();
      
      // Optimize by caching length of the array
      l = framesArray.length;

      // Create the values array based on the correct ordering of the frames array
      for (; i< l; i+=1) {
        valuesArray.push(track[framesArray[i]]);
      }
  
      track = [framesArray, valuesArray];



  // METHOD: UPDATE ANIMATION
  ////////////////////////////////////////////////////////////////////////////////////////////////

      // Interpolates the animation value every time every global interval timer ticks
      // .. passes the value back to onUpdate() alongwith the actor object reference
      function updateTime() {
        
        var frames = track[0],
            values = track[1],

            fromFrame = frames[0],
            fromValue = values[0],
            toFrame = frames[1],
            toValue = values[1],

            i = 1,
            lastFrame = frames.length,
            
            returnValue;

        // TODO: Remmeber last frame, so we don't loop through all the frames?
        // Is remembering which frame we were at last actually optimal for the kinds of
        // animations this code is designed for? Probably not.

        for (; i< lastFrame; i+=1) {
          if (playhead >= frames[i]) {
            fromFrame = frames[i];
            fromValue = values[i];
            toFrame = frames[i+1];
            toValue = values[i+1];
            if (i===lastFrame-1) {
              toFrame = fromFrame;
              toValue = fromValue;
            }
          }
        }

        // Calculate the interpolated animation value based on the last/current/next values
        returnValue = extend.easing[easeType](playhead-fromFrame, fromValue, toValue-fromValue, toFrame-fromFrame);

        // If there is an update callback...
        if (onUpdateCallback) {
          // ...and the return value is a number...
          if(!isNaN(returnValue)) {
            // Pass the actor and the animation property value back
            onUpdateCallback.call(timelineReference, actor, returnValue);
          }
        }

        // If there is an onEnd callback...
        if (onEndCallback) {
          // ...and the animation has reached the end...
          if (playhead >= frames[lastFrame-1]) {
            // Stop the timeline from playing
            removeTimelineFromPlayStack(uuid);
            // Pass the actor and value back to the end callback
            onEndCallback.call(timelineReference, actor, returnValue);
          }
        }

      }


      
      // INSTANCE INTERFACE
      ////////////////////////////////////////////////////////////////////////////////////////////////
      
      // Timeline Controls
      return {
                
        play: function () {
          uuid = timelineCounter;
          addTimelineToPlayStack(this);
          timelineReference = timelinePlayStack[uuid];
          lastPlayhead = timeNow();
        },

        // Stop the animation        
        pause: function () {
          removeTimelineFromPlayStack(uuid);
          uuid = false;
        },

        // Updates the current global playhead based on the current global time
        update: function (currentTime) {
          if (uuid !== false) {
            playhead += (currentTime-lastPlayhead)/1000;
            updateTime();
            lastPlayhead = currentTime;
          }
        },

        // Restarts this animation timeline by resetting the playhead to 0
        restart: function () {
          uuid = timelineCounter;
          playhead = 0;
          lastPlayhead = timeNow();
          addTimelineToPlayStack(this);
        },

        // Sets the onUpdateCallback that is fired after each call to currenTime() from global timer
        onUpdate: function (cb) {
          onUpdateCallback = cb;
          return this;
        },

        //  Sets the onEndCallback that is fired when the animation playhead reaches the end frame
        onEnd: function (cb) {
          onEndCallback = cb;
          return this;
        },

        // Very basic extend function, currently just used to extend easing when needed
        extend: function (ref, obj) {
          for (var key in obj) {
            extend[ref][key] = obj[key];
          }
        },

        stopAll: function () {
          for (uuid in timelinePlayStack) {
            timelinePlayStack[uuid].pause();
          }
        },

      };
      
    } (arguments));

  }


  // INITIALIZE
  ////////////////////////////////////////////////////////////////////////////////////////////////

  // Begin the global timer that updates all individual timelines
  initTimer();

  // Expose globally namespaced animate interface to the window
  window.animate = animate;

})( this );