import React, { useState, useEffect } from "react";
import "../styles/MainContainer.css"; // Import the CSS file for MainContainer

function MainContainer(props) {
  const { apiKey, selectedCity } = props;

  const [weatherRaw, setWeatherRaw] = useState(null);
  const [weatherProcessed, setWeatherProcessed] = useState(null); // { today: {...}, fiveDay: [...] }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function formatDate(daysFromNow = 0) {
    let output = "";
    var date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    output += date.toLocaleString("en-US", { weekday: "long" }).toUpperCase();
    output += " " + date.getDate();
    return output;
  }

  /*
  STEP 1: IMPORTANT NOTICE!

  Before you start, ensure that both App.js and SideContainer.js are complete. The reason is MainContainer 
  is dependent on the city selected in SideContainer and managed in App.js. You need the data to flow from 
  App.js to MainContainer for the selected city before making an API call to fetch weather data.
  */

  /*
  STEP 2: Manage Weather Data with State.
  
  Just like how we managed city data in App.js, we need a mechanism to manage the weather data 
  for the selected city in this component. Use the 'useState' hook to create a state variable 
  (e.g., 'weather') and its corresponding setter function (e.g., 'setWeather'). The initial state can be 
  null or an empty object.
  */


  /*
  STEP 3: Fetch Weather Data When City Changes.
  
  Whenever the selected city (passed as a prop) changes, you should make an API call to fetch the 
  new weather data. For this, use the 'useEffect' hook.

  The 'useEffect' hook lets you perform side effects (like fetching data) in functional components. 
  Set the dependency array of the 'useEffect' to watch for changes in the city prop. When it changes, 
  make the API call.

  After fetching the data, use the 'setWeather' function from the 'useState' hook to set the weather data 
  in your state.
  */
 // useEffect to fetch weather data when selectedCity changes
  useEffect(() => {
    if (!selectedCity || !selectedCity.lat || !selectedCity.lon) {
      setWeatherRaw(null);
      setWeatherProcessed(null);
      return;
    }

    // AbortController to cancel fetch if component unmounts or city changes
    const controller = new AbortController();

    async function fetchForecast() {
      setLoading(true);
      setError(null);
      try {
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${selectedCity.lat}&lon=${selectedCity.lon}&appid=${apiKey}`;
        const resp = await fetch(url, { signal: controller.signal });
        if (!resp.ok) throw new Error(`API error ${resp.status}`);
        const data = await resp.json();
        // set raw data
        setWeatherRaw(data);

        // group by date (YYYY-MM-DD)
        const grouped = {};
        (data.list || []).forEach(entry => {
          const date = entry.dt_txt.split(" ")[0];
          if (!grouped[date]) grouped[date] = [];
          grouped[date].push(entry);
        });

        const dates = Object.keys(grouped).slice(0, 6); // include today + next 5, slice if needed
        const todayDate = dates[0];

        // build today's representative entry
        const todayEntries = grouped[todayDate] || [];
        const todayPick = pickRepresentative(todayEntries) || data.list?.[0] || null;

        // build five day (next up to 5 unique calendar days; exclude today if you want tomorrow-first)
        const fiveDates = dates.slice(0, 5); // change to slice(1,6) to skip today
        const fiveDay = fiveDates.map(date => {
          const entries = grouped[date] || [];
          // compute min/max using entry.main.temp_min / temp_max when present, otherwise temp
          let minK = Infinity;
          let maxK = -Infinity;
          // find min/max temps for each days subsets 
          entries.forEach(e => {
            // use main.temp_min / temp_max if present, otherwise use main.temp
            const minVal = e.main?.temp_min ?? e.main?.temp;
            const maxVal = e.main?.temp_max ?? e.main?.temp;
            // update minK / maxK accordingly
            if (typeof minVal === "number" && minVal < minK) minK = minVal;
            if (typeof maxVal === "number" && maxVal > maxK) maxK = maxVal;
          });
          // fallback if min/max not found set to first entry temp
          if (!isFinite(minK) && entries[0]) minK = entries[0].main?.temp;
          if (!isFinite(maxK) && entries[0]) maxK = entries[0].main?.temp;

          // pick representative entry for icon/desc
          const rep = pickRepresentative(entries) || entries[0] || null;
          const icon = rep?.weather?.[0]?.icon ?? "";
          const desc = rep?.weather?.[0]?.description ?? "";
          // return processed day entry with date, label, minK, maxK, icon, desc
          return {
            date,
            label: new Date(date).toLocaleString("en-US", { weekday: "long" }).toUpperCase(),
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
        if (err.name !== "AbortError") {
          setError(err.message || "Failed to fetch");
        }
      } finally {
        setLoading(false);
      }
    }

    // initiate fetch
    fetchForecast();
    return () => controller.abort();
  }, [selectedCity, apiKey]);
  function kToF(k) {
    return Math.round((k - 273.15) * 9 / 5 + 32);
  }
  // pick representative entry from a day's entries (daytime if possible, else any daytime, else any entry)
  function pickRepresentative(entries) {
    if (!entries || entries.length === 0) return null;
    return (
      entries.find(e => e.dt_txt.includes("12:00:00") && e.weather?.[0]?.icon?.endsWith("d")) ||
      entries.find(e => e.weather?.[0]?.icon?.endsWith("d")) ||
      entries.find(e => e.dt_txt.includes("12:00:00")) ||
      entries[0]
    );
  }


  // Render
  return (
    <div id="main-container">
      <div id="weather-container">
        <h1>Weather App</h1>

        {selectedCity && loading && <p>Loading weather...</p>}
        {selectedCity && error && <p className="error">Error: {error}</p>}

        {selectedCity && !loading && !error && weatherProcessed && (
          <>
            {/* Today block */}
            <div id="today-weather">
              <div className="today-wrapper">
                {weatherProcessed.today && (
                  <>
                    <img
                      className="today-icon"
                      src={weatherProcessed.today.icon ? `/icons/${weatherProcessed.today.icon}.svg` : ""}
                      alt={weatherProcessed.today.desc || "weather icon"}
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

            {/* Five-day */}
            <div id="five-day-forecast" aria-label="5 day forecast">
              {weatherProcessed.fiveDay.map((d) => (
                <div className="forecast-day" key={d.date}>
                  <img
                    className="forecast-icon"
                    src={d.icon ? `/icons/${d.icon}.svg` : ""}
                    alt={d.desc || "icon"}
                  />
                  <div className="forecast-day-content">
                    <h4 className="forecast-day-title">{d.label}</h4>
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