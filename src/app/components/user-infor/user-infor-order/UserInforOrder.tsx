import React from 'react'
import './style.scss'
import { Col, Row } from 'antd'
import { MdDateRange, MdOutlineDriveFileRenameOutline } from 'react-icons/md'
import { OrderStatus } from 'app/models/general-type';
import MoneyFormat from 'app/components/money/MoneyFormat';
import { AiOutlinePhone } from 'react-icons/ai';
import { CiLocationOn } from 'react-icons/ci';
import { HiOutlineStatusOnline } from 'react-icons/hi';
import { FaMoneyBillWave } from 'react-icons/fa';
import OrderStatusComp from 'app/components/status/OrderStatusComp';

interface UserInforOrderProps{
    name?: string;
    phone?: string;
    address?: string;
    createOrderDate?: string;
    startDate?: string;
    endDate?: string;
    status?: OrderStatus;
    transportFee?: number;
    totalOrder?: number;
    remainMoney?: number;
    deposit?: number;
    reason?: string;
}

const UserInforOrder: React.FC<UserInforOrderProps> = ({name, phone, address, createOrderDate, startDate, endDate, status, transportFee, totalOrder, remainMoney, deposit, reason}) => {
  return (
    <div className='uio-wrapper'>
        <div className="uio-content">
            <p className="title">Thông tin đơn hàng</p>
            <div className="uio-infor">
                <Row gutter={[24, 24]}>
                    {
                        name && 
                        <Col span={8}>
                            <div className="item">
                                <div className="label">
                                    <MdOutlineDriveFileRenameOutline color='#5cb9d8' size={20} />
                                    <span>Tên</span>
                                </div>
                                <div className="content">
                                    {name}
                                </div>
                            </div>
                        </Col>
                    }
                    {
                        phone && 
                        <Col span={8}>
                            <div className="item">
                                <div className="label">
                                    <AiOutlinePhone color='#5cb9d8' size={20} />
                                    <span>Số điện thoại</span>
                                </div>
                                <div className="content">
                                    {phone}
                                </div>
                            </div>
                        </Col>
                    }
                    {
                        address && 
                        <Col span={8}>
                            <div className="item">
                                <div className="label">
                                    <CiLocationOn color='#5cb9d8' size={20} />
                                    <span>Địa chỉ</span>
                                </div>
                                <div className="content">
                                    {address}
                                </div>
                            </div>
                        </Col>
                    }
                    {
                        createOrderDate && 
                        <Col span={8}>
                            <div className="item">
                                <div className="label">
                                    <MdDateRange color='#5cb9d8' size={20} />
                                    <span>Ngày tạo đơn</span>
                                </div>
                                <div className="content">
                                    {createOrderDate}
                                </div>
                            </div>
                        </Col>
                    }
                    {
                        startDate && 
                        <Col span={8}>
                            <div className="item">
                                <div className="label">
                                    <MdDateRange color='#5cb9d8' size={20} />
                                    <span>Ngày thuê</span>
                                </div>
                                <div className="content">
                                    {startDate}
                                </div>
                            </div>
                        </Col>
                    }
                    {
                        endDate && 
                        <Col span={8}>
                            <div className="item">
                                <div className="label">
                                    <MdDateRange color='#5cb9d8' size={20} />
                                    <span>Ngày kết thúc</span>
                                </div>
                                <div className="content">
                                    {endDate}
                                </div>
                            </div>
                        </Col>
                    }
                    {
                        status && 
                        <Col span={8}>
                            <div className="item">
                                <div className="label">
                                    <HiOutlineStatusOnline color='#5cb9d8' size={20} />
                                    <span>Trạng thái</span>
                                </div>
                                <div className="content">
                                    <OrderStatusComp status={status} />
                                </div>
                            </div>
                        </Col>
                    }
                    {
                        (transportFee !== undefined) && 
                        <Col span={8}>
                            <div className="item">
                                <div className="label">
                                    <FaMoneyBillWave color='#5cb9d8' size={20} />
                                    <span>Phí vận chuyển</span>
                                </div>
                                <div className="content">
                                    <MoneyFormat value={transportFee} color='Default' />
                                </div>
                            </div>
                        </Col>
                    }
                    {
                        (totalOrder !== undefined) && 
                        <Col span={8}>
                            <div className="item">
                                <div className="label">
                                    <FaMoneyBillWave color='#5cb9d8' size={20} />
                                    <span>Tổng đơn hàng</span>
                                </div>
                                <div className="content">
                                    <MoneyFormat value={totalOrder} color='Light Blue' />
                                </div>
                            </div>
                        </Col>
                    }
                    {
                        (remainMoney !== undefined) && 
                        <Col span={8}>
                            <div className="item">
                                <div className="label">
                                    <FaMoneyBillWave color='#5cb9d8' size={20} />
                                    <span>Tiền còn thiếu</span>
                                </div>
                                <div className="content">
                                    <MoneyFormat value={remainMoney} color='Blue' />
                                </div>
                            </div>
                        </Col>
                    }
                    {
                        (deposit !== undefined) && 
                        <Col span={8}>
                            <div className="item">
                                <div className="label">
                                    <FaMoneyBillWave color='#5cb9d8' size={20} />
                                    <span>Tiền cọc</span>
                                </div>
                                <div className="content">
                                    <MoneyFormat value={deposit} color='Orange' />
                                </div>
                            </div>
                        </Col>
                    }
                    {
                        reason && 
                        <Col span={8}>
                            <div className="item">
                                <div className="label">
                                    <FaMoneyBillWave color='#5cb9d8' size={20} />
                                    <span>Lý do hủy đơn</span>
                                </div>
                                <div className="content">
                                    <p>{reason}</p>
                                </div>
                            </div>
                        </Col>
                    }
                </Row>
            </div>
        </div>
    </div>
  )
}

export default UserInforOrder