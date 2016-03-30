[![Build Status](https://travis-ci.org/CMaylone/hello-giphy.svg?branch=master)](https://travis-ci.org/CMaylone/hello-giphy)

# Hello-Giphy

A small sample project that uses the Giphy API to return some random cat gifs.

## Getting Started

### Local

To run this project locally:

Have a MongoDB instance running.

Clone this repo

Install dependencies
```bash
$ npm install
```

Start the app
```bash
$ npm start
```

### Heroku

This project exists live on Heroku:
[Live](https://limitless-bayou-38042.herokuapp.com/)

## Endpoints 

### Create a new user

**Request**

`POST` /api/1/user

**Parameters**

*none*

**Body**

| Attribute | Description | Type |
|-----------|-------------|------|
| username | Unique name of user account | `String` |
| password | Super secret password used for authentication | `String` 

#### Live example
```bash
$ curl --data "username=test1&password=test1" https://limitless-bayou-38042.herokuapp.com/api/1/user
```

### Get a random cat gif with tags

**Request**

`GET` /api/1/giphy

**Parameters**

| Attribute | Description | Type |
|-----------|-------------|------|
| tags | Tag used to find cat gifs. This parameter can be defined multiple times. | `String` |


#### Live example 
```bash
$ curl -u myUsername:myPassowrd https://limitless-bayou-38042.herokuapp.com/api/1/giphy?tags=tank&tags=fuzzy
```

## Running tests

```bash
npm test
```
