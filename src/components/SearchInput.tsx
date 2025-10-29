import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

const loadingMessages = [
  "Analizando tu consulta...",
  "Buscando los mejores recursos...",
  "Curando contenido de YouTube...",
  "Diseñando tu ruta personalizada...",
  "Casi listo..."
];

interface SearchInputProps {
  onSessionCreated?: (sessionId: string, goal: string) => void;
  disabled?: boolean;
}

const SearchInput = ({ onSessionCreated, disabled = false }: SearchInputProps) => {
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchValue.trim()) return;

    setIsLoading(true);
    setCurrentMessage(0);
    setError(null);

    // Animate through loading messages
    const interval = setInterval(() => {
      setCurrentMessage((prev) => {
        if (prev >= loadingMessages.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 1500);

    try {
      // Create session with the backend
      const response = await api.createSession(searchValue);

      // Clear the interval when we get a response
      clearInterval(interval);

      // Notify parent component
      if (onSessionCreated) {
        onSessionCreated(response.sessionId, searchValue);
      }
    } catch (err) {
      clearInterval(interval);
      console.error('Failed to create session:', err);
      setError(err instanceof Error ? err.message : 'Error al crear la sesión. Por favor intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
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
            onKeyDown={(e) => e.key === "Enter" && !isLoading && !disabled && handleSearch()}
            placeholder="¿Qué quieres aprender hoy? Ej: finanzas personales, machine learning..."
            className="flex-1 bg-transparent px-4 py-4 text-base outline-none placeholder:text-muted-foreground"
            disabled={isLoading || disabled}
          />
          <Button
            onClick={handleSearch}
            disabled={isLoading || disabled}
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

      {error && (
        <div className="flex items-center justify-center gap-2 p-4 bg-destructive/10 border border-destructive/20 rounded-lg animate-fade-in">
          <p className="text-destructive text-sm">{error}</p>
        </div>
      )}

      {!disabled && (
        <div className="flex flex-wrap gap-2 justify-center">
          <span className="text-sm text-muted-foreground">Prueba con:</span>
          {["Programación en Python", "Finanzas personales", "Marketing digital", "Fotografía"].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => setSearchValue(suggestion)}
              disabled={isLoading}
              className="text-sm px-3 py-1 rounded-full bg-secondary hover:bg-secondary/80 transition-colors text-foreground disabled:opacity-50"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchInput;
