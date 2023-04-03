import { notification } from 'antd';
import CheckoutSuccess from 'app/pages/check-out/CheckoutSuccess';
import ClientManageTakeCareService from 'app/pages/client-manage-take-care-service/ClientManageTakeCareService';
import ClientManageTakeCareServiceDetail from 'app/pages/client-manage-take-care-service/detail/ClientManageTakeCareServiceDetail';
import ClientOrder from 'app/pages/client-order/ClientOrder';
import ClientProductItemDetail from 'app/pages/client-product-item-detail/ClientProductItemDetail';
import ClientProductItem from 'app/pages/client-product-item/ClientProductItem';
import ClientProduct from 'app/pages/client-product/ClientProduct';
import ClientRentOrderGroup from 'app/pages/client-rent-order-group/ClientRentOrderGroup';
import ClientTakeCareServiceConfirm from 'app/pages/client-take-care-service-confirm/ClientTakeCareServiceConfirm';
import ClientTakeCareService from 'app/pages/client-take-care-service/ClientTakeCareService';
import ManageOrder from 'app/pages/manage-order/ManageOrder';
import ManageProductItem from 'app/pages/manage-product-item/ManageProductItem';
import ManageRentOrder from 'app/pages/manage-rent-order/ManageRentOrder';
import ManageRentOrderGroup from 'app/pages/manage-rent-order/rent-order-group/ManageRentOrderGroup';
import ManageSaleOrder from 'app/pages/manage-sale-order/ManageSaleOrder';
import ManageShippingFee from 'app/pages/manage-shipping-fee/ManageShippingFee';
import ManageSize from 'app/pages/manage-size/ManageSize';
import ManageTakeCareOrder from 'app/pages/manage-take-care-order/ManageTakeCareOrder';
import ManageTakeCareService from 'app/pages/manage-take-care-service/ManageTakeCareService';
import TechManageServiceOrderDetail from 'app/pages/tech-manage-service-order/detail/TechManageServiceOrderDetail';
import TechManageServiceOrder from 'app/pages/tech-manage-service-order/TechManageServiceOrder';
import React, { useEffect } from 'react';
import { AiFillCheckCircle, AiFillWarning } from 'react-icons/ai';
import { MdError } from 'react-icons/md';
import { Route, Routes, useNavigate } from 'react-router-dom';
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import useDispatch from '../hooks/use-dispatch';
import useSelector from '../hooks/use-selector';
import FileNotFound from '../pages/404/FileNotFound';
import CartPage from '../pages/cart/Cart';
import LandingPage from '../pages/landing-page/LandingPage';
import Login from '../pages/login/Login';
import ManageCategory from '../pages/manage-category/ManageCategory';
import ManageProduct from '../pages/manage-product/ManageProduct';
import Register from '../pages/register/Register';
import TermOfService from '../pages/term-of-services/TermOfServices';
import ThankYou from '../pages/thank-you/ThankYou';
import authService from '../services/auth.service';
import { setNoti } from '../slices/notification';
import { setLoading, setUser } from '../slices/user-infor';
import CONSTANT from '../utils/constant';
import AdminRoute from './AdminRoute';
import AuthGuard from './AuthGuard';

const Routers: React.FC = () =>{
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const windowTitle = useSelector(state => state.windowTitle);
    const notiState = useSelector(state => state.notification);

    const [api, contextHolder] = notification.useNotification();

    useEffect(() =>{
        const tokenInLocal = localStorage.getItem(CONSTANT.STORAGE.ACCESS_TOKEN)
        if(!tokenInLocal) return;

        const getUserDetailInit = async () =>{
            try{
                dispatch(setLoading({loading: true}))
                const res = await authService.getUserDetail();
                const resData = {
                    ...res.data,
                    token: tokenInLocal,
                    role: res.data.roleName,
                    loading: false
                }
                dispatch(setUser({user: resData, token: tokenInLocal, loading: false}))
            }catch(err: any){
                if(err.response.status === 401){
                    localStorage.removeItem(CONSTANT.STORAGE.ACCESS_TOKEN)
                    return navigate('/login');
                }
                dispatch(setLoading({loading: false}))
                dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE})) 
            }
        }
        getUserDetailInit();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() =>{
        if(!windowTitle) return;
        document.title = windowTitle
    }, [windowTitle])

    useEffect(() =>{
        if(!notiState.message) return;
        const { type, message, description } = notiState
        const ICON_SIZE = 25
        let iconType = <AiFillCheckCircle />
        switch(type){
            case 'success':
                iconType = <AiFillCheckCircle color='#00a76f' size={ICON_SIZE} />
                break;
            case 'error':
                iconType = <MdError color='#FF0033' size={ICON_SIZE} />
                break;
            case 'info':
                iconType = <MdError color='#0066FF' size={ICON_SIZE} />
                break;
            default:
                iconType = <AiFillWarning color='#FFC125' size={ICON_SIZE} />
        }
        api[type]({
            message,
            description,
            icon: iconType
        })
    }, [notiState, api])

    return (
        <>
            {contextHolder}
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path='/register' element={<Register />} />
                <Route path='/login' element={<Login />} />
                <Route path='/term-of-services' element={<TermOfService />} />
                <Route path='/cart' element={<CartPage />} />
                <Route path='/thanks' element={<ThankYou />} />
                <Route path='/category/:categoryId' element={<ClientProduct />} />
                <Route path='/product/:productId' element={<ClientProductItem />} />
                <Route path='/product-item/:productItemId' element={<ClientProductItemDetail />} />
                <Route path='/orders' element={<ClientOrder />} />
                <Route path='/order-group/:groupId' element={<ClientRentOrderGroup />} />
                <Route path='/checkout-success' element={<CheckoutSuccess />} />
                <Route path='/take-care-service' element={<ClientTakeCareService />} />
                <Route path='/take-care-service/me' element={<ClientManageTakeCareService />} />
                <Route path='/take-care-service/me/:serviceId' element={<ClientTakeCareServiceConfirm />} />
                <Route path='/order/service/:orderId' element={<ClientManageTakeCareServiceDetail />} />

                <Route path='panel' >
                    <Route path='manage-category' element={<AuthGuard rolesAuth={CONSTANT.MANAGE_CATEGORY} ><AdminRoute><ManageCategory /></AdminRoute></AuthGuard>} />
                    <Route path='manage-product' element={<AuthGuard rolesAuth={CONSTANT.MANAGE_PRODUCT} ><AdminRoute><ManageProduct /></AdminRoute></AuthGuard>} />
                    <Route path='manage-product-item/:productId' element={<AuthGuard rolesAuth={CONSTANT.MANAGE_PRODUCT_ITEM} ><AdminRoute><ManageProductItem /></AdminRoute></AuthGuard>} />
                    <Route path='manage-size' element={<AuthGuard rolesAuth={CONSTANT.MANAGE_SIZE} ><AdminRoute><ManageSize /></AdminRoute></AuthGuard>} />
                    <Route path='manage-order' element={<AuthGuard rolesAuth={CONSTANT.MANAGE_ORDER} ><AdminRoute><ManageOrder /></AdminRoute></AuthGuard>} />
                    <Route path='rent-order' element={<AuthGuard rolesAuth={CONSTANT.MANAGE_ORDER} ><AdminRoute><ManageRentOrder /></AdminRoute></AuthGuard>} />
                    <Route path='sale-order' element={<AuthGuard rolesAuth={CONSTANT.MANAGE_ORDER} ><AdminRoute><ManageSaleOrder /></AdminRoute></AuthGuard>} />
                    <Route path='take-care-order' element={<AuthGuard rolesAuth={CONSTANT.MANAGE_ORDER} ><AdminRoute><ManageTakeCareOrder /></AdminRoute></AuthGuard>} />
                    <Route path='manage-take-care-service' element={<AuthGuard rolesAuth={CONSTANT.MANAGE_ORDER} ><AdminRoute><ManageTakeCareService /></AdminRoute></AuthGuard>} />
                    <Route path='rent-order/:groupId' element={<AuthGuard rolesAuth={CONSTANT.MANAGE_ORDER} ><AdminRoute><ManageRentOrderGroup /></AdminRoute></AuthGuard>} />
                    <Route path='manage-shipping-fee' element={<AuthGuard rolesAuth={CONSTANT.MANAGE_ORDER} ><AdminRoute><ManageShippingFee /></AdminRoute></AuthGuard>} />
                    <Route path='take-care-order-assigned' element={<AuthGuard rolesAuth={CONSTANT.TAKE_CARE_ORDER} ><AdminRoute><TechManageServiceOrder /></AdminRoute></AuthGuard>} />
                    <Route path='take-care-order-assigned/:orderId' element={<AuthGuard rolesAuth={CONSTANT.TAKE_CARE_ORDER} ><AdminRoute><TechManageServiceOrderDetail /></AdminRoute></AuthGuard>} />
                </Route>
                <Route path='/file-not-found' element={<FileNotFound />} />
            </Routes>
        </>
    );
}


export default Routers;
