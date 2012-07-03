/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var gameController;


gameController = function () {
    this.friendData = null; //all the friends of the current logged in facebook user
    this.loginState = null; //the current connection state between the current present user and the game
    this.listener = new Array();
    this.points = 0; //user stati
    this.correctAnswers = 0; //user stati
    this.falseAnswers = 0; //user stati
    this.falseDel = 50;
    this.correctPoint = 100; //the points wich an user becomes if the answer is correct
    this.maxDuration = 10; //the maximum duration of the simple game ( 10 friends to know )
    
    this.timeRun = true; //set to false, that the game will be stopped
    
    this.nowSearchId = null;
    this.maxFriends = null;
    
    this.allGames = new Array();//array contains all the answer sets and the data for one game
    this.activeGame = null;
    
    this.loadedGames = new Array();
    
    this.gameState = false;
    this.timeEngine = new timeStopper();
    this.timeEngine.registListener(this);
};

gameController.prototype = new baseMessage();

gameController.prototype.receiveMessage = function (data) {
   switch(data.message) {
       case 'friendsArrived' :
           this.startGame(data.data);
       break;
       case 'timeOut' :
           this.stopGame();
       break
       
   }  
};




gameController.prototype.init = function () {
  this.collectFriends();
};

gameController.prototype.collectFriends = function () {
    this.friendData = new friendData();
    this.friendData.registListener(this);
    //call the friends data from facebook
    this.friendData.init();
    //waiting for the friends 
    
};

/**
 * builds the game,
 * all correct answers and all
 * other answers builded in one run
 */
gameController.prototype.buildAllGame = function () {
    
};


/**
 * lets the game run once
 */
gameController.prototype.runOneGame = function () {
    this.gameState = true;
    var game = this.allGames.shift();//take one item 
   
    if(typeof(game) === "undefined" ) {
      this.gameState = false;
      alert("Next round");
      //start next round
      this.startGame({'friendsCount':this.maxFriends});
      return 0;
    } 
    this.activeGame = game;
    //get the view
    var buttons = this.buildAnswerButtons(game.allAnswers);
    
    $('#btnCont').html(buttons);
    
    var imageT = game.getImage();
   
    $('#pcont').html(imageT);
    
};

/**
 * game logic
 *
 */
gameController.prototype.startGame = function (data) {
    this.maxFriends = data.friendsCount;
    //start building the gameSet
 
    
    for(var i = 0; i <= 9; i++) {
        var game = this.buildGameSet();
            (function (that) {
                var litem = that.correctAnswer;
                stackLoad.addItem('http://graph.facebook.com/' + that.correctSolution.id + '/picture' ,function (picture) {
                    that.setPicture(picture);
                }, '');
            })(game);
            this.allGames.push(game);
    }
    
    
    
    
};

/*
 * starts the game
 */
gameController.prototype.buildGameSet = function () {
  
   var seekFriend = this.selectRandomFriend();
   //build the Answer Collection
   var allAnswers = this.getAnswerCollection(seekFriend);
   allAnswers =  arrayEx.shuffle(allAnswers);
   var set = this.buildGameObject( allAnswers, seekFriend);
   
   return set;
  
};


/**
 * returns the game object
 */
gameController.prototype.buildGameObject = function (answerSet, correctAnswer) {
    
   
    return {
            'allAnswers': answerSet, 
            'correctSolution': correctAnswer, 
            'setPicture': function (pictureData) {
           
                        this.image = pictureData;
                    
                        //picture is loaded starts the game here
                        this.gameObj.run();
                        
            } ,
            'gameObj': this,
            'image':null,
            'getImage': function () {
                return this.image;
            },
            
            'actionCheck': function (cid, callBackSuccess, callBackFalse ) {
             
                if(cid === this.correctSolution.id) {
                    //callback success if the user hits the correct solution of this object
                    callBackSuccess();
                } else {
                    callBackFalse();
                }
            }
            
           };
};


/**
 * this method returns four answers collection 
 * one is the nowSearchId and three will be 
 * searched here with rndfunction 
 */
gameController.prototype.getAnswerCollection = function (searchFriend) {
     //get 3 new Friends
    var friend1 = this.selectRandomFriend();
    var friend2 = this.selectRandomFriend();
    var friend3 = this.selectRandomFriend();
    //returns an array with the three friends
    return [friend1, friend2, friend3, searchFriend];
};

/**
 * the user has guess correct
 */
gameController.prototype.nextOne = function () {
  this.addPoints();
  this.gameState = false;
  this.run();
};

/**
 * the user has guess false
 */
gameController.prototype.thisOne = function () {
    this.negatePoints();
};

/**
 * checks the answer when a user clicked on a
 * button
 */
gameController.prototype.checkAnswerButtonClick = function ( cId) {
  if(this.checkGameRun() === false) {
      return 0;
  }
    (function (that) {
        that.activeGame.actionCheck(cId, function () {
                    that.nextOne();
                }, function () {
                    that.thisOne();
                } );
        })(this);
};

gameController.prototype.selectRandomFriend = function () {
    var rndInt = Math.floor((Math.random()*this.maxFriends)+0);
    var friendData = this.friendData.getIndexFriend(rndInt);
    return friendData;
};


/**
 * setter and getter
 *
 */

/**
 * callback for the images loaded to start the game
 */
gameController.prototype.run = function (gIndexId) {
   if(this.gameState === false && this.timeRun == true) {
       console.log(this.timeEngine);
       this.timeEngine.start();
       this.runOneGame();
   }
};

gameController.prototype.stopGame = function () {
  this.timeRun = false;  
};

gameController.prototype.checkGameRun = function () {
  if(this.timeRun == false) {
      return false;
  } else {
      return true;
  }
};

/**
 * adding the points to the 
 * user
 */
gameController.prototype.addPoints = function ( ) {

    this.points += this.correctPoint;
    this.correctAnswers++;
    this.updateUserStats();
};

/**
 * case fasle answer, negate the points
 */
gameController.prototype.negatePoints = function () {
  this.points -= this.falseDel;
  this.falseAnswers++;
  this.updateUserStats();
  
};
/**
 * maybe this should happen already in the mainObj
 * so that the app can better controll the hole Game
 * and stats
 */

/**
 * view of gameController
 */

/**
 * 
 * builds an html Element wich contains all
 * the answer buttons
 * 
 */
gameController.prototype.buildAnswerButtons = function (answerArray , checkMethod) {
    var wrappAll = document.createElement('div');
    wrappAll.setAttribute("class", "gameButtons")

    for(var i in answerArray) {
        var btn = this.buildButton( answerArray[i] );
        wrappAll.appendChild( btn );
    }
    
    return wrappAll;
};

/**
 * binds the action to the answer buttons
 */
gameController.prototype.bindAnswerButtonAction = function (element , checkMethod) {
    $(element).live( 'click' , checkMethod );
};

/**
 * build an html Element
 * wich contains one button,
 * div tag with one span tag inside
 */
gameController.prototype.buildButton = function (element) {
    var buttonWrapper = document.createElement('div');
    var textWrapper = document.createElement('span');
    var text = document.createTextNode(element.name);
    buttonWrapper.setAttribute("fid", element.id);
    (function (that) {
        that.bindAnswerButtonAction(buttonWrapper, function() {
            var userId = $(this).attr("fid");
            that.checkAnswerButtonClick(userId);
          
        });
    })(this);
    textWrapper.appendChild(text);
    buttonWrapper.appendChild(textWrapper);
    
    return buttonWrapper;
};

/**
 * updates the stats in the view
 */
gameController.prototype.updateUserStats = function () {
    $('#vcorrcect').html(this.correctAnswers);
    $('#vwrong').html(this.falseAnswers);
    $('#vpoints').html(this.points);
};