VIDEOTOME: ADV

a less micro narrative engine by freya campbell

version 0.5

    ~ABOUT~

Videotome:ADV is a small narrative engine for makine web based games that resemble 90s ADV games.

    ~FILE GUIDE~

code.js - this is the core engine for the game.
story.txt - this is where you will write your script. an example script is provided.
assets.js - set up your images and music here
stylesheet.css - edit the CSS here
index.html - this is the page that will update and display your game.
/images - stick your background images in here.
/music - stick your music and sound effects here
favicon.ico - replace this with your desired game icon
+fonts

    ~HOW TO USE~

Videotome:ADV is based around a simple scripting language that I designed to be able to write as fast as possible.
In the dialogue window, the game can display three lines at once, each new line moving the last one up a line.
You can press spacebar or enter to progress text, or else press a to enable autoplay (autoplay status is visible in the top right of the dialogue box).
Press L or click the history icon to bring up a message history.
Choices can be navigated using the top row of numbers.

story.txt contains the entire game, separated into blocks by ###.
The format of each block must be the following:

FirstLineIdentifier
text here
(as much text as you want)
###

Blocks can end with a GOTO, CHECK, or CHOICE as their final line before ###, which will redirect them to another block based on the FirstLineIdentifier.
If a block does not end with any of the above, the game will end and loop back to the beginning.

Each line of text can be plain text, or else can have any number of commands before the text to display.
Non-printed commands are separated from the text by " - ", being space hyphen space.
The following commands are available:

    C! - 
replace C with a letter or other identifier as set up in assets.js. This will then display the speaker's name & associated colour to the left of the dialogue, and wrap the dialogue in quotes . 
The example game has three set up: miku (M!), nancy (N!), and Narrator as the fallback. Narrator will not display a speaker's name.
To set up extra characters, edit the identifier and name in assets.js, then add the appropriate css class to stylesheet.css. 

    CLEARSCREEN - 
This will totally clear the dialogue rows instead of moving the last two lines displayed up into history.

    BG_imagename - 
Displays a background image. Replace imagename with the reference you set up in assets.js.

    FG_imagename - 
Displays a foreground image. Replace imagename with the reference you set up in assets.js.

    MUS_musicname - 
Starts or resumes a looping background music. Replace musicname with the reference you set up in assets.js.

    SFX_sfxname - 
Plays a one-shot sound effect. Replace sfxname with the reference you set up in assets.js. Note that entries prefixed MUS_ will play as background music and SFX_ will play as oneshots.

    CHOICE#:[text]:target - 
Displays a choice for each # in the top right, with "text" as the choice text and the FirstLineIdentifier of the block to go to as "target".
Choices are clickable or else can be accessed via associated top row number button.
Choices are *not* a blocker, and the story can continue without clicking them.

    REMOVE:[choicetext]
Removes a choice from the choice menu.

    STATUS:[statustext]
Shows the status window with the text provided. Note that this supports HTML, so you can put line breaks in with <b> and similar.

    CLEARSTATUS
Hides the status window.

    SET:variable:value - 
Sets a user-definable variable to a value.

    CHECK:variable1:variable2:operator:outcome1:outcome2 - 
This one's a little more complex. Variable1 and Variable2 can be either strings/numbers, or else a reference to a user-defined variable set earlier in the script.
operator is the logical operator you want to check, picked from the below list:
gt : greater than
lt : less than
eq : equal to (used for checking strings)
gte : greater than or equal to
lte : less than or equal to
Outcome1 and Outcome2 are the first line identifiers of the chapter you wish to be redirected to.

    GOTO:target
Redirects the player to the Block whose FirstLineIdentifier equals target.

 FUNC:[javascript]
Utility command to execute any bespoke javascript code as written by the user. Use at own risk.

You can chain commands together on one line like so:

    BG_imagename - non formatted text goes here
    CLEARSCREEN BG_imagename MUS_musicname SFX_sfxname SET:variable:value CHOICE1:Yes:Block3 CHOICE2:No:Block4 CHOICE3:Idk:Block5 C! - Your line of dialogue spoken by C goes here

You must always include " - " as the final part of any command block, or else the commands will not be cleared from the printed text.
Also, if you are using a character speaking tag, this must be the final command.

	MODE:mode - 
Switches the visual display between several different modes. Replace mode with one of the below:

standard - borders around text box and BG, tiled background
borderless - removes the borders on the BG and text box.
fullBG - makes the BG fullscreen
borderlessfullBG - makes the BG fullscreen and removes the text box border.

It is recommended you call these in conjunction with a BG command, else the images may display in unexpected ways.


    ~OFFLINE TESTING~

Due to CORS restrictions for browser based engines like this, to test play a videotome game offline you will need to run it on a server.
I find the easiest method is to launch a python server.

Right Shift + Right Click in your game directory
Open PowerShell window here
Type "python -m http.server 8000" and press enter
Open your web browser and navigate to "localhost:8000/"

Any other method of running a local server will also suffice, as will uploading builds to your hosting platform of choice (e.g. itch.io) and testing from there.


    ~RELEASING~

Make sure index.html is still called the same thing.
Zip up your whole game into a .zip file and upload to your game hosting provider of choice.
Alternatively you could copy the directory structure verbatim onto a bespoke website if you really wanted to.

   ~CREDITS~

Videotome:ADV is by Freya Campbell (twitter.com/spdrcstl, communistsister.itch.io). 

Videotome:ADV is released free of charge under a CC BY-NC-ND Licence:
Attribution-NonCommercial-ShareAlike

This license lets others remix, adapt, and build upon your work non-commercially, as long as they credit you and license their new creations under the identical terms. 

CRT screen effect based on code from http://aleclownes.com/2017/02/01/crt-display.html
New line sound contains a sample from https://freesound.org/people/EminYILDIRIM/sounds/536108/

Additionally, if you are a terf or tory, you may not use this engine in any way shape or form, and I instead request you go fuck yourself.

    ~CHANGELIST~

v0.1 - made the game
v0.2 - I forgot
v0.3 - Added Statuses, updated Choice text to allow spaces
v0.4 - bug fix i forgot
v0.5 - added message history and FUNC command
