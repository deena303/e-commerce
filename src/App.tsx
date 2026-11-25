import { useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import GlobalMegaNavbar from './components/GlobalMegaNavbar'
import SlideOverCartDrawer from './components/SlideOverCartDrawer'
import HomePage from './pages/HomePage'
import CatalogPage from './pages/CatalogPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderSuccessPage from './pages/OrderSuccessPage'
import NotFoundPage from './pages/NotFoundPage'
import GlobalFooter from './components/GlobalFooter'

function ScrollToTop(){
 const {pathname}=useLocation()
 useEffect(() => {
   window.scrollTo({top: 0, behavior: 'smooth'})
 }, [pathname])
 return null
}

export default function App(){
 return <BrowserRouter><ScrollToTop/><div className="flex min-h-screen flex-col bg-offwhite"><GlobalMegaNavbar/><Routes><Route path="/" element={<HomePage/>}/><Route path="/products" element={<CatalogPage/>}/><Route path="/product/:slug" element={<ProductDetailPage/>}/><Route path="/cart" element={<CartPage/>}/><Route path="/orders" element={<CartPage/>}/><Route path="/checkout" element={<CheckoutPage/>}/><Route path="/order-confirmation/:orderId" element={<OrderSuccessPage/>}/><Route path="/404" element={<NotFoundPage/>}/><Route path="*" element={<NotFoundPage/>}/></Routes><SlideOverCartDrawer onCartPage={()=>{}}/><GlobalFooter/></div></BrowserRouter>
}
