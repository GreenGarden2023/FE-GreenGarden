import { Package } from 'app/models/package'
import React from 'react'
import './style.scss'

interface PackageDetailProps{
    pkg: Package
}

const PackageDetail: React.FC<PackageDetailProps> = ({ pkg }) => {
    return (
        <div className="m-package-info">
            <h1>Thông tin gói chăm sóc</h1>
            <div className="item">
                <span className="label-text">Tên gói:</span>
                <span className="value-text">{pkg.name}</span>
            </div>
            <div className="item">
                <span className="label-text">Giá:</span>
                <span className="value-text">{pkg.price}/cây/tháng</span>
            </div>
            <div className="item">
                <span className="label-text">Mô tả:</span>
                <span className="value-text">{pkg.description}</span>
            </div>
            <div className="item">
                <span className="label-text">Cam kết của cửa hàng:</span>
                <span className="value-text">{pkg.guarantee}</span>
            </div>
        </div>
    )
}

export default PackageDetail