// load in chapter
const savePoint = localStorage.getItem("savedChapter");

if (savePoint != null) {
    curChapter = savePoint;
} else {
    curChapter = "START";
}
console.log("savepoint: " + curChapter);

    // load in variables
    GAMEVARS = Object.assign({}, localStorage.getObject("allVariables"));

    console.log("variables: ")
    console.log(GAMEVARS);

// follow the BG_ pattern when naming backgrounds
// though the filename itself doesn't have to match

const BGs = {

    BG_1b:"images/1b.png",
    BG_CLEAR:"images/BG_CLEAR.png",
    BG_TITLE:"images/BG_TITLE.png",
    BG_SNOW:"images/BG_0.png",
    BG_BAD:"images/BG_BAD.png",
    BG_SKI:"images/1.png",
    BG_POLE:"images/2.png",
    BG_3:"images/BG_3.png",
    BG_4:"images/BG_4.png",
    BG_5:"images/BG_5.png",
    BG_6:"images/BG_6.png",
    BG_7:"images/BG_7.png",
    BG_7b:"images/BG_7b.png",
    BG_BONE:"images/BG_BONE.png",
    BG_BONE2:"images/BG_BONE2.png",
    BG_BONE2b:"images/BG_BONE2b.png",
    BG_FEET:"images/BG_FEET.png",
    BG_FEETb:"images/BG_FEETb.png",
    BG_GAY:"images/BG_GAY.png",
    BG_GAY2:"images/BG_GAY2.png",
    BG_GAY3:"images/BG_GAY3.png",
    BG_PC:"images/BG_PC.png",
    BG_PC2:"images/BG_PC2.png",
    BG_PC3:"images/BG_PC3.png",
    BG_PC4:"images/BG_PC4.png",
    BG_PC5:"images/BG_PC5.png",
    BG_ROOM:"images/BG_ROOM.png",
    BG_ROOM2:"images/BG_ROOM2.png",
    BG_ROOM3:"images/BG_ROOM3.png",
    BG_ROOM4:"images/BG_ROOM4.png",
    BG_0:"images/BG_0.png",
    BG_0b:"images/BG_0b.png",
    BG_STATION:"images/BG_STATION.png",
    BG_END:"images/BG_END.png"
};

const FGs = {

    FG_BLANK:"images/blank.png",
    FG_MIASMA0:"images/FG_MIASMA0.png",
    FG_MIASMA1:"images/FG_MIASMA1.png",
    FG_MIASMA2:"images/FG_MIASMA2.png",
    FG_MIASMA3:"images/FG_MIASMA3.png",
    FG_MIASMA4:"images/FG_MIASMA4.png",
    FG_MIASMA5:"images/FG_MIASMA5.png",
    FG_MIASMA6:"images/FG_MIASMA6.png",
    FG_MIASMA7:"images/FG_MIASMA7.png",
    FG_MIASMA8:"images/FG_MIASMA8.png",
    FG_NOTICE1:"images/FG_NOTICE1.png"

};

// use MUS_ for looping background music
// max one music track playing at once
// and SFX_ for oneshot sound effects that can play on top

const MUSIC = {

    SFX_TITLE:"music/SFX_TITLE.mp3",
    SFX_TEXT: "music/SFX_TEXT.mp3",
    SFX_SKI: "music/SFX_SKI.mp3",
    SFX_SNOW: "music/SFX_SNOW.mp3",
    SFX_WIND: "music/SFX_WIND.mp3",
    SFX_MIASMA: "music/SFX_MIASMA.mp3",
    SFX_LOG: "music/SFX_LOG.mp3",
    MUS_2: "music/MUS_2.mp3",
    MUS_3: "music/MUS_3.mp3",
    MUS_4: "music/MUS_4.mp3",
    MUS_5: "music/MUS_5.mp3",
    MUS_INTRO: "music/MUS_INTRO.mp3",
    MUS_PC: "music/MUS_PC.mp3",
    MUS_SILENCE: "music/MUS_SILENCE.mp3",
    MUS_READ: "music/MUS_READ.mp3"

};

const SPEAKERS = {

  A: "abbi",
  S: "estelle"

};
