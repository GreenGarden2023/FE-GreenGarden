import React, { useMemo } from 'react'
import { Layout, Menu } from 'antd'
import type { MenuProps } from 'antd';
import './style.scss';
import { FaLongArrowAltRight, FaLongArrowAltLeft } from 'react-icons/fa';
import useSelector from '../hooks/use-selector';
import useDispatch from '../hooks/use-dispatch';
import { setCollapsedHeader } from '../slices/admin-layout';
import { Link, useLocation } from 'react-router-dom';
import { BiCategoryAlt } from 'react-icons/bi';
import { MdOutlineInventory2 } from 'react-icons/md'
import CONSTANT from 'app/utils/constant';
import { Role } from 'app/models/general-type';

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
    
    const { collapsedHeader } = useSelector(state => state.adminLayout);
    const { roleName } = useSelector(state => state.userInfor)

    const handleCollapsedHeader = () =>{
        dispatch(setCollapsedHeader({active: !collapsedHeader}))
    }
    const defaultOpenKey = useMemo(() =>{
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

    }, [location])
    const childrenOrder = [
        CONSTANT.MANAGE_ORDER.includes(roleName as Role) ? getItem(<Link to='/panel/rent-order'>Đơn thuê</Link>, '5', <BiCategoryAlt size={18} />) : null,
        CONSTANT.MANAGE_ORDER.includes(roleName as Role) ? getItem(<Link to='/panel/sale-order'>Đơn mua</Link>, '6', <BiCategoryAlt size={18} />) : null,
    ]
    const items: MenuItem[] = [
       CONSTANT.MANAGE_CATEGORY.includes(roleName as Role) ? getItem(<Link to='/panel/manage-category'>Manage Category</Link>, '1', <BiCategoryAlt size={18} />) : null,
       CONSTANT.MANAGE_PRODUCT.includes(roleName as Role) ? getItem(<Link to='/panel/manage-product'>Manage Product</Link>, '2', <MdOutlineInventory2 size={18} />) : null,
       CONSTANT.MANAGE_SIZE.includes(roleName as Role) ? getItem(<Link to='/panel/manage-size'>Manage Size</Link>, '3', <MdOutlineInventory2 size={18} />) : null,
       CONSTANT.MANAGE_ORDER.includes(roleName as Role) ? getItem('Manage Order', '4', <BiCategoryAlt size={18} />, childrenOrder) : null,
    ];
  return (
    <>
        <Layout className='admin-layout'>
            <Header className='admin-header'>
                <div className='left'>
                    <div className="box-collapsed" onClick={handleCollapsedHeader}>
                        {
                            collapsedHeader ? <FaLongArrowAltRight /> : <FaLongArrowAltLeft />
                        }
                    </div>
                </div>
            </Header>
            <Layout className='admin-layout-inside'>
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
                    <Menu className='admin-menu' theme="light" mode="inline"  items={items} selectedKeys={defaultOpenKey}  />
                </Sider>
                <Layout className="site-layout" style={{ marginLeft: collapsedHeader ? 80 : 200 }}>
                    <Content>
                    <div style={{ padding: 24}}>
                        {children}
                    </div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>Designed by Us</Footer>
                </Layout>
            </Layout>
        </Layout>
    </>
  )
}

export default AdminRoute