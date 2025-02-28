import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import GlassCard from "../../components/Decor/GlassCard";
import ButtonCus from '../../components/Button/ButtonCus';
import { Divider, Typography } from '@mui/material';
import { yellowGlowAnimation } from '../../components/Text/YellowEffect';

const SubscriptionPage = () => {
    const [selectedCard, setSelectedCard] = useState(null);
    const [cardHeight, setCardHeight] = useState(0);
    const cardRefs = useRef([]);

    const plans = [
        {
            title: "Basic Trader Plan",
            price: "$9.99/month",
            features: [
                "Post Limit: 10 trade posts/month",
                "Access to standard trading categories",
                "Basic analytics for post views",
                "Email notifications for inquiries",
            ],
        },
        {
            title: "Pro Trader Plan",
            price: "$19.99/month",
            features: [
                "Post Limit: 30 trade posts/month",
                "Access to premium trading categories",
                "Priority listing for trade posts",
                "Advanced analytics & insights",
                "Instant push notifications for inquiries",
            ],
        },
    ];
    useEffect(() => {
        const updateHeights = () => {
            const heights = cardRefs.current.map(ref => ref?.offsetHeight || 0);
            const maxHeight = Math.max(...heights);
            setCardHeight(maxHeight);
        };

        updateHeights();
        window.addEventListener("resize", updateHeights);
        return () => window.removeEventListener("resize", updateHeights);
    }, [plans]);


    return (
        <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            minHeight: '100vh', padding: '0.5rem 2rem 4rem 2rem', // top right bottom left
            position: 'fixed', top: 0, left: 0,
            width: '100%', height: '100%', backgroundImage: `url(/assets/background.jpeg)`,
            backgroundSize: 'cover', backgroundPosition: 'center', overflow: 'hidden',
            fontFamily: 'Yusei Magic'
        }}>
            <div style={{ width: '100%', maxWidth: '1200px', padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography
                    variant="h1"
                    sx={{
                        fontSize: '5rem',
                        fontWeight: 450,
                        mb: '0.5rem',
                        textAlign: 'center',
                        pl: '1.5rem',
                        fontFamily: '"Jersey 15", sans-serif',
                        color: "white",
                        // textShadow: '0 0 10px rgba(255,255,0,0.7), 0 0 20px rgba(255,255,0,0.5), 0 0 30px rgba(255,255,0,0.3)',
                    }}
                >
                    Available Plans
                </Typography>

                <img src="/assets/gif/star.gif" alt="Stars" style={{ width: '50px', height: 'auto', marginLeft: '10px' }} />
            </div>
            <div style={{ display: 'flex', gap: '9rem', justifyContent: 'center', flexWrap: 'wrap', width: '100%' }}>
                {plans.map((plan, index) => (
                    <motion.div
                        key={index}
                        initial={{ scale: 1 }}
                        animate={{ scale: selectedCard === index ? 1.1 : 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 10 }}
                        onMouseEnter={() => setSelectedCard(index)}
                        onMouseLeave={() => setSelectedCard(null)}
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '400px' }}
                    >
                        <GlassCard
                            ref={el => cardRefs.current[index] = el}
                            style={{
                                padding: '2rem', width: '100%', height: 'auto', minHeight: cardHeight - 70,
                                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                                boxShadow: selectedCard === index ? '0px 8px 20px rgba(253,252,196)' : 'none',
                                transition: 'box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out',

                                background: selectedCard === index
                                    ? 'rgba(242, 204, 13, 0.15)'
                                    : 'rgba(255, 255, 255, 0.1)',
                                border: selectedCard === index ? '2px solid #fdfcc4' : '2px solid rgba(255, 255, 255, 0.2)',
                                borderRadius: '16px'
                            }}
                        >
                            <Typography
                                fontFamily="'Jersey 15', sans-serif"
                                variant="h3"
                                sx={{
                                    fontSize: '3rem',
                                    fontWeight: 500,
                                    color: 'white',
                                    mb: '1rem',
                                    textAlign: 'left',
                                    textShadow: '0 0 10px rgba(255,255,0,0.7), 0 0 20px rgba(255,255,0,0.5), 0 0 30px rgba(255,255,0,0.3)',


                                }}
                            >
                                {plan.title}
                            </Typography>

                            <div style={{ flex: 1 }}>

                                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '2rem' }}>
                                    <ul style={{
                                        // color: '#718096',
                                        color: 'white',
                                        listStyleType: 'none',
                                        padding: 0,
                                        flex: 1
                                    }}>
                                        {plan.features.map((feature, i) => (
                                            <li key={i} style={{
                                                display: 'flex', alignItems: 'center', marginBottom: '0.5rem',
                                                minHeight: '30px', fontSize: '1rem',
                                            }}>
                                                <img src="/assets/pixel-heart.png" alt="Star" style={{ marginRight: '8px', width: '16px', height: '16px' }} />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                width: '100%',
                                marginTop: 'auto',
                            }}>
                                <Divider style={{ flex: 1, margin: '1rem 0', backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />
                                <Divider style={{ flex: 1, margin: '1rem 0', backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />
                            </div>
                            <div style={{ textAlign: 'center', marginTop: 'auto' }}>
                                <Typography
                                    variant="h2"
                                    sx={{
                                        fontSize: '2.5rem',
                                        fontWeight: 450,
                                        marginBottom: '2rem',
                                        color: 'white',
                                        fontFamily: '"Jersey 15", sans-serif',
                                        textAlign: 'center',
                                        ...yellowGlowAnimation,
                                    }}
                                >
                                    {plan.price}
                                </Typography>

                                <ButtonCus variant="button-22" width="300px">Join Now</ButtonCus>
                            </div>
                        </GlassCard>
                    </motion.div>
                ))}
            </div>
        </div >
    );
};

export default SubscriptionPage;
