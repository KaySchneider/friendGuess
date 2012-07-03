/**
 * get this base class an object name 
 * then you become the new obj extended the base obj
 */
baseMethod = function (namespace) {
   
   this.basenamespace = namespace;
   
    this.__call = function (methodName, params) {
        var evalCall = "";
        var sep = "";
        $(this.basenamespace).each(function (item,value) {
            if(item > 0 ) {
                sep = ".";
            }
            evalCall = evalCall + sep + value + "";
        });
        if(params != undefined) {
             
            evalCall = evalCall + "." + methodName+ "(params)";
        } else {
            evalCall = evalCall + "." + methodName+ "()";
        }
        
        eval( evalCall );
    }
    
}