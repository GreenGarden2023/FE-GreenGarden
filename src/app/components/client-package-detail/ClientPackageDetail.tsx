import { Button, Modal } from 'antd'
import { Package, PackageService } from 'app/models/package'
import React, { useMemo } from 'react'
import PackageDetail from '../package-detail/PackageDetail';
import UserInfoPackageService from '../user-info-package-service/UserInfoPackageService';

interface ClientPackageDetailProps{
    pkgService: PackageService
    onClose: () => void;
}

const ClientPackageDetail: React.FC<ClientPackageDetailProps> = ({ pkgService, onClose }) => {

    const PkgDetail = useMemo(() =>{
        const { takecareComboDescription, takecareComboGuarantee, takecareComboID, takecareComboName, takecareComboPrice } = pkgService.takecareComboDetail

        const pkg: Package = {
            id: takecareComboID,
            description: takecareComboDescription,
            guarantee: takecareComboGuarantee,
            name: takecareComboName,
            price: takecareComboPrice,
            status: true,
            careGuide: pkgService.careGuide
        }

        return pkg;
    }, [pkgService.takecareComboDetail, pkgService.careGuide])

    return (
        <Modal
            open
            title={`Chi tiết thông tin gói chăm sóc (${pkgService.code})`}
            onCancel={onClose}
            footer={false}
            width={1000}
        >
            {
                PkgDetail && <PackageDetail pkg={PkgDetail} isCareGuide />
            }
            <UserInfoPackageService pkgService={pkgService} />
            <div className='btn-form-wrapper' style={{marginTop: '10px'}}>
                <Button htmlType='button'  type='primary' className='btn-update' size='large'  onClick={onClose}>
                    Đóng
                </Button>
            </div>
        </Modal>
    )
}

export default ClientPackageDetail