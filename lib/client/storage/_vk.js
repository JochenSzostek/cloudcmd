var CloudCmd, Util, DOM, VK;

(function(CloudCmd, Util, DOM){
    'use strict';
    
    var VKStorage      = {};
    
    
    /* PRIVATE FUNCTIONS */
    
    /**
     * load google api library
     */
    function load(pCallBack){
        console.time('vk');
        
        var lUrl    = 'http://vkontakte.ru/js/api/openapi.js',
            lLocal  = CloudCmd.LIBDIRCLIENT + 'storage/vk/open.js',
            
            lOnload = function(){
                console.timeEnd('vk load');
                DOM.Images.hide();
                
                Util.exec(pCallBack);
            };
        
        DOM.jsload(lUrl, {
            onload  : lOnload,
            error   : DOM.retJSLoad(lLocal, lOnload)
        });
        
    }
    
    function auth(pCallBack){
        CloudCmd.getConfig(function(pConfig){
            var lDOCUMENTS_ACCESS = 131072;
            
            VK.init({ apiId: pConfig.vk_id});
            
            VK.Auth.login(function(){
                var lNAME = 1281;
                VK.Api.call('getVariable', {key: lNAME}, function(r) {
                    var lName = r.response;
                    
                    if(lName)
                        Util.log ('Hello, ' + lName + ':)');
                });
                
                Util.exec(pCallBack);
                
            }, lDOCUMENTS_ACCESS); /* Доступ к документам пользователя */
        });
    }
    
    
    /**
     * Insert new file.
     *
     * @param {File} fileData {name, data} File object to read data from.
     */
    VKStorage.uploadFile = function(params) {
        /* http://vk.com/developers.php?oid=-1&p=docs.getUploadServer */
        VK.Api.call('docs.getUploadServer', {}, function(result){
            var url     = result.response.upload_url,
                data    = params.data,
                name    = params.name;
            
            DOM.ajax({
                type    : 'POST',
                url     : url,
                data    : {
                    file: data,
                    name: name
                },
                dataType: 'application/x-www-form-urlencoded',
                success : function(data){
                    Util.log(data);
                    VK.Api.call('docs.save', {}, Util.log);
                },
                
                error   : Util.log
              });
        });
    };
    
    VKStorage.init                = function(pCallBack){
       Util.loadOnLoad([
            load,
            auth,
            Util.retExec(pCallBack)
        ]);
    };
    
    CloudCmd.VK    = VKStorage;
})(CloudCmd, Util, DOM);
