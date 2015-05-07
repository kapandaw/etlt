if ($(document).find('links').length == 0) {
    var elem = document.getElementById('links');
    if (elem != null && typeof(elem) != 'undefined') {
        elem.onclick = function(event) {
            event = event || window.event;
            var target = event.target || event.srcElement,
                links = this.getElementsByTagName('a'),
                link = target.src ? target.parentNode : target;
            var options = {
                index: link,
                event: event,
                titleElement: 'h3',
                typeProperty: 'type',
                titleProperty: 'title',
                urlProperty: 'href',
            };
            blueimp.Gallery(links, options);
        };
    }
}