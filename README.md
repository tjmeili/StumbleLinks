# StumbleLinks
Saves StumbleUpon likes

## Things You'll Need
* Your Username
* Your User ID

> ### To find your user ID:
> * Go to your profile on the StumbleUpon website
> * Right click on the page, then click Inspect or press Crtl+Shift+I (Chrome) to view DevTools
> * In the DevTools window click on the Network tab, then refresh the StumbleUpon webpage. A bunch of stuff should load.
> * The first one should be "profile". Click on it then go to the Cookies tab. Your ID should be there near the bottom (userid)
>
> If "profile" didn't show up, refresh your page again or look for ones in the form of:
>   - list?id=YOUR_ID
>   - interests?userid=YOUR_ID
> These were about 30 requests down for me.

## How To Use
You'll need Node.js
* Edit index.js and fill in your username and id
* Open command prompt or other terminal
* Go to the src folder
* enter `npm install`
* Once that's done, run the script by entering `node index.js`

A folder "likes" should be created in the src directory that contains a likes.txt file with your likes.
