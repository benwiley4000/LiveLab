var LOCAL_SOCKET = "wss://localhost:8000";

var SimpleWebRTC = require('./libs/simplewebrtc');
var LiveLabOsc = require('./LiveLabOsc');

 var webrtc, chatlog, oscChannel;
 window.onload = function(){
     // grab the room from the URL
    var room = location.search && location.search.split('?')[1];
    chatlog = document.getElementById("chatlog");

     // create our webrtc connection
    webrtc = new SimpleWebRTC({
        // the id/element dom element that will hold "our" video
        localVideoEl: 'localVideo',
        // the id/element dom element that will hold remote videos
        remoteVideosEl: '',
        // immediately ask for camera access
        autoRequestMedia: true,
        debug: false,
        detectSpeakingEvents: true,
        autoAdjustMic: false
     });

    // TO DO: ERROR CHECKING FOR WHETHER WEBSOCKETS ARE AVAILABLE
    //Create html element for OSC ui
    var streamContainer = document.createElement('div');
    document.body.appendChild(streamContainer);   
    oscChannel = new LiveLabOsc(LOCAL_SOCKET, webrtc, streamContainer);
   
       
        // when it's ready, join if we got a room from the URL
    webrtc.on('readyToCall', function () {
        // you can name it anything
        if (room) webrtc.joinRoom(room);
    });

     webrtc.on('channelMessage', function (peer, label, data) {
        if (data.type == 'volume') {
            showVolume(document.getElementById('volume_' + peer.id), data.volume);
        } else if(data.type=="chat"){
            chatlog.innerHTML += "</br>"+peer.id + ": " + data.payload; 
            console.log(data);
        }  else if(data.type=="osc"){
                $("#osc-remote").text(JSON.stringify(data.payload, undefined, 2));
        }
    });

    webrtc.on('videoAdded', function (video, peer) {
        console.log('video added', peer);
        var remotes = document.getElementById('remotes');
        if (remotes) {
            var d = document.createElement('div');
            d.className = 'videoContainer';
            d.id = 'container_' + webrtc.getDomId(peer);
            d.appendChild(video);
            var vol = document.createElement('div');
            vol.id = 'volume_' + peer.id;
            vol.className = 'volume_bar';
            video.onclick = function () {
                video.style.width = video.videoWidth + 'px';
                video.style.height = video.videoHeight + 'px';
            };
            d.appendChild(vol);
            remotes.appendChild(d);
        }
    });

    webrtc.on('videoRemoved', function (video, peer) {
        console.log('video removed ', peer);
        var remotes = document.getElementById('remotes');
        var el = document.getElementById('container_' + webrtc.getDomId(peer));
        if (remotes && el) {
            remotes.removeChild(el);
        }
    });

    webrtc.on('volumeChange', function (volume, treshold) {
        //console.log('own volume', volume);
        showVolume(document.getElementById('localVolume'), volume);
    });
     
    if (room) {
        setRoom(room);
    } else {
        $('#createRoom').submit(function () {
            var val = $('#sessionInput').val().toLowerCase().replace(/\s/g, '-').replace(/[^A-Za-z0-9_\-]/g, '');
            webrtc.createRoom(val, function (err, name) {
                console.log(' create room cb', arguments);
            
                var newUrl = location.pathname + '?' + name;
                if (!err) {
                    history.replaceState({foo: 'bar'}, null, newUrl);
                    setRoom(name);
                } else {
                    console.log(err);
                }
            });
            return false;          
        });
    }

       $('#sendChat').submit(function () {
       		 var msg = document.getElementById("chat").value;
    		chatlog.innerHTML += "</br> me: " + msg; 
    		webrtc.sendDirectlyToAll("simplewebrtc", "chat", msg) ;
             return false;
    	});
 }
 
function showVolume(el, volume) {
    if (!el) return;
    if (volume < -45) { // vary between -45 and -20
        el.style.height = '0px';
    } else if (volume > -20) {
        el.style.height = '100%';
    } else {
        el.style.height = '' + Math.floor((volume + 100) * 100 / 25 - 220) + '%';
    }
}


function setRoom(name) {
    $('#createRoom').remove();
    $('h1').text(name);
   // $('#subTitle').text(name + " || link: "+ location.href);
    $('body').addClass('active');
}


          
