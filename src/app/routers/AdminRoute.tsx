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
        // const serviceOrder = ['take-care-order']
        // if(serviceOrder.includes(affix)){
        //     return ['7']
        // }
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

        const takeCareOrder = ['take-care-order']
        if(takeCareOrder.includes(affix)){
            return ['14']
        }
        const manageTakeCarePackage = ['manage-take-care-package']
        if(manageTakeCarePackage.includes(affix)){
            return ['15']
        }
        const takeCareOrderPackage = ['take-care-order-package']
        if(takeCareOrderPackage.includes(affix)){
            return ['16']
        }
        const managePackage = ['manage-package']
        if(managePackage.includes(affix)){
            return ['17']
        }
        const managePackageOrder = ['manage-package-order']
        if(managePackageOrder.includes(affix)){
            return ['18']
        }
        const managePackageRequest = ['manage-package-request']
        if(managePackageRequest.includes(affix)){
            return ['19']
        }
        const manageRevenue = ['manage-revenue']
        if(manageRevenue.includes(affix)){
            return ['20']
        }
    }, [location])

    const DefaultSelectedKey = () => {
        const affix = location.pathname.split('/')[2]
        
        const manageOrder = ['rent-order', 'sale-order']
        const manageRequest = ['manage-take-care-service', 'take-care-order', 'manage-take-care-package', 'take-care-order-package']
        
        if(manageOrder.includes(affix)){
            return ['4']
        }
        if(manageRequest.includes(affix)){
            return ['13']
        }

        return []
    }


    const [openKey, setOpenKey] = useState<string[]>(DefaultSelectedKey())

    useEffect(() =>{
        const affix = location.pathname.split('/')[2]
        
        const manageOrder = ['rent-order', 'sale-order']
        const manageRequest = ['manage-take-care-service', 'take-care-order', 'manage-take-care-package', 'take-care-order-package']
        
        if(manageOrder.includes(affix)){
            setOpenKey(['4'])
        }else if(manageRequest.includes(affix)){
            setOpenKey(['13'])
        }else{
            setOpenKey([])
        }
    }, [location])

    
    // const pushOpenKey = (key: string) =>{
    //     setOpenKey([...openKey, key])
    // }

    const childrenOrder = [
        CONSTANT.MANAGE_ORDER.includes(roleName as Role) ? getItem(<Link to='/panel/rent-order'>Đơn thuê</Link>, '5', <MdOutlineInventory2 size={18} />) : null,
        CONSTANT.MANAGE_ORDER.includes(roleName as Role) ? getItem(<Link to='/panel/sale-order'>Đơn bán</Link>, '6', <MdOutlineInventory2 size={18} />) : null,
    ]

    const childrenRequest = [
        CONSTANT.MANAGE_ORDER.includes(roleName as Role) ? getItem(<Link to='/panel/manage-take-care-service'>YCCS tự chọn</Link>, '8', <MdOutlineInventory2 size={18} />) : null,
        CONSTANT.MANAGE_ORDER.includes(roleName as Role) ? getItem(<Link to='/panel/take-care-order'>Đơn tự chọn</Link>, '14', <MdOutlineInventory2 size={18} />) : null,
        CONSTANT.MANAGE_ORDER.includes(roleName as Role) ? getItem(<Link to='/panel/manage-take-care-package'>YCCS theo gói</Link>, '15', <MdOutlineInventory2 size={18} />) : null,
        CONSTANT.MANAGE_ORDER.includes(roleName as Role) ? getItem(<Link to='/panel/take-care-order-package'>Đơn theo gói</Link>, '16', <MdOutlineInventory2 size={18} />) : null,
    ]

    const items: MenuItem[] = [
       CONSTANT.MANAGE_CATEGORY.includes(roleName as Role) ? getItem(<Link to='/panel/manage-category'>Danh mục</Link>, '1', <BiCategoryAlt size={18} />) : null,
       CONSTANT.MANAGE_PRODUCT.includes(roleName as Role) ? getItem(<Link to='/panel/manage-product'>Loại cây</Link>, '2', <MdOutlineInventory2 size={18} />) : null,
       CONSTANT.MANAGE_SIZE.includes(roleName as Role) ? getItem(<Link to='/panel/manage-size'>Kích thước</Link>, '3', <MdOutlineInventory2 size={18} />) : null,
       CONSTANT.MANAGE_ORDER.includes(roleName as Role) ? getItem(<Link to='/panel/manage-package'>Gói chăm sóc</Link>, '17', <MdOutlineInventory2 size={18} />) : null,
       CONSTANT.MANAGE_ORDER.includes(roleName as Role) ? getItem('Đơn thường', '4', <BiCategoryAlt size={18} />, childrenOrder) : null,
       CONSTANT.MANAGE_SHIPPING_FEE.includes(roleName as Role) ? getItem(<Link to='/panel/manage-shipping-fee'>Phí vận chuyển</Link>, '9', <MdOutlineInventory2 size={18} />) : null,
       CONSTANT.TAKE_CARE_ORDER.includes(roleName as Role) ? getItem(<Link to='/panel/take-care-order-assigned'>ĐCS tự chọn</Link>, '10', <MdOutlineInventory2 size={18} />) : null,
       CONSTANT.MANAGE_USERS.includes(roleName as Role) ? getItem(<Link to='/panel/users'>Người dùng</Link>, '11', <MdOutlineInventory2 size={18} />) : null,
       CONSTANT.TAKE_CARE_ORDER.includes(roleName as Role) ? getItem(<Link to='/panel/manage-request'>YCCS tự chọn</Link>, '12', <MdOutlineInventory2 size={18} />) : null,
       CONSTANT.MANAGE_ORDER.includes(roleName as Role) ? getItem('Đơn chăm sóc', '13', <BiCategoryAlt size={18} />, childrenRequest) : null,
       CONSTANT.TAKE_CARE_ORDER.includes(roleName as Role) ? getItem(<Link to='/panel/manage-package-order'>ĐCS theo gói</Link>, '18', <MdOutlineInventory2 size={18} />) : null,
       CONSTANT.TAKE_CARE_ORDER.includes(roleName as Role) ? getItem(<Link to='/panel/manage-package-request'>YCCS theo gói</Link>, '19', <MdOutlineInventory2 size={18} />) : null,
       CONSTANT.MANAGE_REVENUE.includes(roleName as Role) ? getItem(<Link to='/panel/manage-revenue'>Doanh thu</Link>, '20', <MdOutlineInventory2 size={18} />) : null,
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
                        <Menu onClick={handleCloseMenu} className='admin-menu' theme="light" mode="inline"  items={items} selectedKeys={defaultSelectedKey} openKeys={openKey} />
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
                                <Menu onSelect={(e) => console.log(e)} className='admin-menu' theme="light" mode="inline"  items={items} selectedKeys={defaultSelectedKey} defaultOpenKeys={openKey} />
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