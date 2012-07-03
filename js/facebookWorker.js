/**
 * two little helper functions 
 */
function fbEnsureInitObj(obj, method) {
    if(!window.fbApiInit) {
       setTimeout(function() {
     
            fbEnsureInitObj(obj,method);
        }, 50);
    } else {
        if(obj) {
            obj.__call(method);
        }
    }
}


function userEnsureInitObj(obj, method) {
    if(!window.userCheck) {
        setTimeout(function() {
            userEnsureInitObj(obj,method);
        }, 50);
    } else {
        if(obj) {
            obj.__call(method);
        }
    }
}


var facebookWorker;

var facebookHelper = function(namespace) {
    this.user_authorized = '';
    this.signed_request = '';
    this.authMethod = 'new';
    this.userId = false;
    this.userData = false;
    this.namespace = namespace;
    this.accessToken = false;
    this.authResponse = false;
    this.callBack = false;
    this.observerObjects = new Array();
    this.messageHistory = new Array();//saves the old messages in this Stack!
    /**
     *checks if the facebook Obj is avaiable,
     *if it is avaiable, set fbIsOn = true, and load the user details from facebook
     */
 
    this.checkFacebook();
}


/**
 * extend the object facebookHelper from the snipFrameBaseMehtod
 */
facebookHelper.prototype = new baseMethod(['facebookHelper']);

/***
 * this method checks if the user has granted the application
 * 
 */
facebookHelper.prototype.checkAppPerms = function (callbackTrue,callbackFalse) {
    /**
     * return true, if the accessToken is set
     * in the application
     */
    (function (fbHelper) {
        FB.getLoginStatus(function(response) {
            //the user is connected with the app
       
            if (response.status === 'connected') {
                fbHelper.accessToken = response.authResponse.accessToken;//set the accessToken
                fbHelper.userId = response.authResponse.userID;//set the userId
                fbHelper.getUserData();//set the user Details
                window.userCheck = true;
                fbHelper.sendLoginChangesEvent('accessToken', response.authResponse.accessToken);
              
            } else if (response.status === 'not_authorized') {
            // the user is logged in to Facebook, 
            //but not connected to the app
            window.userCheck = true;
            fbHelper.authorize = false;
            fbHelper.sendLoginChangesEvent('noUser', '');
          
            } else {
            // the user isn't even logged in to Facebook.
            window.userCheck = true;
            fbHelper.authorize = false;
            fbHelper.sendLoginChangesEvent('noUser', '');
            console.log("hey dude, log into facebook");
            //return false;
        }
        });
       
    })(this);
}



facebookHelper.prototype.authorize = function(function_yes, function_no)
{
    (function (fbHelper)  {
        /**
         * check here if the user is already connected
         * and later we check if the user has visited 
         * a new tab
         */
        FB.getLoginStatus(function(response) {
          
            if (response.authResponse) {
           
                fbHelper.userId = response.authResponse.userID;//set the userId
                fbHelper.accessToken = response.authResponse.accessToken;//set the accessToken
                fbHelper.signed_request = response.authResponse.signedRequest;//set the signedRequest
                window.userCheck = true;
                // logged in and connected user, someone you know
                function_yes();
            } else {
                //set the window user check to false
                window.userCheck = true;
                // no user session available, someone you dont know
                fbHelper.doAuth(function_yes,function_no);
            }
        });
       
    })(this);
    
}


/**
 *
 * do the auth function
 */
facebookHelper.prototype.doAuth = function (function_yes,function_no) {
    //if the user isnt connected, show him the connect to the app dialog
    (function(fbHelper){
        FB.login(function(response) {
            if (response.authResponse) {
                window.userCheck = true;
                fbHelper.userId = response.authResponse.userID; //set the userId in the object
                fbHelper.accessToken = response.authResponse.accessToken;//set tje accessToken 
                fbHelper.signed_request = response.authResponse.signedRequest;//set the signedRequest
                fbHelper.sendLoginChangesEvent('login',response);
                function_yes();
            } else {
                function_no();
            }
        })
    })(this);
}

/**
 *checks if the facebook Obj is avaiable,
 *if it is avaiable, set fbIsOn = true, and load the user details from facebook
 */
facebookHelper.prototype.checkFacebook = function () {
    (function (fbHelperObj) {
         
        fbEnsureInitObj(fbHelperObj,"setFacebookOn");    
    })(this);
    
}

facebookHelper.prototype.setFacebookOn = function () {
    this.fbIsOn = true;
    //set the user Data in the object
    (function(fbHelper) {
        //check if the user has permitted the app
        fbHelper.checkAppPerms()
        
    })(this);
    
}

/**
 * send the changes to the receiver when the login state changes
 */
facebookHelper.prototype.sendLoginChangesEvent = function (message,data) {
    dataObj = {'data':data, 'message':message};
    this.messageHistory.push( dataObj );
    var max = this.observerObjects.length;
    max  = max-1;
    //iterate over the observerObjects
    for(i=0;i<=max;i++) {
        /**
         * call the __call method in the object!
         */
        try {
            this.observerObjects[i][0].receiveMessage({'message':message, 'data':data});
        } catch(e) {
            console.log(e,this.observerObjects[i][0],message ,'ERROR LINE 196');
        }
       // this.observerObjects[i][0].__call(thisdo.observerObjects[i][1],dataObj);
    }
}

/**
 * every object you regist here to listen to the login changes must
 * be a child of the object baseMethod
 */
facebookHelper.prototype.registForLoginChange = function (object, method) {
  
    for( var i in this.messageHistory ) {
       
        try {
            object.receiveMessage(this.messageHistory[i].message,this.messageHistory[i].data);
        } catch (e) {
            console.log(e, ' ERROR LINE 211');
        }
    }
    this.messageHistory = new Array();
    var registArr = new Array(object, method);
    this.observerObjects.push(registArr);
}

facebookHelper.prototype.getUserDataId = function (userId, obj, method) {
    //if fb isnt here return true
    this.callBack = [obj, method];
    if(this.fbIsOn == false) {
        return true;
    }
    (function (fbHelperNew) {
        FB.api('/'+userId+'?access_token=' , function(response,obj, method) {
            if(fbHelperNew.callBack) {
                fbHelperNew.callBack[0].__call(fbHelperNew.callBack[1], response);
            }
        });
    })(this);
};

facebookHelper.prototype.getUserDataById = function (userId ,  callBack) {
    if(this.fbIsOn == false) {
        return true;
    }
    (function (fbHelperNew) {
        FB.api('/'+userId+'?access_token=' , function(response,callback) {
            try {
                callback(response);
            } catch(e) {
                console.log(e, 'error facebookHelper line 245, cant can call thecallback method');
            }
        });
    })(this);
};


/**
 * call the userData from facebook
 */
facebookHelper.prototype.getUserData = function () {
    if(this.fbIsOn == false) {
        return true;
    }
    
    (function (fbHelper) {
        FB.api('/me?access_token=' + this.accessToken , function(response) {
            fbHelper.userData = response;
        });
    })(this);


    
}

/**
 * call the userData from facebook
 */
facebookHelper.prototype.getUserPages = function () {
    if(this.fbIsOn == false) {
        return true;
    }
   
    (function (fbHelper) {

        FB.api('/' + fbHelper.userId + '/accounts' + '?access_token=' + fbHelper.accessToken , function(response) {
            fbHelper.sendLoginChangesEvent('pages',response);
        });
    })(this);
    
}

facebookHelper.prototype.receiveAllTabs = function (pageId,pageAccessToken) {
     (function (fbHelper) {
        FB.api('/' + pageId +  '/tabs?access_token=' + pageAccessToken , function(response) {
            fbHelper.sendLoginChangesEvent('receiveTabs',response);
        });
    })(this);
}

facebookHelper.prototype.installNewTab = function (pageId,pageAccessToken) {
     (function (fbHelper) {
         
        $.ajax({
            type: "POST",
            url: "https://graph.facebook.com/"+pageId+"/tabs?access_token=" + pageAccessToken + "&app_id="+ appId +"&method=POST",
        //    data: dataString,
         //   dataType:'json',
            success: function(data)
            {
                //set on success the parsed data out of the signed request
               fbHelper.sendLoginChangesEvent('installTab',data);
            }
        });
       /* FB.api('/' + pageId +  '/tabs?access_token=' + pageAccessToken ,'post', { 'app_id': appId } ,function(response) {
            fbHelper.sendLoginChangesEvent('installTab',response);
        });*/
    })(this);
}

facebookHelper.prototype.getLastFeed = function (pageId,pageAccessToken) {
    if(this.fbIsOn == false) {
        return true;
    }
   
    (function (fbHelper) {

        FB.api('/' + pageId +  '/feed?access_token=' + pageAccessToken  , function(response) {
            fbHelper.sendLoginChangesEvent('pageFeed',response);
        });
    })(this);
};

facebookHelper.prototype.getPagesDetails = function (pageId, pageAccessToken) {
    if(this.fbIsOn == false) {
        return true;
    }
   
    (function (fbHelper,pageAccessToken) {
        FB.api('/' + pageId +  '?access_token=' + pageAccessToken   , function(response) {
            fbHelper.sendLoginChangesEvent('pageData',response);
        });
    })(this,pageAccessToken);
    
};


facebookHelper.prototype.getFriends = function() {
    if(this.fbIsOn == false) {
        return true;
    }
   
    (function (fbHelper,accessToken) {
        FB.api('/me/friends' + '?access_token=' + fbHelper.accessToken  , function(response) {
       
            fbHelper.sendLoginChangesEvent('friends',response);
        });
    })(this,this.accessToken );
    
};

/**
 * getter for the userid
 */
facebookHelper.prototype.getUserId = function () {
    return this.userId;  
}

/**
 * check if the user is connected to the app
 */
facebookHelper.prototype.checkAppAuth = function () {
  
    if (this.fbIsOn == false) {
        console.log("facebook isnt ready, please wait until it`s done");
    } else if(this.accessToken == false ) {
       return false;
    } else {
        return true;
    }
}

/**
 * getter for the userName
 */    
facebookHelper.prototype.getUserName = function () {
    if(this.userData == false) {
        return false;
    }
    return this.userData.first_name;
}

/**
 * getter for the userName
 */    
facebookHelper.prototype.getAccessToken = function () {
    if(this.accessToken == false) {
        return false;
    }
    return this.accessToken;
}

facebookHelper = new facebookHelper(['facebookHelper']);
