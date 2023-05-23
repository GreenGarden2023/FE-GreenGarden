import { Button, Modal } from 'antd';
import { Package, PackageOrder } from 'app/models/package';
import React, { useMemo } from 'react'
import PackageDetail from '../package-detail/PackageDetail';
import { UserInfoPackageOrder } from '../user-info-package-service/UserInfoPackageService';

interface DetailPackageOrderProps{
    pkgOrder: PackageOrder
    onClose: () => void;
}

const DetailPackageOrder: React.FC<DetailPackageOrderProps> = ({ pkgOrder, onClose }) => {

    const PkgDetail = useMemo(() =>{
        const { takecareComboDescription, takecareComboGuarantee, takecareComboID, takecareComboName, takecareComboPrice } = pkgOrder.takecareComboService.takecareComboDetail

        const pkg: Package = {
            id: takecareComboID,
            description: takecareComboDescription,
            guarantee: takecareComboGuarantee,
            name: takecareComboName,
            price: takecareComboPrice,
            status: true
        }

        return pkg;
    }, [pkgOrder.takecareComboService.takecareComboDetail])

    return (
        <Modal
            open
            title={`Chi tiết đơn hàng (${pkgOrder.orderCode})`}
            onCancel={onClose}
            footer={false}
            width={1000}
        >
            {
                PkgDetail && <PackageDetail pkg={PkgDetail} />
            }
            <UserInfoPackageOrder pkgOrder={pkgOrder} />
            <div className='btn-form-wrapper' style={{marginTop: '10px'}}>
                <Button htmlType='button'  type='primary' className='btn-update' size='large'  onClick={onClose}>
                    Đóng
                </Button>
            </div>
        </Modal>
    )
}

export default DetailPackageOrder