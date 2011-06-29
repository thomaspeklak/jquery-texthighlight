#jQueryTextHighlight

This jQuery plugin can highlight text in a document.

##Usage

add the script to any page and provide terms you want to highlight as values for the GET Parameter __highlight__

If you want to only hightlight text in a container, just override the default `$.textHighlight.container = 'body'`.

Example:

    http://thomaspeklak.github.com/jquery-texthighlight?highlight=jquery;highlight

To toggle the highlight on/off you can use `$.texthighlight.toggle()`

