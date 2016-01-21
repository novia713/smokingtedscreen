/**
 *          .·.·.·.·.·.·.·.·.·.·.·.·.·.·.·.·.·.·.·.
 *          .·' H O M E S C R E E N S F O R A L L'·.  by leandro713
 *          .·.·.·.·.·.·.·.·.·.·.·.·.·.·.·.·.·.·.·.
 *
 * Tedscreen
 *
 * This is a custom homescreen dedicated to our good buddy Ted.
 * Initially, i developed custom homescreens as certified apps.
 * I usually flashed them to my phones with the WebIDE.
 * When #firefoxos 2.6 arrived, a new permission was created for making
 * homescreens possible as privileged apps ["homescreen-webapps-manage"].
 *
 * So, this is my first try to do that way.
 *
 * @author      leandro713 <leandro@leandro.org>
 * @copyright   leandro713 - 2016
 * @link        https://github.com/novia713/smokingtedscreen
 * @license     http://www.gnu.org/licenses/gpl-3.0.en.html
 * @version     1.2
 * @date        20160121
 *
 * @see         https://github.com/mozilla-b2g/gaia/tree/88c8d6b7c6ab65505c4a221b61c91804bbabf891/apps/homescreen
 * @thanks      to @CodingFree for his tireless support and benevolent friendship
 * @todo
 *      - show wifi network name and telephony provider name
 *      - show weather
 *      - show missed calls
 *      - default icon if not found
 */



/**
 *  I (leandro713) did this because i liked the character,
 *  I have not relation and not own anything related to Ted.
 *  Universal Pictures, please, don't sue me :)
 **/


/*
 * HOW TO DO HOMESCREENS MAGIC WITH FXOS 2.6
 * =========================================
 * 1, manifest.webapp →
 *      "type":"privileged",
 *      "permission": "homescreen-webapps-manage"
 *
 * 2. navigator.mozApps.mgmt.getAll()               // gets all the apps installed on the phone
 *
 * 3. navigator.mozApps.mgmt.getIcon(app, size)     // gets the icon of the app at the desired (more or less) size
 *
 * 4. window.URL.createObjectURL( img )             // userful for printin' the blob resulting of getIcon()
 *
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


require(["jQuery", 'auderoSmokeEffect', 'ramdajs'], (jQuery, $, R) => {

    const apps_2_exclude = [
        "Downloads", "EmergencyCall", "System", "Legacy", "Ringtones",
        "Legacy Home Screen", "Wallpaper", "Default Theme", "Purchased Media",
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
    var ted = () => {
            var tile = document.createElement('div');
            tile.className = 'tile';
            tile.id = 'pill';
            tile.style.background = "#000 url('/style/icons/texture.png') no-repeat";
            tile.innerHTML = "<img src='/style/icons/smokingted-128.png' id='ted_img'>";
            $('#apps').prepend(tile);

    }

    //colors
    var get_color = app => {

        var obj_color = {};
        obj_color.Communications = "#B2F2FF";       //green 5F9B0A
        obj_color.Calendar       = "#FF4E00";       //orange
        obj_color['E-Mail']      = "#FF4E00";       //orange
        obj_color['FM Radio']    = "#2C393B";       //grey
        obj_color.Camera         = "#00AACC";       //blue
        obj_color.Clock          = "#333333";       //warm grey
        obj_color.Gallery        = "#00AACC";       //blue
        obj_color.Marketplace    = "#00AACC";       //blue
        obj_color.Browser        = "#00AACC";       //blue
        obj_color.Messages       = "#5F9B0A";       //green
        obj_color.Video          = "#CD6723";       //brick
        obj_color.Music          = "#CD6723";       //brick
        obj_color.Settings       = "#EAEAE7";       //ivory

        obj_color.Twitter     = "#c0deed";
        obj_color.Facebook    = "#3b5998";

        if (obj_color[app]) {
            return obj_color[app];
        } else {
            //random hex color;
            //return '#' + Math.floor(Math.random() * 16777215).toString(16);
            return '#'+'0123456789abcdef'.split('').map(function(v,i,a){ return i>5 ? null : a[Math.floor(Math.random()*16)] }).join('');
        }
    };

    /**
     * Prints set up message
     */
     var print_msg = () => {
        var txt_msg  = "<div style='background-color:orange;color:white'><h3>Please, set this homescreen your default homescreen in <i>Settings / Homescreens / Change Homescreens</i>. This homescreen won't work if you don't do so</h3></div>";
            txt_msg += "<div style='background-color:orange;color:black'><h3>Ve a <i>Configuración / Homescreens</i> y haz este homescreen tu homescreen por defecto. Si no lo haces, este homescreen no funciona!</h3></div>";
        parent.html(txt_msg);
     };

    /**
     * Renders the icon to the container.
     */
    var render = icon => {

            if (!icon.manifest.icons) return;

            // guards
            if( R.contains ( icon.manifest.name, apps_2_exclude ))  return;
            if (icon.manifest.role == "homescreen")                 return;
            if (icon.manifest.role == "addon")                      return;
            //end guards

            var icon_image = navigator.mozApps.mgmt.getIcon(icon, 60);

            icon_image.then ( img => {

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
    var start = () => {
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

            myApps.then( v => { //resolve

                }, v => { //reject
                    //console.log(v);
                    print_msg();
                }
            );

   } //end start


   /**
    Add an event listener to launch the app on click.
   */
    window.addEventListener('click', e => {
        //console.log(e);

        var i = iconMap.get(e.target);
        if (i) i.launch();

        //TED toogle animation onclick?
        if (e.explicitOriginalTarget.id == "ted_img") {
            //$("#pill").auderoSmokeEffect('toggle');
        }
    }); //end window event 'click'


    $(document).on('visibilitychange', e => {

        if (e.target.visibilityState === "visible") {

            $("#pill").auderoSmokeEffect('enable');

        } else if (e.target.visibilityState === "hidden") {

            $("#pill").auderoSmokeEffect('disable');
        }
    });

    // 3, 2, 1 ...
    start();

});
