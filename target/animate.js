!function(window){"use strict";var extend={easing:{linear:function(x,t,b,c,d){return c*t/d+b}}};var timelinePlayStack={},timelineCounter=0,intervalTimer=null,framesPerSecond=24;function addTimelineToPlayStack(timeline){timelinePlayStack[timelineCounter]=timeline;timelineCounter+=1}function removeTimelineFromPlayStack(uuid){delete timelinePlayStack[uuid]}function initTimer(){function eachInterval(){var currentTime=timeNow(),uuid;for(uuid in timelinePlayStack){timelinePlayStack[uuid].update(currentTime)}}intervalTimer=setInterval(eachInterval,1e3/framesPerSecond)}function timeNow(){return+new Date}function animate(){return function(args){var uuid,playhead=0,lastPlayhead=timeNow(),uuid,actor=args[0],track=args[1],easeType=args[2]||"linear",onUpdateCallback=null,onEndCallback=null,framesArray=[],valuesArray=[],frame;for(frame in track){framesArray.push(parseFloat(frame));valuesArray.push(track[frame])}track=[framesArray,valuesArray];function updateTime(){var frames=track[0],values=track[1],fromFrame=frames[0],fromValue=values[0],toFrame=frames[1],toValue=values[1],i=1,lastFrame=frames.length,returnValue;for(;i<lastFrame;i+=1){if(playhead>=frames[i]){fromFrame=frames[i];fromValue=values[i];toFrame=frames[i+1];toValue=values[i+1];if(i===lastFrame-1){toFrame=fromFrame;toValue=fromValue}}}returnValue=extend.easing.linear(0,playhead-fromFrame,fromValue,toValue-fromValue,toFrame-fromFrame);if(onUpdateCallback){if(!isNaN(returnValue)){onUpdateCallback(actor,returnValue)}}if(onEndCallback){if(playhead>=frames[lastFrame-1]){onEndCallback(actor,returnValue);removeTimelineFromPlayStack(uuid)}}}return{play:function(){uuid=timelineCounter;addTimelineToPlayStack(this);lastPlayhead=timeNow()},pause:function(){removeTimelineFromPlayStack(uuid);uuid=false},update:function(currentTime){if(uuid!==false){playhead+=(currentTime-lastPlayhead)/1e3;updateTime();lastPlayhead=currentTime}},restart:function(){playhead=0;return this},onUpdate:function(cb){onUpdateCallback=cb;return this},onEnd:function(cb){onEndCallback=cb;return this},extend:function(ref,obj){for(var i in obj){}}}}(arguments)}initTimer();window.animate=animate}(this);