# NanoModal

NanoModal is yet another modal / dialog library written in a small amount of pure JavaScript.

Features:

  - Tiny: ~2.6kb minified and gzipped or ~6.6kb just minified.
  - 100% self contained. Does not require other libraries, css, or any other resources.
  - Completely customizable. Everything has a class (or can be given a class) that you can apply your own styles to.
  - Tested for bugs and memory leaks on Chrome, Firefox, IE8+, Mobile Safari, and Android's Browser. It's mobile ready!
  - Easy to use and licensed under MIT!

I wanted a modal library that was small, easy to use, and worked everywhere - thus NanoModal was born. When I was writing NanoModal, my main goals were: it should be tiny, fully customizable, and it should work on all major browsers (including mobile). Most modal libraries don't work well (or at all) on mobile, especially when users rotate or zoom their device while looking at a modal. I aimed to fix all these problems and make the best modal library I possibly could.

# Usage

Basic usage:
```javascript
// usage case 1:
var justTextModal = nanoModal("Hello World!");
justTextModal.show();

// usage case 2:
var elementModal = nanoModal(document.querySelector("#myHiddenFormDiv"));
elementModal.show();
```

Usage with more options:
```javascript
// usage case 1:
var modalWithNoButtons = nanoModal("Hey this is an important message!", {
    buttons: []
});
modalWithNoButtons.show();

// usage case 2:
var dialogModal = nanoModal("Are you sure you want to do this?", {
    overlayClose: false, // Can't close the modal by clicking on the overlay.
    buttons: [{
        text: "I'm sure!",
        handler: function(modal) {
            // do something...
            modal.close();
        },
        primary: true
    }, {
        text: "Maybe not...",
        handler: "hide"
    }]
});
dialogModal.show();
```

# Full Documentation

### nanoModal() Options
```javascript
var customModal = nanoModal("hey", { /* options */ });
```
Here are the properties that can go in the options object and what they do:
- **classes**: A string of space separated classes you want on the main modal container: "myClassA myClassB"
- **buttons**: An array of objects (button definitions) to set the buttons on the bottom of this modal.
- **autoRemove**: A boolean (true or false) to make the modal automatically call remove() on itself after it hides (false by default).
- **overlayClose**: A boolean (true or false) to allow a click on the background overlay to close the modal (true by default).

### The NanoModal Object
```javascript
var modalObj = nanoModal("hi");
```

All functions ( except for .remove() and .getContent() ) return the API again so you can chain. Here is the API:
- modalObj**.show()**
  - Arguments: None
  - Shows the modal and overlay.
- modalObj**.hide()**
  - Arguments: None
  - Hides the modal and overlay.
- modalObj**.remove()**
  - Arguments: None
  - fully removes the modal from the DOM and removes all event handlers on it.
- modalObj**.setContent( content )**
  - Arguments: takes a string or an HTML element as its arg.
  - Will replace the current content with what is given.
- modalObj**.getContent()**
  - Arguments: None
  - Returns what the current content is (could be a string or an HTML element).
- modalObj**.setButtons( [{ ... }, { ... }] )**
  - Arguments: takes an array of objects (button definitions).
  - Will replace the current buttons with the given buttons.
- modalObj**.onShow( func )**
  - Arguments: takes a function as its arg. The function gets passed this API.
  - The passed function gets called when the modal is shown.
- modalObj**.onHide( func )**
  - Arguments: takes a function as its arg. The function gets passed this API.
  - The passed function gets called when the modal is shown.

**Other Properties (You probably wont need to use)**
- modalObj**.overlay**
  - The overlay El Object.
- modalObj**.modal**
  - The modal El Object.

### Button Definitions
```javascript
var modalObj = nanoModal("sup", {buttons: [ /* button definition objects here */ ] });
```

When defining custom button objects, here are the properties you can set and what they do:
- **text**: The string of text that goes inside the button.
- **handler**: This can be the string "hide" *OR* a function. If it is the string "hide", the button will simply close the modal when it is clicked. Otherwise the passed function will be called when the button is clicked. The function will also be passed the modal API.
- **primary**: A boolean (true or false). If this is true, it just adds the "nanoModalBtnPrimary" class to the button (which makes it look blue by default).
- **classes**: A string of space separated classes you want on the button: "myClassA myClassB"

### Note: You probably wont need to deal with the below objects.
---

### El Objects
```javascript
var modalObj = nanoModal("hello");
var elObject = modalObj.modal;
var elObject2 = modalObj.overlay;
```

El Objects are just objects that hold an html element with some helper functions on it:
- elObject**.el**: The real html element.
- elObject**.add( el )**: Takes an html element or another El object and appends it to this El object.
- elObject**.addClickListener( func )**: A shorthand function for adding a touch / click listener. Takes a function.
- elObject**.addListener( eventString, func )**: Takes an event string (like "click") and a function.
- elObject**.html( htmlString )**: Sets the inner html of this element.
- elObject**.text( textString )**: Sets the inner text of this element.
- elObject**.show()**: Sets the style "display" to "block" on this element.
- elObject**.hide()**: Sets the style "display" to "none" on this element.
- elObject**.isShowing()**: Checks to see if the style "display" is "block" on this element.
- elObject**.remove()**: Removes the element from the DOM and removes all event handlers on it.
- elObject**.onHideEvent**: A custom made Modal Event object.
- elObject**.onShowEvent**: A custom made Modal Event object.

### Modal Event Objects
```javascript
var modalObj = nanoModal("hello");
var modalEventObj = modalObj.modal.onShowEvent;
var modalEventObj2 = modalObj.modal.onHideEvent;
```

Modal events are just me making a super simple custom event system:
- modalEventObj**.addListener( func )**: Adds a function to be called when this event fires. Returns a listener ID.
- modalEventObj**.removeListener( listenerID )**: Expects an integer id of the listener to remove.
- modalEventObj**.removeAllListeners()**: Removes all listeners.
- modalEventObj**.fire()**: Calls all added listeners and passes them the arguments passed to this function.

# License

MIT
