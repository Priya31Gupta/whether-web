import '../css/landing.css';
import '../css/search-dic.css'
import WhetherDataCard from './WhetherDataCard';
import BackgroundImage from './BackgroundImage';
import { useState, useEffect } from 'react';
import  Animation  from './Animation';
import { TbMapSearch, TbMoon, TbSun, TbVolume,  TbVolumeOff } from 'react-icons/tb';
import { TbSearch } from 'react-icons/tb';
import {Card} from 'antd';
import axios from 'axios';
import Astronaut from '../assets/astranaut.png';
import SearchPlace from '../assets/location-not-found.png';
import LakeBackground from '../assets/lake-background.jpg';
import Loader from './Loader';
import { useTranslation } from "react-i18next";


export default function LandingPage(){
  const API_KEY = process.env.REACT_APP_API_KEY;
  const { t } = useTranslation();
  const [isDark, setIsDark] = useState(false);
  const [noData, setNoData] = useState();
  const [weatherData, setWeatherData] = useState([]);
  const [city, setCity] = useState();
  const [countryMatch,setCountryMatch]=useState([]);
  const [weatherIcon, setWeatherIcon] = useState(
    `https://openweathermap.org/img/wn/10n@2x.png`
  );
  const [loading, setLoading] = useState(false);
  const [backgroundSoundEnabled, setBackgroundSoundEnabled] = useState(true);
  const [searchString, setSearchString] = useState('');
  const [countries,setCountries]=useState([]);
  const [showDropdown, setDropDown] = useState(false);

  const myIP = (location) => {
    const { latitude, longitude } = location.coords;
    getWhetherData([latitude, longitude]);
  };

  const [currentLanguage, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'en';
  });


  const searchCountries=(input)=>{
    // const {value}=input.target;
    setDropDown(true)
    setSearchString(input);
    
    if(!input){          // created if-else loop for matching countries according to the input
      setCountryMatch([]);
    }

    else{
      let matches=countries.filter((country)=>{
        // eslint-disable-next-line no-template-curly-in-string
        const regex=new RegExp(`${input}`,"gi");
        // console.log(regex)
        return country.match(regex) || country.match(regex);
      });
      setCountryMatch(matches);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    getWhetherData(searchString);
  };

  // Setting theme according to device
  useEffect(() => {
    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      setIsDark(true);
    }

    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (event) => {
        setIsDark(event.matches);
      });
  }, [setIsDark]);

  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(()=>{
    const loadCountries=async()=>{
      const response= await axios.get("https://restcountries.com/v3.1/all");
      let arr = []
      response.data.forEach(element => {
        arr.push(element.name.official);
      });
      setCountries(arr);
    };

    loadCountries();
  }, []);


  window.addEventListener('load', function () {
    navigator.geolocation.getCurrentPosition(myIP);
  });

  const toggleDark = () => {
    setIsDark((prev) => !prev);
  };
  
  const getWhetherData = async (location) => {
    setLoading(true);
    let search_type = typeof location === 'string' ? `q=${location}` : `lat=${location[0]}&lon=${location[1]}`;
    const url =  `http://api.openweathermap.org/data/2.5/forecast`;
    
    try{
        const res = await axios.get(`${url}?${search_type}&appid=${API_KEY}&units=metric&cnt=5&exclude=hourly,minutely`);
        const whether_data = res.data;
        if (whether_data.cod !== '200') {
          setNoData('Location Not Found');
            setCity('Unknown Location');
            setTimeout(() => {
              setLoading(false);
            }, 500);
            return;
        }
        setWeatherData(whether_data);
        setTimeout(() => {
            setLoading(false);
          }, 500);
          setCity(`${whether_data.city.name}, ${whether_data.city.country}`);
          setWeatherIcon(
            `${
              'https://openweathermap.org/img/wn/' + whether_data.list[0].weather[0]['icon']
            }@4x.png`
          );
    }catch(e){
        setNoData('Location Not Found');
        setLoading(true);
        
    }
  }
    return (
        <>
          { loading && <Loader />}
            <div className='card'>
                <div className='form-container' style={{
                  backgroundImage: `url(${
                    weatherData ? BackgroundImage(weatherData) : LakeBackground
                  })`,
                  }}>
                    <div className="whether_data_search">
                        <div className='flex'>
                            <Animation />
                            <div className='toggle-container'>
                                <input 
                                    type='checkbox' 
                                    className='checkbox' 
                                    id='checkbox' 
                                    checked={isDark} 
                                    onChange={toggleDark} 
                                />
                              
                                <label htmlFor='checkbox' className='label'>
                                    <TbMoon 
                                        style={{
                                        color: '#a6ddf0',
                                        }}/>
                                    <TbSun 
                                        style={{
                                            color: '#f5c32c',
                                            }}
                                    />
                                    <div className='ball' />
                                </label>
                            </div> 
                            <div className='city'>
                                <TbMapSearch />
                                <p>{city ?? ('unknown-location')}</p>
                            </div>
                        </div>
                        <form className='search-div' onSubmit={handleSubmit}>
                            <h2 
                            style={{
                                marginRight: 'currentLanguage' === 'es' || 'fr' ? '10px' : '0px',
                            }}> {t("title")} </h2>
                            <div className='search-bar'>
                                <input 
                                    value={searchString} 
                                    required
                                    onChange={(e)=>{
                                      searchCountries(e.target.value);
                                    }}
                                    className="input_search"/>
                                <button className='s-icon'>
                                    <TbSearch
                                    onClick={() => {
                                      getWhetherData(searchString);
                                    }}
                                    />
                                </button>
                            </div>
                        </form>
                        
                      <div className="list-dropdown">
                        { showDropdown && countryMatch && countryMatch.map((item,index)=>(
                          <div className='list-option' key={index} 
                          onClick={() => { 
                            setSearchString(item);
                            setDropDown(false);
                          }}>
                            <Card title={`Country: ${item}`}>
                            </Card>
                          </div>
                        ))} 
                      </div>
                      <button
                        className='s-icon sound-toggler'
                        onClick={() => setBackgroundSoundEnabled((prev) => !prev)}
                      >
                        {backgroundSoundEnabled ? <TbVolume /> : <TbVolumeOff />}
                      </button>
                    </div>
                </div>
                <>
                  <div className='whether_data'>
                      
                      {weatherData.length === 0 ? 
                        (
                            <div className='data-card'>
                              <div className='nodata'>
                              <h1>{noData ?? 'No Data'}</h1>
                              { noData === 'Location Not Found' ? (
                                <>
                                  <img
                                    src={Astronaut}
                                    alt='an astronaut lost in the space'
                                  />
                                  <p className='no-data-text'>Oh oh! We're lost in space finding that place.</p>
                                </>
                              ) : (
                                <>
                                  <img
                                    src={SearchPlace}
                                    alt='a person thinking about what place to find'
                                  />
                                  <p className='no-data-text'>
                                    Don't worry, if you don't know what to search for, try:
                                    Dhaka, Canada or maybe USA. {noData === 'Location Not Found'}
                                  </p>
                                </>
                              )}
                              </div>
                            </div>
                        ):
                        <WhetherDataCard  
                          data = { weatherData }
                          weatherIcon = {weatherIcon}
                          city = {city}
                          soundEnabled = {backgroundSoundEnabled}
                          currentLanguage={currentLanguage}
                          getWhetherData = {getWhetherData}
                          setLanguage = {setLanguage}
                        />
                      }
                  </div>
                </>
                
            </div>
        </>
    )
}