/**
 * the loadStack handler
 * loads images for the game
 * one by one, every image becomes an 
 * own callback method but after load one
 * image an global callback will be called
 */


var loadStack;

loadStack = function () {
    this.stackr = new Array(); //files wich must be loaded
    this.ready = new Array(); //files wich are already loaded
    this.stackState = false; //false = stack is not loading true = stack is running
    this.loadItem = false; //when the stack is loaded the loaded element will be insert here
};


loadStack.prototype = new baseMessage();

/**
 * adds one item to the stack
 */
loadStack.prototype.addItem = function (item, callback, optionalData) {
   
 this.stackr.push({
        'item':item, 
        'callback':callback,
        'optionalData':optionalData
    }) ;
  
    this.checkStack();
};

/**
 * checks if there is another item in 
 * the stack array wich must be loaded
 */
loadStack.prototype.checkStack = function () {
    //only when stack isnt running
    if(this.stackState == false) {
        if(this.stackr.length === 0) {
            //do nothing when the index is 0
            return 0;
        }
    
        this.loadItem = this.stackr.shift(); //takes the first element from the array
        
        this.loader(this.loadItem);
    }
};

/**
 * loads one item
 */
loadStack.prototype.loader = function (itemObj) {
    //turns the stack on
    this.stackState = true;
    //loading at this time only images
    var tmpImage = new Image();
    tmpImage.src = itemObj.item;
    (function (that) {
        tmpImage.onload = function (data) {
            that.callBackLoad(this);
        };
    })(this);
  
    
};

/**
 *stack callback method
 */
loadStack.prototype.callBackLoad = function (dt) {

    this.loadItem.callback(dt);
    this.setItemReady();
    this.checkStack();//call the checkStack to load another item 
};

/**
 * state setter and getter
 */
loadStack.prototype.setStateFree = function () {
    this.stackState = false;
};

loadStack.prototype.setItemReady = function () {
    this.ready.push(this.loadItem);
    this.loadItem  = null;

    this.setStateFree();
};




var stackLoad;

$(document).ready(function () {
    stackLoad = new loadStack();
});