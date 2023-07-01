import '../css/whether-data-card.css';
import { RiCelsiusFill, RiFahrenheitFill } from 'react-icons/ri';
import { useState, useMemo, useEffect } from 'react';
import moment from 'moment';
import BackgroundSound from './BackgroundMusic';
import { useTranslation } from "react-i18next";
import '../languages/i18n.js';


export default function WhetherDataCard({data, weatherIcon, city, soundEnabled, setLanguage, currentLanguage, getWhetherData}){
    const { clouds, main, weather } = data.list[0] || null;
    const [isFahrenheitMode, setIsFahrenheitMode] = useState(false);
    const { t, i18n } = useTranslation();
    
    const day_icon = (icon) => {
      return `${
        'https://openweathermap.org/img/wn/' + icon
      }@2x.png`;
    }

    const degreeSymbol = useMemo(
      () => (isFahrenheitMode ? '\u00b0F' : '\u00b0C'),
      [isFahrenheitMode]
    );
    const toggleFahrenheit = () => {
      setIsFahrenheitMode(!isFahrenheitMode);
    };

    const formattedData =  useMemo(() => {
      return {
        temp: Math.round(
          isFahrenheitMode ? convertToFahrenheit(main.temp) : main.temp
        ),
        feels_like: Math.round(
          isFahrenheitMode
            ? convertToFahrenheit(main.feels_like)
            : main.feels_like
        ),
        temp_min: Math.round(
          isFahrenheitMode ? convertToFahrenheit(main.temp_min) : main.temp_min
        ),
        temp_max: Math.round(
          isFahrenheitMode ? convertToFahrenheit(main.temp_max) : main.temp_max
        ),
      };
    }, [
      isFahrenheitMode,
      main.feels_like,
      main.temp,
      main.temp_max,
      main.temp_min,
    ]);
    
    function convertToFahrenheit(celsius) {
      return (celsius * 9) / 5 + 32;
    }

    const formatData = (temp) => {
     return  Math.round(
        isFahrenheitMode ? convertToFahrenheit(temp) : temp
      )
    }

    const changeLanguage = (value, location) => {
      i18n
        .changeLanguage(value)
        .then(() => setLanguage(value) && getWhetherData(location))
        .catch((err) => console.log(err));
    };
  
    const handleLanguage = (event) => {
      changeLanguage(event.target.value);
      localStorage.setItem('language', event.target.value);
    };

    useEffect(() => {
      if (currentLanguage === 'en') return;
  
      changeLanguage(currentLanguage);
      // eslint-disable-next-line
    }, [currentLanguage]);

    return (
        <div className="data-card">
            <div className='flex'>
                 <select className='language-select-box' onChange={(e) => setLanguage(e.target.value)}>
                  <option defaultValue value='en'>English</option>
                  <option value='es'>Español</option>
                  <option value='fr'>Français</option>
                  <option value='id'>Indonesia</option>
                  <option value='ta'>தமிழ்</option>
                  <option value='zh'>简体中文</option>
                  <option value='ukr'>Ukrainian</option>
                  <option value='es'>{t('languages.es')}</option>
                  <option value='fr'>{t('languages.fr')}</option>
                  <option value='id'>{t('languages.id')}</option>
                  <option value='it'>{t('languages.it')}</option>
                  <option value='ta'>{t('languages.ta')}</option>
                  <option value='bn'>{t('languages.bn')}</option>
                  <option value='zh'>{t('languages.zh')}</option>
                  <option value='ptBR'>{t('languages.ptBR')}</option>
                  <option value='sw'>{t('languages.sw')}</option>
                  <option value='neNP'>{t('languages.neNP')}</option>
                  <option value='he'>{t('languages.he')}</option>
                  <option value='hnd'>{t('languages.hnd')}</option> 
                </select> 
                 <div className='toggle-container'>
                    <input 
                      type='checkbox' 
                      className='checkbox' 
                      id='fahrenheit-checkbox' 
                      onChange={toggleFahrenheit}/>
                    <label htmlFor='fahrenheit-checkbox' className='label'>
                        <RiFahrenheitFill />
                        <RiCelsiusFill />
                        <div className='ball' />
                    </label>
                </div> 
            </div>
            <h2 className='sub-header'>{t('today')}</h2>
            <div className='whether-data-card'>
              <div className='clouds'>
                  <p className='celsius'>
                      {formattedData.temp}
                      {degreeSymbol}
                  </p>
                  <div className='cloud-icon'>
                      {weather[0].main}
                      <img src={weatherIcon}  alt='whether-icon' />
                  </div>
                  <p className='des'>
                      <span>{weather[0].description.toUpperCase()}</span>
                  </p>
                  <p className='time'>
                      <span>{moment().format('dddd MMM YYYY')}</span>
                  </p>
              </div>
              <div className='more-info'>
                  <p className=''>
                  {t('realFeel')}:{' '}
                    <span>
                        {formattedData.feels_like}
                        {degreeSymbol}
                    </span>
                  </p>
                  <p className=''>
                  {t('humidity')}:: <span>{main.humidity}%</span>
                  </p>
                  <p className=''>
                  {t('cover')}: <span>{clouds.all}%</span>
                  </p>
                  <p className=''>
                  {t('min-temp')}:{' '}
                      <span>
                          {formattedData.temp_min}
                          {degreeSymbol}
                      </span>
                  </p>
                  <p className=''>
                  {t('max-temp')}:{' '}
                      <span>
                          {formattedData.temp_max}
                          {degreeSymbol}
                      </span>
                  </p>
              </div>
            </div>
            <h2 className='sub-header'>{t("more-on")} {city}</h2>
            <div className='whether-data-card flex summary-cont'>
                  {
                    data.list.map(day => <div key={day.dt} className='summary-card'>
                        <p className='celsius'>
                          {formatData(day.main.temp)}
                          {degreeSymbol}
                        </p>
                        <p className='flex'>
                          <span>{day.weather[0].main}</span>
                          <img className='whether-icon' src={day_icon(day.weather[0]['icon'])} alt='' />
                        </p>
                        <p className='des'>{day.weather[0].description.toUpperCase()}</p>
                        <p className=''>{moment(day.dt_txt).format('hh:mm a')}</p>
                      </div>)
                  }
            </div>
            <BackgroundSound weather={weather[0]} soundEnabled={soundEnabled} />
        </div>
    )
}