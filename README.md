
[![Build Status](https://travis-ci.org/ofidj/fidj.svg?branch=master)](https://travis-ci.org/ofidj/fidj) 
[![NPM version](https://badge.fury.io/js/fidj.svg)](https://www.npmjs.com/package/fidj) 
[![Bower version](https://badge.fury.io/bo/fidj.svg)](https://libraries.io/bower/fidj)
[![Package Quality](http://npm.packagequality.com/badge/fidj.png)](http://packagequality.com/#?package=fidj)

> [Install](https://github.com/ofidj/fidj#install) | [APIs](https://ofidj.github.io/fidj) | [Support](https://github.com/ofidj/fidj#develop) | [Thanks!](https://github.com/ofidj/fidj#thanks)


# 1) You're an app builder
Thank you for building great app. 
Fidj.ovh will support you to manager auth, session storage.

### Easiest way

From scratch, with *yeoman* like described here : https://github.com/ofidj/fidj/wiki/How-build-a-freemium-angular-mobile-application-in-10-minutes
```bash
yo fidj
``` 

### Normal way

Install with NPM :
```bash
npm install fidj --save
```
Or Bower :
```bash
bower install fidj
```

Then look at APIs and integration patterns described in [https://ofidj.github.io/fidj/](https://ofidj.github.io/fidj/)
- with [Angular](https://ofidj.github.io/fidj/classes/fidjservice.html)
- with pure js

or in brief (if your familiar with promise) :
```js
// init your app
fidjService.init('FidjId from https://fidj')
.then(function() {
    // login (auto register) your user
    return fidjService.login('login', 'password');
})
.then(function() {
    // synchronise your session data
    return fidjService.sync();
})
.then(function() {
    // put your data into session, 
    // it will be available everywhere but also offline
    return fidjService.put({data : 'my session'});
})
//... sync, get data and so on
.catch(function(err) {
    alert(err);
    fidjService.logout();
});

```


# 2) You're a fidj dev
Thank you for your support !

Fidj.ovh is an Open Source project - we need you to provide great tools to great apps.

## Develop

Fork the project
```bash
git clone https://github.com/ofidj/fidj.git
cd fidj
npm install
```
and pull request ...

### Testing

With npm :
```bash
$ npm test
```

With a swagger UI :  
https://app.swaggerhub.com/api/mlefree/fidj-io_rest_api/


# Thanks

[@fidj](https://fidj.ovh) @mat_cloud 
 
