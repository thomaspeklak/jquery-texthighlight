/*
 * jQuery.textHighlight
 */
(function($){
  // extend the jQuery selector engine
  $.extend($.expr[':'], {
    containsIgnoreCase: function(el, index, data, nodelist){
      return (el.textContent||el.innerText||jQuery(el).text()||"").toLowerCase().indexOf(data[3].toLowerCase()) >= 0;
    }
  });

  $.textHighlight = {
    //cache highlighted texts
    texts: [],
    //search for texts to highlight
    search: function(term) {
      term = term.toLowerCase();
      var termRegex = new RegExp(term,'ig');
      $($.textHighlight.container + ' :containsIgnoreCase("'+term+'")').not('script').each(function(){
        var childs = this.childNodes,
            i,l;
        for(i = 0, l = childs.length; i < l; i++){
          var child = childs[i];
          if(child.nodeType==3){
            if(child.nodeValue.toLowerCase().indexOf(term)>=0){
              $.textHighlight.place(term, child, termRegex);
            }
          }
        }
      });
    },
    //place the highlight spans
    place: function(term, node, termRegex){
      var val = node.nodeValue;
      var matches = val.match(termRegex);
      var textfragments = val.split(termRegex);
      var fragment = null;
      var parent = node.parentNode;
      var nextNode = node.nextSibling;
      if(!$.browser.msie || (matches.index!==0)) {fragment = textfragments.shift();}
      node.nodeValue = (fragment)?fragment:'';
      while(matches.length){
        fragment = textfragments.shift();
        var newNode = $.textHighlight.span.cloneNode(true);
        newNode.appendChild(document.createTextNode(matches.shift()));
        $.textHighlight.texts.push(newNode);
        if(nextNode){
          parent.insertBefore(newNode, nextNode);
          if(fragment) {parent.insertBefore(document.createTextNode(fragment), nextNode);}
        }
        else{
          parent.appendChild(newNode);
          if(fragment) {parent.appendChild(document.createTextNode(fragment));}
        }
      }
    },
    //find the terms to highlight through the document.location
    // e.g. test.html?highlight=test;more,evenmore
    highlightTerms: function(){
      var query = document.location.search.match(/highlight=(.*?)(?:$|&)/),
          searchTerms, i, l;
      if(query && query.length>1){
        searchTerms = decodeURI(query[1]).split(';');
        for (i = 0, l = searchTerms.length; i < l; i++){
          $.textHighlight.search(searchTerms[i]);
        }
      }
      $.textHighlight.initialized = true;
      $.textHighlight.visible = true;
    },
    //toggle the textHighlight on/off
    toggle: function(){
      if($.textHighlight.initialized){
        for(var i=0,l=$.textHighlight.texts.length;i<l;i++){
          $($.textHighlight.texts[i]).toggleClass('highlight').toggleClass('noHighlight');}
      }
      else{$.textHighlight.highlightTerms();}
    },
    //initialize
    //create an emtpy span for reuse/cloning
    init: function(){
      $.textHighlight.span = $('<span class="highlight"></span>')[0];
    },
    initialized: false,
    visible: false,
    container: 'body'
  }
  $.textHighlight.init();

  $(function(){$.textHighlight.highlightTerms();});
})(jQuery);
