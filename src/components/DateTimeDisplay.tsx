import { useEffect, useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Clock } from "lucide-react";

const DateTimeDisplay = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-2 text-primary-foreground">
      <Clock className="h-4 w-4" />
      <div className="text-sm">
        <div className="font-semibold">
          {format(currentTime, "HH:mm:ss")}
        </div>
        <div className="text-xs opacity-90">
          {format(currentTime, "EEEE d MMMM yyyy", { locale: fr })}
        </div>
      </div>
    </div>
  );
};

export default DateTimeDisplay;
