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
    carddav.getContact({
            url: '<DaviCal-Server>/caldav.php/user/addressbook/',
            user: 'user',
            passwd: 'secret',
            error: function(jqXHR, textStatus, errorThrown) {
                /* here handle error exception */
            },
            success: function(vcard) {
                /* here your code */
            }
        });
});
</script>
```

## Documentation
_(Coming soon)_

## Examples
_(Coming soon)_

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt](https://github.com/cowboy/grunt).

_Also, please don't edit files in the "dist" subdirectory as they are generated via grunt. You'll find source code in the "src" subdirectory!_

## Release History
_(Nothing yet)_

## License
Copyright (c) 2012 John Fischer  
Licensed under the MIT, GPL licenses.
