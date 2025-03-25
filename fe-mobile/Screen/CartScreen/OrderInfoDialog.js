import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Switch,
  ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const OrderInfoDialog = ({
  visible,
  onClose,
  orderInfo,
  onSubmit,
  isLoading,
  error,
  setOrderInfo
}) => {
  const handleGiftToggle = (value) => {
    setOrderInfo(prev => ({
      ...prev,
      isGift: value
    }));
  };

  const handlePaymentMethodChange = (method) => {
    setOrderInfo(prev => ({
      ...prev,
      paymentMethod: method
    }));
  };

  const handleInputChange = (name, value) => {
    if (name.startsWith('gift.')) {
      const giftField = name.split('.')[1];
      setOrderInfo(prev => ({
        ...prev,
        giftRecipient: {
          ...prev.giftRecipient,
          [giftField]: value
        }
      }));
    } else {
      setOrderInfo(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const isFormValid = () => {
    if (orderInfo.isGift) {
      return (
        orderInfo.giftRecipient.fullName &&
        orderInfo.giftRecipient.phoneNumber &&
        orderInfo.giftRecipient.address
      );
    }
    return (
      orderInfo.fullName &&
      orderInfo.phoneNumber &&
      orderInfo.address
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Order Information</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView}>
            <View style={styles.giftSection}>
              <View style={styles.giftToggle}>
                <Icon name="card-giftcard" size={24} color="#FFD700" />
                <Text style={styles.giftText}>Send as Gift</Text>
                <Switch
                  value={orderInfo.isGift}
                  onValueChange={handleGiftToggle}
                  trackColor={{ false: '#767577', true: '#FFD700' }}
                  thumbColor={orderInfo.isGift ? '#f5dd4b' : '#f4f3f4'}
                />
              </View>
            </View>

            {!orderInfo.isGift ? (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Your Information</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Full Name"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  value={orderInfo.fullName}
                  onChangeText={(text) => handleInputChange('fullName', text)}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Phone Number"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  value={orderInfo.phoneNumber}
                  onChangeText={(text) => handleInputChange('phoneNumber', text)}
                  keyboardType="phone-pad"
                />
                <TextInput
                  style={[styles.input, styles.addressInput]}
                  placeholder="Shipping Address"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  value={orderInfo.address}
                  onChangeText={(text) => handleInputChange('address', text)}
                  multiline
                />
              </View>
            ) : (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Gift Recipient Information</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Recipient's Full Name"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  value={orderInfo.giftRecipient.fullName}
                  onChangeText={(text) => handleInputChange('gift.fullName', text)}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Recipient's Phone Number"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  value={orderInfo.giftRecipient.phoneNumber}
                  onChangeText={(text) => handleInputChange('gift.phoneNumber', text)}
                  keyboardType="phone-pad"
                />
                <TextInput
                  style={[styles.input, styles.addressInput]}
                  placeholder="Recipient's Shipping Address"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  value={orderInfo.giftRecipient.address}
                  onChangeText={(text) => handleInputChange('gift.address', text)}
                  multiline
                />
              </View>
            )}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Payment Method</Text>
              <TouchableOpacity
                style={[
                  styles.paymentOption,
                  orderInfo.paymentMethod === 0 && styles.selectedPayment
                ]}
                onPress={() => handlePaymentMethodChange(1)}
              >
                <Icon name="local-shipping" size={24} color={orderInfo.paymentMethod === 0 ? '#FFD700' : 'white'} />
                <Text style={[styles.paymentText, orderInfo.paymentMethod === 1 && styles.selectedPaymentText]}>
                  Cash on Delivery
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.paymentOption,
                  orderInfo.paymentMethod === 1 && styles.selectedPayment
                ]}
                onPress={() => handlePaymentMethodChange(1)}
              >
                <Icon name="account-balance" size={24} color={orderInfo.paymentMethod === 1 ? '#FFD700' : 'white'} />
                <Text style={[styles.paymentText, orderInfo.paymentMethod === 1 && styles.selectedPaymentText]}>
                  Bank Transfer
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Order Notes</Text>
              <TextInput
                style={[styles.input, styles.notesInput]}
                placeholder="Add notes for your order (optional)"
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={orderInfo.notes}
                onChangeText={(text) => handleInputChange('notes', text)}
                multiline
              />
            </View>

            {error && (
              <Text style={styles.errorText}>{error}</Text>
            )}
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.submitButton, !isFormValid() && styles.disabledButton]}
              onPress={onSubmit}
              disabled={!isFormValid() || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.submitButtonText}>Place Order</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,215,0,0.3)',
  },
  title: {
    color: '#FFD700',
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  scrollView: {
    maxHeight: '80%',
  },
  section: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  sectionTitle: {
    color: '#FFD700',
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  giftSection: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  giftToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,215,0,0.1)',
    padding: 10,
    borderRadius: 8,
  },
  giftText: {
    color: 'white',
    marginLeft: 10,
    flex: 1,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    color: 'white',
  },
  addressInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  notesInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  selectedPayment: {
    backgroundColor: 'rgba(255,215,0,0.2)',
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  paymentText: {
    color: 'white',
    marginLeft: 10,
  },
  selectedPaymentText: {
    color: '#FFD700',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,215,0,0.3)',
  },
  cancelButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    flex: 1,
    marginRight: 10,
  },
  cancelButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  submitButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
    flex: 2,
  },
  submitButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: 'rgba(76,175,80,0.5)',
  },
  errorText: {
    color: '#ff4444',
    padding: 15,
    textAlign: 'center',
  },
});

export default OrderInfoDialog; 