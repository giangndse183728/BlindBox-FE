import React, { useEffect, useState, Suspense, lazy } from 'react'
import { Button, Grid, Typography, Card, CardMedia, CardContent, Box } from '@mui/material';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import './HomepageStyle.css'
import AOS from 'aos';
import 'aos/dist/aos.css';
import BigText from '../../components/Text/BigText';
import { yellowGlowAnimation } from '../../components/Text/YellowEffect';
import LoadingScreen from '../../components/Loading/LoadingScreen';
import ButtonCus from '../../components/Button/ButtonCus';
import GlassCard from '../../components/Decor/GlassCard';
const ThreeCus = lazy(() => import('./ThreeCusBanner'));

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    // Initialize AOS
    AOS.init({
      duration: 800,
      once: true
    });

    // Load fonts using Web Font Loader
    window.WebFontConfig = {
      custom: {
        families: ['Stalinist One', 'Jersey 15', 'RocknRoll One', 'Yusei Magic'],
        urls: [
          'https://fonts.googleapis.com/css2?family=Stalinist+One&display=swap',
          // Add other font URLs as needed
        ]
      },
      active: () => {
        setFontsLoaded(true);
      },
      inactive: () => {
        // Fallback in case fonts fail to load
        setFontsLoaded(true);
      }
    };

    // Load WebFontLoader script
    const wf = document.createElement('script');
    wf.src = 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js';
    wf.async = true;
    document.head.appendChild(wf);
  }, []);

  // Update loading state when both video and fonts are loaded
  useEffect(() => {
    if (videoLoaded && fontsLoaded) {
      setIsLoading(false);
    }
  }, [videoLoaded, fontsLoaded]);

  // Add new state and effect for scroll handling
  const [scale, setScale] = React.useState(1);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      // Adjust these values to control the zoom effect
      const newScale = 1 + (scrollPosition * 0.001);
      setScale(Math.min(newScale, 1.5)); // Limit maximum zoom to 1.5x
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const LazyImage = ({ src, alt, ...props }) => {
    return (
      <img 
        src={src} 
        alt={alt} 
        width={90}
        height={90}
        loading="lazy" 
        {...props} 
      />
    );
  };

  return (
    <>
      {isLoading && <LoadingScreen />}
      <Box sx={{ position: 'relative', overflow: 'hidden', width: '100%', height: '100vh' }}>
        <video 
          src="/assets/BannerVid.webm"
          autoPlay
          muted
          loop
          playsInline
          width="100%"
          preload="metadata"
          onLoadedData={() => setVideoLoaded(true)}
          style={{
            position: 'absolute',
            top: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: `scale(${scale})`,
            transition: 'transform 0.1s ease-out',
          }}
        />
      </Box>
      <Grid container component="main" >
        <Box
          sx={{
            position: 'fixed',  // Changed to 'fixed' to make it stick to the viewport
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: 'url(/assets/background.jpeg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            overflow: 'hidden',
            zIndex: -2,



          }}
        />
        <BigText text=" Customized Accessories, Blind Box Trading, and More ..." />

        <Grid item xs={12} sx={{ overflow: 'hidden', position: 'relative' }}>
          <div className="sliding-container">
            {[...Array(3)].map((_, index) => (
              <Typography
                key={index}
                fontFamily="Stalinist One"
                variant='h1'
                className="glitch-text"
                data-text=" Crafting Dreams / Into Reality /"
                sx={{
                  mb: 2,
                  textAlign: "center",
                  color: "white",
                  position: 'relative',
                  display: 'inline-block',
                  whiteSpace: 'nowrap',
                  mx: 4
                }}
              >
                Crafting Dreams / Into Reality /
              </Typography>
            ))}
          </div>
        </Grid>

        <Suspense fallback={<LoadingScreen />}>
  <ThreeCus />
</Suspense>



        <Grid container component="main" sx={{ mt: 4}}>
        <Grid item xs={6} >
        <div className="sketchfab-embed-wrapper"> 
        <iframe
    title="Sketchfab Model"
    src="https://sketchfab.com/models/3764a2442eca43c7bbe64d8297d84905/embed?autospin=1&autostart=1&preload=1&transparent=1&ui_animations=0&ui_infos=0&ui_stop=0&ui_inspector=0&ui_watermark_link=0&ui_watermark=0&ui_hint=0&ui_ar=0&ui_help=0&ui_settings=0&ui_vr=0&ui_fullscreen=0&ui_annotations=0&dnt=1"
    width="800"
    height="600"
    loading="lazy"
    allow="accelerometer; gyroscope; autoplay; fullscreen; xr-spatial-tracking"
    allowFullScreen
    mozallowfullscreen="true"
    webkitallowfullscreen="true"
    style={{ border: "none" }}
    className="my-frame"
    xr-spatial-tracking="true"
    execution-while-out-of-viewport="true"
    execution-while-not-rendered="true"
    web-share="true"
/>

 </div>
          </Grid>
        <Grid item xs={5} data-aos="fade-up">
            <Typography  fontFamily="'Jersey 15', sans-serif" variant='h3' sx={{ mb: 4, ...yellowGlowAnimation}}>Discover the Thrill of Mystery <br/> Buy & Sell Blind Boxes!</Typography>

            <Typography variant="subtitle1" color='white'>
            Welcome to the ultimate marketplace for blind box enthusiasts! Our platform connects buyers and sellers in an exciting world of mystery and surprise. Whether you're looking to unbox rare collectibles or sell your own mystery sets, we make it easy, secure, and fun. Explore endless possibilities, trade with confidence, and experience the joy of the unknown. Start your blind box journey today!
            </Typography>
            <Grid container sx={{ mt: 4 }}>
              <Grid item xs={4}  >
              <ButtonCus variant="button-22" width="150px"> Shop Now </ButtonCus>
            
              </Grid>
              <Grid item xs={4} >
              <ButtonCus variant="button-22" width="150px"> Shop Now </ButtonCus>
                 
              </Grid>
              <Grid item xs={4} >
              <Typography color='white' sx={{ ...yellowGlowAnimation}} variant="h4" fontFamily="'Jersey 15', sans-serif">***************</Typography>
              </Grid>
            </Grid>
            

    
      <GlassCard sx={{ mt: 5, width: '60%' }}> 
      <Grid container spacing={2}>
        {/* Column 1 */}
        <Grid item xs={4}>
          <Typography fontFamily="'Jersey 15', sans-serif" variant="h5" sx={{ color: 'white' }}>
            Up to 10K Customers
          </Typography>
        </Grid>
        
        {/* Column 2 */}
        <Grid item xs={4}>
          <Typography fontFamily="'Jersey 15', sans-serif" variant="h5" sx={{ color: 'white' }}>
            Up to 1K Products
          </Typography>
        </Grid>
        
        {/* Column 3 */}
        <Grid item xs={4}>
          <Typography fontFamily="'Jersey 15', sans-serif" variant="h5" sx={{ color: 'white' }}>
            Up to 1M Followers
          </Typography>
        </Grid>
      </Grid>
      </GlassCard>

    
          </Grid>
        </Grid>

        







        <Grid item xs={12} data-aos="fade-up" >
          <Typography fontFamily="'Jersey 15', sans-serif" variant='h3' sx={{ mt: 5, textAlign: "center", color: "white" }}>  🕹 Collection  </Typography>

          <Typography variant='subtitle1' sx={{ mt: 2, mb: 3, mx: 20, textAlign: "center", color: "white" }} data-aos="fade-up" data-aos-delay="200">  Explore Our Exclusive Blind Box Collection: Discover limited-edition and rare collectibles from top brands like Pop Mart, Tokidoki, BE@RBRICK, and more. Each blind box is offered by trusted sellers at great prices, bringing you the thrill of surprise and exceptional value. Start your collection today! </Typography>

          <Stack direction="row" spacing={10} justifyContent="center" sx={{ mb: 3 }} data-aos="fade-up" data-aos-delay="400">
          <Avatar sx={{ width: 90, height: 90 }}>
        <LazyImage 
          src='https://i.ebayimg.com/images/g/6bsAAOSwFlVhJpnu/s-l400.jpg' 
          alt="Avatar 1" 
        />
      </Avatar>
      <Avatar sx={{ width: 90, height: 90 }}>
        <LazyImage 
          src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHT7EIqHbuwCvGxYZpWf6M43MNxDxp3OpARg&s' 
          alt="Avatar 2" 
        />
      </Avatar>
      <Avatar sx={{ width: 90, height: 90 }}>
        <LazyImage 
          src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxkuZjIic131BsGapQEt-YWOKUX3WodyFr_A&s' 
          alt="Avatar 3" 
        />
      </Avatar>
      <Avatar sx={{ width: 90, height: 90 }}>
        <LazyImage 
          src='https://www.tokidoki.it/cdn/shop/files/tokidoki_logo_pumpkin_carving_thumbnail.jpg?v=1634074134' 
          alt="Avatar 4" 
        />
      </Avatar>
      <Avatar sx={{ width: 90, height: 90 }}>
        <LazyImage 
          src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdv_Xuqk4HLZ0IJVmMJk1yUxqmtMssH0XNcA&s' 
          alt="Avatar 5" 
        />
      </Avatar>
      <Avatar sx={{ width: 90, height: 90 }}>
        <LazyImage 
          src='https://firmatodesign.com/cdn/shop/collections/MMC-KAWS_1200x1200_png.webp?v=1677510790' 
          alt="Avatar 6" 
        />
      </Avatar>
          </Stack>
          <Divider sx={{ width: "50%", margin: '0 auto', borderColor: 'white' }}>♱</Divider>
        </Grid>

      </Grid>


    </>
  )
}

