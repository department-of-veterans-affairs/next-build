we get a bunch of json data from the drupal-powered cms using the jsonapi module and friends.

[content build api](https://content-build-medc0xjkxm4jmpzxl3tfbcs7qcddsivh.ci.cms.va.gov/jsonapi/) has a list of
endpoints

a [news story node](https://content-build-medc0xjkxm4jmpzxl3tfbcs7qcddsivh.ci.cms.va.gov/jsonapi/node/news_story) has a
lot of data, and most of the data we need for each field, but not all. some are entity references to other pieces of
content. ctrl+f for `field_author` and see this:

```json
"field_author": {
"data": {
"type": "node--person_profile",
"id": "c76037be-ebb0-4338-9b31-973a76958929",
"meta": {
"drupal_internal__target_id": 378
}
},
"links": {
"related": {
"href": "https://content-build-medc0xjkxm4jmpzxl3tfbcs7qcddsivh.ci.cms.va.gov/jsonapi/node/news_story/bb4dcfc1-736b-4a9e-aa48-23c2dd4a4980/field_author?resourceVersion=id%3A17354"
},
"self": {
"href": "https://content-build-medc0xjkxm4jmpzxl3tfbcs7qcddsivh.ci.cms.va.gov/jsonapi/node/news_story/bb4dcfc1-736b-4a9e-aa48-23c2dd4a4980/relationships/field_author?resourceVersion=id%3A17354"
}
}
},
```

apologies for the formatting on that json blob, prettier is not a fan.

to include fields with the reference node data, add `?include=` to your endpoint and the field name. this data will be
included in the response in an array under the `included:` key. when you use the drupalClient the data will be combined
appropriately.

this next-drupal response gets formatted further inside of `data/queries`

in this way we can receive all the necessary data from the cms and deliver exactly what the components and pages expect,
without being tied explicitly to drupal structure. think of the `formatter()` as the glue layer between api and web