import { useState, useEffect } from "react";
import { TextField, Grid, Box, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { getProvinces, getDistricts, getWards } from '../../services/ThirdApi/addressApi';

// Address Select Component
export const AddressSelect = ({ label, value, options, onChange, disabled, isEditing }) => {
    return (
        <FormControl
            fullWidth
            disabled={disabled || !isEditing}
            sx={{
                '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                        borderColor: isEditing ? 'white' : 'rgba(255, 255, 255, 0.5) !important',
                    },
                    '&:hover fieldset': {
                        borderColor: isEditing ? 'white' : 'rgba(255, 255, 255, 0.5) !important',
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: isEditing ? 'white' : 'rgba(255, 255, 255, 0.5) !important',
                    },
                },
                '& .MuiInputBase-input': {
                    color: isEditing ? 'white' : 'rgba(255, 255, 255, 0.5) !important',
                },
                '& .MuiInputLabel-root': {
                    color: isEditing ? 'white' : 'rgba(255, 255, 255, 0.5) !important',
                },
                '& .MuiSelect-icon': {
                    color: isEditing ? 'white' : 'rgba(255, 255, 255, 0.5) !important',
                },
                '& .Mui-disabled': {
                    color: 'rgba(255, 255, 255, 0.5) !important',
                    '-webkit-text-fill-color': 'rgba(255, 255, 255, 0.5) !important',
                },
                '& .MuiPaper-root': {
                    backgroundColor: '#121212',
                },
                '& .MuiMenuItem-root': {
                    color: 'white',
                },
            }}
        >
            <InputLabel>{label}</InputLabel>
            <Select value={value} onChange={onChange} label={label}>
                {options.map((option) => (
                    <MenuItem key={option.code} value={option.code}>
                        {option.name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

// Street Address Component
export const StreetAddressField = ({ streetAddress, setStreetAddress, isEditing }) => {
    return (
        <TextField
            id="streetAddress"
            label="Street Address (house number, street name)"
            variant="standard"
            value={streetAddress}
            onChange={(e) => setStreetAddress(e.target.value)}
            fullWidth
            margin="normal"
            placeholder="Example: 123 Main Street"
            InputProps={{
                readOnly: !isEditing,
                style: { color: isEditing ? 'white' : 'rgba(255, 255, 255, 0.5)' },
                endAdornment: isEditing ? <EditIcon /> : null
            }}
            InputLabelProps={{ style: { color: isEditing ? 'white' : 'rgba(255, 255, 255, 0.5)' } }}
            sx={{
                mb: 3,
                '& .MuiInputBase-root': {
                    color: isEditing ? 'white' : 'rgba(255, 255, 255, 0.5)', // Text color
                },
                '& .MuiInput-underline:before': {
                    borderBottomColor: isEditing ? 'white' : 'rgba(255, 255, 255, 0.5) !important', // Normal underline
                },
                '& .MuiInput-underline:hover:before': {
                    borderBottomColor: isEditing ? 'white' : 'rgba(255, 255, 255, 0.5) !important', // Hover underline
                },
                '& .MuiInput-underline:after': {
                    borderBottomColor: 'white !important', // Focused underline
                },
            }}
        />

    );
};

// Address Preview Component
export const AddressPreview = ({ isEditing, streetAddress, selectedWard, selectedDistrict, selectedProvince, generateFullAddress }) => {
    if (!isEditing || !(streetAddress || selectedWard || selectedDistrict || selectedProvince)) {
        return null;
    }

    return (
        <Grid item xs={12}>
            <Box
                sx={{
                    mt: 2,
                    p: 2,
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '4px',
                    backgroundColor: 'rgba(0, 0, 0, 0.2)'
                }}
            >
                <Typography variant="subtitle1" sx={{ color: 'white', fontFamily: 'Yusei Magic' }}>
                    Preview address:
                </Typography>
                <Typography variant="body1" sx={{ color: '#FFD700' }}>
                    {generateFullAddress()}
                </Typography>
            </Box>
        </Grid>
    );
};

// Custom hook for address management
export const useAddressManagement = (userAddress) => {
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedWard, setSelectedWard] = useState('');
    const [streetAddress, setStreetAddress] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // Fetch provinces on mount
    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const data = await getProvinces();
                setProvinces(data);
            } catch (error) {
                console.error('Error fetching provinces:', error);
            }
        };
        fetchProvinces();
    }, []);

    // Fetch districts when province changes
    useEffect(() => {
        if (selectedProvince && !isLoading) {
            const fetchDistricts = async () => {
                try {
                    const data = await getDistricts(selectedProvince);
                    setDistricts(data);
                    if (!userAddress) {
                        setSelectedDistrict('');
                        setWards([]);
                        setSelectedWard('');
                    }
                } catch (error) {
                    console.error('Error fetching districts:', error);
                }
            };
            fetchDistricts();
        } else if (!selectedProvince) {
            setDistricts([]);
            setSelectedDistrict('');
            setWards([]);
            setSelectedWard('');
        }
    }, [selectedProvince, isLoading, userAddress]);

    // Fetch wards when district changes
    useEffect(() => {
        if (selectedDistrict && !isLoading) {
            const fetchWards = async () => {
                try {
                    const data = await getWards(selectedDistrict);
                    setWards(data);
                    if (!userAddress) {
                        setSelectedWard('');
                    }
                } catch (error) {
                    console.error('Error fetching wards:', error);
                }
            };
            fetchWards();
        } else if (!selectedDistrict) {
            setWards([]);
            setSelectedWard('');
        }
    }, [selectedDistrict, isLoading, userAddress]);

    // Generate full address string
    const generateFullAddress = () => {
        const provinceName = provinces.find(p => p.code === parseInt(selectedProvince))?.name || '';
        const districtName = districts.find(d => d.code === parseInt(selectedDistrict))?.name || '';
        const wardName = wards.find(w => w.code === parseInt(selectedWard))?.name || '';

        const addressParts = [
            streetAddress.trim(),
            wardName,
            districtName,
            provinceName
        ].filter(part => part);

        return addressParts.join(', ');
    };

    // Parse address from string
    const parseAddress = async (addressString) => {
        if (!addressString) return;

        const addressParts = addressString.split(', ');
        if (addressParts.length >= 1) {
            setStreetAddress(addressParts[0]);

            try {
                const provincesData = await getProvinces();
                setProvinces(provincesData);

                if (addressParts.length >= 4) {
                    const provinceName = addressParts[3];
                    const province = provincesData.find(p =>
                        p.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") ===
                        provinceName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                    );

                    if (province) {
                        setSelectedProvince(province.code.toString());

                        setTimeout(async () => {
                            const districtsData = await getDistricts(province.code);
                            setDistricts(districtsData);

                            if (addressParts.length >= 3) {
                                const districtName = addressParts[2];
                                const district = districtsData.find(d =>
                                    d.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") ===
                                    districtName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                                );

                                if (district) {
                                    setSelectedDistrict(district.code.toString());

                                    setTimeout(async () => {
                                        const wardsData = await getWards(district.code);
                                        setWards(wardsData);

                                        if (addressParts.length >= 2) {
                                            const wardName = addressParts[1];
                                            const ward = wardsData.find(w =>
                                                w.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") ===
                                                wardName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                                            );

                                            if (ward) {
                                                setSelectedWard(ward.code.toString());
                                            }
                                        }
                                    }, 100);
                                }
                            }
                        }, 100);
                    }
                }
            } catch (error) {
                console.error("Error loading address data:", error);
            }
        }
    };

    return {
        provinces, districts, wards,
        selectedProvince, setSelectedProvince,
        selectedDistrict, setSelectedDistrict,
        selectedWard, setSelectedWard,
        streetAddress, setStreetAddress,
        generateFullAddress, parseAddress,
        setIsLoading
    };
};

// Address Form Component
export const AddressForm = ({ isEditing, addressData }) => {
    const {
        provinces, districts, wards,
        selectedProvince, setSelectedProvince,
        selectedDistrict, setSelectedDistrict,
        selectedWard, setSelectedWard,
        streetAddress, setStreetAddress,
        generateFullAddress
    } = addressData;

    return (
        <>
            <Grid item xs={12}>
                <Typography fontFamily='Yusei Magic' variant="h6" sx={{ color: 'white' }}>
                    Address
                </Typography>
            </Grid>

            <Grid item xs={12}>
                <StreetAddressField
                    streetAddress={streetAddress}
                    setStreetAddress={setStreetAddress}
                    isEditing={isEditing}
                />
            </Grid>

            <Grid item xs={12} sm={4}>
                <AddressSelect
                    label="Province/City"
                    value={selectedProvince}
                    options={provinces}
                    onChange={(e) => setSelectedProvince(e.target.value)}
                    disabled={false}
                    isEditing={isEditing}
                />
            </Grid>

            <Grid item xs={12} sm={4}>
                <AddressSelect
                    label="District"
                    value={selectedDistrict}
                    options={districts}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    disabled={!selectedProvince}
                    isEditing={isEditing}
                />
            </Grid>

            <Grid item xs={12} sm={4}>
                <AddressSelect
                    label="Ward"
                    value={selectedWard}
                    options={wards}
                    onChange={(e) => setSelectedWard(e.target.value)}
                    disabled={!selectedDistrict}
                    isEditing={isEditing}
                />
            </Grid>

            <AddressPreview
                isEditing={isEditing}
                streetAddress={streetAddress}
                selectedWard={selectedWard}
                selectedDistrict={selectedDistrict}
                selectedProvince={selectedProvince}
                generateFullAddress={generateFullAddress}
            />
        </>
    );
}; 