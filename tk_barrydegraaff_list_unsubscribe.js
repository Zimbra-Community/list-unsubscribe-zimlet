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
 */
var List_UnsubscribeZimlet = tk_barrydegraaff_list_unsubscribe_HandlerObject;
ZmArchiveZimlet.OP_UNSUBSCRIBE = "OP_UNSUBSCRIBE";
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

/*
 *
 */
List_UnsubscribeZimlet.prototype.initializeToolbar =
function(app, toolbar, controller, viewId) {
   console.log(toolbar);
   // bug fix #7192 - disable detach toolbar button
   toolbar.enable(ZmOperation.DETACH_COMPOSE, false);   
   if(viewId.indexOf("CLV-main") >=0){
      if (toolbar.getButton('List_UnsubscribeZimletButton'))
      {
         //button already defined
         return;
      }
      var buttonArgs = {
         text    : 'Unsubscribe',
         tooltip: 'Unsubscribe from mailing',
         index: 8, //position of the button
         image: "zimbraicon", //icon
         enabled: false
      };
      var button = toolbar.createOp("List_UnsubscribeZimletButton", buttonArgs);
      button.addSelectionListener(new AjxListener(this, this._handleList_UnsubscribeZimletMenuClick, controller));
      //button.setEnabled(false);
   }   
};

List_UnsubscribeZimlet.prototype._handleList_UnsubscribeZimletMenuClick = function(controller) {
	var items = controller.getSelection();
	if(!items instanceof Array) {
		this._showOneClickDlg("");
		return;
	}
	var type = items[0].type;
	var msg;
	if (type == ZmId.ITEM_CONV) {
		msg = items[0].getFirstHotMsg();
	} else if(type == ZmId.ITEM_MSG) {
		msg = items[0];
	}

   try
   {
      if(msg.attrs['List-Unsubscribe'].indexOf('http') > 0)
      {
         var listUnsubscribe = msg.attrs['List-Unsubscribe'];

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
            window.location='?view=compose&to='+listUnsubscribemailto[0].replace(">","").replace("<","").replace("mailto:","").replace("?","&").replace("+","%2B");
         }
         else if (listUnsubscribeHttp) 
         {      
            window.open(listUnsubscribeHttp[0].replace(">","").replace("<",""));
         }
      }   
   } catch (err)
   {
     // List-Unsubscribe header not found  
   }
};

List_UnsubscribeZimlet.prototype.onMsgView = function (msg, oldMsg, msgView) {  
   console.log(appCtxt.getAppViewMgr().getCurrentViewId());
   try
   {
      if(msg.attrs['List-Unsubscribe'])
      {
         var listUnsubscribe = msg.attrs['List-Unsubscribe'];

         var httpRegEx = new RegExp('(\<)(http.*?)(\>)');
         var listUnsubscribeHttp = listUnsubscribe.match(httpRegEx)

         var mailtoRegEx = new RegExp('(\<)(mailto.*?)(\>)');
         var listUnsubscribemailto = listUnsubscribe.match(mailtoRegEx)
         
         if (listUnsubscribemailto || listUnsubscribeHttp) 
         {      
            console.log('true');
         }
         else
         {
            console.log('fasle');
         }
      }  
      else
      {
         console.log('fasle2');
      } 
   } catch (err)
   {
     // List-Unsubscribe header not found  
   }
}
