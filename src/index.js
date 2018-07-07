const request = require('request');
const fs = require('fs');

var _baseUrl = 'https://www.stumbleupon.com/api/v2_0';

var user = 'USER_NAME';
var userid = 'USER_ID';
var limit = 10;
var likesArr = [];

// Make directory for saved likes
var savedDataDir = "./likes";
if(!fs.existsSync(savedDataDir)){
  fs.mkdirSync(savedDataDir);
}

// Get those likes
getLikes(0);

function getLikes(offset){
  //console.log('offset: ' + offset);
  // Request to StumbleUpon returns a JSON object containing likes
  request.get( _baseUrl + '/history/'+ userid + '/likes/all?offset='+ offset + '&limit=' + limit + '&userid=' + userid + '&listId=likes', function(error, response, body){
    var bodyObj = JSON.parse(body);
    // Filter through the JSON object to get the title of the like and the url
    bodyObj.likes.values.forEach(function(likeObj){
      likesArr.push([likeObj.title, likeObj.url]);
    });
    console.log(likesArr.length);
    // StumbleUpon will only return 10-30 likes at a time so repeat until all likes are recieved (because of the infinite scroll when you look at all your likes on StumbleUpons)
    if(likesArr.length < bodyObj.likes._total){
      getLikes(likesArr.length);
    } else {
      // Once all likes recieved write them to a likes.txt file
      writeStreamToFile(savedDataDir + '/likes.txt', likesArr);
    }
  });
};

function writeStreamToFile(filePath, array){
  console.log("Writing likes to file...");
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
