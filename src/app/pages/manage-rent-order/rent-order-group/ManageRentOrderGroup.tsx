import { Popover } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import HeaderInfor from "app/components/header-infor/HeaderInfor";
import CancelOrder from "app/components/modal/cancel-order/CancelOrder";
import ModalClientRentOrderDetai from "app/components/modal/client-rent-order-detail/ModalClientRentOrderDetai";
import RefundOrder from "app/components/modal/refundOrder.tsx/RefundOrder";
import RentOrderPaymentCash from "app/components/modal/rent-oder-payment-cash/RentOrderPaymentCash";
import RentOrderPaymentDeposit from "app/components/modal/rent-order-payment-deposit/RentOrderPaymentDeposit";
import ReturnDepositRentOrder from "app/components/modal/return-deposit-rent-order/ReturnDepositRentOrder";
import MoneyFormat from "app/components/money/MoneyFormat";
import UserInforTable from "app/components/user-infor/UserInforTable";
import useDispatch from "app/hooks/use-dispatch";
import { RentOrder } from "app/models/order";
import { PaymentControlState } from "app/models/payment";
import { OrderStatusToTag } from "app/pages/manage-take-care-order/ManageTakeCareOrder";
import orderService from "app/services/order.service";
import paymentService from "app/services/payment.service";
import { setNoti } from "app/slices/notification";
import CONSTANT from "app/utils/constant";
import utilDateTime from "app/utils/date-time";
import pagingPath from "app/utils/paging-path";
import React, { useEffect, useMemo, useState } from "react";
import CurrencyFormat from "react-currency-format";
import { BiDetail } from "react-icons/bi";
import { GiReturnArrow } from "react-icons/gi";
import { GrMore } from "react-icons/gr";
import { HiArrowTopRightOnSquare } from "react-icons/hi2";
import { MdOutlinePayments } from "react-icons/md";
import { RiBillLine } from "react-icons/ri";
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
        setGroupOrder(res.data);
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
      render: (v) => (OrderStatusToTag(v))
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
        {
          (record.status === 'unpaid') &&
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
            <RiBillLine size={25} className="icon" />
            <span>Thanh toán đơn hàng</span>
          </div>
        }
        {
          record.status === 'completed' &&
          <div className="item" onClick={() => {
              handleSetAction({orderId: record.orderId, actionType: 'return deposit', orderType: 'rent', openIndex: -1})
          }}>
            <GiReturnArrow size={25} className='icon'/>
            <span>Xác nhận hoàn cọc</span>
          </div>
        }
        {
          (record.status !== 'completed' && record.status !== 'cancel') &&
          <div className="item" onClick={() => {
            handleSetAction({orderId: record.orderId, actionType: 'cancel', orderType: 'rent', openIndex: -1})
          }}>
            <GiReturnArrow size={25} className='icon'/>
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
    return groupOrder?.rentOrderList.map((x, index) => ({
      key: String(index + 1),
      orderId: x.id,
      orderCode: x.orderCode,
      totalPrice: x.totalPrice,
      startDateRent: x.startDateRent,
      endDateRent: x.endDateRent,
      status: x.status,
      remainMoney: x.remainMoney,
      deposit: x.deposit,
      recipientName: x.recipientName,
      recipientPhone: x.recipientPhone,
      recipientAddress: x.recipientAddress,
      transportFee: x.transportFee,
      discountAmount: x.discountAmount
    }));
  }, [groupOrder]);

  

  const handleClose = () => {
    setActionMethod(undefined)
  };

  const handlePaymentDeposit = async (orderId: string) => {
    try {
      await paymentService.depositPaymentCash(orderId, "rent");
      dispatch(
        setNoti({ type: "success", message: "Thanh toán cọc thành công" })
      );
      setRecall(true)
      handleClose();
    } catch {}
  };

  const handlePaymentCash = async (
    orderId: string,
    amount: number,
    isFull: boolean
  ) => {
    if (!isFull && amount < 1000) {
      dispatch(
        setNoti({
          type: "error",
          message: "Số tiền nhập vào ít nhất là 1.000 VNĐ",
        })
      );
      return;
    }

    console.log(groupOrder);
    console.log(orderId);
    try {
      const order = groupOrder?.rentOrderList.filter(
        (x) => x.id === orderId
      )[0];
      let amountOrder = 0;
      if (isFull) {
        amountOrder = order?.remainMoney || 0;
      } else {
        amountOrder = amount;
      }
      await paymentService.paymentCash(
        orderId,
        amountOrder,
        "rent",
        order?.status === "unpaid" ? "whole" : ""
      );
      dispatch(
        setNoti({ type: "success", message: "Thanh toán đơn hàng thành công" })
      );
      setRecall(true)
      handleClose();
    } catch {}
  };
  const handleReturnDeposit = (rentOrderListId: string) =>{
    if(!groupOrder) return;

    const index = groupOrder.rentOrderList.findIndex(x => x.id === rentOrderListId)
    groupOrder.rentOrderList[index].status = 'completed'
    setGroupOrder({...groupOrder})
    handleClose()
  }
  const handleCancelOrder = () =>{
    if(!groupOrder) return;

    const [order] = groupOrder.rentOrderList.filter(x => x.id === actionMethod?.orderId)
    order.status = 'cancel'
    setGroupOrder({...groupOrder})
    handleClose()
  }
  const handleRefundOrder = () =>{
    handleClose()
  }
  return (
    <div className="mrog-wrapper">
      <HeaderInfor title="Xem nhóm đơn hàng cho thuê" />
      <section className="mso-box default-layout">
        <Table
          dataSource={DataSourceRentOrder}
          columns={ColumnRentOrder}
          pagination={false}
          scroll={{ x: 2200, y: 680 }}
        />
      </section>
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
              <span>Số lượng đơn gia hạn</span>
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
            onSubmit={handleReturnDeposit}
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
        />
      }
      {
        (actionMethod?.actionType === 'refund' && groupOrder) &&
        <RefundOrder
          onClose={handleClose}
          onSubmit={handleRefundOrder}
          orderCode={groupOrder.rentOrderList.filter(x => x.id === actionMethod.orderId)[0].orderCode}
          orderId={groupOrder.rentOrderList.filter(x => x.id === actionMethod.orderId)[0].id}
          orderType='rent'
        />
      }
    </div>
  );
};

export default ManageRentOrderGroup;
