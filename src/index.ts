import RNCalendarEvents , {Spec} from "./NativeCalendarModule"
import {AuthorizationStatus, CalendarOptions, EventDetails, Options} from "./calendarType"

  
export default class ReactNativeCalendarEvents{
    static requestPermissions(): Promise<string> {
        return RNCalendarEvents.requestPermissions()
    }
    static checkPermissions(): Promise<string> {
        return RNCalendarEvents.checkPermissions()
    }
    static findCalendars(): Promise<Object> {
        return RNCalendarEvents.findCalendars()
    }

    static saveCalendar(calendarOptions: Object): Promise<boolean> {
        return RNCalendarEvents.saveCalendar(calendarOptions)
    }

    static removeCalendar(id: string): Promise<String> {
        return RNCalendarEvents.removeCalendar(id)
    }

    static findEventById(id: string): Promise<Object | null> {
        return RNCalendarEvents.findEventById(id)
    }
 
    static fetchAllEvents(startDate: string, endDate: string, calendarIds?: string[]): Promise<Object> {
        return RNCalendarEvents.fetchAllEvents(startDate, endDate, calendarIds)
    }
    
    static saveEvent(title: string, details: Object, options?: Object): Promise<String> {
        return RNCalendarEvents.saveEvent(title, details, options)
    }

    static removeEvent(id: string): Promise<String> {
        return RNCalendarEvents.removeEvent(id)
    }

};