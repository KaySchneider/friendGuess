/**
 * defines
 */
var main;

main = function () {
    this.facebook = null;
    this.game = null;
   
};

main.prototype = new baseMethod(['mainControll']);


main.prototype.receiveMessage = function (data) {
  
    switch(data.message) {
        case "login":
            this.insertBootScreen();
       
            this.startApp();
            break;
        case "noUser":
            this.authUser();
            break;
        case 'accessToken' :
            this.setAccessToken();
            break;
    }
};
/**
 * the mainController 
 * is the hearth of the app,
 * all other controllers and events 
 * regist itself to the mainController
 */
main.prototype.init = function () {
    /**
    * the facebook worker works as an middleware
    * between the app and facebook itself
    */
    this.facebook = facebookHelper; 
    //check the app authorization to the user
    this.accessToken = false;
    this.facebook.registForLoginChange(this, 'receiveMessage');
    this.userId = this.facebook.getUserId();

};

/**
 * this method will be called if the user is set!
 */
main.prototype.startApp = function () {

    this.game = new gameController();
    this.game.init();
};

main.prototype.authUser = function ( ) {
    this.insertAuthButton();
};


main.prototype.user = function ( ) {
  
    /**
     * make nothing
     */
    };

/**
 * the user aborted the permission request,
 * bind the action again on the button
 */
main.prototype.noUser = function () {
    this.removeAuthButton();
    this.insertAuthButton();
};


/** 
 * setter
 */
main.prototype.setAccessToken = function (accessToken) {
    if(this.accessToken === false) {
        this.insertBootScreen();
        this.accessToken = accessToken;
        this.startApp();
    }
};

/**
 * the view parts of the mainController
 */

/**
 * inject the insert button into the 
 * document / make it viewable and bind the action
 */
main.prototype.insertAuthButton = function () {
    if($('#doAuth').css('display') == 'none') {
        
       
        
        $('#doAuth').css('display', 'block');
        (function (thisObj) {
            $('#doAuth').one('click', function () {
                
                thisObj.facebook.doAuth( function() {
                    thisObj.user();
                }, function() {
                    thisObj.noUser();
                });
            });
        })(this);
    }
   
};

main.prototype.removeAuthButton = function () {
    $('#doAuth').css('display', 'none');   
};

/**
 * shows the current bootscreen 
 * and injects some information 
 * about the tasks we do into the
 * container
 */
main.prototype.insertBootScreen = function () {
    $('#waitContainer').css('display','');
};

var mainControll;

$(document).ready(function () {
    mainControll = new main();
    mainControll.init();
});