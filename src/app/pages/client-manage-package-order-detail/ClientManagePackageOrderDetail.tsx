import LandingFooter from 'app/components/footer/LandingFooter'
import LandingHeader from 'app/components/header/LandingHeader'
import PackageDetail from 'app/components/package-detail/PackageDetail'
import TablePackageCalendar from 'app/components/technician-handle-package-order/TablePackageCalendar'
import { UserInfoPackageOrder } from 'app/components/user-info-package-service/UserInfoPackageService'
import { Package, PackageOrder } from 'app/models/package'
import { ServiceCalendar } from 'app/models/service-calendar'
import takeComboOrderService from 'app/services/take-combo-order.service'
import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'

const ClientManagePackageOrderDetail: React.FC = () => {
    const { orderId } = useParams();

    // data
    const [pkgOrder, setPkgOrder] = useState<PackageOrder>()
    const [serviceCalendars, setServiceCalendars] = useState<ServiceCalendar[]>([])

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

    return (
        <div className='client-manage-package-order-detail'>
            <LandingHeader />
            <div className="main-content-not-home">
                <div className="container-wrapper">
                    <section className="default-layout">
                        {
                            PkgDetail && <PackageDetail pkg={PkgDetail} />
                        }
                        {
                            pkgOrder && <UserInfoPackageOrder pkgOrder={pkgOrder} />
                        }
                    </section>
                    {
                        (pkgOrder && serviceCalendars.length !== 0) &&
                        <section className="default-layout">
                            <TablePackageCalendar pkgOrder={pkgOrder} serviceCalendars={serviceCalendars} isClient />
                        </section>
                    }
                </div>
            </div>
            <LandingFooter />
        </div>
    )
}

export default ClientManagePackageOrderDetail