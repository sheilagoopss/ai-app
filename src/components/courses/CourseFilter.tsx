import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface CourseFiltersProps {
  categories: string[];
  levels: string[];
  onFilterChange: (type: "category" | "level", value: string | null) => void;
}

export function CourseFilter({
  categories,
  levels,
  onFilterChange,
}: CourseFiltersProps) {
  const [openCategory, setOpenCategory] = useState(false);
  const [openLevel, setOpenLevel] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <Popover open={openCategory} onOpenChange={setOpenCategory}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openCategory}
            className="w-full justify-between sm:w-[200px]"
          >
            {selectedCategory || "Select category"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full sm:w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search category..." />
            <CommandEmpty>No category found.</CommandEmpty>
            <CommandGroup>
              {categories.map((category) => (
                <CommandItem
                  key={category}
                  onSelect={() => {
                    const value =
                      selectedCategory === category ? null : category;
                    setSelectedCategory(value);
                    setOpenCategory(false);
                    onFilterChange("category", value);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedCategory === category
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                  {category}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      <Popover open={openLevel} onOpenChange={setOpenLevel}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openLevel}
            className="w-full justify-between sm:w-[200px]"
          >
            {selectedLevel || "Select level"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full sm:w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search level..." />
            <CommandEmpty>No level found.</CommandEmpty>
            <CommandGroup>
              {levels.map((level) => (
                <CommandItem
                  key={level}
                  onSelect={() => {
                    const value = selectedLevel === level ? null : level;
                    setSelectedLevel(value);
                    setOpenLevel(false);
                    onFilterChange("level", value);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedLevel === level ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {level}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
