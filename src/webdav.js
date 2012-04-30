(function(global, $, btoa, undefined) {
    "use strict";
  
    var version = '0.0.1',
    timeout = 30000,
    webdav = {},
    optionsDefaults = {
        cache: false,
        crossDomain: true,
        async: true,
        xhrFields: {
            withCredentials: false
        },
        timeout: timeout,
        contentType: 'text/xml; charset=utf-8',
        processData: true,
        dataType: 'xml'
    };
     
    function basicAuth(user, password) {
        return 'Basic ' + btoa(user + ':' + password);
    }
    
    function setHeader(req, user, passwd, depth) {
        req.setRequestHeader('Authorization', basicAuth(user, passwd));
	req.setRequestHeader('X-client', 'webdav.js Client ' + version);
	req.setRequestHeader('Depth', depth ? '0' : depth);
    }
    
    webdav.version = version;
    
    webdav.propFind = function(options) {
       
	options = $.extend( {} , optionsDefaults , options );
       
        $.ajax({
            type: 'PROPFIND',
            url: options.url,
            data: '<?xml version="1.0" encoding="utf-8"?><D:propfind xmlns:D="DAV:">' + options.data + '</D:propfind>',
            beforeSend: function( req ) {
                setHeader(req, options.user, options.passwd);
            },
            error: function( jqXHR, textStatus, errorThrown ) {
                if (options.error) {
                    options.error(jqXHR, textStatus, errorThrown);
		}
                return false;
            },
            complete: function( xml, textStatus ) {
                if (options.success) {
                    options.success(xml, textStatus);
                }
            }
        });
    };
    
    webdav.report = function(options) {
        
        options = $.extend( {} , optionsDefaults , options );
        
        $.ajax({
            type: 'REPORT',
            url: options.url,
            data: options.realData || '<?xml version="1.0" encoding="utf-8"?><D:sync-collection xmlns:D="DAV:">'+ options.data + '</D:sync-collection>',
            beforeSend: function( req ) {
                setHeader(req, options.user, options.passwd);
            },
            error: function( jqXHR, textStatus, errorThrown ) {
                if (options.error) {
                    options.error(jqXHR, textStatus, errorThrown);
                }
                return false;
            },
            complete: function( xml, textStatus ) {
                if (options.success) {
                    options.success(xml, textStatus);
                }
            }
        });
    };
    
    global.webdav = webdav;
    
}(this, jQuery, this.btoa));
