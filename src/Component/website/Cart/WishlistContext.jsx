"use client";
import { createContext,useCallback,useContext,useEffect,useMemo,useState } from "react";
const WishlistContext=createContext(null);
export function WishlistProvider({children}) { const [products,setProducts]=useState([]);const [loaded,setLoaded]=useState(false);
 const refresh=useCallback(async()=>{try{const r=await fetch("/api/account/wishlist",{cache:"no-store"});if(r.ok){const d=await r.json();setProducts(d.products||[]);}else if(r.status===401||r.status===403)setProducts([]);}catch{}finally{setLoaded(true);}},[]);
 useEffect(()=>{let active=true;Promise.resolve().then(()=>{if(active)refresh();});return()=>{active=false;};},[refresh]);
 const toggle=useCallback(async(product)=>{const exists=products.some(p=>p.id===product.id);const response=await fetch(exists?"/api/account/wishlist/"+encodeURIComponent(product.id):"/api/account/wishlist",{method:exists?"DELETE":"POST",headers:{"Content-Type":"application/json"},...(exists?{}:{body:JSON.stringify({productId:product.id})})});if(response.status===401){window.location.assign("/login?next="+encodeURIComponent(window.location.pathname+window.location.search));return false;}const result=await response.json();if(!response.ok)throw new Error(result.message||"Unable to update wishlist");await refresh();return true;},[products,refresh]);
 const has=useCallback((id)=>products.some(p=>p.id===id),[products]);const value=useMemo(()=>({products,loaded,count:products.length,refresh,toggle,has}),[products,loaded,refresh,toggle,has]);return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>; }
export function useWishlist(){const value=useContext(WishlistContext);if(!value)throw new Error("useWishlist must be used inside WishlistProvider");return value;}
