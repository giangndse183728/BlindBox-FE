import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { toast } from 'react-toastify';

// Define socket events
export const SOCKET_EVENTS = {
  ORDER_SUCCESS: "ORDER_SUCCESS",
  EMAIL_VERIFIED: "email_verified",
  SELLER_REGISTERED: "seller_registered",
  // Add other events as needed
};

// Kết nối với namespace phù hợp dựa trên vai trò người dùng
const useSocket = (token, userInfo) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (!token || !userInfo) {
      console.log("Token or userInfo missing, cannot initialize socket");
      return;
    }
    
    // Chọn namespace phù hợp
    let namespace = '/user'; // Default for all authenticated users
    
    if (userInfo.isSeller) {
      namespace = '/seller';
    } else if (userInfo.verify === 1) { // Assuming 1 is Verified
      namespace = '/verified';
    }
    
    console.log("Initializing socket with namespace:", namespace);
    console.log("User info:", userInfo);
    
    // Khởi tạo kết nối with explicit URL and debugging
    try {
      const socketUrl = 'http://localhost:5000';
      console.log("Connecting to socket server:", socketUrl + namespace);
      
      const socketInstance = io(`${socketUrl}${namespace}`, {
        auth: { token },
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        transports: ['websocket', 'polling']
      });
      
      console.log("Socket instance created:", !!socketInstance);
      
      // Lắng nghe kết nối thành công
      socketInstance.on('connect', () => {
        console.log(`Connected to ${namespace} namespace with ID:`, socketInstance.id);
        setIsConnected(true);
        setError(null);
      });
      
      // Lắng nghe lỗi
      socketInstance.on('connect_error', (err) => {
        console.error('Connection error:', err.message);
        setError(err.message);
        setIsConnected(false);
      });
      
      // Lắng nghe sự kiện email verified
      socketInstance.on(SOCKET_EVENTS.EMAIL_VERIFIED, (data) => {
        console.log('Email verified:', data);
        toast.success(data.message || "Email verified successfully!");
        // Hiển thị thông báo và cập nhật UI
      });
      
      // Lắng nghe sự kiện seller registered
      socketInstance.on(SOCKET_EVENTS.SELLER_REGISTERED, (data) => {
        console.log('Seller registered:', data);
        toast.success("Seller registration successful!, socket check");
        // Hiển thị thông báo và cập nhật UI
      });
     
      // Lắng nghe sự kiện order success
      socketInstance.on(SOCKET_EVENTS.ORDER_SUCCESS, (data) => {
        console.log("Order success notification received:", data);
        toast.success("Order completed successfully!", {
          position: "bottom-right",
          closeOnClick: true,
        });
      });
      
      // Add disconnect event handling
      socketInstance.on('disconnect', (reason) => {
        console.log(`Disconnected from ${namespace}: ${reason}`);
        setIsConnected(false);
      });
      
      setSocket(socketInstance);
      
      return () => {
        // Disconnect and remove all listeners when component unmounts
        console.log("Cleaning up socket connection");
        if (socketInstance) {
          socketInstance.off(SOCKET_EVENTS.EMAIL_VERIFIED);
          socketInstance.off(SOCKET_EVENTS.SELLER_REGISTERED);
          socketInstance.off(SOCKET_EVENTS.ORDER_SUCCESS);
          socketInstance.off('connect');
          socketInstance.off('connect_error');
          socketInstance.off('disconnect');
          socketInstance.disconnect();
        }
      };
    } catch (err) {
      console.error("Error initializing socket:", err);
      setError(err.message || "Failed to initialize socket");
      return () => {}; // Empty cleanup function
    }
  }, [token, userInfo]);
  
  return { socket, isConnected, error };
};

export default useSocket;