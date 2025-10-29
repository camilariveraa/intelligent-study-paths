import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const loadingMessages = [
  "Analizando tu consulta...",
  "Buscando los mejores recursos...",
  "Curando contenido de YouTube...",
  "Diseñando tu ruta personalizada...",
  "Casi listo..."
];

const SearchInput = () => {
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(0);

  const handleSearch = () => {
    if (!searchValue.trim()) return;
    
    setIsLoading(true);
    setCurrentMessage(0);
    
    const interval = setInterval(() => {
      setCurrentMessage((prev) => {
        if (prev >= loadingMessages.length - 1) {
          clearInterval(interval);
          setTimeout(() => setIsLoading(false), 1000);
          return prev;
        }
        return prev + 1;
      });
    }, 1500);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-primary opacity-20 blur-xl group-hover:opacity-30 transition-opacity rounded-2xl" />
        <div className="relative flex items-center gap-2 bg-card border border-border rounded-2xl p-2 transition-all duration-300 hover:border-primary/50 focus-within:border-primary/70 focus-within:shadow-glow-mixed">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="¿Qué quieres aprender hoy? Ej: finanzas personales, machine learning..."
            className="flex-1 bg-transparent px-4 py-4 text-base outline-none placeholder:text-muted-foreground"
            disabled={isLoading}
          />
          <Button
            onClick={handleSearch}
            disabled={isLoading}
            className="bg-gradient-primary text-primary-foreground font-semibold px-6 py-6 rounded-xl hover:opacity-90 transition-opacity"
          >
            <Search className="w-5 h-5 mr-2" />
            Crear Ruta
          </Button>
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center gap-3 animate-fade-in">
          <div className="flex gap-2">
            <div className="w-2 h-2 bg-malva rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <div className="w-2 h-2 bg-lavanda rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <div className="w-2 h-2 bg-cielo rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
          <p className="text-muted-foreground">{loadingMessages[currentMessage]}</p>
        </div>
      )}

      <div className="flex flex-wrap gap-2 justify-center">
        <span className="text-sm text-muted-foreground">Prueba con:</span>
        {["Programación en Python", "Finanzas personales", "Marketing digital", "Fotografía"].map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => setSearchValue(suggestion)}
            className="text-sm px-3 py-1 rounded-full bg-secondary hover:bg-secondary/80 transition-colors text-foreground"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchInput;
