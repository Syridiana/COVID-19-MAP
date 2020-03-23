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
            "featureType": "all",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#ffffff"
                }
            ]
        },
        {
            "featureType": "all",
            "elementType": "labels.text.stroke",
            "stylers": [
                {
                    "color": "#000000"
                },
                {
                    "lightness": 13
                }
            ]
        },
        {
            "featureType": "administrative",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#000000"
                }
            ]
        },
        {
            "featureType": "administrative",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "color": "#144b53"
                },
                {
                    "lightness": 14
                },
                {
                    "weight": 1.4
                }
            ]
        },
        {
            "featureType": "landscape",
            "elementType": "all",
            "stylers": [
                {
                    "color": "#08304b"
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#0c4152"
                },
                {
                    "lightness": 5
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#000000"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "color": "#0b434f"
                },
                {
                    "lightness": 25
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#000000"
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "color": "#0b3d51"
                },
                {
                    "lightness": 16
                }
            ]
        },
        {
            "featureType": "road.local",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#000000"
                }
            ]
        },
        {
            "featureType": "transit",
            "elementType": "all",
            "stylers": [
                {
                    "color": "#146474"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "all",
            "stylers": [
                {
                    "color": "#021019"
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
    const response = await fetch('https://wuhan-coronavirus-api.laeyoung.endpoint.ainize.ai/jhu-edu/latest');
    const data = await response.json();
    return data;
}

async function getDataTwo()
{
    const response = await fetch('https://coronavirus-19-api.herokuapp.com/countries');
    const data = await response.json();
    return data;
}

const info = new google.maps.InfoWindow();

function renderInfoData(item, boolean)
{ 
    let stringToRender;

    if(boolean)
    {
        stringToRender = `
            <p> <strong>${item.country}</strong> </p>
            <p>Confirmados: ${item.cases}</p>
            <p>Muertos: ${item.deaths}</p>
            <p>Recuperados: ${item.recovered}</p>
            <p>Casos críticos: ${item.critical}</p>
            <p>Casos por millon: ${item.casesPerOneMillion}</p>
            `;
    }
    else
    {
        stringToRender = `
            <p> <strong>${item.provincestate} ${item.countryregion}</strong> </p>
            <p>Confirmados: ${item.confirmed}</p>
            <p>Muertos: ${item.deaths}</p>
            <p>Recuperados: ${item.recovered}</p>
            <p>Fecha actualizado: ${item.lastupdate}</p>
            `;
    }
    
    return stringToRender;
}

function RenderInfoCondition(item, dataTwo)
{
    dataTwo.some(element => {
        if(item.provincestate === "")
        {
            if(item.countryregion === element.country)
            {
                if(element.cases >= item.confirmed)
                {
                    info.setContent(renderInfoData(element, true));    
                    return element.country === item.countryregion;
                }
                else
                {
                    info.setContent(renderInfoData(item, false));
                }
            }
            else
            {
                info.setContent(renderInfoData(item, false));
            }
        }
        else
        {
            info.setContent(renderInfoData(item, false));
        }
    });
}

async function renderData ()
{
    const data = await getData();
    const dataTwo = await getDataTwo();
    console.log(data);
    console.log(dataTwo);
    
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
                RenderInfoCondition(item, dataTwo);
                info.open(map, marker);
            });
        }
    });
}

async function getTotalData()
{
    const response = await fetch('https://coronavirus-19-api.herokuapp.com/all');
    const data = await response.json();
    return data;
}

(async function totalConfirmedCases()
{
    const $pCases = document.getElementById('confirmedCasesP');
    const totalInfo = await getTotalData();
    console.log(totalInfo);

    $pCases.innerHTML = `${totalInfo.cases}`;
})();

(async function totalDeathsCases()
{
    const $pCases = document.getElementById('deathCasesP');
    const totalInfo = await getTotalData();

    $pCases.innerHTML = `${totalInfo.deaths}`;
})();

(async function totalRecoveredCases()
{
    const $pCases = document.getElementById('recoveredCasesP');
    const totalInfo = await getTotalData();

    $pCases.innerHTML = `${totalInfo.recovered}`;
})();