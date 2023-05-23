import PackageDetail from 'app/components/package-detail/PackageDetail';
import CreatePackageCalendar from 'app/components/technician-handle-package-order/CreatePackageCalendar';
import TablePackageCalendar from 'app/components/technician-handle-package-order/TablePackageCalendar';
import { UserInfoPackageOrder } from 'app/components/user-info-package-service/UserInfoPackageService';
import { Package, PackageOrder } from 'app/models/package';
import { PaymentControlState } from 'app/models/payment';
import { ServiceCalendar } from 'app/models/service-calendar';
import takeComboOrderService from 'app/services/take-combo-order.service';
import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom';

const ManagePackageOrderDetail: React.FC = () => {
    const { orderId } = useParams();

    const [pkgOrder, setPkgOrder] = useState<PackageOrder>()
    const [serviceCalendars, setServiceCalendars] = useState<ServiceCalendar[]>([])

    const [actionMethod, setActionMethod] = useState<PaymentControlState>()

    useEffect(() =>{
        if(!orderId) return;

        const init = async () =>{
            try{
                const res = await takeComboOrderService.getOrderById(orderId)
                setPkgOrder(res.data)
            }catch{

            }
        }
        init()
    }, [orderId])

    useEffect(() =>{
        if(!orderId) return;

        const init = async () =>{
            try{
                const res = await takeComboOrderService.getServiceCalendarByServiceOrder(orderId)
                setServiceCalendars(res.data)
            }catch{

            }
        }
        init()
    }, [orderId])

    const PkgDetail = useMemo(() =>{
        if(!pkgOrder) return;

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
    }, [pkgOrder])

    const handleCreateFirstCalendar = () =>{
        setActionMethod({orderId: '', actionType: 'create calendar', openIndex: -1, orderType: 'service'})
    }

    const handleCloseModal = () =>{
        setActionMethod(undefined)
    }

    const createFirstCalendar = (pkgOrderCreate: PackageOrder) =>{
        setPkgOrder(pkgOrderCreate)
    }

    return (
        <div>
            <section className="default-layout">
                {
                    PkgDetail && <PackageDetail pkg={PkgDetail} />
                }
            </section>
            <section className="default-layout">
                {
                    pkgOrder && <UserInfoPackageOrder pkgOrder={pkgOrder} />
                }
            </section>
            <section className="default-layout">
                <h3>Bạn chưa có lịch chăm sóc nào. Hãy tạo mới 1 lịch chăm sóc</h3>
                <button onClick={handleCreateFirstCalendar}>Tạo mới 1 lịch chăm sóc</button>
            </section>
            <section className="default-layout">
                {
                    (pkgOrder && serviceCalendars.length !== 0) && <TablePackageCalendar pkgOrder={pkgOrder} serviceCalendars={serviceCalendars} />
                }
            </section>
            {
                (actionMethod?.actionType === 'create calendar' && pkgOrder) &&
                <CreatePackageCalendar pkgOrder={pkgOrder} onClose={handleCloseModal} onSubmit={createFirstCalendar} />
            }
        </div>
    )
}

export default ManagePackageOrderDetail