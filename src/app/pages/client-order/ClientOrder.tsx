import { Tag } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import LandingFooter from 'app/components/footer/LandingFooter';
import HeaderInfor from 'app/components/header-infor/HeaderInfor';
import LandingHeader from 'app/components/header/LandingHeader';
import useDispatch from 'app/hooks/use-dispatch';
import useSelector from 'app/hooks/use-selector';
import { Order } from 'app/models/order';
import orderService from 'app/services/order.service';
import { setNoti } from 'app/slices/notification';
import CONSTANT from 'app/utils/constant';
import utilDateTime from 'app/utils/date-time';
import utilGeneral from 'app/utils/general';
import React, { useEffect, useMemo, useState } from 'react';
import CurrencyFormat from 'react-currency-format';
import { BiDetail } from 'react-icons/bi';
import './style.scss';

// interface OrderViewModel{
//     orderID: string;
//     totalPrice: string;
//     createDate: string;
//     status: OrderStatus;
//     isForRent: boolean;
//     addendums: Addendum[]
// }

const ClientOrder: React.FC = () =>{
    const { id } = useSelector(state => state.userInfor)
    const dispatch = useDispatch();

    const [orders, setOrders] = useState<Order[]>([])

    useEffect(() =>{
        if(!id) return;

        const init = async () =>{
            try{
                const res = await orderService.getAllOrdersCustomer()
                setOrders(res.data.orders)
            }catch{
                dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
            }
        }
        init()
    }, [id, dispatch])

    const Column: ColumnsType<any> = [
        {
            title: '#',
            key: '#',
            dataIndex: '#',
            align: 'center',
            render: (v, _, index) => (<span style={{color: '#00a76f'}}>{index + 1}</span>)
        },
        {
            title: 'Mã đơn hàng',
            key: 'orderID',
            dataIndex: 'orderID',
            align: 'center',
            render: (v) => (v.slice(0, 5))
        },
        {
            title: 'Ngày tạo',
            key: 'createDate',
            dataIndex: 'createDate',
            align: 'center',
            render: (v) => (utilDateTime.dateToString(v))
        },
        {
            title: 'Giá tiền',
            key: 'totalPrice',
            dataIndex: 'totalPrice',
            align: 'center',
            render: (v) => (
                <CurrencyFormat value={v} displayType={'text'} thousandSeparator={true} suffix={' đ'} />
            )
        },
        {
            title: 'Trạng thái',
            key: 'status',
            dataIndex: 'status',
            align: 'center',
            render: (v) => (<Tag color={utilGeneral.statusToColor(v)}>{utilGeneral.statusToViLanguage(v)}</Tag>)
        },
        {
            title: 'Loại đơn hàng',
            key: 'isForRent',
            dataIndex: 'isForRent',
            align: 'center',
            render: (v) => (v ? <Tag color='volcano'>Thuê</Tag> : <Tag color='purple'>Mua</Tag>)
        },
        {
            title: 'Ngày bắt đầu thuê',
            key: 'startDateRent',
            dataIndex: 'startDateRent',
            align: 'center',
            render: (_, record) => (
                `${record.addendums.map(x => utilDateTime.dateToString(x.startDateRent)).join('\n')}`
            )
        },
        {
            title: 'Ngày kết thúc thuê',
            key: 'endDateRent',
            dataIndex: 'endDateRent',
            align: 'center',
            render: (_, record) => (`${record.addendums.map(x => utilDateTime.dateToString(x.endDateRent)).join('\n')}`)
        },
        {
            title: 'Xử lý',
            key: 'action',
            dataIndex: 'action',
            align: 'center',
            render: (v) => (<BiDetail size={25} cursor='pointer' color='#00a76f' />)
        },
    ]
    const DataSource = useMemo(() =>{
        return orders.map((x, index) => ({
            key: String(index + 1),
            orderID: x.orderID,
            totalPrice: x.totalPrice,
            createDate: x.createDate,
            status: x.status,
            isForRent: x.isForRent,
            addendums: x.addendums,
        }))
    }, [orders])

    return (
        <div>
            <LandingHeader />
            <div className="main-content-not-home">
                <div className="container-wrapper co-wrapper">
                    <HeaderInfor title='Quản lý đơn hàng của bạn' />
                    <section className="co-box default-layout">
                        <Table className='cart-table' dataSource={DataSource} columns={Column} pagination={false} />
                    </section>
                </div>
            </div>
            <LandingFooter />
        </div>
    );
}

export default ClientOrder;