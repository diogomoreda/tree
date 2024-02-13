Tree.modelRenderer = (function() {


    var container = null;
    var bypass = [];
    var oldModel = null;


    function renderItem(item, key, match) {
        if (bypass.includes(key)) return '';
        var output = '';
        if (typeof item === 'object' && item !== null) {
            // output ARRAY
            if (Array.isArray(item)) {
                output += '<li><span class="key" title="' + key + '">' + key + '</span><span class="marker">:</span><span class="marker">[</span>';
                if (item.length) {
                    output += '<ul class="arr">';
                    if (match) {
                        for (var i=0; i<item.length; i++) output += renderItem(item[i], i, match[i]);
                    } else {
                        for (var i=0; i<item.length; i++) output += renderItem(item[i], i, null);
                    }
                    output += '</ul>';
                }
                output += '<span class="marker">]</span></li>';
                return output;
            }
            // output OBJECT
            output += '<li><span class="key" title="' + key + '">' + key + '</span><span class="marker">:</span><span class="marker">{</span>';
            if (Object.keys(item)?.length) {
                output += '<ul class="obj">';
                if (match) {
                    for (var i in item) output += renderItem(item[i], i, match[i]);
                } else {
                    for (var i in item) output += renderItem(item[i], i, null);
                }
                output += '</ul>';
            }
            output += '<span class="marker">}</span></li>';
            return output;
        }
        // output PRIMITIVE
        output += '<li class="item' + (item == match || match === null ? '' : ' change-flag') + '"><span class="key" title="' + key + '">' + key + '</span><span>:</span><span class="value" title="' + item + '">' + item + '</span></li>';
        return output;
    }



    function renderModel(modelArray, name, bypassList) {
        if (bypassList) bypass = bypassList;
        if (container) document.body.removeChild(container);
        container = document.createElement('div');
        container.className = 'tree-model-render';
        container.innerHTML = '<ul class="model-wrapper">' + renderItem(modelArray, name || '', oldModel) + '</ul>';
        document.body.appendChild(container);
        bypass = [];
        oldModel = JSON.parse(JSON.stringify(modelArray));
    }


    return {
        render: renderModel
    }

})();

