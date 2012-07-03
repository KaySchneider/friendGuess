/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


var baseMessage;

baseMessage = function () {
    this.listener = new Array();
  
};


baseMessage.prototype.sendMessage = function (msgData) {
    var listener = this.listener;
    for (var i in this.listener) {
      try {
            
            this.listener[i].receiveMessage(msgData);
       } catch(e) {
           console.log("Exception line 20 baseMessage",e);
       }
    }
};


/**
 * override this method in your own class
 */
baseMessage.prototype.receiveMessage = function (message) {
    console.log(message, 'message received by baseMessenger, please implement receiveMessage method in your child class', this);
};

baseMessage.prototype.registListener = function (listenerObj) {
   
    this.listener.push(listenerObj);
  
};

/**
 * @param message = string
 * @param data = '' or object or array
 * 
 * @return msgObj an messageObject for use in sendMessage
 */
baseMessage.prototype.buildMessageData = function (message, data) {
    var msgObj = {'message':message, 'data':data};
    
    return msgObj;
};