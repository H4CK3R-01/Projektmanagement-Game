function isMobile() {

    var mobileDeviceIndicator = 0;
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        mobileDeviceIndicator = 1;
    }
    /*
    var hasTouchscreen = 'ontouchstart' in window;
    alert(hasTouchscreen ? 'has touchscreen' : 'doesn\'t have touchscreen');*/
}

