import type { TurboModule } from "react-native/Libraries/TurboModule/RCTExport";
import { TurboModuleRegistry } from "react-native";
import {CalendarOptions, EventDetails} from "./calendarType"

export interface Spec extends TurboModule {
  requestPermissions(): Promise<string>;
  checkPermissions() : Promise<string>;
  findCalendars(): Promise<Object>;
  saveCalendar(calendarOptions: Object): Promise<boolean> ;
  removeCalendar(id: string): Promise<string>;

  findEventById(id: string): Promise<Object | null>

  fetchAllEvents(startDate: string, endDate: string, calendarIds?: string[]): Promise<Object>;

  saveEvent(title: string, details: Object, options?: Object): Promise<String>;
  removeEvent(id: string): Promise<string>;
}

export default TurboModuleRegistry.get<Spec>("RNCalendarEvents") as Spec;

