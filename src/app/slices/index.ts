import notification from "./notification";
import windowTitle from './window-title'
import userInfor from "./user-infor";
import adminLayout from "./admin-layout";
import CartStore from './cart'
import FilterStore from './filter'
import SearchFilter from './search-and-filter'

const slices = {
    notification,
    windowTitle,
    userInfor,
    adminLayout,
    CartStore,
    FilterStore,
    SearchFilter
}

export default slices;