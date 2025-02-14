/*
 __   __  __   ____   _____   ___   ______   ___   __   __  _____ 
|  | |  ||  | |    \ |     | /   \ |      | /   \ |  |_|  ||     |
|  | |  ||  | |  _  ||   __||  _  ||_    _||  _  ||       ||  ___|
|  |_|  ||  | | | | ||  |__ | | | |  |  |  | | | ||       || |___ 
|       ||  | | |_| ||   __|| |_| |  |  |  | |_| || || || ||  ___|
 |     | |  | |     ||  |__ |     |  |  |  |     || ||_|| || |___ 
  |___|  |__| |____/ |_____| \___/   |__|   \___/ |_|   |_||_____|


a micro narrative engine by freya campbell
comments or thanks to @spdrcstl or communistsister.itch.io
do not ask me for features

mods by @stanwixbuster / stanwixbuster.itch.io

*/



var current = 0;
var storyArray = {};
var chapters = {};
var chapterArray = null;
var goto = null;
var cameFromCheck = false;
var line = null;
var inputCooldown = false;
var cooldownLength = 300;
var clear = false;
var autoplay = false;
var autoplayTimer = null;
var wasAutoplay = false;
var background = "bg1";
var target = null;
var choice = {};
var outcome = {};
var target = 0;
var choiceStatus = false;
var listClick = 0;
const cache = {};
var GAMEVARS;
const commands = { 
    "gt": (a, b) => a > b,
    "lt": (a, b) => a < b,
    "eq": (a, b) => a == b,
    "gte": (a, b) => a >= b,
    "lte": (a, b) => a <= b 
};

var inMenu = false;

var pauseInput = true;

var currentSFX;
var currentMUS;
var autoplaySpeed = 30;
var autoplayLengthOffset = 50;

var gameplayMUSVolume = 1;
var gameplaySFXVolume = 1;

var funcDelay = false;
var delayedFunction = "";

// saving extensions
Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
}

Storage.prototype.getObject = function(key) {
    return JSON.parse(this.getItem(key));
}

// load story
async function getFile(fileURL) {
    let fileContent = await fetch(fileURL);
    fileContent = await fileContent.text();
    return fileContent;
};

function parseStory() {
    console.log('getting file');
    // Passing file url 
    getFile('story.txt').then(content =>{
    storyArray = content.trim().split("###");
    // console.log(storyArray);

        for(i=0; i<storyArray.length; i++) {
            target = storyArray[i];
            storyArray[i] = target.trim().split("\n");

         };
    
        // console.log(storyArray);

        for(i=0; i<storyArray.length; i++) {
           nextchapter = storyArray[i];
           chaptertitle = nextchapter[0].replace(/[\n\r]/g, '');           
           chaptercontent = nextchapter;
           chapters[chaptertitle] = chaptercontent;
        };

    }).catch(error =>{
        console.log(error);
    });

    setSettings();
    //console.log(chapters);
};


function readyStory () {
    document.getElementById('bg1').style.backgroundImage = "url('" + BGs["BG_TITLE"] +"')";
    console.log(BGs["BG_TITLE"]);
    // get the story from story.txt and turn it into array
    parseStory();
    makeMusicPlayers();
    cacheBGs();
    // console.log(storyArray);
    document.getElementById('fg1').src = FGs["FG_BLANK"];
    document.addEventListener('keydown', logKey);
    document.getElementById('choicewindow').classList.toggle('hidden');
    document.getElementById('statuswindow').classList.toggle('hidden');
    document.getElementById('messagelog').classList.toggle('hidden');
    document.getElementById('messagecontainer').classList.toggle('hidden');
    document.getElementById('dial').onclick = function() {
        if (!autoplay && !pauseInput && !inMenu) {progress();}
    };
    document.getElementById('settings').onclick = function() {
        toggleSettings();
    };

    let history =  document.getElementById('historybutton');
    history.addEventListener("click", (event) => {
        if (pauseInput) return;
        togglehistory();
        event.stopPropagation();
    });

    document.getElementById('autoplay').addEventListener("click", (event) => {
        if (pauseInput || inMenu) return;
        toggleAutoplay();
    });

    document.getElementById('reset').addEventListener("click", (event) => {
        if (pauseInput || inMenu) return;
        document.getElementById('reset-window').classList.remove("hidden");
        document.getElementById('reset').classList.add("menuOpen");
    });
    document.getElementById('reset-window-no').addEventListener("click", (event) => {
        document.getElementById('reset-window').classList.add("hidden");
        document.getElementById('reset').classList.remove("menuOpen");
    });
    document.getElementById('reset-window-yes').addEventListener("click", (event) => {
        clearSave();
        window.location.reload();
    });

    document.getElementById("curtain").addEventListener("click", (event) => {
        document.getElementById("curtain").style.opacity = "0";
        document.getElementById("curtain").style.pointerEvents = "none";
        pauseInput = false;
    });
    console.log('action!');
};

function clearSave() {
    localStorage.setItem("savedChapter", "START");
    localStorage.setObject("allVariables", {})
}

function setSettings() {
    const settingsMusicVolume  = document.getElementById("settingsMusicVolume");
    const settingsSFXVolume  = document.getElementById("settingsSFXVolume");

    const settingsAutoplaySpeed  = document.getElementById("settingsAutoplaySpeed");
    const settingsHistoryLength  = document.getElementById("settingsHistoryLength");

    // - initial settings
    // music volume
    if (localStorage.getItem("settingsMusicVolume") != null) {
        settingsMusicVolume.value = localStorage.getItem("settingsMusicVolume");
    } else {
        localStorage.setItem("settingsMusicVolume", 0.4)
    }

    // sfx volume
    if (localStorage.getItem("settingsSFXVolume") != null) {
        settingsSFXVolume.value = localStorage.getItem("settingsSFXVolume");
    } else {
        localStorage.setItem("settingsSFXVolume", 0.7)
    }

    // autoplay speed
    if (localStorage.getItem("settingsAutoplaySpeed") != null) {
        settingsAutoplaySpeed.value = sliderInvertValue("20", "120", localStorage.getItem("settingsAutoplaySpeed"));
    } else {
        localStorage.setItem("settingsAutoplaySpeed", 70)
    }

    // history length
    if (localStorage.getItem("settingsHistoryLength") != null) {
        settingsHistoryLength.value = localStorage.getItem("settingsHistoryLength");
    } else {
        localStorage.setItem("settingsHistoryLength", 20)
    }

    // - settings change
      settingsMusicVolume.oninput = function() {
        localStorage.setItem("settingsMusicVolume", settingsMusicVolume.value);
        if (currentMUS != null) {
            currentMUS.volume = settingsMusicVolume.value * gameplayMUSVolume;
        } 
      }
      
      settingsSFXVolume.oninput = function() {
        localStorage.setItem("settingsSFXVolume", settingsSFXVolume.value);
        if (currentSFX != null) {
            currentSFX.volume = settingsSFXVolume.value * gameplaySFXVolume;
        }
      }
            
      settingsAutoplaySpeed.oninput = function() {
        localStorage.setItem("settingsAutoplaySpeed", sliderInvertValue("20", "120", settingsAutoplaySpeed.value));
      }
      
      settingsHistoryLength.oninput = function() {
        localStorage.setItem("settingsHistoryLength", settingsHistoryLength.value);
      }
}


function logKey(e) {   
    if (pauseInput) return;
    
    switch(e.key) {
        case "l":
            togglehistory();
            break;
        case "L":
            togglehistory();
            break;
        case "a":
            toggleAutoplay();
            break;
        case "A":
            toggleAutoplay();
            break;
        case "s":
            toggleSettings();
            break;
        case "S":
            toggleSettings();
            break;
        case " ":
            if (!autoplay) {progress();}
            break;
        case "Enter":
            if (!autoplay) {progress();}
            break;
        default:
            target = e.keyCode - 49;
            // console.log(target);
            let list = document.getElementById('choicelist');
            
            let listClick = list.childNodes[target];
            // console.log(listClick);
            if (listClick !== undefined) {
                listClick.onclick();
            };
      } 
};

function toggleAutoplay() {
    if (autoplay == false) {
        clearTimeout(autoplayTimer);
        autoplay = true;

        autoplayTimer = setTimeout(progress, calcAutoSpeed());

        document.getElementById('autoplay').className = 'autoplay'; 
    } else {
        clearTimeout(autoplayTimer);
        autoplay = false;
        document.getElementById('autoplay').className = 'autoplayoff';
    };
}

function changeChapter(target) {
    curChapter = target;
    current = 0;
    choiceStatus = false;
    choice = {};

    let list = document.getElementById('choicelist');
    while (list.firstChild) {
            list.removeChild(list.firstChild);
        };
    if (cameFromCheck == false && autoplay == false) {
        progress();
    } else {
        cameFromCheck = false;
    };

    document.getElementById('choicewindow').classList.add('hidden');
//     document.getElementById('statuswindow').classList.add('hidden');

};

function displayStatus(text) {
    string = text;
    document.getElementById('statuswindow').innerHTML = text;
    document.getElementById('statuswindow').classList.remove('hidden');    
}


function progress() {
    if (inputCooldown) return;
    setTimeout(() => { inputCooldown = false }, cooldownLength);

    inputCooldown = true;

    if (choiceStatus == false && inMenu == false) {
        if (funcDelay) {
            var functionCall = new Function(delayedFunction[1]);
            functionCall();

            funcDelay = false;
            delayedFunction = "";
        }

        chapterArray = chapters[curChapter];

        try {
            if (current != chapterArray.length - 1) {
                current = current + 1;
                var str = chapterArray[current];
                // console.log(str);
                updateDialog (str);
            } else {
                console.log("tried to progress but this block has ended. are you waiting on a choice?");
            };
        } catch {
            throw "GOTO error: Are you trying to go to a chapter that does not exist?";
        }

    } else if (autoplay && inMenu) {
        autoplayTimer = setTimeout(progress, calcAutoSpeed());
    } else {
        console.log("failed to progress. are you reading the log or waiting on a choice?");
    };

};

function updateChoices(id, text, destination) {
    let list = document.getElementById('choicelist');
    let item = document.createElement("LI");
    item.setAttribute('id', text);
    item.innerHTML = "<a href='#' class='choiceListItem'>"+text+"</a>";
    item.onclick = function() {changeChapter(destination);};
    list.appendChild(item);
    // console.log(list.childNodes);   
};

function removeChoices(text) {

    choice = document.getElementById(text);
    try {
        choice.remove();
    } catch {
        throw "REMOVE error: Are there no choices on screen, or is the REMOVE tag's text not correct?";
    }
    //console.log("removed choice: " + text);   

    let choicelist = document.getElementById('choicelist');
    if (choicelist.childNodes.length < 1) {
            let choicewindow = document.getElementById('choicewindow');
            choicewindow.classList.add('hidden');
        };
};

function updateDialog(str) {

    let speaker = 'narration';

    const lookForChara = /(\w*)(?:!\ -\ )/;
    const lookForBG = /BG_\w*/;
    const lookForFG = /FG_\w*/;
    const lookForMUS = /MUS_\w*/;
    const lookForSFX = /SFX_\w*/;
    const lookForCLEAR = /CLEARSCREEN/;
    const lookForCLEARSTATUS = /CLEARSTATUS/;
    const lookForTrim = /(?<=\ \-\ ).*/;
    const lookForChoices = /(?:CHOICE)(\w*):\[([^:]*)\]:(\w*)/g;
    const lookForSubChoices = /(?:CHOICE)(\w*):\[([^:]*)\]:(\w*)/;
    const lookForRemoves = /(?:REMOVE):\[([^:]*)\]/g;
    const lookForSubRemoves = /(?:REMOVE):\[([^:]*)\]/;
    const lookForSet = /(?:SET):(\w*):(\w*)/g;
    const lookForSubSet = /(?:SET):(\w*):(\w*)/;
    const lookForCheck = /(?:CHECK):(\w*):(\w*):(\w*):(\w*):(\w*)/;
    const lookForGoto = /(?:GOTO):(\w*)/;
    const lookForMode = /(?:MODE):(\w*)/;
    const lookForStatus = /(?:STATUS):\[([^:]*)\]/;
    const lookForFunction = /(?:FUNC):\[([^:]*)\]/;
    const lookForMusVol = /(?:MUSVOL):\[([^:]*)\]/;
    const lookForSFXVol = /(?:SFXVOL):\[([^:]*)\]/;
    const lookForFunctionDelay = /(?:FUNCDELAY):\[([^:]*)\]/;
    const lookForTheme = /(?:THEME):\[([^:]*)\]/;
    const lookForOpp = /(?:OPP):(\w*):(\w*):(\w*)/g;
    const lookForSubOpp = /(?:OPP):(\w*):(\w*):(\w*)/;
    const lookForVariable = /\$(.*?)\$/;
    const lookForMIASMA = /MIASMALOG\w*/;

    // HERE BE TAGS TO CHECK

    // custom miasma log

    if (lookForMIASMA.test(str)) {
        console.log("MIASMA LOG FOUND")
        const log = document.querySelector('#MIASMA')
        const miasma = str.slice(0, -1)
        if (miasma == "MIASMALOG_1") {
            log.innerHTML = `
            <p>Hazard log: Miasma<br>Hazard level: D<p>
            <p>Author: Terese Hillevi<br>Chief Medical Officer<br>Amoninsula Research Facility<br>Date: 1581//103</p>
            <p>As with many other hazards in our care, the gaseous phenomena referred to as “Miasma” was initially discovered due to the urbanisation of previously uninhabited land. Upon discovery, a recovery team was sent to retrieve and transfer Miasma to our holding facility in Amoninsula. The purpose of this document is to collate all currently existing data on Miasma in order to further our understanding of it.</p>
            <p>Description:<br>The entity is described as an amorphous cloud of dark, but transparent fog that maintains an altitude of 1 to 2 metres. Based on current data, it can be inferred that Miasma is not sapient, and possesses very little (if any) will of its own. Through an as yet undetermined mechanism, Miasma appears to both seek out and subsume the heat of living organisms.</p>
            <p>Upon coming into contact with a suitable heat source, henceforth referred to as a “Host”, Miasma increases in viscosity as it forces a state change in the cell walls of its host to facilitate the osmotic process. Once the process has begun, Miasma seeps into the Host body through the point of contact.</p>
            <p>It should be noted that Miasma can not begin this process without direct skin contact. As such, the standard issue Personal Protective Equipment (PPE) at the Amoninsula facility (i.e. Gloves, boots, Hoods, Masks, Respirator) for protection against the sub-zero temperatures common in the area provide a reasonable degree of safety for individuals not directly involved in the monitoring and containment of Miasma. However, in cases of prolonged contact, Miasma has been observed as “passing through” the PPE. The mechanism through which it accomplishes this is as yet unknown.</p>
            <p>At present, the Amoninsula Office of Conduct and Protocols (AOCP) advises that all contact with Miasma be avoided. From this seemingly lackadaisical safety guideline, and Miasma’s relatively low independent air speed, it could be (incorrectly) assumed that this is an easy task. However, due to Miasma’s status as a gaseous phenomena, its top speed should always be assumed as equivalent to the current wind force. To date, the number of contact incidents have been few and while this may seem encouraging at face value, it also means there has been no study into the limits of what could be considered “safe exposure”</p>
            <p>A single instance of Miasma can divide itself up amongst an as of yet undetermined number of Hosts at once, provided it achieves the requisite prolonged direct skin contact. That said, once Miasma has been absorbed by a Host, it is non-transmissible. Additionally, even after the Host begins to express symptoms typical of Miasma parasitism, contact seems to maintain no risk. Operative word being “seems”, as sufficient research has yet to be conducted on the matter. This being the case, it is urged that AOCP’s stance of noncontact be followed with strict adherence to the use of proper PPE.</p>
            <p>In the worst-case scenario, when Miasma makes prolonged direct-skin contact with a living organism and manages to finish the osmotic process, the organism is guaranteed to expire due to the resulting symptoms. The symptoms begin to express themselves in the following manner. First, the body will begin to discolour around the initial point of contact, similar to the bruising process. The discolouration will begin to spread outward in a radial pattern over the course of several days. In all cases, Host’s experience a gradual and complete breakdown of cellular integrity. Beginning with the muscles, spreading to the bones. Finally ending with the internal organs. During early stages of this process, the Host will report feelings of pronounced exhaustion and weakness not dissimilar from Myasthenia Gravis or other neuro-muscular diseases. However, symptoms quickly progress, rendering the host immobile. While the eventual causes of Host death are caused by suffocation, pulmonary edema, or cerebral hypoxia, all of these can be attributed to the weakening effects caused by Miasma.</p>
            <p>Should a Host be discovered, they are to be immediately detained in order that their lives may yet have meaning, as a stepping stone to an eventual remedy.</p>
            <p>There is no known cure for a Host infected by Miasma.</p>
            <center><button id="endlog">End of entry.</button></center>

            `
        }
        if (miasma == "MIASMALOG_2") {
            log.innerHTML = `
            <p>Miasma End Entry #: 5-1</p>
            <p></p>
            <p>Author: Estelle Mcclendon</p>
            <p>Date: 2081//635</p>
            <p>Authors Note: While atypical I, Estelle Mcclendon, have been tasked with writing the fifth End Entry in the observation log due to unrelated circumstances that require solo personnel quarantine. To maintain consistency with previous Miasma End Entries, I will henceforth refer to myself as the “Host”.</p>
            <p></p>
            <p></p>
            <p>At the time of writing, approximately 9 hours have elapsed since Miasma made contact with the Host. Despite following official AOCP guidelines, a series of coincidences and maintenance failures lacking proper redress resulted in contact. First, due to abnormal weather conditions, the Site B entry hatch broke. Second, also due to abnormal weather conditions, the airlock gate did not close properly. A period of eight minutes elapsed prior to the completion of standard emergency resolution procedures. Fortunately, due to a pre-existing quarantine, this mission was conducted solo. Leaving Estelle Mcclendon the sole victim.</p>
            <p></p>
            <p>Point of contact with Miasma was centralised to the calves of the Host. Despite the Host wearing all required PPE, exposure was prolonged. Miasma completed the osmotic process, entering into the Host body. Skin discolouration is present. Total cellular breakdown is only a matter of time. As such, the Host’s condition has been determined to be terminal.</p>
            <p>At the time of writing (2081//635, 17:33), there has been no change in the proportions or consistency of the Host’s body. Neither has there been a change in cognitive or physical function. No change in bodily functions, etc. The only sign of infection is a barely visible discolouration of the skin below the Host’s knees. Due to the Host’s darker skin tone, the discoloration is almost imperceptible. As symptoms have yet to fully manifest, the Host wishes to dedicate the day to walking around while she still can. All things considered, the Host feels fine.</p>
            <p></p>
            <p></p>
            <center><button id="endlog">End of entry.</button></center>
            `
        }
        if (miasma == "MIASMALOG_3") {
            log.innerHTML = `
            <br>Important notice to all personnel.
            <br>
            <br>Author: Emily Valehood
            <br>The Overseer
            <br>
            <br>Date: 2081//633
            <br>During an expedition, Research department █████ was exposed to the novel NY-11 virus. Which is highly infectious, and was determined to have been unearthed due to thawing permafrost. As such, quarantine is being enacted effective immediately. The quarantine is expected to last no longer than ten (10) days. Personnel are advised to remain in their quarters and complete assignments as able. Due to the severity of a possible outbreak, the locks to all personnel quarters are being remotely managed. If extenuating circumstances result in the need to break quarantine, please submit an Unlock Request to your assigned Maintenance Department. For those whose assignments require the use of facilities or instruments not found within your personal quarters, additional information will be sent to your terminal instructing you on how to continue work during quarantine.
            <br>
            <br>If you require additional information contact The Overseer directly. Please be mindful that responses may take longer than usual due to circumstances. Thank you for partaking in protecting the world from the unknown.
            <br>
            <br><center><button id="endlog">End of entry.</button></center>
            `
        }
        if (miasma == "MIASMALOG_4") {
            log.innerHTML = `
            <br>Miasma End Entry #: 5-2
            <br>
            <br>Author: Estelle Mcclendon
            <br>Date: 2081//636
            <br>
            <br>The proportions and physical consistency of the Host's body have remained normal. There have been no changes in cognitive function. No visual or auditory distortions. Minor change in normal bodily functions. The dark skin tone is making it hard to spot the spreading on the skin, however, the Host reports a clear numbing and tingling sensation in her toes which proves the spread. The host is still able to move them around as normal, however, it is best described as 'clunky'. This extends even up to her ankle. 
            <br>
            <br>The Host is able to walk around freely in her room, however, the Host can tell there will be issues with balance soon. As with the previous personnel who made contact with the miasma, a wheelchair was provided upfront. There has been no deviations from the pre-existing miasma documentation.
            <br>
            <br>The Host finds it rather unfortunate that she ended up in a fatal incident just two weeks before fully completing her contract.
            <br>
            <br><center><button id="endlog">End of entry.</button></center>
            `
        }
        if (miasma == "MIASMALOG_5") {
            log.innerHTML = `
            <br>Miasma End Entry #: 5-3
            <br>
            <br>Author: Estelle Mcclrndon
            <br>Date: 2081//637
            <br>
            <br>There have been no changes in cognitive function. No visual or auditory distortions. Minor change in normal bodily functions. The dark skin which had been making the discoloration difficult to see has now begun to show a deviation from the pre-existing Miasma documentation. The initial area of the afflicted skin has started to show a discoloration of a bluish hue instead of the usual dark brown that has shown on the previous light skinned hosts. And the most notable deviation is that the afflicted skin seems to be turning translucent. Higher melanin concentrations could be the cause.<br>

            <br>The Host's physical state has started to deteriorate drastically, her body has started to gain more elasticity from the waist down. With her legs unable to support the weight of her body, walking has become impossible, requiring the usage of the wheelchair to move around.<br>
            <br>
            <br>One change to highlight. The fingers of the host are experiencing the same “clunky” feeling previously experienced in the toes.  Which has made the writing of this entry more time consuming. Due to the unusual circumstances which require the host to write her own End Entries, it is likely she won't be able to document the symptoms all the way to the end.<br>
            <br>
            <br><center><button id="endlog">End of entry.</button></center>            
            `
        }
        if (miasma == "MIASMALOG_6") {
            log.innerHTML = `
            <br>Miasma End Entry #: 5-4
            <br>
            <br>Author: Estelle Mcclendon
            <br>Date: 2081//638
            <br>
            <br>the hosts writing capabilities ahve deteriorated drastically and thus tehe reoprt with reflect that. The spread of the effect has fwully taken over the lweor half of the body and th transparent blue leaves the bones of gfht host visible. tHe hsots chest and upper arms have also started changing and the body is acting inoconsitent, host still needs to pee despite being unable to see the bladder nor intenstines. no hunger yet breathing feels laboured as the lungs still partially remain. Mire teesting should be done in future if soneone else ends up in this siaame situation. Despite mentioning the melanin concentration, I still suspect there might be some rare mutation in progress or an unkwown type of miasma. 
            <br>
            <br>moving akl body parts is still possible despite the total destruction of muscle and joint thissues. the weight of my own body puts pressure and squish on her hips and moving between the bed and the wheelchair has become dhallenigng. in the future prividng the host a computer by the bed would be preferable.
            <br>
            <br><center><button id="endlog">End of entry.</button></center>            
            `
        }
        if (miasma == "MIASMALOG_7") {
            log.innerHTML = `
            <br>Miasma End Entry #: 5-5
            <br>
            <br>Author: Estelle Mcclendon
            <br>Date: 2081//638<br>
            <br>lmao wet the bed this morgnig<br>
            <br>anwyayd ont really feel liek doing this anymore so liek
            <br> im doing it slime style yea you get the point<br><br>

            <center><button id="endlog">end of entry lol</button></center>
            `
        }
        if (miasma == "MIASMALOG_8") {
            log.innerHTML = `
            <br>mmaisma end entry  5-6
            <br>
            <br>athor: estlle mcldon
            <br>date : 2981//639
            <br>
            <br>i got slime feet
            <br>
            <br><center><button id="endlog">end of entry</button></center>
            `
        }
        if (miasma == "MIASMALOG_9") {
            log.innerHTML = `
            <br>Miasma End Entry #: 5-7
            <br>Terese Hillevi<br>
            <br>Chief Medical Officer<br>
            <br>2081//640<br>
            <br>As Chief Medical Officer I, Terese Hillevi, have once again assumed ownership of this observation log due to the Host (previously referred to as Estelle Mcclendon) being incapable of continuation due to the progression of Miasma induced symptoms.<br>
            <br>The aforementioned symptoms, despite the initial divergence, have resulted in the complete cellular degradation of the Host’s body that we have come to expect from Miasma exposure. The Host’s vital signs ceased and it was pronounced dead at 2081//639/21:38.<br>
            <br>I would like to use the end of this log to remind all present that we at the Amoninsula Research Facility are at the true frontier of our field. Our contributions to the world of science can not be understated. Especially the contributions of those who have perished, but not without purpose, in the line of duty. The Amoninsula Research Facility and all its staff thank Estelle Mcclendon for bringing us all one step closer to explaining the unexplainable.<br>
            <br>The complete ‘Miasma End Entry’ will be reviewed and then accessible by those with Tier Two and above clearance. ETC 2081//648.
<br>
            <br><center><button id="endlog">End of entry.</button></center>
            `
        }
        log.scrollTop = 0;
        log.classList.remove('hidden');
        inMenu = true;
        inMiasma = true;
        document.querySelector('#endlog').addEventListener('click', (e => {
            document.querySelector('#MIASMA').classList.add('hidden');
            inMenu = false;
        }));
        
        return
    }

    // JS FUNCTION TAG
     
    if (lookForFunction.test(str) == true) {
        let matchedCode = str.match(lookForFunction);
        console.log(matchedCode);
        var functionCall = new Function(matchedCode[1]);
        functionCall();
    };

    if (lookForFunctionDelay.test(str) == true) {
        delayedFunction = str.match(lookForFunctionDelay);
        funcDelay = true;
    };
    
    // THEME TAG

    if (lookForTheme.test(str) == true) {
        let matchedTheme = str.match(lookForTheme);
        if (matchedTheme[1] == "") {
            document.getElementById("engine-theme").href = "";
        } else {
            document.getElementById("engine-theme").href = "theme/" + matchedTheme[1] + ".css";
        }
    };

    // VOLUME TAGS
     
    if (lookForMusVol.test(str) == true) {
        let matchedVolume = str.match(lookForMusVol);
        gameplayMUSVolume = matchedVolume[1];
        currentMUS.volume = localStorage.getItem("settingsMusicVolume") * gameplayMUSVolume;
    };
     
    if (lookForSFXVol.test(str) == true) {
        let matchedVolume = str.match(lookForSFXVol);
        gameplaySFXVolume = matchedVolume[1];
    };

    // MODE TAG

    if (lookForMode.test(str) == true) {

        let matchedMode = str.match(lookForMode);
        // console.log("matchedMode is " + matchedMode[1]);
        mode (matchedMode[1]);
    }

    // STATUS TAG

    if (lookForStatus.test(str) == true) {
        let matchedStatus = str.match(lookForStatus);
        let text = matchedStatus[1];
        console.log("text is" + text);
        displayStatus(text);
    }

    if (lookForCLEARSTATUS.test(str) == true) {
        document.getElementById('statuswindow').innerHTML = null;
        document.getElementById('statuswindow').classList.add('hidden');
    }

    // SET TAG

    if (lookForSet.test(str) == true) {

        let matchedSet = str.match(lookForSet);

        for (i=0; i<matchedSet.length; i++) {

            let toset = matchedSet[i];
            let target = toset.match(lookForSubSet)[1];
            let value = toset.match(lookForSubSet)[2];
            GAMEVARS[target] = value;
            console.log(GAMEVARS);
            localStorage.setObject("allVariables", GAMEVARS);
        };

    };

    // OPP TAG

    if (lookForOpp.test(str) == true) {

       let matchedSet = str.match(lookForOpp);

       for (i=0; i<matchedSet.length; i++) {

           let toset = matchedSet[i];
           let target = toset.match(lookForSubOpp)[1];
           let opperation = toset.match(lookForSubOpp)[2];
           let value = toset.match(lookForSubOpp)[3];

           let oldVal = GAMEVARS[target];
           let newVal;

           if (opperation == "ADD") {
               newVal = parseFloat(oldVal) + parseFloat(value);
           } else if (opperation == "SUB") {
               newVal = parseFloat(oldVal) - parseFloat(value);
           } else if (opperation == "MUL") {
                newVal = parseFloat(oldVal) * parseFloat(value);
           } else if (opperation == "DIV") {
                newVal = parseFloat(oldVal) / parseFloat(value);
           } else {
                console.warn("OPP warning: Did not recognise opperation name");
           }

           GAMEVARS[target] = newVal;
           console.log(GAMEVARS);
        };
    };


    // CHECK TAG

    if (lookForCheck.test(str) == true) {

        document.getElementById('choicewindow').classList.toggle('hidden');

        let check = str;
        let [, var1, var2, op, out1, out2] = check.match(lookForCheck)
        
        if (GAMEVARS[var1]) {
            var1 = GAMEVARS[var1]; };
        if (GAMEVARS[var2]) {
            var2 = GAMEVARS[var2]; };        

        let operator = commands[op];
        let result = operator(var1, var2);

        if (result) { 
            goto = out1 ;
        } else {
            goto = out2;
        };

    }; 

    // CHOICE TAG

    if (lookForChoices.test(str) == true) { 
        
        let matchedChoices = str.match(lookForChoices);
        // console.log(matchedChoices);

        for (i=0;i<matchedChoices.length;i++) {
            // console.log(i, matchedChoices.length);
            let str = matchedChoices[i];
            let id = str.match(lookForSubChoices)[1];
            let text = str.match(lookForSubChoices)[2];
            let destination = str.match(lookForSubChoices)[3];
            
            // console.log(i, str, id, text, destination);
            choice[id] = text;
            outcome[id] = destination;
            // console.log(choice);
            updateChoices(id, text, destination);
            // console.log("id is" + id + ", text is" + text + ", destination is" + destination);
        };
        // choiceStatus = true;
        console.log("trying to show choice window");
        let choiceClasslist = document.getElementById('choicewindow');
        if (choiceClasslist.classList.contains('hidden')) {
            choiceClasslist.classList.remove('hidden');
        };
    };

    // REMOVE CHOICE TAG

    if (lookForRemoves.test(str) == true) { 
        
        let matchedRemoves = str.match(lookForRemoves);
        // console.log(matchedRemoves);

        for (i=0;i<matchedRemoves.length;i++) {
            // console.log(i, matchedRemoves.length);
            let str = matchedRemoves[i];
            let text = str.match(lookForSubRemoves)[1];
                        
            removeChoices(text);
        };
       
    };

    // GOTO TAG

     if (lookForGoto.test(str) == true) { 

        let gototarget = str.match(lookForGoto);
        goto = gototarget[1];
        document.getElementById('choicewindow').classList.toggle('hidden');

    };


    // BG IMAGE TAG

    if (lookForBG.test(str) == true) { 
        let curBG = str.match(lookForBG);
        let BGtarget = "url('" + BGs[curBG] +"')";
        document.getElementById(background).style.backgroundImage = BGtarget;
    };

    // FG IMAGE TAG

    if (lookForFG.test(str) == true) { 
        let curFG = str.match(lookForFG);
        let FGtarget = FGs[curFG];
        document.getElementById('fg1').src = FGtarget;
    };

    // MUSIC TAG

    if (lookForMUS.test(str) == true) { 
        let curMUS = str.match(lookForMUS);
        let track = curMUS[0];
        musicPlayer(track);
    };

    // SFX TAG

    if (lookForSFX.test(str) == true) { 
        let curSFX = str.match(lookForSFX);
        let track = curSFX[0];
        sfxPlayer(track);
    };

    // CHARACTER SPEAKING TAG

    // make sure you put the matching CSS styles you want into the stylesheet :)

    const curChara = str.match(lookForChara);
    if (curChara) {
        const chara = SPEAKERS[curChara[1]];
        if (chara) {
        speaker = chara;
        } else {
        speaker = curChara[1];
        }
    };

    // CLEAR TAG

    if (lookForCLEAR.test(str) == true) { 
        clear = true;
        // console.log("clear found");
    } else {
        clear = false;
        //console.log("clear not found");
    };

    // FIND VARIABLES IN STRING
    
    if (lookForVariable.test(str) == true) {
        let matchedVariable = str.match(lookForVariable);
        
        let toPrint = GAMEVARS[matchedVariable[1]];
        if (toPrint == undefined) {
            console.warn("Variable warning: did not find variable in surrounding $ symbols");
        } else {
            let toReplace = matchedVariable[0];

            console.log("before: " + str);
            str = str.replace(toReplace, toPrint);
            console.log("after: " + str);
        }
    }

    // TRIM COMMANDS FROM STRING

    if (lookForTrim.test(str) == true) {
        str = str.match(lookForTrim);
    };

    // UPDATE DIALOG BOXES

    if (speaker !== 'narration') {

        str = "「&nbsp;" + str + "&nbsp;」";
        var newline5left = speaker;
        var newline5leftclass = speaker;
        // console.log(speaker);
        // document.getElementById('lefttext3').className = speaker;
        // document.getElementById('lefttext3').innerHTML = speaker;
        // console.log(str);
        // document.getElementById('text3').className = speaker;

    } else {
        var newline5left = "&emsp;&emsp;&emsp;&emsp;";
        var newline5leftclass = 'narration';
        
        // document.getElementById('text3').className = 'narration';
        // document.getElementById('lefttext3').innerHTML = ;
    }

    if (clear == true) {
        var newline1 = "";
        var newline1left = "&emsp;&emsp;&emsp;&emsp;"
        var newline1leftclass = 'narration';
        var newline2 = "";
        var newline2left = "&emsp;&emsp;&emsp;&emsp;"
        var newline2leftclass = 'narration';
        var newline3 = "";
        var newline3left = "&emsp;&emsp;&emsp;&emsp;"
        var newline3leftclass = 'narration';
        var newline4 = "";
        var newline4left = "&emsp;&emsp;&emsp;&emsp;"
        var newline4leftclass = 'narration';
        var newline5 = "";
        var newline5left = "&emsp;&emsp;&emsp;&emsp;"
        var newline5leftclass = 'narration';

        if(curChara) {
            var newline5 = str;
            var newline5left = speaker;
            var newline5leftclass = speaker;
        } else {
            var newline5 = str;
            var newline5left = "&emsp;&emsp;&emsp;&emsp;";
            var newline5leftclass = 'narration';
        }

        clearHistory();
    } else {

        var newline1 = document.getElementById("text2").innerHTML;
        var newline1left = document.getElementById("lefttext2").innerHTML;
        var newline1leftclass = document.getElementById('lefttext2').className;

        var newline2 = document.getElementById('text3').innerHTML;
        var newline2left = document.getElementById("lefttext3").innerHTML;
        var newline2leftclass = document.getElementById('lefttext3').className;

        var newline3 = document.getElementById('text4').innerHTML;
        var newline3left = document.getElementById("lefttext4").innerHTML;
        var newline3leftclass = document.getElementById('lefttext4').className;

        var newline4 = document.getElementById('text5').innerHTML;
        var newline4left = document.getElementById("lefttext5").innerHTML;
        var newline4leftclass = document.getElementById('lefttext5').className;

        var newline5 = str;

        // console.log("no clear");
    };
   
        document.getElementById('text1').innerHTML = newline1;
        document.getElementById('lefttext1').innerHTML = newline1left;
        document.getElementById('lefttext1').className = newline1leftclass;
        
        document.getElementById('text2').innerHTML = newline2;
        document.getElementById('lefttext2').innerHTML = newline2left;
        document.getElementById('lefttext2').className = newline2leftclass;

        document.getElementById('text3').innerHTML = newline3;
        document.getElementById('lefttext3').innerHTML = newline3left;
        document.getElementById('lefttext3').className = newline3leftclass;

        document.getElementById('text4').innerHTML = newline4;
        document.getElementById('lefttext4').innerHTML = newline4left;
        document.getElementById('lefttext4').className = newline4leftclass;

        document.getElementById('text5').innerHTML = newline5;
        document.getElementById('lefttext5').innerHTML = newline5left;
        document.getElementById('lefttext5').className = newline5leftclass;

        logMessage(newline5left, newline5leftclass, newline5);

        if (autoplay) {
            autoplayTimer = setTimeout(progress, calcAutoSpeed());
        }  

    sfxPlayer("SFX_TEXT");

    if (goto != null) {
        if (goto.endsWith("_SAVE")) {
            localStorage.setItem("savedChapter", goto);
        }

        let chaptertarget = goto;
        goto = null;
        cameFromCheck = true;
        changeChapter(chaptertarget);    
    }

};

function calcAutoSpeed() {
    let settingsSpeed = localStorage.getItem("settingsAutoplaySpeed");
    let speed = (settingsSpeed * document.getElementById('text3').innerHTML.length) - (document.getElementById('text3').innerHTML.length * 8);
    if (speed < settingsSpeed * autoplayLengthOffset) speed = settingsSpeed * autoplayLengthOffset;

    //console.log(speed);
    return speed;
}


function clearHistory() {
    const messageLog = document.getElementById("messagelog");
    messageLog.innerHTML = "";
}


function mode(target) {

// pick between different story modes
// standard is bordered bgs and text box
// fullBG sets the bgs to be the fullscreen instead and remove the bg box border
// borderless removes all borders
// borderlessfullBG is both at once

    if (target == "standard") {

        // remove hidden from bg and text box
        background = "bg1";
        document.getElementById('body').classList.remove('fullBG');
        document.getElementById('body').classList.add('standard')
        document.getElementById('body').style.backgroundImage = null;
        document.getElementById('bg1').classList.remove('hidden');
        document.getElementById('dial').classList.remove('transparent');

    } else if (target == "fullBG") {

        background = "body";
        document.getElementById('bg1').classList.add('hidden');
        document.getElementById('bg1').style.backgroundImage = "url('images/blank.png')";
        document.getElementById('body').classList.add('fullBG');

    } else if (target == "borderless") {

        background = "bg1";
        document.getElementById('bg1').classList.add('hidden');
        document.getElementById('dial').classList.add('transparent');

    } else if (target == "borderlessfullBG") {

        background = "body";
        document.getElementById('bg1').classList.add('hidden');
        document.getElementById('bg1').style.backgroundImage = "url('images/blank.png')";
        document.getElementById('dial').classList.add('transparent');
        document.getElementById('body').classList.add('fullBG');

    };

    // console.log("mode:" + target);

};

function makeMusicPlayers () {

    for (const [key, value] of Object.entries(MUSIC)) {
        
        // console.log(`${key}: ${value}`);
        var newplayer = document.createElement("AUDIO");
        newplayer.setAttribute("id", key);
        newplayer.setAttribute("src", value);
        newplayer.setAttribute("preload", "auto");
        if (key.indexOf('MUS') >= 0) {
           newplayer.setAttribute("loop", 1);
        }
        document.body.appendChild(newplayer);
    };

    console.log('music loaded');

};

function musicPlayer (track) {
    let trackName = track; 
    let sounds = document.getElementsByTagName('audio');
    for(i=0; i<sounds.length; i++) sounds[i].pause();

    track = document.getElementById(track);
    track.volume = localStorage.getItem("settingsMusicVolume") * gameplayMUSVolume;
    track.play();
    currentMUS = track;
    // console.log('playing music');

};

function sfxPlayer (track) {
    let trackName = track;
    track = document.getElementById(track);
    track.currentTime = 0;
    track.play();
    if (trackName != "SFX_TEXT") {
        currentSFX = track;
        track.volume = localStorage.getItem("settingsSFXVolume") * gameplaySFXVolume;
    } else {
        track.volume = localStorage.getItem("settingsSFXVolume");
    }
    // console.log('playing sfx');

};

function cacheBGs () {

    for (const [key, value] of Object.entries(BGs)) {
        
        // console.log(`${key}: ${value}`);
        var newimage = document.createElement("img");
        newimage.setAttribute("id", key);
        newimage.setAttribute("src", value);
        newimage.setAttribute("hidden", 1);
        cache[key] = newimage;
    };

    console.log('images loaded');
    // console.log(cache);

};

function cacheFGs () {

    for (const [key, value] of Object.entries(FGs)) {
        
        // console.log(`${key}: ${value}`);
        var newimage = document.createElement("img");
        newimage.setAttribute("id", key);
        newimage.setAttribute("src", value);
        newimage.setAttribute("hidden", 1);
        cache[key] = newimage;
    };

    console.log('fg images loaded');
    // console.log(cache);

};

function logMessage(speaker, speakerclass, text) {

    if (speaker == null) {
        speaker = ""
    } else {
        speaker = ('<span class="' + speakerclass + '">' + speaker +'</span>');
    };
    let NewMessage = speaker.concat(" ", text);
    let ul = document.getElementById("messagelog");
    let li = document.createElement("li");
    li.innerHTML = NewMessage;
    ul.appendChild(li);

    let messageDiv = document.getElementById("messagecontainer");

    ul.scrollIntoView(false);
    
    let messagecount = ul.childElementCount;    

    if (messagecount >= localStorage.getItem("settingsHistoryLength")) {
        ul.removeChild(ul.children[0]);
    };
};

function togglehistory() {
    document.getElementById('historybutton').classList.toggle("menuOpen")

    document.getElementById('messagecontainer').classList.toggle('hidden');
    document.getElementById('messagelog').classList.toggle('hidden');
    document.getElementById('fg1').classList.toggle('hidden');
    inMenu = !inMenu;

}

function toggleSettings() {
    document.getElementById('settings').classList.toggle("menuOpen")

    document.getElementById('settings-window').classList.toggle('hidden');
        if (document.getElementById('settings-window').classList.contains('hidden')) {
            inMenu = false;
        } else {
            inMenu = true;
        }
}

function sliderInvertValue(minVal, maxVal, curVal) {
  let newVal = curVal - maxVal;
  newVal = Math.abs(newVal);
  newVal = parseInt(minVal) + parseInt(newVal); // I HATE JS I HATE JS I HATE JS I HATE JS
  return newVal;
}

/* 

attributions:
CRT effect based on code from http://aleclownes.com/2017/02/01/crt-display.html
click sound: https://freesound.org/people/EminYILDIRIM/sounds/536108/


*/

