import { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const AppContext = createContext();

import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
axios.defaults.withCredentials = true;

const AppContextProvider = ({ children }) => {
    
    const navigate = useNavigate();
    
    const [Loading, setLoading] = useState(false);

    const [user, setUser] = useState(null);

    const [admin, setAdmin] = useState(null);
    const [categories,setCategories]=useState([])
    const [menus, setMenus] = useState([]);


    const fetchCategories=async()=>{
        try{
            const {data}=await axios.get("api/category/all")
            
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
            console.log(data)
            
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


    const value = {
        navigate,
        Loading,
        setLoading,
        user,
        setUser,
        axios,
        admin,
        setAdmin,
        categories,
        fetchCategories,
        menus,
        fetchMenus
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;
