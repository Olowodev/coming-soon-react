import logo from './logo.png';
import './App.css';
import api from './requestMethods'
import { motion } from 'framer-motion'
import {FaFacebookF, FaInstagramSquare, FaTwitter} from 'react-icons/fa'
import { useEffect, useMemo, useState } from 'react';

export default function App() {

  const days = 10;
  const hours = 23;
  const minutes = 59;
  const seconds = 59;

  const [time, setTime] = useState(days * 24 * 3600 + hours * 3600 + minutes * 60 + seconds);
  const [values, setValues] = useState({
    email: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [focused, setFocused] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (focused === true) {
      setErrorMessage('');
    }
  }, [focused])

  const container = {
    initial: {
      opacity: 0
    },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.5
      }
    }
  }

  const rotate = {
    initial: {
      rotate: 0,
      scale: 0
    },
    animate: {
      scale: 1,
      rotate: 360,
      transition: {
        duration: 1,
        type: 'spring'
      }
    }
  }

  const bounceInLeft = {
    initial: {
      opacity: 0,
      x: -60 
    },
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 1,
        type: 'spring'
      }
    }
  }

  const bounceInRight = {
    initial: {
      opacity: 0,
      x: 60
    },
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 1,
        type: 'spring'
      }
    }
  }

  

  const remainTime = useMemo(() => {
    const days = Math.floor(time / 24 / 3600);
    const hours = Math.floor((time - days * 24 * 3600) / 3600);
    const minutes = Math.floor((time - days * 24 * 3600 - hours *3600) / 60);
    const seconds = (time - days * 24 * 3600 - hours * 3600) % 60;

    return  {
      days,
      hours,
      minutes,
      seconds
    }

  }, [time]);

  useEffect(() => {
    const interval  =setInterval(() => {
      setTime(time => time !== 0 ? time -1 : 0);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const onChange = (e) => {
    setValues({values, [e.target.name]: e.target.value})
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
      try {
        await api.post('/api/lead/', values)
        setErrorMessage('');
        setSubmitted(true);
        setLoading(false);
      } catch (err) {
          setSubmitted(false);
          setLoading(false);
          if (err.response.status === 409 ) {
            setErrorMessage(err.response.data);
          } 
          console.log(err)
      } 
  };



  const handleFocus = (e) => {
    setFocused(false)
  };

  const handleFocus1 = (e) => {
    setFocused(true)
  };

  
  return (
    <motion.div initial="initial" animate="animate" variants={container} className='home'>
      <motion.div variants={rotate} className='logo'>
        <img width={140} height={142} src={logo} alt= "The decal masters' logo" />
      </motion.div>
      <div className='timer'>
        <h1>{remainTime.days}<span>d</span></h1>
        <h1>{remainTime.hours}<span>h</span></h1>
        <h1>{remainTime.minutes}<span>m</span></h1>
        <h1>{remainTime.seconds}<span>s</span></h1>
      </div>
      <div className='container'>
        <motion.div variants={bounceInLeft} className='leftInfo'>
          <motion.h1>We are</motion.h1>
          <motion.h1>Coming Soon.</motion.h1>
        </motion.div>
        {submitted ? 
        <div className='success'>
          <motion.p variants={bounceInRight}>You&#39;re officially on the waitlist😁🎉</motion.p>
          <div className='successLine'></div>
        </div> 
        :
        <div className='form'>
          <form onSubmit={handleSubmit}>
            <label>Get notified when we launch</label>
            <div className='input' focused={focused.toString()}>
              <input required onBlur={handleFocus} onFocus={handleFocus1} value={values.email} onChange={onChange} name='email' type='email' placeholder='Email' />
              <button disabled={loading}>
                {loading ? <div className='ldsring'><div></div></div> : <span>Subscribe</span>}
              </button>
            </div>
            <span className='error'>{errorMessage}</span>
          </form>
        </div>
}
      </div>
      <div className='socials'>
        <a href='/'>
          <FaFacebookF className='social' style={{ fontSize: 20}} />
        </a>
        <a href='https://instagram.com/s.m.a.r.t.dev' target="_blank" rel="noopener noreferrer">
          <FaInstagramSquare className='social' style={{ fontSize: 20}} />
        </a>
        <a href='/'>
          <FaTwitter className='social' style={{ fontSize: 20}} />
        </a>
      </div>
      <div className='copyright'>
        &copy; Copyrights TheDecalMasters | All Rights Reserved
      </div>
    </motion.div>
  )
}
