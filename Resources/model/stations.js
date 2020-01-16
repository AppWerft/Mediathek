module.exports = {
    dlf : {
        color : '#006AB3',
        darkcolor : '#00338B',
        id: 3,
        name: 'Deutschlandfunk',
        /* für Tagesübersicht, wird auch in der Mediathek genutzt und einaml täglich über
         einen Hintergrundprozess gesynct*/
        dayplan: 'http://www.deutschlandfunk.de/programmvorschau.281.de.rss',
        /* für LiveRadio, eigentlicher Stream wird ermittelt und gespeichert*/
        stream : 'http://st01.dlf.de/dlf/01/128/mp3/stream.mp3',
        /* wird jede Minute aufgerufen, wenn View aktiv ist */
        mediathek : 'http://srv.deutschlandradio.de/aodlistaudio.1706.de.rpc?drau:station_id=4&drau:from=_DATE_&drau:to=_DATE_&drau:page=1&drau:limit=100'
    },
    drk : {
        color : '#E95D0F',
        id:4,
        darkcolor : '#A51400',
        name : 'Deutschlandfunk Kultur',
        dayplan: 'http://www.deutschlandradiokultur.de/programmvorschau.282.de.rss',
        stream : 'http://dradio-edge-1093.dus-dtag.cdn.addradio.net/dradio/kultur/live/mp3/128/stream.mp3',
        mediathek : 'http://srv.deutschlandradio.de/aodlistaudio.1706.de.rpc?drau:station_id=3&drau:from=_DATE_&drau:to=_DATE_&drau:page=1&drau:limit=100'
    },
    drw : {
        color : '#01953C',
        darkcolor : '#006900',
        name :'Deutschlandfunk Nova',
        meta : 'https://www.deutschlandfunknova.de/actions/dradio/playlist/onair',
        stream : 'http://st03.dlf.de/dlf/03/128/mp3/stream.mp3',
        mediathek : 'http://srv.deutschlandradio.de/aodlistaudio.1706.de.rpc?drau:station_id=1&drau:from=_DATE_&drau:to=_DATE_&drau:page=1&drau:limit=500'
    }
};

