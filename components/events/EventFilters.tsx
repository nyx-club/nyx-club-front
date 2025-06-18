import { useState, useEffect } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Filter, X, Circle, LucideIcon, Check } from "lucide-react"
import * as LucideIcons from "lucide-react"
import { EventCategoryData } from "@/types/event"

interface EventFiltersProps {
  activeFilters: string[] // Changed to store slugs
  viewMode: 'all' | 'upcoming' | 'past'
  onFilterChange: (filters: string[]) => void
  onViewModeChange: (mode: 'all' | 'upcoming' | 'past') => void
}

// Helper to check if a value is a valid Lucide icon
function isLucideComponent(value: any): value is LucideIcon {
  return typeof value === 'function' && 
    value.displayName && 
    value.displayName.startsWith('Lucide');
}

// Fetch categories from Strapi
const fetchCategories = async (): Promise<EventCategoryData[]> => {
  try {
    const res = await fetch(
      "https://nyx-club-back.onrender.com/api/categories?populate=*"
    );
    if (!res.ok) throw new Error('Failed to fetch categories');
    const { data } = await res.json();
    
    return data.map((item: any) => ({
      id: item.id,
      name: item.name,
      slug: item.slug,
      icon: item.icon,
      bgColor: item.bgColor || 'bg-gray-500/20',
      textColor: item.textColor || 'text-gray-300'
    }));
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

export default function EventFilters({
  activeFilters,
  viewMode,
  onFilterChange,
  onViewModeChange,
}: EventFiltersProps) {
  const [categories, setCategories] = useState<EventCategoryData[]>([]);

  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  const toggleFilter = (categorySlug: string) => {
    if (activeFilters.includes(categorySlug)) {
      onFilterChange(activeFilters.filter((c) => c !== categorySlug))
    } else {
      onFilterChange([...activeFilters, categorySlug])
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
              <Button 
                variant="outline" 
                className="flex-1 sm:flex-none border-[#B20118]/20 hover:bg-[#B20118]/5 hover:border-[#B20118]/40"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filtrar por categoría
                {activeFilters.length > 0 && (
                  <span className="ml-2 bg-[#B20118] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {activeFilters.length}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              className="w-56 bg-black border border-[#B20118]/20 text-white/90 rounded-lg shadow-lg py-1"
              align="end"
            >
              {categories.length > 0 ? (
                <>
                  {categories.map((category) => {
                    const isActive = activeFilters.includes(category.slug);
                    let IconComponent = Circle;
                    if (category.icon) {
                      const DynamicIcon = LucideIcons[category.icon as keyof typeof LucideIcons];
                      if (isLucideComponent(DynamicIcon)) {
                        IconComponent = DynamicIcon;
                      }
                    }
                    return (
                      <DropdownMenuCheckboxItem
                        key={category.id}
                        checked={isActive}
                        onCheckedChange={() => toggleFilter(category.slug)}
                        className={`relative flex items-center gap-4 px-4 py-2 cursor-pointer select-none outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-[#B20118]/10 focus:bg-[#B20118]/10 ${isActive ? 'bg-[#B20118]/10' : ''} border border-[#B20118]/20 rounded-md mb-1`}
                      >
                        <span className={`flex items-center justify-center w-6 h-6 rounded border-2 ${isActive ? 'border-[#B20118] bg-[#B20118]/20' : 'border-[#B20118]/40 bg-transparent'} transition-colors`}>
                          {isActive && <span className="block w-3 h-3 rounded bg-[#B20118]" />}
                        </span>
                        <IconComponent className={`w-5 h-5 ${isActive ? 'text-[#B20118]' : 'text-white/70'}`} />
                        <span className={`truncate text-base ${isActive ? 'text-[#B20118] font-semibold' : 'text-white/90 font-normal'}`}>
                          {category.name}
                        </span>
                      </DropdownMenuCheckboxItem>
                    );
                  })}
                  {activeFilters.length > 0 && (
                    <div className="pt-1 mt-1 border-t border-[#B20118]/20">
                      <button
                        onClick={clearFilters}
                        className="flex w-full items-center gap-2 px-2 py-1.5 text-[#B20118] hover:bg-[#B20118]/10 transition-colors"
                      >
                        <X className="w-4 h-4" />
                        <span>Limpiar filtros</span>
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="px-2 py-1.5 text-sm text-white/50">
                  Cargando categorías...
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
