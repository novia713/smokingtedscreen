/*
 * Tedscreen
 * (c) leandro@leandro.org
 * MIT license
 * v. 20160110
 */

// Reference: https://github.com/mozilla-b2g/gaia/tree/88c8d6b7c6ab65505c4a221b61c91804bbabf891/apps/homescreen
// i did this because i liked the character,
// i have not relation and not own anything related to Ted.
// Universal Pictures, please, don't sue me :)


/*
 * HOW TO DO HOMESCREENS MAGIC WITH FXOS 2.6
 * =========================================
 * 1, manifest webapp → "type":"privileged", "permission": "homescreen-webapps-manage"
 * 2. navigator.mozApps.mgmt.getAll()
 * 3. navigator.mozApps.mgmt.getIcon()
 * 4. window.URL.createObjectURL( img )
 *
 **/


requirejs.config({
    appDir: ".",
    baseUrl: "js",
    paths: {
        'jQuery': ['jquery-2.1.4.min'],
        'auderoSmokeEffect': ['jquery.auderoSmokeEffect.min'],
        'ramdajs': ['ramda.min']
    },
    shim: {
        "auderoSmokeEffect": {
            exports: "$",
            deps: ['jQuery']
        },
        'ramdajs': {
            exports: 'R'
        }
    }
});


require(["jQuery", 'auderoSmokeEffect', 'ramdajs'], function(jQuery, $, R) {

    const apps_2_exclude = [
        "Downloads", "EmergencyCall", "System", "Legacy", "Ringtones",
        "Legacy Home Screen", "Wallpaper", "Default Theme",
        "Built-in Keyboard", "Bluetooth Manager", "Communications",
        "PDF Viewer", "Network Alerts", "WAP Push manager", "Default Home Screen" ];

    var parent = $('#apps');
    var iconMap = new WeakMap();

    var x = 2; //default icon columns key value
    var config = {};
    config.columns = [];
    config.columns[2] = 65;
    config.columns[3] = 35;

    //Ted tile
    var ted = function() {
            var tile = document.createElement('div');
            tile.className = 'tile';
            tile.id = 'pill';
            tile.style.background = "#000 url('/style/icons/texture.png') no-repeat";
            tile.innerHTML = "<img src='/style/icons/smokingted-128.png' id='ted_img'>";
            $('#apps').prepend(tile);

    }

    //colors
    var get_color = function(app) {
        var obj_color = {};
        obj_color.Communications = "#B2F2FF"; //green 5F9B0A
        obj_color.Calendar = "#FF4E00";    //orange
        obj_color['E-Mail'] = "#FF4E00";   //orange
        obj_color['FM Radio'] = "#2C393B"; //grey
        obj_color.Camera = "#00AACC";      //blue
        obj_color.Clock = "#333333";       //warm grey
        obj_color.Gallery = "#00AACC";     //blue
        obj_color.Marketplace = "#00AACC"; //blue
        obj_color.Browser = "#00AACC";     //blue
        obj_color.Messages = "#5F9B0A";    //green
        obj_color.Video = "#CD6723";       //brick
        obj_color.Music = "#CD6723";       //brick
        obj_color.Settings = "#EAEAE7";    //ivory
        if (obj_color[app]) {
            return obj_color[app];
        } else {
            //random hex color;
            return '#' + Math.floor(Math.random() * 16777215)
                .toString(16);
        }
    };


    /**
     * Renders the icon to the container.
     */
    var render = function(icon) {

            if (!icon.manifest.icons) return;

            // guards
            if( R.contains ( icon.manifest.name, apps_2_exclude ))
                return;

            if (icon.manifest.role == "homescreen") return;
            if (icon.manifest.role == "addon") return;
            //end guards

            var icon_image = navigator.mozApps.mgmt.getIcon(icon, 60);

            icon_image.then ( function ( img ) {



                var name = icon.manifest.name;
                var wordname = name.split(" ");
                var firstchar = name.charAt(0);
                var tile_bg = ('violet' == config.selected_theme) ?
                    config.pink_tile_bg :
                    config.green_tile_bg;

                /* tile generation*/
                var tile = document.createElement('div');
                tile.className = 'tile';
                tile.className += ' icon_' + wordname[0];

                var str_tile = (config.color_tile) ? ", " + tile_bg : "";
                tile.style.background = get_color(name) + ' url(' + window.URL.createObjectURL(  img ) +') 49% no-repeat';
                $('#apps').append(tile);

                iconMap.set(tile, icon);
                /* end tile generation*/
            });

            if (typeof icon_image == undefined) return;
    }


    /* fires up the painting */
    var start = function() {
            $('.tile').remove();

            /** Fetch all apps and render them. */

            var myApps = new Promise((resolve, reject) => {
                    var request = navigator.mozApps.mgmt.getAll();

                    request.onsuccess = (e) => {
                      for (var app of request.result) {
                        render( app );
                      }
                    };

                    request.onerror = (e) => {
                      console.error('Error calling getAll: ' + request.error.name);
                      resolve();
                    };
            });


            //TED
            ted();

            //start smoke
            $("#pill").auderoSmokeEffect({
                imagePath: "/style/icons/cloud.png",
                pause: 500,
                posY: 100,
                posX: 70
            });


   } //end start


   /**
    Add an event listener to launch the app on click.
   */
    window.addEventListener('click', e => {
        console.log(e);

        var i = iconMap.get(e.target);
        if (i) i.launch();

        //TED toogle animation onclick?
        if (e.explicitOriginalTarget.id == "ted_img") {
            //$("#pill").auderoSmokeEffect('toggle');
        }
    }); //end window event 'click'


    $(document).on('visibilitychange', function(e) {

        if (e.target.visibilityState === "visible") {

            $("#pill").auderoSmokeEffect('enable');

        } else if (e.target.visibilityState === "hidden") {

            $("#pill").auderoSmokeEffect('disable');
        }
    });


    // 3, 2, 1 ...
    start();



});
