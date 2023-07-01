import {gsap} from 'gsap';
import '../css/animation.css';

export default function Animation(){
    gsap.fromTo('.logo',{opacity:0, x:-30 }, {opacity: 1 , x: 0 , duration: 2 })
    return (
    <div className='logo'>Know Your Weather<br></br></div>)
}