import { Collapse, Popover } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import HeaderInfor from "app/components/header-infor/HeaderInfor";
import CancelOrder from "app/components/modal/cancel-order/CancelOrder";
import ModalClientRentOrderDetai from "app/components/modal/client-rent-order-detail/ModalClientRentOrderDetai";
import RefundOrder from "app/components/modal/refundOrder.tsx/RefundOrder";
import RentOrderPaymentCash from "app/components/modal/rent-oder-payment-cash/RentOrderPaymentCash";
import RentOrderPaymentDeposit from "app/components/modal/rent-order-payment-deposit/RentOrderPaymentDeposit";
import Renting from "app/components/modal/renting/Renting";
import ReturnDepositRentOrder from "app/components/modal/return-deposit-rent-order/ReturnDepositRentOrder";
import TransactionDetail from "app/components/modal/transaction-detail/TransactionDetail";
import MoneyFormat from "app/components/money/MoneyFormat";
import Transport from "app/components/renderer/transport/Transport";
import OrderStatusComp from "app/components/status/OrderStatusComp";
import UserInforTable from "app/components/user-infor/UserInforTable";
import useDispatch from "app/hooks/use-dispatch";
import { OrderStatus } from "app/models/general-type";
import { RentOrder } from "app/models/order";
import { PaymentControlState } from "app/models/payment";
import orderService from "app/services/order.service";
import paymentService from "app/services/payment.service";
import { setNoti } from "app/slices/notification";
import CONSTANT from "app/utils/constant";
import utilDateTime from "app/utils/date-time";
import pagingPath from "app/utils/paging-path";
import React, { useEffect, useMemo, useState } from "react";
import CurrencyFormat from "react-currency-format";
import { AiOutlineTransaction } from "react-icons/ai";
import { BiDetail } from "react-icons/bi";
import { GiReturnArrow } from "react-icons/gi";
import { GrMore } from "react-icons/gr";
import { HiArrowTopRightOnSquare } from "react-icons/hi2";
import { MdCancelPresentation, MdOutlineKeyboardReturn, MdOutlinePayment, MdOutlinePayments } from "react-icons/md";
import { VscServerProcess } from "react-icons/vsc";
import { useParams } from "react-router-dom";
import "./style.scss";

const ManageRentOrderGroup: React.FC = () => {
  const { groupId } = useParams();
  const dispatch = useDispatch();

  const [groupOrder, setGroupOrder] = useState<RentOrder>();

  const [actionMethod, setActionMethod] = useState<PaymentControlState>()

  const [recall, setRecall] = useState(true);

  useEffect(() => {
    pagingPath.scrollTop()
    if (!groupId) return;

    if(!recall) return;

    const init = async () => {
      try {
        const res = await orderService.getRentOrderGroup(groupId);
        const newRes = {...res.data}
        newRes.rentOrderList = newRes.rentOrderList.reverse()
        setGroupOrder(newRes);
      } catch {

      }
      setRecall(false)
    };
    init();
  }, [groupId, recall]);

  const ColumnRentOrder: ColumnsType<any> = [
    {
      title: "Mã đơn hàng",
      key: "orderCode",
      dataIndex: "orderCode",
      align: "center",
      width: 170,
      fixed: "left",
      render: (v) => <span className="order-code">{v}</span>,
    },
    {
      title: "Thông tin khách hàng",
      key: "recipientName",
      dataIndex: "recipientName",
      width: 300,
      render: (_, record) => (
        <UserInforTable
          name={record.recipientName}
          phone={record.recipientPhone}
          address={record.recipientAddress}
        />
      ),
    },
    {
      title: "Ngày bắt đầu thuê",
      key: "startDateRent",
      dataIndex: "startDateRent",
      render: (v) => utilDateTime.dateToString(v),
    },
    {
      title: "Ngày kết thúc thuê",
      key: "endDateRent",
      dataIndex: "endDateRent",
      render: (v) => utilDateTime.dateToString(v),
    },
    {
      title: "Trạng thái",
      key: "status",
      dataIndex: "status",
      width: 200,
      render: (v) => (<OrderStatusComp status={v} />)
    },
    {
      title: "Nơi nhận cây",
      key: "isTransport",
      dataIndex: "isTransport",
      render: (v) => (<Transport isTransport={v} />)
    },
    {
      title: "Phí vận chuyển",
      key: "transportFee",
      dataIndex: "transportFee",
      align: "right",
      width: 200,
      render: (v) => (<MoneyFormat value={v} color='Default' isHighlight />)
    },
    {
      title: "Tiền cọc",
      key: "deposit",
      dataIndex: "deposit",
      align: "right",
      width: 200,
      render: (v) => <MoneyFormat value={v} color='Yellow' isHighlight />
    },
    {
      title: 'Tiền được giảm',
      key: 'discountAmount',
      dataIndex: 'discountAmount',
      align: 'right',
      width: 200,
      render: (v) => <MoneyFormat value={v} color='Yellow' isHighlight />
    },
    {
      title: "Tổng tiền",
      key: "totalPrice",
      dataIndex: "totalPrice",
      align: "right",
      width: 200,
      render: (v) => (<MoneyFormat value={v} color='Blue' isHighlight />)
    },
    {
      title: "Tiền còn thiếu",
      key: "remainMoney",
      dataIndex: "remainMoney",
      align: "right",
      width: 200,
      fixed: "right",
      render: (v) => (<MoneyFormat value={v} color='Light Blue' isHighlight />)
    },
    {
      title: "Xử lý",
      key: "action",
      dataIndex: "action",
      align: "center",
      fixed: "right",
      render: (_, record, index) => (
        <Popover
          align={{ offset: [10, 5] }}
          content={() => contextRent(record)}
          placement="bottomRight"
          trigger="click"
          open={index === actionMethod?.openIndex}
          onOpenChange={(open: boolean) => {
            if (open) {
              setActionMethod({orderId: '', actionType: '', orderType: '', openIndex: index})
            } else {
              setActionMethod({orderId: '', actionType: '', orderType: '', openIndex: -1})
            }
          }}
        >
          <GrMore size={25} cursor="pointer" color="#00a76f" />
        </Popover>
      ),
    },
  ];
  const contextRent = (record) => {
    return (
      <div className="context-menu-wrapper">
        <div
          className="item"
          onClick={() => {
            setActionMethod({orderId: record.orderId, actionType: 'detail', orderType: 'rent', openIndex: -1})
          }}
        >
          <BiDetail size={25} className="icon" />
          <span>Chi tiết đơn hàng</span>
        </div>
        <div className="item" onClick={() => {
          handleSetAction({orderId: record.orderId, actionType: 'view transaction', orderType: 'sale', openIndex: -1})
        }}>
          <AiOutlineTransaction size={25} className='icon'/>
          <span>Xem giao dịch</span>
        </div>
        {
          (record.status === 'unpaid' && record.deposit !== 0 && record.remainMoney === record.totalPrice) &&
          <div
            className="item"
            onClick={() => {
              handleSetAction({orderId: record.orderId, actionType: 'deposit', orderType: 'rent', openIndex: -1});
            }}
          >
            <MdOutlinePayments size={25} className="icon" />
            <span>Thanh toán tiền cọc</span>
          </div>
        }
        {
          (record.status === 'ready' || record.status === 'unpaid') &&
          <div
            className="item"
            onClick={() => {
              handleSetAction({orderId: record.orderId, actionType: 'remaining', orderType: 'rent', openIndex: -1});
            }}
          >
            <MdOutlinePayment size={25} className="icon" />
            <span>Thanh toán đơn hàng</span>
          </div>
        }
        {
          (record.status === 'paid') &&
          <div className="item" onClick={() => {
            handleSetAction({orderId: record.orderId, actionType: 'renting', orderType: 'rent', openIndex: -1})
          }}>
            <VscServerProcess size={25} className='icon'/>
            <span>Đang thuê</span>
          </div>
        }
        {
          record.status === 'renting' &&
          <div className="item" onClick={() => {
              handleSetAction({orderId: record.orderId, actionType: 'return deposit', orderType: 'rent', openIndex: -1})
          }}>
            <MdOutlineKeyboardReturn size={25} className='icon'/>
            <span>Xác nhận tất toán</span>
          </div>
        }
        {
          (record.status !== 'completed' && record.status !== 'cancel') &&
          <div className="item" onClick={() => {
            handleSetAction({orderId: record.orderId, actionType: 'cancel', orderType: 'rent', openIndex: -1})
          }}>
            <MdCancelPresentation size={25} className='icon'/>
            <span>Hủy đơn hàng</span>
          </div>
        }
        {
          record.status === 'cancel' &&
          <div className="item" onClick={() => {
            handleSetAction({orderId: record.orderId, actionType: 'refund', orderType: 'rent', openIndex: -1})
          }}>
            <GiReturnArrow size={25} className='icon'/>
            <span>Hoàn tiền</span>
          </div>
        }
      </div>
    );
  };
  const handleSetAction = async (data: PaymentControlState) => {
    const { orderId, actionType } = data

    if(!groupOrder) return;

    const [order] = groupOrder.rentOrderList.filter((x) => x.id === orderId)

    if(actionType === 'deposit' && order.status !== 'unpaid'){
      return dispatch(setNoti({type: 'info', message: CONSTANT.PAYMENT_MESSAGE.PAID_DEPOSIT}))
    }
    if(actionType === 'remaining' && (order.status === 'paid' || order.status === 'completed')){
        return dispatch(setNoti({type: 'info', message: CONSTANT.PAYMENT_MESSAGE.PAID_REMAINING}))
    }

    setActionMethod(data)
  };
  const DataSourceRentOrder = useMemo(() => {
    if(!groupOrder) return ({} as any);
    const x = groupOrder.rentOrderList[groupOrder.rentOrderList.length - 1]
    return [{
      key: String(1),
      orderId: x.id,
      orderCode: x.orderCode,
      totalPrice: x.totalPrice,
      startDateRent: x.startRentDate,
      endDateRent: x.endRentDate,
      status: x.status,
      remainMoney: x.remainMoney,
      deposit: x.deposit,
      recipientName: x.recipientName,
      recipientPhone: x.recipientPhone,
      recipientAddress: x.recipientAddress,
      transportFee: x.transportFee,
      discountAmount: x.discountAmount
    }]
  }, [groupOrder]);

  const handleClose = () => {
    setActionMethod(undefined)
  };

  const handlePaymentDeposit = async (orderId: string) => {
    if(!groupOrder) return;

    const [order] = groupOrder.rentOrderList.filter((x) => x.id === orderId);

    try {
      await paymentService.depositPaymentCash(orderId, "rent");
      dispatch(setNoti({ type: "success", message: "Thanh toán cọc thành công" }));
      order.remainMoney = order.remainMoney - order.deposit
      order.status = 'ready'
      setGroupOrder({...groupOrder})
      // setRecall(true)
      handleClose();
    } catch {}
  };

  const handlePaymentCash = async (orderId: string, amount: number,) => {
    if(!groupOrder) return;

    const [order] = groupOrder.rentOrderList.filter((x) => x.id === orderId);
    const total = order.remainMoney - amount
    try {
      await paymentService.paymentCash( orderId, amount, "rent", total === 0 ? "whole" : "");
      if(total === 0){
        order.status = 'paid'
      }
      order.remainMoney = total
      setGroupOrder({...groupOrder})
      dispatch(setNoti({ type: "success", message: "Thanh toán đơn hàng thành công" }));
      // setRecall(true)
      handleClose();
    } catch {}
  };
  
  const handleCancelOrder = (reason: string, canceledBy: string) =>{
    if(!groupOrder) return;

    const [order] = groupOrder.rentOrderList.filter(x => x.id === actionMethod?.orderId)
    order.status = 'cancel'
    order.reason = reason
    order.nameCancelBy = canceledBy
    setGroupOrder({...groupOrder})
    handleClose()
  }
  const handleRefundOrder = () =>{
    handleClose()
  }
  const handleRecall = async () =>{
    const res = await orderService.getRentOrderGroup(groupId || '');
    const newRes = {...res.data}
    newRes.rentOrderList = newRes.rentOrderList.reverse()
    setGroupOrder(newRes);
  }

  const updateOrderStatus = (orderStatus: OrderStatus) =>{
    if(!groupOrder) return;

    const [order] = groupOrder.rentOrderList.filter(x => x.id === actionMethod?.orderId)
    order.status = orderStatus
    setGroupOrder({...groupOrder})
    handleClose()
  }
  const OrderDetail = useMemo(() =>{
    if(!groupOrder) return;
    const [data] = groupOrder.rentOrderList.filter(x => x.id === actionMethod?.orderId)

    const { recipientName, recipientPhone, recipientAddress, createDate, startRentDate, endRentDate, 
      status, deposit, transportFee, totalPrice, remainMoney, reason, nameCancelBy } = data

    return {
        name: recipientName,
        phone: recipientPhone,
        address: recipientAddress,
        createOrderDate: utilDateTime.dateToString(createDate.toString()),
        startDate: utilDateTime.dateToString(startRentDate.toString()),
        endDate: utilDateTime.dateToString(endRentDate.toString()),
        status: status,
        transportFee,
        totalOrder: totalPrice,
        remainMoney,
        deposit, reason, nameCancelBy
    }
}, [actionMethod, groupOrder])
  return (
    <div className="mrog-wrapper">
      <HeaderInfor title="Xem nhóm đơn hàng cho thuê" />
      <section className="mso-box default-layout">
        {
          groupOrder &&
          <Table
            rowClassName={() => 'current-order-group'}
            dataSource={DataSourceRentOrder}
            columns={ColumnRentOrder}
            pagination={false}
            scroll={{ x: 2500, y: 680 }}
          />
        }
      </section>
      {
        groupOrder && 
        <div className="default-layout">
        <section className="mrog-infor">
          <div className="infor-box">
            <div className="left">
              <HiArrowTopRightOnSquare size={20} color="#0099FF" />
              <span>Ngày tạo đơn hàng đầu tiên</span>
            </div>
            <div className="right">
              <span>
                {utilDateTime.dateToString(
                  groupOrder?.createDate?.toString() || ""
                )}
              </span>
            </div>
          </div>
          <div className="infor-box">
            <div className="left">
              <HiArrowTopRightOnSquare size={20} color="#0099FF" />
              <span>Số lượng đơn đã gia hạn</span>
            </div>
            <div className="right">
              <span>{groupOrder?.numberOfOrder}</span>
            </div>
          </div>
          <div className="infor-box">
            <div className="left">
              <HiArrowTopRightOnSquare size={20} color="#0099FF" />
              <span>Tổng tiền</span>
            </div>
            <div className="right">
              <CurrencyFormat
                className="value"
                value={groupOrder?.totalGroupAmount || 0}
                displayType={"text"}
                thousandSeparator={true}
                suffix={"VNĐ"}
              />
            </div>
          </div>
        </section>
      </div>
      }
      {
        (groupOrder && groupOrder.rentOrderList.length > 1) &&
        <ViewAllOrderGroup
          orderId={DataSourceRentOrder[0].orderId}
          recall={handleRecall}
        />
      }
      {actionMethod?.actionType === "detail" && groupOrder && (
        <ModalClientRentOrderDetai
          onClose={handleClose}
          rentOrderList={groupOrder.rentOrderList.filter(x => x.id === actionMethod.orderId)[0]}
        />
      )}
      {actionMethod?.actionType === "deposit" && groupOrder && (
        <RentOrderPaymentDeposit
          rentOrderList={groupOrder.rentOrderList.filter(x => x.id === actionMethod.orderId)[0]}
          onClose={handleClose}
          onSubmit={handlePaymentDeposit}
        />
      )}
      {actionMethod?.actionType === "remaining" && groupOrder && (
        <RentOrderPaymentCash
          rentOrderList={groupOrder.rentOrderList.filter(x => x.id === actionMethod.orderId)[0]}
          onClose={handleClose}
          onSubmit={handlePaymentCash}
        />
      )}
       {
        actionMethod?.actionType === 'return deposit' && groupOrder &&
        (<ReturnDepositRentOrder 
            rentOrderList={groupOrder.rentOrderList.filter(x => x.id === actionMethod.orderId)[0]}
            onClose={handleClose}
            onSubmit={() => updateOrderStatus('completed')}
        />)
      }
      {
        (actionMethod?.actionType === 'cancel' && groupOrder) &&
        <CancelOrder
          onClose={handleClose}
          onSubmit={handleCancelOrder}
          orderCode={groupOrder.rentOrderList.filter(x => x.id === actionMethod.orderId)[0].orderCode}
          orderId={groupOrder.rentOrderList.filter(x => x.id === actionMethod.orderId)[0].id}
          orderType='rent'
          userInforOrder={OrderDetail}
        />
      }
      {
        (actionMethod?.actionType === 'refund' && groupOrder) &&
        <RefundOrder
          orderId={groupOrder.rentOrderList.filter(x => x.id === actionMethod.orderId)[0].id}
          orderCode={groupOrder.rentOrderList.filter(x => x.id === actionMethod.orderId)[0].orderCode}
          orderType='rent'
          transactionType='rent refund'
          userInforOrder={OrderDetail}
          onClose={handleClose}
          onSubmit={handleRefundOrder}
        />
      }
      {
        (actionMethod?.actionType === 'view transaction' && groupOrder) &&
        <TransactionDetail
            orderId={groupOrder.rentOrderList.filter(x => x.id === actionMethod.orderId)[0].id}
            orderCode={groupOrder.rentOrderList.filter(x => x.id === actionMethod.orderId)[0].orderCode}
            orderType='rent'
            onClose={handleClose}
        />
      }
      {
        (actionMethod?.actionType === 'renting' && groupOrder) &&
        <Renting
          orderId={groupOrder.rentOrderList.filter(x => x.id === actionMethod.orderId)[0].id}
          orderCode={groupOrder.rentOrderList.filter(x => x.id === actionMethod.orderId)[0].orderCode}
          onClose={handleClose}
          onSubmit={() => updateOrderStatus('renting')}
        />
      }
    </div>
  );
};

// ---------------------------------------------------------------------------------------------------------------------------
interface ViewAllOrderGroupProps{
  orderId: string;
  recall: () => void;
}
const ViewAllOrderGroup: React.FC<ViewAllOrderGroupProps> = ({orderId, recall}) =>{
  console.log({orderId})
  const dispatch = useDispatch();
  const { groupId } = useParams();
  // data
  const [groupOrder, setGroupOrder] = useState<RentOrder>()

  const [actionMethod, setActionMethod] = useState<PaymentControlState>()

  useEffect(() =>{
    if(!groupId) return;
    const init = async () =>{
      const res = await orderService.getRentOrderGroup(groupId);
        const newRes = {...res.data}
        newRes.rentOrderList = newRes.rentOrderList.reverse()
        setGroupOrder(newRes);
    }
    init()
  }, [groupId])
  
  const ColumnRentOrder: ColumnsType<any> = [
    {
      title: "#",
      key: "#",
      dataIndex: "#",
      align: "center",
      width: 50,
      render: (_, v, index) => index + 1,
    },
    {
      title: "Mã đơn hàng",
      key: "orderCode",
      dataIndex: "orderCode",
      align: "center",
      width: 170,
      render: (v) => <span className="order-code">{v}</span>,
    },
    {
      title: "Thông tin khách hàng",
      key: "recipientName",
      dataIndex: "recipientName",
      width: 300,
      render: (_, record) => (
        <UserInforTable
          name={record.recipientName}
          phone={record.recipientPhone}
          address={record.recipientAddress}
        />
      ),
    },
    {
      title: "Ngày tạo đơn hàng",
      key: "createDate",
      dataIndex: "createDate",
      width: 150,
      render: (v) => utilDateTime.dateToString(v),
    },
    {
      title: "Ngày bắt đầu thuê",
      key: "startDateRent",
      dataIndex: "startDateRent",
      width: 150,
      render: (v) => utilDateTime.dateToString(v),
    },
    {
      title: "Ngày kết thúc thuê",
      key: "endDateRent",
      dataIndex: "endDateRent",
      width: 150,
      render: (v) => utilDateTime.dateToString(v),
    },
    {
      title: "Trạng thái",
      key: "status",
      dataIndex: "status",
      width: 200,
      render: (v) => (<OrderStatusComp status={v} />)
    },
    {
      title: "Nơi nhận cây",
      key: "isTransport",
      dataIndex: "isTransport",
      render: (v) => (<Transport isTransport={v} />)
    },
    {
      title: "Phí vận chuyển",
      key: "transportFee",
      dataIndex: "transportFee",
      align: "right",
      width: 200,
      render: (v) => (<MoneyFormat value={v} color='Default'  />)
    },
    {
      title: "Tiền cọc",
      key: "deposit",
      dataIndex: "deposit",
      align: "right",
      width: 200,
      render: (v) => <MoneyFormat value={v} color='Orange'  />
    },
    {
      title: 'Tiền được giảm',
      key: 'discountAmount',
      dataIndex: 'discountAmount',
      align: 'right',
      width: 200,
      render: (v) => <MoneyFormat value={v} color='Yellow'  />
    },
    {
      title: "Tổng tiền",
      key: "totalPrice",
      dataIndex: "totalPrice",
      align: "right",
      width: 200,
      render: (v) => (<MoneyFormat value={v} color='Blue'  />)
    },
    {
      title: "Tiền còn thiếu",
      key: "remainMoney",
      dataIndex: "remainMoney",
      align: "right",
      width: 200,
      render: (v) => (<MoneyFormat value={v} color='Light Blue' isHighlight />)
    },
    {
      title: "Xử lý",
      key: "action",
      dataIndex: "action",
      align: "center",
      fixed: "right",
      render: (_, record, index) => (
        <Popover
          align={{ offset: [10, 5] }}
          content={() => contextRent(record)}
          placement="bottomRight"
          trigger="click"
          open={index === actionMethod?.openIndex}
          onOpenChange={(open: boolean) => {
            if (open) {
              setActionMethod({orderId: '', actionType: '', orderType: '', openIndex: index})
            } else {
              setActionMethod({orderId: '', actionType: '', orderType: '', openIndex: -1})
            }
          }}
        >
          <GrMore size={25} cursor="pointer" color="#00a76f" />
        </Popover>
      ),
    },
  ];
  const contextRent = (record) => {
    return (
      <div className="context-menu-wrapper">
        <div
          className="item"
          onClick={() => {
            setActionMethod({orderId: record.orderId, actionType: 'detail', orderType: 'rent', openIndex: -1})
          }}
        >
          <BiDetail size={25} className="icon" />
          <span>Chi tiết đơn hàng</span>
        </div>
        <div className="item" onClick={() => {
          setActionMethod({orderId: record.orderId, actionType: 'view transaction', orderType: 'rent', openIndex: -1})
        }}>
          <AiOutlineTransaction size={25} className='icon'/>
          <span>Xem giao dịch</span>
        </div>
        {
          (record.status === 'unpaid' && record.deposit !== 0 && record.remainMoney === record.totalPrice) &&
          <div
            className="item"
            onClick={() => {
              handleSetAction({orderId: record.orderId, actionType: 'deposit', orderType: 'rent', openIndex: -1});
            }}
          >
            <MdOutlinePayments size={25} className="icon" />
            <span>Thanh toán tiền cọc</span>
          </div>
        }
        {
          (record.status === 'ready' || record.status === 'unpaid') &&
          <div
            className="item"
            onClick={() => {
              handleSetAction({orderId: record.orderId, actionType: 'remaining', orderType: 'rent', openIndex: -1});
            }}
          >
            <MdOutlinePayment size={25} className="icon" />
            <span>Thanh toán đơn hàng</span>
          </div>
        }
        {
          (record.status === 'paid') &&
          <div className="item" onClick={() => {
            handleSetAction({orderId: record.orderId, actionType: 'renting', orderType: 'rent', openIndex: -1})
          }}>
            <VscServerProcess size={25} className='icon'/>
            <span>Đang thuê</span>
          </div>
        }
        {
          record.status === 'renting' &&
          <div className="item" onClick={() => {
              handleSetAction({orderId: record.orderId, actionType: 'return deposit', orderType: 'rent', openIndex: -1})
          }}>
            <MdOutlineKeyboardReturn size={25} className='icon'/>
            <span>Xác nhận tất toán</span>
          </div>
        }
        {
          (record.status !== 'completed' && record.status !== 'cancel') &&
          <div className="item" onClick={() => {
            handleSetAction({orderId: record.orderId, actionType: 'cancel', orderType: 'rent', openIndex: -1})
          }}>
            <MdCancelPresentation size={25} className='icon'/>
            <span>Hủy đơn hàng</span>
          </div>
        }
        {
          record.status === 'cancel' &&
          <div className="item" onClick={() => {
            handleSetAction({orderId: record.orderId, actionType: 'refund', orderType: 'rent', openIndex: -1})
          }}>
            <GiReturnArrow size={25} className='icon'/>
            <span>Hoàn tiền</span>
          </div>
        }
      </div>
    );
  };
  const handleSetAction = async (data: PaymentControlState) => {
    const { orderId, actionType } = data
    if(!groupOrder) return;

    const [order] = groupOrder.rentOrderList.filter((x) => x.id === orderId)

    if(actionType === 'deposit' && order.status !== 'unpaid'){
      return dispatch(setNoti({type: 'info', message: CONSTANT.PAYMENT_MESSAGE.PAID_DEPOSIT}))
    }
    if(actionType === 'remaining' && (order.status === 'paid' || order.status === 'completed')){
        return dispatch(setNoti({type: 'info', message: CONSTANT.PAYMENT_MESSAGE.PAID_REMAINING}))
    }

    setActionMethod(data)
  };
  const DataSourceRentOrderAll = useMemo(() => {
    return groupOrder?.rentOrderList.map((x , index) => ({
      key: String(index + 1),
      orderId: x.id,
      orderCode: x.orderCode,
      totalPrice: x.totalPrice,
      startDateRent: x.startRentDate,
      endDateRent: x.endRentDate,
      status: x.status,
      remainMoney: x.remainMoney,
      deposit: x.deposit,
      recipientName: x.recipientName,
      recipientPhone: x.recipientPhone,
      recipientAddress: x.recipientAddress,
      transportFee: x.transportFee,
      discountAmount: x.discountAmount,
      createDate: x.createDate,
      isTransport: x.isTransport
    }))
  }, [groupOrder]);

  const handleClose = () => {
    setActionMethod(undefined)
  };
  const checkReCallOrder = (currentOrderId: string) =>{
    if(currentOrderId === orderId){
      recall()
    }
  }
  const handlePaymentDeposit = async (orderId: string) => {
    if(!groupOrder) return;

    const [order] = groupOrder.rentOrderList.filter((x) => x.id === orderId);

    try {
      await paymentService.depositPaymentCash(orderId, "rent");
      dispatch(setNoti({ type: "success", message: "Thanh toán cọc thành công" }));
      order.remainMoney = order.remainMoney - order.deposit
      order.status = 'ready'
      setGroupOrder({...groupOrder})
      // setRecall(true)
      handleClose();
      checkReCallOrder(order.id)
    } catch {}
  };
  const handlePaymentCash = async (orderId: string, amount: number,) => {
    if(!groupOrder) return;

    const [order] = groupOrder.rentOrderList.filter((x) => x.id === orderId);
    const total = order.remainMoney - amount
    try {
      await paymentService.paymentCash( orderId, amount, "rent", total === 0 ? "whole" : "");
      if(total === 0){
        order.status = 'paid'
      }
      order.remainMoney = total
      setGroupOrder({...groupOrder})
      dispatch(setNoti({ type: "success", message: "Thanh toán đơn hàng thành công" }));
      // setRecall(true)
      handleClose();
      checkReCallOrder(order.id)
    } catch {}
  };
  const handleCancelOrder = (reason: string) =>{
    if(!groupOrder) return;

    const [order] = groupOrder.rentOrderList.filter(x => x.id === actionMethod?.orderId)
    order.status = 'cancel'
    order.reason = reason
    setGroupOrder({...groupOrder})
    handleClose()
    checkReCallOrder(order.id)
  }

  const handleRefundOrder = () =>{
    handleClose()
  }

  const updateOrderStatus = (orderStatus: OrderStatus) =>{
    if(!groupOrder) return;

    const [order] = groupOrder.rentOrderList.filter(x => x.id === actionMethod?.orderId)
    order.status = orderStatus
    setGroupOrder({...groupOrder})
    handleClose()
    checkReCallOrder(order.id)
  }
  const OrderDetail = useMemo(() =>{
    if(!groupOrder) return {}
    const [data] = groupOrder.rentOrderList.filter(x => x.id === actionMethod?.orderId)

    const { recipientName, recipientPhone, recipientAddress, createDate, startRentDate, endRentDate, 
      status, deposit, transportFee, totalPrice, remainMoney, reason, nameCancelBy } = data

    return {
        name: recipientName,
        phone: recipientPhone,
        address: recipientAddress,
        createOrderDate: utilDateTime.dateToString(createDate.toString()),
        startDate: utilDateTime.dateToString(startRentDate.toString()),
        endDate: utilDateTime.dateToString(endRentDate.toString()),
        status: status,
        transportFee,
        totalOrder: totalPrice,
        remainMoney,
        deposit, reason, nameCancelBy
    }
}, [actionMethod, groupOrder])
  return (
    <>
      {
        (groupOrder && groupOrder.rentOrderList.length > 1) &&
        <section className="default-layout">
          <Collapse defaultActiveKey={['']}>
            <Collapse.Panel header="Xem đơn hàng gốc" key="1">
              <Table
                rowClassName={(record, index) => {
                  if(index === 0) return 'parent-order-group'
                  if(index === (groupOrder.rentOrderList.length - 1)) return 'current-order-group'
                  return ''
                }}
                dataSource={DataSourceRentOrderAll}
                columns={ColumnRentOrder}
                pagination={false}
                scroll={{ x: 2500, y: 680 }}
              />
            </Collapse.Panel>
          </Collapse>
        </section>
      }
      {actionMethod?.actionType === "detail" && groupOrder && (
        <ModalClientRentOrderDetai
          onClose={handleClose}
          rentOrderList={groupOrder.rentOrderList.filter(x => x.id === actionMethod.orderId)[0]}
        />
      )}
      {actionMethod?.actionType === "deposit" && groupOrder && (
        <RentOrderPaymentDeposit
          rentOrderList={groupOrder.rentOrderList.filter(x => x.id === actionMethod.orderId)[0]}
          onClose={handleClose}
          onSubmit={handlePaymentDeposit}
        />
      )}
      {actionMethod?.actionType === "remaining" && groupOrder && (
        <RentOrderPaymentCash
          rentOrderList={groupOrder.rentOrderList.filter(x => x.id === actionMethod.orderId)[0]}
          onClose={handleClose}
          onSubmit={handlePaymentCash}
        />
      )}
       {
        actionMethod?.actionType === 'return deposit' && groupOrder &&
        (<ReturnDepositRentOrder 
            rentOrderList={groupOrder.rentOrderList.filter(x => x.id === actionMethod.orderId)[0]}
            onClose={handleClose}
            onSubmit={() => updateOrderStatus('completed')}
        />)
      }
      {
        (actionMethod?.actionType === 'cancel' && groupOrder) &&
        <CancelOrder
          orderId={groupOrder.rentOrderList.filter(x => x.id === actionMethod.orderId)[0].id}
          orderCode={groupOrder.rentOrderList.filter(x => x.id === actionMethod.orderId)[0].orderCode}
          orderType='rent'
          onClose={handleClose}
          onSubmit={handleCancelOrder}
          userInforOrder={OrderDetail}
        />
      }
      {
        (actionMethod?.actionType === 'refund' && groupOrder) &&
        <RefundOrder
          orderId={groupOrder.rentOrderList.filter(x => x.id === actionMethod.orderId)[0].id}
          orderCode={groupOrder.rentOrderList.filter(x => x.id === actionMethod.orderId)[0].orderCode}
          orderType='rent'
          transactionType='rent refund'
          userInforOrder={OrderDetail}
          onClose={handleClose}
          onSubmit={handleRefundOrder}
        />
      }
      {
        (actionMethod?.actionType === 'view transaction' && groupOrder) &&
        <TransactionDetail
            orderId={groupOrder.rentOrderList.filter(x => x.id === actionMethod.orderId)[0].id}
            orderCode={groupOrder.rentOrderList.filter(x => x.id === actionMethod.orderId)[0].orderCode}
            orderType='rent'
            onClose={handleClose}
        />
      }
      {
        (actionMethod?.actionType === 'renting' && groupOrder) &&
        <Renting
            orderId={groupOrder.rentOrderList.filter(x => x.id === actionMethod.orderId)[0].id}
            orderCode={groupOrder.rentOrderList.filter(x => x.id === actionMethod.orderId)[0].orderCode}
            onClose={handleClose}
            onSubmit={() => updateOrderStatus('renting')}
        />
      }
    </>
  )
}

export default ManageRentOrderGroup;
