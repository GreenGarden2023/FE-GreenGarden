import { PackageOrder, PackageService } from 'app/models/package'
import React from 'react'
import GridConfig from '../grid-config/GridConfig'
import { Col, Row } from 'antd'
import utilDateTime from 'app/utils/date-time'
import './style.scss'
import MoneyFormat from '../money/MoneyFormat'
import PackageServiceOrderStatusComp from '../status/PackageServiceOrderStatusComp'
import PackageServiceStatusComp from '../status/PackageServiceStatusComp'

interface UserInfoPackageServiceProps{
    pkgService: PackageService
}

const UserInfoPackageService: React.FC<UserInfoPackageServiceProps> = ({ pkgService }) => {
    return (
        <div className="pkg-user-info">
            <h1>Thông tin khách hàng</h1>
            <div className="user-info-wrapper">
                <GridConfig>
                    <Row gutter={[24, 12]}>
                        <Col xs={24} sm={12} md={8} lg={8} xl={8} className='flex-item'>
                            <p className='label'>Họ & tên</p>
                            <p className='value'>{pkgService.name}</p>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={8} xl={8} className='flex-item'>
                            <p className='label'>Số điện thoại</p>
                            <p className='value'>{pkgService.phone}</p>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={8} xl={8} className='flex-item'>
                            <p className='label'>Email</p>
                            <p className='value'>{pkgService.email}</p>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={8} xl={8} className='flex-item'>
                            <p className='label'>Ngày tạo yêu cầu</p>
                            <p className='value'>{utilDateTime.dateToString(pkgService.createDate)}</p>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={8} xl={8} className='flex-item'>
                            <p className='label'>Ngày bắt đầu</p>
                            <p className='value'>{utilDateTime.dateToString(pkgService.startDate)}</p>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={8} xl={8} className='flex-item'>
                            <p className='label'>Ngày kết thúc</p>
                            <p className='value'>{utilDateTime.dateToString(pkgService.endDate)}</p>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={8} xl={8} className='flex-item'>
                            <p className='label'>Số lượng cây</p>
                            <p className='value'>{pkgService.treeQuantity}</p>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={8} xl={8} className='flex-item'>
                            <p className='label'>Số tháng</p>
                            <p className='value'>{pkgService.numOfMonths}</p>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={8} xl={8} className='flex-item'>
                            <p className='label'>Người chăm sóc</p>
                            <p className='value'>{pkgService.technicianName}</p>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={8} xl={8} className='flex-item'>
                            <p className='label'>Nơi chăm sóc</p>
                            <p className='value'>{pkgService.isAtShop ? 'Tại cửa hàng' : 'Tại nhà'}</p>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={8} xl={8} className='flex-item'>
                            <p className='label'>Trạng thái yêu cầu</p>
                            <p className='value' style={{marginTop: '5px'}}>
                                <PackageServiceStatusComp status={pkgService.status} />
                            </p>
                        </Col>
                        {
                            (pkgService.status === 'cancel' || pkgService.status === 'rejected') && 
                            <Col xs={24} sm={12} md={8} lg={8} xl={8} className='flex-item'>
                                <p className='label'>Người hủy yêu cầu</p>
                                <p className='value'>{pkgService.nameCancelBy}</p>
                            </Col>
                        }
                        {
                            pkgService.reason &&
                            <Col xs={24} sm={12} md={8} lg={8} xl={8} className='flex-item'>
                                <p className='label'>Lý do</p>
                                <p className='value'>{pkgService.reason}</p>
                            </Col>
                        }
                    </Row>
                </GridConfig>
            </div>
        </div>
    )
}

interface UserInfoPackageOrderProps{
    pkgOrder: PackageOrder
}

export const UserInfoPackageOrder: React.FC<UserInfoPackageOrderProps> = ({pkgOrder}) =>{
    return (
        <div className="pkg-user-info">
            <h1>Thông tin khách hàng</h1>
            <div className="user-info-wrapper">
                <GridConfig>
                    <Row gutter={[24, 12]}>
                        <Col xs={24} sm={12} md={8} lg={8} xl={8} className='flex-item'>
                            <p className='label'>Họ & tên:</p>
                            <p className='value'>{pkgOrder.takecareComboService.name}</p>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={8} xl={8} className='flex-item'>
                            <p className='label'>Số điện thoại:</p>
                            <p className='value'>{pkgOrder.takecareComboService.phone}</p>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={8} xl={8} className='flex-item'>
                            <p className='label'>Email:</p>
                            <p className='value'>{pkgOrder.takecareComboService.email}</p>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={8} xl={8} className='flex-item'>
                            <p className='label'>Ngày tạo đơn hàng:</p>
                            <p className='value'>{utilDateTime.dateToString(pkgOrder.createDate)}</p>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={8} xl={8} className='flex-item'>
                            <p className='label'>Ngày bắt đầu chăm sóc:</p>
                            <p className='value'>{utilDateTime.dateToString(pkgOrder.serviceStartDate)}</p>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={8} xl={8} className='flex-item'>
                            <p className='label'>Ngày kết thúc chăm sóc:</p>
                            <p className='value'>{utilDateTime.dateToString(pkgOrder.serviceEndDate)}</p>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={8} xl={8} className='flex-item'>
                            <p className='label'>Tiền cọc:</p>
                            <p className='value'>
                                <MoneyFormat value={pkgOrder.deposit} color='Orange' />
                            </p>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={8} xl={8} className='flex-item'>
                            <p className='label'>Tổng tiền:</p>
                            <p className='value'>
                                <MoneyFormat value={pkgOrder.totalPrice} color='Light Blue' />
                            </p>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={8} xl={8} className='flex-item'>
                            <p className='label'>Tiền còn thiếu:</p>
                            <p className='value'>
                                <MoneyFormat value={pkgOrder.remainAmount} color='Blue' />
                            </p>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={8} xl={8} className='flex-item'>
                            <p className='label'>Số lượng cây:</p>
                            <p className='value'>{pkgOrder.takecareComboService.treeQuantity}</p>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={8} xl={8} className='flex-item'>
                            <p className='label'>Số tháng:</p>
                            <p className='value'>{pkgOrder.takecareComboService.numOfMonths}</p>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={8} xl={8} className='flex-item'>
                            <p className='label'>Người chăm sóc:</p>
                            <p className='value'>{pkgOrder.takecareComboService.technicianName}</p>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={8} xl={8} className='flex-item'>
                            <p className='label'>Nơi chăm sóc:</p>
                            <p className='value'>{pkgOrder.takecareComboService.isAtShop ? 'Tại cửa hàng' : 'Tại nhà'}</p>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={8} xl={8} className='flex-item'>
                            <p className='label'>Trạng thái đơn hàng:</p>
                            <p className='value' style={{marginTop: '5px'}}>
                                <PackageServiceOrderStatusComp status={pkgOrder.status} />
                            </p>
                        </Col>
                        {
                            pkgOrder.status === 'cancel' && 
                            <Col xs={24} sm={12} md={8} lg={8} xl={8} className='flex-item'>
                                <p className='label'>Người hủy đơn hàng:</p>
                                <p className='value'>{pkgOrder.nameCancelBy}</p>
                            </Col>
                        }
                        {
                            pkgOrder.reason &&
                            <Col xs={24} sm={12} md={8} lg={8} xl={8} className='flex-item'>
                                <p className='label'>Lý do:</p>
                                <p className='value'>{pkgOrder.reason}</p>
                            </Col>
                        }
                    </Row>
                </GridConfig>
            </div>
        </div>
    )
}

export default UserInfoPackageService