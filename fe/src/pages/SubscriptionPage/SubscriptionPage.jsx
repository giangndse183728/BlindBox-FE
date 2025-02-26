import React from "react";
import GlassCard from "../../components/Decor/GlassCard";
import ButtonCus from '../../components/Button/ButtonCus';

const SubscriptionPage = () => {
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

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '2rem', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundImage: `url(/assets/background.jpeg)`, backgroundSize: 'cover', backgroundPosition: 'center', overflow: 'hidden', zIndex: -2 }}>
            <div style={{ width: '100%', maxWidth: '1200px', padding: '1.5rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white', marginBottom: '1.5rem' }}>Available Plans</h1>
                <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
                    {plans.map((plan, index) => (
                        <GlassCard key={index} style={{ padding: '1.5rem', width: '100%', maxWidth: '400px', marginLeft: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'white', marginBottom: '1rem' }}>{plan.title}</h2>
                            <p style={{ fontSize: '1.125rem', color: '#a0aec0', marginBottom: '1rem' }}>{plan.price}</p>
                            <ul style={{ color: '#718096', listStyleType: 'none', padding: 0 }}>
                                {plan.features.map((feature, i) => (
                                    <li key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>{feature}</li>
                                ))}
                            </ul>
                            <ButtonCus variant="button-22" width="150px">Trade Now</ButtonCus>
                        </GlassCard>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SubscriptionPage;
