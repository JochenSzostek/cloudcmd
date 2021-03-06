/* 
 * Library contain windows specific functions
 * like getting information about volumes
 */
 
(function(){
    'use strict';
    
    if (!global.cloudcmd)
        return console.log(
             '# win.js'                                         + '\n'  +
             '# -----------'                                    + '\n'  +
             '# Module is part of Cloud Commander,'             + '\n'  +
             '# used for work with windows specific'            + '\n'  +
             '# functions like work with drives(etc c).'        + '\n'  +
             '# http://cloudcmd.io'                             + '\n');
    
    var main            = global.cloudcmd.main,
        Charset         ={
            UNICODE : 65001,
            WIN32   : 866
        },
        
        exec            = main.child_process.exec,
        Util            = main.util;
        
    exports.getVolumes  = function(callback) {
        var chcp        = 'chcp ' + Charset.UNICODE,
            getVolumes  = 'wmic logicaldisk get name';
        
        exec(chcp + ' &&  ' + getVolumes, Util.bind(processOuput, callback));
    };
    
    function processOuput(callback, error, stdout, stderr) {
        var volumes     = [],
            removeStr   = [
                '\r', '\n',
                'Name',
                'Active code page: 65001  '
            ];
        
        if (!error)
            error = stderr;
        
        exec('chcp ' + Charset.WIN32);
        
        if(!error) {
            volumes = Util.removeStr(stdout, removeStr)
                .split('    ');
            
            volumes.pop();
        }
        
        Util.exec(callback, error || volumes);
    }
})();
