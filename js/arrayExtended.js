/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


var arrayExtended;

arrayExtended = function () {
    
};

//arrayExtended.prototype.
arrayExtended.prototype.shuffle = function( myArray ) {
  var i = myArray.length;
 
  if ( i == 0 ) return false;
 
  
  var myArrayNew = [i];
  
  for(var num in myArray) {
      myArrayNew[num] = myArray[num];
  }
  
  while ( --i ) {

     var j = Math.floor( Math.random() * ( i + 1 ) );

     var tempi = myArrayNew[i];
     var tempj = myArrayNew[j];
     myArrayNew[i] = tempj;
     myArrayNew[j] = tempi;
   }
   //myArray = myArrayNew;
   return myArrayNew;
};



var arrayEx;

$(document).ready(function () {
    arrayEx = new arrayExtended();
});