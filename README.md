#animate-js

*a micro-animation framework for JavaScript*

##Concept

**animate-js** is super-lightweight animation framework that can be used to animate *'anything'*.

The library knows nothing about what kinds of things you are trying to animate, it doesn't change
the properties of the things you are animating itself, but provides callbacks for you to do this yourself. Basic timeline controls are provided to manipulate animations from your own scripts.

This was created to syncronize the animation of CSS properties and SVG values. The code needed to 
work cross-browser on latest builds, and work on Internet Expolorer as far back as IE9.

**Library size:** ~1 kb

##Donate

This code is free to use and distribute with attribution under the MIT License.

Bitcoin donations are always welcome if you use this code or find it helpful:

<a class="coinbase-button" data-code="684007a4c9198aaf59a4cbf2b45a6472" data-button-style="donation_small" href="https://coinbase.com/checkouts/684007a4c9198aaf59a4cbf2b45a6472"><img src="https://coinbase.com/assets/buttons/donation_small-77a6e527206c0407ffd8b2e8b76556b0.png"></a><script src="https://coinbase.com/assets/button.js" type="text/javascript"></script>

##Basic Usage

First we include the *animate.min.js* script in your page:

    <script src="animate.min.js" type="text/javascript" ></script>

Then define your timeline with an object-reference and an ojbect containing frames values. In the example below, we are controlling the opacity of a DOM element. We are getting the object using
jquery with: `$('#someid')`.

At second `0`, we want the opacity value to be `1`, at second `1` we want the  opacity value to be
`0`; and so on.

    var timeline = animate($('#someid'), {
      0: 1,
      1: 0,
      2: 1 
    });

Provide an update callback. This is where you apply the animation to the object(s) you want to 
animate. The scope of *`this`* within each callback is the timeline object.

    // Provide a callback for each update of the timeline
    timeline.onUpdate(changeOpacity);

Your update callback make look somethinglike this:

    function changeOpacity (obj, val) {
      obj.setAttribute('opacity', val);
    }

Begin playing the animation.

    timeline.play();

That's it!

Simple.

##Timeline Control

###`timeline.play()`

Begins playing a timeline.

###`timeline.pause()`

Pauses a timeline at it's current position.

###`timeline.restart()`

 - Pauses a timeline at it's current position.
 - Resets the playhead to the start of the animation.
 - Begins playing the timeline again.

###`timeline.onUpdate(callback)`

Functions passed to onUpdate() will be fired every time the internal animation timer is fired.

    function changeOpacity (obj, val) {
      obj.setAttribute('opacity', val);
    }

    timeline.onUpdate(changeOpacity);

###`timeline.onEnd(callback)`

Functions passed to onEnd() will be fired once when the animation has finished. Before the callback
is fired, the timeline will be stopped. You will have to call play if you want it to play again.
    
    timeline.onEnd(callback);

###Looping Timelines

Use the `onEnd(callback)` to loop a timeline, like this:
    
    function restartCallBack () {
      this.restart();
    };

    timeline.onEnd(restartCallback);

##Extending Easing Types

Use the `extend()` method to add new types of easing. **animate-js** ships with *linear* only out of the box. You can find more easing extensions in `./tests/`.

    // Add a new easing method
    animate().extend('easing', {
      outCubic: function (t, b, c, d) {
        return c*((t=t/d-1)*t*t + 1) + b;
      }
    });

##Examples

Comming soon.

##License

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
