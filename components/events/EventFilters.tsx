import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Filter, X } from "lucide-react"
import { EventCategory, EventFilters as EventFiltersType } from "@/types/event"
import { eventCategories } from "@/data/events"

interface EventFiltersProps {
  activeFilters: EventCategory[]
  viewMode: 'all' | 'upcoming' | 'past'
  onFilterChange: (filters: EventCategory[]) => void
  onViewModeChange: (mode: 'all' | 'upcoming' | 'past') => void
}

export default function EventFilters({
  activeFilters,
  viewMode,
  onFilterChange,
  onViewModeChange,
}: EventFiltersProps) {
  const toggleFilter = (category: EventCategory) => {
    if (activeFilters.includes(category)) {
      onFilterChange(activeFilters.filter((c) => c !== category))
    } else {
      onFilterChange([...activeFilters, category])
    }
  }

  const clearFilters = () => {
    onFilterChange([])
  }

  return (
    <div className="flex flex-col gap-4 mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Tabs 
          value={viewMode} 
          onValueChange={(value) => onViewModeChange(value as 'all' | 'upcoming' | 'past')}
          className="w-full sm:w-auto"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="upcoming">Próximos</TabsTrigger>
            <TabsTrigger value="past">Pasados</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2 w-full sm:w-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex-1 sm:flex-none">
              <Filter className="w-4 h-4 mr-2" />
              Filtrar
              {activeFilters.length > 0 && (
                <span className="ml-2 bg-[#B20118] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {activeFilters.length}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            {Object.entries(eventCategories).map(([key, category]) => {
              const isActive = activeFilters.includes(key as EventCategory);
              return (
                <DropdownMenuCheckboxItem
                  key={key}
                  checked={isActive}
                  onCheckedChange={() => toggleFilter(key as EventCategory)}
                  className="flex items-center gap-2 group"
                >
                  <div 
                    className={`w-3 h-3 rounded-full ${category.bgColor} border ${category.borderColor} ${isActive ? 'ring-2 ring-offset-2 ring-offset-background ring-foreground' : ''}`}
                    style={{ 
                      backgroundColor: isActive ? category.bgColor.replace(/^bg-\[([^\]]+)\]\/20$/, '$1') : 'transparent',
                      borderColor: category.borderColor.replace(/^border-\[([^\]]+)\]\/50$/, '$1')
                    }}
                  />
                  <span className={isActive ? 'font-medium' : ''}>
                    {category.name}
                  </span>
                </DropdownMenuCheckboxItem>
              );
            })}
            {activeFilters.length > 0 && (
              <div className="p-2 border-t border-gray-200 dark:border-gray-800">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-red-500 hover:text-red-600"
                  onClick={clearFilters}
                >
                  <X className="w-4 h-4 mr-2" />
                  Limpiar filtros
                </Button>
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      </div>

      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-400">Filtros activos:</span>
          {activeFilters.map((filter) => {
            const category = eventCategories[filter];
            return (
              <div 
                key={filter}
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${category.bgColor} ${category.borderColor} border`}
                style={{
                  color: category.borderColor.replace(/^border-\[([^\]]+)\]\/50$/, '$1')
                }}
              >
                <div 
                  className="w-2 h-2 rounded-full mr-2"
                  style={{
                    backgroundColor: category.borderColor.replace(/^border-\[([^\]]+)\]\/50$/, '$1')
                  }}
                />
                {category.name}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFilter(filter);
                  }}
                  className="ml-2 hover:opacity-80"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
          <button
            onClick={clearFilters}
            className="text-sm text-gray-400 hover:text-white transition-colors ml-2"
          >
            Limpiar todo
          </button>
        </div>
      )}
    </div>
  )
}
