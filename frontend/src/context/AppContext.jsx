import { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const AppContext = createContext();

import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
axios.defaults.withCredentials = true;

const AppContextProvider = ({ children }) => {
    
    const navigate = useNavigate();
    
    const [loading, setLoading] = useState(false);

    const [user, setUser] = useState(null);

    const [admin, setAdmin] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('admin')) || null;
        } catch (error) {
            return null;
        }
    });
    const [categories,setCategories]=useState([])
    const [menus, setMenus] = useState([]);
    const [cart, setCart] = useState([]);


    const fetchCategories=async()=>{
        try{
            const {data}=await axios.get("/api/category/all")
            
            if(data.success){
                setCategories(data.categories);
                
            }else{
               console.log("Failed to fetch categories") 
            }

        }catch(error){
      console.log("Error fetching categories",error)
        }
    }


    const fetchMenus=async()=>{
        try{
            const {data}=await axios.get("/api/menu/all")
            if(data.success){
                setMenus(data.menuItem);
                
            }else{
               console.log("Failed to fetch categories") 
            }

        }catch(error){
      console.log("Error fetching categories",error)
        }
    }

    const isAuth=async()=>{
        try{
            
            const {data}=await axios.get("/api/auth/is-auth");
            if(data?.success){
                setUser(true);
            }else{
                setUser(false);
            }
        }catch(err){
            console.log(err);
            setUser(false);
        }
    }

    useEffect(()=>{
        isAuth();
        fetchCategories();
        fetchMenus()
    },[])

    useEffect(() => {
        if (admin) {
            localStorage.setItem('admin', JSON.stringify(admin));
        } else {
            localStorage.removeItem('admin');
        }
    }, [admin]);

    const addToCart = (product) => {
        const existingItem = cart.find(item => item._id === product._id);
        if (existingItem) {
            setCart(cart.map(item =>
                item._id === product._id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
        } else {
            setCart([...cart, { ...product, quantity: 1 }]);
        }
    };

    const removeFromCart = (productId) => {
        setCart(cart.filter(item => item._id !== productId));
    };

    const updateCartItem = (productId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId);
        } else {
            setCart(cart.map(item =>
                item._id === productId
                    ? { ...item, quantity }
                    : item
            ));
        }
    };

    const clearCart = () => {
        setCart([]);
    };


    const value = {
        navigate,
        loading,
        Loading: loading,
        setLoading,
        user,
        setUser,
        axios,
        admin,
        setAdmin,
        categories,
        fetchCategories,
        menus,
        fetchMenus,
        cart,
        addToCart,
        removeFromCart,
        updateCartItem,
        clearCart
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;
