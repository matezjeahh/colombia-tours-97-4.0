"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SelectTour({ data, setSelectedItem }) {
  const handleSelectChange = (value) => {
    const item = data.find((item) => item.id === value);
    setSelectedItem(item);
  };

  return (
    <div className="container my-10 space-y-10">
      <Select onValueChange={handleSelectChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Válassz egy utat" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Utazások</SelectLabel>
            {data.map((item) => (
              <SelectItem key={item.id} value={item.id}>
                {item.cim} {/* Assuming each document has a 'cim' field */}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
