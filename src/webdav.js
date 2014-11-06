var webdav = (function($, btoa, undefined) {
    "use strict";

    var version = '0.2.0',
        optionsDefaults = {
            cache: false,
            crossDomain: true,
            async: true,
            xhrFields: {
                withCredentials: false
            },
            timeout: 30000,
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

    return {
        propFind: function(options) {

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
        },
        report: function(options) {

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
        }
    };

}(jQuery, this.btoa));
