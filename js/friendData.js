/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


var friendData;

/**
 * friendData
 * this object saves
 * the friendData from facebook in an array
 */
friendData = function () {
  
    this.facebook = facebookHelper;
    this.friends=null;
};

friendData.prototype = new baseMessage();

friendData.prototype.init = function () {
    /**
     * register here for the login changes from facebook
     * 
     */
    this.facebook.registForLoginChange(this, 'receiveMessage');
    this.callData();
    
    
};

friendData.prototype.receiveMessage = function (data) {
    switch(data.message) {
        case 'friends':
            this.setUserFriends(data.data);
            break;
    }
};


friendData.prototype.callData = function () {
    this.facebook.getFriends();
};

/**
 * getter and setter area
 *
 */
friendData.prototype.setUserFriends = function (friendsObj) {
    
    this.friends = friendsObj.data;
    
    var msgObj = this.buildMessageData('friendsArrived', {friendsCount:friendsObj.data.length});
    this.sendMessage(msgObj);
};


friendData.prototype.getFriendsPicture = function (uid) {
  (function (fdata) {  
    this.facebook.getUserDataById(uid, function () {
            fdata.returnFriendsPicture();
    });
  })(this);
};

friendData.prototype.returnFriendsPicture = function (response) {
   
    this.buildMessageData('userPictureArrived', {respone:respons});
};

friendData.prototype.getIndexFriend = function (index) {
    return this.friends[index];
};





/**
 * callback mehtod for the incoming data from facebook
 * if possible all the friends of the user
 */
friendData.prototype.FacebookFriendDataCallback = function (data) {
    
};

