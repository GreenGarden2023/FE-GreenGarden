export interface CreateServiceCalendar{
    calendarInitial?: CalendarInitial
    calendarUpdate?: CalendarUpdate
}
export interface CreateServiceResponse{
    nextCalendar: ServiceCalendar
    previousCalendar: ServiceCalendar
}
export interface CalendarInitial {
    serviceOrderId: string
    serviceDate: Date
}
  
export interface CalendarUpdate {
    serviceCalendarId: string
    nextServiceDate: Date
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
    status: string
}