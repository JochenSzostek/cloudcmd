(function() {
    'use strict';
    
    var main        = global.cloudcmd.main,
        files       = main.files,
        Util        = main.util,
        CloudFunc   = main.cloudfunc,
        zlib        = require('zlib');
    
    module.exports  = join;
    
    function join(before, req, res, callback) {
        var names,
            readFunc    = Util.bind(readPipe, req, res),
            path        = main.getPathName(req),
            isJoin      = CloudFunc.isJoinURL(path);
        
        if (!isJoin) 
            Util.exec(callback);
        else {
            names   = CloudFunc.getJoinArray(path);
            
            Util.ifExec(!before, readFunc, function(callback) {
                before(names, callback);
            });
        }
        
        return isJoin;
    }
    
    function readPipe(req, res, names) {
        var stream,
            path        = main.getPathName(req),
            gzip        = zlib.createGzip(),
            isGzip      = main.isGZIP(req);
            
        main.mainSetHeader({
            name        : names[0],
            cache       : true,
            gzip        : isGzip,
            request     : req,
            response    : res
        });
        
        stream = isGzip ? gzip : res;
        
        files.readPipe({
            names       : names,
            write       : stream,
            callback    : function(error) {
                var errorStr;
                
                if (error)
                    if (!res.headersSent)
                        main.sendError({
                            request     : req,
                            response    : res,
                            name        : path
                        }, error);
                    else {
                        Util.log(error);
                        errorStr = error.toString();
                        stream.end(errorStr);
                    }
            }
        });
        
        /* 
         * pipe should be setted up after
         * readPipe called with stream param
         */
        if (isGzip)
            gzip.pipe(res);
    }
})();
