import React, { useState, useEffect } from "react";
import "../styles/MainContainer.css"; // Import the CSS file for MainContainer

function MainContainer(props) {
  const { apiKey, selectedCity } = props;
  const [weatherProcessed, setWeatherProcessed] = useState(null);

  function formatDate(daysFromNow = 0) {
    let output = "";
    var date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    output += date.toLocaleString("en-US", { weekday: "long" }).toUpperCase();
    output += " " + date.getDate();
    return output;
  }

  // clears the states and stops running if no city is there
  useEffect(() => {
    if (!selectedCity || !selectedCity.lat || !selectedCity.lon) {
      setWeatherProcessed(null);
      return;
    }

    async function fetchForecast() {
      try {
        // actuall get the data
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${selectedCity.lat}&lon=${selectedCity.lon}&appid=${apiKey}`;
        const resp = await fetch(url);
        if (!resp.ok) throw new Error(`API error ${resp.status}`);
        const data = await resp.json();

        // group by date 
        const grouped = {};
        (data.list || []).forEach(entry => {
          const date = entry.dt_txt.split(" ")[0];
          if (!grouped[date]) grouped[date] = [];
          grouped[date].push(entry);
        });

        const dates = Object.keys(grouped).slice(0, 6); // get just the next 6
        const todayDate = dates[0];

        // for todays info
        const todayEntries = grouped[todayDate] || [];
        const todayPick = pickRepresentative(todayEntries) || data.list?.[0] || null;

        // build five day  
        const fiveDay = dates.slice(0, 5).map((date, index) => {
          const entries = grouped[date] || [];
          let minK = Infinity;
          let maxK = -Infinity;
          // find min/max temps 
          entries.forEach(e => {
            const minVal = e.main?.temp_min ?? e.main?.temp;
            const maxVal = e.main?.temp_max ?? e.main?.temp;
            // update minK / maxK accordingly
            if (typeof minVal === "number" && minVal < minK) minK = minVal;
            if (typeof maxVal === "number" && maxVal > maxK) maxK = maxVal;
          });
          // pick representative entry for icon/desc
          const rep = pickRepresentative(entries) || entries[0] || null;
          const icon = rep?.weather?.[0]?.icon ?? "";
          const desc = rep?.weather?.[0]?.description ?? "";
          // return day entry 
          return {
            date,
            label: formatDate(index),
            minK,
            maxK,
            icon,
            desc
          };
        });

        // set processed weather state
        setWeatherProcessed({
          today: todayPick
            ? {
              tempK: todayPick.main?.temp,
              icon: todayPick.weather?.[0]?.icon,
              desc: todayPick.weather?.[0]?.description
            }
            : null,
          fiveDay
        });
      } catch (err) {
        console.error("Error fetching weather data:", err);
      }
    }

    // initiate fetch
    fetchForecast();
  }, [selectedCity, apiKey]);

  function kToF(k) {
    return Math.round((k - 273.15) * 9 / 5 + 32);
  }
  
  // pick representative entry from a day's entries for daytime
  function pickRepresentative(entries) {
    if (!entries || entries.length === 0) return null;
    return (
      entries.find(e => e.weather?.[0]?.icon?.endsWith("d"))
    );
  }

  return (
    <div id="main-container">
      <div id="weather-container">
        <div className="header-section">
          <h1 className="main-title">Amazing amazing weather App</h1>
          {!selectedCity && <h3>You should enter in a city! </h3>}
        </div>
        {selectedCity && weatherProcessed && (
          <>
            {/* the section for today block */}
            <div id="today-weather">
              <div className="today-wrapper">
                {weatherProcessed.today && (
                  <>
                    <img
                      className="today-icon"
                      src={weatherProcessed.today.icon ? `/icons/${weatherProcessed.today.icon}.svg` : ""}
                    />
                    <div className="today-info">
                      <h2 id="today-city">{selectedCity.fullName || selectedCity.name || "Today"}</h2>
                      <p className="today-temp">
                        {weatherProcessed.today.tempK ? `${kToF(weatherProcessed.today.tempK)}°F` : "—"}
                      </p>
                      <p className="today-desc">{weatherProcessed.today.desc}</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* the five-day block */}
            <div id="five-day-forecast" aria-label="5 day forecast">
              {weatherProcessed.fiveDay.map((d) => (
                <div className="forecast-day" key={d.date}>
                  <h4 className="forecast-day-title">{d.label}</h4>
                  <img
                    className="forecast-icon"
                    src={d.icon ? `/icons/${d.icon}.svg` : ""}
                  />
                  <div className="forecast-day-content">
                    <p className="forecast-day-temps">{kToF(d.minK)}°F - {kToF(d.maxK)}°F</p>
                    <p className="forecast-day-desc">{d.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default MainContainer;