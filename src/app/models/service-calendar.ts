import { TakeCareStatus } from "./general-type"

export interface CreateServiceCalendar{
    calendarInitial?: CalendarInitial
    calendarUpdate?: CalendarUpdate
}
export interface CreateFirstCalendarResponse{
    id: string
    serviceOrderId: string
    serviceDate: Date
    sumary: string
    status: TakeCareStatus
    images: string[]
}
export interface CreateServiceResponse{
    nextCalendar: ServiceCalendar
    previousCalendar: ServiceCalendar
}
export interface CalendarInitial {
    serviceOrderId: string
    serviceDate: string
}
  
export interface CalendarUpdate {
    serviceCalendarId: string
    nextServiceDate?: string
    images: string[]
    sumary: string
}

export interface ServiceCalendar {
    id: string
    serviceOrderId: string
    serviceDate: Date
    nextServiceDate: Date
    images: string[]
    sumary: string
    status: TakeCareStatus
}