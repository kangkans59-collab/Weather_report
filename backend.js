let weatherData=null;
const rainfall=document.getElementById("rainfall");

for(let i=0;i<24;i++){
    const card =document.createElement("div");
    card.className="rainfallContent";
    rainfall.appendChild(card);
}

async function loadData(place){
      const locationResponse = await fetch(`https://nominatim.openstreetmap.org/search?q=${(place)}&format=jsonv2`);
      const locationData = await locationResponse.json();

      if(locationData.length==0){
        return null;
      }

      const latitude = locationData[0].boundingbox[0];
      const longitude = locationData[0].boundingbox[3];



      const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m,pressure_msl,visibility,is_day&hourly=temperature_2m,precipitation_probability&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto`);
      const data = await response.json();
    




      return data;
    
}

async function returnData(place) {
    const placeName=place.slice(0,1).toUpperCase()+place.slice(1).toLowerCase();

    weatherData=await loadData(placeName);


    if(weatherData==null){
        document.getElementById("temperature").textContent="";
        for(let i=0;i<5;i++){
           document.getElementsByClassName("result")[i].textContent=""; 
        }
        document.getElementById("error").textContent="We could not find the place";
        throw new Error("Invalid place");
    }

    const temperature=weatherData.current.temperature_2m;
    const feelsLike=weatherData.current.apparent_temperature;
    const humidity=weatherData.current.relative_humidity_2m;
    const windSpeed=weatherData.current.wind_speed_10m;
    const pressure=weatherData.current.pressure_msl;
    const visibility=weatherData.current.visibility;

    const date = new Date();



    let year = String(date.getFullYear());
    let month = String(date.getMonth()+1);
    let day = String(date.getDate());
    let hour = String(date.getHours());
    let time=hour;
    let time_hold=time;

    if(month.length==1){
        month=month.padStart(2,"0");
    }
    if(day.length==1){
        day=day.padStart(2,"0");
    }
    if(hour.length==1){
        hour=hour.padStart(2,"0");
    }

    const curr_date=`${year}-${month}-${day}T${hour}:00`;
    const timeIndex=weatherData.hourly.time.indexOf(curr_date);

    let j=0;
    let am_pm="am";
    time=Number(time);
    time_hold=Number(time_hold);
    for(let i=timeIndex;i<=timeIndex+23;i++){
        if(time_hold==25){
           time_hold=1;
        }

        if(time_hold>=12){
             am_pm="pm";
        }
        else{
            am_pm="am";
        }

        if(time_hold==24){
            am_pm="am";
        }


        let rain_percent=weatherData.hourly.precipitation_probability[i];
        document.getElementsByClassName("rainfallContent")[j].textContent=(time%12)+am_pm+"    "+weatherData.hourly.precipitation_probability[i]+"%";
        document.getElementsByClassName("rainfallContent")[j].innerHTML = `
            <p>${time%12}${am_pm}</p>
            <br>
            <p>${rain_percent}%</p>
        `

        j++;
        time_hold++;
        time++;

    }

    document.getElementById("temperature").textContent= temperature+"°c";
    document.getElementById("relTempRes").textContent= feelsLike+"°C";
    document.getElementById("humRes").textContent= humidity+"%";
    document.getElementById("windRes").textContent= windSpeed+"km/h";
    document.getElementById("presRes").textContent= pressure+"hPa";
    document.getElementById("visRes").textContent= (visibility/1000)+"km";




}

document.getElementById("submitButton").onclick=function(){
                                                    document.getElementById("temperature").textContent="Loading...";
                                                    document.getElementById("error").textContent="";
                                                    for(let i=0;i<5;i++){
                                                        document.getElementsByClassName("result")[i].textContent="Loading...";
                                                    }
                                                    for(let i=0;i<24;i++){
                                                        document.getElementsByClassName("rainfallContent")[i].textContent="";
                                                    }
                                                    returnData(document.getElementById("placeInfo").value);}


