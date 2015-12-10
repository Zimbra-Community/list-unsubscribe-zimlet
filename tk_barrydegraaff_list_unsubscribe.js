/*
This file is part of the list-unsubscribe Zimlet.
Copyright (C) 2015  Barry de Graaff

Bugs and feedback: https://github.com/Zimbra-Community/list-unsubscribe-zimlet

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 2 of the License, or
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
 * Request Zimbra to expose "List-Unsubscribe" header to the Zimlet framework
 */
List_UnsubscribeZimlet.prototype._applyRequestHeaders =
function() {	
	ZmMailMsg.requestHeaders["List-Unsubscribe"] = "List-Unsubscribe";
};

List_UnsubscribeZimlet.prototype._handleList_UnsubscribeZimletMenuClick = function(controller) {
	//Get selected mail message
   var items = controller.getSelection();
	if(!items instanceof Array) {
		return;
	}
   
   var type = items[0].type;
	var msg;
	if (type == ZmId.ITEM_CONV) {
		msg = items[0].getFirstHotMsg();
	} else if(type == ZmId.ITEM_MSG) {
		msg = items[0];
	}

   //Avoid type errors if no attrs of no List-Unsubscribe
   try{
      var attrs = msg.attrs['List-Unsubscribe'];
   } catch (err) {}

   if((attrs.indexOf('http') > 0) || (attrs.indexOf('mailto') > 0))
   {
      var listUnsubscribe = attrs;

      var httpRegEx = new RegExp('(\<)(http.*?)(\>)');
      var listUnsubscribeHttp = listUnsubscribe.match(httpRegEx)

      var mailtoRegEx = new RegExp('(\<)(mailto.*?)(\>)');
      var listUnsubscribemailto = listUnsubscribe.match(mailtoRegEx)

      // window.open/location is a bit ugly,
      // if you want to change this, please read the RFC: http://www.faqs.org/rfcs/rfc2369.html
      // The below trick using ?view= also parses any subject that may be in the unsubscribe header,
      // body of the mail is not implemented, as I don't think much systems use that.
      if (listUnsubscribemailto) 
      {
         window.location='?view=compose&to='+listUnsubscribemailto[0].replace(">","").replace("<","").replace("mailto:","").replace("?","&").replace(/\+/g,"%2B");
      }
      else if (listUnsubscribeHttp) 
      {      
         window.open(listUnsubscribeHttp[0].replace(">","").replace("<",""));
      }
   }   
};

/* We are create the toolbar button in onMsgView, normally this is done using initializeToolbar,
 * but initializeToolbar is an event that is generated on various places in Zimbra (compose, etc)
 * Since we only want to add the button in the Zimbra Message View, this is a lot safer.
 * Also this avoids having to deal with multiple instances of toolbars and buttons.
 * 
 * */
List_UnsubscribeZimlet.prototype.onMsgView = function (msg, oldMsg, msgView) {  

   try {
      var app = appCtxt.getCurrentApp();
      var controller = app.getMailListController();
      var toolbar = controller.getCurrentToolbar();
      if (toolbar)
      {
         //When the user forwards emails as eml with attachments, there will be a toolbar, but that one
         //has no getButton method... resulting in a pop-up where the attachments cannot be clicked
         try {
            var getButton = toolbar.getButton('List_UnsubscribeZimletButton')
         } catch (err) {}
         
         if ((getButton) && (!getButton.isDisposed() ))
         {
            //button already defined
         }
         else
         {
            //create app button
            var buttonArgs = {
               text    : 'Unsubscribe',
               tooltip: 'Unsubscribe from mailing',
               index: 8, //position of the button
               image: "zimbraicon", //icon
               enabled: true //default if undefined is true, defining it for documentation purpose
            };
            var button = toolbar.createOp("List_UnsubscribeZimletButton", buttonArgs);
            button.addSelectionListener(new AjxListener(this, this._handleList_UnsubscribeZimletMenuClick, controller));
         }
      }      
   } catch (err) {}
   
   //Avoid type errors if no attrs of no List-Unsubscribe
   try{
      var attrs = msg.attrs['List-Unsubscribe'];
   } catch (err) {}
   
   //We have a List-Unsubscrib header
   if (attrs)
   {
      var listUnsubscribe = msg.attrs['List-Unsubscribe'];

      var httpRegEx = new RegExp('(\<)(http.*?)(\>)');
      var listUnsubscribeHttp = listUnsubscribe.match(httpRegEx)

      var mailtoRegEx = new RegExp('(\<)(mailto.*?)(\>)');
      var listUnsubscribemailto = listUnsubscribe.match(mailtoRegEx)
      
      //Enable/disable the Unsubscribe button
      if (listUnsubscribemailto || listUnsubscribeHttp) 
      {      
         //The code below is already default behavior in Zimbra
         //var button = toolbar.getButton('List_UnsubscribeZimletButton');  
         //button.setEnabled(true); 
      }
      else
      {
         //This is actually an error, since there was some Unsubscribe header, but we could not regex it
         var button = toolbar.getButton('List_UnsubscribeZimletButton');  
         button.setEnabled(false); 
         console.log("List_UnsubscribeZimlet: Warning regular expression failed to get http/mailto please report this bug at https://github.com/Zimbra-Community/list-unsubscribe-zimlet/issues")
      }
   }  
   else
   {
      if (toolbar)
      {
         //When the user forwards emails as eml with attachments, there will be a toolbar, but that one
         //has no getButton method... resulting in a pop-up where the attachments cannot be clicked
         try {
            var getButton = toolbar.getButton('List_UnsubscribeZimletButton')
         } catch (err) {}
         
         if (getButton)
         {
            getButton.dispose();
            getButton.setEnabled(false);    
         }
      }
   }   
}
