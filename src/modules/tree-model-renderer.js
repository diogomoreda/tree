Tree.modelRenderer = (function() {


    var container = null;
    var bypass = [];


    function renderItem(item, key) {
        if (bypass.includes(key)) return '';
        var output = '';
        if (typeof item === 'object' && item !== null) {
            if (Array.isArray(item)) {
                output += '<li><span class="key" title="' + key + '">' + key + '</span><span class="marker">:</span><span class="marker">[</span>';
                if (item.length) {
                    output += '<ul class="arr">';
                    for (var i=0; i<item.length; i++) output += renderItem(item[i], i);
                    output += '</ul>';
                }
                output += '<span class="marker">]</span></li>';
                return output;
            }
            output += '<li><span class="key" title="' + key + '">' + key + '</span><span class="marker">:</span><span class="marker">{</span>';
            if (Object.keys(item)?.length) {
                output += '<ul class="obj">';
                for (var i in item) output += renderItem(item[i], i);
                output += '</ul>';
            }
            output += '<span class="marker">}</span></li>';
            return output;
        }
        output += '<li class="item"><span class="key" title="' + key + '">' + key + '</span><span>:</span><span class="value" title="' + item + '">' + item + '</span></li>';
        return output;
    }



    function renderModel(modelArray, name, bypassList) {
        if (bypassList) bypass = bypassList;
        if (container) document.body.removeChild(container);
        container = document.createElement('div');
        container.className = 'tree-model-render';
        container.innerHTML = '<ul class="model-wrapper">' + renderItem(modelArray, name || '') + '</ul>';;
        document.body.appendChild(container);
        bypass = [];
    }


    return {
        render: renderModel
    }

})();

