import { Package } from 'app/models/package'
import React from 'react'
import './style.scss'
import MoneyFormat from '../money/MoneyFormat';

interface PackageDetailProps{
    pkg: Package;
    price?: number;
}

const PackageDetail: React.FC<PackageDetailProps> = ({ pkg, price }) => {
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
            {
                price ?
                <div className="item">
                    <span className="label-text">Tổng tiền thanh toán:</span>
                    <MoneyFormat value={price} color='Light Blue' isHighlight />
                    {/* <span className="value-text">{pkg.guarantee}</span> */}
                </div> : undefined
            }
        </div>
    )
}

export default PackageDetail