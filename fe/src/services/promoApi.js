import api from './baseURL';

export const getPromotions = async () => {
    try {
        const response = await api.get('/admins/promotions');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getRefundPromotions = async () => {
    try {
        const response = await api.get('/orders/promotions');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getBuyerPromotions = async () => {
    try {
        const response = await api.get('/products/promotions');
        return response.data;
    } catch (error) {
        throw error;
    }
};


export const createPromotions = async (promotionData) => {
    try {
        const response = await api.post('/admins/promotions', promotionData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updatePromotions = async (promotionId, promotionData) => {
    try {
        const response = await api.put(`/admins/promotions/${promotionId}`, promotionData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deletePromotions = async (promotionId) => {
    try {
        const response = await api.delete(`/admins/promotions/${promotionId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

