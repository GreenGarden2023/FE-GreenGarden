import { Image, Modal, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { RentOrderList } from 'app/models/order';
import utilDateTime from 'app/utils/date-time';
import utilGeneral from 'app/utils/general';
import React, { useMemo } from 'react';
import CurrencyFormat from 'react-currency-format';
import { AiOutlinePhone } from 'react-icons/ai';
import { BiArrowFromBottom, BiArrowFromTop } from 'react-icons/bi';
import { BsFillCartCheckFill } from 'react-icons/bs';
import { CiLocationOn } from 'react-icons/ci';
import { FaMoneyBillWave, FaSlack } from 'react-icons/fa';
import { HiOutlineStatusOnline } from 'react-icons/hi';
import { IoInformationCircleOutline } from 'react-icons/io5';
import { MdOutlineDriveFileRenameOutline } from 'react-icons/md';
import './style.scss';

interface ModalClientRentOrderDetaiProps{
    rentOrderList: RentOrderList;
    onClose: () => void;
    // index?: number
}

const ModalClientRentOrderDetai: React.FC<ModalClientRentOrderDetaiProps> = ({rentOrderList, onClose}) => {
    // const rentOrderDetail = rentOrder.rentOrderList[index]

    const Column: ColumnsType<any> = [
        {
            title: '#',
            key: '#',
            dataIndex: '#',
            align: 'center',
            render: (v, _, index) => (<span style={{color: '#00a76f'}}>{index + 1}</span>)
        },
        {
            title: 'Tên sản phẩm',
            key: 'productItemName',
            dataIndex: 'productItemName',
            render: (v) => (v)
        },
        {
            title: 'Hình ảnh',
            key: 'imgURL',
            dataIndex: 'imgURL',
            align: 'center',
            render: (v) => (
                <Image
                    width={150}
                    height={150}
                    src={v}
                />
            )
        },
        {
            title: 'Kích thước',
            key: 'sizeName',
            dataIndex: 'sizeName',
            align: 'center',
            render: (v) => (v)
        },
        {
            title: 'Số lượng',
            key: 'quantity',
            dataIndex: 'quantity',
            align: 'center',
            render: (v) => (v)
        },
        {
            title: 'Giá tiền',
            key: 'rentPricePerUnit',
            dataIndex: 'rentPricePerUnit',
            align: 'right',
            render: (v) => (<CurrencyFormat className='value' value={v || 0} displayType={'text'} thousandSeparator={true} suffix={'VNĐ'} />)
        },
        {
            title: 'Tổng tiền',
            key: 'totalPrice',
            dataIndex: 'totalPrice',
            align: 'right',
            render: (v) => (<CurrencyFormat className='value' value={v} displayType={'text'} thousandSeparator={true} suffix={'VNĐ'} />)
        },
    ]

    const DataSource = useMemo(() =>{
        return rentOrderList.rentOrderDetailList.map((x, index) => ({
            key: String(index + 1),
            id: x.id,
            totalPrice: x.totalPrice,
            quantity: x.quantity,
            rentPricePerUnit: x.rentPricePerUnit,
            sizeName: x.sizeName,
            productItemName: x.productItemName,
            imgURL: x.imgURL,
        }))
    }, [rentOrderList])

    return (
        <Modal
            open
            title={`Chi tiết đơn hàng ${rentOrderList.orderCode}`}
            onCancel={onClose}
            onOk={onClose}
            width={1200}
            className='mcrod-wrapper'
        >
            <Table dataSource={DataSource} columns={Column} pagination={false} />
            <div className="more-infor">
                <p className='title'><IoInformationCircleOutline size={25} color='#0099FF' /><span>Thông tin khách hàng</span></p>

                <div className="name">
                    <div className="left">
                        <MdOutlineDriveFileRenameOutline size={20} color='#0099FF' />
                        <span>Tên</span>
                    </div>
                    <div className="right">
                        <span>{rentOrderList.recipientName}</span>
                    </div>
                </div>
                <div className="name">
                    <div className="left">
                        <AiOutlinePhone size={20} color='#0099FF' />
                        <span>Số điện thoại</span>
                    </div>
                    <div className="right">
                        <span>{rentOrderList.recipientPhone}</span>
                    </div>
                </div>
                <div className="name">
                    <div className="left">
                        <CiLocationOn size={20} color='#0099FF' />
                        <span>Địa chỉ</span>
                    </div>
                    <div className="right">
                        <span>{rentOrderList.recipientAddress}</span>
                    </div>
                </div>
                {/* <div className="name">
                    <div className="left">
                        <BsFillCartCheckFill size={20} color='#0099FF' />
                        <span>Ngày tạo đơn hàng đầu tiên</span>
                    </div>
                    <div className="right">
                        <span>{utilDateTime.dateToString(rentOrderList.createDate.toString())}</span>
                    </div>
                </div> */}
                <div className="name">
                    <div className="left">
                        <BsFillCartCheckFill size={20} color='#0099FF' />
                        <span>Ngày tạo đơn hàng</span>
                    </div>
                    <div className="right">
                        <span>{utilDateTime.dateToString(rentOrderList.createDate.toString())}</span>
                    </div>
                </div>
                <div className="name">
                    <div className="left">
                        <BiArrowFromBottom size={20} color='#0099FF' />
                        <span>Ngày bắt đầu thuê</span>
                    </div>
                    <div className="right">
                        <span>{utilDateTime.dateToString(rentOrderList.startDateRent.toString())}</span>
                    </div>
                </div>
                <div className="name">
                    <div className="left">
                        <BiArrowFromTop  size={20} color='#0099FF' />
                        <span>Ngày kết thúc thuê</span>
                    </div>
                    <div className="right">
                        <span>{utilDateTime.dateToString(rentOrderList.endDateRent.toString())}</span>
                    </div>
                </div>
                <div className="name">
                    <div className="left">
                        <HiOutlineStatusOnline size={20} color='#0099FF' />
                        <span>Trạng thái</span>
                    </div>
                    <div className="right">
                        <span>{utilGeneral.statusToViLanguage(rentOrderList.status)}</span>
                    </div>
                </div>
                <div className="name">
                    <div className="left">
                        <FaSlack size={20} color='#0099FF' />
                        <span>Tiền còn thiếu</span>
                    </div>
                    <div className="right">
                        <CurrencyFormat className='value' value={rentOrderList.remainMoney} displayType={'text'} thousandSeparator={true} suffix={'VNĐ'} />
                    </div>
                </div>
                <div className="name">
                    <div className="left">
                        <FaMoneyBillWave size={20} color='#0099FF' />
                        <span>Tổng đơn hàng</span>
                    </div>
                    <div className="right">
                        <CurrencyFormat className='value' value={rentOrderList.totalPrice} displayType={'text'} thousandSeparator={true} suffix={'VNĐ'} />
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default ModalClientRentOrderDetai