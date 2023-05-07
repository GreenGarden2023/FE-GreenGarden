import React, { useEffect, useMemo, useState } from 'react'
import { Button, Divider, Layout, Menu } from 'antd'
import type { MenuProps } from 'antd';
import './style.scss';
import { FaLongArrowAltRight, FaLongArrowAltLeft } from 'react-icons/fa';
import useSelector from '../hooks/use-selector';
import useDispatch from '../hooks/use-dispatch';
import { setCollapsedHeader } from '../slices/admin-layout';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BiCategoryAlt, BiUserCircle } from 'react-icons/bi';
import { MdOutlineInventory2, MdOutlineMenu } from 'react-icons/md'
import CONSTANT from 'app/utils/constant';
import { Role } from 'app/models/general-type';
import { setEmptyUser } from 'app/slices/user-infor';
import { setCartSlice } from 'app/slices/cart';
import { GrFormClose } from 'react-icons/gr';

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
  ): MenuItem {
    return {
      key,
      icon,
      children,
      label,
    } as MenuItem;
}

interface AdminRouteProps{
    children: any
}

const AdminRoute: React.FC<AdminRouteProps> = ({children}) => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    
    const { collapsedHeader } = useSelector(state => state.adminLayout);
    const {roleName, fullName} = useSelector(state => state.userInfor.user)

    const handleCollapsedHeader = () =>{
        dispatch(setCollapsedHeader({active: !collapsedHeader}))
    }
    const defaultSelectedKey = useMemo(() =>{
        const affix = location.pathname.split('/')[2]

        const manageCategory = ['manage-category']
        if(manageCategory.includes(affix)){
            return ['1']
        }

        const manageProduct = ['manage-product', 'manage-product-item']
        if(manageProduct.includes(affix)){
            return ['2']
        }

        const manageSize = ['manage-size']
        if(manageSize.includes(affix)){
            return ['3']
        }
        const manageOrder = ['manage-order']
        if(manageOrder.includes(affix)){
            return ['4']
        }
        const rentOrder = ['rent-order']
        if(rentOrder.includes(affix)){
            return ['5']
        }
        const saleOrder = ['sale-order']
        if(saleOrder.includes(affix)){
            return ['6']
        }
        const serviceOrder = ['take-care-order']
        if(serviceOrder.includes(affix)){
            return ['7']
        }
        const takeCareService = ['manage-take-care-service']
        if(takeCareService.includes(affix)){
            return ['8']
        }
        const shippingFee = ['manage-shipping-fee']
        if(shippingFee.includes(affix)){
            return ['9']
        }
        const serviceAssigned = ['take-care-order-assigned']
        if(serviceAssigned.includes(affix)){
            return ['10']
        }

        const managerUser = ['users']
        if(managerUser.includes(affix)){
            return ['11']
        }

        const managerRequest = ['manage-request']
        if(managerRequest.includes(affix)){
            return ['12']
        }

    }, [location])
    const openedKey = useMemo(() =>{
        const affix = location.pathname.split('/')[2]

        const manageOrder = ['rent-order', 'sale-order', 'take-care-order']
        if(manageOrder.includes(affix)){
            return ['4']
        }
    }, [location])
    const childrenOrder = [
        CONSTANT.MANAGE_ORDER.includes(roleName as Role) ? getItem(<Link to='/panel/rent-order'>Đơn thuê</Link>, '5', <BiCategoryAlt size={18} />) : null,
        CONSTANT.MANAGE_ORDER.includes(roleName as Role) ? getItem(<Link to='/panel/sale-order'>Đơn bán</Link>, '6', <BiCategoryAlt size={18} />) : null,
        CONSTANT.MANAGE_ORDER.includes(roleName as Role) ? getItem(<Link to='/panel/take-care-order'>Đơn chăm sóc</Link>, '7', <BiCategoryAlt size={18} />) : null,
    ]
    const items: MenuItem[] = [
       CONSTANT.MANAGE_CATEGORY.includes(roleName as Role) ? getItem(<Link to='/panel/manage-category'>Danh mục</Link>, '1', <BiCategoryAlt size={18} />) : null,
       CONSTANT.MANAGE_PRODUCT.includes(roleName as Role) ? getItem(<Link to='/panel/manage-product'>Loại cây</Link>, '2', <MdOutlineInventory2 size={18} />) : null,
       CONSTANT.MANAGE_SIZE.includes(roleName as Role) ? getItem(<Link to='/panel/manage-size'>Kích thước</Link>, '3', <MdOutlineInventory2 size={18} />) : null,
       CONSTANT.MANAGE_ORDER.includes(roleName as Role) ? getItem('Đơn hàng', '4', <BiCategoryAlt size={18} />, childrenOrder) : null,
       CONSTANT.MANAGE_ORDER.includes(roleName as Role) ? getItem(<Link to='/panel/manage-take-care-service'>Yêu cầu chăm sóc</Link>, '8', <MdOutlineInventory2 size={18} />) : null,
       CONSTANT.MANAGE_SHIPPING_FEE.includes(roleName as Role) ? getItem(<Link to='/panel/manage-shipping-fee'>Phí vận chuyển</Link>, '9', <MdOutlineInventory2 size={18} />) : null,
       CONSTANT.TAKE_CARE_ORDER.includes(roleName as Role) ? getItem(<Link to='/panel/take-care-order-assigned'>Đơn chăm sóc</Link>, '10', <MdOutlineInventory2 size={18} />) : null,
       CONSTANT.MANAGE_USERS.includes(roleName as Role) ? getItem(<Link to='/panel/users'>Người dùng</Link>, '11', <MdOutlineInventory2 size={18} />) : null,
       CONSTANT.TAKE_CARE_ORDER.includes(roleName as Role) ? getItem(<Link to='/panel/manage-request'>Yêu cầu chăm sóc</Link>, '12', <MdOutlineInventory2 size={18} />) : null,
    ];

    const handleLogout = () =>{
        localStorage.removeItem(CONSTANT.STORAGE.ACCESS_TOKEN)
        dispatch(setEmptyUser())
        dispatch(setCartSlice({rentItems: [], saleItems: []}))
        navigate('/login')
    }

    const [mobileMode, setMobileMode] = useState(false)
    const [showMenu, setShowMenu] = useState(false)
    const [menuHeight, setMenuHeight] = useState(0)
    const [menuWidth, setMenuWidth] = useState(0)

    useEffect(() =>{
        const handler = () =>{
            if(window.innerWidth < 992){
                setMobileMode(true)
            }else{
                setMobileMode(false)
            }
            setMenuHeight(window.innerHeight)
            setMenuWidth(window.innerWidth)
        }

        handler()

        window.addEventListener('resize', handler)

        return () => window.removeEventListener('resize', handler)
    }, [])

    const handleCloseMenu = () =>{
        setShowMenu(false)
    }

    const MobileHeader: React.FC<any> = ({props}) =>{
        return (
            <>
                <div className="mobile-header-wrapper" style={{height: menuHeight, width: menuWidth}}>
                    <div className="info-wrapper">
                        <div className="info-item">
                            <div className="name">
                                <BiUserCircle size={30} /> <span className="name">{fullName}</span>
                            </div>
                            <div className="role">
                                <span className="role-name">{roleName}</span>
                            </div>
                        </div>
                        <div className="info-item">
                            <Link to='/'>Trang chủ</Link>
                            <Button type='primary' htmlType='button' className='btn-update' size='large' onClick={handleLogout} >Đăng xuất</Button>
                        </div>
                    </div>
                    <Divider  />
                    <div className="routers-wrapper">
                        <Menu onClick={handleCloseMenu} className='admin-menu' theme="light" mode="inline"  items={items} selectedKeys={defaultSelectedKey} openKeys={openedKey} />
                    </div>
                    <GrFormClose size={30} className='close-mobile-header' onClick={handleCloseMenu} />
                </div>
            </>
        )
    }

    return (
        <>
            <Layout className='admin-layout'>
                <Header className='admin-header'>
                    <div className='left'>
                        {
                            !mobileMode && 
                            <div className="box-collapsed" onClick={handleCollapsedHeader}>
                                {
                                    collapsedHeader ? <FaLongArrowAltRight /> : <FaLongArrowAltLeft />
                                }
                            </div>
                        }
                    </div>
                    <div className="right">
                        {
                            !mobileMode ?
                            <>
                                <div className="info-name">
                                    <BiUserCircle size={30} /> <span className="name">{fullName}</span>
                                </div>
                                <div className="info-detail">
                                    <span className="role">{roleName}</span>
                                </div>
                                <div className="btn-tools">
                                    <Link to='/'>Trang chủ</Link>
                                    <Button type='primary' htmlType='button' className='btn-update' size='large' onClick={handleLogout} >Đăng xuất</Button>
                                </div>
                            </> : <MdOutlineMenu size={30} color="#00a76f" className="menu-header" onClick={() => setShowMenu(true)} />
                        }
                    </div>
                    {
                        showMenu && <MobileHeader />
                    }
                </Header>
                <Layout className='admin-layout-inside'>
                    {
                        !mobileMode ?
                        <>
                            <Sider
                                className='admin-sider'
                                style={{
                                overflow: 'auto',
                                height: '100vh',
                                position: 'fixed',
                                left: 0,
                                top: 0,
                                bottom: 0,
                                }}
                                collapsed={collapsedHeader}
                            >
                                <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)' }} />
                                <Menu className='admin-menu' theme="light" mode="inline"  items={items} selectedKeys={defaultSelectedKey} openKeys={openedKey} />
                            </Sider>
                            <Layout className="site-layout" style={{ marginLeft: collapsedHeader ? 80 : 200 }}>
                                <Content>
                                <div style={{ padding: 24}}>
                                    {children}
                                </div>
                                </Content>
                                <Footer style={{ textAlign: 'center' }}>Designed by Us</Footer>
                            </Layout>
                        </> : children
                    }
                </Layout>
            </Layout>
        </>
    )
}

export default AdminRoute