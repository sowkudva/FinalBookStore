import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import AllBooks from './pages/AllBooks'
import Cart from './pages/Cart'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import ViewBook from './components/ViewBook/ViewBook'
import Orders from './pages/Orders'
import OrderDetails from './pages/OrderDetails'
import Profile from './pages/Profile'
import OrderManagement from './pages/OrderManagement'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path='/orders/admin' element={<OrderManagement />} />
      <Route exact path='/' element={<Home />}></Route>
      <Route path='/all-books' element={<AllBooks />}></Route>
      <Route path='/cart' element={<Cart />}></Route>
      <Route path='/login' element={<Login />}></Route>
      <Route path='/sign-up' element={<SignUp />}></Route>
      <Route path='/profile' element={<Profile />}></Route>
      <Route path='/view-book/:book_id' element={<ViewBook />}></Route>
      <Route path='/orders' element={<Orders />}></Route>
      <Route path='/order-details/:orderId' element={<OrderDetails />}></Route>
    </Routes>
  )
}

export default AppRoutes
