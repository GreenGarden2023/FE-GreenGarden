import { PackageService } from 'app/models/package'
import React from 'react'
import GridConfig from '../grid-config/GridConfig'
import { Col, Row } from 'antd'
import utilDateTime from 'app/utils/date-time'
import './style.scss'

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
                        <Col span={8}>
                            <p className='label'>Họ & tên</p>
                            <p className='value'>{pkgService.name}</p>
                        </Col>
                        <Col span={8}>
                            <p className='label'>Số điện thoại</p>
                            <p className='value'>{pkgService.phone}</p>
                        </Col>
                        <Col span={8}>
                            <p className='label'>Email</p>
                            <p className='value'>{pkgService.email}</p>
                        </Col>
                        <Col span={8}>
                            <p className='label'>Ngày tạo yêu cầu</p>
                            <p className='value'>{utilDateTime.dateToString(pkgService.createDate)}</p>
                        </Col>
                        <Col span={8}>
                            <p className='label'>Ngày bắt đầu</p>
                            <p className='value'>{utilDateTime.dateToString(pkgService.startDate)}</p>
                        </Col>
                        <Col span={8}>
                            <p className='label'>Ngày kết thúc</p>
                            <p className='value'>{utilDateTime.dateToString(pkgService.endDate)}</p>
                        </Col>
                        <Col span={8}>
                            <p className='label'>Số lượng cây</p>
                            <p className='value'>{pkgService.treeQuantity}</p>
                        </Col>
                        <Col span={8}>
                            <p className='label'>Số tháng</p>
                            <p className='value'>{pkgService.numOfMonths}</p>
                        </Col>
                        <Col span={8}>
                            <p className='label'>Người chăm sóc</p>
                            <p className='value'>{pkgService.technicianName}</p>
                        </Col>
                        <Col span={8}>
                            <p className='label'>Nơi chăm sóc</p>
                            <p className='value'>{pkgService.isAtShop ? 'Tại cửa hàng' : 'Tại nhà'}</p>
                        </Col>
                        <Col span={8}>
                            <p className='label'>Trạng thái đơn hàng</p>
                            <p className='value'>{pkgService.status}</p>
                        </Col>
                    </Row>
                </GridConfig>
            </div>
        </div>
    )
}

export default UserInfoPackageService