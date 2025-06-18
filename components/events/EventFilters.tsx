import { useState, useEffect } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Filter, X, Circle, LucideIcon } from "lucide-react"
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
    <section className="w-full space-y-6">
      <div className="flex flex-col gap-6 w-full">
        {/* View Mode Tabs */}
        <div className="w-full">
          <h3 className="text-sm font-medium text-white/80 mb-2">Ver eventos</h3>
          <Tabs 
            value={viewMode} 
            onValueChange={(value) => onViewModeChange(value as 'all' | 'upcoming' | 'past')}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3 bg-black/20 border border-[#B20118]/30 rounded-lg p-1 h-auto">
              <TabsTrigger 
                value="all" 
                className="py-2.5 text-sm font-medium transition-colors hover:bg-[#B20118]/10 data-[state=active]:bg-[#B20118] data-[state=active]:text-white"
              >
                Todos
              </TabsTrigger>
              <TabsTrigger 
                value="upcoming" 
                className="py-2.5 text-sm font-medium transition-colors hover:bg-[#B20118]/10 data-[state=active]:bg-[#B20118] data-[state=active]:text-white"
              >
                Próximos
              </TabsTrigger>
              <TabsTrigger 
                value="past" 
                className="py-2.5 text-sm font-medium transition-colors hover:bg-[#B20118]/10 data-[state=active]:bg-[#B20118] data-[state=active]:text-white"
              >
                Pasados
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Category Filter Dropdown (hidden)
        <div className="w-full">
          <h3 className="text-sm font-medium text-white/80 mb-2">Filtrar por categoría</h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full justify-between bg-black/20 border-[#B20118]/30 hover:bg-[#B20118]/10 hover:border-[#B20118]/40 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors text-white/90 hover:text-white"
              >
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  <span>Categorías</span>
                </div>
                {activeFilters.length > 0 && (
                  <span className="bg-[#B20118] text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                    {activeFilters.length}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent 
              className="w-72 bg-black/95 backdrop-blur-sm border border-[#B20118]/30 text-white/90 rounded-lg shadow-xl overflow-hidden py-2 mt-1.5"
              align="end"
              sideOffset={8}
            >
              <DropdownMenuLabel className="px-4 py-2 text-sm font-medium text-white/80 flex items-center justify-between">
                <span>Filtrar por categoría</span>
                {activeFilters.length > 0 && (
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      clearFilters();
                    }}
                    className="text-xs text-[#B20118] hover:text-[#ff2b4a] transition-colors flex items-center gap-1"
                  >
                    <X className="w-3 h-3" />
                    Limpiar
                  </button>
                )}
              </DropdownMenuLabel>
              
              <div className="max-h-[300px] overflow-y-auto px-1 py-1">
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
                          className={`group relative flex items-center gap-3 px-3 py-2.5 mx-1 rounded-md cursor-pointer select-none outline-none transition-colors ${
                            isActive 
                              ? `bg-black ${category.textColor || 'text-[#B20118]'}`
                              : 'hover:bg-gray-900/80 text-white/90 hover:text-white'
                          }`}
                          style={{
                            color: isActive ? (category.textColor || '#B20118') : undefined,
                            backgroundColor: isActive ? 'rgba(0, 0, 0, 0.9)' : undefined
                          }}
                        >
                          <div className={`flex items-center justify-center w-5 h-5`}>
                            {isActive && (
                              <div 
                                className="w-2.5 h-2.5 rounded-sm" 
                                style={{
                                  backgroundColor: category.textColor || '#B20118'
                                }}
                              />
                            )}
                          </div>
                          
                          <IconComponent 
                            className={`w-4 h-4 flex-shrink-0 ${
                              isActive 
                                ? category.textColor || 'text-[#B20118]' 
                                : 'text-white/60 group-hover:text-white/80'
                            }`} 
                            style={{
                              color: isActive ? (category.textColor || '#B20118') : undefined
                            }}
                          />
                          
                          <span 
                            className={`truncate text-sm font-medium ${
                              isActive 
                                ? category.textColor || 'text-[#B20118]' 
                                : 'text-white/90 group-hover:text-white'
                            }`}
                          >
                            {category.name}
                          </span>
                        </DropdownMenuCheckboxItem>
                      );
                    })}
                  </>
                ) : (
                  <div className="px-4 py-3 text-center text-sm text-white/50">
                    Cargando categorías...
                  </div>
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        */}
      </div>
    </section>
  );
}
