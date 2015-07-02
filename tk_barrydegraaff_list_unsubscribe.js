/*
This file is part of the list-unsubscribe Zimlet.
Copyright (C) 2015  Barry de Graaff

Bugs and feedback: https://github.com/barrydegraaff/list-unsubscribe-zimlet

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see http://www.gnu.org/licenses/.
*/
/**
 * This zimlet checks for List-Unsubscribe message header and displays unsubscribe button when found.
 */
function tk_barrydegraaff_list_unsubscribe_HandlerObject() {
}

tk_barrydegraaff_list_unsubscribe_HandlerObject.prototype = new ZmZimletBase();
tk_barrydegraaff_list_unsubscribe_HandlerObject.prototype.constructor = tk_barrydegraaff_list_unsubscribe_HandlerObject;

/**
 * Simplify handler object
 *
 */
var List_UnsubscribeZimlet = tk_barrydegraaff_list_unsubscribe_HandlerObject;

/**
 * Initializes the zimlet.
 */
List_UnsubscribeZimlet.prototype.init =
function() {
   AjxPackage.require({name:"MailCore", callback:new AjxCallback(this, this._applyRequestHeaders)});
};

/**
 * Applies the request headers.
 * 
 */
List_UnsubscribeZimlet.prototype._applyRequestHeaders =
function() {	
	ZmMailMsg.requestHeaders["List-Unsubscribe"] = "List-Unsubscribe";
};

List_UnsubscribeZimlet.prototype.onMsgView = function (msg, oldMsg, msgView) {  
   if(appCtxt.getCurrentAppName()=='Mail')
   {
      //Remove Zimlets infobar from previous message
      try {  
      var elem = document.getElementById("tk_barrydegraaff_list_unsubscribe_actionbar");
      elem.parentNode.removeChild(elem);   
      } catch (err) {}
   
      //Create new empty infobar for display
      var el = msgView.getHtmlElement();
   
      var g=document.createElement('div');
      g.setAttribute("id", "tk_barrydegraaff_list_unsubscribe_actionbar");
      el.insertBefore(g, el.firstChild);

   }
      
   try
   {
      if(msg.attrs['List-Unsubscribe'].indexOf('http') > 0)
      {

         if(document.getElementById('tk_barrydegraaff_zimbra_openpgp_actionbar'))
         {
            if(document.getElementById('main_MSGC'+msg.id))
            {               
               var listUnsubscribe = msg.attrs['List-Unsubscribe'];

               var httpRegEx = new RegExp('(\<)(http.*?)(\>)');
               var listUnsubscribeHttp = listUnsubscribe.match(httpRegEx)

               var mailtoRegEx = new RegExp('(\<)(mailto.*?)(\>)');
               var listUnsubscribemailto = listUnsubscribe.match(mailtoRegEx)
               
               if(document.getElementById('tk_barrydegraaff_zimbra_openpgp_actionbar'))
               {
                  if (listUnsubscribemailto) 
                  {
                     document.getElementById('tk_barrydegraaff_zimbra_openpgp_actionbar').innerHTML = '<a target="_blank" href="?view=compose&to='+listUnsubscribemailto[0].replace(">","").replace("<","").replace("mailto:","").replace("?","&")+'">Unsubscribe</a>';
                  }
                  else if (listUnsubscribeHttp) 
                  {      
                     document.getElementById('tk_barrydegraaff_zimbra_openpgp_actionbar').innerHTML = '<a target="_blank" href="'+listUnsubscribeHttp[0].replace(">","").replace("<","")+'">Unsubscribe</a>';
                  }
               }
            }
         }
      }   
   } catch (err)
   {
     // List-Unsubscribe header not found  
   }
}
