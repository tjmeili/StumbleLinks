const request = require('request');
const fs = require('fs');

var user = 'USERNAME';
var userid = 'USER_ID';

var _baseUrl = 'https://www.stumbleupon.com/api/v2_0';

var likesArr = [];
var listsObj = {};

function makeDirectory(dir){
  if(!fs.existsSync(dir)){
    fs.mkdirSync(dir);
  }
};

var _baseDir = './saved-stumble-data';
makeDirectory(_baseDir);
makeDirectory(_baseDir + '/likes');
makeDirectory(_baseDir + '/lists');

getLikes(0);
getLists(0);

// Get likes
function getLikes(offset){
  //console.log('offset: ' + offset);
  // Request to StumbleUpon returns a JSON object containing likes
  request.get( _baseUrl + '/history/'+ userid + '/likes/all?userid=' + userid + '&limit=30&offset=' + offset, function(error, response, body){
    var bodyObj = JSON.parse(body);
    // Filter through the JSON object to get the title of the like and the url
    bodyObj.likes.values.forEach(function(likeObj){
      likesArr.push([likeObj.title, likeObj.url]);
    });
    console.log('Likes:\t' + likesArr.length + ' of ' + bodyObj.likes._total);
    // StumbleUpon will only return 10-30 likes at a time so repeat until all likes are recieved (because of the infinite scroll when you look at all your likes on StumbleUpons)
    if(likesArr.length < bodyObj.likes._total){
      getLikes(likesArr.length);
    } else {
      console.log('Writing likes to file...');
      writeStreamToFile(_baseDir + '/likes/likes.txt', likesArr);
    }
  });
};

var curNumLists = 0;
// Get lists
function getLists(offset) {
  request.get(_baseUrl + '/user/' + userid + '/lists?userid=' + userid + '&limit=30&offset=' + offset + '&sorted=true', function (error, response, body) {
    var bodyObj = JSON.parse(body);
    console.log('Total number of lists: ' + bodyObj.lists._total);
    // get the items in each list
    bodyObj.lists.values.forEach(function (list) {
      var listName = list.name;
      listsObj.listName = {name: listName, values: []};
      console.log(listName);
      getListItems(list, 0);
    });
    // repeat until all lists are obtained
    curNumLists += bodyObj.lists.length;
    console.log('Current number of lists: ' + curNumLists);
    if(curNumLists < bodyObj.lists._total){
      getLists(curNumLists);
    }
  });
};

// Get the items in the given list
function getListItems(list, offset) {
  var listId = list.id;
  var listName = list.name;
  var url = 'https://www.stumbleupon.com/api/v2_0/list/'+ listId + '/items?listId=' + listId + '&limit=30&offset=' + offset + '&userid=' + userid;
  request.get(url, function (error, response, body) {
    var bodyObj = JSON.parse(body);
    bodyObj.items.values.forEach(function (item) {
      listsObj.listName.values.push([item.url.title, item.url.url]);
    });
    console.log('\n' + listName);
    console.log('response items:    ' + bodyObj.items.values.length);
    console.log('total list items:  ' + bodyObj.items._total);
    console.log('current items:     ' + listsObj.listName.values.length);
    if(listsObj.listName.values.length < bodyObj.items._total){
      getListItems(list, listsObj.listName.values.length);
    } else {
      console.log('Writing ' + listName + ' to file...');
      writeStreamToFile( _baseDir + '/lists/' + listName + '.txt', listsObj.listName.values);
    }
  });
};

function writeStreamToFile(filePath, array){
  var file = fs.createWriteStream(filePath);
  file.on('error', function(err) {
    console.error(err);
  });
  // Loop through each like
  for(var i = 0; i < array.length; i++) {
    file.write(i +". " + array[i].join(" ") + "\n"); // if you want to change the formatting, change this. (array[i][0] = title, array[i][1] = url)
  }
  file.end();
  console.log("Done.");
};
