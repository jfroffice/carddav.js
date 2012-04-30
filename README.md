# CardDav JS

jQuery API to access read-only CardDav Server (like DaviCal)

## Getting Started
Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/jfroffice/carddav.js/master/carddav.min.js
[max]: https://raw.github.com/jfroffice/carddav.js/master/carddav.js

In your web page:

```html
<script src="jquery.js"></script>
<script src="cardav.js.min.js"></script>
<script>
jQuery(function($) {
    $.carddav.get({
            url: '<DaviCal-Server>/caldav.php/user/addressbook/',
            user: 'user',
            passwd: 'secret',
            error: function(jqXHR, textStatus, errorThrown) {
                /* here handle error exception */
            },          
            success: function(vcardArray) {
                /* here your code */
            }
        });
});
</script>
```

## Documentation

__vcardArray__ is an Array of __vcard__ Object.

```html
vcard = {
    url: '/caldav.php/user/addressbook/UUID.vcf',
    vcard: {
        bday: Object,
        categories: Array[1],
        email: Object,
        fn: String,
        n: String,
        note: String,
        rev: String,
        tel: Object,
        uid: String,
        version: String,
        /* some other properties */
    }
} 
```

## Release History

v0.0.1: initial revision, only support getting carddav values

## License
Copyright (c) 2012 John Fischer  
Licensed under the MIT, GPL licenses.
