import { useEffect, useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Clock } from "lucide-react";

interface DateTimeDisplayProps {
  split?: boolean;
  type?: "time" | "date";
}

const DateTimeDisplay = ({ split = false, type }: DateTimeDisplayProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (split && type === "time") {
    return (
      <div className="flex items-center gap-2 text-primary-foreground">
        <Clock className="h-4 w-4" />
        <div className="text-sm font-semibold">
          {format(currentTime, "HH:mm:ss")}
        </div>
      </div>
    );
  }

  if (split && type === "date") {
    return (
      <div className="text-xs text-primary-foreground opacity-90">
        {format(currentTime, "EEEE d MMMM yyyy", { locale: fr })}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 text-primary-foreground">
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4" />
        <div className="text-sm font-semibold">
          {format(currentTime, "HH:mm:ss")}
        </div>
      </div>
      <div className="text-xs opacity-90">
        {format(currentTime, "EEEE d MMMM yyyy", { locale: fr })}
      </div>
    </div>
  );
};

export default DateTimeDisplay;
