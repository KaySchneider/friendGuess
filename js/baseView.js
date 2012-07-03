/**
 * calls an view from the server
 * and render the partical view with
 * the needed information from this part
 */
var baseView = function () {
  /**
   * static Vars
   */
    this.viewFile = null;
    this.viewDom = null;
    this.assignedValues = null;

};

baseView.prototype.init = function () {
    this.assignedValues = new Array();
};

baseView.prototype.setViewFile = function (fileName) {
    this.viewFile = fileName;
    this.viewDom = null;
};

baseView.prototype.setViewDom = function (domSelector) {
    this.viewDom = domSelector;
    this.viewFile = null;
};

/**
 * calls the view from the server,
 * loads the view and render its 
 * result
 */
baseView.prototype.callViewFromServer = function () {
    
};

/**
 * assigning new key value pairs to the view
 */
baseView.prototype.assing = function (key,value) {
    this.assignedValues.push([key, value]);
};

baseView.prototype.renderView = function () {
    
};