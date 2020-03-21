const $map = document.querySelector('#map');
let map;

function initMap()
{  
    let map; 
    
    map = new google.maps.Map($map, {
        center: {
            lat: -10,
            lng: -60
        },
    zoom: 3,
    styles: [
        {
            "elementType": "geometry",
            "stylers": [
                {
                    "hue": "#ff4400"
                },
                {
                    "saturation": -68
                },
                {
                    "lightness": -4
                },
                {
                    "gamma": 0.72
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "labels.icon"
        },
        {
            "featureType": "landscape.man_made",
            "elementType": "geometry",
            "stylers": [
                {
                    "hue": "#0077ff"
                },
                {
                    "gamma": 3.1
                }
            ]
        },
        {
            "featureType": "water",
            "stylers": [
                {
                    "hue": "#00ccff"
                },
                {
                    "gamma": 0.44
                },
                {
                    "saturation": -33
                }
            ]
        },
        {
            "featureType": "poi.park",
            "stylers": [
                {
                    "hue": "#44ff00"
                },
                {
                    "saturation": -23
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "hue": "#007fff"
                },
                {
                    "gamma": 0.77
                },
                {
                    "saturation": 65
                },
                {
                    "lightness": 99
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "labels.text.stroke",
            "stylers": [
                {
                    "gamma": 0.11
                },
                {
                    "weight": 5.6
                },
                {
                    "saturation": 99
                },
                {
                    "hue": "#0091ff"
                },
                {
                    "lightness": -86
                }
            ]
        },
        {
            "featureType": "transit.line",
            "elementType": "geometry",
            "stylers": [
                {
                    "lightness": -48
                },
                {
                    "hue": "#ff5e00"
                },
                {
                    "gamma": 1.2
                },
                {
                    "saturation": -23
                }
            ]
        },
        {
            "featureType": "transit",
            "elementType": "labels.text.stroke",
            "stylers": [
                {
                    "saturation": -64
                },
                {
                    "hue": "#ff9100"
                },
                {
                    "lightness": 16
                },
                {
                    "gamma": 0.47
                },
                {
                    "weight": 2.7
                }
            ]
        }
    ]
});

return map;
};

map = initMap();

renderData();

async function getData()
{
    //const response = await fetch(' https://coronavirus-19-api.herokuapp.com/countries');
    const response = await fetch('https://wuhan-coronavirus-api.laeyoung.endpoint.ainize.ai/jhu-edu/latest');
    const data = await response.json();
    return data;
}

const info = new google.maps.InfoWindow();

function renderInfoData(item)
{ return `
        <p> <strong>${item.provincestate} ${item.countryregion}</strong> </p>
        <p>Confirmados: ${item.confirmed}</p>
        <p>Muertos: ${item.deaths}</p>
        <p>Recuperados: ${item.recovered}</p>
        <p>Fecha actualizado: ${item.lastupdate}</p>
    `
}

async function renderData ()
{
    const data = await getData();
    console.log(data);
    
    data.forEach(item => {
        if(item.confirmed)
        {
            const marker = new google.maps.Marker(
                {
                    position: 
                    {
                        lat: item.location.lat,
                        lng: item.location.lng,
                    },
                    map,
                    icon: './icon.png'
                }
            );
            
            marker.addListener('click', () => {
                info.setContent(renderInfoData(item));
                info.open(map, marker);
            })
        }     
    });
}