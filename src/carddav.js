(function($, webdav, undefined) {
    "use strict";

    var version = '0.2.0';

    function parseVCard(_input) {

        var regexps = {
              simple: /^(version|fn|n|title|org|note|uid|rev|categories)\:(.+)$/i,
              complex: /^([^\:\;]+);([^\:]+)\:(.+)$/,
              key: /item\d{1,2}\./,
              properties: /((type=)?(.+);?)+/
            },
            fields = {},
            lines = _input.split('\n'),
            commonName = {},
            formatValue = {
                categories: function(val) {
                    return val.split(',');
                },
                Name: function(val) {
                    return val.split(';');
                }
            };

        var line, results, key, value, properties, type;

        for (var n in lines) {
            if (lines.hasOwnProperty(n)) {
              line = lines[n];

              if(regexps.simple.test(line)) {

                  results = line.match(regexps.simple);
                  key = results[1].toLowerCase();
                  value = results[2];

                  fields[commonName[key] || key ] = formatValue[key] ? formatValue[key](value) : value;

              } else if(regexps.complex.test(line)) {

                  results = line.match(regexps.complex);
                  key = results[1].replace(regexps.key, '').toLowerCase();

                  properties = results[2].split(';');
                  type = properties.pop() || 'default';
                  type = type.toLowerCase();

                  value = results[3];
                  value = /;/.test(value) ? [value.split(';')] : value;

                  fields[key] = fields[key] || {};
                  fields[key][type] = fields[key][type] || [];
                  fields[key][type] = fields[key][type].concat(value);
               }
            }
        }

        return fields;
    }

    function doAddressBook(options, data, cbError, cb) {
        webdav.report({
            url: options.url,
            user: options.user,
            passwd: options.passwd,
            realData: data,
            error: function(jqXHR, textStatus, errorThrown) {
                cbError && cbError(jqXHR, textStatus, errorThrown);
            },
            success: function(xml, textStatus) {
                if(textStatus !== 'success' || !options.success) {
                    return false;
                }

                var vcardArray = [];
                $(xml.responseXML).find('response').each(function() {
                    var url = $(this).find('href').text();
                    $(this).find("prop").children().each(function(i) {
                        if (i === 1) {
                            vcardArray.push({
                               url: url,
                               vcard: parseVCard($(this).text())
                            });
                        }
                    });
                });

                cb && cb(vcardArray);
            }
        });
    }

    function createDataRequest(xml) {

        var data = '<?xml version="1.0" encoding="utf-8"?><E:addressbook-multiget xmlns:E="urn:ietf:params:xml:ns:carddav"><A:prop xmlns:A="DAV:"><A:getetag/><E:address-data/></A:prop>';

        $(xml.responseXML).find('href').each(function() {
            data += '<A:href xmlns:A="DAV:">' + $(this).text() + '</A:href>';
        });

        return data + '</E:addressbook-multiget>';
    }

    $.carddav = {
        version: version,
        get: function(options) {

            webdav.report({
                url: options.url,
                user: options.user,
                passwd: options.passwd,
                data: '<D:sync-token/><D:prop><D:getcontenttype/></D:prop>',
                error: function(jqXHR, textStatus, errorThrown) {
                    if (options.error) {
                        options.error(jqXHR, textStatus, errorThrown);
                    }
                },
                success: function(xml, textStatus) {
                    if(textStatus !== 'success' || !options.success) {
                        return false;
                    }
                    doAddressBook(options, createDataRequest(xml), options.error, options.success);
                }
            });
        }
    };

}(jQuery, this.webdav));
