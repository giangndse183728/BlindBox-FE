import React from 'react';

const OrdersPage = () => {
    // Hardcoded blindbox orders data
    const getAllOrders = () => [
        {
            _id: '60d5f8b8e0e0f12345678901',
            accountId: '60d5f8b8e0e0f12345678902',
            totalPrice: 150.99,
            promotionId: '60d5f8b8e0e0f12345678903',
            status: 'Pending',
            createdAt: new Date('2025-03-01T10:00:00Z'),
            updatedAt: new Date('2025-03-02T12:00:00Z'),
        },
        {
            _id: '60d5f8b8e0e0f12345678904',
            accountId: '60d5f8b8e0e0f12345678905',
            totalPrice: 299.50,
            promotionId: '60d5f8b8e0e0f12345678906',
            status: 'Processing',
            createdAt: new Date('2025-03-02T14:30:00Z'),
            updatedAt: new Date('2025-03-03T09:15:00Z'),
        },
        {
            _id: '60d5f8b8e0e0f12345678907',
            accountId: '60d5f8b8e0e0f12345678908',
            totalPrice: 89.99,
            promotionId: '60d5f8b8e0e0f12345678909',
            status: 'Shipped',
            createdAt: new Date('2025-03-03T08:45:00Z'),
            updatedAt: new Date('2025-03-04T11:00:00Z'),
        },
        {
            _id: '60d5f8b8e0e0f1234567890a',
            accountId: '60d5f8b8e0e0f1234567890b',
            totalPrice: 450.00,
            promotionId: '60d5f8b8e0e0f1234567890c',
            status: 'Delivered',
            createdAt: new Date('2025-03-04T13:20:00Z'),
            updatedAt: new Date('2025-03-05T15:30:00Z'),
        },
        {
            _id: '60d5f8b8e0e0f1234567890d',
            accountId: '60d5f8b8e0e0f1234567890e',
            totalPrice: 199.95,
            promotionId: '60d5f8b8e0e0f1234567890f',
            status: 'Pending',
            createdAt: new Date('2025-03-05T09:00:00Z'),
            updatedAt: new Date('2025-03-06T10:45:00Z'),
        },
    ];

    const orders = getAllOrders();

    // Inline styles for the table
    const tableStyle = {
        width: '100%',
        borderCollapse: 'collapse',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f9fafc',
    };

    const headerStyle = {
        backgroundColor: '#f0f2f5',
        textAlign: 'left',
        padding: '10px',
        fontSize: '12px',
        color: '#6b7280',
        textTransform: 'uppercase',
    };

    const rowStyle = {
        borderBottom: '1px solid #e5e7eb',
    };

    const cellStyle = {
        padding: '10px',
        fontSize: '14px',
        color: '#111827',
    };

    const productCellStyle = {
        ...cellStyle,
        display: 'flex',
        alignItems: 'center',
    };

    const imageStyle = {
        width: '40px',
        height: '40px',
        marginRight: '10px',
        borderRadius: '5px',
    };

    const statusStyle = (status) => ({
        ...cellStyle,
        color:
            status === 'Delivered'
                ? '#22c55e'
                : status === 'Processing'
                    ? '#f59e0b'
                    : status === 'Shipped'
                        ? '#3b82f6'
                        : '#ef4444', // Pending
        display: 'flex',
        alignItems: 'center',
    });

    const statusIconStyle = (status) => ({
        width: '16px',
        height: '16px',
        marginRight: '5px',
        backgroundColor:
            status === 'Delivered'
                ? '#22c55e'
                : status === 'Processing'
                    ? '#f59e0b'
                    : status === 'Shipped'
                        ? '#3b82f6'
                        : '#ef4444', // Pending
        borderRadius: '50%',
    });

    // Format date to match the style in the original image
    const formatDate = (date) => {
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
        });
    };

    return (
        <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>Orders</h1>

            {/* Navigation Tabs */}
            <div style={{ marginBottom: '20px' }}>
                <button style={{ marginRight: '10px', padding: '8px 16px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '5px' }}>
                    All Orders
                </button>
                <button style={{ marginRight: '10px', padding: '8px 16px', backgroundColor: '#e5e7eb', color: '#111827', border: 'none', borderRadius: '5px' }}>
                    Coupons
                </button>
                <button style={{ marginRight: '10px', padding: '8px 16px', backgroundColor: '#e5e7eb', color: '#111827', border: 'none', borderRadius: '5px' }}>
                    Shipping Rates
                </button>
                <button style={{ marginRight: '10px', padding: '8px 16px', backgroundColor: '#e5e7eb', color: '#111827', border: 'none', borderRadius: '5px' }}>
                    Tax Rates
                </button>
                <button style={{ padding: '8px 16px', backgroundColor: '#e5e7eb', color: '#111827', border: 'none', borderRadius: '5px' }}>
                    Pricing Tables
                </button>
            </div>

            {/* Filters */}
            <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
                <button style={{ padding: '8px 16px', backgroundColor: '#e5e7eb', color: '#111827', border: 'none', borderRadius: '5px' }}>
                    ALL 5
                </button>
                <select style={{ padding: '8px', borderRadius: '5px', border: '1px solid #e5e7eb' }}>
                    <option>Status</option>
                    <option>Pending</option>
                    <option>Processing</option>
                    <option>Shipped</option>
                    <option>Delivered</option>
                </select>
                <input type="text" placeholder="Search" style={{ padding: '8px', borderRadius: '5px', border: '1px solid #e5e7eb', flex: 1 }} />
            </div>

            {/* Table */}
            <table style={tableStyle}>
                <thead>
                    <tr>
                        <th style={headerStyle}>ORDER ID</th>
                        <th style={headerStyle}>ACCOUNT ID</th>
                        <th style={headerStyle}>TOTAL PRICE</th>
                        <th style={headerStyle}>PROMOTION ID</th>
                        <th style={headerStyle}>STATUS</th>
                        <th style={headerStyle}>CREATED AT</th>
                        <th style={headerStyle}>UPDATED AT</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order, index) => (
                        <tr key={index} style={rowStyle}>
                            <td style={productCellStyle}>
                                <img src="/assets/blindbox1.png" alt="Blindbox" style={imageStyle} />
                                {order._id}
                            </td>
                            <td style={cellStyle}>{order.accountId}</td>
                            <td style={cellStyle}>${order.totalPrice.toFixed(2)}</td>
                            <td style={cellStyle}>{order.promotionId}</td>
                            <td style={statusStyle(order.status)}>
                                <span style={statusIconStyle(order.status)}></span>
                                {order.status}
                            </td>
                            <td style={cellStyle}>{formatDate(order.createdAt)}</td>
                            <td style={cellStyle}>{formatDate(order.updatedAt)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Load More Button */}
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <button style={{ padding: '8px 16px', backgroundColor: '#e5e7eb', color: '#111827', border: 'none', borderRadius: '5px' }}>
                    LOAD MORE
                </button>
            </div>
        </div>
    );
};

export default OrdersPage;