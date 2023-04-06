import { Image, Modal } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import MoneyFormat from 'app/components/money/MoneyFormat';
import TreeName from 'app/components/renderer/tree-name/TreeName';
import { SaleOrderList } from 'app/models/order';
import utilDateTime from 'app/utils/date-time';
import utilGeneral from 'app/utils/general';
import React, { useMemo } from 'react';
import { AiOutlinePhone } from 'react-icons/ai';
import { BsFillCartCheckFill } from 'react-icons/bs';
import { CiLocationOn } from 'react-icons/ci';
import { FaMoneyBillWave } from 'react-icons/fa';
import { HiOutlineStatusOnline } from 'react-icons/hi';
import { IoInformationCircleOutline } from 'react-icons/io5';
import { MdOutlineDriveFileRenameOutline } from 'react-icons/md';
import './style.scss';

interface ModalClientSaleOrderDetaiProps{
    saleOrderList: SaleOrderList;
    onClose: () => void;
}

const ModalClientSaleOrderDetai: React.FC<ModalClientSaleOrderDetaiProps> = ({ saleOrderList, onClose }) => {

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
            render: (v) => (<TreeName name={v} />)
        },
        {
            title: 'Hình ảnh',
            key: 'imgURL',
            dataIndex: 'imgURL',
            align: 'center',
            render: (v) => (
                <Image 
                    width={100}
                    height={100}
                    src={v}
                    style={{objectFit: 'cover'}}
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
            title: 'Giá tiền',
            key: 'salePricePerUnit',
            dataIndex: 'salePricePerUnit',
            align: 'right',
            render: (v) => (<MoneyFormat value={v} isHighlight color='Light Blue' />)
        },
        {
            title: 'Số lượng',
            key: 'quantity',
            dataIndex: 'quantity',
            align: 'center',
            render: (v) => (v)
        },
        {
            title: 'Tổng tiền',
            key: 'totalPrice',
            dataIndex: 'totalPrice',
            align: 'right',
            render: (v) => (<MoneyFormat value={v} isHighlight color='Blue' />)
        },
    ]
    const DataSource = useMemo(() =>{
        return saleOrderList.rentOrderDetailList.map((x, index) => ({
            key: String(index + 1),
            id: x.id,
            totalPrice: x.totalPrice,
            quantity: x.quantity,
            salePricePerUnit: x.salePricePerUnit,
            sizeName: x.sizeName,
            productItemName: x.productItemName,
            imgURL: x.imgURL,
        }))
    }, [saleOrderList])

    const TotalPrice = useMemo(() =>{
        let total = 0
        for (const item of saleOrderList.rentOrderDetailList) {
            total += item.quantity * item.salePricePerUnit
        }
        return total
    }, [saleOrderList])

    return (
        <Modal
            open
            title={`Chi tiết đơn hàng ${saleOrderList.orderCode}`}
            onCancel={onClose}
            onOk={onClose}
            width={1200}
            className='mcsod-wrapper'
        >
            <Table className='table' dataSource={DataSource} columns={Column} pagination={false} />
            <div className="more-infor">
                <p className='title'><IoInformationCircleOutline size={25} color='#0099FF' /><span>Thông tin khách hàng</span></p>

                <div className="name">
                    <div className="left">
                        <MdOutlineDriveFileRenameOutline size={20} color='#0099FF' />
                        <span>Tên</span>
                    </div>
                    <div className="right">
                        <span>{saleOrderList.recipientName}</span>
                    </div>
                </div>
                <div className="name">
                    <div className="left">
                        <AiOutlinePhone size={20} color='#0099FF' />
                        <span>Số điện thoại</span>
                    </div>
                    <div className="right">
                        <span>{saleOrderList.recipientPhone}</span>
                    </div>
                </div>
                <div className="name">
                    <div className="left">
                        <CiLocationOn size={20} color='#0099FF' />
                        <span>Địa chỉ</span>
                    </div>
                    <div className="right">
                        <span>{saleOrderList.recipientAddress}</span>
                    </div>
                </div>
                <div className="name">
                    <div className="left">
                        <BsFillCartCheckFill size={20} color='#0099FF' />
                        <span>Ngày tạo đơn hàng</span>
                    </div>
                    <div className="right">
                        <span>{utilDateTime.dateToString(saleOrderList.createDate.toString())}</span>
                    </div>
                </div>
                <div className="name">
                    <div className="left">
                        <HiOutlineStatusOnline size={20} color='#0099FF' />
                        <span>Trạng thái</span>
                    </div>
                    <div className="right">
                        <span>{utilGeneral.statusToViLanguage(saleOrderList.status)}</span>
                    </div>
                </div>
                <div className="name">
                    <div className="left">
                        <FaMoneyBillWave size={20} color='#0099FF' />
                        <span>Phí vận chuyển</span>
                    </div>
                    <div className="right">
                        <MoneyFormat value={saleOrderList.transportFee} isHighlight color='Orange' />
                    </div>
                </div>
                <div className="name">
                    <div className="left">
                        <FaMoneyBillWave size={20} color='#0099FF' />
                        <span>Tổng tiền hàng</span>
                    </div>
                    <div className="right">
                        <MoneyFormat value={TotalPrice} isHighlight color='Light Blue' />
                    </div>
                </div>
                <div className="name">
                    <div className="left">
                        <FaMoneyBillWave size={20} color='#0099FF' />
                        <span>Tổng đơn hàng</span>
                    </div>
                    <div className="right">
                        <MoneyFormat value={saleOrderList.totalPrice} isHighlight color='Blue' />
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default ModalClientSaleOrderDetai