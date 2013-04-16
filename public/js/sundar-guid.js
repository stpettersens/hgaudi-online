/* Veera Sundar's GUID generator for Underscore.js.
http://veerasundar.com/blog/2013/01/underscore-js-and-guid-function/ */
 _.mixin({
        guid : function(){
          return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
          });
        }
 });
