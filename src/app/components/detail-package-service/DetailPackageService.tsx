import { Button, Modal } from 'antd';
import { Package, PackageService } from 'app/models/package';
import React, { useMemo } from 'react';
import PackageDetail from '../package-detail/PackageDetail';
import UserInfoPackageService from '../user-info-package-service/UserInfoPackageService';
import './style.scss';

interface DetailPackageServiceProps{
    pkgService: PackageService
    onClose: () => void;
}

const DetailPackageService: React.FC<DetailPackageServiceProps> = ({ pkgService, onClose }) => {
    const PkgDetail = useMemo(() =>{
        const { takecareComboDescription, takecareComboGuarantee, takecareComboID, takecareComboName, takecareComboPrice } = pkgService.takecareComboDetail

        const pkg: Package = {
            id: takecareComboID,
            description: takecareComboDescription,
            guarantee: takecareComboGuarantee,
            name: takecareComboName,
            price: takecareComboPrice,
            status: true
        }

        return pkg;
    }, [pkgService.takecareComboDetail])

    return (
        <Modal
            open
            title={`Chi tiết yêu cầu gói tự chọn (${pkgService.code})`}
            onCancel={onClose}
            footer={false}
            width={1000}
        >
            {
                PkgDetail && <PackageDetail pkg={PkgDetail} />
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

export default DetailPackageService