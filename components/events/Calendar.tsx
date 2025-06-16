import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns"
import { es } from "date-fns/locale"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

type CalendarProps = {
  currentMonth: Date
  onMonthChange: (date: Date) => void
  onDayClick: (day: Date) => void
  events: { date: Date }[]
  selectedDate: Date | null
}

export default function Calendar({
  currentMonth,
  onMonthChange,
  onDayClick,
  events,
  selectedDate,
}: CalendarProps) {
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const prevMonth = () => {
    onMonthChange(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    onMonthChange(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const hasEvents = (day: Date) => {
    return events.some((event) => isSameDay(event.date, day))
  }

  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="icon" onClick={prevMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h3 className="text-lg font-semibold">
          {format(currentMonth, 'MMMM yyyy', { locale: es })}
        </h3>
        <Button variant="ghost" size="icon" onClick={nextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'].map((day) => (
          <div key={day} className="text-center text-sm text-gray-400">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {daysInMonth.map((day) => {
          const dayHasEvents = hasEvents(day)
          const isSelected = selectedDate && isSameDay(day, selectedDate)
          
          return (
            <button
              key={day.toString()}
              onClick={() => onDayClick(day)}
              className={`
                aspect-square rounded-md text-sm transition-colors
                ${isSelected 
                  ? 'bg-[#B20118] text-white' 
                  : dayHasEvents 
                    ? 'bg-gray-800 hover:bg-gray-700 text-white' 
                    : 'hover:bg-gray-800/50 text-gray-300'}
                ${format(currentMonth, 'MM') !== format(day, 'MM') ? 'opacity-30' : ''}
              `}
            >
              {format(day, 'd')}
            </button>
          )
        })}
      </div>
    </div>
  )
}
