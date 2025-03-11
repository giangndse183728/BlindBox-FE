// Lấy danh sách tỉnh/thành phố
export const getProvinces = async () => {
    try {
        const response = await fetch('https://provinces.open-api.vn/api/p/');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching provinces:', error);
        throw error;
    }
};

// Lấy danh sách quận/huyện theo tỉnh/thành phố
export const getDistricts = async (provinceCode) => {
    try {
        const response = await fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`);
        const data = await response.json();
        return data.districts;
    } catch (error) {
        console.error('Error fetching districts:', error);
        throw error;
    }
};

// Lấy danh sách phường/xã theo quận/huyện
export const getWards = async (districtCode) => {
    try {
        const response = await fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
        const data = await response.json();
        return data.wards;
    } catch (error) {
        console.error('Error fetching wards:', error);
        throw error;
    }
};
