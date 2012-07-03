/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


var timeStopper;

timeStopper = function () {
    this.startTime = null;
    this.maxExecuteTime = 60; //the maximum time wich the game can be played in second
    this.isRunning  = false;
    this.visualize = true;
    this.intervalId = null;
    
};

timeStopper.prototype = new baseMessage();

timeStopper.prototype.start = function () {
    if(this.isRunning === false) {
        this.startTime =  new Date().getTime();
        this.isRunning = true;
        (function (that) {
           that.intervalId =  setInterval( function () {
                console.log(that, "hu");
                that.checkExec();
            }, 500);
        } )(this);
    }
};

timeStopper.prototype.checkExec = function () {
    //check here if the diff between start and now are this.maxExecuteTime 
    //inform the listeners that  
    var diff =  Math.floor( (new Date().getTime() - this.startTime  ) / 1000);
    if(diff >= this.maxExecuteTime) {
     
        this.stopTime();
    }
    this.updateView(diff);
 
};

timeStopper.prototype.stopTime = function () {
    clearInterval(this.intervalId); //stop the interval
    this.isRunning = false;
    var msgObj = this.buildMessageData('timeOut', '');
    this.sendMessage(msgObj);
};

/**
 * view 
 */

timeStopper.prototype.updateView = function (time) {
    if(this.visualize === false ) {
        return 1;
    }
    
    $('#vtime').html(time);
};

